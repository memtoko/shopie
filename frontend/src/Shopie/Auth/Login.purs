module Shopie.Auth.Login where

import Shopie.Prelude

import Control.Applicative.Lift (Errors, runErrors)
import Control.Error.Util (recoverM, censorMF)
import Control.Monad.Aff (later')
import Control.Monad.Aff.Bus as Bus

import Data.Map as M
import Data.Time.Duration (Milliseconds(..))

import Halogen as H
import Halogen.HTML.Indexed as HH
import Halogen.HTML.Properties.Indexed as HP
import Halogen.HTML.Events.Indexed as HE

import Shopie.Auth.Types (AuthResult(..), Email, Passwords, authenticate, passwordCreds)
import Shopie.Button.Spinner (SpinnerS, SpinnerQuery(..), SpinnerSlot(..),
                              spinner, mkSpinner)
import Shopie.ShopieM (class NotifyQ, AuthMessage(..), Draad(..), ShopieEffects, ShopieMoD,
                       error, forgotten, info)
import Shopie.Validation as SV


data LoginQuery a
  = UpdateEmail Email a
  | UpdatePasswords Passwords a

-- | Synonim for errors Map, the key part is the field name and value part is
-- | error message.
type FieldError = M.Map String String

type LoginState =
  { email :: Maybe Email
  , passwords :: Maybe Passwords
  , errors :: FieldError
  }

-- | Initial state of `authLogin` component.
initialState :: LoginState
initialState =
  { email: Nothing
  , passwords: Nothing
  , errors: M.empty
  }

-- | Synonim for ParentState used here
type LoginSP g = H.ParentState LoginState SpinnerS LoginQuery SpinnerQuery (ShopieMoD g) SpinnerSlot

-- | Synonim for Component Query used here
type LoginQP = Coproduct LoginQuery (H.ChildF SpinnerSlot SpinnerQuery)

-- | Synonim for our Component DSL
type LoginDSL g = H.ParentDSL LoginState SpinnerS LoginQuery SpinnerQuery (ShopieMoD g) SpinnerSlot

-- | Our HTML output
type LoginHTML g = H.ParentHTML SpinnerS LoginQuery SpinnerQuery (ShopieMoD g) SpinnerSlot

-- | login Component
authLogin
  :: forall g e
  .  (Affable (ShopieEffects e) g)
  => H.Component (LoginSP g) LoginQP (ShopieMoD g)
authLogin = H.parentComponent { render, eval, peek: Just peek }

-- | The Component render function
render :: forall g. LoginState -> LoginHTML g
render st = wrapper st.errors $ loginForm st

-- | The wrapper HTML, used so we don't nested the declaration of actual login
-- | form. This extra wrapper necessary just for styling purpose
wrapper :: forall p i. M.Map String String -> H.HTML p i -> H.HTML p i
wrapper m html =
  HH.div
    [ HP.class_ $ HH.className "sh-flow" ]
    [ HH.div
        [ HP.class_ $ HH.className "sh-flow-content-wrap" ]
        [ HH.div
            [ HP.class_ $ HH.className "sh-flow-content" ]
            [ html
            , HH.ul
                [ HP.class_ $ HH.className "main-error" ]
                (map renderError $ M.toUnfoldable m)
            ]
        ]
    ]
  where
    renderError :: Tuple String String -> H.HTML p i
    renderError (Tuple l msg) = HH.li_ [ HH.text $ l <> ": " <> msg ]

-- | The actual HTML that produce our query algebra
loginForm :: forall g. LoginState -> LoginHTML g
loginForm st =
  HH.div
    [ HP.id_ "login"
    , HP.class_ $ HH.className "sh-signin"
    ]
    [ HH.div
        [ HP.class_ $ HH.className "form-group" ]
        [ HH.span
          [ HP.class_ $ HH.className "input-icon icon-mail" ]
          [ HH.input
              [ HP.class_ $ HH.className ("sh-input email" <> ("Email" `existE` st.errors))
              , HP.inputType HP.InputEmail
              , HP.placeholder "Email Address"
              , HP.value $ fromMaybe "" st.email
              , HE.onValueChange $ HE.input UpdateEmail
              ]
          ]
        ]
    , HH.div
        [ HP.class_ $ HH.className "form-group" ]
        [ HH.span
          [ HP.class_ $ HH.className "input-icon icon-lock forgotten-wrap" ]
          [ HH.input
              [ HP.class_ $ HH.className ("sh-input password" <> ("Passwords" `existE` st.errors))
              , HP.inputType HP.InputPassword
              , HP.placeholder "Passwords"
              , HP.value $ fromMaybe "" st.passwords
              , HE.onValueChange $ HE.input UpdatePasswords
              ]
          , renderSpinner "spinner-f" "forgotten-link btn btn-link" "Forgot?"
          ]
        ]
    , renderSpinner "spinner-l" "login btn btn-coffee btn-block" "Login in"
    ]

-- | Render spinner button component.
renderSpinner :: forall g. String -> String -> String -> LoginHTML g
renderSpinner sl text c =
  HH.slot (SpinnerSlot sl) \_ ->
    { component: spinner, initialState: text `mkSpinner` c }

-- | Return " error" if the given key exists on a given map
existE :: forall k v. Ord k => k -> M.Map k v -> String
existE k m = maybe "" (const " error") $ M.lookup k m

eval :: forall g. LoginQuery ~> LoginDSL g
eval (UpdateEmail em n) =
  let upd = either SV.unionError (SV.deleteError "Email") (runErrors $ SV.email "Email" em)
  in H.modify (upd >>> (_ { email = Just em })) $> n
eval (UpdatePasswords p n) =
  let upd = either SV.unionError (SV.deleteError "Passwords") (runErrors $ SV.nes "Passwords" p)
  in H.modify (upd >>> (_ { passwords = Just p})) $> n

peek
  :: forall g a e
  .  (Affable (ShopieEffects e) g)
  => H.ChildF SpinnerSlot SpinnerQuery a
  -> LoginDSL g Unit
peek (H.ChildF p q) = case q, p of
  Submit _, SpinnerSlot "spinner-f" ->
    censorMF (runMaybeT handleForgotP) $ do
      errorN "(Error), Make sure enter valid email address." 10000.00
      H.query p (H.action (ToggleSpinner false)) $> unit
  Submit _, SpinnerSlot "spinner-l" -> do
    em <- H.gets (fromMaybe "" <<< _.email)
    psw <- H.gets (fromMaybe "" <<< _.passwords)
    recoverM (H.modify <<< SV.unionError) $ runExceptT $ handleLogin em psw
    H.query p (H.action (ToggleSpinner false)) $> unit
  _, _ ->
    pure unit

-- Handle forgotten passwords button
handleForgotP :: forall g e. (Affable (ShopieEffects e) g) => MaybeT (LoginDSL g) Unit
handleForgotP = do
  em' <- MaybeT $ H.gets(_.email)
  let v = runErrors $ SV.email "Email" em'
  lift $ H.modify $ either SV.unionError (SV.deleteError "Email") v
  -- make sure our validation success
  guard (isRight v)
  lift $ H.liftH $ H.liftH $ forgotten em'
  Draad { auth } <- lift $ H.liftH $ H.liftH ask
  -- race the result with default timeout, so we can recover the spinner
  res <- H.fromAff $ sequential $
    (parallel $ Bus.read auth) <|> (parallel $ later' 10000 (pure ForgotRequestFailure))
  guard (res == ForgotRequestSuccess)
  lift $ H.modify (_ { email = Nothing, passwords = Nothing })
  infoN ("Email sent! Check your inbox in " <> em') 10000.00

handleLogin
  :: forall g e
   . (Affable (ShopieEffects e) g)
  => Email
  -> Passwords
  -> ExceptT FieldError (LoginDSL g) Unit
handleLogin em psw = do
  v <- ExceptT (pure $ runErrors $ loginStateV em psw)
  lift $ H.set v
  res' <- authenticate $ passwordCreds em psw
  case res' of
    Authenticated _ -> errorN "Login success!" 10000.00
    _ -> errorN "Login failed" 10000.00

loginStateV :: Email -> Passwords -> Errors (M.Map String String) LoginState
loginStateV e p = mkLogin <$> SV.email "Email" e <*> SV.nes "Passwords" p
  where
    mkLogin :: Email -> Passwords -> LoginState
    mkLogin em ps = { email: Just em, passwords: Just ps, errors: M.empty }

infoN :: forall g. NotifyQ g => String -> Number -> g Unit
infoN msg n = info msg $ Just (Milliseconds n)

errorN :: forall g. NotifyQ g => String -> Number -> g Unit
errorN msg n = error msg $ Just (Milliseconds n)
