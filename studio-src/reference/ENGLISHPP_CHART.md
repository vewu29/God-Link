# The English++ Chart

This is all of English++. It is frozen: a word that is here never changes what it means. New words may only be added.

## The rules

1. **A line is exactly three words**: who, the root, and what. `x is 6`. Text in quotes is one word.
2. **There are no control marks.** Never `{ } ( ) , : ; [ ]`, and no `.` except inside a number like `2.5`.
3. **The lines under a block, indented, are its body.** Going back out closes it.
4. **Inside a word, `@` reaches in and `&` gives values.** `rex@speed` is a field, `scores@0` a position, `geo@area` something in a group, and `vec@num` a kind. `add&1&2` calls `add` with 1 and 2, and `1&2&3` is a list. A call's values run to the end of its word.
5. **`now` fills a spot** when there is nothing to say: `now ebk now`.
6. **A word is three letters.** The first says its family and the next two say which one: `i` is if and `gt` is greater than, so `igt` is if greater than. A pair of letters means one thing, everywhere: `wgt` is while greater than, `lrm` removes from a list and `hrm` from the hard drive.
7. **`is` is the one short word**: `x is 6` makes x, and changes it after that.
8. **Definitions can be in any order.** The compiler writes the forward declarations and the order C++ needs.
9. **Every line becomes straight C++**, one for one. The C++ View shows it. A line that starts with `note` is a note.

## The families

The first letter of a word is its family.

| Letter | Family | What it does |
|---|---|---|
| `a` | arithmetic | changes a thing in place |
| `b` | block | opens a block that is not a loop or an if |
| `c` | collection | asks about a collection |
| `d` | define | gives a new thing its name |
| `e` | exit | leaves or ends something |
| `f` | for | repeats, counting or walking through |
| `g` | get | reads something in |
| `h` | hard drive | works with files and folders |
| `i` | if | runs the lines under it when the test passes |
| `k` | clock | tells the date and the time |
| `l` | list | changes a collection |
| `m` | make | makes a new variable |
| `n` | number | works out a number |
| `o` | otherwise | tries again after an if |
| `p` | put | writes something out |
| `r` | run | runs threads and other programs |
| `s` | should | checks something, and stops if it is wrong |
| `t` | text | works with text |
| `u` | until | ends a do block when the test passes |
| `w` | while | repeats the lines under it while the test passes |
| `x` | external | reaches C++ and the world outside the program |

## The comparing pairs

These two letters mean the same in every family that compares: `i` if, `o` otherwise if, `w` while, `u` until, `s` should, and `f` for.

| Pair | Says | C++ |
|---|---|---|
| `eq` | equal | `==` |
| `ne` | not equal | `!=` |
| `lt` | less than | `<` |
| `le` | less or equal | `<=` |
| `gt` | greater than | `>` |
| `ge` | greater or equal | `>=` |

## The roots: the middle word

`is`: `x is 6` becomes `int x = 6;`, and after that `x = 6;`

### a: arithmetic

Changes a thing in place.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `add` | add | a thing | a value | `score add 10` | `x += v;   a list: v.push_back(x);` |  |
| `asb` | subtract | a thing | a value | `lives asb 1` | `x -= v;` |  |
| `aml` | multiply | a thing | a value | `cost aml 2` | `x *= v;` |  |
| `adv` | divide | a thing | a value | `cost adv 2` | `x /= v;` |  |
| `amd` | remainder | a thing | a value | `n amd 10` | `x %= v;` |  |
| `apw` | power | a thing | a value | `x apw 2` | `x = std::pow(x, v);` |  |
| `and` | bit and | a thing | a value | `flags and 6` | `x &= v;` |  |
| `aor` | bit or | a thing | a value | `flags aor 1` | `x \|= v;` |  |
| `axr` | bit xor | a thing | a value | `flags axr 3` | `x ^= v;` |  |
| `asl` | shift left | a thing | a value | `bits asl 2` | `x <<= v;` |  |
| `asr` | shift right | a thing | a value | `bits asr 1` | `x >>= v;` |  |
| `ant` | bit not | a thing | a value | `bits ant mask` | `x = ~v;` |  |

### b: block

