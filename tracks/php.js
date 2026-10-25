"use strict";
/* ================= PHP — a Code Block track =================
   Written fresh for Code Block in plain words. Facts and syntax follow
   the PHP Manual (php.net/manual, PHP 8.3) and the PSR-12 / PER coding
   style. Every PC project and library example is run by the real PHP
   interpreter in tests/content with every error, warning, notice and
   deprecation switched on — any of them fails the check — and a
   project's output must match the app. Every drill and Vault line is
   linted by PHP's own parser (php -l). */
cbRegisterTrack("php", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Echo Block", short: "echo", chapter: "PHP Ch. 1 · First Steps", icon: "i-say", verb: "say",
      line: 'echo "Hello, world!";',
      explain: "echo sends text out — to the browser on a website, or to the terminal when you run php main.php. Every statement ends with a semicolon." },
    { name: "Variable Block", short: "$score", chapter: "PHP Ch. 2 · Variables and Types", icon: "i-tag", verb: "store",
      line: "$score = 0;",
      explain: "Every PHP variable starts with a dollar sign. There's no type to declare: PHP works out that 0 is an int." },
    { name: "String Variable Block", short: "$name", chapter: "PHP Ch. 2 · Variables and Types", icon: "i-link", verb: "name",
      line: '$name = "Ana";',
      explain: "Text goes in quotes. Other everyday types are float (4.99), bool (true or false) and null (nothing at all)." },
    { name: "Const Block", short: "const", chapter: "PHP Ch. 2 · Variables and Types", icon: "i-lock", verb: "fix",
      line: "const MAX_LIVES = 3;",
      explain: "A constant has no dollar sign and can never change. Constant names are written in CAPITALS by habit." },
    { name: "Inspect Block", short: "var_dump", chapter: "PHP Ch. 2 · Variables and Types", icon: "i-eye", verb: "inspect",
      line: "var_dump($score);",
      explain: "var_dump shows a value and its type, like int(0) or string(3) \"Ana\". It's the quickest way to see what a variable really holds." },
    { name: "Divide Block", short: "/", chapter: "PHP Ch. 3 · Operators and Math", icon: "i-calc", verb: "divide",
      line: "$avg = $total / $count;",
      explain: "/ always divides properly: 7 / 2 is 3.5. For a whole-number answer use intdiv(7, 2), which is 3, and % for the remainder." },
    { name: "Interpolation Block", short: "\"$name\"", chapter: "PHP Ch. 4 · Strings", icon: "i-brackets", verb: "fill",
      line: '$greeting = "Hi, $name!";',
      explain: "Inside double quotes, PHP replaces $name with its value. Single quotes keep everything exactly as typed." },
    { name: "String Function Block", short: "strtoupper", chapter: "PHP Ch. 4 · Strings", icon: "i-stamp", verb: "shout",
      line: "echo strtoupper($name);",
      explain: "PHP has hundreds of built-in string functions: strtoupper, strlen, str_repeat, str_contains, substr, trim and more." },
    { name: "Printf Block", short: "printf", chapter: "PHP Ch. 4 · Strings", icon: "i-pencil", verb: "format",
      line: 'printf("%s has %d coins\\n", $name, $coins);',
      explain: "printf fills each % code in order: %s takes text, %d a whole number, %.2f a number with two decimals. \\n starts a new line." },
    { name: "If Block", short: "if", chapter: "PHP Ch. 5 · Decisions", icon: "i-fork", verb: "decide",
      line: 'if ($hp <= 0) { echo "Game over"; }',
      explain: "if runs its block only when the test is true. Add elseif for more tests and else for everything left." },
    { name: "Strict Equality Block", short: "===", chapter: "PHP Ch. 5 · Decisions", icon: "i-check", verb: "compare",
      line: 'if ($a === $b) { echo "same"; }',
      explain: "=== checks that the value AND the type match. == converts types first, so 0 == \"0\" is true. Prefer === to avoid surprises." },
    { name: "Match Block", short: "match", chapter: "PHP Ch. 5 · Decisions", icon: "i-toggle", verb: "pick",
      line: '$size = match (true) { $n > 10 => "big", default => "small" };',
      explain: "match picks the first arm whose condition matches and gives back its value. It compares with ===, and default covers the rest." },
    { name: "For Block", short: "for", chapter: "PHP Ch. 6 · Loops", icon: "i-repeat", verb: "count",
      line: "for ($i = 0; $i < 5; $i++) { echo $i; }",
      explain: "A for loop has a start, a test and a step. This one echoes 0 to 4." },
    { name: "Foreach Block", short: "foreach", chapter: "PHP Ch. 6 · Loops", icon: "i-list", verb: "walk",
      line: "foreach ($scores as $score) { echo $score; }",
      explain: "foreach walks through every item of an array, putting each one in $score in turn. It's the loop PHP code uses most." },
    { name: "Array Block", short: "[ ]", chapter: "PHP Ch. 7 · Arrays", icon: "i-boxes", verb: "line up",
      line: "$scores = [10, 20, 30];",
      explain: "Square brackets make an array, PHP's one-size-fits-all list. Positions count from 0: $scores[0] is 10." },
    { name: "Append Block", short: "$a[] =", chapter: "PHP Ch. 7 · Arrays", icon: "i-plus-square", verb: "grow",
      line: "$scores[] = 40;",
      explain: "Empty brackets on the left add a new item to the end of the array. count($scores) is now 4." },
    { name: "Associative Array Block", short: "\"key\" =>", chapter: "PHP Ch. 8 · Associative Arrays", icon: "i-folder", verb: "label",
      line: '$ages = ["Ana" => 12, "Leo" => 11];',
      explain: "An array can use names as keys. => links each key to its value; $ages[\"Ana\"] is 12." },
    { name: "Null Coalescing Block", short: "??", chapter: "PHP Ch. 8 · Associative Arrays", icon: "i-shield-check", verb: "default",
      line: '$age = $ages["Mia"] ?? 0;',
      explain: "?? gives the value on the left if it exists and isn't null, and the default on the right otherwise — no warning about a missing key." },
    { name: "Function Block", short: "function", chapter: "PHP Ch. 9 · Functions", icon: "i-play-circle", verb: "build",
      line: "function add(int $a, int $b): int { return $a + $b; }",
      explain: "Type declarations say what goes in and what comes out. With declare(strict_types=1); PHP refuses the wrong types instead of converting them." },
    { name: "Arrow Function Block", short: "fn", chapter: "PHP Ch. 9 · Functions", icon: "i-lambda", verb: "point",
      line: "$double = fn($x) => $x * 2;",
      explain: "fn makes a short, unnamed function that returns the expression after =>. $double(21) is 42." },
    { name: "Filter Block", short: "array_filter", chapter: "PHP Ch. 10 · Array Functions", icon: "i-funnel", verb: "keep",
      line: "$evens = array_filter($nums, fn($n) => $n % 2 === 0);",
      explain: "array_filter keeps only the items the function says yes to. array_map transforms every item instead." },
    { name: "Spaceship Block", short: "<=>", chapter: "PHP Ch. 10 · Array Functions", icon: "i-swap-h", verb: "sort",
      line: 'usort($players, fn($a, $b) => $b["score"] <=> $a["score"]);',
      explain: "usort sorts with your own comparison. The spaceship operator <=> gives -1, 0 or 1, so swapping $a and $b sorts highest first." },
    { name: "Class Block", short: "class", chapter: "PHP Ch. 11 · Classes and Objects", icon: "i-layers", verb: "design",
      line: "class Player { public int $hp = 100; }",
      explain: "A class is a blueprint. Properties hold each object's data; public means code outside the class can read them." },
    { name: "New Block", short: "new", chapter: "PHP Ch. 11 · Classes and Objects", icon: "i-cube", verb: "build",
      line: "$hero = new Player();",
      explain: "new builds an object from the blueprint. Reach its properties and methods with an arrow: $hero->hp." },
    { name: "Extends Block", short: "extends", chapter: "PHP Ch. 12 · Inheritance and Interfaces", icon: "i-tree", verb: "inherit",
      line: "class Wizard extends Player {}",
      explain: "extends makes a child class: a Wizard gets everything a Player has, and can add or change methods." },
    { name: "Interface Block", short: "interface", chapter: "PHP Ch. 12 · Inheritance and Interfaces", icon: "i-shapes", verb: "promise",
      line: "interface Shape { public function area(): float; }",
      explain: "An interface lists methods a class promises to have. class Circle implements Shape must then define area()." },
    { name: "Try Block", short: "try/catch", chapter: "PHP Ch. 13 · Errors and Exceptions", icon: "i-shield-alert", verb: "catch",
      line: "try { risky(); } catch (Exception $e) { echo $e->getMessage(); }",
      explain: "If code inside try throws an exception, PHP jumps to catch instead of crashing. getMessage() explains what went wrong." },
    { name: "JSON Block", short: "json_decode", chapter: "PHP Ch. 14 · Files and JSON", icon: "i-file", verb: "decode",
      line: "$data = json_decode($json, true);",
      explain: "json_decode turns JSON text into PHP values; true asks for arrays instead of objects. json_encode goes the other way." },
    { name: "Escape Block", short: "htmlspecialchars", chapter: "PHP Ch. 15 · PHP on the Web", icon: "i-shield-check", verb: "escape",
      line: "echo htmlspecialchars($comment);",
      explain: "Always escape text from users before putting it in a page. htmlspecialchars turns < and > into harmless &lt; and &gt;, so nobody can inject scripts." },
    { name: "Namespace Block", short: "namespace", chapter: "PHP Ch. 16 · Modern PHP and Composer", icon: "i-grid", verb: "organize",
      line: "namespace App\\Models;",
      explain: "A namespace is a folder-like name for your classes, so App\\Models\\User never clashes with someone else's User class." }
  ];

  var H = ["<?php", "", "declare(strict_types=1);", ""];
  var chapters = [
    { title: "First Steps", chapter: "Start here · <?php, echo, running PHP", line: 'echo "Hello, world!";',
      content: {
        story: ["PHP powers a huge share of the web: WordPress, Wikipedia, Facebook's early years and millions of online shops are built with it. It runs on the web server, builds a page, and sends the finished HTML to the browser.",
          "A PHP file starts with <?php. echo sends text out. Statements end with a semicolon, and \\n inside double quotes starts a new line when you run PHP in a terminal.",
          "Install PHP from php.net (or use a bundle such as XAMPP or Laravel Herd), save the code as main.php, and type php main.php. For a website, php -S localhost:8000 starts a small built-in web server."],
        big: "A PHP file starts with <?php, echo sends text out, and php main.php runs it — on a server it builds web pages.",
        caption: "A request arrives, PHP builds the page, and HTML flies back to the browser. Tap Play.",
        demo: ["$ php main.php", "<?php", "echo \"Hello, world!\";", "Hello, world!"]
      },
      deep: {
        more: ["declare(strict_types=1); at the top of a file makes PHP refuse the wrong types instead of quietly converting them. Every example in this track uses it — modern PHP projects do too.",
          "Files that are only PHP leave out the closing ?> tag. It's optional, and leaving it out avoids accidental blank lines in the output."],
        ex: { code: src(H.concat(["// My first PHP program", "echo \"Hello, world!\\n\";", "echo \"I am learning PHP.\\n\";", "echo 2 + 3, \"\\n\";"])),
          walk: ["Line 1: every PHP file starts with <?php.", "Line 3: strict types — PHP will check types carefully.", "Line 5: a comment, skipped by PHP.", "Lines 6–7: two lines of text.", "Line 8: echo can take several values separated by commas: 5, then a new line."] },
        mistake: "Forgetting a semicolon. PHP reports “syntax error, unexpected …” on the NEXT line, because that's where it noticed. Look at the end of the line above."
      } },
    { title: "Variables and Types", chapter: "Boxes · $variables, int, float, string, bool, null", line: "$score = 0;",
      content: {
        story: ["A variable is a named box, and in PHP every variable name starts with $: $score = 0;. You don't declare a type — PHP works it out from the value, and a variable can later hold something different.",
          "The everyday types are int (whole numbers), float (decimals), string (text), bool (true or false) and null (no value). var_dump shows a value with its type, which is perfect for checking.",
          "Constants never change: const MAX_LIVES = 3; or define(\"MAX_LIVES\", 3);. They have no $. Names are case-sensitive: $score and $Score are different boxes."],
        big: "Variables start with $, PHP works out their type, var_dump shows it, and constants have no $ and never change.",
        caption: "Five boxes, each with a $ label and a type tag that appears when you look inside. Tap Play.",
        demo: ["$score = 0  → int", "$price = 4.99  → float", "$name = \"Ana\"  → string", "$alive = true  → bool"]
      },
      deep: {
        more: ["Reading a variable that was never set gives a warning (“Undefined variable”) and the value null. Turn warnings on while learning — they point straight at typos.",
          "gettype($x) returns the type's name as text, and is_int, is_string, is_array and friends test for one type."],
        ex: { code: src(H.concat(["$score = 0;", "$price = 4.99;", "$name = \"Ana\";", "$alive = true;", "$nothing = null;", "const MAX_LIVES = 3;", "$score = $score + 10;", "echo \"$name has $score points and \", MAX_LIVES, \" lives\\n\";", "var_dump($score, $price, $name, $alive, $nothing);", "echo gettype($price), \"\\n\";"])),
          walk: ["Lines 5–9: one variable of each type.", "Line 10: a constant — no $.", "Line 11: score becomes 10.", "Line 12: Ana has 10 points and 3 lives.", "Line 13: int(10), float(4.99), string(3) \"Ana\", bool(true), NULL.", "Line 14: double — PHP's internal name for float."] },
        mistake: "Forgetting the $: score = 10; is read as a constant called score, and PHP stops with an error. Every variable needs its $."
      } },
    { title: "Operators and Math", chapter: "Calculating · + - * / % **, intdiv, round", line: "$avg = $total / $count;",
      content: {
        story: ["PHP does maths with + - * / % and ** (power: 2 ** 10 is 1024). Division always gives the exact answer: 7 / 2 is 3.5. intdiv(7, 2) gives the whole-number part, 3, and 7 % 2 gives the remainder, 1.",
          "The dot joins text: \"Level \" . 3 makes \"Level 3\". Don't mix them up — + is only for numbers.",
          "Shortcuts change a variable in place: $hp -= 30, $score *= 2, $lives++ and $lives--. round, floor, ceil, abs, max and min are built in."],
        big: "/ gives exact answers, intdiv and % give whole parts and remainders, and the dot (not +) joins text.",
        caption: "7 divided two ways: 3.5 with /, then 3 remainder 1 with intdiv and %. Tap Play.",
        demo: ["7 / 2 → 3.5", "intdiv(7, 2) → 3", "7 % 2 → 1", "\"Lv \" . 3 → \"Lv 3\""]
      },
      deep: {
        more: ["echo prints a float without a needless .0: echo 74.0; shows 74. Use number_format or printf when you want a fixed number of decimals.",
          "Decimal maths is approximate on every computer: 0.1 + 0.2 is 0.30000000000000004 inside, though echo rounds it to 0.3. For money, count whole cents."],
        ex: { code: src(H.concat(["echo 7 / 2, \"\\n\";", "echo intdiv(7, 2), \" remainder \", 7 % 2, \"\\n\";", "echo 2 ** 10, \"\\n\";", "$hp = 100;", "$hp -= 30;", "$hp++;", "echo \"HP: \" . $hp . \"\\n\";", "echo round(3.14159, 2), \" \", max(3, 9, 4), \" \", abs(-5), \"\\n\";", "echo number_format(1234.5, 2), \"\\n\";"])),
          walk: ["Line 5: exact division: 3.5.", "Line 6: 3 remainder 1.", "Line 7: 1024.", "Lines 8–11: 100 − 30 + 1, joined to text with dots: HP: 71.", "Line 12: 3.14 9 5.", "Line 13: number_format adds a thousands comma and two decimals: 1,234.50."] },
        mistake: "Joining text with +: \"Score: \" + $score tries to add numbers and stops with an error. Use the dot: \"Score: \" . $score."
      } },
    { title: "Strings", chapter: "Text · quotes, interpolation, heredoc, string functions, printf", line: '$greeting = "Hi, $name!";',
      content: {
        story: ["Strings can use single or double quotes. Inside \"double quotes\", variables are replaced by their values and \\n means a new line. Inside 'single quotes', everything stays exactly as typed.",
          "For anything more than a simple variable, use braces: \"{$player->name} has {$scores[0]}\". A heredoc (<<<TEXT … TEXT;) holds several lines of text with variables filled in.",
          "PHP's string toolbox is huge: strlen, strtoupper, ucfirst, str_repeat, str_contains, str_replace, substr, trim, explode (split) and implode (join). printf and sprintf format text with codes like %s, %d and %.2f."],
        big: "Double quotes fill in variables, single quotes don't; a large toolbox of string functions and printf handles the rest.",
        caption: "A sentence with gaps; $name slides into the double-quoted one and stays as text in the single-quoted one. Tap Play.",
        demo: ["\"Hi, $name\" → Hi, Ana", "'Hi, $name' → Hi, $name", "strtoupper($name) → ANA", "sprintf(\"%05d\", 42) → 00042"]
      },
      deep: {
        more: ["strlen counts bytes, not letters: strlen(\"é\") is 2. The mb_ functions (mb_strlen, mb_strtoupper) count real characters in any language.",
          "Strings can be read like arrays: $name[0] is the first byte, and $name[-1] the last."],
        ex: { code: src(H.concat(["$name = \"Ana\";", "$coins = 42;", "echo \"Hi, $name!\\n\";", "echo 'Hi, $name!', \"\\n\";", "printf(\"%s has %d coins (%.1f%%)\\n\", $name, $coins, 12.345);", "echo strtoupper($name), \" \", strlen($name), \" \", str_repeat(\"ha\", 3), \"\\n\";", "echo str_contains(\"gameover\", \"over\") ? \"found\\n\" : \"missing\\n\";", "$parts = explode(\",\", \"red,green,blue\");", "echo implode(\" | \", $parts), \"\\n\";", "$card = <<<TEXT", "Player: $name", "Coins: $coins", "TEXT;", "echo $card, \"\\n\";"])),
          walk: ["Line 7: Hi, Ana!", "Line 8: single quotes keep $name as plain text.", "Line 9: Ana has 42 coins (12.3%) — %% prints a percent sign.", "Line 10: ANA 3 hahaha.", "Line 11: found.", "Lines 12–13: split on commas, join with bars: red | green | blue.", "Lines 14–18: a heredoc keeps the lines and fills in the variables."] },
        mistake: "Writing \"$player->name's sword\" or \"$scores[0]th\" and getting odd results. Wrap anything complicated in braces: \"{$player->name}'s sword\"."
      } },
    { title: "Decisions", chapter: "Choosing · if, elseif, ===, match, switch", line: 'if ($hp <= 0) { echo "Game over"; }',
      content: {
        story: ["if runs code only when a test is true. Add elseif for more tests and else for the rest. Tests use === (identical), !== (not identical), < > <= >=, and combine with && (and), || (or) and ! (not).",
          "PHP has two kinds of equals. == converts types before comparing, so 0 == \"0\" is true. === also checks the type, so 0 === \"0\" is false. Use === unless you have a reason not to.",
          "match (PHP 8) picks the first arm that matches and gives back its value: $label = match ($day) { \"Sat\", \"Sun\" => \"weekend\", default => \"school\" };. It compares strictly and complains if nothing matches and there's no default."],
        big: "if/elseif/else choose a path, === compares value and type, and match picks a value from a list of arms.",
        caption: "A path forks at $hp <= 0: one way says Game over, the other keeps going. Tap Play.",
        demo: ["$hp = 0", "if ($hp <= 0) → true", "Game over", "match → picks one arm"]
      },
      deep: {
        more: ["The older switch statement also exists. It compares loosely with == and needs break after each case — match is usually the better choice in new code.",
          "The ternary operator picks between two values: $mood = $hp > 50 ? \"brave\" : \"careful\";."],
        ex: { code: src(H.concat(["$hp = 0;", "if ($hp <= 0) {", "    echo \"Game over\\n\";", "} elseif ($hp < 20) {", "    echo \"Careful!\\n\";", "} else {", "    echo \"Keep going\\n\";", "}", "var_dump(0 == \"0\", 0 === \"0\");", "$day = \"Sun\";", "$label = match ($day) {", "    \"Sat\", \"Sun\" => \"weekend\",", "    default => \"school day\",", "};", "echo $label, \"\\n\";", "$score = 85;", "echo match (true) {", "    $score >= 90 => \"A\",", "    $score >= 80 => \"B\",", "    default => \"Keep practicing\",", "}, \"\\n\";"])),
          walk: ["Lines 5–12: $hp is 0, so Game over.", "Line 13: bool(true) then bool(false) — == converts, === doesn't.", "Lines 15–19: match gives back weekend.", "Lines 21–25: match (true) checks each condition in order: B."] },
        mistake: "Using = in a test: if ($hp = 0) assigns 0, which counts as false, so the block never runs. Compare with ===."
      } },
    { title: "Loops", chapter: "Repeating · for, while, foreach, break, continue", line: "foreach ($scores as $score) { echo $score; }",
      content: {
        story: ["for ($i = 0; $i < 3; $i++) { … } counts with a start, a test and a step. while ($lives > 0) { … } repeats as long as a test is true.",
          "foreach is the loop PHP code uses most: foreach ($scores as $score) visits every item of an array. foreach ($ages as $name => $age) gives each key and value.",
          "break leaves a loop early and continue skips to the next round. range(1, 5) makes the array [1, 2, 3, 4, 5], handy for foreach."],
        big: "for counts, while repeats while true, and foreach walks every item — with keys if you ask for them.",
        caption: "A counter goes round the track, then a cursor walks along an array one item at a time. Tap Play.",
        demo: ["for ($i = 0; $i < 3; $i++)", "foreach ($scores as $s)", "foreach ($ages as $k => $v)", "break → out"]
      },
      deep: {
        more: ["A do { … } while (…); loop always runs at least once — handy for menus.",
          "Changing an array while looping over it is confusing. Build a new array instead, or use the array functions in chapter 10."],
        ex: { code: src(H.concat(["for ($i = 0; $i < 3; $i++) {", "    echo \"lap $i\\n\";", "}", "$lives = 3;", "while ($lives > 0) {", "    $lives--;", "}", "echo \"lives: $lives\\n\";", "foreach ([\"apple\", \"pear\", \"plum\"] as $fruit) {", "    if ($fruit === \"pear\") {", "        continue;", "    }", "    echo $fruit, \"\\n\";", "}", "foreach ([\"Ana\" => 12, \"Leo\" => 11] as $name => $age) {", "    echo \"$name is $age\\n\";", "}", "echo implode(\" \", range(1, 5)), \"\\n\";"])),
          walk: ["Lines 5–7: lap 0, lap 1, lap 2.", "Lines 8–12: lives: 0.", "Lines 13–18: continue skips pear: apple, plum.", "Lines 19–21: keys and values: Ana is 12, Leo is 11.", "Line 22: range makes 1 2 3 4 5."] },
        mistake: "Writing foreach ($score as $scores), with the names swapped. The array goes first, then as, then the name for each item."
      } },
    { title: "Arrays", chapter: "Lists · [ ], count, $a[] =, sort, in_array", line: "$scores = [10, 20, 30];",
      content: {
        story: ["An array holds many values in order: $scores = [10, 20, 30];. Positions count from 0, so $scores[0] is 10. count($scores) says how many there are.",
          "$scores[] = 40; adds to the end, array_pop removes the last item, and array_unshift adds to the front. in_array checks whether a value is there.",
          "sort puts an array in order (rsort for reverse), changing the array itself. print_r shows a whole array at once, perfect for checking."],
        big: "Arrays hold ordered values counted from 0; $a[] = adds, count counts, sort sorts, print_r shows it all.",
        caption: "A row of numbered boxes grows by one, then sorts itself into order. Tap Play.",
        demo: ["$scores = [30, 10, 20]", "$scores[] = 40", "sort($scores)", "[10, 20, 30, 40]"]
      },
      deep: {
        more: ["PHP arrays are flexible: one array can mix numbers and text, and keys can be numbers or names — the next chapter is all about names.",
          "Reading a position that doesn't exist gives a warning and null. Check with isset($scores[9]) first, or use ?? for a default."],
        ex: { code: src(H.concat(["$scores = [30, 10, 20];", "$scores[] = 40;", "echo count($scores), \" scores, first is \", $scores[0], \"\\n\";", "sort($scores);", "echo implode(\", \", $scores), \"\\n\";", "var_dump(in_array(20, $scores, true));", "$last = array_pop($scores);", "echo \"popped $last, left: \", count($scores), \"\\n\";", "print_r($scores);"])),
          walk: ["Lines 5–7: add 40 to the end: 4 scores, first is 30.", "Lines 8–9: sorted: 10, 20, 30, 40.", "Line 10: bool(true) — the true asks in_array to compare strictly.", "Lines 11–12: popped 40, left: 3.", "Line 13: print_r shows every position and value."] },
        mistake: "Expecting $scores[3] to be the third item. Counting starts at 0, so the third item is $scores[2]."
      } },
    { title: "Associative Arrays", chapter: "Lookups · keys, =>, ??, isset, ksort", line: '$ages = ["Ana" => 12, "Leo" => 11];',
      content: {
        story: ["An associative array uses names as keys: $ages = [\"Ana\" => 12, \"Leo\" => 11];. Read with $ages[\"Ana\"], add or change with $ages[\"Mia\"] = 10;, remove with unset($ages[\"Mia\"]).",
          "Reading a missing key gives a warning. isset($ages[\"Zed\"]) checks first, and $ages[\"Zed\"] ?? 0 gives a default in one step.",
          "foreach ($ages as $name => $age) visits every pair. ksort sorts by key, asort by value, and array_keys / array_values pull out one side."],
        big: "Associative arrays look values up by name; ?? and isset handle missing keys; foreach gives key => value pairs.",
        caption: "A cabinet of labelled drawers; open one by its name tag, or get a default if it's missing. Tap Play.",
        demo: ["$ages[\"Ana\"] → 12", "$ages[\"Mia\"] = 10", "$ages[\"Zed\"] ?? 0 → 0", "ksort($ages)"]
      },
      deep: {
        more: ["Counting things is a classic use: $counts[$word] = ($counts[$word] ?? 0) + 1; works even the first time a word appears. array_count_values does it for a whole list.",
          "Associative arrays are how PHP holds rows from a database, form fields from a web page, and decoded JSON."],
        ex: { code: src(H.concat(["$ages = [\"Ana\" => 12, \"Leo\" => 11];", "$ages[\"Mia\"] = 10;", "$ages[\"Leo\"]++;", "echo $ages[\"Leo\"], \" \", count($ages), \"\\n\";", "echo $ages[\"Zed\"] ?? \"unknown\", \"\\n\";", "var_dump(isset($ages[\"Mia\"]));", "unset($ages[\"Mia\"]);", "ksort($ages);", "foreach ($ages as $name => $age) {", "    echo \"$name: $age\\n\";", "}", "$counts = [];", "foreach ([\"go\", \"php\", \"go\"] as $word) {", "    $counts[$word] = ($counts[$word] ?? 0) + 1;", "}", "print_r($counts);"])),
          walk: ["Lines 5–8: add Mia, add one to Leo: 12 3.", "Line 9: Zed isn't there, so ?? gives unknown.", "Line 10: bool(true).", "Lines 11–15: remove Mia, sort by name: Ana: 12, Leo: 12.", "Lines 16–20: count words: go => 2, php => 1."] },
        mistake: "Writing $ages[Ana] without quotes. PHP looks for a constant called Ana and stops with an error. Keys that are text need quotes."
      } },
    { title: "Functions", chapter: "Machines · parameters, types, defaults, named arguments, fn", line: "function add(int $a, int $b): int { return $a + $b; }",
      content: {
        story: ["function add(int $a, int $b): int { return $a + $b; } defines a function. The types before the parameters and after the colon say what goes in and comes out; with strict types on, PHP refuses anything else.",
          "Parameters can have defaults: function greet(string $name = \"friend\"). Named arguments let you skip to the one you mean: greet(name: \"Ana\").",
          "Short arrow functions, fn($x) => $x * 2, are perfect for passing a little rule to another function. They can use variables from around them automatically."],
        big: "Functions take typed parameters (with defaults and names) and return a typed value; fn makes tiny one-line functions.",
        caption: "A machine with two typed slots: ints go in, an int comes out — a string is turned away. Tap Play.",
        demo: ["function add(int $a, int $b): int", "add(2, 3) → 5", "greet() → Hi, friend", "fn($x) => $x * 2"]
      },
      deep: {
        more: ["?string means “a string or null”, and int|float accepts either. void means a function returns nothing.",
          "Variables inside a function are separate from those outside. Pass values in as parameters rather than reaching for global variables."],
        ex: { code: src(H.concat(["function add(int $a, int $b): int", "{", "    return $a + $b;", "}", "", "function greet(string $name = \"friend\", string $mark = \"!\"): string", "{", "    return \"Hi, \" . $name . $mark;", "}", "", "echo add(2, 3), \"\\n\";", "echo greet(), \"\\n\";", "echo greet(\"Ana\"), \"\\n\";", "echo greet(mark: \"?\"), \"\\n\";", "$bonus = 10;", "$addBonus = fn(int $x): int => $x + $bonus;", "echo $addBonus(5), \"\\n\";"])),
          walk: ["Lines 5–8: typed parameters and a typed result.", "Lines 10–13: defaults are used when an argument is left out.", "Line 15: 5.", "Lines 16–17: Hi, friend! and Hi, Ana!", "Line 18: a named argument skips straight to mark: Hi, friend?", "Lines 19–21: the arrow function uses $bonus from outside: 15."] },
        mistake: "Forgetting return. A function without it gives back null, so echo add(2, 3) prints nothing at all."
      } },
    { title: "Array Functions", chapter: "Pipelines · array_map, array_filter, array_reduce, usort, <=>", line: "$evens = array_filter($nums, fn($n) => $n % 2 === 0);",
      content: {
        story: ["PHP has a function for almost every array job. array_map transforms every item, array_filter keeps the items that pass a test, and array_reduce boils an array down to one value.",
          "array_sum, max, min, array_unique, array_reverse, array_slice and array_search cover the rest of everyday work.",
          "usort sorts with your own rule. The spaceship operator <=> returns -1, 0 or 1 for less, equal or more — exactly what usort wants. Swap the two sides to sort in reverse."],
        big: "array_map transforms, array_filter keeps, array_reduce combines, and usort with <=> sorts by any rule.",
        caption: "Numbers ride a conveyor: doubled at one station, filtered at the next, summed at the end. Tap Play.",
        demo: ["array_map(fn($x) => $x * 2, …)", "array_filter(…, fn($x) => $x > 4)", "array_sum(…)", "usort(…, fn($a, $b) => $a <=> $b)"]
      },
      deep: {
        more: ["array_filter keeps the original keys, so the result can have gaps like [1 => 4, 3 => 8]. Wrap it in array_values to renumber from 0.",
          "Chaining a few array functions is often clearer than a long foreach — but use whichever reads better."],
        ex: { code: src(H.concat(["$nums = [1, 2, 3, 4, 5, 6];", "$doubled = array_map(fn($n) => $n * 2, $nums);", "echo implode(\" \", $doubled), \"\\n\";", "$evens = array_values(array_filter($nums, fn($n) => $n % 2 === 0));", "echo implode(\" \", $evens), \"\\n\";", "$total = array_reduce($nums, fn($carry, $n) => $carry + $n, 0);", "echo $total, \" \", array_sum($nums), \"\\n\";", "$players = [", "    [\"name\" => \"Ana\", \"score\" => 120],", "    [\"name\" => \"Leo\", \"score\" => 150],", "    [\"name\" => \"Mia\", \"score\" => 95],", "];", "usort($players, fn($a, $b) => $b[\"score\"] <=> $a[\"score\"]);", "echo implode(\", \", array_column($players, \"name\")), \"\\n\";"])),
          walk: ["Lines 6–7: 2 4 6 8 10 12.", "Lines 8–9: keep the even ones, renumbered: 2 4 6.", "Lines 10–11: reduce and array_sum agree: 21 21.", "Lines 12–17: highest score first; array_column pulls out the names: Leo, Ana, Mia."] },
        mistake: "Mixing up the argument order: array_map takes the function first, but array_filter takes the array first. When in doubt, check the manual."
      } },
    { title: "Classes and Objects", chapter: "Blueprints · class, properties, __construct, methods, $this", line: "class Player { public int $hp = 100; }",
      content: {
        story: ["A class is a blueprint for objects. Properties hold each object's data and methods are its actions. new Player() builds an object; the arrow -> reaches inside: $hero->hp, $hero->heal(10).",
          "The constructor, __construct, runs when an object is built. Constructor promotion fills properties straight from the parameters: public function __construct(public string $name, public int $hp = 100) {}.",
          "Inside a method, $this means “this object.” private properties can only be touched inside the class, which keeps an object's data safe from careless changes."],
        big: "Classes are blueprints; new builds objects; -> reaches properties and methods; $this is the object itself.",
        caption: "A Player blueprint stamps out two heroes, each with its own name and health. Tap Play.",
        demo: ["class Player { … }", "$ana = new Player(\"Ana\")", "$ana->heal(10)", "$ana->hp → 100"]
      },
      deep: {
        more: ["readonly properties can be set once in the constructor and never changed afterwards — great for values like an id.",
          "Static methods belong to the class rather than an object: Player::create(\"Ana\")."],
        ex: { code: src(H.concat(["class Player", "{", "    private int $level = 1;", "", "    public function __construct(public string $name, public int $hp = 100)", "    {", "    }", "", "    public function hurt(int $damage): void", "    {", "        $this->hp = max(0, $this->hp - $damage);", "    }", "", "    public function levelUp(): void", "    {", "        $this->level++;", "    }", "", "    public function describe(): string", "    {", "        return \"{$this->name} (level {$this->level}, {$this->hp} HP)\";", "    }", "}", "", "$ana = new Player(\"Ana\");", "$ana->hurt(30);", "$ana->levelUp();", "echo $ana->describe(), \"\\n\";", "$leo = new Player(\"Leo\", 80);", "echo $leo->describe(), \"\\n\";"])),
          walk: ["Lines 5–27: the Player blueprint.", "Line 7: private — only Player's own methods can change the level.", "Lines 9–11: constructor promotion makes $name and $hp properties.", "Lines 13–16: $this->hp is this player's health, never below 0.", "Lines 29–32: Ana (level 2, 70 HP).", "Lines 33–34: Leo (level 1, 80 HP)."] },
        mistake: "Writing $hp inside a method when you mean the property. That's a new, empty local variable — the property is $this->hp."
      } },
    { title: "Inheritance and Interfaces", chapter: "Families · extends, parent::, abstract, interface, enum", line: "interface Shape { public function area(): float; }",
      content: {
        story: ["class Wizard extends Player makes a child class that gets everything Player has. It can add new methods and override existing ones; parent::describe() calls the parent's version.",
          "An interface is a promise: interface Shape { public function area(): float; }. A class that implements Shape must have an area method, so code can treat every Shape the same way.",
          "An abstract class is a partial blueprint that can't be built directly. Enums (PHP 8.1) list a fixed set of choices: enum Suit { case Hearts; case Spades; }."],
        big: "extends builds on a parent class, interfaces promise methods, abstract classes are partial blueprints, and enums list fixed choices.",
        caption: "A family tree: Player at the top, Wizard and Knight below, each adding a power. Tap Play.",
        demo: ["class Wizard extends Player", "parent::describe()", "class Circle implements Shape", "enum Suit { case Hearts; … }"]
      },
      deep: {
        more: ["A class can extend only one parent but implement many interfaces. Prefer small interfaces and composition over deep family trees.",
          "Backed enums carry a value: enum Status: string { case Active = 'active'; }, and Status::from('active') turns the value back into the case."],
        ex: { code: src(H.concat(["interface Shape", "{", "    public function area(): float;", "}", "", "class Rect implements Shape", "{", "    public function __construct(private float $w, private float $h)", "    {", "    }", "", "    public function area(): float", "    {", "        return $this->w * $this->h;", "    }", "}", "", "class Square extends Rect", "{", "    public function __construct(float $side)", "    {", "        parent::__construct($side, $side);", "    }", "}", "", "enum Size: string", "{", "    case Small = \"S\";", "    case Large = \"L\";", "}", "", "$shapes = [new Rect(3, 4), new Square(5)];", "foreach ($shapes as $shape) {", "    echo $shape::class, \": \", $shape->area(), \"\\n\";", "}", "echo Size::Large->value, \" \", Size::from(\"S\")->name, \"\\n\";"])),
          walk: ["Lines 5–8: the Shape promise.", "Lines 10–20: Rect keeps the promise.", "Lines 22–28: Square extends Rect and calls the parent constructor.", "Lines 30–34: a backed enum with string values.", "Lines 36–39: Rect: 12, then Square: 25.", "Line 40: L Small."] },
        mistake: "Forgetting a method an interface requires. PHP stops with “Class Rect contains 1 abstract method and must therefore be declared abstract or implement the remaining methods.”"
      } },
    { title: "Errors and Exceptions", chapter: "Safety nets · throw, try, catch, finally, TypeError", line: "try { risky(); } catch (Exception $e) { echo $e->getMessage(); }",
      content: {
        story: ["When something goes wrong, code can throw an exception: throw new InvalidArgumentException(\"Age can't be negative\");. The function stops, and PHP looks for a matching catch.",
          "try { … } catch (InvalidArgumentException $e) { … } handles the problem instead of crashing. finally runs afterwards either way — good for clean-up.",
          "PHP itself throws too: a TypeError when strict types meet the wrong type, a DivisionByZeroError for intdiv(1, 0), a JsonException when asked to. Catch the specific kinds you can actually handle."],
        big: "throw signals a problem, try/catch handles it, finally always runs, and PHP throws its own errors like TypeError.",
        caption: "A function throws a red flag; the catch net below grabs it before it hits the ground. Tap Play.",
        demo: ["throw new InvalidArgumentException(…)", "try { … }", "catch (InvalidArgumentException $e)", "finally { … }"]
      },
      deep: {
        more: ["Make your own exception types by extending Exception: class OutOfCoinsException extends Exception {}. Callers can then catch exactly that problem.",
          "Exceptions and Errors both implement Throwable. catch (Throwable $e) catches everything — useful at the very top of a program, rarely anywhere else."],
        ex: { code: src(H.concat(["class OutOfCoinsException extends Exception", "{", "}", "", "function spend(int $coins, int $price): int", "{", "    if ($price < 0) {", "        throw new InvalidArgumentException(\"price can't be negative\");", "    }", "    if ($price > $coins) {", "        throw new OutOfCoinsException(\"need $price, have $coins\");", "    }", "    return $coins - $price;", "}", "", "foreach ([30, 80, -5] as $price) {", "    try {", "        $left = spend(50, $price);", "        echo \"left: $left\\n\";", "    } catch (OutOfCoinsException $e) {", "        echo \"too expensive: \", $e->getMessage(), \"\\n\";", "    } catch (InvalidArgumentException $e) {", "        echo \"bad price: \", $e->getMessage(), \"\\n\";", "    } finally {", "        echo \"(checked $price)\\n\";", "    }", "}", "try {", "    echo intdiv(1, 0);", "} catch (DivisionByZeroError $e) {", "    echo $e->getMessage(), \"\\n\";", "}"])),
          walk: ["Lines 5–7: a custom exception type.", "Lines 9–18: two different problems, two different exceptions.", "Lines 20–31: left: 20; too expensive: need 80, have 50; bad price: price can't be negative — each followed by (checked …) from finally.", "Lines 32–36: PHP's own error: Division by zero."] },
        mistake: "Catching everything and saying nothing: catch (Exception $e) {}. The problem vanishes silently and is much harder to find later. At least log it."
      } },
    { title: "Files and JSON", chapter: "Saving · file_put_contents, file_get_contents, json_encode, json_decode", line: "$data = json_decode($json, true);",
      content: {
        story: ["file_put_contents(\"save.txt\", $text) writes a whole file in one call, and file_get_contents reads one. FILE_APPEND adds to the end instead of replacing.",
          "JSON is the common language of data on the web. json_encode turns arrays into JSON text; json_decode($json, true) turns it back into arrays. JSON_PRETTY_PRINT makes it readable.",
          "Files might be missing, so check with file_exists first. For big files, fopen and fgets read one line at a time without loading everything."],
        big: "file_put_contents and file_get_contents save and load whole files; json_encode and json_decode turn arrays into JSON and back.",
        caption: "A save game becomes JSON text, goes into a file, and comes back as an array. Tap Play.",
        demo: ["json_encode($save)", "file_put_contents(\"save.json\", …)", "file_get_contents(\"save.json\")", "json_decode(…, true)"]
      },
      deep: {
        more: ["json_decode returns null for broken JSON. Pass JSON_THROW_ON_ERROR to get a JsonException with a reason instead.",
          "__DIR__ is the folder of the current file — use it to build paths that work however the script is started: __DIR__ . \"/save.json\"."],
        ex: { code: src(H.concat(["$save = [\"name\" => \"Ana\", \"level\" => 3, \"items\" => [\"sword\", \"potion\"]];", "$json = json_encode($save, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);", "file_put_contents(\"save.json\", $json);", "", "if (file_exists(\"save.json\")) {", "    $loaded = json_decode(file_get_contents(\"save.json\"), true, 512, JSON_THROW_ON_ERROR);", "    echo $loaded[\"name\"], \" is level \", $loaded[\"level\"], \"\\n\";", "    echo \"Items: \", implode(\", \", $loaded[\"items\"]), \"\\n\";", "}", "file_put_contents(\"log.txt\", \"started\\n\");", "file_put_contents(\"log.txt\", \"saved\\n\", FILE_APPEND);", "echo file_get_contents(\"log.txt\");"])),
          walk: ["Lines 5–7: turn the array into pretty JSON and save it.", "Lines 9–13: read it back as an array: Ana is level 3, Items: sword, potion.", "Lines 14–16: write, then append a line, then print the file: started, saved."] },
        mistake: "Forgetting the true in json_decode. Without it you get objects, so $loaded[\"name\"] fails — it would have to be $loaded->name."
      } },
    { title: "PHP on the Web", chapter: "Pages · $_GET, $_POST, forms, htmlspecialchars, sessions", line: "echo htmlspecialchars($comment);",
      content: {
        story: ["On a web server, PHP builds a page for every request. Values from the address bar (page.php?name=Ana) arrive in $_GET; values from a submitted form arrive in $_POST.",
          "Never trust them. Anything a user typed must be escaped before it goes into a page: htmlspecialchars turns <script> into harmless text. Forgetting this lets attackers inject scripts — cross-site scripting (XSS).",
          "session_start() and $_SESSION remember a visitor between pages (like who's logged in), and header(\"Location: /done.php\") sends the browser to another page."],
        big: "$_GET and $_POST bring in user input; always escape it with htmlspecialchars before showing it; sessions remember visitors.",
        caption: "A form sends a sneaky <script>; htmlspecialchars turns it into plain, harmless text on the page. Tap Play.",
        demo: ["page.php?name=Ana", "$_GET[\"name\"] → \"Ana\"", "htmlspecialchars(…)", "<h1>Hello, Ana!</h1>"]
      },
      deep: {
        more: ["Run php -S localhost:8000 in a folder and open the address in a browser — PHP's built-in server is perfect for learning. Real sites use a web server such as Apache or nginx.",
          "Frameworks like Laravel and Symfony handle routing, forms, security and databases for you. They're the usual next step after plain PHP."],
        ex: { code: src(H.concat(["function renderGreeting(array $query): string", "{", "    $name = trim($query[\"name\"] ?? \"\");", "    if ($name === \"\") {", "        $name = \"friend\";", "    }", "    $safe = htmlspecialchars($name, ENT_QUOTES, \"UTF-8\");", "    return \"<h1>Hello, $safe!</h1>\";", "}", "", "// On a server, PHP fills $_GET from the address: page.php?name=Ana", "echo renderGreeting([\"name\" => \"Ana\"]), \"\\n\";", "echo renderGreeting([\"name\" => \"<script>alert(1)</script>\"]), \"\\n\";", "echo renderGreeting([]), \"\\n\";"])),
          walk: ["Lines 5–13: build a heading from the query, always escaping the name.", "Line 15: on a real server you would pass $_GET.", "Line 16: <h1>Hello, Ana!</h1>.", "Line 17: the script becomes harmless text: &lt;script&gt;alert(1)&lt;/script&gt;.", "Line 18: no name given: <h1>Hello, friend!</h1>."] },
        mistake: "Echoing user input straight into a page: echo \"Hi \" . $_GET[\"name\"];. Anyone can send a link that runs their script on your site. Escape every time."
      } },
    { title: "Modern PHP and Composer", chapter: "Real projects · namespaces, use, Composer, autoloading, PSR", line: "namespace App\\Models;",
      content: {
        story: ["Big PHP projects put each class in its own file, organized by namespace: namespace App\\Models; at the top of src/Models/User.php. Other files bring it in with use App\\Models\\User;.",
          "Composer is PHP's package manager. composer require monolog/monolog downloads a library into the vendor folder, and require 'vendor/autoload.php'; loads any class the moment it's first used.",
          "Shared standards keep code familiar: PSR-4 says how namespaces map to folders, and PSR-12/PER says how to format code. Tools like PHPStan find bugs and PHPUnit runs tests."],
        big: "Namespaces organize classes, use brings them in, Composer installs libraries and autoloads them, and PSR standards keep code consistent.",
        caption: "A project folder opens: composer.json on top, src/ by namespace, vendor/ filled by Composer. Tap Play.",
        demo: ["$ composer init", "namespace App\\Models;", "use App\\Models\\User;", "require 'vendor/autoload.php';"]
      },
      deep: {
        more: ["Modern PHP has features worth reaching for: match, enums, readonly properties, named arguments, the nullsafe operator ?-> and first-class callables like strlen(...).",
          "Keep PHP up to date: each version is faster and supported with security fixes for a few years. php.net lists the supported versions."],
        ex: { code: src(["<?php", "", "declare(strict_types=1);", "", "namespace App\\Models;", "", "final class User", "{", "    public function __construct(", "        public readonly int $id,", "        public readonly string $name,", "        public readonly ?string $email = null,", "    ) {", "    }", "", "    public function emailDomain(): ?string", "    {", "        return $this->email === null ? null : substr($this->email, strpos($this->email, \"@\") + 1);", "    }", "}", "", "$ana = new User(1, \"Ana\", \"ana@example.com\");", "$leo = new User(id: 2, name: \"Leo\");", "echo User::class, \"\\n\";", "echo $ana->emailDomain() ?? \"none\", \" \", $leo->emailDomain() ?? \"none\", \"\\n\";", "$lengths = array_map(strlen(...), [$ana->name, $leo->name]);", "echo implode(\",\", $lengths), \"\\n\";"]),
          walk: ["Line 5: this file's classes live in App\\Models.", "Lines 7–20: readonly properties are set once by the constructor.", "Lines 22–23: positional and named arguments.", "Line 24: the class's full name: App\\Models\\User.", "Line 25: example.com none.", "Lines 26–27: strlen(...) passes a function as a value: 3,3."] },
        mistake: "Changing a readonly property: $ana->name = \"Bo\"; stops with “Cannot modify readonly property.” Make a new object instead."
      } }
  ];

  var shelves = [
    { title: "Standard Library Field Guide", chapter: "Beyond the basics · PHP shelf", line: ["str_contains($text, \"php\")", "array_key_exists(\"name\", $row)"],
      content: {
        story: ["PHP comes with thousands of built-in functions, grouped in the manual by topic: strings (str_*), arrays (array_*), maths, dates (DateTimeImmutable), JSON, files and more.",
          "Their names and argument orders aren't always consistent — even experts check php.net. Every function's page has examples and user notes.",
          "Newer helpers are often the clearest: str_contains, str_starts_with and str_ends_with (PHP 8), array_is_list, and the mb_ functions for text in any language."],
        big: "php.net documents every built-in function by topic; check it before writing your own.",
        caption: "A workshop wall of labelled toolboxes: str_, array_, math, date. Tap Play.",
        demo: ["str_starts_with($u, \"https\")", "array_unique($tags)", "number_format(1234.5, 2)", "ucfirst(\"ana\")"]
      },
      deep: {
        more: ["array_key_exists checks whether a key exists even when its value is null; isset treats null as missing.",
          "Functions that change an array in place, like sort, return true or false — not the sorted array. Don't write $sorted = sort($a);."],
        ex: { code: src(H.concat(["$url = \"https://example.com/games\";", "var_dump(str_starts_with($url, \"https\"), str_ends_with($url, \".php\"));", "echo ucfirst(\"ana\"), \" \", ucwords(\"hello brave world\"), \"\\n\";", "echo str_pad(\"7\", 3, \"0\", STR_PAD_LEFT), \" \", str_replace(\"-\", \" \", \"a-b-c\"), \"\\n\";", "$tags = [\"php\", \"web\", \"php\", \"code\"];", "echo implode(\",\", array_unique($tags)), \"\\n\";", "echo implode(\",\", array_slice([10, 20, 30, 40], 1, 2)), \"\\n\";", "$row = [\"name\" => \"Ana\", \"team\" => null];", "var_dump(isset($row[\"team\"]), array_key_exists(\"team\", $row));", "echo floor(4.7), \" \", ceil(4.2), \" \", mb_strlen(\"héllo\"), \" \", strlen(\"héllo\"), \"\\n\";"])),
          walk: ["Line 6: bool(true) bool(false).", "Line 7: Ana Hello Brave World.", "Line 8: 007 a b c.", "Lines 9–10: duplicates removed: php,web,code.", "Line 11: two items from position 1: 20,30.", "Lines 12–13: isset says false for null, array_key_exists says true.", "Line 14: 4 5 5 6 — é is one letter but two bytes."] },
        mistake: "Writing your own trim, sort or date maths. The built-ins are tested on millions of sites — and much faster."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · PHP shelf", line: ["Warning: Undefined variable $scroe in main.php on line 7", "Fatal error: Uncaught TypeError"],
      content: {
        story: ["PHP's messages come in levels. A Parse error means the code can't be read — look at the line given and the one above it. A Warning or Notice means something suspicious, like an undefined variable or a missing array key; the program carries on, often with wrong results. A Fatal error stops everything.",
          "Show every problem while developing: error_reporting(E_ALL) and display_errors on. On a live website, log errors to a file instead of showing them to visitors.",
          "var_dump and print_r show what a variable really holds. Xdebug adds a proper debugger: pause on a line and look at every variable."],
        big: "Read the message's level, file and line; show every warning while developing; var_dump what you're unsure about.",
        caption: "A magnifying glass follows a warning to line 7, where $scroe should be $score. Tap Play.",
        demo: ["Warning: Undefined variable $scroe", "in main.php on line 7", "$scroe → $score", "✓"]
      },
      deep: {
        more: ["Static analysers like PHPStan and Psalm read your code without running it and find type mistakes, impossible conditions and typos — many bugs before they happen.",
          "dd() and dump() in Laravel and Symfony are friendlier versions of var_dump."],
        ex: { code: src(H.concat(["function double(int $n): int", "{", "    return $n * 2;", "}", "", "$data = [\"name\" => \"Ana\", \"scores\" => [10, 20]];", "print_r($data);", "var_dump(3 == \"3\", 3 === \"3\");", "try {", "    echo double(\"5\");", "} catch (TypeError $e) {", "    echo \"TypeError caught: strict types refused a string\\n\";", "}", "$name = $data[\"nickname\"] ?? \"no nickname\";", "echo $name, \"\\n\";"])),
          walk: ["Lines 10–11: print_r shows the whole nested array.", "Line 12: bool(true) bool(false).", "Lines 13–17: with strict types, a string where an int belongs is a TypeError, caught here.", "Lines 18–19: ?? avoids the “Undefined array key” warning: no nickname."] },
        mistake: "Hiding errors with @ or turning warnings off to make them go away. The bug is still there — fix the cause instead."
      } },
    { title: "Talking to Databases with PDO", chapter: "Beyond the basics · PHP shelf", line: ["$db = new PDO(\"sqlite:game.db\");", "$stmt->execute([\"min\" => 90]);"],
      content: {
        story: ["Most PHP sites keep their data in a database such as MySQL, PostgreSQL or SQLite. PDO is PHP's one interface for all of them: change the connection text and the rest of the code stays the same.",
          "Always use prepared statements: write placeholders like :name in the SQL, then pass the values separately to execute. The database treats them purely as data, which stops SQL injection.",
          "fetchAll(PDO::FETCH_ASSOC) returns the rows as associative arrays, ready for foreach. (The SQL track teaches the queries themselves.)"],
        big: "PDO talks to any database; prepare with placeholders and execute with values — never glue user input into SQL.",
        caption: "A query with :name slots; values drop in separately, so a sneaky one can't change the query. Tap Play.",
        demo: ["new PDO(\"sqlite::memory:\")", "prepare(\"… WHERE score > :min\")", "execute([\"min\" => 90])", "fetchAll(PDO::FETCH_ASSOC)"]
      },
      deep: {
        more: ["PDO throws a PDOException when a query fails (that's the default since PHP 8), so mistakes don't go unnoticed.",
          "Wrap several related changes in $db->beginTransaction() … $db->commit() so they all happen or none do."],
        ex: { code: src(H.concat(["$db = new PDO(\"sqlite::memory:\");", "$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);", "$db->exec(\"CREATE TABLE players (name TEXT, score INTEGER)\");", "$insert = $db->prepare(\"INSERT INTO players (name, score) VALUES (:name, :score)\");", "foreach ([\"Ana\" => 120, \"Leo\" => 95, \"Mia\" => 80] as $name => $score) {", "    $insert->execute([\"name\" => $name, \"score\" => $score]);", "}", "$query = $db->prepare(\"SELECT name, score FROM players WHERE score > :min ORDER BY score DESC\");", "$query->execute([\"min\" => 90]);", "foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {", "    echo \"{$row['name']}: {$row['score']}\\n\";", "}", "$sneaky = \"x' OR '1'='1\";", "$check = $db->prepare(\"SELECT COUNT(*) FROM players WHERE name = :name\");", "$check->execute([\"name\" => $sneaky]);", "echo \"rows for a sneaky name: \", $check->fetchColumn(), \"\\n\";"])),
          walk: ["Lines 5–7: an in-memory SQLite database and a table.", "Lines 8–11: one prepared INSERT, run three times.", "Lines 12–16: players over 90: Ana: 120, Leo: 95.", "Lines 17–20: an injection attempt is just a strange name: rows for a sneaky name: 0."] },
        mistake: "Building SQL with dots: \"... WHERE name = '\" . $_GET[\"name\"] . \"'\". It works until someone types an apostrophe — or an attack. Use placeholders."
      } },
    { title: "Security Essentials", chapter: "Beyond the basics · PHP shelf", line: ["password_hash($password, PASSWORD_DEFAULT)", "htmlspecialchars($text, ENT_QUOTES, \"UTF-8\")"],
      content: {
        story: ["Web apps face the whole internet, so a few habits matter enormously. Escape output with htmlspecialchars (stops XSS). Use prepared statements (stops SQL injection). Never store passwords — store password_hash results and check them with password_verify.",
          "Protect forms with a CSRF token: a random value stored in the session and sent with the form, so other sites can't submit forms on a visitor's behalf. random_bytes makes unguessable tokens.",
          "Keep PHP and every library updated, use HTTPS, and validate input: check that a number really is a number with filter_var before using it."],
        big: "Escape output, prepare queries, hash passwords, add CSRF tokens, validate input — and keep everything updated.",
        caption: "Five locks snap shut on a web page: escape, prepare, hash, token, validate. Tap Play.",
        demo: ["htmlspecialchars → no XSS", "prepared statements → no injection", "password_hash / password_verify", "bin2hex(random_bytes(16))"]
      },
      deep: {
        more: ["password_hash picks a strong, slow algorithm and a random salt for you, and PASSWORD_DEFAULT moves to stronger algorithms as PHP improves. password_needs_rehash tells you when to upgrade a stored hash.",
          "The OWASP Top Ten is the standard list of the most common web security risks — worth reading once you build real sites."],
        ex: { code: src(H.concat(["$hash = password_hash(\"correct horse\", PASSWORD_DEFAULT);", "echo strlen($hash) >= 60 ? \"hash stored\\n\" : \"too short\\n\";", "var_dump(password_verify(\"correct horse\", $hash), password_verify(\"wrong\", $hash));", "$token = bin2hex(random_bytes(16));", "echo \"token length: \", strlen($token), \"\\n\";", "echo htmlspecialchars(\"<img src=x onerror=alert(1)>\", ENT_QUOTES, \"UTF-8\"), \"\\n\";", "var_dump(filter_var(\"42\", FILTER_VALIDATE_INT), filter_var(\"42abc\", FILTER_VALIDATE_INT));"])),
          walk: ["Lines 5–6: a hash is long and different every time: hash stored.", "Line 7: bool(true) for the right password, bool(false) for the wrong one.", "Lines 8–9: 16 random bytes as hex: token length: 32.", "Line 10: the attack becomes harmless text.", "Line 11: int(42) for a real number, bool(false) for 42abc."] },
        mistake: "Hashing passwords with md5 or sha1. They're far too fast, so stolen hashes are cracked in minutes. Use password_hash."
      } },
    { title: "Dates and Times", chapter: "Beyond the basics · PHP shelf", line: ["$day = new DateTimeImmutable(\"2025-03-01\");", "$day->modify(\"+7 days\")"],
      content: {
        story: ["DateTimeImmutable represents a moment in time. Make one from text — new DateTimeImmutable(\"2025-03-01 14:30\") — or for now with new DateTimeImmutable().",
          "format turns it into any text you like: \"Y-m-d\" is 2025-03-01, \"l, F j\" is Saturday, March 1. modify(\"+7 days\") and add(new DateInterval(\"P1M\")) move it, and diff measures the gap between two dates.",
          "Immutable means each change returns a new object and leaves the original alone — far fewer surprises than the older DateTime class."],
        big: "DateTimeImmutable holds a moment, format writes it, modify and add move it, and diff measures between dates.",
        caption: "A calendar flips forward a week, and a ruler measures the days between two dates. Tap Play.",
        demo: ["new DateTimeImmutable(\"2025-03-01\")", "->format(\"l, F j\")", "->modify(\"+7 days\")", "->diff($other)->days"]
      },
      deep: {
        more: ["Always be clear about time zones. Store times in UTC and convert for display with setTimezone(new DateTimeZone(\"America/Chicago\")).",
          "The date() function formats the current time quickly, but DateTimeImmutable is easier to test and to reason about."],
        ex: { code: src(H.concat(["$utc = new DateTimeZone(\"UTC\");", "$start = new DateTimeImmutable(\"2025-03-01 14:30\", $utc);", "echo $start->format(\"Y-m-d\"), \" / \", $start->format(\"l, F j\"), \"\\n\";", "$later = $start->modify(\"+7 days\");", "echo $later->format(\"D j M\"), \" (start is still \", $start->format(\"D j M\"), \")\\n\";", "$end = new DateTimeImmutable(\"2025-12-25\", $utc);", "echo $start->diff($end)->days, \" days to go\\n\";", "$chicago = $start->setTimezone(new DateTimeZone(\"America/Chicago\"));", "echo $chicago->format(\"H:i T\"), \"\\n\";"])),
          walk: ["Lines 5–7: 2025-03-01 / Saturday, March 1.", "Lines 8–9: a new date a week later: Sat 8 Mar (start is still Sat 1 Mar).", "Lines 10–11: 298 days to go.", "Lines 12–13: 14:30 UTC is 08:30 CST in Chicago."] },
        mistake: "Comparing dates as text in different formats, like \"3/1/2025\" < \"12/1/2024\". Compare DateTimeImmutable objects (they work with < and >) or ISO dates like 2025-03-01."
      } }
  ];

  var glossary = [
    ["$ (dollar sign)", "Starts every variable name."],
    ["$_GET / $_POST", "Arrays holding values from the address bar and from submitted forms."],
    ["$this", "Inside a method, the object the method was called on."],
    ["abstract class", "A partial blueprint that can't be built directly."],
    ["array", "PHP's list type; keys can be numbers or names."],
    ["array_filter", "Keeps the items a function says yes to."],
    ["array_map", "Transforms every item with a function."],
    ["arrow function", "A short function: fn($x) => $x * 2."],
    ["associative array", "An array whose keys are names."],
    ["autoloading", "Loading a class's file automatically the first time it's used."],
    ["bool", "true or false."],
    ["catch", "Handles an exception thrown inside try."],
    ["class", "A blueprint for objects."],
    ["Composer", "PHP's package manager."],
    ["concatenation", "Joining text with the dot operator."],
    ["const", "Defines a value that can never change."],
    ["constructor", "__construct, the method that runs when an object is built."],
    ["constructor promotion", "Declaring properties right in the constructor's parameters."],
    ["count", "Counts the items in an array."],
    ["CSRF", "A trick that makes a visitor's browser submit a form without them knowing."],
    ["declare(strict_types=1)", "Makes PHP refuse wrong types instead of converting them."],
    ["DateTimeImmutable", "A moment in time whose changes return new objects."],
    ["default", "The match arm used when nothing else matches."],
    ["echo", "Sends text out."],
    ["elseif", "Tries another test after an if."],
    ["enum", "A type with a fixed set of cases."],
    ["exception", "An object thrown to signal that something went wrong."],
    ["explode", "Splits text into an array."],
    ["extends", "Makes a child class from a parent class."],
    ["false", "The bool meaning no."],
    ["finally", "A block that runs after try and catch, either way."],
    ["float", "A number with a decimal point."],
    ["fn", "Starts an arrow function."],
    ["foreach", "Loops over every item of an array."],
    ["function", "A named block of code with parameters and a return value."],
    ["heredoc", "A multi-line string written <<<NAME … NAME;."],
    ["htmlspecialchars", "Escapes text so it's safe to put in a web page."],
    ["implode", "Joins an array into text."],
    ["int", "A whole number."],
    ["interface", "A list of methods a class promises to have."],
    ["interpolation", "Variables filled into a double-quoted string."],
    ["intdiv", "Whole-number division."],
    ["isset", "Checks that a variable or key exists and isn't null."],
    ["JSON", "A text format for data, shared by almost every language."],
    ["json_decode", "Turns JSON text into PHP values."],
    ["json_encode", "Turns PHP values into JSON text."],
    ["Laravel", "A popular PHP framework for building websites."],
    ["match", "An expression that picks a value by strict comparison."],
    ["method", "A function that belongs to a class."],
    ["named argument", "Passing a value by parameter name: greet(name: \"Ana\")."],
    ["namespace", "A folder-like name that groups classes."],
    ["new", "Builds an object from a class."],
    ["null", "The value meaning nothing."],
    ["null coalescing", "?? — the left value if it exists, otherwise the right."],
    ["nullsafe operator", "?-> — calls a method only if the object isn't null."],
    ["object", "A value built from a class."],
    ["parent::", "Calls the parent class's version of a method."],
    ["PDO", "PHP's database interface."],
    ["PHP_EOL", "The end-of-line characters for the current system."],
    ["prepared statement", "SQL with placeholders whose values are sent separately."],
    ["print_r", "Prints an array or object in readable form."],
    ["printf", "Prints formatted text with codes like %d."],
    ["private", "Visible only inside the class."],
    ["property", "A variable that belongs to an object."],
    ["PSR", "PHP Standards Recommendations, shared conventions such as PSR-4 and PSR-12."],
    ["public", "Visible everywhere."],
    ["readonly", "A property that can be set once and never changed."],
    ["return", "Ends a function and hands back a value."],
    ["session", "Data remembered for one visitor across pages."],
    ["spaceship operator", "<=> — returns -1, 0 or 1 when comparing."],
    ["sprintf", "Like printf, but returns the text."],
    ["static", "Belongs to the class instead of an object."],
    ["string", "Text."],
    ["strlen", "Counts the bytes in a string."],
    ["throw", "Signals an exception."],
    ["true", "The bool meaning yes."],
    ["try", "Runs code that might throw an exception."],
    ["TypeError", "Thrown when a value has the wrong type."],
    ["unset", "Removes a variable or an array key."],
    ["use", "Brings a namespaced class into the current file."],
    ["usort", "Sorts an array with your own comparison."],
    ["var_dump", "Shows a value and its type."],
    ["vendor", "The folder where Composer installs libraries."],
    ["XSS", "Cross-site scripting: injecting scripts into someone else's page."],
    ["=== (identical)", "Equal value and equal type."],
    ["-> (arrow)", "Reaches an object's properties and methods."]
  ];

  var field = [
    { name: "echo / printf", head: "output", what: "Send text out; printf formats with %s, %d, %.2f.", ex: "printf(\"%s: %d\\n\", $name, $n);" },
    { name: "strlen / strtoupper", head: "strings", what: "Measure and change text.", ex: "strtoupper(\"ana\")" },
    { name: "str_contains / str_starts_with", head: "strings (PHP 8)", what: "Search text simply.", ex: "str_contains($email, \"@\")" },
    { name: "explode / implode", head: "strings", what: "Split text into an array, or join one.", ex: "explode(\",\", \"a,b\")" },
    { name: "count / in_array", head: "arrays", what: "Count items; check whether a value is present.", ex: "in_array(3, $nums, true)" },
    { name: "array_map / array_filter", head: "arrays", what: "Transform every item, or keep some.", ex: "array_map(fn($x) => $x * 2, $a)" },
    { name: "sort / usort / ksort", head: "arrays", what: "Sort by value, by your rule, or by key.", ex: "usort($p, fn($a, $b) => $a <=> $b);" },
    { name: "array_sum / max / min", head: "arrays and maths", what: "Add up, or find the largest and smallest.", ex: "array_sum($scores)" },
    { name: "round / intdiv / number_format", head: "maths", what: "Round, divide whole numbers, format with commas.", ex: "number_format(1234.5, 2)" },
    { name: "json_encode / json_decode", head: "JSON", what: "Arrays to JSON text and back.", ex: "json_decode($json, true)" },
    { name: "file_get_contents / file_put_contents", head: "files", what: "Read or write a whole file.", ex: "file_put_contents(\"a.txt\", $text)" },
    { name: "htmlspecialchars", head: "web", what: "Escape text before putting it in a page.", ex: "htmlspecialchars($comment)" },
    { name: "password_hash / password_verify", head: "security", what: "Store and check passwords safely.", ex: "password_verify($input, $hash)" },
    { name: "PDO", head: "databases", what: "Talk to any database with prepared statements.", ex: "$stmt->execute([\"id\" => 5]);" },
    { name: "DateTimeImmutable", head: "dates", what: "Create, format, move and compare dates.", ex: "(new DateTimeImmutable())->format(\"Y-m-d\")" }
  ];

  var cheats = [
    { title: "File Skeleton Card", body: "The top of every modern PHP file.", code: src(["<?php", "", "declare(strict_types=1);", "", "echo \"Hello\\n\";"]) },
    { title: "Variables Card", body: "Everyday types.", code: src(["$n = 42;", "$x = 3.14;", "$name = \"Ana\";", "$ok = true;", "$nothing = null;", "const MAX = 10;", "var_dump($n);", "$text = (string) $n;", "$back = (int) \"7\";"]) },
    { title: "Decisions Card", body: "if, ===, match and ?:.", code: src(["if ($x > 0) {", "    echo \"positive\";", "} elseif ($x === 0) {", "    echo \"zero\";", "} else {", "    echo \"negative\";", "}", "$size = match (true) {", "    $n > 10 => \"big\",", "    default => \"small\",", "};", "$mood = $hp > 50 ? \"brave\" : \"careful\";"]) },
    { title: "Loops Card", body: "for, while and foreach.", code: src(["for ($i = 0; $i < 3; $i++) {", "}", "while ($lives > 0) {", "    $lives--;", "}", "foreach ($items as $item) {", "}", "foreach ($ages as $name => $age) {", "}"]) },
    { title: "Arrays Card", body: "Lists and keyed arrays.", code: src(["$a = [1, 2, 3];", "$a[] = 4;", "$n = count($a);", "$m = [\"Ana\" => 12];", "$m[\"Leo\"] = 11;", "$age = $m[\"Mia\"] ?? 0;", "unset($m[\"Ana\"]);", "$doubled = array_map(fn($x) => $x * 2, $a);"]) },
    { title: "Functions Card", body: "Typed functions and arrows.", code: src(["function add(int $a, int $b = 1): int", "{", "    return $a + $b;", "}", "", "$sum = add(2);", "$total = add(b: 5, a: 1);", "$double = fn(int $x): int => $x * 2;"]) },
    { title: "Classes Card", body: "A small class with the usual parts.", code: src(["class Box", "{", "    public function __construct(private int $size = 1)", "    {", "    }", "", "    public function grow(): void", "    {", "        $this->size++;", "    }", "", "    public function size(): int", "    {", "        return $this->size;", "    }", "}"]) },
    { title: "Safety Card", body: "Exceptions and safe output.", code: src(["try {", "    $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);", "} catch (JsonException $e) {", "    echo \"bad JSON: \", $e->getMessage();", "}", "echo htmlspecialchars($comment, ENT_QUOTES, \"UTF-8\");", "$hash = password_hash($password, PASSWORD_DEFAULT);"]) }
  ];

  /* A whole main.php: the opening tag and strict types, then any
     functions and classes, then the program. */
  function M(decls, body) {
    return H.concat(decls.length ? decls.concat([""]) : [], body);
  }
  function stars(n) { return new Array(n + 1).join("*"); }
  function padR(s, w) { while (s.length < w) s += " "; return s; }
  function padL(s, w) { s = String(s); while (s.length < w) s = " " + s; return s; }

  var projects = [
    { name: "Rocket Countdown", about: "A for loop counts the rocket down to blast off.",
      vars: [{ key: "start", val: 5, min: 1, max: 12 }],
      code: function (v) { return M([], ["$start = " + v.start + ";", "for ($i = $start; $i > 0; $i--) {", "    echo \"$i...\\n\";", "}", "echo \"Blast off!\\n\";"]); },
      run: function (v) { var o = []; for (var i = v.start; i > 0; i--) o.push(i + "..."); o.push("Blast off!"); return o; },
      explain: "$i starts at your number, $i-- takes one away each round, and the loop stops when $i > 0 is false." },
    { name: "Star Steps", about: "str_repeat builds each row: str_repeat(\"*\", 3) is ***.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return M([], ["$rows = " + v.rows + ";", "for ($r = 1; $r <= $rows; $r++) {", "    echo str_repeat(\"*\", $r), \"\\n\";", "}"]); },
      run: function (v) { var o = []; for (var r = 1; r <= v.rows; r++) o.push(stars(r)); return o; },
      explain: "str_repeat makes a row $r stars long, so each line is one star longer than the last." },
    { name: "Coin Bank", about: "Every coin adds to the total.",
      vars: [{ key: "coins", val: 5, min: 1, max: 10 }, { key: "each", val: 25, min: 1, max: 50 }],
      code: function (v) { return M([], ["$coins = " + v.coins + ";", "$each = " + v.each + ";", "$total = 0;", "for ($c = 1; $c <= $coins; $c++) {", "    $total += $each;", "    echo \"Coin $c: total $total\\n\";", "}"]); },
      run: function (v) { var o = [], t = 0; for (var c = 1; c <= v.coins; c++) { t += v.each; o.push("Coin " + c + ": total " + t); } return o; },
      explain: "$total starts at 0, and += adds one coin's worth each round. Double quotes fill in $c and $total." },
    { name: "Score Doubler", about: "A score that doubles every round.",
      vars: [{ key: "score", val: 3, min: 1, max: 50 }, { key: "rounds", val: 5, min: 1, max: 10 }],
      code: function (v) { return M([], ["$score = " + v.score + ";", "$rounds = " + v.rounds + ";", "for ($round = 1; $round <= $rounds; $round++) {", "    $score *= 2;", "    echo \"Round $round: $score\\n\";", "}"]); },
      run: function (v) { var o = [], s = v.score; for (var r = 1; r <= v.rounds; r++) { s *= 2; o.push("Round " + r + ": " + s); } return o; },
      explain: "*= 2 doubles the score each round." },
    { name: "Times Table", about: "A multiplication table for any number.",
      vars: [{ key: "num", val: 7, min: 1, max: 12 }, { key: "upto", val: 5, min: 1, max: 12 }],
      code: function (v) { return M([], ["$num = " + v.num + ";", "$upto = " + v.upto + ";", "for ($i = 1; $i <= $upto; $i++) {", "    printf(\"%d x %d = %d\\n\", $num, $i, $num * $i);", "}"]); },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(v.num + " x " + i + " = " + v.num * i); return o; },
      explain: "printf's three %d codes take $num, $i and the product, in order." },
    { name: "Temperature Converter", about: "Celsius to Fahrenheit with one decimal place.",
      vars: [{ key: "celsius", val: 20, min: -40, max: 100 }],
      code: function (v) { return M([], ["$celsius = " + v.celsius + ";", "$fahrenheit = $celsius * 9 / 5 + 32;", "printf(\"%d C is %.1f F\\n\", $celsius, $fahrenheit);"]); },
      run: function (v) { return [v.celsius + " C is " + (v.celsius * 9 / 5 + 32).toFixed(1) + " F"]; },
      explain: "/ gives an exact answer, so nothing is rounded away. %.1f shows one decimal place." },
    { name: "Tip Calculator", about: "A tip and total for a bill, in whole dollars.",
      vars: [{ key: "bill", val: 40, min: 1, max: 500 }, { key: "percent", val: 15, min: 0, max: 30 }],
      code: function (v) { return M([], ["$bill = " + v.bill + ";", "$percent = " + v.percent + ";", "$tip = intdiv($bill * $percent, 100);", "echo \"Bill: \\$$bill\\n\";", "echo \"Tip: \\$$tip\\n\";", "echo \"Total: \\$\" . ($bill + $tip) . \"\\n\";"]); },
      run: function (v) { var tip = Math.floor(v.bill * v.percent / 100); return ["Bill: $" + v.bill, "Tip: $" + tip, "Total: $" + (v.bill + tip)]; },
      explain: "intdiv keeps whole dollars. \\$ prints a real dollar sign, so PHP doesn't think a variable starts there." },
    { name: "FizzBuzz", about: "match (true) picks Fizz, Buzz or both.",
      vars: [{ key: "limit", val: 15, min: 1, max: 30 }],
      code: function (v) { return M([], ["$limit = " + v.limit + ";", "for ($n = 1; $n <= $limit; $n++) {", "    echo match (true) {", "        $n % 15 === 0 => \"FizzBuzz\",", "        $n % 3 === 0 => \"Fizz\",", "        $n % 5 === 0 => \"Buzz\",", "        default => $n,", "    }, \"\\n\";", "}"]); },
      run: function (v) { var o = []; for (var n = 1; n <= v.limit; n++) o.push(n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : String(n)); return o; },
      explain: "match (true) checks each arm in order and uses the first that's true. The 15 arm comes first so 15 doesn't stop at Fizz." },
    { name: "Score Stats", about: "Highest, lowest and average of an array.",
      vars: [{ key: "first", val: 72, min: 0, max: 100 }, { key: "second", val: 95, min: 0, max: 100 }, { key: "third", val: 64, min: 0, max: 100 }],
      code: function (v) { return M([], ["$first = " + v.first + ";", "$second = " + v.second + ";", "$third = " + v.third + ";", "$scores = [$first, $second, $third];", "echo \"Scores: \", implode(\", \", $scores), \"\\n\";", "echo \"Highest: \", max($scores), \"\\n\";", "echo \"Lowest: \", min($scores), \"\\n\";", "printf(\"Average: %.1f\\n\", array_sum($scores) / count($scores));"]); },
      run: function (v) { var a = [v.first, v.second, v.third]; return ["Scores: " + a.join(", "), "Highest: " + Math.max.apply(null, a), "Lowest: " + Math.min.apply(null, a), "Average: " + ((v.first + v.second + v.third) / 3).toFixed(1)]; },
      explain: "max, min, array_sum and count do the work; printf keeps one decimal place for the average." },
    { name: "Shopping Cart", about: "Associative arrays add up a receipt.",
      vars: [{ key: "apples", val: 3, min: 0, max: 10 }, { key: "pears", val: 2, min: 0, max: 10 }],
      code: function (v) { return M([], ["$apples = " + v.apples + ";", "$pears = " + v.pears + ";", "$cart = [", "    [\"name\" => \"Apple\", \"price\" => 50, \"qty\" => $apples],", "    [\"name\" => \"Pear\", \"price\" => 75, \"qty\" => $pears],", "    [\"name\" => \"Bread\", \"price\" => 250, \"qty\" => 1],", "];", "$total = 0;", "foreach ($cart as $item) {", "    $cost = $item[\"price\"] * $item[\"qty\"];", "    $total += $cost;", "    printf(\"%-6s x%d %5d\\n\", $item[\"name\"], $item[\"qty\"], $cost);", "}", "printf(\"Total: \\$%.2f\\n\", $total / 100);"]); },
      run: function (v) {
        var cart = [["Apple", 50, v.apples], ["Pear", 75, v.pears], ["Bread", 250, 1]], o = [], t = 0;
        cart.forEach(function (it) { var c = it[1] * it[2]; t += c; o.push(padR(it[0], 6) + " x" + it[2] + " " + padL(c, 5)); });
        o.push("Total: $" + Math.floor(t / 100) + "." + (t % 100 < 10 ? "0" : "") + (t % 100));
        return o;
      },
      explain: "Prices are in cents to keep the maths exact. %-6s pads the name, %5d lines up the cost, and %.2f shows dollars and cents." },
    { name: "Class Vote", about: "A keyed array counts votes, sorted by name.",
      vars: [{ key: "ana", val: 3, min: 0, max: 20 }, { key: "leo", val: 5, min: 0, max: 20 }],
      code: function (v) { return M([], ["$ana = " + v.ana + ";", "$leo = " + v.leo + ";", "$votes = [\"Mia\" => 4, \"Ana\" => $ana, \"Leo\" => $leo];", "$votes[\"Ana\"] += 2;", "ksort($votes);", "foreach ($votes as $name => $count) {", "    echo \"$name: $count\\n\";", "}", "echo \"Total votes: \", array_sum($votes), \"\\n\";"]); },
      run: function (v) { return ["Ana: " + (v.ana + 2), "Leo: " + v.leo, "Mia: 4", "Total votes: " + (v.ana + 2 + v.leo + 4)]; },
      explain: "Ana gets two late votes with +=. ksort sorts by key, so the names print in alphabetical order." },
    { name: "Hero Healing", about: "A method heals the hero, capped at 100.",
      vars: [{ key: "hp", val: 40, min: 1, max: 99 }, { key: "potion", val: 25, min: 5, max: 50 }],
      code: function (v) { return M(["class Hero", "{", "    public function __construct(public string $name, public int $hp)", "    {", "    }", "", "    public function heal(int $amount): void", "    {", "        $this->hp = min($this->hp + $amount, 100);", "    }", "}"], ["$hp = " + v.hp + ";", "$potion = " + v.potion + ";", "$hero = new Hero(\"Ana\", $hp);", "while ($hero->hp < 100) {", "    $hero->heal($potion);", "    echo \"{$hero->name} drinks a potion: {$hero->hp} HP\\n\";", "}"]); },
      run: function (v) { var o = [], hp = v.hp; while (hp < 100) { hp = Math.min(hp + v.potion, 100); o.push("Ana drinks a potion: " + hp + " HP"); } return o; },
      explain: "heal changes $this->hp, the hero's own health, and min caps it at 100. Braces in the string fill in object properties." },
    { name: "Shape Areas", about: "One loop over an interface handles two kinds of shape.",
      vars: [{ key: "w", val: 4, min: 1, max: 20 }, { key: "h", val: 3, min: 1, max: 20 }, { key: "side", val: 5, min: 1, max: 20 }],
      code: function (v) { return M(["interface Shape", "{", "    public function area(): int;", "", "    public function name(): string;", "}", "", "class Rect implements Shape", "{", "    public function __construct(private int $w, private int $h)", "    {", "    }", "", "    public function area(): int", "    {", "        return $this->w * $this->h;", "    }", "", "    public function name(): string", "    {", "        return \"rectangle\";", "    }", "}", "", "class Square implements Shape", "{", "    public function __construct(private int $side)", "    {", "    }", "", "    public function area(): int", "    {", "        return $this->side * $this->side;", "    }", "", "    public function name(): string", "    {", "        return \"square\";", "    }", "}"], ["$w = " + v.w + ";", "$h = " + v.h + ";", "$side = " + v.side + ";", "$shapes = [new Rect($w, $h), new Square($side)];", "$total = 0;", "foreach ($shapes as $shape) {", "    echo $shape->name(), \": \", $shape->area(), \"\\n\";", "    $total += $shape->area();", "}", "echo \"Total area: $total\\n\";"]); },
      run: function (v) { var a = v.w * v.h, b = v.side * v.side; return ["rectangle: " + a, "square: " + b, "Total area: " + (a + b)]; },
      explain: "Rect and Square both implement Shape, so the loop can call area() and name() on either without knowing which it has." },
    { name: "Cookie Sharing", about: "A function throws an exception instead of dividing by zero.",
      vars: [{ key: "cookies", val: 12, min: 0, max: 50 }, { key: "friends", val: 4, min: 0, max: 10 }],
      code: function (v) { return M(["function share(int $cookies, int $friends): array", "{", "    if ($friends === 0) {", "        throw new InvalidArgumentException(\"no friends to share with\");", "    }", "    return [intdiv($cookies, $friends), $cookies % $friends];", "}"], ["$cookies = " + v.cookies + ";", "$friends = " + v.friends + ";", "try {", "    [$each, $left] = share($cookies, $friends);", "    echo \"Each friend gets $each\\n\";", "    echo \"Left over: $left\\n\";", "} catch (InvalidArgumentException $e) {", "    echo \"Error: \", $e->getMessage(), \"\\n\";", "}"]); },
      run: function (v) { if (v.friends === 0) return ["Error: no friends to share with"]; return ["Each friend gets " + Math.floor(v.cookies / v.friends), "Left over: " + v.cookies % v.friends]; },
      explain: "Set friends to 0: share throws an exception and catch handles it. [$each, $left] = unpacks the two answers." },
    { name: "Grade Bands", about: "match (true) turns three scores into grades.",
      vars: [{ key: "ana", val: 92, min: 0, max: 100 }, { key: "leo", val: 78, min: 0, max: 100 }, { key: "mia", val: 85, min: 0, max: 100 }],
      code: function (v) { return M(["function grade(int $score): string", "{", "    return match (true) {", "        $score >= 90 => \"A\",", "        $score >= 80 => \"B\",", "        $score >= 70 => \"C\",", "        default => \"Keep going\",", "    };", "}"], ["$ana = " + v.ana + ";", "$leo = " + v.leo + ";", "$mia = " + v.mia + ";", "foreach ([\"Ana\" => $ana, \"Leo\" => $leo, \"Mia\" => $mia] as $name => $score) {", "    echo \"$name: $score is \", grade($score), \"\\n\";", "}"]); },
      run: function (v) {
        function g(s) { return s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : "Keep going"; }
        return [["Ana", v.ana], ["Leo", v.leo], ["Mia", v.mia]].map(function (r) { return r[0] + ": " + r[1] + " is " + g(r[1]); });
      },
      explain: "match (true) stops at the first condition that's true, so 95 gets an A, not a B." },
    { name: "Even Squares", about: "array_filter and array_map make a pipeline.",
      vars: [{ key: "n", val: 6, min: 2, max: 20 }],
      code: function (v) { return M([], ["$n = " + v.n + ";", "$numbers = range(1, $n);", "$evens = array_filter($numbers, fn($x) => $x % 2 === 0);", "$squares = array_map(fn($x) => $x * $x, $evens);", "echo \"Evens squared: \", implode(\" \", $squares), \"\\n\";", "echo \"Sum: \", array_sum($squares), \"\\n\";"]); },
      run: function (v) { var s = []; for (var x = 2; x <= v.n; x += 2) s.push(x * x); return ["Evens squared: " + s.join(" "), "Sum: " + s.reduce(function (a, b) { return a + b; }, 0)]; },
      explain: "range makes 1 to $n, array_filter keeps the even ones, and array_map squares them." },
    { name: "Name Tags", about: "String functions make name tags.",
      vars: [{ key: "keep", val: 3, min: 1, max: 8 }],
      code: function (v) { return M([], ["$keep = " + v.keep + ";", "foreach ([\"Ana\", \"Leonardo\", \"Mia\"] as $name) {", "    $tag = str_pad(strtoupper($name), 10, \".\");", "    echo $tag, \" \", strlen($name), \" \", substr($name, 0, $keep), \"\\n\";", "}"]); },
      run: function (v) { return ["Ana", "Leonardo", "Mia"].map(function (n) { var t = n.toUpperCase(); while (t.length < 10) t += "."; return t + " " + n.length + " " + n.substr(0, v.keep); }); },
      explain: "str_pad fills the tag out to 10 characters with dots; substr($name, 0, $keep) keeps the first letters — strings count from 0." },
    { name: "Number Guesser", about: "Halving the range finds any number from 1 to 100 in 7 guesses or fewer.",
      vars: [{ key: "secret", val: 37, min: 1, max: 100 }],
      code: function (v) { return M([], ["$secret = " + v.secret + ";", "$low = 1;", "$high = 100;", "$tries = 0;", "while (true) {", "    $tries++;", "    $guess = intdiv($low + $high, 2);", "    if ($guess === $secret) {", "        echo \"Got it: $guess in $tries tries\\n\";", "        break;", "    } elseif ($guess < $secret) {", "        echo \"$guess is too low\\n\";", "        $low = $guess + 1;", "    } else {", "        echo \"$guess is too high\\n\";", "        $high = $guess - 1;", "    }", "}"]); },
      run: function (v) {
        var o = [], low = 1, high = 100;
        for (var tries = 1; ; tries++) {
          var g = Math.floor((low + high) / 2);
          if (g === v.secret) { o.push("Got it: " + g + " in " + tries + " tries"); break; }
          else if (g < v.secret) { o.push(g + " is too low"); low = g + 1; }
          else { o.push(g + " is too high"); high = g - 1; }
        }
        return o;
      },
      explain: "Each guess is the middle of what's left, so every wrong answer throws away half the numbers. That's binary search." }
  ];

  var vt = [
    { line: 'echo "{w}\\n";', why: "echo sends text out." },
    { line: 'echo ${v}, "\\n";', why: "echo can take several values separated by commas." },
    { line: 'echo "{w}: ${v}\\n";', why: "Double quotes fill in the variable." },
    { line: 'printf("%d\\n", ${v});', why: "%d prints a whole number." },
    { line: "${v} = {n};", why: "Every variable starts with $." },
    { line: "${v} = {dec};", why: "A decimal makes a float." },
    { line: "${v} = {b};", why: "true or false makes a bool." },
    { line: '${sv} = "{w}";', why: "Text goes in quotes." },
    { line: "const {cv} = {n};", why: "Constants have no $ and never change." },
    { line: 'define("{cv}", {n});', why: "define makes a constant too." },
    { line: "${v} += {n};", why: "+= adds onto the current value." },
    { line: "${v} -= {d};", why: "-= takes away from the current value." },
    { line: "${v} *= {d};", why: "*= multiplies the current value." },
    { line: "${v}++;", why: "++ adds one." },
    { line: "${v} = ${u} % {d};", why: "% gives the remainder." },
    { line: "${v} = intdiv(${u}, {d});", why: "intdiv divides whole numbers." },
    { line: "${v} = ${u} ** {d};", why: "** raises to a power." },
    { line: '${sv} = "{w}" . ${sv};', why: "The dot joins text." },
    { line: '${sv} .= " {w}";', why: ".= adds text onto the end." },
    { line: "echo strtoupper(${sv});", why: "strtoupper makes capitals." },
    { line: "echo strlen(${sv});", why: "strlen counts bytes." },
    { line: 'if (${v} > {n}) { echo "{w}\\n"; }', why: "if runs its block when the test is true." },
    { line: "if (${v} === {n}) { ${u} = 0; }", why: "=== checks value and type." },
    { line: "} elseif (${v} < {d}) {", why: "elseif tries another test." },
    { line: '${sv} = ${v} > {n} ? "{w}" : "none";', why: "?: picks one of two values." },
    { line: 'echo match (${v}) { {n} => "{w}", default => "other" };', why: "match picks an arm by strict comparison." },
    { line: "for ($i = 0; $i < {n}; $i++) { ${v} += $i; }", why: "Start, test and step." },
    { line: "while (${v} > 0) { ${v}--; }", why: "while repeats while the test is true." },
    { line: "foreach (${arr} as $item) { ${v} += $item; }", why: "foreach visits every item." },
    { line: "${arr} = [{n}, {n2}, {n3}];", why: "Square brackets make an array." },
    { line: "${arr}[] = {n};", why: "Empty brackets add to the end." },
    { line: "echo count(${arr});", why: "count counts the items." },
    { line: "sort(${arr});", why: "sort changes the array itself." },
    { line: '${m} = ["{w}" => {n}];', why: "=> links a key to a value." },
    { line: '${m}["{w}"] = {n};', why: "Set a value by its key." },
    { line: 'foreach (${m} as $key => $value) { echo "$key: $value\\n"; }', why: "foreach gives each key and value." },
    { line: 'if (isset(${m}["{w}"])) { ${v}++; }', why: "isset checks a key exists." },
    { line: '${v} = ${m}["{w}"] ?? {n};', why: "?? gives a default for a missing key." },
    { line: 'unset(${m}["{w}"]);', why: "unset removes a key." },
    { line: "function {f}(int ${v}): int { return ${v} * {d}; }", why: "Typed parameter, typed result." },
    { line: 'function {f}(): void { echo "{w}\\n"; }', why: "void returns nothing." },
    { line: "{f}({n});", why: "Call a function with an argument." },
    { line: "${v} = {f}(${u});", why: "Store a function's result." },
    { line: "${f} = fn($x) => $x * {d};", why: "fn makes a short function." },
    { line: "${arr} = array_map(fn($x) => $x * {d}, ${arr});", why: "array_map transforms every item." },
    { line: "${arr} = array_filter(${arr}, fn($x) => $x > {n});", why: "array_filter keeps some items." },
    { line: "${v} = array_sum(${arr});", why: "array_sum adds up an array." },
    { line: "class {c} { public int ${v} = {n}; }", why: "A class with a typed property." },
    { line: "${o} = new {c}();", why: "new builds an object." },
    { line: "${o}->{v} = {n};", why: "-> reaches a property." },
    { line: "public function {f}(): int { return $this->{v}; }", why: "$this is the object itself." },
    { line: "public function __construct(public string ${sv}) {}", why: "Constructor promotion makes a property." },
    { line: "class {c} extends {k} {}", why: "extends makes a child class." },
    { line: "interface Has{c} { public function get{c}(): {c}; }", why: "An interface lists required methods." },
    { line: "enum {c}State { case Idle; case Running; }", why: "An enum lists fixed choices." },
    { line: "try { {f}(); } catch (Exception $e) { echo $e->getMessage(); }", why: "catch handles a thrown exception." },
    { line: 'throw new InvalidArgumentException("{w}");', why: "throw signals a problem." },
    { line: 'file_put_contents("{w}.txt", ${v});', why: "Write a whole file in one call." },
    { line: '${sv} = file_get_contents("{w}.txt");', why: "Read a whole file in one call." },
    { line: "${sv} = json_encode(${m});", why: "json_encode turns arrays into JSON." },
    { line: "${m} = json_decode(${sv}, true);", why: "json_decode with true gives arrays." },
    { line: "echo htmlspecialchars(${sv});", why: "Escape text before showing it." },
    { line: "${sv} = password_hash(${sv}, PASSWORD_DEFAULT);", why: "Never store a plain password." },
    { line: '${sv} = sprintf("%s has %d", ${sv}, ${v});', why: "sprintf returns formatted text." }
  ];
  var themes = [
    { name: "Echo & Talk", t: [0, 1, 2, 3, 7] },
    { name: "Variables", t: [4, 5, 6, 7, 8] },
    { name: "Constants", t: [8, 9, 4, 5, 10] },
    { name: "Math Moves", t: [10, 11, 12, 13, 14] },
    { name: "Number Tools", t: [15, 16, 14, 46, 4] },
    { name: "Strings", t: [17, 18, 19, 20, 63] },
    { name: "Decisions", t: [21, 22, 23, 24, 6] },
    { name: "Match", t: [25, 24, 21, 22, 23] },
    { name: "Loops", t: [26, 27, 28, 10, 13] },
    { name: "Arrays", t: [29, 30, 31, 32, 28] },
    { name: "Keyed Arrays", t: [33, 34, 35, 36, 37] },
    { name: "Missing Keys", t: [36, 37, 38, 34, 33] },
    { name: "Functions", t: [39, 40, 41, 42, 43] },
    { name: "Array Functions", t: [44, 45, 46, 43, 32] },
    { name: "Classes", t: [47, 48, 49, 50, 51] },
    { name: "Inheritance & Interfaces", t: [52, 53, 54, 47, 50] },
    { name: "Errors", t: [55, 56, 22, 21, 41] },
    { name: "Files & JSON", t: [57, 58, 59, 60, 61] },
    { name: "Security", t: [61, 62, 63, 7, 59] },
    { name: "PHP Masters", t: [37, 44, 51, 55, 60] }
  ];
  /* PHP's built-in count() can't be redeclared, so the function bank
     avoids it and other built-in names. */
  var FUNCS = ["play", "heal", "jump", "draw", "sing", "build", "spin", "dash", "grow", "shine", "mix", "lift", "launch", "glide", "turn", "push", "pull", "wave", "zap", "mend", "craft", "boost", "cheer", "greet", "explore", "charge"];
  var CONSTS = ["MAX_LIVES", "TOP_SPEED", "START_GOLD", "MAX_LEVEL", "BONUS", "LIMIT", "TEAM_SIZE", "MAX_HP", "GRID_SIZE", "SPAWN_RATE"];
  function pick(bank, r) { return bank[Math.floor(r() * bank.length)]; }

  return {
    blocks: blocks, chapters: chapters, shelves: shelves, glossary: glossary, field: field, cheats: cheats,
    projects: projects, vt: vt, themes: themes,
    fill: function (k, r) {
      if (k === "f") return pick(FUNCS, r);
      if (k === "cv") return pick(CONSTS, r);
      return null;
    },
    sandboxNote: "Thirty everyday PHP lines, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your PHP progress is saved separately from every other track.",
    sourcesHTML: 'PHP facts and syntax follow the <a href="https://www.php.net/manual/en/">PHP Manual</a> (PHP 8.3) and the <a href="https://www.php-fig.org/per/coding-style/">PER coding style</a>. Every explanation is written in Code Block\u2019s own words, and every practice program is run by the real PHP interpreter, with every warning switched on, before it ships.'
  };
});
