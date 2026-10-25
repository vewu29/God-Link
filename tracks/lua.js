"use strict";
/* ================= LUA — a Code Block track =================
   Written fresh for Code Block in plain words. Facts and syntax follow
   the Lua 5.4 Reference Manual (lua.org/manual/5.4) and Programming in
   Lua. Every PC project and library example is run by the real Lua 5.4
   interpreter in tests/content, and a project's output must match the
   app. Every drill and Vault line is compiled (not run) by Lua itself. */
cbRegisterTrack("lua", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Hello Block", short: "print", chapter: "Lua Ch. 1 · First Steps", icon: "i-say", verb: "say",
      line: 'print("Hello, world!")',
      explain: "print shows its values and moves to a new line. Lua needs no semicolons and no main function: a file runs from top to bottom." },
    { name: "Local Block", short: "local", chapter: "Lua Ch. 2 · Variables and Types", icon: "i-tag", verb: "store",
      line: "local score = 0",
      explain: "local makes a variable that belongs to this part of the code. Always use local — without it, the variable is global and visible everywhere." },
    { name: "String Block", short: "\"text\"", chapter: "Lua Ch. 2 · Variables and Types", icon: "i-link", verb: "name",
      line: 'local name = "Ana"',
      explain: "Text goes in quotes. Lua's types are few: nil, boolean, number, string, table and function." },
    { name: "Nil Block", short: "nil", chapter: "Lua Ch. 2 · Variables and Types", icon: "i-gap", verb: "empty",
      line: "local nothing = nil",
      explain: "nil means “no value.” Any variable you never set is nil, and setting a table field to nil removes it." },
    { name: "Floor Divide Block", short: "//", chapter: "Lua Ch. 3 · Operators and Math", icon: "i-calc", verb: "divide",
      line: "local half = 7 // 2",
      explain: "/ always gives a float: 7 / 2 is 3.5. // divides and rounds down: 7 // 2 is 3. % gives the remainder." },
    { name: "Join Block", short: "..", chapter: "Lua Ch. 4 · Strings", icon: "i-brackets", verb: "join",
      line: 'print("Score: " .. score)',
      explain: "Two dots join strings — and turn numbers into text on the way. + is only for math." },
    { name: "Upper Block", short: ":upper()", chapter: "Lua Ch. 4 · Strings", icon: "i-stamp", verb: "shout",
      line: "local shout = name:upper()",
      explain: "Strings have functions in the string library. name:upper() is a shortcut for string.upper(name)." },
    { name: "Format Block", short: "string.format", chapter: "Lua Ch. 4 · Strings", icon: "i-pencil", verb: "format",
      line: 'local line = string.format("%s has %d coins", name, coins)',
      explain: "string.format fills each % code in order: %s for text, %d for whole numbers, %.2f for decimals." },
    { name: "If Block", short: "if then", chapter: "Lua Ch. 5 · Decisions", icon: "i-fork", verb: "decide",
      line: 'if hp <= 0 then print("Game over") end',
      explain: "if … then … end runs code when the test is true. Only nil and false count as false — 0 and empty text are true." },
    { name: "Not Equal Block", short: "~=", chapter: "Lua Ch. 5 · Decisions", icon: "i-toggle", verb: "compare",
      line: 'if lives ~= 0 then print("Still alive") end',
      explain: "Lua writes “not equal” as ~=. Other tests are == < > <= >=, combined with and, or and not." },
    { name: "And-Or Block", short: "and or", chapter: "Lua Ch. 5 · Decisions", icon: "i-swap-h", verb: "choose",
      line: 'local size = n > 10 and "big" or "small"',
      explain: "Lua has no ?: operator; a and b or c does the same job — as long as b isn't false or nil." },
    { name: "For Block", short: "for =", chapter: "Lua Ch. 6 · Loops", icon: "i-repeat", verb: "count",
      line: "for i = 1, 5 do print(i) end",
      explain: "The numeric for counts from the first number to the second, both included: 1, 2, 3, 4, 5." },
    { name: "Countdown Block", short: "step -1", chapter: "Lua Ch. 6 · Loops", icon: "i-rows", verb: "count down",
      line: "for i = 10, 1, -1 do print(i) end",
      explain: "A third number sets the step: -1 counts backwards, 2 counts in twos." },
    { name: "While Block", short: "while", chapter: "Lua Ch. 6 · Loops", icon: "i-hourglass", verb: "repeat",
      line: "while lives > 0 do lives = lives - 1 end",
      explain: "while repeats as long as its test is true. Lua has no -= or ++, so write lives = lives - 1." },
    { name: "Table Block", short: "{ }", chapter: "Lua Ch. 7 · Tables as Lists", icon: "i-boxes", verb: "line up",
      line: "local scores = {10, 20, 30}",
      explain: "A table is Lua's only data structure. Used as a list, it counts from 1 — scores[1] is 10 — and #scores is its length." },
    { name: "Insert Block", short: "table.insert", chapter: "Lua Ch. 7 · Tables as Lists", icon: "i-plus-square", verb: "grow",
      line: "table.insert(scores, 40)",
      explain: "table.insert adds an item to the end of a list (or at a position, if you give one). table.remove takes one out." },
    { name: "Ipairs Block", short: "ipairs", chapter: "Lua Ch. 7 · Tables as Lists", icon: "i-list", verb: "walk",
      line: "for i, s in ipairs(scores) do print(i, s) end",
      explain: "ipairs walks a list in order, giving each position and value: 1 10, 2 20, 3 30." },
    { name: "Record Block", short: "{key = …}", chapter: "Lua Ch. 8 · Tables as Dictionaries", icon: "i-folder", verb: "label",
      line: 'local player = {name = "Ana", hp = 100}',
      explain: "A table can use names as keys. player.name and player[\"name\"] both read \"Ana\"." },
    { name: "Pairs Block", short: "pairs", chapter: "Lua Ch. 8 · Tables as Dictionaries", icon: "i-search", verb: "visit",
      line: "for key, value in pairs(player) do print(key, value) end",
      explain: "pairs visits every key and value in a table — in no particular order. Sort the keys first if order matters." },
    { name: "Function Block", short: "function", chapter: "Lua Ch. 9 · Functions", icon: "i-play-circle", verb: "build",
      line: "local function add(a, b) return a + b end",
      explain: "local function defines a function; return hands back the answer. Missing arguments arrive as nil." },
    { name: "Two Results Block", short: "q, r =", chapter: "Lua Ch. 9 · Functions", icon: "i-swap-h", verb: "catch",
      line: "local q, r = divmod(17, 5)",
      explain: "Lua functions can return several values at once: return a // b, a % b. Catch them with several names." },
    { name: "Function Value Block", short: "function()", chapter: "Lua Ch. 10 · Closures and Functions as Values", icon: "i-lambda", verb: "store",
      line: "local double = function(x) return x * 2 end",
      explain: "Functions are values: you can store them in variables and tables, pass them in, and return them." },
    { name: "Method Block", short: ":", chapter: "Lua Ch. 11 · Objects with Tables", icon: "i-gear", verb: "attach",
      line: "function Player:heal(n) self.hp = self.hp + n end",
      explain: "The colon makes a method: it quietly adds a self parameter, the table the method was called on. Call it with hero:heal(10)." },
    { name: "Metatable Block", short: "setmetatable", chapter: "Lua Ch. 11 · Objects with Tables", icon: "i-layers", verb: "link",
      line: "setmetatable(hero, {__index = Player})",
      explain: "A metatable changes how a table behaves. __index tells Lua where to look for missing keys — that's how objects find their methods." },
    { name: "Pcall Block", short: "pcall", chapter: "Lua Ch. 13 · Errors", icon: "i-shield-check", verb: "catch",
      line: "local ok, err = pcall(risky)",
      explain: "pcall runs a function in protected mode: instead of crashing, an error comes back as ok = false and a message in err." },
    { name: "Error Block", short: "error", chapter: "Lua Ch. 13 · Errors", icon: "i-shield-alert", verb: "stop",
      line: 'error("not enough coins")',
      explain: "error stops the running code with a message. Unless something called it with pcall, the program ends there." },
    { name: "Require Block", short: "require", chapter: "Lua Ch. 14 · Modules", icon: "i-cube", verb: "load",
      line: 'local shapes = require("shapes")',
      explain: "require loads a module — usually another file, shapes.lua, that returns a table of functions — and remembers it." },
    { name: "Gmatch Block", short: "gmatch", chapter: "Lua Ch. 15 · Files and Patterns", icon: "i-funnel", verb: "find",
      line: 'for word in text:gmatch("%a+") do print(word) end',
      explain: "Lua patterns find text: %a+ means “one or more letters.” gmatch hands over every match in turn." },
    { name: "Open Block", short: "io.open", chapter: "Lua Ch. 15 · Files and Patterns", icon: "i-file", verb: "open",
      line: 'local file = io.open("save.txt", "w")',
      explain: "io.open opens a file: \"w\" to write, \"r\" to read, \"a\" to add to the end. It returns nil and a message if it can't." },
    { name: "Yield Block", short: "yield", chapter: "Lua Ch. 16 · Coroutines and Games", icon: "i-yield", verb: "pause",
      line: "coroutine.yield(step)",
      explain: "Inside a coroutine, yield pauses and hands a value back; the next resume carries on right after it. Games use this for step-by-step actions." }
  ];

  var chapters = [
    { title: "First Steps", chapter: "Start here · print, lua main.lua, comments", line: 'print("Hello, world!")',
      content: {
        story: ["Lua is a small, fast language made to fit inside other programs. Games love it: LÖVE and Defold games are written in it, Roblox's Luau grew out of it, and World of Warcraft add-ons, Neovim and many apps use it for scripting.",
          "print shows values. A file runs from top to bottom; there's no main function and no semicolons. Comments start with -- and run to the end of the line.",
          "Install Lua from lua.org (or with a package manager), save code as main.lua, and run lua main.lua. Typing lua on its own starts an interactive prompt for trying lines."],
        big: "Lua is small and fast, made to live inside games and apps; print shows values and a file runs top to bottom.",
        caption: "lua main.lua reads the file from the top, and the screen says hello. Tap Play.",
        demo: ["$ lua main.lua", "print(\"Hello, world!\")", "Hello, world!", "-- comments start with two dashes"]
      },
      deep: {
        more: ["The whole Lua language fits in a short reference manual, which is part of why it's so easy to embed: the interpreter is only a few hundred kilobytes.",
          "print can take several values separated by commas; it puts a tab between them."],
        ex: { code: src(["-- My first Lua program", "print(\"Hello, world!\")", "print(\"I am learning Lua.\")", "print(2 + 3)", "print(\"Lua\", 5.4)"]),
          walk: ["Line 1: a comment, skipped by Lua.", "Lines 2–3: two lines of text.", "Line 4: Lua works out 2 + 3: 5.", "Line 5: two values, separated by a tab: Lua  5.4."] },
        mistake: "Writing Print with a capital P. Lua is case-sensitive, so it reports “attempt to call a nil value (global 'Print')” — there's no such function."
      } },
    { title: "Variables and Types", chapter: "Boxes · local, nil, numbers, strings, booleans, type()", line: "local score = 0",
      content: {
        story: ["local score = 0 makes a variable. Always use local: a variable without it is global, visible to the whole program, and that causes hard-to-find bugs.",
          "Lua has just a few types: nil (no value), boolean (true or false), number (whole numbers and decimals), string (text), table and function. type(x) tells you which one a value is.",
          "Variables don't have fixed types — the same name can hold a number now and text later. Any variable you never set reads as nil."],
        big: "Use local for every variable; Lua's types are nil, boolean, number, string, table and function; type() tells them apart.",
        caption: "Labelled boxes appear, and type() reads each label: number, string, boolean, nil. Tap Play.",
        demo: ["local score = 0 → number", "local name = \"Ana\" → string", "local alive = true → boolean", "local missing → nil"]
      },
      deep: {
        more: ["Numbers come in two subtypes: integers like 3 and floats like 3.0. math.type(3) says integer and math.type(3.0) says float. Most of the time Lua converts between them for you.",
          "You can assign several variables at once: local x, y = 1, 2. Extra names get nil."],
        ex: { code: src(["local score = 0", "local price = 4.99", "local name = \"Ana\"", "local alive = true", "local missing", "score = score + 10", "print(name, score, price, alive, missing)", "print(type(score), type(name), type(alive), type(missing))", "print(math.type(3), math.type(3.0))", "local x, y = 1, 2", "print(x + y)"]),
          walk: ["Lines 1–5: a number, a decimal, text, a boolean, and a variable never set.", "Line 6: score becomes 10.", "Line 7: Ana  10  4.99  true  nil.", "Line 8: number  string  boolean  nil.", "Line 9: integer  float.", "Lines 10–11: two variables at once: 3."] },
        mistake: "Leaving out local. The variable becomes global, so a function far away can change it by accident. Write local every time."
      } },
    { title: "Operators and Math", chapter: "Calculating · + - * / // % ^, math library", line: "local half = 7 // 2",
      content: {
        story: ["Lua does math with + - * / // % and ^ (power). / always gives a float: 7 / 2 is 3.5, and even 6 / 2 is 3.0. // divides and rounds down: 7 // 2 is 3. % gives the remainder: 7 % 2 is 1.",
          "Lua has no shortcuts like += or ++. Write score = score + 10 and lives = lives - 1.",
          "The math library has math.floor, math.ceil, math.max, math.min, math.abs, math.sqrt, math.pi and math.random(1, 6) for dice rolls."],
        big: "/ gives a float, // rounds down, % is the remainder, ^ is power — and there's no +=, so write x = x + 1.",
        caption: "7 divided three ways: 3.5 with /, 3 with //, and 1 left over with %. Tap Play.",
        demo: ["7 / 2 → 3.5", "7 // 2 → 3", "7 % 2 → 1", "2 ^ 10 → 1024.0"]
      },
      deep: {
        more: ["^ always gives a float, so 2 ^ 10 prints as 1024.0. Use math.floor or // when you need a whole number.",
          "math.random needs no setup in Lua 5.4: it starts from a random seed each time the program runs."],
        ex: { code: src(["print(7 / 2)", "print(7 // 2)", "print(7 % 2)", "print(2 ^ 10)", "local coins, players = 10, 4", "print(coins / players)", "print(math.floor(3.7), math.ceil(3.2), math.max(3, 9, 4))", "local hp = 100", "hp = hp - 30", "hp = hp + 1", "print(hp)", "print(math.abs(-5), math.sqrt(16))"]),
          walk: ["Line 1: always a float: 3.5.", "Line 2: rounds down: 3.", "Line 3: the remainder: 1.", "Line 4: 1024.0.", "Lines 5–6: 2.5.", "Line 7: 3  4  9.", "Lines 8–11: 100 − 30 + 1 = 71.", "Line 12: 5  4.0."] },
        mistake: "Writing score += 10 from another language. Lua stops with “syntax error near '+='”. Write score = score + 10."
      } },
    { title: "Strings", chapter: "Text · .., #, string library, methods, format, long strings", line: 'print("Score: " .. score)',
      content: {
        story: ["Strings use double or single quotes. Two dots join them: \"Score: \" .. score — numbers are turned into text automatically. # gives the length: #\"Ana\" is 3.",
          "The string library has upper, lower, rep (repeat), sub (cut out part), reverse, find, gsub (replace) and format. Call them as string.upper(name) or, shorter, name:upper().",
          "string.format(\"%s has %d coins\", name, coins) fills in values; %.2f gives two decimal places, %5d pads a number. [[double square brackets]] make a long string that keeps line breaks."],
        big: ".. joins text, # measures it, and the string library — called as name:upper() — does the rest.",
        caption: "Two pieces of text slide together on the .. track. Tap Play.",
        demo: ["\"Score: \" .. 42", "#\"Ana\" → 3", "(\"ha\"):rep(3) → hahaha", "name:sub(1, 2) → \"An\""]
      },
      deep: {
        more: ["String positions count from 1, and negative positions count from the end: s:sub(-3) is the last three characters.",
          "Strings never change; every string function returns a new string."],
        ex: { code: src(["local name = \"Ana\"", "local coins = 42", "print(name .. \" has \" .. coins .. \" coins\")", "print(#name, name:upper(), name:lower(), name:reverse())", "print((\"ha\"):rep(3))", "print((\"Leonardo\"):sub(1, 3), (\"Leonardo\"):sub(-3))", "print(string.format(\"%s has %d coins (%.1f%%)\", name, coins, 12.345))", "print(string.format(\"[%5d] [%-5d]\", 42, 42))", "local card = [[", "Player: Ana", "Coins: 42]]", "print(card)"]),
          walk: ["Line 3: Ana has 42 coins.", "Line 4: 3  ANA  ana  anA.", "Line 5: hahaha — brackets let a literal string call a method.", "Line 6: Leo  rdo.", "Line 7: Ana has 42 coins (12.3%).", "Line 8: [   42] [42   ].", "Lines 9–12: a long string keeps its line breaks."] },
        mistake: "Joining with +: \"Score: \" + 5 makes Lua try to turn the text into a number, and it fails with “attempt to perform arithmetic on a string value.” Use .."
      } },
    { title: "Decisions", chapter: "Choosing · if, elseif, else, ~=, and, or, not", line: 'if hp <= 0 then print("Game over") end',
      content: {
        story: ["if test then … end runs code when the test is true. Add elseif test then for more tests and else for the rest. Every if finishes with end.",
          "Comparisons are == (equal), ~= (not equal — Lua's spelling), < > <= >=. Combine them with and, or and not. In Lua only nil and false count as false: 0 and \"\" both count as true.",
          "Lua has no ternary operator, but a and b or c picks b when a is true and c otherwise: local size = n > 10 and \"big\" or \"small\". (It misfires only when b itself is false or nil.)"],
        big: "if … then … elseif … else … end chooses a path; ~= means not equal; only nil and false are false.",
        caption: "A path forks at hp <= 0: one way says Game over, the other keeps going. Tap Play.",
        demo: ["hp = 0", "if hp <= 0 then → true", "Game over", "size = n > 10 and \"big\" or \"small\""]
      },
      deep: {
        more: ["x = x or 5 is the Lua way to give a default: if x is nil, it becomes 5.",
          "Lua has no switch statement. Use an if-elseif chain, or a table that maps each choice to a value or function."],
        ex: { code: src(["local hp = 0", "if hp <= 0 then", "  print(\"Game over\")", "elseif hp < 20 then", "  print(\"Careful!\")", "else", "  print(\"Keep going\")", "end", "local lives = 2", "if lives ~= 0 then print(\"Still alive\") end", "local size = hp > 10 and \"big\" or \"small\"", "print(size)", "if 0 then print(\"0 is true in Lua\") end", "local nickname", "nickname = nickname or \"friend\"", "print(nickname)", "local grades = {A = \"great\", B = \"good\"}", "print(grades[\"B\"] or \"keep going\")"]),
          walk: ["Lines 1–8: hp is 0, so Game over.", "Lines 9–10: ~= means not equal: Still alive.", "Lines 11–12: and/or picks small.", "Line 13: 0 is true in Lua.", "Lines 14–16: or gives a default: friend.", "Lines 17–18: a table can stand in for a switch: good."] },
        mistake: "Writing != for not equal. Lua's spelling is ~=, and != is a syntax error."
      } },
    { title: "Loops", chapter: "Repeating · for, while, repeat-until, break, goto continue", line: "for i = 1, 5 do print(i) end",
      content: {
        story: ["The numeric for counts: for i = 1, 5 do … end runs with i as 1, 2, 3, 4 and 5 — both ends included. A third number is the step: for i = 10, 1, -1 counts down.",
          "while test do … end repeats while the test is true. repeat … until test runs the body first and stops when the test becomes true, so it always runs at least once.",
          "break leaves a loop. Lua has no continue, but goto continue with a ::continue:: label at the end of the loop body does the same job."],
        big: "for i = a, b, step counts (ends included); while and repeat-until loop on tests; break leaves early.",
        caption: "A counter goes round the track 1 to 3, then another counts down by twos. Tap Play.",
        demo: ["for i = 1, 3 → 1 2 3", "for i = 6, 0, -2 → 6 4 2 0", "repeat … until done", "break → out"]
      },
      deep: {
        more: ["The loop variable i is local to the loop, and changing it inside doesn't change how many times the loop runs.",
          "To loop over a table's items, use the generic for with ipairs or pairs — the next two chapters."],
        ex: { code: src(["for i = 1, 3 do", "  print(\"lap \" .. i)", "end", "for i = 6, 0, -2 do", "  io.write(i, \" \")", "end", "print()", "local lives = 3", "while lives > 0 do", "  lives = lives - 1", "end", "print(\"lives: \" .. lives)", "local tries = 0", "repeat", "  tries = tries + 1", "until tries >= 3", "print(\"tries: \" .. tries)", "for n = 1, 10 do", "  if n % 2 == 0 then goto continue end", "  if n > 7 then break end", "  io.write(n, \" \")", "  ::continue::", "end", "print()"]),
          walk: ["Lines 1–3: lap 1, lap 2, lap 3.", "Lines 4–7: io.write prints without a new line: 6 4 2 0.", "Lines 8–12: lives: 0.", "Lines 13–17: repeat runs until the test is true: tries: 3.", "Lines 18–24: skip even numbers with goto continue, stop past 7: 1 3 5 7."] },
        mistake: "Forgetting do or end. for i = 1, 5 print(i) is a syntax error; the full shape is for … do … end."
      } },
    { title: "Tables as Lists", chapter: "Lists · { }, counting from 1, #, table.insert, ipairs, sort", line: "local scores = {10, 20, 30}",
      content: {
        story: ["A table is Lua's one data structure, and it does everything. Written {10, 20, 30}, it's a list. Lua counts from 1, not 0: scores[1] is 10. #scores gives the length.",
          "table.insert(scores, 40) adds to the end, table.remove(scores) takes the last item off, and table.sort(scores) sorts in place. table.concat(scores, \", \") joins items into text.",
          "for i, s in ipairs(scores) do … end walks the list in order. Reading past the end gives nil, not an error."],
        big: "Tables as lists count from 1; # measures them; table.insert, remove, sort and concat do the work; ipairs walks them.",
        caption: "A row of boxes numbered from 1 grows by one, then sorts itself into order. Tap Play.",
        demo: ["local scores = {30, 10, 20}", "table.insert(scores, 40)", "table.sort(scores)", "{10, 20, 30, 40}"]
      },
      deep: {
        more: ["Avoid holes: setting scores[2] = nil in the middle of a list makes # unreliable. Use table.remove, which shifts the rest down.",
          "Tables are passed by reference: give a table to a function and the function can change the original."],
        ex: { code: src(["local scores = {30, 10, 20}", "table.insert(scores, 40)", "print(#scores, scores[1], scores[#scores])", "table.sort(scores)", "print(table.concat(scores, \", \"))", "local last = table.remove(scores)", "print(\"removed \" .. last .. \", left \" .. #scores)", "for i, s in ipairs(scores) do", "  print(i, s)", "end", "print(scores[10])", "table.insert(scores, 1, 5)", "print(table.concat(scores, \" \"))"]),
          walk: ["Lines 1–3: 4  30  40 — counting starts at 1.", "Lines 4–5: 10, 20, 30, 40.", "Lines 6–7: removed 40, left 3.", "Lines 8–10: 1 10, 2 20, 3 30.", "Line 11: past the end gives nil.", "Lines 12–13: insert at position 1: 5 10 20 30."] },
        mistake: "Starting at 0: scores[0] is nil, because the first item is scores[1]. Count from 1 in Lua."
      } },
    { title: "Tables as Dictionaries", chapter: "Lookups · keys, dot syntax, pairs, nil removes", line: 'local player = {name = "Ana", hp = 100}',
      content: {
        story: ["The same tables can use names as keys: local player = {name = \"Ana\", hp = 100}. Read with player.name or player[\"name\"]; add with player.level = 2.",
          "Setting a key to nil removes it. A missing key reads as nil, so player.gold or 0 gives a default.",
          "for key, value in pairs(player) do … end visits every pair — in no guaranteed order. When order matters, collect the keys into a list and table.sort it."],
        big: "Tables with name keys are dictionaries: use . or [ ], set nil to remove, and walk them with pairs (in any order).",
        caption: "A cabinet of labelled drawers; open one by name, or get nil if it's missing. Tap Play.",
        demo: ["player.name → \"Ana\"", "player.level = 2", "player.gold → nil", "for k, v in pairs(player)"]
      },
      deep: {
        more: ["player[key] with a variable key and player.key with a fixed name are different: player.key looks for the key named \"key\".",
          "Counting is easy: counts[word] = (counts[word] or 0) + 1."],
        ex: { code: src(["local player = {name = \"Ana\", hp = 100}", "player.level = 2", "player.hp = player.hp - 30", "print(player.name .. \": \" .. player.hp .. \" HP, level \" .. player.level)", "print(player.gold, player.gold or 0)", "player.level = nil", "local keys = {}", "for key in pairs(player) do", "  table.insert(keys, key)", "end", "table.sort(keys)", "for _, key in ipairs(keys) do", "  print(key, player[key])", "end", "local counts = {}", "for word in (\"lua is fun lua\"):gmatch(\"%a+\") do", "  counts[word] = (counts[word] or 0) + 1", "end", "print(counts.lua, counts.fun)"]),
          walk: ["Lines 1–4: Ana: 70 HP, level 2.", "Line 5: nil  0.", "Line 6: setting nil removes level.", "Lines 7–14: sort the keys for a steady order: hp 70, name Ana.", "Lines 15–19: counting words: 2  1."] },
        mistake: "Expecting pairs to go in the order you wrote the keys. It doesn't; sort the keys first when the order matters."
      } },
    { title: "Functions", chapter: "Machines · local function, return, several results, defaults, ...", line: "local function add(a, b) return a + b end",
      content: {
        story: ["local function add(a, b) return a + b end defines a function. return hands back the answer. Call it with add(2, 3).",
          "Lua functions can return several values: return a // b, a % b. Catch them with local q, r = divmod(17, 5).",
          "Missing arguments arrive as nil and extra ones are ignored, so defaults are written with or: name = name or \"friend\". A function with ... accepts any number of arguments."],
        big: "Functions take arguments and can return several values; missing arguments are nil, so or gives defaults.",
        caption: "A machine with two input slots and two output chutes: 17 and 5 go in, 3 and 2 come out. Tap Play.",
        demo: ["local function divmod(a, b)", "return a // b, a % b", "local q, r = divmod(17, 5)", "q = 3, r = 2"]
      },
      deep: {
        more: ["select(\"#\", ...) counts the extra arguments, and {...} packs them into a table.",
          "A local function must be defined before the code that calls it runs — define helpers near the top."],
        ex: { code: src(["local function add(a, b)", "  return a + b", "end", "", "local function divmod(a, b)", "  return a // b, a % b", "end", "", "local function greet(name)", "  name = name or \"friend\"", "  return \"Hi, \" .. name .. \"!\"", "end", "", "local function total(...)", "  local sum = 0", "  for _, n in ipairs({...}) do", "    sum = sum + n", "  end", "  return sum", "end", "", "print(add(2, 3))", "local q, r = divmod(17, 5)", "print(q, r)", "print(greet(), greet(\"Ana\"))", "print(total(1, 2, 3, 4))"]),
          walk: ["Lines 1–3: two values in, one out.", "Lines 5–7: two results at once.", "Lines 9–12: or gives a default when name is nil.", "Lines 14–20: ... accepts any number of arguments.", "Line 22: 5.", "Lines 23–24: 3  2.", "Line 25: Hi, friend!  Hi, Ana!", "Line 26: 10."] },
        mistake: "Calling a local function before its definition has run. Lua reports “attempt to call a nil value” because the name doesn't hold the function yet."
      } },
    { title: "Closures and Functions as Values", chapter: "Code as data · anonymous functions, closures, passing functions", line: "local double = function(x) return x * 2 end",
      content: {
        story: ["In Lua, functions are values like numbers and strings. function(x) return x * 2 end makes one without a name; store it in a variable, put it in a table, or pass it to another function.",
          "A function made inside another can use the outer function's local variables, even after the outer one has finished — it's a closure. That's how you build counters and settings that keep their own private state.",
          "table.sort takes a function that decides the order: table.sort(players, function(a, b) return a.score > b.score end) sorts highest first."],
        big: "Functions are values you can store and pass around; closures remember the variables around them.",
        caption: "A function rides inside a variable, then hops into table.sort to decide the order. Tap Play.",
        demo: ["local double = function(x) …", "map(nums, double)", "table.sort(t, function(a, b) …)", "counter() → 1, 2, 3"]
      },
      deep: {
        more: ["Lua has no built-in map or filter, but they're a few lines to write — and writing them is a great way to understand functions as values.",
          "Each call to the outer function makes a fresh closure with its own private copy of the variables."],
        ex: { code: src(["local function map(list, fn)", "  local out = {}", "  for i, v in ipairs(list) do", "    out[i] = fn(v)", "  end", "  return out", "end", "", "local function filter(list, keep)", "  local out = {}", "  for _, v in ipairs(list) do", "    if keep(v) then table.insert(out, v) end", "  end", "  return out", "end", "", "local function makeCounter()", "  local count = 0", "  return function()", "    count = count + 1", "    return count", "  end", "end", "", "local nums = {1, 2, 3, 4, 5, 6}", "local double = function(x) return x * 2 end", "print(table.concat(map(nums, double), \" \"))", "print(table.concat(filter(nums, function(x) return x % 2 == 0 end), \" \"))", "local counter = makeCounter()", "counter()", "print(counter())", "local players = {{name = \"Ana\", score = 120}, {name = \"Leo\", score = 150}}", "table.sort(players, function(a, b) return a.score > b.score end)", "print(players[1].name)"]),
          walk: ["Lines 1–15: map and filter, written by hand.", "Lines 17–23: the returned function remembers count.", "Line 27: 2 4 6 8 10 12.", "Line 28: 2 4 6.", "Lines 29–31: the counter counts 1, then prints 2.", "Lines 32–34: sorted highest first: Leo."] },
        mistake: "Passing double() instead of double. The brackets call the function right away and pass its result; pass the function itself without them."
      } },
    { title: "Objects with Tables", chapter: "Blueprints · methods, :, self, metatables, __index", line: "function Player:heal(n) self.hp = self.hp + n end",
      content: {
        story: ["Lua has no classes built in, but tables and metatables make them easily. A “class” is a table of methods: local Player = {}; Player.__index = Player.",
          "function Player:heal(n) defines a method; the colon adds a hidden first parameter, self — the object the method is called on. Call it with a colon too: hero:heal(10), which means Player.heal(hero, 10).",
          "Player.new builds an object: a table of data whose metatable is Player. When a key is missing from the object, __index sends Lua to look in Player, so every object finds the shared methods."],
        big: "A class is a table of methods; objects are tables with that class as their metatable; the colon passes self.",
        caption: "A hero table asks “where's heal?”; __index points it to the Player table. Tap Play.",
        demo: ["local Player = {}", "Player.__index = Player", "function Player:heal(n) …", "hero:heal(10)"]
      },
      deep: {
        more: ["Mixing up . and : is the classic slip: hero.heal(10) passes 10 as self. Use : for methods in both the definition and the call.",
          "Libraries like middleclass add class syntax on top of these same metatables."],
        ex: { code: src(["local Player = {}", "Player.__index = Player", "", "function Player.new(name, hp)", "  local self = setmetatable({}, Player)", "  self.name = name", "  self.hp = hp or 100", "  self.level = 1", "  return self", "end", "", "function Player:hurt(damage)", "  self.hp = math.max(0, self.hp - damage)", "end", "", "function Player:levelUp()", "  self.level = self.level + 1", "end", "", "function Player:describe()", "  return self.name .. \" (level \" .. self.level .. \", \" .. self.hp .. \" HP)\"", "end", "", "local ana = Player.new(\"Ana\")", "ana:hurt(30)", "ana:levelUp()", "print(ana:describe())", "local leo = Player.new(\"Leo\", 80)", "print(leo:describe())"]),
          walk: ["Lines 1–2: Player is the class; __index points back at it.", "Lines 4–10: new makes a table whose metatable is Player.", "Lines 12–22: methods use self, the object they're called on.", "Lines 24–27: Ana (level 2, 70 HP).", "Lines 28–29: Leo (level 1, 80 HP)."] },
        mistake: "Calling ana.hurt(30) with a dot. Then self is 30 and damage is nil, and Lua complains about arithmetic on a nil value. Use ana:hurt(30)."
      } },
    { title: "Inheritance and Metamethods", chapter: "Families · setmetatable chains, __tostring, __add, __eq", line: "setmetatable(hero, {__index = Player})",
      content: {
        story: ["Inheritance is one more link in the chain: setmetatable(Wizard, {__index = Player}) makes Wizard look in Player for anything it doesn't have. A wizard object finds Wizard's methods first, then Player's.",
          "Metatables can also change how operators work. __tostring decides what print shows, __add makes + work, __eq makes == compare by content, and __lt makes < work for sorting.",
          "These special keys are called metamethods, and they're how Lua lets tables act like built-in values."],
        big: "Chaining __index gives inheritance; metamethods like __tostring, __add and __eq teach tables new tricks.",
        caption: "A wizard asks for describe(); Wizard doesn't have it, so the question travels up to Player. Tap Play.",
        demo: ["setmetatable(Wizard, {__index = Player})", "wizard:describe()", "__tostring → print(v)", "__add → v1 + v2"]
      },
      deep: {
        more: ["To call the parent's version of a method, call it on the parent table directly: Player.describe(self).",
          "Keep inheritance shallow. Often it's simpler to give an object the functions it needs than to build deep family trees."],
        ex: { code: src(["local Player = {}", "Player.__index = Player", "", "function Player.new(name)", "  return setmetatable({name = name}, Player)", "end", "", "function Player:describe()", "  return self.name .. \" the adventurer\"", "end", "", "local Wizard = setmetatable({}, {__index = Player})", "Wizard.__index = Wizard", "", "function Wizard.new(name, mana)", "  local self = setmetatable(Player.new(name), Wizard)", "  self.mana = mana", "  return self", "end", "", "function Wizard:describe()", "  return Player.describe(self) .. \" with \" .. self.mana .. \" mana\"", "end", "", "local Vec = {}", "Vec.__index = Vec", "Vec.__add = function(a, b) return Vec.new(a.x + b.x, a.y + b.y) end", "Vec.__tostring = function(v) return \"(\" .. v.x .. \", \" .. v.y .. \")\" end", "function Vec.new(x, y) return setmetatable({x = x, y = y}, Vec) end", "", "print(Player.new(\"Ana\"):describe())", "print(Wizard.new(\"Leo\", 50):describe())", "print(tostring(Vec.new(1, 2) + Vec.new(3, 4)))"]),
          walk: ["Lines 1–10: the parent class.", "Lines 12–23: Wizard looks in Player for what it lacks; Player.describe(self) calls the parent's version.", "Lines 25–29: metamethods make + and tostring work for vectors.", "Line 31: Ana the adventurer.", "Line 32: Leo the adventurer with 50 mana.", "Line 33: (4, 6)."] },
        mistake: "Forgetting Wizard.__index = Wizard. Objects then can't find Wizard's own methods, only Player's."
      } },
    { title: "Errors", chapter: "Safety nets · error, pcall, assert, error messages", line: "local ok, err = pcall(risky)",
      content: {
        story: ["error(\"message\") stops the current code. Lua itself raises errors too: calling a nil value, indexing nil, doing math on text.",
          "pcall(f, args…) runs f in protected mode. Instead of crashing, it returns false and the error message — or true and f's results when all went well.",
          "assert(value, message) is a quick check: if value is nil or false, it raises an error with your message. It's handy for things that must never happen."],
        big: "error raises a problem, pcall catches it as false plus a message, and assert checks things that must be true.",
        caption: "A function throws an error; pcall's net catches it and hands back false and the message. Tap Play.",
        demo: ["error(\"not enough coins\")", "local ok, err = pcall(spend, 50, 80)", "ok → false", "err → \"…not enough coins\""]
      },
      deep: {
        more: ["error(msg, 2) blames the caller's line instead of the function's own, which makes messages point at the real mistake. error(msg, 0) leaves the location off entirely.",
          "error can also raise a table, which lets callers check an error code instead of reading text."],
        ex: { code: src(["local function spend(coins, price)", "  if price < 0 then error(\"price can't be negative\", 0) end", "  if price > coins then error(\"need \" .. price .. \", have \" .. coins, 0) end", "  return coins - price", "end", "", "for _, price in ipairs({30, 80, -5}) do", "  local ok, result = pcall(spend, 50, price)", "  if ok then", "    print(\"left: \" .. result)", "  else", "    print(\"refused: \" .. result)", "  end", "end", "local ok, err = pcall(function()", "  local nothing", "  return nothing.name", "end)", "print(ok, err:match(\"attempt to index.*\"))", "print(pcall(assert, 1 + 1 == 2, \"math broke\"))"]),
          walk: ["Lines 1–5: error raises a problem; 0 leaves the location off.", "Lines 7–14: left: 20, refused: need 80, have 50, refused: price can't be negative.", "Lines 15–19: Lua's own error, caught: false  attempt to index a nil value (local 'nothing').", "Line 20: the assert passes: true  true  math broke."] },
        mistake: "Calling pcall(spend(50, 80)). That runs spend immediately, outside the protection. Pass the function and its arguments separately: pcall(spend, 50, 80)."
      } },
    { title: "Modules", chapter: "Organizing · module tables, require, package.preload", line: 'local shapes = require("shapes")',
      content: {
        story: ["A module is a file that returns a table of functions. shapes.lua starts with local M = {}, adds functions to M, and ends with return M.",
          "require(\"shapes\") finds shapes.lua, runs it once, and hands back its table. Calling require again returns the same table without running the file a second time.",
          "Keep helper functions local inside a module so only what you put in M is shared. Lua finds modules using package.path, a list of folders to search."],
        big: "A module returns a table; require loads it once and shares it; local keeps helpers private.",
        caption: "shapes.lua packs functions into a table and returns it; main.lua requires it. Tap Play.",
        demo: ["-- shapes.lua", "local M = {} … return M", "local shapes = require(\"shapes\")", "shapes.area(3, 4)"]
      },
      deep: {
        more: ["package.preload lets you register a module from code instead of a file — handy for tests and for single-file examples like this one.",
          "LuaRocks is Lua's package manager: luarocks install penlight adds a library of extra helpers."],
        ex: { code: src(["-- In a real project this would be the file shapes.lua.", "package.preload[\"shapes\"] = function()", "  local M = {}", "", "  local function square(n) return n * n end", "", "  function M.rectArea(w, h) return w * h end", "", "  function M.squareArea(side) return square(side) end", "", "  return M", "end", "", "local shapes = require(\"shapes\")", "print(shapes.rectArea(3, 4), shapes.squareArea(5))", "print(shapes.square)", "print(require(\"shapes\") == shapes)"]),
          walk: ["Lines 2–12: the module: a table M of shared functions.", "Line 5: square is local, so it stays private.", "Line 14: require runs the module and returns M.", "Line 15: 12  25.", "Line 16: the private helper isn't shared: nil.", "Line 17: require returns the same table again: true."] },
        mistake: "Forgetting return M at the end of a module file. require then gives true instead of the table, and every call fails."
      } },
    { title: "Files and Patterns", chapter: "Saving and searching · io.open, read, lines, find, match, gmatch, gsub", line: 'for word in text:gmatch("%a+") do print(word) end',
      content: {
        story: ["io.open(\"save.txt\", \"w\") opens a file for writing, file:write writes text, and file:close finishes. Open with \"r\" to read: file:read(\"a\") reads everything, and file:lines() walks it line by line. io.open returns nil and a message if it fails.",
          "Lua patterns are a simple cousin of regular expressions: %d is a digit, %a a letter, %s a space, + one or more, * zero or more, and ( ) captures a piece.",
          "string.find finds a match, string.match pulls out captures, gmatch loops over every match, and gsub replaces matches."],
        big: "io.open, write, read and lines handle files; patterns like %d+ and %a+ with match, gmatch and gsub handle text.",
        caption: "A save file is written and read back, then a pattern lights up every number in a sentence. Tap Play.",
        demo: ["io.open(\"save.txt\", \"w\")", "file:write(\"Ana 120\\n\")", "for line in file:lines()", "(\"a1b22\"):gmatch(\"%d+\") → 1, 22"]
      },
      deep: {
        more: ["% escapes a special character in a pattern: %. matches a real dot.",
          "For big data formats like JSON, use a library (for example dkjson) instead of patterns."],
        ex: { code: src(["local out = assert(io.open(\"scores.txt\", \"w\"))", "out:write(\"Ana 120\\n\", \"Leo 95\\n\")", "out:close()", "", "local total = 0", "for line in io.lines(\"scores.txt\") do", "  local name, score = line:match(\"(%a+) (%d+)\")", "  total = total + tonumber(score)", "  print(name .. \" scored \" .. score)", "end", "print(\"total: \" .. total)", "local text = \"Order 42 shipped, order 7 pending\"", "for number in text:gmatch(\"%d+\") do", "  io.write(number, \" \")", "end", "print()", "print((text:gsub(\"order\", \"box\")))", "print(text:find(\"shipped\"))"]),
          walk: ["Lines 1–3: write two lines and close the file.", "Lines 5–11: read it line by line; match captures the name and number: Ana scored 120, Leo scored 95, total: 215.", "Lines 12–16: every number: 42 7.", "Line 17: gsub replaces (only the lower-case order): Order 42 shipped, box 7 pending.", "Line 18: find gives where the match starts and ends: 10  16."] },
        mistake: "Forgetting that gsub returns two values — the new text and the number of replacements. Wrap it in brackets, as on line 17, to keep just the text."
      } },
    { title: "Coroutines and Games", chapter: "Pausing code · coroutine.create, resume, yield, wrap; LÖVE and Roblox", line: "coroutine.yield(step)",
      content: {
        story: ["A coroutine is a function that can pause in the middle and carry on later. coroutine.wrap(f) makes one you call like a function; inside, coroutine.yield(value) pauses and hands value back. The next call resumes right after the yield.",
          "Games use this for actions that take several frames — a door opening a little each frame, a cutscene, an enemy patrol — written as simple top-to-bottom code instead of a tangle of counters.",
          "Lua's game homes include LÖVE (love2d.org), where love.update(dt) and love.draw() run every frame, and Roblox, which uses Luau: Lua plus types, task.wait, and a huge game API."],
        big: "Coroutines pause with yield and resume later, which makes step-by-step game actions easy; LÖVE and Roblox are Lua's big game homes.",
        caption: "A patrol coroutine walks left, pauses, walks right, pauses — one step per frame. Tap Play.",
        demo: ["local patrol = coroutine.wrap(function() …", "coroutine.yield(\"left\")", "patrol() → left", "patrol() → right"]
      },
      deep: {
        more: ["coroutine.create, coroutine.resume and coroutine.status give finer control than wrap, including checking whether a coroutine has finished.",
          "Coroutines aren't threads: only one runs at a time, and they take turns exactly where they yield — no surprises."],
        ex: { code: src(["local function patrol()", "  for lap = 1, 2 do", "    coroutine.yield(\"walk left (lap \" .. lap .. \")\")", "    coroutine.yield(\"walk right (lap \" .. lap .. \")\")", "  end", "  return \"rest\"", "end", "", "local step = coroutine.wrap(patrol)", "for frame = 1, 5 do", "  print(\"frame \" .. frame .. \": \" .. step())", "end", "", "local co = coroutine.create(function(a, b)", "  local c = coroutine.yield(a + b)", "  return c * 2", "end)", "print(coroutine.resume(co, 1, 2))", "print(coroutine.resume(co, 10))", "print(coroutine.status(co))"]),
          walk: ["Lines 1–7: a patrol that pauses after every move.", "Lines 9–12: one step per frame: walk left (lap 1), walk right (lap 1), walk left (lap 2), walk right (lap 2), rest.", "Lines 14–18: resume passes values in; yield hands 3 back: true  3.", "Line 19: the value sent in arrives as c: true  20.", "Line 20: dead — the coroutine has finished."] },
        mistake: "Calling a wrapped coroutine after it has finished. Lua raises “cannot resume dead coroutine.” Check coroutine.status, or stop calling when it returns its final value."
      } }
  ];

  var shelves = [
    { title: "Standard Library Field Guide", chapter: "Beyond the basics · Lua shelf", line: ["table.concat(list, \", \")", "os.date(\"%Y-%m-%d\")"],
      content: {
        story: ["Lua's standard library is small enough to learn in an afternoon: string (text and patterns), table (insert, remove, sort, concat, unpack), math, io (files), os (time and dates), utf8 and coroutine.",
          "Because Lua is made to be embedded, each host adds its own libraries: LÖVE adds graphics and sound, Roblox adds game services, Neovim adds editor controls.",
          "The Lua 5.4 Reference Manual at lua.org lists every function in a few pages."],
        big: "string, table, math, io, os, utf8 and coroutine are the whole standard library; hosts like LÖVE and Roblox add the rest.",
        caption: "A short shelf of toolboxes: string, table, math, io, os, utf8. Tap Play.",
        demo: ["table.unpack({1, 2, 3})", "math.tointeger(3.0)", "os.time{year = 2025, month = 3, day = 1}", "utf8.len(\"héllo\")"]
      },
      deep: {
        more: ["table.unpack spreads a list into separate values, handy for math.max(table.unpack(scores)).",
          "os.time and os.date work with dates: os.date(\"%A\", t) gives the day of the week."],
        ex: { code: src(["local scores = {40, 75, 60}", "print(math.max(table.unpack(scores)), math.min(table.unpack(scores)))", "print(math.tointeger(3.0), math.type(math.tointeger(3.0)))", "local t = os.time({year = 2025, month = 3, day = 1, hour = 12})", "print(os.date(\"%A, %B %d\", t))", "print(os.date(\"%Y-%m-%d\", t + 7 * 24 * 60 * 60))", "print(#\"héllo\", utf8.len(\"héllo\"))", "print((\"  tidy  \"):match(\"^%s*(.-)%s*$\"))", "print(string.format(\"%05.1f\", 3.14159))"]),
          walk: ["Line 2: table.unpack spreads the list: 75  40.", "Line 3: 3  integer.", "Lines 4–5: Saturday, March 01.", "Line 6: a week later: 2025-03-08.", "Line 7: 6 bytes but 5 letters.", "Line 8: a pattern trims spaces: tidy.", "Line 9: 003.1."] },
        mistake: "Writing your own trim, sort or date math. The library versions already handle the edge cases."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · Lua shelf", line: ["attempt to index a nil value (local 'player')", "stack traceback:"],
      content: {
        story: ["Most Lua errors are about nil. “attempt to index a nil value” means you wrote x.something or x[…] but x was nil; “attempt to call a nil value” means a function name was misspelled or not defined yet.",
          "The message names the file and line, and the stack traceback below lists which functions were running, newest first.",
          "print(type(x), x) is the quickest check. For tables, write a small dump function or use a library like inspect.lua. Typos in variable names quietly create globals — a linter such as luacheck catches them."],
        big: "Most errors are nil in disguise: read the message, the line and the traceback, and print type(x) to check.",
        caption: "A magnifying glass follows “attempt to index a nil value” to a misspelled table name. Tap Play.",
        demo: ["attempt to index a nil value", "main.lua:7", "plyer.name → player.name", "✓"]
      },
      deep: {
        more: ["Writing local in front of every variable, and running luacheck, prevents most typo bugs before they happen.",
          "error(msg, 2) makes your own errors point at the caller's line — much easier to debug."],
        ex: { code: src(["local function dump(t)", "  local keys = {}", "  for k in pairs(t) do table.insert(keys, tostring(k)) end", "  table.sort(keys)", "  local parts = {}", "  for _, k in ipairs(keys) do table.insert(parts, k .. \"=\" .. tostring(t[k])) end", "  return \"{\" .. table.concat(parts, \", \") .. \"}\"", "end", "", "local player = {name = \"Ana\", hp = 70}", "print(dump(player))", "print(type(player.nick), player.nick)", "local ok, err = pcall(function() return player.nick.first end)", "print(ok, err:match(\"attempt to index.*\"))", "local ok2, err2 = pcall(function() return player.heal() end)", "print(ok2, err2:match(\"attempt to call.*\"))"]),
          walk: ["Lines 1–8: a small helper to print any table.", "Line 11: {hp=70, name=Ana}.", "Line 12: nil  nil — the field doesn't exist.", "Lines 13–14: indexing nil: attempt to index a nil value (field 'nick').", "Lines 15–16: calling nil: attempt to call a nil value (field 'heal')."] },
        mistake: "Guessing instead of checking. One print(type(x), x) right before the failing line usually solves the mystery."
      } },
    { title: "Lua in Games", chapter: "Beyond the basics · Lua shelf", line: ["function love.update(dt)", "player.x = player.x + speed * dt"],
      content: {
        story: ["Games run in a loop: many times a second the game updates the world, then draws it. In LÖVE you fill in love.load (start), love.update(dt) (move things) and love.draw() (paint the screen).",
          "dt (delta time) is the seconds since the last frame. Multiply speeds by dt — x = x + speed * dt — and objects move at the same speed on fast and slow computers.",
          "This example runs a tiny pretend version of that loop in plain Lua, so you can see the update cycle and dt at work."],
        big: "A game loop updates then draws every frame; multiplying by dt keeps movement the same speed on every computer.",
        caption: "Frames tick by; a player slides across at 100 pixels per second, whatever the frame rate. Tap Play.",
        demo: ["love.load() → set up", "love.update(dt) → move", "love.draw() → paint", "x = x + speed * dt"]
      },
      deep: {
        more: ["Real LÖVE games also handle input with love.keypressed(key) and love.mouse, and load images with love.graphics.newImage.",
          "Defold, Solar2D and PICO-8 are other game engines and consoles that use Lua."],
        ex: { code: src(["-- A pretend LÖVE: the real one calls these for you every frame.", "local love = {graphics = {}}", "function love.graphics.print(text) print(\"draw: \" .. text) end", "", "local player = {x = 0, speed = 100}", "", "function love.update(dt)", "  player.x = player.x + player.speed * dt", "end", "", "function love.draw()", "  love.graphics.print(string.format(\"player at x = %.0f\", player.x))", "end", "", "for _, dt in ipairs({0.5, 0.25, 0.25}) do", "  love.update(dt)", "  love.draw()", "end"]),
          walk: ["Lines 2–3: a stand-in for LÖVE's drawing.", "Lines 7–9: update moves the player by speed × dt.", "Lines 11–13: draw shows where it is.", "Lines 15–18: three frames of different lengths: x = 50, 75, then 100 — exactly 1 second at 100 per second."] },
        mistake: "Moving by a fixed amount each frame: x = x + 2. On a fast computer the player zooms; on a slow one it crawls. Multiply by dt."
      } },
    { title: "Roblox and Luau", chapter: "Beyond the basics · Lua shelf", line: ["local part = Instance.new(\"Part\")", "part.Touched:Connect(onTouched)"],
      content: {
        story: ["Roblox games are scripted in Luau, a language based on Lua 5.1. Almost everything in this track carries over: local, tables, functions, if, for, metatables.",
          "Luau adds type annotations (local hp: number = 100), compound operators like += and -=, string interpolation with backticks, and continue. Roblox adds its game API: game:GetService(\"Players\"), Instance.new(\"Part\"), task.wait(1), and events.",
          "Events are the heart of Roblox scripting: part.Touched:Connect(function(hit) … end) runs your function whenever something touches the part. This example builds a tiny event in plain Lua to show the idea."],
        big: "Roblox uses Luau, close to Lua plus types and +=; games are built from events you :Connect functions to.",
        caption: "A part is touched; its event fires and every connected function runs. Tap Play.",
        demo: ["part.Touched:Connect(onTouched)", "something touches the part", "Fire → onTouched(hit)", "coins += 1 (Luau)"]
      },
      deep: {
        more: ["Roblox Studio is free, and the Creator Hub (create.roblox.com) has guides from first part to full game.",
          "Server scripts and LocalScripts run in different places: game rules belong on the server, where players can't tamper with them."],
        ex: { code: src(["-- A tiny stand-in for a Roblox event, in plain Lua.", "local Signal = {}", "Signal.__index = Signal", "", "function Signal.new() return setmetatable({handlers = {}}, Signal) end", "", "function Signal:Connect(fn) table.insert(self.handlers, fn) end", "", "function Signal:Fire(...)", "  for _, fn in ipairs(self.handlers) do fn(...) end", "end", "", "local part = {Name = \"Coin\", Touched = Signal.new()}", "local coins = 0", "part.Touched:Connect(function(hit)", "  coins = coins + 1", "  print(hit .. \" touched the \" .. part.Name .. \"! coins: \" .. coins)", "end)", "part.Touched:Fire(\"Ana\")", "part.Touched:Fire(\"Leo\")"]),
          walk: ["Lines 2–11: a Signal keeps a list of functions and calls them all on Fire.", "Lines 13–18: like part.Touched in Roblox: connect a function to the event.", "Lines 19–20: Ana touched the Coin! coins: 1, then Leo touched the Coin! coins: 2."] },
        mistake: "Doing everything in a while true do loop instead of reacting to events. Loops that never wait freeze the game; connect to events, or use task.wait inside loops."
      } },
    { title: "Testing Lua Code", chapter: "Beyond the basics · Lua shelf", line: ["assert(grade(95) == \"A\")", "busted spec/"],
      content: {
        story: ["The simplest test is assert: assert(grade(95) == \"A\", \"95 should be an A\") stops with your message if the answer is wrong.",
          "A table of cases keeps tests tidy: list each input with the answer you expect, loop over them, and report any that disagree.",
          "Bigger projects use a framework such as busted (luarocks install busted), with describe and it blocks and helpful failure messages."],
        big: "assert checks one answer; a table of cases checks many; frameworks like busted organize big test suites.",
        caption: "A checklist of cases gets ticked one by one: 95 → A, 85 → B, 40 → C. Tap Play.",
        demo: ["assert(grade(95) == \"A\")", "cases: {95, \"A\"}, {85, \"B\"}", "for … check each", "4 checks passed"]
      },
      deep: {
        more: ["Test the edges: 89 and 90 are where grade bugs hide.",
          "Check that bad input is refused: pcall(grade, 101) should come back false."],
        ex: { code: src(["local function grade(score)", "  assert(type(score) == \"number\" and score >= 0 and score <= 100, \"score must be 0-100\")", "  if score >= 90 then return \"A\" end", "  if score >= 80 then return \"B\" end", "  return \"C\"", "end", "", "local cases = {{95, \"A\"}, {90, \"A\"}, {89, \"B\"}, {40, \"C\"}}", "local failures = 0", "for _, case in ipairs(cases) do", "  local got = grade(case[1])", "  if got ~= case[2] then", "    failures = failures + 1", "    print(\"grade(\" .. case[1] .. \") = \" .. got .. \", want \" .. case[2])", "  end", "end", "local refused = not pcall(grade, 101)", "assert(refused, \"101 should be refused\")", "print((#cases + 1) .. \" checks, \" .. failures .. \" failures\")"]),
          walk: ["Lines 1–6: the code under test; assert refuses bad scores.", "Line 8: a table of cases, including the boundaries 90 and 89.", "Lines 10–16: each case is checked and any mismatch reported.", "Lines 17–18: bad input must be refused.", "Line 19: 5 checks, 0 failures."] },
        mistake: "Only testing the easy middle case. Bugs live at the edges, so test 89 and 90, 0 and 100."
      } }
  ];

  var glossary = [
    ["..", "Joins strings."],
    ["#", "Gives the length of a string or list."],
    ["//", "Floor division: divides and rounds down."],
    ["~=", "Not equal."],
    ["and / or / not", "Logic words; and/or also pick values."],
    ["assert", "Raises an error if a value is nil or false."],
    ["boolean", "true or false."],
    ["break", "Leaves a loop early."],
    ["closure", "A function that remembers variables from where it was made."],
    ["colon syntax", "obj:method() passes obj as self."],
    ["coroutine", "A function that can pause with yield and resume later."],
    ["dt", "Delta time: seconds since the last game frame."],
    ["elseif", "Tries another test after an if."],
    ["end", "Closes a function, if, loop or do block."],
    ["error", "Raises an error with a message."],
    ["false", "One of only two values Lua treats as false."],
    ["float", "A number with a decimal part, like 3.5."],
    ["for", "A loop: numeric (for i = 1, 5) or generic (for k, v in pairs(t))."],
    ["function", "A block of code you can call; also a value."],
    ["global", "A variable visible everywhere; avoid them."],
    ["gmatch", "Loops over every pattern match in a string."],
    ["goto", "Jumps to a label, used for continue."],
    ["gsub", "Replaces pattern matches in a string."],
    ["__index", "A metamethod saying where to look for missing keys."],
    ["integer", "A whole number subtype, like 3."],
    ["io.open", "Opens a file."],
    ["ipairs", "Walks a list in order from 1."],
    ["LÖVE", "A free game framework that uses Lua."],
    ["local", "Makes a variable local to its block."],
    ["Luau", "Roblox's version of Lua, with types and extras."],
    ["math library", "math.floor, max, min, sqrt, random and more."],
    ["metamethod", "A special key like __add that changes how a table behaves."],
    ["metatable", "A table that changes another table's behavior."],
    ["method", "A function stored in a table and called with a colon."],
    ["module", "A file that returns a table of functions."],
    ["nil", "The value meaning nothing."],
    ["number", "Lua's type for numbers, integers and floats."],
    ["os library", "Time, dates and the system."],
    ["pairs", "Visits every key and value, in no fixed order."],
    ["pattern", "Lua's text-matching mini-language, like %d+."],
    ["pcall", "Calls a function in protected mode, catching errors."],
    ["print", "Shows values on a line."],
    ["repeat-until", "A loop that runs before testing."],
    ["require", "Loads a module once and returns it."],
    ["return", "Hands back one or more values from a function."],
    ["Roblox", "A game platform scripted in Luau."],
    ["self", "The table a method was called on."],
    ["setmetatable", "Gives a table a metatable."],
    ["string", "Text."],
    ["string library", "upper, lower, rep, sub, find, format and more."],
    ["table", "Lua's only data structure: lists, dictionaries and objects."],
    ["table.concat", "Joins a list into text."],
    ["table.insert", "Adds an item to a list."],
    ["table.remove", "Takes an item out of a list."],
    ["table.sort", "Sorts a list in place."],
    ["table.unpack", "Spreads a list into separate values."],
    ["tonumber", "Turns text into a number, or nil."],
    ["tostring", "Turns any value into text."],
    ["true", "The boolean yes."],
    ["type", "Tells you a value's type as text."],
    ["utf8 library", "Works with text in any language."],
    ["varargs", "... — any number of extra arguments."],
    ["while", "Repeats while a test is true."],
    ["yield", "Pauses a coroutine and hands back a value."],
    ["__tostring", "A metamethod deciding how a table prints."],
    ["__add", "A metamethod making + work for tables."],
    ["__eq", "A metamethod making == compare tables by content."],
    ["luacheck", "A linter that catches typos and globals."],
    ["LuaRocks", "Lua's package manager."],
    ["package.path", "Where require looks for module files."]
  ];

  var field = [
    { name: "print / io.write", head: "base / io", what: "Print with or without a new line.", ex: "io.write(\"a\", \"b\")" },
    { name: "string.format", head: "string", what: "Fill text with %s, %d, %.2f.", ex: "string.format(\"%.2f\", 3.14159)" },
    { name: "upper / lower / rep / sub", head: "string", what: "Change, repeat and cut text.", ex: "(\"ha\"):rep(3)" },
    { name: "find / match / gmatch / gsub", head: "string", what: "Search and replace with patterns.", ex: "s:match(\"(%d+)\")" },
    { name: "table.insert / remove", head: "table", what: "Grow and shrink lists.", ex: "table.insert(t, 4)" },
    { name: "table.sort / concat", head: "table", what: "Sort in place, or join into text.", ex: "table.concat(t, \", \")" },
    { name: "ipairs / pairs", head: "base", what: "Walk a list in order, or every key.", ex: "for i, v in ipairs(t) do … end" },
    { name: "tonumber / tostring", head: "base", what: "Convert between text and numbers.", ex: "tonumber(\"42\")" },
    { name: "math.floor / max / random", head: "math", what: "Rounding, biggest, and dice rolls.", ex: "math.random(1, 6)" },
    { name: "pcall / error / assert", head: "base", what: "Raise and catch errors.", ex: "local ok, err = pcall(f)" },
    { name: "setmetatable / __index", head: "base", what: "Build objects and classes.", ex: "setmetatable(o, Class)" },
    { name: "io.open / io.lines", head: "io", what: "Read and write files.", ex: "for line in io.lines(\"a.txt\") do … end" },
    { name: "os.time / os.date", head: "os", what: "The time, and formatted dates.", ex: "os.date(\"%Y-%m-%d\")" },
    { name: "coroutine.wrap / yield", head: "coroutine", what: "Functions that pause and resume.", ex: "coroutine.yield(value)" },
    { name: "require", head: "package", what: "Load a module once.", ex: "local m = require(\"mymodule\")" }
  ];

  var cheats = [
    { title: "Program Card", body: "A Lua file runs top to bottom.", code: src(["-- main.lua", "print(\"Hello\")", "local name = \"Ana\"", "print(\"Hi, \" .. name .. \"!\")"]) },
    { title: "Values Card", body: "Everyday values.", code: src(["local n = 42", "local x = 3.14", "local name = \"Ana\"", "local ok = true", "local nothing = nil", "local text = tostring(n)", "local back = tonumber(\"7\")", "print(type(n))"]) },
    { title: "Decisions Card", body: "if and friends.", code: src(["if x > 0 then", "  print(\"positive\")", "elseif x == 0 then", "  print(\"zero\")", "else", "  print(\"negative\")", "end", "if x ~= 0 then print(\"not zero\") end", "local size = n > 10 and \"big\" or \"small\""]) },
    { title: "Loops Card", body: "Every way to repeat.", code: src(["for i = 1, 5 do print(i) end", "for i = 10, 1, -1 do print(i) end", "for i, v in ipairs(list) do print(i, v) end", "for k, v in pairs(t) do print(k, v) end", "while lives > 0 do lives = lives - 1 end", "repeat tries = tries + 1 until tries >= 3"]) },
    { title: "Tables Card", body: "Lists and dictionaries.", code: src(["local list = {10, 20, 30}", "table.insert(list, 40)", "print(list[1], #list)", "local player = {name = \"Ana\", hp = 100}", "player.level = 2", "player.hp = nil", "print(table.concat(list, \", \"))"]) },
    { title: "Functions Card", body: "Functions as values.", code: src(["local function add(a, b) return a + b end", "local function divmod(a, b) return a // b, a % b end", "local q, r = divmod(17, 5)", "local double = function(x) return x * 2 end", "table.sort(list, function(a, b) return a > b end)"]) },
    { title: "Objects Card", body: "A class from tables.", code: src(["local Box = {}", "Box.__index = Box", "", "function Box.new(size)", "  return setmetatable({size = size or 1}, Box)", "end", "", "function Box:grow()", "  self.size = self.size + 1", "end", "", "local b = Box.new()", "b:grow()"]) },
    { title: "Errors Card", body: "error, pcall, assert.", code: src(["local ok, err = pcall(function()", "  error(\"something broke\")", "end)", "if not ok then print(err) end", "assert(score >= 0, \"score can't be negative\")"]) }
  ];

  function stars(n) { return new Array(n + 1).join("*"); }
  function padR(s, w) { while (s.length < w) s += " "; return s; }
  function padL(s, w) { s = String(s); while (s.length < w) s = " " + s; return s; }
  function M(decls, body) { return decls.length ? decls.concat([""], body) : body; }

  var projects = [
    { name: "Rocket Countdown", about: "A for loop with a step of -1 counts down to blast off.",
      vars: [{ key: "start", val: 5, min: 1, max: 12 }],
      code: function (v) { return M([], ["local start = " + v.start, "for i = start, 1, -1 do", "  print(i .. \"...\")", "end", "print(\"Blast off!\")"]); },
      run: function (v) { var o = []; for (var i = v.start; i > 0; i--) o.push(i + "..."); o.push("Blast off!"); return o; },
      explain: "for i = start, 1, -1 counts from your number down to 1, and .. joins the dots on." },
    { name: "Star Steps", about: "string.rep builds each row: (\"*\"):rep(3) is ***.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return M([], ["local rows = " + v.rows, "for r = 1, rows do", "  print(string.rep(\"*\", r))", "end"]); },
      run: function (v) { var o = []; for (var r = 1; r <= v.rows; r++) o.push(stars(r)); return o; },
      explain: "string.rep repeats the star r times, so each row is one star longer than the last." },
    { name: "Coin Bank", about: "Every coin adds to the total.",
      vars: [{ key: "coins", val: 5, min: 1, max: 10 }, { key: "each", val: 25, min: 1, max: 50 }],
      code: function (v) { return M([], ["local coins = " + v.coins, "local each = " + v.each, "local total = 0", "for c = 1, coins do", "  total = total + each", "  print(\"Coin \" .. c .. \": total \" .. total)", "end"]); },
      run: function (v) { var o = [], t = 0; for (var c = 1; c <= v.coins; c++) { t += v.each; o.push("Coin " + c + ": total " + t); } return o; },
      explain: "Lua has no +=, so total = total + each adds one coin's worth each round." },
    { name: "Score Doubler", about: "A score that doubles every round.",
      vars: [{ key: "score", val: 3, min: 1, max: 50 }, { key: "rounds", val: 5, min: 1, max: 10 }],
      code: function (v) { return M([], ["local score = " + v.score, "local rounds = " + v.rounds, "for round = 1, rounds do", "  score = score * 2", "  print(\"Round \" .. round .. \": \" .. score)", "end"]); },
      run: function (v) { var o = [], s = v.score; for (var r = 1; r <= v.rounds; r++) { s *= 2; o.push("Round " + r + ": " + s); } return o; },
      explain: "score * 2 doubles it each round; the numbers stay integers, so they print without .0." },
    { name: "Times Table", about: "A multiplication table for any number.",
      vars: [{ key: "num", val: 7, min: 1, max: 12 }, { key: "upto", val: 5, min: 1, max: 12 }],
      code: function (v) { return M([], ["local num = " + v.num, "local upto = " + v.upto, "for i = 1, upto do", "  print(num .. \" x \" .. i .. \" = \" .. num * i)", "end"]); },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(v.num + " x " + i + " = " + v.num * i); return o; },
      explain: "* is worked out before .. joins the text, so num * i becomes the product first." },
    { name: "Temperature Converter", about: "Celsius to Fahrenheit with one decimal place.",
      vars: [{ key: "celsius", val: 20, min: -40, max: 100 }],
      code: function (v) { return M([], ["local celsius = " + v.celsius, "local fahrenheit = celsius * 9 / 5 + 32", "print(string.format(\"%d C is %.1f F\", celsius, fahrenheit))"]); },
      run: function (v) { return [v.celsius + " C is " + (v.celsius * 9 / 5 + 32).toFixed(1) + " F"]; },
      explain: "/ always gives a float, so nothing is rounded away. %.1f shows one decimal place." },
    { name: "Tip Calculator", about: "A tip and total for a bill, in whole dollars.",
      vars: [{ key: "bill", val: 40, min: 1, max: 500 }, { key: "percent", val: 15, min: 0, max: 30 }],
      code: function (v) { return M([], ["local bill = " + v.bill, "local percent = " + v.percent, "local tip = bill * percent // 100", "print(\"Bill: $\" .. bill)", "print(\"Tip: $\" .. tip)", "print(\"Total: $\" .. bill + tip)"]); },
      run: function (v) { var tip = Math.floor(v.bill * v.percent / 100); return ["Bill: $" + v.bill, "Tip: $" + tip, "Total: $" + (v.bill + tip)]; },
      explain: "// rounds down to whole dollars. + is worked out before .., so bill + tip is added first." },
    { name: "FizzBuzz", about: "Multiples of 3 say Fizz, of 5 say Buzz, of both say FizzBuzz.",
      vars: [{ key: "limit", val: 15, min: 1, max: 30 }],
      code: function (v) { return M([], ["local limit = " + v.limit, "for n = 1, limit do", "  if n % 15 == 0 then", "    print(\"FizzBuzz\")", "  elseif n % 3 == 0 then", "    print(\"Fizz\")", "  elseif n % 5 == 0 then", "    print(\"Buzz\")", "  else", "    print(n)", "  end", "end"]); },
      run: function (v) { var o = []; for (var n = 1; n <= v.limit; n++) o.push(n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : String(n)); return o; },
      explain: "% gives the remainder; 0 means it divides exactly. The 15 check comes first so 15 doesn't stop at Fizz." },
    { name: "Score Stats", about: "Highest, lowest and average of a table.",
      vars: [{ key: "first", val: 72, min: 0, max: 100 }, { key: "second", val: 95, min: 0, max: 100 }, { key: "third", val: 64, min: 0, max: 100 }],
      code: function (v) { return M([], ["local first = " + v.first, "local second = " + v.second, "local third = " + v.third, "local scores = {first, second, third}", "local sum = 0", "for _, s in ipairs(scores) do", "  sum = sum + s", "end", "print(\"Scores: \" .. table.concat(scores, \", \"))", "print(\"Highest: \" .. math.max(table.unpack(scores)))", "print(\"Lowest: \" .. math.min(table.unpack(scores)))", "print(string.format(\"Average: %.1f\", sum / #scores))"]); },
      run: function (v) { var a = [v.first, v.second, v.third]; return ["Scores: " + a.join(", "), "Highest: " + Math.max.apply(null, a), "Lowest: " + Math.min.apply(null, a), "Average: " + ((v.first + v.second + v.third) / 3).toFixed(1)]; },
      explain: "table.unpack spreads the scores into math.max and math.min; #scores counts them for the average." },
    { name: "Shopping Cart", about: "A list of tables adds up a receipt.",
      vars: [{ key: "apples", val: 3, min: 0, max: 10 }, { key: "pears", val: 2, min: 0, max: 10 }],
      code: function (v) { return M([], ["local apples = " + v.apples, "local pears = " + v.pears, "local cart = {", "  {name = \"Apple\", price = 50, qty = apples},", "  {name = \"Pear\", price = 75, qty = pears},", "  {name = \"Bread\", price = 250, qty = 1},", "}", "local total = 0", "for _, item in ipairs(cart) do", "  local cost = item.price * item.qty", "  total = total + cost", "  print(string.format(\"%-6s x%d %5d\", item.name, item.qty, cost))", "end", "print(string.format(\"Total: $%.2f\", total / 100))"]); },
      run: function (v) {
        var cart = [["Apple", 50, v.apples], ["Pear", 75, v.pears], ["Bread", 250, 1]], o = [], t = 0;
        cart.forEach(function (it) { var c = it[1] * it[2]; t += c; o.push(padR(it[0], 6) + " x" + it[2] + " " + padL(c, 5)); });
        o.push("Total: $" + Math.floor(t / 100) + "." + (t % 100 < 10 ? "0" : "") + (t % 100));
        return o;
      },
      explain: "Prices are in cents to keep the math exact. %-6s pads the name, %5d lines up the cost, and %.2f shows dollars and cents." },
    { name: "Class Vote", about: "A table counts votes; sorted keys print in order.",
      vars: [{ key: "ana", val: 3, min: 0, max: 20 }, { key: "leo", val: 5, min: 0, max: 20 }],
      code: function (v) { return M([], ["local ana = " + v.ana, "local leo = " + v.leo, "local votes = {Mia = 4, Ana = ana, Leo = leo}", "votes.Ana = votes.Ana + 2", "local names = {}", "for name in pairs(votes) do table.insert(names, name) end", "table.sort(names)", "local total = 0", "for _, name in ipairs(names) do", "  print(name .. \": \" .. votes[name])", "  total = total + votes[name]", "end", "print(\"Total votes: \" .. total)"]); },
      run: function (v) { return ["Ana: " + (v.ana + 2), "Leo: " + v.leo, "Mia: 4", "Total votes: " + (v.ana + 2 + v.leo + 4)]; },
      explain: "pairs visits keys in any order, so the names are collected and sorted first." },
    { name: "Hero Healing", about: "A method heals the hero, capped at 100.",
      vars: [{ key: "hp", val: 40, min: 1, max: 99 }, { key: "potion", val: 25, min: 5, max: 50 }],
      code: function (v) { return M(["local Hero = {}", "Hero.__index = Hero", "", "function Hero.new(name, hp)", "  return setmetatable({name = name, hp = hp}, Hero)", "end", "", "function Hero:heal(amount)", "  self.hp = math.min(self.hp + amount, 100)", "end"], ["local hp = " + v.hp, "local potion = " + v.potion, "local hero = Hero.new(\"Ana\", hp)", "while hero.hp < 100 do", "  hero:heal(potion)", "  print(hero.name .. \" drinks a potion: \" .. hero.hp .. \" HP\")", "end"]); },
      run: function (v) { var o = [], hp = v.hp; while (hp < 100) { hp = Math.min(hp + v.potion, 100); o.push("Ana drinks a potion: " + hp + " HP"); } return o; },
      explain: "hero:heal(potion) passes hero as self, so the method changes this hero; math.min caps the health at 100." },
    { name: "Shape Areas", about: "Two kinds of table answer the same methods.",
      vars: [{ key: "w", val: 4, min: 1, max: 20 }, { key: "h", val: 3, min: 1, max: 20 }, { key: "side", val: 5, min: 1, max: 20 }],
      code: function (v) { return M(["local Rect = {}", "Rect.__index = Rect", "function Rect.new(w, h) return setmetatable({w = w, h = h}, Rect) end", "function Rect:area() return self.w * self.h end", "function Rect:name() return \"rectangle\" end", "", "local Square = {}", "Square.__index = Square", "function Square.new(side) return setmetatable({side = side}, Square) end", "function Square:area() return self.side * self.side end", "function Square:name() return \"square\" end"], ["local w = " + v.w, "local h = " + v.h, "local side = " + v.side, "local shapes = {Rect.new(w, h), Square.new(side)}", "local total = 0", "for _, shape in ipairs(shapes) do", "  print(shape:name() .. \": \" .. shape:area())", "  total = total + shape:area()", "end", "print(\"Total area: \" .. total)"]); },
      run: function (v) { var a = v.w * v.h, b = v.side * v.side; return ["rectangle: " + a, "square: " + b, "Total area: " + (a + b)]; },
      explain: "Rect and Square share no parent, but both have area and name, so one loop works for both." },
    { name: "Cookie Sharing", about: "error and pcall refuse to divide by zero.",
      vars: [{ key: "cookies", val: 12, min: 0, max: 50 }, { key: "friends", val: 4, min: 0, max: 10 }],
      code: function (v) { return M(["local function share(cookies, friends)", "  if friends == 0 then error(\"no friends to share with\", 0) end", "  return cookies // friends, cookies % friends", "end"], ["local cookies = " + v.cookies, "local friends = " + v.friends, "local ok, each, left = pcall(share, cookies, friends)", "if ok then", "  print(\"Each friend gets \" .. each)", "  print(\"Left over: \" .. left)", "else", "  print(\"Error: \" .. each)", "end"]); },
      run: function (v) { if (v.friends === 0) return ["Error: no friends to share with"]; return ["Each friend gets " + Math.floor(v.cookies / v.friends), "Left over: " + v.cookies % v.friends]; },
      explain: "Set friends to 0: share raises an error, and pcall returns false with the message instead of crashing." },
    { name: "Grade Bands", about: "An if-elseif chain turns scores into grades.",
      vars: [{ key: "ana", val: 92, min: 0, max: 100 }, { key: "leo", val: 78, min: 0, max: 100 }, { key: "mia", val: 85, min: 0, max: 100 }],
      code: function (v) { return M(["local function grade(score)", "  if score >= 90 then return \"A\"", "  elseif score >= 80 then return \"B\"", "  elseif score >= 70 then return \"C\"", "  else return \"Keep going\" end", "end"], ["local ana = " + v.ana, "local leo = " + v.leo, "local mia = " + v.mia, "local class = {{\"Ana\", ana}, {\"Leo\", leo}, {\"Mia\", mia}}", "for _, pair in ipairs(class) do", "  print(pair[1] .. \": \" .. pair[2] .. \" is \" .. grade(pair[2]))", "end"]); },
      run: function (v) {
        function g(s) { return s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : "Keep going"; }
        return [["Ana", v.ana], ["Leo", v.leo], ["Mia", v.mia]].map(function (r) { return r[0] + ": " + r[1] + " is " + g(r[1]); });
      },
      explain: "The chain checks from the top and stops at the first true test, so 95 gets an A, not a B." },
    { name: "Even Squares", about: "A loop builds a table of even squares.",
      vars: [{ key: "n", val: 6, min: 2, max: 20 }],
      code: function (v) { return M([], ["local n = " + v.n, "local squares, sum = {}, 0", "for x = 2, n, 2 do", "  table.insert(squares, x * x)", "  sum = sum + x * x", "end", "print(\"Evens squared: \" .. table.concat(squares, \" \"))", "print(\"Sum: \" .. sum)"]); },
      run: function (v) { var s = []; for (var x = 2; x <= v.n; x += 2) s.push(x * x); return ["Evens squared: " + s.join(" "), "Sum: " + s.reduce(function (a, b) { return a + b; }, 0)]; },
      explain: "for x = 2, n, 2 steps through the even numbers only; table.concat joins the squares." },
    { name: "Name Tags", about: "String functions make name tags.",
      vars: [{ key: "keep", val: 3, min: 1, max: 8 }],
      code: function (v) { return M([], ["local keep = " + v.keep, "for _, name in ipairs({\"Ana\", \"Leonardo\", \"Mia\"}) do", "  local tag = name:upper() .. string.rep(\".\", 10 - #name)", "  print(tag .. \" \" .. #name .. \" \" .. name:sub(1, keep))", "end"]); },
      run: function (v) { return ["Ana", "Leonardo", "Mia"].map(function (n) { var t = n.toUpperCase(); while (t.length < 10) t += "."; return t + " " + n.length + " " + n.substr(0, v.keep); }); },
      explain: "string.rep fills the tag out to 10 characters with dots; name:sub(1, keep) keeps the first letters — strings count from 1." },
    { name: "Number Guesser", about: "Halving the range finds any number from 1 to 100 in 7 guesses or fewer.",
      vars: [{ key: "secret", val: 37, min: 1, max: 100 }],
      code: function (v) { return M([], ["local secret = " + v.secret, "local low, high, tries = 1, 100, 0", "while true do", "  tries = tries + 1", "  local guess = (low + high) // 2", "  if guess == secret then", "    print(\"Got it: \" .. guess .. \" in \" .. tries .. \" tries\")", "    break", "  elseif guess < secret then", "    print(guess .. \" is too low\")", "    low = guess + 1", "  else", "    print(guess .. \" is too high\")", "    high = guess - 1", "  end", "end"]); },
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
      explain: "Each guess is the middle of what's left (// keeps it a whole number), so every wrong answer throws away half the numbers." }
  ];

  var vt = [
    { line: 'print("{w}")', why: "print shows a line." },
    { line: "print({v})", why: "print shows any value." },
    { line: 'print("{w}: " .. {v})', why: ".. joins text and a value." },
    { line: 'print(string.format("%d", {v}))', why: "%d formats a whole number." },
    { line: "local {v} = {n}", why: "Always use local." },
    { line: "local {v} = {dec}", why: "A decimal is a float." },
    { line: "local {v} = {b}", why: "true or false." },
    { line: 'local {sv} = "{w}"', why: "Text in quotes is a string." },
    { line: "local {v} = nil", why: "nil means no value." },
    { line: "{v} = {v} + {n}", why: "Lua has no +=; write it out." },
    { line: "{v} = {v} - {d}", why: "Take away from the current value." },
    { line: "{v} = {v} * {d}", why: "Multiply the current value." },
    { line: "local {v} = {u} % {d}", why: "% gives the remainder." },
    { line: "local {v} = {u} // {d}", why: "// divides and rounds down." },
    { line: "local {v} = {u} / {d}", why: "/ always gives a float." },
    { line: "local {v} = {u} ^ {d}", why: "^ is power, giving a float." },
    { line: "local {v} = math.max({u}, {n})", why: "math.max picks the biggest." },
    { line: "local {v} = math.floor({dec})", why: "math.floor rounds down." },
    { line: 'local {sv} = "{w}" .. {sv}', why: ".. joins strings." },
    { line: 'local {sv} = string.upper("{w}")', why: "upper makes capitals." },
    { line: 'local {sv} = ("{w}"):rep({d})', why: "rep repeats a string." },
    { line: "print(#{sv})", why: "# gives the length." },
    { line: 'if {v} > {n} then print("{w}") end', why: "if … then … end." },
    { line: "if {v} == {n} then {u} = 0 end", why: "== compares values." },
    { line: "elseif {v} < {d} then", why: "elseif tries another test." },
    { line: 'local {sv} = {v} > {n} and "{w}" or "none"', why: "and/or picks a value." },
    { line: "if not {v} then {v} = {n} end", why: "not flips true and false." },
    { line: "for i = 1, {n} do {v} = {v} + i end", why: "Both ends are included." },
    { line: "for i = {n}, 1, -{d} do print(i) end", why: "A negative step counts down." },
    { line: "while {v} > 0 do {v} = {v} - 1 end", why: "while repeats while true." },
    { line: "repeat {v} = {v} + 1 until {v} >= {n}", why: "repeat runs at least once." },
    { line: "local {arr} = { {n}, {n2}, {n3} }", why: "A table used as a list." },
    { line: "table.insert({arr}, {n})", why: "insert adds to the end." },
    { line: "print(#{arr})", why: "# counts the list." },
    { line: "for i, x in ipairs({arr}) do {v} = {v} + x end", why: "ipairs walks a list in order." },
    { line: "table.sort({arr})", why: "sort orders the list in place." },
    { line: 'print(table.concat({arr}, ", "))', why: "concat joins a list into text." },
    { line: "local {m} = { {w} = {n} }", why: "A table with named keys." },
    { line: "{m}.{v} = {n}", why: "Dot syntax sets a named key." },
    { line: '{m}["{w}"] = {n}', why: "Brackets set any key." },
    { line: "for key, value in pairs({m}) do print(key, value) end", why: "pairs visits every key." },
    { line: "{m}.{v} = nil", why: "nil removes a key." },
    { line: "local function {f}({v}) return {v} * {d} end", why: "A local function with a result." },
    { line: 'function {f}() print("{w}") end', why: "A function with no inputs." },
    { line: "{f}({n})", why: "Call a function." },
    { line: "local {v} = {f}({u})", why: "Store a function's result." },
    { line: "local {v}, {u} = {f}()", why: "Catch two results." },
    { line: "local {f} = function(x) return x + {n} end", why: "A function stored in a variable." },
    { line: "local {c} = {}", why: "A class starts as a table." },
    { line: "{c}.__index = {c}", why: "Objects look here for methods." },
    { line: "function {c}.new({v}) return setmetatable({ {v} = {v} }, {c}) end", why: "new builds an object." },
    { line: "function {c}:{f}() self.{v} = self.{v} + {d} end", why: "The colon adds self." },
    { line: "local {o} = {c}.new({n})", why: "Make an object." },
    { line: "{o}:{f}()", why: "Call a method with a colon." },
    { line: "setmetatable({k}, { __index = {c} })", why: "Inherit by chaining __index." },
    { line: "local ok, err = pcall({f}, {n})", why: "pcall catches errors." },
    { line: 'error("{w} failed")', why: "error raises a problem." },
    { line: 'assert({v} > 0, "{w}")', why: "assert checks something that must be true." },
    { line: 'local file = io.open("{w}.txt", "w")', why: "io.open opens a file." },
    { line: 'local {sv} = string.format("%s has %d", "{w}", {v})', why: "format fills in values." },
    { line: 'for word in string.gmatch({sv}, "%a+") do print(word) end', why: "gmatch finds every match." },
    { line: 'local {sv} = {sv}:gsub("{w}", "{L}")', why: "gsub replaces matches." },
    { line: "local co = coroutine.wrap(function() coroutine.yield({n}) end)", why: "A coroutine pauses with yield." },
    { line: 'local {m} = require("{sv}")', why: "require loads a module." }
  ];
  var themes = [
    { name: "Print & Talk", t: [0, 1, 2, 3, 7] },
    { name: "Locals", t: [4, 5, 6, 7, 8] },
    { name: "Nil & Truth", t: [8, 26, 6, 25, 4] },
    { name: "Math Moves", t: [9, 10, 11, 12, 13] },
    { name: "Number Tools", t: [14, 15, 16, 17, 12] },
    { name: "Strings", t: [18, 19, 20, 21, 59] },
    { name: "Decisions", t: [22, 23, 24, 25, 26] },
    { name: "Loops", t: [27, 28, 29, 30, 9] },
    { name: "Lists", t: [31, 32, 33, 34, 35] },
    { name: "Table Tools", t: [35, 36, 32, 33, 31] },
    { name: "Dictionaries", t: [37, 38, 39, 40, 41] },
    { name: "Functions", t: [42, 43, 44, 45, 46] },
    { name: "Closures", t: [47, 42, 45, 44, 46] },
    { name: "Classes", t: [48, 49, 50, 51, 52] },
    { name: "Objects", t: [52, 53, 51, 54, 50] },
    { name: "Errors", t: [55, 56, 57, 23, 22] },
    { name: "Files & Patterns", t: [58, 59, 60, 61, 18] },
    { name: "Coroutines & Modules", t: [62, 63, 47, 42, 43] },
    { name: "Mixed Practice", t: [25, 34, 39, 51, 57] },
    { name: "Lua Masters", t: [40, 50, 55, 60, 62] }
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
    sandboxNote: "Thirty everyday Lua lines, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your Lua progress is saved separately from every other track.",
    sourcesHTML: 'Lua facts and syntax follow the <a href="https://www.lua.org/manual/5.4/">Lua 5.4 Reference Manual</a> and <a href="https://www.lua.org/pil/">Programming in Lua</a>. Roblox and Luau are trademarks of their owners; Code Block is not affiliated with Roblox. Every explanation is written in Code Block’s own words, and every practice program is run by the real Lua 5.4 interpreter before it ships.'
  };
});