Opens a block that is not a loop or an if.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `btr` | try | now | now | `now btr now` | `try {` | yes |
| `bch` | catch | a name, or now | now, or a kind | `e bch now` | `} catch (const std::exception& e) {` | yes |
| `bdo` | do | now | now | `now bdo now` | `do {` | yes |
| `bsw` | switch | a value | now | `day bsw now` | `switch (x) {` | yes |
| `bcs` | case | now | a value, or values with & | `now bcs 1` | `case 1: {` | yes |
| `bdf` | default | now | now | `now bdf now` | `default: {` | yes |
| `blk` | lock | a mutex | now | `guard blk now` | `{ std::lock_guard<std::mutex> held(m);` | yes |
| `bbl` | scope | now | now | `now bbl now` | `{` | yes |
| `bdr` | when this block is over | now | now | `now bdr now` | `runs its lines when the block around it ends` | yes |
| `bts` | test | now | a text | `now bts "adding"` | `a test the program runs when asked` | yes |

### d: define

Gives a new thing its name.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `dfn` | function | its name | the kind it gives back, or now | `add_up dfn num` | `int add(...) {` | yes |
| `dcx` | function for compile time | its name | the kind it gives back, or now | `square dcx num` | `constexpr int f(...) {` | yes |
| `dpm` | parameter | its name | its kind, or a starting value | `a dpm num` | `int a` |  |
| `dcl` | class | its name | now, or its parents with & | `Dog dcl Animal` | `class Dog : public Animal {` | yes |
| `dst` | struct | its name | now, or its parents with & | `Point dst now` | `struct Point {` | yes |
| `dun` | union | its name | now | `U dun now` | `union U {` | yes |
| `den` | enum | its name | its choices with & | `Mood den happy&sad` | `enum class Mood { happy, sad };` |  |
| `dgr` | group | its name | now | `geo dgr now` | `namespace geo {` | yes |
| `dlm` | lambda | its name | the kind it gives back, or now | `twice dlm num` | `auto f = [&](...) -> int {` | yes |
| `dlv` | lambda with its own copies | its name | the kind it gives back, or now | `tick dlv num` | `auto f = [=](...) mutable -> int {` | yes |
| `dtp` | type | its name | now | `T dtp now` | `template <typename T>` |  |
| `dal` | alias | its name | a kind | `Row dal vec@num` | `using Grid = std::vector<int>;` |  |
| `dfd` | field | its name | its kind, or a starting value | `age dfd 3` | `int age = 3;` |  |
| `dbb` | field of a few bits | its name | how many bits | `ready dbb 1` | `unsigned int ready : 1;` |  |
| `dsc` | secret field | its name | its kind, or a starting value | `pin dsc num` | `private: int pin{};` |  |
| `dfm` | family field | its name | its kind, or a starting value | `x dfm num` | `protected: int x{};` |  |
| `dsh` | shared | its name | its kind, or a starting value | `count dsh 0` | `static inline int count = 0;` |  |
| `dmk` | make | the class's name | now | `Dog dmk now` | `Dog(...) {` | yes |
| `dbs` | base | a parent, or now | what it is made with, with & | `now dbs given` | `: Animal(given)` |  |
| `dds` | when destroyed | the class's name | now | `Dog dds now` | `~Dog() {` | yes |
| `dvr` | virtual | its name | the kind it gives back, or now | `speak dvr txt` | `virtual int f(...) {` | yes |
| `dmb` | must be redone | its name | the kind it gives back, or now | `area dmb dec` | `virtual int f(...) = 0;` |  |
| `dov` | override | its name | the kind it gives back, or now | `speak dov txt` | `int f(...) override {` | yes |
| `dsf` | shared function | its name | the kind it gives back, or now | `make dsf num` | `static int f(...) {` | yes |
| `dhd` | hidden function | its name | the kind it gives back, or now | `think dhd now` | `private: int f(...) {` | yes |
| `dfy` | family function | its name | the kind it gives back, or now | `grow dfy now` | `protected: int f(...) {` | yes |
| `dkn` | constant | its name | the kind it gives back, or now | `area dkn dec` | `int f(...) const {` | yes |
| `dop` | operator | the mark: + - * / == < > | the kind it gives back | `+ dop Spot` | `Spot operator+(...) {` | yes |

### e: exit

Leaves or ends something.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `ert` | return | the function's name | a value, or now | `add_up ert a+b` | `return v;` |  |
| `ebk` | break | now, or a loop's name | now, or a test | `now ebk now` | `break;` |  |
| `enx` | next | now, or a loop's name | now, or a test | `i enx x<0` | `continue;` |  |
| `etw` | throw | now | a text or a thing, or now | `now etw "bad"` | `throw std::runtime_error("bad");` |  |
| `edl` | delete | now | a pointer | `now edl p` | `delete p; p = nullptr;` |  |
| `ext` | exit | now | a whole number | `now ext 0` | `std::exit(0);` |  |
| `eyd` | yield | the function's name | a value | `evens eyd i*2` | `co_yield v;` |  |

