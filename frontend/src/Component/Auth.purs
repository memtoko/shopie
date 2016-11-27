module Component.Auth where

import Prelude

import Control.Applicative.Free (foldFreeAp)
import Control.Monad.Eff.Exception.Unsafe (unsafeThrow)

import Data.Bifunctor (lmap)
import Data.Functor.Coproduct (Coproduct)
import Data.Foldable (foldMap)
import Data.Either (Either, either)
import Data.Maybe (Maybe(..), maybe, fromMaybe)
import Data.Map as M
import Data.Tuple.Nested (Tuple3, tuple3, get1, get2, get3)
import Data.Validation.Semigroup (V, unV, invalid)

import Halogen as H
import Halogen.HTML.Indexed as HH
import Halogen.HTML.Properties.Indexed as HP
import Halogen.HTML.Events.Indexed as HE

import Component.Spinner (SpinnerS, SpinnerQuery(..), SpinnerSlot(..), spinner, mkSpinner)
import Shopie.Validation (Validator, Field(..), Name, Form, nes, email)


type Email = String

type Passwords = String

-- | The Query algebra
data AuthQuery a
  = UpdateEmail Email a
  | UpdatePasswords Passwords a
  | Logout a
  | IsAuthenticated (Boolean -> a)

-- | Auth Component State
type AuthState =
  { isAuthenticated :: Boolean
  , email :: Maybe Email
  , passwords :: Maybe Passwords
  , error :: M.Map String String
  }

initialAuth :: AuthState
initialAuth =
  { isAuthenticated: false
  , email: Nothing
  , passwords: Nothing
  , error: M.empty
  }

-- | Synonim to make type signature a bit simple
type StateP g = H.ParentState AuthState SpinnerS AuthQuery SpinnerQuery g SpinnerSlot
type QueryP = Coproduct AuthQuery (H.ChildF SpinnerSlot SpinnerQuery)

type SpinnerT = Tuple3 String String String

