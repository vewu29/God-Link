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
{name:"Hello Block",short:"Hello",chapter:"English++ Book Ch. 2 · Hello!",icon:"i-say",verb:"say",line: "out prn \"Hello!\"",explain:"Print Hello! on the screen.",say:""},
{name:"Hello V Block",short:"Hello, V!",chapter:"English++ Book Ch. 3 · Your First Program",icon:"i-say",verb:"greet",line: "out prn \"Hello, V!\"",explain:"Print a line on the screen.",say:""},
{name:"Number Out Block",short:"Print a number",chapter:"English++ Book Ch. 3 · Your First Program",icon:"i-say",verb:"show",line: "out prn 1",explain:"Print the number 1.",say:""},
{name:"Name Block",short:"is",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-box",verb:"store",line: "score is 7",explain:"is gives a name a value.",say:""},
{name:"Decimal Block",short:"Decimal",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-box",verb:"measure",line: "price is 2.5",explain:"A decimal holds a point number.",say:""},
{name:"Text Name Block",short:"Text",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-tag",verb:"name",line: "name is \"Ada\"",explain:"Quote marks make a text.",say:""},
{name:"Letter Block",short:"Letter",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-tag",verb:"pick",line: "first is 'A'",explain:"A letter holds one letter.",say:""},
{name:"Yes Block",short:"Yes or no",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-toggle",verb:"decide",line: "ready is yes",explain:"Yes or no, nothing else.",say:""},
{name:"Make Block",short:"mak",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-plus-square",verb:"make",line: "score mak num",explain:"mak makes an empty box.",say:""},
{name:"Make Text Block",short:"mak txt",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-plus-square",verb:"make",line: "name mak txt",explain:"Make an empty text.",say:""},
{name:"Big Number Block",short:"big",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-plus-square",verb:"grow",line: "stars mak big",explain:"Big holds huge whole numbers.",say:""},
{name:"Constant Block",short:"mkn",chapter:"English++ Book Ch. 6 · Names and Values",icon:"i-anchor",verb:"keep",line: "DAYS mkn 7",explain:"A constant never changes.",say:""},
{name:"Put Block",short:"put",chapter:"English++ Book Ch. 7 · Printing",icon:"i-say",verb:"write",line: "out put \"one \"",explain:"Print and stay on the line.",say:""},
{name:"Inside Text Block",short:"@ in text",chapter:"English++ Book Ch. 7 · Printing",icon:"i-say",verb:"fill in",line: "out prn \"@name is @age years old.\"",explain:"Put values inside a text.",say:""},
{name:"Many Values Block",short:"a&b",chapter:"English++ Book Ch. 7 · Printing",icon:"i-say",verb:"list",line: "out prn name&age",explain:"Print two values at once.",say:""},
{name:"Add Block",short:"add",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"add",line: "x add 5",explain:"add changes a box in place.",say:""},
{name:"Subtract Block",short:"asb",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"take",line: "x asb 3",explain:"Take 3 away from x.",say:""},
{name:"Multiply Block",short:"aml",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"double",line: "x aml 2",explain:"Double x in place.",say:""},
{name:"Divide Block",short:"adv",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"share",line: "x adv 4",explain:"Divide x by 4.",say:""},
{name:"Remainder Block",short:"amd",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"leave",line: "x amd 5",explain:"Keep what is left over.",say:""},
{name:"Math Block",short:"a+b*2",chapter:"English++ Book Ch. 8 · Math",icon:"i-brackets",verb:"work out",line: "total is a+b",explain:"Math goes in one word, no spaces.",say:""},
{name:"Leftover Block",short:"%",chapter:"English++ Book Ch. 8 · Math",icon:"i-brackets",verb:"check",line: "out prn 7%2",explain:"Print what 7 leaves over.",say:""},
{name:"Square Root Block",short:"nsq",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"root",line: "y is nsq&16",explain:"Take the square root.",say:""},
{name:"Random Block",short:"nra",chapter:"English++ Book Ch. 8 · Math",icon:"i-star",verb:"roll",line: "first is nra&1&100",explain:"Pick a random number.",say:""},
{name:"Power Block",short:"apw",chapter:"English++ Book Ch. 8 · Math",icon:"i-calc",verb:"raise",line: "y apw 10",explain:"Raise y to a power.",say:""},
{name:"Uppercase Block",short:"tuc",chapter:"English++ Book Ch. 9 · Text",icon:"i-link",verb:"shout",line: "out prn tuc&t",explain:"tuc gives a text in uppercase.",say:""},
{name:"Text Size Block",short:"tsz",chapter:"English++ Book Ch. 9 · Text",icon:"i-link",verb:"count",line: "out prn tsz&word",explain:"Count the letters in a text.",say:""},
{name:"Join Text Block",short:"+ text",chapter:"English++ Book Ch. 9 · Text",icon:"i-link",verb:"join",line: "whole is first+\" \"+last",explain:"Join texts into one.",say:""},
{name:"Has Text Block",short:"ths",chapter:"English++ Book Ch. 9 · Text",icon:"i-search",verb:"find",line: "out prn ths&t&\"lo\"",explain:"Ask if a text holds lo.",say:""},
{name:"Replace Block",short:"trp",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"swap",line: "out prn trp&t&\"World\"&\"You\"",explain:"Swap one word for another.",say:""},
{name:"Part of Text Block",short:"tcu",chapter:"English++ Book Ch. 9 · Text",icon:"i-pencil",verb:"cut",line: "out prn tcu&t&0&5",explain:"Cut out part of a text.",say:""},
{name:"Number to Text Block",short:"txt&",chapter:"English++ Book Ch. 9 · Text",icon:"i-swap-h",verb:"turn",line: "line is \"n is \"+txt&n",explain:"Turn a number into text.",say:""},
{name:"Compare Block",short:"x>3",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-toggle",verb:"test",line: "old_enough is age>=6",explain:"A comparison gives yes or nay.",say:""},
{name:"And Block",short:"&&",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-toggle",verb:"join",line: "out prn age>5&&tall",explain:"Yes only when both are yes.",say:""},
{name:"Not Block",short:"!",chapter:"English++ Book Ch. 10 · Yes, No and Tests",icon:"i-toggle",verb:"flip",line: "out prn !tall",explain:"Flip yes to no.",say:""},
{name:"If Block",short:"ilt",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-fork",verb:"choose",line: "x ilt 3",explain:"Do it when x is less.",say:""},
{name:"If Equal Block",short:"ieq",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-fork",verb:"match",line: "x ieq 3",explain:"ieq means if equal.",say:""},
{name:"If Not Equal Block",short:"ine",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-fork",verb:"differ",line: "x ine 3",explain:"Do it when x is different.",say:""},
{name:"If Greater Block",short:"igt",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-fork",verb:"beat",line: "x igt 3",explain:"Do it when x is more.",say:""},
{name:"Otherwise-If Block",short:"olt",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-help",verb:"ask again",line: "x olt 5",explain:"Or else, ask a new question.",say:""},
{name:"Otherwise Block",short:"oth",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-swap-h",verb:"fall back",line: "now oth now",explain:"oth means all the other times.",say:""},
{name:"Switch Block",short:"bsw",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-toggle",verb:"pick",line: "day bsw now",explain:"Pick one of many cases.",say:""},
{name:"Case Block",short:"bcs",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-toggle",verb:"case",line: "now bcs 6&7",explain:"This case runs for 6 or 7.",say:""},
{name:"Default Block",short:"bdf",chapter:"English++ Book Ch. 11 · If and Otherwise",icon:"i-toggle",verb:"else",line: "now bdf now",explain:"Run this when nothing matched.",say:""},
{name:"Count Block",short:"flt",chapter:"English++ Book Ch. 12 · Loops",icon:"i-repeat",verb:"count",line: "i flt 5",explain:"flt counts while less than.",say:""},
{name:"Count To Block",short:"fle",chapter:"English++ Book Ch. 12 · Loops",icon:"i-repeat",verb:"count",line: "k fle 3",explain:"Count up to 3, included.",say:""},
{name:"Count Down Block",short:"fgt",chapter:"English++ Book Ch. 12 · Loops",icon:"i-repeat",verb:"count down",line: "count fgt 0",explain:"Count down to 0.",say:""},
{name:"Each Block",short:"fea",chapter:"English++ Book Ch. 12 · Loops",icon:"i-visit",verb:"visit",line: "s fea scores",explain:"fea means for each item.",say:""},
{name:"While Block",short:"wgt",chapter:"English++ Book Ch. 12 · Loops",icon:"i-clock",verb:"wait",line: "d wgt 2",explain:"Repeat while d is more.",say:""},
{name:"While Less Block",short:"wlt",chapter:"English++ Book Ch. 12 · Loops",icon:"i-clock",verb:"climb",line: "n wlt 100",explain:"wlt repeats while less than.",say:""},
{name:"Forever Block",short:"wfv",chapter:"English++ Book Ch. 12 · Loops",icon:"i-rotate",verb:"repeat",line: "now wfv now",explain:"Repeat forever, until stopped.",say:""},
{name:"Break Block",short:"ebk",chapter:"English++ Book Ch. 12 · Loops",icon:"i-stop",verb:"leave",line: "now ebk now",explain:"Leave the loop right now.",say:""},
{name:"Break When Block",short:"ebk test",chapter:"English++ Book Ch. 12 · Loops",icon:"i-stop",verb:"stop",line: "now ebk n==3",explain:"Leave when n is 3.",say:""},
{name:"Next Turn Block",short:"enx",chapter:"English++ Book Ch. 12 · Loops",icon:"i-chev-right",verb:"skip",line: "i enx i==1",explain:"Skip to the next turn.",say:""},
{name:"Do Block",short:"bdo",chapter:"English++ Book Ch. 12 · Loops",icon:"i-rotate",verb:"do",line: "now bdo now",explain:"Do it once, then ask.",say:""},
{name:"Until Block",short:"uge",chapter:"English++ Book Ch. 12 · Loops",icon:"i-flag",verb:"finish",line: "n uge 6",explain:"Keep going until n is 6.",say:""},
{name:"Repeat Text Block",short:"tre",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-repeat",verb:"repeat",line: "out prn tre&\"ha\"&3",explain:"Repeat a text three times.",say:""},
{name:"Count Text Block",short:"tct",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-search",verb:"count",line: "out prn tct&song&\"la\"",explain:"Count how many times la appears.",say:""},
{name:"Digit Block",short:"tdg",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-calc",verb:"sort",line: "tdg&c ieq yes",explain:"Ask if a letter is a digit.",say:""},
{name:"Letter Test Block",short:"tlr",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-tag",verb:"sort",line: "tlr&c ieq yes",explain:"Ask if a letter is a letter.",say:""},
{name:"Pattern Block",short:"tfa",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-pencil",verb:"fill in",line: "out prn tfa&\"{} has {} points\"&name&score",explain:"Fill in the holes in order.",say:""},
{name:"Two Places Block",short:"{:.2f}",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-pencil",verb:"round",line: "out prn tfa&\"{:.2f}\"&3.14159",explain:"Show two places after the point.",say:""},
{name:"Kind Name Block",short:"ttp",chapter:"English++ Book Ch. 13 · More Ways With Text",icon:"i-help",verb:"ask",line: "out prn ttp&x",explain:"Say what kind x is.",say:""},
{name:"Ask Block",short:"get",chapter:"English++ Book Ch. 14 · Talking With Your Program",icon:"i-keyboard",verb:"listen",line: "name get \"Name? \"",explain:"get asks and waits for an answer.",say:""},
{name:"List Block",short:"1&2&3",chapter:"English++ Book Ch. 17 · Lists",icon:"i-boxes",verb:"line up",line: "scores is 90&72&85",explain:"& joins values into a list.",say:""},
{name:"Empty List Block",short:"vec@num",chapter:"English++ Book Ch. 17 · Lists",icon:"i-boxes",verb:"prepare",line: "scores mak vec@num",explain:"Make an empty list of numbers.",say:""},
{name:"Position Block",short:"@0",chapter:"English++ Book Ch. 17 · Lists",icon:"i-boxes",verb:"reach",line: "out prn scores@0",explain:"@ reaches into a list by position.",say:""},
{name:"Change Item Block",short:"@1 is",chapter:"English++ Book Ch. 17 · Lists",icon:"i-pencil",verb:"change",line: "scores@1 is 75",explain:"Change the item at position 1.",say:""},
{name:"Grow List Block",short:"add",chapter:"English++ Book Ch. 17 · Lists",icon:"i-plus-square",verb:"grow",line: "v add 4",explain:"add puts a new item on the end.",say:""},
{name:"Insert Block",short:"lin",chapter:"English++ Book Ch. 17 · Lists",icon:"i-plus-square",verb:"insert",line: "v lin 0&8",explain:"Put 8 in at position 0.",say:""},
{name:"Remove Block",short:"lrm",chapter:"English++ Book Ch. 17 · Lists",icon:"i-x",verb:"remove",line: "v lrm 3",explain:"Take out the first 3.",say:""},
{name:"Remove At Block",short:"ldx",chapter:"English++ Book Ch. 17 · Lists",icon:"i-x",verb:"drop",line: "v ldx 0",explain:"Take out the first item.",say:""},
{name:"Pop Block",short:"lpl",chapter:"English++ Book Ch. 17 · Lists",icon:"i-x",verb:"pop",line: "v lpl now",explain:"Take off the last item.",say:""},
{name:"Sort Block",short:"lso",chapter:"English++ Book Ch. 17 · Lists",icon:"i-sliders",verb:"sort",line: "v lso now",explain:"Sort the list, smallest first.",say:""},
{name:"Count Items Block",short:"cct",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-list",verb:"ask",line: "out prn cct&scores",explain:"Count how many items there are.",say:""},
{name:"Sum Block",short:"csm",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-list",verb:"total",line: "out prn csm&v",explain:"csm adds up every item.",say:""},
{name:"Biggest Block",short:"cmx",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-trophy",verb:"find",line: "out prn cmx&v",explain:"Find the biggest item.",say:""},
{name:"Average Block",short:"cav",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-gauge",verb:"average",line: "out prn cav&v",explain:"Find the average.",say:""},
{name:"Has Item Block",short:"chs",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-search",verb:"look",line: "out prn chs&v&9",explain:"Ask if the list has 9.",say:""},
{name:"Sorted Copy Block",short:"cso",chapter:"English++ Book Ch. 18 · Asking a List",icon:"i-sliders",verb:"copy",line: "out prn cso&v",explain:"Get a sorted copy.",say:""},
{name:"Map Block",short:"map@txt@num",chapter:"English++ Book Ch. 19 · Maps",icon:"i-grid",verb:"file",line: "ages mak map@txt@num",explain:"A map finds a value by its key.",say:""},
{name:"Map Key Block",short:"@\"Ada\"",chapter:"English++ Book Ch. 19 · Maps",icon:"i-key",verb:"store",line: "ages@\"Ada\" is 36",explain:"File 36 under Ada.",say:""},
{name:"Map Walk Block",short:"k&v fea",chapter:"English++ Book Ch. 19 · Maps",icon:"i-visit",verb:"walk",line: "name&age fea ages",explain:"Walk every key and value.",say:""},
{name:"Set Block",short:"set@txt",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-overlap",verb:"gather",line: "seen mak set@txt",explain:"A set keeps each thing once.",say:""},
{name:"Stack Block",short:"stk@num",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-layers",verb:"pile",line: "plates mak stk@num",explain:"Last on, first off.",say:""},
{name:"Queue Block",short:"que@txt",chapter:"English++ Book Ch. 20 · Other Collections",icon:"i-walk",verb:"line up",line: "line mak que@txt",explain:"First in, first out.",say:""},
{name:"Function Block",short:"dfn",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play-circle",verb:"run",line: "add_up dfn num",explain:"dfn defines a function.",say:""},
{name:"Nothing Back Block",short:"dfn now",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play-circle",verb:"do",line: "greet dfn now",explain:"A function that gives back nothing.",say:""},
{name:"Parameter Block",short:"dpm",chapter:"English++ Book Ch. 21 · Functions",icon:"i-tag",verb:"take",line: "a dpm num",explain:"dpm says what a function takes.",say:""},
{name:"Return Block",short:"ert",chapter:"English++ Book Ch. 21 · Functions",icon:"i-go",verb:"answer",line: "add_up ert a+b",explain:"ert hands an answer back.",say:""},
{name:"Call Block",short:"f&1&2",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play",verb:"call",line: "x is add_up&1&2",explain:"& hands values to a function.",say:""},
{name:"Run Block",short:"now f",chapter:"English++ Book Ch. 21 · Functions",icon:"i-play",verb:"run",line: "now greet \"Ada\"",explain:"Run the greet function.",say:""},
{name:"Reference Block",short:"mrf",chapter:"English++ Book Ch. 21 · Functions",icon:"i-link",verb:"share",line: "also mrf x",explain:"Another name for the same box.",say:""},
{name:"Lambda Block",short:"dlm",chapter:"English++ Book Ch. 22 · Functions in a Name",icon:"i-lambda",verb:"keep",line: "twice dlm num",explain:"dlm makes a function in a name.",say:""},
{name:"Each Passes Block",short:"cea",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-check",verb:"check",line: "out prn cea&scores&passed",explain:"Ask if each item passes.",say:""},
{name:"Any Passes Block",short:"can",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-check",verb:"find",line: "out prn can&scores&passed",explain:"Ask if any item passes.",say:""},
{name:"Keep Block",short:"cft",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-funnel",verb:"filter",line: "out prn cft&v&big",explain:"cft keeps the items that pass.",say:""},
{name:"Roll Up Block",short:"crl",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-rows",verb:"roll",line: "out prn crl&v&1&times",explain:"Roll the list into one value.",say:""},
{name:"Zip Block",short:"czp",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-link",verb:"zip",line: "n&a fea czp&names&ages",explain:"Walk two lists side by side.",say:""},
{name:"Numbered Block",short:"cnu",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-list",verb:"number",line: "k&n fea cnu&names",explain:"Walk with a number for each.",say:""},
{name:"Both Lists Block",short:"cun",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-overlap",verb:"join",line: "out prn cun&a&b",explain:"What is in either list.",say:""},
{name:"Cut Block",short:"ccu",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-pencil",verb:"cut",line: "out prn ccu&v&1&2",explain:"Cut out part of a list.",say:""},
{name:"Range Block",short:"crg",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-sliders",verb:"count",line: "out prn crg&0&5",explain:"Make a list by counting.",say:""},
{name:"Halves Block",short:"cbf",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-search",verb:"find",line: "out prn cbf&sorted&6",explain:"Find it by halves.",say:""},
{name:"Group Items Block",short:"cgr",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-grid",verb:"group",line: "g is cgr&words&first",explain:"Group items by a label.",say:""},
{name:"Join Lists Block",short:"cjn",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-layers",verb:"flatten",line: "out prn cjn&lists",explain:"Join lists into one.",say:""},
{name:"Rotate Block",short:"lrw",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-rotate",verb:"turn",line: "cards lrw 1",explain:"Move the first item to the end.",say:""},
{name:"Stable Sort Block",short:"lss",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-sliders",verb:"sort",line: "names lss shorter",explain:"Sort and keep ties in order.",say:""},
{name:"Low Heap Block",short:"mhp",chapter:"English++ Book Ch. 23 · Lists and Functions Together",icon:"i-layers",verb:"queue",line: "jobs mak mhp@num",explain:"A heap with the smallest on top.",say:""},
{name:"Any Number Block",short:"dpm vec@",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-boxes",verb:"gather",line: "xs dpm vec@num",explain:"Take all the values left over.",say:""},
{name:"Saved Name Block",short:"msv",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-anchor",verb:"keep",line: "n msv 0",explain:"A name that stays between calls.",say:""},
{name:"Own Copies Block",short:"dlv",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-lambda",verb:"copy",line: "copy dlv num",explain:"A lambda with its own copies.",say:""},
{name:"Compile Time Block",short:"dcx",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-gear",verb:"precompute",line: "square dcx num",explain:"Work it out while building.",say:""},
{name:"Generator Block",short:"gnr@num",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-repeat",verb:"hand out",line: "evens dfn gnr@num",explain:"Hand out one value at a time.",say:""},
{name:"Yield Block",short:"eyd",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-yield",verb:"yield",line: "evens eyd i",explain:"Hand over a value and wait.",say:""},
{name:"Clean Up Block",short:"bdr",chapter:"English++ Book Ch. 24 · More About Functions",icon:"i-check",verb:"tidy",line: "now bdr now",explain:"Run this when the block ends.",say:""},
{name:"Should Block",short:"seq",chapter:"English++ Book Ch. 25 · Checks and Tests",icon:"i-clipboard",verb:"check",line: "x seq 3",explain:"x should equal 3.",say:""},
{name:"Test Block",short:"bts",chapter:"English++ Book Ch. 25 · Checks and Tests",icon:"i-check",verb:"test",line: "now bts \"adding small numbers\"",explain:"Name a test.",say:""},
{name:"Class Block",short:"dcl",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-shapes",verb:"shape",line: "Dog dcl now",explain:"dcl defines your own kind of thing.",say:""},
{name:"Field Block",short:"dfd",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-brick",verb:"hold",line: "age dfd 3",explain:"dfd gives a class a field.",say:""},
{name:"Maker Block",short:"dmk",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-gear",verb:"build",line: "Dog dmk now",explain:"What runs when one is made.",say:""},
{name:"Make One Block",short:"mak Dog",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-plus-square",verb:"make",line: "a mak Dog&\"Rex\"",explain:"mak makes one thing of a kind.",say:""},
{name:"Reach In Block",short:"rex@age",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-point",verb:"read",line: "out prn rex@dog_years",explain:"Reach inside a thing.",say:""},
{name:"Method Block",short:"rex bark",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-play",verb:"ask",line: "rex bark now",explain:"A thing's name, then what it can do.",say:""},
{name:"Secret Field Block",short:"dsc",chapter:"English++ Book Ch. 26 · Your Own Kinds of Things",icon:"i-lock",verb:"hide",line: "money dsc 0",explain:"A secret only its own lines see.",say:""},
{name:"Child Block",short:"dcl Animal",chapter:"English++ Book Ch. 27 · Children",icon:"i-tree",verb:"inherit",line: "Dog dcl Animal",explain:"A child gets everything its parent has.",say:""},
{name:"Base Block",short:"dbs",chapter:"English++ Book Ch. 27 · Children",icon:"i-tree",verb:"pass up",line: "now dbs given",explain:"Hand values to the parent first.",say:""},
{name:"Virtual Block",short:"dvr",chapter:"English++ Book Ch. 27 · Children",icon:"i-layers",verb:"promise",line: "sound dvr txt",explain:"A function a child may change.",say:""},
{name:"Override Block",short:"dov",chapter:"English++ Book Ch. 27 · Children",icon:"i-layers",verb:"redo",line: "sound dov txt",explain:"The child's own version.",say:""},
{name:"Struct Block",short:"dst",chapter:"English++ Book Ch. 28 · More Kinds of Your Own",icon:"i-grid",verb:"pack",line: "Spot dst now",explain:"A simple class that holds values.",say:""},
{name:"Enum Block",short:"den",chapter:"English++ Book Ch. 28 · More Kinds of Your Own",icon:"i-list",verb:"choose",line: "Mood den happy&sad",explain:"A kind with fixed choices.",say:""},
{name:"Template Block",short:"dtp",chapter:"English++ Book Ch. 29 · Any Kind",icon:"i-stamp",verb:"stamp",line: "T dtp now",explain:"A kind filled in later.",say:""},
{name:"Pointer Block",short:"mpt",chapter:"English++ Book Ch. 30 · Pointers",icon:"i-point",verb:"point",line: "p mpt x",explain:"Point at x.",say:""},
{name:"New Block",short:"mnw",chapter:"English++ Book Ch. 30 · Pointers",icon:"i-point-spark",verb:"make",line: "p mnw Torch",explain:"Make a new Torch.",say:""},
{name:"Delete Block",short:"edl",chapter:"English++ Book Ch. 30 · Pointers",icon:"i-x",verb:"free",line: "now edl p",explain:"Delete what p points to.",say:""},
{name:"At Operator Block",short:"at dop",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-point",verb:"reach",line: "at dop ref@num",explain:"Define the at operator.",say:""},
{name:"Call Operator Block",short:"call dop",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-play",verb:"call",line: "call dop num",explain:"Define the call operator.",say:""},
{name:"Add Operator Block",short:"+= dop",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-plus-square",verb:"add",line: "+= dop ref@Dot",explain:"Define the plus operator.",say:""},
{name:"Really Is Block",short:"ptr@Dog&p",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-eye",verb:"check",line: "dog is ptr@Dog&p",explain:"Ask if it really is a Dog.",say:""},
{name:"Bit Field Block",short:"dbb",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-toggle",verb:"pack",line: "ready dbb 1",explain:"A field that holds one bit.",say:""},
{name:"Take Over Block",short:"tkn@",chapter:"English++ Book Ch. 31 · More Tricks for Your Classes",icon:"i-swap-h",verb:"take",line: "o dpm tkn@Kept",explain:"Take over a kept value.",say:""},
{name:"Try Block",short:"btr",chapter:"English++ Book Ch. 33 · When Things Go Wrong",icon:"i-shield-check",verb:"try",line: "now btr now",explain:"Try these lines.",say:""},
{name:"Catch Block",short:"bch",chapter:"English++ Book Ch. 33 · When Things Go Wrong",icon:"i-shield-check",verb:"rescue",line: "e bch now",explain:"Catch what went wrong.",say:""},
{name:"Throw Block",short:"etw",chapter:"English++ Book Ch. 33 · When Things Go Wrong",icon:"i-shield-alert",verb:"warn",line: "now etw \"bad\"",explain:"Throw an error.",say:""},
{name:"Bit And Block",short:"nnd",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-cube",verb:"mask",line: "out prn nnd&a&b",explain:"Print a and b together.",say:""},
{name:"Shift Block",short:"nsl",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-chev-left",verb:"shift",line: "out prn nsl&a&2",explain:"Shift a left by 2.",say:""},
{name:"Size Block",short:"nsz",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-gauge",verb:"measure",line: "out prn nsz&x",explain:"Print how many bits x has.",say:""},
{name:"Never Below Zero Block",short:"pbg",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-plus-square",verb:"grow",line: "huge mak pbg",explain:"A number that never goes below zero.",say:""},
{name:"Huge Block",short:"hug",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-star",verb:"grow",line: "x mak hug",explain:"Make a huge number.",say:""},
{name:"Huge From Text Block",short:"hug&",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-star",verb:"read",line: "x is hug&\"123456789012345678901234567890\"",explain:"Make a huge number from text.",say:""},
{name:"Complex Block",short:"cpx",chapter:"English++ Book Ch. 34 · Bits and Huge Numbers",icon:"i-waves",verb:"pair",line: "p mak cpx&1.0&2.0",explain:"Make a complex number.",say:""},
{name:"Write File Block",short:"hwr",chapter:"English++ Book Ch. 35 · Files",icon:"i-file",verb:"save",line: "\"a.txt\" hwr \"hello\"",explain:"Write hello to a file.",say:""},
{name:"Append Block",short:"hap",chapter:"English++ Book Ch. 35 · Files",icon:"i-file",verb:"add on",line: "\"a.txt\" hap \"more\"",explain:"Add more to the file.",say:""},
{name:"Read File Block",short:"hrd",chapter:"English++ Book Ch. 35 · Files",icon:"i-folder",verb:"read",line: "text is hrd&name",explain:"Read a file into text.",say:""},
{name:"Wait Block",short:"rwt",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-hourglass",verb:"wait",line: "now rwt 100",explain:"Wait 100 milliseconds.",say:""},
{name:"Clock Block",short:"kel",chapter:"English++ Book Ch. 37 · The Clock",icon:"i-clock",verb:"time",line: "out prn kel>0",explain:"Ask if the clock is running.",say:""},
{name:"Thread Block",short:"mtd",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-nodes",verb:"start",line: "t mtd count_to&3",explain:"Start a thread counting to 3.",say:""},
{name:"Join Block",short:"rjn",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-nodes",verb:"wait for",line: "t rjn now",explain:"Wait for the thread to finish.",say:""},
{name:"Lock Block",short:"blk",chapter:"English++ Book Ch. 38 · At the Same Time",icon:"i-lock",verb:"guard",line: "m blk now",explain:"Lock it so only one thread enters.",say:""},
{name:"Channel Block",short:"chn@num",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-waves",verb:"pipe",line: "c mak chn@num",explain:"Make a channel for numbers.",say:""},
{name:"Send Block",short:"c add",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-go",verb:"send",line: "c add i+1",explain:"Send a number down the channel.",say:""},
{name:"Close Block",short:"close",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-stop",verb:"close",line: "c close now",explain:"Close the channel.",say:""},
{name:"Condition Block",short:"cnd",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-hourglass",verb:"wait",line: "cv mak cnd",explain:"Make a condition to wait on.",say:""},
{name:"Each Thread Block",short:"mtl",chapter:"English++ Book Ch. 39 · Threads That Talk",icon:"i-nodes",verb:"own",line: "seen mtl 0",explain:"Each thread gets its own seen.",say:""},
{name:"Group Block",short:"dgr",chapter:"English++ Book Ch. 40 · Groups and Other Files",icon:"i-folder",verb:"gather",line: "geo dgr now",explain:"A group of names together.",say:""},
{name:"Import Block",short:"xim",chapter:"English++ Book Ch. 40 · Groups and Other Files",icon:"i-folder",verb:"bring",line: "now xim \"tools.epp\"",explain:"Bring in another file.",say:""},
{name:"Command Block",short:"rcm",chapter:"English++ Book Ch. 41 · The World Outside",icon:"i-monitor",verb:"command",line: "now rcm \"echo Hello from Windows\"",explain:"Run a command on the computer.",say:""},
{name:"Write Bytes Block",short:"hby",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-file",verb:"save",line: "\"a.bin\" hby bytes",explain:"Write bytes to a file.",say:""},
{name:"Read Bytes Block",short:"hrb",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-folder",verb:"read",line: "back is hrb&\"bytes.bin\"",explain:"Read bytes back from a file.",say:""},
{name:"Nanosecond Block",short:"kns",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-clock",verb:"time",line: "start is kns",explain:"Read the clock in nanoseconds.",say:""},
{name:"Date Pattern Block",short:"kfa",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-clock",verb:"date",line: "year is kfa&\"%Y\"",explain:"Get the year as text.",say:""},
{name:"Hash Block",short:"xha",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-key",verb:"fingerprint",line: "out prn xha&\"abc\"",explain:"Print the hash of abc.",say:""},
{name:"Base 64 Block",short:"xbe",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-swap-h",verb:"encode",line: "code is xbe&\"hello\"",explain:"Turn hello into base 64.",say:""},
{name:"JSON Block",short:"tjs",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-braces",verb:"read",line: "j is tjs&\"{\\\"name\\\": \\\"Ada\\\", \\\"pets\\\": [\\\"Rex\\\", \\\"Tom\\\"]}\"",explain:"Turn JSON text into a value.",say:""},
{name:"Server Block",short:"srv",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-net",verb:"listen",line: "door mak srv&0",explain:"Open a server door.",say:""},
{name:"Socket Block",short:"sck",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-link",verb:"connect",line: "c mak sck&\"127.0.0.1\"&p",explain:"Connect to a socket.",say:""},
{name:"Post Block",short:"xpo",chapter:"English++ Book Ch. 42 · Bytes, Codes and Other Computers",icon:"i-cloud",verb:"send",line: "answer is xpo&\"http://127.0.0.1:1/form\"&\"name=Ada\"",explain:"Post a form to a server.",say:""},
{name:"Library Block",short:"xlb",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-book",verb:"load",line: "now xlb raylib",explain:"Use the raylib library.",say:""},
{name:"Include Block",short:"xic",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-book",verb:"include",line: "now xic \"<vector>\"",explain:"Include a C++ header.",say:""},
{name:"C++ Here Block",short:"xpp",chapter:"English++ Book Ch. 43 · Any C++, Any Library",icon:"i-braces",verb:"write",line: "now xpp \"int a = 1;\"",explain:"Write C++ right here.",say:""}
];

var chapters = [{ title: "Hello!", chapter: "English++ Book Ch. 2 · out prn, and Run (F5)", line: 'out prn "Hello, V!"',
      content: {
        story: ["A program is a list of things for a computer to do, one line at a time. In English++ every line is three words, and you can read each one out loud: out prn \"Hello, V!\" means the screen, print a line, Hello, V!.",
          "out is the screen. prn is the root: the word that says what happens. The text in quote marks is what gets printed, and it counts as one word however many spaces it has.",
          "Your English++ turns into C++, the language big games and apps are written in, and the C++ turns into something your computer can run. So what you make is a real program."],
        big: "Every line is three words — who, the root, and what — and out prn prints a line.",
        caption: "Three words go in; the Output panel says hello. Tap Play.",
        demo: ["out · prn · \"Hello, V!\"", "English++ → C++", "C++ → a real program", "Output: Hello, V!"]
      },
      deep: {
        more: ["Lines run from top to bottom, one after the other, so the order you write them in is the order they happen.",
          "Words in quote marks are text, and the computer prints text exactly as you wrote it — capital letters, spaces and all."],
        ex: { code: src(["x is 6", "x add 1", "out prn x"]),
          walk: ["Line 1: x is 6 — a box called x holds 6.", "Line 2: x add 1 — add 1 to x, so it holds 7.", "Line 3: out prn x — print it: 7."] },
        mistake: "Writing out prn \"Hello, V! with no closing quote mark. English++ can't tell where the text stops, and the Studio says so."
      } },
{ title: "Your First Program", chapter: "English++ Book Ch. 3 · New Project, Run, and note", line: 'out prn "One"',
      content: {
        story: ["Open English++ Studio, click New Project, pick Console App, and leave the Form box on English++ — the one that says three words on every line. Give it a name like MyFirstProgram and click Create.",
          "The Studio writes main.epp for you. Press F5 (or the Run button) and look at the Output panel at the bottom: your words are there.",
          "A line that starts with note is for people. The computer skips it, so notes can say anything at all — what the program is for, or something to remember.", "Save your work", "Press Ctrl+S to save your program. The Studio also saves it each time you run it, so your work won't get lost.", "Saving means your program is kept in its file, so you can close the Studio and come back to it tomorrow.", "Get into the habit: write a few lines, save, and carry on."],
        big: "New Project → Console App → F5; lines run in order, and note lines are for people.",
        caption: "The lines run from top to bottom; the note is skipped. Tap Play.",
        demo: ["note This program counts to two.", "out prn 1", "note Now the second one.", "out prn 2"]
      },
      deep: {
        more: ["A program can have as many lines as you like. Each one runs after the one above it, so moving lines around changes what happens first.",
          "Build .exe (Ctrl+Shift+B) turns your program into a Windows program of its own that runs without the Studio.", "Ctrl+S saves your work, and the Studio saves it when you run, too."],
        ex: { code: src(["note This program counts to two.", "out prn 1", "note Now the second one.", "out prn 2"]),
          walk: ["Line 1: a note — skipped.", "Line 2: prints 1.", "Line 3: a note — skipped.", "Line 4: prints 2."] },
        mistake: "Putting the lines in the wrong order. The computer does exactly what the lines say, in exactly the order they're written."
      } },
{ title: "The Three Words", chapter: "English++ Book Ch. 4 · who · root · what, now, @ and &", line: ["now wfv now", "c is a+b"],
      content: {
        story: ["Every line has three spots. The first is who — the thing the line is about. The middle is the root — what happens. The last is what — the value or thing it uses. A line with more or fewer words is a mistake.",
          "Spaces split a line into words, so math is written with no spaces: c is a+b is three words, but c is a + b is five. Text in quote marks is one word, spaces and all.",
          "When a spot has nothing to say, fill it with now. now wfv now means while forever: it needs no who and no what. Lines moved in by two spaces belong to the line above them, and the block ends where they stop moving in."],
        big: "Three spots on every line; now fills an empty spot; @ reaches in and & hands values.",
        caption: "Each line splits into who, the root and what. Tap Play.",
        demo: ["x · is · 6", "c · is · a+b", "now · wfv · now", "out · prn · scores@0"]
      },
      deep: {
        more: ["English++ has none of C++'s marks: no curly brackets (move lines in instead), no round brackets, no commas (use &), no semicolons and no colons.",
          "Two marks do the work inside a word. @ reaches in — read it as of or at: scores@0, rex@speed. & gives values — read it as with or and: add_up&1&2, 90&72&85."],
        ex: { code: src(["n is 0", "now wfv now", "  n add 1", "  now ebk n==3", "out prn n"]),
          walk: ["Line 1: n starts at 0.", "Line 2: now wfv now — repeat forever the lines moved in under it.", "Line 3: add 1 to n each time round.", "Line 4: break out of the loop when n is 3.", "Line 5: prints 3."] },
        mistake: "Spaces around math marks. c is a + b has five words, and the Studio says: This line has 5 words. Every line has exactly 3."
      } },
{ title: "How to Read a Root", chapter: "English++ Book Ch. 5 · 21 families, and jobs", line: ["scores lso now", "out prn cso&v"],
      content: {
        story: ["Every root has three letters, and you can read one you have never seen. The first letter is the family: a is arithmetic, c is collection, d is define, f is for, i is if, l is list, m is make, n is number, t is text, w is while — 21 families in all.",
          "The other two letters are the job, and a job means the same thing in every family. so is sort, so lso sorts a list and cso gives a sorted copy. rv is reversed: lrv, crv, trv. mx is the biggest: nmx, cmx.",
          "Six jobs compare two things and you'll use them all the time: eq equal, ne not equal, lt less than, le less or equal, gt greater than, ge greater or equal. ilt is if less than, wgt is while greater than, olt is otherwise if less than."],
        big: "The first letter of a root is its family and the other two are its job — so you can read words you've never met.",
        caption: "A family letter and a job snap together into a root. Tap Play.",
        demo: ["l (list) + so (sort) → lso", "c (collection) + so → cso", "i (if) + gt → igt", "w (while) + gt → wgt"]
      },
      deep: {
        more: ["There is no j, q, v, y or z family. You don't need them.",
          "The chart is frozen: a root never changes what it means, so what you learn stays true. New roots may be added, but old ones never change."],
        ex: { code: src(["scores is 3&1&2", "tidy is cso&scores", "out prn tidy", "out prn scores", "scores lso now", "out prn scores"]),
          walk: ["Line 1: a list of three numbers.", "Lines 2–3: cso — collection, sort — gives a sorted copy: [1, 2, 3].", "Line 4: the list itself is unchanged: [3, 1, 2].", "Lines 5–6: lso — list, sort — sorts the list itself: [1, 2, 3]."] },
        mistake: "Mixing up the c and l families. c roots ask about a collection and leave it alone; l roots change it."
      } },
{ title: "Names and Values", chapter: "English++ Book Ch. 6 · is, mak, mkn and the kinds", line: ["score is 7", "score mak num"],
      content: {
        story: ["A name is a box with a label. is puts a value in it: age is 7. English++ works out the kind from the value — 7 is a whole number, 2.5 is a decimal, \"Ada\" is a text, 'A' is a letter, yes is a yes or no.",
          "mak makes an empty box of a kind you choose: score mak num makes a whole number that starts at 0. The kinds have short names: num, big, sml, pos, byt, dec, flo, txt, ltr and yno.",
          "A box keeps its kind. Put 6.0 in a box that holds a decimal and it stays a decimal. mkn makes a constant — LIMIT mkn 100 — and a constant can never change."],
        big: "is gives a name a value, mak makes an empty box of a kind, and mkn makes one that never changes.",
        caption: "Five boxes, five kinds: a number, a decimal, a text, a letter and a yes or no. Tap Play.",
        demo: ["age is 7", "price is 2.5", "name is \"Ada\"", "first is 'A'", "ready is yes"]
      },
      deep: {
        more: ["Names can be as long as you like: letters, digits and _, starting with a letter. score_total is one name.",
          "num&, dec&, txt&, ltr& and yno& turn a value into another kind: num&2.9 is 2, txt&42 is the text 42, and yno&0 is nay."],
        ex: { code: src(["age is 7", "price is 2.5", "name is \"Ada\"", "first is 'A'", "ready is yes", "out prn age", "out prn price", "out prn name", "out prn first", "out prn ready"]),
          walk: ["Lines 1–5: five boxes of five kinds.", "Lines 6–10: print each one: 7, 2.5, Ada, A and yes."] },
        mistake: "Changing a constant. LIMIT mkn 100 and later LIMIT add 1 stops the Studio: a constant can never change."
      } },
{ title: "Printing", chapter: "English++ Book Ch. 7 · prn, put, @ in text, and &", line: ['out prn "@name is @age years old."', "out prn name&age"],
      content: {
        story: ["prn prints and goes to the next line. put prints and stays on the same line, so the next thing printed lands right after it.",
          "@ inside a text swaps a name for its value: \"Hi @name\" prints Hi Ada. It reaches further too: \"The first score is @scores@0.\" To print a real @, write @@.",
          "& joins values, and prn prints them with a space between: out prn name&age prints Ada 36.", "Neat columns", "Two text words help you line things up.", "tfx shows a decimal with the number of places you choose: tfx&price&2 shows 2.50, with two places after the point.", 'tpa pads a text with spaces, so it fills a width: tpa&"Ada"&6 makes Ada six letters wide, with spaces after it.', "Put them together and your numbers line up in tidy columns, like a shop receipt."],
        big: "prn prints a line, put stays on it, @name fills in a value, and & prints several values with spaces.",
        caption: "put keeps the line going; prn finishes it. Tap Play.",
        demo: ["out put \"Score: \"", "out prn 1", "out prn \"@name is @age years old.\"", "out prn name&age"]
      },
      deep: {
        more: ["Text can hold \\n to start a new line in the middle, so one prn can print two lines.",
          "err prn prints to the error channel instead of the screen's normal output — the place for messages about something going wrong.", "tfx picks how many places a decimal shows, and tpa pads a text to a width."],
        ex: { code: src(["name is \"Ada\"", "age is 36", "out put \"Name: \"", "out prn name", "out prn \"@name is @age.\"", "out prn name&age&\"years\"", "out prn \"Mail me @@ home.\"", "", "price is 2.5", "out prn tfx&price&2", 'name is tpa&"Ada"&6', 'out prn "[@name]"']),
          walk: ["Lines 1–2: two boxes.", "Lines 3–4: put and prn share a line: Name: Ada.", "Line 5: Ada is 36.", "Line 6: three values with spaces: Ada 36 years.", "Line 7: @@ prints one @: Mail me @ home.", "Line 9: price is 2.5 — a decimal.", "Line 10: out prn tfx&price&2 — print it with 2 places after the point: 2.50.", 'Line 11: name is tpa&"Ada"&6 — pad Ada with spaces, so it is 6 letters wide.', 'Line 12: out prn "[@name]" — print it in square brackets, so you can see the spaces: [Ada   ].'] },
        mistake: "Forgetting the space at the end of a put. out put \"Score:\" and then out prn 1 prints Score:1."
      } },
{ title: "Math", chapter: "English++ Book Ch. 8 · add asb aml adv amd, + - * / %, n roots", line: ["x add 5", "total is a+b"],
      content: {
        story: ["The a family changes a number in place: add, asb (subtract), aml (multiply), adv (divide), amd (remainder) and apw (power). x add 5 adds 5 to x.",
          "Math in one word uses + - * / %, with no spaces. Times and divide come before plus and minus, just like in school, so a+b*2 works out b*2 first.",
          "A whole number divided by a whole number stays whole: 7/2 is 3. Use a decimal, like 7.0/2, to keep the part after the point. The n family works out numbers: nsq&16 is the square root, nmx&a&b the bigger one, nra&1&6 a random number.", "Rounding", "There are four ways to turn a decimal into a whole number.", "nro rounds to the nearest whole number: nro&2.5 is 3.", "ndn rounds down, and nup rounds up: ndn&2.9 is 2, and nup&2.1 is 3.", "nwh takes the whole part and drops the rest: nwh&-2.9 is -2.", "Keeping a number in bounds", "nkb keeps a number between two others.", "nkb&5&0&10 is 5, because 5 is already between 0 and 10.", "nkb&50&0&10 is 10, because 50 is too big, so it is pulled back to 10.", "nkb&-2&0&10 is 0, because -2 is too small. It is great for keeping a player on the screen.", "Shapes and angles", "Most of these are for when you draw things or move things around. You don't need them until you do.", "Angles are in radians: a half turn is npi radians, which is about 3.14.", "ncr is the cube root: ncr&27 is 3, because 3 times 3 times 3 is 27.", "nhy is the longest side of a right-angled triangle: nhy&3&4 is 5.", "nsn, nco and ntn are sine, cosine and tangent, and nas, nac and nat are their opposites. nep is e, nlg is the log, and nlx is the log to base 10.", "Working with bits", "Inside the computer, every whole number is made of bits: tiny switches that are on or off.", "6 is 110 in bits: on, on, off. And 3 is 011: off, on, on.", "The rest of the a family works on the bits directly: and keeps the bits that are on in both, aor keeps the bits that are on in either, and axr keeps the bits that are on in exactly one.", "asl moves the bits left, which makes the number bigger, and asr moves them right. ant flips every bit."],
        big: "a roots change a number in place; + - * / % work it out in one word; whole numbers divide to whole numbers.",
        caption: "x grows and shrinks as each a root changes it. Tap Play.",
        demo: ["x is 10", "x add 5 → 15", "x asb 3 → 12", "x aml 2 → 24", "x adv 4 → 6"]
      },
      deep: {
        more: ["% is the remainder: 17%5 is 2. n%2 is 0 for even numbers and 1 for odd ones.",
          "now rsd 7 sets the seed of the random numbers, so nra gives the same ones every run — handy for testing.", "nro rounds, ndn rounds down, nup rounds up, and nwh keeps the whole part.", "nkb keeps a number between two others — too big becomes the top, too small becomes the bottom.", "npi is pi, ncr is the cube root, nhy is the longest side, and the rest are sines, cosines and logs.", "and, aor, axr, asl, asr and ant work on the bits of a number, one switch at a time."],
        ex: { code: src(["x is 10", "x add 5", "out prn x", "x asb 3", "out prn x", "x aml 2", "out prn x", "x adv 4", "out prn x", "out prn 7/2", "out prn 7.0/2", "out prn 7%2", "", "out prn nro&2.5", "out prn ndn&2.9", "out prn nup&2.1", "out prn nwh&-2.9", "", "out prn nkb&5&0&10", "out prn nkb&50&0&10", "out prn nkb&-2&0&10", "", "out prn npi", "out prn ncr&27", "out prn nhy&3&4", "out prn nsn&0", "out prn nco&0", "out prn ntn&0", "out prn nas&0", "out prn nac&1", "out prn nat&0", "out prn nep&0", "out prn nlg&1", "out prn nlx&100", "", "x is 6", "x and 3", "out prn x", "x is 6", "x aor 3", "out prn x", "x is 6", "x axr 3", "out prn x", "x is 6", "x asl 2", "out prn x", "x is 6", "x asr 1", "out prn x", "x ant 0", "out prn x"]),
          walk: ["Lines 1–3: 15.", "Lines 4–5: 12.", "Lines 6–7: 24.", "Lines 8–9: 6.", "Line 10: whole numbers: 3.", "Line 11: a decimal: 3.5.", "Line 12: the remainder: 2.", "Line 14: out prn nro&2.5 — round 2.5 to the nearest whole number: 3.", "Line 15: out prn ndn&2.9 — round 2.9 down: 2.", "Line 16: out prn nup&2.1 — round 2.1 up: 3.", "Line 17: out prn nwh&-2.9 — keep the whole part of -2.9: -2.", "Line 19: out prn nkb&5&0&10 — 5 is between 0 and 10 already, so it stays 5.", "Line 20: out prn nkb&50&0&10 — 50 is too big, so it becomes 10.", "Line 21: out prn nkb&-2&0&10 — -2 is too small, so it becomes 0.", "Line 23: out prn npi — pi: 3.14159.", "Line 24: out prn ncr&27 — the cube root of 27: 3.", "Line 25: out prn nhy&3&4 — the longest side of a triangle with sides 3 and 4: 5.", "Line 26: out prn nsn&0 — sine of 0: 0.", "Line 27: out prn nco&0 — cosine of 0: 1.", "Line 28: out prn ntn&0 — tangent of 0: 0.", "Line 29: out prn nas&0 — arcsine of 0: 0.", "Line 30: out prn nac&1 — arccosine of 1: 0.", "Line 31: out prn nat&0 — arctangent of 0: 0.", "Line 32: out prn nep&0 — e to the power of 0: 1.", "Line 33: out prn nlg&1 — the log of 1: 0.", "Line 34: out prn nlx&100 — the log to base 10 of 100: 2.", "Line 36: x is 6 — 6 in bits is 110.", "Line 37: x and 3 — keep the bits that are on in both 110 and 011: 010, which is 2.", "Line 38: out prn x — prints 2.", "Line 39: x is 6 — start again at 6.", "Line 40: x aor 3 — keep the bits that are on in either: 111, which is 7.", "Line 41: out prn x — prints 7.", "Line 42: x is 6 — start again at 6.", "Line 43: x axr 3 — keep the bits that are on in exactly one: 101, which is 5.", "Line 44: out prn x — prints 5.", "Line 45: x is 6 — start again at 6.", "Line 46: x asl 2 — move the bits two places left: 11000, which is 24.", "Line 47: out prn x — prints 24.", "Line 48: x is 6 — start again at 6.", "Line 49: x asr 1 — move the bits one place right: 11, which is 3.", "Line 50: out prn x — prints 3.", "Line 51: x ant 0 — flip the bits of 0. Every bit was off, so now every bit is on, which is -1.", "Line 52: out prn x — prints -1."] },
        mistake: "Expecting 7/2 to be 3.5. Two whole numbers give a whole answer; write 7.0/2."
      } },
{ title: "Text", chapter: "English++ Book Ch. 9 · +, @position, and the t family", line: ['whole is first+" "+last', "out prn tuc&t"],
      content: {
        story: ["+ joins texts: first+\" \"+last makes Ada Lovelace. The space in the middle sits inside quote marks, so the whole join is still one word.",
          "A text is a row of letters, and @ reaches in by position, from 0: word@0 is the first letter.",
          "The t family works with text: tsz the size, tuc uppercase, tlc lowercase, ths has, tbg begins with, ted ends with, tps the position of, trp replaced, tcu part of, tsp split.", "Finding patterns", "Sometimes you don't want a certain word. You want any word shaped a certain way — any number, or anything that looks like an email.", "A pattern describes the shape. This kind of pattern is also called a regular expression.", 'tmt asks if a text matches a pattern: tmt&"a2"&"[0-9]+" is yes, because a2 has a digit in it.', 'tma finds all the matches: tma&t&"[0-9]+" gives [2, 10].', 'trx replaces by pattern: trx&t&"[0-9]+"&"some" turns every number into the word some.'],
        big: "+ joins text, @ reaches a letter by position, and t roots ask about or change a text.",
        caption: "Two names snap together with a space between. Tap Play.",
        demo: ["first is \"Ada\"", "last is \"Lovelace\"", "whole is first+\" \"+last", "Output: Ada Lovelace"]
      },
      deep: {
        more: ["tps gives -1 when the text isn't there, so tps&t&\"z\" is -1 for a t without a z.",
          "txt&42 turns a number into text so it can be joined with +; tnm&\"42\" turns text back into a number.", "tmt tests a pattern, tma finds every match, and trx replaces by pattern."],
        ex: { code: src(["t is \"Hello\"", "out prn tsz&word", "out prn t@0", "out prn tuc&t", "out prn ths&t&\"lo\"", "out prn tbg&t&\"He\"", "out prn tps&t&\"l\"", "out prn trp&t&\"World\"&\"You\"", "", 'out prn tmt&"a2"&"[0-9]+"', 'out prn tmt&"ab"&"[0-9]+"', 'out prn tmt&"a2"&"^[0-9]+$"', 't is "I have 2 cats and 10 fish"', 'out prn tma&t&"[0-9]+"', 'out prn trx&t&"[0-9]+"&"some"']),
          walk: ["Line 2: 5 letters.", "Line 3: the first letter, H.", "Line 4: HELLO.", "Line 5: yes, it has lo.", "Line 6: yes, it begins with He.", "Line 7: the first l is at 2.", "Line 8: HeLLo.", 'Line 10: out prn tmt&"a2"&"[0-9]+" — does a2 match the pattern [0-9]+, which means one or more digits? Yes.', 'Line 11: out prn tmt&"ab"&"[0-9]+" — ab has no digits, so nay.', "Line 12: out prn tmt&\"a2\"&\"^[0-9]+$\" — ^ means the start of the text, and $ means the end. This asks for digits from the start to the end, and a2 doesn't have that, so nay.", 'Line 13: t is "I have 2 cats and 10 fish" — a text with two numbers in it.', 'Line 14: out prn tma&t&"[0-9]+" — find all the numbers: [2, 10].', 'Line 15: out prn trx&t&"[0-9]+"&"some" — replace every number with some: I have some cats and some fish.'] },
        mistake: "Joining a number to text with +. \"Age: \"+age stops the Studio; write \"Age: \"+txt&age or \"Age: @age\"."
      } },
{ title: "Yes, No and Tests", chapter: "English++ Book Ch. 10 · yes, nay, == != < > && || !", line: ["old_enough is age>=6", "out prn age>5&&tall"],
      content: {
        story: ["A test gives back a yes or no. age>=6 is yes when age is 6 or more. The marks are == (equal), != (not equal), <, <=, > and >=.",
          "Tests join with && (and: both must be yes) and || (or: one is enough). ! flips a yes or no: !tall is nay when tall is yes.",
          "A yes or no prints as yes or nay. Texts compare too: \"apple\"<\"pear\" is yes, because a comes before p."],
        big: "Comparisons give yes or nay, and && || ! join and flip them.",
        caption: "Each test lights up yes or nay. Tap Play.",
        demo: ["age>=6 → yes", "age==8 → nay", "age>5&&tall → yes", "!tall → nay"]
      },
      deep: {
        more: ["A test can be kept in a box: old_enough is age>=6. Then old_enough can be used anywhere a yes or no goes.",
          "yno&0 is nay and yno&5 is yes: any number but 0 counts as yes."],
        ex: { code: src(["age is 7", "tall is yes", "old_enough is age>=6", "out prn old_enough", "out prn age==8", "out prn age>5&&tall", "out prn age>9||tall", "out prn !tall"]),
          walk: ["Line 4: yes.", "Line 5: nay.", "Line 6: both are yes: yes.", "Line 7: one is yes: yes.", "Line 8: nay."] },
        mistake: "Writing = for a test. A test is ==, and = isn't an English++ mark at all."
      } },
{ title: "If and Otherwise", chapter: "English++ Book Ch. 11 · i family, o family, oth, bsw", line: ["x ilt 3", "now oth now"],
      content: {
        story: ["The i family asks a question: x igt 3 means if x is greater than 3, do the lines moved in under it. ieq, ine, ilt, ile, igt and ige cover every comparison.",
          "The o family is otherwise, and comes right after an if: olt asks a second question only when the first said no. now oth now catches all the other times.",
          "When one value is checked against many, bsw is neater: day bsw now, then a now bcs 6&7 line for each case and now bdf now for the rest.", "Bigger tests", "You can put a whole test in the first spot, with ieq yes to ask if it passes.", 'x>3&&name=="Ada" ieq yes asks: is x more than 3 AND is the name Ada?', "x%2 ieq 0 asks: is x even? If the test passes, the lines underneath run."],
        big: "i asks, o asks again, oth catches the rest, and bsw picks by value.",
        caption: "Only one door opens: the first test that says yes. Tap Play.",
        demo: ["x ilt 2 → no", "x olt 5 → yes", "Output: medium"]
      },
      deep: {
        more: ["An if and its otherwise lines are one choice: only the first one whose test passes runs.",
          "Lines moved in can hold more ifs. Each level moves in two more spaces.", "Put a whole test first and add ieq yes to ask if it passes."],
        ex: { code: src(["x is 4", "x ilt 2", "  out prn \"small\"", "x olt 5", "  out prn \"medium\"", "now oth now", "  out prn \"large\"", "day is 6", "day bsw now", "  now bcs 6&7", "    out prn \"the weekend\"", "  now bcs 1", "    out prn \"Monday\"", "  now bdf now", "    out prn \"a work day\"", "", "x is 6", 'name is "Ada"', 'x>3&&name=="Ada" ieq yes', '  out prn "both"', "x%2 ieq 0", '  out prn "even"']),
          walk: ["Lines 1–7: 4 isn't less than 2, but it is less than 5, so: medium.", "Lines 8–15: day is 6, which matches the case 6&7: the weekend.", "Line 17: x is 6 — a number.", 'Line 18: name is "Ada" — a text.', 'Line 19: x>3&&name=="Ada" ieq yes — is x more than 3 and is the name Ada? Yes, so the next line runs.', 'Line 20: out prn "both" — prints both.', "Line 21: x%2 ieq 0 — is x even? 6 divided by 2 leaves 0, so yes.", 'Line 22: out prn "even" — prints even.'] },
        mistake: "Putting a line between an if and its otherwise. The otherwise line must come straight after the if block."
      } },
{ title: "Loops", chapter: "English++ Book Ch. 12 · f family, w family, wfv, ebk, enx, bdo", line: ["i flt 5", "d wgt 2"],
      content: {
        story: ["The f family counts. i flt 3 runs the lines under it with i as 0, 1 and 2. fle includes the limit, and fgt counts down: count is 3, then count fgt 0 goes 3, 2, 1. If the name already has a value, counting starts there.",
          "fea walks through a collection: n fea scores. The w family repeats while a test passes — lives wgt 0 — and now wfv now repeats forever.",
          "now ebk now breaks out of a loop and now enx now skips to the next turn. Either can take a test: now ebk n==3. now bdo now runs its lines once first, and a u line after it says when to stop."],
        big: "f counts, fea walks, w repeats while, wfv repeats forever — ebk leaves and enx skips.",
        caption: "The counter moves along; the loop stops at the limit. Tap Play.",
        demo: ["count is 3", "count fgt 0", "3 · 2 · 1", "Blast off!"]
      },
      deep: {
        more: ["ebk and enx can name a loop: a ebk now leaves the loop counting with a, even from inside another loop.",
          "A do block always runs at least once: now bdo now, the lines, then n uge 6 — until n is 6 or more."],
        ex: { code: src(["count is 3", "count fgt 0", "  out prn count", "out prn \"Blast off!\"", "total is 0", "n fea 4&5&6", "  total add n", "out prn total", "i is 0", "n wlt 100", "  i add 3", "out prn i"]),
          walk: ["Lines 1–4: 3, 2, 1, then Blast off!.", "Lines 5–8: walk 4, 5 and 6, adding each: 15.", "Lines 9–12: add 3 while i is below 10: 12."] },
        mistake: "A while loop where nothing changes. lives wgt 0 with no lives asb 1 inside runs forever."
      } },
{ title: "More Ways With Text", chapter: "English++ Book Ch. 13 · tre, tct, tdg, tlr, tws, tfa, ttp", line: ['out prn tre&"ha"&3', 'out prn tfa&"{} has {} points"&name&score'],
      content: {
        story: ["Text can do a few more tricks, all in the t family. They give you an answer and leave your text alone. tre repeats a text: tre&\"ha\"&3 is hahaha. tct counts how many times a small piece is in a bigger text.",
          "Three words ask about one letter: tlr asks if it's a letter, tdg if it's a digit, and tws if it's white space, like a space. Walk through a text with fea and you can sort out its letters.",
          "tfa fills in a pattern. Each {} is a hole, and the values go in, in order: tfa&\"{} has {} points\"&name&score. A hole can say how it wants its value to look: {:.2f} keeps two places after the point, and {:>5} lines it up on the right in five spaces. ttp tells you what kind a thing is, as text."],
        big: "tre repeats, tct counts, tdg tlr tws ask about a letter, tfa fills in a pattern, and ttp names a kind.",
        caption: "The holes in a pattern fill up with values. Tap Play.",
        demo: ["tre&\"ha\"&3 → hahaha", "tct&\"la la la\"&\"la\" → 3", "tfa&\"{} has {} points\"&\"Ada\"&9", "→ Ada has 9 points"]
      },
      deep: {
        more: ["tfa uses the same pattern language as C++'s std::format, so a pattern you learn here works in C++ too.",
          "ttp&5 is num and ttp&\"hi\" is txt — handy when a function takes any kind and you want to know which one it got."],
        ex: { code: src(["out prn tre&\"ha\"&3", "song is \"la la la\"", "out prn tct&song&\"la\"", "s is \"Room 12\"", "digits is 0", "c fea s", "  tdg&c ieq yes", "    digits add 1", "out prn digits", "name is \"Ada\"", "score is 9", "out prn tfa&\"{} has {} points\"&name&score", "out prn tfa&\"[{:>5}]\"&42", "out prn ttp&x"]),
          walk: ["Line 1: hahaha.", "Lines 2–3: la is there 3 times.", "Lines 4–9: Room 12 has 2 digits.", "Lines 10–12: Ada has 9 points.", "Line 13: 42 lined up on the right in five spaces: [   42].", "Line 14: score is a num."] },
        mistake: "Giving tfa fewer values than holes. Every {} needs a value to put in it."
      } },
{ title: "Talking With Your Program", chapter: "English++ Book Ch. 14 · get", line: ['name get "Name? "', "guess mak num"],
      content: {
        story: ["get shows a question, waits for the person to type an answer and press Enter, and keeps it in the name in the first spot: name get \"Name? \".",
          "The box's kind says what to get. Make it first — age mak num — and get wants a number. A text box takes anything.",
          "Put a space at the end of the question, so the answer doesn't touch it.", "Getting a whole line", "get reads one word. So if you ask for a name and somebody types Ada Lovelace, you only get Ada.", "gln means get a line. It reads the whole line, spaces and all.", 'story gln "Tell me something: " reads a whole sentence into story.', "Reading until there's no more", "wln means while there are lines. It repeats once for every line it can read.", "This is how you read lots of input.", "In the Studio, the keyboard never runs out, so press Shift+F5 to stop this program. This matters most with files, as you'll see in the chapter called Files.", "A small conversation", "Here's all of that working together: ask a name, ask an age, and answer in a way that fits.", "If the age is less than 13, the program says you're still a kid. Otherwise it works out how many years ago you stopped being one."],
        big: "get asks, waits, and keeps the answer — of the kind the box already holds.",
        caption: "The program asks, and the answer lands in the box. Tap Play.",
        demo: ["name get \"Name? \"", "Name? Sam", "out prn \"Hi @name!\"", "Hi Sam!"]
      },
      deep: {
        more: ["A yes or no box takes yes or nay. Anything else, and the Studio asks again.",
          "wln reads lines one at a time until there are no more: line wln inp.", "gln reads a whole line, spaces and all — get reads one word only.", "wln repeats once for every line there is to read.", "Ask, read, choose, and answer — a whole conversation in a few lines."],
        ex: { answers: ["Sam", "9"], code: src(["name mak txt", "age mak num", "name get \"Name? \"", "age get \"Age? \"", "out prn \"Hi @name!\"", "age add 1", "out prn \"Next year you'll be @age.\"", "", 'story gln "Tell me something: "', 'out prn "You said: @story"', "", "line wln inp", "  out prn tuc&line", "", 'name get "What is your name? "', "age mak num", 'age get "How old are you? "', "age ilt 13", "  out prn \"Hi, @name! You're still a kid.\"", "now oth now", "  years is age-13", '  out prn "Hi, @name! You stopped being a kid @years years ago."']),
          walk: ["Lines 1–2: a text box and a number box.", "Line 3: Name? — Sam is typed.", "Line 4: Age? — 9 is typed, and kept as a number.", "Line 5: Hi Sam!", "Lines 6–7: Next year you'll be 10.", 'Line 9: story gln "Tell me something: " — ask, and read the whole line the person types.', 'Line 10: out prn "You said: @story" — print it back: You said: I like cats a lot.', "Line 12: line wln inp — while there are lines from the keyboard, read one into line.", "Line 13: out prn tuc&line — print it in uppercase. Type one and it prints ONE; type two and it prints TWO.", 'Line 15: name get "What is your name? " — ask for a name.', "Line 16: age mak num — make a number box for the age.", 'Line 17: age get "How old are you? " — ask for the age.', "Line 18: age ilt 13 — if the age is less than 13...", "Line 19: out prn \"Hi, @name! You're still a kid.\" — print the kid's greeting.", "Line 20: now oth now — otherwise...", "Line 21: years is age-13 — work out how many years past 13.", "Line 22: out prn \"Hi, @name! You stopped being a kid @years years ago.\" — for Ada, 36, that's 23 years ago."] },
        mistake: "Getting a number into a text box. \"9\"+1 isn't 10; make the box with mak num first."
      } },
{ title: "Watching Your Program Run", chapter: "English++ Book Ch. 15 · Watching Your Program Run", line: "total add i+1",
      content: {
        story: ["Sometimes your program runs but does the wrong thing.",
          "Here is a program that should add 0, 1, 2, 3, 4 and 5. The answer should be 15. But it prints 10.",
          "The mistake is hard to see: i flt 5 counts 0, 1, 2, 3, 4 — it never reaches 5. So the 5 is never added.",
          "Instead of staring at it, you can watch the program run. The Studio has a debugger for that."],
        big: "The debugger lets you watch your program run, one line at a time.",
        caption: "Follow the numbers as your program runs — the debugger shows you every value.",
        demo: ["total is 0", "i flt 5", "total add i", "out prn total", "→ 10 — not 15!", "total add i+1", "→ 15"]
      },
      deep: {
        more: ["Press F9 on a line to put a red dot there — that's a breakpoint. The program stops there each time it reaches the line.",
          "Press F6 to start. The program stops at the first breakpoint. The line it is on lights up, and a bar at the bottom shows the names and the values.",
          "F10 runs one line, so you can see the values change. When a value changes, it shows in bold.",
          "F11 steps into a function, and Shift+F11 runs the rest of the function. The call stack shows how you got there.",
          "Press Ctrl+F5 to run with no build, using the Reader. It is much slower, but fine for a small program."],
        ex: { code: src(["total is 0", "i flt 5", "  total add i", "out prn total"]),
          walk: ["Line 1: total is 0 — start with nothing in total.",
          "Line 2: i flt 5 — count from 0 up to 4. The loop never reaches 5.",
          "Line 3: total add i — add i to the total.",
          "Line 4: out prn total — prints 10, not 15. Put a breakpoint on line 3, and the Debug panel shows total going 0, 1, 3, 6, 10. That's how you see that 5 is never added."] },
        mistake: "Don't guess at a wrong answer. Set a breakpoint, watch the values change, and the bug will show itself."
      } },
{ title: "Project: Guess the Number", chapter: "English++ Book Ch. 16 · a whole game, step by step", line: ["secret is nra&1&100", "guess ilt secret"],
      content: {
        story: ["The computer picks a secret number and you try to guess it. Build it a step at a time, and run it after every step.",
          "Pick the number with nra&1&100. Make the guess box with guess mak num so get knows it wants a number. Then three things can happen: too low (ilt), too high (ogt) or right (oth).",
          "Keep asking with now wfv now, leave with now ebk now when the guess is right, and count the tries with tries add 1. When testing, set secret to 42 so it doesn't change every run."],
        big: "A real game from a loop, an if, an otherwise and a counter.",
        caption: "Too high, too low, right! — in three tries. Tap Play.",
        demo: ["Your guess? 50 · Too high", "Your guess? 25 · Too low", "Your guess? 42", "Right, in 3 tries!"]
      },
      deep: {
        more: ["now rsd 3 makes the random numbers the same every run, so you can test the real game. Take it out to play for real.",
          "A good next step: tell the player how far off they are, or stop after ten tries."],
        ex: { answers: ["50", "25", "42"], code: src(["secret is 42", "tries is 0", "guess mak num", "now wfv now", "  guess get \"Your guess? \"", "  tries add 1", "  guess ilt secret", "    out prn \"Too low\"", "  guess ogt secret", "    out prn \"Too high\"", "  now oth now", "    out prn \"Right, in @tries tries!\"", "    now ebk now"]),
          walk: ["Lines 1–3: the secret, a counter, and a number box.", "Lines 4–6: ask, and count each try.", "Lines 7–13: too low, too high, or right — and then leave the loop.", "With 50, 25 and 42: Too high, Too low, Right, in 3 tries!"] },
        mistake: "Making the guess box inside the loop. Make it once, before the loop starts."
      } },
{ title: "Lists", chapter: "English++ Book Ch. 17 · 1&2&3, vec@num, @position, l family", line: ["scores is 90&72&85", "v add 4"],
      content: {
        story: ["A list keeps many values in order. scores is 90&72&85 makes one, and it prints as [90, 72, 85]. An empty one is made with scores mak vec@num — a vector of numbers.",
          "@ reaches an item by position, from 0: scores@0 is the first. Put a position in the who spot to change one: scores@1 is 75. A position past the end stops the program with a plain message on that line.",
          "add puts an item on the end. The l family changes a list: lin inserts, lrm removes a value, ldx removes a position, lpl pops the last, lso sorts and lrv reverses.", "Changing a list", "Four more l words change a list.", "lsu shuffles a list, like a deck of cards: cards lsu now mixes the cards up, so what it prints is different each time.", "lfl fills every spot with one value: v lfl 7 makes every item 7.", "luq drops the repeats: after v luq now, each value is in there only once.", "lrs changes how many spots a list has: v lrs 5 makes it 5 long, and the new spots start at 0."],
        big: "A list holds values in order; @ reaches by position from 0; add grows it and l roots change it.",
        caption: "Items slide into numbered slots, starting at 0. Tap Play.",
        demo: ["v is 5&3&9", "v add 4 → [5, 3, 9, 4]", "v lin 0&8 → [8, 5, 3, 9, 4]", "v lrm 3 → [8, 5, 9, 4]"]
      },
      deep: {
        more: ["fea walks a list item by item, and changing the item inside the walk changes the list: s fea scores, then s aml 10.",
          "cct&scores is how many items a list has, so i flt cct&scores walks every position.", "lsu shuffles, lfl fills, luq drops repeats, and lrs changes the size."],
        ex: { code: src(["v is 5&3&9", "v add 4", "out prn v", "v lin 0&8", "out prn v", "v lrm 3", "out prn v", "v ldx 0", "out prn v", "v lpl now", "out prn v", "out prn scores@0", "", "v is 1&2&3", "v lfl 7", "out prn v", "v lrs 5", "out prn v", "v lrs 2", "out prn v"]),
          walk: ["Lines 1–3: [5, 3, 9, 4].", "Lines 4–5: 8 goes in at 0: [8, 5, 3, 9, 4].", "Lines 6–7: the 3 is removed: [8, 5, 9, 4].", "Lines 8–9: position 0 is removed: [5, 9, 4].", "Lines 10–11: the last is popped: [5, 9].", "Line 12: 5.", "Line 14: v is 1&2&3 — a list of three numbers.", "Line 15: v lfl 7 — fill every spot with 7.", "Line 16: out prn v — prints [7, 7, 7].", "Line 17: v lrs 5 — make it 5 long. The new spots start at 0.", "Line 18: out prn v — prints [7, 7, 7, 0, 0].", "Line 19: v lrs 2 — make it 2 long.", "Line 20: out prn v — prints [7, 7]."] },
        mistake: "Counting positions from 1. In a list of three, the last one is @2, and @3 stops the program."
      } },
{ title: "Asking a List", chapter: "English++ Book Ch. 18 · cct csm cmx cmn cav chs cps cso", line: ["out prn cct&scores", "out prn cmx&v"],
      content: {
        story: ["The c family asks a collection a question and leaves it as it was. cct is how many, csm the sum, cmx the biggest, cmn the smallest and cav the average.",
          "chs asks if a value is there (yes or nay), chm how many times, and cps where — -1 when it isn't there. cfr and cla are the first and the last.",
          "cso gives a sorted copy and crv a reversed one, while the list itself stays put. ctx joins the items into one text, with the text you give between them.", "More answers from a list", "Four more c words ask a list things.", "cpd multiplies every item together: cpd&v is 48 for 2, 4 and 6.", "cme is the middle value when the list is in order, and cde is how spread out the numbers are.", "cra picks one at random — perfect for games. Each time you run it, it may pick a different one."],
        big: "c roots ask a list how many, how much, which and where — and never change it.",
        caption: "The list answers questions, and stays just as it was. Tap Play.",
        demo: ["cct&v → 4", "csm&v → 25", "cmx&v → 9", "chs&v&7 → nay"]
      },
      deep: {
        more: ["The average is a decimal even for whole numbers: cav of 1 and 2 is 1.5.",
          "ctx&names&\", \" makes Ada, Bob, Cy — the text in the last spot goes between the items, not after the last one.", "cpd multiplies, cme is the middle, cde is the spread, and cra picks one at random."],
        ex: { code: src(["v is 5&9&2&9", "out prn cct&v", "out prn csm&v", "out prn cmx&v", "out prn cmn&v", "out prn chm&v&9", "out prn cps&v&9", "out prn cso&v", "out prn v", "names is \"Ada\"&\"Bob\"&\"Cy\"", "out prn ctx&names&\", \"", "", "v is 2&4&9", "out prn cav&v", "out prn cme&v", "w is 2&4&6", "out prn cde&w"]),
          walk: ["Lines 2–5: 4 items, a sum of 25, 9 at the most and 2 at the least.", "Line 6: 9 is there twice: 2.", "Line 7: 2 is at position 2.", "Line 8: a sorted copy: [2, 5, 9, 9].", "Line 9: the list is unchanged: [5, 9, 2, 9].", "Lines 10–11: Ada, Bob, Cy.", "Line 13: v is 2&4&9 — a list of three numbers.", "Line 14: out prn cav&v — the average: 5.", "Line 15: out prn cme&v — the middle value: 4.", "Line 16: w is 2&4&6 — another list.", "Line 17: out prn cde&w — how spread out the numbers are: 1.63299."] },
        mistake: "Expecting cso to sort the list itself. cso gives a copy; use scores lso now to sort the list."
      } },
{ title: "Maps", chapter: "English++ Book Ch. 19 · map@txt@num, @key, k&v fea", line: ["ages mak map@txt@num", 'ages@"Ada" is 36'],
      content: {
        story: ["A map finds a value by its key, like a dictionary finds a meaning by its word. ages mak map@txt@num makes a map from texts to numbers.",
          "@ with a key reaches in: ages@\"Ada\" is 36 files 36 under Ada, and ages@\"Ada\" reads it back. A map prints in key order: {Ada: 36, Bob: 41}.",
          "Reading a key that isn't there adds it, with 0 — which makes counting easy: counts@word add 1. Ask first with chs&ages&\"Zed\" when you don't want that.", "Taking one out", "lrm removes a key from a map.", 'ages lrm "Ada" takes Ada out of the map, and cct counts the keys that are left.', "lwp wipes them all: after ages lwp now, the map is empty.", "A faster map", "hsh is another kind of map, called a hash map.", "It is usually faster when it gets big. But it keeps its keys in no special order.", "So use map, unless your program is too slow. Everything else works the same: you put things in with @, and ask with chs."],
        big: "A map keeps values under keys, in key order; @key reads or writes, and a missing key is added.",
        caption: "Each name opens its own drawer. Tap Play.",
        demo: ["ages@\"Ada\" is 36", "ages@\"Bob\" is 41", "ages → {Ada: 36, Bob: 41}", "ages@\"Ada\" → 36"]
      },
      deep: {
        more: ["Walking a map names both parts: k&v fea ages gives each key and its value, in key order.",
          "cct&ages is how many keys there are, and ages lwp now wipes them all.", "lrm takes one key out of a map, and lwp wipes them all.", "hsh is a faster map that keeps its keys in no special order."],
        ex: { code: src(["counts mak map@txt@num", "text is \"the cat and the dog and the fish\"", "word fea twd&text", "  counts@word add 1", "out prn counts", "name&age fea ages", "  v igt 1", "    out prn \"@k: @v\"", "", 'ages is map&"Ada"&36', 'ages add "Bob"&41', 'ages lrm "Ada"', "out prn ages", "out prn cct&ages", "ages lwp now", "out prn ages", "", "ages mak hsh@txt@num", 'ages@"Ada" is 36', 'out prn ages@"Ada"', 'out prn chs&ages&"Ada"']),
          walk: ["Lines 1–2: an empty map and a text.", "Lines 3–4: twd splits the text into words; each one counts itself.", "Line 5: {and: 2, cat: 1, dog: 1, fish: 1, the: 3}.", "Lines 6–8: the words seen more than once: and: 2, then the: 3.", 'Line 10: ages is map&"Ada"&36 — a map with Ada in it.', 'Line 11: ages add "Bob"&41 — add Bob.', 'Line 12: ages lrm "Ada" — take Ada out.', "Line 13: out prn ages — prints {Bob: 41}.", "Line 14: out prn cct&ages — how many keys are left? 1.", "Line 15: ages lwp now — wipe them all.", "Line 16: out prn ages — prints {}.", "Line 18: ages mak hsh@txt@num — make a hash map from texts to numbers.", 'Line 19: ages@"Ada" is 36 — put Ada in.', 'Line 20: out prn ages@"Ada" — prints 36.', 'Line 21: out prn chs&ages&"Ada" — is Ada in there? Yes.'] },
        mistake: "Reading a key to check for it. ages@\"Zed\" adds Zed with 0; ask chs&ages&\"Zed\" instead."
      } },
{ title: "Other Collections", chapter: "English++ Book Ch. 20 · set, bag, lst, stk, que, hep", line: ["seen mak set@txt", "plates mak stk@num"],
      content: {
        story: ["A set keeps each thing once, in order: add cat twice and it still holds one. It prints with curly marks: {cat, dog}. A bag is a set that keeps no order and is quick to ask.",
          "A stack is a pile of plates: the last one on is the first one off. A queue is a line at a shop: first in, first served. hep is a priority queue that always gives the biggest first.",
          "lst is a linked list, handy for adding and taking at both ends: lpf pops the first and lpl the last.", "Array: a size that never changes", "An arr holds a set number of things, and that number never changes.", "You put its kind first, and then its size: arr@num@7 is an array of 7 numbers.", "It starts filled with zeros. days@0 is 5 puts 5 in the first spot.", "Pair: two things", "A par holds two things. You reach them with first and second.", "par& makes one: par&3&4 is a pair of 3 and 4.", 'You can also make one with mak and set its parts: named@first is "Ada" and named@second is 36.', "Tuple: a few things", "A tup holds as many things as you like, of any kinds.", "To open one up, give each part a name, joined with &: name&age&ok is person.", "You'll see this again soon, when a function gives back two answers at once.", "Maybe: a value that may not be there", "Sometimes there's no answer. If you search for a word and it isn't there, what do you give back?", "An opt can hold a value, or it can hold nothing at all. nil means nothing.", "found@value gives you the value, and found@value_or&0 gives you 0 when there is nothing there.", "opt& makes one straight away: x is opt&7.", "One of several kinds", "An alt holds one value, which can be any of the kinds you list.", "thing mak alt@num@txt is a thing that can be a number or a text.", "thing@txt says the text in thing. If it holds a number at the time, your program stops and says so.", "Adding at both ends", "A normal list is slow at adding to its front. Everything has to shuffle along to make room.", "A dqu is quick at both ends. lin puts a value at a position: line lin 0&1 puts 1 at the front.", "lpf pops the first one. A lst is the same idea, but you can't reach a position in it with @ — you have to walk through it."],
        big: "Pick the collection that matches the job: set for once each, stk for a pile, que for a line.",
        caption: "cat is added twice, but the set keeps one. Tap Play.",
        demo: ["seen add \"cat\"", "seen add \"dog\"", "seen add \"cat\"", "seen → {cat, dog}"]
      },
      deep: {
        more: ["chs works on every collection, and on a set or a bag it's especially quick.",
          "Every collection walks the same way: x fea seen.", "An arr has a size that never changes, and starts filled with zeros.", "A par holds two things, reached with @first and @second.", "A tup holds a few things of any kinds, and you open it with names joined by &.", "An opt holds a value or nothing at all — nil means nothing.", "An alt holds one value that can be any of the kinds you list.", "A dqu is quick at both ends, and lin puts a value at a position."],
        ex: { code: src(["seen mak set@txt", "seen add \"cat\"", "seen add \"dog\"", "seen add \"cat\"", "out prn seen", "out prn cct&seen", "out prn chs&seen&\"dog\"", "seen lrm \"cat\"", "out prn seen", "", "days mak arr@num@7", "days@0 is 5", "out prn days", "out prn cct&days", "", "spot is par&3&4", "out prn spot", "out prn spot@first", "out prn spot@second", "named mak par@txt@num", 'named@first is "Ada"', "named@second is 36", "out prn named", "", 'person is tup&"Ada"&36&yes', "name&age&ok is person", "out prn name", "out prn age", "out prn ok", "", "found mak opt@num", "found ieq nil", '  out prn "nothing yet"', "out prn found@value_or&0", "found is 7", "found ine nil", "  out prn found@value", "", "thing mak alt@num@txt", "thing is 5", "out prn thing", 'thing is "five"', "out prn thing", "out prn thing@txt", "", "line mak dqu@num", "line add 2", "line add 3", "line lin 0&1", "out prn line", "line lpf now", "out prn line", "out prn line@0"]),
          walk: ["Lines 1–5: the second cat isn't kept: {cat, dog}.", "Line 6: 2.", "Line 7: yes.", "Lines 8–9: {dog}.", "Line 11: days mak arr@num@7 — make an array of 7 numbers.", "Line 12: days@0 is 5 — put 5 in the first spot.", "Line 13: out prn days — prints [5, 0, 0, 0, 0, 0, 0].", "Line 14: out prn cct&days — how many spots? 7.", "Line 16: spot is par&3&4 — make a pair of 3 and 4.", "Line 17: out prn spot — prints (3, 4).", "Line 18: out prn spot@first — prints 3.", "Line 19: out prn spot@second — prints 4.", "Line 20: named mak par@txt@num — make a pair of a text and a number.", 'Line 21: named@first is "Ada" — put Ada in the first spot.', "Line 22: named@second is 36 — put 36 in the second spot.", "Line 23: out prn named — prints (Ada, 36).", 'Line 25: person is tup&"Ada"&36&yes — make a tuple of a text, a number, and a yes or no.', "Line 26: name&age&ok is person — open it up into three names.", "Line 27: out prn name — prints Ada.", "Line 28: out prn age — prints 36.", "Line 29: out prn ok — prints yes.", "Line 31: found mak opt@num — make a maybe-number. It starts with nothing in it.", "Line 32: found ieq nil — is it nothing? Yes, so the next line runs.", 'Line 33: out prn "nothing yet" — prints nothing yet.', "Line 34: out prn found@value_or&0 — print the value, or 0 if there is none: 0.", "Line 35: found is 7 — now it holds 7.", "Line 36: found ine nil — is it not nothing? Yes.", "Line 37: out prn found@value — prints 7.", "Line 39: thing mak alt@num@txt — make a thing that can be a number or a text.", "Line 40: thing is 5 — put 5 in it.", "Line 41: out prn thing — prints 5.", 'Line 42: thing is "five" — now put five in it, as a text.', "Line 43: out prn thing — prints five.", "Line 44: out prn thing@txt — say the text in thing: five.", "Line 46: line mak dqu@num — make a deque of numbers.", "Line 47: line add 2 — add 2.", "Line 48: line add 3 — add 3.", "Line 49: line lin 0&1 — put 1 at position 0, at the front.", "Line 50: out prn line — prints [1, 2, 3].", "Line 51: line lpf now — pop the first one off.", "Line 52: out prn line — prints [2, 3].", "Line 53: out prn line@0 — the first one now is 2."] },
        mistake: "Using a list when each thing should be there once. A set does the checking for you."
      } },
{ title: "Functions", chapter: "English++ Book Ch. 21 · dfn, dpm, ert, f&1&2, now f", line: ["add_up dfn num", "add_up ert a+b"],
      content: {
        story: ["A function is a little program with a name. add_up dfn num defines one that gives back a whole number. Its dpm lines say what it takes — a dpm num — and ert hands the answer back: add_up ert a+b.",
          "Use it with &: add_up&1&2 is 3, anywhere a value goes. A function that gives back nothing says now in the last spot, and runs on a line of its own: now hello \"Ada\".",
          "A function can be written below the lines that use it. Its boxes are its own: a name inside it is a different box from the same name outside.", "Leaving early", "ert leaves the function straight away.", "In a function that gives back nothing, write ert now.", 'In check_age, a child under 13 hears "Too young." and the function ends there — it never reaches "Welcome!".', "Boxes everyone can see", "mgl makes a global: one box that every function can see.", "Put it at the top level, not inside a function.", "score mgl 0 makes a box called score that starts at 0, and score_up adds to it each time it runs.", "A second name for a box", "mrf gives a box a second name. Both names mean the same box.", "also mrf x makes also a second name for x. also add 1 changes x too.", "mlo does the same, but the second name can only look: peek mlo x lets you read x through peek, but you can't change it that way.", "Two answers at once", "A function can give back two things or more. Say so with tup@, then give each answer a name when you use it.", "divide dfn tup@num@num gives back two numbers: the whole part and the rest.", "q&r is divide&17&5 opens the two answers up into q and r: 3, with 2 left over.", "A function that uses itself", "A function can run itself. It's called recursion.", "It has to have a way to stop, or it would go on forever.", "factorial&5 is 5 times factorial&4, which is 4 times factorial&3, and so on down to 1. The answer is 120.", "When you get it wrong", "The Studio checks every function and every use of it, before anything runs.", "Too few values, or too many: out prn add_up&1 gives add_up only one value, but it takes two.", 'The wrong kind of value: out prn add_up&1&"two" hands it text where it wants a number.', "Forgetting to give something back: a function that promises a number must end with ert. And your names can't be the same as a root."],
        big: "dfn names a job, dpm says what it takes, ert gives the answer back, and & runs it.",
        caption: "1 and 2 go in; add_up hands 3 back. Tap Play.",
        demo: ["add_up&1&2", "a is 1 · b is 2", "add_up ert a+b", "→ 3"]
      },
      deep: {
        more: ["A parameter can have a starting value instead of a kind — y dpm 1 — so it can be left out when the function is run.",
          "A parameter is a copy. To change the caller's box, take a reference: n dpm ref@num.", "ert leaves a function straight away, and in a function that gives nothing back it is ert now.", "mgl makes a global box that every function can see.", "mrf gives a box a second name, and mlo gives a second name that can only look.", "tup@ lets a function give back two answers at once, and & opens them up.", "Recursion is a function that runs itself — and it must have a way to stop.", "The Studio catches function mistakes before anything runs: wrong count, wrong kind, or a missing answer."],
        ex: { code: src(["x is add_up&1&2", "y is add_up&x&10", "out prn y", "now hello \"Ada\"", "", "add_up dfn num", "  a dpm num", "  b dpm num", "  add_up ert a+b", "", "hello dfn now", "  who dpm txt", "  out prn \"Hello, @who!\"", "", "now check_age 5", "now check_age 20", "check_age dfn now", "  age dpm num", "  age ilt 13", '    out prn "Too young."', "    check_age ert now", '  out prn "Welcome!"', "", "now score_up 2", "now score_up 3", "out prn score", "score mgl 0", "score_up dfn now", "  n dpm num", "  score add n", "", "x is 1", "also mrf x", "also add 1", "out prn x", "peek mlo x", "x add 1", "out prn peek", "", "q&r is divide&17&5", 'out prn "@q, with @r left over"', "divide dfn tup@num@num", "  a dpm num", "  b dpm num", "  whole is a/b", "  rest is a%b", "  divide ert whole&rest", "", "out prn factorial&5", "factorial dfn num", "  n dpm num", "  n ile 1", "    factorial ert 1", "  smaller is factorial&n-1", "  factorial ert n*smaller", "", "out prn add_up&1", "add_up dfn num", "  a dpm num", "  b dpm num", "  add_up ert a+b"]),
          walk: ["Line 1: x is 3.", "Lines 2–3: y is 13.", "Line 4: Hello, Ada!.", "Lines 6–9: add_up takes two numbers and gives back their sum.", "Lines 11–13: hello takes a text and gives back nothing.", "Line 15: now check_age 5 — run check_age with 5.", "Line 16: now check_age 20 — run it again with 20.", "Line 17: check_age dfn now — define check_age, which gives back nothing.", "Line 18: age dpm num — it takes age, a number.", "Line 19: age ilt 13 — if age is less than 13...", 'Line 20: out prn "Too young." — print Too young.', "Line 21: check_age ert now — leave the function right here. Welcome! never prints for a 5-year-old.", 'Line 22: out prn "Welcome!" — for 20, the test fails, so this line runs: Welcome!', "Line 24: now score_up 2 — add 2 to the score.", "Line 25: now score_up 3 — add 3.", "Line 26: out prn score — prints 5.", "Line 27: score mgl 0 — the global box, starting at 0.", "Line 28: score_up dfn now — define score_up.", "Line 29: n dpm num — it takes n.", "Line 30: score add n — add n to the score.", "Line 32: x is 1 — a box called x holds 1.", "Line 33: also mrf x — give x a second name, also.", "Line 34: also add 1 — add 1 through the second name. x is 2 now, too.", "Line 35: out prn x — prints 2.", "Line 36: peek mlo x — give x a look-only second name, peek.", "Line 37: x add 1 — add 1 to x. Now x is 3.", "Line 38: out prn peek — peek can only look, and it sees 3.", "Line 40: q&r is divide&17&5 — run divide with 17 and 5, and put the two answers in q and r.", 'Line 41: out prn "@q, with @r left over" — prints 3, with 2 left over.', "Line 42: divide dfn tup@num@num — define divide, which gives back two numbers.", "Line 43: a dpm num — it takes a.", "Line 44: b dpm num — it takes b.", "Line 45: whole is a/b — 17 divided by 5 is 3.", "Line 46: rest is a%b — the remainder is 2.", "Line 47: divide ert whole&rest — give back both.", "Line 49: out prn factorial&5 — print factorial of 5: 120.", "Line 50: factorial dfn num — define factorial, which gives back a number.", "Line 51: n dpm num — it takes n.", "Line 52: n ile 1 — if n is 1 or less...", "Line 53: factorial ert 1 — give back 1. That's the way out.", "Line 54: smaller is factorial&n-1 — work out factorial of one less.", "Line 55: factorial ert n*smaller — give back n times that.", "Line 57: out prn add_up&1 — run add_up with only 1. But add_up takes two values.", "Line 58: add_up dfn num — define add_up.", "Line 59: a dpm num — it takes a.", "Line 60: b dpm num — it takes b.", "Line 61: add_up ert a+b — give back a+b. The Studio stops you before anything runs: too few values."] },
        mistake: "Forgetting ert. A function that says it gives back a num must reach an ert line, or the Studio stops it."
      } },
{ title: "Functions in a Name", chapter: "English++ Book Ch. 22 · dlm, lambdas", line: ["twice dlm num", "out prn twice&21"],
      content: {
        story: ["dlm makes a function that lives in a name — a lambda. twice dlm num, with its dpm and ert lines moved in under it, is a function called twice made right there, in the middle of the program.",
          "It's run like any function: twice&21 is 42. Because it's a name, it can be handed to other functions.",
          "cft keeps the items a function says yes to, and cmp runs a function on every item: cft&scores&big, cmp&scores&twice.", "The kind of a function", "Functions have a kind too. It's fun@.", "After it comes the kind it gives back, and then the kinds it takes: fun@num@txt means a function that gives a number and takes a text.", "With it, a box can hold a function, or a parameter can take one: say_size mak fun@num@txt holds sizer.", 'run_twice takes a function as a parameter and runs it twice: once with "one" and once with "three".'],
        big: "dlm makes a function in a name, right where you need it.",
        caption: "21 goes into twice and 42 comes out. Tap Play.",
        demo: ["twice dlm num", "  n dpm num", "  twice ert n*2", "twice&21 → 42"]
      },
      deep: {
        more: ["A lambda can use the boxes around it. dlv makes one that keeps copies of them, so it still works after they're gone.",
          "A function that gives back yes or no is a test you can name: big dlm yno.", "fun@ is the kind of a function — what it gives back, then what it takes."],
        ex: { code: src(["twice dlm num", "  n dpm num", "  twice ert n*2", "out prn twice&21", "half dlm num", "  n dpm num", "  half ert n/2", "x is twice&5", "out prn half&x", "", "say_size mak fun@num@txt", "sizer dlm num", "  s dpm txt", "  sizer ert tsz&s", "say_size is sizer", 'out prn say_size&"hello"', "out prn run_twice&sizer", "run_twice dfn num", "  f dpm fun@num@txt", '  a is f&"one"', '  b is f&"three"', "  run_twice ert a+b"]),
          walk: ["Lines 1–4: twice&21 is 42.", "Lines 5–7: a second lambda, half.", "Lines 8–9: twice&5 is 10, and half of that is 5.", "Line 11: say_size mak fun@num@txt — make a box that holds a function giving a number and taking a text.", "Line 12: sizer dlm num — make a small function called sizer, giving a number.", "Line 13: s dpm txt — it takes s, a text.", "Line 14: sizer ert tsz&s — give back how many letters s has.", "Line 15: say_size is sizer — put sizer in the box.", 'Line 16: out prn say_size&"hello" — run it with hello: 5.', "Line 17: out prn run_twice&sizer — hand sizer to run_twice: 8.", "Line 18: run_twice dfn num — define run_twice.", "Line 19: f dpm fun@num@txt — it takes f, a function.", 'Line 20: a is f&"one" — run f with one: 3.', 'Line 21: b is f&"three" — run f with three: 5.', "Line 22: run_twice ert a+b — give back 3+5, which is 8."] },
        mistake: "Running two functions in one word. half&twice&5 hands both twice and 5 to half; a word holds one run, so use two lines."
      } },
{ title: "Lists and Functions Together", chapter: "English++ Book Ch. 23 · cea can cnn crl czp cnu ccu crg cbf cgr cjn lrw lss mhp", line: ["out prn cea&scores&passed", "out prn crl&v&1&times"],
      content: {
        story: ["Once a function is kept in a name, you can hand it to a list, and the list uses it to answer harder questions. cea asks if each one passes, can if any does, and cnn if none does. crl rolls a list up: it starts with a value and rolls each item into it with your function.",
          "czp zips two lists together, so you get one from each at a time: n&a fea czp&names&ages. cnu numbers each item from 0. cun, cbt and cot give what's in either list, in both, or only in the first. ccu cuts out part of a list, and crg makes one by counting, with a step if you like.",
          "In a sorted list, cbf finds a value by halves, like a word in a dictionary, and cpb says where. cgr groups items by a label your function gives them, and cjn joins a list of lists into one. lrw rotates a list, lss sorts it and keeps ties in their order, and mhp makes a heap with the smallest on top."],
        big: "Hand a function to a list and it answers: does each pass, does any, what does it roll up to — and lists can be zipped, cut, counted and grouped.",
        caption: "Each score meets the test, and the list answers. Tap Play.",
        demo: ["passed: n>80", "cea&scores&passed → nay", "can&scores&passed → yes", "crl&2&3&4 from 1 with times → 24"]
      },
      deep: {
        more: ["The function goes in by its name, with no &: cea&scores&passed. With & after it, passed& would run it instead.",
          "cft keeps the items a function says yes to, and cmp runs a function on every item: both give back a new list."],
        ex: { code: src(["scores is 70&85&92", "passed dlm yno", "  n dpm num", "  passed ert n>80", "out prn cea&scores&passed", "out prn can&scores&passed", "out prn cft&v&big", "v is 2&3&4", "times dlm num", "  a dpm num", "  b dpm num", "  times ert a*b", "out prn crl&v&1&times", "names is \"Ada\"&\"Bo\"", "ages is 10&12", "n&a fea czp&names&ages", "  out prn \"@who is @age\"", "out prn crg&0&10&2", "out prn ccu&v&1&2"]),
          walk: ["Lines 1–4: a test: is it above 80?", "Lines 5–7: not each one passes (nay), but one does (yes): [85, 92].", "Lines 8–13: 1 times 2 times 3 times 4: 24.", "Lines 14–17: Ada is 10, then Bo is 12.", "Line 18: [0, 2, 4, 6, 8].", "Line 19: two items from position 1: [3, 4]."] },
        mistake: "Writing cea&scores&passed& with an & after the function. The function goes in by its name alone."
      } },
{ title: "More About Functions", chapter: "English++ Book Ch. 24 · any number of values, msv, dlv, dcx, gnr, eyd, bdr", line: ["n msv 0", "now bdr now"],
      content: {
        story: ["If a function's last parameter is a list, it takes all the values left over, so you can hand it as many as you like: add_all&1&2&3&4. msv makes a name that stays between calls; it starts only once, on the first call.",
          "A function in a name can see the names around it. dlm uses those names themselves; dlv takes its own copies when it's made, so what it does stays inside it. dcx makes a function C++ can work out while it builds your program.",
          "A generator hands out one value at a time, and only runs as far as you ask: its kind is gnr@num, and eyd hands over a value and waits. bdr is a block that runs when the block around it ends, however it ends — so the cleaning up sits right next to the setting up."],
        big: "Functions can take any number of values, remember between calls, keep their own copies, hand out values one at a time, and clean up after themselves.",
        caption: "tick remembers its count between calls. Tap Play.",
        demo: ["tick& → 1", "tick& → 2", "tick& → 3", "n msv 0 starts only once"]
      },
      deep: {
        more: ["A generator can describe something endless — all the even numbers — because it only runs when a fea asks for one more.",
          "Several bdr blocks run in the opposite order to how they were written: the last one in is the first one out."],
        ex: { code: src(["out prn add_all&1&2&3&4", "out prn add_all&5", "out prn tick&", "out prn tick&", "n fea evens&", "  out prn n", "  n igt 4", "    now ebk now", "now bdr now", "  out prn \"this comes last\"", "out prn \"this comes first\"", "", "add_all dfn num", "  xs dpm vec@num", "  add_all ert csm&xs", "", "tick dfn num", "  n msv 0", "  n add 1", "  tick ert n", "", "evens dfn gnr@num", "  i is 0", "  now wfv now", "    evens eyd i", "    i add 2"]),
          walk: ["Lines 1–2: the leftover values make a list: 10, then 5.", "Lines 3–4: n stays between calls: 1, then 2.", "Lines 5–8: the generator hands out 0, 2, 4, 6, and the walk stops after 6.", "Lines 9–11: this comes first, then — as the program ends — this comes last."] },
        mistake: "Expecting a dlv lambda to change the names around it. It changes its own copies; use dlm for that."
      } },
{ title: "Checks and Tests", chapter: "English++ Book Ch. 25 · s family, bts", line: ["x seq 3", 'now bts "adding small numbers"'],
      content: {
        story: ["The s family is should. x seq 3 means x should equal 3: if it doesn't, the program stops right there and says which line. sne, slt, sle, sgt and sge cover the rest.",
          "A check catches a mistake the moment it happens, instead of three screens later when something prints the wrong thing.",
          "now bts \"adding small numbers\" names a test. The Studio's Run Tests runs every test, and each should line in it must hold."],
        big: "s lines check that something is true and stop the program on the line where it isn't.",
        caption: "Each check passes, and the program carries on. Tap Play.",
        demo: ["x is 3", "x seq 3 ✓", "x sgt 2 ✓", "All the checks passed."]
      },
      deep: {
        more: ["Put checks where a mistake would hurt: before a division, after reading a file, at the start of a function.",
          "Tests live beside the program, and Run Tests reports which ones failed and on which line."],
        ex: { code: src(["x is 3", "x seq 3", "x sgt 2", "a is 2", "a sne 3", "a sle 2", "out prn \"All the checks passed.\""]),
          walk: ["Lines 1–3: x equals 3 and is greater than 2.", "Lines 4–6: a isn't 3, and is 2 or less.", "Line 7: All the checks passed."] },
        mistake: "Using a check for something a person types. A check stops the program; ask again with a loop instead."
      } },
{ title: "Your Own Kinds of Things", chapter: "English++ Book Ch. 26 · dcl, dfd, dmk, a@age, a bark now", line: ["Dog dcl now", "age dfd 3"],
      content: {
        story: ["dcl defines a class: your own kind of thing. The lines under it say what each one has — fields, made with dfd — and what each one can do — functions, made with dfn.",
          "a mak Dog makes one. Reach inside with @: a@name is \"Rex\". Ask it to do something with its name, then the job: a bark now. Printed, it shows every field: Dog(name: Rex, age: 3).",
          "dmk is what runs when one is made, and its dpm lines take the values handed in: Dog&\"Rex\"&5. dsc makes a secret field that only the class's own lines can see.", "slf: this one", "slf means this very thing, the one the function is working on.", "It's useful when a parameter has the same name as a field.", "In slf@x is x, the slf@x means this thing's field, and the plain x means the parameter.", "Secrets", "Some things should be kept private. dsc makes a secret field.", "Only the class's own functions can use it, and it never prints.", "In Bank, money is a secret. The only way to change it is through pay_in, and pay_in makes sure the number is good.", "dhd makes a hidden function. It's the same idea: only the class's own functions can run it.", "Functions that promise not to change anything", "dkn makes a constant function. It promises not to change any field, and the Studio holds it to that.", "People reading your class can see at a glance that it's safe to call.", "area dkn num gives back w times h, and never changes anything.", "Things the whole class shares", "Usually each thing has its own fields. dsh makes a shared field: there's one for the whole class.", "Here it counts how many dogs have been made: every dmk adds 1 to made.", "dsf makes a shared function, which belongs to the class and not to any one thing. You reach both through the class's name: Dog@made and Dog@report&.", "The & on its own means run it. A shared function needs it when it takes no values.", "When a thing is destroyed", "dds runs by itself when a thing goes away. It's the opposite of dmk.", "Things go away when the block they were made in ends.", "This is very handy. You can't forget to clean up, because it happens by itself. A file that closes itself works this way.", "Comparing things", "Two things of the same kind compare with ==, and it checks every field.", "You don't have to write anything.", "Two dogs with the same age are equal. Change one dog's age, and they are not equal any more."],
        big: "dcl invents a kind; dfd is what it has, dfn what it can do, and dmk what happens when one is made.",
        caption: "One plan, two dogs, each with its own name. Tap Play.",
        demo: ["a mak Dog", "a@name is \"Rex\"", "a bark now", "Rex says woof!"]
      },
      deep: {
        more: ["Inside the class, its own fields are plain names: the bark function says @name, and it means this dog's name.",
          "Each thing made from a class has its own fields. Changing a@age doesn't touch b@age.", "slf means this very thing — its field, not the parameter with the same name.", "dsc makes a secret field and dhd a hidden function — only the class itself can use them.", "dkn is a function that promises not to change any field.", "dsh is a field shared by the whole class, and dsf is a function shared by the whole class.", "dds runs by itself when a thing goes away — the opposite of dmk.", "== compares two things of the same kind by checking every field."],
        ex: { code: src(["a mak Dog&\"Rex\"", "b mak Dog&\"Tom\"&5", "a bark now", "out prn a", "out prn b", "", "Dog dcl now", "  name dfd txt", "  age dfd 1", "  Dog dmk now", "    n dpm txt", "    y dpm 1", "    name is n", "    age is y", "  bark dfn now", "    out prn \"@name says woof!\"", "", "s mak Spot&3", "out prn s@x", "Spot dcl now", "  x dfd 0", "  Spot dmk now", "    x dpm num", "    slf@x is x", "", "acct mak Bank", "acct pay_in 50", "out prn acct@balance", "out prn acct", "Bank dcl now", '  owner dfd "Ada"', "  money dsc 0", "  pay_in dfn now", "    n dpm num", "    n igt 0", "      money add n", "  balance dfn num", "    balance ert money", "", "b mak Box", "out prn b@area", "Box dcl now", "  w dfd 2", "  h dfd 3", "  area dkn num", "    area ert w*h", "", "a mak Dog", "b mak Dog", "out prn Dog@made", "out prn Dog@report&", "Dog dcl now", "  made dsh 0", "  Dog dmk now", "    made add 1", "  report dsf txt", '    report ert "Dogs so far: "+txt&made', "", "now bbl now", "  t mak Torch", '  out prn "using it"', 'out prn "done"', "Torch dcl now", "  Torch dmk now", '    out prn "on"', "  Torch dds now", '    out prn "off"', "", "a mak Dog", "b mak Dog", "out prn a==b", "b@age is 9", "out prn a==b", "Dog dcl now", "  age dfd 3"]),
          walk: ["Lines 1–2: two dogs; the second is given an age.", "Line 3: a barks: Rex says woof!.", "Lines 4–5: Dog(name: Rex, age: 1) and Dog(name: Tom, age: 5).", "Lines 7–16: the plan: two fields, a maker, and a bark.", "Line 18: s mak Spot&3 — make a Spot with 3.", "Line 19: out prn s@x — print its x: 3.", "Line 20: Spot dcl now — define the class Spot.", "Line 21: x dfd 0 — it has a field x, starting at 0.", "Line 22: Spot dmk now — when one is made...", "Line 23: x dpm num — it takes x, a number.", "Line 24: slf@x is x — put the parameter x into this thing's field x.", "Line 26: acct mak Bank — make a bank account.", "Line 27: acct pay_in 50 — pay in 50.", "Line 28: out prn acct@balance — print the balance: 50.", "Line 29: out prn acct — print the whole account: Bank(owner: Ada). The secret money never prints.", "Line 30: Bank dcl now — define the class Bank.", 'Line 31: owner dfd "Ada" — it has a field owner.', "Line 32: money dsc 0 — and a secret field money, starting at 0.", "Line 33: pay_in dfn now — define pay_in.", "Line 34: n dpm num — it takes n.", "Line 35: n igt 0 — if n is more than 0...", "Line 36: money add n — add n to the money.", "Line 37: balance dfn num — define balance, which gives back a number.", "Line 38: balance ert money — give back the money.", "Line 40: b mak Box — make a box.", "Line 41: out prn b@area — print its area: 6.", "Line 42: Box dcl now — define the class Box.", "Line 43: w dfd 2 — it has a field w, starting at 2.", "Line 44: h dfd 3 — and a field h, starting at 3.", "Line 45: area dkn num — define area as a constant function giving a number.", "Line 46: area ert w*h — give back 2 times 3, which is 6.", "Line 48: a mak Dog — make a dog.", "Line 49: b mak Dog — make another dog.", "Line 50: out prn Dog@made — print the shared count: 2.", "Line 51: out prn Dog@report& — run the shared function: Dogs so far: 2.", "Line 52: Dog dcl now — define the class Dog.", "Line 53: made dsh 0 — a shared field, starting at 0.", "Line 54: Dog dmk now — when one is made...", "Line 55: made add 1 — add 1 to the shared count.", "Line 56: report dsf txt — define a shared function giving back a text.", 'Line 57: report ert "Dogs so far: "+txt&made — give back Dogs so far: 2.', "Line 59: now bbl now — open a block.", "Line 60: t mak Torch — make a torch inside it.", 'Line 61: out prn "using it" — prints using it.', 'Line 62: out prn "done" — prints done, after the torch has gone away.', "Line 63: Torch dcl now — define the class Torch.", "Line 64: Torch dmk now — when one is made...", 'Line 65: out prn "on" — print on.', "Line 66: Torch dds now — when one goes away...", 'Line 67: out prn "off" — print off. The order is: on, using it, off, done.', "Line 69: a mak Dog — make a dog.", "Line 70: b mak Dog — make another dog.", "Line 71: out prn a==b — are they the same? Both have age 3, so yes.", "Line 72: b@age is 9 — change b's age to 9.", "Line 73: out prn a==b — now they are different, so nay.", "Line 74: Dog dcl now — define the class Dog.", "Line 75: age dfd 3 — it has a field age, starting at 3."] },
        mistake: "Reaching for a field the class doesn't have. a@colour stops the Studio: a Dog has no colour."
      } },
{ title: "Children", chapter: "English++ Book Ch. 27 · Dog dcl Animal, dbs, dvr, dov", line: ["Dog dcl Animal", "now dbs given"],
      content: {
        story: ["Put a parent's name in the last spot of dcl and the new class is its child: Dog dcl Animal. A Dog has everything an Animal has and can do everything an Animal can, and adds its own.",
          "When a child is made, the parent part is made first. now dbs given hands values up to the parent's maker.",
          "dvr marks a function a child may do its own way, and dov is the child's own version. Each kind of animal can answer sound differently, and the right one is used every time.", "Family secrets", "A secret field can only be seen by its own class. Not even its children can see it.", "dfm makes a family field: its own class and all its children can use it, but nobody else can.", "dfy does the same for a function: rest dfy now can be run by the class and its children.", "In the example, Dog's report runs rest to add 1 to energy, and gives back 6."],
        big: "A child class gets everything its parent has; dbs makes the parent part, and dov redoes a job its own way.",
        caption: "The Animal part is made, then the Dog part. Tap Play.",
        demo: ["d mak Dog&\"Rex\"", "An animal is made.", "A dog is made.", "Dog(name: Rex, tricks: 0)"]
      },
      deep: {
        more: ["dmb is a job every child must do its own way — the parent only promises it.",
          "A child can have its own children: Puppy dcl Dog gets everything a Dog and an Animal have.", "dfm is a family field and dfy a family function — the class and its children can use them, nobody else can."],
        ex: { code: src(["d mak Dog&\"Rex\"", "d eat now", "out prn d", "", "Animal dcl now", "  name dfd txt", "  Animal dmk now", "    n dpm txt", "    name is n", "    out prn \"An animal is made.\"", "  eat dfn now", "    out prn \"@name is eating.\"", "", "Dog dcl Animal", "  tricks dfd 0", "  Dog dmk now", "    given dpm txt", "    now dbs given", "    out prn \"A dog is made.\"", "", "d mak Dog", "out prn d@report", "Animal dcl now", "  energy dfm 5", "  rest dfy now", "    energy add 1", "Dog dcl Animal", "  report dfn num", "    now rest now", "    report ert energy"]),
          walk: ["Line 1: An animal is made., then A dog is made..", "Line 2: eat comes from Animal: Rex is eating..", "Line 3: Dog(name: Rex, tricks: 0).", "Lines 5–12: Animal is the parent: a name, a maker that keeps the name, and eat.", "Lines 14–19: Dog is a child of Animal: it adds tricks, and its maker calls the parent's maker first.", "Line 21: d mak Dog — make a dog.", "Line 22: out prn d@report — print its report: 6.", "Line 23: Animal dcl now — define the class Animal.", "Line 24: energy dfm 5 — a family field energy, starting at 5.", "Line 25: rest dfy now — a family function rest.", "Line 26: energy add 1 — rest adds 1 to energy.", "Line 27: Dog dcl Animal — define Dog as a child of Animal.", "Line 28: report dfn num — define report, giving back a number.", "Line 29: now rest now — run rest, the family function. Energy becomes 6.", "Line 30: report ert energy — give back 6."] },
        mistake: "Forgetting now dbs in a child's maker when the parent's maker needs a value."
      } },
{ title: "More Kinds of Your Own", chapter: "English++ Book Ch. 28 · dst, den", line: ["Spot dst now", "Mood den happy&sad"],
      content: {
        story: ["dst is a struct: a simple class that just holds values together. Spot dst now with x dfd 0 and y dfd 0 under it is a point on a grid.",
          "A struct is made by handing its fields in order: a is Spot&1&2 sets x to 1 and y to 2. It prints the same way a class does: Spot(x: 1, y: 2).",
          "den makes a kind with a fixed list of choices: Mood den happy&sad&sleepy. A Mood can only ever be one of those.", "Unions", "You'll almost never need this one.", "dun makes a union. It looks like a struct, but all of its fields share the same memory.", "So it can only hold one at a time. It saves a tiny bit of memory, and programs that talk directly to hardware sometimes need it.", "It doesn't print by itself.", "Short names for kinds", "dal gives a kind a shorter name. It's the same kind, just easier to read. People call it an alias.", "Row dal vec@num says Row means a list of numbers.", "Grid dal vec@Row says Grid means a list of Rows — a grid of numbers.", "Math with your own kinds", "dop says what a math mark does to your own kind. Then you can add two Spots, just as if they were numbers.", "You can do this for + - * / % == != < > <= >=.", "If you make <, then a list of your things can be sorted: a list of Cards sorts by rank."],
        big: "dst holds values together; den gives a kind a fixed set of choices.",
        caption: "Two numbers travel together as one Spot. Tap Play.",
        demo: ["a is Spot&1&2", "Spot(x: 1, y: 2)", "a@y → 2", "a@x is 5"]
      },
      deep: {
        more: ["A struct is the right choice when a thing is just its values, with no jobs of its own.",
          "bsw works well with a den kind: one case for each choice.", "A dun is a union — all its fields share the same memory, so it holds only one at a time.", "dal gives a kind a shorter name — an alias.", "dop says what a math mark does to your own kind."],
        ex: { code: src(["a is Spot&1&2", "out prn a", "out prn a@y", "a@x is 5", "out prn a", "", "Spot dst now", "  x dfd 0", "  y dfd 0", "", "b mak Both", "b@whole is 65", "out prn b@whole", "Both dun now", "  whole dfd num", "  part dfd dec", "", "Row dal vec@num", "Grid dal vec@Row", "g mak Grid", "g add 1&2", "out prn g", "", "a is Spot&1&2", "b is Spot&3&4", "c is a+b", "out prn c", "Spot dst now", "  x dfd 0", "  y dfd 0", "  + dop Spot", "    o dpm see@Spot", "    r is Spot&x+o@x&y+o@y", "    + ert r"]),
          walk: ["Lines 1–2: Spot(x: 1, y: 2).", "Line 3: 2.", "Lines 4–5: Spot(x: 5, y: 2).", "Line 11: b mak Both — make a Both.", "Line 12: b@whole is 65 — put 65 in the whole field.", "Line 13: out prn b@whole — prints 65.", "Line 14: Both dun now — define the union Both.", "Line 15: whole dfd num — it has a field whole, a number.", "Line 16: part dfd dec — and a field part, a decimal. They share the same memory, so only one holds a value at a time.", "Line 18: Row dal vec@num — Row means a list of numbers.", "Line 19: Grid dal vec@Row — Grid means a list of Rows.", "Line 20: g mak Grid — make a grid.", "Line 21: g add 1&2 — add a row of 1 and 2.", "Line 22: out prn g — prints [[1, 2]].", "Line 24: a is Spot&1&2 — make a Spot at 1, 2.", "Line 25: b is Spot&3&4 — make a Spot at 3, 4.", "Line 26: c is a+b — add them.", "Line 27: out prn c — prints Spot(x: 4, y: 6).", "Line 28: Spot dst now — define the struct Spot.", "Line 29: x dfd 0 — it has a field x, starting at 0.", "Line 30: y dfd 0 — and a field y, starting at 0.", "Line 31: + dop Spot — say what + does to a Spot.", "Line 32: o dpm see@Spot — it takes o, the other Spot, to look at.", "Line 33: r is Spot&x+o@x&y+o@y — make a new Spot from the two x's and the two y's.", "Line 34: + ert r — give back r."] },
        mistake: "Handing a struct more values than it has fields."
      } },
{ title: "Any Kind", chapter: "English++ Book Ch. 29 · any, dtp", line: ["x dpm any", "T dtp now"],
      content: {
        story: ["Some jobs work the same for numbers, texts and anything else. x dpm any takes a value of any kind, and C++ works out the kind each time the function is used.",
          "T dtp now makes a kind that gets filled in later — a template. Lines under it can use T as a kind: a box of T, a list of T.",
          "Write the job once, and it works for every kind that can do what the lines ask."],
        big: "any and dtp let one function or class work for every kind.",
        caption: "The same function takes a number, then a text. Tap Play.",
        demo: ["now show 5", "It is: 5", "now show \"five\"", "It is: five"]
      },
      deep: {
        more: ["A kind filled in later still has to make sense: adding two things only works for kinds that can be added.",
          "A class can take a kind too: Box dst now under T dtp now holds a T, whatever T turns out to be."],
        ex: { code: src(["now show 5", "now show \"five\"", "now show 2.5", "", "show dfn now", "  x dpm any", "  out prn \"It is: @x\""]),
          walk: ["Lines 1–3: It is: 5, It is: five and It is: 2.5.", "Lines 5–7: one function for every kind."] },
        mistake: "Asking an any value for something only one kind can do, like tsz on a number."
      } },
{ title: "Pointers", chapter: "English++ Book Ch. 30 · mpt, mnw, msh, mwn, edl", line: ["p mpt x", "p mnw Torch"],
      content: {
        story: ["A pointer is a box that holds the place of another box. p mpt x makes p point at x, and *p is x itself: change *p and x changes.",
          "p mnw Torch makes a new Torch in memory and points p at it. Something made with mnw stays until now edl p deletes it.",
          "msh and mwn make pointers that tidy up after themselves: a shared one lasts while anyone still points at it, and an owned one belongs to one name. Most programs want those.", "Moving a pointer", "When you add an own pointer to a list, English++ moves it for you. That's what you saw in the Children chapter.", "mmv means move. After that, the old box holds nothing.", "mmv works on other things too. Moving a long list is much faster than copying it, because nothing has to be copied.", "A pointer to a number", "ptr@num means a pointer to a number.", "A new pointer starts as nil, so you can test for it: q ieq nil asks if q points at nothing.", "If you use a nil pointer, your program stops and tells you where."],
        big: "A pointer holds the place of a box; msh and mwn tidy up by themselves.",
        caption: "p points at x; change *p and x changes. Tap Play.",
        demo: ["x is 5", "p mpt x", "*p is 7", "x → 7"]
      },
      deep: {
        more: ["nil is a pointer that points at nothing. Ask before using one that might be nil.",
          "English++ leaves out moving a pointer with p add 1, a way to go wrong with no message. Use a position in a list instead, which is checked.", "mmv moves a thing — after that, the old box holds nothing.", "ptr@num is a pointer to a number, and a new pointer starts as nil."],
        ex: { studio: true, code: src(["x is 5", "p mpt x", "out prn *p", "*p is 7", "out prn x", "t msh Torch", "out prn t@lit", "", "Torch dcl now", "  lit dfd yes", "", "a mwn Torch", 'a@name is "big"', "b mmv a", "out prn b@name", "a ieq nil", '  out prn "a holds nothing now"', "", "q mak ptr@num", "q ieq nil", '  out prn "q points at nothing"', "x is 5", "q mpt x", "q ine nil", "  out prn *q"]),
          walk: ["Lines 1–3: 5.", "Lines 4–5: changing *p changes x: 7.", "Lines 6–7: a shared Torch: yes.", "Line 12: a mwn Torch — make a Torch owned by a.", 'Line 13: a@name is "big" — name it big.', "Line 14: b mmv a — move it into b.", "Line 15: out prn b@name — prints big.", "Line 16: a ieq nil — does a hold nothing now? Yes.", 'Line 17: out prn "a holds nothing now" — prints a holds nothing now.', "Line 19: q mak ptr@num — make a pointer to a number.", "Line 20: q ieq nil — does q point at nothing? Yes, so the next line runs.", 'Line 21: out prn "q points at nothing" — prints q points at nothing.', "Line 22: x is 5 — make a number.", "Line 23: q mpt x — point q at x.", "Line 24: q ine nil — does q point at something now? Yes.", "Line 25: out prn *q — print what q points at: 5."] },
        mistake: "Using a pointer after edl. The memory is gone; make it with msh and it can't happen."
      } },
{ title: "More Tricks for Your Classes", chapter: "English++ Book Ch. 31 · at dop, call dop, += dop, ptr@Dog&p, dbb, tkn", line: ["call dop num", "ready dbb 1"],
      content: {
        story: ["Your classes can act like the kinds that come with the language. An operator called at lets one be reached with @, like a list: rows@3. It gives back a reference, so you can change what's there too.",
          "An operator called call lets a thing be called with &: a&3. dop also takes += and the marks like it, and that's what add uses on your own kinds.",
          "ptr@Dog&p asks what a pointer to an Animal really points at: a pointer to the Dog, or nil if it isn't one. dbb makes a field that takes only a few bits. A parameter of kind tkn@Kept says hand me this thing to keep, so a class can say how it's moved."],
        big: "Operators let your own kinds be reached with @, called with &, and added to with add — just like the built-in ones.",
        caption: "A thing that remembers 5, called like a function. Tap Play.",
        demo: ["a mak Adder&5", "a&3", "call ert n+k", "→ 8"]
      },
      deep: {
        more: ["A field made with dbb saves room when there are lots of small things: ready dbb 1 holds one bit.",
          "Moving is faster than copying. mmv moves a thing, and a dmk that takes tkn@ says how."],
        ex: { code: src(["add5 mak Adder&5", "add10 mak Adder&10", "out prn add5&3", "out prn add10&3", "out prn add5", "", "Adder dst now", "  k dfd 0", "  call dop num", "    n dpm num", "    call ert n+k"]),
          walk: ["Lines 1–2: two Adders, one keeping 5 and one keeping 10.", "Lines 3–4: called like functions: 8, then 13.", "Line 5: printed as a thing: Adder(k: 5).", "Lines 7–11: call dop says what happens when it's called."] },
        mistake: "Writing call as a plain dfn. Only an operator made with dop lets a thing be called with &."
      } },
{ title: "Project: A Pet Shop", chapter: "English++ Book Ch. 32 · a class with jobs", line: ["Pet dcl now", "p feed 5"],
      content: {
        story: ["A pet that gets hungry while you wait, and full when you feed it. A Pet class has a name and a hunger, and two jobs: wait and feed.",
          "wait adds 2 to hunger. feed takes some food and takes it off the hunger — but never below 0, which nmx&hunger-food&0 makes sure of.",
          "Each Pet has its own hunger, so a shop can keep many."],
        big: "A class with fields and jobs makes something that changes as you use it.",
        caption: "Rex waits twice, gets hungry, then eats. Tap Play.",
        demo: ["p mak Pet&\"Rex\"", "p wait now · p wait now", "hunger → 4", "p feed 5 → 0"]
      },
      deep: {
        more: ["Keep many pets in a list: shop mak vec@Pet, then pet fea shop to visit each one.",
          "A next step: a pet that's too hungry says so — add an if to wait."],
        ex: { code: src(["p mak Pet&\"Rex\"", "p wait now", "p wait now", "out prn p@hunger", "p feed 5", "out prn p@hunger", "out prn p", "", "Pet dcl now", "  name dfd txt", "  hunger dfd 0", "  Pet dmk now", "    n dpm txt", "    name is n", "  wait dfn now", "    hunger add 2", "  feed dfn now", "    food dpm num", "    hunger is nmx&hunger-food&0"]),
          walk: ["Lines 1–4: two waits: 4.", "Lines 5–6: fed 5, and never below 0: 0.", "Line 7: Pet(name: Rex, hunger: 0)."] },
        mistake: "Letting hunger go below zero. nmx&hunger-food&0 keeps it at 0 or more."
      } },
{ title: "When Things Go Wrong", chapter: "English++ Book Ch. 33 · btr, bch, etw", line: ["now btr now", "e bch now"],
      content: {
        story: ["Some lines can go wrong: tnm&\"oops\" can't turn oops into a number. Put them under now btr now — try — and the program jumps to the catch instead of stopping.",
          "The catch comes straight after: e bch now catches the problem and calls it e, so \"caught: @e\" says what went wrong.",
          "etw throws a problem of your own: now etw \"An age can't be below zero.\" The nearest catch gets it — even one in the function that called yours.", "Ending the program yourself", "ext ends the program right away. Its third word is a number that the program gives back to whatever started it.", "0 means all went well, and anything else means something went wrong.", "Your whole program also gives back a number when it reaches the end. It's 0, unless you say otherwise with main ert 1."],
        big: "btr tries, bch catches the problem as e, and etw throws one of your own.",
        caption: "The problem jumps out of the try and lands in the catch. Tap Play.",
        demo: ["now btr now", "  n is tnm&\"not a number\"", "e bch now", "  caught: invalid stoi argument"]
      },
      deep: {
        more: ["A line after the one that went wrong, inside the try, doesn't run. The program goes on after the catch.",
          "now etw now inside a catch passes the same problem on to the next catch out.", "ext ends the program right away — 0 means all went well."],
        ex: { code: src(["now btr now", "  now set_age -3", "  out prn \"not reached\"", "e bch now", "  out prn \"caught: @e\"", "now set_age 7", "", "set_age dfn now", "  age dpm num", "  age ilt 0", "    now etw \"An age can't be below zero.\"", "  out prn \"Age set.\"", "", 'out prn "Bye."', "now ext 0", 'out prn "not reached"']),
          walk: ["Lines 1–5: set_age throws, so not reached is skipped: caught: An age can't be below zero.", "Line 6: Age set.", "Lines 8–12: the function checks its value and throws.", 'Line 14: out prn "Bye." — prints Bye.', "Line 15: now ext 0 — end the program right here, giving back 0.", 'Line 16: out prn "not reached" — this line never runs.'] },
        mistake: "Putting a line between the try block and e bch now. The catch must come straight after."
      } },
{ title: "Bits and Huge Numbers", chapter: "English++ Book Ch. 34 · nnd nor nxr nnt nsl nsr, nsz, nlw, pbg, hug, cpx", line: ["out prn nnd&a&b", "x mak hug"],
      content: {
        story: ["Every number is made of bits: tiny switches that are on or off. nnd, nor and nxr give the and, or and xor of two numbers' bits; nnt flips them all; nsl and nsr shift them left and right. 6 is 110 and 3 is 011, so nnd&6&3 is 010, which is 2.",
          "nsz says how many bytes a thing takes: 4 for a num, 8 for a big. nlw is the lowest whole number a num can hold, and pbg is a whole number that can't go below 0, with all 64 bits for the number.",
          "A num stops at about 2 billion and a big at about 9 billion billion. hug doesn't stop: it's a whole number as long as your computer's memory. 25 times 24 times 23 and so on down to 1 is 15511210043330985984000000, and a hug holds it exactly. cpx is a complex number, with two parts."],
        big: "Bit words reach the switches inside a number, and hug is a whole number of any size.",
        caption: "Bits switch on and off, and a hug grows past every limit. Tap Play.",
        demo: ["6 → 110 · 3 → 011", "nnd&6&3 → 010 → 2", "x mak hug", "25! → 15511210043330985984000000"]
      },
      deep: {
        more: ["hug&\"123456789012345678901234567890\" makes a huge number from text, big&x turns one back into a big, and x apw 100 raises one to a power.",
          "The roots and, aor, axr, asl and asr change a number's bits in place; nnd, nor, nxr, nsl and nsr give the answer as a value."],
        ex: { code: src(["a is 6", "b is 3", "out prn nnd&a&b", "out prn nor&a&b", "out prn nxr&a&b", "out prn nsl&a&2", "x mak hug", "x is 1", "i is 2", "i wle 25", "  x aml i", "  i add 1", "out prn x", "y is hug&2", "y apw 100", "out prn y"]),
          walk: ["Lines 1–6: and 2, or 7, xor 5, and 6 shifted left twice: 24.", "Lines 7–13: 25 times 24 times … times 1: 15511210043330985984000000.", "Lines 14–16: 2 to the power 100: 1267650600228229401496703205376."] },
        mistake: "Multiplying past a num's limit. A num wraps around after about 2 billion; make it a big, or a hug."
      } },
{ title: "Files", chapter: "English++ Book Ch. 35 · hwr, hap, hrd, hln, hrm", line: ['"a.txt" hwr "hello"', 'out prn hrd&"notes.txt"'],
      content: {
        story: ["h is the hard drive family. hwr writes a whole file: the file's name goes first and the text goes last. hap adds to the end and keeps what's there.",
          "hrd&\"a.txt\" reads a whole file into a text, and hln reads it as a list of lines. hex asks if a file exists, and hrm removes one.",
          "Reading a file that isn't there is a problem, so try it: put it under now btr now, and the catch can say the file is missing.", "Folders", "A file name with no folder means the folder your program runs in. When you press F5 in the Studio, that's your project's folder.", 'hmk makes a folder: "box" hmk now makes a folder called box.', "hrm removes a folder too — but only when it is empty.", "Copying and moving a file", 'hcp copies a file: "box/a.txt" hcp "box/b.txt" makes a second copy called b.txt.', 'hmv moves a file: "box/b.txt" hmv "box/c.txt" renames b.txt to c.txt, and the old name is gone.', "hls lists the files in a folder, so you can see what happened.", "Is it there?", "hex tells you if a file is there. hsz tells you its size, counted in bytes.", "A byte is about one letter. A file with hello in it is 5 bytes.", "If you try to read a file that isn't there, that's a problem, and you can catch it with btr and bch.", "Reading a file a line at a time", "mfi means make a file for input. Then wln reads it line by line.", "gln and get read from a file too, just like from the keyboard.", "top gln f reads the first line, a get f reads a number, and rest gln f reads the next line."],
        big: "hwr writes, hap adds, hrd and hln read, and hrm removes — the file's name goes first.",
        caption: "Lines go into the file, and come back out as a list. Tap Play.",
        demo: ["name hwr \"one\\n\"", "name hap \"two\\n\"", "hln&name", "[one, two]"]
      },
      deep: {
        more: ["\\n in a text is a new line, so each hap of a line with \\n adds one line to the file.",
          "f mfo \"notes.txt\" opens a file to write a bit at a time, and f mfi opens one to read.", "hmk makes a folder, and hrm removes one when it is empty.", "hcp copies a file, and hmv moves it — the old name is gone.", "hex asks if a file is there, and hsz says how many bytes it is.", "gln and wln read a file a line at a time, just like the keyboard."],
        ex: { code: src(["name is \"notes.txt\"", "name hwr \"one\\n\"", "name hap \"two\\n\"", "out prn hln&name", "name hrm now", "now btr now", "  out prn hrd&\"missing.txt\"", "e bch now", "  out prn \"I can't read that file.\"", "", '"box" hmk now', '"box/a.txt" hwr "hi"', 'out prn hls&"box"', "", '"box/a.txt" hcp "box/b.txt"', '"box/b.txt" hmv "box/c.txt"', 'out prn hls&"box"', "", 'name is "notes.txt"', "out prn hex&name", 'name hwr "hello"', "out prn hex&name", "out prn hsz&name", "name hrm now", "out prn hex&name", "", '"notes.txt" hwr "first line\\n7 8\\nlast line\\n"', 'f mfi "notes.txt"', "top gln f", "out prn top", "a mak num", "b mak num", "a get f", "b get f", "out prn a+b", "rest gln f", "line wln f", "  out prn line", "f close now", '"notes.txt" hrm now']),
          walk: ["Lines 1–4: [one, two].", "Line 5: the file is removed.", "Lines 6–9: I can't read that file.", 'Line 11: "box" hmk now — make a folder called box.', 'Line 12: "box/a.txt" hwr "hi" — write a file called a.txt inside it.', 'Line 13: out prn hls&"box" — list the files in the folder: [a.txt].', 'Line 15: "box/a.txt" hcp "box/b.txt" — copy a.txt to b.txt.', 'Line 16: "box/b.txt" hmv "box/c.txt" — move b.txt to c.txt. The old name is gone.', 'Line 17: out prn hls&"box" — list the folder: [a.txt, c.txt].', "Line 19: name is \"notes.txt\" — the file's name.", "Line 20: out prn hex&name — is it there? Not yet, so nay.", 'Line 21: name hwr "hello" — write hello into it.', "Line 22: out prn hex&name — is it there now? Yes.", "Line 23: out prn hsz&name — how big is it? 5 bytes.", "Line 24: name hrm now — remove it.", "Line 25: out prn hex&name — is it there? Nay.", 'Line 27: "notes.txt" hwr "first line\\n7 8\\nlast line\\n" — write a file with three lines in it.', 'Line 28: f mfi "notes.txt" — open it for reading.', "Line 29: top gln f — read the first line into top.", "Line 30: out prn top — prints first line.", "Line 31: a mak num — make a number box.", "Line 32: b mak num — make another number box.", "Line 33: a get f — read 7 into a.", "Line 34: b get f — read 8 into b.", "Line 35: out prn a+b — prints 15.", "Line 36: rest gln f — read the next line into rest.", "Line 37: line wln f — while there are lines left, read one into line.", "Line 38: out prn line — print it: last line.", "Line 39: f close now — close the file.", 'Line 40: "notes.txt" hrm now — remove the file.'] },
        mistake: "Forgetting that hwr replaces the whole file. Use hap to add to it."
      } },
{ title: "Project: A Shopping List That Remembers", chapter: "English++ Book Ch. 36 · lists, files and functions together", line: ["items add \"milk\"", 'list dpm see@vec@txt'],
      content: {
        story: ["A shopping list you add to, that's still there next time. It's a list of texts, saved to a file when you're done and read back when you start.",
          "save takes the list and writes it with one line per item: ctx&list&\"\\n\" joins the items with new lines between them.",
          "see@vec@txt takes the list to look at, without copying it and without changing it.", "Step 2: Taking things off", "Add one more choice to the menu: drop.", "chs checks that the thing is on the list before we say it's gone.", "items lrm thing takes it off the list. If it isn't on the list, the program says so instead of pretending."],
        big: "A list, a file and two functions make a program that remembers.",
        caption: "The list goes into a file, and comes back the next day. Tap Play.",
        demo: ["items is \"milk\"&\"eggs\"", "now save items", "shopping.txt", "milk · eggs"]
      },
      deep: {
        more: ["hln reads the file back as a list of lines — the same list you saved.",
          "Ask hex&\"shopping.txt\" first: on the very first run there is no file yet.", "lrm takes a thing off the list — but check with chs first."],
        ex: { code: src(["items is \"milk\"&\"eggs\"", "items add \"bread\"", "now save items", "back is hln&\"shopping.txt\"", "out prn back", "out prn cct&back", "\"shopping.txt\" hrm now", "", "save dfn now", "  list dpm see@vec@txt", "  \"shopping.txt\" hwr ctx&list&\"\\n\"", "", 'items is "milk"&"eggs"', 'what get "add, drop, list or quit? "', 'what ieq "drop"', '  thing get "What to drop? "', "  has is chs&items&thing", "  has ieq yes", "    items lrm thing", '    out prn "Gone."', "  now oth now", "    out prn \"That's not on the list.\"", "out prn items"]),
          walk: ["Lines 1–3: three items, saved.", "Lines 4–6: read back: [milk, eggs, bread], 3 of them.", "Line 7: the file is tidied away.", "Lines 9–11: save writes one item per line.", 'Line 13: items is "milk"&"eggs" — a list with milk and eggs.', 'Line 14: what get "add, drop, list or quit? " — ask what to do.', 'Line 15: what ieq "drop" — if the answer is drop...', 'Line 16: thing get "What to drop? " — ask what to drop.', "Line 17: has is chs&items&thing — is it on the list?", "Line 18: has ieq yes — if it is...", "Line 19: items lrm thing — take it off the list.", "Line 20: out prn \"Gone.\" — say it's gone.", "Line 21: now oth now — otherwise...", "Line 22: out prn \"That's not on the list.\" — say so.", "Line 23: out prn items — print what's left: [milk]."] },
        mistake: "Forgetting the first run: hln on a file that isn't there yet is a problem. Ask hex first."
      } },
{ title: "The Clock", chapter: "English++ Book Ch. 37 · rwt, kel, kda, ktm", line: ["now rwt 100", "t is kel"],
      content: {
        story: ["now rwt 100 waits 100 milliseconds — a tenth of a second — before the next line. 1000 is a whole second.",
          "The k family tells the time: kel is the seconds since the program started, kms the milliseconds, kda today's date, ktm the time now, and kyr, kmo and kdy the year, the month and the day.",
          "kel is handy for timing: read it before a job and after, and the difference is how long the job took."],
        big: "rwt waits, and the k family reads the clock and the calendar.",
        caption: "A countdown with a pause between each number. Tap Play.",
        demo: ["3", "(a tenth of a second)", "2 · 1", "Go!"]
      },
      deep: {
        more: ["A program that waits is still running; other threads go on while one waits.",
          "kfa&\"%Y-%m-%d\" fills in the date in any pattern you like."],
        ex: { code: src(["n is 3", "n fgt 0", "  out prn n", "  now rwt 100", "out prn \"Go!\""]),
          walk: ["Lines 1–4: 3, 2, 1, with a pause after each.", "Line 5: Go!"] },
        mistake: "Writing now rwt 1 for a second. The value is milliseconds: a second is 1000."
      } },
{ title: "At the Same Time", chapter: "English++ Book Ch. 38 · mtd, rjn, mtx, blk", line: ["t mtd count_to&3", "t rjn now"],
      content: {
        story: ["A thread is a part of a program that runs at the same time as the rest. t mtd count_to&3 starts the function count_to running beside the program.",
          "t rjn now waits for the thread to finish. Always join a thread before the program ends.",
          "Two threads changing the same thing at once can tangle it. A mutex — guard mak mtx — and a lock — m blk now — let one thread in at a time.", "Getting an answer later", "A thread doesn't give an answer back. msy does.", "It runs a function on the side, and hands you a future: a promise of an answer.", "When you ask with @get, it gives you the answer. If the answer isn't ready, it waits.", "The kind of answer here is fut@num: a future number.", "Atomics", "Two threads can change the same number at the same moment. Then they get in each other's way.", "Each one reads the number, adds 1, and writes it back. Sometimes both read the same number, so one of the adds is lost.", "atm fixes this for one number. An atomic number can't be interrupted. Each change is finished before the next one starts.", "total@load reads the number. Two threads counting to 1000 each give 2000, every time.", "Parallel for", "fpr means for, in parallel. It's written just like fea.", "But it spreads the work across every core of your computer. You don't have to manage any threads.", "So a big job can finish many times sooner.", "The turns run in no special order, and they can happen at the same moment. So anything they share must be an atm, or locked with a mtx. If each turn only changes its own item, there's nothing to worry about.", "Letting a thread go", "rdt means run: detach. It lets the thread go on by itself, and your program doesn't wait for it.", "If your program ends first, the thread just stops.", "rjn is the opposite: it waits for the thread to finish before going on."],
        big: "mtd starts a thread, rjn waits for it, and blk lets one thread at a time into the lines under it.",
        caption: "Two threads add their names, one at a time through the lock. Tap Play.",
        demo: ["t1 mtd add_name&…\"Ada\"", "t2 mtd add_name&…\"Bob\"", "t1 rjn now · t2 rjn now", "cct&names → 2"]
      },
      deep: {
        more: ["A channel hands values between threads: c mak chn@num, c add 5 sends, and c@get& waits for one.",
          "Turbo builds can put a loop on every core by themselves, when it can prove that's safe.", "msy runs a function on the side and hands you a future — @get gives you the answer.", "An atm number can't be interrupted — every change finishes before the next one starts.", "fpr is fea on every core at once — the turns run in no special order.", "rdt lets a thread go on by itself — your program doesn't wait for it."],
        ex: { studio: true, code: src(["names mak vec@txt", "guard mak mtx", "t1 mtd add_name&names&guard&\"Ada\"", "t2 mtd add_name&names&guard&\"Bob\"", "t1 rjn now", "t2 rjn now", "out prn cct&names", "", "add_name dfn now", "  list dpm ref@vec@txt", "  m dpm ref@mtx", "  who dpm txt", "  m blk now", "    list add who", "", "answer msy slow_add&1&2", 'out prn "I can do other things now."', "out prn answer@get", "slow_add dfn num", "  a dpm num", "  b dpm num", "  now rwt 20", "  slow_add ert a+b", "", "total mak atm@num", "t1 mtd count_up&total", "t2 mtd count_up&total", "t1 rjn now", "t2 rjn now", "out prn total@load", "count_up dfn now", "  c dpm ref@atm@num", "  i flt 1000", "    c add 1", "", "v is 1&2&3&4", "sum mak atm@num", "n fpr v", "  sum add n", "out prn sum@load", "", 't mtd say_hi&"there"', "t rdt now", "now rwt 300", 'out prn "bye"', "say_hi dfn now", "  who dpm txt", '  out prn "hi @who"']),
          walk: ["Lines 1–2: a list and a mutex.", "Lines 3–6: two threads add a name each, and both are joined.", "Line 7: 2.", "Lines 9–14: the lock lets one thread at a time add to the list.", "Line 16: answer msy slow_add&1&2 — run slow_add with 1 and 2 on the side, and put the promise of the answer in answer.", 'Line 17: out prn "I can do other things now." — print this while the answer is still being worked out.', "Line 18: out prn answer@get — ask for the answer. If it isn't ready, this waits: 3.", "Line 19: slow_add dfn num — define slow_add.", "Line 20: a dpm num — it takes a.", "Line 21: b dpm num — it takes b.", "Line 22: now rwt 20 — wait 20 thousandths of a second.", "Line 23: slow_add ert a+b — give back a+b, which is 3.", "Line 25: total mak atm@num — make an atomic number.", "Line 26: t1 mtd count_up&total — start a thread counting up the same total.", "Line 27: t2 mtd count_up&total — start a second thread counting the same total.", "Line 28: t1 rjn now — wait for the first thread to finish.", "Line 29: t2 rjn now — wait for the second thread to finish.", "Line 30: out prn total@load — print the total: 2000. Nothing is lost.", "Line 31: count_up dfn now — define count_up.", "Line 32: c dpm ref@atm@num — it takes c, the real atomic number.", "Line 33: i flt 1000 — count from 0 to 999.", "Line 34: c add 1 — add 1 to it.", "Line 36: v is 1&2&3&4 — a list of four numbers.", "Line 37: sum mak atm@num — make an atomic number for the total.", "Line 38: n fpr v — for each n in v, on every core at once.", "Line 39: sum add n — add n to the total. The total is atomic, so nothing is lost.", "Line 40: out prn sum@load — prints 10.", 'Line 42: t mtd say_hi&"there" — start a thread saying hi to there.', "Line 43: t rdt now — let it go on by itself. No waiting.", "Line 44: now rwt 300 — wait 300 thousandths of a second, so the thread gets a chance.", 'Line 45: out prn "bye" — print bye.', "Line 46: say_hi dfn now — define say_hi.", "Line 47: who dpm txt — it takes who, a text.", 'Line 48: out prn "hi @who" — prints hi there.'] },
        mistake: "Ending the program without joining a thread."
      } },
{ title: "Threads That Talk", chapter: "English++ Book Ch. 39 · chn, cnd, mtl", line: ["c mak chn@num", "c close now"],
      content: {
        story: ["Threads can get in each other's way when they share things, so it's often better if they pass things along, like notes in class. A channel is a pipe between threads: one puts values in, another takes them out. Make one with chn@num — C++ has nothing like it.",
          "c add 5 sends, x is c@get& waits for one, and c close now says there are no more. n fea c walks through the values until the channel is closed and empty. No lock needed: the channel does that for you. chn@num&2 holds 2 at most, so a fast thread can't race far ahead of a slow one.",
          "cnd is a condition: inside a lock, cv wait g&ready sleeps until ready says yes, and cv notify_one now wakes one waiting thread. mtl makes a name at the top level that each thread has its own copy of."],
        big: "A channel passes values between threads with no lock; a condition lets a thread sleep until something is true.",
        caption: "One thread sends numbers down the pipe, and the other adds them up. Tap Play.",
        demo: ["c mak chn@num", "feed: c add 1 … 5", "n fea c: total add n", "→ 15"]
      },
      deep: {
        more: ["Closing a channel matters: a walk through it ends only when it's closed and empty.",
          "mtl is useful for counters each thread keeps for itself, with no lock and no mix-up."],
        ex: { studio: true, code: src(["c mak chn@num", "t mtd feed&c", "total is 0", "n fea c", "  total add n", "t rjn now", "out prn total", "", "feed dfn now", "  c dpm ref@chn@num", "  i flt 5", "    c add i+1", "  c close now"]),
          walk: ["Lines 1–2: a channel, and a thread that feeds it.", "Lines 3–5: add up every value that comes down the channel.", "Lines 6–7: wait for the thread, then print 15.", "Lines 9–13: send 1 to 5, then close the channel."] },
        mistake: "Forgetting c close now. A walk through a channel that's never closed waits forever."
      } },
{ title: "Groups and Other Files", chapter: "English++ Book Ch. 40 · dgr, xim", line: ["geo dgr now", 'now xim "tools.epp"'],
      content: {
        story: ["dgr makes a group: a family of names that belong together. geo dgr now, with functions under it, and reach them with @: geo@area&3.",
          "Two groups can both have an area without a mix-up, because each is reached through its own name.",
          "A program can grow into many files. now xim \"tools.epp\" brings in another English++ file, so its functions and classes can be used here.", "Where things can go", "English++ reads your whole program before it starts, so definitions can go anywhere.", "But most people like this order: notes that say what the program is for, then xlb, xic and xim lines, then the main part of the program, then functions, then classes.", "A group holds names together, so two groups can use the same name without getting mixed up. You reach inside a group with @: geo@area and cash@area are two different functions."],
        big: "dgr groups names, and xim brings in another .epp file.",
        caption: "A function inside a group, reached with @. Tap Play.",
        demo: ["shout dgr now", "  say dfn txt", "shout@say&\"hello\"", "HELLO"]
      },
      deep: {
        more: ["xim brings a file in once, however many files ask for it.",
          "Keep each file about one thing: tools.epp for tools, shapes.epp for shapes.", "Definitions can go anywhere, but most people put notes first, then the main part, then functions, then classes."],
        ex: { studio: true, code: src(["out prn shout@say&\"hello\"", "", "shout dgr now", "  say dfn txt", "    s dpm txt", "    say ert tuc&s"]),
          walk: ["Line 1: HELLO.", "Lines 3–6: a group called shout with one function, say."] },
        mistake: "Calling a group's function without the group: say&\"hello\" isn't found; write shout@say&\"hello\"."
      } },
{ title: "The World Outside", chapter: "English++ Book Ch. 41 · rcm, xcm, xev, xwb", line: ['now rcm "echo Hello from Windows"', 'page is xwb&"http://example.com"'],
      content: {
        story: ["rcm runs a command on the PC, as if you typed it in a Windows command window: now rcm \"echo Hello from Windows\".",
          "xcm&\"dir\" runs a command and gives back what it printed, and xcd gives its exit code. xev&\"PATH\" reads an environment value, and xag the words the program was started with.",
          "xwb&\"http://example.com\" reads a web page's text, and xpo sends text to a web address."],
        big: "The x and r roots reach outside the program: commands, settings and the web.",
        caption: "The program asks Windows to run a command. Tap Play.",
        demo: ["now rcm \"echo Hi\"", "Hi", "xev&\"PATH\"", "C:\\Windows;…"]
      },
      deep: {
        more: ["A web page might not answer, so ask for one under now btr now.",
          "xha&s is a SHA-256 hash, and xbe and xbd turn text into base 64 and back."],
        ex: { code: src(["online is nay", "online ieq yes", "  page is xwb&\"http://example.com\"", "  out prn tsz&page", "out prn \"Done.\""]),
          walk: ["Line 1: online is nay, so the web is left alone.", "Lines 2–4: only when online is yes is the page read.", "Line 5: Done."] },
        mistake: "Running a command that waits for typing. rcm waits until the command ends."
      } },
{ title: "Bytes, Codes and Other Computers", chapter: "English++ Book Ch. 42 · hby, hrb, kns, kfa, xha, xbe, xbd, tjs, srv, sck, xpo", line: ['out prn xha&"abc"', 'code is xbe&"hello"'],
      content: {
        story: ["Some files, like pictures, hold plain numbers from 0 to 255: bytes. hby writes a list of bytes to a file and hrb reads them back. kns is a clock in nanoseconds, and kfa&\"%Y-%m-%d\" fills in the date in a pattern.",
          "xha gives a text a SHA-256 hash, like a fingerprint: the same text always gives the same one, and you can't get the text back from it. xbe turns text into base 64, which uses only plain letters and numbers, and xbd turns it back.",
          "tjs reads JSON — text that looks like lists and maps — into a jsn you can reach into with @. srv is a server that waits for someone to connect and sck is one end of a connection; 127.0.0.1 always means this computer. xpo sends text to a web page and gives back its answer.", "Very small times and pretty dates", "kns is a clock that counts in nanoseconds. A nanosecond is a billionth of a second.", "Take the time before and after a job, and you can see how long it took: stop is kns, then out prn stop>=start.", "kfa means clock: filled in. Give it a pattern, and it fills in the date and time. %Y is the year, %m is the month and %d is the day."],
        big: "Bytes in files, fingerprints and base 64, JSON, and talking to other programs.",
        caption: "hello becomes aGVsbG8= and comes back again. Tap Play.",
        demo: ["xha&\"abc\" → ba7816bf…", "xbe&\"hello\" → aGVsbG8=", "xbd&\"aGVsbG8=\" → hello", "hby · hrb → bytes"]
      },
      deep: {
        more: ["A mistake in JSON text is a problem you can catch, and it says which line it's on.",
          "A server only listens on this computer unless you ask for more: srv&8080&\"0.0.0.0\" listens on the network too.", "kns counts nanoseconds, and kfa fills in a date from a pattern."],
        ex: { code: src(["out prn xha&\"abc\"", "code is xbe&\"hello\"", "out prn code", "out prn xbd&code", "bytes mak vec@byt", "bytes add byt&1", "bytes add byt&200", "\"bytes.bin\" hby bytes", "back is hrb&\"bytes.bin\"", "out prn cct&back", "out prn num&back@1", "\"bytes.bin\" hrm now", "", "start is kns", "total is 0", "i flt 1000", "  total add i", "stop is kns", "out prn stop>=start", 'year is kfa&"%Y"', "out prn tsz&year"]),
          walk: ["Line 1: the SHA-256 of abc: ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad.", "Lines 2–4: aGVsbG8=, then hello again.", "Lines 5–9: two bytes written and read back.", "Lines 10–11: 2 bytes, and the second is 200.", "Line 12: the file is tidied away.", "Line 14: start is kns — note the time now, in nanoseconds.", "Line 15: total is 0 — a total to add into.", "Line 16: i flt 1000 — count from 0 to 999.", "Line 17: total add i — add i to the total.", "Line 18: stop is kns — note the time again.", "Line 19: out prn stop>=start — is the stop time after the start time? Yes.", 'Line 20: year is kfa&"%Y" — fill in the year, like 2026.', "Line 21: out prn tsz&year — how many letters is that? 4."] },
        mistake: "Expecting to get the text back from a hash. A hash only goes one way; use base 64 when you need it back."
      } },
{ title: "Any C++, Any Library", chapter: "English++ Book Ch. 43 · xic, xlb, xpp, xgl", line: ["now xlb raylib", 'now xic "<vector>"'],
      content: {
        story: ["English++ turns into C++, so it can reach anything C++ can. now xic \"<vector>\" includes a C++ header, and now xlb raylib brings in a whole library — raylib, SDL, SFML, OpenGL or Qt.",
          "A library is a bag of new words other people made. Once it's in, its functions are run like your own: now InitWindow 800&450&\"Stars\".",
          "now xpp \"…\" drops one line of real C++ into the program, and xgl puts one at the top. They are the escape hatch for anything English++ doesn't have a word for yet.", "The C++ View", "Want to see how it works? Open the C++ View panel in the Studio.", "It shows the C++ that your program turns into. When you click on a line of your program, the C++ for that line lights up.", "It's a great way to learn C++, if you ever want to. It's all there, one line at a time.", "A library's classes", "A library's classes work just like your own.", 'Here is a small library in a header file. A header next to your program can be included by its name: now xic "shop.h".', "b mak Bag makes a bag, b fill 5 fills it, and b@total& runs its total: 5.", "t mak shop@Till makes a Till from the shop group, and shop@tax&50 is the shop's tax function: 5.", "A & on its own means run it with no values. So b@total& runs total, and b@open reads a field.", "Children of a library's class", "Your own class can be a child of a library's class.", "Sack dcl Bag says Sack is a child of Bag.", "If a function has const at the end of it in C++, redo it with dkn. If it doesn't, redo it with dov.", "A library that isn't in the Studio", "Do you have a library from somewhere else? Choose Libraries > Add External Library.", "Give it a name. Then fill in its main header, its include folder, and its .lib and .dll files.", "After that, it works like the others: now xlb yourname.", "You can also bring in a header by hand with xic, and skip the std:: part in your C++ lines with xus: now xus std is the same as using namespace std; in C++."],
        big: "xic and xlb bring in C++ headers and libraries, and xpp writes a line of C++ by hand.",
        caption: "A raylib window opens from three-word lines. Tap Play.",
        demo: ["now xlb raylib", "now InitWindow 800&450&\"Stars\"", "now wfv now", "  (draw a frame)"]
      },
      deep: {
        more: ["Turbo builds leave a program with xpp lines a little less fast: the compiler can't see inside the C++ it didn't write.",
          "Anything the language leaves out on purpose, like goto, has another way: ebk and enx can name a loop.", "The C++ View shows the C++ your program turns into, one line at a time.", "A library's classes work just like your own — reach them with @.", "Your own class can be a child of a library's class.", "Add a library of your own with Libraries > Add External Library, then turn it on with xlb."],
        ex: { studio: true, code: src(["now xlb raylib", "now InitWindow 800&450&\"Stars\"", "now SetTargetFPS 60", "now wfv now", "  now ebk WindowShouldClose&", "  now BeginDrawing now", "  now ClearBackground BLACK", "  now DrawText \"Hello!\"&350&200&20&RAYWHITE", "  now EndDrawing now", "now CloseWindow now", "", 'now xic "shop.h"', "b mak Bag", "b fill 5", "out prn b@total&", "b@open is 9", "out prn b@open", "c mak Bag&10", "out prn c@total&", "t mak shop@Till", "t ring 4", "out prn t@money", "out prn shop@tax&50", "", 'now xgl "class Bag { public: virtual int weight() const { return 1; } virtual ~Bag() = default; int open = 1; };"', "s mak Sack", "out prn s@weight&", "out prn s@open", "Sack dcl Bag", "  weight dkn num", "    weight ert 5", "", 'now xic "<vector>"', "v mak std@vector@int", "v push_back 3", "v push_back 4", "out prn v@size&", 'n is std@stoi&"12"', "out prn n+1"]),
          walk: ["Line 1: raylib comes in.", "Lines 2–3: a window, 60 frames a second.", "Lines 4–9: draw every frame until the window is closed.", "Line 10: close it.", 'Line 12: now xic "shop.h" — bring in the shop header.', "Line 13: b mak Bag — make a bag.", "Line 14: b fill 5 — fill it with 5.", "Line 15: out prn b@total& — run total: 5.", "Line 16: b@open is 9 — set its open field to 9.", "Line 17: out prn b@open — prints 9.", "Line 18: c mak Bag&10 — make another bag, starting at 10.", "Line 19: out prn c@total& — prints 10.", "Line 20: t mak shop@Till — make a Till from the shop group.", "Line 21: t ring 4 — ring up 4.", "Line 22: out prn t@money — prints 4.", "Line 23: out prn shop@tax&50 — the shop's tax on 50: 5.", "Line 25: now xgl \"class Bag { ... };\" — a line of C++ that makes the Bag class, with a weight of 1. The book's example needs it, so the Sack has a parent to be a child of.", "Line 26: s mak Sack — make a Sack.", "Line 27: out prn s@weight& — run weight: 5. Sack redid it.", "Line 28: out prn s@open — print open, from Bag: 1.", "Line 29: Sack dcl Bag — define Sack as a child of Bag.", "Line 30: weight dkn num — redo weight as a constant function, because the C++ one has const at the end.", "Line 31: weight ert 5 — give back 5.", "Line 33: now xic \"<vector>\" — bring in C++'s vector header.", "Line 34: v mak std@vector@int — make a vector of numbers.", "Line 35: v push_back 3 — push 3 into it.", "Line 36: v push_back 4 — push 4 into it.", "Line 37: out prn v@size& — how many are in it? 2.", 'Line 38: n is std@stoi&"12" — turn the text 12 into a number.', "Line 39: out prn n+1 — prints 13."] },
        mistake: "Forgetting the library line. Without now xlb raylib, InitWindow is an unknown word."
      } },
{ title: "Project: Catch the Stars", chapter: "English++ Book Ch. 44 · a raylib game", line: ["now xlb raylib", "now ebk WindowShouldClose&"],
      content: {
        story: ["A real window game: stars fall from the top, and you move a basket with the arrow keys to catch them. It uses raylib, a library for games.",
          "Every frame the program reads the keys, moves the basket, moves each star down, and checks if a star touched the basket. Then it draws everything.",
          "The score goes up for every star caught. Build it a step at a time: first the window, then the basket, then one star, then many."],
        big: "A game loop reads the keys, moves things, checks for catches, and draws — sixty times a second.",
        caption: "A star falls into the basket, and the score goes up. Tap Play.",
        demo: ["now xlb raylib", "basket moves with ← →", "stars fall", "score add 1"]
      },
      deep: {
        more: ["Build .exe makes the game a program of its own, with raylib inside, to share with a friend.",
          "Turbo leaves a library program built the plain way, so it behaves exactly as raylib expects."],
        ex: { studio: true, code: src(["now xlb raylib", "now InitWindow 800&450&\"Catch the Stars\"", "now SetTargetFPS 60", "x is 400", "score is 0", "now wfv now", "  now ebk WindowShouldClose&", "  IsKeyDown&KEY_LEFT ieq yes", "    x asb 5", "  IsKeyDown&KEY_RIGHT ieq yes", "    x add 5", "  now BeginDrawing now", "  now ClearBackground BLACK", "  now DrawRectangle x&420&80&20&GOLD", "  now DrawText \"Score: @score\"&10&10&20&RAYWHITE", "  now EndDrawing now", "now CloseWindow now"]),
          walk: ["Lines 1–5: the window, the basket's place and the score.", "Lines 6–16: every frame, move the basket with the arrow keys and draw it.", "Line 17: close the window."] },
        mistake: "Moving the basket off the screen. Keep x between 0 and 720 with nkb&x&0&720."
      } },
{ title: "The Studio's Tools", chapter: "English++ Book Ch. 45 · The Studio's Tools", line: 'out prn "Hello, V!"',
      content: {
        story: ["The Studio is the program where you write English++. It has one window, and everything is in it.",
          "Most of the work happens in one panel, with the others around it. The Studio saves your work when you press Ctrl+S, and when you run.",
          "Press F5 to run, and F9 to set a breakpoint. The Studio remembers which files are open, and puts them back where they were.",
          "There is nothing to install, and no code outside the Studio. It's yours, and it works even with no internet."],
        big: "The Studio is one window, and everything you need is in it.",
        caption: "Your Studio, your window — one place to write, run, and watch your program.",
        demo: ['out prn "Hello, V!"', "→ Hello, V!", "Press F5 to run it"]
      },
      deep: {
        more: ["The editor is in the middle: big text, a toolbar with Run, Debug, and Stop, a status bar at the bottom, and the Files panel, the Symbols panel, and the Debug panel around it.",
          "The tabs are at the top: Problems, Output, Terminal, and Debug Console. All of them share the same panel.",
          "The status bar at the bottom always shows what the Studio is doing: where you are, and whether your code has a problem.",
          "The Debug panel lists every name and its value while your program runs. The Problems tab lists what is wrong, and how to fix it."],
        ex: { code: src(['out prn "Hello, V!"']),
          walk: ["Line 1: out prn \"Hello, V!\" — the Studio's first program. Press F5 to run it."] },
        mistake: "Don't hunt through menus when something goes wrong. Look at the Problems tab first — it tells you what's wrong and how to fix it."
      } },
{ title: "When the Studio Says Something", chapter: "English++ Book Ch. 46 · When the Studio Says Something", line: "x is 6",
      content: {
        story: ["Sometimes the Studio tells you something is wrong. That's good: it means it caught the mistake before anything ran.",
          "Sometimes a problem waits until the program is running, and the Studio stops it and shows you where.",
          "Every message says what happened, and the Studio's job is to catch them early, before they can do any harm.",
          "The best first move is always the same: read the message, look at the line it points to, and fix it there."],
        big: "When the Studio says something, read the message and look at the line it points to.",
        caption: "The Studio catches mistakes early — before they can do any harm.",
        demo: ["x is 6",
          "x add 0.5",
          "→ A kind problem",
          "x is 1",
          'x is "a"',
          "→ A box keeps its kind",
          "out prn f&1&2",
          "→ Count the values"]
      },
      deep: {
        more: [["The shape of a line: x is 1 2 has too many words, out prn has too few, and x is a + b has spaces in its math — write x is a+b.", "Names: x is y means you used a name before you made it, and out prn coutn after count is 1 means the Studio guesses what you meant. x mak nmu says that kind doesn't exist.", "Kinds of values: x is 6 then x add 0.5 says a whole-number box can't hold 6.5, and x is 1 then x is \"a\" says a box keeps its kind.", "Functions: out prn f&1&2 says count the values — it's looking for one, and you gave it two. A function that promises a number must give one back with ert.", "When your program stops while it's running, the Studio shows you the line. The book's advice: when you don't know what's going on, print things — put out prn x in your program to see what's in a box."]],
        ex: { code: src(["x is 6", "x add 0.5"]),
          walk: ["Line 1: x is 6 — a whole-number box.",
          "Line 2: x add 0.5 — this is a kind problem. A whole-number box can't hold 6.5. The Studio stops you before anything runs."] },
        mistake: "Don't try to run a program the Studio says is wrong. Read the message, fix the line it points to, and run again."
      } },
{ title: "Turbo", chapter: "English++ Book Ch. 47 · Turbo", line: "out prn fib&42",
      content: {
        story: ["Turbo makes your program faster. It is a part of the Studio, and it's on by default.",
          "It works in three steps. First, your program turns into a list of numbers — one flat list of whole numbers, with every letter of your text in it.",
          "Then the numbers are rewritten, using the rules of algebra. A slow loop can become a quick formula.",
          "Then the new numbers turn back into C++, and the Studio builds that. The math is the same, so the answer is the same — only the speed changes.",
          "The checks stay, unless they are proved away. Turbo only takes out a check when it can prove the thing can never go wrong."],
        big: "Turbo turns your program into numbers, rewrites the numbers with algebra, and builds the result — the answer stays the same.",
        caption: "The same program, the same answer — only faster.",
        demo: ["out prn fib&42", "→ 267914296", "Turbo on: nearly 200x as fast"]
      },
      deep: {
        more: ["fib&42 is 267914296. With Turbo on, it runs nearly 200 times as fast. That's the best case the book shows.",
          "A big search that started from more than 3 million ran more than 5 times as fast with Turbo on.",
          "The checks stay, unless they are proved away. 458 test programs were run with Turbo on and off, and 606 claims were proved. A separate checker proved 83,155 of 83,799 removed checks on 300 random programs, and none were wrong. 644 checks were unfollowed, which means the checker could not prove them away — and Turbo leaves them in.",
          "Turbo changes a few small things: hash maps and bags come out in a different order, printing can be a little late, and files can be a little late. It leaves libraries like raylib alone, and Classic programs don't get Turbo."],
        ex: { code: src(["out prn fib&42"]),
          walk: ["Line 1: out prn fib&42 — print the 42nd Fibonacci number: 267914296. With Turbo on, this runs nearly 200 times as fast."] },
        mistake: "Don't turn Turbo off to chase a speed difference. If a program is slow, Turbo is the reason it isn't slower."
      } },
{ title: "English++ Against C++", chapter: "English++ Book Ch. 48 · English++ Against C++", line: "out prn fib&42",
      content: {
        story: ["English++ turns into C++, so it should run as fast as C++. But is that true?",
          "The book measured 25 jobs on one laptop, with Turbo on, in November 2026. Each job was run in both English++ and ordinary C++.",
          "English++ was faster on 19 jobs, about the same on 4, and slower on 2. The middle job was 1.91 times as fast.",
          "A sorting job ran in 0.086 seconds in English++ and 0.322 seconds in C++. But hand-tuned C++ still won some jobs — English++ is not faster than the very best C++ a person can write.",
          "The honest answer is: English++ matched or beat ordinary C++ on the measured jobs, and a great C++ programmer can still beat it."],
        big: "English++ matched or beat ordinary C++ on the measured jobs — and hand-tuned C++ still won some.",
        caption: "Measured, not promised: faster on 19, about the same on 4, slower on 2.",
        demo: ["25 jobs measured", "Faster on 19", "About the same on 4", "Slower on 2", "Middle job: 1.91x"]
      },
      deep: {
        more: ["The 25 jobs were measured with Turbo on, on one laptop, in November 2026. Each job ran in both English++ and ordinary C++.",
          "English++ was faster on 19 jobs, about the same on 4, and slower on 2. The middle job was 1.91 times as fast, and the average — leaving out fib — was 2.52 times as fast.",
          "A sorting job ran in 0.086 seconds in English++ and 0.322 seconds in C++. That's about 3.7 times as fast.",
          "But hand-tuned C++ still won some jobs. English++ is not faster than the very best C++ a person can write — it is as fast as the ordinary C++ most people write."],
        ex: { code: src(["out prn fib&42"]),
          walk: ["Line 1: out prn fib&42 — the 42nd Fibonacci number: 267914296. It is the book's central example job for the comparison."] },
        mistake: "Don't say English++ is faster than C++. Say it was faster on the measured jobs, and that hand-tuned C++ still won some."
      } },
{ title: "Cheat Sheet", chapter: "English++ Book Ch. 51 · Cheat Sheet", line: 'out prn "Hello, V!"',
      content: {
        story: ["Here are the 12 lines to learn first. The book says these 12 cover about three lines out of four in the Studio's example programs.",
          "Learn them one at a time, and you can read most of the programs in this book.",
          "The rest of the words are sorted into groups, by what they do. When you want a word, look in the group that does that job.",
          "The marks are part of the cheat sheet too: @ reaches in, & gives values, and + - * / % do math with no spaces."],
        big: "The 12 to learn first cover about three lines out of four.",
        caption: "Twelve lines. Three out of four lines in the book's programs.",
        demo: ["out prn x",
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
          "age dfd 3"]
      },
      deep: {
        more: ["The 12, in the book's order: out prn x prints; x is 6 makes and sets; x add 1 adds; x mak num makes a kind; x ieq 3 asks if it is 3; i flt 10 counts from 0 to 9; x fea v repeats over a list; f dfn num defines a function giving a number; a dpm num says a function takes a; f ert a+1 gives back a+1; Dog dcl now defines a class; age dfd 3 gives the class a field starting at 3.",
          "The groups are: Making and changing; Printing and asking; Choosing; Repeating; Lists; Functions and classes.",
          "The marks are: @ reaches in, & gives values, + - * / % do math with no spaces, == != < <= > >= compare, && and ||, ! not, now, and @x, a value inside text."],
        ex: { code: src(['out prn "Hello, V!"']),
          walk: ["Line 1: out prn \"Hello, V!\" — the book's first program. It uses the first of the 12: out prn."] },
        mistake: "Don't try to learn all the words at once. Learn the 12, and look up the rest in the group that does the job."
      } },
{ title: "Whole Chart", chapter: "English++ Book Ch. 52 · Whole Chart", line: "score add 10",
      content: {
        story: ["This is the Whole Chart: every word in English++, sorted by family.",
          "Each family is a letter, and each letter has a job. a is arithmetic, b is block, c is collection, d is define, e is exit, f is for, g is get, h is hard drive, i is if, k is clock, l is list, m is make, n is number, o is otherwise, p is put, r is run, s is should, t is text, u is until, w is while, and x is external.",
          "When you want a word, find the family that does the job, and look down its list. The chart also has a Kinds table, for what things are, and a Special words list: now, nil, yes, nay, out, err, inp, and slf.",
          "You don't have to learn it all. Learn the 12 from the Cheat Sheet, and use the chart to find the rest."],
        big: "The Whole Chart is every word in English++, sorted by family — use it to find a word, not to learn them all.",
        caption: "Every word in English++, sorted by family.",
        demo: ["a — arithmetic",
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
          "x — external"]
      },
      deep: {
        more: ["The a family is arithmetic: add, asb, aml, adv, amd, apw, and the rest. score add 10 adds 10, x asb 3 takes 3 away, x aml 2 doubles it, x adv 4 divides it by 4, x amd 5 gives the remainder of 5, and y apw 10 raises y to the power of 10.",
          "The other families are the same idea: each word starts with its family's letter. So when you want a list word, look in the l family; when you want a text word, look in the t family.",
          "The Kinds table says what things are: num, txt, dec, yes-or-no, and the rest. The Special words list is now, nil, yes, nay, out, err, inp, and slf."],
        ex: { code: src(["score add 10", "x asb 3", "x aml 2", "x adv 4", "x amd 5", "y apw 10"]),
          walk: ["Line 1: score add 10 — add 10 to the score.",
          "Line 2: x asb 3 — take 3 away from x.",
          "Line 3: x aml 2 — multiply x by 2.",
          "Line 4: x adv 4 — divide x by 4.",
          "Line 5: x amd 5 — the remainder of 5.",
          "Line 6: y apw 10 — y to the power of 10."] },
        mistake: "Don't try to learn the chart by heart. Learn the 12, and use the chart to find a word when you need one."
      } }];

  var shelves = [
    { title: "The Whole Chart", chapter: "Beyond the basics · English++ shelf", line: ["x igt 3", "x wgt 3"],
      content: {
        story: ["The Whole Chart is every word in English++, and it's frozen: a word never changes what it means, so what you learn stays true. New words may be added, but never changed.",
          "Every root is a family letter and a two-letter job. a arithmetic, b block, c collection, d define, e exit, f for, g get, h hard drive, i if, k clock, l list, m make, n number, o otherwise, p put, r run, s should, t text, u until, w while, x external.",
          "A job means the same thing in every family. The six that compare — eq ne lt le gt ge — make ieq and weq and seq and ueq and the rest; rm is remove in lrm and hrm; sz is size in tsz and hsz."],
        big: "Family letter plus job makes a root, the same way every time, and the chart never changes.",
        caption: "One job, gt, in five families. Tap Play.",
        demo: ["igt · if greater than", "ogt · otherwise if greater", "wgt · while greater than", "sgt · should be greater", "fgt · count down while greater"]
      },
      deep: {
        more: ["The kinds have short names too: num big sml pos byt dec flo txt ltr yno any, and the holders vec lst dqu arr stk que hep map hsh set bag par tup opt.",
          "In the Studio, point at any root to see it spelled out, letter by letter."],
        ex: { code: src(["x is 5", "x igt 3", "  out prn \"if: bigger than 3\"", "x sgt 3", "out prn \"should: it is\"", "n is x", "n fgt 3", "  out prn n", "x wgt 3", "  x asb 1", "out prn x"]),
          walk: ["Lines 2–3: if greater: if: bigger than 3.", "Lines 4–5: should be greater, and it is: should: it is.", "Lines 6–8: count down while greater than 3: 5, 4.", "Lines 9–11: take 1 while greater than 3: 3."] },
        mistake: "Guessing a job's meaning from English. ne is not equal, never next; check the chart's job list."
      } },
    { title: "Ready-Made Values", chapter: "Beyond the basics · English++ shelf", line: ["out prn nsq&81", "out prn tuc&word"],
      content: {
        story: ["English++ comes with hundreds of ready-made values, in every program, with nothing to include. Each is a root with & and what it takes.",
          "Numbers: nsq square root, nab absolute value, nmx and nmn the bigger and smaller, npw power, nfc factorial, npe is prime, nra a random number. Text: tsz tuc tlc trv trp tps ths tsp twd.",
          "Collections: cct how many, csm the sum, cmx and cmn, cav the average, chs has, cps where, cso and crv sorted and reversed copies, ctx joined into a text."],
        big: "n, t and c roots with & give ready-made answers about numbers, text and collections.",
        caption: "A toolbox opens: number tools, text tools, list tools. Tap Play.",
        demo: ["nsq&81 → 9", "nfc&5 → 120", "tuc&\"hi\" → HI", "cmx&scores → 9"]
      },
      deep: {
        more: ["Each one gives back one kind of answer: tsz a number, nsq a decimal, tuc a text, chs a yes or no.",
          "The Reference panel in the Studio lists every one, and double-clicking adds it to your program."],
        ex: { code: src(["scores is 4&9&2&7", "out prn \"Scores: @scores\"", "out prn cmx&scores", "out prn cmn&scores", "out prn csm&scores", "out prn cav&scores", "out prn nfc&5", "out prn npe&97", "out prn nsq&81", "out prn trv&\"stressed\""]),
          walk: ["Line 2: Scores: [4, 9, 2, 7].", "Lines 3–6: 9, 2, 22 and 5.5.", "Line 7: 120.", "Line 8: yes, 97 is prime.", "Line 9: 9.", "Line 10: desserts."] },
        mistake: "Mixing up tsz and cct. tsz counts the letters in a text, and cct counts the items in a collection."
      } },
    { title: "English++ Studio", chapter: "Beyond the basics · English++ shelf", line: ["out prn \"Hello from the Studio!\""],
      content: {
        story: ["The Studio is where English++ is written, run and built. The editor is in the middle; Output, Problems and the C++ View are at the bottom; Project, Outline, Libraries, Reference and Music are on the left.",
          "F5 runs your program. Ctrl+Shift+B builds an .exe that runs on its own. Tab takes a suggestion, Enter moves the next line in after a line that opens a block, and Shift+Tab moves a line back out.",
          "Ctrl+/ turns a line into a note and back, F12 jumps to where a name is made, F2 renames it everywhere, and Ctrl+Shift+P finds anything the Studio can do."],
        big: "F5 runs, Ctrl+Shift+B builds, and Ctrl+Shift+P finds everything else.",
        caption: "Type, press F5, and the Output panel answers. Tap Play.",
        demo: ["New Project → Console App", "write main.epp", "F5 → Output", "Ctrl+Shift+B → .exe"]
      },
      deep: {
        more: ["The C++ View shows the C++ your program turns into, line for line — a good way to learn C++ as you go.",
          "Turbo (Build › Turbo: Fastest Programs) is on by default: it changes how fast a program runs, never what it prints."],
        ex: { code: src(["note Press F5 to run me.", "out prn \"Hello from the Studio!\"", "i flt 3", "  out prn \"line @i\""]),
          walk: ["Line 1: a note — skipped.", "Line 2: Hello from the Studio!", "Lines 3–4: line 0, line 1, line 2."] },
        mistake: "Moving lines in by hand with the space bar and getting three spaces. Let Enter and Shift+Tab do it: two spaces a level."
      } },
    { title: "When the Studio Says Something", chapter: "Beyond the basics · English++ shelf", line: ["x is a+b", "x is 1&2"],
      content: {
        story: ["The Studio tells you about every mistake in plain words, on the right line. The one you'll see most: This line has 4 words. Every line has exactly 3: who, the root, and what.",
          "Typed some C++ out of habit? The Studio says what to write instead: no commas (use &), no square brackets (use @ for a position), no dots except in a number (use @ to reach inside), no curly brackets (move lines in).",
          "Used a name before making it? I don't know y yet. Make it first, like y is 0 — and, if it looks like a spelling slip, Did you mean count?"],
        big: "Every mistake comes in one sentence, on the right line, with what to write instead.",
        caption: "A wrong line, the Studio's sentence, and the fix. Tap Play.",
        demo: ["x is a + b", "5 words — write x is a+b", "x is v[0]", "no square brackets — write v@0"]
      },
      deep: {
        more: ["A mistake while the program runs names its line too: The program stopped on line 3, and what it was doing.",
          "The Problems panel lists every mistake in every file; click one to jump to it."],
        ex: { code: src(["a is 2", "b is 3", "x is a+b", "v is 1&2", "out prn x", "out prn v@0"]),
          walk: ["Line 3: math with no spaces is one word.", "Line 4: & instead of a comma.", "Lines 5–6: 5, and @0 instead of [0]: 1."] },
        mistake: "Fixing the line the Studio didn't name. Start with the first message: one slip can cause the rest."
      } },
    { title: "Better Than C++", chapter: "Beyond the basics · English++ shelf", line: ["a ebk now", "out prn rex"],
      content: {
        story: ["The same 13 jobs, written in English++ and in C++, printing the same thing: about half the lines, about a third of the typing, and no control marks at all — 0 against 651. All 13 built in 6.69 seconds, against 14.75 for C++: more than twice as fast, because the Studio reads the C++ library once and keeps it.",
          "Some things C++ just doesn't do. A box you forgot to fill reads junk in C++; in English++ everything starts as zero or empty. Going past the end of a list reads other memory in C++; English++ stops and shows you the line.",
          "Leaving two loops at once needs a flag in C++; English++ says a ebk now. Printing a list or an object needs code in C++; English++ just prints it."],
        big: "Fewer lines, no marks, faster builds — and mistakes that stop on the right line instead of reading the wrong memory.",
        caption: "The same job: a few lines of English++ against a page of C++. Tap Play.",
        demo: ["hello · 1 line vs 5", "print a list · 5 vs 17", "leave two loops · 6 vs 15", "all 13 · 123 lines vs 221"]
      },
      deep: {
        more: ["The safety checks cost something: reading a list by position checks the position first. Walking a list with fea costs nothing extra, and Turbo removes the checks it can prove aren't needed.",
          "The programs and the script that measures them are kept with the Studio's source code, in a folder called benchmarks, so anyone can measure again."],
        ex: { code: src(["a flt 3", "  b flt 3", "    a*b ieq 2", "      a ebk now", "    out prn a*10+b", "out prn \"done\""]),
          walk: ["Lines 1–5: two counting loops print 0, 1, 2, 10, 11.", "Lines 3–4: when a*b is 2, a ebk now leaves both loops at once.", "Line 6: done."] },
        mistake: "Thinking safety makes English++ slow. Most checks are proved away by Turbo, and fea never needed one."
      } },
    { title: "Turbo: Faster Than C++", chapter: "Beyond the basics · English++ shelf", line: ["scores lso now", "ages mak map@txt@num"],
      content: {
        story: ["Turbo is how the Studio builds English++ programs, and it's on by default. It never changes the language or what a program prints — it gets there sooner.",
          "Because every line is three words, the compiler can read exactly what each line touches, which a C++ compiler can't. So it proves list positions are safe and removes their checks, splits loops across every core, sorts with radix sort, keeps maps as B+ trees and remembers the answers of functions that call themselves.",
          "Across 25 measured jobs, the natural English++ program was faster than the natural C++ one on 18, within 3% on 5 and slower on 2 — 2.46 times as fast on average. A C++ expert can always match it by hand: the claim is about writing the obvious program."],
        big: "Turbo makes the obvious English++ program faster than the obvious C++ one, without changing what it prints.",
        caption: "Same answers, sooner: a check proved away, a loop on every core. Tap Play.",
        demo: ["fib · 153x (remembered answers)", "sort_ints · 4.1x (radix sort)", "tree_map · 5.1x (B+ tree)", "25 jobs · 2.46x on average"]
      },
      deep: {
        more: ["Every Turbo build is checked against the plain build: same output, same messages, same exit codes. A test build puts every removed check back and stops with TURBO PROOF FAILED if one ever fires.",
          "A program with a library (raylib, SDL, Qt) or lines of C++ of its own is built the plain way, and C++ is still ahead for hand-tuned code, other platforms and decades of tools."],
        ex: { code: src(["total is 0", "v is 3&1&2", "v lso now", "n fea v", "  total add n", "out prn v", "out prn total"]),
          walk: ["Lines 2–3: Turbo sorts numbers with radix sort, in one pass per digit.", "Lines 4–5: a walk with fea needs no position checks at all.", "Lines 6–7: [1, 2, 3] and 6 — the same answer either way."] },
        mistake: "Expecting Turbo to change what a program prints. It never does; the one difference is the order of walking a hsh or a bag, which C++ never promised."
      } },
    { title: "The Revolutionizer", chapter: "Beyond the basics · English++ shelf", line: ["best olt left", "n is n+1"],
      content: {
        story: ["The Revolutionizer is a second compiler behind the first. A Turbo build turns English++ into a language that is only numbers, rewrites those numbers by rules of algebra, and a second compiler turns them into C++.",
          "As text, if (best > left) is a string; as numbers it's a tree that says compare, best, left — and a rule about trees can say exactly when it holds. The smaller of two becomes bits with no branch, x % 8 == 0 becomes (x & 7) == 0, and a whole loop of adding becomes one formula.",
          "It stays right by a round trip: a line is printed the way the second compiler would and compared letter for letter, or it stays raw. edit_distance went from 1.02x to 1.45x the speed of C++ with one rule."],
        big: "English++ becomes numbers, rules of algebra rewrite them, and the C++ that comes out runs faster.",
        caption: "A line becomes a tree of numbers, and a rule makes it faster. Tap Play.",
        demo: ["n is n+1", "→ set · two · 21 · n · 1", "→ the math", "→ C++"]
      },
      deep: {
        more: ["Rules only hold where they say they hold: whole numbers only, no division by a name that might be zero, no reading a list early. Each rule was broken on purpose, 15 ways, to check that a test notices.",
          "So far 30% of the lines in the Turbo tests are ones the math can read; the rest go through raw, untouched."],
        ex: { code: src(["best is 9", "left is 4", "left ilt best", "  best is left", "out prn best", "s is 0", "i flt 5", "  s add i", "out prn s"]),
          walk: ["Lines 1–5: the smaller of two — the Revolutionizer turns this if into bits with no branch: 4.", "Lines 6–9: a whole loop of adding becomes n(n-1)/2: 10."] },
        mistake: "Thinking numbers are fast by themselves. Machine code is numbers too; the speed comes from the rules the numbers make possible."
      } }
  ];

  var glossary = [
    ["argument", "A value you hand to a function. In English++: add_up&1&2."],
    ["array", "A row of things that can't change size. In English++: arr@num@5."],
    ["base 64", "A way to write anything in plain letters and numbers, safe to send anywhere. In English++: xbe and xbd."],
    ["bit", "A tiny switch that is on or off; every number is made of them. In English++: nnd, nsl and their friends."],
    ["boolean", "A value that's yes or no. In English++: yno."],
    ["bug", "A mistake in a program."],
    ["build", "Turn a program into an .exe file that runs on its own. In the Studio: Ctrl+Shift+B."],
    ["byte", "8 bits: a number from 0 to 255. In English++: byt, and hby and hrb for files of bytes."],
    ["channel", "A pipe that threads pass values through, with no lock needed. In English++: chn@num."],
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
    ["generator", "A function that hands out one value at a time, only as far as it's asked. In English++: gnr@num and eyd."],
    ["global", "A box that every function can see. In English++: mgl."],
    ["hash", "A fingerprint of some text: the same text always gives the same one. In English++: xha."],
    ["header", "A C++ file that says what's in another file. In English++: xic."],
    ["IDE", "A program for writing programs — for English++, that's the Studio."],
    ["inheritance", "A child getting what its parent has. In English++: Dog dcl Animal."],
    ["integer", "A whole number. In English++: num."],
    ["IntelliSense", "The Studio guessing what you will type next. Tab takes the guess."],
    ["JSON", "Text that programs use to pass lists and maps to each other. In English++: tjs and jsn."],
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
    ["port", "A numbered door on a computer that a server listens at. In English++: srv&8080."],
    ["private", "Can only be used inside the class. In English++: dsc and dhd."],
    ["program", "A list of things for a computer to do."],
    ["recursion", "A function that runs itself."],
    ["reference", "Another name for the same box. In English++: mrf."],
    ["regular expression", "A pattern for finding text. In English++: tmt, tma and trx."],
    ["return", "Give an answer and leave the function. In English++: ert."],
    ["root", "The middle word of every English++ line — what happens. Its first letter is the family, the other two are the job."],
    ["run", "Make the computer do what a program says. In the Studio: F5."],
    ["server", "A program that waits for others to connect. In English++: srv."],
    ["socket", "One end of a connection between programs. In English++: sck."],
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
    { name: "g — get", head: "get gln", what: "Asks the person for an answer: get reads one word, gln reads a whole line.", ex: "name get \"What is your name? \"" },
    { name: "h — hard drive", head: "hwr hap hrd hln hex", what: "Works with files and folders: write, append, read, lines, exists.", ex: "\"a.txt\" hap \"more\"" },
    { name: "i — if", head: "ieq ine ilt ile igt ige", what: "Runs the moved-in lines when the test passes.", ex: "x igt 3" },
    { name: "k — clock", head: "kel kda ktm kms kse kwk", what: "Reads the clock and the calendar: the time, the date, how long something took.", ex: "start is kms" },
    { name: "l — list", head: "lrm lin lso lrv lsu lwp", what: "Changes a collection: remove, insert, sort, reverse, shuffle, wipe.", ex: "scores lso now" },
    { name: "m — make", head: "mak mkn mgl mpt mrf mnw", what: "Makes a new variable: a box, a constant, a global, a pointer, a reference, a new thing.", ex: "rex mak Dog" },
    { name: "n — number", head: "nsq nab nro nra nmx", what: "Works out a number: square root, absolute value, rounded, random, biggest.", ex: "roll is nra&1&6" },
    { name: "o — otherwise", head: "oeq one olt ogt oth", what: "Tries again after an if; oth catches all the other times.", ex: "now oth now" },
    { name: "p — put", head: "put", what: "Prints and stays on the same line, so the next thing printed lands right after it.", ex: "out put \"one \"" },
    { name: "r — run", head: "rcm rwt rjn rdt rsd", what: "Reaches outside your program: run a command, wait a moment, or join a thread.", ex: "now rcm \"echo Hello from Windows\"" },
    { name: "s — should", head: "seq sge sgt sle slt sne", what: "Checks that should hold: a test that stops the program if it is wrong.", ex: "x sgt 3" },
    { name: "t — text", head: "tsz tuc tlc trp tsp ths", what: "Works with text: size, uppercase, lowercase, replace, split, has.", ex: "big is tuc&name" },
    { name: "u — until", head: "ueq uge ugt ule ult une", what: "Repeats until a test says yes: the other half of a loop.", ex: "n uge 6" },
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
      code: function (v) { return ["note A little pet shop", "days is " + v.days, "meal is " + v.meal, "shop mak vec@own@Pet", "d mwn Dog&\"Rex\"", "shop add d", "c mwn Cat&\"Tom\"", "shop add c", "day flt days", "  today is day+1", "  out prn \"Day @today\"", "  p fea shop", "    p wait now", "    now look_after p", "out prn \"The shop is closed.\"", "", "look_after dfn now", "  pet dpm see@own@Pet", "  name is pet@name", "  hunger is pet@hunger", "  hunger ige 6", "    sound is pet@sound", "    out prn \"  @name says @sound, and gets fed.\"", "    pet feed meal", "  now oth now", "    out prn \"  @name is fine, with hunger @hunger.\"", "", "Pet dcl now", "  name dfd txt", "  hunger dfd 0", "  Pet dmk now", "    n dpm txt", "    name is n", "  wait dfn now", "    hunger add 2", "  feed dfn now", "    food dpm num", "    hunger is nmx&hunger-food&0", "  sound dmb txt", "", "Dog dcl Pet", "  Dog dmk now", "    n dpm txt", "    now dbs n", "  sound dov txt", "    sound ert \"Woof\"", "", "Cat dcl Pet", "  Cat dmk now", "    n dpm txt", "    now dbs n", "  sound dov txt", "    sound ert \"Meow\""]; },
      run: function (v) { var o = []; var pets = [{ name: "Rex", sound: "Woof", hunger: 0 }, { name: "Tom", sound: "Meow", hunger: 0 }]; for (var day = 0; day < v.days; day++) { o.push("Day " + (day + 1)); for (var k = 0; k < pets.length; k++) { var p = pets[k]; p.hunger += 2; if (p.hunger >= 6) { o.push("  " + p.name + " says " + p.sound + ", and gets fed."); p.hunger = Math.max(p.hunger - v.meal, 0); } else { o.push("  " + p.name + " is fine, with hunger " + p.hunger + "."); } } } o.push("The shop is closed."); return o; },
      explain: "Each pet's hunger grows by 2 a day. At 6 or more it says its sound and gets fed, and the meal takes the hunger back down. The book writes day fle 3, which also runs four days." },
    { name: "Shopping List", about: "The book's list that remembers: add things, save them to a file, and read them back.",
      vars: [{ key: "count", val: 2, min: 0, max: 3 }, { key: "drop", label: "drop milk (0=no, 1=yes)", val: 1, min: 0, max: 1 }],
      code: function (v) { var lines = ["note A shopping list that remembers.", "LIST_FILE mgl \"shopping.txt\"", "items is load&"]; var all = ["milk", "bread", "eggs"]; for (var i = 0; i < v.count; i++) lines.push("items add \"" + all[i] + "\""); lines.push("now save items", "now show items"); if (v.drop && v.count > 0) lines.push("items lrm \"milk\"", "now save items", "now show items"); lines.push("out prn \"Bye!\"", "LIST_FILE hrm now", "", "load dfn vec@txt", "  hex&LIST_FILE ieq nay", "    load ert vec@txt&", "  load ert hln&LIST_FILE", "", "save dfn now", "  list dpm see@vec@txt", "  text is ctx&list&\"\\n\"", "  LIST_FILE hwr text+\"\\n\"", "", "show dfn now", "  list dpm see@vec@txt", "  cct&list ieq 0", "    out prn \"The list is empty.\"", "    show ert now", "  i flt cct&list", "    number is i+1", "    out prn \"@number. @list@i\""); return lines; },
      run: function (v) { var o = []; var all = ["milk", "bread", "eggs"]; var items = []; for (var i = 0; i < v.count; i++) items.push(all[i]); var show = function () { if (items.length === 0) o.push("The list is empty."); else for (var j = 0; j < items.length; j++) o.push((j + 1) + ". " + items[j]); }; show(); if (v.drop && items.length > 0) { var k = items.indexOf("milk"); if (k >= 0) items.splice(k, 1); show(); } o.push("Bye!"); return o; },
      explain: "The list lives in a file, so it remembers. load reads it back, save writes it, and show prints it numbered. The file itself is only a simulation here — the Studio writes a real one." }
];

  var vt = [
    /* 0–4 · printing */
    { line: 'out prn "{w}"', why: "out prn prints a text and goes to the next line." },
    { line: "out prn {v}", why: "prn prints a name's value, with no quote marks." },
    { line: 'out put "{w} "', why: "put prints and stays on the same line." },
    { line: 'out prn "{w} @{v}"', why: "@ inside a text fills in a name's value." },
    { line: "out prn {v}&{u}", why: "& joins values, and prn prints them with a space between." },
    /* 5–9 · names and kinds */
    { line: "{v} is {n}", why: "is gives a name a value; a whole number here." },
    { line: "{v} is {dec}", why: "A number with a point is a decimal." },
    { line: '{sv} is "{w}"', why: "Words in quote marks are a text." },
    { line: "{v} is '{L}'", why: "One letter in single quote marks is a letter." },
    { line: "{v} is {b}", why: "A yes or no holds yes or nay." },
    /* 10–14 · making boxes */
    { line: "{v} mak num", why: "mak makes an empty whole number, starting at 0." },
    { line: "{sv} mak txt", why: "mak txt makes an empty text." },
    { line: "{v} mak dec", why: "dec is the kind for decimals." },
    { line: "{v} mak big", why: "big is a big whole number, past two billion." },
    { line: "{v} mkn {n}", why: "mkn makes a constant that can never change." },
    /* 15–19 · changing in place */
    { line: "{v} add {n}", why: "add adds to what's already in the box." },
    { line: "{v} asb {d}", why: "asb subtracts in place." },
    { line: "{v} aml {d}", why: "aml multiplies in place." },
    { line: "{v} adv {d}", why: "adv divides in place; whole numbers stay whole." },
    { line: "{v} amd {d}", why: "amd keeps the remainder." },
    /* 20–24 · math in one word */
    { line: "{v} is {u}+{n}", why: "Math goes in one word, with no spaces." },
    { line: "{v} is {u}*{d}", why: "* multiplies, and comes before + and -." },
    { line: "{v} is {u}%{d}", why: "% is the remainder as a value." },
    { line: "{v} is nsq&{n}", why: "nsq gives the square root; & hands it the value." },
    { line: "{v} is nra&1&{n}", why: "nra gives a random whole number between two values." },
    /* 25–29 · text */
    { line: "{sv} is tuc&{sv}", why: "tuc gives back a text in uppercase." },
    { line: "{v} is tsz&{sv}", why: "tsz is how many letters a text has." },
    { line: '{sv} is {sv}+"{w}"', why: "+ joins two texts." },
    { line: 'ok is ths&{sv}&"{w}"', why: "ths asks if a text has another text inside it." },
    { line: "{sv} is tcu&{sv}&0&{d}", why: "tcu cuts out part of a text, from a position." },
    /* 30–34 · yes, nay and tests */
    { line: "ok is {v}>{n}", why: "A comparison gives back yes or nay." },
    { line: "ok is {v}=={n}", why: "== asks if two values are equal." },
    { line: "both is {v}>0&&{u}>0", why: "&& is yes only when both sides are yes." },
    { line: "ok is {v}!={n}", why: "!= asks if two values are different." },
    { line: "ok is {v}<={u}", why: "<= is less than or equal." },
    /* 35–39 · if and otherwise */
    { line: "{v} ilt {n}", why: "ilt: if less than, do the lines moved in under it." },
    { line: "{v} igt {u}", why: "igt: if greater than." },
    { line: "{v} ieq {n}", why: "ieq: if equal." },
    { line: "{v} olt {n}", why: "olt: otherwise, if less than — right after an if." },
    { line: "now oth now", why: "oth runs all the other times." },
    /* 40–44 · switch */
    { line: "{v} bsw now", why: "bsw checks one value against many cases." },
    { line: "now bcs {n}", why: "bcs is one case of a switch." },
    { line: "now bcs {n}&{n2}", why: "& lets one case match two values." },
    { line: "now bdf now", why: "bdf runs when no case matched." },
    { line: "{v} ine {n}", why: "ine: if not equal." },
    /* 45–49 · counting loops */
    { line: "i flt {n}", why: "flt counts with i from 0 while it's less than the limit." },
    { line: "{v} fle {n}", why: "fle counts while less than or equal." },
    { line: "{v} fgt 0", why: "fgt counts down while greater than 0." },
    { line: "i flt cct&{arr}", why: "Count every position of a list." },
    { line: "now ebk {v}=={n}", why: "ebk with a test leaves the loop when it's yes." },
    /* 50–54 · while, forever and until */
    { line: "{v} wlt {n}", why: "wlt repeats while less than." },
    { line: "{v} wgt 0", why: "wgt repeats while greater than." },
    { line: "now wfv now", why: "wfv repeats forever, until something breaks out." },
    { line: "now enx {v}<{n}", why: "enx skips to the next turn when the test is yes." },
    { line: "{v} uge {n}", why: "After a bdo block: go again until greater or equal." },
    /* 55–61 · lists */
    { line: "{arr} is {n}&{n2}&{n3}", why: "& makes a list of values." },
    { line: "{arr} add {n}", why: "add puts an item on the end of a list." },
    { line: "out prn {arr}@0", why: "@0 is the first item: positions start at 0." },
    { line: "{arr}@{d} is {n}", why: "A position in the who spot changes that item." },
    { line: "{arr} lrm {n}", why: "lrm removes the first item equal to a value." },
    { line: "{arr} lso now", why: "lso sorts the list itself." },
    { line: "{v} fea {arr}", why: "fea walks through every item of a list." },
    /* 62–65 · asking a list */
    { line: "{v} is cct&{arr}", why: "cct is how many items there are." },
    { line: "{v} is csm&{arr}", why: "csm adds up every item." },
    { line: "{v} is cmx&{arr}", why: "cmx is the biggest item." },
    { line: "ok is chs&{arr}&{n}", why: "chs asks if a value is in the collection." },
    /* 66–69 · maps and sets */
    { line: "{m} mak map@txt@num", why: "A map from texts to numbers." },
    { line: '{m}@"{w}" is {n}', why: "@ with a key files a value in a map." },
    { line: "k&v fea {m}", why: "A walk through a map names the key and the value." },
    { line: "{arr} mak set@num", why: "A set keeps each value once, in order." },
    /* 70–74 · functions */
    { line: "{f} dfn num", why: "dfn defines a function that gives back a number." },
    { line: "{v} dpm num", why: "dpm is a value the function takes." },
    { line: "{f} ert {v}*{d}", why: "ert hands the answer back." },
    { line: "{v} is {f}&{n}", why: "& runs a function with a value." },
    { line: "now {f} {n}", why: "A function that gives back nothing runs on its own line." },
    /* 75–81 · classes */
    { line: "{c} dcl now", why: "dcl defines your own kind of thing." },
    { line: "{v} dfd {n}", why: "dfd is a field: something each one has." },
    { line: "{o} mak {c}", why: "mak with a class makes one thing of that kind." },
    { line: "out prn {o}@{v}", why: "@ reaches a field inside a thing." },
    { line: "{o} {f} now", why: "A thing's name, then what it can do." },
    { line: "{c} dcl {k}", why: "A parent's name in the last spot makes a child class." },
    { line: "{c} dmk now", why: "dmk runs when one is made." },
    /* 82–86 · problems and checks */
    { line: "now btr now", why: "btr tries the lines moved in under it." },
    { line: "e bch now", why: "bch catches the problem, straight after the try." },
    { line: 'now etw "{w} went wrong"', why: "etw throws a problem of your own." },
    { line: "{v} seq {n}", why: "seq: it should be equal, or the program stops." },
    { line: "{v} sgt 0", why: "sgt: it should be greater." },
    /* 87–93 · talking, files, the clock and threads */
    { line: '{sv} get "{w}? "', why: "get asks a question and keeps the answer." },
    { line: '"{sv}.txt" hwr "{w}"', why: "hwr writes a whole file: name first, text last." },
    { line: '"{sv}.txt" hap "{w}"', why: "hap adds to the end of a file." },
    { line: '{sv} is hrd&"{sv}.txt"', why: "hrd reads a whole file." },
    { line: "now rwt {n}0", why: "rwt waits, in milliseconds." },
    { line: "t mtd {f}&{n}", why: "mtd starts a function as a thread." },
    { line: "t rjn now", why: "rjn waits for a thread to finish." },
    { line: "p mpt {v}", why: "mpt makes a pointer to a box." },
    { line: "{sv} is tre&\"{w}\"&{d}", why: "tre repeats a text." },
    { line: "{v} is tct&{sv}&\"{w}\"", why: "tct counts how many times a piece is in a text." },
    { line: "out prn tfa&\"{} has {}\"&{sv}&{v}", why: "tfa fills each {} in a pattern with a value." },
    { line: "ok is cea&{arr}&{f}", why: "cea asks if each item passes a function." },
    { line: "ok is can&{arr}&{f}", why: "can asks if any item passes." },
    { line: "{arr} is crg&0&{n}&{d}", why: "crg makes a list by counting, with a step." },
    { line: "{v} is crl&{arr}&0&{f}", why: "crl rolls a list up into one value with a function." },
    { line: "{arr} lrw {d}", why: "lrw rotates a list: the first items go round to the end." },
    { line: "{v} msv 0", why: "msv makes a name that stays between calls." },
    { line: "now bdr now", why: "bdr runs its lines when the block around it ends." },
    { line: "{v} is nnd&{u}&{d}", why: "nnd gives the bits that are on in both numbers." },
    { line: "{v} is nsl&{u}&{d}", why: "nsl shifts a number's bits to the left." },
    { line: "{v} mak hug", why: "hug is a whole number of any size." },
    { line: "{v} is xha&{sv}", why: "xha gives a text its SHA-256 fingerprint." },
    { line: "{sv} is xbe&{sv}", why: "xbe turns text into base 64." },
    { line: "c add {n}", why: "add on a channel sends a value to another thread." }
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
  var FUNCS = ["cheer", "heal", "jump", "dance", "sing", "build", "dash", "shine", "spin", "lift", "launch", "glide", "wave", "float", "mend", "craft", "boost", "greet", "explore", "charge", "roar", "wiggle", "swim", "bounce", "juggle", "wobble"];
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
      if (k === "b") return r() < 0.5 ? "yes" : "nay";
      return null;
    },
    sandboxNote: "English++ in the book's main form — three words on every line: who, the root, and what — in the order The English++ Book teaches it, from out prn to threads and libraries. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your English++ progress is saved separately from every other track.",
    sourcesHTML: "English++ facts and syntax follow <i>The English++ Book</i> (for English++ Studio 3) and its Whole Chart, in the three-words-a-line form. Turbo and Revolutionizer facts follow the English++ Studio notes TURBO.md, SPEED.md and REVOLUTIONIZER.md. English++ Studio is a Windows program, so it can't run inside Code Block's checks: every practice program and library example is run instead by a stand-in written from the book and checked against the book's own examples, and every drill and Vault line is read by it. Every explanation is written in Code Block's own words."
  };
});
