module Shopie.Route.Class where


import Shopie.Prelude

import Control.Monad.Free (Free, liftF)

import Halogen.Query.EventSource as ES
import Halogen.Query.HalogenF as HF

import Shopie.Route.Types (Locations)


class NavigateDSL (m :: * -> *) where
  navigate :: Locations -> m Unit

instance navigateDSLMaybeT :: (Monad m, NavigateDSL m) => NavigateDSL (MaybeT m) where
  navigate = lift <<< navigate

instance navigateDSLExceptT :: (Monad m, NavigateDSL m) => NavigateDSL (ExceptT e m) where
  navigate = lift <<< navigate

instance navigateDSLFree :: NavigateDSL f => NavigateDSL (Free f) where
  navigate = liftF <<< navigate

instance navigateDSLHalogenF :: NavigateDSL g => NavigateDSL (HF.HalogenFP ES.EventSource s f g) where
  navigate = HF.QueryHF <<< navigate

instance navigateDSLHalogenFP :: NavigateDSL g => NavigateDSL (HF.HalogenFP ES.ParentEventSource s f (Free (HF.HalogenFP ES.EventSource s' f' g))) where
  navigate = HF.QueryHF <<< navigate
