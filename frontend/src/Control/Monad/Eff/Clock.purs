module Control.Monad.Eff.Clock
  ( CLOCK
  , now
  , nowDateTime
  , nowDate
  , nowTime
  , locale
  ) where

import Prelude

import Control.Monad.Eff (Eff)

import Data.DateTime (time, date)
import Data.DateTime.Instant (Instant, toDateTime)
import Data.DateTime.Locale (LocalTime, LocalDate, LocalDateTime, LocalValue(..), Locale(..))
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Minutes)


-- | effects
foreign import data CLOCK :: !

-- | Gets an `Instant` value for the date and time according to the current
-- | machine’s clock.
foreign import now :: forall eff. Eff (clock :: CLOCK | eff) Instant

-- | Gets a `DateTime` value for the date and time according to the current
-- | machine’s clock.
nowDateTime :: forall e. Eff (clock :: CLOCK | e) LocalDateTime
nowDateTime = LocalValue <$> locale <*> (toDateTime <$> now)

-- | Gets the date according to the current machine’s clock.
nowDate :: forall e. Eff (clock :: CLOCK | e) LocalDate
nowDate = LocalValue <$> locale <*> (date <<< toDateTime <$> now)

-- | Gets the time according to the current machine’s clock.
nowTime :: forall e. Eff (clock :: CLOCK | e) LocalTime
nowTime = LocalValue <$> locale <*> (time <<< toDateTime <$> now)

-- | Gets the locale according to the current machine’s clock.
locale :: forall e. Eff (clock :: CLOCK | e) Locale
locale = Locale Nothing <$> nowOffset

foreign import nowOffset :: forall e. Eff (clock :: CLOCK | e) Minutes
