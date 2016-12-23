module Main where

import Shopie.Prelude

import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (liftEff)

import Halogen as H
import Halogen.Util (runHalogenAff, awaitBody)

import Shopie.Application as App
import Shopie.Auth.Types (Oauth2Client, readClient)
import Shopie.Draad (makeDraad)
import Shopie.Effects (ShopieEffects)
import Shopie.Interpreter.ShopieM (runShopieM)


main :: Eff (ShopieEffects ()) Unit
main = runHalogenAff do
  body <- awaitBody
  oauth <- liftEff createOauth
  draad <- makeDraad oauth Nothing "/api/v1"
  let app' = H.interpret (runShopieM draad) App.app
  driver <- H.runUI app' (H.parentState App.initialState) body
  -- TODO setup Route Signal
  pure unit

createOauth :: Eff (ShopieEffects ()) Oauth2Client
createOauth = do
  rc <- readClient
  let emp =
        { clientId: ""
        , clientSecret: ""
        }
      c = fromMaybe emp rc
  pure $
    { clientId: c.clientId
    , clientSecret: c.clientSecret
    , endpoint: "/o/token"
    , revokeEndPoint: "/o/revoke_token"
    }
