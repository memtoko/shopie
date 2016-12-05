module Shopie.Ajax where


import Prelude

import Network.HTTP.Affjax as AJ
import Network.HTTP.RequestHeader (RequestHeader(..))
import Data.MediaType (MediaType(..))
import Data.MediaType.Common (applicationJSON, applicationFormURLEncoded)


-- | Our default request for auth
defaultRequestAuth :: AJ.AffjaxRequest Unit
defaultRequestAuth = AJ.defaultRequest { headers = defaulHeaders }
  where
  defaulHeaders :: Array RequestHeader
  defaulHeaders =
    [ Accept $ applicationJSON
    , ContentType $ applicationFormURLEncoded
    ]

-- | Our default request for Api
defaultRequestApi :: AJ.AffjaxRequest Unit
defaultRequestApi = AJ.defaultRequest { headers = defaulHeaders }
  where
  defaulHeaders :: Array RequestHeader
  defaulHeaders =
    [ Accept $ MediaType $ "application/vnd.api+json"
    , ContentType $ MediaType $ "application/vnd.api+json"
    ]
