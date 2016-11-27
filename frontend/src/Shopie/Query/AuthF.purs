module Shopie.Query.AuthF where

import Prelude

import Shopie.Query.SessionF (SessionF)


-- | The auth query algebra
data AuthF s c m a
  = AuthSF (SessionF s a)
  | Lift (m a)
  | Halt String
  | Login c a
  | Forgotten c a
  | Logout a

instance functorAuthF :: Functor m => Functor (AuthF s c m) where
  map f = case _ of
    AuthSF g -> AuthSF (map f g)
    Lift q -> Lift (map f q)
    Halt msg -> Halt msg
    Login c a -> Login c (f a)
    Forgotten c a -> Forgotten c (f a)
    Logout a -> Logout (f a)
