module Text.Email.Validate
  ( emailAddress
  , canonicalizeEmail
  , isValid
  , validate
  , runEmailParser
  , module Text.Email.Parser
  ) where

import Prelude

import Data.Bifunctor (lmap)
import Data.Either (Either, either)
import Data.Maybe (Maybe(..))

import Text.Parsing.Parser (runParser, ParseError)

import Text.Email.Parser (EmailAddress, addrSpec, domainPart, localPart, toString)


-- | Smart constructor for an email address
emailAddress :: String -> Maybe EmailAddress
emailAddress = either (const Nothing) Just <<< runEmailParser

-- | Checks that an email is valid and returns a version of it
-- | where comments and whitespace have been removed.
canonicalizeEmail :: String -> Maybe String
canonicalizeEmail = map toString <<< emailAddress

-- | Validates whether a particular string is an email address
-- | according to RFC5322.
isValid :: String -> Boolean
isValid = either (const false) (const true) <<< runEmailParser

-- | If you want to find out *why* a particular string is not
-- | an email address, use this.
validate :: String -> Either String EmailAddress
validate = lmap show <<< runEmailParser

-- | run the email parser, return either ParseError or EmailAddress
runEmailParser :: String -> Either ParseError EmailAddress
runEmailParser = flip runParser addrSpec
