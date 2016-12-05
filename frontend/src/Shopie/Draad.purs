module Shopie.Draad
  ( Draad(..)
  , makeDraad
  ) where

import Prelude

import Control.Monad.Aff.Bus as Bus
import Control.Monad.Aff.Free (class Affable, fromAff, fromEff)
import Control.Monad.Eff.Ref (Ref, newRef)

import Data.Maybe (Maybe(Nothing))

import Shopie.Auth.Types (Oauth2Client, BearerToken, UserId)
import Shopie.Effects (ShopieEffects)
import Shopie.Query.AuthF (AuthMessage)
import Shopie.Query.Notification (Notification)


-- | for now we only need this
newtype Draad = Draad
  { notify :: Bus.BusRW Notification
  , auth :: Bus.BusRW AuthMessage
  --, route :: Bus.BusRW Routes
  , oauth2b :: Ref Oauth2Client
  , tokenAuth :: Ref (Maybe BearerToken)
  , apiEndpoint :: Ref String
  , userInfo :: Ref (Maybe UserId)
  }

makeDraad
  :: forall m eff
  .  (Affable (ShopieEffects eff) m)
  => Oauth2Client
  -> Maybe BearerToken
  -> String
  -> m Draad
makeDraad oauth tok' api = fromAff do
  notify <- Bus.make
  auth <- Bus.make
  --route <- Bus.make
  oauth2b <- fromEff $ newRef oauth
  tok <- fromEff $ newRef tok'
  endP <- fromEff $ newRef api
  userInfo <- fromEff $ newRef Nothing
  pure $ Draad
    { notify: notify
    , auth: auth
    --, route: route
    , oauth2b: oauth2b
    , tokenAuth: tok
    , apiEndpoint: endP
    , userInfo : userInfo
    }
