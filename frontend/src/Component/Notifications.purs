module Component.Notifications where

import Prelude

import Data.Array (snoc, filter)
import Data.Functor.Coproduct (Coproduct)
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(Tuple))
import Data.Tuple.Nested (Tuple3, tuple3, get1, get2, get3)

import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

import Component.Notification (Message, Level, MessageQ(..), notification, makeMsg)


data MessagesQ a
  = NewMessage (Tuple Level String) a
  | RemoveAll a

type MessageId = Int

type MessageL = Tuple3 MessageId Level String

type Messages =
  { messages :: Array MessageL
  , nextId :: MessageId
  }

initialMessages :: Messages
initialMessages =
  { messages: []
  , nextId: 0
  }

newtype MessageSlot = MessageSlot MessageId
derive instance eqMessageSlot :: Eq MessageSlot
derive instance ordMessageSlot :: Ord MessageSlot

type State g = H.ParentState Messages Message MessagesQ MessageQ g MessageSlot
type Query = Coproduct MessagesQ (H.ChildF MessageSlot MessageQ)

notifications :: forall g. Functor g => H.Component (State g) Query g
notifications = H.parentComponent { render, eval, peek: Just peek }
  where
  render :: Messages -> H.ParentHTML Message MessagesQ MessageQ g MessageSlot
  render ms =
    HH.div
      [ HP.class_ $ HH.className "sh-notifications" ]
      (renderMessage <$> ms.messages)

  renderMessage :: MessageL
                -> H.ParentHTML Message MessagesQ MessageQ g MessageSlot
  renderMessage msgl =
    HH.slot (MessageSlot (get1 msgl)) \_ ->
      { component: notification, initialState: makeMsg (get2 msgl) (get3 msgl) }

  eval :: MessagesQ
       ~> H.ParentDSL Messages Message MessagesQ MessageQ g MessageSlot
  eval (NewMessage t next) = next <$ H.modify (addMessage t)
  eval (RemoveAll next) = next <$ H.queryAll (H.action (ToggleRemoved true))

  peek :: forall a. H.ChildF MessageSlot MessageQ a
       -> H.ParentDSL Messages Message MessagesQ MessageQ g MessageSlot Unit
  peek (H.ChildF p q) = case q of
    Remove _ ->
      H.modify (removeMessage p)
    _ -> pure unit

addMessage :: Tuple Level String -> Messages -> Messages
addMessage (Tuple lvl msg) st =
  st { nextId = st.nextId + 1, messages = st.messages `snoc` (tuple3 st.nextId lvl msg) }

removeMessage :: MessageSlot -> Messages -> Messages
removeMessage (MessageSlot id) st =
  st { messages = filter (notEq id <<< get1) st.messages }
