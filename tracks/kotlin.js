"use strict";
/* ================= KOTLIN — a Code Block track =================
   Written fresh for Code Block in plain words. Facts and syntax follow
   the official Kotlin documentation (kotlinlang.org/docs, Kotlin 2.1)
   and the Kotlin coding conventions. Every PC project and library
   example is compiled by the real Kotlin compiler with warnings as
   errors and run on the JVM in tests/content, and a project's output
   must match the app. Every drill and Vault line is parsed by the
   Kotlin compiler's own parser. */
cbRegisterTrack("kotlin", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Hello Block", short: "println", chapter: "Kotlin Ch. 1 · First Steps", icon: "i-say", verb: "say",
      line: 'println("Hello, world!")',
      explain: "println prints a line. Kotlin needs no semicolons, and a program starts at fun main()." },
    { name: "Val Block", short: "val", chapter: "Kotlin Ch. 2 · Variables and Types", icon: "i-lock", verb: "name",
      line: 'val name = "Ana"',
      explain: "val makes a value that can't be reassigned — Kotlin's default. The type, String, is worked out for you." },
    { name: "Var Block", short: "var", chapter: "Kotlin Ch. 2 · Variables and Types", icon: "i-pencil", verb: "change",
      line: "var score = 0",
      explain: "var makes a variable that can change: score += 10 is fine. Use val unless you really need var." },
    { name: "Type Block", short: ": Double", chapter: "Kotlin Ch. 2 · Variables and Types", icon: "i-tag", verb: "label",
      line: "val price: Double = 4.99",
      explain: "A colon and a type spell it out. Everyday types are Int, Double, String, Boolean and Char." },
    { name: "Const Block", short: "const val", chapter: "Kotlin Ch. 2 · Variables and Types", icon: "i-stamp", verb: "fix",
      line: "const val MAX_LIVES = 3",
      explain: "const val is a value fixed when the program is compiled. Constants are written in CAPITALS." },
    { name: "Divide Block", short: ".toDouble()", chapter: "Kotlin Ch. 3 · Operators and Math", icon: "i-calc", verb: "divide",
      line: "val average = total.toDouble() / count",
      explain: "Dividing two Ints drops the fraction: 7 / 2 is 3. Turn one side into a Double first to keep the decimals." },
    { name: "Template Block", short: "$name", chapter: "Kotlin Ch. 4 · Strings and Templates", icon: "i-brackets", verb: "fill",
      line: 'println("$name has ${coins * 2} coins")',
      explain: "String templates drop values into text: $name for a variable, ${ } for any expression." },
    { name: "String Block", short: ".uppercase()", chapter: "Kotlin Ch. 4 · Strings and Templates", icon: "i-link", verb: "shout",
      line: "val shout = name.uppercase()",
      explain: "Strings have many functions: uppercase, length, reversed, contains, split, trim, padStart and more." },
    { name: "If Value Block", short: "if = ", chapter: "Kotlin Ch. 5 · Decisions", icon: "i-fork", verb: "choose",
      line: 'val size = if (n > 10) "big" else "small"',
      explain: "In Kotlin, if gives back a value, so you can store its answer directly. Kotlin has no ?: ternary — it doesn't need one." },
    { name: "When Block", short: "when", chapter: "Kotlin Ch. 5 · Decisions", icon: "i-toggle", verb: "pick",
      line: 'when (day) { "Sat", "Sun" -> println("Weekend") else -> println("School") }',
      explain: "when compares a value against each branch, top to bottom. It can match several values, ranges (in 1..5) and types (is String)." },
    { name: "For Block", short: "for in", chapter: "Kotlin Ch. 6 · Loops and Ranges", icon: "i-repeat", verb: "count",
      line: "for (i in 1..5) println(i)",
      explain: "1..5 is a range from 1 to 5, both ends included. for walks through it one value at a time." },
    { name: "DownTo Block", short: "downTo", chapter: "Kotlin Ch. 6 · Loops and Ranges", icon: "i-rows", verb: "step",
      line: "for (i in 10 downTo 0 step 2) println(i)",
      explain: "downTo counts backwards and step jumps: 10, 8, 6, 4, 2, 0. 0 until 5 counts 0 to 4." },
    { name: "Repeat Block", short: "repeat", chapter: "Kotlin Ch. 6 · Loops and Ranges", icon: "i-hourglass", verb: "repeat",
      line: 'repeat(3) { println("Hip hip hooray!") }',
      explain: "repeat runs the code in the braces a number of times — the simplest loop when you don't need a counter." },
    { name: "List Block", short: "listOf", chapter: "Kotlin Ch. 7 · Lists", icon: "i-boxes", verb: "line up",
      line: "val scores = listOf(10, 20, 30)",
      explain: "listOf makes a read-only List, counted from 0: scores[0] is 10. It can't grow or change." },
    { name: "Mutable List Block", short: "mutableListOf", chapter: "Kotlin Ch. 7 · Lists", icon: "i-plus-square", verb: "grow",
      line: 'val team = mutableListOf("Ana")',
      explain: "mutableListOf makes a list you can change. The val means the list itself stays the same box; its items can change." },
    { name: "Add Block", short: ".add", chapter: "Kotlin Ch. 7 · Lists", icon: "i-plus-square", verb: "add",
      line: 'team.add("Leo")',
      explain: "add puts an item on the end of a mutable list; remove takes one out. team.size is now 2." },
    { name: "Map Block", short: "mapOf", chapter: "Kotlin Ch. 8 · Maps and Sets", icon: "i-folder", verb: "label",
      line: 'val ages = mapOf("Ana" to 12, "Leo" to 11)',
      explain: "A Map links keys to values. \"Ana\" to 12 makes one pair; ages[\"Ana\"] is 12." },
    { name: "Default Block", short: "getOrDefault", chapter: "Kotlin Ch. 8 · Maps and Sets", icon: "i-check", verb: "look up",
      line: 'val age = ages.getOrDefault("Mia", 0)',
      explain: "A missing key gives null with ages[\"Mia\"]; getOrDefault gives your default instead." },
    { name: "Function Block", short: "fun", chapter: "Kotlin Ch. 9 · Functions", icon: "i-play-circle", verb: "build",
      line: "fun add(a: Int, b: Int) = a + b",
      explain: "fun defines a function. Parameters need types; a single-expression function can use = and let Kotlin work out the return type." },
    { name: "Named Block", short: "name =", chapter: "Kotlin Ch. 9 · Functions", icon: "i-sliders", verb: "name",
      line: 'greet(name = "Ana", excited = true)',
      explain: "Named arguments say which parameter each value is for, so calls read clearly and can skip parameters with defaults." },
    { name: "Nullable Block", short: "String?", chapter: "Kotlin Ch. 10 · Null Safety", icon: "i-gap", verb: "allow",
      line: "val nickname: String? = null",
      explain: "A ? after the type means “this might be null.” Plain String can never be null — Kotlin checks before the program runs." },
    { name: "Elvis Block", short: "?. ?:", chapter: "Kotlin Ch. 10 · Null Safety", icon: "i-shield-check", verb: "guard",
      line: "val length = nickname?.length ?: 0",
      explain: "?. calls only if the value isn't null; ?: (the Elvis operator) gives a default when it is." },
    { name: "Class Block", short: "class", chapter: "Kotlin Ch. 11 · Classes and Objects", icon: "i-layers", verb: "design",
      line: "class Player(val name: String, var hp: Int = 100)",
      explain: "The brackets after the class name are its primary constructor: val and var make them properties in one line." },
    { name: "Data Class Block", short: "data class", chapter: "Kotlin Ch. 11 · Classes and Objects", icon: "i-cube", verb: "model",
      line: "data class Point(val x: Int, val y: Int)",
      explain: "A data class gets toString, equals and copy for free: println(Point(1, 2)) prints Point(x=1, y=2)." },
    { name: "Sealed Block", short: "sealed", chapter: "Kotlin Ch. 12 · Inheritance and Interfaces", icon: "i-shapes", verb: "close",
      line: "sealed interface Shape",
      explain: "A sealed interface has a fixed set of subtypes, so a when over a Shape can check that every kind is handled." },
    { name: "Override Block", short: "override", chapter: "Kotlin Ch. 12 · Inheritance and Interfaces", icon: "i-tree", verb: "replace",
      line: "override fun area() = side * side",
      explain: "override replaces a function from a parent class or interface. Classes are closed by default; a parent must be marked open." },
    { name: "Filter Block", short: ".filter", chapter: "Kotlin Ch. 13 · Lambdas and Collections", icon: "i-funnel", verb: "keep",
      line: "val evens = nums.filter { it % 2 == 0 }",
      explain: "filter keeps items that pass the test in the braces. it is the item when a lambda has one parameter." },
    { name: "Try Block", short: "try/catch", chapter: "Kotlin Ch. 14 · Errors and Exceptions", icon: "i-shield-alert", verb: "catch",
      line: "try { risky() } catch (e: IllegalStateException) { println(e.message) }",
      explain: "If code in try throws an exception, catch handles it instead of crashing. try is an expression too, so it can give back a value." },
    { name: "Extension Block", short: "fun String.", chapter: "Kotlin Ch. 15 · Extensions, Objects and Enums", icon: "i-plus-square", verb: "extend",
      line: 'fun String.shout() = uppercase() + "!"',
      explain: "An extension function adds a new function to an existing type: \"hi\".shout() is \"HI!\"." },
    { name: "Generic Block", short: "<T>", chapter: "Kotlin Ch. 16 · Generics, Sequences and Real Projects", icon: "i-brackets", verb: "reuse",
      line: "fun <T> List<T>.second(): T = this[1]",
      explain: "<T> is a type parameter: second works for a list of anything and returns the same type." }
  ];

  var chapters = [
    { title: "First Steps", chapter: "Start here · fun main, println, kotlinc", line: 'println("Hello, world!")',
      content: {
        story: ["Kotlin is a modern, friendly language made by JetBrains. Google recommends it for Android apps, and it also runs servers, desktop apps and even web pages. It works hand in hand with Java and runs on the same JVM.",
          "A program starts at fun main(). println prints a line. There are no semicolons at the ends of lines, and code blocks live in curly braces.",
          "Try it instantly at play.kotlinlang.org, or install IntelliJ IDEA (or Android Studio for apps). From a terminal, kotlinc main.kt -include-runtime -d app.jar builds a program and java -jar app.jar runs it."],
        big: "A Kotlin program starts at fun main(); println prints; it runs on the JVM, and it's the main language for Android.",
        caption: "kotlinc compiles main.kt, the JVM runs fun main, and the screen says hello. Tap Play.",
        demo: ["$ kotlinc main.kt -include-runtime -d app.jar", "$ java -jar app.jar", "fun main() runs", "Hello, world!"]
      },
      deep: {
        more: ["Kotlin is statically typed: every value has a type known before the program runs, so many mistakes are caught early — but you rarely have to write the types, because Kotlin works them out.",
          "Kotlin can use every Java library directly, so the huge Java world of tools is available from day one."],
        ex: { code: src(["fun main() {", "    // My first Kotlin program", "    println(\"Hello, world!\")", "    println(\"I am learning Kotlin.\")", "    println(2 + 3)", "}"]),
          walk: ["Line 1: the program starts at main.", "Line 2: a comment, skipped by Kotlin.", "Lines 3–4: two lines of text.", "Line 5: Kotlin works out 2 + 3: 5."] },
        mistake: "Putting code outside main and expecting it to run. Only declarations live at the top of a file; the steps of the program go inside fun main()."
      } },
    { title: "Variables and Types", chapter: "Boxes · val, var, Int, Double, String, Boolean, const", line: 'val name = "Ana"',
      content: {
        story: ["val makes a value that can't be reassigned; var makes one that can. Kotlin style is to use val everywhere you can — code with fewer changing parts is easier to follow.",
          "Kotlin works out types from the values: val score = 0 is an Int, 4.99 is a Double, \"Ana\" is a String, true is a Boolean, 'A' is a Char. You can write the type yourself: val price: Double = 4.99.",
          "const val MAX_LIVES = 3 makes a compile-time constant, written in CAPITALS at the top level of a file or inside an object."],
        big: "val can't be reassigned, var can; types are inferred but always there; const val makes true constants.",
        caption: "Two kinds of box: val with its lid locked, var with its lid open. Tap Play.",
        demo: ["val name = \"Ana\" → String", "var score = 0 → Int", "score += 10 ✓", "name = \"Bo\" ✗ val can't change"]
      },
      deep: {
        more: ["Numbers have sizes: Int (about ±2.1 billion), Long for bigger ones (9_000_000_000L), Double for decimals and Float for less precise ones. Underscores make big numbers readable.",
          "Kotlin never converts between number types silently: an Int won't go where a Long is expected. Use toLong(), toDouble() and friends."],
        ex: { code: src(["const val MAX_LIVES = 3", "", "fun main() {", "    val name = \"Ana\"", "    var score = 0", "    val price: Double = 4.99", "    val alive = true", "    val grade = 'A'", "    score += 10", "    println(\"$name $score $price $alive $grade\")", "    println(\"$MAX_LIVES lives\")", "    val stars = 9_000_000_000L", "    println(stars)", "}"]),
          walk: ["Line 1: a constant at the top of the file.", "Lines 4–8: a String, an Int (var), a Double, a Boolean and a Char.", "Line 9: score becomes 10.", "Line 10: Ana 10 4.99 true A.", "Line 11: 3 lives.", "Lines 12–13: a Long holds big numbers: 9000000000."] },
        mistake: "Reassigning a val: val score = 0 then score = 5 stops with “Val cannot be reassigned.” Use var for values that change."
      } },
    { title: "Operators and Math", chapter: "Calculating · + - * / %, conversions, kotlin.math", line: "val average = total.toDouble() / count",
      content: {
        story: ["Kotlin does maths with + - * / and % (the remainder). Dividing two Ints gives an Int, dropping the fraction: 7 / 2 is 3, and 7 % 2 is 1. With a Double on either side the answer is a Double: 7.0 / 2 is 3.5.",
          "Convert numbers with toDouble(), toInt() and friends. Shortcuts change a var in place: hp -= 30, score *= 2, lives++.",
          "import kotlin.math.* brings in sqrt, pow, abs, round and PI. coerceIn keeps a value in a range: 150.coerceIn(0, 100) is 100. maxOf and minOf pick the larger or smaller."],
        big: "Int / Int drops the fraction; convert with toDouble(); kotlin.math and coerceIn handle the rest.",
        caption: "7 divided two ways: 3 with Ints, 3.5 after toDouble(). Tap Play.",
        demo: ["7 / 2 → 3", "7 % 2 → 1", "7.toDouble() / 2 → 3.5", "150.coerceIn(0, 100) → 100"]
      },
      deep: {
        more: ["Int has a fixed size, so going past its maximum wraps around to a negative number. Use Long for very big counts.",
          "Doubles are approximate on every computer: 0.1 + 0.2 is 0.30000000000000004. For money, count whole cents as Ints or Longs."],
        ex: { code: src(["import kotlin.math.sqrt", "", "fun main() {", "    println(7 / 2)", "    println(7 % 2)", "    println(7.0 / 2)", "    val coins = 10", "    val players = 4", "    println(coins.toDouble() / players)", "    println(sqrt(16.0))", "    println(maxOf(3, 9, 4))", "    println(150.coerceIn(0, 100))", "    var hp = 100", "    hp -= 30", "    hp++", "    println(hp)", "}"]),
          walk: ["Line 1: import just the function you need.", "Line 4: Int division: 3.", "Line 5: the remainder: 1.", "Line 6: a Double on one side: 3.5.", "Lines 7–9: convert first: 2.5.", "Line 10: 4.0.", "Line 11: 9.", "Line 12: 100.", "Lines 13–16: 100 − 30 + 1 = 71."] },
        mistake: "Writing val average = total / count with Ints and expecting a decimal. 7 / 2 is 3. Convert first: total.toDouble() / count."
      } },
    { title: "Strings and Templates", chapter: "Text · $templates, string functions, raw strings, format", line: 'println("$name has ${coins * 2} coins")',
      content: {
        story: ["String templates drop values into text: \"Hi, $name\" uses a variable, and \"${coins * 2} coins\" runs any expression inside ${ }.",
          "Strings have dozens of functions: length, uppercase, lowercase, reversed, contains, startsWith, split, trim, replace, repeat, padStart and padEnd. Strings never change; these all return new ones.",
          "Raw strings in triple quotes (\"\"\" … \"\"\") keep line breaks and backslashes as typed; trimIndent tidies their indentation. \"%.2f\".format(3.14159) formats numbers."],
        big: "$name and ${expression} fill text in; string functions return new strings; triple quotes keep text exactly as typed.",
        caption: "A sentence with gaps; $name and ${coins * 2} slide in. Tap Play.",
        demo: ["\"$name has $coins coins\"", "\"${coins * 2} doubled\"", "name.uppercase() → \"ANA\"", "\"%.2f\".format(3.14159) → \"3.14\""]
      },
      deep: {
        more: ["buildString { append(\"a\"); append(1) } builds long text efficiently, piece by piece.",
          "format follows the device's language settings, so a German phone prints 3,14 instead of 3.14. Pass a Locale when the format must never change."],
        ex: { code: src(["fun main() {", "    val name = \"Ana\"", "    val coins = 42", "    println(\"$name has $coins coins, or ${coins * 2} doubled\")", "    println(name.uppercase() + \" \" + name.length + \" \" + name.reversed())", "    println(\"ha\".repeat(3))", "    println(\"gameover\".contains(\"over\"))", "    println(\"red,green,blue\".split(\",\").joinToString(\" | \"))", "    println(\"7\".padStart(3, '0'))", "    val card = \"\"\"", "        Player: $name", "        Coins: $coins", "    \"\"\".trimIndent()", "    println(card)", "}"]),
          walk: ["Line 4: Ana has 42 coins, or 84 doubled.", "Line 5: ANA 3 anA.", "Line 6: hahaha.", "Line 7: true.", "Line 8: red | green | blue.", "Line 9: 007.", "Lines 10–14: a raw string; trimIndent removes the shared indentation."] },
        mistake: "Writing \"$player.name\": the template stops at the dot, so it prints the whole player, then .name. Use \"${player.name}\" for anything with a dot."
      } },
    { title: "Decisions", chapter: "Choosing · if as an expression, when, ranges, is", line: 'val size = if (n > 10) "big" else "small"',
      content: {
        story: ["if runs code when a test is true, with else if and else for other cases. Tests use == (equal), != (not equal), < > <= >=, and combine with && (and), || (or) and ! (not).",
          "In Kotlin, if is an expression: val size = if (n > 10) \"big\" else \"small\" stores the answer. That's why Kotlin has no ?: ternary operator.",
          "when is Kotlin's power tool. It compares a value against branches: \"Sat\", \"Sun\" -> for either, in 90..100 -> for a range, is String -> for a type, and else -> for the rest. It gives back a value too."],
        big: "if and when both give back values; when matches values, ranges and types, with else for the rest.",
        caption: "A score drops into a sorter with slots for 90..100, 80..89 and everything else. Tap Play.",
        demo: ["when (score)", "in 90..100 -> \"A\"", "in 80..89 -> \"B\"", "else -> \"C\""]
      },
      deep: {
        more: ["when without a value works like a tidy chain of if-else tests: when { hp <= 0 -> … ; hp < 20 -> … ; else -> … }.",
          "== compares contents (two strings with the same letters are equal); === checks whether two names point at the very same object."],
        ex: { code: src(["fun main() {", "    val hp = 0", "    if (hp <= 0) {", "        println(\"Game over\")", "    } else if (hp < 20) {", "        println(\"Careful!\")", "    } else {", "        println(\"Keep going\")", "    }", "    val size = if (hp > 10) \"big\" else \"small\"", "    println(size)", "    val score = 85", "    val grade = when (score) {", "        in 90..100 -> \"A\"", "        in 80..89 -> \"B\"", "        else -> \"Keep practicing\"", "    }", "    println(grade)", "    val day = \"Sun\"", "    when (day) {", "        \"Sat\", \"Sun\" -> println(\"Weekend\")", "        else -> println(\"School day\")", "    }", "}"]),
          walk: ["Lines 3–9: hp is 0, so Game over.", "Lines 10–11: if gives back a value: small.", "Lines 13–18: when with ranges: B.", "Lines 20–23: two values share one branch: Weekend."] },
        mistake: "Leaving out else when when must give back a value. Kotlin can't be sure a value comes out, and reports “'when' expression must be exhaustive.”"
      } },
    { title: "Loops and Ranges", chapter: "Repeating · for in ranges, until, downTo, step, while, repeat", line: "for (i in 1..5) println(i)",
      content: {
        story: ["for walks through anything you can count over: for (i in 1..5) includes both ends; 0 until 5 stops before 5; 10 downTo 1 counts backwards; step 2 jumps.",
          "for (item in list) walks a collection, and for ((i, item) in list.withIndex()) gives the position too.",
          "while repeats as long as a test is true, and repeat(3) { … } simply runs a block three times. break leaves a loop and continue skips to the next round."],
        big: "for walks ranges and collections (.., until, downTo, step); while repeats while true; repeat(n) repeats n times.",
        caption: "A counter goes round a track 1..3, then a hop counter jumps backwards by twos. Tap Play.",
        demo: ["for (i in 1..3) → 1 2 3", "0 until 3 → 0 1 2", "6 downTo 0 step 2 → 6 4 2 0", "repeat(2) { … }"]
      },
      deep: {
        more: ["Labels let break leave an outer loop: outer@ for (…) { for (…) { break@outer } }.",
          "Most list jobs read more clearly with collection functions (chapter 13) than with loops — but loops are always there when you need them."],
        ex: { code: src(["fun main() {", "    for (i in 1..3) {", "        println(\"lap $i\")", "    }", "    for (i in 6 downTo 0 step 2) {", "        print(\"$i \")", "    }", "    println()", "    var lives = 3", "    while (lives > 0) {", "        lives--", "    }", "    println(\"lives: $lives\")", "    for (fruit in listOf(\"apple\", \"pear\", \"plum\")) {", "        if (fruit == \"pear\") continue", "        println(fruit)", "    }", "    for ((i, medal) in listOf(\"gold\", \"silver\").withIndex()) {", "        println(\"${i + 1}: $medal\")", "    }", "    repeat(2) { println(\"Hooray!\") }", "}"]),
          walk: ["Lines 2–4: lap 1, lap 2, lap 3.", "Lines 5–8: 6 4 2 0.", "Lines 9–13: lives: 0.", "Lines 14–17: continue skips pear: apple, plum.", "Lines 18–20: 1: gold, 2: silver.", "Line 21: Hooray! twice."] },
        mistake: "Expecting 0 until 5 to include 5. until stops before the end; use 0..5 to include it."
      } },
    { title: "Lists", chapter: "Collections · listOf, mutableListOf, add, indices, sorted", line: "val scores = listOf(10, 20, 30)",
      content: {
        story: ["listOf(10, 20, 30) makes a read-only List: you can read it but not change it. Positions count from 0, so scores[0] is 10. size counts the items.",
          "mutableListOf makes a list you can change: add, remove, set items with team[0] = \"Bo\", and clear.",
          "Lists know a lot: first(), last(), contains, indexOf, sorted(), reversed(), max(), min(), sum(). Reading past the end throws an exception; getOrNull(9) returns null instead."],
        big: "listOf is read-only, mutableListOf can change; lists count from 0 and come with functions for most jobs.",
        caption: "A row of numbered boxes grows by one in the mutable list, while the read-only one stays locked. Tap Play.",
        demo: ["val scores = listOf(30, 10, 20)", "scores.sorted() → [10, 20, 30]", "team.add(\"Leo\")", "scores.getOrNull(9) → null"]
      },
      deep: {
        more: ["Read-only lists make code safer: a function that takes a List can't change your data behind your back.",
          "sorted() returns a new list; sort() sorts a mutable list in place."],
        ex: { code: src(["fun main() {", "    val scores = listOf(30, 10, 20)", "    println(\"${scores.size} scores, first ${scores[0]}, last ${scores.last()}\")", "    println(scores.sorted())", "    println(\"max ${scores.max()}, min ${scores.min()}, sum ${scores.sum()}\")", "    println(scores.contains(20))", "    println(scores.getOrNull(9))", "    val team = mutableListOf(\"Ana\")", "    team.add(\"Leo\")", "    team.add(\"Mia\")", "    team.remove(\"Leo\")", "    team[0] = \"Bo\"", "    println(team)", "}"]),
          walk: ["Lines 2–3: 3 scores, first 30, last 20.", "Line 4: a new sorted list: [10, 20, 30].", "Line 5: max 30, min 10, sum 60.", "Line 6: true.", "Line 7: past the end gives null.", "Lines 8–13: a mutable list changes: [Bo, Mia]."] },
        mistake: "Calling add on a listOf list. Read-only lists have no add function, so the compiler stops you. Use mutableListOf."
      } },
    { title: "Maps and Sets", chapter: "Lookups · mapOf, to, mutableMapOf, getOrDefault, setOf", line: 'val ages = mapOf("Ana" to 12, "Leo" to 11)',
      content: {
        story: ["A Map links keys to values: mapOf(\"Ana\" to 12, \"Leo\" to 11). Read with ages[\"Ana\"]; a missing key gives null, and getOrDefault gives a default instead.",
          "mutableMapOf makes a map you can change: ages[\"Mia\"] = 10 adds or replaces, and remove takes a key out. for ((name, age) in ages) walks every pair.",
          "A Set holds each value only once: setOf(\"red\", \"blue\", \"red\") has two items. Sets are perfect for “have we seen this before?”"],
        big: "Maps look values up by key (with to making pairs); sets keep each value once.",
        caption: "A cabinet of labelled drawers; open one by name, or get a default if it's missing. Tap Play.",
        demo: ["ages[\"Ana\"] → 12", "ages[\"Mia\"] = 10", "ages.getOrDefault(\"Zed\", 0) → 0", "setOf(\"a\", \"a\").size → 1"]
      },
      deep: {
        more: ["Counting is easy with getOrDefault: counts[word] = counts.getOrDefault(word, 0) + 1. groupingBy { it }.eachCount() does a whole list at once.",
          "Maps keep the order you added keys in. toSortedMap() gives one sorted by key."],
        ex: { code: src(["fun main() {", "    val ages = mutableMapOf(\"Ana\" to 12, \"Leo\" to 11)", "    ages[\"Mia\"] = 10", "    ages[\"Leo\"] = ages.getValue(\"Leo\") + 1", "    println(\"${ages[\"Leo\"]} ${ages.size}\")", "    println(ages[\"Zed\"])", "    println(ages.getOrDefault(\"Zed\", 0))", "    ages.remove(\"Mia\")", "    for ((name, age) in ages) {", "        println(\"$name: $age\")", "    }", "    val counts = mutableMapOf<String, Int>()", "    for (word in listOf(\"go\", \"kotlin\", \"go\")) {", "        counts[word] = counts.getOrDefault(word, 0) + 1", "    }", "    println(counts)", "    println(setOf(\"red\", \"blue\", \"red\").size)", "}"]),
          walk: ["Lines 2–5: add Mia, add one to Leo: 12 3.", "Line 6: a missing key gives null.", "Line 7: getOrDefault gives 0.", "Lines 8–11: remove Mia, then walk the pairs: Ana: 12, Leo: 12.", "Lines 12–16: count words: {go=2, kotlin=1}.", "Line 17: a set keeps red once: 2."] },
        mistake: "Using ages[\"Ana\"] + 1 directly. ages[\"Ana\"] might be null, so Kotlin refuses. Use getValue (which throws if missing) or getOrDefault."
      } },
    { title: "Functions", chapter: "Machines · fun, return types, defaults, named arguments, = expressions", line: "fun add(a: Int, b: Int) = a + b",
      content: {
        story: ["fun add(a: Int, b: Int): Int { return a + b } defines a function: parameters need types, and the type after the brackets is what comes back. A one-line function can use =: fun add(a: Int, b: Int) = a + b.",
          "Parameters can have defaults: fun greet(name: String = \"friend\"). Named arguments say which value is which: greet(name = \"Ana\", excited = true), in any order.",
          "A function that returns nothing returns Unit — you don't need to write it. Functions can live at the top level of a file; they don't have to belong to a class."],
        big: "fun takes typed parameters (with defaults) and returns a typed value; = makes one-liners; named arguments make calls clear.",
        caption: "A machine with labelled slots: excited = true goes in by name, the greeting comes out. Tap Play.",
        demo: ["fun add(a: Int, b: Int) = a + b", "add(2, 3) → 5", "greet() → Hi, friend.", "greet(name = \"Ana\", excited = true)"]
      },
      deep: {
        more: ["vararg lets a function take any number of arguments: fun total(vararg nums: Int) = nums.sum().",
          "Functions are values too: ::add refers to the function itself, ready to pass to another function."],
        ex: { code: src(["fun add(a: Int, b: Int) = a + b", "", "fun greet(name: String = \"friend\", excited: Boolean = false): String {", "    val end = if (excited) \"!\" else \".\"", "    return \"Hi, $name$end\"", "}", "", "fun divmod(a: Int, b: Int): Pair<Int, Int> = Pair(a / b, a % b)", "", "fun total(vararg nums: Int) = nums.sum()", "", "fun main() {", "    println(add(2, 3))", "    println(greet())", "    println(greet(name = \"Ana\", excited = true))", "    val (q, r) = divmod(17, 5)", "    println(\"$q $r\")", "    println(total(1, 2, 3, 4))", "}"]),
          walk: ["Line 1: a one-line function.", "Lines 3–6: defaults, and a String result.", "Line 8: a Pair returns two values.", "Line 10: vararg takes any number of Ints.", "Line 13: 5.", "Lines 14–15: Hi, friend. and Hi, Ana!", "Lines 16–17: unpack the pair: 3 2.", "Line 18: 10."] },
        mistake: "Forgetting the parameter types: fun add(a, b) is an error. Every parameter needs a type."
      } },
    { title: "Null Safety", chapter: "No more null crashes · String?, ?., ?:, let, !!", line: "val length = nickname?.length ?: 0",
      content: {
        story: ["In many languages, using a missing (null) value crashes the program. Kotlin stops this before the program runs: a plain String can never be null. Only a String? (with a question mark) can.",
          "To use a nullable value, handle the null. ?. calls only when there's a value: nickname?.length is null if nickname is. ?: supplies a default: nickname?.length ?: 0.",
          "After if (nickname != null), Kotlin smart-casts it to a plain String inside the if. ?.let { … } runs a block only when the value is there. !! says “I'm sure it isn't null” — and crashes if you're wrong, so use it rarely."],
        big: "Only types with ? can be null; ?., ?: and let handle the null safely; !! crashes if you're wrong.",
        caption: "A box marked String? may be empty; ?. peeks safely, ?: hands over a spare. Tap Play.",
        demo: ["val nick: String? = null", "nick?.length → null", "nick?.length ?: 0 → 0", "nick!!.length → crash!"]
      },
      deep: {
        more: ["Functions that might find nothing return nullable types: \"42\".toIntOrNull() is 42, but \"abc\".toIntOrNull() is null — no exception.",
          "Java code doesn't say whether things can be null, so values from Java libraries need extra care."],
        ex: { code: src(["fun findPlayer(id: Int): String? = if (id == 1) \"Ana\" else null", "", "fun main() {", "    val found = findPlayer(1)", "    val missing = findPlayer(2)", "    println(found?.length)", "    println(missing?.length)", "    println(missing?.length ?: 0)", "    if (found != null) {", "        println(found.uppercase())", "    }", "    missing?.let { println(\"never printed: $it\") }", "    found?.let { println(\"found $it\") }", "    println(\"42\".toIntOrNull())", "    println(\"abc\".toIntOrNull() ?: -1)", "}"]),
          walk: ["Line 1: the result might be null, so the type is String?.", "Lines 6–7: 3, then null.", "Line 8: the Elvis operator gives 0.", "Lines 9–11: inside the if, found is smart-cast to String: ANA.", "Lines 12–13: let runs only when there's a value: found Ana.", "Lines 14–15: 42, then -1."] },
        mistake: "Sprinkling !! to silence the compiler. It brings back exactly the crash Kotlin was protecting you from. Handle the null instead."
      } },
    { title: "Classes and Objects", chapter: "Blueprints · class, constructors, properties, data class, copy", line: "class Player(val name: String, var hp: Int = 100)",
      content: {
        story: ["class Player(val name: String, var hp: Int = 100) declares a class and its properties in one line. Build one with Player(\"Ana\") — Kotlin has no new keyword.",
          "Functions inside the class are its methods; they can read and change its properties. init { … } runs extra setup when an object is built, and private keeps a property inside the class.",
          "A data class holds data and gets useful functions for free: a readable toString, equals that compares contents, and copy to make a changed copy: point.copy(x = 5)."],
        big: "Classes declare properties in their constructor; methods act on them; data classes get toString, equals and copy free.",
        caption: "A Player blueprint stamps out two heroes; a data class prints itself neatly. Tap Play.",
        demo: ["class Player(val name: String)", "val ana = Player(\"Ana\")", "ana.hurt(30)", "Point(1, 2).copy(x = 5)"]
      },
      deep: {
        more: ["Properties can have custom getters: val isAlive get() = hp > 0 is worked out each time it's read.",
          "Destructuring works on data classes: val (x, y) = point."],
        ex: { code: src(["class Player(val name: String, var hp: Int = 100) {", "    private var level = 1", "", "    fun hurt(damage: Int) {", "        hp = (hp - damage).coerceAtLeast(0)", "    }", "", "    fun levelUp() {", "        level++", "    }", "", "    fun describe() = \"$name (level $level, $hp HP)\"", "}", "", "data class Point(val x: Int, val y: Int)", "", "fun main() {", "    val ana = Player(\"Ana\")", "    ana.hurt(30)", "    ana.levelUp()", "    println(ana.describe())", "    val start = Point(1, 2)", "    val moved = start.copy(x = 5)", "    println(\"$start $moved ${start == Point(1, 2)}\")", "    val (x, y) = moved", "    println(x + y)", "}"]),
          walk: ["Lines 1–13: the Player class; name and hp are properties.", "Line 2: private — only Player can change level.", "Lines 4–6: health never drops below 0.", "Line 15: a data class.", "Lines 18–21: Ana (level 2, 70 HP).", "Lines 22–24: Point(x=1, y=2) Point(x=5, y=2) true.", "Lines 25–26: destructuring: 7."] },
        mistake: "Writing new Player(\"Ana\") from Java habit. Kotlin has no new; just call the class like a function."
      } },
    { title: "Inheritance and Interfaces", chapter: "Families · open, override, abstract, interface, sealed", line: "sealed interface Shape",
      content: {
        story: ["Kotlin classes are closed by default: you can't inherit from them unless they're marked open. class Wizard(name: String) : Player(name) inherits, and override fun replaces an open function.",
          "An interface lists functions a class promises to have, and can give some of them a default body. A class can implement many interfaces.",
          "A sealed interface (or sealed class) has a fixed set of subtypes known to the compiler. A when over it can cover every case with no else — and if you add a new subtype later, the compiler points at every when you need to update."],
        big: "open allows inheritance, override replaces, interfaces promise functions, and sealed types make when exhaustive.",
        caption: "A sealed Shape with three kinds; a when handles each one, no else needed. Tap Play.",
        demo: ["sealed interface Shape", "data class Circle(val r: Double) : Shape", "when (s) { is Circle -> … }", "no else needed"]
      },
      deep: {
        more: ["abstract classes can't be built directly and can leave functions for children to fill in.",
          "Prefer interfaces and composition to deep inheritance — closed-by-default nudges Kotlin code that way."],
        ex: { code: src(["import kotlin.math.PI", "", "sealed interface Shape {", "    fun name(): String", "}", "", "data class Circle(val r: Double) : Shape {", "    override fun name() = \"circle\"", "}", "", "data class Rect(val w: Double, val h: Double) : Shape {", "    override fun name() = \"rectangle\"", "}", "", "fun area(shape: Shape): Double = when (shape) {", "    is Circle -> PI * shape.r * shape.r", "    is Rect -> shape.w * shape.h", "}", "", "open class Player(val name: String) {", "    open fun describe() = \"$name the adventurer\"", "}", "", "class Wizard(name: String, val mana: Int) : Player(name) {", "    override fun describe() = super.describe() + \" with $mana mana\"", "}", "", "fun main() {", "    for (shape in listOf(Circle(1.0), Rect(2.0, 3.0))) {", "        println(\"${shape.name()}: ${\"%.2f\".format(area(shape))}\")", "    }", "    println(Wizard(\"Leo\", 50).describe())", "}"]),
          walk: ["Lines 3–13: a sealed interface with two kinds of shape.", "Lines 15–18: when covers every kind, so no else is needed; is smart-casts.", "Lines 20–26: open lets Wizard inherit; super calls the parent.", "Lines 29–31: circle: 3.14, rectangle: 6.00.", "Line 32: Leo the adventurer with 50 mana."] },
        mistake: "Inheriting from a class that isn't open: Kotlin stops with “This type is final, so it cannot be inherited from.” Add open to the parent."
      } },
    { title: "Lambdas and Collections", chapter: "Pipelines · lambdas, it, map, filter, sumOf, sortedBy, groupBy", line: "val evens = nums.filter { it % 2 == 0 }",
      content: {
        story: ["A lambda is a small unnamed function in braces: { x: Int -> x * 2 }. When it has one parameter, Kotlin names it it: nums.map { it * 2 }.",
          "Collections have functions that take lambdas: map transforms each item, filter keeps some, sumOf adds up a value from each, count, any and all ask questions, and sortedBy, maxByOrNull and groupBy organize.",
          "When a lambda is the last argument, it goes outside the brackets — a trailing lambda: list.forEach { println(it) }. Chains read like sentences: players.filter { it.hp > 0 }.sortedBy { it.name }."],
        big: "Lambdas are tiny functions in braces (it is the single parameter); collection functions chain them into pipelines.",
        caption: "Numbers ride a conveyor: kept if even, squared, then summed. Tap Play.",
        demo: ["nums.filter { it % 2 == 0 }", ".map { it * it }", ".sum() → 56", "players.sortedByDescending { it.score }"]
      },
      deep: {
        more: ["Lambdas can use and change variables around them (closures).",
          "For very long chains over big data, asSequence() works item by item instead of building a list at every step — see the generics chapter."],
        ex: { code: src(["data class Player(val name: String, val score: Int)", "", "fun main() {", "    val nums = (1..6).toList()", "    println(nums.map { it * 2 })", "    println(nums.filter { it % 2 == 0 })", "    println(nums.filter { it % 2 == 0 }.map { it * it }.sum())", "    val players = listOf(Player(\"Ana\", 120), Player(\"Leo\", 150), Player(\"Mia\", 95))", "    println(players.sortedByDescending { it.score }.joinToString { it.name })", "    println(players.maxByOrNull { it.score }?.name)", "    println(players.sumOf { it.score })", "    println(players.any { it.score > 140 })", "    println(listOf(\"apple\", \"avocado\", \"pear\").groupBy { it.first() })", "    val double = { x: Int -> x * 2 }", "    println(double(21))", "}"]),
          walk: ["Line 5: [2, 4, 6, 8, 10, 12].", "Line 6: [2, 4, 6].", "Line 7: 4 + 16 + 36 = 56.", "Lines 8–9: highest score first: Leo, Ana, Mia.", "Line 10: Leo.", "Line 11: 365.", "Line 12: true.", "Line 13: grouped by first letter: {a=[apple, avocado], p=[pear]}.", "Lines 14–15: a lambda in a variable: 42."] },
        mistake: "Using forEach when you want the results. forEach returns nothing; map returns the new list."
      } },
    { title: "Errors and Exceptions", chapter: "Safety nets · try, catch, finally, throw, require, runCatching", line: "try { risky() } catch (e: IllegalStateException) { println(e.message) }",
      content: {
        story: ["When something goes wrong, code throws an exception: throw IllegalArgumentException(\"price can't be negative\"). try { … } catch (e: IllegalArgumentException) { … } handles it; finally runs afterwards either way.",
          "require(condition) { \"message\" } checks arguments and check(condition) checks state; each throws with your message when the condition is false. They make your intentions clear.",
          "try is an expression, so it can give back a value: val n = try { text.toInt() } catch (e: NumberFormatException) { 0 }. Often a null-returning function is simpler still: text.toIntOrNull() ?: 0."],
        big: "throw signals a problem, try/catch handles it, require and check guard your assumptions, and try can give back a value.",
        caption: "A function throws a red flag; the catch net below grabs it. Tap Play.",
        demo: ["require(price >= 0) { \"…\" }", "try { spend(…) }", "catch (e: IllegalArgumentException)", "finally { … }"]
      },
      deep: {
        more: ["runCatching { … } wraps a result or an exception in a Result object: getOrDefault, getOrNull and onFailure handle it without try.",
          "Make your own exception types by extending Exception: class OutOfCoinsException(message: String) : Exception(message)."],
        ex: { code: src(["class OutOfCoinsException(message: String) : Exception(message)", "", "fun spend(coins: Int, price: Int): Int {", "    require(price >= 0) { \"price can't be negative\" }", "    if (price > coins) throw OutOfCoinsException(\"need $price, have $coins\")", "    return coins - price", "}", "", "fun main() {", "    for (price in listOf(30, 80, -5)) {", "        try {", "            val left = spend(50, price)", "            println(\"left: $left\")", "        } catch (e: OutOfCoinsException) {", "            println(\"too expensive: ${e.message}\")", "        } catch (e: IllegalArgumentException) {", "            println(\"bad price: ${e.message}\")", "        } finally {", "            println(\"(checked $price)\")", "        }", "    }", "    val n = try {", "        \"abc\".toInt()", "    } catch (e: NumberFormatException) {", "        -1", "    }", "    println(n)", "    println(runCatching { \"42\".toInt() }.getOrDefault(0))", "}"]),
          walk: ["Line 1: a custom exception type.", "Lines 3–7: require throws IllegalArgumentException; the other problem gets its own type.", "Lines 10–21: left: 20; too expensive: need 80, have 50; bad price: price can't be negative — each followed by (checked …) from finally.", "Lines 22–27: try gives back a value: -1.", "Line 28: runCatching: 42."] },
        mistake: "Catching Exception everywhere and printing nothing. The problem disappears silently, and the bug is much harder to find later."
      } },
    { title: "Extensions, Objects and Enums", chapter: "Kotlin specials · extension functions, object, companion, enum class", line: 'fun String.shout() = uppercase() + "!"',
      content: {
        story: ["An extension function adds a function to a type you don't own: fun String.shout() = uppercase() + \"!\" lets you write \"hi\".shout(). Inside, this is the string. Kotlin's own standard library is built largely from extensions.",
          "object declares a single object — a singleton — in one step: object Settings { var volume = 5 }. A companion object inside a class holds things that belong to the class itself, like factory functions: Player.create(\"Ana\").",
          "enum class Direction { UP, DOWN, LEFT, RIGHT } lists fixed choices. Enums can have properties and functions, and when over an enum can be exhaustive."],
        big: "Extensions add functions to existing types, object makes a singleton, companion holds class-level helpers, and enum class lists fixed choices.",
        caption: "A plain String gains a new shout() button; an enum lists four arrows. Tap Play.",
        demo: ["fun String.shout() = …", "\"hi\".shout() → \"HI!\"", "object Settings { … }", "enum class Direction { UP, … }"]
      },
      deep: {
        more: ["Extensions don't really change the class — they're ordinary functions with a convenient call style, so they can't reach private members.",
          "Enum entries have name and ordinal, and Direction.entries lists them all."],
        ex: { code: src(["fun String.shout() = uppercase() + \"!\"", "", "fun Int.isEven() = this % 2 == 0", "", "object Settings {", "    var volume = 5", "}", "", "class Player private constructor(val name: String) {", "    companion object {", "        fun create(name: String) = Player(name.trim().replaceFirstChar { it.uppercase() })", "    }", "}", "", "enum class Direction(val dx: Int, val dy: Int) {", "    UP(0, -1),", "    DOWN(0, 1),", "    LEFT(-1, 0),", "    RIGHT(1, 0),", "}", "", "fun main() {", "    println(\"hi\".shout())", "    println(4.isEven())", "    Settings.volume += 2", "    println(Settings.volume)", "    println(Player.create(\"  ana \").name)", "    val d = Direction.LEFT", "    println(\"${d.name} moves ${d.dx},${d.dy}\")", "    println(Direction.entries.joinToString())", "}"]),
          walk: ["Lines 1–3: extension functions on String and Int.", "Lines 5–7: a single Settings object.", "Lines 9–13: the constructor is private; the companion's create builds players tidily.", "Lines 15–20: an enum with properties.", "Lines 23–24: HI! and true.", "Lines 25–26: 7.", "Line 27: Ana.", "Lines 28–29: LEFT moves -1,0.", "Line 30: UP, DOWN, LEFT, RIGHT."] },
        mistake: "Expecting an extension to override a real member function. If the class already has a function with that name, the member always wins."
      } },
    { title: "Generics, Sequences and Real Projects", chapter: "Real projects · generics, sequences, Gradle, Android, coroutines", line: "fun <T> List<T>.second(): T = this[1]",
      content: {
        story: ["Generics let one function or class work for many types: fun <T> List<T>.second(): T works for a list of anything. class Box<T>(val item: T) holds any kind of item, and constraints like <T : Comparable<T>> require abilities.",
          "A Sequence works item by item instead of building a whole list at each step, so long chains — or endless ones like generateSequence(1) { it * 2 } — stay fast. take(5) stops it.",
          "Real Kotlin projects are built with Gradle, usually in IntelliJ IDEA or Android Studio. Android apps use Jetpack Compose for screens, and the kotlinx.coroutines library (suspend, launch, async) for work that waits, like network calls."],
        big: "Generics make code work for any type, sequences process lazily, and Gradle, Compose and coroutines power real Kotlin apps.",
        caption: "One mould labelled <T> casts boxes of Ints and Strings; a sequence pours out doubling numbers until take(5). Tap Play.",
        demo: ["fun <T> List<T>.second(): T", "Box(\"gem\").item", "generateSequence(1) { it * 2 }", ".take(5) → 1 2 4 8 16"]
      },
      deep: {
        more: ["Coroutines aren't part of the core language library: add org.jetbrains.kotlinx:kotlinx-coroutines-core to a Gradle project. A suspend function can pause without blocking a thread.",
          "Kotlin Multiplatform shares the same code between Android, iOS, desktop and the web."],
        ex: { code: src(["fun <T> List<T>.second(): T = this[1]", "", "class Box<T>(val item: T) {", "    fun <R> map(transform: (T) -> R): Box<R> = Box(transform(item))", "}", "", "fun <T : Comparable<T>> largest(a: T, b: T): T = if (a > b) a else b", "", "fun main() {", "    println(listOf(\"Ana\", \"Leo\", \"Mia\").second())", "    val box = Box(\"gem\").map { it.length }", "    println(box.item)", "    println(\"${largest(3, 9)} ${largest(\"apple\", \"pear\")}\")", "    val doubles = generateSequence(1) { it * 2 }.take(5).toList()", "    println(doubles)", "    val firstBigSquare = (1..1_000_000).asSequence().map { it * it }.first { it > 50 }", "    println(firstBigSquare)", "}"]),
          walk: ["Line 1: a generic extension function.", "Lines 3–5: a generic class with a generic map.", "Line 7: T must be Comparable, so > works.", "Line 10: Leo.", "Lines 11–12: Box<String> becomes Box<Int>: 3.", "Line 13: 9 pear.", "Lines 14–15: [1, 2, 4, 8, 16].", "Lines 16–17: the sequence stops at the first square over 50: 64 — without squaring a million numbers."] },
        mistake: "Turning a huge range into a list before filtering. (1..1_000_000).map { … } builds a million-item list; asSequence() avoids it."
      } }
  ];

  var shelves = [
    { title: "Standard Library Field Guide", chapter: "Beyond the basics · Kotlin shelf", line: ["import kotlin.math.*", "buildString { append(\"hi\") }"],
      content: {
        story: ["Kotlin's standard library is rich: strings, collections, ranges, kotlin.math, Regex, buildString, and scope functions like let and apply. Everything is documented at kotlinlang.org/api.",
          "Because Kotlin runs on the JVM, all of Java's library is available too: java.time for dates, java.io.File for files, java.util.Random and more.",
          "In IntelliJ or Android Studio, type a value followed by a dot to see every function it offers."],
        big: "Kotlin's library covers strings, collections, maths and regex, and every Java library is available too.",
        caption: "A workshop wall of labelled toolboxes: strings, collections, math, regex, java.time. Tap Play.",
        demo: ["\"a-b\".split(\"-\")", "list.chunked(2)", "Regex(\"\\\\d+\").findAll(text)", "LocalDate.of(2025, 3, 1)"]
      },
      deep: {
        more: ["Many functions come in pairs: first() throws if empty, firstOrNull() gives null. Choose the OrNull version when nothing is a normal outcome.",
          "kotlin.random.Random.nextInt(1, 7) rolls a die — fine for games, not for secrets."],
        ex: { code: src(["import java.time.LocalDate", "import kotlin.math.roundToInt", "", "fun main() {", "    println(\"ruby-is-fun\".split(\"-\").joinToString(\" \") { it.replaceFirstChar(Char::uppercase) })", "    println((1..7).chunked(3))", "    println(listOf(3, 9, 1).sorted().take(2))", "    println(Regex(\"\\\\d+\").findAll(\"a1b22c333\").map { it.value }.toList())", "    println(buildString { repeat(3) { append(it) } })", "    println(2.6.roundToInt())", "    val day = LocalDate.of(2025, 3, 1)", "    println(\"${day.dayOfWeek} ${day.plusDays(7)}\")", "    println(listOf<Int>().firstOrNull())", "}"]),
          walk: ["Line 5: Ruby Is Fun.", "Line 6: [[1, 2, 3], [4, 5, 6], [7]].", "Line 7: [1, 3].", "Line 8: every run of digits: [1, 22, 333].", "Line 9: 012.", "Line 10: 3.", "Lines 11–12: Java's LocalDate from Kotlin: SATURDAY 2025-03-08.", "Line 13: null instead of an exception."] },
        mistake: "Writing your own sorting, splitting or date maths. The library versions are tested and fast; yours isn't yet."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · Kotlin shelf", line: ["Exception in thread \"main\" java.lang.NullPointerException", "at MainKt.main(Main.kt:7)"],
      content: {
        story: ["Kotlin catches most mistakes at compile time: type mismatches, nullable values used unsafely, missing when branches. Read the first error first — its file, line and column point right at the problem.",
          "At run time, the stack trace starts with the exception type and message, then lists functions from newest to oldest with file names and line numbers. Find the first line that's in your own code.",
          "Common culprits: !! on a null (NullPointerException), list[9] on a short list (IndexOutOfBoundsException), \"abc\".toInt() (NumberFormatException), and a failed require or check. println debugging works, and the IntelliJ debugger lets you pause and look at every variable."],
        big: "Read the first compile error; for crashes, read the exception and find the first stack-trace line in your code.",
        caption: "A magnifying glass follows a stack trace down to the line with the !!. Tap Play.",
        demo: ["NullPointerException", "at MainKt.main(Main.kt:7)", "line 7: nick!!.length", "→ nick?.length ?: 0"]
      },
      deep: {
        more: ["check and require messages show up in the exception, so good messages make bugs explain themselves.",
          "error(\"message\") throws an IllegalStateException in one call — handy in impossible branches."],
        ex: { code: src(["fun safeGet(items: List<Int>, i: Int): Int? = items.getOrNull(i)", "", "fun main() {", "    val items = listOf(10, 20, 30)", "    println(\"${safeGet(items, 1)} ${safeGet(items, 5)}\")", "    val result = runCatching { items[5] }", "    println(result.exceptionOrNull()?.javaClass?.simpleName)", "    val parsed = \"12a\".toIntOrNull()", "    println(parsed ?: \"not a number\")", "    val checked = runCatching { check(items.size > 5) { \"need more items, have ${items.size}\" } }", "    println(checked.exceptionOrNull()?.message)", "}"]),
          walk: ["Lines 1, 5: getOrNull avoids the crash: 20 null.", "Lines 6–7: indexing past the end throws: ArrayIndexOutOfBoundsException.", "Lines 8–9: not a number.", "Lines 10–11: check's message explains the problem: need more items, have 3."] },
        mistake: "Silencing a nullable warning with !! to make the code compile. The compiler was pointing at a real case you haven't handled."
      } },
    { title: "Testing Your Code", chapter: "Beyond the basics · Kotlin shelf", line: ["@Test fun gradesEachBand() { … }", "assertEquals(\"A\", grade(95))"],
      content: {
        story: ["Tests are small programs that check your code gives the right answers. In a Kotlin project, kotlin.test (with JUnit underneath) runs them: mark a function @Test and check results with assertEquals(expected, actual).",
          "Gradle runs every test with ./gradlew test, and IntelliJ shows a green tick or a red cross beside each one.",
          "Test the usual case and the edges — boundaries, empty lists, zero, null — and check that bad input throws with assertFailsWith<IllegalArgumentException> { … }."],
        big: "@Test functions with assertEquals check your code; Gradle and IntelliJ run them; test the edges as well as the usual case.",
        caption: "A checklist of cases gets ticked one by one: 95 → A, 85 → B, 40 → C. Tap Play.",
        demo: ["@Test fun gradesEachBand()", "assertEquals(\"A\", grade(95)) ✓", "assertFailsWith<…> { grade(-1) } ✓", "$ ./gradlew test → BUILD SUCCESSFUL"]
      },
      deep: {
        more: ["A table of cases keeps tests short: listOf(95 to \"A\", 85 to \"B\").forEach { (score, want) -> assertEquals(want, grade(score)) }.",
          "This example checks itself with check() so it runs anywhere; in a Gradle project the same cases go in a test class."],
        ex: { code: src(["fun grade(score: Int): String {", "    require(score in 0..100) { \"score must be 0-100\" }", "    return when (score) {", "        in 90..100 -> \"A\"", "        in 80..89 -> \"B\"", "        else -> \"C\"", "    }", "}", "", "fun main() {", "    val cases = listOf(95 to \"A\", 90 to \"A\", 89 to \"B\", 40 to \"C\")", "    for ((score, want) in cases) {", "        val got = grade(score)", "        check(got == want) { \"grade($score) = $got, want $want\" }", "    }", "    val refused = runCatching { grade(101) }.exceptionOrNull() is IllegalArgumentException", "    check(refused) { \"grade(101) should be refused\" }", "    println(\"${cases.size + 1} checks passed\")", "}"]),
          walk: ["Lines 1–8: the code under test; require refuses bad scores.", "Line 11: a table of cases, including the boundaries 90 and 89.", "Lines 12–15: each case is checked; a failure stops with a clear message.", "Lines 16–17: bad input must be refused.", "Line 18: 5 checks passed."] },
        mistake: "Only testing the easy case. Bugs live at the edges — 89 versus 90 — so test those."
      } },
    { title: "Java Interop", chapter: "Beyond the basics · Kotlin shelf", line: ["import java.time.LocalDate", "val sb = StringBuilder()"],
      content: {
        story: ["Kotlin and Java live side by side. Kotlin calls Java classes as if they were Kotlin — java.time, java.io, java.util and every Java library from Maven Central — and Java can call Kotlin back.",
          "Java getters and setters become Kotlin properties: date.getYear() is just date.year. Java methods that take a single-function interface accept a Kotlin lambda.",
          "Java doesn't say whether values can be null, so Kotlin marks them as “platform types.” Treat values from Java as possibly null unless the documentation promises otherwise."],
        big: "Kotlin uses Java libraries directly; getters become properties, lambdas fit Java interfaces, and Java values may be null.",
        caption: "A bridge between two islands: Kotlin on one side, the whole Java library on the other. Tap Play.",
        demo: ["LocalDate.of(2025, 3, 1)", "date.year (getYear())", "Collections.max(list)", "Thread { … }.start()"]
      },
      deep: {
        more: ["Android itself is written largely in Java, which is why Kotlin's smooth interop made it Google's preferred language.",
          "Annotations like @JvmStatic and @JvmOverloads make Kotlin code friendlier to call from Java."],
        ex: { code: src(["import java.time.LocalDate", "import java.time.temporal.ChronoUnit", "import java.util.Collections", "", "fun main() {", "    val start = LocalDate.of(2025, 3, 1)", "    val end = LocalDate.of(2025, 12, 25)", "    println(\"${start.year} ${start.month} ${start.dayOfMonth}\")", "    println(ChronoUnit.DAYS.between(start, end))", "    println(Collections.max(listOf(4, 9, 2)))", "    val sb = StringBuilder()", "    sb.append(\"Kotlin\").append(\" + \").append(\"Java\")", "    println(sb)", "    val names = java.util.ArrayList<String>()", "    names.add(\"Ana\")", "    names.add(\"Leo\")", "    names.sortWith(Comparator { a, b -> b.compareTo(a) })", "    println(names)", "}"]),
          walk: ["Lines 6–8: getYear() reads as .year: 2025 MARCH 1.", "Line 9: 299 days from March 1 to Christmas.", "Line 10: a Java utility: 9.", "Lines 11–13: Java's StringBuilder: Kotlin + Java.", "Lines 14–18: a Java ArrayList sorted with a Kotlin lambda: [Leo, Ana]."] },
        mistake: "Assuming a Java method never returns null. If it can, Kotlin won't stop you — handle the null yourself."
      } },
    { title: "Scope Functions", chapter: "Beyond the basics · Kotlin shelf", line: ["player?.let { println(it.name) }", "val p = Player().apply { hp = 50 }"],
      content: {
        story: ["Scope functions run a block of code with an object close at hand. There are five: let, run, with, apply and also. They differ in two ways: is the object it or this inside the block, and does the call give back the object or the block's result?",
          "let (it, returns the result) is great with ?. for nullable values: name?.let { println(it) }. apply (this, returns the object) sets up a new object: Player().apply { hp = 50 }.",
          "also (it, returns the object) adds a side step like logging; run and with (this, return the result) compute something from an object's properties."],
        big: "let, run, with, apply and also run a block on an object; they differ in it-versus-this and in what they return.",
        caption: "Five helpers each hold the object differently: let and also pass it, run, with and apply step inside it. Tap Play.",
        demo: ["x?.let { … } → result", "obj.apply { … } → obj", "obj.also { log(it) } → obj", "with(obj) { … } → result"]
      },
      deep: {
        more: ["Don't nest scope functions deeply — it and this become confusing. A plain variable is often clearer.",
          "takeIf { condition } returns the object or null, and pairs nicely with ?.let."],
        ex: { code: src(["class Player {", "    var name = \"\"", "    var hp = 100", "}", "", "fun main() {", "    val ana = Player().apply {", "        name = \"Ana\"", "        hp = 70", "    }", "    val label = ana.let { \"${it.name}: ${it.hp} HP\" }", "    println(label)", "    val total = with(ana) { hp + name.length }", "    println(total)", "    val leo = Player().also { it.name = \"Leo\" }.also { println(\"made ${it.name}\") }", "    println(leo.hp)", "    val nickname: String? = null", "    println(nickname?.let { it.uppercase() } ?: \"no nickname\")", "    println(ana.takeIf { it.hp > 50 }?.name)", "}"]),
          walk: ["Lines 7–10: apply sets up the new object and returns it.", "Lines 11–12: let computes a value: Ana: 70 HP.", "Lines 13–14: with reads properties directly: 73.", "Lines 15–16: also does side steps and returns the object: made Leo, then 100.", "Lines 17–18: let with ?. skips the null: no nickname.", "Line 19: takeIf keeps Ana because hp > 50: Ana."] },
        mistake: "Using apply when you want a computed result. apply always returns the object itself; use let or run to return something else."
      } }
  ];

  var glossary = [
    ["!! (not-null assertion)", "Says a value isn't null, and crashes if it is."],
    ["?. (safe call)", "Calls only when the value isn't null."],
    ["?: (Elvis operator)", "Gives a default when the left side is null."],
    ["abstract", "A class or function left for children to complete."],
    ["Android Studio", "The official tool for building Android apps."],
    ["apply", "A scope function that sets up an object and returns it."],
    ["Boolean", "true or false."],
    ["Char", "A single character in single quotes, like 'A'."],
    ["class", "A blueprint for objects."],
    ["companion object", "An object inside a class for class-level functions."],
    ["const val", "A constant fixed at compile time."],
    ["coroutine", "A lightweight task that can pause without blocking (kotlinx.coroutines)."],
    ["data class", "A class for data with toString, equals and copy built in."],
    ["destructuring", "Unpacking an object into several values: val (x, y) = point."],
    ["Double", "A number with a decimal point."],
    ["downTo", "Counts a range backwards."],
    ["enum class", "A type with a fixed set of named values."],
    ["exception", "An object thrown to signal that something went wrong."],
    ["extension function", "A function added to an existing type, like fun String.shout()."],
    ["filter", "Keeps the items a lambda says yes to."],
    ["fun", "Defines a function."],
    ["generics", "Code with type parameters like <T> that works for many types."],
    ["Gradle", "The build tool used by most Kotlin and Android projects."],
    ["if expression", "if that gives back a value."],
    ["immutable", "Can't be changed after it's made."],
    ["init", "A block that runs when an object is built."],
    ["Int", "A whole number."],
    ["interface", "A list of functions a class promises to have."],
    ["IntelliJ IDEA", "JetBrains' editor for Kotlin and Java."],
    ["it", "The name of a lambda's single parameter."],
    ["JVM", "The Java Virtual Machine, where Kotlin programs run."],
    ["lambda", "A small unnamed function in braces."],
    ["let", "A scope function that runs a block with it and returns the result."],
    ["List", "A read-only, ordered collection."],
    ["listOf", "Makes a read-only list."],
    ["Long", "A whole number with a much bigger range than Int."],
    ["main", "The function where a program starts."],
    ["map (function)", "Transforms every item into a new list."],
    ["Map", "A collection of key-value pairs."],
    ["MutableList", "A list that can change."],
    ["mutableListOf", "Makes a list that can change."],
    ["named argument", "Passing a value by parameter name: greet(name = \"Ana\")."],
    ["null", "The value meaning nothing."],
    ["null safety", "Kotlin's checks that stop null crashes before the program runs."],
    ["nullable type", "A type with ?, like String?, that may be null."],
    ["object", "A single object declared in one step: a singleton."],
    ["open", "Allows a class to be inherited or a function to be overridden."],
    ["override", "Replaces a function from a parent or interface."],
    ["Pair", "Two values together, made with to: \"a\" to 1."],
    ["private", "Visible only inside its class or file."],
    ["property", "A value that belongs to an object."],
    ["range", "A run of values like 1..5."],
    ["repeat", "Runs a block a number of times."],
    ["require", "Checks an argument and throws if it's wrong."],
    ["runCatching", "Runs code and wraps the result or exception."],
    ["scope function", "let, run, with, apply or also: run a block with an object."],
    ["sealed", "A type whose subtypes are all known, so when can be exhaustive."],
    ["Sequence", "A collection processed item by item, lazily."],
    ["Set", "A collection that holds each value once."],
    ["smart cast", "Kotlin treating a value as a narrower type after a check."],
    ["step", "Jumps through a range by more than one."],
    ["String", "Text."],
    ["string template", "$name or ${expression} inside a string."],
    ["super", "Refers to the parent class's version."],
    ["throw", "Signals an exception."],
    ["to", "Makes a Pair: \"Ana\" to 12."],
    ["try", "Runs code that might throw; also an expression."],
    ["Unit", "The type of a function that returns nothing useful."],
    ["until", "A range that stops before its end: 0 until 5."],
    ["val", "A value that can't be reassigned."],
    ["var", "A variable that can be reassigned."],
    ["vararg", "A parameter that takes any number of arguments."],
    ["when", "Kotlin's powerful branching expression."],
    ["with", "A scope function that runs a block with this as the object."],
    ["withIndex", "Pairs each item with its position."],
    ["Jetpack Compose", "Android's toolkit for building screens in Kotlin."],
    ["Kotlin Multiplatform", "Sharing Kotlin code between Android, iOS, desktop and web."],
    ["kotlinc", "The Kotlin compiler."],
    ["suspend", "Marks a function that can pause, for coroutines."]
  ];

  var field = [
    { name: "println / print", head: "kotlin.io", what: "Print with or without a new line.", ex: "println(\"Score: $score\")" },
    { name: "String functions", head: "kotlin.text", what: "uppercase, length, split, trim, padStart, repeat, contains.", ex: "\"7\".padStart(3, '0')" },
    { name: "toInt / toIntOrNull", head: "kotlin.text", what: "Text to numbers; the OrNull version never throws.", ex: "\"42\".toIntOrNull() ?: 0" },
    { name: "listOf / mutableListOf", head: "kotlin.collections", what: "Read-only and changeable lists.", ex: "mutableListOf(1, 2).add(3)" },
    { name: "mapOf / getOrDefault", head: "kotlin.collections", what: "Key-value lookups with defaults.", ex: "ages.getOrDefault(\"Zed\", 0)" },
    { name: "map / filter / sumOf", head: "kotlin.collections", what: "Transform, keep and total with lambdas.", ex: "nums.filter { it > 0 }.sum()" },
    { name: "sortedBy / groupBy", head: "kotlin.collections", what: "Sort or group by a value from each item.", ex: "words.groupBy { it.length }" },
    { name: "joinToString", head: "kotlin.collections", what: "Glue items into text with a separator.", ex: "list.joinToString(\", \")" },
    { name: "kotlin.math", head: "kotlin.math", what: "sqrt, abs, pow, PI, roundToInt.", ex: "sqrt(2.0)" },
    { name: "coerceIn", head: "kotlin.ranges", what: "Keep a number inside a range.", ex: "hp.coerceIn(0, 100)" },
    { name: "Regex", head: "kotlin.text", what: "Find and replace text patterns.", ex: "Regex(\"\\\\d+\").findAll(s)" },
    { name: "buildString", head: "kotlin.text", what: "Build long text piece by piece.", ex: "buildString { append(\"a\") }" },
    { name: "let / apply / also", head: "scope functions", what: "Run a block with an object close at hand.", ex: "name?.let { println(it) }" },
    { name: "require / check", head: "kotlin", what: "Guard arguments and state with clear messages.", ex: "require(n > 0) { \"n must be positive\" }" },
    { name: "java.time.LocalDate", head: "Java interop", what: "Dates from the Java library.", ex: "LocalDate.of(2025, 3, 1)" }
  ];

  var cheats = [
    { title: "Program Skeleton Card", body: "The shape of a Kotlin program.", code: src(["fun main() {", "    println(\"Hello\")", "}"]) },
    { title: "Values Card", body: "val, var and types.", code: src(["val n = 42", "var score = 0", "val price: Double = 4.99", "val ok = true", "val c = 'A'", "val nick: String? = null", "val text = n.toString()", "val back = \"7\".toInt()"]) },
    { title: "Decisions Card", body: "if, when and ranges.", code: src(["val size = if (n > 10) \"big\" else \"small\"", "when (score) {", "    in 90..100 -> println(\"A\")", "    in 80..89 -> println(\"B\")", "    else -> println(\"C\")", "}", "when {", "    hp <= 0 -> println(\"Game over\")", "    else -> println(\"Keep going\")", "}"]) },
    { title: "Loops Card", body: "Ranges and repeats.", code: src(["for (i in 1..5) println(i)", "for (i in 0 until 5) println(i)", "for (i in 10 downTo 0 step 2) println(i)", "for (item in list) println(item)", "repeat(3) { println(it) }", "while (lives > 0) lives--"]) },
    { title: "Collections Card", body: "Lists, maps and sets.", code: src(["val list = mutableListOf(1, 2, 3)", "list.add(4)", "val first = list[0]", "val map = mutableMapOf(\"a\" to 1)", "map[\"b\"] = 2", "val a = map.getOrDefault(\"z\", 0)", "val set = setOf(\"x\", \"y\")"]) },
    { title: "Null Safety Card", body: "Handling values that might be missing.", code: src(["val nick: String? = null", "val len = nick?.length ?: 0", "nick?.let { println(it) }", "if (nick != null) println(nick.uppercase())", "val n = \"abc\".toIntOrNull() ?: -1"]) },
    { title: "Classes Card", body: "Classes in a few lines.", code: src(["class Box(var size: Int = 1) {", "    fun grow() {", "        size++", "    }", "}", "", "data class Point(val x: Int, val y: Int)", "", "sealed interface Shape", "", "data class Square(val side: Int) : Shape"]) },
    { title: "Lambdas Card", body: "Pipelines over collections.", code: src(["nums.map { it * 2 }", "nums.filter { it % 2 == 0 }", "nums.sumOf { it * it }", "players.sortedByDescending { it.score }", "words.groupBy { it.first() }", "list.forEach { println(it) }"]) }
  ];

  function stars(n) { return new Array(n + 1).join("*"); }
  function padR(s, w) { while (s.length < w) s += " "; return s; }
  function padL(s, w) { s = String(s); while (s.length < w) s = " " + s; return s; }
  /* A whole main.kt: imports, then any declarations, then fun main. */
  function M(imports, decls, body) {
    var out = imports.length ? imports.map(function (i) { return "import " + i; }).concat([""]) : [];
    if (decls.length) out = out.concat(decls, [""]);
    return out.concat(["fun main() {"], body.map(function (l) { return l ? "    " + l : ""; }), ["}"]);
  }

  var projects = [
    { name: "Rocket Countdown", about: "downTo counts the rocket down to blast off.",
      vars: [{ key: "start", val: 5, min: 1, max: 12 }],
      code: function (v) { return M([], [], ["val start = " + v.start, "for (i in start downTo 1) {", "    println(\"$i...\")", "}", "println(\"Blast off!\")"]); },
      run: function (v) { var o = []; for (var i = v.start; i > 0; i--) o.push(i + "..."); o.push("Blast off!"); return o; },
      explain: "start downTo 1 counts from your number down to 1, and $i drops each number into the text." },
    { name: "Star Steps", about: "\"*\".repeat(3) is ***, so each row is easy.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return M([], [], ["val rows = " + v.rows, "for (r in 1..rows) {", "    println(\"*\".repeat(r))", "}"]); },
      run: function (v) { var o = []; for (var r = 1; r <= v.rows; r++) o.push(stars(r)); return o; },
      explain: "repeat(r) makes a row r stars long, so each line is one star longer than the last." },
    { name: "Coin Bank", about: "Every coin adds to the total.",
      vars: [{ key: "coins", val: 5, min: 1, max: 10 }, { key: "each", val: 25, min: 1, max: 50 }],
      code: function (v) { return M([], [], ["val coins = " + v.coins, "val each = " + v.each, "var total = 0", "for (c in 1..coins) {", "    total += each", "    println(\"Coin $c: total $total\")", "}"]); },
      run: function (v) { var o = [], t = 0; for (var c = 1; c <= v.coins; c++) { t += v.each; o.push("Coin " + c + ": total " + t); } return o; },
      explain: "total is a var because it changes; += adds one coin's worth each round." },
    { name: "Score Doubler", about: "repeat runs the doubling.",
      vars: [{ key: "score", val: 3, min: 1, max: 50 }, { key: "rounds", val: 5, min: 1, max: 10 }],
      code: function (v) { return M([], [], ["var score = " + v.score, "val rounds = " + v.rounds, "repeat(rounds) { r ->", "    score *= 2", "    println(\"Round ${r + 1}: $score\")", "}"]); },
      run: function (v) { var o = [], s = v.score; for (var r = 1; r <= v.rounds; r++) { s *= 2; o.push("Round " + r + ": " + s); } return o; },
      explain: "repeat hands the block a counter from 0, named r here, so ${r + 1} gives a friendly round number." },
    { name: "Times Table", about: "A multiplication table for any number.",
      vars: [{ key: "num", val: 7, min: 1, max: 12 }, { key: "upto", val: 5, min: 1, max: 12 }],
      code: function (v) { return M([], [], ["val num = " + v.num, "val upto = " + v.upto, "for (i in 1..upto) {", "    println(\"$num x $i = ${num * i}\")", "}"]); },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(v.num + " x " + i + " = " + v.num * i); return o; },
      explain: "$num and $i fill in variables; ${num * i} works out the product inside the text." },
    { name: "Temperature Converter", about: "Celsius to Fahrenheit with one decimal place.",
      vars: [{ key: "celsius", val: 20, min: -40, max: 100 }],
      code: function (v) { return M([], [], ["val celsius = " + v.celsius, "val fahrenheit = celsius * 9.0 / 5 + 32", "println(\"$celsius C is ${\"%.1f\".format(fahrenheit)} F\")"]); },
      run: function (v) { return [v.celsius + " C is " + (v.celsius * 9 / 5 + 32).toFixed(1) + " F"]; },
      explain: "9.0 is a Double, so the division keeps its decimals. \"%.1f\".format shows one decimal place." },
    { name: "Tip Calculator", about: "A tip and total for a bill, in whole dollars.",
      vars: [{ key: "bill", val: 40, min: 1, max: 500 }, { key: "percent", val: 15, min: 0, max: 30 }],
      code: function (v) { return M([], [], ["val bill = " + v.bill, "val percent = " + v.percent, "val tip = bill * percent / 100", "println(\"Bill: $$bill\")", "println(\"Tip: $$tip\")", "println(\"Total: $${bill + tip}\")"]); },
      run: function (v) { var tip = Math.floor(v.bill * v.percent / 100); return ["Bill: $" + v.bill, "Tip: $" + tip, "Total: $" + (v.bill + tip)]; },
      explain: "Int division drops the cents. In \"$$bill\" the first $ is a plain dollar sign and the second starts the template." },
    { name: "FizzBuzz", about: "when picks Fizz, Buzz or both.",
      vars: [{ key: "limit", val: 15, min: 1, max: 30 }],
      code: function (v) { return M([], [], ["val limit = " + v.limit, "for (n in 1..limit) {", "    val word = when {", "        n % 15 == 0 -> \"FizzBuzz\"", "        n % 3 == 0 -> \"Fizz\"", "        n % 5 == 0 -> \"Buzz\"", "        else -> n.toString()", "    }", "    println(word)", "}"]); },
      run: function (v) { var o = []; for (var n = 1; n <= v.limit; n++) o.push(n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : String(n)); return o; },
      explain: "when with no value checks each branch in order and gives back the first match. The 15 branch comes first." },
    { name: "Score Stats", about: "Highest, lowest and average of a list.",
      vars: [{ key: "first", val: 72, min: 0, max: 100 }, { key: "second", val: 95, min: 0, max: 100 }, { key: "third", val: 64, min: 0, max: 100 }],
      code: function (v) { return M([], [], ["val first = " + v.first, "val second = " + v.second, "val third = " + v.third, "val scores = listOf(first, second, third)", "println(\"Scores: ${scores.joinToString()}\")", "println(\"Highest: ${scores.max()}\")", "println(\"Lowest: ${scores.min()}\")", "println(\"Average: ${\"%.1f\".format(scores.average())}\")"]); },
      run: function (v) { var a = [v.first, v.second, v.third]; return ["Scores: " + a.join(", "), "Highest: " + Math.max.apply(null, a), "Lowest: " + Math.min.apply(null, a), "Average: " + ((v.first + v.second + v.third) / 3).toFixed(1)]; },
      explain: "Lists know max, min and average; joinToString glues the scores with commas." },
    { name: "Shopping Cart", about: "A list of data classes adds up a receipt.",
      vars: [{ key: "apples", val: 3, min: 0, max: 10 }, { key: "pears", val: 2, min: 0, max: 10 }],
      code: function (v) { return M([], ["data class Item(val name: String, val price: Int, val qty: Int)"], ["val apples = " + v.apples, "val pears = " + v.pears, "val cart = listOf(Item(\"Apple\", 50, apples), Item(\"Pear\", 75, pears), Item(\"Bread\", 250, 1))", "var total = 0", "for (item in cart) {", "    val cost = item.price * item.qty", "    total += cost", "    println(\"${item.name.padEnd(6)} x${item.qty} ${cost.toString().padStart(5)}\")", "}", "println(\"Total: $${total / 100}.${(total % 100).toString().padStart(2, '0')}\")"]); },
      run: function (v) {
        var cart = [["Apple", 50, v.apples], ["Pear", 75, v.pears], ["Bread", 250, 1]], o = [], t = 0;
        cart.forEach(function (it) { var c = it[1] * it[2]; t += c; o.push(padR(it[0], 6) + " x" + it[2] + " " + padL(c, 5)); });
        o.push("Total: $" + Math.floor(t / 100) + "." + (t % 100 < 10 ? "0" : "") + (t % 100));
        return o;
      },
      explain: "Prices are in cents to keep the maths exact. padEnd and padStart line up the columns, and padStart(2, '0') keeps two digits of cents." },
    { name: "Class Vote", about: "A map counts votes, printed in name order.",
      vars: [{ key: "ana", val: 3, min: 0, max: 20 }, { key: "leo", val: 5, min: 0, max: 20 }],
      code: function (v) { return M([], [], ["val ana = " + v.ana, "val leo = " + v.leo, "val votes = mutableMapOf(\"Mia\" to 4, \"Ana\" to ana, \"Leo\" to leo)", "votes[\"Ana\"] = votes.getValue(\"Ana\") + 2", "for ((name, count) in votes.toSortedMap()) {", "    println(\"$name: $count\")", "}", "println(\"Total votes: ${votes.values.sum()}\")"]); },
      run: function (v) { return ["Ana: " + (v.ana + 2), "Leo: " + v.leo, "Mia: 4", "Total votes: " + (v.ana + 2 + v.leo + 4)]; },
      explain: "Ana gets two late votes. toSortedMap orders the names alphabetically before printing." },
    { name: "Hero Healing", about: "A method heals the hero, capped at 100.",
      vars: [{ key: "hp", val: 40, min: 1, max: 99 }, { key: "potion", val: 25, min: 5, max: 50 }],
      code: function (v) { return M([], ["class Hero(val name: String, var hp: Int) {", "    fun heal(amount: Int) {", "        hp = minOf(hp + amount, 100)", "    }", "}"], ["val hp = " + v.hp, "val potion = " + v.potion, "val hero = Hero(\"Ana\", hp)", "while (hero.hp < 100) {", "    hero.heal(potion)", "    println(\"${hero.name} drinks a potion: ${hero.hp} HP\")", "}"]); },
      run: function (v) { var o = [], hp = v.hp; while (hp < 100) { hp = Math.min(hp + v.potion, 100); o.push("Ana drinks a potion: " + hp + " HP"); } return o; },
      explain: "heal changes the hero's own hp, and minOf caps it at 100. hp is a var property, so it can change." },
    { name: "Shape Areas", about: "A sealed interface makes when cover every shape.",
      vars: [{ key: "w", val: 4, min: 1, max: 20 }, { key: "h", val: 3, min: 1, max: 20 }, { key: "side", val: 5, min: 1, max: 20 }],
      code: function (v) { return M([], ["sealed interface Shape", "", "data class Rect(val w: Int, val h: Int) : Shape", "", "data class Square(val side: Int) : Shape", "", "fun area(shape: Shape) = when (shape) {", "    is Rect -> shape.w * shape.h", "    is Square -> shape.side * shape.side", "}", "", "fun name(shape: Shape) = when (shape) {", "    is Rect -> \"rectangle\"", "    is Square -> \"square\"", "}"], ["val w = " + v.w, "val h = " + v.h, "val side = " + v.side, "val shapes = listOf(Rect(w, h), Square(side))", "for (shape in shapes) {", "    println(\"${name(shape)}: ${area(shape)}\")", "}", "println(\"Total area: ${shapes.sumOf { area(it) }}\")"]); },
      run: function (v) { var a = v.w * v.h, b = v.side * v.side; return ["rectangle: " + a, "square: " + b, "Total area: " + (a + b)]; },
      explain: "Shape is sealed, so when knows Rect and Square are the only kinds — no else needed. is smart-casts each shape." },
    { name: "Cookie Sharing", about: "require refuses to divide by zero.",
      vars: [{ key: "cookies", val: 12, min: 0, max: 50 }, { key: "friends", val: 4, min: 0, max: 10 }],
      code: function (v) { return M([], ["fun share(cookies: Int, friends: Int): Pair<Int, Int> {", "    require(friends > 0) { \"no friends to share with\" }", "    return Pair(cookies / friends, cookies % friends)", "}"], ["val cookies = " + v.cookies, "val friends = " + v.friends, "try {", "    val (each, left) = share(cookies, friends)", "    println(\"Each friend gets $each\")", "    println(\"Left over: $left\")", "} catch (e: IllegalArgumentException) {", "    println(\"Error: ${e.message}\")", "}"]); },
      run: function (v) { if (v.friends === 0) return ["Error: no friends to share with"]; return ["Each friend gets " + Math.floor(v.cookies / v.friends), "Left over: " + v.cookies % v.friends]; },
      explain: "Set friends to 0: require throws IllegalArgumentException with your message, and catch handles it." },
    { name: "Grade Bands", about: "when with ranges turns scores into grades.",
      vars: [{ key: "ana", val: 92, min: 0, max: 100 }, { key: "leo", val: 78, min: 0, max: 100 }, { key: "mia", val: 85, min: 0, max: 100 }],
      code: function (v) { return M([], ["fun grade(score: Int) = when (score) {", "    in 90..100 -> \"A\"", "    in 80..89 -> \"B\"", "    in 70..79 -> \"C\"", "    else -> \"Keep going\"", "}"], ["val ana = " + v.ana, "val leo = " + v.leo, "val mia = " + v.mia, "for ((name, score) in listOf(\"Ana\" to ana, \"Leo\" to leo, \"Mia\" to mia)) {", "    println(\"$name: $score is ${grade(score)}\")", "}"]); },
      run: function (v) {
        function g(s) { return s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : "Keep going"; }
        return [["Ana", v.ana], ["Leo", v.leo], ["Mia", v.mia]].map(function (r) { return r[0] + ": " + r[1] + " is " + g(r[1]); });
      },
      explain: "in 90..100 checks a range; when uses the first branch that matches." },
    { name: "Even Squares", about: "filter and map make a pipeline.",
      vars: [{ key: "n", val: 6, min: 2, max: 20 }],
      code: function (v) { return M([], [], ["val n = " + v.n, "val squares = (1..n).filter { it % 2 == 0 }.map { it * it }", "println(\"Evens squared: ${squares.joinToString(\" \")}\")", "println(\"Sum: ${squares.sum()}\")"]); },
      run: function (v) { var s = []; for (var x = 2; x <= v.n; x += 2) s.push(x * x); return ["Evens squared: " + s.join(" "), "Sum: " + s.reduce(function (a, b) { return a + b; }, 0)]; },
      explain: "filter keeps the even numbers, and map squares them — it is each number in turn." },
    { name: "Name Tags", about: "String functions make name tags.",
      vars: [{ key: "keep", val: 3, min: 1, max: 8 }],
      code: function (v) { return M([], [], ["val keep = " + v.keep, "for (name in listOf(\"Ana\", \"Leonardo\", \"Mia\")) {", "    println(\"${name.uppercase().padEnd(10, '.')} ${name.length} ${name.take(keep)}\")", "}"]); },
      run: function (v) { return ["Ana", "Leonardo", "Mia"].map(function (n) { var t = n.toUpperCase(); while (t.length < 10) t += "."; return t + " " + n.length + " " + n.substr(0, v.keep); }); },
      explain: "padEnd fills the tag out to 10 characters with dots; take(keep) keeps the first letters (and never fails on a short name)." },
    { name: "Number Guesser", about: "Halving the range finds any number from 1 to 100 in 7 guesses or fewer.",
      vars: [{ key: "secret", val: 37, min: 1, max: 100 }],
      code: function (v) { return M([], [], ["val secret = " + v.secret, "var low = 1", "var high = 100", "var tries = 0", "while (true) {", "    tries++", "    val guess = (low + high) / 2", "    when {", "        guess == secret -> {", "            println(\"Got it: $guess in $tries tries\")", "            break", "        }", "        guess < secret -> {", "            println(\"$guess is too low\")", "            low = guess + 1", "        }", "        else -> {", "            println(\"$guess is too high\")", "            high = guess - 1", "        }", "    }", "}"]); },
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
    { line: 'println("{w}")', why: "println prints a line." },
    { line: "println({v})", why: "println prints any value." },
    { line: 'println("{w}: ${v}")', why: "$name drops a variable into text." },
    { line: 'println("${{v} * {d}}")', why: "${ } runs an expression inside text." },
    { line: "val {v} = {n}", why: "val can't be reassigned." },
    { line: "var {v} = {n}", why: "var can change later." },
    { line: "val {v}: Double = {dec}", why: "The type after the colon." },
    { line: "val {v} = {b}", why: "true or false makes a Boolean." },
    { line: 'val {sv} = "{w}"', why: "Text in quotes makes a String." },
    { line: "const val {cv} = {n}", why: "A compile-time constant." },
    { line: "{v} += {n}", why: "+= adds onto a var." },
    { line: "{v} -= {d}", why: "-= takes away from a var." },
    { line: "{v} *= {d}", why: "*= multiplies a var." },
    { line: "{v}++", why: "++ adds one." },
    { line: "val {v} = {u} % {d}", why: "% gives the remainder." },
    { line: "val {v} = {u}.toDouble() / {d}", why: "Convert first to keep decimals." },
    { line: "val {v} = {u}.coerceIn(0, {n})", why: "coerceIn keeps a number in a range." },
    { line: 'val {sv} = "{w}".uppercase()', why: "uppercase returns capitals." },
    { line: 'val {sv} = "{w}".repeat({d})', why: "repeat joins copies of text." },
    { line: "println({sv}.length)", why: "length counts characters." },
    { line: 'if ({v} > {n}) println("{w}")', why: "if runs when the test is true." },
    { line: "if ({v} == {n}) { {u} = 0 }", why: "== compares values." },
    { line: "} else if ({v} < {d}) {", why: "else if tries another test." },
    { line: 'val {sv} = if ({v} > {n}) "{w}" else "none"', why: "if gives back a value." },
    { line: 'val {sv} = when ({v}) { in 0..{n} -> "{w}" else -> "other" }', why: "when checks a range." },
    { line: "for (i in 1..{n}) {v} += i", why: "1..n includes both ends." },
    { line: "for (i in {n} downTo 1 step {d}) println(i)", why: "downTo counts back; step jumps." },
    { line: "repeat({n}) { {v}++ }", why: "repeat runs a block n times." },
    { line: "while ({v} > 0) {v}--", why: "while repeats while true." },
    { line: "for (x in {arr}) {v} += x", why: "for walks a collection." },
    { line: "val {arr} = listOf({n}, {n2}, {n3})", why: "listOf makes a read-only list." },
    { line: "val {arr} = mutableListOf({n}, {n2})", why: "mutableListOf can change." },
    { line: "{arr}.add({n})", why: "add puts an item on the end." },
    { line: "println({arr}.size)", why: "size counts the items." },
    { line: "val {v} = {arr}.sum()", why: "sum adds up a list." },
    { line: 'val {m} = mapOf("{w}" to {n})', why: "to makes a key-value pair." },
    { line: "val {m} = mutableMapOf<String, Int>()", why: "An empty map that can change." },
    { line: '{m}["{w}"] = {n}', why: "Set a value by key." },
    { line: 'val {v} = {m}.getOrDefault("{w}", {n})', why: "getOrDefault for missing keys." },
    { line: 'for ((key, value) in {m}) println("$key: $value")', why: "Destructure each pair." },
    { line: "fun {f}({v}: Int): Int = {v} * {d}", why: "A one-line function." },
    { line: "fun {f}({v}: Int, bonus: Int = {d}): Int {", why: "A parameter with a default." },
    { line: "{f}({n})", why: "Call a function." },
    { line: "val {v} = {f}({u})", why: "Store a function's result." },
    { line: "val {sv}: String? = null", why: "? lets a type hold null." },
    { line: "val {v} = {sv}?.length ?: {n}", why: "?. and ?: handle null safely." },
    { line: "{sv}?.let { println(it) }", why: "let runs only when not null." },
    { line: "class {c}(val {sv}: String, var {v}: Int = {n})", why: "Properties in the constructor." },
    { line: "data class {c}(val {v}: Int, val {u}: Int)", why: "A data class gets toString and copy." },
    { line: "val {o} = {c}({n})", why: "Build an object — no new needed." },
    { line: "{o}.{v} = {n}", why: "Change a var property." },
    { line: "open class {c}(val {v}: Int)", why: "open allows inheritance." },
    { line: "class {c} : {k}()", why: "A colon inherits from a parent." },
    { line: "interface {c} { fun {f}(): Int }", why: "An interface lists functions." },
    { line: "sealed interface {c}State", why: "sealed fixes the set of subtypes." },
    { line: "val {arr} = {arr}.map { it * {d} }", why: "map transforms each item." },
    { line: "val {arr} = {arr}.filter { it > {n} }", why: "filter keeps some items." },
    { line: "val {v} = {arr}.sumOf { it * {d} }", why: "sumOf totals a value from each." },
    { line: 'val {sv} = {arr}.joinToString(", ")', why: "joinToString glues items into text." },
    { line: "fun Int.{f}(): Int = this * {d}", why: "An extension function on Int." },
    { line: "object {c}Config { const val {cv} = {n} }", why: "object makes a singleton." },
    { line: "enum class {c}Mode { IDLE, RUNNING }", why: "enum class lists fixed choices." },
    { line: 'val {v} = "{n}".toIntOrNull() ?: 0', why: "toIntOrNull never throws." },
    { line: 'require({v} > 0) { "{w}" }', why: "require guards an argument." },
    { line: "try { {f}({n}) } catch (e: IllegalArgumentException) { println(e.message) }", why: "catch handles a thrown exception." }
  ];
  var themes = [
    { name: "Println & Talk", t: [0, 1, 2, 3, 8] },
    { name: "val & var", t: [4, 5, 6, 7, 8] },
    { name: "Constants", t: [9, 4, 6, 7, 5] },
    { name: "Math Moves", t: [10, 11, 12, 13, 14] },
    { name: "Number Tools", t: [15, 16, 14, 62, 4] },
    { name: "Strings", t: [17, 18, 19, 2, 3] },
    { name: "Decisions", t: [20, 21, 22, 23, 7] },
    { name: "When", t: [24, 23, 20, 21, 22] },
    { name: "Loops", t: [25, 26, 27, 28, 29] },
    { name: "Lists", t: [30, 31, 32, 33, 34] },
    { name: "Maps", t: [35, 36, 37, 38, 39] },
    { name: "Functions", t: [40, 41, 42, 43, 59] },
    { name: "Null Safety", t: [44, 45, 46, 62, 23] },
    { name: "Classes", t: [47, 48, 49, 50, 51] },
    { name: "Inheritance", t: [51, 52, 53, 54, 47] },
    { name: "Lambdas", t: [55, 56, 57, 58, 29] },
    { name: "Extensions & Objects", t: [59, 60, 61, 40, 9] },
    { name: "Errors", t: [63, 64, 62, 21, 42] },
    { name: "Mixed Practice", t: [24, 38, 45, 57, 63] },
    { name: "Kotlin Masters", t: [46, 48, 55, 60, 64] }
  ];
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
    sandboxNote: "Thirty everyday Kotlin lines, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your Kotlin progress is saved separately from every other track.",
    sourcesHTML: 'Kotlin facts and syntax follow the official <a href="https://kotlinlang.org/docs/home.html">Kotlin documentation</a> (Kotlin 2.1) and the <a href="https://kotlinlang.org/docs/coding-conventions.html">Kotlin coding conventions</a>. Kotlin is a trademark of JetBrains; Code Block is not affiliated with JetBrains or Google. Every explanation is written in Code Block’s own words, and every practice program is compiled by the real Kotlin compiler, with warnings as errors, before it ships.'
  };
});
