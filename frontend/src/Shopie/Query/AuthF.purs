module Shopie.Query.AuthF where

import Prelude

import Data.Maybe (Maybe)

import Shopie.Auth.Types (AuthResult, Creds, Email, UserId)

-- | The auth query algebra
data AuthF a
  = Authenticate Creds (AuthResult -> a)
  | GetAuthId Creds (Maybe UserId -> a)
  | Invalidate (AuthResult -> a)
  | Forgotten Email a

instance functorAuthF :: Functor AuthF where
  map f = case _ of
    Authenticate c g -> Authenticate c (f <<< g)
    GetAuthId c g -> GetAuthId c (f <<< g)
    Invalidate g -> Invalidate (f <<< g)
    Forgotten e a -> Forgotten e (f a)

-- | Bus
data AuthMessage
  = AuthSuccess
  | AuthFailure
  | InvalidateRequest
  | ForgotRequestSuccess

derive instance authMessageEq :: Eq AuthMessage

-- | Not really need this, just handy when debugging
instance authMessageShow :: Show AuthMessage where
  show = case _ of
    AuthSuccess -> "AuthSuccess"
    AuthFailure -> "AuthFailure"
    InvalidateRequest -> "InvalidateRequest"
    ForgotRequestSuccess -> "ForgotRequestSuccess"
