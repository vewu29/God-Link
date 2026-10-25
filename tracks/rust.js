"use strict";
/* ================= RUST — a Code Block track =================
   Written fresh for Code Block in plain words. Facts and syntax follow
   The Rust Programming Language book, the Rust Reference and the
   standard library documentation (Rust 1.85+, edition 2024). Every PC
   project and library example is checked in tests/content: it must be
   rustfmt-formatted, build with clippy treating every warning as an
   error, and run — and a project's output must match the app. Every
   drill and Vault line is parsed with syn. */
cbRegisterTrack("rust", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Hello Block", short: "println!", chapter: "Rust Ch. 1 · First Steps", icon: "i-say", verb: "say",
      line: 'println!("Hello, world!");',
      explain: "println! prints a line. The ! means it's a macro — a piece of code that writes more code for you — and every statement ends with a semicolon." },
    { name: "Let Block", short: "let", chapter: "Rust Ch. 2 · Variables and Mutability", icon: "i-tag", verb: "name",
      line: "let score = 0;",
      explain: "let makes a variable. Rust works out the type (here a whole number, i32), and the value can't change unless you say so." },
    { name: "Mut Block", short: "let mut", chapter: "Rust Ch. 2 · Variables and Mutability", icon: "i-pencil", verb: "allow",
      line: "let mut lives = 3;",
      explain: "Variables are fixed by default. mut makes this one changeable, so lives -= 1 is allowed later. Rust makes every change visible on purpose." },
    { name: "Const Block", short: "const", chapter: "Rust Ch. 2 · Variables and Mutability", icon: "i-lock", verb: "fix",
      line: "const MAX_LIVES: u32 = 5;",
      explain: "A constant is fixed forever, must have its type written out, and is named in CAPITALS. u32 is a whole number that can't be negative." },
    { name: "Type Block", short: ": f64", chapter: "Rust Ch. 2 · Variables and Mutability", icon: "i-boxes", verb: "label",
      line: "let price: f64 = 4.99;",
      explain: "The : f64 is a type annotation: a 64-bit decimal number. Other everyday types are i32 (whole), bool (true/false), char ('A') and String (text)." },
    { name: "Convert Block", short: "f64::from", chapter: "Rust Ch. 3 · Operators and Math", icon: "i-calc", verb: "convert",
      line: "let avg = f64::from(total) / f64::from(count);",
      explain: "Rust never mixes number types by itself. f64::from turns whole numbers into decimals safely, so the division keeps its fraction." },
    { name: "String Block", short: "String", chapter: "Rust Ch. 4 · Strings and Formatting", icon: "i-link", verb: "build",
      line: 'let name = String::from("Ana");',
      explain: "String is text you own and can grow. A plain \"Ana\" in quotes is a &str — a borrowed view of text. String::from turns one into the other." },
    { name: "Format Block", short: "{name}", chapter: "Rust Ch. 4 · Strings and Formatting", icon: "i-brackets", verb: "fill",
      line: 'println!("{name} has {coins} coins");',
      explain: "Curly braces in the text are filled with values. {name} uses the variable called name directly; {} fills from the list after the text." },
    { name: "format! Block", short: "format!", chapter: "Rust Ch. 4 · Strings and Formatting", icon: "i-stamp", verb: "compose",
      line: 'let label = format!("Level {level}");',
      explain: "format! works like println!, but hands the finished text back as a String instead of printing it." },
    { name: "If Value Block", short: "if = ", chapter: "Rust Ch. 5 · Decisions", icon: "i-fork", verb: "choose",
      line: 'let size = if n > 10 { "big" } else { "small" };',
      explain: "In Rust, if gives back a value, so you can store its answer. Both branches must give the same type." },
    { name: "Match Block", short: "match", chapter: "Rust Ch. 5 · Decisions", icon: "i-toggle", verb: "match",
      line: 'match n { 0 => println!("zero"), _ => println!("other") }',
      explain: "match compares a value against patterns, top to bottom. _ matches anything left, and Rust checks that every possible value is covered." },
    { name: "For Range Block", short: "for in", chapter: "Rust Ch. 6 · Loops", icon: "i-repeat", verb: "count",
      line: 'for i in 0..5 { println!("{i}"); }',
      explain: "0..5 is a range: 0, 1, 2, 3, 4 (the end is left out). 1..=5 includes the end. for walks through it one value at a time." },
    { name: "While Block", short: "while", chapter: "Rust Ch. 6 · Loops", icon: "i-hourglass", verb: "repeat",
      line: "while lives > 0 { lives -= 1; }",
      explain: "while repeats as long as its test is true. Rust has no ++ or --; use += 1 and -= 1." },
    { name: "Loop Block", short: "loop", chapter: "Rust Ch. 6 · Loops", icon: "i-rotate", verb: "loop",
      line: "let result = loop { break 42; };",
      explain: "loop repeats forever until a break. break can carry a value out, so the whole loop gives back an answer — here 42." },
    { name: "Clone Block", short: ".clone()", chapter: "Rust Ch. 7 · Ownership", icon: "i-overlap", verb: "copy",
      line: "let s2 = s1.clone();",
      explain: "Every value has one owner. let s2 = s1; would move the text to s2 and leave s1 unusable. clone makes a real second copy so both can be used." },
    { name: "Borrow Block", short: "&", chapter: "Rust Ch. 8 · Borrowing and References", icon: "i-point", verb: "lend",
      line: "let len = calculate_length(&name);",
      explain: "&name lends the function a reference — a look, not the value itself. The function borrows it, and name is still yours afterwards." },
    { name: "Mutable Borrow Block", short: "&mut", chapter: "Rust Ch. 8 · Borrowing and References", icon: "i-point-spark", verb: "change",
      line: "fn add_coin(purse: &mut u32) { *purse += 1; }",
      explain: "&mut is a borrow that's allowed to change the value. * follows the reference to the real number. Only one &mut can exist at a time." },
    { name: "Function Block", short: "fn", chapter: "Rust Ch. 9 · Functions", icon: "i-play-circle", verb: "build",
      line: "fn add(a: i32, b: i32) -> i32 { a + b }",
      explain: "Every parameter has a type, and -> shows the return type. The last line without a semicolon is the answer — no return needed." },
    { name: "Struct Block", short: "struct", chapter: "Rust Ch. 10 · Structs and Methods", icon: "i-layers", verb: "design",
      line: "struct Player { name: String, hp: i32 }",
      explain: "A struct groups named fields into a new type. Every Player has a name and some health points." },
    { name: "Impl Block", short: "impl", chapter: "Rust Ch. 10 · Structs and Methods", icon: "i-gear", verb: "attach",
      line: "impl Player { fn heal(&mut self, n: i32) { self.hp += n; } }",
      explain: "impl adds methods to a type. &mut self means heal may change the player it's called on: ana.heal(10)." },
    { name: "Enum Block", short: "enum", chapter: "Rust Ch. 11 · Enums and match", icon: "i-list", verb: "list",
      line: "enum Direction { Up, Down, Left, Right }",
      explain: "An enum is a type with a fixed set of choices, called variants. A Direction is always exactly one of the four." },
    { name: "If Let Block", short: "if let", chapter: "Rust Ch. 11 · Enums and match", icon: "i-check", verb: "unwrap",
      line: 'if let Some(x) = maybe { println!("{x}"); }',
      explain: "Option is Rust's “maybe”: Some(value) or None. There's no null. if let runs the block only when there's something inside, and names it x." },
    { name: "Vec Block", short: "vec!", chapter: "Rust Ch. 12 · Collections", icon: "i-boxes", verb: "line up",
      line: "let mut scores = vec![10, 20, 30];",
      explain: "A Vec is a growable list of one type. vec! builds one with starting values; push adds more to the end." },
    { name: "Entry Block", short: "entry", chapter: "Rust Ch. 12 · Collections", icon: "i-folder", verb: "tally",
      line: "*counts.entry(word).or_insert(0) += 1;",
      explain: "A HashMap links keys to values. entry finds the word's slot, or_insert(0) creates it if missing, and += 1 counts it." },
    { name: "Question Mark Block", short: "?", chapter: "Rust Ch. 13 · Error Handling", icon: "i-shield-check", verb: "pass on",
      line: "let n: i32 = text.parse()?;",
      explain: "parse returns a Result: Ok(number) or Err(problem). The ? takes the number if it worked, or returns the error to the caller straight away." },
    { name: "Expect Block", short: "expect", chapter: "Rust Ch. 13 · Error Handling", icon: "i-shield-alert", verb: "insist",
      line: 'let file = File::open("save.txt").expect("no save file");',
      explain: "expect takes the value out of an Ok, or stops the program with your message if it's an Err. Fine for quick tools; real programs handle the error." },
    { name: "Trait Block", short: "trait", chapter: "Rust Ch. 14 · Traits and Generics", icon: "i-shapes", verb: "promise",
      line: "trait Shape { fn area(&self) -> f64; }",
      explain: "A trait lists methods a type promises to have. impl Shape for Circle keeps the promise, and code can then accept any Shape." },
    { name: "Generic Block", short: "<T>", chapter: "Rust Ch. 14 · Traits and Generics", icon: "i-brackets", verb: "reuse",
      line: "fn largest<T: PartialOrd>(a: T, b: T) -> T { if a > b { a } else { b } }",
      explain: "<T: PartialOrd> is a generic type with a bound: largest works for any type that can be compared with >, like numbers, letters or text." },
    { name: "Iterator Block", short: ".map()", chapter: "Rust Ch. 15 · Iterators and Closures", icon: "i-funnel", verb: "transform",
      line: "let doubled: Vec<i32> = nums.iter().map(|x| x * 2).collect();",
      explain: "iter walks the list, map transforms each item with a closure (|x| x * 2), and collect gathers the results into a new Vec." },
    { name: "Use Block", short: "use", chapter: "Rust Ch. 16 · Cargo, Crates and Modules", icon: "i-cube", verb: "bring in",
      line: "use std::collections::HashMap;",
      explain: "use brings a name into scope so you can write HashMap instead of the full path every time. std is Rust's standard library." }
  ];

  var chapters = [
    { title: "First Steps", chapter: "Start here · fn main, println! and cargo", line: 'println!("Hello, world!");',
      content: {
        story: ["Rust is a fast language that is famous for safety: it catches whole families of bugs — crashes, data corruption, threads fighting over memory — before your program ever runs. It's used in web browsers, operating systems, game engines, command-line tools and web servers, and it has been voted the most-loved language for years.",
          "Every Rust program starts at fn main(). println! prints a line; the ! marks it as a macro, a special kind of command. Statements end with a semicolon, and code blocks live inside curly braces.",
          "Install Rust from rustup.rs. cargo, Rust's build tool, does the rest: cargo new hello makes a project, and cargo run compiles and runs src/main.rs."],
        big: "A Rust program starts at fn main; println! prints; cargo new makes a project and cargo run runs it.",
        caption: "cargo builds the project, finds fn main, and the screen says hello. Tap Play.",
        demo: ["$ cargo new hello", "$ cargo run", "fn main() runs", "Hello, world!"]
      },
      deep: {
        more: ["Rust's compiler is strict but friendly: its error messages explain what went wrong, point at the exact spot, and often suggest the fix. Learning to read them is half of learning Rust.",
          "Rust has no garbage collector. Memory is freed exactly when its owner is done with it, which makes programs fast and predictable — the ownership chapters explain how."],
        ex: { code: src(["fn main() {", "    // My first Rust program", "    println!(\"Hello, world!\");", "    println!(\"I am learning Rust.\");", "    println!(\"{}\", 2 + 3);", "}"]),
          walk: ["Line 1: every program starts at fn main.", "Line 2: a comment, skipped by Rust.", "Lines 3–4: two lines of text.", "Line 5: {} is a gap filled by the value after the comma: 5."] },
        mistake: "Forgetting the ! on println. Without it, Rust looks for a function called println and stops with “expected function, found macro.”"
      } },
    { title: "Variables and Mutability", chapter: "Boxes · let, mut, shadowing, const, types", line: "let mut lives = 3;",
      content: {
        story: ["let makes a variable: let score = 0;. Rust works out the type from the value, and every value has a type that never changes: i32 for whole numbers, f64 for decimals, bool for true/false, char for one letter in single quotes, and String for text.",
          "Variables are immutable by default — once set, they can't change. That surprises newcomers, but it means you always know which values might change. Add mut when you need it: let mut lives = 3; then lives -= 1; is fine.",
          "You can make a new variable with the same name: let lives = lives - 1; This is shadowing — a fresh box, not a change. const makes a value fixed forever, with its type written out and its name in CAPITALS."],
        big: "let makes a variable that can't change; let mut makes one that can; const is fixed forever and typed.",
        caption: "Five labeled boxes; only the one marked mut has an open lid. Tap Play.",
        demo: ["let score = 0  → i32", "let price = 4.99  → f64", "let mut lives = 3", "lives -= 1  → 2"]
      },
      deep: {
        more: ["Integers come in sizes: i8, i16, i32, i64, i128 (can be negative) and u8 … u128 (can't). usize is the type for counting and indexing things. Write 1_000_000 with underscores to make big numbers easier to read.",
          "If you leave a variable unused, the compiler warns you. Name it with a leading underscore, like _unused, when that's on purpose."],
        ex: { code: src(["fn main() {", "    let hero = \"Ana\";", "    let mut score = 0;", "    let price: f64 = 4.99;", "    let alive = true;", "    let grade = 'A';", "    const MAX_LIVES: u32 = 5;", "    score += 10;", "    println!(\"{hero} {score} {price} {alive} {grade}\");", "    let lives = 3;", "    let lives = lives - 1;", "    println!(\"{lives} of {MAX_LIVES}\");", "}"]),
          walk: ["Line 2: text, borrowed as a &str.", "Line 3: mut, so score can change.", "Line 4: a decimal with its type written out.", "Lines 5–6: a bool and a char (single quotes).", "Line 7: a constant.", "Lines 8–9: Ana 10 4.99 true A.", "Lines 10–12: shadowing makes a new lives: 2 of 5."] },
        mistake: "Changing a variable you didn't mark mut. Rust stops with “cannot assign twice to immutable variable” and suggests adding mut — read the hint."
      } },
    { title: "Operators and Math", chapter: "Calculating · + - * / %, conversions, overflow", line: "let avg = f64::from(total) / f64::from(count);",
      content: {
        story: ["Rust does math with + - * / and % (the remainder). Dividing two whole numbers gives a whole number, rounded toward zero: 7 / 2 is 3, and 7 % 2 is 1. With decimals on both sides you get a decimal: 7.0 / 2.0 is 3.5.",
          "Rust never mixes types by itself: an i32 and an f64 can't be added. Convert first: f64::from(coins) is a safe conversion that can never lose information; as f64 also converts, and is used when a conversion might round.",
          "Numbers have methods: 2i32.pow(10), 16f64.sqrt(), hp.max(80), (-5i32).abs(). Shortcuts change a variable in place: hp -= 30, score *= 2. There's no ++; write += 1."],
        big: "Whole-number division rounds toward zero, % gives the remainder, and you convert types yourself with f64::from or as.",
        caption: "Two whole numbers divide with a remainder left over, then again as decimals. Tap Play.",
        demo: ["7 / 2 → 3", "7 % 2 → 1", "7.0 / 2.0 → 3.5", "2i32.pow(10) → 1024"]
      },
      deep: {
        more: ["Every integer type has a limit: a u8 holds 0 to 255. Going past it is called overflow. In a debug build Rust stops with a panic instead of quietly giving a wrong answer; methods like checked_add return None and wrapping_add wraps around on purpose.",
          "Decimal math is approximate on every computer: 0.1 + 0.2 isn't exactly 0.3. For money, count whole cents as integers."],
        ex: { code: src(["fn main() {", "    println!(\"{}\", 7 / 2);", "    println!(\"{}\", 7 % 2);", "    println!(\"{}\", 7.0 / 2.0);", "    let coins = 10;", "    let players = 4;", "    println!(\"{}\", f64::from(coins) / f64::from(players));", "    println!(\"{} {}\", 16f64.sqrt(), 2i32.pow(10));", "    let mut hp: i32 = 100;", "    hp -= 30;", "    hp += 1;", "    println!(\"{hp} {} {}\", hp.max(80), (hp - 90).abs());", "    let big: u8 = 250;", "    println!(\"{:?} {}\", big.checked_add(10), big.wrapping_add(10));", "}"]),
          walk: ["Line 2: whole-number division: 3.", "Line 3: the remainder: 1.", "Line 4: decimals: 3.5.", "Lines 5–7: convert first: 2.5.", "Line 8: 4 1024.", "Lines 9–12: 100 − 30 + 1 = 71; max(80) gives 80, and (71 − 90).abs() is 19. Calling methods needs a known type, hence : i32.", "Lines 13–14: 250 + 10 doesn't fit a u8: None, and wrapping round gives 4."] },
        mistake: "Writing let avg = total / count; with whole numbers and expecting a decimal. 7 / 2 is 3. Convert both sides first: f64::from(total) / f64::from(count)."
      } },
    { title: "Strings and Formatting", chapter: "Text · String, &str, format!, {} and {:?}", line: 'println!("{name} has {coins} coins");',
      content: {
        story: ["Rust has two text types. String is text you own: it can grow, and you make one with String::from(\"Ana\") or \"Ana\".to_string(). &str (say “string slice”) is a borrowed view of text — every \"literal in quotes\" is one. Functions that only read text usually take &str.",
          "println! and format! fill curly braces: {name} uses a variable by name, {} fills from the values after the text, {:?} shows the debug view (great for lists), {:.2} gives two decimal places, and {:>5} lines text up on the right.",
          "Strings are stored as UTF-8 bytes, so len() counts bytes and é takes two. chars() walks the letters one by one. push_str adds text to a String, and to_uppercase, contains, replace, split and trim are a method call away."],
        big: "String owns text and &str borrows it; println! and format! fill {} gaps, and {:?} shows the debug view.",
        caption: "A sentence with gaps, and values sliding into each pair of braces. Tap Play.",
        demo: ["\"{name} has {coins} coins\"", "{name} ← \"Ana\"", "{coins} ← 42", "Ana has 42 coins"]
      },
      deep: {
        more: ["You can't index a string with s[0], because a “letter” might be several bytes. Use s.chars().next() for the first character, or slice by byte ranges you know are safe, like &s[..3] for plain English text.",
          "To print braces themselves, double them: println!(\"{{}}\") prints {}."],
        ex: { code: src(["fn main() {", "    let name = String::from(\"Ana\");", "    let coins = 42;", "    println!(\"{name} has {coins} coins\");", "    println!(\"{:.2} {:?} {name:>5}|\", 9.87654, [1, 2]);", "    let level = 3;", "    let mut msg = format!(\"Level {level}\");", "    msg.push('!');", "    println!(\"{msg} {}\", msg.len());", "    println!(\"{} {}\", name.to_uppercase(), \"rustacean\".contains(\"rust\"));", "    let parts: Vec<&str> = \"a,b,c\".split(',').collect();", "    println!(\"{parts:?} {}\", \"ha\".repeat(3));", "    for (i, c) in \"héllo\".char_indices() {", "        print!(\"{i}:{c} \");", "    }", "    println!();", "    let greeting = \"Hi, \".to_string() + &name;", "    println!(\"{greeting}\");", "}"]),
          walk: ["Line 4: Ana has 42 coins.", "Line 5: 9.88 [1, 2]   Ana| — {name:>5} pads Ana to five places.", "Lines 6–9: format! builds a String, push adds a char: Level 3! 8.", "Line 10: ANA true.", "Lines 11–12: [\"a\", \"b\", \"c\"] hahaha.", "Lines 13–16: 0:h 1:é 3:l 4:l 5:o — é takes two bytes.", "Lines 17–18: + joins a String and a &str: Hi, Ana."] },
        mistake: "Passing a String where a function wants &str, or the other way round. Lend a String with &name; turn a &str into a String with .to_string()."
      } },
    { title: "Decisions", chapter: "Choosing · if, else, match, ranges", line: 'let size = if n > 10 { "big" } else { "small" };',
      content: {
        story: ["if runs code only when a test is true: if hp <= 0 { … }. else if adds more tests and else catches the rest. The test needs no brackets, but the braces are required, and the test must be a real bool — Rust won't treat 0 as false.",
          "In Rust, if is an expression: it gives back a value. let size = if n > 10 { \"big\" } else { \"small\" }; stores the answer directly.",
          "match is Rust's power tool. It compares a value against patterns from top to bottom: exact values, choices with |, ranges like 80..=89, and _ for everything else. The compiler checks you've covered every possibility."],
        big: "if/else choose a path and can give back a value; match compares against patterns and must cover every case.",
        caption: "A score drops into a sorter with slots for 90..=100, 80..=89 and everything else. Tap Play.",
        demo: ["let score = 85", "90..=100 → no", "80..=89 → yes: 'B'", "match is done"]
      },
      deep: {
        more: ["A match arm can add a guard: n if n < 0 => … runs only when the extra test passes. Patterns can also pull values apart, which the enums chapter puts to work.",
          "Since match must cover everything, adding a new choice to an enum later makes the compiler list every match you need to update — a whole class of forgotten-case bugs disappears."],
        ex: { code: src(["fn main() {", "    let hp = 0;", "    if hp <= 0 {", "        println!(\"Game over\");", "    } else if hp < 20 {", "        println!(\"Careful!\");", "    } else {", "        println!(\"Keep going\");", "    }", "    let size = if hp > 10 { \"big\" } else { \"small\" };", "    println!(\"{size}\");", "    let score = 85;", "    let grade = match score {", "        90..=100 => 'A',", "        80..=89 => 'B',", "        _ => 'C',", "    };", "    println!(\"{grade}\");", "    let day = \"Sun\";", "    match day {", "        \"Sat\" | \"Sun\" => println!(\"Weekend\"),", "        _ => println!(\"School day\"),", "    }", "}"]),
          walk: ["Lines 3–9: hp is 0, so Game over.", "Lines 10–11: if gives back a value: small.", "Lines 13–17: match with ranges: B.", "Lines 20–23: | means “or”: Weekend."] },
        mistake: "Writing if x { … } where x is a number. Rust needs a bool: write if x != 0 { … }."
      } },
    { title: "Loops", chapter: "Repeating · for, while, loop, ranges, break", line: 'for i in 0..5 { println!("{i}"); }',
      content: {
        story: ["for walks through anything you can iterate: ranges, arrays, Vecs and more. 0..5 counts 0 to 4 (the end is left out); 1..=5 includes the 5. (1..=3).rev() counts backwards.",
          "while repeats as long as a test is true: while lives > 0 { lives -= 1; }. loop repeats forever until you break out — and break can hand a value back: let answer = loop { … break 42; };.",
          "continue skips to the next round. Loops can be labeled, like 'outer: for …, so break 'outer leaves two loops at once."],
        big: "for walks ranges and collections, while repeats while a test holds, and loop runs until break — which can return a value.",
        caption: "A counter goes round a track 0..3 and stops before 3. Tap Play.",
        demo: ["for i in 0..3", "i = 0 → lap 0", "i = 1 → lap 1", "i = 2 → lap 2, done"]
      },
      deep: {
        more: ["for item in &list borrows each item without using up the list; for item in list moves the items out, and the list can't be used afterwards.",
          "Counting through positions with for i in 0..list.len() works, but iterating the list directly — with .iter().enumerate() if you need the position — is clearer and can't go out of bounds."],
        ex: { code: src(["fn main() {", "    for i in 0..3 {", "        println!(\"lap {i}\");", "    }", "    let mut lives = 3;", "    while lives > 0 {", "        lives -= 1;", "    }", "    println!(\"lives: {lives}\");", "    for i in (1..=3).rev() {", "        print!(\"{i} \");", "    }", "    println!();", "    for fruit in [\"apple\", \"pear\"] {", "        if fruit == \"pear\" {", "            continue;", "        }", "        println!(\"{fruit}\");", "    }", "    let mut n = 0;", "    let doubled = loop {", "        n += 1;", "        if n == 5 {", "            break n * 2;", "        }", "    };", "    println!(\"n: {n}, doubled: {doubled}\");", "}"]),
          walk: ["Lines 2–4: lap 0, lap 1, lap 2.", "Lines 5–9: lives: 0.", "Lines 10–13: backwards: 3 2 1.", "Lines 14–19: continue skips pear: apple.", "Lines 20–27: loop breaks with a value: n: 5, doubled: 10."] },
        mistake: "Expecting 1..5 to include 5. It stops at 4. Use 1..=5 when you want the end included."
      } },
    { title: "Ownership", chapter: "Rust's big idea · owners, moves, clone, Copy", line: "let s2 = s1.clone();",
      content: {
        story: ["Ownership is the idea that makes Rust special. Three rules: every value has one owner; there can only be one owner at a time; and when the owner goes out of scope (its closing brace), the value is cleaned up. No garbage collector needed.",
          "When you write let s2 = s1; with a String, the text moves to s2 — and s1 can't be used anymore. Passing a String to a function moves it too. The compiler tracks every move, so two owners can never free the same memory.",
          "When you really want two copies, call .clone(). Simple values that live entirely on the stack — numbers, bool, char — are Copy: assigning them copies automatically, so let b = a; leaves a usable."],
        big: "Every value has one owner; assigning a String moves it, clone makes a real copy, and numbers are simply copied.",
        caption: "A String's ownership tag passes from s1 to s2, and s1 goes gray. Tap Play.",
        demo: ["let s1 = String::from(\"hello\")", "let s2 = s1;  → moved", "s1 can't be used", "s2.clone() → two Strings"]
      },
      deep: {
        more: ["Why move instead of copy? A String's text lives on the heap. Copying it every time would be slow, and two owners would both try to free it. Moving is cheap and safe.",
          "Functions can give ownership back by returning a value. But passing values in and out gets tiring — the next chapter, borrowing, is how real Rust code shares data."],
        ex: { code: src(["fn shout(text: String) -> String {", "    text.to_uppercase()", "}", "", "fn main() {", "    let s1 = String::from(\"hello\");", "    let s2 = s1;", "    // println!(\"{s1}\"); would not compile: s1 was moved into s2", "    println!(\"{s2}\");", "    let s3 = s2.clone();", "    println!(\"{s2} {s3}\");", "    let loud = shout(s3);", "    println!(\"{loud}\");", "    let a = 5;", "    let b = a;", "    println!(\"{a} {b}\");", "    {", "        let temp = String::from(\"gone soon\");", "        println!(\"{temp}\");", "    }", "}"]),
          walk: ["Lines 1–3: shout takes ownership of its String.", "Lines 6–9: s1 moves to s2; using s1 now would be an error.", "Lines 10–11: clone makes a real copy: hello hello.", "Lines 12–13: s3 moves into shout: HELLO.", "Lines 14–16: numbers are Copy: 5 5.", "Lines 17–20: temp is cleaned up at its closing brace."] },
        mistake: "Using a value after moving it. The error “borrow of moved value” names both lines — the move and the later use. Borrow with & instead, or clone if you need two."
      } },
    { title: "Borrowing and References", chapter: "Sharing safely · &, &mut, slices", line: "let len = calculate_length(&name);",
      content: {
        story: ["Instead of moving a value, you can lend it. &name is a reference: the function can look at name, and name stays yours. Taking a reference is called borrowing.",
          "To let a function change a value, lend it mutably with &mut: add_coin(&mut coins). Inside, *purse += 1 follows the reference to the real number.",
          "The borrowing rule keeps data safe: at any moment you may have many readers (&) or exactly one writer (&mut), never both. The compiler — the borrow checker — enforces it, which rules out a whole category of bugs."],
        big: "& lends a value to read, &mut lends it to change, and you can have many readers or one writer at a time.",
        caption: "A book is lent to two readers at once, but to only one writer. Tap Play.",
        demo: ["length(&name) → borrowed", "name still yours", "add_coin(&mut coins)", "*purse += 1"]
      },
      deep: {
        more: ["A slice is a borrowed view of part of a list or string: &scores[1..3] or &text[..5]. That's why functions take &str and &[i32] — they accept a whole String or Vec, or just part of one.",
          "References can never dangle: Rust won't let you keep a reference to something that has been cleaned up. The lifetimes shelf explains how it checks."],
        ex: { code: src(["fn length(text: &str) -> usize {", "    text.len()", "}", "", "fn add_coin(purse: &mut u32) {", "    *purse += 1;", "}", "", "fn main() {", "    let name = String::from(\"Ferris\");", "    println!(\"{name} has {} letters\", length(&name));", "    let mut coins = 9;", "    add_coin(&mut coins);", "    println!(\"{coins}\");", "    let scores = [10, 20, 30, 40];", "    let middle = &scores[1..3];", "    println!(\"{middle:?}\");", "    let r1 = &coins;", "    let r2 = &coins;", "    println!(\"{r1} {r2}\");", "    let r3 = &mut coins;", "    *r3 += 1;", "    println!(\"{coins}\");", "}"]),
          walk: ["Lines 1–3: borrows text to read it.", "Lines 5–7: borrows a number mutably to change it.", "Lines 10–11: Ferris has 6 letters — and name is still usable.", "Lines 12–14: 10.", "Lines 15–17: a slice of the middle: [20, 30].", "Lines 18–20: two readers at once: 10 10.", "Lines 21–23: then one writer: 11."] },
        mistake: "Holding a & borrow while changing the value: let first = &v[0]; v.push(4); println!(\"{first}\"). push might move the list in memory, so Rust refuses. Finish reading before you change."
      } },
    { title: "Functions", chapter: "Machines · parameters, return values, tuples", line: "fn add(a: i32, b: i32) -> i32 { a + b }",
      content: {
        story: ["fn defines a function. Every parameter needs a type: fn add(a: i32, b: i32). The type after -> is what it returns.",
          "Rust is expression-based: the last line of a block, written without a semicolon, is the block's value. So { a + b } returns the sum. return is still there for leaving early.",
          "To return several values, return a tuple: fn divmod(a: i32, b: i32) -> (i32, i32), and unpack it with let (q, r) = divmod(17, 5);. Closures are small unnamed functions: let double = |x| x * 2;."],
        big: "Parameters are typed, -> names the result, and the last expression without a semicolon is the answer.",
        caption: "A machine with two input slots and two output chutes: 17 and 5 go in, 3 and 2 come out. Tap Play.",
        demo: ["divmod(17, 5)", "17 / 5 → 3", "17 % 5 → 2", "let (q, r) = (3, 2)"]
      },
      deep: {
        more: ["Adding a semicolon to the last line turns it into a statement, so the function returns () — “nothing.” The compiler then says “mismatched types” and suggests removing the semicolon.",
          "Function names use snake_case. Rust has no default parameters or overloading; use different names, or Option parameters, instead."],
        ex: { code: src(["fn add(a: i32, b: i32) -> i32 {", "    a + b", "}", "", "fn divmod(a: i32, b: i32) -> (i32, i32) {", "    (a / b, a % b)", "}", "", "fn is_even(n: i32) -> bool {", "    n % 2 == 0", "}", "", "fn safe_divide(a: i32, b: i32) -> i32 {", "    if b == 0 {", "        return 0;", "    }", "    a / b", "}", "", "fn main() {", "    println!(\"{}\", add(2, 3));", "    let (q, r) = divmod(17, 5);", "    println!(\"{q} {r}\");", "    println!(\"{} {}\", is_even(4), safe_divide(9, 0));", "    let double = |x: i32| x * 2;", "    println!(\"{}\", double(21));", "}"]),
          walk: ["Lines 1–3: no semicolon on a + b, so it's the answer.", "Lines 5–7: a tuple returns two values.", "Lines 13–18: return leaves early when b is 0.", "Line 21: 5.", "Lines 22–23: 3 2.", "Line 24: true 0.", "Lines 25–26: a closure: 42."] },
        mistake: "Ending the last line with a semicolon: fn add(a: i32, b: i32) -> i32 { a + b; } returns nothing, and Rust reports “mismatched types.”"
      } },
    { title: "Structs and Methods", chapter: "Blueprints · struct, impl, self, derive", line: "struct Player { name: String, hp: i32 }",
      content: {
        story: ["A struct groups related values into a new type: struct Player { name: String, hp: u32, level: u32 }. Build one by filling every field, and read fields with a dot: ana.name.",
          "impl Player { … } adds methods. A method's first parameter says how it uses the struct: &self to read it, &mut self to change it. Call them with a dot: ana.describe(), ana.level_up().",
          "Functions in an impl without self are associated functions, called with ::. Player::new(\"Ana\") is the usual way to build a ready-to-use value. #[derive(Debug)] lets you print a struct with {:?}."],
        big: "Structs group fields into a type; impl adds methods that take &self or &mut self; Type::new builds one.",
        caption: "A Player blueprint stamps out Ana, then level_up changes her level. Tap Play.",
        demo: ["struct Player { … }", "Player::new(\"Ana\")", "ana.level_up()", "ana.describe()"]
      },
      deep: {
        more: ["When a variable has the same name as a field, you can write it once: Player { name, hp: 100, level: 1 }.",
          "derive can add many abilities automatically: Debug (printing), Clone (.clone()), PartialEq (==), Default (empty values) and more."],
        ex: { code: src(["#[derive(Debug)]", "struct Player {", "    name: String,", "    hp: u32,", "    level: u32,", "}", "", "impl Player {", "    fn new(name: &str) -> Self {", "        Player {", "            name: name.to_string(),", "            hp: 100,", "            level: 1,", "        }", "    }", "", "    fn describe(&self) -> String {", "        format!(\"{} (level {}, {} HP)\", self.name, self.level, self.hp)", "    }", "", "    fn level_up(&mut self) {", "        self.level += 1;", "    }", "}", "", "fn main() {", "    let mut ana = Player::new(\"Ana\");", "    ana.level_up();", "    println!(\"{}\", ana.describe());", "    println!(\"{ana:?}\");", "}"]),
          walk: ["Lines 1–6: the Player type; derive(Debug) makes it printable.", "Lines 9–15: new builds a starting player; Self means Player.", "Lines 17–19: &self only reads.", "Lines 21–23: &mut self changes the player.", "Lines 27–29: Ana (level 2, 100 HP).", "Line 30: Player { name: \"Ana\", hp: 100, level: 2 }."] },
        mistake: "Calling a &mut self method on a variable that isn't mut. let ana = Player::new(\"Ana\"); ana.level_up(); fails — write let mut ana."
      } },
    { title: "Enums and match", chapter: "Choices with data · enum, Option, if let", line: "enum Direction { Up, Down, Left, Right }",
      content: {
        story: ["An enum is a type that is exactly one of several variants: enum Direction { Up, Down, Left, Right }. Variants can carry data: Circle(f64), or Rect { w: f64, h: f64 }.",
          "match takes an enum apart: each arm names a variant and the data inside it. Because match must cover every variant, you can't forget a case.",
          "Rust has no null. A value that might be missing is an Option: Some(value) or None, and the compiler makes you handle both. if let Some(x) = maybe { … } handles just the Some case; unwrap_or(0) gives a default."],
        big: "Enums list choices that can carry data, match handles every one, and Option replaces null with Some or None.",
        caption: "A box marked Option opens to show either Some(3) or an empty None. Tap Play.",
        demo: ["Shape::Circle(1.0)", "match s { Circle(r) => … }", "find(..) → Some(1)", "find(..) → None"]
      },
      deep: {
        more: ["Option has many helpers: is_some, map, unwrap_or_else, and the ? operator works on Options too inside functions that return Option.",
          "unwrap() takes the value out of a Some, or crashes on None. It's handy in tests and examples; in real code prefer if let, match or unwrap_or."],
        ex: { code: src(["use std::f64::consts::PI;", "", "enum Shape {", "    Circle(f64),", "    Rect { w: f64, h: f64 },", "    Dot,", "}", "", "fn area(s: &Shape) -> f64 {", "    match s {", "        Shape::Circle(r) => PI * r * r,", "        Shape::Rect { w, h } => w * h,", "        Shape::Dot => 0.0,", "    }", "}", "", "fn find(names: &[&str], target: &str) -> Option<usize> {", "    names.iter().position(|n| *n == target)", "}", "", "fn main() {", "    let shapes = [", "        Shape::Circle(1.0),", "        Shape::Rect { w: 2.0, h: 3.0 },", "        Shape::Dot,", "    ];", "    for s in &shapes {", "        println!(\"{:.2}\", area(s));", "    }", "    let names = [\"Ana\", \"Leo\"];", "    match find(&names, \"Leo\") {", "        Some(i) => println!(\"found at {i}\"),", "        None => println!(\"not found\"),", "    }", "    if let Some(i) = find(&names, \"Mia\") {", "        println!(\"Mia is at {i}\");", "    } else {", "        println!(\"no Mia\");", "    }", "    let missing = find(&names, \"Zed\");", "    println!(\"{}\", missing.unwrap_or(0));", "}"]),
          walk: ["Lines 3–7: three kinds of shape; two carry data.", "Lines 9–15: match pulls the data out of each variant.", "Lines 17–19: position gives Some(index) or None.", "Lines 22–29: 3.14, 6.00 and 0.00.", "Lines 31–34: found at 1.", "Lines 35–39: if let with an else: no Mia.", "Lines 40–41: unwrap_or gives a default for None: 0."] },
        mistake: "Calling .unwrap() on something that might be None. It crashes with “called Option::unwrap() on a None value.” Handle the None case."
      } },
    { title: "Collections", chapter: "Lists and lookups · Vec, HashMap, entry", line: "let mut scores = vec![10, 20, 30];",
      content: {
        story: ["Vec<T> is the everyday list: vec![10, 20, 30] builds one, push adds to the end, scores[0] reads the first item, and len() counts them. Indexing past the end crashes, so scores.get(9) returns an Option instead.",
          "HashMap<K, V> stores values by key: insert(\"Ana\", 12) adds, get(\"Ana\") returns an Option, and remove takes one out. Bring it in with use std::collections::HashMap;.",
          "The entry API makes counting easy: *counts.entry(word).or_insert(0) += 1; finds the slot for word, makes it 0 if it's new, and adds one."],
        big: "Vec is a growable list, HashMap looks values up by key, and entry().or_insert() handles new keys neatly.",
        caption: "A row of numbered boxes grows by one; a cabinet of named drawers opens by key. Tap Play.",
        demo: ["scores.push(40)", "scores[0] → 10", "ages.get(\"Ana\") → Some(12)", "*counts.entry(w).or_insert(0) += 1"]
      },
      deep: {
        more: ["A HashMap has no order. For keys in sorted order use BTreeMap, which has the same methods. HashSet and BTreeSet store unique values.",
          "Vec has lots of helpers: sort, dedup, contains, retain (keep only what passes a test), last, first and iter."],
        ex: { code: src(["use std::collections::HashMap;", "", "fn main() {", "    let mut scores = vec![10, 20, 30];", "    scores.push(40);", "    scores[0] = 15;", "    println!(\"{scores:?} {}\", scores.len());", "    if let Some(last) = scores.last() {", "        println!(\"last: {last}\");", "    }", "    let mut ages = HashMap::new();", "    ages.insert(\"Ana\", 12);", "    ages.insert(\"Leo\", 11);", "    println!(\"{:?} {:?}\", ages.get(\"Ana\"), ages.get(\"Zed\"));", "    let mut counts: HashMap<&str, u32> = HashMap::new();", "    for word in \"the cat and the hat\".split_whitespace() {", "        *counts.entry(word).or_insert(0) += 1;", "    }", "    let mut pairs: Vec<_> = counts.into_iter().collect();", "    pairs.sort();", "    println!(\"{pairs:?}\");", "}"]),
          walk: ["Lines 4–7: grow and change a Vec: [15, 20, 30, 40] 4.", "Lines 8–10: last returns an Option: last: 40.", "Lines 11–14: Some(12) None.", "Lines 15–18: count each word.", "Lines 19–21: sort the pairs for a steady order: [(\"and\", 1), (\"cat\", 1), (\"hat\", 1), (\"the\", 2)]."] },
        mistake: "Reading scores[10] on a short list. It panics with “index out of bounds.” Use scores.get(10), which returns None instead."
      } },
    { title: "Error Handling", chapter: "Safety nets · Result, ?, expect, panic", line: "let n: i32 = text.parse()?;",
      content: {
        story: ["Things that can fail return a Result: Ok(value) when they work, Err(problem) when they don't. \"42\".parse::<i32>() gives Ok(42); \"abc\" gives an Err. You can't use the value without deciding what to do about the error.",
          "match handles both cases. Inside a function that returns a Result, the ? operator is the shortcut: it takes the value from an Ok, or returns the Err to the caller straight away.",
          "expect(\"message\") and unwrap() take the value or stop the program — fine for quick experiments. panic! is for bugs that should never happen. Everything else should be a Result."],
        big: "Result is Ok or Err; match handles both, ? passes errors up, and panics are only for real bugs.",
        caption: "Each step hands back Ok or Err; an Err takes the express lane back to the caller. Tap Play.",
        demo: ["\"42\".parse() → Ok(42)", "\"abc\".parse() → Err(..)", "let n = text.parse()?;", "Err → returned to caller"]
      },
      deep: {
        more: ["map_err converts one kind of error into another, so ? can pass it along. Real projects often use crates like anyhow (for apps) or thiserror (for libraries) to make error types easy.",
          "main can return a Result too: fn main() -> Result<(), Box<dyn std::error::Error>> lets you use ? right inside main."],
        ex: { code: src(["fn parse_level(text: &str) -> Result<u32, String> {", "    let n: u32 = text", "        .parse()", "        .map_err(|e| format!(\"{text:?} is not a number: {e}\"))?;", "    if n > 99 {", "        return Err(format!(\"{n} is too big\"));", "    }", "    Ok(n)", "}", "", "fn double_level(text: &str) -> Result<u32, String> {", "    let n = parse_level(text)?;", "    Ok(n * 2)", "}", "", "fn main() {", "    for text in [\"7\", \"abc\", \"500\"] {", "        match double_level(text) {", "            Ok(n) => println!(\"doubled: {n}\"),", "            Err(e) => println!(\"error: {e}\"),", "        }", "    }", "    let n: i32 = \"42\".parse().expect(\"a valid number\");", "    println!(\"{n}\");", "}"]),
          walk: ["Lines 1–9: return Ok with a number or Err with a message.", "Lines 2–4: map_err rewrites parse's error; ? passes it up.", "Lines 11–14: ? again: any error goes straight back to main.", "Lines 17–22: doubled: 14, then error: \"abc\" is not a number: invalid digit found in string, then error: 500 is too big.", "Lines 23–24: expect is fine when you know it works: 42."] },
        mistake: "Using ? in a function that doesn't return a Result or Option. The compiler says the ? “can only be used in a function that returns Result or Option” — change the return type."
      } },
    { title: "Traits and Generics", chapter: "Shared behavior · trait, impl for, <T>, Display", line: "trait Shape { fn area(&self) -> f64; }",
      content: {
        story: ["A trait is a set of methods a type promises to provide: trait Describe { fn describe(&self) -> String; }. impl Describe for Dog { … } keeps the promise. Traits can also give default methods that types get for free.",
          "Functions can accept any type with a trait: fn introduce(thing: &impl Describe). Generics say the same thing with a type parameter: fn largest<T: PartialOrd + Copy>(a: T, b: T) -> T works for numbers, letters and more.",
          "The standard traits run the language: Display for {} printing, Debug for {:?}, Clone, PartialEq for ==, PartialOrd for < and >, and Iterator for for loops."],
        big: "Traits describe shared behavior; impl Trait for Type provides it; generics with bounds work for every type that has it.",
        caption: "A socket labeled Describe: a dog and a robot both plug in. Tap Play.",
        demo: ["trait Describe { fn describe… }", "impl Describe for Dog", "impl Describe for Robot", "introduce(&dog), introduce(&robot)"]
      },
      deep: {
        more: ["Box<dyn Shape> holds any type with the Shape trait, chosen while the program runs — that's how one Vec can hold circles and squares together. Generics, by contrast, are filled in when compiling, which makes them extra fast.",
          "Implement Display to control how {} prints your type; derive Debug to get {:?} for free."],
        ex: { code: src(["use std::fmt;", "", "trait Describe {", "    fn describe(&self) -> String;", "    fn shout(&self) -> String {", "        self.describe().to_uppercase()", "    }", "}", "", "struct Dog;", "struct Robot {", "    id: u32,", "}", "", "impl Describe for Dog {", "    fn describe(&self) -> String {", "        String::from(\"a loyal dog\")", "    }", "}", "", "impl Describe for Robot {", "    fn describe(&self) -> String {", "        format!(\"robot number {}\", self.id)", "    }", "}", "", "impl fmt::Display for Robot {", "    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {", "        write!(f, \"R-{}\", self.id)", "    }", "}", "", "fn largest<T: PartialOrd + Copy>(a: T, b: T) -> T {", "    if a > b { a } else { b }", "}", "", "fn introduce(thing: &impl Describe) {", "    println!(\"This is {}.\", thing.describe());", "}", "", "fn main() {", "    introduce(&Dog);", "    let r = Robot { id: 7 };", "    introduce(&r);", "    println!(\"{} {r}\", r.shout());", "    println!(\"{} {}\", largest(3, 9), largest('a', 'z'));", "}"]),
          walk: ["Lines 3–8: a trait with one required method and one default.", "Lines 15–25: two types keep the promise in their own way.", "Lines 27–31: Display decides how {} prints a Robot.", "Lines 33–35: a generic function for anything comparable.", "Lines 42–44: This is a loyal dog. This is robot number 7.", "Line 45: ROBOT NUMBER 7 R-7.", "Line 46: 9 z."] },
        mistake: "Comparing values of a generic T without a bound: fn largest<T>(a: T, b: T) can't use >, because not every type can be compared. Add T: PartialOrd."
      } },
    { title: "Iterators and Closures", chapter: "Pipelines · iter, map, filter, sum, collect", line: "let doubled: Vec<i32> = nums.iter().map(|x| x * 2).collect();",
      content: {
        story: ["A closure is a small unnamed function: |x| x * 2. It can use variables from around it: let add_bonus = |x| x + bonus;.",
          "Iterators walk through items one at a time, and adapters build pipelines: map transforms each item, filter keeps the ones that pass a test, enumerate adds positions, rev reverses, and take keeps the first few.",
          "Nothing happens until you finish the pipeline: collect gathers items into a Vec (or String, or HashMap), sum adds them, count counts, and max finds the largest."],
        big: "Closures are tiny functions; iterator pipelines map, filter and enumerate, then collect, sum or count to finish.",
        caption: "Numbers ride a conveyor: doubled at one station, filtered at the next, collected at the end. Tap Play.",
        demo: ["[1, 2, 3, 4, 5, 6]", ".map(|x| x * 2)", ".filter(even)", ".collect() → Vec"]
      },
      deep: {
        more: ["Iterator pipelines compile to code as fast as a hand-written loop — Rust calls these zero-cost abstractions.",
          "iter() borrows items, iter_mut() lets you change them in place, and into_iter() takes ownership of them."],
        ex: { code: src(["fn main() {", "    let nums = [1, 2, 3, 4, 5, 6];", "    let doubled: Vec<i32> = nums.iter().map(|x| x * 2).collect();", "    println!(\"{doubled:?}\");", "    let evens: Vec<i32> = nums.iter().filter(|&&x| x % 2 == 0).copied().collect();", "    let total: i32 = nums.iter().sum();", "    println!(\"{evens:?} {total}\");", "    let bonus = 10;", "    let add_bonus = |x: i32| x + bonus;", "    println!(\"{}\", add_bonus(5));", "    let words = [\"apple\", \"fig\", \"banana\"];", "    let long: Vec<String> = words", "        .iter()", "        .filter(|w| w.len() > 3)", "        .map(|w| w.to_uppercase())", "        .collect();", "    println!(\"{long:?}\");", "    for (i, w) in words.iter().enumerate().skip(1) {", "        println!(\"{i}: {w}\");", "    }", "    let max_len = words.iter().map(|w| w.len()).max().unwrap_or(0);", "    println!(\"{max_len}\");", "}"]),
          walk: ["Lines 3–4: [2, 4, 6, 8, 10, 12].", "Lines 5–7: [2, 4, 6] 21.", "Lines 8–10: the closure uses bonus: 15.", "Lines 12–17: a longer pipeline: [\"APPLE\", \"BANANA\"].", "Lines 18–20: 1: fig, 2: banana.", "Lines 21–22: the longest word has 6 letters."] },
        mistake: "Building a pipeline and forgetting to finish it. nums.iter().map(|x| x * 2); does nothing — Rust even warns “iterators are lazy and do nothing unless consumed.”"
      } },
    { title: "Cargo, Crates and Modules", chapter: "Real projects · cargo, Cargo.toml, mod, pub, use", line: "use std::collections::HashMap;",
      content: {
        story: ["cargo is Rust's all-in-one tool. cargo new game makes a project with Cargo.toml (its settings) and src/main.rs. cargo run builds and runs; cargo build --release makes a fast, finished program; cargo test runs tests.",
          "Libraries are called crates, and crates.io lists over a hundred thousand of them. Add one to the [dependencies] section of Cargo.toml (or run cargo add rand) and cargo downloads and builds it.",
          "Inside a project, mod groups code into modules. Everything is private unless marked pub. use brings a path into scope, like use std::collections::HashMap;."],
        big: "cargo builds, runs and tests; crates come from crates.io; mod organizes code, pub shares it, and use brings it in.",
        caption: "A project box opens: Cargo.toml on top, src/main.rs inside, crates arriving from crates.io. Tap Play.",
        demo: ["$ cargo new game", "Cargo.toml + src/main.rs", "$ cargo add rand", "$ cargo run"]
      },
      deep: {
        more: ["cargo fmt formats your code in the standard style, and cargo clippy is a helper that suggests clearer, more idiomatic code. Every example on this track passes both.",
          "Modules can live in their own files: mod greet; in main.rs loads src/greet.rs. Large projects are workspaces of several crates."],
        ex: { code: src(["mod greet {", "    pub fn hello(name: &str) -> String {", "        format!(\"Hello, {}!\", polish(name))", "    }", "", "    fn polish(name: &str) -> &str {", "        name.trim()", "    }", "}", "", "use greet::hello;", "", "fn main() {", "    let args: Vec<String> = std::env::args().collect();", "    let name = args.get(1).map_or(\"crab\", String::as_str);", "    println!(\"{}\", hello(name));", "    println!(\"{}\", hello(\"  Ferris  \"));", "}"]),
          walk: ["Lines 1–9: a module; hello is pub, polish stays private.", "Line 11: use brings hello into scope.", "Lines 14–15: the words typed after the program's name; cargo run -- Ana would greet Ana.", "Line 16: Hello, crab!", "Line 17: Hello, Ferris!"] },
        mistake: "Calling a function from another module that isn't pub. Rust says it “is private” — add pub to share it."
      } }
  ];

  var shelves = [
    { title: "Standard Library Field Guide", chapter: "Beyond the basics · Rust shelf", line: ["use std::collections::HashMap;", "use std::fs;"],
      content: {
        story: ["Rust's standard library (std) is smaller than some languages', but everything in it is carefully designed. Strings and Vec have dozens of methods; std::collections has HashMap, BTreeMap, HashSet and VecDeque; std::fs reads and writes files; std::time measures time; std::env reads arguments.",
          "For more, there are crates: rand for random numbers, serde for saving data as JSON, regex for patterns, clap for command-line options, tokio for async networking.",
          "The documentation at doc.rust-lang.org/std is excellent and full of examples. Search it before writing something yourself."],
        big: "std covers text, collections, files and time; crates.io adds the rest, like rand, serde and regex.",
        caption: "A workshop wall of labeled toolboxes, each one a use away. Tap Play.",
        demo: ["\"a b\".split_whitespace()", "\"42\".parse::<i32>()", "scores.sort()", "Instant::now().elapsed()"]
      },
      deep: {
        more: ["Duration prints nicely with {:?}: Duration::from_millis(1500) shows as 1.5s.",
          "fs::read_to_string(\"save.txt\") reads a whole file in one call and returns a Result; fs::write saves one."],
        ex: { code: src(["use std::collections::{BTreeMap, HashSet};", "use std::time::{Duration, Instant};", "", "fn main() {", "    let words: Vec<&str> = \"  the quick   brown fox \".split_whitespace().collect();", "    println!(\"{} {}\", words.len(), words.join(\"-\"));", "    let n: i32 = \"42\".parse().unwrap_or(0);", "    println!(\"{}\", n + 1);", "    let mut scores = [40, 75, 60];", "    scores.sort();", "    println!(\"{scores:?} {}\", scores.contains(&75));", "    let unique: HashSet<char> = \"banana\".chars().collect();", "    println!(\"{}\", unique.len());", "    let mut tally = BTreeMap::new();", "    for c in \"banana\".chars() {", "        *tally.entry(c).or_insert(0) += 1;", "    }", "    println!(\"{tally:?}\");", "    let start = Instant::now();", "    let wait = Duration::from_millis(1500);", "    println!(\"{wait:?} {}\", start.elapsed() < wait);", "}"]),
          walk: ["Lines 5–6: split on any run of spaces: 4 the-quick-brown-fox.", "Lines 7–8: 43.", "Lines 9–11: [40, 60, 75] true.", "Lines 12–13: a set keeps unique letters: 3.", "Lines 14–18: a sorted tally: {'a': 3, 'b': 1, 'n': 2}.", "Lines 19–21: 1.5s true."] },
        mistake: "Writing your own sorting or parsing. The standard versions are tested and fast; yours isn't yet."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · Rust shelf", line: ["error[E0382]: borrow of moved value: `s1`", "thread 'main' panicked at src/main.rs:7:5"],
      content: {
        story: ["Most Rust bugs are caught by the compiler. Every error has a code, like E0382 (use of a moved value) or E0502 (borrowing as mutable while also borrowed). The message draws arrows to the exact spots; rustc --explain E0382 explains it in depth.",
          "Fix the first error first — later ones are often caused by it. Read the help: lines: they frequently contain the exact fix.",
          "At runtime, a panic stops the program with a message and the file and line, like an index out of bounds or an unwrap on None. Run with RUST_BACKTRACE=1 to see which functions led there."],
        big: "Read the first compiler error and its help line; for panics, read the message and line, and use RUST_BACKTRACE=1.",
        caption: "A magnifying glass follows the compiler's arrows to the line that moved the value. Tap Play.",
        demo: ["error[E0382]: borrow of moved value", "--> src/main.rs:4:20", "help: consider cloning", "s1.clone()"]
      },
      deep: {
        more: ["dbg!(expression) prints the file, line, expression and value to the error stream, then hands the value back — the quickest debugging tool.",
          "cargo clippy catches code that compiles but is likely wrong or clumsy, and explains each warning with a link."],
        ex: { code: src(["fn safe_get(items: &[i32], i: usize) -> Option<i32> {", "    items.get(i).copied()", "}", "", "fn main() {", "    let items = [10, 20, 30];", "    println!(\"{:?} {:?}\", safe_get(&items, 1), safe_get(&items, 5));", "    let total = dbg!(items.iter().sum::<i32>());", "    println!(\"{total}\");", "    let result = std::panic::catch_unwind(|| {", "        let empty: Vec<i32> = Vec::new();", "        empty[0]", "    });", "    println!(\"panicked: {}\", result.is_err());", "}"]),
          walk: ["Lines 1–3: get returns None instead of panicking.", "Line 7: Some(20) None.", "Lines 8–9: dbg! shows [src/main.rs:8:17] items.iter().sum::<i32>() = 60, then 60 prints.", "Lines 10–13: indexing an empty Vec panics; catch_unwind catches it for this demo.", "Line 14: panicked: true."] },
        mistake: "Adding .clone() everywhere to quiet the borrow checker. Sometimes right, but often a reference (&) is the real fix — read what the error says is borrowed and where."
      } },
    { title: "Testing with cargo test", chapter: "Beyond the basics · Rust shelf", line: ["#[test]", "assert_eq!(grade(95), 'A');"],
      content: {
        story: ["Rust has testing built in. Write a function, mark it #[test], and check results with assert_eq!(got, want) or assert!(condition). cargo test finds and runs every test.",
          "By habit, unit tests live at the bottom of the same file, in a module marked #[cfg(test)] so they're only built when testing. use super::*; brings in the code under test.",
          "#[should_panic] marks a test that passes only if the code panics — useful for checking that bad input is refused."],
        big: "#[test] functions with assert_eq! check your code; cargo test runs them all; #[cfg(test)] keeps them out of the real build.",
        caption: "A checklist of cases gets ticked one by one: 95 → A, 85 → B, 40 → C. Tap Play.",
        demo: ["#[test] fn grades_each_band()", "assert_eq!(grade(95), 'A') ✓", "assert_eq!(grade(85), 'B') ✓", "test result: ok. 2 passed"]
      },
      deep: {
        more: ["Integration tests go in a tests/ folder and use your crate like an outside user would. Code examples in /// doc comments are run as tests too.",
          "cargo test name runs only tests whose name contains name — handy when one test fails."],
        ex: { test: true, code: src(["// src/lib.rs", "fn grade(score: u32) -> char {", "    match score {", "        90.. => 'A',", "        80..=89 => 'B',", "        _ => 'C',", "    }", "}", "", "#[cfg(test)]", "mod tests {", "    use super::*;", "", "    #[test]", "    fn grades_each_band() {", "        let cases = [(95, 'A'), (85, 'B'), (40, 'C')];", "        for (score, want) in cases {", "            assert_eq!(grade(score), want, \"score {score}\");", "        }", "    }", "", "    #[test]", "    #[should_panic]", "    fn empty_list_panics() {", "        let empty: Vec<u32> = Vec::new();", "        let _ = empty[0];", "    }", "}"]),
          walk: ["Lines 2–8: the code under test: 90 and up is an A.", "Lines 10–12: a test module, built only by cargo test.", "Lines 14–20: a table of cases checked in one loop; the last argument is a message shown on failure.", "Lines 22–27: this test passes only if the code panics.", "cargo test prints test result: ok. 2 passed."] },
        mistake: "Tests that never assert anything. A test with no assert passes forever, whatever the code does."
      } },
    { title: "Lifetimes Explained", chapter: "Beyond the basics · Rust shelf", line: ["fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {", "struct Highlight<'a> { text: &'a str }"],
      content: {
        story: ["A lifetime is how long a reference stays valid. Rust checks that no reference outlives the value it points to, so you can never read memory that has been cleaned up.",
          "Usually Rust works lifetimes out by itself. When a function returns a reference built from several inputs, you say how they relate: fn longest<'a>(x: &'a str, y: &'a str) -> &'a str means “the answer lives as long as both inputs.”",
          "A struct that holds a reference needs a lifetime too: struct Highlight<'a> { text: &'a str }. It promises the Highlight won't outlive the text it points into."],
        big: "Lifetimes like 'a tell Rust how long references stay valid, so a reference can never outlive its value.",
        caption: "Two ropes tie a reference to its value; when the value's scope ends, the reference must be gone. Tap Play.",
        demo: ["longest<'a>(x, y) -> &'a str", "x and y live long enough ✓", "value dropped at }", "reference must not outlive it"]
      },
      deep: {
        more: ["'static is the lifetime of the whole program: every \"text literal\" is a &'static str, baked into the program file.",
          "When lifetimes get tangled, returning an owned String instead of a &str is often the simplest fix."],
        ex: { code: src(["fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {", "    if x.len() >= y.len() { x } else { y }", "}", "", "struct Highlight<'a> {", "    text: &'a str,", "}", "", "impl Highlight<'_> {", "    fn shout(&self) -> String {", "        self.text.to_uppercase()", "    }", "}", "", "fn first_word(s: &str) -> &str {", "    s.split(' ').next().unwrap_or(s)", "}", "", "fn main() {", "    let a = String::from(\"ferris\");", "    let winner = {", "        let b = String::from(\"crab\");", "        longest(&a, &b).to_string()", "    };", "    println!(\"{winner}\");", "    let story = String::from(\"Rust keeps references valid.\");", "    let h = Highlight {", "        text: first_word(&story),", "    };", "    println!(\"{}\", h.shout());", "}"]),
          walk: ["Lines 1–3: the result is valid as long as both inputs are.", "Lines 5–7: Highlight borrows text from somewhere else.", "Lines 15–17: one input, so Rust infers the lifetime by itself.", "Lines 21–25: b ends at its block's }, so the result is copied into an owned String first: ferris.", "Lines 26–30: RUST."] },
        mistake: "Returning a reference to a local variable: fn make() -> &str { let s = String::from(\"hi\"); &s } — s is cleaned up when the function ends. Return the String itself."
      } },
    { title: "Smart Pointers and Threads", chapter: "Beyond the basics · Rust shelf", line: ["let counter = Arc::new(Mutex::new(0));", "thread::spawn(move || { … });"],
      content: {
        story: ["Smart pointers are types that own data and add abilities. Box<T> puts a value on the heap. Rc<T> lets several owners share one value, counting them. RefCell<T> allows changes through a shared reference, checked while the program runs.",
          "thread::spawn starts a new thread; move hands it ownership of the values it uses. join waits for it to finish and returns its result. Channels (std::sync::mpsc) send values between threads.",
          "To share data between threads, use Arc (a thread-safe Rc) around a Mutex, which lets one thread at a time change the value. Rust checks at compile time that threads can't fight over data — fearless concurrency."],
        big: "Box, Rc and RefCell change how data is owned; threads share it safely through Arc<Mutex<T>> and channels.",
        caption: "Ten threads line up at one locked box; each takes the key, adds one, and passes it on. Tap Play.",
        demo: ["Arc::new(Mutex::new(0))", "10 × thread::spawn(move || …)", "*counter.lock().unwrap() += 1", "count: 10"]
      },
      deep: {
        more: ["Rc and RefCell are for single-threaded code; the compiler won't let them cross into another thread. Their thread-safe partners are Arc and Mutex (or RwLock).",
          "For lots of waiting on networks, async Rust with the tokio crate handles thousands of tasks on a few threads."],
        ex: { code: src(["use std::cell::RefCell;", "use std::rc::Rc;", "use std::sync::{Arc, Mutex};", "use std::thread;", "", "fn main() {", "    let boxed = Box::new(41);", "    println!(\"{}\", *boxed + 1);", "", "    let shared = Rc::new(RefCell::new(vec![1, 2]));", "    let other = Rc::clone(&shared);", "    other.borrow_mut().push(3);", "    let owners = Rc::strong_count(&shared);", "    println!(\"{:?} owners: {owners}\", shared.borrow());", "", "    let counter = Arc::new(Mutex::new(0));", "    let mut handles = Vec::new();", "    for _ in 0..10 {", "        let counter = Arc::clone(&counter);", "        handles.push(thread::spawn(move || {", "            *counter.lock().unwrap() += 1;", "        }));", "    }", "    for h in handles {", "        h.join().unwrap();", "    }", "    println!(\"count: {}\", *counter.lock().unwrap());", "}"]),
          walk: ["Lines 7–8: a Box on the heap: 42.", "Lines 10–14: two owners of one list; a change through one shows in both: [1, 2, 3] owners: 2.", "Lines 16–23: ten threads each lock the counter and add one.", "Lines 24–26: wait for every thread.", "Line 27: count: 10."] },
        mistake: "Forgetting move on a thread's closure. The thread might outlive the variables it borrows, so Rust refuses with “closure may outlive the current function” and suggests move."
      } }
  ];

  var glossary = [
    ["&str", "A borrowed view of text; every \"literal\" is one."],
    ["Arc", "A thread-safe shared pointer: several owners across threads."],
    ["array", "A fixed-size list, like [i32; 3]."],
    ["associated function", "A function in an impl without self, called with ::, like Player::new."],
    ["assert_eq!", "A macro that fails a test when two values differ."],
    ["binding", "A name attached to a value with let."],
    ["bool", "The type with two values: true and false."],
    ["borrow", "Using a value through a reference without taking ownership."],
    ["borrow checker", "The part of the compiler that enforces the borrowing rules."],
    ["Box", "A pointer that owns a value stored on the heap."],
    ["break", "Leaves a loop; in loop it can carry a value out."],
    ["cargo", "Rust's build tool and package manager."],
    ["Cargo.toml", "A project's settings file, including its dependencies."],
    ["char", "One Unicode character in single quotes, like 'A'."],
    ["clippy", "A tool that suggests clearer, more idiomatic Rust."],
    ["clone", "Makes a deep copy of a value."],
    ["closure", "A small unnamed function, like |x| x * 2, that can use nearby variables."],
    ["collect", "Gathers an iterator's items into a collection."],
    ["const", "A value fixed forever, typed and named in CAPITALS."],
    ["Copy", "A trait for simple values that are copied instead of moved."],
    ["crate", "A Rust package: a library or a program."],
    ["crates.io", "The public registry of Rust crates."],
    ["dangling reference", "A reference to freed memory; Rust makes these impossible."],
    ["dbg!", "A macro that prints an expression and its value for debugging."],
    ["derive", "Automatically implements traits like Debug or Clone."],
    ["Display", "The trait that controls how {} prints a type."],
    ["Debug", "The trait behind {:?} printing."],
    ["edition", "A version of the language rules, like 2021 or 2024."],
    ["enum", "A type that is one of several variants, which can hold data."],
    ["expect", "Takes the value out of Ok or Some, or panics with your message."],
    ["expression", "Code that produces a value; most things in Rust are expressions."],
    ["f64", "The everyday type for decimal numbers."],
    ["fn", "The keyword that defines a function."],
    ["generic", "Code with a type parameter like <T> that works for many types."],
    ["HashMap", "A collection that looks values up by key."],
    ["heap", "Memory for data whose size can change, like a String's text."],
    ["i32", "The default whole-number type."],
    ["if let", "Runs a block when a value matches one pattern, like Some(x)."],
    ["immutable", "Unchangeable; Rust variables are immutable by default."],
    ["impl", "A block that adds methods to a type, or implements a trait for it."],
    ["iterator", "Something that hands out items one at a time."],
    ["lifetime", "How long a reference stays valid, written like 'a."],
    ["loop", "A loop that runs until break."],
    ["macro", "Code that writes code, called with !, like println!."],
    ["match", "Compares a value against patterns and must cover every case."],
    ["method", "A function defined in an impl that takes self."],
    ["mod", "Declares a module, a named group of code."],
    ["move", "Passing ownership of a value; also a keyword for closures that take ownership."],
    ["mut", "Marks a variable or reference as changeable."],
    ["Mutex", "A lock that lets one thread at a time change shared data."],
    ["None", "The Option variant meaning “nothing here.”"],
    ["Ok", "The Result variant holding a success value."],
    ["Err", "The Result variant holding an error."],
    ["Option", "A value that is Some(value) or None; Rust's replacement for null."],
    ["ownership", "Rust's rule that every value has exactly one owner."],
    ["panic", "Stopping the program because of an unrecoverable bug."],
    ["pattern", "A shape that match or let compares a value against."],
    ["prelude", "Names every Rust file can use without a use line, like Vec and Option."],
    ["pub", "Makes an item visible outside its module."],
    ["range", "A run of values like 0..5 or 1..=5."],
    ["Rc", "A shared pointer that counts its owners (single thread)."],
    ["RefCell", "Allows changes through shared references, checked at runtime."],
    ["reference", "A borrowed pointer to a value, written &value."],
    ["Result", "A value that is Ok(value) or Err(error)."],
    ["rustc", "The Rust compiler."],
    ["rustfmt", "The tool that formats Rust code in the standard style."],
    ["rustup", "The installer and version manager for Rust."],
    ["scope", "The region between braces where a name is valid."],
    ["self", "The value a method was called on."],
    ["shadowing", "Making a new variable with the same name as an old one."],
    ["slice", "A borrowed view of part of a list or string, like &v[1..3]."],
    ["Some", "The Option variant holding a value."],
    ["stack", "Fast memory for fixed-size values like numbers."],
    ["statement", "Code that does something but produces no value; ends with ;."],
    ["std", "Rust's standard library."],
    ["String", "Owned, growable text."],
    ["struct", "A type that groups named fields."],
    ["thread", "A separate path of execution running at the same time."],
    ["trait", "A set of methods a type promises to provide."],
    ["tuple", "A fixed group of values of different types, like (3, \"a\")."],
    ["turbofish", "The ::<T> syntax that names a type, as in parse::<i32>()."],
    ["u32", "A whole number that can't be negative."],
    ["unwrap", "Takes the value out of Ok or Some, or panics."],
    ["use", "Brings a path into scope so you can use a shorter name."],
    ["usize", "The type for sizes and positions in collections."],
    ["Vec", "A growable list of one type."],
    ["? operator", "Returns the error early, or gives back the success value."]
  ];

  var field = [
    { name: "println! / format!", head: "std", what: "Print or build text with {} gaps, {:?} and {:.2}.", ex: "format!(\"{name} has {n}\")" },
    { name: "String", head: "std::string", what: "Owned text: push_str, len, contains, replace, to_uppercase, trim.", ex: "String::from(\"hi\").to_uppercase()" },
    { name: "str::parse", head: "std::str", what: "Turns text into numbers and more, returning a Result.", ex: "\"42\".parse::<i32>()" },
    { name: "Vec", head: "std::vec", what: "A growable list: push, pop, len, sort, contains, iter.", ex: "let mut v = vec![1, 2]; v.push(3);" },
    { name: "HashMap", head: "std::collections", what: "Key-value lookups with insert, get, remove and entry.", ex: "*m.entry(k).or_insert(0) += 1" },
    { name: "BTreeMap / HashSet", head: "std::collections", what: "A sorted map, and a set of unique values.", ex: "let s: HashSet<_> = v.into_iter().collect();" },
    { name: "Option", head: "std::option", what: "Some or None, with unwrap_or, map, is_some and if let.", ex: "maybe.unwrap_or(0)" },
    { name: "Result", head: "std::result", what: "Ok or Err, with ?, map_err, expect and match.", ex: "let n: i32 = text.parse()?;" },
    { name: "Iterator", head: "std::iter", what: "map, filter, enumerate, sum, max, count, collect.", ex: "v.iter().filter(|x| **x > 0).count()" },
    { name: "fs", head: "std::fs", what: "Read and write whole files in one call.", ex: "fs::read_to_string(\"save.txt\")?" },
    { name: "env::args", head: "std::env", what: "The words typed after the program's name.", ex: "std::env::args().nth(1)" },
    { name: "Instant / Duration", head: "std::time", what: "Measure how long something takes.", ex: "let t = Instant::now(); t.elapsed()" },
    { name: "thread::spawn", head: "std::thread", what: "Runs a closure on a new thread; join waits for it.", ex: "thread::spawn(move || work()).join()" },
    { name: "Arc<Mutex<T>>", head: "std::sync", what: "Share and change data safely across threads.", ex: "*counter.lock().unwrap() += 1" },
    { name: "rand (crate)", head: "crates.io", what: "Random numbers for games and simulations.", ex: "rand::random_range(1..=6)" }
  ];

  var cheats = [
    { title: "Program Skeleton Card", body: "The shape of a Rust program.", code: src(["fn main() {", "    println!(\"Hello\");", "}"]) },
    { title: "Variables Card", body: "Everyday types and conversions.", code: src(["let n = 42;", "let mut x = 3.5;", "let ok: bool = true;", "let c = 'A';", "let s = String::from(\"text\");", "const MAX: u32 = 10;", "let f = f64::from(n) / 2.0;", "let parsed: i32 = \"7\".parse().unwrap();", "let back = n.to_string();"]) },
    { title: "Decisions Card", body: "if, match and patterns.", code: src(["if x > 0 {", "    println!(\"positive\");", "} else if x == 0 {", "    println!(\"zero\");", "} else {", "    println!(\"negative\");", "}", "let size = if n > 10 { \"big\" } else { \"small\" };", "match n {", "    0 => println!(\"zero\"),", "    1..=9 => println!(\"small\"),", "    _ => println!(\"big\"),", "}"]) },
    { title: "Loops Card", body: "Every way to repeat.", code: src(["for i in 0..3 {}", "for i in (1..=3).rev() {}", "for item in &list {}", "for (i, item) in list.iter().enumerate() {}", "while lives > 0 {", "    lives -= 1;", "}", "let answer = loop {", "    break 42;", "};"]) },
    { title: "Collections Card", body: "Vec and HashMap.", code: src(["let mut v = vec![1, 2, 3];", "v.push(4);", "let first = v[0];", "let maybe = v.get(9);", "let mut m = HashMap::new();", "m.insert(\"a\", 1);", "let a = m.get(\"a\");", "*m.entry(\"b\").or_insert(0) += 1;"]) },
    { title: "Structs Card", body: "A type with methods.", code: src(["#[derive(Debug, Clone)]", "struct Box2 {", "    size: u32,", "}", "", "impl Box2 {", "    fn new(size: u32) -> Self {", "        Self { size }", "    }", "    fn grow(&mut self) {", "        self.size += 1;", "    }", "    fn size(&self) -> u32 {", "        self.size", "    }", "}"]) },
    { title: "Errors Card", body: "Result, ? and match.", code: src(["fn load(path: &str) -> Result<String, std::io::Error> {", "    let text = std::fs::read_to_string(path)?;", "    Ok(text)", "}", "", "fn main() {", "    match load(\"save.txt\") {", "        Ok(text) => println!(\"{text}\"),", "        Err(e) => println!(\"error: {e}\"),", "    }", "}"]) },
    { title: "Iterators Card", body: "Pipelines over collections.", code: src(["let doubled: Vec<i32> = v.iter().map(|x| x * 2).collect();", "let big = v.iter().filter(|&&x| x > 10).count();", "let total: i32 = v.iter().sum();", "let best = v.iter().max();", "let words: Vec<&str> = text.split_whitespace().collect();"]) }
  ];

  /* A whole main.rs: use lines, then any types and functions, then main. */
  function M(uses, decls, body) {
    var out = [];
    if (uses.length) out = out.concat(uses, [""]);
    if (decls.length) out = out.concat(decls, [""]);
    return out.concat(["fn main() {"], body.map(function (l) { return l ? "    " + l : ""; }), ["}"]);
  }
  function stars(n) { return new Array(n + 1).join("*"); }
  function padR(s, w) { while (s.length < w) s += " "; return s; }
  function padL(s, w) { s = String(s); while (s.length < w) s = " " + s; return s; }
  /* How Rust prints an f64: {} drops a whole number's .0, {:?} keeps it. */
  function fDebug(x) { return x % 1 === 0 ? x + ".0" : String(x); }
  function list(a) { return "[" + a.join(", ") + "]"; }

  var projects = [
    { name: "Rocket Countdown", about: "A reversed range counts the rocket down to blast off.",
      vars: [{ key: "start", val: 5, min: 1, max: 12 }],
      code: function (v) { return M([], [], ["let start = " + v.start + ";", "for i in (1..=start).rev() {", "    println!(\"{i}...\");", "}", "println!(\"Blast off!\");"]); },
      run: function (v) { var o = []; for (var i = v.start; i > 0; i--) o.push(i + "..."); o.push("Blast off!"); return o; },
      explain: "1..=start is every number from 1 up to start; rev() walks it backwards. Then the rocket launches." },
    { name: "Star Steps", about: "repeat builds each row: \"*\".repeat(3) is ***.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return M([], [], ["let rows = " + v.rows + ";", "for r in 1..=rows {", "    println!(\"{}\", \"*\".repeat(r));", "}"]); },
      run: function (v) { var o = []; for (var r = 1; r <= v.rows; r++) o.push(stars(r)); return o; },
      explain: "repeat makes a row r stars long, so each line is one star longer than the last." },
    { name: "Coin Bank", about: "Every coin adds to the total.",
      vars: [{ key: "coins", val: 5, min: 1, max: 10 }, { key: "each", val: 25, min: 1, max: 50 }],
      code: function (v) { return M([], [], ["let coins = " + v.coins + ";", "let each = " + v.each + ";", "let mut total = 0;", "for c in 1..=coins {", "    total += each;", "    println!(\"Coin {c}: total {total}\");", "}"]); },
      run: function (v) { var o = [], t = 0; for (var c = 1; c <= v.coins; c++) { t += v.each; o.push("Coin " + c + ": total " + t); } return o; },
      explain: "total is mut because it changes; += adds one coin's worth each round." },
    { name: "Score Doubler", about: "A score that doubles every round.",
      vars: [{ key: "score", val: 3, min: 1, max: 50 }, { key: "rounds", val: 5, min: 1, max: 10 }],
      code: function (v) { return M([], [], ["let mut score = " + v.score + ";", "let rounds = " + v.rounds + ";", "for round in 1..=rounds {", "    score *= 2;", "    println!(\"Round {round}: {score}\");", "}"]); },
      run: function (v) { var o = [], s = v.score; for (var r = 1; r <= v.rounds; r++) { s *= 2; o.push("Round " + r + ": " + s); } return o; },
      explain: "*= 2 doubles the score; {round} and {score} drop the values straight into the text." },
    { name: "Times Table", about: "A multiplication table for any number.",
      vars: [{ key: "num", val: 7, min: 1, max: 12 }, { key: "upto", val: 5, min: 1, max: 12 }],
      code: function (v) { return M([], [], ["let num = " + v.num + ";", "let upto = " + v.upto + ";", "for i in 1..=upto {", "    println!(\"{num} x {i} = {}\", num * i);", "}"]); },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(v.num + " x " + i + " = " + v.num * i); return o; },
      explain: "Named gaps take variables; the empty {} takes the product written after the text." },
    { name: "Temperature Converter", about: "Celsius to Fahrenheit with one decimal place.",
      vars: [{ key: "celsius", val: 20, min: -40, max: 100 }],
      code: function (v) { return M([], [], ["let celsius = " + v.celsius + ";", "let fahrenheit = f64::from(celsius) * 9.0 / 5.0 + 32.0;", "println!(\"{celsius} C is {fahrenheit:.1} F\");"]); },
      run: function (v) { return [v.celsius + " C is " + (v.celsius * 9 / 5 + 32).toFixed(1) + " F"]; },
      explain: "f64::from turns the whole number into a decimal first, and {fahrenheit:.1} shows one decimal place." },
    { name: "Tip Calculator", about: "A tip and total for a bill, in whole dollars.",
      vars: [{ key: "bill", val: 40, min: 1, max: 500 }, { key: "percent", val: 15, min: 0, max: 30 }],
      code: function (v) { return M([], [], ["let bill = " + v.bill + ";", "let percent = " + v.percent + ";", "let tip = bill * percent / 100;", "println!(\"Bill: ${bill}\");", "println!(\"Tip: ${tip}\");", "println!(\"Total: ${}\", bill + tip);"]); },
      run: function (v) { var tip = Math.floor(v.bill * v.percent / 100); return ["Bill: $" + v.bill, "Tip: $" + tip, "Total: $" + (v.bill + tip)]; },
      explain: "Whole-number division drops the cents, so a $40 bill at 15% tips $6." },
    { name: "FizzBuzz", about: "match on a pair of remainders picks Fizz, Buzz or both.",
      vars: [{ key: "limit", val: 15, min: 1, max: 30 }],
      code: function (v) { return M([], [], ["let limit = " + v.limit + ";", "for n in 1..=limit {", "    match (n % 3, n % 5) {", "        (0, 0) => println!(\"FizzBuzz\"),", "        (0, _) => println!(\"Fizz\"),", "        (_, 0) => println!(\"Buzz\"),", "        _ => println!(\"{n}\"),", "    }", "}"]); },
      run: function (v) { var o = []; for (var n = 1; n <= v.limit; n++) o.push(n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : String(n)); return o; },
      explain: "The tuple holds both remainders; (0, 0) means divisible by 3 and 5. _ matches anything." },
    { name: "Score Stats", about: "Highest, lowest and average of a list.",
      vars: [{ key: "first", val: 72, min: 0, max: 100 }, { key: "second", val: 95, min: 0, max: 100 }, { key: "third", val: 64, min: 0, max: 100 }],
      code: function (v) { return M([], [], ["let first = " + v.first + ";", "let second = " + v.second + ";", "let third = " + v.third + ";", "let scores = [first, second, third];", "let sum: i32 = scores.iter().sum();", "let highest = scores.iter().max().unwrap();", "let lowest = scores.iter().min().unwrap();", "println!(\"Scores: {scores:?}\");", "println!(\"Highest: {highest}\");", "println!(\"Lowest: {lowest}\");", "println!(\"Average: {:.1}\", f64::from(sum) / 3.0);"]); },
      run: function (v) { var a = [v.first, v.second, v.third]; return ["Scores: " + list(a), "Highest: " + Math.max.apply(null, a), "Lowest: " + Math.min.apply(null, a), "Average: " + ((v.first + v.second + v.third) / 3).toFixed(1)]; },
      explain: "iter() walks the scores; sum, max and min finish the job. max returns an Option (a list could be empty), so unwrap takes the value out." },
    { name: "Class Vote", about: "A BTreeMap counts votes and keeps the names in order.",
      vars: [{ key: "ana", val: 3, min: 0, max: 20 }, { key: "leo", val: 5, min: 0, max: 20 }],
      code: function (v) { return M(["use std::collections::BTreeMap;"], [], ["let ana = " + v.ana + ";", "let leo = " + v.leo + ";", "let mut votes = BTreeMap::from([(\"Mia\", 4), (\"Ana\", ana), (\"Leo\", leo)]);", "*votes.entry(\"Ana\").or_insert(0) += 2;", "let mut total = 0;", "for (name, count) in &votes {", "    println!(\"{name}: {count}\");", "    total += count;", "}", "println!(\"Total votes: {total}\");"]); },
      run: function (v) { return ["Ana: " + (v.ana + 2), "Leo: " + v.leo, "Mia: 4", "Total votes: " + (v.ana + 2 + v.leo + 4)]; },
      explain: "Ana gets two late votes through entry. A BTreeMap keeps its keys sorted, so the names always print in alphabetical order." },
    { name: "Shopping Cart", about: "A list of tuples adds up a receipt.",
      vars: [{ key: "apples", val: 3, min: 0, max: 10 }, { key: "pears", val: 2, min: 0, max: 10 }],
      code: function (v) { return M([], [], ["let apples = " + v.apples + ";", "let pears = " + v.pears + ";", "let cart = [", "    (\"Apple\", 50, apples),", "    (\"Pear\", 75, pears),", "    (\"Bread\", 250, 1),", "];", "let mut total = 0;", "for (name, price, qty) in cart {", "    let cost = price * qty;", "    total += cost;", "    println!(\"{name:<6} x{qty} {cost:>5}\");", "}", "println!(\"Total: ${}.{:02}\", total / 100, total % 100);"]); },
      run: function (v) {
        var cart = [["Apple", 50, v.apples], ["Pear", 75, v.pears], ["Bread", 250, 1]], o = [], t = 0;
        cart.forEach(function (it) { var c = it[1] * it[2]; t += c; o.push(padR(it[0], 6) + " x" + it[2] + " " + padL(c, 5)); });
        o.push("Total: $" + Math.floor(t / 100) + "." + (t % 100 < 10 ? "0" : "") + (t % 100));
        return o;
      },
      explain: "Prices are in cents to avoid rounding. The for loop unpacks each tuple; :<6 pads the name, :>5 lines up the cost, and :02 keeps two digits of cents." },
    { name: "Hero Healing", about: "A &mut self method heals the hero.",
      vars: [{ key: "hp", val: 40, min: 1, max: 99 }, { key: "potion", val: 25, min: 5, max: 50 }],
      code: function (v) { return M([], ["struct Hero {", "    name: String,", "    hp: u32,", "}", "", "impl Hero {", "    fn heal(&mut self, amount: u32) {", "        self.hp = (self.hp + amount).min(100);", "    }", "}"], ["let hp = " + v.hp + ";", "let potion = " + v.potion + ";", "let mut hero = Hero {", "    name: String::from(\"Ana\"),", "    hp,", "};", "while hero.hp < 100 {", "    hero.heal(potion);", "    println!(\"{} drinks a potion: {} HP\", hero.name, hero.hp);", "}"]); },
      run: function (v) { var o = [], hp = v.hp; while (hp < 100) { hp = Math.min(hp + v.potion, 100); o.push("Ana drinks a potion: " + hp + " HP"); } return o; },
      explain: "heal takes &mut self, so it can change the hero; .min(100) caps the health. hero must be let mut for that to be allowed." },
    { name: "Shape Areas", about: "A trait lets one list hold two kinds of shape.",
      vars: [{ key: "w", val: 4, min: 1, max: 20 }, { key: "h", val: 3, min: 1, max: 20 }, { key: "side", val: 5, min: 1, max: 20 }],
      code: function (v) { return M([], ["trait Shape {", "    fn area(&self) -> u32;", "    fn name(&self) -> &str;", "}", "", "struct Rect {", "    w: u32,", "    h: u32,", "}", "", "struct Square {", "    side: u32,", "}", "", "impl Shape for Rect {", "    fn area(&self) -> u32 {", "        self.w * self.h", "    }", "    fn name(&self) -> &str {", "        \"rectangle\"", "    }", "}", "", "impl Shape for Square {", "    fn area(&self) -> u32 {", "        self.side * self.side", "    }", "    fn name(&self) -> &str {", "        \"square\"", "    }", "}"], ["let w = " + v.w + ";", "let h = " + v.h + ";", "let side = " + v.side + ";", "let shapes: [Box<dyn Shape>; 2] = [Box::new(Rect { w, h }), Box::new(Square { side })];", "let mut total = 0;", "for s in &shapes {", "    println!(\"{}: {}\", s.name(), s.area());", "    total += s.area();", "}", "println!(\"Total area: {total}\");"]); },
      run: function (v) { var a = v.w * v.h, b = v.side * v.side; return ["rectangle: " + a, "square: " + b, "Total area: " + (a + b)]; },
      explain: "Rect and Square both implement Shape, so Box<dyn Shape> can hold either one. The loop calls the right area for each." },
    { name: "Cookie Sharing", about: "A function returns Ok with an answer or Err with a reason.",
      vars: [{ key: "cookies", val: 12, min: 0, max: 50 }, { key: "friends", val: 4, min: 0, max: 10 }],
      code: function (v) { return M([], ["fn share(cookies: u32, friends: u32) -> Result<(u32, u32), String> {", "    if friends == 0 {", "        return Err(String::from(\"no friends to share with\"));", "    }", "    Ok((cookies / friends, cookies % friends))", "}"], ["let cookies = " + v.cookies + ";", "let friends = " + v.friends + ";", "match share(cookies, friends) {", "    Ok((each, left)) => {", "        println!(\"Each friend gets {each}\");", "        println!(\"Left over: {left}\");", "    }", "    Err(e) => println!(\"Error: {e}\"),", "}"]); },
      run: function (v) { if (v.friends === 0) return ["Error: no friends to share with"]; return ["Each friend gets " + Math.floor(v.cookies / v.friends), "Left over: " + v.cookies % v.friends]; },
      explain: "Set friends to 0: dividing by zero would crash, so share returns an Err instead, and match handles both outcomes." },
    { name: "Generic Largest", about: "One generic function finds the largest int or decimal.",
      vars: [{ key: "count", val: 4, min: 1, max: 10 }],
      code: function (v) { return M([], ["fn largest<T: PartialOrd + Copy>(items: &[T]) -> T {", "    let mut best = items[0];", "    for &item in items {", "        if item > best {", "            best = item;", "        }", "    }", "    best", "}"], ["let count = " + v.count + ";", "let ints: Vec<i32> = (1..=count).collect();", "let halves: Vec<f64> = ints.iter().map(|&i| f64::from(i) / 2.0).collect();", "println!(\"{ints:?} largest {}\", largest(&ints));", "println!(\"{halves:?} largest {}\", largest(&halves));"]); },
      run: function (v) {
        var ints = [], halves = [];
        for (var i = 1; i <= v.count; i++) { ints.push(i); halves.push(i / 2); }
        return [list(ints) + " largest " + v.count, list(halves.map(fDebug)) + " largest " + v.count / 2];
      },
      explain: "T can be any type that can be compared (PartialOrd) and copied (Copy). Notice {:?} prints 1.0 but {} prints 2 — the debug view always shows the decimal." },
    { name: "Thread Workers", about: "Each worker thread adds up its jobs; join collects the answers.",
      vars: [{ key: "workers", val: 3, min: 1, max: 8 }, { key: "jobs", val: 4, min: 1, max: 10 }],
      code: function (v) { return M(["use std::thread;"], [], ["let workers = " + v.workers + ";", "let jobs = " + v.jobs + ";", "let handles: Vec<_> = (1..=workers)", "    .map(|id| thread::spawn(move || (1..=jobs).map(|j| id * j).sum::<u32>()))", "    .collect();", "for (i, handle) in handles.into_iter().enumerate() {", "    println!(\"Worker {} made {}\", i + 1, handle.join().unwrap());", "}"]); },
      run: function (v) { var o = [], tri = v.jobs * (v.jobs + 1) / 2; for (var id = 1; id <= v.workers; id++) o.push("Worker " + id + " made " + id * tri); return o; },
      explain: "Every worker runs on its own thread at the same time. move gives each thread its own id; join waits for a thread and hands back its answer, in order." },
    { name: "Square Pipeline", about: "A thread sends squares down a channel; main receives them.",
      vars: [{ key: "n", val: 5, min: 1, max: 12 }],
      code: function (v) { return M(["use std::sync::mpsc;", "use std::thread;"], [], ["let n = " + v.n + ";", "let (tx, rx) = mpsc::channel();", "thread::spawn(move || {", "    for i in 1..=n {", "        tx.send(i * i).unwrap();", "    }", "});", "let mut sum = 0;", "for sq in rx {", "    println!(\"got {sq}\");", "    sum += sq;", "}", "println!(\"sum: {sum}\");"]); },
      run: function (v) { var o = [], s = 0; for (var i = 1; i <= v.n; i++) { o.push("got " + i * i); s += i * i; } o.push("sum: " + s); return o; },
      explain: "tx sends and rx receives. When the thread finishes, tx is dropped, the channel closes, and the for loop ends." },
    { name: "Number Guesser", about: "Halving the range finds any number from 1 to 100 in 7 guesses or fewer.",
      vars: [{ key: "secret", val: 37, min: 1, max: 100 }],
      code: function (v) { return M(["use std::cmp::Ordering;"], [], ["let secret = " + v.secret + ";", "let (mut low, mut high) = (1, 100);", "let mut tries = 0;", "loop {", "    tries += 1;", "    let guess = (low + high) / 2;", "    match guess.cmp(&secret) {", "        Ordering::Less => {", "            println!(\"{guess} is too low\");", "            low = guess + 1;", "        }", "        Ordering::Greater => {", "            println!(\"{guess} is too high\");", "            high = guess - 1;", "        }", "        Ordering::Equal => {", "            println!(\"Got it: {guess} in {tries} tries\");", "            break;", "        }", "    }", "}"]); },
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
      explain: "cmp compares two values and returns Less, Greater or Equal, and match handles all three. Each guess halves what's left — binary search." }
  ];

  var vt = [
    { line: 'println!("{w}");', why: "println! prints the text and ends the line." },
    { line: 'println!("{{v}}");', why: "A name in braces prints that variable." },
    { line: 'println!("{w}: {{v}}");', why: "Text and a value in one line." },
    { line: 'println!("{{v}:>5}");', why: ":>5 pads the value to five places, on the right." },
    { line: "let {v} = {n};", why: "let makes a variable; Rust infers i32." },
    { line: "let mut {v} = {n};", why: "mut lets the value change later." },
    { line: "let {v}: f64 = {dec};", why: "f64 holds a decimal number." },
    { line: "let {v} = {b};", why: "true or false makes a bool." },
    { line: 'let {sv} = String::from("{w}");', why: "String::from makes owned text." },
    { line: "const {cv}: u32 = {n};", why: "A typed constant in CAPITALS." },
    { line: "{v} += {n};", why: "+= adds onto the current value." },
    { line: "{v} -= {d};", why: "-= takes away from the current value." },
    { line: "{v} *= {d};", why: "*= multiplies the current value." },
    { line: "let {v} = {u} % {d};", why: "% gives the remainder." },
    { line: "let {v} = f64::from({u}) / {d}.0;", why: "Convert to f64 for a decimal answer." },
    { line: "let {v} = {u}.pow({d});", why: "pow raises a number to a power." },
    { line: "let {v} = {u}.max({n});", why: "max picks the larger of two numbers." },
    { line: 'let {v}: i32 = "{n}".parse().unwrap();', why: "parse turns text into a number." },
    { line: "let {sv} = {v}.to_string();", why: "to_string turns a value into text." },
    { line: 'let {sv} = format!("{w} {{v}}");', why: "format! builds text instead of printing it." },
    { line: 'if {v} > {n} { println!("{w}"); }', why: "if runs its block only when the test is true." },
    { line: "if {v} == {n} { {u} = 0; }", why: "== asks whether two values are equal." },
    { line: "} else if {v} < {d} {", why: "else if tries another test." },
    { line: 'let {sv} = if {v} > {n} { "{w}" } else { "none" };', why: "if gives back a value." },
    { line: 'match {v} { {n} => println!("{w}"), _ => {} }', why: "match compares against each pattern; _ covers the rest." },
    { line: "for i in 0..{n} { {v} += i; }", why: "0..n counts from 0 up to n - 1." },
    { line: "for i in (1..={n}).rev() { {v} += i; }", why: "rev counts a range backwards." },
    { line: "while {v} > 0 { {v} -= 1; }", why: "while repeats while the test is true." },
    { line: "let {v} = loop { break {n}; };", why: "break can hand a value out of a loop." },
    { line: "for x in &{arr} { {v} += x; }", why: "& borrows each item from the list." },
    { line: "let mut {arr} = vec![{n}, {n2}, {n3}];", why: "vec! builds a Vec with values." },
    { line: "{arr}.push({n});", why: "push adds to the end of a Vec." },
    { line: "let {v} = {arr}.len();", why: "len counts the items." },
    { line: "let top = &{arr}[..{d}];", why: "A slice borrows the first few items." },
    { line: "let {v}: i32 = {arr}.iter().sum();", why: "sum adds up an iterator." },
    { line: "let mut {m} = HashMap::new();", why: "An empty map, ready for keys." },
    { line: '{m}.insert("{w}", {n});', why: "insert stores a value under a key." },
    { line: '*{m}.entry("{w}").or_insert(0) += {d};', why: "entry finds or creates a key's slot." },
    { line: 'if let Some({v}) = {m}.get("{w}") { println!("{{v}}"); }', why: "get returns an Option; if let opens it." },
    { line: "fn {f}({v}: i32) -> i32 { {v} * {d} }", why: "The last expression is the answer." },
    { line: 'fn {f}() { println!("{w}"); }', why: "A function with no inputs and no result." },
    { line: "{f}({n});", why: "Call a function with an argument." },
    { line: "let {v} = {f}({u});", why: "Store a function's answer." },
    { line: "fn {f}({sv}: &str) -> usize { {sv}.len() }", why: "&str borrows text to read it." },
    { line: "struct {c} { {sv}: String, {v}: i32 }", why: "A struct groups named fields." },
    { line: "let {o} = {c} { {v}: {n} };", why: "Build a struct by filling its fields." },
    { line: "{o}.{v} += {n};", why: "The dot reaches a field." },
    { line: "impl {c} { fn new() -> Self { Self { {v}: {n} } } }", why: "new builds a ready value; Self is the type." },
    { line: "fn {f}(&mut self) { self.{v} += {d}; }", why: "&mut self lets a method change its value." },
    { line: "enum {c} { {w}, Stop }", why: "An enum lists the choices." },
    { line: 'match {o} { Some(x) => println!("{x}"), None => println!("{w}") }', why: "match handles Some and None." },
    { line: "let {v}: Option<i32> = Some({n});", why: "Some wraps a value in an Option." },
    { line: "let {v} = {o}.unwrap_or({n});", why: "unwrap_or gives a default for None." },
    { line: "let {v}: i32 = text.parse()?;", why: "? passes the error up, or gives the value." },
    { line: "let {v}: Result<i32, String> = Ok({n});", why: "Ok wraps a success value." },
    { line: 'return Err(format!("{w} failed: {{v}}"));', why: "Return an error with a message." },
    { line: 'let {sv} = fs::read_to_string("{w}.txt")?;', why: "Read a whole file, passing errors up." },
    { line: "trait {c} { fn {f}(&self) -> i32; }", why: "A trait lists methods a type must have." },
    { line: "impl {c} for {k} { fn {f}(&self) -> i32 { {n} } }", why: "impl … for keeps a trait's promise." },
    { line: "fn {f}<T: PartialOrd>(a: T, b: T) -> bool { a > b }", why: "A generic function with a trait bound." },
    { line: "let {arr}: Vec<i32> = {arr}.iter().map(|x| x * {d}).collect();", why: "map transforms; collect gathers." },
    { line: "let {v} = {arr}.iter().filter(|&&x| x > {n}).count();", why: "filter keeps items that pass the test." },
    { line: "let {f} = |x: i32| x + {n};", why: "A closure is a small unnamed function." },
    { line: 'let {sv} = "{w}".to_uppercase();', why: "to_uppercase returns new, capital text." },
    { line: 'let {sv} = "{w}".repeat({d});', why: "repeat joins copies of the text." },
    { line: "let {v} = Box::new({n});", why: "Box stores a value on the heap." },
    { line: "let {v} = Rc::new({n});", why: "Rc lets several owners share a value." },
    { line: "let handle = thread::spawn(move || {v} * {d});", why: "spawn runs a closure on a new thread." },
    { line: "tx.send({v}).unwrap();", why: "send puts a value into a channel." },
    { line: "let {v} = rx.recv().unwrap();", why: "recv waits for a value from a channel." },
    { line: "mod {sv} { pub fn {f}() {} }", why: "A module with a public function." },
    { line: "let ({v}, {u}) = ({n}, {n2});", why: "A tuple unpacks into two variables." },
    { line: "let {sv}_copy = {sv}.clone();", why: "clone makes a real second copy." },
    { line: "fn {f}({v}: &mut i32) { *{v} += {d}; }", why: "&mut lends a value to change it; * reaches it." },
    { line: "let r = &{v};", why: "& borrows a value without taking it." },
    { line: "{f}(&mut {v});", why: "Lend a variable so the function can change it." }
  ];
  var themes = [
    { name: "Print & Talk", t: [0, 1, 2, 3, 19] },
    { name: "Let Boxes", t: [4, 5, 6, 7, 8] },
    { name: "Constants & Types", t: [9, 6, 4, 17, 18] },
    { name: "Math Moves", t: [10, 11, 12, 13, 14] },
    { name: "Number Tools", t: [15, 16, 13, 71, 4] },
    { name: "Conversions", t: [14, 17, 18, 19, 63] },
    { name: "Yes or No", t: [20, 21, 22, 23, 7] },
    { name: "Match & Choose", t: [24, 23, 20, 21, 22] },
    { name: "Loops", t: [25, 26, 27, 28, 29] },
    { name: "Vectors", t: [30, 31, 32, 33, 34] },
    { name: "Maps", t: [35, 36, 37, 38, 32] },
    { name: "Functions", t: [39, 40, 41, 42, 43] },
    { name: "Ownership & Borrowing", t: [72, 73, 74, 75, 43] },
    { name: "Structs", t: [44, 45, 46, 47, 48] },
    { name: "Enums & Options", t: [49, 50, 51, 52, 24] },
    { name: "Errors", t: [53, 54, 55, 56, 17] },
    { name: "Traits & Generics", t: [57, 58, 59, 47, 48] },
    { name: "Iterators & Closures", t: [60, 61, 62, 34, 29] },
    { name: "Smart Pointers & Threads", t: [65, 66, 67, 68, 69] },
    { name: "Rust Masters", t: [37, 58, 60, 73, 55] }
  ];
  /* Rust reserves move and box, and drop is a built-in function, so the
     shared word banks are filtered for this track. */
  var FUNCS = ["play", "heal", "jump", "draw", "sing", "build", "spin", "dash", "grow", "shine", "mix", "lift", "launch", "glide", "turn", "push", "pull", "wave", "zap", "mend", "craft", "boost", "cheer", "greet", "explore", "charge"];
  var OBJECTS = ["gem", "hero", "bot", "pet", "ship", "star", "cube", "orb", "egg", "drone"];
  var CONSTS = ["MAX_LIVES", "TOP_SPEED", "START_GOLD", "MAX_LEVEL", "BONUS", "LIMIT", "TEAM_SIZE", "MAX_HP", "GRID_SIZE", "SPAWN_RATE"];
  function pick(bank, r) { return bank[Math.floor(r() * bank.length)]; }

  return {
    blocks: blocks, chapters: chapters, shelves: shelves, glossary: glossary, field: field, cheats: cheats,
    projects: projects, vt: vt, themes: themes,
    fill: function (k, r) {
      if (k === "f") return pick(FUNCS, r);
      if (k === "o") return pick(OBJECTS, r);
      if (k === "cv") return pick(CONSTS, r);
      return null;
    },
    sandboxNote: "Thirty everyday Rust lines, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your Rust progress is saved separately from every other track.",
    sourcesHTML: 'Rust facts and syntax follow <a href="https://doc.rust-lang.org/book/">The Rust Programming Language</a>, <a href="https://doc.rust-lang.org/reference/">The Rust Reference</a> and the <a href="https://doc.rust-lang.org/std/">standard library documentation</a> (edition 2024). Rust is a trademark of the Rust Foundation; Code Block is not affiliated with it. Every explanation is written in Code Block’s own words, and every practice program is formatted with rustfmt, checked with clippy and run with the real Rust compiler before it ships.'
  };
});