### f: for

Repeats, counting or walking through.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `flt` | less than | a counter | a value | `i flt 10` | `for (int i = 0; i < n; ++i) {` | yes |
| `fle` | less or equal | a counter | a value | `i fle 10` | `for (int i = 0; i <= n; ++i) {` | yes |
| `fgt` | greater than | a counter you made | a value | `i fgt 0` | `for (; i > n; --i) {` | yes |
| `fge` | greater or equal | a counter you made | a value | `i fge 0` | `for (; i >= n; --i) {` | yes |
| `fne` | not equal | a counter | a value | `i fne 10` | `for (int i = 0; i != n; ++i) {` | yes |
| `fea` | each | a name, or names with & | a collection | `n fea scores` | `for (auto& x : items) {` | yes |
| `fpr` | parallel | a name | a collection | `n fpr scores` | `std::for_each(std::execution::par, ...) {` | yes |

### g: get

Reads something in.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `get` | get | a thing | inp, a file, or a question | `age get "Age? "` | `std::cin >> x;` |  |
| `gln` | lines | a text | inp, a file, or a question | `line gln inp` | `std::getline(std::cin, x);` |  |

### h: hard drive

Works with files and folders.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `hwr` | write | a file name | a text | `"a.txt" hwr "hello"` | `writes the whole file` |  |
| `hap` | append | a file name | a text | `"a.txt" hap "more"` | `adds to the end of the file` |  |
| `hrm` | remove | a file name | now | `"a.txt" hrm now` | `std::filesystem::remove_all(f);` |  |
| `hmk` | make | a folder name | now | `"out" hmk now` | `std::filesystem::create_directories(d);` |  |
| `hcp` | copy | a file name | a file name | `"a" hcp "b"` | `std::filesystem::copy_file(a, b);` |  |
| `hmv` | move | a file name | a file name | `"a" hmv "b"` | `std::filesystem::rename(a, b);` |  |
| `hby` | write bytes | a file name | a list of bytes | `"a.bin" hby bytes` | `writes the bytes to the file` |  |

### i: if

Runs the lines under it when the test passes.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `ieq` | equal | a value | a value | `x ieq 3` | `if (x == y) {` | yes |
| `ine` | not equal | a value | a value | `x ine 3` | `if (x != y) {` | yes |
| `ilt` | less than | a value | a value | `x ilt 3` | `if (x < y) {` | yes |
| `ile` | less or equal | a value | a value | `x ile 3` | `if (x <= y) {` | yes |
| `igt` | greater than | a value | a value | `x igt 3` | `if (x > y) {` | yes |
| `ige` | greater or equal | a value | a value | `x ige 3` | `if (x >= y) {` | yes |

### l: list

Changes a collection.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `lrm` | remove | a collection | a value | `scores lrm 7` | `std::erase(v, x);` |  |
| `ldx` | remove position | a collection | a position | `scores ldx 0` | `v.erase(v.begin() + i);` |  |
| `lin` | insert | a collection | a position & a value | `scores lin 0&9` | `v.insert(v.begin() + i, x);` |  |
| `lpl` | pop last | a collection | now | `scores lpl now` | `v.pop_back();` |  |
| `lpf` | pop first | a collection | now | `line lpf now` | `v.pop_front();` |  |
| `lso` | sort | a collection | now, or a function | `scores lso now` | `std::sort(v.begin(), v.end());` |  |
| `lrv` | reversed | a collection | now | `scores lrv now` | `std::reverse(v.begin(), v.end());` |  |
| `lsu` | shuffle | a collection | now | `cards lsu now` | `std::shuffle(...);` |  |
| `lwp` | wipe | a collection | now | `scores lwp now` | `v.clear();` |  |
| `lfl` | fill | a collection | a value | `grid lfl 0` | `std::fill(v.begin(), v.end(), x);` |  |
| `luq` | unique | a collection | now | `names luq now` | `sorts it and removes repeats` |  |
| `lrs` | resize | a collection | a whole number | `scores lrs 10` | `v.resize(n);` |  |
| `lss` | sort, keeping ties in order | a collection | now, or a function | `people lss by_age` | `std::stable_sort(v.begin(), v.end());` |  |
| `lrw` | rotated | a collection | how many places | `cards lrw 1` | `the first n go to the end` |  |

### m: make

