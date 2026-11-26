# English++ Turbo

Turbo is how the Studio builds English++ programs. It is on by default (Build > Turbo: Fastest Programs). It never changes the language: the syntax is untouched, the C++ View still shows the plain C++, `tests/roots/golden` still pins that C++ byte for byte, and a Turbo program prints what a plain program prints. It gets there sooner.

[`SPEED.md`](SPEED.md) has the measurements.

## Can English++ be faster than C++?

English++ becomes C++, so anything it does, a person could write in C++. A C++ expert with enough time can always match it. The honest claim is narrower, and it is a real one: **a program written the natural way in English++ can beat the same program written the natural way in C++**, because the compiler writes C++ that nobody would write by hand and knows things a C++ compiler can't prove.

A C++ compiler has to assume a pointer might point anywhere, and a function might change anything. English++ has no such problem: a line is three words, a position is always a plain name or a number, and the compiler can read what every line touches.

## What it does

| Technique | What it does | Where it shows |
|---|---|---|
| Range analysis | Proves positions are inside their collection, and removes the check | loops over lists |
| Pins | Reads a collection's data and size once, before a loop, where measurement says that pays | loops over lists |
| Whole-program effects | Follows every function call to see what it can resize | loops that call functions |
| Automatic multicore | Splits loops it can prove are independent across every core | number crunching, grids |
| Remembered answers | Keeps the answers of pure functions that call themselves | tree recursion |
| Radix sort | O(n) for numbers and text, instead of O(n log n) | `lso` |
| Thread-caching allocator | Takes and returns a block with no lock | anything that makes many things |
| Flat hash tables | One dense array, instead of a heap block per item | `hsh`, `bag` |
| Sorted trees | B+ trees: dozens of items to a block, instead of a heap block per item, in the same order | `map`, `set` |
| Buffered output | No system call per line | `prn`, files |
| Fast files | Lines are found with memchr, a buffer at a time | `mfo`, `mfi`, `wln` |
| Text joined once | `a+"-"+b` works out the size and allocates once | text |
| Delay-loaded crash reporter, static runtime | No start-up cost, and no DLLs to ship | every program |

### How a check is removed

An abstract interpreter runs in step with the compiler. Every whole-number variable has an interval, plus symbolic facts of the form `x <= y + c` in the manner of ABCD (Bodik, Gupta and Sarkar, PLDI 2000). A collection's size is a symbol too. Comparisons add facts on the way into a block, and an exit adds them on the way past one (`x ilt 0`, then `now ebk now`).

The analysis assumes the wrapping arithmetic the hardware does, never the "overflow can't happen" of the C++ standard, because a proof here removes a safety check. Anything it can't follow, it forgets. A position it can't prove keeps its check, against a size held in a register, and stops on the same line with the same words.

A C++ library check can stop a program, and what that stop looks like matters more than it should. The library puts these stops inside code that is folded into the program's own, such as making a list, and a call on the path changes how Visual C++ compiles the hot loops beside it, though the path never runs: `sum_list`'s filling loop ran two fifths slower for it. C++ has no call there, only `__fastfail`, which nothing can catch. So a Turbo program leaves the reason in a variable and traps, and the crash filter every Turbo program already has finds the line and says what went wrong, as it does for a division by zero. A failed check says exactly what it said before, and a plain build keeps its call.

The flat tables reach their own arrays directly, because every slot comes from a mask and every item's number from the table itself, so the library's check on them could never fire. That was two more tests on the hottest path a table has, and `hash_num` runs 7% faster without them.

A whole-number position in a pinned list is checked in 32 bits, which saves a sign extension on every pass. The pin keeps the size capped at 2^31 for this, and never cut: a list that long holds every whole number that isn't negative, and a negative one is at the cap or past it, so the answer is the 64-bit answer at every size. The cap is worked out once, with the pin: inside the check it costs what the 32 bits save.

### When a loop is copied

A check that can't be proved ahead of time can often be made ahead of time. In `fannkuch` nothing says `k` is inside the list, because it was read out of the list:

```
i flt half
  j is k-i
  hold is perm@i
  perm@i is perm@j
  perm@j is hold
```

But `i` and `j` each move in a straight line with the counter, so if the first and the last of them are inside, every one is. One test goes in front of the loop, and a copy of the loop with no checks in it runs. If the test fails, the loop as it was runs instead, and stops on the line it would have stopped on, having printed what it would have printed. The test only chooses a copy. It can't change what happens, so a loop the test turns down is only slower. This is loop versioning, and it took `fannkuch` from 0.82x to 0.93x the speed of C++, against 0.96x with no safety at all.

The test is two comparisons where it could have been five, and that is most of what took `fannkuch` from 0.94x to 0.99x, because a loop that short pays for its test on every flip. Each one is in 32 bits, as a pinned check is: a first position that is negative is 2^31 or more in 32 bits, which is at the cap of a list or past it, and once the first is inside, the last is within 2^31 of it. Positions of one list also answer for each other. If a position with a name is inside at both ends, the distance between them is the loop's length, and it fits, so the counter itself needs no test. Of the counter plus a small number, only the furthest does. `tests/turbo/bad_version_*.epp` hold every one of these to the C++ of a plain build.

