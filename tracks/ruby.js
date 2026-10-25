"use strict";
/* ================= RUBY — a Code Block track =================
   Written fresh for Code Block in plain words. Facts and syntax follow
   the official Ruby documentation (docs.ruby-lang.org, Ruby 3.3) and the
   community Ruby Style Guide (two-space indentation). Every PC project
   and library example is run by the real Ruby interpreter with warnings
   on (ruby -w) in tests/content — any warning fails the check — and a
   project's output must match the app. Every drill and Vault line is
   compiled by Ruby itself. */
cbRegisterTrack("ruby", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Puts Block", short: "puts", chapter: "Ruby Ch. 1 · First Steps", icon: "i-say", verb: "say",
      line: 'puts "Hello, world!"',
      explain: "puts prints a line and moves to the next one. Ruby needs no semicolons and no brackets around the text." },
    { name: "Variable Block", short: "x = 0", chapter: "Ruby Ch. 2 · Variables and Types", icon: "i-tag", verb: "store",
      line: "score = 0",
      explain: "A variable is a name for a value. Ruby works out the type itself; score.class tells you it's an Integer." },
    { name: "Symbol Block", short: ":symbol", chapter: "Ruby Ch. 2 · Variables and Types", icon: "i-stamp", verb: "name",
      line: "status = :ready",
      explain: "A symbol, like :ready, is a lightweight name. Ruby uses symbols for labels and hash keys, where text would be heavier." },
    { name: "Constant Block", short: "CONSTANT", chapter: "Ruby Ch. 2 · Variables and Types", icon: "i-lock", verb: "fix",
      line: "MAX_LIVES = 3",
      explain: "A name starting with a capital letter is a constant. Ruby warns you if you try to change one later." },
    { name: "Divide Block", short: "fdiv", chapter: "Ruby Ch. 3 · Operators and Math", icon: "i-calc", verb: "divide",
      line: "average = total.fdiv(count)",
      explain: "Dividing two Integers drops the fraction: 7 / 2 is 3. fdiv (or 7.0 / 2) gives the exact answer, 3.5." },
    { name: "Interpolation Block", short: "#{ }", chapter: "Ruby Ch. 4 · Strings", icon: "i-brackets", verb: "fill",
      line: 'puts "#{name} has #{coins} coins"',
      explain: "Inside double quotes, #{ } runs any Ruby and drops the result into the text. Single quotes keep everything as typed." },
    { name: "String Method Block", short: ".upcase", chapter: "Ruby Ch. 4 · Strings", icon: "i-link", verb: "shout",
      line: "shout = name.upcase",
      explain: "Strings come with dozens of methods: upcase, length, reverse, include?, split, strip and more. Call them with a dot." },
    { name: "If Block", short: "if", chapter: "Ruby Ch. 5 · Decisions", icon: "i-fork", verb: "decide",
      line: 'puts "Game over" if hp <= 0',
      explain: "Ruby lets an if sit at the end of a line, so short checks read like English. Only nil and false count as false." },
    { name: "Unless Block", short: "unless", chapter: "Ruby Ch. 5 · Decisions", icon: "i-shield-check", verb: "guard",
      line: 'puts "Keep going" unless lives.zero?',
      explain: "unless is if not. Methods ending in ? answer yes or no: lives.zero? is true when lives is 0." },
    { name: "Case Block", short: "case", chapter: "Ruby Ch. 5 · Decisions", icon: "i-toggle", verb: "pick",
      line: 'grade = case score when 90.. then "A" when 80...90 then "B" else "C" end',
      explain: "case compares a value against each when, using ranges, classes or exact values. The whole case gives back a value." },
    { name: "Times Block", short: ".times", chapter: "Ruby Ch. 6 · Loops and Iterators", icon: "i-repeat", verb: "repeat",
      line: '3.times { |i| puts "lap #{i}" }',
      explain: "Numbers know how to repeat: 3.times runs the block three times, passing 0, 1 and 2 in as i." },
    { name: "Each Block", short: ".each", chapter: "Ruby Ch. 6 · Loops and Iterators", icon: "i-list", verb: "walk",
      line: "scores.each { |score| puts score }",
      explain: "each hands every item to the block between the { }, one at a time. It's how Ruby code loops most of the time." },
    { name: "Range Block", short: "1..5", chapter: "Ruby Ch. 6 · Loops and Iterators", icon: "i-rows", verb: "count",
      line: "(1..5).each { |n| puts n }",
      explain: "1..5 is a range from 1 to 5, ends included. 1...5 (three dots) leaves out the 5." },
    { name: "Array Block", short: "[ ]", chapter: "Ruby Ch. 7 · Arrays", icon: "i-boxes", verb: "line up",
      line: "scores = [10, 20, 30]",
      explain: "An Array holds values in order, counted from 0. scores.first is 10, scores.last is 30, and scores[-1] is the last one too." },
    { name: "Push Block", short: "<<", chapter: "Ruby Ch. 7 · Arrays", icon: "i-plus-square", verb: "grow",
      line: "scores << 40",
      explain: "<< (the shovel) adds an item to the end of an array. scores.size is now 4." },
    { name: "Hash Block", short: "{ k: v }", chapter: "Ruby Ch. 8 · Hashes", icon: "i-folder", verb: "label",
      line: 'player = { name: "Ana", hp: 100 }',
      explain: "A Hash stores values by key. name: \"Ana\" is a symbol key; read it with player[:name]." },
    { name: "Fetch Block", short: ".fetch", chapter: "Ruby Ch. 8 · Hashes", icon: "i-check", verb: "look up",
      line: "level = player.fetch(:level, 1)",
      explain: "fetch looks up a key and uses the default you give when it's missing. Plain player[:level] would give nil." },
    { name: "Method Block", short: "def", chapter: "Ruby Ch. 9 · Methods", icon: "i-play-circle", verb: "build",
      line: "def add(a, b) = a + b",
      explain: "def defines a method. This one-line form (Ruby 3) returns its expression; longer methods end with end and return their last line." },
    { name: "Keyword Block", short: "bonus:", chapter: "Ruby Ch. 9 · Methods", icon: "i-sliders", verb: "name",
      line: "heal(hero, amount: 25)",
      explain: "Keyword arguments name each value at the call, so heal(hero, amount: 25) can't be misread. They can have defaults too." },
    { name: "Map Block", short: ".map", chapter: "Ruby Ch. 10 · Blocks and Enumerable", icon: "i-funnel", verb: "transform",
      line: "doubled = numbers.map { |n| n * 2 }",
      explain: "map runs the block on every item and collects the answers into a new array. select keeps items; sum adds them up." },
    { name: "Symbol Proc Block", short: "&:even?", chapter: "Ruby Ch. 10 · Blocks and Enumerable", icon: "i-lambda", verb: "shorten",
      line: "evens = numbers.select(&:even?)",
      explain: "&:even? is shorthand for { |n| n.even? }. It works whenever the block just calls one method on each item." },
    { name: "Class Block", short: "class", chapter: "Ruby Ch. 11 · Classes and Objects", icon: "i-layers", verb: "design",
      line: "class Player",
      explain: "class starts a blueprint, and end finishes it. Class names start with a capital letter." },
    { name: "Initialize Block", short: "initialize", chapter: "Ruby Ch. 11 · Classes and Objects", icon: "i-gear", verb: "set up",
      line: "def initialize(name) = @name = name",
      explain: "initialize runs when Player.new builds an object. Variables starting with @ belong to the object and live as long as it does." },
    { name: "Attr Block", short: "attr_reader", chapter: "Ruby Ch. 11 · Classes and Objects", icon: "i-eye", verb: "expose",
      line: "attr_reader :name, :hp",
      explain: "attr_reader writes the methods that let outside code read @name and @hp. attr_accessor lets it change them too." },
    { name: "Inherit Block", short: "<", chapter: "Ruby Ch. 12 · Inheritance and Modules", icon: "i-tree", verb: "inherit",
      line: "class Wizard < Player",
      explain: "< makes Wizard a child of Player: it gets all of Player's methods and can add or change its own." },
    { name: "Include Block", short: "include", chapter: "Ruby Ch. 12 · Inheritance and Modules", icon: "i-cube", verb: "mix in",
      line: "include Comparable",
      explain: "A module is a bundle of methods. include mixes them into a class: Comparable adds <, > and between? once you define <=>." },
    { name: "Rescue Block", short: "rescue", chapter: "Ruby Ch. 13 · Errors and Exceptions", icon: "i-shield-alert", verb: "catch",
      line: "rescue ZeroDivisionError => e",
      explain: "Inside begin … end, rescue catches an exception of that kind; e holds it, and e.message says what went wrong." },
    { name: "File Block", short: "File.write", chapter: "Ruby Ch. 14 · Files and JSON", icon: "i-file", verb: "save",
      line: 'File.write("save.txt", score)',
      explain: "File.write saves text to a file in one line, and File.read reads it back. File.readlines gives an array of lines." },
    { name: "Lambda Block", short: "->", chapter: "Ruby Ch. 15 · Procs, Lambdas and yield", icon: "i-lambda", verb: "package",
      line: "double = ->(x) { x * 2 }",
      explain: "-> makes a lambda: a small function stored in a variable. Call it with double.call(21) or double.(21)." },
    { name: "Require Block", short: "require", chapter: "Ruby Ch. 16 · Gems, Bundler and Real Projects", icon: "i-link", verb: "load",
      line: 'require "json"',
      explain: "require loads a library — from Ruby's standard library, or a gem installed with gem install or Bundler." }
  ];

  var chapters = [
    { title: "First Steps", chapter: "Start here · puts, ruby main.rb, irb", line: 'puts "Hello, world!"',
      content: {
        story: ["Ruby was designed to make programmers happy. Its code reads almost like English, so it's a gentle first language — and it powers big websites through the Ruby on Rails framework (GitHub and Shopify started with it).",
          "puts prints a line. There are no semicolons and no main function: a Ruby file runs from top to bottom. Comments start with #.",
          "Install Ruby from ruby-lang.org (macOS already has a copy; on Windows use RubyInstaller). Save code as main.rb and type ruby main.rb. Or type irb to try Ruby one line at a time."],
        big: "Ruby reads like English: puts prints, a file runs top to bottom, and irb lets you experiment line by line.",
        caption: "ruby main.rb reads the file from the top, and the screen says hello. Tap Play.",
        demo: ["$ ruby main.rb", "puts \"Hello, world!\"", "Hello, world!", "$ irb → try it live"]
      },
      deep: {
        more: ["In Ruby, everything is an object — even numbers. 5.times, \"hi\".upcase and nil.to_a are all method calls.",
          "Run with ruby -w to turn on warnings. They point out unused variables and other likely mistakes; every example in this track runs with no warnings."],
        ex: { code: src(["# My first Ruby program", "puts \"Hello, world!\"", "puts \"I am learning Ruby.\"", "puts 2 + 3", "puts 5.even?"]),
          walk: ["Line 1: a comment, skipped by Ruby.", "Lines 2–3: two lines of text.", "Line 4: Ruby works out 2 + 3: 5.", "Line 5: even 5 is an object with methods: false."] },
        mistake: "Writing Puts with a capital P. Ruby is case-sensitive, and a capitalized name means a constant, so it reports “uninitialized constant Puts.”"
      } },
    { title: "Variables and Types", chapter: "Names · Integer, Float, String, Symbol, true, false, nil", line: "score = 0",
      content: {
        story: ["A variable is a name for a value: score = 0. Names use snake_case (high_score). Ruby works out the type, and .class tells you: 0.class is Integer, 4.99.class is Float, \"Ana\".class is String.",
          "true and false are booleans; nil means “nothing.” In Ruby only nil and false count as false — 0 and empty text both count as true, which surprises people from other languages.",
          "Symbols like :ready are lightweight names used as labels. A name starting with a capital letter, like MAX_LIVES, is a constant."],
        big: "Variables are snake_case names; .class shows the type; only nil and false are false; symbols are light labels.",
        caption: "Five name tags, each tied to a value with its class shown underneath. Tap Play.",
        demo: ["score = 0 → Integer", "price = 4.99 → Float", "name = \"Ana\" → String", "status = :ready → Symbol"]
      },
      deep: {
        more: ["p shows a value the way you'd type it: p \"Ana\" prints \"Ana\" with quotes, p nil prints nil. It's handier than puts for checking.",
          "Variables don't have fixed types: score = \"lots\" is allowed after score = 0. Clear names keep this from causing confusion."],
        ex: { code: src(["score = 0", "price = 4.99", "name = \"Ana\"", "alive = true", "status = :ready", "nickname = nil", "MAX_LIVES = 3", "score += 10", "puts \"#{name} has #{score} points and #{MAX_LIVES} lives\"", "p score.class, price.class, name.class, alive.class, status.class, nickname.class", "zero = 0", "puts \"zero is truthy\" if zero", "p nickname"]),
          walk: ["Lines 1–7: one value of each kind, plus a constant.", "Line 8: score becomes 10.", "Line 9: Ana has 10 points and 3 lives.", "Line 10: Integer, Float, String, TrueClass, Symbol, NilClass.", "Lines 11–12: zero is truthy — only nil and false are false.", "Line 13: p shows nil."] },
        mistake: "Starting a variable name with a capital letter. Score = 5 makes a constant, and changing it later prints “warning: already initialized constant Score.”"
      } },
    { title: "Operators and Math", chapter: "Calculating · + - * / % **, integer division, fdiv, round", line: "average = total.fdiv(count)",
      content: {
        story: ["Ruby does maths with + - * / % and ** (power). Dividing two Integers gives an Integer, dropping the fraction: 7 / 2 is 3. Use 7.0 / 2 or 7.fdiv(2) for 3.5. % is the remainder: 7 % 2 is 1.",
          "Shortcuts change a variable in place: hp -= 30, score *= 2. Ruby has no ++; write lives += 1.",
          "Numbers have handy methods: 3.7.round, 3.2.ceil, -5.abs, 10.clamp(0, 5), 7.even?, and Integer(\"42\") or \"42\".to_i to turn text into numbers."],
        big: "Integer / Integer drops the fraction; fdiv or a Float keeps it; numbers have methods like round, abs and clamp.",
        caption: "7 divided two ways: 3 with Integers, 3.5 with fdiv. Tap Play.",
        demo: ["7 / 2 → 3", "7 % 2 → 1", "7.fdiv(2) → 3.5", "2 ** 10 → 1024"]
      },
      deep: {
        more: ["Integers in Ruby never overflow: 2 ** 100 just works, giving a 31-digit number.",
          "Floats are approximate on every computer: 0.1 + 0.2 is 0.30000000000000004. For money, count whole cents, or use the BigDecimal library."],
        ex: { code: src(["puts 7 / 2", "puts 7 % 2", "puts 7.fdiv(2)", "coins = 10", "players = 4", "puts coins.fdiv(players)", "puts 2**10", "hp = 100", "hp -= 30", "hp += 1", "puts hp", "puts 3.7.round, -5.abs, 15.clamp(0, 10)", "puts 2**100"]),
          walk: ["Line 1: Integer division: 3.", "Line 2: the remainder: 1.", "Line 3: 3.5.", "Lines 4–6: 2.5.", "Line 7: 1024.", "Lines 8–11: 100 − 30 + 1 = 71.", "Line 12: 4, 5 and 10.", "Line 13: 1267650600228229401496703205376 — no overflow."] },
        mistake: "Expecting a decimal from total / count with Integers. 7 / 2 is 3 in Ruby. Use total.fdiv(count)."
      } },
    { title: "Strings", chapter: "Text · interpolation, string methods, format, heredocs", line: 'puts "#{name} has #{coins} coins"',
      content: {
        story: ["Strings can use single or double quotes. Only double quotes understand #{ } (interpolation) and escapes like \\n. \"#{name} has #{coins * 2} coins\" runs the code inside the braces and drops in the answer.",
          "Strings have dozens of methods: upcase, downcase, capitalize, length, reverse, include?, start_with?, split, strip, gsub (replace), and * to repeat: \"ha\" * 3 is \"hahaha\".",
          "format(\"%.2f\", 3.14159) formats numbers like other languages' printf. A heredoc (<<~TEXT … TEXT) holds several lines of text."],
        big: "Double quotes run #{ } inside text; strings have methods for almost everything; format controls number layout.",
        caption: "A sentence with gaps; #{name} and #{coins} slide in. Tap Play.",
        demo: ["\"#{name} has #{coins} coins\"", "name.upcase → \"ANA\"", "\"ha\" * 3 → \"hahaha\"", "format(\"%.2f\", 3.14159) → \"3.14\""]
      },
      deep: {
        more: ["Methods ending in ! usually change the object itself: name.upcase! changes name, while name.upcase returns a new string.",
          "Strings and symbols are different: \"ready\" == :ready is false. Convert with to_sym and to_s."],
        ex: { code: src(["name = \"Ana\"", "coins = 42", "puts \"#{name} has #{coins} coins, or #{coins * 2} doubled\"", "puts 'single quotes keep #{name} as typed'", "puts name.upcase, name.length, name.reverse", "puts \"ha\" * 3", "puts \"gameover\".include?(\"over\")", "puts \"red,green,blue\".split(\",\").join(\" | \")", "puts \"  tidy  \".strip.capitalize", "puts format(\"%.2f and %05d\", 3.14159, 42)", "card = <<~TEXT", "  Player: #{name}", "  Coins: #{coins}", "TEXT", "puts card"]),
          walk: ["Line 3: Ana has 42 coins, or 84 doubled.", "Line 4: single quotes print #{name} as typed.", "Line 5: ANA, 3, anA.", "Line 6: hahaha.", "Line 7: true.", "Line 8: red | green | blue.", "Line 9: Tidy.", "Line 10: 3.14 and 00042.", "Lines 11–15: a heredoc; <<~ removes the indentation."] },
        mistake: "Joining a string and a number with +: \"Score: \" + 5 raises “no implicit conversion of Integer into String.” Use interpolation: \"Score: #{5}\"."
      } },
    { title: "Decisions", chapter: "Choosing · if, elsif, unless, case, ranges, ternary", line: 'puts "Game over" if hp <= 0',
      content: {
        story: ["if, elsif and else choose a path, ending with end. Short checks can go at the end of a line: puts \"Game over\" if hp <= 0. unless means “if not.”",
          "Comparisons use == != < > <= >=, combined with && (and), || (or) and ! (not). Remember: only nil and false are false.",
          "case compares one value against many: when 90.. matches 90 and up, when \"Sat\", \"Sun\" matches either. Like if, a case gives back a value you can store."],
        big: "if/elsif/else and unless choose; modifiers put short checks at the line's end; case matches ranges and lists.",
        caption: "A path forks at hp <= 0: one way says Game over, the other keeps going. Tap Play.",
        demo: ["hp = 0", "puts \"Game over\" if hp <= 0", "Game over", "case score when 80...90 → \"B\""]
      },
      deep: {
        more: ["The ternary operator picks a value in one line: mood = hp > 50 ? \"brave\" : \"careful\".",
          "Ruby 3's pattern matching (case … in) can match the shape of arrays and hashes — the pattern matching shelf shows how."],
        ex: { code: src(["hp = 0", "if hp <= 0", "  puts \"Game over\"", "elsif hp < 20", "  puts \"Careful!\"", "else", "  puts \"Keep going\"", "end", "lives = 2", "puts \"Still alive\" unless lives.zero?", "score = 85", "grade = case score", "        when 90.. then \"A\"", "        when 80...90 then \"B\"", "        else \"Keep practicing\"", "        end", "puts grade", "day = \"Sun\"", "puts(%w[Sat Sun].include?(day) ? \"Weekend\" : \"School day\")"]),
          walk: ["Lines 1–8: hp is 0, so Game over.", "Lines 9–10: unless lives.zero? — Still alive.", "Lines 11–17: 85 is in 80...90: B.", "Lines 18–19: %w[Sat Sun] is a quick array of words; the ternary picks Weekend."] },
        mistake: "Writing else if instead of elsif. Ruby reads it as a new if inside the else, and you'll be missing an end."
      } },
    { title: "Loops and Iterators", chapter: "Repeating · times, each, upto, ranges, while, break, next", line: "scores.each { |score| puts score }",
      content: {
        story: ["Ruby code rarely counts by hand. 3.times { … } repeats three times; 1.upto(5) and 5.downto(1) count; (1..5).each walks a range; scores.each walks an array. The value arrives in the block between pipes: |score|.",
          "Blocks can be written with { } on one line or do … end over several lines.",
          "while and until loop on a condition. break leaves a loop early, and next skips to the next round."],
        big: "Ruby repeats with iterators — times, each, upto — passing each value into a block; while and until loop on conditions.",
        caption: "A counter goes round the track three times, then a cursor walks along an array. Tap Play.",
        demo: ["3.times { |i| … }", "1.upto(5) { |n| … }", "scores.each do |s|", "break / next"]
      },
      deep: {
        more: ["each_with_index gives each item and its position, and step counts in jumps: 0.step(10, 5) gives 0, 5 and 10.",
          "loop do … end repeats forever until a break — handy for menus and games."],
        ex: { code: src(["3.times { |i| puts \"lap #{i}\" }", "lives = 3", "lives -= 1 while lives > 0", "puts \"lives: #{lives}\"", "5.downto(3) { |n| print n, \" \" }", "puts", "%w[apple pear plum].each do |fruit|", "  next if fruit == \"pear\"", "", "  puts fruit", "end", "%w[gold silver].each_with_index { |medal, place| puts \"#{place + 1}: #{medal}\" }", "n = 0", "loop do", "  n += 1", "  break if n == 5", "end", "puts \"n: #{n}\""]),
          walk: ["Line 1: lap 0, lap 1, lap 2.", "Lines 2–4: a while modifier counts lives down: lives: 0.", "Lines 5–6: 5 4 3.", "Lines 7–11: next skips pear: apple, plum.", "Line 12: 1: gold, 2: silver.", "Lines 13–18: loop until break: n: 5."] },
        mistake: "Forgetting the end of a do … end block. Ruby reports “unexpected end-of-input” at the bottom of the file — count your dos and ends."
      } },
    { title: "Arrays", chapter: "Lists · [ ], <<, first, last, include?, sort, join", line: "scores = [10, 20, 30]",
      content: {
        story: ["An Array holds values in order: scores = [10, 20, 30]. Positions count from 0; negative positions count from the end, so scores[-1] is the last.",
          "<< adds to the end, pop removes from the end, and size counts. first, last, include?, sort, reverse, min, max and sum all do what they say.",
          "join glues items into text with a separator, and %w[apple pear plum] is a quick way to write an array of words."],
        big: "Arrays hold ordered values counted from 0 (or from the end with negatives); << adds; most jobs are one method call.",
        caption: "A row of numbered boxes grows by one, then sorts itself into order. Tap Play.",
        demo: ["scores = [30, 10, 20]", "scores << 40", "scores.sort", "[10, 20, 30, 40]"]
      },
      deep: {
        more: ["sort returns a new sorted array; sort! sorts the original in place. Many array methods come in both forms.",
          "Reading past the end gives nil, not an error. fetch(9) raises an error instead, which can catch mistakes sooner."],
        ex: { code: src(["scores = [30, 10, 20]", "scores << 40", "puts \"#{scores.size} scores, first #{scores.first}, last #{scores[-1]}\"", "puts scores.sort.join(\", \")", "puts scores.include?(20)", "puts \"max #{scores.max}, min #{scores.min}, sum #{scores.sum}\"", "last = scores.pop", "puts \"popped #{last}, left #{scores.size}\"", "p scores[10]", "fruits = %w[apple pear plum]", "puts fruits.reverse.inspect"]),
          walk: ["Lines 1–3: 4 scores, first 30, last 40.", "Line 4: 10, 20, 30, 40.", "Line 5: true.", "Line 6: max 40, min 10, sum 100.", "Lines 7–8: popped 40, left 3.", "Line 9: past the end gives nil.", "Lines 10–11: [\"plum\", \"pear\", \"apple\"]."] },
        mistake: "Expecting scores[3] to be the third item. Counting starts at 0, so the third is scores[2]."
      } },
    { title: "Hashes", chapter: "Lookups · { key: value }, symbols, fetch, each, default", line: 'player = { name: "Ana", hp: 100 }',
      content: {
        story: ["A Hash stores values by key: player = { name: \"Ana\", hp: 100 }. Keys written name: are symbols, so read them with player[:name]. Add or change with player[:level] = 2.",
          "A missing key gives nil. fetch(:level, 1) gives a default instead, and key?(:level) checks first.",
          "each gives every key and value: player.each { |key, value| … }. keys, values, size, delete and sort_by cover the rest."],
        big: "Hashes look values up by key (usually symbols); fetch gives defaults; each walks key and value pairs.",
        caption: "A cabinet of labelled drawers; open one by its symbol, or get a default if it's missing. Tap Play.",
        demo: ["player[:name] → \"Ana\"", "player[:level] = 2", "player.fetch(:gold, 0) → 0", "player.each { |k, v| … }"]
      },
      deep: {
        more: ["Hash.new(0) makes a hash whose missing keys read as 0 — perfect for counting: counts[word] += 1.",
          "Keys can be any value. String keys use the arrow: { \"Ana\" => 12 }. JSON data arrives with string keys."],
        ex: { code: src(["player = { name: \"Ana\", hp: 100 }", "player[:level] = 2", "player[:hp] -= 30", "puts \"#{player[:name]}: #{player[:hp]} HP, level #{player[:level]}\"", "p player[:gold]", "puts player.fetch(:gold, 0)", "puts player.key?(:level)", "player.each { |key, value| puts \"#{key} = #{value}\" }", "counts = Hash.new(0)", "%w[ruby is fun ruby].each { |word| counts[word] += 1 }", "p counts", "ages = { \"Leo\" => 11, \"Ana\" => 12 }", "puts ages.sort.map { |name, age| \"#{name} #{age}\" }.join(\", \")"]),
          walk: ["Lines 1–4: Ana: 70 HP, level 2.", "Line 5: a missing key is nil.", "Line 6: fetch's default: 0.", "Line 7: true.", "Line 8: name = Ana, hp = 70, level = 2.", "Lines 9–11: counting words: ruby 2, is 1, fun 1.", "Lines 12–13: sorted by name: Ana 12, Leo 11."] },
        mistake: "Mixing symbol and string keys: player[\"name\"] is nil when the key is :name. Pick one kind and stick to it."
      } },
    { title: "Methods", chapter: "Machines · def, return values, defaults, keyword arguments, ? and !", line: "def add(a, b) = a + b",
      content: {
        story: ["def greet(name) … end defines a method. Its last line is its answer — no return needed, though return still works for leaving early. Short methods fit on one line: def add(a, b) = a + b.",
          "Parameters can have defaults (def greet(name = \"friend\")), and keyword arguments name each value: def heal(hero, amount: 10) is called as heal(ana, amount: 25).",
          "By convention, methods ending in ? answer yes or no (empty?, even?), and methods ending in ! do something stronger, like changing the object itself (upcase!)."],
        big: "def defines methods whose last line is the answer; defaults and keyword arguments make calls clear; ? and ! names carry meaning.",
        caption: "A machine with labelled slots: amount: 25 goes in by name, the healed hero comes out. Tap Play.",
        demo: ["def add(a, b) = a + b", "add(2, 3) → 5", "greet → \"Hi, friend\"", "heal(ana, amount: 25)"]
      },
      deep: {
        more: ["Brackets around arguments are optional: puts add 2, 3 works. Ruby style keeps them when a method takes arguments, and leaves them off when it takes none.",
          "A method can take any number of arguments with *items, and any keywords with **options."],
        ex: { code: src(["def add(a, b) = a + b", "", "def greet(name = \"friend\", mark: \"!\")", "  \"Hi, #{name}#{mark}\"", "end", "", "def safe_divide(a, b)", "  return 0 if b.zero?", "", "  a.fdiv(b)", "end", "", "def adult?(age) = age >= 18", "", "puts add(2, 3)", "puts greet", "puts greet(\"Ana\", mark: \"?\")", "puts safe_divide(9, 0), safe_divide(9, 2)", "puts adult?(12)"]),
          walk: ["Line 1: a one-line method.", "Lines 3–5: a default and a keyword argument; the last line is the answer.", "Lines 7–11: return leaves early when b is 0.", "Line 13: a ? method answers yes or no.", "Line 15: 5.", "Line 16: Hi, friend!", "Line 17: Hi, Ana?", "Line 18: 0, then 4.5.", "Line 19: false."] },
        mistake: "Calling a method before Ruby has read its def. Ruby runs top to bottom, so define methods above the code that uses them."
      } },
    { title: "Blocks and Enumerable", chapter: "Pipelines · map, select, reject, sum, sort_by, &:method", line: "doubled = numbers.map { |n| n * 2 }",
      content: {
        story: ["Ruby's collections share a toolbox called Enumerable. map transforms every item, select keeps the ones that pass, reject drops them, sum adds them, and count, min_by, max_by, sort_by and group_by do just what they say.",
          "These methods chain into pipelines: numbers.select(&:even?).map { |n| n * n }.sum reads left to right like a sentence.",
          "&:even? is shorthand for { |n| n.even? } — use it when the block just calls one method."],
        big: "map, select, reject, sum and sort_by chain into readable pipelines; &:method is the shorthand for simple blocks.",
        caption: "Numbers ride a conveyor: kept if even, squared, then summed. Tap Play.",
        demo: ["(1..6).select(&:even?)", ".map { |n| n * n }", ".sum → 56", "sort_by { |p| -p[:score] }"]
      },
      deep: {
        more: ["reduce (also called inject) combines items step by step: [1, 2, 3].reduce(:*) multiplies them to 6.",
          "each_slice, each_cons, tally, zip and partition are worth a look in the documentation — Ruby has a method for most list chores."],
        ex: { code: src(["numbers = (1..6).to_a", "p numbers.map { |n| n * 2 }", "p numbers.select(&:even?)", "p numbers.reject(&:even?)", "puts numbers.select(&:even?).map { |n| n * n }.sum", "players = [", "  { name: \"Ana\", score: 120 },", "  { name: \"Leo\", score: 150 },", "  { name: \"Mia\", score: 95 }", "]", "puts players.sort_by { |pl| -pl[:score] }.map { |pl| pl[:name] }.join(\", \")", "puts players.max_by { |pl| pl[:score] }[:name]", "p %w[a b a c a].tally", "puts [1, 2, 3, 4].reduce(:*)"]),
          walk: ["Line 2: [2, 4, 6, 8, 10, 12].", "Line 3: [2, 4, 6].", "Line 4: [1, 3, 5].", "Line 5: 4 + 16 + 36 = 56.", "Lines 6–11: highest score first: Leo, Ana, Mia.", "Line 12: Leo.", "Line 13: tally counts each item: a 3 times, b once, c once.", "Line 14: 24."] },
        mistake: "Using each when you want the results. each returns the original array; map returns the new values."
      } },
    { title: "Classes and Objects", chapter: "Blueprints · class, initialize, @variables, attr_accessor, to_s", line: "class Player",
      content: {
        story: ["class Player … end is a blueprint. Player.new(\"Ana\") builds an object and runs initialize. Instance variables start with @: each object keeps its own @name and @hp.",
          "Instance variables are private. attr_reader :name writes a method that reads @name; attr_accessor also writes one that changes it.",
          "Methods inside the class can use the instance variables directly. Define to_s, and puts uses it to print your object nicely."],
        big: "Classes are blueprints; new builds objects; @variables hold each object's data; attr_reader and attr_accessor expose it.",
        caption: "A Player blueprint stamps out two heroes, each with its own @name and @hp. Tap Play.",
        demo: ["class Player … end", "ana = Player.new(\"Ana\")", "ana.hurt(30)", "puts ana → Ana (70 HP)"]
      },
      deep: {
        more: ["self inside a method is the object itself. Writing self.hp = 50 calls the setter that attr_accessor made.",
          "Struct and Data (Ruby 3.2) build simple classes in one line: Point = Data.define(:x, :y)."],
        ex: { code: src(["class Player", "  attr_reader :name, :hp, :level", "", "  def initialize(name, hp = 100)", "    @name = name", "    @hp = hp", "    @level = 1", "  end", "", "  def hurt(damage)", "    @hp = [@hp - damage, 0].max", "  end", "", "  def level_up", "    @level += 1", "  end", "", "  def to_s = \"#{@name} (level #{@level}, #{@hp} HP)\"", "end", "", "ana = Player.new(\"Ana\")", "ana.hurt(30)", "ana.level_up", "puts ana", "leo = Player.new(\"Leo\", 80)", "puts leo", "puts ana.hp + leo.hp"]),
          walk: ["Lines 1–19: the Player blueprint.", "Line 2: reader methods for three instance variables.", "Lines 4–8: initialize runs on Player.new.", "Lines 10–12: health never goes below 0.", "Line 18: to_s tells puts how to show a Player.", "Lines 21–24: Ana (level 2, 70 HP).", "Lines 25–26: Leo (level 1, 80 HP).", "Line 27: readers let outside code see hp: 150."] },
        mistake: "Writing hp = 50 inside a method to change the player. That makes a new local variable; change @hp, or call self.hp = 50 with an accessor."
      } },
    { title: "Inheritance and Modules", chapter: "Families · <, super, modules, include, Comparable", line: "class Wizard < Player",
      content: {
        story: ["class Wizard < Player makes a child class. A Wizard has everything a Player has and can add methods or override them; super calls the parent's version.",
          "A module is a bundle of methods that any class can mix in with include. Ruby's own Comparable is one: define <=> and you get <, >, == and between? for free. Enumerable works the same way with each.",
          "Ruby relies on duck typing: if an object has the method you call, it works, whatever its class. “If it walks like a duck and quacks like a duck…”"],
        big: "< inherits from a parent class, super calls up to it, modules mix methods into any class, and duck typing cares about methods, not classes.",
        caption: "A family tree: Player on top, Wizard below with a spell of its own. Tap Play.",
        demo: ["class Wizard < Player", "super(name)", "include Comparable", "def <=>(other) …"]
      },
      deep: {
        more: ["A class has just one parent but can include many modules. Prefer small modules over deep family trees.",
          "Modules also make namespaces: Game::Player and Shop::Player can live side by side."],
        ex: { code: src(["class Player", "  attr_reader :name", "", "  def initialize(name)", "    @name = name", "  end", "", "  def describe = \"#{name} the adventurer\"", "end", "", "class Wizard < Player", "  def initialize(name, mana)", "    super(name)", "    @mana = mana", "  end", "", "  def describe = \"#{super} with #{@mana} mana\"", "end", "", "class Score", "  include Comparable", "  attr_reader :points", "", "  def initialize(points)", "    @points = points", "  end", "", "  def <=>(other) = points <=> other.points", "end", "", "puts Player.new(\"Ana\").describe", "puts Wizard.new(\"Leo\", 50).describe", "puts Score.new(90) > Score.new(75)", "puts [Score.new(5), Score.new(9), Score.new(1)].max.points"]),
          walk: ["Lines 1–9: the parent class.", "Lines 11–18: Wizard inherits from Player; super calls the parent's version.", "Lines 20–29: Comparable gives Score <, > and max once <=> is defined.", "Line 31: Ana the adventurer.", "Line 32: Leo the adventurer with 50 mana.", "Line 33: true.", "Line 34: 9."] },
        mistake: "Forgetting super in a child's initialize. The parent's setup never runs, so @name stays nil."
      } },
    { title: "Errors and Exceptions", chapter: "Safety nets · raise, begin, rescue, ensure, retry", line: "rescue ZeroDivisionError => e",
      content: {
        story: ["When something goes wrong, Ruby raises an exception: 10 / 0 raises ZeroDivisionError, and Integer(\"abc\") raises ArgumentError. Your own code can raise too: raise ArgumentError, \"price can't be negative\".",
          "begin … rescue … end catches an exception instead of crashing; rescue ZeroDivisionError => e catches just that kind, and e.message explains it. ensure runs afterwards either way.",
          "Inside a method, rescue can go straight in the method body without begin. Make your own exception classes by inheriting from StandardError."],
        big: "raise signals a problem; rescue catches it by kind; ensure always runs; custom errors inherit from StandardError.",
        caption: "A method raises a red flag; the rescue net below catches it. Tap Play.",
        demo: ["raise ArgumentError, \"…\"", "begin … rescue => e", "e.message", "ensure → always runs"]
      },
      deep: {
        more: ["retry inside rescue runs the begin block again — useful for a flaky network call, with a limit on attempts.",
          "Rescue specific errors. A bare rescue catches every StandardError, including typos like a NoMethodError, which hides real bugs."],
        ex: { code: src(["class OutOfCoinsError < StandardError; end", "", "def spend(coins, price)", "  raise ArgumentError, \"price can't be negative\" if price.negative?", "  raise OutOfCoinsError, \"need #{price}, have #{coins}\" if price > coins", "", "  coins - price", "end", "", "[30, 80, -5].each do |price|", "  left = spend(50, price)", "  puts \"left: #{left}\"", "rescue OutOfCoinsError => e", "  puts \"too expensive: #{e.message}\"", "rescue ArgumentError => e", "  puts \"bad price: #{e.message}\"", "ensure", "  puts \"(checked #{price})\"", "end", "", "begin", "  Integer(\"abc\")", "rescue ArgumentError => e", "  puts e.message", "end"]),
          walk: ["Line 1: a custom error class.", "Lines 3–8: two different problems, two different exceptions.", "Lines 10–19: rescue works inside a do … end block too: left: 20; too expensive: need 80, have 50; bad price: price can't be negative — each followed by (checked …) from ensure.", "Lines 21–25: Ruby's own error: invalid value for Integer(): \"abc\"."] },
        mistake: "Rescuing Exception instead of StandardError. Exception also covers things like pressing Ctrl+C, so the program can't be stopped properly."
      } },
    { title: "Files and JSON", chapter: "Saving · File.write, File.read, readlines, JSON", line: 'File.write("save.txt", score)',
      content: {
        story: ["File.write(\"save.txt\", text) saves a whole file in one line, and File.read(\"save.txt\") reads it back. File.readlines gives an array of lines, and File.exist? checks before reading.",
          "To add to a file, open it in append mode: File.open(\"log.txt\", \"a\") { |f| f.puts \"saved\" }. The block closes the file for you, even if something goes wrong.",
          "require \"json\" adds JSON: JSON.generate(hash) (or hash.to_json) makes JSON text, JSON.pretty_generate makes it readable, and JSON.parse(text) turns it back into hashes and arrays."],
        big: "File.write and File.read save and load whole files; blocks close files for you; JSON.generate and JSON.parse convert data.",
        caption: "A save game becomes JSON text, goes into a file, and comes back as a hash. Tap Play.",
        demo: ["JSON.pretty_generate(save)", "File.write(\"save.json\", …)", "JSON.parse(File.read(\"save.json\"))", "loaded[\"name\"] → \"Ana\""]
      },
      deep: {
        more: ["JSON.parse returns string keys. Pass symbolize_names: true to get symbol keys like the ones you wrote.",
          "File.join(\"saves\", \"slot1.json\") builds paths that work on every operating system."],
        ex: { code: src(["require \"json\"", "", "save = { name: \"Ana\", level: 3, items: %w[sword potion] }", "File.write(\"save.json\", JSON.pretty_generate(save))", "", "if File.exist?(\"save.json\")", "  loaded = JSON.parse(File.read(\"save.json\"), symbolize_names: true)", "  puts \"#{loaded[:name]} is level #{loaded[:level]}\"", "  puts \"Items: #{loaded[:items].join(\", \")}\"", "end", "File.write(\"log.txt\", \"started\\n\")", "File.open(\"log.txt\", \"a\") { |f| f.puts \"saved\" }", "puts File.readlines(\"log.txt\", chomp: true).inspect"]),
          walk: ["Lines 3–4: turn the hash into pretty JSON and save it.", "Lines 6–10: read it back with symbol keys: Ana is level 3, Items: sword, potion.", "Lines 11–12: write, then append a line.", "Line 13: [\"started\", \"saved\"] — chomp: true drops each newline."] },
        mistake: "Reading JSON keys as symbols when they came back as strings. Without symbolize_names: true, loaded[:name] is nil — it's loaded[\"name\"]."
      } },
    { title: "Procs, Lambdas and yield", chapter: "Code as values · blocks, yield, ->, Proc, method references", line: "double = ->(x) { x * 2 }",
      content: {
        story: ["Every method can receive a block, and yield runs it. That's how each and times work: def twice; yield; yield; end runs the block two times. block_given? checks whether a block came.",
          "A lambda stores a piece of code in a variable: double = ->(x) { x * 2 }. Call it with double.call(21), double.(21) or double[21]. Lambdas check their number of arguments, like methods.",
          "&block turns a block into a value you can keep or pass on, and method(:puts) turns an existing method into a value too."],
        big: "yield runs a method's block; lambdas store code in variables; & turns blocks into values and back.",
        caption: "A block hops into a method, which yields to it twice. Tap Play.",
        demo: ["def twice = yield + yield", "->(x) { x * 2 }", "double.(21) → 42", "[1, 2].map(&double)"]
      },
      deep: {
        more: ["Lambdas remember the variables around them (they're closures), which makes them perfect for counters and settings.",
          "Procs (Proc.new { … }) are like relaxed lambdas: they don't check argument counts, and return inside one leaves the surrounding method."],
        ex: { code: src(["def twice", "  return \"no block\" unless block_given?", "", "  [yield(1), yield(2)]", "end", "", "p twice { |n| n * 10 }", "p twice", "double = ->(x) { x * 2 }", "puts double.call(21), double.(5)", "p [1, 2, 3].map(&double)", "def make_counter", "  count = 0", "  -> { count += 1 }", "end", "counter = make_counter", "counter.call", "puts counter.call", "shout = :upcase.to_proc", "puts shout.call(\"hi\")"]),
          walk: ["Lines 1–5: yield runs the caller's block, passing a value in.", "Line 7: [10, 20].", "Line 8: \"no block\" — p shows the quotes.", "Lines 9–11: a lambda: 42, 10, then map with &double: [2, 4, 6].", "Lines 12–18: the lambda remembers count: 2.", "Lines 19–20: a symbol as a proc: HI."] },
        mistake: "Calling yield when no block was passed. Ruby raises “no block given (yield)”. Check block_given? first, or require a block."
      } },
    { title: "Gems, Bundler and Real Projects", chapter: "Real projects · require, gems, Bundler, Rails, Data", line: 'require "json"',
      content: {
        story: ["Libraries in Ruby are called gems. Ruby's standard library is loaded with require (require \"json\", require \"set\"); gems are installed with gem install colorize and then required the same way.",
          "Real projects list their gems in a Gemfile, and Bundler installs exactly those versions: bundle install, then bundle exec ruby main.rb. Gemfile.lock records the versions so everyone gets the same ones.",
          "Ruby on Rails is the famous web framework built on these ideas. rails new blog makes a whole working website project, with database, pages and tests — a big but rewarding next step."],
        big: "require loads libraries, gems add more, Bundler keeps a project's gems consistent, and Rails builds whole web apps.",
        caption: "A Gemfile lists the parts; Bundler fetches them; the program requires and uses them. Tap Play.",
        demo: ["Gemfile: gem \"colorize\"", "$ bundle install", "require \"colorize\"", "$ bundle exec ruby main.rb"]
      },
      deep: {
        more: ["RuboCop checks Ruby code against the community style guide, and Minitest or RSpec run tests — both shown on the shelves.",
          "Data.define (Ruby 3.2) makes small value classes in one line: Point = Data.define(:x, :y)."],
        ex: { code: src(["require \"set\"", "require \"json\"", "", "Point = Data.define(:x, :y) do", "  def +(other) = with(x: x + other.x, y: y + other.y)", "end", "", "start = Point.new(x: 1, y: 2)", "step = Point.new(x: 3, y: 4)", "p start + step", "visited = Set.new", "visited << \"Ana\" << \"Leo\" << \"Ana\"", "puts visited.size", "puts({ ruby: RUBY_VERSION >= \"3.0\" }.to_json)"]),
          walk: ["Lines 1–2: standard libraries need only require.", "Lines 4–6: Data.define builds a small value class with x and y.", "Lines 8–10: #<data Point x=4, y=6>.", "Lines 11–13: a Set ignores duplicates: 2.", "Line 14: {\"ruby\":true}."] },
        mistake: "Running a project's code with plain ruby when it uses a Gemfile. Use bundle exec ruby, or gems may load at the wrong versions."
      } }
  ];

  var shelves = [
    { title: "Standard Library Field Guide", chapter: "Beyond the basics · Ruby shelf", line: ["require \"set\"", "Time.new(2025, 3, 1)"],
      content: {
        story: ["Ruby's core classes — String, Integer, Array, Hash, Range — have hundreds of methods, documented at docs.ruby-lang.org. Before writing a loop, check whether a method already does the job.",
          "The standard library adds more with require: set (unique collections), json, time, date, csv, securerandom and more. Gems from rubygems.org add everything else.",
          "In irb, type an object followed by .methods.sort to see what it can do, or press Tab to complete method names."],
        big: "Core classes have hundreds of methods; require adds the standard library; check the docs before building your own.",
        caption: "A workshop wall of labelled toolboxes: String, Array, Hash, Set, Time. Tap Play.",
        demo: ["\"a-b\".tr(\"-\", \" \")", "[3, 1, 2].minmax", "Set.new([1, 1, 2]).size", "Time.new(2025, 3, 1).strftime(\"%A\")"]
      },
      deep: {
        more: ["Time handles dates and times: Time.new(2025, 3, 1), time + 86_400 (one day in seconds), and strftime for formatting.",
          "SecureRandom.hex(16) makes unguessable tokens for passwords and links; rand is fine only for games."],
        ex: { code: src(["require \"set\"", "require \"securerandom\"", "", "puts \"ruby-is-fun\".tr(\"-\", \" \").split.map(&:capitalize).join(\" \")", "p [3, 9, 1].minmax", "p((1..10).each_slice(4).to_a)", "puts Set.new(%w[a b a c]).size", "day = Time.new(2025, 3, 1)", "puts day.strftime(\"%A, %B %-d\")", "puts((day + (7 * 24 * 60 * 60)).strftime(\"%a %-d %b\"))", "puts SecureRandom.hex(16).length", "puts 1234567.digits.sum"]),
          walk: ["Line 4: Ruby Is Fun.", "Line 5: [1, 9].", "Line 6: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10]].", "Line 7: 3.", "Lines 8–9: Saturday, March 1.", "Line 10: a week later: Sat 8 Mar.", "Line 11: 32 hex characters.", "Line 12: digits gives each digit: 28."] },
        mistake: "Writing your own sorting, splitting or date maths. Ruby's methods are tested and fast; yours isn't yet."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · Ruby shelf", line: ["undefined method `upcase' for nil (NoMethodError)", "main.rb:7:in `greet'"],
      content: {
        story: ["The most common Ruby error is NoMethodError on nil: you called a method on something that turned out to be nil — a missing hash key, a variable that was never set, a method that returned nothing.",
          "Read the backtrace from the top: the first line names the error and the file and line; the lines below show which methods called which. Syntax errors point at where Ruby got confused, often the line after a missing end.",
          "p and pp show exactly what a value is. Put binding.irb on a line to pause the program there and poke around with irb. ruby -w turns on warnings that catch typos early."],
        big: "NoMethodError on nil means something was missing; read the backtrace's first line; use p, pp and binding.irb to look inside.",
        caption: "A magnifying glass follows a NoMethodError back to the hash key that was misspelled. Tap Play.",
        demo: ["undefined method 'upcase' for nil", "main.rb:7", "player[:nmae] → nil", "player[:name] ✓"]
      },
      deep: {
        more: ["The safe navigation operator &. calls a method only if the object isn't nil: player[:nick]&.upcase gives nil instead of an error.",
          "dig reaches into nested hashes and arrays safely: data.dig(:player, :stats, :hp)."],
        ex: { code: src(["player = { name: \"Ana\", stats: { hp: 70 } }", "p player[:nick]", "p player[:nick]&.upcase", "puts player.dig(:stats, :hp)", "p player.dig(:stats, :mana)", "begin", "  player[:nick].upcase", "rescue NoMethodError => e", "  puts \"caught: #{e.class}\"", "end", "pp player"]),
          walk: ["Line 2: a missing key is nil.", "Line 3: &. skips the call on nil: nil.", "Line 4: dig reaches inside: 70.", "Line 5: nil, not an error.", "Lines 6–10: calling upcase on nil raises NoMethodError, caught here.", "Line 11: pp prints the whole hash neatly."] },
        mistake: "Adding &. everywhere to hide nils. Sometimes nil is a real bug — find out why the value was missing."
      } },
    { title: "Testing with Minitest", chapter: "Beyond the basics · Ruby shelf", line: ["require \"minitest/autorun\"", "assert_equal \"A\", grade(95)"],
      content: {
        story: ["Ruby ships with Minitest. Write a class that inherits from Minitest::Test, add methods whose names start with test_, and check results with assert_equal(expected, actual) or assert.",
          "require \"minitest/autorun\" runs every test when the file finishes loading: ruby grade_test.rb prints a dot for each passing test and a summary at the end.",
          "Test the tricky edges as well as the usual case: the boundaries between grades, empty lists, zero, nil. RSpec is the other popular Ruby test framework, with an English-like style."],
        big: "Minitest classes with test_ methods and assert_equal check your code; autorun runs them all.",
        caption: "A checklist of cases gets ticked one by one: 95 → A, 85 → B, 40 → C. Tap Play.",
        demo: ["class GradeTest < Minitest::Test", "def test_top_band", "assert_equal \"A\", grade(95)", "3 runs, 5 assertions, 0 failures"]
      },
      deep: {
        more: ["assert_raises(ArgumentError) { grade(-1) } checks that bad input raises the right error.",
          "In Rails projects, bin/rails test runs every test in the app."],
        ex: { code: src(["require \"minitest/autorun\"", "", "def grade(score)", "  raise ArgumentError, \"score must be 0-100\" unless (0..100).cover?(score)", "", "  case score", "  when 90.. then \"A\"", "  when 80...90 then \"B\"", "  else \"C\"", "  end", "end", "", "class GradeTest < Minitest::Test", "  def test_bands", "    assert_equal \"A\", grade(95)", "    assert_equal \"B\", grade(85)", "    assert_equal \"C\", grade(40)", "  end", "", "  def test_boundaries", "    assert_equal \"A\", grade(90)", "    assert_equal \"B\", grade(89)", "  end", "", "  def test_bad_scores", "    assert_raises(ArgumentError) { grade(101) }", "  end", "end"]),
          walk: ["Lines 3–11: the code under test.", "Lines 13–28: three tests in a Minitest class.", "Lines 20–23: test the edges, where bugs hide.", "Lines 25–27: bad input must raise ArgumentError.", "Running the file prints 3 runs, 6 assertions, 0 failures."] },
        mistake: "Swapping expected and actual in assert_equal. It still passes or fails correctly, but failure messages become confusing. Expected goes first."
      } },
    { title: "Pattern Matching", chapter: "Beyond the basics · Ruby shelf", line: ["case data", "in { name: String => name, hp: Integer => hp }"],
      content: {
        story: ["Ruby 3 can match the shape of data. case data in { name: String => name, hp: } checks that data is a hash with a String :name and an :hp, and pulls both values out into variables in one step.",
          "Array patterns work too: in [x, y] matches a two-item array, and in [first, *rest] grabs the first item and the others. _ matches anything you don't care about.",
          "Add guards with if: in { hp: } if hp.zero?. It's perfect for handling JSON from the web, where each message can have a different shape."],
        big: "case … in matches the shape of hashes and arrays and pulls values out at the same time.",
        caption: "Messages of different shapes drop into slots that fit them. Tap Play.",
        demo: ["in { type: \"move\", x:, y: }", "in { type: \"chat\", text: }", "in [first, *rest]", "else → unknown"]
      },
      deep: {
        more: ["=> and in also work on one line: data => { name: } pulls out :name or raises an error if it isn't there, and data in { name: } just answers true or false.",
          "The pin operator ^ matches an existing variable's value instead of making a new variable: in { id: ^wanted }."],
        ex: { code: src(["def describe(message)", "  case message", "  in { type: \"move\", x: Integer => x, y: Integer => y }", "    \"move to #{x}, #{y}\"", "  in { type: \"chat\", text: String => text } if text.empty?", "    \"empty chat\"", "  in { type: \"chat\", text: }", "    \"chat: #{text}\"", "  in [first, *rest]", "    \"list starting #{first}, #{rest.size} more\"", "  else", "    \"unknown\"", "  end", "end", "", "puts describe({ type: \"move\", x: 3, y: 4 })", "puts describe({ type: \"chat\", text: \"\" })", "puts describe({ type: \"chat\", text: \"hi\" })", "puts describe([7, 8, 9])", "puts describe(42)"]),
          walk: ["Lines 3–4: a hash with a type and two Integers: move to 3, 4.", "Lines 5–6: a guard: empty chat.", "Lines 7–8: text: pulls the value out: chat: hi.", "Lines 9–10: list starting 7, 2 more.", "Lines 11–12: anything else: unknown."] },
        mistake: "Forgetting else. If nothing matches, Ruby raises NoMatchingPatternError — add an else for shapes you don't expect."
      } },
    { title: "Regular Expressions", chapter: "Beyond the basics · Ruby shelf", line: ["text =~ /\\d+/", "email.match?(/\\A[^@\\s]+@[^@\\s]+\\z/)"],
      content: {
        story: ["A regular expression (regex) is a pattern for text, written between slashes: /cat/ finds “cat”. \\d means a digit, \\w a word character, \\s a space, + means “one or more”, and ? means “maybe”.",
          "match? answers yes or no, scan finds every match, gsub replaces matches, and match pulls out pieces captured with ( ). Named captures, (?<year>\\d{4}), make the pieces easy to read.",
          "\\A and \\z mark the very start and end of the text — use them when checking that a whole value fits a pattern, like an email or a postcode."],
        big: "Regexes describe text patterns; match? checks, scan finds all, gsub replaces, and captures pull pieces out.",
        caption: "A pattern slides along a sentence, lighting up every number it finds. Tap Play.",
        demo: ["/\\d+/ → one or more digits", "\"a1b22\".scan(/\\d+/) → [\"1\", \"22\"]", "gsub(/\\s+/, \" \")", "(?<year>\\d{4})"]
      },
      deep: {
        more: ["Regexes are powerful but easy to make unreadable. Test them in a tool like rubular.com, and add comments with the x flag for long ones.",
          "Don't use a regex for everything: split, include? and start_with? are clearer for simple jobs."],
        ex: { code: src(["text = \"Order 42 shipped on 2025-03-01, order 7 pending\"", "puts text.match?(/shipped/)", "p text.scan(/\\d+/)", "puts text.gsub(/order/i, \"Box\")", "if (m = text.match(/(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/))", "  puts \"year #{m[:year]}, month #{m[:month]}\"", "end", "valid = ->(email) { email.match?(/\\A[^@\\s]+@[^@\\s]+\\.[a-z]+\\z/i) }", "p valid.(\"ana@example.com\"), valid.(\"not an email\")", "puts \"  too   many   spaces \".strip.gsub(/\\s+/, \" \")"]),
          walk: ["Line 2: true.", "Line 3: every run of digits: [\"42\", \"2025\", \"03\", \"01\", \"7\"].", "Line 4: the i flag ignores case: Box 42 shipped …, Box 7 pending.", "Lines 5–7: named captures: year 2025, month 03.", "Lines 8–9: true, false.", "Line 10: too many spaces."] },
        mistake: "Using ^ and $ to check a whole value. In Ruby they match the start and end of any LINE, so text with a newline can sneak through. Use \\A and \\z."
      } }
  ];

  var glossary = [
    ["&.", "Safe navigation: calls a method only if the object isn't nil."],
    ["&:method", "Shorthand for a block that calls one method on each item."],
    ["@variable", "An instance variable: data belonging to one object."],
    ["array", "An ordered list of values, counted from 0."],
    ["attr_accessor", "Writes methods to read and change an instance variable."],
    ["attr_reader", "Writes a method to read an instance variable."],
    ["backtrace", "The list of method calls shown with an error."],
    ["begin", "Starts a block of code whose errors can be rescued."],
    ["block", "Code between { } or do … end, handed to a method."],
    ["block_given?", "True when the caller passed a block."],
    ["Bundler", "The tool that installs a project's gems from its Gemfile."],
    ["case", "Compares a value against several when clauses."],
    ["case/in", "Pattern matching on the shape of data."],
    ["class", "A blueprint for objects."],
    ["closure", "A block or lambda that remembers variables from where it was made."],
    ["Comparable", "A module that adds <, > and friends once you define <=>."],
    ["constant", "A name starting with a capital letter, meant never to change."],
    ["Data", "Ruby 3.2's quick way to define small value classes."],
    ["def", "Defines a method."],
    ["dig", "Reaches safely into nested hashes and arrays."],
    ["duck typing", "Caring what methods an object has, not what class it is."],
    ["each", "Hands every item of a collection to a block."],
    ["elsif", "Tries another test after an if."],
    ["end", "Closes a class, method, block or if."],
    ["ensure", "Code that runs after begin/rescue, either way."],
    ["Enumerable", "The shared toolbox of collection methods like map and select."],
    ["exception", "An object raised to signal that something went wrong."],
    ["false", "One of only two values Ruby treats as false."],
    ["fdiv", "Divides and gives a Float answer."],
    ["fetch", "Looks up a key, with a default or an error if it's missing."],
    ["Float", "A number with a decimal point."],
    ["gem", "A packaged Ruby library."],
    ["Gemfile", "The list of gems a project needs."],
    ["gsub", "Replaces every match in a string."],
    ["Hash", "A collection of key-value pairs."],
    ["heredoc", "A multi-line string written <<~NAME … NAME."],
    ["include", "Mixes a module's methods into a class."],
    ["initialize", "The method that runs when new builds an object."],
    ["Integer", "A whole number."],
    ["interpolation", "#{ } inside double quotes, filling in a value."],
    ["irb", "Interactive Ruby: try code one line at a time."],
    ["lambda", "A small function stored in a variable: ->(x) { x * 2 }."],
    ["map", "Transforms every item into a new array."],
    ["method", "A named action an object can perform."],
    ["module", "A bundle of methods to mix into classes, or a namespace."],
    ["Minitest", "Ruby's built-in testing library."],
    ["new", "Builds an object from a class."],
    ["next", "Skips to the next round of a loop or block."],
    ["nil", "The value meaning nothing."],
    ["NoMethodError", "Raised when an object doesn't have the method called."],
    ["object", "A value built from a class; in Ruby, everything is one."],
    ["p", "Prints a value the way you'd type it, quotes and all."],
    ["pattern matching", "Checking a value's shape and pulling parts out with case/in."],
    ["pp", "Pretty-prints big values across several lines."],
    ["Proc", "A stored block of code, more relaxed than a lambda."],
    ["puts", "Prints a line."],
    ["Rails", "Ruby on Rails, a framework for building web apps."],
    ["raise", "Signals an exception."],
    ["range", "A run of values like 1..5 (ends included) or 1...5 (end left out)."],
    ["reduce", "Combines items step by step into one value."],
    ["regex", "A pattern for matching text, written between slashes."],
    ["require", "Loads a library."],
    ["rescue", "Catches an exception."],
    ["retry", "Runs a begin block again after rescuing."],
    ["return", "Leaves a method early with a value."],
    ["RuboCop", "A tool that checks Ruby code against the style guide."],
    ["select", "Keeps the items a block says yes to."],
    ["self", "The current object."],
    ["Set", "A collection that ignores duplicates."],
    ["snake_case", "Lower-case names joined by underscores, the Ruby style for variables and methods."],
    ["StandardError", "The parent class for everyday errors; inherit from it for your own."],
    ["String", "Text."],
    ["super", "Calls the parent class's version of a method."],
    ["symbol", "A lightweight name like :ready, often used as a hash key."],
    ["times", "Repeats a block a number of times."],
    ["to_s", "Turns an object into text; puts uses it."],
    ["true", "The boolean yes."],
    ["unless", "Runs code when a condition is false."],
    ["until", "Loops while a condition is false."],
    ["upto", "Counts up from one number to another."],
    ["while", "Loops while a condition is true."],
    ["yield", "Runs the block passed to a method."],
    ["? method", "A method that answers yes or no, like empty?."],
    ["! method", "A method that does something stronger, often changing the object."]
  ];

  var field = [
    { name: "puts / p / pp", head: "Kernel", what: "Print text, print a value as code, or pretty-print.", ex: "p [1, \"a\", nil]" },
    { name: "format", head: "Kernel", what: "Format numbers and text with % codes.", ex: "format(\"%.2f\", 3.14159)" },
    { name: "String methods", head: "String", what: "upcase, length, include?, split, strip, gsub, *.", ex: "\"a,b\".split(\",\")" },
    { name: "Integer / Float methods", head: "Numeric", what: "even?, round, abs, clamp, fdiv, digits.", ex: "10.clamp(0, 5)" },
    { name: "Array methods", head: "Array", what: "<<, first, last, include?, sort, sum, join.", ex: "[3, 1].sort.join(\"-\")" },
    { name: "Hash methods", head: "Hash", what: "fetch, key?, each, keys, values, dig.", ex: "h.fetch(:gold, 0)" },
    { name: "Enumerable", head: "Enumerable", what: "map, select, reject, sort_by, max_by, tally, reduce.", ex: "nums.select(&:even?)" },
    { name: "Range", head: "Range", what: "1..5 includes 5; 1...5 doesn't; each, to_a, cover?.", ex: "(1..10).step(3).to_a" },
    { name: "File", head: "File", what: "write, read, readlines, exist?, open with a block.", ex: "File.write(\"a.txt\", \"hi\")" },
    { name: "JSON", head: "require \"json\"", what: "generate, pretty_generate, parse, to_json.", ex: "JSON.parse(text, symbolize_names: true)" },
    { name: "Set", head: "require \"set\"", what: "A collection without duplicates.", ex: "Set.new([1, 1, 2]).size" },
    { name: "Time", head: "Time", what: "Dates and times, with strftime formatting.", ex: "Time.now.strftime(\"%H:%M\")" },
    { name: "SecureRandom", head: "require \"securerandom\"", what: "Unguessable random values.", ex: "SecureRandom.hex(16)" },
    { name: "Comparable", head: "module", what: "Define <=> and get <, >, between?, clamp.", ex: "include Comparable" },
    { name: "Minitest", head: "require \"minitest/autorun\"", what: "Write and run tests with assert_equal.", ex: "assert_equal 5, add(2, 3)" }
  ];

  var cheats = [
    { title: "Program Card", body: "A Ruby file runs top to bottom.", code: src(["# main.rb", "puts \"Hello\"", "name = \"Ana\"", "puts \"Hi, #{name}!\""]) },
    { title: "Values Card", body: "Everyday values.", code: src(["n = 42", "x = 3.14", "name = \"Ana\"", "ok = true", "nothing = nil", "status = :ready", "MAX = 10", "text = n.to_s", "back = \"7\".to_i"]) },
    { title: "Decisions Card", body: "if, unless, case and ?:.", code: src(["if x > 0", "  puts \"positive\"", "elsif x.zero?", "  puts \"zero\"", "else", "  puts \"negative\"", "end", "puts \"ok\" unless done", "size = case n", "       when 0..10 then \"small\"", "       else \"big\"", "       end", "mood = hp > 50 ? \"brave\" : \"careful\""]) },
    { title: "Loops Card", body: "Iterators first.", code: src(["3.times { |i| puts i }", "1.upto(5) { |n| puts n }", "items.each do |item|", "  puts item", "end", "items.each_with_index { |item, i| puts \"#{i}: #{item}\" }", "lives -= 1 while lives > 0"]) },
    { title: "Collections Card", body: "Arrays and hashes.", code: src(["a = [1, 2, 3]", "a << 4", "a.first", "a.include?(2)", "h = { name: \"Ana\", hp: 100 }", "h[:level] = 2", "h.fetch(:gold, 0)", "h.each { |k, v| puts \"#{k}: #{v}\" }"]) },
    { title: "Enumerable Card", body: "Pipelines over collections.", code: src(["nums.map { |n| n * 2 }", "nums.select(&:even?)", "nums.reject(&:zero?)", "nums.sum", "players.sort_by { |p| -p[:score] }", "words.tally"]) },
    { title: "Classes Card", body: "A small class with the usual parts.", code: src(["class Box", "  attr_reader :size", "", "  def initialize(size = 1)", "    @size = size", "  end", "", "  def grow", "    @size += 1", "  end", "", "  def to_s = \"Box #{@size}\"", "end"]) },
    { title: "Errors Card", body: "raise, rescue, ensure.", code: src(["begin", "  value = Integer(text)", "rescue ArgumentError => e", "  puts \"bad number: #{e.message}\"", "ensure", "  puts \"done\"", "end", "raise ArgumentError, \"too big\" if value > 100"]) }
  ];

  function stars(n) { return new Array(n + 1).join("*"); }
  function padR(s, w) { while (s.length < w) s += " "; return s; }
  function padL(s, w) { s = String(s); while (s.length < w) s = " " + s; return s; }
  function M(decls, body) { return decls.length ? decls.concat([""], body) : body; }

  var projects = [
    { name: "Rocket Countdown", about: "downto counts the rocket down to blast off.",
      vars: [{ key: "start", val: 5, min: 1, max: 12 }],
      code: function (v) { return M([], ["start = " + v.start, "start.downto(1) { |i| puts \"#{i}...\" }", "puts \"Blast off!\""]); },
      run: function (v) { var o = []; for (var i = v.start; i > 0; i--) o.push(i + "..."); o.push("Blast off!"); return o; },
      explain: "downto counts from your number down to 1, handing each one to the block as i." },
    { name: "Star Steps", about: "\"*\" * 3 makes ***, so each row is easy.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return M([], ["rows = " + v.rows, "1.upto(rows) { |r| puts \"*\" * r }"]); },
      run: function (v) { var o = []; for (var r = 1; r <= v.rows; r++) o.push(stars(r)); return o; },
      explain: "Multiplying a string repeats it, so \"*\" * r is a row r stars long." },
    { name: "Coin Bank", about: "Every coin adds to the total.",
      vars: [{ key: "coins", val: 5, min: 1, max: 10 }, { key: "each", val: 25, min: 1, max: 50 }],
      code: function (v) { return M([], ["coins = " + v.coins, "each = " + v.each, "total = 0", "1.upto(coins) do |c|", "  total += each", "  puts \"Coin #{c}: total #{total}\"", "end"]); },
      run: function (v) { var o = [], t = 0; for (var c = 1; c <= v.coins; c++) { t += v.each; o.push("Coin " + c + ": total " + t); } return o; },
      explain: "The block can change total, a variable from outside it, so the running total grows each round." },
    { name: "Score Doubler", about: "times repeats the doubling.",
      vars: [{ key: "score", val: 3, min: 1, max: 50 }, { key: "rounds", val: 5, min: 1, max: 10 }],
      code: function (v) { return M([], ["score = " + v.score, "rounds = " + v.rounds, "rounds.times do |r|", "  score *= 2", "  puts \"Round #{r + 1}: #{score}\"", "end"]); },
      run: function (v) { var o = [], s = v.score; for (var r = 1; r <= v.rounds; r++) { s *= 2; o.push("Round " + r + ": " + s); } return o; },
      explain: "times counts r from 0, so r + 1 gives a friendly round number. *= 2 doubles the score." },
    { name: "Times Table", about: "A range walks through the table.",
      vars: [{ key: "num", val: 7, min: 1, max: 12 }, { key: "upto", val: 5, min: 1, max: 12 }],
      code: function (v) { return M([], ["num = " + v.num, "upto = " + v.upto, "(1..upto).each { |i| puts \"#{num} x #{i} = #{num * i}\" }"]); },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(v.num + " x " + i + " = " + v.num * i); return o; },
      explain: "1..upto includes both ends; #{num * i} works out the product inside the text." },
    { name: "Temperature Converter", about: "Celsius to Fahrenheit with one decimal place.",
      vars: [{ key: "celsius", val: 20, min: -40, max: 100 }],
      code: function (v) { return M([], ["celsius = " + v.celsius, "fahrenheit = (celsius * 9.0 / 5) + 32", "puts format(\"%d C is %.1f F\", celsius, fahrenheit)"]); },
      run: function (v) { return [v.celsius + " C is " + (v.celsius * 9 / 5 + 32).toFixed(1) + " F"]; },
      explain: "9.0 is a Float, so the division keeps its decimals. format's %.1f shows one decimal place." },
    { name: "Tip Calculator", about: "A tip and total for a bill, in whole dollars.",
      vars: [{ key: "bill", val: 40, min: 1, max: 500 }, { key: "percent", val: 15, min: 0, max: 30 }],
      code: function (v) { return M([], ["bill = " + v.bill, "percent = " + v.percent, "tip = bill * percent / 100", "puts \"Bill: $#{bill}\"", "puts \"Tip: $#{tip}\"", "puts \"Total: $#{bill + tip}\""]); },
      run: function (v) { var tip = Math.floor(v.bill * v.percent / 100); return ["Bill: $" + v.bill, "Tip: $" + tip, "Total: $" + (v.bill + tip)]; },
      explain: "Integer division drops the cents, so a $40 bill at 15% tips $6." },
    { name: "FizzBuzz", about: "Pattern matching on two remainders.",
      vars: [{ key: "limit", val: 15, min: 1, max: 30 }],
      code: function (v) { return M([], ["limit = " + v.limit, "1.upto(limit) do |n|", "  word = case [n % 3, n % 5]", "         in [0, 0] then \"FizzBuzz\"", "         in [0, _] then \"Fizz\"", "         in [_, 0] then \"Buzz\"", "         else n", "         end", "  puts word", "end"]); },
      run: function (v) { var o = []; for (var n = 1; n <= v.limit; n++) o.push(n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : String(n)); return o; },
      explain: "case … in matches the pair of remainders: [0, 0] means divisible by both, and _ matches anything." },
    { name: "Score Stats", about: "Highest, lowest and average of an array.",
      vars: [{ key: "first", val: 72, min: 0, max: 100 }, { key: "second", val: 95, min: 0, max: 100 }, { key: "third", val: 64, min: 0, max: 100 }],
      code: function (v) { return M([], ["first = " + v.first, "second = " + v.second, "third = " + v.third, "scores = [first, second, third]", "puts \"Scores: #{scores.join(\", \")}\"", "puts \"Highest: #{scores.max}\"", "puts \"Lowest: #{scores.min}\"", "puts format(\"Average: %.1f\", scores.sum.fdiv(scores.size))"]); },
      run: function (v) { var a = [v.first, v.second, v.third]; return ["Scores: " + a.join(", "), "Highest: " + Math.max.apply(null, a), "Lowest: " + Math.min.apply(null, a), "Average: " + ((v.first + v.second + v.third) / 3).toFixed(1)]; },
      explain: "Arrays know max, min, sum and size; fdiv keeps the average's decimals." },
    { name: "Shopping Cart", about: "A list of hashes adds up a receipt.",
      vars: [{ key: "apples", val: 3, min: 0, max: 10 }, { key: "pears", val: 2, min: 0, max: 10 }],
      code: function (v) { return M([], ["apples = " + v.apples, "pears = " + v.pears, "cart = [", "  { name: \"Apple\", price: 50, qty: apples },", "  { name: \"Pear\", price: 75, qty: pears },", "  { name: \"Bread\", price: 250, qty: 1 }", "]", "total = 0", "cart.each do |item|", "  cost = item[:price] * item[:qty]", "  total += cost", "  puts format(\"%-6s x%d %5d\", item[:name], item[:qty], cost)", "end", "puts format(\"Total: $%.2f\", total / 100.0)"]); },
      run: function (v) {
        var cart = [["Apple", 50, v.apples], ["Pear", 75, v.pears], ["Bread", 250, 1]], o = [], t = 0;
        cart.forEach(function (it) { var c = it[1] * it[2]; t += c; o.push(padR(it[0], 6) + " x" + it[2] + " " + padL(c, 5)); });
        o.push("Total: $" + Math.floor(t / 100) + "." + (t % 100 < 10 ? "0" : "") + (t % 100));
        return o;
      },
      explain: "Prices are in cents to keep the maths exact. %-6s pads the name, %5d lines up the cost, and %.2f shows dollars and cents." },
    { name: "Class Vote", about: "A hash counts votes, printed in name order.",
      vars: [{ key: "ana", val: 3, min: 0, max: 20 }, { key: "leo", val: 5, min: 0, max: 20 }],
      code: function (v) { return M([], ["ana = " + v.ana, "leo = " + v.leo, "votes = { \"Mia\" => 4, \"Ana\" => ana, \"Leo\" => leo }", "votes[\"Ana\"] += 2", "votes.sort.each { |name, count| puts \"#{name}: #{count}\" }", "puts \"Total votes: #{votes.values.sum}\""]); },
      run: function (v) { return ["Ana: " + (v.ana + 2), "Leo: " + v.leo, "Mia: 4", "Total votes: " + (v.ana + 2 + v.leo + 4)]; },
      explain: "Ana gets two late votes with +=. sort turns the hash into name-ordered pairs before printing." },
    { name: "Hero Healing", about: "A method heals the hero, capped at 100.",
      vars: [{ key: "hp", val: 40, min: 1, max: 99 }, { key: "potion", val: 25, min: 5, max: 50 }],
      code: function (v) { return M(["class Hero", "  attr_reader :name, :hp", "", "  def initialize(name, hp)", "    @name = name", "    @hp = hp", "  end", "", "  def heal(amount)", "    @hp = [@hp + amount, 100].min", "  end", "end"], ["hp = " + v.hp, "potion = " + v.potion, "hero = Hero.new(\"Ana\", hp)", "while hero.hp < 100", "  hero.heal(potion)", "  puts \"#{hero.name} drinks a potion: #{hero.hp} HP\"", "end"]); },
      run: function (v) { var o = [], hp = v.hp; while (hp < 100) { hp = Math.min(hp + v.potion, 100); o.push("Ana drinks a potion: " + hp + " HP"); } return o; },
      explain: "heal changes @hp, the hero's own health; [.., 100].min caps it. attr_reader lets the loop read hero.hp." },
    { name: "Shape Areas", about: "Duck typing: two classes, one loop, no shared parent needed.",
      vars: [{ key: "w", val: 4, min: 1, max: 20 }, { key: "h", val: 3, min: 1, max: 20 }, { key: "side", val: 5, min: 1, max: 20 }],
      code: function (v) { return M(["Rect = Data.define(:w, :h) do", "  def area = w * h", "  def name = \"rectangle\"", "end", "", "Square = Data.define(:side) do", "  def area = side * side", "  def name = \"square\"", "end"], ["w = " + v.w, "h = " + v.h, "side = " + v.side, "shapes = [Rect.new(w:, h:), Square.new(side:)]", "shapes.each { |shape| puts \"#{shape.name}: #{shape.area}\" }", "puts \"Total area: #{shapes.sum(&:area)}\""]); },
      run: function (v) { var a = v.w * v.h, b = v.side * v.side; return ["rectangle: " + a, "square: " + b, "Total area: " + (a + b)]; },
      explain: "Rect and Square share no parent, but both answer area and name — that's enough for Ruby. Rect.new(w:, h:) passes the variables with matching names." },
    { name: "Cookie Sharing", about: "A method raises an error instead of dividing by zero.",
      vars: [{ key: "cookies", val: 12, min: 0, max: 50 }, { key: "friends", val: 4, min: 0, max: 10 }],
      code: function (v) { return M(["def share(cookies, friends)", "  raise ArgumentError, \"no friends to share with\" if friends.zero?", "", "  cookies.divmod(friends)", "end"], ["cookies = " + v.cookies, "friends = " + v.friends, "begin", "  each, left = share(cookies, friends)", "  puts \"Each friend gets #{each}\"", "  puts \"Left over: #{left}\"", "rescue ArgumentError => e", "  puts \"Error: #{e.message}\"", "end"]); },
      run: function (v) { if (v.friends === 0) return ["Error: no friends to share with"]; return ["Each friend gets " + Math.floor(v.cookies / v.friends), "Left over: " + v.cookies % v.friends]; },
      explain: "Set friends to 0: share raises an error and rescue handles it. divmod gives both answers at once." },
    { name: "Grade Bands", about: "case with ranges turns scores into grades.",
      vars: [{ key: "ana", val: 92, min: 0, max: 100 }, { key: "leo", val: 78, min: 0, max: 100 }, { key: "mia", val: 85, min: 0, max: 100 }],
      code: function (v) { return M(["def grade(score)", "  case score", "  when 90.. then \"A\"", "  when 80...90 then \"B\"", "  when 70...80 then \"C\"", "  else \"Keep going\"", "  end", "end"], ["ana = " + v.ana, "leo = " + v.leo, "mia = " + v.mia, "{ \"Ana\" => ana, \"Leo\" => leo, \"Mia\" => mia }.each do |name, score|", "  puts \"#{name}: #{score} is #{grade(score)}\"", "end"]); },
      run: function (v) {
        function g(s) { return s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : "Keep going"; }
        return [["Ana", v.ana], ["Leo", v.leo], ["Mia", v.mia]].map(function (r) { return r[0] + ": " + r[1] + " is " + g(r[1]); });
      },
      explain: "90.. means 90 and up; 80...90 means 80 up to (not including) 90. case checks each when in order." },
    { name: "Even Squares", about: "select and map make a pipeline.",
      vars: [{ key: "n", val: 6, min: 2, max: 20 }],
      code: function (v) { return M([], ["n = " + v.n, "squares = (1..n).select(&:even?).map { |x| x * x }", "puts \"Evens squared: #{squares.join(\" \")}\"", "puts \"Sum: #{squares.sum}\""]); },
      run: function (v) { var s = []; for (var x = 2; x <= v.n; x += 2) s.push(x * x); return ["Evens squared: " + s.join(" "), "Sum: " + s.reduce(function (a, b) { return a + b; }, 0)]; },
      explain: "select(&:even?) keeps the even numbers, and map squares them — one readable line." },
    { name: "Name Tags", about: "String methods make name tags.",
      vars: [{ key: "keep", val: 3, min: 1, max: 8 }],
      code: function (v) { return M([], ["keep = " + v.keep, "%w[Ana Leonardo Mia].each do |name|", "  puts \"#{name.upcase.ljust(10, \".\")} #{name.length} #{name[0, keep]}\"", "end"]); },
      run: function (v) { return ["Ana", "Leonardo", "Mia"].map(function (n) { var t = n.toUpperCase(); while (t.length < 10) t += "."; return t + " " + n.length + " " + n.substr(0, v.keep); }); },
      explain: "ljust pads the tag to 10 characters with dots; name[0, keep] takes keep letters starting at position 0." },
    { name: "Number Guesser", about: "Halving the range finds any number from 1 to 100 in 7 guesses or fewer.",
      vars: [{ key: "secret", val: 37, min: 1, max: 100 }],
      code: function (v) { return M([], ["secret = " + v.secret, "low = 1", "high = 100", "tries = 0", "loop do", "  tries += 1", "  guess = (low + high) / 2", "  if guess == secret", "    puts \"Got it: #{guess} in #{tries} tries\"", "    break", "  elsif guess < secret", "    puts \"#{guess} is too low\"", "    low = guess + 1", "  else", "    puts \"#{guess} is too high\"", "    high = guess - 1", "  end", "end"]); },
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
    { line: 'puts "{w}"', why: "puts prints a line." },
    { line: "puts {v}", why: "puts can print any value." },
    { line: 'puts "{w}: #{{v}}"', why: "#{ } fills a value into double-quoted text." },
    { line: 'print {v}, "\\n"', why: "print doesn't add a new line by itself." },
    { line: "{v} = {n}", why: "A name now points at an Integer." },
    { line: "{v} = {dec}", why: "A decimal makes a Float." },
    { line: "{v} = {b}", why: "true or false." },
    { line: '{sv} = "{w}"', why: "Text in quotes makes a String." },
    { line: "{cv} = {n}", why: "A capital name is a constant." },
    { line: "{v} = nil", why: "nil means nothing." },
    { line: "{v} += {n}", why: "+= adds onto the current value." },
    { line: "{v} -= {d}", why: "-= takes away from the current value." },
    { line: "{v} *= {d}", why: "*= multiplies the current value." },
    { line: "{v} = {u} % {d}", why: "% gives the remainder." },
    { line: "{v} = {u}.fdiv({d})", why: "fdiv keeps the decimals." },
    { line: "{v} = {u}**{d}", why: "** raises to a power." },
    { line: "{v} = {u}.clamp(0, {n})", why: "clamp keeps a number inside a range." },
    { line: '{sv} = "{w}".upcase', why: "upcase returns capitals." },
    { line: '{sv} = "{w}" * {d}', why: "* repeats a string." },
    { line: "puts {sv}.length", why: "length counts characters." },
    { line: 'puts "#{{sv}} has #{{v}}"', why: "Interpolate several values." },
    { line: 'puts "{w}" if {v} > {n}', why: "An if modifier at the end of the line." },
    { line: "if {v} == {n} then {u} = 0 end", why: "if … then … end on one line." },
    { line: "elsif {v} < {d}", why: "elsif tries another test." },
    { line: '{sv} = {v} > {n} ? "{w}" : "none"', why: "?: picks one of two values." },
    { line: 'puts "{w}" unless {v}.zero?', why: "unless means if not." },
    { line: "{n}.times { |i| {v} += i }", why: "times repeats a block." },
    { line: "1.upto({n}) { |i| {v} += i }", why: "upto counts up." },
    { line: "{v} -= 1 while {v} > 0", why: "A while modifier repeats the line." },
    { line: "{arr}.each { |x| {v} += x }", why: "each visits every item." },
    { line: "{arr} = [{n}, {n2}, {n3}]", why: "Square brackets make an Array." },
    { line: "{arr} << {n}", why: "<< adds to the end." },
    { line: "puts {arr}.first", why: "first is position 0." },
    { line: "{v} = {arr}.sum", why: "sum adds up an array." },
    { line: "{arr} = {arr}.sort.reverse", why: "sort, then reverse for biggest first." },
    { line: '{m} = { "{w}" => {n} }', why: "=> links a key to a value." },
    { line: '{m}["{w}"] = {n}', why: "Set a value by key." },
    { line: '{v} = {m}.fetch("{w}", {n})', why: "fetch gives a default for a missing key." },
    { line: '{m}.each { |key, value| puts "#{key}: #{value}" }', why: "each gives key and value." },
    { line: '{m}.delete("{w}")', why: "delete removes a key." },
    { line: "def {f}({v}) = {v} * {d}", why: "A one-line method." },
    { line: "def {f}({v}, bonus: {d})", why: "A keyword argument with a default." },
    { line: "{f}({n})", why: "Call a method." },
    { line: "{v} = {f}({u})", why: "Store a method's answer." },
    { line: "{arr}.map { |x| x * {d} }", why: "map transforms every item." },
    { line: "{arr}.select { |x| x > {n} }", why: "select keeps some items." },
    { line: "{v} = {arr}.reduce({n}) { |sum, x| sum + x }", why: "reduce combines items step by step." },
    { line: "{arr}.each_with_index { |x, i| {v} += x * i }", why: "each_with_index adds the position." },
    { line: "class {c} < {k}", why: "< inherits from a parent class." },
    { line: "attr_accessor :{v}, :{u}", why: "Reader and writer methods in one line." },
    { line: "def initialize({sv}, {v} = {n})", why: "initialize runs on new." },
    { line: "@{v} += {d}", why: "@ variables belong to the object." },
    { line: "{o} = {c}.new", why: "new builds an object." },
    { line: "{o}.{v} = {n}", why: "Call a writer method." },
    { line: "module {c}Helpers", why: "A module bundles methods." },
    { line: "include {c}Helpers", why: "include mixes a module into a class." },
    { line: 'raise ArgumentError, "{w}" if {v}.negative?', why: "raise signals a problem." },
    { line: "rescue {c}Error => e", why: "rescue catches one kind of error." },
    { line: 'File.write("{w}.txt", {v})', why: "Save a whole file in one line." },
    { line: '{sv} = File.read("{w}.txt")', why: "Read a whole file in one line." },
    { line: "{sv} = JSON.generate({m})", why: "Hash to JSON text." },
    { line: "{m} = JSON.parse({sv})", why: "JSON text to a hash." },
    { line: "{f} = ->(x) { x * {d} }", why: "A lambda stores code in a variable." },
    { line: 'case {v} when 0..{n} then puts "{w}" end', why: "case with a range." },
    { line: '{sv} = {sv}.gsub("{w}", "{L}")', why: "gsub replaces every match." }
  ];
  var themes = [
    { name: "Puts & Talk", t: [0, 1, 2, 3, 20] },
    { name: "Values", t: [4, 5, 6, 7, 8] },
    { name: "Nil & Constants", t: [8, 9, 4, 7, 6] },
    { name: "Math Moves", t: [10, 11, 12, 13, 15] },
    { name: "Number Tools", t: [14, 16, 13, 33, 4] },
    { name: "Strings", t: [17, 18, 19, 20, 64] },
    { name: "Decisions", t: [21, 22, 23, 24, 25] },
    { name: "Case & Ranges", t: [63, 24, 21, 22, 23] },
    { name: "Loops", t: [26, 27, 28, 29, 10] },
    { name: "Arrays", t: [30, 31, 32, 33, 34] },
    { name: "Hashes", t: [35, 36, 37, 38, 39] },
    { name: "Methods", t: [40, 41, 42, 43, 62] },
    { name: "Blocks", t: [44, 45, 46, 47, 29] },
    { name: "Classes", t: [48, 49, 50, 51, 52] },
    { name: "Objects", t: [52, 53, 51, 49, 50] },
    { name: "Modules", t: [54, 55, 48, 49, 40] },
    { name: "Errors", t: [56, 57, 21, 25, 42] },
    { name: "Files & JSON", t: [58, 59, 60, 61, 35] },
    { name: "Lambdas", t: [62, 44, 45, 40, 43] },
    { name: "Ruby Masters", t: [37, 47, 50, 57, 63] }
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
    sandboxNote: "Thirty everyday Ruby lines, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your Ruby progress is saved separately from every other track.",
    sourcesHTML: 'Ruby facts and syntax follow the official <a href="https://docs.ruby-lang.org/en/3.3/">Ruby 3.3 documentation</a> and the community <a href="https://rubystyle.guide/">Ruby Style Guide</a>. Every explanation is written in Code Block’s own words, and every practice program is run by the real Ruby interpreter, with warnings on, before it ships.'
  };
});
