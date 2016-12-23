module Network.JsonApi.Meta
  ( Meta(..)
  ) where

import Prelude

import Data.Argonaut.Core (JObject)
import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Monoid (class Monoid)
import Data.StrMap as SM


data Meta = Meta JObject

instance eqMeta :: Eq Meta where
  eq (Meta a) (Meta b) = a == b

instance showMeta :: Show Meta where
  show (Meta a) = "(Meta " <> show a <> " )"

instance decodeJsonMeta :: DecodeJson Meta where
  decodeJson json = Meta <$> decodeJson json

instance encodeJsonMeta :: EncodeJson Meta where
  encodeJson (Meta mt) = encodeJson mt

instance semigroupMeta :: Semigroup Meta where
  append (Meta a) (Meta b) = Meta $ SM.union a b

instance monoidMeta :: Monoid Meta where
  mempty = Meta $ SM.empty