A position counts if it is the counter, a number, a whole number nothing in the loop changes, or a name made once from those, on a line of its own that always runs (`j is k-i`, `j is i+1`). Anything else keeps its check, in both copies. Only an innermost `flt` loop is copied, one that counts from 0, up to a limit it doesn't change, and makes no calls and no second names, so a program can't grow more than twofold. The test works in 64 bits against the capped size, so it can't overflow, and passing it means every position fits a whole number, so the loop can't either.

### When items are shifted up a place

The inside of an insertion sort moves every item that is bigger than a key up one place, going down from `j`:

```
now wfv now
  j ilt 0
    now ebk now
  v@j ile key
    now ebk now
  k is j+1
  v@k is v@j
  j asb 1
```

Item by item that is a read, a test and a write. `epp::ShiftUp` (in `englishpp_turbo.h`) reads and tests four at a time, and when all four go it moves them with one store. The same items go to the same places, and `j` ends where the loop would have ended it. `insertion` ran 1.64x the speed of the same C++ in a hand test with this, where splitting the search from the move (find the place, then one `memmove`) ran 0.82x: for short moves the call costs more than the loop.

One test goes in front: `j` is less than the size minus 1, so `j` and `j + 1` are inside, or the loop would stop at once. Then no check in the loop could have fired. If the test fails, the loop as it was runs, and stops on the line it would have stopped on. The rule (`ShiftUpLoop` in `roots_turbo.inc`) needs exactly the seven lines above (any of `ile`, `ilt`, `ige`, `igt` for the test), a list of `num`, a key and a `j` that are whole numbers of the function's own with no second name, `k` made in the loop and not used after it, and nothing else in the loop. Anything else keeps the plain loop. `tests/turbo/good_shift.epp` has all four tests, `good_shift_not*.epp` have lookalikes (an extra line, `k` read after, a key that is a second name, a list of `big`), and `bad_shift_*.epp` start past the end.

Not done: `dec` and `big` lists (SSE2 has no 64-bit compare), and a `j` that counts the other way.

### When a loop goes on every core

All of these have to be proved:

- the counter changes only by its own step, and the limit doesn't change;
- every write is to the loop's own variables, or to a position indexed by the counter, and those lists are read nowhere else in the loop;
- what is added up from outside is whole numbers, where order can't matter (never decimals, where it can);
- every function it calls is pure;
- every position in it is proved, so nothing can stop on a different line than it would in order.

A loop must also do real work on the processor: it has to hold a loop or call a function. A flat loop over a big list stays on one core. It is limited by memory bandwidth, not by the processor, and it is already using vector instructions. Measured on this project's PC, 8 threads ran such a loop no faster than 1.

A loop that passes is timed on a small first slice, and only goes to other cores if that will pay for waking them.

#### The best so far

A loop that looks for the best of something writes a name that isn't its own on some passes and not on others, which the list above rules out:

```
steps igt best
  best is steps
  at is i
```

It can still be split. Every slice of the loop starts from the best there was before the loop, keeps its own best and what went with it, and offers that at the end if it found better. The best of the slices is the best of the loop. Two slices can find the same value, and then the one that starts first wins: only something strictly larger replaces what is there (or strictly smaller, with `ilt`), so a loop running in order would have kept the first one it met. Slices finish in any order, and the answer doesn't depend on it.

All of these have to hold, and a loop that fails one runs in order:

- the test is `igt` or `ilt`, between the best and a whole number the pass made itself, and it doesn't matter which is said first;
- under the test are only lines that set names with `is`, and one of them sets the best to the very value that was tested;
- the best and the names set with it are whole numbers, read by that test and nowhere else in the loop, and written under it and nowhere else;
- the value fits the best exactly: a long value kept in a best that isn't long could be cut short, and then what is kept isn't what was tested.

`ige` and `ile` are left alone. They keep the last of two equals, and telling "found the same again" from "found nothing" would take a mark inside the loop.

#### A while that counts

`i wlt n` whose body ends with `i add 1` is a for with a counter that is already there: the same test before every pass, the same step after it. Turbo reads it as one, so it can be proved, copied and split like any other for. It stays a while if anything in it jumps to the next pass with `enx`, because a for steps then and a while doesn't.

A split loop whose counter was already there starts where the counter is, and leaves it at the limit, as the loop in order does. The counter has to be a whole number of the function's own that nothing else has a name for.

Together these put `collatz` on every core: 1.05x the speed of C++ became 5.50x (0.993 s for C++, 0.181 s for English++), on this PC's 2 fast cores and 4 small ones. A counting while is made a for only when that puts it on every core; one that stays on one core is left as written, because the rules that carry values across passes know that shape. `tests/turbo/good_split_best.epp` has every shape of it, `good_split_best_not.epp` has twelve loops that look like it and aren't, and `bad_split_best_stops.epp` has one that stops part way. Three of the conditions were taken away on purpose, one at a time: the earlier slice winning between equals, the value fitting the best, and `enx` keeping a while a while. The tests failed each time. The others haven't been broken that way yet.

### A heap of whole numbers

