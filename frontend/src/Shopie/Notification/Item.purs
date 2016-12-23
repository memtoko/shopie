module Shopie.Notification.Item where

import Prelude

import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

import Shopie.ShopieM.Notification as QN


data NotifQuery a
  = Remove a
  | ToggleRemoved Boolean a
  | IsRemoved (Boolean -> a)

-- | Notification Item
type NotificationItem =
  { message :: String
  , level :: QN.Level
  , removed :: Boolean
  }

notification :: forall g. H.Component NotificationItem NotifQuery g
notification = H.component { render, eval }

render :: NotificationItem -> H.ComponentHTML NotifQuery
render n =
  HH.div
    [ HP.class_ $ HH.className $ levelCSS n.level ]
    [ HH.div
        [ HP.class_ $ HH.className "sh-notification-content" ]
        [ HH.text n.message ]
    , HH.button
        [ HP.class_ $ HH.className "sh-notification-close icon-x"
        , HP.title "Remove"
        , HE.onClick (HE.input_ Remove)
        ]
        [ HH.span
            [ HP.class_ $ HH.className "hidden" ]
            [ HH.text "Close" ]
        ]
    ]

eval :: forall g. NotifQuery ~> H.ComponentDSL NotificationItem NotifQuery g
eval (Remove next) = pure next
eval (ToggleRemoved b next) = H.modify (_ { removed = b }) $> next
eval (IsRemoved reply) = reply <$> H.gets (_.removed)

levelCSS :: QN.Level -> String
levelCSS n = "sh-notification " <> "sh-notification-passive " <> color
  where
    color = case n of
      QN.Info -> "green"
      QN.Error -> "red"
      QN.Warning -> "orange"