Makes a new variable.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `mak` | make | a name | a kind, or a kind & what it is made with | `scores mak vec@num` | `std::vector<int> v;` |  |
| `mkn` | constant | a name | a value | `LIMIT mkn 100` | `const int x = 6;` |  |
| `mgl` | global | a name | a value | `score mgl 0` | `int x = 0;   outside every function` |  |
| `mpt` | pointer | a name | a thing | `p mpt x` | `int* p = &x;` |  |
| `mrf` | reference | a name | a thing | `r mrf x` | `int& r = x;` |  |
| `mlo` | look-only reference | a name | a thing | `r mlo x` | `const int& r = x;` |  |
| `mnw` | new | a name | a kind, or a kind & what it is made with | `p mnw Dog` | `Dog* p = new Dog();` |  |
| `mwn` | owned | a name | a kind, or a kind & what it is made with | `d mwn Dog` | `auto d = std::make_unique<Dog>();` |  |
| `msh` | shared | a name | a kind, or a kind & what it is made with | `d msh Dog` | `auto d = std::make_shared<Dog>();` |  |
| `mtd` | thread | a name | a function, or a function & its values | `t mtd work&5` | `std::thread t(work, 5);` |  |
| `msy` | async | a name | a function, or a function & its values | `t msy work&5` | `auto t = std::async(...);` |  |
| `mfi` | file in | a name | a file name | `f mfi "a.txt"` | `std::ifstream f("a.txt");` |  |
| `mfo` | file out | a name | a file name | `f mfo "a.txt"` | `std::ofstream f("a.txt");` |  |
| `mmv` | move | a name | a thing | `y mmv x` | `auto y = std::move(x);` |  |
| `msv` | kept between calls | a name | a value | `calls msv 0` | `static int x = 0;` |  |
| `mtl` | one for each thread | a name | a value | `seen mtl 0` | `thread_local int x = 0;   outside every function` |  |

### o: otherwise

Tries again after an if.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `oeq` | equal | a value | a value | `x oeq 3` | `} else if (x == y) {` | yes |
| `one` | not equal | a value | a value | `x one 3` | `} else if (x != y) {` | yes |
| `olt` | less than | a value | a value | `x olt 3` | `} else if (x < y) {` | yes |
| `ole` | less or equal | a value | a value | `x ole 3` | `} else if (x <= y) {` | yes |
| `ogt` | greater than | a value | a value | `x ogt 3` | `} else if (x > y) {` | yes |
| `oge` | greater or equal | a value | a value | `x oge 3` | `} else if (x >= y) {` | yes |
| `oth` | the others | now | now | `now oth now` | `} else {` | yes |

### p: put

Writes something out.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `prn` | print a line | out, err, or a file | a value | `out prn "Hello"` | `std::cout << x << std::endl;` |  |
| `put` | put | out, err, or a file | a value | `out put "Hi "` | `std::cout << x;` |  |

### r: run

Runs threads and other programs.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `rjn` | join | a thread | now | `t rjn now` | `t.join();` |  |
| `rdt` | detach | a thread | now | `t rdt now` | `t.detach();` |  |
| `rwt` | wait | now | milliseconds | `now rwt 100` | `std::this_thread::sleep_for(...);` |  |
| `rcm` | command | now | a text | `now rcm "dir"` | `std::system(c);` |  |
| `rsd` | seed | now | a whole number | `now rsd 7` | `seeds the random numbers` |  |

### s: should

Checks something, and stops if it is wrong.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `seq` | equal | a value | a value | `x seq 3` | `stops unless x == y` |  |
| `sne` | not equal | a value | a value | `x sne 3` | `stops unless x != y` |  |
| `slt` | less than | a value | a value | `x slt 3` | `stops unless x < y` |  |
| `sle` | less or equal | a value | a value | `x sle 3` | `stops unless x <= y` |  |
| `sgt` | greater than | a value | a value | `x sgt 3` | `stops unless x > y` |  |
| `sge` | greater or equal | a value | a value | `x sge 3` | `stops unless x >= y` |  |

### u: until

Ends a do block when the test passes.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `ueq` | equal | a value | a value | `x ueq 3` | `} while (!(x == y));` |  |
| `une` | not equal | a value | a value | `x une 3` | `} while (!(x != y));` |  |
| `ult` | less than | a value | a value | `x ult 3` | `} while (!(x < y));` |  |
| `ule` | less or equal | a value | a value | `x ule 3` | `} while (!(x <= y));` |  |
| `ugt` | greater than | a value | a value | `x ugt 3` | `} while (!(x > y));` |  |
| `uge` | greater or equal | a value | a value | `x uge 3` | `} while (!(x >= y));` |  |

