// English++ Web Studio engine.
// English++ is Vewu's language. This engine reads the three-word line
// (who / root / what) as the English++ Book, Chart and Syntax Manual define it
// and runs it directly, because a browser can't run a C++ compiler. When it
// can't do something the way the Studio does, it says so in plain English
// ("not in the Web Studio yet") instead of guessing.
#pragma once
#include <cstdint>
#include <string>
#include <vector>
#include <map>
#include <set>
#include <deque>
#include <unordered_map>
#include <memory>
#include <functional>
#include <complex>

namespace epp {

// ----------------------------------------------------------------- problems
struct Problem {            // front end or run time; line is 1-based (0 = none)
  std::string msg;
  int line;
  std::string file;
};
[[noreturn]] void Bad(const std::string& m);       // refuse / report at the current line
[[noreturn]] void NotYet(const std::string& what);  // "... is not in the Web Studio yet"
extern int g_line;
extern std::string g_file;

// ----------------------------------------------------------------- names
int NameId(const std::string& s);
const std::string& NameOf(int id);

// ----------------------------------------------------------------- kinds
struct ClassInfo;
struct EnumInfo;
struct NativeType;
struct Type {
  std::string text;               // as written, e.g. vec@num
  std::string head;               // vec, num, Dog, T, ...
  std::vector<const Type*> args;
  long long n = 0;                // arr@num@7
  ClassInfo* cls = nullptr;
  EnumInfo* en = nullptr;
  const NativeType* nat = nullptr;
  bool param = false;             // a dtp type parameter (any kind)
};
const Type* ParseType(const std::string& text);   // throws Bad on an unknown kind
const Type* TryParseType(const std::string& text);  // nullptr if it isn't a kind
bool LooksLikeType(const std::string& text);
extern const Type *TY_NUM, *TY_BIG, *TY_DEC, *TY_FLO, *TY_TXT, *TY_LTR, *TY_YNO, *TY_ANY, *TY_NOW, *TY_HUG,
    *TY_CPX, *TY_JSN, *TY_BYT, *TY_PBG, *TY_EXN;

// ----------------------------------------------------------------- values
enum class K : uint8_t {
  Nil, Void, Int, Dbl, Bool, Chr, Str, Coll, Tup, Obj, Ptr, Func, Enum, Hug, Cpx, Json, Stream, Handle, Exn,
  Native, Gen
};
// int kinds (Value::ik): how a whole number is kept, like C++ would keep it
enum IK : uint8_t { IK_NUM = 0, IK_BIG, IK_SML, IK_POS, IK_BYT, IK_PBG };
enum PK : uint8_t { PK_RAW = 0, PK_OWN, PK_SHR, PK_REF };

struct HeapBase { virtual ~HeapBase() = default; };
struct Value {
  K k = K::Nil;
  uint8_t ik = 0;                 // int kind / dec(0) flo(1) / pointer kind
  const Type* t = nullptr;        // the kind this value is kept as (slot / element kind)
  union { int64_t i; double d; Value* tgt; };
  std::string s;
  std::shared_ptr<HeapBase> h;
  Value() : i(0) {}
};
Value VInt(int64_t v, uint8_t ik = IK_NUM);
Value VDbl(double v, uint8_t fk = 0);
Value VBool(bool b);
Value VChr(char c);
Value VStr(std::string s);
Value VVoid();
Value VNil();

struct ValueLess { bool operator()(const Value& a, const Value& b) const; };
struct Coll : HeapBase {
  std::vector<Value> items;                 // vec lst dqu arr stk que hep mhp chn; json arrays
  std::map<Value, Value, ValueLess> m;      // map hsh set bag
  std::vector<Value> order;                 // hsh / bag: the order keys were added
  bool closed = false;
};
struct TupObj : HeapBase { std::vector<Value> items; };
struct Obj : HeapBase {
  ClassInfo* cls = nullptr;
  std::vector<Value> f;
  std::vector<const Type*> targs;
  bool destroyed = false;
};
struct BoxObj : HeapBase { Value v; bool dead = false; };
struct HugObj : HeapBase { bool neg = false; std::vector<uint32_t> d; };  // base 1e9, little end first
struct CpxObj : HeapBase { std::complex<double> c; };
struct FuncInfo;
struct FuncObj : HeapBase {
  FuncInfo* fn = nullptr;
  std::vector<std::pair<int, Value*>> refs;                    // dlm: sees names by reference
  std::shared_ptr<std::vector<std::pair<int, Value>>> copies;  // dlv: keeps its own copies
  Value* self = nullptr;                                       // methods / lambdas made in a method
  std::shared_ptr<HeapBase> selfKeep;
  int builtin = -1;                                            // a value word passed as a function
  std::string native;                                          // raylib name
};
struct JsonObj : HeapBase {
  enum JK { Null, Bool, Num, Str, Arr, Ob } jk = Null;
  bool b = false; double n = 0; bool isInt = false; std::string s;
  std::vector<Value> a;                           // elements are K::Json values
  std::vector<std::pair<std::string, Value>> o;   // members in order
};
struct StreamObj : HeapBase { bool out = false, open = false; std::string path, buf; size_t pos = 0; bool fail = false; };
struct HandleObj : HeapBase { std::string what; Value v; bool joined = false; };
struct NativeObj : HeapBase { const NativeType* nt = nullptr; std::vector<unsigned char> bytes; };
struct GenObj : HeapBase { std::vector<Value> items; };

// ----------------------------------------------------------------- program
enum class E : uint8_t {
  Int, Dbl, Str, Interp, Chr, Bool, Nil, Now, Name, At, AtCall, Call, Unary, Binary, List, Kind, Deref
};
struct Expr {
  E k;
  int op = 0;           // operator char codes, see parse.cpp
  int64_t i = 0;
  double d = 0;
  uint8_t ik = 0;
  std::string s;        // literal text / name / member name
  int id = -1;          // interned name
  const Type* type = nullptr;
  std::vector<std::unique_ptr<Expr>> kids;
  bool trailingCall = false;  // name& with nothing after
};
using ExprP = std::unique_ptr<Expr>;

struct Stmt;
using StmtP = std::unique_ptr<Stmt>;
struct Param {
  std::string name; int id = -1;
  const Type* type = nullptr;      // nullptr = any
  bool ref = false, look = false, take = false;
  ExprP def;
  bool pack = false;
};
struct FuncInfo {
  std::string name; int id = -1;
  int line = 0;
  std::string file;
  std::vector<Param> params;
  const Type* ret = nullptr;       // nullptr = nothing (now) ; TY_ANY for templates
  bool retRef = false;
  bool returnsNothing = true;
  std::vector<Stmt*> body;
  ClassInfo* cls = nullptr;
  std::string root;                // dfn dvr dov dmb dsf dhd dfy dkn dop dmk dds dlm dlv dcx
  bool isLambda = false, copies = false, isStatic = false, isAbstract = false, isGen = false;
  std::string op;                  // dop: + < += call at ...
  std::deque<std::pair<int, Value>> statics;  // msv
  std::vector<std::string> tparams;
  std::vector<Stmt*> dbs;          // base calls in a dmk
  bool pureChecked = false, pure = false;
  std::map<std::vector<int64_t>, Value> memo;
};
struct FieldInfo { std::string name; int id = -1; const Type* type = nullptr; Expr* def = nullptr; int vis = 0; int bits = 0; };
struct ClassInfo {
  std::string name, group;
  int line = 0;
  bool isStruct = false, isUnion = false;
  std::vector<std::string> parentNames;
  std::vector<ClassInfo*> parents;
  std::vector<FieldInfo> own;
  std::vector<std::pair<ClassInfo*, int>> all;   // flattened fields
  std::unordered_map<int, int> fieldIndex;       // name id -> index in Obj::f
  std::map<std::string, FuncInfo*> methods;
  std::vector<FuncInfo*> ctors;
  FuncInfo* dtor = nullptr;
  std::map<std::string, FuncInfo*> ops;
  std::vector<std::pair<int, Value>> statics;    // dsh
  std::vector<std::string> tparams;
  bool laidOut = false;
  FuncInfo* findMethod(const std::string& n);
  FuncInfo* findOp(const std::string& n);
  bool isA(const ClassInfo* other) const;
  bool hasDtorDeep();
  Value* findStatic(int id);
  bool hasVirtual();
};
struct EnumInfo { std::string name, group; std::vector<std::string> names; };

struct Stmt {
  int line = 0;
  std::string file;
  int indent = 0;
  std::string who, root, what;     // the three words as written
  ExprP w, x;                      // who / what as values (when they are values)
  const Type* kind = nullptr;      // what as a kind (mak, dfd, dpm, dfn ...)
  std::vector<Stmt*> body;
  std::vector<Stmt*> chain;        // o.. / oth after an i.. ; bch after btr ; u.. after bdo
  Stmt* parent = nullptr;
  FuncInfo* fn = nullptr;
  ClassInfo* cls = nullptr;
  std::vector<std::string> names;  // a&b is ... / k&v fea m
  std::vector<int> nameIds;
  int whoId = -1;
  int rootId = 0;                  // see ROOT_* in interp.cpp
  bool chained = false;            // is an o.. / oth / bch / u.. that belongs to a chain
};

// ----------------------------------------------------------------- the engine
struct Host {   // how the engine talks to the page (or the terminal)
  std::function<void(const std::string&)> out, err;
  std::function<bool(const std::string& prompt, std::string& line)> readLine;
  std::function<void(const std::string& json)> event;
  std::function<void(int ms)> sleep;     // may yield to the browser
  std::function<bool()> stopRequested;
  std::function<void()> yield;           // called now and then in long loops
  std::function<int(const std::string& json)> debugPause;   // v4: the debugger stopped on a line; returns what to do next
};
extern Host g_host;

// virtual disk shared by the program and the page
struct Disk {
  std::map<std::string, std::string> files;
  std::set<std::string> dirs;
};
extern Disk g_disk;

struct CheckResult { std::vector<Problem> errors; };
CheckResult Check(const std::string& src);
int RunProgram(const std::string& src, Problem* outErr);   // returns exit code
std::string ToCpp(const std::string& src);

}  // namespace epp
