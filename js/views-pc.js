"use strict";
/* Code Block — the PC: the virtual computer and its projects.
   Split from js/views.js (lines 865-1332). Loads last of the three
   views files. */
/* ================= THE PC ================= */
var PROJECTS = window.CB_T ? CB_T.projects : window.__isCS ? CS_PROJECTS : [
  { name: "Rocket Countdown", file: "countdown.cpp",
    about: "A for loop counts the rocket down to blast off. Change the start number and the rocket counts from somewhere new.",
    vars: [{ key: "start", label: "start", val: 5, min: 1, max: 12 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int start = " + v.start + ";", "    for (int i = start; i > 0; i--) {", "        std::cout << i << \"...\\n\";", "    }", "    std::cout << \"Blast off!\\n\";", "    return 0;", "}"]; },
    run: function (v) { var out = []; for (var i = v.start; i > 0; i--) out.push(i + "..."); out.push("Blast off!"); return out; },
    explain: "The for loop starts at your number and counts down by 1 (i--) until it reaches 0. Then the line after the loop fires the rocket. A bigger start means a longer countdown — same code, different show." },
  { name: "Star Steps", file: "stars.cpp",
    about: "Two loops build a staircase of stars — the outer loop picks the step, the inner loop draws that many stars.",
    vars: [{ key: "rows", label: "rows", val: 4, min: 1, max: 8 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int rows = " + v.rows + ";", "    for (int r = 1; r <= rows; r++) {", "        for (int s = 0; s < r; s++) {", "            std::cout << \"*\";", "        }", "        std::cout << \"\\n\";", "    }", "    return 0;", "}"]; },
    run: function (v) { var out = []; for (var r = 1; r <= v.rows; r++) { var row = ""; for (var s = 0; s < r; s++) row += "*"; out.push(row); } return out; },
    explain: "A loop inside a loop! Row 1 draws 1 star, row 2 draws 2 stars, and so on. Programmers call this a nested loop — it is how screens full of patterns get drawn." },
  { name: "Score Doubler", file: "doubler.cpp",
    about: "Start with a small score and double it every round with score *= 2 — the Math Block shortcut in action.",
    vars: [{ key: "score", label: "score", val: 3, min: 1, max: 50 }, { key: "rounds", label: "rounds", val: 4, min: 1, max: 8 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int score = " + v.score + ";", "    int rounds = " + v.rounds + ";", "    for (int r = 1; r <= rounds; r++) {", "        score *= 2;", "        std::cout << \"Round \" << r << \": \" << score << \"\\n\";", "    }", "    return 0;", "}"]; },
    run: function (v) { var out = [], s = v.score; for (var r = 1; r <= v.rounds; r++) { s *= 2; out.push("Round " + r + ": " + s); } return out; },
    explain: "score *= 2 means: take what is in the box and multiply it by 2, keeping the result in the same box. Doubling grows FAST — a few more rounds and the numbers explode." },
  { name: "Coin Bank", file: "bank.cpp",
    about: "Drop coins into the bank one by one with total += each — and watch the total pile up, just like the Library's piggy bank.",
    vars: [{ key: "coins", label: "coins", val: 4, min: 1, max: 10 }, { key: "each", label: "each (cents)", val: 25, min: 1, max: 100 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int total = 0;", "    int coins = " + v.coins + ";", "    int each = " + v.each + ";", "    for (int c = 1; c <= coins; c++) {", "        total += each;", "        std::cout << \"Coin \" << c << \": total \" << total << \"\\n\";", "    }", "    return 0;", "}"]; },
    run: function (v) { var out = [], t = 0; for (var c = 1; c <= v.coins; c++) { t += v.each; out.push("Coin " + c + ": total " + t); } return out; },
    explain: "total += each adds each coin ONTO the running total — nothing is ever erased, it piles up. Try more coins, or pricier coins, and compare the final total." },
  { name: "Robot Walker", file: "robot.cpp",
    about: "A little robot walks step by step. Its position lives in a variable, and every lap of the while loop adds one step.",
    vars: [{ key: "steps", label: "steps", val: 5, min: 1, max: 12 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int steps = " + v.steps + ";", "    int pos = 0;", "    while (pos < steps) {", "        pos++;", "        std::cout << \"Step! Position \" << pos << \"\\n\";", "    }", "    std::cout << \"Arrived!\\n\";", "    return 0;", "}"]; },
    run: function (v) { var out = []; for (var p = 1; p <= v.steps; p++) out.push("Step! Position " + p); out.push("Arrived!"); return out; },
    explain: "The while loop keeps asking: is pos still less than steps? Each lap, pos++ moves the robot one tile closer, so the answer eventually becomes no — and the robot arrives." },
  { name: "Echo Bot", file: "echo.cpp",
    about: "Echo Bot says the same thing again and again — repetition, the Code Block way. You choose how many echoes.",
    vars: [{ key: "times", label: "times", val: 3, min: 1, max: 9 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int times = " + v.times + ";", "    for (int i = 0; i < times; i++) {", "        std::cout << \"Beep! I am Echo Bot.\\n\";", "    }", "    return 0;", "}"]; },
    run: function (v) { var out = []; for (var i = 0; i < v.times; i++) out.push("Beep! I am Echo Bot."); return out; },
    explain: "One single cout line, printed again and again by the loop. Write the line once — the loop does the repeating. That is exactly how you have been drilling in the Sandbox." },
  { name: "FizzBuzz Machine", file: "fizzbuzz.cpp",
    about: "The classic counting game: multiples of 3 say Fizz, multiples of 5 say Buzz, and multiples of both shout FizzBuzz. The % symbol finds the leftovers of a division.",
    vars: [{ key: "limit", label: "limit", val: 15, min: 5, max: 30 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int limit = " + v.limit + ";", "    for (int i = 1; i <= limit; i++) {", "        if (i % 15 == 0) {", "            std::cout << \"FizzBuzz\\n\";", "        } else if (i % 3 == 0) {", "            std::cout << \"Fizz\\n\";", "        } else if (i % 5 == 0) {", "            std::cout << \"Buzz\\n\";", "        } else {", "            std::cout << i << \"\\n\";", "        }", "    }", "    return 0;", "}"]; },
    run: function (v) { var out = []; for (var i = 1; i <= v.limit; i++) { if (i % 15 === 0) out.push("FizzBuzz"); else if (i % 3 === 0) out.push("Fizz"); else if (i % 5 === 0) out.push("Buzz"); else out.push(String(i)); } return out; },
    explain: "i % 3 asks: what is left over when i is divided by 3? If nothing is left over, i is a multiple of 3. The checks run in order — FizzBuzz (multiples of 15) must be tested FIRST, or plain Fizz would grab those numbers early." },
  { name: "Tip Calculator", file: "tip.cpp",
    about: "Work out a restaurant tip with pure number crunching: multiply the bill by the percent, divide by 100, then add it on.",
    vars: [{ key: "bill", label: "bill ($)", val: 40, min: 5, max: 200 }, { key: "percent", label: "percent", val: 15, min: 0, max: 50 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int bill = " + v.bill + ";", "    int percent = " + v.percent + ";", "    int tip = bill * percent / 100;", "    int total = bill + tip;", "    std::cout << \"Bill: $\" << bill << \"\\n\";", "    std::cout << \"Tip: $\" << tip << \"\\n\";", "    std::cout << \"Total: $\" << total << \"\\n\";", "    return 0;", "}"]; },
    run: function (v) { var tip = Math.floor(v.bill * v.percent / 100); return ["Bill: $" + v.bill, "Tip: $" + tip, "Total: $" + (v.bill + tip)]; },
    explain: "bill * percent / 100 is a percent in one line: multiply first, then divide. Because these are ints, the division drops any leftover cents — whole dollars only. Try percent 0 (a very grumpy diner) and percent 50 (a very happy one)." },
  { name: "Magic 8-Ball", file: "8ball.cpp",
    about: "Ask a yes-or-no question, pick a shake number, and the ball answers. A switch statement picks the fortune — the Switch Block, on stage.",
    vars: [{ key: "answer", label: "answer", val: 3, min: 1, max: 8 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int answer = " + v.answer + ";", "    std::cout << \"The Magic 8-Ball says:\\n\";", "    switch (answer) {", "        case 1: std::cout << \"Yes, definitely!\\n\"; break;", "        case 2: std::cout << \"Ask again later.\\n\"; break;", "        case 3: std::cout << \"Signs point to YES!\\n\"; break;", "        default: std::cout << \"The ball is cloudy...\\n\";", "    }", "    return 0;", "}"]; },
    run: function (v) { var a = "The ball is cloudy..."; if (v.answer === 1) a = "Yes, definitely!"; else if (v.answer === 2) a = "Ask again later."; else if (v.answer === 3) a = "Signs point to YES!"; return ["The Magic 8-Ball says:", a]; },
    explain: "switch looks at the answer number and jumps to the matching case, just like the Library's row of doors. Numbers 4 to 8 land on default — the catch-all door for anything without its own case. Change the shake number and a different fortune floats up." },
  { name: "Coin Flip Streak", file: "coinflip.cpp",
    about: "Flip a coin again and again and track your heads streak. The flips follow a secret pattern made with % — can you spot it in the output?",
    vars: [{ key: "flips", label: "flips", val: 6, min: 2, max: 12 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int flips = " + v.flips + ";", "    int streak = 0;", "    for (int i = 0; i < flips; i++) {", "        if (i % 3 == 2) {", "            std::cout << \"Tails\\n\";", "            streak = 0;", "        } else {", "            std::cout << \"Heads\\n\";", "            streak++;", "        }", "    }", "    std::cout << \"Final heads streak: \" << streak << \"\\n\";", "    return 0;", "}"]; },
    run: function (v) { var out = [], s = 0; for (var i = 0; i < v.flips; i++) { if (i % 3 === 2) { out.push("Tails"); s = 0; } else { out.push("Heads"); s++; } } out.push("Final heads streak: " + s); return out; },
    explain: "The coin is not random — i % 3 == 2 makes every third flip land Tails, and streak = 0 wipes the streak clean. Heads grows the streak with streak++. Patterns plus a resettable counter: that is how games track combos." },
  { name: "Multiplication Table", file: "table.cpp",
    about: "Print a whole times table with one loop. The machine multiplies so you do not have to — pick a base number and how many lines to print.",
    vars: [{ key: "base", label: "base", val: 3, min: 2, max: 12 }, { key: "times", label: "times", val: 5, min: 1, max: 10 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int base = " + v.base + ";", "    int times = " + v.times + ";", "    for (int i = 1; i <= times; i++) {", "        std::cout << base << \" x \" << i << \" = \" << base * i << \"\\n\";", "    }", "    return 0;", "}"]; },
    run: function (v) { var out = []; for (var i = 1; i <= v.times; i++) out.push(v.base + " x " + i + " = " + (v.base * i)); return out; },
    explain: "One cout line does every row: it pours the base, the counter i, and the fresh product base * i onto the screen, lap after lap. Change the base and the SAME line prints a completely different table." },
  { name: "Temperature Converter", file: "temp.cpp",
    about: "Turn Celsius into Fahrenheit with one formula: multiply by 9, divide by 5, add 32. Order matters — multiply first, or integer division eats your precision.",
    vars: [{ key: "celsius", label: "celsius", val: 20, min: -20, max: 100 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int celsius = " + v.celsius + ";", "    int fahrenheit = celsius * 9 / 5 + 32;", "    std::cout << celsius << \" C is \" << fahrenheit << \" F\\n\";", "    std::cout << \"Converted!\\n\";", "    return 0;", "}"]; },
    run: function (v) { var f = Math.trunc(v.celsius * 9 / 5) + 32; return [v.celsius + " C is " + f + " F", "Converted!"]; },
    explain: "celsius * 9 / 5 + 32 runs left to right: multiply, divide, then add. Try 100 (boiling water) and -20 (a deep freezer). Fun test: at -40 the two scales meet — but this playground starts at -20, so take the formula's word for it." },
  { name: "Guess the Number", file: "guess.cpp",
    about: "The computer hides a secret number and judges your guess: too low, too high, or bang on. An if / else if / else chain does the judging.",
    vars: [{ key: "secret", label: "secret", val: 7, min: 1, max: 10 }, { key: "guess", label: "guess", val: 5, min: 1, max: 10 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int secret = " + v.secret + ";", "    int guess = " + v.guess + ";", "    if (guess == secret) {", "        std::cout << \"You guessed it!\\n\";", "    } else if (guess < secret) {", "        std::cout << \"Too low! Aim higher.\\n\";", "    } else {", "        std::cout << \"Too high! Aim lower.\\n\";", "    }", "    std::cout << \"The secret was \" << secret << \".\\n\";", "    return 0;", "}"]; },
    run: function (v) { var out = []; if (v.guess === v.secret) out.push("You guessed it!"); else if (v.guess < v.secret) out.push("Too low! Aim higher."); else out.push("Too high! Aim lower."); out.push("The secret was " + v.secret + "."); return out; },
    explain: "Three doors, one chain: == checks a perfect guess first, < catches the low guesses, and the final else catches everything left — the high guesses. Move the guess box until it matches the secret box and the first door opens." },
  { name: "Dice Roller", file: "dice.cpp",
    about: "Roll a die again and again and add up the tumbles. The % symbol keeps every roll inside the die's faces — change the sides and you are rolling a different die.",
    vars: [{ key: "sides", label: "sides", val: 6, min: 2, max: 20 }, { key: "rolls", label: "rolls", val: 4, min: 1, max: 8 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int sides = " + v.sides + ";", "    int rolls = " + v.rolls + ";", "    int total = 0;", "    for (int i = 0; i < rolls; i++) {", "        int roll = (i * 7 + 3) % sides + 1;", "        total += roll;", "        std::cout << \"Roll \" << i + 1 << \": \" << roll << \"\\n\";", "    }", "    std::cout << \"Total: \" << total << \"\\n\";", "    return 0;", "}"]; },
    run: function (v) { var out = [], t = 0; for (var i = 0; i < v.rolls; i++) { var r = (i * 7 + 3) % v.sides + 1; t += r; out.push("Roll " + (i + 1) + ": " + r); } out.push("Total: " + t); return out; },
    explain: "(i * 7 + 3) % sides makes a tumbling pattern of numbers, and % sides keeps the leftovers inside the die — plus 1, because dice start at 1, not 0. A real dice game would use true randomness; this die follows a secret pattern so the show is the same every run." },
  { name: "Password Generator", file: "password.cpp",
    about: "Build a password letter by letter from a tumbling pattern. Each lap of the loop picks the next letter with char arithmetic — letters are numbers underneath.",
    vars: [{ key: "len", label: "len", val: 8, min: 4, max: 14 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int len = " + v.len + ";", "    std::cout << \"Your password: \";", "    for (int i = 0; i < len; i++) {", "        char c = 'a' + (i * 7 + 3) % 26;", "        std::cout << c;", "    }", "    std::cout << \"\\n\";", "    return 0;", "}"]; },
    run: function (v) { var pw = ""; for (var i = 0; i < v.len; i++) pw += String.fromCharCode(97 + (i * 7 + 3) % 26); return ["Your password: " + pw]; },
    explain: "'a' + a number hops forward through the alphabet, and % 26 wraps z back around to a — letters are just numbers wearing costumes. This password follows a pattern so you can watch it work; a real password keeper uses true randomness instead, which no one can predict." },
  { name: "Simple Calculator", file: "calculator.cpp",
    about: "One program, four sums: add, subtract, multiply and divide the same two numbers. Division between ints drops the fraction — watch for it.",
    vars: [{ key: "a", label: "a", val: 12, min: 0, max: 99 }, { key: "b", label: "b", val: 4, min: 1, max: 99 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int a = " + v.a + ";", "    int b = " + v.b + ";", "    std::cout << a << \" + \" << b << \" = \" << a + b << \"\\n\";", "    std::cout << a << \" - \" << b << \" = \" << a - b << \"\\n\";", "    std::cout << a << \" * \" << b << \" = \" << a * b << \"\\n\";", "    std::cout << a << \" / \" << b << \" = \" << a / b << \"\\n\";", "    return 0;", "}"]; },
    run: function (v) { return [v.a + " + " + v.b + " = " + (v.a + v.b), v.a + " - " + v.b + " = " + (v.a - v.b), v.a + " * " + v.b + " = " + (v.a * v.b), v.a + " / " + v.b + " = " + Math.floor(v.a / v.b)]; },
    explain: "Each line pours the numbers AND the fresh answer onto the screen in one chain of << arrows — no answer box needed. Try a = 7 and b = 2: the division line says 3, not 3.5, because int division chops the fraction. That is the calculator being honest about whole numbers." },
  { name: "Grade Averager", file: "grades.cpp",
    about: "Three test grades go in, one average comes out. Add them up, divide by how many there are — the oldest trick in the schoolbook.",
    vars: [{ key: "g1", label: "grade 1", val: 80, min: 0, max: 100 }, { key: "g2", label: "grade 2", val: 90, min: 0, max: 100 }, { key: "g3", label: "grade 3", val: 100, min: 0, max: 100 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int g1 = " + v.g1 + ";", "    int g2 = " + v.g2 + ";", "    int g3 = " + v.g3 + ";", "    int avg = (g1 + g2 + g3) / 3;", "    std::cout << \"Average: \" << avg << \"\\n\";", "    return 0;", "}"]; },
    run: function (v) { return ["Average: " + Math.floor((v.g1 + v.g2 + v.g3) / 3)]; },
    explain: "The parentheses matter: (g1 + g2 + g3) / 3 adds FIRST, then divides — without them, only g3 would be divided. And because these are ints, 269 / 3 reports 89, with the fraction chopped. Report cards everywhere approve of this program." },
  { name: "Star Pyramid Printer", file: "pyramid.cpp",
    about: "Build a pyramid of stars. Two inner loops per row: one prints the spaces that center the row, the other prints an odd number of stars — 1, 3, 5…",
    vars: [{ key: "rows", label: "rows", val: 4, min: 1, max: 7 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int rows = " + v.rows + ";", "    for (int r = 1; r <= rows; r++) {", "        for (int s = 0; s < rows - r; s++) {", "            std::cout << \" \";", "        }", "        for (int s = 0; s < 2 * r - 1; s++) {", "            std::cout << \"*\";", "        }", "        std::cout << \"\\n\";", "    }", "    return 0;", "}"]; },
    run: function (v) { var out = []; for (var r = 1; r <= v.rows; r++) { var line = ""; for (var s = 0; s < v.rows - r; s++) line += " "; for (var s2 = 0; s2 < 2 * r - 1; s2++) line += "*"; out.push(line); } return out; },
    explain: "Three loops working as a team: the outer loop picks the row, the first inner loop prints the shrinking spaces (rows - r of them), and the second prints 2 * r - 1 stars — the odd numbers that make a pyramid's shape. Printing spaces is a real technique: nothing on screen is also a design choice." },
  { name: "Vowel Counter", file: "vowels.cpp",
    about: "Count the vowels hiding in a word. The loop visits every letter and an if with five little questions — is it a? is it e? — tallies the hits. Pick word 1, 2 or 3.",
    vars: [{ key: "pick", label: "word", val: 1, min: 1, max: 3 }],
    code: function (v) { var words = ["programming", "code block", "wizard"]; var w = words[Math.min(2, Math.max(0, v.pick - 1))]; return ["#include <iostream>", "#include <string>", "", "int main() {", "    std::string word = \"" + w + "\";", "    int vowels = 0;", "    for (int i = 0; i < word.size(); i++) {", "        char c = word[i];", "        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {", "            vowels++;", "        }", "    }", "    std::cout << \"Vowels in \" << word << \": \" << vowels << \"\\n\";", "    return 0;", "}"]; },
    run: function (v) { var words = ["programming", "code block", "wizard"]; var w = words[Math.min(2, Math.max(0, v.pick - 1))]; var n = 0; for (var i = 0; i < w.length; i++) { if ("aeiou".indexOf(w[i]) >= 0) n++; } return ["Vowels in " + w + ": " + n]; },
    explain: "word[i] visits the letters one by one, just like boxes in a row — a string is a row of chars. The || symbol means OR: the if fires when the letter matches ANY of the five vowels. Spaces and consonants simply fail all five questions and the loop walks on." },
  { name: "Palindrome Checker", file: "palindrome.cpp",
    about: "A palindrome reads the same forwards and backwards — like radar. The loop compares the first letter with the last, then walks inward. Pick word 1, 2 or 3.",
    vars: [{ key: "pick", label: "word", val: 1, min: 1, max: 3 }],
    code: function (v) { var words = ["radar", "code", "level"]; var w = words[Math.min(2, Math.max(0, v.pick - 1))]; return ["#include <iostream>", "#include <string>", "", "int main() {", "    std::string word = \"" + w + "\";", "    bool ok = true;", "    for (int i = 0; i < word.size() / 2; i++) {", "        if (word[i] != word[word.size() - 1 - i]) {", "            ok = false;", "        }", "    }", "    if (ok) {", "        std::cout << word << \" is a palindrome!\\n\";", "    } else {", "        std::cout << word << \" is not a palindrome.\\n\";", "    }", "    return 0;", "}"]; },
    run: function (v) { var words = ["radar", "code", "level"]; var w = words[Math.min(2, Math.max(0, v.pick - 1))]; var ok = true; for (var i = 0; i < Math.floor(w.length / 2); i++) { if (w[i] !== w[w.length - 1 - i]) ok = false; } return [w + (ok ? " is a palindrome!" : " is not a palindrome.")]; },
    explain: "Only HALF the letters need checking: position i is compared with its mirror twin, size - 1 - i, so the loop stops halfway. One mismatch flips ok to false and it stays false — a single broken mirror breaks the palindrome. Word 2 is the odd one out." },
  { name: "Number Reverser", file: "reverser.cpp",
    about: "Turn 123 into 321 with pure arithmetic. The % peels off the last digit, and building the answer digit by digit flips the whole number.",
    vars: [{ key: "num", label: "num", val: 123, min: 10, max: 9999 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int num = " + v.num + ";", "    int rev = 0;", "    int n = num;", "    while (n > 0) {", "        rev = rev * 10 + n % 10;", "        n /= 10;", "    }", "    std::cout << num << \" reversed is \" << rev << \"\\n\";", "    return 0;", "}"]; },
    run: function (v) { var rev = 0, n = v.num; while (n > 0) { rev = rev * 10 + (n % 10); n = Math.floor(n / 10); } return [v.num + " reversed is " + rev]; },
    explain: "n % 10 always hands you the LAST digit, and n /= 10 chops it off. Each lap glues the peeled digit onto rev (rev * 10 makes room first). The original num is copied into n so the program can still print it at the end — copying to protect the original is a habit worth stealing." },
  { name: "Multiplication Quiz", file: "quiz.cpp",
    about: "The computer asks a times question and judges your answer with one == check. Change the answer box until the judge says Correct.",
    vars: [{ key: "a", label: "a", val: 6, min: 2, max: 12 }, { key: "b", label: "b", val: 7, min: 2, max: 12 }, { key: "answer", label: "answer", val: 42, min: 1, max: 200 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int a = " + v.a + ";", "    int b = " + v.b + ";", "    int answer = " + v.answer + ";", "    std::cout << \"What is \" << a << \" x \" << b << \"?\\n\";", "    if (answer == a * b) {", "        std::cout << \"Correct! Well done.\\n\";", "    } else {", "        std::cout << \"Not quite. It is \" << a * b << \".\\n\";", "    }", "    return 0;", "}"]; },
    run: function (v) { var out = ["What is " + v.a + " x " + v.b + "?"]; if (v.answer === v.a * v.b) out.push("Correct! Well done."); else out.push("Not quite. It is " + (v.a * v.b) + "."); return out; },
    explain: "The judge is a single question: answer == a * b. The product is worked out fresh inside the check, so ANY a and b can be graded by the same two lines. Break the answer on purpose and watch the else door catch you — then fix it and earn the Correct." },
  { name: "Simple Interest", file: "interest.cpp",
    about: "Money in the bank earns interest: principal times rate times years, divided by 100. One formula, and your savings grow on the screen.",
    vars: [{ key: "principal", label: "principal ($)", val: 100, min: 10, max: 1000 }, { key: "rate", label: "rate (%)", val: 5, min: 1, max: 20 }, { key: "years", label: "years", val: 3, min: 1, max: 10 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int principal = " + v.principal + ";", "    int rate = " + v.rate + ";", "    int years = " + v.years + ";", "    int interest = principal * rate * years / 100;", "    std::cout << \"Interest: $\" << interest << \"\\n\";", "    std::cout << \"Total: $\" << principal + interest << \"\\n\";", "    return 0;", "}"]; },
    run: function (v) { var interest = Math.floor(v.principal * v.rate * v.years / 100); return ["Interest: $" + interest, "Total: $" + (v.principal + interest)]; },
    explain: "principal * rate * years / 100 runs left to right: the multiplications pile up first, then one division turns the percent into money. This is SIMPLE interest — the bank pays on the original amount only. Try years = 10 and watch patience pay." },
  { name: "Countdown Timer", file: "timer.cpp",
    about: "A kitchen timer for numbers: a while loop ticks T-minus down to zero, one second at a time, then rings. Same family as the Rocket Countdown, driven by while instead of for.",
    vars: [{ key: "from", label: "from", val: 10, min: 3, max: 15 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int from = " + v.from + ";", "    int t = from;", "    while (t > 0) {", "        std::cout << \"T-minus \" << t << \"\\n\";", "        t--;", "    }", "    std::cout << \"Time is up. Ding!\\n\";", "    return 0;", "}"]; },
    run: function (v) { var out = []; for (var t = v.from; t > 0; t--) out.push("T-minus " + t); out.push("Time is up. Ding!"); return out; },
    explain: "t-- inside the loop is what guarantees the timer ends: every lap moves t one step closer to 0, where the while question flips to no. The Rocket Countdown used a for loop for the same job — two loop shapes, one idea: something MUST change each lap." },
  { name: "Days Until Birthday", file: "birthday.cpp",
    about: "Count the days until a birthday using day-of-the-year numbers. If the birthday already passed this year, the count wraps around into next year — an if/else does the wrapping.",
    vars: [{ key: "today", label: "today (day 1-365)", val: 100, min: 1, max: 365 }, { key: "bday", label: "birthday (day 1-365)", val: 250, min: 1, max: 365 }],
    code: function (v) { return ["#include <iostream>", "", "int main() {", "    int today = " + v.today + ";", "    int bday = " + v.bday + ";", "    int days;", "    if (bday >= today) {", "        days = bday - today;", "    } else {", "        days = 365 - (today - bday);", "    }", "    std::cout << \"Days until your birthday: \" << days << \"\\n\";", "    if (days == 0) {", "        std::cout << \"That is today. Happy birthday!\\n\";", "    }", "    return 0;", "}"]; },
    run: function (v) { var days = v.bday >= v.today ? v.bday - v.today : 365 - (v.today - v.bday); var out = ["Days until your birthday: " + days]; if (days === 0) out.push("That is today. Happy birthday!"); return out; },
    explain: "Days of the year turn calendar math into plain subtraction. Birthday still ahead? Just subtract. Already passed? The else branch counts the days left in this year and keeps going into the next: 365 - (today - bday). Set both boxes equal and the second if throws a tiny party." }
];
var pcIndex = Math.floor(Math.random() * PROJECTS.length);
var pcTimers = [], pcRunning = false;
/* Loop 7 machine state: one helper drives the header status pill
   and the bezel LED together, and moves the screen's blinking
   cursor to the end of whatever the program printed last. The
   run/stop timers and their messages are unchanged — this only
   mirrors them in the frame's chrome. */
function pcSetState(mode, text) {
  var st = $("pcStatus");
  if (st) {
    st.classList.toggle("is-running", mode === "running");
    st.classList.toggle("is-done", mode === "done");
    $("pcStatusText").textContent = text;
  }
  var led = $("pcLed");
  if (led) led.classList.toggle("on", mode === "running" || mode === "done");
}
var pcCursorEl = null;
function pcCursorShow() {
  if (!pcCursorEl) {
    pcCursorEl = document.createElement("span");
    pcCursorEl.className = "pc-cursor";
    pcCursorEl.setAttribute("aria-hidden", "true");
  }
  $("pcScreen").appendChild(pcCursorEl);
}
function pcCursorHide() {
  if (pcCursorEl && pcCursorEl.parentNode) pcCursorEl.parentNode.removeChild(pcCursorEl);
}
function pcVars() {
  var v = {};
  PROJECTS[pcIndex].vars.forEach(function (d) {
    var input = $("pcVar_" + d.key);
    var n = input ? parseInt(input.value, 10) : d.val;
    if (isNaN(n)) n = d.val;
    n = Math.max(d.min, Math.min(d.max, n));
    v[d.key] = n;
  });
  return v;
}
function pcTarget() { return PROJECTS[pcIndex].code(pcVars()).join("\n"); }
function refreshPcCode() {
  var p = PROJECTS[pcIndex], v = pcVars();
  var codeEl = $("pcCode");
  codeEl.innerHTML = "";
  p.code(v).forEach(function (line, li) {
    /* Loop 7: each line becomes a numbered row — a muted gutter
       number beside the line itself. Both are real text in the
       row, so the program still reads and copies plainly. */
    var div = document.createElement("div");
    div.className = "pc-code-row";
    var num = document.createElement("span");
    num.className = "pc-ln"; num.setAttribute("aria-hidden", "true");
    num.textContent = String(li + 1);
    var body = document.createElement("span");
    /* A line too long for a phone wraps with a hanging indent: the
       continuation sits two characters deeper than the line's own
       text, so indentation (which is meaning in Python) stays legible. */
    var lead = line.match(/^ */)[0].length + 2;
    body.style.paddingLeft = lead + "ch";
    body.style.textIndent = -lead + "ch";
    var html = line.replace(/</g, "&lt;");
    p.vars.forEach(function (d) {
      /* The blue box's number, wherever the language declares it:
       int start = 5;  start = 5  let start = 5;  start := 5
       var start: Int = 5  $start = 5;  .parameter set :start 5
       start <- 5 (R)  float Speed = 200.f; (a suffix may follow)
       start is 5 (English++), make a number called start with 5 / let
       start be 5 (English++ Classic) — the
       first match per line. The line is already HTML-escaped here, so
       R's arrow is matched as &lt;-. */
      html = CB_META.preview
        /* HTML & CSS: a CSS property or an attribute — width: 120px,
           --gap: 16px, start="3" — the number before any unit. */
        ? html.replace(new RegExp("((?:^|[\\s;{])(?:--)?" + d.key + ":\\s*|\\b" + d.key + "=\")" + v[d.key] + "(?=(?:px|rem|em|%|ms|s|deg|fr|vw|vh)?(?![\\w.]))"), '$1<span class="hl">' + v[d.key] + "</span>")
        : html.replace(new RegExp("(\\b" + d.key + "(?:\\s*:\\s*[\\w.<>\\[\\]]+)?\\s*(?::?=|&lt;-)\\s*|:" + d.key + "\\s+|\\bcalled " + d.key + " with |\\blet " + d.key + " be |^" + d.key + " is )" + v[d.key] + "(?=(?:\\.0*)?[fFdDmMlLuU]?(?![\\w.]))"), '$1<span class="hl">' + v[d.key] + "</span>");
    });
    body.innerHTML = html === "" ? "&nbsp;" : html;
    div.appendChild(num); div.appendChild(body);
    codeEl.appendChild(div);
  });
  $("pcType").value = "";
  updatePcType();
}
function renderPc(resetScreen) {
  /* Loop 63 — renderPc only ever DEALS a project (first load
     and Surprise me), so the boxes start from the dealt
     project's own defaults. Sampling pcVars() here used to
     read the OUTGOING project's same-named boxes first, so a
     fresh deal could inherit the last project's numbers
     (Star Steps rows = 8 dealt the Star Pyramid at rows = 7)
     instead of the defaults its code and About describe. */
  var p = PROJECTS[pcIndex];
  $("pcPick").value = String(pcIndex);
  $("pcFileName").textContent = p.file;
  $("pcProjectName").textContent = p.name;
  $("pcProjectAbout").textContent = p.about;
  $("pcExplain").textContent = p.explain;
  /* The card explains the idea up front ("How this works"); only
     after a run does it earn the past-tense heading. */
  $("pcExplainHead").textContent = "How this works";
  var varsEl = $("pcVars"); varsEl.innerHTML = "";
  p.vars.forEach(function (d) {
    var wrap = document.createElement("div"); wrap.className = "pc-var";
    var lab = document.createElement("label");
    lab.setAttribute("for", "pcVar_" + d.key);
    /* Loop 63 — the boxes now speak the data's own labels
       ("grade 1", "bill ($)", "word") instead of the raw var
       keys; the range rides along unless the label already
       carries it (the two day-of-year boxes do). */
    var labText = d.label || d.key;
    lab.textContent = (CB_META.varPrefix === undefined ? "int " : CB_META.varPrefix) + labText + (labText.indexOf(d.min + "-" + d.max) >= 0 ? "" : " (" + d.min + "–" + d.max + ")");
    var inp = document.createElement("input");
    inp.type = "number"; inp.id = "pcVar_" + d.key;
    inp.min = d.min; inp.max = d.max; inp.value = d.val;
    /* The program uses the number clamped into its range; when the
       box loses focus it shows that same number, so the box and the
       code never disagree. */
    inp.addEventListener("change", function () {
      var n = parseInt(inp.value, 10);
      inp.value = String(isNaN(n) ? d.val : Math.max(d.min, Math.min(d.max, n)));
      refreshPcCode();
    });
    inp.addEventListener("input", function () {
      pcStop(true);
      refreshPcCode();
      pcScreenNote("You changed a variable, so the code above changed too. Type along again — then Compile & Run and compare the screen.");
    });
    wrap.appendChild(lab); wrap.appendChild(inp);
    varsEl.appendChild(wrap);
  });
  refreshPcCode();
  if (resetScreen) {
    $("pcScreen").innerHTML = '<span class="dim">A fresh project is loaded. Type along with the code, then press Compile &amp; Run.</span>';
    pcCursorHide();
    pcSetState("ready", "Ready");
  }
}
function pcScreenNote(msg) {
  var sc = $("pcScreen");
  sc.innerHTML = "";
  var d = document.createElement("div");
  d.className = "warn"; d.textContent = msg;
  sc.appendChild(d);
  pcSetState("ready", "Edited");
}
/* SPACE FIX: spaces, line breaks and indentation are free in the PC
   editor. The old strict match compared every character — including
   whitespace — against the target, but phone keyboards hold a typed
   space back, merge it with the next word, or fire an autocorrect when
   the spacebar is pressed; the mismatch then truncated the line at
   that spot, so the space (and the word before it) vanished and it
   looked like the spacebar did nothing. Now only the code letters
   themselves are checked, in order; whitespace you type is always
   kept exactly as typed, and the field is never rewritten for it. */
function pcCodeChars(s) { return s.replace(/\s+/g, ""); }
function updatePcType() {
  var target = pcCodeChars(pcTarget());
  var typed = pcCodeChars($("pcType").value);
  var pct = target.length ? Math.round((typed.length / target.length) * 100) : 0;
  $("pcTypeFill").style.width = Math.min(100, pct) + "%";
  $("pcTypeNote").textContent = typed === target && target.length > 0
    ? "The whole program is typed in — beautiful. Now press Compile & Run and watch it come alive."
    : "Typed " + typed.length + " of " + target.length + " characters. Keep going — one wrong letter is gently refused.";
}
var pcEchoFull = false;
$("pcType").addEventListener("input", function () {
  var cleanTarget = pcCodeChars(pcTarget());
  var val = cbFoldCode($("pcType").value);
  if (val !== $("pcType").value) $("pcType").value = val;
  var ci = 0, bad = -1;
  for (var i = 0; i < val.length; i++) {
    if (/\s/.test(val[i])) continue;
    if (ci >= cleanTarget.length || val[i] !== cleanTarget[ci]) { bad = i; break; }
    ci++;
  }
  if (bad >= 0) {
    $("pcType").value = val.slice(0, bad);
    /* Loop 32: the music hears the refused letter too. */
    if (window.__musicEcho) window.__musicEcho("slip");
  } else if (window.__musicEcho) {
    /* Loop 32: correct letters feed the flow; finishing the
       whole program answers like a perfect rep — once per
       completion, not per keystroke after it. */
    var fullNow = cleanTarget.length > 0 && pcCodeChars($("pcType").value) === cleanTarget;
    if (fullNow && !pcEchoFull) window.__musicEcho("rep");
    else if (!fullNow) window.__musicEcho("key");
    pcEchoFull = fullNow;
  }
  updatePcType();
});
function pcStop(silent) {
  pcTimers.forEach(clearTimeout); pcTimers = [];
  pcCursorHide();
  if (pcRunning && !silent) {
    var d = document.createElement("div");
    d.className = "err"; d.textContent = "■ Stopped by you. Change a number above and run it again.";
    $("pcScreen").appendChild(d);
    pcSetState("ready", "Stopped");
  }
  pcRunning = false;
  $("stopBtn").disabled = true;
}
$("stopBtn").addEventListener("click", function () { pcStop(false); });
$("compileBtn").addEventListener("click", function () {
  pcStop(true);
  $("pcExplainHead").textContent = "What just happened?";
  var p = PROJECTS[pcIndex], v = pcVars();
  var sc = $("pcScreen"); sc.innerHTML = "";
  pcRunning = true; $("stopBtn").disabled = false;
  pcSetState("running", "Running");
  pcCursorShow();
  /* Loop 53: a run is a timed reveal — under reduced motion
     every step lands at once, in order, so the full output
     (and its spoken summary) arrives together, not in slices. */
  var pcReduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var steps = [
    { t: 0, html: '<span class="dim">' + (CB_META.run.charAt(0) === "\u25B6" ? "" : "$ ") + CB_META.run.replace(CB_META.file, p.file).replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</span>" },
    { t: pcReduced ? 0 : 500, html: '<span class="dim">' + (pcCodeChars($("pcType").value) === pcCodeChars(pcTarget())
      ? (CB_META.preview ? "Your typed page matches. Opening it:" : "Your typed program matches. Running:")
      : (CB_META.preview ? "Opening the page shown above:" : "Running the program shown above:")) + "</span>" }
  ];
  /* Loop 50 — run() is called ONCE and the lines kept: they
     feed the screen steps AND the spoken summary at the end,
     so ears hear exactly the output eyes saw (a random project
     can no longer tell two different stories). */
  var runLines = p.run(v);
  var finishAt;
  if (CB_META.preview) {
    /* HTML & CSS: no console to print to. The page itself is drawn
       by this browser in a sandboxed frame (no scripts, no forms);
       run() is the text it shows, for the spoken summary. */
    steps.push({ t: pcReduced ? 0 : 1050, frame: pcTarget() });
    finishAt = 1650;
  } else {
    runLines.forEach(function (line, k) {
      steps.push({ t: pcReduced ? 0 : 1050 + k * 430, text: line });
    });
    finishAt = 1050 + runLines.length * 430 + 250;
  }
  steps.push({ t: pcReduced ? 0 : finishAt, html: '<span class="dim">— ' + (CB_META.preview ? "Page open" : "Program finished") + ". Change a number in a blue box and run it again to see a different show. —</span>" });
  steps.forEach(function (s) {
    pcTimers.push(setTimeout(function () {
      var d = document.createElement("div");
      if (s.frame) {
        var f = document.createElement("iframe");
        f.className = "pc-preview";
        f.setAttribute("sandbox", "");
        f.setAttribute("referrerpolicy", "no-referrer");
        f.title = "Your page, drawn by the browser";
        f.srcdoc = s.frame;
        d.appendChild(f);
      } else if (s.html) d.innerHTML = s.html; else d.textContent = s.text;
      sc.appendChild(d);
      if (s === steps[steps.length - 1]) {
        pcRunning = false; $("stopBtn").disabled = true;
        pcCursorHide();
        pcSetState("done", "Finished");
        /* Loop 50 — the PC screen is not a live region (its
           lines land every 430ms and would be read as
           fragments), so when the run lands, speak the whole
           output once, as one utterance. */
        if (window.cbAnnounce) window.cbAnnounce(CB_META.preview
          ? "Page open. It shows: " + runLines.join(" ")
          : "Program finished. " + (runLines.length ? "Output: " + runLines.join(" ") : "No output."));
      } else {
        pcCursorShow();
      }
    }, s.t));
  });
});
/* Every project by name, so a learner can return to one they liked
   instead of waiting for Surprise me to deal it again. */
PROJECTS.forEach(function (p, i) {
  var o = document.createElement("option");
  o.value = String(i); o.textContent = (i + 1) + ". " + p.name;
  $("pcPick").appendChild(o);
});
$("pcPick").addEventListener("change", function () {
  pcStop(true);
  pcIndex = Number(this.value);
  renderPc(true);
  /* The session keeps where you are: picking a project saves it. */
  if (window.cbSessionSave) window.cbSessionSave();
});
$("randomBtn").addEventListener("click", function () {
  pcStop(true);
  var next = pcIndex;
  while (next === pcIndex) next = Math.floor(Math.random() * PROJECTS.length);
  pcIndex = next;
  renderPc(true);
  /* The session keeps where you are: shuffling a project saves it. */
  if (window.cbSessionSave) window.cbSessionSave();
  /* Loop 50 — the shuffle deals a new project in place; eyes
     see the title change, ears hear nothing. Name the deal. */
  if (window.cbAnnounce) window.cbAnnounce("New project: " + PROJECTS[pcIndex].name + " — " + PROJECTS[pcIndex].file);
  window.scrollTo(0, 0);
});
/* Loop 8: the machine keeps real time. A small clock in the
   header tray, refreshed twice a minute — sitting at this PC
   should feel like sitting at a real one. */
(function pcClock() {
  var el = $("pcClock");
  if (!el) return;
  function tick() {
    /* Loop 54 — regression sweep: this was the one interval in
       the app with no rest state. It now follows the 3D world's
       rule — no work while the tab is hidden — and catches up
       the moment the tab returns, so the clock is never stale. */
    if (document.hidden) return;
    var d = new Date(), h = d.getHours(), m = d.getMinutes();
    var hh = h % 12; if (hh === 0) hh = 12;
    el.textContent = hh + ":" + (m < 10 ? "0" : "") + m + (h < 12 ? " AM" : " PM");
  }
  tick();
  setInterval(tick, 20000);
  document.addEventListener("visibilitychange", tick);
})();
renderPc(true);
