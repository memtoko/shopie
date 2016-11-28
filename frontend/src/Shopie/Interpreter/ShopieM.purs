module Shopie.Interpreter.ShopieM where

import Prelude

import Control.Applicative.Free (hoistFreeAp, retractFreeAp)
import Control.Monad.Aff (Aff, attempt, forkAff)
import Control.Monad.Aff.Class (liftAff)
import Control.Monad.Aff.Bus as Bus
import Control.Monad.Aff.Unsafe (unsafeCoerceAff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Exception (Error, error)
import Control.Monad.Eff.Ref (readRef, writeRef)
import Control.Monad.Free (foldFree)
import Control.Monad.Fork (fork)
import Control.Monad.Trans.Class (lift)
import Control.Monad.Reader (ReaderT, runReaderT, ask)
import Control.Parallel (parallel, sequential)

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (decodeJson)
import Data.Bifunctor (lmap)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..), isNothing, isJust)
import Data.HTTP.Method (Method(POST))
import Data.FormURLEncoded (fromArray, encode)
import Data.Tuple (Tuple(..))

import Network.HTTP.Affjax as AJ

import Shopie.Ajax (defaultRequestAuth)
import Shopie.Auth.Types (AuthResult(..), BearerToken(..), Creds(..), Oauth2Client)
import Shopie.Draad (Draad(..))
import Shopie.Effects (ShopieEffects)
import Shopie.Query.ForkF as SF
import Shopie.Query.AuthF (AuthF(..), AuthMessage(..))
import Shopie.Query.ShopieM (ShopieF(..), ShopieM(..), ShopieAp(..))


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
        case au of
          Authenticate cr k -> do
            Draad drad <- ask
            oauth2b <- liftEff $ readRef drad.oauth2b
            res <- liftAff $ attemptLogin cr oauth2b
            case res of
              Right r -> do
                lift $ liftAff $ do
                  liftEff $ writeRef drad.tokenAuth (Just (normalizeExpiration r))
                  Bus.write AuthSuccess drad.auth
                pure $ k $ Authenticated "authenticated success"
              Left er -> do
                lift $ liftAff $ do
                  liftEff $ writeRef drad.tokenAuth Nothing
                  Bus.write AuthFailure drad.auth
                pure $ k $ ServerError "authenticated failure"
          GetAuthId _ g -> do
            Draad { userInfo } <- ask
            info <- liftEff $ readRef userInfo
            pure $ g info
          Invalidate k -> do
            Draad drad <- ask
            tok' <- lift $ liftEff $ readRef drad.tokenAuth
            when (isJust tok') $ do
              lift $ liftAff $ do
                liftEff $ writeRef drad.tokenAuth Nothing
                Bus.write InvalidateRequest drad.auth
            pure $ k $ Invalidated "invalidated success!"
          Forgotten em next -> do
            Draad drad <- ask
            tok' <- lift $ liftEff $ readRef drad.tokenAuth
            when (isNothing tok') $ do
              lift $ liftAff $ do
                endP <- liftEff $ readRef drad.apiEndpoint
                submitForget em endP
                Bus.write ForgotRequestSuccess drad.auth
            pure next
      Lift eff ->
        lift eff
      Notify ntf next -> do
        Draad drad <- ask
        lift $ Bus.write ntf drad.notify
        pure next
      Halt _ a ->
        pure a
      Par (ShopieAp p) ->
        sequential $ retractFreeAp $ hoistFreeAp (parallel <<< evalShopieM) p
      Fork f ->
        goFork f
      Ask f ->
        f <$> ask

attemptLogin
  :: forall eff
  .  Creds
  -> Oauth2Client
  -> Aff (ShopieEffects eff) (Either Error BearerToken)
attemptLogin (Creds c) o = do
  res <- postJson_ o.endpoint body
  pure $ (lmap error <<< decodeJson) =<< res
  where
    body :: Maybe String
    body = Just $ encode (fromArray [ Tuple "username" c.email
                                    , Tuple "password" c.passwords
                                    , Tuple "grant_type" (Just "passwords")
                                    , Tuple "client_id" (Just o.clientId)
                                    , Tuple "client_secret" (Just o.clientSecret)
                                    ])

submitForget
  :: forall eff
  .  String
  -> String
  -> Aff (ajax :: AJ.AJAX | eff) Unit
submitForget em url = do
  forkAff $ attempt (AJ.post_ url body)
  pure unit
  where
    body :: String
    body = encode (fromArray [ Tuple "email" (Just em)
                             ])

-- | Hardcoded, need to revisit later
postJson_
  :: forall eff
  .  AJ.URL
  -> Maybe String
  -> Aff (ajax :: AJ.AJAX | eff) (Either Error Json)
postJson_ u c = attempt $ (_.response) <$> aj
  where
  aj :: AJ.Affjax eff Json
  aj = AJ.affjax $ defaultRequestAuth { method = Left POST, url = u, content = c }

normalizeExpiration :: BearerToken -> BearerToken
normalizeExpiration (BearerToken to) =
  BearerToken $ to { expiresIn = normalizeExp $ to.expiresIn }

goFork
  :: forall eff
  .  SF.Fork (ShopieM Draad (Aff (ShopieEffects eff)))
  ~> ReaderT Draad (Aff (ShopieEffects eff))
goFork = SF.unFork \(SF.ForkF fx k) -> do
  r <- ask
  k <<< map unsafeCoerceAff <$> lift (fork (runShopieM r fx))

foreign import normalizeExp :: Number -> Number
