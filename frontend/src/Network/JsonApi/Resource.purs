module Network.JsonApi.Resource
  ( Resource(..)
  , class ResourceAble
  , fromResource
  , toResource
  , Relationships
  , Relationship
  , mkResource
  , mkRelationship
  , mkRelationships
  ) where

import Prelude

import Data.Array as A
import Data.Argonaut.Core (JAssoc, jsonEmptyObject)
import Data.Argonaut.Decode (class DecodeJson, decodeJson, (.?))
import Data.Argonaut.Decode.Combinators ((.??))
import Data.Argonaut.Encode (class EncodeJson, encodeJson, (~>), (:=))
import Data.StrMap as SM
import Data.Maybe (Maybe(..))
import Data.Monoid (class Monoid)
import Data.Tuple (Tuple(Tuple))

import Network.JsonApi.Identifier (class JsonApiIdentifier, Identifier(..), toMaybeKvs, identifier)
import Network.JsonApi.Link (Links)


data Resource a = Resource
  { identifier :: Identifier
  , resource :: a
  , links :: Maybe Links
  , relationships :: Maybe Relationships
  }

instance encodeJsonResource :: EncodeJson a => EncodeJson (Resource a) where
  encodeJson rs@(Resource r) = encodeJson $ SM.fromFoldable $ A.catMaybes kvs
    where
      kvs :: Array (Maybe JAssoc)
      kvs = toMaybeKvs (identifier rs) <> resourceKvs

      resourceKvs :: Array (Maybe JAssoc)
      resourceKvs =
        [ Just $ "attributes" := r.resource
        , Tuple "links" <<< encodeJson <$> r.links
        , Tuple "relationships" <<< encodeJson <$> r.relationships
        ]

instance decodeJsonResource :: DecodeJson a => DecodeJson (Resource a) where
  decodeJson json = decodeJson json >>= \v ->
    { identifier: _
    , resource: _
    , links: _
    , relationships: _
    }
    <$> ({ ident: _
         , datatype: _
         , metadata: _
         } <$> (v .?? "id")
           <*> (v .? "type")
           <*> (v .?? "meta")
           <#> Identifier
        )
    <*> (v .? "attributes")
    <*> (v .?? "links")
    <*> (v .?? "relationships")
    <#> Resource

class ResourceAble r where
  fromResource :: Resource ~> r
  toResource :: r ~> Resource

instance jsonApiIdentifierResource :: JsonApiIdentifier (Resource a) where
  identifier (Resource a) = a.identifier

instance resourceAbleResource :: ResourceAble Resource where
  fromResource = id
  toResource = id

mkResource :: forall a. Identifier -> a -> Maybe Links -> Maybe Relationships -> Resource a
mkResource ide a lnk rl =
  Resource
    { identifier: ide
    , resource: a
    , links: lnk
    , relationships: rl
    }

mkRelationships :: Relationship -> Relationships
mkRelationships rl =
  Relationships $ SM.singleton (relationshipType rl) rl

relationshipType :: Relationship -> String
relationshipType (Relationship rl) = case rl._data of
  Nothing -> "unidentified"
  Just (Identifier ident) -> ident.datatype

mkRelationship :: Maybe Identifier -> Maybe Links -> Maybe Relationship
mkRelationship Nothing Nothing = Nothing
mkRelationship resId lnk = Just $ Relationship { _data: resId, _links: lnk }

data Relationship = Relationship
  { _data :: Maybe Identifier
  , _links :: Maybe Links
  }

instance encodeJsonRelationship :: EncodeJson Relationship where
  encodeJson (Relationship a) =
    "data" := a._data
    ~> "links" := a._links
    ~> jsonEmptyObject

instance decodeJsonRelationship :: DecodeJson Relationship where
  decodeJson = decodeJson >=> \obj ->
    { _data: _
    , _links: _
    }
    <$> (obj .? "data")
    <*> (obj .? "links")
    <#> Relationship

data Relationships = Relationships (SM.StrMap Relationship)

instance encodeJsonRelationships :: EncodeJson Relationships where
  encodeJson (Relationships a) = encodeJson a

instance decodeJsonRelationships :: DecodeJson Relationships where
  decodeJson json = Relationships <$> decodeJson json

instance semigroupRelationships :: Semigroup Relationships where
  append (Relationships a) (Relationships b) = Relationships $ SM.union a b

instance monoidRelationships :: Monoid Relationships where
  mempty = Relationships $ SM.empty
