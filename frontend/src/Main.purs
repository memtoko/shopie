module Main where

import Prelude

import Control.Monad.Eff (Eff)

import Halogen as H
import Halogen.Util (runHalogenAff, awaitBody)

import Component.Auth (initialAuth, auth)

main :: Eff (H.HalogenEffects ()) Unit
main = runHalogenAff do
  body <- awaitBody
  H.runUI auth (H.parentState initialAuth) body
