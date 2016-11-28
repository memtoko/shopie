module Shopie.Auth.Types where

import Prelude

import Data.Argonaut (class EncodeJson, class DecodeJson, decodeJson, encodeJson, jsonEmptyObject, (~>), (:=), (.?))
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Tuple (Tuple)


-- | UserId, this can be an email or username.
newtype UserId = UserId String

derive instance eqUserID :: Eq UserId
derive instance ordUserId :: Ord UserId
derive instance newtypeUserId :: Newtype UserId _

instance encodeJsonUserId :: EncodeJson UserId where
  encodeJson (UserId d) = encodeJson d

instance decodeJsonUserId :: DecodeJson UserId where
  decodeJson = map UserId <<< decodeJson

-- | Type synonym for single field of oauth2 token
type AccessToken = String
type RefreshToken = String
type TokenType = String
type TokenExpires = Number

-- | BearerToken that returned by Oauth2 Server. access_token field changed to
-- | bearer_token, but our server doesn't yet.
newtype BearerToken = BearerToken
  { accessToken :: AccessToken
  , tokenType :: TokenType
  , expiresIn :: TokenExpires
  , refreshToken :: RefreshToken
  }

instance encodeJsonBearerToken :: EncodeJson BearerToken where
  encodeJson (BearerToken oauth2) =
    "access_token" := oauth2.accessToken
    ~> "token_type" := oauth2.tokenType
    ~> "expires_in" := oauth2.expiresIn
    ~> "refresh_token" := oauth2.refreshToken
    ~> jsonEmptyObject

instance decodeJsonBearerToken :: DecodeJson BearerToken where
  decodeJson = decodeJson >=> \obj ->
    { accessToken: _
    , tokenType: _
    , expiresIn: _
    , refreshToken: _
    }
    <$> (obj .? "access_token")
    <*> (obj .? "token_type")
    <*> (obj .? "expires_in")
    <*> (obj .? "refresh_token")
    <#> BearerToken

-- | A type synonym for credentials
type Email = String
type Passwords = String
type GrantType = String

-- | Credential
newtype Creds = Creds
  { plugin :: String
  , email :: Maybe Email
  , passwords :: Maybe Passwords
  , extra :: Array (Tuple String String)
  }

-- |
passwordCreds :: Email -> Passwords -> Creds
passwordCreds e p = Creds
  { plugin: "Oauth2Pass"
  , email: Just e
  , passwords: Just p
  , extra: []
  }

-- | Authentication Result
data AuthResult
  = Authenticated String
  | Invalidated String
  | UserError String
  | ServerError String

derive instance eqAuthResult :: Eq AuthResult

instance showAuthResult :: Show AuthResult where
  show = case _ of
    Authenticated s -> "(Authenticated " <> s <> ")"
    Invalidated s -> "(Invalidated " <> s <> ")"
    UserError s -> "(UserError " <> s <> ")"
    ServerError s -> "(ServerError" <> s <> ")"

class AuthDSL m where
  -- | authenticate a given credentials
  authenticate :: Creds -> m AuthResult
  -- | getAuthId
  getAuthId :: Creds -> m (Maybe UserId)
  -- | invalidate the current user. Should be okay calling this multiple times.
  invalidate :: m AuthResult

-- | Oauth2Passwords records
type Oauth2Passwords =
  { email :: Email
  , passwords :: Passwords
  , grantType :: GrantType
  }

-- | Oauth2Client
type Oauth2Client =
  { clientId :: String
  , clientSecret :: String
  , endpoint :: String
  , revokeEndPoint :: String
  }
