module Shopie.Effects where

import Control.Monad.Eff.Clock (CLOCK)
import Control.Monad.Eff.Console (CONSOLE)
import Control.Monad.Eff.Random (RANDOM)
import Control.Monad.Eff.Ref (REF)

import Network.HTTP.Affjax (AJAX)

import Halogen.Effects (HalogenEffects)

type ShopieEffects eff = HalogenEffects (RawShopieEffects eff)

type RawShopieEffects eff =
  ( ajax :: AJAX
  , console :: CONSOLE
  , clock :: CLOCK
  , random :: RANDOM
  , ref :: REF
  | eff
  )
