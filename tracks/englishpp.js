"use strict";
/* ================= ENGLISH++ — a Code Block track =================
   Programming in plain English that turns into real C++, written for
   Code Block from "The English++ Book" (for English++ Studio 3).
   English++ Studio is a Windows program, so it can't run inside the
   content checks: every PC project and library example is run instead
   by a stand-in interpreter written from the book
   (tests/content/englishpp.js), a project's output must match the app,
   and every Vault line is read by it in the program shape it belongs
   in. Where the book doesn't settle how something prints (a yes or no,
   a whole collection), these lessons don't print it.
   The 30 Sandbox drills use the book's main form, three words on every
   line (who · the root · what), and are checked by
   tests/content/englishpp3.js. The Library, PC and Vault still use the
   sentence form for now. */
cbRegisterTrack("englishpp", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Hello Block", short: "Hello", chapter: "English++ Book Ch. 2 · Hello!", icon: "i-say", verb: "say",
      line: 'out prn "Hello"',
      explain: "Every English++ line has exactly three words: who, the root, and what. out is the screen, prn means print a line, and the text in quote marks counts as one word, spaces and all. No brackets, no semicolons — the line ends where it ends." },
    { name: "Name Block", short: "Name", chapter: "English++ Book Ch. 6 · Names and Values", icon: "i-box", verb: "store",
      line: "score is 0",
      explain: "is gives a name a value. Read it just like English: score is 0. English++ works out the kind for you — 0 is a whole number, so score becomes a whole-number box." },
    { name: "Make Block", short: "Make", chapter: "English++ Book Ch. 6 · Names and Values", icon: "i-plus-square", verb: "make",
      line: "score mak num",
      explain: "mak makes a new, empty box of the kind you name in the last spot. num is a whole number. The m family makes things: the first letter is the family, the other two are the job." },
    { name: "Constant Block", short: "Constant", chapter: "English++ Book Ch. 6 · Names and Values", icon: "i-anchor", verb: "keep",
      line: "LIMIT mkn 100",
      explain: "mkn makes a constant — a value that can never change, like the number of days in a week. Writing the name in capitals is a friendly signal to readers that it stays put." },
    { name: "Ask Block", short: "Ask", chapter: "English++ Book Ch. 26 · Talking With Your Program", icon: "i-keyboard", verb: "listen",
      line: 'name get "Name?"',
      explain: "get shows the question in the last spot, waits for the person to type an answer and press Enter, and puts what they typed into the box in the first spot. One line asks and remembers." },
    { name: "Add Block", short: "Add", chapter: "English++ Book Ch. 8 · Math", icon: "i-calc", verb: "add",
      line: "total add price",
      explain: "add changes a box in place: it adds price to whatever total already holds. Its cousins work the same way — asb subtracts, aml multiplies, adv divides. The a family is arithmetic." },
    { name: "Math Block", short: "Math", chapter: "English++ Book Ch. 8 · Math", icon: "i-brackets", verb: "work out",
      line: "c is a+b*2",
      explain: "Math goes in one word with no spaces, so the line still has three words. Times comes before plus, just like in school: b*2 is worked out first, then a is added. c is a + b*2 would be five words — a mistake." },
    { name: "Text Block", short: "Text", chapter: "English++ Book Ch. 9 · Text", icon: "i-link", verb: "shout",
      line: "loud is tuc&name",
      explain: "tuc gives back a text in uppercase. The & hands name to it — read & as with: tuc with name. The t family works with text: tlc lowercases, tsz tells the size, trv reverses." },
    { name: "If Block", short: "If", chapter: "English++ Book Ch. 11 · If and Otherwise", icon: "i-fork", verb: "choose",
      line: "hp ilt 1",
      explain: "ilt means if less than: if hp is less than 1, do the lines moved in underneath. The i family asks questions — ieq equal, ine not equal, igt greater than. The block ends where the lines stop being moved in." },
    { name: "Otherwise-If Block", short: "Else If", chapter: "English++ Book Ch. 11 · If and Otherwise", icon: "i-help", verb: "ask again",
      line: "hp olt 50",
      explain: "The o family is otherwise. olt goes right after an if block and asks a second question only when the first one said no: otherwise, if hp is less than 50, do these lines." },
    { name: "Otherwise Block", short: "Otherwise", chapter: "English++ Book Ch. 11 · If and Otherwise", icon: "i-swap-h", verb: "fall back",
      line: "now oth now",
      explain: "oth means all the other times. It needs no who and no what, so both spots are filled with now — the word that means nothing goes here. Its lines run when every question above said no." },
    { name: "Switch Block", short: "Switch", chapter: "English++ Book Ch. 11 · If and Otherwise", icon: "i-toggle", verb: "pick",
      line: "day bsw now",
      explain: "bsw means switch: it picks one value to check against many. Under it, each now bcs 1 line is a case — if day is 1, do these. It is a neater way to write a long ladder of ifs." },
    { name: "Count Block", short: "Count", chapter: "English++ Book Ch. 12 · Loops", icon: "i-repeat", verb: "count",
      line: "i flt 5",
      explain: "flt counts with i, starting at 0, while it is less than 5 — so the moved-in lines run with i as 0, 1, 2, 3 and 4. The f family is for: fle counts while less or equal, fgt counts down." },
    { name: "While Block", short: "While", chapter: "English++ Book Ch. 12 · Loops", icon: "i-clock", verb: "wait",
      line: "lives wgt 0",
      explain: "wgt means while greater than: keep repeating the lines underneath while lives is greater than 0. Something inside must change lives, or the loop would never stop." },
    { name: "Forever Block", short: "Forever", chapter: "English++ Book Ch. 12 · Loops", icon: "i-rotate", verb: "repeat",
      line: "now wfv now",
      explain: "wfv means while forever. It needs no who and no what, so both spots say now. A forever loop keeps going until something inside it breaks out." },
    { name: "Break Block", short: "Break", chapter: "English++ Book Ch. 12 · Loops", icon: "i-stop", verb: "leave",
      line: "now ebk now",
      explain: "ebk breaks out of the loop it is in. The e family is exit: enx skips to the next turn of the loop, ert returns from a function, ext ends the whole program." },
    { name: "List Block", short: "List", chapter: "English++ Book Ch. 13 · Lists", icon: "i-boxes", verb: "line up",
      line: "scores is 10&20&30",
      explain: "& joins values: read it as and — scores is 10 and 20 and 30. The whole list has no spaces, so it is one word. Reach in with @: scores@0 is the first one, 10." },
    { name: "Each Block", short: "Each", chapter: "English++ Book Ch. 13 · Lists", icon: "i-visit", verb: "visit",
      line: "n fea scores",
      explain: "fea means for each: for each n in scores, do the lines moved in underneath. The loop hands you each item in turn, so you never count positions yourself." },
    { name: "Ask-a-List Block", short: "Count List", chapter: "English++ Book Ch. 14 · Asking a List", icon: "i-list", verb: "ask",
      line: "out prn cct&scores",
      explain: "cct counts how many things are in a collection, and & hands scores to it. The c family asks questions of a collection: csm the sum, cmx the biggest, cav the average." },
    { name: "Map Block", short: "Map", chapter: "English++ Book Ch. 15 · Maps", icon: "i-grid", verb: "file",
      line: "ages mak map@txt@num",
      explain: "A map finds a value by its key. map@txt@num is a map from texts to numbers — read the @ marks as of. Then ages@\"Ada\" is 36 files 36 under the key Ada." },
    { name: "Function Block", short: "Function", chapter: "English++ Book Ch. 17 · Functions", icon: "i-play-circle", verb: "run",
      line: "add_up dfn num",
      explain: "dfn defines a function — a little machine with a name. The last spot says what kind of answer it gives back: num, a whole number. Use now there if it gives back nothing." },
    { name: "Parameter Block", short: "Parameter", chapter: "English++ Book Ch. 17 · Functions", icon: "i-tag", verb: "take",
      line: "a dpm num",
      explain: "dpm gives the function a parameter: a box it fills from what it is handed. This line says the function takes a, a whole number. Run it with &: add_up&1&2." },
    { name: "Return Block", short: "Return", chapter: "English++ Book Ch. 17 · Functions", icon: "i-go", verb: "answer",
      line: "add_up ert a+b",
      explain: "ert returns: it hands an answer back and leaves the function. Here add_up gives back a+b. The math has no spaces, so the line is still three words." },
    { name: "Class Block", short: "Class", chapter: "English++ Book Ch. 20 · Your Own Kinds of Things", icon: "i-shapes", verb: "shape",
      line: "Dog dcl now",
      explain: "dcl defines a class — your own kind of thing, a Boxx. The moved-in lines under it say what every Dog has and can do. now in the last spot means it has no parent." },
    { name: "Field Block", short: "Field", chapter: "English++ Book Ch. 20 · Your Own Kinds of Things", icon: "i-brick", verb: "hold",
      line: "age dfd 3",
      explain: "dfd gives a class a field: something every one of them has. Every Dog gets an age that starts at 3. Reach it with @: rex@age is the age of rex." },
    { name: "Child Block", short: "Child", chapter: "English++ Book Ch. 21 · Children", icon: "i-tree", verb: "inherit",
      line: "Dog dcl Animal",
      explain: "Put a parent's name in the last spot and the new class is its child. A Dog gets everything an Animal has and can do, for free, and then adds its own tricks." },
    { name: "Pointer Block", short: "Pointer", chapter: "English++ Book Ch. 23 · Pointers", icon: "i-point", verb: "point",
      line: "p mpt x",
      explain: "mpt makes a pointer: a box that holds the place of another box. p now points at x, so *p is x itself — change *p and x changes too." },
    { name: "Try Block", short: "Try", chapter: "English++ Book Ch. 24 · When Things Go Wrong", icon: "i-shield-check", verb: "rescue",
      line: "now btr now",
      explain: "btr means try: the lines moved in under it are allowed to go wrong. If one throws a problem, the program jumps to the e bch now block — catch — instead of crashing." },
    { name: "Should Block", short: "Should", chapter: "English++ Book Ch. 25 · Checks and Tests", icon: "i-clipboard", verb: "check",
      line: "x seq 3",
      explain: "seq means x should equal 3. If it doesn't, the program stops right there and tells you. The s family is should — checks that catch a mistake the moment it happens." },
    { name: "File Block", short: "File", chapter: "English++ Book Ch. 27 · Files", icon: "i-file", verb: "save",
      line: '"a.txt" hwr "hello"',
      explain: "h is the hard drive family. hwr writes a whole file: the file's name goes first and the text goes last. Read it back with hrd&\"a.txt\", or add more with hap." }
  ];

  var chapters = [
    { title: "Hello, English++!", chapter: "Start here · print, English++ Studio, Run (F5)", line: 'print "Hello, V!"',
      content: {
        story: ["English++ is a way to tell a computer what to do using English words. A program is a list of things for the computer to do, and an English++ program reads like a story: print \"Hello, V!\" shows the words Hello, V!.",
          "You write, run and build English++ in English++ Studio. Click New Project, pick Console App, give it a name like MyFirstProgram, and the Studio writes a first program for you.",
          "Press Run (or F5) and look at the Output window at the bottom. Behind the scenes your English++ becomes real C++, the language big games and apps are made with, so what you make is a real, grown-up program."],
        big: "English++ programs are English you can read out loud: print shows words, and Run (F5) turns your program into C++ and runs it.",
        caption: "The Studio turns your words into a program, and the Output window says hello. Tap Play.",
        demo: ["New Project → Console App", "print \"Hello, V!\"", "Run (F5)", "Output: Hello, V!"]
      },
      deep: {
        more: ["Words between quote marks are called text. The computer shows text exactly as you wrote it, spaces and capital letters too.",
          "Build .exe (Ctrl+Shift+B) turns your program into a real Windows program in the project's bin folder. Double-click it to run it without the Studio."],
        ex: { code: src(["note My first English++ program.", "print \"Hello, V!\"", "print \"I am learning English++.\"", "print \"It reads like a story.\""]),
          walk: ["Line 1: a note for people; the computer skips it.", "Line 2: Hello, V! appears in the Output window.", "Lines 3–4: two more lines of words, in order, one under the other."] },
        mistake: "Forgetting a quote mark. In print \"Hello, V! there's no closing \", so English++ can't tell where the words stop. The Studio draws a wavy red line under it and says so in plain English."
      } },
    { title: "Notes for People", chapter: "Explaining · note", line: "note This program says hello to V.",
      content: {
        story: ["A line that starts with note is for people, not for the computer. The computer skips it completely.",
          "Notes explain what a program does and why. A good note says what the code can't: the player starts with 3 lives because the first level is hard.",
          "In the Studio, Ctrl+/ turns lines into notes and back. That's handy for switching part of a program off while you try something else."],
        big: "note lines are for people, and the computer skips them; use them to explain why.",
        caption: "The computer reads each line, skips the notes, and runs the rest. Tap Play.",
        demo: ["note This program says hello three times.", "print \"Hello!\"", "note The next line is the last one.", "print \"Goodbye!\""]
      },
      deep: {
        more: ["A note can say anything at all, even words English++ uses, like if or make, because the whole line is skipped.",
          "Notes don't slow a program down: English++ leaves them out when it builds the C++."],
        ex: { code: src(["note This program says hello three times.", "print \"Hello!\"", "print \"Hello again!\"", "note The next line is the last one.", "print \"Goodbye!\""]),
          walk: ["Line 1: a note, skipped.", "Lines 2–3: Hello! and Hello again!.", "Line 4: another note, skipped.", "Line 5: Goodbye!."] },
        mistake: "Writing a note without the word note at the start, like This program says hello. English++ tries to read it as something to do, and can't."
      } },
    { title: "Boxes for Things", chapter: "Remembering · make, the five kinds, constant", line: "make a number called score with 7",
      content: {
        story: ["Programs need to remember things: a score, a name, how many lives are left. English++ keeps each thing in a box with a name on it. make a number called score with 7 builds a box called score with 7 inside.",
          "Every box holds one kind of thing: a number (a whole number), a decimal (a number with a dot, like 2.5), a text (words in quote marks), a letter (one letter in small quotes, like 'A'), or a yes or no.",
          "If a box should never change, make it a constant: make a constant number called days_in_a_week with 7. A name can use letters, numbers and _, but it can't start with a number."],
        big: "make builds a named box of one kind (a number, a decimal, a text, a letter or a yes or no), and a constant box never changes.",
        caption: "Labelled boxes fill up: a number, a decimal, a text, a letter, a yes or no. Tap Play.",
        demo: ["make a number called lives with 3", "make a decimal called price with 2.5", "make a text called pet with \"Rex\"", "make a letter called grade with 'A'"]
      },
      deep: {
        more: ["print can show many things at once: print lives and price and pet puts a space between them, so it shows 3 2.5 Rex.",
          "A box made without with starts empty for its kind: 0 for a number, no words for a text. Grown-ups call these boxes variables."],
        ex: { code: src(["make a number called lives with 3", "make a decimal called price with 2.5", "make a text called pet with \"Rex\"", "make a letter called grade with 'A'", "make a yes or no called happy with yes", "make a constant number called days_in_a_week with 7", "print lives and price and pet and grade", "print days_in_a_week"]),
          walk: ["Lines 1–5: five boxes, one of each kind.", "Line 6: a constant box, which can never change.", "Line 7: and puts spaces between the things: 3 2.5 Rex A.", "Line 8: 7."] },
        mistake: "Putting the wrong kind of thing in a box, like make a number called price with 2.5. A number box holds whole numbers only, so a price with a dot needs a decimal box."
      } },
    { title: "Changing Things", chapter: "Changing · set, add, let", line: "set score to score + 5",
      content: {
        story: ["To put something new in a box, use set: set score to 10. Whatever was inside before is gone.",
          "set score to score + 5 means: take what's in score, add 5, and put the answer back in score. Adding is so common that it has a short way: add 3 to coins.",
          "let makes a box and lets English++ work out its kind from what you put in: let speed be 12 makes a number, and let name be \"Ada\" makes a text."],
        big: "set replaces what's in a box, add adds onto it, and let makes a box whose kind English++ works out.",
        caption: "The score box empties, fills with 10, then grows by 5 to 15. Tap Play.",
        demo: ["make a number called score with 0", "set score to 10", "set score to score + 5", "score is now 15"]
      },
      deep: {
        more: ["The right side of set is worked out first, using what's in the boxes right now. That's why set score to score + 5 isn't a puzzle: the old score goes in, and the new one comes out.",
          "A box keeps its kind for its whole life. let speed be 12 makes a number box, so set speed to \"fast\" later is a mistake."],
        ex: { code: src(["make a number called score with 0", "set score to 10", "print score", "set score to score + 5", "print score", "make a number called coins with 2", "add 3 to coins", "print coins", "let speed be 12", "let name be \"Ada\"", "print name and speed"]),
          walk: ["Lines 1–3: score becomes 10, and 10 is shown.", "Lines 4–5: 10 + 5 goes back into score: 15.", "Lines 6–8: add 3 to coins turns 2 into 5.", "Lines 9–11: let works out the kinds: Ada 12."] },
        mistake: "Writing set score = 10. English++ uses words, not an equals sign: set score to 10."
      } },
    { title: "Doing Math", chapter: "Calculating · + - * /, ( ), whole numbers and decimals", line: "print (1 + 2) * 3",
      content: {
        story: ["The computer is very fast at math. + adds, - takes away, * is times, and / divides. ( ) means do this part first.",
          "Times and divide go before add and take away, just like at school: 2 + 3 * 4 is 14, but (2 + 3) * 4 is 20.",
          "Dividing whole numbers gives a whole number: 7 / 2 is 3, and the bit left over is dropped. If you want 3.5, use a decimal: 7.0 / 2."],
        big: "+ - * / do math, ( ) goes first, and whole numbers divide to a whole number unless a decimal is involved.",
        caption: "Numbers fly into a calculator: 2 + 3, 6 * 7, (1 + 2) * 3, 7 / 2. Tap Play.",
        demo: ["print 2 + 3 → 5", "print 6 * 7 → 42", "print (1 + 2) * 3 → 9", "print 7 / 2 → 3"]
      },
      deep: {
        more: ["English++ knows lots of math words: the square root of 81 is 9, the absolute value of -5 is 5, and the larger of 4 and 9 is 9.",
          "a random number from 1 to 6 picks a whole number, like rolling a dice. Each run can give a different one."],
        ex: { code: src(["print 2 + 3", "print 10 - 4", "print 6 * 7", "print (1 + 2) * 3", "print 7 / 2", "print 7.0 / 2", "print the square root of 81", "print the absolute value of -5", "print the larger of 4 and 9"]),
          walk: ["Lines 1–3: 5, 6 and 42.", "Line 4: the brackets go first: 9.", "Line 5: two whole numbers divide to a whole number: 3.", "Line 6: a decimal keeps the half: 3.5.", "Lines 7–9: math words: 9, 5 and 9."] },
        mistake: "Expecting 7 / 2 to be 3.5. With two whole numbers, English++ drops the leftover and gives 3. Write 7.0 / 2 (or use a decimal box) to keep the half."
      } },
    { title: "Words and Letters", chapter: "Text · +, as text, the uppercase version, the length", line: 'print "I am " + (age as text) + " years old."',
      content: {
        story: ["You can join texts with +: \"Super\" + \"star\" is Superstar. The spaces inside the quote marks count, so leave one where you want one.",
          "A number isn't text, so + can't join them straight away. Turn the number into text with as text: \"I am \" + (age as text) + \" years old.\"",
          "English++ has words for text: the uppercase version of word gives HELLO, the length of word counts the letters, and the first 3 letters of word gives hel."],
        big: "+ joins texts, as text turns a number into text, and words like the uppercase version of and the length of work with text.",
        caption: "Letter tiles snap together: Super + star, then I am 7 years old. Tap Play.",
        demo: ["\"Super\" + \"star\" → Superstar", "(age as text) → \"7\"", "the uppercase version of \"hello\" → HELLO", "the length of \"hello\" → 5"]
      },
      deep: {
        more: ["print with and is often simpler than +: print \"I am\" and age and \"years old.\" puts the spaces in for you and needs no as text.",
          "A letter goes in small quotes, like 'A'. A text is any number of letters in double quotes, like \"Ada\"."],
        ex: { code: src(["make a text called first with \"Super\"", "make a text called second with \"star\"", "print first + second", "make a number called age with 7", "print \"I am \" + (age as text) + \" years old.\"", "make a text called word with \"hello\"", "print the uppercase version of word", "print the length of word", "print the first 3 letters of word"]),
          walk: ["Lines 1–3: Superstar.", "Lines 4–5: I am 7 years old.", "Lines 6–7: HELLO.", "Line 8: 5 letters.", "Line 9: hel."] },
        mistake: "Joining a number without as text, like \"I am \" + age. English++ says the number has to be turned into text first."
      } },
    { title: "Asking Questions: If", chapter: "Choices · if, otherwise, is more than, and, or, not", line: ["if score is more than 10:", "otherwise if score is more than 5:"],
      content: {
        story: ["Programs can make choices. if asks a question, and when the answer is yes, the lines under it run. Those lines are moved two spaces to the right, and end if closes the if.",
          "otherwise says what to do when the answer is no, and otherwise if asks another question. Only one part of the if ever runs: the first one whose answer is yes.",
          "The questions read like English: a is b, a is not b, a is more than b, a is less than or equal to b, n is even, n is odd. Join them with and, or and not."],
        big: "if runs lines when its question is yes, otherwise covers no, and questions read like English (is more than, is even) joined by and, or and not.",
        caption: "A score walks up to a signpost: more than 10? More than 5? Then it takes one road. Tap Play.",
        demo: ["if score is more than 10: → big", "otherwise if score is more than 5: → medium", "otherwise: → small", "score 7 → medium"]
      },
      deep: {
        more: ["When there's only one thing to do, an if fits on one line with a comma: if n is even, print \"even!\".",
          "In the Studio, a line that ends with a colon makes the next line move in by itself, and the Studio writes the end line for you."],
        ex: { code: src(["make a number called score with 7", "if score is more than 10:", "  print \"big\"", "otherwise if score is more than 5:", "  print \"medium\"", "otherwise:", "  print \"small\"", "end if", "make a number called age with 8", "make a yes or no called has_ticket with yes", "if age is more than 6 and has_ticket, print \"You can ride!\"", "if age is odd, print \"odd age\"", "if not has_ticket, print \"No ticket!\""]),
          walk: ["Line 1: score holds 7.", "Lines 2–8: 7 isn't more than 10, but it is more than 5: medium.", "Lines 9–11: both answers are yes, so You can ride!.", "Line 12: 8 is even, so nothing is shown.", "Line 13: has_ticket is yes, so not has_ticket is no: nothing is shown."] },
        mistake: "Forgetting end if, or not moving the lines in. English++ uses the two spaces and the end line to know which lines belong to the if."
      } },
    { title: "Doing Things Again: Loops", chapter: "Repeating · repeat, for, while, until, break, continue", line: ["repeat 3 times:", "for i from 1 to 5:"],
      content: {
        story: ["Computers never get bored. repeat 3 times: runs its lines three times, and end repeat marks where they stop.",
          "for counts for you: for i from 1 to 5: makes i 1, then 2, 3, 4 and 5. for i from 10 down to 0 by 5: counts backwards in fives: 10, 5, 0.",
          "while keeps going as long as its answer is yes, so something inside must change. repeat: … until n is more than 5 always runs at least once, and asks its question at the bottom."],
        big: "repeat runs lines a number of times, for counts, while goes on while the answer is yes, and break and continue stop a loop or skip a turn.",
        caption: "A rocket counts down 3, 2, 1, and blasts off. Tap Play.",
        demo: ["repeat 3 times: → Hip hip hooray! ×3", "for i from 1 to 5: → 1 2 3 4 5", "while rocket is more than 0: → 3 2 1", "Blast off!"]
      },
      deep: {
        more: ["break stops a loop straight away. continue skips the rest of this turn and goes on to the next one. repeat forever: only ends with a break.",
          "for and for each make their counting box for you, and it only lives inside the loop."],
        ex: { code: src(["repeat 3 times:", "  print \"Hip hip hooray!\"", "end repeat", "for i from 10 down to 0 by 5:", "  print i", "end for", "make a number called rocket with 3", "while rocket is more than 0:", "  print rocket", "  set rocket to rocket - 1", "end while", "print \"Blast off!\"", "make a number called n with 0", "repeat forever:", "  add 1 to n", "  if n is 3, continue", "  if n is more than 5, break", "  print n", "end repeat"]),
          walk: ["Lines 1–3: Hip hip hooray! three times.", "Lines 4–6: 10, 5 and 0.", "Lines 7–12: 3, 2, 1, then Blast off!.", "Lines 13–19: 1, 2, 4 and 5. continue skips 3, and break stops the loop at 6."] },
        mistake: "A while loop whose answer never changes, like forgetting set rocket to rocket - 1. It runs forever; press Stop (Shift+F5) in the Studio."
      } },
    { title: "Choosing by Value: Check", chapter: "Many choices · check, if it is, Choices", line: ["check day:", "if it is 2 or 3:"],
      content: {
        story: ["When there are many choices for one value, check is neat and tidy. check day: looks at day once, and each if it is …: inside it is one choice.",
          "it means the value being checked, so if it is 2 or 3: matches either one. Only the first choice that matches runs, and otherwise: catches everything else. end check closes it.",
          "You can make your own list of choices: Choices called Weather: sunny, rainy, and snowy. Then make a Weather called today with rainy makes a box that holds one of them."],
        big: "check compares one value against many if it is choices, and Choices makes your own named list of possible values.",
        caption: "A day number drops into a sorting machine and falls into the right slot. Tap Play.",
        demo: ["check day:", "if it is 1: → Monday", "if it is 2 or 3: → Tuesday or Wednesday", "otherwise: → another day"]
      },
      deep: {
        more: ["The choices of a check sit two spaces in, and the lines of each choice two more. That's how English++ knows which lines belong to which choice.",
          "Choices are safer than plain words: a typo like rainey is a mistake English++ catches, where the text \"rainey\" would quietly never match."],
        ex: { code: src(["make a number called day with 2", "check day:", "  if it is 1:", "    print \"Monday\"", "  if it is 2 or 3:", "    print \"Tuesday or Wednesday\"", "  otherwise:", "    print \"another day\"", "end check", "Choices called Weather: sunny, rainy, and snowy", "make a Weather called today with rainy", "if today is rainy, print \"Take an umbrella!\"", "if today is not sunny, print \"No sunglasses today.\""]),
          walk: ["Lines 1–9: day is 2, so the second choice runs: Tuesday or Wednesday.", "Line 10: three kinds of weather.", "Lines 11–12: today is rainy: Take an umbrella!.", "Line 13: rainy is not sunny: No sunglasses today."] },
        mistake: "Moving the choices in by the wrong amount. Each if it is line sits two spaces inside check, and its own lines two more."
      } },
    { title: "Collections: Many Things in One", chapter: "Many things · vector, at, for each, sort, map, stack, queue", line: ["make a vector of numbers called scores with 10 and 20", "for each pet in pets:"],
      content: {
        story: ["Sometimes you need lots of things, like every score in a game. A vector is a row of boxes that can grow: add 30 to scores puts one more on the end, and the count of scores says how many there are.",
          "scores at 0 is the first item, scores at 1 the next, and so on, because counting starts at 0. for each pet in pets: visits every item in turn, and sort scores puts them in order.",
          "Other collections fit other jobs: a map looks things up by a key (ages at \"amy\"), a set keeps each thing only once, a stack is a pile of plates (take from the top), and a queue is a line at the shop (first in, first out)."],
        big: "A vector is a growing row that counts from 0, for each visits every item, maps look things up by key, and stacks and queues take from the top or the front.",
        caption: "Boxes line up in a row numbered 0, 1, 2, then a stack of plates grows and shrinks. Tap Play.",
        demo: ["scores: 10 · 20 · 30", "scores at 0 → 10", "the count of scores → 3", "the top of plates → blue"]
      },
      deep: {
        more: ["Asking for an item that isn't there, like scores at 5 in a vector of three, stops the program with a plain-English message that says which line did it.",
          "A map's keys can be texts or numbers. ages has \"bob\" asks whether a key is there before you look it up."],
        ex: { code: src(["make a vector of numbers called scores with 10 and 20", "add 30 to scores", "print the count of scores", "print scores at 0", "make a vector of texts called pets with \"cat\" and \"dog\" and \"fish\"", "for each pet in pets:", "  print \"I love my\" and pet", "end for", "make a map from texts to numbers called ages with \"bob\" as 9 and \"amy\" as 7", "set ages at \"zoe\" to 8", "print ages at \"amy\"", "if ages has \"bob\", print \"bob is here\"", "make a stack of texts called plates", "push \"red\" onto plates", "push \"blue\" onto plates", "print the top of plates", "take the top off plates", "print the top of plates"]),
          walk: ["Lines 1–4: three scores now, and the first is 10.", "Lines 5–8: I love my cat, I love my dog, I love my fish.", "Lines 9–12: amy is 7, and bob is here.", "Lines 13–18: blue is on top; take it off and red is on top."] },
        mistake: "Counting from 1. The first item is at 0, so in a vector of three the last one is at 2."
      } },
    { title: "Your Own Functions", chapter: "Naming jobs · define, taking, giving back, call", line: ["define double_it taking a number called x giving back a number:", "give back x * 2"],
      content: {
        story: ["A function is a little program with a name. You make it once with define and use it again and again with call. Its lines sit two spaces in, and it ends with end and its name: end cheer.",
          "A function can take things to work on: define greet taking a text called who and a number called times:. Calling it hands them over in order, joined by and: call greet with \"Mia\" and 2.",
          "A function can give back an answer: giving back a number says what kind, and give back x * 2 hands it over. print call double_it with 21 shows the answer, 42."],
        big: "define names a job, taking lists what it needs, give back hands back an answer, and call runs it.",
        caption: "A number goes into a doubling machine and comes out twice as big. Tap Play.",
        demo: ["define double_it taking a number called x giving back a number:", "give back x * 2", "call double_it with 21", "→ 42"]
      },
      deep: {
        more: ["give back ends the function right there, even in the middle of a loop. Grown-ups call it return.",
          "A function only sees what it's given: its own boxes and the things it takes. That keeps it safe to reuse anywhere."],
        ex: { code: src(["define cheer:", "  print \"Go team!\"", "end cheer", "define greet taking a text called who and a number called times:", "  repeat times times:", "    print \"Hello,\" and who", "  end repeat", "end greet", "define double_it taking a number called x giving back a number:", "  give back x * 2", "end double_it", "call cheer", "call greet with \"Mia\" and 2", "print call double_it with 21"]),
          walk: ["Lines 1–3: cheer prints one line.", "Lines 4–8: greet says hello as many times as it's told.", "Lines 9–11: double_it gives back twice its number.", "Line 12: Go team!.", "Line 13: Hello, Mia, twice.", "Line 14: 42."] },
        mistake: "Using an answer from a function that doesn't give one back, like print call cheer. cheer has no giving back, so there's nothing to print."
      } },
    { title: "Functions in Boxes", chapter: "Functions as things · make a function, apply, where", line: ["make a function called twice taking a number called n giving back a number: give back n * 2", "apply twice to every item in scores"],
      content: {
        story: ["A function can live in a box, just like a number. make a function called twice taking a number called n giving back a number: give back n * 2 fits on one line: what it takes, what it gives back, then its one job after the colon.",
          "Functions in boxes shine with collections. apply twice to every item in scores runs twice on each score and keeps the answers.",
          "A function that gives back a yes or no can pick items out: the number of items in scores where is_big counts the ones it says yes to. Grown-ups call these lambdas."],
        big: "make a function puts a function in a box, apply runs it on every item, and where picks out the items it says yes to.",
        caption: "A conveyor belt carries scores through a doubling machine. Tap Play.",
        demo: ["make a function called twice …: give back n * 2", "apply twice to every item in scores", "4 · 15 · 8 → 8 · 30 · 16", "where is_big → 2 items"]
      },
      deep: {
        more: ["A function in a box can use the boxes around it: is_big below uses limit, made just before it.",
          "call works the same way on a function in a box: print call twice with 21 shows 42."],
        ex: { code: src(["make a function called twice taking a number called n giving back a number: give back n * 2", "print call twice with 21", "make a vector of numbers called scores with 4 and 15 and 8", "apply twice to every item in scores", "for each score in scores:", "  print score", "end for", "make a number called limit with 10", "make a function called is_big taking a number called n giving back a yes or no: give back n is more than limit", "print the number of items in scores where is_big"]),
          walk: ["Line 1: a function in a box.", "Line 2: 42.", "Lines 3–7: every score is doubled: 8, 30 and 16.", "Lines 8–10: two of the scores are more than 10: 2."] },
        mistake: "Using a function box before it's made. Like any box, make a function comes before the lines that use it."
      } },
    { title: "Your Own Kinds of Things: Boxx", chapter: "Your own kinds · Boxx, has, can, when made, uses", line: ["Boxx called Dog:", "has a number called age with 1"],
      content: {
        story: ["You can invent your own kind of thing, like a Dog or a Spaceship, with Boxx. has gives it things to remember (grown-ups say fields), and can gives it things it can do (methods).",
          "when made runs when a new one is made: make a Dog called rex with \"Rex\" hands \"Rex\" to when made. To make it do something, write its name and then the action: rex bark. the age of rex reads one of the things it has.",
          "One kind can use another and get all of its powers: Boxx called Cat uses Animal:. Its when made starts with start as an Animal with given, so the Animal part is made too."],
        big: "Boxx invents a kind of thing: has for what it remembers, can for what it does, when made for its start, and uses to build on another kind.",
        caption: "A Dog blueprint stamps out Rex, who barks. Tap Play.",
        demo: ["Boxx called Dog:", "has a text called name", "can bark: → Rex says woof!", "make a Dog called rex with \"Rex\""]
      },
      deep: {
        more: ["Inside a can or when made, the things a Boxx has are there by name: set name to given changes this dog's name, not every dog's.",
          "Every Dog you make has its own copy of what it has, so making a second dog doesn't change the first."],
        ex: { code: src(["Boxx called Animal:", "  has a text called name", "  when made taking a text called given:", "    set name to given", "  end when made", "  can introduce:", "    print \"I am\" and name", "  end introduce", "end Animal", "Boxx called Cat uses Animal:", "  has a number called lives with 9", "  when made taking a text called given:", "    start as an Animal with given", "  end when made", "  can purr:", "    print name and \"says purr...\"", "  end purr", "end Cat", "make a Cat called tom with \"Tom\"", "tom introduce", "tom purr", "print \"Lives:\" and the lives of tom"]),
          walk: ["Lines 1–9: an Animal has a name and can introduce itself.", "Lines 10–18: a Cat uses Animal, so it has a name too, plus 9 lives and a purr.", "Line 19: when made hands \"Tom\" on to the Animal part.", "Lines 20–21: I am Tom, then Tom says purr....", "Line 22: Lives: 9."] },
        mistake: "Ending a Boxx with end Boxx. It ends with its own name: end Cat."
      } },
    { title: "When Things Go Wrong", chapter: "Problems · try, complain, if it fails, the problem", line: ["try:", "complain \"something broke\""],
      content: {
        story: ["Sometimes something goes wrong while a program runs. complain stops it with a problem, in your own words.",
          "try catches problems so the program can carry on. The lines under try: run until one complains. Then the lines under if it fails: run, and the problem holds what went wrong. end try closes it.",
          "When a program makes a mistake by itself, like asking for item 5 of three, it stops and tells you exactly where, in plain English: The program stopped on line 3, and why. The Studio jumps to that line and underlines it."],
        big: "complain raises a problem, try … if it fails catches it, and the problem says what it was; real mistakes are reported in plain English with their line.",
        caption: "A ball bounces into a try net; the net catches it and reads the note. Tap Play.",
        demo: ["try:", "complain \"something broke\"", "if it fails:", "caught: something broke"]
      },
      deep: {
        more: ["A complain inside a function still reaches the try that called it, so a function can say no and let the caller decide what to do.",
          "Many languages just crash, or quietly carry on with a wrong answer. English++ says the line, which makes mistakes much quicker to fix."],
        ex: { code: src(["define share taking a number called cookies and a number called friends giving back a number:", "  if friends is 0, complain \"nobody to share with\"", "  give back cookies / friends", "end share", "try:", "  make a number called per_friend with call share with 12 and 3", "  print \"Each friend gets\" and per_friend", "  set per_friend to call share with 12 and 0", "  print \"never printed\"", "if it fails:", "  print \"caught:\" and the problem", "end try", "print \"The program carries on.\""]),
          walk: ["Lines 1–4: share complains when there's nobody to share with.", "Lines 6–7: 12 shared by 3: Each friend gets 4.", "Line 8: sharing by 0 complains, so line 9 never runs.", "Lines 10–11: caught: nobody to share with.", "Line 13: The program carries on."] },
        mistake: "Moving if it fails: two spaces in, inside the try. It sits level with try:, because it's the other half of the try."
      } },
    { title: "Time, Questions and Files", chapter: "Outside the program · wait, ask, write, read", line: ["ask \"What is your name?\" into name", "write \"Hello from my program!\" to \"note.txt\""],
      content: {
        story: ["wait makes a program pause: wait 1 seconds waits a second before the next line. the seconds since the start says how long the program has been running.",
          "A program can ask you questions: ask \"What is your name?\" into name shows the question, and you type your answer in the line under the Output window and press Enter. Asking into a number box keeps the answer as a number.",
          "A program can write words into a file and read them back later, even after it closes: write \"Hello!\" to \"note.txt\" saves them, and read \"note.txt\" into message brings them back."],
        big: "wait pauses, ask gets an answer from the person at the keyboard, and write and read keep words in files.",
        caption: "A program asks a question, waits for the answer, and saves it to a file. Tap Play.",
        demo: ["ask \"What is your name?\" into name", "> Sam", "write name to \"name.txt\"", "read \"name.txt\" into saved"]
      },
      deep: {
        more: ["The box for an answer is made first, empty: make a text called name, then ask … into name.",
          "append x to the file f adds a line to the end of a file instead of starting it fresh."],
        ex: { answers: ["Sam", "9"],
          code: src(["make a text called name", "ask \"What is your name?\" into name", "make a number called age", "ask \"How old are you?\" into age", "print \"Hi\" and name and \"- next year you will be\" and age + 1", "write name to \"name.txt\"", "make a text called saved", "read \"name.txt\" into saved", "print \"The file says:\" and saved", "wait 1 seconds", "print \"Done!\""]),
          walk: ["Lines 1–4: two questions. Say you type Sam, then 9.", "Line 5: Hi Sam - next year you will be 10.", "Lines 6–9: the name goes into a file and comes back: The file says: Sam.", "Lines 10–11: a one-second pause, then Done!."] },
        mistake: "Asking into a box you haven't made. Make it first, with make a text called name, then ask … into name."
      } },
    { title: "The Box World", chapter: "3D · make a box, show, paint, move, spin, grow, say, when", line: "move hero by 2, 0, 0",
      content: {
        story: ["English++ has a little 3D world built in. make a box called hero makes a box, and show hero puts it in the world. When the program runs, a window opens with your boxes in it.",
          "paint hero red colors it (red, blue, green, gold, purple, white, black, pink, orange or cyan). move hero by 2, 0, 0 slides it, spin hero by 45 turns it, and grow hero by 2 makes it bigger (shrink makes it smaller). say \"hi\" puts words on the screen.",
          "A when line says what happens each time something happens, after a comma: when the right key is pressed, move hero by 1, 0, 0, or when hero touches coin, play sound \"ding\"."],
        big: "make a box and show it; paint, move, spin, grow and say change the world; when lines react to keys, clicks and touches.",
        caption: "A red hero box slides over to a gold coin, spins, and words appear: Find the coin! Tap Play.",
        demo: ["make a box called hero → show hero", "paint hero red", "move hero by 2, 0, 0", "say \"Find the coin!\""]
      },
      deep: {
        more: ["The three numbers after move are x, y and z: x goes right (a minus goes left), y goes up, and z comes towards you.",
          "when lines don't do anything straight away. They wait, and each time the key is pressed or the boxes touch, their action runs."],
        ex: { code: src(["make a box called hero", "make a box called coin", "show hero", "show coin", "paint hero red", "paint coin gold", "move coin by 3, 0, 0", "when hero touches coin, play sound \"ding\"", "when the right key is pressed, move hero by 1, 0, 0", "when the mouse is clicked, paint hero pink", "spin coin by 45", "grow coin by 2", "say \"Find the coin!\""]),
          walk: ["Lines 1–6: two boxes appear, a red one and a gold one.", "Line 7: the coin slides 3 to the right.", "Lines 8–10: three when lines wait for things to happen: a touch, a key and a click.", "Lines 11–13: the coin turns, doubles in size, and Find the coin! appears."] },
        mistake: "Moving a box before making it. Each box needs its make line first, and a show line before you can see it."
      } },
    { title: "Three Forms and Blueprints", chapter: "Regular, compressed and Blueprint · .englishpp, .epc, .epb", line: ["make a number called score with 7", "mk aa nm cd score wi 7"],
      content: {
        story: ["English++ comes in three forms that mean exactly the same program. Regular is what you've seen so far: whole English words, in .englishpp files.",
          "Compressed writes every keyword as a 2 or 3 letter code, so make a number called score with 7 becomes mk aa nm cd score wi 7. Words that already have 2 or 3 letters (if, is, to, end) stay the same, and so do names you make. Compressed files end in .epc.",
          "Blueprint draws the program as nodes joined by wires, in .epb files. White wires show what runs next, starting at the green When the program starts node, and colored wires carry values into the holes. You can build a whole program without typing a line."],
        big: "Regular, compressed and Blueprint are three ways to write one English++ program, and the Studio switches between them without changing a thing.",
        caption: "One program shown three ways: words, short codes, and boxes joined by wires. Tap Play.",
        demo: ["make a number called score with 7", "mk aa nm cd score wi 7", "[make a number] → [if score is more than 5]", "Ctrl+Alt+C · Ctrl+Alt+B"]
      },
      deep: {
        more: ["Ctrl+Alt+C switches a file between regular and compressed, and Ctrl+Alt+B turns it into a Blueprint. Point at any compressed word in the Studio to see what it means.",
          "In a Blueprint, press Space to add a node, drag from a pin and let go in empty space to add one already wired, and press F to see the whole program. Every node is one line of English++, and the panel on the right shows the words it makes."],
        ex: { code: src(["note Add up the odd numbers, and show the even ones.", "make a number called total with 0", "for i from 1 to 10:", "  if i is even:", "    print i", "  otherwise:", "    add i to total", "  end if", "end for", "print \"The odd numbers add up to \" + (total as text)"]),
          walk: ["Line 1: a note.", "Line 2: total starts at 0.", "Lines 3–9: each even number is shown (2, 4, 6, 8, 10), and each odd one is added to total.", "Line 10: The odd numbers add up to 25.", "As a Blueprint, the for node's Loop body pin leads to the if node, and its Then and Otherwise pins lead to the print and the add."] },
        mistake: "Mixing forms in one file. A file is all regular or all compressed, so switch the whole file with Ctrl+Alt+C."
      } },
    { title: "Bigger Programs", chapter: "Growing · Group, include, phrase, libraries", line: ["Group called shapes:", "include once \"raylib.englishpp\""],
      content: {
        story: ["A Group keeps related things together (grown-ups say namespace): Group called shapes: holds functions, and call area from shapes with 5 uses one of them.",
          "Big programs can be split into many files. include \"helpers.englishpp\" brings another file in, and include once makes sure a file only comes in one time, even if many files ask for it.",
          "You can teach English++ new words with phrase, which says what some English means in C++. Libraries are just files full of phrases: the Studio comes with raylib (windows, 2D and 3D, glow), SDL 3, SFML 3, OpenGL and Qt 6 (desktop apps with buttons)."],
        big: "Groups keep functions together, include brings in other files, and phrases (and the libraries made of them) teach English++ new words.",
        caption: "Files snap together like building blocks, and a library opens a window. Tap Play.",
        demo: ["Group called shapes:", "include once \"raylib.englishpp\"", "open a window called \"Hello V\" sized 1280 by 720", "phrase \"say hooray\" means …"]
      },
      deep: {
        more: ["A phrase can have holes in curly brackets, like phrase \"the double of {x:num}\" gives back a number means \"({x}) * 2\", so that print the double of 21 works.",
          "Any C++ library can join English++: in the Studio, Libraries > Add External Library makes a phrase file for it, and Use in This File adds the include line for you."],
        ex: { code: src(["Group called shapes:", "  define area taking a number called side giving back a number:", "    give back side * side", "  end area", "  define fence taking a number called side giving back a number:", "    give back side * 4", "  end fence", "end shapes", "print \"Area:\" and call area from shapes with 5", "print \"Fence:\" and call fence from shapes with 5"]),
          walk: ["Lines 1–8: a Group called shapes holds two functions.", "Line 9: Area: 25.", "Line 10: Fence: 20."] },
        mistake: "Calling a Group's function without its Group, like call area with 5. Say where it lives: call area from shapes with 5."
      } },
    { title: "A Whole Game", chapter: "Putting it together · a guessing game", line: "while guess is not secret:",
      content: {
        story: ["Let's put it all together in a guessing game. The computer thinks of a secret number from 1 to 100, and you guess until you get it.",
          "make a number called secret with a random number from 1 to 100 picks the secret. A while loop keeps asking with ask \"Your guess?\" into guess, counts the tries with add 1 to tries, and says Higher! or Lower! with an if.",
          "Read it out loud: you can understand every line, and so can the computer. That's English++. Well done, you're an English++ programmer now!"],
        big: "A whole game is just boxes, a loop, questions and ifs, put together in the right order.",
        caption: "Guesses arrow in, higher, lower, until the secret number lights up. Tap Play.",
        demo: ["I am thinking of a number from 1 to 100.", "Your guess? 50 → Higher!", "Your guess? 75 → Lower!", "You got it in 7 tries!"]
      },
      deep: {
        more: ["while guess is not secret: keeps the game going until the guess matches. guess starts at 0, which can never be the secret, so the loop always runs at least once.",
          "Try changing it: allow only 10 tries, or keep a best score in a file. Every change is a few more English sentences."],
        ex: { answers: (function () { var a = []; for (var i = 1; i <= 100; i++) a.push(String(i)); return a; })(),
          code: src(["note The guessing game: find the secret number from 1 to 100.", "make a number called secret with a random number from 1 to 100", "make a number called guess with 0", "make a number called tries with 0", "print \"I am thinking of a number from 1 to 100.\"", "while guess is not secret:", "  ask \"Your guess?\" into guess", "  add 1 to tries", "  if guess is less than secret:", "    print \"Higher!\"", "  otherwise if guess is more than secret:", "    print \"Lower!\"", "  end if", "end while", "print \"You got it in\" and tries and \"tries!\"", "if tries is less than or equal to 7, print \"Amazing!\""]),
          walk: ["Line 1: a note.", "Lines 2–4: a random secret, and boxes for the guess and the tries.", "Line 5: the game says what to do.", "Lines 6–14: until the guess is the secret: ask, count the try, and say Higher! or Lower!.", "Lines 15–16: You got it in … tries!, and Amazing! for 7 tries or fewer."] },
        mistake: "Forgetting add 1 to tries, or starting guess at a number that could be the secret. Then the count is wrong, or the loop might never start."
      } }
  ];

  var shelves = [
    { title: "Every Word and Its Code", chapter: "Beyond the basics · English++ shelf", line: ["pr \"Hello, V!\"", "mk aa nm cd score wi 7"],
      content: {
        story: ["The compressed form writes every keyword with its own 2 or 3 letter code, and the codes never change: make is mk, a is aa, number is nm, called is cd, with is wi, print is pr, more is mr and than is th.",
          "Words that already have 2 or 3 letters (if, is, to, end, and, for) are their own code, and names you make stay the same. So if score is mr th 5: still reads as if score is more than 5:.",
          "Appendix A of The English++ Book lists all 394 codes. In the Studio, point at any compressed word to see the word it stands for."],
        big: "Every keyword has one fixed 2 or 3 letter code (make is mk, print is pr); short words and your own names stay the same.",
        caption: "Long words shrink into short codes and grow back again. Tap Play.",
        demo: ["make → mk", "number → nm", "called → cd", "print → pr"]
      },
      deep: {
        more: ["More codes you'll meet: repeat rp, times tms, while wh, otherwise ow, define df, give gv, back bk, call cl, text tx, decimal dc, vector vc, note nt.",
          "A compressed program is quick to type once you know it. Switch any file with Ctrl+Alt+C, and nothing about the program changes."],
        ex: { code: src(["nt aa compressed program: pr shows words.", "mk aa nm cd score wi 7", "if score is mr th 5:", "  pr \"big\"", "end if", "rp 2 tms:", "  pr \"again!\"", "end rp", "mk aa tx cd pet wi \"Rex\"", "pr \"My pet is\" and pet"]),
          walk: ["Line 1: nt is note.", "Line 2: make a number called score with 7.", "Lines 3–5: if score is more than 5: big.", "Lines 6–8: repeat 2 times: again!, twice.", "Lines 9–10: make a text called pet with \"Rex\", then My pet is Rex."] },
        mistake: "Turning a name into a code by accident. Only keywords shrink: a box called score stays score in both forms."
      } },
    { title: "The Standard Library", chapter: "Beyond the basics · English++ shelf", line: ["print the square root of 81", "print the uppercase version of word"],
      content: {
        story: ["English++ comes with hundreds of ready-made phrases, in every program, with no include needed. A word in a phrase like x or c is a hole: put a value or a name there.",
          "Math: the square root of x, the absolute value of x, the larger of a and b, the power of x to y, a random number from a to b, the factorial of n. Text: the length of s, the uppercase version of s, the first n letters of s, a copy of s with a replaced by b, the text made of n copies of c.",
          "Collections: the count of c, the sum of c, the biggest in c, the average of c, a sorted copy of c, sort c, reverse c, remove v from c. Time and files: the seconds since the start, the date today, the text in the file f."],
        big: "Ready-made phrases cover math, text, collections, time and files, and each hole takes a value or a name.",
        caption: "A toolbox opens: math tools, text tools, collection tools. Tap Play.",
        demo: ["the square root of 81 → 9", "the length of \"hello\" → 5", "the biggest in scores → 9", "the factorial of 5 → 120"]
      },
      deep: {
        more: ["Each phrase gives back one kind of answer: the length of s gives a number, the square root of x a decimal, and the uppercase version of s a text.",
          "Appendix B of the book lists every phrase with the kind it gives back, and the Studio's Reference panel shows them all: double-click one to add it."],
        ex: { code: src(["make a vector of numbers called scores with 4 and 9 and 2 and 7", "print \"Biggest:\" and the biggest in scores", "print \"Smallest:\" and the smallest in scores", "print \"Sum:\" and the sum of scores", "print \"Average:\" and the average of scores", "print the factorial of 5", "print the power of 2 to 10", "make a text called word with \"banana\"", "print a copy of word with \"a\" replaced by \"o\"", "print the text made of 3 copies of \"ha\"", "print the number of times 2 is in scores", "if the number 97 is prime, print \"97 is prime\""]),
          walk: ["Lines 1–5: Biggest: 9, Smallest: 2, Sum: 22 and Average: 5.5.", "Line 6: 120.", "Line 7: 1024.", "Lines 8–9: bonono.", "Line 10: hahaha.", "Line 11: 2 is in the scores once: 1.", "Line 12: 97 is prime."] },
        mistake: "Mixing up the length of and the count of. The length of counts the letters in a text, and the count of counts the items in a collection."
      } },
    { title: "English++ Studio", chapter: "Beyond the basics · English++ shelf", line: ["note Run is F5, and Build .exe is Ctrl+Shift+B."],
      content: {
        story: ["The Studio has everything for making programs. Run (F5) builds your program and runs it, with its words in the Output window. Build .exe (Ctrl+Shift+B) makes a real Windows program in the bin folder; copy the whole folder to share it with a friend. Stop (Shift+F5) stops a running program.",
          "IntelliSense helps you type: the Studio guesses what comes next and shows it in gray, Tab takes it, and the holes become placeholders you fill one by one. Ctrl+Space shows ideas any time, and a mistake gets a wavy red line that says what's wrong in plain English.",
          "Panels: Project (your files), Outline (every box, function and Boxx), Libraries, Reference (every phrase), Problems, Output, C++ View (the C++ your program turns into) and Music, with 32 original songs and a Beat Maker. Seven themes live in View > Theme."],
        big: "F5 runs, Ctrl+Shift+B builds an .exe, IntelliSense guesses ahead, and the panels show your files, phrases, problems, output and C++.",
        caption: "The Studio's panels light up one by one around your program. Tap Play.",
        demo: ["F5 · Run", "Ctrl+Shift+B · Build .exe", "Tab · take the gray guess", "C++ View · see the C++"]
      },
      deep: {
        more: ["Handy keys: Ctrl+/ turns lines into notes and back, F12 goes to where a name was made, F2 renames a name everywhere, Ctrl+F finds, and Ctrl+Shift+P finds any command.",
          "The C++ View is a great way to start learning C++: write a line of English++ and watch the C++ it becomes."],
        ex: { code: src(["note Press F5 to run this, then open the C++ View to see its C++.", "make a number called total with 0", "for i from 1 to 10:", "  add i to total", "end for", "print \"1 to 10 adds up to\" and total"]),
          walk: ["Line 1: a note.", "Lines 2–5: each number from 1 to 10 is added onto total.", "Line 6: 1 to 10 adds up to 55."] },
        mistake: "Looking for the program's words in the editor. They appear in the Output window at the bottom of the Studio after you press Run."
      } },
    { title: "C++ Overpowered", chapter: "Beyond the basics · English++ shelf", line: ["code: std::cout << \"This line is C++!\" << std::endl;"],
      content: {
        story: ["Every English++ program turns into C++ when it's built, and C++ Overpowered lets you work in real C++ itself, as a Blueprint. Any C++ file opens as nodes, and the nodes write back exactly the same C++.",
          "Each node is a small glowing orb with a few words of its code beside it, like lives = 3. Every kind of step has its own color, shape, light and sound: main is green with sparkles and a fanfare, an if is pink-red with a diamond, loops are orange, and return is gold.",
          "The ring around an orb shows the type: solid green for int, teal for double, red for bool, pink for std::string, beads for a list, dashes and an arrow for a pointer, and a rainbow for auto. In plain English++, a line that starts with code: is real C++: the secret door to anything C++ can do."],
        big: "C++ Overpowered shows real C++ as colored, glowing nodes, and code: lets an English++ program use one line of C++.",
        caption: "A C++ program turns into a train map of glowing orbs: a green start, an orange loop, a gold return. Tap Play.",
        demo: ["int total = 0; → a mint capsule", "for (int i = 1; i <= 10; ++i) → an orange loop", "total += i; → light mint", "return 0; → a gold arrow"]
      },
      deep: {
        more: ["The Studio comes with 32 C++ examples, from a first program to a raylib game where you catch the stars. Each one opens as a Blueprint in its own project, ready to run.",
          "While you work, the Studio asks Visual C++ to check your program, and a node with a mistake gets a red outline. Point at it to read what Visual C++ says."],
        ex: { code: src(["note In C++ this loop is: while (lives > 0) { … }", "make a number called lives with 3", "while lives is more than 0:", "  print \"Lives left:\" and lives", "  set lives to lives - 1", "end while", "print \"Game over\""]),
          walk: ["Line 1: a note saying the C++ this becomes.", "Line 2: in C++, int lives = 3;.", "Lines 3–6: a while loop: Lives left: 3, then 2, then 1.", "Line 7: Game over."] },
        mistake: "Forgetting the semicolon in a code: line. After code:, the rest is real C++, so C++'s own rules apply: std::cout << \"Hi\" << std::endl; needs its ;."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · English++ shelf", line: ["set score to 10", "print \"I am \" + (age as text)"],
      content: {
        story: ["Every programmer makes mistakes; the trick is finding them fast. English++ helps twice: while you type, a wavy red line says what's wrong in plain English, and while the program runs, a mistake stops it with the line it happened on.",
          "The most common typing mistakes: a missing quote mark, a missing end line, lines not moved in two spaces, the wrong kind in a box (2.5 in a number box), or a symbol where English++ wants a word (= instead of to, > instead of is more than).",
          "The most common running mistakes: a position that isn't in a collection (scores at 5 of three), dividing by zero, a loop that never stops, and a complain that nobody catches. Read the message, go to its line, and ask: what did I expect, and what did the computer see?"],
        big: "Read the plain-English message, go to its line, and compare what you expected with what the program really had.",
        caption: "A magnifying glass sweeps over the program and stops on the underlined line. Tap Play.",
        demo: ["The program stopped on line 3:", "print scores at 5", "It used a position that is not in the collection or text.", "Fix: scores at 2 is the last of three"]
      },
      deep: {
        more: ["print is the oldest bug-hunting tool there is: print a box just before the line that goes wrong, and you'll see what the program saw.",
          "Change one thing at a time and run again. If it's still wrong, you'll know the last change wasn't the answer."],
        ex: { code: src(["make a vector of numbers called scores with 1 and 2 and 3", "print \"How many:\" and the count of scores", "print \"Last one:\" and scores at 2", "make a number called age with 7", "print \"I am \" + (age as text) + \" years old.\"", "make a decimal called price with 2.5", "print \"Price:\" and price"]),
          walk: ["Lines 1–2: How many: 3.", "Line 3: the last of three is at 2, not 3: Last one: 3.", "Lines 4–5: as text turns 7 into text: I am 7 years old.", "Lines 6–7: a price with a dot lives in a decimal box: Price: 2.5."] },
        mistake: "Changing lots of things at once when a program goes wrong. Change one, run it, and look again."
      } }
  ];

  var glossary = [
    ["argument", "A value you hand to a function. In English++: add_up&1&2."],
    ["array", "A row of things that can't change size. In English++: arr@num@5."],
    ["boolean", "A value that's yes or no. In English++: yno."],
    ["bug", "A mistake in a program."],
    ["build", "Turn a program into an .exe file that runs on its own. In the Studio: Ctrl+Shift+B."],
    ["class", "A plan for a kind of thing. In English++: dcl."],
    ["collection", "Many things kept together: a vector, list, map, set, stack or queue."],
    ["comment", "A line for people, which the computer skips. In English++: note."],
    ["compile", "Turn a program into something a computer can run. F5 does this in the Studio."],
    ["compressed form", "English++ with every keyword written as a 2 or 3 letter code."],
    ["constant", "A value that can't change. In English++: mkn."],
    ["constructor", "What runs when a thing is made. In English++: dmk."],
    ["crash", "When a program stops because of a problem."],
    ["debug", "Find and fix mistakes."],
    ["destructor", "What runs when a thing goes away. In English++: dds."],
    ["enum", "A list of choices. In English++: den."],
    ["exception", "A problem that jumps to a catch. In English++: etw throws it, bch catches it."],
    ["field", "Something a thing has. In English++: dfd."],
    ["float", "A number with a point in it. In English++: dec, or flo for a small one."],
    ["function", "A little machine with a name. In English++: dfn."],
    ["global", "A box that every function can see. In English++: mgl."],
    ["header", "A C++ file that says what's in another file. In English++: xic."],
    ["IDE", "A program for writing programs — for English++, that's the Studio."],
    ["inheritance", "A child getting what its parent has. In English++: Dog dcl Animal."],
    ["integer", "A whole number. In English++: num."],
    ["IntelliSense", "The Studio guessing what you will type next. Tab takes the guess."],
    ["kind", "What sort of thing a box holds: a number, a decimal, a text, a letter, a yes or no."],
    ["lambda", "A function kept in a name. In English++: dlm."],
    ["library", "A bag of functions somebody else wrote, like raylib or Qt. In English++: xlb."],
    ["loop", "Doing something again and again. In English++: flt, fea, wlt and friends."],
    ["map", "Finding a value by its key. In English++: map@txt@num."],
    ["memory", "Where the computer keeps your boxes while it runs."],
    ["method", "A function inside a class. In English++: dfn, inside a class."],
    ["mutex", "A lock that lets one thread in at a time."],
    ["namespace", "A group of names. In English++: dgr."],
    ["now", "The English++ word that fills a spot with nothing to say, as in now wfv now."],
    ["null", "Nothing, for a pointer. In English++: nil."],
    ["object", "One thing made from a class. In English++: rex mak Dog."],
    ["operator", "A mark that does something, like +. In English++, define your own with dop."],
    ["override", "A child's own version of a function. In English++: dov."],
    ["parameter", "A box that a function fills from what it's given. In English++: dpm."],
    ["phrase", "A pattern of words and the C++ it means."],
    ["pointer", "A box that holds the place of another box. In English++: mpt."],
    ["polymorphism", "Each kind of thing doing a job its own way. In English++: dvr and dov."],
    ["private", "Can only be used inside the class. In English++: dsc and dhd."],
    ["program", "A list of things for a computer to do."],
    ["recursion", "A function that runs itself."],
    ["reference", "Another name for the same box. In English++: mrf."],
    ["regular expression", "A pattern for finding text. In English++: tmt, tma and trx."],
    ["return", "Give an answer and leave the function. In English++: ert."],
    ["root", "The middle word of every English++ line — what happens. Its first letter is the family, the other two are the job."],
    ["run", "Make the computer do what a program says. In the Studio: F5."],
    ["statement", "One line of a program."],
    ["string", "Text. In English++: txt."],
    ["struct", "A simple class. In English++: dst."],
    ["template", "A kind that gets filled in later. In English++: dtp."],
    ["thread", "A part of a program that runs at the same time. In English++: mtd."],
    ["type", "The kind of a value. In English++: num, txt, and so on."],
    ["variable", "A box with a name that holds one thing. In English++: is or mak."],
    ["vector", "A list that can grow. In English++: vec."]
  ];

  var field = [
    { name: "a — arithmetic", head: "add asb aml adv amd apw", what: "Changes a thing in place: add, subtract, multiply, divide, remainder, power.", ex: "score add 10" },
    { name: "b — block", head: "btr bch bdo bsw bcs bdf", what: "Opens a block that is not a loop or an if: try, catch, do, switch, case, default.", ex: "now btr now" },
    { name: "c — collection", head: "cct csm cmx cmn cav chs", what: "Asks about a collection: count, sum, biggest, smallest, average, has.", ex: "out prn csm&scores" },
    { name: "d — define", head: "dfn dpm dcl dfd dmk den", what: "Gives a new thing its name: function, parameter, class, field, make, enum.", ex: "add_up dfn num" },
    { name: "e — exit", head: "ert ebk enx etw ext", what: "Leaves or ends something: return, break, next, throw, exit.", ex: "add_up ert a+b" },
    { name: "f — for", head: "flt fle fgt fge fea", what: "Repeats, counting or walking through a collection.", ex: "n fea scores" },
    { name: "h — hard drive", head: "hwr hap hrd hln hex", what: "Works with files and folders: write, append, read, lines, exists.", ex: "\"a.txt\" hap \"more\"" },
    { name: "i — if", head: "ieq ine ilt ile igt ige", what: "Runs the moved-in lines when the test passes.", ex: "x igt 3" },
    { name: "l — list", head: "lrm lin lso lrv lsu lwp", what: "Changes a collection: remove, insert, sort, reverse, shuffle, wipe.", ex: "scores lso now" },
    { name: "m — make", head: "mak mkn mgl mpt mrf mnw", what: "Makes a new variable: a box, a constant, a global, a pointer, a reference, a new thing.", ex: "rex mak Dog" },
    { name: "n — number", head: "nsq nab nro nra nmx", what: "Works out a number: square root, absolute value, rounded, random, biggest.", ex: "roll is nra&1&6" },
    { name: "o — otherwise", head: "oeq one olt ogt oth", what: "Tries again after an if; oth catches all the other times.", ex: "now oth now" },
    { name: "t — text", head: "tsz tuc tlc trp tsp ths", what: "Works with text: size, uppercase, lowercase, replace, split, has.", ex: "big is tuc&name" },
    { name: "w — while", head: "weq wne wlt wgt wfv", what: "Repeats the moved-in lines while the test passes — or forever.", ex: "lives wgt 0" },
    { name: "x — external", head: "xic xlb xim xpp", what: "Reaches C++ and the world outside: include, library, import, C++ here.", ex: "now xlb raylib" }
  ];

  var cheats = [
    { title: "The Three Spots Card", body: "Every line is who, the root, and what. Nothing to say? Write now.", code: "note Who Root What: three words on every line\nx is 6\nnow wfv now\nc is a+b*2\nout prn \"Hi @name\"" },
    { title: "Making and Changing Card", body: "Boxes, constants, and changing them in place.", code: "x is 6\nx mak num\nv mak vec@num\nLIMIT mkn 100\nx add 1\nx asb 1\nx aml 2\nx adv 2" },
    { title: "Printing and Asking Card", body: "prn prints and goes to the next line, put stays on this line, get asks and keeps the answer.", code: "out prn x\nout put x\nname get \"Name? \"" },
    { title: "Choosing Card", body: "If, otherwise-if, otherwise — the lines moved in are the block.", code: "x ieq 3\n  out prn \"three\"\nx olt 3\n  out prn \"small\"\nnow oth now\n  out prn \"big\"" },
    { title: "Repeating Card", body: "Count with i (0 to 9), walk each x in v, wait while x is less than 10, loop forever, break out, or skip to the next turn.", code: "i flt 10\nx fea v\nx wlt 10\nnow wfv now\nnow ebk now\nnow enx now" },
    { title: "Lists Card", body: "The moves a list is asked for every day.", code: "v is 1&2&3\nout prn v@0\nv add 4\nv lrm 4\nv lso now\nout prn cct&v" },
    { title: "Functions and Classes Card", body: "Your own words and your own kinds of things.", code: "add_up dfn num\n  a dpm num\n  b dpm num\n  add_up ert a+b\ny is add_up&1&2\nDog dcl now\n  age dfd 3\nrex mak Dog\nout prn rex@age" }
  ];

  /* A decimal prints the way C++ prints a double: 6 significant digits, no trailing zeros. */
  function g6(x) {
    if (x === 0) return "0";
    var parts = x.toExponential(5).split("e"), ex = Number(parts[1]);
    var strip = function (s) { return s.indexOf(".") >= 0 ? s.replace(/0+$/, "").replace(/\.$/, "") : s; };
    if (ex < -4 || ex >= 6) return strip(parts[0]) + "e" + (ex < 0 ? "-" : "+") + (Math.abs(ex) < 10 ? "0" : "") + Math.abs(ex);
    return strip(x.toFixed(Math.max(0, 5 - ex)));
  }
  function stars(n) { return new Array(n + 1).join("*"); }

  var projects = [
    { name: "Rocket Countdown", about: "A while loop counts down to blast off.",
      vars: [{ key: "rocket", val: 5, min: 1, max: 12 }],
      code: function (v) { return ["note Count down, then blast off!", "make a number called rocket with " + v.rocket, "while rocket is more than 0:", "  print rocket", "  set rocket to rocket - 1", "end while", "print \"Blast off!\""]; },
      run: function (v) { var o = []; for (var r = v.rocket; r > 0; r--) o.push(String(r)); o.push("Blast off!"); return o; },
      explain: "while keeps going as long as rocket is more than 0, and set rocket to rocket - 1 makes sure it gets there." },
    { name: "Times Table", about: "for counts from 1, and print does the times.",
      vars: [{ key: "table", val: 7, min: 2, max: 12 }, { key: "upto", val: 10, min: 1, max: 12 }],
      code: function (v) { return ["make a number called table with " + v.table, "make a number called upto with " + v.upto, "for i from 1 to upto:", "  print i and \"times\" and table and \"is\" and i * table", "end for"]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(i + " times " + v.table + " is " + i * v.table); return o; },
      explain: "for i from 1 to upto: makes i each number in turn, and and puts a space between the words and the numbers." },
    { name: "Hip Hip Hooray", about: "repeat … times cheers as often as you say.",
      vars: [{ key: "cheers", val: 3, min: 1, max: 9 }],
      code: function (v) { return ["make a number called cheers with " + v.cheers, "repeat cheers times:", "  print \"Hip hip hooray!\"", "end repeat", "print \"Cheers given:\" and cheers"]; },
      run: function (v) { var o = []; for (var i = 0; i < v.cheers; i++) o.push("Hip hip hooray!"); o.push("Cheers given: " + v.cheers); return o; },
      explain: "repeat cheers times: runs the line inside it once for every cheer, then the program carries on after end repeat." },
    { name: "Odd and Even Adder", about: "The program from the Blueprint picture: show the evens, add up the odds.",
      vars: [{ key: "top", val: 10, min: 1, max: 30 }],
      code: function (v) { return ["note Add up the odd numbers, and show the even ones.", "make a number called top with " + v.top, "make a number called total with 0", "for i from 1 to top:", "  if i is even:", "    print i", "  otherwise:", "    add i to total", "  end if", "end for", "print \"The odd numbers add up to \" + (total as text)"]; },
      run: function (v) { var o = [], t = 0; for (var i = 1; i <= v.top; i++) { if (i % 2 === 0) o.push(String(i)); else t += i; } o.push("The odd numbers add up to " + t); return o; },
      explain: "i is even picks the even numbers to show, otherwise adds the odd ones, and as text turns the total into words for the last line." },
    { name: "Coin Collector", about: "add found coins, then ask if there are enough for the sword.",
      vars: [{ key: "coins", val: 2, min: 0, max: 20 }, { key: "found", val: 3, min: 0, max: 20 }, { key: "goal", val: 10, min: 1, max: 30 }],
      code: function (v) { return ["make a number called coins with " + v.coins, "make a number called found with " + v.found, "make a number called goal with " + v.goal, "add found to coins", "print \"You have\" and coins and \"coins.\"", "if coins is more than or equal to goal:", "  print \"You can buy the sword!\"", "otherwise:", "  print \"You need\" and goal - coins and \"more.\"", "end if"]; },
      run: function (v) { var c = v.coins + v.found, o = ["You have " + c + " coins."]; o.push(c >= v.goal ? "You can buy the sword!" : "You need " + (v.goal - c) + " more."); return o; },
      explain: "add found to coins grows the coins, and is more than or equal to asks whether there are at least enough." },
    { name: "Star Steps", about: "the text made of i copies of \"*\" builds each step.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return ["make a number called rows with " + v.rows, "for i from 1 to rows:", "  print the text made of i copies of \"*\"", "end for"]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.rows; i++) o.push(stars(i)); return o; },
      explain: "Each turn of the loop makes a longer row: one star, then two, then three." },
    { name: "Grade Checker", about: "otherwise if tries each grade in turn.",
      vars: [{ key: "score", val: 85, min: 0, max: 100 }],
      code: function (v) { return ["make a number called score with " + v.score, "if score is more than or equal to 90:", "  print \"Grade: A\"", "otherwise if score is more than or equal to 80:", "  print \"Grade: B\"", "otherwise if score is more than or equal to 70:", "  print \"Grade: C\"", "otherwise:", "  print \"Keep practicing!\"", "end if"]; },
      run: function (v) { return [v.score >= 90 ? "Grade: A" : v.score >= 80 ? "Grade: B" : v.score >= 70 ? "Grade: C" : "Keep practicing!"]; },
      explain: "Only the first question whose answer is yes runs, so 95 is an A and never also a B." },
    { name: "Day Namer", about: "check sorts a day number into its choice.",
      vars: [{ key: "day", val: 3, min: 1, max: 7 }],
      code: function (v) { return ["make a number called day with " + v.day, "check day:", "  if it is 6 or 7:", "    print \"Weekend: time to play!\"", "  if it is 1:", "    print \"Monday: a fresh start.\"", "  if it is 5:", "    print \"Friday: almost there!\"", "  otherwise:", "    print \"A school day.\"", "end check"]; },
      run: function (v) { return [v.day >= 6 ? "Weekend: time to play!" : v.day === 1 ? "Monday: a fresh start." : v.day === 5 ? "Friday: almost there!" : "A school day."]; },
      explain: "it is the day being checked; if it is 6 or 7: matches either, and otherwise: catches every other day." },
    { name: "Fizz Buzz", about: "the remainder of … divided by … finds the threes and fives.",
      vars: [{ key: "upto", val: 15, min: 1, max: 30 }],
      code: function (v) { return ["make a number called upto with " + v.upto, "for i from 1 to upto:", "  if the remainder of i divided by 15 is 0:", "    print \"FizzBuzz\"", "  otherwise if the remainder of i divided by 3 is 0:", "    print \"Fizz\"", "  otherwise if the remainder of i divided by 5 is 0:", "    print \"Buzz\"", "  otherwise:", "    print i", "  end if", "end for"]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(i % 15 === 0 ? "FizzBuzz" : i % 3 === 0 ? "Fizz" : i % 5 === 0 ? "Buzz" : String(i)); return o; },
      explain: "A remainder of 0 means the number divides exactly. 15 is asked first, because a number that divides by 15 divides by 3 and 5 too." },
    { name: "Score Board", about: "sort the scores, then show the best and the total.",
      vars: [{ key: "first", val: 12, min: 0, max: 99 }, { key: "second", val: 30, min: 0, max: 99 }, { key: "third", val: 7, min: 0, max: 99 }],
      code: function (v) { return ["make a number called first with " + v.first, "make a number called second with " + v.second, "make a number called third with " + v.third, "make a vector of numbers called scores with first and second and third", "sort scores", "for each score in scores:", "  print \"Score:\" and score", "end for", "print \"Best:\" and the biggest in scores", "print \"Total:\" and the sum of scores"]; },
      run: function (v) { var s = [v.first, v.second, v.third].sort(function (a, b) { return a - b; }); var o = s.map(function (x) { return "Score: " + x; }); o.push("Best: " + s[2]); o.push("Total: " + (s[0] + s[1] + s[2])); return o; },
      explain: "sort puts the scores smallest first, for each shows them in that order, and the biggest in and the sum of do the rest." },
    { name: "Double Machine", about: "A function that gives back twice its number, called again and again.",
      vars: [{ key: "start", val: 3, min: 1, max: 20 }, { key: "steps", val: 4, min: 1, max: 8 }],
      code: function (v) { return ["define double_it taking a number called x giving back a number:", "  give back x * 2", "end double_it", "make a number called start with " + v.start, "make a number called steps with " + v.steps, "make a number called n with start", "repeat steps times:", "  set n to call double_it with n", "  print n", "end repeat"]; },
      run: function (v) { var o = [], n = v.start; for (var i = 0; i < v.steps; i++) { n *= 2; o.push(String(n)); } return o; },
      explain: "call double_it with n hands n to the function, and give back hands the doubled number back to go into n." },
    { name: "Greeter", about: "A function that takes a text and a number.",
      vars: [{ key: "hellos", val: 2, min: 1, max: 6 }],
      code: function (v) { return ["define greet taking a text called who and a number called times:", "  repeat times times:", "    print \"Hello,\" and who", "  end repeat", "end greet", "make a number called hellos with " + v.hellos, "call greet with \"Mia\" and hellos", "call greet with \"Sam\" and 1"]; },
      run: function (v) { var o = []; for (var i = 0; i < v.hellos; i++) o.push("Hello, Mia"); o.push("Hello, Sam"); return o; },
      explain: "The things you call greet with go to its boxes in order: \"Mia\" into who, hellos into times." },
    { name: "Dog's Birthday", about: "A Boxx with things it has and things it can do.",
      vars: [{ key: "birthdays", val: 2, min: 1, max: 9 }],
      code: function (v) { return ["Boxx called Dog:", "  has a text called name", "  has a number called age with 1", "  when made taking a text called given:", "    set name to given", "  end when made", "  can have_a_birthday:", "    add 1 to age", "    print name and \"is now\" and age", "  end have_a_birthday", "  can bark:", "    print name and \"says woof!\"", "  end bark", "end Dog", "make a Dog called rex with \"Rex\"", "make a number called birthdays with " + v.birthdays, "repeat birthdays times:", "  rex have_a_birthday", "end repeat", "rex bark"]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.birthdays; i++) o.push("Rex is now " + (1 + i)); o.push("Rex says woof!"); return o; },
      explain: "rex have_a_birthday asks this dog to do one of its cans, and inside it, age means Rex's own age." },
    { name: "Cookie Sharing", about: "A function complains when there's nobody to share with, and try catches it.",
      vars: [{ key: "cookies", val: 12, min: 0, max: 40 }, { key: "friends", val: 3, min: 0, max: 6 }],
      code: function (v) { return ["define share taking a number called total and a number called people giving back a number:", "  if people is 0, complain \"nobody to share with\"", "  give back total / people", "end share", "make a number called cookies with " + v.cookies, "make a number called friends with " + v.friends, "try:", "  make a number called per_friend with call share with cookies and friends", "  print \"Each friend gets\" and per_friend and \"cookies.\"", "  print \"Left over:\" and cookies - per_friend * friends", "if it fails:", "  print \"Oops:\" and the problem", "end try"]; },
      run: function (v) { if (v.friends === 0) return ["Oops: nobody to share with"]; var e = Math.floor(v.cookies / v.friends); return ["Each friend gets " + e + " cookies.", "Left over: " + (v.cookies - e * v.friends)]; },
      explain: "Whole numbers divide to a whole number, so the leftover is what's left after everyone's share. With 0 friends, complain jumps straight to if it fails:." },
    { name: "Stack of Plates", about: "push piles plates up; take the top off takes them down, last one first.",
      vars: [{ key: "plates", val: 3, min: 1, max: 8 }],
      code: function (v) { return ["make a stack of numbers called pile", "make a number called plates with " + v.plates, "for i from 1 to plates:", "  push i onto pile", "  print \"Put plate\" and i and \"on top.\"", "end for", "while the count of pile is more than 0:", "  print \"Took plate\" and the top of pile and \"off the top.\"", "  take the top off pile", "end while"]; },
      run: function (v) { var o = [], i; for (i = 1; i <= v.plates; i++) o.push("Put plate " + i + " on top."); for (i = v.plates; i >= 1; i--) o.push("Took plate " + i + " off the top."); return o; },
      explain: "A stack gives back the last thing you put on it first, like real plates." },
    { name: "Shop Queue", about: "A queue serves people in the order they arrived.",
      vars: [{ key: "people", val: 4, min: 1, max: 9 }],
      code: function (v) { return ["make a queue of numbers called line", "make a number called people with " + v.people, "for i from 1 to people:", "  add i to line", "end for", "while the count of line is more than 0:", "  print \"Now serving number\" and the front of line", "  take the front off line", "end while", "print \"The shop is empty.\""]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.people; i++) o.push("Now serving number " + i); o.push("The shop is empty."); return o; },
      explain: "add joins the back of the line, and take the front off serves whoever got there first." },
    { name: "Number Finder", about: "The computer finds a secret number by always guessing the middle.",
      vars: [{ key: "secret", val: 37, min: 1, max: 100 }],
      code: function (v) { return ["note The computer finds your secret number by always guessing the middle.", "make a number called secret with " + v.secret, "make a number called low with 1", "make a number called high with 100", "make a number called tries with 0", "make a number called guess with 0", "while guess is not secret:", "  set guess to (low + high) / 2", "  add 1 to tries", "  if guess is less than secret:", "    print guess and \"- higher!\"", "    set low to guess + 1", "  otherwise if guess is more than secret:", "    print guess and \"- lower!\"", "    set high to guess - 1", "  end if", "end while", "print \"Got it! It was\" and secret and \"- found in\" and tries and \"tries.\""]; },
      run: function (v) {
        var o = [], low = 1, high = 100, tries = 0, guess = 0;
        while (guess !== v.secret) {
          guess = Math.floor((low + high) / 2); tries++;
          if (guess < v.secret) { o.push(guess + " - higher!"); low = guess + 1; }
          else if (guess > v.secret) { o.push(guess + " - lower!"); high = guess - 1; }
        }
        o.push("Got it! It was " + v.secret + " - found in " + tries + " tries.");
        return o;
      },
      explain: "Each guess cuts the numbers left in half, so it never needs more than 7 tries for 1 to 100." },
    { name: "Doubling Belt", about: "apply runs a function in a box on every item.",
      vars: [{ key: "base", val: 4, min: 1, max: 20 }],
      code: function (v) { return ["make a function called twice taking a number called n giving back a number: give back n * 2", "make a number called base with " + v.base, "make a vector of numbers called scores with base and base + 1 and base + 2", "apply twice to every item in scores", "for each score in scores:", "  print score", "end for"]; },
      run: function (v) { return [v.base * 2, (v.base + 1) * 2, (v.base + 2) * 2].map(String); },
      explain: "apply twice to every item in scores swaps each score for twice itself, right there in the vector." },
    { name: "Big Score Club", about: "A yes-or-no function picks out the big scores.",
      vars: [{ key: "limit", val: 10, min: 0, max: 30 }],
      code: function (v) { return ["make a number called limit with " + v.limit, "make a function called is_big taking a number called n giving back a yes or no: give back n is more than limit", "make a vector of numbers called scores with 4 and 15 and 8 and 23", "print \"Big scores:\" and the number of items in scores where is_big", "for each score in scores:", "  if call is_big with score, print score and \"is big!\"", "end for"]; },
      run: function (v) { var s = [4, 15, 8, 23], big = s.filter(function (x) { return x > v.limit; }); return ["Big scores: " + big.length].concat(big.map(function (x) { return x + " is big!"; })); },
      explain: "is_big gives back yes or no, so where counts the yeses, and an if can ask it directly." },
    { name: "Temperature Changer", about: "A decimal box keeps the part after the dot.",
      vars: [{ key: "celsius", val: 20, min: -20, max: 100 }],
      code: function (v) { return ["make a number called celsius with " + v.celsius, "make a decimal called fahrenheit with celsius * 1.8 + 32", "print celsius and \"degrees Celsius is\" and fahrenheit and \"degrees Fahrenheit.\"", "if fahrenheit is more than 86, print \"Hot! Drink some water.\"", "if fahrenheit is less than 32, print \"Freezing! Wear a hat.\""]; },
      run: function (v) { var f = v.celsius * 1.8 + 32, o = [v.celsius + " degrees Celsius is " + g6(f) + " degrees Fahrenheit."]; if (f > 86) o.push("Hot! Drink some water."); if (f < 32) o.push("Freezing! Wear a hat."); return o; },
      explain: "1.8 has a dot, so the math gives a decimal, and a decimal box keeps answers like 69.8." },
    { name: "Birthday Map", about: "A map looks ages up by name.",
      vars: [{ key: "bob", val: 9, min: 1, max: 15 }],
      code: function (v) { return ["make a number called bob with " + v.bob, "make a map from texts to numbers called ages with \"bob\" as bob and \"amy\" as 7", "set ages at \"zoe\" to 8", "print \"Bob is\" and ages at \"bob\"", "if ages has \"zoe\", print \"Zoe is here too, and she is\" and ages at \"zoe\"", "set ages at \"bob\" to (ages at \"bob\") + 1", "print \"After his birthday, Bob is\" and ages at \"bob\"", "print \"All together they are\" and (ages at \"bob\") + (ages at \"amy\") + (ages at \"zoe\")"]; },
      run: function (v) { return ["Bob is " + v.bob, "Zoe is here too, and she is 8", "After his birthday, Bob is " + (v.bob + 1), "All together they are " + (v.bob + 1 + 7 + 8)]; },
      explain: "ages at \"bob\" looks Bob up by his name, and set ages at … to changes the age kept under that name." },
    { name: "Word Echo", about: "Text words: the uppercase version, the length, and + to join.",
      vars: [{ key: "echoes", val: 3, min: 1, max: 6 }],
      code: function (v) { return ["make a text called word with \"hello\"", "make a number called echoes with " + v.echoes, "print the uppercase version of word", "print \"It has\" and the length of word and \"letters.\"", "repeat echoes times:", "  print word + \"!\"", "end repeat"]; },
      run: function (v) { var o = ["HELLO", "It has 5 letters."]; for (var i = 0; i < v.echoes; i++) o.push("hello!"); return o; },
      explain: "+ joins the word and the ! into one text, and the uppercase version of makes a shouting copy without changing word." }
  ];

  var vt = [
    { line: 'print "{w}"', why: "print shows the words between the quote marks." },
    { line: "print {v}", why: "print shows what's inside a box." },
    { line: 'print "{w}" and {v}', why: "and puts a space between the things." },
    { line: "note Remember to {f} the {sv}.", why: "A note is for people; the computer skips it." },
    { line: "make a number called {v} with {n}", why: "A number box holds a whole number." },
    { line: "make a decimal called {v} with {dec}", why: "A decimal box keeps the part after the dot." },
    { line: 'make a text called {sv} with "{w}"', why: "A text box holds words in quote marks." },
    { line: "make a letter called {v} with '{L}'", why: "A letter goes in small quotes." },
    { line: "make a yes or no called {v} with {b}", why: "A yes or no box holds just yes or no." },
    { line: "make a constant number called {v} with {n}", why: "A constant never changes." },
    { line: "set {v} to {n}", why: "set puts something new in a box." },
    { line: "set {v} to {v} + {d}", why: "The right side is worked out first." },
    { line: "set {v} to {v} * {d}", why: "Times the box by a number." },
    { line: "add {n} to {v}", why: "add is the short way to add onto a box." },
    { line: "let {v} be {n}", why: "let works out the kind for you." },
    { line: 'let {sv} be "{w}"', why: "Words in quotes make a text box." },
    { line: "print {n} + {n2}", why: "+ adds." },
    { line: "print ({n} + {n2}) * {d}", why: "Brackets go first." },
    { line: "print {n} / {d}", why: "Whole numbers divide to a whole number." },
    { line: "print {n}.0 / {d}", why: "A decimal keeps the part after the dot." },
    { line: "print the square root of {n}", why: "A math word from the standard library." },
    { line: "make a number called {v} with a random number from 1 to {n}", why: "Like rolling a dice with {n} sides." },
    { line: 'print "{w} " + {sv}', why: "+ joins two texts." },
    { line: 'print "{w}: " + ({v} as text)', why: "as text turns a number into text." },
    { line: "print the uppercase version of {sv}", why: "A shouting copy of the text." },
    { line: "print the length of {sv}", why: "Counts the letters." },
    { line: "if {v} is more than {n}:", why: "if asks a question; its lines move in." },
    { line: 'if {v} is less than {n}, print "{w}"', why: "A short if fits on one line." },
    { line: "if {v} is {n}, set {u} to 0", why: "is asks whether two things are the same." },
    { line: "otherwise if {v} is more than {d}:", why: "otherwise if asks the next question." },
    { line: 'if {v} is even, print "{w}"', why: "even is 2, 4, 6 and so on." },
    { line: 'if {v} is more than {n} and {u} is less than {d}, print "{w}"', why: "and needs both answers to be yes." },
    { line: "if not {v} is {n}, add 1 to {u}", why: "not flips yes and no." },
    { line: "repeat {n} times:", why: "repeat runs its lines a number of times." },
    { line: "repeat {d} times: add {n} to {v}", why: "One thing to repeat fits after the colon." },
    { line: "for i from 1 to {n}:", why: "for counts, both ends included." },
    { line: "for i from {n} down to 0 by {d}:", why: "down to counts backwards." },
    { line: "while {v} is more than {d}:", why: "while keeps going while the answer is yes." },
    { line: "until {v} is more than {n}", why: "repeat: … until asks at the bottom." },
    { line: "if {v} is more than {n}, break", why: "break stops the loop." },
    { line: "if {v} is {d}, continue", why: "continue skips to the next turn." },
    { line: "check {v}:", why: "check looks at one value for many choices." },
    { line: "if it is {n} or {n2}:", why: "it is the value being checked." },
    { line: "make a vector of numbers called {arr} with {n} and {n2} and {n3}", why: "A vector is a row that can grow." },
    { line: "add {n} to {arr}", why: "add puts one more on the end." },
    { line: "print {arr} at {d}", why: "Counting starts at 0." },
    { line: "print the count of {arr}", why: "How many items there are." },
    { line: "sort {arr} from biggest to smallest", why: "sort puts the items in order." },
    { line: "for each {v} in {arr}:", why: "for each visits every item." },
    { line: 'make a map from texts to numbers called {m} with "{w}" as {n}', why: "A map looks things up by key." },
    { line: 'set {m} at "{w}" to {n}', why: "set … at … to puts a value under a key." },
    { line: 'if {m} has "{w}", print {m} at "{w}"', why: "has asks whether the key is there." },
    { line: "push {n} onto {arr}", why: "push piles onto a stack." },
    { line: "print the top of {arr}", why: "A stack gives the top first." },
    { line: "define {f}:", why: "define makes a function." },
    { line: "define {f} taking a number called {v} giving back a number:", why: "What it takes, and what it gives back." },
    { line: "give back {v} * {d}", why: "give back hands the answer back." },
    { line: "print call {f} with {n}", why: "call runs a function." },
    { line: "make a function called {f} taking a number called {v} giving back a number: give back {v} + {n}", why: "A function in a box." },
    { line: "apply {f} to every item in {arr}", why: "Runs a function on every item." },
    { line: "Boxx called {c}:", why: "Boxx invents a new kind of thing." },
    { line: "Boxx called {c} uses {k}:", why: "uses gets all of another kind's powers." },
    { line: "has a number called {v} with {n}", why: "has gives a Boxx something to remember." },
    { line: "can {f}:", why: "can gives a Boxx something it can do." },
    { line: "make a {c} called {o} with {n}", why: "Make one thing of your new kind." },
    { line: "{o} {f}", why: "Its name, then what it can do." },
    { line: "print the {v} of {o}", why: "Read one thing it has." },
    { line: 'complain "{w} went wrong"', why: "complain raises a problem." },
    { line: 'print "{w}:" and the problem', why: "the problem says what went wrong." },
    { line: "wait {d} seconds", why: "wait pauses the program." },
    { line: 'ask "What is your {sv}?" into {sv}', why: "ask waits for an answer." },
    { line: 'write "{w}" to "{sv}.txt"', why: "write saves words in a file." },
    { line: "make a box called {o}", why: "A box in the 3D world." },
    { line: "paint {o} {col}", why: "paint gives a box a color." },
    { line: "move {o} by {d}, {n}, 0", why: "x, y and z: right, up, towards you." },
    { line: "spin {o} by {n}", why: "spin turns a box." },
    { line: 'say "{w}, {sv}!"', why: "say puts words on the screen." }
  ];
  var themes = [
    { name: "Print & Notes", t: [0, 1, 2, 3, 16] },
    { name: "Making Boxes", t: [4, 5, 6, 7, 8] },
    { name: "Constants & Let", t: [9, 14, 15, 21, 6] },
    { name: "Changing Boxes", t: [10, 11, 12, 13, 14] },
    { name: "Math", t: [16, 17, 18, 19, 20] },
    { name: "Words & Text", t: [22, 23, 24, 25, 6] },
    { name: "Questions", t: [26, 27, 28, 29, 30] },
    { name: "And, Or, Not", t: [31, 32, 27, 30, 28] },
    { name: "Repeat & Count", t: [33, 34, 35, 36, 13] },
    { name: "While & Until", t: [37, 38, 39, 40, 11] },
    { name: "Check", t: [41, 42, 28, 27, 30] },
    { name: "Vectors", t: [43, 44, 45, 46, 47] },
    { name: "For Each", t: [48, 44, 46, 43, 47] },
    { name: "Maps", t: [49, 50, 51, 6, 4] },
    { name: "Stacks", t: [52, 53, 44, 46, 43] },
    { name: "Functions", t: [54, 55, 56, 57, 13] },
    { name: "Function Boxes", t: [58, 59, 57, 55, 56] },
    { name: "Boxx", t: [60, 61, 62, 63, 64] },
    { name: "Things & Problems", t: [65, 66, 67, 68, 64] },
    { name: "World & Files", t: [69, 70, 71, 72, 73, 74, 75, 76] }
  ];
  // English++ banks: no name that's also an English++ word (note, box, push, spin …).
  var FUNCS = ["cheer", "heal", "jump", "dance", "sing", "build", "dash", "shine", "mix", "lift", "launch", "glide", "wave", "zap", "mend", "craft", "boost", "greet", "explore", "charge", "roar", "fly", "swim", "bounce", "juggle", "wobble"];
  var TEXTS = ["name", "hero", "title", "word", "song", "city", "team", "pet", "ship", "book", "label", "tag", "poem", "story", "quest", "badge", "motto", "riddle", "charm", "wish"];
  var THINGS = ["gem", "hero", "bot", "pet", "ship", "star", "cube", "orb", "egg", "kite"];
  var KINDS = ["Player", "Robot", "Dragon", "Wizard", "Knight", "Rocket", "Castle", "Potion", "Shield", "Garden"];
  var BASES = ["Comet", "Falcon", "Turtle", "Beacon", "Puzzle", "Sailor", "Keeper", "Pirate", "Monster", "Unicorn"];
  var COLORS = ["red", "blue", "green", "gold", "purple", "white", "black", "pink", "orange", "cyan"];
  function pick(bank, r) { return bank[Math.floor(r() * bank.length)]; }

  return {
    blocks: blocks, chapters: chapters, shelves: shelves, glossary: glossary, field: field, cheats: cheats,
    projects: projects, vt: vt, themes: themes,
    fill: function (k, r) {
      if (k === "f") return pick(FUNCS, r);
      if (k === "sv") return pick(TEXTS, r);
      if (k === "o") return pick(THINGS, r);
      if (k === "c") return pick(KINDS, r);
      if (k === "k") return pick(BASES, r);
      if (k === "col") return pick(COLORS, r);
      if (k === "b") return r() < 0.5 ? "yes" : "no";
      return null;
    },
    sandboxNote: "Thirty English++ lines in the book's main form — three words on every line: who, the root, and what — in the order The English++ Book teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your English++ progress is saved separately from every other track.",
    sourcesHTML: "English++ facts and syntax follow <i>The English++ Book</i> (for English++ Studio 3). English++ Studio is a Windows program, so it can't run inside Code Block's checks: every practice program and library example is run instead by a stand-in interpreter written from the book, and every drill and Vault line is read by it in place. Where the book doesn't settle how something prints, these lessons don't print it. Every explanation is written in Code Block's own words."
  };
});