### w: while

Repeats the lines under it while the test passes.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `weq` | equal | a value | a value | `x weq 3` | `while (x == y) {` | yes |
| `wne` | not equal | a value | a value | `x wne 3` | `while (x != y) {` | yes |
| `wlt` | less than | a value | a value | `x wlt 3` | `while (x < y) {` | yes |
| `wle` | less or equal | a value | a value | `x wle 3` | `while (x <= y) {` | yes |
| `wgt` | greater than | a value | a value | `x wgt 3` | `while (x > y) {` | yes |
| `wge` | greater or equal | a value | a value | `x wge 3` | `while (x >= y) {` | yes |
| `wfv` | forever | now | now | `now wfv now` | `while (true) {` | yes |
| `wln` | lines | a text | inp or a file | `line wln f` | `while (std::getline(f, line)) {` | yes |

### x: external

Reaches C++ and the world outside the program.

| Root | Says | First word | Third word | Example | C++ | Opens a block |
|---|---|---|---|---|---|---|
| `xic` | include | now | a header, in quotes | `now xic "raylib.h"` | `#include "raylib.h"` |  |
| `xlb` | library | now | a library's name | `now xlb raylib` | `uses and links a library` |  |
| `xim` | import | now | an English++ file, in quotes | `now xim "tools.epp"` | `brings in the file's definitions` |  |
| `xus` | using | now | a namespace | `now xus std` | `using namespace std;` |  |
| `xpp` | C++ here | now | C++, in quotes | `now xpp "int a = 1;"` | `that line of C++, right here` |  |
| `xgl` | global | now | C++, in quotes | `now xgl "int a = 1;"` | `that line of C++, outside every function` |  |

## The value words

These ask for a value, inside a word: `y is nsq&16`. What a word takes comes after `&`.

### c: collection

| Word | Says | Example | C++ |
|---|---|---|---|
| `cct` | count | `cct&scores` | `static_cast<int>({0}.size())` |
| `csm` | sum | `csm&scores` | `std::accumulate({0}.begin(), {0}.end(), {E0}{})` |
| `cpd` | product | `cpd&scores` | `std::accumulate({0}.begin(), {0}.end(), static_cast<{E0}>(1), std::multiplies<{E0}>())` |
| `cmx` | the biggest | `cmx&scores` | `*std::max_element({0}.begin(), {0}.end())` |
| `cmn` | the smallest | `cmn&scores` | `*std::min_element({0}.begin(), {0}.end())` |
| `cav` | average | `cav&scores` | `epp::Average({0})` |
| `cme` | median | `cme&scores` | `epp::Median({0})` |
| `cde` | standard deviation | `cde&scores` | `epp::StandardDeviation({0})` |
| `cps` | position of | `cps&scores&7` | `epp::IndexOf({0}, {1})` |
| `chs` | has | `chs&scores&7` | `epp::Has({0}, {1})` |
| `chm` | how many of | `chm&scores&7` | `static_cast<int>(std::count({0}.begin(), {0}.end(), {1}))` |
| `cfr` | the first | `cfr&scores` | `{0}.front()` |
| `cla` | the last | `cla&scores` | `{0}.back()` |
| `cky` | the keys of | `cky&ages` | `epp::KeysOf({0})` |
| `cvl` | the values of | `cvl&ages` | `epp::ValuesOf({0})` |
| `cso` | sort | `cso&scores` | `epp::SortedCopy({0})` |
| `crv` | reversed | `crv&scores` | `epp::Reversed({0})` |
| `cft` | filtered by a function | `cft&scores&big` | `epp::KeepIf({0}, {1})` |
| `cmp` | each one through a function | `cmp&scores&twice` | `epp::Transformed({0}, {1})` |
| `ctx` | joined into a text | `ctx&names&", "` | `epp::Join({0}, {1})` |
| `cra` | random | `cra&cards` | `epp::RandomItem({0})` |
| `cea` | each | `cea&scores&big` | `epp::EachPasses({0}, {1})` |
| `can` | any passes | `can&scores&big` | `epp::AnyPasses({0}, {1})` |
| `cnn` | none passes | `cnn&scores&big` | `epp::NonePasses({0}, {1})` |
| `crl` | rolled up by a function | `crl&scores&0&plus` | `epp::RolledUp({0}, {1}, {2})` |
| `czp` | zipped | `czp&names&ages` | `epp::Zipped({0}, {1})` |
| `cnu` | numbered | `cnu&names` | `epp::Numbered({0})` |
| `cun` | union | `cun&a&b` | `epp::InEither({0}, {1})` |
| `cbt` | in both | `cbt&a&b` | `epp::InBoth({0}, {1})` |
| `cot` | only in the first | `cot&a&b` | `epp::OnlyInFirst({0}, {1})` |
| `ccu` | part of | `ccu&scores&1&2` | `epp::PartOf({0}, {1}, {2})` |
| `cbf` | found by halves | `cbf&sorted&7` | `std::binary_search({0}.begin(), {0}.end(), {1})` |
| `cpb` | position by halves | `cpb&sorted&7` | `static_cast<int>(std::lower_bound({0}.begin(), {0}.end(), {1}) - {0}.begin())` |
| `cgr` | group | `cgr&words&first_letter` | `epp::GroupedBy<{R}>({0}, {1})` |
| `cjn` | join | `cjn&lists` | `epp::JoinedUp({0})` |
| `crg` | counted | `crg&0&10&2` | `epp::Counted({0}, {1}, {2})` |

