"use strict";
/* Code Block — the Library: book data, reader, picture stage.
   Split from js/views.js (lines 129-864). Loads after js/views.js
   and before js/views-pc.js. */
/* ================= LIBRARY DATA =================
   Original plain-words retellings, following the book's chapter order.
   scenes: key into sceneSVG(). demo: lines the picture "plays". */
var LIB = [
  { story: ["Imagine your computer has a mouth, and std::cout is it. When you want the computer to SAY something, you pour the words into std::cout using two arrows: <<.", "The words you want to say wear a pair of double quotes, like a costume: \"Hello\". The quotes tell C++: this is text, say it exactly like this.", "Every instruction ends with a semicolon: ; — think of it as a full stop at the end of a sentence. Forget it, and C++ gets confused, just like a sentence that never ends…"],
    big: "std::cout << \"words\"; is how a program talks. Arrows pour the words to the screen.",
    caption: "The screen has a mouth. Pour words in with << and it says them out loud. Tap Play and watch it talk.",
    demo: ["std::cout wakes up…", "Pouring the words in:  << \"Hello\"", "The screen says: Hello", "That is all printing is — the computer, talking."] },
  { story: ["A variable is a box with a name tag. This box's tag says score, and its shape — int — means it can only hold whole numbers: 0, 1, 2, 3… no halves, no words.", "The equals sign = puts something inside the box. int score = 0; builds the box AND puts a 0 in it to start with.", "Later you can empty the box and put a different number in. The box stays the same. What is inside can change — that is why it is called a variable: it varies!"],
    big: "int score = 0; makes a labeled box for whole numbers, with 0 inside to begin.",
    caption: "A box with a name tag. The number inside can change whenever your program wants. Tap Play to fill the box.",
    demo: ["Building a box labeled: score", "The box holds whole numbers only (int).", "Putting 0 inside… done!", "score is now 0. The box is ready for the game."] },
  { story: ["If std::cout is the computer's mouth, std::cin is its ear. It LISTENS to the keyboard and waits for someone to type.", "The arrows >> point INTO your variable, because the information flows from the keyboard into the box. std::cin >> name; means: whatever gets typed, pour it into the box called name.", "Easy way to remember: cout arrows point OUT to the screen. cin arrows point IN from the keyboard. Arrows always show which way the information is flowing."],
    big: "std::cin >> name; listens to the keyboard and pours what is typed into a box.",
    caption: "Now the computer listens. Whatever is typed travels along the arrows and lands in the box. Tap Play to type something.",
    demo: ["std::cin is listening…", "Someone types: V", "The letters flow along >> …", "…and land in the box called name.", "name now holds: V"] },
  { story: ["Programs are always changing numbers: adding points, spending coins, counting down. Writing total = total + price works, but C++ has a shortcut that says the same thing in less space: total += price;", "Read += as: add this ONTO what is already there. If total was 10 and price is 3, afterwards total is 13. The old value is not thrown away — the new one is piled on top.", "There are cousins too: -= takes away, *= multiplies. They all mean: change the box using what is already inside it."],
    big: "total += price; adds price onto total's current value — a shortcut for total = total + price.",
    caption: "The piggy bank never empties. Each coin lands ON TOP of the coins already inside. Tap Play to drop coins in.",
    demo: ["total starts at 0.", "total += 3  →  total is 3", "total += 5  →  total is 8", "total += 2  →  total is 10", "Nothing was erased. It all piled up."] },
  { story: ["Games — and programs — have to make choices. if is how C++ asks a yes-or-no question: if (hp <= 0) asks, is the hero's health at zero or below?", "If the answer is YES, the code inside the curly braces { } runs — here, gameOver(). If the answer is NO, the braces are skipped, and the hero plays on.", "The braces are like a fence: everything inside them belongs to the if. No fence, no group!"],
    big: "if asks a yes/no question. Yes — the code in the braces runs. No — it is skipped.",
    caption: "A fork in the road. The if reads the sign and chooses the path. Tap Play to test both answers.",
    demo: ["Question: is hp <= 0 ?", "hp is 2 → answer: NO → the hero plays on.", "…the hero takes damage. hp is now 0.", "Question again: is hp <= 0 ?", "Answer: YES → gameOver() runs. The end!"] },
  { story: ["Sometimes there is not just yes or no — there are many doors: level 1, level 2, level 3… switch is a hallway full of doors. It looks at ONE value and opens the matching door, called a case.", "switch (level) { case 1: break; } means: if level is 1, do this door's job. The break is a little wall at the end of the door's room — it stops you tumbling into the NEXT door's room by accident.", "Use if for questions, and switch for picking one door from a row of doors."],
    big: "switch picks the one case that matches a value. break closes the door behind you.",
    caption: "A row of doors, one for each level. switch opens only the matching one. Tap Play to open door 1.",
    demo: ["level is 1.", "switch looks down the row of doors…", "case 1 matches! The door opens.", "break! The door closes before we fall into case 2.", "One value, one door. Tidy."] },
  { story: ["A for loop is a counting machine. It has three parts sitting in a row, separated by semicolons: start, rule, step. for (int i = 0; i < 5; i++)", "Start: int i = 0 — begin counting at 0. Rule: i < 5 — keep going while i is less than 5. Step: i++ — add 1 each time around.", "So the loop runs with i = 0, 1, 2, 3, 4 — five times — and stops before 5. Anything inside the braces happens on every lap. Counting laps is what for loops do best."],
    big: "for = start, rule, step. It repeats the braces once per count, then stops on time.",
    caption: "The counting wheel turns exactly five times: 0, 1, 2, 3, 4 — then it stops, right on time. Tap Play to spin it.",
    demo: ["Lap 1: i = 0", "Lap 2: i = 1", "Lap 3: i = 2", "Lap 4: i = 3", "Lap 5: i = 4", "i reaches 5 — rule says stop. Five laps, done!"] },
  { story: ["while is the loop that does not count — it just keeps asking a question. while (lives > 0) means: keep going for as long as lives is more than 0.", "Every lap, something must CHANGE, or the loop will spin forever like a hamster wheel with no off switch. Here, lives-- takes one life away each lap, so the question gets closer and closer to NO.", "Use for when you know how many laps. Use while when you only know the stopping question."],
    big: "while repeats while its question stays true — so something inside must change each lap.",
    caption: "The hamster runs while it has lives left. Each lap costs one life, so the wheel always stops. Tap Play.",
    demo: ["lives = 3 → still > 0 → keep running!", "lives = 2 → still > 0 → keep running!", "lives = 1 → still > 0 → keep running!", "lives = 0 → question is NO → the wheel stops."] },
  { story: ["A vector is a train that can add more carriages WHILE it is moving. std::vector<int> scores = {10, 20, 30}; builds a train carrying whole numbers, starting with three of them: 10, 20, and 30.", "The <int> part says what the carriages may carry — whole numbers. The curly braces list the first passengers.", "Need more room? The train grows. A plain array is fixed forever, but a vector stretches and shrinks as your program needs — that is why programmers use them everywhere."],
    big: "A vector is a list that can grow and shrink. <int> says what it holds; { } lists the starters.",
    caption: "A train that builds new carriages whenever it needs them. Tap Play to watch it grow.",
    demo: ["The train starts: [10] [20] [30]", "A new passenger arrives: 40", "The train grows a carriage: [10] [20] [30] [40]", "No rebuild. No fuss. Vectors just grow."] },
  { story: ["Every variable lives somewhere in the computer's memory — it has an address, like a house on a street. The & symbol asks a variable: where do you live? &score means: the address of score.", "A pointer is a box that holds an address instead of a number. int* ptr = &score; says: ptr, you hold the address of the box called score.", "With the address, you can find the real box any time and change what is inside it — even from far away in your program. Pointers are signposts, not houses."],
    big: "& gets a variable's address. A pointer is a signpost box that holds that address.",
    caption: "The pointer is a signpost. Follow it, and you arrive at the real box. Tap Play to follow the signpost.",
    demo: ["score lives at address 42 Memory Lane.", "&score asks: where does score live? → 42", "ptr now holds the signpost: 42", "Follow the signpost… you reach the real score box."] },
  { story: ["A reference is a nickname. If a box is named hp, then int& gives it a second name tag — and both tags are stuck on the SAME box.", "In void heal(int& hp) { hp += 10; }, the heal function receives the nickname. When it adds 10 to hp inside the function, the ORIGINAL box changes too — because there was only ever one box.", "Without the &, the function would get a photocopy, and the original would never feel the healing. Nicknames let functions fix the real thing."],
    big: "A reference (int&) is a second name for the same box. Change one name, both change.",
    caption: "One box, two name tags. Healing through the nickname heals the real box. Tap Play to heal.",
    demo: ["The real box: hp = 40", "heal() gets the nickname for hp.", "hp += 10 … through the nickname…", "The real box now says: hp = 50", "One box all along. That is the trick."] },
  { story: ["Numbers are not the only thing programs juggle — they juggle words too. std::string is a box specially built for text. std::string hero = \"V\"; builds a text box holding the letter V.", "Text always wears double quotes so C++ knows where the words start and end. A string can be one letter, a whole name, or an entire book.", "Strings are friendly: they can grow longer, shrink, and join together. \"Co\" + \"de\" makes \"Code\". Text boxes that stretch — like vectors for words."],
    big: "std::string holds text. Quotes mark the text; strings can grow and join together.",
    caption: "Letter tiles on a string. Join two pieces and they snap into a word. Tap Play to join them.",
    demo: ["Tile one: \"Co\"", "Tile two: \"de\"", "Joining with + …", "\"Co\" + \"de\" = \"Code\"", "Words, built from pieces."] },
  { story: ["A function is a little machine with a name. You feed it inputs, it does its job, and it hands back an answer. int damage(int atk, int def) { return atk - def; } is a damage machine.", "The word int before the name promises what kind of answer comes out — a whole number. The inputs ride inside the parentheses: atk and def. And return is the machine handing the answer back through the slot.", "Build the machine once, use it a thousand times. That is the whole point of functions: never do the same job twice by hand."],
    big: "A function is a named machine: inputs in, work inside, return hands the answer back.",
    caption: "Feed the machine an attack and a defense. It crunches, and the damage pops out. Tap Play to run the machine.",
    demo: ["Feeding in: atk = 9, def = 4", "The machine crunches: 9 - 4 …", "Out pops the answer: 5", "damage is 5. Call the machine any time."] },
  { story: ["A class is a blueprint for a brand-new kind of box — one YOU invent. class Block { public: int size; }; draws a blueprint called Block, and every Block will have a size inside it.", "The word public: is like opening the blueprint's door: it means other parts of the program are allowed to look inside and use what is there.", "And the most forgotten character in C++: the semicolon after the class's closing brace. Blueprints need it. Forgetting it is the classic beginner wobble — now you know!"],
    big: "A class is your own blueprint for a new kind of box. public: opens the door; don't forget the final ;",
    caption: "A blueprint on the drawing board. Every Block built from it gets its own size. Tap Play to build from the blueprint.",
    demo: ["Reading the blueprint: class Block", "public: the door is open.", "Building a Block… it has a size inside.", "One blueprint, endless Blocks."] },
  { story: ["Imagine you have a great Block blueprint, and now you want a FireBlock — a Block that is ALSO on fire. You do not redraw everything. You inherit: class FireBlock : public Block { };", "The part : public Block says: start with everything Block can already do, free of charge, and then add my new bits on top.", "FireBlock IS a Block — plus fire. Programmers call Block the parent and FireBlock the child. Families of blueprints, sharing their best parts."],
    big: ": public Block means the new class starts with everything the old class could do — then adds more.",
    caption: "The child blueprint copies the parent for free — then adds flames. Tap Play to inherit.",
    demo: ["Parent blueprint: Block (has size).", "Child blueprint: FireBlock", "FireBlock inherits size… for free!", "Then adds its own gift: fire.", "Everything the parent had, plus more."] },
  { story: ["Sometimes programs trip: a file is missing, a number goes wrong, something unexpected jumps out. try { play(); } marks the risky ground: try the risky thing, but keep an eye on it.", "If anything inside try throws an error, the program does not crash and burn — it leaps sideways into catch, the safety net. catch (...) catches absolutely anything, like a net with no holes.", "Your program lands softly, stays alive, and can tell the player what happened. Every sturdy program wears a safety net over its risky parts."],
    big: "try marks risky code; if it throws, catch is the net. The program lands instead of crashing.",
    caption: "The tightrope walker trips — but the net catches every fall. Tap Play to drop the error.",
    demo: ["play() is walking the tightrope inside try { }…", "Uh oh — something threw an error!", "Falling… falling…", "CAUGHT by catch (...). The program lives!"] },
  { story: ["Here is a magic trick. You write ONE function, and it works for numbers, decimals, words — anything. The secret word is template. template <typename T> turns T into a fill-in-the-blank.", "In T twice(T x) { return x + x; }, T is the blank. Hand twice an int, and T becomes int. Hand it a string, T becomes string. C++ fills the blank in for you, every time.", "One recipe, every ingredient. Templates are how C++ builds tools — like vectors themselves — that work with any type you pour in."],
    big: "template makes T a fill-in-the-blank type. Write the code once; it works for many types.",
    caption: "One cookie cutter, many cookies — stars, hearts, circles, all from the same cutter. Tap Play to stamp some shapes.",
    demo: ["The cutter (T) is blank…", "Pour in int → twice(3) = 6", "Pour in double → twice(2.5) = 5.0", "Pour in string → twice(\"ha\") = \"haha\"", "Same code. Every type. Magic — but real."] },
  { story: ["A lambda is a tiny function with no name, built right where you need it, like a paper plane folded on the spot. auto hit = [](int x) { return x * 2; }; folds one and keeps it in a box called hit.", "The [] is the fold that opens every lambda. (int x) is its input. auto means: C++, you figure out the machine's type — it can, because it can see the whole plane.", "Now hit is a machine you can carry around and fire whenever: hit(5) gives 10. Small, quick, and gone when you are done — lambdas are the sticky notes of functions."],
    big: "A lambda is a tiny unnamed function stored in a variable. [] opens it; auto lets C++ name its type.",
    caption: "A paper plane folded on the spot: feed it a number and it doubles back double. Tap Play to launch it.",
    demo: ["Folding the lambda: [](int x) { return x * 2; }", "Keeping it in a box called hit.", "hit(5) → 10", "hit(21) → 42", "Folded in seconds, flying instantly."] }
];

/* ---------- The Library's 19 chapters — the WHOLE book, in order ----------
   One entry per book chapter: nothing merged, nothing skipped.
   Chapters the Sandbox already tells well reuse those stories (LIB);
   chapters the Sandbox folds together or leaves out — Fundamental Types
   as one chapter, Decisions as one, Arrays and Loops as one, Pointers
   and References as one, plus Program Files, Operator Overloading,
   Polymorphism, Class Templates, Move Semantics, and Containers and
   Algorithms — get their own full stories here. */
