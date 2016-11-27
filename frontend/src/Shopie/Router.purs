module Shopie.Router
  ( Match()
  , routeChanged
  , RoutePart(..)
  , router
  , matches
  , matchesAff
  , lit
  , str
  , num
  , int
  , bool
  , param
  , params
  , any
  , end
  ) where

import Prelude

import Control.Alt (class Alt)
import Control.Monad.Aff (Aff(), makeAff)
import Control.Monad.Eff (Eff)
import Control.MonadPlus (guard)
import Control.Plus (class Plus)

import Data.Array as A
import Data.Map as M
import Data.String as S
import Data.Foldable (foldr)
import Data.Int (fromString)
import Data.List (catMaybes, List(Nil, Cons), fromFoldable, drop)
import Data.Maybe (Maybe(Just, Nothing), maybe)
import Data.Tuple (Tuple(Tuple), fst, snd)

import Global (readFloat, isNaN)


-- | our data to recognize route part
data RoutePart = Path String | Query (M.Map String String)

-- | type alias for route data
type Route = List RoutePart

-- | Match is Applicative for matching route / url
newtype Match a = Match (Route -> Maybe (Tuple Route a))

instance matchFunctor :: Functor Match where
  map f (Match x) = Match $ \r ->
    maybe Nothing (\t -> Just $ Tuple (fst t) (f (snd t))) $ x r

instance matchAlt :: Alt Match where
  alt (Match x) (Match y) = Match $ \r ->
    case x r of
      Nothing -> y r
      Just t -> Just t

instance matchApply :: Apply Match where
  apply (Match r2a2b) (Match r2a) = Match $ \r1 ->
    case r2a2b r1 of
      Nothing -> Nothing
      Just (Tuple r2 f) -> case r2a r2 of
        Nothing -> Nothing
        Just (Tuple r3 b) -> Just $ Tuple r3 (f b)

instance matchPlus :: Plus Match where
  empty = Match \r -> Nothing

instance matchApplicative :: Applicative Match where
  pure a = Match \r -> pure $ Tuple r a

-- | match again end of url
end :: Match Unit
end = Match $ \r ->
  case r of
    Cons (Query m) Nil -> Just $ Tuple Nil unit
    Nil -> Just $ Tuple Nil unit
    _ -> Nothing

lit :: String -> Match Unit
lit part = Match $ \r ->
  case r of
    Cons (Path p) ps | p == part -> Just $ Tuple ps unit
    _ -> Nothing

num :: Match Number
num = Match $ \r ->
  case r of
    Cons (Path p) ps ->
      let res = readFloat p in
      if isNaN res then
        Nothing
      else
        Just $ Tuple ps res
    _ -> Nothing

int :: Match Int
int = Match $ \r ->
  case r of
    Cons (Path p) ps -> maybe Nothing (Just <<< Tuple ps) $ fromString p
    _ -> Nothing

bool :: Match Boolean
bool = Match $ \r ->
  case r of
    Cons (Path p) ps | p == "true" -> Just $ Tuple ps true
    Cons (Path p) ps | p == "false" -> Just $ Tuple ps false
    _ -> Nothing

str :: Match String
str = Match $ \r ->
  case r of
    Cons (Path p) ps -> Just $ Tuple ps p
    _ -> Nothing

param :: String -> Match String
param key = Match $ \r ->
  case r of
    Cons (Query map) ps ->
      case M.lookup key map of
        Nothing -> Nothing
        Just s -> Just $ Tuple (Cons (Query <<< M.delete key $ map) ps) s
    _ ->  Nothing

params :: Match (M.Map String String)
params = Match $ \r ->
  case r of
    Cons (Query map) ps -> Just $ Tuple ps map
    _ -> Nothing

any :: Match Unit
any = Match $ \r ->
  case r of
    Cons p ps -> Just $ Tuple ps unit
    _ -> Nothing

routeFromUrl :: String -> Route
routeFromUrl "/" = Nil
routeFromUrl url = case S.indexOf (S.Pattern "?") url of
                    Nothing -> parsePath Nil url
                    Just queryPos ->
                      let queryPart = parseQuery <<< S.drop queryPos $ url
                      in parsePath (Cons queryPart Nil) <<< S.take queryPos $ url
  where
    parsePath :: Route -> String -> Route
    parsePath query = drop 1 <<< foldr (Cons <<< Path) query <<< S.split (S.Pattern "/")

parseQuery :: String -> RoutePart
parseQuery s = Query <<< M.fromFoldable <<< catMaybes <<< map part2tuple $ parts
  where
  parts :: List String
  parts = fromFoldable $ S.split (S.Pattern "&") $ S.drop 1 s

  part2tuple :: String -> Maybe (Tuple String String)
  part2tuple part = do
    let param' = S.split (S.Pattern "=") part
    guard $ A.length param' == 2
    Tuple <$> (A.head param') <*> (param' A.!! 1)

router :: forall a. String -> Match a -> Maybe a
router url (Match match) = maybe Nothing (Just <<< snd) result
  where result = match $ routeFromUrl url

foreign import routeChanged
  :: forall e
  . (String -> String -> Eff e Unit)
  -> Eff e Unit

foreign import decodeURIComponent :: String -> String

matches :: forall e a. Match a -> (Maybe a -> a -> Eff e Unit) -> Eff e Unit
matches ma cb = routeChanged $ \old new ->
  let matcher = flip router ma
      fst' = matcher old
  in maybe (pure unit) (cb fst') $ matcher new

matchesAff :: forall e a. Match a -> Aff e (Tuple (Maybe a) a)
matchesAff ma = makeAff \_ k -> do
  matches ma \old new ->
    k $ Tuple old new
