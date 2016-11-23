module Shopie.Query.SessionF where

import Prelude

import Control.Monad.Eff (Eff)

import Data.Bifunctor (lmap)
import Data.Tuple (Tuple)

import DOM


-- | The session algebra.
data SessionF s a
  = GetSession (s -> a)
  | PersistSession s a
  | ModifySession (s -> Tuple a s)

instance functorSessionF :: Functor (SessionF s) where
  map f = case _ of
    GetSession g -> GetSession (f <<< g)
    PersistSession s a -> PersistSession s (f a)
    ModifySession g -> ModifySession (lmap f <<< g)

-- | Subscribe to Local Storage events
foreign import subscribeToLS :: forall a eff. String
                             -> (a -> Eff (dom :: DOM | eff) Unit)
                             -> Eff (dom :: DOM | eff) Unit

-- | Read data from Local Storage for a given key
foreign import restoreSessionData :: forall a eff. String
                                  -> (a -> Eff (dom :: DOM | eff) Unit)
                                  -> Eff (dom :: DOM | eff) Unit
