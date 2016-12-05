module Shopie.Interpreter.ShopieM where

import Shopie.Prelude

import Control.Applicative.Free (hoistFreeAp, retractFreeAp)
import Control.Coroutine as Co
import Control.Monad.Aff (Aff, forkAff, attempt, later')
import Control.Monad.Aff.AVar (AffAVar)
import Control.Monad.Aff.Class (liftAff)
import Control.Monad.Aff.Bus as Bus
import Control.Monad.Aff.Unsafe (unsafeCoerceAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Clock as CL
import Control.Monad.Eff.Exception (Error, error)
import Control.Monad.Eff.Random as RD
import Control.Monad.Eff.Ref (Ref, readRef, writeRef)
import Control.Monad.Eff.Storage as EFS
import Control.Monad.Free (foldFree)
import Control.Monad.Fork (fork)
import Control.Monad.Reader (ReaderT, runReaderT)

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (decodeJson)
import Data.DateTime.Instant (unInstant)
import Data.FormURLEncoded (FormURLEncoded, fromArray)
import Data.HTTP.Method (Method(POST, GET))
import Data.Int as Int
import Data.List as L

import Network.JsonApi.Document as JD
import Network.JsonApi.Resource (fromResource)
import Network.HTTP.Affjax as AJ
import Network.HTTP.Affjax.Request (class Requestable)
import Network.HTTP.RequestHeader (RequestHeader(RequestHeader))

import Shopie.Ajax (defaultRequestAuth, defaultRequestApi)
import Shopie.Auth.Types (AuthResult(..), BearerToken(..), Creds(..), Oauth2Client,
                          UserId(..))
import Shopie.ShopieM (AuthF(..), AuthMessage(..), ShopieF(..), ShopieM(..),
                       ShopieAp(..), Draad(..), ShopieEffects)
import Shopie.ShopieM.ForkF as SF
import Shopie.User.Model as UM

runShopieM
  :: forall eff
  .  Draad
  -> ShopieM Draad (Aff (ShopieEffects eff))
  ~> Aff (ShopieEffects eff)
runShopieM d sh = runReaderT (evalShopieM sh) d

evalShopieM
  :: forall eff
  .  ShopieM Draad (Aff (ShopieEffects eff))
  ~> ReaderT Draad (Aff (ShopieEffects eff))
evalShopieM (ShopieM m') = foldFree go m'
  where
    go :: ShopieF Draad (Aff (ShopieEffects eff)) ~> ReaderT Draad (Aff (ShopieEffects eff))
    go = case _ of
      AuthSF au ->
        evalAuthF au
      Lift eff ->
        lift eff
      Notify ntf next -> do
        Draad { notify } <- ask
        lift $ Bus.write ntf notify
        pure next
      Halt _ a ->
        pure a
      Par (ShopieAp p) ->
        sequential $ retractFreeAp $ hoistFreeAp (parallel <<< evalShopieM) p
      Fork f ->
        goFork f
      Ask f ->
        f <$> ask

evalAuthF :: forall eff. AuthF ~> ReaderT Draad (Aff (ShopieEffects eff))
evalAuthF = case _ of
  Authenticate cr k -> do
    Draad { apiEndpoint, oauth2b, auth, tokenAuth, userInfo } <- ask
    oauth2b' <- liftEff $ readRef oauth2b
    res <- liftAff $ map normalizeExpiration <$> attemptLogin cr oauth2b'
    case res of
      Right atok' -> do
        lift $ liftAff $ do
          liftEff $ writeRef tokenAuth (Just atok')
          liftEff $ EFS.setLocalStorage "shopie:auth-storage" atok'
          endP <- liftEff $ readRef apiEndpoint
          mui <- fetchCurrentUser endP atok'
          liftEff $ writeRef userInfo mui
          Bus.write AuthSuccess auth
          forkAff $ Co.runProcess $
            Co.connect (scheduleRefreshP oauth2b' atok') (refreshTokC tokenAuth)
        pure $ k $ Authenticated "authenticated success"
      Left er -> do
        lift $ liftAff $ do
          liftEff $ writeRef tokenAuth Nothing
          Bus.write AuthFailure auth
        pure $ k $ ServerError "authenticated failure"
  MaybeAuthId g -> do
    Draad { userInfo } <- ask
    info <- liftEff $ readRef userInfo
    case info of
      Just _ ->
        pure $ g info
      Nothing -> do
        ses' <- liftEff $ restoreSess "shopie:auth-storage"
        either (const (pure $ g Nothing)) (maybeAuthIdFromSes g) ses'
  Invalidate k -> do
    Draad { tokenAuth, auth, userInfo } <- ask
    tok' <- liftEff $ readRef tokenAuth
    when (isJust tok') $ do
      lift $ liftAff $ do
        liftEff $ writeRef tokenAuth Nothing
        Bus.write InvalidateRequest auth
    user' <- liftEff $ readRef userInfo
    when (isJust user') $ do
      liftEff $ writeRef userInfo Nothing
      liftEff $ EFS.removeLocalStorage "shopie:auth-storage"
    pure $ k $ Invalidated "invalidated success!"
  Forgotten em next -> do
    Draad { auth, tokenAuth, apiEndpoint } <- ask
    tok' <- liftEff $ readRef tokenAuth
    when (isNothing tok') $ do
      lift $ liftAff $ do
        endP <- liftEff $ readRef apiEndpoint
        em `submitForget` endP >>= handleForgetResult auth
    pure next

  where
    restoreSess :: String -> Eff (ShopieEffects eff) (Either Error BearerToken)
    restoreSess s = lmap error <$> EFS.getLocalStorage s

maybeAuthIdFromSes
  :: forall a eff
   . (Maybe UserId -> a)
  -> BearerToken
  -> ReaderT Draad (Aff (ShopieEffects eff)) a
maybeAuthIdFromSes k bt@(BearerToken tok) = do
  Draad { apiEndpoint, userInfo, oauth2b, tokenAuth } <- ask
  oauth2b' <- liftEff $ readRef oauth2b
  dn <- liftEff $ map (unwrap <<< unInstant) CL.now
  if tok.expiresIn < dn
    then do
      rtok <- liftAff $ refreshTokenR oauth2b' bt
      either (const (pure (k Nothing))) (maybeAuthIdFromSes k) rtok
    else do
      endP <- liftEff $ readRef apiEndpoint
      mui <- liftAff $ fetchCurrentUser endP bt
      liftEff $ writeRef userInfo mui
      when (isJust mui) $ do
        liftAff $ forkAff $ Co.runProcess $
          Co.connect (scheduleRefreshP oauth2b' bt) (refreshTokC tokenAuth)
        pure unit
      pure (k mui)

attemptLogin
  :: forall eff
  .  Creds
  -> Oauth2Client
  -> Aff (ShopieEffects eff) (Either Error BearerToken)
attemptLogin (Creds c) o = runExceptT do
  res <- ExceptT $ postJson_ (o.endpoint <> "/") body
  except $ lmap error (decodeJson res)
  where
    body :: Maybe FormURLEncoded
    body = Just $ fromArray [ Tuple "username" c.email
                            , Tuple "password" c.passwords
                            , Tuple "grant_type" (Just "password")
                            , Tuple "client_id" (Just o.clientId)
                            , Tuple "client_secret" (Just o.clientSecret)
                            ]

submitForget
  :: forall eff
  .  String
  -> String
  -> Aff (ajax :: AJ.AJAX | eff) (Either Error Json)
submitForget em url = postJson_ (url <> "/users/passwordreset/") $ body
  where
    body :: Maybe FormURLEncoded
    body  = Just $ fromArray [ Tuple "email" (Just em) ]

handleForgetResult
  :: forall e a eff
   . Bus.BusRW AuthMessage
  -> (Either e a)
  -> AffAVar eff Unit
handleForgetResult auth =
  either
    (\_ -> Bus.write ForgotRequestFailure auth)
    (\_ -> Bus.write ForgotRequestSuccess auth)

-- | Hardcoded, need to revisit later
postJson_
  :: forall eff c
  .  Requestable c
  => AJ.URL
  -> Maybe c
  -> Aff (ajax :: AJ.AJAX | eff) (Either Error Json)
postJson_ u c = attempt $ (_.response) <$> aj
  where
  aj :: AJ.Affjax eff Json
  aj = AJ.affjax $ defaultRequestAuth { method = Left POST, url = u, content = c }

fetchCurrentUser
  :: forall eff. String
  -> BearerToken
  -> Aff (ajax :: AJ.AJAX | eff) (Maybe UserId)
fetchCurrentUser url (BearerToken tok) = do
  res <- attempt ((_.response) <$> req)
  let dec = (lmap error <<< decodeJson =<< res) :: Either Error (JD.Document UM.UserAttributes)
      us = map (UserId <<< fromMaybe "" <<< fst <<< unwrap) <<< decodeU <$> dec
  pure $ either (const Nothing) id us
  where
    bearerH = [ RequestHeader "Authorization" (tok.accessToken) ]

    decodeU :: JD.Document UM.UserAttributes -> Maybe (UM.User UM.UserAttributes)
    decodeU = map fromResource <<< L.head <<< (_.resources) <<< JD.unDocument

    req :: AJ.Affjax eff Json
    req = AJ.affjax $ defaultRequestApi
      { method = Left GET
      , url = url <> "/users/me/"
      , headers = defaultRequestApi.headers <> bearerH
      }

refreshTokenR
  :: forall eff
   . Oauth2Client
  -> BearerToken
  -> Aff (ajax :: AJ.AJAX | eff) (Either Error BearerToken)
refreshTokenR oa (BearerToken tok) = runExceptT do
  let body = Just $ fromArray $ [ Tuple "grant_type" (Just "refresh_token")
                                , Tuple "refresh_token" (Just tok.refreshToken)
                                , Tuple "client_id" (Just oa.clientId)
                                , Tuple "client_secret" (Just oa.clientSecret)
                                ]
  res <- ExceptT $ postJson_ (oa.endpoint <> "/") body
  except $ bimap error normalizeExpiration (decodeJson res)

-- | loop for refresh token
scheduleRefreshP
  :: forall eff
   . Oauth2Client
  -> BearerToken
  -> Co.Producer BearerToken (Aff (ShopieEffects eff)) Unit
scheduleRefreshP oa t = go t
  where
    go bt@(BearerToken token) = do
      n <- lift $ liftEff $ map (unwrap <<< unInstant) CL.now
      offset <- lift $ liftEff $ map callCulateOffset RD.random
      if token.expiresIn > (n - offset)
        then do
          let expiresAt = Int.floor (token.expiresIn - n - offset)
          lift $ later' expiresAt (pure unit)
          res <- lift $ refreshTokenR oa bt
          either (const (pure unit)) (\bt' -> Co.emit bt' *> go bt') res
        else pure unit

    callCulateOffset :: Number -> Number
    callCulateOffset r = (r * 5.00 + 5.00) * 1000.00

refreshTokC
  :: forall eff
   . Ref (Maybe BearerToken)
  -> Co.Consumer BearerToken (Aff (ShopieEffects eff)) Unit
refreshTokC ref = forever do
  t <- Co.await
  lift $ liftEff $ writeRef ref (Just t)
  lift $ liftEff $ EFS.setLocalStorage "shopie:auth-storage" t
  pure Nothing

normalizeExpiration :: BearerToken -> BearerToken
normalizeExpiration (BearerToken to) =
  BearerToken $ to { expiresIn = normalizeExp $ to.expiresIn }

goFork
  :: forall eff
  .  SF.Fork (ShopieM Draad (Aff (ShopieEffects eff)))
  ~> ReaderT Draad (Aff (ShopieEffects eff))
goFork = SF.unFork \(SF.ForkF fx k) ->
  ask >>= \d -> k <<< map unsafeCoerceAff <$> lift (fork (runShopieM d fx))

foreign import normalizeExp :: Number -> Number
