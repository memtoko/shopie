module Shopie.User.Model
  ( UserRecord
  , User
  , UserAttributes
  , user
  , unAttr
  , user'
  , userLink
  , _user
  , _uid
  , _attr
  , _userR
  , _firstName
  , _lastName
  , _email
  , _username
  ) where

import Shopie.Prelude

import Data.Argonaut.Core (jsonEmptyObject)
import Data.Argonaut.Decode (class DecodeJson, decodeJson, (.?))
import Data.Argonaut.Encode (class EncodeJson, (~>), (:=))
import Data.Generic (class Generic, gEq)
import Data.List as L
import Data.Lens (Lens, Lens', lens, _1, _2)
import Data.Lens.Iso.Newtype (_Newtype)

import Network.JsonApi.Identifier (Identifier(..), class JsonApiIdentifier, identifier)
import Network.JsonApi.Link (mkLinks)
import Network.JsonApi.Resource (Resource(..), class ResourceAble, mkResource)


-- | Our user can be a 'Staff' or `Customer`
newtype User a = User (Tuple (Maybe String) a)

-- | create an user with `a` is UserAttributes
user :: Maybe String -> UserRecord -> User UserAttributes
user m attr = User $ Tuple m (UserAttributes attr)

-- | create an user with `a` can be anything
user' :: forall a. Maybe String -> a -> User a
user' m attr = User $ Tuple m attr

-- | Build links to user
userLink :: forall a. User a -> Maybe String
userLink u =
  let
    ident = case identifier u of Identifier i -> i
  in
    (\x -> "/users/" <> x) <$> ident.ident

unAttr :: UserAttributes -> UserRecord
unAttr = case _ of UserAttributes a -> a

_user :: forall a b. Lens (User a) (User b) (Tuple (Maybe String) a) (Tuple (Maybe String) b)
_user = _Newtype

_uid :: forall a. Lens' (User a) (Maybe String)
_uid = _user <<< _1

_attr :: forall a b. Lens (User a) (User b) a b
_attr = _user <<< _2

_userR :: Lens' UserAttributes UserRecord
_userR = _Newtype

_firstName :: forall a r. Lens' { firstName :: a | r} a
_firstName = lens _.firstName _{ firstName = _ }

_lastName :: forall a r. Lens' { lastName :: a | r } a
_lastName = lens _.lastName _{ lastName = _ }

_email :: forall a r. Lens' { email :: a | r } a
_email = lens _.email _{ email = _ }

_username :: forall a r. Lens' { username :: a | r } a
_username = lens _.username _{ username = _ }

derive instance newtypeUser :: Newtype (User a) _
derive instance eqUser :: Eq a => Eq (User a)
derive instance ordUser :: Ord a => Ord (User a)

instance showUser :: Show a => Show (User a) where
  show (User u) = "(User " <> show u <> " )"

instance jsonApiIdentifierUser :: JsonApiIdentifier (User a) where
  identifier u =
    Identifier
      { ident: fst $ unwrap u
      , datatype: "users"
      , metadata: Nothing
      }

instance resourceAbleUser :: ResourceAble User where
  fromResource (Resource rs) =
    case rs.identifier of
      Identifier ident ->
        user' ident.ident rs.resource
  toResource u =
    let
      links = (mkLinks <<< L.singleton <<< (Tuple "self")) <$> userLink u
    in
      mkResource (identifier u) (snd $ unwrap u) links Nothing

-- | A basic record for User
type UserRecord =
  { firstName :: String
  , lastName :: String
  , username :: String
  , email :: String
  }

-- | User Attributes used to encode and decode data come from our API in JSON API
-- | format.
newtype UserAttributes = UserAttributes
  { firstName :: String
  , lastName :: String
  , username :: String
  , email :: String
  }

derive instance newtypeUserAttributes :: Newtype UserAttributes _

instance showUserAttributes :: Show UserAttributes where
  show (UserAttributes attr) =
    attr.firstName <> " " <> attr.lastName <> " <" <> attr.email <> ">"

derive instance genericUserAttributes :: Generic UserAttributes

instance eqUserAttributes :: Eq UserAttributes where
  eq = gEq

instance encodeJsonUserAttributes :: EncodeJson UserAttributes where
  encodeJson (UserAttributes attr) =
    "first_name" := attr.firstName
    ~> "last_name" := attr.lastName
    ~> "username" := attr.username
    ~> "email" := attr.email
    ~> jsonEmptyObject

instance decodeJsonUserAttributes :: DecodeJson UserAttributes where
  decodeJson = decodeJson >=> \obj ->
    { firstName: _
    , lastName: _
    , username: _
    , email: _
    }
    <$> (obj .? "first_name")
    <*> (obj .? "last_name")
    <*> (obj .? "username")
    <*> (obj .? "email")
    <#> UserAttributes
