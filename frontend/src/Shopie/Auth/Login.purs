module Shopie.Auth.Login where

import Prelude

import Control.Monad.Aff (later')
import Control.Monad.Aff.Bus as Bus
import Control.Monad.Aff.Free (class Affable)
import Control.Monad.Reader (ask)

import Data.Foldable (foldMap)
import Data.Functor.Coproduct (Coproduct)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe, fromMaybe)
import Data.Time.Duration (Milliseconds(..))
import Data.Validation.Semigroup (unV, isValid)

import Halogen as H
import Halogen.HTML.Indexed as HH
import Halogen.HTML.Properties.Indexed as HP
import Halogen.HTML.Events.Indexed as HE

import Shopie.Auth.Types (Email, Passwords, authenticate, passwordCreds)
import Shopie.Auth.Validation (runAuthInfoV)
import Shopie.Button.Spinner (SpinnerS, SpinnerQuery(..), SpinnerSlot(..), spinner, mkSpinner)
import Shopie.Draad (Draad(..))
import Shopie.Effects (ShopieEffects)
import Shopie.ShopieM (AuthMessage(..), ShopieMoD, error, info, forgotten)


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
                (foldMap renderError m)
            ]
        ]
    ]
  where
    renderError :: String -> Array (H.HTML p i)
    renderError msg = [ HH.li_ [ HH.text msg ] ]

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
          [ HP.class_ $ HH.className "input-icon icon-mail"]
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
eval (UpdateEmail em n) = do
  psw <- H.gets (fromMaybe "" <<< _.passwords)
  H.modify $ unV unionError (deleteError "Email") (runAuthInfoV em psw)
  -- | Accept even if it invalid, so user can still typing or correct it
  H.modify (_ { email = Just em })
  pure n
eval (UpdatePasswords p n) = do
  em <- H.gets (fromMaybe "" <<< _.email)
  H.modify $ unV unionError (deleteError "Passwords") (runAuthInfoV em p)
  pure n

peek
  :: forall g a e
  .  (Affable (ShopieEffects e) g)
  => H.ChildF SpinnerSlot SpinnerQuery a
  -> LoginDSL g Unit
peek (H.ChildF p q) = case q, p of
  Submit _, SpinnerSlot "spinner-f" -> do
    mem <- H.gets (_.email)
    case mem of
      Just email -> do
        let v = runAuthInfoV email "fake"
        H.modify $ unV unionError (deleteError "Email") v
        when (isValid v) $ do
          H.liftH $ H.liftH $ forgotten email
          Draad { auth } <- H.liftH $ H.liftH ask
          res <- H.fromAff $ Bus.read auth
          when (res == ForgotRequestSuccess) $ do
            H.liftH $ H.liftH $ infoN ("Email sent! Check " <> email) 20.00
            H.modify (_ { email = Nothing, passwords = Nothing })
            pure unit
        H.fromAff $ delay
        H.query p (H.action (ToggleSpinner false))
        pure unit
      Nothing -> do
        H.modify $ setError (M.singleton "Email" "Please, Enter a valid email address.")
        H.fromAff $ delay
        H.query p (H.action (ToggleSpinner false))
        pure unit
  Submit _, SpinnerSlot "spinner-l" -> do
    em <- H.gets (fromMaybe "" <<< _.email)
    psw <- H.gets (fromMaybe "" <<< _.passwords)
    let v = runAuthInfoV em psw
    H.modify $ unV unionError clearError v
    when (isValid v) $ do
      H.liftH $ H.liftH $ authenticate $ passwordCreds em psw
      Draad { auth } <- H.liftH $ H.liftH ask
      res <- H.fromAff $ Bus.read auth
      H.query p (H.action (ToggleSpinner false))
      when (res == AuthFailure) (H.liftH $ H.liftH $ errorN "Login failed" 20.00)
    H.fromAff $ delay
    H.query p (H.action (ToggleSpinner false))
    pure unit
  _, _ ->
    pure unit
  where
    delay = later' 1 (pure unit)

    infoN :: String -> Number -> ShopieMoD g Unit
    infoN msg n = info msg $ Just (Milliseconds n)

    errorN ::  String -> Number -> ShopieMoD g Unit
    errorN msg n = error msg $ Just (Milliseconds n)

clearError :: forall a. a -> LoginState -> LoginState
clearError _ st = st { errors = M.empty }

-- | Set error field
setError :: FieldError -> LoginState -> LoginState
setError e = (_ { errors = e })

unionError :: FieldError -> LoginState -> LoginState
unionError e st = st { errors = M.union e st.errors }

-- | Delete error for a given field
deleteError :: forall a. String -> a -> LoginState -> LoginState
deleteError k _ st = st { errors = M.delete k st.errors }
