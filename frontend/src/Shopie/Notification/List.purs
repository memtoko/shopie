module Shopie.Notification.List where

import Shopie.Prelude

import Control.Monad.Aff (later')
import Control.Monad.Aff.Bus as Bus

import Data.Int as Int
import Data.Map as M
import Data.Time.Duration (Milliseconds(..))
import Data.Tuple.Nested (Tuple3, tuple3, get1, get2, get3)

import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

import Math as Math

import Shopie.Halogen.EventSource (raise')
import Shopie.Notification.Item (notification, NotifQuery(..), NotificationItem)
import Shopie.ShopieM (Draad(..), ShopieEffects, ShopieMoD)
import Shopie.ShopieM.Notification as QN


data ListQuery a
  = Init a
  | Push QN.Notification a
  | RemoveAll a

type NotifId = Int
type Message = String

-- | Tuple
type Notify = Tuple3 NotifId QN.Level Message

type NotifList =
  { notifications :: M.Map NotifId Notify
  , nextId :: NotifId
  }

initialState :: NotifList
initialState =
  { notifications: M.empty
  , nextId: 0
  }

newtype NotifSlot = NotifSlot NotifId
derive instance eqNotifSlot :: Eq NotifSlot
derive instance ordNotifSlot :: Ord NotifSlot

-- | Synonim to make typing more readable
type StateP g = H.ParentState NotifList NotificationItem ListQuery NotifQuery (ShopieMoD g) NotifSlot
type QueryP = Coproduct ListQuery (H.ChildF NotifSlot NotifQuery)
type NotifListDSL g = H.ParentDSL NotifList NotificationItem ListQuery NotifQuery (ShopieMoD g) NotifSlot
type NotifListHTML g = H.ParentHTML NotificationItem ListQuery NotifQuery (ShopieMoD g) NotifSlot

mkNotif :: QN.Level -> Message -> NotificationItem
mkNotif lvl msg =
  { message: msg
  , level: lvl
  , removed: false
  }

list
  :: forall g eff
  .  (Affable (ShopieEffects eff) g)
  => H.Component (StateP g) QueryP (ShopieMoD g)
list =
  H.lifecycleParentComponent
    { render
    , eval
    , peek: Just peek
    , initializer: Just (H.action Init)
    , finalizer: Nothing
    }

render :: forall g. NotifList -> NotifListHTML g
render st =
  HH.div
    [ HP.class_ $ HH.className "sh-notifications" ]
    (foldMap renderMessage st.notifications)

renderMessage :: forall g. Notify -> Array (NotifListHTML g)
renderMessage t =
  [ HH.slot (NotifSlot $ get1 t) \_ ->
    { component: notification, initialState: get2 t `mkNotif` get3 t }
  ]

eval :: forall g eff. (Affable (ShopieEffects eff) g) => ListQuery ~> NotifListDSL g
eval (Init next) = do
  Draad { notify } <- H.liftH $ H.liftH ask
  forever (raise' <<< H.action <<< Push =<< H.fromAff (Bus.read notify))
eval (Push (QN.Notification n) next) = do
  nextId <- H.gets (_.nextId) <* H.modify (addNotification n.level n.message)
  n.timeout `maybeRemoveLater` nextId $> next
eval (RemoveAll next) = H.queryAll (H.action (ToggleRemoved true)) $> next

peek:: forall g a. H.ChildF NotifSlot NotifQuery a -> NotifListDSL g Unit
peek (H.ChildF p q) = case q of
  Remove _ ->
    H.modify (removeMessage p)
  _ -> pure unit

addNotification :: QN.Level -> Message -> NotifList -> NotifList
addNotification lvl msg st =
  st { nextId = st.nextId + 1
     , notifications = M.insert st.nextId (tuple3 st.nextId lvl msg) st.notifications
     }

removeMessage :: NotifSlot -> NotifList -> NotifList
removeMessage (NotifSlot t) st =
  st { notifications = M.delete t st.notifications }

maybeRemoveLater
  :: forall g eff
   . (Affable (ShopieEffects eff) g)
  => Maybe Milliseconds
  -> NotifId
  -> NotifListDSL g Unit
maybeRemoveLater mm nid = maybe (pure unit) raiseNotification mm
  where
    raiseNotification :: Milliseconds -> NotifListDSL g Unit
    raiseNotification (Milliseconds ms) =
      let defer = H.fromAff $ later' (Int.floor $ Math.max ms zero) (pure unit)
      in defer *> H.modify (removeMessage (NotifSlot nid))
