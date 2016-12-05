module Network.JsonApi.Document
  ( Document
  , UnDocument
  , Included
  , mkDocument
  , mkCompoundDocument
  , mkIncludedResource
  , unDocument
  ) where

import Prelude

import Data.Array as A
import Data.Argonaut.Core (JAssoc, Json, isArray, isObject)
import Data.Argonaut.Decode (class DecodeJson, decodeJson, (.?))
import Data.Argonaut.Decode.Combinators ((.??))
import Data.Argonaut.Encode (class EncodeJson, encodeJson, (:=))
import Data.Either (Either(..))
import Data.Foldable (class Foldable, foldMap)
import Data.List (List(..))
import Data.List as L
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Monoid (class Monoid)
import Data.StrMap as SM
import Data.Tuple (Tuple(Tuple))

import Network.JsonApi.Link (Links)
import Network.JsonApi.Meta (Meta)
import Network.JsonApi.Resource (Resource, class ResourceAble, toResource)


data Document a = Document
  { _data :: ResourceData a
  , _links :: Maybe Links
  , _meta :: Maybe Meta
  , _included :: List Json
  }

instance decodeJsonDocument :: DecodeJson a => DecodeJson (Document a) where
  decodeJson = decodeJson >=> \v ->
    { _data: _
    , _links: _
    , _meta: _
    , _included: _
    }
    <$> (v .? "data")
    <*> (v .?? "links")
    <*> (v .?? "meta")
    <*> (map (fromMaybe Nil) $ v .?? "included")
    <#> Document

instance encodeJsonDocument :: EncodeJson a => EncodeJson (Document a) where
  encodeJson (Document a) = encodeJson $ SM.fromFoldable $ A.catMaybes kvs
    where
      kvs :: Array (Maybe JAssoc)
      kvs = [ Just $ "data" := a._data
            , Just $ "included" := a._included
            , (Tuple "meta" <<< encodeJson) <$> a._meta
            , (Tuple "links" <<< encodeJson) <$> a._links
            ]

mkDocument
  :: forall f a b
  .  (Foldable f, ResourceAble b)
  => Maybe Links
  -> Maybe Meta
  -> f (b a)
  -> Document a
mkDocument l m r =
  Document
    { _data : toResourceData r
    , _links: l
    , _meta: m
    , _included: Nil
    }

mkCompoundDocument
  :: forall f a b
  .  (Foldable f, ResourceAble b)
  => Maybe Links
  -> Maybe Meta
  -> Included
  -> f (b a)
  -> Document a
mkCompoundDocument l m (Included c) r =
  Document
    { _data : toResourceData r
    , _links: l
    , _meta: m
    , _included: c
    }

mkIncludedResource :: forall a. EncodeJson a => Resource a -> Included
mkIncludedResource = Included <<< L.singleton <<< encodeJson

toResourceData
  :: forall f a b
  .  (Foldable f, ResourceAble b)
  => f (b a)
  -> ResourceData a
toResourceData xs = smartC $ foldMap (L.singleton <<< toResource) xs
  where
    smartC (Cons a Nil) = Singleton a
    smartC ys = Collections ys

type UnDocument a =
  { resources :: List (Resource a)
  , links :: Maybe Links
  , meta :: Maybe Meta
  , included :: List Json
  }

unDocument :: forall a. Document a -> UnDocument a
unDocument (Document a) =
  { resources: unResourceData a._data
  , links: a._links
  , meta: a._meta
  , included: a._included
  }

unResourceData :: forall a. ResourceData a -> List (Resource a)
unResourceData (Singleton a) = L.singleton a
unResourceData (Collections a) = a

data ResourceData a
  = Singleton (Resource a)
  | Collections (List (Resource a))

instance decodeJsonResourceData :: DecodeJson a => DecodeJson (ResourceData a) where
  decodeJson = decodeJson >=> \v ->
    case isArray v, isObject v of
      true, false -> Collections <$> decodeJson v
      false, true -> Singleton <$> decodeJson v
      _, _ -> Left "no valid resource data"

instance encodeJsonResourceData :: EncodeJson a => EncodeJson (ResourceData a) where
  encodeJson (Singleton a) = encodeJson a
  encodeJson (Collections a) = encodeJson a

data Included = Included (List Json)

instance semigroupIncluded :: Semigroup Included where
  append (Included xs) (Included ys) = Included $ (xs <> ys)

instance monoidIncluded :: Monoid Included where
  mempty = Included $ Nil