var CHAPTERS = window.CB_T ? CB_T.chapters : window.__isDrive ? DRIVE_CHAPTERS : window.__isCS ? CS_CHAPTERS : [
  { title: "Basic Ideas", chapter: "Book Ch. 1 · Basic Ideas", color: "#53b1fd", scene: 0, line: 'std::cout << "Hello";', content: LIB[0] },
  { title: "Fundamental Types", chapter: "Book Ch. 2 · Introducing Fundamental Types of Data", color: "#38bdf8", scene: 1, line: ["int score = 0;", "std::cin >> score;"],
    content: { story: ["Every value in C++ has a KIND, called a type. int holds whole numbers like 0, 7, or -3. double holds numbers with a dot, like 3.5. char holds ONE letter, and bool holds just true or false. The type is the shape of the box — it decides what fits inside.", "A variable is a box with a name tag and a shape. int score = 0; builds a whole-number box called score, with 0 inside to start. Later you can empty the box and put a different number in — the box stays the same, but what is inside can change. That is why it is called a variable: it varies!", "Almost every program follows one recipe: input, process, output. std::cin >> score; is the input step — the computer listens to the keyboard and pours what is typed into the box. Then your code does its work, and std::cout shows the result on the screen."],
      big: "Types are box shapes: int for whole numbers, double for decimals, char for one letter, bool for true or false.",
      caption: "Boxes come in shapes. An int box fits whole numbers only — and cin can pour a typed number straight into it. Tap Play to fill the box.",
      demo: ["Building a box labeled: score", "Shape check: int — whole numbers only.", "Putting 0 inside… done!", "Someone types 7 — cin pours it in.", "score is now 7. Input, into the box."] } },
  { title: "Working with Numbers", chapter: "Book Ch. 3 · Working with Fundamental Data Types", color: "#2fc4e8", scene: 3, line: "total += price;", content: LIB[3] },
  { title: "Making Decisions", chapter: "Book Ch. 4 · Making Decisions", color: "#3ec6dd", scene: 4, line: ["if (hp <= 0) { gameOver(); }", "switch (level) { case 1: break; }"],
    content: { story: ["Programs have to make choices — that is what makes a computer more than a calculator. if asks a yes-or-no question: if (hp <= 0) asks, is the hero's health at zero or below? If the answer is YES, the code inside the curly braces { } runs. If NO, the braces are skipped and the hero plays on. The braces are a fence: everything inside belongs to the if.", "Sometimes there is not just yes or no — there are many doors: level 1, level 2, level 3… switch is a hallway full of doors. It looks at ONE value and opens the matching door, called a case. switch (level) { case 1: break; } means: if level is 1, do this door's job.", "The break at the end of a case is a little wall — it stops you tumbling into the NEXT door's room by accident. So remember: use if for questions, and switch for picking one door from a row of doors."],
      big: "if runs its braces when the answer is yes. switch picks the one case that matches — and break closes the door behind you.",
      caption: "A fork in the road and a row of doors. if chooses the path; switch opens only the matching door. Tap Play to test both.",
      demo: ["Question: is hp <= 0 ? hp is 2 → NO → the hero plays on.", "…the hero takes damage. hp is now 0.", "Question again: is hp <= 0 ? YES → gameOver() runs!", "Now level is 1 → switch opens case 1's door.", "break! Door closed. One value, one door."] } },
  { title: "Arrays and Loops", chapter: "Book Ch. 5 · Arrays and Loops", color: "#6d9df5", scene: 6, line: "for (int i = 0; i < 5; i++) { }",
    content: { story: ["An array is a ROW of boxes sharing one name, numbered from 0. scores[0] is the first box, scores[1] the second, and so on. Instead of inventing fifty separate names, you name the row once — and point at each box by its number.", "A for loop is a counting machine built to walk that row: start, rule, step. for (int i = 0; i < 5; i++) starts counting at 0, keeps going while i is less than 5, and adds 1 each lap. Five laps — and every box gets a visit, right on time.", "A while loop does not count at all — it just keeps asking a question: while (lives > 0) repeats for as long as lives remain. Something inside must CHANGE each lap, like lives--, or the question never turns to NO and the loop spins forever. Use for when you know the laps; use while when you only know the stopping question."],
      big: "An array is a numbered row of boxes. for counts its laps (start, rule, step); while repeats while its question stays true.",
      caption: "A row of boxes, and the counting wheel that visits each one: 0, 1, 2, 3, 4 — then stops, right on time. Tap Play to spin it.",
      demo: ["The row: scores[0] [1] [2] [3] [4]", "Lap 1: i = 0 → visiting box 0", "Lap 2: i = 1 → visiting box 1", "Laps 3, 4, 5: i = 2, 3, 4 → every box visited", "i reaches 5 — rule says stop. Done!"] } },
  { title: "Pointers and References", chapter: "Book Ch. 6 · Pointers and References", color: "#4fb3ff", scene: 9, line: ["int* ptr = &score;", "void heal(int& hp) { hp += 10; }"],
    content: { story: ["Every variable lives somewhere in the computer's memory — it has an address, like a house on a street. The & symbol asks a variable: where do you live? &score means: the address of score.", "A pointer is a box that holds an address instead of a number. int* ptr = &score; says: ptr, you hold the signpost to score. Follow the signpost and you reach the real box — and can change what is inside it, even from far away in your program. Pointers are signposts, not houses.", "A reference is a nickname: int& sticks a second name tag on the SAME box. In void heal(int& hp) { hp += 10; }, the heal function works through the nickname — and the ORIGINAL box really gains 10 health, because there was only ever one box. Without the &, the function would heal a photocopy, and the hero would feel nothing."],
      big: "& gets a variable's address. A pointer holds that address like a signpost; a reference (int&) is a second name for the same box.",
      caption: "A signpost and a nickname — both lead back to the one real box. Follow the pointer, then heal through the nickname. Tap Play.",
      demo: ["score lives at address 42 Memory Lane.", "&score asks: where does score live? → 42", "ptr now holds the signpost: 42", "Follow it… you reach the real score box.", "heal(int& hp) adds 10 — the real box feels it!"] } },
  { title: "Working with Strings", chapter: "Book Ch. 7 · Working with Strings", color: "#2fb9e8", scene: 11, line: 'std::string hero = "V";', content: LIB[11] },
  { title: "Defining Functions", chapter: "Book Ch. 8 · Defining Functions", color: "#3b8ef0", scene: 12, line: "int damage(int atk, int def) { return atk - def; }", content: LIB[12] },
  { title: "Function Templates", chapter: "Book Ch. 9 · Function Templates", color: "#3f7de0", scene: 16, line: "template <typename T> T twice(T x) { return x + x; }", content: LIB[16] },
  { title: "Program Files & the Preprocessor", chapter: "Book Ch. 10 · Program Files and Preprocessing Directives", color: "#0ea5e9", scene: 18, line: ['#include "Block.h"', "#define MAX_SCORE 100", "#pragma once"],
    content: { story: ["Small programs live in one file. Big programs move house — they split into a TEAM of files. The declarations other files need to see — what a class looks like, what a function promises — go in a header file, whose name ends in .h. The real working code lives in source files, ending in .cpp.", "#include is a fetch instruction. When a source file says #include \"Block.h\", it means: fetch that header and paste its contents right here, so I can use what is inside. Your old friend #include <iostream> does exactly this — it fetches the tools for std::cout and std::cin.", "Lines beginning with # are not normal code. They are instructions for the PREPROCESSOR — a tidy-up helper that prepares your files BEFORE the compiler reads them. #define MAX_SCORE 100 teaches it a swap: everywhere MAX_SCORE appears, paste 100 instead. And #pragma once at the top of a header promises: paste me only once, no matter how many files ask."],
      big: "Headers (.h) hold what other files need to see; sources (.cpp) hold the work. # lines talk to the preprocessor, which fetches and tidies files before compiling.",
      caption: "Puzzle pieces that click together: #include fetches a header and pastes it in before the real compiling starts. Tap Play to assemble the program.",
      demo: ["The program lives in pieces: Block.h + main.cpp", "main.cpp says: #include \"Block.h\"", "The preprocessor pastes Block.h in — click!", "#define swaps MAX_SCORE → 100 everywhere.", "#pragma once kept the header from doubling.", "One tidy file reaches the compiler. Teamwork!"] } },
  { title: "Your Own Data Types", chapter: "Book Ch. 11 · Defining Your Own Data Types", color: "#2f9be8", scene: 13, line: "class Block { public: int size; };", content: LIB[13] },
  { title: "Operator Overloading", chapter: "Book Ch. 12 · Operator Overloading", color: "#4f9cf9", scene: 19, line: "Block operator+(const Block& other) const;",
    content: { story: ["You already know + works on numbers: 2 + 3 makes 5. But what should + mean for YOUR class — for two Block objects? At first, nothing at all. C++ just shrugs. Operator overloading is how you teach it an answer.", "You write a special function whose name is operator+. When C++ sees blockA + blockB, it quietly calls your function — and your function decides what adding two Blocks means. Maybe their sizes join into one bigger Block.", "You can teach the other symbols too: == to ask if two Blocks are equal, << to print a Block to the screen, ++ to grow one. Taught kindly, your own types start to behave just like the built-in types — numbers with superpowers."],
      big: "operator+ is a function you write so that + works on your own classes. ==, <<, and ++ can be taught the same way.",
      caption: "Two Blocks and one plus sign. Teach operator+ what adding means, and the two Blocks join into one. Tap Play to add them.",
      demo: ["blockA (size 3) meets blockB (size 4).", "C++ asks: what does + mean for Blocks?", "Your operator+ answers: join the sizes!", "blockA + blockB → a new Block, size 7.", "Your type — your rules for the symbols."] } },
  { title: "Inheritance", chapter: "Book Ch. 13 · Inheritance", color: "#7fb2e5", scene: 14, line: "class FireBlock : public Block { };", content: LIB[14] },
  { title: "Polymorphism", chapter: "Book Ch. 14 · Polymorphism", color: "#48cae4", scene: 20, line: "virtual void speak() { }",
    content: { story: ["Poly means MANY, and morph means SHAPE — so polymorphism means: one action, many shapes. Line up a dog, a cat, and a duck, and give ONE instruction: speak! The dog barks, the cat meows, the duck quacks. Same word, three different results.", "In C++ you build this with a family. The parent class marks a function virtual: virtual void speak(). Virtual is a promise that means — children are allowed to replace this with their own version. Each child class then OVERRIDES speak() with its own sound.", "Now the magic trick: your program can keep a whole row of animals as Animal pointers, call speak() on each in one simple loop, and every animal answers in its OWN voice. C++ checks at run time which child is really there, and calls the right version. One loop — many voices."],
      big: "virtual in the parent lets each child override the same function. One call, many behaviors — and C++ picks the right one at run time.",
      caption: "One button says SPEAK! — and every character answers in its own voice. That is polymorphism. Tap Play to hear them all.",
      demo: ["One instruction for everyone: speak()!", "Dog's override answers: Woof!", "Cat's override answers: Meow!", "Duck's override answers: Quack!", "Same call. Three voices. Polymorphism!"] } },
  { title: "Runtime Errors & Exceptions", chapter: "Book Ch. 15 · Runtime Errors and Exceptions", color: "#6495ed", scene: 15, line: "try { play(); } catch (...) { }", content: LIB[15] },
  { title: "Class Templates", chapter: "Book Ch. 16 · Class Templates", color: "#2f7fd0", scene: 21, line: ["template <typename T>", "class Box { T value; };"],
    content: { story: ["Chapter 9 taught a FUNCTION to fill in a blank type. A class template does the same trick for a whole BLUEPRINT. Writing template <typename T> above a class turns T into a blank that the entire class can use.", "class Box { T value; }; is a box blueprint that has not yet decided what it holds. Ask for Box<int> and C++ stamps out a box for whole numbers. Ask for Box<std::string> and it stamps out a box for text — from the very same blueprint.", "And here is the secret hiding in plain sight: std::vector — the growing train from Chapter 5 — IS a class template. So are many of the Standard Library's best tools. One blueprint, stamped out for any type you pour in."],
      big: "A class template is a blueprint with a blank type T. Box<int> and Box<string> are two different real classes, stamped from one blueprint.",
      caption: "One mold, many boxes: pour in int, double, or string, and out pop three different boxes — all from one blueprint. Tap Play to stamp them.",
      demo: ["The mold: template <typename T> class Box { T value; }", "Pour in int → a Box<int> pops out!", "Pour in std::string → a Box<string> pops out!", "Same blueprint, both times.", "And the vector train? A class template too."] } },
  { title: "Move Semantics", chapter: "Book Ch. 17 · Move Semantics", color: "#7cc7ff", scene: 22, line: "Box b2 = std::move(b1);",
    content: { story: ["Copying a big object can be slow, heavy work. Picture a box stuffed with a thousand photos. Making a copy means photocopying every single photo. But often you do not need TWO boxes at all — you just need the same contents in a new home.", "Moving is the shortcut: instead of photocopying everything, the new box simply TAKES the contents, and the old box is left empty. It is moving house with a van instead of rebuilding every chair and table from scratch at the new address.", "std::move is how you give permission: Box b2 = std::move(b1); says — b1, I am finished with you here, hand your insides over. (std::move itself lives in the <utility> header.) The && symbol you will meet in move functions marks a value that is safe to take from, because nobody needs it afterwards."],
      big: "Moving takes the contents instead of copying them. std::move says: this old value may be emptied — move its insides to the new home.",
      caption: "The moving van beats the photocopier: the contents travel exactly once, and the old box is left empty. Tap Play to move house.",
      demo: ["b1 is stuffed full: 1,000 photos.", "Copying would photocopy all 1,000… slow!", "std::move(b1) gives permission to take.", "The van carries everything to b2 — one trip.", "b2 is full. b1 is empty. Moving wins!"] } },
  { title: "First-Class Functions", chapter: "Book Ch. 18 · First-Class Functions", color: "#31b8c6", scene: 17, line: "auto hit = [](int x) { return x * 2; };", content: LIB[17] },
  { title: "Containers & Algorithms", chapter: "Book Ch. 19 · Containers and Algorithms", color: "#5ea8f7", scene: 8, line: "std::sort(scores.begin(), scores.end());",
    content: { story: ["The Standard Library is a giant toolbox that C++ hands you for free. Its CONTAINERS are ready-made holders: vector is the growing train, map is a wall of labeled drawers — ask for a name tag, get the value inside — and set is a shelf that keeps each different item only once.", "Its ALGORITHMS are ready-made machines that work on those holders. std::sort tidies a whole container into order. std::find hunts for one value. std::count counts how many times something appears. You never build these machines — you just point them at your container.", "begin() and end() are how you show an algorithm the stretch to work on: begin() points at the first box, end() just past the last one. Learn a handful of containers and algorithms, and jobs that sound enormous shrink to one honest line of code."],
      big: "Containers hold things (vector, map, set). Algorithms work on them (sort, find, count). begin() to end() marks the stretch to work on.",
      caption: "A messy train of numbers — point std::sort at it, and everything stands in order. Ready-made tools, one line. Tap Play to tidy the train.",
      demo: ["The train is messy: [30] [10] [20]", "Point sort at the stretch: begin() → end()", "std::sort shuffles… and shuffles…", "The train is tidy: [10] [20] [30]", "find and count ride the same rails. Free tools!"] } }
];

/* ---------- DEEPEN — extra content for every chapter ----------
   Aligned with CHAPTERS by index. more: two extra story pages that
   continue the chapter's story. ex: one extra original code example
   (code) with a line-by-line walkthrough (walk). mistake: one common
   beginner mistake and how to spot it. All wording is original;
   facts and syntax follow cppreference.com, Microsoft Learn and
   Wikipedia (credited in the footer). */
