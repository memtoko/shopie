module Text.Email.Parser
  ( EmailAddress(..)
  , addrSpec
  , domainPart
  , localPart
  , toString
  ) where

import Prelude hiding (between)

import Control.Alt ((<|>))

import Data.Array as A
import Data.Char (fromCharCode)
import Data.Foldable (fold, intercalate)
import Data.Generic (class Generic, gEq)
import Data.List (List, many)
import Data.String (contains, fromCharArray, Pattern(..))

import Text.Parsing.Parser (Parser)
import Text.Parsing.Parser.Combinators (optional, sepBy1, between, skipMany, skipMany1)
import Text.Parsing.Parser.String (char, satisfy)


-- | Represent an Email Address
data EmailAddress = EmailAddress String String

-- | Take localPart of Email Address
localPart :: EmailAddress -> String
localPart (EmailAddress email _) = email

domainPart :: EmailAddress -> String
domainPart (EmailAddress _ d) = d

derive instance genericEmailAddress :: Generic EmailAddress

instance showEmailAddress :: Show EmailAddress where
  show = toString

instance eqEmailAddress :: Eq EmailAddress where
  eq = gEq

toString :: EmailAddress -> String
toString em = localPart em <> "@" <> domainPart em

type EmailParser a = Parser String a

addrSpec :: EmailParser EmailAddress
addrSpec = EmailAddress <$> (local <* char '@') <*> domain

local :: EmailParser String
local = dottedAtoms

domain :: EmailParser String
domain = dottedAtoms <|> domainLiteral

dottedAtoms :: EmailParser String
dottedAtoms =
  intercalate "." <$> (between1 (optional cfws) (atom <|> quotedString)) `sepBy1` char '.'

domainLiteral :: EmailParser String
domainLiteral = foldS <$>
  between (optional cfws *> char '[') (char ']' <* optional cfws)
            (many (optional fws *> takeWhile1 isDomainText) <* optional fws)
  where
    foldS v = "[" <> fold v <> "]"

isDomainText :: Char -> Boolean
isDomainText x = inClassRange (fromCharCode 33) (fromCharCode 90) x
              || inClassRange (fromCharCode 94) (fromCharCode 126) x
              || isObsNoWsCtl x

quotedString :: EmailParser String
quotedString = (\x -> "\"" <> fold x <> "\"") <$> qs
  where
    qs :: EmailParser (List String)
    qs =
      between (char '"') (char '"') (many (optional fws *> quotedContent) <* optional fws)

quotedContent :: EmailParser String
quotedContent = takeWhile1 isQuotedText <|> quotedPair

isQuotedText :: Char -> Boolean
isQuotedText x = inClass (fromCharArray $ [fromCharCode 33]) x
              || inClassRange (fromCharCode 35) (fromCharCode 91) x
              || inClassRange (fromCharCode 93) (fromCharCode 126) x
              || isObsNoWsCtl x

quotedPair :: EmailParser String
quotedPair = do
  c <- qp
  pure $ "\\" <> fromCharArray [c]
  where
    qp :: EmailParser Char
    qp = do
      void $ char '\\'
      vchar <|> wsp <|> lf <|> cr <|> obsNoWsCtl <|> nullChar

isVchar :: Char -> Boolean
isVchar = inClassRange (fromCharCode 33) (fromCharCode 126)

vchar :: EmailParser Char
vchar = satisfy isVchar

comment :: EmailParser Unit
comment = do
  void $ char '('
  skipMany $ skipWhile1 isCommentText <|> void quotedPair <|> comment <|> fws
  void $ char ')'
  pure unit

isCommentText :: Char -> Boolean
isCommentText x = inClassRange (fromCharCode 33) (fromCharCode 39) x
               || inClassRange (fromCharCode 42) (fromCharCode 91) x
               || inClassRange (fromCharCode 93) (fromCharCode 126) x
               || isObsNoWsCtl x

nullChar :: EmailParser Char
nullChar = char $ fromCharCode 0

skipWhile1 :: (Char -> Boolean) -> EmailParser Unit
skipWhile1 x = satisfy x *> skipMany (satisfy x)

isWsp :: Char -> Boolean
isWsp x = x == ' ' || x == '\t'

isAlphaNum :: Char -> Boolean
isAlphaNum x = isDigit || isAlpha_ascii
  where
    isDigit :: Boolean
    isDigit = x >= '0' && x <= '9'

    isAlpha_ascii :: Boolean
    isAlpha_ascii = x >= 'a' && x <= 'z' || x >= 'A' && x <= 'Z'

cfws :: EmailParser Unit
cfws = skipMany (comment <|> fws)

fws :: EmailParser Unit
fws = void (wsp1 *> optional (crlf *> wsp1)) <|> (skipMany1 (crlf *> wsp1))

cr :: EmailParser Char
cr = char '\r'

lf :: EmailParser Char
lf = char '\n'

crlf :: EmailParser Unit
crlf = void $ cr *> lf

wsp1 :: EmailParser Unit
wsp1 = skipWhile1 isWsp

wsp :: EmailParser Char
wsp = satisfy isWsp

isObsNoWsCtl :: Char -> Boolean
isObsNoWsCtl c = inClassRange (fromCharCode 1) (fromCharCode 8) c
              || inClassRange (fromCharCode 14) (fromCharCode 31) c
              || inClass "\11\12\127" c

obsNoWsCtl :: EmailParser Char
obsNoWsCtl = satisfy isObsNoWsCtl

inClass :: String -> Char -> Boolean
inClass string char = (Pattern $ fromCharArray [char]) `contains` string

inClassRange :: Char -> Char -> Char -> Boolean
inClassRange start end c = c >= start && c <= end

atom :: EmailParser String
atom = takeWhile1 isAtomText

isAtomText :: Char -> Boolean
isAtomText x = isAlphaNum x || inClass "!#$%&'*+/=?^_`{|}~-" x

takeWhile1 :: (Char -> Boolean) -> EmailParser String
takeWhile1 f = fromCharArray <$> (A.some $ satisfy f)

between1 :: forall f a b. Applicative f => f b -> f a -> f a
between1 lr x = lr *> x <* lr