### h: hard drive

| Word | Says | Example | C++ |
|---|---|---|---|
| `hrd` | read the whole file | `hrd&"a.txt"` | `epp::ReadWholeFile({0})` |
| `hln` | lines | `hln&"a.txt"` | `epp::ReadLines({0})` |
| `hex` | exists | `hex&"a.txt"` | `std::filesystem::exists({0})` |
| `hsz` | size | `hsz&"a.txt"` | `static_cast<long long>(std::filesystem::file_size({0}))` |
| `hls` | the files in the folder | `hls&"."` | `epp::ListFolder({0})` |
| `hrb` | read bytes | `hrb&"a.bin"` | `epp::ReadBytes({0})` |

### i: if

| Word | Says | Example | C++ |
|---|---|---|---|
| `iff` | if, as a value | `iff&a>b&a&b` | `({0} ? {1} : {2})` |

### k: clock

| Word | Says | Example | C++ |
|---|---|---|---|
| `kel` | elapsed seconds | `kel` | `epp::SecondsSinceStart()` |
| `kms` | milliseconds since the start | `kms` | `epp::MillisecondsSinceStart()` |
| `kda` | today's date | `kda` | `epp::DateTodayText()` |
| `ktm` | the time now | `ktm` | `epp::TimeNowText()` |
| `kyr` | the year | `kyr` | `epp::CurrentYear()` |
| `kmo` | the month | `kmo` | `epp::CurrentMonth()` |
| `kdy` | the day of the month | `kdy` | `epp::CurrentDayOfMonth()` |
| `khr` | the hour | `khr` | `epp::CurrentHour()` |
| `kmi` | the minute | `kmi` | `epp::CurrentMinute()` |
| `kse` | the second | `kse` | `epp::CurrentSecond()` |
| `kwk` | the day of the week | `kwk` | `epp::DayOfWeekText()` |
| `kns` | nanoseconds since the start | `kns` | `epp::NanosecondsSinceStart()` |
| `kfa` | filled in | `kfa&"%Y-%m-%d"` | `epp::TimeFilled({0})` |

### n: number

