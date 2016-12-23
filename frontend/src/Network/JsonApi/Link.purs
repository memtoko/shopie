module Network.JsonApi.Link
  ( Href
  , Links(..)
  , mkLinks
  ) where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Foldable (class Foldable)
import Data.StrMap as SM
import Data.Tuple (Tuple)

type Href = String

data Links = Links (SM.StrMap Href)

instance eqLinks :: Eq Links where
  eq (Links a) (Links b) = a == b

instance showLinks :: Show Links where
  show (Links a) = "(Link " <> show a <> " )"

instance decodeJsonLinks :: DecodeJson Links where
  decodeJson json = Links <$> decodeJson json

instance encodeJsonLinks :: EncodeJson Links where
  encodeJson (Links mt) = encodeJson mt

-- | make link from Foldable instance
mkLinks :: forall f. Foldable f => f (Tuple String Href) -> Links
mkLinks = Links <<< SM.fromFoldable
