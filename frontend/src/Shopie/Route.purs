module Shopie.Route where

import Prelude

import Control.Alt ((<|>))

import Data.Int (floor)

import Routing.Match (Match)
import Routing.Match.Class (lit, num)

import Shopie.Route.Types (CRUD(..), Locations(..))


onSlash :: Match Unit
onSlash = lit "/"

homeSlash :: Match Unit
homeSlash = lit ""

int :: Match Int
int = floor <$> num

crud :: Match CRUD
crud =
  Detail <$> int <|>
  New <$ lit "new" <|>
  Index <$ homeSlash

home :: Match Locations
home = Home <$ onSlash

login :: Match Locations
login = Login <$ (homeSlash *> lit "login")

logout :: Match Locations
logout = Logout <$ (homeSlash *> lit "logout")

order :: Match Locations
order = Order <$> (homeSlash *> lit "order" *> crud)

routing :: Match Locations
routing =
  order <|>
  login <|>
  logout <|>
  home
