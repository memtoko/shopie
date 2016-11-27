module Component.Notification
  ( MessageQ(..)
  , Level(..)
  , Message
  , notification
  , makeMsg
  , warning
  , error
  , success ) where

import Prelude

import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP


data MessageQ a
  = Remove a
  | ToggleRemoved Boolean a
  | IsRemoved (Boolean -> a)

data Level
  = Success
  | Error
  | Warning

type Message =
  { message :: String
  , level :: Level
  , removed :: Boolean
  }

makeMsg :: Level -> String -> Message
makeMsg lvl m = { message: m, level: lvl, removed: false }

warning :: String -> Message
warning = makeMsg Warning

error :: String -> Message
error = makeMsg Error

success :: String -> Message
success = makeMsg Success

styleN :: Level -> HH.ClassName
styleN n = HH.className $ "sh-notification " <> "sh-notification-passive " <> color
  where
    color :: String
    color = case n of
      Success -> "green"
      Error -> "red"
      Warning -> "orange"

notification :: forall g. H.Component Message MessageQ g
notification = H.component { render, eval }
  where
  render :: Message -> H.ComponentHTML MessageQ
  render n =
    HH.div
      [ HP.class_ $ styleN n.level ]
      [ HH.div
          [ HP.class_ $ HH.className "sh-notification-content" ]
          [ HH.text n.message ]
      , HH.button
          [ HP.class_ $ HH.className "sh-notification-close icon-x"
          , HP.title "Remove task"
          , HE.onClick (HE.input_ Remove)
          ]
          [ HH.span
              [ HP.class_ $ HH.className "hidden" ]
              [ HH.text "Close" ]
          ]
      ]

  eval :: MessageQ ~> H.ComponentDSL Message MessageQ g
  eval (Remove next) = pure next
  eval (ToggleRemoved b next) = next <$ H.modify (_ { removed = b } )
  eval (IsRemoved continue) = continue <$> H.gets (_.removed)