var DEEP = window.CB_T ? CB_T.deep : window.__isDrive ? DRIVE_DEEP : window.__isCS ? CS_DEEP : [
  { more: ["A program is a list of instructions, read top to bottom, one step at a time — like a recipe the computer follows exactly. It never guesses and never skips ahead.", "Every C++ program starts in the same place: a function called main. Think of main as the front door. The computer walks in there first, and whatever main contains is the adventure."],
    ex: { code: 'std::cout << "Ready... ";\nstd::cout << "Set... ";\nstd::cout << "Go!";',
          walk: ["Line 1: the mouth says Ready... and stays on the same row, because nothing asked for a new line.", "Line 2: a second pour of words lands right beside the first: Ready... Set...", "Line 3: one more pour finishes the message. The screen shows: Ready... Set... Go!", "Three separate instructions, one flowing sentence — the computer simply follows them in order."] },
    mistake: "Forgetting the semicolon at the end of a line. The compiler usually complains about the NEXT line instead, which sends beginners hunting in the wrong place. When an error looks strange, check the line just above it for a missing ; first." },
  { more: ["Choosing the right box shape matters. Money wants a double, because prices have dots in them. A single letter wants a char, and it wears single quotes: 'A'. A yes-or-no answer wants a bool, which holds only true or false.", "Boxes can also start empty and wait. You can build a box now and pour something into it later — but until you do, whatever happens to be inside is unknown, so starting values are a kind habit."],
    ex: { code: "double price = 2.5;\nchar grade = 'A';\nbool won = true;",
          walk: ["Line 1: a double box called price, holding 2.5 — a number with a dot is welcome here.", "Line 2: a char box holding ONE letter. Notice the single quotes — char text wears singles, strings wear doubles.", "Line 3: a bool box holding true. Two possible values only: true or false.", "Three box shapes, three kinds of treasure. The type is chosen when the box is built."] },
    mistake: "Pouring a decimal into an int box. int box = 2.5; does not complain — it quietly chops the .5 away and keeps 2. If a calculation loses its fractions, check that at least one box in it is a double." },
  { more: ["C++ does its sums in the same order you learned in math class: times and divide before plus and minus. Parentheses beat everything — wrap a part in ( ) and it is worked out first, whatever the rule says.", "There is one more symbol worth meeting: % finds the REMAINDER of a division. 17 % 5 is 2, because 5s go into 17 three times with 2 left over. Remainders turn out to be perfect for patterns, turns, and wrapping around."],
    ex: { code: "int cookies = 17;\nint each = cookies / 5;\nint left = cookies % 5;",
          walk: ["Line 1: 17 cookies in the jar.", "Line 2: sharing between 5 friends with integer division — each friend gets 3 whole cookies. The fraction is dropped.", "Line 3: % asks what is left over after sharing: 2 cookies remain in the jar.", "Division and remainder are partners: / counts the full shares, % counts what is left."] },
    mistake: "Expecting 7 / 2 to be 3.5. With two ints, the answer is 3 — the fraction is chopped, not rounded. It surprises everyone once. If you need the .5, make one of the numbers a double: 7 / 2.0 gives 3.5." },
  { more: ["After if comes its partner: else, the otherwise door. If the answer is yes, run the first braces; otherwise, run the else braces. Exactly one of the two roads is ever taken.", "Questions can also chain. else if adds more doors in a row, tested from top to bottom. The first one whose answer is yes wins, and the rest are skipped without even being asked."],
    ex: { code: 'if (score >= 50) {\n    std::cout << "You pass!";\n} else {\n    std::cout << "Try again!";\n}',
          walk: ["Line 1: the question — is score at least 50? The >= symbol means greater than OR equal to.", "Line 2: if the answer is yes, this runs and the else part is skipped entirely.", "Line 3: the otherwise door. It has no question of its own — it catches everyone the if turned away.", "Line 4: if the answer was no, this runs instead. One score, one message, never both."] },
    mistake: "Writing = when you meant ==. Inside a question, == asks 'are these equal?' while = puts a value in a box. if (hp = 0) does not ask about hp — it SETS hp to 0. Spot the double equals in every question you write." },
  { more: ["Counting in C++ almost always starts at 0, so a row of 5 boxes is numbered 0, 1, 2, 3, 4 — the last box is [4], not [5]. Programmers say the boxes are zero-based, and nearly every counting bug in history is someone forgetting it.", "A loop can also leave early: the word break jumps straight out of the loop's braces, skipping the remaining laps. It is the emergency exit — handy when you have found what you were hunting for and there is no point searching on."],
    ex: { code: "int steps[3] = {4, 8, 15};\nint total = 0;\nfor (int i = 0; i < 3; i++) {\n    total += steps[i];\n}",
          walk: ["Line 1: a row of three boxes sharing one name, holding 4, 8 and 15.", "Line 2: the collecting box starts empty.", "Line 3: the counting machine will visit i = 0, 1, 2 — one lap per box.", "Line 4: steps[i] means 'the box at position i', so each lap adds the next box into total. At the end, total is 27."] },
    mistake: "Asking for the box one past the end. A row of 3 boxes has positions 0, 1, 2 — steps[3] does not exist, and reading it serves up whatever junk sits there in memory. Count from zero, and stop one BEFORE the size." },
  { more: ["There is a special address that means 'nowhere': nullptr. A pointer holding nullptr is a signpost you have not aimed yet. Following it is a crash, so programs check first: if (p != nullptr) — only follow signposts that point somewhere real.", "A reference, once stuck on a box, can never be re-stuck onto a different one. It is a nickname for life. A pointer can be re-aimed at a new address whenever you like — that freedom is exactly the difference between the two."],
    ex: { code: "int coins = 7;\nint* p = &coins;\n*p += 3;",
          walk: ["Line 1: a box called coins, holding 7.", "Line 2: p becomes the signpost to coins — it holds the address, not the 7.", "Line 3: the * means 'the box at the address on this signpost'. Adding 3 through the signpost changes the real box.", "After these three lines, coins is 10 — changed from far away, through its address."] },
    mistake: "Following a signpost before aiming it. A pointer that has never been given an address points at who-knows-where, and writing through it scribbles on random memory. Always aim first — an address, or nullptr if you are not ready." },
  { more: ["A string knows its own length: hero.size() tells you how many letters it holds, spaces included. Strings can also be compared with == — perfect for checking a typed password or a player's name.", "And just like the array row, you can visit a string's letters one at a time by position: word[0] is the first letter. Text, it turns out, is a row of char boxes wearing a friendly coat."],
    ex: { code: 'std::string name = "Code";\nname += " Block";\nstd::cout << name.size();',
          walk: ["Line 1: a text box holding the word Code.", "Line 2: += works on strings too — it glues more text onto the end. The box now holds Code Block.", "Line 3: size() counts the letters AND the space: 10 characters in total.", "Gluing with += and measuring with size() — two of the friendliest tools a string owns."] },
    mistake: "Reaching for single quotes around a string. 'Code' is not a string — single quotes are for ONE char only, and the compiler will scold you. Text longer than one letter always wears double quotes: \"Code\"." },
  { more: ["Some functions do not hand back an answer at all — they DO something instead: print, move, play a sound. Those are marked void, which means 'no answer comes out of this machine'. Machines that act, rather than calculate.", "The inputs a function receives are fresh copies of what you sent — photocopies, not the originals — unless the parameter wears the & nickname mark you met in the Pointer chapter. That is why heal needed its &: healing had to touch the real hero."],
    ex: { code: 'void cheer(std::string who) {\n    std::cout << "Go, " << who << "!";\n}',
          walk: ["Line 1: void promises no answer comes back. The machine takes one input: a string called who.", "Line 2: the machine's one job — pour Go, then the name, then an exclamation onto the screen.", "Line 3: the closing brace ends the machine's blueprint.", "Calling cheer(\"V\") prints Go, V! Building the machine is not enough — somebody still has to call it."] },
    mistake: "Building the machine but never switching it on. Defining a function only teaches C++ the recipe; nothing happens until a line somewhere CALLS it by name, like cheer(\"V\");. If your function 'does nothing', look for the missing call." },
  { more: ["When you use a template with a real type, the compiler quietly stamps out a fresh, ordinary version of the function for that type — a process called instantiation. You wrote one recipe; the compiler cooks as many versions as your program actually orders, and no more.", "The trick only works while the type can do everything the recipe asks. twice uses +, so T must support +. Hand it a type with no +, and the error appears at stamping time — the recipe itself was fine."],
    ex: { code: "template <typename T>\nT bigger(T a, T b) {\n    return (a > b) ? a : b;\n}",
          walk: ["Line 1: the blank-type announcement — T is whatever the caller pours in.", "Line 2: the machine takes two of the SAME type T and promises one T back.", "Line 3: the one-line choice from the Ternary idea: if a beats b, hand back a, otherwise b.", "bigger(3, 9) stamps an int version and answers 9. bigger(2.5, 1.5) stamps a double version and answers 2.5."] },
    mistake: "Mixing types in one call, like bigger(3, 2.5). T can only be ONE type at a time, and the compiler cannot guess whether you meant int or double. Make both inputs the same type and the stamp works." },
  { more: ["Why split a program into files at all? So every file agrees on the shapes of things. The header is the promise everyone shares: this class looks like THIS, this function takes THAT. Break the promise in one file and the others would be working from different maps.", "Each .cpp file is translated separately into its own object file, and then a tool called the linker stitches them all together and checks that every promise made in a header is kept by real code somewhere. Two stages: compile the pieces, then link the whole."],
    ex: { code: "// Block.h\n#pragma once\nclass Block {\npublic:\n    int size;\n};",
          walk: ["Line 1: a comment naming the file — comments are notes for humans; the compiler skips them.", "Line 2: #pragma once guards the door: paste this header only once per program, however many files ask.", "Lines 3–6: the promise itself — the shape of Block that every file will share.", "Any .cpp that writes #include \"Block.h\" receives this exact promise, pasted in by the preprocessor."] },
    mistake: "Putting #pragma once in the .cpp file instead of the header. The guard protects the HEADER from being pasted twice — it belongs at the top of the .h file. A cousin of this mistake: writing #include \"Block.cpp\", which pastes working code where only promises should go." },
  { more: ["Once a blueprint exists, building a real box from it is one short line: Block gem; — and reaching inside uses the dot: gem.size = 5;. The dot means 'inside this box, the part called'.", "Classes can also hide their insides with the word private:. Public parts are the handles everyone may use; private parts are the machinery only the class itself may touch. Most real classes are a handle on the outside and secrets on the inside."],
    ex: { code: "Block gem;\ngem.size = 5;\nstd::cout << gem.size;",
          walk: ["Line 1: a real Block is built from the blueprint and named gem. Its size is unknown until set.", "Line 2: the dot reaches inside gem and puts 5 in its size part.", "Line 3: the dot reaches in again, this time to read — the screen shows 5.", "Blueprint, build, dot, done: the daily rhythm of working with your own types."] },
    mistake: "Forgetting the semicolon after the class's closing brace. class Block { ... }; — that last ; is part of the blueprint's shape, and without it the compiler reports the error lines later, inside innocent code. When a class error looks haunted, count the braces and hunt for the missing ;." },
  { more: ["You can only teach symbols that already exist — +, ==, <<, ++ and friends. C++ will not let you invent a brand-new symbol like ** for your class, which keeps everyone's code speaking the same alphabet.", "Kindness rule: a taught symbol should MEAN what readers expect. If your + joins two things, readers smile. If your + secretly subtracts, every future reader of the code — including future you — pays for the surprise."],
    ex: { code: "bool operator==(const Block& other) const {\n    return size == other.size;\n}",
          walk: ["Line 1: teach the == symbol. It receives the other Block as a nickname (const& — read it, never change it) and promises a bool answer.", "Line 2: two Blocks count as equal when their sizes match — the rule YOU chose for your type.", "After this lesson, blockA == blockB works in any if question, exactly like comparing numbers.", "The final const promises the check itself changes nothing. Manners matter, even for operators."] },
    mistake: "Teaching an operator a sneaky meaning — a + that multiplies, or an == that also changes the boxes being compared. Overloaded operators are read at a glance, so a dishonest meaning hides bugs in plain sight. Keep the symbol's promise." },
  { more: ["A child class may also REPLACE a piece of the parent: give FireBlock its own version of a function the parent already has, and FireBlocks use the new version while plain Blocks keep the original. Same toolbox, upgraded tool.", "Between public and private sits a third door: protected:. Protected parts are family secrets — the class and its children may use them, but the rest of the program may not. Inheritance is the one key that opens that door."],
    ex: { code: "class IceBlock : public Block {\npublic:\n    bool slippery = true;\n};",
          walk: ["Line 1: a new blueprint, IceBlock, starting from everything Block already has — size included, free of charge.", "Lines 2–3: the child's own addition — every IceBlock is slippery, and it starts out true.", "Line 4: closing brace and the blueprint's semicolon, as always.", "An IceBlock can do everything a Block can, plus slide. That is inheritance earning its keep."] },
    mistake: "Copy-pasting the parent's code into the child instead of inheriting. Now every fix must be made in two places, and the day you fix one and forget the other, the twins disagree. Inherit, and the parent stays the single source of truth." },
  { more: ["For the many-voices trick to work, the program must hold the animals through the PARENT's signposts — pointers or references to Animal. C++ then looks at what is really standing there at run time and calls that child's version. Hold the child directly in a parent-shaped box and the extra parts are sliced away.", "A family with virtual functions usually adds one more line to the parent: a virtual destructor, ~Animal(). It makes sure that when a child is tidied away through a parent signpost, the child's own tidy-up runs too. One quiet line that keeps the whole family clean."],
    ex: { code: "Animal* pet = new Dog();\npet->speak();",
          walk: ["Line 1: build a Dog, but keep it on an Animal signpost — the pointer's shape is the parent, the creature is the child.", "Line 2: the arrow -> calls speak() through the signpost.", "C++ checks who is really there — a Dog — and runs the DOG's version. Woof!, not the parent's silence.", "One signpost type, any animal, each answering in its own voice: that is the trick from the story, in two lines."] },
    mistake: "Forgetting the word virtual in the parent. Without it, speak() through an Animal signpost runs the PARENT's version every time, whatever is really standing there — no error, no warning worth the name, just the wrong voice. When every animal sounds the same, check for the missing virtual." },
  { more: ["An error thrown inside try SKIPS whatever comes after it in the braces. The jump to catch is instant — lines below the risky one do not run at all. That is why risky lines sit at the end of a try, or alone in one.", "catch can also name what it caught. catch (const std::exception& e) receives the error itself, and e.what() reads its message aloud — far better than a silent net when you are trying to learn what went wrong."],
    ex: { code: 'try {\n    openTreasure();\n} catch (...) {\n    std::cout << "The chest would not open!";\n}',
          walk: ["Line 1: the risky ground begins — everything in these braces is watched.", "Line 2: the risky act itself. If it throws, the jump happens HERE, mid-line almost.", "Line 3: the net, ready for anything at all — that is what the ... promises.", "Line 4: instead of a crash, a friendly message. The player learns something went wrong, and the program lives on."] },
    mistake: "Catching everything and saying nothing — an empty catch { } that swallows the error whole. The program survives, but it also hides its own clues, and the real problem becomes invisible. Catch, yes — but always leave a message, even just for yourself." },
  { more: ["The compiler only stamps the versions you actually ask for. Write a class template and use Box<int> alone, and only the int version is ever built — the string version costs nothing until the day you order it.", "Template code usually lives in the HEADER file, not a .cpp. The compiler needs to see the whole blueprint at the moment it stamps a version, and headers are the files everyone can see. That is why the Standard Library's templates arrive as headers."],
    ex: { code: "Box<int> small;\nsmall.value = 42;\nBox<std::string> label;\nlabel.value = \"Hi\";",
          walk: ["Line 1: order a box for whole numbers from the one blueprint — stamped: Box<int>.", "Line 2: its value part is a real int, so 42 fits exactly.", "Line 3: order a second box, this time for text — stamped from the SAME blueprint.", "Line 4: its value part is a real string, so \"Hi\" fits. Two box types, one mold, zero copied code."] },
    mistake: "Asking a stamped box to do something its type cannot. Box<int> is happy to add values; Box<Block> only works if Block itself supports the operations the blueprint uses. The error arrives at stamping time and points into the template — read the last line of it first, where the real problem usually sits." },
  { more: ["Rule of thumb: copy when you need TWO living copies, move when the old one is finished anyway. Handing a finished drawing to a friend? Copy it and keep yours. Moving house? The van, not the photocopier.", "After a move, treat the old box as emptied. Its contents went to live somewhere new; reaching into the old address expecting the treasure still to be there is how strange bugs are born."],
    ex: { code: 'std::string draft = "A very long story...";\nstd::string final = std::move(draft);',
          walk: ["Line 1: draft holds the whole story — imagine a real draft of thousands of words.", "Line 2: std::move gives permission to TAKE the insides. The letters travel to final in one trip, however long the story is.", "No photocopying happened. draft is left empty, its job done.", "final now holds every word. Moving long strings and big vectors is where this trick shines brightest."] },
    mistake: "Using the old variable after std::move, expecting its contents to still be there. The move was a promise: take everything. Reading the emptied box afterwards gives you an empty, husk value — and code that looks haunted. Once moved from, only rebuild it or leave it alone." },
  { more: ["Functions are first-class citizens in C++: they can ride inside variables, be handed to other functions as inputs, and be built on the spot as lambdas. std::function is the all-purpose carrying box — almost anything callable fits inside it.", "A lambda can also peek at the variables around it. Writing [&] inside the square brackets captures the neighbourhood by nickname, so the lambda can use — and even change — the boxes that were nearby when it was folded."],
    ex: { code: "int bonus = 5;\nauto add = [&](int x) { return x + bonus; };\nadd(10);",
          walk: ["Line 1: a nearby box, holding 5.", "Line 2: the lambda is folded with [&] — it captures bonus by nickname, so it can see the REAL box, not a copy.", "The machine adds bonus to whatever it is fed. add(10) answers 15.", "Change bonus to 100 later and the SAME lambda answers 110 — it was never holding a photocopy."] },
    mistake: "Letting a capturing lambda outlive the box it captured. If bonus is destroyed and the lambda runs afterwards, its nickname points at a box that no longer exists. Keep capturing lambdas close to home, while their neighbourhood is still alive." },
  { more: ["Two more tools earn their keep fast. A map is the wall of labeled drawers: scores[\"V\"] reaches straight for the value filed under the name V. And std::find hunts a container for one value, reporting where it stopped — or end(), the 'not here' signal.", "The machines live in a header called <algorithm>, and the containers in theirs — <vector>, <map>, <set>. One #include per toolbox, and the whole shelf is yours. Professionals lean on these daily; they are not beginner toys, they are the real kit."],
    ex: { code: "std::sort(nums.begin(), nums.end());\nint sevens = std::count(nums.begin(), nums.end(), 7);",
          walk: ["Line 1: sort the whole stretch, from the first box to just past the last. nums must be a container like a vector, and <algorithm> must be included.", "Line 2: count walks the same stretch and tallies how many boxes hold exactly 7.", "Same begin-and-end handshake for both machines — learn it once, use it everywhere.", "Two one-liners that would each take a hand-written loop of a dozen lines. The toolbox pays rent."] },
    mistake: "Calling std::sort without #include <algorithm>. The compiler has never heard of the machine, and the error reads like a riddle about namespaces. When a library tool is 'not found', the missing #include is the first suspect — every toolbox must be fetched before it is used." }
];