| Word | Says | Example | C++ |
|---|---|---|---|
| `nab` | absolute value | `nab&x` | `std::abs({0})` |
| `nsq` | square root | `nsq&16` | `std::sqrt({0})` |
| `ncr` | cube root | `ncr&27` | `std::cbrt({0})` |
| `nro` | rounded | `nro&2.5` | `std::round({0})` |
| `ndn` | round down | `ndn&2.5` | `std::floor({0})` |
| `nup` | round up | `nup&2.5` | `std::ceil({0})` |
| `nwh` | whole part | `nwh&2.5` | `std::trunc({0})` |
| `npw` | power | `npw&2&10` | `std::pow({0}, {1})` |
| `nmx` | the biggest | `nmx&a&b` | `std::max<{R}>({0}, {1})` |
| `nmn` | the smallest | `nmn&a&b` | `std::min<{R}>({0}, {1})` |
| `nkb` | kept between | `nkb&x&0&10` | `std::clamp<{R}>({0}, {1}, {2})` |
| `nsn` | sine | `nsn&x` | `std::sin({0})` |
| `nco` | cosine | `nco&x` | `std::cos({0})` |
| `ntn` | tangent | `ntn&x` | `std::tan({0})` |
| `nas` | arc sine | `nas&x` | `std::asin({0})` |
| `nac` | arc cosine | `nac&x` | `std::acos({0})` |
| `nat` | arc tangent | `nat&x` | `std::atan({0})` |
| `nlg` | natural log | `nlg&x` | `std::log({0})` |
| `nlx` | log base ten | `nlx&100` | `std::log10({0})` |
| `nep` | e to the power | `nep&1` | `std::exp({0})` |
| `nhy` | hypotenuse | `nhy&3&4` | `std::hypot({0}, {1})` |
| `ngd` | greatest common divisor | `ngd&12&18` | `std::gcd({0}, {1})` |
| `nmu` | least common multiple | `nmu&4&6` | `std::lcm({0}, {1})` |
| `nra` | random | `nra&1&6` | `epp::RandomNumber({0}, {1})` |
| `nrz` | random decimal | `nrz&0&1` | `epp::RandomDecimal({0}, {1})` |
| `nfc` | factorial | `nfc&5` | `epp::Factorial({0})` |
| `npe` | is prime | `npe&7` | `epp::IsPrime({0})` |
| `npi` | pi | `npi` | `std::numbers::pi` |
| `nhi` | highest whole number | `nhi` | `std::numeric_limits<int>::max()` |
| `nlw` | lowest whole number | `nlw` | `std::numeric_limits<int>::lowest()` |
| `nnd` | bit and | `nnd&a&b` | `({0} & {1})` |
| `nor` | bit or | `nor&a&b` | `({0} \| {1})` |
| `nxr` | bit xor | `nxr&a&b` | `({0} ^ {1})` |
| `nsl` | shift left | `nsl&a&2` | `({0} << {1})` |
| `nsr` | shift right | `nsr&a&2` | `({0} >> {1})` |
| `nnt` | bit not | `nnt&a` | `(~({0}))` |
| `nsz` | size | `nsz&x` | `static_cast<int>(sizeof({0}))` |

### t: text

| Word | Says | Example | C++ |
|---|---|---|---|
| `tsz` | size | `tsz&name` | `static_cast<int>({0}.size())` |
| `tuc` | uppercase | `tuc&name` | `epp::ToUpper({0})` |
| `tlc` | lowercase | `tlc&name` | `epp::ToLower({0})` |
| `tti` | trimmed | `tti&name` | `epp::Trim({0})` |
| `trv` | reversed | `trv&name` | `epp::Reversed({0})` |
| `tps` | position of | `tps&name&"a"` | `epp::FindPosition({0}, {1})` |
| `trp` | replaced | `trp&s&"a"&"b"` | `epp::ReplaceAll({0}, {1}, {2})` |
| `tcu` | part of | `tcu&s&0&3` | `{0}.substr({1}, {2})` |
| `tsp` | split | `tsp&s&","` | `epp::Split({0}, {1})` |
| `twd` | words | `twd&s` | `epp::SplitWords({0})` |
| `tln` | lines | `tln&s` | `epp::SplitLines({0})` |
| `ths` | has | `ths&s&"a"` | `({0}.find({1}) != std::string::npos)` |
| `tbg` | begins with | `tbg&s&"a"` | `{0}.starts_with({1})` |
| `ted` | ends with | `ted&s&"a"` | `{0}.ends_with({1})` |
| `tnm` | the number in | `tnm&"42"` | `std::stoi({0})` |
| `tdc` | the decimal in | `tdc&"2.5"` | `std::stod({0})` |
| `tfx` | with decimal places | `tfx&x&2` | `epp::WithDecimalPlaces({0}, {1})` |
| `tpa` | padded | `tpa&s&10` | `epp::PaddedTo({0}, {1})` |
| `ttc` | title case | `ttc&s` | `epp::TitleCase({0})` |
| `tmt` | matches pattern | `tmt&s&"a+"` | `epp::MatchesPattern({0}, {1})` |
| `tma` | all matches | `tma&s&"a+"` | `epp::PatternMatches({0}, {1})` |
| `trx` | pattern replaced | `trx&s&"a+"&"b"` | `epp::ReplacePattern({0}, {1}, {2})` |
| `tre` | repeated | `tre&"ab"&3` | `epp::Repeated({0}, {1})` |
| `tct` | count | `tct&s&"a"` | `epp::CountOf({0}, {1})` |
| `tdg` | is a digit | `tdg&c` | `epp::LetterIsDigit({0})` |
| `tlr` | is a letter | `tlr&c` | `epp::LetterIsLetter({0})` |
| `tws` | is white space | `tws&c` | `epp::LetterIsSpace({0})` |
| `tfa` | filled in | `tfa&"{} of {}"&1&2` | `epp::Filled({0})` |
| `ttp` | type | `ttp&x` | `` |
| `tjs` | read as JSON | `tjs&text` | `epp::Json::Parse({0})` |

