module Main where

import Prelude

import Control.Monad.Eff (Eff)

import Halogen.Util (runHalogenAff, awaitBody)

import Shopie.Effects (ShopieEffects)


main :: Eff (ShopieEffects ()) Unit
main = runHalogenAff do
  body <- awaitBody
  pure unit