/* ---------- NEW SHELVES — Beyond the Book ----------
   Six reference shelves that reach past the book's 19 chapters.
   Same shape as CHAPTERS/DEEP, so the same reader, Text/Picture
   modes and stage music serve them untouched. All prose original;
   facts and syntax follow cppreference.com, Microsoft Learn and
   Wikipedia (credited in the footer). */
var SHELFBOOKS = window.CB_T ? CB_T.shelves : window.__isDrive ? DRIVE_SHELVES : window.__isCS ? CS_SHELVES : [
  { title: "Standard Library Field Guide", chapter: "Beyond the Book shelf", num: "S1", color: "#2563eb", scene: 23,
    line: ["#include <vector>", "#include <map>", "#include <algorithm>"],
    content: { story: ["Imagine moving into a workshop where every tool you will ever need is already hanging on the wall, sharpened and free. That is the Standard Library: a giant collection of ready-made C++ machinery that comes with the language itself. You never build it. You just fetch the shelf you need.", "The shelves hold two families of treasure. CONTAINERS hold your things: vector, the growing train from Chapter 5; map, a wall of labeled drawers where each drawer has a name; set, a shelf that keeps every different item exactly once; and string, the text box from Chapter 7. ALGORITHMS do the work: std::sort tidies, std::find hunts, std::count tallies, and std::reverse flips a stretch back to front.", "Each shelf stands behind one #include — the fetch instruction from Chapter 10. #include <map> wheels the drawer wall into your program. #include <algorithm> brings the machines. Professionals reach for these shelves every single day: they are not training wheels, they are the real professional kit."],
      big: "The Standard Library is free, ready-made machinery: containers hold things, algorithms work on them, and one #include fetches each shelf.",
      caption: "The workshop wall: labeled drawers, a growing train, and machines that sort, find, and count — all free, all fetched with #include. Tap Play for the tour.",
      demo: ["Welcome to the workshop. Every shelf is free.", "#include <vector> — the growing train rolls in.", "#include <map> — a wall of labeled drawers appears.", "#include <algorithm> — sort, find and count wake up.", "Pick a shelf, fetch it, use it. That is the whole trick."] } },
  { title: "Words of C++ — The Glossary", chapter: "Beyond the Book shelf", num: "S2", color: "#1d4ed8", scene: 24,
    line: "int score = 0;   // a variable: a named box",
    content: { story: ["Every craft has its own words, and coding is no different. This shelf is a friendly dictionary: the words programmers say every day, translated into plain speech. Keep it beside you — soon these words will feel like old friends.", "The everyday five: SYNTAX means the spelling rules of the language — where the semicolons and braces must go. A BUG is a mistake hiding in your instructions. COMPILING is the computer translating your code into its own machine language before it can run. DEBUGGING is the detective work of finding and fixing bugs. And a PROGRAM is simply the full set of instructions you hand the computer.", "The building words: a VARIABLE is a named box that holds a value. A FUNCTION is a named machine that does one job. A LOOP is any structure that repeats. A CLASS is a blueprint for a new kind of box, and an OBJECT is one real box built from that blueprint. A HEADER is the promise file other files share, and a LIBRARY is a whole collection of ready-made tools — like the Standard Library on Shelf 1."],
      big: "The craft's words, decoded: syntax is spelling rules, a bug is a mistake in the instructions, compiling is translating, and debugging is the detective work that fixes it.",
      caption: "Word tiles drifting out of the big dictionary. Tap Play and meet the words one by one.",
      demo: ["syntax — the spelling rules of C++.", "bug — a mistake hiding in the instructions.", "compile — translate code into machine language.", "debug — hunt the bug down and fix it.", "object — one real box, built from a class blueprint.", "Say the words in plain speech, and the code makes sense."] } },
  { title: "Cheat Sheets — Cards to Keep", chapter: "Beyond the Book shelf", num: "S3", color: "#0284c7", scene: 25,
    line: "for (int n : nums) { total += n; }",
    content: { story: ["A cheat sheet is not cheating — it is a memory anchor. Pilots run checklists they know by heart, and programmers keep the shapes they reach for every day pinned where their eyes can find them. This shelf holds the four cards worth pinning first.", "Card one, SKELETONS: the empty program (the include, main, and return), the empty function, the empty class. Card two, LOOPS: the counting for, the questioning while, and the range-for that walks a whole container without counting at all — for (int n : nums) visits every item in nums, one after another. Card three, OPERATORS: += adds on, ++ steps up by one, == asks equal, && means both must be true, || means either will do, and ! flips true to false.", "Card four, SYMBOLS: ; ends the instruction, { } fences a group, ( ) carries inputs and questions, [ ] reaches into a row by number, & asks for an address or sticks on a nickname, and * follows a signpost to the real box. Six little shapes that appear in nearly every line you will ever write."],
      big: "Four cards: skeletons, loops, operators, symbols. Pin them up and glance while you work — and let the Sandbox drills slowly make the glances unnecessary.",
      caption: "Four cards on the board: skeletons, loops, operators, symbols. Tap Play to pin them up one by one.",
      demo: ["Card 1 pinned: skeletons — program, function, class.", "Card 2 pinned: loops — for, while, range-for.", "Card 3 pinned: operators — +=, ++, ==, &&, ||, !", "Card 4 pinned: symbols — ; { } ( ) [ ] & *", "Four cards. Most of daily C++, at a glance."] } },
  { title: "The Bug Hunter's Handbook", chapter: "Beyond the Book shelf", num: "S4", color: "#0369a1", scene: 26,
    line: 'std::cout << "hp is " << hp;  // the spy line',
    content: { story: ["Every programmer who ever lived has written bugs — the only difference between a beginner and a professional is how calmly they hunt. This shelf teaches the hunt: what a bug is, where it hides, and the detective method that always works.", "First, know your three usual suspects. The MISSING SEMICOLON: the compiler complains about the line AFTER the real mistake, because that is where it finally tripped. The SINGLE EQUALS: writing = (fill the box) where == (ask if equal) belonged, so the question quietly becomes an instruction. And the OFF-BY-ONE: counting from 1 in a world that counts from 0, visiting one box too few — or one too many, past the end of the row.", "The detective method is always the same. Read the FIRST error message and ignore the rest — later errors are usually echoes of the first. Find the line it names, then look one line UP. Change ONE thing. Run again. One change at a time means every new message tells you exactly what your change did."],
      big: "Read the first error first, look one line up, change one thing, run again. Calm, one clue at a time — that is the whole detective method.",
      caption: "A magnifying glass over the usual suspects: the missing semicolon, the single equals, the off-by-one. Tap Play to start the hunt.",
      demo: ["A bug is reported. Stay calm — this is the job.", "Suspect 1: the missing ; — check the line ABOVE the error.", "Suspect 2: = where == belonged.", "Suspect 3: off-by-one — did you count from 0?", "One change. Run again. Case closed."] } },
  { title: "The Pattern Workshop", chapter: "Members only · Beyond the Book shelf", num: "S5", color: "#1e40af", scene: 23, member: true,
    line: "Guard door;  // only one guard ever stands here",
    content: { story: ["Some problems in programming come back so often that programmers have given their best solutions names — like well-loved recipes in a workshop notebook. Those named recipes are called DESIGN PATTERNS, and this members-only shelf opens the workshop where the most useful ones live.", "Meet four friendly patterns. The FACTORY is a making-machine: instead of building objects by hand everywhere, you ask one machine to build them for you, so there is exactly one place to fix. The OBSERVER is a town crier: when something changes, it shouts, and everyone who signed up to listen hears about it — game menus updating when health changes work exactly like this. The STRATEGY is a swappable tool: one job (like how an enemy moves) with several tools you can swap in and out. And the SINGLETON is the one-and-only: a single guard at a single door, so the whole program shares one scorekeeper, one music player, one save file.", "Patterns are not rules and they are not magic. They are names for shapes of teamwork between pieces of code. Learn the names, and you can talk about whole designs in one word — and recognize the shapes when they appear in real programs."], 
      big: "Design patterns are named, reusable shapes for solving problems that return again and again: Factory builds, Observer announces, Strategy swaps, Singleton shares the one and only.",
      caption: "The pattern workshop: a making-machine, a town crier, a swappable tool, and the one-and-only guard. Members only. Tap Play for the tour.",
      demo: ["Welcome to the Pattern Workshop, member.", "FACTORY — one machine builds all the blocks.", "OBSERVER — the crier shouts: health changed!", "STRATEGY — swap the tool, keep the job.", "SINGLETON — one guard, one door, one scorekeeper.", "Four names. Four shapes you will meet everywhere."] } },
  { title: "The C++ Time Machine", chapter: "Members only · Beyond the Book shelf", num: "S6", color: "#075985", scene: 24, member: true,
    line: "// 1985 → today: one language, always growing",
    content: { story: ["Every language has a birthday, and C++'s story starts in 1979, when Bjarne Stroustrup wanted the speed of the language C with the blueprints (classes) of another language called Simula. By 1985 the first edition of his book The C++ Programming Language was published, and the name stuck — C++ means “C, stepped up by one”, which is the ++ you already know from loops, hiding in the language's own name.", "The language keeps growing in editions, like a game with expansion packs. C++98 was the first world standard — the whole world agreed on the rules. C++11 was the giant leap: auto, lambdas, range-for loops, smart pointers and std::move all arrived in one edition, and programmers call everything from here on 'modern C++'. C++14 polished, C++17 (the edition your book teaches) added tidy gifts like structured bindings and std::optional, C++20 brought concepts and modules, and C++23 keeps smoothing the edges.", "Why does the history matter? Because old code never dies — programs written in 1998 still run factories and games today. Knowing which edition a feature came from tells you whether the code in front of you can use it, and why your book says C++17 on the cover: it is the edition it promises to teach."], 
      big: "C++ began in 1979, standardized in 1998, leapt forward with C++11's modern tools, and keeps growing edition by edition — your book teaches C++17.",
      caption: "The time machine's dial: 1979, 1985, 1998, 2011, 2017, 2020… one language, always growing. Members only. Tap Play to travel.",
      demo: ["1979 — Stroustrup starts C with classes.", "1985 — the first C++ book appears.", "1998 — the first world standard: C++98.", "2011 — the giant leap: auto, lambdas, smart pointers.", "2017 — your book's edition: C++17.", "2020 and beyond — the language keeps growing."] } }
];
var SHELFDEEP = window.CB_T ? CB_T.shelfDeep : window.__isDrive ? DRIVE_SHELFDEEP : window.__isCS ? CS_SHELFDEEP : [
  { more: ["Between the containers and the machines stand the ITERATORS — little bookmarks that point at one spot inside a container. begin() hands you a bookmark at the first item; end() is a bookmark just past the last. Algorithms travel from bookmark to bookmark, which is why the same std::sort works on a vector, an array, and half a dozen other holders.", "There is also a humble hero on the utility shelf: std::pair, a box with exactly two compartments — perfect for carrying two things that belong together, like a name and its score. You met its cousin std::move back in Chapter 17; the same <utility> shelf holds both."],
    ex: { code: 'std::map<std::string, int> scores;\nscores["V"] = 10;\nscores["V"] += 5;\nstd::cout << scores["V"];',
          walk: ["Line 1: fetch the drawer wall. Each drawer is found by a string name tag and holds an int. The whole wall is called scores.", "Line 2: open the drawer labeled V — it is built on the spot if it was not there — and put 10 inside.", "Line 3: the same drawer, found by the same name: add 5 onto what is already inside. The drawer now holds 15.", "Line 4: ask for the drawer by name and print what falls out: 15. No searching through a list — the name tag IS the address."] },
    mistake: "Reaching for a shelf you never fetched. Using std::map without #include <map> makes the compiler answer as if it has never heard of a map — because in your program, it has not. When a library name is 'not declared', the missing #include is the first suspect, every time." },
  { more: ["Three more from the deep end: a POINTER is a signpost holding an address. A REFERENCE is a nickname for the very same box. A TEMPLATE is a fill-in-the-blank recipe where the type is the blank. And one extra for free — an ALGORITHM is any step-by-step method for getting a job done; std::sort is one you already know.", "Notice the pattern: every scary word is a friendly idea wearing a long coat. When a new word appears in a chapter, say its plain-words meaning out loud once, and the coat comes off for good."],
    ex: { code: "// syntax: the spelling rules of C++\nint score = 0;    // variable: a named box\nscore += 1;       // add onto what is there\nif (score == 1) { // a question, asked with ==\n    score = 2;    // a statement inside a block\n}                 // the block closes",
          walk: ["Line 1: a comment — a note for humans. The compiler skips everything after //, so comments are the safest place to think in plain words.", "Line 2: a variable is born, and the comment beside it uses the glossary on purpose. Reading code aloud in plain words is a real skill, not a beginner crutch.", "Line 3: the box grows by one — the += shortcut from Chapter 3.", "Line 4: a question — and notice == doing glossary duty. Two equals signs ask; one equals sign would have filled the box instead."] },
    mistake: "Blaming the computer for a bug. The computer follows instructions exactly — a bug means the instructions themselves said the wrong thing. That is good news, not bad: instructions can be read, found, and fixed. The machine is never being stubborn; it is being literal." },
  { more: ["How to use a cheat sheet well: keep it open BESIDE your work, not instead of it. Type the line yourself every time — glancing is allowed, but copying without looking is where the learning leaks away. The Sandbox drills exist to move these shapes from the card into your fingers.", "And make the cards yours. The day a shape stops needing a glance, it has moved into your hands. The cheat sheets of professionals shrink over the years — not because they memorize harder, but because repetition quietly does the memorizing for them."],
    ex: { code: "#include <iostream>\nint main() {\n    // your code lives here\n    return 0;\n}",
          walk: ["Line 1: fetch the talking-and-listening tools — the include nearly every program starts from.", "Line 2: main, the front door. Every program walks in here first, and the brace opens the room.", "Line 3: the one comment that matters — this gap, between the braces, is where everything you write will live.", "Line 4: hand 0 back to the computer — the traditional signal that the program finished happily — and the closing brace shuts the room."] },
    mistake: "Copying a cheat-sheet shape with a piece missing — the loop without its braces, the class without its final semicolon. Skeletons only work whole. When borrowed code breaks, lay it beside the card and compare piece by piece; the missing piece is almost always small and quiet." },
  { more: ["The oldest debugging tool in the world is already in your hands: std::cout. Sprinkle print lines through a sick program — hp is 3, now hp is 2 — and watch the values march. The line where the marching values stop matching your story is the line where the bug lives.", "And when a bug will not confess, explain the code out loud, line by line, in plain words — to a friend, a pet, or a rubber duck on the desk. Programmers swear by it: the sentence you cannot finish saying out loud is almost always the sentence with the bug in it."],
    ex: { code: 'int hp = 3;\nstd::cout << "hp is " << hp;\nhp--;\nstd::cout << " now " << hp;',
          walk: ["Line 1: the hero starts with 3 health.", "Line 2: a spy line — it prints the value so your eyes can check it against your story: hp is 3.", "Line 3: one point of damage lands.", "Line 4: the second spy reports: now 2. If any spy line ever disagrees with your story, the bug lives between that line and the last honest one."] },
    mistake: "Changing five things at once when a bug appears. If the program then works, you never learn which change fixed it — and if it breaks worse, you cannot tell which change did the damage. One change, one run, one clue. Detectives do not dust the whole room for fingerprints at once." },
  { more: ["A pattern earns its keep the second time you solve the same problem — the first time, plain code is usually clearest. Reaching for a pattern too early is its own kind of bug: three machines where one function would do. Professionals ask 'have I seen this problem before?' before they ask 'which pattern fits?'", "The Observer deserves a second look, because you have already met it: this very site's buttons are observers. A button WAITS, and when the click happens it announces it to exactly the code that signed up to listen. Interfaces, menus, and game events all run on the town crier."],
    ex: { code: "class ScoreKeeper {\npublic:\n    static ScoreKeeper& theOne() {\n        static ScoreKeeper keeper;\n        return keeper;\n    }\n    int score = 0;\n};",
          walk: ["Lines 1–2: a class for the scorekeeper, opened to the public.", "Line 3: a static function — it belongs to the blueprint itself, not to any one box built from it.", "Line 4: the static keeper inside is built exactly once, the first time anyone asks, and never again.", "Line 5: every caller receives the SAME keeper by nickname — one score for the whole program.", "Line 7: the shared treasure itself. ScoreKeeper::theOne().score += 10; adds to the one true score from anywhere."] },
    mistake: "Building a Singleton for everything. One-and-only is a strong promise: it makes pieces of the program secretly depend on each other, and testing gets hard. Keep singletons rare and precious — scorekeepers, music players, save files — and let everything else be ordinary boxes." },
  { more: ["Editions arrive roughly every three years now, and each compiler (the translators from Chapter 19) adopts them at its own pace — which is why code can be legal C++20 and still fail on an older setup. When mystery code refuses to compile, 'which edition is this compiler speaking?' is a detective question worthy of Shelf S4.", "One more beloved fossil: the name Bjarne Stroustrup himself has said he wished someone had invented a prettier name — but C++ is also a promise baked into the name. The language promises C's speed, stepped up. Every edition since has kept that promise while adding safety rails C never had."],
    ex: { code: "// The same idea, two editions apart:\n// C++98 way:\nstd::vector<int> nums;\nfor (int i = 0; i < (int)nums.size(); i++) { }\n// C++17 way:\nfor (int n : nums) { }",
          walk: ["Line 2: the old way needed the vector's name, and line 3 counted by hand, index by index, with a cast to keep the compiler calm.", "Line 5: the modern way — the range-for from your Range-For Block — visits every item with no counting at all.", "Both lines are real, legal C++. The language did not replace the old road; it built a smoother one beside it.", "That is why old programs still compile: C++ almost never removes a road, it only adds better ones."] },
    mistake: "Assuming newer is automatically available. A feature's birthday matters: lambdas need C++11, std::optional needs C++17, concepts need C++20. If a borrowed example will not compile, check the edition it was written for before hunting for a typo — the code may be perfect, just younger than your compiler." }
];

