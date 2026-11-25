"use strict";
/* ================= ENGLISH++ — a Code Block track =================
   English++ that turns into real C++, written for Code Block from "The
   English++ Book" (for English++ Studio 3), in the book's main form:
   three words on every line — who · the root · what — with the lines
   that belong to a line moved in two spaces under it.
   Every drill, Library line and Vault line is in that form, and only
   that form. English++ Studio is a Windows program, so it can't run in
   the content checks: tests/content/englishpp3.js, a stand-in written
   from the book and pinned to its own examples, runs every PC project
   (its output must match the app) and every Library example, and reads
   every drill and Vault line. Examples marked studio (threads,
   pointers, libraries) are read and checked, not run. */
cbRegisterTrack("englishpp", function () {
  function src(lines) { return lines.join("\n"); }

      var blocks = [
{name:"Hello Block",short:"Hello",chapter:"English++ Book Ch. 2 · Hello!",icon:"i-say",verb:"say",line: "out prn \"Hello!\"",explain:"This line prints \"Hello!\" on the screen. Read it as three words: out means the screen, prn means print a line, and \"Hello!\" is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"first-steps"},
{name:"Number Out Block",short:"Print a number",chapter:"English++ Book Ch. 3 · Your First Program",icon:"i-say",verb:"show",line: "out prn 1",explain:"This line prints the number 1 on the screen. Read it as three words: out means the screen, prn means print a line, and 1 is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"first-steps"},
{name:"Name Block",short:"is",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-box",verb:"store",line: "score is 7",explain:"This line makes score hold the number 7. Read it as three words: score is the name, is makes or changes a thing, and 7 is the value it gets. After this line, score is the number 7.",say:"",category:"names-values"},
{name:"Text Name Block",short:"Text",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-tag",verb:"name",line: "name is \"Ada\"",explain:"This line makes name hold \"Ada\". Read it as three words: name is the name, is makes or changes a thing, and \"Ada\" is the value it gets. After this line, name is \"Ada\".",say:"",category:"names-values"},
{name:"Letter Block",short:"Letter",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-tag",verb:"pick",line: "first is 'A'",explain:"This line makes first hold the letter A. Read it as three words: first is the name, is makes or changes a thing, and 'A' is the value it gets. After this line, first is the letter A.",say:"",category:"names-values"},
{name:"Make Block",short:"mak",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-plus-square",verb:"make",line: "score mak num",explain:"This line makes a new box called score that will hold a whole number. Read it as three words: score is the new name, mak means make, and num is the kind it is made as. It starts as 0, ready for later lines to change it.",say:"",category:"names-values",mk:"46.10"},
{name:"Constant Block",short:"mkn",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-anchor",verb:"keep",line: "DAYS mkn 7",explain:"This line makes a constant called DAYS that holds the number 7 and can never change. Read it as three words: DAYS is the constant's name, mkn means make a constant, and 7 is its value. Any line that tries to change DAYS will not build.",say:"",category:"names-values",mk:"6.4"},
{name:"Yes-No Block",short:"yno",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-box",verb:"yes",line: "ready mak yno",explain:"This line makes an empty box called ready that will hold a yes or a nay. Read it as three words: ready is the new name, mak means make, and yno is the kind it is made as. Left empty, it starts as nay, so printing ready shows nay.",say:"",category:"names-values",mk:"46.10"},
{name:"Small Number Block",short:"sml",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-box",verb:"small",line: "tiny mak sml",explain:"This line makes an empty box called tiny that will hold a small whole number. Read it as three words: tiny is the new name, mak means make, and sml is the kind it is made as. The Book then puts 30000 in it, and printing tiny shows 30000.",say:"",category:"names-values",mk:"46.10"},
{name:"Positive Number Block",short:"pos",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-box",verb:"positive",line: "count mak pos",explain:"This line makes an empty box called count that will hold a whole number that is never below zero. Read it as three words: count is the new name, mak means make, and pos is the kind it is made as. The Book then puts 12 in it, and printing count shows 12.",say:"",category:"names-values",mk:"46.10"},
{name:"Byte Box Block",short:"byt",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-box",verb:"byte",line: "level mak byt",explain:"This line makes an empty box called level that will hold one byte, a whole number from 0 to 255. Read it as three words: level is the new name, mak means make, and byt is the kind it is made as. The Book then puts 200 in it, and printing level shows 200.",say:"",category:"names-values",mk:"46.10"},
{name:"Small Decimal Block",short:"flo",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-box",verb:"small",line: "half mak flo",explain:"This line makes an empty box called half that will hold a small decimal number. Read it as three words: half is the new name, mak means make, and flo is the kind it is made as. The Book then puts 0.5 in it, and printing half shows 0.5.",say:"",category:"names-values",mk:"46.10"},
{name:"Letter Code Block",short:"ltr",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-box",verb:"letter",line: "out prn ltr&65",explain:"This line turns the code number 65 into a letter and prints it on the screen. Read it as three words: out means the screen, prn means print a line, and ltr&65 is the value to print. The letter with code 65 is a capital A, so it prints A.",say:"",category:"names-values"},
{name:"Put Block",short:"put",chapter:"English++ Book Ch. 7 · Printing",icon:"i-say",verb:"write",line: "out put \"one \"",explain:"This line prints \"one \" on the screen and stays on the same line. Read it as three words: out means the screen, put means print without a new line, and \"one \" is the value to print. The next thing printed will follow right after it, on the same line.",say:"",category:"printing"},
{name:"Many Values Block",short:"a&b",chapter:"English++ Book Ch. 7 · Printing",icon:"i-say",verb:"list",line: "out prn name&age",explain:"This line prints name and age on the screen. Read it as three words: out means the screen, prn means print a line, and name&age are the values to print. After it prints, the screen moves to a fresh line.",say:"",category:"printing"},
{name:"Add Block",short:"add",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"add",line: "x add 5",explain:"This line adds the number 5 to x, changing x in place. Read it as three words: x is the thing to change, add means add, and 5 is what to add. After this line, x holds its old value plus the number 5.",say:"",category:"math"},
{name:"Subtract Block",short:"asb",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"take",line: "x asb 3",explain:"This line takes the number 3 away from x, changing x in place. Read it as three words: x is the thing to change, asb means subtract, and 3 is what to take away. After this line, x holds its old value minus the number 3.",say:"",category:"math"},
{name:"Multiply Block",short:"aml",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"double",line: "x aml 2",explain:"This line multiplies x by the number 2, changing x in place. Read it as three words: x is the thing to change, aml means multiply, and 2 is what to multiply by. After this line, x holds its old value times the number 2.",say:"",category:"math"},
{name:"Divide Block",short:"adv",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"share",line: "x adv 4",explain:"This line divides x by the number 4, changing x in place. Read it as three words: x is the thing to change, adv means divide, and 4 is what to divide by. After this line, x holds its old value divided by the number 4.",say:"",category:"math",mk:"8.1"},
{name:"Remainder Block",short:"amd",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"leave",line: "x amd 5",explain:"This line keeps in x what is left when it is divided by the number 5. Read it as three words: x is the thing to change, amd means keep the remainder, and 5 is what to divide by. After this line, x holds the remainder.",say:"",category:"math"},
{name:"Math Block",short:"a+b*2",chapter:"English++ Book Ch. 8 · Math",icon:"i-brackets",verb:"work out",line: "total is a+b",explain:"This line makes total hold a plus b. Read it as three words: total is the name, is makes or changes a thing, and a+b is the value it gets. After this line, total is a plus b.",say:"",category:"math",mk:"8.0"},
{name:"Leftover Block",short:"%",chapter:"English++ Book Ch. 8 · Math",icon:"i-brackets",verb:"check",line: "out prn 7%2",explain:"This line prints what is left when the number 7 is divided by the number 2 on the screen. Read it as three words: out means the screen, prn means print a line, and 7%2 is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"math"},
{name:"Square Root Block",short:"nsq",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"root",line: "y is nsq&16",explain:"This line makes y hold the square root of the number 16. Read it as three words: y is the name, is makes or changes a thing, and nsq&16 is the value it gets. After this line, y is that value.",say:"",category:"math"},
{name:"Random Block",short:"nra",chapter:"English++ Book Ch. 8 · Math",icon:"i-star",verb:"roll",line: "first is nra&1&100",explain:"This line makes first hold a random whole number from 1 to 100. Read it as three words: first is the name, is makes or changes a thing, and nra&1&100 is the value it gets. After this line, first is that value.",say:"",category:"math"},
{name:"Power Block",short:"apw",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"raise",line: "y apw 10",explain:"This line raises y to the power of the number 10, changing y in place. Read it as three words: y is the thing to change, apw means raise to the power, and 10 is the power to raise to. The new value stays in y.",say:"",category:"math"},
{name:"Join Text Block",short:"+ text",chapter:"English++ Book Ch. 9 · Text",icon:"i-link",verb:"join",line: "whole is first+\" \"+last",explain:"This line makes whole hold first plus \" \" plus last. Read it as three words: whole is the name, is makes or changes a thing, and first+\" \"+last is the value it gets. After this line, whole is first plus \" \" plus last.",say:"",category:"text"},
{name:"Has Text Block",short:"ths",chapter:"English++ Book Ch. 9 · Text",icon:"i-search",verb:"find",line: "out prn ths&t&\"lo\"",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and ths&t&\"lo\" is the test to print. It prints yes when \"lo\" is somewhere inside t, and nay when it is not.",say:"",category:"text"},
{name:"Replace Block",short:"trp",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"swap",line: "out prn trp&t&\"World\"&\"You\"",explain:"This line prints t with every \"World\" swapped for \"You\" on the screen. Read it as three words: out means the screen, prn means print a line, and trp&t&\"World\"&\"You\" is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"text"},
{name:"Part of Text Block",short:"tcu",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"cut",line: "out prn tcu&t&0&5",explain:"This line prints the part of t from position 0, 5 letters long on the screen. Read it as three words: out means the screen, prn means print a line, and tcu&t&0&5 is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"text"},
{name:"Number to Text Block",short:"txt&",chapter:"English++ Book Ch. 9 · Text",icon:"i-swap-h",verb:"turn",line: "line is \"n is \"+txt&n",explain:"This line makes line hold \"n is \" plus n written as text. Read it as three words: line is the name, is makes or changes a thing, and \"n is \"+txt&n is the value it gets. After this line, line is that value.",say:"",category:"lists"},
{name:"Compare Block",short:"x>3",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-toggle",verb:"test",line: "old_enough is age>=6",explain:"This line makes old_enough hold whether age is at least the number 6. Read it as three words: old_enough is the name, is makes or changes a thing, and age>=6 is the value it gets. After this line, old_enough is that value.",say:"",category:"tests-choices"},
{name:"And Block",short:"&&",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-toggle",verb:"join",line: "out prn age>5&&tall",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and age>5&&tall is the test to print. It prints yes when age is more than the number 5 and tall is yes, and nay when it is not.",say:"",category:"printing"},
{name:"Not Block",short:"!",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-toggle",verb:"flip",line: "out prn !tall",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and !tall is the test to print. It prints yes when tall is nay, and nay when it is not.",say:"",category:"printing"},
{name:"If Block",short:"ilt",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-fork",verb:"choose",line: "x ilt 3",explain:"This line runs the lines under it only when x passes the test. Read it as three words: x is the value to test, ilt means if less than, and 3 is the value to compare with. Here the test is whether x is less than the number 3.",say:"",category:"tests-choices"},
{name:"If Equal Block",short:"ieq",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-fork",verb:"match",line: "x ieq 3",explain:"This line runs the lines under it only when x passes the test. Read it as three words: x is the value to test, ieq means if equal, and 3 is the value to compare with. Here the test is whether x is the same as the number 3.",say:"",category:"tests-choices"},
{name:"If Not Equal Block",short:"ine",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-fork",verb:"differ",line: "x ine 3",explain:"This line runs the lines under it only when x passes the test. Read it as three words: x is the value to test, ine means if not equal, and 3 is the value to compare with. Here the test is whether x is different from the number 3.",say:"",category:"tests-choices"},
{name:"If Greater Block",short:"igt",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-fork",verb:"beat",line: "x igt 3",explain:"This line runs the lines under it only when x passes the test. Read it as three words: x is the value to test, igt means if greater than, and 3 is the value to compare with. Here the test is whether x is more than the number 3.",say:"",category:"tests-choices",mk:"46.13"},
{name:"Otherwise-If Block",short:"olt",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-help",verb:"ask again",line: "x olt 5",explain:"This line runs its lines when the first test failed and x passes this one. Read it as three words: x is the value to test, olt means otherwise, if less than, and 5 is the value to compare with. Here the test is whether x is less than the number 5.",say:"",category:"tests-choices"},
{name:"Otherwise Block",short:"oth",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-swap-h",verb:"fall back",line: "now oth now",explain:"This line opens an otherwise block. Read it as three words: now means there is nothing to say, oth means otherwise, and now means the same again. The lines under it run only when the test above it was not true.",say:"",category:"tests-choices",mk:"11.0"},
{name:"Switch Block",short:"bsw",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-toggle",verb:"pick",line: "day bsw now",explain:"This line opens a switch on day. Read it as three words: day is the value to switch on, bsw means switch, and now means there is nothing to say. The value of day is compared with each case under it.",say:"",category:"tests-choices"},
{name:"Case Block",short:"bcs",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-toggle",verb:"case",line: "now bcs 6&7",explain:"This line says this case runs when the value is 6 or 7. Read it as three words: now means there is nothing to say, bcs means case, and 6&7 are the values this case runs for. The lines under it run only when the value matches.",say:"",category:"tests-choices"},
{name:"Default Block",short:"bdf",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-toggle",verb:"else",line: "now bdf now",explain:"This line says these lines run when no case matched. Read it as three words: now means there is nothing to say, bdf means default, and now means the same again. It is the fall-back case of the switch.",say:"",category:"tests-choices"},
{name:"Count Block",short:"flt",chapter:"English++ Book Ch. 12 · Loops",icon:"i-repeat",verb:"count",line: "i flt 5",explain:"This line counts i up from 0 while it is less than 5, running the lines under it each time. Read it as three words: i is the counter, flt means for, less than, and 5 is where the counting stops. Here the lines under it run 5 times, with i going 0, 1, 2, and so on.",say:"",category:"loops"},
{name:"Count To Block",short:"fle",chapter:"English++ Book Ch. 12 · Loops",icon:"i-repeat",verb:"count",line: "k fle 3",explain:"This line counts k up from 0 up to and including 3, running the lines under it each time. Read it as three words: k is the counter, fle means for, up to and including, and 3 is where the counting stops. Here the lines under it run 4 times, with k going 0, 1, 2, and 3.",say:"",category:"loops"},
{name:"Count Down Block",short:"fgt",chapter:"English++ Book Ch. 12 · Loops",icon:"i-repeat",verb:"count down",line: "count fgt 0",explain:"This line counts count down while it is still more than 0, running the lines under it each time. Read it as three words: count is the counter, fgt means for, greater than, and 0 is where the counting stops. Here the lines under it run while count is still more than 0, counting down by one each time.",say:"",category:"loops"},
{name:"Each Block",short:"fea",chapter:"English++ Book Ch. 12 · Loops",icon:"i-visit",verb:"visit",line: "s fea scores",explain:"This line walks through scores one item at a time, calling each item s. Read it as three words: s is the name for each item, fea means for each, and scores is the collection to walk. Here the lines under it run once for every item in scores, with s holding that item.",say:"",category:"loops",mk:"17.0"},
{name:"While Block",short:"wgt",chapter:"English++ Book Ch. 12 · Loops",icon:"i-clock",verb:"wait",line: "d wgt 2",explain:"This line repeats the lines under it while d passes the test. Read it as three words: d is the value to test, wgt means while greater than, and 2 is the value to compare with. Here the test is whether d is more than the number 2, so the loop keeps going while that stays true.",say:"",category:"loops"},
{name:"While Less Block",short:"wlt",chapter:"English++ Book Ch. 12 · Loops",icon:"i-clock",verb:"climb",line: "n wlt 100",explain:"This line repeats the lines under it while n passes the test. Read it as three words: n is the value to test, wlt means while less than, and 100 is the value to compare with. Here the test is whether n is less than the number 100, so the loop keeps going while that stays true.",say:"",category:"loops"},
{name:"Forever Block",short:"wfv",chapter:"English++ Book Ch. 12 · Loops",icon:"i-rotate",verb:"repeat",line: "now wfv now",explain:"This line opens a loop that runs forever. Read it as three words: now means there is nothing to say, wfv means while forever, and now means the same again. The lines under it repeat until a break line leaves the loop.",say:"",category:"loops"},
{name:"Break Block",short:"ebk",chapter:"English++ Book Ch. 12 · Loops",icon:"i-stop",verb:"leave",line: "now ebk now",explain:"This line leaves the loop right now. Read it as three words: now means there is nothing to say, ebk means break, and now means the same again. The program carries on with the line after the loop.",say:"",category:"loops",mk:"46.33"},
{name:"Break When Block",short:"ebk test",chapter:"English++ Book Ch. 12 · Loops",icon:"i-stop",verb:"stop",line: "now ebk n==3",explain:"This line leaves the loop when n is the same as the number 3. Read it as three words: now means there is nothing to say, ebk means break, and n==3 is the test to leave on. The loop stops early, as soon as n is the same as the number 3.",say:"",category:"loops",mk:"46.33"},
{name:"Next Turn Block",short:"enx",chapter:"English++ Book Ch. 12 · Loops",icon:"i-chev-right",verb:"skip",line: "i enx i==1",explain:"This line skips to the next turn of the loop when i is the same as the number 1. Read it as three words: i is the counter, enx means next, and i==1 is the test to skip on. The rest of this turn is left out when that is true.",say:"",category:"loops"},
{name:"Do Block",short:"bdo",chapter:"English++ Book Ch. 12 · Loops",icon:"i-rotate",verb:"do",line: "now bdo now",explain:"This line opens a do block. Read it as three words: now means there is nothing to say, bdo means do, and now means the same again. The lines under it run once, and then the until line at the end decides whether to run them again.",say:"",category:"loops",mk:"12.0"},
{name:"Until Block",short:"uge",chapter:"English++ Book Ch. 12 · Loops",icon:"i-flag",verb:"finish",line: "n uge 6",explain:"This line ends a do block, and the loop keeps going until n passes the test. Read it as three words: n is the value to test, uge means until greater than or equal to, and 6 is the value to compare with. Here the test is whether n is at least the number 6.",say:"",category:"loops"},
{name:"Repeat Text Block",short:"tre",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-repeat",verb:"repeat",line: "out prn tre&\"ha\"&3",explain:"This line prints the text \"ha\" repeated 3 times on the screen. Read it as three words: out means the screen, prn means print a line, and tre&\"ha\"&3 is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"text"},
{name:"Pattern Block",short:"tfa",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-pencil",verb:"fill in",line: "out prn tfa&\"{} has {} points\"&name&score",explain:"This line prints the text \"{} has {} points\" with its holes filled by name and score on the screen. Read it as three words: out means the screen, prn means print a line, and tfa&\"{} has {} points\"&name&score is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"text"},
{name:"Ask Block",short:"get",chapter:"English++ Book Ch. 14 · Talking With Your Program",icon:"i-keyboard",verb:"listen",line: "name get \"Name? \"",explain:"This line shows the question \"Name? \" and waits for an answer, keeping it in name. Read it as three words: name is the box the answer goes into, get means get, and \"Name? \" is the question to show. The question is shown first, then the program waits for the answer.",say:"",category:"talking-watching"},
{name:"Empty List Block",short:"vec@num",chapter:"English++ Book Ch. 17 · Lists",icon:"i-boxes",verb:"prepare",line: "scores mak vec@num",explain:"This line makes an empty box called scores that will hold a list of whole numbers. Read it as three words: scores is the new name, mak means make, and vec@num is the kind it is made as. It starts empty, ready for later lines to fill it.",say:"",category:"lists"},
{name:"Position Block",short:"@0",chapter:"English++ Book Ch. 17 · Lists",icon:"i-boxes",verb:"reach",line: "out prn scores@0",explain:"This line prints the item at position 0 of scores on the screen. Read it as three words: out means the screen, prn means print a line, and scores@0 is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"printing"},
{name:"Insert Block",short:"lin",chapter:"English++ Book Ch. 17 · Lists",icon:"i-plus-square",verb:"insert",line: "v lin 0&8",explain:"This line puts 8 into v at position 0. Read it as three words: v is the list, lin means insert, and 0&8 is the position and the value to put there. The items from position 0 on move along to make room.",say:"",category:"lists"},
{name:"Remove Block",short:"lrm",chapter:"English++ Book Ch. 17 · Lists",icon:"i-x",verb:"remove",line: "v lrm 3",explain:"This line takes the number 3 out of the list v. Read it as three words: v is the list, lrm means remove, and 3 is the value to take out. After this line, v no longer holds the number 3.",say:"",category:"lists"},
{name:"Remove At Block",short:"ldx",chapter:"English++ Book Ch. 17 · Lists",icon:"i-x",verb:"drop",line: "v ldx 0",explain:"This line takes out the item at position 0 of v. Read it as three words: v is the list, ldx means remove position, and 0 is the position to take out. The items after it move up to fill the gap.",say:"",category:"lists"},
{name:"Pop Block",short:"lpl",chapter:"English++ Book Ch. 17 · Lists",icon:"i-x",verb:"pop",line: "v lpl now",explain:"This line takes the last item off v. Read it as three words: v is the list, lpl means pop last, and now means there is nothing to say. The list is one item shorter.",say:"",category:"lists"},
{name:"Sort Block",short:"lso",chapter:"English++ Book Ch. 17 · Lists",icon:"i-sliders",verb:"sort",line: "v lso now",explain:"This line sorts v from smallest to biggest. Read it as three words: v is the list, lso means sort, and now means there is nothing to say. After this line, the items are in order.",say:"",category:"lists"},
{name:"Has Item Block",short:"chs",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-search",verb:"look",line: "out prn chs&v&9",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and chs&v&9 is the test to print. It prints yes when v holds the number 9, and nay when it is not.",say:"",category:"lists"},
{name:"Map Block",short:"map@txt@num",chapter:"English++ Book Ch. 19 · Maps",icon:"i-grid",verb:"file",line: "ages mak map@txt@num",explain:"This line makes an empty box called ages that will hold a map from a text to a whole number. Read it as three words: ages is the new name, mak means make, and map@txt@num is the kind it is made as. It starts empty, ready for later lines to fill it.",say:"",category:"maps-collections"},
{name:"Function Block",short:"dfn",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play-circle",verb:"run",line: "add_up dfn num",explain:"This line defines a function called add_up that gives back a whole number. Read it as three words: add_up is the function's name, dfn means define a function, and num is the kind it gives back. The lines under it are the function's body, and they run when the function is called.",say:"",category:"functions",mk:"21.2"},
{name:"Parameter Block",short:"dpm",chapter:"English++ Book Ch. 21 · Functions",icon:"i-tag",verb:"take",line: "a dpm num",explain:"This line says the function takes a whole number called a. Read it as three words: a is the name, dpm means parameter, and num is the kind it is made as. Every call gives it a value of that kind.",say:"",category:"functions",mk:"46.21"},
{name:"Return Block",short:"ert",chapter:"English++ Book Ch. 21 · Functions",icon:"i-go",verb:"answer",line: "add_up ert a+b",explain:"This line hands back a plus b. Read it as three words: add_up is the function's name, ert means return, and a+b is the value to hand back. The function stops here, and the caller carries on with what was handed back.",say:"",category:"functions",mk:"46.26"},
{name:"Run Block",short:"now f",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play",verb:"run",line: "now greet \"Ada\"",explain:"This line runs the function greet, giving it \"Ada\". Read it as three words: now means there is nothing to say, greet is the function's name, and \"Ada\" is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"functions"},
{name:"Reference Block",short:"mrf",chapter:"English++ Book Ch. 21 · Functions",icon:"i-link",verb:"share",line: "also mrf x",explain:"This line makes also another name for the very same box as x. Read it as three words: also is the new name, mrf means make a reference, and x is the box it is another name for. Changing also changes x, because they are one box with two names.",say:"",category:"functions"},
{name:"Lambda Block",short:"dlm",chapter:"English++ Book Ch. 22 · Functions in a Name",icon:"i-lambda",verb:"keep",line: "twice dlm num",explain:"This line makes a function called twice in a name, one that gives back a whole number. Read it as three words: twice is the function's name, dlm means define a lambda, and num is the kind it gives back. The function lives in twice and can be called like any other.",say:"",category:"functions",mk:"46.28"},
{name:"Zip Block",short:"czp",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-link",verb:"zip",line: "n&a fea czp&names&ages",explain:"This line walks through names and ages side by side, calling each pair n and a. Read it as three words: n&a are the names for each pair, fea means for each, and czp&names&ages names the two lists. Here the lines under it run once for every pair, with n holding the name and a the matching age.",say:"",category:"loops",mk:"17.0"},
{name:"Numbered Block",short:"cnu",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-list",verb:"number",line: "k&n fea cnu&names",explain:"This line walks through names one item at a time, with a number for each. Read it as three words: k&n are the names for each pair, fea means for each, and cnu&names is the list with each item numbered. Here the lines under it run once for every name, with k its number, starting from 0, and n the name.",say:"",category:"loops",mk:"17.0"},
{name:"Rotate Block",short:"lrw",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-rotate",verb:"turn",line: "cards lrw 1",explain:"This line takes the first item of cards and puts it at the end. Read it as three words: cards is the list, lrw means rotate, and 1 is how many places to move. The rest of the items move up by one place.",say:"",category:"lists"},
{name:"Stable Sort Block",short:"lss",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-sliders",verb:"sort",line: "names lss shorter",explain:"This line sorts names using shorter to compare them, keeping ties in their old order. Read it as three words: names is the list, lss means sort, keeping ties in order, and shorter is how to compare two items. After this line, names is in order, and items that tied stayed where they were.",say:"",category:"lists"},
{name:"Any Number Block",short:"dpm vec@",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-boxes",verb:"gather",line: "xs dpm vec@num",explain:"This line says the function takes the values left over, gathered into a list of whole numbers called xs. Read it as three words: xs is the name, dpm means parameter, and vec@num is the kind it is made as. A call can hand it any number of values, and they all arrive in xs.",say:"",category:"functions",mk:"46.21"},
{name:"Saved Name Block",short:"msv",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-anchor",verb:"keep",line: "n msv 0",explain:"This line makes a box called n that starts as the number 0 and keeps its value between calls. Read it as three words: n is the box's name, msv means make a kept value, and 0 is its starting value. The next call finds n just as the last call left it.",say:"",category:"functions"},
{name:"Own Copies Block",short:"dlv",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-lambda",verb:"copy",line: "copy dlv num",explain:"This line makes a function called copy in a name, one that keeps its own copies of the names it uses. Read it as three words: copy is the function's name, dlv means define a lambda with its own copies, and num is the kind it gives back. Changing a name outside cannot change the copy inside.",say:"",category:"functions"},
{name:"Compile Time Block",short:"dcx",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-gear",verb:"precompute",line: "square dcx num",explain:"This line defines a function called square that gives back a whole number and is worked out while the program is being built. Read it as three words: square is the function's name, dcx means define a function for compile time, and num is the kind it gives back. The answer is ready before the program starts.",say:"",category:"functions"},
{name:"Generator Block",short:"gnr@num",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-repeat",verb:"hand out",line: "evens dfn gnr@num",explain:"This line defines a function called evens that gives back whole numbers worked out one at a time. Read it as three words: evens is the function's name, dfn means define a function, and gnr@num is the kind it gives back. The lines under it are the function's body, and they run when the function is called.",say:"",category:"functions",mk:"21.2"},
{name:"Yield Block",short:"eyd",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-yield",verb:"yield",line: "evens eyd i",explain:"This line hands over i and waits. Read it as three words: evens is the generator's name, eyd means yield, and i is the value to hand over. The generator pauses here until the next value is asked for.",say:"",category:"functions"},
{name:"Clean Up Block",short:"bdr",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-check",verb:"tidy",line: "now bdr now",explain:"This line opens a block whose lines run when the block around it ends. Read it as three words: now means there is nothing to say, bdr means when this block is over, and now means the same again. It is the place for tidying up.",say:"",category:"functions"},
{name:"Should Block",short:"seq",chapter:"English++ Book Ch. 25 · Checks and Tests",icon:"i-clipboard",verb:"check",line: "x seq 3",explain:"This line checks that x passes the test, and stops the program here if it does not. Read it as three words: x is the value to test, seq means should be equal, and 3 is the value to compare with. Here the test is whether x is the same as the number 3.",say:"",category:"checks-tests"},
{name:"Test Block",short:"bts",chapter:"English++ Book Ch. 25 · Checks and Tests",icon:"i-check",verb:"test",line: "now bts \"adding small numbers\"",explain:"This line makes a test called \"adding small numbers\". Read it as three words: now means there is nothing to say, bts means test, and \"adding small numbers\" is the test's name. It runs with the other tests when you choose Build > Run Tests, and pressing F5 skips it.",say:"",category:"checks-tests"},
{name:"Class Block",short:"dcl",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-shapes",verb:"shape",line: "Dog dcl now",explain:"This line defines a new kind of thing called Dog. Read it as three words: Dog is the new kind's name, dcl means define a class, and now means there is nothing to say. The lines under it are the kind's fields and functions.",say:"",category:"classes",mk:"46.16"},
{name:"Field Block",short:"dfd",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-brick",verb:"hold",line: "age dfd 3",explain:"This line gives the kind a field called age that starts as the number 3. Read it as three words: age is the field's name, dfd means define a field, and 3 is its starting value. Every thing of this kind gets its own age.",say:"",category:"classes",mk:"46.29"},
{name:"Maker Block",short:"dmk",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-gear",verb:"build",line: "Dog dmk now",explain:"This line opens the lines that run when a new Dog is made. Read it as three words: Dog is the kind's name, dmk means define how it is made, and now means there is nothing to say. The lines under it set the new thing up.",say:"",category:"classes"},
{name:"Make One Block",short:"mak Dog",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-plus-square",verb:"make",line: "a mak Dog&\"Rex\"",explain:"This line makes a new Dog called a, made with \"Rex\". Read it as three words: a is the new name, mak means make, and Dog&\"Rex\" is the kind and what it is made with. It is made with \"Rex\" from the start.",say:"",category:"classes"},
{name:"Method Block",short:"rex bark",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-play",verb:"ask",line: "rex bark now",explain:"This line asks rex to bark. Read it as three words: rex is the thing to act on, bark is what it should do, and now means there is nothing to say. The thing does it, and the program carries on with the next line.",say:"",category:"classes"},
{name:"Secret Field Block",short:"dsc",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-lock",verb:"hide",line: "money dsc 0",explain:"This line gives the kind a secret field called money that starts as the number 0. Read it as three words: money is the field's name, dsc means define a secret field, and 0 is its starting value. Only the kind's own lines can see money.",say:"",category:"classes",mk:"26.0"},
{name:"Base Block",short:"dbs",chapter:"English++ Book Ch. 27 · Children",icon:"i-tree",verb:"pass up",line: "now dbs given",explain:"This line hands given to the parent kind first, so the parent is made before this kind's own lines run. Read it as three words: now means there is nothing to say, dbs means define the base, and given is what the parent is made with. The parent's maker runs before this kind's maker.",say:"",category:"classes"},
{name:"Virtual Block",short:"dvr",chapter:"English++ Book Ch. 27 · Children",icon:"i-layers",verb:"promise",line: "sound dvr txt",explain:"This line defines a function called sound that gives back a text and that a child kind may change. Read it as three words: sound is the function's name, dvr means define a virtual function, and txt is the kind it gives back. A child kind can write its own version of sound.",say:"",category:"classes"},
{name:"Override Block",short:"dov",chapter:"English++ Book Ch. 27 · Children",icon:"i-layers",verb:"redo",line: "sound dov txt",explain:"This line defines the child kind's own version of sound, which gives back a text. Read it as three words: sound is the function's name, dov means override, and txt is the kind it gives back. When sound is called on this kind, this version runs.",say:"",category:"classes",mk:"27.0"},
{name:"Struct Block",short:"dst",chapter:"English++ Book Ch. 28 · More Kinds of Your Own",icon:"i-grid",verb:"pack",line: "Spot dst now",explain:"This line defines a simple kind called Spot that just holds values. Read it as three words: Spot is the new kind's name, dst means define a struct, and now means there is nothing to say. The lines under it are the values it holds.",say:"",category:"classes"},
{name:"Enum Block",short:"den",chapter:"English++ Book Ch. 28 · More Kinds of Your Own",icon:"i-list",verb:"choose",line: "Mood den happy&sad",explain:"This line defines a kind called Mood with the fixed choices happy and sad. Read it as three words: Mood is the new kind's name, den means define an enum, and happy&sad is the choices it can be. A Mood can only ever be one of those choices.",say:"",category:"classes",mk:"28.0"},
{name:"Template Block",short:"dtp",chapter:"English++ Book Ch. 29 · Any Kind",icon:"i-stamp",verb:"stamp",line: "T dtp now",explain:"This line says T is a kind to be filled in later. Read it as three words: T is the kind's name, dtp means define a type, and now means there is nothing to say. When the thing is used, the kind is filled in with a real one.",say:"",category:"classes"},
{name:"Pointer Block",short:"mpt",chapter:"English++ Book Ch. 30 · Pointers",icon:"i-point",verb:"point",line: "p mpt x",explain:"This line makes p point at the box x. Read it as three words: p is the new pointer's name, mpt means make a pointer, and x is the box it points at. Through p, the program can reach x without saying its name.",say:"",category:"pointers"},
{name:"New Block",short:"mnw",chapter:"English++ Book Ch. 30 · Pointers",icon:"i-point-spark",verb:"make",line: "p mnw Torch",explain:"This line makes a brand-new Torch and lets p point at it. Read it as three words: p is the pointer's name, mnw means make new, and Torch is the kind to make. The new Torch lives until it is deleted.",say:"",category:"pointers"},
{name:"Delete Block",short:"edl",chapter:"English++ Book Ch. 30 · Pointers",icon:"i-x",verb:"free",line: "now edl p",explain:"This line deletes what p points to and sets p to nothing. Read it as three words: now means there is nothing to say, edl means delete, and p is the pointer. The memory is given back.",say:"",category:"pointers"},
{name:"At Operator Block",short:"at dop",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-point",verb:"reach",line: "at dop ref@num",explain:"This line says how at works, the way to reach one item of a Row, giving back a number reference. Read it as three words: at is the operator's name, dop means define an operator, and ref@num is what it gives back. After this, r@0 reaches the first number of the row, ready to read or change in place.",say:"",category:"classes"},
{name:"Call Operator Block",short:"call dop",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-play",verb:"call",line: "call dop num",explain:"This line says what happens when a thing of this kind is called like a function, giving back a whole number. Read it as three words: call is the operator's name, dop means define an operator, and num is the kind the call gives back. After this, a thing of this kind can be called with &, and it hands back a whole number.",say:"",category:"classes"},
{name:"Really Is Block",short:"ptr@Dog&p",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-eye",verb:"check",line: "dog is ptr@Dog&p",explain:"This line asks whether p is really a Dog, and gives a Dog pointer or nil. Read it as three words: dog is the new name, is makes or changes a thing, and ptr@Dog&p is the test to run. If p is a Dog, dog points at it, and if it is not, dog is nil.",say:"",category:"names-values"},
{name:"Bit Field Block",short:"dbb",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-toggle",verb:"pack",line: "ready dbb 1",explain:"This line gives the kind a field called ready that holds just 1 bit. Read it as three words: ready is the field's name, dbb means define a field of a few bits, and 1 is how many bits it holds. It is a tiny on-or-off switch inside the kind.",say:"",category:"classes"},
{name:"Try Block",short:"btr",chapter:"English++ Book Ch. 33 · When Things Go Wrong",icon:"i-shield-check",verb:"try",line: "now btr now",explain:"This line opens a try block. Read it as three words: now means there is nothing to say, btr means try, and now means the same again. The lines under it are tried, and if one throws a problem, a catch block can take it.",say:"",category:"errors",mk:"46.32"},
{name:"Catch Block",short:"bch",chapter:"English++ Book Ch. 33 · When Things Go Wrong",icon:"i-shield-check",verb:"rescue",line: "e bch now",explain:"This line opens a catch block, and the problem that was thrown is kept in e. Read it as three words: e is the name for the problem, bch means catch, and now means there is nothing to say. The lines under it run only when a problem was thrown.",say:"",category:"errors"},
{name:"Throw Block",short:"etw",chapter:"English++ Book Ch. 33 · When Things Go Wrong",icon:"i-shield-alert",verb:"warn",line: "now etw \"bad\"",explain:"This line throws the problem \"bad\". Read it as three words: now means there is nothing to say, etw means throw, and \"bad\" is the problem to throw. The program stops here unless a catch block is waiting.",say:"",category:"errors"},
{name:"Huge From Text Block",short:"hug&",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-star",verb:"read",line: "x is hug&\"123456789012345678901234567890\"",explain:"This line makes x hold the huge number made from \"123456789012345678901234567890\". Read it as three words: x is the name, is makes or changes a thing, and hug&\"123456789012345678901234567890\" is the value it gets. After this line, x is the huge number made from \"123456789012345678901234567890\".",say:"",category:"bits-big"},
{name:"Complex Block",short:"cpx",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-waves",verb:"pair",line: "p mak cpx&1.0&2.0",explain:"This line makes a new complex number called p, made with 1.0 and 2.0. Read it as three words: p is the new name, mak means make, and cpx&1.0&2.0 is the kind and what it is made with. It is made with 1.0 and 2.0 from the start.",say:"",category:"bits-big"},
{name:"Write File Block",short:"hwr",chapter:"English++ Book Ch. 35 · Files",icon:"i-file",verb:"save",line: "\"a.txt\" hwr \"hello\"",explain:"This line writes \"hello\" into the file \"a.txt\". Read it as three words: \"a.txt\" is the file, hwr means write a whole file, and \"hello\" is what to write. If the file was already there, everything in it is replaced, and no line end is added unless you write \\n.",say:"",category:"files"},
{name:"Append Block",short:"hap",chapter:"English++ Book Ch. 35 · Files",icon:"i-file",verb:"add on",line: "\"a.txt\" hap \"more\"",explain:"This line adds \"more\" to the end of the file \"a.txt\". Read it as three words: \"a.txt\" is the file, hap means append, and \"more\" is what to add. The old lines of the file stay where they were.",say:"",category:"files"},
{name:"Wait Block",short:"rwt",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-hourglass",verb:"wait",line: "now rwt 100",explain:"This line makes the program wait for 100 milliseconds. Read it as three words: now means there is nothing to say, rwt means wait, and 100 is how many milliseconds to wait. Then the program carries on with the next line.",say:"",category:"clock-threads"},
{name:"Today Date Block",short:"kda",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-nodes",verb:"todays",line: "out prn kda",explain:"This line prints today's date on the screen. Read it as three words: out means the screen, prn means print a line, and kda is the value to print. The date depends on the day it runs, so the Book shows no fixed output.",say:"",category:"clock-threads"},
{name:"Time Now Block",short:"ktm",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-nodes",verb:"time",line: "out prn ktm",explain:"This line prints the time right now on the screen. Read it as three words: out means the screen, prn means print a line, and ktm is the value to print. The time changes every run, so the Book shows no fixed output.",say:"",category:"clock-threads"},
{name:"Week Day Block",short:"kwk",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-nodes",verb:"day",line: "out prn kwk",explain:"This line prints the name of today's day of the week. Read it as three words: out means the screen, prn means print a line, and kwk is the value to print. The day depends on when it runs, so the Book shows no fixed output.",say:"",category:"clock-threads"},
{name:"Current Year Block",short:"kyr",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-nodes",verb:"year",line: "out prn kyr",explain:"This line prints the year it is now. Read it as three words: out means the screen, prn means print a line, and kyr is the value to print. The year depends on when it runs, so the Book shows no fixed output.",say:"",category:"clock-threads"},
{name:"Current Month Block",short:"kmo",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-nodes",verb:"month",line: "out prn kmo",explain:"This line prints the month it is now. Read it as three words: out means the screen, prn means print a line, and kmo is the value to print. The month depends on when it runs, so the Book shows no fixed output.",say:"",category:"clock-threads"},
{name:"Month Day Block",short:"kdy",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-nodes",verb:"day",line: "out prn kdy",explain:"This line prints the day of the month it is now. Read it as three words: out means the screen, prn means print a line, and kdy is the value to print. The day depends on when it runs, so the Book shows no fixed output.",say:"",category:"clock-threads"},
{name:"Current Hour Block",short:"khr",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-nodes",verb:"hour",line: "out prn khr",explain:"This line prints the hour it is now. Read it as three words: out means the screen, prn means print a line, and khr is the value to print. The hour depends on when it runs, so the Book shows no fixed output.",say:"",category:"clock-threads"},
{name:"Current Minute Block",short:"kmi",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-nodes",verb:"minute",line: "out prn kmi",explain:"This line prints the minute it is now. Read it as three words: out means the screen, prn means print a line, and kmi is the value to print. The minute depends on when it runs, so the Book shows no fixed output.",say:"",category:"clock-threads"},
{name:"Current Second Block",short:"kse",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-nodes",verb:"second",line: "out prn kse",explain:"This line prints the second it is now. Read it as three words: out means the screen, prn means print a line, and kse is the value to print. The second changes all the time, so the Book shows no fixed output.",say:"",category:"clock-threads"},
{name:"Clock Block",short:"kel",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-clock",verb:"time",line: "out prn kel>0",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and kel>0 is the test to print. It prints yes when the seconds since the program started is more than the number 0, and nay when it is not.",say:"",category:"tests-choices"},
{name:"Thread Block",short:"mtd",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-nodes",verb:"start",line: "t mtd count_to&3",explain:"This line starts a thread called t that runs count_to with 3. Read it as three words: t is the thread's name, mtd means make a thread, and count_to&3 is the function to run. The thread runs beside the rest of the program.",say:"",category:"clock-threads"},
{name:"Join Block",short:"rjn",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-nodes",verb:"wait for",line: "t rjn now",explain:"This line waits until the thread t is done. Read it as three words: t is the thread, rjn means join, and now means there is nothing to say. The program carries on only when the thread has finished.",say:"",category:"clock-threads"},
{name:"Lock Block",short:"blk",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-lock",verb:"guard",line: "m blk now",explain:"This line locks the mutex m, so only one thread can run the lines under it at a time. Read it as three words: m is the mutex, blk means lock, and now means there is nothing to say. The lock lets go when the lines under it are done.",say:"",category:"clock-threads"},
{name:"Send Block",short:"c add",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-go",verb:"send",line: "c add i+1",explain:"This line sends the number i+1 down the channel c. Read it as three words: c is the channel, add means add, and i+1 is the value to send. A thread waiting on c will pick the number up.",say:"",category:"clock-threads"},
{name:"Close Block",short:"close",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-stop",verb:"close",line: "c close now",explain:"This line closes the channel c. Read it as three words: c is the channel, close is what it should do, and now means there is nothing to say. Nothing more can be sent down c after this.",say:"",category:"clock-threads"},
{name:"Each Thread Block",short:"mtl",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-nodes",verb:"own",line: "seen mtl 0",explain:"This line makes a box called seen that starts as the number 0, with each thread getting its own separate seen. Read it as three words: seen is the box's name, mtl means make one for each thread, and 0 is its starting value. One thread changing seen never touches another thread's seen.",say:"",category:"clock-threads"},
{name:"Group Block",short:"dgr",chapter:"English++ Book Ch. 40 · Groups and Other Files",icon:"i-folder",verb:"gather",line: "geo dgr now",explain:"This line defines a group called geo, a bundle of names that belong together. Read it as three words: geo is the group's name, dgr means define a group, and now means there is nothing to say. The names inside it are written with geo in front.",say:"",category:"files"},
{name:"Import Block",short:"xim",chapter:"English++ Book Ch. 40 · Groups and Other Files",icon:"i-folder",verb:"bring",line: "now xim \"tools.epp\"",explain:"This line brings in the English++ file \"tools.epp\", so the program can use its definitions. Read it as three words: now means there is nothing to say, xim means import, and \"tools.epp\" is the file to bring in. The file's definitions are ready to use from here on.",say:"",category:"files"},
{name:"Command Block",short:"rcm",chapter:"English++ Book Ch. 41 · The World Outside",icon:"i-monitor",verb:"command",line: "now rcm \"echo Hello from Windows\"",explain:"This line runs the command \"echo Hello from Windows\" on the computer. Read it as three words: now means there is nothing to say, rcm means command, and \"echo Hello from Windows\" is the command to run. The computer runs the command, and the program carries on with the next line.",say:"",category:"outside-world"},
{name:"Run Command Block",short:"xcm",chapter:"English++ Book Ch. 41 · The World Outside",icon:"i-play",verb:"command",line: "said is xcm&\"echo hello\"",explain:"This line runs the command \"echo hello\" and makes said hold what it printed. Read it as three words: said is the name, is makes or changes a thing, and xcm&\"echo hello\" is the value it gets. Here, said holds hello, so the Book's next line prints it in capitals as HELLO.",say:"",category:"outside-world"},
{name:"Exit Code Block",short:"xcd",chapter:"English++ Book Ch. 41 · The World Outside",icon:"i-play",verb:"commands",line: "out prn xcd&\"exit 3\"",explain:"This line runs the command \"exit 3\" and prints the exit code it ends with. Read it as three words: out means the screen, prn means print a line, and xcd&\"exit 3\" is the value to print. It prints 3.",say:"",category:"outside-world"},
{name:"Program Words Block",short:"xag",chapter:"English++ Book Ch. 41 · The World Outside",icon:"i-play",verb:"words",line: "out prn cct&xag",explain:"This line prints how many words were given to the program when it started. Read it as three words: out means the screen, prn means print a line, and cct&xag is the value to print. Run with no words, it prints 0.",say:"",category:"outside-world"},
{name:"Environment Value Block",short:"xev",chapter:"English++ Book Ch. 41 · The World Outside",icon:"i-play",verb:"value",line: "out prn xev&\"SURELY_NOT_SET\"",explain:"This line prints the environment value named \"SURELY_NOT_SET\". Read it as three words: out means the screen, prn means print a line, and xev&\"SURELY_NOT_SET\" is the value to print. No such value is set, so it prints an empty line.",say:"",category:"outside-world"},
{name:"Web Page Block",short:"xwb",chapter:"English++ Book Ch. 41 · The World Outside",icon:"i-play",verb:"web",line: "page is xwb&\"http://example.com\"",explain:"This line makes page hold the text of the web page at \"http://example.com\". Read it as three words: page is the name, is makes or changes a thing, and xwb&\"http://example.com\" is the value it gets. In the Book online is nay, so this line is skipped and the program only prints \"Done.\"",say:"",category:"outside-world"},
{name:"Write Bytes Block",short:"hby",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-file",verb:"save",line: "\"a.bin\" hby bytes",explain:"This line writes bytes into the file \"a.bin\" as raw bytes, not text. Read it as three words: \"a.bin\" is the file, hby means write bytes, and bytes is the bytes to write. The bytes are written exactly as they are, with no text rules.",say:"",category:"outside-world"},
{name:"Hash Block",short:"xha",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-key",verb:"fingerprint",line: "out prn xha&\"abc\"",explain:"This line prints the SHA-256 hash of \"abc\" on the screen. Read it as three words: out means the screen, prn means print a line, and xha&\"abc\" is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"outside-world"},
{name:"JSON Block",short:"tjs",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-braces",verb:"read",line: "j is tjs&\"{\\\"name\\\": \\\"Ada\\\", \\\"pets\\\": [\\\"Rex\\\", \\\"Tom\\\"]}\"",explain:"This line makes j hold \"{\"name\": \"Ada\", \"pets\": [\"Rex\", \"Tom\"]}\" read as a JSON value. Read it as three words: j is the name, is makes or changes a thing, and tjs&\"{\\\"name\\\": \\\"Ada\\\", \\\"pets\\\": [\\\"Rex\\\", \\\"Tom\\\"]}\" is the value it gets. After this line, j is that value.",say:"",category:"text"},
{name:"Server Block",short:"srv",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-net",verb:"listen",line: "door mak srv&0",explain:"This line makes a new server called door, ready to listen for connections. Read it as three words: door is the new name, mak means make, and srv&0 is the kind and what it is made with. The 0 asks for any free port, and door listens only on this computer unless you ask for more.",say:"",category:"outside-world"},
{name:"Socket Block",short:"sck",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-link",verb:"connect",line: "c mak sck&\"127.0.0.1\"&p",explain:"This line makes a socket called c that connects to the computer at \"127.0.0.1\", on port p. Read it as three words: c is the new name, mak means make, and sck&\"127.0.0.1\"&p is the kind and what it is made with. From here on, c can send and get words over that connection.",say:"",category:"outside-world"},
{name:"Post Block",short:"xpo",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-cloud",verb:"send",line: "answer is xpo&\"http://127.0.0.1:1/form\"&\"name=Ada\"",explain:"This line makes answer hold the answer from posting \"name=Ada\" to the page \"http://127.0.0.1:1/form\". Read it as three words: answer is the name, is makes or changes a thing, and xpo&\"http://127.0.0.1:1/form\"&\"name=Ada\" is the value it gets. After this line, answer is that value.",say:"",category:"outside-world"},
{name:"Library Block",short:"xlb",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-book",verb:"load",line: "now xlb raylib",explain:"This line links the C++ library called raylib into the program. Read it as three words: now means there is nothing to say, xlb means link a library, and raylib is the library to link. The program can use the library's functions from here on.",say:"",category:"outside-world"},
{name:"Include Block",short:"xic",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-book",verb:"include",line: "now xic \"<vector>\"",explain:"This line includes the C++ header called vector, so the program can use what that header gives. Read it as three words: now means there is nothing to say, xic means include a C++ header, and \"<vector>\" is the header to include. The header is ready to use from here on.",say:"",category:"outside-world"},
{name:"C++ Here Block",short:"xpp",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-braces",verb:"write",line: "now xpp \"int a = 1;\"",explain:"This line writes one line of C++ right here, exactly as written. Read it as three words: now means there is nothing to say, xpp means put in C++, and the line is what it is given. It is an escape hatch, for the rare line English++ cannot say.",say:"",category:"outside-world"},
{name:"Is tpa&Ada&6 Block",short:"is tpa&Ada&6",chapter:"English++ Book Ch. 7 · Printing",icon:"i-box",verb:"read",line: "name is tpa&\"Ada\"&6",explain:"This line makes name hold the text \"Ada\" padded out to 6 letters long. Read it as three words: name is the name, is makes or changes a thing, and tpa&\"Ada\"&6 is the value it gets. After this line, name is that value.",say:"",category:"text"},
{name:"Prn She said hello. Block",short:"prn She said hello.",chapter:"English++ Book Ch. 7 · Printing",icon:"i-say",verb:"find",line: "out prn \"She said \\\"hello\\\".\"",explain:"This line prints \"She said \"hello\".\" on the screen. Read it as three words: out means the screen, prn means print a line, and \"She said \\\"hello\\\".\" is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"printing"},
{name:"Put x Block",short:"put x",chapter:"English++ Book Ch. 7 · Printing",icon:"i-say",verb:"write",line: "out put x",explain:"This line prints x on the screen and stays on the same line. Read it as three words: out means the screen, put means print without a new line, and x is the value to print. The next thing printed will follow right after it, on the same line.",say:"",category:"printing"},
{name:"Problem Screen Block",short:"err",chapter:"English++ Book Ch. 7 · Printing",icon:"i-say",verb:"screen",line: "err prn \"That file is missing.\"",explain:"This line prints \"That file is missing.\" on the screen used for problems. Read it as three words: err means the screen for problems, prn means print a line, and \"That file is missing.\" is the value to print. The message goes out through the problem screen instead of the normal one.",say:"",category:"printing"},
{name:"Decimal Places Block",short:"tfx",chapter:"English++ Book Ch. 7 · Printing",icon:"i-say",verb:"decimal",line: "out prn tfx&price&2",explain:"This line prints price, which holds 2.5, with exactly 2 decimal places. Read it as three words: out means the screen, prn means print a line, and tfx&price&2 is the value to print. It prints 2.50.",say:"",category:"printing"},
{name:"Is sum*4 Block",short:"is sum*4",chapter:"English++ Book Ch. 8 · Math",icon:"i-box",verb:"read",line: "area is sum*4",explain:"This line makes area hold sum times the number 4. Read it as three words: area is the name, is makes or changes a thing, and sum*4 is the value it gets. After this line, area is sum times the number 4.",say:"",category:"math",mk:"8.0"},
{name:"Rsd 7 Block",short:"rsd 7",chapter:"English++ Book Ch. 8 · Math",icon:"i-box",verb:"use",line: "now rsd 7",explain:"This line seeds the random numbers with the number 7. Read it as three words: now means there is nothing to say, rsd means seed, and 7 is the seed to use. The same seed gives the same random numbers every time.",say:"",category:"math"},
{name:"Prn 10-a Block",short:"prn 10-a",chapter:"English++ Book Ch. 8 · Math",icon:"i-say",verb:"find",line: "out prn 10-a",explain:"This line prints the number 10 minus a on the screen. Read it as three words: out means the screen, prn means print a line, and 10-a is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"math"},
{name:"Prn 7.0/2 Block",short:"prn 7.0/2",chapter:"English++ Book Ch. 8 · Math",icon:"i-say",verb:"find",line: "out prn 7.0/2",explain:"This line prints the number 7.0 divided by the number 2 on the screen. Read it as three words: out means the screen, prn means print a line, and 7.0/2 is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"math"},
{name:"Prn a*b Block",short:"prn a*b",chapter:"English++ Book Ch. 8 · Math",icon:"i-say",verb:"find",line: "out prn a*b",explain:"This line prints a times b on the screen. Read it as three words: out means the screen, prn means print a line, and a*b is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"math"},
{name:"And 3 Block",short:"and 3",chapter:"English++ Book Ch. 8 · Math",icon:"i-box",verb:"use",line: "x and 3",explain:"This line keeps in x only the bits that both x and the number 3 have. Read it as three words: x is the thing to change, and means bit and, and 3 is what to keep bits from. Every bit that is 0 in either side becomes 0 in x.",say:"",category:"bits-big"},
{name:"Ant 0 Block",short:"ant 0",chapter:"English++ Book Ch. 8 · Math",icon:"i-box",verb:"use",line: "x ant 0",explain:"This line sets x to the bit-flip of the number 0. Read it as three words: x is the thing to change, ant means bit not, and 0 is what to flip. Every 1 becomes 0 and every 0 becomes 1.",say:"",category:"bits-big"},
{name:"Aor 3 Block",short:"aor 3",chapter:"English++ Book Ch. 8 · Math",icon:"i-box",verb:"use",line: "x aor 3",explain:"This line keeps in x the bits that either x or the number 3 has. Read it as three words: x is the thing to change, aor means bit or, and 3 is what to keep bits from. Every bit that is 1 in either side becomes 1 in x.",say:"",category:"bits-big"},
{name:"Asl 2 Block",short:"asl 2",chapter:"English++ Book Ch. 8 · Math",icon:"i-box",verb:"use",line: "x asl 2",explain:"This line moves every bit in x 2 places to the left. Read it as three words: x is the thing to change, asl means shift left, and 2 is how many places to move. Each move to the left doubles x.",say:"",category:"bits-big"},
{name:"Asr 1 Block",short:"asr 1",chapter:"English++ Book Ch. 8 · Math",icon:"i-box",verb:"use",line: "x asr 1",explain:"This line moves every bit in x 1 place to the right. Read it as three words: x is the thing to change, asr means shift right, and 1 is how many places to move. Each move to the right halves x.",say:"",category:"bits-big"},
{name:"Axr 3 Block",short:"axr 3",chapter:"English++ Book Ch. 8 · Math",icon:"i-box",verb:"use",line: "x axr 3",explain:"This line keeps in x the bits that only one side has. Read it as three words: x is the thing to change, axr means bit xor, and 3 is what to keep bits from. A bit is 1 only when the two sides differ in that bit.",say:"",category:"bits-big"},
{name:"Bit And Block",short:"nnd",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-box",verb:"bit",line: "out prn nnd&a&b",explain:"This line prints the bits that are on in both a and b, where a is 6 and b is 3. Read it as three words: out means the screen, prn means print a line, and nnd&a&b is the value to print. 6 is 110 and 3 is 011 in bits, so it prints 2.",say:"",category:"bits-big"},
{name:"Bit Or Block",short:"nor",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-box",verb:"bit",line: "out prn nor&a&b",explain:"This line prints the bits that are on in a or b, where a is 6 and b is 3. Read it as three words: out means the screen, prn means print a line, and nor&a&b is the value to print. 6 is 110 and 3 is 011 in bits, so it prints 7.",say:"",category:"bits-big"},
{name:"Bit Xor Block",short:"nxr",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-box",verb:"bit",line: "out prn nxr&a&b",explain:"This line prints the bits that are on in just one of a and b, where a is 6 and b is 3. Read it as three words: out means the screen, prn means print a line, and nxr&a&b is the value to print. 6 is 110 and 3 is 011 in bits, so it prints 5.",say:"",category:"bits-big"},
{name:"Bit Not Block",short:"nnt",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-box",verb:"bit",line: "out prn nnt&a",explain:"This line prints a, which is 6, with every bit flipped. Read it as three words: out means the screen, prn means print a line, and nnt&a is the value to print. It prints -7.",say:"",category:"bits-big"},
{name:"Shift Left Block",short:"nsl",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-box",verb:"shift",line: "out prn nsl&a&2",explain:"This line prints a, which is 6, with its bits moved 2 places to the left. Read it as three words: out means the screen, prn means print a line, and nsl&a&2 is the value to print. Each place doubles it, so it prints 24.",say:"",category:"bits-big"},
{name:"Shift Right Block",short:"nsr",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-box",verb:"shift",line: "out prn nsr&a&1",explain:"This line prints a, which is 6, with its bits moved 1 place to the right. Read it as three words: out means the screen, prn means print a line, and nsr&a&1 is the value to print. One place halves it, so it prints 3.",say:"",category:"bits-big"},
{name:"Bytes Size Block",short:"nsz",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-box",verb:"size",line: "out prn nsz&x",explain:"This line prints how many bytes the box x takes up in memory. Read it as three words: out means the screen, prn means print a line, and nsz&x is the value to print. Here, x holds a whole number, so it prints 4.",say:"",category:"bits-big"},
{name:"Lowest Number Block",short:"nlw",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-box",verb:"lowest",line: "out prn nlw",explain:"This line prints the lowest value a whole number box can hold. Read it as three words: out means the screen, prn means print a line, and nlw is the value to print. It prints -2147483648.",say:"",category:"bits-big"},
{name:"Huge Positive Block",short:"pbg",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-box",verb:"big",line: "huge mak pbg",explain:"This line makes an empty box called huge that will hold a very big whole number that is never below zero. Read it as three words: huge is the new name, mak means make, and pbg is the kind it is made as. The Book puts 18446744073709551615 in it, and it prints that number.",say:"",category:"bits-big",mk:"46.10"},
{name:"Is 1+2*3 Block",short:"is 1+2*3",chapter:"English++ Book Ch. 8 · Math",icon:"i-box",verb:"read",line: "y is 1+2*3",explain:"This line makes y hold the number 1 plus the number 2 times the number 3. Read it as three words: y is the name, is makes or changes a thing, and 1+2*3 is the value it gets. After this line, y is that value.",say:"",category:"math",mk:"8.0"},
{name:"Raise Power Block",short:"npw",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"power",line: "out prn npw&2&10",explain:"This line prints 2 raised to the power of 10 on the screen. Read it as three words: out means the screen, prn means print a line, and npw&2&10 is the value to print. Ten 2s multiplied together make 1024, so it prints 1024.",say:"",category:"math"},
{name:"Absolute Value Block",short:"nab",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"absolute",line: "out prn nab&-5",explain:"This line prints how far -5 is from zero, dropping its minus sign. Read it as three words: out means the screen, prn means print a line, and nab&-5 is the value to print. It prints 5.",say:"",category:"math"},
{name:"Bigger One Block",short:"nmx",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"biggest",line: "out prn nmx&3&8",explain:"This line prints the bigger of 3 and 8 on the screen. Read it as three words: out means the screen, prn means print a line, and nmx&3&8 is the value to print. It prints 8.",say:"",category:"math"},
{name:"Smaller One Block",short:"nmn",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"smallest",line: "out prn nmn&3&8",explain:"This line prints the smaller of 3 and 8 on the screen. Read it as three words: out means the screen, prn means print a line, and nmn&3&8 is the value to print. It prints 3.",say:"",category:"math"},
{name:"Round Nearest Block",short:"nro",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"rounded",line: "out prn nro&2.5",explain:"This line prints 2.5 rounded to the nearest whole number. Read it as three words: out means the screen, prn means print a line, and nro&2.5 is the value to print. A half rounds away from zero, so it prints 3.",say:"",category:"math"},
{name:"Round Down Block",short:"ndn",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"round",line: "out prn ndn&2.9",explain:"This line prints 2.9 rounded down to the whole number below it. Read it as three words: out means the screen, prn means print a line, and ndn&2.9 is the value to print. It prints 2.",say:"",category:"math"},
{name:"Round Up Block",short:"nup",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"round",line: "out prn nup&2.1",explain:"This line prints 2.1 rounded up to the whole number above it. Read it as three words: out means the screen, prn means print a line, and nup&2.1 is the value to print. It prints 3.",say:"",category:"math"},
{name:"Whole Part Block",short:"nwh",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"whole",line: "out prn nwh&-2.9",explain:"This line prints only the whole part of -2.9, cutting off the decimal. Read it as three words: out means the screen, prn means print a line, and nwh&-2.9 is the value to print. Cutting moves toward zero, so it prints -2.",say:"",category:"math"},
{name:"Kept Between Block",short:"nkb",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"kept",line: "out prn nkb&5&0&10",explain:"This line prints 5 kept between 0 and 10. Read it as three words: out means the screen, prn means print a line, and nkb&5&0&10 is the value to print. 5 is already inside that range, so it prints 5.",say:"",category:"math"},
{name:"Common Divisor Block",short:"ngd",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"greatest",line: "out prn ngd&12&18",explain:"This line prints the greatest number that divides both 12 and 18 with nothing left over. Read it as three words: out means the screen, prn means print a line, and ngd&12&18 is the value to print. It prints 6.",say:"",category:"math"},
{name:"Common Multiple Block",short:"nmu",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"least",line: "out prn nmu&4&6",explain:"This line prints the smallest number that both 4 and 6 divide into evenly. Read it as three words: out means the screen, prn means print a line, and nmu&4&6 is the value to print. It prints 12.",say:"",category:"math"},
{name:"Factorial Block",short:"nfc",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"nfc",line: "out prn nfc&5",explain:"This line prints the factorial of 5, which is 5 times 4 times 3 times 2 times 1. Read it as three words: out means the screen, prn means print a line, and nfc&5 is the value to print. It prints 120.",say:"",category:"math"},
{name:"Prime Test Block",short:"npe",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"prime",line: "out prn npe&7",explain:"This line prints whether 7 is a prime number, one that only 1 and itself divide. Read it as three words: out means the screen, prn means print a line, and npe&7 is the value to print. 7 is prime, so it prints yes.",say:"",category:"math"},
{name:"Highest Number Block",short:"nhi",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"highest",line: "out prn nhi",explain:"This line prints the highest value a whole number box can hold. Read it as three words: out means the screen, prn means print a line, and nhi is the value to print. It prints 2147483647.",say:"",category:"math"},
{name:"Cube Root Block",short:"ncr",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"cube",line: "out prn ncr&27",explain:"This line prints the cube root of 27, the number that times itself three times makes 27. Read it as three words: out means the screen, prn means print a line, and ncr&27 is the value to print. It prints 3.",say:"",category:"math"},
{name:"Hypotenuse Block",short:"nhy",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"nhy",line: "out prn nhy&3&4",explain:"This line prints the long side of a right triangle whose short sides are 3 and 4. Read it as three words: out means the screen, prn means print a line, and nhy&3&4 is the value to print. It prints 5.",say:"",category:"math"},
{name:"Sine Block",short:"nsn",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"sine",line: "out prn nsn&0",explain:"This line prints the sine of 0, with the angle measured in radians. Read it as three words: out means the screen, prn means print a line, and nsn&0 is the value to print. It prints 0.",say:"",category:"math"},
{name:"Cosine Block",short:"nco",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"cosine",line: "out prn nco&0",explain:"This line prints the cosine of 0, with the angle measured in radians. Read it as three words: out means the screen, prn means print a line, and nco&0 is the value to print. It prints 1.",say:"",category:"math"},
{name:"Tangent Block",short:"ntn",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"tangent",line: "out prn ntn&0",explain:"This line prints the tangent of 0, with the angle measured in radians. Read it as three words: out means the screen, prn means print a line, and ntn&0 is the value to print. It prints 0.",say:"",category:"math"},
{name:"Arc Sine Block",short:"nas",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"arc",line: "out prn nas&0",explain:"This line prints the arc sine of 0, the angle whose sine is 0. Read it as three words: out means the screen, prn means print a line, and nas&0 is the value to print. It prints 0.",say:"",category:"math"},
{name:"Arc Cosine Block",short:"nac",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"arc",line: "out prn nac&1",explain:"This line prints the arc cosine of 1, the angle whose cosine is 1. Read it as three words: out means the screen, prn means print a line, and nac&1 is the value to print. It prints 0.",say:"",category:"math"},
{name:"Arc Tangent Block",short:"nat",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"arc",line: "out prn nat&0",explain:"This line prints the arc tangent of 0, the angle whose tangent is 0. Read it as three words: out means the screen, prn means print a line, and nat&0 is the value to print. It prints 0.",say:"",category:"math"},
{name:"E Power Block",short:"nep",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"e",line: "out prn nep&0",explain:"This line prints the number e raised to the power of 0. Read it as three words: out means the screen, prn means print a line, and nep&0 is the value to print. Anything to the power of 0 is 1, so it prints 1.",say:"",category:"math"},
{name:"Natural Log Block",short:"nlg",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"natural",line: "out prn nlg&1",explain:"This line prints the natural log of 1, the power e must be raised to for 1. Read it as three words: out means the screen, prn means print a line, and nlg&1 is the value to print. It prints 0.",say:"",category:"math"},
{name:"Log Ten Block",short:"nlx",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"log",line: "out prn nlx&100",explain:"This line prints the log base ten of 100, the power 10 must be raised to for 100. Read it as three words: out means the screen, prn means print a line, and nlx&100 is the value to print. It prints 2.",say:"",category:"math"},
{name:"Random Decimal Block",short:"nrz",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"random",line: "chance is nrz&0&1",explain:"This line makes chance hold a random decimal number between 0 and 1. Read it as three words: chance is the name, is makes or changes a thing, and nrz&0&1 is the value it gets. The value is different each run, so the Book shows no fixed output for it.",say:"",category:"math"},
{name:"Prn back+1 Block",short:"prn back+1",chapter:"English++ Book Ch. 9 · Text",icon:"i-say",verb:"find",line: "out prn back+1",explain:"This line prints back plus the number 1 on the screen. Read it as three words: out means the screen, prn means print a line, and back+1 is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"math"},
{name:"Prn tmt&a2&[0-9]+ Block",short:"prn tmt&a2&[0-9]+",chapter:"English++ Book Ch. 9 · Text",icon:"i-say",verb:"find",line: "out prn tmt&\"a2\"&\"[0-9]+\"",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and tmt&\"a2\"&\"[0-9]+\" is the test to print. It prints yes, because \"a2\" has a part, the 2, with the shape \"[0-9]+\".",say:"",category:"text"},
{name:"Number From Block",short:"tnm",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"number",line: "back is tnm&\"7\"",explain:"This line makes back hold the whole number found in the text \"7\". Read it as three words: back is the name, is makes or changes a thing, and tnm&\"7\" is the value it gets. After this line, back is the number 7, so the Book's next line prints back+1 as 8.",say:"",category:"text"},
{name:"Decimal From Block",short:"tdc",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"decimal",line: "half is tdc&\"2.5\"",explain:"This line makes half hold the decimal number found in the text \"2.5\". Read it as three words: half is the name, is makes or changes a thing, and tdc&\"2.5\" is the value it gets. After this line, half is the number 2.5, so the Book's next line prints half*2 as 5.",say:"",category:"text"},
{name:"Text Size Block",short:"tsz",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"size",line: "out prn tsz&word",explain:"This line prints how many letters are in word, which holds \"Hello\". Read it as three words: out means the screen, prn means print a line, and tsz&word is the value to print. It prints 5.",say:"",category:"text"},
{name:"Uppercase Block",short:"tuc",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"tuc",line: "out prn tuc&t",explain:"This line prints t, which holds \"Hi there\", with every letter made a capital. Read it as three words: out means the screen, prn means print a line, and tuc&t is the value to print. It prints HI THERE.",say:"",category:"text"},
{name:"Lowercase Block",short:"tlc",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"tlc",line: "out prn tlc&t",explain:"This line prints t, which holds \"Hi there\", with every letter made small. Read it as three words: out means the screen, prn means print a line, and tlc&t is the value to print. It prints hi there.",say:"",category:"text"},
{name:"Title Case Block",short:"ttc",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"title",line: "out prn ttc&\"hi there\"",explain:"This line prints \"hi there\" with the first letter of each word made a capital. Read it as three words: out means the screen, prn means print a line, and ttc&\"hi there\" is the value to print. It prints Hi There.",say:"",category:"text"},
{name:"Trim Spaces Block",short:"tti",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"trimmed",line: "out prn tti&\"  hi  \"",explain:"This line prints \"  hi  \" with the spaces cut off both ends. Read it as three words: out means the screen, prn means print a line, and tti&\"  hi  \" is the value to print. It prints hi.",say:"",category:"text"},
{name:"Reverse Text Block",short:"trv",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"reversed",line: "out prn trv&\"abc\"",explain:"This line prints the text \"abc\" written backward, last letter first. Read it as three words: out means the screen, prn means print a line, and trv&\"abc\" is the value to print. It prints cba.",say:"",category:"text"},
{name:"Begins With Block",short:"tbg",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"begins",line: "out prn tbg&t&\"He\"",explain:"This line prints whether t, which holds \"Hello\", begins with \"He\". Read it as three words: out means the screen, prn means print a line, and tbg&t&\"He\" is the value to print. It does, so it prints yes.",say:"",category:"text"},
{name:"Ends With Block",short:"ted",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"ends",line: "out prn ted&t&\"x\"",explain:"This line prints whether t, which holds \"Hello\", ends with \"x\". Read it as three words: out means the screen, prn means print a line, and ted&t&\"x\" is the value to print. It does not, so it prints nay.",say:"",category:"text"},
{name:"Text Position Block",short:"tps",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"position",line: "out prn tps&t&\"l\"",explain:"This line prints where the first \"l\" sits in t, which holds \"Hello\", counting from 0. Read it as three words: out means the screen, prn means print a line, and tps&t&\"l\" is the value to print. It prints 2.",say:"",category:"text"},
{name:"Split Words Block",short:"twd",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"words",line: "out prn twd&t",explain:"This line splits t, which holds \"Hello World\", into a list of its words and prints it. Read it as three words: out means the screen, prn means print a line, and twd&t is the value to print. It prints [Hello, World].",say:"",category:"text"},
{name:"Split Text Block",short:"tsp",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"split",line: "out prn tsp&\"a,b,c\"&\",\"",explain:"This line cuts \"a,b,c\" apart at every comma and prints the pieces as a list. Read it as three words: out means the screen, prn means print a line, and tsp&\"a,b,c\"&\",\" is the value to print. It prints [a, b, c].",say:"",category:"text"},
{name:"Split Lines Block",short:"tln",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"lines",line: "out prn tln&\"one\\ntwo\"",explain:"This line cuts \"one\\ntwo\" apart at each line break and prints the lines as a list. Read it as three words: out means the screen, prn means print a line, and tln&\"one\\ntwo\" is the value to print. It prints [one, two].",say:"",category:"text"},
{name:"All Matches Block",short:"tma",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"all",line: "out prn tma&t&\"[0-9]+\"",explain:"This line prints every run of digits found in t, which holds \"I have 2 cats and 10 fish\". Read it as three words: out means the screen, prn means print a line, and tma&t&\"[0-9]+\" is the value to print. It prints [2, 10].",say:"",category:"text"},
{name:"Pattern Replace Block",short:"trx",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"pattern",line: "out prn trx&t&\"[0-9]+\"&\"some\"",explain:"This line prints t with every run of digits swapped for the word \"some\". Read it as three words: out means the screen, prn means print a line, and trx&t&\"[0-9]+\"&\"some\" is the value to print. It prints I have some cats and some fish.",say:"",category:"text"},
{name:"Count Text Block",short:"tct",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-pencil",verb:"count",line: "out prn tct&song&\"la\"",explain:"This line prints how many times \"la\" shows up in song, which holds \"la la la\". Read it as three words: out means the screen, prn means print a line, and tct&song&\"la\" is the value to print. It prints 3.",say:"",category:"text"},
{name:"Is Letter Block",short:"tlr",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-pencil",verb:"letter",line: "tlr&c ieq yes",explain:"This line runs the lines under it only when c is a letter. Read it as three words: tlr&c is the value to test, ieq means if equal, and yes is the value to compare with. In the Book, walking \"Room 12\" adds 1 for each letter, so letters ends as 4.",say:"",category:"text"},
{name:"Is Digit Block",short:"tdg",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-pencil",verb:"digit",line: "tdg&c ieq yes",explain:"This line runs the lines under it only when c is a digit from 0 to 9. Read it as three words: tdg&c is the value to test, ieq means if equal, and yes is the value to compare with. In the Book, walking \"Room 12\" adds 1 for each digit, so digits ends as 2.",say:"",category:"text"},
{name:"Is Space Block",short:"tws",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-pencil",verb:"white",line: "tws&c ieq yes",explain:"This line runs the lines under it only when c is white space, such as a space. Read it as three words: tws&c is the value to test, ieq means if equal, and yes is the value to compare with. In the Book, walking \"Room 12\" adds 1 for each space, so spaces ends as 1.",say:"",category:"text"},
{name:"Type Name Block",short:"ttp",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-pencil",verb:"type",line: "out prn ttp&x",explain:"This line prints the name of the kind that x holds, where x is 5. Read it as three words: out means the screen, prn means print a line, and ttp&x is the value to print. Here, x is a whole number, so it prints num.",say:"",category:"text"},
{name:"Prn apple<pear Block",short:"prn apple<pear",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-say",verb:"find",line: "out prn \"apple\"<\"pear\"",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and \"apple\"<\"pear\" is the test to print. It prints yes, because \"apple\" comes before \"pear\" when texts are put in order.",say:"",category:"tests-choices"},
{name:"Prn age==8 Block",short:"prn age==8",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-say",verb:"find",line: "out prn age==8",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and age==8 is the test to print. It prints yes when age is the same as the number 8, and nay when it is not.",say:"",category:"tests-choices"},
{name:"Prn age>9||tall Block",short:"prn age>9||tall",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-say",verb:"find",line: "out prn age>9||tall",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and age>9||tall is the test to print. It prints yes when age is more than the number 9 or tall is yes, and nay when it is not.",say:"",category:"tests-choices"},
{name:"Prn name!=Bob Block",short:"prn name!=Bob",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-say",verb:"find",line: "out prn name!=\"Bob\"",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and name!=\"Bob\" is the test to print. It prints yes when name is different from \"Bob\", and nay when it is not.",say:"",category:"tests-choices"},
{name:"Prn name==Ada Block",short:"prn name==Ada",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-say",verb:"find",line: "out prn name==\"Ada\"",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and name==\"Ada\" is the test to print. It prints yes when name is the same as \"Ada\", and nay when it is not.",say:"",category:"tests-choices"},
{name:"False Value Block",short:"nay",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-box",verb:"false",line: "door_open is nay",explain:"This line makes door_open hold nay, the word for false. Read it as three words: door_open is the name, is makes or changes a thing, and nay is the value it gets. Printing door_open then shows nay.",say:"",category:"tests-choices"},
{name:"Oeq 13 Block",short:"oeq 13",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-box",verb:"use",line: "age oeq 13",explain:"This line runs its lines when the first test failed and age passes this one. Read it as three words: age is the value to test, oeq means otherwise, if equal, and 13 is the value to compare with. Here the test is whether age is the same as the number 13.",say:"",category:"tests-choices"},
{name:"Oge 100 Block",short:"oge 100",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-box",verb:"use",line: "age oge 100",explain:"This line runs its lines when the first test failed and age passes this one. Read it as three words: age is the value to test, oge means otherwise, if greater than or equal to, and 100 is the value to compare with. Here the test is whether age is at least the number 100.",say:"",category:"tests-choices"},
{name:"Ogt 60 Block",short:"ogt 60",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-box",verb:"use",line: "age ogt 60",explain:"This line runs its lines when the first test failed and age passes this one. Read it as three words: age is the value to test, ogt means otherwise, if greater than, and 60 is the value to compare with. Here the test is whether age is more than the number 60.",say:"",category:"tests-choices"},
{name:"Ole 19 Block",short:"ole 19",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-box",verb:"use",line: "age ole 19",explain:"This line runs its lines when the first test failed and age passes this one. Read it as three words: age is the value to test, ole means otherwise, if less than or equal to, and 19 is the value to compare with. Here the test is whether age is at most the number 19.",say:"",category:"tests-choices"},
{name:"One 50 Block",short:"one 50",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-box",verb:"use",line: "age one 50",explain:"This line runs its lines when the first test failed and age passes this one. Read it as three words: age is the value to test, one means otherwise, if not equal, and 50 is the value to compare with. Here the test is whether age is different from the number 50.",say:"",category:"tests-choices"},
{name:"Ieq Ada Block",short:"ieq Ada",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-fork",verb:"sort",line: "name ieq \"Ada\"",explain:"This line runs the lines under it only when name passes the test. Read it as three words: name is the value to test, ieq means if equal, and \"Ada\" is the value to compare with. Here the test is whether name is the same as \"Ada\".",say:"",category:"tests-choices",mk:"46.20"},
{name:"Bcs 1 Block",short:"bcs 1",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-toggle",verb:"case",line: "now bcs 1",explain:"This line says this case runs when the value is 1. Read it as three words: now means there is nothing to say, bcs means case, and 1 is the value this case runs for. The lines under it run only when the value matches.",say:"",category:"tests-choices"},
{name:"Is iff&x>3&big&small Block",short:"is iff&x>3&big&small",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-box",verb:"read",line: "size is iff&x>3&\"big\"&\"small\"",explain:"This line makes size hold \"big\" when x is more than the number 3, and \"small\" when it is not. Read it as three words: size is the name, is makes or changes a thing, and iff&x>3&\"big\"&\"small\" is the value it gets. After this line, size is that value.",say:"",category:"tests-choices"},
{name:"Ige 3 Block",short:"ige 3",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-box",verb:"use",line: "x ige 3",explain:"This line runs the lines under it only when x passes the test. Read it as three words: x is the value to test, ige means if greater than or equal to, and 3 is the value to compare with. Here the test is whether x is at least the number 3.",say:"",category:"tests-choices"},
{name:"Ile 3 Block",short:"ile 3",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-box",verb:"use",line: "x ile 3",explain:"This line runs the lines under it only when x passes the test. Read it as three words: x is the value to test, ile means if less than or equal to, and 3 is the value to compare with. Here the test is whether x is at most the number 3.",say:"",category:"tests-choices"},
{name:"Ueq 2 Block",short:"ueq 2",chapter:"English++ Book Ch. 12 · Loops",icon:"i-box",verb:"use",line: "a ueq 2",explain:"This line ends a do block, and the loop keeps going until a passes the test. Read it as three words: a is the value to test, ueq means until equal, and 2 is the value to compare with. Here the test is whether a is the same as the number 2.",say:"",category:"loops"},
{name:"Weq 0 Block",short:"weq 0",chapter:"English++ Book Ch. 12 · Loops",icon:"i-box",verb:"use",line: "a weq 0",explain:"This line repeats the lines under it while a passes the test. Read it as three words: a is the value to test, weq means while equal, and 0 is the value to compare with. Here the test is whether a is the same as the number 0, so the loop keeps going while that stays true.",say:"",category:"loops"},
{name:"Une 0 Block",short:"une 0",chapter:"English++ Book Ch. 12 · Loops",icon:"i-box",verb:"use",line: "b une 0",explain:"This line ends a do block, and the loop keeps going until b passes the test. Read it as three words: b is the value to test, une means until not equal, and 0 is the value to compare with. Here the test is whether b is different from the number 0.",say:"",category:"loops"},
{name:"Wne 2 Block",short:"wne 2",chapter:"English++ Book Ch. 12 · Loops",icon:"i-box",verb:"use",line: "b wne 2",explain:"This line repeats the lines under it while b passes the test. Read it as three words: b is the value to test, wne means while not equal, and 2 is the value to compare with. Here the test is whether b is different from the number 2, so the loop keeps going while that stays true.",say:"",category:"loops"},
{name:"Ult 2 Block",short:"ult 2",chapter:"English++ Book Ch. 12 · Loops",icon:"i-box",verb:"use",line: "c ult 2",explain:"This line ends a do block, and the loop keeps going until c passes the test. Read it as three words: c is the value to test, ult means until less than, and 2 is the value to compare with. Here the test is whether c is less than the number 2.",say:"",category:"loops"},
{name:"Wle 2 Block",short:"wle 2",chapter:"English++ Book Ch. 12 · Loops",icon:"i-box",verb:"use",line: "c wle 2",explain:"This line repeats the lines under it while c passes the test. Read it as three words: c is the value to test, wle means while less than or equal to, and 2 is the value to compare with. Here the test is whether c is at most the number 2, so the loop keeps going while that stays true.",say:"",category:"loops"},
{name:"Fge 0 Block",short:"fge 0",chapter:"English++ Book Ch. 12 · Loops",icon:"i-box",verb:"use",line: "d fge 0",explain:"This line counts d down while it is still 0 or more, running the lines under it each time. Read it as three words: d is the counter, fge means for, at least, and 0 is where the counting stops. Here the lines under it run while d is still 0 or more.",say:"",category:"loops"},
{name:"Ule 2 Block",short:"ule 2",chapter:"English++ Book Ch. 12 · Loops",icon:"i-box",verb:"use",line: "d ule 2",explain:"This line ends a do block, and the loop keeps going until d passes the test. Read it as three words: d is the value to test, ule means until less than or equal to, and 2 is the value to compare with. Here the test is whether d is at most the number 2.",say:"",category:"loops"},
{name:"Ugt 1 Block",short:"ugt 1",chapter:"English++ Book Ch. 12 · Loops",icon:"i-box",verb:"use",line: "e ugt 1",explain:"This line ends a do block, and the loop keeps going until e passes the test. Read it as three words: e is the value to test, ugt means until greater than, and 1 is the value to compare with. Here the test is whether e is more than the number 1.",say:"",category:"loops"},
{name:"Wge 2 Block",short:"wge 2",chapter:"English++ Book Ch. 12 · Loops",icon:"i-box",verb:"use",line: "e wge 2",explain:"This line repeats the lines under it while e passes the test. Read it as three words: e is the value to test, wge means while greater than or equal to, and 2 is the value to compare with. Here the test is whether e is at least the number 2, so the loop keeps going while that stays true.",say:"",category:"loops"},
{name:"Fne 2 Block",short:"fne 2",chapter:"English++ Book Ch. 12 · Loops",icon:"i-box",verb:"use",line: "i fne 2",explain:"This line counts i up from 0 while it is not 2, running the lines under it each time. Read it as three words: i is the counter, fne means for, not equal to, and 2 is where the counting stops. Here the lines under it run until i reaches 2.",say:"",category:"loops"},
{name:"Fea abc Block",short:"fea abc",chapter:"English++ Book Ch. 12 · Loops",icon:"i-visit",verb:"visit",line: "letter fea \"abc\"",explain:"This line walks through the text \"abc\" one letter at a time, calling each letter letter. Read it as three words: letter is the name for each letter, fea means for each, and \"abc\" is the text to walk. Here the lines under it run once for every letter in \"abc\", with letter holding that letter.",say:"",category:"loops",mk:"17.0"},
{name:"Prn a&b&c&d&e Block",short:"prn a&b&c&d&e",chapter:"English++ Book Ch. 12 · Loops",icon:"i-say",verb:"find",line: "out prn a&b&c&d&e",explain:"This line prints a, b, c, d, and e on the screen. Read it as three words: out means the screen, prn means print a line, and a&b&c&d&e are the values to print. After it prints, the screen moves to a fresh line.",say:"",category:"printing"},
{name:"Prn a*10+b Block",short:"prn a*10+b",chapter:"English++ Book Ch. 12 · Loops",icon:"i-say",verb:"find",line: "out prn a*10+b",explain:"This line prints a times the number 10 plus b on the screen. Read it as three words: out means the screen, prn means print a line, and a*10+b is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"math"},
{name:"Get inp Block",short:"get inp",chapter:"English++ Book Ch. 14 · Talking With Your Program",icon:"i-keyboard",verb:"listen",line: "a get inp",explain:"This line waits for something typed on the keyboard and keeps it in a. Read it as three words: a is the box the answer goes into, get means get, and inp is the keyboard. The program stops here until an answer is typed.",say:"",category:"talking-watching"},
{name:"Gln Say something: Block",short:"gln Say something:",chapter:"English++ Book Ch. 14 · Talking With Your Program",icon:"i-box",verb:"use",line: "line gln \"Say something: \"",explain:"This line shows the question \"Say something: \" and reads one whole line, keeping it in line. Read it as three words: line is the box the answer goes into, gln means get lines, and \"Say something: \" is the question to show. It reads a whole line, spaces and all.",say:"",category:"talking-watching"},
{name:"Wln inp Block",short:"wln inp",chapter:"English++ Book Ch. 14 · Talking With Your Program",icon:"i-box",verb:"use",line: "line wln inp",explain:"This line repeats the lines under it for each line from the keyboard. Read it as three words: line is the name for each line, wln means while lines, and inp is where the lines come from. When there are no more lines, the loop ends.",say:"",category:"talking-watching"},
{name:"Add 1&2 Block",short:"add 1&2",chapter:"English++ Book Ch. 17 · Lists",icon:"i-calc",verb:"add",line: "grid add 1&2",explain:"This line adds a new row, the numbers 1 and 2, to the end of the grid. Read it as three words: grid is the list of rows, add means add, and 1&2 is the row to add. The grid grows by one row, and the new row holds 1 and 2.",say:"",category:"lists"},
{name:"Flt cct&names Block",short:"flt cct&names",chapter:"English++ Book Ch. 17 · Lists",icon:"i-repeat",verb:"count",line: "i flt cct&names",explain:"This line counts i up from 0 while it is less than the number of items in names, running the lines under it each time. Read it as three words: i is the counter, flt means for, less than, and cct&names is where the counting stops. Here the lines under it run once for each item in names.",say:"",category:"loops"},
{name:"Add Ada Block",short:"add Ada",chapter:"English++ Book Ch. 17 · Lists",icon:"i-calc",verb:"add",line: "names add \"Ada\"",explain:"This line adds \"Ada\" to the end of the list names. Read it as three words: names is the list, add means add, and \"Ada\" is the value to add. The list grows by one, and \"Ada\" is its last item.",say:"",category:"lists"},
{name:"Is Ada&Bob Block",short:"is Ada&Bob",chapter:"English++ Book Ch. 17 · Lists",icon:"i-box",verb:"read",line: "names is \"Ada\"&\"Bob\"",explain:"This line makes names a list of \"Ada\" and \"Bob\". Read it as three words: names is the new name, is makes or changes a thing, and the values joined with & are the items of the list. After this line, names holds \"Ada\" and \"Bob\".",say:"",category:"lists",mk:"46.3"},
{name:"Is Ada&Bob&Cy Block",short:"is Ada&Bob&Cy",chapter:"English++ Book Ch. 17 · Lists",icon:"i-box",verb:"read",line: "names is \"Ada\"&\"Bob\"&\"Cy\"",explain:"This line makes names a list of \"Ada\", \"Bob\", and \"Cy\". Read it as three words: names is the new name, is makes or changes a thing, and the values joined with & are the items of the list. After this line, names holds \"Ada\", \"Bob\", and \"Cy\".",say:"",category:"lists",mk:"46.3"},
{name:"Prn grid@1@0 Block",short:"prn grid@1@0",chapter:"English++ Book Ch. 17 · Lists",icon:"i-say",verb:"find",line: "out prn grid@1@0",explain:"This line prints the item at position 0 of the item at position 1 of grid on the screen. Read it as three words: out means the screen, prn means print a line, and grid@1@0 is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"classes"},
{name:"Is 5&3&9&3 Block",short:"is 5&3&9&3",chapter:"English++ Book Ch. 17 · Lists",icon:"i-box",verb:"read",line: "v is 5&3&9&3",explain:"This line makes v a list of 5, 3, 9, and 3. Read it as three words: v is the new name, is makes or changes a thing, and the values joined with & are the items of the list. After this line, v holds 5, 3, 9, and 3.",say:"",category:"lists",mk:"46.3"},
{name:"Lfl 0 Block",short:"lfl 0",chapter:"English++ Book Ch. 17 · Lists",icon:"i-box",verb:"use",line: "v lfl 0",explain:"This line fills every item of v with the number 0. Read it as three words: v is the list, lfl means fill, and 0 is what to fill it with. After this line, every item of v is the number 0.",say:"",category:"lists"},
{name:"Lrs 2 Block",short:"lrs 2",chapter:"English++ Book Ch. 17 · Lists",icon:"i-box",verb:"use",line: "v lrs 2",explain:"This line makes v exactly 2 items long. Read it as three words: v is the list, lrs means resize, and 2 is how many items it should hold. If it was shorter, new items are added at the end, starting as 0 for numbers, and if it was longer, the extra items are dropped.",say:"",category:"lists"},
{name:"V Lrv Block",short:"v lrv",chapter:"English++ Book Ch. 17 · Lists",icon:"i-box",verb:"use",line: "v lrv now",explain:"This line turns v around, so the last item is first. Read it as three words: v is the list, lrv means reverse, and now means there is nothing to say. After this line, the items run in the opposite order.",say:"",category:"lists"},
{name:"V Lsu Block",short:"v lsu",chapter:"English++ Book Ch. 17 · Lists",icon:"i-box",verb:"use",line: "v lsu now",explain:"This line shuffles v, mixing its items into a new random order. Read it as three words: v is the list, lsu means shuffle, and now means there is nothing to say. The same items are there, just mixed up.",say:"",category:"lists"},
{name:"V Luq Block",short:"v luq",chapter:"English++ Book Ch. 17 · Lists",icon:"i-box",verb:"use",line: "v luq now",explain:"This line sorts v and keeps only one of each value. Read it as three words: v is the list, luq means unique, and now means there is nothing to say. After this line, no value appears twice in v.",say:"",category:"lists"},
{name:"V Lwp Block",short:"v lwp",chapter:"English++ Book Ch. 17 · Lists",icon:"i-box",verb:"use",line: "v lwp now",explain:"This line empties v out. Read it as three words: v is the list, lwp means wipe, and now means there is nothing to say. After this line, v holds nothing at all.",say:"",category:"lists"},
{name:"List Sum Block",short:"csm",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"sum",line: "out prn csm&v",explain:"This line prints all the numbers in v, which holds 2, 4 and 6, added together. Read it as three words: out means the screen, prn means print a line, and csm&v is the value to print. It prints 12.",say:"",category:"lists"},
{name:"List Product Block",short:"cpd",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"product",line: "out prn cpd&v",explain:"This line prints all the numbers in v, which holds 2, 4 and 6, multiplied together. Read it as three words: out means the screen, prn means print a line, and cpd&v is the value to print. It prints 48.",say:"",category:"lists"},
{name:"List Biggest Block",short:"cmx",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"biggest",line: "out prn cmx&v",explain:"This line prints the biggest number in v, which holds 2, 4 and 6. Read it as three words: out means the screen, prn means print a line, and cmx&v is the value to print. It prints 6.",say:"",category:"lists"},
{name:"List Smallest Block",short:"cmn",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"smallest",line: "out prn cmn&v",explain:"This line prints the smallest number in v, which holds 2, 4 and 6. Read it as three words: out means the screen, prn means print a line, and cmn&v is the value to print. It prints 2.",say:"",category:"lists"},
{name:"List Average Block",short:"cav",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"average",line: "out prn cav&v",explain:"This line prints the average of v, which holds 2, 4 and 9. Read it as three words: out means the screen, prn means print a line, and cav&v is the value to print. The three add to 15, and 15 split three ways prints 5.",say:"",category:"lists"},
{name:"List Median Block",short:"cme",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"median",line: "out prn cme&v",explain:"This line prints the middle value of v, which holds 2, 4 and 9. Read it as three words: out means the screen, prn means print a line, and cme&v is the value to print. It prints 4.",say:"",category:"lists"},
{name:"Spread Block",short:"cde",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"standard",line: "out prn cde&w",explain:"This line prints the standard deviation of w, which holds 2, 4 and 6, showing how spread out they are. Read it as three words: out means the screen, prn means print a line, and cde&w is the value to print. It prints 1.63299.",say:"",category:"lists"},
{name:"How Many Block",short:"chm",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"how",line: "out prn chm&v&9",explain:"This line prints how many times the number 9 shows up in v, which holds 5, 9, 2 and 9. Read it as three words: out means the screen, prn means print a line, and chm&v&9 is the value to print. It prints 2.",say:"",category:"lists"},
{name:"List Position Block",short:"cps",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"position",line: "out prn cps&v&9",explain:"This line prints where the first 9 sits in v, which holds 5, 9, 2 and 9, counting from 0. Read it as three words: out means the screen, prn means print a line, and cps&v&9 is the value to print. It prints 1.",say:"",category:"lists"},
{name:"First Item Block",short:"cfr",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"first",line: "out prn cfr&v",explain:"This line prints the first item in v, which holds 5, 9, 2 and 9. Read it as three words: out means the screen, prn means print a line, and cfr&v is the value to print. It prints 5.",say:"",category:"lists"},
{name:"Last Item Block",short:"cla",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"last",line: "out prn cla&v",explain:"This line prints the last item in v, which holds 5, 9, 2 and 9. Read it as three words: out means the screen, prn means print a line, and cla&v is the value to print. It prints 9.",say:"",category:"lists"},
{name:"Random Item Block",short:"cra",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"random",line: "out prn cra&snacks",explain:"This line prints one item picked at random from snacks, which holds \"apple\", \"plum\" and \"pear\". Read it as three words: out means the screen, prn means print a line, and cra&snacks is the value to print. The pick can change each run, so the Book shows no fixed output for it.",say:"",category:"lists"},
{name:"Sorted Copy Block",short:"cso",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"sort",line: "out prn cso&v",explain:"This line prints a sorted copy of v, which holds 3, 1 and 2. Read it as three words: out means the screen, prn means print a line, and cso&v is the value to print. It prints [1, 2, 3], and v itself stays as it was.",say:"",category:"lists"},
{name:"Reversed List Block",short:"crv",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"reversed",line: "out prn crv&v",explain:"This line prints a backward copy of v, which holds 3, 1 and 2. Read it as three words: out means the screen, prn means print a line, and crv&v is the value to print. It prints [2, 1, 3], and v itself stays as it was.",say:"",category:"lists"},
{name:"Joined Text Block",short:"ctx",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-box",verb:"joined",line: "out prn ctx&names&\", \"",explain:"This line joins the names in names into one text, with \", \" between them, and prints it. Read it as three words: out means the screen, prn means print a line, and ctx&names&\", \" is the value to print. It prints Ada, Bob, Cy.",say:"",category:"lists"},
{name:"Add Bob&41 Block",short:"add Bob&41",chapter:"English++ Book Ch. 19 · Maps",icon:"i-calc",verb:"add",line: "ages add \"Bob\"&41",explain:"This line puts Bob with the value 41 into the map ages. Read it as three words: ages is the map, add means add, and \"Bob\"&41 is the key and the value to put in. After this line, ages@\"Bob\" gives 41.",say:"",category:"maps-collections"},
{name:"Lrm Ada Block",short:"lrm Ada",chapter:"English++ Book Ch. 19 · Maps",icon:"i-x",verb:"remove",line: "ages lrm \"Ada\"",explain:"This line takes \"Ada\" out of the map ages. Read it as three words: ages is the map, lrm means remove, and \"Ada\" is the key to take out. After this line, ages no longer holds \"Ada\".",say:"",category:"maps-collections"},
{name:"Map Keys Block",short:"cky",chapter:"English++ Book Ch. 19 · Maps",icon:"i-say",verb:"keys",line: "out prn cky&ages",explain:"This line prints the list of keys in the map ages. Read it as three words: out means the screen, prn means print a line, and cky&ages is the value to print. Here, ages holds Ada and Bob, so it prints [Ada, Bob].",say:"",category:"maps-collections"},
{name:"Map Values Block",short:"cvl",chapter:"English++ Book Ch. 19 · Maps",icon:"i-say",verb:"values",line: "out prn cvl&ages",explain:"This line prints the list of values in the map ages. Read it as three words: out means the screen, prn means print a line, and cvl&ages is the value to print. Here, ages holds 36 and 41, so it prints [36, 41].",say:"",category:"maps-collections"},
{name:"Hash Map Block",short:"hsh",chapter:"English++ Book Ch. 19 · Maps",icon:"i-say",verb:"hash",line: "ages mak hsh@txt@num",explain:"This line makes an empty hash map called ages that links texts to whole numbers. Read it as three words: ages is the new name, mak means make, and hsh@txt@num is the kind it is made as. After the Book stores 36 under \"Ada\", ages@\"Ada\" prints 36.",say:"",category:"maps-collections"},
{name:"Prn ages@Ada Block",short:"prn ages@Ada",chapter:"English++ Book Ch. 19 · Maps",icon:"i-say",verb:"find",line: "out prn ages@\"Ada\"",explain:"This line prints the value kept under the key \"Ada\" in the map ages. Read it as three words: out means the screen, prn means print a line, and ages@\"Ada\" is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"printing"},
{name:"Line Lpf Block",short:"line lpf",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-box",verb:"use",line: "line lpf now",explain:"This line takes the first item off line. Read it as three words: line is the list, lpf means pop first, and now means there is nothing to say. The items after it move up to fill the gap.",say:"",category:"maps-collections"},
{name:"Prn found@value_or&0 Block",short:"prn found@value_or&0",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"find",line: "out prn found@value_or&0",explain:"This line prints the number inside found, or 0 when found holds nothing. Read it as three words: out means the screen, prn means print a line, and found@value_or&0 is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"maps-collections"},
{name:"Is tup&Ada&36&yes Block",short:"is tup&Ada&36&yes",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-box",verb:"read",line: "person is tup&\"Ada\"&36&yes",explain:"This line makes person hold a tuple of \"Ada\", 36, and yes. Read it as three words: person is the name, is makes or changes a thing, and tup&\"Ada\"&36&yes is the value it gets. After this line, person is that value.",say:"",category:"maps-collections"},
{name:"Sorted Set Block",short:"set",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"set",line: "seen mak set@txt",explain:"This line makes an empty set called seen that holds texts, each one only once. Read it as three words: seen is the new name, mak means make, and set@txt is the kind it is made as. After adding \"cat\", \"dog\" and \"cat\" again, printing seen shows {cat, dog}.",say:"",category:"maps-collections"},
{name:"Hash Set Block",short:"bag",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"hash",line: "seen mak bag@num",explain:"This line makes an empty hash set called seen that holds whole numbers, each one only once. Read it as three words: seen is the new name, mak means make, and bag@num is the kind it is made as. After adding 5 twice, the count of seen prints 1.",say:"",category:"maps-collections"},
{name:"Stack Block",short:"stk",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"stack",line: "plates mak stk@num",explain:"This line makes an empty stack called plates that holds whole numbers, where the last one in is on top. Read it as three words: plates is the new name, mak means make, and stk@num is the kind it is made as. After adding 1, 2 and 3, the top of plates prints 3.",say:"",category:"maps-collections",mk:"20.0"},
{name:"Queue Block",short:"que",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"queue",line: "line mak que@txt",explain:"This line makes an empty queue called line that holds texts, where the first one in comes out first. Read it as three words: line is the new name, mak means make, and que@txt is the kind it is made as. After adding \"Ada\" then \"Bob\", the front of line prints Ada.",say:"",category:"maps-collections",mk:"20.0"},
{name:"Priority Queue Block",short:"hep",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"priority",line: "jobs mak hep@num",explain:"This line makes an empty priority queue called jobs that holds whole numbers, with the biggest on top. Read it as three words: jobs is the new name, mak means make, and hep@num is the kind it is made as. After adding 3, 9 and 5, the top of jobs prints 9.",say:"",category:"maps-collections"},
{name:"Deque Block",short:"dqu",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"deque",line: "line mak dqu@num",explain:"This line makes an empty deque called line, a list of whole numbers that grows at both ends. Read it as three words: line is the new name, mak means make, and dqu@num is the kind it is made as. After the Book adds 2 and 3 and puts 1 at the front, printing line shows [1, 2, 3].",say:"",category:"maps-collections"},
{name:"Linked List Block",short:"lst",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"linked",line: "line mak lst@num",explain:"This line makes an empty linked list called line that holds whole numbers. Read it as three words: line is the new name, mak means make, and lst@num is the kind it is made as. After adding 2 and 3 and taking off the front, printing line shows [3].",say:"",category:"maps-collections"},
{name:"Pair Block",short:"par",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"pair",line: "spot is par&3&4",explain:"This line makes spot hold a pair of two values, 3 and 4. Read it as three words: spot is the name, is makes or changes a thing, and par&3&4 is the value it gets. Printing spot shows (3, 4).",say:"",category:"maps-collections"},
{name:"Maybe Value Block",short:"opt",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"opt",line: "found mak opt@num",explain:"This line makes an empty maybe-value called found, which may hold a whole number or nothing. Read it as three words: found is the new name, mak means make, and opt@num is the kind it is made as. It starts holding nothing, so the Book's test for nil prints nothing yet.",say:"",category:"maps-collections"},
{name:"Nothing Test Block",short:"nil",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"nothing",line: "found ieq nil",explain:"This line runs the lines under it only when found holds nothing. Read it as three words: found is the value to test, ieq means if equal, and nil is the value to compare with. Here, found was just made empty, so the line under it prints nothing yet.",say:"",category:"maps-collections"},
{name:"Variant Block",short:"alt",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-say",verb:"several",line: "thing mak alt@num@txt",explain:"This line makes an empty box called thing that can hold either a whole number or a text. Read it as three words: thing is the new name, mak means make, and alt@num@txt is the kind it is made as. The Book puts 5 in it and prints 5, then puts \"five\" in it and prints five.",say:"",category:"maps-collections"},
{name:"Check_age Ert Block",short:"check_age ert",chapter:"English++ Book Ch. 21 · Functions",icon:"i-go",verb:"answer",line: "check_age ert now",explain:"This line ends the function check_age and hands back nothing. Read it as three words: check_age is the function's name, ert means return, and now means there is nothing to hand back. The function stops here, and the caller carries on with the next line.",say:"",category:"functions",mk:"46.26"},
{name:"Dfn tup@num@num Block",short:"dfn tup@num@num",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play-circle",verb:"run",line: "divide dfn tup@num@num",explain:"This line defines a function called divide that gives back a group of two whole numbers. Read it as three words: divide is the function's name, dfn means define a function, and tup@num@num is the kind it gives back. The lines under it are the function's body, and they run when the function is called.",say:"",category:"functions",mk:"21.2"},
{name:"Ert whole&rest Block",short:"ert whole&rest",chapter:"English++ Book Ch. 21 · Functions",icon:"i-go",verb:"answer",line: "divide ert whole&rest",explain:"This line hands back whole and rest together. Read it as three words: divide is the function's name, ert means return, and whole&rest are the values to hand back. The caller gets all of them at once.",say:"",category:"functions",mk:"46.26"},
{name:"Ert n*smaller Block",short:"ert n*smaller",chapter:"English++ Book Ch. 21 · Functions",icon:"i-go",verb:"answer",line: "factorial ert n*smaller",explain:"This line hands back n times smaller. Read it as three words: factorial is the function's name, ert means return, and n*smaller is the value to hand back. The function stops here, and the caller carries on with what was handed back.",say:"",category:"functions",mk:"46.26"},
{name:"Now Bbl Block",short:"now bbl",chapter:"English++ Book Ch. 21 · Functions",icon:"i-box",verb:"use",line: "now bbl now",explain:"This line opens a plain block, a group of lines that belong together. Read it as three words: now means there is nothing to say, bbl means scope, and now means the same again. Names made inside the block end when the block ends.",say:"",category:"functions"},
{name:"Now Beep Block",short:"now beep",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play",verb:"call",line: "now beep now",explain:"This line runs the function beep. Read it as three words: now means there is nothing to say, beep is the function's name, and now means it is given nothing. The function runs, and the program carries on with the next line.",say:"",category:"functions"},
{name:"Check_age 20 Block",short:"check_age 20",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play",verb:"call",line: "now check_age 20",explain:"This line runs the function check_age, giving it 20. Read it as three words: now means there is nothing to say, check_age is the function's name, and 20 is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"functions"},
{name:"Greet Ada&3 Block",short:"greet Ada&3",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play",verb:"run",line: "now greet \"Ada\"&3",explain:"This line runs the function greet, giving it \"Ada\" and 3. Read it as three words: now means there is nothing to say, greet is the function's name, and \"Ada\"&3 is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"functions"},
{name:"Hello Ada Block",short:"hello Ada",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play",verb:"call",line: "now hello \"Ada\"",explain:"This line runs the function hello, giving it \"Ada\". Read it as three words: now means there is nothing to say, hello is the function's name, and \"Ada\" is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"functions"},
{name:"Hello Bob&Hi Block",short:"hello Bob&Hi",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play",verb:"call",line: "now hello \"Bob\"&\"Hi\"",explain:"This line runs the function hello, giving it \"Bob\" and \"Hi\". Read it as three words: now means there is nothing to say, hello is the function's name, and \"Bob\"&\"Hi\" is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"functions"},
{name:"Score_up 2 Block",short:"score_up 2",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play",verb:"call",line: "now score_up 2",explain:"This line runs the function score_up, giving it 2. Read it as three words: now means there is nothing to say, score_up is the function's name, and 2 is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"functions"},
{name:"Try_copy x Block",short:"try_copy x",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play",verb:"call",line: "now try_copy x",explain:"This line runs the function try_copy, giving it x. Read it as three words: now means there is nothing to say, try_copy is the function's name, and x is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"functions"},
{name:"Try_ref x Block",short:"try_ref x",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play",verb:"call",line: "now try_ref x",explain:"This line runs the function try_ref, giving it x. Read it as three words: now means there is nothing to say, try_ref is the function's name, and x is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"functions"},
{name:"Mlo x Block",short:"mlo x",chapter:"English++ Book Ch. 21 · Functions",icon:"i-box",verb:"use",line: "peek mlo x",explain:"This line makes peek a new name that looks at the same box as x but can never change it. Read it as three words: peek is the new name, mlo means make a look-only reference, and x is the box it looks at. Lines can read x through peek, but they cannot change x through it.",say:"",category:"functions"},
{name:"Is a%b Block",short:"is a%b",chapter:"English++ Book Ch. 21 · Functions",icon:"i-box",verb:"read",line: "rest is a%b",explain:"This line makes rest hold what is left when a is divided by b. Read it as three words: rest is the name, is makes or changes a thing, and a%b is the value it gets. After this line, rest is that value.",say:"",category:"math",mk:"8.0"},
{name:"Mgl 0 Block",short:"mgl 0",chapter:"English++ Book Ch. 21 · Functions",icon:"i-box",verb:"use",line: "score mgl 0",explain:"This line makes a box called score that starts as the number 0 and lives for the whole program. Read it as three words: score is the box's name, mgl means make a global, and 0 is its starting value. Every function in the program can see score.",say:"",category:"functions",mk:"21.5"},
{name:"Dpm see@vec@num Block",short:"dpm see@vec@num",chapter:"English++ Book Ch. 21 · Functions",icon:"i-tag",verb:"take",line: "v dpm see@vec@num",explain:"This line says the function takes a look-only reference to a list of whole numbers called v. Read it as three words: v is the name, dpm means parameter, and see@vec@num is the kind it is made as. Every call gives it a value of that kind.",say:"",category:"functions",mk:"21.6"},
{name:"Is a/b Block",short:"is a/b",chapter:"English++ Book Ch. 21 · Functions",icon:"i-box",verb:"read",line: "whole is a/b",explain:"This line makes whole hold a divided by b. Read it as three words: whole is the name, is makes or changes a thing, and a/b is the value it gets. After this line, whole is a divided by b.",say:"",category:"math",mk:"8.0"},
{name:"Dpm Hello Block",short:"dpm Hello",chapter:"English++ Book Ch. 21 · Functions",icon:"i-tag",verb:"take",line: "word dpm \"Hello\"",explain:"This line says the function takes word, starting as \"Hello\" if the caller gives nothing. Read it as three words: word is the name, dpm means parameter, and \"Hello\" is the starting value. A call may give word, or leave it out and let it start as \"Hello\".",say:"",category:"functions",mk:"46.21"},
{name:"Ert n>2 Block",short:"ert n>2",chapter:"English++ Book Ch. 22 · Functions in a Name",icon:"i-go",verb:"answer",line: "big ert n>2",explain:"This line hands back yes when n is more than the number 2, and nay when it is not. Read it as three words: big is the function's name, ert means return, and n>2 is the test to hand back. The caller gets yes or nay from this line.",say:"",category:"functions",mk:"46.26"},
{name:"Keep If Block",short:"cft",chapter:"English++ Book Ch. 22 · Functions in a Name",icon:"i-go",verb:"filtered",line: "out prn cft&v&big",explain:"This line prints only the items of v that pass the function big, which keeps numbers above 2. Read it as three words: out means the screen, prn means print a line, and cft&v&big is the value to print. Here, v holds 1, 5, 2 and 8, so it prints [5, 8].",say:"",category:"functions"},
{name:"Map Through Block",short:"cmp",chapter:"English++ Book Ch. 22 · Functions in a Name",icon:"i-go",verb:"each",line: "out prn cmp&v&square",explain:"This line sends each item of v through the function square and prints the new list. Read it as three words: out means the screen, prn means print a line, and cmp&v&square is the value to print. Here, v holds 1, 2 and 3, so it prints [1, 4, 9].",say:"",category:"functions"},
{name:"Function Box Block",short:"fun",chapter:"English++ Book Ch. 22 · Functions in a Name",icon:"i-go",verb:"function",line: "say_size mak fun@num@txt",explain:"This line makes an empty box called say_size that can hold a function which takes a text and gives a whole number. Read it as three words: say_size is the new name, mak means make, and fun@num@txt is the kind it is made as. The Book puts sizer in it, and say_size&\"hello\" prints 5.",say:"",category:"functions"},
{name:"Ert w@0 Block",short:"ert w@0",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-go",verb:"answer",line: "first ert w@0",explain:"This line hands back the item at position 0 of w. Read it as three words: first is the function's name, ert means return, and w@0 is the value to hand back. The function stops here, and the caller carries on with what was handed back.",say:"",category:"functions",mk:"46.26"},
{name:"Is Bo&Al&Cy&Di Block",short:"is Bo&Al&Cy&Di",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"read",line: "names is \"Bo\"&\"Al\"&\"Cy\"&\"Di\"",explain:"This line makes names a list of \"Bo\", \"Al\", \"Cy\", and \"Di\". Read it as three words: names is the new name, is makes or changes a thing, and the values joined with & are the items of the list. After this line, names holds \"Bo\", \"Al\", \"Cy\", and \"Di\".",say:"",category:"lists",mk:"46.3"},
{name:"Prn jobs@top& Block",short:"prn jobs@top&",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-say",verb:"find",line: "out prn jobs@top&",explain:"This line prints the smallest job on the heap, the one on top. Read it as three words: out means the screen, prn means print a line, and jobs@top& is the smallest job to print. The heap keeps the smallest job on top, so it is the one that comes out first.",say:"",category:"maps-collections"},
{name:"Low Heap Block",short:"mhp",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-say",verb:"priority",line: "jobs mak mhp@num",explain:"This line makes an empty priority queue called jobs that holds whole numbers, with the smallest on top. Read it as three words: jobs is the new name, mak means make, and mhp@num is the kind it is made as. After adding 5, 1 and 3, the top of jobs prints 1.",say:"",category:"maps-collections"},
{name:"Ert x<y Block",short:"ert x<y",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-go",verb:"answer",line: "shorter ert x<y",explain:"This line hands back yes when x is less than y, and nay when it is not. Read it as three words: shorter is the function's name, ert means return, and x<y is the test to hand back. The caller gets yes or nay from this line.",say:"",category:"functions",mk:"46.26"},
{name:"Is 2&4&6&8&10 Block",short:"is 2&4&6&8&10",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"read",line: "sorted is 2&4&6&8&10",explain:"This line makes sorted a list of 2, 4, 6, 8, and 10. Read it as three words: sorted is the new name, is makes or changes a thing, and the values joined with & are the items of the list. After this line, sorted holds 2, 4, 6, 8, and 10.",say:"",category:"lists",mk:"46.3"},
{name:"Every One Block",short:"cea",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"each",line: "out prn cea&scores&passed",explain:"This line prints whether every score in scores passes the function passed, which wants more than 80. Read it as three words: out means the screen, prn means print a line, and cea&scores&passed is the value to print. 70 does not pass, so it prints nay.",say:"",category:"lists"},
{name:"Any Passes Block",short:"can",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"any",line: "out prn can&scores&passed",explain:"This line prints whether at least one score in scores passes the function passed, which wants more than 80. Read it as three words: out means the screen, prn means print a line, and can&scores&passed is the value to print. 85 and 92 pass, so it prints yes.",say:"",category:"lists"},
{name:"None Passes Block",short:"cnn",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"none",line: "out prn cnn&scores&passed",explain:"This line prints whether no score in scores passes the function passed, which wants more than 80. Read it as three words: out means the screen, prn means print a line, and cnn&scores&passed is the value to print. Some do pass, so it prints nay.",say:"",category:"lists"},
{name:"Roll Up Block",short:"crl",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"rolled",line: "out prn crl&v&1&times",explain:"This line rolls v up into one value, starting at 1 and using the function times on each item. Read it as three words: out means the screen, prn means print a line, and crl&v&1&times is the value to print. Here, v holds 2, 3 and 4, so it prints 24.",say:"",category:"lists"},
{name:"Union Block",short:"cun",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"union",line: "out prn cun&a&b",explain:"This line prints every number that is in a or in b, each one once. Read it as three words: out means the screen, prn means print a line, and cun&a&b is the value to print. Here, a holds 1, 2, 3 and b holds 2, 3, 4, so it prints [1, 2, 3, 4].",say:"",category:"lists"},
{name:"In Both Block",short:"cbt",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"both",line: "out prn cbt&a&b",explain:"This line prints only the numbers that are in both a and b. Read it as three words: out means the screen, prn means print a line, and cbt&a&b is the value to print. Here, a holds 1, 2, 3 and b holds 2, 3, 4, so it prints [2, 3].",say:"",category:"lists"},
{name:"Only First Block",short:"cot",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"only",line: "out prn cot&a&b",explain:"This line prints the numbers that are in a but not in b. Read it as three words: out means the screen, prn means print a line, and cot&a&b is the value to print. Here, a holds 1, 2, 3 and b holds 2, 3, 4, so it prints [1].",say:"",category:"lists"},
{name:"List Part Block",short:"ccu",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"part",line: "out prn ccu&v&1&2",explain:"This line prints a part of v, 2 items taken from position 1. Read it as three words: out means the screen, prn means print a line, and ccu&v&1&2 is the value to print. Here, v holds 5, 6, 7, 8 and 9, so it prints [6, 7].",say:"",category:"lists"},
{name:"Counted List Block",short:"crg",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"counted",line: "out prn crg&0&5",explain:"This line prints a list counted from 0 up to, but not including, 5. Read it as three words: out means the screen, prn means print a line, and crg&0&5 is the value to print. It prints [0, 1, 2, 3, 4].",say:"",category:"lists"},
{name:"Halves Search Block",short:"cbf",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"found",line: "out prn cbf&sorted&6",explain:"This line prints whether 6 is in the sorted list sorted, found by halving the search each step. Read it as three words: out means the screen, prn means print a line, and cbf&sorted&6 is the value to print. Here, sorted holds 2, 4, 6, 8 and 10, so it prints yes.",say:"",category:"lists"},
{name:"Halves Position Block",short:"cpb",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"position",line: "out prn cpb&sorted&6",explain:"This line prints the position of 6 in the sorted list sorted, found by halving the search each step. Read it as three words: out means the screen, prn means print a line, and cpb&sorted&6 is the value to print. Counting from 0, 6 sits at place 2, so it prints 2.",say:"",category:"lists"},
{name:"Group By Block",short:"cgr",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"group",line: "g is cgr&words&first",explain:"This line makes g hold the items of words grouped by the function first, which gives each word's first letter. Read it as three words: g is the name, is makes or changes a thing, and cgr&words&first is the value it gets. Walking g, the Book prints a: [ant, ape] and b: [bee].",say:"",category:"lists"},
{name:"Flatten Lists Block",short:"cjn",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-box",verb:"join",line: "out prn cjn&lists",explain:"This line joins all the lists inside lists into one list and prints it. Read it as three words: out means the screen, prn means print a line, and cjn&lists is the value to print. Here, lists holds 1, 2 and 3, 4, so it prints [1, 2, 3, 4].",say:"",category:"lists"},
{name:"Fea evens& Block",short:"fea evens&",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-visit",verb:"visit",line: "n fea evens&",explain:"This line walks through the generator evens one item at a time, calling each item n. Read it as three words: n is the name for each item, fea means for each, and evens& is the generator to walk. Here the lines under it run once for every value evens hands over, with n holding that value.",say:"",category:"loops",mk:"17.0"},
{name:"Prn copy& Block",short:"prn copy&",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-say",verb:"find",line: "out prn copy&",explain:"This line prints the answer of calling copy on the screen. Read it as three words: out means the screen, prn means print a line, and copy& is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"printing"},
{name:"Sge 2 Block",short:"sge 2",chapter:"English++ Book Ch. 25 · Checks and Tests",icon:"i-box",verb:"use",line: "a sge 2",explain:"This line checks that a passes the test, and stops the program here if it does not. Read it as three words: a is the value to test, sge means should be greater than or equal to, and 2 is the value to compare with. Here the test is whether a is at least the number 2.",say:"",category:"checks-tests"},
{name:"Sle 2 Block",short:"sle 2",chapter:"English++ Book Ch. 25 · Checks and Tests",icon:"i-box",verb:"use",line: "a sle 2",explain:"This line checks that a passes the test, and stops the program here if it does not. Read it as three words: a is the value to test, sle means should be less than or equal to, and 2 is the value to compare with. Here the test is whether a is at most the number 2.",say:"",category:"checks-tests"},
{name:"Slt 3 Block",short:"slt 3",chapter:"English++ Book Ch. 25 · Checks and Tests",icon:"i-box",verb:"use",line: "a slt 3",explain:"This line checks that a passes the test, and stops the program here if it does not. Read it as three words: a is the value to test, slt means should be less than, and 3 is the value to compare with. Here the test is whether a is less than the number 3.",say:"",category:"checks-tests"},
{name:"Sne 3 Block",short:"sne 3",chapter:"English++ Book Ch. 25 · Checks and Tests",icon:"i-box",verb:"use",line: "a sne 3",explain:"This line checks that a passes the test, and stops the program here if it does not. Read it as three words: a is the value to test, sne means should be not equal, and 3 is the value to compare with. Here the test is whether a is different from the number 3.",say:"",category:"checks-tests"},
{name:"Sgt 2 Block",short:"sgt 2",chapter:"English++ Book Ch. 25 · Checks and Tests",icon:"i-box",verb:"use",line: "x sgt 2",explain:"This line checks that x passes the test, and stops the program here if it does not. Read it as three words: x is the value to test, sgt means should be greater than, and 2 is the value to compare with. Here the test is whether x is more than the number 2.",say:"",category:"checks-tests"},
{name:"Dog Dds Block",short:"Dog dds",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-box",verb:"use",line: "Dog dds now",explain:"This line opens the lines that run when a Dog is destroyed. Read it as three words: Dog is the kind's name, dds means define what happens when destroyed, and now means there is nothing to say. It is the place for tidying up what the thing owns.",say:"",category:"classes"},
{name:"Pay_in 50 Block",short:"pay_in 50",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-play",verb:"call",line: "acct pay_in 50",explain:"This line asks acct to pay_in 50. Read it as three words: acct is the thing to act on, pay_in is what it should do, and 50 is what it is given. The thing does it, and the program carries on with the next line.",say:"",category:"classes"},
{name:"Dkn num Block",short:"dkn num",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-box",verb:"use",line: "area dkn num",explain:"This line defines a function called area that gives back a whole number and promises not to change the thing it works on. Read it as three words: area is the function's name, dkn means define a constant function, and num is the kind it gives back. It can read the thing, but it cannot change it.",say:"",category:"classes",mk:"26.1"},
{name:"Dsh 0 Block",short:"dsh 0",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-box",verb:"use",line: "made dsh 0",explain:"This line makes a box called made that starts as the number 0 and is shared by all of them. Read it as three words: made is the box's name, dsh means define a shared value, and 0 is its starting value. There is one made for the whole kind, not one per thing.",say:"",category:"classes"},
{name:"Now Warm_up Block",short:"now warm_up",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-play",verb:"call",line: "now warm_up now",explain:"This line runs the function warm_up. Read it as three words: now means there is nothing to say, warm_up is the function's name, and now means it is given nothing. The function runs, and the program carries on with the next line.",say:"",category:"classes"},
{name:"Dfd Ada Block",short:"dfd Ada",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-brick",verb:"hold",line: "owner dfd \"Ada\"",explain:"This line gives the kind a field called owner that starts as \"Ada\". Read it as three words: owner is the field's name, dfd means define a field, and \"Ada\" is its starting value. Every thing of this kind gets its own owner.",say:"",category:"classes",mk:"46.29"},
{name:"R Start Block",short:"r start",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-play",verb:"call",line: "r start now",explain:"This line asks r to start. Read it as three words: r is the thing to act on, start is what it should do, and now means there is nothing to say. The thing does it, and the program carries on with the next line.",say:"",category:"classes"},
{name:"Dsf txt Block",short:"dsf txt",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-box",verb:"use",line: "report dsf txt",explain:"This line defines a function called report that belongs to the kind itself and gives back a text. Read it as three words: report is the function's name, dsf means define a shared function, and txt is the kind it gives back. It is called on the kind, not on one thing of the kind.",say:"",category:"classes"},
{name:"Ert Dogs so far: +txt&made Block",short:"ert Dogs so far: +txt&made",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-go",verb:"answer",line: "report ert \"Dogs so far: \"+txt&made",explain:"This line hands back \"Dogs so far: \" plus made written as text. Read it as three words: report is the function's name, ert means return, and \"Dogs so far: \"+txt&made is the value to hand back. The function stops here, and the caller carries on with what was handed back.",say:"",category:"functions",mk:"46.26"},
{name:"Grow 2 Block",short:"grow 2",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-play",verb:"call",line: "rex grow 2",explain:"This line asks rex to grow 2. Read it as three words: rex is the thing to act on, grow is what it should do, and 2 is what it is given. The thing does it, and the program carries on with the next line.",say:"",category:"classes"},
{name:"Think Dhd Block",short:"think dhd",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-box",verb:"use",line: "think dhd now",explain:"This line defines a function called think that only the kind's own lines can use. Read it as three words: think is the function's name, dhd means define a hidden function, and now means there is nothing to say. No one outside the kind can call think.",say:"",category:"classes"},
{name:"This Thing Block",short:"slf",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-box",verb:"thing",line: "slf@x is x",explain:"This line sets the field x of the thing being made to the value of the parameter x. Read it as three words: slf@x is the field to set, is makes or changes a thing, and x is the value it gets. Here slf@x is the field and x is the parameter, so s@x then prints 3.",say:"",category:"classes"},
{name:"Dcl Animal&Friend Block",short:"dcl Animal&Friend",chapter:"English++ Book Ch. 27 · Children",icon:"i-shapes",verb:"shape",line: "Dog dcl Animal&Friend",explain:"This line defines a new kind of thing called Dog, which is both Animal and Friend. Read it as three words: Dog is the new kind's name, dcl means define a class, and Animal&Friend is its parents. The lines under it are the kind's fields and functions, and it starts with everything its parents have.",say:"",category:"classes",mk:"46.16"},
{name:"Dmb dec Block",short:"dmb dec",chapter:"English++ Book Ch. 27 · Children",icon:"i-box",verb:"use",line: "area dmb dec",explain:"This line says every child kind must write its own area, which gives back a decimal. Read it as three words: area is the function's name, dmb means must be redone, and dec is the kind it gives back. This kind has no area of its own, so it cannot be made by itself.",say:"",category:"classes",mk:"27.0"},
{name:"Ert npi*r*r Block",short:"ert npi*r*r",chapter:"English++ Book Ch. 27 · Children",icon:"i-go",verb:"answer",line: "area ert npi*r*r",explain:"This line hands back pi times r times r. Read it as three words: area is the function's name, ert means return, and npi*r*r is the value to hand back. The function stops here, and the caller carries on with what was handed back.",say:"",category:"functions",mk:"46.26"},
{name:"Mwn Cat Block",short:"mwn Cat",chapter:"English++ Book Ch. 27 · Children",icon:"i-box",verb:"use",line: "c mwn Cat",explain:"This line makes a new Cat that c owns. Read it as three words: c is the owner's name, mwn means make an owned thing, and Cat is the kind to make. When c goes away, the Cat is tidied up by itself.",say:"",category:"pointers"},
{name:"Dfm 5 Block",short:"dfm 5",chapter:"English++ Book Ch. 27 · Children",icon:"i-box",verb:"use",line: "energy dfm 5",explain:"This line gives the kind a family field called energy that starts as the number 5. Read it as three words: energy is the field's name, dfm means define a family field, and 5 is its starting value. The kind and its children can see energy, but no one else can.",say:"",category:"classes"},
{name:"Now Rest Block",short:"now rest",chapter:"English++ Book Ch. 27 · Children",icon:"i-play",verb:"call",line: "now rest now",explain:"This line runs the function rest. Read it as three words: now means there is nothing to say, rest is the function's name, and now means it is given nothing. The function runs, and the program carries on with the next line.",say:"",category:"classes"},
{name:"Rest Dfy Block",short:"rest dfy",chapter:"English++ Book Ch. 27 · Children",icon:"i-box",verb:"use",line: "rest dfy now",explain:"This line defines a family function called rest that the kind and its children can use. Read it as three words: rest is the function's name, dfy means define a family function, and now means there is nothing to say. No one outside the kind's family can call rest.",say:"",category:"classes"},
{name:"Owned Pointers Block",short:"own",chapter:"English++ Book Ch. 27 · Children",icon:"i-box",verb:"owned",line: "pets mak vec@own@Animal",explain:"This line makes an empty list called pets that holds owned pointers to Animal things. Read it as three words: pets is the new name, mak means make, and vec@own@Animal is the kind it is made as. After the Book adds a Dog and a Cat, each one's sound prints Woof then Meow.",say:"",category:"classes"},
{name:"Ert ... Block",short:"ert ...",chapter:"English++ Book Ch. 27 · Children",icon:"i-go",verb:"answer",line: "sound ert \"...\"",explain:"This line hands back \"...\". Read it as three words: sound is the function's name, ert means return, and \"...\" is the value to hand back. The function stops here, and the caller carries on with what was handed back.",say:"",category:"functions",mk:"46.26"},
{name:"Ert rank<o@rank Block",short:"ert rank<o@rank",chapter:"English++ Book Ch. 28 · More Kinds of Your Own",icon:"i-go",verb:"answer",line: "< ert rank<o@rank",explain:"This line is inside the less-than operator, and it hands back yes when this thing's rank is less than o's rank. Read it as three words: < is the operator's name, ert means return, and rank<o@rank is the test to hand back. Two things are put in order by their rank, smaller first.",say:"",category:"functions",mk:"46.26"},
{name:"Both Dun Block",short:"Both dun",chapter:"English++ Book Ch. 28 · More Kinds of Your Own",icon:"i-box",verb:"use",line: "Both dun now",explain:"This line defines a kind called Both that holds one of two things at a time, sharing the same space. Read it as three words: Both is the new kind's name, dun means define a union, and now means there is nothing to say. Only one of the two things is alive at a time.",say:"",category:"classes"},
{name:"Dal vec@Row Block",short:"dal vec@Row",chapter:"English++ Book Ch. 28 · More Kinds of Your Own",icon:"i-box",verb:"use",line: "Grid dal vec@Row",explain:"This line gives a list of Rows a short name, Grid. Read it as three words: Grid is the new short name, dal means define an alias, and vec@Row is the kind it stands for. From here on, Grid can be written wherever vec@Row could.",say:"",category:"classes"},
{name:"Den happy&sad&sleepy Block",short:"den happy&sad&sleepy",chapter:"English++ Book Ch. 28 · More Kinds of Your Own",icon:"i-list",verb:"choose",line: "Mood den happy&sad&sleepy",explain:"This line defines a kind called Mood with the fixed choices happy, sad, and sleepy. Read it as three words: Mood is the new kind's name, den means define an enum, and happy&sad&sleepy is the choices it can be. A Mood can only ever be one of those choices.",say:"",category:"classes",mk:"28.0"},
{name:"Ieq Mood@happy Block",short:"ieq Mood@happy",chapter:"English++ Book Ch. 28 · More Kinds of Your Own",icon:"i-fork",verb:"sort",line: "m ieq Mood@happy",explain:"This line runs the lines under it only when m passes the test. Read it as three words: m is the value to test, ieq means if equal, and Mood@happy is the value to compare with. Here the test is whether m is the same as the happy choice of the Mood kind.",say:"",category:"tests-choices"},
{name:"Is Mood@happy Block",short:"is Mood@happy",chapter:"English++ Book Ch. 28 · More Kinds of Your Own",icon:"i-box",verb:"read",line: "m is Mood@happy",explain:"This line makes m hold the happy choice of the Mood kind. Read it as three words: m is the name, is makes or changes a thing, and Mood@happy is the value it gets. After this line, m is that value.",say:"",category:"classes",mk:"28.0"},
{name:"Is Spot&x+o@x&y+o@y Block",short:"is Spot&x+o@x&y+o@y",chapter:"English++ Book Ch. 28 · More Kinds of Your Own",icon:"i-box",verb:"read",line: "r is Spot&x+o@x&y+o@y",explain:"This line makes r a new Spot, made with x plus the x of o and y plus the y of o. Read it as three words: r is the new name, is makes or changes a thing, and Spot&x+o@x&y+o@y is the kind and what it is made with. After this line, r is that new Spot.",say:"",category:"classes",mk:"46.5"},
{name:"Show five Block",short:"show five",chapter:"English++ Book Ch. 29 · Any Kind",icon:"i-play",verb:"call",line: "now show \"five\"",explain:"This line runs the function show, giving it \"five\". Read it as three words: now means there is nothing to say, show is the function's name, and \"five\" is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"classes"},
{name:"Show 5 Block",short:"show 5",chapter:"English++ Book Ch. 29 · Any Kind",icon:"i-play",verb:"call",line: "now show 5",explain:"This line runs the function show, giving it 5. Read it as three words: now means there is nothing to say, show is the function's name, and 5 is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"classes"},
{name:"Any Kind Block",short:"any",chapter:"English++ Book Ch. 29 · Any Kind",icon:"i-box",verb:"any",line: "x dpm any",explain:"This line says the function takes a value of any kind called x, and C++ works out the kind. Read it as three words: x is the name, dpm means parameter, and any is the kind it is made as. So show can take 5 and \"five\", printing It is: 5 and It is: five.",say:"",category:"classes",mk:"46.21"},
{name:"Msh Torch Block",short:"msh Torch",chapter:"English++ Book Ch. 30 · Pointers",icon:"i-box",verb:"use",line: "a msh Torch",explain:"This line makes a new Torch that a shares. Read it as three words: a is the sharer's name, msh means make a shared thing, and Torch is the kind to make. The Torch is tidied up when the last share goes away.",say:"",category:"pointers"},
{name:"Mmv a Block",short:"mmv a",chapter:"English++ Book Ch. 30 · Pointers",icon:"i-box",verb:"use",line: "b mmv a",explain:"This line moves a into a new name, b. Read it as three words: b is the new name, mmv means move, and a is the thing to move. b now owns what a owned, and a is left empty.",say:"",category:"pointers"},
{name:"Show_it a Block",short:"show_it a",chapter:"English++ Book Ch. 30 · Pointers",icon:"i-play",verb:"call",line: "now show_it a",explain:"This line runs the function show_it, giving it a. Read it as three words: now means there is nothing to say, show_it is the function's name, and a is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"pointers"},
{name:"Prn *p Block",short:"prn *p",chapter:"English++ Book Ch. 30 · Pointers",icon:"i-say",verb:"find",line: "out prn *p",explain:"This line prints the value that p points to on the screen. Read it as three words: out means the screen, prn means print a line, and *p is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"pointers"},
{name:"Shared Pointer Block",short:"shr",chapter:"English++ Book Ch. 30 · Pointers",icon:"i-box",verb:"shared",line: "t dpm shr@Torch",explain:"This line says the function takes a shared pointer to a Torch called t. Read it as three words: t is the name, dpm means parameter, and shr@Torch is the kind it is made as. Inside the function the Torch has two sharers, so t@use_count prints 2.",say:"",category:"pointers",mk:"46.21"},
{name:"Dfd arr@num@4 Block",short:"dfd arr@num@4",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-brick",verb:"hold",line: "v dfd arr@num@4",explain:"This line gives the kind a field called v that holds an array of 4 whole numbers. Read it as three words: v is the field's name, dfd means define a field, and arr@num@4 is the kind it holds. Every thing of this kind gets its own v.",say:"",category:"classes",mk:"46.29"},
{name:"Handed Over Block",short:"tkn",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-box",verb:"thing",line: "o dpm tkn@Kept",explain:"This line says this way of making a Kept takes another Kept called o, handed over to keep. Read it as three words: o is the name, dpm means parameter, and tkn@Kept is the kind it is made as. Moving k into w uses this, so w@x becomes 1 plus 1 and prints 2.",say:"",category:"classes",mk:"46.21"},
{name:"Is o@x+1 Block",short:"is o@x+1",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-box",verb:"read",line: "x is o@x+1",explain:"This line makes x hold the x of o plus the number 1. Read it as three words: x is the name, is makes or changes a thing, and o@x+1 is the value it gets. After this line, x is that value.",say:"",category:"math",mk:"46.5"},
{name:"Is forever&n+1 Block",short:"is forever&n+1",chapter:"English++ Book Ch. 33 · When Things Go Wrong",icon:"i-box",verb:"read",line: "next is forever&n+1",explain:"This line makes next hold the answer of calling forever with n plus the number 1. Read it as three words: next is the name, is makes or changes a thing, and forever&n+1 is the value it gets. After this line, next is that value.",say:"",category:"errors"},
{name:"Etw Late&5 Block",short:"etw Late&5",chapter:"English++ Book Ch. 33 · When Things Go Wrong",icon:"i-shield-alert",verb:"warn",line: "now etw Late&5",explain:"This line throws a Late problem carrying the number 5. Read it as three words: now means there is nothing to say, etw means throw, and Late&5 is the problem to throw. The program stops here unless a catch block is waiting.",say:"",category:"errors"},
{name:"Now Etw Block",short:"now etw",chapter:"English++ Book Ch. 33 · When Things Go Wrong",icon:"i-shield-alert",verb:"warn",line: "now etw now",explain:"This line passes the problem on to the next catch out, from inside a catch block. Read it as three words: now means there is nothing to say, etw means throw, and now means the same problem as before. The problem is thrown again, so the next catch block can take it.",say:"",category:"errors"},
{name:"Ext 0 Block",short:"ext 0",chapter:"English++ Book Ch. 33 · When Things Go Wrong",icon:"i-box",verb:"use",line: "now ext 0",explain:"This line leaves the whole program, with the number 0 saying how it went. Read it as three words: now means there is nothing to say, ext means exit, and 0 is the number to leave with. Leaving with 0 means all went well.",say:"",category:"errors"},
{name:"Set_age -3 Block",short:"set_age -3",chapter:"English++ Book Ch. 33 · When Things Go Wrong",icon:"i-play",verb:"call",line: "now set_age -3",explain:"This line runs the function set_age, giving it -3. Read it as three words: now means there is nothing to say, set_age is the function's name, and -3 is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"errors"},
{name:"Hcp b Block",short:"hcp b",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"use",line: "\"a\" hcp \"b\"",explain:"This line copies the file \"a\" to \"b\". Read it as three words: \"a\" is the file to copy, hcp means copy, and \"b\" is the file to copy it to. After this line, both files hold the same words.",say:"",category:"files"},
{name:"Hmv b Block",short:"hmv b",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"use",line: "\"a\" hmv \"b\"",explain:"This line moves the file \"a\" to \"b\". Read it as three words: \"a\" is the file to move, hmv means move, and \"b\" is the file to move it to. After this line, the file is only at its new name.",say:"",category:"files"},
{name:"A.txt Hrm Block",short:"a.txt hrm",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"use",line: "\"a.txt\" hrm now",explain:"This line removes the file \"a.txt\". Read it as three words: \"a.txt\" is the file to remove, hrm means remove, and now means there is nothing to say. After this line, the file is gone.",say:"",category:"files"},
{name:"Box Hmk Block",short:"box hmk",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"use",line: "\"box\" hmk now",explain:"This line makes a new empty folder called \"box\". Read it as three words: \"box\" is the folder to make, hmk means make a folder, and now means there is nothing to say. The folder is empty, ready for files.",say:"",category:"files"},
{name:"Mfi a.txt Block",short:"mfi a.txt",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"use",line: "f mfi \"a.txt\"",explain:"This line opens the file \"a.txt\" to read. Read it as three words: f is the file's name, mfi means make a file to read from, and \"a.txt\" is the file's name. The file is read through f.",say:"",category:"files"},
{name:"Mfo a.txt Block",short:"mfo a.txt",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"use",line: "f mfo \"a.txt\"",explain:"This line opens the file \"a.txt\" to write. Read it as three words: f is the file's name, mfo means make a file to write to, and \"a.txt\" is the file's name. The file is written through f.",say:"",category:"files"},
{name:"Open later.txt Block",short:"open later.txt",chapter:"English++ Book Ch. 35 · Files",icon:"i-play",verb:"call",line: "f open \"later.txt\"",explain:"This line asks f to open \"later.txt\". Read it as three words: f is the thing to act on, open is what it should do, and \"later.txt\" is what it is given. The thing does it, and the program carries on with the next line.",say:"",category:"files"},
{name:"Note_it f&finished Block",short:"note_it f&finished",chapter:"English++ Book Ch. 35 · Files",icon:"i-play",verb:"call",line: "now note_it f&\"finished\"",explain:"This line runs the function note_it, giving it f and \"finished\". Read it as three words: now means there is nothing to say, note_it is the function's name, and f&\"finished\" is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"files"},
{name:"Show_all g Block",short:"show_all g",chapter:"English++ Book Ch. 35 · Files",icon:"i-play",verb:"call",line: "now show_all g",explain:"This line runs the function show_all, giving it g. Read it as three words: now means there is nothing to say, show_all is the function's name, and g is what it is given. The function runs, and the program carries on with the next line.",say:"",category:"files"},
{name:"Gln f Block 2",short:"gln f 2",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"use",line: "rest gln f",explain:"This line reads the rest of the current line from the file f and keeps it in rest. Read it as three words: rest is the box the text goes into, gln means get a line, and f is the file to read from. It takes everything up to the end of that line, spaces and all.",say:"",category:"files"},
{name:"Whole File Block",short:"hrd",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"read",line: "out prn hrd&\"notes.txt\"",explain:"This line reads all of the file \"notes.txt\" and prints it. Read it as three words: out means the screen, prn means print a line, and hrd&\"notes.txt\" is the value to print. It prints the line \"Remember the milk.\" that was just written into the file.",say:"",category:"files"},
{name:"File Lines Block",short:"hln",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"lines",line: "out prn hln&name",explain:"This line reads the file named in name and prints its lines as a list. Read it as three words: out means the screen, prn means print a line, and hln&name is the value to print. The file holds one and two, so it prints [one, two].",say:"",category:"files"},
{name:"File Exists Block",short:"hex",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"exists",line: "out prn hex&name",explain:"This line prints whether a file with the name in name, which is \"notes.txt\", exists. Read it as three words: out means the screen, prn means print a line, and hex&name is the value to print. Before the file is written it prints nay, and after it is written it prints yes.",say:"",category:"files"},
{name:"File Size Block",short:"hsz",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"size",line: "out prn hsz&name",explain:"This line prints how many bytes are in the file named in name. Read it as three words: out means the screen, prn means print a line, and hsz&name is the value to print. The file holds hello, so it prints 5.",say:"",category:"files"},
{name:"Folder List Block",short:"hls",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"files",line: "out prn hls&\"box\"",explain:"This line prints the list of files in the folder \"box\". Read it as three words: out means the screen, prn means print a line, and hls&\"box\" is the value to print. After the Book copies and moves its files, it prints [a.txt, c.txt].",say:"",category:"files"},
{name:"Write Stream Block",short:"ofs",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"file",line: "file dpm ref@ofs",explain:"This line says the function takes a reference to a file to write, called file. Read it as three words: file is the name, dpm means parameter, and ref@ofs is the kind it is made as. The function then writes a line into that file, so the log later reads - started and - finished.",say:"",category:"files",mk:"46.21"},
{name:"Read Stream Block",short:"ifs",chapter:"English++ Book Ch. 35 · Files",icon:"i-box",verb:"file",line: "file dpm ref@ifs",explain:"This line says the function takes a reference to a file to read, called file. Read it as three words: file is the name, dpm means parameter, and ref@ifs is the kind it is made as. The function then prints each line of that file, which shows - started and - finished.",say:"",category:"files",mk:"46.21"},
{name:"Is kms-start Block",short:"is kms-start",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-box",verb:"read",line: "took is kms-start",explain:"This line makes took hold the milliseconds since the program started minus start. Read it as three words: took is the name, is makes or changes a thing, and kms-start is the value it gets. After this line, took is that value.",say:"",category:"math",mk:"8.0"},
{name:"Msy work&5 Block",short:"msy work&5",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-box",verb:"use",line: "a msy work&5",explain:"This line starts work running now with 5, and keeps the answer in a to take later. Read it as three words: a is the name the answer is kept in, msy means make it async, and work&5 is the function to run. The program can carry on and take the answer when it needs it.",say:"",category:"clock-threads"},
{name:"Msy slow_add&1&2 Block",short:"msy slow_add&1&2",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-box",verb:"use",line: "answer msy slow_add&1&2",explain:"This line starts slow_add running now with 1 and 2, and keeps the answer in answer to take later. Read it as three words: answer is the name the answer is kept in, msy means make it async, and slow_add&1&2 is the function to run. The program can carry on and take the answer when it needs it.",say:"",category:"clock-threads"},
{name:"Fpr v Block",short:"fpr v",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-box",verb:"use",line: "n fpr v",explain:"This line walks through v, and the work may run on several cores at once. Read it as three words: n is the name for each item, fpr means for, in parallel, and v is the collection to walk. Here the lines under it run for every item in v, with n holding that item.",say:"",category:"clock-threads"},
{name:"Mtd say_hi&there Block",short:"mtd say_hi&there",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-nodes",verb:"start",line: "t mtd say_hi&\"there\"",explain:"This line starts a thread called t that runs say_hi with \"there\". Read it as three words: t is the thread's name, mtd means make a thread, and say_hi&\"there\" is the function to run. The thread runs beside the rest of the program.",say:"",category:"clock-threads"},
{name:"T Rdt Block",short:"t rdt",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-box",verb:"use",line: "t rdt now",explain:"This line lets the thread t run on its own, without waiting for it. Read it as three words: t is the thread, rdt means detach, and now means there is nothing to say. The thread keeps running, and the program carries on right away.",say:"",category:"clock-threads"},
{name:"Mtd add_name&names&guard&Ada Block",short:"mtd add_name&names&guard&Ada",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-nodes",verb:"start",line: "t1 mtd add_name&names&guard&\"Ada\"",explain:"This line starts a thread called t1 that runs add_name with names, guard, and \"Ada\". Read it as three words: t1 is the thread's name, mtd means make a thread, and add_name&names&guard&\"Ada\" is the function to run. The thread runs beside the rest of the program.",say:"",category:"clock-threads"},
{name:"Thread List Block",short:"thd",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-nodes",verb:"thread",line: "workers mak vec@thd",explain:"This line makes an empty list called workers that holds threads. Read it as three words: workers is the new name, mak means make, and vec@thd is the kind it is made as. The Book starts 3 threads into it and waits for each, so the count of workers prints 3.",say:"",category:"clock-threads"},
{name:"Atomic Block",short:"atm",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-nodes",verb:"atomic",line: "total mak atm@num",explain:"This line makes an atomic whole number called total that many threads can add to safely. Read it as three words: total is the new name, mak means make, and atm@num is the kind it is made as. Two threads each add 1 a thousand times, so total prints 2000.",say:"",category:"clock-threads"},
{name:"Mutex Block",short:"mtx",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-nodes",verb:"mutex",line: "guard mak mtx",explain:"This line makes a mutex called guard, a lock that lets one thread in at a time. Read it as three words: guard is the new name, mak means make, and mtx is the kind it is made as. Two threads each add a name while holding it, so the count of names prints 2.",say:"",category:"clock-threads",mk:"46.10"},
{name:"Future List Block",short:"fut",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-nodes",verb:"async",line: "results mak vec@fut@num",explain:"This line makes an empty list called results that holds async results, each a whole number to come. Read it as three words: results is the new name, mak means make, and vec@fut@num is the kind it is made as. The Book fills it with squares of 0, 1 and 2, then prints 0, 1 and 4.",say:"",category:"clock-threads"},
{name:"Cv Notify_one Block",short:"cv notify_one",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-play",verb:"call",line: "cv notify_one now",explain:"This line asks cv to notify_one. Read it as three words: cv is the thing to act on, notify_one is what it should do, and now means there is nothing to say. The thing does it, and the program carries on with the next line.",say:"",category:"clock-threads"},
{name:"Wait g&check Block",short:"wait g&check",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-play",verb:"call",line: "cv wait g&check",explain:"This line lets go of the lock g and sleeps until check says yes. Read it as three words: cv is the condition to wait on, wait is what it should do, and g&check are the lock and the test. Another thread wakes it up with cv notify_one now.",say:"",category:"clock-threads"},
{name:"Mtd show Block",short:"mtd show",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-nodes",verb:"start",line: "v mtd show",explain:"This line starts a thread called v that runs show. Read it as three words: v is the thread's name, mtd means make a thread, and show is the function to run. The thread runs beside the rest of the program.",say:"",category:"clock-threads"},
{name:"Is c@get& Block",short:"is c@get&",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-box",verb:"read",line: "x is c@get&",explain:"This line makes x hold the answer of calling get on c. Read it as three words: x is the name, is makes or changes a thing, and c@get& is the value it gets. After this line, x is that value.",say:"",category:"clock-threads",mk:"46.5"},
{name:"Channel Block",short:"chn",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-nodes",verb:"channel",line: "c mak chn@num",explain:"This line makes a channel called c that carries whole numbers from one thread to another. Read it as three words: c is the new name, mak means make, and chn@num is the kind it is made as. A thread sends 1 to 5 down it and the Book adds them up, so total prints 15.",say:"",category:"clock-threads"},
{name:"Wait Condition Block",short:"cnd",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-nodes",verb:"threads",line: "cv mak cnd",explain:"This line makes a condition called cv that threads can wait on until another thread wakes them. Read it as three words: cv is the new name, mak means make, and cnd is the kind it is made as. The Book waits on cv until ready is yes, then prints yes.",say:"",category:"clock-threads",mk:"46.10"},
{name:"Nanosecond Clock Block",short:"kns",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-nodes",verb:"since",line: "start is kns",explain:"This line makes start hold how many nanoseconds have passed since the program began. Read it as three words: start is the name, is makes or changes a thing, and kns is the value it gets. A later reading is never smaller, so the Book's stop>=start prints yes.",say:"",category:"clock-threads"},
{name:"Filled Time Block",short:"kfa",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-nodes",verb:"filled",line: "year is kfa&\"%Y\"",explain:"This line makes year hold the time filled into the pattern \"%Y\", which is the four-digit year. Read it as three words: year is the name, is makes or changes a thing, and kfa&\"%Y\" is the value it gets. The year is four digits long, so tsz&year prints 4.",say:"",category:"clock-threads"},
{name:"Is zoo@Mood@calm Block",short:"is zoo@Mood@calm",chapter:"English++ Book Ch. 40 · Groups and Other Files",icon:"i-box",verb:"read",line: "m is zoo@Mood@calm",explain:"This line makes m hold the calm choice of the Mood kind in zoo. Read it as three words: m is the name, is makes or changes a thing, and zoo@Mood@calm is the value it gets. After this line, m is that value.",say:"",category:"names-values",mk:"46.5"},
{name:"Send hello there Block",short:"send hello there",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-play",verb:"call",line: "c send \"hello there\\n\"",explain:"This line asks c to send the text \"hello there\" and a new line. Read it as three words: c is the thing to act on, send is what it should do, and the text is what it is given. The text goes out over the connection, and the program carries on.",say:"",category:"outside-world"},
{name:"Read Bytes Block",short:"hrb",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-play",verb:"read",line: "back is hrb&\"bytes.bin\"",explain:"This line makes back hold the bytes read from the file \"bytes.bin\". Read it as three words: back is the name, is makes or changes a thing, and hrb&\"bytes.bin\" is the value it gets. The file holds the bytes 1 and 200, so the count prints 2 and back@1 prints 200.",say:"",category:"outside-world"},
{name:"Encode Block",short:"xbe",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-play",verb:"base",line: "code is xbe&\"hello\"",explain:"This line makes code hold the text \"hello\" written in base 64. Read it as three words: code is the name, is makes or changes a thing, and xbe&\"hello\" is the value it gets. Printing code then shows aGVsbG8=.",say:"",category:"outside-world"},
{name:"Decode Block",short:"xbd",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-play",verb:"base",line: "out prn xbd&code",explain:"This line turns code, which holds base 64 text, back into plain text and prints it. Read it as three words: out means the screen, prn means print a line, and xbd&code is the value to print. Here, code holds aGVsbG8=, so it prints hello.",say:"",category:"outside-world"},
{name:"JSON Value Block",short:"jsn",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-play",verb:"json",line: "n mak jsn",explain:"This line makes an empty JSON value called n. Read it as three words: n is the new name, mak means make, and jsn is the kind it is made as. After the Book adds 1 and \"two\", printing n shows [1,\"two\"].",say:"",category:"outside-world",mk:"46.10"},
{name:"Prn j@name@text& Block",short:"prn j@name@text&",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-say",verb:"find",line: "out prn j@\"name\"@text&",explain:"This line prints the name stored in j as text on the screen. Read it as three words: out means the screen, prn means print a line, and j@\"name\"@text& is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"maps-collections"},
{name:"Prn num&back@1 Block",short:"prn num&back@1",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-say",verb:"find",line: "out prn num&back@1",explain:"This line prints the item at position 1 of back read as a whole number on the screen. Read it as three words: out means the screen, prn means print a line, and num&back@1 is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"names-values"},
{name:"Prn num&j@age Block",short:"prn num&j@age",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-say",verb:"find",line: "out prn num&j@\"age\"",explain:"This line prints the age stored in j read as a whole number on the screen. Read it as three words: out means the screen, prn means print a line, and num&j@\"age\" is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"maps-collections"},
{name:"Prn p@0@text& Block",short:"prn p@0@text&",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-say",verb:"find",line: "out prn p@0@text&",explain:"This line prints the item at position 0 of p as text on the screen. Read it as three words: out means the screen, prn means print a line, and p@0@text& is the value to print. After it prints, the screen moves to a fresh line.",say:"",category:"pointers"},
{name:"Prn stop>=start Block",short:"prn stop>=start",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-say",verb:"find",line: "out prn stop>=start",explain:"This line prints yes or nay on the screen. Read it as three words: out means the screen, prn means print a line, and stop>=start is the test to print. It prints yes when stop is at least start, and nay when it is not.",say:"",category:"tests-choices"},
{name:"Is j@pets Block",short:"is j@pets",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-box",verb:"read",line: "p is j@\"pets\"",explain:"This line makes p hold the pets stored in j. Read it as three words: p is the name, is makes or changes a thing, and j@\"pets\" is the value it gets. After this line, p is the pets stored in j.",say:"",category:"names-values"},
{name:"Fill 5 Block",short:"fill 5",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-play",verb:"call",line: "b fill 5",explain:"This line asks b to fill 5. Read it as three words: b is the thing to act on, fill is what it should do, and 5 is what it is given. The thing does it, and the program carries on with the next line.",say:"",category:"outside-world"},
{name:"Is std@stoi&12 Block",short:"is std@stoi&12",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-box",verb:"read",line: "n is std@stoi&\"12\"",explain:"This line makes n hold the text \"12\" read as a whole number. Read it as three words: n is the name, is makes or changes a thing, and std@stoi&\"12\" is the value it gets. After this line, n is that value.",say:"",category:"outside-world",mk:"46.5"},
{name:"Xgl ... Block",short:"xgl ...",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-box",verb:"use",line: "now xgl \"...\"",explain:"This line puts one line of C++ outside every function, where C++ keeps its global things. Read it as three words: now means there is nothing to say, xgl means C++ outside every function, and \"...\" is the C++ to put there. Like xpp, it is for the rare thing English++ cannot say.",say:"",category:"outside-world"},
{name:"Xus std Block",short:"xus std",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-box",verb:"use",line: "now xus std",explain:"This line works like using namespace std; in C++. Read it as three words: now means there is nothing to say, xus means using, and std is the namespace. The C++ lines you write after it can skip the std:: part.",say:"",category:"outside-world"},
{name:"Ring 4 Block",short:"ring 4",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-play",verb:"call",line: "t ring 4",explain:"This line asks t to ring 4. Read it as three words: t is the thing to act on, ring is what it should do, and 4 is what it is given. The thing does it, and the program carries on with the next line.",say:"",category:"outside-world"},
{name:"Push_back 3 Block",short:"push_back 3",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-play",verb:"call",line: "v push_back 3",explain:"This line asks v to push_back with the number 3, which adds 3 to the end of the list. Read it as three words: v is the list, push_back is what it should do, and 3 is what it is given. The list grows by one, and 3 is its last item.",say:"",category:"outside-world"},
{name:"Now Enx Block",short:"now enx",chapter:"English++ Book Ch. 51 · The Cheat Sheet",icon:"i-chev-right",verb:"skip",line: "now enx now",explain:"This line skips to the next turn of the loop. Read it as three words: now means there is nothing to say, enx means next, and now means the same again. The rest of this turn is left out.",say:"",category:"loops"},
{name:"Is x>3 Block",short:"is x>3",chapter:"English++ Book Ch. 51 · The Cheat Sheet",icon:"i-box",verb:"read",line: "ok is x>3",explain:"This line makes ok hold whether x is more than the number 3. Read it as three words: ok is the name, is makes or changes a thing, and x>3 is the value it gets. After this line, ok is that value.",say:"",category:"tests-choices"},
{name:"Eyd i*2 Block",short:"eyd i*2",chapter:"English++ Book Ch. 52 · The Whole Chart",icon:"i-yield",verb:"yield",line: "evens eyd i*2",explain:"This line hands over i times the number 2 and waits. Read it as three words: evens is the generator's name, eyd means yield, and i*2 is the value to hand over. The generator pauses here until the next value is asked for.",say:"",category:"functions"},
{name:"Enx x<0 Block",short:"enx x<0",chapter:"English++ Book Ch. 52 · The Whole Chart",icon:"i-chev-right",verb:"skip",line: "i enx x<0",explain:"This line skips to the next turn of the loop when x is less than the number 0. Read it as three words: i is the counter, enx means next, and x<0 is the test to skip on. The rest of this turn is left out when that is true.",say:"",category:"loops"},
];

var chapters = [
 {
  "title": "Hello!",
  "chapter": "English++ Book Ch. 2 · out prn, and Run (F5)",
  "line": "out prn \"Hello, V!\"",
  "content": {
   "story": [
    "A program is a list of things for a computer to do, one line at a time. In English++ every line is three words, and you can read each one out loud: out prn \"Hello, V!\" means the screen, print a line, Hello, V!.",
    "out is the screen. prn is the root: the word that says what happens. The text in quote marks is what gets printed, and it counts as one word however many spaces it has.",
    "Your English++ turns into C++, the language big games and apps are written in, and the C++ turns into something your computer can run. So what you make is a real program."
   ],
   "big": "Every line is three words — who, the root, and what — and out prn prints a line.",
   "caption": "Three words go in; the Output panel says hello. Tap Play.",
   "demo": [
    "out · prn · \"Hello, V!\"",
    "English++ → C++",
    "C++ → a real program",
    "Output: Hello, V!"
   ]
  },
  "deep": {
   "more": [
    "Lines run from top to bottom, one after the other, so the order you write them in is the order they happen.",
    "Words in quote marks are text, and the computer prints text exactly as you wrote it — capital letters, spaces and all."
   ],
   "ex": {
    "code": "x is 6\nx add 1\nout prn x",
    "walk": [
     "Line 1: x is 6 — a box called x holds 6.",
     "Line 2: x add 1 — add 1 to x, so it holds 7.",
     "Line 3: out prn x — print it: 7."
    ]
   },
   "mistake": "Writing out prn \"Hello, V! with no closing quote mark. English++ can't tell where the text stops, and the Studio says so."
  }
 },
 {
  "title": "Your First Program",
  "chapter": "English++ Book Ch. 3 · New Project, Run, and note",
  "line": "out prn \"One\"",
  "content": {
   "story": [
    "Open English++ Studio, click New Project, pick Console App, and leave the Form box on English++ — the one that says three words on every line. Give it a name like MyFirstProgram and click Create.",
    "The Studio writes main.epp for you. Press F5 (or the Run button) and look at the Output panel at the bottom: your words are there.",
    "A line that starts with note is for people. The computer skips it, so notes can say anything at all — what the program is for, or something to remember.",
    "Press Ctrl+S to save your program. The Studio also saves it each time you run it, so your work won't get lost.",
    "Saving means your program is kept in its file, so you can close the Studio and come back to it tomorrow."
   ],
   "big": "New Project → Console App → F5; lines run in order, and note lines are for people.",
   "caption": "The lines run from top to bottom; the note is skipped. Tap Play.",
   "demo": [
    "note This program counts to two.",
    "out prn 1",
    "note Now the second one.",
    "out prn 2"
   ]
  },
  "deep": {
   "more": [
    "A program can have as many lines as you like. Each one runs after the one above it, so moving lines around changes what happens first.",
    "Build .exe (Ctrl+Shift+B) turns your program into a Windows program of its own that runs without the Studio.",
    "Ctrl+S saves your work, and the Studio saves it when you run, too."
   ],
   "ex": {
    "code": "note This program counts to two.\nout prn 1\nnote Now the second one.\nout prn 2",
    "walk": [
     "Line 1: a note — skipped.",
     "Line 2: prints 1.",
     "Line 3: a note — skipped.",
     "Line 4: prints 2."
    ]
   },
   "mistake": "Putting the lines in the wrong order. The computer does exactly what the lines say, in exactly the order they're written."
  }
 },
 {
  "title": "The Three Words",
  "chapter": "English++ Book Ch. 4 · who · root · what, now, @ and &",
  "line": [
   "now wfv now",
   "c is a+b"
  ],
  "content": {
   "story": [
    "Every line has three spots. The first is who — the thing the line is about. The middle is the root — what happens. The last is what — the value or thing it uses. A line with more or fewer words is a mistake.",
    "Spaces split a line into words, so math is written with no spaces: c is a+b is three words, but c is a + b is five. Text in quote marks is one word, spaces and all.",
    "When a spot has nothing to say, fill it with now. now wfv now means while forever: it needs no who and no what. Lines moved in by two spaces belong to the line above them, and the block ends where they stop moving in."
   ],
   "big": "Three spots on every line; now fills an empty spot; @ reaches in and & hands values.",
   "caption": "Each line splits into who, the root and what. Tap Play.",
   "demo": [
    "x · is · 6",
    "c · is · a+b",
    "now · wfv · now",
    "out · prn · scores@0"
   ]
  },
  "deep": {
   "more": [
    "English++ has none of C++'s marks: no curly brackets (move lines in instead), no round brackets, no commas (use &), no semicolons and no colons.",
    "Two marks do the work inside a word. @ reaches in — read it as of or at: scores@0, rex@speed. & gives values — read it as with or and: add_up&1&2, 90&72&85."
   ],
   "ex": {
    "code": "n is 0\nnow wfv now\n  n add 1\n  now ebk n==3\nout prn n",
    "walk": [
     "Line 1: n starts at 0.",
     "Line 2: now wfv now — repeat forever the lines moved in under it.",
     "Line 3: add 1 to n each time round.",
     "Line 4: break out of the loop when n is 3.",
     "Line 5: prints 3."
    ]
   },
   "mistake": "Spaces around math marks. c is a + b has five words, and the Studio says: This line has 5 words. Every line has exactly 3."
  }
 },
 {
  "title": "How to Read a Root",
  "chapter": "English++ Book Ch. 5 · 21 families, and jobs",
  "line": [
   "scores lso now",
   "out prn cso&v"
  ],
  "content": {
   "story": [
    "Every root has three letters, and you can read one you have never seen. The first letter is the family: a is arithmetic, c is collection, d is define, f is for, i is if, l is list, m is make, n is number, t is text, w is while — 21 families in all.",
    "The other two letters are the job, and a job means the same thing in every family. so is sort, so lso sorts a list and cso gives a sorted copy. rv is reversed: lrv, crv, trv. mx is the biggest: nmx, cmx.",
    "Six jobs compare two things and you'll use them all the time: eq equal, ne not equal, lt less than, le less or equal, gt greater than, ge greater or equal. ilt is if less than, wgt is while greater than, olt is otherwise if less than."
   ],
   "big": "The first letter of a root is its family and the other two are its job — so you can read words you've never met.",
   "caption": "A family letter and a job snap together into a root. Tap Play.",
   "demo": [
    "l (list) + so (sort) → lso",
    "c (collection) + so → cso",
    "i (if) + gt → igt",
    "w (while) + gt → wgt"
   ]
  },
  "deep": {
   "more": [
    "There is no j, q, v, y or z family. You don't need them.",
    "The chart is frozen: a root never changes what it means, so what you learn stays true. New roots may be added, but old ones never change."
   ],
   "ex": {
    "code": "scores is 3&1&2\ntidy is cso&scores\nout prn tidy\nout prn scores\nscores lso now\nout prn scores",
    "walk": [
     "Line 1: a list of three numbers.",
     "Lines 2–3: cso — collection, sort — gives a sorted copy: [1, 2, 3].",
     "Line 4: the list itself is unchanged: [3, 1, 2].",
     "Lines 5–6: lso — list, sort — sorts the list itself: [1, 2, 3]."
    ]
   },
   "mistake": "Mixing up the c and l families. c roots ask about a collection and leave it alone; l roots change it."
  }
 },
 {
  "title": "Names and Values",
  "chapter": "English++ Book Ch. 6 · is, mak, mkn and the kinds",
  "line": [
   "score is 7",
   "score mak num"
  ],
  "content": {
   "story": [
    "A name is a box with a label. is puts a value in it: age is 7. English++ works out the kind from the value — 7 is a whole number, 2.5 is a decimal, \"Ada\" is a text, 'A' is a letter, yes is a yes or no.",
    "mak makes an empty box of a kind you choose: score mak num makes a whole number that starts at 0. The kinds have short names: num, big, sml, pos, byt, dec, flo, txt, ltr and yno.",
    "A box keeps its kind. Put 6.0 in a box that holds a decimal and it stays a decimal. mkn makes a constant — LIMIT mkn 100 — and a constant can never change."
   ],
   "big": "is gives a name a value, mak makes an empty box of a kind, and mkn makes one that never changes.",
   "caption": "Five boxes, five kinds: a number, a decimal, a text, a letter and a yes or no. Tap Play.",
   "demo": [
    "age is 7",
    "price is 2.5",
    "name is \"Ada\"",
    "first is 'A'",
    "ready is yes"
   ]
  },
  "deep": {
   "more": [
    "Names can be as long as you like: letters, digits and _, starting with a letter. score_total is one name.",
    "num&, dec&, txt&, ltr& and yno& turn a value into another kind: num&2.9 is 2, txt&42 is the text 42, and yno&0 is nay."
   ],
   "ex": {
    "code": "age is 7\nprice is 2.5\nname is \"Ada\"\nfirst is 'A'\nready is yes\nout prn age\nout prn price\nout prn name\nout prn first\nout prn ready",
    "walk": [
     "Lines 1–5: five boxes of five kinds.",
     "Lines 6–10: print each one: 7, 2.5, Ada, A and yes."
    ]
   },
   "mistake": "Changing a constant. LIMIT mkn 100 and later LIMIT add 1 stops the Studio: a constant can never change."
  }
 },
 {
  "title": "Printing",
  "chapter": "English++ Book Ch. 7 · prn, put, @ in text, and &",
  "line": [
   "out prn \"@name is @age years old.\"",
   "out prn name&age"
  ],
  "content": {
   "story": [
    "prn prints and goes to the next line. put prints and stays on the same line, so the next thing printed lands right after it.",
    "@ inside a text swaps a name for its value: \"Hi @name\" prints Hi Ada. It reaches further too: \"The first score is @scores@0.\" To print a real @, write @@.",
    "& joins values, and prn prints them with a space between: out prn name&age prints Ada 36.",
    "Two text words help you line things up. tfx shows a decimal with the number of places you choose: tfx&price&2 shows 2.50, with two places after the point.",
    "tpa pads a text with spaces, so it fills a width: tpa&\"Ada\"&6 makes Ada six letters wide, with spaces after it."
   ],
   "big": "prn prints a line, put stays on it, @name fills in a value, and & prints several values with spaces.",
   "caption": "put keeps the line going; prn finishes it. Tap Play.",
   "demo": [
    "out put \"Score: \"",
    "out prn 1",
    "out prn \"@name is @age years old.\"",
    "out prn name&age"
   ]
  },
  "deep": {
   "more": [
    "Text can hold \\n to start a new line in the middle, so one prn can print two lines.",
    "err prn prints to the error channel instead of the screen's normal output — the place for messages about something going wrong.",
    "tfx picks how many places a decimal shows, and tpa pads a text to a width."
   ],
   "ex": {
    "code": "name is \"Ada\"\nage is 36\nout put \"Name: \"\nout prn name\nout prn \"@name is @age.\"\nout prn name&age&\"years\"\nout prn \"Mail me @@ home.\"\n\nprice is 2.5\nout prn tfx&price&2\nname is tpa&\"Ada\"&6\nout prn \"[@name]\"",
    "walk": [
     "Lines 1–2: two boxes.",
     "Lines 3–4: put and prn share a line: Name: Ada.",
     "Line 5: Ada is 36.",
     "Line 6: three values with spaces: Ada 36 years.",
     "Line 7: @@ prints one @: Mail me @ home.",
     "Line 9: price is 2.5 — a decimal.",
     "Line 10: out prn tfx&price&2 — print it with 2 places after the point: 2.50.",
     "Line 11: name is tpa&\"Ada\"&6 — pad Ada with spaces, so it is 6 letters wide.",
     "Line 12: out prn \"[@name]\" — print it in square brackets, so you can see the spaces: [Ada   ]."
    ]
   },
   "mistake": "Forgetting the space at the end of a put. out put \"Score:\" and then out prn 1 prints Score:1."
  }
 },
 {
  "title": "Math",
  "chapter": "English++ Book Ch. 8 · add asb aml adv amd, + - * / %, n roots",
  "line": [
   "x add 5",
   "total is a+b"
  ],
  "content": {
   "story": [
    "The a family changes a number in place: add, asb (subtract), aml (multiply), adv (divide), amd (remainder) and apw (power). x add 5 adds 5 to x.",
    "Math in one word uses + - * / %, with no spaces. Times and divide come before plus and minus, just like in school, so a+b*2 works out b*2 first.",
    "A whole number divided by a whole number stays whole: 7/2 is 3. Use a decimal, like 7.0/2, to keep the part after the point. The n family works out numbers: nsq&16 is the square root, nmx&a&b the bigger one, nra&1&6 a random number.",
    "There are four ways to turn a decimal into a whole number. nro rounds to the nearest: nro&2.5 is 3. ndn rounds down and nup rounds up: ndn&2.9 is 2, and nup&2.1 is 3. nwh keeps just the whole part: nwh&-2.9 is -2.",
    "nkb keeps a number between two others. nkb&5&0&10 is 5, because 5 is already between 0 and 10. nkb&50&0&10 is 10, and nkb&-2&0&10 is 0. It is great for keeping a player on the screen.",
    "For drawing and moving things there are shape and angle words. Angles are in radians: a half turn is npi radians, about 3.14. ncr&27 is the cube root, 3. nhy&3&4 is the long side of a right triangle, 5. nsn, nco and ntn are sine, cosine and tangent, and nas, nac and nat go the other way. nep is e to a power, nlg the natural log, and nlx the log to base 10.",
    "Inside the computer every whole number is made of bits, tiny on-off switches: 6 is 110 and 3 is 011. and keeps the bits on in both, aor turns on the bits on in either, and axr keeps the bits on in just one. asl pushes the bits left, asr pushes them right, and ant flips every bit."
   ],
   "big": "a roots change a number in place; + - * / % work it out in one word; whole numbers divide to whole numbers.",
   "caption": "x grows and shrinks as each a root changes it. Tap Play.",
   "demo": [
    "x is 10",
    "x add 5 → 15",
    "x asb 3 → 12",
    "x aml 2 → 24",
    "x adv 4 → 6"
   ]
  },
  "deep": {
   "more": [
    "% is the remainder: 17%5 is 2. n%2 is 0 for even numbers and 1 for odd ones.",
    "now rsd 7 sets the seed of the random numbers, so nra gives the same ones every run — handy for testing.",
    "nro rounds, ndn rounds down, nup rounds up, and nwh keeps the whole part.",
    "nkb keeps a number between two others — too big becomes the top, too small becomes the bottom.",
    "npi is pi, ncr is the cube root, nhy is the longest side, and the rest are sines, cosines and logs.",
    "and, aor, axr, asl, asr and ant work on the bits of a number, one switch at a time."
   ],
   "ex": {
    "code": "x is 10\nx add 5\nout prn x\nx asb 3\nout prn x\nx aml 2\nout prn x\nx adv 4\nout prn x\nout prn 7/2\nout prn 7.0/2\nout prn 7%2\n\nout prn nro&2.5\nout prn ndn&2.9\nout prn nup&2.1\nout prn nwh&-2.9\n\nout prn nkb&5&0&10\nout prn nkb&50&0&10\nout prn nkb&-2&0&10\n\nout prn npi\nout prn ncr&27\nout prn nhy&3&4\nout prn nsn&0\nout prn nco&0\nout prn ntn&0\nout prn nas&0\nout prn nac&1\nout prn nat&0\nout prn nep&0\nout prn nlg&1\nout prn nlx&100\n\nx is 6\nx and 3\nout prn x\nx is 6\nx aor 3\nout prn x\nx is 6\nx axr 3\nout prn x\nx is 6\nx asl 2\nout prn x\nx is 6\nx asr 1\nout prn x\nx ant 0\nout prn x",
    "walk": [
     "Lines 1–3: 15.",
     "Lines 4–5: 12.",
     "Lines 6–7: 24.",
     "Lines 8–9: 6.",
     "Line 10: whole numbers: 3.",
     "Line 11: a decimal: 3.5.",
     "Line 12: the remainder of 7 divided by 2: 1.",
     "Line 14: out prn nro&2.5 — round 2.5 to the nearest whole number: 3.",
     "Line 15: out prn ndn&2.9 — round 2.9 down: 2.",
     "Line 16: out prn nup&2.1 — round 2.1 up: 3.",
     "Line 17: out prn nwh&-2.9 — keep the whole part of -2.9: -2.",
     "Line 19: out prn nkb&5&0&10 — 5 is between 0 and 10 already, so it stays 5.",
     "Line 20: out prn nkb&50&0&10 — 50 is too big, so it becomes 10.",
     "Line 21: out prn nkb&-2&0&10 — -2 is too small, so it becomes 0.",
     "Line 23: out prn npi — pi: 3.14159.",
     "Line 24: out prn ncr&27 — the cube root of 27: 3.",
     "Line 25: out prn nhy&3&4 — the longest side of a triangle with sides 3 and 4: 5.",
     "Line 26: out prn nsn&0 — sine of 0: 0.",
     "Line 27: out prn nco&0 — cosine of 0: 1.",
     "Line 28: out prn ntn&0 — tangent of 0: 0.",
     "Line 29: out prn nas&0 — arcsine of 0: 0.",
     "Line 30: out prn nac&1 — arccosine of 1: 0.",
     "Line 31: out prn nat&0 — arctangent of 0: 0.",
     "Line 32: out prn nep&0 — e to the power of 0: 1.",
     "Line 33: out prn nlg&1 — the log of 1: 0.",
     "Line 34: out prn nlx&100 — the log to base 10 of 100: 2.",
     "Line 36: x is 6 — 6 in bits is 110.",
     "Line 37: x and 3 — keep the bits that are on in both 110 and 011: 010, which is 2.",
     "Line 38: out prn x — prints 2.",
     "Line 39: x is 6 — start again at 6.",
     "Line 40: x aor 3 — keep the bits that are on in either: 111, which is 7.",
     "Line 41: out prn x — prints 7.",
     "Line 42: x is 6 — start again at 6.",
     "Line 43: x axr 3 — keep the bits that are on in exactly one: 101, which is 5.",
     "Line 44: out prn x — prints 5.",
     "Line 45: x is 6 — start again at 6.",
     "Line 46: x asl 2 — move the bits two places left: 11000, which is 24.",
     "Line 47: out prn x — prints 24.",
     "Line 48: x is 6 — start again at 6.",
     "Line 49: x asr 1 — move the bits one place right: 11, which is 3.",
     "Line 50: out prn x — prints 3.",
     "Line 51: x ant 0 — flip the bits of 0. Every bit was off, so now every bit is on, which is -1.",
     "Line 52: out prn x — prints -1."
    ]
   },
   "mistake": "Expecting 7/2 to be 3.5. Two whole numbers give a whole answer; write 7.0/2."
  }
 },
 {
  "title": "Text",
  "chapter": "English++ Book Ch. 9 · +, @position, and the t family",
  "line": [
   "whole is first+\" \"+last",
   "out prn tuc&t"
  ],
  "content": {
   "story": [
    "+ joins texts: first+\" \"+last makes Ada Lovelace. The space in the middle sits inside quote marks, so the whole join is still one word.",
    "A text is a row of letters, and @ reaches in by position, from 0: word@0 is the first letter.",
    "The t family works with text: tsz the size, tuc uppercase, tlc lowercase, ths has, tbg begins with, ted ends with, tps the position of, trp replaced, tcu part of, tsp split.",
    "Sometimes you want any text shaped a certain way — any number, say — rather than one exact word. A pattern, also called a regular expression, describes that shape.",
    "tmt asks if a text matches a pattern: tmt&\"a2\"&\"[0-9]+\" is yes, because a2 has a digit in it.",
    "tma finds all the matches: tma&t&\"[0-9]+\" gives [2, 10].",
    "trx replaces by pattern: trx&t&\"[0-9]+\"&\"some\" turns every number into the word some."
   ],
   "big": "+ joins text, @ reaches a letter by position, and t roots ask about or change a text.",
   "caption": "Two names snap together with a space between. Tap Play.",
   "demo": [
    "first is \"Ada\"",
    "last is \"Lovelace\"",
    "whole is first+\" \"+last",
    "Output: Ada Lovelace"
   ]
  },
  "deep": {
   "more": [
    "tps gives -1 when the text isn't there, so tps&t&\"z\" is -1 for a t without a z.",
    "txt&42 turns a number into text so it can be joined with +; tnm&\"42\" turns text back into a number.",
    "tmt tests a pattern, tma finds every match, and trx replaces by pattern."
   ],
   "ex": {
    "code": "t is \"Hello\"\nout prn tsz&t\nout prn t@0\nout prn tuc&t\nout prn ths&t&\"lo\"\nout prn tbg&t&\"He\"\nout prn tps&t&\"l\"\nout prn trp&t&\"l\"&\"L\"\n\nout prn tmt&\"a2\"&\"[0-9]+\"\nout prn tmt&\"ab\"&\"[0-9]+\"\nout prn tmt&\"a2\"&\"^[0-9]+$\"\nt is \"I have 2 cats and 10 fish\"\nout prn tma&t&\"[0-9]+\"\nout prn trx&t&\"[0-9]+\"&\"some\"",
    "walk": [
     "Line 1: t holds the text Hello.",
     "Line 2: tsz counts the letters: 5.",
     "Line 3: the first letter, H.",
     "Line 4: HELLO.",
     "Line 5: yes, it has lo.",
     "Line 6: yes, it begins with He.",
     "Line 7: the first l is at position 2.",
     "Line 8: trp replaces every l with L: HeLLo.",
     "Line 10: out prn tmt&\"a2\"&\"[0-9]+\" — does a2 match the pattern [0-9]+, which means one or more digits? Yes.",
     "Line 11: out prn tmt&\"ab\"&\"[0-9]+\" — ab has no digits, so nay.",
     "Line 12: out prn tmt&\"a2\"&\"^[0-9]+$\" — ^ means the start of the text, and $ means the end. This asks for digits from the start to the end, and a2 doesn't have that, so nay.",
     "Line 13: t is \"I have 2 cats and 10 fish\" — a text with two numbers in it.",
     "Line 14: out prn tma&t&\"[0-9]+\" — find all the numbers: [2, 10].",
     "Line 15: out prn trx&t&\"[0-9]+\"&\"some\" — replace every number with some: I have some cats and some fish."
    ]
   },
   "mistake": "Joining a number to text with +. \"Age: \"+age stops the Studio; write \"Age: \"+txt&age or \"Age: @age\"."
  }
 },
 {
  "title": "Yes, No and Tests",
  "chapter": "English++ Book Ch. 10 · yes, nay, == != < > && || !",
  "line": [
   "old_enough is age>=6",
   "out prn age>5&&tall"
  ],
  "content": {
   "story": [
    "A test gives back a yes or no. age>=6 is yes when age is 6 or more. The marks are == (equal), != (not equal), <, <=, > and >=.",
    "Tests join with && (and: both must be yes) and || (or: one is enough). ! flips a yes or no: !tall is nay when tall is yes.",
    "A yes or no prints as yes or nay. Texts compare too: \"apple\"<\"pear\" is yes, because a comes before p."
   ],
   "big": "Comparisons give yes or nay, and && || ! join and flip them.",
   "caption": "Each test lights up yes or nay. Tap Play.",
   "demo": [
    "age>=6 → yes",
    "age==8 → nay",
    "age>5&&tall → yes",
    "!tall → nay"
   ]
  },
  "deep": {
   "more": [
    "A test can be kept in a box: old_enough is age>=6. Then old_enough can be used anywhere a yes or no goes.",
    "yno&0 is nay and yno&5 is yes: any number but 0 counts as yes."
   ],
   "ex": {
    "code": "age is 7\ntall is yes\nold_enough is age>=6\nout prn old_enough\nout prn age==8\nout prn age>5&&tall\nout prn age>9||tall\nout prn !tall",
    "walk": [
     "Line 4: yes.",
     "Line 5: nay.",
     "Line 6: both are yes: yes.",
     "Line 7: one is yes: yes.",
     "Line 8: nay."
    ]
   },
   "mistake": "Writing = for a test. A test is ==, and = isn't an English++ mark at all."
  }
 },
 {
  "title": "If and Otherwise",
  "chapter": "English++ Book Ch. 11 · i family, o family, oth, bsw",
  "line": [
   "x ilt 3",
   "now oth now"
  ],
  "content": {
   "story": [
    "The i family asks a question: x igt 3 means if x is greater than 3, do the lines moved in under it. ieq, ine, ilt, ile, igt and ige cover every comparison.",
    "The o family is otherwise, and comes right after an if: olt asks a second question only when the first said no. now oth now catches all the other times.",
    "When one value is checked against many, bsw is neater: day bsw now, then a now bcs 6&7 line for each case and now bdf now for the rest.",
    "You can also put a whole test in the first spot and add ieq yes to ask if it passes: x>3&&name==\"Ada\" ieq yes asks whether x is more than 3 and the name is Ada. x%2 ieq 0 asks whether x is even."
   ],
   "big": "i asks, o asks again, oth catches the rest, and bsw picks by value.",
   "caption": "Only one door opens: the first test that says yes. Tap Play.",
   "demo": [
    "x ilt 2 → no",
    "x olt 5 → yes",
    "Output: medium"
   ]
  },
  "deep": {
   "more": [
    "An if and its otherwise lines are one choice: only the first one whose test passes runs.",
    "Lines moved in can hold more ifs. Each level moves in two more spaces.",
    "Put a whole test first and add ieq yes to ask if it passes."
   ],
   "ex": {
    "code": "x is 4\nx ilt 2\n  out prn \"small\"\nx olt 5\n  out prn \"medium\"\nnow oth now\n  out prn \"large\"\nday is 6\nday bsw now\n  now bcs 6&7\n    out prn \"the weekend\"\n  now bcs 1\n    out prn \"Monday\"\n  now bdf now\n    out prn \"a work day\"\n\nx is 6\nname is \"Ada\"\nx>3&&name==\"Ada\" ieq yes\n  out prn \"both\"\nx%2 ieq 0\n  out prn \"even\"",
    "walk": [
     "Lines 1–7: 4 isn't less than 2, but it is less than 5, so: medium.",
     "Lines 8–15: day is 6, which matches the case 6&7: the weekend.",
     "Line 17: x is 6 — a number.",
     "Line 18: name is \"Ada\" — a text.",
     "Line 19: x>3&&name==\"Ada\" ieq yes — is x more than 3 and is the name Ada? Yes, so the next line runs.",
     "Line 20: out prn \"both\" — prints both.",
     "Line 21: x%2 ieq 0 — is x even? 6 divided by 2 leaves 0, so yes.",
     "Line 22: out prn \"even\" — prints even."
    ]
   },
   "mistake": "Putting a line between an if and its otherwise. The otherwise line must come straight after the if block."
  }
 },
 {
  "title": "Loops",
  "chapter": "English++ Book Ch. 12 · f family, w family, wfv, ebk, enx, bdo",
  "line": [
   "i flt 5",
   "d wgt 2"
  ],
  "content": {
   "story": [
    "The f family counts. i flt 3 runs the lines under it with i as 0, 1 and 2. fle includes the limit, and fgt counts down: count is 3, then count fgt 0 goes 3, 2, 1. If the name already has a value, counting starts there.",
    "fea walks through a collection: n fea scores. The w family repeats while a test passes — lives wgt 0 — and now wfv now repeats forever.",
    "now ebk now breaks out of a loop and now enx now skips to the next turn. Either can take a test: now ebk n==3. now bdo now runs its lines once first, and a u line after it says when to stop."
   ],
   "big": "f counts, fea walks, w repeats while, wfv repeats forever — ebk leaves and enx skips.",
   "caption": "The counter moves along; the loop stops at the limit. Tap Play.",
   "demo": [
    "count is 3",
    "count fgt 0",
    "3 · 2 · 1",
    "Blast off!"
   ]
  },
  "deep": {
   "more": [
    "ebk and enx can name a loop: a ebk now leaves the loop counting with a, even from inside another loop.",
    "A do block always runs at least once: now bdo now, the lines, then n uge 6 — until n is 6 or more."
   ],
   "ex": {
    "code": "count is 3\ncount fgt 0\n  out prn count\nout prn \"Blast off!\"\ntotal is 0\nnums is 4&5&6\nn fea nums\n  total add n\nout prn total\ni is 0\ni wlt 10\n  i add 3\nout prn i",
    "walk": [
     "Lines 1–4: 3, 2, 1, then Blast off!.",
     "Lines 5–9: walk 4, 5 and 6, adding each to total: 15.",
     "Lines 10–13: add 3 while i is below 10 — 3, 6, 9, 12 — then print 12."
    ]
   },
   "mistake": "A while loop where nothing changes. lives wgt 0 with no lives asb 1 inside runs forever."
  }
 },
 {
  "title": "More Ways With Text",
  "chapter": "English++ Book Ch. 13 · tre, tct, tdg, tlr, tws, tfa, ttp",
  "line": [
   "out prn tre&\"ha\"&3",
   "out prn tfa&\"{} has {} points\"&name&score"
  ],
  "content": {
   "story": [
    "Text can do a few more tricks, all in the t family. They give you an answer and leave your text alone. tre repeats a text: tre&\"ha\"&3 is hahaha. tct counts how many times a small piece is in a bigger text.",
    "Three words ask about one letter: tlr asks if it's a letter, tdg if it's a digit, and tws if it's white space, like a space. Walk through a text with fea and you can sort out its letters.",
    "tfa fills in a pattern. Each {} is a hole, and the values go in, in order: tfa&\"{} has {} points\"&name&score. A hole can say how it wants its value to look: {:.2f} keeps two places after the point, and {:>5} lines it up on the right in five spaces. ttp tells you what kind a thing is, as text."
   ],
   "big": "tre repeats, tct counts, tdg tlr tws ask about a letter, tfa fills in a pattern, and ttp names a kind.",
   "caption": "The holes in a pattern fill up with values. Tap Play.",
   "demo": [
    "tre&\"ha\"&3 → hahaha",
    "tct&\"la la la\"&\"la\" → 3",
    "tfa&\"{} has {} points\"&\"Ada\"&9",
    "→ Ada has 9 points"
   ]
  },
  "deep": {
   "more": [
    "tfa uses the same pattern language as C++'s std::format, so a pattern you learn here works in C++ too.",
    "ttp&5 is num and ttp&\"hi\" is txt — handy when a function takes any kind and you want to know which one it got."
   ],
   "ex": {
    "code": "out prn tre&\"ha\"&3\nsong is \"la la la\"\nout prn tct&song&\"la\"\ns is \"Room 12\"\ndigits is 0\nc fea s\n  tdg&c ieq yes\n    digits add 1\nout prn digits\nname is \"Ada\"\nscore is 9\nout prn tfa&\"{} has {} points\"&name&score\nout prn tfa&\"[{:>5}]\"&42\nout prn ttp&score",
    "walk": [
     "Line 1: prints hahaha.",
     "Lines 2–3: la is in the song 3 times, so it prints 3.",
     "Lines 4–9: walk through Room 12 and count the digits: prints 2.",
     "Lines 10–12: prints Ada has 9 points.",
     "Line 13: 42 gets room for five, pushed right: prints [   42].",
     "Line 14: score holds a number, so ttp prints num."
    ]
   },
   "mistake": "Giving tfa fewer values than holes. Every {} needs a value to put in it."
  }
 },
 {
  "title": "Talking With Your Program",
  "chapter": "English++ Book Ch. 14 · get",
  "line": [
   "name get \"Name? \"",
   "guess mak num"
  ],
  "content": {
   "story": [
    "get shows a question, waits for the person to type an answer and press Enter, and keeps it in the name in the first spot: name get \"Name? \".",
    "The box's kind says what to get. Make it first — age mak num — and get wants a number. A text box takes anything.",
    "Put a space at the end of the question, so the answer doesn't touch it.",
    "Getting a whole line",
    "get reads one word. So if you ask for a name and somebody types Ada Lovelace, you only get Ada.",
    "gln means get a line. It reads the whole line, spaces and all.",
    "story gln \"Tell me something: \" reads a whole sentence into story.",
    "Reading until there's no more",
    "wln means while there are lines. It repeats once for every line it can read.",
    "This is how you read lots of input.",
    "In the Studio, the keyboard never runs out, so press Shift+F5 to stop this program. This matters most with files, as you'll see in the chapter called Files.",
    "A small conversation",
    "Here's all of that working together: ask a name, ask an age, and answer in a way that fits.",
    "If the age is less than 13, the program says you're still a kid. Otherwise it works out how many years ago you stopped being one."
   ],
   "big": "get asks, waits, and keeps the answer — of the kind the box already holds.",
   "caption": "The program asks, and the answer lands in the box. Tap Play.",
   "demo": [
    "name get \"Name? \"",
    "Name? Sam",
    "out prn \"Hi @name!\"",
    "Hi Sam!"
   ]
  },
  "deep": {
   "more": [
    "A yes or no box takes yes or nay. Anything else, and the Studio asks again.",
    "wln reads lines one at a time until there are no more: line wln inp.",
    "gln reads a whole line, spaces and all — get reads one word only.",
    "wln repeats once for every line there is to read.",
    "Ask, read, choose, and answer — a whole conversation in a few lines."
   ],
   "ex": {
    "answers": [
     "I like cats a lot",
     "Ada",
     "36"
    ],
    "code": "story gln \"Tell me something: \"\nout prn \"You said: @story\"\nname get \"What is your name? \"\nage mak num\nage get \"How old are you? \"\nage ilt 13\n  out prn \"Hi, @name! You're still a kid.\"\nnow oth now\n  years is age-13\n  out prn \"Hi, @name! You stopped being a kid @years years ago.\"",
    "walk": [
     "Line 1: gln asks Tell me something: and reads the whole line typed, spaces and all: I like cats a lot.",
     "Line 2: prints You said: I like cats a lot",
     "Line 3: asks What is your name? and Ada is typed, so name holds Ada.",
     "Line 4: make age as a number box first.",
     "Line 5: asks How old are you? and 36 is typed, kept as a number.",
     "Line 6: is 36 less than 13? No, so line 7 is skipped.",
     "Line 8: otherwise, run the lines moved in below.",
     "Line 9: years is 36-13, which is 23.",
     "Line 10: prints Hi, Ada! You stopped being a kid 23 years ago."
    ]
   },
   "mistake": "Getting a number into a text box. \"9\"+1 isn't 10; make the box with mak num first."
  }
 },
 {
  "title": "Watching Your Program Run",
  "chapter": "English++ Book Ch. 15 · Watching Your Program Run",
  "line": "total add i+1",
  "content": {
   "story": [
    "Sometimes your program runs but does the wrong thing.",
    "Here is a program that should add up 1, 2, 3, 4 and 5. The answer should be 15. But it prints 10.",
    "The mistake is hard to see: i flt 5 counts 0, 1, 2, 3, 4 — it never reaches 5. So the program adds 0+1+2+3+4, which is 10.",
    "Instead of staring at it, you can watch the program run. The Studio has a debugger for that."
   ],
   "big": "The debugger lets you watch your program run, one line at a time.",
   "caption": "Follow the numbers as your program runs — the debugger shows you every value.",
   "demo": [
    "total is 0",
    "i flt 5",
    "total add i",
    "out prn total",
    "→ 10 — not 15!",
    "total add i+1",
    "→ 15"
   ]
  },
  "deep": {
   "more": [
    "Press F9 on a line to put a red dot there — that's a breakpoint. The program stops there each time it reaches the line.",
    "Press F6 to start. The program stops at the first breakpoint. The line it is on lights up, and a bar at the bottom shows the names and the values.",
    "F10 runs one line, so you can see the values change. When a value changes, it shows in bold.",
    "F11 steps into a function, and Shift+F11 runs the rest of the function. The call stack shows how you got there.",
    "Press Ctrl+F5 to run with no build, using the Reader. It is much slower, but fine for a small program."
   ],
   "ex": {
    "code": "total is 0\ni flt 5\n  total add i\nout prn total",
    "walk": [
     "Line 1: total is 0 — start with nothing in total.",
     "Line 2: i flt 5 — count from 0 up to 4. The loop never reaches 5.",
     "Line 3: total add i — add i to the total.",
     "Line 4: out prn total — prints 10, not 15. Put a breakpoint on line 3, and the Debug panel shows total going 0, 1, 3, 6, 10. That's how you see that 5 is never added."
    ]
   },
   "mistake": "Don't guess at a wrong answer. Set a breakpoint, watch the values change, and the bug will show itself."
  }
 },
 {
  "title": "Project: Guess the Number",
  "chapter": "English++ Book Ch. 16 · a whole game, step by step",
  "line": [
   "secret is nra&1&100",
   "guess ilt secret"
  ],
  "content": {
   "story": [
    "The computer picks a secret number and you try to guess it. Build it a step at a time, and run it after every step.",
    "Pick the number with nra&1&100. Make the guess box with guess mak num so get knows it wants a number. Then three things can happen: too low (ilt), too high (ogt) or right (oth).",
    "Keep asking with now wfv now, leave with now ebk now when the guess is right, and count the tries with tries add 1. When testing, set secret to 42 so it doesn't change every run."
   ],
   "big": "A real game from a loop, an if, an otherwise and a counter.",
   "caption": "Too high, too low, right! — in three tries. Tap Play.",
   "demo": [
    "Your guess? 50 · Too high",
    "Your guess? 25 · Too low",
    "Your guess? 42",
    "Right, in 3 tries!"
   ]
  },
  "deep": {
   "more": [
    "now rsd 3 makes the random numbers the same every run, so you can test the real game. Take it out to play for real.",
    "A good next step: tell the player how far off they are, or stop after ten tries."
   ],
   "ex": {
    "answers": [
     "50",
     "25",
     "42"
    ],
    "code": "secret is 42\ntries is 0\nguess mak num\nnow wfv now\n  guess get \"Your guess? \"\n  tries add 1\n  guess ilt secret\n    out prn \"Too low\"\n  guess ogt secret\n    out prn \"Too high\"\n  now oth now\n    out prn \"Right, in @tries tries!\"\n    now ebk now",
    "walk": [
     "Lines 1–3: the secret, a counter, and a number box.",
     "Lines 4–6: ask, and count each try.",
     "Lines 7–13: too low, too high, or right — and then leave the loop.",
     "With 50, 25 and 42: Too high, Too low, Right, in 3 tries!"
    ]
   },
   "mistake": "Making the guess box inside the loop. Make it once, before the loop starts."
  }
 },
 {
  "title": "Lists",
  "chapter": "English++ Book Ch. 17 · 1&2&3, vec@num, @position, l family",
  "line": [
   "scores is 90&72&85",
   "v add 4"
  ],
  "content": {
   "story": [
    "A list keeps many values in order. scores is 90&72&85 makes one, and it prints as [90, 72, 85]. An empty one is made with scores mak vec@num — a vector of numbers.",
    "@ reaches an item by position, from 0: scores@0 is the first. Put a position in the who spot to change one: scores@1 is 75. A position past the end stops the program with a plain message on that line.",
    "add puts an item on the end. The l family changes a list: lin inserts, lrm removes a value, ldx removes a position, lpl pops the last, lso sorts and lrv reverses.",
    "Changing a list",
    "Four more l words change a list.",
    "lsu shuffles a list, like a deck of cards: cards lsu now mixes the cards up, so what it prints is different each time.",
    "lfl fills every spot with one value: v lfl 7 makes every item 7.",
    "luq drops the repeats: after v luq now, each value is in there only once.",
    "lrs changes how many spots a list has: v lrs 5 makes it 5 long, and the new spots start at 0."
   ],
   "big": "A list holds values in order; @ reaches by position from 0; add grows it and l roots change it.",
   "caption": "Items slide into numbered slots, starting at 0. Tap Play.",
   "demo": [
    "v is 5&3&9",
    "v add 4 → [5, 3, 9, 4]",
    "v lin 0&8 → [8, 5, 3, 9, 4]",
    "v lrm 3 → [8, 5, 9, 4]"
   ]
  },
  "deep": {
   "more": [
    "fea walks a list item by item, and changing the item inside the walk changes the list: s fea scores, then s aml 10.",
    "cct&scores is how many items a list has, so i flt cct&scores walks every position.",
    "lsu shuffles, lfl fills, luq drops repeats, and lrs changes the size."
   ],
   "ex": {
    "code": "v is 5&3&9\nv add 4\nout prn v\nv lin 0&8\nout prn v\nv lrm 3\nout prn v\nv ldx 0\nout prn v\nv lpl now\nout prn v\n\nv is 1&2&3\nv lfl 7\nout prn v\nv lrs 5\nout prn v\nv lrs 2\nout prn v",
    "walk": [
     "Lines 1–3: 4 goes on the end: [5, 3, 9, 4].",
     "Lines 4–5: 8 goes in at 0: [8, 5, 3, 9, 4].",
     "Lines 6–7: the 3 is removed: [8, 5, 9, 4].",
     "Lines 8–9: position 0 is removed: [5, 9, 4].",
     "Lines 10–11: the last is popped: [5, 9].",
     "Line 13: v is 1&2&3 — v now holds a new list of three numbers.",
     "Line 14: v lfl 7 — fill every spot with 7.",
     "Line 15: out prn v — prints [7, 7, 7].",
     "Line 16: v lrs 5 — make it 5 long. The new spots start at 0.",
     "Line 17: out prn v — prints [7, 7, 7, 0, 0].",
     "Line 18: v lrs 2 — make it 2 long.",
     "Line 19: out prn v — prints [7, 7]."
    ]
   },
   "mistake": "Counting positions from 1. In a list of three, the last one is @2, and @3 stops the program."
  }
 },
 {
  "title": "Asking a List",
  "chapter": "English++ Book Ch. 18 · cct csm cmx cmn cav chs cps cso",
  "line": [
   "out prn cct&scores",
   "out prn cmx&v"
  ],
  "content": {
   "story": [
    "The c family asks a collection a question and leaves it as it was. cct is how many, csm the sum, cmx the biggest, cmn the smallest and cav the average.",
    "chs asks if a value is there (yes or nay), chm how many times, and cps where — -1 when it isn't there. cfr and cla are the first and the last.",
    "cso gives a sorted copy and crv a reversed one, while the list itself stays put. ctx joins the items into one text, with the text you give between them.",
    "More answers from a list",
    "Four more c words ask a list things.",
    "cpd multiplies every item together: cpd&v is 48 for 2, 4 and 6.",
    "cme is the middle value when the list is in order, and cde is how spread out the numbers are.",
    "cra picks one at random — perfect for games. Each time you run it, it may pick a different one."
   ],
   "big": "c roots ask a list how many, how much, which and where — and never change it.",
   "caption": "The list answers questions, and stays just as it was. Tap Play.",
   "demo": [
    "cct&v → 4",
    "csm&v → 25",
    "cmx&v → 9",
    "chs&v&7 → nay"
   ]
  },
  "deep": {
   "more": [
    "The average is a decimal even for whole numbers: cav of 1 and 2 is 1.5.",
    "ctx&names&\", \" makes Ada, Bob, Cy — the text in the last spot goes between the items, not after the last one.",
    "cpd multiplies, cme is the middle, cde is the spread, and cra picks one at random."
   ],
   "ex": {
    "code": "v is 5&9&2&9\nout prn cct&v\nout prn csm&v\nout prn cmx&v\nout prn cmn&v\nout prn chm&v&9\nout prn cps&v&9\nout prn cso&v\nout prn v\nnames is \"Ada\"&\"Bob\"&\"Cy\"\nout prn ctx&names&\", \"\n\nv is 2&4&9\nout prn cav&v\nout prn cme&v\nw is 2&4&6\nout prn cde&w",
    "walk": [
     "Lines 2–5: 4 items, a sum of 25, 9 at the most and 2 at the least.",
     "Line 6: 9 is there twice: 2.",
     "Line 7: the first 9 is at position 1.",
     "Line 8: a sorted copy: [2, 5, 9, 9].",
     "Line 9: the list is unchanged: [5, 9, 2, 9].",
     "Lines 10–11: Ada, Bob, Cy.",
     "Line 13: v is 2&4&9 — a list of three numbers.",
     "Line 14: out prn cav&v — the average: 5.",
     "Line 15: out prn cme&v — the middle value: 4.",
     "Line 16: w is 2&4&6 — another list.",
     "Line 17: out prn cde&w — how spread out the numbers are: 1.63299."
    ]
   },
   "mistake": "Expecting cso to sort the list itself. cso gives a copy; use scores lso now to sort the list."
  }
 },
 {
  "title": "Maps",
  "chapter": "English++ Book Ch. 19 · map@txt@num, @key, k&v fea",
  "line": [
   "ages mak map@txt@num",
   "ages@\"Ada\" is 36"
  ],
  "content": {
   "story": [
    "A map finds a value by its key, like a dictionary finds a meaning by its word. ages mak map@txt@num makes a map from texts to numbers.",
    "@ with a key reaches in: ages@\"Ada\" is 36 files 36 under Ada, and ages@\"Ada\" reads it back. A map prints in key order: {Ada: 36, Bob: 41}.",
    "Reading a key that isn't there adds it, with 0 — which makes counting easy: counts@word add 1. Ask first with chs&ages&\"Zed\" when you don't want that.",
    "Taking one out",
    "lrm removes a key from a map.",
    "ages lrm \"Ada\" takes Ada out of the map, and cct counts the keys that are left.",
    "lwp wipes them all: after ages lwp now, the map is empty.",
    "A faster map",
    "hsh is another kind of map, called a hash map.",
    "It is usually faster when it gets big. But it keeps its keys in no special order.",
    "So use map, unless your program is too slow. Everything else works the same: you put things in with @, and ask with chs."
   ],
   "big": "A map keeps values under keys, in key order; @key reads or writes, and a missing key is added.",
   "caption": "Each name opens its own drawer. Tap Play.",
   "demo": [
    "ages@\"Ada\" is 36",
    "ages@\"Bob\" is 41",
    "ages → {Ada: 36, Bob: 41}",
    "ages@\"Ada\" → 36"
   ]
  },
  "deep": {
   "more": [
    "Walking a map names both parts: k&v fea ages gives each key and its value, in key order.",
    "cct&ages is how many keys there are, and ages lwp now wipes them all.",
    "lrm takes one key out of a map, and lwp wipes them all.",
    "hsh is a faster map that keeps its keys in no special order."
   ],
   "ex": {
    "code": "counts mak map@txt@num\ntext is \"the cat and the dog and the fish\"\nword fea twd&text\n  counts@word add 1\nout prn counts\nk&n fea counts\n  n igt 1\n    out prn \"@k: @n\"\n\nages is map&\"Ada\"&36\nages add \"Bob\"&41\nages lrm \"Ada\"\nout prn ages\nout prn cct&ages\nages lwp now\nout prn ages\n\nfast mak hsh@txt@num\nfast@\"Ada\" is 36\nout prn fast@\"Ada\"\nout prn chs&fast&\"Ada\"",
    "walk": [
     "Lines 1–2: an empty map and a text.",
     "Lines 3–4: twd splits the text into words; each one adds 1 to its own count.",
     "Line 5: prints {and: 2, cat: 1, dog: 1, fish: 1, the: 3}.",
     "Lines 6–8: walk every word k and its count n, and print the ones seen more than once: and: 2, then the: 3.",
     "Line 10: ages is map&\"Ada\"&36 — a map with Ada in it.",
     "Line 11: ages add \"Bob\"&41 — add Bob.",
     "Line 12: ages lrm \"Ada\" — take Ada out.",
     "Line 13: out prn ages — prints {Bob: 41}.",
     "Line 14: out prn cct&ages — how many keys are left? 1.",
     "Line 15: ages lwp now — wipe them all.",
     "Line 16: out prn ages — prints {}.",
     "Line 18: fast mak hsh@txt@num — make a hash map from texts to numbers.",
     "Line 19: fast@\"Ada\" is 36 — put Ada in.",
     "Line 20: out prn fast@\"Ada\" — prints 36.",
     "Line 21: out prn chs&fast&\"Ada\" — is Ada in there? Prints yes."
    ]
   },
   "mistake": "Reading a key to check for it. ages@\"Zed\" adds Zed with 0; ask chs&ages&\"Zed\" instead."
  }
 },
 {
  "title": "Other Collections",
  "chapter": "English++ Book Ch. 20 · set, bag, lst, stk, que, hep",
  "line": [
   "seen mak set@txt",
   "plates mak stk@num"
  ],
  "content": {
   "story": [
    "A set keeps each thing once, in order: add cat twice and it still holds one. It prints with curly marks: {cat, dog}. A bag is a set that keeps no order and is quick to ask.",
    "A stack is a pile of plates: the last one on is the first one off. A queue is a line at a shop: first in, first served. hep is a priority queue that always gives the biggest first.",
    "lst is a linked list, handy for adding and taking at both ends: lpf pops the first and lpl the last.",
    "Array: a size that never changes",
    "An arr holds a set number of things, and that number never changes.",
    "You put its kind first, and then its size: arr@num@7 is an array of 7 numbers.",
    "It starts filled with zeros. days@0 is 5 puts 5 in the first spot.",
    "Pair: two things",
    "A par holds two things. You reach them with first and second.",
    "par& makes one: par&3&4 is a pair of 3 and 4.",
    "You can also make one with mak and set its parts: named@first is \"Ada\" and named@second is 36.",
    "Tuple: a few things",
    "A tup holds as many things as you like, of any kinds.",
    "To open one up, give each part a name, joined with &: name&age&ok is person.",
    "You'll see this again soon, when a function gives back two answers at once.",
    "Maybe: a value that may not be there",
    "Sometimes there's no answer. If you search for a word and it isn't there, what do you give back?",
    "An opt can hold a value, or it can hold nothing at all. nil means nothing.",
    "found@value gives you the value, and found@value_or&0 gives you 0 when there is nothing there.",
    "opt& makes one straight away: x is opt&7.",
    "One of several kinds",
    "An alt holds one value, which can be any of the kinds you list.",
    "thing mak alt@num@txt is a thing that can be a number or a text.",
    "thing@txt says the text in thing. If it holds a number at the time, your program stops and says so.",
    "Adding at both ends",
    "A normal list is slow at adding to its front. Everything has to shuffle along to make room.",
    "A dqu is quick at both ends. lin puts a value at a position: line lin 0&1 puts 1 at the front.",
    "lpf pops the first one. A lst is the same idea, but you can't reach a position in it with @ — you have to walk through it."
   ],
   "big": "Pick the collection that matches the job: set for once each, stk for a pile, que for a line.",
   "caption": "cat is added twice, but the set keeps one. Tap Play.",
   "demo": [
    "seen add \"cat\"",
    "seen add \"dog\"",
    "seen add \"cat\"",
    "seen → {cat, dog}"
   ]
  },
  "deep": {
   "more": [
    "chs works on a set or a bag, and there it's the fastest way to ask: have I seen this before?",
    "Sets and lists walk the same way: x fea seen. A stack or a queue doesn't — you only see its next thing, with @top or @front, and take it with lpl.",
    "An arr has a size that never changes, and starts filled with zeros.",
    "A par holds two things, reached with @first and @second.",
    "A tup holds a few things of any kinds, and you open it with names joined by &.",
    "An opt holds a value or nothing at all — nil means nothing.",
    "An alt holds one value that can be any of the kinds you list.",
    "A dqu is quick at both ends, and lin puts a value at a position."
   ],
   "ex": {
    "code": "seen mak set@txt\nseen add \"cat\"\nseen add \"dog\"\nseen add \"cat\"\nout prn seen\nout prn cct&seen\nout prn chs&seen&\"dog\"\nseen lrm \"cat\"\nout prn seen\n\ndays mak arr@num@7\ndays@0 is 5\nout prn days\nout prn cct&days\n\nspot is par&3&4\nout prn spot\nout prn spot@first\nout prn spot@second\nnamed mak par@txt@num\nnamed@first is \"Ada\"\nnamed@second is 36\nout prn named\n\nperson is tup&\"Ada\"&36&yes\nname&age&ok is person\nout prn name\nout prn age\nout prn ok\n\nfound mak opt@num\nfound ieq nil\n  out prn \"nothing yet\"\nout prn found@value_or&0\nfound is 7\nfound ine nil\n  out prn found@value\n\nthing mak alt@num@txt\nthing is 5\nout prn thing\nthing is \"five\"\nout prn thing\nout prn thing@txt\n\nline mak dqu@num\nline add 2\nline add 3\nline lin 0&1\nout prn line\nline lpf now\nout prn line\nout prn line@0",
    "walk": [
     "Lines 1–5: the second cat isn't kept: {cat, dog}.",
     "Line 6: 2.",
     "Line 7: yes.",
     "Lines 8–9: {dog}.",
     "Line 11: days mak arr@num@7 — make an array of 7 numbers.",
     "Line 12: days@0 is 5 — put 5 in the first spot.",
     "Line 13: out prn days — prints [5, 0, 0, 0, 0, 0, 0].",
     "Line 14: out prn cct&days — how many spots? 7.",
     "Line 16: spot is par&3&4 — make a pair of 3 and 4.",
     "Line 17: out prn spot — prints (3, 4).",
     "Line 18: out prn spot@first — prints 3.",
     "Line 19: out prn spot@second — prints 4.",
     "Line 20: named mak par@txt@num — make a pair of a text and a number.",
     "Line 21: named@first is \"Ada\" — put Ada in the first spot.",
     "Line 22: named@second is 36 — put 36 in the second spot.",
     "Line 23: out prn named — prints (Ada, 36).",
     "Line 25: person is tup&\"Ada\"&36&yes — make a tuple of a text, a number, and a yes or no.",
     "Line 26: name&age&ok is person — open it up into three names.",
     "Line 27: out prn name — prints Ada.",
     "Line 28: out prn age — prints 36.",
     "Line 29: out prn ok — prints yes.",
     "Line 31: found mak opt@num — make a maybe-number. It starts with nothing in it.",
     "Line 32: found ieq nil — is it nothing? Yes, so the next line runs.",
     "Line 33: out prn \"nothing yet\" — prints nothing yet.",
     "Line 34: out prn found@value_or&0 — print the value, or 0 if there is none: 0.",
     "Line 35: found is 7 — now it holds 7.",
     "Line 36: found ine nil — is it not nothing? Yes.",
     "Line 37: out prn found@value — prints 7.",
     "Line 39: thing mak alt@num@txt — make a thing that can be a number or a text.",
     "Line 40: thing is 5 — put 5 in it.",
     "Line 41: out prn thing — prints 5.",
     "Line 42: thing is \"five\" — now put five in it, as a text.",
     "Line 43: out prn thing — prints five.",
     "Line 44: out prn thing@txt — say the text in thing: five.",
     "Line 46: line mak dqu@num — make a deque of numbers.",
     "Line 47: line add 2 — add 2.",
     "Line 48: line add 3 — add 3.",
     "Line 49: line lin 0&1 — put 1 at position 0, at the front.",
     "Line 50: out prn line — prints [1, 2, 3].",
     "Line 51: line lpf now — pop the first one off.",
     "Line 52: out prn line — prints [2, 3].",
     "Line 53: out prn line@0 — the first one now is 2."
    ]
   },
   "mistake": "Using a list when each thing should be there once. A set does the checking for you."
  }
 },
 {
  "title": "Functions",
  "chapter": "English++ Book Ch. 21 · dfn, dpm, ert, f&1&2, now f",
  "line": [
   "add_up dfn num",
   "add_up ert a+b"
  ],
  "content": {
   "story": [
    "A function is a little program with a name. add_up dfn num defines one that gives back a whole number. Its dpm lines say what it takes — a dpm num — and ert hands the answer back: add_up ert a+b.",
    "Use it with &: add_up&1&2 is 3, anywhere a value goes. A function that gives back nothing says now in the last spot, and runs on a line of its own: now hello \"Ada\".",
    "A function can be written below the lines that use it. Its boxes are its own: a name inside it is a different box from the same name outside.",
    "Leaving early",
    "ert leaves the function straight away.",
    "In a function that gives back nothing, write ert now.",
    "In check_age, a child under 13 hears \"Too young.\" and the function ends there — it never reaches \"Welcome!\".",
    "Boxes everyone can see",
    "mgl makes a global: one box that every function can see.",
    "Put it at the top level, not inside a function.",
    "score mgl 0 makes a box called score that starts at 0, and score_up adds to it each time it runs.",
    "A second name for a box",
    "mrf gives a box a second name. Both names mean the same box.",
    "also mrf x makes also a second name for x. also add 1 changes x too.",
    "mlo does the same, but the second name can only look: peek mlo x lets you read x through peek, but you can't change it that way.",
    "Two answers at once",
    "A function can give back two things or more. Say so with tup@, then give each answer a name when you use it.",
    "divide dfn tup@num@num gives back two numbers: the whole part and the rest.",
    "q&r is divide&17&5 opens the two answers up into q and r: 3, with 2 left over.",
    "A function that uses itself",
    "A function can run itself. It's called recursion.",
    "It has to have a way to stop, or it would go on forever.",
    "factorial&5 is 5 times factorial&4, which is 4 times factorial&3, and so on down to 1. The answer is 120.",
    "When you get it wrong",
    "The Studio checks every function and every use of it, before anything runs.",
    "Too few values, or too many: out prn add_up&1 gives add_up only one value, but it takes two.",
    "The wrong kind of value: out prn add_up&1&\"two\" hands it text where it wants a number.",
    "Forgetting to give something back: a function that promises a number must end with ert. And your names can't be the same as a root."
   ],
   "big": "dfn names a job, dpm says what it takes, ert gives the answer back, and & runs it.",
   "caption": "1 and 2 go in; add_up hands 3 back. Tap Play.",
   "demo": [
    "add_up&1&2",
    "a is 1 · b is 2",
    "add_up ert a+b",
    "→ 3"
   ]
  },
  "deep": {
   "more": [
    "A parameter can have a starting value instead of a kind — y dpm 1 — so it can be left out when the function is run.",
    "A parameter is a copy. To change the caller's box, take a reference: n dpm ref@num.",
    "ert leaves a function straight away, and in a function that gives nothing back it is ert now.",
    "mgl makes a global box that every function can see.",
    "mrf gives a box a second name, and mlo gives a second name that can only look.",
    "tup@ lets a function give back two answers at once, and & opens them up.",
    "Recursion is a function that runs itself — and it must have a way to stop.",
    "The Studio catches function mistakes before anything runs: wrong count, wrong kind, or a missing answer."
   ],
   "ex": {
    "code": "x is add_up&1&2\ny is add_up&x&10\nout prn y\nnow hello \"Ada\"\n\nadd_up dfn num\n  a dpm num\n  b dpm num\n  add_up ert a+b\n\nhello dfn now\n  who dpm txt\n  out prn \"Hello, @who!\"\n\nnow check_age 5\nnow check_age 20\ncheck_age dfn now\n  age dpm num\n  age ilt 13\n    out prn \"Too young.\"\n    check_age ert now\n  out prn \"Welcome!\"\n\nnow score_up 2\nnow score_up 3\nout prn score\nscore mgl 0\nscore_up dfn now\n  n dpm num\n  score add n\n\nx is 1\nalso mrf x\nalso add 1\nout prn x\npeek mlo x\nx add 1\nout prn peek\n\nq&r is divide&17&5\nout prn \"@q, with @r left over\"\ndivide dfn tup@num@num\n  a dpm num\n  b dpm num\n  whole is a/b\n  rest is a%b\n  divide ert whole&rest\n\nout prn factorial&5\nfactorial dfn num\n  n dpm num\n  n ile 1\n    factorial ert 1\n  smaller is factorial&n-1\n  factorial ert n*smaller",
    "walk": [
     "Line 1: x is 3.",
     "Lines 2–3: y is 13.",
     "Line 4: Hello, Ada!.",
     "Lines 6–9: add_up takes two numbers and gives back their sum.",
     "Lines 11–13: hello takes a text and gives back nothing.",
     "Line 15: now check_age 5 — run check_age with 5.",
     "Line 16: now check_age 20 — run it again with 20.",
     "Line 17: check_age dfn now — define check_age, which gives back nothing.",
     "Line 18: age dpm num — it takes age, a number.",
     "Line 19: age ilt 13 — if age is less than 13...",
     "Line 20: out prn \"Too young.\" — print Too young.",
     "Line 21: check_age ert now — leave the function right here. Welcome! never prints for a 5-year-old.",
     "Line 22: out prn \"Welcome!\" — for 20, the test fails, so this line runs: Welcome!",
     "Line 24: now score_up 2 — add 2 to the score.",
     "Line 25: now score_up 3 — add 3.",
     "Line 26: out prn score — prints 5.",
     "Line 27: score mgl 0 — the global box, starting at 0.",
     "Line 28: score_up dfn now — define score_up.",
     "Line 29: n dpm num — it takes n.",
     "Line 30: score add n — add n to the score.",
     "Line 32: x is 1 — a box called x holds 1.",
     "Line 33: also mrf x — give x a second name, also.",
     "Line 34: also add 1 — add 1 through the second name. x is 2 now, too.",
     "Line 35: out prn x — prints 2.",
     "Line 36: peek mlo x — give x a look-only second name, peek.",
     "Line 37: x add 1 — add 1 to x. Now x is 3.",
     "Line 38: out prn peek — peek can only look, and it sees 3.",
     "Line 40: q&r is divide&17&5 — run divide with 17 and 5, and put the two answers in q and r.",
     "Line 41: out prn \"@q, with @r left over\" — prints 3, with 2 left over.",
     "Line 42: divide dfn tup@num@num — define divide, which gives back two numbers.",
     "Line 43: a dpm num — it takes a.",
     "Line 44: b dpm num — it takes b.",
     "Line 45: whole is a/b — 17 divided by 5 is 3.",
     "Line 46: rest is a%b — the remainder is 2.",
     "Line 47: divide ert whole&rest — give back both.",
     "Line 49: out prn factorial&5 — print factorial of 5: 120.",
     "Line 50: factorial dfn num — define factorial, which gives back a number.",
     "Line 51: n dpm num — it takes n.",
     "Line 52: n ile 1 — if n is 1 or less...",
     "Line 53: factorial ert 1 — give back 1. That's the way out.",
     "Line 54: smaller is factorial&n-1 — work out factorial of one less.",
     "Line 55: factorial ert n*smaller — give back n times that."
    ]
   },
   "mistake": "Forgetting ert. A function that says it gives back a num must reach an ert line, or the Studio stops it."
  }
 },
 {
  "title": "Functions in a Name",
  "chapter": "English++ Book Ch. 22 · dlm, lambdas",
  "line": [
   "twice dlm num",
   "out prn twice&21"
  ],
  "content": {
   "story": [
    "dlm makes a function that lives in a name — a lambda. twice dlm num, with its dpm and ert lines moved in under it, is a function called twice made right there, in the middle of the program.",
    "It's run like any function: twice&21 is 42. Because it's a name, it can be handed to other functions.",
    "cft keeps the items a function says yes to, and cmp runs a function on every item: cft&scores&big, cmp&scores&twice.",
    "The kind of a function",
    "Functions have a kind too. It's fun@.",
    "After it comes the kind it gives back, and then the kinds it takes: fun@num@txt means a function that gives a number and takes a text.",
    "With it, a box can hold a function, or a parameter can take one: say_size mak fun@num@txt holds sizer.",
    "run_twice takes a function as a parameter and runs it twice: once with \"one\" and once with \"three\"."
   ],
   "big": "dlm makes a function in a name, right where you need it.",
   "caption": "21 goes into twice and 42 comes out. Tap Play.",
   "demo": [
    "twice dlm num",
    "  n dpm num",
    "  twice ert n*2",
    "twice&21 → 42"
   ]
  },
  "deep": {
   "more": [
    "A lambda can use the boxes around it. dlv makes one that keeps copies of them, so it still works after they're gone.",
    "A function that gives back yes or no is a test you can name: big dlm yno.",
    "fun@ is the kind of a function — what it gives back, then what it takes."
   ],
   "ex": {
    "code": "twice dlm num\n  n dpm num\n  twice ert n*2\nout prn twice&21\nhalf dlm num\n  n dpm num\n  half ert n/2\nx is twice&5\nout prn half&x\n\nsay_size mak fun@num@txt\nsizer dlm num\n  s dpm txt\n  sizer ert tsz&s\nsay_size is sizer\nout prn say_size&\"hello\"\nout prn run_twice&sizer\nrun_twice dfn num\n  f dpm fun@num@txt\n  a is f&\"one\"\n  b is f&\"three\"\n  run_twice ert a+b",
    "walk": [
     "Lines 1–4: twice&21 is 42.",
     "Lines 5–7: a second lambda, half.",
     "Lines 8–9: twice&5 is 10, and half of that is 5.",
     "Line 11: say_size mak fun@num@txt — make a box that holds a function giving a number and taking a text.",
     "Line 12: sizer dlm num — make a small function called sizer, giving a number.",
     "Line 13: s dpm txt — it takes s, a text.",
     "Line 14: sizer ert tsz&s — give back how many letters s has.",
     "Line 15: say_size is sizer — put sizer in the box.",
     "Line 16: out prn say_size&\"hello\" — run it with hello: 5.",
     "Line 17: out prn run_twice&sizer — hand sizer to run_twice: 8.",
     "Line 18: run_twice dfn num — define run_twice.",
     "Line 19: f dpm fun@num@txt — it takes f, a function.",
     "Line 20: a is f&\"one\" — run f with one: 3.",
     "Line 21: b is f&\"three\" — run f with three: 5.",
     "Line 22: run_twice ert a+b — give back 3+5, which is 8."
    ]
   },
   "mistake": "Running two functions in one word. half&twice&5 hands both twice and 5 to half; a word holds one run, so use two lines."
  }
 },
 {
  "title": "Lists and Functions Together",
  "chapter": "English++ Book Ch. 23 · cea can cnn crl czp cnu ccu crg cbf cgr cjn lrw lss mhp",
  "line": [
   "out prn cea&scores&passed",
   "out prn crl&v&1&times"
  ],
  "content": {
   "story": [
    "Once a function is kept in a name, you can hand it to a list, and the list uses it to answer harder questions. cea asks if each one passes, can if any does, and cnn if none does. crl rolls a list up: it starts with a value and rolls each item into it with your function.",
    "czp zips two lists together, so you get one from each at a time: n&a fea czp&names&ages. cnu numbers each item from 0. cun, cbt and cot give what's in either list, in both, or only in the first. ccu cuts out part of a list, and crg makes one by counting, with a step if you like.",
    "In a sorted list, cbf finds a value by halves, like a word in a dictionary, and cpb says where. cgr groups items by a label your function gives them, and cjn joins a list of lists into one. lrw rotates a list, lss sorts it and keeps ties in their order, and mhp makes a heap with the smallest on top."
   ],
   "big": "Hand a function to a list and it answers: does each pass, does any, what does it roll up to — and lists can be zipped, cut, counted and grouped.",
   "caption": "Each score meets the test, and the list answers. Tap Play.",
   "demo": [
    "passed: n>80",
    "cea&scores&passed → nay",
    "can&scores&passed → yes",
    "crl&2&3&4 from 1 with times → 24"
   ]
  },
  "deep": {
   "more": [
    "The function goes in by its name, with no &: cea&scores&passed. With & after it, passed& would run it instead.",
    "cft keeps the items a function says yes to, and cmp runs a function on every item: both give back a new list."
   ],
   "ex": {
    "code": "scores is 70&85&92\npassed dlm yno\n  n dpm num\n  passed ert n>80\nout prn cea&scores&passed\nout prn can&scores&passed\nout prn cft&scores&passed\nv is 2&3&4\ntimes dlm num\n  a dpm num\n  b dpm num\n  times ert a*b\nout prn crl&v&1&times\nnames is \"Ada\"&\"Bo\"\nages is 10&12\nn&a fea czp&names&ages\n  out prn \"@n is @a\"\nout prn crg&0&10&2\nout prn ccu&v&1&2",
    "walk": [
     "Lines 1–4: a test: is the number above 80?",
     "Lines 5–7: not every score passes (nay), at least one does (yes), and cft keeps the passing ones: [85, 92].",
     "Lines 8–13: start at 1 and multiply by 2, 3 and 4: 24.",
     "Lines 14–17: Ada is 10, then Bo is 12.",
     "Line 18: [0, 2, 4, 6, 8].",
     "Line 19: two items of v from position 1: [3, 4]."
    ]
   },
   "mistake": "Writing cea&scores&passed& with an & after the function. The function goes in by its name alone."
  }
 },
 {
  "title": "More About Functions",
  "chapter": "English++ Book Ch. 24 · any number of values, msv, dlv, dcx, gnr, eyd, bdr",
  "line": [
   "n msv 0",
   "now bdr now"
  ],
  "content": {
   "story": [
    "If a function's last parameter is a list, it takes all the values left over, so you can hand it as many as you like: add_all&1&2&3&4. msv makes a name that stays between calls; it starts only once, on the first call.",
    "A function in a name can see the names around it. dlm uses those names themselves; dlv takes its own copies when it's made, so what it does stays inside it. dcx makes a function C++ can work out while it builds your program.",
    "A generator hands out one value at a time, and only runs as far as you ask: its kind is gnr@num, and eyd hands over a value and waits. bdr is a block that runs when the block around it ends, however it ends — so the cleaning up sits right next to the setting up."
   ],
   "big": "Functions can take any number of values, remember between calls, keep their own copies, hand out values one at a time, and clean up after themselves.",
   "caption": "tick remembers its count between calls. Tap Play.",
   "demo": [
    "tick& → 1",
    "tick& → 2",
    "tick& → 3",
    "n msv 0 starts only once"
   ]
  },
  "deep": {
   "more": [
    "A generator can describe something endless — all the even numbers — because it only runs when a fea asks for one more.",
    "Several bdr blocks run in the opposite order to how they were written: the last one in is the first one out."
   ],
   "ex": {
    "code": "out prn add_all&1&2&3&4\nout prn add_all&5\nout prn tick&\nout prn tick&\nn fea evens&\n  out prn n\n  n igt 4\n    now ebk now\nnow bdr now\n  out prn \"this comes last\"\nout prn \"this comes first\"\n\nadd_all dfn num\n  xs dpm vec@num\n  add_all ert csm&xs\n\ntick dfn num\n  n msv 0\n  n add 1\n  tick ert n\n\nevens dfn gnr@num\n  i is 0\n  now wfv now\n    evens eyd i\n    i add 2",
    "walk": [
     "Lines 1–2: the leftover values make a list: 10, then 5.",
     "Lines 3–4: n stays between calls: 1, then 2.",
     "Lines 5–8: the generator hands out 0, 2, 4, 6, and the walk stops after 6.",
     "Lines 9–11: this comes first, then — as the program ends — this comes last."
    ]
   },
   "mistake": "Expecting a dlv lambda to change the names around it. It changes its own copies; use dlm for that."
  }
 },
 {
  "title": "Checks and Tests",
  "chapter": "English++ Book Ch. 25 · s family, bts",
  "line": [
   "x seq 3",
   "now bts \"adding small numbers\""
  ],
  "content": {
   "story": [
    "The s family is should. x seq 3 means x should equal 3: if it doesn't, the program stops right there and says which line. sne, slt, sle, sgt and sge cover the rest.",
    "A check catches a mistake the moment it happens, instead of three screens later when something prints the wrong thing.",
    "now bts \"adding small numbers\" names a test. The Studio's Run Tests runs every test, and each should line in it must hold."
   ],
   "big": "s lines check that something is true and stop the program on the line where it isn't.",
   "caption": "Each check passes, and the program carries on. Tap Play.",
   "demo": [
    "x is 3",
    "x seq 3 ✓",
    "x sgt 2 ✓",
    "All the checks passed."
   ]
  },
  "deep": {
   "more": [
    "Put checks where a mistake would hurt: before a division, after reading a file, at the start of a function.",
    "Tests live beside the program, and Run Tests reports which ones failed and on which line."
   ],
   "ex": {
    "code": "x is 3\nx seq 3\nx sgt 2\na is 2\na sne 3\na sle 2\nout prn \"All the checks passed.\"",
    "walk": [
     "Lines 1–3: x equals 3 and is greater than 2.",
     "Lines 4–6: a isn't 3, and is 2 or less.",
     "Line 7: All the checks passed."
    ]
   },
   "mistake": "Using a check for something a person types. A check stops the program; ask again with a loop instead."
  }
 },
 {
  "title": "Your Own Kinds of Things",
  "chapter": "English++ Book Ch. 26 · dcl, dfd, dmk, a@age, a bark now",
  "line": [
   "Dog dcl now",
   "age dfd 3"
  ],
  "content": {
   "story": [
    "dcl starts a class: your own kind of thing. Under it, dfd lines say what each one has (fields) and dfn lines say what it can do (methods). rex mak Dog makes one, rex@name reaches a field, and rex bark now runs a method. Printing a thing shows every field: Dog(name: Rex, age: 3).",
    "Each thing made from a class has its own fields, so changing one dog's age leaves the other alone. Inside the class, methods use fields by their plain names.",
    "dmk runs by itself when a thing is made, and its dpm lines take the values handed in: Dog&\"Tom\"&5. dds is the opposite: it runs when the thing goes away at the end of its block. slf means this very thing, so slf@x is the field when a parameter is also called x.",
    "dsc makes a secret field and dhd a hidden method: only the class's own methods can use them, and a secret never prints. dkn makes a method that promises not to change any field, and the Studio holds it to that.",
    "dsh makes one field shared by the whole class, and dsf a function that belongs to the class. Reach both through the class name: Dog@made, Dog@report&. Two things of the same kind compare with ==, which checks every field."
   ],
   "big": "dcl invents a kind; dfd is what it has, dfn what it can do, and dmk what happens when one is made.",
   "caption": "One plan, two dogs, each with its own name. Tap Play.",
   "demo": [
    "a mak Dog",
    "a@name is \"Rex\"",
    "a bark now",
    "Rex says woof!"
   ]
  },
  "deep": {
   "more": [
    "Inside the class, its own fields are plain names: the bark function says @name, and it means this dog's name.",
    "Each thing made from a class has its own fields. Changing a@age doesn't touch b@age.",
    "slf means this very thing — its field, not the parameter with the same name.",
    "dsc makes a secret field and dhd a hidden function — only the class itself can use them.",
    "dkn is a function that promises not to change any field.",
    "dsh is a field shared by the whole class, and dsf is a function shared by the whole class.",
    "dds runs by itself when a thing goes away — the opposite of dmk.",
    "== compares two things of the same kind by checking every field."
   ],
   "ex": {
    "code": "a mak Dog&\"Rex\"\nb mak Dog&\"Tom\"&5\na bark now\nout prn a\nout prn b\nout prn a==b\nacct mak Bank\nacct pay_in 50\nout prn acct@balance\nout prn acct\n\nDog dcl now\n  name dfd txt\n  age dfd 1\n  Dog dmk now\n    n dpm txt\n    y dpm 1\n    name is n\n    age is y\n  bark dfn now\n    out prn \"@name says woof!\"\n\nBank dcl now\n  owner dfd \"Ada\"\n  money dsc 0\n  pay_in dfn now\n    n dpm num\n    n igt 0\n      money add n\n  balance dfn num\n    balance ert money",
    "walk": [
     "Lines 1–2: make two dogs; dmk puts the name in, and Tom also gets age 5 (Rex keeps the starting 1).",
     "Line 3: a barks: Rex says woof!",
     "Lines 4–5: Dog(name: Rex, age: 1) and Dog(name: Tom, age: 5).",
     "Line 6: the fields differ, so a==b prints nay.",
     "Lines 7–8: make an account and pay in 50 through pay_in.",
     "Line 9: balance gives back the secret money: 50.",
     "Line 10: Bank(owner: Ada) — the secret money never prints.",
     "Lines 12–21: the Dog plan: two fields, a maker that takes n and y, and bark.",
     "Lines 23–31: the Bank plan: owner, a secret money field, pay_in (only adds amounts above 0), and balance."
    ]
   },
   "mistake": "Reaching for a field the class doesn't have. a@colour stops the Studio: a Dog has no colour."
  }
 },
 {
  "title": "Children",
  "chapter": "English++ Book Ch. 27 · Dog dcl Animal, dbs, dvr, dov",
  "line": [
   "Dog dcl Animal",
   "now dbs given"
  ],
  "content": {
   "story": [
    "Put a parent's name in the last spot of dcl and the new class is its child: Dog dcl Animal. A Dog has everything an Animal has and can do everything an Animal can, and adds its own.",
    "When a child is made, the parent part is made first. now dbs given hands values up to the parent's maker.",
    "dvr marks a function a child may do its own way, and dov is the child's own version. Each kind of animal can answer sound differently, and the right one is used every time.",
    "Family secrets",
    "A secret field can only be seen by its own class. Not even its children can see it.",
    "dfm makes a family field: its own class and all its children can use it, but nobody else can.",
    "dfy does the same for a function: rest dfy now can be run by the class and its children.",
    "In the example, Dog's report runs rest to add 1 to energy, and gives back 6."
   ],
   "big": "A child class gets everything its parent has; dbs makes the parent part, and dov redoes a job its own way.",
   "caption": "The Animal part is made, then the Dog part. Tap Play.",
   "demo": [
    "d mak Dog&\"Rex\"",
    "An animal is made.",
    "A dog is made.",
    "Dog(name: Rex, tricks: 0)"
   ]
  },
  "deep": {
   "more": [
    "dmb is a job every child must do its own way — the parent only promises it.",
    "A child can have its own children: Puppy dcl Dog gets everything a Dog and an Animal have.",
    "dfm is a family field and dfy a family function — the class and its children can use them, nobody else can."
   ],
   "ex": {
    "code": "d mak Dog&\"Rex\"\nd eat now\nout prn d@report\nout prn d@name\n\nAnimal dcl now\n  name dfd txt\n  energy dfm 5\n  Animal dmk now\n    n dpm txt\n    name is n\n    out prn \"An animal is made.\"\n  eat dfn now\n    out prn \"@name is eating.\"\n  rest dfy now\n    energy add 1\n\nDog dcl Animal\n  tricks dfd 0\n  Dog dmk now\n    given dpm txt\n    now dbs given\n    out prn \"A dog is made.\"\n  report dfn num\n    now rest now\n    report ert energy",
    "walk": [
     "Line 1: make Rex. The Animal part is made first (An animal is made.), then the Dog part (A dog is made.).",
     "Line 2: eat comes from the parent: Rex is eating.",
     "Line 3: report runs the family function rest, so energy goes from 5 to 6, and prints 6.",
     "Line 4: the name came up through dbs: Rex.",
     "Lines 6–16: Animal, the parent: a name, a family field energy, a maker that keeps the name, eat, and a family function rest.",
     "Lines 18–26: Dog, the child: tricks, a maker whose first job is now dbs given, and report, which can use rest and energy because they belong to the family."
    ]
   },
   "mistake": "Forgetting now dbs in a child's maker when the parent's maker needs a value."
  }
 },
 {
  "title": "More Kinds of Your Own",
  "chapter": "English++ Book Ch. 28 · dst, den",
  "line": [
   "Spot dst now",
   "Mood den happy&sad"
  ],
  "content": {
   "story": [
    "dst is a struct: a simple class that just holds values together. Spot dst now with x dfd 0 and y dfd 0 under it is a point on a grid.",
    "A struct is made by handing its fields in order: a is Spot&1&2 sets x to 1 and y to 2. It prints the same way a class does: Spot(x: 1, y: 2).",
    "den makes a kind with a fixed list of choices: Mood den happy&sad&sleepy. A Mood can only ever be one of those.",
    "Unions",
    "You'll almost never need this one.",
    "dun makes a union. It looks like a struct, but all of its fields share the same memory.",
    "So it can only hold one at a time. It saves a tiny bit of memory, and programs that talk directly to hardware sometimes need it.",
    "It doesn't print by itself.",
    "Short names for kinds",
    "dal gives a kind a shorter name. It's the same kind, just easier to read. People call it an alias.",
    "Row dal vec@num says Row means a list of numbers.",
    "Grid dal vec@Row says Grid means a list of Rows — a grid of numbers.",
    "Math with your own kinds",
    "dop says what a math mark does to your own kind. Then you can add two Spots, just as if they were numbers.",
    "You can do this for + - * / % == != < > <= >=.",
    "If you make <, then a list of your things can be sorted: a list of Cards sorts by rank."
   ],
   "big": "dst holds values together; den gives a kind a fixed set of choices.",
   "caption": "Two numbers travel together as one Spot. Tap Play.",
   "demo": [
    "a is Spot&1&2",
    "Spot(x: 1, y: 2)",
    "a@y → 2",
    "a@x is 5"
   ]
  },
  "deep": {
   "more": [
    "A struct is the right choice when a thing is just its values, with no jobs of its own.",
    "bsw works well with a den kind: one case for each choice.",
    "A dun is a union — all its fields share the same memory, so it holds only one at a time.",
    "dal gives a kind a shorter name — an alias.",
    "dop says what a math mark does to your own kind."
   ],
   "ex": {
    "code": "Mood den happy&sad&sleepy\nRow dal vec@num\nGrid dal vec@Row\na is Spot&1&2\nb is Spot&3&4\nout prn a@y\na@x is 5\nout prn a\nc is a+b\nout prn c\nm is Mood@sleepy\nout prn m\ng mak Grid\ng add 1&2\nout prn g\nu mak Both\nu@whole is 65\nout prn u@whole\n\nSpot dst now\n  x dfd 0\n  y dfd 0\n  + dop Spot\n    o dpm see@Spot\n    r is Spot&x+o@x&y+o@y\n    + ert r\n\nBoth dun now\n  whole dfd num\n  part dfd dec",
    "walk": [
     "Line 1: Mood can only be happy, sad or sleepy.",
     "Lines 2–3: Row is a short name for a list of numbers, and Grid for a list of Rows.",
     "Lines 4–6: two Spots; a@y prints 2.",
     "Lines 7–8: change a's x to 5: Spot(x: 5, y: 2).",
     "Lines 9–10: + adds the two x's and the two y's: Spot(x: 8, y: 6).",
     "Lines 11–12: a choice prints by its name: sleepy.",
     "Lines 13–15: a Grid with one Row: [[1, 2]].",
     "Lines 16–18: a union holding 65 in whole: 65.",
     "Lines 20–26: the Spot struct, with + defined by dop.",
     "Lines 28–30: the union Both: whole and part share the same memory."
    ]
   },
   "mistake": "Handing a struct more values than it has fields."
  }
 },
 {
  "title": "Any Kind",
  "chapter": "English++ Book Ch. 29 · any, dtp",
  "line": [
   "x dpm any",
   "T dtp now"
  ],
  "content": {
   "story": [
    "Some jobs work the same for numbers, texts and anything else. x dpm any takes a value of any kind, and C++ works out the kind each time the function is used.",
    "T dtp now makes a kind that gets filled in later — a template. Lines under it can use T as a kind: a box of T, a list of T.",
    "Write the job once, and it works for every kind that can do what the lines ask."
   ],
   "big": "any and dtp let one function or class work for every kind.",
   "caption": "The same function takes a number, then a text. Tap Play.",
   "demo": [
    "now show 5",
    "It is: 5",
    "now show \"five\"",
    "It is: five"
   ]
  },
  "deep": {
   "more": [
    "A kind filled in later still has to make sense: adding two things only works for kinds that can be added.",
    "A class can take a kind too: Box dst now under T dtp now holds a T, whatever T turns out to be."
   ],
   "ex": {
    "code": "now tell 5\nnow tell \"five\"\nnow tell 2.5\n\ntell dfn now\n  x dpm any\n  out prn \"It is: @x\"",
    "walk": [
     "Lines 1–3: It is: 5, It is: five and It is: 2.5.",
     "Lines 5–7: one function, tell, for every kind: x dpm any takes whatever it is given."
    ]
   },
   "mistake": "Asking an any value for something only one kind can do, like tsz on a number."
  }
 },
 {
  "title": "Pointers",
  "chapter": "English++ Book Ch. 30 · mpt, mnw, msh, mwn, edl",
  "line": [
   "p mpt x",
   "p mnw Torch"
  ],
  "content": {
   "story": [
    "A pointer is a box that holds the place of another box. p mpt x makes p point at x, and *p is x itself: change *p and x changes.",
    "p mnw Torch makes a new Torch in memory and points p at it. Something made with mnw stays until now edl p deletes it.",
    "msh and mwn make pointers that tidy up after themselves: a shared one lasts while anyone still points at it, and an owned one belongs to one name. Most programs want those.",
    "Moving a pointer",
    "When you add an own pointer to a list, English++ moves it for you. That's what you saw in the Children chapter.",
    "mmv means move. After that, the old box holds nothing.",
    "mmv works on other things too. Moving a long list is much faster than copying it, because nothing has to be copied.",
    "A pointer to a number",
    "ptr@num means a pointer to a number.",
    "A new pointer starts as nil, so you can test for it: q ieq nil asks if q points at nothing.",
    "If you use a nil pointer, your program stops and tells you where."
   ],
   "big": "A pointer holds the place of a box; msh and mwn tidy up by themselves.",
   "caption": "p points at x; change *p and x changes. Tap Play.",
   "demo": [
    "x is 5",
    "p mpt x",
    "*p is 7",
    "x → 7"
   ]
  },
  "deep": {
   "more": [
    "nil is a pointer that points at nothing. Ask before using one that might be nil.",
    "English++ leaves out moving a pointer with p add 1, a way to go wrong with no message. Use a position in a list instead, which is checked.",
    "mmv moves a thing — after that, the old box holds nothing.",
    "ptr@num is a pointer to a number, and a new pointer starts as nil."
   ],
   "ex": {
    "studio": true,
    "code": "x is 5\np mpt x\nout prn *p\n*p is 7\nout prn x\nt msh Torch\nout prn t@lit\na mwn Torch\na@name is \"big\"\nb mmv a\nout prn b@name\na ieq nil\n  out prn \"a holds nothing now\"\nq mak ptr@num\nq ieq nil\n  out prn \"q points at nothing\"\nq mpt x\nq ine nil\n  out prn *q\n\nTorch dcl now\n  name dfd txt\n  lit dfd yes",
    "walk": [
     "Lines 1–3: p points at x: prints 5.",
     "Lines 4–5: changing *p changes x: 7.",
     "Lines 6–7: a shared Torch: its lit field prints yes.",
     "Lines 8–11: a owns a Torch named big; mmv moves it to b, and b@name prints big.",
     "Lines 12–13: a holds nothing now, so it prints a holds nothing now.",
     "Lines 14–16: a new pointer to a number starts as nil: q points at nothing.",
     "Lines 17–19: point q at x; now it isn't nil, so it prints *q: 7.",
     "Lines 21–23: the Torch class, with a name and a lit field."
    ]
   },
   "mistake": "Using a pointer after edl. The memory is gone; make it with msh and it can't happen."
  }
 },
 {
  "title": "More Tricks for Your Classes",
  "chapter": "English++ Book Ch. 31 · at dop, call dop, += dop, ptr@Dog&p, dbb, tkn",
  "line": [
   "call dop num",
   "ready dbb 1"
  ],
  "content": {
   "story": [
    "Your classes can act like the kinds that come with the language. An operator called at lets one be reached with @, like a list: rows@3. It gives back a reference, so you can change what's there too.",
    "An operator called call lets a thing be called with &: a&3. dop also takes += and the marks like it, and that's what add uses on your own kinds.",
    "ptr@Dog&p asks what a pointer to an Animal really points at: a pointer to the Dog, or nil if it isn't one. dbb makes a field that takes only a few bits. A parameter of kind tkn@Kept says hand me this thing to keep, so a class can say how it's moved."
   ],
   "big": "Operators let your own kinds be reached with @, called with &, and added to with add — just like the built-in ones.",
   "caption": "A thing that remembers 5, called like a function. Tap Play.",
   "demo": [
    "a mak Adder&5",
    "a&3",
    "call ert n+k",
    "→ 8"
   ]
  },
  "deep": {
   "more": [
    "A field made with dbb saves room when there are lots of small things: ready dbb 1 holds one bit.",
    "Moving is faster than copying. mmv moves a thing, and a dmk that takes tkn@ says how."
   ],
   "ex": {
    "code": "add5 mak Adder&5\nadd10 mak Adder&10\nout prn add5&3\nout prn add10&3\nout prn add5\n\nAdder dst now\n  k dfd 0\n  call dop num\n    n dpm num\n    call ert n+k",
    "walk": [
     "Lines 1–2: two Adders, one keeping 5 and one keeping 10.",
     "Lines 3–4: called like functions: 8, then 13.",
     "Line 5: printed as a thing: Adder(k: 5).",
     "Lines 7–11: call dop says what happens when it's called."
    ]
   },
   "mistake": "Writing call as a plain dfn. Only an operator made with dop lets a thing be called with &."
  }
 },
 {
  "title": "Project: A Pet Shop",
  "chapter": "English++ Book Ch. 32 · a class with jobs",
  "line": [
   "Pet dcl now",
   "p feed 5"
  ],
  "content": {
   "story": [
    "A pet that gets hungry while you wait, and full when you feed it. A Pet class has a name and a hunger, and two jobs: wait and feed.",
    "wait adds 2 to hunger. feed takes some food and takes it off the hunger — but never below 0, which nmx&hunger-food&0 makes sure of.",
    "Each Pet has its own hunger, so a shop can keep many."
   ],
   "big": "A class with fields and jobs makes something that changes as you use it.",
   "caption": "Rex waits twice, gets hungry, then eats. Tap Play.",
   "demo": [
    "p mak Pet&\"Rex\"",
    "p wait now · p wait now",
    "hunger → 4",
    "p feed 5 → 0"
   ]
  },
  "deep": {
   "more": [
    "Keep many pets of different kinds in one list: shop mak vec@own@Pet, make each one with mwn (d mwn Dog&\"Rex\"), add it to the shop, then p fea shop visits each one.",
    "A next step: a pet that's too hungry says so — add an if to wait."
   ],
   "ex": {
    "code": "p mak Pet&\"Rex\"\np wait now\np wait now\nout prn p@hunger\np feed 5\nout prn p@hunger\nout prn p\n\nPet dcl now\n  name dfd txt\n  hunger dfd 0\n  Pet dmk now\n    n dpm txt\n    name is n\n  wait dfn now\n    hunger add 2\n  feed dfn now\n    food dpm num\n    hunger is nmx&hunger-food&0",
    "walk": [
     "Lines 1–4: two waits: 4.",
     "Lines 5–6: fed 5, and never below 0: 0.",
     "Line 7: Pet(name: Rex, hunger: 0)."
    ]
   },
   "mistake": "Letting hunger go below zero. nmx&hunger-food&0 keeps it at 0 or more."
  }
 },
 {
  "title": "When Things Go Wrong",
  "chapter": "English++ Book Ch. 33 · btr, bch, etw",
  "line": [
   "now btr now",
   "e bch now"
  ],
  "content": {
   "story": [
    "Some lines can go wrong: tnm&\"oops\" can't turn oops into a number. Put them under now btr now — try — and the program jumps to the catch instead of stopping.",
    "The catch comes straight after: e bch now catches the problem and calls it e, so \"caught: @e\" says what went wrong.",
    "etw throws a problem of your own: now etw \"An age can't be below zero.\" The nearest catch gets it — even one in the function that called yours.",
    "Ending the program yourself",
    "ext ends the program right away. Its third word is a number that the program gives back to whatever started it.",
    "0 means all went well, and anything else means something went wrong.",
    "Your whole program also gives back a number when it reaches the end. It's 0, unless you say otherwise with main ert 1."
   ],
   "big": "btr tries, bch catches the problem as e, and etw throws one of your own.",
   "caption": "The problem jumps out of the try and lands in the catch. Tap Play.",
   "demo": [
    "now btr now",
    "  n is tnm&\"not a number\"",
    "e bch now",
    "  caught: invalid stoi argument"
   ]
  },
  "deep": {
   "more": [
    "A line after the one that went wrong, inside the try, doesn't run. The program goes on after the catch.",
    "now etw now inside a catch passes the same problem on to the next catch out.",
    "ext ends the program right away — 0 means all went well."
   ],
   "ex": {
    "code": "now btr now\n  now set_age -3\n  out prn \"not reached\"\ne bch now\n  out prn \"caught: @e\"\nnow set_age 7\n\nset_age dfn now\n  age dpm num\n  age ilt 0\n    now etw \"An age can't be below zero.\"\n  out prn \"Age set.\"\n\nout prn \"Bye.\"\nnow ext 0\nout prn \"not reached\"",
    "walk": [
     "Lines 1–5: set_age throws, so not reached is skipped: caught: An age can't be below zero.",
     "Line 6: Age set.",
     "Lines 8–12: the function checks its value and throws.",
     "Line 14: out prn \"Bye.\" — prints Bye.",
     "Line 15: now ext 0 — end the program right here, giving back 0.",
     "Line 16: out prn \"not reached\" — this line never runs."
    ]
   },
   "mistake": "Putting a line between the try block and e bch now. The catch must come straight after."
  }
 },
 {
  "title": "Bits and Huge Numbers",
  "chapter": "English++ Book Ch. 34 · nnd nor nxr nnt nsl nsr, nsz, nlw, pbg, hug, cpx",
  "line": [
   "out prn nnd&a&b",
   "x mak hug"
  ],
  "content": {
   "story": [
    "Every number is made of bits: tiny switches that are on or off. nnd, nor and nxr give the and, or and xor of two numbers' bits; nnt flips them all; nsl and nsr shift them left and right. 6 is 110 and 3 is 011, so nnd&6&3 is 010, which is 2.",
    "nsz says how many bytes a thing takes: 4 for a num, 8 for a big. nlw is the lowest whole number a num can hold, and pbg is a whole number that can't go below 0, with all 64 bits for the number.",
    "A num stops at about 2 billion and a big at about 9 billion billion. hug doesn't stop: it's a whole number as long as your computer's memory. 25 times 24 times 23 and so on down to 1 is 15511210043330985984000000, and a hug holds it exactly. cpx is a complex number, with two parts."
   ],
   "big": "Bit words reach the switches inside a number, and hug is a whole number of any size.",
   "caption": "Bits switch on and off, and a hug grows past every limit. Tap Play.",
   "demo": [
    "6 → 110 · 3 → 011",
    "nnd&6&3 → 010 → 2",
    "x mak hug",
    "25! → 15511210043330985984000000"
   ]
  },
  "deep": {
   "more": [
    "hug&\"123456789012345678901234567890\" makes a huge number from text, big&x turns one back into a big, and x apw 100 raises one to a power.",
    "The roots and, aor, axr, asl and asr change a number's bits in place; nnd, nor, nxr, nsl and nsr give the answer as a value."
   ],
   "ex": {
    "code": "a is 6\nb is 3\nout prn nnd&a&b\nout prn nor&a&b\nout prn nxr&a&b\nout prn nsl&a&2\nx mak hug\nx is 1\ni is 2\ni wle 25\n  x aml i\n  i add 1\nout prn x\ny is hug&2\ny apw 100\nout prn y",
    "walk": [
     "Lines 1–6: and 2, or 7, xor 5, and 6 shifted left twice: 24.",
     "Lines 7–13: 25 times 24 times … times 1: 15511210043330985984000000.",
     "Lines 14–16: 2 to the power 100: 1267650600228229401496703205376."
    ]
   },
   "mistake": "Multiplying past a num's limit. A num wraps around after about 2 billion; make it a big, or a hug."
  }
 },
 {
  "title": "Files",
  "chapter": "English++ Book Ch. 35 · hwr, hap, hrd, hln, hrm",
  "line": [
   "\"a.txt\" hwr \"hello\"",
   "out prn hrd&\"notes.txt\""
  ],
  "content": {
   "story": [
    "h is the hard drive family. hwr writes a whole file: the file's name goes first and the text goes last. hap adds to the end and keeps what's there.",
    "hrd&\"a.txt\" reads a whole file into a text, and hln reads it as a list of lines. hex asks if a file exists, and hrm removes one.",
    "Reading a file that isn't there is a problem, so try it: put it under now btr now, and the catch can say the file is missing.",
    "Folders",
    "A file name with no folder means the folder your program runs in. When you press F5 in the Studio, that's your project's folder.",
    "hmk makes a folder: \"box\" hmk now makes a folder called box.",
    "hrm removes a folder too, and everything in it, for good. It doesn't go to the recycle bin, so be careful what you point it at.",
    "Copying and moving a file",
    "hcp copies a file: \"box/a.txt\" hcp \"box/b.txt\" makes a second copy called b.txt.",
    "hmv moves a file: \"box/b.txt\" hmv \"box/c.txt\" renames b.txt to c.txt, and the old name is gone.",
    "hls lists the files in a folder, so you can see what happened.",
    "Is it there?",
    "hex tells you if a file is there. hsz tells you its size, counted in bytes.",
    "A byte is about one letter. A file with hello in it is 5 bytes.",
    "If you try to read a file that isn't there, that's a problem, and you can catch it with btr and bch.",
    "Reading a file a line at a time",
    "mfi means make a file for input. Then wln reads it line by line.",
    "gln and get read from a file too, just like from the keyboard.",
    "top gln f reads the first line, a get f and b get f read the numbers 7 and 8, and rest gln f reads what's left of that same line."
   ],
   "big": "hwr writes, hap adds, hrd and hln read, and hrm removes — the file's name goes first.",
   "caption": "Lines go into the file, and come back out as a list. Tap Play.",
   "demo": [
    "name hwr \"one\\n\"",
    "name hap \"two\\n\"",
    "hln&name",
    "[one, two]"
   ]
  },
  "deep": {
   "more": [
    "\\n in a text is a new line, so each hap of a line with \\n adds one line to the file.",
    "f mfo \"notes.txt\" opens a file to write a bit at a time, and f mfi opens one to read.",
    "hmk makes a folder, and hrm removes one together with everything inside it.",
    "hcp copies a file, and hmv moves it — the old name is gone.",
    "hex asks if a file is there, and hsz says how many bytes it is.",
    "gln and wln read a file a line at a time, just like the keyboard."
   ],
   "ex": {
    "code": "name is \"notes.txt\"\nname hwr \"one\\n\"\nname hap \"two\\n\"\nout prn hln&name\nname hrm now\nnow btr now\n  out prn hrd&\"missing.txt\"\ne bch now\n  out prn \"I can't read that file.\"\n\n\"box\" hmk now\n\"box/a.txt\" hwr \"hi\"\nout prn hls&\"box\"\n\n\"box/a.txt\" hcp \"box/b.txt\"\n\"box/b.txt\" hmv \"box/c.txt\"\nout prn hls&\"box\"\n\nname is \"notes.txt\"\nout prn hex&name\nname hwr \"hello\"\nout prn hex&name\nout prn hsz&name\nname hrm now\nout prn hex&name\n\n\"notes.txt\" hwr \"first line\\n7 8\\nlast line\\n\"\nf mfi \"notes.txt\"\ntop gln f\nout prn top\na mak num\nb mak num\na get f\nb get f\nout prn a+b\nrest gln f\nline wln f\n  out prn line\nf close now\n\"notes.txt\" hrm now",
    "walk": [
     "Lines 1–4: [one, two].",
     "Line 5: the file is removed.",
     "Lines 6–9: I can't read that file.",
     "Line 11: \"box\" hmk now — make a folder called box.",
     "Line 12: \"box/a.txt\" hwr \"hi\" — write a file called a.txt inside it.",
     "Line 13: out prn hls&\"box\" — list the files in the folder: [a.txt].",
     "Line 15: \"box/a.txt\" hcp \"box/b.txt\" — copy a.txt to b.txt.",
     "Line 16: \"box/b.txt\" hmv \"box/c.txt\" — move b.txt to c.txt. The old name is gone.",
     "Line 17: out prn hls&\"box\" — list the folder: [a.txt, c.txt].",
     "Line 19: name is \"notes.txt\" — the file's name.",
     "Line 20: out prn hex&name — is it there? Not yet, so nay.",
     "Line 21: name hwr \"hello\" — write hello into it.",
     "Line 22: out prn hex&name — is it there now? Yes.",
     "Line 23: out prn hsz&name — how big is it? 5 bytes.",
     "Line 24: name hrm now — remove it.",
     "Line 25: out prn hex&name — is it there? Nay.",
     "Line 27: \"notes.txt\" hwr \"first line\\n7 8\\nlast line\\n\" — write a file with three lines in it.",
     "Line 28: f mfi \"notes.txt\" — open it for reading.",
     "Line 29: top gln f — read the first line into top.",
     "Line 30: out prn top — prints first line.",
     "Line 31: a mak num — make a number box.",
     "Line 32: b mak num — make another number box.",
     "Line 33: a get f — read 7 into a.",
     "Line 34: b get f — read 8 into b.",
     "Line 35: out prn a+b — prints 15.",
     "Line 36: rest gln f — read the rest of the line with 7 8 on it (nothing is left), so the next read starts at last line.",
     "Line 37: line wln f — while there are lines left, read one into line.",
     "Line 38: out prn line — print it: last line.",
     "Line 39: f close now — close the file.",
     "Line 40: \"notes.txt\" hrm now — remove the file."
    ]
   },
   "mistake": "Forgetting that hwr replaces the whole file. Use hap to add to it."
  }
 },
 {
  "title": "Project: A Shopping List That Remembers",
  "chapter": "English++ Book Ch. 36 · lists, files and functions together",
  "line": [
   "items add \"milk\"",
   "list dpm see@vec@txt"
  ],
  "content": {
   "story": [
    "A shopping list you add to, that's still there next time. It's a list of texts, read from a file when the program starts and saved again every time the list changes.",
    "save takes the list and writes it with one line per item: ctx&list&\"\\n\" joins the items with new lines between them.",
    "see@vec@txt takes the list to look at, without copying it and without changing it.",
    "Step 2: Taking things off",
    "Add one more choice to the menu: drop.",
    "chs checks that the thing is on the list before we say it's gone.",
    "items lrm thing takes it off the list. If it isn't on the list, the program says so instead of pretending."
   ],
   "big": "A list, a file and two functions make a program that remembers.",
   "caption": "The list goes into a file, and comes back the next day. Tap Play.",
   "demo": [
    "items is \"milk\"&\"eggs\"",
    "now save items",
    "shopping.txt",
    "milk · eggs"
   ]
  },
  "deep": {
   "more": [
    "hln reads the file back as a list of lines — the same list you saved.",
    "Ask hex&\"shopping.txt\" first: on the very first run there is no file yet.",
    "lrm takes a thing off the list — but check with chs first."
   ],
   "ex": {
    "code": "items is \"milk\"&\"eggs\"\nitems add \"bread\"\nnow save items\nback is hln&\"shopping.txt\"\nout prn back\nout prn cct&back\n\"shopping.txt\" hrm now\n\nsave dfn now\n  list dpm see@vec@txt\n  \"shopping.txt\" hwr ctx&list&\"\\n\"\n\nitems is \"milk\"&\"eggs\"\nwhat get \"add, drop, list or quit? \"\nwhat ieq \"drop\"\n  thing get \"What to drop? \"\n  has is chs&items&thing\n  has ieq yes\n    items lrm thing\n    out prn \"Gone.\"\n  now oth now\n    out prn \"That's not on the list.\"\nout prn items",
    "walk": [
     "Lines 1–3: three items, saved.",
     "Lines 4–6: read back: [milk, eggs, bread], 3 of them.",
     "Line 7: the file is tidied away.",
     "Lines 9–11: save writes one item per line.",
     "Line 13: items is \"milk\"&\"eggs\" — a list with milk and eggs.",
     "Line 14: what get \"add, drop, list or quit? \" — ask what to do.",
     "Line 15: what ieq \"drop\" — if the answer is drop...",
     "Line 16: thing get \"What to drop? \" — ask what to drop.",
     "Line 17: has is chs&items&thing — is it on the list?",
     "Line 18: has ieq yes — if it is...",
     "Line 19: items lrm thing — take it off the list.",
     "Line 20: out prn \"Gone.\" — say it's gone.",
     "Line 21: now oth now — otherwise...",
     "Line 22: out prn \"That's not on the list.\" — say so.",
     "Line 23: out prn items — print what's left: [milk]."
    ]
   },
   "mistake": "Forgetting the first run: hln on a file that isn't there yet is a problem. Ask hex first."
  }
 },
 {
  "title": "The Clock",
  "chapter": "English++ Book Ch. 37 · rwt, kel, kda, ktm",
  "line": [
   "now rwt 100",
   "t is kel"
  ],
  "content": {
   "story": [
    "now rwt 100 waits 100 milliseconds — a tenth of a second — before the next line. 1000 is a whole second.",
    "The k family tells the time: kel is the seconds since the program started, kms the milliseconds, kda today's date, ktm the time now, and kyr, kmo and kdy the year, the month and the day.",
    "kel is handy for timing: read it before a job and after, and the difference is how long the job took."
   ],
   "big": "rwt waits, and the k family reads the clock and the calendar.",
   "caption": "A countdown with a pause between each number. Tap Play.",
   "demo": [
    "3",
    "(a tenth of a second)",
    "2 · 1",
    "Go!"
   ]
  },
  "deep": {
   "more": [
    "A program that waits is still running; other threads go on while one waits.",
    "kfa&\"%Y-%m-%d\" fills in the date in any pattern you like."
   ],
   "ex": {
    "code": "n is 3\nn fgt 0\n  out prn n\n  now rwt 100\nout prn \"Go!\"",
    "walk": [
     "Lines 1–4: 3, 2, 1, with a pause after each.",
     "Line 5: Go!"
    ]
   },
   "mistake": "Writing now rwt 1 for a second. The value is milliseconds: a second is 1000."
  }
 },
 {
  "title": "At the Same Time",
  "chapter": "English++ Book Ch. 38 · mtd, rjn, mtx, blk",
  "line": [
   "t mtd count_to&3",
   "t rjn now"
  ],
  "content": {
   "story": [
    "A thread is a part of a program that runs at the same time as the rest. t mtd count_to&3 starts the function count_to running beside the program.",
    "t rjn now waits for the thread to finish. Every thread must either be joined with rjn or let go with rdt before its name goes away.",
    "Two threads changing the same thing at once can tangle it. A mutex — guard mak mtx — and a lock — m blk now — let one thread in at a time.",
    "Getting an answer later",
    "A thread doesn't give an answer back. msy does.",
    "It runs a function on the side, and hands you a future: a promise of an answer.",
    "When you ask with @get, it gives you the answer. If the answer isn't ready, it waits.",
    "The kind of answer here is fut@num: a future number.",
    "Atomics",
    "Two threads can change the same number at the same moment. Then they get in each other's way.",
    "Each one reads the number, adds 1, and writes it back. Sometimes both read the same number, so one of the adds is lost.",
    "atm fixes this for one number. An atomic number can't be interrupted. Each change is finished before the next one starts.",
    "total@load reads the number. Two threads counting to 1000 each give 2000, every time.",
    "Parallel for",
    "fpr means for, in parallel. It's written just like fea.",
    "But it spreads the work across every core of your computer. You don't have to manage any threads.",
    "So a big job can finish many times sooner.",
    "The turns run in no special order, and they can happen at the same moment. So anything they share must be an atm, or locked with a mtx. If each turn only changes its own item, there's nothing to worry about.",
    "Letting a thread go",
    "rdt means run: detach. It lets the thread go on by itself, and your program doesn't wait for it.",
    "If your program ends first, the thread just stops.",
    "rjn is the opposite: it waits for the thread to finish before going on."
   ],
   "big": "mtd starts a thread, rjn waits for it, and blk lets one thread at a time into the lines under it.",
   "caption": "Two threads add their names, one at a time through the lock. Tap Play.",
   "demo": [
    "t1 mtd add_name&…\"Ada\"",
    "t2 mtd add_name&…\"Bob\"",
    "t1 rjn now · t2 rjn now",
    "cct&names → 2"
   ]
  },
  "deep": {
   "more": [
    "A channel hands values between threads: c mak chn@num, c add 5 sends, and c@get& waits for one.",
    "Turbo builds can put a loop on every core by themselves, when it can prove that's safe.",
    "msy runs a function on the side and hands you a future — @get gives you the answer.",
    "An atm number can't be interrupted — every change finishes before the next one starts.",
    "fpr is fea on every core at once — the turns run in no special order.",
    "rdt lets a thread go on by itself — your program doesn't wait for it."
   ],
   "ex": {
    "studio": true,
    "code": "names mak vec@txt\nguard mak mtx\nt1 mtd add_name&names&guard&\"Ada\"\nt2 mtd add_name&names&guard&\"Bob\"\nt1 rjn now\nt2 rjn now\nout prn cct&names\n\nadd_name dfn now\n  list dpm ref@vec@txt\n  m dpm ref@mtx\n  who dpm txt\n  m blk now\n    list add who\n\nanswer msy slow_add&1&2\nout prn \"I can do other things now.\"\nout prn answer@get\nslow_add dfn num\n  a dpm num\n  b dpm num\n  now rwt 20\n  slow_add ert a+b\n\ntotal mak atm@num\nu1 mtd count_up&total\nu2 mtd count_up&total\nu1 rjn now\nu2 rjn now\nout prn total@load\ncount_up dfn now\n  c dpm ref@atm@num\n  i flt 1000\n    c add 1\n\nv is 1&2&3&4\nsum mak atm@num\nn fpr v\n  sum add n\nout prn sum@load\n\nt mtd say_hi&\"there\"\nt rdt now\nnow rwt 300\nout prn \"bye\"\nsay_hi dfn now\n  who dpm txt\n  out prn \"hi @who\"",
    "walk": [
     "Lines 1–2: a list and a mutex.",
     "Lines 3–6: two threads add a name each, and both are joined.",
     "Line 7: 2.",
     "Lines 9–14: the lock lets one thread at a time add to the list.",
     "Line 16: answer msy slow_add&1&2 — run slow_add with 1 and 2 on the side, and put the promise of the answer in answer.",
     "Line 17: out prn \"I can do other things now.\" — print this while the answer is still being worked out.",
     "Line 18: out prn answer@get — ask for the answer. If it isn't ready, this waits: 3.",
     "Line 19: slow_add dfn num — define slow_add.",
     "Line 20: a dpm num — it takes a.",
     "Line 21: b dpm num — it takes b.",
     "Line 22: now rwt 20 — wait 20 thousandths of a second.",
     "Line 23: slow_add ert a+b — give back a+b, which is 3.",
     "Line 25: total mak atm@num — make an atomic number.",
     "Line 26: u1 mtd count_up&total — start a thread counting up the same total.",
     "Line 27: u2 mtd count_up&total — start a second thread counting the same total.",
     "Line 28: u1 rjn now — wait for the first thread to finish.",
     "Line 29: u2 rjn now — wait for the second thread to finish.",
     "Line 30: out prn total@load — print the total: 2000. Nothing is lost.",
     "Line 31: count_up dfn now — define count_up.",
     "Line 32: c dpm ref@atm@num — it takes c, the real atomic number.",
     "Line 33: i flt 1000 — count from 0 to 999.",
     "Line 34: c add 1 — add 1 to it.",
     "Line 36: v is 1&2&3&4 — a list of four numbers.",
     "Line 37: sum mak atm@num — make an atomic number for the total.",
     "Line 38: n fpr v — for each n in v, on every core at once.",
     "Line 39: sum add n — add n to the total. The total is atomic, so nothing is lost.",
     "Line 40: out prn sum@load — prints 10.",
     "Line 42: t mtd say_hi&\"there\" — start a thread saying hi to there.",
     "Line 43: t rdt now — let it go on by itself. No waiting.",
     "Line 44: now rwt 300 — wait 300 thousandths of a second, so the thread gets a chance.",
     "Line 45: out prn \"bye\" — print bye.",
     "Line 46: say_hi dfn now — define say_hi.",
     "Line 47: who dpm txt — it takes who, a text.",
     "Line 48: out prn \"hi @who\" — prints hi there."
    ]
   },
   "mistake": "Ending the program without joining a thread."
  }
 },
 {
  "title": "Threads That Talk",
  "chapter": "English++ Book Ch. 39 · chn, cnd, mtl",
  "line": [
   "c mak chn@num",
   "c close now"
  ],
  "content": {
   "story": [
    "Threads can get in each other's way when they share things, so it's often better if they pass things along, like notes in class. A channel is a pipe between threads: one puts values in, another takes them out. Make one with chn@num — C++ has nothing like it.",
    "c add 5 sends, x is c@get& waits for one, and c close now says there are no more. n fea c walks through the values until the channel is closed and empty. No lock needed: the channel does that for you. chn@num&2 holds 2 at most, so a fast thread can't race far ahead of a slow one.",
    "cnd is a condition: inside a lock, cv wait g&ready sleeps until ready says yes, and cv notify_one now wakes one waiting thread. mtl makes a name at the top level that each thread has its own copy of."
   ],
   "big": "A channel passes values between threads with no lock; a condition lets a thread sleep until something is true.",
   "caption": "One thread sends numbers down the pipe, and the other adds them up. Tap Play.",
   "demo": [
    "c mak chn@num",
    "feed: c add 1 … 5",
    "n fea c: total add n",
    "→ 15"
   ]
  },
  "deep": {
   "more": [
    "Closing a channel matters: a walk through it ends only when it's closed and empty.",
    "mtl is useful for counters each thread keeps for itself, with no lock and no mix-up."
   ],
   "ex": {
    "studio": true,
    "code": "c mak chn@num\nt mtd feed&c\ntotal is 0\nn fea c\n  total add n\nt rjn now\nout prn total\n\nfeed dfn now\n  c dpm ref@chn@num\n  i flt 5\n    c add i+1\n  c close now",
    "walk": [
     "Lines 1–2: a channel, and a thread that feeds it.",
     "Lines 3–5: add up every value that comes down the channel.",
     "Lines 6–7: wait for the thread, then print 15.",
     "Lines 9–13: send 1 to 5, then close the channel."
    ]
   },
   "mistake": "Forgetting c close now. A walk through a channel that's never closed waits forever."
  }
 },
 {
  "title": "Groups and Other Files",
  "chapter": "English++ Book Ch. 40 · dgr, xim",
  "line": [
   "geo dgr now",
   "now xim \"tools.epp\""
  ],
  "content": {
   "story": [
    "dgr makes a group: a family of names that belong together. geo dgr now, with functions under it, and reach them with @: geo@area&3.",
    "Two groups can both have an area without a mix-up, because each is reached through its own name.",
    "A program can grow into many files. now xim \"tools.epp\" brings in another English++ file, so its functions and classes can be used here.",
    "Where things can go",
    "English++ reads your whole program before it starts, so definitions can go anywhere.",
    "But most people like this order: notes that say what the program is for, then xlb, xic and xim lines, then the main part of the program, then functions, then classes.",
    "A group holds names together, so two groups can use the same name without getting mixed up. You reach inside a group with @: geo@area and cash@area are two different functions."
   ],
   "big": "dgr groups names, and xim brings in another .epp file.",
   "caption": "A function inside a group, reached with @. Tap Play.",
   "demo": [
    "shout dgr now",
    "  say dfn txt",
    "shout@say&\"hello\"",
    "HELLO"
   ]
  },
  "deep": {
   "more": [
    "xim brings a file in once, however many files ask for it.",
    "Keep each file about one thing: tools.epp for tools, shapes.epp for shapes.",
    "Definitions can go anywhere, but most people put notes first, then the main part, then functions, then classes."
   ],
   "ex": {
    "studio": true,
    "code": "out prn geo@area&3\nout prn cash@area&3\n\ngeo dgr now\n  area dfn num\n    side dpm num\n    area ert side*side\n\ncash dgr now\n  area dfn txt\n    code dpm num\n    area ert \"region @code\"",
    "walk": [
     "Line 1: run area in geo with 3: 3 times 3 is 9.",
     "Line 2: run area in cash with 3: region 3.",
     "Lines 4–7: the group geo, with an area that squares a side.",
     "Lines 9–12: the group cash, with its own area that gives back a text."
    ]
   },
   "mistake": "Calling a group's function without the group: say&\"hello\" isn't found; write shout@say&\"hello\"."
  }
 },
 {
  "title": "The World Outside",
  "chapter": "English++ Book Ch. 41 · rcm, xcm, xev, xwb",
  "line": [
   "now rcm \"echo Hello from Windows\"",
   "page is xwb&\"http://example.com\""
  ],
  "content": {
   "story": [
    "rcm runs a command on the PC, as if you typed it in a Windows command window: now rcm \"echo Hello from Windows\".",
    "xcm&\"dir\" runs a command and gives back what it printed, and xcd gives its exit code. xev&\"PATH\" reads an environment value, and xag the words the program was started with.",
    "xwb&\"http://example.com\" reads a web page's text, and xpo sends text to a web address."
   ],
   "big": "The x and r roots reach outside the program: commands, settings and the web.",
   "caption": "The program asks Windows to run a command. Tap Play.",
   "demo": [
    "now rcm \"echo Hi\"",
    "Hi",
    "xev&\"PATH\"",
    "C:\\Windows;…"
   ]
  },
  "deep": {
   "more": [
    "A web page might not answer, so ask for one under now btr now.",
    "xha&s is a SHA-256 hash, and xbe and xbd turn text into base 64 and back."
   ],
   "ex": {
    "code": "online is nay\nonline ieq yes\n  page is xwb&\"http://example.com\"\n  out prn tsz&page\nout prn \"Done.\"",
    "walk": [
     "Line 1: online is nay, so the web is left alone.",
     "Lines 2–4: only when online is yes is the page read.",
     "Line 5: Done."
    ]
   },
   "mistake": "Running a command that waits for typing. rcm waits until the command ends."
  }
 },
 {
  "title": "Bytes, Codes and Other Computers",
  "chapter": "English++ Book Ch. 42 · hby, hrb, kns, kfa, xha, xbe, xbd, tjs, srv, sck, xpo",
  "line": [
   "out prn xha&\"abc\"",
   "code is xbe&\"hello\""
  ],
  "content": {
   "story": [
    "Some files, like pictures, hold plain numbers from 0 to 255: bytes. hby writes a list of bytes to a file and hrb reads them back. kns is a clock in nanoseconds, and kfa&\"%Y-%m-%d\" fills in the date in a pattern.",
    "xha gives a text a SHA-256 hash, like a fingerprint: the same text always gives the same one, and you can't get the text back from it. xbe turns text into base 64, which uses only plain letters and numbers, and xbd turns it back.",
    "tjs reads JSON — text that looks like lists and maps — into a jsn you can reach into with @. srv is a server that waits for someone to connect and sck is one end of a connection; 127.0.0.1 always means this computer. xpo sends text to a web page and gives back its answer.",
    "Very small times and pretty dates",
    "kns is a clock that counts in nanoseconds. A nanosecond is a billionth of a second.",
    "Take the time before and after a job, and you can see how long it took: stop is kns, then out prn stop>=start.",
    "kfa means clock: filled in. Give it a pattern, and it fills in the date and time. %Y is the year, %m is the month and %d is the day."
   ],
   "big": "Bytes in files, fingerprints and base 64, JSON, and talking to other programs.",
   "caption": "hello becomes aGVsbG8= and comes back again. Tap Play.",
   "demo": [
    "xha&\"abc\" → ba7816bf…",
    "xbe&\"hello\" → aGVsbG8=",
    "xbd&\"aGVsbG8=\" → hello",
    "hby · hrb → bytes"
   ]
  },
  "deep": {
   "more": [
    "A mistake in JSON text is a problem you can catch, and it says which line it's on.",
    "A server only listens on this computer unless you ask for more: srv&8080&\"0.0.0.0\" listens on the network too.",
    "kns counts nanoseconds, and kfa fills in a date from a pattern."
   ],
   "ex": {
    "code": "out prn xha&\"abc\"\ncode is xbe&\"hello\"\nout prn code\nout prn xbd&code\nbytes mak vec@byt\nbytes add byt&1\nbytes add byt&200\n\"bytes.bin\" hby bytes\nback is hrb&\"bytes.bin\"\nout prn cct&back\nout prn num&back@1\n\"bytes.bin\" hrm now\n\nstart is kns\ntotal is 0\ni flt 1000\n  total add i\nstop is kns\nout prn stop>=start\nyear is kfa&\"%Y\"\nout prn tsz&year",
    "walk": [
     "Line 1: the SHA-256 of abc: ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad.",
     "Lines 2–4: aGVsbG8=, then hello again.",
     "Lines 5–9: two bytes written and read back.",
     "Lines 10–11: 2 bytes, and the second is 200.",
     "Line 12: the file is tidied away.",
     "Line 14: start is kns — note the time now, in nanoseconds.",
     "Line 15: total is 0 — a total to add into.",
     "Line 16: i flt 1000 — count from 0 to 999.",
     "Line 17: total add i — add i to the total.",
     "Line 18: stop is kns — note the time again.",
     "Line 19: out prn stop>=start — is the stop time after the start time? Yes.",
     "Line 20: year is kfa&\"%Y\" — fill in the year, like 2026.",
     "Line 21: out prn tsz&year — how many letters is that? 4."
    ]
   },
   "mistake": "Expecting to get the text back from a hash. A hash only goes one way; use base 64 when you need it back."
  }
 },
 {
  "title": "Any C++, Any Library",
  "chapter": "English++ Book Ch. 43 · xic, xlb, xpp, xgl",
  "line": [
   "now xlb raylib",
   "now xic \"<vector>\""
  ],
  "content": {
   "story": [
    "English++ turns into C++, so it can reach anything C++ can. now xic \"<vector>\" includes a C++ header, and now xlb raylib brings in a whole library — raylib, SDL, SFML, OpenGL or Qt.",
    "A library is a bag of new words other people made. Once it's in, its functions are run like your own: now InitWindow 800&450&\"Stars\".",
    "now xpp \"…\" drops one line of real C++ right where it stands, and now xgl \"…\" puts one outside every function, where C++ keeps its global things. They are the escape hatch for anything English++ doesn't have a word for.",
    "The C++ View",
    "Want to see how it works? Open the C++ View panel in the Studio.",
    "It shows the C++ that your program turns into. When you click on a line of your program, the C++ for that line lights up.",
    "It's a great way to learn C++, if you ever want to. It's all there, one line at a time.",
    "A library's classes",
    "A library's classes work just like your own.",
    "Here is a small library in a header file. A header next to your program can be included by its name: now xic \"shop.h\".",
    "b mak Bag makes a bag, b fill 5 fills it, and b@total& runs its total: 5.",
    "t mak shop@Till makes a Till from the shop group, and shop@tax&50 is the shop's tax function: 5.",
    "A & on its own means run it with no values. So b@total& runs total, and b@open reads a field.",
    "Children of a library's class",
    "Your own class can be a child of a library's class.",
    "Sack dcl Bag says Sack is a child of Bag.",
    "If a function has const at the end of it in C++, redo it with dkn. If it doesn't, redo it with dov.",
    "A library that isn't in the Studio",
    "Do you have a library from somewhere else? Choose Libraries > Add External Library.",
    "Give it a name. Then fill in its main header, its include folder, and its .lib and .dll files.",
    "After that, it works like the others: now xlb yourname.",
    "You can also bring in a header by hand with xic, and skip the std:: part in your C++ lines with xus: now xus std is the same as using namespace std; in C++."
   ],
   "big": "xic and xlb bring in C++ headers and libraries, and xpp writes a line of C++ by hand.",
   "caption": "A raylib window opens from three-word lines. Tap Play.",
   "demo": [
    "now xlb raylib",
    "now InitWindow 800&450&\"Stars\"",
    "now wfv now",
    "  (draw a frame)"
   ]
  },
  "deep": {
   "more": [
    "Turbo builds leave a program with xpp lines a little less fast: the compiler can't see inside the C++ it didn't write.",
    "Anything the language leaves out on purpose, like goto, has another way: ebk and enx can name a loop.",
    "The C++ View shows the C++ your program turns into, one line at a time.",
    "A library's classes work just like your own — reach them with @.",
    "Your own class can be a child of a library's class.",
    "Add a library of your own with Libraries > Add External Library, then turn it on with xlb."
   ],
   "ex": {
    "studio": true,
    "code": "now xic \"<vector>\"\nv mak std@vector@int\nv push_back 3\nv push_back 4\nout prn v@size&\nn is std@stoi&\"12\"\nout prn n+1",
    "walk": [
     "Line 1: now xic \"<vector>\" — bring in C++'s vector header.",
     "Line 2: v mak std@vector@int — make v, a C++ vector of ints.",
     "Line 3: v push_back 3 — push_back is not a root, so it runs as v's C++ function, with 3.",
     "Line 4: v push_back 4 — push 4 in too.",
     "Line 5: out prn v@size& — run size with no values and print it: 2.",
     "Line 6: n is std@stoi&\"12\" — n is what std::stoi gives for the text \"12\".",
     "Line 7: out prn n+1 — prints 13."
    ]
   },
   "mistake": "Forgetting the library line. Without now xlb raylib, InitWindow is an unknown word."
  }
 },
 {
  "title": "Project: Catch the Stars",
  "chapter": "English++ Book Ch. 44 · a raylib game",
  "line": [
   "now xlb raylib",
   "now ebk WindowShouldClose&"
  ],
  "content": {
   "story": [
    "A real window game: stars fall from the top, and you move a basket with the arrow keys to catch them. It uses raylib, a library for games.",
    "Every frame the program reads the keys, moves the basket, moves each star down, and checks if a star touched the basket. Then it draws everything.",
    "The score goes up for every star caught. Build it a step at a time: first the window, then the basket, then one star, then many."
   ],
   "big": "A game loop reads the keys, moves things, checks for catches, and draws — sixty times a second.",
   "caption": "A star falls into the basket, and the score goes up. Tap Play.",
   "demo": [
    "now xlb raylib",
    "basket moves with ← →",
    "stars fall",
    "score add 1"
   ]
  },
  "deep": {
   "more": [
    "Build .exe makes the game a program of its own, with raylib inside, to share with a friend.",
    "Turbo leaves a library program built the plain way, so it behaves exactly as raylib expects."
   ],
   "ex": {
    "studio": true,
    "code": "now xlb raylib\nnow InitWindow 800&450&\"Catch the Stars\"\nnow SetTargetFPS 60\nx is 400\nscore is 0\nnow wfv now\n  now ebk WindowShouldClose&\n  IsKeyDown&KEY_LEFT ieq yes\n    x asb 5\n  IsKeyDown&KEY_RIGHT ieq yes\n    x add 5\n  now BeginDrawing now\n  now ClearBackground BLACK\n  now DrawRectangle x&420&80&20&GOLD\n  now DrawText \"Score: @score\"&10&10&20&RAYWHITE\n  now EndDrawing now\nnow CloseWindow now",
    "walk": [
     "Lines 1–5: the window, the basket's place and the score.",
     "Lines 6–16: every frame, move the basket with the arrow keys and draw it.",
     "Line 17: close the window."
    ]
   },
   "mistake": "Moving the basket off the screen. Keep x between 0 and 720 with nkb&x&0&720."
  }
 },
 {
  "title": "The Studio's Tools",
  "chapter": "English++ Book Ch. 45 · The Studio's Tools",
  "line": "out prn \"Hello, V!\"",
  "content": {
   "story": [
    "The Studio is the program where you write English++. It has one window, and everything is in it.",
    "Most of the work happens in one panel, with the others around it. The Studio saves your work when you press Ctrl+S, and when you run.",
    "Press F5 to run, and F9 to set a breakpoint. The Studio remembers which files are open, and puts them back where they were.",
    "There is nothing to install, and no code outside the Studio. It's yours, and it works even with no internet."
   ],
   "big": "The Studio is one window, and everything you need is in it.",
   "caption": "Your Studio, your window — one place to write, run, and watch your program.",
   "demo": [
    "out prn \"Hello, V!\"",
    "→ Hello, V!",
    "Press F5 to run it"
   ]
  },
  "deep": {
   "more": [
    "The editor is in the middle. Along the bottom are Output, Problems and the C++ View. On the left are Project, Outline, Libraries, Reference and Music. Debug is on the right.",
    "Ctrl+B hides the left side and Ctrl+J the bottom. If the window gets in a mess, choose View > Reset Layout.",
    "The status bar along the very bottom gives short news: how many mistakes there are, and how long a run took.",
    "Debug shows what your names hold when you stop a program part way, with a red dot from F9. Problems lists every mistake; point at a red line to see what's wrong and how to fix it."
   ],
   "ex": {
    "code": "out prn \"Hello, V!\"",
    "walk": [
     "Line 1: out prn \"Hello, V!\" — a one-line program. Press F5 to run it; what it prints shows in the Output panel."
    ]
   },
   "mistake": "Don't hunt through menus when something goes wrong. Look at the Problems tab first — it tells you what's wrong and how to fix it."
  }
 },
 {
  "title": "When the Studio Says Something",
  "chapter": "English++ Book Ch. 46 · When the Studio Says Something",
  "line": "x is 6",
  "content": {
   "story": [
    "Sometimes the Studio tells you something is wrong. That's good: it means it caught the mistake before anything ran.",
    "Sometimes a problem waits until the program is running, and the Studio stops it and shows you where.",
    "Every message says what happened, and the Studio's job is to catch them early, before they can do any harm.",
    "The best first move is always the same: read the message, look at the line it points to, and fix it there."
   ],
   "big": "When the Studio says something, read the message and look at the line it points to.",
   "caption": "The Studio catches mistakes early — before they can do any harm.",
   "demo": [
    "x is 6",
    "x add 0.5",
    "→ A kind problem",
    "x is 1",
    "x is \"a\"",
    "→ A box keeps its kind",
    "out prn f&1&2",
    "→ Count the values"
   ]
  },
  "deep": {
   "more": [
    "The shape of a line: x is 1 2 has too many words, out prn has too few, and x is a + b has spaces in its math — write x is a+b.",
    "Names: x is y means you used a name before you made it, and out prn coutn after count is 1 means the Studio guesses what you meant. x mak nmu says that kind doesn't exist.",
    "Kinds of values: x is 6 then x add 0.5 says a whole-number box can't hold 6.5, and x is 1 then x is \"a\" says a box keeps its kind.",
    "Functions: out prn f&1&2 says count the values — it's looking for one, and you gave it two. A function that promises a number must give one back with ert.",
    "When your program stops while it's running, the Studio shows you the line. The book's advice: when you don't know what's going on, print things — put out prn x in your program to see what's in a box."
   ],
   "ex": {
    "code": "x is 6.0\nx add 0.5\nout prn x",
    "walk": [
     "Line 1: x is 6.0 — start x as a decimal. Written as x is 6, it would be a whole number, and the next line would be a mistake.",
     "Line 2: x add 0.5 — a decimal can take the half.",
     "Line 3: out prn x — prints 6.5."
    ]
   },
   "mistake": "Don't try to run a program the Studio says is wrong. Read the message, fix the line it points to, and run again."
  }
 },
 {
  "title": "Turbo: How Your Programs Get Fast",
  "chapter": "English++ Book Ch. 47 · Turbo",
  "line": "out prn fib&42",
  "content": {
   "story": [
    "Turbo makes your program faster. It is a part of the Studio, and it's on from the start.",
    "Turbo reads your whole program before it builds it, looking for ways to do the same job sooner: remembering answers, sharing a loop across cores, sorting and printing a faster way.",
    "Inside Turbo is a second compiler, the Revolutionizer. Your program becomes a list of whole numbers, math rewrites those numbers, a second compiler turns them into C++, and Visual C++ builds it.",
    "A rewritten line only goes in if it turns back into exactly the same text, so the job your program does stays the same.",
    "The checks stay, unless they are proved away. Turbo only takes out a check when it can prove the check can never fail."
   ],
   "big": "Turbo does the same job sooner: it reads your whole program, and only removes a check it can prove.",
   "caption": "The same program, the same answer — only faster.",
   "demo": [
    "out prn fib&42",
    "→ 267914296",
    "The Book's test computer: 0.007 s with Turbo, 1.3 s without"
   ]
  },
  "deep": {
   "more": [
    "fib&42 is 267914296. On the Book's test computer it took 0.007 seconds with Turbo on and 1.3 seconds with it off — nearly 200 times as fast. The Book calls this the best case.",
    "The Book timed its every-core hunt with 3 million starts on its test computer: before, it ran at about the speed of C++; with Turbo sharing it across cores, more than 5 times as fast. Other computers give other numbers.",
    "The checks stay, unless they are proved away. As of November 2026, 458 test programs were run with Turbo on and off, and 606 claims about Turbo's math were proved by Z3. On 300 random programs, a separate checker proved 83,155 of the 83,799 checks Turbo removed, found none wrong, and couldn't follow the other 644.",
    "Turbo changes a few small things: hash maps and bags come out in a different order, printing can be a little late, and files can be a little late. It leaves libraries like raylib alone, and Classic programs don't get Turbo."
   ],
   "ex": {
    "code": "out prn fib&42\n\nfib dfn num\n  n dpm num\n  n ilt 2\n    fib ert n\n  a is fib&n-1\n  b is fib&n-2\n  fib ert a+b",
    "walk": [
     "Line 1: out prn fib&42 — print what fib gives for 42: 267914296.",
     "Line 3: fib dfn num — define fib, which gives back a whole number.",
     "Line 4: n dpm num — it takes n, a whole number.",
     "Line 5: n ilt 2 — if n is less than 2,",
     "Line 6: fib ert n — give back n itself.",
     "Line 7: a is fib&n-1 — otherwise run fib for one less,",
     "Line 8: b is fib&n-2 — and for two less.",
     "Line 9: fib ert a+b — give back their sum. Turbo sees fib only uses its own value, so it remembers each answer. On the Book's test computer: 0.007 s with Turbo, 1.3 s without."
    ]
   },
   "mistake": "Don't count on Turbo for every program the way it helps fib — fib is the best case. And if a program acts strangely, turn Turbo off and run it again: if the answer changes, you may have found a bug in Turbo."
  }
 },
 {
  "title": "English++ Against C++",
  "chapter": "English++ Book Ch. 48 · English++ Against C++",
  "line": "out prn fib&42",
  "content": {
   "story": [
    "English++ turns into C++. So how does it compare? The Book shows what was measured, wins and losses both.",
    "The Book measured 25 jobs on one laptop chip, with Turbo on, on November 11, 2026. Each job was written the natural way in both English++ and C++.",
    "English++ was faster on 19 jobs, about the same on 4, and slower on 2. The middle job was 1.91 times as fast.",
    "On 13 small jobs, English++ used a little over half the lines, about a third of the typing, and no control marks. The one big speed gap there was sorting: 0.086 seconds in English++, 0.322 in C++.",
    "These are the Book's measurements on one machine, not a rule. Your computer will give other numbers, and a C++ expert can always catch up by hand, because English++ turns into C++."
   ],
   "big": "On the Book's 25 measured jobs, English++ was faster on 19, about the same on 4, and slower on 2 — on one machine.",
   "caption": "Measured, not promised: faster on 19, about the same on 4, slower on 2.",
   "demo": [
    "25 jobs measured",
    "Faster on 19",
    "About the same on 4",
    "Slower on 2",
    "Middle job: 1.91x"
   ]
  },
  "deep": {
   "more": [
    "The 25 jobs were measured with Turbo on, on one laptop, in November 2026. Each job ran in both English++ and ordinary C++.",
    "English++ was faster on 19 jobs, about the same on 4, and slower on 2. The middle job was 1.91 times as fast, and the average — leaving out fib — was 2.52 times as fast.",
    "A sorting job ran in 0.086 seconds in English++ and 0.322 seconds in C++. That's about 3.7 times as fast.",
    "No one number could be true. The fib row is a special case, some C++ rows use slow Windows habits, some rows use every core, and a row can move by a fifth with nothing changed. A C++ expert can always write by hand what English++ does."
   ],
   "ex": {
    "code": "out prn fib&42\n\nfib dfn num\n  n dpm num\n  n ilt 2\n    fib ert n\n  a is fib&n-1\n  b is fib&n-2\n  fib ert a+b",
    "walk": [
     "Line 1: out prn fib&42 — print what fib gives for 42: 267914296.",
     "Lines 3–9: fib runs itself twice for each value below it.",
     "This is the fib row of the Book's speed table: 1.386 s in C++ and 0.008 s in English++ on its test machine. The Book calls it a special case — Turbo remembers fib's answers, and C++ could do the same if somebody wrote it by hand."
    ]
   },
   "mistake": "Don't say English++ is so many times faster than C++. Say what was measured: faster on 19 of the Book's 25 jobs, about the same on 4, slower on 2, on one machine."
  }
 },
 {
  "title": "The Cheat Sheet",
  "chapter": "English++ Book Ch. 51 · The Cheat Sheet",
  "line": "out prn \"Hello, V!\"",
  "content": {
   "story": [
    "Here are the 12 lines to learn first. The book says these 12 cover about three lines out of four in the Studio's example programs.",
    "Learn them one at a time, and you can read most of the programs in this book.",
    "The rest of the words are sorted into groups, by what they do. When you want a word, look in the group that does that job.",
    "The marks are part of the cheat sheet too: @ reaches in, & gives values, and + - * / % do math with no spaces."
   ],
   "big": "The 12 to learn first cover about three lines out of four.",
   "caption": "Twelve lines. About three out of four lines in the Studio's example programs.",
   "demo": [
    "out prn x",
    "x is 6",
    "x add 1",
    "x mak num",
    "x ieq 3",
    "i flt 10",
    "x fea v",
    "f dfn num",
    "a dpm num",
    "f ert a+1",
    "Dog dcl now",
    "age dfd 3"
   ]
  },
  "deep": {
   "more": [
    "The 12, in the book's order: out prn x prints; x is 6 makes and sets; x add 1 adds; x mak num makes x, an empty whole number; x ieq 3 asks if it is 3; i flt 10 counts from 0 to 9; x fea v repeats over a list; f dfn num defines a function giving a number; a dpm num says a function takes a; f ert a+1 gives back a+1; Dog dcl now defines a class; age dfd 3 gives the class a field starting at 3.",
    "The groups are: Making and changing; Printing and asking; Choosing; Repeating; Lists; Functions and classes.",
    "The marks are: @ reaches in, & gives values, + - * / % do math with no spaces, == != < <= > >= compare, && and ||, ! not, now, and @x, a value inside text."
   ],
   "ex": {
    "code": "out prn \"Hello!\"",
    "walk": [
     "Line 1: out prn \"Hello!\" — the Book's very first program. It uses the first of the 12: out prn."
    ]
   },
   "mistake": "Don't try to learn all the words at once. Learn the 12, and look up the rest in the group that does the job."
  }
 },
 {
  "title": "The Whole Chart",
  "chapter": "English++ Book Ch. 52 · The Whole Chart",
  "line": "score add 10",
  "content": {
   "story": [
    "This is the Whole Chart: every word in English++, sorted by family.",
    "Each family is a letter, and each letter has a job. a is arithmetic, b is block, c is collection, d is define, e is exit, f is for, g is get, h is hard drive, i is if, k is clock, l is list, m is make, n is number, o is otherwise, p is put, r is run, s is should, t is text, u is until, w is while, and x is external.",
    "When you want a word, find the family that does the job, and look down its list. The chart also has a Kinds table, for what things are, and a Special words list: now, nil, yes, nay, out, err, inp, and slf.",
    "You don't have to learn it all. Learn the 12 from the Cheat Sheet, and use the chart to find the rest."
   ],
   "big": "The Whole Chart is every word in English++, sorted by family — use it to find a word, not to learn them all.",
   "caption": "Every word in English++, sorted by family.",
   "demo": [
    "a — arithmetic",
    "b — block",
    "c — collection",
    "d — define",
    "e — exit",
    "f — for",
    "g — get",
    "h — hard drive",
    "i — if",
    "k — clock",
    "l — list",
    "m — make",
    "n — number",
    "o — otherwise",
    "p — put",
    "r — run",
    "s — should",
    "t — text",
    "u — until",
    "w — while",
    "x — external"
   ]
  },
  "deep": {
   "more": [
    "The a family is arithmetic: it changes a thing in place. score add 10 adds 10, x asb 3 takes 3 away, x aml 2 multiplies by 2, x adv 4 divides by 4, x amd 5 keeps the remainder after dividing by 5, and y apw 10 raises y to the power of 10.",
    "The other families are the same idea: each word starts with its family's letter. So when you want a list word, look in the l family; when you want a text word, look in the t family.",
    "The Kinds table says what things are: num, txt, dec, yes-or-no, and the rest. The Special words list is now, nil, yes, nay, out, err, inp, and slf."
   ],
   "ex": {
    "code": "score is 0\nscore add 10\nx is 20\nx asb 3\nx aml 2\nx adv 4\nx amd 5\ny is 2\ny apw 10\nout prn score\nout prn x\nout prn y",
    "walk": [
     "Line 1: score is 0 — make score.",
     "Line 2: score add 10 — add 10 to it: 10.",
     "Line 3: x is 20 — make x.",
     "Line 4: x asb 3 — take 3 away: 17.",
     "Line 5: x aml 2 — multiply by 2: 34.",
     "Line 6: x adv 4 — divide by 4. x is a whole number, so it keeps 8.",
     "Line 7: x amd 5 — x becomes the remainder of 8 divided by 5: 3.",
     "Line 8: y is 2 — make y.",
     "Line 9: y apw 10 — y to the power of 10: 1024.",
     "Lines 10–12: print 10, 3 and 1024."
    ]
   },
   "mistake": "Don't try to learn the chart by heart. Learn the 12, and use the chart to find a word when you need one."
  }
 }
];

  var shelves = [
 {
  "title": "The Whole Chart",
  "chapter": "Beyond the basics · English++ shelf",
  "line": [
   "x igt 3",
   "x wgt 3"
  ],
  "content": {
   "story": [
    "The Whole Chart is every word in English++, and it's frozen: a word never changes what it means, so what you learn stays true. New words may be added, but never changed.",
    "Every root is a family letter and a two-letter job. a arithmetic, b block, c collection, d define, e exit, f for, g get, h hard drive, i if, k clock, l list, m make, n number, o otherwise, p put, r run, s should, t text, u until, w while, x external.",
    "A job means the same thing in every family. The six that compare — eq ne lt le gt ge — make ieq and weq and seq and ueq and the rest; rm is remove in lrm and hrm; sz is size in tsz and hsz."
   ],
   "big": "Family letter plus job makes a root, the same way every time, and the chart never changes.",
   "caption": "One job, gt, in five families. Tap Play.",
   "demo": [
    "igt · if greater than",
    "ogt · otherwise if greater",
    "wgt · while greater than",
    "sgt · should be greater",
    "fgt · count down while greater"
   ]
  },
  "deep": {
   "more": [
    "The kinds have short names too: num big sml pos byt dec flo txt ltr yno any, and the holders vec lst dqu arr stk que hep map hsh set bag par tup opt.",
    "In the Studio, point at any root to see it spelled out, letter by letter."
   ],
   "ex": {
    "code": "x is 5\nx igt 3\n  out prn \"if: bigger than 3\"\nx sgt 3\nout prn \"should: it is\"\nn is x\nn fgt 3\n  out prn n\nx wgt 3\n  x asb 1\nout prn x",
    "walk": [
     "Lines 2–3: if greater: if: bigger than 3.",
     "Lines 4–5: should be greater, and it is: should: it is.",
     "Lines 6–8: count down while greater than 3: 5, 4.",
     "Lines 9–11: take 1 while greater than 3: 3."
    ]
   },
   "mistake": "Guessing a job's meaning from English. ne is not equal, never next; check the chart's job list."
  }
 },
 {
  "title": "Ready-Made Values",
  "chapter": "Beyond the basics · English++ shelf",
  "line": [
   "out prn nsq&81",
   "out prn tuc&word"
  ],
  "content": {
   "story": [
    "English++ comes with over a hundred ready-made value words (132 in the Chart), in every program, with nothing to include. Each one is a word, then &, then what it takes.",
    "Numbers: nsq square root, nab absolute value, nmx and nmn the bigger and smaller, npw power, nfc factorial, npe is prime, nra a random number. Text: tsz tuc tlc trv trp tps ths tsp twd.",
    "Collections: cct how many, csm the sum, cmx and cmn, cav the average, chs has, cps where, cso and crv sorted and reversed copies, ctx joined into a text."
   ],
   "big": "n, t and c words with & give ready-made answers about numbers, text and collections.",
   "caption": "A toolbox opens: number tools, text tools, list tools. Tap Play.",
   "demo": [
    "nsq&81 → 9",
    "nfc&5 → 120",
    "tuc&\"hi\" → HI",
    "cmx&scores → 9"
   ]
  },
  "deep": {
   "more": [
    "Each one gives back one kind of answer: tsz a number, nsq a decimal, tuc a text, chs a yes or no.",
    "The Reference panel in the Studio lists every one, and double-clicking adds it to your program."
   ],
   "ex": {
    "code": "scores is 4&9&2&7\nout prn \"Scores: @scores\"\nout prn cmx&scores\nout prn cmn&scores\nout prn csm&scores\nout prn cav&scores\nout prn nfc&5\nout prn npe&97\nout prn nsq&81\nout prn trv&\"stressed\"",
    "walk": [
     "Line 2: Scores: [4, 9, 2, 7].",
     "Lines 3–6: 9, 2, 22 and 5.5.",
     "Line 7: 120.",
     "Line 8: yes, 97 is prime.",
     "Line 9: 9.",
     "Line 10: desserts."
    ]
   },
   "mistake": "Mixing up tsz and cct. tsz counts the letters in a text, and cct counts the items in a collection."
  }
 },
 {
  "title": "English++ Studio",
  "chapter": "Beyond the basics · English++ shelf",
  "line": [
   "out prn \"Hello from the Studio!\""
  ],
  "content": {
   "story": [
    "The Studio is where English++ is written, run and built. The editor is in the middle; Output, Problems and the C++ View are at the bottom; Project, Outline, Libraries, Reference and Music are on the left.",
    "F5 runs your program. Ctrl+Shift+B builds an .exe that runs on its own. Tab takes a suggestion, Enter moves the next line in after a line that opens a block, and Shift+Tab moves a line back out.",
    "Ctrl+/ turns a line into a note and back, F12 jumps to where a name is made, F2 renames it everywhere, and Ctrl+Shift+P finds anything the Studio can do."
   ],
   "big": "F5 runs, Ctrl+Shift+B builds, and Ctrl+Shift+P finds everything else.",
   "caption": "Type, press F5, and the Output panel answers. Tap Play.",
   "demo": [
    "New Project → Console App",
    "write main.epp",
    "F5 → Output",
    "Ctrl+Shift+B → .exe"
   ]
  },
  "deep": {
   "more": [
    "The C++ View shows the C++ your program turns into, line for line — a good way to learn C++ as you go.",
    "Turbo (Build > Turbo: Fastest Programs) is on from the start. It changes how soon a program finishes, not the job it does."
   ],
   "ex": {
    "code": "note Press F5 to run me.\nout prn \"Hello from the Studio!\"\ni flt 3\n  out prn \"line @i\"",
    "walk": [
     "Line 1: a note — skipped.",
     "Line 2: Hello from the Studio!",
     "Lines 3–4: line 0, line 1, line 2."
    ]
   },
   "mistake": "Moving lines in by hand with the space bar and getting three spaces. Let Enter and Shift+Tab do it: two spaces a level."
  }
 },
 {
  "title": "When the Studio Says Something",
  "chapter": "Beyond the basics · English++ shelf",
  "line": [
   "x is a+b",
   "x is 1&2"
  ],
  "content": {
   "story": [
    "The Studio tells you about every mistake in plain words, on the right line. The one you'll see most: This line has 4 words. Every line has exactly 3: who, the root, and what.",
    "Typed some C++ out of habit? The Studio says what to write instead: no commas (use &), no square brackets (use @ for a position), no dots except in a number (use @ to reach inside), no curly brackets (move lines in).",
    "Used a name before making it? I don't know y yet. Make it first, like y is 0 — and, if it looks like a spelling slip, Did you mean count?"
   ],
   "big": "Every mistake comes in one sentence, on the right line, with what to write instead.",
   "caption": "A wrong line, the Studio's sentence, and the fix. Tap Play.",
   "demo": [
    "x is a + b",
    "5 words — write x is a+b",
    "x is v[0]",
    "no square brackets — write v@0"
   ]
  },
  "deep": {
   "more": [
    "A problem while the program runs shows you its line too, and says what went wrong, like: It divided a whole number by zero.",
    "The Problems panel lists all your mistakes. Double-click one to jump to it."
   ],
   "ex": {
    "code": "a is 2\nb is 3\nx is a+b\nv is 1&2\nout prn x\nout prn v@0",
    "walk": [
     "Line 3: math with no spaces is one word.",
     "Line 4: & instead of a comma.",
     "Lines 5–6: 5, and @0 instead of [0]: 1."
    ]
   },
   "mistake": "Fixing the line the Studio didn't name. Start with the first message: one slip can cause the rest."
  }
 },
 {
  "title": "Better Than C++",
  "chapter": "Beyond the basics · English++ shelf",
  "line": [
   "a ebk now",
   "out prn rex"
  ],
  "content": {
   "story": [
    "The same 13 jobs, written in English++ and in C++, printing the same thing: about half the lines, about a third of the typing, and no control marks at all — 0 against 651. All 13 built in 6.69 seconds, against 14.75 for C++: more than twice as fast, because the Studio reads the C++ library once and keeps it.",
    "Some things C++ just doesn't do. A box you forgot to fill reads junk in C++; in English++ everything starts as zero or empty. Going past the end of a list reads other memory in C++; English++ stops and shows you the line.",
    "Leaving two loops at once needs a flag in C++; English++ says a ebk now. Printing a list or an object needs code in C++; English++ just prints it."
   ],
   "big": "Fewer lines, no marks, faster builds — and mistakes that stop on the right line instead of reading the wrong memory.",
   "caption": "The same job: a few lines of English++ against a page of C++. Tap Play.",
   "demo": [
    "hello · 1 line vs 5",
    "print a list · 5 vs 17",
    "leave two loops · 6 vs 15",
    "all 13 · 123 lines vs 221"
   ]
  },
  "deep": {
   "more": [
    "The safety checks cost something: reading a list by position checks the position first. Walking a list with fea costs nothing extra, and Turbo removes the checks it can prove aren't needed.",
    "The programs and the script that measures them are kept with the Studio's source code, in a folder called benchmarks, so anyone can measure again."
   ],
   "ex": {
    "code": "a flt 3\n  b flt 3\n    a*b ieq 2\n      a ebk now\n    out prn a*10+b\nout prn \"done\"",
    "walk": [
     "Lines 1–5: two counting loops print 0, 1, 2, 10, 11.",
     "Lines 3–4: when a*b is 2, a ebk now leaves both loops at once.",
     "Line 6: done."
    ]
   },
   "mistake": "Thinking safety makes English++ slow. Turbo takes away every check it can prove is never needed, and a walk with fea never had one."
  }
 },
 {
  "title": "Turbo: Faster Than C++",
  "chapter": "Beyond the basics · English++ shelf",
  "line": [
   "scores lso now",
   "ages mak map@txt@num"
  ],
  "content": {
   "story": [
    "Turbo is how the Studio builds English++ programs, and it's on from the start. It doesn't change the language or the job a program does. It just gets there sooner.",
    "Because every line is three words, the compiler can read exactly what each line touches, which a C++ compiler can't. So it proves list positions are safe and removes their checks, splits loops across every core, sorts with radix sort, keeps maps as B+ trees and remembers the answers of functions that call themselves.",
    "In the Book's table of 25 bigger jobs, measured on one laptop on November 11, 2026, the natural English++ program was faster than the natural C++ one on 19, about the same on 4 and slower on 2. Leaving out fib, it averaged 2.52 times as fast. A C++ expert can always catch up by hand: the table compares the natural way to write each job."
   ],
   "big": "Turbo makes the natural English++ program finish sooner (on most of the Book's measured jobs, sooner than natural C++) without changing the job it does.",
   "caption": "Same answers, sooner: a check proved away, a loop on every core. Tap Play.",
   "demo": [
    "fib · 178.89x (remembered answers)",
    "sort ints · 3.95x (radix sort)",
    "tree map · 5.29x (packed maps)",
    "25 jobs · 2.52x average, leaving out fib"
   ]
  },
  "deep": {
   "more": [
    "The Book lists what was checked as of November 2026: 458 test programs run with Turbo on and off and compared, 606 claims about Turbo's math proved by Z3, and a separate checker that proved 83,155 of 83,799 removed checks again on 300 random programs, with none wrong. Test builds can also put every removed check back, and stop with TURBO PROOF FAILED if one ever fires.",
    "A program that uses a library, like raylib, is built the plain way. A program with lines of C++ (xpp) keeps its proofs, but loses the fast printing, maps and files. C++ is still ahead for hand-tuned code, other kinds of computer and decades of tools."
   ],
   "ex": {
    "code": "total is 0\nv is 3&1&2\nv lso now\nn fea v\n  total add n\nout prn v\nout prn total",
    "walk": [
     "Lines 2–3: Turbo sorts numbers with radix sort, in one pass per digit.",
     "Lines 4–5: a walk with fea needs no position checks at all.",
     "Lines 6–7: [1, 2, 3] and 6 — the same answer either way."
    ]
   },
   "mistake": "Expecting Turbo to change the job a program does. It doesn't. The one way printing can differ is the order of walking a hsh or a bag, so never count on that order."
  }
 },
 {
  "title": "The Revolutionizer",
  "chapter": "Beyond the basics · English++ shelf",
  "line": [
   "best olt left",
   "n is n+1"
  ],
  "content": {
   "story": [
    "The Revolutionizer is a second compiler behind the first. A Turbo build turns English++ into a language that is only numbers, rewrites those numbers by rules of algebra, and a second compiler turns them into C++.",
    "As text, if (best > left) is a string; as numbers it's a tree that says compare, best, left — and a rule about trees can say exactly when it holds. The smaller of two becomes bits with no branch, x % 8 == 0 becomes (x & 7) == 0, and a whole loop of adding becomes one formula.",
    "It stays right by a round trip: a line is printed the way the second compiler would print it and compared letter for letter, or it goes through raw. edit distance is one of the jobs these rewrites help, and in the Book's speed table it runs 2.45 times as fast as C++."
   ],
   "big": "English++ becomes numbers, rules of algebra rewrite them, and the C++ that comes out runs faster.",
   "caption": "A line becomes a tree of numbers, and a rule makes it faster. Tap Play.",
   "demo": [
    "n is n+1",
    "→ set · two · 21 · n · 1",
    "→ the math",
    "→ C++"
   ]
  },
  "deep": {
   "more": [
    "Rules only hold where they say they hold: whole numbers only, no division by a name that might be zero, no reading a list early. Each rule was broken on purpose, 15 ways, to check that a test notices.",
    "So far 30% of the lines in the Turbo tests are ones the math can read; the rest go through raw, untouched."
   ],
   "ex": {
    "code": "best is 9\nleft is 4\nleft ilt best\n  best is left\nout prn best\ns is 0\ni flt 5\n  s add i\nout prn s",
    "walk": [
     "Lines 1–5: the smaller of two — the Revolutionizer turns this if into bits with no branch: 4.",
     "Lines 6–9: a whole loop of adding becomes n(n-1)/2: 10."
    ]
   },
   "mistake": "Thinking numbers are fast by themselves. Machine code is numbers too; the speed comes from the rules the numbers make possible."
  }
 },
 {
  "title": "Why English++ Works",
  "chapter": "Beyond the basics · how Vewu's design does its job",
  "line": [
   "x is 6",
   "x add 1",
   "x igt 3",
   "out prn x"
  ],
  "content": {
   "story": [
    "English++ is Vewu's language. Its whole design rests on one choice: every line is exactly three words — who, the root, and what — with no brackets, commas or semicolons at all.",
    "That one choice does a lot of work. A line can only take one shape, so reading a program is simple for the compiler and for you. There is no grammar to untangle: the middle word says what happens, and the Chart says exactly what each middle word means.",
    "Simple to read means the compiler can be small and exact. Every line becomes straight C++, one for one, and the Studio's C++ View shows it. x is 6 becomes int x = 6;, x add 1 becomes x += 1;, and out prn x becomes the C++ print line. Nothing is guessed.",
    "When a line is wrong, the Studio stops before anything runs, names the line, and says what to write instead. It never tries to guess what you meant.",
    "Because the Chart is frozen, a program that works today keeps working. Words can be added, but a word that is there never changes what it means.",
    "Exact and frozen also makes the language checkable. The Studio keeps a set of test programs whose C++ must stay the same byte for byte. Turbo, the fast build, must print exactly what the plain build prints.",
    "One front end can feed more than one back end. The Studio's notes describe back ends for C++, plain C (--C) and Python (Python++). They share the same reading of every line, and a back end that can't match the C++ result exactly refuses instead of guessing.",
    "Turbo makes programs fast without changing the language. It removes a safety check only when it can prove the check can never fail, and keeps every check it can't prove.",
    "What this does not prove: the checks prove the translation is right, not that your program does what you meant. And C++ can always match English++ by hand, because English++ becomes C++."
   ],
   "big": "Three words a line makes the compiler small and exact, and small and exact makes it checkable — that's the whole trick.",
   "caption": "One three-word line in, one line of C++ out. Tap Play.",
   "demo": [
    "x is 6 → int x = 6;",
    "x add 1 → x += 1;",
    "x igt 3 → if (x > 3) {",
    "out prn x → std::cout << x << std::endl;"
   ]
  },
  "deep": {
   "more": [
    "The numbers below come from the Studio's own measurement files (PROOF.md, SPEED.md and TURBO.md, written up by Opus at Vewu's direction). They were measured on one Windows laptop with Visual C++. Your computer will give other numbers.",
    "Small jobs (PROOF.md): 13 tasks written in both languages, same output. English++ used 123 lines to C++'s 221, 1,402 letters to 3,886, and 0 control marks to 651. Building took 6.69 s against 14.75 s.",
    "Real work (SPEED.md): 25 jobs, each written the natural way in both languages. Measured carefully at four code positions on 2026-11-04, English++ was faster on 17, within 3% on 8 and slower on none — 2.70 times the speed on average, or 2.27 times without the fib job. The file's own warning: this is not \"English++ is N times faster\"; a C++ expert can always catch up by hand.",
    "Turbo's proofs (TURBO.md): a separate checker that shares no code with the compiler re-checked the safety checks Turbo removed. On 300 random programs it confirmed 83,155 of 83,799 removed checks, found none wrong, and could not follow 644. The math behind removed checks was also tested on 480,000 edge cases.",
    "Where C++ is still ahead: a formula with brackets is one line in C++ and a few here; a program that uses a library gets no Turbo; C++ runs on every kind of computer and has decades of tools; and C++ lets you switch safety off."
   ],
   "ex": {
    "code": "x is 6\nx add 1\nx igt 3\n  out prn x",
    "walk": [
     "Line 1: x is 6 — make x and put 6 in it. C++: int x = 6;",
     "Line 2: x add 1 — x is now 7. C++: x += 1;",
     "Line 3: x igt 3 — if x is greater than 3, run the indented line under it. C++: if (x > 3) {",
     "Line 4: out prn x — print 7. C++: std::cout << x << std::endl; and the block closes when the indent ends.",
     "Four lines in, four lines of C++ out — the one-for-one rule from the Chart."
    ]
   },
   "mistake": "Reading the speed figures as a promise. They are one set of measurements on one laptop, of programs written the natural way in each language. A careful C++ programmer can match any of them by hand."
  }
 }
];

  var glossary = [
 [
  "argument",
  "A value you hand to a function. In English++: add_up&1&2."
 ],
 [
  "array",
  "A row of things that can't change size. In English++: arr@num@5."
 ],
 [
  "base 64",
  "A way to write anything in plain letters and numbers, safe to send anywhere. In English++: xbe and xbd."
 ],
 [
  "bit",
  "A tiny switch that is on or off; every number is made of them. In English++: nnd, nsl and their friends."
 ],
 [
  "boolean",
  "A value that's yes or no. In English++: yno."
 ],
 [
  "bug",
  "A mistake in a program."
 ],
 [
  "build",
  "Turn a program into an .exe file that runs on its own. In the Studio: Ctrl+Shift+B."
 ],
 [
  "byte",
  "8 bits: a number from 0 to 255. In English++: byt, and hby and hrb for files of bytes."
 ],
 [
  "channel",
  "A pipe that threads pass values through, with no lock needed. In English++: chn@num."
 ],
 [
  "class",
  "A plan for a kind of thing. In English++: dcl."
 ],
 [
  "collection",
  "Many things kept together: a vector, list, map, set, stack or queue."
 ],
 [
  "comment",
  "A line for people, which the computer skips. In English++: note."
 ],
 [
  "compile",
  "Turn a program into something a computer can run. F5 does this in the Studio."
 ],
 [
  "constant",
  "A value that can't change. In English++: mkn."
 ],
 [
  "constructor",
  "What runs when a thing is made. In English++: dmk."
 ],
 [
  "core",
  "One of the workers inside a computer's chip. Turbo shares a loop out across all of them."
 ],
 [
  "crash",
  "When a program stops because of a problem."
 ],
 [
  "debug",
  "Find and fix mistakes."
 ],
 [
  "destructor",
  "What runs when a thing goes away. In English++: dds."
 ],
 [
  "enum",
  "A list of choices. In English++: den."
 ],
 [
  "exception",
  "A problem that jumps to a catch. In English++: etw throws it, bch catches it."
 ],
 [
  "field",
  "Something a thing has. In English++: dfd."
 ],
 [
  "float",
  "A number with a point in it. In English++: dec, or flo for a small one."
 ],
 [
  "function",
  "A little machine with a name. In English++: dfn."
 ],
 [
  "generator",
  "A function that hands out one value at a time, only as far as it's asked. In English++: gnr@num and eyd."
 ],
 [
  "global",
  "A box that every function can see. In English++: mgl."
 ],
 [
  "hash",
  "A fingerprint of some text: the same text always gives the same one. In English++: xha."
 ],
 [
  "header",
  "A C++ file that says what's in another file. In English++: xic."
 ],
 [
  "IDE",
  "A program for writing programs — for English++, that's the Studio."
 ],
 [
  "inheritance",
  "A child getting what its parent has. In English++: Dog dcl Animal."
 ],
 [
  "integer",
  "A whole number. In English++: num."
 ],
 [
  "IntelliSense",
  "The Studio guessing what you will type next. Tab takes the guess."
 ],
 [
  "JSON",
  "Text that programs use to pass lists and maps to each other. In English++: tjs and jsn."
 ],
 [
  "kind",
  "What sort of thing a box holds: a number, a decimal, a text, a letter, a yes or no."
 ],
 [
  "lambda",
  "A function kept in a name. In English++: dlm."
 ],
 [
  "library",
  "A bag of functions somebody else wrote, like raylib or Qt. In English++: xlb."
 ],
 [
  "loop",
  "Doing something again and again. In English++: flt, fea, wlt and friends."
 ],
 [
  "map",
  "Finding a value by its key. In English++: map@txt@num."
 ],
 [
  "memory",
  "Where the computer keeps your boxes while it runs."
 ],
 [
  "method",
  "A function inside a class. In English++: dfn, inside a class."
 ],
 [
  "mutex",
  "A lock that lets one thread in at a time."
 ],
 [
  "namespace",
  "A group of names. In English++: dgr."
 ],
 [
  "now",
  "The English++ word that fills a spot with nothing to say, as in now wfv now."
 ],
 [
  "null",
  "Nothing, for a pointer. In English++: nil."
 ],
 [
  "object",
  "One thing made from a class. In English++: rex mak Dog."
 ],
 [
  "operator",
  "A mark that does something, like +. In English++, define your own with dop."
 ],
 [
  "optimizer",
  "A program that makes other programs faster. In the Studio, that is Turbo."
 ],
 [
  "override",
  "A child's own version of a function. In English++: dov."
 ],
 [
  "parameter",
  "A box that a function fills from what it's given. In English++: dpm."
 ],
 [
  "pointer",
  "A box that holds the place of another box. In English++: mpt."
 ],
 [
  "polymorphism",
  "Each kind of thing doing a job its own way. In English++: dvr and dov."
 ],
 [
  "port",
  "A numbered door on a computer that a server listens at. In English++: srv&8080."
 ],
 [
  "private",
  "Can only be used inside the class. In English++: dsc and dhd."
 ],
 [
  "program",
  "A list of things for a computer to do."
 ],
 [
  "recursion",
  "A function that runs itself."
 ],
 [
  "reference",
  "Another name for the same box. In English++: mrf."
 ],
 [
  "regular expression",
  "A pattern for finding text. In English++: tmt, tma and trx."
 ],
 [
  "return",
  "Give an answer and leave the function. In English++: ert."
 ],
 [
  "root",
  "The middle word of every English++ line — what happens. Its first letter is the family, the other two are the job."
 ],
 [
  "run",
  "Make the computer do what a program says. In the Studio: F5."
 ],
 [
  "server",
  "A program that waits for others to connect. In English++: srv."
 ],
 [
  "socket",
  "One end of a connection between programs. In English++: sck."
 ],
 [
  "statement",
  "One line of a program."
 ],
 [
  "string",
  "Text. In English++: txt."
 ],
 [
  "struct",
  "A simple class. In English++: dst."
 ],
 [
  "template",
  "A kind that gets filled in later. In English++: dtp."
 ],
 [
  "thread",
  "A part of a program that runs at the same time. In English++: mtd."
 ],
 [
  "type",
  "The kind of a value. In English++: num, txt, and so on."
 ],
 [
  "variable",
  "A box with a name that holds one thing. In English++: is or mak."
 ],
 [
  "vector",
  "A list that can grow. In English++: vec."
 ]
];

  var field = [
 {
  "name": "a — arithmetic",
  "head": "add asb aml adv amd apw",
  "what": "Changes a thing in place: add, subtract, multiply, divide, remainder, power.",
  "ex": "score add 10"
 },
 {
  "name": "b — block",
  "head": "btr bch bdo bsw bcs bdf",
  "what": "Opens a block that is not a loop or an if: try, catch, do, switch, case, default.",
  "ex": "now btr now"
 },
 {
  "name": "c — collection",
  "head": "cct csm cmx cmn cav chs",
  "what": "Asks about a collection: count, sum, biggest, smallest, average, has.",
  "ex": "out prn csm&scores"
 },
 {
  "name": "d — define",
  "head": "dfn dpm dcl dfd dmk den",
  "what": "Gives a new thing its name: function, parameter, class, field, make, enum.",
  "ex": "add_up dfn num"
 },
 {
  "name": "e — exit",
  "head": "ert ebk enx etw ext",
  "what": "Leaves or ends something: return, break, next, throw, exit.",
  "ex": "add_up ert a+b"
 },
 {
  "name": "f — for",
  "head": "flt fle fgt fge fea",
  "what": "Repeats, counting or walking through a collection.",
  "ex": "n fea scores"
 },
 {
  "name": "g — get",
  "head": "get gln",
  "what": "Asks the person for an answer: get reads one word, gln reads a whole line.",
  "ex": "name get \"What is your name? \""
 },
 {
  "name": "h — hard drive",
  "head": "hwr hap hrd hln hex",
  "what": "Works with files and folders: write, append, read, lines, exists.",
  "ex": "\"a.txt\" hap \"more\""
 },
 {
  "name": "i — if",
  "head": "ieq ine ilt ile igt ige",
  "what": "Runs the moved-in lines when the test passes.",
  "ex": "x igt 3"
 },
 {
  "name": "k — clock",
  "head": "kel kda ktm kms kse kwk",
  "what": "Reads the clock and the calendar: the time, the date, how long something took.",
  "ex": "start is kms"
 },
 {
  "name": "l — list",
  "head": "lrm lin lso lrv lsu lwp",
  "what": "Changes a collection: remove, insert, sort, reverse, shuffle, wipe.",
  "ex": "scores lso now"
 },
 {
  "name": "m — make",
  "head": "mak mkn mgl mpt mrf mnw",
  "what": "Makes a new variable: a box, a constant, a global, a pointer, a reference, a new thing.",
  "ex": "rex mak Dog"
 },
 {
  "name": "n — number",
  "head": "nsq nab nro nra nmx",
  "what": "Works out a number: square root, absolute value, rounded, random, biggest.",
  "ex": "roll is nra&1&6"
 },
 {
  "name": "o — otherwise",
  "head": "oeq one olt ogt oth",
  "what": "Tries again after an if; oth catches all the other times.",
  "ex": "now oth now"
 },
 {
  "name": "p — put",
  "head": "prn put",
  "what": "Writes something out. prn prints and goes to the next line. put prints and stays on the same line.",
  "ex": "out put \"one \""
 },
 {
  "name": "r — run",
  "head": "rcm rwt rjn rdt rsd",
  "what": "Reaches outside your program: run a command, wait a moment, or join a thread.",
  "ex": "now rcm \"echo Hello from Windows\""
 },
 {
  "name": "s — should",
  "head": "seq sge sgt sle slt sne",
  "what": "Checks that should hold: a test that stops the program if it is wrong.",
  "ex": "x sgt 3"
 },
 {
  "name": "t — text",
  "head": "tsz tuc tlc trp tsp ths",
  "what": "Works with text: size, uppercase, lowercase, replace, split, has.",
  "ex": "big is tuc&name"
 },
 {
  "name": "u — until",
  "head": "ueq uge ugt ule ult une",
  "what": "Repeats until a test says yes: the other half of a loop.",
  "ex": "n uge 6"
 },
 {
  "name": "w — while",
  "head": "weq wne wlt wgt wfv",
  "what": "Repeats the moved-in lines while the test passes — or forever.",
  "ex": "lives wgt 0"
 },
 {
  "name": "x — external",
  "head": "xic xlb xim xpp",
  "what": "Reaches C++ and the world outside: include, library, import, C++ here.",
  "ex": "now xlb raylib"
 }
];

  var cheats = [
 {
  "title": "The Three Spots Card",
  "body": "Every line is who, the root, and what. Nothing to say? Write now.",
  "code": "note Who Root What: three words on every line\nx is 6\nnow wfv now\nc is a+b*2\nout prn \"Hi @name\""
 },
 {
  "title": "Making and Changing Card",
  "body": "Boxes, constants, and changing them in place.",
  "code": "x is 6\nx mak num\nv mak vec@num\nLIMIT mkn 100\nx add 1\nx asb 1\nx aml 2\nx adv 2"
 },
 {
  "title": "Printing and Asking Card",
  "body": "prn prints and goes to the next line, put stays on this line, get asks and keeps the answer.",
  "code": "out prn x\nout put x\nname get \"Name? \""
 },
 {
  "title": "Choosing Card",
  "body": "If, otherwise-if, otherwise — the lines moved in are the block.",
  "code": "x ieq 3\n  out prn \"three\"\nx olt 3\n  out prn \"small\"\nnow oth now\n  out prn \"big\""
 },
 {
  "title": "Repeating Card",
  "body": "Count with i (0 to 9), walk each x in v, repeat while x is less than 10, loop forever, break out, or skip to the next turn.",
  "code": "i flt 10\nx fea v\nx wlt 10\nnow wfv now\nnow ebk now\nnow enx now"
 },
 {
  "title": "Lists Card",
  "body": "The moves a list is asked for every day.",
  "code": "v is 1&2&3\nout prn v@0\nv add 4\nv lrm 4\nv lso now\nout prn cct&v"
 },
 {
  "title": "Functions and Classes Card",
  "body": "Your own words and your own kinds of things.",
  "code": "add_up dfn num\n  a dpm num\n  b dpm num\n  add_up ert a+b\ny is add_up&1&2\nDog dcl now\n  age dfd 3\nrex mak Dog\nout prn rex@age"
 }
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
{ name: "Rocket Countdown", about: "fgt counts down to blast off.",
      vars: [{ key: "rocket", val: 5, min: 1, max: 12 }],
      code: function (v) { return ["note Count down, then blast off!", "rocket is " + v.rocket, "rocket fgt 0", "  out prn rocket", "out prn \"Blast off!\""]; },
      run: function (v) { var o = []; for (var r = v.rocket; r > 0; r--) o.push(String(r)); o.push("Blast off!"); return o; },
      explain: "rocket fgt 0 counts down from rocket while it's greater than 0, so the line under it prints each number on the way." },
{ name: "Times Table", about: "fle counts from 1, and @ fills the answer into the text.",
      vars: [{ key: "table", val: 7, min: 2, max: 12 }, { key: "upto", val: 10, min: 1, max: 12 }],
      code: function (v) { return ["table is " + v.table, "upto is " + v.upto, "i is 1", "i fle upto", "  answer is i*table", "  out prn \"@i times @table is @answer\""]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(i + " times " + v.table + " is " + i * v.table); return o; },
      explain: "i is 1 makes the count start at 1, and fle keeps going while i is less than or equal to upto." },
{ name: "Hip Hip Hooray", about: "flt repeats a line as often as you say.",
      vars: [{ key: "cheers", val: 3, min: 1, max: 9 }],
      code: function (v) { return ["cheers is " + v.cheers, "i flt cheers", "  out prn \"Hip hip hooray!\"", "out prn \"Cheers given: @cheers\""]; },
      run: function (v) { var o = []; for (var i = 0; i < v.cheers; i++) o.push("Hip hip hooray!"); o.push("Cheers given: " + v.cheers); return o; },
      explain: "i flt cheers runs the line under it cheers times: i is 0, 1, 2 and so on, stopping before cheers." },
{ name: "Odd and Even Adder", about: "Show the evens, and add up the odds.",
      vars: [{ key: "top", val: 10, min: 1, max: 30 }],
      code: function (v) { return ["note Add up the odd numbers, and show the even ones.", "top is " + v.top, "total is 0", "i is 1", "i fle top", "  i%2 ieq 0", "    out prn i", "  now oth now", "    total add i", "out prn \"The odd numbers add up to @total\""]; },
      run: function (v) { var o = [], t = 0; for (var i = 1; i <= v.top; i++) { if (i % 2 === 0) o.push(String(i)); else t += i; } o.push("The odd numbers add up to " + t); return o; },
      explain: "i%2 is the remainder after dividing by 2: 0 for an even number, so ieq 0 picks the evens, and oth adds up the rest." },
{ name: "Coin Collector", about: "add found coins, then ask if there are enough for the sword.",
      vars: [{ key: "coins", val: 2, min: 0, max: 20 }, { key: "found", val: 3, min: 0, max: 20 }, { key: "goal", val: 10, min: 1, max: 30 }],
      code: function (v) { return ["coins is " + v.coins, "found is " + v.found, "goal is " + v.goal, "coins add found", "out prn \"You have @coins coins.\"", "coins ige goal", "  out prn \"You can buy the sword!\"", "now oth now", "  need is goal-coins", "  out prn \"You need @need more.\""]; },
      run: function (v) { var c = v.coins + v.found, o = ["You have " + c + " coins."]; o.push(c >= v.goal ? "You can buy the sword!" : "You need " + (v.goal - c) + " more."); return o; },
      explain: "coins add found changes coins in place. ige asks if coins is greater than or equal to goal; oth handles the other times." },
{ name: "Star Steps", about: "A staircase of stars, one more each row.",
      vars: [{ key: "rows", val: 4, min: 1, max: 9 }],
      code: function (v) { return ["rows is " + v.rows, "line is \"\"", "i flt rows", "  line add \"*\"", "  out prn line"]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.rows; i++) o.push(stars(i)); return o; },
      explain: "line add \"*\" adds a star to the end of the text each time round, so every row is one star longer than the last." },
{ name: "Grade Checker", about: "Otherwise-if lines try each grade in turn.",
      vars: [{ key: "score", val: 85, min: 0, max: 100 }],
      code: function (v) { return ["score is " + v.score, "score ige 90", "  out prn \"Grade: A\"", "score oge 80", "  out prn \"Grade: B\"", "score oge 70", "  out prn \"Grade: C\"", "now oth now", "  out prn \"Keep practicing!\""]; },
      run: function (v) { return [v.score >= 90 ? "Grade: A" : v.score >= 80 ? "Grade: B" : v.score >= 70 ? "Grade: C" : "Keep practicing!"]; },
      explain: "Only the first test that passes runs. oge is otherwise if greater or equal, so an 85 is a B and never reaches the C line." },
{ name: "Day Namer", about: "bsw sorts a day number into its case.",
      vars: [{ key: "day", val: 3, min: 1, max: 7 }],
      code: function (v) { return ["day is " + v.day, "day bsw now", "  now bcs 6&7", "    out prn \"Weekend: time to play!\"", "  now bcs 1", "    out prn \"Monday: a fresh start.\"", "  now bcs 5", "    out prn \"Friday: almost there!\"", "  now bdf now", "    out prn \"A school day.\""]; },
      run: function (v) { return [v.day >= 6 ? "Weekend: time to play!" : v.day === 1 ? "Monday: a fresh start." : v.day === 5 ? "Friday: almost there!" : "A school day."]; },
      explain: "bsw checks day against each bcs case; 6&7 covers both weekend days, and bdf catches every other day." },
{ name: "Fizz Buzz", about: "% finds the threes and fives.",
      vars: [{ key: "upto", val: 15, min: 1, max: 30 }],
      code: function (v) { return ["upto is " + v.upto, "i is 1", "i fle upto", "  i%15 ieq 0", "    out prn \"FizzBuzz\"", "  i%3 oeq 0", "    out prn \"Fizz\"", "  i%5 oeq 0", "    out prn \"Buzz\"", "  now oth now", "    out prn i"]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.upto; i++) o.push(i % 15 === 0 ? "FizzBuzz" : i % 3 === 0 ? "Fizz" : i % 5 === 0 ? "Buzz" : String(i)); return o; },
      explain: "i%15 is checked first, because a number divisible by 15 is divisible by 3 and 5 too." },
{ name: "Score Board", about: "Sort the scores, then show the best and the total.",
      vars: [{ key: "first", val: 12, min: 0, max: 99 }, { key: "second", val: 30, min: 0, max: 99 }, { key: "third", val: 7, min: 0, max: 99 }],
      code: function (v) { return ["first is " + v.first, "second is " + v.second, "third is " + v.third, "scores is first&second&third", "scores lso now", "score fea scores", "  out prn \"Score: @score\"", "best is cmx&scores", "total is csm&scores", "out prn \"Best: @best\"", "out prn \"Total: @total\""]; },
      run: function (v) { var s = [v.first, v.second, v.third].sort(function (a, b) { return a - b; }); var o = s.map(function (x) { return "Score: " + x; }); o.push("Best: " + s[2]); o.push("Total: " + (s[0] + s[1] + s[2])); return o; },
      explain: "lso sorts the list itself, fea walks it in order, and cmx and csm ask for the biggest and the sum." },
    { name: "Twice", about: "A lambda that gives back twice its number.",
      vars: [{ key: "number", val: 21, min: 1, max: 100 }],
      code: function (v) { return ["twice dlm num", "  n dpm num", "  twice ert n*2", "out prn twice&" + v.number]; },
      run: function (v) { return [String(v.number * 2)]; },
      explain: "twice is a lambda: a function kept in a name. twice&21 hands 21 to it and gives back 42." },
{ name: "Greeter", about: "A function that takes a text and a number.",
      vars: [{ key: "hellos", val: 2, min: 1, max: 6 }],
      code: function (v) { return ["hellos is " + v.hellos, "now greet \"Mia\"&hellos", "now greet \"Sam\"&1", "", "greet dfn now", "  who dpm txt", "  times dpm num", "  i flt times", "    out prn \"Hello, @who\""]; },
      run: function (v) { var o = []; for (var i = 0; i < v.hellos; i++) o.push("Hello, Mia"); o.push("Hello, Sam"); return o; },
      explain: "greet gives back nothing, so it runs on a line of its own: now greet, then its two values joined with &." },
{ name: "Stack of Plates", about: "A stack gives back the last plate put on first.",
      vars: [{ key: "plates", val: 3, min: 1, max: 8 }],
      code: function (v) { return ["pile mak stk@num", "plates is " + v.plates, "i is 1", "i fle plates", "  pile add i", "  out prn \"Put plate @i on top.\"", "left is cct&pile", "left wgt 0", "  top is pile@top", "  out prn \"Took plate @top off the top.\"", "  pile lpl now", "  left is cct&pile"]; },
      run: function (v) { var o = [], i; for (i = 1; i <= v.plates; i++) o.push("Put plate " + i + " on top."); for (i = v.plates; i >= 1; i--) o.push("Took plate " + i + " off the top."); return o; },
      explain: "pile@top is the last plate put on, and lpl takes it off. left counts the plates still on the pile, and the loop runs while there are any." },
{ name: "Shop Queue", about: "A queue serves people in the order they arrived.",
      vars: [{ key: "people", val: 4, min: 1, max: 9 }],
      code: function (v) { return ["line mak que@num", "people is " + v.people, "i is 1", "i fle people", "  line add i", "left is cct&line", "left wgt 0", "  next is line@front", "  out prn \"Now serving number @next\"", "  line lpl now", "  left is cct&line", "out prn \"The shop is empty.\""]; },
      run: function (v) { var o = []; for (var i = 1; i <= v.people; i++) o.push("Now serving number " + i); o.push("The shop is empty."); return o; },
      explain: "line@front is the first person in, and lpl serves them. left counts who is still waiting, and the loop runs while anyone is." },
    { name: "Finding by Halves", about: "cbf finds by halves: is it there, and where?",
      vars: [{ key: "find", val: 6, min: 1, max: 10 }],
      code: function (v) { return ["find is " + v.find, "sorted is 2&4&6&8&10", "out prn cbf&sorted&find", "out prn cbf&sorted&7", "out prn cpb&sorted&6"]; },
      run: function (v) { var s = [2, 4, 6, 8, 10]; var has = s.indexOf(v.find) >= 0; return [has ? "yes" : "nay", "nay", "2"]; },
      explain: "cbf looks for a value by halves, so it is fast even in a long list. cpb tells where it sits: 6 is the third item, at position 2." },
{ name: "Doubling Belt", about: "A walk with fea changes every item where it stands.",
      vars: [{ key: "base", val: 4, min: 1, max: 20 }],
      code: function (v) { return ["base is " + v.base, "scores is base&base+1&base+2", "s fea scores", "  s aml 2", "score fea scores", "  out prn score"]; },
      run: function (v) { return [v.base * 2, (v.base + 1) * 2, (v.base + 2) * 2].map(String); },
      explain: "Changing s inside s fea scores changes the item in the list, so every score is doubled where it stands." },
    { name: "Big Scores", about: "cft keeps only the scores a yes-or-no function likes.",
      vars: [{ key: "limit", val: 2, min: 0, max: 10 }],
      code: function (v) { return ["v is 1&5&2&8", "big dlm yno", "  n dpm num", "  big ert n>" + v.limit, "out prn cft&v&big"]; },
      run: function (v) { var big = [1, 5, 2, 8].filter(function (x) { return x > v.limit; }); return ["[" + big.join(", ") + "]"]; },
      explain: "big is a lambda that answers yes when a number is bigger than the limit. cft keeps the ones it likes: with a limit of 2, that's 5 and 8." },
{ name: "Temperature Changer", about: "A decimal keeps the part after the point.",
      vars: [{ key: "celsius", val: 21, min: -20, max: 100 }],
      code: function (v) { return ["celsius is " + v.celsius, "fahrenheit is celsius*1.8+32", "out prn \"@celsius degrees Celsius is @fahrenheit degrees Fahrenheit.\"", "fahrenheit igt 86", "  out prn \"Hot! Drink some water.\"", "fahrenheit ilt 32", "  out prn \"Freezing! Wear a hat.\""]; },
      run: function (v) { var f = v.celsius * 1.8 + 32, o = [v.celsius + " degrees Celsius is " + g6(f) + " degrees Fahrenheit."]; if (f > 86) o.push("Hot! Drink some water."); if (f < 32) o.push("Freezing! Wear a hat."); return o; },
      explain: "1.8 has a point, so the math gives a decimal, and fahrenheit keeps answers like 69.8." },
{ name: "Birthday Map", about: "A map looks ages up by name.",
      vars: [{ key: "bob", val: 9, min: 1, max: 15 }],
      code: function (v) { return ["bob is " + v.bob, "ages mak map@txt@num", "ages@\"bob\" is bob", "ages@\"amy\" is 7", "ages@\"zoe\" is 8", "b is ages@\"bob\"", "out prn \"Bob is @b\"", "chs&ages&\"zoe\" ieq yes", "  z is ages@\"zoe\"", "  out prn \"Zoe is here too, and she is @z\"", "ages@\"bob\" add 1", "b is ages@\"bob\"", "out prn \"After his birthday, Bob is @b\"", "all is 0", "k&v fea ages", "  all add v", "out prn \"All together they are @all\""]; },
      run: function (v) { return ["Bob is " + v.bob, "Zoe is here too, and she is 8", "After his birthday, Bob is " + (v.bob + 1), "All together they are " + (v.bob + 1 + 7 + 8)]; },
      explain: "ages@\"bob\" reaches Bob's age by his name, and ages@\"bob\" add 1 changes the age kept under that name." },
{ name: "Word Echo", about: "Text roots: tuc, tsz, and + to join.",
      vars: [{ key: "echoes", val: 3, min: 1, max: 6 }],
      code: function (v) { return ["word is \"hello\"", "echoes is " + v.echoes, "out prn tuc&word", "size is tsz&word", "out prn \"It has @size letters.\"", "i flt echoes", "  out prn word+\"!\""]; },
      run: function (v) { var o = ["HELLO", "It has 5 letters."]; for (var i = 0; i < v.echoes; i++) o.push("hello!"); return o; },
      explain: "tuc&word gives back HELLO, tsz&word is 5, and + joins the word and the !." },
    { name: "Guess the Number", about: "The book's game: guess the secret number, and the computer says too low or too high.",
      vars: [{ key: "secret", val: 42, min: 1, max: 100 }, { key: "guess1", val: 50, min: 1, max: 100 }, { key: "guess2", val: 25, min: 1, max: 100 }, { key: "guess3", val: 42, min: 1, max: 100 }],
      code: function (v) { return ["secret is " + v.secret, "tries is 0", "guess mak num", "guesses is " + v.guess1 + "&" + v.guess2 + "&" + v.guess3, "g fea guesses", "  guess is g", "  tries add 1", "  guess ilt secret", "    out prn \"Too low\"", "  guess ogt secret", "    out prn \"Too high\"", "  now oth now", "    out prn \"Right, in @tries tries!\"", "    now ebk now"]; },
      run: function (v) { var o = [], tries = 0, gs = [v.guess1, v.guess2, v.guess3]; for (var i = 0; i < gs.length; i++) { tries++; if (gs[i] < v.secret) o.push("Too low"); else if (gs[i] > v.secret) o.push("Too high"); else { o.push("Right, in " + tries + " tries!"); break; } } return o; },
      explain: "The book asks for guesses with get; here the three guesses are boxes, and fea walks them one at a time. ebk stops the walk as soon as a guess is right." },
    { name: "Pet Shop", about: "The book's pet shop: look after the pets for a few days, and they tell you when they're hungry.",
      vars: [{ key: "days", val: 4, min: 1, max: 7 }, { key: "meal", val: 6, min: 1, max: 10 }],
      code: function (v) { return ["note A little pet shop", "days is " + v.days, "meal mgl " + v.meal, "shop mak vec@own@Pet", "d mwn Dog&\"Rex\"", "shop add d", "c mwn Cat&\"Tom\"", "shop add c", "day flt days", "  today is day+1", "  out prn \"Day @today\"", "  p fea shop", "    p wait now", "    now look_after p", "out prn \"The shop is closed.\"", "", "look_after dfn now", "  pet dpm see@own@Pet", "  name is pet@name", "  hunger is pet@hunger", "  hunger ige 6", "    sound is pet@sound", "    out prn \"  @name says @sound, and gets fed.\"", "    pet feed meal", "  now oth now", "    out prn \"  @name is fine, with hunger @hunger.\"", "", "Pet dcl now", "  name dfd txt", "  hunger dfd 0", "  Pet dmk now", "    n dpm txt", "    name is n", "  wait dfn now", "    hunger add 2", "  feed dfn now", "    food dpm num", "    hunger is nmx&hunger-food&0", "  sound dmb txt", "", "Dog dcl Pet", "  Dog dmk now", "    n dpm txt", "    now dbs n", "  sound dov txt", "    sound ert \"Woof\"", "", "Cat dcl Pet", "  Cat dmk now", "    n dpm txt", "    now dbs n", "  sound dov txt", "    sound ert \"Meow\""]; },
      run: function (v) { var o = []; var pets = [{ name: "Rex", sound: "Woof", hunger: 0 }, { name: "Tom", sound: "Meow", hunger: 0 }]; for (var day = 0; day < v.days; day++) { o.push("Day " + (day + 1)); for (var k = 0; k < pets.length; k++) { var p = pets[k]; p.hunger += 2; if (p.hunger >= 6) { o.push("  " + p.name + " says " + p.sound + ", and gets fed."); p.hunger = Math.max(p.hunger - v.meal, 0); } else { o.push("  " + p.name + " is fine, with hunger " + p.hunger + "."); } } } o.push("The shop is closed."); return o; },
      explain: "Each pet's hunger grows by 2 a day. At 6 or more it says its sound and gets fed, and the meal takes the hunger back down. The book writes day fle 3, which also runs four days." },
    { name: "Shopping List", about: "The book's list that remembers: add things, save them to a file, and read them back.",
      vars: [{ key: "count", val: 2, min: 0, max: 3 }, { key: "drop", label: "drop milk (0=no, 1=yes)", val: 1, min: 0, max: 1 }],
      code: function (v) { var lines = ["note A shopping list that remembers.", "LIST_FILE mgl \"shopping.txt\"", "items is load&"]; var all = ["milk", "bread", "eggs"]; for (var i = 0; i < v.count; i++) lines.push("items add \"" + all[i] + "\""); lines.push("now save items", "now show items"); if (v.drop && v.count > 0) lines.push("items lrm \"milk\"", "now save items", "now show items"); lines.push("out prn \"Bye!\"", "LIST_FILE hrm now", "", "load dfn vec@txt", "  hex&LIST_FILE ieq nay", "    load ert vec@txt&", "  load ert hln&LIST_FILE", "", "save dfn now", "  list dpm see@vec@txt", "  text is ctx&list&\"\\n\"", "  LIST_FILE hwr text+\"\\n\"", "", "show dfn now", "  list dpm see@vec@txt", "  cct&list ieq 0", "    out prn \"The list is empty.\"", "    show ert now", "  i flt cct&list", "    number is i+1", "    out prn \"@number. @list@i\""); return lines; },
      run: function (v) { var o = []; var all = ["milk", "bread", "eggs"]; var items = []; for (var i = 0; i < v.count; i++) items.push(all[i]); var show = function () { if (items.length === 0) o.push("The list is empty."); else for (var j = 0; j < items.length; j++) o.push((j + 1) + ". " + items[j]); }; show(); if (v.drop && items.length > 0) { var k = items.indexOf("milk"); if (k >= 0) items.splice(k, 1); show(); } o.push("Bye!"); return o; },
      explain: "The list lives in a file, so it remembers. load reads it back, save writes it, and show prints it numbered. The file itself is only a simulation here — the Studio writes a real one." }
];

  var vt = [
 {
  "line": "out prn \"{w}\"",
  "why": "out prn prints a text and goes to the next line."
 },
 {
  "line": "out prn {v}",
  "why": "prn prints a name's value, with no quote marks."
 },
 {
  "line": "out put \"{w} \"",
  "why": "put prints and stays on the same line."
 },
 {
  "line": "out prn \"{w} @{v}\"",
  "why": "@ inside a text fills in a name's value."
 },
 {
  "line": "out prn {v}&{u}",
  "why": "& joins values, and prn prints them with a space between."
 },
 {
  "line": "{v} is {n}",
  "why": "is gives a name a value; a whole number here."
 },
 {
  "line": "{v} is {dec}",
  "why": "A number with a point is a decimal."
 },
 {
  "line": "{sv} is \"{w}\"",
  "why": "Words in quote marks are a text."
 },
 {
  "line": "{v} is '{L}'",
  "why": "One letter in single quote marks is a letter."
 },
 {
  "line": "{v} is {b}",
  "why": "A yes or no holds yes or nay."
 },
 {
  "line": "{v} mak num",
  "why": "mak makes an empty whole number, starting at 0."
 },
 {
  "line": "{sv} mak txt",
  "why": "mak txt makes an empty text."
 },
 {
  "line": "{v} mak dec",
  "why": "dec is the kind for decimals."
 },
 {
  "line": "{v} mak big",
  "why": "big is a big whole number, past two billion."
 },
 {
  "line": "{v} mkn {n}",
  "why": "mkn makes a constant that can never change."
 },
 {
  "line": "{v} add {n}",
  "why": "add adds to what's already in the box."
 },
 {
  "line": "{v} asb {d}",
  "why": "asb subtracts in place."
 },
 {
  "line": "{v} aml {d}",
  "why": "aml multiplies in place."
 },
 {
  "line": "{v} adv {d}",
  "why": "adv divides in place; whole numbers stay whole."
 },
 {
  "line": "{v} amd {d}",
  "why": "amd keeps the remainder."
 },
 {
  "line": "{v} is {u}+{n}",
  "why": "Math goes in one word, with no spaces."
 },
 {
  "line": "{v} is {u}*{d}",
  "why": "* multiplies, and comes before + and -."
 },
 {
  "line": "{v} is {u}%{d}",
  "why": "% is the remainder as a value."
 },
 {
  "line": "{v} is nsq&{n}",
  "why": "nsq gives the square root; & hands it the value."
 },
 {
  "line": "{v} is nra&1&{n}",
  "why": "nra gives a random whole number between two values."
 },
 {
  "line": "{sv} is tuc&{sv}",
  "why": "tuc gives back a text in uppercase."
 },
 {
  "line": "{v} is tsz&{sv}",
  "why": "tsz is how many letters a text has."
 },
 {
  "line": "{sv} is {sv}+\"{w}\"",
  "why": "+ joins two texts."
 },
 {
  "line": "ok is ths&{sv}&\"{w}\"",
  "why": "ths asks if a text has another text inside it."
 },
 {
  "line": "{sv} is tcu&{sv}&0&{d}",
  "why": "tcu cuts out part of a text, from a position."
 },
 {
  "line": "ok is {v}>{n}",
  "why": "A comparison gives back yes or nay."
 },
 {
  "line": "ok is {v}=={n}",
  "why": "== asks if two values are equal."
 },
 {
  "line": "both is {v}>0&&{u}>0",
  "why": "&& is yes only when both sides are yes."
 },
 {
  "line": "ok is {v}!={n}",
  "why": "!= asks if two values are different."
 },
 {
  "line": "ok is {v}<={u}",
  "why": "<= is less than or equal."
 },
 {
  "line": "{v} ilt {n}",
  "why": "ilt: if less than, do the lines moved in under it."
 },
 {
  "line": "{v} igt {u}",
  "why": "igt: if greater than."
 },
 {
  "line": "{v} ieq {n}",
  "why": "ieq: if equal."
 },
 {
  "line": "{v} olt {n}",
  "why": "olt: otherwise, if less than — right after an if."
 },
 {
  "line": "now oth now",
  "why": "oth runs all the other times."
 },
 {
  "line": "{v} bsw now",
  "why": "bsw checks one value against many cases."
 },
 {
  "line": "now bcs {n}",
  "why": "bcs is one case of a switch."
 },
 {
  "line": "now bcs {n}&{n2}",
  "why": "& lets one case match two values."
 },
 {
  "line": "now bdf now",
  "why": "bdf runs when no case matched."
 },
 {
  "line": "{v} ine {n}",
  "why": "ine: if not equal."
 },
 {
  "line": "i flt {n}",
  "why": "flt counts with i from 0 while it's less than the limit."
 },
 {
  "line": "{v} fle {n}",
  "why": "fle counts while less than or equal."
 },
 {
  "line": "{v} fgt 0",
  "why": "fgt counts down while greater than 0."
 },
 {
  "line": "i flt cct&{arr}",
  "why": "Count every position of a list."
 },
 {
  "line": "now ebk {v}=={n}",
  "why": "ebk with a test leaves the loop when it's yes."
 },
 {
  "line": "{v} wlt {n}",
  "why": "wlt repeats while less than."
 },
 {
  "line": "{v} wgt 0",
  "why": "wgt repeats while greater than."
 },
 {
  "line": "now wfv now",
  "why": "wfv repeats forever, until something breaks out."
 },
 {
  "line": "now enx {v}<{n}",
  "why": "enx skips to the next turn when the test is yes."
 },
 {
  "line": "{v} uge {n}",
  "why": "After a bdo block: go again until greater or equal."
 },
 {
  "line": "{arr} is {n}&{n2}&{n3}",
  "why": "& makes a list of values."
 },
 {
  "line": "{arr} add {n}",
  "why": "add puts an item on the end of a list."
 },
 {
  "line": "out prn {arr}@0",
  "why": "@0 is the first item: positions start at 0."
 },
 {
  "line": "{arr}@{d} is {n}",
  "why": "A position in the who spot changes that item."
 },
 {
  "line": "{arr} lrm {n}",
  "why": "lrm removes every item equal to a value."
 },
 {
  "line": "{arr} lso now",
  "why": "lso sorts the list itself."
 },
 {
  "line": "{v} fea {arr}",
  "why": "fea walks through every item of a list."
 },
 {
  "line": "{v} is cct&{arr}",
  "why": "cct is how many items there are."
 },
 {
  "line": "{v} is csm&{arr}",
  "why": "csm adds up every item."
 },
 {
  "line": "{v} is cmx&{arr}",
  "why": "cmx is the biggest item."
 },
 {
  "line": "ok is chs&{arr}&{n}",
  "why": "chs asks if a value is in the collection."
 },
 {
  "line": "{m} mak map@txt@num",
  "why": "A map from texts to numbers."
 },
 {
  "line": "{m}@\"{w}\" is {n}",
  "why": "@ with a key files a value in a map."
 },
 {
  "line": "k&v fea {m}",
  "why": "A walk through a map names the key and the value."
 },
 {
  "line": "{arr} mak set@num",
  "why": "A set keeps each value once, in order."
 },
 {
  "line": "{f} dfn num",
  "why": "dfn defines a function that gives back a number."
 },
 {
  "line": "{v} dpm num",
  "why": "dpm is a value the function takes."
 },
 {
  "line": "{f} ert {v}*{d}",
  "why": "ert hands the answer back."
 },
 {
  "line": "{v} is {f}&{n}",
  "why": "& runs a function with a value."
 },
 {
  "line": "now {f} {n}",
  "why": "A function that gives back nothing runs on its own line."
 },
 {
  "line": "{c} dcl now",
  "why": "dcl defines your own kind of thing."
 },
 {
  "line": "{v} dfd {n}",
  "why": "dfd is a field: something each one has."
 },
 {
  "line": "{o} mak {c}",
  "why": "mak with a class makes one thing of that kind."
 },
 {
  "line": "out prn {o}@{v}",
  "why": "@ reaches a field inside a thing."
 },
 {
  "line": "{o} {f} now",
  "why": "A thing's name, then what it can do."
 },
 {
  "line": "{c} dcl {k}",
  "why": "A parent's name in the last spot makes a child class."
 },
 {
  "line": "{c} dmk now",
  "why": "dmk runs when one is made."
 },
 {
  "line": "now btr now",
  "why": "btr tries the lines moved in under it."
 },
 {
  "line": "e bch now",
  "why": "bch catches the problem, straight after the try."
 },
 {
  "line": "now etw \"{w} went wrong\"",
  "why": "etw throws a problem of your own."
 },
 {
  "line": "{v} seq {n}",
  "why": "seq: it should be equal, or the program stops."
 },
 {
  "line": "{v} sgt 0",
  "why": "sgt: it should be greater."
 },
 {
  "line": "{sv} get \"{w}? \"",
  "why": "get asks a question and keeps the answer."
 },
 {
  "line": "\"{sv}.txt\" hwr \"{w}\"",
  "why": "hwr writes a whole file: name first, text last."
 },
 {
  "line": "\"{sv}.txt\" hap \"{w}\"",
  "why": "hap adds to the end of a file."
 },
 {
  "line": "{sv} is hrd&\"{sv}.txt\"",
  "why": "hrd reads a whole file."
 },
 {
  "line": "now rwt {n}0",
  "why": "rwt waits, in milliseconds."
 },
 {
  "line": "t mtd {f}&{n}",
  "why": "mtd starts a function as a thread."
 },
 {
  "line": "t rjn now",
  "why": "rjn waits for a thread to finish."
 },
 {
  "line": "p mpt {v}",
  "why": "mpt makes a pointer to a box."
 },
 {
  "line": "{sv} is tre&\"{w}\"&{d}",
  "why": "tre repeats a text."
 },
 {
  "line": "{v} is tct&{sv}&\"{w}\"",
  "why": "tct counts how many times a piece is in a text."
 },
 {
  "line": "out prn tfa&\"{} has {}\"&{sv}&{v}",
  "why": "tfa fills each {} in a pattern with a value."
 },
 {
  "line": "ok is cea&{arr}&{f}",
  "why": "cea asks if each item passes a function."
 },
 {
  "line": "ok is can&{arr}&{f}",
  "why": "can asks if any item passes."
 },
 {
  "line": "{arr} is crg&0&{n}&{d}",
  "why": "crg makes a list by counting, with a step."
 },
 {
  "line": "{v} is crl&{arr}&0&{f}",
  "why": "crl rolls a list up into one value with a function."
 },
 {
  "line": "{arr} lrw {d}",
  "why": "lrw rotates a list: the first items go round to the end."
 },
 {
  "line": "{v} msv 0",
  "why": "msv makes a name that stays between calls."
 },
 {
  "line": "now bdr now",
  "why": "bdr runs its lines when the block around it ends."
 },
 {
  "line": "{v} is nnd&{u}&{d}",
  "why": "nnd gives the bits that are on in both numbers."
 },
 {
  "line": "{v} is nsl&{u}&{d}",
  "why": "nsl shifts a number's bits to the left."
 },
 {
  "line": "{v} mak hug",
  "why": "hug is a whole number of any size."
 },
 {
  "line": "{v} is xha&{sv}",
  "why": "xha gives a text its SHA-256 fingerprint."
 },
 {
  "line": "{sv} is xbe&{sv}",
  "why": "xbe turns text into base 64."
 },
 {
  "line": "c add {n}",
  "why": "add on a channel sends a value to another thread."
 }
];

  var themes = [
    { name: "Print & Talk", t: [0, 1, 2, 3, 4] },
    { name: "Names & Kinds", t: [5, 6, 7, 8, 9] },
    { name: "Making Boxes", t: [10, 11, 12, 13, 14, 107] },
    { name: "Changing in Place", t: [15, 16, 17, 18, 19] },
    { name: "Math in One Word", t: [20, 21, 22, 23, 24, 105, 106] },
    { name: "Text", t: [25, 26, 27, 28, 29, 95, 96, 97] },
    { name: "Yes, Nay & Tests", t: [30, 31, 32, 33, 34] },
    { name: "If & Otherwise", t: [35, 36, 37, 38, 39] },
    { name: "Switch", t: [40, 41, 42, 43, 44] },
    { name: "Counting Loops", t: [45, 46, 47, 48, 49] },
    { name: "While & Until", t: [50, 51, 52, 53, 54] },
    { name: "Lists", t: [55, 56, 57, 58, 59] },
    { name: "Changing Lists", t: [60, 61, 56, 59, 58, 102, 100] },
    { name: "Asking a List", t: [62, 63, 64, 65, 57, 98, 99, 101] },
    { name: "Maps & Sets", t: [66, 67, 68, 69, 65] },
    { name: "Functions", t: [70, 71, 72, 73, 74, 103, 104] },
    { name: "Your Own Kinds", t: [75, 76, 77, 78, 79] },
    { name: "Children & Makers", t: [80, 81, 76, 77, 79] },
    { name: "Problems & Checks", t: [82, 83, 84, 85, 86] },
    { name: "Files, Clock & Threads", t: [87, 88, 89, 90, 91, 92, 93, 94, 108, 109, 110] }
  ];
  // English++ banks: no name that's also an English++ word (note, box, push, spin …).
  var FUNCS = ["cheer", "heal", "jump", "dance", "sing", "build", "dash", "shine", "spin", "lift", "launch", "glide", "wave", "hover", "mend", "craft", "boost", "greet", "explore", "charge", "roar", "wiggle", "swim", "bounce", "juggle", "wobble"];
  var TEXTS = ["name", "hero", "title", "word", "song", "city", "team", "pet", "ship", "book", "label", "tag", "poem", "story", "quest", "badge", "motto", "riddle", "charm", "wish"];
  var THINGS = ["gem", "hero", "bot", "pet", "ship", "star", "cube", "orb", "egg", "kite"];
  var KINDS = ["Player", "Robot", "Dragon", "Wizard", "Knight", "Rocket", "Castle", "Potion", "Shield", "Garden"];
  var BASES = ["Comet", "Falcon", "Turtle", "Beacon", "Puzzle", "Sailor", "Keeper", "Pirate", "Monster", "Unicorn"];
  var COLORS = ["red", "blue", "green", "gold", "purple", "white", "black", "pink", "orange", "cyan"];
  function pick(bank, r) { return bank[Math.floor(r() * bank.length)]; }

  /* The extras the English++ Library shows (js/epp-extras.js): the whole frozen Chart for the
     Root Finder (generated from ENGLISHPP_CHART.md), the full lesson for each chapter, and the
     mastery path. Lessons use the Book's own programs and the Studio's own messages, word for word. */
  var chart = {"rules":["A line is exactly three words: who, the root, and what. x is 6. Text in quotes is one word.","There are no control marks. Never { } ( ) , : ; [ ], and no . except inside a number like 2.5.","The lines under a block, indented, are its body. Going back out closes it.","Inside a word, @ reaches in and & gives values. rex@speed is a field, scores@0 a position, geo@area something in a group, and vec@num a kind. add&1&2 calls add with 1 and 2, and 1&2&3 is a list. A call's values run to the end of its word.","now fills a spot when there is nothing to say: now ebk now.","A word is three letters. The first says its family and the next two say which one: i is if and gt is greater than, so igt is if greater than. A pair of letters means one thing, everywhere: wgt is while greater than, lrm removes from a list and hrm from the hard drive.","is is the one short word: x is 6 makes x, and changes it after that.","Definitions can be in any order. The compiler writes the forward declarations and the order C++ needs.","Every line becomes straight C++, one for one. The C++ View shows it. A line that starts with note is a note."],"families":[{"letter":"a","name":"arithmetic","does":"changes a thing in place"},{"letter":"b","name":"block","does":"opens a block that is not a loop or an if"},{"letter":"c","name":"collection","does":"asks about a collection"},{"letter":"d","name":"define","does":"gives a new thing its name"},{"letter":"e","name":"exit","does":"leaves or ends something"},{"letter":"f","name":"for","does":"repeats, counting or walking through"},{"letter":"g","name":"get","does":"reads something in"},{"letter":"h","name":"hard drive","does":"works with files and folders"},{"letter":"i","name":"if","does":"runs the lines under it when the test passes"},{"letter":"k","name":"clock","does":"tells the date and the time"},{"letter":"l","name":"list","does":"changes a collection"},{"letter":"m","name":"make","does":"makes a new variable"},{"letter":"n","name":"number","does":"works out a number"},{"letter":"o","name":"otherwise","does":"tries again after an if"},{"letter":"p","name":"put","does":"writes something out"},{"letter":"r","name":"run","does":"runs threads and other programs"},{"letter":"s","name":"should","does":"checks something, and stops if it is wrong"},{"letter":"t","name":"text","does":"works with text"},{"letter":"u","name":"until","does":"ends a do block when the test passes"},{"letter":"w","name":"while","does":"repeats the lines under it while the test passes"},{"letter":"x","name":"external","does":"reaches C++ and the world outside the program"}],"pairs":[{"pair":"eq","says":"equal","cpp":"=="},{"pair":"ne","says":"not equal","cpp":"!="},{"pair":"lt","says":"less than","cpp":"<"},{"pair":"le","says":"less or equal","cpp":"<="},{"pair":"gt","says":"greater than","cpp":">"},{"pair":"ge","says":"greater or equal","cpp":">="}],"roots":[{"root":"add","fam":"a","says":"add","first":"a thing","third":"a value","ex":"score add 10","cpp":"x += v;   a list: v.push_back(x);","block":false},{"root":"asb","fam":"a","says":"subtract","first":"a thing","third":"a value","ex":"lives asb 1","cpp":"x -= v;","block":false},{"root":"aml","fam":"a","says":"multiply","first":"a thing","third":"a value","ex":"cost aml 2","cpp":"x *= v;","block":false},{"root":"adv","fam":"a","says":"divide","first":"a thing","third":"a value","ex":"cost adv 2","cpp":"x /= v;","block":false},{"root":"amd","fam":"a","says":"remainder","first":"a thing","third":"a value","ex":"n amd 10","cpp":"x %= v;","block":false},{"root":"apw","fam":"a","says":"power","first":"a thing","third":"a value","ex":"x apw 2","cpp":"x = std::pow(x, v);","block":false},{"root":"and","fam":"a","says":"bit and","first":"a thing","third":"a value","ex":"flags and 6","cpp":"x &= v;","block":false},{"root":"aor","fam":"a","says":"bit or","first":"a thing","third":"a value","ex":"flags aor 1","cpp":"x |= v;","block":false},{"root":"axr","fam":"a","says":"bit xor","first":"a thing","third":"a value","ex":"flags axr 3","cpp":"x ^= v;","block":false},{"root":"asl","fam":"a","says":"shift left","first":"a thing","third":"a value","ex":"bits asl 2","cpp":"x <<= v;","block":false},{"root":"asr","fam":"a","says":"shift right","first":"a thing","third":"a value","ex":"bits asr 1","cpp":"x >>= v;","block":false},{"root":"ant","fam":"a","says":"bit not","first":"a thing","third":"a value","ex":"bits ant mask","cpp":"x = ~v;","block":false},{"root":"btr","fam":"b","says":"try","first":"now","third":"now","ex":"now btr now","cpp":"try {","block":true},{"root":"bch","fam":"b","says":"catch","first":"a name, or now","third":"now, or a kind","ex":"e bch now","cpp":"} catch (const std::exception& e) {","block":true},{"root":"bdo","fam":"b","says":"do","first":"now","third":"now","ex":"now bdo now","cpp":"do {","block":true},{"root":"bsw","fam":"b","says":"switch","first":"a value","third":"now","ex":"day bsw now","cpp":"switch (x) {","block":true},{"root":"bcs","fam":"b","says":"case","first":"now","third":"a value, or values with &","ex":"now bcs 1","cpp":"case 1: {","block":true},{"root":"bdf","fam":"b","says":"default","first":"now","third":"now","ex":"now bdf now","cpp":"default: {","block":true},{"root":"blk","fam":"b","says":"lock","first":"a mutex","third":"now","ex":"guard blk now","cpp":"{ std::lock_guard<std::mutex> held(m);","block":true},{"root":"bbl","fam":"b","says":"scope","first":"now","third":"now","ex":"now bbl now","cpp":"{","block":true},{"root":"bdr","fam":"b","says":"when this block is over","first":"now","third":"now","ex":"now bdr now","cpp":"runs its lines when the block around it ends","block":true},{"root":"bts","fam":"b","says":"test","first":"now","third":"a text","ex":"now bts \"adding\"","cpp":"a test the program runs when asked","block":true},{"root":"dfn","fam":"d","says":"function","first":"its name","third":"the kind it gives back, or now","ex":"add_up dfn num","cpp":"int add(...) {","block":true},{"root":"dcx","fam":"d","says":"function for compile time","first":"its name","third":"the kind it gives back, or now","ex":"square dcx num","cpp":"constexpr int f(...) {","block":true},{"root":"dpm","fam":"d","says":"parameter","first":"its name","third":"its kind, or a starting value","ex":"a dpm num","cpp":"int a","block":false},{"root":"dcl","fam":"d","says":"class","first":"its name","third":"now, or its parents with &","ex":"Dog dcl Animal","cpp":"class Dog : public Animal {","block":true},{"root":"dst","fam":"d","says":"struct","first":"its name","third":"now, or its parents with &","ex":"Point dst now","cpp":"struct Point {","block":true},{"root":"dun","fam":"d","says":"union","first":"its name","third":"now","ex":"U dun now","cpp":"union U {","block":true},{"root":"den","fam":"d","says":"enum","first":"its name","third":"its choices with &","ex":"Mood den happy&sad","cpp":"enum class Mood { happy, sad };","block":false},{"root":"dgr","fam":"d","says":"group","first":"its name","third":"now","ex":"geo dgr now","cpp":"namespace geo {","block":true},{"root":"dlm","fam":"d","says":"lambda","first":"its name","third":"the kind it gives back, or now","ex":"twice dlm num","cpp":"auto f = [&](...) -> int {","block":true},{"root":"dlv","fam":"d","says":"lambda with its own copies","first":"its name","third":"the kind it gives back, or now","ex":"tick dlv num","cpp":"auto f = [=](...) mutable -> int {","block":true},{"root":"dtp","fam":"d","says":"type","first":"its name","third":"now","ex":"T dtp now","cpp":"template <typename T>","block":false},{"root":"dal","fam":"d","says":"alias","first":"its name","third":"a kind","ex":"Row dal vec@num","cpp":"using Grid = std::vector<int>;","block":false},{"root":"dfd","fam":"d","says":"field","first":"its name","third":"its kind, or a starting value","ex":"age dfd 3","cpp":"int age = 3;","block":false},{"root":"dbb","fam":"d","says":"field of a few bits","first":"its name","third":"how many bits","ex":"ready dbb 1","cpp":"unsigned int ready : 1;","block":false},{"root":"dsc","fam":"d","says":"secret field","first":"its name","third":"its kind, or a starting value","ex":"pin dsc num","cpp":"private: int pin{};","block":false},{"root":"dfm","fam":"d","says":"family field","first":"its name","third":"its kind, or a starting value","ex":"x dfm num","cpp":"protected: int x{};","block":false},{"root":"dsh","fam":"d","says":"shared","first":"its name","third":"its kind, or a starting value","ex":"count dsh 0","cpp":"static inline int count = 0;","block":false},{"root":"dmk","fam":"d","says":"make","first":"the class's name","third":"now","ex":"Dog dmk now","cpp":"Dog(...) {","block":true},{"root":"dbs","fam":"d","says":"base","first":"a parent, or now","third":"what it is made with, with &","ex":"now dbs given","cpp":": Animal(given)","block":false},{"root":"dds","fam":"d","says":"when destroyed","first":"the class's name","third":"now","ex":"Dog dds now","cpp":"~Dog() {","block":true},{"root":"dvr","fam":"d","says":"virtual","first":"its name","third":"the kind it gives back, or now","ex":"speak dvr txt","cpp":"virtual int f(...) {","block":true},{"root":"dmb","fam":"d","says":"must be redone","first":"its name","third":"the kind it gives back, or now","ex":"area dmb dec","cpp":"virtual int f(...) = 0;","block":false},{"root":"dov","fam":"d","says":"override","first":"its name","third":"the kind it gives back, or now","ex":"speak dov txt","cpp":"int f(...) override {","block":true},{"root":"dsf","fam":"d","says":"shared function","first":"its name","third":"the kind it gives back, or now","ex":"make dsf num","cpp":"static int f(...) {","block":true},{"root":"dhd","fam":"d","says":"hidden function","first":"its name","third":"the kind it gives back, or now","ex":"think dhd now","cpp":"private: int f(...) {","block":true},{"root":"dfy","fam":"d","says":"family function","first":"its name","third":"the kind it gives back, or now","ex":"grow dfy now","cpp":"protected: int f(...) {","block":true},{"root":"dkn","fam":"d","says":"constant","first":"its name","third":"the kind it gives back, or now","ex":"area dkn dec","cpp":"int f(...) const {","block":true},{"root":"dop","fam":"d","says":"operator","first":"the mark: + - * / == < >","third":"the kind it gives back","ex":"+ dop Spot","cpp":"Spot operator+(...) {","block":true},{"root":"ert","fam":"e","says":"return","first":"the function's name","third":"a value, or now","ex":"add_up ert a+b","cpp":"return v;","block":false},{"root":"ebk","fam":"e","says":"break","first":"now, or a loop's name","third":"now, or a test","ex":"now ebk now","cpp":"break;","block":false},{"root":"enx","fam":"e","says":"next","first":"now, or a loop's name","third":"now, or a test","ex":"i enx x<0","cpp":"continue;","block":false},{"root":"etw","fam":"e","says":"throw","first":"now","third":"a text or a thing, or now","ex":"now etw \"bad\"","cpp":"throw std::runtime_error(\"bad\");","block":false},{"root":"edl","fam":"e","says":"delete","first":"now","third":"a pointer","ex":"now edl p","cpp":"delete p; p = nullptr;","block":false},{"root":"ext","fam":"e","says":"exit","first":"now","third":"a whole number","ex":"now ext 0","cpp":"std::exit(0);","block":false},{"root":"eyd","fam":"e","says":"yield","first":"the function's name","third":"a value","ex":"evens eyd i*2","cpp":"co_yield v;","block":false},{"root":"flt","fam":"f","says":"less than","first":"a counter","third":"a value","ex":"i flt 10","cpp":"for (int i = 0; i < n; ++i) {","block":true},{"root":"fle","fam":"f","says":"less or equal","first":"a counter","third":"a value","ex":"i fle 10","cpp":"for (int i = 0; i <= n; ++i) {","block":true},{"root":"fgt","fam":"f","says":"greater than","first":"a counter you made","third":"a value","ex":"i fgt 0","cpp":"for (; i > n; --i) {","block":true},{"root":"fge","fam":"f","says":"greater or equal","first":"a counter you made","third":"a value","ex":"i fge 0","cpp":"for (; i >= n; --i) {","block":true},{"root":"fne","fam":"f","says":"not equal","first":"a counter","third":"a value","ex":"i fne 10","cpp":"for (int i = 0; i != n; ++i) {","block":true},{"root":"fea","fam":"f","says":"each","first":"a name, or names with &","third":"a collection","ex":"n fea scores","cpp":"for (auto& x : items) {","block":true},{"root":"fpr","fam":"f","says":"parallel","first":"a name","third":"a collection","ex":"n fpr scores","cpp":"std::for_each(std::execution::par, ...) {","block":true},{"root":"get","fam":"g","says":"get","first":"a thing","third":"inp, a file, or a question","ex":"age get \"Age? \"","cpp":"std::cin >> x;","block":false},{"root":"gln","fam":"g","says":"lines","first":"a text","third":"inp, a file, or a question","ex":"line gln inp","cpp":"std::getline(std::cin, x);","block":false},{"root":"hwr","fam":"h","says":"write","first":"a file name","third":"a text","ex":"\"a.txt\" hwr \"hello\"","cpp":"writes the whole file","block":false},{"root":"hap","fam":"h","says":"append","first":"a file name","third":"a text","ex":"\"a.txt\" hap \"more\"","cpp":"adds to the end of the file","block":false},{"root":"hrm","fam":"h","says":"remove","first":"a file name","third":"now","ex":"\"a.txt\" hrm now","cpp":"std::filesystem::remove_all(f);","block":false},{"root":"hmk","fam":"h","says":"make","first":"a folder name","third":"now","ex":"\"out\" hmk now","cpp":"std::filesystem::create_directories(d);","block":false},{"root":"hcp","fam":"h","says":"copy","first":"a file name","third":"a file name","ex":"\"a\" hcp \"b\"","cpp":"std::filesystem::copy_file(a, b);","block":false},{"root":"hmv","fam":"h","says":"move","first":"a file name","third":"a file name","ex":"\"a\" hmv \"b\"","cpp":"std::filesystem::rename(a, b);","block":false},{"root":"hby","fam":"h","says":"write bytes","first":"a file name","third":"a list of bytes","ex":"\"a.bin\" hby bytes","cpp":"writes the bytes to the file","block":false},{"root":"ieq","fam":"i","says":"equal","first":"a value","third":"a value","ex":"x ieq 3","cpp":"if (x == y) {","block":true},{"root":"ine","fam":"i","says":"not equal","first":"a value","third":"a value","ex":"x ine 3","cpp":"if (x != y) {","block":true},{"root":"ilt","fam":"i","says":"less than","first":"a value","third":"a value","ex":"x ilt 3","cpp":"if (x < y) {","block":true},{"root":"ile","fam":"i","says":"less or equal","first":"a value","third":"a value","ex":"x ile 3","cpp":"if (x <= y) {","block":true},{"root":"igt","fam":"i","says":"greater than","first":"a value","third":"a value","ex":"x igt 3","cpp":"if (x > y) {","block":true},{"root":"ige","fam":"i","says":"greater or equal","first":"a value","third":"a value","ex":"x ige 3","cpp":"if (x >= y) {","block":true},{"root":"lrm","fam":"l","says":"remove","first":"a collection","third":"a value","ex":"scores lrm 7","cpp":"std::erase(v, x);","block":false},{"root":"ldx","fam":"l","says":"remove position","first":"a collection","third":"a position","ex":"scores ldx 0","cpp":"v.erase(v.begin() + i);","block":false},{"root":"lin","fam":"l","says":"insert","first":"a collection","third":"a position & a value","ex":"scores lin 0&9","cpp":"v.insert(v.begin() + i, x);","block":false},{"root":"lpl","fam":"l","says":"pop last","first":"a collection","third":"now","ex":"scores lpl now","cpp":"v.pop_back();","block":false},{"root":"lpf","fam":"l","says":"pop first","first":"a collection","third":"now","ex":"line lpf now","cpp":"v.pop_front();","block":false},{"root":"lso","fam":"l","says":"sort","first":"a collection","third":"now, or a function","ex":"scores lso now","cpp":"std::sort(v.begin(), v.end());","block":false},{"root":"lrv","fam":"l","says":"reversed","first":"a collection","third":"now","ex":"scores lrv now","cpp":"std::reverse(v.begin(), v.end());","block":false},{"root":"lsu","fam":"l","says":"shuffle","first":"a collection","third":"now","ex":"cards lsu now","cpp":"std::shuffle(...);","block":false},{"root":"lwp","fam":"l","says":"wipe","first":"a collection","third":"now","ex":"scores lwp now","cpp":"v.clear();","block":false},{"root":"lfl","fam":"l","says":"fill","first":"a collection","third":"a value","ex":"grid lfl 0","cpp":"std::fill(v.begin(), v.end(), x);","block":false},{"root":"luq","fam":"l","says":"unique","first":"a collection","third":"now","ex":"names luq now","cpp":"sorts it and removes repeats","block":false},{"root":"lrs","fam":"l","says":"resize","first":"a collection","third":"a whole number","ex":"scores lrs 10","cpp":"v.resize(n);","block":false},{"root":"lss","fam":"l","says":"sort, keeping ties in order","first":"a collection","third":"now, or a function","ex":"people lss by_age","cpp":"std::stable_sort(v.begin(), v.end());","block":false},{"root":"lrw","fam":"l","says":"rotated","first":"a collection","third":"how many places","ex":"cards lrw 1","cpp":"the first n go to the end","block":false},{"root":"mak","fam":"m","says":"make","first":"a name","third":"a kind, or a kind & what it is made with","ex":"scores mak vec@num","cpp":"std::vector<int> v;","block":false},{"root":"mkn","fam":"m","says":"constant","first":"a name","third":"a value","ex":"LIMIT mkn 100","cpp":"const int x = 6;","block":false},{"root":"mgl","fam":"m","says":"global","first":"a name","third":"a value","ex":"score mgl 0","cpp":"int x = 0;   outside every function","block":false},{"root":"mpt","fam":"m","says":"pointer","first":"a name","third":"a thing","ex":"p mpt x","cpp":"int* p = &x;","block":false},{"root":"mrf","fam":"m","says":"reference","first":"a name","third":"a thing","ex":"r mrf x","cpp":"int& r = x;","block":false},{"root":"mlo","fam":"m","says":"look-only reference","first":"a name","third":"a thing","ex":"r mlo x","cpp":"const int& r = x;","block":false},{"root":"mnw","fam":"m","says":"new","first":"a name","third":"a kind, or a kind & what it is made with","ex":"p mnw Dog","cpp":"Dog* p = new Dog();","block":false},{"root":"mwn","fam":"m","says":"owned","first":"a name","third":"a kind, or a kind & what it is made with","ex":"d mwn Dog","cpp":"auto d = std::make_unique<Dog>();","block":false},{"root":"msh","fam":"m","says":"shared","first":"a name","third":"a kind, or a kind & what it is made with","ex":"d msh Dog","cpp":"auto d = std::make_shared<Dog>();","block":false},{"root":"mtd","fam":"m","says":"thread","first":"a name","third":"a function, or a function & its values","ex":"t mtd work&5","cpp":"std::thread t(work, 5);","block":false},{"root":"msy","fam":"m","says":"async","first":"a name","third":"a function, or a function & its values","ex":"t msy work&5","cpp":"auto t = std::async(...);","block":false},{"root":"mfi","fam":"m","says":"file in","first":"a name","third":"a file name","ex":"f mfi \"a.txt\"","cpp":"std::ifstream f(\"a.txt\");","block":false},{"root":"mfo","fam":"m","says":"file out","first":"a name","third":"a file name","ex":"f mfo \"a.txt\"","cpp":"std::ofstream f(\"a.txt\");","block":false},{"root":"mmv","fam":"m","says":"move","first":"a name","third":"a thing","ex":"y mmv x","cpp":"auto y = std::move(x);","block":false},{"root":"msv","fam":"m","says":"kept between calls","first":"a name","third":"a value","ex":"calls msv 0","cpp":"static int x = 0;","block":false},{"root":"mtl","fam":"m","says":"one for each thread","first":"a name","third":"a value","ex":"seen mtl 0","cpp":"thread_local int x = 0;   outside every function","block":false},{"root":"oeq","fam":"o","says":"equal","first":"a value","third":"a value","ex":"x oeq 3","cpp":"} else if (x == y) {","block":true},{"root":"one","fam":"o","says":"not equal","first":"a value","third":"a value","ex":"x one 3","cpp":"} else if (x != y) {","block":true},{"root":"olt","fam":"o","says":"less than","first":"a value","third":"a value","ex":"x olt 3","cpp":"} else if (x < y) {","block":true},{"root":"ole","fam":"o","says":"less or equal","first":"a value","third":"a value","ex":"x ole 3","cpp":"} else if (x <= y) {","block":true},{"root":"ogt","fam":"o","says":"greater than","first":"a value","third":"a value","ex":"x ogt 3","cpp":"} else if (x > y) {","block":true},{"root":"oge","fam":"o","says":"greater or equal","first":"a value","third":"a value","ex":"x oge 3","cpp":"} else if (x >= y) {","block":true},{"root":"oth","fam":"o","says":"the others","first":"now","third":"now","ex":"now oth now","cpp":"} else {","block":true},{"root":"prn","fam":"p","says":"print a line","first":"out, err, or a file","third":"a value","ex":"out prn \"Hello\"","cpp":"std::cout << x << std::endl;","block":false},{"root":"put","fam":"p","says":"put","first":"out, err, or a file","third":"a value","ex":"out put \"Hi \"","cpp":"std::cout << x;","block":false},{"root":"rjn","fam":"r","says":"join","first":"a thread","third":"now","ex":"t rjn now","cpp":"t.join();","block":false},{"root":"rdt","fam":"r","says":"detach","first":"a thread","third":"now","ex":"t rdt now","cpp":"t.detach();","block":false},{"root":"rwt","fam":"r","says":"wait","first":"now","third":"milliseconds","ex":"now rwt 100","cpp":"std::this_thread::sleep_for(...);","block":false},{"root":"rcm","fam":"r","says":"command","first":"now","third":"a text","ex":"now rcm \"dir\"","cpp":"std::system(c);","block":false},{"root":"rsd","fam":"r","says":"seed","first":"now","third":"a whole number","ex":"now rsd 7","cpp":"seeds the random numbers","block":false},{"root":"seq","fam":"s","says":"equal","first":"a value","third":"a value","ex":"x seq 3","cpp":"stops unless x == y","block":false},{"root":"sne","fam":"s","says":"not equal","first":"a value","third":"a value","ex":"x sne 3","cpp":"stops unless x != y","block":false},{"root":"slt","fam":"s","says":"less than","first":"a value","third":"a value","ex":"x slt 3","cpp":"stops unless x < y","block":false},{"root":"sle","fam":"s","says":"less or equal","first":"a value","third":"a value","ex":"x sle 3","cpp":"stops unless x <= y","block":false},{"root":"sgt","fam":"s","says":"greater than","first":"a value","third":"a value","ex":"x sgt 3","cpp":"stops unless x > y","block":false},{"root":"sge","fam":"s","says":"greater or equal","first":"a value","third":"a value","ex":"x sge 3","cpp":"stops unless x >= y","block":false},{"root":"ueq","fam":"u","says":"equal","first":"a value","third":"a value","ex":"x ueq 3","cpp":"} while (!(x == y));","block":false},{"root":"une","fam":"u","says":"not equal","first":"a value","third":"a value","ex":"x une 3","cpp":"} while (!(x != y));","block":false},{"root":"ult","fam":"u","says":"less than","first":"a value","third":"a value","ex":"x ult 3","cpp":"} while (!(x < y));","block":false},{"root":"ule","fam":"u","says":"less or equal","first":"a value","third":"a value","ex":"x ule 3","cpp":"} while (!(x <= y));","block":false},{"root":"ugt","fam":"u","says":"greater than","first":"a value","third":"a value","ex":"x ugt 3","cpp":"} while (!(x > y));","block":false},{"root":"uge","fam":"u","says":"greater or equal","first":"a value","third":"a value","ex":"x uge 3","cpp":"} while (!(x >= y));","block":false},{"root":"weq","fam":"w","says":"equal","first":"a value","third":"a value","ex":"x weq 3","cpp":"while (x == y) {","block":true},{"root":"wne","fam":"w","says":"not equal","first":"a value","third":"a value","ex":"x wne 3","cpp":"while (x != y) {","block":true},{"root":"wlt","fam":"w","says":"less than","first":"a value","third":"a value","ex":"x wlt 3","cpp":"while (x < y) {","block":true},{"root":"wle","fam":"w","says":"less or equal","first":"a value","third":"a value","ex":"x wle 3","cpp":"while (x <= y) {","block":true},{"root":"wgt","fam":"w","says":"greater than","first":"a value","third":"a value","ex":"x wgt 3","cpp":"while (x > y) {","block":true},{"root":"wge","fam":"w","says":"greater or equal","first":"a value","third":"a value","ex":"x wge 3","cpp":"while (x >= y) {","block":true},{"root":"wfv","fam":"w","says":"forever","first":"now","third":"now","ex":"now wfv now","cpp":"while (true) {","block":true},{"root":"wln","fam":"w","says":"lines","first":"a text","third":"inp or a file","ex":"line wln f","cpp":"while (std::getline(f, line)) {","block":true},{"root":"xic","fam":"x","says":"include","first":"now","third":"a header, in quotes","ex":"now xic \"raylib.h\"","cpp":"#include \"raylib.h\"","block":false},{"root":"xlb","fam":"x","says":"library","first":"now","third":"a library's name","ex":"now xlb raylib","cpp":"uses and links a library","block":false},{"root":"xim","fam":"x","says":"import","first":"now","third":"an English++ file, in quotes","ex":"now xim \"tools.epp\"","cpp":"brings in the file's definitions","block":false},{"root":"xus","fam":"x","says":"using","first":"now","third":"a namespace","ex":"now xus std","cpp":"using namespace std;","block":false},{"root":"xpp","fam":"x","says":"C++ here","first":"now","third":"C++, in quotes","ex":"now xpp \"int a = 1;\"","cpp":"that line of C++, right here","block":false},{"root":"xgl","fam":"x","says":"global","first":"now","third":"C++, in quotes","ex":"now xgl \"int a = 1;\"","cpp":"that line of C++, outside every function","block":false}],"values":[{"word":"cct","fam":"c","says":"count","ex":"cct&scores","cpp":"static_cast<int>({0}.size())"},{"word":"csm","fam":"c","says":"sum","ex":"csm&scores","cpp":"std::accumulate({0}.begin(), {0}.end(), {E0}{})"},{"word":"cpd","fam":"c","says":"product","ex":"cpd&scores","cpp":"std::accumulate({0}.begin(), {0}.end(), static_cast<{E0}>(1), std::multiplies<{E0}>())"},{"word":"cmx","fam":"c","says":"the biggest","ex":"cmx&scores","cpp":"*std::max_element({0}.begin(), {0}.end())"},{"word":"cmn","fam":"c","says":"the smallest","ex":"cmn&scores","cpp":"*std::min_element({0}.begin(), {0}.end())"},{"word":"cav","fam":"c","says":"average","ex":"cav&scores","cpp":"epp::Average({0})"},{"word":"cme","fam":"c","says":"median","ex":"cme&scores","cpp":"epp::Median({0})"},{"word":"cde","fam":"c","says":"standard deviation","ex":"cde&scores","cpp":"epp::StandardDeviation({0})"},{"word":"cps","fam":"c","says":"position of","ex":"cps&scores&7","cpp":"epp::IndexOf({0}, {1})"},{"word":"chs","fam":"c","says":"has","ex":"chs&scores&7","cpp":"epp::Has({0}, {1})"},{"word":"chm","fam":"c","says":"how many of","ex":"chm&scores&7","cpp":"static_cast<int>(std::count({0}.begin(), {0}.end(), {1}))"},{"word":"cfr","fam":"c","says":"the first","ex":"cfr&scores","cpp":"{0}.front()"},{"word":"cla","fam":"c","says":"the last","ex":"cla&scores","cpp":"{0}.back()"},{"word":"cky","fam":"c","says":"the keys of","ex":"cky&ages","cpp":"epp::KeysOf({0})"},{"word":"cvl","fam":"c","says":"the values of","ex":"cvl&ages","cpp":"epp::ValuesOf({0})"},{"word":"cso","fam":"c","says":"sort","ex":"cso&scores","cpp":"epp::SortedCopy({0})"},{"word":"crv","fam":"c","says":"reversed","ex":"crv&scores","cpp":"epp::Reversed({0})"},{"word":"cft","fam":"c","says":"filtered by a function","ex":"cft&scores&big","cpp":"epp::KeepIf({0}, {1})"},{"word":"cmp","fam":"c","says":"each one through a function","ex":"cmp&scores&twice","cpp":"epp::Transformed({0}, {1})"},{"word":"ctx","fam":"c","says":"joined into a text","ex":"ctx&names&\", \"","cpp":"epp::Join({0}, {1})"},{"word":"cra","fam":"c","says":"random","ex":"cra&cards","cpp":"epp::RandomItem({0})"},{"word":"cea","fam":"c","says":"each","ex":"cea&scores&big","cpp":"epp::EachPasses({0}, {1})"},{"word":"can","fam":"c","says":"any passes","ex":"can&scores&big","cpp":"epp::AnyPasses({0}, {1})"},{"word":"cnn","fam":"c","says":"none passes","ex":"cnn&scores&big","cpp":"epp::NonePasses({0}, {1})"},{"word":"crl","fam":"c","says":"rolled up by a function","ex":"crl&scores&0&plus","cpp":"epp::RolledUp({0}, {1}, {2})"},{"word":"czp","fam":"c","says":"zipped","ex":"czp&names&ages","cpp":"epp::Zipped({0}, {1})"},{"word":"cnu","fam":"c","says":"numbered","ex":"cnu&names","cpp":"epp::Numbered({0})"},{"word":"cun","fam":"c","says":"union","ex":"cun&a&b","cpp":"epp::InEither({0}, {1})"},{"word":"cbt","fam":"c","says":"in both","ex":"cbt&a&b","cpp":"epp::InBoth({0}, {1})"},{"word":"cot","fam":"c","says":"only in the first","ex":"cot&a&b","cpp":"epp::OnlyInFirst({0}, {1})"},{"word":"ccu","fam":"c","says":"part of","ex":"ccu&scores&1&2","cpp":"epp::PartOf({0}, {1}, {2})"},{"word":"cbf","fam":"c","says":"found by halves","ex":"cbf&sorted&7","cpp":"std::binary_search({0}.begin(), {0}.end(), {1})"},{"word":"cpb","fam":"c","says":"position by halves","ex":"cpb&sorted&7","cpp":"static_cast<int>(std::lower_bound({0}.begin(), {0}.end(), {1}) - {0}.begin())"},{"word":"cgr","fam":"c","says":"group","ex":"cgr&words&first_letter","cpp":"epp::GroupedBy<{R}>({0}, {1})"},{"word":"cjn","fam":"c","says":"join","ex":"cjn&lists","cpp":"epp::JoinedUp({0})"},{"word":"crg","fam":"c","says":"counted","ex":"crg&0&10&2","cpp":"epp::Counted({0}, {1}, {2})"},{"word":"hrd","fam":"h","says":"read the whole file","ex":"hrd&\"a.txt\"","cpp":"epp::ReadWholeFile({0})"},{"word":"hln","fam":"h","says":"lines","ex":"hln&\"a.txt\"","cpp":"epp::ReadLines({0})"},{"word":"hex","fam":"h","says":"exists","ex":"hex&\"a.txt\"","cpp":"std::filesystem::exists({0})"},{"word":"hsz","fam":"h","says":"size","ex":"hsz&\"a.txt\"","cpp":"static_cast<long long>(std::filesystem::file_size({0}))"},{"word":"hls","fam":"h","says":"the files in the folder","ex":"hls&\".\"","cpp":"epp::ListFolder({0})"},{"word":"hrb","fam":"h","says":"read bytes","ex":"hrb&\"a.bin\"","cpp":"epp::ReadBytes({0})"},{"word":"iff","fam":"i","says":"if, as a value","ex":"iff&a>b&a&b","cpp":"({0} ? {1} : {2})"},{"word":"kel","fam":"k","says":"elapsed seconds","ex":"kel","cpp":"epp::SecondsSinceStart()"},{"word":"kms","fam":"k","says":"milliseconds since the start","ex":"kms","cpp":"epp::MillisecondsSinceStart()"},{"word":"kda","fam":"k","says":"today's date","ex":"kda","cpp":"epp::DateTodayText()"},{"word":"ktm","fam":"k","says":"the time now","ex":"ktm","cpp":"epp::TimeNowText()"},{"word":"kyr","fam":"k","says":"the year","ex":"kyr","cpp":"epp::CurrentYear()"},{"word":"kmo","fam":"k","says":"the month","ex":"kmo","cpp":"epp::CurrentMonth()"},{"word":"kdy","fam":"k","says":"the day of the month","ex":"kdy","cpp":"epp::CurrentDayOfMonth()"},{"word":"khr","fam":"k","says":"the hour","ex":"khr","cpp":"epp::CurrentHour()"},{"word":"kmi","fam":"k","says":"the minute","ex":"kmi","cpp":"epp::CurrentMinute()"},{"word":"kse","fam":"k","says":"the second","ex":"kse","cpp":"epp::CurrentSecond()"},{"word":"kwk","fam":"k","says":"the day of the week","ex":"kwk","cpp":"epp::DayOfWeekText()"},{"word":"kns","fam":"k","says":"nanoseconds since the start","ex":"kns","cpp":"epp::NanosecondsSinceStart()"},{"word":"kfa","fam":"k","says":"filled in","ex":"kfa&\"%Y-%m-%d\"","cpp":"epp::TimeFilled({0})"},{"word":"nab","fam":"n","says":"absolute value","ex":"nab&x","cpp":"std::abs({0})"},{"word":"nsq","fam":"n","says":"square root","ex":"nsq&16","cpp":"std::sqrt({0})"},{"word":"ncr","fam":"n","says":"cube root","ex":"ncr&27","cpp":"std::cbrt({0})"},{"word":"nro","fam":"n","says":"rounded","ex":"nro&2.5","cpp":"std::round({0})"},{"word":"ndn","fam":"n","says":"round down","ex":"ndn&2.5","cpp":"std::floor({0})"},{"word":"nup","fam":"n","says":"round up","ex":"nup&2.5","cpp":"std::ceil({0})"},{"word":"nwh","fam":"n","says":"whole part","ex":"nwh&2.5","cpp":"std::trunc({0})"},{"word":"npw","fam":"n","says":"power","ex":"npw&2&10","cpp":"std::pow({0}, {1})"},{"word":"nmx","fam":"n","says":"the biggest","ex":"nmx&a&b","cpp":"std::max<{R}>({0}, {1})"},{"word":"nmn","fam":"n","says":"the smallest","ex":"nmn&a&b","cpp":"std::min<{R}>({0}, {1})"},{"word":"nkb","fam":"n","says":"kept between","ex":"nkb&x&0&10","cpp":"std::clamp<{R}>({0}, {1}, {2})"},{"word":"nsn","fam":"n","says":"sine","ex":"nsn&x","cpp":"std::sin({0})"},{"word":"nco","fam":"n","says":"cosine","ex":"nco&x","cpp":"std::cos({0})"},{"word":"ntn","fam":"n","says":"tangent","ex":"ntn&x","cpp":"std::tan({0})"},{"word":"nas","fam":"n","says":"arc sine","ex":"nas&x","cpp":"std::asin({0})"},{"word":"nac","fam":"n","says":"arc cosine","ex":"nac&x","cpp":"std::acos({0})"},{"word":"nat","fam":"n","says":"arc tangent","ex":"nat&x","cpp":"std::atan({0})"},{"word":"nlg","fam":"n","says":"natural log","ex":"nlg&x","cpp":"std::log({0})"},{"word":"nlx","fam":"n","says":"log base ten","ex":"nlx&100","cpp":"std::log10({0})"},{"word":"nep","fam":"n","says":"e to the power","ex":"nep&1","cpp":"std::exp({0})"},{"word":"nhy","fam":"n","says":"hypotenuse","ex":"nhy&3&4","cpp":"std::hypot({0}, {1})"},{"word":"ngd","fam":"n","says":"greatest common divisor","ex":"ngd&12&18","cpp":"std::gcd({0}, {1})"},{"word":"nmu","fam":"n","says":"least common multiple","ex":"nmu&4&6","cpp":"std::lcm({0}, {1})"},{"word":"nra","fam":"n","says":"random","ex":"nra&1&6","cpp":"epp::RandomNumber({0}, {1})"},{"word":"nrz","fam":"n","says":"random decimal","ex":"nrz&0&1","cpp":"epp::RandomDecimal({0}, {1})"},{"word":"nfc","fam":"n","says":"factorial","ex":"nfc&5","cpp":"epp::Factorial({0})"},{"word":"npe","fam":"n","says":"is prime","ex":"npe&7","cpp":"epp::IsPrime({0})"},{"word":"npi","fam":"n","says":"pi","ex":"npi","cpp":"std::numbers::pi"},{"word":"nhi","fam":"n","says":"highest whole number","ex":"nhi","cpp":"std::numeric_limits<int>::max()"},{"word":"nlw","fam":"n","says":"lowest whole number","ex":"nlw","cpp":"std::numeric_limits<int>::lowest()"},{"word":"nnd","fam":"n","says":"bit and","ex":"nnd&a&b","cpp":"({0} & {1})"},{"word":"nor","fam":"n","says":"bit or","ex":"nor&a&b","cpp":"({0} | {1})"},{"word":"nxr","fam":"n","says":"bit xor","ex":"nxr&a&b","cpp":"({0} ^ {1})"},{"word":"nsl","fam":"n","says":"shift left","ex":"nsl&a&2","cpp":"({0} << {1})"},{"word":"nsr","fam":"n","says":"shift right","ex":"nsr&a&2","cpp":"({0} >> {1})"},{"word":"nnt","fam":"n","says":"bit not","ex":"nnt&a","cpp":"(~({0}))"},{"word":"nsz","fam":"n","says":"size","ex":"nsz&x","cpp":"static_cast<int>(sizeof({0}))"},{"word":"tsz","fam":"t","says":"size","ex":"tsz&name","cpp":"static_cast<int>({0}.size())"},{"word":"tuc","fam":"t","says":"uppercase","ex":"tuc&name","cpp":"epp::ToUpper({0})"},{"word":"tlc","fam":"t","says":"lowercase","ex":"tlc&name","cpp":"epp::ToLower({0})"},{"word":"tti","fam":"t","says":"trimmed","ex":"tti&name","cpp":"epp::Trim({0})"},{"word":"trv","fam":"t","says":"reversed","ex":"trv&name","cpp":"epp::Reversed({0})"},{"word":"tps","fam":"t","says":"position of","ex":"tps&name&\"a\"","cpp":"epp::FindPosition({0}, {1})"},{"word":"trp","fam":"t","says":"replaced","ex":"trp&s&\"a\"&\"b\"","cpp":"epp::ReplaceAll({0}, {1}, {2})"},{"word":"tcu","fam":"t","says":"part of","ex":"tcu&s&0&3","cpp":"{0}.substr({1}, {2})"},{"word":"tsp","fam":"t","says":"split","ex":"tsp&s&\",\"","cpp":"epp::Split({0}, {1})"},{"word":"twd","fam":"t","says":"words","ex":"twd&s","cpp":"epp::SplitWords({0})"},{"word":"tln","fam":"t","says":"lines","ex":"tln&s","cpp":"epp::SplitLines({0})"},{"word":"ths","fam":"t","says":"has","ex":"ths&s&\"a\"","cpp":"({0}.find({1}) != std::string::npos)"},{"word":"tbg","fam":"t","says":"begins with","ex":"tbg&s&\"a\"","cpp":"{0}.starts_with({1})"},{"word":"ted","fam":"t","says":"ends with","ex":"ted&s&\"a\"","cpp":"{0}.ends_with({1})"},{"word":"tnm","fam":"t","says":"the number in","ex":"tnm&\"42\"","cpp":"std::stoi({0})"},{"word":"tdc","fam":"t","says":"the decimal in","ex":"tdc&\"2.5\"","cpp":"std::stod({0})"},{"word":"tfx","fam":"t","says":"with decimal places","ex":"tfx&x&2","cpp":"epp::WithDecimalPlaces({0}, {1})"},{"word":"tpa","fam":"t","says":"padded","ex":"tpa&s&10","cpp":"epp::PaddedTo({0}, {1})"},{"word":"ttc","fam":"t","says":"title case","ex":"ttc&s","cpp":"epp::TitleCase({0})"},{"word":"tmt","fam":"t","says":"matches pattern","ex":"tmt&s&\"a+\"","cpp":"epp::MatchesPattern({0}, {1})"},{"word":"tma","fam":"t","says":"all matches","ex":"tma&s&\"a+\"","cpp":"epp::PatternMatches({0}, {1})"},{"word":"trx","fam":"t","says":"pattern replaced","ex":"trx&s&\"a+\"&\"b\"","cpp":"epp::ReplacePattern({0}, {1}, {2})"},{"word":"tre","fam":"t","says":"repeated","ex":"tre&\"ab\"&3","cpp":"epp::Repeated({0}, {1})"},{"word":"tct","fam":"t","says":"count","ex":"tct&s&\"a\"","cpp":"epp::CountOf({0}, {1})"},{"word":"tdg","fam":"t","says":"is a digit","ex":"tdg&c","cpp":"epp::LetterIsDigit({0})"},{"word":"tlr","fam":"t","says":"is a letter","ex":"tlr&c","cpp":"epp::LetterIsLetter({0})"},{"word":"tws","fam":"t","says":"is white space","ex":"tws&c","cpp":"epp::LetterIsSpace({0})"},{"word":"tfa","fam":"t","says":"filled in","ex":"tfa&\"{} of {}\"&1&2","cpp":"epp::Filled({0})"},{"word":"ttp","fam":"t","says":"type","ex":"ttp&x","cpp":""},{"word":"tjs","fam":"t","says":"read as JSON","ex":"tjs&text","cpp":"epp::Json::Parse({0})"},{"word":"xag","fam":"x","says":"words given to the program","ex":"xag","cpp":"epp::ProgramArguments()"},{"word":"xev","fam":"x","says":"an environment value","ex":"xev&\"PATH\"","cpp":"epp::EnvironmentValue({0})"},{"word":"xcm","fam":"x","says":"command","ex":"xcm&\"dir\"","cpp":"epp::CommandOutput({0})"},{"word":"xcd","fam":"x","says":"a command's exit code","ex":"xcd&\"dir\"","cpp":"epp::CommandExitCode({0})"},{"word":"xwb","fam":"x","says":"a web page's text","ex":"xwb&\"http://example.com\"","cpp":"epp::WebPageText({0})"},{"word":"xpo","fam":"x","says":"a web page's answer to a text","ex":"xpo&\"http://example.com\"&\"hello\"","cpp":"epp::WebPost({0}, {1})"},{"word":"xha","fam":"x","says":"SHA-256 hash","ex":"xha&\"abc\"","cpp":"epp::Sha256({0})"},{"word":"xbe","fam":"x","says":"as base 64","ex":"xbe&\"abc\"","cpp":"epp::ToBase64({0})"},{"word":"xbd","fam":"x","says":"from base 64","ex":"xbd&\"YWJj\"","cpp":"epp::FromBase64({0})"}],"kinds":[{"kind":"num","what":"a whole number","cpp":"int"},{"kind":"big","what":"a big whole number","cpp":"long long"},{"kind":"sml","what":"a small whole number","cpp":"short"},{"kind":"pos","what":"a positive whole number","cpp":"unsigned int"},{"kind":"byt","what":"a byte","cpp":"unsigned char"},{"kind":"pbg","what":"a big positive whole number","cpp":"unsigned long long"},{"kind":"hug","what":"a whole number of any size","cpp":"epp::Huge"},{"kind":"dec","what":"a decimal","cpp":"double"},{"kind":"flo","what":"a small decimal","cpp":"float"},{"kind":"cpx","what":"a complex number","cpp":"std::complex<double>"},{"kind":"txt","what":"a text","cpp":"std::string"},{"kind":"ltr","what":"a letter","cpp":"char"},{"kind":"yno","what":"a yes or no","cpp":"bool"},{"kind":"any","what":"any kind: C++ works it out","cpp":"auto"},{"kind":"vec","what":"a vector","cpp":"std::vector"},{"kind":"lst","what":"a linked list","cpp":"std::list"},{"kind":"dqu","what":"a deque","cpp":"std::deque"},{"kind":"arr","what":"an array: arr@num@5","cpp":"std::array"},{"kind":"stk","what":"a stack","cpp":"std::stack"},{"kind":"que","what":"a queue","cpp":"std::queue"},{"kind":"hep","what":"a priority queue","cpp":"std::priority_queue"},{"kind":"mhp","what":"a priority queue with the smallest on top","cpp":"epp::LowHeap"},{"kind":"map","what":"a map: map@txt@num","cpp":"std::map"},{"kind":"hsh","what":"a hash map","cpp":"std::unordered_map"},{"kind":"set","what":"a set","cpp":"std::set"},{"kind":"bag","what":"a hash set","cpp":"std::unordered_set"},{"kind":"par","what":"a pair","cpp":"std::pair"},{"kind":"tup","what":"a tuple","cpp":"std::tuple"},{"kind":"opt","what":"a maybe-value","cpp":"std::optional"},{"kind":"alt","what":"one of several kinds","cpp":"std::variant"},{"kind":"own","what":"an owned pointer","cpp":"std::unique_ptr"},{"kind":"shr","what":"a shared pointer","cpp":"std::shared_ptr"},{"kind":"ptr","what":"a pointer","cpp":"*"},{"kind":"ref","what":"a reference","cpp":"&"},{"kind":"see","what":"a look-only reference","cpp":"const &"},{"kind":"tkn","what":"a thing handed over to keep","cpp":"&&"},{"kind":"fun","what":"a function: fun@num@txt gives a num and takes a txt","cpp":"std::function"},{"kind":"mtx","what":"a mutex","cpp":"std::mutex"},{"kind":"atm","what":"an atomic","cpp":"std::atomic"},{"kind":"thd","what":"a thread","cpp":"std::thread"},{"kind":"fut","what":"an async result","cpp":"std::future"},{"kind":"gnr","what":"values worked out one at a time","cpp":"epp::Generator"},{"kind":"chn","what":"a channel between threads","cpp":"epp::Channel"},{"kind":"cnd","what":"a condition threads wait on","cpp":"std::condition_variable_any"},{"kind":"ifs","what":"a file to read","cpp":"std::ifstream"},{"kind":"ofs","what":"a file to write","cpp":"std::ofstream"},{"kind":"jsn","what":"a JSON value","cpp":"epp::Json"},{"kind":"sck","what":"a network connection","cpp":"epp::Socket"},{"kind":"srv","what":"a network server","cpp":"epp::Server"}],"special":[{"word":"now","what":"fills a spot when there is nothing to say","cpp":""},{"word":"nil","what":"nothing: a pointer to nothing, or a maybe-value with no value","cpp":"nullptr"},{"word":"yes","what":"true","cpp":"true"},{"word":"nay","what":"false","cpp":"false"},{"word":"out","what":"the screen","cpp":"std::cout"},{"word":"err","what":"the screen, for problems","cpp":"std::cerr"},{"word":"inp","what":"the keyboard","cpp":"std::cin"},{"word":"slf","what":"the thing this method is working on","cpp":"this"}],"is":"x is 6 becomes int x = 6;, and after that x = 6;"};
  var lessons = [
 {
  "num": 2,
  "title": "Hello!",
  "idea": "A program is a to-do list the computer works through from the top down. In English++ each item on that list is one line of exactly three words. Learn that shape and you can read any line in the language.",
  "sections": [
   {
    "h": "A whole program in three words",
    "text": [
     "This single line is a complete program.",
     "out is the screen, prn means print a line, and the text in quotes is what shows up.",
     "Quoted text counts as one word, however many spaces sit inside it."
    ],
    "code": "out prn \"Hello, V!\"",
    "out": "Hello, V!"
   },
   {
    "h": "Who, what happens, what with",
    "text": [
     "Each line fills three spots: the thing it is about, the action, and the value it uses.",
     "Here three lines run in order: x starts at 6, gets 1 more, then gets printed."
    ],
    "code": "x is 6\nx add 1\nout prn x",
    "out": "7"
   },
   {
    "h": "The middle word is a root",
    "text": [
     "The action word in the middle is called a root, and most roots are three letters.",
     "The first letter names a family and the last two pick one member, so igt is i for if plus gt for greater than.",
     "The idea comes from Hebrew, where words grow from three-letter roots."
    ]
   },
   {
    "h": "Every line becomes C++",
    "text": [
     "When you run a program, each English++ line turns into a line of real C++.",
     "x is 6 becomes int x = 6; and out prn x becomes a std::cout line.",
     "You never type brackets, semicolons or commas, and the Studio can show you the C++ side by side if you want to see it."
    ]
   }
  ],
  "lines": [
   {
    "line": "out prn \"Hello, V!\"",
    "say": "Show Hello, V! on the screen as its own line."
   },
   {
    "line": "x is 6",
    "say": "Make a name x that holds the number 6."
   },
   {
    "line": "x add 1",
    "say": "Put 1 more into x."
   },
   {
    "line": "out prn x",
    "say": "Show whatever x holds right now."
   },
   {
    "line": "x igt 3",
    "say": "Only if x is bigger than 3, do the lines tucked under this one."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Read this line aloud: out prn \"I can read this!\" What appears on the screen?",
    "answer": "It says: print a line on the screen, and the line is the quoted text. So the screen shows I can read this!"
   },
   {
    "q": "Which word in x add 1 is the root, and what does it do?",
    "answer": "add, the middle word. It puts the value on the right into the name on the left."
   },
   {
    "q": "Write a program that sets x to 6, adds 1, and prints it.",
    "answer": "Three lines, three small jobs, run top to bottom.",
    "answer_code": "x is 6\nx add 1\nout prn x",
    "answer_out": "7"
   }
  ],
  "recap": [
   "A program is a list of steps run from top to bottom.",
   "Every line has exactly three words: who, root, what.",
   "Quoted text is one word, spaces and all.",
   "The root's first letter tells you its family, like i for if.",
   "Every line you write becomes real C++."
  ]
 },
 {
  "num": 3,
  "title": "Your First Program",
  "idea": "This chapter takes you from an empty Studio to a running program in about a minute. You make a project, press F5, and read the result in the Output panel. You also learn notes, saving, and how to build an .exe you can hand to a friend.",
  "sections": [
   {
    "h": "The program the Studio writes for you",
    "text": [
     "Open the Studio, choose New Project, pick Console App, keep the Form on English++, give it a name and press Create.",
     "The Studio fills main.epp with this starter. The first line is a note for people; the second prints a greeting."
    ],
    "code": "note Hello V: your first English++ program. Press Run (F5).\nout prn \"Hello, V!\""
   },
   {
    "h": "Run it with F5",
    "text": [
     "Press F5 or the Run button. The Output panel at the bottom shows Hello, V!",
     "Behind the scenes your lines became C++, and that C++ became a program your computer can run."
    ]
   },
   {
    "h": "More lines, in order",
    "text": [
     "You can add as many lines as you want. They run one after another, top first."
    ],
    "code": "out prn \"One\"\nout prn \"Two\"\nout prn \"Three\"",
    "out": "One\nTwo\nThree"
   },
   {
    "h": "Notes are for people",
    "text": [
     "Start a line with note and the computer passes over it.",
     "Notes can run as long as you like, because they are not instructions. Ctrl+/ flips a line into a note and back, which is a quick way to switch a line off."
    ],
    "code": "note This program counts to two.\nout prn 1\nnote Now the second one.\nout prn 2",
    "out": "1\n2"
   },
   {
    "h": "Save, and build an .exe",
    "text": [
     "Ctrl+S saves, and the Studio also saves every time you run.",
     "Ctrl+Shift+B builds an .exe into the project's bin folder. Share the whole bin folder and your friend can run it without the Studio."
    ]
   }
  ],
  "lines": [
   {
    "line": "out prn \"Hello, V!\"",
    "say": "Print the greeting as one line in the Output panel."
   },
   {
    "line": "out prn \"One\"",
    "say": "Print the word One."
   },
   {
    "line": "out prn 1",
    "say": "Print the number 1."
   },
   {
    "line": "out prn 2",
    "say": "Print the number 2, after whatever came before it."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Change the greeting so it says hello to you, then press F5. What happens?",
    "answer": "Swap the text inside the quotes, for example \"Hello, Sam!\". After F5 the Output panel shows your new text."
   },
   {
    "q": "Reorder the three lines of the One, Two, Three program and run it. What changes?",
    "answer": "The output follows the new order, because lines always run from the top down.",
    "answer_code": "out prn \"Three\"\nout prn \"Two\"\nout prn \"One\""
   },
   {
    "q": "How do you stop a line from running without deleting it?",
    "answer": "Make it a note. Press Ctrl+/ on the line, or type note at its start. Press Ctrl+/ again to bring it back."
   }
  ],
  "watch_out": [
   "When you share an .exe, send the whole bin folder, not just the one file, so everything it needs goes along."
  ],
  "recap": [
   "Make a project: New Project, Console App, English++, Create.",
   "F5 runs your program; results appear in the Output panel.",
   "Lines run in order from the top.",
   "note lines are skipped; Ctrl+/ toggles them.",
   "Ctrl+S saves; Ctrl+Shift+B builds an .exe in bin."
  ]
 },
 {
  "num": 4,
  "title": "The Three Words",
  "idea": "Every line has three spots, and this chapter shows what may sit in each one. You learn the filler word now, how indenting makes a block, and the two marks @ and & that work inside a word. With these you can read the shape of any English++ line.",
  "sections": [
   {
    "h": "One word means no spaces",
    "text": [
     "Spaces are what split a line into its three words.",
     "So math is written tight, with no spaces: a+b is a single word, and c is a+b stays three words."
    ],
    "code": "a is 2\nb is 3\nc is a+b\nout prn c",
    "out": "5"
   },
   {
    "h": "now fills an empty spot",
    "text": [
     "When a spot has nothing to say, write now there.",
     "wfv means loop forever, so it needs no who and no what. The loop below adds 1 each time and stops when n reaches 3."
    ],
    "code": "n is 0\nnow wfv now\n  n add 1\n  now ebk n==3\nout prn n",
    "out": "3"
   },
   {
    "h": "Indenting makes a block",
    "text": [
     "Some roots open a block. The lines pushed in under them belong to them.",
     "The first line that comes back out is no longer in the block, so done prints either way."
    ],
    "code": "x is 6\nx igt 3\n  out prn \"big\"\n  out prn \"wow\"\nout prn \"done\"",
    "out": "big\nwow\ndone"
   },
   {
    "h": "@ reaches in, & hands values over",
    "text": [
     "Read @ as of or at: scores@0 is the item at position 0.",
     "Read & as with or and: 90&72&85 is three values, and nsq&16 runs the square root with 16."
    ],
    "code": "scores is 90&72&85\nout prn scores@0\nout prn nsq&16",
    "out": "90\n4"
   }
  ],
  "lines": [
   {
    "line": "c is a+b",
    "say": "c becomes a plus b; the math is one word because it has no spaces."
   },
   {
    "line": "now wfv now",
    "say": "Repeat the lines under this one forever; both outer spots are empty, so they say now."
   },
   {
    "line": "now ebk n==3",
    "say": "Leave the loop once n equals 3."
   },
   {
    "line": "x igt 3",
    "say": "If x is greater than 3, run the indented lines below."
   },
   {
    "line": "scores is 90&72&85",
    "say": "scores holds three values: 90, 72 and 85."
   },
   {
    "line": "out prn scores@0",
    "say": "Print the item at position 0 of scores."
   },
   {
    "line": "out prn nsq&16",
    "say": "Print the square root of 16."
   }
  ],
  "mistakes": [
   {
    "code": "x is 6 7",
    "says": "Line 1: This line has 4 words. Every line has exactly 3: who, the root, and what. Text with spaces goes in quotes, and & joins values into one word: add&1&2.",
    "fix": "Keep only one value in the last spot, such as x is 6.",
    "fix_code": "x is 6\nout prn x",
    "fix_out": "6"
   },
   {
    "code": "out prn",
    "says": "Line 1: This line has 2 words. Every line has exactly 3: who, the root, and what. If there is nothing to say in a spot, fill it with now, like now ebk now.",
    "fix": "Give prn something to print in the third spot, for example out prn \"hi\"."
   },
   {
    "code": "x is 6;",
    "says": "Line 1: English++ has no semicolons. A line ends where it ends.",
    "fix": "Delete the semicolon; the end of the line is the end of the step."
   },
   {
    "code": "out prn(x)",
    "says": "Line 1: English++ has no round brackets. Make a step for the part inside: t is a+b, then x is t*c. To call something, use &: add&1&2.",
    "fix": "Drop the brackets and put x in its own spot with a space: out prn x."
   }
  ],
  "practice": [
   {
    "q": "Make a name pets holding 3, add 2 to it, and print it. It should show 5.",
    "answer": "One line to make it, one to add, one to print.",
    "answer_code": "pets is 3\npets add 2\nout prn pets",
    "answer_out": "5"
   },
   {
    "q": "How many words does c is a + b have, and how do you fix it?",
    "answer": "Five, because the spaces around + split it up. Write the math tight: c is a+b."
   },
   {
    "q": "In the block program, why does done print even though it sits after the if?",
    "answer": "It is not indented, so it is outside the block and runs no matter what the test said."
   },
   {
    "q": "What does scores@0 mean, and what does nsq&16 mean?",
    "answer": "scores@0 is the first item in scores (position 0). nsq&16 hands 16 to the square root, giving 4."
   }
  ],
  "watch_out": [
   "Spaces around math marks break a line into too many words. Keep a+b together."
  ],
  "recap": [
   "Name the three spots: who, root, what.",
   "Write math and lists without spaces so they stay one word.",
   "Fill an empty spot with now.",
   "Use two-space indents to put lines inside a block.",
   "Use @ to reach in and & to pass values."
  ]
 },
 {
  "num": 5,
  "title": "How to Read a Root",
  "idea": "A root's first letter names its family and its last two letters name the job. A job pair keeps its meaning in every family, so you can often read a root you have never met. This short chapter turns a long word list into a small set of patterns.",
  "sections": [
   {
    "h": "First letter: the family",
    "text": [
     "There are 21 families, one per letter, with no j, q, v, y or z.",
     "a changes a thing in place, i runs lines if a test passes, l changes a list, t works with text, w repeats while a test holds, and so on. add is in the a family, which is why it changes a number."
    ]
   },
   {
    "h": "Last two letters: the job",
    "text": [
     "A pair means one thing wherever it shows up: so is sort, rv is reversed, rm is remove, mx is the biggest.",
     "So lso sorts a list in place, and cso hands back a sorted copy. The Studio's own tests hold every root to this rule.",
     "Only about a third of roots share a pair with another root; for the rest, the letters are a memory hint."
    ]
   },
   {
    "h": "Six pairs that compare",
    "text": [
     "eq, ne, lt, le, gt and ge mean equal, not equal, less, less-or-equal, greater, greater-or-equal.",
     "Put them after i (if), o (otherwise if), w (while), u (until), s (should) or f (for) and you get dozens of words at once: igt, ogt, wgt, ugt, sgt, fgt."
    ]
   },
   {
    "h": "The one short exception",
    "text": [
     "is has two letters instead of three. It is used so often that it was kept short.",
     "Words for the first and last spots follow the same family idea too: nsq&16 is a number job (square root), tsz&name is a text job (size).",
     "A word that is not in the Chart at all is a name you made, or a C++ function from somewhere else."
    ]
   },
   {
    "h": "A few roots go a long way",
    "text": [
     "The Book counted the roots in the Studio's 24 example programs: 4 roots cover half the lines, 11 cover three in four, 38 cover nine in ten.",
     "Learn a handful well and look the rest up when you need them. The site's Root Finder can decode any root letter by letter."
    ]
   }
  ],
  "lines": [
   {
    "line": "x igt 3",
    "say": "i + gt: if x is greater than 3, run the block below."
   },
   {
    "line": "x ilt 3",
    "say": "i + lt: if x is less than 3."
   },
   {
    "line": "n wge 1",
    "say": "w + ge: keep repeating while n is at least 1."
   },
   {
    "line": "x seq 3",
    "say": "s + eq: x should equal 3, and the program stops if it doesn't."
   },
   {
    "line": "scores lso now",
    "say": "l + so: sort the list scores in place."
   },
   {
    "line": "v lrv now",
    "say": "l + rv: turn the list v back to front."
   },
   {
    "line": "\"a.txt\" hrm now",
    "say": "h + rm: remove the file a.txt from the drive."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Decode these before peeking: ilt, wge, seq, lrv.",
    "answer": "ilt is if less than. wge is while greater than or equal. seq is should equal. lrv is list: reversed."
   },
   {
    "q": "You know so means sort. What is the difference between lso and cso?",
    "answer": "l roots change the list itself, so lso sorts it in place. c roots ask a question and leave the list alone, so cso gives a sorted copy.",
    "answer_code": "v is 3&1&2\nout prn cso&v\nout prn crv&v\nout prn v\nnames is \"Ada\"&\"Bob\"&\"Cy\"\nout prn ctx&names&\", \"",
    "answer_out": "[1, 2, 3]\n[2, 1, 3]\n[3, 1, 2]\nAda, Bob, Cy"
   },
   {
    "q": "Read ole and ult.",
    "answer": "ole is o + le: otherwise, if less than or equal. ult is u + lt: until less than."
   },
   {
    "q": "Which root breaks the three-letter pattern, and why?",
    "answer": "is. It appears in almost every program, so it was given only two letters."
   }
  ],
  "recap": [
   "Read a root's first letter as its family.",
   "Read its last two letters as the job, which keeps its meaning across families.",
   "Recognise the six compare pairs: eq ne lt le gt ge.",
   "Combine those pairs with i, o, w, u, s and f.",
   "Remember is as the one two-letter root."
  ]
 },
 {
  "num": 6,
  "title": "Names and Values",
  "idea": "Programs need to remember things, like a score or a player's name. This chapter shows how to give a value a name, change it, start a box empty, convert between kinds, and seal a value so it can never change.",
  "sections": [
   {
    "h": "is makes a labelled box",
    "text": [
     "Picture a box: the label is the name and the contents are the value.",
     "is creates the box and fills it. A bare word means the box; a word in quotes means just those letters."
    ],
    "code": "score is 7\nout prn score\nout prn \"score\"",
    "out": "7\nscore"
   },
   {
    "h": "Changing what is inside",
    "text": [
     "The first is creates the box. Every later is swaps the contents, and the old value is gone.",
     "You can also build a new value from an existing box, like pears is apples+2."
    ],
    "code": "x is 6\nout prn x\nx is 7\nout prn x",
    "out": "6\n7"
   },
   {
    "h": "Five everyday kinds",
    "text": [
     "Whole numbers (num), decimals (dec), text in double quotes (txt), one letter in single quotes (ltr), and yes-or-no (yno).",
     "You never name the kind with is: the value shows it. Note that no is spelled nay, to keep three letters."
    ],
    "code": "age is 7\nprice is 2.5\nname is \"Ada\"\nfirst is 'A'\nready is yes\nout prn age\nout prn price\nout prn name\nout prn first\nout prn ready",
    "out": "7\n2.5\nAda\nA\nyes"
   },
   {
    "h": "A box keeps its kind",
    "text": [
     "Once a box holds a whole number, it cannot later take text or a decimal; the Studio stops you instead of silently dropping the .5 the way C++ would.",
     "If a decimal is coming, start the box as a decimal."
    ],
    "code": "x is 6.0\nx is 2.5\nout prn x",
    "out": "2.5"
   },
   {
    "h": "mak starts a box empty",
    "text": [
     "mak creates a box of a chosen kind with no value yet.",
     "It always starts clean: 0, empty text, or nay. It never holds leftover junk from memory."
    ],
    "code": "score mak num\nname mak txt\nready mak yno\nout prn score\nout prn \"[@name]\"\nout prn ready",
    "out": "0\n[]\nnay"
   },
   {
    "h": "Turning one kind into another",
    "text": [
     "Write the kind you want, then &, then the value.",
     "num&2.9 chops off the decimal part and gives 2; it does not round."
    ],
    "code": "out prn num&2.9\nout prn dec&3\nout prn txt&42\nout prn ltr&65\nout prn yno&0\nout prn big&5\nout prn flo&0.5",
    "out": "2\n3\n42\nA\nnay\n5\n0.5"
   },
   {
    "h": "mkn seals a value",
    "text": [
     "mkn creates a constant, a box that can never be changed.",
     "Capital letters are a common habit for constants so they stand out, but they are optional."
    ],
    "code": "DAYS mkn 7\nout prn DAYS",
    "out": "7"
   }
  ],
  "lines": [
   {
    "line": "score is 7",
    "say": "Make a box named score holding 7, or put 7 in it if it exists."
   },
   {
    "line": "pet is \"Rex\"",
    "say": "pet holds the text Rex."
   },
   {
    "line": "score mak num",
    "say": "Make an empty whole-number box called score; it starts at 0."
   },
   {
    "line": "name mak txt",
    "say": "Make an empty text box called name."
   },
   {
    "line": "DAYS mkn 7",
    "say": "Make DAYS a constant 7 that can never change."
   },
   {
    "line": "y is num&2.9",
    "say": "y gets 2.9 as a whole number, which is 2."
   },
   {
    "line": "stars mak big",
    "say": "Make stars a big whole number, for values past about 2 billion."
   }
  ],
  "mistakes": [
   {
    "code": "x is 6\nx is \"six\"",
    "says": "Line 2: x is a whole number, so it can't take a text. To read a number out of text use tnm&s.",
    "fix": "Keep x a number (x is 6) or use a different text box for the word."
   },
   {
    "code": "x is 6\nx is 2.5",
    "says": "Line 2: x is a whole number, so 2.5 would lose what is after its point. Make x a decimal from the start, or say so: num&x.",
    "fix": "Start x as a decimal with x is 6.0, then 2.5 fits.",
    "fix_code": "x is 6.0\nx is 2.5\nout prn x",
    "fix_out": "2.5"
   },
   {
    "code": "yes is 6",
    "says": "Line 1: yes is a word the language keeps for itself. Pick another name.",
    "fix": "Choose a name that is not one of the eight special words, such as votes is 6."
   },
   {
    "code": "class is 6",
    "says": "Line 1: class is a word C++ keeps for itself, and English++ is C++ underneath. Pick another name.",
    "fix": "Pick a name C++ has not reserved, such as group is 6."
   },
   {
    "code": "DAYS mkn 7\nDAYS is 8",
    "says": "Line 2: DAYS is a constant, so it can't change.",
    "fix": "Leave the constant alone, or use is instead of mkn if the value really needs to change."
   }
  ],
  "practice": [
   {
    "q": "Put 12 in cookies and seal 3 into FRIENDS. Share the cookies out and print how many each friend gets.",
    "answer": "Divide one box by the other into a new box, then print it.",
    "answer_code": "cookies is 12\nFRIENDS mkn 3\neach is cookies/FRIENDS\nout prn each",
    "answer_out": "4"
   },
   {
    "q": "What does out prn num&2.9 print, and why not 3?",
    "answer": "It prints 2. Turning a decimal into a whole number cuts off everything after the point; it does not round."
   },
   {
    "q": "Which of these are good names: lives_left, 2player, player2, Score?",
    "answer": "lives_left, player2 and Score are fine. 2player is not, because a name has to start with a letter. Score and score count as two different names."
   },
   {
    "q": "Make a box from another one: apples is 3, pears is two more than apples, then print pears.",
    "answer": "Use the box's value in the math on the right.",
    "answer_code": "apples is 3\npears is apples+2\nout prn pears",
    "answer_out": "5"
   }
  ],
  "watch_out": [
   "A whole-number box cannot hold a decimal later. If you will need decimals, start with something like 6.0."
  ],
  "recap": [
   "Name a value with is and change it with another is.",
   "Recognise num, dec, txt, ltr and yno from the value itself.",
   "Start an empty box of a chosen kind with mak.",
   "Convert kinds with kind&value, like num&2.9.",
   "Seal a value with mkn so it never changes.",
   "Avoid the eight special words and C++ keywords as names."
  ]
 },
 {
  "num": 7,
  "title": "Printing",
  "idea": "Printing is how your program talks back. This chapter covers staying on one line or moving to the next, dropping values into text with @, printing several values at once, special marks inside text, the problem channel err, and lining output up in columns.",
  "sections": [
   {
    "h": "prn moves on, put stays",
    "text": [
     "prn prints and then starts a fresh line. put prints and leaves the cursor where it is.",
     "Use a few puts to build up one line, then finish it with prn."
    ],
    "code": "out put \"one \"\nout put \"two \"\nout prn \"three\"\nout prn \"four\"",
    "out": "one two three\nfour"
   },
   {
    "h": "Values inside text with @",
    "text": [
     "Write @ and a name inside quoted text, and the value appears in that spot.",
     "It can reach inside things as well, like @scores@0. A whole list prints in square brackets."
    ],
    "code": "scores is 90&72\nout prn \"The first score is @scores@0.\"\nout prn \"All of them: @scores\"",
    "out": "The first score is 90.\nAll of them: [90, 72]"
   },
   {
    "h": "An actual @ sign",
    "text": [
     "Because @ fills in values, a real @ is written twice."
    ],
    "code": "out prn \"Mail me @@ home.\"",
    "out": "Mail me @ home."
   },
   {
    "h": "Several values with &",
    "text": [
     "Chain values with & and prn puts a single space between each one."
    ],
    "code": "name is \"Ada\"\nage is 36\nout prn name&age\nout prn name&age&\"years\"",
    "out": "Ada 36\nAda 36 years"
   },
   {
    "h": "Backslash marks",
    "text": [
     "Inside text, a backslash comes before a few special marks: \\\" for a quote, \\n for a new line, \\t for a tab, and \\\\ for one backslash."
    ],
    "code": "out prn \"She said \\\"hello\\\".\"\nout prn \"line one\\nline two\"\nout prn \"a\\tb\"\nout prn \"C:\\\\games\"",
    "out": "She said \"hello\".\nline one\nline two\na    b\nC:\\games"
   },
   {
    "h": "err for problems",
    "text": [
     "err also reaches the screen, but it is meant for problem messages.",
     "In the Studio both show in the Output panel; when someone runs your .exe from a command line, they can keep problems apart from answers."
    ],
    "code": "err prn \"That file is missing.\"",
    "out": "That file is missing."
   },
   {
    "h": "Tidy columns",
    "text": [
     "tfx shows a decimal with exactly the number of places you ask for.",
     "tpa pads text with spaces out to a set width. The square brackets here just make the padding visible."
    ],
    "code": "price is 2.5\nout prn tfx&price&2\nname is tpa&\"Ada\"&6\nout prn \"[@name]\"",
    "out": "2.50\n[Ada   ]"
   }
  ],
  "lines": [
   {
    "line": "out prn x",
    "say": "Print x, then go to the next line."
   },
   {
    "line": "out put \"one \"",
    "say": "Print one and a space, and stay on the same line."
   },
   {
    "line": "err prn \"That file is missing.\"",
    "say": "Print a problem message on the problem channel."
   },
   {
    "line": "out prn name&age",
    "say": "Print name and age with a space between them."
   },
   {
    "line": "out prn \"@name is @age years old.\"",
    "say": "Print the sentence with name's and age's values filled in."
   },
   {
    "line": "out prn tfx&price&2",
    "say": "Print price with two places after the point."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Put your favourite food in a box called food, then print one sentence saying you like it a lot, using @.",
    "answer": "Fill the text in with @food.",
    "answer_code": "food is \"pizza\"\nout prn \"I like @food a lot.\"",
    "answer_out": "I like pizza a lot."
   },
   {
    "q": "How would you print the text 50% @ home? Which mark needs doubling?",
    "answer": "Only the @ needs doubling: out prn \"50% @@ home\"."
   },
   {
    "q": "What is the difference between out prn a&b and out prn \"@a@b\"?",
    "answer": "The & version puts a space between the two values. The text version places them exactly where the @ marks are, with no space added."
   }
  ],
  "watch_out": [
   "put does not add a space or a new line for you. End the text with a space if the next piece should not touch it."
  ],
  "recap": [
   "Print with prn to end a line, or put to stay on it.",
   "Fill values into text with @name, and print @ itself as @@.",
   "Print several values at once with &.",
   "Use \\n, \\t, \\\" and \\\\ inside text.",
   "Send problem messages with err prn.",
   "Line up output with tfx and tpa."
  ]
 },
 {
  "num": 8,
  "title": "Math",
  "idea": "This chapter puts the computer to work on numbers. The a family changes a number where it sits, math marks work inside a single word, and the n family hands back answers like square roots, rounding and random dice rolls.",
  "sections": [
   {
    "h": "a roots change a number in place",
    "text": [
     "add, asb, aml and adv add, subtract, multiply and divide, and leave the answer in the same box.",
     "Watch x move from 10 to 15, 12, 24 and finally 6."
    ],
    "code": "x is 10\nx add 5\nout prn x\nx asb 3\nout prn x\nx aml 2\nout prn x\nx adv 4\nout prn x",
    "out": "15\n12\n24\n6"
   },
   {
    "h": "Math marks inside one word",
    "text": [
     "+ - * / % can sit in the third spot as long as there are no spaces.",
     "Multiply and divide go before add and subtract, so 1+2*3 is 7."
    ],
    "code": "a is 2\nb is 3\ntotal is a+b\nout prn total\nout prn a*b\nout prn 10-a",
    "out": "5\n6\n8"
   },
   {
    "h": "No brackets: take a step",
    "text": [
     "To add before multiplying, give the first part its own line and name.",
     "Each step's name also tells a reader what that part means."
    ],
    "code": "sum is 1+2\narea is sum*4\nout prn area",
    "out": "12"
   },
   {
    "h": "Whole numbers versus decimals",
    "text": [
     "Dividing two whole numbers throws away the leftover, so 7/2 is 3.",
     "Make either side a decimal to get 3.5, or use % to get the leftover on its own."
    ],
    "code": "out prn 7/2\nout prn 7.0/2\nout prn 7%2",
    "out": "3\n3.5\n1"
   },
   {
    "h": "n words give answers",
    "text": [
     "n words do not change any box; they work something out and give it back.",
     "Write the word, then &, then what it needs. Rounding has four flavours: nearest, down, up, and just the whole part."
    ],
    "code": "out prn nro&2.5\nout prn ndn&2.9\nout prn nup&2.1\nout prn nwh&-2.9",
    "out": "3\n2\n3\n-2"
   },
   {
    "h": "Keeping a number in bounds",
    "text": [
     "nkb clamps a number between a low and a high limit, which is handy for keeping a player on the screen."
    ],
    "code": "out prn nkb&5&0&10\nout prn nkb&50&0&10\nout prn nkb&-2&0&10",
    "out": "5\n10\n0"
   },
   {
    "h": "Repeatable random numbers",
    "text": [
     "nra rolls a whole number between two limits, nrz does the same with decimals.",
     "Setting the seed with rsd makes the same rolls come out every run, which helps testing. seq stops the program if the two values differ."
    ],
    "code": "now rsd 7\nfirst is nra&1&100\nnow rsd 7\nsecond is nra&1&100\nfirst seq second\nout prn \"They match!\"",
    "out": "They match!"
   }
  ],
  "lines": [
   {
    "line": "x add 5",
    "say": "Add 5 to x and keep the result in x."
   },
   {
    "line": "x amd 5",
    "say": "Replace x with what is left after dividing it by 5."
   },
   {
    "line": "y apw 10",
    "say": "Raise y to the power of 10."
   },
   {
    "line": "total is a+b",
    "say": "total holds a plus b."
   },
   {
    "line": "die is nra&1&6",
    "say": "die gets a random whole number from 1 to 6."
   },
   {
    "line": "now rsd 7",
    "say": "Start the random numbers from seed 7 so they repeat each run."
   },
   {
    "line": "x and 3",
    "say": "Keep only the bits that are on in both x and 3."
   },
   {
    "line": "x asl 2",
    "say": "Push the bits of x two places left, which multiplies by 4."
   }
  ],
  "mistakes": [
   {
    "code": "area is (1+2)*4",
    "says": "Line 1: English++ has no round brackets. Make a step for the part inside: t is a+b, then x is t*c. To call something, use &: add&1&2.",
    "fix": "Split it into two named steps: sum is 1+2, then area is sum*4.",
    "fix_code": "sum is 1+2\narea is sum*4\nout prn area",
    "fix_out": "12"
   },
   {
    "code": "x is 7\ny is x/0",
    "says": "Line 2: I can't divide by zero. Use a number that isn't zero.",
    "fix": "Divide by a number that is not zero, or check the divider first with an if."
   }
  ],
  "practice": [
   {
    "q": "Eight pizza slices, three friends. Print how many whole slices each gets, then how many are left.",
    "answer": "/ gives the whole share and % gives the leftover.",
    "answer_code": "slices is 8\nfriends is 3\nout prn slices/friends\nout prn slices%friends",
    "answer_out": "2\n2"
   },
   {
    "q": "Why does out prn 7/2 print 3 and not 3.5?",
    "answer": "Both numbers are whole, so the answer is whole and the leftover is dropped. Write 7.0/2 to get 3.5."
   },
   {
    "q": "Work out (4+6)*3 in English++ without brackets.",
    "answer": "Do the add as its own named step, then multiply.",
    "answer_code": "part is 4+6\nanswer is part*3\nout prn answer",
    "answer_out": "30"
   },
   {
    "q": "What do nmx&3&8 and nmn&3&8 give?",
    "answer": "nmx gives the bigger value, 8. nmn gives the smaller, 3."
   }
  ],
  "watch_out": [
   "A box that turns out to hold zero can still stop the program when you divide by it, because the Studio can only catch a zero it can see in the line."
  ],
  "recap": [
   "Change a number in place with add, asb, aml, adv, amd and apw.",
   "Write math in one word with + - * / % and no spaces.",
   "Replace brackets with a named step.",
   "Use a decimal when you need the part after the point.",
   "Get answers from n words: nsq, nro, nkb, nra and friends.",
   "Fix random numbers with now rsd for testing."
  ]
 },
 {
  "num": 9,
  "title": "Text",
  "idea": "Words, sentences and single letters are all text, and the t family has a word for most things you will want to do with them. This chapter is a toolbox: join text, turn numbers into text and back, reach single letters, change case, search, split, and match patterns. Dip back in whenever you need a tool.",
  "sections": [
   {
    "h": "Joining with +",
    "text": [
     "+ glues texts together. The space in the middle is its own quoted piece, so the whole join stays one word."
    ],
    "code": "first is \"Ada\"\nlast is \"Lovelace\"\nwhole is first+\" \"+last\nout prn whole",
    "out": "Ada Lovelace"
   },
   {
    "h": "Numbers must become text first",
    "text": [
     "Text only joins with text. txt&n turns a number into text so it can be joined.",
     "Going the other way, tnm pulls a whole number out of text and tdc pulls a decimal."
    ],
    "code": "n is 42\nline is \"n is \"+txt&n\nout prn line",
    "out": "n is 42"
   },
   {
    "h": "Size and single letters",
    "text": [
     "tsz counts the letters. @ with a position reaches one letter, and counting starts at 0."
    ],
    "code": "word is \"Hello\"\nout prn tsz&word\nout prn word@0\nout prn word@4",
    "out": "5\nH\no"
   },
   {
    "h": "New looks, same box",
    "text": [
     "Upper case, lower case, title case, trimming, reversing and padding all hand back a fresh text.",
     "The text in the original box stays exactly as it was."
    ],
    "code": "t is \"Hi there\"\nout prn tuc&t\nout prn tlc&t\nout prn ttc&\"hi there\"\nout prn tti&\"  hi  \"\nout prn trv&\"abc\"\npad is tpa&\"hi\"&5\nout prn \"[@pad]\"",
    "out": "HI THERE\nhi there\nHi There\nhi\ncba\n[hi   ]"
   },
   {
    "h": "Searching inside text",
    "text": [
     "ths, tbg and ted answer yes or nay: does it contain, start with, or end with this piece?",
     "tps gives the position of the first match, or -1 when there is none, since -1 can never be a real position."
    ],
    "code": "t is \"Hello\"\nout prn ths&t&\"lo\"\nout prn tbg&t&\"He\"\nout prn ted&t&\"x\"\nout prn tps&t&\"l\"\nout prn tps&t&\"z\"",
    "out": "yes\nyes\nnay\n2\n-1"
   },
   {
    "h": "Cutting text up",
    "text": [
     "tcu takes a piece by start and length, trp swaps one piece for another, and twd, tsp and tln break text into a list of words, parts or lines."
    ],
    "code": "t is \"Hello World\"\nout prn tcu&t&0&5\nout prn trp&t&\"World\"&\"You\"\nout prn twd&t\nout prn tsp&\"a,b,c\"&\",\"\nout prn tln&\"one\\ntwo\"",
    "out": "Hello\nHello You\n[Hello, World]\n[a, b, c]\n[one, two]"
   },
   {
    "h": "Patterns",
    "text": [
     "A pattern, also known as a regular expression, describes a shape of text rather than exact letters. [0-9]+ means one or more digits.",
     "tmt asks whether a match exists, tma lists every match, trx replaces each match. ^ and $ pin the pattern to the start and end."
    ],
    "code": "out prn tmt&\"a2\"&\"[0-9]+\"\nout prn tmt&\"ab\"&\"[0-9]+\"\nout prn tmt&\"a2\"&\"^[0-9]+$\"\nt is \"I have 2 cats and 10 fish\"\nout prn tma&t&\"[0-9]+\"\nout prn trx&t&\"[0-9]+\"&\"some\"",
    "out": "yes\nnay\nnay\n[2, 10]\nI have some cats and some fish"
   }
  ],
  "lines": [
   {
    "line": "whole is first+\" \"+last",
    "say": "whole is first, a space, and last joined into one text."
   },
   {
    "line": "line is \"n is \"+txt&n",
    "say": "Join the text with n after turning n into text."
   },
   {
    "line": "back is tnm&\"7\"",
    "say": "back gets the whole number 7 read out of the text \"7\"."
   },
   {
    "line": "out prn tsz&word",
    "say": "Print how many letters word has."
   },
   {
    "line": "out prn word@0",
    "say": "Print the first letter of word."
   },
   {
    "line": "out prn tuc&t",
    "say": "Print t in capital letters, leaving t itself unchanged."
   },
   {
    "line": "out prn tps&t&\"l\"",
    "say": "Print where the first l in t is, or -1 if there isn't one."
   }
  ],
  "mistakes": [
   {
    "code": "line is \"n is \"+1",
    "says": "Line 1: I can't add text and a whole number. Turn the number into text first: \"a\"+txt&x.",
    "fix": "Wrap the number with txt& before joining: \"n is \"+txt&1.",
    "fix_code": "n is 42\nline is \"n is \"+txt&n\nout prn line",
    "fix_out": "n is 42"
   }
  ],
  "practice": [
   {
    "q": "Store your name, print it in capitals, then print how many letters it has.",
    "answer": "tuc gives the capital version and tsz counts the letters.",
    "answer_code": "name is \"Ada\"\nout prn tuc&name\nout prn tsz&name",
    "answer_out": "ADA\n3"
   },
   {
    "q": "What does tps&\"Hello\"&\"z\" give, and why that value?",
    "answer": "-1. There is no z, and -1 is used because it can never be a real position."
   },
   {
    "q": "Read the number out of the text \"7\" and print one more than it.",
    "answer": "tnm turns the text into a whole number you can do math with.",
    "answer_code": "back is tnm&\"7\"\nout prn back+1\nhalf is tdc&\"2.5\"\nout prn half*2\nout prn tfx&3.14159&2",
    "answer_out": "8\n5\n3.14"
   },
   {
    "q": "Why does tmt&\"a2\"&\"^[0-9]+$\" say nay when tmt&\"a2\"&\"[0-9]+\" says yes?",
    "answer": "The ^ and $ demand digits from the very start to the very end. a2 starts with a letter, so the whole text does not fit that shape."
   }
  ],
  "watch_out": [
   "The first letter is at position 0, so the last letter of a 5-letter word is at 4."
  ],
  "recap": [
   "Join texts with + and convert numbers with txt& first.",
   "Read numbers out of text with tnm and tdc.",
   "Count letters with tsz and reach one with @position.",
   "Change looks with tuc, tlc, ttc, tti, trv and tpa.",
   "Search with ths, tbg, ted and tps; cut with tcu, trp, twd, tsp and tln.",
   "Match shapes with tmt, tma and trx."
  ]
 },
 {
  "num": 10,
  "title": "Yes, No and Tests",
  "idea": "A computer can only choose once it has a question with a yes-or-no answer. This chapter builds those questions, called tests, from comparisons, joins them with and, or and not, and shows that the answer is an ordinary value you can store and print.",
  "sections": [
   {
    "h": "Comparisons give yes or nay",
    "text": [
     "== != < <= > >= each compare two values and produce yes or nay.",
     "That answer is a value like any other: keep it in a box or print it straight away."
    ],
    "code": "age is 7\nold_enough is age>=6\nout prn old_enough\nout prn age==8",
    "out": "yes\nnay"
   },
   {
    "h": "Comparing text",
    "text": [
     "Texts compare too, and < means earlier in the alphabet.",
     "Capitals matter, so \"ada\" and \"Ada\" are not equal. Compare tlc&name if capitals should not count."
    ],
    "code": "name is \"Ada\"\nout prn name==\"Ada\"\nout prn name!=\"Bob\"\nout prn \"apple\"<\"pear\"",
    "out": "yes\nyes\nyes"
   },
   {
    "h": "And, or, not",
    "text": [
     "&& needs both sides to pass, || needs at least one, and ! turns a yes into nay and back.",
     "The bar for || is on the key above Enter, typed with Shift."
    ],
    "code": "age is 7\ntall is yes\nout prn age>5&&tall\nout prn age>9||tall\nout prn !tall",
    "out": "yes\nyes\nnay"
   },
   {
    "h": "yes and nay as values",
    "text": [
     "A yes-or-no box works anywhere a test does.",
     "yno& turns a number into a yes or no: 0 becomes nay, anything else becomes yes."
    ],
    "code": "door_open is nay\nout prn door_open\nout prn !door_open\nout prn yno&5\nout prn yno&0",
    "out": "nay\nyes\nyes\nnay"
   }
  ],
  "lines": [
   {
    "line": "old_enough is age>=6",
    "say": "old_enough holds yes if age is 6 or more, otherwise nay."
   },
   {
    "line": "out prn age==8",
    "say": "Print whether age equals 8."
   },
   {
    "line": "out prn age>5&&tall",
    "say": "Print yes only if age is over 5 and tall is yes."
   },
   {
    "line": "out prn age>9||tall",
    "say": "Print yes if age is over 9 or tall is yes."
   },
   {
    "line": "out prn !tall",
    "say": "Print the opposite of tall."
   },
   {
    "line": "door_open is nay",
    "say": "door_open holds no."
   }
  ],
  "mistakes": [
   {
    "code": "x is 3\nok is 1<x<5",
    "says": "Line 2: Compare one pair at a time. a<b<c doesn't do what it looks like: write a<b&&b<c.",
    "fix": "Split it into two comparisons joined with &&: 1<x&&x<5.",
    "fix_code": "x is 3\nok is 1<x&&x<5\nout prn ok",
    "fix_out": "yes"
   }
  ],
  "practice": [
   {
    "q": "Put 6 in x and print whether x is even. Hint: an even number divided by 2 leaves nothing over.",
    "answer": "Test the remainder: x%2==0.",
    "answer_code": "x is 6\nout prn x%2==0",
    "answer_out": "yes"
   },
   {
    "q": "What does out prn \"ada\"==\"Ada\" print, and how could you make it yes?",
    "answer": "nay, because capitals count. Compare lowercase versions, such as tlc&name==\"ada\"."
   },
   {
    "q": "With age 7 and tall nay, what do age>5&&tall and age>5||tall give?",
    "answer": "The && version is nay because tall fails. The || version is yes because age>5 passes."
   }
  ],
  "watch_out": [
   "A test uses two equals signs, ==. To change what a box holds, use is, not a single =.",
   "Never chain three things like 1<x<5. Compare one pair at a time and join with &&."
  ],
  "recap": [
   "Compare values with == != < <= > >=.",
   "Compare texts alphabetically, remembering capitals count.",
   "Combine tests with &&, || and !.",
   "Store a test's answer in a box and print it.",
   "Turn numbers into yes or no with yno&."
  ]
 },
 {
  "num": 11,
  "title": "If and Otherwise",
  "idea": "Here your programs start making decisions. i roots run a block only when a test passes, o roots ask another question when the first one fails, oth covers everything left, and bsw picks a block by matching one value against several cases.",
  "sections": [
   {
    "h": "If",
    "text": [
     "A root starting with i means if. The indented lines under it run only when its test passes; otherwise they are skipped.",
     "Lines back at the left edge run whatever happened."
    ],
    "code": "x is 6\nx igt 3\n  out prn \"big\"\nout prn \"done\"",
    "out": "big\ndone"
   },
   {
    "h": "When the test fails",
    "text": [
     "Change x to 2 and the test no longer passes, so only done prints."
    ],
    "code": "x is 2\nx igt 3\n  out prn \"big\"\nout prn \"done\"",
    "out": "done"
   },
   {
    "h": "Otherwise",
    "text": [
     "now oth now catches every case the if did not. It sits right after the if block at the same indent."
    ],
    "code": "x is 2\nx igt 3\n  out prn \"big\"\nnow oth now\n  out prn \"small\"",
    "out": "small"
   },
   {
    "h": "Otherwise, if",
    "text": [
     "o roots ask a fresh question only when everything above failed. You can stack as many as you need.",
     "Tests are tried from the top and the first one to pass wins, so exactly one block runs."
    ],
    "code": "x is 4\nx ilt 2\n  out prn \"small\"\nx olt 5\n  out prn \"medium\"\nnow oth now\n  out prn \"large\"",
    "out": "medium"
   },
   {
    "h": "Blocks inside blocks",
    "text": [
     "An if can sit inside another if, indented one more step.",
     "The indent tells you which oth belongs to which if."
    ],
    "code": "sunny is yes\nwarm is nay\nsunny ieq yes\n  warm ieq yes\n    out prn \"Go swimming!\"\n  now oth now\n    out prn \"Bring a coat.\"\nnow oth now\n  out prn \"Stay in and code.\"",
    "out": "Bring a coat."
   },
   {
    "h": "One value or another with iff",
    "text": [
     "iff&test&a&b gives a when the test passes and b when it does not, all inside one word."
    ],
    "code": "x is 6\nsize is iff&x>3&\"big\"&\"small\"\nout prn size",
    "out": "big"
   },
   {
    "h": "Matching cases with bsw",
    "text": [
     "bsw picks a value to check, each bcs lists values that match, and bdf handles the rest.",
     "Each case finishes on its own, so the C++ trap of forgetting break and falling into the next case cannot happen."
    ],
    "code": "day is 6\nday bsw now\n  now bcs 6&7\n    out prn \"the weekend\"\n  now bcs 1\n    out prn \"Monday\"\n  now bdf now\n    out prn \"a work day\"",
    "out": "the weekend"
   }
  ],
  "lines": [
   {
    "line": "x igt 3",
    "say": "If x is greater than 3, run the block below."
   },
   {
    "line": "x ieq 3",
    "say": "If x equals 3, run the block below."
   },
   {
    "line": "x olt 5",
    "say": "Otherwise, if x is less than 5, run this block instead."
   },
   {
    "line": "now oth now",
    "say": "Otherwise, for every remaining case, run this block."
   },
   {
    "line": "x%2 ieq 0",
    "say": "If x divided by 2 leaves nothing over, run the block."
   },
   {
    "line": "size is iff&x>3&\"big\"&\"small\"",
    "say": "size is big when x is over 3, small when it isn't."
   },
   {
    "line": "day bsw now",
    "say": "Pick a case block by the value of day."
   },
   {
    "line": "now bcs 6&7",
    "say": "This case runs when the value is 6 or 7."
   },
   {
    "line": "now bdf now",
    "say": "This case runs for any value no other case matched."
   }
  ],
  "mistakes": [
   {
    "code": "x is 4\nout prn x\nnow oth now\n  out prn \"large\"",
    "says": "Line 3: oth means otherwise, so it needs an if right above it, at the same indent.",
    "fix": "Put an if block directly above the oth line, at the same indent, such as x igt 5 with its own indented line."
   }
  ],
  "practice": [
   {
    "q": "score holds 85. Print A for 90 and up, B for 80 and up, and Try again for anything else.",
    "answer": "Start with the highest bar, then step down with an otherwise-if, and finish with oth.",
    "answer_code": "score is 85\nscore ige 90\n  out prn \"A\"\nscore oge 80\n  out prn \"B\"\nnow oth now\n  out prn \"Try again\"",
    "answer_out": "B"
   },
   {
    "q": "Why should x ilt 5 come before x olt 10 and not after?",
    "answer": "The first test that passes wins. If the 10 test went first, every number under 5 would be caught by it and the 5 test could never run."
   },
   {
    "q": "Put 6 in x and Ada in name. Print both if x is over 3 and the name is Ada, then print even if x is even.",
    "answer": "A whole test can go in the first spot with ieq yes.",
    "answer_code": "x is 6\nname is \"Ada\"\nx>3&&name==\"Ada\" ieq yes\n  out prn \"both\"\nx%2 ieq 0\n  out prn \"even\"",
    "answer_out": "both\neven"
   }
  ],
  "watch_out": [
   "Order matters in an if chain: put the narrowest test first, because a wider test above it would swallow its cases."
  ],
  "recap": [
   "Run a block only when a test passes with the i roots.",
   "Ask a follow-up question with the o roots.",
   "Catch everything else with now oth now.",
   "Nest ifs by indenting further.",
   "Choose a value in one word with iff.",
   "Match one value against cases with bsw, bcs and bdf."
  ]
 },
 {
  "num": 12,
  "title": "Loops",
  "idea": "A loop repeats lines so you do not have to write them again. This chapter covers counting loops, while loops, forever loops you break out of, skipping a turn, leaving an outer loop by name, walking through a list, and do-until loops that always run once.",
  "sections": [
   {
    "h": "Counting with flt",
    "text": [
     "flt creates the counter for you, starting at 0 and going up by 1 until the test fails.",
     "So i flt 3 runs three times, with i as 0, 1 and 2. fle includes the last number, and fne stops on reaching it."
    ],
    "code": "i flt 3\n  out prn i",
    "out": "0\n1\n2"
   },
   {
    "h": "Start elsewhere, or count down",
    "text": [
     "Make the counter yourself first if it should start somewhere other than 0.",
     "fgt and fge count down, so they always need a counter you made, to know where to begin."
    ],
    "code": "count is 3\ncount fgt 0\n  out prn count\nout prn \"Blast off!\"\nd is 2\nd fge 0\n  out prn d",
    "out": "3\n2\n1\nBlast off!\n2\n1\n0"
   },
   {
    "h": "While a test passes",
    "text": [
     "w roots repeat as long as their test holds, which suits jobs where you do not know the count ahead of time.",
     "Here n doubles until it is no longer under 100, ending at 128."
    ],
    "code": "n is 1\nn wlt 100\n  n aml 2\nout prn n",
    "out": "128"
   },
   {
    "h": "Forever, then break out",
    "text": [
     "now wfv now never stops on its own; ebk leaves it.",
     "ebk can carry its own test in the third spot, so the check and the exit fit on one line."
    ],
    "code": "n is 0\nnow wfv now\n  n add 1\n  now ebk n==3\nout prn n",
    "out": "3"
   },
   {
    "h": "Skip a turn with enx",
    "text": [
     "enx jumps straight to the loop's next turn, skipping the rest of the block.",
     "Here 1 is skipped and the loop is left at 3, so only 0 and 2 print."
    ],
    "code": "i flt 5\n  i enx i==1\n  now ebk i==3\n  out prn i",
    "out": "0\n2"
   },
   {
    "h": "Leave an outer loop by name",
    "text": [
     "Put a loop's counter name in the first spot of ebk or enx to act on that loop.",
     "a ebk now leaves the a loop, and everything inside it, in one step. C++ would need an extra flag for this."
    ],
    "code": "a flt 3\n  b flt 3\n    a*b ieq 2\n      a ebk now\n    out prn a*10+b\nout prn \"done\"",
    "out": "0\n1\n2\n10\n11\ndone"
   },
   {
    "h": "Walk through with fea, or do-until",
    "text": [
     "fea hands you each item of a list, or each letter of a text, in order.",
     "now bdo now runs its block first and checks afterwards; a u line at the same indent says when to stop. It always runs at least once."
    ],
    "code": "n is 0\nnow bdo now\n  n add 2\nn uge 6\nout prn n",
    "out": "6"
   }
  ],
  "lines": [
   {
    "line": "i flt 3",
    "say": "Count i from 0 while it is less than 3."
   },
   {
    "line": "count fgt 0",
    "say": "Count count down while it is greater than 0."
   },
   {
    "line": "n wlt 100",
    "say": "Repeat the block while n is less than 100."
   },
   {
    "line": "now ebk n==3",
    "say": "Break out of the loop once n equals 3."
   },
   {
    "line": "i enx i==1",
    "say": "Skip to i's next turn when i is 1."
   },
   {
    "line": "a ebk now",
    "say": "Leave the loop counting with a, even from a loop inside it."
   },
   {
    "line": "s fea scores",
    "say": "Run the block once for each item s in scores."
   },
   {
    "line": "now bdo now",
    "say": "Run this block first, then check the until line below."
   },
   {
    "line": "n uge 6",
    "say": "End the do block once n is 6 or more."
   }
  ],
  "mistakes": [
   {
    "code": "now bdo now\n  out prn 1",
    "says": "Line 1: A do block ends with until, at the same indent: x ueq 3.",
    "fix": "Add a u line straight after the block, lined up with now bdo now, that says when to stop.",
    "fix_code": "n is 0\nnow bdo now\n  n add 2\nn uge 6\nout prn n",
    "fix_out": "6"
   }
  ],
  "practice": [
   {
    "q": "Print the 5 times table from 5 to 50, starting i at 1 and using fle.",
    "answer": "Count 1 to 10 and print each times 5.",
    "answer_code": "i is 1\ni fle 10\n  out prn i*5",
    "answer_out": "5\n10\n15\n20\n25\n30\n35\n40\n45\n50"
   },
   {
    "q": "Put one counting loop inside another to print a triangle of stars, 1 star on the first row up to 4 on the last.",
    "answer": "The inner counter starts at 0, so star fle row runs one more time than the row number.",
    "answer_code": "row flt 4\n  star fle row\n    out put \"*\"\n  out prn \"\"",
    "answer_out": "*\n**\n***\n****"
   },
   {
    "q": "Walk through the scores 90, 72 and 85 and print each one.",
    "answer": "fea gives each item in turn, first to last.",
    "answer_code": "scores is 90&72&85\ns fea scores\n  out prn s",
    "answer_out": "90\n72\n85"
   },
   {
    "q": "Which loop fits: asking a question and then checking the answer?",
    "answer": "A do-until loop (now bdo now with a u line), because the question has to be asked before there is anything to test."
   }
  ],
  "watch_out": [
   "A while loop must change something its test looks at, or it never ends. If a program seems stuck, Shift+F5 stops it."
  ],
  "recap": [
   "Count with flt, fle and fne; count down with fgt and fge.",
   "Repeat while a test holds with the w roots.",
   "Loop forever with wfv and leave with ebk.",
   "Skip a turn with enx, and name a counter to act on an outer loop.",
   "Walk a list or text with fea.",
   "Run once first with bdo and a u line."
  ]
 },
 {
  "num": 13,
  "title": "More Ways With Text",
  "idea": "Seven more t words answer questions about text without changing it. You can repeat a piece, count a piece, test single letters, fill a pattern with values, and ask what kind a value is. Together they make tidy output easy.",
  "sections": [
   {
    "h": "Repeat and count",
    "text": [
     "tre takes a text and a number, and hands back that text over and over. tct looks inside a text and tells you how often a smaller piece turns up."
    ],
    "code": "out prn tre&\"ha\"&3\nsong is \"la la la\"\nout prn tct&song&\"la\"",
    "out": "hahaha\n3"
   },
   {
    "h": "Sorting out letters",
    "text": [
     "fea visits each letter of the text in turn. Three tests decide which counter grows: tlr for letters, tdg for digits, tws for spaces.",
     "Room 12 has four letters, two digits and one space."
    ],
    "code": "s is \"Room 12\"\nletters is 0\ndigits is 0\nspaces is 0\nc fea s\n  tlr&c ieq yes\n    letters add 1\n  tdg&c ieq yes\n    digits add 1\n  tws&c ieq yes\n    spaces add 1\nout prn letters\nout prn digits\nout prn spaces",
    "out": "4\n2\n1"
   },
   {
    "h": "Holes in a pattern",
    "text": [
     "tfa reads a pattern and puts the next value into each {} it finds. A hole can carry a shape too: .2f keeps two places after the point, and >5 or <5 gives the value five spaces, pushed right or left."
    ],
    "code": "name is \"Ada\"\nscore is 9\nout prn tfa&\"{} has {} points\"&name&score\nout prn tfa&\"{:.2f}\"&3.14159\nout prn tfa&\"[{:>5}]\"&42\nout prn tfa&\"[{:<5}]\"&42",
    "out": "Ada has 9 points\n3.14\n[   42]\n[42   ]"
   },
   {
    "h": "Asking the kind",
    "text": [
     "ttp answers with the name of a value's kind, as text. A number gives num and a text gives txt."
    ],
    "code": "x is 5\ny is \"hi\"\nout prn ttp&x\nout prn ttp&y",
    "out": "num\ntxt"
   }
  ],
  "lines": [
   {
    "line": "out prn tre&\"ha\"&3",
    "say": "Print ha three times in a row."
   },
   {
    "line": "out prn tct&song&\"la\"",
    "say": "Print how often la appears inside song."
   },
   {
    "line": "c fea s",
    "say": "Take each letter of s, one by one, and call it c."
   },
   {
    "line": "tdg&c ieq yes",
    "say": "If c is a digit, run the lines moved in below."
   },
   {
    "line": "letters add 1",
    "say": "Make the letters counter one bigger."
   },
   {
    "line": "out prn tfa&\"{:.2f}\"&3.14159",
    "say": "Print the number with just two places after the point."
   },
   {
    "line": "out prn ttp&x",
    "say": "Print the name of the kind x holds."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Make a row of 20 dashes with tre. After that, show a name with an age on one line through tfa.",
    "answer": "tre builds the dash row. tfa puts Ada and 10 into the two holes of the pattern.",
    "answer_code": "out prn tre&\"-\"&20\nout prn tfa&\"{} is {}\"&\"Ada\"&10",
    "answer_out": "--------------------\nAda is 10"
   },
   {
    "q": "How many times does the piece an show up in banana? Use tct.",
    "answer": "tct counts the matches: b-an-an-a holds two of them.",
    "answer_code": "out prn tct&\"banana\"&\"an\"",
    "answer_out": "2"
   },
   {
    "q": "Print the word hi five times using one line.",
    "answer": "tre with 5 repeats the text five times.",
    "answer_code": "out prn tre&\"hi\"&5",
    "answer_out": "hihihihihi"
   }
  ],
  "watch_out": [
   "A hole with room for 5 is the trick for neat columns: each value takes the same width."
  ],
  "recap": [
   "Repeat a text any number of times with tre.",
   "Count how often a piece appears in a text with tct.",
   "Test one letter with tlr, tdg or tws.",
   "Fill a pattern's {} holes with tfa, and shape them with .2f, >5 or <5.",
   "Find out a value's kind with ttp."
  ]
 },
 {
  "num": 14,
  "title": "Talking With Your Program",
  "idea": "Until now a program only talked. This chapter lets it ask the person at the keyboard and use the answer. get reads one word or number, gln reads a whole line, and wln keeps reading line after line.",
  "sections": [
   {
    "h": "Ask a question",
    "text": [
     "The text after get is shown as the question. The program then waits, and whatever is typed lands in name.",
     "In the Studio you type the answer into the box at the bottom of the Output panel and press Enter."
    ],
    "code": "name get \"What is your name? \"\nout prn \"Hello, @name!\"",
    "out": "What is your name? Ada\nHello, Ada!"
   },
   {
    "h": "Ask for a number",
    "text": [
     "Making age with mak num first tells get to expect a number. Then age can be used in sums straight away."
    ],
    "code": "age mak num\nage get \"How old are you? \"\nnext is age+1\nout prn \"Next year you will be @next.\"",
    "out": "How old are you? 9\nNext year you will be 10."
   },
   {
    "h": "Wrong answers get a second chance",
    "text": [
     "If someone types a word where a number belongs, the program does not break. It simply asks the same question again until it gets a number."
    ],
    "code": "age mak num\nage get \"How old are you? \"\nout prn \"You are @age.\"",
    "out": "How old are you? nine\nPlease type a number.\nHow old are you? 9\nYou are 9."
   },
   {
    "h": "A whole line",
    "text": [
     "get stops at the first space. gln keeps everything up to Enter, spaces included."
    ],
    "code": "story gln \"Tell me something: \"\nout prn \"You said: @story\"",
    "out": "Tell me something: I like cats a lot\nYou said: I like cats a lot"
   },
   {
    "h": "No question at all",
    "text": [
     "inp in the last spot means read from the keyboard without showing any question."
    ],
    "code": "out prn \"Type two numbers.\"\na mak num\nb mak num\na get inp\nb get inp\nout prn a+b",
    "out": "Type two numbers.\n3\n4\n7"
   },
   {
    "h": "Putting it together",
    "text": [
     "One program asks for a name and an age, then picks the right reply with an if and an otherwise."
    ],
    "code": "name get \"What is your name? \"\nage mak num\nage get \"How old are you? \"\nage ilt 13\n  out prn \"Hi, @name! You're still a kid.\"\nnow oth now\n  years is age-13\n  out prn \"Hi, @name! You stopped being a kid @years years ago.\"",
    "out": "What is your name? Ada\nHow old are you? 36\nHi, Ada! You stopped being a kid 23 years ago."
   }
  ],
  "lines": [
   {
    "line": "name get \"What is your name? \"",
    "say": "Show the question, wait, and keep the typed word in name."
   },
   {
    "line": "age mak num",
    "say": "Make an empty number box called age, so get knows to want a number."
   },
   {
    "line": "ready mak yno",
    "say": "Make a yes-or-no box, so get only accepts yes or no."
   },
   {
    "line": "story gln \"Tell me something: \"",
    "say": "Ask, then keep the whole typed line in story."
   },
   {
    "line": "a get inp",
    "say": "Read a value from the keyboard with no question shown."
   },
   {
    "line": "line wln inp",
    "say": "Keep reading lines from the keyboard, one per trip, into line."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Ask for two numbers and print what they add up to.",
    "answer": "Make both boxes as numbers first, ask for each, then print a+b.",
    "answer_code": "a mak num\nb mak num\na get \"First number? \"\nb get \"Second number? \"\nout prn a+b",
    "answer_out": "First number? 3\nSecond number? 4\n7"
   },
   {
    "q": "Ask for one word and print it backward.",
    "answer": "get keeps the word, and trv turns it around.",
    "answer_code": "word get \"Give me a word: \"\nout prn trv&word",
    "answer_out": "Give me a word: stressed\ndesserts"
   },
   {
    "q": "Why would a program that reads lines with wln never end in the Studio?",
    "answer": "The keyboard never runs dry there, so wln always has another line to wait for. Stop it with Shift+F5."
   }
  ],
  "watch_out": [
   "Leave a space at the end of a question, so the typed answer doesn't run into it.",
   "get takes only up to the first space. Use gln when the answer may hold spaces."
  ],
  "recap": [
   "Ask a question and keep the answer with get.",
   "Get a number or a yes/no by making the box with its kind first.",
   "Read a whole line, spaces and all, with gln.",
   "Read without a question using inp.",
   "Read line after line with wln."
  ]
 },
 {
  "num": 15,
  "title": "Watching Your Program Run",
  "idea": "A bug is a program that runs fine but gives the wrong answer. The Studio can pause a running program on any line and show what every name holds. Pausing, looking and stepping is how you track a bug down instead of guessing.",
  "sections": [
   {
    "h": "A quiet bug",
    "text": [
     "The goal is 1+2+3+4+5, which is 15. The program prints 10, and the Studio shows no error at all. Something in the logic is off."
    ],
    "code": "total is 0\ni flt 5\n  total add i\nout prn total",
    "out": "10"
   },
   {
    "h": "Pause it and look",
    "text": [
     "Put the cursor on the total add i line and press F9: a red dot, a breakpoint, appears. F6 starts the program and pauses on that line before it runs.",
     "The Debug panel lists every name with its current value. Here i is 0, but the sum was meant to start at 1."
    ]
   },
   {
    "h": "Step and find it",
    "text": [
     "F10 runs a single line and pauses again; a value that just changed shows in bold. Stepping shows i going 0, 1, 2, 3, 4 and never reaching 5.",
     "Adding i+1 instead of i fixes it, and the answer becomes 15."
    ],
    "code": "total is 0\ni flt 5\n  total add i+1\nout prn total",
    "out": "15"
   },
   {
    "h": "The other keys",
    "text": [
     "F11 steps into a function a line uses, and Shift+F11 finishes that function. F5 carries on to the next red dot, and Shift+F5 stops everything.",
     "Ctrl+F5 skips the build and lets Reader run the lines directly. It is slow, but fine for small programs. Reader can't open windows or use C++ or libraries."
    ]
   },
   {
    "h": "A loop that stops one short",
    "text": [
     "This one should count 5 down to 1, but it ends at 2. Watch n with F6 and F10 and you will see why."
    ],
    "code": "n is 5\nn wgt 1\n  out prn n\n  n asb 1",
    "out": "5\n4\n3\n2"
   }
  ],
  "lines": [
   {
    "line": "total add i",
    "say": "Add the value of i to total."
   },
   {
    "line": "i flt 5",
    "say": "Count i from 0 while it is less than 5."
   },
   {
    "line": "total add i+1",
    "say": "Add one more than i to total."
   },
   {
    "line": "n wgt 1",
    "say": "Keep looping while n is greater than 1."
   },
   {
    "line": "n wge 1",
    "say": "Keep looping while n is 1 or more."
   },
   {
    "line": "n asb 1",
    "say": "Take 1 away from n."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "The countdown above prints 5, 4, 3, 2 but never 1. Step through it and fix it.",
    "answer": "Stepping shows n reach 1, and then wgt asks if 1 is greater than 1, which it isn't, so the loop ends. wge lets 1 through.",
    "answer_code": "n is 5\nn wge 1\n  out prn n\n  n asb 1",
    "answer_out": "5\n4\n3\n2\n1"
   },
   {
    "q": "Which key would you press to start a program and pause it on its very first line, without placing a red dot?",
    "answer": "Press F10 while nothing is running. It starts the program and pauses on the first line."
   },
   {
    "q": "Fix this loop so it adds 1 to 3 and prints 6: total is 0, then i flt 3 with total add i, then out prn total.",
    "answer": "flt counts 0, 1, 2. Adding i+1 gives 1, 2, 3, and those add up to 6.",
    "answer_code": "total is 0\ni flt 3\n  total add i+1\nout prn total",
    "answer_out": "6"
   }
  ],
  "watch_out": [
   "Reader, used by Ctrl+F5 and F6, can't open a window or use C++ or a library. Press F5 for those programs.",
   "If a program stops by itself while you are watching, for example on a divide by zero, all the boxes are still there to inspect."
  ],
  "recap": [
   "Set and clear a breakpoint with F9.",
   "Start a watched run with F6 and read every value in the Debug panel.",
   "Step one line at a time with F10, and into functions with F11.",
   "Carry on with F5, or stop with Shift+F5.",
   "Run small programs right away with Ctrl+F5, using Reader."
  ]
 },
 {
  "num": 16,
  "title": "Project: Guess the Number",
  "idea": "This project builds a complete guessing game from parts you already know: random numbers, boxes, tests, a loop and get. You grow it one small step at a time and run it after every step, the way working programmers do.",
  "sections": [
   {
    "h": "Pick a secret",
    "text": [
     "nra&1&100 gives a random whole number from 1 to 100. Printing it is just a check that the step works; run it a few times and it changes."
    ],
    "code": "secret is nra&1&100\nout prn secret"
   },
   {
    "h": "Take one guess",
    "text": [
     "guess is made as a number box first, so get asks for a number."
    ],
    "code": "secret is nra&1&100\nguess mak num\nguess get \"Your guess? \"\nout prn \"You said @guess.\"",
    "out": "Your guess? 50\nYou said 50."
   },
   {
    "h": "Low, high or right",
    "text": [
     "Three outcomes need an if, an otherwise-if and an otherwise. The secret is fixed at 42 while testing, so every run behaves the same."
    ],
    "code": "secret is 42\nguess mak num\nguess get \"Your guess? \"\nguess ilt secret\n  out prn \"Too low\"\nguess ogt secret\n  out prn \"Too high\"\nnow oth now\n  out prn \"Right!\"",
    "out": "Your guess? 50\nToo high"
   },
   {
    "h": "Keep asking",
    "text": [
     "now wfv now loops with no end of its own. now ebk now jumps out once the guess is right.",
     "The guess box is made once, above the loop; only the asking and testing repeat."
    ],
    "code": "secret is 42\nguess mak num\nnow wfv now\n  guess get \"Your guess? \"\n  guess ilt secret\n    out prn \"Too low\"\n  guess ogt secret\n    out prn \"Too high\"\n  now oth now\n    out prn \"Right!\"\n    now ebk now",
    "out": "Your guess? 50\nToo high\nYour guess? 25\nToo low\nYour guess? 42\nRight!"
   },
   {
    "h": "Count the tries",
    "text": [
     "A tries box starts at 0 and grows by 1 on each pass. The winning message shows the count."
    ],
    "code": "secret is 42\ntries is 0\nguess mak num\nnow wfv now\n  guess get \"Your guess? \"\n  tries add 1\n  guess ilt secret\n    out prn \"Too low\"\n  guess ogt secret\n    out prn \"Too high\"\n  now oth now\n    out prn \"Right, in @tries tries!\"\n    now ebk now",
    "out": "Your guess? 50\nToo high\nYour guess? 25\nToo low\nYour guess? 42\nRight, in 3 tries!"
   },
   {
    "h": "The finished game",
    "text": [
     "The random secret comes back. now rsd 3 fixes the seed so test runs repeat; remove it to play for real.",
     "Fifteen lines, every one three words apart from the note line. A typed word instead of a number is handled by get for free."
    ],
    "code": "note The guessing game\nnow rsd 3\nsecret is nra&1&100\ntries is 0\nguess mak num\nnow wfv now\n  guess get \"Your guess? \"\n  tries add 1\n  guess ilt secret\n    out prn \"Too low\"\n  guess ogt secret\n    out prn \"Too high\"\n  now oth now\n    out prn \"Right, in @tries tries!\"\n    now ebk now"
   }
  ],
  "lines": [
   {
    "line": "secret is nra&1&100",
    "say": "secret holds a random number between 1 and 100."
   },
   {
    "line": "guess mak num",
    "say": "Make guess as an empty number box."
   },
   {
    "line": "guess ilt secret",
    "say": "If the guess is below the secret, run the lines moved in."
   },
   {
    "line": "guess ogt secret",
    "say": "Otherwise, if the guess is above the secret, run these lines."
   },
   {
    "line": "now wfv now",
    "say": "Repeat the moved-in lines forever, until something leaves."
   },
   {
    "line": "now ebk now",
    "say": "Leave the loop right now."
   },
   {
    "line": "tries add 1",
    "say": "Count one more try."
   },
   {
    "line": "now rsd 3",
    "say": "Seed the random numbers, so every run picks the same ones."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Tell the player Getting warm! when the guess is within 5 of the secret.",
    "answer": "nab&guess-secret is how far off the guess is. Test for 0 first (a win), then for 5 or less.",
    "answer_code": "secret is 42\nguess mak num\nnow wfv now\n  guess get \"Your guess? \"\n  away is nab&guess-secret\n  away ieq 0\n    out prn \"Right!\"\n    now ebk now\n  away ile 5\n    out prn \"Getting warm!\"\n  guess ilt secret\n    out prn \"Too low\"\n  now oth now\n    out prn \"Too high\"",
    "answer_out": "Your guess? 50\nToo high\nYour guess? 44\nGetting warm!\nToo high\nYour guess? 42\nRight!"
   },
   {
    "q": "Give the player only 7 tries, and reveal the secret if they run out.",
    "answer": "A wlt loop stops after 7 passes. A won box remembers whether the player got it, so the line after the loop can pick the right message.",
    "answer_code": "secret is 42\nwon is nay\nguess mak num\ntries is 0\ntries wlt 7\n  tries add 1\n  guess get \"Your guess? \"\n  guess ieq secret\n    won is yes\n    now ebk now\nwon ieq yes\n  out prn \"Right, in @tries tries!\"\nnow oth now\n  out prn \"Out of tries! It was @secret.\"",
    "answer_out": "Your guess? 1\nYour guess? 2\nYour guess? 3\nYour guess? 4\nYour guess? 5\nYour guess? 6\nYour guess? 7\nOut of tries! It was 42."
   },
   {
    "q": "After a game, ask if they want another, and keep going until they say no.",
    "answer": "Put the game in its own function, then call it inside a forever loop that leaves when the answer is no.",
    "answer_code": "now wfv now\n  now play_game now\n  again get \"Play again? \"\n  now ebk again==\"no\"\nout prn \"Thanks for playing!\"\n\nplay_game dfn now\n  secret is 2\n  guess mak num\n  now wfv now\n    guess get \"Your guess? \"\n    now ebk guess==secret\n  out prn \"Right!\"",
    "answer_out": "Your guess? 2\nRight!\nPlay again? yes\nYour guess? 1\nYour guess? 2\nRight!\nPlay again? no\nThanks for playing!"
   }
  ],
  "watch_out": [
   "When a step misbehaves, set a red dot with F9 and watch it with F6."
  ],
  "recap": [
   "Plan a program as a chain of small, runnable steps.",
   "Pick random numbers with nra, and make them repeatable with rsd.",
   "Choose among three outcomes with ilt, ogt and oth.",
   "Loop until done with wfv and ebk.",
   "Count with a box that grows by 1 each pass."
  ]
 },
 {
  "num": 17,
  "title": "Lists",
  "idea": "A list keeps many values in one name, in order. You can reach any of them by its position, count them, grow and shrink the list, and walk through it. The kind is vec, after C++'s vector.",
  "sections": [
   {
    "h": "Make a list and reach in",
    "text": [
     "Joining values with & makes a list. @ followed by a position reads one item, and putting scores@1 in the first spot changes that item.",
     "Positions start at 0, so in a list of three the last one is at 2."
    ],
    "code": "scores is 90&72&85\nout prn scores@0\nout prn scores@2\nscores@1 is 75\nout prn scores",
    "out": "90\n85\n[90, 75, 85]"
   },
   {
    "h": "A position that isn't there",
    "text": [
     "Asking for position 9 in a three-item list stops the program on that line with a plain message. C++ would quietly read junk memory instead, which is a much worse bug."
    ],
    "code": "scores is 90&72&85\nout prn scores@0\nout prn scores@9",
    "out": "90\n\nThe program stopped on line 3:\n    out prn scores@9\nIt used a position that is not in the collection or text."
   },
   {
    "h": "How many?",
    "text": [
     "cct&scores gives the size. One less than the size is the last position."
    ],
    "code": "scores is 90&72&85\nout prn cct&scores\nlast is cct&scores\nlast asb 1\nout prn scores@last",
    "out": "3\n85"
   },
   {
    "h": "Start empty, then add",
    "text": [
     "mak with vec@num makes an empty list of numbers; vec@txt makes one of texts. add puts a value on the end."
    ],
    "code": "scores mak vec@num\nnames mak vec@txt\nout prn scores\nout prn names\nscores add 90\nscores add 72\nnames add \"Ada\"\nout prn scores\nout prn names",
    "out": "[]\n[]\n[90, 72]\n[Ada]"
   },
   {
    "h": "Changing a list",
    "text": [
     "The l family edits the list in place: lin inserts at a position, lrm removes every copy of a value, ldx removes a position, and lpl pops the last item."
    ],
    "code": "v is 5&3&9\nv add 4\nout prn v\nv lin 0&8\nout prn v\nv lrm 3\nout prn v\nv ldx 0\nout prn v\nv lpl now\nout prn v",
    "out": "[5, 3, 9, 4]\n[8, 5, 3, 9, 4]\n[8, 5, 9, 4]\n[5, 9, 4]\n[5, 9]"
   },
   {
    "h": "Walk and change",
    "text": [
     "fea hands you each item itself, not a copy, so changing s changes the list."
    ],
    "code": "scores is 1&2&3\ns fea scores\n  s aml 10\nout prn scores",
    "out": "[10, 20, 30]"
   },
   {
    "h": "A grid",
    "text": [
     "A list can hold lists. Two @ steps reach a row and then a place in it."
    ],
    "code": "grid mak vec@vec@num\ngrid add 1&2\ngrid add 3&4\nout prn grid\nout prn grid@1@0\ngrid@1@0 is 9\nout prn grid",
    "out": "[[1, 2], [3, 4]]\n3\n[[1, 2], [9, 4]]"
   }
  ],
  "lines": [
   {
    "line": "scores is 90&72&85",
    "say": "Make scores, a list of 90, 72 and 85."
   },
   {
    "line": "scores@1 is 75",
    "say": "Change the item at position 1 to 75."
   },
   {
    "line": "last is cct&scores",
    "say": "last holds how many items scores has."
   },
   {
    "line": "scores mak vec@num",
    "say": "Make scores as an empty list of numbers."
   },
   {
    "line": "v lin 0&8",
    "say": "Insert 8 into v at position 0."
   },
   {
    "line": "v ldx 0",
    "say": "Remove whatever is at position 0 of v."
   },
   {
    "line": "v lso now",
    "say": "Sort v from smallest to biggest."
   },
   {
    "line": "name fea names",
    "say": "Take each item of names in turn, calling it name."
   },
   {
    "line": "grid mak vec@vec@num",
    "say": "Make grid, a list of lists of numbers."
   }
  ],
  "mistakes": [
   {
    "code": "scores is 1&2&3\ns fea scores\n  scores add 4",
    "says": "Line 3: You can't change scores while fea is walking through it: C++ would read memory that is gone. Walk through a copy: copy is scores.",
    "fix": "Walk through a copy of the list, and change the real list inside the loop.",
    "fix_code": "scores is 1&2&3\ncopy is scores\ns fea copy\n  scores add 4\nout prn scores",
    "fix_out": "[1, 2, 3, 4, 4, 4]"
   }
  ],
  "practice": [
   {
    "q": "Make a list of five numbers, sort it, and print the smallest and the biggest.",
    "answer": "After lso the smallest sits first and the biggest last, so cfr and cla pick them out.",
    "answer_code": "v is 5&2&9&1&7\nv lso now\nout prn cfr&v\nout prn cla&v",
    "answer_out": "1\n9"
   },
   {
    "q": "Start an empty list of texts, add three friends, then greet each one with fea.",
    "answer": "mak vec@txt makes the empty list, add fills it, and fea visits each name.",
    "answer_code": "friends mak vec@txt\nfriends add \"Ada\"\nfriends add \"Bob\"\nfriends add \"Cy\"\nf fea friends\n  out prn \"Hello, @f!\"",
    "answer_out": "Hello, Ada!\nHello, Bob!\nHello, Cy!"
   },
   {
    "q": "In the list 4, 8, 15, which position holds 15? Print it.",
    "answer": "Counting from 0, 15 is at position 2.",
    "answer_code": "v is 4&8&15\nout prn v@2",
    "answer_out": "15"
   }
  ],
  "watch_out": [
   "The last position is one less than the size.",
   "@ binds tightly: scores@i+1 is the item at i, plus 1. Make next is i+1 first, then use scores@next.",
   "You can't add to or remove from a list while fea is walking it."
  ],
  "recap": [
   "Make a list with & or start an empty one with mak vec@num.",
   "Read and change items by position with @, counting from 0.",
   "Find the size with cct.",
   "Edit a list with add and the l family: lin, lrm, ldx, lpl, lso, lrv, luq, lsu, lfl, lrs, lwp.",
   "Walk through a list with fea, or by position with flt.",
   "Build a grid as a list of lists."
  ]
 },
 {
  "num": 18,
  "title": "Asking a List",
  "idea": "The c family asks a list questions and hands back an answer, while the list stays exactly as it was. You can total it, find its biggest or smallest, its average, search it, or get a sorted copy to print.",
  "sections": [
   {
    "h": "Totals and extremes",
    "text": [
     "For 2, 4 and 6: three items, a sum of 12, a product of 48, a biggest of 6 and a smallest of 2."
    ],
    "code": "v is 2&4&6\nout prn cct&v\nout prn csm&v\nout prn cpd&v\nout prn cmx&v\nout prn cmn&v",
    "out": "3\n12\n48\n6\n2"
   },
   {
    "h": "What's typical",
    "text": [
     "cav adds up and divides by the count. cme sorts and picks the middle one. cde measures how spread out the values are."
    ],
    "code": "v is 2&4&9\nout prn cav&v\nout prn cme&v\nw is 2&4&6\nout prn cde&w",
    "out": "5\n4\n1.63299"
   },
   {
    "h": "Searching",
    "text": [
     "chs answers yes or nay. chm counts matches. cps gives the first matching position, or -1 when there's none. cfr and cla read the two ends."
    ],
    "code": "v is 5&9&2&9\nout prn chs&v&9\nout prn chs&v&7\nout prn chm&v&9\nout prn cps&v&9\nout prn cps&v&7\nout prn cfr&v\nout prn cla&v",
    "out": "yes\nnay\n2\n1\n-1\n5\n9"
   },
   {
    "h": "A random pick",
    "text": [
     "cra hands back one item chosen at random, so each run may print a different snack."
    ],
    "code": "snacks is \"apple\"&\"plum\"&\"pear\"\nout prn cra&snacks"
   },
   {
    "h": "Changed copies",
    "text": [
     "cso and crv give back a new sorted or reversed list; v itself still prints in its old order. ctx glues the items into one text with the separator you give between them."
    ],
    "code": "v is 3&1&2\nout prn cso&v\nout prn crv&v\nout prn v\nnames is \"Ada\"&\"Bob\"&\"Cy\"\nout prn ctx&names&\", \"",
    "out": "[1, 2, 3]\n[2, 1, 3]\n[3, 1, 2]\nAda, Bob, Cy"
   }
  ],
  "lines": [
   {
    "line": "out prn csm&v",
    "say": "Print all the items of v added together."
   },
   {
    "line": "out prn cmx&v",
    "say": "Print the biggest item in v."
   },
   {
    "line": "out prn cav&v",
    "say": "Print the average of v."
   },
   {
    "line": "out prn chs&v&9",
    "say": "Print yes if v holds a 9, otherwise nay."
   },
   {
    "line": "out prn cps&v&9",
    "say": "Print the position of the first 9, or -1."
   },
   {
    "line": "out prn cso&v",
    "say": "Print a sorted copy of v, leaving v alone."
   },
   {
    "line": "out prn ctx&names&\", \"",
    "say": "Print the names joined into one text with a comma and space between."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Store the scores 70, 85, 90 and 60, then print the average, the best and the worst.",
    "answer": "cav, cmx and cmn answer the three questions in one line each.",
    "answer_code": "scores is 70&85&90&60\nout prn cav&scores\nout prn cmx&scores\nout prn cmn&scores",
    "answer_out": "76.25\n90\n60"
   },
   {
    "q": "Does the list 3, 7, 7, 1 contain a 7, and how many times?",
    "answer": "chs says whether it is there; chm says how often.",
    "answer_code": "v is 3&7&7&1\nout prn chs&v&7\nout prn chm&v&7",
    "answer_out": "yes\n2"
   },
   {
    "q": "Print a sorted copy of 4, 2, 8 and then the list itself, to show it didn't change.",
    "answer": "cso builds a new list; v keeps its order.",
    "answer_code": "v is 4&2&8\nout prn cso&v\nout prn v",
    "answer_out": "[2, 4, 8]\n[4, 2, 8]"
   }
  ],
  "watch_out": [
   "ctx and tsp undo each other: tsp breaks a text into a list, ctx puts a list back into one text."
  ],
  "recap": [
   "Count, total and multiply a list with cct, csm and cpd.",
   "Find the biggest and smallest with cmx and cmn.",
   "Get the average, median and spread with cav, cme and cde.",
   "Search with chs, chm and cps, and read the ends with cfr and cla.",
   "Get a sorted or reversed copy with cso and crv, and join items into text with ctx."
  ]
 },
 {
  "num": 19,
  "title": "Maps",
  "idea": "A map looks things up by a key instead of a position, the way a dictionary looks up a word to find its meaning. You choose the kinds of key and value, store and read with @, and walk through every pair in key order.",
  "sections": [
   {
    "h": "Make a map",
    "text": [
     "map@txt@num says the keys are texts and the values are numbers. @ with a key stores a value or reads it back.",
     "A map prints its pairs in curly marks, sorted by key."
    ],
    "code": "ages mak map@txt@num\nages@\"Ada\" is 36\nages@\"Bob\" is 41\nout prn ages\nout prn ages@\"Ada\"",
    "out": "{Ada: 36, Bob: 41}\n36"
   },
   {
    "h": "Check before you read",
    "text": [
     "chs asks whether a key is in the map, and gives yes or nay."
    ],
    "code": "ages mak map@txt@num\nages@\"Ada\" is 36\nout prn chs&ages&\"Ada\"\nout prn chs&ages&\"Zed\"",
    "out": "yes\nnay"
   },
   {
    "h": "A missing key appears",
    "text": [
     "Reading a key that isn't there quietly adds it with the value 0. No warning is shown, so ask with chs first when that matters."
    ],
    "code": "ages mak map@txt@num\nout prn ages@\"Zed\"\nout prn ages",
    "out": "0\n{Zed: 0}"
   },
   {
    "h": "Counting words",
    "text": [
     "That silent 0 is useful. Each word of the text adds 1 under its own key, and the map ends up holding a count for every word."
    ],
    "code": "counts mak map@txt@num\ntext is \"the cat and the dog and the fish\"\nword fea twd&text\n  counts@word add 1\nout prn counts",
    "out": "{and: 2, cat: 1, dog: 1, fish: 1, the: 3}"
   },
   {
    "h": "Taking keys out",
    "text": [
     "lrm removes one key, cct tells you how many keys are left, and lwp empties the map."
    ],
    "code": "ages is map&\"Ada\"&36\nages add \"Bob\"&41\nages lrm \"Ada\"\nout prn ages\nout prn cct&ages\nages lwp now\nout prn ages",
    "out": "{Bob: 41}\n1\n{}"
   },
   {
    "h": "Walking a map",
    "text": [
     "fea with two names joined by & hands you each key and its value. They come out in key order, so Ada comes before Bob."
    ],
    "code": "ages mak map@txt@num\nages@\"Bob\" is 41\nages@\"Ada\" is 36\nname&age fea ages\n  out prn \"@name is @age\"",
    "out": "Ada is 36\nBob is 41"
   },
   {
    "h": "A hash map",
    "text": [
     "hsh works the same way and is often faster on big maps, but its keys come in no set order. Stick with map unless speed becomes a problem."
    ],
    "code": "ages mak hsh@txt@num\nages@\"Ada\" is 36\nout prn ages@\"Ada\"\nout prn chs&ages&\"Ada\"",
    "out": "36\nyes"
   }
  ],
  "lines": [
   {
    "line": "ages mak map@txt@num",
    "say": "Make ages, an empty map from texts to numbers."
   },
   {
    "line": "ages@\"Ada\" is 36",
    "say": "Store 36 under the key Ada."
   },
   {
    "line": "out prn ages@\"Ada\"",
    "say": "Print the value kept under Ada."
   },
   {
    "line": "out prn chs&ages&\"Zed\"",
    "say": "Print yes if Zed is a key, otherwise nay."
   },
   {
    "line": "counts@word add 1",
    "say": "Add 1 to the count kept under this word."
   },
   {
    "line": "ages lrm \"Ada\"",
    "say": "Take the key Ada out of the map."
   },
   {
    "line": "name&age fea ages",
    "say": "Take each key and value in turn, as name and age."
   },
   {
    "line": "out prn cky&ages",
    "say": "Print a list of all the keys."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Make a map of three foods and their prices, then print a line for each, like apple costs 2.",
    "answer": "Store each price under its food name, then walk the map with two names. The lines come out in alphabetical order.",
    "answer_code": "prices mak map@txt@num\nprices@\"apple\" is 2\nprices@\"plum\" is 3\nprices@\"pear\" is 4\nfood&cost fea prices\n  out prn \"@food costs @cost\"",
    "answer_out": "apple costs 2\npear costs 4\nplum costs 3"
   },
   {
    "q": "Make a map with Ada 36 and Bob 41, then print just the list of keys and the list of values.",
    "answer": "cky collects the keys and cvl collects the values, both in key order.",
    "answer_code": "ages mak map@txt@num\nages@\"Ada\" is 36\nages@\"Bob\" is 41\nout prn cky&ages\nout prn cvl&ages",
    "answer_out": "[Ada, Bob]\n[36, 41]"
   },
   {
    "q": "Count the letters in the word noon with a map from letters to numbers.",
    "answer": "Each letter adds 1 under its own key, starting from the silent 0.",
    "answer_code": "counts mak map@ltr@num\nc fea \"noon\"\n  counts@c add 1\nout prn counts",
    "answer_out": "{n: 2, o: 2}"
   }
  ],
  "watch_out": [
   "Reading a missing key adds it with 0, without a warning. Check with chs when that matters."
  ],
  "recap": [
   "Make a map with mak map@key@value, or start one with map& and add.",
   "Store and read values by key with @.",
   "Ask whether a key exists with chs before reading it.",
   "Remove keys with lrm, count them with cct, and wipe them with lwp.",
   "Walk every key and value with k&v fea, in key order.",
   "Use hsh when a big map needs to be faster and order doesn't matter."
  ]
 },
 {
  "num": 20,
  "title": "Other Collections",
  "idea": "Lists and maps cover most jobs, but some jobs fit a special collection better. This chapter tours them: sets for keeping things once, stacks and queues for deciding who goes next, heaps for the biggest first, and small holders like pairs, tuples and maybes.",
  "sections": [
   {
    "h": "A set keeps each thing once",
    "text": [
     "Adding cat a second time changes nothing; a set holds each value only once, in order. chs on a set is the quickest way to ask whether you've seen something.",
     "bag is the same idea with no order, and usually faster when big."
    ],
    "code": "seen mak set@txt\nseen add \"cat\"\nseen add \"dog\"\nseen add \"cat\"\nout prn seen\nout prn cct&seen\nout prn chs&seen&\"dog\"\nseen lrm \"cat\"\nout prn seen",
    "out": "{cat, dog}\n2\nyes\n{dog}"
   },
   {
    "h": "A stack: last in, first out",
    "text": [
     "Like a pile of plates, you add on top and take from the top. @top peeks at the top item and lpl removes it."
    ],
    "code": "plates mak stk@num\nplates add 1\nplates add 2\nplates add 3\nout prn plates@top\nplates lpl now\nout prn plates@top\nout prn cct&plates",
    "out": "3\n2\n2"
   },
   {
    "h": "A queue: first in, first out",
    "text": [
     "Like a line at a shop, new arrivals join the back and the front leaves first. @front peeks at the front item."
    ],
    "code": "line mak que@txt\nline add \"Ada\"\nline add \"Bob\"\nout prn line@front\nline lpl now\nout prn line@front",
    "out": "Ada\nBob"
   },
   {
    "h": "A heap: biggest first",
    "text": [
     "However the items went in, @top always shows the biggest one. Good for jobs ranked by importance."
    ],
    "code": "jobs mak hep@num\njobs add 3\njobs add 9\njobs add 5\nout prn jobs@top\njobs lpl now\nout prn jobs@top",
    "out": "9\n5"
   },
   {
    "h": "Quick at both ends",
    "text": [
     "A dqu can add or remove at the front as cheaply as at the back. lpf pops the first item, and @ still reaches any position.",
     "A lst is also quick at both ends, but you have to walk through it; @ can't jump to a position."
    ],
    "code": "line mak dqu@num\nline add 2\nline add 3\nline lin 0&1\nout prn line\nline lpf now\nout prn line\nout prn line@0",
    "out": "[1, 2, 3]\n[2, 3]\n2"
   },
   {
    "h": "A pair",
    "text": [
     "par holds exactly two things, reached with @first and @second. par& builds one in a single line."
    ],
    "code": "spot is par&3&4\nout prn spot\nout prn spot@first\nout prn spot@second\nnamed mak par@txt@num\nnamed@first is \"Ada\"\nnamed@second is 36\nout prn named",
    "out": "(3, 4)\n3\n4\n(Ada, 36)"
   },
   {
    "h": "Maybe a value",
    "text": [
     "An opt holds either a value or nothing, written nil. @value_or&0 reads the value, or 0 when it's empty."
    ],
    "code": "found mak opt@num\nfound ieq nil\n  out prn \"nothing yet\"\nout prn found@value_or&0\nfound is 7\nfound ine nil\n  out prn found@value",
    "out": "nothing yet\n0\n7"
   }
  ],
  "lines": [
   {
    "line": "seen mak set@txt",
    "say": "Make seen, an empty set of texts."
   },
   {
    "line": "plates mak stk@num",
    "say": "Make plates, an empty stack of numbers."
   },
   {
    "line": "out prn plates@top",
    "say": "Print the item on top of the stack."
   },
   {
    "line": "line mak que@txt",
    "say": "Make line, an empty queue of texts."
   },
   {
    "line": "jobs mak hep@num",
    "say": "Make jobs, a heap that always shows its biggest number."
   },
   {
    "line": "days mak arr@num@7",
    "say": "Make days, an array of exactly 7 numbers, all 0."
   },
   {
    "line": "spot is par&3&4",
    "say": "Make spot, a pair holding 3 and 4."
   },
   {
    "line": "person is tup&\"Ada\"&36&yes",
    "say": "Make person, a tuple of a text, a number and a yes."
   },
   {
    "line": "found mak opt@num",
    "say": "Make found, a maybe-number that starts empty."
   },
   {
    "line": "thing mak alt@num@txt",
    "say": "Make thing, which can hold either a number or a text."
   }
  ],
  "mistakes": [
   {
    "code": "plates mak stk@num\nplates add 1\nout prn plates",
    "says": "Line 3: A stack or a queue can only be read from one end. Print its top: s@top.",
    "fix": "A stack only shows one end, so print the top item with @top instead of the whole stack.",
    "fix_code": "plates mak stk@num\nplates add 1\nout prn plates@top",
    "fix_out": "1"
   }
  ],
  "practice": [
   {
    "q": "Find how many different letters are in banana, using a set.",
    "answer": "Each letter goes into the set, and repeats are dropped, so b, a and n are left.",
    "answer_code": "letters mak set@ltr\nc fea \"banana\"\n  letters add c\nout prn cct&letters",
    "answer_out": "3"
   },
   {
    "q": "Add 5 to a bag twice and print its size.",
    "answer": "A bag keeps each value once, so the size is 1.",
    "answer_code": "seen mak bag@num\nseen add 5\nseen add 5\nout prn cct&seen",
    "answer_out": "1"
   },
   {
    "q": "Put Ada, Bob and Cy in a queue, then print who is at the front after one person leaves.",
    "answer": "Ada joined first, so she leaves first, and Bob is at the front.",
    "answer_code": "line mak que@txt\nline add \"Ada\"\nline add \"Bob\"\nline add \"Cy\"\nline lpl now\nout prn line@front",
    "answer_out": "Bob"
   }
  ],
  "watch_out": [
   "A stack or queue can't be printed whole; you only see the next item.",
   "For an alt called thing, thing@txt reads its text. If thing holds a number at that moment, the program stops and says so."
  ],
  "recap": [
   "Keep things once with a set or a bag.",
   "Use a stack for last in, first out, and a queue for first in, first out.",
   "Get the biggest first from a heap.",
   "Add at both ends with dqu or lst, and pop the front with lpf.",
   "Hold a fixed size with arr, two things with par, several with tup.",
   "Hold a value that may be missing with opt, or one of several kinds with alt."
  ]
 },
 {
  "num": 21,
  "title": "Functions",
  "idea": "A function is your own named machine: values go in, work happens, and maybe an answer comes out. dfn names it, dpm lists what it takes, and ert hands back the answer. Functions can sit anywhere in the file, even below the lines that use them.",
  "sections": [
   {
    "h": "Your first function",
    "text": [
     "add_up promises a number with dfn num, takes a and b with dpm, and returns their sum with ert.",
     "It is written after the line that uses it. Order doesn't matter in English++, so no prototype is needed."
    ],
    "code": "out prn add_up&1&2\n\nadd_up dfn num\n  a dpm num\n  b dpm num\n  add_up ert a+b",
    "out": "3"
   },
   {
    "h": "A function that just does a job",
    "text": [
     "hello says now instead of a kind, so it gives nothing back. It runs on its own line: now in the first spot, its name in the middle, its value last."
    ],
    "code": "now hello \"Ada\"\nnow hello \"Bob\"\n\nhello dfn now\n  who dpm txt\n  out prn \"Hello, @who!\"",
    "out": "Hello, Ada!\nHello, Bob!"
   },
   {
    "h": "Leaving early",
    "text": [
     "ert jumps out at once. In a function that returns nothing, the line is check_age ert now, starting with the function's own name."
    ],
    "code": "now check_age 5\nnow check_age 20\n\ncheck_age dfn now\n  age dpm num\n  age ilt 13\n    out prn \"Too young.\"\n    check_age ert now\n  out prn \"Welcome!\"",
    "out": "Too young.\nWelcome!"
   },
   {
    "h": "A default value",
    "text": [
     "Give dpm a value instead of a kind and that value is used whenever the caller leaves it out."
    ],
    "code": "now hello \"Ada\"\nnow hello \"Bob\"&\"Hi\"\n\nhello dfn now\n  who dpm txt\n  word dpm \"Hello\"\n  out prn \"@word @who\"",
    "out": "Hello Ada\nHi Bob"
   },
   {
    "h": "A copy or the real box",
    "text": [
     "A plain parameter is a copy, so try_copy can't change x. ref@ hands over the real box, so try_ref can."
    ],
    "code": "x is 1\nnow try_copy x\nout prn x\nnow try_ref x\nout prn x\n\ntry_copy dfn now\n  n dpm num\n  n add 1\n\ntry_ref dfn now\n  n dpm ref@num\n  n add 1",
    "out": "1\n2"
   },
   {
    "h": "Two answers back",
    "text": [
     "tup@num@num promises two numbers. The caller opens them into q and r in one line."
    ],
    "code": "q&r is divide&17&5\nout prn \"@q, with @r left over\"\n\ndivide dfn tup@num@num\n  a dpm num\n  b dpm num\n  whole is a/b\n  rest is a%b\n  divide ert whole&rest",
    "out": "3, with 2 left over"
   },
   {
    "h": "A function that calls itself",
    "text": [
     "factorial calls itself with a smaller number each time, and stops at 1. Every recursive function needs a way out like that."
    ],
    "code": "out prn factorial&5\n\nfactorial dfn num\n  n dpm num\n  n ile 1\n    factorial ert 1\n  smaller is factorial&n-1\n  factorial ert n*smaller",
    "out": "120"
   }
  ],
  "lines": [
   {
    "line": "add_up dfn num",
    "say": "Define add_up, a function that gives back a number."
   },
   {
    "line": "a dpm num",
    "say": "It takes a number, called a."
   },
   {
    "line": "add_up ert a+b",
    "say": "add_up gives back a+b and leaves."
   },
   {
    "line": "out prn add_up&1&2",
    "say": "Run add_up with 1 and 2, and print its answer."
   },
   {
    "line": "check_age ert now",
    "say": "Leave check_age right here, giving nothing back."
   },
   {
    "line": "word dpm \"Hello\"",
    "say": "It takes a text called word, which is Hello if none is given."
   },
   {
    "line": "n dpm ref@num",
    "say": "It takes the caller's real number box, not a copy."
   },
   {
    "line": "score mgl 0",
    "say": "Make score, a box every function can see, starting at 0."
   },
   {
    "line": "also mrf x",
    "say": "Make also a second name for the box x."
   }
  ],
  "mistakes": [
   {
    "code": "out prn add_up&1\n\nadd_up dfn num\n  a dpm num\n  b dpm num\n  add_up ert a+b",
    "says": "Line 1: add_up takes 2 values, but it was given 1.",
    "fix": "Give add_up both of the values it asks for.",
    "fix_code": "out prn add_up&1&2\n\nadd_up dfn num\n  a dpm num\n  b dpm num\n  add_up ert a+b",
    "fix_out": "3"
   },
   {
    "code": "out prn add_up&1&\"two\"\n\nadd_up dfn num\n  a dpm num\n  b dpm num\n  add_up ert a+b",
    "says": "Line 1: add_up wants a whole number for b, but \"two\" is a text.",
    "fix": "Hand add_up a number for b, not a text.",
    "fix_code": "out prn add_up&1&2\n\nadd_up dfn num\n  a dpm num\n  b dpm num\n  add_up ert a+b",
    "fix_out": "3"
   },
   {
    "code": "out prn six&\n\nsix dfn num\n  x is 6",
    "says": "Line 3: six promises to give back a whole number, but it never does. Add a line: six ert ...",
    "fix": "Add a line that returns the value, such as six ert x."
   },
   {
    "code": "add dfn num\n  a dpm num\n  add ert a",
    "says": "Line 1: add is a root, so it can't be a function's name: lines would read it as the root. Pick another name.",
    "fix": "Pick a name that isn't a root, such as add_one or plus."
   },
   {
    "code": "now make_it now\nout prn secret\n\nmake_it dfn now\n  secret is 5",
    "says": "Line 2: I don't know secret yet. Make it first, like secret is 0.",
    "fix": "Make secret in the main program, or have make_it give the value back with ert."
   },
   {
    "code": "x is 1\nout prn get_x&\n\nget_x dfn num\n  get_x ert x",
    "says": "Line 5: x belongs to the main program, so get_x can't see it. Hand it in with dpm, or make it with mgl.",
    "fix": "Hand x in as a parameter with dpm, or make it with mgl at the top level."
   },
   {
    "code": "scores is 1&2&3\nnow wipe_it scores\n\nwipe_it dfn now\n  v dpm see@vec@num\n  v lwp now",
    "says": "Line 6: v is only a look at the real thing (see@), so it can't change. To change it, take it with ref@.",
    "fix": "Take the list with ref@ instead of see@ when the function needs to change it.",
    "fix_code": "scores is 1&2&3\nnow wipe_it scores\nout prn scores\n\nwipe_it dfn now\n  v dpm ref@vec@num\n  v lwp now"
   }
  ],
  "practice": [
   {
    "q": "Write twice, which takes a number and gives back double it, then print twice&21.",
    "answer": "One parameter, and ert hands back n*2.",
    "answer_code": "out prn twice&21\n\ntwice dfn num\n  n dpm num\n  twice ert n*2",
    "answer_out": "42"
   },
   {
    "q": "Write biggest, which returns the largest number in a list without using cmx.",
    "answer": "Start with the first item as the best so far, walk the list, and replace it whenever something bigger turns up.",
    "answer_code": "v is 3&9&4\nout prn biggest&v\n\nbiggest dfn num\n  list dpm see@vec@num\n  best is list@0\n  x fea list\n    x igt best\n      best is x\n  biggest ert best",
    "answer_out": "9"
   },
   {
    "q": "Write area, which takes a width and a height and gives back width times height. Print area&3&4.",
    "answer": "Two parameters and one ert line.",
    "answer_code": "out prn area&3&4\n\narea dfn num\n  w dpm num\n  h dpm num\n  area ert w*h",
    "answer_out": "12"
   }
  ],
  "watch_out": [
   "One word holds one function call. Do nested calls in two steps, each with its own name.",
   "Boxes made inside a function vanish when it ends, and a function can't see the main program's boxes unless they are handed in or made with mgl.",
   "Keep globals rare: when any function may change a box, it is hard to tell which one did."
  ],
  "recap": [
   "Define a function with dfn, its inputs with dpm, and its answer with ert.",
   "Call a function inside a line with name&value&value, or alone with now name value.",
   "Leave early with ert, and give parameters default values.",
   "Pass a copy, the real box (ref@), or a look-only view (see@).",
   "Share a box with mgl, and give a box a second name with mrf or mlo.",
   "Return several answers with tup@, and let a function call itself."
  ]
 },
 {
  "num": 22,
  "title": "Functions in a Name",
  "idea": "A function can live in a name, just like a number does, and be handed to other functions. dlm makes such a function, often called a lambda, and it can see the boxes around it. With cft, cmp and lso you can filter, transform and sort a whole list in a few readable lines.",
  "sections": [
   {
    "h": "A function in a name",
    "text": [
     "dlm is written like dfn: dpm lines for inputs, an ert line for the answer. twice is then used like any other function."
    ],
    "code": "twice dlm num\n  n dpm num\n  twice ert n*2\nout prn twice&21",
    "out": "42"
   },
   {
    "h": "It sees the boxes around it",
    "text": [
     "plus_bonus reads bonus, which was made outside it. A dfn function couldn't do that; a dlm function can."
    ],
    "code": "bonus is 100\nplus_bonus dlm num\n  n dpm num\n  plus_bonus ert n+bonus\nout prn plus_bonus&5",
    "out": "105"
   },
   {
    "h": "Keep only some",
    "text": [
     "big answers yes or nay for each number. cft keeps the ones big says yes to, and builds a new list."
    ],
    "code": "v is 1&5&2&8\nbig dlm yno\n  n dpm num\n  big ert n>2\nout prn cft&v&big",
    "out": "[5, 8]"
   },
   {
    "h": "Change every item",
    "text": [
     "cmp sends each item through square and collects the results in a new list."
    ],
    "code": "v is 1&2&3\nsquare dlm num\n  n dpm num\n  square ert n*n\nout prn cmp&v&square",
    "out": "[1, 4, 9]"
   },
   {
    "h": "Sort your own way",
    "text": [
     "lso can take a function that compares two items. bigger_first says a goes first when it is larger, so the list ends up biggest to smallest."
    ],
    "code": "v is 3&1&2\nbigger_first dlm yno\n  a dpm num\n  b dpm num\n  bigger_first ert a>b\nv lso bigger_first\nout prn v",
    "out": "[3, 2, 1]"
   },
   {
    "h": "The kind of a function",
    "text": [
     "fun@num@txt means a function that gives back a number and takes a text. A box of that kind can hold sizer, and a parameter of that kind lets run_twice take a function as input."
    ],
    "code": "say_size mak fun@num@txt\nsizer dlm num\n  s dpm txt\n  sizer ert tsz&s\nsay_size is sizer\nout prn say_size&\"hello\"\nout prn run_twice&sizer\n\nrun_twice dfn num\n  f dpm fun@num@txt\n  a is f&\"one\"\n  b is f&\"three\"\n  run_twice ert a+b",
    "out": "5\n8"
   }
  ],
  "lines": [
   {
    "line": "twice dlm num",
    "say": "Define twice, a function in a name that gives back a number."
   },
   {
    "line": "twice ert n*2",
    "say": "twice gives back n times 2."
   },
   {
    "line": "big dlm yno",
    "say": "Define big, a function that answers yes or nay."
   },
   {
    "line": "out prn cft&v&big",
    "say": "Print the items of v that big says yes to."
   },
   {
    "line": "out prn cmp&v&square",
    "say": "Print a new list with every item of v put through square."
   },
   {
    "line": "v lso bigger_first",
    "say": "Sort v, using bigger_first to decide which goes first."
   },
   {
    "line": "say_size mak fun@num@txt",
    "say": "Make say_size, a box that can hold a function from text to number."
   },
   {
    "line": "f dpm fun@num@txt",
    "say": "The function takes another function, called f, as a parameter."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "From a list of words, keep only the ones with more than 3 letters and print them.",
    "answer": "longer measures each word with tsz and says yes when it is over 3. cft keeps those.",
    "answer_code": "words is \"cat\"&\"horse\"&\"dog\"&\"zebra\"\nlonger dlm yno\n  w dpm txt\n  size is tsz&w\n  longer ert size>3\nout prn cft&words&longer",
    "answer_out": "[horse, zebra]"
   },
   {
    "q": "Add 10 to every number in 1, 2, 3 using cmp and a lambda.",
    "answer": "plus_ten gives back n+10, and cmp runs it on each item.",
    "answer_code": "v is 1&2&3\nplus_ten dlm num\n  n dpm num\n  plus_ten ert n+10\nout prn cmp&v&plus_ten",
    "answer_out": "[11, 12, 13]"
   },
   {
    "q": "Keep only the even numbers from 1 to 6.",
    "answer": "even says yes when n%2 is 0, and cft keeps those numbers.",
    "answer_code": "v is 1&2&3&4&5&6\neven dlm yno\n  n dpm num\n  even ert n%2==0\nout prn cft&v&even",
    "answer_out": "[2, 4, 6]"
   }
  ],
  "watch_out": [
   "One word holds one function call, so nest calls in separate lines."
  ],
  "recap": [
   "Make a function in a name with dlm.",
   "Let a lambda read the boxes around it.",
   "Filter a list with cft and transform it with cmp.",
   "Sort with your own rule using lso and a compare function.",
   "Write a function's kind with fun@, and pass functions as parameters."
  ]
 },
 {
  "num": 23,
  "title": "Lists and Functions Together",
  "idea": "A function kept in a name can be handed to a list, and the list uses it to answer bigger questions. You can test every item, roll a whole list into one value, walk two lists side by side, and cut, count, group and search lists in a line each.",
  "sections": [
   {
    "h": "Does every item pass?",
    "text": [
     "passed is a small yes-or-nay test: is the number over 80? cea asks whether all scores pass it, can asks whether at least one does, and cnn asks whether none do.",
     "Only 85 and 92 pass, so the answers are nay, yes, nay."
    ],
    "code": "scores is 70&85&92\npassed dlm yno\n  n dpm num\n  passed ert n>80\nout prn cea&scores&passed\nout prn can&scores&passed\nout prn cnn&scores&passed",
    "out": "nay\nyes\nnay"
   },
   {
    "h": "Rolling a list into one value",
    "text": [
     "crl takes a list, a starting value, and a two-value function. It folds each item in, one after another.",
     "Starting at 1 and multiplying by 2, 3 and 4 leaves 24."
    ],
    "code": "v is 2&3&4\ntimes dlm num\n  a dpm num\n  b dpm num\n  times ert a*b\nout prn crl&v&1&times",
    "out": "24"
   },
   {
    "h": "Two lists side by side",
    "text": [
     "czp pairs the first name with the first age, then the second with the second. The loop gets both at once through n&a.",
     "cnu hands you a counter with each item, starting at 0."
    ],
    "code": "names is \"Ada\"&\"Bo\"\nages is 10&12\nn&a fea czp&names&ages\n  out prn \"@n is @a\"\nk&n fea cnu&names\n  out prn \"@k: @n\"",
    "out": "Ada is 10\nBo is 12\n0: Ada\n1: Bo"
   },
   {
    "h": "Comparing two lists",
    "text": [
     "cun keeps everything from both lists once, cbt keeps only what they share, and cot keeps what the first has that the second lacks."
    ],
    "code": "a is 1&2&3\nb is 2&3&4\nout prn cun&a&b\nout prn cbt&a&b\nout prn cot&a&b",
    "out": "[1, 2, 3, 4]\n[2, 3]\n[1]"
   },
   {
    "h": "Cutting and counting",
    "text": [
     "ccu&v&1&2 starts at position 1 and takes two items. Leave the count off and you get everything from that spot on.",
     "crg builds a list by counting up to, but not including, the end. A third value sets the step."
    ],
    "code": "v is 5&6&7&8&9\nout prn ccu&v&1&2\nout prn ccu&v&3\nout prn crg&0&5\nout prn crg&0&10&2",
    "out": "[6, 7]\n[8, 9]\n[0, 1, 2, 3, 4]\n[0, 2, 4, 6, 8]"
   },
   {
    "h": "Searching a sorted list by halves",
    "text": [
     "cbf says yes or nay: is the value in the list? cpb gives its position. Both jump to the middle and throw away half each time, so they are quick on long lists.",
     "They only work on a list that is already in order."
    ],
    "code": "sorted is 2&4&6&8&10\nout prn cbf&sorted&6\nout prn cbf&sorted&7\nout prn cpb&sorted&6",
    "out": "yes\nnay\n2"
   },
   {
    "h": "A heap with the smallest on top",
    "text": [
     "mhp makes a heap where the smallest item is always on top, handy for picking the next job.",
     "After 1 is popped, 3 rises to the top."
    ],
    "code": "jobs mak mhp@num\njobs add 5\njobs add 1\njobs add 3\nout prn jobs@top&\njobs lpl now\nout prn jobs@top&",
    "out": "1\n3"
   }
  ],
  "lines": [
   {
    "line": "out prn cea&scores&passed",
    "say": "Print whether every score passes the passed test."
   },
   {
    "line": "out prn can&scores&passed",
    "say": "Print whether at least one score passes."
   },
   {
    "line": "out prn crl&v&1&times",
    "say": "Start at 1 and fold every item of v in with times, then print the result."
   },
   {
    "line": "n&a fea czp&names&ages",
    "say": "Loop over names and ages together, one pair at a time."
   },
   {
    "line": "k&n fea cnu&names",
    "say": "Loop over names with a counter k that starts at 0."
   },
   {
    "line": "out prn ccu&v&1&2",
    "say": "Print two items of v, starting at position 1."
   },
   {
    "line": "out prn cbf&sorted&6",
    "say": "Print whether 6 is in the sorted list."
   },
   {
    "line": "jobs mak mhp@num",
    "say": "Make a heap of numbers that keeps the smallest on top."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Make a list of numbers. Add them all up with crl, starting from 0, then check with cea that every one is above 0.",
    "answer": "plus folds the numbers in two at a time, and above is the yes-or-nay test handed to cea.",
    "answer_code": "v is 3&4&5\nplus dlm num\n  a dpm num\n  b dpm num\n  plus ert a+b\nout prn crl&v&0&plus\nabove dlm yno\n  n dpm num\n  above ert n>0\nout prn cea&v&above",
    "answer_out": "12\nyes"
   },
   {
    "q": "Use crg to make the even numbers from 0 up to 8, then print the first three with ccu.",
    "answer": "crg&0&10&2 counts 0, 2, 4, 6, 8. ccu then cuts from position 0 and keeps three.",
    "answer_code": "v is crg&0&10&2\nout prn ccu&v&0&3",
    "answer_out": "[0, 2, 4]"
   },
   {
    "q": "Two teams list who is coming. Print who is on both lists.",
    "answer": "cbt keeps only the items both lists share.",
    "answer_code": "a is 1&2&3\nb is 2&3&4\nout prn cbt&a&b",
    "answer_out": "[2, 3]"
   }
  ],
  "watch_out": [
   "cbf and cpb assume the list is already sorted. On an unsorted list they quietly give wrong answers, so sort first."
  ],
  "recap": [
   "Ask whether all, any or none of a list passes a test.",
   "Fold a list into one value with crl.",
   "Walk two lists together with czp, or number items with cnu.",
   "Find the union, the overlap or the difference of two lists.",
   "Cut part of a list, count out a new one, and search a sorted list by halves.",
   "Keep the smallest item on top with mhp."
  ]
 },
 {
  "num": 24,
  "title": "More About Functions",
  "idea": "Functions get a few new tricks here. One can take as many values as you hand it, keep a name alive between calls, work on its own copies, be worked out while the program builds, hand out values one at a time, or schedule cleanup for when a block ends.",
  "sections": [
   {
    "h": "As many values as you like",
    "text": [
     "When the last parameter is a list, every leftover value lands in it. add_all sums whatever it gets, four values or one."
    ],
    "code": "out prn add_all&1&2&3&4\nout prn add_all&5\n\nadd_all dfn num\n  xs dpm vec@num\n  add_all ert csm&xs",
    "out": "10\n5"
   },
   {
    "h": "A name that survives the call",
    "text": [
     "msv makes a name that is set up once, on the first call, and keeps its value afterwards. Each call to tick bumps the same n."
    ],
    "code": "out prn tick&\nout prn tick&\nout prn tick&\n\ntick dfn num\n  n msv 0\n  n add 1\n  tick ert n",
    "out": "1\n2\n3"
   },
   {
    "h": "Working on copies",
    "text": [
     "dlv takes copies of the outside names at the moment it is made. copy keeps raising its own x, while the real x stays at 1.",
     "dlm, by contrast, works on the outside names themselves."
    ],
    "code": "x is 1\ncopy dlv num\n  x add 1\n  copy ert x\nout prn copy&\nout prn copy&\nout prn x",
    "out": "2\n3\n1"
   },
   {
    "h": "Worked out at build time",
    "text": [
     "dcx marks a function C++ can finish while it compiles, so the answer is already there when the program starts."
    ],
    "code": "out prn square&5\n\nsquare dcx num\n  n dpm num\n  square ert n*n",
    "out": "25"
   },
   {
    "h": "One value at a time",
    "text": [
     "A generator has the kind gnr@num and hands out values with eyd, pausing until the loop asks for the next.",
     "The forever loop inside evens is fine: it only moves when fea wants another value, and ebk stops the asking after 6."
    ],
    "code": "n fea evens&\n  out prn n\n  n igt 4\n    now ebk now\n\nevens dfn gnr@num\n  i is 0\n  now wfv now\n    evens eyd i\n    i add 2",
    "out": "0\n2\n4\n6"
   },
   {
    "h": "Cleanup that runs last",
    "text": [
     "Lines under bdr wait until the surrounding block finishes, however it finishes. That lets you write the cleanup right beside the setup."
    ],
    "code": "now bdr now\n  out prn \"this comes last\"\nout prn \"this comes first\"",
    "out": "this comes first\nthis comes last"
   }
  ],
  "lines": [
   {
    "line": "xs dpm vec@num",
    "say": "A last parameter that collects every leftover value into a list."
   },
   {
    "line": "n msv 0",
    "say": "Make n once, start it at 0, and keep it between calls."
   },
   {
    "line": "copy dlv num",
    "say": "Make a function in a name that works on its own copies and gives back a number."
   },
   {
    "line": "square dcx num",
    "say": "Make a function C++ can work out while building the program."
   },
   {
    "line": "evens dfn gnr@num",
    "say": "Make a function that hands out numbers one at a time."
   },
   {
    "line": "evens eyd i",
    "say": "Hand over i, then wait for the next request."
   },
   {
    "line": "now bdr now",
    "say": "Run the lines below when the surrounding block ends."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Write a function that uses msv to count how often it has been called, and call it three times.",
    "answer": "n is set to 0 only on the first call, then each call adds 1 and returns it.",
    "answer_code": "out prn calls&\nout prn calls&\nout prn calls&\n\ncalls dfn num\n  n msv 0\n  n add 1\n  calls ert n",
    "answer_out": "1\n2\n3"
   },
   {
    "q": "Write a function that takes any number of values and gives back how many it got.",
    "answer": "The leftover values arrive as one list, and cct counts them.",
    "answer_code": "out prn how_many&4&8&15\nout prn how_many&7\n\nhow_many dfn num\n  xs dpm vec@num\n  how_many ert cct&xs",
    "answer_out": "3\n1"
   },
   {
    "q": "Change copy so it uses dlm instead of dlv. What does the last line print now?",
    "answer": "dlm works on the real x, so the outside x has changed too. It prints 2, then 2.",
    "answer_code": "x is 1\nbump dlm num\n  x add 1\n  bump ert x\nout prn bump&\nout prn x",
    "answer_out": "2\n2"
   }
  ],
  "watch_out": [
   "With several bdr blocks, they run in reverse: the one written last runs first."
  ],
  "recap": [
   "Take any number of values through a list as the last parameter.",
   "Keep a value between calls with msv.",
   "Choose dlv for copies or dlm for the real names.",
   "Mark a function with dcx so it is worked out at build time.",
   "Hand out values one at a time with a gnr function and eyd.",
   "Put cleanup under bdr so it runs when the block ends."
  ]
 },
 {
  "num": 25,
  "title": "Checks and Tests",
  "idea": "Instead of running a program and eyeballing the result, you can make it check itself. Should lines stop the program the moment something you were sure of turns out false, and named tests check one thing each when you ask for them.",
  "sections": [
   {
    "h": "Saying what should be true",
    "text": [
     "seq means should equal, and sgt means should be greater than. When both hold, nothing happens and the program carries on."
    ],
    "code": "x is 3\nx seq 3\nx sgt 2\nout prn \"All the checks passed.\"",
    "out": "All the checks passed."
   },
   {
    "h": "When a check fails",
    "text": [
     "Here x is 3 but the line claims 4. The program stops on that line and shows both values, so the last print never runs."
    ],
    "code": "x is 3\nx seq 4\nout prn \"not reached\"",
    "out": "Line 2: x seq 4 is not right: the first is 3, and the second is 4."
   },
   {
    "h": "The whole should family",
    "text": [
     "The six should roots mirror the comparisons you already know: sne, slt, sle, sgt, sge and seq."
    ],
    "code": "a is 2\na sne 3\na slt 3\na sle 2\na sge 2\nout prn \"Fine.\"",
    "out": "Fine."
   },
   {
    "h": "A named test",
    "text": [
     "bts opens a test block with a name. Pressing F5 skips tests and just runs the program, which prints 3.",
     "Build > Run Tests runs the tests instead and reports each one."
    ],
    "code": "out prn add_up&1&2\n\nnow bts \"adding small numbers\"\n  a is add_up&1&2\n  a seq 3\n\nadd_up dfn num\n  a dpm num\n  b dpm num\n  add_up ert a+b",
    "out": "3"
   },
   {
    "h": "A test that fails",
    "text": [
     "The first test claims 2+2 is 5. Run Tests marks it FAILED, quotes line 3 with both values, and still runs the next test, ending with 1 of 2 tests passed."
    ],
    "code": "now bts \"this one is wrong\"\n  x is 2+2\n  x seq 5\n\nnow bts \"this one is right\"\n  x is 2+2\n  x seq 4"
   }
  ],
  "lines": [
   {
    "line": "x seq 3",
    "say": "Check that x equals 3, and stop if it doesn't."
   },
   {
    "line": "x sgt 2",
    "say": "Check that x is greater than 2."
   },
   {
    "line": "a sne 3",
    "say": "Check that a is not 3."
   },
   {
    "line": "a sle 2",
    "say": "Check that a is 2 or less."
   },
   {
    "line": "now bts \"adding small numbers\"",
    "say": "Start a test called adding small numbers."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Write is_even, which says yes for an even number, plus two tests: one for 4 and one for 7. Then choose Run Tests.",
    "answer": "Each test calls is_even and checks the answer with seq. Run Tests should report both as passed.",
    "answer_code": "now bts \"4 is even\"\n  r is is_even&4\n  r seq yes\n\nnow bts \"7 is not even\"\n  r is is_even&7\n  r seq nay\n\nis_even dfn yno\n  n dpm num\n  is_even ert n%2==0"
   },
   {
    "q": "Make y hold 10, then check that it is at least 5 and below 20 before printing it.",
    "answer": "sge and slt both hold, so the print runs.",
    "answer_code": "y is 10\ny sge 5\ny slt 20\nout prn y",
    "answer_out": "10"
   },
   {
    "q": "What happens if you change the 20 in that program to 8?",
    "answer": "The slt check fails. The program stops on that line, shows 10 and 8, and never prints y."
   }
  ],
  "watch_out": [
   "A good habit: when you find a bug, first write a test that catches it, then fix it. The test passing proves the fix, and it keeps the bug from coming back."
  ],
  "recap": [
   "State what should be true with seq, sne, slt, sle, sgt and sge.",
   "Read a failed check: it names the line and both values.",
   "Write named tests with now bts.",
   "Run them with Build > Run Tests, while F5 still runs the program."
  ]
 },
 {
  "num": 26,
  "title": "Your Own Kinds of Things",
  "idea": "A class is your own plan for a kind of thing, such as a Dog or a Bank account. The plan lists the data every one carries and the actions it can take, and you can build as many from it as you need. This is how bigger programs keep related data and actions together.",
  "sections": [
   {
    "h": "A plan and one thing made from it",
    "text": [
     "Dog dcl now starts the plan. dfd lines give it fields, and a dfn inside it is a method, something a dog can do.",
     "Printing rex shows every field for free, which C++ would make you write yourself."
    ],
    "code": "rex mak Dog\nrex@name is \"Rex\"\nrex bark now\nout prn rex\n\nDog dcl now\n  name dfd txt\n  age dfd 3\n  bark dfn now\n    out prn \"@name says woof!\"",
    "out": "Rex says woof!\nDog(name: Rex, age: 3)"
   },
   {
    "h": "Methods that use the fields",
    "text": [
     "Inside the class, a method can use the fields by their plain names. grow takes a value and adds it to age, and dog_years gives back age times 7."
    ],
    "code": "rex mak Dog\nout prn rex@dog_years\nrex grow 2\nout prn rex@dog_years\n\nDog dcl now\n  age dfd 3\n  grow dfn now\n    more dpm num\n    age add more\n  dog_years dfn num\n    dog_years ert age*7",
    "out": "21\n35"
   },
   {
    "h": "Setting up at birth",
    "text": [
     "dmk runs on its own whenever a Dog is made, so values handed in with & go straight into the fields. y has a starting value of 1, so it can be left out."
    ],
    "code": "a mak Dog&\"Rex\"\nb mak Dog&\"Tom\"&5\nout prn a\nout prn b\n\nDog dcl now\n  name dfd txt\n  age dfd 1\n  Dog dmk now\n    n dpm txt\n    y dpm 1\n    name is n\n    age is y",
    "out": "Dog(name: Rex, age: 1)\nDog(name: Tom, age: 5)"
   },
   {
    "h": "slf for this very thing",
    "text": [
     "When a parameter and a field share a name, slf@x means the field and plain x means the parameter."
    ],
    "code": "s mak Spot&3\nout prn s@x\n\nSpot dcl now\n  x dfd 0\n  Spot dmk now\n    x dpm num\n    slf@x is x",
    "out": "3"
   },
   {
    "h": "Keeping a field secret",
    "text": [
     "dsc makes money a secret: only Bank's own methods can touch it, and it never shows when the account is printed.",
     "The only way in is pay_in, which refuses amounts that aren't above 0."
    ],
    "code": "acct mak Bank\nacct pay_in 50\nout prn acct@balance\nout prn acct\n\nBank dcl now\n  owner dfd \"Ada\"\n  money dsc 0\n  pay_in dfn now\n    n dpm num\n    n igt 0\n      money add n\n  balance dfn num\n    balance ert money",
    "out": "50\nBank(owner: Ada)"
   },
   {
    "h": "Shared by the whole class",
    "text": [
     "dsh makes one field for the class as a whole, here counting dogs as they are made. dsf makes a class-level function.",
     "Both are reached through the class name, and the lone & runs report with no values."
    ],
    "code": "a mak Dog\nb mak Dog\nout prn Dog@made\nout prn Dog@report&\n\nDog dcl now\n  made dsh 0\n  Dog dmk now\n    made add 1\n  report dsf txt\n    report ert \"Dogs so far: \"+txt&made",
    "out": "2\nDogs so far: 2"
   },
   {
    "h": "Cleanup when a thing goes away",
    "text": [
     "dds is the opposite of dmk: it runs by itself when the thing disappears, which happens when its block ends. So off prints before done."
    ],
    "code": "now bbl now\n  t mak Torch\n  out prn \"using it\"\nout prn \"done\"\n\nTorch dcl now\n  Torch dmk now\n    out prn \"on\"\n  Torch dds now\n    out prn \"off\"",
    "out": "on\nusing it\noff\ndone"
   }
  ],
  "lines": [
   {
    "line": "Dog dcl now",
    "say": "Start the plan for a class called Dog."
   },
   {
    "line": "age dfd 3",
    "say": "Give each dog a field called age that begins at 3."
   },
   {
    "line": "rex mak Dog",
    "say": "Make a new Dog called rex."
   },
   {
    "line": "rex@name is \"Rex\"",
    "say": "Set the name field of rex to Rex."
   },
   {
    "line": "Dog dmk now",
    "say": "Say what happens each time a Dog is made."
   },
   {
    "line": "money dsc 0",
    "say": "Give the class a secret field that starts at 0."
   },
   {
    "line": "area dkn num",
    "say": "Make a method that gives back a number and promises to change no field."
   },
   {
    "line": "made dsh 0",
    "say": "Make one field shared by every thing of the class."
   }
  ],
  "mistakes": [
   {
    "code": "acct mak Bank\nacct@money is 1000000\n\nBank dcl now\n  money dsc 0",
    "says": "Line 2: money is a secret in Bank, so it can only be used inside it.",
    "fix": "Leave the secret alone from outside and change it through the class's own method, such as pay_in.",
    "fix_code": "acct mak Bank\nacct pay_in 70\nout prn acct@balance\n\nBank dcl now\n  money dsc 0\n  pay_in dfn now\n    n dpm num\n    n igt 0\n      money add n\n  balance dfn num\n    balance ert money"
   },
   {
    "code": "Box dcl now\n  w dfd 2\n  grow dkn now\n    w add 1",
    "says": "Line 4: grow is a constant function (dkn), so it can't change w.",
    "fix": "A method that changes a field can't be dkn; make grow a plain dfn and keep dkn for methods that only read.",
    "fix_code": "b mak Box\nb grow now\nout prn b@w\n\nBox dcl now\n  w dfd 2\n  grow dfn now\n    w add 1",
    "fix_out": "3"
   }
  ],
  "practice": [
   {
    "q": "Make a Player class with a name and a score starting at 0, and a win method that adds 10. Make one, win twice, and print it.",
    "answer": "Each win adds 10 to that player's own score, so it ends at 20.",
    "answer_code": "p mak Player\np@name is \"Ada\"\np win now\np win now\nout prn p\n\nPlayer dcl now\n  name dfd txt\n  score dfd 0\n  win dfn now\n    score add 10",
    "answer_out": "Player(name: Ada, score: 20)"
   },
   {
    "q": "Make two dogs from a plan with one age field. Are they equal? What happens after you change one dog's age?",
    "answer": "== compares every field. Same ages give yes; after the change it gives nay.",
    "answer_code": "a mak Dog\nb mak Dog\nout prn a==b\nb@age is 9\nout prn a==b\n\nDog dcl now\n  age dfd 3",
    "answer_out": "yes\nnay"
   },
   {
    "q": "Give a Box with width 2 and height 3 a method that reports its area without changing anything.",
    "answer": "dkn marks area as read-only, and it gives back 2 times 3.",
    "answer_code": "b mak Box\nout prn b@area\n\nBox dcl now\n  w dfd 2\n  h dfd 3\n  area dkn num\n    area ert w*h",
    "answer_out": "6"
   }
  ],
  "watch_out": [
   "Trying to set a secret field from outside the class is refused by the Studio. Go through one of the class's own methods instead."
  ],
  "recap": [
   "Write a class with dcl, fields with dfd and methods with dfn.",
   "Make things with mak, reach in with @, and call methods by name.",
   "Set things up with dmk and clean up with dds.",
   "Use slf, secret fields and hidden methods to keep a class tidy and safe.",
   "Share a field or function across the whole class with dsh and dsf.",
   "Compare two things of the same kind with ==."
  ]
 },
 {
  "num": 27,
  "title": "Children",
  "idea": "A child class starts with everything its parent has and then adds its own parts, so shared code is written once. Children can also redo a parent's function their own way, which lets one list hold different kinds of things that each answer in their own voice.",
  "sections": [
   {
    "h": "Naming the parent",
    "text": [
     "The third word of dcl names the parent: Dog dcl Animal. d gets name and eat from Animal, plus its own tricks and bark.",
     "The parent can sit below the child in the file; English++ orders them for C++."
    ],
    "code": "d mak Dog\nd@name is \"Rex\"\nd eat now\nd bark now\nout prn d\n\nAnimal dcl now\n  name dfd \"?\"\n  eat dfn now\n    out prn \"@name is eating.\"\n\nDog dcl Animal\n  tricks dfd 2\n  bark dfn now\n    out prn \"@name says woof!\"",
    "out": "Rex is eating.\nRex says woof!\nDog(name: Rex, tricks: 2)"
   },
   {
    "h": "Fields for the family",
    "text": [
     "A plain secret is hidden even from children. dfm makes a field the class and its children can use, and dfy does the same for a function.",
     "Dog's report runs rest, which raises energy from 5 to 6."
    ],
    "code": "d mak Dog\nout prn d@report\n\nAnimal dcl now\n  energy dfm 5\n  rest dfy now\n    energy add 1\n\nDog dcl Animal\n  report dfn num\n    now rest now\n    report ert energy",
    "out": "6"
   },
   {
    "h": "Building the parent part first",
    "text": [
     "When the parent's dmk needs values, the child's dmk hands them up with dbs, as its first line. The parent part is always made before the child part."
    ],
    "code": "d mak Dog&\"Rex\"\nout prn d\n\nAnimal dcl now\n  name dfd txt\n  Animal dmk now\n    n dpm txt\n    name is n\n    out prn \"An animal is made.\"\n\nDog dcl Animal\n  tricks dfd 0\n  Dog dmk now\n    given dpm txt\n    now dbs given\n    out prn \"A dog is made.\"",
    "out": "An animal is made.\nA dog is made.\nDog(name: Rex, tricks: 0)"
   },
   {
    "h": "Two parents",
    "text": [
     "A class can have two parents joined with &. With two, name the one dbs is talking to: Animal dbs given."
    ],
    "code": "d mak Dog&\"Rex\"\nout prn d@name\nout prn d@hugs\n\nAnimal dcl now\n  name dfd txt\n  Animal dmk now\n    n dpm txt\n    name is n\n\nFriend dcl now\n  hugs dfd 3\n\nDog dcl Animal&Friend\n  Dog dmk now\n    given dpm txt\n    Animal dbs given",
    "out": "Rex\n3"
   },
   {
    "h": "Redoing a function",
    "text": [
     "dvr lets children redo a function, and dov is the child's own version. An Animal says ..., a Dog says Woof."
    ],
    "code": "a mak Animal\nd mak Dog\nout prn a@sound\nout prn d@sound\n\nAnimal dcl now\n  sound dvr txt\n    sound ert \"...\"\n\nDog dcl Animal\n  sound dov txt\n    sound ert \"Woof\"",
    "out": "...\nWoof"
   },
   {
    "h": "A function every child must supply",
    "text": [
     "dmb has no body: each child has to provide its own. Circle does, so a Circle can be made and asked for its area."
    ],
    "code": "c mak Circle\nout prn c@area\n\nShape dcl now\n  area dmb dec\n\nCircle dcl Shape\n  r dfd 2.0\n  area dov dec\n    area ert npi*r*r",
    "out": "12.5664"
   },
   {
    "h": "Mixed animals in one list",
    "text": [
     "A list of own pointers to Animal can hold both dogs and cats, made with mwn. The loop just asks for a sound and each one gives its own.",
     "This idea is called polymorphism."
    ],
    "code": "pets mak vec@own@Animal\nd mwn Dog\npets add d\nc mwn Cat\npets add c\np fea pets\n  out prn p@sound\n\nAnimal dcl now\n  sound dmb txt\n\nDog dcl Animal\n  sound dov txt\n    sound ert \"Woof\"\n\nCat dcl Animal\n  sound dov txt\n    sound ert \"Meow\"",
    "out": "Woof\nMeow"
   }
  ],
  "lines": [
   {
    "line": "Dog dcl Animal",
    "say": "Make a class Dog whose parent is Animal."
   },
   {
    "line": "Dog dcl Animal&Friend",
    "say": "Make a class Dog with two parents, Animal and Friend."
   },
   {
    "line": "now dbs given",
    "say": "Build the parent part first, handing it given."
   },
   {
    "line": "energy dfm 5",
    "say": "Give the class a field its children can use too, starting at 5."
   },
   {
    "line": "rest dfy now",
    "say": "Make a function only the class and its children can run."
   },
   {
    "line": "sound dvr txt",
    "say": "Make a function that gives back text and that children may redo."
   },
   {
    "line": "sound dov txt",
    "say": "Redo the parent's sound function for this class."
   },
   {
    "line": "area dmb dec",
    "say": "Promise an area function that every child must supply."
   }
  ],
  "mistakes": [
   {
    "code": "s mak Shape\n\nShape dcl now\n  area dmb dec",
    "says": "Line 1: Shape can't be made by itself, because area still has to be redone (dmb). Make a child that redoes it.",
    "fix_code": "c mak Circle\nout prn c@area\n\nShape dcl now\n  area dmb dec\n\nCircle dcl Shape\n  r dfd 2.0\n  area dov dec\n    area ert npi*r*r",
    "fix_out": "12.5664",
    "fix": "Make a child that redoes area with dov, and make that child instead of Shape."
   }
  ],
  "practice": [
   {
    "q": "Make a Shape class with an area every child must supply. Give it a Square child with a side and a Circle child with a radius, put one of each in a list of own Shapes, and print each area.",
    "answer": "Each child redoes area its own way, so the loop prints the square's area and then the circle's.",
    "answer_code": "shapes mak vec@own@Shape\ns mwn Square&2.0\nshapes add s\nc mwn Circle&1.0\nshapes add c\nx fea shapes\n  out prn x@area\n\nShape dcl now\n  area dmb dec\n\nSquare dcl Shape\n  side dfd 1.0\n  Square dmk now\n    given dpm dec\n    side is given\n  area dov dec\n    area ert side*side\n\nCircle dcl Shape\n  r dfd 1.0\n  Circle dmk now\n    given dpm dec\n    r is given\n  area dov dec\n    area ert npi*r*r",
    "answer_out": "4\n3.14159"
   },
   {
    "q": "Add a Cat that says Meow next to a Dog that says Woof, and loop over both.",
    "answer": "The list holds own pointers to Animal; each pet answers with its own sound.",
    "answer_code": "pets mak vec@own@Animal\nd mwn Dog\npets add d\nc mwn Cat\npets add c\np fea pets\n  out prn p@sound\n\nAnimal dcl now\n  sound dmb txt\n\nDog dcl Animal\n  sound dov txt\n    sound ert \"Woof\"\n\nCat dcl Animal\n  sound dov txt\n    sound ert \"Meow\"",
    "answer_out": "Woof\nMeow"
   },
   {
    "q": "Why can't you make an Animal by itself when its sound is written with dmb?",
    "answer": "dmb leaves sound without a body, so an Animal on its own would be missing a part. Only a child that redoes sound can be made."
   }
  ],
  "watch_out": [
   "If the parent's dmk takes values, the child must hand them over with dbs; the parent part is always built before the child's own lines run."
  ],
  "recap": [
   "Make a child class by naming a parent as the third word of dcl.",
   "Share fields and functions with children using dfm and dfy.",
   "Hand values to the parent's maker with dbs.",
   "Let children redo a function with dvr and dov, or require it with dmb.",
   "Hold different children in one list and let each answer its own way."
  ]
 },
 {
  "num": 28,
  "title": "More Kinds of Your Own",
  "idea": "Besides classes, English++ has a few smaller ways to make your own kinds. Choices, simple structs, your own math marks, short names for long kinds, and unions each fit a special job, and each one makes the program say more clearly what it means.",
  "sections": [
   {
    "h": "A fixed set of choices",
    "text": [
     "den lists the only values a Mood can have. A choice prints by its name, can be compared, and works neatly with bsw, one case per choice.",
     "A typo in a choice is caught by the Studio, unlike a typo in plain text."
    ],
    "code": "Mood den happy&sad&sleepy\nm is Mood@happy\nout prn m\nm ieq Mood@happy\n  out prn \"Smile!\"\nm is Mood@sleepy\nm bsw now\n  now bcs happy\n    out prn \"Yay\"\n  now bcs sad\n    out prn \"Oh no\"\n  now bcs sleepy\n    out prn \"Zzz\"",
    "out": "happy\nSmile!\nZzz"
   },
   {
    "h": "Simple structs",
    "text": [
     "dst makes a struct, which behaves like a class but signals a simple bundle of fields. Its values can be handed in order when it is made."
    ],
    "code": "a is Spot&1&2\nout prn a\nout prn a@y\n\nSpot dst now\n  x dfd 0\n  y dfd 0",
    "out": "Spot(x: 1, y: 2)\n2"
   },
   {
    "h": "Teaching + to your kind",
    "text": [
     "dop sets what a math mark does for your kind. Here + builds a new Spot from the two x values and the two y values.",
     "o is taken with see@Spot, so it is only looked at, never changed."
    ],
    "code": "a is Spot&1&2\nb is Spot&3&4\nc is a+b\nout prn c\n\nSpot dst now\n  x dfd 0\n  y dfd 0\n  + dop Spot\n    o dpm see@Spot\n    r is Spot&x+o@x&y+o@y\n    + ert r",
    "out": "Spot(x: 4, y: 6)"
   },
   {
    "h": "Making a list sortable",
    "text": [
     "Once < is defined for Card, lso knows how to put a list of cards in order by rank."
    ],
    "code": "v mak vec@Card\nv add Card&7\nv add Card&2\nv lso now\nout prn v\n\nCard dst now\n  rank dfd 0\n  < dop yno\n    o dpm see@Card\n    < ert rank<o@rank",
    "out": "[Card(rank: 2), Card(rank: 7)]"
   },
   {
    "h": "Shorter names for kinds",
    "text": [
     "dal gives an existing kind a second, shorter name. Row and Grid are still vectors, just easier to read."
    ],
    "code": "Row dal vec@num\nGrid dal vec@Row\ng mak Grid\ng add 1&2\nout prn g",
    "out": "[[1, 2]]"
   },
   {
    "h": "Unions",
    "text": [
     "dun makes a union: its fields share one piece of memory, so only one holds a value at a time. You'll rarely need it, and it doesn't print by itself."
    ],
    "code": "b mak Both\nb@whole is 65\nout prn b@whole\n\nBoth dun now\n  whole dfd num\n  part dfd dec",
    "out": "65"
   }
  ],
  "lines": [
   {
    "line": "Mood den happy&sad&sleepy",
    "say": "Make a kind called Mood whose only values are happy, sad and sleepy."
   },
   {
    "line": "m is Mood@happy",
    "say": "Set m to the happy choice of Mood."
   },
   {
    "line": "now bcs happy",
    "say": "Inside a bsw, run the lines below when the value is happy."
   },
   {
    "line": "Spot dst now",
    "say": "Start a simple struct called Spot."
   },
   {
    "line": "+ dop Spot",
    "say": "Say what + does to Spots; it gives back a Spot."
   },
   {
    "line": "o dpm see@Spot",
    "say": "Take the other Spot just to look at it."
   },
   {
    "line": "Row dal vec@num",
    "say": "Let Row be a shorter name for a vector of numbers."
   },
   {
    "line": "Both dun now",
    "say": "Start a union called Both whose fields share memory."
   }
  ],
  "mistakes": [
   {
    "code": "Mood den happy&sad\nm is Mood@hapy",
    "says": "Line 2: Mood has no choice called hapy. Its choices: happy, sad. Did you mean happy?",
    "fix": "Spell the choice exactly as it appears in the den line: Mood@happy."
   }
  ],
  "practice": [
   {
    "q": "Make a Color choice with red, green and blue. Store one in a name and use bsw to print a different word for each.",
    "answer": "With green stored, only the green case runs.",
    "answer_code": "Color den red&green&blue\nc is Color@green\nc bsw now\n  now bcs red\n    out prn \"Stop\"\n  now bcs green\n    out prn \"Go\"\n  now bcs blue\n    out prn \"Sky\"",
    "answer_out": "Go"
   },
   {
    "q": "Make a Spot struct with x and y, build one from 1 and 2 in a single line, and print it and its y.",
    "answer": "The values go in order, so x is 1 and y is 2.",
    "answer_code": "a is Spot&1&2\nout prn a\nout prn a@y\n\nSpot dst now\n  x dfd 0\n  y dfd 0",
    "answer_out": "Spot(x: 1, y: 2)\n2"
   },
   {
    "q": "Why use a den choice instead of the text \"happy\"?",
    "answer": "A misspelled text is still valid text, so the mistake slips through. A misspelled choice is refused by the Studio straight away, and it even suggests the right spelling."
   }
  ],
  "recap": [
   "Define a fixed set of choices with den and switch on them with bsw.",
   "Bundle simple fields with dst and build one with its values in order.",
   "Give your own kind math marks like + and < with dop.",
   "Shorten a long kind name with dal.",
   "Know what a union is, and why it rarely appears."
  ]
 },
 {
  "num": 29,
  "title": "Any Kind",
  "idea": "Some jobs are the same whatever kind of value they handle, like picking the bigger of two. Instead of writing one version per kind, you write it once with a stand-in kind, and English++ fills in the real kind each time it is used.",
  "sections": [
   {
    "h": "One function, many kinds",
    "text": [
     "T dtp now, written just above biggest, says T is a kind to be decided later. Called with numbers, decimals or texts, biggest works on each.",
     "For texts, bigger means later in alphabetical order, so pear wins."
    ],
    "code": "out prn biggest&3&9\nout prn biggest&2.5&1.5\nout prn biggest&\"apple\"&\"pear\"\n\nT dtp now\nbiggest dfn T\n  x dpm T\n  y dpm T\n  x igt y\n    biggest ert x\n  biggest ert y",
    "out": "9\n2.5\npear"
   },
   {
    "h": "A struct for any kind",
    "text": [
     "The same stand-in works for structs and classes. Box@num fills T in with num, and Box@txt with txt.",
     "That's exactly how vec@num works: a container with its kind filled in."
    ],
    "code": "n mak Box@num\nn@item is 7\nout prn n@item\ns mak Box@txt\ns@item is \"hello\"\nout prn s@item\n\nT dtp now\nBox dst now\n  item dfd T",
    "out": "7\nhello"
   },
   {
    "h": "any: one parameter of any kind",
    "text": [
     "Writing any as the kind of a parameter is the quick route when only one value needs to be flexible. show_twice prints whatever it is handed, twice."
    ],
    "code": "now show_twice 5\nnow show_twice \"hi\"\n\nshow_twice dfn now\n  x dpm any\n  out prn x\n  out prn x",
    "out": "5\n5\nhi\nhi"
   }
  ],
  "lines": [
   {
    "line": "T dtp now",
    "say": "Make T a kind that gets filled in later."
   },
   {
    "line": "biggest dfn T",
    "say": "Make a function called biggest that gives back a T."
   },
   {
    "line": "x dpm T",
    "say": "Take x, whose kind is whatever T turns out to be."
   },
   {
    "line": "n mak Box@num",
    "say": "Make n, a Box whose T is num."
   },
   {
    "line": "x dpm any",
    "say": "Take x, which can be a value of any kind."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Write a function that accepts one value, whatever its kind, and prints \"It is:\" in front of it. Call it with 5 and with \"five\".",
    "answer": "x dpm any accepts both, and the @x fill-in puts the value into the text.",
    "answer_code": "now tell 5\nnow tell \"five\"\n\ntell dfn now\n  x dpm any\n  out prn \"It is: @x\"",
    "answer_out": "It is: 5\nIt is: five"
   },
   {
    "q": "Use Box with a txt to hold a greeting, then print it.",
    "answer": "Box@txt fills T in as txt, so item holds text.",
    "answer_code": "s mak Box@txt\ns@item is \"hi there\"\nout prn s@item\n\nT dtp now\nBox dst now\n  item dfd T"
   },
   {
    "q": "When would you pick any instead of dtp?",
    "answer": "any is the quick choice for one parameter of any kind. dtp gives the kind a name, so several parameters, the result, or a whole class can share it."
   }
  ],
  "watch_out": [
   "Where C++ templates can bury you in pages of errors, the Studio reports a problem with a stand-in kind in one sentence."
  ],
  "recap": [
   "Write one function for many kinds with a dtp stand-in.",
   "Fill in a struct's kind with @, as in Box@num.",
   "Take a single value of any kind with dpm any.",
   "See vec@num as the same idea: a container with its kind filled in."
  ]
 },
 {
  "num": 30,
  "title": "Pointers",
  "idea": "A pointer holds the location of another box, so you can reach and change that box through it. Pointers are a classic source of C++ crashes; English++ keeps them safer by stopping with a clear message on a nil pointer and by offering owners that clean up by themselves.",
  "sections": [
   {
    "h": "Pointing at a box",
    "text": [
     "mpt makes p hold the place of x. A * before the pointer's name means the box it points at.",
     "Writing 7 through *p changes x, even though x itself was never named."
    ],
    "code": "x is 5\np mpt x\nout prn *p\n*p is 7\nout prn x",
    "out": "5\n7"
   },
   {
    "h": "Fields through a pointer",
    "text": [
     "To reach a field through a pointer, @ is all you need. C++ would want -> here; English++ works it out for you."
    ],
    "code": "rex mak Dog\np mpt rex\np@age is 5\nout prn rex@age\n\nDog dst now\n  age dfd 3",
    "out": "5"
   },
   {
    "h": "Pointing at nothing",
    "text": [
     "nil means nothing. A fresh ptr@num starts as nil, so you can test it before you use it."
    ],
    "code": "q mak ptr@num\nq ieq nil\n  out prn \"q points at nothing\"\nx is 5\nq mpt x\nq ine nil\n  out prn *q",
    "out": "q points at nothing\n5"
   },
   {
    "h": "One owner that cleans up",
    "text": [
     "mwn makes a thing with a single owner. When the owner's block ends, the thing is cleaned up on its own, so dds prints before the last line."
    ],
    "code": "now bbl now\n  t mwn Torch\n  t@name is \"big\"\n  out prn t@name\nout prn \"the block is over\"\n\nTorch dcl now\n  name dfd txt\n  Torch dds now\n    out prn \"cleaned up\"",
    "out": "big\ncleaned up\nthe block is over"
   },
   {
    "h": "Handing ownership over",
    "text": [
     "An owned thing can only have one owner, so mmv moves it. After the move, the old name holds nil."
    ],
    "code": "a mwn Torch\na@name is \"big\"\nb mmv a\nout prn b@name\na ieq nil\n  out prn \"a holds nothing now\"\n\nTorch dcl now\n  name dfd txt",
    "out": "big\na holds nothing now"
   },
   {
    "h": "Shared owners",
    "text": [
     "msh makes a thing several names can own together. use_count shows how many owners there are, and the thing goes away when the last one does."
    ],
    "code": "a msh Torch\nout prn a@use_count\nb is a\nout prn a@use_count\nb@name is \"shared\"\nout prn a@name\n\nTorch dcl now\n  name dfd txt",
    "out": "1\n2\nshared"
   },
   {
    "h": "By hand, only when needed",
    "text": [
     "mnw makes a thing nobody owns, and edl removes it. Keep these for C++ libraries that ask for them.",
     "After edl the pointer is reset to nil, which blocks any accidental second use."
    ],
    "code": "p mnw Torch\np@name is \"hand made\"\nout prn p@name\nnow edl p\np ieq nil\n  out prn \"p is nil now\"\n\nTorch dcl now\n  name dfd txt",
    "out": "hand made\np is nil now"
   }
  ],
  "lines": [
   {
    "line": "p mpt x",
    "say": "Make p a pointer to x."
   },
   {
    "line": "*p is 7",
    "say": "Put 7 in the box p points at."
   },
   {
    "line": "q mak ptr@num",
    "say": "Make q, a pointer to a number, starting at nil."
   },
   {
    "line": "q ieq nil",
    "say": "If q points at nothing, run the lines below."
   },
   {
    "line": "t mwn Torch",
    "say": "Make a Torch that t alone owns."
   },
   {
    "line": "b mmv a",
    "say": "Move what a holds into b, leaving a empty."
   },
   {
    "line": "a msh Torch",
    "say": "Make a Torch that can have many owners."
   },
   {
    "line": "p mnw Torch",
    "say": "Make a Torch by hand that nobody owns."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Start with x holding 5 and p pointing at it. Raise x by 1 using only p, then print x.",
    "answer": "*p add 1 changes the box p points at, which is x.",
    "answer_code": "x is 5\np mpt x\n*p add 1\nout prn x",
    "answer_out": "6"
   },
   {
    "q": "Point p at a, print through it, then point it at b and print again.",
    "answer": "A pointer can be moved to point at a different box later.",
    "answer_code": "a is 1\nb is 2\np mpt a\nout prn *p\np mpt b\nout prn *p",
    "answer_out": "1\n2"
   },
   {
    "q": "Hand a shared Torch to a function. How many owners are there inside the function, and after it returns?",
    "answer": "While the function runs, its parameter is one more owner, so it counts 2. Once it returns, the count is back to 1.",
    "answer_code": "a msh Torch\na@name is \"big\"\nnow show_it a\nout prn a@use_count\n\nshow_it dfn now\n  t dpm shr@Torch\n  out prn t@name\n  out prn t@use_count\n\nTorch dcl now\n  name dfd txt",
    "answer_out": "big\n2\n1"
   },
   {
    "q": "What happens if you print *q while q is still nil?",
    "answer": "The program stops and names the line, explaining that it tried to use something that isn't there. In C++ this usually crashes with no explanation.",
    "answer_code": "q mak ptr@num\nout prn \"before\"\nout prn *q",
    "answer_out": "before\n\nThe program stopped on line 3:\n    out prn *q\nIt tried to use something that is not there: a pointer to nothing, or a position far outside a collection."
   }
  ],
  "watch_out": [
   "Forgetting edl after mnw leaks that memory until the program ends. Prefer mwn or msh, which clean up by themselves."
  ],
  "recap": [
   "Make a pointer with mpt and reach its target with *.",
   "Reach fields through a pointer with @.",
   "Test for nil before using a pointer that might be empty.",
   "Choose mwn for one owner, msh for many, and move with mmv.",
   "Use mnw and edl only when a library needs them."
  ]
 },
 {
  "num": 31,
  "title": "More Tricks for Your Classes",
  "idea": "Your own classes can behave like the kinds built into the language: reached by position with @, called like a function with &, or added to with add. A few more tools let you check what a pointer really points at, pack tiny fields into a few bits, and say how a thing is moved.",
  "sections": [
   {
    "h": "Reached by position",
    "text": [
     "An operator named at lets a Row be reached with @, just like a list. It gives back a reference, so r@1 is 4 writes into the Row."
    ],
    "code": "r mak Row\nr@1 is 4\nout prn r@1\n\nRow dcl now\n  v dfd arr@num@4\n  at dop ref@num\n    i dpm num\n    at ert v@i",
    "out": "4"
   },
   {
    "h": "Called like a function",
    "text": [
     "An operator named call lets a thing be run with &. This Adder remembers 5 and adds it to whatever it receives."
    ],
    "code": "a mak Adder&5\nout prn a&3\n\nAdder dst now\n  k dfd 0\n  call dop num\n    n dpm num\n    call ert n+k",
    "out": "8"
   },
   {
    "h": "Adding to your own kind",
    "text": [
     "Defining += with dop is what makes add work on a Dot. It returns slf, the Dot itself, after adding."
    ],
    "code": "d mak Dot\nd add 3\nd add 4\nout prn d@x\n\nDot dst now\n  x dfd 0\n  += dop ref@Dot\n    o dpm num\n    x add o\n    += ert slf",
    "out": "7"
   },
   {
    "h": "What is it really?",
    "text": [
     "ptr@Dog&p checks whether an Animal pointer actually points at a Dog. You get a Dog pointer back, or nil if it is some other Animal.",
     "The things were made by hand with mnw, so edl removes them at the end."
    ],
    "code": "pet mnw Dog\nother mnw Animal\np mak ptr@Animal\np is pet\ndog is ptr@Dog&p\nout prn dog@speak&\nnone is ptr@Dog&other\nout prn none==nil\nnow edl pet\nnow edl other\n\nAnimal dcl now\n  speak dvr txt\n    speak ert \"?\"\n\nDog dcl Animal\n  speak dov txt\n    speak ert \"woof\"",
    "out": "woof\nyes"
   },
   {
    "h": "Fields of a few bits",
    "text": [
     "dbb sets how many bits a field takes. One bit holds 0 or 1, and three bits hold up to 7, which saves room across many small things."
    ],
    "code": "f mak Flags\nf@ok is 1\nf@level is 5\nout prn f@ok\nout prn f@level\n\nFlags dst now\n  ok dbb 1\n  level dbb 3",
    "out": "1\n5"
   },
   {
    "h": "Saying how to be moved",
    "text": [
     "A dmk that takes a tkn@Kept parameter says how a Kept is moved. mmv uses it, and the +1 shows that the moving maker really ran."
    ],
    "code": "k mak Kept\nw mmv k\nout prn w@x\n\nKept dcl now\n  x dfd 0\n  Kept dmk now\n    x is 1\n  Kept dmk now\n    o dpm tkn@Kept\n    x is o@x+1",
    "out": "2"
   }
  ],
  "lines": [
   {
    "line": "at dop ref@num",
    "say": "Let this class be reached by position, giving back a reference to a number."
   },
   {
    "line": "call dop num",
    "say": "Let a thing of this class be called with &, giving back a number."
   },
   {
    "line": "+= dop ref@Dot",
    "say": "Say what += does to a Dot, so add works on it."
   },
   {
    "line": "dog is ptr@Dog&p",
    "say": "Set dog to p as a Dog pointer, or nil if p isn't pointing at a Dog."
   },
   {
    "line": "ok dbb 1",
    "say": "Give the struct a field that uses just one bit."
   },
   {
    "line": "o dpm tkn@Kept",
    "say": "Take o, a Kept handed over to be kept."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Make a class that holds a number, with a call operator that multiplies its input by that number.",
    "answer": "Times keeps 3, so calling it with 5 gives 15.",
    "answer_code": "t mak Times&3\nout prn t&5\n\nTimes dst now\n  k dfd 0\n  call dop num\n    n dpm num\n    call ert n*k",
    "answer_out": "15"
   },
   {
    "q": "Make two Adders, one keeping 5 and one keeping 10, and call each with 3.",
    "answer": "Each Adder adds its own k, so you get 8 and 13.",
    "answer_code": "add5 mak Adder&5\nadd10 mak Adder&10\nout prn add5&3\nout prn add10&3\n\nAdder dst now\n  k dfd 0\n  call dop num\n    n dpm num\n    call ert n+k",
    "answer_out": "8\n13"
   },
   {
    "q": "What does ptr@Dog&p give when p points at an Animal that isn't a Dog?",
    "answer": "nil. That is why the Book's program can print yes for none==nil."
   }
  ],
  "recap": [
   "Let your class be reached by position with an at operator.",
   "Make a thing callable with a call operator.",
   "Teach += to your kind so add works on it.",
   "Check what a pointer really points at with ptr@Kind&p.",
   "Pack small fields with dbb and say how a class moves with tkn."
  ]
 },
 {
  "num": 32,
  "title": "Project: A Pet Shop",
  "idea": "This project pulls classes, children and mixed lists into one small program: a pet shop where every pet grows hungry and each kind makes its own sound. It's built one step at a time, so you can see how each new piece slots in without rewriting the rest.",
  "sections": [
   {
    "h": "Step 1: a single pet",
    "text": [
     "Begin with one Pet class holding a name and a hunger level. Its maker stores the name, and hunger starts at 0."
    ],
    "code": "p mak Pet&\"Rex\"\nout prn p\n\nPet dcl now\n  name dfd txt\n  hunger dfd 0\n  Pet dmk now\n    n dpm txt\n    name is n",
    "out": "Pet(name: Rex, hunger: 0)"
   },
   {
    "h": "Step 2: wait and feed",
    "text": [
     "wait raises hunger by 2, and feed lowers it by the food given. nmx picks the larger of the result and 0, so hunger can never drop below zero."
    ],
    "code": "p mak Pet&\"Rex\"\np wait now\np wait now\nout prn p@hunger\np feed 5\nout prn p@hunger\n\nPet dcl now\n  name dfd txt\n  hunger dfd 0\n  Pet dmk now\n    n dpm txt\n    name is n\n  wait dfn now\n    hunger add 2\n  feed dfn now\n    food dpm num\n    hunger is nmx&hunger-food&0",
    "out": "4\n0"
   },
   {
    "h": "Step 3: dogs and cats",
    "text": [
     "Pet now insists every child supply a sound, using dmb. Dog and Cat each redo it with dov, and their makers pass the name up with dbs."
    ],
    "code": "d mak Dog&\"Rex\"\nc mak Cat&\"Tom\"\nout prn d@sound\nout prn c@sound\nout prn c@name\n\nPet dcl now\n  name dfd txt\n  Pet dmk now\n    n dpm txt\n    name is n\n  sound dmb txt\n\nDog dcl Pet\n  Dog dmk now\n    n dpm txt\n    now dbs n\n  sound dov txt\n    sound ert \"Woof\"\n\nCat dcl Pet\n  Cat dmk now\n    n dpm txt\n    now dbs n\n  sound dov txt\n    sound ert \"Meow\"",
    "out": "Woof\nMeow\nTom"
   },
   {
    "h": "Step 4: a shop of mixed pets",
    "text": [
     "The shop is a list of own@Pet, filled with mwn, so dogs and cats can sit side by side. The loop asks each one for its name and sound."
    ],
    "code": "shop mak vec@own@Pet\nd mwn Dog&\"Rex\"\nshop add d\nc mwn Cat&\"Tom\"\nshop add c\np fea shop\n  name is p@name\n  sound is p@sound\n  out prn \"@name says @sound\"\n\nPet dcl now\n  name dfd txt\n  Pet dmk now\n    n dpm txt\n    name is n\n  sound dmb txt\n\nDog dcl Pet\n  Dog dmk now\n    n dpm txt\n    now dbs n\n  sound dov txt\n    sound ert \"Woof\"\n\nCat dcl Pet\n  Cat dmk now\n    n dpm txt\n    now dbs n\n  sound dov txt\n    sound ert \"Meow\"",
    "out": "Rex says Woof\nTom says Meow"
   },
   {
    "h": "Step 5: the whole shop",
    "text": [
     "Each day every pet waits, and look_after checks it. A pet whose hunger has reached 6 makes its sound and gets fed; the others just report their hunger.",
     "A new kind of pet needs only a new class and one more add: the daily loop stays the same."
    ],
    "code": "note A little pet shop\nshop mak vec@own@Pet\nd mwn Dog&\"Rex\"\nshop add d\nc mwn Cat&\"Tom\"\nshop add c\nday fle 3\n  today is day+1\n  out prn \"Day @today\"\n  p fea shop\n    p wait now\n    now look_after p\nout prn \"The shop is closed.\"\n\nlook_after dfn now\n  pet dpm see@own@Pet\n  name is pet@name\n  hunger is pet@hunger\n  hunger ige 6\n    sound is pet@sound\n    out prn \"  @name says @sound, and gets fed.\"\n    pet feed 6\n  now oth now\n    out prn \"  @name is fine, with hunger @hunger.\"\n\nPet dcl now\n  name dfd txt\n  hunger dfd 0\n  Pet dmk now\n    n dpm txt\n    name is n\n  wait dfn now\n    hunger add 2\n  feed dfn now\n    food dpm num\n    hunger is nmx&hunger-food&0\n  sound dmb txt\n\nDog dcl Pet\n  Dog dmk now\n    n dpm txt\n    now dbs n\n  sound dov txt\n    sound ert \"Woof\"\n\nCat dcl Pet\n  Cat dmk now\n    n dpm txt\n    now dbs n\n  sound dov txt\n    sound ert \"Meow\"",
    "out": "Day 1\n  Rex is fine, with hunger 2.\n  Tom is fine, with hunger 2.\nDay 2\n  Rex is fine, with hunger 4.\n  Tom is fine, with hunger 4.\nDay 3\n  Rex says Woof, and gets fed.\n  Tom says Meow, and gets fed.\nDay 4\n  Rex is fine, with hunger 2.\n  Tom is fine, with hunger 2.\nThe shop is closed."
   }
  ],
  "lines": [
   {
    "line": "p mak Pet&\"Rex\"",
    "say": "Make p, a Pet named Rex."
   },
   {
    "line": "hunger add 2",
    "say": "Inside wait, raise this pet's hunger by 2."
   },
   {
    "line": "Dog dcl Pet",
    "say": "Make a Dog class whose parent is Pet."
   },
   {
    "line": "hunger is nmx&hunger-food&0",
    "say": "Set hunger to hunger minus food, but never less than 0."
   },
   {
    "line": "sound dmb txt",
    "say": "Require every child to supply its own sound, which gives back text."
   },
   {
    "line": "shop mak vec@own@Pet",
    "say": "Make shop, a list of owned pets of any kind."
   },
   {
    "line": "d mwn Dog&\"Rex\"",
    "say": "Make an owned Dog named Rex."
   },
   {
    "line": "pet dpm see@own@Pet",
    "say": "Take pet, an owned Pet, just to look at."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Add a Bird with its own sound, and make dogs get hungrier faster: let Pet's wait be redone, and have Dog's version add 3.",
    "answer": "wait becomes dvr in Pet and Dog redoes it with dov. After one wait, Rex is at 3 and Kiwi at 2.",
    "answer_code": "shop mak vec@own@Pet\nd mwn Dog&\"Rex\"\nshop add d\nb mwn Bird&\"Kiwi\"\nshop add b\np fea shop\n  p wait now\n  name is p@name\n  sound is p@sound\n  hunger is p@hunger\n  out prn \"@name says @sound, with hunger @hunger\"\n\nPet dcl now\n  name dfd txt\n  hunger dfd 0\n  Pet dmk now\n    n dpm txt\n    name is n\n  wait dvr now\n    hunger add 2\n  sound dmb txt\n\nDog dcl Pet\n  Dog dmk now\n    n dpm txt\n    now dbs n\n  wait dov now\n    hunger add 3\n  sound dov txt\n    sound ert \"Woof\"\n\nBird dcl Pet\n  Bird dmk now\n    n dpm txt\n    now dbs n\n  sound dov txt\n    sound ert \"Tweet\"",
    "answer_out": "Rex says Woof, with hunger 3\nKiwi says Tweet, with hunger 2"
   },
   {
    "q": "Make Rex wait three times, then feed him 10. What is his hunger after each step?",
    "answer": "Three waits bring hunger to 6. Feeding 10 would go below zero, so nmx holds it at 0.",
    "answer_code": "p mak Pet&\"Rex\"\np wait now\np wait now\np wait now\nout prn p@hunger\np feed 10\nout prn p@hunger\n\nPet dcl now\n  name dfd txt\n  hunger dfd 0\n  Pet dmk now\n    n dpm txt\n    name is n\n  wait dfn now\n    hunger add 2\n  feed dfn now\n    food dpm num\n    hunger is nmx&hunger-food&0",
    "answer_out": "6\n0"
   },
   {
    "q": "Why does the shop hold own@Pet instead of plain Pets?",
    "answer": "Dogs and cats are different kinds, and each needs its own memory to keep its own sound. Owned pointers made with mwn give each pet that, and clean up when the shop goes away."
   }
  ],
  "recap": [
   "Build a class step by step, testing each step before the next.",
   "Keep a value in range with nmx.",
   "Require children to supply a function with dmb and redo it with dov.",
   "Hold different kinds in a vec@own list and loop over them.",
   "Add a new kind without touching the loop that uses it."
  ]
 },
 {
  "num": 33,
  "title": "When Things Go Wrong",
  "idea": "Programs meet trouble: a missing file, a word where a number should be. This chapter shows what happens when a program stops, and how btr, bch and etw let you catch trouble and keep going.",
  "sections": [
   {
    "h": "A program that stops",
    "text": [
     "Position 5 is not in a list of three. The program halts and names the exact English++ line that failed, in your own words, not the C++ ones."
    ],
    "code": "v is 1&2&3\ni is 5\nout prn v@i",
    "out": "The program stopped on line 3:\n    out prn v@i\nIt used a position that is not in the collection or text."
   },
   {
    "h": "Dividing by zero",
    "text": [
     "n holds 0, so 10/n can't be worked out. Again the program stops and points at line 2."
    ],
    "code": "n is 0\nout prn 10/n",
    "out": "The program stopped on line 2:\n    out prn 10/n\nIt divided a whole number by zero."
   },
   {
    "h": "Try, then catch",
    "text": [
     "Everything indented under now btr now is tried. When tnm can't turn the text into a number, the rest of that block is skipped and the lines under e bch now run instead.",
     "That is why two never prints, but three does: after the catch, the program carries on."
    ],
    "code": "now btr now\n  out prn \"one\"\n  n is tnm&\"not a number\"\n  out prn \"two\"\ne bch now\n  out prn \"That was not a number.\"\nout prn \"three\"",
    "out": "one\nThat was not a number.\nthree"
   },
   {
    "h": "Reading the problem",
    "text": [
     "Put the caught name inside a text with @e and you see the message the problem carries."
    ],
    "code": "now btr now\n  v is 1&2\n  out prn tnm&\"oops\"\ne bch now\n  out prn \"caught: @e\"",
    "out": "caught: invalid stoi argument"
   },
   {
    "h": "Throwing your own problem",
    "text": [
     "set_age refuses an age below zero with now etw. The nearest catch, back in the main part, picks it up, so not reached never prints."
    ],
    "code": "now btr now\n  now set_age -3\n  out prn \"not reached\"\ne bch now\n  out prn \"caught: @e\"\n\nset_age dfn now\n  age dpm num\n  age ilt 0\n    now etw \"An age can't be below zero.\"\n  out prn \"Age set.\"",
    "out": "caught: An age can't be below zero."
   },
   {
    "h": "Catching one kind",
    "text": [
     "A problem can be a thing you defined, here a Late with a mins field. e bch Late catches only that kind, and e@mins reads its field."
    ],
    "code": "now btr now\n  now etw Late&5\ne bch Late\n  out prn \"Late by @e@mins minutes\"\n\nLate dst now\n  mins dfd 0",
    "out": "Late by 5 minutes"
   },
   {
    "h": "Ending on purpose",
    "text": [
     "now ext 0 ends the whole program on the spot and hands 0 back to whatever started it. The last line never runs."
    ],
    "code": "out prn \"Bye.\"\nnow ext 0\nout prn \"not reached\"",
    "out": "Bye."
   }
  ],
  "lines": [
   {
    "line": "now btr now",
    "say": "Try the indented lines under this one."
   },
   {
    "line": "e bch now",
    "say": "If any of them went wrong, catch the problem and call it e."
   },
   {
    "line": "e bch Late",
    "say": "Catch only a problem of the kind Late."
   },
   {
    "line": "now etw \"bad\"",
    "say": "Throw a new problem that carries the text bad."
   },
   {
    "line": "now etw now",
    "say": "Inside a catch, hand the same problem on to the next catch out."
   },
   {
    "line": "now ext 0",
    "say": "Stop the program right here and give back 0."
   },
   {
    "line": "main ert 0",
    "say": "Finish the top level of the program, giving back 0."
   }
  ],
  "practice": [
   {
    "q": "tnm can't read \"abc\" as a number. Catch that and print a friendly message asking for digits only.",
    "answer": "Put the risky tnm line under now btr now. The catch prints the message, and the print of n inside the try is skipped.",
    "answer_code": "now btr now\n  n is tnm&\"abc\"\n  out prn n\ne bch now\n  out prn \"Please use only digits.\"",
    "answer_out": "Please use only digits."
   },
   {
    "q": "In the try-and-catch program, why does two never print?",
    "answer": "The line before it threw a problem. As soon as that happens, the rest of the try block is skipped and the program jumps to the catch."
   },
   {
    "q": "You have two catches: x bch Late and then now bch now. A plain text problem is thrown. Which one runs?",
    "answer": "The second. A text problem isn't a Late, so the first catch doesn't fit, and now bch now catches anything."
   },
   {
    "q": "What does a program do when a problem is thrown and nothing catches it?",
    "answer": "It stops, and shows the line where the problem was thrown along with what the problem says."
   }
  ],
  "recap": [
   "Tell a mistake the Studio catches while you type from a problem that only shows up while the program runs.",
   "Wrap risky lines in now btr now and handle trouble in e bch now.",
   "Read what went wrong with \"@e\" inside a text.",
   "Throw your own problem with now etw, and pass one on with now etw now.",
   "Catch only one kind of problem by naming it in bch.",
   "End the program yourself with now ext 0."
  ],
  "mistakes": []
 },
 {
  "num": 34,
  "title": "Bits and Huge Numbers",
  "idea": "Every number is stored as bits, little on-off switches. This chapter gives you words that work on those bits, tells you how big things are, and adds two new kinds: hug for whole numbers of any length and cpx for complex numbers.",
  "sections": [
   {
    "h": "Bit words that give a value",
    "text": [
     "6 is 110 in bits and 3 is 011. nnd keeps the bits on in both, nor keeps those on in either, nxr those on in only one. nnt flips every bit, and nsl and nsr slide the bits left or right."
    ],
    "code": "a is 6\nb is 3\nout prn nnd&a&b\nout prn nor&a&b\nout prn nxr&a&b\nout prn nnt&a\nout prn nsl&a&2\nout prn nsr&a&1",
    "out": "2\n7\n5\n-7\n24\n3"
   },
   {
    "h": "How big is it?",
    "text": [
     "nsz counts the bytes a thing uses: 4 for a num, 8 for a big. nlw is the smallest number a num can hold. pbg never goes below zero, so it can reach far higher."
    ],
    "code": "x is 5\ny mak big\nout prn nsz&x\nout prn nsz&y\nout prn nlw\nhuge mak pbg\nhuge is 18446744073709551615\nout prn huge",
    "out": "4\n8\n-2147483648\n18446744073709551615"
   },
   {
    "h": "Numbers with no top",
    "text": [
     "A hug keeps growing as far as memory lets it. Multiplying 2 up to 25 gives a 26-digit answer that a big could never hold."
    ],
    "code": "x mak hug\nx is 1\ni is 2\ni wle 25\n  x aml i\n  i add 1\nout prn x",
    "out": "15511210043330985984000000"
   },
   {
    "h": "Making and powering a hug",
    "text": [
     "hug& turns a long text of digits into a huge number. apw raises it to a power, here 2 to the 100th."
    ],
    "code": "x is hug&\"123456789012345678901234567890\"\nx add 1\nout prn x\ny is hug&2\ny apw 100\nout prn y",
    "out": "123456789012345678901234567891\n1267650600228229401496703205376"
   },
   {
    "h": "Complex numbers",
    "text": [
     "A cpx has a real part and an imaginary part. Adding two of them adds each part, and @real& and @imag& read the parts back."
    ],
    "code": "p mak cpx&1.0&2.0\nq mak cpx&3.0&4.0\nr is p+q\nout prn r@real&\nout prn r@imag&",
    "out": "4\n6"
   }
  ],
  "lines": [
   {
    "line": "out prn nnd&a&b",
    "say": "Print the bits that are on in both a and b."
   },
   {
    "line": "out prn nxr&a&b",
    "say": "Print the bits that are on in exactly one of a and b."
   },
   {
    "line": "out prn nsl&a&2",
    "say": "Print a with every bit moved up two places."
   },
   {
    "line": "out prn nsz&x",
    "say": "Print how many bytes x takes up."
   },
   {
    "line": "huge mak pbg",
    "say": "Make huge, a whole number that can't go below zero."
   },
   {
    "line": "x mak hug",
    "say": "Make x, a whole number with no size limit."
   },
   {
    "line": "y apw 100",
    "say": "Raise y to the power of 100, in place."
   },
   {
    "line": "p mak cpx&1.0&2.0",
    "say": "Make p, a complex number with parts 1 and 2."
   }
  ],
  "practice": [
   {
    "q": "Work out 2 to the power of 200 with a hug, then count its digits by turning it into text.",
    "answer": "Make the hug, raise it with apw, turn it into text with txt, and tsz counts the characters.",
    "answer_code": "x is hug&2\nx apw 200\ns is txt&x\nout prn tsz&s",
    "answer_out": "61"
   },
   {
    "q": "Shifting a number left by one place: what does that do to its value?",
    "answer": "It doubles it. Each bit moves up one place, which is the same as multiplying by 2."
   },
   {
    "q": "Why can't you use a num to hold 25 multiplied all the way down to 1?",
    "answer": "A num tops out around 2 billion, and that answer has 26 digits. A hug has no limit, so it holds the whole thing."
   }
  ],
  "watch_out": [
   "Moving bits right by one halves a number and throws away any remainder."
  ],
  "recap": [
   "Combine bits with nnd, nor and nxr, and flip them with nnt.",
   "Slide bits with nsl and nsr.",
   "Ask how many bytes a thing uses with nsz.",
   "Use pbg for big numbers that are never negative.",
   "Use hug for whole numbers of any size.",
   "Add and read complex numbers with cpx."
  ],
  "mistakes": []
 },
 {
  "num": 35,
  "title": "Files",
  "idea": "When a program ends, its names and values vanish. Files on the hard drive let you keep things for next time. The h family writes, reads, checks, copies and removes files and folders.",
  "sections": [
   {
    "h": "Write a file, read it back",
    "text": [
     "hwr puts the text into notes.txt, replacing anything there. hrd reads the whole file as one text, and hrm deletes it again."
    ],
    "code": "\"notes.txt\" hwr \"Remember the milk.\\n\"\nout prn hrd&\"notes.txt\"\n\"notes.txt\" hrm now",
    "out": "Remember the milk."
   },
   {
    "h": "Adding to a file",
    "text": [
     "hap adds to the end instead of replacing. hln reads the file back as a list, one item per line."
    ],
    "code": "name is \"notes.txt\"\nname hwr \"one\\n\"\nname hap \"two\\n\"\nout prn hln&name\nname hrm now",
    "out": "[one, two]"
   },
   {
    "h": "Checking a file",
    "text": [
     "hex answers yes or nay: is the file there? hsz gives its size in bytes, and hello is 5 of them."
    ],
    "code": "name is \"notes.txt\"\nout prn hex&name\nname hwr \"hello\"\nout prn hex&name\nout prn hsz&name\nname hrm now\nout prn hex&name",
    "out": "nay\nyes\n5\nnay"
   },
   {
    "h": "When the file is missing",
    "text": [
     "Reading a file that doesn't exist is a problem. Under btr, the catch prints a message instead of the program stopping."
    ],
    "code": "now btr now\n  out prn hrd&\"missing.txt\"\ne bch now\n  out prn \"I can't read that file.\"",
    "out": "I can't read that file."
   },
   {
    "h": "Folders",
    "text": [
     "hmk makes a folder, hcp copies a file, hmv moves or renames one, and hls lists a folder. hrm on the folder deletes it with everything inside."
    ],
    "code": "\"box\" hmk now\n\"box/a.txt\" hwr \"hi\"\n\"box/a.txt\" hcp \"box/b.txt\"\n\"box/b.txt\" hmv \"box/c.txt\"\nout prn hls&\"box\"\n\"box\" hrm now\nout prn hex&\"box\"",
    "out": "[a.txt, c.txt]\nnay"
   },
   {
    "h": "Writing piece by piece",
    "text": [
     "mfo opens a file for writing. prn writes a line to it and put writes without ending the line, so gam and ma join into gamma. Closing it by hand lets the program read it straight away."
    ],
    "code": "f mfo \"notes.txt\"\nf prn \"alpha\"\nf prn \"beta\"\nf put \"gam\"\nf prn \"ma\"\nf close now\nout prn hln&\"notes.txt\"\n\"notes.txt\" hrm now",
    "out": "[alpha, beta, gamma]"
   },
   {
    "h": "Reading piece by piece",
    "text": [
     "mfi opens a file for reading. gln takes a whole line, get takes one number at a time, and wln walks through the lines that are left."
    ],
    "code": "\"notes.txt\" hwr \"first line\\n7 8\\nlast line\\n\"\nf mfi \"notes.txt\"\ntop gln f\nout prn top\na mak num\nb mak num\na get f\nb get f\nout prn a+b\nrest gln f\nline wln f\n  out prn line\nf close now\n\"notes.txt\" hrm now",
    "out": "first line\n15\nlast line"
   }
  ],
  "lines": [
   {
    "line": "\"notes.txt\" hwr \"Remember the milk.\\n\"",
    "say": "Write this text into notes.txt, replacing what was there."
   },
   {
    "line": "name hap \"two\\n\"",
    "say": "Add this text to the end of the file called name."
   },
   {
    "line": "out prn hln&name",
    "say": "Print the file's lines as a list."
   },
   {
    "line": "out prn hex&name",
    "say": "Print whether the file exists."
   },
   {
    "line": "\"box\" hmk now",
    "say": "Make a folder called box."
   },
   {
    "line": "\"notes.txt\" hrm now",
    "say": "Delete notes.txt from the hard drive."
   },
   {
    "line": "f mfo \"notes.txt\"",
    "say": "Make f, a file opened for writing, called notes.txt."
   },
   {
    "line": "line wln f",
    "say": "While f still has lines, read the next one into line."
   }
  ],
  "practice": [
   {
    "q": "Keep a run counter in count.txt: read the number if the file exists, add 1, save it, and print it.",
    "answer": "Start at 0, and only read the file when hex says it is there. tnm turns the saved text into a number and txt turns it back before writing. The first run prints 1; each later run prints one more.",
    "answer_code": "name is \"count.txt\"\nn is 0\nhex&name ieq yes\n  text is hrd&name\n  n is tnm&text\nn add 1\nname hwr txt&n\nout prn n",
    "answer_out": "1"
   },
   {
    "q": "You call hwr twice on the same file, with \"a\" and then \"b\". What is in the file?",
    "answer": "Only b. hwr replaces the whole file each time; use hap to add to it instead."
   },
   {
    "q": "Why does the folder program delete box at the end, and what should you be careful of?",
    "answer": "It tidies up after itself. hrm on a folder removes everything inside it for good, with no recycle bin, so point it only at what you mean."
   }
  ],
  "watch_out": [
   "hwr and hap write exactly the text you give them and never add a line end on their own, so put the \\n in yourself.",
   "Deleting a folder with hrm also deletes all of its files, and they don't go to the recycle bin."
  ],
  "recap": [
   "Write, add to and read whole files with hwr, hap, hrd and hln.",
   "Check a file with hex and hsz, and delete it with hrm.",
   "Make, copy, move and list with hmk, hcp, hmv and hls.",
   "Write a file bit by bit with mfo, prn and put.",
   "Read a file bit by bit with mfi, gln, get and wln."
  ],
  "mistakes": []
 },
 {
  "num": 36,
  "title": "Project: A Shopping List That Remembers",
  "idea": "This project builds a shopping list you can add to and take from, which is still there the next time you run it. It brings together lists, a menu loop, small functions and files.",
  "sections": [
   {
    "h": "A list and a menu",
    "text": [
     "A loop that never ends on its own keeps asking what to do. Each answer gets its own if, and quit breaks out with ebk. The output shows one sample run."
    ],
    "code": "items mak vec@txt\nnow wfv now\n  what get \"add, list or quit? \"\n  what ieq \"quit\"\n    now ebk now\n  what ieq \"add\"\n    thing get \"What to add? \"\n    items add thing\n  what ieq \"list\"\n    out prn items\nout prn \"Bye!\"",
    "out": "add, list or quit? add\nWhat to add? milk\nadd, list or quit? list\n[milk]\nadd, list or quit? quit\nBye!"
   },
   {
    "h": "Taking things off",
    "text": [
     "Before removing a thing, chs checks the list has it. If not, the program says so instead of pretending."
    ],
    "code": "items is \"milk\"&\"eggs\"\nwhat get \"add, drop, list or quit? \"\nwhat ieq \"drop\"\n  thing get \"What to drop? \"\n  has is chs&items&thing\n  has ieq yes\n    items lrm thing\n    out prn \"Gone.\"\n  now oth now\n    out prn \"That's not on the list.\"\nout prn items",
    "out": "add, drop, list or quit? drop\nWhat to drop? eggs\nGone.\n[milk]"
   },
   {
    "h": "Saving",
    "text": [
     "ctx joins the list into one text with a line end between items, and hwr writes it to shopping.txt."
    ],
    "code": "items is \"milk\"&\"eggs\"\nnow save items\nout prn hrd&\"shopping.txt\"\n\"shopping.txt\" hrm now\n\nsave dfn now\n  list dpm see@vec@txt\n  \"shopping.txt\" hwr ctx&list&\"\\n\"",
    "out": "milk\neggs"
   },
   {
    "h": "Loading",
    "text": [
     "load gives back a list of texts. On the very first run there is no file, so hex is checked first and an empty list comes back."
    ],
    "code": "\"shopping.txt\" hwr \"milk\\neggs\\n\"\nitems is load&\nout prn items\n\"shopping.txt\" hrm now\nout prn load&\n\nload dfn vec@txt\n  hex&\"shopping.txt\" ieq nay\n    load ert vec@txt&\n  load ert hln&\"shopping.txt\"",
    "out": "[milk, eggs]\n[]"
   }
  ],
  "lines": [
   {
    "line": "items mak vec@txt",
    "say": "Make items, an empty list of texts."
   },
   {
    "line": "now wfv now",
    "say": "Loop for ever, until something breaks out."
   },
   {
    "line": "has is chs&items&thing",
    "say": "has is whether thing is on the list."
   },
   {
    "line": "items lrm thing",
    "say": "Take thing off the list."
   },
   {
    "line": "list dpm see@vec@txt",
    "say": "The function takes list, a look at a list of texts."
   },
   {
    "line": "load dfn vec@txt",
    "say": "Define load, which gives back a list of texts."
   },
   {
    "line": "LIST_FILE mgl \"shopping.txt\"",
    "say": "Make LIST_FILE, a name the whole program can see."
   }
  ],
  "practice": [
   {
    "q": "Add a clear choice to the menu that empties the whole list.",
    "answer": "lwp wipes every item at once. The sample run answers clear, so the list prints empty.",
    "answer_code": "items is \"pear\"&\"apple\"\nwhat get \"add, clear, list or quit? \"\nwhat ieq \"clear\"\n  items lwp now\nout prn items",
    "answer_out": "add, clear, list or quit? clear\n[]"
   },
   {
    "q": "Show the list in sorted order without changing the order that gets saved.",
    "answer": "Make a sorted copy with sorted is cso&items and pass the copy to your printing function. items keeps its own order, so the saved file is unchanged."
   },
   {
    "q": "In the finished program, when does the list get saved?",
    "answer": "Every time it changes: right after an add and right after a drop. It is loaded once, when the program starts."
   },
   {
    "q": "Why does load check hex before reading the file?",
    "answer": "On the first run the file doesn't exist yet, and reading a missing file is a problem. Checking first lets load hand back an empty list instead."
   }
  ],
  "watch_out": [
   "get reads one word only, so ice cream arrives as just ice. Use gln for the thing, and for the menu answer too, because get leaves the rest of the line waiting."
  ],
  "recap": [
   "Build a menu with a loop that runs until ebk.",
   "Check a list with chs before removing with lrm.",
   "Pass a list to a function to look at with see@.",
   "Save a list with ctx and hwr, and load it with hln.",
   "Keep the main part short and put the details in functions."
  ],
  "mistakes": []
 },
 {
  "num": 37,
  "title": "The Clock",
  "idea": "The k family reads the clock and the calendar, and rwt makes your program pause. With them you can greet people by the time of day, time how long a job takes, and slow things down enough to watch.",
  "sections": [
   {
    "h": "The date and the time",
    "text": [
     "Each of these words stands alone, with no values after it. What they print depends on the moment you run the program, so there is no fixed output here."
    ],
    "code": "out prn kda\nout prn ktm\nout prn kwk\nout prn kyr\nout prn kmo\nout prn kdy\nout prn khr\nout prn kmi\nout prn kse"
   },
   {
    "h": "Doing math with the clock",
    "text": [
     "The year and the hour are ordinary numbers. Subtracting gives an age, and comparing the hour with 12 picks a greeting."
    ],
    "code": "born is 2015\nage is kyr-born\nage sgt 0\nhour is khr\nhour ilt 12\n  out prn \"Good morning!\"\nnow oth now\n  out prn \"Good day!\""
   },
   {
    "h": "Waiting and measuring",
    "text": [
     "kms is the milliseconds since the program began. After waiting 50 milliseconds with rwt, at least 40 have passed. kel gives the same idea in seconds, as a decimal."
    ],
    "code": "start is kms\nnow rwt 50\ntook is kms-start\ntook sge 40\nout prn \"That took a moment.\"\nout prn kel>0",
    "out": "That took a moment.\nyes"
   },
   {
    "h": "Timing a loop",
    "text": [
     "Read kms before and after a million turns, and the difference is how long the loop took. The number you see will vary from run to run."
    ],
    "code": "start is kms\ntotal is 0\ni flt 1000000\n  total add 1\ntook is kms-start\nout prn \"I counted to @total in @took milliseconds.\""
   },
   {
    "h": "A countdown",
    "text": [
     "Each turn prints a number, then pauses a tenth of a second. You see 3, 2, 1, then Go!"
    ],
    "code": "n is 3\nn fgt 0\n  out prn n\n  now rwt 100\nout prn \"Go!\"",
    "out": "3\n2\n1\nGo!"
   }
  ],
  "lines": [
   {
    "line": "out prn kda",
    "say": "Print today's date."
   },
   {
    "line": "out prn ktm",
    "say": "Print the time right now."
   },
   {
    "line": "hour is khr",
    "say": "hour is the current hour, from 0 to 23."
   },
   {
    "line": "start is kms",
    "say": "start is the milliseconds since the program began."
   },
   {
    "line": "took is kms-start",
    "say": "took is how many milliseconds have passed since start."
   },
   {
    "line": "now rwt 100",
    "say": "Pause for 100 milliseconds."
   }
  ],
  "practice": [
   {
    "q": "Pick one of three greetings for the morning, the afternoon or the evening, using the hour.",
    "answer": "Read khr into hour. Below 12 is morning, otherwise below 18 is afternoon, and anything else is evening. What it prints depends on when you run it.",
    "answer_code": "hour is khr\nhour ilt 12\n  out prn \"Good morning!\"\nhour olt 18\n  out prn \"Good afternoon!\"\nnow oth now\n  out prn \"Good evening!\""
   },
   {
    "q": "How would you work out how old someone born in 2015 is this year?",
    "answer": "kyr is a plain number, so subtract: age is kyr-born, with born set to 2015."
   },
   {
    "q": "How long does now rwt 1000 wait?",
    "answer": "One second. rwt counts in milliseconds, and there are 1000 in a second."
   }
  ],
  "watch_out": [
   "Clock words give a different answer each time you run, so a program that prints them has no fixed output to compare."
  ],
  "recap": [
   "Read the date and time with kda and ktm.",
   "Read single parts like kyr, kmo, khr and kmi as plain numbers.",
   "Time a job with kms before and after.",
   "Read elapsed seconds with kel.",
   "Pause with now rwt and a number of milliseconds."
  ],
  "mistakes": []
 },
 {
  "num": 38,
  "title": "At the Same Time",
  "idea": "Your computer has several cores that can work at the same moment. Threads let parts of your program run side by side, and atomics, locks, futures and fpr keep that work safe and simple.",
  "sections": [
   {
    "h": "Starting a thread",
    "text": [
     "mtd starts count_to running beside the main part. rjn waits until it has finished, so All done comes last."
    ],
    "code": "t mtd count_to&3\nt rjn now\nout prn \"All done.\"\n\ncount_to dfn now\n  n dpm num\n  i flt n\n    out prn i",
    "out": "0\n1\n2\nAll done."
   },
   {
    "h": "Letting a thread go",
    "text": [
     "rdt detaches the thread, so nothing waits for it. The pause gives it time to print before the program ends."
    ],
    "code": "t mtd say_hi&\"there\"\nt rdt now\nnow rwt 300\nout prn \"bye\"\n\nsay_hi dfn now\n  who dpm txt\n  out prn \"hi @who\"",
    "out": "hi there\nbye"
   },
   {
    "h": "A number two threads can share",
    "text": [
     "Both threads add to the same total. Because it is an atm, no add can be lost, and the total is 2000 every time. @load reads its value."
    ],
    "code": "total mak atm@num\nt1 mtd count_up&total\nt2 mtd count_up&total\nt1 rjn now\nt2 rjn now\nout prn total@load\n\ncount_up dfn now\n  c dpm ref@atm@num\n  i flt 1000\n    c add 1",
    "out": "2000"
   },
   {
    "h": "Taking turns with a lock",
    "text": [
     "The mutex guard is like a single key. Inside m blk now only one thread at a time can add to the list, and the key returns by itself when the block ends."
    ],
    "code": "names mak vec@txt\nguard mak mtx\nt1 mtd add_name&names&guard&\"Ada\"\nt2 mtd add_name&names&guard&\"Bob\"\nt1 rjn now\nt2 rjn now\nout prn cct&names\n\nadd_name dfn now\n  list dpm ref@vec@txt\n  m dpm ref@mtx\n  who dpm txt\n  m blk now\n    list add who",
    "out": "2"
   },
   {
    "h": "An answer later",
    "text": [
     "msy runs slow_add on the side and hands back a future right away. The program prints something else first, then @get waits for the answer, 3."
    ],
    "code": "answer msy slow_add&1&2\nout prn \"I can do other things now.\"\nout prn answer@get\n\nslow_add dfn num\n  a dpm num\n  b dpm num\n  now rwt 20\n  slow_add ert a+b",
    "out": "I can do other things now.\n3"
   },
   {
    "h": "Every core at once",
    "text": [
     "fpr walks a list like fea but splits the turns across all cores. The turns share sum, so sum is an atm."
    ],
    "code": "v is 1&2&3&4\nsum mak atm@num\nn fpr v\n  sum add n\nout prn sum@load",
    "out": "10"
   },
   {
    "h": "Each turn changes its own item",
    "text": [
     "Here each turn only changes its own number, so nothing is shared and nothing needs protecting."
    ],
    "code": "v is 1&2&3&4\nn fpr v\n  n aml 10\nout prn v",
    "out": "[10, 20, 30, 40]"
   }
  ],
  "lines": [
   {
    "line": "t mtd count_to&3",
    "say": "Make t, a thread that runs count_to with 3."
   },
   {
    "line": "t rjn now",
    "say": "Wait here until t has finished."
   },
   {
    "line": "t rdt now",
    "say": "Let t carry on by itself, without waiting for it."
   },
   {
    "line": "total mak atm@num",
    "say": "Make total, a whole number threads can change safely."
   },
   {
    "line": "guard mak mtx",
    "say": "Make guard, a lock only one thread can hold at a time."
   },
   {
    "line": "m blk now",
    "say": "Hold the lock m while the indented lines run."
   },
   {
    "line": "answer msy slow_add&1&2",
    "say": "Start slow_add on the side with 1 and 2, and keep a promise of its answer."
   },
   {
    "line": "n fpr v",
    "say": "For each n in v, spread across every core."
   }
  ],
  "practice": [
   {
    "q": "Use fpr to square every number in a list of the numbers 1 to 10, then print the list.",
    "answer": "Each turn changes only its own n, so nothing is shared and no lock is needed.",
    "answer_code": "v is 1&2&3&4&5&6&7&8&9&10\nn fpr v\n  n is n*n\nout prn v",
    "answer_out": "[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]"
   },
   {
    "q": "Two threads each add 1 to a plain num a thousand times. Why might the total come out below 2000?",
    "answer": "Both can read the same value at once, and then one of the adds is lost. Making it an atm@num stops that."
   },
   {
    "q": "What must happen to every thread you start with mtd?",
    "answer": "Either rjn, to wait for it, or rdt, to let it run free. Skip both and the program stops once the thread's name goes away."
   },
   {
    "q": "When would you reach for msy instead of mtd?",
    "answer": "When you want an answer back. A thread gives nothing back, but msy gives a future, and @get hands you the answer."
   }
  ],
  "watch_out": [
   "Each thread you start needs an rjn or an rdt. Leave both out and the program halts when the thread's name goes out of reach, just as C++ would.",
   "Turns of fpr run in no set order and can overlap, so anything they share must be an atm or sit behind a mtx."
  ],
  "recap": [
   "Start a thread with mtd and wait for it with rjn, or let it go with rdt.",
   "Share one number safely with atm.",
   "Guard bigger shared things with a mtx and blk.",
   "Get an answer later with msy and @get.",
   "Spread a loop over every core with fpr."
  ],
  "mistakes": []
 },
 {
  "num": 39,
  "title": "Threads That Talk",
  "idea": "Sharing things between threads invites trouble, so it is often better for threads to hand things to each other. This chapter covers channels for passing values, conditions for waiting until something is true, and names that every thread keeps its own copy of.",
  "sections": [
   {
    "h": "A channel",
    "text": [
     "feed sends 1 to 5 down the channel and then closes it. The main part takes values with fea until the channel is closed and empty, so the total is 15. No lock is needed."
    ],
    "code": "c mak chn@num\nt mtd feed&c\ntotal is 0\nn fea c\n  total add n\nt rjn now\nout prn total\n\nfeed dfn now\n  c dpm ref@chn@num\n  i flt 5\n    c add i+1\n  c close now",
    "out": "15"
   },
   {
    "h": "Waiting until something is true",
    "text": [
     "The main part holds the lock and waits on the condition cv until check says yes. The go thread sets ready, then wakes one waiting thread with notify_one."
    ],
    "code": "ready is nay\ng mak mtx\ncv mak cnd\ngo dlm now\n  g blk now\n    ready is yes\n  cv notify_one now\nw mtd go\ncheck dlm yno\n  check ert ready\ng blk now\n  cv wait g&check\nw rjn now\nout prn ready",
    "out": "yes"
   },
   {
    "h": "Two senders, one channel",
    "text": [
     "Two threads feed the same channel. The main part waits for both with rjn and only then closes the channel and adds up what came through."
    ],
    "code": "c mak chn@num\na mtd feed&c&1\nb mtd feed&c&10\na rjn now\nb rjn now\nc close now\ntotal is 0\nn fea c\n  total add n\nout prn total\n\nfeed dfn now\n  c dpm ref@chn@num\n  k dpm num\n  i flt 3\n    c add k",
    "out": "33"
   }
  ],
  "lines": [
   {
    "line": "c mak chn@num",
    "say": "Make c, a channel that carries whole numbers."
   },
   {
    "line": "c add 5",
    "say": "Send 5 down the channel."
   },
   {
    "line": "x is c@get&",
    "say": "Wait for a value to arrive, and take it into x."
   },
   {
    "line": "t mtd feed&c",
    "say": "Make t, a thread that runs feed with the channel."
   },
   {
    "line": "n fea c",
    "say": "Take each value from c until it is closed and empty."
   },
   {
    "line": "cv mak cnd",
    "say": "Make cv, a condition a thread can sleep on."
   },
   {
    "line": "seen mtl 0",
    "say": "Make seen at the top level, with a separate copy for each thread."
   }
  ],
  "practice": [
   {
    "q": "Start two threads that each send three numbers down the same channel, and add them all up in the main part.",
    "answer": "Wait for both threads with rjn first, then close the channel, then read it. With no size limit set, a sender is never held up. 1 three times plus 10 three times is 33.",
    "answer_code": "c mak chn@num\na mtd feed&c&1\nb mtd feed&c&10\na rjn now\nb rjn now\nc close now\ntotal is 0\nn fea c\n  total add n\nout prn total\n\nfeed dfn now\n  c dpm ref@chn@num\n  k dpm num\n  i flt 3\n    c add k",
    "answer_out": "33"
   },
   {
    "q": "What happens if nobody ever closes a channel that the main part walks with fea?",
    "answer": "The walk keeps waiting for more values and never ends. Closing it tells the reader nothing else is coming."
   },
   {
    "q": "What does chn@num&2 change?",
    "answer": "The channel holds at most 2 values. When it is full, a sender waits for room, so a fast thread can't get far ahead of a slow one."
   },
   {
    "q": "A thread adds 5 to an mtl name that starts at 0. The main part then prints it. What does it see?",
    "answer": "Its own copy, which the thread didn't touch. Each thread has a separate copy of an mtl name."
   }
  ],
  "recap": [
   "Pass values between threads with a chn channel.",
   "Send with add, take with @get& or fea, and finish with close.",
   "Limit a channel's size so a fast thread waits for a slow one.",
   "Sleep on a cnd until another thread wakes you.",
   "Give every thread its own copy of a name with mtl."
  ],
  "mistakes": []
 },
 {
  "num": 40,
  "title": "Groups and Other Files",
  "idea": "As a program grows, names start to clash and files get long. Groups keep related names together under one name, and xim lets you split a program across files without writing anything twice.",
  "sections": [
   {
    "h": "Groups",
    "text": [
     "geo and cash each have their own area. Reaching in with @ says which one you mean, so they never get mixed up."
    ],
    "code": "out prn geo@area&3\nout prn cash@area&3\n\ngeo dgr now\n  area dfn num\n    side dpm num\n    area ert side*side\n\ncash dgr now\n  area dfn txt\n    code dpm num\n    area ert \"region @code\"",
    "out": "9\nregion 3"
   },
   {
    "h": "What a group can hold",
    "text": [
     "A group can hold choices, classes and functions. zoo@Bear is a class inside zoo, and zoo@Mood@calm is one of its choices."
    ],
    "code": "b mak zoo@Bear\nout prn b@name\nm is zoo@Mood@calm\nout prn m\nout prn zoo@open_at&8\n\nzoo dgr now\n  Mood den calm&wild\n  Bear dcl now\n    name dfd \"Ted\"\n  open_at dfn txt\n    hour dpm num\n    open_at ert \"Open at @hour\"",
    "out": "Ted\ncalm\nOpen at 8"
   },
   {
    "h": "A file of tools",
    "text": [
     "This file has no main part, only definitions: a function and a structure that other programs can use."
    ],
    "code": "note Things that many programs can use.\ntwice dfn num\n  n dpm num\n  twice ert n*2\n\nPet dst now\n  name dfd \"?\""
   },
   {
    "h": "Bringing it in",
    "text": [
     "xim reads tools.epp, and its definitions work as if they were written here. You never write a header or say anything twice."
    ],
    "code": "now xim \"tools.epp\"\nout prn twice&21\np mak Pet\nout prn p",
    "out": "42\nPet(name: ?)"
   }
  ],
  "lines": [
   {
    "line": "geo dgr now",
    "say": "Define a group named geo."
   },
   {
    "line": "out prn geo@area&3",
    "say": "Print what area, inside geo, gives back for 3."
   },
   {
    "line": "b mak zoo@Bear",
    "say": "Make b, a Bear from the zoo group."
   },
   {
    "line": "m is zoo@Mood@calm",
    "say": "m is the choice calm, from Mood inside zoo."
   },
   {
    "line": "now xim \"tools.epp\"",
    "say": "Bring in the definitions from tools.epp."
   }
  ],
  "practice": [
   {
    "q": "Make a group called shout with a function that hands back a text in capitals, and print what it gives for \"hello\".",
    "answer": "Define shout with dgr, put a function inside it that returns tuc&s, and call it as shout@say&\"hello\". The Book's answer prints HELLO."
   },
   {
    "q": "Two groups both have a function called area. How does a line choose which one runs?",
    "answer": "By naming the group first: geo@area&3 or cash@area&3."
   },
   {
    "q": "What happens if two files both bring in tools.epp?",
    "answer": "It only counts once, so its definitions are not made twice."
   },
   {
    "q": "Where do most people put xim lines?",
    "answer": "Near the top, after the notes that say what the program is for and before the main part. Definitions can go anywhere, so this is a habit, not a rule."
   }
  ],
  "recap": [
   "Group related names with dgr.",
   "Reach into a group with @, like geo@area&3.",
   "Keep classes and choices in a group too.",
   "Split a program into files and bring one in with xim.",
   "Write each thing once, with no header files."
  ],
  "mistakes": []
 },
 {
  "num": 41,
  "title": "The World Outside",
  "idea": "A program can reach past itself: run Windows commands, read the words it was started with and the computer's settings, and fetch web pages. The x and r families do this.",
  "sections": [
   {
    "h": "Running a command",
    "text": [
     "rcm runs a command just as if you had typed it at the Windows command prompt. Its output goes to the screen."
    ],
    "code": "now rcm \"echo Hello from Windows\"",
    "out": "Hello from Windows"
   },
   {
    "h": "Keeping what a command says",
    "text": [
     "xcm hands back what the command printed, as a text you can use. xcd hands back the number it ended with, here 3."
    ],
    "code": "said is xcm&\"echo hello\"\nout prn tuc&said\nout prn xcd&\"exit 3\"",
    "out": "HELLO\n3"
   },
   {
    "h": "Words given to your program",
    "text": [
     "xag is the list of extra words typed after the program's name. From the Studio there are none, so the count is 0."
    ],
    "code": "out prn cct&xag\nw fea xag\n  out prn w",
    "out": "0"
   },
   {
    "h": "Environment values",
    "text": [
     "xev reads a Windows setting by name. A name that isn't set gives an empty text, which prints as an empty line."
    ],
    "code": "out prn xev&\"SURELY_NOT_SET\"\nwhere is xev&\"USERPROFILE\"\nsize is tsz&where\nout prn size>0",
    "out": "\nyes"
   },
   {
    "h": "Fetching a web page",
    "text": [
     "xwb gets a page's text using curl, which comes with Windows 10 and 11. The if keeps it switched off so the program runs without the internet; set online to yes to try it."
    ],
    "code": "online is nay\nonline ieq yes\n  page is xwb&\"http://example.com\"\n  out prn tsz&page\nout prn \"Done.\"",
    "out": "Done."
   }
  ],
  "lines": [
   {
    "line": "now rcm \"echo Hello from Windows\"",
    "say": "Run this command, as if typed at the command prompt."
   },
   {
    "line": "said is xcm&\"echo hello\"",
    "say": "said is the text that the command printed."
   },
   {
    "line": "out prn xcd&\"exit 3\"",
    "say": "Print the number the command ended with."
   },
   {
    "line": "w fea xag",
    "say": "For each word the program was started with:"
   },
   {
    "line": "where is xev&\"USERPROFILE\"",
    "say": "where is the value of the USERPROFILE setting."
   },
   {
    "line": "page is xwb&\"http://example.com\"",
    "say": "page is the text of that web page."
   }
  ],
  "practice": [
   {
    "q": "Ask Windows for the time with xcm&\"echo %TIME%\" and print just the hour part, the first two characters.",
    "answer": "Keep what the command prints in t, then cut out the first two letters with tcu starting at 0. What it prints depends on the time.",
    "answer_code": "t is xcm&\"echo %TIME%\"\nout prn tcu&t&0&2"
   },
   {
    "q": "Which word would you use to find out whether a command worked?",
    "answer": "xcd. It gives the number the command ended with, and 0 means all went well."
   },
   {
    "q": "Why is it risky to build a command from text a stranger typed?",
    "answer": "A command can do anything you can do by hand, including deleting files, so a stranger's text could make it do harm."
   }
  ],
  "watch_out": [
   "Commands can do anything you could do yourself, deleting files included. Never run one built from something a stranger typed."
  ],
  "recap": [
   "Run a Windows command with rcm.",
   "Keep a command's output with xcm and its ending number with xcd.",
   "Read the words your program was started with from xag.",
   "Read computer settings with xev.",
   "Fetch a web page's text with xwb."
  ],
  "mistakes": []
 },
 {
  "num": 42,
  "title": "Bytes, Codes and Other Computers",
  "idea": "More ways to reach outside: files of raw bytes, very fine timing, dates in your own pattern, fingerprints and base 64, JSON, and connections between programs.",
  "sections": [
   {
    "h": "Files of bytes",
    "text": [
     "A byt holds 0 to 255. hby writes a list of them to a file and hrb reads them back, so the second byte is 200 again."
    ],
    "code": "bytes mak vec@byt\nbytes add byt&1\nbytes add byt&200\n\"bytes.bin\" hby bytes\nback is hrb&\"bytes.bin\"\nout prn cct&back\nout prn num&back@1\n\"bytes.bin\" hrm now",
    "out": "2\n200"
   },
   {
    "h": "Nanoseconds and date patterns",
    "text": [
     "kns counts in billionths of a second, so the later reading is never smaller. kfa fills in a pattern; %Y is a four-letter year."
    ],
    "code": "start is kns\ntotal is 0\ni flt 1000\n  total add i\nstop is kns\nout prn stop>=start\nyear is kfa&\"%Y\"\nout prn tsz&year",
    "out": "yes\n4"
   },
   {
    "h": "Fingerprints and base 64",
    "text": [
     "xha gives the SHA-256 fingerprint of abc, which always comes out the same. xbe turns hello into base 64 and xbd turns it back."
    ],
    "code": "out prn xha&\"abc\"\ncode is xbe&\"hello\"\nout prn code\nout prn xbd&code",
    "out": "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad\naGVsbG8=\nhello"
   },
   {
    "h": "JSON",
    "text": [
     "tjs reads JSON text into a jsn you can reach into by name or position. @text& and num& read values out, and a line with is changes or adds one."
    ],
    "code": "j is tjs&\"{\\\"name\\\": \\\"Ada\\\", \\\"pets\\\": [\\\"Rex\\\", \\\"Tom\\\"]}\"\nout prn j@\"name\"@text&\np is j@\"pets\"\nout prn p@size&\nout prn p@0@text&\nj@\"age\" is 36\nout prn num&j@\"age\"\nn mak jsn\nn add 1\nn add \"two\"\nout prn n",
    "out": "Ada\n2\nRex\n36\n[1,\"two\"]"
   },
   {
    "h": "A server and a socket",
    "text": [
     "One program plays both sides. The server asks for any free port, a thread connects to it at 127.0.0.1, and each end sends a line and reads the other's."
    ],
    "code": "door mak srv&0\np is door@port&\nt mtd client&p\nc is door@next&\nout prn c@line&\nc send \"hi yourself\\n\"\nc close now\nt rjn now\n\nclient dfn now\n  p dpm num\n  c mak sck&\"127.0.0.1\"&p\n  c send \"hello there\\n\"\n  out prn c@line&",
    "out": "hello there\nhi yourself"
   },
   {
    "h": "Posting to a web page",
    "text": [
     "xpo sends text and gives back the reply. Nothing is listening at this address, so the problem lands in the catch."
    ],
    "code": "now btr now\n  answer is xpo&\"http://127.0.0.1:1/form\"&\"name=Ada\"\n  out prn answer\ne bch now\n  out prn \"nobody answered\"",
    "out": "nobody answered"
   }
  ],
  "lines": [
   {
    "line": "bytes mak vec@byt",
    "say": "Make bytes, a list of bytes."
   },
   {
    "line": "\"bytes.bin\" hby bytes",
    "say": "Write the list of bytes into bytes.bin."
   },
   {
    "line": "start is kns",
    "say": "start is the clock reading in nanoseconds."
   },
   {
    "line": "year is kfa&\"%Y\"",
    "say": "year is the current year, filled into the pattern."
   },
   {
    "line": "out prn xha&\"abc\"",
    "say": "Print the SHA-256 fingerprint of abc."
   },
   {
    "line": "code is xbe&\"hello\"",
    "say": "code is hello turned into base 64."
   },
   {
    "line": "n mak jsn",
    "say": "Make n, an empty JSON value."
   },
   {
    "line": "door mak srv&0",
    "say": "Make door, a server on any free port."
   },
   {
    "line": "c is door@next&",
    "say": "Wait for someone to connect, and call that connection c."
   }
  ],
  "practice": [
   {
    "q": "Print the fingerprints of \"cat\" and \"cats\" and compare them.",
    "answer": "They look nothing alike. One extra letter gives a completely different fingerprint, which is what a hash is for.",
    "answer_code": "out prn xha&\"cat\"\nout prn xha&\"cats\"",
    "answer_out": "77af778b51abd4a3c51c5ddd97204a9c3ae614ebccb75a606c3b6865aed6744e\nd936608baaacc6b762c14b0c356026fba3b84e77d5b22e86f2fc29d3da09c675"
   },
   {
    "q": "You need to turn a text into something safe to send, and get it back later. Hash or base 64?",
    "answer": "Base 64. A hash can't be turned back into the text; xbd undoes xbe."
   },
   {
    "q": "What does 127.0.0.1 mean, and how would a server listen on the network as well?",
    "answer": "It always means this computer. Writing srv&8080&\"0.0.0.0\" makes the server listen on the network too."
   },
   {
    "q": "What happens if tjs is given JSON text with a mistake in it?",
    "answer": "It throws a problem you can catch with btr and bch, and the message says which line is wrong."
   }
  ],
  "recap": [
   "Write and read raw bytes with hby and hrb.",
   "Time tiny jobs with kns and fill in dates with kfa.",
   "Fingerprint text with xha, and encode and decode with xbe and xbd.",
   "Read and build JSON with tjs and jsn.",
   "Connect programs with srv and sck, and post to a web page with xpo."
  ],
  "mistakes": []
 },
 {
  "num": 43,
  "title": "Any C++, Any Library",
  "idea": "Under the hood every English++ program is C++, so C++ headers and libraries are within reach with the same three-word lines. This chapter shows how to call C++ functions, drop in a raw line of C++ when you need one, and switch on a library like raylib.",
  "sections": [
   {
    "h": "Call C++ by its own names",
    "text": [
     "xic pulls in a C++ header. After that, @ walks into C++ names the way :: and dots do in C++, and a word that is not a root sits in the middle spot as a function to call.",
     "Values for a call go after &, and a lone & means call it with nothing."
    ],
    "code": "now xic \"<vector>\"\nv mak std@vector@int\nv push_back 3\nv push_back 4\nout prn v@size&\nn is std@stoi&\"12\"\nout prn n+1",
    "out": "2\n13"
   },
   {
    "h": "A raw line of C++",
    "text": [
     "xgl places a C++ line outside every function, where globals live. xpp places a C++ line right where it stands in your program.",
     "You will seldom need them, but they mean nothing in C++ is ever out of reach."
    ],
    "code": "now xgl \"int fromCpp = 5;\"\nnow xpp \"fromCpp = fromCpp * 2;\"\nnow xpp \"std::cout << fromCpp << std::endl;\"",
    "out": "10"
   },
   {
    "h": "Skip the std:: part",
    "text": [
     "xus is the English++ form of using namespace. With it on, the C++ lines you write can leave off std::."
    ],
    "code": "now xic \"<vector>\"\nnow xus std\nnow xpp \"vector<int> v = {7, 8};\"\nnow xpp \"cout << v.back() << endl;\"",
    "out": "8"
   },
   {
    "h": "Switch on a library",
    "text": [
     "xlb turns on one of the Studio's libraries and tells it what to link. From then on, raylib's functions are called by their own names.",
     "This whole program is a game loop: move the ball, bounce it off the walls, draw it, sixty times a second."
    ],
    "code": "now xlb raylib\nnow InitWindow 800&450&\"Bouncing ball\"\nnow SetTargetFPS 60\nx is 400.0\ndx is 4.0\nWindowShouldClose& weq nay\n  x add dx\n  x ilt 20\n    dx is 4.0\n  x ogt 780\n    dx is -4.0\n  now BeginDrawing now\n  now ClearBackground RAYWHITE\n  now DrawCircle x&225&20&RED\n  now EndDrawing now\nnow CloseWindow now"
   },
   {
    "h": "A library's classes",
    "text": [
     "Classes from a header behave like the ones you write. mak makes one, the middle word runs a function, and @ reads a field or reaches into a namespace like shop.",
     "This needs the shop.h header from the Book sitting next to the program."
    ],
    "code": "now xic \"shop.h\"\nb mak Bag\nb fill 5\nout prn b@total&\nb@open is 9\nout prn b@open\nc mak Bag&10\nout prn c@total&\nt mak shop@Till\nt ring 4\nout prn t@money\nout prn shop@tax&50\nbags mak vec@Bag\nbags add b\nbags add c\nx fea bags\n  out prn x@total&\nnow show_it c\n\nshow_it dfn now\n  g dpm Bag\n  out prn g@total&",
    "out": "5\n9\n10\n4\n5\n5\n10\n10"
   },
   {
    "h": "Your class as a child of theirs",
    "text": [
     "dcl can name a library class as the parent. A C++ function marked const at its end is redone with dkn; any other is redone with dov."
    ],
    "code": "now xgl \"class Bag { public: virtual int weight() const { return 1; } virtual ~Bag() = default; int open = 1; };\"\ns mak Sack\nout prn s@weight&\nout prn s@open\n\nSack dcl Bag\n  weight dkn num\n    weight ert 5",
    "out": "5\n1"
   }
  ],
  "lines": [
   {
    "line": "now xic \"<vector>\"",
    "say": "Bring in the C++ vector header."
   },
   {
    "line": "now xus std",
    "say": "Let the C++ lines that follow leave off std::."
   },
   {
    "line": "now xpp \"int a = 1;\"",
    "say": "Put this exact C++ line here in the program."
   },
   {
    "line": "now xgl \"int a = 1;\"",
    "say": "Put this exact C++ line outside every function."
   },
   {
    "line": "now xlb raylib",
    "say": "Switch on the raylib library and link it."
   },
   {
    "line": "n is std@stoi&\"12\"",
    "say": "n holds what C++'s stoi gives back for the text 12."
   },
   {
    "line": "b mak Bag",
    "say": "Make b, a Bag from the library's header."
   },
   {
    "line": "Sack dcl Bag",
    "say": "Define Sack as a child of the library's Bag class."
   },
   {
    "line": "weight dkn num",
    "say": "Redo weight, a const function that gives back a whole number."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Make the bouncing ball move up and down as well as side to side.",
    "answer": "Add a y and a dy, move y by dy each frame, flip dy at the top and bottom walls, and draw the circle at x and y.",
    "answer_code": "now xlb raylib\nnow InitWindow 800&450&\"Bouncing ball\"\nnow SetTargetFPS 60\nx is 400.0\ny is 225.0\ndx is 4.0\ndy is 3.0\nWindowShouldClose& weq nay\n  x add dx\n  y add dy\n  x ilt 20\n    dx is 4.0\n  x ogt 780\n    dx is -4.0\n  y ilt 20\n    dy is 3.0\n  y ogt 430\n    dy is -3.0\n  now BeginDrawing now\n  now ClearBackground RAYWHITE\n  now DrawCircle x&y&20&RED\n  now EndDrawing now\nnow CloseWindow now"
   },
   {
    "q": "Which word puts a line of C++ outside every function, and which puts one right where it stands?",
    "answer": "xgl goes outside every function, where globals live. xpp goes right on the spot."
   },
   {
    "q": "A library function happens to share its name with a root, like put. How do you call it?",
    "answer": "Write that call as a line of C++ with xpp, so English++ doesn't read it as the root."
   },
   {
    "q": "You want to build a value and pass it to a library function. Can you do both on one line?",
    "answer": "No. Make the value first with is on its own line, then hand that name to the function on the next line."
   }
  ],
  "watch_out": [
   "English++ can't look inside a library, so mistakes there come back as C++'s own error message, on the right line.",
   "If printing a library's thing fails in C++, print its fields one by one instead.",
   "A kind nested inside a class, like sf@Event@Closed, is best made with is or with a line of C++."
  ],
  "recap": [
   "Bring in a C++ header with xic and call its functions by name.",
   "Drop in a raw C++ line with xpp, or outside every function with xgl.",
   "Leave off std:: in your C++ lines with xus.",
   "Switch on raylib or another Studio library with xlb.",
   "Make and use a library's classes, and make your own child of one."
  ]
 },
 {
  "num": 44,
  "title": "Project: Catch the Stars",
  "idea": "This project builds a real window game with raylib: gold stars drop from the top and you slide a paddle with the arrow keys to catch them. It grows one step at a time, from an empty window to a full game with a score.",
  "sections": [
   {
    "h": "The smallest game",
    "text": [
     "Every game repeats three jobs about sixty times a second: read the keys, move things, draw things.",
     "This one only opens a black window and waits for you to close it. Screen positions start at the top left, so y grows as you go down."
    ],
    "code": "now xlb raylib\nnow InitWindow 800&600&\"Catch the stars\"\nnow SetTargetFPS 60\nWindowShouldClose& weq nay\n  now BeginDrawing now\n  now ClearBackground BLACK\n  now EndDrawing now\nnow CloseWindow now"
   },
   {
    "h": "A paddle you can steer",
    "text": [
     "The player is a class with an x field and two functions. move checks the arrow keys and shifts x; draw paints a sky-blue bar near the bottom."
    ],
    "code": "now xlb raylib\nnow InitWindow 800&600&\"Catch the stars\"\nnow SetTargetFPS 60\nplayer mak Player\nWindowShouldClose& weq nay\n  player move now\n  now BeginDrawing now\n  now ClearBackground BLACK\n  player draw now\n  now EndDrawing now\nnow CloseWindow now\n\nPlayer dcl now\n  x dfd 400.0\n  move dfn now\n    left is IsKeyDown&KEY_LEFT\n    left ieq yes\n      x asb 6\n    right is IsKeyDown&KEY_RIGHT\n    right ieq yes\n      x add 6\n  draw dfn now\n    now DrawRectangle x-40&560&80&16&SKYBLUE"
   },
   {
    "h": "One falling star",
    "text": [
     "A star knows its x, its y and its speed. reset drops it somewhere random above the window, fall moves it down and sends it back when it passes the bottom, and draw paints it gold."
    ],
    "code": "now xlb raylib\nnow InitWindow 800&600&\"Catch the stars\"\nnow SetTargetFPS 60\ns mak Star\ns reset now\nWindowShouldClose& weq nay\n  s fall now\n  now BeginDrawing now\n  now ClearBackground BLACK\n  s draw now\n  now EndDrawing now\nnow CloseWindow now\n\nStar dcl now\n  x dfd 0.0\n  y dfd 0.0\n  speed dfd 2.0\n  reset dfn now\n    x is nra&10&790\n    y is nra&-300&0\n    speed is 1+nrz&1&4\n  fall dfn now\n    y add speed\n    y igt 600\n      now reset now\n  draw dfn now\n    now DrawCircle x&y&6&GOLD"
   },
   {
    "h": "A sky full of stars",
    "text": [
     "A list of Stars holds eight of them. fea walks the list once to move them all and once more to draw them all."
    ],
    "code": "now xlb raylib\nnow InitWindow 800&600&\"Catch the stars\"\nnow SetTargetFPS 60\nstars mak vec@Star\ni flt 8\n  s mak Star\n  s reset now\n  stars add s\nWindowShouldClose& weq nay\n  s fea stars\n    s fall now\n  now BeginDrawing now\n  now ClearBackground BLACK\n  s fea stars\n    s draw now\n  now EndDrawing now\nnow CloseWindow now\n\nStar dcl now\n  x dfd 0.0\n  y dfd 0.0\n  speed dfd 2.0\n  reset dfn now\n    x is nra&10&790\n    y is nra&-300&0\n    speed is 1+nrz&1&4\n  fall dfn now\n    y add speed\n    y igt 600\n      now reset now\n  draw dfn now\n    now DrawCircle x&y&6&GOLD"
   },
   {
    "h": "The whole game",
    "text": [
     "caught_by asks if a star is low enough and within 50 of the paddle. nab gives the distance without caring about the side.",
     "Each catch adds a point and sends the star back up. Read the main loop out loud and it describes the game."
    ],
    "code": "note Catch the stars\nnote A small game with classes and a window: move with the left and right arrows.\nnow xlb raylib\nnow InitWindow 800&600&\"Catch the stars\"\nnow SetTargetFPS 60\nplayer mak Player\nstars mak vec@Star\ni flt 8\n  s mak Star\n  s reset now\n  stars add s\nscore is 0\nWindowShouldClose& weq nay\n  player move now\n  s fea stars\n    s fall now\n    hit is s@caught_by&player@x\n    hit ieq yes\n      score add 1\n      s reset now\n  now BeginDrawing now\n  now ClearBackground BLACK\n  player draw now\n  s fea stars\n    s draw now\n  now DrawText \"Score: @score\"&10&10&24&WHITE\n  now EndDrawing now\nnow CloseWindow now\n\nPlayer dcl now\n  x dfd 400.0\n  move dfn now\n    left is IsKeyDown&KEY_LEFT\n    left ieq yes\n      x asb 6\n    right is IsKeyDown&KEY_RIGHT\n    right ieq yes\n      x add 6\n  draw dfn now\n    now DrawRectangle x-40&560&80&16&SKYBLUE\n\nStar dcl now\n  x dfd 0.0\n  y dfd 0.0\n  speed dfd 2.0\n  reset dfn now\n    x is nra&10&790\n    y is nra&-300&0\n    speed is 1+nrz&1&4\n  fall dfn now\n    y add speed\n    y igt 600\n      now reset now\n  caught_by dfn yno\n    px dpm dec\n    near is nab&x-px\n    caught_by ert y>550&&near<50\n  draw dfn now\n    now DrawCircle x&y&6&GOLD"
   }
  ],
  "lines": [
   {
    "line": "now xlb raylib",
    "say": "Switch on raylib for the window and drawing."
   },
   {
    "line": "WindowShouldClose& weq nay",
    "say": "Keep looping while the window is still open."
   },
   {
    "line": "left is IsKeyDown&KEY_LEFT",
    "say": "left holds whether the left arrow key is held down."
   },
   {
    "line": "x asb 6",
    "say": "Move the paddle 6 to the left."
   },
   {
    "line": "x is nra&10&790",
    "say": "Pick a random x from 10 to 790."
   },
   {
    "line": "y igt 600",
    "say": "If the star has dropped past the bottom, run the lines under this."
   },
   {
    "line": "s fea stars",
    "say": "For each star s in the list of stars."
   },
   {
    "line": "Player dcl now",
    "say": "Define the Player class."
   },
   {
    "line": "x dfd 400.0",
    "say": "Give the class an x field that starts at 400.0."
   },
   {
    "line": "caught_by ert y>550&&near<50",
    "say": "Give back yes when the star is low and close to the paddle."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Stop the paddle from sliding out of the window.",
    "answer": "As the last line of move, clamp x with nkb so it stays between 40 and 760."
   },
   {
    "q": "Make the game get harder as your score climbs.",
    "answer": "Hand the score into fall, and add a little extra speed worked out from it, such as score/10."
   },
   {
    "q": "Add red stars that cost you a point when caught. Here is the Book's game with all three changes.",
    "answer": "Give Star a bad field. Every third star is bad, it draws in red, and catching it takes a point away instead of adding one.",
    "answer_code": "now xlb raylib\nnow InitWindow 800&600&\"Catch the stars\"\nnow SetTargetFPS 60\nplayer mak Player\nstars mak vec@Star\ni flt 9\n  s mak Star\n  s@bad is i%3==0\n  s reset now\n  stars add s\nscore is 0\nWindowShouldClose& weq nay\n  player move now\n  s fea stars\n    s fall score\n    hit is s@caught_by&player@x\n    hit ieq yes\n      s@bad ieq yes\n        score asb 1\n      now oth now\n        score add 1\n      s reset now\n  now BeginDrawing now\n  now ClearBackground BLACK\n  player draw now\n  s fea stars\n    s draw now\n  now DrawText \"Score: @score\"&10&10&24&WHITE\n  now EndDrawing now\nnow CloseWindow now\n\nPlayer dcl now\n  x dfd 400.0\n  move dfn now\n    left is IsKeyDown&KEY_LEFT\n    left ieq yes\n      x asb 6\n    right is IsKeyDown&KEY_RIGHT\n    right ieq yes\n      x add 6\n    x is nkb&x&40&760\n  draw dfn now\n    now DrawRectangle x-40&560&80&16&SKYBLUE\n\nStar dcl now\n  x dfd 0.0\n  y dfd 0.0\n  speed dfd 2.0\n  bad dfd nay\n  reset dfn now\n    x is nra&10&790\n    y is nra&-300&0\n    speed is 1+nrz&1&4\n  fall dfn now\n    score dpm num\n    extra is score/10\n    y add speed+extra\n    y igt 600\n      now reset now\n  caught_by dfn yno\n    px dpm dec\n    near is nab&x-px\n    caught_by ert y>550&&near<50\n  draw dfn now\n    bad ieq yes\n      now DrawCircle x&y&6&RED\n    now oth now\n      now DrawCircle x&y&6&GOLD"
   },
   {
    "q": "What three jobs does every pass of a game loop do?",
    "answer": "Read the keys, move everything, then draw everything."
   }
  ],
  "watch_out": [
   "To start a game from nothing in the Studio, make a new project and choose raylib App rather than Console App."
  ],
  "recap": [
   "Open a raylib window and run a sixty-frames-a-second loop.",
   "Steer a class-based paddle with the arrow keys.",
   "Drop random stars and recycle them when they fall off the screen.",
   "Keep many objects in a list and move and draw them with fea.",
   "Detect catches with a yes-or-no function and keep a score on screen."
  ]
 },
 {
  "num": 45,
  "title": "The Studio's Tools",
  "idea": "A guided tour of English++ Studio: where each panel lives, the keys that save you time, and the helpers that find, build and debug your programs. Pick up one new tool per session rather than all at once.",
  "sections": [
   {
    "h": "Where things are",
    "text": [
     "Your code sits in the middle. Output, Problems and the C++ View sit along the bottom; Project, Outline, Libraries, Reference and Music sit on the left; Debug is on the right.",
     "Ctrl+B hides the left side and Ctrl+J the bottom. If the layout gets messy, View > Reset Layout puts it back."
    ]
   },
   {
    "h": "Typing and moving around",
    "text": [
     "Tab takes a suggestion, Ctrl+/ turns a line into a note and back, and Shift+Alt+F tidies the file.",
     "F12 jumps to where a name is made, F2 renames it everywhere, and Ctrl+P opens a file from a few letters of its name. Ctrl+Shift+P searches every command if you forget a key."
    ]
   },
   {
    "h": "Long programs",
    "text": [
     "Guides run down each block, the lines that open your current blocks stay pinned at the top, a minimap sits on the right, and arrows let you fold a block away.",
     "Folding only hides lines. The program runs the same."
    ]
   },
   {
    "h": "Running and stopping",
    "text": [
     "F5 runs, Ctrl+F5 runs with Reader so there is no build, and Shift+F5 stops. Ctrl+Shift+B makes an .exe, and the Build menu holds Run Tests and the Turbo switch.",
     "F9 puts a red dot on a line, F6 runs to the first dot, and F10 steps one line. When a program asks a question, type the answer in the box under Output."
    ]
   },
   {
    "h": "When something is wrong",
    "text": [
     "Mistakes get a red underline as you type. Hover it for what is wrong and how to fix it, or open the Problems panel and double-click one to jump there.",
     "The status bar counts problems and, after a run, shows how long it took."
    ]
   },
   {
    "h": "Code it can write for you",
    "text": [
     "Ctrl+Alt+G opens a set of ready-made small programs you can tweak, run or insert. Ctrl+Shift+G opens the Chat, which takes plain-word requests.",
     "The Chat checks every line it suggests, works without internet, and adds nothing until you click it in. It follows rules, so if it misunderstands, ask more simply."
    ]
   },
   {
    "h": "Keeping your work safe and your own",
    "text": [
     "A spare copy of unsaved work is kept every 15 seconds, and a save writes the new file in full before replacing the old one.",
     "View > Theme changes colors, Ctrl+= and Ctrl+- change text size, and F1 opens the Book."
    ]
   }
  ],
  "lines": [
   {
    "line": "out prn \"Hello!\"",
    "say": "Print Hello! — press F5 to run it."
   },
   {
    "line": "name get \"Name? \"",
    "say": "Ask a question; you answer in the box under the Output panel."
   },
   {
    "line": "now bts \"adding\"",
    "say": "A test block named adding, which Build > Run Tests runs."
   },
   {
    "line": "now xlb raylib",
    "say": "Use a library listed in the Libraries panel."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "You want to run a program at once, with no build step. Which key?",
    "answer": "Ctrl+F5, which runs it with Reader."
   },
   {
    "q": "Your project has many files and you remember only part of one name. How do you open it fast?",
    "answer": "Press Ctrl+P, type a few of its letters in order, and press Enter."
   },
   {
    "q": "You want the program to pause on line 12 so you can see what each name holds. What do you press?",
    "answer": "Put the cursor on line 12 and press F9 for a red dot, then F6 to run up to it. F10 then steps one line at a time."
   },
   {
    "q": "You forgot the key for some command. What is the one key to remember?",
    "answer": "Ctrl+Shift+P opens the Command Palette, which lists every command along with its key."
   }
  ],
  "watch_out": [
   "The Chat is a rule-follower, not a person. When the Book has no answer, it says so rather than guessing."
  ],
  "recap": [
   "Find every panel and hide or reset them.",
   "Use shortcuts to type, tidy, jump and rename.",
   "Fold and navigate long programs.",
   "Run, stop, build, test and step through a program.",
   "Read mistakes from the underline, the Problems panel and the status bar."
  ]
 },
 {
  "num": 46,
  "title": "When the Studio Says Something",
  "idea": "The Studio flags mistakes in plain words and points at the exact line. This chapter walks through the messages you will meet most, grouped by kind, so you can read one and know the fix straight away.",
  "sections": [
   {
    "h": "Read the message first",
    "text": [
     "Each message names the line and says what to do. The commonest one is about the shape: a line must be exactly three words.",
     "Marks from C++ habits, like commas, brackets and dots, get a message that tells you the English++ way."
    ]
   },
   {
    "h": "Red lines and yellow lines",
    "text": [
     "Red means a mistake: the program will not run until you fix it. Yellow is a note: it runs, but the line may not mean what it looks like."
    ]
   },
   {
    "h": "A position plus one",
    "text": [
     "v@j+1 reads as the value at v@j with 1 added, not the next spot in the list. Nothing beats itself plus one, so this never prints bigger."
    ],
    "code": "v is 3&1&2\nj is 0\nv@j igt v@j+1\n  out prn \"bigger\"\nout prn \"done\"",
    "out": "done"
   },
   {
    "h": "Make a step first",
    "text": [
     "To compare with the next spot, work out the position on its own line, then use that name after @."
    ],
    "code": "v is 3&1&2\nj is 0\nq is j+1\nv@j igt v@q\n  out prn \"bigger\"\nout prn \"done\"",
    "out": "bigger\ndone"
   },
   {
    "h": "A counting loop that never runs",
    "text": [
     "When the name already exists, flt carries on from its value. After the while loop, i already holds 3, so there is nothing for the flt loop to count. Set i back to 0 above it to start over."
    ],
    "code": "i is 0\ni wlt 3\n  i add 1\ni flt 3\n  out prn i\nout prn \"done\"",
    "out": "done"
   },
   {
    "h": "Stops while running",
    "text": [
     "Some trouble only shows up as the program runs: a position past the end, dividing by zero, a pointer holding nil. The program stops and shows the line.",
     "When you can't tell what's happening, add out prn lines to see what a box holds."
    ]
   }
  ],
  "lines": [
   {
    "line": "x is a+b",
    "say": "Math stays one word, with no spaces inside it."
   },
   {
    "line": "x is 1&2",
    "say": "& joins values into one word."
   },
   {
    "line": "x is 6.0",
    "say": "Start x as a decimal so it can hold halves later."
   },
   {
    "line": "q is j+1",
    "say": "Work out the next position as its own step."
   },
   {
    "line": "copy is v",
    "say": "Make a copy of the list to walk through safely."
   },
   {
    "line": "f ert a",
    "say": "f gives back a; ert always starts with the function's own name."
   },
   {
    "line": "e bch now",
    "say": "Catch what the try block above threw."
   },
   {
    "line": "i is 0",
    "say": "Reset i so the next counting loop starts from zero."
   }
  ],
  "mistakes": [
   {
    "code": "x is 1 2",
    "says": "Line 1: This line has 4 words. Every line has exactly 3: who, the root, and what. Text with spaces goes in quotes, and & joins values into one word: add&1&2.",
    "fix": "Join the two values into one word with &, or put them in quotes if you meant text.",
    "fix_code": "x is 1&2"
   },
   {
    "code": "out prn",
    "says": "Line 1: This line has 2 words. Every line has exactly 3: who, the root, and what. If there is nothing to say in a spot, fill it with now, like now ebk now.",
    "fix": "Fill the empty third spot: say what to print, or use now if nothing belongs there.",
    "fix_code": "out prn \"hi\"",
    "fix_out": "hi"
   },
   {
    "code": "x is a + b",
    "says": "Line 1: This line has 5 words. Every line has exactly 3: who, the root, and what. Write math with no spaces: x is a+b.",
    "fix": "Take the spaces out of the math so it stays one word.",
    "fix_code": "a is 1\nb is 2\nx is a+b\nout prn x",
    "fix_out": "3"
   },
   {
    "code": "x is 1,2",
    "says": "Line 1: English++ has no commas. Use & between values: add&1&2.",
    "fix": "Swap the comma for &.",
    "fix_code": "x is 1&2"
   },
   {
    "code": "x is v[0]",
    "says": "Line 1: English++ has no square brackets. Use @ for a position: scores@0.",
    "fix": "Use @ with the position in place of square brackets.",
    "fix_code": "v is 4&5\nx is v@0\nout prn x",
    "fix_out": "4"
   },
   {
    "code": "x is rex.age",
    "says": "Line 1: English++ has no dots, except inside a number like 2.5. Use @ to reach inside something: rex@speed. A file name goes in quotes.",
    "fix": "Reach the field with @, as in rex@age, not with a dot."
   },
   {
    "code": "x igt {",
    "says": "Line 1: English++ has no curly brackets. The lines under a block, indented, are its body.",
    "fix": "Delete the curly bracket and indent the body lines under the if.",
    "fix_code": "x is 1\nx igt 0\n  out prn x",
    "fix_out": "1"
   },
   {
    "code": "x is y",
    "says": "Line 1: I don't know y yet. Make it first, like y is 0.",
    "fix": "Make y on an earlier line before you read it.",
    "fix_code": "y is 0\nx is y\nout prn x",
    "fix_out": "0"
   },
   {
    "code": "count is 1\nout prn coutn",
    "says": "Line 2: I don't know coutn yet. Make it first, like coutn is 0. Did you mean count?",
    "fix": "Fix the spelling so it matches the name you made: count.",
    "fix_code": "count is 1\nout prn count",
    "fix_out": "1"
   },
   {
    "code": "x is 1\nx prt 1",
    "says": "Line 2: I don't know prt. The middle word is a root, like igt or prn, or the name of a function. Did you mean ert? Words starting with p are about put: it writes something out.",
    "fix": "Pick a real root for the middle spot; to print x, write out prn x.",
    "fix_code": "x is 1\nout prn x",
    "fix_out": "1"
   },
   {
    "code": "x mak nmu",
    "says": "Line 1: I don't know the kind nmu. Did you mean num? Kinds look like num, dec, txt, ltr, yno, vec@num, map@txt@num, or a class's name.",
    "fix": "Correct the kind's spelling to num.",
    "fix_code": "x mak num\nout prn x",
    "fix_out": "0"
   },
   {
    "code": "now is 1",
    "says": "Line 1: now is a word the language keeps for itself. Pick another name.",
    "fix": "now is kept by the language, so give your box a different name.",
    "fix_code": "n is 1\nout prn n",
    "fix_out": "1"
   },
   {
    "code": "class is 1",
    "says": "Line 1: class is a word C++ keeps for itself, and English++ is C++ underneath. Pick another name.",
    "fix": "class is a C++ keyword, so choose another name such as group.",
    "fix_code": "group is 1\nout prn group",
    "fix_out": "1"
   },
   {
    "code": "x is 1\nx igt 0\nout prn x",
    "says": "Line 2: Nothing is inside this igt. Indent the lines that belong to it.",
    "fix": "Indent the line that should run when the test passes.",
    "fix_code": "x is 1\nx igt 0\n  out prn x",
    "fix_out": "1"
   },
   {
    "code": "x is 1\n  y is 2",
    "says": "Line 2: This line is indented, but no block is open. Only the lines under an if, a loop, a function or a class are indented.",
    "fix": "Bring the line back to the left edge, or open a block above it.",
    "fix_code": "x is 1\ny is 2\nout prn y",
    "fix_out": "2"
   },
   {
    "code": "x is 1\nx igt 0\n    y is 2\n  z is 3",
    "says": "Line 4: This line doesn't line up with the lines above it. Use the same spaces as the other lines of the block.",
    "fix": "Give every line of a block the same indent, two spaces here.",
    "fix_code": "x is 1\nx igt 0\n  y is 2\n  z is 3\n  out prn z",
    "fix_out": "3"
   },
   {
    "code": "D dcl now\n  out prn 1",
    "says": "Line 2: A class holds fields and functions. Put this line inside a function: prn can't be here.",
    "fix": "Wrap the running line in a function inside the class."
   },
   {
    "code": "x is 1\nx is \"a\"",
    "says": "Line 2: x is a whole number, so it can't take a text. To read a number out of text use tnm&s.",
    "fix": "Keep x a number, or make a new box for the text.",
    "fix_code": "x is 1\ny is \"a\"\nout prn y",
    "fix_out": "a"
   },
   {
    "code": "x is 6\nx add 0.5",
    "says": "Line 2: x is a whole number, so 0.5 would lose what is after its point. Make x a decimal from the start.",
    "fix": "Start x as a decimal, x is 6.0, so it can hold 6.5.",
    "fix_code": "x is 6.0\nx add 0.5\nout prn x",
    "fix_out": "6.5"
   },
   {
    "code": "x is \"a\"+1",
    "says": "Line 1: I can't add text and a whole number. Turn the number into text first: \"a\"+txt&x.",
    "fix": "Turn the number into text with txt& before joining."
   },
   {
    "code": "x is 1\nx ieq \"a\"\n  out prn x",
    "says": "Line 2: I can't compare a whole number with a text. To turn a number into text use txt&x, and to read a number out of text use tnm&s.",
    "fix": "Compare like with like: turn one side into the other's kind first."
   },
   {
    "code": "f dfn num\n  a dpm num\n  f ert a\nout prn f&1&2",
    "says": "Line 4: f takes 1 value, but it was given 2.",
    "fix": "Pass f exactly one value, because it has one dpm.",
    "fix_code": "f dfn num\n  a dpm num\n  f ert a\nout prn f&1",
    "fix_out": "1"
   },
   {
    "code": "f dfn num\n  a dpm num\n  f ert a\nout prn f&\"x\"",
    "says": "Line 4: f wants a whole number for a, but \"x\" is a text.",
    "fix": "Hand f a whole number, since a is a num.",
    "fix_code": "f dfn num\n  a dpm num\n  f ert a\nout prn f&5",
    "fix_out": "5"
   },
   {
    "code": "f dfn num\n  out prn 1",
    "says": "Line 1: f promises to give back a whole number, but it never does. Add a line: f ert ...",
    "fix": "Add an ert line so f gives back the number it promised."
   },
   {
    "code": "f dfn num\n  f ert \"a\"",
    "says": "Line 2: f promises to give back a whole number, but \"a\" is a text.",
    "fix": "Give back a number to match num, or change the promised kind to txt."
   },
   {
    "code": "f dfn now\n  f ert 1",
    "says": "Line 2: f gives back nothing. To give something back, say what kind on its first line.",
    "fix": "Change now on the dfn line to the kind you want back, like num."
   },
   {
    "code": "f dfn num\n  g ert 1",
    "says": "Line 2: ert starts with the name of the function it leaves. This one is f: f ert ...",
    "fix": "Start the ert line with f, the function it is leaving."
   },
   {
    "code": "x is 1\nf dfn num\n  f ert x",
    "says": "Line 3: x belongs to the main program, so f can't see it. Hand it in with dpm, or make it with mgl.",
    "fix": "Pass x in through a dpm, or make it with mgl so f can see it."
   },
   {
    "code": "f dfn now\n  g dfn now\n    out prn 1",
    "says": "Line 2: A function can't be made inside another function. Make it at the top level, or use dlm for a function kept in a name.",
    "fix": "Move g out to the top level, or keep it in a name with dlm."
   },
   {
    "code": "D dcl now\n  age dfd 1\nd mak D\nout prn d@agee",
    "says": "Line 4: D has no agee. Did you mean age? It has: age.",
    "fix": "Spell the field the way the class made it: age."
   },
   {
    "code": "D dcl now\n  p dsc 1\nd mak D\nout prn d@p",
    "says": "Line 4: p is a secret in D, so it can only be used inside it.",
    "fix": "p is secret; add a function inside D that does the job you need."
   },
   {
    "code": "now oth now\n  out prn 1",
    "says": "Line 1: oth means otherwise, so it needs an if right above it, at the same indent.",
    "fix": "Put an if right above oth, at the same indent.",
    "fix_code": "x is 1\nx igt 5\n  out prn \"big\"\nnow oth now\n  out prn \"small\"",
    "fix_out": "small"
   },
   {
    "code": "now btr now\n  out prn 1\nout prn 2",
    "says": "Line 1: A try block needs a catch right after it: e bch now.",
    "fix": "Add a catch line, e bch now, straight after the try block."
   },
   {
    "code": "now ebk now",
    "says": "Line 1: ebk leaves a loop, but no loop is around this line.",
    "fix": "Only use ebk inside a loop."
   },
   {
    "code": "f dfn ref@num\n  x is 1\n  f ert x",
    "says": "Line 3: x dies when f ends, so a reference to it would point at nothing. Give back a copy instead.",
    "fix": "Promise a plain num and give back a copy, not a reference."
   },
   {
    "code": "v is 1&2\nn fea v\n  v add n",
    "says": "Line 3: You can't change v while fea is walking through it: C++ would read memory that is gone. Walk through a copy: copy is v.",
    "fix": "Walk through a copy of the list and add to the original.",
    "fix_code": "v is 1&2\ncopy is v\nn fea copy\n  v add n\nout prn cct&v",
    "fix_out": "4"
   },
   {
    "code": "a is 1\nb is a<2<3",
    "says": "Line 2: Compare one pair at a time. a<b<c doesn't do what it looks like: write a<b&&b<c.",
    "fix": "Compare one pair at a time and join them with &&."
   }
  ],
  "practice": [
   {
    "q": "The second loop here never prints. Change one thing so it prints 0, 1 and 2.",
    "answer": "Put i is 0 just above the flt line, so counting starts again from zero.",
    "answer_code": "i is 0\ni wlt 3\n  i add 1\ni is 0\ni flt 3\n  out prn i\nout prn \"done\"",
    "answer_out": "0\n1\n2\ndone"
   },
   {
    "q": "x is a + b gets a message. What is wrong, and what is the fix?",
    "answer": "The spaces split the math into five words. Write it as one word: x is a+b."
   },
   {
    "q": "A box made with x is 6 cannot take 0.5. How should it start?",
    "answer": "Start it as a decimal, so the half is kept.",
    "answer_code": "x is 6.0\nx add 0.5\nout prn x",
    "answer_out": "6.5"
   },
   {
    "q": "Is a yellow line something you must fix before running?",
    "answer": "No. It runs, but read the note, because the line probably does not do what it looks like."
   }
  ],
  "watch_out": [
   "Adding 1 to a value you found, like best is v@j+1, is fine; the note only shows when a line can't mean what it looks like.",
   "Changing a list while fea walks through it is stopped by the Studio, because in C++ it can crash."
  ],
  "recap": [
   "Read a Studio message and go straight to the line it names.",
   "Fix line-shape problems: too many words, too few, spaces in math.",
   "Swap C++ marks for @ and & and indentation.",
   "Fix name, kind and function messages.",
   "Tell a red mistake from a yellow note, and debug runtime stops with out prn."
  ]
 },
 {
  "num": 47,
  "title": "Turbo: How Your Programs Get Fast",
  "idea": "Turbo is the part of the Studio that speeds a program up without changing what it does. It is on from the start. This chapter shows what it does, why three-word lines make that possible, and which habits help it.",
  "sections": [
   {
    "h": "The same job, sooner",
    "text": [
     "fib calls itself twice per step, so a plain build repeats the same work again and again. Turbo notices fib depends only on its own values and remembers each answer.",
     "On the Book's test computer this took 0.007 seconds with Turbo on and 1.3 seconds with it off. That is one machine and a best case, not a promise for every program."
    ],
    "code": "out prn fib&42\n\nfib dfn num\n  n dpm num\n  n ilt 2\n    fib ert n\n  a is fib&n-1\n  b is fib&n-2\n  fib ert a+b",
    "out": "267914296"
   },
   {
    "h": "Shared across cores",
    "text": [
     "Each start in this hunt is its own small job, so Turbo slices the loop across the chip's cores. Each core keeps its own best, and the best of those wins; on a tie, the earlier start wins, just as on one core.",
     "The Book reports this hunt, timed with 3 million starts on its test computer, going from about C++ speed to more than 5 times as fast. Your machine will differ."
    ],
    "code": "best is 0\nat is 0\ni is 1\ni wlt 30000\n  n mak big\n  n is i\n  steps is 0\n  n wne 1\n    half is n%2\n    half ieq 0\n      n adv 2\n    now oth now\n      n aml 3\n      n add 1\n    steps add 1\n  steps igt best\n    best is steps\n    at is i\n  i add 1\nout prn \"Start at @at for @best steps.\"",
    "out": "Start at 26623 for 307 steps."
   },
   {
    "h": "Two compilers and some algebra",
    "text": [
     "Inside Turbo sits the Revolutionizer. A first compiler turns your program into whole numbers, math rewrites those numbers, a second compiler turns them into C++, and Visual C++ builds it.",
     "A rewritten line is only kept if it turns back into exactly the same text; otherwise the line stays as written."
    ]
   },
   {
    "h": "Count up to the size",
    "text": [
     "When a loop runs i from 0 up to the list's count, Turbo can prove v@i is always there and drop the check."
    ],
    "code": "v is 10&20&30\ntotal is 0\ni flt cct&v\n  total add v@i\nout prn total",
    "out": "60"
   },
   {
    "h": "Test a position before using it",
    "text": [
     "A position from elsewhere could be anything, so its check stays. Test it against 0 and the count first, and Turbo can prove the check is not needed."
    ],
    "code": "v is 10&20&30\nn is 1\nn ige 0\n  n ilt cct&v\n    out prn v@n",
    "out": "20"
   },
   {
    "h": "How far to trust it",
    "text": [
     "Turbo only removes a check it can prove never fails. The Book lists its own testing as of November 2026: 458 programs compared with Turbo on and off, and a separate checker that re-proved 83,155 of 83,799 removed checks, found none wrong, and could not follow the other 644.",
     "Bugs have been found and fixed, and more may exist. If something looks off, rerun with Turbo switched off and compare."
    ]
   }
  ],
  "lines": [
   {
    "line": "i flt cct&v",
    "say": "Count i up to the size of v, so every v@i is provably there."
   },
   {
    "line": "total add v@i",
    "say": "Add the item at position i to the total."
   },
   {
    "line": "n ilt cct&v",
    "say": "Check that n is inside the list before reading v@n."
   },
   {
    "line": "n dpm num",
    "say": "fib takes n, a whole number, and nothing else."
   },
   {
    "line": "fib ert a+b",
    "say": "fib gives back the sum of its two smaller answers."
   },
   {
    "line": "steps igt best",
    "say": "If this start took more steps than the best so far."
   },
   {
    "line": "x fea v",
    "say": "Walk through v with no position to check."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Swap 42 for 30 in the fib program and run it with Turbo switched off. Does it still crawl? Why?",
    "answer": "No, 30 finishes fast without Turbo too. Every step up multiplies the calls by about 1.6, so 42 needs a few hundred times the work of 30."
   },
   {
    "q": "A program gives a strange answer. How can you check whether Turbo is to blame?",
    "answer": "Switch Turbo off from the Build menu and rerun. A different answer suggests a Turbo bug worth reporting."
   },
   {
    "q": "Which loop gives Turbo no position check to worry about at all?",
    "answer": "A fea loop, because it never reads by position."
   },
   {
    "q": "Does Turbo speed up a raylib program?",
    "answer": "No. A program using a library is built the plain way."
   }
  ],
  "watch_out": [
   "With Turbo, a hsh or bag is walked in the order things were added; without it, C++ picks. Never rely on that order.",
   "Printing and file writes can lag by a few thousandths of a second, so lines can be lost if you stop with Shift+F5.",
   "Programs with xpp lines keep the proofs but lose the fast printing, maps and files; functions using dlm, msv or eyd are left alone; Classic programs get no Turbo."
  ],
  "recap": [
   "Know Turbo is on by default and keeps your program's result the same.",
   "See why a function like fib gets much faster when answers are remembered.",
   "Understand how a hunt is shared out across cores safely.",
   "Write loops that let Turbo prove position checks away.",
   "Treat speed figures as the Book's measurements on one test machine."
  ]
 },
 {
  "num": 48,
  "title": "English++ Against C++",
  "idea": "This chapter puts English++ next to C++ and reports what the Book measured, losses included. Every figure here is the Book's own measurement from Opus's benchmark files, taken on one machine; treat them as that, not as a rule for every computer.",
  "sections": [
   {
    "h": "Writing the same small jobs",
    "text": [
     "The Book wrote 13 small jobs both ways, with the same output. Across all 13 it counts 123 lines against 221, 1402 letters against 3886, and 0 control marks against 651.",
     "In its measurement the 13 also built in 6.69 seconds against 14.75, which it puts down to the Studio reading the C++ library once and keeping it."
    ]
   },
   {
    "h": "Running bigger jobs",
    "text": [
     "For speed the Book timed 25 larger jobs, each written the natural way. They were run with Turbo switched on, using a single laptop chip, and dated November 11, 2026. English++ was faster on 19, about level on 4, and slower on 2.",
     "The middle job ran 1.91 times as fast, and the average without fib was 2.52 times. The Book says plainly that your computer will give other numbers."
    ]
   },
   {
    "h": "How to read those numbers",
    "text": [
     "fib is a special case, because Turbo changes how the job is done. A C++ expert can always catch up by hand, since English++ becomes C++.",
     "Some C++ rows use slow default habits on Windows, some English++ rows use every core, and any row can shift by about a fifth from memory layout alone."
    ]
   },
   {
    "h": "What C++ leaves to you",
    "text": [
     "In C++ a forgotten value reads junk and reading past a list's end reads other memory. In English++ everything starts at zero or empty, and a bad position stops with the line shown.",
     "Printing a list, leaving two loops, and writing tests each take one line instead of extra code."
    ]
   },
   {
    "h": "What the safety checks cost",
    "text": [
     "Every v@i is checked first, which costs time. Turbo drops a check only when it can prove it never fails; the Book measured about 1% for the checks left in its dijkstra job.",
     "With Turbo off and a loop doing almost nothing else, the Book's measured cost runs from none for fea up to roughly double for some by-position loops. The checks can't be switched off."
    ]
   },
   {
    "h": "Where C++ still wins",
    "text": [
     "A bracketed formula is one line in C++ and a few here. Tight loops that keep their checks can run a bit slower, and library programs get no Turbo.",
     "C++ runs on more machines with more compilers, has decades of tools and far more users, and lets you control memory and safety yourself. You can always drop to C++ when needed."
    ]
   }
  ],
  "lines": [
   {
    "line": "a ebk now",
    "say": "Leave the loop named a, even from inside an inner loop."
   },
   {
    "line": "out prn v",
    "say": "Print a whole list in one line."
   },
   {
    "line": "now bts \"name\"",
    "say": "Start a test block named name, with no test library needed."
   },
   {
    "line": "x fea v",
    "say": "Walk a list with no position check to pay for."
   },
   {
    "line": "now xpp \"int a = 1;\"",
    "say": "Drop down to a line of C++ when you need it."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Someone says the table shows English++ is about twice as fast as C++. What would you tell them?",
    "answer": "That is too broad. The Book's figures come from 25 natural-style jobs on one laptop chip on one day; it won 19, tied 4 and lost 2, and an expert can always match it in C++."
   },
   {
    "q": "Why is fib treated as a special case in the speed table?",
    "answer": "Turbo remembers fib's answers, which changes how the work is done. Hand-written C++ could do the same."
   },
   {
    "q": "Which loop style has no extra safety-check cost in the Book's measurements?",
    "answer": "Walking a list with fea, since it never reads by position."
   },
   {
    "q": "Name two things C++ still does better.",
    "answer": "Any two of: one-line bracketed formulas, more computers and compilers, decades of tools and libraries, far more people who know it, and full control over memory and safety."
   }
  ],
  "watch_out": [
   "All timings are the Book's measurements on one test machine. Other computers, especially ones with fewer cores, will give different numbers."
  ],
  "recap": [
   "Compare lines, letters and control marks for the same job in both languages.",
   "Quote the Book's speed results with their conditions: 25 jobs, one machine, Turbo on, natural style.",
   "Explain why fib, core count and memory layout skew single numbers.",
   "Name what the safety checks cost and how to keep that cost low.",
   "Say honestly where C++ is still ahead."
  ]
 },
 {
  "num": 51,
  "title": "The Cheat Sheet",
  "idea": "A one-page list of the words you will reach for most. A handful of them carry most programs, so learn those first and look the rest up.",
  "sections": [
   {
    "h": "Start with twelve",
    "text": [
     "Twelve lines cover about three in four lines of the Studio's example programs: print, is, add, mak, ieq, flt, fea, dfn, dpm, ert, dcl and dfd."
    ]
   },
   {
    "h": "The rest, by job",
    "text": [
     "The sheet groups the other common words by what you are doing: making and changing, printing and asking, choosing, repeating, lists, and functions with classes."
    ]
   },
   {
    "h": "The marks",
    "text": [
     "@ reaches in, & hands over values, math has no spaces, now fills an empty spot, and \"@x\" puts a value inside text."
    ]
   },
   {
    "h": "Look a word up",
    "text": [
     "The site's Root Finder holds every word with its C++, so use it whenever the sheet does not have what you need."
    ]
   }
  ],
  "lines": [
   {
    "line": "out prn x",
    "say": "Print x and move to a new line."
   },
   {
    "line": "x is 6",
    "say": "x is 6."
   },
   {
    "line": "x add 1",
    "say": "Add 1 to x."
   },
   {
    "line": "x mak num",
    "say": "Make x, an empty whole number."
   },
   {
    "line": "x ieq 3",
    "say": "If x equals 3, run the lines under it."
   },
   {
    "line": "i flt 10",
    "say": "Count with i from 0 while it is below 10."
   },
   {
    "line": "x fea v",
    "say": "For each x in v."
   },
   {
    "line": "f dfn num",
    "say": "Define f, which gives back a whole number."
   },
   {
    "line": "a dpm num",
    "say": "f takes a, a whole number."
   },
   {
    "line": "f ert a+1",
    "say": "f gives back a+1."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Print the numbers 0, 1 and 2, one per line.",
    "answer": "Count with flt up to 3 and print i inside.",
    "answer_code": "i flt 3\n  out prn i",
    "answer_out": "0\n1\n2"
   },
   {
    "q": "Make a list of 1, 2 and 3, add 4 to it, and print how many it holds.",
    "answer": "add on a list puts a value at the end, and cct& counts it.",
    "answer_code": "v is 1&2&3\nv add 4\nout prn cct&v",
    "answer_out": "4"
   },
   {
    "q": "Write a function f that takes a number and gives back one more.",
    "answer": "Use dfn, dpm and ert, then call it with f&1.",
    "answer_code": "out prn f&1\n\nf dfn num\n  a dpm num\n  f ert a+1",
    "answer_out": "2"
   }
  ],
  "recap": [
   "Know the twelve lines that carry most programs.",
   "Find the right group for a job.",
   "Use @, &, math marks, now and \"@x\" correctly.",
   "Turn to the Root Finder for anything else."
  ]
 },
 {
  "num": 52,
  "title": "The Whole Chart",
  "idea": "Every word in English++ in one place. The chart is frozen, so a word never changes meaning, and its three-letter shape means you can often guess a word before you look it up.",
  "sections": [
   {
    "h": "Read a word by its letters",
    "text": [
     "The first letter names the family and the next two name the job. i is if and gt is greater than, so igt is if greater than.",
     "The same pair means the same thing across families: wgt is while greater than, and lrm and hrm both remove."
    ]
   },
   {
    "h": "The families",
    "text": [
     "a changes a value, b opens a block, d defines, e leaves, f repeats, g reads in, h handles files, i tests, l changes a collection, m makes, o is otherwise, p writes out, r runs threads and programs, s checks and stops, u ends a do block, w repeats while, and x reaches C++.",
     "c, h, i, k, n, t and x also have value words used inside a word, like cct&v."
    ]
   },
   {
    "h": "Kinds and special words",
    "text": [
     "Kinds say what a thing is, like num, dec, txt, yno or vec@num. Eight special words can never be names: now, nil, yes, nay, out, err, inp and slf."
    ]
   },
   {
    "h": "Use the Root Finder",
    "text": [
     "The site's Root Finder lists every root and value word with its C++ and the chapter to read, so search there rather than memorising the chart."
    ]
   }
  ],
  "lines": [
   {
    "line": "score add 10",
    "say": "Add 10 to score in place."
   },
   {
    "line": "now btr now",
    "say": "Open a try block."
   },
   {
    "line": "add_up dfn num",
    "say": "Define add_up, which gives back a whole number."
   },
   {
    "line": "now ebk now",
    "say": "Leave the loop."
   },
   {
    "line": "i flt 10",
    "say": "Count i up while it is below 10."
   },
   {
    "line": "x ieq 3",
    "say": "If x equals 3."
   },
   {
    "line": "\"a.txt\" hwr \"hello\"",
    "say": "Write hello into the file a.txt."
   },
   {
    "line": "n is cct&scores",
    "say": "n is how many items scores holds."
   }
  ],
  "mistakes": [],
  "practice": [
   {
    "q": "Without looking, what might wle mean?",
    "answer": "w is while and le is less or equal, so it repeats while a value is at most the one given."
   },
   {
    "q": "lrm and hrm both end in rm. What do they each remove from?",
    "answer": "lrm removes from a list (the l family); hrm removes from the hard drive (the h family)."
   },
   {
    "q": "Make score 0, add 10 to it, and print it.",
    "answer": "is makes it, add changes it in place, prn prints it.",
    "answer_code": "score is 0\nscore add 10\nout prn score",
    "answer_out": "10"
   }
  ],
  "recap": [
   "Guess a word from its family letter and its job pair.",
   "Name the main families and what each does.",
   "Know the kinds and the eight special words.",
   "Look anything else up in the Root Finder."
  ]
 }
];
  /* Fix the Line: real Studio mistakes from the Book (and one from roots.cpp), with the one fixed line. */
  var fixline = [{"id": "4.0", "ch": 4, "title": "The Three Words", "code": "x is 6 7", "line": 1, "bad": "x is 6 7", "says": "Line 1: This line has 4 words. Every line has exactly 3: who, the root, and what. Text with spaces goes in quotes, and & joins values into one word: add&1&2.", "fix": "Keep only one value in the last spot, such as x is 6.", "good": "x is 6", "src": "Book Ch. 4"}, {"id": "4.1", "ch": 4, "title": "The Three Words", "code": "out prn", "line": 1, "bad": "out prn", "says": "Line 1: This line has 2 words. Every line has exactly 3: who, the root, and what. If there is nothing to say in a spot, fill it with now, like now ebk now.", "fix": "Give prn something to print in the third spot, for example out prn \"hi\".", "good": "out prn \"hi\"", "src": "Book Ch. 4"}, {"id": "4.2", "ch": 4, "title": "The Three Words", "code": "x is 6;", "line": 1, "bad": "x is 6;", "says": "Line 1: English++ has no semicolons. A line ends where it ends.", "fix": "Delete the semicolon; the end of the line is the end of the step.", "good": "x is 6", "src": "Book Ch. 4"}, {"id": "4.3", "ch": 4, "title": "The Three Words", "code": "out prn(x)", "line": 1, "bad": "out prn(x)", "says": "Line 1: English++ has no round brackets. Make a step for the part inside: t is a+b, then x is t*c. To call something, use &: add&1&2.", "fix": "Drop the brackets and put x in its own spot with a space: out prn x.", "good": "out prn x", "src": "Book Ch. 4"}, {"id": "6.2", "ch": 6, "title": "Names and Values", "code": "yes is 6", "line": 1, "bad": "yes is 6", "says": "Line 1: yes is a word the language keeps for itself. Pick another name.", "fix": "Choose a name that is not one of the eight special words, such as votes is 6.", "good": "votes is 6", "src": "Book Ch. 6"}, {"id": "6.3", "ch": 6, "title": "Names and Values", "code": "class is 6", "line": 1, "bad": "class is 6", "says": "Line 1: class is a word C++ keeps for itself, and English++ is C++ underneath. Pick another name.", "fix": "Pick a name C++ has not reserved, such as group is 6.", "good": "group is 6", "src": "Book Ch. 6"}, {"id": "9.0", "ch": 9, "title": "Text", "code": "line is \"n is \"+1", "line": 1, "bad": "line is \"n is \"+1", "says": "Line 1: I can't add text and a whole number. Turn the number into text first: \"a\"+txt&x.", "fix": "Wrap the number with txt& before joining: \"n is \"+txt&1.", "good": "line is \"n is \"+txt&1", "src": "Book Ch. 9"}, {"id": "10.0", "ch": 10, "title": "Yes, No and Tests", "code": "x is 3\nok is 1<x<5", "line": 2, "bad": "ok is 1<x<5", "says": "Line 2: Compare one pair at a time. a<b<c doesn't do what it looks like: write a<b&&b<c.", "fix": "Split it into two comparisons joined with &&: 1<x&&x<5.", "good": "ok is 1<x&&x<5", "src": "Book Ch. 10"}, {"id": "20.0", "ch": 20, "title": "Other Collections", "code": "plates mak stk@num\nplates add 1\nout prn plates", "line": 3, "bad": "out prn plates", "says": "Line 3: A stack or a queue can only be read from one end. Print its top: s@top.", "fix": "A stack only shows one end, so print the top item with @top instead of the whole stack.", "good": "out prn plates@top", "src": "Book Ch. 20"}, {"id": "21.0", "ch": 21, "title": "Functions", "code": "out prn add_up&1\n\nadd_up dfn num\n  a dpm num\n  b dpm num\n  add_up ert a+b", "line": 1, "bad": "out prn add_up&1", "says": "Line 1: add_up takes 2 values, but it was given 1.", "fix": "Give add_up both of the values it asks for.", "good": "out prn add_up&1&2", "src": "Book Ch. 21"}, {"id": "21.1", "ch": 21, "title": "Functions", "code": "out prn add_up&1&\"two\"\n\nadd_up dfn num\n  a dpm num\n  b dpm num\n  add_up ert a+b", "line": 1, "bad": "out prn add_up&1&\"two\"", "says": "Line 1: add_up wants a whole number for b, but \"two\" is a text.", "fix": "Hand add_up a number for b, not a text.", "good": "out prn add_up&1&2", "src": "Book Ch. 21"}, {"id": "21.6", "ch": 21, "title": "Functions", "code": "scores is 1&2&3\nnow wipe_it scores\n\nwipe_it dfn now\n  v dpm see@vec@num\n  v lwp now", "line": 5, "bad": "v dpm see@vec@num", "says": "Line 6: v is only a look at the real thing (see@), so it can't change. To change it, take it with ref@.", "fix": "Take the list with ref@ instead of see@ when the function needs to change it.", "good": "v dpm ref@vec@num", "src": "Book Ch. 21"}, {"id": "26.1", "ch": 26, "title": "Your Own Kinds of Things", "code": "Box dcl now\n  w dfd 2\n  grow dkn now\n    w add 1", "line": 3, "bad": "grow dkn now", "says": "Line 4: grow is a constant function (dkn), so it can't change w.", "fix": "A method that changes a field can't be dkn; make grow a plain dfn and keep dkn for methods that only read.", "good": "grow dfn now", "src": "Book Ch. 26"}, {"id": "28.0", "ch": 28, "title": "More Kinds of Your Own", "code": "Mood den happy&sad\nm is Mood@hapy", "line": 2, "bad": "m is Mood@hapy", "says": "Line 2: Mood has no choice called hapy. Its choices: happy, sad. Did you mean happy?", "fix": "Spell the choice exactly as it appears in the den line: Mood@happy.", "good": "m is Mood@happy", "src": "Book Ch. 28"}, {"id": "46.0", "ch": 46, "title": "When the Studio Says Something", "code": "x is 1 2", "line": 1, "bad": "x is 1 2", "says": "Line 1: This line has 4 words. Every line has exactly 3: who, the root, and what. Text with spaces goes in quotes, and & joins values into one word: add&1&2.", "fix": "Join the two values into one word with &, or put them in quotes if you meant text.", "good": "x is 1&2", "src": "Book Ch. 46"}, {"id": "46.2", "ch": 46, "title": "When the Studio Says Something", "code": "x is a + b", "line": 1, "bad": "x is a + b", "says": "Line 1: This line has 5 words. Every line has exactly 3: who, the root, and what. Write math with no spaces: x is a+b.", "fix": "Take the spaces out of the math so it stays one word.", "good": "x is a+b", "src": "Book Ch. 46"}, {"id": "46.3", "ch": 46, "title": "When the Studio Says Something", "code": "x is 1,2", "line": 1, "bad": "x is 1,2", "says": "Line 1: English++ has no commas. Use & between values: add&1&2.", "fix": "Swap the comma for &.", "good": "x is 1&2", "src": "Book Ch. 46"}, {"id": "46.4", "ch": 46, "title": "When the Studio Says Something", "code": "x is v[0]", "line": 1, "bad": "x is v[0]", "says": "Line 1: English++ has no square brackets. Use @ for a position: scores@0.", "fix": "Use @ with the position in place of square brackets.", "good": "x is v@0", "src": "Book Ch. 46"}, {"id": "46.5", "ch": 46, "title": "When the Studio Says Something", "code": "x is rex.age", "line": 1, "bad": "x is rex.age", "says": "Line 1: English++ has no dots, except inside a number like 2.5. Use @ to reach inside something: rex@speed. A file name goes in quotes.", "fix": "Reach the field with @, as in rex@age, not with a dot.", "good": "x is rex@age", "src": "Book Ch. 46"}, {"id": "46.8", "ch": 46, "title": "When the Studio Says Something", "code": "count is 1\nout prn coutn", "line": 2, "bad": "out prn coutn", "says": "Line 2: I don't know coutn yet. Make it first, like coutn is 0. Did you mean count?", "fix": "Fix the spelling so it matches the name you made: count.", "good": "out prn count", "src": "Book Ch. 46"}, {"id": "46.9", "ch": 46, "title": "When the Studio Says Something", "code": "x is 1\nx prt 1", "line": 2, "bad": "x prt 1", "says": "Line 2: I don't know prt. The middle word is a root, like igt or prn, or the name of a function. Did you mean ert? Words starting with p are about put: it writes something out.", "fix": "Pick a real root for the middle spot; to print x, write out prn x.", "good": "out prn x", "src": "Book Ch. 46"}, {"id": "46.10", "ch": 46, "title": "When the Studio Says Something", "code": "x mak nmu", "line": 1, "bad": "x mak nmu", "says": "Line 1: I don't know the kind nmu. Did you mean num? Kinds look like num, dec, txt, ltr, yno, vec@num, map@txt@num, or a class's name.", "fix": "Correct the kind's spelling to num.", "good": "x mak num", "src": "Book Ch. 46"}, {"id": "46.11", "ch": 46, "title": "When the Studio Says Something", "code": "now is 1", "line": 1, "bad": "now is 1", "says": "Line 1: now is a word the language keeps for itself. Pick another name.", "fix": "now is kept by the language, so give your box a different name.", "good": "n is 1", "src": "Book Ch. 46"}, {"id": "46.21", "ch": 46, "title": "When the Studio Says Something", "code": "f dfn num\n  a dpm num\n  f ert a\nout prn f&1&2", "line": 4, "bad": "out prn f&1&2", "says": "Line 4: f takes 1 value, but it was given 2.", "fix": "Pass f exactly one value, because it has one dpm.", "good": "out prn f&1", "src": "Book Ch. 46"}, {"id": "46.22", "ch": 46, "title": "When the Studio Says Something", "code": "f dfn num\n  a dpm num\n  f ert a\nout prn f&\"x\"", "line": 4, "bad": "out prn f&\"x\"", "says": "Line 4: f wants a whole number for a, but \"x\" is a text.", "fix": "Hand f a whole number, since a is a num.", "good": "out prn f&5", "src": "Book Ch. 46"}, {"id": "46.24", "ch": 46, "title": "When the Studio Says Something", "code": "f dfn num\n  f ert \"a\"", "line": 2, "bad": "f ert \"a\"", "says": "Line 2: f promises to give back a whole number, but \"a\" is a text.", "fix": "Give back a number to match num, or change the promised kind to txt.", "good": "f ert 1", "src": "Book Ch. 46"}, {"id": "46.25", "ch": 46, "title": "When the Studio Says Something", "code": "f dfn now\n  f ert 1", "line": 1, "bad": "f dfn now", "says": "Line 2: f gives back nothing. To give something back, say what kind on its first line.", "fix": "Change now on the dfn line to the kind you want back, like num.", "good": "f dfn num", "src": "Book Ch. 46"}, {"id": "46.26", "ch": 46, "title": "When the Studio Says Something", "code": "f dfn num\n  g ert 1", "line": 2, "bad": "g ert 1", "says": "Line 2: ert starts with the name of the function it leaves. This one is f: f ert ...", "fix": "Start the ert line with f, the function it is leaving.", "good": "f ert 1", "src": "Book Ch. 46"}, {"id": "46.29", "ch": 46, "title": "When the Studio Says Something", "code": "D dcl now\n  age dfd 1\nd mak D\nout prn d@agee", "line": 4, "bad": "out prn d@agee", "says": "Line 4: D has no agee. Did you mean age? It has: age.", "fix": "Spell the field the way the class made it: age.", "good": "out prn d@age", "src": "Book Ch. 46"}, {"id": "roots.4676", "ch": 46, "title": "When the Studio Says Something", "code": "d is 2.0\nerr is d*0.15", "line": 2, "bad": "err is d*0.15", "says": "Line 2: err is a word the language keeps for itself. Pick another name.", "fix": "err is one of the eight special words (it is the screen for problems), so it can never be a name. Give the box its own name, such as aim_err.", "good": "aim_err is d*0.15", "src": "roots.cpp line 4676"}];
  var path = [{"name":"First lines","goal":"Read and write the three-word line: names, printing, math and text.","chapters":[2,3,4,5,6,7,8,9],"checkpoint":{"can":"Can you make three names, do math with them, and print one sentence that fills them in with \"@name\"?","project":"Word Echo"}},{"name":"Choices and loops","goal":"Make the program decide and repeat: yes and no, if and otherwise, every kind of loop, talking with the user.","chapters":[10,11,12,13,14,15,16],"checkpoint":{"can":"Can you write a game loop that asks, tests the answer, and stops at the right time?","project":"Guess the Number"}},{"name":"Collections","goal":"Hold many things at once: lists, asking a list, maps, sets, stacks and queues.","chapters":[17,18,19,20],"checkpoint":{"can":"Can you keep a list or map, change it, and ask it for its count, biggest and sum?","project":"Birthday Map"}},{"name":"Functions","goal":"Name your own jobs: functions, functions kept in a name, functions over lists, checks and tests.","chapters":[21,22,23,24,25],"checkpoint":{"can":"Can you write a function that takes two values, gives one back, and is used in three places?","project":"Greeter"}},{"name":"Your own kinds","goal":"Build classes: fields and methods, children, more class tricks, any kind, pointers.","chapters":[26,27,28,29,30,31,32],"checkpoint":{"can":"Can you write a class with a child class that changes one of its methods?","project":"Pet Shop"}},{"name":"Real programs","goal":"Programs that survive the real world: errors, bits and huge numbers, files, the clock.","chapters":[33,34,35,36,37],"checkpoint":{"can":"Can you save a list to a file, read it back, and catch the error when the file is missing?","project":"Shopping List"}},{"name":"Many things at once","goal":"Threads, threads that talk, groups and other files, the world outside, bytes and other computers, any C++ library.","chapters":[38,39,40,41,42,43,44],"checkpoint":{"can":"Can you start two threads, pass values through a channel, and join them both before the program ends?"}},{"name":"Master tools","goal":"Work like a pro: the Studio's tools, reading its messages, Turbo, English++ against C++, and the full reference.","chapters":[45,46,47,48,51,52],"checkpoint":{"can":"Can you find any root in the Root Finder, read a Studio message and fix the line it names, and say when Turbo can't help?"}}];

  return {
    chart: chart, lessons: lessons, path: path, fixline: fixline,
    blocks: blocks, chapters: chapters, shelves: shelves, glossary: glossary, field: field, cheats: cheats,
    projects: projects, vt: vt, themes: themes,
    fill: function (k, r) {
      if (k === "f") return pick(FUNCS, r);
      if (k === "sv") return pick(TEXTS, r);
      if (k === "o") return pick(THINGS, r);
      if (k === "c") return pick(KINDS, r);
      if (k === "k") return pick(BASES, r);
      if (k === "col") return pick(COLORS, r);
      if (k === "b") return r() < 0.5 ? "yes" : "nay";
      return null;
    },
    sandboxNote: "English++ in the book's main form — three words on every line: who, the root, and what — in the order The English++ Book teaches it, from out prn to threads and libraries. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your English++ progress is saved separately from every other track.",
    sourcesHTML: "English++ facts and syntax follow <i>The English++ Book</i> (for English++ Studio 3) and its Whole Chart, in the three-words-a-line form. Turbo and speed figures follow the Book's chapters on Turbo and on English++ against C++, with extra detail from the English++ Studio notes TURBO.md and SPEED.md and the Revolutionizer's source notes. English++ Studio is a Windows program, so it can't run inside Code Block's checks. Instead a stand-in, written from the book and checked against the book's own examples, reads every drill and Vault line and runs the practice programs it can; the few it can't run were checked by hand against the Book's programs. Every explanation is written in Code Block's own words."
  };
});
