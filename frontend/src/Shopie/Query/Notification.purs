module Shopie.Query.Notification
  ( Level(..)
  , Notification(..)
  , class NotifyQ
  , notify
  , info
  , error
  , warning
  ) where

import Prelude

import Data.Time.Duration (Milliseconds)
import Data.Maybe (Maybe)

-- | Notification level
data Level
  = Info
  | Error
  | Warning

derive instance eqLevel :: Eq Level

newtype Notification = Notification
  { message :: String
  , level :: Level
  , timeout :: Maybe Milliseconds
  }

instance eqNotification :: Eq Notification where
  eq (Notification n1) (Notification n2) =
    case n1.level == n2.level of
      true -> n1.message == n2.message
      false -> false

class NotifyQ m where
  notify :: Notification -> m Unit

info :: forall m. NotifyQ m => String -> Maybe Milliseconds -> m Unit
info m t = notify $ Notification { level: Info, message: m, timeout: t }

error :: forall m. NotifyQ m => String -> Maybe Milliseconds -> m Unit
error m t = notify $ Notification { level: Error, message: m, timeout: t }

warning :: forall m. NotifyQ m => String -> Maybe Milliseconds -> m Unit
warning m t = notify $ Notification $ { level: Warning, message: m, timeout: t }
