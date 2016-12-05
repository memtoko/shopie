module Data.EitherR where


import Prelude

import Control.Alt (class Alt)
import Control.Plus (class Plus)
import Control.Alternative (class Alternative)
import Control.MonadPlus (class MonadPlus)
import Control.MonadZero (class MonadZero)
import Control.Monad.Except.Trans (ExceptT(..), runExceptT)
import Control.Monad.Error.Class (throwError, catchError)
import Control.Monad.Rec.Class (class MonadRec, tailRecM, Step(..))
import Control.Monad.Trans.Class (class MonadTrans, lift)
import Control.Monad.Eff.Class (class MonadEff, liftEff)

import Data.Either (Either(..))
import Data.Monoid (class Monoid, mempty)
import Data.Newtype (class Newtype)


-- | unwrap the EitherR back to Either
runEitherR :: forall a b. EitherR a b -> Either b a
runEitherR (EitherR e) = e

succeed :: forall a b. a -> EitherR a b
succeed = EitherR <<< pure

throwEither :: forall a b. a -> Either a b
throwEither e = runEitherR (pure e)

catchEither :: forall a b r. Either a r -> (a -> Either b r) -> Either b r
catchEither e f = runEitherR $ EitherR e >>= \a -> EitherR (f a)

handleEither :: forall a b r. (a -> Either b r) -> Either a r -> Either b r
handleEither = flip catchEither

mapL :: forall a b r. (a -> b) -> Either a r -> Either b r
mapL f = runEitherR <<< map f <<< EitherR

flipEither :: forall a b. Either a b -> Either b a
flipEither = case _ of
  Left a -> Right a
  Right b -> Left b

runExceptRT :: forall r m e. ExceptRT r m e -> ExceptT e m r
runExceptRT (ExceptRT m) = m

succeedT :: forall m r e. Monad m => r -> ExceptRT r m e
succeedT r = ExceptRT (pure r)

handleE :: forall m a r. Monad m => (a -> ExceptT a m r) -> ExceptT a m r -> ExceptT a m r
handleE = flip catchError

mapLT :: forall m a b r. Monad m => (a -> b) -> ExceptT a m r -> ExceptT b m r
mapLT f = runExceptRT <<< map f <<< ExceptRT

flipExceptT :: forall m a r. Monad m => ExceptT a m r -> ExceptT r m a
flipExceptT = ExceptT <<< map flipEither <<< runExceptT

newtype EitherR a b = EitherR (Either b a)

derive instance newtypeEitherR :: Newtype (EitherR a b) _

instance functorEitherR :: Functor (EitherR a) where
  map _ (EitherR (Right x)) = EitherR $ Right x
  map f (EitherR (Left y))  = EitherR $ Left (f y)

instance applyEitherR :: Apply (EitherR a) where
  apply (EitherR (Right x)) _ = EitherR $ Right x
  apply (EitherR (Left f)) r  = f <$> r

instance applicativeEitherR :: Applicative (EitherR a) where
  pure = EitherR <<< Left

instance bindEitherR :: Bind (EitherR a) where
  bind (EitherR m) f = case m of
    Left x -> f x
    Right r -> EitherR $ Right r

instance monadEitherR :: Monad (EitherR a)

instance altEitherR :: Semigroup a => Alt (EitherR a) where
  alt er1@(EitherR (Left _)) _ = er1
  alt _ er2@(EitherR (Left _)) = er2
  alt (EitherR (Right a)) (EitherR (Right b)) = EitherR $ Right (a <> b)

instance plusEitherR :: Monoid a => Plus (EitherR a) where
  empty = EitherR (Right (mempty :: a))

instance alternativeEitherR :: Monoid a => Alternative (EitherR a)

instance monadPlusEitherR :: Monoid a => MonadPlus (EitherR a)

instance monadZeroEitherR :: Monoid a => MonadZero (EitherR a)

instance showEitherR :: (Show a, Show b) => Show (EitherR a b) where
  show (EitherR a) = "(EitherR " <> show a <> " )"

derive instance eqEitherR :: (Eq a, Eq b) => Eq (EitherR a b)

derive instance ordEitherR :: (Ord a, Ord b) => Ord (EitherR a b)

-- | EitherR as Monad Transformer
newtype ExceptRT r m e = ExceptRT (ExceptT e m r)

derive instance newtypeExceptRT :: Newtype (ExceptRT r m e) _

instance functorExceptRT :: Monad m => Functor (ExceptRT r m) where
  map = liftM1

instance applyExceptRT :: Monad m => Apply (ExceptRT r m) where
  apply = ap

instance applicativeExceptRT :: Monad m => Applicative (ExceptRT r m) where
  pure e = ExceptRT (throwError e)

instance bindExceptRT :: Monad m => Bind (ExceptRT r m) where
  bind (ExceptRT m) f = ExceptRT $ ExceptT $ do
    x <- runExceptT m
    runExceptT $ runExceptRT $ case x of
      Left e -> f e
      Right a -> ExceptRT (pure a)

instance monadExceptRT :: Monad m => Monad (ExceptRT r m)

instance monadRecExceptRT :: MonadRec m =>  MonadRec (ExceptRT r m) where
  tailRecM f = ExceptRT <<< ExceptT <<< tailRecM \a ->
    case f a of ExceptRT (ExceptT m) ->
      m >>= \m' ->
        pure case m' of
          Right a' -> Done (Right a')
          Left (Loop a1) -> Loop a1
          Left (Done b) -> Done (Left b)

instance altExceptRT :: (Semigroup r, Monad m) => Alt (ExceptRT r m) where
  alt e1 e2 = ExceptRT $ ExceptT $ do
    x1 <- runExceptT $ runExceptRT e1
    case x1 of
      Left a -> pure (Left a)
      Right r1 -> do
        x2 <- runExceptT $ runExceptRT e2
        case x2 of
          Left a' -> pure (Left a')
          Right r2 -> pure (Right (r1 <> r2))

instance plusExceptRT :: (Monoid r, Monad m) => Plus (ExceptRT r m) where
  empty = ExceptRT $ ExceptT $ pure $ Right (mempty :: r)

instance alternativeExceptRT :: (Monoid r, Monad m) => Alternative (ExceptRT r m)

instance monadPlusExceptRT :: (Monoid r, Monad m) => MonadPlus (ExceptRT r m)

instance monadZeroExceptRT :: (Monoid r, Monad m) => MonadZero (ExceptRT r m)

instance monadTransExceptRT :: MonadTrans (ExceptRT r) where
  lift = ExceptRT <<< ExceptT <<< liftM1 Left

instance monadEffExceptRT :: MonadEff eff m => MonadEff eff (ExceptRT r m) where
  liftEff = lift <<< liftEff
