module Shopie.Utils.Storage
  ( setSessionStorage
  , getSessionStorage
  , removeSessionStorage
  , setLocalStorage
  , getLocalStorage
  , removeLocalStorage
  ) where

import Prelude

import Control.Monad.Eff (Eff)

import Data.Maybe (Maybe(..), maybe)
import Data.Argonaut (class DecodeJson, class EncodeJson, decodeJson, jsonParser, encodeJson, printJson)
import Data.Either (Either(..))
import Data.Function.Uncurried (Fn3, Fn2, runFn3, runFn2)

import DOM (DOM)

-- | set sessionStorage
setSessionStorage
  :: forall a e
  .  EncodeJson a
  => String
  -> a
  -> (Eff (dom :: DOM | e) Unit)
setSessionStorage k =
  runFn2 _setSessionStorage k <<< printJson <<< encodeJson

-- | get a data from sessionStorage
getSessionStorage
  :: forall a e
  .  DecodeJson a
  => String
  -> (Eff (dom :: DOM | e) (Either String a))
getSessionStorage k =
  runFn3 _getSessionStorage Just Nothing k <#>
    maybe
      (Left $ "There is no session storage item for key " <> k)
      (jsonParser >=> decodeJson)

foreign import removeSessionStorage
  :: forall e. String
  -> Eff (dom :: DOM | e) Unit

setLocalStorage
  :: forall a e
  .  EncodeJson a
  => String
  -> a
  -> (Eff (dom :: DOM | e) Unit)
setLocalStorage k =
  runFn2 _setLocalStorage k <<< printJson <<< encodeJson

getLocalStorage
  :: forall a e
  .  DecodeJson a
  => String
  -> (Eff (dom :: DOM | e) (Either String a))
getLocalStorage k =
  runFn3 _getLocalStorage Just Nothing k <#>
    maybe
      (Left $ "There is no local storage item for key " <> k)
      (jsonParser >=> decodeJson)

foreign import removeLocalStorage
  :: forall e. String
  -> Eff (dom :: DOM | e) Unit

foreign import _setSessionStorage
  :: forall e
  .  Fn2
      String
      String
      (Eff (dom :: DOM | e) Unit)

foreign import _getSessionStorage
  :: forall a e
  .  Fn3
      (a -> Maybe a)
      (Maybe a)
      String
      (Eff (dom :: DOM | e) (Maybe String))

foreign import _setLocalStorage
  :: forall e
  .  Fn2
      String
      String
      (Eff (dom :: DOM | e) Unit)

foreign import _getLocalStorage
  :: forall a e
  .  Fn3
      (a -> Maybe a)
      (Maybe a)
      String
      (Eff (dom :: DOM | e) (Maybe String))
