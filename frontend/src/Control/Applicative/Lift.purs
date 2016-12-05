module Control.Applicative.Lift where

import Prelude

import Control.Alt (class Alt, (<|>))
import Control.Alternative (class Alternative)
import Control.Plus (class Plus, empty)

import Data.Const (Const(..))
import Data.Foldable (class Foldable, foldMap, foldr, foldl)
import Data.Either (Either(..), either)
import Data.Traversable (class Traversable, traverse, sequence)


data Lift f a = Pure a | Lifted (f a)

derive instance eqLift :: (Eq (f a), Eq a) => Eq (Lift f a)
derive instance ordLift :: (Ord (f a), Ord a) => Ord (Lift f a)

instance showLift :: (Show (f a), Show a) => Show (Lift f a) where
  show (Pure x) = "(Pure " <> show x <> ")"
  show (Lifted g) = "(Lifted " <> show g <> ")"

instance functorLift :: Functor f => Functor (Lift f) where
  map f (Pure a) = Pure (f a)
  map f (Lifted g) = Lifted (f <$> g)

instance foldableLift :: Foldable f => Foldable (Lift f) where
  foldr f z (Pure a) = f a z
  foldr f z (Lifted g) = foldr f z g
  foldl f z (Pure a) = f z a
  foldl f z (Lifted g) = foldl f z g
  foldMap f (Pure a) = f a
  foldMap f (Lifted g) = foldMap f g

instance traversableLift :: Traversable f => Traversable (Lift f) where
  traverse f (Pure a) = Pure <$> f a
  traverse f (Lifted g) = Lifted <$> traverse f g
  sequence (Pure a) = Pure <$> a
  sequence (Lifted g) = Lifted <$> sequence g

instance applyLift :: Apply f => Apply (Lift f) where
  apply (Pure f) (Pure x) = Pure (f x)
  apply (Pure f) (Lifted g) = Lifted (f <$> g)
  apply (Lifted f) (Lifted g) = Lifted (f <*> g)
  apply (Lifted f) (Pure x) = Lifted ((\g -> g x) <$> f)

instance applicativeLift :: Apply f => Applicative (Lift f) where
  pure = Pure

instance altLift :: Alt f => Alt (Lift f) where
  alt (Pure x) _ = Pure x
  alt (Lifted _) (Pure y) = Pure y
  alt (Lifted x) (Lifted y) = Lifted (x <|> y)

instance plusLift :: Plus f => Plus (Lift f) where
  empty = Lifted empty

instance alternativeLift :: Alternative f => Alternative (Lift f)

-- | unlift
unlift :: forall f a. Applicative f => Lift f a -> f a
unlift (Pure x) = pure x
unlift (Lifted g) = g

mapLift
  :: forall f g
   . (Applicative f, Applicative g)
  => (f ~> g)
  -> Lift f
  ~> Lift g
mapLift _ (Pure x) = Pure x
mapLift f (Lifted g) = Lifted (f g)

-- | An applicative functor that collects a monoid (e.g. lists) of errors.
-- | A sequence of computations fails if any of its components do
type Errors e a = Lift (Const e) a

runErrors :: forall e. Errors e ~> Either e
runErrors (Lifted (Const e)) = Left e
runErrors (Pure x) = Right x

failure :: forall e a. e -> Errors e a
failure e = Lifted (Const e)

-- | Create an Errors Applicative from an Either
fromEitherE :: forall e. Semigroup e => Either e ~> Errors e
fromEitherE = either failure pure
