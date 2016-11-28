module Shopie.Auth.Validation where

import Prelude

import Control.Applicative.Free (foldFreeAp)
import Control.Monad.Eff.Exception.Unsafe (unsafeThrow)

import Data.Bifunctor (lmap)
import Data.Either (Either, either)
import Data.Map (Map, singleton)
import Data.Validation.Semigroup (V, invalid)

import Shopie.Auth.Types (Email, Passwords)
import Shopie.Validation (Validator, Field(..), FieldName, Form, nes, email)


newtype AuthInfo = AuthInfo
  { email :: Email
  , passwords :: Passwords
  }

authInfoV :: Form AuthInfo
authInfoV =
  AuthInfo <$> ({ email: _
                , passwords: _
                } <$> email "Email"
                  <*> nes "Passwords")

runAuthInfoV :: Email -> Passwords -> V (Map String String) AuthInfo
runAuthInfoV e p = foldFreeAp (\(Field x) -> validate x.name x.validator) authInfoV
  where
    validate :: forall a. FieldName -> Validator a -> V (Map String String) a
    validate n v = case n of
      "Email" -> toV n (v e)
      "Passwords" -> toV n $ lmap (const "Please, enter your passwords") (v p)
      _ -> unsafeThrow ("Unexpected field: " <> n)

    toV :: forall a b. FieldName -> Either a b -> V (Map FieldName a) b
    toV k = either (invalid <<< singleton k) pure