### x: external

| Word | Says | Example | C++ |
|---|---|---|---|
| `xag` | words given to the program | `xag` | `epp::ProgramArguments()` |
| `xev` | an environment value | `xev&"PATH"` | `epp::EnvironmentValue({0})` |
| `xcm` | command | `xcm&"dir"` | `epp::CommandOutput({0})` |
| `xcd` | a command's exit code | `xcd&"dir"` | `epp::CommandExitCode({0})` |
| `xwb` | a web page's text | `xwb&"http://example.com"` | `epp::WebPageText({0})` |
| `xpo` | a web page's answer to a text | `xpo&"http://example.com"&"hello"` | `epp::WebPost({0}, {1})` |
| `xha` | SHA-256 hash | `xha&"abc"` | `epp::Sha256({0})` |
| `xbe` | as base 64 | `xbe&"abc"` | `epp::ToBase64({0})` |
| `xbd` | from base 64 | `xbd&"YWJj"` | `epp::FromBase64({0})` |

## The kinds

`@` means of: `vec@num` is a vector of numbers. `any` lets C++ work it out.

| Kind | What it is | C++ |
|---|---|---|
| `num` | a whole number | `int` |
| `big` | a big whole number | `long long` |
| `sml` | a small whole number | `short` |
| `pos` | a positive whole number | `unsigned int` |
| `byt` | a byte | `unsigned char` |
| `pbg` | a big positive whole number | `unsigned long long` |
| `hug` | a whole number of any size | `epp::Huge` |
| `dec` | a decimal | `double` |
| `flo` | a small decimal | `float` |
| `cpx` | a complex number | `std::complex<double>` |
| `txt` | a text | `std::string` |
| `ltr` | a letter | `char` |
| `yno` | a yes or no | `bool` |
| `any` | any kind: C++ works it out | `auto` |
| `vec` | a vector | `std::vector` |
| `lst` | a linked list | `std::list` |
| `dqu` | a deque | `std::deque` |
| `arr` | an array: arr@num@5 | `std::array` |
| `stk` | a stack | `std::stack` |
| `que` | a queue | `std::queue` |
| `hep` | a priority queue | `std::priority_queue` |
| `mhp` | a priority queue with the smallest on top | `epp::LowHeap` |
| `map` | a map: map@txt@num | `std::map` |
| `hsh` | a hash map | `std::unordered_map` |
| `set` | a set | `std::set` |
| `bag` | a hash set | `std::unordered_set` |
| `par` | a pair | `std::pair` |
| `tup` | a tuple | `std::tuple` |
| `opt` | a maybe-value | `std::optional` |
| `alt` | one of several kinds | `std::variant` |
| `own` | an owned pointer | `std::unique_ptr` |
| `shr` | a shared pointer | `std::shared_ptr` |
| `ptr` | a pointer | `*` |
| `ref` | a reference | `&` |
| `see` | a look-only reference | `const &` |
| `tkn` | a thing handed over to keep | `&&` |
| `fun` | a function: fun@num@txt gives a num and takes a txt | `std::function` |
| `mtx` | a mutex | `std::mutex` |
| `atm` | an atomic | `std::atomic` |
| `thd` | a thread | `std::thread` |
| `fut` | an async result | `std::future` |
| `gnr` | values worked out one at a time | `epp::Generator` |
| `chn` | a channel between threads | `epp::Channel` |
| `cnd` | a condition threads wait on | `std::condition_variable_any` |
| `ifs` | a file to read | `std::ifstream` |
| `ofs` | a file to write | `std::ofstream` |
| `jsn` | a JSON value | `epp::Json` |
| `sck` | a network connection | `epp::Socket` |
| `srv` | a network server | `epp::Server` |

## The special words

These can't be names.

| Word | What it means | C++ |
|---|---|---|
| `now` | fills a spot when there is nothing to say | `` |
| `nil` | nothing: a pointer to nothing, or a maybe-value with no value | `nullptr` |
| `yes` | true | `true` |
| `nay` | false | `false` |
| `out` | the screen | `std::cout` |
| `err` | the screen, for problems | `std::cerr` |
| `inp` | the keyboard | `std::cin` |
| `slf` | the thing this method is working on | `this` |
