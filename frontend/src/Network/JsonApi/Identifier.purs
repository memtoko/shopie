module Network.JsonApi.Identifier
  ( Identifier(..)
  , class JsonApiIdentifier
  , toMaybeKvs
  , identifier
  ) where

import Prelude

import Data.Array as A
import Data.Argonaut.Core (JAssoc)
import Data.Argonaut.Decode (class DecodeJson, decodeJson, (.?))
import Data.Argonaut.Decode.Combinators ((.??))
import Data.Argonaut.Encode (class EncodeJson, encodeJson, (:=))
import Data.Maybe (Maybe(..))
import Data.StrMap as SM
import Data.Tuple (Tuple(Tuple))

import Network.JsonApi.Meta (Meta)


data Identifier = Identifier
  { ident :: Maybe String
  , datatype :: String
  , metadata :: Maybe Meta
  }

toMaybeKvs :: Identifier -> Array (Maybe JAssoc)
toMaybeKvs (Identifier ident) =
  [ (Tuple "id" <<< encodeJson) <$> ident.ident
  , Just $ "type" := ident.datatype
  , (Tuple "meta" <<< encodeJson) <$> ident.metadata
  ]

instance eqIdentifier :: Eq Identifier where
  eq (Identifier a) (Identifier b) =
    a.ident == b.ident
    && a.datatype == b.datatype
    && a.metadata == b.metadata

instance showIdentifier :: Show Identifier where
  show (Identifier a) =
    "(Identifier " <> show a.ident <> " " <> show a.datatype <> " " <> show a.metadata <> " )"

instance encodeJsonIdentifier :: EncodeJson Identifier where
  encodeJson = encodeJson <<< SM.fromFoldable <<< A.catMaybes <<< toMaybeKvs

instance decodeJsonIdentifier :: DecodeJson Identifier where
  decodeJson = decodeJson >=> \v ->
    { ident: _
    , datatype: _
    , metadata: _
    }
    <$> (v .?? "id")
    <*> (v .? "type")
    <*> (v .?? "meta")
    <#> Identifier

-- | Typeclass indicating how to access an 'Identifier' for a given datatype
class JsonApiIdentifier a where
  identifier :: a -> Identifier
