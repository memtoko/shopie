module Shopie.User.Model
  ( UserRecord
  , User(..)
  ) where


-- | A basic record for User
type UserRecord =
  { ident :: Int
  , firstName :: String
  , lastName :: String
  , username :: String
  , email :: String
  }

-- | Our user can be a 'Staff' or `Customer`
data User
  = Staff UserRecord
  | Customer UserRecord
