module Shopie.Validation where

import Prelude

import Control.Applicative.Lift (Errors, failure)

import Data.Int (fromString)
import Data.Map as M
import Data.Maybe (maybe)

import Text.Email.Validate as EV


type Label = M.Map String String

nes'
  :: forall m
   . Semigroup m
  => (String -> m)
  -> String
  -> Errors m String
nes' f v
  | v == ""   = failure (f "is empty")
  | otherwise = pure v

nes :: String -> String -> Errors Label String
nes lb = nes' $ M.singleton lb

int'
  :: forall m
   . Semigroup m
  => (String -> m)
  -> String
  -> Errors m Int
int' f v = maybe (failure (f "is not an integers")) pure (fromString v)

int :: String -> String -> Errors Label Int
int lb = int' $ M.singleton lb

email'
  :: forall m
   . Semigroup m
  => (String -> m)
  -> String
  -> Errors m String
email' f v = maybe (failure $ f "is not a valid email") (pure <<< show) (EV.emailAddress v)

email :: String -> String -> Errors Label String
email lb = email' $ M.singleton lb

-- | Take a Map and update by union operations on records errors fields.
unionError :: forall r. Label -> { errors :: Label | r } -> { errors :: Label | r }
unionError m r = r { errors = M.union m r.errors }

-- | Clear error fields.
clearError :: forall r. { errors :: Label | r } -> { errors :: Label | r }
clearError = (_ { errors = M.empty } )

deleteError :: forall a r. String -> a -> { errors :: Label | r } -> { errors :: Label | r }
deleteError k _ s = s { errors = M.delete k s.errors }

setError :: forall r. Label -> { errors :: Label | r } -> { errors :: Label | r }
setError e s = s { errors = e }
