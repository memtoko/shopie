module Shopie.Validation where

import Prelude

import Control.Applicative.Free (FreeAp, liftFreeAp)

import Data.Either (Either(..))
import Data.Function.Uncurried (Fn3, runFn3)
import Data.Int (fromString)
import Data.Maybe (Maybe, maybe)


-- | Validator tries to read value or generates error message.
type Validator a = String -> Either String a

-- | Convenient synonym for field name.
type Name = String

-- | Convenient synonym for help name
type Help = String

-- |  A single field of a form.
newtype Field a = Field
  { name :: Name -- | Field name
  , help :: Help -- | Help message
  , validator :: Validator a -- | Pure validation function.
  }

-- | Validation form is just a free applicative over Field.
type Form = FreeAp Field

-- | Build a form with a single field.
field :: forall a. Name -> Validator a -> Help -> Form a
field n v h = liftFreeAp $ Field { name: n, help: h, validator: v }

-- | Non empty string validation
nes :: Name -> Form String
nes n = field n validate (n <> " field cant be an empty string")
  where
    validate :: String -> Either String String
    validate v =
      if v == "" then Left (n <> ": Invalid String") else Right v

-- | Validate a value is an integer
int :: Name -> Form Int
int n = field n (validate <<< fromString) "Enter an integer value"
  where
    validate :: forall a. Maybe a -> Either String a
    validate = maybe (Left (n <> ": Invalid Int")) Right

-- | Validate a value is an email address
email :: Name -> Form String
email n = field n (\v -> runFn3 _validateEmail Left Right v) "Enter an email address"

foreign import _validateEmail :: Fn3 (forall x y. x -> Either x y) (forall x y. y -> Either x y) String (Either String String)
