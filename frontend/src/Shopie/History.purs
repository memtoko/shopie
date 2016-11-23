module Shopie.History
  ( History()
  , Title()
  , URL()
  , Delta()
  , go
  , forward
  , back
  , mkState
  , replaceState
  , pushState ) where

import Prelude

import Control.Monad.Eff (Eff)


type Title = String

type Delta = Number

type URL = String

-- | Record to represent browser history state
type State d =
  { data :: d
  , title :: Title
  , url :: URL }

foreign import data History :: * -> !

go :: forall d eff. Delta -> Eff (history :: History d | eff) Unit
go = go_

forward :: forall d eff. Eff (history :: History d | eff) Unit
forward = forward_

back :: forall d eff. Eff (history :: History d | eff) Unit
back = back_

-- | make State
mkState :: forall d. Title -> URL -> d -> State d
mkState t u d = { title: t, url: u, data: d }

-- | replace browser history
replaceState :: forall d eff. State d -> Eff (history :: History d | eff) Unit
replaceState = update_ "replaceState"

-- | push browser state
pushState :: forall d eff. State d -> Eff (history :: History d | eff) Unit
pushState = update_ "pushState"

foreign import update_ :: forall d eff. String -> (State d) -> (Eff (history :: History d | eff) Unit)

foreign import go_ :: forall d eff. Delta -> Eff (history :: History d | eff) Unit

foreign import forward_ :: forall d eff. Eff (history :: History d | eff) Unit

foreign import back_ :: forall d eff. Eff (history :: History d | eff) Unit
