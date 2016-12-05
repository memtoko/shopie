module Shopie.ShopieM.ShopieM
  ( ShopieMoD
  , ShopieApD
  , ShopieF(..)
  , ShopieM(..)
  , ShopieAp(..)
  , forgotten
  , hoistM
  ) where

import Prelude

import Control.Applicative.Free (FreeAp, liftFreeAp, hoistFreeAp)
import Control.Monad.Aff.Class (class MonadAff, liftAff)
import Control.Monad.Eff.Class (class MonadEff, liftEff)
import Control.Monad.Aff.Free (class Affable, fromAff)
import Control.Monad.Eff.Exception (Error)
import Control.Monad.Fork (class MonadFork)
import Control.Monad.Free (Free, liftF, hoistFree)
import Control.Monad.Reader.Class (class MonadAsk)
import Control.Monad.Rec.Class (class MonadRec, tailRecM, Step(..))
import Control.Monad.Trans.Class (class MonadTrans)
import Control.Parallel.Class (class Parallel)

import Data.Newtype (class Newtype, over)

import Shopie.Auth.Types (class AuthDSL, Email)
import Shopie.Draad (Draad)
import Shopie.ShopieM.AuthF (AuthF(..))
import Shopie.ShopieM.ForkF as SF
import Shopie.ShopieM.Notification (class NotifyQ, Notification(Notification))


-- | A type Synonim for ShopieM where the g part is Draad
type ShopieMoD = ShopieM Draad
type ShopieApD = ShopieAp Draad

-- | Our algebra, it's similiar to ReaderT
data ShopieF g m a
  = AuthSF (AuthF a)
  | Lift (m a)
  | Notify Notification a
  | Halt String a
  | Par (ShopieAp g m a)
  | Fork (SF.Fork (ShopieM g m) a)
  | Ask (g -> a)

instance functorShopieF :: Functor m => Functor (ShopieF g m) where
  map f = case _ of
    AuthSF s -> AuthSF (map f s)
    Lift q -> Lift (map f q)
    Notify n a -> Notify n (f a)
    Par pa  -> Par (map f pa)
    Halt msg a -> Halt msg (f a)
    Fork fa -> Fork (map f fa)
    Ask k -> Ask (f <<< k)

newtype ShopieAp g m a = ShopieAp (FreeAp (ShopieM g m) a)

derive instance newtypeShopieAp :: Newtype (ShopieAp g m a) _
derive newtype instance functorShopieAp :: Functor (ShopieAp g m)
derive newtype instance applyShopieAp :: Apply (ShopieAp g m)
derive newtype instance applicativeShopieAp :: Applicative (ShopieAp g m)

newtype ShopieM g m a = ShopieM (Free (ShopieF g m) a)

instance functorShopieM :: Functor (ShopieM g m) where
  map f (ShopieM fa) = ShopieM (map f fa)

instance applyShopieM :: Apply (ShopieM g m) where
  apply (ShopieM fa) (ShopieM fb) = ShopieM (apply fa fb)

instance applicativeShopieM :: Applicative (ShopieM g m) where
  pure a = ShopieM (pure a)

instance bindShopieM :: Bind (ShopieM g m) where
  bind (ShopieM fa) f = ShopieM (fa >>= \x -> case f x of ShopieM fb -> fb)

instance monadShopieM :: Monad (ShopieM g m)

instance monadEffShopieM :: MonadEff eff m => MonadEff eff (ShopieM g m) where
  liftEff = ShopieM <<< liftF <<< Lift <<< liftEff

instance monadAffShopieM :: MonadAff eff m => MonadAff eff (ShopieM g m) where
  liftAff = ShopieM <<< liftF <<< Lift <<< liftAff

instance affableShopieM :: Affable eff m => Affable eff (ShopieM g m) where
  fromAff = ShopieM <<< liftF <<< Lift <<< fromAff

instance parallelShopieM :: Parallel (ShopieAp g m) (ShopieM g m) where
  parallel = ShopieAp <<< liftFreeAp
  sequential = ShopieM <<< liftF <<< Par

instance monadForkShopieM :: MonadAff eff m => MonadFork Error (ShopieM g m) where
  fork a = map liftAff <$> ShopieM (liftF $ Fork $ SF.fork a)

instance monadTransShopieM :: MonadTrans (ShopieM g) where
  lift m = ShopieM $ liftF $ Lift m

instance monadRecShopieM :: MonadRec (ShopieM g m) where
  tailRecM k a = k a >>= go
    where
    go (Loop x) = tailRecM k x
    go (Done y) = pure y

instance monadAskShopieM :: MonadAsk g (ShopieM g m) where
  ask = ShopieM $ liftF $ Ask id

instance notifyQShopieM :: NotifyQ (ShopieM g m) where
  notify (Notification n) = ShopieM $ liftF $ Notify (Notification n) unit

instance authDSLShopieM :: AuthDSL (ShopieM g m) where
  authenticate = ShopieM <<< liftF <<< AuthSF <<< flip Authenticate id
  maybeAuthId = ShopieM $ liftF $ AuthSF $ MaybeAuthId id
  invalidate = ShopieM $ liftF $ AuthSF $ Invalidate id

forgotten :: forall g m. Email -> ShopieM g m Unit
forgotten em = ShopieM $ liftF $ AuthSF $ Forgotten em unit

-- | Change the `m` part of ShopieM
hoistM
  :: forall g m m'
   . Functor m'
  => (m ~> m')
  -> ShopieM g m
  ~> ShopieM g m'
hoistM nat (ShopieM fa) = ShopieM (hoistFree go fa)
  where
  go :: ShopieF g m ~> ShopieF g m'
  go = case _ of
    AuthSF k -> AuthSF k
    Lift q -> Lift (nat q)
    Notify n a -> Notify n a
    Halt msg a -> Halt msg a
    Par p -> Par (over ShopieAp (hoistFreeAp (hoistM nat)) p)
    Fork f -> Fork (SF.hoistFork (hoistM nat) f)
    Ask f -> Ask f
