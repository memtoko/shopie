module Shopie.ShopieM.Notification
  ( Level(..)
  , Notification(..)
  , class NotifyQ
  , notify
  , info
  , error
  , warning
  ) where

import Shopie.Prelude

import Control.Monad.Free (Free, liftF)

import Halogen.Query.EventSource as ES
import Halogen.Query.HalogenF as HF

import Data.Time.Duration (Milliseconds)

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

instance notifyQMaybeT :: (Monad m, NotifyQ m) => NotifyQ (MaybeT m) where
  notify = lift <<< notify

instance notifyQExceptT :: (Monad m, NotifyQ m) => NotifyQ (ExceptT e m) where
  notify = lift <<< notify

instance notifyQFree :: NotifyQ f => NotifyQ (Free f) where
  notify = liftF <<< notify

instance notifyQHalogenF :: NotifyQ g => NotifyQ (HF.HalogenFP ES.EventSource s f g) where
  notify = HF.QueryHF <<< notify

instance notifyQHalogenFP :: NotifyQ g => NotifyQ (HF.HalogenFP ES.ParentEventSource s f (Free (HF.HalogenFP ES.EventSource s' f' g))) where
  notify = HF.QueryHF <<< notify

info :: forall m. NotifyQ m => String -> Maybe Milliseconds -> m Unit
info m t = notify $ Notification { level: Info, message: m, timeout: t }

error :: forall m. NotifyQ m => String -> Maybe Milliseconds -> m Unit
error m t = notify $ Notification { level: Error, message: m, timeout: t }

warning :: forall m. NotifyQ m => String -> Maybe Milliseconds -> m Unit
warning m t = notify $ Notification $ { level: Warning, message: m, timeout: t }
