module Shopie.Application where

import Shopie.Prelude

import Control.Monad.Aff (Aff, attempt)
import Control.Monad.Aff.Bus as Bus
import Control.Monad.Eff.Exception (Error, error)
import Control.Monad.Eff.Ref (readRef)

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (decodeJson)
import Data.HTTP.Method (Method(GET))
import Data.List as L

import Halogen as H
import Halogen.Component.ChildPath (ChildPath, cpL, cpR, (:>))
import Halogen.HTML.Indexed as HH
import Halogen.HTML.Properties.Indexed as HP

import Network.JsonApi.Document as JD
import Network.JsonApi.Resource (fromResource)
import Network.HTTP.Affjax as AX

import Shopie.Ajax as SX
import Shopie.Auth.Login as AL
import Shopie.Auth.Types (maybeAuthId, UserId(..))
import Shopie.Halogen.EventSource (raise')
import Shopie.Notification.List as NL
import Shopie.Route.Types as RT
import Shopie.ShopieM (AuthMessage(AuthSuccess, InvalidateRequest), Draad(..),
                       ShopieEffects, ShopieMoD)
import Shopie.User.Model as UM
import Shopie.User.Profile as UP


data AppQ a
  = FetchUser AuthMessage a
  | GetRoute (RT.Locations -> a)
  | GetUser (Maybe (UM.User UM.UserAttributes) -> a)
  | Init a
  | Move RT.Locations a
  | UpdateUser (Maybe (UM.User UM.UserAttributes)) a

type AppS =
  { route :: RT.Locations
  , user :: Maybe (UM.User UM.UserAttributes)
  }

anonym :: UM.User UM.UserAttributes
anonym = UM.user Nothing $
           { firstName: "anonym"
           , lastName: ""
           , username: ""
           , email: "anonym@anonym.com"
           }

initialState :: AppS
initialState =
  { route: RT.Login
  , user: Nothing
  }

data NotifListSlot = NotifListSlot
derive instance eqNotifListSlot :: Eq NotifListSlot
derive instance ordNotifListSlot :: Ord NotifListSlot

newtype ProfileSlot = ProfileSlot String
derive instance eqProfileSlot :: Eq ProfileSlot
derive instance ordProfileSlot :: Ord ProfileSlot

data LoginSlot = LoginSlot
derive instance eqLoginSlot :: Eq LoginSlot
derive instance ordLoginSlot :: Ord LoginSlot

type ChildS g  = Either (NL.StateP g) (Either UP.Profile (AL.LoginSP g))
type ChildQ    = Coproduct NL.QueryP (Coproduct UP.ProfileQ AL.LoginQP)
type ChildSlot = Either NotifListSlot (Either ProfileSlot LoginSlot)

-- | path to notification
cpN
  :: forall g e
   . (Affable (ShopieEffects e) g)
  => ChildPath (NL.StateP g) (ChildS g) NL.QueryP ChildQ NotifListSlot ChildSlot
cpN = cpL

-- | path to profile
cpP
  :: forall g e
   . (Affable (ShopieEffects e) g)
  => ChildPath UP.Profile (ChildS g) UP.ProfileQ ChildQ ProfileSlot ChildSlot
cpP = cpR :> cpL

-- | path to login
cpLo
  :: forall g e
   . (Affable (ShopieEffects e) g)
  => ChildPath (AL.LoginSP g) (ChildS g) AL.LoginQP ChildQ LoginSlot ChildSlot
cpLo = cpR :> cpR

-- | Parent state
type AppSP g = H.ParentState AppS (ChildS g) AppQ ChildQ (ShopieMoD g) ChildSlot

-- | Parent Query synonim
type AppQP   = Coproduct AppQ (H.ChildF ChildSlot ChildQ)

-- | App HTML output
type AppHTML g = H.ParentHTML (ChildS g) AppQ ChildQ (ShopieMoD g) ChildSlot

-- | Component DSL
type AppDSL g = H.ParentDSL AppS (ChildS g) AppQ ChildQ (ShopieMoD g) ChildSlot

-- | Component app
app
  :: forall g e
   . (Affable (ShopieEffects e) g)
  => H.Component (AppSP g) AppQP (ShopieMoD g)
app =
  H.lifecycleParentComponent
    { render
    , eval
    , peek: Nothing
    , initializer: Just (H.action Init)
    , finalizer: Nothing
    }

render
  :: forall g e
   . (Affable (ShopieEffects e) g)
  =>  AppS
  -> AppHTML g
render s =
  HH.div
    [ HP.class_ $ HH.className "sh-app" ]
    [ renderNotification
    , HH.div
        [ HP.class_ $ HH.className "sh-viewport" ]
        [ renderView s.route s.user ]
    ]

renderNotification
  :: forall g e
   . (Affable (ShopieEffects e) g)
  => AppHTML g
renderNotification = HH.slot' cpN NotifListSlot $
  \_-> { component: NL.list, initialState: H.parentState NL.initialState }

renderView
  :: forall g e
   . (Affable (ShopieEffects e) g)
  => RT.Locations
  -> Maybe (UM.User UM.UserAttributes)
  -> AppHTML g
renderView RT.Home _ =
  HH.div_ [ HH.text "Home" ]
renderView RT.Login _ =
  HH.slot' cpLo LoginSlot $
    \_ -> { component: AL.authLogin, initialState: H.parentState AL.initialState }
renderView RT.Logout _ =
  HH.div_ [ HH.text "See ya!" ]
renderView RT.Profile u =
  case u of
    Just u' ->
      let p = UP.fromUser u'
      in HH.slot' cpP (ProfileSlot p.userId) $
           \_ -> { component: UP.profile, initialState: p }
    Nothing ->
      HH.div_ [ HH.text "Login to edit your profile" ]
renderView (RT.Order c) _ =
  HH.div_ [ HH.text ("Order" <> show c) ]
renderView RT.NotFound _ =
  HH.div_ [ HH.text "NotFound" ]

eval
  :: forall g e
   . (Affable (ShopieEffects e) g)
  => AppQ
  ~> AppDSL g
eval (Init next) = do
  Draad { auth } <- H.liftH $ H.liftH ask
  fetchUserDSL =<< maybeAuthId
  forever (raise' <<< H.action <<< FetchUser =<< H.fromAff (Bus.read auth))
eval (FetchUser msg next) = case msg of
  InvalidateRequest ->
    (raise' $ H.action $ Move RT.Login) $> next
  AuthSuccess -> do
    fetchUserDSL =<< maybeAuthId
    pure next
  _ -> pure next
eval (Move RT.Login next) = do
  u <- H.gets (_.user)
  unless (isJust u) $ H.modify (_ { route = RT.Login, user = Nothing })
  pure next
eval (Move loc next) = do
  u <- H.gets (_.user)
  when (isJust u) $ H.modify (_ { route = loc })
  pure next
eval (UpdateUser u next) =
  H.modify (_ { user = u }) $> next
eval (GetUser reply) = reply <$> H.gets (_.user)
eval (GetRoute reply) = reply <$> H.gets (_.route)

fetchUserDSL
  :: forall g e
   . (Affable (ShopieEffects e) g)
  => Maybe UserId
  -> AppDSL g Unit
fetchUserDSL muid = do
  Draad { apiEndpoint } <- H.liftH $ H.liftH $ ask
  ep <- H.fromEff $ readRef apiEndpoint
  u' <- H.fromAff $ fetchUser (fromMaybe (UserId "") muid) ep
  case u' of
    Right du -> do
      let us = map fromResource <<< L.head <<< (_.resources) $ JD.unDocument du
      H.modify (_ { user = us })
      raise' $ H.action $ Move RT.Home
    Left _ -> do
      H.modify (_ { user = Nothing })
      raise' $ H.action $ Move RT.Login

fetchUser
  :: forall eff
   . UserId
  -> String
  -> Aff (ajax :: AX.AJAX | eff) (Either Error (JD.Document UM.UserAttributes))
fetchUser (UserId u) ep
  | u == "" = pure $ Left $ error "Invalid User"
  | otherwise = do
      u' <- attempt $ (_.response) <$> getU
      pure $ (lmap error <<< decodeJson) =<< u'
  where
    getU :: AX.Affjax eff Json
    getU = AX.affjax $ SX.defaultRequestApi { method = Left GET, url = ep <> "/users/" <> u <> "/" }
