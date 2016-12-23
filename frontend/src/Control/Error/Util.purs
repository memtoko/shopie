module Control.Error.Util where

import Prelude

import Control.Monad.Maybe.Trans (MaybeT(..), runMaybeT)
import Control.Monad.Except.Trans (ExceptT(..), runExceptT)

import Data.Bifunctor (bimap)
import Data.Either (Either(..), either)
import Data.Maybe (Maybe(..), maybe)


-- | Suppress the 'Left' value of an 'Either'.
hush :: forall a. Either a ~> Maybe
hush = either (const Nothing) Just

-- | Suppress the 'Left' value of an 'ExceptT'
hushT :: forall m a. Functor m => ExceptT a m ~> MaybeT m
hushT = MaybeT <<< map hush <<< runExceptT

-- | Tag the 'Nothing' value of a 'Maybe'
note :: forall a. a -> Maybe ~> Either a
note b = maybe (Left b) Right

-- | Tag the 'Nothing' value of a 'MaybeT'
noteT :: forall m a. Functor m => a -> MaybeT m ~> ExceptT a m
noteT a = ExceptT <<< (map (note a)) <<< runMaybeT

-- | Lift a 'Maybe' to the 'MaybeT' monad
hoistMaybe :: forall m. Applicative m => Maybe ~> MaybeT m
hoistMaybe = MaybeT <<< pure

-- |
foldExceptT :: forall m a b c. Bind m => (a -> m c) -> (b -> m c) -> ExceptT a m b -> m c
foldExceptT f g (ExceptT m) =  m >>= either f g

-- |
bimapExceptT
  :: forall m a b f e
   . Functor m
  => (e -> f)
  -> (a -> b)
  -> ExceptT e m a
  -> ExceptT f m b
bimapExceptT f g (ExceptT m) = ExceptT (map (bimap f g) m)

-- |
foldMaybeT :: forall m a b. Bind m => m b -> (a -> m b) -> MaybeT m a -> m b
foldMaybeT mb hb (MaybeT m) = m >>= maybe mb hb

-- | Lift maybe value to an Applicative. If the given maybe Nothing then use
-- | the first argument.
censor :: forall m a. Applicative m => m a -> Maybe a -> m a
censor h = maybe h pure

-- | flipped version of censor
censorF :: forall m a. Applicative m => Maybe a -> m a -> m a
censorF = flip censor

censorM :: forall m a. Monad m => m a -> m (Maybe a) -> m a
censorM h mm = censor h =<< mm

censorMF :: forall m a. Monad m => m (Maybe a) -> m a -> m a
censorMF = flip censorM

recover :: forall m a b. Applicative m => (b -> m a) -> Either b a -> m a
recover h = either h pure

recoverF :: forall m a b. Applicative m => Either b a -> (b -> m a) -> m a
recoverF = flip recover

recoverM :: forall m a b. Monad m => (b -> m a) -> m (Either b a) -> m a
recoverM h me = recover h =<< me

recoverMF :: forall m a b. Monad m => m (Either b a) -> (b -> m a) -> m a
recoverMF = flip recoverM
