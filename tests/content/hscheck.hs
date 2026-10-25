-- Checks that Haskell lines and snippets parse, using GHC's own parser
-- (the ghc library that ships with every GHC). Nothing is run or
-- type-checked: a line only has to be valid Haskell syntax.
-- Usage: hscheck LIBDIR items.txt -- items are separated by NUL bytes;
-- prints one "index<TAB>error" line per item that fails.
--
-- An item passes when any shape parses: a module's top level (imports,
-- types, functions), a statement inside main's do block, a guard of a
-- function, or an alternative of a case.
module Main (main) where

import qualified Data.ByteString as B
import qualified Data.Text as T
import qualified Data.Text.Encoding as TE
import Data.Char (isSpace)
import System.Environment (getArgs)
import GHC (getSessionDynFlags, runGhc)
import GHC.Data.FastString (mkFastString)
import GHC.Data.StringBuffer (stringToStringBuffer)
import GHC.Driver.Config.Parser (initParserOpts)
import GHC.Driver.Ppr (showSDoc)
import GHC.Driver.Session (DynFlags)
import GHC.Parser (parseModule)
import GHC.Parser.Lexer (ParseResult (..), getPsErrorMessages, initParserState, unP)
import GHC.Types.Error (getMessages)
import GHC.Types.SrcLoc (mkRealSrcLoc)
import GHC.Utils.Error (pprMsgEnvelopeBagWithLoc)
import GHC.Utils.Outputable (vcat)

indent :: Int -> String -> String
indent n = unlines . map (replicate n ' ' ++) . lines

shapes :: [String -> String]
shapes =
  [ \code -> "module Main where\n" ++ code
  , \code -> "module Main where\nmain = do\n" ++ indent 2 code
  , \code -> "module Main where\nf x\n" ++ indent 2 code
  , \code -> "module Main where\nf x = case x of\n" ++ indent 2 code
  ]

parses :: DynFlags -> String -> Maybe String
parses dflags src =
  case unP parseModule (initParserState (initParserOpts dflags) (stringToStringBuffer src) (mkRealSrcLoc (mkFastString "line") 1 1)) of
    POk _ _ -> Nothing
    PFailed st -> Just (showSDoc dflags (vcat (pprMsgEnvelopeBagWithLoc (getMessages (getPsErrorMessages st)))))

check :: DynFlags -> String -> Maybe String
check dflags code = go shapes Nothing
  where
    go [] firstErr = firstErr
    go (s : rest) firstErr = case parses dflags (s code) of
      Nothing -> Nothing
      Just e -> go rest (maybe (Just e) Just firstErr)

oneLine :: String -> String
oneLine = unwords . words . map (\c -> if isSpace c then ' ' else c)

main :: IO ()
main = do
  [libdir, path] <- getArgs
  dflags <- runGhc (Just libdir) getSessionDynFlags
  bytes <- B.readFile path
  let items = map (T.unpack . TE.decodeUtf8) (B.split 0 bytes)
  mapM_ (\(i, code) -> maybe (pure ()) (\e -> putStrLn (show i ++ "\t" ++ oneLine e)) (check dflags code)) (zip [0 :: Int ..] items)