-- | auth login component.
auth :: forall g. Functor g => H.Component (StateP g) QueryP g
auth = H.parentComponent { render, eval, peek: Just peek }
  where
  wrapper :: forall p i. M.Map String String -> H.HTML p i -> H.HTML p i
  wrapper err inner =
    HH.div
      [ HP.class_ $ HH.className "sh-flow" ]
      [ HH.div
          [ HP.class_ $ HH.className "sh-flow-content-wrap" ]
          [ HH.div
              [ HP.class_ $ HH.className "sh-flow-content" ]
              [ inner
              , HH.ul
                  [ HP.class_ $ HH.className "main-error" ]
                  (foldMap renderError err)
              ]
          ]
      ]

  render :: AuthState -> H.ParentHTML SpinnerS AuthQuery SpinnerQuery g SpinnerSlot
  render st = wrapper st.error inner
    where
    inner :: H.ParentHTML SpinnerS AuthQuery SpinnerQuery g SpinnerSlot
    inner =
      HH.div
        [ HP.id_ "login"
        , HP.class_ $ HH.className "sh-signin"
        ]
        [ HH.div
            [ HP.class_ $ HH.className "sh-input" ]
            [ HH.span
              [ HP.class_ $ HH.className "input-icon icon-mail"]
              [ HH.input
                  [ HP.class_ $ HH.className ("sh-input email" <> (errorInput "Email" st.error))
                  , HP.inputType HP.InputEmail
                  , HP.placeholder "Email Address"
                  , HP.value $ fromMaybe "" st.email
                  , HE.onValueChange $ HE.input UpdateEmail
                  ]
              ]
            ]
        , HH.div
            [ HP.class_ $ HH.className "sh-input" ]
            [ HH.span
              [ HP.class_ $ HH.className "input-icon icon-lock forgotten-wrap" ]
              [ HH.input
                  [ HP.class_ $ HH.className ("sh-input password" <> (errorInput "Passwords" st.error))
                  , HP.inputType HP.InputPassword
                  , HP.placeholder "Passwords"
                  , HP.value $ fromMaybe "" st.passwords
                  , HE.onValueChange $ HE.input UpdatePasswords
                  ]
              , renderSpinner $ tuple3 "spinner-f" "forgotten-link btn btn-link" "Forgot?"
              ]
            ]
        , renderSpinner $ tuple3 "spinner-l" "login btn btn-coffee btn-block" "Login in"
        ]

  renderSpinner :: SpinnerT
                -> H.ParentHTML SpinnerS AuthQuery SpinnerQuery g SpinnerSlot
  renderSpinner tpl3 =
    HH.slot (SpinnerSlot (get1 tpl3)) \_ ->
      { component: spinner, initialState: get2 tpl3 `mkSpinner` get3 tpl3 }

  renderError :: forall p i. String -> Array (H.HTML p i)
  renderError e =
    [ HH.li_
        [ HH.text e ]
    ]

  errorInput :: forall k v. Ord k => k -> M.Map k v -> String
  errorInput s m = maybe "" (const " error") (M.lookup s m)

  eval :: AuthQuery
       ~> H.ParentDSL AuthState SpinnerS AuthQuery SpinnerQuery g SpinnerSlot
  eval (UpdateEmail email next) = do
    H.modify (unV updateError removeError (runAuthV email "fake"))
    H.modify (_ { email = Just email })
    pure next
  eval (UpdatePasswords psw next) = do
    em <- H.gets (fromMaybe "" <<< _.email)
    H.modify (unV updateError removeError (runAuthV em psw))
    H.modify (_ { passwords = Just psw })
    pure next
  eval (Logout next) = do
    authenticate <- H.gets (_.isAuthenticated)
    when authenticate $ H.modify (_ { isAuthenticated = false})
    pure next
  eval (IsAuthenticated cont) = cont <$> H.gets (_.isAuthenticated)

  peek :: forall a. H.ChildF SpinnerSlot SpinnerQuery a
       -> H.ParentDSL AuthState SpinnerS AuthQuery SpinnerQuery g SpinnerSlot Unit
  peek (H.ChildF p q) = case q, p of
    Submit _, SpinnerSlot "spinner-f" -> do
      -- make sure user already type their email
      em <- H.gets (fromMaybe "" <<< _.email)
      unV reportError submitForgot (runAuthV em "fake")
      H.query p (H.action (ToggleSpinner false))
      pure unit
    Submit _, SpinnerSlot "spinner-l" -> do
      em  <- H.gets (fromMaybe "" <<< _.email)
      psw <- H.gets (fromMaybe "" <<< _.passwords)
      unV reportError submitLogin (runAuthV em psw)
      H.query p (H.action (ToggleSpinner false))
      pure unit
    _, _ -> pure unit

  reportError :: M.Map String String
              -> H.ParentDSL AuthState SpinnerS AuthQuery SpinnerQuery g SpinnerSlot Unit
  reportError err = do
    H.modify (_ { error = err })
    pure unit

  submitLogin :: Auth
              -> H.ParentDSL AuthState SpinnerS AuthQuery SpinnerQuery g SpinnerSlot Unit
  submitLogin (Auth a) = do
    H.modify (_ { email = Nothing, passwords = Nothing })
    pure unit

  submitForgot :: Auth
               -> H.ParentDSL AuthState SpinnerS AuthQuery SpinnerQuery g SpinnerSlot Unit
  submitForgot (Auth a) = do
    -- | TODO submit an ajax request to server
    H.set initialAuth
    pure unit

newtype Auth = Auth { email :: Email, passwords :: Passwords }

updateError :: M.Map String String -> AuthState -> AuthState
updateError err = (_ { error = err })

removeError :: Auth -> AuthState -> AuthState
removeError  _ = (_ { error = M.empty })

validateAuth :: Form Auth
validateAuth =
  Auth <$> ({ email: _
            , passwords: _
            } <$> email "Email"
              <*> nes "Passwords")

-- | Collect the error on Applicative Validation with Semigroup Map, so we can
-- | highligh the error field
runAuthV :: Email -> Passwords -> V (M.Map String String) Auth
runAuthV em psw =
  foldFreeAp (\(Field x) -> validate x.name x.validator) validateAuth
  where
    validate :: forall a. Name -> Validator a -> V (M.Map String String) a
    validate n v =
      case n of
        "Email" -> eitherToValidation n (v em)
        "Passwords" ->
          eitherToValidation n $ lmap (const "Please, enter your passwords") (v psw)
        _ -> unsafeThrow ("Unexpected field: " <> n)
    eitherToValidation :: forall a b. String -> Either a b -> V (M.Map String a) b
    eitherToValidation k = either (invalid <<< M.singleton k) pure
