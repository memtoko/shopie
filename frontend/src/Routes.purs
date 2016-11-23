module Routes
  ( Routes(..)
  , routing
  ) where

import Prelude

import Control.Alt ((<|>))

import Shopie.Router (Match, param, lit, int, end)


-- | the app's route
data Routes
  = Home
  | Users String
  | User Int
  | NotFound

instance routesShow :: Show Routes where
  show Home = "Home"
  show (Users s) = "Users(" <> (show s) <> ")"
  show (User i) = "User(" <> (show i) <> ")"
  show NotFound = "NotFound"

derive instance routesEq :: Eq Routes

-- the routing
routing :: Match Routes
routing =
  Home <$ end
  <|>
  Users <$> (lit "users" *> param "sortBy") <* end
  <|>
  Users "name" <$ (lit "users") <* end
  <|>
  User <$> (lit "users" *> int) <* end
