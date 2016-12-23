module Shopie.Route.Types where

import Prelude


data CRUD
  = Index
  | Detail Int
  | New

instance eqCRUD :: Eq CRUD where
  eq Index Index = true
  eq (Detail a) (Detail b) = a == b
  eq New New = true
  eq _ _ = false

instance showCRUD :: Show CRUD where
  show Index = "Index"
  show (Detail a) = "Detail " <> show a
  show New = "New"

data Locations
  = Home
  | Login
  | Logout
  | Profile
  | Order CRUD
  | NotFound

class RouteLink a where
  link :: a -> String

instance routeLinkRoutes :: RouteLink Locations where
  link = case _ of
    Home -> "/"
    Login -> "/login"
    Logout -> "/logout"
    Profile -> "/profile"
    Order a -> "/profile" <> link a
    NotFound -> "/404"

instance routeLinkCRUD :: RouteLink CRUD where
  link Index = ""
  link New = "/new"
  link (Detail a) = "/" <> show a
