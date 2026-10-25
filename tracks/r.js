"use strict";
/* ================= R — a Code Block track =================
   Written fresh for Code Block in plain words. Facts and syntax follow
   the R manuals (An Introduction to R, the R Language Definition) and
   R's own help pages. Everything here is base R, so it runs on any R
   install. Every PC project and library example is run by real R
   (Rscript) in tests/content, with any warning counted as a failure, and
   a project's output must match the app. Every drill and Vault line is
   parsed (not run) by R itself. */
cbRegisterTrack("r", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Print Block", short: "print()", chapter: "R Ch. 1 · First Steps", icon: "i-say", verb: "show",
      line: 'print("Hello, world!")',
      explain: "print shows a value the way R sees it. The [1] in front means “this is item 1 of what follows.”" },
    { name: "Cat Block", short: "cat()", chapter: "R Ch. 1 · First Steps", icon: "i-rows", verb: "say",
      line: 'cat("Hello, world!\\n")',
      explain: "cat prints plain text with no [1] and no quotes. \\n ends the line; without it the next output joins on." },
    { name: "Arrow Block", short: "<-", chapter: "R Ch. 2 · Variables and Types", icon: "i-tag", verb: "store",
      line: "score <- 10",
      explain: "The arrow <- puts a value into a name. = works too, but <- is the R habit, and you'll see it everywhere." },
    { name: "Text Block", short: "\"text\"", chapter: "R Ch. 2 · Variables and Types", icon: "i-link", verb: "name",
      line: 'name <- "Ana"',
      explain: "Text goes in quotes. R calls text “character” data; class(name) tells you so." },
    { name: "Logical Block", short: "TRUE", chapter: "R Ch. 2 · Variables and Types", icon: "i-toggle", verb: "decide",
      line: "alive <- TRUE",
      explain: "TRUE and FALSE are R's yes and no, written in capitals. NA means a value is missing." },
    { name: "Remainder Block", short: "%%", chapter: "R Ch. 3 · Math", icon: "i-calc", verb: "divide",
      line: "remainder <- 17 %% 5",
      explain: "%% gives the remainder (2) and %/% the whole number of times it fits (3). / gives the exact answer, 3.4." },
    { name: "Round Block", short: "round()", chapter: "R Ch. 3 · Math", icon: "i-gauge", verb: "round",
      line: "rounded <- round(3.14159, 2)",
      explain: "round(x, 2) keeps two decimal places: 3.14. sqrt, abs, floor and ceiling work the same way." },
    { name: "Vector Block", short: "c()", chapter: "R Ch. 4 · Vectors", icon: "i-boxes", verb: "collect",
      line: "scores <- c(90, 75, 88)",
      explain: "c() combines values into a vector, R's basic list. Even a single number is a vector of length one." },
    { name: "Range Block", short: "1:10", chapter: "R Ch. 4 · Vectors", icon: "i-list", verb: "count",
      line: "nums <- 1:10",
      explain: "1:10 makes the whole numbers 1 to 10. seq(0, 100, by = 5) counts in steps." },
    { name: "Index Block", short: "[ ]", chapter: "R Ch. 4 · Vectors", icon: "i-point", verb: "pick",
      line: "second <- scores[2]",
      explain: "Square brackets pick items. R counts from 1, so scores[2] is the second score." },
    { name: "Vector Math Block", short: "* 2", chapter: "R Ch. 4 · Vectors", icon: "i-plus-square", verb: "scale",
      line: "doubled <- scores * 2",
      explain: "Math on a vector works on every item at once — no loop needed. This is called vectorization." },
    { name: "Paste Block", short: "paste()", chapter: "R Ch. 5 · Text", icon: "i-brackets", verb: "join",
      line: 'msg <- paste("Hi,", name)',
      explain: "paste joins pieces of text with a space between them; paste0 joins them with nothing between." },
    { name: "Sprintf Block", short: "sprintf()", chapter: "R Ch. 5 · Text", icon: "i-pencil", verb: "format",
      line: 'line <- sprintf("%s scored %d", name, 42)',
      explain: "sprintf fills each % code in order: %s for text, %d for whole numbers, %.2f for two decimals." },
    { name: "If Block", short: "if", chapter: "R Ch. 6 · Decisions", icon: "i-fork", verb: "decide",
      line: 'if (score > 50) print("Pass")',
      explain: "if runs code only when its test, in round brackets, is TRUE. Add else for the other case." },
    { name: "Ifelse Block", short: "ifelse()", chapter: "R Ch. 6 · Decisions", icon: "i-swap-h", verb: "label",
      line: 'result <- ifelse(scores >= 80, "pass", "retry")',
      explain: "ifelse answers a question for every item of a vector at once and gives back a vector of answers." },
    { name: "For Block", short: "for", chapter: "R Ch. 7 · Loops", icon: "i-repeat", verb: "repeat",
      line: "for (s in scores) print(s)",
      explain: "for takes each item in turn. Many R loops can be replaced by vector math, which is shorter and faster." },
    { name: "While Block", short: "while", chapter: "R Ch. 7 · Loops", icon: "i-hourglass", verb: "loop",
      line: "while (lives > 0) lives <- lives - 1",
      explain: "while repeats as long as its test stays TRUE. next skips to the next lap and break stops the loop." },
    { name: "Function Block", short: "function()", chapter: "R Ch. 8 · Functions", icon: "i-gear", verb: "define",
      line: "twice <- function(x) x * 2",
      explain: "A function is stored in a name like any value. Its last expression is the answer it gives back." },
    { name: "Default Block", short: "x = 1", chapter: "R Ch. 8 · Functions", icon: "i-shield-check", verb: "default",
      line: 'greet <- function(name = "friend") paste("Hi,", name)',
      explain: "name = \"friend\" is a default: call greet() with nothing and it uses \"friend\"." },
    { name: "List Block", short: "list()", chapter: "R Ch. 9 · Lists", icon: "i-folder", verb: "bundle",
      line: 'player <- list(name = "Ana", hp = 100)',
      explain: "A list holds values of different kinds together, each under a name." },
    { name: "Dollar Block", short: "$", chapter: "R Ch. 9 · Lists", icon: "i-link", verb: "reach",
      line: "hp <- player$hp",
      explain: "$ reaches into a list (or a data frame) by name. player[[\"hp\"]] does the same." },
    { name: "Data Frame Block", short: "data.frame()", chapter: "R Ch. 10 · Data Frames", icon: "i-grid", verb: "tabulate",
      line: 'df <- data.frame(name = c("Ana", "Leo"), score = c(120, 95))',
      explain: "A data frame is a table: each column is a vector, and each row is one record." },
    { name: "Filter Block", short: "df[rows, ]", chapter: "R Ch. 10 · Data Frames", icon: "i-funnel", verb: "filter",
      line: "top <- df[df$score > 100, ]",
      explain: "df[rows, columns] picks part of a table. A test before the comma keeps the rows where it's TRUE." },
    { name: "Sapply Block", short: "sapply()", chapter: "R Ch. 11 · Apply and Friends", icon: "i-layers", verb: "map",
      line: "squares <- sapply(1:5, function(x) x^2)",
      explain: "sapply runs a function on every item and collects the answers into a vector." },
    { name: "Table Block", short: "table()", chapter: "R Ch. 12 · Factors and Tables", icon: "i-shapes", verb: "count",
      line: "counts <- table(fruits)",
      explain: "table counts how often each value appears — the quickest way to tally categories." },
    { name: "Mean Block", short: "mean()", chapter: "R Ch. 13 · Statistics", icon: "i-calc", verb: "average",
      line: "avg <- mean(scores)",
      explain: "mean, median, sd, min and max are built in. Add na.rm = TRUE to skip missing values." },
    { name: "Summary Block", short: "summary()", chapter: "R Ch. 13 · Statistics", icon: "i-eye", verb: "describe",
      line: "summary(scores)",
      explain: "summary gives the minimum, quartiles, median, mean and maximum in one line." },
    { name: "Order Block", short: "order()", chapter: "R Ch. 14 · Sorting and Filtering", icon: "i-rows", verb: "rank",
      line: "ranked <- df[order(-df$score), ]",
      explain: "order gives the row numbers in sorted order; the minus sign sorts from highest to lowest." },
    { name: "Read CSV Block", short: "read.csv()", chapter: "R Ch. 15 · Files", icon: "i-file", verb: "load",
      line: 'data <- read.csv("scores.csv")',
      explain: "read.csv loads a spreadsheet-style file straight into a data frame. write.csv saves one." },
    { name: "TryCatch Block", short: "tryCatch()", chapter: "R Ch. 16 · Errors and Good Habits", icon: "i-shield-alert", verb: "catch",
      line: "safe <- tryCatch(as.numeric(\"x\"), warning = function(w) NA)",
      explain: "tryCatch runs code and catches errors or warnings, so one bad value doesn't stop the whole script." }
  ];

  var chapters = [
    { title: "First Steps", chapter: "Start here · print, cat, comments, Rscript", line: 'print("Hello, world!")',
      content: {
        story: ["R is a language made for data: statistics, charts and analysis. Scientists, analysts and researchers use it to turn tables of numbers into answers, and it's free.",
          "print shows a value the way R sees it, with [1] in front, which means “item 1.” cat prints plain text for people to read. Comments start with # and R skips them.",
          "Install R from r-project.org (RStudio is a friendly editor on top). Save code as main.R and run Rscript main.R, or type lines straight into the R console and see each answer at once."],
        big: "R is the language of data: print shows a value, cat writes plain text, and # starts a comment.",
        caption: "Rscript reads the file from the top; print adds its [1], cat doesn't. Tap Play.",
        demo: ["$ Rscript main.R", "print(\"Hello, world!\")", "[1] \"Hello, world!\"", "# comments start with a hash"]
      },
      deep: {
        more: ["cat puts a space between the things you give it — even before a \\n at the end. sep = \"\" turns those spaces off, which keeps the end of each line tidy.",
          "In the console, typing a value on its own prints it. In a script, use print or cat to show things."],
        ex: { code: src(["# My first R program", "print(\"Hello, world!\")", "cat(\"I am learning R.\\n\")", "print(2 + 3)", "cat(\"2 + 3 is\", 2 + 3, \"\\n\")", "cat(\"No extra space\", \"\\n\", sep = \"\")"]),
          walk: ["Line 1: a comment, skipped by R.", "Line 2: print shows the text in quotes, after [1]: [1] \"Hello, world!\"", "Line 3: cat shows plain text: I am learning R.", "Line 4: [1] 5.", "Line 5: cat puts spaces between its pieces: 2 + 3 is 5 — with one more space before the line ends.", "Line 6: sep = \"\" joins the pieces with nothing: No extra space."] },
        mistake: "Typing Print with a capital P. R is case-sensitive, so it reports could not find function \"Print\"."
      } },
    { title: "Variables and Types", chapter: "Boxes · <-, numbers, text, TRUE/FALSE, NA, class()", line: "score <- 10",
      content: {
        story: ["score <- 10 stores 10 under the name score. Read the arrow as “gets”: score gets 10. = also works, but <- is what R programmers write.",
          "The everyday kinds of values are numeric (10, 3.5), character (\"Ana\"), and logical (TRUE or FALSE). class(x) tells you which one x is.",
          "NA means a value is missing — a blank cell in a spreadsheet. R carries NA through math on purpose, so you notice the gap instead of getting a quietly wrong answer."],
        big: "x <- value stores it; numbers, text and TRUE/FALSE are the basic kinds, and NA marks a missing value.",
        caption: "The arrow drops each value into its labelled box. Tap Play.",
        demo: ["score <- 10", "name <- \"Ana\"", "alive <- TRUE", "class(score) → \"numeric\""]
      },
      deep: {
        more: ["Names can use letters, digits, dots and underscores, and can't start with a digit. many_words_like_this is the common style.",
          "is.na(x) asks “is this missing?”. Never test x == NA: the answer to that is NA, too."],
        ex: { code: src(["score <- 10", "name <- \"Ana\"", "alive <- TRUE", "unknown <- NA", "score <- score + 5", "cat(name, \"has\", score, \"points\\n\")", "print(class(score))", "print(class(name))", "print(class(alive))", "print(is.na(unknown))", "x = 3  # = works too, but <- is the R habit", "print(x)"]),
          walk: ["Lines 1–4: a number, text, a logical and a missing value.", "Line 5: the box gets its old value plus 5.", "Line 6: Ana has 15 points.", "Lines 7–9: [1] \"numeric\", [1] \"character\", [1] \"logical\".", "Line 10: [1] TRUE — the value is missing.", "Lines 11–12: [1] 3."] },
        mistake: "Writing score < - 10 with a space inside the arrow. R reads that as “is score less than minus 10?” and stores nothing. Keep <- together."
      } },
    { title: "Math", chapter: "Numbers · + − * / ^, %% and %/%, round, sqrt", line: "remainder <- 17 %% 5",
      content: {
        story: ["R is a calculator first: + - * / and ^ for powers. Division gives the exact answer, so 17 / 5 is 3.4.",
          "Two operators split a division: %/% is how many whole times it fits (3) and %% is what's left over (2). %% is the classic way to test for even numbers: x %% 2 == 0.",
          "round(x, 2) rounds to two decimal places, and sqrt, abs, floor and ceiling do what their names say. 10L, with an L, is a whole-number integer."],
        big: "+ − * / ^ do the math; %/% and %% split a division into whole times and remainder.",
        caption: "17 splits into three 5s with 2 left over. Tap Play.",
        demo: ["17 / 5 → 3.4", "17 %/% 5 → 3", "17 %% 5 → 2", "2^10 → 1024"]
      },
      deep: {
        more: ["R follows the usual order: powers first, then * and /, then + and -. Round brackets change it.",
          "Very large or small numbers print in scientific notation: 1e+05 means 100000."],
        ex: { code: src(["coins <- 17", "players <- 5", "print(coins / players)", "print(coins %/% players)", "print(coins %% players)", "print(2^10)", "print(round(3.14159, 2))", "print(sqrt(16))", "print((3 + 4) * 2)", "print(class(10L))"]),
          walk: ["Lines 1–3: the exact answer: [1] 3.4.", "Line 4: whole times: [1] 3.", "Line 5: the remainder: [1] 2.", "Line 6: [1] 1024.", "Line 7: [1] 3.14.", "Line 8: [1] 4.", "Line 9: brackets first: [1] 14.", "Line 10: the L makes a whole-number integer: [1] \"integer\"."] },
        mistake: "Expecting 0.1 + 0.2 == 0.3 to be TRUE. Decimals are stored in binary, so it's FALSE. Compare with isTRUE(all.equal(0.1 + 0.2, 0.3))."
      } },
    { title: "Vectors", chapter: "Lists of values · c(), 1:10, seq, [ ], vector math", line: "scores <- c(90, 75, 88)",
      content: {
        story: ["The vector is R's basic building block: a row of values of the same kind. c(90, 75, 88) combines three numbers into one. Even a single number is a vector of length one — that's what the [1] means.",
          "Square brackets pick items, counting from 1: scores[1] is the first. A test inside the brackets keeps only the items that pass: scores[scores > 80].",
          "Math works on the whole vector at once. scores * 2 doubles every score; sum(scores) and mean(scores) answer for all of them. No loop needed."],
        big: "A vector is a row of values; [ ] picks from it, and math runs on every item at once.",
        caption: "One multiplication doubles every item in the row. Tap Play.",
        demo: ["scores <- c(90, 75, 88)", "scores * 2", "[1] 180 150 176", "scores[scores > 80]"]
      },
      deep: {
        more: ["1:5 makes 1 2 3 4 5, and seq(0, 20, by = 5) makes 0 5 10 15 20. length(x) counts the items.",
          "Comparing a vector gives a vector of TRUE and FALSE, one per item, which is exactly what the brackets need for filtering."],
        ex: { code: src(["scores <- c(90, 75, 88)", "print(scores)", "print(scores[1])", "print(length(scores))", "scores <- c(scores, 100)", "print(scores * 2)", "print(scores > 80)", "print(sum(scores))", "print(mean(scores))", "print(1:5)", "print(seq(0, 20, by = 5))", "print(scores[scores > 80])"]),
          walk: ["Lines 1–2: [1] 90 75 88.", "Line 3: counting starts at 1: [1] 90.", "Line 4: [1] 3.", "Line 5: c() adds 100 to the end.", "Line 6: every item doubled: 180 150 176 200.", "Line 7: one answer per item: TRUE FALSE TRUE TRUE.", "Lines 8–9: [1] 353 and [1] 88.25.", "Lines 10–11: 1 2 3 4 5 and 0 5 10 15 20 (print lines the numbers up in columns).", "Line 12: only the scores above 80: 90 88 100."] },
        mistake: "Starting at zero: scores[0]. R counts from 1, and scores[0] gives an empty vector, numeric(0), instead of the first item."
      } },
    { title: "Text", chapter: "Strings · paste, paste0, sprintf, nchar, toupper, gsub", line: 'msg <- paste("Hi,", name)',
      content: {
        story: ["Text in R is called character data. paste joins pieces with a space between them; paste0 joins them with nothing between.",
          "sprintf builds text from a pattern: %s for text, %d for whole numbers and %.1f for a number with one decimal. It's the tidiest way to line up output.",
          "nchar counts characters, toupper and tolower change case, substr cuts a piece out, gsub replaces every match, and strsplit breaks text apart."],
        big: "paste and paste0 join text, sprintf fills a pattern, and nchar, toupper, substr and gsub reshape it.",
        caption: "The pieces slide together, with or without spaces. Tap Play.",
        demo: ["paste(\"Hi,\", name)", "\"Hi, Ana\"", "paste0(\"Hi,\", name)", "\"Hi,Ana\""]
      },
      deep: {
        more: ["Like everything in R, these work on whole vectors: toupper(c(\"a\", \"b\")) gives \"A\" \"B\".",
          "paste(words, collapse = \"+\") joins the items of one vector into a single piece of text."],
        ex: { code: src(["name <- \"Ana\"", "coins <- 42", "print(paste(\"Hi,\", name))", "print(paste0(\"Hi,\", name))", "print(paste(\"a\", \"b\", \"c\", sep = \"-\"))", "cat(sprintf(\"%s has %d coins (%.1f%%)\\n\", name, coins, 12.345))", "print(nchar(\"Leonardo\"))", "print(toupper(name))", "print(substr(\"Leonardo\", 1, 3))", "print(gsub(\"o\", \"0\", \"Leonardo\"))", "words <- strsplit(\"red green blue\", \" \")[[1]]", "print(words)", "print(paste(words, collapse = \"+\"))"]),
          walk: ["Lines 3–4: \"Hi, Ana\" and \"Hi,Ana\".", "Line 5: sep picks the joiner: \"a-b-c\".", "Line 6: Ana has 42 coins (12.3%) — %% prints a percent sign.", "Line 7: [1] 8.", "Line 8: \"ANA\".", "Line 9: characters 1 to 3: \"Leo\".", "Line 10: every o replaced: \"Le0nard0\".", "Lines 11–12: three words: \"red\" \"green\" \"blue\".", "Line 13: \"red+green+blue\"."] },
        mistake: "Using + to join text: \"Hi\" + name. R reports non-numeric argument to binary operator. Use paste or paste0."
      } },
    { title: "Decisions", chapter: "Choices · if, else, ifelse, &&, %in%, switch", line: 'if (score > 50) print("Pass")',
      content: {
        story: ["if (test) { … } runs code only when the test is TRUE; else if and else handle the other cases. Comparisons are ==, !=, <, >, <= and >=.",
          "&& and || join single tests (and, or), and ! flips TRUE to FALSE. %in% asks “is this one of these?”: \"pear\" %in% fruits.",
          "ifelse is R's vector version: ifelse(scores >= 80, \"pass\", \"retry\") answers for every score at once. switch picks a value by name."],
        big: "if/else decides once; ifelse decides for every item of a vector; %in% checks membership.",
        caption: "Each score takes the pass door or the retry door. Tap Play.",
        demo: ["if (hp <= 0) {", "  print(\"Game over\")", "}", "ifelse(scores >= 80, \"pass\", \"retry\")"]
      },
      deep: {
        more: ["Use && and || inside if, and the single & and | inside vector tests like scores > 50 & scores < 90.",
          "An if needs exactly one TRUE or FALSE. Giving it a whole vector is an error in current R; use any() or all() to boil it down."],
        ex: { code: src(["hp <- 0", "if (hp <= 0) {", "  print(\"Game over\")", "} else if (hp < 20) {", "  print(\"Careful!\")", "} else {", "  print(\"Keep going\")", "}", "scores <- c(95, 72, 88)", "print(ifelse(scores >= 80, \"pass\", \"retry\"))", "if (hp == 0 && length(scores) > 2) print(\"both true\")", "print(\"pear\" %in% c(\"apple\", \"pear\"))", "grade <- switch(\"b\", a = \"great\", b = \"good\", \"keep going\")", "print(grade)"]),
          walk: ["Lines 1–8: hp is 0, so \"Game over\".", "Lines 9–10: one answer per score: \"pass\" \"retry\" \"pass\".", "Line 11: && needs both: \"both true\".", "Line 12: [1] TRUE.", "Lines 13–14: switch picks by name: \"good\"."] },
        mistake: "Putting else at the start of a new line in a script. R thinks the if already ended. Keep } else { together on one line."
      } },
    { title: "Loops", chapter: "Repeat · for, seq_along, while, repeat, next, break", line: "for (s in scores) print(s)",
      content: {
        story: ["for (s in scores) { … } runs once for each item, with s holding the current one. for (i in 1:10) counts.",
          "while repeats while its test stays TRUE, and repeat loops until a break. next skips to the next lap.",
          "In R, reach for a loop last. Vector math, sum, ifelse and sapply usually say the same thing in one line, and run faster."],
        big: "for walks a vector, while repeats while TRUE, and next or break change the flow.",
        caption: "The loop takes one item at a time. Tap Play.",
        demo: ["for (lap in 1:3) {", "  cat(\"lap \", lap, \"\\n\", sep = \"\")", "}", "lap 1 · lap 2 · lap 3"]
      },
      deep: {
        more: ["seq_along(x) gives 1, 2, 3 … up to length(x). It's safer than 1:length(x), which counts 1, 0 when x is empty.",
          "Growing a vector inside a loop with c() is slow for big data; make it full size first with numeric(n), then fill it."],
        ex: { code: src(["for (lap in 1:3) {", "  cat(\"lap \", lap, \"\\n\", sep = \"\")", "}", "lives <- 3", "while (lives > 0) {", "  lives <- lives - 1", "}", "cat(\"lives: \", lives, \"\\n\", sep = \"\")", "fruits <- c(\"apple\", \"pear\", \"plum\")", "for (i in seq_along(fruits)) {", "  cat(i, \": \", fruits[i], \"\\n\", sep = \"\")", "}", "for (n in 1:10) {", "  if (n %% 2 == 0) next", "  if (n > 7) break", "  cat(n, \"\")", "}", "cat(\"\\n\")"]),
          walk: ["Lines 1–3: lap 1, lap 2, lap 3.", "Lines 4–8: lives: 0.", "Lines 9–12: 1: apple, 2: pear, 3: plum.", "Lines 13–18: skip the even numbers, stop past 7: 1 3 5 7."] },
        mistake: "Writing for (i in 1:length(x)) when x might be empty. 1:0 counts 1 then 0, so the loop runs twice on nothing. Use seq_along(x)."
      } },
    { title: "Functions", chapter: "Machines · function(), defaults, named arguments, return", line: "twice <- function(x) x * 2",
      content: {
        story: ["twice <- function(x) x * 2 makes a function and stores it in a name. Call it with twice(21).",
          "A function hands back its last expression automatically; return() leaves early. Arguments can have defaults: function(name = \"friend\").",
          "Arguments can be given by name in any order: add(b = 1, a = 2). To hand back several answers, return a list."],
        big: "function(args) body makes a reusable machine; its last expression is its answer.",
        caption: "21 goes in, 42 comes out. Tap Play.",
        demo: ["twice <- function(x) x * 2", "twice(21)", "[1] 42", "twice(c(1, 2, 3)) → 2 4 6"]
      },
      deep: {
        more: ["Functions work on vectors for free when the math inside does: twice(c(1, 2, 3)) gives 2 4 6.",
          "Variables made inside a function stay inside it; the outside world only sees what it returns."],
        ex: { code: src(["twice <- function(x) x * 2", "greet <- function(name = \"friend\") {", "  paste0(\"Hi, \", name, \"!\")", "}", "divmod <- function(a, b) {", "  list(quotient = a %/% b, remainder = a %% b)", "}", "print(twice(21))", "print(greet())", "print(greet(\"Ana\"))", "result <- divmod(17, 5)", "print(c(result$quotient, result$remainder))", "print(twice(c(1, 2, 3)))", "minus <- function(a, b) a - b", "print(minus(b = 1, a = 2))"]),
          walk: ["Line 1: a one-line function.", "Lines 2–4: name has a default.", "Lines 5–7: a list carries two answers back.", "Lines 8–10: [1] 42, \"Hi, friend!\", \"Hi, Ana!\".", "Lines 11–12: [1] 3 2.", "Line 13: vectors work too: 2 4 6.", "Lines 14–15: named arguments go to the right place: 2 - 1 is [1] 1."] },
        mistake: "Naming your function the same as a built-in one, like mean or c. Your version hides R's, and code elsewhere breaks in confusing ways."
      } },
    { title: "Lists", chapter: "Bundles · list(), $, [[ ]], names(), str()", line: 'player <- list(name = "Ana", hp = 100)',
      content: {
        story: ["A vector holds one kind of value; a list holds anything — numbers, text, vectors, even other lists — each under a name.",
          "player$hp reaches in by name, and player[[\"hp\"]] does the same (handy when the name is in a variable). Assigning to a new name adds it: player$level <- 2.",
          "str(player) prints the structure of any value: what's inside and what kind each part is. It's the first thing to try with unfamiliar data."],
        big: "list() bundles values of any kind under names; $ and [[ ]] reach in, and str() shows what's inside.",
        caption: "Each value sits in a labelled drawer of one cabinet. Tap Play.",
        demo: ["player <- list(name = \"Ana\", hp = 100)", "player$hp", "[1] 100", "str(player)"]
      },
      deep: {
        more: ["Single brackets on a list give back a smaller list; double brackets give back the item itself.",
          "Setting an item to NULL removes it from the list."],
        ex: { code: src(["player <- list(name = \"Ana\", hp = 100, items = c(\"sword\", \"map\"))", "print(player$name)", "print(player[[\"hp\"]])", "player$hp <- player$hp - 30", "player$level <- 2", "print(names(player))", "print(length(player$items))", "str(player)"]),
          walk: ["Line 1: a list with text, a number and a vector inside.", "Lines 2–3: \"Ana\" and [1] 100.", "Lines 4–5: hp drops to 70 and a new level appears.", "Line 6: \"name\" \"hp\" \"items\" \"level\".", "Line 7: [1] 2.", "Line 8: str shows each part: name is chr \"Ana\", hp is num 70, items is chr [1:2], level is num 2."] },
        mistake: "Using single brackets when you want the value: player[\"hp\"] is a list holding hp, so player[\"hp\"] + 1 fails. Use player$hp or player[[\"hp\"]]."
      } },
    { title: "Data Frames", chapter: "Tables · data.frame, $, [rows, cols], nrow, new columns", line: 'df <- data.frame(name = c("Ana", "Leo"), score = c(120, 95))',
      content: {
        story: ["A data frame is a table — R's version of a spreadsheet. Each column is a vector, all the same length, and each row is one record.",
          "df$score is one column. df[rows, columns] picks part of the table: df[df$score > 100, ] keeps the rows where the test is TRUE, and leaving columns blank means “all of them.”",
          "Add a column by assigning to it: df$bonus <- df$score * 0.1. nrow, ncol, head and summary describe the table."],
        big: "A data frame is a table of column vectors; df[rows, cols] filters it and df$new <- … adds a column.",
        caption: "The test keeps only the rows that pass. Tap Play.",
        demo: ["df <- data.frame(name, score)", "df[df$score > 100, ]", "  name score", "1  Ana   120"]
      },
      deep: {
        more: ["The numbers down the left of a printed data frame are row names, not data.",
          "Most real data arrives from a file: read.csv(\"file.csv\") gives you a data frame directly."],
        ex: { code: src(["df <- data.frame(", "  name = c(\"Ana\", \"Leo\", \"Mia\"),", "  score = c(120, 95, 140),", "  team = c(\"red\", \"blue\", \"red\")", ")", "print(nrow(df))", "print(df$score)", "print(df[df$score > 100, \"name\"])", "df$bonus <- df$score * 0.1", "print(df)", "print(mean(df$score))"]),
          walk: ["Lines 1–5: three rows, three columns.", "Line 6: [1] 3.", "Line 7: one column, as a vector: 120 95 140.", "Line 8: names of the rows that pass: \"Ana\" \"Mia\".", "Lines 9–10: a new column, and the whole table printed with row numbers.", "Line 11: [1] 118.3333."] },
        mistake: "Forgetting the comma: df[df$score > 100] (no comma) tries to pick columns, not rows, and fails. Rows go before the comma."
      } },
    { title: "Apply and Friends", chapter: "Map over data · sapply, lapply, vapply, Map", line: "squares <- sapply(1:5, function(x) x^2)",
      content: {
        story: ["The apply family runs a function over every item without writing a loop. sapply gives back a simple vector; lapply always gives back a list.",
          "vapply is the careful version: you say what each answer must look like (numeric(1), character(1)), and R checks every one.",
          "Map walks two vectors side by side. Together these replace most loops in everyday R code."],
        big: "sapply, lapply, vapply and Map run a function over every item, so you rarely need a loop.",
        caption: "The function visits each item and the answers line up. Tap Play.",
        demo: ["sapply(1:5, function(x) x^2)", "[1]  1  4  9 16 25", "lapply(…) → a list", "Map(f, xs, ys)"]
      },
      deep: {
        more: ["R 4.1 added a short way to write a function: \\(x) x^2 is the same as function(x) x^2.",
          "When plain vector math works (x^2 on the whole vector), it's simpler still."],
        ex: { code: src(["squares <- sapply(1:5, function(x) x^2)", "print(squares)", "words <- c(\"apple\", \"kiwi\", \"banana\")", "print(sapply(words, nchar))", "print(vapply(words, toupper, character(1), USE.NAMES = FALSE))", "lens <- lapply(list(a = 1:3, b = 1:10), length)", "print(lens$b)", "print(Map(function(x, y) x + y, 1:3, 4:6)[[3]])", "print(sum(sapply(1:100, function(x) x %% 3 == 0)))"]),
          walk: ["Lines 1–2: 1 4 9 16 25.", "Lines 3–4: sapply keeps the words as names: apple 5, kiwi 4, banana 6.", "Line 5: \"APPLE\" \"KIWI\" \"BANANA\".", "Lines 6–7: lapply gives a list; b's length is [1] 10.", "Line 8: Map adds pairs: the third is 3 + 6 = [1] 9.", "Line 9: TRUE counts as 1: 33 numbers up to 100 divide by 3."] },
        mistake: "Expecting sapply to always give a vector. If the answers have different lengths it quietly gives a list. vapply makes that an error you can see."
      } },
    { title: "Factors and Tables", chapter: "Categories · table(), factor(), levels", line: "counts <- table(fruits)",
      content: {
        story: ["Lots of data is categories: colors, teams, sizes. table counts how often each value appears — a tally in one call.",
          "A factor is a vector of categories with a fixed list of levels. It remembers every possible level, even ones with no data, and their order.",
          "factor(sizes, levels = c(\"small\", \"medium\", \"large\")) puts the levels in a sensible order instead of alphabetical."],
        big: "table() tallies categories; factor() stores them with a fixed, ordered list of levels.",
        caption: "Each fruit drops into its own pile, and the piles are counted. Tap Play.",
        demo: ["table(fruits)", "apple  pear  plum", "    3     2     1", "factor(sizes, levels = …)"]
      },
      deep: {
        more: ["names(which.max(counts)) gives the most common category.",
          "read.csv keeps text columns as plain text (since R 4.0); turn one into a factor when the categories matter."],
        ex: { code: src(["fruits <- c(\"apple\", \"pear\", \"apple\", \"plum\", \"pear\", \"apple\")", "counts <- table(fruits)", "print(counts)", "print(counts[[\"apple\"]])", "print(names(which.max(counts)))", "sizes <- factor(c(\"small\", \"large\", \"medium\", \"small\"), levels = c(\"small\", \"medium\", \"large\"))", "print(levels(sizes))", "print(as.integer(sizes))", "print(table(sizes))"]),
          walk: ["Lines 1–3: the tally: apple 3, pear 2, plum 1.", "Line 4: [1] 3.", "Line 5: the most common: \"apple\".", "Lines 6–7: the levels in the order given: small, medium, large.", "Line 8: each value's level number: 1 3 2 1.", "Line 9: small 2, medium 1, large 1 — in level order, not alphabetical."] },
        mistake: "Sorting categories by hand. Give factor() the levels in order once, and tables and charts follow it everywhere."
      } },
    { title: "Statistics", chapter: "Describe data · mean, median, sd, quantile, summary", line: "avg <- mean(scores)",
      content: {
        story: ["Statistics is what R was built for. mean is the average and median the middle value; with a few very big values, the median often describes data better.",
          "sd measures spread (the standard deviation), and quantile cuts the data at chosen points. min, max and range give the extremes.",
          "summary(x) gives the six-number overview in one line: minimum, first quartile, median, mean, third quartile and maximum."],
        big: "mean, median, sd, quantile and summary describe a set of numbers in a line each.",
        caption: "The numbers line up, and the middle and the average appear. Tap Play.",
        demo: ["mean(scores) → 80.33", "median(scores) → 83.5", "sd(scores)", "summary(scores)"]
      },
      deep: {
        more: ["Every one of these accepts na.rm = TRUE to ignore missing values.",
          "cor(x, y) measures how strongly two columns move together, from -1 to 1."],
        ex: { code: src(["scores <- c(72, 88, 95, 60, 88, 79)", "print(mean(scores))", "print(median(scores))", "print(max(scores) - min(scores))", "print(round(sd(scores), 2))", "print(which.max(scores))", "print(summary(scores))"]),
          walk: ["Line 2: [1] 80.33333.", "Line 3: the middle of the sorted scores: [1] 83.5.", "Line 4: the range is [1] 35.", "Line 5: spread: [1] 12.79.", "Line 6: the top score is item [1] 3.", "Line 7: Min 60, 1st Qu. 73.75, Median 83.5, Mean 80.33, 3rd Qu. 88, Max 95."] },
        mistake: "Reporting a mean without looking at the data. One huge outlier drags the mean; check median and summary too."
      } },
    { title: "Sorting and Filtering", chapter: "Order · sort, order, rev, which, subset", line: "ranked <- df[order(-df$score), ]",
      content: {
        story: ["sort(x) gives the values in order; add decreasing = TRUE for highest first. rev flips any vector.",
          "order(x) gives the positions in sorted order, which is what you need to sort a whole table by one column: df[order(-df$score), ]. The minus sign means highest first.",
          "which(test) gives the positions where a test is TRUE, and subset(df, score > 100) filters a table in plain words."],
        big: "sort orders values; order sorts tables by a column; which and subset find what passes a test.",
        caption: "The rows shuffle into order by score. Tap Play.",
        demo: ["sort(scores)", "order(-df$score)", "df[order(-df$score), ]", "subset(df, score < 100)"]
      },
      deep: {
        more: ["order can take several columns: order(df$team, -df$score) sorts by team, then by score within each team.",
          "head(df, 3) after sorting gives a top three."],
        ex: { code: src(["scores <- c(Ana = 120, Leo = 95, Mia = 140, Sam = 80)", "print(sort(scores))", "print(names(scores)[order(-scores)])", "print(rev(1:5))", "print(which(scores > 100))", "df <- data.frame(name = names(scores), score = unname(scores))", "print(df[order(-df$score), ][1:2, ])", "print(subset(df, score < 100)$name)"]),
          walk: ["Line 1: a vector with names.", "Line 2: lowest first: Sam 80, Leo 95, Ana 120, Mia 140.", "Line 3: names, highest first: \"Mia\" \"Ana\" \"Leo\" \"Sam\".", "Line 4: 5 4 3 2 1.", "Line 5: positions that pass, with their names: Ana 1, Mia 3.", "Lines 6–7: the top two rows: Mia 140, then Ana 120.", "Line 8: \"Leo\" \"Sam\"."] },
        mistake: "Sorting one column on its own: df$score <- sort(df$score). The scores move but the names don't, so every row is now wrong. Sort rows with order."
      } },
    { title: "Files", chapter: "Data in and out · read.csv, write.csv, readLines, writeLines", line: 'data <- read.csv("scores.csv")',
      content: {
        story: ["Most data lives in files. read.csv(\"scores.csv\") reads a comma-separated file into a data frame, and write.csv(df, \"out.csv\", row.names = FALSE) saves one.",
          "readLines reads any text file into a vector of lines, and writeLines writes one. file.exists asks whether a file is there.",
          "Paths are relative to the working directory, the folder R is running in. getwd() tells you which folder that is."],
        big: "read.csv and write.csv move tables in and out; readLines and writeLines handle plain text.",
        caption: "The table flows out to a file and back in. Tap Play.",
        demo: ["write.csv(df, path, row.names = FALSE)", "back <- read.csv(path)", "readLines(path)", "file.exists(path)"]
      },
      deep: {
        more: ["tempfile() gives a scratch file name that won't clash with your own files — handy for experiments and tests.",
          "For Excel files, the readxl package reads .xlsx directly."],
        ex: { code: src(["path <- tempfile(fileext = \".csv\")", "df <- data.frame(name = c(\"Ana\", \"Leo\"), score = c(120, 95))", "write.csv(df, path, row.names = FALSE)", "print(readLines(path))", "back <- read.csv(path)", "print(back$score + 1)", "print(file.exists(path))", "writeLines(c(\"first line\", \"second line\"), path)", "lines <- readLines(path)", "print(length(lines))", "print(toupper(lines[2]))", "unlink(path)", "print(file.exists(path))"]),
          walk: ["Lines 1–3: save a small table as a CSV file.", "Line 4: the raw lines, quotes and all: \"name\",\"score\", then \"Ana\",120 and \"Leo\",95.", "Lines 5–6: read it back as a data frame: 121 96.", "Line 7: [1] TRUE.", "Lines 8–11: two plain lines in, [1] 2 out, then \"SECOND LINE\".", "Lines 12–13: unlink deletes the file: [1] FALSE."] },
        mistake: "Forgetting row.names = FALSE. write.csv then adds an unnamed column of row numbers, and reading the file back gives you an extra X column."
      } },
    { title: "Errors and Good Habits", chapter: "Safety · stop, tryCatch, warnings, stopifnot, set.seed", line: "safe <- tryCatch(as.numeric(\"x\"), warning = function(w) NA)",
      content: {
        story: ["stop(\"message\") raises an error and ends the current work; warning(\"message\") flags a problem but carries on. R raises them too, like the warning when text can't become a number.",
          "tryCatch(code, error = function(e) …, warning = function(w) …) catches them, so your script can handle a bad value and keep going. conditionMessage(e) gives the message.",
          "Two habits keep analysis honest: stopifnot(…) checks your assumptions, and set.seed(n) makes random numbers repeat exactly, so anyone can rerun your work and get the same answer."],
        big: "stop raises an error, tryCatch handles it, stopifnot checks assumptions, and set.seed makes randomness repeatable.",
        caption: "The bad value is caught and handled, and the script keeps going. Tap Play.",
        demo: ["stop(\"can't divide by zero\")", "tryCatch(…, error = function(e) …)", "stopifnot(x > 0)", "set.seed(42)"]
      },
      deep: {
        more: ["Read error messages from the end: the last part says what went wrong.",
          "Warnings don't stop a script, which makes them easy to miss. Treat each one as a question to answer."],
        ex: { code: src(["safe_divide <- function(a, b) {", "  if (b == 0) stop(\"can't divide by zero\")", "  a / b", "}", "result <- tryCatch(safe_divide(10, 0), error = function(e) conditionMessage(e))", "print(result)", "print(tryCatch(safe_divide(10, 4), error = function(e) NA))", "value <- tryCatch(as.integer(\"seven\"), warning = function(w) -1L)", "print(value)", "stopifnot(1 + 1 == 2)", "set.seed(42)", "x <- sample(1:6, 3)", "set.seed(42)", "y <- sample(1:6, 3)", "print(identical(x, y))"]),
          walk: ["Lines 1–4: the function refuses to divide by zero.", "Lines 5–6: the error is caught: \"can't divide by zero\".", "Line 7: no error this time: [1] 2.5.", "Lines 8–9: the warning is caught and replaced: [1] -1.", "Line 10: the check passes, so nothing happens.", "Lines 11–15: the same seed gives the same random rolls: [1] TRUE."] },
        mistake: "Catching every error and ignoring it: tryCatch(…, error = function(e) NULL). The script runs, but the problem is hidden. Handle it, or at least report it."
      } }
  ];

  var shelves = [
    { title: "Base R Field Guide", chapter: "Beyond the basics · R shelf", line: ["head(x, 3)", "?mean"],
      content: {
        story: ["Base R — what comes with every install — has hundreds of functions. A handful do most of the everyday work: head and tail, cumsum and diff, unique, rep, range, trimws.",
          "Every function has a help page: type ?mean in the console, or help(\"mean\"). The Examples section at the bottom can be run as it is.",
          "Thousands more packages live on CRAN, R's package library. install.packages(\"name\") installs one; library(name) switches it on."],
        big: "A few dozen base functions cover most work; ?name opens any function's help page.",
        caption: "A shelf of small tools, each doing one job on a whole vector. Tap Play.",
        demo: ["head(x, 3)", "cumsum(1:5)", "unique(x)", "?mean"]
      },
      deep: {
        more: ["example(mean) runs the examples from mean's help page.",
          "apropos(\"sum\") lists every function with sum in its name."],
        ex: { code: src(["x <- c(3, 1, 4, 1, 5, 9, 2, 6)", "print(head(x, 3))", "print(tail(x, 2))", "print(cumsum(1:5))", "print(diff(c(1, 4, 9, 16)))", "print(range(x))", "print(unique(x))", "print(rep(c(\"a\", \"b\"), times = 2))", "print(trimws(\"  tidy  \"))", "print(sprintf(\"item %d\", 1:3))", "print(seq_len(4))"]),
          walk: ["Lines 2–3: the first three, 3 1 4, and the last two, 2 6.", "Line 4: running totals: 1 3 6 10 15.", "Line 5: gaps between neighbours: 3 5 7.", "Line 6: smallest and largest: 1 9.", "Line 7: each value once: 3 1 4 5 9 2 6.", "Line 8: \"a\" \"b\" \"a\" \"b\".", "Line 9: \"tidy\".", "Line 10: sprintf works on vectors: \"item 1\" \"item 2\" \"item 3\".", "Line 11: 1 2 3 4."] },
        mistake: "Writing your own helper for something base R already does. Search first: ??\"moving average\" searches every help page."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · R shelf", line: ["object 'scroe' not found", "traceback()"],
      content: {
        story: ["R's errors name the problem: object 'scroe' not found means a typo in a name; could not find function means a typo or a package that isn't loaded; subscript out of bounds means you asked for an item that isn't there.",
          "NA is behind many surprises. mean(c(1, NA)) is NA, on purpose. Find missing values with is.na, and skip them with na.rm = TRUE.",
          "When an error happens deep inside functions, traceback() shows the chain of calls that led there, and str(x) or class(x) shows what a value really is."],
        big: "Read the error's last words, check names and NAs, and use str(), class() and traceback() to see what's really there.",
        caption: "A typo and a missing value, each caught and explained. Tap Play.",
        demo: ["Error: object 'scroe' not found", "mean(c(1, NA)) → NA", "mean(x, na.rm = TRUE)", "str(x)"]
      },
      deep: {
        more: ["browser() inside a function pauses it there, so you can look around and type R code mid-run.",
          "Numbers read from files sometimes arrive as text. class(x) shows \"character\"; as.numeric fixes it."],
        ex: { code: src(["score <- 10", "msg <- tryCatch(print(scroe), error = function(e) conditionMessage(e))", "print(msg)", "x <- c(1, 2, NA, 4)", "print(mean(x))", "print(mean(x, na.rm = TRUE))", "print(is.na(x))", "print(class(\"5\"))", "print(as.numeric(\"5\") + 1)", "str(list(a = 1, b = \"two\"))"]),
          walk: ["Lines 1–3: the typo is caught and its message printed: \"object 'scroe' not found\".", "Lines 4–5: one missing value makes the mean missing: [1] NA.", "Line 6: skip it: [1] 2.333333.", "Line 7: FALSE FALSE TRUE FALSE.", "Lines 8–9: \"5\" is text until it's converted: [1] 6.", "Line 10: str lists each part and its kind."] },
        mistake: "Silencing a warning instead of reading it. suppressWarnings hides the message, not the problem."
      } },
    { title: "Charts and Data Science", chapter: "Beyond the basics · R shelf", line: ["barplot(sales)", "library(ggplot2)"],
      content: {
        story: ["R draws charts in one line: plot(x, y) for points, hist(x) for a histogram, barplot(counts) for bars. In RStudio they appear in the Plots pane; in a script they're saved to a file.",
          "Most data scientists add the tidyverse: ggplot2 builds charts layer by layer, and dplyr reads like a sentence — filter, arrange, summarise. install.packages(\"tidyverse\") gets them all.",
          "The example here draws its chart with text, so it runs anywhere: the same idea as barplot, one row per day."],
        big: "plot, hist and barplot chart data in one line; ggplot2 and dplyr from the tidyverse take it further.",
        caption: "Each day's number becomes a bar of #s. Tap Play.",
        demo: ["barplot(sales)", "hist(scores)", "library(ggplot2)", "ggplot(df, aes(day, sales)) + geom_col()"]
      },
      deep: {
        more: ["prop.table(counts) turns counts into shares that add up to 1, ready for percentages.",
          "png(\"chart.png\") before a plot and dev.off() after saves it as an image file."],
        ex: { code: src(["sales <- c(Mon = 4, Tue = 7, Wed = 3, Thu = 9)", "for (day in names(sales)) {", "  cat(sprintf(\"%-4s %-9s %d\\n\", day, strrep(\"#\", sales[[day]]), sales[[day]]))", "}", "cat(sprintf(\"best day: %s\\n\", names(which.max(sales))))", "print(round(prop.table(sales), 2))"]),
          walk: ["Line 1: four days of sales, named.", "Lines 2–4: one text bar per day: Mon ####, Tue #######, Wed ###, Thu #########.", "Line 5: best day: Thu.", "Line 6: each day's share of the total: 0.17 0.30 0.13 0.39."] },
        mistake: "Making a chart before looking at the numbers. summary and table first; then the chart shows you what you already suspect, or surprises you."
      } },
    { title: "Reproducible Research", chapter: "Beyond the basics · R shelf", line: ["set.seed(2024)", "Rscript analysis.R"],
      content: {
        story: ["An analysis is only trustworthy if someone else can rerun it and get the same answer. Scripts, not clicks, make that possible: every step is written down.",
          "Random numbers are a classic trap. set.seed(2024) before sampling makes the “random” numbers the same every run, on every computer with the same R version.",
          "R Markdown and Quarto mix text, code and results in one document that rebuilds itself, so the report can never drift away from the data."],
        big: "Write every step as code, seed your random numbers, and let documents rebuild from the data.",
        caption: "Two runs with the same seed roll exactly the same dice. Tap Play.",
        demo: ["set.seed(2024)", "sample(1:6, 600, replace = TRUE)", "identical(rolls, again) → TRUE", "quarto render report.qmd"]
      },
      deep: {
        more: ["sessionInfo() prints the R version and every package loaded, so you can record exactly what produced a result.",
          "Keep raw data read-only. Clean it with code into a new file, so the original is always there to check."],
        ex: { code: src(["set.seed(2024)", "rolls <- sample(1:6, 600, replace = TRUE)", "print(length(rolls))", "print(all(rolls %in% 1:6))", "set.seed(2024)", "again <- sample(1:6, 600, replace = TRUE)", "print(identical(rolls, again))", "print(length(unique(rolls)))"]),
          walk: ["Lines 1–2: 600 dice rolls from a fixed seed.", "Lines 3–4: [1] 600, and every roll is 1 to 6: [1] TRUE.", "Lines 5–7: the same seed gives the very same 600 rolls: [1] TRUE.", "Line 8: all six faces turned up: [1] 6."] },
        mistake: "Editing the data file by hand to fix a typo. Nobody can see or repeat that change. Fix it in the script."
      } },
    { title: "Testing R Code", chapter: "Beyond the basics · R shelf", line: ["stopifnot(grade(95) == \"A\")", "testthat::test_dir(\"tests\")"],
      content: {
        story: ["A test runs your code with a known input and checks the answer. In R, stopifnot is the simplest test: it stops with an error if anything is FALSE.",
          "Test the edges: the exact boundary values, empty input, NA, and values that should be refused.",
          "For packages and bigger projects, testthat is the standard: expect_equal(grade(95), \"A\") inside test_that(\"grades work\", { … })."],
        big: "Run the code with known inputs, compare with the expected answers, and make bad input fail loudly.",
        caption: "Each case is checked against the expected grade. Tap Play.",
        demo: ["stopifnot(grade(95) == \"A\")", "cases <- data.frame(score, want)", "4 checks, 0 failures", "testthat::test_dir(\"tests\")"]
      },
      deep: {
        more: ["A data frame of cases — inputs in one column, expected answers in another — keeps tests easy to read and extend.",
          "Test that bad input is refused too: wrap it in tryCatch and check that an error came out."],
        ex: { code: src(["grade <- function(score) {", "  stopifnot(is.numeric(score), score >= 0, score <= 100)", "  if (score >= 90) \"A\" else if (score >= 80) \"B\" else \"C\"", "}", "", "cases <- data.frame(score = c(95, 90, 89, 40), want = c(\"A\", \"A\", \"B\", \"C\"))", "failures <- 0", "for (i in seq_len(nrow(cases))) {", "  got <- grade(cases$score[i])", "  if (got != cases$want[i]) {", "    failures <- failures + 1", "    cat(sprintf(\"grade(%d) gave %s, want %s\\n\", cases$score[i], got, cases$want[i]))", "  }", "}", "refused <- tryCatch({ grade(101); FALSE }, error = function(e) TRUE)", "stopifnot(refused)", "cat(sprintf(\"%d checks, %d failures\\n\", nrow(cases) + 1, failures))"]),
          walk: ["Lines 1–4: the code under test; stopifnot refuses bad scores.", "Line 6: cases with their expected answers, including the edges 90 and 89.", "Lines 8–14: each case is checked and any mismatch reported.", "Lines 15–16: 101 must be refused.", "Line 17: 5 checks, 0 failures."] },
        mistake: "Only testing the middle of the range. Bugs live at the boundaries: test 89 and 90, 0 and 100."
      } }
  ];

  var glossary = [
    ["<-", "Assignment: puts a value into a name."],
    ["%%", "The remainder after division."],
    ["%/%", "Whole-number division: how many times it fits."],
    ["%in%", "Asks whether each value is one of a set."],
    ["$", "Reaches into a list or data frame by name."],
    ["[[ ]]", "Picks one item out of a list."],
    ["[ ]", "Picks items from a vector or rows and columns from a table."],
    ["apply family", "sapply, lapply, vapply and friends: run a function over many items."],
    ["argument", "A value passed into a function."],
    ["CRAN", "R's library of thousands of free packages."],
    ["cat", "Prints plain text, with no [1] and no quotes."],
    ["character", "R's name for text values."],
    ["class", "What kind of value something is."],
    ["console", "Where you type R code and see answers at once."],
    ["CSV", "Comma-separated values: a plain-text table."],
    ["data frame", "A table whose columns are vectors."],
    ["default argument", "A value a function uses when you don't give one."],
    ["dplyr", "A tidyverse package for filtering and summarising tables."],
    ["factor", "A vector of categories with a fixed list of levels."],
    ["FALSE", "The logical value for no."],
    ["function", "A named, reusable piece of code."],
    ["ggplot2", "The tidyverse package for building charts in layers."],
    ["ifelse", "A yes/no choice made for every item of a vector."],
    ["index", "An item's position; R counts from 1."],
    ["integer", "A whole number, written with an L: 5L."],
    ["lapply", "Runs a function over every item and returns a list."],
    ["level", "One of the possible categories of a factor."],
    ["list", "A container that holds values of any kinds, by name."],
    ["logical", "TRUE, FALSE or NA."],
    ["mean", "The average."],
    ["median", "The middle value when the data is sorted."],
    ["NA", "A missing value."],
    ["na.rm", "An argument that tells a function to skip missing values."],
    ["NULL", "Nothing at all; setting a list item to NULL removes it."],
    ["numeric", "R's name for numbers with or without decimals."],
    ["order", "Gives the positions that would sort a vector."],
    ["package", "A bundle of extra functions, installed from CRAN."],
    ["paste", "Joins text with spaces; paste0 joins with nothing."],
    ["print", "Shows a value the way R sees it."],
    ["Quarto", "A tool that turns text and R code into reports."],
    ["R Markdown", "Documents that mix text, code and its results."],
    ["read.csv", "Reads a CSV file into a data frame."],
    ["recycling", "Reusing a shorter vector to match a longer one in math."],
    ["Rscript", "Runs an R script from the command line."],
    ["RStudio", "A popular editor for R."],
    ["sapply", "Runs a function over every item and simplifies to a vector."],
    ["scalar", "A single value — in R, a vector of length one."],
    ["sd", "The standard deviation: how spread out values are."],
    ["seed", "The starting point that makes random numbers repeatable."],
    ["seq", "Makes a sequence of numbers."],
    ["sprintf", "Builds text from a pattern with %s, %d and %.2f."],
    ["stop", "Raises an error."],
    ["stopifnot", "Stops with an error if a check is FALSE."],
    ["str", "Shows the structure of any value."],
    ["summary", "Describes data in one line: min, quartiles, mean, max."],
    ["switch", "Picks a value by name."],
    ["table", "Counts how often each value appears."],
    ["tidyverse", "A family of packages for data science."],
    ["TRUE", "The logical value for yes."],
    ["tryCatch", "Runs code and handles errors or warnings."],
    ["vapply", "Like sapply, but checks every answer's shape."],
    ["vector", "R's basic row of values of one kind."],
    ["vectorization", "Doing math on a whole vector at once, without a loop."],
    ["warning", "A message about a problem that doesn't stop the code."],
    ["working directory", "The folder R reads and writes files in."]
  ];

  var field = [
    { name: "print / cat", head: "base", what: "Show a value, or write plain text.", ex: "cat(\"Hi\\n\")" },
    { name: "c / seq / rep", head: "base", what: "Build vectors.", ex: "seq(0, 100, by = 10)" },
    { name: "length / sum / mean", head: "base", what: "Size and totals of a vector.", ex: "mean(scores)" },
    { name: "paste / sprintf", head: "base", what: "Join and format text.", ex: "sprintf(\"%.2f\", x)" },
    { name: "nchar / substr / gsub", head: "base", what: "Measure, cut and replace text.", ex: "gsub(\"a\", \"A\", s)" },
    { name: "if / ifelse / switch", head: "base", what: "Decide once, or for every item.", ex: "ifelse(x > 0, \"+\", \"-\")" },
    { name: "for / while", head: "base", what: "Repeat code.", ex: "for (i in seq_along(x)) …" },
    { name: "function", head: "base", what: "Make reusable code.", ex: "f <- function(x = 1) x * 2" },
    { name: "list / $ / [[ ]]", head: "base", what: "Bundle values by name.", ex: "player$hp" },
    { name: "data.frame", head: "base", what: "Tables of column vectors.", ex: "df[df$score > 100, ]" },
    { name: "sapply / lapply / Map", head: "base", what: "Run a function over many items.", ex: "sapply(x, sqrt)" },
    { name: "table / factor", head: "base", what: "Count and order categories.", ex: "table(colors)" },
    { name: "mean / median / sd / summary", head: "stats", what: "Describe numbers.", ex: "summary(x)" },
    { name: "sort / order / which", head: "base", what: "Order and locate values.", ex: "df[order(-df$score), ]" },
    { name: "read.csv / write.csv", head: "utils", what: "Tables in and out of files.", ex: "read.csv(\"data.csv\")" }
  ];

  var cheats = [
    { title: "Script Card", body: "An R script runs top to bottom.", code: src(["# main.R — run with: Rscript main.R", "name <- \"Ana\"", "cat(\"Hi, \", name, \"!\\n\", sep = \"\")", "print(2 + 3)"]) },
    { title: "Values Card", body: "Everyday values.", code: src(["n <- 42", "x <- 3.14", "name <- \"Ana\"", "ok <- TRUE", "nothing <- NA", "whole <- 5L", "class(x)", "as.numeric(\"7\")"]) },
    { title: "Vectors Card", body: "R's basic building block.", code: src(["v <- c(10, 20, 30)", "v[1]", "v[v > 15]", "v * 2", "length(v)", "sum(v)", "mean(v)", "1:10", "seq(0, 100, by = 25)"]) },
    { title: "Decisions Card", body: "if, else and friends.", code: src(["if (x > 0) {", "  cat(\"positive\\n\")", "} else if (x == 0) {", "  cat(\"zero\\n\")", "} else {", "  cat(\"negative\\n\")", "}", "ifelse(v > 15, \"big\", \"small\")", "\"b\" %in% c(\"a\", \"b\")"]) },
    { title: "Loops & Functions Card", body: "Repeat and reuse.", code: src(["for (i in 1:3) print(i)", "while (n > 0) n <- n - 1", "f <- function(x, by = 2) x * by", "f(5)", "sapply(1:5, function(x) x^2)"]) },
    { title: "Lists & Tables Card", body: "Bundles and data frames.", code: src(["p <- list(name = \"Ana\", hp = 100)", "p$hp", "df <- data.frame(name = c(\"Ana\", \"Leo\"), score = c(120, 95))", "df$score", "df[df$score > 100, ]", "df[order(-df$score), ]", "nrow(df)"]) },
    { title: "Statistics Card", body: "Describe data.", code: src(["mean(x)", "median(x)", "sd(x)", "summary(x)", "table(colors)", "mean(x, na.rm = TRUE)"]) },
    { title: "Files & Errors Card", body: "Read, write, recover.", code: src(["df <- read.csv(\"data.csv\")", "write.csv(df, \"out.csv\", row.names = FALSE)", "lines <- readLines(\"notes.txt\")", "tryCatch(stop(\"oops\"), error = function(e) conditionMessage(e))", "stopifnot(nrow(df) > 0)", "set.seed(42)"]) }
  ];

  function stars(n) { return new Array(n + 1).join("*"); }
  function padR(s, w) { s = String(s); while (s.length < w) s += " "; return s; }
  function padL(s, w) { s = String(s); while (s.length < w) s = " " + s; return s; }
  function pad0(n, w) { var s = String(n); while (s.length < w) s = "0" + s; return s; }

  var projects = [
    { name: "Rocket Countdown", about: "A for loop over start:1 counts down to blast off.",
      vars: [{ key: "start", val: 5, min: 1, max: 12 }],
      code: function (v) { return ["start <- " + v.start, "for (i in start:1) {", "  cat(i, \"...\\n\", sep = \"\")", "}", "cat(\"Blast off!\\n\")"]; },
      run: function (v) { var o = []; for (var i = v.start; i > 0; i--) o.push(i + "..."); o.push("Blast off!"); return o; },
      explain: "start:1 counts down because the first number is bigger. sep = \"\" stops cat putting a space before the dots." },
    { name: "Star Steps", about: "strrep repeats the star one more time on every row.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return ["rows <- " + v.rows, "for (r in 1:rows) {", "  cat(strrep(\"*\", r), \"\\n\", sep = \"\")", "}"]; },
      run: function (v) { var o = []; for (var r = 1; r <= v.rows; r++) o.push(stars(r)); return o; },
      explain: "strrep(\"*\", r) repeats the star r times, so each row is one star longer than the last." },
    { name: "Coin Bank", about: "Every coin adds to the running total.",
      vars: [{ key: "coins", val: 5, min: 1, max: 10 }, { key: "each", val: 25, min: 1, max: 50 }],
      code: function (v) { return ["coins <- " + v.coins, "each <- " + v.each, "total <- 0", "for (i in 1:coins) {", "  total <- total + each", "  cat(\"coin \", i, \": total \", total, \"\\n\", sep = \"\")", "}", "cat(\"Saved\", total, \"cents\\n\")"]; },
      run: function (v) { var o = [], t = 0; for (var i = 1; i <= v.coins; i++) { t += v.each; o.push("coin " + i + ": total " + t); } o.push("Saved " + t + " cents"); return o; },
      explain: "total <- total + each adds one coin per lap. The last cat lets R put its usual spaces between the words." },
    { name: "Times Table", about: "sprintf fills in each line of the table.",
      vars: [{ key: "n", val: 7, min: 1, max: 12 }, { key: "upto", val: 5, min: 1, max: 12 }],
      code: function (v) { return ["n <- " + v.n, "upto <- " + v.upto, "for (i in 1:upto) {", "  cat(sprintf(\"%d x %d = %d\\n\", n, i, n * i))", "}"]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(v.n + " x " + i + " = " + v.n * i); return o; },
      explain: "%d marks each whole number, and sprintf fills them in order: n, then i, then n * i." },
    { name: "FizzBuzz", about: "The classic: Fizz for threes, Buzz for fives, FizzBuzz for both.",
      vars: [{ key: "limit", val: 15, min: 1, max: 30 }],
      code: function (v) { return ["limit <- " + v.limit, "for (i in 1:limit) {", "  if (i %% 15 == 0) {", "    cat(\"FizzBuzz\\n\")", "  } else if (i %% 3 == 0) {", "    cat(\"Fizz\\n\")", "  } else if (i %% 5 == 0) {", "    cat(\"Buzz\\n\")", "  } else {", "    cat(i, \"\\n\", sep = \"\")", "  }", "}"]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.limit; i++) o.push(i % 15 === 0 ? "FizzBuzz" : i % 3 === 0 ? "Fizz" : i % 5 === 0 ? "Buzz" : String(i)); return o; },
      explain: "%% gives the remainder, so i %% 3 == 0 means “divides by 3.” The 15 test goes first, or Fizz would win." },
    { name: "Grade Report", about: "A vector of cut-offs picks the grade; switch picks the message.",
      vars: [{ key: "score", val: 85, min: 0, max: 100 }],
      code: function (v) { return ["score <- " + v.score, "cutoffs <- c(A = 90, B = 80, C = 70, D = 60)", "passed <- names(cutoffs)[score >= cutoffs]", "grade <- if (length(passed) > 0) passed[1] else \"F\"", "cat(sprintf(\"Score: %d\\n\", score))", "cat(sprintf(\"Grade: %s\\n\", grade))", "note <- switch(grade, A = , B = \"Great work!\", C = , D = \"Keep practicing.\", \"Let's review together.\")", "cat(note, \"\\n\", sep = \"\")"]; },
      run: function (v) { var s = v.score, g = s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : s >= 60 ? "D" : "F"; return ["Score: " + s, "Grade: " + g, g === "A" || g === "B" ? "Great work!" : g === "C" || g === "D" ? "Keep practicing." : "Let's review together."]; },
      explain: "score >= cutoffs tests every cut-off at once; the first name that passes is the grade. In switch, A = , falls through to B's answer." },
    { name: "Vector Stats", about: "One seq() makes the numbers; sum, mean and max describe them.",
      vars: [{ key: "n", val: 6, min: 2, max: 12 }, { key: "step", val: 3, min: 1, max: 9 }],
      code: function (v) { return ["n <- " + v.n, "step <- " + v.step, "values <- seq(step, by = step, length.out = n)", "cat(\"Values: \", paste(values, collapse = \" \"), \"\\n\", sep = \"\")", "cat(\"Sum: \", sum(values), \"\\n\", sep = \"\")", "cat(\"Mean: \", mean(values), \"\\n\", sep = \"\")", "cat(\"Largest: \", max(values), \"\\n\", sep = \"\")"]; },
      run: function (v) { var vals = []; for (var i = 1; i <= v.n; i++) vals.push(v.step * i); var sum = vals.reduce(function (a, b) { return a + b; }, 0); return ["Values: " + vals.join(" "), "Sum: " + sum, "Mean: " + (sum / v.n), "Largest: " + vals[vals.length - 1]]; },
      explain: "seq counts by step, n times. sum, mean and max each answer for the whole vector — no loop anywhere." },
    { name: "Shopping Cart", about: "Named vectors hold prices and counts; one multiplication makes every cost.",
      vars: [{ key: "apples", val: 3, min: 0, max: 9 }, { key: "pears", val: 2, min: 0, max: 9 }],
      code: function (v) { return ["apples <- " + v.apples, "pears <- " + v.pears, "price <- c(apple = 50, pear = 75)", "count <- c(apple = apples, pear = pears)", "cost <- price * count", "for (item in names(cost)) {", "  cat(sprintf(\"%-6s %d x %d cents = %d\\n\", item, count[[item]], price[[item]], cost[[item]]))", "}", "cat(sprintf(\"Total: $%.2f\\n\", sum(cost) / 100))"]; },
      run: function (v) { var a = v.apples * 50, p = v.pears * 75; return [padR("apple", 6) + " " + v.apples + " x 50 cents = " + a, padR("pear", 6) + " " + v.pears + " x 75 cents = " + p, "Total: $" + ((a + p) / 100).toFixed(2)]; },
      explain: "price * count multiplies item by item, keeping the names. Prices are cents, so the math stays exact; %.2f shows dollars." },
    { name: "Collatz Trail", about: "Halve even numbers, triple-and-add-one odd ones, until you reach 1.",
      vars: [{ key: "n", val: 6, min: 2, max: 25 }],
      code: function (v) { return ["n <- " + v.n, "trail <- n", "while (n != 1) {", "  n <- if (n %% 2 == 0) n / 2 else 3 * n + 1", "  trail <- c(trail, n)", "}", "cat(paste(trail, collapse = \" \"), \"\\n\", sep = \"\")", "cat(length(trail) - 1, \"steps to reach 1\\n\")"]; },
      run: function (v) { var n = v.n, trail = [n]; while (n !== 1) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; trail.push(n); } return [trail.join(" "), (trail.length - 1) + " steps to reach 1"]; },
      explain: "In R, if … else is itself a value, so one line picks the next number. c(trail, n) grows the trail." },
    { name: "Prime Finder", about: "Each number is tested against the primes already found, all at once.",
      vars: [{ key: "limit", val: 30, min: 2, max: 60 }],
      code: function (v) { return ["limit <- " + v.limit, "primes <- c()", "for (n in 2:limit) {", "  if (all(n %% primes[primes <= sqrt(n)] != 0)) primes <- c(primes, n)", "}", "cat(paste(primes, collapse = \" \"), \"\\n\", sep = \"\")", "cat(length(primes), \" primes up to \", limit, \"\\n\", sep = \"\")"]; },
      run: function (v) { var ps = []; for (var n = 2; n <= v.limit; n++) { var ok = true; for (var j = 0; j < ps.length; j++) { if (ps[j] * ps[j] > n) break; if (n % ps[j] === 0) { ok = false; break; } } if (ok) ps.push(n); } return [ps.join(" "), ps.length + " primes up to " + v.limit]; },
      explain: "n %% primes[...] divides n by every small prime at once; all(... != 0) is TRUE when none divides it. For 2, there's nothing to test, and all() of nothing is TRUE." },
    { name: "Number Guess", about: "The computer guesses the middle of what's left, every time.",
      vars: [{ key: "secret", val: 37, min: 1, max: 100 }],
      code: function (v) { return ["secret <- " + v.secret, "low <- 1", "high <- 100", "tries <- 0", "repeat {", "  guess <- (low + high) %/% 2", "  tries <- tries + 1", "  if (guess == secret) {", "    cat(guess, \" is right! Found in \", tries, \" tries.\\n\", sep = \"\")", "    break", "  } else if (guess < secret) {", "    cat(guess, \"is too low\\n\")", "    low <- guess + 1", "  } else {", "    cat(guess, \"is too high\\n\")", "    high <- guess - 1", "  }", "}"]; },
      run: function (v) {
        var o = [], low = 1, high = 100, tries = 0;
        while (true) {
          var g = Math.floor((low + high) / 2); tries++;
          if (g === v.secret) { o.push(g + " is right! Found in " + tries + " tries."); break; }
          else if (g < v.secret) { o.push(g + " is too low"); low = g + 1; }
          else { o.push(g + " is too high"); high = g - 1; }
        }
        return o;
      },
      explain: "repeat loops until break. %/% keeps the middle a whole number, and every wrong guess throws away half of what's left." },
    { name: "Temperature Table", about: "One vector of Celsius becomes a vector of Fahrenheit in a single line.",
      vars: [{ key: "start", val: 0, min: -20, max: 40 }],
      code: function (v) { return ["start <- " + v.start, "celsius <- seq(start, start + 40, by = 10)", "fahrenheit <- celsius * 9 / 5 + 32", "for (i in seq_along(celsius)) {", "  cat(sprintf(\"%4d C = %5.1f F\\n\", celsius[i], fahrenheit[i]))", "}"]; },
      run: function (v) { var o = []; for (var c = v.start; c <= v.start + 40; c += 10) o.push(padL(c, 4) + " C = " + padL((c * 9 / 5 + 32).toFixed(1), 5) + " F"); return o; },
      explain: "celsius * 9 / 5 + 32 converts all five temperatures at once. %5.1f keeps one decimal and lines the column up." },
    { name: "Team Table", about: "A data frame filtered by a cut-off and sorted by score.",
      vars: [{ key: "cutoff", val: 100, min: 50, max: 150 }],
      code: function (v) { return ["cutoff <- " + v.cutoff, "team <- data.frame(", "  name = c(\"Ana\", \"Leo\", \"Mia\", \"Sam\", \"Zoe\"),", "  score = c(120, 95, 140, 80, 105)", ")", "winners <- team[team$score >= cutoff, ]", "winners <- winners[order(-winners$score), ]", "cat(sprintf(\"%d players scored at least %d\\n\", nrow(winners), cutoff))", "for (i in seq_len(nrow(winners))) {", "  cat(sprintf(\"%d. %s (%d)\\n\", i, winners$name[i], winners$score[i]))", "}"]; },
      run: function (v) {
        var t = [["Ana", 120], ["Leo", 95], ["Mia", 140], ["Sam", 80], ["Zoe", 105]].filter(function (r) { return r[1] >= v.cutoff; }).sort(function (a, b) { return b[1] - a[1]; });
        var o = [t.length + " players scored at least " + v.cutoff];
        t.forEach(function (r, i) { o.push((i + 1) + ". " + r[0] + " (" + r[1] + ")"); });
        return o;
      },
      explain: "team[team$score >= cutoff, ] keeps the rows that pass, and order(-score) puts the best first. seq_len(0) makes the loop safe when nobody qualifies." },
    { name: "Word Tally", about: "table counts the words; order sorts by count, then alphabetically.",
      vars: [{ key: "copies", val: 2, min: 1, max: 5 }],
      code: function (v) { return ["copies <- " + v.copies, "text <- rep(\"the cat sat on the mat\", copies)", "words <- unlist(strsplit(text, \" \"))", "counts <- table(words)", "top <- counts[order(-counts, names(counts))]", "cat(sprintf(\"%s: %d\\n\", names(top), top), sep = \"\")", "cat(sprintf(\"%d words in all\\n\", length(words)))"]; },
      run: function (v) { var c = v.copies; return ["the: " + 2 * c, "cat: " + c, "mat: " + c, "on: " + c, "sat: " + c, (6 * c) + " words in all"]; },
      explain: "strsplit breaks the text at spaces, table counts each word, and order sorts by count (biggest first), then by name for ties." },
    { name: "Bank Account", about: "stop refuses a withdrawal; tryCatch handles it and ends the loop.",
      vars: [{ key: "balance", val: 100, min: 10, max: 200 }, { key: "amount", val: 30, min: 5, max: 100 }],
      code: function (v) { return ["balance <- " + v.balance, "amount <- " + v.amount, "withdraw <- function(balance, amount) {", "  if (amount > balance) stop(\"only \", balance, \" left\")", "  balance - amount", "}", "for (k in 1:5) {", "  result <- tryCatch(withdraw(balance, amount), error = function(e) {", "    cat(\"Refused \", amount, \": \", conditionMessage(e), \"\\n\", sep = \"\")", "    NULL", "  })", "  if (is.null(result)) break", "  balance <- result", "  cat(\"Took \", amount, \", balance \", balance, \"\\n\", sep = \"\")", "}", "cat(sprintf(\"Final balance: %d\\n\", balance))"]; },
      run: function (v) { var o = [], b = v.balance; for (var k = 0; k < 5; k++) { if (v.amount > b) { o.push("Refused " + v.amount + ": only " + b + " left"); break; } b -= v.amount; o.push("Took " + v.amount + ", balance " + b); } o.push("Final balance: " + b); return o; },
      explain: "stop raises an error with a message; tryCatch catches it, prints it, and returns NULL, which tells the loop to break." },
    { name: "Clock Formatter", about: "%/% and %% split seconds into hours, minutes and seconds.",
      vars: [{ key: "seconds", val: 3725, min: 0, max: 9999 }],
      code: function (v) { return ["seconds <- " + v.seconds, "hours <- seconds %/% 3600", "minutes <- (seconds %% 3600) %/% 60", "secs <- seconds %% 60", "cat(sprintf(\"%d seconds is %02d:%02d:%02d\\n\", seconds, hours, minutes, secs))", "cat(sprintf(\"%dh %dm %ds\\n\", hours, minutes, secs))"]; },
      run: function (v) { var h = Math.floor(v.seconds / 3600), m = Math.floor(v.seconds % 3600 / 60), s = v.seconds % 60; return [v.seconds + " seconds is " + pad0(h, 2) + ":" + pad0(m, 2) + ":" + pad0(s, 2), h + "h " + m + "m " + s + "s"]; },
      explain: "%/% 3600 counts whole hours, the remainder %/% 60 gives minutes, and %% 60 the seconds. %02d pads to two digits." },
    { name: "Moving Average", about: "Each day's average over a sliding window smooths the bumps.",
      vars: [{ key: "window", val: 3, min: 2, max: 5 }],
      code: function (v) { return ["window <- " + v.window, "temps <- c(12, 15, 11, 18, 21, 19, 24, 22)", "for (i in window:length(temps)) {", "  avg <- mean(temps[(i - window + 1):i])", "  cat(sprintf(\"day %d: %.2f\\n\", i, avg))", "}"]; },
      run: function (v) { var t = [12, 15, 11, 18, 21, 19, 24, 22], o = []; for (var i = v.window; i <= t.length; i++) { var s = 0; for (var k = i - v.window; k < i; k++) s += t[k]; o.push("day " + i + ": " + (s / v.window).toFixed(2)); } return o; },
      explain: "temps[(i - window + 1):i] picks the last few days; mean averages them. A bigger window gives a smoother line." },
    { name: "Leap Year Finder", about: "One vector test finds every leap year in twelve years.",
      vars: [{ key: "start", val: 1996, min: 1890, max: 2100 }],
      code: function (v) { return ["start <- " + v.start, "years <- start:(start + 11)", "leap <- years[(years %% 4 == 0 & years %% 100 != 0) | years %% 400 == 0]", "for (y in leap) cat(y, \"is a leap year\\n\")", "cat(sprintf(\"Checked %d to %d\\n\", start, start + 11))"]; },
      run: function (v) { var o = []; for (var y = v.start; y < v.start + 12; y++) if (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) o.push(y + " is a leap year"); o.push("Checked " + v.start + " to " + (v.start + 11)); return o; },
      explain: "Every 4th year is a leap year, except whole centuries — unless they divide by 400. The single & and | test all twelve years at once." }
  ];

  var vt = [
    { line: 'print("{w}")', why: "print shows a value." },
    { line: 'cat("{w}\\n")', why: "cat writes plain text." },
    { line: 'cat("{w}:", {v}, "\\n")', why: "cat puts spaces between pieces." },
    { line: "{v} <- {n}", why: "The arrow stores a value." },
    { line: '{sv} <- "{w}"', why: "Text goes in quotes." },
    { line: "{v} <- {v} + {d}", why: "A box gets its old value plus more." },
    { line: "{v} <- {u} %% {d}", why: "%% gives the remainder." },
    { line: "{v} <- {u} %/% {d}", why: "%/% counts whole times." },
    { line: "{v} <- round({dec}, 1)", why: "round keeps some decimals." },
    { line: "{v} <- sqrt({n})", why: "sqrt is the square root." },
    { line: "{arr} <- c({n}, {n2}, {n3})", why: "c() makes a vector." },
    { line: "{arr} <- 1:{n}", why: "1:n counts up." },
    { line: "{arr} <- seq(0, {n}, by = {d})", why: "seq counts in steps." },
    { line: "{v} <- {arr}[{d}]", why: "R counts from 1." },
    { line: "{arr} <- {arr} * {d}", why: "Math works on every item." },
    { line: "{arr} <- c({arr}, {n})", why: "c() adds to the end." },
    { line: "{v} <- length({arr})", why: "length counts items." },
    { line: "{v} <- sum({arr})", why: "sum adds them all." },
    { line: "{v} <- mean({arr})", why: "mean is the average." },
    { line: "{arr} <- {arr}[{arr} > {n}]", why: "A test inside [ ] filters." },
    { line: '{sv} <- paste("{w}", {sv})', why: "paste joins with a space." },
    { line: '{sv} <- paste0("{w}", {n})', why: "paste0 joins with nothing." },
    { line: '{sv} <- sprintf("%s has %d", "{w}", {n})', why: "sprintf fills a pattern." },
    { line: "{v} <- nchar({sv})", why: "nchar counts characters." },
    { line: "{sv} <- toupper({sv})", why: "toupper makes capitals." },
    { line: "{sv} <- substr({sv}, 1, {d})", why: "substr cuts a piece out." },
    { line: '{sv} <- gsub("{L}", "{w}", {sv})', why: "gsub replaces every match." },
    { line: 'if ({v} > {n}) print("{w}")', why: "if runs code when TRUE." },
    { line: "if ({v} == {n}) {u} <- 0", why: "== compares values." },
    { line: "} else if ({v} < {d}) {", why: "else if tries another test." },
    { line: '{sv} <- ifelse({v} > {n}, "{w}", "none")', why: "ifelse decides for each item." },
    { line: 'if ({sv} %in% c("{w}", "{L}")) print({sv})', why: "%in% checks membership." },
    { line: "for (i in 1:{n}) {v} <- {v} + i", why: "for counts through a range." },
    { line: "for (x in {arr}) print(x)", why: "for takes each item." },
    { line: "while ({v} > 0) {v} <- {v} - {d}", why: "while repeats while TRUE." },
    { line: "for (i in seq_along({arr})) {arr}[i] <- {arr}[i] + 1", why: "seq_along is safe when empty." },
    { line: "{f} <- function(x) x * {d}", why: "A one-line function." },
    { line: "{f} <- function({v}, by = {d}) {v} + by", why: "by has a default." },
    { line: "{v} <- {f}({n})", why: "Call a function." },
    { line: "{f} <- function() {", why: "A function's body starts here." },
    { line: "return({v} * {d})", why: "return leaves with an answer." },
    { line: '{m} <- list({v} = {n}, {sv} = "{w}")', why: "list bundles by name." },
    { line: "{m}${v} <- {n}", why: "$ sets an item by name." },
    { line: '{v} <- {m}[["{v}"]]', why: "[[ ]] reads one item." },
    { line: "{m}${v} <- NULL", why: "NULL removes an item." },
    { line: 'df <- data.frame({sv} = c("{w}", "{L}"), {v} = c({n}, {n2}))', why: "A data frame is a table." },
    { line: "df${v} <- df${v} * {d}", why: "Change a whole column." },
    { line: "top <- df[df${v} > {n}, ]", why: "Rows go before the comma." },
    { line: "df <- df[order(-df${v}), ]", why: "order sorts the rows." },
    { line: "{v} <- nrow(df)", why: "nrow counts rows." },
    { line: "{arr} <- sapply({arr}, function(x) x + {d})", why: "sapply maps over items." },
    { line: "{arr} <- vapply({arr}, function(x) x * {d}, numeric(1))", why: "vapply checks each answer." },
    { line: "counts <- table({arr})", why: "table counts values." },
    { line: "{v} <- max({arr}) - min({arr})", why: "The range of the values." },
    { line: "{v} <- median({arr})", why: "median is the middle value." },
    { line: "{v} <- round(sd({arr}), {d})", why: "sd measures spread." },
    { line: "{arr} <- sort({arr}, decreasing = TRUE)", why: "sort orders values." },
    { line: "{v} <- which.max({arr})", why: "which.max finds the top spot." },
    { line: 'write.csv(df, "{sv}.csv", row.names = FALSE)', why: "write.csv saves a table." },
    { line: 'df <- read.csv("{sv}.csv")', why: "read.csv loads a table." },
    { line: 'writeLines("{w}", "{sv}.txt")', why: "writeLines writes text." },
    { line: 'if ({v} < 0) stop("{w} must be positive")', why: "stop raises an error." },
    { line: "{v} <- tryCatch(as.numeric({sv}), warning = function(w) NA)", why: "tryCatch handles warnings." },
    { line: "stopifnot({v} >= {d})", why: "stopifnot checks assumptions." },
    { line: "set.seed({n})", why: "A seed makes randomness repeat." }
  ];
  var themes = [
    { name: "Printing", t: [0, 1, 2, 3, 4] },
    { name: "Variables", t: [3, 4, 5, 9, 8] },
    { name: "Math", t: [5, 6, 7, 8, 9] },
    { name: "Vectors", t: [10, 11, 12, 13, 16] },
    { name: "Vector Math", t: [14, 15, 17, 18, 19] },
    { name: "Text", t: [20, 21, 22, 23, 24] },
    { name: "Text Tools", t: [25, 26, 21, 24, 23] },
    { name: "Decisions", t: [27, 28, 29, 30, 31] },
    { name: "Loops", t: [32, 33, 34, 35, 5] },
    { name: "Functions", t: [36, 37, 38, 39, 40] },
    { name: "Lists", t: [41, 42, 43, 44, 3] },
    { name: "Data Frames", t: [45, 46, 47, 48, 49] },
    { name: "Apply", t: [50, 51, 36, 38, 17] },
    { name: "Counting", t: [52, 53, 54, 57, 16] },
    { name: "Statistics", t: [18, 54, 55, 53, 17] },
    { name: "Sorting", t: [56, 57, 48, 19, 13] },
    { name: "Files", t: [58, 59, 60, 4, 21] },
    { name: "Errors", t: [61, 62, 63, 64, 27] },
    { name: "Mixed Practice", t: [10, 22, 30, 41, 47] },
    { name: "R Masters", t: [37, 46, 50, 56, 62] }
  ];
  var FUNCS = ["play", "heal", "jump", "draw", "sing", "build", "spin", "dash", "grow", "shine", "mix", "lift", "launch", "glide", "turn", "push", "pull", "wave", "zap", "mend", "craft", "boost", "cheer", "greet", "explore", "charge"];
  function pick(bank, r) { return bank[Math.floor(r() * bank.length)]; }

  return {
    blocks: blocks, chapters: chapters, shelves: shelves, glossary: glossary, field: field, cheats: cheats,
    projects: projects, vt: vt, themes: themes,
    fill: function (k, r) {
      if (k === "f") return pick(FUNCS, r);
      return null;
    },
    sandboxNote: "Thirty everyday R lines, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your R progress is saved separately from every other track.",
    sourcesHTML: 'R facts and syntax follow <a href="https://cran.r-project.org/doc/manuals/r-release/R-intro.html">An Introduction to R</a>, the <a href="https://cran.r-project.org/doc/manuals/r-release/R-lang.html">R Language Definition</a> and R\u2019s own help pages. Everything here is base R. Every explanation is written in Code Block\u2019s own words, and every practice program is run by real R before it ships.'
  };
});