/* ---------- Picture scenes (animated SVG per chapter) ---------- */
/* Loop 64 — scenes shared across tracks speak the track's own
   words: Drive chapters never show code text (no "class Block",
   "catch (...)", "case 1", or debugger slogans), C# chapters
   never show C++-only spellings (no "public:" label, doors are
   the enum's own choices), matching the __isCS variants scenes
   22/23 already carried. */
function charFace(x, y, s, skin, shirt) {
  return '<g class="anim-bob"><circle cx="' + x + '" cy="' + y + '" r="' + (16 * s) + '" fill="' + skin + '"/>' +
    '<rect x="' + (x - 15 * s) + '" y="' + (y + 13 * s) + '" width="' + (30 * s) + '" height="' + (24 * s) + '" rx="' + (8 * s) + '" fill="' + shirt + '"/>' +
    '<circle cx="' + (x - 6 * s) + '" cy="' + (y - 2 * s) + '" r="' + (2.2 * s) + '" fill="#12283f"/>' +
    '<circle cx="' + (x + 6 * s) + '" cy="' + (y - 2 * s) + '" r="' + (2.2 * s) + '" fill="#12283f"/>' +
    '<path d="M ' + (x - 5 * s) + ' ' + (y + 5 * s) + ' Q ' + x + ' ' + (y + 10 * s) + ' ' + (x + 5 * s) + ' ' + (y + 5 * s) + '" stroke="#12283f" stroke-width="' + (2 * s) + '" fill="none" stroke-linecap="round"/></g>';
}
function sceneSVG(i) {
  var head = '<svg class="stage-svg" viewBox="0 0 400 250" role="img" aria-label="Animated picture for this chapter">';
  var ground = '<rect x="0" y="212" width="400" height="38" fill="#2f7fe0"/><ellipse cx="70" cy="222" rx="34" ry="7" fill="#2563eb"/><ellipse cx="330" cy="228" rx="42" ry="8" fill="#2563eb"/>';
  var sun = '<circle cx="356" cy="38" r="20" fill="#7cc4ff" class="anim-pulse"/><circle cx="52" cy="42" r="13" fill="#ffffff" opacity="0.85"/><circle cx="72" cy="42" r="10" fill="#ffffff" opacity="0.85"/>';
  var s = "";
  switch (i) {
    case 0: s = '<g class="anim-bob"><rect x="150" y="70" width="110" height="86" rx="12" fill="#3c4a63"/><rect x="162" y="82" width="86" height="56" rx="7" fill="#aee7ff"/><circle cx="188" cy="106" r="5" fill="#12283f"/><circle cx="222" cy="106" r="5" fill="#12283f"/><path d="M190 124 Q205 133 220 124" stroke="#12283f" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="192" y="156" width="26" height="14" fill="#3c4a63"/></g>' +
      '<g class="anim-pulse"><path d="M272 60 q52 -22 62 10 q10 28 -22 36 l6 20 l-26 -14 q-34 2 -40 -22 q-5 -22 20 -30z" fill="#ffffff" stroke="#38bdf8" stroke-width="3"/><text x="292" y="92" font-family="Sora,sans-serif" font-weight="800" font-size="19" fill="#1d4ed8">Hello!</text></g>' + charFace(88, 120, 1, "#f2c297", "#53b1fd"); break;
    case 1: s = '<g class="anim-bob"><rect x="130" y="92" width="140" height="104" rx="12" fill="#38bdf8"/><rect x="130" y="92" width="140" height="30" rx="12" fill="#2f7fe0"/><text x="200" y="113" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="17" fill="#eaf4ff">score</text><text x="200" y="172" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="46" fill="#eaf4ff">0</text></g>' +
      '<circle cx="96" cy="180" r="13" fill="#7cc4ff" stroke="#2f7fe0" stroke-width="3" class="anim-twinkle"/><circle cx="312" cy="176" r="13" fill="#7cc4ff" stroke="#2f7fe0" stroke-width="3" class="anim-twinkle"/>' + charFace(70, 108, 0.9, "#8d5a3a", "#22d3ee"); break;
    case 2: s = '<rect x="36" y="128" width="150" height="66" rx="10" fill="#3c4a63"/>' + [0,1,2,3].map(function(k){ return '<rect x="'+(50+k*34)+'" y="142" width="26" height="16" rx="4" fill="#aee7ff"/>'; }).join("") + [0,1,2].map(function(k){ return '<rect x="'+(62+k*34)+'" y="164" width="26" height="16" rx="4" fill="#aee7ff"/>'; }).join("") +
      '<path d="M196 148 H268" stroke="#3ec6dd" stroke-width="6" stroke-linecap="round" class="anim-flow" fill="none"/><path d="M262 136 l18 12 l-18 12z" fill="#3ec6dd"/>' +
      '<g class="anim-bob"><rect x="286" y="106" width="86" height="76" rx="10" fill="#22d3ee"/><text x="329" y="140" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#eaf4ff">name</text><text x="329" y="168" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="24" fill="#eaf4ff">V</text></g>'; break;
    case 3: s = '<g class="anim-bob"><ellipse cx="200" cy="150" rx="86" ry="62" fill="#4fb3ff"/><circle cx="164" cy="118" r="9" fill="#38bdf8"/><circle cx="238" cy="118" r="9" fill="#38bdf8"/><path d="M168 148 q10 8 20 0 M214 148 q10 8 20 0" stroke="#1e3a8a" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="188" y="84" width="24" height="12" rx="5" fill="#1e3a8a"/></g>' +
      '<circle cx="200" cy="52" r="15" fill="#7cc4ff" stroke="#2f7fe0" stroke-width="3" class="anim-bob"/><text x="200" y="58" text-anchor="middle" font-weight="800" font-size="15" fill="#1e40af">+3</text>' +
      '<text x="316" y="140" font-family="JetBrains Mono,monospace" font-weight="700" font-size="17" fill="#46688f">total</text><text x="316" y="168" font-family="JetBrains Mono,monospace" font-weight="700" font-size="26" fill="#0369a1">10</text>'; break;
    case 4: s = '<path d="M200 214 V146" stroke="#3d5a80" stroke-width="12" stroke-linecap="round"/><path d="M200 146 L112 88" stroke="#3d5a80" stroke-width="12" stroke-linecap="round"/><path d="M200 146 L292 88" stroke="#3d5a80" stroke-width="12" stroke-linecap="round"/>' +
      '<g class="anim-sway"><rect x="236" y="34" width="118" height="42" rx="9" fill="#f4faff" stroke="#1e40af" stroke-width="3"/><text x="295" y="61" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="15" fill="#1e40af">' + (window.__isDrive ? "too fast?" : "if hp &lt;= 0") + '</text></g>' +
      '<path d="M88 66 c-8 -12 -30 -4 -30 10 c0 12 16 20 30 30 c14 -10 30 -18 30 -30 c0 -14 -22 -22 -30 -10z" fill="#38a3f8" class="anim-pulse"/>' +
      '<text x="112" y="196" font-family="Sora,sans-serif" font-weight="700" font-size="14" fill="#46688f">' + (window.__isDrive ? "drive on" : "play on") + '</text><text x="262" y="196" font-family="Sora,sans-serif" font-weight="700" font-size="14" fill="#1e40af">' + (window.__isDrive ? "pulled over" : "game over") + '</text>'; break;
    case 5: s = [0,1,2].map(function(k){ var x=66+k*100; var open=k===0; return '<g class="anim-bob" style="animation-delay:'+(k*0.4)+'s"><rect x="'+x+'" y="76" width="76" height="122" rx="9" fill="'+(open?"#4a90d9":"#8fa3b8")+'"/><circle cx="'+(x+58)+'" cy="138" r="5" fill="#eaf4ff"/><text x="'+(x+38)+'" y="66" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="15" fill="#46688f">' + (window.__isDrive ? ["STOP","YIELD","WARN"][k] : window.__isCS ? ["Red","Green","Blue"][k] : 'case '+(k+1)) + '</text>'+(open?'<path d="M '+(x+16)+' 108 l10 12 l20 -26" stroke="#7cc4ff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>':'')+'</g>'; }).join(""); break;
    case 6: s = '<g class="anim-spin"><circle cx="200" cy="128" r="72" fill="#6d9df5"/><circle cx="200" cy="128" r="52" fill="#f4faff"/>' + [0,1,2,3,4].map(function(k){ var a=k/5*Math.PI*2 - Math.PI/2; return '<text x="'+(200+Math.cos(a)*62)+'" y="'+(134+Math.sin(a)*62)+'" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="19" fill="#eaf4ff">'+k+'</text>'; }).join("") + '<circle cx="200" cy="128" r="12" fill="#4a5aa0"/></g>' +
      '<path d="M200 22 l10 18 h-20z" fill="#1e40af"/>' + charFace(66, 130, 0.9, "#f2c297", "#6d9df5"); break;
    case 7: s = '<circle cx="200" cy="126" r="66" fill="none" stroke="#7aa5f8" stroke-width="14" class="anim-spin" stroke-dasharray="52 30"/>' +
      '<g class="anim-bob"><circle cx="200" cy="60" r="17" fill="#93c5fd"/><circle cx="192" cy="56" r="3" fill="#12283f"/><circle cx="208" cy="56" r="3" fill="#12283f"/><path d="M194 66 q6 5 12 0" stroke="#12283f" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M186 44 l-6 -10 M214 44 l6 -10" stroke="#93c5fd" stroke-width="5" stroke-linecap="round"/></g>' +
      '<g>' + [0,1,2].map(function(k){ return '<path d="M '+(52+k*30)+' 84 c-6 -10 -24 -3 -24 8 c0 9 12 15 24 23 c12 -8 24 -14 24 -23 c0 -11 -18 -18 -24 -8z" fill="#38a3f8"/>'; }).join("") + '<text x="52" y="140" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#46688f">lives: 3</text></g>' +
      '<text x="300" y="140" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#46688f">lives--</text>'; break;
    case 8: s = '<g class="anim-bob"><rect x="36" y="118" width="66" height="52" rx="9" fill="#3c4a63"/><rect x="48" y="94" width="42" height="26" rx="6" fill="#4a90d9"/><text x="69" y="152" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="19" fill="#eaf4ff"> » </text></g>' +
      [10,20,30,40].map(function(v,k){ var x=112+k*62; var dashed = k===3; return '<g class="anim-bob" style="animation-delay:'+(k*0.3)+'s"><rect x="'+x+'" y="118" width="54" height="52" rx="9" fill="'+(dashed?"#e8f7ff":"#5ea8f7")+'" '+(dashed?'stroke="#5ea8f7" stroke-width="3" stroke-dasharray="7 5"':'')+'/><text x="'+(x+27)+'" y="152" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="18" fill="'+(dashed?"#2563eb":"#eaf4ff")+'">'+v+'</text></g>'; }).join("") +
      '<circle cx="80" cy="182" r="10" fill="#3c4a63"/><circle cx="140" cy="182" r="10" fill="#3c4a63"/><circle cx="202" cy="182" r="10" fill="#3c4a63"/><circle cx="264" cy="182" r="10" fill="#3c4a63"/><circle cx="322" cy="182" r="10" fill="#3c4a63"/>'; break;
    case 9: s = '<path d="M84 176 L250 96" stroke="#2f7fe0" stroke-width="6" stroke-dasharray="10 8" class="anim-flow"/><path d="M250 96 l-20 2 l12 16z" fill="#2f7fe0"/>' +
      '<g class="anim-pulse"><rect x="52" y="150" width="64" height="52" rx="8" fill="#f4faff" stroke="#2f7fe0" stroke-width="3"/><text x="84" y="172" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="13" fill="#1d4ed8">ptr</text><text x="84" y="192" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="12" fill="#46688f">→ 42</text></g>' +
      '<g class="anim-bob"><rect x="252" y="56" width="96" height="78" rx="10" fill="#4fb3ff"/><text x="300" y="88" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#eaf4ff">score</text><text x="300" y="116" text-anchor="middle" font-family="Sora,sans-serif" font-size="12" fill="#eaf4ff">42 Memory Lane</text></g>'; break;
    case 10: s = '<g class="anim-bob"><rect x="138" y="86" width="124" height="102" rx="12" fill="#38a3f8"/><text x="200" y="150" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="30" fill="#eaf4ff">hp = 50</text></g>' +
      '<g class="anim-sway"><rect x="106" y="52" width="76" height="26" rx="8" fill="#f4faff" stroke="#38a3f8" stroke-width="2.5"/><text x="144" y="70" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="13" fill="#1e40af">hp</text></g>' +
      '<g class="anim-sway" style="animation-delay:0.7s"><rect x="222" y="52" width="76" height="26" rx="8" fill="#f4faff" stroke="#38a3f8" stroke-width="2.5"/><text x="260" y="70" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="13" fill="#1e40af">&amp;hp</text></g>' +
      '<text x="200" y="216" text-anchor="middle" font-family="Sora,sans-serif" font-weight="700" font-size="14" fill="#eaf4ff">two tags — one box</text>'; break;
    case 11: s = '<path d="M30 130 Q200 96 370 130" stroke="#2fb9e8" stroke-width="4" fill="none" stroke-dasharray="3 7" stroke-linecap="round"/>' +
      '<g class="anim-bob"><rect x="88" y="102" width="62" height="58" rx="10" fill="#2fb9e8"/><text x="119" y="140" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="21" fill="#eaf4ff">Co</text></g>' +
      '<g class="anim-bob" style="animation-delay:0.5s"><rect x="160" y="102" width="62" height="58" rx="10" fill="#2fb9e8"/><text x="191" y="140" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="21" fill="#eaf4ff">de</text></g>' +
      '<g class="anim-pulse"><rect x="252" y="102" width="66" height="58" rx="10" fill="#0369a1"/><text x="285" y="140" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="19" fill="#eaf4ff">Code</text></g>' +
      '<text x="237" y="138" font-weight="800" font-size="20" fill="#46688f">+</text>'; break;
    case 12: s = '<g><rect x="130" y="66" width="140" height="112" rx="14" fill="#3b8ef0"/><rect x="130" y="66" width="140" height="30" rx="14" fill="#2f6fb4"/><text x="200" y="87" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#eaf4ff">' + (window.__isCS ? "Damage()" : "damage()") + '</text><circle cx="200" cy="130" r="24" fill="#f4faff" class="anim-spin"/><circle cx="200" cy="130" r="9" fill="#3b8ef0"/></g>' +
      '<text x="66" y="104" font-family="JetBrains Mono,monospace" font-weight="700" font-size="15" fill="#46688f">atk 9</text><path d="M104 100 h22" stroke="#46688f" stroke-width="4" class="anim-flow"/><text x="66" y="150" font-family="JetBrains Mono,monospace" font-weight="700" font-size="15" fill="#46688f">def 4</text><path d="M104 146 h22" stroke="#46688f" stroke-width="4" class="anim-flow"/>' +
      '<path d="M274 122 h24" stroke="#0369a1" stroke-width="4" class="anim-flow"/><g class="anim-pulse"><circle cx="330" cy="122" r="21" fill="#7cc4ff" stroke="#2f7fe0" stroke-width="3"/><text x="330" y="129" text-anchor="middle" font-weight="800" font-size="17" fill="#1e40af">5</text></g>'; break;
    case 13: s = '<g class="anim-sway"><rect x="106" y="42" width="188" height="150" rx="8" fill="#dceeff" stroke="#2f9be8" stroke-width="3"/><text x="126" y="70" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#1e3a8a">' + (window.__isDrive ? "the walk-around {" : "class Block {") + '</text><text x="140" y="96" font-family="JetBrains Mono,monospace" font-size="13" fill="#1e3a8a">' + (window.__isDrive ? "outside:" : window.__isCS ? "public int Size" : "public:") + '</text><text x="140" y="118" font-family="JetBrains Mono,monospace" font-size="13" fill="#1e3a8a">' + (window.__isDrive ? "lights · tires" : window.__isCS ? "{ get; set; }" : "int size;") + '</text><text x="126" y="144" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#1e3a8a">};</text><rect x="216" y="96" width="52" height="52" fill="none" stroke="#2f9be8" stroke-width="3" stroke-dasharray="6 4"/></g>' +
      '<g class="anim-bob"><rect x="312" y="130" width="52" height="52" rx="7" fill="#2f9be8"/><text x="338" y="162" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="15" fill="#eaf4ff">B</text></g>'; break;
    case 14: s = '<g class="anim-bob"><rect x="70" y="104" width="96" height="80" rx="10" fill="#7fb2e5"/><text x="118" y="140" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="15" fill="#eaf4ff">Block</text><text x="118" y="162" text-anchor="middle" font-family="Sora,sans-serif" font-size="12" fill="#eaf4ff">parent</text></g>' +
      '<path d="M172 144 h44" stroke="#46688f" stroke-width="4" class="anim-flow"/><text x="194" y="130" text-anchor="middle" font-weight="800" font-size="15" fill="#46688f">+</text>' +
      '<g class="anim-bob" style="animation-delay:0.4s"><rect x="224" y="104" width="106" height="80" rx="10" fill="#3b82f6"/><text x="277" y="140" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="14" fill="#eaf4ff">FireBlock</text><text x="277" y="162" text-anchor="middle" font-family="Sora,sans-serif" font-size="12" fill="#eaf4ff">child</text></g>' +
      '<path d="M277 104 c-8 -14 6 -18 2 -32 c10 6 16 16 12 32z" fill="#38bdf8" class="anim-pulse"/><path d="M277 104 c-4 -8 3 -10 1 -18 c6 4 9 9 6 18z" fill="#7cc4ff" class="anim-pulse"/>'; break;
    case 15: s = '<path d="M40 56 H360" stroke="#2563eb" stroke-width="5" stroke-linecap="round"/>' +
      '<g class="anim-sway"><rect x="182" y="56" width="36" height="26" rx="6" fill="#6495ed"/><circle cx="200" cy="46" r="11" fill="#f2c297"/></g>' +
      '<path d="M52 150 Q200 196 348 150 L348 168 Q200 214 52 168z" fill="#3f7de0" opacity="0.9"/>' +
      '<circle cx="200" cy="128" r="13" fill="#1e40af" class="anim-bob"/><text x="200" y="238" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#eaf4ff">' + (window.__isDrive ? "the safety net" : window.__isCS ? "catch { } — the net" : "catch (...) — the net") + '</text>'; break;
    case 16: s = '<g class="anim-spin"><path d="M120 62 l9 20 l22 3 l-16 15 l4 22 l-19 -11 l-19 11 l4 -22 l-16 -15 l22 -3z" fill="#7cc4ff" stroke="#2f7fe0" stroke-width="3"/></g>' +
      '<path d="M236 74 c-14 -16 -44 0 -30 20 c8 12 30 22 30 22 c0 0 22 -10 30 -22 c14 -20 -16 -36 -30 -20z" fill="#38a3f8" class="anim-pulse"/>' +
      '<circle cx="140" cy="168" r="24" fill="#2fc4e8" class="anim-bob"/>' +
      '<g class="anim-bob" style="animation-delay:0.4s"><rect x="216" y="146" width="72" height="52" rx="9" fill="none" stroke="#3f7de0" stroke-width="4" stroke-dasharray="8 5"/><text x="252" y="178" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="16" fill="#3f7de0">T</text></g>' +
      '<text x="200" y="238" text-anchor="middle" font-family="Sora,sans-serif" font-weight="700" font-size="14" fill="#eaf4ff">one cutter — every shape</text>'; break;
    case 18: s = '<g class="anim-bob"><rect x="46" y="80" width="102" height="94" rx="10" fill="#0ea5e9"/><text x="97" y="118" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="15" fill="#ffffff">Block.h</text><text x="97" y="142" text-anchor="middle" font-family="Sora,sans-serif" font-size="12" fill="#eaf4ff">the header</text></g>' +
      '<path d="M154 122 H196" stroke="#2f7fe0" stroke-width="5" stroke-linecap="round" class="anim-flow" fill="none"/><text x="175" y="104" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="12" fill="#46688f">#include</text>' +
      '<g class="anim-bob" style="animation-delay:0.5s"><rect x="202" y="80" width="112" height="94" rx="10" fill="#3c4a63"/><text x="258" y="118" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="15" fill="#ffffff">main.cpp</text><text x="258" y="142" text-anchor="middle" font-family="Sora,sans-serif" font-size="12" fill="#dceeff">the source</text></g>' +
      '<text x="200" y="202" text-anchor="middle" font-family="Sora,sans-serif" font-weight="700" font-size="14" fill="#46688f">pieces → one program</text>'; break;
    case 19: s = '<g class="anim-bob"><rect x="48" y="98" width="62" height="62" rx="9" fill="#4f9cf9"/><text x="79" y="138" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="22" fill="#eaf4ff">3</text></g>' +
      '<text x="132" y="140" text-anchor="middle" font-weight="800" font-size="26" fill="#46688f">+</text>' +
      '<g class="anim-bob" style="animation-delay:0.4s"><rect x="156" y="98" width="62" height="62" rx="9" fill="#4f9cf9"/><text x="187" y="138" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="22" fill="#eaf4ff">4</text></g>' +
      '<text x="238" y="140" text-anchor="middle" font-weight="800" font-size="26" fill="#46688f">=</text>' +
      '<g class="anim-pulse"><rect x="262" y="88" width="82" height="82" rx="10" fill="#0369a1"/><text x="303" y="138" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="28" fill="#eaf4ff">7</text></g>' +
      '<text x="200" y="200" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#46688f">blockA + blockB — operator+</text>'; break;
    case 20: s = '<g><rect x="30" y="24" width="92" height="32" rx="10" fill="#ffffff" stroke="#48cae4" stroke-width="2.5"/><text x="76" y="46" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="14" fill="#1d4ed8">Woof!</text></g>' +
      '<g><rect x="154" y="24" width="92" height="32" rx="10" fill="#ffffff" stroke="#48cae4" stroke-width="2.5"/><text x="200" y="46" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="14" fill="#1d4ed8">Meow!</text></g>' +
      '<g><rect x="278" y="24" width="92" height="32" rx="10" fill="#ffffff" stroke="#48cae4" stroke-width="2.5"/><text x="324" y="46" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="14" fill="#1d4ed8">Quack!</text></g>' +
      charFace(76, 104, 0.95, "#f2c297", "#4f9cf9") + charFace(200, 104, 0.95, "#8d5a3a", "#2fc4e8") + charFace(324, 104, 0.95, "#f2c297", "#38bdf8") +
      '<g class="anim-pulse"><rect x="146" y="176" width="108" height="28" rx="14" fill="#2f7fe0"/><text x="200" y="195" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#eaf4ff">' + (window.__isDrive ? "share" : "speak()") + '</text></g>'; break;
    case 21: s = '<g class="anim-pulse"><rect x="142" y="34" width="116" height="56" rx="10" fill="none" stroke="#2f7fd0" stroke-width="4" stroke-dasharray="9 6"/><text x="200" y="69" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="17" fill="#2f7fd0">Box&lt;T&gt;</text></g>' +
      '<path d="M170 94 L110 116 M200 94 V116 M230 94 L290 116" stroke="#2f7fd0" stroke-width="4" class="anim-flow" fill="none"/>' +
      '<g class="anim-bob"><rect x="52" y="122" width="96" height="56" rx="9" fill="#2f7fd0"/><text x="100" y="157" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="15" fill="#eaf4ff">Box&lt;int&gt;</text></g>' +
      '<g class="anim-bob" style="animation-delay:0.3s"><rect x="152" y="122" width="96" height="56" rx="9" fill="#31b8c6"/><text x="200" y="157" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="12" fill="#eaf4ff">Box&lt;double&gt;</text></g>' +
      '<g class="anim-bob" style="animation-delay:0.6s"><rect x="252" y="122" width="96" height="56" rx="9" fill="#60a5fa"/><text x="300" y="157" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="12" fill="#eaf4ff">Box&lt;string&gt;</text></g>' +
      '<text x="200" y="202" text-anchor="middle" font-family="Sora,sans-serif" font-weight="700" font-size="14" fill="#46688f">one blueprint — many boxes</text>'; break;
    case 22: s = '<g class="anim-bob"><rect x="40" y="98" width="94" height="70" rx="10" fill="#7cc7ff"/><text x="87" y="126" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="15" fill="#0a2547">' + (window.__isCS ? "Task" : "b1") + '</text><circle cx="66" cy="148" r="6" fill="#bfdcff"/><circle cx="87" cy="148" r="6" fill="#bfdcff"/><circle cx="108" cy="148" r="6" fill="#bfdcff"/></g>' +
      '<path d="M142 118 H252" stroke="#2f7fe0" stroke-width="5" stroke-linecap="round" class="anim-flow" fill="none"/><path d="M246 106 l20 12 l-20 12z" fill="#2f7fe0"/>' +
      '<path d="M202 52 l-12 22 h10 l-6 20 l20 -26 h-11 l8 -16z" fill="#7cc4ff" stroke="#2f7fe0" stroke-width="2" class="anim-pulse"/>' +
      '<text x="197" y="142" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="13" fill="#46688f">' + (window.__isCS ? "await" : "std::move") + '</text>' +
      '<g class="anim-bob" style="animation-delay:0.5s"><rect x="266" y="98" width="94" height="70" rx="10" fill="#0369a1"/><text x="313" y="126" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="15" fill="#eaf4ff">' + (window.__isCS ? "result" : "b2") + '</text><circle cx="292" cy="148" r="6" fill="#a9dcff"/><circle cx="313" cy="148" r="6" fill="#a9dcff"/><circle cx="334" cy="148" r="6" fill="#a9dcff"/></g>' +
      '<text x="200" y="200" text-anchor="middle" font-family="Sora,sans-serif" font-weight="700" font-size="14" fill="#46688f">' + (window.__isCS ? "the job travels — the screen never freezes" : "take the contents — no photocopies") + '</text>'; break;
    case 23: s = '<rect x="56" y="36" width="288" height="168" rx="10" fill="#dceeff" stroke="#2563eb" stroke-width="3"/>' +
      '<rect x="56" y="90" width="288" height="6" fill="#2563eb"/><rect x="56" y="144" width="288" height="6" fill="#2563eb"/>' +
      '<g class="anim-bob"><rect x="70" y="52" width="76" height="32" rx="6" fill="#38bdf8"/><text x="108" y="73" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="13" fill="#ffffff">' + (window.__isCS ? "List" : "vector") + '</text></g>' +
      '<g class="anim-bob" style="animation-delay:0.3s"><rect x="162" y="52" width="76" height="32" rx="6" fill="#2563eb"/><text x="200" y="73" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="' + (window.__isCS ? "11" : "13") + '" fill="#ffffff">' + (window.__isCS ? "Dictionary" : "map") + '</text></g>' +
      '<g class="anim-bob" style="animation-delay:0.6s"><rect x="254" y="52" width="76" height="32" rx="6" fill="#31b8c6"/><text x="292" y="73" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="13" fill="#ffffff">' + (window.__isCS ? "HashSet" : "set") + '</text></g>' +
      '<g class="anim-pulse"><circle cx="108" cy="118" r="18" fill="#f4faff" stroke="#2563eb" stroke-width="3"/><text x="108" y="123" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="11" fill="#1e40af">sort</text></g>' +
      '<g class="anim-pulse" style="animation-delay:0.4s"><circle cx="200" cy="118" r="18" fill="#f4faff" stroke="#2563eb" stroke-width="3"/><text x="200" y="123" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="11" fill="#1e40af">find</text></g>' +
      '<g class="anim-pulse" style="animation-delay:0.8s"><circle cx="292" cy="118" r="18" fill="#f4faff" stroke="#2563eb" stroke-width="3"/><text x="292" y="123" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="10" fill="#1e40af">count</text></g>' +
      '<g><rect x="70" y="156" width="76" height="34" rx="5" fill="#93c5fd"/><rect x="97" y="162" width="22" height="6" rx="3" fill="#1e40af"/><text x="108" y="184" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#1e3a8a">drawer V</text></g>' +
      '<g><rect x="162" y="156" width="76" height="34" rx="5" fill="#93c5fd"/><rect x="189" y="162" width="22" height="6" rx="3" fill="#1e40af"/><text x="200" y="184" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#1e3a8a">drawer hp</text></g>' +
      '<g><rect x="254" y="156" width="76" height="34" rx="5" fill="#93c5fd"/><rect x="281" y="162" width="22" height="6" rx="3" fill="#1e40af"/><text x="292" y="184" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#1e3a8a">drawer xp</text></g>'; break;
    case 24: s = '<g class="anim-sway"><rect x="98" y="70" width="98" height="116" rx="8" fill="#f4faff" stroke="#1d4ed8" stroke-width="3" transform="rotate(-4 196 128)"/><rect x="204" y="70" width="98" height="116" rx="8" fill="#eaf4ff" stroke="#1d4ed8" stroke-width="3" transform="rotate(4 204 128)"/>' +
      '<rect x="116" y="94" width="62" height="7" rx="3.5" fill="#bcd7f5" transform="rotate(-4 196 128)"/><rect x="116" y="110" width="62" height="7" rx="3.5" fill="#bcd7f5" transform="rotate(-4 196 128)"/><rect x="116" y="126" width="46" height="7" rx="3.5" fill="#bcd7f5" transform="rotate(-4 196 128)"/>' +
      '<rect x="222" y="94" width="62" height="7" rx="3.5" fill="#bcd7f5" transform="rotate(4 204 128)"/><rect x="222" y="110" width="62" height="7" rx="3.5" fill="#bcd7f5" transform="rotate(4 204 128)"/><rect x="222" y="126" width="46" height="7" rx="3.5" fill="#bcd7f5" transform="rotate(4 204 128)"/></g>' +
      '<g class="anim-bob"><rect x="26" y="36" width="64" height="27" rx="9" fill="#2563eb"/><text x="58" y="54" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="13" fill="#ffffff">' + (window.__isDrive ? "record" : "bug") + '</text></g>' +
      '<g class="anim-bob" style="animation-delay:0.4s"><rect x="310" y="32" width="64" height="27" rx="9" fill="#38bdf8"/><text x="342" y="50" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="13" fill="#ffffff">' + (window.__isDrive ? "renewal" : "loop") + '</text></g>' +
      '<g class="anim-bob" style="animation-delay:0.8s"><rect x="318" y="128" width="64" height="27" rx="9" fill="#31b8c6"/><text x="350" y="146" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="13" fill="#ffffff">' + (window.__isDrive ? "points" : "class") + '</text></g>' +
      '<g class="anim-bob" style="animation-delay:1.1s"><rect x="18" y="140" width="76" height="27" rx="9" fill="#2f7fe0"/><text x="56" y="158" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="12" fill="#ffffff">' + (window.__isDrive ? "insurance" : "syntax") + '</text></g>'; break;
    case 25: s = '<rect x="50" y="34" width="300" height="170" rx="10" fill="#2f7fe0"/>' +
      '<g class="anim-sway"><g transform="rotate(-4 116 112)"><rect x="68" y="58" width="96" height="108" rx="7" fill="#f4faff"/><circle cx="116" cy="70" r="6" fill="#7cc4ff" stroke="#1e40af" stroke-width="2"/><text x="116" y="94" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="12" fill="#1e40af">' + (window.__isDrive ? "Numbers" : "Skeleton") + '</text><rect x="82" y="106" width="68" height="7" rx="3.5" fill="#bcd7f5"/><rect x="82" y="120" width="68" height="7" rx="3.5" fill="#bcd7f5"/><rect x="82" y="134" width="50" height="7" rx="3.5" fill="#bcd7f5"/></g></g>' +
      '<g class="anim-sway" style="animation-delay:0.5s"><g transform="rotate(3 200 112)"><rect x="152" y="58" width="96" height="108" rx="7" fill="#ffffff"/><circle cx="200" cy="70" r="6" fill="#7cc4ff" stroke="#1e40af" stroke-width="2"/><text x="200" y="94" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="12" fill="#1e40af">' + (window.__isDrive ? "Shapes" : "Loops") + '</text><rect x="166" y="106" width="68" height="7" rx="3.5" fill="#bcd7f5"/><rect x="166" y="120" width="68" height="7" rx="3.5" fill="#bcd7f5"/><rect x="166" y="134" width="50" height="7" rx="3.5" fill="#bcd7f5"/></g></g>' +
      '<g class="anim-sway" style="animation-delay:1s"><g transform="rotate(-2 284 112)"><rect x="236" y="58" width="96" height="108" rx="7" fill="#f4faff"/><circle cx="284" cy="70" r="6" fill="#7cc4ff" stroke="#1e40af" stroke-width="2"/><text x="284" y="94" text-anchor="middle" font-family="Sora,sans-serif" font-weight="800" font-size="12" fill="#1e40af">' + (window.__isDrive ? "Rules" : "Symbols") + '</text><rect x="250" y="106" width="68" height="7" rx="3.5" fill="#bcd7f5"/><rect x="250" y="120" width="68" height="7" rx="3.5" fill="#bcd7f5"/><rect x="250" y="134" width="50" height="7" rx="3.5" fill="#bcd7f5"/></g></g>' +
      '<text x="200" y="228" text-anchor="middle" font-family="Sora,sans-serif" font-weight="700" font-size="14" fill="#eaf4ff">pin them where your eyes can find them</text>'; break;
    case 26: s = '<g class="anim-bob"><ellipse cx="168" cy="132" rx="48" ry="37" fill="#2563eb"/>' +
      '<path d="M126 118 l-24 -12 M122 140 l-26 2 M130 158 l-20 16 M210 118 l24 -12 M214 140 l26 2 M206 158 l20 16" stroke="#1e40af" stroke-width="5" stroke-linecap="round" fill="none"/>' +
      '<path d="M148 100 q-6 -16 -18 -20 M188 100 q6 -16 18 -20" stroke="#1e40af" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<circle cx="150" cy="126" r="9" fill="#ffffff"/><circle cx="186" cy="126" r="9" fill="#ffffff"/><circle cx="150" cy="128" r="4" fill="#12283f"/><circle cx="186" cy="128" r="4" fill="#12283f"/>' +
      '<path d="M156 148 q12 7 24 0" stroke="#12283f" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<circle cx="140" cy="146" r="5" fill="#7cc4ff"/><circle cx="196" cy="146" r="5" fill="#7cc4ff"/></g>' +
      '<g class="anim-sway"><circle cx="272" cy="100" r="42" fill="#aee7ff" fill-opacity="0.5" stroke="#1e3a8a" stroke-width="6"/><rect x="296" y="130" width="15" height="48" rx="7" fill="#1e3a8a" transform="rotate(-38 303 154)"/></g>' +
      '<text x="200" y="228" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="13" fill="#eaf4ff">' + (window.__isDrive ? "plan the ride before the drink" : "read the first error first") + '</text>'; break;
    case 28: s = '<rect x="96" y="34" width="208" height="168" rx="10" fill="#dceeff" stroke="#2563eb" stroke-width="3"/>' +
      '<rect x="96" y="88" width="208" height="5" fill="#2563eb"/><rect x="96" y="144" width="208" height="5" fill="#2563eb"/>' +
      '<g class="anim-bob"><rect x="112" y="48" width="120" height="30" rx="6" fill="#38bdf8"/><text x="172" y="68" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="12" fill="#ffffff">save.txt</text></g><rect x="252" y="57" width="34" height="7" rx="3.5" fill="#1e40af"/>' +
      '<g class="anim-bob" style="animation-delay:0.3s"><rect x="112" y="104" width="120" height="30" rx="6" fill="#2563eb"/><text x="172" y="124" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="12" fill="#ffffff">scores.txt</text></g><rect x="252" y="113" width="34" height="7" rx="3.5" fill="#1e40af"/>' +
      '<g class="anim-bob" style="animation-delay:0.6s"><rect x="112" y="158" width="120" height="30" rx="6" fill="#31b8c6"/><text x="172" y="178" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="12" fill="#ffffff">settings</text></g><rect x="252" y="167" width="34" height="7" rx="3.5" fill="#1e40af"/>' +
      '<text x="200" y="228" text-anchor="middle" font-family="Sora,sans-serif" font-weight="700" font-size="14" fill="#eaf4ff">write it today — read it back tomorrow</text>'; break;
    default: s = '<path d="M70 190 L170 84 L226 138 L330 44" stroke="#31b8c6" stroke-width="5" fill="none" stroke-linecap="round" class="anim-flow"/>' +
      '<g class="anim-bob"><rect x="52" y="168" width="42" height="34" rx="8" fill="#31b8c6"/><text x="73" y="191" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="14" fill="#eaf4ff">[]</text></g>' +
      '<circle cx="170" cy="84" r="15" fill="#7cc4ff" stroke="#2f7fe0" stroke-width="3" class="anim-pulse"/><text x="170" y="90" text-anchor="middle" font-weight="800" font-size="13" fill="#1e40af">5</text>' +
      '<circle cx="330" cy="44" r="19" fill="#7cc4ff" stroke="#2f7fe0" stroke-width="3" class="anim-pulse"/><text x="330" y="51" text-anchor="middle" font-weight="800" font-size="15" fill="#1e40af">10</text>' +
      '<text x="252" y="120" font-family="JetBrains Mono,monospace" font-weight="700" font-size="16" fill="#0369a1">x * 2</text>' + charFace(88, 84, 0.9, "#8d5a3a", "#31b8c6"); break;
  }
  return head + sun + s + ground + "</svg>";
}

