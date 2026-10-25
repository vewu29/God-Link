"use strict";
/* ================= GO — a Code Block track =================
   Written fresh for Code Block in plain words. Facts and syntax follow
   the Go specification, Effective Go and the go.dev tour (Go 1.24).
   Every PC project and library example is checked in tests/content: it
   must be gofmt-formatted (the app shows tabs as four spaces), pass
   go vet, and run with the real Go toolchain — and a project's output
   must match the app. Every drill and Vault line is parsed by Go's own
   parser. */
cbRegisterTrack("go", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Package Block", short: "package", chapter: "Go Ch. 1 · First Steps", icon: "i-box", verb: "start",
      line: "package main",
      explain: "Every Go file begins by naming its package. package main is special: it means “this is a program you can run,” not a library for other code." },
    { name: "Import Block", short: "import", chapter: "Go Ch. 1 · First Steps", icon: "i-link", verb: "borrow",
      line: 'import "fmt"',
      explain: "import borrows a package of ready-made tools. fmt (say “fumpt”) is the format package: printing to the screen and building text." },
    { name: "Hello Block", short: "Println", chapter: "Go Ch. 1 · First Steps", icon: "i-say", verb: "say",
      line: 'fmt.Println("Hello, world!")',
      explain: "fmt.Println prints its words and ends the line. Go needs no semicolon at the end — the compiler adds them for you." },
    { name: "Short Declare Block", short: ":=", chapter: "Go Ch. 2 · Variables and Types", icon: "i-tag", verb: "make",
      line: "score := 0",
      explain: ":= makes a new variable and works out its type from the value. score is an int, and it stays an int forever." },
    { name: "Var Block", short: "var", chapter: "Go Ch. 2 · Variables and Types", icon: "i-boxes", verb: "declare",
      line: 'var name string = "Ana"',
      explain: "var is the long way to make a variable, with the type written out. Leave the value off and Go fills in a zero value: 0, \"\" or false." },
    { name: "Const Block", short: "const", chapter: "Go Ch. 2 · Variables and Types", icon: "i-lock", verb: "fix",
      line: "const maxLives = 3",
      explain: "A constant is decided when the program is compiled and can never change. Trying to change maxLives is a compile error." },
    { name: "Conversion Block", short: "float64()", chapter: "Go Ch. 3 · Operators and Math", icon: "i-calc", verb: "convert",
      line: "avg := float64(total) / float64(count)",
      explain: "Go never mixes number types by itself. Converting both ints to float64 first gives a decimal answer instead of a rounded-down whole number." },
    { name: "Printf Block", short: "Printf", chapter: "Go Ch. 4 · Strings and Formatting", icon: "i-pencil", verb: "format",
      line: 'fmt.Printf("%s has %d coins\\n", name, coins)',
      explain: "Printf fills each verb in order: %s takes text, %d a whole number. \\n ends the line, because Printf doesn't do it for you." },
    { name: "Strings Block", short: "strings", chapter: "Go Ch. 4 · Strings and Formatting", icon: "i-link", verb: "shout",
      line: "shout := strings.ToUpper(name)",
      explain: "The strings package holds text tools: ToUpper, Contains, Split, Repeat, TrimSpace and many more. Strings themselves never change; tools return new ones." },
    { name: "If Block", short: "if", chapter: "Go Ch. 5 · Decisions", icon: "i-fork", verb: "decide",
      line: 'if hp <= 0 { fmt.Println("Game over") }',
      explain: "if runs its block only when the test is true. Go needs no brackets around the test, but the curly braces are always required." },
    { name: "Switch Block", short: "switch", chapter: "Go Ch. 5 · Decisions", icon: "i-toggle", verb: "pick",
      line: 'switch day { case "Sat", "Sun": fmt.Println("Weekend") }',
      explain: "switch compares one value against each case. A case can list several values, and Go stops after the matching case — no break needed." },
    { name: "For Block", short: "for", chapter: "Go Ch. 6 · Loops", icon: "i-repeat", verb: "count",
      line: "for i := 0; i < 3; i++ { fmt.Println(i) }",
      explain: "for is Go's only loop. This classic form has a start, a test and a step: it prints 0, 1 and 2." },
    { name: "Range Block", short: "range", chapter: "Go Ch. 6 · Loops", icon: "i-list", verb: "walk",
      line: "for i, s := range scores { fmt.Println(i, s) }",
      explain: "range walks through a slice, giving the position and the value each time. Use _ for the one you don't need: for _, s := range scores." },
    { name: "Range Number Block", short: "range 5", chapter: "Go Ch. 6 · Loops", icon: "i-rows", verb: "repeat",
      line: "for i := range 5 { fmt.Println(i) }",
      explain: "Since Go 1.22 you can range over a number: i goes 0, 1, 2, 3, 4. It's the shortest way to repeat something n times." },
    { name: "Slice Block", short: "[]int", chapter: "Go Ch. 7 · Arrays and Slices", icon: "i-boxes", verb: "line up",
      line: "scores := []int{10, 20, 30}",
      explain: "A slice is Go's everyday list: a row of values of one type, counted from 0. scores[0] is 10." },
    { name: "Append Block", short: "append", chapter: "Go Ch. 7 · Arrays and Slices", icon: "i-plus-square", verb: "grow",
      line: "scores = append(scores, 40)",
      explain: "append returns a slice with the new item on the end. Always store the result back — the old slice may not have room for it." },
    { name: "Slicing Block", short: "s[:2]", chapter: "Go Ch. 7 · Arrays and Slices", icon: "i-column", verb: "cut",
      line: "top := scores[:2]",
      explain: "s[low:high] takes a window from low up to (not including) high. scores[:2] is the first two items — and it shares memory with scores." },
    { name: "Map Block", short: "map", chapter: "Go Ch. 8 · Maps", icon: "i-folder", verb: "label",
      line: 'ages := map[string]int{"Ana": 12, "Leo": 11}',
      explain: "A map links keys to values: here names (strings) to ages (ints). Look up a value by its key with ages[\"Ana\"]." },
    { name: "Comma-ok Block", short: "v, ok", chapter: "Go Ch. 8 · Maps", icon: "i-check", verb: "check",
      line: 'age, ok := ages["Mia"]',
      explain: "A missing key gives the zero value, 0. The second result, ok, tells you whether the key was really there." },
    { name: "Function Block", short: "func", chapter: "Go Ch. 9 · Functions", icon: "i-play-circle", verb: "build",
      line: "func add(a, b int) int { return a + b }",
      explain: "func defines a function. a and b are both ints (Go lets them share one type), and the int after the brackets is what it returns." },
    { name: "Two Results Block", short: "q, r :=", chapter: "Go Ch. 9 · Functions", icon: "i-swap-h", verb: "catch",
      line: "q, r := divmod(17, 5)",
      explain: "Go functions can return several values at once. divmod hands back the quotient and the remainder: q is 3 and r is 2." },
    { name: "Struct Block", short: "struct", chapter: "Go Ch. 10 · Structs and Methods", icon: "i-layers", verb: "design",
      line: "type Point struct{ X, Y int }",
      explain: "A struct groups named fields into one new type. Point has two int fields, X and Y. Capital letters make them visible to other packages." },
    { name: "Struct Literal Block", short: "Player{}", chapter: "Go Ch. 10 · Structs and Methods", icon: "i-cube", verb: "build",
      line: 'p := Player{Name: "Ana", HP: 100}',
      explain: "A struct literal builds a value field by field. Any field you leave out gets its zero value." },
    { name: "Pointer Block", short: "&", chapter: "Go Ch. 11 · Pointers", icon: "i-point", verb: "point",
      line: "ptr := &score",
      explain: "& gives the address of a variable, so ptr points at score. *ptr reads or changes score through the pointer." },
    { name: "Method Block", short: "(p *Player)", chapter: "Go Ch. 11 · Pointers", icon: "i-gear", verb: "attach",
      line: "func (p *Player) Heal(n int) { p.HP += n }",
      explain: "The (p *Player) before the name is the receiver: it makes Heal a method of Player. The * lets the method change the real player, not a copy." },
    { name: "Interface Block", short: "interface", chapter: "Go Ch. 12 · Interfaces", icon: "i-shapes", verb: "promise",
      line: "type Shape interface{ Area() float64 }",
      explain: "An interface lists methods. Any type that has an Area() float64 method is a Shape automatically — no “implements” keyword needed." },
    { name: "Error Check Block", short: "err != nil", chapter: "Go Ch. 13 · Errors and defer", icon: "i-shield-check", verb: "guard",
      line: "if err != nil { return err }",
      explain: "Go functions report problems by returning an error. Checking err != nil right away, and passing it up, is the most common line in Go." },
    { name: "Defer Block", short: "defer", chapter: "Go Ch. 13 · Errors and defer", icon: "i-hourglass", verb: "postpone",
      line: "defer file.Close()",
      explain: "defer schedules a call for when the function finishes, however it finishes. Put the clean-up right next to the thing that needs cleaning." },
    { name: "Generic Block", short: "[T any]", chapter: "Go Ch. 14 · Generics", icon: "i-brackets", verb: "reuse",
      line: "func First[T any](items []T) T { return items[0] }",
      explain: "[T any] is a type parameter: First works for a slice of anything — ints, strings, players — and returns the same type it was given." },
    { name: "Goroutine Block", short: "go", chapter: "Go Ch. 15 · Goroutines and Channels", icon: "i-net", verb: "launch",
      line: 'go func() { ch <- "done" }()',
      explain: "go starts a function running alongside the rest of the program: a goroutine. It sends \"done\" into the channel ch, and msg := <-ch receives it." }
  ];

  var chapters = [
    { title: "First Steps", chapter: "Start here · packages, main and go run", line: 'fmt.Println("Hello, world!")',
      content: {
        story: ["Go (often called Golang) is a simple, fast language made at Google. It powers cloud tools like Docker and Kubernetes, web servers, command-line tools and huge back-end systems. It was designed to be easy to read, quick to compile and great at doing many things at once.",
          "A Go program is made of packages. A runnable program lives in package main and starts at func main(). To print, import the fmt package and call fmt.Println.",
          "Install Go from go.dev, make a folder, and run go mod init hello to start a module. Save your code as main.go and type go run main.go: Go compiles it and runs it in one step. go build makes a single program file you can share."],
        big: "A Go program is package main, a few imports, and func main — go run compiles and runs it in one step.",
        caption: "go run compiles main.go, finds func main, and the screen says hello. Tap Play.",
        demo: ["$ go run main.go", "package main → a program", "func main() runs", "Hello, world!"]
      },
      deep: {
        more: ["Go is compiled: your code becomes a native program before it runs, so it starts instantly and runs fast. The compiler is also strict — an unused variable or an unused import is an error, which keeps code tidy.",
          "Go comes with gofmt, which formats code in the one official style (tabs for indentation, braces on the same line). Nearly every editor runs it on save, so all Go code looks alike. Code Block shows each tab as four spaces."],
        ex: { code: src(["package main", "", "import \"fmt\"", "", "func main() {", "    // My first Go program", "    fmt.Println(\"Hello, world!\")", "    fmt.Println(\"I am learning Go.\")", "    fmt.Println(2 + 3)", "}"]),
          walk: ["Line 1: this file belongs to package main, so it's a runnable program.", "Line 3: borrow the fmt package for printing.", "Line 5: the program starts at func main.", "Line 6: a comment, skipped by Go.", "Lines 7–8: two lines of text.", "Line 9: no quotes, so Go adds first and prints 5."] },
        mistake: "Putting the opening brace on its own line. Go adds invisible semicolons at line ends, so a { on the line below func main() is a syntax error. Keep the { on the same line."
      } },
    { title: "Variables and Types", chapter: "Typed boxes · var, :=, const, zero values", line: "score := 0",
      content: {
        story: ["A variable is a named box for a value, and in Go every box has a type that never changes. The everyday types are int for whole numbers, float64 for decimals, string for text and bool for true or false.",
          "Inside functions, := is the quick way to make a variable: score := 0 makes an int. var spells it out: var name string = \"Ana\". If you leave the value off, Go fills the box with its zero value — 0, \"\" or false — so a variable is never random garbage.",
          "const makes a value that can never change, like const maxLives = 3. Names use camelCase (highScore). A name starting with a capital letter (Score) is exported: other packages can see it."],
        big: "Every Go variable has a fixed type; := makes one quickly, var spells it out, and unset boxes hold zero values.",
        caption: "Four labeled boxes, each accepting only its own kind of thing. Tap Play.",
        demo: ["score := 0  → int", "price := 4.99  → float64", "name := \"Ana\"  → string", "alive := true  → bool"]
      },
      deep: {
        more: ["Go also has sized numbers: int8, int16, int32, int64, uint (no negatives) and float32. Plain int and float64 are the right choice almost always. A rune is one Unicode character and a byte is one raw byte.",
          "You can make several variables at once: x, y := 1, 2. := needs at least one new name on its left; to change an existing variable, use plain =."],
        ex: { code: src(["package main", "", "import \"fmt\"", "", "func main() {", "    var hero string = \"Ana\"", "    score := 0", "    price := 4.99", "    alive := true", "    var lives int", "    const maxLives = 5", "    score += 10", "    fmt.Println(hero, score, price, alive)", "    fmt.Println(lives, \"of\", maxLives)", "    fmt.Printf(\"%T %T %T\\n\", score, price, alive)", "}"]),
          walk: ["Line 6: the long form, with the type written out.", "Lines 7–9: := works out int, float64 and bool.", "Line 10: no value given, so lives starts at 0.", "Line 11: a constant.", "Line 12: score becomes 10.", "Line 13: Println puts spaces between items: Ana 10 4.99 true.", "Line 14: 0 of 5.", "Line 15: %T prints each type: int float64 bool."] },
        mistake: "Making a variable and never using it. Go refuses to compile with “declared and not used.” Delete it, or use it — the rule keeps leftover code from piling up."
      } },
    { title: "Operators and Math", chapter: "Calculating · + - * / %, conversions, math", line: "avg := float64(total) / float64(count)",
      content: {
        story: ["Go does math with + - * / and % (the remainder). Dividing two ints gives an int, rounded toward zero: 7 / 2 is 3, and 7 % 2 is 1. If either side is a decimal, you get a decimal: 7.0 / 2 is 3.5.",
          "Go never mixes types by itself. An int and a float64 can't be added until you convert one: float64(coins) / float64(players). This feels strict at first, but it stops a whole family of rounding bugs.",
          "Shortcuts change a variable in place: hp -= 30, score *= 2, lives++ and lives--. The math package has Sqrt, Pow, Floor, Abs and Pi, and the built-in min and max work on any numbers."],
        big: "int math rounds toward zero, % gives the remainder, and you must convert types yourself with float64(x).",
        caption: "Two whole numbers divide with the remainder left over, then again as decimals. Tap Play.",
        demo: ["7 / 2 → 3", "7 % 2 → 1", "float64(7) / 2 → 3.5", "max(3, 9, 4) → 9"]
      },
      deep: {
        more: ["In Go, ++ and -- are statements, not expressions: x++ works on its own line, but y := x++ is an error. That removes a classic source of confusing code.",
          "Integers overflow silently: an int8 holding 127 plus 1 wraps around to -128. A plain int on a 64-bit computer holds numbers up to about 9.2 quintillion, so overflow is rare in everyday programs."],
        ex: { code: src(["package main", "", "import (", "    \"fmt\"", "    \"math\"", ")", "", "func main() {", "    fmt.Println(7 / 2)", "    fmt.Println(7 % 2)", "    fmt.Println(7.0 / 2)", "    coins, players := 10, 4", "    fmt.Println(float64(coins) / float64(players))", "    fmt.Println(math.Sqrt(16), math.Pow(2, 10))", "    fmt.Println(max(3, 9, 4), min(3, 9, 4))", "    hp := 100", "    hp -= 30", "    hp++", "    fmt.Println(hp)", "}"]),
          walk: ["Lines 3–6: two imports in one bracketed list.", "Line 9: whole-number division: 3.", "Line 10: the remainder: 1.", "Line 11: a decimal on one side gives 3.5.", "Lines 12–13: convert both ints first: 2.5.", "Line 14: 4 1024.", "Line 15: the built-in max and min: 9 3.", "Lines 16–19: 100 − 30 + 1 = 71."] },
        mistake: "Writing avg := total / count with ints and expecting a decimal. 7 / 2 is 3 in Go. Convert first: float64(total) / float64(count)."
      } },
    { title: "Strings and Formatting", chapter: "Text · Printf verbs, Sprintf, strings, runes", line: 'fmt.Printf("%s has %d coins\\n", name, coins)',
      content: {
        story: ["A string is text in double quotes. + joins strings, len(s) gives its length in bytes, and the strings package has the tools: ToUpper, Contains, Split, Join, Repeat, Replace and TrimSpace.",
          "Printf prints with verbs that are filled in order: %d for whole numbers, %s for text, %.2f for a decimal with two places, %v for any value at all, and %T for its type. \\n ends the line. Sprintf builds the same text into a variable instead of printing it.",
          "Strings are made of bytes, and letters like é take two of them. range over a string walks it letter by letter, giving each rune (Unicode character) and the byte where it starts."],
        big: "Printf and Sprintf fill verbs like %d, %s and %v; the strings package edits text; range walks a string rune by rune.",
        caption: "A sentence with gaps, and values sliding into each verb in order. Tap Play.",
        demo: ["\"%s has %d coins\\n\"", "%s ← \"Ana\"", "%d ← 42", "Ana has 42 coins"]
      },
      deep: {
        more: ["Backtick strings are raw: `C:\\games\\save` keeps every backslash, and they can span several lines. They're handy for file paths, patterns and blocks of text.",
          "strconv converts between text and numbers: strconv.Itoa(42) gives \"42\", and strconv.Atoi(\"42\") gives 42 plus an error if the text isn't a number. Building lots of text in a loop? strings.Builder does it efficiently."],
        ex: { code: src(["package main", "", "import (", "    \"fmt\"", "    \"strings\"", ")", "", "func main() {", "    name := \"Ana\"", "    coins := 42", "    fmt.Printf(\"%s has %d coins\\n\", name, coins)", "    fmt.Printf(\"%.2f %v %q\\n\", 3.14159, []int{1, 2}, name)", "    msg := fmt.Sprintf(\"Level %d\", 3)", "    fmt.Println(msg, len(msg))", "    fmt.Println(strings.ToUpper(name), strings.Contains(\"gopher\", \"go\"))", "    fmt.Println(strings.Split(\"a,b,c\", \",\"), strings.Repeat(\"ha\", 3))", "    for i, r := range \"héllo\" {", "        fmt.Print(i, \":\", string(r), \" \")", "    }", "    fmt.Println()", "}"]),
          walk: ["Line 11: Ana has 42 coins.", "Line 12: 3.14 [1 2] \"Ana\" — %q adds quotes.", "Lines 13–14: Sprintf builds text: Level 3 7.", "Line 15: ANA true.", "Line 16: [a b c] hahaha.", "Lines 17–19: 0:h 1:é 3:l 4:l 5:o — é takes two bytes, so l starts at 3."] },
        mistake: "Using Println with verbs: fmt.Println(\"%d coins\", n) prints the %d literally. Verbs only work in Printf, Sprintf and friends."
      } },
    { title: "Decisions", chapter: "Choosing · if, else, switch", line: 'if hp <= 0 { fmt.Println("Game over") }',
      content: {
        story: ["if runs code only when a test is true: if hp <= 0 { … }. Add else if for more tests and else for everything left over. Go needs no brackets around the test, but the braces are always required.",
          "Tests use == (equal), != (not equal), < > <= >=, and combine with && (and), || (or) and ! (not). An if can start with a short statement: if bonus := hp + 50; bonus > 40 { … } — bonus exists only inside that if.",
          "switch picks one case out of many. It stops after the matching case on its own, so there's no break to forget. A switch with no value acts like a tidy chain of if-else tests."],
        big: "if/else choose between paths, an if can declare a short-lived variable, and switch stops after its matching case.",
        caption: "A path forks at hp <= 0: one way says Game over, the other keeps going. Tap Play.",
        demo: ["hp := 0", "if hp <= 0 → true", "Game over", "else branch skipped"]
      },
      deep: {
        more: ["A case can list several values: case \"Sat\", \"Sun\":. If you really do want to fall into the next case, Go has the fallthrough keyword — but it's rare.",
          "Go has no ternary ?: operator. Write a short if instead; Go prefers code that's a few lines longer but easy to read."],
        ex: { code: src(["package main", "", "import \"fmt\"", "", "func main() {", "    hp := 0", "    if hp <= 0 {", "        fmt.Println(\"Game over\")", "    } else if hp < 20 {", "        fmt.Println(\"Careful!\")", "    } else {", "        fmt.Println(\"Keep going\")", "    }", "    if bonus := hp + 50; bonus > 40 {", "        fmt.Println(\"Bonus life:\", bonus)", "    }", "    day := \"Sun\"", "    switch day {", "    case \"Sat\", \"Sun\":", "        fmt.Println(\"Weekend\")", "    default:", "        fmt.Println(\"School day\")", "    }", "    score := 85", "    switch {", "    case score >= 90:", "        fmt.Println(\"A\")", "    case score >= 80:", "        fmt.Println(\"B\")", "    default:", "        fmt.Println(\"Keep practicing\")", "    }", "}"]),
          walk: ["Lines 7–13: hp is 0, so Game over.", "Lines 14–16: bonus lives only inside this if: Bonus life: 50.", "Lines 18–23: Sun matches the first case: Weekend.", "Lines 25–32: a switch with no value checks each case in order: B."] },
        mistake: "Writing if (x > 5) fmt.Println(\"big\") without braces. Go always requires { } around the body, even for one line."
      } },
    { title: "Loops", chapter: "Repeating · for, range, break, continue", line: "for i := 0; i < 3; i++ { fmt.Println(i) }",
      content: {
        story: ["Go has just one loop keyword: for. The classic form has three parts — start, test and step: for i := 0; i < 3; i++ { … } runs with i as 0, 1 and 2.",
          "Leave out the start and step and for acts like a while loop: for lives > 0 { … }. Leave out everything and it loops forever until a break. range walks through slices, maps and strings, and since Go 1.22 you can range over a number: for i := range 5.",
          "break leaves the loop early and continue skips to the next round. Every round of a for loop gets its own fresh copy of i, so goroutines and closures made inside the loop each see their own value."],
        big: "for is Go's only loop: counting, while-style, forever-with-break, and range over slices, maps, strings and numbers.",
        caption: "A counter goes round the track: 0, 1, 2, then the test fails and it stops. Tap Play.",
        demo: ["i := 0 → print 0", "i++ → print 1", "i++ → print 2", "i < 3 false → done"]
      },
      deep: {
        more: ["range gives two values: the position and the item. If you only want the item, throw the position away with the blank identifier: for _, s := range scores.",
          "A label lets break jump out of nested loops at once: outer: for … { for … { break outer } }."],
        ex: { code: src(["package main", "", "import \"fmt\"", "", "func main() {", "    for i := 0; i < 3; i++ {", "        fmt.Println(\"lap\", i)", "    }", "    lives := 3", "    for lives > 0 {", "        lives--", "    }", "    fmt.Println(\"lives:\", lives)", "    for i := range 3 {", "        fmt.Print(i, \" \")", "    }", "    fmt.Println()", "    for _, fruit := range []string{\"apple\", \"pear\"} {", "        if fruit == \"pear\" {", "            continue", "        }", "        fmt.Println(fruit)", "    }", "    n := 0", "    for {", "        n++", "        if n == 5 {", "            break", "        }", "    }", "    fmt.Println(\"n:\", n)", "}"]),
          walk: ["Lines 6–8: lap 0, lap 1, lap 2.", "Lines 9–13: a while-style loop counts lives down: lives: 0.", "Lines 14–17: range over a number: 0 1 2.", "Lines 18–23: continue skips pear, so only apple prints.", "Lines 24–31: a forever loop that breaks at 5: n: 5."] },
        mistake: "Changing the slice you are ranging over and expecting the loop to notice. range reads the length once at the start; build a new slice instead."
      } },
    { title: "Arrays and Slices", chapter: "Lists · arrays, slices, append, slicing", line: "scores := []int{10, 20, 30}",
      content: {
        story: ["An array has a fixed size that's part of its type: [3]int is exactly three ints. Arrays are rare in everyday Go — slices are what you use.",
          "A slice, written []int, is a flexible view of a list. Make one with values, []int{10, 20, 30}, or empty with make([]int, 0). len gives how many items it holds; append adds to the end and returns the result, so always write scores = append(scores, 40).",
          "s[1:3] takes a window from position 1 up to (not including) 3. A window shares the same memory as the original, so changing it changes both. copy makes a truly separate copy."],
        big: "Slices are Go's lists: append grows them, s[a:b] makes a window that shares memory, and copy makes a separate one.",
        caption: "A row of numbered boxes; a frame slides over two of them to make a window. Tap Play.",
        demo: ["scores := []int{10, 20, 30}", "append(scores, 40)", "scores[1:3] → [20 30]", "len(scores) → 4"]
      },
      deep: {
        more: ["Under the hood a slice is a pointer to an array, a length and a capacity (cap). When append runs out of capacity it moves everything to a bigger array — which is why you must keep its result.",
          "The slices package (Go 1.21) has the everyday helpers: slices.Sort, slices.Contains, slices.Index, slices.Max, slices.Min and slices.Reverse."],
        ex: { code: src(["package main", "", "import \"fmt\"", "", "func main() {", "    var grid [3]int", "    grid[1] = 7", "    fmt.Println(grid, len(grid))", "    scores := []int{10, 20, 30}", "    scores = append(scores, 40, 50)", "    fmt.Println(scores, len(scores))", "    top := scores[1:3]", "    fmt.Println(top)", "    top[0] = 99", "    fmt.Println(scores[1])", "    copied := make([]int, len(scores))", "    copy(copied, scores)", "    fmt.Println(copied)", "}"]),
          walk: ["Lines 6–8: an array of three ints starts as zeros: [0 7 0] 3.", "Lines 9–11: append two more: [10 20 30 40 50] 5.", "Lines 12–13: a window over positions 1 and 2: [20 30].", "Lines 14–15: the window shares memory, so scores[1] is now 99.", "Lines 16–18: copy makes a separate slice: [10 99 30 40 50]."] },
        mistake: "Calling append(scores, 40) without storing the result. The new item is lost. Always write scores = append(scores, 40)."
      } },
    { title: "Maps", chapter: "Lookups · map, comma-ok, delete", line: 'ages := map[string]int{"Ana": 12, "Leo": 11}',
      content: {
        story: ["A map stores values by key, like a dictionary: map[string]int links names to numbers. Set a value with ages[\"Mia\"] = 10 and read it with ages[\"Mia\"]. len counts the keys, and delete(ages, \"Mia\") removes one.",
          "Reading a missing key doesn't crash — it gives the zero value. To know if the key was really there, use the comma-ok form: age, ok := ages[\"Zed\"] sets ok to false.",
          "Make an empty map with make(map[string]int) or map[string]int{}. Counting things is a one-liner: counts[word]++ works even the first time, because a missing count starts at 0."],
        big: "Maps look values up by key; missing keys give zero values, and the comma-ok form tells you if a key exists.",
        caption: "A cabinet of labeled drawers; open one by its name tag. Tap Play.",
        demo: ["ages[\"Ana\"] → 12", "ages[\"Mia\"] = 10", "age, ok := ages[\"Zed\"] → 0 false", "delete(ages, \"Mia\")"]
      },
      deep: {
        more: ["Ranging over a map visits its keys in a random order, on purpose, so no code relies on it. For a steady order, sort the keys first: slices.Sorted(maps.Keys(ages)). fmt.Println prints maps sorted for you.",
          "A map declared with var m map[string]int is nil: reading from it is fine, but writing to it panics. Always make the map first."],
        ex: { code: src(["package main", "", "import (", "    \"fmt\"", "    \"maps\"", "    \"slices\"", ")", "", "func main() {", "    ages := map[string]int{\"Ana\": 12, \"Leo\": 11}", "    ages[\"Mia\"] = 10", "    ages[\"Leo\"]++", "    fmt.Println(ages[\"Leo\"], len(ages))", "    age, ok := ages[\"Zed\"]", "    fmt.Println(age, ok)", "    delete(ages, \"Mia\")", "    for _, name := range slices.Sorted(maps.Keys(ages)) {", "        fmt.Println(name, ages[name])", "    }", "    counts := make(map[string]int)", "    for _, w := range []string{\"go\", \"is\", \"go\"} {", "        counts[w]++", "    }", "    fmt.Println(counts)", "}"]),
          walk: ["Line 10: a map with two entries.", "Lines 11–13: add Mia, add one to Leo: 12 3.", "Lines 14–15: Zed isn't there: 0 false.", "Lines 16–19: remove Mia, then print in sorted order: Ana 12, Leo 12.", "Lines 20–24: counting words: map[go:2 is:1]."] },
        mistake: "Writing to a nil map: var scores map[string]int then scores[\"Ana\"] = 5 panics with “assignment to entry in nil map.” Use make(map[string]int) first."
      } },
    { title: "Functions", chapter: "Machines · parameters, multiple returns, closures", line: "func add(a, b int) int { return a + b }",
      content: {
        story: ["A function is a named machine: values go in, a result comes out. func add(a, b int) int takes two ints and returns one. Parameters that share a type can share one type name.",
          "Go functions can return several results at once: func divmod(a, b int) (int, int). Callers catch them all: q, r := divmod(17, 5). This is how Go returns a value and an error together.",
          "Functions are values too: you can store one in a variable, pass it to another function, or return it. A function made inside another can remember the variables around it — that's a closure."],
        big: "Functions take typed inputs, can return several results, and are values you can pass around and close over.",
        caption: "A machine with two input slots and two output chutes: 17 and 5 go in, 3 and 2 come out. Tap Play.",
        demo: ["divmod(17, 5)", "17 / 5 → 3", "17 % 5 → 2", "q, r := 3, 2"]
      },
      deep: {
        more: ["A variadic parameter, nums ...int, accepts any number of arguments as a slice. Call it with total(1, 2, 3), or pass a slice with total(scores...).",
          "Go has no default parameter values and no function overloading. Different needs get different, clearly named functions — simple to read and to search."],
        ex: { code: src(["package main", "", "import \"fmt\"", "", "func add(a, b int) int {", "    return a + b", "}", "", "func divmod(a, b int) (int, int) {", "    return a / b, a % b", "}", "", "func total(nums ...int) int {", "    sum := 0", "    for _, n := range nums {", "        sum += n", "    }", "    return sum", "}", "", "func counter() func() int {", "    n := 0", "    return func() int {", "        n++", "        return n", "    }", "}", "", "func main() {", "    fmt.Println(add(2, 3))", "    q, r := divmod(17, 5)", "    fmt.Println(q, r)", "    fmt.Println(total(1, 2, 3, 4))", "    next := counter()", "    next()", "    fmt.Println(next())", "}"]),
          walk: ["Lines 5–7: two ints in, one out.", "Lines 9–11: two results at once.", "Lines 13–19: ...int accepts any number of ints.", "Lines 21–27: counter returns a function that remembers n.", "Lines 30–33: 5, then 3 2, then 10.", "Lines 34–36: the closure counts 1, then prints 2."] },
        mistake: "Ignoring a second result by leaving it out: q := divmod(17, 5) is an error. Catch both, or throw one away with _: q, _ := divmod(17, 5)."
      } },
    { title: "Structs and Methods", chapter: "Blueprints · struct, fields, methods", line: 'p := Player{Name: "Ana", HP: 100}',
      content: {
        story: ["A struct bundles related values into one new type. type Player struct { Name string; HP int } says every Player has a name and some health points. Build one with Player{Name: \"Ana\", HP: 100} and read a field with p.Name.",
          "A method is a function attached to a type. func (p Player) Describe() string has a receiver, (p Player), before its name, and you call it with p.Describe().",
          "Go has no classes or constructors. By habit, a function called NewPlayer builds a ready-to-use value. Fields and methods starting with a capital letter are exported; lower-case ones stay private to the package."],
        big: "Structs group fields into a type, methods attach behavior with a receiver, and NewX functions build ready values.",
        caption: "A blueprint labeled Player stamps out two players with their own names and health. Tap Play.",
        demo: ["type Player struct { … }", "ana := NewPlayer(\"Ana\")", "ana.Level = 2", "ana.Describe()"]
      },
      deep: {
        more: ["Instead of inheritance, Go uses embedding: put one struct type inside another without a field name, and its fields and methods are promoted to the outer struct.",
          "Printf's %+v prints a struct with its field names — perfect for debugging. Structs with the same fields can be compared with ==."],
        ex: { code: src(["package main", "", "import \"fmt\"", "", "type Player struct {", "    Name  string", "    HP    int", "    Level int", "}", "", "func (p Player) Describe() string {", "    return fmt.Sprintf(\"%s (level %d, %d HP)\", p.Name, p.Level, p.HP)", "}", "", "func NewPlayer(name string) Player {", "    return Player{Name: name, HP: 100, Level: 1}", "}", "", "func main() {", "    ana := NewPlayer(\"Ana\")", "    ana.Level = 2", "    fmt.Println(ana.Describe())", "    leo := Player{Name: \"Leo\"}", "    fmt.Println(leo.HP, leo)", "    fmt.Printf(\"%+v\\n\", ana)", "}"]),
          walk: ["Lines 5–9: the Player type, with three fields.", "Lines 11–13: a method with a receiver.", "Lines 15–17: a NewPlayer helper builds a starting player.", "Lines 20–22: Ana (level 2, 100 HP).", "Lines 23–24: fields left out are zero: 0 {Leo 0 0}.", "Line 25: %+v shows the field names: {Name:Ana HP:100 Level:2}."] },
        mistake: "Expecting a method with a plain receiver to change the struct. func (p Player) LevelUp() { p.Level++ } changes a copy. To change the real one, use a pointer receiver: (p *Player)."
      } },
    { title: "Pointers", chapter: "Addresses · &, *, pointer receivers, nil", line: "ptr := &score",
      content: {
        story: ["Go passes values by copying them. Hand a struct to a function and the function gets its own copy — changes don't come back. A pointer is the address of a value, so you can share the real thing instead.",
          "&score gives the address of score; its type is *int, “pointer to int.” *ptr follows the pointer to the value: *ptr += 5 changes score itself.",
          "Methods that change their struct use a pointer receiver: func (p *Player) Heal(n int). Go takes the address for you when you call ana.Heal(25). A pointer that points nowhere is nil."],
        big: "& takes an address, * follows it, and pointer receivers let methods change the real value instead of a copy.",
        caption: "A signpost labeled ptr points at the box score; change through the sign and the box changes. Tap Play.",
        demo: ["score := 10", "ptr := &score", "*ptr += 5", "score → 15"]
      },
      deep: {
        more: ["Go has no pointer arithmetic: you can't move a pointer along memory as in C. The garbage collector frees values when nothing points at them anymore, so you never free memory yourself.",
          "Following a nil pointer crashes the program with “invalid memory address or nil pointer dereference.” Check p != nil when a pointer might be empty."],
        ex: { code: src(["package main", "", "import \"fmt\"", "", "type Player struct {", "    Name string", "    HP   int", "}", "", "func (p *Player) Heal(n int) {", "    p.HP += n", "}", "", "func resetCopy(p Player) {", "    p.HP = 0", "}", "", "func reset(p *Player) {", "    p.HP = 0", "}", "", "func main() {", "    score := 10", "    ptr := &score", "    *ptr += 5", "    fmt.Println(score, *ptr)", "    ana := Player{Name: \"Ana\", HP: 50}", "    ana.Heal(25)", "    resetCopy(ana)", "    fmt.Println(ana.HP)", "    reset(&ana)", "    fmt.Println(ana.HP)", "    var nobody *Player", "    fmt.Println(nobody == nil)", "}"]),
          walk: ["Lines 10–12: a pointer receiver changes the real player.", "Lines 14–16: this gets a copy, so its change is lost.", "Lines 18–20: this gets the address, so it sticks.", "Lines 23–26: through the pointer: 15 15.", "Lines 27–30: healed to 75; resetCopy changes nothing: 75.", "Lines 31–32: reset works: 0.", "Lines 33–34: an empty pointer is nil: true."] },
        mistake: "Mixing value and pointer receivers on one type. Pick pointer receivers for all of a type's methods if any of them must change it — it keeps behavior predictable."
      } },
    { title: "Interfaces", chapter: "Contracts · interfaces, any, type switches", line: "type Shape interface{ Area() float64 }",
      content: {
        story: ["An interface is a list of methods — a contract. type Shape interface { Area() float64 } says “a Shape is anything with an Area method.” A Rect and a Circle are both Shapes as soon as they have that method; Go never asks you to declare it.",
          "That lets one function work with many types: loop over a []Shape and call s.Area() on each, whatever it really is. Small interfaces are the Go style — io.Reader has a single method, and it's used everywhere.",
          "fmt.Stringer is a famous one: give your type a String() string method and Println uses it. The empty interface, written any, holds a value of any type; a type switch finds out what's inside."],
        big: "Interfaces list methods; any type with those methods fits automatically, so one function can serve many types.",
        caption: "A socket shaped like Area(): a rectangle and a circle both plug in. Tap Play.",
        demo: ["type Shape interface { Area() }", "Rect has Area → a Shape", "Circle has Area → a Shape", "for _, s := range shapes"]
      },
      deep: {
        more: ["A type assertion pulls the concrete value back out: r, ok := s.(Rect). The comma-ok form avoids a panic when s holds something else.",
          "“Accept interfaces, return structs” is a common Go saying: functions take the smallest interface they need, which makes them easy to test with stand-in types."],
        ex: { code: src(["package main", "", "import (", "    \"fmt\"", "    \"math\"", ")", "", "type Shape interface {", "    Area() float64", "}", "", "type Rect struct{ W, H float64 }", "type Circle struct{ R float64 }", "", "func (r Rect) Area() float64   { return r.W * r.H }", "func (c Circle) Area() float64 { return math.Pi * c.R * c.R }", "", "func (r Rect) String() string { return fmt.Sprintf(\"%gx%g rectangle\", r.W, r.H) }", "", "func describe(v any) string {", "    switch x := v.(type) {", "    case int:", "        return fmt.Sprint(\"a number: \", x)", "    case string:", "        return \"some text: \" + x", "    default:", "        return \"something else\"", "    }", "}", "", "func main() {", "    shapes := []Shape{Rect{W: 3, H: 4}, Circle{R: 1}}", "    for _, s := range shapes {", "        fmt.Printf(\"%.2f\\n\", s.Area())", "    }", "    fmt.Println(Rect{W: 2, H: 5})", "    fmt.Println(describe(42), \"|\", describe(\"hi\"), \"|\", describe(true))", "}"]),
          walk: ["Lines 8–10: the Shape contract.", "Lines 12–16: two types, each with an Area method — both are Shapes.", "Line 18: a String method, so Println knows how to show a Rect.", "Lines 20–29: a type switch looks inside an any.", "Lines 32–35: 12.00 and 3.14.", "Line 36: 2x5 rectangle.", "Line 37: a number: 42 | some text: hi | something else."] },
        mistake: "Defining a method on a pointer, func (r *Rect) Area(), then putting a plain Rect into a []Shape. Only *Rect has the method; use &Rect{…} or a value receiver."
      } },
    { title: "Errors and defer", chapter: "Safety nets · error values, wrapping, defer, panic", line: "if err != nil { return err }",
      content: {
        story: ["Go has no exceptions for everyday problems. A function that can fail returns an error as its last result, and the caller checks it straight away: n, err := strconv.Atoi(text); if err != nil { … }. nil means “no error.”",
          "Make an error with errors.New(\"no save file\") or fmt.Errorf. Wrapping with %w adds context while keeping the original inside: fmt.Errorf(\"load level: %w\", err). errors.Is checks for a particular error anywhere in the chain.",
          "defer schedules a call for when the function returns, perfect for clean-up: open a file, then defer f.Close() on the next line. panic is for true emergencies — bugs that should stop the program — and recover can catch one in a deferred function."],
        big: "Errors are ordinary returned values: check err != nil, wrap with %w for context, and defer the clean-up.",
        caption: "Each step hands back a value and a little error flag; a red flag stops the line. Tap Play.",
        demo: ["n, err := strconv.Atoi(\"abc\")", "err != nil → handle it", "return fmt.Errorf(\"…: %w\", err)", "defer f.Close()"]
      },
      deep: {
        more: ["Deferred calls run in last-in, first-out order, and their arguments are worked out when the defer line runs, not later.",
          "Error messages in Go start with a lower-case letter and have no full stop, because they're often joined together: “load level: open save.txt: no such file or directory.”"],
        ex: { code: src(["package main", "", "import (", "    \"errors\"", "    \"fmt\"", "    \"strconv\"", ")", "", "var ErrTooBig = errors.New(\"number too big\")", "", "func parseLevel(text string) (int, error) {", "    n, err := strconv.Atoi(text)", "    if err != nil {", "        return 0, fmt.Errorf(\"parse level %q: %w\", text, err)", "    }", "    if n > 99 {", "        return 0, ErrTooBig", "    }", "    return n, nil", "}", "", "func main() {", "    defer fmt.Println(\"done (deferred, so printed last)\")", "    for _, text := range []string{\"7\", \"abc\", \"500\"} {", "        level, err := parseLevel(text)", "        if errors.Is(err, ErrTooBig) {", "            fmt.Println(\"too big:\", text)", "            continue", "        }", "        if err != nil {", "            fmt.Println(\"error:\", err)", "            continue", "        }", "        fmt.Println(\"level\", level)", "    }", "}"]),
          walk: ["Line 9: a named error callers can check for.", "Lines 11–20: return a value and an error; nil means it worked.", "Line 14: %w wraps Atoi's error with more context.", "Line 23: deferred, so it prints after everything else.", "Lines 24–35: level 7; then error: parse level \"abc\": strconv.Atoi: parsing \"abc\": invalid syntax; then too big: 500."] },
        mistake: "Throwing errors away with _: n, _ := strconv.Atoi(text). If text isn't a number, n is silently 0. Check the error, even if you only print it."
      } },
    { title: "Generics", chapter: "Reusable code · type parameters, constraints", line: "func First[T any](items []T) T { return items[0] }",
      content: {
        story: ["Sometimes the same code works for many types: finding the bigger of two values, reversing a list, a stack of anything. Generics let you write it once. Square brackets after the name list type parameters: func Max[T cmp.Ordered](a, b T) T.",
          "The constraint after T says what the type must support. any allows every type; cmp.Ordered allows types that can be compared with < and >, like numbers and strings. You can write your own: type Number interface { ~int | ~float64 }.",
          "Go usually works out T from the arguments, so you call Max(3, 7) or Max(\"apple\", \"pear\") without saying the type. Types can be generic too: type Stack[T any] struct { items []T }."],
        big: "Type parameters in [ ] let one function or type work for many types, limited by a constraint like any or cmp.Ordered.",
        caption: "One mould labeled [T] casts a box of ints, then a box of strings. Tap Play.",
        demo: ["func Max[T cmp.Ordered](a, b T) T", "Max(3, 7) → 7", "Max(\"apple\", \"pear\") → \"pear\"", "T worked out for you"]
      },
      deep: {
        more: ["The ~ in ~int means “int, or any type built on int,” so a type Score int also fits the constraint.",
          "Reach for generics when you notice the same code copied for different types. For a single type, plain code is clearer — and the standard slices and maps packages already cover the common helpers."],
        ex: { code: src(["package main", "", "import (", "    \"cmp\"", "    \"fmt\"", ")", "", "func Max[T cmp.Ordered](a, b T) T {", "    if a > b {", "        return a", "    }", "    return b", "}", "", "func Map[T, U any](items []T, f func(T) U) []U {", "    out := make([]U, 0, len(items))", "    for _, it := range items {", "        out = append(out, f(it))", "    }", "    return out", "}", "", "type Stack[T any] struct {", "    items []T", "}", "", "func (s *Stack[T]) Push(v T) { s.items = append(s.items, v) }", "", "func (s *Stack[T]) Pop() (T, bool) {", "    var zero T", "    if len(s.items) == 0 {", "        return zero, false", "    }", "    v := s.items[len(s.items)-1]", "    s.items = s.items[:len(s.items)-1]", "    return v, true", "}", "", "func main() {", "    fmt.Println(Max(3, 7), Max(\"apple\", \"pear\"))", "    lengths := Map([]string{\"go\", \"gopher\"}, func(s string) int { return len(s) })", "    fmt.Println(lengths)", "    var s Stack[string]", "    s.Push(\"a\")", "    s.Push(\"b\")", "    top, _ := s.Pop()", "    fmt.Println(top)", "}"]),
          walk: ["Lines 8–13: Max works for any ordered type.", "Lines 15–21: Map turns a []T into a []U with a function.", "Lines 23–37: a generic stack; zero is the empty value of whatever T is.", "Line 40: 7 pear.", "Lines 41–42: [2 6].", "Lines 43–47: push a and b, pop b."] },
        mistake: "Using a constraint that's too loose: func Max[T any](a, b T) won't compile, because any type might not support >. Choose cmp.Ordered."
      } },
    { title: "Goroutines and Channels", chapter: "Concurrency · go, chan, WaitGroup, Mutex", line: 'go func() { ch <- "done" }()',
      content: {
        story: ["Go is famous for doing many things at once. Put go before a function call and it runs as a goroutine — a lightweight task alongside the rest of the program. A computer can run hundreds of thousands of them.",
          "Goroutines talk through channels. ch := make(chan string) makes one; ch <- \"done\" sends a value and msg := <-ch receives it. A send waits until someone receives, so channels also keep goroutines in step.",
          "sync.WaitGroup waits for a group of goroutines to finish: Add before starting each, Done when each ends, Wait to pause until all are done. When goroutines share a variable, a sync.Mutex makes them take turns."],
        big: "go starts a goroutine, channels pass values between goroutines, and WaitGroup and Mutex keep them coordinated.",
        caption: "Three workers set off at once and drop their results into one chute. Tap Play.",
        demo: ["go worker(1, results)", "go worker(2, results)", "results <- \"worker 1 done\"", "fmt.Println(<-results)"]
      },
      deep: {
        more: ["select waits on several channels at once and runs whichever is ready first — handy for timeouts with time.After.",
          "Two goroutines changing the same variable without a mutex is a data race: the result can be wrong in ways that change from run to run. go run -race finds races for you. Go's motto: “share memory by communicating.”"],
        ex: { code: src(["package main", "", "import (", "    \"fmt\"", "    \"sync\"", "    \"time\"", ")", "", "func worker(id int, results chan<- string) {", "    time.Sleep(time.Duration(id) * 10 * time.Millisecond)", "    results <- fmt.Sprintf(\"worker %d done\", id)", "}", "", "func main() {", "    results := make(chan string)", "    for id := 1; id <= 3; id++ {", "        go worker(id, results)", "    }", "    for range 3 {", "        fmt.Println(<-results)", "    }", "", "    var wg sync.WaitGroup", "    var mu sync.Mutex", "    count := 0", "    for range 100 {", "        wg.Add(1)", "        go func() {", "            defer wg.Done()", "            mu.Lock()", "            count++", "            mu.Unlock()", "        }()", "    }", "    wg.Wait()", "    fmt.Println(\"count:\", count)", "}"]),
          walk: ["Lines 9–12: a worker naps, then sends a message; chan<- means it may only send.", "Lines 15–18: start three workers at once.", "Lines 19–21: receive three messages, in the order the workers finish.", "Lines 23–34: 100 goroutines each add 1, taking turns with the mutex.", "Lines 35–36: Wait until all are done: count: 100."] },
        mistake: "Letting main return before goroutines finish. When main ends, the whole program stops, mid-work or not. Wait with a WaitGroup or a channel."
      } },
    { title: "Packages, Modules and Tools", chapter: "Real projects · go mod, go build, go test, gofmt", line: 'import "example.com/hello/greet"',
      content: {
        story: ["A Go project is a module: a folder with a go.mod file, made by go mod init example.com/hello. The module name is how its packages are imported. Each sub-folder is a package, and every file in a folder shares the same package name.",
          "Names that start with a capital letter are exported — visible to other packages. greet.Hello is usable from main; greet.helper is private to package greet.",
          "The go command does everything: go run runs, go build makes a program file, go test runs tests, go vet spots suspicious code, and gofmt formats. go get example.com/lib adds a third-party package and records it in go.mod."],
        big: "A module is a folder with go.mod; packages are folders; capital names are exported; the go command builds, tests and formats it all.",
        caption: "A project folder opens: go.mod on top, packages in folders, one go build making a single program. Tap Play.",
        demo: ["$ go mod init example.com/hello", "greet/greet.go → package greet", "main.go → import \".../greet\"", "$ go build → ./hello"]
      },
      deep: {
        more: ["go build can make programs for other systems from your computer: GOOS=windows go build makes a .exe, GOOS=linux GOARCH=arm64 builds for a Raspberry Pi. The result is a single file with no installer needed.",
          "pkg.go.dev lists every public Go package with its documentation. Doc comments — comments directly above an exported name, starting with that name — become that documentation automatically."],
        ex: { code: src(["package main", "", "import (", "    \"fmt\"", "    \"os\"", "    \"strings\"", ")", "", "// Greeting is exported: it starts with a capital letter.", "func Greeting(name string) string {", "    return \"Hello, \" + strings.TrimSpace(name) + \"!\"", "}", "", "// shout is unexported: only this package can use it.", "func shout(s string) string { return strings.ToUpper(s) }", "", "func main() {", "    name := \"gopher\"", "    if len(os.Args) > 1 {", "        name = os.Args[1]", "    }", "    fmt.Println(Greeting(name))", "    fmt.Println(shout(\"go build makes one program file\"))", "}"]),
          walk: ["Lines 9–12: a doc comment, then an exported function.", "Lines 14–15: a private helper.", "Lines 18–21: os.Args holds the words typed after the program's name; go run main.go Ana would greet Ana.", "Line 22: Hello, gopher!", "Line 23: GO BUILD MAKES ONE PROGRAM FILE."] },
        mistake: "Importing a package and not using it. Go stops with “imported and not used.” Remove the import — most editors do it for you on save."
      } }
  ];

  var shelves = [
    { title: "Standard Library Field Guide", chapter: "Beyond the basics · Go shelf", line: ["import \"strings\"", "import \"strconv\""],
      content: {
        story: ["Go's standard library is large and well made — many programs need nothing else. fmt prints, strings and strconv handle text, slices and maps sort and search, time measures and formats time, os talks to the computer, and net/http builds web servers.",
          "Before writing something yourself, check pkg.go.dev/std: strings.Fields splits on spaces, slices.Sort sorts, time.Since measures how long something took, math/rand/v2 rolls dice.",
          "Package documentation is short and full of runnable examples. Reading it is one of the fastest ways to get better at Go."],
        big: "fmt, strings, strconv, slices, maps, time and os cover most daily work — check the standard library before building your own.",
        caption: "A workshop wall of labeled toolboxes, each one an import away. Tap Play.",
        demo: ["strings.Fields(\"a b c\")", "strconv.Atoi(\"42\")", "slices.Sort(scores)", "time.Since(start)"]
      },
      deep: {
        more: ["time.Duration prints nicely: 90 * time.Second prints as 1m30s. Durations are how Go measures every pause, timeout and timer.",
          "bufio.Scanner reads input or files line by line; os.ReadFile and os.WriteFile read or write a whole file in one call."],
        ex: { code: src(["package main", "", "import (", "    \"fmt\"", "    \"math\"", "    \"slices\"", "    \"strconv\"", "    \"strings\"", "    \"time\"", ")", "", "func main() {", "    words := strings.Fields(\"  the quick   brown fox \")", "    fmt.Println(len(words), strings.Join(words, \"-\"))", "    n, err := strconv.Atoi(\"42\")", "    fmt.Println(n+1, err)", "    scores := []int{40, 75, 60}", "    slices.Sort(scores)", "    fmt.Println(scores, slices.Contains(scores, 75))", "    fmt.Println(90*time.Second, math.Round(2.5))", "}"]),
          walk: ["Lines 13–14: Fields splits on any run of spaces: 4 the-quick-brown-fox.", "Lines 15–16: text to a number: 43 <nil>.", "Lines 17–19: [40 60 75] true.", "Line 20: 1m30s 3."] },
        mistake: "Writing your own sorting, splitting or date math. The library versions are tested on billions of inputs; yours isn't yet."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · Go shelf", line: ["panic: runtime error: index out of range [5] with length 3", "main.main()"],
      content: {
        story: ["Most Go bugs are caught before the program runs. The compiler names the file, the line and the problem: “declared and not used: x”, “\"os\" imported and not used”, “cannot use name (variable of type string) as int value.” Fix the first error first; later ones are often echoes.",
          "Runtime crashes are called panics. The message says what went wrong — index out of range, nil map, nil pointer dereference — and the stack trace below lists the functions that were running, newest first, with line numbers.",
          "go vet finds code that compiles but is probably wrong, like a Printf verb that doesn't match its value. go run -race catches goroutines fighting over the same variable."],
        big: "Read the first compile error first, read a panic's message and top stack line, and let go vet and -race find hidden bugs.",
        caption: "A magnifying glass moves down a panic message to the exact line. Tap Play.",
        demo: ["panic: index out of range [5]", "goroutine 1 [running]:", "main.main()", "    main.go:7"]
      },
      deep: {
        more: ["fmt.Printf(\"%+v\\n\", value) is the quickest debugging tool: it prints a whole struct with field names. For bigger hunts, the Delve debugger (dlv) lets you pause and step through code.",
          "A deferred function can call recover() to stop a panic and turn it into an ordinary error. Libraries use this at their edges; most code should just return errors."],
        ex: { code: src(["package main", "", "import \"fmt\"", "", "func safeGet(items []int, i int) (v int, err error) {", "    defer func() {", "        if r := recover(); r != nil {", "            err = fmt.Errorf(\"recovered: %v\", r)", "        }", "    }()", "    return items[i], nil", "}", "", "func main() {", "    items := []int{10, 20, 30}", "    fmt.Println(safeGet(items, 1))", "    fmt.Println(safeGet(items, 5))", "    var scores map[string]int", "    fmt.Println(scores[\"Ana\"], len(scores))", "}"]),
          walk: ["Lines 5–12: named results let the deferred function change err.", "Lines 6–10: recover catches the panic and turns it into an error.", "Line 16: 20 <nil>.", "Line 17: 0 recovered: runtime error: index out of range [5] with length 3.", "Lines 18–19: reading a nil map is safe: 0 0. Writing to it would panic."] },
        mistake: "Guessing instead of reading. A panic message names the problem and the line — start there, not with random changes."
      } },
    { title: "Testing with go test", chapter: "Beyond the basics · Go shelf", line: ["func TestGrade(t *testing.T) {", "go test ./..."],
      content: {
        story: ["Go has testing built in. Tests live next to your code in files ending in _test.go, and each test is a function named TestSomething that takes t *testing.T. go test ./... finds and runs them all.",
          "Inside a test, call the code and compare: if got != want, t.Errorf reports what went wrong and the test keeps going; t.Fatalf stops it.",
          "The Go favorite is the table-driven test: a slice of cases — inputs and the expected output — and one loop that checks them all. Adding a case is one line."],
        big: "Tests are TestX functions in _test.go files; table-driven tests check many cases in one loop; go test runs them.",
        caption: "A checklist of cases gets ticked one by one: 95 → A, 85 → B, 40 → C. Tap Play.",
        demo: ["grade_test.go", "func TestGrade(t *testing.T)", "{95, \"A\"} ✓ {85, \"B\"} ✓", "ok  example.com/app"]
      },
      deep: {
        more: ["go test -cover shows how much of your code the tests run. Benchmarks, func BenchmarkX(b *testing.B), measure speed with go test -bench=.",
          "Example functions with an // Output: comment are tests and documentation at once: go test checks the printed output matches."],
        ex: { test: true, code: src(["// File: grade.go", "package grades", "", "// Grade turns a score out of 100 into a letter.", "func Grade(score int) string {", "    switch {", "    case score >= 90:", "        return \"A\"", "    case score >= 80:", "        return \"B\"", "    default:", "        return \"C\"", "    }", "}", "// File: grade_test.go", "package grades", "", "import \"testing\"", "", "func TestGrade(t *testing.T) {", "    tests := []struct {", "        score int", "        want  string", "    }{", "        {95, \"A\"},", "        {85, \"B\"},", "        {40, \"C\"},", "    }", "    for _, tt := range tests {", "        if got := Grade(tt.score); got != tt.want {", "            t.Errorf(\"Grade(%d) = %q, want %q\", tt.score, got, tt.want)", "        }", "    }", "}"]),
          walk: ["Two files in one folder: the code, and its tests.", "grade.go: an ordinary function in package grades.", "grade_test.go: a test function the go tool finds by its name.", "The table lists each score and the letter it should get.", "The loop checks every case; any mismatch is reported with t.Errorf.", "go test prints ok when every case passes."] },
        mistake: "Tests that never check anything. A test with no comparison passes forever, whatever the code does."
      } },
    { title: "Building a Web Server", chapter: "Beyond the basics · Go shelf", line: ["http.HandleFunc(\"/scores\", scoresHandler)", "http.ListenAndServe(\":8080\", nil)"],
      content: {
        story: ["Go is one of the best languages for web servers, and the standard library includes a production-ready one. A handler is a function that receives a request and writes a response: func(w http.ResponseWriter, r *http.Request).",
          "http.HandleFunc(\"/scores\", scoresHandler) connects a path to a handler, and http.ListenAndServe(\":8080\", nil) starts the server — open localhost:8080/scores in a browser. Each request runs in its own goroutine automatically.",
          "encoding/json turns structs into JSON and back. Struct tags like `json:\"name\"` choose the JSON field names."],
        big: "A handler writes a response for each request, HandleFunc routes paths to handlers, and encoding/json speaks JSON.",
        caption: "A request arrives at /scores, the handler answers with JSON. Tap Play.",
        demo: ["GET /scores", "scoresHandler(w, r)", "json.NewEncoder(w).Encode(…)", "200 [{\"name\":\"Ana\",…}]"]
      },
      deep: {
        more: ["Since Go 1.22, patterns can include the method and wildcards: http.HandleFunc(\"GET /players/{id}\", …), and r.PathValue(\"id\") reads the id.",
          "The httptest package sends pretend requests straight to a handler — no network needed — which is how Go servers are tested, and how this example runs."],
        ex: { code: src(["package main", "", "import (", "    \"encoding/json\"", "    \"fmt\"", "    \"net/http\"", "    \"net/http/httptest\"", ")", "", "type Score struct {", "    Name   string `json:\"name\"`", "    Points int    `json:\"points\"`", "}", "", "func scoresHandler(w http.ResponseWriter, r *http.Request) {", "    w.Header().Set(\"Content-Type\", \"application/json\")", "    json.NewEncoder(w).Encode([]Score{{Name: \"Ana\", Points: 120}, {Name: \"Leo\", Points: 95}})", "}", "", "func main() {", "    http.HandleFunc(\"GET /scores\", scoresHandler)", "    // A real server would now run: http.ListenAndServe(\":8080\", nil)", "    // Instead, send it one pretend request:", "    req := httptest.NewRequest(\"GET\", \"/scores\", nil)", "    rec := httptest.NewRecorder()", "    http.DefaultServeMux.ServeHTTP(rec, req)", "    fmt.Println(rec.Code, rec.Header().Get(\"Content-Type\"))", "    fmt.Print(rec.Body.String())", "}"]),
          walk: ["Lines 10–13: struct tags pick the JSON names.", "Lines 15–18: the handler sets a header and writes JSON.", "Line 21: route GET /scores to the handler.", "Lines 24–26: a pretend request, answered by the server's router.", "Lines 27–28: 200 application/json, then [{\"name\":\"Ana\",\"points\":120},{\"name\":\"Leo\",\"points\":95}]."] },
        mistake: "Ignoring errors from the network. Real servers check every err — a failed write, bad JSON in a request — and answer with the right status code, like http.StatusBadRequest."
      } },
    { title: "Concurrency Patterns", chapter: "Beyond the basics · Go shelf", line: ["for n := range jobs {", "ctx, cancel := context.WithTimeout(ctx, time.Second)"],
      content: {
        story: ["A worker pool is the classic pattern: a few goroutines read jobs from one channel and handle them in parallel. Close the channel when the jobs run out and each worker's range loop ends by itself.",
          "context carries deadlines and cancellation through a program. context.WithTimeout gives a ctx that's done after a set time; long jobs check ctx.Done() and stop early. Every web request in Go carries a context.",
          "Keep it simple: start with plain code, and add goroutines where there is real waiting — network calls, files, slow work — to do."],
        big: "Worker pools share jobs through a channel, a Mutex guards shared totals, and context stops work that runs too long.",
        caption: "A conveyor of jobs feeds three workers; a timer stops the line when time is up. Tap Play.",
        demo: ["jobs := make(chan int)", "3 workers: for n := range jobs", "close(jobs) → workers finish", "ctx.Done() → gave up"]
      },
      deep: {
        more: ["The errgroup package (golang.org/x/sync/errgroup) runs a group of goroutines and returns the first error, cancelling the rest — a WaitGroup that understands errors.",
          "A buffered channel, make(chan int, 10), holds up to 10 values without a receiver waiting. It's also a simple way to limit how many things run at once."],
        ex: { code: src(["package main", "", "import (", "    \"context\"", "    \"fmt\"", "    \"sync\"", "    \"time\"", ")", "", "func main() {", "    jobs := make(chan int)", "    var mu sync.Mutex", "    var wg sync.WaitGroup", "    total := 0", "    for range 3 {", "        wg.Add(1)", "        go func() {", "            defer wg.Done()", "            for n := range jobs {", "                mu.Lock()", "                total += n * n", "                mu.Unlock()", "            }", "        }()", "    }", "    for n := 1; n <= 10; n++ {", "        jobs <- n", "    }", "    close(jobs)", "    wg.Wait()", "    fmt.Println(\"total:\", total)", "", "    ctx, cancel := context.WithTimeout(context.Background(), 20*time.Millisecond)", "    defer cancel()", "    select {", "    case <-time.After(time.Second):", "        fmt.Println(\"finished\")", "    case <-ctx.Done():", "        fmt.Println(\"gave up:\", ctx.Err())", "    }", "}"]),
          walk: ["Lines 15–25: three workers take jobs until the channel closes.", "Lines 20–22: the mutex makes them take turns adding to total.", "Lines 26–30: send ten jobs, close the channel, wait.", "Line 31: 1² + 2² + … + 10² — total: 385.", "Lines 33–40: a one-second job with a 20 ms deadline: gave up: context deadline exceeded."] },
        mistake: "Forgetting to close the jobs channel. The workers' range loops wait forever, wg.Wait never returns, and Go reports “all goroutines are asleep - deadlock!”"
      } }
  ];

  var glossary = [
    ["any", "The type that can hold a value of any type; another name for interface{}."],
    ["append", "The built-in that adds items to a slice and returns the new slice."],
    ["argument", "A value passed into a function call."],
    ["array", "A fixed-size list whose length is part of its type, like [3]int."],
    ["backing array", "The array a slice looks at; windows of one slice share it."],
    ["blank identifier", "_, a name that throws away a value you don't need."],
    ["bool", "The type with two values: true and false."],
    ["break", "Leaves a loop (or a switch) immediately."],
    ["buffered channel", "A channel that can hold some values before anyone receives them."],
    ["byte", "One raw 8-bit value; strings are made of bytes."],
    ["cap", "The built-in that gives a slice's capacity: room before it must grow."],
    ["channel", "A typed pipe that goroutines use to send and receive values."],
    ["close", "The built-in that marks a channel as finished; range over it then ends."],
    ["closure", "A function that remembers variables from where it was made."],
    ["cmp.Ordered", "The constraint for types that support < and >: numbers and strings."],
    ["comma-ok", "The v, ok := form that reports whether a lookup or assertion worked."],
    ["compile error", "A mistake the Go compiler finds before the program runs."],
    ["composite literal", "A value written out in place, like []int{1, 2} or Player{Name: \"Ana\"}."],
    ["const", "A value fixed when the program is compiled."],
    ["constraint", "The rule after a type parameter saying which types are allowed."],
    ["context", "A package and value that carry deadlines and cancellation."],
    ["continue", "Skips to the next round of a loop."],
    ["data race", "Two goroutines touching the same variable at once, unprotected."],
    ["deadlock", "Every goroutine waiting on another, so nothing can move."],
    ["defer", "Schedules a call to run when the surrounding function returns."],
    ["delete", "The built-in that removes a key from a map."],
    ["embedding", "Putting one struct inside another so its fields and methods are promoted."],
    ["error", "The built-in interface for values that describe what went wrong."],
    ["errors.Is", "Checks whether an error, or one wrapped inside it, is a given error."],
    ["exported", "A name starting with a capital letter, visible to other packages."],
    ["fallthrough", "Makes a switch case continue into the next one; rarely needed."],
    ["float64", "The everyday type for decimal numbers."],
    ["fmt", "The format package: Println, Printf, Sprintf and friends."],
    ["for", "Go's only loop keyword, in counting, while-style and range forms."],
    ["func", "The keyword that defines a function or method."],
    ["garbage collector", "The part of Go that frees memory nothing uses anymore."],
    ["generics", "Code written once with type parameters that works for many types."],
    ["go (keyword)", "Starts a function call running as a new goroutine."],
    ["go.mod", "The file at the root of a module naming it and its dependencies."],
    ["go vet", "A tool that reports code that compiles but is probably wrong."],
    ["gofmt", "The tool that formats Go code in the one standard style."],
    ["goroutine", "A lightweight task running alongside the rest of the program."],
    ["handler", "A function that answers web requests."],
    ["if", "Runs a block only when its test is true."],
    ["import", "Brings a package's tools into a file."],
    ["int", "The everyday type for whole numbers."],
    ["interface", "A list of methods; any type that has them satisfies it."],
    ["iota", "A counter inside const blocks: 0, 1, 2 … for numbered constants."],
    ["len", "The built-in that gives the length of a string, slice, map or channel."],
    ["make", "The built-in that creates slices, maps and channels ready to use."],
    ["map", "A collection that looks values up by key."],
    ["method", "A function attached to a type through a receiver."],
    ["module", "A Go project: a folder tree with a go.mod at its root."],
    ["mutex", "A lock (sync.Mutex) that makes goroutines take turns."],
    ["nil", "The zero value for pointers, slices, maps, channels, functions and interfaces."],
    ["package", "A folder of Go files that share a name and work together."],
    ["package main", "The package for runnable programs; it starts at func main."],
    ["panic", "A run-time crash for serious bugs, like an index out of range."],
    ["parameter", "A named, typed input in a function's definition."],
    ["pointer", "A value holding the address of another value, like *int."],
    ["Printf verb", "A placeholder like %d, %s or %v that Printf fills with a value."],
    ["range", "Walks through a slice, map, string, channel or number in a for loop."],
    ["receiver", "The (p Player) before a method's name, saying which type it belongs to."],
    ["recover", "Stops a panic when called inside a deferred function."],
    ["return", "Ends a function and hands back its results."],
    ["rune", "One Unicode character, such as 'é'."],
    ["select", "Waits on several channel operations and runs the first ready one."],
    ["short declaration", ":=, which makes a new variable and infers its type."],
    ["slice", "Go's flexible list type, like []int."],
    ["Sprintf", "Like Printf, but returns the text instead of printing it."],
    ["standard library", "The packages that come with Go."],
    ["string", "The type for text."],
    ["strconv", "The package that converts between text and numbers."],
    ["struct", "A type that groups named fields."],
    ["struct tag", "Text after a field, like `json:\"name\"`, read by packages such as encoding/json."],
    ["switch", "Picks one case among many, stopping after the match."],
    ["sync.WaitGroup", "Waits for a group of goroutines to finish."],
    ["table-driven test", "A test that loops over a list of input-and-expected-output cases."],
    ["type assertion", "s.(Rect): gets the concrete value out of an interface."],
    ["type parameter", "The T in func Max[T cmp.Ordered]: a placeholder for a type."],
    ["type switch", "A switch on v.(type) that branches on what an interface holds."],
    ["unexported", "A lower-case name, visible only inside its own package."],
    ["var", "The keyword that declares a variable, optionally with its type."],
    ["variadic", "A function taking any number of arguments, like nums ...int."],
    ["zero value", "The value a variable has before you set it: 0, \"\", false or nil."]
  ];

  var field = [
    { name: "fmt.Printf", head: "fmt", what: "Prints with verbs: %d, %s, %v, %.2f, %q, %T.", ex: "fmt.Printf(\"%s: %d\\n\", name, n)" },
    { name: "fmt.Sprintf", head: "fmt", what: "Builds formatted text without printing it.", ex: "label := fmt.Sprintf(\"Level %d\", lv)" },
    { name: "strings", head: "strings", what: "ToUpper, Contains, Split, Join, Fields, Repeat, Replace, TrimSpace.", ex: "strings.Split(\"a,b\", \",\")" },
    { name: "strconv", head: "strconv", what: "Text to numbers and back: Atoi, Itoa, ParseFloat, FormatInt.", ex: "n, err := strconv.Atoi(\"42\")" },
    { name: "slices", head: "slices", what: "Sort, Contains, Index, Max, Min, Reverse for slices.", ex: "slices.Sort(scores)" },
    { name: "maps", head: "maps", what: "Keys, Values and Clone for maps; sort keys for a steady order.", ex: "slices.Sorted(maps.Keys(m))" },
    { name: "errors", head: "errors", what: "New makes an error; Is and As look inside wrapped errors.", ex: "errors.Is(err, os.ErrNotExist)" },
    { name: "os", head: "os", what: "Files, folders, arguments and environment variables.", ex: "data, err := os.ReadFile(\"save.txt\")" },
    { name: "time", head: "time", what: "Now, Since, Sleep, Duration, timers and formatting.", ex: "time.Sleep(100 * time.Millisecond)" },
    { name: "math", head: "math", what: "Sqrt, Pow, Floor, Round, Abs, Pi and friends.", ex: "math.Sqrt(2)" },
    { name: "math/rand/v2", head: "math/rand/v2", what: "Random numbers for games and simulations.", ex: "roll := rand.IntN(6) + 1" },
    { name: "bufio.Scanner", head: "bufio", what: "Reads input or a file one line at a time.", ex: "sc := bufio.NewScanner(os.Stdin)" },
    { name: "encoding/json", head: "encoding/json", what: "Turns structs into JSON and back with Marshal and Unmarshal.", ex: "b, err := json.Marshal(player)" },
    { name: "net/http", head: "net/http", what: "Web servers and clients, ready for real traffic.", ex: "http.HandleFunc(\"/\", home)" },
    { name: "sync", head: "sync", what: "WaitGroup waits for goroutines; Mutex makes them take turns.", ex: "var wg sync.WaitGroup" }
  ];

  var cheats = [
    { title: "Program Skeleton Card", body: "The shape of a Go program.", code: src(["package main", "", "import \"fmt\"", "", "func main() {", "    fmt.Println(\"Hello\")", "}"]) },
    { title: "Variables Card", body: "Everyday types and conversions.", code: src(["var n int = 42", "x := 3.14", "ok := true", "s := \"text\"", "r := 'A'", "const max = 10", "f := float64(n) / 2", "text := strconv.Itoa(n)", "back, err := strconv.Atoi(\"7\")"]) },
    { title: "Decisions Card", body: "Choices at a glance.", code: src(["if x > 0 {", "    fmt.Println(\"positive\")", "} else if x == 0 {", "    fmt.Println(\"zero\")", "} else {", "    fmt.Println(\"negative\")", "}", "switch day {", "case \"Sat\", \"Sun\":", "    fmt.Println(\"weekend\")", "default:", "    fmt.Println(\"weekday\")", "}"]) },
    { title: "Loops Card", body: "Every shape of for.", code: src(["for i := 0; i < 3; i++ {", "}", "for lives > 0 {", "    lives--", "}", "for i, v := range items {", "    fmt.Println(i, v)", "}", "for i := range 5 {", "    fmt.Println(i)", "}", "for {", "    break", "}"]) },
    { title: "Slices & Maps Card", body: "Lists and lookups.", code: src(["s := []int{1, 2, 3}", "s = append(s, 4)", "part := s[1:3]", "n := len(s)", "m := map[string]int{\"a\": 1}", "m[\"b\"] = 2", "v, ok := m[\"c\"]", "delete(m, \"a\")"]) },
    { title: "Structs Card", body: "Types, constructors and methods.", code: src(["type Box struct {", "    Size int", "}", "", "func NewBox(size int) *Box {", "    return &Box{Size: size}", "}", "", "func (b *Box) Grow() { b.Size++ }", "", "func (b Box) String() string {", "    return fmt.Sprintf(\"Box %d\", b.Size)", "}"]) },
    { title: "Errors Card", body: "Return, check, wrap, defer.", code: src(["f, err := os.Open(name)", "if err != nil {", "    return fmt.Errorf(\"open %s: %w\", name, err)", "}", "defer f.Close()", "if errors.Is(err, os.ErrNotExist) {", "    fmt.Println(\"no file\")", "}"]) },
    { title: "Concurrency Card", body: "Goroutines, channels and waiting.", code: src(["ch := make(chan int)", "go func() { ch <- 42 }()", "v := <-ch", "var wg sync.WaitGroup", "wg.Add(1)", "go func() {", "    defer wg.Done()", "}()", "wg.Wait()", "select {", "case v := <-ch:", "    fmt.Println(v)", "case <-time.After(time.Second):", "    fmt.Println(\"timeout\")", "}"]) }
  ];

  /* A whole main.go: imports, then any types and functions, then main. */
  function M(imports, decls, body) {
    var out = ["package main", ""];
    if (imports.length === 1) out.push('import "' + imports[0] + '"');
    else out = out.concat(["import ("], imports.map(function (p) { return '    "' + p + '"'; }), [")"]);
    out.push("");
    if (decls.length) out = out.concat(decls, [""]);
    return out.concat(["func main() {"], body.map(function (l) { return l ? "    " + l : ""; }), ["}"]);
  }
  function stars(n) { return new Array(n + 1).join("*"); }
  function padR(s, w) { while (s.length < w) s += " "; return s; }
  function padL(s, w) { s = String(s); while (s.length < w) s = " " + s; return s; }
  function goList(a) { return "[" + a.join(" ") + "]"; }

  var projects = [
    { name: "Rocket Countdown", about: "A for loop counts the rocket down to blast off.",
      vars: [{ key: "start", val: 5, min: 1, max: 12 }],
      code: function (v) { return M(["fmt"], [], ["start := " + v.start, "for i := start; i > 0; i-- {", "    fmt.Printf(\"%d...\\n\", i)", "}", "fmt.Println(\"Blast off!\")"]); },
      run: function (v) { var o = []; for (var i = v.start; i > 0; i--) o.push(i + "..."); o.push("Blast off!"); return o; },
      explain: "i starts at your number, i-- takes one away each round, and the loop stops when i > 0 is false. Then the rocket launches." },
    { name: "Star Steps", about: "strings.Repeat builds each row: Repeat(\"*\", 3) is ***.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return M(["fmt", "strings"], [], ["rows := " + v.rows, "for r := 1; r <= rows; r++ {", "    fmt.Println(strings.Repeat(\"*\", r))", "}"]); },
      run: function (v) { var o = []; for (var r = 1; r <= v.rows; r++) o.push(stars(r)); return o; },
      explain: "strings.Repeat makes a row r stars long, so each line is one star longer than the last." },
    { name: "Coin Bank", about: "Every coin adds to the total.",
      vars: [{ key: "coins", val: 5, min: 1, max: 10 }, { key: "each", val: 25, min: 1, max: 50 }],
      code: function (v) { return M(["fmt"], [], ["coins := " + v.coins, "each := " + v.each, "total := 0", "for c := 1; c <= coins; c++ {", "    total += each", "    fmt.Printf(\"Coin %d: total %d\\n\", c, total)", "}"]); },
      run: function (v) { var o = [], t = 0; for (var c = 1; c <= v.coins; c++) { t += v.each; o.push("Coin " + c + ": total " + t); } return o; },
      explain: "total starts at 0, and += adds one coin's worth each round." },
    { name: "Score Doubler", about: "A score that doubles every round, counted with range.",
      vars: [{ key: "score", val: 3, min: 1, max: 50 }, { key: "rounds", val: 5, min: 1, max: 10 }],
      code: function (v) { return M(["fmt"], [], ["score := " + v.score, "rounds := " + v.rounds, "for r := range rounds {", "    score *= 2", "    fmt.Printf(\"Round %d: %d\\n\", r+1, score)", "}"]); },
      run: function (v) { var o = [], s = v.score; for (var r = 1; r <= v.rounds; r++) { s *= 2; o.push("Round " + r + ": " + s); } return o; },
      explain: "range rounds counts r from 0, so r+1 gives a friendly round number. *= 2 doubles the score each time." },
    { name: "Times Table", about: "A multiplication table for any number.",
      vars: [{ key: "num", val: 7, min: 1, max: 12 }, { key: "upto", val: 5, min: 1, max: 12 }],
      code: function (v) { return M(["fmt"], [], ["num := " + v.num, "upto := " + v.upto, "for i := 1; i <= upto; i++ {", "    fmt.Printf(\"%d x %d = %d\\n\", num, i, num*i)", "}"]); },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(v.num + " x " + i + " = " + v.num * i); return o; },
      explain: "Printf's three %d verbs take num, i and the product, in order." },
    { name: "Temperature Converter", about: "Celsius to Fahrenheit with one decimal place.",
      vars: [{ key: "celsius", val: 20, min: -40, max: 100 }],
      code: function (v) { return M(["fmt"], [], ["celsius := " + v.celsius, "fahrenheit := float64(celsius)*9/5 + 32", "fmt.Printf(\"%d C is %.1f F\\n\", celsius, fahrenheit)"]); },
      run: function (v) { return [v.celsius + " C is " + (v.celsius * 9 / 5 + 32).toFixed(1) + " F"]; },
      explain: "float64(celsius) turns the int into a decimal first, so 9/5 doesn't round down. %.1f shows one decimal place." },
    { name: "Tip Calculator", about: "A tip and total for a bill, in whole dollars.",
      vars: [{ key: "bill", val: 40, min: 1, max: 500 }, { key: "percent", val: 15, min: 0, max: 30 }],
      code: function (v) { return M(["fmt"], [], ["bill := " + v.bill, "percent := " + v.percent, "tip := bill * percent / 100", "fmt.Printf(\"Bill: $%d\\n\", bill)", "fmt.Printf(\"Tip: $%d\\n\", tip)", "fmt.Printf(\"Total: $%d\\n\", bill+tip)"]); },
      run: function (v) { var tip = Math.floor(v.bill * v.percent / 100); return ["Bill: $" + v.bill, "Tip: $" + tip, "Total: $" + (v.bill + tip)]; },
      explain: "int division drops the cents, so a $40 bill at 15% tips $6, not $6.00." },
    { name: "FizzBuzz", about: "Multiples of 3 say Fizz, of 5 say Buzz, of both say FizzBuzz.",
      vars: [{ key: "limit", val: 15, min: 1, max: 30 }],
      code: function (v) { return M(["fmt"], [], ["limit := " + v.limit, "for n := 1; n <= limit; n++ {", "    switch {", "    case n%15 == 0:", "        fmt.Println(\"FizzBuzz\")", "    case n%3 == 0:", "        fmt.Println(\"Fizz\")", "    case n%5 == 0:", "        fmt.Println(\"Buzz\")", "    default:", "        fmt.Println(n)", "    }", "}"]); },
      run: function (v) { var o = []; for (var n = 1; n <= v.limit; n++) o.push(n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : String(n)); return o; },
      explain: "A switch with no value checks each case in order. The 15 case comes first so 15 doesn't stop at Fizz." },
    { name: "Score Stats", about: "Highest, lowest and average of a slice.",
      vars: [{ key: "first", val: 72, min: 0, max: 100 }, { key: "second", val: 95, min: 0, max: 100 }, { key: "third", val: 64, min: 0, max: 100 }],
      code: function (v) { return M(["fmt", "slices"], [], ["first := " + v.first, "second := " + v.second, "third := " + v.third, "scores := []int{first, second, third}", "sum := 0", "for _, s := range scores {", "    sum += s", "}", "fmt.Println(\"Scores:\", scores)", "fmt.Println(\"Highest:\", slices.Max(scores))", "fmt.Println(\"Lowest:\", slices.Min(scores))", "fmt.Printf(\"Average: %.1f\\n\", float64(sum)/float64(len(scores)))"]); },
      run: function (v) { var a = [v.first, v.second, v.third], s = v.first + v.second + v.third; return ["Scores: " + goList(a), "Highest: " + Math.max.apply(null, a), "Lowest: " + Math.min.apply(null, a), "Average: " + (s / 3).toFixed(1)]; },
      explain: "range adds every score to sum; slices.Max and slices.Min do the searching. Converting to float64 keeps the average's decimal." },
    { name: "Class Vote", about: "A map counts votes, printed in sorted order.",
      vars: [{ key: "ana", val: 3, min: 0, max: 20 }, { key: "leo", val: 5, min: 0, max: 20 }],
      code: function (v) { return M(["fmt", "maps", "slices"], [], ["ana := " + v.ana, "leo := " + v.leo, "votes := map[string]int{\"Mia\": 4, \"Ana\": ana, \"Leo\": leo}", "votes[\"Ana\"] += 2", "total := 0", "for _, name := range slices.Sorted(maps.Keys(votes)) {", "    fmt.Printf(\"%s: %d\\n\", name, votes[name])", "    total += votes[name]", "}", "fmt.Println(\"Total votes:\", total)"]); },
      run: function (v) { return ["Ana: " + (v.ana + 2), "Leo: " + v.leo, "Mia: 4", "Total votes: " + (v.ana + 2 + v.leo + 4)]; },
      explain: "Ana gets two late votes with +=. A map's order is random, so the keys are sorted first to print the same way every time." },
    { name: "Shopping Cart", about: "A slice of structs adds up a receipt.",
      vars: [{ key: "apples", val: 3, min: 0, max: 10 }, { key: "pears", val: 2, min: 0, max: 10 }],
      code: function (v) { return M(["fmt"], ["type Item struct {", "    Name  string", "    Price int", "    Qty   int", "}"], ["apples := " + v.apples, "pears := " + v.pears, "cart := []Item{", "    {Name: \"Apple\", Price: 50, Qty: apples},", "    {Name: \"Pear\", Price: 75, Qty: pears},", "    {Name: \"Bread\", Price: 250, Qty: 1},", "}", "total := 0", "for _, it := range cart {", "    cost := it.Price * it.Qty", "    total += cost", "    fmt.Printf(\"%-6s x%d %5d\\n\", it.Name, it.Qty, cost)", "}", "fmt.Printf(\"Total: $%d.%02d\\n\", total/100, total%100)"]); },
      run: function (v) {
        var cart = [["Apple", 50, v.apples], ["Pear", 75, v.pears], ["Bread", 250, 1]], o = [], t = 0;
        cart.forEach(function (it) { var c = it[1] * it[2]; t += c; o.push(padR(it[0], 6) + " x" + it[2] + " " + padL(c, 5)); });
        o.push("Total: $" + Math.floor(t / 100) + "." + (t % 100 < 10 ? "0" : "") + (t % 100));
        return o;
      },
      explain: "Prices are in cents to avoid rounding errors. %-6s pads the name to six letters, %5d lines the costs up on the right, and %02d keeps two digits of cents." },
    { name: "Hero Healing", about: "A pointer-receiver method heals the real hero.",
      vars: [{ key: "hp", val: 40, min: 1, max: 99 }, { key: "potion", val: 25, min: 5, max: 50 }],
      code: function (v) { return M(["fmt"], ["type Hero struct {", "    Name string", "    HP   int", "}", "", "func (h *Hero) Heal(amount int) {", "    h.HP = min(h.HP+amount, 100)", "}"], ["hp := " + v.hp, "potion := " + v.potion, "hero := Hero{Name: \"Ana\", HP: hp}", "for hero.HP < 100 {", "    hero.Heal(potion)", "    fmt.Printf(\"%s drinks a potion: %d HP\\n\", hero.Name, hero.HP)", "}"]); },
      run: function (v) { var o = [], hp = v.hp; while (hp < 100) { hp = Math.min(hp + v.potion, 100); o.push("Ana drinks a potion: " + hp + " HP"); } return o; },
      explain: "Heal has a pointer receiver (h *Hero), so it changes the real hero, and min caps the health at 100. Without the *, it would heal a copy and the loop would never end." },
    { name: "Shape Areas", about: "One loop over an interface handles two kinds of shape.",
      vars: [{ key: "w", val: 4, min: 1, max: 20 }, { key: "h", val: 3, min: 1, max: 20 }, { key: "side", val: 5, min: 1, max: 20 }],
      code: function (v) { return M(["fmt"], ["type Shape interface {", "    Area() int", "    Name() string", "}", "", "type Rect struct{ W, H int }", "type Square struct{ Side int }", "", "func (r Rect) Area() int      { return r.W * r.H }", "func (r Rect) Name() string   { return \"rectangle\" }", "func (s Square) Area() int    { return s.Side * s.Side }", "func (s Square) Name() string { return \"square\" }"], ["w := " + v.w, "h := " + v.h, "side := " + v.side, "shapes := []Shape{Rect{W: w, H: h}, Square{Side: side}}", "total := 0", "for _, s := range shapes {", "    fmt.Printf(\"%s: %d\\n\", s.Name(), s.Area())", "    total += s.Area()", "}", "fmt.Println(\"Total area:\", total)"]); },
      run: function (v) { var a = v.w * v.h, b = v.side * v.side; return ["rectangle: " + a, "square: " + b, "Total area: " + (a + b)]; },
      explain: "Rect and Square both have Area and Name, so both are Shapes. The loop calls the right method for each without knowing which is which." },
    { name: "Cookie Sharing", about: "A function returns a result and an error.",
      vars: [{ key: "cookies", val: 12, min: 0, max: 50 }, { key: "friends", val: 4, min: 0, max: 10 }],
      code: function (v) { return M(["errors", "fmt"], ["func share(cookies, friends int) (int, error) {", "    if friends == 0 {", "        return 0, errors.New(\"no friends to share with\")", "    }", "    return cookies / friends, nil", "}"], ["cookies := " + v.cookies, "friends := " + v.friends, "each, err := share(cookies, friends)", "if err != nil {", "    fmt.Println(\"Error:\", err)", "    return", "}", "fmt.Printf(\"Each friend gets %d\\n\", each)", "fmt.Printf(\"Left over: %d\\n\", cookies%friends)"]); },
      run: function (v) { if (v.friends === 0) return ["Error: no friends to share with"]; return ["Each friend gets " + Math.floor(v.cookies / v.friends), "Left over: " + v.cookies % v.friends]; },
      explain: "Set friends to 0: dividing by zero would crash, so share returns an error instead, and main checks err before using the answer." },
    { name: "Generic Sum", about: "One generic function adds ints and decimals.",
      vars: [{ key: "count", val: 4, min: 1, max: 10 }],
      code: function (v) { return M(["fmt"], ["type Number interface {", "    ~int | ~float64", "}", "", "func Sum[T Number](nums []T) T {", "    var total T", "    for _, n := range nums {", "        total += n", "    }", "    return total", "}"], ["count := " + v.count, "var ints []int", "var halves []float64", "for i := 1; i <= count; i++ {", "    ints = append(ints, i)", "    halves = append(halves, float64(i)/2)", "}", "fmt.Println(ints, \"sum to\", Sum(ints))", "fmt.Println(halves, \"sum to\", Sum(halves))"]); },
      run: function (v) {
        var ints = [], halves = [], si = 0, sh = 0;
        for (var i = 1; i <= v.count; i++) { ints.push(i); halves.push(i / 2); si += i; sh += i / 2; }
        return [goList(ints) + " sum to " + si, goList(halves.map(String)) + " sum to " + sh];
      },
      explain: "Sum's type parameter T can be any Number, so the same code adds a []int and a []float64. Go works out T from the slice you pass." },
    { name: "Goroutine Workers", about: "Workers run at once; a WaitGroup waits for them all.",
      vars: [{ key: "workers", val: 3, min: 1, max: 8 }, { key: "jobs", val: 4, min: 1, max: 10 }],
      code: function (v) { return M(["fmt", "sync"], [], ["workers := " + v.workers, "jobs := " + v.jobs, "results := make([]int, workers)", "var wg sync.WaitGroup", "for id := range workers {", "    wg.Add(1)", "    go func() {", "        defer wg.Done()", "        for j := 1; j <= jobs; j++ {", "            results[id] += (id + 1) * j", "        }", "    }()", "}", "wg.Wait()", "for id, r := range results {", "    fmt.Printf(\"Worker %d made %d\\n\", id+1, r)", "}"]); },
      run: function (v) { var o = [], tri = v.jobs * (v.jobs + 1) / 2; for (var id = 0; id < v.workers; id++) o.push("Worker " + (id + 1) + " made " + (id + 1) * tri); return o; },
      explain: "Each goroutine writes only its own slot in results, so they never collide. wg.Wait() pauses main until every worker has called Done." },
    { name: "Square Pipeline", about: "One goroutine sends squares down a channel; main receives them.",
      vars: [{ key: "n", val: 5, min: 1, max: 12 }],
      code: function (v) { return M(["fmt"], [], ["n := " + v.n, "squares := make(chan int)", "go func() {", "    for i := 1; i <= n; i++ {", "        squares <- i * i", "    }", "    close(squares)", "}()", "sum := 0", "for sq := range squares {", "    fmt.Println(\"got\", sq)", "    sum += sq", "}", "fmt.Println(\"sum:\", sum)"]); },
      run: function (v) { var o = [], s = 0; for (var i = 1; i <= v.n; i++) { o.push("got " + i * i); s += i * i; } o.push("sum: " + s); return o; },
      explain: "Each send waits for main to receive, so the values arrive in order. close tells range there's nothing more, and the loop ends." },
    { name: "Number Guesser", about: "Halving the range finds any number from 1 to 100 in 7 guesses or fewer.",
      vars: [{ key: "secret", val: 37, min: 1, max: 100 }],
      code: function (v) { return M(["fmt"], [], ["secret := " + v.secret, "low, high := 1, 100", "for tries := 1; ; tries++ {", "    guess := (low + high) / 2", "    if guess == secret {", "        fmt.Printf(\"Got it: %d in %d tries\\n\", guess, tries)", "        break", "    } else if guess < secret {", "        fmt.Printf(\"%d is too low\\n\", guess)", "        low = guess + 1", "    } else {", "        fmt.Printf(\"%d is too high\\n\", guess)", "        high = guess - 1", "    }", "}"]); },
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
    { line: 'fmt.Println("{w}")', why: "Println prints the text and ends the line." },
    { line: "fmt.Println({v})", why: "Without quotes, Println prints the variable's value." },
    { line: 'fmt.Println("{w}:", {v})', why: "Println puts a space between each item." },
    { line: 'fmt.Printf("%d\\n", {v})', why: "%d fills in a whole number; \\n ends the line." },
    { line: "{v} := {n}", why: ":= makes a new variable and infers int." },
    { line: "var {v} int = {n}", why: "var spells out the type." },
    { line: "{v} := {dec}", why: "A decimal value makes a float64." },
    { line: "{v} := {b}", why: "true or false makes a bool." },
    { line: '{sv} := "{w}"', why: "Text in double quotes makes a string." },
    { line: "const {v} = {n}", why: "const fixes a value forever." },
    { line: "{v} += {n}", why: "+= adds onto the current value." },
    { line: "{v} -= {d}", why: "-= takes away from the current value." },
    { line: "{v} *= {d}", why: "*= multiplies the current value." },
    { line: "{v}++", why: "++ adds exactly one." },
    { line: "{v}--", why: "-- takes away exactly one." },
    { line: "{v} = {u} + {n}", why: "The right side is worked out, then stored on the left." },
    { line: "{v} := {u} % {d}", why: "% gives the remainder of a division." },
    { line: "{v} := float64({u}) / {d}", why: "Convert to float64 first for a decimal answer." },
    { line: "{sv} := strconv.Itoa({v})", why: "Itoa turns an int into text." },
    { line: '{v}, err := strconv.Atoi("{n}")', why: "Atoi turns text into an int, with an error if it can't." },
    { line: 'if {v} > {n} { fmt.Println("{w}") }', why: "if runs its block only when the test is true." },
    { line: "if {v} == {n} { {u} = 0 }", why: "== asks whether two values are equal." },
    { line: "} else if {v} < {d} {", why: "else if tries another test when the first was false." },
    { line: 'if {v}, ok := {m}["{w}"]; ok { fmt.Println({v}) }', why: "The if declares v and ok, then tests ok." },
    { line: 'switch {v} { case {n}: fmt.Println("{w}") }', why: "switch compares one value against each case." },
    { line: "for i := 0; i < {n}; i++ { {v} += i }", why: "The classic for: start, test, step." },
    { line: "for {v} > 0 { {v}-- }", why: "for with only a test acts like a while loop." },
    { line: "for i := range {n} { {v} += i }", why: "range over a number counts from 0." },
    { line: "for _, x := range {arr} { {v} += x }", why: "range walks the slice; _ drops the position." },
    { line: "{arr} := []int{{n}, {n2}, {n3}}", why: "A slice literal lists its values." },
    { line: "{arr} = append({arr}, {n})", why: "append returns the slice with one more item." },
    { line: "{v} := len({arr})", why: "len counts the items in a slice." },
    { line: "{arr}[{d}] = {n}", why: "Square brackets reach a position, counting from 0." },
    { line: "top := {arr}[:{d}]", why: "s[:k] is a window over the first k items." },
    { line: '{m} := map[string]int{"{w}": {n}}', why: "A map literal links keys to values." },
    { line: '{m}["{w}"] = {n}', why: "Set a map value by its key." },
    { line: 'delete({m}, "{w}")', why: "delete removes a key from a map." },
    { line: '{v}, ok := {m}["{w}"]', why: "ok reports whether the key exists." },
    { line: "func {f}({v} int) int { return {v} * {d} }", why: "A function with a typed parameter and result." },
    { line: 'func {f}() { fmt.Println("{w}") }', why: "A function that takes nothing and returns nothing." },
    { line: "{f}({n})", why: "Call a function with an argument." },
    { line: "{v} := {f}({u})", why: "Store a function's result in a new variable." },
    { line: "type {c} struct{ {sv} string }", why: "A struct type with one field." },
    { line: '{o} := {c}{Name: "{w}"}', why: "A struct literal sets fields by name." },
    { line: '{o}.Name = "{w}"', why: "The dot reaches a field." },
    { line: "func ({o} *{c}) Rename(s string) { {o}.Name = s }", why: "A pointer receiver changes the real value." },
    { line: "ptr := &{v}", why: "& takes a variable's address." },
    { line: "*ptr += {n}", why: "* follows the pointer to change the value." },
    { line: "type {c}Store interface{ Get(id int) ({c}, error) }", why: "An interface lists the methods a type must have." },
    { line: 'func ({o} {c}) String() string { return "{w}" }', why: "A String method makes the type print nicely." },
    { line: "if err != nil { return {v}, err }", why: "Check the error and pass it up." },
    { line: 'return fmt.Errorf("{f} {w}: %w", err)', why: "%w wraps an error with context." },
    { line: 'defer fmt.Println("{w}", {v})', why: "defer runs the call when the function returns." },
    { line: "func {f}[T any]({arr} []T) T { return {arr}[0] }", why: "A type parameter makes the function work for any slice." },
    { line: "go {f}({v})", why: "go runs the call as a goroutine." },
    { line: "ch := make(chan int, {n})", why: "A buffered channel holds values before they're received." },
    { line: "ch <- {v}", why: "<- sends a value into a channel." },
    { line: "{v} := <-ch", why: "<- on the left receives from a channel." },
    { line: "go func() { defer wg.Done(); {f}({v}) }()", why: "A goroutine tells the WaitGroup when it's done." },
    { line: "select { case {v} := <-ch: fmt.Println({v}) }", why: "select runs whichever channel is ready." },
    { line: 'data, err := os.ReadFile("{w}.txt")', why: "ReadFile reads a whole file, with an error." },
    { line: '{sv} := strings.ToUpper("{w}")', why: "ToUpper returns the text in capitals." },
    { line: '{sv} := strings.Repeat("{w}", {d})', why: "Repeat joins copies of the text." },
    { line: 'ok := strings.Contains({sv}, "{w}")', why: "Contains reports whether the text appears." },
    { line: "slices.Sort({arr})", why: "slices.Sort sorts in place." },
    { line: "{v} := slices.Max({arr})", why: "slices.Max finds the largest item." },
    { line: '{sv} := fmt.Sprintf("{w} %d", {v})', why: "Sprintf builds text instead of printing it." },
    { line: "{v} := min({u}, {n})", why: "The built-in min picks the smallest." },
    { line: "{v} := max({u}, {n})", why: "The built-in max picks the largest." },
    { line: "{v}, {u} = {u}, {v}", why: "Swap two values in one line." }
  ];
  var themes = [
    { name: "Print & Talk", t: [0, 1, 2, 3, 8] },
    { name: "Short Boxes", t: [4, 5, 6, 7, 8] },
    { name: "Constants & Types", t: [9, 5, 4, 17, 7] },
    { name: "Math Moves", t: [10, 11, 12, 15, 16] },
    { name: "Steps & Swaps", t: [13, 14, 68, 66, 67] },
    { name: "Conversions", t: [17, 18, 19, 66, 4] },
    { name: "Yes or No", t: [20, 21, 22, 7, 24] },
    { name: "Switches", t: [24, 20, 22, 21, 15] },
    { name: "Loops", t: [25, 26, 27, 28, 10] },
    { name: "Slices", t: [29, 30, 31, 32, 33] },
    { name: "Slice Tools", t: [64, 65, 31, 30, 28] },
    { name: "Maps", t: [34, 35, 36, 37, 23] },
    { name: "Functions", t: [38, 39, 40, 41, 66] },
    { name: "Structs", t: [42, 43, 44, 49, 45] },
    { name: "Pointers & Methods", t: [46, 47, 45, 44, 43] },
    { name: "Interfaces", t: [48, 49, 43, 42, 45] },
    { name: "Errors", t: [19, 50, 51, 52, 60] },
    { name: "Generics & Strings", t: [53, 61, 62, 63, 65] },
    { name: "Goroutines & Channels", t: [54, 55, 56, 57, 58, 59] },
    { name: "Go Masters", t: [23, 45, 53, 58, 51] }
  ];
  /* Keep Go's built-in close out of the function bank. */
  var SAFE_FUNCS = ["play", "heal", "jump", "draw", "sing", "build", "spin", "dash", "grow", "shine", "mix", "lift", "drop", "launch", "move", "turn", "push", "pull", "wave", "zap", "mend", "craft", "boost", "cheer", "greet", "explore"];

  return {
    blocks: blocks, chapters: chapters, shelves: shelves, glossary: glossary, field: field, cheats: cheats,
    projects: projects, vt: vt, themes: themes,
    fill: function (k, r) {
      if (k === "f") return SAFE_FUNCS[Math.floor(r() * SAFE_FUNCS.length)];
      return null;
    },
    sandboxNote: "Thirty everyday Go lines, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your Go progress is saved separately from every other track.",
    sourcesHTML: 'Go facts and syntax follow <a href="https://go.dev/ref/spec">The Go Programming Language Specification</a>, <a href="https://go.dev/doc/effective_go">Effective Go</a> and the standard library documentation at <a href="https://pkg.go.dev/std">pkg.go.dev</a> (Go 1.24). Go is a trademark of Google; Code Block is not affiliated with Google. Every explanation is written in Code Block\u2019s own words, and every practice program is formatted with gofmt, checked with go vet and run with the real Go toolchain before it ships.'
  };
});
