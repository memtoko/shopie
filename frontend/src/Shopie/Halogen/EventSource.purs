module Shopie.Halogen.EventSource where

import Prelude

import Control.Monad.Aff (Canceler, forkAff, later', runAff)
import Control.Monad.Aff.AVar (AVAR, AVar, makeVar, putVar, takeVar)
import Control.Monad.Aff.Free (class Affable)
import Control.Monad.Eff.Class (liftEff)

import Data.Either (Either(..))
import Data.Int as Int
import Data.Time.Duration (Milliseconds(..))

import Halogen as H
import Halogen.Query.EventSource as ES

import Math as Math


sendLater
  :: forall s f g eff
  .  (Affable (avar :: AVAR | eff) g, Functor g)
  => Milliseconds
  -> f Unit
  -> H.ComponentDSL s f g (Canceler (avar :: AVAR | eff))
sendLater ms act = do
  canceller <- H.fromAff makeVar
  H.subscribe $ emitOnceEventSource ms act canceller
  H.fromAff $ takeVar canceller

sendLater'
  :: forall s s' f f' g p eff
  .  (Affable (avar :: AVAR | eff) g, Functor g)
  => Milliseconds
  -> f Unit
  -> H.ParentDSL s s' f f' g p (Canceler (avar :: AVAR | eff))
sendLater' ms act = do
  canceller <- H.fromAff makeVar
  H.subscribe' $ emitOnceEventSource ms act canceller
  H.fromAff $ takeVar canceller


raise
  :: forall s f g eff
  .  (Affable (avar :: AVAR | eff) g, Functor g)
  => f Unit
  -> H.ComponentDSL s f g Unit
raise = void <$> sendLater (Milliseconds 0.0)

raise'
  :: forall s s' f f' g p eff
  .  (Affable (avar :: AVAR | eff) g, Functor g)
  => f Unit
  -> H.ParentDSL s s' f f' g p Unit
raise' = void <$> sendLater' (Milliseconds 0.0)

emitOnceEventSource
  :: forall f g eff
  .  (Affable (avar :: AVAR | eff) g, Functor g)
  => Milliseconds
  -> f Unit
  -> AVar (Canceler (avar :: AVAR | eff))
  -> H.EventSource f g
emitOnceEventSource (Milliseconds ms) act c =
  ES.EventSource $ ES.produce \emit ->
    void
      $ runAff (const $ pure unit) (const $ pure unit)
      $ putVar c =<< (forkAff $ delay $ emitAndEnd emit)
  where
    delay = later' (Int.floor $ Math.max ms zero)
    emitAndEnd em = liftEff $ em (Left act) *> em (Right unit)
