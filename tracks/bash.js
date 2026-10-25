"use strict";
/* ================= BASH — a Code Block track =================
   Written fresh for Code Block in plain words. Facts and syntax follow
   the GNU Bash Reference Manual (gnu.org/software/bash/manual) and the
   ShellCheck wiki. Every PC project and library example is run by real
   Bash in tests/content and must pass ShellCheck with every check on;
   a project's output must match the app. Every drill and Vault line is
   parsed (not run) by bash -n and read by ShellCheck. */
cbRegisterTrack("bash", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Echo Block", short: "echo", chapter: "Bash Ch. 1 · First Steps", icon: "i-say", verb: "say",
      line: 'echo "Hello, world!"',
      explain: "echo prints its words and moves to a new line. Every line of a Bash script is a command, run from top to bottom." },
    { name: "Shebang Block", short: "#!", chapter: "Bash Ch. 1 · First Steps", icon: "i-flag", verb: "start",
      line: "#!/usr/bin/env bash",
      explain: "The first line of a script says which program should run it. #!/usr/bin/env bash means “find Bash and use it.”" },
    { name: "Variable Block", short: "name=", chapter: "Bash Ch. 2 · Variables", icon: "i-tag", verb: "store",
      line: 'name="Ana"',
      explain: "name=\"Ana\" puts text in a variable. No spaces around the = — with spaces, Bash thinks name is a command." },
    { name: "Dollar Block", short: "$name", chapter: "Bash Ch. 2 · Variables", icon: "i-link", verb: "use",
      line: 'echo "Hi, $name"',
      explain: "A $ in front of a name swaps in the variable's value. Inside double quotes, the swap still happens." },
    { name: "Single Quote Block", short: "'…'", chapter: "Bash Ch. 3 · Quoting", icon: "i-brackets", verb: "quote",
      line: "echo 'She said \"hi\"'",
      explain: "Single quotes keep every character exactly as typed — double quotes, $ signs, everything. Double quotes allow $ swaps but keep spaces safe." },
    { name: "Math Block", short: "$(( ))", chapter: "Bash Ch. 4 · Arithmetic", icon: "i-calc", verb: "calculate",
      line: "total=$(( coins * 2 ))",
      explain: "$(( … )) does math and gives back the answer. Bash only knows whole numbers: $(( 7 / 2 )) is 3." },
    { name: "Count Block", short: "(( += ))", chapter: "Bash Ch. 4 · Arithmetic", icon: "i-plus-square", verb: "add",
      line: "(( score += 10 ))",
      explain: "(( … )) changes number variables in place. Inside it you can skip the $ and use +=, -=, ++ and --." },
    { name: "If Block", short: "if [[ ]]", chapter: "Bash Ch. 5 · Decisions", icon: "i-fork", verb: "decide",
      line: 'if [[ $hp -le 0 ]]; then echo "Game over"; fi',
      explain: "if runs code when a test passes, and fi closes it. [[ … ]] holds the test; -le means “less than or equal.”" },
    { name: "Empty Test Block", short: "-z", chapter: "Bash Ch. 5 · Decisions", icon: "i-gap", verb: "check",
      line: 'if [[ -z $name ]]; then name="friend"; fi',
      explain: "-z is true when text is empty; -n is true when it isn't. Handy for giving a missing value a default." },
    { name: "And Block", short: "&&", chapter: "Bash Ch. 5 · Decisions", icon: "i-toggle", verb: "chain",
      line: '[[ -f notes.txt ]] && echo "found it"',
      explain: "A && B runs B only if A succeeded. A || B runs B only if A failed. -f asks “is this a file?”" },
    { name: "Case Block", short: "case", chapter: "Bash Ch. 6 · Case", icon: "i-shapes", verb: "match",
      line: 'case $day in sat|sun) echo "weekend" ;; *) echo "weekday" ;; esac',
      explain: "case compares one value with patterns, top to bottom, and runs the first match. ;; ends a branch and * catches everything else." },
    { name: "For Block", short: "for in", chapter: "Bash Ch. 7 · Loops", icon: "i-repeat", verb: "repeat",
      line: 'for fruit in apple pear plum; do echo "$fruit"; done',
      explain: "for takes each word in turn and runs the body between do and done once per word." },
    { name: "Range Block", short: "{1..5}", chapter: "Bash Ch. 7 · Loops", icon: "i-list", verb: "count",
      line: 'for i in {1..5}; do echo "$i"; done',
      explain: "{1..5} expands to 1 2 3 4 5 before the loop starts. {5..1} counts down, and {0..10..2} counts in steps of 2." },
    { name: "While Block", short: "while", chapter: "Bash Ch. 7 · Loops", icon: "i-hourglass", verb: "loop",
      line: "while (( lives > 0 )); do (( lives-- )); done",
      explain: "while repeats as long as its test passes. until is the opposite: it repeats until the test passes." },
    { name: "Array Block", short: "( )", chapter: "Bash Ch. 8 · Arrays", icon: "i-boxes", verb: "list",
      line: 'fruits=("apple" "pear" "plum")',
      explain: "Round brackets make an array: a numbered list starting at 0. ${fruits[0]} is apple." },
    { name: "Every Item Block", short: "\"${list[@]}\"", chapter: "Bash Ch. 8 · Arrays", icon: "i-rows", verb: "visit",
      line: 'for f in "${fruits[@]}"; do echo "$f"; done',
      explain: "\"${fruits[@]}\" gives every item as its own word, even items with spaces. Always keep the quotes." },
    { name: "Append Block", short: "+=( )", chapter: "Bash Ch. 8 · Arrays", icon: "i-plus-square", verb: "append",
      line: 'fruits+=("kiwi")',
      explain: "+=( … ) adds items to the end of an array. ${#fruits[@]} tells you how many items there are." },
    { name: "Dictionary Block", short: "declare -A", chapter: "Bash Ch. 9 · Associative Arrays", icon: "i-folder", verb: "map",
      line: "declare -A price=([apple]=50 [pear]=75)",
      explain: "declare -A makes an associative array: a list looked up by name instead of number. ${price[pear]} is 75." },
    { name: "Function Block", short: "name() { }", chapter: "Bash Ch. 10 · Functions", icon: "i-gear", verb: "define",
      line: 'greet() { echo "Hi, $1!"; }',
      explain: "A function is a mini-command you name yourself. Inside, $1 is the first thing you pass it, $2 the second." },
    { name: "Local Block", short: "local", chapter: "Bash Ch. 10 · Functions", icon: "i-lock", verb: "keep",
      line: "local total=0",
      explain: "local keeps a variable inside its function. Without it, every variable in Bash is shared with the whole script." },
    { name: "Capture Block", short: "$( )", chapter: "Bash Ch. 10 · Functions", icon: "i-box", verb: "capture",
      line: 'message=$(greet "Ana")',
      explain: "$( … ) runs a command and catches what it prints, so you can store it. This is how functions hand back text." },
    { name: "Or Exit Block", short: "|| exit", chapter: "Bash Ch. 11 · Exit Codes", icon: "i-stop", verb: "guard",
      line: 'cd "$folder" || exit 1',
      explain: "Every command finishes with an exit code: 0 means success, anything else means failure. || exit 1 stops the script if cd failed." },
    { name: "Slice Block", short: "${s:0:3}", chapter: "Bash Ch. 12 · String Tricks", icon: "i-pencil", verb: "cut",
      line: 'echo "${name:0:3}"',
      explain: "${name:0:3} takes 3 characters starting at position 0. ${#name} gives the length of the text." },
    { name: "Default Block", short: "${x:-y}", chapter: "Bash Ch. 12 · String Tricks", icon: "i-shield-check", verb: "default",
      line: 'echo "Hi, ${name:-friend}"',
      explain: "${name:-friend} uses name if it has a value, and “friend” if it's empty or unset." },
    { name: "Trim Block", short: "${f%.txt}", chapter: "Bash Ch. 12 · String Tricks", icon: "i-swap-h", verb: "trim",
      line: 'echo "${file%.txt}.md"',
      explain: "% cuts a pattern off the end and # cuts one off the front. ${file%.txt} turns notes.txt into notes." },
    { name: "Append File Block", short: ">>", chapter: "Bash Ch. 13 · Input and Output", icon: "i-file", verb: "save",
      line: 'echo "Ana 120" >> scores.txt',
      explain: "> sends output into a file, replacing what was there. >> adds to the end instead." },
    { name: "Read Loop Block", short: "read -r", chapter: "Bash Ch. 13 · Input and Output", icon: "i-rows", verb: "read",
      line: 'while read -r name score; do echo "$name: $score"; done < scores.txt',
      explain: "read -r takes one line and splits it into the variables you name. < feeds the file into the loop, line by line." },
    { name: "Pipe Block", short: "|", chapter: "Bash Ch. 14 · Pipes and Text Tools", icon: "i-funnel", verb: "pipe",
      line: "cut -d, -f1 fruit.csv | sort | uniq -c",
      explain: "| sends one command's output into the next. Here: take column 1, sort it, then count each repeated line." },
    { name: "Glob Block", short: "*.txt", chapter: "Bash Ch. 15 · Files and Folders", icon: "i-folder", verb: "find",
      line: 'for file in *.txt; do echo "$file"; done',
      explain: "*.txt matches every file name ending in .txt. Bash fills in the names before the loop runs." },
    { name: "Strict Mode Block", short: "set -euo", chapter: "Bash Ch. 16 · Scripts That Behave", icon: "i-shield-alert", verb: "protect",
      line: "set -euo pipefail",
      explain: "-e stops at the first failing command, -u stops on a misspelled variable, and pipefail notices failures inside pipes." }
  ];

  var chapters = [
    { title: "First Steps", chapter: "Start here · echo, bash main.sh, comments", line: 'echo "Hello, world!"',
      content: {
        story: ["Bash is the language of the command line. When you open a terminal on Linux — or on a Mac, or in Windows with WSL — you type commands, and Bash runs them. Put those commands in a file and you have a script: a little robot that does your chores.",
          "echo prints text. A script runs from the top line to the bottom. Comments start with # and Bash skips them. The very first line, #!/usr/bin/env bash, is called the shebang: it tells the computer which program reads the file.",
          "Save the file as main.sh and run bash main.sh. Or make it executable once with chmod +x main.sh, then run ./main.sh. Code Block teaches Bash 5. Macs ship an old Bash 3.2 and use zsh by default, so on a Mac install a newer Bash (for example with Homebrew) to follow along."],
        big: "Bash runs commands, one line at a time; a script is just those commands saved in a file.",
        caption: "bash main.sh reads the file from the top, and the terminal says hello. Tap Play.",
        demo: ["$ bash main.sh", "echo \"Hello, world!\"", "Hello, world!", "# comments start with a hash"]
      },
      deep: {
        more: ["Everything you can type at the prompt can go in a script, and everything in a script can be typed at the prompt. That makes Bash easy to try: test one line in the terminal, then paste it into your file.",
          "Quotes keep text exactly as you typed it, spaces and all. Without them, Bash squeezes a run of spaces down to one — Chapter 3 shows why."],
        ex: { code: src(["#!/usr/bin/env bash", "# My first Bash script", "echo \"Hello, world!\"", "echo \"I am learning Bash.\"", "echo \"2 + 3 is $(( 2 + 3 ))\"", "echo \"one    two\""]),
          walk: ["Line 1: the shebang — run this file with Bash.", "Line 2: a comment, skipped by Bash.", "Lines 3–4: two lines of text.", "Line 5: $(( … )) does the math: 2 + 3 is 5.", "Line 6: quotes keep the spaces: one    two."] },
        mistake: "Running ./main.sh and getting “Permission denied.” A new file isn't allowed to run as a program yet. Run chmod +x main.sh once, or just use bash main.sh."
      } },
    { title: "Variables", chapter: "Boxes · name=value, $name, ${name}, unset", line: 'name="Ana"',
      content: {
        story: ["name=\"Ana\" stores text in a variable called name. The rule that trips everyone up: no spaces around the =. With spaces, Bash thinks you're running a command called name.",
          "To use a variable, put a $ in front: echo \"$name\". When the name runs into other letters, wrap it in curly brackets: \"${name}'s turn\" — otherwise Bash would look for a variable called name's.",
          "Every Bash variable holds text. Even coins=42 stores the characters 4 and 2; Bash only treats them as a number when you do math. A variable you never set is simply empty."],
        big: "name=value stores it (no spaces!), and $name or ${name} reads it back.",
        caption: "The value goes in the box, and every $name swaps it back out. Tap Play.",
        demo: ["name=\"Ana\"", "coins=42", "echo \"$name has $coins coins\"", "Ana has 42 coins"]
      },
      deep: {
        more: ["Variable names can use letters, numbers and _, but can't start with a number. By habit, ALL_CAPS names are for settings shared with other programs (like HOME and PATH), and lowercase names are for your own script.",
          "unset name deletes a variable. readonly max=100 makes one that can't be changed."],
        ex: { code: src(["name=\"Ana\"", "coins=42", "echo \"$name has $coins coins\"", "echo \"${name}'s turn\"", "coins=50", "echo \"now: $coins\"", "greeting=\"Hi, $name\"", "echo \"$greeting\"", "unset name", "echo \"name is now '$name'\""]),
          walk: ["Lines 1–3: Ana has 42 coins.", "Line 4: the braces mark where the name ends: Ana's turn.", "Lines 5–6: a new value replaces the old one: now: 50.", "Lines 7–8: a variable can be built from others: Hi, Ana.", "Lines 9–10: after unset, name is empty: name is now ''."] },
        mistake: "Writing name = \"Ana\" with spaces. Bash reports “name: command not found” because it tried to run a program called name. Write name=\"Ana\"."
      } },
    { title: "Quoting", chapter: "Quotes · double, single, escapes, word splitting", line: "echo 'She said \"hi\"'",
      content: {
        story: ["Quotes matter more in Bash than in any other language. Double quotes \"…\" keep spaces safe but still swap in $variables. Single quotes '…' keep every character exactly as typed.",
          "Why it matters: without quotes, Bash splits a variable's value at every space. If item=\"red apple\", then $item becomes two separate words, red and apple. With file names that contain spaces, that splits one file into two — and commands go wrong.",
          "The habit that prevents most Bash bugs: put double quotes around every \"$variable\". A backslash \\ makes the next character ordinary: \"\\$5\" prints $5."],
        big: "Double quotes keep spaces safe and swap variables in; single quotes keep everything exactly as typed.",
        caption: "Unquoted, one value splits into two words. Quoted, it stays one. Tap Play.",
        demo: ["item=\"red apple\"", "echo \"Buying: $item\"", "echo 'Buying: $item'", "Buying: $item"]
      },
      deep: {
        more: ["ShellCheck, a free checker for shell scripts, warns about every unquoted variable. When splitting is what you really want, a # shellcheck disable= comment tells it so — the example below does that on purpose.",
          "To put a double quote inside double quotes, escape it: \"She said \\\"hi\\\"\". Inside single quotes, nothing is special — not even a backslash."],
        ex: { code: src(["item=\"red apple\"", "echo \"Buying: $item\"", "# shellcheck disable=SC2016", "echo 'Buying: $item'", "echo \"Price: \\$5\"", "echo \"She said \\\"hi\\\"\"", "echo 'She said \"hi\"'", "# shellcheck disable=SC2086", "printf '[%s]\\n' $item", "printf '[%s]\\n' \"$item\""]),
          walk: ["Lines 1–2: double quotes swap the value in: Buying: red apple.", "Lines 3–4: single quotes keep it as typed: Buying: $item. The comment tells ShellCheck that's on purpose.", "Line 5: the backslash makes $ ordinary: Price: $5.", "Lines 6–7: two ways to print quotes: She said \"hi\", twice.", "Lines 8–9: printf prints each word in brackets. Unquoted, the value splits: [red] then [apple].", "Line 10: quoted, it stays one word: [red apple]."] },
        mistake: "Writing rm $file. If file is “my notes.txt”, that tries to delete a file called my and another called notes.txt. Write rm \"$file\"."
      } },
    { title: "Arithmetic", chapter: "Numbers · $(( )), (( )), whole numbers only", line: "total=$(( coins * 2 ))",
      content: {
        story: ["Bash does math inside double round brackets. $(( 2 + 3 )) gives back 5, ready to store or print. Inside the brackets, you can use variable names without a $: $(( coins * 2 )).",
          "(( … )) on its own changes a variable in place: (( score += 10 )), (( lives-- )). The operators are the usual ones: + - * / and % (remainder) and ** (power).",
          "Bash only knows whole numbers. $(( 7 / 2 )) is 3 — the .5 is dropped. For money, count in cents. For real decimals, hand the math to a tool like awk."],
        big: "$(( … )) gives an answer, (( … )) changes a variable, and both work only with whole numbers.",
        caption: "The math happens inside the brackets; the answer drops out. Tap Play.",
        demo: ["echo $(( 7 / 2 ))", "3", "(( score += 10 ))", "echo $(( 2 ** 10 ))"]
      },
      deep: {
        more: ["The math follows the usual order: * and / before + and -. Use round brackets to change it: $(( (3 + 4) * 2 )) is 14.",
          "To show cents as dollars, split them: $(( total / 100 )) is the dollars and $(( total % 100 )) the cents, and printf '%d.%02d' prints them with two digits."],
        ex: { code: src(["coins=10", "players=4", "echo \"each: $(( coins / players ))\"", "echo \"left over: $(( coins % players ))\"", "echo \"power: $(( 2 ** 10 ))\"", "hp=100", "(( hp -= 30 ))", "(( hp++ ))", "echo \"hp: $hp\"", "echo \"$(( (3 + 4) * 2 ))\"", "cents=$(( coins * 100 / players ))", "printf '%d.%02d each\\n' \"$(( cents / 100 ))\" \"$(( cents % 100 ))\""]),
          walk: ["Lines 1–3: whole numbers only: each: 2.", "Line 4: the remainder: left over: 2.", "Line 5: ** is power: power: 1024.", "Lines 6–9: 100 − 30 + 1: hp: 71.", "Line 10: brackets first: 14.", "Lines 11–12: in cents the split is exact: 2.50 each."] },
        mistake: "Expecting decimals. $(( 10 / 4 )) is 2, not 2.5, and Bash refuses 2.5 inside $(( )) altogether. Count in cents, or use awk for real decimals."
      } },
    { title: "Decisions", chapter: "Choices · if, [[ ]], -eq, -z, -f, && and ||", line: 'if [[ $hp -le 0 ]]; then echo "Game over"; fi',
      content: {
        story: ["if runs code only when a test passes: if [[ test ]]; then … fi. fi is if spelled backwards, and it closes the block. elif tries another test, and else catches everything left.",
          "Inside [[ … ]], numbers compare with letters: -eq (equal), -ne (not equal), -lt, -le, -gt, -ge (less than, less or equal, greater…). Text compares with == and !=. -z asks “is this text empty?” and -f asks “is there a file with this name?”",
          "For number tests there's a friendlier form: (( hp < 20 )) uses the symbols you know. Spaces matter: [[ needs a space after it and ]] needs one before it."],
        big: "if [[ test ]]; then … fi — numbers use -lt and friends, text uses ==, and (( )) lets numbers use < and >.",
        caption: "The test picks one door; fi closes the hallway. Tap Play.",
        demo: ["if [[ $hp -le 0 ]]; then", "  echo \"Game over\"", "fi", "Game over"]
      },
      deep: {
        more: ["&& and || work between whole commands: [[ -f notes.txt ]] && echo \"found\" runs echo only if the file exists. They also join tests: [[ $a == x && $b -gt 2 ]].",
          "if doesn't really need [[ ]] — it runs any command and checks whether it succeeded. [[ is just a command that succeeds when its test is true."],
        ex: { code: src(["hp=0", "if [[ $hp -le 0 ]]; then", "  echo \"Game over\"", "elif [[ $hp -lt 20 ]]; then", "  echo \"Careful!\"", "else", "  echo \"Keep going\"", "fi", "name=\"\"", "if [[ -z $name ]]; then", "  name=\"friend\"", "fi", "echo \"Hi, $name\"", "if [[ $name == \"friend\" && $hp -eq 0 ]]; then echo \"both true\"; fi", "if (( hp < 10 )); then echo \"low\"; fi", "touch notes.txt", "[[ -f notes.txt ]] && echo \"notes.txt exists\"", "[[ -d notes.txt ]] || echo \"but it isn't a folder\""]),
          walk: ["Lines 1–8: hp is 0, so Game over.", "Lines 9–13: the name is empty, so it gets a default: Hi, friend.", "Line 14: && needs both tests to pass: both true.", "Line 15: (( )) compares with <: low.", "Line 16: touch makes an empty file.", "Line 17: -f finds it: notes.txt exists.", "Line 18: -d asks for a folder, fails, so || runs: but it isn't a folder."] },
        mistake: "Squashing the spaces: [[$hp -le 0]]. Bash needs a space after [[ and before ]], or it reports “command not found.”"
      } },
    { title: "Case", chapter: "Many doors · case, patterns, ;;", line: 'case $day in sat|sun) echo "weekend" ;; *) echo "weekday" ;; esac',
      content: {
        story: ["When one value could match many choices, case is tidier than a long elif chain. case $day in, then a list of patterns, each ending in ), each branch ending in ;;. esac — case backwards — closes it.",
          "Patterns can hold choices and wildcards: sat|sun) matches either word, *.jpg) matches any name ending in .jpg, and *) matches anything at all, so it goes last as the catch-all.",
          "Bash checks the patterns from top to bottom and runs only the first match."],
        big: "case compares one value against patterns, runs the first match, and esac closes it.",
        caption: "One value tries each door in order until a pattern fits. Tap Play.",
        demo: ["case $day in", "  sat | sun) echo \"weekend\" ;;", "  *) echo \"weekday\" ;;", "esac"]
      },
      deep: {
        more: ["case is the classic way to handle a script's commands: case $1 in start) …;; stop) …;; *) echo \"usage: …\";; esac.",
          "Patterns use the same wildcards as file names: * for any text, ? for one character, [abc] for one of a set."],
        ex: { code: src(["for day in sat mon sun fun; do", "  case $day in", "    sat | sun)", "      echo \"$day: weekend\"", "      ;;", "    mon | tue | wed | thu | fri)", "      echo \"$day: weekday\"", "      ;;", "    *)", "      echo \"$day: not a day\"", "      ;;", "  esac", "done", "file=\"photo.jpg\"", "case $file in", "  *.jpg | *.png) echo \"an image\" ;;", "  *.txt) echo \"a text file\" ;;", "  *) echo \"something else\" ;;", "esac"]),
          walk: ["Lines 1–13: each day tries the patterns: sat: weekend, mon: weekday, sun: weekend, fun: not a day.", "Lines 14–19: a wildcard pattern matches the ending: an image."] },
        mistake: "Forgetting the ;; at the end of a branch. Bash reports a syntax error near the next pattern."
      } },
    { title: "Loops", chapter: "Repeat · for, {1..5}, (( )), while, until, break", line: 'for fruit in apple pear plum; do echo "$fruit"; done',
      content: {
        story: ["for walks through a list of words: for fruit in apple pear plum; do … done. The body runs once for each word, with fruit holding the current one.",
          "{1..5} makes the list 1 2 3 4 5 for you. When the end is in a variable, use the counting form instead: for (( i = 1; i <= n; i++ )).",
          "while repeats as long as a test passes; until repeats until it passes. break leaves a loop early and continue skips to the next lap."],
        big: "for walks a list, (( )) counts, while repeats while true, and break or continue change the flow.",
        caption: "The loop takes one word at a time and runs the body for each. Tap Play.",
        demo: ["for i in {1..3}; do", "  echo \"lap $i\"", "done", "lap 1 · lap 2 · lap 3"]
      },
      deep: {
        more: ["printf '%s ' \"$i\" prints without a new line, so a loop can build one line of output. A bare echo afterwards ends the line.",
          "{1..10..2} counts in steps of 2, and {a..e} works for letters."],
        ex: { code: src(["for lap in 1 2 3; do", "  echo \"lap $lap\"", "done", "for i in {5..1}; do", "  printf '%s ' \"$i\"", "done", "echo", "for (( i = 0; i < 10; i += 3 )); do", "  printf '%s ' \"$i\"", "done", "echo", "lives=3", "while (( lives > 0 )); do", "  (( lives-- ))", "done", "echo \"lives: $lives\"", "n=0", "until (( n >= 3 )); do", "  (( n += 1 ))", "done", "echo \"n: $n\"", "for i in {1..10}; do", "  if (( i % 2 == 0 )); then continue; fi", "  if (( i > 7 )); then break; fi", "  printf '%s ' \"$i\"", "done", "echo"]),
          walk: ["Lines 1–3: lap 1, lap 2, lap 3.", "Lines 4–7: counting down on one line: 5 4 3 2 1.", "Lines 8–11: counting by threes: 0 3 6 9.", "Lines 12–16: lives: 0.", "Lines 17–21: until stops once the test passes: n: 3.", "Lines 22–27: skip even numbers, stop past 7: 1 3 5 7."] },
        mistake: "Writing for i in {1..$n}. The {1..5} trick happens before variables are filled in, so it never sees n's value. Use for (( i = 1; i <= n; i++ ))."
      } },
    { title: "Arrays", chapter: "Lists · ( ), \"${list[@]}\", +=, ${#list[@]}", line: 'fruits=("apple" "pear" "plum")',
      content: {
        story: ["An array is a numbered list: fruits=(\"apple\" \"pear\" \"plum\"). Counting starts at 0, so ${fruits[0]} is apple and ${fruits[2]} is plum. ${fruits[-1]} is the last item.",
          "\"${fruits[@]}\" gives every item, each as its own word — keep those quotes, so an item with a space stays whole. ${#fruits[@]} counts the items.",
          "fruits+=(\"kiwi\") adds to the end, fruits[1]=\"fig\" replaces one item, and unset 'fruits[0]' removes one."],
        big: "list=(a b c) makes an array; \"${list[@]}\" is every item and ${#list[@]} is how many.",
        caption: "Three boxes in a row, numbered from 0. Tap Play.",
        demo: ["fruits=(\"apple\" \"pear\" \"plum\")", "echo \"${fruits[0]}\"", "apple", "echo \"${#fruits[@]}\" → 3"]
      },
      deep: {
        more: ["\"${fruits[*]}\" joins every item into one piece of text with spaces between — good for printing, not for loops.",
          "${!fruits[@]} lists the index numbers. After an unset, the numbers have a gap; Bash doesn't shuffle the others down."],
        ex: { code: src(["fruits=(\"apple\" \"pear\" \"plum\")", "echo \"${fruits[0]} and ${fruits[-1]}\"", "echo \"${#fruits[@]} fruits\"", "fruits+=(\"kiwi\")", "for f in \"${fruits[@]}\"; do", "  echo \"- $f\"", "done", "fruits[1]=\"fig\"", "echo \"${fruits[*]}\"", "unset 'fruits[0]'", "echo \"${fruits[*]}\"", "echo \"indexes: ${!fruits[*]}\"", "printf '%s\\n' \"${fruits[@]}\" | sort"]),
          walk: ["Lines 1–2: the first and the last: apple and plum.", "Line 3: 3 fruits.", "Lines 4–7: - apple, - pear, - plum, - kiwi.", "Lines 8–9: replace item 1: apple fig plum kiwi.", "Lines 10–11: remove item 0: fig plum kiwi.", "Line 12: the gap stays: indexes: 1 2 3.", "Line 13: one per line, sorted: fig, kiwi, plum."] },
        mistake: "Writing $fruits or \"${fruits}\". Without [@], Bash gives only the first item. Use \"${fruits[@]}\"."
      } },
    { title: "Associative Arrays", chapter: "Dictionaries · declare -A, keys, values", line: "declare -A price=([apple]=50 [pear]=75)",
      content: {
        story: ["Sometimes you want to look things up by name, not number. declare -A price makes an associative array, and price[apple]=50 files 50 under the name apple.",
          "${price[apple]} reads it back. \"${!price[@]}\" lists every key, and \"${price[@]}\" every value. ${#price[@]} counts the pairs.",
          "Keys come back in no particular order. When order matters, sort them. Associative arrays need Bash 4 or newer."],
        big: "declare -A makes a dictionary: ${price[apple]} looks a value up by its name.",
        caption: "Each value sits in a drawer labelled with its name. Tap Play.",
        demo: ["declare -A price", "price[apple]=50", "echo \"${price[apple]}\"", "50"]
      },
      deep: {
        more: ["${price[kiwi]:-none} gives a fallback when a key is missing, instead of empty text.",
          "Counting with a dictionary is a classic: (( count[$word] += 1 )) adds one for each word you see."],
        ex: { code: src(["declare -A price=([apple]=50 [pear]=75)", "price[plum]=30", "echo \"a pear costs ${price[pear]} cents\"", "echo \"${#price[@]} items\"", "echo \"kiwi: ${price[kiwi]:-not sold here}\"", "unset 'price[apple]'", "total=0", "for item in \"${!price[@]}\"; do", "  (( total += price[$item] ))", "done", "echo \"total: $total\"", "printf '%s\\n' \"${!price[@]}\" | sort"]),
          walk: ["Lines 1–3: look up by name: a pear costs 75 cents.", "Line 4: 3 items.", "Line 5: a missing key gets the fallback: kiwi: not sold here.", "Lines 6–11: apple is gone, so 75 + 30: total: 105.", "Line 12: the keys, sorted: pear, plum."] },
        mistake: "Forgetting declare -A. Without it, Bash makes a normal numbered array, and every name you use as a key turns into index 0."
      } },
    { title: "Functions", chapter: "Machines · name() { }, $1, local, $( )", line: 'greet() { echo "Hi, $1!"; }',
      content: {
        story: ["A function is a mini-command you name yourself: greet() { … }. Call it like any command, with its inputs after it: greet \"Ana\".",
          "Inside, $1 is the first input, $2 the second, \"$@\" is all of them and $# is how many. local makes a variable that belongs only to the function — use it for everything a function makes.",
          "Bash functions hand back text by printing it. Catch what they print with $( … ): sum=$(add 2 3)."],
        big: "name() { … } makes a command; $1 and $2 are its inputs, and $( ) catches what it prints.",
        caption: "Inputs go in, the function prints, and $( ) catches it. Tap Play.",
        demo: ["greet() { echo \"Hi, $1!\"; }", "greet \"Ana\"", "Hi, Ana!", "msg=$(greet \"Leo\")"]
      },
      deep: {
        more: ["A function must be defined before the line that calls it, because Bash reads the script from top to bottom.",
          "A function can also answer yes or no: its exit status is that of its last command. is_even() { (( $1 % 2 == 0 )); } can be used straight in an if."],
        ex: { code: src(["greet() {", "  local name=${1:-friend}", "  echo \"Hi, $name!\"", "}", "", "add() {", "  echo $(( $1 + $2 ))", "}", "", "is_even() {", "  (( $1 % 2 == 0 ))", "}", "", "count_args() {", "  echo \"$# inputs: $*\"", "}", "", "greet", "greet \"Ana\"", "sum=$(add 2 3)", "echo \"sum: $sum\"", "if is_even 4; then echo \"4 is even\"; fi", "is_even 7 || echo \"7 is odd\"", "count_args a \"b c\" d"]),
          walk: ["Lines 1–4: local keeps name inside; ${1:-friend} is the default.", "Lines 6–8: add prints its answer.", "Lines 10–12: the math test is the answer: yes or no.", "Lines 14–16: $# counts inputs and $* shows them.", "Lines 18–19: Hi, friend! then Hi, Ana!", "Lines 20–21: $( ) catches the printed answer: sum: 5.", "Lines 22–23: 4 is even, 7 is odd.", "Line 24: \"b c\" is one input: 3 inputs: a b c d."] },
        mistake: "Using return to send back a result. return only sets the exit status, a number from 0 to 255. Print the result with echo and catch it with $( )."
      } },
    { title: "Exit Codes", chapter: "Success and failure · $?, return, exit, ||", line: 'cd "$folder" || exit 1',
      content: {
        story: ["Every command finishes with an exit code: 0 means it worked, anything else means it failed. $? holds the code of the command that just ran.",
          "if, && and || all read exit codes. That's why if grep -q \"Leo\" names.txt works: grep succeeds when it finds a match.",
          "In a function, return 1 reports failure. In a script, exit 1 stops everything and reports failure. Guard risky steps: cd \"$folder\" || exit 1 stops before anything runs in the wrong place."],
        big: "0 means success, anything else means failure; $? holds the last code and || reacts to a failure.",
        caption: "Every command hands back a code: 0 is a green light. Tap Play.",
        demo: ["grep -q \"Leo\" names.txt", "echo $?", "0", "cd \"$folder\" || exit 1"]
      },
      deep: {
        more: ["true always succeeds and false always fails, which is handy in tests.",
          "2> /dev/null throws away a command's error messages. /dev/null is a bottomless bin for output you don't want."],
        ex: { code: src(["check_age() {", "  if (( $1 >= 13 )); then", "    return 0", "  fi", "  return 1", "}", "", "check_age 15", "echo \"status: $?\"", "check_age 9", "echo \"status: $?\"", "if check_age 20; then echo \"welcome\"; fi", "printf 'Ana\\nLeo\\n' > names.txt", "grep -q \"Leo\" names.txt", "echo \"found Leo: $?\"", "grep -q \"Mia\" names.txt", "echo \"found Mia: $?\"", "mkdir backups && echo \"made backups\"", "mkdir backups 2> /dev/null || echo \"backups is already there\""]),
          walk: ["Lines 1–6: return 0 means yes, return 1 means no.", "Lines 8–11: status: 0, then status: 1.", "Line 12: if reads the code: welcome.", "Lines 13–15: grep finds Leo: found Leo: 0.", "Lines 16–17: no Mia, so grep fails: found Mia: 1.", "Line 18: the folder is new: made backups.", "Line 19: the second mkdir fails quietly: backups is already there."] },
        mistake: "cd \"$folder\"; rm -rf * without a guard. If cd fails, rm runs in the folder you were already in. Write cd \"$folder\" || exit 1."
      } },
    { title: "String Tricks", chapter: "Text · ${#s}, ${s:0:3}, ${s%.txt}, ${s:-default}, printf", line: 'echo "${name:0:3}"',
      content: {
        story: ["Bash can change text without any extra tools, right inside ${ … }. ${#name} is the length, ${name:0:3} takes 3 characters from the start, and ${name^^} shouts it in capitals.",
          "% cuts from the end and # cuts from the front: ${file%.txt} removes .txt, ${file#*.} removes everything up to the first dot. Doubled, %% and ## cut as much as they can. ${file/old/new} replaces text.",
          "${name:-friend} gives a default when name is empty. printf formats text precisely: printf '%-6s|%5d\\n' pads words and numbers into neat columns."],
        big: "${ } changes text in place: length, slices, cutting ends, replacing, and defaults.",
        caption: "The same word, trimmed, sliced and shouted. Tap Play.",
        demo: ["file=\"notes.txt\"", "echo \"${file%.txt}.md\"", "notes.md", "echo \"${#file}\" → 9"]
      },
      deep: {
        more: ["${name: -3} takes the last 3 characters. The space before -3 matters: without it, Bash reads :- as “default value.”",
          "printf reuses its format for leftover inputs: printf '%s\\n' a b c prints three lines. %d is a whole number, %s is text, and %.2f is a decimal with 2 places."],
        ex: { code: src(["name=\"Leonardo\"", "echo \"${#name} letters\"", "echo \"${name:0:3} ${name: -3}\"", "echo \"${name^^} ${name,,}\"", "file=\"report.final.txt\"", "echo \"${file%.txt}.md\"", "echo \"${file%%.*}\"", "echo \"${file#*.}\"", "echo \"${file/final/draft}\"", "title=\"\"", "echo \"${title:-Untitled}\"", "printf '%-6s|%5d|%.2f\\n' \"Ana\" 42 3.14159"]),
          walk: ["Lines 1–2: 8 letters.", "Line 3: the first 3 and the last 3: Leo rdo.", "Line 4: LEONARDO leonardo.", "Lines 5–6: cut .txt off the end: report.final.md.", "Line 7: %% cuts the longest match: report.", "Line 8: # cuts up to the first dot: final.txt.", "Line 9: replace a word: report.draft.txt.", "Lines 10–11: empty, so the default: Untitled.", "Line 12: padded columns: Ana   |   42|3.14."] },
        mistake: "Writing ${name:-3} when you meant the last 3 letters. That's the default-value form. Put a space in: ${name: -3}."
      } },
    { title: "Input and Output", chapter: "Streams · >, >>, <, 2>, here-docs, read", line: 'echo "Ana 120" >> scores.txt',
      content: {
        story: ["Every command has three streams: input (stdin), output (stdout) and errors (stderr). Redirection points them somewhere else. > sends output into a file, replacing it; >> adds to the end; < feeds a file in as input.",
          "2> redirects the error stream, so mistakes can go to their own file. A here-doc, << EOF … EOF, feeds several lines straight from your script, and <<< feeds in a single string.",
          "read -r takes one line of input and stores it. In a while loop with < file at the end, it reads the whole file, one line per lap."],
        big: "> writes, >> appends, < reads, 2> catches errors, and while read -r walks a file line by line.",
        caption: "Output flows down the pipe into the file instead of the screen. Tap Play.",
        demo: ["echo \"Ana 120\" > scores.txt", "echo \"Leo 95\" >> scores.txt", "while read -r name score; do …", "done < scores.txt"]
      },
      deep: {
        more: ["read -r name score splits the line at spaces: the first word goes in name and the rest in score. The -r keeps backslashes as they are; always use it.",
          ">&2 sends a message to the error stream — the right place for warnings, so they don't mix with real output."],
        ex: { code: src(["echo \"Ana 120\" > scores.txt", "echo \"Leo 95\" >> scores.txt", "cat >> scores.txt << EOF", "Mia 140", "Sam 80", "EOF", "total=0", "while read -r name score; do", "  echo \"$name scored $score\"", "  (( total += score ))", "done < scores.txt", "echo \"total: $total\"", "read -r first < scores.txt", "echo \"first line: $first\"", "tr '[:lower:]' '[:upper:]' <<< \"loud words\"", "{ echo \"to the screen\"; echo \"to the error log\" >&2; } 2> errors.txt", "echo \"errors.txt says: $(cat errors.txt)\""]),
          walk: ["Lines 1–2: > starts the file and >> adds to it.", "Lines 3–6: a here-doc adds two more lines.", "Lines 7–12: Ana scored 120, Leo scored 95, Mia scored 140, Sam scored 80, total: 435.", "Lines 13–14: read takes only the first line: first line: Ana 120.", "Line 15: <<< feeds one string to tr: LOUD WORDS.", "Line 16: stdout reaches the screen — to the screen — while 2> catches the error stream.", "Line 17: errors.txt says: to the error log."] },
        mistake: "Typing > when you meant >>. A single > empties the file first, so yesterday's log is gone."
      } },
    { title: "Pipes and Text Tools", chapter: "Pipelines · |, grep, sort, uniq, cut, awk, sed", line: "cut -d, -f1 fruit.csv | sort | uniq -c",
      content: {
        story: ["The pipe | is Bash's superpower: it sends one command's output straight into the next. Small tools, each doing one job, snap together like blocks.",
          "The everyday tools: grep finds lines that match, sort orders lines, uniq -c counts repeats (after sort), cut takes columns, head and tail take the first or last lines, wc -l counts lines.",
          "Two bigger tools handle the rest: sed edits text as it flows past (s/old/new/), and awk works with columns and can add numbers up — even decimals."],
        big: "| joins small tools into a pipeline: grep finds, sort orders, uniq counts, cut slices, awk adds up.",
        caption: "Lines flow through each tool in turn and come out counted. Tap Play.",
        demo: ["cut -d, -f1 fruit.csv", "| sort", "| uniq -c", "3 apple · 2 pear · 1 plum"]
      },
      deep: {
        more: ["uniq only spots repeats that sit next to each other, which is why it nearly always comes after sort. sort -rn sorts numbers, biggest first.",
          "Each part of a pipeline runs at the same time, so huge files stream through without filling up memory."],
        ex: { code: src(["cat > fruit.csv << EOF", "apple,50", "pear,75", "apple,50", "plum,30", "pear,75", "apple,50", "EOF", "cut -d, -f1 fruit.csv | sort | uniq -c | sort -rn", "grep -c \"pear\" fruit.csv", "head -n 2 fruit.csv", "tail -n 1 fruit.csv", "awk -F, '{ sum += $2 } END { print \"total:\", sum }' fruit.csv", "sed 's/apple/APPLE/' fruit.csv | head -n 1", "wc -l < fruit.csv"]),
          walk: ["Lines 1–8: write a small CSV file.", "Line 9: count each fruit, most first: 3 apple, 2 pear, 1 plum (uniq -c lines the counts up with spaces).", "Line 10: grep -c counts matching lines: 2.", "Lines 11–12: the first two lines, then the last: apple,50 pear,75, then apple,50.", "Line 13: awk adds column 2: total: 330.", "Line 14: sed swaps the text as it passes: APPLE,50.", "Line 15: 6 lines (a Mac pads this number with spaces)."] },
        mistake: "Piping into a while read loop and expecting its variables afterwards. Each side of a pipe runs in its own copy of the shell, so totals made inside are lost. Feed the loop with < file instead."
      } },
    { title: "Files and Folders", chapter: "The file system · globs, test -f -d, mkdir, cp, mv, find", line: 'for file in *.txt; do echo "$file"; done',
      content: {
        story: ["Bash is at home in the file system. mkdir -p makes folders (and any missing parents), touch makes an empty file, cp copies, mv moves or renames, and rm removes — for good, there's no bin.",
          "Wildcards, called globs, match file names: *.txt is every name ending in .txt, and photo?.jpg matches photo1.jpg. Bash fills in the matching names before the command runs, so for file in *.txt loops over real files.",
          "[[ -f path ]] tests for a file, [[ -d path ]] for a folder, and [[ -e path ]] for anything at all. find searches whole folder trees."],
        big: "Globs like *.txt match file names; mkdir, cp, mv and rm shape the folders; -f and -d test what's there.",
        caption: "The glob gathers every matching file name for the loop. Tap Play.",
        demo: ["mkdir -p project/notes", "touch project/notes/a.txt", "for file in project/notes/*.txt", "found a.txt"]
      },
      deep: {
        more: ["If a glob matches nothing, Bash leaves the pattern as plain text, so the loop runs once with file set to *.txt. shopt -s nullglob makes an empty match give an empty list instead.",
          "basename \"$file\" gives just the name, and dirname \"$file\" the folder part."],
        ex: { code: src(["mkdir -p project/notes", "touch project/notes/a.txt project/notes/b.txt project/todo.md", "for file in project/notes/*.txt; do", "  echo \"found $(basename \"$file\")\"", "done", "[[ -d project/notes ]] && echo \"notes is a folder\"", "cp project/todo.md project/todo.bak", "mv project/todo.bak project/notes/", "ls project/notes", "find project -name \"*.md\"", "rm -r project/notes", "[[ -e project/notes ]] || echo \"notes is gone\""]),
          walk: ["Lines 1–2: a folder tree and three empty files.", "Lines 3–5: the glob finds the .txt files: found a.txt, found b.txt.", "Line 6: notes is a folder.", "Lines 7–9: copy, then move the copy in: a.txt, b.txt, todo.bak.", "Line 10: find searches the tree: project/todo.md.", "Lines 11–12: rm -r removes the folder and everything in it: notes is gone."] },
        mistake: "Looping over ls: for f in $(ls). Names with spaces break apart. Use a glob: for f in *."
      } },
    { title: "Scripts That Behave", chapter: "Pro habits · set -euo pipefail, trap, usage, main", line: "set -euo pipefail",
      content: {
        story: ["Real scripts start with set -euo pipefail. -e stops the script at the first command that fails, -u stops it when you use a variable that was never set (usually a typo), and -o pipefail makes a pipe fail if any part of it fails.",
          "trap runs cleanup code when the script ends, however it ends: trap 'rm -f \"$tmp\"' EXIT deletes a temporary file even after an error.",
          "Tidy scripts put their steps in functions, check their inputs, print a usage line when something's missing, and call main \"$@\" at the bottom."],
        big: "set -euo pipefail stops on mistakes, trap cleans up, and a main function keeps the script tidy.",
        caption: "Strict mode catches a failure early, and trap tidies up on the way out. Tap Play.",
        demo: ["set -euo pipefail", "tmp=$(mktemp)", "trap 'rm -f \"$tmp\"' EXIT", "main \"$@\""]
      },
      deep: {
        more: ["mktemp makes a fresh temporary file with a name no other program is using, and prints its name.",
          "ShellCheck (shellcheck.net, or shellcheck main.sh) reads a script and points out bugs before you run it. Every script in Code Block passes it."],
        ex: { code: src(["#!/usr/bin/env bash", "set -euo pipefail", "", "tmp=$(mktemp)", "trap 'rm -f \"$tmp\"; echo \"cleaned up\"' EXIT", "", "usage() {", "  echo \"usage: greet NAME [TIMES]\"", "}", "", "main() {", "  if (( $# < 1 )); then", "    usage", "    return 1", "  fi", "  local name=$1", "  local times=${2:-1}", "  for (( i = 1; i <= times; i++ )); do", "    echo \"Hi, $name ($i)\" >> \"$tmp\"", "  done", "  cat \"$tmp\"", "}", "", "main \"Ana\" 2", "if ! main; then echo \"no name, so main returned 1\"; fi", "echo \"missing file? $(cat missing.txt 2> /dev/null || echo \"handled\")\""]),
          walk: ["Line 2: strict mode on.", "Lines 4–5: a temporary file, and a trap that removes it at the end.", "Lines 7–22: usage explains the inputs; main checks them first.", "Line 24: Hi, Ana (1), Hi, Ana (2).", "Line 25: no inputs, so usage prints and main fails: usage: greet NAME [TIMES], no name, so main returned 1.", "Line 26: || handles the failure: missing file? handled.", "When the script ends, the trap runs: cleaned up."] },
        mistake: "Using (( count++ )) under set -e. When count is 0, the expression's value is 0, which (( )) reports as a failure — and set -e stops the script. Write (( count += 1 )) or count=$(( count + 1 ))."
      } }
  ];

  var shelves = [
    { title: "Command-Line Toolbox", chapter: "Beyond the basics · Bash shelf", line: ["ls -la", "man grep"],
      content: {
        story: ["Bash itself is small; its strength is the tools around it. pwd shows where you are, cd moves, ls lists, cat prints files, less pages through long ones, and man shows the manual for nearly any command: man grep.",
          "Moving things: cp copies, mv moves and renames, rm deletes, mkdir makes folders. Finding things: find searches for files, grep searches inside them.",
          "Joining things: xargs turns a list of lines into arguments for another command, and seq counts. Every one of them works in pipes."],
        big: "pwd, cd, ls, cat, cp, mv, rm, find, grep and man cover most of what you'll do at the command line.",
        caption: "A shelf of small tools that snap together with pipes. Tap Play.",
        demo: ["pwd", "ls -la", "man grep", "seq 5 | xargs echo"]
      },
      deep: {
        more: ["Most commands explain themselves: try grep --help or man ls. Press q to leave a manual page.",
          "The up arrow brings back earlier commands, and Tab completes file names — two keys that save hours."],
        ex: { code: src(["mkdir -p demo", "cd demo || exit 1", "printf 'b\\nc\\na\\n' > letters.txt", "sort letters.txt | tr '\\n' ' '", "echo", "seq 5 | awk '{ sum += $1 } END { print sum }'", "basename /home/ana/notes.txt", "dirname /home/ana/notes.txt", "printf '%s\\n' one two three | xargs echo \"words:\"", "basename \"$PWD\""]),
          walk: ["Lines 1–2: make a folder and step into it.", "Lines 3–5: sort the letters onto one line: a b c.", "Line 6: seq counts 1 to 5 and awk adds them: 15.", "Lines 7–8: the name and the folder: notes.txt, /home/ana.", "Line 9: xargs turns lines into arguments: words: one two three.", "Line 10: the folder we're in: demo."] },
        mistake: "Running a command you found online without reading it first, especially one with sudo or rm -rf. Look each part up with man before you press Enter."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · Bash shelf", line: ["line 3: name: command not found", "unexpected end of file"],
      content: {
        story: ["Bash error messages name the file and the line: main.sh: line 3: name: command not found. Read them from the end — the last part says what went wrong.",
          "Three tools find most bugs. shellcheck main.sh reads the script and explains each problem it sees. bash -n main.sh checks the grammar without running anything. bash -x main.sh runs the script and prints each command, with + in front, as it happens.",
          "The usual suspects: spaces around =, a missing fi or done (“unexpected end of file”), unquoted variables, and comparing numbers with == or text with -eq."],
        big: "shellcheck explains problems, bash -n checks grammar, and bash -x shows every command as it runs.",
        caption: "The trace shows each command, with + in front, as Bash runs it. Tap Play.",
        demo: ["$ shellcheck main.sh", "$ bash -n main.sh", "$ bash -x main.sh", "+ total=4"]
      },
      deep: {
        more: ["set -x inside a script turns tracing on from that line; set +x turns it off again.",
          "Inside [[ ]], < and > compare text, not numbers: \"10\" < \"9\" is true because 1 sorts before 9. Use -lt and -gt, or (( )), for numbers."],
        ex: { code: src(["file=\"my notes.txt\"", "echo \"draft\" > \"$file\"", "# shellcheck disable=SC2086", "if ls $file > /dev/null 2>&1; then", "  echo \"unquoted: found it\"", "else", "  echo \"unquoted: ls looked for 'my' and 'notes.txt'\"", "fi", "if ls \"$file\" > /dev/null 2>&1; then echo \"quoted: found it\"; fi", "count=10", "if [[ $count -gt 9 ]]; then echo \"-gt compares numbers: 10 > 9\"; fi", "if (( count > 9 )); then echo \"so does (( ))\"; fi", "( set -x; echo $(( 2 + 2 )) > /dev/null ) 2>&1"]),
          walk: ["Lines 1–2: a file whose name has a space.", "Lines 3–8: unquoted, the name splits in two: unquoted: ls looked for 'my' and 'notes.txt'.", "Line 9: quoted: found it.", "Lines 10–12: numbers compared properly, twice.", "Line 13: set -x prints each command, with + in front, as Bash runs it: + echo 4."] },
        mistake: "Fixing the line the error points at when the real mistake is earlier. A missing done or fi is only noticed at the end of the file, so look upward for the block you never closed."
      } },
    { title: "Automating Everyday Chores", chapter: "Beyond the basics · Bash shelf", line: ["tar -czf backup.tar.gz photos", "0 3 * * * ~/backup.sh"],
      content: {
        story: ["Bash shines at the boring jobs: renaming a hundred photos, backing up a folder every night, cleaning out old logs. Write the steps once and the computer repeats them forever.",
          "tar -czf packs a folder into one compressed file. date +%F prints today's date as 2025-03-01, perfect for naming backups. printf '%03d' pads numbers to 001, 002 so files sort properly.",
          "cron runs scripts on a schedule. crontab -e opens your schedule; the line 0 3 * * * ~/backup.sh means minute 0, hour 3, every day."],
        big: "Loops rename and tidy, tar packs backups, date stamps them, and cron runs it all on a schedule.",
        caption: "One loop renames every photo in order. Tap Play.",
        demo: ["for file in photos/*.JPG; do", "  mv \"$file\" \"$new\"", "done", "0 3 * * * ~/backup.sh"]
      },
      deep: {
        more: ["Try a dry run first: echo the mv command instead of running it, check the list, then take the echo away.",
          "Names sort as text, so IMG_10 comes before IMG_2. Padding numbers with zeros, IMG_002, fixes that for good."],
        ex: { code: src(["mkdir -p photos", "touch photos/IMG_2.JPG photos/IMG_3.JPG photos/IMG_10.JPG", "n=0", "for file in photos/*.JPG; do", "  n=$(( n + 1 ))", "  printf -v new 'photos/holiday_%03d.jpg' \"$n\"", "  mv \"$file\" \"$new\"", "  echo \"$(basename \"$file\") -> $(basename \"$new\")\"", "done", "stamp=\"2025-03-01\"  # in a real script: stamp=$(date +%F)", "tar -czf \"backup-$stamp.tar.gz\" photos", "tar -tzf \"backup-$stamp.tar.gz\" | sort", "echo \"made backup-$stamp.tar.gz\""]),
          walk: ["Lines 1–2: three photos with messy names.", "Lines 3–9: rename in glob order: IMG_10.JPG -> holiday_001.jpg, IMG_2.JPG -> holiday_002.jpg, IMG_3.JPG -> holiday_003.jpg — text order puts 10 before 2.", "Line 10: a fixed date keeps this example the same every day.", "Lines 11–12: pack the folder and list what's inside: photos/, then the three holiday files.", "Line 13: made backup-2025-03-01.tar.gz."] },
        mistake: "Testing a cleanup script on real files first. Make a scratch folder, copy some files in, and run it there."
      } },
    { title: "Bash for Developers", chapter: "Beyond the basics · Bash shelf", line: ["export APP_MODE=test", "git status --short"],
      content: {
        story: ["Developers live in the terminal. Build scripts, test runners, deploy steps and CI pipelines are mostly Bash, because every server and container has it.",
          "Environment variables pass settings to programs. export APP_MODE=test makes a variable visible to every program the script starts; a plain variable stays in the script. PATH lists the folders Bash searches for commands.",
          "Exit codes are how tools talk to each other. CI systems run your commands and stop the build the moment one exits with anything but 0."],
        big: "export shares settings with child programs, PATH finds commands, and exit codes tell CI what passed.",
        caption: "Exported variables travel to child programs; plain ones stay home. Tap Play.",
        demo: ["export APP_MODE=test", "bash child.sh", "child sees: test", "command -v git"]
      },
      deep: {
        more: ["APP_MODE=test ./run.sh sets a variable for that one command only.",
          "command -v name tells you whether a command exists, which makes a good first check in any setup script."],
        ex: { code: src(["cat > child.sh << 'EOF'", "echo \"child sees: ${APP_MODE:-nothing} and ${SECRET:-nothing}\"", "EOF", "export APP_MODE=\"test\"", "SECRET=\"local\"", "echo \"parent sees: $APP_MODE and $SECRET\"", "bash child.sh", "APP_MODE=\"live\" bash child.sh", "command -v bash > /dev/null && echo \"bash is on the PATH\"", "run_step() {", "  echo \"== $1\"", "  shift", "  \"$@\"", "}", "if run_step \"lint\" true && run_step \"test\" false; then", "  echo \"all steps passed\"", "else", "  echo \"a step failed, so CI stops here\"", "fi"]),
          walk: ["Lines 1–3: a child script. Quoting 'EOF' keeps its $ signs for the child to fill in.", "Lines 4–6: parent sees: test and local.", "Line 7: only the exported one travels: child sees: test and nothing.", "Line 8: a one-command setting: child sees: live and nothing.", "Line 9: bash is on the PATH.", "Lines 10–14: run_step prints a title, then runs the rest of its inputs as a command.", "Lines 15–19: == lint, == test, then false fails: a step failed, so CI stops here."] },
        mistake: "Putting passwords and API keys straight into scripts. Read them from environment variables or a secrets manager, and keep them out of git."
      } },
    { title: "Testing Bash Scripts", chapter: "Beyond the basics · Bash shelf", line: ["check \"Hello World\" \"hello-world\"", "bats test/"],
      content: {
        story: ["Scripts deserve tests too. The simplest test is a function that runs your code with a known input and compares the result with what you expect.",
          "Test the edges: empty input, input with spaces, odd characters. Count the failures, and exit 1 if there are any, so CI notices.",
          "For bigger projects, bats-core is a test framework for Bash: each test is a small function, and bats test/ runs them all."],
        big: "Run the code with known inputs, compare with what you expect, and fail loudly on any mismatch.",
        caption: "Each case goes in, and the answer is checked against the expected one. Tap Play.",
        demo: ["check \"Hello World\" \"hello-world\"", "check \"\" \"\"", "4 checks, 0 failures", "bats test/"]
      },
      deep: {
        more: ["ShellCheck in CI catches whole kinds of bugs before any test runs.",
          "Keep the code you test in functions; tests can then call them one at a time."],
        ex: { code: src(["slugify() {", "  local s=${1,,}", "  s=${s// /-}", "  echo \"${s//[^a-z0-9-]/}\"", "}", "", "failures=0", "check() {", "  local got", "  got=$(slugify \"$1\")", "  if [[ $got != \"$2\" ]]; then", "    echo \"FAIL: slugify '$1' gave '$got', want '$2'\"", "    failures=$(( failures + 1 ))", "  fi", "}", "", "check \"Hello World\" \"hello-world\"", "check \"Code Block!\" \"code-block\"", "check \"Bash 5.2\" \"bash-52\"", "check \"\" \"\"", "echo \"4 checks, $failures failures\"", "(( failures == 0 )) || exit 1"]),
          walk: ["Lines 1–5: the code under test: lower-case, spaces to dashes, drop anything else.", "Lines 8–15: check compares the answer with what we want.", "Lines 17–20: normal text, punctuation, a dot, and empty input.", "Line 21: 4 checks, 0 failures.", "Line 22: any failure would make the script fail too."] },
        mistake: "Writing local got=$(slugify \"$1\") on one line. local itself succeeds, hiding a failure inside $( ). Declare the variable first, then assign it, as check does."
      } }
  ];

  var glossary = [
    ["$?", "The exit code of the command that just ran."],
    ["$#", "How many inputs a script or function was given."],
    ["$1, $2 …", "A script's or function's first, second … input."],
    ["\"$@\"", "Every input, each kept as its own word."],
    ["$( )", "Command substitution: runs a command and gives back what it printed."],
    ["$(( ))", "Arithmetic: gives back the answer to whole-number math."],
    ["(( ))", "Does math or a number test; changes variables in place."],
    ["[[ ]]", "Bash's test: compares text and numbers, checks files."],
    ["#!", "The shebang: the first line, naming the program that runs the file."],
    ["&&", "Runs the next command only if the last one succeeded."],
    ["||", "Runs the next command only if the last one failed."],
    ["|", "A pipe: sends one command's output into the next."],
    [">", "Sends output into a file, replacing what was there."],
    [">>", "Adds output to the end of a file."],
    ["<", "Feeds a file into a command as its input."],
    ["2>", "Redirects the error stream."],
    ["alias", "A short name for a longer command, for typing at the prompt."],
    ["argument", "A word passed to a command or function."],
    ["array", "A numbered list of values, starting at 0."],
    ["associative array", "A list looked up by names (keys); made with declare -A."],
    ["awk", "A tool for working with columns of text, and doing math on them."],
    ["brace expansion", "{1..5} or {a,b}: Bash writes out the list for you."],
    ["builtin", "A command that is part of Bash itself, like echo, cd and read."],
    ["case", "Matches one value against patterns; closed by esac."],
    ["cd", "Changes the current folder."],
    ["chmod +x", "Lets a file run as a program."],
    ["command substitution", "$( ): the output of one command used inside another."],
    ["cron", "Runs commands on a schedule."],
    ["cut", "Takes chosen columns out of each line."],
    ["declare", "Creates a variable with options, like -A for a dictionary."],
    ["double quotes", "Keep spaces safe but still swap in $variables."],
    ["echo", "Prints its words followed by a new line."],
    ["environment variable", "A variable shared with the programs a script starts."],
    ["exit", "Ends the script with an exit code."],
    ["exit code", "0 for success, 1–255 for failure."],
    ["export", "Makes a variable visible to programs the script starts."],
    ["function", "A named group of commands you can call like a command."],
    ["glob", "A wildcard pattern like *.txt that matches file names."],
    ["grep", "Finds lines that match a pattern."],
    ["here-doc", "<< EOF … EOF: several lines fed in as input."],
    ["here-string", "<<< \"text\": one string fed in as input."],
    ["local", "Makes a variable that belongs only to its function."],
    ["man", "Shows the manual page for a command."],
    ["nullglob", "A setting that makes a glob with no matches give nothing."],
    ["PATH", "The list of folders Bash searches for commands."],
    ["pipefail", "Makes a pipeline fail if any part of it fails."],
    ["printf", "Prints with a format: %s for text, %d for numbers."],
    ["process substitution", "<( ): a command's output used as if it were a file."],
    ["read", "Reads one line of input into variables."],
    ["redirection", "Pointing a command's input or output at a file."],
    ["return", "Leaves a function with an exit code."],
    ["script", "A file of commands that Bash runs top to bottom."],
    ["sed", "Edits text as it flows past, such as s/old/new/."],
    ["set -e", "Stops the script when a command fails."],
    ["set -u", "Stops the script when an unset variable is used."],
    ["set -x", "Prints each command before running it."],
    ["shell", "The program that reads your commands. Bash is one; zsh is another."],
    ["ShellCheck", "A free checker that finds bugs in shell scripts."],
    ["shift", "Drops $1 and moves the other inputs down one place."],
    ["single quotes", "Keep every character exactly as typed."],
    ["sort", "Puts lines in order."],
    ["source", "Runs another file inside the current script, sharing its variables."],
    ["stderr", "The error stream, number 2."],
    ["stdin", "The input stream, number 0."],
    ["stdout", "The output stream, number 1."],
    ["subshell", "A copy of the shell; its variable changes don't come back."],
    ["sudo", "Runs one command as the administrator. Use with care."],
    ["tr", "Swaps or deletes characters."],
    ["trap", "Runs code when the script ends or gets a signal."],
    ["uniq", "Collapses repeated lines that sit next to each other; -c counts them."],
    ["unset", "Deletes a variable or an array item."],
    ["variable", "A named box holding text."],
    ["wc -l", "Counts lines."],
    ["word splitting", "Bash breaking unquoted values apart at spaces."],
    ["xargs", "Turns lines of input into arguments for a command."],
    ["zsh", "Another shell, the default on Macs; very close to Bash."]
  ];

  var field = [
    { name: "echo / printf", head: "builtin", what: "Print a line, or print with a format.", ex: "printf '%-6s %3d\\n' \"$name\" \"$n\"" },
    { name: "read -r", head: "builtin", what: "Read a line into variables.", ex: "read -r name age < info.txt" },
    { name: "[[ ]] / (( ))", head: "keyword", what: "Test text and files, or numbers.", ex: "[[ -f $file ]] && (( n > 2 ))" },
    { name: "$(( ))", head: "expansion", what: "Whole-number math.", ex: "half=$(( total / 2 ))" },
    { name: "${var…}", head: "expansion", what: "Length, slices, trims, replaces, defaults.", ex: "${file%.txt} ${name:-friend}" },
    { name: "arrays", head: "builtin", what: "Numbered lists.", ex: "list+=(\"x\"); echo \"${#list[@]}\"" },
    { name: "declare -A", head: "builtin", what: "Dictionaries looked up by name.", ex: "declare -A age=([ana]=12)" },
    { name: "> >> < 2>", head: "redirection", what: "Write, append, read, catch errors.", ex: "cmd > out.txt 2> err.txt" },
    { name: "grep", head: "tool", what: "Find matching lines; -c counts, -i ignores case.", ex: "grep -i \"error\" app.log" },
    { name: "sort / uniq", head: "tool", what: "Order lines and count repeats.", ex: "sort words.txt | uniq -c" },
    { name: "cut / tr", head: "tool", what: "Take columns; swap characters.", ex: "cut -d, -f2 data.csv" },
    { name: "awk / sed", head: "tool", what: "Work with columns; edit text in a stream.", ex: "sed 's/old/new/g' a.txt" },
    { name: "find", head: "tool", what: "Search folders for files.", ex: "find . -name \"*.log\"" },
    { name: "mkdir / cp / mv / rm", head: "tool", what: "Make, copy, move and remove.", ex: "mkdir -p backups/2025" },
    { name: "set / trap", head: "builtin", what: "Strict mode, and cleanup at the end.", ex: "trap 'rm -f \"$tmp\"' EXIT" }
  ];

  var cheats = [
    { title: "Script Card", body: "A script runs top to bottom.", code: src(["#!/usr/bin/env bash", "set -euo pipefail", "# main.sh", "name=\"Ana\"", "echo \"Hi, $name!\""]) },
    { title: "Variables Card", body: "Store, read, do math.", code: src(["name=\"Ana\"", "coins=42", "echo \"$name has $coins coins\"", "echo \"${name}'s turn\"", "total=$(( coins * 2 ))", "(( coins += 8 ))", "today=$(date +%F)"]) },
    { title: "Decisions Card", body: "if, tests and case.", code: src(["if [[ $n -gt 0 ]]; then", "  echo \"positive\"", "elif [[ $n -eq 0 ]]; then", "  echo \"zero\"", "else", "  echo \"negative\"", "fi", "[[ -z $name ]] && name=\"friend\"", "[[ -f notes.txt ]] || touch notes.txt", "case $answer in y | yes) echo \"ok\" ;; *) echo \"no\" ;; esac"]) },
    { title: "Loops Card", body: "Every way to repeat.", code: src(["for fruit in apple pear plum; do echo \"$fruit\"; done", "for i in {1..5}; do echo \"$i\"; done", "for (( i = 0; i < n; i++ )); do echo \"$i\"; done", "while (( lives > 0 )); do (( lives-- )); done", "while read -r line; do echo \"$line\"; done < notes.txt", "for file in *.txt; do echo \"$file\"; done"]) },
    { title: "Arrays Card", body: "Lists and dictionaries.", code: src(["list=(\"a\" \"b\" \"c\")", "list+=(\"d\")", "echo \"${list[0]} ${#list[@]}\"", "for x in \"${list[@]}\"; do echo \"$x\"; done", "declare -A age=([ana]=12 [leo]=13)", "age[mia]=11", "for k in \"${!age[@]}\"; do echo \"$k ${age[$k]}\"; done"]) },
    { title: "Functions Card", body: "Inputs in, text out.", code: src(["greet() {", "  local name=${1:-friend}", "  echo \"Hi, $name!\"", "}", "greet \"Ana\"", "msg=$(greet \"Leo\")", "is_even() { (( $1 % 2 == 0 )); }", "if is_even 4; then echo \"even\"; fi"]) },
    { title: "Text Card", body: "Change text in place.", code: src(["echo \"${#name}\"", "echo \"${name:0:3}\"", "echo \"${name^^}\"", "echo \"${file%.txt}.md\"", "echo \"${file#*/}\"", "echo \"${line/old/new}\"", "echo \"${title:-Untitled}\"", "printf '%-8s %5d\\n' \"$name\" \"$score\""]) },
    { title: "Files Card", body: "Streams, pipes and files.", code: src(["echo \"line\" > out.txt", "echo \"more\" >> out.txt", "sort names.txt | uniq -c", "grep -c \"error\" app.log", "mkdir -p backups", "cp notes.txt backups/", "cmd 2> /dev/null", "cd \"$folder\" || exit 1"]) }
  ];

  function stars(n) { return new Array(n + 1).join("*"); }
  function padR(s, w) { s = String(s); while (s.length < w) s += " "; return s; }
  function padL(s, w) { s = String(s); while (s.length < w) s = " " + s; return s; }
  function pad0(n, w) { var s = String(n); while (s.length < w) s = "0" + s; return s; }
  function S(lines) { return ["#!/usr/bin/env bash"].concat(lines); }

  var projects = [
    { name: "Rocket Countdown", about: "A counting for loop goes down by one each lap until blast off.",
      vars: [{ key: "start", val: 5, min: 1, max: 12 }],
      code: function (v) { return S(["start=" + v.start, "for (( i = start; i > 0; i-- )); do", "  echo \"$i...\"", "done", "echo \"Blast off!\""]); },
      run: function (v) { var o = []; for (var i = v.start; i > 0; i--) o.push(i + "..."); o.push("Blast off!"); return o; },
      explain: "for (( i = start; i > 0; i-- )) starts at your number, keeps going while i is above 0, and takes 1 off each lap." },
    { name: "Star Steps", about: "+= adds one more star to the line before each row is printed.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return S(["rows=" + v.rows, "line=\"\"", "for (( r = 1; r <= rows; r++ )); do", "  line+=\"*\"", "  echo \"$line\"", "done"]); },
      run: function (v) { var o = []; for (var r = 1; r <= v.rows; r++) o.push(stars(r)); return o; },
      explain: "line+=\"*\" sticks one more star on the end of the text, so every row is one star longer than the last." },
    { name: "Coin Bank", about: "Every coin adds to the running total.",
      vars: [{ key: "coins", val: 5, min: 1, max: 10 }, { key: "each", val: 25, min: 1, max: 50 }],
      code: function (v) { return S(["coins=" + v.coins, "each=" + v.each, "total=0", "for (( i = 1; i <= coins; i++ )); do", "  (( total += each ))", "  echo \"coin $i: total $total\"", "done", "echo \"Saved $total cents\""]); },
      run: function (v) { var o = [], t = 0; for (var i = 1; i <= v.coins; i++) { t += v.each; o.push("coin " + i + ": total " + t); } o.push("Saved " + t + " cents"); return o; },
      explain: "(( total += each )) adds the coin's value to the total in place, once per lap." },
    { name: "Times Table", about: "$(( n * i )) works out each answer inside the line.",
      vars: [{ key: "n", val: 7, min: 1, max: 12 }, { key: "upto", val: 5, min: 1, max: 12 }],
      code: function (v) { return S(["n=" + v.n, "upto=" + v.upto, "for (( i = 1; i <= upto; i++ )); do", "  echo \"$n x $i = $(( n * i ))\"", "done"]); },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(v.n + " x " + i + " = " + v.n * i); return o; },
      explain: "$(( n * i )) is replaced by its answer before echo prints the line." },
    { name: "FizzBuzz", about: "The classic: Fizz for threes, Buzz for fives, FizzBuzz for both.",
      vars: [{ key: "limit", val: 15, min: 1, max: 30 }],
      code: function (v) { return S(["limit=" + v.limit, "for (( i = 1; i <= limit; i++ )); do", "  if (( i % 15 == 0 )); then", "    echo \"FizzBuzz\"", "  elif (( i % 3 == 0 )); then", "    echo \"Fizz\"", "  elif (( i % 5 == 0 )); then", "    echo \"Buzz\"", "  else", "    echo \"$i\"", "  fi", "done"]); },
      run: function (v) { var o = []; for (var i = 1; i <= v.limit; i++) o.push(i % 15 === 0 ? "FizzBuzz" : i % 3 === 0 ? "Fizz" : i % 5 === 0 ? "Buzz" : String(i)); return o; },
      explain: "% gives the remainder, so i % 3 == 0 means “divides by 3.” The 15 test goes first, or Fizz would win." },
    { name: "Grade Report", about: "An if chain picks the grade; case picks the message.",
      vars: [{ key: "score", val: 85, min: 0, max: 100 }],
      code: function (v) { return S(["score=" + v.score, "if (( score >= 90 )); then", "  grade=\"A\"", "elif (( score >= 80 )); then", "  grade=\"B\"", "elif (( score >= 70 )); then", "  grade=\"C\"", "elif (( score >= 60 )); then", "  grade=\"D\"", "else", "  grade=\"F\"", "fi", "echo \"Score: $score\"", "echo \"Grade: $grade\"", "case $grade in", "  A | B) echo \"Great work!\" ;;", "  C | D) echo \"Keep practicing.\" ;;", "  *) echo \"Let's review together.\" ;;", "esac"]); },
      run: function (v) { var s = v.score, g = s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : s >= 60 ? "D" : "F"; return ["Score: " + s, "Grade: " + g, g === "A" || g === "B" ? "Great work!" : g === "C" || g === "D" ? "Keep practicing." : "Let's review together."]; },
      explain: "The if chain stops at the first test that passes, so a 95 never reaches the B test. case then matches the letter." },
    { name: "Shopping Cart", about: "Prices live in a dictionary, in cents, so the math stays exact.",
      vars: [{ key: "apples", val: 3, min: 0, max: 9 }, { key: "pears", val: 2, min: 0, max: 9 }],
      code: function (v) { return S(["apples=" + v.apples, "pears=" + v.pears, "declare -A price=([apple]=50 [pear]=75)", "total=$(( apples * price[apple] + pears * price[pear] ))", "printf '%-6s %d x %d cents\\n' \"apple\" \"$apples\" \"${price[apple]}\"", "printf '%-6s %d x %d cents\\n' \"pear\" \"$pears\" \"${price[pear]}\"", "printf 'Total: $%d.%02d\\n' \"$(( total / 100 ))\" \"$(( total % 100 ))\""]); },
      run: function (v) { var t = v.apples * 50 + v.pears * 75; return [padR("apple", 6) + " " + v.apples + " x 50 cents", padR("pear", 6) + " " + v.pears + " x 75 cents", "Total: $" + Math.floor(t / 100) + "." + pad0(t % 100, 2)]; },
      explain: "Bash has no decimals, so prices are cents. / 100 gives the dollars, % 100 the cents, and %02d keeps two digits." },
    { name: "Collatz Trail", about: "Halve even numbers, triple-and-add-one odd ones, until you reach 1.",
      vars: [{ key: "n", val: 6, min: 2, max: 25 }],
      code: function (v) { return S(["n=" + v.n, "steps=0", "trail=\"$n\"", "while (( n != 1 )); do", "  if (( n % 2 == 0 )); then", "    (( n /= 2 ))", "  else", "    (( n = 3 * n + 1 ))", "  fi", "  (( steps += 1 ))", "  trail+=\" $n\"", "done", "echo \"$trail\"", "echo \"$steps steps to reach 1\""]); },
      run: function (v) { var n = v.n, steps = 0, trail = String(n); while (n !== 1) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; steps++; trail += " " + n; } return [trail, steps + " steps to reach 1"]; },
      explain: "The while loop keeps going until n is 1. Nobody has ever found a starting number that doesn't get there." },
    { name: "Prime Finder", about: "Each number is tested only against the primes already found.",
      vars: [{ key: "limit", val: 30, min: 2, max: 60 }],
      code: function (v) { return S(["limit=" + v.limit, "primes=()", "for (( n = 2; n <= limit; n++ )); do", "  prime=1", "  for p in \"${primes[@]}\"; do", "    if (( p * p > n )); then", "      break", "    fi", "    if (( n % p == 0 )); then", "      prime=0", "      break", "    fi", "  done", "  if (( prime )); then", "    primes+=(\"$n\")", "  fi", "done", "echo \"${primes[*]}\"", "echo \"${#primes[@]} primes up to $limit\""]); },
      run: function (v) { var ps = []; for (var n = 2; n <= v.limit; n++) { var ok = true; for (var j = 0; j < ps.length; j++) { if (ps[j] * ps[j] > n) break; if (n % ps[j] === 0) { ok = false; break; } } if (ok) ps.push(n); } return [ps.join(" "), ps.length + " primes up to " + v.limit]; },
      explain: "A number with no prime factor up to its square root is prime, so the inner loop can break early." },
    { name: "Number Guess", about: "The computer guesses the middle of what's left, every time.",
      vars: [{ key: "secret", val: 37, min: 1, max: 100 }],
      code: function (v) { return S(["secret=" + v.secret, "low=1", "high=100", "tries=0", "while true; do", "  guess=$(( (low + high) / 2 ))", "  (( tries += 1 ))", "  if (( guess == secret )); then", "    echo \"$guess is right! Found in $tries tries.\"", "    break", "  elif (( guess < secret )); then", "    echo \"$guess is too low\"", "    low=$(( guess + 1 ))", "  else", "    echo \"$guess is too high\"", "    high=$(( guess - 1 ))", "  fi", "done"]); },
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
      explain: "Each guess is the middle of what's left, so every wrong answer throws away half the numbers. 100 numbers need at most 7 guesses." },
    { name: "Progress Bar", about: "A loop fills the bar with # up to the percentage, then dots.",
      vars: [{ key: "percent", val: 40, min: 0, max: 100 }, { key: "width", val: 20, min: 10, max: 30 }],
      code: function (v) { return S(["percent=" + v.percent, "width=" + v.width, "filled=$(( percent * width / 100 ))", "bar=\"\"", "for (( i = 1; i <= width; i++ )); do", "  if (( i <= filled )); then", "    bar+=\"#\"", "  else", "    bar+=\".\"", "  fi", "done", "echo \"Downloading...\"", "echo \"[$bar] $percent%\""]); },
      run: function (v) { var f = Math.floor(v.percent * v.width / 100), b = ""; for (var i = 1; i <= v.width; i++) b += i <= f ? "#" : "."; return ["Downloading...", "[" + b + "] " + v.percent + "%"]; },
      explain: "percent * width / 100 works out how many cells to fill. Multiplying first keeps the whole-number math accurate." },
    { name: "Change Maker", about: "Two arrays side by side: coin values and their names.",
      vars: [{ key: "cents", val: 68, min: 1, max: 99 }],
      code: function (v) { return S(["cents=" + v.cents, "coins=(25 10 5 1)", "names=(\"quarters\" \"dimes\" \"nickels\" \"pennies\")", "left=$cents", "echo \"$cents cents is:\"", "for i in \"${!coins[@]}\"; do", "  count=$(( left / coins[i] ))", "  left=$(( left % coins[i] ))", "  echo \"  ${names[i]}: $count\"", "done"]); },
      run: function (v) { var c = [25, 10, 5, 1], nm = ["quarters", "dimes", "nickels", "pennies"], left = v.cents, o = [v.cents + " cents is:"]; for (var i = 0; i < 4; i++) { o.push("  " + nm[i] + ": " + Math.floor(left / c[i])); left = left % c[i]; } return o; },
      explain: "/ says how many of each coin fit, and % hands what's left to the next coin. \"${!coins[@]}\" gives the positions 0 1 2 3." },
    { name: "Leap Year Finder", about: "One test with && and || holds the whole leap-year rule.",
      vars: [{ key: "start", val: 1996, min: 1890, max: 2100 }],
      code: function (v) { return S(["start=" + v.start, "for (( year = start; year < start + 12; year++ )); do", "  if (( year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) )); then", "    echo \"$year is a leap year\"", "  fi", "done", "echo \"Checked $start to $(( start + 11 ))\""]); },
      run: function (v) { var o = []; for (var y = v.start; y < v.start + 12; y++) if (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) o.push(y + " is a leap year"); o.push("Checked " + v.start + " to " + (v.start + 11)); return o; },
      explain: "Every 4th year is a leap year, except whole centuries — unless they divide by 400. So 2000 was one, and 1900 and 2100 are not." },
    { name: "Batch Rename", about: "A dry run: print every rename before doing any of them.",
      vars: [{ key: "files", val: 4, min: 1, max: 9 }, { key: "first", val: 1, min: 1, max: 50 }],
      code: function (v) { return S(["files=" + v.files, "first=" + v.first, "for (( i = 0; i < files; i++ )); do", "  old=\"IMG_$(( 4000 + i )).JPG\"", "  printf -v new 'holiday_%03d.jpg' \"$(( first + i ))\"", "  echo \"mv $old $new\"", "done", "echo \"Dry run: nothing was renamed.\""]); },
      run: function (v) { var o = []; for (var i = 0; i < v.files; i++) o.push("mv IMG_" + (4000 + i) + ".JPG holiday_" + pad0(v.first + i, 3) + ".jpg"); o.push("Dry run: nothing was renamed."); return o; },
      explain: "printf -v stores the formatted text in a variable instead of printing it. %03d pads to three digits, so the files sort in order." },
    { name: "Bank Account", about: "A function refuses to overdraw, and its exit code stops the loop.",
      vars: [{ key: "balance", val: 100, min: 10, max: 200 }, { key: "amount", val: 30, min: 5, max: 100 }],
      code: function (v) { return S(["balance=" + v.balance, "amount=" + v.amount, "withdraw() {", "  if (( $1 > balance )); then", "    echo \"Refused $1: only $balance left\"", "    return 1", "  fi", "  balance=$(( balance - $1 ))", "  echo \"Took $1, balance $balance\"", "}", "for _ in 1 2 3 4 5; do", "  withdraw \"$amount\" || break", "done", "echo \"Final balance: $balance\""]); },
      run: function (v) { var o = [], b = v.balance; for (var k = 0; k < 5; k++) { if (v.amount > b) { o.push("Refused " + v.amount + ": only " + b + " left"); break; } b -= v.amount; o.push("Took " + v.amount + ", balance " + b); } o.push("Final balance: " + b); return o; },
      explain: "return 1 reports failure, and || break reacts to it. The function changes balance directly, because Bash variables are shared unless they're local." },
    { name: "Temperature Table", about: "Bash's whole-number math drops the decimals from each answer.",
      vars: [{ key: "start", val: 0, min: -20, max: 40 }],
      code: function (v) { return S(["start=" + v.start, "for (( c = start; c <= start + 40; c += 10 )); do", "  f=$(( c * 9 / 5 + 32 ))", "  printf '%4d C = %4d F\\n' \"$c\" \"$f\"", "done"]); },
      run: function (v) { var o = []; for (var c = v.start; c <= v.start + 40; c += 10) o.push(padL(c, 4) + " C = " + padL(Math.trunc(c * 9 / 5) + 32, 4) + " F"); return o; },
      explain: "c * 9 / 5 is whole-number division, so 1 °C shows as 33 °F, not 33.8. %4d lines the numbers up in columns." },
    { name: "Clock Formatter", about: "/ and % split seconds into hours, minutes and seconds.",
      vars: [{ key: "seconds", val: 3725, min: 0, max: 9999 }],
      code: function (v) { return S(["seconds=" + v.seconds, "hours=$(( seconds / 3600 ))", "minutes=$(( seconds % 3600 / 60 ))", "secs=$(( seconds % 60 ))", "printf '%d seconds is %02d:%02d:%02d\\n' \"$seconds\" \"$hours\" \"$minutes\" \"$secs\"", "echo \"${hours}h ${minutes}m ${secs}s\""]); },
      run: function (v) { var h = Math.floor(v.seconds / 3600), m = Math.floor(v.seconds % 3600 / 60), s = v.seconds % 60; return [v.seconds + " seconds is " + pad0(h, 2) + ":" + pad0(m, 2) + ":" + pad0(s, 2), h + "h " + m + "m " + s + "s"]; },
      explain: "/ 3600 counts whole hours, % 3600 / 60 the minutes left over, and % 60 the seconds. ${hours}h needs the braces so Bash doesn't look for a variable called hoursh." },
    { name: "Box Drawer", about: "Nested loops build the edges and the empty middle.",
      vars: [{ key: "width", val: 6, min: 2, max: 20 }, { key: "height", val: 3, min: 1, max: 8 }],
      code: function (v) { return S(["width=" + v.width, "height=" + v.height, "edge=\"+\"", "for (( i = 0; i < width; i++ )); do", "  edge+=\"-\"", "done", "edge+=\"+\"", "echo \"$edge\"", "for (( row = 0; row < height; row++ )); do", "  printf '|%*s|\\n' \"$width\" \"\"", "done", "echo \"$edge\""]); },
      run: function (v) { var edge = "+" + new Array(v.width + 1).join("-") + "+", mid = "|" + new Array(v.width + 1).join(" ") + "|", o = [edge]; for (var r = 0; r < v.height; r++) o.push(mid); o.push(edge); return o; },
      explain: "%*s takes its width from the next input, so printf pads empty text out to exactly width spaces." }
  ];

  var vt = [
    { line: 'echo "{w}"', why: "echo prints a line." },
    { line: 'echo "${v}"', why: "$ swaps in the value." },
    { line: 'echo "{w}: ${v}"', why: "Variables work inside double quotes." },
    { line: "printf '%d\\n' \"${v}\"", why: "printf formats a number." },
    { line: "{v}={n}", why: "No spaces around the =." },
    { line: '{sv}="{w}"', why: "Text goes in quotes." },
    { line: "readonly {v}={n}", why: "readonly can't be changed." },
    { line: "{v}=$(( {u} + {n} ))", why: "$(( )) gives back an answer." },
    { line: "(( {v} += {n} ))", why: "(( )) changes a number in place." },
    { line: "(( {v} -= {d} ))", why: "Take away from the current value." },
    { line: "(( {v} *= {d} ))", why: "Multiply the current value." },
    { line: "{v}=$(( {u} % {d} ))", why: "% gives the remainder." },
    { line: "{v}=$(( {u} / {d} ))", why: "Whole numbers only: decimals are dropped." },
    { line: "{v}=$(( {u} ** 2 ))", why: "** is power." },
    { line: "(( {v}++ ))", why: "++ adds one." },
    { line: '{sv}="{w} ${sv}"', why: "Join text by writing it side by side." },
    { line: 'echo "${#{sv}}"', why: "${#…} gives the length." },
    { line: 'echo "${{sv}^^}"', why: "^^ makes capitals." },
    { line: 'echo "${{sv}:0:{d}}"', why: "Take characters from the start." },
    { line: 'echo "${{sv}:-{w}}"', why: ":- gives a default." },
    { line: 'echo "${{sv}/{w}/{L}}"', why: "/ replaces text." },
    { line: 'if [[ ${v} -gt {n} ]]; then echo "{w}"; fi', why: "-gt means greater than." },
    { line: "if (( {v} == {n} )); then {u}=0; fi", why: "(( )) compares numbers." },
    { line: "elif [[ ${v} -lt {d} ]]; then", why: "elif tries another test." },
    { line: 'if [[ -z ${sv} ]]; then {sv}="{w}"; fi', why: "-z means empty." },
    { line: 'if [[ ${sv} == "{w}" ]]; then echo "match"; fi', why: "== compares text." },
    { line: '[[ -f {sv}.txt ]] && echo "found"', why: "&& runs only after a success." },
    { line: "[[ -d {arr} ]] || mkdir {arr}", why: "|| runs only after a failure." },
    { line: 'case ${sv} in {w}) echo "yes" ;; *) echo "no" ;; esac', why: "case matches patterns." },
    { line: "for i in {1..{n}}; do (( {v} += i )); done", why: "{1..n} writes out the list." },
    { line: 'for (( i = 0; i < {n}; i++ )); do echo "$i"; done', why: "A counting loop." },
    { line: "while (( {v} > 0 )); do (( {v}-- )); done", why: "while repeats while true." },
    { line: "until (( {v} >= {n} )); do (( {v}++ )); done", why: "until repeats until true." },
    { line: 'for {sv} in {w} {L}; do echo "${sv}"; done', why: "for takes each word." },
    { line: "{arr}=({n} {n2} {n3})", why: "Round brackets make an array." },
    { line: "{arr}+=({n})", why: "+=( ) adds to the end." },
    { line: 'echo "${#{arr}[@]}"', why: "${#list[@]} counts items." },
    { line: 'echo "${{arr}[0]}"', why: "Counting starts at 0." },
    { line: 'for x in "${{arr}[@]}"; do (( {v} += x )); done', why: "\"${list[@]}\" gives every item." },
    { line: 'echo "${{arr}[*]}"', why: "[*] joins the items into one line." },
    { line: "unset '{arr}[{d}]'", why: "unset removes one item." },
    { line: "declare -A {m}=([{w}]={n})", why: "declare -A makes a dictionary." },
    { line: "{m}[{w}]={n}", why: "Store a value under a name." },
    { line: 'echo "${{m}[{w}]}"', why: "Look a value up by name." },
    { line: 'for key in "${!{m}[@]}"; do echo "$key"; done', why: "${!…[@]} lists the keys." },
    { line: '{f}() { echo "{w}"; }', why: "A function is a named command." },
    { line: "{f}() {", why: "A function's body starts with {." },
    { line: "local {v}=${1:-{n}}", why: "local stays inside the function." },
    { line: '{f} "{w}"', why: "Call a function like a command." },
    { line: "{v}=$({f} {n})", why: "$( ) catches what it prints." },
    { line: '{f} || echo "{f} failed"', why: "|| reacts to a failure." },
    { line: "exit {d}", why: "exit ends the script with a code." },
    { line: 'echo "{w}" > {sv}.txt', why: "> writes a file." },
    { line: 'echo "{w}" >> {sv}.txt', why: ">> adds to the end." },
    { line: 'while read -r line; do echo "$line"; done < {sv}.txt', why: "read -r takes one line per lap." },
    { line: "read -r {sv} < {w}.txt", why: "< feeds a file in." },
    { line: "{v}=$(wc -l < {sv}.txt)", why: "wc -l counts lines." },
    { line: 'grep -c "{w}" {sv}.txt', why: "grep -c counts matching lines." },
    { line: "sort {sv}.txt | uniq -c", why: "| pipes one tool into the next." },
    { line: "cut -d, -f{d} {sv}.csv", why: "cut takes a column." },
    { line: 'for file in {sv}/*.txt; do echo "$file"; done', why: "A glob matches file names." },
    { line: "mkdir -p {sv}/{arr}", why: "-p makes missing parent folders." },
    { line: "trap 'rm -f {sv}.tmp' EXIT", why: "trap cleans up at the end." },
    { line: "printf '%-{d}s|\\n' \"${sv}\"", why: "%-8s pads text to a width." }
  ];
  var themes = [
    { name: "Echo & Print", t: [0, 1, 2, 3, 63] },
    { name: "Variables", t: [4, 5, 6, 1, 2] },
    { name: "Math Moves", t: [7, 8, 9, 10, 14] },
    { name: "Number Tools", t: [11, 12, 13, 7, 3] },
    { name: "Text Tricks", t: [15, 16, 17, 18, 19] },
    { name: "Trim & Replace", t: [20, 19, 18, 16, 15] },
    { name: "Decisions", t: [21, 22, 23, 24, 25] },
    { name: "And & Or", t: [26, 27, 50, 21, 24] },
    { name: "Case", t: [28, 25, 24, 5, 0] },
    { name: "Loops", t: [29, 30, 31, 32, 33] },
    { name: "Arrays", t: [34, 35, 36, 37, 38] },
    { name: "Array Tools", t: [39, 40, 38, 35, 34] },
    { name: "Dictionaries", t: [41, 42, 43, 44, 4] },
    { name: "Functions", t: [45, 46, 47, 48, 49] },
    { name: "Exit Codes", t: [50, 51, 47, 26, 27] },
    { name: "Files In & Out", t: [52, 53, 54, 55, 56] },
    { name: "Pipes & Tools", t: [57, 58, 59, 56, 54] },
    { name: "Files & Folders", t: [60, 61, 62, 26, 27] },
    { name: "Mixed Practice", t: [8, 21, 38, 43, 49] },
    { name: "Bash Masters", t: [29, 44, 47, 54, 62] }
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
    sandboxNote: "Thirty everyday Bash lines, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your Bash progress is saved separately from every other track.",
    sourcesHTML: 'Bash facts and syntax follow the <a href="https://www.gnu.org/software/bash/manual/">GNU Bash Reference Manual</a>, with habits from the <a href="https://www.shellcheck.net/wiki/">ShellCheck wiki</a>. Every explanation is written in Code Block’s own words, and every practice program is run by real Bash and passes ShellCheck before it ships.'
  };
});