`hep` is `std::priority_queue` in a plain build. For whole numbers, and for pairs of two whole numbers (`hep@par@big@num` is Dijkstra's), Turbo uses `epp::FastHeap` (`runtime/englishpp_turbo.h`) instead. It can, because of what makes a heap's answers: the biggest item comes out first, and two items that are equal are the same item, so every heap that is right gives the same items in the same order. The same is not true of decimals, where `-0.0` equals `0.0` and prints differently and not-a-number is equal to nothing, nor of text or a program's own classes, so those keep `std::priority_queue`. So does the whole program if anything can see inside the heap: a method that `FastHeap` doesn't have, a line of C++ of the program's own, or a library named by hand (`TablesBlind`, `TurboMethodCheck`). That is the same retry that tables and trees use.

What it does differently: an item is stored as one unsigned number (a pair as 128 bits, first then second), so comparing two is a subtraction with a borrow and no branch. The library's branches depend on the data, and the processor guesses them wrong about as often as right. Taking the top off walks a hole down to a leaf along the bigger child, chosen with no branch, and puts the last item in from there. `top` gives the item by value, not a reference, so two threads asking one heap for its top never share a place to keep it. An empty heap stops on the same check as before, with the same words (`priority_queue empty before pop`).

What was tried and lost, on the Dijkstra grid with 2.25 million pushes and pops and a heap of at most 3,300: a 4-ary heap (slower than `std::priority_queue`: more compares to choose a child, and the heap is small enough that depth isn't the cost), a binary heap with hole sifting alone (level with the library), a branch-free compare of the pair as two fields (7% faster), and a deferred pop that lets the next push take the top's place (slower). What won is the 128-bit key together with the branch-free child.

`tests/turbo/good_heap_pairs.epp` and `good_heap_whole.epp` fire (`note rule: heap`). `good_heap_decimals_not.epp`, `good_heap_text_not.epp` and `good_heap_pair_with_decimal_not.epp` must not. `bad_stop_heap_pop_pair.epp` and `bad_stop_heap_top_pair.epp` stop on an empty heap, on the same line, with the same words, as a plain build.

### Finding in a text

`s@find&"xyz"&p`, with a text or a letter to find and a whole number to start from, is `epp::TextFind`. It answers what `std::string::find` answers, including for an empty piece, a start past the end and a negative start (which is a huge one), but it looks at 16 places at once: the first and the last letter of the piece are compared to 16 places by SSE2, which every x64 processor has, and only the places where both match are looked at in full. A piece of one letter is `memchr`. Nothing needs AVX2 or a test of what the processor can do. `text_build` spent four fifths of its time here, and 0.68 s for 30 searches of a 40 MB text became 0.33 s in a stand-alone test. `tuc` was left alone: it is already a loop Visual C++ vectorizes, and it was 0.06 s of 0.9 s.

`good_find_text.epp` has the starts and the pieces (`note rule: find`). `good_find_not_other_methods.epp` is `rfind` and `find_first_of`, which are left to the library.

### A stride of yes-or-nos

```
j wle limit
  sieve@j is yes
  j add i
```

is the whole of the inner loop of a sieve: set places j, j+i, j+2i and so on in a list of yes-or-nos. Turbo puts `j = epp::StrideFill(...)` in front of it. That does the loop in one go if it can promise the answer is the same: every place is inside the list, the step is at least 1, j isn't negative, and the j that ends the loop fits j's kind. It gives back the j the loop would have ended with, so the loop after it is tested once and never runs. If it can't promise, it gives j back, and the loop runs as written and stops where it would have stopped, having set what it would have set. So it can only change how soon, never what happens. `wlt` is the same with a limit that isn't reached, and `nay` instead of `yes` clears.

The loop must be exactly those two lines, in that order; j is a `num` or `big` of the function's own; the step and the limit are whole numbers or names of one (a name nothing in the two lines changes); and the list is a plain name of a `vec@yno`.

Why it is faster: for a long list every step lands in another word, far from the last, and waiting for each one is most of the time. A step of 64 or more asks for the place 16 steps ahead early (`_mm_prefetch`), so the waits overlap. In a stand-alone test of the 60-million sieve, that took 0.79 s to 0.46 s. A pattern of whole words for small steps (set 32 places with one OR) was tried as well: another 10% on top, and left out, because it is a second algorithm to prove for it.

`good_stride_fill.epp` (140 steps and starts, set and clear, with a limit that is and isn't reached), `good_stride_wlt_and_num.epp` and `good_stride_outside.epp` fire; `bad_stride_backwards.epp`, `good_stride_not_two_lines.epp`, `good_stride_not_the_limit_moves.epp` must not, and `bad_stride_negative_start.epp` stops on the same line as a plain build. Taking the test of the size away from `StrideFill` made `good_stride_outside` fail. Allowing two lines or more in the loop made `good_stride_not_two_lines` fail. Taking away "the step is at least 1" was not caught, and honestly can't be: a step below 1 goes off the front of the list and stops on the same line either way, and a step of 0 would be an endless loop in a plain build, so no test can finish. The check stays because a step of 0 would otherwise divide by zero.

### How a `map` becomes a tree

`map` and `set` are `std::map` and `std::set` in a plain build. Those keep every item in a heap block of its own, so a lookup among half a million keys follows about twenty pointers, and most of them miss the cache. In a Turbo build they are B+ trees (`runtime/englishpp_tree.h`): a block of 1 KB holds dozens of items side by side, blocks of keys above them steer the way down, and the bottom blocks are chained in order for walking. The walk is in sorted order, exactly as it is with `std::map`.

Number keys are searched in place, without a branch. Text needs more: with a few hundred keys everything is in the cache, so what costs time is comparing texts, and a tree compares as many as `std::map` does. So each block keeps the first 8 bytes of its keys in a compact array, as numbers that sort the way the texts do, and a search counts through those and reads a text only to settle a tie. Keys that all start the same way (web addresses, file paths) would tie every time, so a block whose keys share 8 bytes or more leaves that part out.

Measured on one lookup, in nanoseconds, in a loop on its own, on the PC `SPEED.md` uses:

| Keys | `std::map` | Tree | Gain |
|---|---:|---:|---:|
| whole numbers, 500,000 | 644 | 67 | 9.6x |
| big numbers, 500,000 | 510 | 103 | 5.0x |
| big numbers, 1,000 | 78 | 16 | 4.9x |
| whole numbers, 20 | 16 | 5 | 3.2x |
| text, 300 | 83 | 42 | 2.0x |
| text, 200,000 | 503 | 246 | 2.0x |
| text sharing a long start, 300,000 | 1040 | 432 | 2.4x |
| text sharing a long start, 300 | 97 | 74 | 1.3x |
| text sharing a long start, 20 | 49 | 50 | 0.98x |

The last row is the worst found: a tie, where a tree has nothing to offer and `std::map` has nothing to lose. Walking every item took a measured 2 to 10 times less for text and 10 to 85 times less for numbers. As whole programs, built the same way apart from the map and run in turn, `tree_map` is 4.7x faster with a tree and `word_count` 1.3x, because most of the time in `word_count` isn't in the map.

### When a `map` stays `std::map`

A tree moves items when a block splits or joins another. `std::map` promises that a reference to an item lasts as long as the item, so a program may lean on that. A tree is used only if the compiler has seen that it can't matter. Any one of these gives the whole program `std::map`, which is always right and only slower:

- **A reference that outlives its line.** `m@k` is a reference, and so are `cmx&s` and `cmn&s`, the biggest and the smallest item. Each is safe while its line runs, if nothing else on the line can change the map. So a line may reach into a map only once and call no function of the program's own, and nothing may keep what it reached: no `mrf`, `mlo` or `mpt`, and no function giving back a reference. An operator a program wrote counts as a call that no line names (`s+m@k`), so a program with one can't reach into a map at all. `m@k is m@k+1` is allowed, because C++ finishes the right side first and that leaves a plain number. `m@a is m@b` isn't: the right side is the reference, and making `m@a` can move it.
- **An iterator that outlives its line.** `find`, `begin`, `end`, `lower_bound` and the like aren't methods of a tree. `insert` gives an iterator back, so it can only be a line of its own (`s insert 3`).
- **A walk that outlives a change.** A walk over a map, or over something inside one (`x fea m@k`), holds on to where it is. The lines in it can't change the map, call a function of the program's own, or keep a name for an item. If the map might have another name there (it was handed in, it is a global or a field, or it was lent to a function that could hand one back), those lines can't touch anything else that could be that map. A destructor or an operator runs without a line naming it, and a thread runs beside the lines, so a program with any of these can't walk a map at all. `cft` and `cmp` are walks too, and each runs a function of the program's own on every item, so neither can be given a map.
- **A move or a comparison that could be seen.** Keys have to be whole numbers, text, letters, yes-or-nos, enums, or pairs, tuples, lists and small arrays of those. Decimals aren't: not-a-number is neither below nor above anything, so what it does depends on which comparisons are made. What is kept can't run code of the program's own when it moves or dies, so a class has to be plain data: no constructor, destructor, operators, parents or virtual methods, and no pointer that might point at itself. An array of more than 64 items stays on the heap.
- **Something that can't be seen into.** Lines of C++ of the program's own, a type parameter, a value whose kind isn't known, or anything reached by name in C++'s own library (`std@begin&s`).

### When a `hsh` stays `std::unordered_map`

`hsh` and `bag` are `std::unordered_map` and `std::unordered_set` in a plain build. Those never move an item, and a program may lean on that. A flat table keeps its items in one array, so all of them move when it grows, and when it closes up the holes left by removing things. The order of a walk is allowed to differ (see *What Turbo changes*), and nothing else is, so a flat table is used only if the compiler has seen that nothing can tell. The rules are the ones a tree has. Any one of these gives the whole program `std::unordered_map`, which is always right and only slower:

- **A reference that outlives its line.** `m@k` and `m@at&k` are references, and so are `cmx&s` and `cmn&s`, the biggest and the smallest item. Each is safe while its line runs, if nothing else on the line can change the table. So a line may reach into a table only once and call no function of the program's own, and nothing may keep what it reached: no `mrf`, `mlo` or `mpt`, and no function giving back a reference. `m add k&v` is a reach, so `m add k&m@j` is two: the right side is a reference, and making `m@k` can move it. An operator a program wrote counts as a call that no line names (`s+m@0`), so a program with one can't reach into a table at all. `m@k is m@k+1` is two reaches as well, where `m@k add 1` is one.
- **An iterator.** `find`, `begin`, `end` and `emplace` aren't methods of a flat table, and neither is anything else a program rarely asks a table for. `insert` gives an iterator back, so it can only be a line of its own (`s insert 3`).
- **A walk that outlives a change.** A walk over a table, or over something inside one (`x fea m@k`), holds on to where it is. The lines in it can't change the table, call a function of the program's own, or keep a name for an item. If the table might have another name there (it was handed in, it is a global or a field, or it was lent to a function that could hand one back), those lines can't touch anything else that could be that table. A destructor or an operator runs without a line naming it, and a thread runs beside the lines, so a program with any of these can't walk a table at all. `cft` and `cmp` are walks too, and each runs a function of the program's own on every item, so neither can be given a table.
- **A move that could be seen.** Keys and items have to be what a tree's items have to be: numbers, text, letters, yes-or-nos, enums, the holders of those, and classes that are plain data, with no constructor, destructor, operators, parents or virtual methods, and no pointer that might point at itself. An array of more than 64 items stays on the heap, because a flat table makes a new item on the stack first. Something that can't move at all, like an `atm`, stays too.
- **A key that changes.** C++ won't build `k is 5` inside `k&v fea m`, because its keys are constant. A flat table's aren't, so it would build, and leave the key filed under the wrong hash. A program that tries gets `std::unordered_map`, and C++'s error, as it does in a plain build.
- **Something that can't be seen into.** Lines of C++ of the program's own, a type parameter, a value whose kind isn't known, or anything reached by name in C++'s own library (`std@begin&s`).

Three things mean the same without any fallback. What a table is moved out of is left empty. In a table made from a list, the first of two equal keys stays (`hsh&1&2&1&3`). And two tables are equal when they hold the same things, in any order.

### Where code lands

A loop that happens to cross a 64-byte line can run a fifth slower. Visual C++ only lines loops up on 16 bytes and has no way to ask for more, so which loops are unlucky is settled by everything in front of them, and any change anywhere moves them. With only the address of the same machine code changed, `virtual_calls` moved by 20% and its C++ by 27%. That belongs to the machine and not to the language: either build can be lucky.

It matters for measuring. One change here showed `virtual_calls` 12% slower and `insertion` 10% faster, and both were this and nothing else. `benchmarks/positions.py` compiles a build once and links it four times with a small filler in front, so the machine code is the same and only its address moves, and the mean of the four is what to compare. `/QIntel-jcc-erratum` and `/favor:INTEL64` left the spread much as it was. Lining up loops by hand would take a second compile of every program, which isn't worth what it would cost every build.

### After Turbo

What Turbo writes then goes through the Revolutionizer: the program becomes a language of numbers, rules of algebra rewrite those, and a second compiler writes the C++. `REVOLUTIONIZER.md` has it all.

## What is proved, and how

A wrong proof would remove a safety check, so nobody has to take the optimizer's word for it.

- `tools/run_turbo_tests.py` builds every program in `tests/turbo`, `tests/roots`, `examples/roots`, `benchmarks/head_to_head` and `benchmarks/speed` both ways and compares what they print, what they say on err, and their exit codes.
- Those Turbo builds use `/DEPP_VERIFY_PROOFS`, which puts back every check the optimizer removed. If one ever fires, the program stops with TURBO PROOF FAILED. Re-checking changes the program, so `--shipped` runs everything again, built as a person gets it.
- `tests/turbo/*_version_*.epp` try to break loop versioning: one past the end, a position going negative partway through, a position wrapping past the top of a whole number, a limit or a position that changes as the loop runs, a second name made before the loop, a list that shrinks. The first line says whether the loop has to be copied: `note version: yes` or `note version: no`. Each rule was also broken on purpose in a scratch compiler, one at a time, and the tests caught 11 of the 12. The other, that a loop makes no calls, is covered twice over: a call can only reach a local that is handed to it, and that already counts as writing it.
- `tests/turbo/bad_stop_*.epp` stop on the C++ library's own checks: an empty list, stack, queue and heap, inside a function, on a thread, after thousands of printed lines, and two of one kind in one function. They have to say what a plain build says, on the right line. The stop was broken on purpose in five ways and the tests caught four. The fifth, that only a program's own stop counts as a failed check, matters only for an illegal instruction, which no program here can make.
- `tests/position_check.cpp` holds both position checks to the plain meaning of a position, 40 million times, at sizes up to 2^62 that no test program could make. With the size cut to 32 bits, in place of capped, it fails.
- `tests/turbo/bad_*.epp` are written to fool the optimizer: counters changed in the body, lists shrunk through a reference, through a pointer, through a function two calls away; overflow; a list resized by a method; shadowed names. Each one really does go wrong, and has to stop on the same line, with the same words. Where a plain optimized build names a different line, a debug build decides who is right. (It has been Turbo every time: Visual C++ can fold two of the library's failed checks together, so a plain build sometimes names the wrong line. Turbo's checks carry their own.)
- `tests/alloc_stress.cpp` runs the allocator on 8 threads, hands blocks between threads, and ends threads with full caches, checking the contents of every block.
- `tests/tree_stress.cpp` drives 20 kinds of sorted map and set at random beside a real `std::map` or `std::set`, millions of steps in all. Their answers have to agree at every step, both are walked in both directions now and then, and the tree is checked for being a tree. Blocks shrunk to a handful of items were tested the same way, to reach every way a block can split, borrow and join.
- `tests/turbo/*tree*.epp` have a first line that says what they must get: `note tree: kept` or `note tree: std`. `tools/run_turbo_tests.py` reads the C++ and fails the test if the program got the other one, because a reference left dangling can go on printing the right answer. `bad_tree_*.epp` are written to go wrong on a tree, and they do: with the rules switched off, 39 of the 42 print something else or crash, 2 don't compile, and the last isn't a fallback test. A first version of these passed with no rules at all, because it held on to the first item of a map, which never moves. They now hold on to the last, and add below it.
- `tests/turbo/*hash*.epp` have a first line that says what they must get, the same way: `note hash: flat` or `note hash: std`. `bad_hash_*.epp` are written to go wrong on a flat table, and they do: with the rules switched off and the runtime as it was before them, all 34 print something else, crash or don't build. Every rule was also switched off on its own, and the programs written for it went wrong. Where two rules catch the same program, as they do for a kept iterator, it took both. Numbers are poor at showing this, because a number in memory that was just given back usually still reads right, so these programs use text, which reads as empty once it has moved. What they add to a table during a walk is empty too, so nothing they print depends on a table's order. `good_hash_stays_flat.epp` is the other side of it, and has to keep its flat table, so a rule can't get stricter than it needs to without a test noticing. `hash_num` and `hash_text` have the same first line, so the jobs in `SPEED.md` can't lose theirs unseen. `wont_build_*.epp` aren't programs: plain C++ refuses them, and Turbo has to as well.
- `tools/prove_ranges.py` proves the math a removed check rests on, with the Z3 solver: see below.
- `tools/check_removed.py` checks each check Turbo removes, program by program: see below.
- `tools/run_turbo_tests.py` also fails a test whose Turbo C++ didn't build, rather than letting it quietly build the plain way.
- `tools/fuzz_turbo.py` writes random programs, each of 24 small functions, and holds Turbo to a build with nothing optimized: what they print, their exit code and the line a stop names. Everything above had passed with a dozen things wrong, in rules that had only been tested by the person who wrote them. Run it after any change to a rule.

The plain C++ is what a program means. If Turbo's C++ ever failed to build, the Studio would build the plain C++ instead, and the person would never know.

### The range math, proved

Turbo removes a check when it works out that a position can't be outside its list. `tools/prove_ranges.py` proves the math that conclusion rests on, for numbers of any size, and it runs as part of `tools/prove_rules.py`:

- **What a word is worth:** `+ - * / %`. If the facts about two values are right, the fact about the answer is right, C++ gets that answer without wrapping, and the compiler's own sums didn't wrap.
- **What a test teaches:** each of the six comparisons, true or false.
- **Chains of bounds:** up to four links, as `BoundTo` follows them.
- **`Proved`:** each of the three ways a position is shown to be inside.
- **What a line leaves behind:** `is`, `add`, `asb`, `lrs`, and two facts about one name.
- **What a loop keeps:** by induction over passes, for counters going up and down and for a guard near the top of the body.

The rules are written once and run two ways. Z3 takes them with any value. Real numbers run them beside the compiler's own code, and that code isn't copied: the tool cuts it out of `roots_turbo.inc`, builds it, and compares the two on 480,000 cases at the edges of each kind. Real programs are held to it as well: on 6,000 programs a check went just where the model says, 1,197 of them with the check gone. Nineteen flaws put into the rules each give a counterexample, and nineteen breaks to the compiler's real code are each noticed.

Working through the rules this exactly found six holes, five in what a loop keeps and one in offsets. Each really went wrong in a program, each is now a `bad_range_*` test, and the tests and random programs before it had missed all six:

- A limit written in the loop: what it was worth before the loop was taken to hold on every pass.
- A floor written in the loop, the same way. This one printed a wrong number.
- A rise in a loop inside the loop: a pass rises by more than the line says.
- A fall in a loop inside the loop. This one printed a wrong number.
- A bound on a name kept when what it was about had changed. A list that shrank in the loop printed a wrong number.
- An offset too big for 64 bits, though the value it led to wasn't.

None of the fixes changed the C++ of any other program in `tests/turbo`, `tests/roots`, `benchmarks` or `examples/roots`, so they cost no speed there.

What this doesn't prove:

- That facts reach the right lines, in general. Which facts a branch, a call or a closing block lets through is the rest of Turbo's logic, about 3,000 lines. `tools/check_removed.py` checks the answers for one program at a time instead: see below.
- Checks that are moved, not removed: hoisting and copied loops.
- The facts about rows of a table, in general. `tools/check_removed.py` checks their answers, program by program.
- A list of 2^31 items or more. `cct` is an `int`, so its count is wrong past that, in plain builds too, and the proof assumes no list gets there.

So the tests and the checks put back during testing still matter. What has changed is that the arithmetic is proved, not only tested.

### Each removed check, checked

The proofs above say the math is right. They can't say Turbo used it on the right facts, so `tools/check_removed.py` asks about the answers. It reads a program's three-word lines for itself, works out what each line does to each name and each list's size, and asks Z3 whether a removed check can fail on any path, for any input. It shares no code with the compiler and doesn't know how Turbo decided.

The compiler tells it which checks went, what kind each name is, which loops it swapped, and what it believed at each loop. A belief is a claim to test: it has to hold on the way in and at the end of any pass that leaned on it, which is induction over passes. `roots_check <folder> --facts <out> --turbo` writes all that out, and it changes none of the C++.

Each removed check comes out one of four ways: confirmed, wrong, the solver gave up, or not followed. A line it doesn't understand stops it on that function, and those checks count as not followed, never as fine. So does a check resting on a belief it couldn't show.

| Programs | Removed checks | Confirmed | Wrong | Not followed |
|---|---:|---:|---:|---:|
| `tests/turbo` (340) | 627 | 627 | 0 | 0 |
| Random programs from `fuzz_turbo.py` (300) | 83,799 | 83,155 | 0 | 644 |
| Small programs dense in tables, from `tools/gen_tables.py` (3,516) | 19,341 | 19,341 | 0 | 0 |
| Small programs dense in range math (7,000) | 2,541 | 2,541 | 0 | 0 |

The solver gave up on none. The random programs also tested 2.78 million loop beliefs, and none was wrong. The 644 are 360 reached through something that isn't a list, 236 in lists a function doesn't own, and 48 in rows it couldn't follow.

Three things say it can fail:

- Given what the compiler believed before the range fixes, it finds all six `bad_range_*` holes, having been told about none of them.
- It led to two more holes, below, one of them reported outright. Working out what to ask of a loop that sizes rows found a third, and given what the compiler believed before that fix it flags all eight `bad_rect_*` tests.
- `tools/break_turbo.py` breaks Turbo's real code 45 ways. On the final source a run stopped by its time limit got through 21 of them: it noticed 11, and the other ten removed no check the clean compiler keeps, so there was nothing to notice. That includes the break to row sizes that went unnoticed before rows were followed. With nothing broken it said nothing. Of the rest, 16 last ran before rows were followed, all noticed then, and the eight breaks to what Turbo knows about rows haven't been run.

A random or test program that passes isn't a proof about every program. This is a check on the programs it is given, and it's a testing tool: it needs Z3, so it doesn't run in the Studio.

It doesn't follow classes, lists three deep, or a row that goes by another name and is resized through it, and a function's own lambdas stop it. It counts the checks `VersionLoop` moves in front of a loop but doesn't check them: 76 in `tests/turbo`. It tests a read against the row as it is on that line, so it doesn't show that a pin taken earlier still points at that row.

### A name `fea` makes

`n fea list` makes `n` another name for an item, so writing `list@0` can change `n`. Turbo treated `n` as a name of its own and kept what it had learned about it. A read after such a write could go outside its list, and in `tests/turbo/bad_item_written.epp` it printed a number from outside the list where a plain build stops. A row found through `n` stayed pinned after `n` had changed, and `good_item_row_stays.epp` printed 3 where the answer is 9. That one printed a wrong number with no stop, and putting the removed checks back didn't catch it.

Now only `n`'s kind is counted on. Turbo tracks nothing about it and doesn't keep a row or a position out of a loop because of it.

The checker reported the checks that depended on `n` as not followed, and working out why found the hole. Fourteen more attacks on names and lists that change where no line says so all held: statics, lambdas, moves, destructors, operators, try, switch, generators, `bdr`, and loops with no test. Eight of them are now `bad_hidden_*` tests.

### A row hiding a pop

`t lpl now` shrinks `t`, and `t@1 lrs 3` resizes a row and leaves `t` the size it was. The code for the second took `t` out of the list of things that had shrunk, but that list belongs to the whole block, so a pop earlier in the same `if`, loop or `try` was forgotten. Past the block Turbo went on believing the old size, and a read past the new end lost its check. The checker reported that belief as wrong on one random program in 300, and `bad_row_resize_hides_pop.epp` is that program cut down: the build with every removed check put back stops with `TURBO PROOF FAILED`. Nothing comes out of that list now.

Between them the two fixes changed the C++ of one older test, `bad_item_alias_object`, and none of `tests/roots`, `benchmarks` or `examples/roots`, so they cost those programs no speed.

### Rows of a table

The checker keeps one Z3 array for each table, from a position to how many items that row holds, so `t@p` and `t@q` are the same row whenever `p` and `q` are equal. What Turbo believes of every row is a claim about a row nothing is known about, which makes it a claim about all of them.

When a loop says it sized every row, that is shown by induction on its counter. Each row the counter has passed holds what it should, before the first pass and at the end of each one, and every way out of the loop has to have passed them all.

### A loop that doesn't reach every row

`t@i lrs n` right under `i flt n` told Turbo that every row of `t` holds at least `n` once the loop is over, so `t@j@k` lost its check on any row. Nothing asked whether the loop really did that:

- A counter that was already there starts where it was, so `i is 1` and then `i flt n` never sizes row 0.
- `enx` before the line skips a row.
- `ebk` anywhere in the loop leaves the rows after it as they were.
- A size that changes in the loop leaves each row as long as it was on that row's pass. `k is i+1` and then `t@i lrs k` gives rows of 1, 2 and 3, and Turbo believed all three held as many as `k` does at the end.

A row too short for the read was read past its end. The released build printed a number from outside the list where a plain build stops, with no stop of its own, and the eight `bad_rect_*` tests each do that on the compiler before the fix. With every removed check put back they stop with `TURBO PROOF FAILED`.

Now the counter has to be new, nothing can leave the loop or skip the rest of a pass, and a size only counts if it lasts through the loop. An `ebk` or `enx` in a loop inside doesn't count against it, unless it names a loop. Only those eight tests changed their C++, out of 445 programs in `tests/turbo`, `tests/roots`, `benchmarks` and `examples/roots`, so this costs the others no speed.

One thing the random programs turned up isn't Turbo's doing. When a sum overflows 64 bits, C++ doesn't say what happens, and Visual C++ can give a different number once it optimizes. A loop testing `x*x/8` with `x` past 3 billion printed one number with nothing optimized and another at `/O2`, in hand-written C++ with no English++ in it as well, so a Turbo build can differ from a debug build there. A position is checked as whatever number it turned out to be, and Turbo treats a sum that might wrap as not known, so this can give a wrong number but not a read outside a list.

## What Turbo changes, and what it doesn't

- **A division by zero stops, on its own line.** C++ calls it undefined, so Visual C++ may take a division away: `x / x` is 1 to it, and a result nobody uses needs no dividing. A plain build leaves the rest to the processor, and an optimized plain build can miss one or name a line nearby. Turbo checks a whole number divided by anything it can't prove isn't 0, and a loop that does that stays in order.

- **The order of walking a `hsh` or a `bag` is different.** Turbo walks them in the order things were added, and a plain build walks them in an order of the C++ library's choosing. C++ promises no order at all for these, so no program can rely on one, and Turbo's is at least the same on every run. A `map` or a `set` keeps its sorted order, always. This is the one way a Turbo program's output can differ from a plain one, and a program that needs an order should use `map` or `set`.
- Printed text can reach the screen up to 15 milliseconds after it was printed. It is written at once if the program asks for input, writes to err, starts another program or stops. A program killed from outside (Stop in the Studio) can lose those last few milliseconds of output.
- A file being written can be up to 15 milliseconds behind what the program has done. It is written at once if the program reads a file or asks about one, starts another program, or stops, however it stops.
- Memory given back to the allocator is kept for reuse, in the size it was used at. A program whose small blocks change size completely partway through can use more memory than it would have.
- A loop on every core uses every core. Its answer is the same.

## What doesn't get Turbo

- A program that uses a library (raylib, SDL, SFML, OpenGL, Qt). Those share a C++ heap with the program, so it is built the plain way.
- A program with lines of C++ of its own (`xpp`, `xgl`) keeps its checks and pins where it can, but not the fast printer, flat tables, sorted trees or fast files, and the function those lines are in is left alone.
- A function with a lambda (`dlm`, `dlv`), a `bdr` block, a number kept between calls (`msv`) or a generator (`eyd`) is left alone. What a pin or a proof relied on could change while it runs: a generator stops between two values, and anything can happen to a list before it goes on. `tests/turbo` has a program for each.
- What lives in `englishpp_extras.h` and `englishpp_net.h` (`hug`, `chn`, `gnr`, `jsn`, `sck`, `srv`) isn't made faster by anything here. It costs nothing unless it is used.
- A `hsh` or a `bag` with a key C++ has no hash for (a pair, a list, one of the program's classes) stays `std::unordered_map`, with `epp::AnyHash`.
- A program that could tell a sorted tree from `std::map` keeps `std::map`, everywhere in that program: see *When a `map` stays `std::map`*. One line is enough, so a program can lose the speed to a line that is nowhere near its busy loop.
- A program that could tell a flat table from `std::unordered_map` keeps `std::unordered_map`, the same way: see *When a `hsh` stays `std::unordered_map`*.
- English++ Classic (`.englishpp`) programs and C++ programs.

## Where C++ is still ahead

- **Hand-tuned C++.** Everything here can be written by hand, with enough work.
- **Loops that keep a test.** A position that can't be proved keeps a check, or a test in front of its loop. It costs less than it looks: across code positions, with every one of those kept, `fannkuch` runs at 0.99x. English++ is a little slower there, and it can't read outside the list. (`dijkstra` was 0.97x with its checks kept; with a heap of its own it is above 1.2x, and keeps the same checks.)
- **Other platforms.** English++ builds for Windows, with Visual C++. C++ builds everywhere, and has GCC and Clang, whose optimizers are better than Visual C++'s.
- **Decades of tools and libraries**, and a much larger world of people who know it.
- **Control.** C++ lets you lay out memory, write intrinsics, and turn safety off. English++ doesn't try to.
