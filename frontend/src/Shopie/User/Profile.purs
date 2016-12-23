module Shopie.User.Profile where

import Shopie.Prelude

import Control.Applicative.Lift (Errors, runErrors)

import Data.Map as M

import Halogen as H
import Halogen.HTML.Indexed as HH
import Halogen.HTML.Properties.Indexed as HP
import Halogen.HTML.Events.Indexed as HE
import Halogen.HTML.Events.Handler as HEH

import Shopie.ShopieM (ShopieEffects, ShopieMoD)
import Shopie.User.Model (User, UserAttributes, user, unAttr)
import Shopie.Validation as SV


data ProfileQ a
  = Save a
  | UpdateFirstName String a
  | UpdateLastName String a
  | UpdateEmail String a
  | UpdateUsername String a

type UserId = String

type Profile =
  { userId :: UserId
  , firstName :: String
  , lastName :: String
  , username :: String
  , email :: String
  , errors :: M.Map String String
  }

-- | Profile component
profile
  :: forall g e
   . (Affable (ShopieEffects e) g)
  => H.Component Profile ProfileQ (ShopieMoD g)
profile = H.component { render, eval }

render :: Profile -> H.ComponentHTML ProfileQ
render u =
  HH.section
    [ HP.class_ $ HH.className "sh-view" ]
    [ renderHeader u
    , renderForm u
    ]

eval
  :: forall g e
   . (Affable (ShopieEffects e) g)
  => ProfileQ
  ~> H.ComponentDSL Profile ProfileQ (ShopieMoD g)
eval (UpdateFirstName fn next) =
  let v = either SV.unionError (SV.deleteError "FirstName") $ runErrors $ SV.nes "FirstName" fn
  in H.modify (v >>> (_ { firstName = fn })) $> next
eval (UpdateLastName ln next) = H.modify (_ { lastName = ln }) $> next
eval (UpdateEmail email next) =
  let v = either SV.unionError (SV.deleteError "Email") $ runErrors $ SV.email "Email" email
  in H.modify (v >>> (_ { email = email })) $> next
eval (UpdateUsername um next) = H.modify (_ { username = um }) $> next
eval (Save next) = do
  v <- H.gets $ map toUser <<< runErrors <<< profileV
  case v of
    Right u ->
      -- TODO submit AJAX request
      pure next
    Left e ->
      H.modify (SV.setError e) $> next

renderHeader :: Profile -> H.ComponentHTML ProfileQ
renderHeader u =
  HH.header
    [ HP.class_ $ HH.className "view-header" ]
    [ HH.h2
        [ HP.class_ $ HH.className "view-title" ]
        [ HH.span_ $ [ HH.text (u.firstName <> " " <> u.lastName) ]]
    , HH.section
        [ HP.class_ $ HH.className "view-actions" ]
        [ HH.button
            [ HP.class_ $ HH.className "btn btn-blue"
            , HE.onClick (\_ -> HEH.preventDefault *> HEH.stopPropagation $> Just (H.action Save))
            ]
            [ HH.text "Save" ]
        ]
    ]

renderForm :: Profile -> H.ComponentHTML ProfileQ
renderForm u =
  HH.section
    [ HP.class_ $ HH.className "view-container settings-user" ]
    [ HH.figure
        [ HP.class_ $ HH.className "user-cover" ]
        [ HH.button
            [ HP.class_ $ HH.className "btn btn-default user-cover-default" ]
            [ HH.text "Change cover" ]
        ]
    , HH.div
        [ HP.class_ $ HH.className "user-profile" ]
        [ HH.fieldset
            [ HP.class_ $ HH.className "user-details-top" ]
            [ HH.div
                [ HP.id_ "image"
                , HP.class_ $ HH.className "img"
                ]
                [ HH.text "Edit profile" ]
            ]
        , HH.div
            [ HP.class_ $ HH.className "first-form-group form-group" ]
            [ HH.label
                [ HP.for "user-name" ]
                [ HH.text "User Name" ]
            , HH.input
                [ HP.id_ "user-name"
                , HP.class_ $ HH.className "user-name sh-input"
                , HP.placeholder "User name"
                , HP.value u.username
                , HE.onValueChange $ HE.input UpdateUsername
                ]
            ]
        , HH.fieldset
            [ HP.class_ $ HH.className "user-details-bottom" ]
            [ HH.div
                [ HP.class_ $ HH.className "form-group" ]
                [ HH.label
                    [ HP.for "first-name" ]
                    [ HH.text "First name" ]
                , HH.input
                    [ HP.id_ "first-name"
                    , HP.class_ $ HH.className "first-name sh-input"
                    , HP.placeholder "First name"
                    , HP.value u.firstName
                    , HE.onValueChange $ HE.input UpdateFirstName
                    ]
                ]
            , HH.div
                [ HP.class_ $ HH.className "form-group" ]
                [ HH.label
                    [ HP.for "last-name" ]
                    [ HH.text "Last name" ]
                , HH.input
                    [ HP.id_ "last-name"
                    , HP.class_ $ HH.className "last-name sh-input"
                    , HP.placeholder "Last name"
                    , HP.value u.firstName
                    , HE.onValueChange $ HE.input UpdateLastName
                    ]
                ]
            , HH.div
                [ HP.class_ $ HH.className "form-group" ]
                [ HH.label
                    [ HP.for "user-email" ]
                    [ HH.text "Email" ]
                , HH.input
                    [ HP.id_ "user-email"
                    , HP.class_ $ HH.className "user-email sh-input"
                    , HP.placeholder "User email"
                    , HP.value u.firstName
                    , HE.onValueChange $ HE.input UpdateEmail
                    ]
                ]
            ]
        ]
    ]

profileV :: Profile -> Errors (M.Map String String) Profile
profileV p = mkProfile <$> (SV.nes "FirstName" p.firstName) <*> (SV.email "Email" p.email)
  where
    mkProfile :: String -> String -> Profile
    mkProfile =
      { userId: p.userId
      , firstName: _
      , lastName: p.lastName
      , email: _
      , username: p.username
      , errors: M.empty
      }

fromUser :: User UserAttributes -> Profile
fromUser u =
  let
    a = unAttr $ snd $ unwrap u
    ident = fromMaybe "" <<< fst <<< unwrap
  in
    { userId: ident u
    , firstName: a.firstName
    , lastName: a.lastName
    , email: a.email
    , username: a.username
    , errors: M.empty
    }

toUser :: Profile -> User UserAttributes
toUser p =
  let
    attr =
      { firstName: p.firstName
      , lastName: p.lastName
      , email: p.email
      , username: p.username
      }
  in
    user (Just p.userId) attr
