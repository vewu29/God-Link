"use strict";
/* ================= Haskell — a Code Block track =================
   Written fresh for Code Block in plain words. Facts and syntax follow
   the Haskell 2010 Report, the GHC User's Guide and the documentation of
   the base and containers libraries, which ship with every GHC. Every PC
   project and library example is run by real GHC (runghc, with -Wall) in
   tests/content, with any warning counted as a failure, and a project's
   output must match the app. Every drill and Vault line is parsed (not
   run) by GHC's own parser. */
cbRegisterTrack("haskell", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Print Line Block", short: "putStrLn", chapter: "Haskell Ch. 1 · First Steps", icon: "i-say", verb: "say",
      line: 'putStrLn "Hello, world!"',
      explain: "putStrLn prints a line of text: put a string, then end the line. Text goes in double quotes." },
    { name: "Main Block", short: "main =", chapter: "Haskell Ch. 1 · First Steps", icon: "i-play-circle", verb: "start",
      line: 'main = putStrLn "Hi!"',
      explain: "Every Haskell program starts at main. The = sign defines it once: main means “print Hi!”." },
    { name: "Print Block", short: "print", chapter: "Haskell Ch. 1 · First Steps", icon: "i-eye", verb: "show",
      line: "print (2 + 3)",
      explain: "print shows any value — a number, a list, a pair. The brackets make it print the sum, 5." },
    { name: "Name Block", short: "x = 10", chapter: "Haskell Ch. 2 · Values and Types", icon: "i-tag", verb: "name",
      line: "score = 10",
      explain: "A name stands for a value, and it never changes. In Haskell, score = 10 is a fact, not a box you refill." },
    { name: "Type Block", short: "::", chapter: "Haskell Ch. 2 · Values and Types", icon: "i-shapes", verb: "type",
      line: "score :: Int",
      explain: ":: reads “has type.” Int is a whole number; Double, String, Char and Bool are the other everyday types." },
    { name: "Div Block", short: "`div`", chapter: "Haskell Ch. 3 · Math", icon: "i-calc", verb: "divide",
      line: "slices = 17 `div` 5",
      explain: "div is whole-number division (3) and mod is the remainder (2). Backticks let a two-input function sit between its inputs." },
    { name: "Convert Block", short: "fromIntegral", chapter: "Haskell Ch. 3 · Math", icon: "i-swap-h", verb: "convert",
      line: "avg = fromIntegral total / 3",
      explain: "/ only divides decimal numbers. fromIntegral turns a whole number into one, so the division can happen." },
    { name: "Function Block", short: "f x =", chapter: "Haskell Ch. 4 · Functions", icon: "i-lambda", verb: "define",
      line: "double x = x * 2",
      explain: "A function is a name, its inputs, = and the answer. Call it with a space: double 5 is 10." },
    { name: "Signature Block", short: "Int -> Int", chapter: "Haskell Ch. 4 · Functions", icon: "i-link", verb: "describe",
      line: "double :: Int -> Int",
      explain: "The signature shows the trip: an Int goes in, an Int comes out. GHC checks every call against it." },
    { name: "Dollar Block", short: "$", chapter: "Haskell Ch. 4 · Functions", icon: "i-brackets", verb: "apply",
      line: "print $ double 5",
      explain: "$ means “work out everything on my right first.” It saves you a pair of brackets." },
    { name: "If Block", short: "if then else", chapter: "Haskell Ch. 5 · Decisions", icon: "i-fork", verb: "decide",
      line: 'label = if score > 50 then "pass" else "retry"',
      explain: "In Haskell, if always gives back a value, so else is required. Both answers must be the same type." },
    { name: "Guard Block", short: "|", chapter: "Haskell Ch. 5 · Decisions", icon: "i-shield-check", verb: "guard",
      line: '| score >= 90 = "A"',
      explain: "A guard is one test and its answer. Guards are tried top to bottom, and otherwise catches everything left." },
    { name: "List Block", short: "[ ]", chapter: "Haskell Ch. 6 · Lists", icon: "i-list", verb: "collect",
      line: "scores = [90, 75, 88]",
      explain: "A list holds values of one type, in order, inside square brackets." },
    { name: "Range Block", short: "[1 .. 10]", chapter: "Haskell Ch. 6 · Lists", icon: "i-rows", verb: "count",
      line: "nums = [1 .. 10]",
      explain: "Two dots fill in the gap: 1 to 10. [2, 4 .. 20] counts in twos." },
    { name: "Join Block", short: "++ show", chapter: "Haskell Ch. 7 · Text", icon: "i-pencil", verb: "join",
      line: 'msg = "Score: " ++ show score',
      explain: "++ joins two pieces of text. show turns a number (or most values) into text so it can be joined." },
    { name: "Words Block", short: "words", chapter: "Haskell Ch. 7 · Text", icon: "i-boxes", verb: "split",
      line: 'ws = words "the quick fox"',
      explain: "words splits text at the spaces into a list of words. unwords glues a list back together." },
    { name: "Pattern Block", short: "f 0 =", chapter: "Haskell Ch. 8 · Pattern Matching", icon: "i-point", verb: "match",
      line: 'describe 0 = "none"',
      explain: "A function can have several equations. Haskell uses the first one whose pattern fits the input." },
    { name: "Wildcard Block", short: "_", chapter: "Haskell Ch. 8 · Pattern Matching", icon: "i-help", verb: "catch",
      line: 'describe _ = "lots"',
      explain: "_ matches anything at all. Put it last, so it catches every input the other equations didn't." },
    { name: "Recursion Block", short: "x : xs", chapter: "Haskell Ch. 9 · Recursion", icon: "i-repeat", verb: "recurse",
      line: "total (x : xs) = x + total xs",
      explain: "x : xs splits a list into its first item and the rest. The function calls itself on the rest — that's Haskell's loop." },
    { name: "Map Block", short: "map", chapter: "Haskell Ch. 10 · Map, Filter and Folds", icon: "i-layers", verb: "map",
      line: "doubled = map (* 2) scores",
      explain: "map runs a function on every item and gives back a new list. (* 2) is the “times two” function." },
    { name: "Filter Block", short: "filter", chapter: "Haskell Ch. 10 · Map, Filter and Folds", icon: "i-funnel", verb: "filter",
      line: "evens = filter even nums",
      explain: "filter keeps only the items that pass the test — here, the even numbers." },
    { name: "Lambda Block", short: "\\x ->", chapter: "Haskell Ch. 10 · Map, Filter and Folds", icon: "i-lambda", verb: "define",
      line: "squares = map (\\x -> x * x) nums",
      explain: "\\x -> x * x is a function with no name, written right where it's used. The backslash stands in for the Greek letter λ." },
    { name: "Fold Block", short: "foldr", chapter: "Haskell Ch. 10 · Map, Filter and Folds", icon: "i-plus-square", verb: "combine",
      line: "total = foldr (+) 0 scores",
      explain: "foldr folds a whole list into one value: start from 0 and add every item. sum is a fold too." },
    { name: "Maybe Block", short: "Just / Nothing", chapter: "Haskell Ch. 11 · Tuples and Maybe", icon: "i-search", verb: "look up",
      line: 'age = lookup "Ana" ages',
      explain: "lookup answers Just the value, or Nothing when the key isn't there. A missing value can't sneak past unnoticed." },
    { name: "Data Block", short: "data", chapter: "Haskell Ch. 12 · Your Own Types", icon: "i-cube", verb: "design",
      line: "data Shape = Circle Double | Square Double",
      explain: "data makes a brand-new type. Each | adds one form a value can take, with the values it carries." },
    { name: "Class Block", short: "Ord a =>", chapter: "Haskell Ch. 13 · Type Classes", icon: "i-stamp", verb: "require",
      line: "biggest :: Ord a => [a] -> a",
      explain: "Ord a => means “a can be any type whose values can be compared.” Type classes are families of types that share abilities." },
    { name: "Bind Block", short: "<-", chapter: "Haskell Ch. 14 · IO and do", icon: "i-keyboard", verb: "read",
      line: "name <- getLine",
      explain: "In a do block, <- runs an action and names its result. getLine waits for a line of typed input." },
    { name: "MapM Block", short: "mapM_", chapter: "Haskell Ch. 14 · IO and do", icon: "i-play", verb: "repeat",
      line: "mapM_ print scores",
      explain: "mapM_ runs an action once for every item — here, it prints each score on its own line." },
    { name: "Import Block", short: "import", chapter: "Haskell Ch. 15 · Maps and Modules", icon: "i-folder", verb: "import",
      line: "import qualified Data.Map as Map",
      explain: "import brings in a module. qualified … as Map means you write Map.lookup and Map.insert, so names never clash." },
    { name: "Either Block", short: "Left / Right", chapter: "Haskell Ch. 16 · Errors and Good Habits", icon: "i-shield-alert", verb: "report",
      line: 'safeDiv _ 0 = Left "divide by zero"',
      explain: "Either holds an answer (Right) or the reason it failed (Left). Callers must handle both, so errors can't be ignored." }
  ];

  var chapters = [
    { title: "First Steps", chapter: "Start here · main, putStrLn, print, comments, runghc", line: 'main = putStrLn "Hello, world!"',
      content: {
        story: ["Haskell is a functional language: you build programs from small functions that always give the same answer for the same input. Banks, chip designers and compiler writers use it because its compiler catches so many mistakes before the code ever runs.",
          "A program starts at main. putStrLn prints a line of text, and print shows any value the way Haskell writes it — text keeps its quotes. Comments start with -- and run to the end of the line.",
          "Install GHC, the Haskell compiler, with GHCup from haskell.org. Save code as main.hs and run runghc main.hs, or type ghci to try lines one at a time and see each answer at once."],
        big: "A Haskell program starts at main; putStrLn prints text, print shows any value, and -- starts a comment.",
        caption: "main runs its steps from top to bottom; print keeps the quotes, putStrLn doesn't. Tap Play.",
        demo: ["$ runghc main.hs", "main = putStrLn \"Hello, world!\"", "Hello, world!", "-- comments start with two dashes"]
      },
      deep: {
        more: ["main = do lists several steps, one per line, each indented by the same amount. The indentation matters: it's how Haskell knows which lines belong to the do.",
          "In GHCi, the interactive prompt, type 2 + 3 and press Enter to see 5. :type shows what kind of value anything is, and :quit leaves."],
        ex: { code: src(["-- My first Haskell program", "main :: IO ()", "main = do", "  putStrLn \"Hello, world!\"", "  putStrLn \"I am learning Haskell.\"", "  print (2 + 3)", "  print \"quotes stay\"", "  putStrLn (\"2 + 3 is \" ++ show (2 + 3))"]),
          walk: ["Line 1: a comment, skipped by Haskell.", "Line 2: main's type, IO (): an action that talks to the outside world.", "Line 3: main = do starts a list of steps, one per indented line.", "Lines 4–5: putStrLn prints each line: Hello, world! and I am learning Haskell.", "Line 6: print shows the sum: 5.", "Line 7: print shows text the way Haskell writes it, quotes and all: \"quotes stay\".", "Line 8: show turns 5 into text so ++ can join it on: 2 + 3 is 5."] },
        mistake: "Mixing tabs and spaces, or indenting one step of a do block differently from the rest. GHC reports a parse error; indent every step with the same number of spaces."
      } },
    { title: "Values and Types", chapter: "Names · =, ::, Int, Double, String, Char, Bool", line: "score = 10",
      content: {
        story: ["score = 10 says score is 10, for good. Haskell names never change once they're set — there's no refilling the box. A new value gets a new name, like bonus = score + 5.",
          ":: reads “has type.” The everyday types are Int (whole numbers), Double (decimals), String (text in double quotes), Char (one letter in single quotes) and Bool (True or False).",
          "You often don't need to write types, because GHC works them out. But a type line above each top-level name, like score :: Int, is good manners: it documents the code and catches mix-ups early."],
        big: "name = value fixes a value for good; :: gives its type: Int, Double, String, Char or Bool.",
        caption: "Each name is fixed to one value and labelled with its type. Tap Play.",
        demo: ["score :: Int", "score = 10", "name = \"Ana\"", "grade = 'A'"]
      },
      deep: {
        more: ["Names start with a lower-case letter: score, playerName, total2. Types, and True and False, start with a capital.",
          "Inside main's do block, let gives a value a name for the lines below it: let bonus = score + 5."],
        ex: { code: src(["score :: Int", "score = 10", "", "name :: String", "name = \"Ana\"", "", "ratio :: Double", "ratio = 0.75", "", "alive :: Bool", "alive = True", "", "grade :: Char", "grade = 'A'", "", "main :: IO ()", "main = do", "  let bonus = score + 5", "  putStrLn (name ++ \" has \" ++ show bonus ++ \" points\")", "  print ratio", "  print alive", "  print grade", "  print (score, name)"]),
          walk: ["Lines 1–2: score has type Int and the value 10.", "Lines 4–14: a String, a Double, a Bool and a Char, each with its type line.", "Line 18: let names a new value: bonus is 15. score itself never changes.", "Line 19: Ana has 15 points.", "Lines 20–22: 0.75, True, and 'A' — print shows a Char in single quotes.", "Line 23: two values in brackets make a pair: (10,\"Ana\")."] },
        mistake: "Writing score = score + 1 to add one. In Haskell that defines score in terms of itself, forever, and the program hangs. Use a new name: newScore = score + 1."
      } },
    { title: "Math", chapter: "Numbers · + − * /, div and mod, ^, fromIntegral, round", line: "slices = 17 `div` 5",
      content: {
        story: ["+ - and * work as you'd expect, and / divides into a decimal: 7 / 2 is 3.5. For whole numbers, div gives how many times one fits into another and mod gives what's left: 17 `div` 5 is 3 and 17 `mod` 5 is 2.",
          "The backticks around div turn an ordinary function into an operator that sits in the middle. div 17 5 means exactly the same thing.",
          "Haskell never mixes number types behind your back. An Int can't go straight into /; fromIntegral converts it first. round, floor and ceiling go the other way, from decimals back to whole numbers."],
        big: "+ − * and / do the math; div and mod split whole numbers; fromIntegral converts before /.",
        caption: "17 splits into three 5s with 2 left over. Tap Play.",
        demo: ["17 `div` 5 → 3", "17 `mod` 5 → 2", "7 / 2 → 3.5", "2 ^ 10 → 1024"]
      },
      deep: {
        more: ["^ raises to a whole-number power: 2 ^ 10 is 1024. sqrt gives a square root as a decimal: sqrt 16 is 4.0.",
          "Int is fast but has a limit, about 9 quintillion. Integer has no limit at all, which is handy for huge results like factorials."],
        ex: { code: src(["coins :: Int", "coins = 17", "", "players :: Int", "players = 5", "", "main :: IO ()", "main = do", "  print (coins `div` players)", "  print (coins `mod` players)", "  print (fromIntegral coins / fromIntegral players)", "  print (2 ^ 10)", "  print (7 / 2)", "  print (sqrt 16)", "  print (round 3.7)", "  print ((3 + 4) * 2)"]),
          walk: ["Lines 1–5: 17 coins and 5 players, both Int.", "Line 9: whole shares each: 3.", "Line 10: coins left over: 2.", "Line 11: fromIntegral turns both into decimals, so / works: 3.4.", "Line 12: 1024.", "Line 13: / always gives a decimal: 3.5.", "Line 14: 4.0 — sqrt answers with a decimal.", "Line 15: round goes back to a whole number: 4.", "Line 16: brackets first: 14."] },
        mistake: "Dividing two Ints with /. GHC refuses with No instance for (Fractional Int). Use div for whole numbers, or fromIntegral to make decimals first."
      } },
    { title: "Functions", chapter: "Machines · inputs, =, signatures, calling with spaces, $", line: "double x = x * 2",
      content: {
        story: ["A function is written like a rule in math: double x = x * 2. The name comes first, then its inputs, then = and the answer. There's no return keyword — the answer is the whole right side.",
          "Calling uses a space, not brackets: double 5 is 10, and add 3 4 is 7. Brackets only group things: double (add 1 2) adds first, then doubles.",
          "The signature above a function, double :: Int -> Int, shows the trip: an Int goes in, an Int comes out. add :: Int -> Int -> Int takes two Ints and gives one back. GHC checks every call against it."],
        big: "f x = answer defines a function; call it with spaces; the signature shows what goes in and what comes out.",
        caption: "5 goes into double and 10 comes out. Tap Play.",
        demo: ["double :: Int -> Int", "double x = x * 2", "double 5 → 10", "add 3 4 → 7"]
      },
      deep: {
        more: ["$ means “work out everything on my right first,” so print $ double $ add 1 2 is the same as print (double (add 1 2)).",
          "Any two-input function can sit between its inputs in backticks: 3 `add` 4. And any operator can go first in brackets: (+) 3 4."],
        ex: { code: src(["double :: Int -> Int", "double x = x * 2", "", "add :: Int -> Int -> Int", "add a b = a + b", "", "greet :: String -> String", "greet name = \"Hi, \" ++ name ++ \"!\"", "", "main :: IO ()", "main = do", "  print (double 5)", "  print (add 3 4)", "  putStrLn (greet \"Ana\")", "  print (double (add 1 2))", "  print $ double $ add 1 2", "  print (3 `add` 4)"]),
          walk: ["Lines 1–2: double takes an Int and gives back twice it.", "Lines 4–5: add takes two Ints, separated by spaces.", "Lines 7–8: greet builds a String.", "Lines 12–14: 10, 7 and Hi, Ana!", "Line 15: brackets first: add 1 2 is 3, doubled to 6.", "Line 16: the same with $ instead of brackets: 6.", "Line 17: backticks put add in the middle: 7."] },
        mistake: "Calling a function the way other languages do: add(3, 4). Haskell reads (3, 4) as ONE input, a pair, and the types don't match. Write add 3 4."
      } },
    { title: "Decisions", chapter: "Choices · if then else, guards, otherwise, && || not", line: 'label = if score > 50 then "pass" else "retry"',
      content: {
        story: ["if in Haskell is an expression: it always gives back a value. That's why else is required — there has to be an answer either way. Both branches must be the same type.",
          "Guards are Haskell's tidy way to make several choices. Each | line is a test and an answer, and the first test that's True wins. otherwise simply means True, so it catches the rest.",
          "Comparisons are == (equal), /= (not equal), <, >, <= and >=. && means both, || means either, and not flips True and False."],
        big: "if … then … else always gives a value; guards try their tests top to bottom; otherwise catches the rest.",
        caption: "The score drops down the guards until one test is True. Tap Play.",
        demo: ["grade score", "  | score >= 90 = \"A\"", "  | score >= 80 = \"B\"", "  | otherwise = \"Keep practicing!\""]
      },
      deep: {
        more: ["“Not equal” is /=, not != as in many languages. It's meant to look like the ≠ sign.",
          "Order matters in guards: put the strictest test first. If score >= 70 came first, a 95 would get a C."],
        ex: { code: src(["grade :: Int -> String", "grade score", "  | score >= 90 = \"A\"", "  | score >= 80 = \"B\"", "  | score >= 70 = \"C\"", "  | otherwise = \"Keep practicing!\"", "", "passFail :: Int -> String", "passFail score = if score >= 50 then \"pass\" else \"retry\"", "", "main :: IO ()", "main = do", "  putStrLn (grade 95)", "  putStrLn (grade 85)", "  putStrLn (grade 40)", "  putStrLn (passFail 72)", "  print (5 > 3 && 2 > 4)", "  print (5 > 3 || 2 > 4)", "  print (not True)", "  print (7 /= 7)"]),
          walk: ["Lines 1–6: four guards, tried from the top; otherwise catches everything left.", "Lines 8–9: an if that picks between two Strings.", "Lines 13–15: A, B and Keep practicing!", "Line 16: 72 is at least 50: pass.", "Line 17: && needs both: False.", "Line 18: || needs either one: True.", "Lines 19–20: not True is False, and 7 /= 7 is False too."] },
        mistake: "Leaving out the else. if score > 50 then \"pass\" is a parse error, because Haskell needs an answer for both cases."
      } },
    { title: "Lists", chapter: "Rows of values · [ ], ranges, :, ++, length, take, !!", line: "scores = [90, 75, 88]",
      content: {
        story: ["A list is a row of values of one type: [90, 75, 88]. A String is just a list of Chars, so everything here works on text too.",
          "Ranges fill themselves in: [1 .. 5] is [1,2,3,4,5], and [2, 4 .. 10] counts in twos. The colon puts one item on the front, as in 100 : scores, and ++ joins two lists.",
          "length, sum, maximum and reverse answer questions about the whole list. take 2 keeps the first two, and !! picks by position, counting from 0."],
        big: "A list holds values of one type; ranges fill in gaps, : adds to the front, ++ joins lists.",
        caption: "100 slides onto the front of the list. Tap Play.",
        demo: ["scores = [90, 75, 88]", "100 : scores", "[100,90,75,88]", "[1 .. 5]"]
      },
      deep: {
        more: ["Lists never change: 100 : scores makes a new list and leaves scores as it was.",
          "elem asks “is it in there?”: elem 75 scores is True. null asks whether a list is empty."],
        ex: { code: src(["scores :: [Int]", "scores = [90, 75, 88]", "", "main :: IO ()", "main = do", "  print scores", "  print (length scores)", "  print (sum scores)", "  print (maximum scores)", "  print (100 : scores)", "  print (scores ++ [60, 70])", "  print [1 .. 5]", "  print [2, 4 .. 10]", "  print (take 2 scores)", "  print (reverse scores)", "  print (elem 75 scores)", "  print (scores !! 0)"]),
          walk: ["Lines 1–2: a list of three Ints.", "Line 6: [90,75,88].", "Lines 7–9: 3 items, adding up to 253, and the biggest is 90.", "Line 10: : puts 100 on the front: [100,90,75,88].", "Line 11: ++ joins two lists end to end.", "Lines 12–13: [1,2,3,4,5] and [2,4,6,8,10].", "Line 14: the first two: [90,75].", "Line 15: [88,75,90].", "Line 16: True — 75 is in the list.", "Line 17: position 0 is the first item: 90."] },
        mistake: "Mixing types in one list, like [1, \"two\"]. Every item must be the same type; use a tuple or a data type of your own to mix them."
      } },
    { title: "Text", chapter: "Strings · ++, show, length, words, unwords, map toUpper", line: 'msg = "Score: " ++ show score',
      content: {
        story: ["Text is a String, and a String is a list of Chars. So ++ joins text, length counts letters and reverse flips it — the list tools all work.",
          "show turns a value into text: show 42 is \"42\". It's how numbers join sentences: name ++ \" scored \" ++ show score.",
          "words splits text at the spaces and unwords joins a list back with spaces. map toUpper (from Data.Char) shouts the whole thing, and replicate 5 '*' makes \"*****\"."],
        big: "A String is a list of Chars: ++ joins, show turns values into text, words and unwords split and join.",
        caption: "show turns 42 into text so ++ can join it on. Tap Play.",
        demo: ["\"Hi, \" ++ name", "show 42 → \"42\"", "words \"the quick fox\"", "map toUpper \"Ana\" → \"ANA\""]
      },
      deep: {
        more: ["lines splits text at line breaks and unlines joins with them — perfect for files.",
          "For lots of text, real programs use Data.Text, a faster text type built on the same ideas."],
        ex: { code: src(["import Data.Char (toUpper)", "", "main :: IO ()", "main = do", "  let name = \"Ana\"", "  let score = 42", "  putStrLn (\"Hi, \" ++ name ++ \"!\")", "  putStrLn (name ++ \" scored \" ++ show score)", "  print (length name)", "  putStrLn (map toUpper name)", "  print (words \"the quick brown fox\")", "  putStrLn (unwords [\"one\", \"two\", \"three\"])", "  putStrLn (replicate 5 '*')", "  print (reverse \"stressed\")", "  print ('A' : \"na\" == name)"]),
          walk: ["Line 1: toUpper comes from the Data.Char module.", "Lines 5–6: a String and a number.", "Line 7: Hi, Ana!", "Line 8: show turns 42 into text: Ana scored 42.", "Line 9: 3 letters.", "Line 10: toUpper on every Char: ANA.", "Line 11: [\"the\",\"quick\",\"brown\",\"fox\"].", "Line 12: one two three.", "Line 13: *****.", "Line 14: \"desserts\" — stressed, backwards.", "Line 15: 'A' on the front of \"na\" is \"Ana\": True."] },
        mistake: "Joining a number straight onto text: \"Score: \" ++ 42. ++ only joins two lists of the same type, so use show 42."
      } },
    { title: "Pattern Matching", chapter: "Shapes of data · equations, _, [], x : xs, tuples, case", line: 'describe 0 = "none"',
      content: {
        story: ["A function can be written as several equations, one for each kind of input. Haskell tries them from top to bottom and uses the first one whose pattern fits.",
          "Patterns can be exact values (0, \"red\"), the wildcard _ that fits anything, an empty list [], a list split into its first item and the rest (w : _), or a tuple taken apart (x, y).",
          "case … of does the same job inside an expression: case colour of \"red\" -> \"stop\". With -Wall turned on, GHC warns you if a case can't handle every possible input."],
        big: "Several equations, tried in order; patterns pick values apart, and _ catches anything else.",
        caption: "Each input slides down the equations until one fits. Tap Play.",
        demo: ["describe 0 = \"none\"", "describe 1 = \"one\"", "describe _ = \"lots\"", "firstWord (w : _) = w"]
      },
      deep: {
        more: ["Patterns name the pieces they match: in swap (x, y) = (y, x), x and y are the two halves of the pair.",
          "A pattern that misses some inputs is a time bomb: the program crashes the day one of them turns up. Always cover every case."],
        ex: { code: src(["describe :: Int -> String", "describe 0 = \"none\"", "describe 1 = \"one\"", "describe _ = \"lots\"", "", "firstWord :: [String] -> String", "firstWord [] = \"(empty)\"", "firstWord (w : _) = w", "", "swap :: (a, b) -> (b, a)", "swap (x, y) = (y, x)", "", "light :: String -> String", "light colour = case colour of", "  \"red\" -> \"stop\"", "  \"green\" -> \"go\"", "  _ -> \"slow down\"", "", "main :: IO ()", "main = do", "  putStrLn (describe 0)", "  putStrLn (describe 1)", "  putStrLn (describe 7)", "  putStrLn (firstWord [\"hello\", \"there\"])", "  putStrLn (firstWord [])", "  print (swap (1, \"one\"))", "  putStrLn (light \"green\")", "  putStrLn (light \"blue\")"]),
          walk: ["Lines 1–4: three equations; _ catches every number except 0 and 1.", "Lines 6–8: [] fits an empty list; (w : _) takes the first word and ignores the rest.", "Lines 10–11: a pair's halves, swapped.", "Lines 13–17: case matches the colour, with _ as the catch-all.", "Lines 21–23: none, one, lots.", "Lines 24–25: hello, then (empty).", "Line 26: (\"one\",1).", "Lines 27–28: go, and slow down for any other colour."] },
        mistake: "Putting the catch-all first. With describe _ = \"lots\" above describe 0, a 0 never gets its own answer, and GHC warns that the later equation is redundant."
      } },
    { title: "Recursion", chapter: "Repeat · base case, calling yourself, x : xs", line: "total (x : xs) = x + total xs",
      content: {
        story: ["Haskell has no for or while loops. Instead, a function calls itself on a smaller problem — that's recursion. It sounds odd at first, and then it clicks.",
          "Every recursive function needs a base case that stops it: total [] = 0 says an empty list adds up to 0. The other equation does one step and hands the rest back: total (x : xs) = x + total xs.",
          "In everyday code, map, filter and folds (next chapter) do most of the looping for you. They're written with recursion underneath."],
        big: "A function calls itself on a smaller input until it reaches a base case that stops it.",
        caption: "total peels off one number at a time until the list is empty. Tap Play.",
        demo: ["total [] = 0", "total (x : xs) = x + total xs", "total [4, 5, 6]", "4 + (5 + (6 + 0)) → 15"]
      },
      deep: {
        more: ["Follow it by hand once: total [4, 5, 6] is 4 + total [5, 6], which is 4 + 5 + total [6], which is 4 + 5 + 6 + total [], and total [] is 0.",
          "Forget the base case and the function never stops, or it crashes with a stack overflow on a long list."],
        ex: { code: src(["countdown :: Int -> [String]", "countdown 0 = [\"Blast off!\"]", "countdown n = show n : countdown (n - 1)", "", "total :: [Int] -> Int", "total [] = 0", "total (x : xs) = x + total xs", "", "factorial :: Integer -> Integer", "factorial 0 = 1", "factorial n = n * factorial (n - 1)", "", "main :: IO ()", "main = do", "  mapM_ putStrLn (countdown 3)", "  print (total [4, 5, 6])", "  print (factorial 5)", "  print (factorial 20)"]),
          walk: ["Lines 1–3: the countdown stops at 0; otherwise it shows n and counts down from n - 1.", "Lines 5–7: an empty list adds up to 0; otherwise it's the first item plus the total of the rest.", "Lines 9–11: the factorial of 0 is 1; the factorial of n is n times the factorial of n - 1.", "Line 15: 3, 2, 1, Blast off!", "Line 16: 4 + 5 + 6 + 0 = 15.", "Line 17: 120.", "Line 18: Integer has no limit: 2432902008176640000."] },
        mistake: "Recursing without getting smaller, like countdown n = show n : countdown n. It never reaches the base case and runs forever."
      } },
    { title: "Map, Filter and Folds", chapter: "Lists at once · map, filter, foldr, lambdas, comprehensions", line: "doubled = map (* 2) scores",
      content: {
        story: ["Three tools do most list work. map changes every item, filter keeps the items that pass a test, and a fold boils the whole list down to one value.",
          "Functions can be passed around like any other value. (* 2) is the “times two” function, even is a test, and \\x -> x * x is a function with no name, written on the spot — a lambda.",
          "List comprehensions read like math: [x * 10 | x <- nums, x > 7] means “x times 10, for each x in nums, keeping those over 7.”"],
        big: "map changes every item, filter keeps some, folds combine them all — and functions are values you pass in.",
        caption: "Each number goes through the function on its way into the new list. Tap Play.",
        demo: ["map (* 2) [1, 2, 3]", "[2,4,6]", "filter even [1 .. 10]", "foldr (+) 0 [1 .. 10] → 55"]
      },
      deep: {
        more: ["foldr (+) 0 [1, 2, 3] means 1 + (2 + (3 + 0)). sum, product, and, or and length are all folds.",
          "zipWith walks two lists side by side: zipWith (+) [1, 2] [10, 20] is [11,22]."],
        ex: { code: src(["main :: IO ()", "main = do", "  let nums = [1 .. 10]", "  print (map (* 2) [1, 2, 3])", "  print (filter even nums)", "  print (map (\\x -> x * x) [1 .. 5])", "  print (foldr (+) 0 nums)", "  print (sum (filter odd nums))", "  print [x * 10 | x <- nums, x > 7]", "  print (zipWith (+) [1, 2, 3] [10, 20, 30])", "  print (length (filter (> 5) nums))"]),
          walk: ["Line 3: the numbers 1 to 10.", "Line 4: every item doubled: [2,4,6].", "Line 5: only the evens: [2,4,6,8,10].", "Line 6: a lambda squares each one: [1,4,9,16,25].", "Line 7: a fold adds them all: 55.", "Line 8: the odd ones add up to 25.", "Line 9: a comprehension: [80,90,100].", "Line 10: two lists added pair by pair: [11,22,33].", "Line 11: 5 of the numbers are over 5."] },
        mistake: "Getting a section backwards: (2 -) subtracts FROM 2, so map (2 -) [5] is [-3]. Use (subtract 2) to take 2 away."
      } },
    { title: "Tuples and Maybe", chapter: "Pairs and missing values · (a, b), fst, snd, lookup, Just, Nothing", line: 'age = lookup "Ana" ages',
      content: {
        story: ["A tuple holds a fixed number of values, and they can be different types: (\"Ana\", 12). fst takes the first of a pair, snd the second, and zip pairs up two lists.",
          "Some answers might not exist. lookup \"Zoe\" ages can't find Zoe, so instead of crashing it answers Nothing; when it does find someone, it answers Just 9. That's the Maybe type.",
          "To use a Maybe, handle both cases with case … of, or give a default with fromMaybe 0. Haskell has no null: a value that might be missing says so in its type."],
        big: "Tuples bundle a few values; Maybe answers Just a value or Nothing, so missing data is never a surprise.",
        caption: "Leo is found and Zoe isn't: Just 9 and Nothing. Tap Play.",
        demo: ["ages = [(\"Ana\", 12), (\"Leo\", 9)]", "lookup \"Leo\" ages → Just 9", "lookup \"Zoe\" ages → Nothing", "fromMaybe 0 Nothing → 0"]
      },
      deep: {
        more: ["A list of pairs like ages is the simplest lookup table. For big tables, Data.Map (Chapter 15) is much faster.",
          "maybe 0 (+ 1) m is a one-line case: it gives 0 for Nothing and adds one to whatever is inside a Just."],
        ex: { code: src(["import Data.Maybe (fromMaybe)", "", "ages :: [(String, Int)]", "ages = [(\"Ana\", 12), (\"Leo\", 9)]", "", "describeAge :: String -> String", "describeAge who = case lookup who ages of", "  Just age -> who ++ \" is \" ++ show age", "  Nothing -> who ++ \" isn't on the list\"", "", "main :: IO ()", "main = do", "  let pair = (\"Ana\", 12)", "  print (fst pair)", "  print (snd pair)", "  print (lookup \"Leo\" ages)", "  print (lookup \"Zoe\" ages)", "  putStrLn (describeAge \"Ana\")", "  putStrLn (describeAge \"Zoe\")", "  print (fromMaybe 0 (lookup \"Zoe\" ages))", "  print (zip [1, 2, 3] \"abc\")"]),
          walk: ["Lines 3–4: a list of name-and-age pairs.", "Lines 6–9: lookup gives a Maybe, and case handles both answers.", "Lines 14–15: the pair's halves: \"Ana\" and 12.", "Lines 16–17: Just 9 and Nothing.", "Lines 18–19: Ana is 12, and Zoe isn't on the list.", "Line 20: fromMaybe uses 0 when there's Nothing.", "Line 21: zip pairs the lists: [(1,'a'),(2,'b'),(3,'c')]."] },
        mistake: "Treating a Maybe Int as an Int, as in lookup \"Ana\" ages + 1. GHC refuses; unwrap it first with case or fromMaybe."
      } },
    { title: "Your Own Types", chapter: "Design · data, constructors, deriving, records", line: "data Shape = Circle Double | Square Double",
      content: {
        story: ["data makes a new type of your own. data Shape = Circle Double | Rect Double Double says a Shape is either a circle with one number or a rectangle with two. Circle and Rect are its constructors.",
          "Functions on your type use one equation per constructor: area (Circle r) = … and area (Rect w h) = …. Forget one, and -Wall warns you.",
          "Records name the fields: data Pet = Pet { petName :: String, legs :: Int }. Each field name becomes a function that reads it, and rex { legs = 3 } makes a changed copy. deriving Show lets print display your values."],
        big: "data defines a type and its constructors; one equation per constructor handles each case; records name the fields.",
        caption: "Every shape knows its own way to work out its area. Tap Play.",
        demo: ["data Shape = Circle Double | Rect Double Double", "area (Circle r) = 3.14 * r * r", "area (Rect w h) = w * h", "map area [Circle 1, Rect 2 3]"]
      },
      deep: {
        more: ["Types and constructors start with capital letters, and they often share a name, like Pet and Pet.",
          "newtype wraps one value in a type of its own, like newtype Meters = Meters Double, so meters and seconds can't be mixed up by accident."],
        ex: { code: src(["data Shape = Circle Double | Rect Double Double", "  deriving Show", "", "area :: Shape -> Double", "area (Circle r) = 3.14 * r * r", "area (Rect w h) = w * h", "", "data Pet = Pet { petName :: String, legs :: Int }", "  deriving Show", "", "main :: IO ()", "main = do", "  let shapes = [Circle 1, Rect 2 3]", "  print (map area shapes)", "  print (Rect 2 3)", "  let rex = Pet { petName = \"Rex\", legs = 4 }", "  putStrLn (petName rex)", "  print (legs rex)", "  print (rex { legs = 3 })"]),
          walk: ["Lines 1–2: a Shape is a Circle or a Rect; deriving Show lets print show one.", "Lines 4–6: one area equation per constructor.", "Lines 8–9: a record with two named fields.", "Line 14: the areas: [3.14,6.0].", "Line 15: Rect 2.0 3.0 — print shows the constructor and its values.", "Lines 16–18: build a Pet, then read its fields: Rex and 4.", "Line 19: a copy with one field changed: Pet {petName = \"Rex\", legs = 3}."] },
        mistake: "Forgetting deriving Show and then printing the value. GHC says No instance for (Show Shape); add deriving Show under the data line."
      } },
    { title: "Type Classes", chapter: "Shared abilities · Eq, Ord, Show, instance, class, constraints", line: "biggest :: Ord a => [a] -> a",
      content: {
        story: ["A type class is a family of types that share an ability. Eq types can be compared with ==, Ord types can be put in order, Show types can be turned into text, and Num types can do arithmetic.",
          "deriving (Show, Eq, Ord) gives your own type those abilities for free. Enum and Bounded add ranges: [minBound .. maxBound] lists every value.",
          "A constraint like Ord a => in a signature means “this works for any type a, as long as it's in Ord.” You can also write a class of your own and make types join it with instance."],
        big: "Type classes are shared abilities like Eq, Ord and Show; deriving gives them for free, and instance writes them by hand.",
        caption: "Coins compare and list themselves once they derive Ord and Enum. Tap Play.",
        demo: ["data Coin = Penny | Nickel | Dime", "  deriving (Show, Eq, Ord)", "Penny < Dime → True", "biggest :: Ord a => [a] -> a"]
      },
      deep: {
        more: ["The derived order follows the data line: Penny is listed first, so it's the smallest.",
          "In GHCi, :info Ord lists the class's functions and every type that belongs to it."],
        ex: { code: src(["data Coin = Penny | Nickel | Dime", "  deriving (Show, Eq, Ord, Enum, Bounded)", "", "value :: Coin -> Int", "value Penny = 1", "value Nickel = 5", "value Dime = 10", "", "class Describable a where", "  describe :: a -> String", "", "instance Describable Coin where", "  describe c = show c ++ \" is worth \" ++ show (value c) ++ \"c\"", "", "biggest :: Ord a => [a] -> a", "biggest xs = maximum xs", "", "main :: IO ()", "main = do", "  print [minBound .. maxBound :: Coin]", "  print (Penny < Dime)", "  print (Nickel == Nickel)", "  putStrLn (describe Dime)", "  print (biggest [Nickel, Dime, Penny])", "  print (biggest \"haskell\")"]),
          walk: ["Lines 1–2: three coins that can be shown, compared, ordered, counted through and bounded.", "Lines 4–7: each coin's value.", "Lines 9–10: a new class for types that can describe themselves.", "Lines 12–13: Coin joins the class.", "Lines 15–16: biggest works for any list whose items can be ordered.", "Line 20: every coin from first to last: [Penny,Nickel,Dime].", "Lines 21–22: True and True.", "Line 23: Dime is worth 10c.", "Lines 24–25: Dime, and 's' — Chars are ordered too."] },
        mistake: "Writing biggest :: [a] -> a without Ord a =>. GHC complains that it can't compare values of just any type a; the constraint promises that it can."
      } },
    { title: "IO and do", chapter: "Talk to the world · do, <-, let, readFile, forM_, when", line: "name <- getLine",
      content: {
        story: ["Most Haskell code is pure: it only calculates. Anything that touches the outside world — printing, reading input, files — is an IO action, and actions run in order inside a do block.",
          "<- runs an action and names its result: name <- getLine waits for a line of input, and note <- readFile \"note.txt\" reads a file. let names plain values inside the do.",
          "mapM_ and forM_ run an action for every item in a list, and when runs one only if a test is True. forM_ and when come from Control.Monad."],
        big: "IO actions run in order in a do block; <- names an action's result, and let names plain values.",
        caption: "The note is written, read back and printed line by line. Tap Play.",
        demo: ["main = do", "  note <- readFile \"note.txt\"", "  let tasks = lines note", "  forM_ tasks putStrLn"]
      },
      deep: {
        more: ["<- is for actions and let is for plain values. let line = getLine would only name the action itself, without running it.",
          "readLn reads a typed line and turns it into a number in one go. Programs here don't take typing, so the example uses a file instead."],
        ex: { code: src(["import Control.Monad (forM_, when)", "", "main :: IO ()", "main = do", "  putStrLn \"Writing a note...\"", "  writeFile \"note.txt\" \"Buy milk\\nFeed the cat\\n\"", "  note <- readFile \"note.txt\"", "  let tasks = lines note", "  forM_ (zip [1 ..] tasks) $ \\(i, task) ->", "    putStrLn (show i ++ \". \" ++ task)", "  when (length tasks > 1) $", "    putStrLn \"Busy day!\"", "  mapM_ print [length t | t <- tasks]"]),
          walk: ["Line 1: forM_ and when come from Control.Monad.", "Line 5: Writing a note...", "Line 6: writes two lines to note.txt.", "Line 7: <- reads the file back and names it note.", "Line 8: let splits it into lines.", "Lines 9–10: one numbered line per task: 1. Buy milk and 2. Feed the cat.", "Lines 11–12: there's more than one task: Busy day!", "Line 13: the length of each task: 8 and 12."] },
        mistake: "Using = instead of <- for an action. Inside do, let note = readFile \"note.txt\" doesn't read anything, it just names the action. Write note <- readFile \"note.txt\"."
      } },
    { title: "Maps and Modules", chapter: "Libraries · import, qualified, Data.Map, Data.List", line: "import qualified Data.Map as Map",
      content: {
        story: ["import brings in a module, a library of ready-made functions. import Data.List (sort) takes just sort; import qualified Data.Map as Map makes you write Map.lookup, so its names never clash with everyday ones.",
          "A Map pairs keys with values and finds any key fast, even in huge tables. fromList builds one, insert adds a key (making a new Map), and lookup answers a Maybe.",
          "Data.List adds sort, sortOn, group, nub and more. Thousands of other packages live on Hackage, Haskell's package library, and cabal or stack downloads and builds them."],
        big: "import brings in modules; Data.Map is a fast key-value table; Data.List adds sort and group.",
        caption: "The Map finds pear straight away and answers Nothing for kiwi. Tap Play.",
        demo: ["import qualified Data.Map as Map", "stock = Map.fromList [(\"apple\", 3)]", "Map.lookup \"apple\" stock → Just 3", "Map.insert \"plum\" 2 stock"]
      },
      deep: {
        more: ["fromListWith (+) builds a Map and adds up the values of repeated keys — a word counter in one line.",
          "A Map keeps its keys in order, so toList always comes out sorted by key."],
        ex: { code: src(["import qualified Data.Map as Map", "import Data.List (group, sort, sortOn)", "", "main :: IO ()", "main = do", "  let stock = Map.fromList [(\"apple\", 3), (\"pear\", 5)]", "      more = Map.insert \"plum\" 2 stock", "  print (Map.lookup \"pear\" more)", "  print (Map.lookup \"kiwi\" more)", "  print (Map.toList more)", "  print (Map.findWithDefault 0 \"kiwi\" more)", "  let counts = Map.fromListWith (+) [(w, 1) | w <- words \"a b a c b a\"]", "  print (Map.toList counts)", "  print (sort [3, 1, 2])", "  print (sortOn negate [3, 1, 2])", "  print (map length (group (sort \"banana\")))"]),
          walk: ["Lines 1–2: Data.Map, qualified as Map, and three tools from Data.List.", "Lines 6–7: a Map of fruit, and a new Map with plum added.", "Lines 8–9: Just 5 and Nothing.", "Line 10: every pair, sorted by key.", "Line 11: findWithDefault gives 0 for a missing key.", "Lines 12–13: a word count: [(\"a\",3),(\"b\",2),(\"c\",1)].", "Lines 14–15: [1,2,3], and [3,2,1] when sorted by the negative.", "Line 16: the sorted letters grouped as aaa, b and nn: [3,1,2]."] },
        mistake: "Importing Data.Map without qualified. Its filter and map clash with the everyday ones, and GHC reports an ambiguous name."
      } },
    { title: "Errors and Good Habits", chapter: "Safety · Either, Left and Right, readMaybe, -Wall", line: 'safeDiv _ 0 = Left "divide by zero"',
      content: {
        story: ["Haskell prefers errors you can see in the type. Maybe says an answer might be missing; Either String Int says you'll get Right with a number, or Left with the reason it failed.",
          "readMaybe (from Text.Read) turns text into a number safely: Just 12 for \"12\" and Nothing for \"twelve\". The plain read crashes on bad input, so check first.",
          "Compile with -Wall to switch on GHC's warnings. It points out missing cases, unused names and more. Avoid functions that crash, like head on an empty list — handle the empty case instead."],
        big: "Put failure in the type with Maybe and Either, read text safely with readMaybe, and let -Wall find what you missed.",
        caption: "Dividing by zero comes back as a Left with a reason, not a crash. Tap Play.",
        demo: ["safeDiv _ 0 = Left \"divide by zero\"", "safeDiv a b = Right (a `div` b)", "readMaybe \"12\" → Just 12", "ghc -Wall main.hs"]
      },
      deep: {
        more: ["error \"message\" stops the program, so keep it for things that truly can't happen. Everything else deserves a Maybe or an Either.",
          "A guard inside a case pattern, like Just n | n >= 0, accepts the value only when the test passes too."],
        ex: { code: src(["import Text.Read (readMaybe)", "", "safeDiv :: Int -> Int -> Either String Int", "safeDiv _ 0 = Left \"can't divide by zero\"", "safeDiv a b = Right (a `div` b)", "", "parseAge :: String -> Maybe Int", "parseAge s = case readMaybe s of", "  Just n | n >= 0 -> Just n", "  _ -> Nothing", "", "report :: Either String Int -> String", "report (Left problem) = \"Problem: \" ++ problem", "report (Right answer) = \"Answer: \" ++ show answer", "", "main :: IO ()", "main = do", "  putStrLn (report (safeDiv 10 2))", "  putStrLn (report (safeDiv 1 0))", "  print (parseAge \"12\")", "  print (parseAge \"twelve\")", "  print (parseAge \"-3\")", "  print (map parseAge [\"7\", \"x\"])"]),
          walk: ["Lines 3–5: dividing by zero answers Left; anything else answers Right.", "Lines 7–10: readMaybe reads the text, and only numbers of 0 or more are accepted.", "Lines 12–14: report handles both sides of the Either.", "Lines 18–19: Answer: 5 and Problem: can't divide by zero.", "Lines 20–22: Just 12, then Nothing for \"twelve\" and for -3.", "Line 23: [Just 7,Nothing]."] },
        mistake: "Using read on someone's typing. read \"twelve\" :: Int crashes with Prelude.read: no parse. Use readMaybe and handle Nothing."
      } }
  ];

  var shelves = [
    { title: "Haskell Field Guide", chapter: "Beyond the basics · Haskell shelf", line: ["takeWhile (< 9) nums", ":type map"],
      content: {
        story: ["The Prelude, loaded into every program, has dozens of small list tools. A handful do most of the work: takeWhile and dropWhile, any and all, splitAt, iterate, concatMap and zip3.",
          "Hoogle (hoogle.haskell.org) searches by name or by type. Type [a] -> Int and it finds length; it's the fastest way to discover the function you need.",
          "In GHCi, :type shows the type of anything and :info tells you where a name comes from. Reading types is the Haskell superpower."],
        big: "A few dozen Prelude functions cover most list work; Hoogle finds any function by name or by type.",
        caption: "A shelf of small tools, each doing one job on a whole list. Tap Play.",
        demo: ["takeWhile (< 9) nums", "any (> 8) nums", "iterate (* 2) 1", ":type map"]
      },
      deep: {
        more: [":type map shows map :: (a -> b) -> [a] -> [b]: the function, the list going in, and the list coming out.",
          "base is the library that ships with GHC. containers (Data.Map, Data.Set), text and bytestring come with it too."],
        ex: { code: src(["main :: IO ()", "main = do", "  let nums = [3, 8, 2, 9, 4]", "  print (takeWhile (< 9) nums)", "  print (dropWhile (< 9) nums)", "  print (any (> 8) nums)", "  print (all (> 1) nums)", "  print (concatMap show nums)", "  print (take 5 (iterate (* 2) 1))", "  print (splitAt 2 nums)", "  print (zip3 [1, 2] \"ab\" [True, False])"]),
          walk: ["Line 3: five numbers.", "Lines 4–5: keep items while they're under 9: [3,8,2]; or drop them instead: [9,4].", "Lines 6–7: is any over 8? True. Are all over 1? True.", "Line 8: show each one and join them: \"38294\".", "Line 9: iterate keeps doubling: [1,2,4,8,16].", "Line 10: split after two: ([3,8],[2,9,4]).", "Line 11: zip3 zips three lists into triples."] },
        mistake: "Writing a recursive function for something the Prelude already does. Search Hoogle first; the answer is often one word."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · Haskell shelf", line: ["ghc -Wall main.hs", ":type average"],
      content: {
        story: ["Most Haskell bugs are caught by the compiler. GHC's type errors look scary at first, but read them slowly: “Couldn't match expected type Int with actual type String” says exactly what it wanted and what it got.",
          "When you're stuck, ask GHCi with :type, or write the signature you expect and let GHC point to where the code disagrees. Turn on -Wall: it catches missing cases and unused names.",
          "The bugs that slip through tend to be crashes from functions like head [] or maximum [] on an empty list, and whole-number division where you wanted a decimal."],
        big: "Read the type error slowly, ask GHCi for types, turn on -Wall, and handle empty lists.",
        caption: "An empty list gets a safe answer instead of a crash. Tap Play.",
        demo: ["ghc -Wall main.hs", "Couldn't match expected type", ":type average", "listToMaybe [] → Nothing"]
      },
      deep: {
        more: ["Debug.Trace's trace prints a message while a value is being worked out — handy for a moment, but take it out afterwards.",
          "A typed hole, _ written in place of an expression, makes GHC tell you exactly what type belongs there."],
        ex: { code: src(["import Data.Maybe (listToMaybe)", "", "-- head [] would crash with \"Prelude.head: empty list\".", "-- listToMaybe answers Nothing instead.", "firstScore :: [Int] -> Maybe Int", "firstScore scores = listToMaybe scores", "", "average :: [Int] -> Double", "average [] = 0", "average xs = fromIntegral (sum xs) / fromIntegral (length xs)", "", "main :: IO ()", "main = do", "  print (firstScore [90, 75])", "  print (firstScore [])", "  print (average [90, 75, 88])", "  print (average [])", "  print (7 `div` 2, 7 / 2)", "  print (show 42 ++ \"!\")"]),
          walk: ["Lines 3–6: head [] crashes, so firstScore answers a Maybe instead.", "Lines 8–10: average handles the empty list before dividing.", "Lines 14–15: Just 90 and Nothing.", "Line 16: 84.33333333333333.", "Line 17: 0.0 — no crash on an empty list.", "Line 18: div keeps whole numbers and / gives a decimal: (3,3.5).", "Line 19: \"42!\"."] },
        mistake: "Ignoring warnings because the program compiled. An “incomplete patterns” warning is a crash waiting for the right input."
      } },
    { title: "Laziness and Infinite Lists", chapter: "Beyond the basics · Haskell shelf", line: ["take 5 [1 ..]", "cycle [0, 1]"],
      content: {
        story: ["Haskell is lazy: it only works out a value when something needs it. That makes endless lists perfectly fine — [1 ..] goes on forever, and take 5 [1 ..] only ever builds five numbers.",
          "iterate, cycle and repeat make endless lists on purpose. takeWhile stops at the first item that fails a test, so it's their natural partner.",
          "A list can even be defined in terms of itself: fibs = 0 : 1 : zipWith (+) fibs (drop 1 fibs) builds the Fibonacci numbers from their own earlier values."],
        big: "Values are worked out only when needed, so endless lists are fine as long as you only take what you use.",
        caption: "An endless list, and only the first few numbers ever get built. Tap Play.",
        demo: ["take 5 [1 ..]", "[1,2,3,4,5]", "takeWhile (< 40) squares", "fibs = 0 : 1 : zipWith (+) fibs (drop 1 fibs)"]
      },
      deep: {
        more: ["Laziness can pile up work it hasn't done yet. To add up a long list, foldl' from Data.List keeps a running total instead.",
          "length [1 ..] never finishes, because it has to count forever. Only ask for the part of an endless list you need."],
        ex: { code: src(["sieve :: [Int] -> [Int]", "sieve [] = []", "sieve (p : xs) = p : sieve [x | x <- xs, x `mod` p /= 0]", "", "fibs :: [Integer]", "fibs = 0 : 1 : zipWith (+) fibs (drop 1 fibs)", "", "main :: IO ()", "main = do", "  print (take 5 [1 ..])", "  print (take 7 (cycle [0, 1]))", "  print (takeWhile (< 40) (map (^ 2) [1 ..]))", "  print (take 10 fibs)", "  print (take 8 (sieve [2 ..]))", "  print (take 3 (filter even [1 ..]))"]),
          walk: ["Lines 1–3: the sieve keeps a prime and removes its multiples from the rest.", "Lines 5–6: fibs builds itself from its own earlier numbers.", "Line 10: [1,2,3,4,5] from an endless list.", "Line 11: [0,1,0,1,0,1,0].", "Line 12: squares while they're under 40: [1,4,9,16,25,36].", "Line 13: [0,1,1,2,3,5,8,13,21,34].", "Line 14: the first eight primes: [2,3,5,7,11,13,17,19].", "Line 15: [2,4,6]."] },
        mistake: "Asking for all of an endless list, like print [1 ..] or sum [1 ..]. It never finishes; use take or takeWhile first."
      } },
    { title: "Functors and Monads, Gently", chapter: "Beyond the basics · Haskell shelf", line: ["fmap (+ 1) (Just 2)", "Just 20 >>= half"],
      content: {
        story: ["Some types are containers: a list holds many values and a Maybe holds zero or one. fmap (or its operator, <$>) runs a function on whatever is inside and leaves the container as it was.",
          ">>= chains steps that might fail: Just 20 >>= half >>= half halves twice, and stops with Nothing the moment a step fails. A type that knows how to chain steps like this is called a monad.",
          "do-notation is just a nicer way to write >>=. It works for Maybe, for lists and for IO, which is why main is written with do."],
        big: "fmap changes what's inside a container; >>= and do chain steps that might fail, stopping at the first Nothing.",
        caption: "20 halves to 10, then 5; halving 5 fails, so the chain gives Nothing. Tap Play.",
        demo: ["fmap (+ 1) (Just 2) → Just 3", "(* 2) <$> [1, 2, 3]", "Just 20 >>= half >>= half", "x <- readMaybe a"]
      },
      deep: {
        more: ["<*> combines values in containers: (+) <$> Just 3 <*> Just 4 is Just 7, and Nothing if either side is missing.",
          "You've been using a monad all along: every IO do block chains its actions with >>= behind the scenes."],
        ex: { code: src(["import Text.Read (readMaybe)", "", "half :: Int -> Maybe Int", "half n = if even n then Just (n `div` 2) else Nothing", "", "addText :: String -> String -> Maybe Int", "addText a b = do", "  x <- readMaybe a", "  y <- readMaybe b", "  pure (x + y)", "", "main :: IO ()", "main = do", "  print (fmap (+ 1) (Just 2))", "  print (fmap (+ 1) Nothing)", "  print ((* 2) <$> [1, 2, 3])", "  print (Just 20 >>= half >>= half)", "  print (Just 20 >>= half >>= half >>= half)", "  print (addText \"3\" \"4\")", "  print (addText \"3\" \"four\")", "  print ((+) <$> Just 3 <*> Just 4)"]),
          walk: ["Lines 3–4: half fails on odd numbers.", "Lines 6–10: a Maybe do block: if either read fails, the whole answer is Nothing.", "Lines 14–15: Just 3, and Nothing stays Nothing.", "Line 16: <$> maps over a list: [2,4,6].", "Lines 17–18: 20 to 10 to 5 gives Just 5; one more half fails: Nothing.", "Lines 19–20: Just 7, and Nothing because \"four\" isn't a number.", "Line 21: Just 7."] },
        mistake: "Trying to take the value straight out of a Maybe. There might be nothing in it, so use fmap, >>=, do, case or fromMaybe."
      } },
    { title: "Testing Haskell Code", chapter: "Beyond the basics · Haskell shelf", line: ["cabal test", "quickCheck prop_reverse"],
      content: {
        story: ["A test runs your code on known inputs and checks the answers. A list of (input, expected) pairs and a comprehension that collects every mismatch make a test suite in a few lines.",
          "Haskell is famous for property tests: instead of single examples, you state a rule that must always hold — a higher score never gets a worse grade — and check it for hundreds of inputs.",
          "In real projects, Hspec writes tests that read like sentences, QuickCheck invents random inputs to attack your properties, and cabal test runs them all."],
        big: "Check known cases, state properties that must always hold, and let QuickCheck and Hspec run them.",
        caption: "Four cases checked, and one rule tested on every pair of scores. Tap Play.",
        demo: ["cases = [(95, 'A'), (89, 'B')]", "failures = [… | got /= want]", "neverWorse → True", "cabal test"]
      },
      deep: {
        more: ["QuickCheck's classic first property: reversing a list twice gives the list back. It tries 100 random lists to break it.",
          "Pure functions are easy to test: same input, same output, and nothing to set up or clean away."],
        ex: { code: src(["grade :: Int -> Char", "grade score", "  | score >= 90 = 'A'", "  | score >= 80 = 'B'", "  | otherwise = 'C'", "", "cases :: [(Int, Char)]", "cases = [(95, 'A'), (90, 'A'), (89, 'B'), (40, 'C')]", "", "failures :: [String]", "failures =", "  [ \"grade \" ++ show s ++ \" gave \" ++ [got] ++ \", want \" ++ [want]", "  | (s, want) <- cases", "  , let got = grade s", "  , got /= want", "  ]", "", "-- A property: a higher score never gets a worse grade.", "neverWorse :: Bool", "neverWorse = and [grade b <= grade a | a <- [0 .. 100], b <- [a .. 100]]", "", "main :: IO ()", "main = do", "  mapM_ putStrLn failures", "  putStrLn (\"Higher scores never grade lower: \" ++ show neverWorse)", "  putStrLn (show (length cases) ++ \" checks, \" ++ show (length failures) ++ \" failures\")"]),
          walk: ["Lines 1–5: the code under test.", "Lines 7–8: cases with their expected grades, including the edges 90 and 89.", "Lines 10–16: a message for every case whose answer is wrong.", "Lines 19–20: a property checked for every pair of scores from 0 to 100.", "Line 24: there are no failures, so nothing prints.", "Lines 25–26: Higher scores never grade lower: True, and 4 checks, 0 failures."] },
        mistake: "Only testing the happy cases. Test the boundaries — 89 and 90, 0 and 100 — and the empty list."
      } }
  ];

  var glossary = [
    ["--", "Starts a comment that runs to the end of the line."],
    ["::", "Reads “has type”: gives a value's type."],
    ["->", "In a type, the arrow from input to output; in a lambda or a case, from pattern to answer."],
    ["<-", "In a do block, runs an action and names its result."],
    ["$", "Applies a function to everything on its right, saving brackets."],
    [".", "Joins two functions into one: (f . g) x is f (g x)."],
    ["++", "Joins two lists, including two Strings."],
    [":", "Puts one item on the front of a list."],
    ["!!", "Picks a list item by position, counting from 0."],
    ["_", "The wildcard pattern: it matches anything."],
    ["action", "A step that talks to the outside world, like printing; its type is IO."],
    ["base case", "The input where a recursive function stops."],
    ["Bool", "The type of True and False."],
    ["cabal", "Haskell's tool for building projects and fetching packages."],
    ["case", "Chooses an answer by matching a value against patterns."],
    ["Char", "One character, in single quotes: 'A'."],
    ["constraint", "A requirement like Ord a => in a signature."],
    ["constructor", "A capitalized name that builds a value of a data type, like Just or Circle."],
    ["data", "Declares a new type and its constructors."],
    ["deriving", "Gives a type standard abilities like Show and Eq automatically."],
    ["do", "Runs a list of actions in order."],
    ["Double", "A decimal number."],
    ["Either", "A value that is Left (often an error) or Right (a result)."],
    ["fold", "Combines a whole list into one value, like foldr."],
    ["fromIntegral", "Converts a whole number into another number type."],
    ["function", "A rule that turns inputs into an answer."],
    ["functor", "A container you can fmap a function over."],
    ["GHC", "The Glasgow Haskell Compiler, the standard way to build Haskell."],
    ["GHCi", "GHC's interactive prompt for trying code."],
    ["GHCup", "The installer for GHC, cabal and the Haskell tools."],
    ["guard", "A | test in a function: the first True one picks the answer."],
    ["Hackage", "Haskell's online library of packages."],
    ["Hoogle", "A search engine for Haskell functions, by name or by type."],
    ["immutable", "Never changes once made — true of every Haskell value."],
    ["import", "Brings in functions from a module."],
    ["instance", "Makes a type a member of a type class."],
    ["Int", "A whole number with a fixed size."],
    ["Integer", "A whole number with no size limit."],
    ["IO", "The type of actions that interact with the world."],
    ["lambda", "A function with no name, like \\x -> x * 2."],
    ["laziness", "Working out a value only when it's needed."],
    ["let", "Gives a value a name, inside an expression or a do block."],
    ["list", "An ordered row of values of one type."],
    ["list comprehension", "Builds a list from a pattern: [x * 2 | x <- xs]."],
    ["map", "Runs a function on every item of a list."],
    ["Map", "A fast key-value table from Data.Map."],
    ["Maybe", "A value that is Just something, or Nothing."],
    ["module", "A file of code that can be imported."],
    ["monad", "A type that knows how to chain steps, like Maybe, lists and IO."],
    ["newtype", "Wraps one value in a new type."],
    ["otherwise", "Always True; the last guard, catching everything else."],
    ["pattern matching", "Choosing an equation by the shape of the input."],
    ["Prelude", "The standard functions every program gets automatically."],
    ["pure", "Always gives the same answer for the same input, with no side effects."],
    ["QuickCheck", "A library that tests properties with random inputs."],
    ["readMaybe", "Turns text into a value safely, answering a Maybe."],
    ["record", "A data type with named fields."],
    ["recursion", "A function calling itself on a smaller input."],
    ["runghc", "Runs a Haskell file without building a program file first."],
    ["section", "An operator with one side filled in, like (* 2)."],
    ["show", "Turns a value into text."],
    ["signature", "The line that gives a function's type."],
    ["String", "Text: a list of Chars."],
    ["tuple", "A fixed group of values, like (\"Ana\", 12)."],
    ["type class", "A family of types that share an ability, like Eq or Show."],
    ["type inference", "GHC working out the types you didn't write."],
    ["where", "Defines helper names after a function's equation."]
  ];

  var field = [
    { name: "putStrLn / print / show", head: "Prelude", what: "Print text, or show any value.", ex: "print (2 + 3)" },
    { name: "map / filter", head: "Prelude", what: "Change or keep items.", ex: "filter even [1 .. 10]" },
    { name: "foldr / sum / product", head: "Prelude", what: "Combine a list into one value.", ex: "foldr (+) 0 xs" },
    { name: "length / reverse / elem", head: "Prelude", what: "Ask about a list.", ex: "elem 3 xs" },
    { name: "take / drop / splitAt", head: "Prelude", what: "Cut a list.", ex: "take 3 xs" },
    { name: "zip / zipWith / unzip", head: "Prelude", what: "Walk lists side by side.", ex: "zip [1 ..] names" },
    { name: "words / unwords / lines", head: "Prelude", what: "Split and join text.", ex: "words \"a b c\"" },
    { name: "lookup / maybe", head: "Prelude", what: "Find in pairs; handle a Maybe.", ex: "lookup k pairs" },
    { name: "iterate / takeWhile", head: "Prelude", what: "Endless lists, cut to size.", ex: "takeWhile (< 100) (iterate (* 2) 1)" },
    { name: "mapM_ / forM_ / when", head: "Control.Monad", what: "Repeat or choose actions.", ex: "forM_ xs print" },
    { name: "sort / sortOn / group / nub", head: "Data.List", what: "Order and group lists.", ex: "sortOn snd pairs" },
    { name: "toUpper / isDigit", head: "Data.Char", what: "Test and change characters.", ex: "map toUpper s" },
    { name: "fromMaybe / catMaybes", head: "Data.Maybe", what: "Unwrap Maybes.", ex: "fromMaybe 0 m" },
    { name: "Map.fromList / lookup / insert", head: "Data.Map", what: "Fast key-value tables.", ex: "Map.lookup k m" },
    { name: "readMaybe / printf", head: "Text.Read · Text.Printf", what: "Read and format safely.", ex: "printf \"%.2f\\n\" x" }
  ];

  var cheats = [
    { title: "Program Card", body: "A program starts at main.", code: src(["-- main.hs: run with  runghc main.hs", "main :: IO ()", "main = do", "  putStrLn \"Hi!\"", "  print (2 + 3)", "  putStrLn (\"Total: \" ++ show 42)"]) },
    { title: "Values Card", body: "Everyday values and types.", code: src(["n :: Int", "n = 42", "x = 3.14 :: Double", "name = \"Ana\"", "ok = True", "initial = 'A'", "huge = 2 ^ 64 :: Integer"]) },
    { title: "Lists Card", body: "Rows of one type.", code: src(["xs = [10, 20, 30]", "ys = 5 : xs", "zs = xs ++ [40]", "firstTwo = take 2 xs", "third = xs !! 2", "evens = [2, 4 .. 20]", "n = length xs"]) },
    { title: "Functions Card", body: "Define, call, combine.", code: src(["double :: Int -> Int", "double x = x * 2", "", "add :: Int -> Int -> Int", "add a b = a + b", "", "squares = map (\\x -> x * x) [1 .. 5]", "answer = double $ add 1 2"]) },
    { title: "Decisions Card", body: "if and guards.", code: src(["sign :: Int -> String", "sign n", "  | n > 0 = \"positive\"", "  | n == 0 = \"zero\"", "  | otherwise = \"negative\"", "", "parity n = if even n then \"even\" else \"odd\""]) },
    { title: "Patterns & Recursion Card", body: "Equations by shape.", code: src(["total :: [Int] -> Int", "total [] = 0", "total (x : xs) = x + total xs", "", "describe :: Maybe Int -> String", "describe Nothing = \"none\"", "describe (Just n) = \"got \" ++ show n"]) },
    { title: "Types Card", body: "Your own data types.", code: src(["data Shape = Circle Double | Rect Double Double", "  deriving (Show, Eq)", "", "data Pet = Pet { petName :: String, legs :: Int }", "", "area :: Shape -> Double", "area (Circle r) = pi * r * r", "area (Rect w h) = w * h"]) },
    { title: "IO & Libraries Card", body: "Actions and modules.", code: src(["import qualified Data.Map as Map", "import Text.Read (readMaybe)", "", "main :: IO ()", "main = do", "  typed <- getLine", "  let stock = Map.fromList [(\"apple\", 3)]", "  print (Map.lookup \"apple\" stock)", "  print (readMaybe typed :: Maybe Int)"]) }
  ];

  function stars(n) { return new Array(n + 1).join("*"); }
  function padR(s, w) { s = String(s); while (s.length < w) s += " "; return s; }
  function padL(s, w) { s = String(s); while (s.length < w) s = " " + s; return s; }
  function pad0(n, w) { var s = String(n); while (s.length < w) s = "0" + s; return s; }

  var projects = [
    { name: "Rocket Countdown", about: "A range that steps down by one counts to blast off.",
      vars: [{ key: "start", val: 5, min: 1, max: 12 }],
      code: function (v) { return ["start :: Int", "start = " + v.start, "", "main :: IO ()", "main = do", "  mapM_ (\\i -> putStrLn (show i ++ \"...\")) [start, start - 1 .. 1]", "  putStrLn \"Blast off!\""]; },
      run: function (v) { var o = []; for (var i = v.start; i > 0; i--) o.push(i + "..."); o.push("Blast off!"); return o; },
      explain: "[start, start - 1 .. 1] counts down, because its first two numbers set the step to −1. mapM_ prints each one." },
    { name: "Star Steps", about: "replicate makes each row one star longer.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return ["rows :: Int", "rows = " + v.rows, "", "main :: IO ()", "main = mapM_ (\\r -> putStrLn (replicate r '*')) [1 .. rows]"]; },
      run: function (v) { var o = []; for (var r = 1; r <= v.rows; r++) o.push(stars(r)); return o; },
      explain: "replicate r '*' makes a String of r stars, so each row is one star longer than the last." },
    { name: "Coin Bank", about: "scanl1 keeps every running total as the coins go in.",
      vars: [{ key: "coins", val: 5, min: 1, max: 10 }, { key: "each", label: "cents per coin", val: 25, min: 1, max: 50 }],
      code: function (v) { return ["coins :: Int", "coins = " + v.coins, "", "each :: Int", "each = " + v.each, "", "main :: IO ()", "main = do", "  let totals = scanl1 (+) (replicate coins each)", "  mapM_ (\\(i, t) -> putStrLn (\"coin \" ++ show i ++ \": total \" ++ show t)) (zip [1 ..] totals)", "  putStrLn (\"Saved \" ++ show (coins * each) ++ \" cents\")"]; },
      run: function (v) { var o = [], t = 0; for (var i = 1; i <= v.coins; i++) { t += v.each; o.push("coin " + i + ": total " + t); } o.push("Saved " + t + " cents"); return o; },
      explain: "replicate makes the list of coins, and scanl1 (+) keeps every running total on the way. zip [1 ..] numbers them." },
    { name: "Times Table", about: "A list comprehension builds every line of the table.",
      vars: [{ key: "n", val: 7, min: 1, max: 12 }, { key: "upto", val: 5, min: 1, max: 12 }],
      code: function (v) { return ["n :: Int", "n = " + v.n, "", "upto :: Int", "upto = " + v.upto, "", "main :: IO ()", "main = mapM_ putStrLn [show n ++ \" x \" ++ show i ++ \" = \" ++ show (n * i) | i <- [1 .. upto]]"]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(v.n + " x " + i + " = " + v.n * i); return o; },
      explain: "The comprehension builds one line of text for each i from 1 to upto, and mapM_ prints them in order." },
    { name: "FizzBuzz", about: "Guards pick Fizz for threes, Buzz for fives, FizzBuzz for both.",
      vars: [{ key: "limit", val: 15, min: 1, max: 30 }],
      code: function (v) { return ["limit :: Int", "limit = " + v.limit, "", "fizz :: Int -> String", "fizz i", "  | i `mod` 15 == 0 = \"FizzBuzz\"", "  | i `mod` 3 == 0 = \"Fizz\"", "  | i `mod` 5 == 0 = \"Buzz\"", "  | otherwise = show i", "", "main :: IO ()", "main = mapM_ (putStrLn . fizz) [1 .. limit]"]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.limit; i++) o.push(i % 15 === 0 ? "FizzBuzz" : i % 3 === 0 ? "Fizz" : i % 5 === 0 ? "Buzz" : String(i)); return o; },
      explain: "Guards are tried in order, so the 15 test goes first. putStrLn . fizz means “fizz it, then print it.”" },
    { name: "Grade Report", about: "Guards pick the letter; elem picks the message.",
      vars: [{ key: "score", val: 85, min: 0, max: 100 }],
      code: function (v) { return ["score :: Int", "score = " + v.score, "", "grade :: Int -> Char", "grade s", "  | s >= 90 = 'A'", "  | s >= 80 = 'B'", "  | s >= 70 = 'C'", "  | s >= 60 = 'D'", "  | otherwise = 'F'", "", "note :: Char -> String", "note g", "  | g `elem` \"AB\" = \"Great work!\"", "  | g `elem` \"CD\" = \"Keep practicing.\"", "  | otherwise = \"Let's review together.\"", "", "main :: IO ()", "main = do", "  let g = grade score", "  putStrLn (\"Score: \" ++ show score)", "  putStrLn (\"Grade: \" ++ [g])", "  putStrLn (note g)"]; },
      run: function (v) { var s = v.score, g = s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : s >= 60 ? "D" : "F"; return ["Score: " + s, "Grade: " + g, g === "A" || g === "B" ? "Great work!" : g === "C" || g === "D" ? "Keep practicing." : "Let's review together."]; },
      explain: "[g] turns one Char into a one-letter String, and g `elem` \"AB\" asks whether g is one of those letters." },
    { name: "Fibonacci", about: "An endless list builds itself; take keeps the first few.",
      vars: [{ key: "count", val: 10, min: 1, max: 30 }],
      code: function (v) { return ["count :: Int", "count = " + v.count, "", "fibs :: [Integer]", "fibs = 0 : 1 : zipWith (+) fibs (drop 1 fibs)", "", "main :: IO ()", "main = do", "  let firstFew = take count fibs", "  putStrLn (unwords (map show firstFew))", "  putStrLn (\"Number \" ++ show count ++ \" is \" ++ show (last firstFew))"]; },
      run: function (v) { var f = [], a = 0, b = 1, t; for (var i = 0; i < v.count; i++) { f.push(a); t = a + b; a = b; b = t; } return [f.join(" "), "Number " + v.count + " is " + f[f.length - 1]]; },
      explain: "fibs is an endless list made from its own earlier numbers. Laziness means take count only ever works out the first few." },
    { name: "Collatz Trail", about: "Halve even numbers, triple-and-add-one odd ones, until you reach 1.",
      vars: [{ key: "start", val: 6, min: 3, max: 25 }],
      code: function (v) { return ["start :: Int", "start = " + v.start, "", "step :: Int -> Int", "step n = if even n then n `div` 2 else 3 * n + 1", "", "main :: IO ()", "main = do", "  let trail = takeWhile (/= 1) (iterate step start) ++ [1]", "  putStrLn (unwords (map show trail))", "  putStrLn (show (length trail - 1) ++ \" steps to reach 1\")"]; },
      run: function (v) { var n = v.start, trail = [n]; while (n !== 1) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; trail.push(n); } return [trail.join(" "), (trail.length - 1) + " steps to reach 1"]; },
      explain: "iterate step start makes the endless trail start, step start, step (step start)… and takeWhile cuts it off at 1." },
    { name: "Prime Finder", about: "Each number is tested against divisors up to its square root.",
      vars: [{ key: "limit", val: 30, min: 2, max: 60 }],
      code: function (v) { return ["limit :: Int", "limit = " + v.limit, "", "isPrime :: Int -> Bool", "isPrime n = n > 1 && all (\\d -> n `mod` d /= 0) (takeWhile (\\d -> d * d <= n) [2 ..])", "", "main :: IO ()", "main = do", "  let primes = filter isPrime [2 .. limit]", "  putStrLn (unwords (map show primes))", "  putStrLn (show (length primes) ++ \" primes up to \" ++ show limit)"]; },
      run: function (v) { var ps = []; for (var n = 2; n <= v.limit; n++) { var ok = true; for (var d = 2; d * d <= n; d++) { if (n % d === 0) { ok = false; break; } } if (ok) ps.push(n); } return [ps.join(" "), ps.length + " primes up to " + v.limit]; },
      explain: "isPrime only tries divisors up to the square root of n, and all asks whether every one of them leaves a remainder." },
    { name: "Number Guess", about: "The computer guesses the middle of what's left, every time.",
      vars: [{ key: "secret", val: 37, min: 1, max: 100 }],
      code: function (v) { return ["secret :: Int", "secret = " + v.secret, "", "guess :: Int -> Int -> Int -> [String]", "guess low high tries", "  | g == secret = [show g ++ \" is right! Found in \" ++ show tries ++ \" tries.\"]", "  | g < secret = (show g ++ \" is too low\") : guess (g + 1) high (tries + 1)", "  | otherwise = (show g ++ \" is too high\") : guess low (g - 1) (tries + 1)", "  where", "    g = (low + high) `div` 2", "", "main :: IO ()", "main = mapM_ putStrLn (guess 1 100 1)"]; },
      run: function (v) {
        var o = [], low = 1, high = 100, tries = 1;
        while (true) {
          var g = Math.floor((low + high) / 2);
          if (g === v.secret) { o.push(g + " is right! Found in " + tries + " tries."); break; }
          else if (g < v.secret) { o.push(g + " is too low"); low = g + 1; }
          else { o.push(g + " is too high"); high = g - 1; }
          tries++;
        }
        return o;
      },
      explain: "Each wrong guess calls guess again on the half that's left. where names the middle, g, once for all three guards." },
    { name: "Temperature Table", about: "printf lines up Celsius and Fahrenheit in neat columns.",
      vars: [{ key: "start", val: 0, min: -20, max: 40 }],
      code: function (v) { return ["import Text.Printf (printf)", "", "start :: Int", "start = " + v.start, "", "toF :: Int -> Double", "toF c = fromIntegral c * 9 / 5 + 32", "", "main :: IO ()", "main = mapM_ (\\c -> printf \"%4d C = %5.1f F\\n\" c (toF c)) [start, start + 10 .. start + 40]"]; },
      run: function (v) { var o = []; for (var c = v.start; c <= v.start + 40; c += 10) o.push(padL(c, 4) + " C = " + padL((c * 9 / 5 + 32).toFixed(1), 5) + " F"); return o; },
      explain: "printf fills a pattern: %4d is a whole number four wide, and %5.1f a decimal with one place. fromIntegral lets the Int join the decimal math." },
    { name: "Word Tally", about: "A Map counts the words; sortOn ranks them.",
      vars: [{ key: "copies", val: 2, min: 1, max: 5 }],
      code: function (v) { return ["import qualified Data.Map as Map", "import Data.List (sortOn)", "import Data.Ord (Down (..))", "", "copies :: Int", "copies = " + v.copies, "", "main :: IO ()", "main = do", "  let ws = words (unwords (replicate copies \"the cat sat on the mat\"))", "      counts = Map.fromListWith (+) [(w, 1 :: Int) | w <- ws]", "      ranked = sortOn (\\(w, c) -> (Down c, w)) (Map.toList counts)", "  mapM_ (\\(w, c) -> putStrLn (w ++ \": \" ++ show c)) ranked", "  putStrLn (show (length ws) ++ \" words in all\")"]; },
      run: function (v) { var c = v.copies; return ["the: " + 2 * c, "cat: " + c, "mat: " + c, "on: " + c, "sat: " + c, (6 * c) + " words in all"]; },
      explain: "fromListWith (+) adds up a 1 for every word. sortOn with Down puts the biggest count first, then the words from A to Z." },
    { name: "Bank Account", about: "Either answers each withdrawal with a new balance or a reason.",
      vars: [{ key: "balance", val: 100, min: 10, max: 200 }, { key: "amount", val: 30, min: 5, max: 100 }],
      code: function (v) { return ["balance :: Int", "balance = " + v.balance, "", "amount :: Int", "amount = " + v.amount, "", "withdraw :: Int -> Either String Int", "withdraw money", "  | amount > money = Left (\"Refused \" ++ show amount ++ \": only \" ++ show money ++ \" left\")", "  | otherwise = Right (money - amount)", "", "visits :: Int -> Int -> [String]", "visits 0 money = [\"Final balance: \" ++ show money]", "visits k money = case withdraw money of", "  Left problem -> [problem, \"Final balance: \" ++ show money]", "  Right rest -> (\"Took \" ++ show amount ++ \", balance \" ++ show rest) : visits (k - 1) rest", "", "main :: IO ()", "main = mapM_ putStrLn (visits 5 balance)"]; },
      run: function (v) { var o = [], b = v.balance; for (var k = 0; k < 5; k++) { if (v.amount > b) { o.push("Refused " + v.amount + ": only " + b + " left"); break; } b -= v.amount; o.push("Took " + v.amount + ", balance " + b); } o.push("Final balance: " + b); return o; },
      explain: "withdraw answers Left with a reason or Right with the new balance. The case has to handle both, so a refusal can't slip by." },
    { name: "Clock Formatter", about: "divMod splits seconds into hours, minutes and seconds.",
      vars: [{ key: "seconds", val: 3725, min: 0, max: 9999 }],
      code: function (v) { return ["import Text.Printf (printf)", "", "seconds :: Int", "seconds = " + v.seconds, "", "main :: IO ()", "main = do", "  let (hours, rest) = seconds `divMod` 3600", "      (minutes, secs) = rest `divMod` 60", "  printf \"%d seconds is %02d:%02d:%02d\\n\" seconds hours minutes secs", "  printf \"%dh %dm %ds\\n\" hours minutes secs"]; },
      run: function (v) { var h = Math.floor(v.seconds / 3600), m = Math.floor(v.seconds % 3600 / 60), s = v.seconds % 60; return [v.seconds + " seconds is " + pad0(h, 2) + ":" + pad0(m, 2) + ":" + pad0(s, 2), h + "h " + m + "m " + s + "s"]; },
      explain: "divMod gives two answers at once: the whole hours, and what's left over. %02d pads a number to two digits." },
    { name: "Leap Year Finder", about: "filter keeps the leap years among twelve in a row.",
      vars: [{ key: "start", val: 1996, min: 1890, max: 2100 }],
      code: function (v) { return ["start :: Int", "start = " + v.start, "", "isLeap :: Int -> Bool", "isLeap y = (y `mod` 4 == 0 && y `mod` 100 /= 0) || y `mod` 400 == 0", "", "main :: IO ()", "main = do", "  mapM_ (\\y -> putStrLn (show y ++ \" is a leap year\")) (filter isLeap [start .. start + 11])", "  putStrLn (\"Checked \" ++ show start ++ \" to \" ++ show (start + 11))"]; },
      run: function (v) { var o = []; for (var y = v.start; y < v.start + 12; y++) if (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) o.push(y + " is a leap year"); o.push("Checked " + v.start + " to " + (v.start + 11)); return o; },
      explain: "Every 4th year is a leap year, except whole centuries — unless they divide by 400. filter keeps the years that pass." },
    { name: "Shape Areas", about: "A data type with two shapes, and one equation per shape.",
      vars: [{ key: "side", label: "square side", val: 3, min: 1, max: 10 }, { key: "width", label: "rectangle width", val: 2, min: 1, max: 10 }],
      code: function (v) { return ["data Shape = Square Int | Rect Int Int", "  deriving Show", "", "side :: Int", "side = " + v.side, "", "width :: Int", "width = " + v.width, "", "area :: Shape -> Int", "area (Square s) = s * s", "area (Rect w h) = w * h", "", "perimeter :: Shape -> Int", "perimeter (Square s) = 4 * s", "perimeter (Rect w h) = 2 * (w + h)", "", "describe :: Shape -> String", "describe s = show s ++ \": area \" ++ show (area s) ++ \", perimeter \" ++ show (perimeter s)", "", "main :: IO ()", "main = mapM_ (putStrLn . describe) [Square side, Rect width 5]"]; },
      run: function (v) { return ["Square " + v.side + ": area " + v.side * v.side + ", perimeter " + 4 * v.side, "Rect " + v.width + " 5: area " + v.width * 5 + ", perimeter " + 2 * (v.width + 5)]; },
      explain: "data Shape lists every shape a value can be. Each function has one equation per shape, and deriving Show writes Square 3 for us." },
    { name: "Shopping Cart", about: "A record per item; map and sum total the bill.",
      vars: [{ key: "apples", val: 3, min: 0, max: 9 }, { key: "pears", val: 2, min: 0, max: 9 }],
      code: function (v) { return ["import Text.Printf (printf)", "", "data Item = Item { label :: String, cents :: Int, qty :: Int }", "", "apples :: Int", "apples = " + v.apples, "", "pears :: Int", "pears = " + v.pears, "", "cart :: [Item]", "cart = [Item \"apple\" 50 apples, Item \"pear\" 75 pears]", "", "cost :: Item -> Int", "cost item = cents item * qty item", "", "main :: IO ()", "main = do", "  mapM_ (\\i -> printf \"%-6s %d x %d cents = %d\\n\" (label i) (qty i) (cents i) (cost i)) cart", "  printf \"Total: $%.2f\\n\" (fromIntegral (sum (map cost cart)) / 100 :: Double)"]; },
      run: function (v) { var a = v.apples * 50, p = v.pears * 75; return [padR("apple", 6) + " " + v.apples + " x 50 cents = " + a, padR("pear", 6) + " " + v.pears + " x 75 cents = " + p, "Total: $" + ((a + p) / 100).toFixed(2)]; },
      explain: "A record names each field, and label, cents and qty become functions that read them. sum (map cost cart) totals the bill in cents." },
    { name: "Fair Share", about: "Maybe makes the program say what happens when there's no one to share with.",
      vars: [{ key: "total", label: "sweets", val: 17, min: 0, max: 100 }, { key: "people", val: 4, min: 0, max: 10 }],
      code: function (v) { return ["total :: Int", "total = " + v.total, "", "people :: Int", "people = " + v.people, "", "share :: Int -> Int -> Maybe (Int, Int)", "share _ 0 = Nothing", "share t p = Just (t `divMod` p)", "", "main :: IO ()", "main = case share total people of", "  Nothing -> putStrLn \"Nobody to share with!\"", "  Just (each, left) -> do", "    putStrLn (\"Each person gets \" ++ show each)", "    putStrLn (show left ++ \" left over\")"]; },
      run: function (v) { if (v.people === 0) return ["Nobody to share with!"]; return ["Each person gets " + Math.floor(v.total / v.people), (v.total % v.people) + " left over"]; },
      explain: "share answers Nothing when there's no one to share with, so main has to say what happens then. divMod splits the total." }
  ];

  var vt = [
    { line: 'putStrLn "{w}"', why: "putStrLn prints a line of text." },
    { line: "print {n}", why: "print shows any value." },
    { line: "print ({n} + {n2})", why: "Brackets make print show the sum." },
    { line: 'putStrLn ("{w}: " ++ show {n})', why: "show turns a number into text." },
    { line: 'main = putStrLn "{w}"', why: "Every program starts at main." },
    { line: "{v} = {n}", why: "A name stands for one value, for good." },
    { line: "{v} :: Int", why: ":: gives the type." },
    { line: '{sv} = "{w}"', why: "A String goes in double quotes." },
    { line: "{v} = {dec} :: Double", why: "A Double holds decimals." },
    { line: "{sv} = '{L}'", why: "A Char goes in single quotes." },
    { line: "{v} = {n} `div` {d}", why: "div is whole-number division." },
    { line: "{v} = {n} `mod` {d}", why: "mod is the remainder." },
    { line: "{v} = {u} * {d} + {n}", why: "* happens before +." },
    { line: "{v} = fromIntegral {u} / {d}", why: "fromIntegral comes before /." },
    { line: "{v} = round {dec}", why: "round gives a whole number." },
    { line: "{v} = max {n} {n2}", why: "max picks the bigger one." },
    { line: "{f} x = x * {d}", why: "A function: name, input, =, answer." },
    { line: "{f} :: Int -> Int", why: "The arrow shows what goes in and what comes out." },
    { line: "{f} a b = a + b * {d}", why: "Inputs are separated by spaces." },
    { line: "{v} = {f} {n}", why: "Call a function with a space." },
    { line: "print $ {f} {n}", why: "$ saves a pair of brackets." },
    { line: "{f} = (* {d})", why: "A section is an operator waiting for one input." },
    { line: '{sv} = if {v} > {n} then "{w}" else "none"', why: "if always needs an else." },
    { line: '| {v} >= {n} = "{w}"', why: "A guard: a test, then its answer." },
    { line: '| otherwise = "{w}"', why: "otherwise catches everything left." },
    { line: "{u} = if {v} > {n} then {v} - {n} else 0", why: "Both branches give the same type." },
    { line: "big = {v} > {n} && {u} < {n2}", why: "&& is True only when both are." },
    { line: "{arr} = [{n}, {n2}, {n3}]", why: "A list goes in square brackets." },
    { line: "{arr} = [1 .. {n}]", why: "Two dots fill in a range." },
    { line: "{arr} = [0, {d} .. {n}]", why: "The second number sets the step." },
    { line: "more = {n} : {arr}", why: ": puts an item on the front." },
    { line: "longer = {arr} ++ [{n}]", why: "++ joins two lists." },
    { line: "{v} = length {arr}", why: "length counts the items." },
    { line: "{v} = sum {arr}", why: "sum adds them all up." },
    { line: "{v} = {arr} !! {d}", why: "!! picks by position, from 0." },
    { line: "firstFew = take {d} {arr}", why: "take keeps the first few." },
    { line: "{v} = maximum {arr}", why: "maximum finds the biggest." },
    { line: "found = {n} `elem` {arr}", why: "elem asks “is it in there?”" },
    { line: '{sv} = "{w} " ++ show {n}', why: "show lets a number join text." },
    { line: '{v} = length "{w}"', why: "A String is a list of Chars." },
    { line: '{sv} = map toUpper "{w}"', why: "map toUpper capitalizes every letter." },
    { line: "{arr} = words {sv}", why: "words splits at the spaces." },
    { line: "{sv} = replicate {n} '{L}'", why: "replicate repeats a value." },
    { line: '{sv} = reverse "{w}"', why: "reverse works on text too." },
    { line: '{f} 0 = "{w}"', why: "A pattern for one exact value." },
    { line: '{f} _ = "{w}"', why: "_ matches anything." },
    { line: "{f} [] = {n}", why: "[] matches an empty list." },
    { line: "{f} (x : _) = x * {d}", why: "x : _ takes the first item." },
    { line: "{f} (a, b) = a + b * {d}", why: "A tuple pattern names both parts." },
    { line: '{n} -> "{w}"', why: "A case answer for one value." },
    { line: "{f} 0 = {n}", why: "The base case stops the recursion." },
    { line: "{f} n = n * {f} (n - 1)", why: "It calls itself on a smaller input." },
    { line: "{f} (x : xs) = x + {f} xs", why: "Handle the first item, then recurse on the rest." },
    { line: "{f} (x : xs) = x * {d} : {f} xs", why: "Build the answer one item at a time." },
    { line: "{arr} = map (* {d}) [1 .. {n}]", why: "map changes every item." },
    { line: "big = filter (> {n}) {arr}", why: "filter keeps the items that pass." },
    { line: "{arr} = map (\\x -> x + {n}) [1 .. {d}]", why: "A lambda is a function with no name." },
    { line: "{v} = foldr (+) 0 {arr}", why: "foldr combines a list into one value." },
    { line: "{arr} = [x * {d} | x <- [1 .. {n}]]", why: "A comprehension builds a list." },
    { line: "{arr} = [x | x <- [1 .. {n}], even x]", why: "A test after the comma filters." },
    { line: 'pair = ({n}, "{w}")', why: "A tuple holds a few values together." },
    { line: "{v} = fst ({n}, {n2})", why: "fst takes the first of a pair." },
    { line: 'found = lookup "{w}" {m}', why: "lookup answers Just or Nothing." },
    { line: '{v} = fromMaybe 0 (lookup "{w}" {m})', why: "fromMaybe gives a default." },
    { line: "Just x -> x + {n}", why: "Just x unwraps a value." },
    { line: "{f} :: Int -> Maybe Int", why: "Maybe means it might be missing." },
    { line: "data {c} = {c} Int", why: "A constructor carries values." },
    { line: "data {c} = {c} { {v} :: Int, {sv} :: String }", why: "A record names each field." },
    { line: "{o} = {c} {n}", why: "Build a value with its constructor." },
    { line: "data {c} = Small | Big deriving (Show, Eq)", why: "deriving adds abilities for free." },
    { line: "{v} ({c} x) = x * {d}", why: "Match a constructor to get its value." },
    { line: "newtype {c} = {c} Int", why: "newtype wraps one value in a new type." },
    { line: 'instance Show {c} where show _ = "{w}"', why: "instance makes a type join a class." },
    { line: "class {c} a where {f} :: a -> Int", why: "A class lists shared abilities." },
    { line: "{f} :: Ord a => a -> a -> a", why: "Ord a => means a can be compared." },
    { line: "{f} :: Show a => a -> String", why: "Show a => means a can become text." },
    { line: "order = compare {n} {n2}", why: "compare answers LT, EQ or GT." },
    { line: "{sv} <- getLine", why: "<- takes an action's result." },
    { line: "let {v} = {n}", why: "let names a value inside do." },
    { line: "mapM_ print {arr}", why: "mapM_ runs an action for each item." },
    { line: "forM_ [1 .. {n}] $ \\i -> print (i * {d})", why: "forM_ loops with the list first." },
    { line: 'when ({v} > {n}) $ putStrLn "{w}"', why: "when runs an action only if True." },
    { line: 'writeFile "{sv}.txt" "{w}"', why: "writeFile saves text to a file." },
    { line: 'contents <- readFile "{sv}.txt"', why: "readFile reads a whole file." },
    { line: '{m} = Map.fromList [("{w}", {n})]', why: "fromList builds a Map." },
    { line: '{v} = Map.findWithDefault 0 "{w}" {m}', why: "A default for a missing key." },
    { line: 'bigger = Map.insert "{w}" {n} {m}', why: "insert makes a new Map with one more key." },
    { line: "{arr} = nub [{d}, {d}, {n}]", why: "nub removes repeats." },
    { line: "{arr} = sort [{n}, {n2}, {n3}]", why: "sort puts a list in order." },
    { line: '{f} _ 0 = Left "{w}"', why: "Left carries the problem." },
    { line: "{f} a b = Right (a `div` b)", why: "Right carries the answer." },
    { line: 'Left err -> putStrLn ("{w}: " ++ err)', why: "Handle the Left side." },
    { line: "Right {v} -> print ({v} * {d})", why: "Handle the Right side." },
    { line: '{v} = readMaybe "{n}" :: Maybe Int', why: "readMaybe reads text safely." },
    { line: "{f} :: Int -> Either String Int", why: "Either says it may fail, and why." }
  ];
  var themes = [
    { name: "Printing", t: [0, 1, 2, 3, 4] },
    { name: "Names and Types", t: [5, 6, 7, 8, 9] },
    { name: "Math", t: [10, 11, 12, 13, 14] },
    { name: "Functions", t: [16, 17, 18, 19, 21] },
    { name: "Decisions", t: [22, 23, 24, 25, 26] },
    { name: "Lists", t: [27, 28, 29, 30, 31] },
    { name: "List Tools", t: [32, 33, 34, 35, 36] },
    { name: "Text", t: [38, 39, 40, 41, 42] },
    { name: "Mixed Warm-up", t: [43, 15, 20, 37, 7] },
    { name: "Patterns", t: [44, 45, 46, 47, 48] },
    { name: "Recursion", t: [50, 51, 52, 53, 49] },
    { name: "Map and Filter", t: [54, 55, 56, 57, 58] },
    { name: "Comprehensions", t: [59, 58, 28, 29, 54] },
    { name: "Tuples and Maybe", t: [60, 61, 62, 63, 64] },
    { name: "Your Own Types", t: [66, 67, 68, 70, 71] },
    { name: "Type Classes", t: [72, 73, 74, 75, 69] },
    { name: "IO and do", t: [77, 78, 79, 80, 81] },
    { name: "Files and Maps", t: [82, 83, 84, 85, 86] },
    { name: "Errors", t: [89, 90, 91, 92, 93] },
    { name: "Haskell Masters", t: [76, 87, 88, 94, 65] }
  ];
  /* Function names for the Vault: none is a Prelude name, and none is
     one of the Vault's value names, so a line never redefines a
     built-in or calls a value as if it were a function. */
  var FUNCS = ["heal", "grow", "shine", "boost", "dash", "spin", "mend", "craft", "cheer", "greet", "launch", "glide", "charge", "explore", "wave", "zap", "sing", "build", "paint", "bake", "twist", "hop", "bounce", "glow", "swim", "climb"];
  function pick(bank, r) { return bank[Math.floor(r() * bank.length)]; }

  return {
    blocks: blocks, chapters: chapters, shelves: shelves, glossary: glossary, field: field, cheats: cheats,
    projects: projects, vt: vt, themes: themes,
    fill: function (k, r) {
      if (k === "f") return pick(FUNCS, r);
      return null;
    },
    sandboxNote: "Thirty everyday Haskell lines, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your Haskell progress is saved separately from every other track.",
    sourcesHTML: 'Haskell facts and syntax follow the <a href="https://www.haskell.org/onlinereport/haskell2010/">Haskell 2010 Report</a>, the <a href="https://downloads.haskell.org/ghc/latest/docs/users_guide/">GHC User’s Guide</a> and the documentation of the <a href="https://hackage.haskell.org/package/base">base</a> and <a href="https://hackage.haskell.org/package/containers">containers</a> libraries. Every explanation is written in Code Block’s own words, and every practice program is run by real GHC before it ships.'
  };
});
