#pragma once
#include "front.h"

namespace epp {

// a thrown problem the program can catch (etw, or a library problem like stoi's)
struct Thrown {
  Value v;            // K::Exn for std exceptions (v.s = what), or the thrown thing
  bool isStd = true;
  static Thrown Std(const std::string& what) { Thrown t; t.v.k = K::Exn; t.v.s = what; t.v.t = TY_EXN; return t; }
};
struct ExitNow { int code; };
struct StopNow {};

int64_t NormInt(int64_t v, uint8_t ik);
uint8_t IkOf(const Type* t);
bool IsIntType(const Type* t);
std::string FormatDouble(double d);
std::string IntText(const Value& v);
std::string Show(const Value& v, int depth = 0);
std::string KindWords(const Value& v);
std::string KindName(const Type* t);
int Compare(const Value& a, const Value& b);
bool Equal(const Value& a, const Value& b);
Value DeepCopy(const Value& v);
Value DefaultOf(const Type* t);
Value MakeColl(const Type* t);
Value Convert(const Value& v, const Type* t);
Value ToJson(const Value& v);
Value MakeJson(std::shared_ptr<JsonObj> j);
Value ParseJson(const std::string& text);
std::string JsonText(const Value& v);
std::string JsonTypeName(const JsonObj& j);
std::shared_ptr<HugObj> HugFromInt(long long v);
std::shared_ptr<HugObj> HugFromText(const std::string& s);
std::string HugText(const HugObj& h);
int HugCmp(const HugObj& a, const HugObj& b);
std::shared_ptr<HugObj> HugAdd(const HugObj& a, const HugObj& b, bool sub);
std::shared_ptr<HugObj> HugMul(const HugObj& a, const HugObj& b);
std::shared_ptr<HugObj> HugDiv(const HugObj& a, const HugObj& b, bool mod);
double HugToDouble(const HugObj& h);
Value VHug(std::shared_ptr<HugObj> h);
const HugObj& AsHug(const Value& v, std::shared_ptr<HugObj>& keep);

// native libraries (raylib) — native.cpp
std::string NativeShow(const Value& v);
Value NativeDefault(const NativeType* nt);
Value NativeConvert(const Value& v, const NativeType* nt);
const NativeType* FindNativeType(const std::string& n);
bool IsNativeFunction(const std::string& n);
bool IsNativeConstant(const std::string& n);
Value NativeConstant(const std::string& n);
Value CallNative(const std::string& n, std::vector<Value>& args, std::vector<Value*>& refs);
Value* NativeField(Value& v, const std::string& field);   // a field of a native struct, as a temp slot
void NativeStore(Value& structVal, const std::string& field, const Value& v);
bool NativeHasField(const Value& v, const std::string& field);
Value NativeGetField(const Value& v, const std::string& field);
void NativeReset();

// Qt-compatible layer — qtlayer.cpp
bool IsQtFunction(const std::string& n);
Value CallQt(const std::string& n, std::vector<Value>& args);

struct Slot { int id; Value v; Value* p; };
const Type* TypeFor(const Value& v);

struct Frame {
  size_t base = 0;
  FuncInfo* fn = nullptr;
  FuncObj* closure = nullptr;
  Value* self = nullptr;
  Value ret;
  Value* retRef = nullptr;
  int breakLabel = -1;
  std::vector<Value>* gen = nullptr;
  size_t genCap = 0;
  std::vector<std::vector<Stmt*>> defers;
  Thrown* caught = nullptr;
  std::string group;
};

enum Flow { F_NORMAL = 0, F_BREAK, F_CONTINUE, F_RETURN };

struct Interp {
  std::deque<Slot> stack;
  std::deque<Frame> frames;
  std::unordered_map<int, Slot*> globalIndex;
  std::deque<Slot> globals;
  Program* P = nullptr;
  std::vector<Thrown*> caughtStack;
  long long steps = 0;
  uint64_t rng = 0;
  bool seeded = false;
  std::string outBuf;

  Interp();
  int Run(Program* p);

  // names
  Value* Lookup(int id);
  Value* LookupOrNull(int id);
  Value* Declare(int id, const Value& v);
  Value* DeclareAlias(int id, Value* target);
  void PopTo(size_t mark);
  void Destroy(Value& v);

  // statements
  Flow ExecBlock(const std::vector<Stmt*>& body, bool scope = true);
  Flow Exec(Stmt* s);
  Flow ExecCallStmt(Stmt* s);
  Flow ExecLoopBody(const std::vector<Stmt*>& body, int counterId, bool& stop);

  // values
  Value Eval(const Expr* e);
  Value EvalCond(const Expr* e);
  Value* LValue(const Expr* e, bool create = false);
  Value* LValueOrTemp(const Expr* e, Value& temp);
  Value EvalCall(const Expr* e);
  Value EvalAt(const Expr* e);
  Value Binary(const std::string& op, const Value& a, const Value& b);
  std::vector<Value> EvalArgs(const Expr* listOrOne);
  bool Truth(const Value& v);
  std::string Text(const Value& v) { return Show(v); }

  // calls
  Value CallFunc(FuncInfo* f, const std::vector<const Expr*>& argExprs, std::vector<Value>* argVals, Value* self,
                 FuncObj* closure, const Type* objType = nullptr);
  Value CallValue(const Value& fnv, std::vector<Value> args);
  Value CallMethod(Value* recv, const std::string& name, const std::vector<const Expr*>& argExprs, std::vector<Value>* argVals, bool& found);
  Value Construct(const Type* t, std::vector<Value> args, const std::vector<const Expr*>* argExprs, bool noCtor = false);
  void RunCtor(Value* self, ClassInfo* c, std::vector<Value>& args, const std::vector<const Expr*>* argExprs);
  FuncInfo* FindFunction(const std::string& name);
  Value WordCall(const std::string& w, std::vector<Value>& a, const Expr* e);
  Value MakeFuncValue(FuncInfo* f, Value* self);

  int CompareObjects(const Value& a, const Value& b);
  bool EqualObjects(const Value& a, const Value& b);
  void HeapFix(Value& heap);
  void HeapPush(Value& heap, const Value& v);
  bool LessWith(const Value& fn, const Value& a, const Value& b);

  // roots on places
  void AddTo(Value* place, const Value& v, const Expr* whatExpr);
  void MathRoot(const std::string& r, Value* place, const Value& v);
  void ListRoot(const std::string& r, Value* place, const Expr* whatExpr);
  void Assign(Value* place, const Value& v);
  void Print(Stmt* s, bool line);
  void Out(const std::string& s);
  void Err(const std::string& s);
  void Flush();
  void Tick();
  int64_t RandomInt(int64_t a, int64_t b);
  double RandomDec(double a, double b);
};
extern Interp* g_interp;

// words.cpp
Value CallWord(Interp& I, const std::string& w, std::vector<Value>& a);
std::string Sha256(const std::string& s);
std::string Base64Enc(const std::string& s);
std::string Base64Dec(const std::string& s);
std::string FillFormat(const std::string& fmt, const std::vector<Value>& args, size_t first);
std::string ToText(const Value& v);
double ToDbl(const Value& v);
int64_t ToInt(const Value& v);

}  // namespace epp