/* A picture for chapters that bring no hand-drawn scene (the registry
   tracks): the chapter's key line on a code card, read out token by
   token, with the guide pointing at it — the same stage, sun and
   ground as every other scene. */
function sceneCard(b) {
  function x(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var lines = (Array.isArray(b.line) ? b.line : [b.line]).slice(0, 3);
  var longest = lines.reduce(function (m, l) { return Math.max(m, l.length); }, 1);
  var fs = Math.max(9, Math.min(16, Math.floor(430 / longest)));
  var top = 112 - (lines.length - 1) * (fs + 8) / 2;
  var card = '<g class="anim-sway"><rect x="34" y="58" width="332" height="118" rx="12" fill="#0b2545" stroke="#38bdf8" stroke-width="3"/>' +
    '<circle cx="52" cy="72" r="4" fill="#38bdf8"/><circle cx="66" cy="72" r="4" fill="#2f7fe0"/><circle cx="80" cy="72" r="4" fill="#31b8c6"/>' +
    lines.map(function (l, k) {
      return '<text x="200" y="' + (top + k * (fs + 8)) + '" text-anchor="middle" font-family="JetBrains Mono,monospace" font-weight="700" font-size="' + fs + '" fill="#eaf4ff" style="font-variant-ligatures:none">' + x(l) + "</text>";
    }).join("") +
    '<rect x="' + (200 + Math.min(150, lines[lines.length - 1].length * fs * 0.31)) + '" y="' + (top + (lines.length - 1) * (fs + 8) - fs + 2) + '" width="3" height="' + fs + '" fill="#7cc4ff" class="anim-pulse"/></g>';
  var tag = '<g class="anim-bob"><rect x="132" y="22" width="136" height="28" rx="14" fill="#2f7fe0"/><text x="200" y="41" text-anchor="middle" font-family="Sora,sans-serif" font-weight="700" font-size="13" fill="#ffffff">' + x(b.title.length > 18 ? b.title.slice(0, 17) + "…" : b.title) + "</text></g>";
  var head = '<svg class="stage-svg" viewBox="0 0 400 250" role="img" aria-label="Animated picture for this chapter">';
  var ground = '<rect x="0" y="212" width="400" height="38" fill="#2f7fe0"/><ellipse cx="70" cy="222" rx="34" ry="7" fill="#2563eb"/><ellipse cx="330" cy="228" rx="42" ry="8" fill="#2563eb"/>';
  var sun = '<circle cx="356" cy="38" r="20" fill="#7cc4ff" class="anim-pulse"/><circle cx="52" cy="42" r="13" fill="#ffffff" opacity="0.85"/><circle cx="72" cy="42" r="10" fill="#ffffff" opacity="0.85"/>';
  return head + sun + card + tag + charFace(60, 182, 0.8, "#8d5a3a", b.color || "#31b8c6") + charFace(342, 182, 0.8, "#f1c27d", "#2563eb") + ground + "</svg>";
}
/* ---------- Library reader ---------- */
var libGrid = $("libGrid"), currentChapter = 0, readerMode = "text", stageTimers = [];
var activeBooks = CHAPTERS, activeDeep = DEEP, readerKind = "chapter";
CHAPTERS.forEach(function (b, i) {
  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "lib-card";
  /* Loop 41 — every book wears a spine; its strength deepens
     with the book's place in the run. */
  btn.style.setProperty("--spine-i", CHAPTERS.length > 1 ? (i / (CHAPTERS.length - 1)).toFixed(3) : "0");
  btn.innerHTML = '<span class="lib-spine" aria-hidden="true"></span><span class="block-chip" style="background:' + b.color + '">' + (i + 1) + '</span>' +
    '<span class="block-meta"><span class="block-name">Chapter ' + (i + 1) + ' · ' + b.title + '</span><br>' +
    '<span class="block-reps">' + b.chapter + '</span></span>';
  btn.addEventListener("click", function () { openChapter(i); });
  libGrid.appendChild(btn);
});
var shelfGrid = $("shelfGrid");
SHELFBOOKS.forEach(function (b, j) {
  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "lib-card";
  /* Loop 41 — shelf books wear the dashed reference spine. */
  btn.style.setProperty("--spine-i", SHELFBOOKS.length > 1 ? (j / (SHELFBOOKS.length - 1)).toFixed(3) : "0");
  btn.innerHTML = '<span class="lib-spine lib-spine-shelf" aria-hidden="true"></span><span class="block-chip" style="background:' + b.color + '">' + b.num + '</span>' +
    '<span class="block-meta"><span class="block-name">' + b.title + '</span><br>' +
    '<span class="block-reps">' + b.chapter + '</span></span>';
  btn.addEventListener("click", function () { openShelf(j); });
  shelfGrid.appendChild(btn);
});
function clearStageTimers() { stageTimers.forEach(clearTimeout); stageTimers = []; }
function openChapter(i) { activeBooks = CHAPTERS; activeDeep = DEEP; readerKind = "chapter"; openEntry(i); }
function openShelf(j) { activeBooks = SHELFBOOKS; activeDeep = SHELFDEEP; readerKind = "shelf"; openEntry(j); }
function openEntry(i) {
  /* Loop 64 — turning the page retires the old page's demo:
     Play's timed line-reveals were the one Library timer path
     openEntry never cleared (the back button, the mode toggle
     and leaving the view all did), so Play → Next chapter
     within a few seconds appended the PREVIOUS chapter's demo
     lines into the new chapter's console, over its placeholder.
     The stage music is deliberately NOT stopped — it carries
     across chapters and re-keys by chapter (Loop 6). */
  clearStageTimers();
  if (readerKind === "shelf" && activeBooks[i] && activeBooks[i].member && !(window.cbIsMember && window.cbIsMember())) {
    showView("profile");
    /* Loop 68 — every other road into the profile room (the
       menu, the Vault's guest card) renders it on arrival; this
       gate didn't, so a guest whose first profile-room visit
       was a bounced member shelf landed on an empty room — no
       create form, no sign-in picks — and the nudge below
       wrote to a profMsgTop that didn't exist yet and was
       silently lost. Render first, then nudge. */
    if (window.cbRenderProfile) window.cbRenderProfile();
    if (window.cbMemberNudge) window.cbMemberNudge();
    return;
  }
  currentChapter = i;
  var b = activeBooks[i], L = b.content;
  $("libHome").classList.add("hidden");
  $("libReader").classList.remove("hidden");
  $("readerChip").style.background = b.color;
  $("readerChip").textContent = readerKind === "chapter" ? String(i + 1) : b.num;
  $("libReader").style.setProperty("--reader-accent", b.color);
  var readerPct = Math.round(((i + 1) / activeBooks.length) * 100);
  $("readerProgressFill").style.width = readerPct + "%";
  $("readerProgress").setAttribute("aria-valuenow", String(readerPct));
  $("readerTitle").textContent = b.title;
  $("readerChapter").textContent = readerKind === "chapter"
    ? "Chapter " + (i + 1) + " of " + activeBooks.length + " · " + b.chapter
    : b.chapter;
  var sc = $("storyCard"); sc.innerHTML = "";
  L.story.forEach(function (p) { var el = document.createElement("p"); el.textContent = p; sc.appendChild(el); });
  $("bigIdea").textContent = L.big;
  $("storyCode").innerHTML = '<span class="cm">' + (window.__isDrive ? "★ The rule to remember:" : cbCommentLabel("A key line from this chapter:").replace(/</g, "&lt;")) + '</span>\n' + (Array.isArray(b.line) ? b.line.join("\n") : b.line).replace(/</g, "&lt;");
  var D = activeDeep[i];
  if (D) {
    D.more.forEach(function (p) { var el2 = document.createElement("p"); el2.textContent = p; sc.appendChild(el2); });
    $("exampleCode").innerHTML = '<span class="cm">' + (window.__isDrive ? "★ The chapter on one card:" : cbCommentLabel("Another example to explore:").replace(/</g, "&lt;")) + '</span>\n' + D.ex.code.replace(/</g, "&lt;");
    $("exampleCode").classList.remove("hidden");
    var wc = $("walkCard"); wc.innerHTML = "";
    var wh = document.createElement("p");
    var ws = document.createElement("strong"); ws.textContent = window.__isDrive ? "The card, line by line" : "Walkthrough — line by line"; wh.appendChild(ws); wc.appendChild(wh);
    D.ex.walk.forEach(function (p) { var el3 = document.createElement("p"); el3.textContent = p; wc.appendChild(el3); });
    wc.classList.remove("hidden");
    $("mistakeText").textContent = D.mistake;
    $("mistakeCard").classList.remove("hidden");
  } else {
    $("exampleCode").classList.add("hidden");
    $("walkCard").classList.add("hidden");
    $("mistakeCard").classList.add("hidden");
  }
  $("stageHolder").innerHTML = typeof b.scene === "number" ? sceneSVG(b.scene) : sceneCard(b);
  $("stageCaption").textContent = L.caption;
  $("stageConsole").innerHTML = '<span class="dim">Press “Play the picture” and watch the idea happen, step by step.</span>';
  $("readerPos").textContent = (readerKind === "chapter"
    ? "Chapter " + (i + 1) + " of " + activeBooks.length
    : "Shelf " + (i + 1) + " of " + activeBooks.length + " · " + (window.__isDrive ? "Beyond the Manual" : "Beyond the Book")) + " · ← → keys turn the page";
  /* Loop 50 — the reader swaps its whole page in place, and
     the chapter card that brought you here is now hidden, so a
     listener's focus is stranded in silence. Name the book
     that just opened and its place in the run. */
  if (window.cbAnnounce) window.cbAnnounce((readerKind === "chapter" ? "Chapter " + (i + 1) + " of " + activeBooks.length : "Shelf book " + (i + 1) + " of " + activeBooks.length) + ": " + b.title);
  $("prevChapter").disabled = i === 0;
  $("nextChapter").disabled = i === activeBooks.length - 1;
  setReaderMode(readerMode);
  window.scrollTo(0, 0);
  /* The session keeps where you are: opening a chapter saves it. */
  if (window.cbSessionSave) window.cbSessionSave();
}
function setReaderMode(mode) {
  readerMode = mode;
  $("modeText").classList.toggle("active", mode === "text");
  $("modePicture").classList.toggle("active", mode === "picture");
  $("modeText").setAttribute("aria-pressed", String(mode === "text"));
  $("modePicture").setAttribute("aria-pressed", String(mode === "picture"));
  $("textMode").classList.toggle("hidden", mode !== "text");
  $("pictureMode").classList.toggle("hidden", mode !== "picture");
  clearStageTimers();
  if (mode !== "picture") stopStageMusic();
}
$("modeText").addEventListener("click", function () { setReaderMode("text"); });
$("modePicture").addEventListener("click", function () { setReaderMode("picture"); });
$("libBack").addEventListener("click", function () {
  clearStageTimers(); stopStageMusic();
  $("libReader").classList.add("hidden");
  $("libHome").classList.remove("hidden");
  /* Loop 50 — stepping back out of a book is a room change
     inside the Library view, so showView never speaks for it. */
  if (window.cbAnnounce) window.cbAnnounce("Back to the Library — all chapters and shelves.");
  window.scrollTo(0, 0);
});
$("prevChapter").addEventListener("click", function () { if (currentChapter > 0) openEntry(currentChapter - 1); });
$("nextChapter").addEventListener("click", function () { if (currentChapter < activeBooks.length - 1) openEntry(currentChapter + 1); });
/* Loop 6 finishing touch: a book deserves page-turn keys. While the
   reader is open, ← and → turn chapters — but never while the
   learner is typing in a field (glossary search, book page box). */
document.addEventListener("keydown", function (e) {
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  if ($("libReader").classList.contains("hidden")) return;
  var t = e.target;
  if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
  if (e.key === "ArrowLeft" && currentChapter > 0) openEntry(currentChapter - 1);
  if (e.key === "ArrowRight" && currentChapter < activeBooks.length - 1) openEntry(currentChapter + 1);
});
$("stagePlay").addEventListener("click", function () {
  clearStageTimers();
  var con = $("stageConsole"); con.innerHTML = "";
  var lines = activeBooks[currentChapter].content.demo;
  /* Loop 53: under reduced motion the timed reveal lands at
     once — every line appears together, already shown, so the
     demo's words are never stranded waiting on a sequence. */
  var stageReduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  lines.forEach(function (line, k) {
    stageTimers.push(setTimeout(function () {
      var d = document.createElement("div");
      d.className = "cl"; d.textContent = (k === lines.length - 1 ? "★ " : "› ") + line;
      con.appendChild(d);
      if (stageReduced) d.classList.add("show");
      else requestAnimationFrame(function () { d.classList.add("show"); });
    }, stageReduced ? 0 : 420 + k * 780));
  });
});

/* ---------- Picture-mode music (generative, original, Web Audio) ---------- */
var stageAC = null, stageMaster = null, stagePadGain = null, stageOn = false, stageTimer = null, stageNext = 0, stageBar = 0;
var STAGE_CHORDS = [[261.63, 329.63, 392.00], [196.00, 246.94, 293.66], [220.00, 261.63, 329.63], [174.61, 220.00, 261.63]];
var STAGE_SCALE = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
/* Loop 6: picture music changes key as the reader travels — four
   transpositions cycle by entry, so consecutive chapters do not all
   sound like the same room. */
var STAGE_KEYS = [1, 1.122462, 1.259921, 0.840896];
function stageBuild() {
  stageAC = window.cbAudioContext();
  stageMaster = stageAC.createGain(); stageMaster.gain.value = 0;
  stageMaster.connect(stageAC.destination);
  /* The picture music's pad bed gets its own gain stage into the
     master bus, balanced apart from the sparkles and melody. */
  stagePadGain = stageAC.createGain(); stagePadGain.gain.value = 0.9;
  stagePadGain.connect(stageMaster);
}
function stageTone(freq, t, dur, vol, type, dest) {
  var o = stageAC.createOscillator(); o.type = type; o.frequency.value = freq;
  var g = stageAC.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(g); g.connect(dest || stageMaster);
  o.start(t); o.stop(t + dur + 0.05);
}
function stageSchedule() {
  /* Loop 59 — the same resync as the main engine: a hidden
     tab throttles this timer while the stage clock walks on,
     and the while below used to repay every missed 2-second
     step at its past start time — a stack of picture-music
     bars landing in a single instant on return. Missed steps
     are dropped by whole steps instead, so the four-chord
     cycle keeps its phase and the music resumes just ahead
     of the clock. */
  if (stageNext < stageAC.currentTime - 0.15) {
    stageBar += Math.floor((stageAC.currentTime - stageNext) / 2) + 1;
    stageNext = stageAC.currentTime + 0.1;
  }
  while (stageNext < stageAC.currentTime + 0.6) {
    var chord = STAGE_CHORDS[stageBar % 4], t = stageNext;
    var key = STAGE_KEYS[currentChapter % STAGE_KEYS.length];
    chord.forEach(function (f) { stageTone(f * key / 2, t, 2.4, 0.035, "sine", stagePadGain); });
    /* a deep root under the pad, and now and then a music-box sparkle
       two octaves up, so the picture music feels composed, not looped */
    stageTone(chord[0] * key / 4, t, 2.6, 0.045, "sine", stagePadGain);
    if (stageBar % 2 === 1 && Math.random() < 0.7) {
      stageTone(STAGE_SCALE[STAGE_SCALE.length - 1] * key * (Math.random() < 0.5 ? 1 : 1.335), t + 1.32, 0.9, 0.02, "sine");
    }
    for (var k = 0; k < 3; k++) {
      if (Math.random() < 0.3) continue;
      stageTone(STAGE_SCALE[Math.floor(Math.random() * STAGE_SCALE.length)] * key, t + k * 0.66, 1.1, 0.045, "triangle");
    }
    stageNext += 2; stageBar++;
  }
}
function startStageMusic() {
  if (!stageAC) stageBuild();
  stageAC.resume();
  stageMaster.gain.setTargetAtTime(0.5, stageAC.currentTime, 0.6);
  stageNext = stageAC.currentTime + 0.1; stageBar = 0;
  if (stageTimer) clearInterval(stageTimer);
  stageTimer = setInterval(stageSchedule, 220); stageSchedule();
}
/* Coming back to the tab: the same frozen-interval recovery as
   the main engine — restart the heartbeat so the picture music
   resumes once the shared engine runs again. stageSchedule()
   only schedules inside its 0.6 s window and drops missed steps,
   so restarting the timer can never double-schedule a step. */
function wakeStageMusic() {
  if (!stageOn || !stageAC) return;
  if (window.cbAudioWake) window.cbAudioWake();
  if (stageTimer) clearInterval(stageTimer);
  stageTimer = setInterval(stageSchedule, 220);
  stageSchedule();
}
document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") wakeStageMusic(); });
window.addEventListener("pageshow", wakeStageMusic);
window.addEventListener("focus", wakeStageMusic);
window.__stageMusicWake = wakeStageMusic;
function stopStageMusic() {
  if (!stageOn) return;
  stageOn = false;
  $("stageMusicBtn").classList.remove("on");
  $("stageMusicBtn").setAttribute("aria-pressed", "false");
  $("stageMusicText").textContent = "Music off";
  if (stageAC && stageMaster) stageMaster.gain.setTargetAtTime(0, stageAC.currentTime, 0.25);
  clearInterval(stageTimer); stageTimer = null;
}
$("stageMusicBtn").addEventListener("click", function () {
  stageOn = !stageOn;
  $("stageMusicBtn").classList.toggle("on", stageOn);
  $("stageMusicBtn").setAttribute("aria-pressed", String(stageOn));
  $("stageMusicText").textContent = stageOn ? "Music on" : "Music off";
  if (stageOn) { if (window.__stopMainMusic) window.__stopMainMusic(); startStageMusic(); } else stopStageMusic();
});
/* Previous chord: step the picture music back one chord in its
   four-chord progression. If it is playing, the next bar starts
   almost immediately so the step back is heard, not just queued. */
$("stagePrevBtn").addEventListener("click", function () {
  stageBar = stageBar > 0 ? stageBar - 1 : 3;
  if (stageOn && stageAC) stageNext = Math.min(stageNext, stageAC.currentTime + 0.05);
});

