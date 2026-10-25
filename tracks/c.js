"use strict";
/* ================= C — a Code Block track =================
   Written fresh for Code Block in plain words. Facts and syntax follow
   the C17 standard (ISO/IEC 9899:2018) and the GNU C Library manual.
   Every PC project and library example is checked in tests/content: it
   must match clang-format, compile as C17 with every warning an error,
   and run cleanly under AddressSanitizer and UndefinedBehaviorSanitizer
   — and a project's output must match the app. Every drill and Vault
   line is parsed by tree-sitter's C grammar. */
cbRegisterTrack("c", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Include Block", short: "#include", chapter: "C Ch. 1 · First Steps", icon: "i-link", verb: "borrow",
      line: "#include <stdio.h>",
      explain: "#include pastes in a header file before compiling. stdio.h (standard input/output) declares printf and friends." },
    { name: "Hello Block", short: "printf", chapter: "C Ch. 1 · First Steps", icon: "i-say", verb: "say",
      line: 'printf("Hello, world!\\n");',
      explain: "printf prints text. \\n is the newline character — printf never adds one for you. Every statement ends with a semicolon." },
    { name: "Int Block", short: "int", chapter: "C Ch. 2 · Variables and Types", icon: "i-tag", verb: "store",
      line: "int score = 0;",
      explain: "int is a whole number. In C you always write the type first, and a variable must be given a value before you read it." },
    { name: "Double Block", short: "double", chapter: "C Ch. 2 · Variables and Types", icon: "i-boxes", verb: "measure",
      line: "double price = 4.99;",
      explain: "double holds a decimal number. char holds one character, like 'A', and bool (from stdbool.h) holds true or false." },
    { name: "Const Block", short: "const", chapter: "C Ch. 2 · Variables and Types", icon: "i-lock", verb: "fix",
      line: "const int MAX_LIVES = 3;",
      explain: "const makes a value read-only: changing MAX_LIVES later is a compile error. Constant names are usually in CAPITALS." },
    { name: "Cast Block", short: "(double)", chapter: "C Ch. 3 · Operators and Math", icon: "i-calc", verb: "convert",
      line: "double avg = (double)total / count;",
      explain: "Dividing two ints throws away the fraction. A cast like (double) converts one side first, so the answer keeps its decimals." },
    { name: "Format Block", short: "%d %s", chapter: "C Ch. 4 · printf and scanf", icon: "i-pencil", verb: "format",
      line: 'printf("%s has %d coins\\n", name, coins);',
      explain: "printf fills each % code in order: %s takes text, %d an int, %f a double, %c a character. The types must match exactly." },
    { name: "Scanf Block", short: "scanf", chapter: "C Ch. 4 · printf and scanf", icon: "i-keyboard", verb: "read",
      line: 'scanf("%d", &age);',
      explain: "scanf reads what the user types. The & gives scanf the address of age, so it can store the number there." },
    { name: "If Block", short: "if", chapter: "C Ch. 5 · Decisions", icon: "i-fork", verb: "decide",
      line: 'if (hp <= 0) { printf("Game over\\n"); }',
      explain: "if runs its block only when the test is true. In C, 0 means false and any other number means true." },
    { name: "Switch Block", short: "switch", chapter: "C Ch. 5 · Decisions", icon: "i-toggle", verb: "pick",
      line: "switch (choice) { case 1: start(); break; }",
      explain: "switch jumps to the matching case. break leaves the switch — forget it and C falls through into the next case too." },
    { name: "For Block", short: "for", chapter: "C Ch. 6 · Loops", icon: "i-repeat", verb: "count",
      line: 'for (int i = 0; i < 5; i++) { printf("%d\\n", i); }',
      explain: "A for loop has three parts: start, test and step. This one prints 0 to 4." },
    { name: "While Block", short: "while", chapter: "C Ch. 6 · Loops", icon: "i-hourglass", verb: "repeat",
      line: "while (lives > 0) { lives--; }",
      explain: "while repeats as long as its test is true. lives-- takes one away, so the loop is sure to end." },
    { name: "Array Block", short: "int a[5]", chapter: "C Ch. 7 · Arrays", icon: "i-rows", verb: "line up",
      line: "int scores[5] = {10, 20, 30, 40, 50};",
      explain: "An array is a fixed row of values, counted from 0: scores[0] is 10 and scores[4] is 50. C does not check that an index is in range." },
    { name: "Sizeof Block", short: "sizeof", chapter: "C Ch. 7 · Arrays", icon: "i-gauge", verb: "measure",
      line: "size_t n = sizeof scores / sizeof scores[0];",
      explain: "sizeof gives a size in bytes. The whole array's size divided by one item's size is the number of items." },
    { name: "String Block", short: "char[]", chapter: "C Ch. 8 · Strings", icon: "i-link", verb: "spell",
      line: 'char name[] = "Ana";',
      explain: "A C string is an array of chars ending with a hidden '\\0' (the null character), so \"Ana\" takes 4 bytes." },
    { name: "Strlen Block", short: "strlen", chapter: "C Ch. 8 · Strings", icon: "i-tag", verb: "count",
      line: "size_t len = strlen(name);",
      explain: "strlen (from string.h) counts the characters before the '\\0': strlen(\"Ana\") is 3." },
    { name: "Strcmp Block", short: "strcmp", chapter: "C Ch. 8 · Strings", icon: "i-check", verb: "compare",
      line: 'if (strcmp(a, b) == 0) { puts("same"); }',
      explain: "== compares addresses, not text. strcmp compares the letters and returns 0 when the strings match." },
    { name: "Function Block", short: "int f()", chapter: "C Ch. 9 · Functions", icon: "i-play-circle", verb: "build",
      line: "int add(int a, int b) { return a + b; }",
      explain: "The type before the name is what the function returns; each parameter has its own type. return hands the answer back." },
    { name: "Prototype Block", short: "prototype", chapter: "C Ch. 9 · Functions", icon: "i-stamp", verb: "announce",
      line: "int add(int a, int b);",
      explain: "A prototype announces a function before its body appears, so code above it can call it. Header files are full of them." },
    { name: "Pointer Block", short: "&", chapter: "C Ch. 10 · Pointers", icon: "i-point", verb: "point",
      line: "int *ptr = &score;",
      explain: "& gives the address of score; int * is a pointer to an int. ptr now knows where score lives in memory." },
    { name: "Dereference Block", short: "*ptr", chapter: "C Ch. 10 · Pointers", icon: "i-point-spark", verb: "reach",
      line: "*ptr = 42;",
      explain: "* follows the pointer to the value it points at. Writing *ptr = 42 changes score itself." },
    { name: "Array Pointer Block", short: "int *p = a", chapter: "C Ch. 11 · Pointers and Arrays", icon: "i-column", verb: "walk",
      line: "int *p = scores;",
      explain: "An array's name turns into a pointer to its first item. p[2] and *(p + 2) both reach scores[2]." },
    { name: "Struct Block", short: "struct", chapter: "C Ch. 12 · Structs", icon: "i-layers", verb: "group",
      line: "struct point { int x; int y; };",
      explain: "A struct bundles named fields into one new type. Note the semicolon after the closing brace." },
    { name: "Arrow Block", short: "->", chapter: "C Ch. 12 · Structs", icon: "i-cursor", verb: "reach",
      line: "p->hp -= 10;",
      explain: "When p is a pointer to a struct, p->hp reaches its field. It's shorthand for (*p).hp." },
    { name: "Malloc Block", short: "malloc", chapter: "C Ch. 13 · Dynamic Memory", icon: "i-plus-square", verb: "reserve",
      line: "int *nums = malloc(n * sizeof *nums);",
      explain: "malloc reserves memory while the program runs — here, room for n ints. It returns NULL if there isn't enough, so always check." },
    { name: "Free Block", short: "free", chapter: "C Ch. 13 · Dynamic Memory", icon: "i-x", verb: "release",
      line: "free(nums);",
      explain: "Every malloc needs exactly one free. Forget it and memory leaks; use the memory after freeing it and the program may crash." },
    { name: "Enum Block", short: "enum", chapter: "C Ch. 14 · Enums and the Preprocessor", icon: "i-list", verb: "name",
      line: "enum color { RED, GREEN, BLUE };",
      explain: "enum gives names to whole numbers: RED is 0, GREEN is 1, BLUE is 2. Code reads better with names than with magic numbers." },
    { name: "Fopen Block", short: "fopen", chapter: "C Ch. 15 · Files", icon: "i-file", verb: "open",
      line: 'FILE *f = fopen("save.txt", "w");',
      explain: "fopen opens a file: \"r\" to read, \"w\" to write (replacing it), \"a\" to add to the end. It returns NULL if it can't." },
    { name: "Fprintf Block", short: "fprintf", chapter: "C Ch. 15 · Files", icon: "i-pencil", verb: "write",
      line: 'fprintf(f, "%d\\n", score);',
      explain: "fprintf works like printf but writes into a file. Close the file with fclose(f) when you're done." },
    { name: "Header Block", short: "\"game.h\"", chapter: "C Ch. 16 · Building Bigger Programs", icon: "i-folder", verb: "share",
      line: '#include "game.h"',
      explain: "Quotes include your own header file; angle brackets include system ones. Headers share prototypes between .c files." }
  ];

  var H = ["#include <stdio.h>", ""];
  var chapters = [
    { title: "First Steps", chapter: "Start here · #include, main, printf, gcc", line: 'printf("Hello, world!\\n");',
      content: {
        story: ["C is one of the most important languages ever made. It was created in the early 1970s to write the Unix operating system, and today it runs inside operating systems, phones, cars, game consoles, microwaves and the interpreters of languages like Python. Learning C shows you how computers really work.",
          "Every C program starts at a function called main. #include <stdio.h> brings in printf, which prints text. Statements end with semicolons, and \\n starts a new line.",
          "C is compiled: a compiler such as gcc or clang turns main.c into a program file. Type gcc main.c -o hello, then ./hello to run it. On Windows, install a compiler with MSYS2 or Visual Studio, or use an online C compiler."],
        big: "A C program includes headers, starts at main, prints with printf, and is compiled before it runs.",
        caption: "gcc turns main.c into a program; the program starts at main and says hello. Tap Play.",
        demo: ["$ gcc main.c -o hello", "$ ./hello", "main() runs", "Hello, world!"]
      },
      deep: {
        more: ["main returns an int: 0 means “everything went fine” to the system that started the program. Other numbers signal errors.",
          "Turn on the compiler's warnings — gcc -Wall -Wextra — and treat each one as a bug report. Every program in this track compiles with no warnings at all."],
        ex: { code: src(H.concat(["int main(void) {", "    // My first C program", "    printf(\"Hello, world!\\n\");", "    printf(\"I am learning C.\\n\");", "    printf(\"%d\\n\", 2 + 3);", "    return 0;", "}"])),
          walk: ["Line 1: bring in the standard input/output tools.", "Line 3: the program starts at main.", "Line 4: a comment, skipped by the compiler.", "Lines 5–6: two lines of text.", "Line 7: %d is filled with 2 + 3: 5.", "Line 8: return 0 tells the system all went well."] },
        mistake: "Forgetting \\n. printf(\"Hi\"); printf(\"there\"); prints Hithere on one line. C only starts a new line when you ask."
      } },
    { title: "Variables and Types", chapter: "Typed boxes · int, double, char, bool, const", line: "int score = 0;",
      content: {
        story: ["A variable is a named box in memory, and in C you always state its type first: int for whole numbers, double for decimals, char for a single character in single quotes, and bool (after #include <stdbool.h>) for true or false.",
          "Give every variable a value when you make it: int score = 0;. A variable that's never set holds whatever leftover bits were in that memory — reading it is a classic C bug.",
          "const makes a value read-only: const int MAX_LIVES = 3;. Each type has a size in bytes; sizeof(int) is usually 4, which holds numbers up to about 2.1 billion."],
        big: "Every C variable has a type stated up front; set it when you make it, and use const for values that must not change.",
        caption: "Four labeled boxes in a row of memory, each a different size. Tap Play.",
        demo: ["int score = 0", "double price = 4.99", "char grade = 'A'", "bool alive = true"]
      },
      deep: {
        more: ["There are more sizes: short, long and long long for whole numbers, float for less precise decimals, and unsigned versions that can't be negative but go twice as high.",
          "A char is really a small number: 'A' is 65 in ASCII. printf(\"%c\", 65) prints A."],
        ex: { code: src(["#include <stdbool.h>", "#include <stdio.h>", "", "int main(void) {", "    int score = 0;", "    double price = 4.99;", "    char grade = 'A';", "    bool alive = true;", "    const int MAX_LIVES = 5;", "    score = score + 10;", "    printf(\"%d %.2f %c %d\\n\", score, price, grade, alive);", "    printf(\"%d lives, %zu bytes per int\\n\", MAX_LIVES, sizeof(int));", "    printf(\"%c is %d\\n\", grade, grade);", "    return 0;", "}"]),
          walk: ["Lines 1–2: stdbool.h gives C its bool, true and false.", "Lines 5–9: one variable of each everyday type, plus a constant.", "Line 10: score becomes 10.", "Line 11: 10 4.99 A 1 — true prints as 1.", "Line 12: 5 lives, 4 bytes per int (%zu prints a size).", "Line 13: A is 65 — a char is a number underneath."] },
        mistake: "Using a variable before setting it: int total; total += 5; adds to garbage. Always start with a value: int total = 0;."
      } },
    { title: "Operators and Math", chapter: "Calculating · + - * / %, casts, math.h", line: "double avg = (double)total / count;",
      content: {
        story: ["C does math with + - * / and % (the remainder). Dividing two ints gives an int, rounded toward zero: 7 / 2 is 3, and 7 % 2 is 1. If either side is a double, the answer is a double: 7.0 / 2 is 3.5.",
          "A cast converts a value: (double)total turns an int into a double for one calculation. Shortcuts change variables in place: hp -= 30, score *= 2, lives++ and lives--.",
          "math.h has sqrt, pow, floor, ceil and fabs. On Linux, link the math library by adding -lm when compiling."],
        big: "int division drops the fraction, % gives the remainder, and a cast like (double) keeps the decimals.",
        caption: "Two ints divide with a remainder left over, then again with a cast. Tap Play.",
        demo: ["7 / 2 → 3", "7 % 2 → 1", "(double)7 / 2 → 3.5", "sqrt(16.0) → 4"]
      },
      deep: {
        more: ["Signed integer overflow is undefined behavior in C: if an int goes past its maximum, the program is no longer guaranteed to do anything sensible. Use a bigger type, or check before you add.",
          "x++ and ++x both add one; they differ only when used inside a bigger expression. Keep them on their own line and the difference never matters."],
        ex: { code: src(["#include <math.h>", "#include <stdio.h>", "", "int main(void) {", "    printf(\"%d\\n\", 7 / 2);", "    printf(\"%d\\n\", 7 % 2);", "    printf(\"%.1f\\n\", 7.0 / 2);", "    int coins = 10;", "    int players = 4;", "    printf(\"%.2f\\n\", (double)coins / players);", "    printf(\"%.0f %.0f\\n\", sqrt(16.0), pow(2, 10));", "    int hp = 100;", "    hp -= 30;", "    hp++;", "    printf(\"%d\\n\", hp);", "    return 0;", "}"]),
          walk: ["Line 5: int division: 3.", "Line 6: the remainder: 1.", "Line 7: a double on one side: 3.5.", "Lines 8–10: cast first for 2.50.", "Line 11: 4 1024 — %.0f shows no decimals.", "Lines 12–15: 100 − 30 + 1 = 71."] },
        mistake: "Writing double avg = total / count; with two ints. The division happens in ints first, so 7 / 2 gives 3.0. Cast before dividing."
      } },
    { title: "printf and scanf", chapter: "Talking · format codes, width, scanf, &", line: 'printf("%s has %d coins\\n", name, coins);',
      content: {
        story: ["printf fills each format code with the next value: %d for int, %f for double, %c for char, %s for a string, %zu for a size, %x for hexadecimal, and %% for a percent sign. The codes and types must match — the compiler warns when they don't.",
          "Codes take options: %.2f shows two decimal places, %5d pads a number to five characters, %-8s pads text on the right. That's how you line up tables.",
          "scanf reads typed input: scanf(\"%d\", &age); stores a number in age. The & passes age's address. scanf returns how many values it read, so check it — users type unexpected things."],
        big: "printf's format codes must match their values; %.2f and %5d control layout; scanf needs & and a check of its result.",
        caption: "Values slide into the gaps of a sentence, lined up in neat columns. Tap Play.",
        demo: ["printf(\"%-6s %5d\\n\", …)", "Ana       120", "scanf(\"%d\", &age)", "returns 1 if it worked"]
      },
      deep: {
        more: ["fgets reads a whole line of text safely, with a size limit; many programmers prefer fgets followed by sscanf or strtol over scanf.",
          "puts(\"text\") prints a string and a newline — a quick alternative to printf when there's nothing to fill in."],
        ex: { code: src(H.concat(["int main(void) {", "    char name[] = \"Ana\";", "    int coins = 42;", "    printf(\"%s has %d coins\\n\", name, coins);", "    printf(\"[%5d] [%-5d] [%.3f] [%x] [%c] 100%%\\n\", 42, 42, 3.14159, 255, 'Z');", "    int age = 0;", "    printf(\"How old are you? \");", "    if (scanf(\"%d\", &age) == 1) {", "        printf(\"Next year you will be %d\\n\", age + 1);", "    } else {", "        printf(\"\\nThat was not a number.\\n\");", "    }", "    return 0;", "}"])),
          walk: ["Line 6: Ana has 42 coins.", "Line 7: [   42] [42   ] [3.142] [ff] [Z] 100%.", "Lines 8–14: ask for a number; scanf returns 1 when it reads one.", "Here no one types anything, so the else branch prints That was not a number."] },
        mistake: "Forgetting the & in scanf: scanf(\"%d\", age) passes the value instead of the address, and the program may crash. Strings are the exception — an array's name is already an address."
      } },
    { title: "Decisions", chapter: "Choosing · if, else, switch, ?:", line: 'if (hp <= 0) { printf("Game over\\n"); }',
      content: {
        story: ["if runs code only when a test is true: if (hp <= 0) { … }. Add else if for more tests and else for the rest. Tests use == (equal), != (not equal), < > <= >=, and combine with && (and), || (or) and ! (not).",
          "C has no special true/false type underneath: 0 means false and every other number means true. That's why if (lives) works — but it's clearer to write if (lives > 0).",
          "switch jumps straight to a matching case of an integer value. Each case needs a break, or C keeps running into the next case. The ternary operator picks between two values: int best = a > b ? a : b;."],
        big: "if/else choose a path, 0 is false and anything else is true, and switch needs a break after each case.",
        caption: "A path forks at hp <= 0: one way says Game over, the other keeps going. Tap Play.",
        demo: ["hp = 0", "if (hp <= 0) → true", "Game over", "else skipped"]
      },
      deep: {
        more: ["Leaving out break on purpose — falling through — lets several cases share code. Write a comment when you mean it; modern compilers warn about accidental fall-through.",
          "Always use braces, even for one line. if (x) a(); b(); runs b() every time, whatever the indentation suggests."],
        ex: { code: src(H.concat(["int main(void) {", "    int hp = 0;", "    if (hp <= 0) {", "        printf(\"Game over\\n\");", "    } else if (hp < 20) {", "        printf(\"Careful!\\n\");", "    } else {", "        printf(\"Keep going\\n\");", "    }", "    int choice = 2;", "    switch (choice) {", "    case 1:", "        printf(\"Start game\\n\");", "        break;", "    case 2:", "        printf(\"Load game\\n\");", "        break;", "    default:", "        printf(\"Quit\\n\");", "        break;", "    }", "    int a = 7, b = 3;", "    int best = a > b ? a : b;", "    printf(\"Best: %d\\n\", best);", "    return 0;", "}"])),
          walk: ["Lines 5–11: hp is 0, so Game over.", "Lines 12–23: choice 2 jumps to case 2: Load game, then break leaves.", "Lines 24–26: the ternary picks the bigger value: Best: 7."] },
        mistake: "Writing if (x = 5) instead of if (x == 5). One = assigns 5 to x, which counts as true, so the block always runs. -Wall warns about it."
      } },
    { title: "Loops", chapter: "Repeating · for, while, do-while, break, continue", line: 'for (int i = 0; i < 5; i++) { printf("%d\\n", i); }',
      content: {
        story: ["A for loop has three parts in its brackets: a start (int i = 0), a test (i < 5) and a step (i++). It runs while the test is true: 0, 1, 2, 3, 4.",
          "while (test) { … } repeats as long as the test is true. do { … } while (test); runs the body first and tests afterwards, so it always runs at least once — handy for menus.",
          "break leaves a loop immediately, and continue skips to the next round."],
        big: "for counts with start, test and step; while repeats while true; do-while runs at least once; break and continue steer.",
        caption: "A counter goes round a track 0 to 4 and stops when the test fails. Tap Play.",
        demo: ["for (int i = 0; i < 5; i++)", "0 1 2 3 4", "do { … } while (again);", "break → out"]
      },
      deep: {
        more: ["The classic off-by-one: i <= 5 runs six times (0 to 5). Counting from 0 with < is the C habit, because arrays start at 0.",
          "A loop whose test never becomes false runs forever. Make sure something in the loop moves toward the end."],
        ex: { code: src(H.concat(["int main(void) {", "    for (int i = 0; i < 3; i++) {", "        printf(\"lap %d\\n\", i);", "    }", "    int lives = 3;", "    while (lives > 0) {", "        lives--;", "    }", "    printf(\"lives: %d\\n\", lives);", "    int tries = 0;", "    do {", "        tries++;", "    } while (tries < 0);", "    printf(\"tries: %d\\n\", tries);", "    for (int n = 1; n <= 10; n++) {", "        if (n % 2 == 0) {", "            continue;", "        }", "        if (n > 7) {", "            break;", "        }", "        printf(\"%d \", n);", "    }", "    printf(\"\\n\");", "    return 0;", "}"])),
          walk: ["Lines 4–6: lap 0, lap 1, lap 2.", "Lines 7–11: lives: 0.", "Lines 12–16: the test is false at once, but do-while still ran once: tries: 1.", "Lines 17–25: skip even numbers, stop past 7: 1 3 5 7."] },
        mistake: "Putting a semicolon after the loop's brackets: for (int i = 0; i < 5; i++); { … } loops over nothing, then runs the block once."
      } },
    { title: "Arrays", chapter: "Rows · fixed arrays, indexing, sizeof, bounds", line: "int scores[5] = {10, 20, 30, 40, 50};",
      content: {
        story: ["An array is a fixed-size row of values of one type: int scores[5] = {10, 20, 30, 40, 50};. Positions count from 0, so scores[0] is 10 and scores[4] is 50.",
          "The size never changes. To find how many items an array holds, divide its total size by one item's size: sizeof scores / sizeof scores[0].",
          "C does not check that an index is in range. scores[5] reads past the end into whatever memory comes next — a bug that can crash the program or, worse, quietly give wrong answers. Keep every index between 0 and length - 1."],
        big: "Arrays are fixed rows counted from 0; sizeof finds their length; and C never checks the index for you.",
        caption: "Five numbered boxes in a row; a cursor walks 0 to 4 and stops before the edge. Tap Play.",
        demo: ["int scores[5]", "scores[0] → 10", "scores[4] → 50", "scores[5] → out of bounds!"]
      },
      deep: {
        more: ["If you give fewer values than the size, the rest are 0: int counts[10] = {0}; makes ten zeros.",
          "Two-dimensional arrays make grids: int board[3][3]; and board[1][2] is row 1, column 2."],
        ex: { code: src(H.concat(["int main(void) {", "    int scores[5] = {10, 20, 30, 40, 50};", "    size_t n = sizeof scores / sizeof scores[0];", "    scores[0] = 15;", "    int total = 0;", "    for (size_t i = 0; i < n; i++) {", "        total += scores[i];", "    }", "    printf(\"%zu scores, total %d\\n\", n, total);", "    int counts[4] = {0};", "    counts[2] = 7;", "    for (int i = 0; i < 4; i++) {", "        printf(\"%d \", counts[i]);", "    }", "    printf(\"\\n\");", "    int board[2][3] = {{1, 2, 3}, {4, 5, 6}};", "    printf(\"%d\\n\", board[1][2]);", "    return 0;", "}"])),
          walk: ["Lines 4–5: five scores, so n is 5.", "Line 6: change the first one.", "Lines 7–11: 5 scores, total 155.", "Lines 12–17: unlisted values start at 0: 0 0 7 0.", "Lines 18–19: row 1, column 2 of a grid: 6."] },
        mistake: "Looping with i <= n. The last round reads scores[n], one past the end. Use i < n."
      } },
    { title: "Strings", chapter: "Text · char arrays, '\\0', string.h", line: 'char name[] = "Ana";',
      content: {
        story: ["C has no string type. A string is an array of chars ending with the null character '\\0', which marks where the text stops. char name[] = \"Ana\"; makes an array of 4 chars: A, n, a and '\\0'.",
          "string.h has the tools: strlen counts characters, strcmp compares two strings (0 means equal), strcpy copies, strcat joins. ctype.h has toupper, tolower, isdigit and isalpha for single characters.",
          "Arrays can't grow, so copying or joining text into one that's too small writes past its end. Prefer snprintf, which is told the size and never goes over."],
        big: "A C string is a char array ending in '\\0'; string.h measures and compares it; snprintf builds text safely.",
        caption: "Letters sit in boxes, with a little stop sign '\\0' after the last one. Tap Play.",
        demo: ["\"Ana\" → A n a \\0", "strlen → 3", "strcmp(a, b) == 0 → same", "snprintf(buf, sizeof buf, …)"]
      },
      deep: {
        more: ["== on strings compares their addresses, not their letters, so two different arrays holding \"Ana\" aren't ==. Always use strcmp.",
          "A string literal like \"Ana\" used through a char * pointer can't be changed. Copy it into an array first if you want to edit it."],
        ex: { code: src(["#include <ctype.h>", "#include <stdio.h>", "#include <string.h>", "", "int main(void) {", "    char name[] = \"Ana\";", "    printf(\"%s has %zu letters and takes %zu bytes\\n\", name, strlen(name), sizeof name);", "    char greeting[32];", "    snprintf(greeting, sizeof greeting, \"Hi, %s!\", name);", "    printf(\"%s\\n\", greeting);", "    if (strcmp(name, \"Ana\") == 0) {", "        printf(\"Found Ana\\n\");", "    }", "    for (size_t i = 0; name[i] != '\\0'; i++) {", "        name[i] = (char)toupper((unsigned char)name[i]);", "    }", "    printf(\"%s\\n\", name);", "    return 0;", "}"]),
          walk: ["Line 7: Ana has 3 letters and takes 4 bytes — one for '\\0'.", "Lines 8–10: snprintf builds Hi, Ana! and never writes past 32 bytes.", "Lines 11–13: strcmp returns 0 for equal strings: Found Ana.", "Lines 14–17: walk letters until '\\0', making each a capital: ANA."] },
        mistake: "Making an array too small: char word[3] = \"Ana\"; leaves no room for '\\0', so printf keeps reading past the end. Leave the size out, or count one extra."
      } },
    { title: "Functions", chapter: "Machines · parameters, return, prototypes, scope", line: "int add(int a, int b) { return a + b; }",
      content: {
        story: ["A function is a named machine: int add(int a, int b) takes two ints and returns one. void means a function returns nothing. A function must be declared before it's used — either defined above, or announced by a prototype like int add(int a, int b);.",
          "C passes arguments by value: the function gets copies. Changing a parameter inside doesn't change the caller's variable. (Pointers, next chapter, are how a function can change things outside.)",
          "Variables made inside a function exist only while it runs. That's scope: two functions can each have their own i without clashing."],
        big: "Functions take typed copies of their arguments and return one value; prototypes announce them before use.",
        caption: "A machine with two input slots: 2 and 3 go in, 5 comes out. Tap Play.",
        demo: ["int add(int a, int b);", "add(2, 3)", "a = 2, b = 3 (copies)", "returns 5"]
      },
      deep: {
        more: ["static before a function makes it private to its file — other .c files can't call it. It's a good default for helpers.",
          "C has no default arguments and no overloading: every function name must be different."],
        ex: { code: src(H.concat(["int add(int a, int b);", "void greet(void);", "", "void try_to_change(int x) {", "    x = 99;", "    printf(\"inside: x is %d\\n\", x);", "}", "", "int main(void) {", "    printf(\"%d\\n\", add(2, 3));", "    greet();", "    int n = 5;", "    try_to_change(n);", "    printf(\"n is still %d\\n\", n);", "    return 0;", "}", "", "int add(int a, int b) { return a + b; }", "", "void greet(void) { printf(\"Hello from a function\\n\"); }"])),
          walk: ["Lines 3–4: prototypes let main call functions defined lower down.", "Lines 6–9: x is a copy: inside: x is 99.", "Line 12: 5.", "Line 13: Hello from a function.", "Lines 14–16: but outside, n is still 5.", "Lines 20 and 22: the full definitions."] },
        mistake: "Calling a function before C has seen it. Without a prototype or definition above the call, the compiler stops with “implicit declaration of function.”"
      } },
    { title: "Pointers", chapter: "Addresses · &, *, NULL, changing through a pointer", line: "int *ptr = &score;",
      content: {
        story: ["Every variable lives at an address in memory. & gives that address: &score. A pointer is a variable that holds an address: int *ptr = &score; reads as “ptr is a pointer to an int, holding score's address.”",
          "* follows a pointer to the value it points at. *ptr = 42; changes score itself. That's how a function can change its caller's variables: pass &score, and the function writes through *.",
          "NULL is the pointer that points nowhere. Following a NULL pointer crashes the program (a segmentation fault), so check before using any pointer that might be NULL."],
        big: "& takes an address, * follows it, and passing addresses lets functions change their caller's variables.",
        caption: "A signpost labeled ptr points at the box score; change through the sign and the box changes. Tap Play.",
        demo: ["int score = 10;", "int *ptr = &score;", "*ptr = 42;", "score → 42"]
      },
      deep: {
        more: ["%p prints an address. The exact numbers change every run — the operating system places programs at random addresses for safety.",
          "Pointers are what make C powerful and dangerous: they can point anywhere. Most C bugs are pointer bugs, which is why tools like AddressSanitizer exist."],
        ex: { code: src(H.concat(["void swap(int *a, int *b) {", "    int temp = *a;", "    *a = *b;", "    *b = temp;", "}", "", "int main(void) {", "    int score = 10;", "    int *ptr = &score;", "    *ptr = 42;", "    printf(\"score is %d\\n\", score);", "    int left = 3, right = 8;", "    swap(&left, &right);", "    printf(\"left %d, right %d\\n\", left, right);", "    int *nothing = NULL;", "    if (nothing == NULL) {", "        printf(\"nothing points nowhere\\n\");", "    }", "    return 0;", "}"])),
          walk: ["Lines 3–7: swap reaches the caller's variables through pointers.", "Lines 10–13: change score through ptr: score is 42.", "Lines 14–16: pass addresses, and swap really swaps: left 8, right 3.", "Lines 17–20: check for NULL before using a pointer."] },
        mistake: "Returning the address of a local variable: int *f(void) { int x = 5; return &x; }. x disappears when f returns, so the pointer dangles. -Wall warns about it."
      } },
    { title: "Pointers and Arrays", chapter: "Walking memory · decay, pointer arithmetic, passing arrays", line: "int *p = scores;",
      content: {
        story: ["An array's name turns into a pointer to its first item when used in an expression: int *p = scores;. Adding to a pointer moves it by whole items: p + 2 points at scores[2], and *(p + 2) is the same as p[2].",
          "When you pass an array to a function, only that pointer is passed — the function can't tell how long the array is. So C functions take the length as a second parameter: int sum(const int *items, size_t n).",
          "const in const int *items promises the function won't change the items. Strings work the same way: a function taking const char *text can walk it until '\\0'."],
        big: "Arrays become pointers to their first item, so functions receive a pointer plus a length; p[i] means *(p + i).",
        caption: "A pointer hops along an array box by box: p, p + 1, p + 2. Tap Play.",
        demo: ["int *p = scores;", "*p → 10", "*(p + 2) → 30", "sum(scores, 5)"]
      },
      deep: {
        more: ["Inside a function, sizeof items gives the size of a pointer (often 8), not of the array. That's why the length has to be passed in.",
          "Pointer subtraction gives a distance in items: if end points at scores[4] and p at scores[1], end - p is 3."],
        ex: { code: src(H.concat(["int sum(const int *items, size_t n) {", "    int total = 0;", "    for (size_t i = 0; i < n; i++) {", "        total += items[i];", "    }", "    return total;", "}", "", "size_t count_vowels(const char *text) {", "    size_t found = 0;", "    for (const char *c = text; *c != '\\0'; c++) {", "        if (*c == 'a' || *c == 'e' || *c == 'i' || *c == 'o' || *c == 'u') {", "            found++;", "        }", "    }", "    return found;", "}", "", "int main(void) {", "    int scores[] = {10, 20, 30, 40};", "    int *p = scores;", "    printf(\"%d %d %d\\n\", *p, *(p + 2), p[3]);", "    printf(\"sum: %d\\n\", sum(scores, 4));", "    printf(\"vowels: %zu\\n\", count_vowels(\"pointers are arrows\"));", "    return 0;", "}"])),
          walk: ["Lines 3–9: sum gets a pointer and a length.", "Lines 11–19: walk a string with a pointer until '\\0'.", "Lines 23–24: 10 30 40.", "Line 25: sum: 100.", "Line 26: vowels: 7."] },
        mistake: "Writing sizeof items / sizeof items[0] inside a function to get an array's length. It measures the pointer, not the array. Pass the length in."
      } },
    { title: "Structs", chapter: "Bundles · struct, typedef, ., ->", line: "struct point { int x; int y; };",
      content: {
        story: ["A struct groups related values: struct hero { char name[16]; int hp; int level; };. Make one with values in braces, and reach a field with a dot: ana.hp.",
          "Designated initializers name the fields: struct hero ana = {.name = \"Ana\", .hp = 100};. Any field left out becomes 0.",
          "Functions usually take a pointer to a struct, so they can change it without copying it. With a pointer, use the arrow: h->hp -= 10; means (*h).hp -= 10. typedef gives a type a shorter name."],
        big: "Structs bundle fields; . reaches a field, -> reaches it through a pointer, and typedef shortens the type's name.",
        caption: "A blueprint labeled hero fills in Ana's name, health and level. Tap Play.",
        demo: ["struct hero ana = { … }", "ana.hp → 100", "hurt(&ana, 30)", "h->hp → 70"]
      },
      deep: {
        more: ["Structs can be copied with = and passed by value, but large ones are usually passed by pointer to save copying.",
          "Arrays of structs are a simple database: struct hero team[3] holds three heroes, and team[1].hp reaches the second one's health."],
        ex: { code: src(H.concat(["typedef struct {", "    char name[16];", "    int hp;", "    int level;", "} Hero;", "", "void hurt(Hero *h, int damage) {", "    h->hp -= damage;", "    if (h->hp < 0) {", "        h->hp = 0;", "    }", "}", "", "int main(void) {", "    Hero ana = {.name = \"Ana\", .hp = 100, .level = 1};", "    hurt(&ana, 30);", "    ana.level++;", "    printf(\"%s: %d HP, level %d\\n\", ana.name, ana.hp, ana.level);", "    Hero team[2] = {{\"Leo\", 80, 2}, {\"Mia\", 50, 3}};", "    for (int i = 0; i < 2; i++) {", "        printf(\"%s has %d HP\\n\", team[i].name, team[i].hp);", "    }", "    return 0;", "}"])),
          walk: ["Lines 3–7: typedef names the struct type Hero.", "Lines 9–14: -> changes the hero through a pointer, never below 0.", "Lines 17–20: Ana: 70 HP, level 2.", "Lines 21–24: an array of heroes: Leo has 80 HP, Mia has 50 HP."] },
        mistake: "Forgetting the semicolon after a struct's closing brace. The error then appears on a later line, which is confusing — check the line before."
      } },
    { title: "Dynamic Memory", chapter: "Memory you manage · malloc, calloc, realloc, free", line: "int *nums = malloc(n * sizeof *nums);",
      content: {
        story: ["Arrays have a fixed size chosen when you write the code. When the size is only known while running, ask for memory with malloc: int *nums = malloc(n * sizeof *nums); reserves room for n ints on the heap.",
          "malloc returns NULL when memory runs out — always check. calloc does the same but fills the memory with zeros, and realloc grows or shrinks a block, possibly moving it.",
          "Every block you get must be given back exactly once with free. Forgetting is a memory leak; using a block after freeing it, or freeing it twice, is a serious bug. Tools like AddressSanitizer (gcc -fsanitize=address) catch these mistakes."],
        big: "malloc reserves memory at run time; check for NULL, and free every block exactly once.",
        caption: "A program borrows a shelf of memory, fills it, and hands it back. Tap Play.",
        demo: ["int *nums = malloc(n * sizeof *nums)", "if (nums == NULL) …", "nums[i] = …", "free(nums)"]
      },
      deep: {
        more: ["Writing sizeof *nums instead of sizeof(int) keeps the code right even if nums later changes type.",
          "When realloc fails it returns NULL and leaves the old block alone, so store its result in a new pointer first, or the old block leaks."],
        ex: { code: src(["#include <stdio.h>", "#include <stdlib.h>", "", "int main(void) {", "    size_t n = 4;", "    int *nums = malloc(n * sizeof *nums);", "    if (nums == NULL) {", "        return 1;", "    }", "    for (size_t i = 0; i < n; i++) {", "        nums[i] = (int)(i * i);", "    }", "    int *bigger = realloc(nums, 2 * n * sizeof *nums);", "    if (bigger == NULL) {", "        free(nums);", "        return 1;", "    }", "    nums = bigger;", "    nums[n] = 99;", "    printf(\"%d %d %d\\n\", nums[1], nums[3], nums[4]);", "    int *zeros = calloc(3, sizeof *zeros);", "    if (zeros != NULL) {", "        printf(\"%d %d %d\\n\", zeros[0], zeros[1], zeros[2]);", "    }", "    free(zeros);", "    free(nums);", "    return 0;", "}"]),
          walk: ["Lines 5–9: room for 4 ints, checked for NULL.", "Lines 10–12: fill it with squares.", "Lines 13–18: grow it safely with realloc.", "Lines 19–20: 1 9 99.", "Lines 21–24: calloc gives zeros: 0 0 0.", "Lines 25–26: give both blocks back."] },
        mistake: "Forgetting free. Small programs get away with it, but a long-running game or server that leaks a little each second eventually runs out of memory."
      } },
    { title: "Enums and the Preprocessor", chapter: "Names for numbers · enum, #define, typedef", line: "enum color { RED, GREEN, BLUE };",
      content: {
        story: ["enum gives names to a set of whole numbers: enum color { RED, GREEN, BLUE }; makes RED 0, GREEN 1 and BLUE 2. Names make code readable — if (light == RED) beats if (light == 0).",
          "Lines starting with # are handled by the preprocessor before compiling. #include pastes in a file, and #define MAX_PLAYERS 4 replaces the word MAX_PLAYERS with 4 everywhere after it.",
          "#define is simple text replacement, so it has no type and ignores scope. Modern C prefers enum or const variables where they work, and keeps #define for things they can't do."],
        big: "enum names a set of numbers, #define replaces text before compiling, and typedef names a type.",
        caption: "Traffic-light colors get names; the preprocessor swaps names for numbers before the compiler sees them. Tap Play.",
        demo: ["enum light { RED, AMBER, GREEN }", "RED → 0, GREEN → 2", "#define MAX_PLAYERS 4", "MAX_PLAYERS → 4"]
      },
      deep: {
        more: ["You can choose enum values: enum { KB = 1024, MB = 1024 * 1024 };. Values that aren't set continue counting from the last one.",
          "Macros with arguments, like #define SQUARE(x) ((x) * (x)), need brackets everywhere; without them, SQUARE(1 + 2) becomes 1 + 2 * 1 + 2."],
        ex: { code: src(H.concat(["#define MAX_PLAYERS 4", "#define SQUARE(x) ((x) * (x))", "", "enum light { RED, AMBER, GREEN };", "", "const char *light_name(enum light l) {", "    switch (l) {", "    case RED:", "        return \"stop\";", "    case AMBER:", "        return \"get ready\";", "    case GREEN:", "        return \"go\";", "    }", "    return \"?\";", "}", "", "int main(void) {", "    enum light now = GREEN;", "    printf(\"%d means %s\\n\", now, light_name(now));", "    printf(\"Up to %d players\\n\", MAX_PLAYERS);", "    printf(\"%d\\n\", SQUARE(1 + 2));", "    return 0;", "}"])),
          walk: ["Lines 3–4: plain text replacements, done before compiling.", "Line 6: RED, AMBER and GREEN are 0, 1 and 2.", "Lines 8–18: a switch over every enum value.", "Lines 21–22: 2 means go.", "Line 23: Up to 4 players.", "Line 24: the brackets in SQUARE make it 9."] },
        mistake: "Putting a semicolon at the end of a #define: #define MAX 4; pastes “4;” everywhere, causing strange errors far from the real mistake."
      } },
    { title: "Files", chapter: "Saving · fopen, fprintf, fgets, fclose", line: 'FILE *f = fopen("save.txt", "w");',
      content: {
        story: ["Files let a program remember things after it ends. fopen opens one and returns a FILE pointer: \"w\" writes (replacing what was there), \"a\" appends to the end, and \"r\" reads.",
          "fopen returns NULL when it can't open the file — a missing file, a wrong folder, no permission — so check every time. fprintf writes like printf, and fgets reads one line at a time.",
          "fclose finishes the job: it saves anything still waiting in memory and frees the FILE. Every file you open should be closed."],
        big: "fopen opens a file (check for NULL), fprintf writes, fgets reads a line, and fclose saves and closes.",
        caption: "A save file opens, two scores are written in, then read back line by line. Tap Play.",
        demo: ["fopen(\"scores.txt\", \"w\")", "fprintf(f, \"Ana 120\\n\")", "fopen(… \"r\") + fgets", "fclose(f)"]
      },
      deep: {
        more: ["perror(\"scores.txt\") prints a readable reason after a failure, such as “No such file or directory.”",
          "Text mode is right for words and numbers. For raw bytes, like images, use \"rb\" and \"wb\" with fread and fwrite."],
        ex: { code: src(H.concat(["int main(void) {", "    FILE *out = fopen(\"scores.txt\", \"w\");", "    if (out == NULL) {", "        perror(\"scores.txt\");", "        return 1;", "    }", "    fprintf(out, \"Ana %d\\n\", 120);", "    fprintf(out, \"Leo %d\\n\", 95);", "    fclose(out);", "", "    FILE *in = fopen(\"scores.txt\", \"r\");", "    if (in == NULL) {", "        perror(\"scores.txt\");", "        return 1;", "    }", "    char line[64];", "    int count = 0;", "    while (fgets(line, sizeof line, in) != NULL) {", "        count++;", "        printf(\"line %d: %s\", count, line);", "    }", "    fclose(in);", "    return 0;", "}"])),
          walk: ["Lines 4–8: open for writing, with a check.", "Lines 9–11: write two lines and close the file.", "Lines 13–17: open the same file for reading.", "Lines 20–23: fgets reads a line (keeping its \\n) until the end: line 1: Ana 120, line 2: Leo 95.", "Line 24: close it."] },
        mistake: "Not checking fopen. If the file can't be opened, f is NULL and the next fprintf crashes the program."
      } },
    { title: "Building Bigger Programs", chapter: "Real projects · .h headers, include guards, static, make", line: '#include "game.h"',
      content: {
        story: ["Big C programs are split into many .c files. Each one is compiled separately and then linked together: gcc main.c score.c -o game.",
          "A header file (score.h) holds the prototypes, types and constants that other files need. Wrap it in an include guard — #ifndef SCORE_H, #define SCORE_H, … #endif — so including it twice is harmless. Use quotes for your own headers: #include \"score.h\".",
          "Mark helpers static to keep them private to their file. A Makefile tells the make tool how to rebuild only what changed. Always compile with warnings on: gcc -Wall -Wextra -std=c17."],
        big: "Split code into .c files with .h headers, guard the headers, keep helpers static, and let make rebuild what changed.",
        caption: "Three files snap together: score.h describes, score.c does, main.c uses. Tap Play.",
        demo: ["score.h: int add_points(int, int);", "score.c: the definitions", "main.c: #include \"score.h\"", "$ gcc main.c score.c -o game"]
      },
      deep: {
        more: ["A header should contain declarations, not function bodies; definitions in a header that's included twice cause “multiple definition” link errors.",
          "Build tools like CMake and Meson generate the build commands for big projects on every operating system."],
        ex: { code: src(H.concat(["// In a bigger program these two lines would live in score.h:", "#define MAX_SCORE 9999", "int add_points(int score, int points);", "", "// A static helper is private to this file.", "static int clamp(int value, int low, int high) {", "    if (value < low) {", "        return low;", "    }", "    if (value > high) {", "        return high;", "    }", "    return value;", "}", "", "int add_points(int score, int points) { return clamp(score + points, 0, MAX_SCORE); }", "", "int main(void) {", "    printf(\"%d\\n\", add_points(100, 50));", "    printf(\"%d\\n\", add_points(9990, 50));", "    printf(\"%d\\n\", add_points(10, -50));", "    return 0;", "}"])),
          walk: ["Lines 3–5: what a header would share: a constant and a prototype.", "Lines 7–16: static keeps clamp private to this file.", "Line 18: the public function.", "Lines 21–23: 150, then capped at 9999, then not below 0."] },
        mistake: "Defining a variable in a header, like int lives = 3;. Every .c file that includes it gets its own copy, and the linker reports “multiple definition of lives.” Put extern int lives; in the header and the definition in one .c file."
      } }
  ];

  var shelves = [
    { title: "Standard Library Field Guide", chapter: "Beyond the basics · C shelf", line: ["#include <stdlib.h>", "#include <string.h>"],
      content: {
        story: ["C's standard library is small but everywhere. stdio.h handles input, output and files; stdlib.h has memory (malloc, free), number conversion (strtol, atoi), random numbers (rand) and sorting (qsort); string.h has string and memory tools; ctype.h classifies characters; math.h does math; time.h tells the time.",
          "qsort sorts any array: you give it the array, the count, the item size and a comparison function. strtol converts text to a number and tells you where it stopped, so you can spot bad input.",
          "Read the manual pages: man 3 printf in a terminal, or cppreference.com in a browser."],
        big: "stdio, stdlib, string, ctype, math and time cover most needs — qsort sorts and strtol converts safely.",
        caption: "A workshop wall of labeled toolboxes, each one #include away. Tap Play.",
        demo: ["qsort(a, n, sizeof a[0], cmp)", "strtol(\"42abc\", &end, 10)", "isdigit('7')", "time(NULL)"]
      },
      deep: {
        more: ["rand() is fine for games but not for anything secret. Seed it once with srand((unsigned)time(NULL)) to get different numbers each run.",
          "memset fills memory with one byte value and memcpy copies blocks of memory — both from string.h."],
        ex: { code: src(["#include <ctype.h>", "#include <stdio.h>", "#include <stdlib.h>", "#include <string.h>", "", "int compare_ints(const void *a, const void *b) {", "    int x = *(const int *)a, y = *(const int *)b;", "    return (x > y) - (x < y);", "}", "", "int main(void) {", "    int scores[] = {40, 75, 60, 15};", "    qsort(scores, 4, sizeof scores[0], compare_ints);", "    printf(\"%d %d %d %d\\n\", scores[0], scores[1], scores[2], scores[3]);", "    char *end;", "    long n = strtol(\"42abc\", &end, 10);", "    printf(\"%ld, then '%s'\\n\", n, end);", "    printf(\"%d %d\\n\", isdigit('7') != 0, isalpha('7') != 0);", "    char copy[8];", "    memcpy(copy, \"hi!\", 4);", "    printf(\"%s %zu\\n\", copy, strlen(copy));", "    return 0;", "}"]),
          walk: ["Lines 6–9: a comparison that returns −1, 0 or 1.", "Lines 13–14: 15 40 60 75.", "Lines 15–17: strtol stops at the first non-digit: 42, then 'abc'.", "Line 18: 1 0 — 7 is a digit, not a letter.", "Lines 19–21: memcpy copies 4 bytes, '\\0' included: hi! 3."] },
        mistake: "Using atoi on user input. atoi(\"abc\") quietly returns 0, so you can't tell bad input from a real 0. strtol tells you."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · C shelf", line: ["Segmentation fault (core dumped)", "ERROR: AddressSanitizer: heap-buffer-overflow"],
      content: {
        story: ["C bugs come in two kinds. Compile errors and warnings are found by the compiler — read the first one, fix it, recompile. Turn on -Wall -Wextra and treat warnings as errors.",
          "Run-time bugs are harder: a “Segmentation fault” means the program touched memory it doesn't own — a NULL pointer, an index past the end, freed memory. The crash often happens far from the real mistake.",
          "Sanitizers find them for you. Compile with gcc -g -fsanitize=address,undefined and run: the program stops at the exact bad line and explains what happened. Valgrind does similar checks, and gdb lets you pause a program and look inside."],
        big: "Read the first warning first; for crashes, rebuild with -fsanitize=address,undefined and let it point at the line.",
        caption: "A crash report is traced back through the stack to the line that wrote past an array. Tap Play.",
        demo: ["Segmentation fault", "$ gcc -g -fsanitize=address …", "heap-buffer-overflow", "at main.c:12"]
      },
      deep: {
        more: ["Undefined behavior — reading uninitialised memory, signed overflow, going out of bounds — means the C standard promises nothing. The program might work today and fail tomorrow with a different compiler.",
          "assert(condition) from assert.h stops the program with the file and line when a condition you believe is always true turns out false."],
        ex: { code: src(["#include <assert.h>", "#include <stdio.h>", "", "int safe_get(const int *items, int n, int i, int fallback) {", "    if (i < 0 || i >= n) {", "        return fallback;", "    }", "    return items[i];", "}", "", "int main(void) {", "    int items[3] = {10, 20, 30};", "    printf(\"%d %d\\n\", safe_get(items, 3, 1, -1), safe_get(items, 3, 5, -1));", "    int total = 0;", "    for (int i = 0; i < 3; i++) {", "        total += items[i];", "    }", "    assert(total == 60);", "    printf(\"total checks out: %d\\n\", total);", "    return 0;", "}"]),
          walk: ["Lines 4–9: check the index before reading.", "Line 13: 20 -1 — the bad index gets the fallback.", "Lines 14–18: assert would stop the program if total weren't 60.", "Line 19: total checks out: 60."] },
        mistake: "Adding printf calls until the crash moves. Memory bugs hide when code changes. Use a sanitizer — it finds the cause, not just the symptom."
      } },
    { title: "Memory Safety", chapter: "Beyond the basics · C shelf", line: ["snprintf(buf, sizeof buf, \"%s\", name);", "if (i < n) { … }"],
      content: {
        story: ["Most security holes in C programs are memory-safety bugs: writing past the end of an array (a buffer overflow), using memory after free, or reading memory that was never set. Attackers use them to crash programs or take them over.",
          "Safe habits stop almost all of them: always know the size of every buffer and pass it along; check every index; prefer snprintf and fgets, which take a size, over sprintf, strcpy and gets, which don't; set pointers to NULL after freeing.",
          "Newer languages like Rust and Go were designed to make these bugs impossible. In C, the discipline is yours — and sanitizers are your safety net while testing."],
        big: "Track every buffer's size, check every index, use size-taking functions, and test with sanitizers.",
        caption: "A word too long for its box is trimmed safely instead of spilling into the next one. Tap Play.",
        demo: ["char buf[8];", "strcpy(buf, long_name) ✗ overflow", "snprintf(buf, sizeof buf, …) ✓", "→ trimmed, safe"]
      },
      deep: {
        more: ["gets() was so dangerous it was removed from the language in C11. If you see it in old code, replace it with fgets.",
          "snprintf returns how many characters it wanted to write, so comparing that with the buffer size tells you whether the text was cut short."],
        ex: { code: src(["#include <stdio.h>", "#include <stdlib.h>", "", "int main(int argc, char *argv[]) {", "    const char *name = argc > 1 ? argv[1] : \"Leonardo da Vinci\";", "    char tag[8];", "    int wanted = snprintf(tag, sizeof tag, \"%s\", name);", "    if (wanted >= (int)sizeof tag) {", "        printf(\"cut short: wanted %d characters, kept %zu\\n\", wanted, sizeof tag - 1);", "    }", "    printf(\"tag: %s\\n\", tag);", "    int *scores = malloc(3 * sizeof *scores);", "    if (scores == NULL) {", "        return 1;", "    }", "    scores[0] = scores[1] = scores[2] = 0;", "    int i = 5;", "    if (i >= 0 && i < 3) {", "        scores[i] = 100;", "    } else {", "        printf(\"index %d refused\\n\", i);", "    }", "    free(scores);", "    scores = NULL;", "    return 0;", "}"]),
          walk: ["Line 5: the name would normally come from outside the program; with no argument, it's the default.", "Lines 6–11: snprintf keeps 7 characters plus '\\0' and reports the 17 it wanted: cut short: wanted 17 characters, kept 7, then tag: Leonard.", "Lines 12–16: memory from malloc is set before use.", "Lines 17–22: a bad index is refused instead of written: index 5 refused.", "Lines 23–24: free, then forget the address so it can't be used again."] },
        mistake: "Trusting input lengths. A name, a file or a network message can always be longer than you expected — size every buffer check around that."
      } },
    { title: "Bits and Bytes", chapter: "Beyond the basics · C shelf", line: ["flags |= 1u << 3;", "if (flags & FLAG_SHIELD) { … }"],
      content: {
        story: ["Everything in a computer is bits — 0s and 1s — grouped into bytes of 8. C lets you work with bits directly, which is why it's used for hardware, compression, graphics and games.",
          "The bitwise operators work on each bit: & (and), | (or), ^ (exclusive or), ~ (flip all), << and >> (shift left and right). 1 << 3 is 8: a 1 moved three places.",
          "Flags pack many yes/no settings into one number: each bit is one setting. | turns a bit on, & ~ turns it off, & tests it."],
        big: "&, |, ^, ~, << and >> work on bits; flags store many true/false settings in one number.",
        caption: "Eight light switches in a row; one by one they flip to spell 42 in binary. Tap Play.",
        demo: ["42 → 00101010", "flags |= SHIELD", "flags & SHIELD → on", "flags &= ~SHIELD → off"]
      },
      deep: {
        more: ["Hexadecimal is a compact way to write bits: each hex digit is exactly 4 bits, so 0xFF is 11111111. printf's %x prints hex.",
          "Use unsigned types for bit work: shifting signed numbers into the sign bit is undefined behavior."],
        ex: { code: src(H.concat(["enum { FLAG_SHIELD = 1u << 0, FLAG_SPEED = 1u << 1, FLAG_MAGIC = 1u << 2 };", "", "void print_bits(unsigned value) {", "    for (int bit = 7; bit >= 0; bit--) {", "        putchar((value >> bit) & 1u ? '1' : '0');", "    }", "    putchar('\\n');", "}", "", "int main(void) {", "    print_bits(42);", "    unsigned flags = 0;", "    flags |= FLAG_SHIELD | FLAG_MAGIC;", "    printf(\"shield %d, speed %d\\n\", (flags & FLAG_SHIELD) != 0, (flags & FLAG_SPEED) != 0);", "    flags &= ~FLAG_SHIELD;", "    print_bits(flags);", "    printf(\"%x %u %u\\n\", 255u, 5u << 2, 0xF0u >> 4);", "    return 0;", "}"])),
          walk: ["Line 3: each flag is one bit.", "Lines 5–10: print 8 bits, highest first.", "Line 13: 00101010.", "Lines 14–16: turn on two flags: shield 1, speed 0.", "Lines 17–18: turn shield off: 00000100.", "Line 19: ff 20 15."] },
        mistake: "Mixing up & with && (and | with ||). flags && FLAG_SPEED is true whenever both are non-zero; flags & FLAG_SPEED tests the actual bit."
      } },
    { title: "Data Structures in C", chapter: "Beyond the basics · C shelf", line: ["struct node { int value; struct node *next; };", "head = new_node;"],
      content: {
        story: ["Other languages hand you ready-made lists and maps; in C you build them, which is the best way to understand how they work. A linked list is a chain of nodes, each holding a value and a pointer to the next node; the last one points to NULL.",
          "Adding to the front is quick: make a node, point it at the old head, and make it the new head. Walking the list follows next pointers until NULL. Freeing it means freeing every node.",
          "A stack (last in, first out) is just an array with a top counter: push writes at the top and moves it up; pop moves it down and reads. Stacks power undo buttons, the back button and function calls themselves."],
        big: "A linked list chains nodes with pointers; a stack is an array plus a top index — C makes you build both.",
        caption: "Nodes link into a chain, then a stack of plates is pushed and popped. Tap Play.",
        demo: ["head → 30 → 20 → 10 → NULL", "push(5), push(8)", "pop() → 8", "free every node"]
      },
      deep: {
        more: ["Hash tables, trees and dynamic arrays (like Python's list) are all built from these same pieces: structs, pointers, malloc and free.",
          "Real projects often use a tested library, such as GLib, instead of writing every structure by hand."],
        ex: { code: src(["#include <stdio.h>", "#include <stdlib.h>", "", "struct node {", "    int value;", "    struct node *next;", "};", "", "struct node *push_front(struct node *head, int value) {", "    struct node *n = malloc(sizeof *n);", "    if (n == NULL) {", "        return head;", "    }", "    n->value = value;", "    n->next = head;", "    return n;", "}", "", "int main(void) {", "    struct node *head = NULL;", "    for (int v = 10; v <= 30; v += 10) {", "        head = push_front(head, v);", "    }", "    for (struct node *p = head; p != NULL; p = p->next) {", "        printf(\"%d -> \", p->value);", "    }", "    printf(\"NULL\\n\");", "    while (head != NULL) {", "        struct node *next = head->next;", "        free(head);", "        head = next;", "    }", "", "    int stack[8];", "    int top = 0;", "    stack[top++] = 5;", "    stack[top++] = 8;", "    int popped = stack[--top];", "    printf(\"popped %d, %d left\\n\", popped, top);", "    return 0;", "}"]),
          walk: ["Lines 4–7: a node holds a value and the next node's address.", "Lines 9–17: a new node goes in front of the old head.", "Lines 21–23: push 10, 20, 30.", "Lines 24–27: 30 -> 20 -> 10 -> NULL.", "Lines 28–32: free every node.", "Lines 34–39: a stack in an array: popped 8, 1 left."] },
        mistake: "Freeing a node and then reading its next pointer. Save next first, then free — as lines 29–31 do."
      } }
  ];

  var glossary = [
    ["address", "The location of a value in memory; & gives it."],
    ["argument", "A value passed into a function call."],
    ["array", "A fixed-size row of values of one type, counted from 0."],
    ["ASCII", "The table that numbers characters: 'A' is 65."],
    ["assert", "Stops the program if a condition you expect to be true is false."],
    ["bitwise operator", "&, |, ^, ~, << or >>, working on individual bits."],
    ["bool", "true or false, from stdbool.h."],
    ["break", "Leaves a loop or a switch."],
    ["buffer", "An array used to hold data, like text being read."],
    ["buffer overflow", "Writing past the end of an array — a serious bug."],
    ["byte", "8 bits; the smallest addressable unit of memory."],
    ["calloc", "Like malloc, but fills the memory with zeros."],
    ["case", "One branch of a switch."],
    ["cast", "Converting a value to another type, like (double)x."],
    ["char", "A single character, really a small number."],
    ["compiler", "The program (like gcc or clang) that turns C into a program file."],
    ["const", "Makes a variable read-only."],
    ["continue", "Skips to the next round of a loop."],
    ["dangling pointer", "A pointer to memory that has been freed or no longer exists."],
    ["declaration", "Announces a name and its type, like a prototype."],
    ["definition", "Gives a function its body, or a variable its storage."],
    ["dereference", "Following a pointer with * to reach its value."],
    ["do-while", "A loop that runs its body before testing."],
    ["double", "The everyday type for decimal numbers."],
    ["enum", "A set of named whole-number constants."],
    ["EOF", "End of file: what reading functions report when input runs out."],
    ["fclose", "Closes a file, saving anything still buffered."],
    ["fgets", "Reads one line of text safely, with a size limit."],
    ["FILE", "The type that represents an open file."],
    ["fopen", "Opens a file; returns NULL on failure."],
    ["format specifier", "A code like %d or %s that printf fills with a value."],
    ["fprintf", "printf into a file."],
    ["free", "Gives back memory from malloc."],
    ["function", "A named block of code that takes arguments and may return a value."],
    ["gcc", "The GNU C compiler."],
    ["header file", "A .h file of declarations shared between .c files."],
    ["heap", "Memory for blocks requested with malloc while the program runs."],
    ["include guard", "#ifndef / #define / #endif lines that stop a header being included twice."],
    ["int", "The everyday type for whole numbers."],
    ["linker", "The tool that joins compiled files into one program."],
    ["linked list", "A chain of nodes joined by pointers."],
    ["macro", "A #define that the preprocessor replaces before compiling."],
    ["main", "The function where every C program starts."],
    ["malloc", "Reserves a block of memory at run time."],
    ["memory leak", "Memory that is never freed."],
    ["NULL", "The pointer that points nowhere."],
    ["null character", "'\\0', the byte that marks the end of a string."],
    ["parameter", "A named, typed input in a function's definition."],
    ["pointer", "A variable holding the address of another value."],
    ["pointer arithmetic", "Adding to a pointer to move it by whole items."],
    ["preprocessor", "The step that handles # lines before compiling."],
    ["printf", "Prints formatted text."],
    ["prototype", "A function's declaration without its body."],
    ["qsort", "The standard library's general sorting function."],
    ["realloc", "Grows or shrinks a malloc'd block."],
    ["return", "Ends a function and hands back a value."],
    ["sanitizer", "A compiler option that catches memory and undefined-behavior bugs while running."],
    ["scanf", "Reads formatted input; needs addresses with &."],
    ["scope", "Where a name is visible, usually between braces."],
    ["segmentation fault", "A crash from touching memory the program doesn't own."],
    ["size_t", "The unsigned type for sizes and counts."],
    ["sizeof", "Gives the size of a type or value in bytes."],
    ["snprintf", "Builds text into a buffer without overflowing it."],
    ["stack (memory)", "Where local variables live while a function runs."],
    ["static", "Keeps a function or variable private to its file (or alive between calls)."],
    ["stdio.h", "The header for input, output and files."],
    ["stdlib.h", "The header for memory, conversions, random numbers and sorting."],
    ["strcmp", "Compares two strings; 0 means equal."],
    ["string", "A char array ending in '\\0'."],
    ["string.h", "The header for string and memory functions."],
    ["strlen", "Counts the characters before '\\0'."],
    ["struct", "A type that groups named fields."],
    ["switch", "Jumps to the case matching an integer value."],
    ["typedef", "Gives a type a new name."],
    ["undefined behavior", "Code the C standard makes no promises about, like reading out of bounds."],
    ["unsigned", "A whole-number type that can't be negative."],
    ["variable", "A named piece of memory with a type."],
    ["void", "“Nothing”: no return value, or no parameters."],
    ["-> (arrow)", "Reaches a struct field through a pointer."],
    ["& (address-of)", "Gives the address of a variable."]
  ];

  var field = [
    { name: "printf / fprintf", head: "stdio.h", what: "Print formatted text to the screen or a file.", ex: "printf(\"%-6s %5d\\n\", name, n);" },
    { name: "snprintf", head: "stdio.h", what: "Build text in a buffer, never overflowing it.", ex: "snprintf(buf, sizeof buf, \"Lv %d\", lv);" },
    { name: "fgets", head: "stdio.h", what: "Read one line, up to a size limit.", ex: "fgets(line, sizeof line, stdin)" },
    { name: "fopen / fclose", head: "stdio.h", what: "Open and close files; fopen returns NULL on failure.", ex: "FILE *f = fopen(\"a.txt\", \"r\");" },
    { name: "malloc / free", head: "stdlib.h", what: "Reserve and release memory at run time.", ex: "int *a = malloc(n * sizeof *a);" },
    { name: "strtol", head: "stdlib.h", what: "Text to number, reporting where it stopped.", ex: "long n = strtol(s, &end, 10);" },
    { name: "qsort", head: "stdlib.h", what: "Sort any array with a comparison function.", ex: "qsort(a, n, sizeof a[0], cmp);" },
    { name: "rand / srand", head: "stdlib.h", what: "Pseudo-random numbers for games.", ex: "int roll = rand() % 6 + 1;" },
    { name: "strlen / strcmp", head: "string.h", what: "Measure and compare strings.", ex: "strcmp(a, b) == 0" },
    { name: "memcpy / memset", head: "string.h", what: "Copy or fill blocks of memory.", ex: "memset(grid, 0, sizeof grid);" },
    { name: "toupper / isdigit", head: "ctype.h", what: "Change or test single characters.", ex: "toupper((unsigned char)c)" },
    { name: "sqrt / pow / fabs", head: "math.h", what: "Math functions on doubles (link with -lm).", ex: "sqrt(2.0)" },
    { name: "time", head: "time.h", what: "The current time, in seconds since 1970.", ex: "srand((unsigned)time(NULL));" },
    { name: "bool", head: "stdbool.h", what: "true and false.", ex: "bool alive = true;" },
    { name: "assert", head: "assert.h", what: "Stop with file and line if a condition is false.", ex: "assert(count >= 0);" }
  ];

  var cheats = [
    { title: "Program Skeleton Card", body: "The shape of a C program.", code: src(H.concat(["int main(void) {", "    printf(\"Hello\\n\");", "    return 0;", "}"])) },
    { title: "Types Card", body: "Everyday types and casts.", code: src(["int n = 42;", "double x = 3.14;", "char c = 'A';", "bool ok = true;", "const int MAX = 10;", "double avg = (double)n / 3;", "size_t len = strlen(name);"]) },
    { title: "Decisions Card", body: "if, switch and ?:.", code: src(["if (x > 0) {", "    puts(\"positive\");", "} else if (x == 0) {", "    puts(\"zero\");", "} else {", "    puts(\"negative\");", "}", "switch (choice) {", "case 1:", "    start();", "    break;", "default:", "    quit();", "}", "int best = a > b ? a : b;"]) },
    { title: "Loops Card", body: "for, while and do-while.", code: src(["for (int i = 0; i < n; i++) {", "}", "while (lives > 0) {", "    lives--;", "}", "do {", "    tries++;", "} while (tries < 3);"]) },
    { title: "Strings Card", body: "Working with char arrays.", code: src(["char name[] = \"Ana\";", "size_t len = strlen(name);", "char buf[32];", "snprintf(buf, sizeof buf, \"Hi %s\", name);", "if (strcmp(name, \"Ana\") == 0) {", "    puts(\"match\");", "}"]) },
    { title: "Pointers Card", body: "Addresses and arrows.", code: src(["int x = 5;", "int *p = &x;", "*p = 7;", "int arr[3] = {1, 2, 3};", "int *q = arr;", "int third = *(q + 2);", "hero->hp -= 10;"]) },
    { title: "Memory Card", body: "malloc, check, free.", code: src(["int *a = malloc(n * sizeof *a);", "if (a == NULL) {", "    return 1;", "}", "a[0] = 42;", "free(a);", "a = NULL;"]) },
    { title: "Files Card", body: "Write, then read back.", code: src(["FILE *f = fopen(\"save.txt\", \"w\");", "if (f != NULL) {", "    fprintf(f, \"%d\\n\", score);", "    fclose(f);", "}", "char line[64];", "FILE *in = fopen(\"save.txt\", \"r\");", "while (in != NULL && fgets(line, sizeof line, in) != NULL) {", "    printf(\"%s\", line);", "}"]) }
  ];

  /* A whole main.c: includes, then any types and functions, then main. */
  function M(includes, decls, body) {
    var out = includes.map(function (h) { return "#include <" + h + ">"; }).concat([""]);
    if (decls.length) out = out.concat(decls, [""]);
    return out.concat(["int main(void) {"], body.map(function (l) { return l ? "    " + l : ""; }), ["    return 0;", "}"]);
  }
  function stars(n) { return new Array(n + 1).join("*"); }

  var projects = [
    { name: "Rocket Countdown", about: "A for loop counts the rocket down to blast off.",
      vars: [{ key: "start", val: 5, min: 1, max: 12 }],
      code: function (v) { return M(["stdio.h"], [], ["int start = " + v.start + ";", "for (int i = start; i > 0; i--) {", "    printf(\"%d...\\n\", i);", "}", "printf(\"Blast off!\\n\");"]); },
      run: function (v) { var o = []; for (var i = v.start; i > 0; i--) o.push(i + "..."); o.push("Blast off!"); return o; },
      explain: "i starts at your number, i-- takes one away each round, and the loop stops when i > 0 is false." },
    { name: "Star Steps", about: "A loop inside a loop prints a staircase of stars.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return M(["stdio.h"], [], ["int rows = " + v.rows + ";", "for (int r = 1; r <= rows; r++) {", "    for (int s = 0; s < r; s++) {", "        putchar('*');", "    }", "    putchar('\\n');", "}"]); },
      run: function (v) { var o = []; for (var r = 1; r <= v.rows; r++) o.push(stars(r)); return o; },
      explain: "The outer loop picks the row; the inner loop prints that many stars; putchar('\\n') ends the row." },
    { name: "Coin Bank", about: "Every coin adds to the total.",
      vars: [{ key: "coins", val: 5, min: 1, max: 10 }, { key: "each", val: 25, min: 1, max: 50 }],
      code: function (v) { return M(["stdio.h"], [], ["int coins = " + v.coins + ";", "int each = " + v.each + ";", "int total = 0;", "for (int c = 1; c <= coins; c++) {", "    total += each;", "    printf(\"Coin %d: total %d\\n\", c, total);", "}"]); },
      run: function (v) { var o = [], t = 0; for (var c = 1; c <= v.coins; c++) { t += v.each; o.push("Coin " + c + ": total " + t); } return o; },
      explain: "total starts at 0, and += adds one coin's worth each round." },
    { name: "Score Doubler", about: "A score that doubles every round.",
      vars: [{ key: "score", val: 3, min: 1, max: 50 }, { key: "rounds", val: 5, min: 1, max: 10 }],
      code: function (v) { return M(["stdio.h"], [], ["int score = " + v.score + ";", "int rounds = " + v.rounds + ";", "for (int r = 1; r <= rounds; r++) {", "    score *= 2;", "    printf(\"Round %d: %d\\n\", r, score);", "}"]); },
      run: function (v) { var o = [], s = v.score; for (var r = 1; r <= v.rounds; r++) { s *= 2; o.push("Round " + r + ": " + s); } return o; },
      explain: "*= 2 doubles the score; printf fills the two %d codes with the round and the score." },
    { name: "Times Table", about: "A multiplication table for any number.",
      vars: [{ key: "num", val: 7, min: 1, max: 12 }, { key: "upto", val: 5, min: 1, max: 12 }],
      code: function (v) { return M(["stdio.h"], [], ["int num = " + v.num + ";", "int upto = " + v.upto + ";", "for (int i = 1; i <= upto; i++) {", "    printf(\"%d x %d = %d\\n\", num, i, num * i);", "}"]); },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(v.num + " x " + i + " = " + v.num * i); return o; },
      explain: "Three %d codes take num, i and the product, in order." },
    { name: "Temperature Converter", about: "Celsius to Fahrenheit with one decimal place.",
      vars: [{ key: "celsius", val: 20, min: -40, max: 100 }],
      code: function (v) { return M(["stdio.h"], [], ["int celsius = " + v.celsius + ";", "double fahrenheit = celsius * 9.0 / 5.0 + 32.0;", "printf(\"%d C is %.1f F\\n\", celsius, fahrenheit);"]); },
      run: function (v) { return [v.celsius + " C is " + (v.celsius * 9 / 5 + 32).toFixed(1) + " F"]; },
      explain: "9.0 is a double, so the whole calculation is done with decimals. %.1f shows one decimal place." },
    { name: "Tip Calculator", about: "A tip and total for a bill, in whole dollars.",
      vars: [{ key: "bill", val: 40, min: 1, max: 500 }, { key: "percent", val: 15, min: 0, max: 30 }],
      code: function (v) { return M(["stdio.h"], [], ["int bill = " + v.bill + ";", "int percent = " + v.percent + ";", "int tip = bill * percent / 100;", "printf(\"Bill: $%d\\n\", bill);", "printf(\"Tip: $%d\\n\", tip);", "printf(\"Total: $%d\\n\", bill + tip);"]); },
      run: function (v) { var tip = Math.floor(v.bill * v.percent / 100); return ["Bill: $" + v.bill, "Tip: $" + tip, "Total: $" + (v.bill + tip)]; },
      explain: "int division drops the cents. Multiplying before dividing keeps the answer as accurate as whole dollars allow." },
    { name: "FizzBuzz", about: "Multiples of 3 say Fizz, of 5 say Buzz, of both say FizzBuzz.",
      vars: [{ key: "limit", val: 15, min: 1, max: 30 }],
      code: function (v) { return M(["stdio.h"], [], ["int limit = " + v.limit + ";", "for (int n = 1; n <= limit; n++) {", "    if (n % 15 == 0) {", "        printf(\"FizzBuzz\\n\");", "    } else if (n % 3 == 0) {", "        printf(\"Fizz\\n\");", "    } else if (n % 5 == 0) {", "        printf(\"Buzz\\n\");", "    } else {", "        printf(\"%d\\n\", n);", "    }", "}"]); },
      run: function (v) { var o = []; for (var n = 1; n <= v.limit; n++) o.push(n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : String(n)); return o; },
      explain: "% gives the remainder; 0 means it divides exactly. The 15 check comes first so 15 doesn't stop at Fizz." },
    { name: "Score Stats", about: "Highest, lowest and average of an array.",
      vars: [{ key: "first", val: 72, min: 0, max: 100 }, { key: "second", val: 95, min: 0, max: 100 }, { key: "third", val: 64, min: 0, max: 100 }],
      code: function (v) { return M(["stdio.h"], [], ["int first = " + v.first + ";", "int second = " + v.second + ";", "int third = " + v.third + ";", "int scores[] = {first, second, third};", "size_t count = sizeof scores / sizeof scores[0];", "int sum = 0, high = scores[0], low = scores[0];", "for (size_t i = 0; i < count; i++) {", "    sum += scores[i];", "    if (scores[i] > high) {", "        high = scores[i];", "    }", "    if (scores[i] < low) {", "        low = scores[i];", "    }", "}", "printf(\"Highest: %d\\n\", high);", "printf(\"Lowest: %d\\n\", low);", "printf(\"Average: %.1f\\n\", (double)sum / count);"]); },
      run: function (v) { var a = [v.first, v.second, v.third]; return ["Highest: " + Math.max.apply(null, a), "Lowest: " + Math.min.apply(null, a), "Average: " + ((v.first + v.second + v.third) / 3).toFixed(1)]; },
      explain: "One loop does it all: it adds every score and keeps the best and worst seen so far. The cast keeps the average's decimal." },
    { name: "Grade Bands", about: "switch on score / 10 picks a grade.",
      vars: [{ key: "score", val: 85, min: 0, max: 100 }],
      code: function (v) { return M(["stdio.h"], [], ["int score = " + v.score + ";", "switch (score / 10) {", "case 10:", "case 9:", "    printf(\"%d is an A\\n\", score);", "    break;", "case 8:", "    printf(\"%d is a B\\n\", score);", "    break;", "case 7:", "    printf(\"%d is a C\\n\", score);", "    break;", "default:", "    printf(\"%d: keep practicing\\n\", score);", "    break;", "}"]); },
      run: function (v) { var b = Math.floor(v.score / 10); return [b >= 9 ? v.score + " is an A" : b === 8 ? v.score + " is a B" : b === 7 ? v.score + " is a C" : v.score + ": keep practicing"]; },
      explain: "score / 10 turns 85 into 8. case 10 has no break and no code, so 100 falls through to case 9 and gets an A too." },
    { name: "Pointer Swap", about: "A function swaps two variables through pointers.",
      vars: [{ key: "left", val: 3, min: 0, max: 99 }, { key: "right", val: 8, min: 0, max: 99 }],
      code: function (v) { return M(["stdio.h"], ["void swap(int *a, int *b) {", "    int temp = *a;", "    *a = *b;", "    *b = temp;", "}"], ["int left = " + v.left + ";", "int right = " + v.right + ";", "printf(\"Before: left=%d right=%d\\n\", left, right);", "swap(&left, &right);", "printf(\"After: left=%d right=%d\\n\", left, right);"]); },
      run: function (v) { return ["Before: left=" + v.left + " right=" + v.right, "After: left=" + v.right + " right=" + v.left]; },
      explain: "swap gets the addresses of left and right, so writing through *a and *b changes the real variables." },
    { name: "Shout", about: "toupper turns the first letters into capitals.",
      vars: [{ key: "loud", val: 3, min: 0, max: 11 }],
      code: function (v) { return M(["ctype.h", "stdio.h", "string.h"], [], ["int loud = " + v.loud + ";", "char word[] = \"hello world\";", "size_t len = strlen(word);", "for (size_t i = 0; i < len && i < (size_t)loud; i++) {", "    word[i] = (char)toupper((unsigned char)word[i]);", "}", "printf(\"%s\\n\", word);"]); },
      run: function (v) { var w = "hello world"; return [w.slice(0, v.loud).toUpperCase() + w.slice(v.loud)]; },
      explain: "A string is an array of chars, so the loop can change it letter by letter. toupper leaves the space alone." },
    { name: "Hero Healing", about: "A function heals a hero through a pointer.",
      vars: [{ key: "hp", val: 40, min: 1, max: 99 }, { key: "potion", val: 25, min: 5, max: 50 }],
      code: function (v) { return M(["stdio.h"], ["struct hero {", "    const char *name;", "    int hp;", "};", "", "void heal(struct hero *h, int amount) {", "    h->hp += amount;", "    if (h->hp > 100) {", "        h->hp = 100;", "    }", "}"], ["int hp = " + v.hp + ";", "int potion = " + v.potion + ";", "struct hero ana = {\"Ana\", hp};", "while (ana.hp < 100) {", "    heal(&ana, potion);", "    printf(\"%s drinks a potion: %d HP\\n\", ana.name, ana.hp);", "}"]); },
      run: function (v) { var o = [], hp = v.hp; while (hp < 100) { hp = Math.min(hp + v.potion, 100); o.push("Ana drinks a potion: " + hp + " HP"); } return o; },
      explain: "heal gets &ana, a pointer, so h->hp changes the real hero. Without the pointer it would heal a copy and the loop would never end." },
    { name: "Square Builder", about: "malloc makes exactly the room the program needs.",
      vars: [{ key: "count", val: 5, min: 1, max: 12 }],
      code: function (v) { return M(["stdio.h", "stdlib.h"], [], ["int count = " + v.count + ";", "int *squares = malloc(count * sizeof *squares);", "if (squares == NULL) {", "    return 1;", "}", "long total = 0;", "for (int i = 0; i < count; i++) {", "    squares[i] = (i + 1) * (i + 1);", "    total += squares[i];", "}", "for (int i = 0; i < count; i++) {", "    printf(\"%d%c\", squares[i], i + 1 < count ? ' ' : '\\n');", "}", "printf(\"Total: %ld\\n\", total);", "free(squares);"]); },
      run: function (v) { var a = [], t = 0; for (var i = 1; i <= v.count; i++) { a.push(i * i); t += i * i; } return [a.join(" "), "Total: " + t]; },
      explain: "malloc reserves room for exactly count ints, checked for NULL. free gives the memory back when the program is done with it." },
    { name: "Binary Bits", about: "Shifts and & show a number's eight bits.",
      vars: [{ key: "number", val: 42, min: 0, max: 255 }],
      code: function (v) { return M(["stdio.h"], [], ["int number = " + v.number + ";", "int ones = 0;", "printf(\"%d in binary: \", number);", "for (int bit = 7; bit >= 0; bit--) {", "    int on = (number >> bit) & 1;", "    ones += on;", "    putchar(on ? '1' : '0');", "}", "printf(\"\\nBits that are on: %d\\n\", ones);", "printf(\"Times two: %d\\n\", number << 1);"]); },
      run: function (v) {
        var bits = v.number.toString(2); while (bits.length < 8) bits = "0" + bits;
        return [v.number + " in binary: " + bits, "Bits that are on: " + bits.split("").filter(function (b) { return b === "1"; }).length, "Times two: " + v.number * 2];
      },
      explain: ">> bit slides each bit down to the bottom, and & 1 keeps just that bit. << 1 shifts everything left — the same as doubling." },
    { name: "Prime Sieve", about: "The Sieve of Eratosthenes crosses out every multiple.",
      vars: [{ key: "limit", val: 30, min: 2, max: 100 }],
      code: function (v) { return M(["stdbool.h", "stdio.h"], [], ["int limit = " + v.limit + ";", "bool crossed[101] = {false};", "int found = 0;", "for (int n = 2; n <= limit; n++) {", "    if (crossed[n]) {", "        continue;", "    }", "    printf(\"%s%d\", found > 0 ? \" \" : \"\", n);", "    found++;", "    for (int m = n * n; m <= limit; m += n) {", "        crossed[m] = true;", "    }", "}", "printf(\"\\n%d primes up to %d\\n\", found, limit);"]); },
      run: function (v) {
        var crossed = [], primes = [];
        for (var n = 2; n <= v.limit; n++) { if (crossed[n]) continue; primes.push(n); for (var m = n * n; m <= v.limit; m += n) crossed[m] = true; }
        return [primes.join(" "), primes.length + " primes up to " + v.limit];
      },
      explain: "Each number that survives is prime, and its multiples are crossed out. Starting at n * n is enough: smaller multiples were crossed out earlier." },
    { name: "Linked List", about: "Nodes chained by pointers, built and freed with malloc.",
      vars: [{ key: "count", val: 4, min: 1, max: 9 }],
      code: function (v) { return M(["stdio.h", "stdlib.h"], ["struct node {", "    int value;", "    struct node *next;", "};"], ["int count = " + v.count + ";", "struct node *head = NULL;", "for (int i = 1; i <= count; i++) {", "    struct node *n = malloc(sizeof *n);", "    if (n == NULL) {", "        break;", "    }", "    n->value = i * 10;", "    n->next = head;", "    head = n;", "}", "for (struct node *p = head; p != NULL; p = p->next) {", "    printf(\"%d -> \", p->value);", "}", "printf(\"NULL\\n\");", "while (head != NULL) {", "    struct node *next = head->next;", "    free(head);", "    head = next;", "}"]); },
      run: function (v) { var s = ""; for (var i = v.count; i >= 1; i--) s += i * 10 + " -> "; return [s + "NULL"]; },
      explain: "Each new node goes in front, so the list comes out backwards. The last loop frees every node, saving next before each free." },
    { name: "Number Guesser", about: "Halving the range finds any number from 1 to 100 in 7 guesses or fewer.",
      vars: [{ key: "secret", val: 37, min: 1, max: 100 }],
      code: function (v) { return M(["stdio.h"], [], ["int secret = " + v.secret + ";", "int low = 1, high = 100;", "for (int tries = 1;; tries++) {", "    int guess = (low + high) / 2;", "    if (guess == secret) {", "        printf(\"Got it: %d in %d tries\\n\", guess, tries);", "        break;", "    } else if (guess < secret) {", "        printf(\"%d is too low\\n\", guess);", "        low = guess + 1;", "    } else {", "        printf(\"%d is too high\\n\", guess);", "        high = guess - 1;", "    }", "}"]); },
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
    { line: 'printf("{w}\\n");', why: "\\n ends the line." },
    { line: 'printf("%d\\n", {v});', why: "%d prints an int." },
    { line: 'printf("{w}: %d\\n", {v});', why: "Text and a value in one printf." },
    { line: 'printf("%5d\\n", {v});', why: "%5d pads the number to five places." },
    { line: "int {v} = {n};", why: "Always give a variable a starting value." },
    { line: "double {v} = {dec};", why: "double holds a decimal." },
    { line: "char {sv}_initial = '{L}';", why: "A char in single quotes." },
    { line: "bool {v} = {b};", why: "bool comes from stdbool.h." },
    { line: "const int {cv} = {n};", why: "const makes it read-only." },
    { line: "#define {cv} {n}", why: "#define replaces text before compiling." },
    { line: "{v} += {n};", why: "+= adds onto the current value." },
    { line: "{v} -= {d};", why: "-= takes away from the current value." },
    { line: "{v} *= {d};", why: "*= multiplies the current value." },
    { line: "{v}++;", why: "++ adds one." },
    { line: "{v}--;", why: "-- takes one away." },
    { line: "{v} = {u} + {n};", why: "Work out the right side, store it on the left." },
    { line: "int {v} = {u} % {d};", why: "% gives the remainder." },
    { line: "double {v} = (double){u} / {d};", why: "Cast first to keep the decimals." },
    { line: 'if ({v} > {n}) { printf("{w}\\n"); }', why: "if runs its block when the test is true." },
    { line: "if ({v} == {n}) { {u} = 0; }", why: "== compares; = would assign." },
    { line: "} else if ({v} < {d}) {", why: "else if tries another test." },
    { line: "int {v} = {u} > {n} ? {u} : {n};", why: "?: picks one of two values." },
    { line: 'switch ({v}) { case {n}: printf("{w}\\n"); break; }', why: "break stops the fall into the next case." },
    { line: "for (int i = 0; i < {n}; i++) { {v} += i; }", why: "Start, test and step." },
    { line: "while ({v} > 0) { {v}--; }", why: "while repeats while the test is true." },
    { line: "do { {v}++; } while ({v} < {n});", why: "do-while always runs once." },
    { line: "int {arr}[{d}] = {0};", why: "{0} sets every item to zero." },
    { line: "int {arr}[] = {{n}, {n2}, {n3}};", why: "C counts the items for you." },
    { line: "{arr}[{d}] = {n};", why: "Square brackets reach an item, counting from 0." },
    { line: "int {v} = {arr}[{d}];", why: "Read one item by its index." },
    { line: "size_t {v} = sizeof {arr} / sizeof {arr}[0];", why: "Total size over item size is the length." },
    { line: "for (size_t i = 0; i < {d}; i++) { {v} += {arr}[i]; }", why: "Walk an array with an index." },
    { line: 'char {sv}[] = "{w}";', why: "A string is a char array ending in '\\0'." },
    { line: "size_t {v} = strlen({sv});", why: "strlen counts characters before '\\0'." },
    { line: 'snprintf({sv}, sizeof {sv}, "{w} %d", {v});', why: "snprintf never writes past the end." },
    { line: 'if (strcmp({sv}, "{w}") == 0) { {v}++; }', why: "strcmp returns 0 for equal strings." },
    { line: "int {f}(int {v}) { return {v} * {d}; }", why: "A function with a parameter and a result." },
    { line: 'void {f}(void) { printf("{w}\\n"); }', why: "void: no inputs, no result." },
    { line: "{f}({n});", why: "Call a function with an argument." },
    { line: "int {v} = {f}({u});", why: "Store a function's result." },
    { line: "int {f}(int {v});", why: "A prototype announces a function." },
    { line: "int *p = &{v};", why: "& takes the address." },
    { line: "*p += {n};", why: "* reaches the value through the pointer." },
    { line: "void {f}(int *{v}) { *{v} += {d}; }", why: "A pointer parameter lets a function change the caller's variable." },
    { line: "{f}(&{v});", why: "Pass the address so the function can change it." },
    { line: "int *p = {arr};", why: "An array's name is a pointer to its first item." },
    { line: "int {v} = *(p + {d});", why: "Pointer arithmetic moves by whole items." },
    { line: "struct {c} { int {v}; char {sv}[{n}]; };", why: "A struct groups fields; mind the final semicolon." },
    { line: "struct {c} {o} = {.{v} = {n}};", why: "A designated initializer names the field." },
    { line: "{o}.{v} = {n};", why: "The dot reaches a field." },
    { line: "{o}->{v} += {d};", why: "The arrow reaches a field through a pointer." },
    { line: "typedef struct {c} {c};", why: "typedef gives the type a short name." },
    { line: "int *{arr} = malloc({n} * sizeof *{arr});", why: "malloc reserves memory at run time." },
    { line: "if ({arr} == NULL) { return 1; }", why: "Always check what malloc returns." },
    { line: "free({arr});", why: "Give back every malloc'd block once." },
    { line: "int *bigger = realloc({arr}, {n} * sizeof *{arr});", why: "realloc grows a block; keep the old pointer until it succeeds." },
    { line: 'FILE *f = fopen("{w}.txt", "w");', why: "fopen returns NULL if it fails." },
    { line: 'fprintf(f, "{w}: %d\\n", {v});', why: "fprintf writes into a file." },
    { line: "if (f != NULL) { fclose(f); }", why: "Close every file you open." },
    { line: "enum {c}_state { IDLE, RUNNING, DONE };", why: "enum names whole numbers." },
    { line: "unsigned {v} = {u} << {d};", why: "<< shifts bits left." },
    { line: "{v} |= 1u << {d};", why: "| turns a bit on." },
    { line: "if ({v} & (1u << {d})) { {u}++; }", why: "& tests a bit." },
    { line: "int {v} = abs({u} - {n});", why: "abs drops the minus sign." },
    { line: "int {v} = rand() % {n} + 1;", why: "rand gives a pseudo-random number." }
  ];
  var themes = [
    { name: "Print & Talk", t: [0, 1, 2, 3, 32] },
    { name: "Variables", t: [4, 5, 6, 7, 8] },
    { name: "Constants", t: [8, 9, 4, 5, 30] },
    { name: "Math Moves", t: [10, 11, 12, 15, 16] },
    { name: "Steps & Casts", t: [13, 14, 17, 63, 64] },
    { name: "Decisions", t: [18, 19, 20, 21, 7] },
    { name: "Switch", t: [22, 18, 20, 19, 21] },
    { name: "Loops", t: [23, 24, 25, 31, 10] },
    { name: "Arrays", t: [26, 27, 28, 29, 30] },
    { name: "Strings", t: [32, 33, 34, 35, 0] },
    { name: "Functions", t: [36, 37, 38, 39, 40] },
    { name: "Pointers", t: [41, 42, 43, 44, 46] },
    { name: "Pointers & Arrays", t: [45, 46, 31, 29, 33] },
    { name: "Structs", t: [47, 48, 49, 50, 51] },
    { name: "Memory", t: [52, 53, 54, 55, 30] },
    { name: "Files", t: [56, 57, 58, 2, 32] },
    { name: "Enums & Bits", t: [59, 60, 61, 62, 9] },
    { name: "Random & Math", t: [63, 64, 16, 17, 21] },
    { name: "Mixed Practice", t: [22, 31, 43, 48, 52] },
    { name: "C Masters", t: [43, 50, 55, 61, 35] }
  ];
  /* Standard library names (open, close, exit…) stay out of the function bank. */
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
    sandboxNote: "Thirty everyday C lines, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your C progress is saved separately from every other track.",
    sourcesHTML: 'C facts and syntax follow the C17 standard (ISO/IEC 9899:2018), <a href="https://en.cppreference.com/w/c">cppreference.com</a> and the <a href="https://www.gnu.org/software/libc/manual/">GNU C Library manual</a>. Every explanation is written in Code Block\u2019s own words, and every practice program is compiled with all warnings as errors and run under AddressSanitizer before it ships.'
  };
});
