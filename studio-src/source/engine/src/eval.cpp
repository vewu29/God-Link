// eval.cpp — values: names, places, operators, calls, classes.
#include "eh.h"
#include <cmath>
#include <algorithm>

namespace epp {

static Value* DerefP(Value* p) { while (p && p->k == K::Ptr) { if (!p->tgt) return p; p = p->tgt; } return p; }
static Value Plain(const Value& v) { return v.k == K::Ptr && v.ik == PK_REF ? *v.tgt : v; }
static bool IsNumK(const Value& v) { return v.k == K::Int || v.k == K::Dbl || v.k == K::Chr || v.k == K::Bool || v.k == K::Enum; }
static int Rank(uint8_t ik) { switch (ik) { case IK_POS: return 2; case IK_BIG: return 3; case IK_PBG: return 4; default: return 1; } }
static uint8_t Promote(const Value& a, const Value& b) {
  uint8_t x = a.k == K::Int ? a.ik : IK_NUM, y = b.k == K::Int ? b.ik : IK_NUM;
  if (x == IK_SML || x == IK_BYT) x = IK_NUM;
  if (y == IK_SML || y == IK_BYT) y = IK_NUM;
  return Rank(x) >= Rank(y) ? x : y;
}
static const Type* IntTypeOf(uint8_t ik) {
  switch (ik) { case IK_BIG: return TY_BIG; case IK_PBG: return TY_PBG; case IK_POS: return ParseType("pos"); default: return TY_NUM; }
}
static double AsD(const Value& v) {
  if (v.k == K::Dbl) return v.d;
  if (v.k == K::Int && v.ik == IK_PBG) return (double)(uint64_t)v.i;
  return (double)v.i;
}
static Value MkInt(int64_t v, uint8_t ik) { Value r = VInt(v, ik); r.t = IntTypeOf(ik); return r; }
static Value MkDbl(double d, bool flo = false) { Value r = VDbl(d, flo); r.t = flo ? TY_FLO : TY_DEC; return r; }
static Value MkStr(std::string s) { Value r = VStr(std::move(s)); r.t = TY_TXT; return r; }
static Value MkBool(bool b) { Value r = VBool(b); r.t = TY_YNO; return r; }

// ------------------------------------------------------------------ operators
Value Interp::Binary(const std::string& op, const Value& a0, const Value& b0) {
  Value a = Plain(a0), b = Plain(b0);
  if (a.k == K::Obj) {
    Obj* o = static_cast<Obj*>(a.h.get());
    FuncInfo* f = o->cls->findOp(op);
    if (!f && (op == "!=" || op == ">" || op == "<=" || op == ">=")) {
      if (op == "!=" && (f = o->cls->findOp("=="))) { std::vector<Value> args{b}; Value r = CallFunc(f, {}, &args, &a, nullptr); return MkBool(!Truth(r)); }
      if (FuncInfo* lt = o->cls->findOp("<")) {
        if (op == ">") { std::vector<Value> args{a}; return CallFunc(lt, {}, &args, &b, nullptr); }
        if (op == ">=") { std::vector<Value> args{b}; return MkBool(!Truth(CallFunc(lt, {}, &args, &a, nullptr))); }
        if (op == "<=") { std::vector<Value> args{a}; return MkBool(!Truth(CallFunc(lt, {}, &args, &b, nullptr))); }
      }
    }
    if (!f && (op == "==" || op == "!=")) { bool eq = EqualObjects(a, b); return MkBool(op == "==" ? eq : !eq); }
    if (!f && (op == "<" || op == "<=" || op == ">" || op == ">=") && b.k == K::Obj) {
      int c = CompareObjects(a, b);
      return MkBool(op == "<" ? c < 0 : op == "<=" ? c <= 0 : op == ">" ? c > 0 : c >= 0);
    }
    if (!f) Bad(o->cls->name + " has no " + op + ". Give it one with dop: " + op + " dop " + o->cls->name + ".");
    std::vector<Value> args{b};
    return CallFunc(f, {}, &args, &a, nullptr);
  }
  if (op == "==") return MkBool(Equal(a, b));
  if (op == "!=") return MkBool(!Equal(a, b));
  if (op == "<" || op == "<=" || op == ">" || op == ">=") {
    if (a.k == K::Nil || b.k == K::Nil) Bad("nil can only be compared with == or !=.");
    int c = Compare(a, b);
    bool r = op == "<" ? c < 0 : op == "<=" ? c <= 0 : op == ">" ? c > 0 : c >= 0;
    return MkBool(r);
  }
  // text
  if (a.k == K::Str || b.k == K::Str) {
    if (op != "+") Bad("Texts can only be joined with +.");
    if (a.k == K::Str && b.k == K::Str) return MkStr(a.s + b.s);
    if (a.k == K::Str && b.k == K::Chr) return MkStr(a.s + (char)b.i);
    if (a.k == K::Chr && b.k == K::Str) return MkStr(std::string(1, (char)a.i) + b.s);
    Bad("A text can be joined with a text or a letter, not " + KindWords(a.k == K::Str ? b : a) + ". Turn it into text first: txt&x.");
  }
  if (a.k == K::Hug || b.k == K::Hug) {
    if (a.k == K::Dbl || b.k == K::Dbl) Bad("A hug holds whole numbers only.");
    std::shared_ptr<HugObj> ka, kb;
    const HugObj& x = AsHug(a, ka);
    const HugObj& y = AsHug(b, kb);
    if (op == "+") return VHug(HugAdd(x, y, false));
    if (op == "-") return VHug(HugAdd(x, y, true));
    if (op == "*") return VHug(HugMul(x, y));
    if (op == "/" || op == "%") { if (y.d.empty() || (y.d.size() == 1 && y.d[0] == 0)) Bad("I can't divide by zero. Use a number that isn't zero."); return VHug(HugDiv(x, y, op == "%")); }
    Bad("A hug can't use " + op + ".");
  }
  if (a.k == K::Cpx || b.k == K::Cpx) {
    auto cx = [](const Value& v) { return v.k == K::Cpx ? static_cast<CpxObj*>(v.h.get())->c : std::complex<double>(AsD(v), 0); };
    std::complex<double> x = cx(a), y = cx(b), r;
    if (op == "+") r = x + y; else if (op == "-") r = x - y; else if (op == "*") r = x * y; else if (op == "/") r = x / y;
    else Bad("A complex number can't use " + op + ".");
    Value v; v.k = K::Cpx; auto c = std::make_shared<CpxObj>(); c->c = r; v.h = c; v.t = TY_CPX; return v;
  }
  if (a.k == K::Native || b.k == K::Native) {
    std::vector<Value> args{a, b}; std::vector<Value*> refs{nullptr, nullptr};
    std::string fn = op == "+" ? "Vector2Add" : op == "-" ? "Vector2Subtract" : "";
    if (fn.empty()) Bad("Library values can't use " + op + " here. Use raymath's words, like Vector2Add.");
    return CallNative(fn, args, refs);
  }
  if (!IsNumK(a) || !IsNumK(b)) Bad(op + " works on numbers, but this is " + KindWords(IsNumK(a) ? b : a) + ".");
  if (a.k == K::Dbl || b.k == K::Dbl) {
    bool flo = (a.k != K::Dbl || a.ik) && (b.k != K::Dbl || b.ik);
    double x = AsD(a), y = AsD(b), r;
    if (op == "+") r = x + y; else if (op == "-") r = x - y; else if (op == "*") r = x * y;
    else if (op == "/") r = x / y;
    else if (op == "%") Bad("% works on whole numbers. For decimals, use amd.");
    else Bad("I can't use " + op + " here.");
    return MkDbl(flo ? (double)(float)r : r, flo);
  }
  uint8_t ik = Promote(a, b);
  int64_t x = a.i, y = b.i;
  if (op == "+") return MkInt((int64_t)((uint64_t)x + (uint64_t)y), ik);
  if (op == "-") return MkInt((int64_t)((uint64_t)x - (uint64_t)y), ik);
  if (op == "*") return MkInt((int64_t)((uint64_t)x * (uint64_t)y), ik);
  if (op == "/" || op == "%") {
    if (y == 0) Bad("I can't divide by zero. Use a number that isn't zero.");
    if (ik == IK_PBG || ik == IK_POS) {
      uint64_t ux = ik == IK_POS ? (uint32_t)x : (uint64_t)x, uy = ik == IK_POS ? (uint32_t)y : (uint64_t)y;
      return MkInt((int64_t)(op == "/" ? ux / uy : ux % uy), ik);
    }
    if (ik == IK_NUM && x == INT32_MIN && y == -1) return MkInt(op == "/" ? INT32_MIN : 0, ik);
    return MkInt(op == "/" ? x / y : x % y, ik);
  }
  Bad("I can't use " + op + " here.");
}

// ------------------------------------------------------------------ names that are values
FuncInfo* Interp::FindFunction(const std::string& name) {
  std::string g;
  Frame& f = frames.back();
  if (f.fn && f.fn->cls) g = f.fn->cls->group;
  else if (f.fn) { auto p = f.fn->name; (void)p; g = f.group; }
  if (!g.empty()) { auto it = P->funcs.find(g + "::" + name); if (it != P->funcs.end()) return it->second; }
  if (!P->curGroup.empty()) { auto it = P->funcs.find(P->curGroup + "::" + name); if (it != P->funcs.end()) return it->second; }
  auto it = P->funcs.find(name);
  if (it != P->funcs.end()) return it->second;
  return nullptr;
}

Value Interp::MakeFuncValue(FuncInfo* f, Value* self) {
  Value v; v.k = K::Func;
  auto fo = std::make_shared<FuncObj>();
  fo->fn = f;
  if (self) { fo->self = self; }
  if (f->isLambda) {
    Frame& fr = frames.back();
    if (fr.self) fo->self = fr.self;
    if (f->copies) {
      fo->copies = std::make_shared<std::vector<std::pair<int, Value>>>();
      if (fr.closure) {
        if (fr.closure->copies) for (auto& c : *fr.closure->copies) fo->copies->push_back({c.first, DeepCopy(c.second)});
        for (auto& r : fr.closure->refs) fo->copies->push_back({r.first, DeepCopy(*r.second)});
      }
      for (size_t k = fr.base; k < stack.size(); ++k) fo->copies->push_back({stack[k].id, DeepCopy(*stack[k].p)});
    } else {
      if (fr.closure) {
        if (fr.closure->copies) for (auto& c : *fr.closure->copies) fo->refs.push_back({c.first, &c.second});
        for (auto& r : fr.closure->refs) fo->refs.push_back(r);
      }
      for (size_t k = fr.base; k < stack.size(); ++k) fo->refs.push_back({stack[k].id, stack[k].p});
    }
  }
  v.h = fo;
  v.t = ParseType("fun@any");
  return v;
}

static EnumInfo* EnumWithName(Program* P, const std::string& n, int& index) {
  for (auto& e : P->enumStore) {
    auto it = std::find(e->names.begin(), e->names.end(), n);
    if (it != e->names.end()) { index = (int)(it - e->names.begin()); return e.get(); }
  }
  return nullptr;
}
static Value EnumValue(EnumInfo* e, int k) {
  Value v; v.k = K::Enum; v.i = k;
  std::string saved = g_prog->curGroup; g_prog->curGroup = e->group;
  v.t = ParseType(e->group.empty() || true ? e->name : e->group + "::" + e->name);
  g_prog->curGroup = saved;
  return v;
}

// ------------------------------------------------------------------ places
// A place inside something: v@0, m@"k", rex@age, p@speed (through a pointer), *p
Value* Interp::LValueOrTemp(const Expr* e, Value& temp) {
  Value* p = LValue(e);
  if (p) return p;
  temp = Eval(e);
  if (temp.k == K::Ptr && temp.ik == PK_REF) return temp.tgt;
  return &temp;
}

static int64_t IndexOf(Interp& I, const Expr* e, const Value& base, bool& isKey, Value& key) {
  // e is the At node; returns a position for lists/texts, or sets key for maps
  isKey = false;
  const std::string h = base.t ? base.t->head : "";
  bool map = h == "map" || h == "hsh";
  if (e->kids.size() > 1) {
    const Expr* k = e->kids[1].get();
    if (k->k == E::Int) { if (map) { isKey = true; key = Convert(VInt(k->i), base.t->args[0]); } return k->i; }
    if (k->k == E::Str) { isKey = true; key = MkStr(k->s); if (map) key = Convert(key, base.t->args[0]); return 0; }
  }
  // a name: its value is the position or key
  Value* nv = I.LookupOrNull(e->id);
  if (!nv) {
    int ix; EnumInfo* en = EnumWithName(I.P, e->s, ix);
    if (en && map) { isKey = true; key = EnumValue(en, ix); return 0; }
    I.Lookup(e->id);
  }
  Value v = Plain(*nv);
  if (map) { isKey = true; key = Convert(v, base.t->args[0]); return 0; }
  if (v.k == K::Int || v.k == K::Chr || v.k == K::Enum) return v.i;
  if (v.k == K::Str) { isKey = true; key = v; return 0; }
  Bad("A position is a whole number, but " + e->s + " is " + KindWords(v) + ".");
}

static void OutOfRange(const std::string& what, int64_t at, size_t size) {
  if (size == 0) Bad(what + "@" + std::to_string(at) + " is past the end: " + what + " is empty, so it has no places yet.");
  Bad(what + "@" + std::to_string(at) + " is past the end: " + what + " has " + std::to_string(size) + (size == 1 ? " thing" : " things") +
      ", at places 0 to " + std::to_string((long long)size - 1) + ".");
}
static std::string ExprText(const Expr* e) {
  if (e->k == E::Name) return e->s;
  if (e->k == E::At && !e->kids.empty()) return ExprText(e->kids[0].get()) + "@" + (e->s.empty() ? (e->kids.size() > 1 ? (e->kids[1]->k == E::Int ? std::to_string(e->kids[1]->i) : "\"" + e->kids[1]->s + "\"") : "") : e->s);
  if (e->k == E::Deref) return "*" + ExprText(e->kids[0].get());
  return "it";
}

Value* Interp::LValue(const Expr* e, bool create) {
  (void)create;
  switch (e->k) {
    case E::Name: {
      if (e->s == "slf") { Frame& f = frames.back(); return f.self; }
      return LookupOrNull(e->id);
    }
    case E::Deref: {
      Value tmp;
      Value* p = LValue(e->kids[0].get());
      Value pv = p ? *p : Eval(e->kids[0].get());
      pv = Plain(pv);
      if (pv.k == K::Nil) Bad("*" + ExprText(e->kids[0].get()) + " reads what a pointer points at, but it points at nothing (nil).");
      if (pv.k != K::Ptr) Bad("* reads what a pointer points at, and " + ExprText(e->kids[0].get()) + " isn't a pointer.");
      if (pv.h) { auto* b = static_cast<BoxObj*>(pv.h.get()); if (b->dead) Bad("That pointer's thing was deleted, so it can't be read."); }
      return pv.tgt;
    }
    case E::Call: {
      Value r = EvalCall(e);
      if (r.k == K::Ptr && r.ik == PK_REF) return r.tgt;
      return nullptr;
    }
    case E::At: break;
    default: return nullptr;
  }
  const Expr* be = e->kids[0].get();
  // group@name, Class@shared, Enum@choice
  if (be->k == E::Name && be->s != "slf" && !LookupOrNull(be->id) && !e->s.empty()) {
    if (P->groups.count(be->s)) {
      auto g = globalIndex.find(NameId(be->s + "::" + e->s));
      if (g != globalIndex.end()) return g->second->p;
      return nullptr;
    }
    auto ci = P->classes.find(be->s);
    if (ci != P->classes.end()) return ci->second->findStatic(e->id);
    return nullptr;
  }
  Value temp;
  Value* base = LValue(be);
  if (!base) return nullptr;
  Value* b = base;
  if (b->k == K::Ptr) {
    if (b->ik == PK_REF) b = b->tgt;
    if (b->k == K::Ptr) {
      if (!b->tgt) Bad(ExprText(be) + " points at nothing (nil), so " + ExprText(e) + " can't be reached.");
      if (b->h && static_cast<BoxObj*>(b->h.get())->dead) Bad("That pointer's thing was deleted, so it can't be read.");
      b = DerefP(b);
    }
  }
  switch (b->k) {
    case K::Obj: {
      Obj* o = static_cast<Obj*>(b->h.get());
      if (!e->s.empty()) {
        auto it = o->cls->fieldIndex.find(e->id);
        if (it != o->cls->fieldIndex.end()) return &o->f[it->second];
        if (Value* st = o->cls->findStatic(e->id)) return st;
        if (o->cls->findOp("at") && LookupOrNull(e->id)) {
          std::vector<Value> args{*LookupOrNull(e->id)};
          Value r = CallFunc(o->cls->findOp("at"), {}, &args, b, nullptr);
          if (r.k == K::Ptr && r.ik == PK_REF) return r.tgt;
        }
        return nullptr;
      }
      if (FuncInfo* at = o->cls->findOp("at")) {
        std::vector<Value> args{Eval(e->kids[1].get())};
        Value r = CallFunc(at, {}, &args, b, nullptr);
        if (r.k == K::Ptr && r.ik == PK_REF) return r.tgt;
      }
      Bad(o->cls->name + " has no positions, only named fields.");
    }
    case K::Coll: {
      auto* c = static_cast<Coll*>(b->h.get());
      std::string h = b->t ? b->t->head : "vec";
      if (!e->s.empty() && !LookupOrNull(e->id)) {
        if (h == "stk" || h == "hep" || h == "mhp") { if (e->s == "top") { if (c->items.empty()) Bad(ExprText(be) + " is empty, so it has no top."); return h == "stk" ? &c->items.back() : &c->items.front(); } }
        if (h == "que" && e->s == "front") { if (c->items.empty()) Bad(ExprText(be) + " is empty."); return &c->items.front(); }
        if (h == "que" && e->s == "back") { if (c->items.empty()) Bad(ExprText(be) + " is empty."); return &c->items.back(); }
        int ix; EnumInfo* en = EnumWithName(P, e->s, ix);
        if (!en) return nullptr;
      }
      bool isKey; Value key;
      int64_t at = IndexOf(*this, e, *b, isKey, key);
      if (h == "map" || h == "hsh") {
        auto it = c->m.find(key);
        if (it == c->m.end()) {
          Value d = DefaultOf(b->t->args[1]);
          it = c->m.emplace(key, d).first;
          if (h == "hsh") c->order.push_back(key);
        }
        return &it->second;
      }
      if (isKey) Bad("A position is a whole number. " + ExprText(be) + " is a list, not a map.");
      if (h == "set" || h == "bag" || h == "stk" || h == "que" || h == "hep" || h == "mhp") Bad(ExprText(be) + " has no positions.");
      if (at < 0 || (size_t)at >= c->items.size()) OutOfRange(ExprText(be), at, c->items.size());
      return &c->items[at];
    }
    case K::Str: return nullptr;   // a letter in a text is read with Eval; changing one is done in AssignLetter
    case K::Tup: {
      auto* t = static_cast<TupObj*>(b->h.get());
      if (e->s == "first") return &t->items[0];
      if (e->s == "second") return &t->items[1];
      bool isKey; Value key;
      int64_t at = IndexOf(*this, e, *b, isKey, key);
      if (at < 0 || (size_t)at >= t->items.size()) OutOfRange(ExprText(be), at, t->items.size());
      return &t->items[at];
    }
    case K::Json: {
      auto* j = static_cast<JsonObj*>(b->h.get());
      bool isKey; Value key;
      if (e->s.empty() || LookupOrNull(e->id)) {
        int64_t at = IndexOf(*this, e, *b, isKey, key);
        if (isKey) {
          if (j->jk == JsonObj::Null) j->jk = JsonObj::Ob;
          if (j->jk != JsonObj::Ob) ThrowStd("cannot use operator[] with a string argument with " + JsonTypeName(*j));
          for (auto& m : j->o) if (m.first == key.s) return &m.second;
          j->o.push_back({key.s, MakeJson(std::make_shared<JsonObj>())});
          return &j->o.back().second;
        }
        if (j->jk != JsonObj::Arr) ThrowStd("cannot use operator[] with a numeric argument with " + JsonTypeName(*j));
        if (at < 0 || (size_t)at >= j->a.size()) OutOfRange(ExprText(be), at, j->a.size());
        return &j->a[at];
      }
      return nullptr;
    }
    case K::Native: return nullptr;
    default: break;
  }
  return nullptr;
}

// ------------------------------------------------------------------ evaluating
static Value NameValue(Interp& I, const Expr* e) {
  if (Value* p = I.LookupOrNull(e->id)) {
    if (p->k == K::Ptr && p->ik == PK_REF) return *p->tgt;
    return *p;
  }
  const std::string& n = e->s;
  if (n == "slf") {
    Frame& f = I.frames.back();
    if (!f.self) Bad("slf is the thing a method is working on, so it goes inside a class's function.");
    Value pv; pv.k = K::Ptr; pv.ik = PK_RAW; pv.tgt = DerefP(f.self);
    pv.t = ParseType("ptr@any");
    return pv;
  }
  if (FuncInfo* f = I.FindFunction(n)) return I.MakeFuncValue(f, nullptr);
  {
    Frame& f = I.frames.back();
    if (f.self) {
      Value* sv = DerefP(f.self);
      if (sv && sv->k == K::Obj) if (FuncInfo* m = static_cast<Obj*>(sv->h.get())->cls->findMethod(n)) return I.MakeFuncValue(m, sv);
    }
  }
  int ix;
  if (EnumInfo* en = EnumWithName(I.P, n, ix)) return EnumValue(en, ix);
  if (IsValueWord(n)) {
    if (IsNoArgWord(n)) { std::vector<Value> a; return CallWord(I, n, a); }
    Value v; v.k = K::Func; auto fo = std::make_shared<FuncObj>(); fo->builtin = 1; fo->native = n; v.h = fo; v.t = ParseType("fun@any");
    return v;
  }
  if (IsNativeConstant(n)) return NativeConstant(n);
  if (IsNativeFunction(n)) { Value v; v.k = K::Func; auto fo = std::make_shared<FuncObj>(); fo->native = n; v.h = fo; return v; }
  I.Lookup(e->id);
  return VVoid();
}

Value Interp::EvalAt(const Expr* e) {
  const Expr* be = e->kids[0].get();
  if (be->k == E::Name && !LookupOrNull(be->id) && be->s != "slf" && !e->s.empty()) {
    // group@thing, Class@shared, Enum@choice, a library struct's constant
    if (P->groups.count(be->s)) {
      auto g = globalIndex.find(NameId(be->s + "::" + e->s));
      if (g != globalIndex.end()) return *g->second->p;
      auto f = P->funcs.find(be->s + "::" + e->s);
      if (f != P->funcs.end()) return MakeFuncValue(f->second, nullptr);
      auto en = P->enums.find(be->s + "::" + e->s);
      (void)en;
      Bad(be->s + " has no " + e->s + ".");
    }
    auto ci = P->classes.find(be->s);
    if (ci != P->classes.end()) {
      if (Value* st = ci->second->findStatic(e->id)) return *st;
      if (FuncInfo* m = ci->second->findMethod(e->s)) return MakeFuncValue(m, nullptr);
      Bad(be->s + " has no shared " + e->s + ".");
    }
    auto ei = P->enums.find(be->s);
    if (ei != P->enums.end()) {
      auto& nm = ei->second->names;
      auto it = std::find(nm.begin(), nm.end(), e->s);
      if (it == nm.end()) Bad(be->s + " has no choice " + e->s + ".");
      return EnumValue(ei->second, (int)(it - nm.begin()));
    }
    if (be->s == "std") NotYet("Reaching into C++'s std directly (std@" + e->s + ")");
  }
  Value temp;
  Value* p = nullptr;
  {
    Value* place = LValue(e);
    if (place) { Value r = *place; if (r.k == K::Ptr && r.ik == PK_REF) return *r.tgt; return r; }
  }
  // group@Enum@choice
  if (be->k == E::At && !e->s.empty() && be->kids[0]->k == E::Name && P->groups.count(be->kids[0]->s) && !be->s.empty()) {
    auto ei = P->enums.find(be->kids[0]->s + "::" + be->s);
    if (ei != P->enums.end()) {
      auto& nm = ei->second->names;
      auto it = std::find(nm.begin(), nm.end(), e->s);
      if (it == nm.end()) Bad(be->s + " has no choice " + e->s + ".");
      return EnumValue(ei->second, (int)(it - nm.begin()));
    }
  }
  // not a place: work on a copy
  p = LValueOrTemp(be, temp);
  if (!e->s.empty() && !LookupOrNull(e->id)) {
    Value* q = p;
    if (q->k == K::Ptr && q->ik == PK_REF) q = q->tgt;
    std::string th = q->t ? q->t->head : "";
    bool ptrWord = (q->k == K::Ptr || q->k == K::Nil) && (e->s == "use_count" || e->s == "get") && th != "opt";
    Value* d = DerefP(q);
    bool objMethod = false;
    if (d && d->k == K::Obj && !ptrWord) {
      Obj* o = static_cast<Obj*>(d->h.get());
      if (FuncInfo* m = o->cls->findMethod(e->s)) {
        size_t req = 0; for (auto& pr : m->params) if (!pr.def && !pr.pack) ++req;
        if (req == 0) objMethod = true;
        else return MakeFuncValue(m, d);
      }
    }
    if (ptrWord || objMethod || (d && d->k != K::Obj && d->k != K::Native) || th == "opt" || th == "alt" || th == "atm") {
      bool found = false;
      std::vector<const Expr*> none;
      Value r = CallMethod(q, e->s, none, nullptr, found);
      if (found) return r;
    }
  }
  Value* b = p;
  if (b->k == K::Ptr) {
    if (b->ik == PK_REF) b = b->tgt;
    if (b->k == K::Ptr) {
      if (!b->tgt) Bad(ExprText(be) + " points at nothing (nil), so " + ExprText(e) + " can't be reached.");
      b = DerefP(b);
    }
  }
  switch (b->k) {
    case K::Str: {
      bool isKey; Value key;
      if (!e->s.empty() && !LookupOrNull(e->id)) Bad("A text has letters at places 0, 1, 2 ... It has no " + e->s + ".");
      int64_t at = IndexOf(*this, e, *b, isKey, key);
      if (isKey) Bad("A text's letters are at whole-number places, like s@0.");
      if (at < 0 || (size_t)at > b->s.size()) OutOfRange(ExprText(be), at, b->s.size());
      Value c = VChr(at == (int64_t)b->s.size() ? '\0' : b->s[at]); c.t = TY_LTR; return c;
    }
    case K::Obj: {
      Obj* o = static_cast<Obj*>(b->h.get());
      if (!e->s.empty()) {
        if (FuncInfo* m = o->cls->findMethod(e->s)) return MakeFuncValue(m, b);
        std::vector<std::string> names;
        for (auto& f : o->cls->all) names.push_back(f.first->own[f.second].name);
        std::string list;
        for (size_t k = 0; k < names.size(); ++k) list += (k ? ", " : "") + names[k];
        Bad(o->cls->name + " has no " + e->s + "." + (list.empty() ? "" : " It has: " + list + "."));
      }
      break;
    }
    case K::Native: {
      if (!e->s.empty()) return NativeGetField(*b, e->s);
      break;
    }
    case K::Cpx: {
      auto* c = static_cast<CpxObj*>(b->h.get());
      if (e->s == "real") return MkDbl(c->c.real());
      if (e->s == "imag") return MkDbl(c->c.imag());
      break;
    }
    case K::Nil: Bad(ExprText(be) + " is nil, so " + ExprText(e) + " can't be reached.");
    default: break;
  }
  if (b->k == K::Json) {
    auto* j = static_cast<JsonObj*>(b->h.get());
    bool isKey; Value key;
    int64_t at = IndexOf(*this, e, *b, isKey, key);
    if (isKey) {
      if (j->jk != JsonObj::Ob) ThrowStd("cannot use operator[] with a string argument with " + JsonTypeName(*j));
      for (auto& m : j->o) if (m.first == key.s) return m.second;
      return MakeJson(std::make_shared<JsonObj>());
    }
    if (at < 0 || (size_t)at >= j->a.size()) OutOfRange(ExprText(be), at, j->a.size());
    return j->a[at];
  }
  if (b->k == K::Coll || b->k == K::Tup) {
    Value copy = *b;
    Value* q = LValue(e);   // will not be reached normally
    if (q) return *q;
    (void)copy;
  }
  Bad(ExprText(be) + " is " + KindWords(*b) + ", so it has no " + (e->s.empty() ? "places" : e->s) + ".");
}

Value Interp::Eval(const Expr* e) {
  switch (e->k) {
    case E::Int: return MkInt(e->i, e->ik);
    case E::Dbl: return MkDbl(e->d);
    case E::Str: return MkStr(e->s);
    case E::Interp: {
      std::string s;
      for (auto& k : e->kids) {
        if (k->k == E::Str) s += k->s;
        else s += Show(Eval(k.get()));
      }
      return MkStr(s);
    }
    case E::Chr: { Value c = VChr((char)e->i); c.t = TY_LTR; return c; }
    case E::Bool: return MkBool(e->i != 0);
    case E::Nil: return VNil();
    case E::Now: return VVoid();
    case E::Name: return NameValue(*this, e);
    case E::At: return EvalAt(e);
    case E::Call: return EvalCall(e);
    case E::Unary: {
      Value v = Plain(Eval(e->kids[0].get()));
      if (e->s == "!") {
        if (v.k == K::Obj) { Obj* o = static_cast<Obj*>(v.h.get()); if (FuncInfo* f = o->cls->findOp("!")) return CallFunc(f, {}, nullptr, &v, nullptr); }
        return MkBool(!Truth(v));
      }
      if (v.k == K::Int) return MkInt((int64_t)(0 - (uint64_t)v.i), Promote(v, v));
      if (v.k == K::Chr || v.k == K::Bool) return MkInt(-v.i, IK_NUM);
      if (v.k == K::Dbl) return MkDbl(-v.d, v.ik);
      if (v.k == K::Hug) { auto z = HugFromInt(0); std::shared_ptr<HugObj> keep; return VHug(HugAdd(*z, AsHug(v, keep), true)); }
      if (v.k == K::Obj) { Obj* o = static_cast<Obj*>(v.h.get()); if (FuncInfo* f = o->cls->findOp("-")) { if (f->params.empty()) return CallFunc(f, {}, nullptr, &v, nullptr); } }
      if (v.k == K::Cpx) { Value r = v; auto c = std::make_shared<CpxObj>(); c->c = -static_cast<CpxObj*>(v.h.get())->c; r.h = c; return r; }
      Bad("- works on numbers, but this is " + KindWords(v) + ".");
    }
    case E::Deref: {
      Value* p = LValue(e);
      return *p;
    }
    case E::Binary: {
      if (e->s == "&&") { if (!Truth(Eval(e->kids[0].get()))) return MkBool(false); return MkBool(Truth(Eval(e->kids[1].get()))); }
      if (e->s == "||") { if (Truth(Eval(e->kids[0].get()))) return MkBool(true); return MkBool(Truth(Eval(e->kids[1].get()))); }
      Value a = Eval(e->kids[0].get());
      Value b = Eval(e->kids[1].get());
      return Binary(e->s, a, b);
    }
    case E::List: {
      Value v; v.k = K::Coll;
      auto c = std::make_shared<Coll>();
      for (auto& k : e->kids) c->items.push_back(DeepCopy(Plain(Eval(k.get()))));
      v.h = c;
      const Type* et = nullptr;
      if (!c->items.empty()) et = c->items[0].t;
      v.t = et ? ParseType("vec@" + et->text) : ParseType("vec@num");
      return v;
    }
    case E::Kind: return DefaultOf(e->type);
  }
  Bad("internal: value kind");
}

std::vector<Value> Interp::EvalArgs(const Expr* x) {
  std::vector<Value> out;
  if (!x) return out;
  if (x->k == E::List) for (auto& k : x->kids) out.push_back(Eval(k.get()));
  else out.push_back(Eval(x));
  return out;
}

// ------------------------------------------------------------------ calls
// A function that only does whole-number maths on what it is given always gives the same answer
// for the same values, so its answers can be kept (memo). The output is the same; only the time changes.
static bool PureExpr(Interp& I, FuncInfo* f, const Expr* e, std::set<int>& locals) {
  if (!e) return true;
  switch (e->k) {
    case E::Int: case E::Bool: case E::Chr: return true;
    case E::Name: return locals.count(e->id) > 0;
    case E::Binary: case E::Unary: return PureExpr(I, f, e->kids[0].get(), locals) && (e->kids.size() < 2 || PureExpr(I, f, e->kids[1].get(), locals));
    case E::Call: {
      const Expr* c = e->kids[0].get();
      if (c->k != E::Name || locals.count(c->id)) return false;
      static const std::set<std::string> ok = {"nab","nmx","nmn","nkb","ngd","nmu","iff","num","big"};
      if (ok.count(c->s)) {} else {
        FuncInfo* g = I.FindFunction(c->s);
        if (!g) return false;
        if (g != f) { extern bool IsPureFunc(Interp&, FuncInfo*); if (!IsPureFunc(I, g)) return false; }
      }
      for (size_t k = 1; k < e->kids.size(); ++k) if (!PureExpr(I, f, e->kids[k].get(), locals)) return false;
      return true;
    }
    case E::List: for (auto& k : e->kids) if (!PureExpr(I, f, k.get(), locals)) return false; return true;
    default: return false;
  }
}
static bool PureBody(Interp& I, FuncInfo* f, const std::vector<Stmt*>& body, std::set<int>& locals) {
  static const std::set<std::string> ok = {"is","add","asb","aml","adv","amd","ieq","ine","ilt","ile","igt","ige","oeq","one","olt","ole","ogt","oge","oth",
    "weq","wne","wlt","wle","wgt","wge","flt","fle","fgt","fge","fne","ert","ebk","enx"};
  for (Stmt* s : body) {
    if (!ok.count(s->root)) return false;
    if (s->root == "is") {
      if (!s->names.empty() || !s->w || s->w->k != E::Name) return false;
      if (!PureExpr(I, f, s->x.get(), locals)) return false;
      locals.insert(s->w->id);
    } else if (s->root == "ert") {
      if (s->who != f->name || !PureExpr(I, f, s->x.get(), locals)) return false;
    } else if (s->root[0] == 'f') {
      locals.insert(s->whoId);
      if (!PureExpr(I, f, s->x.get(), locals)) return false;
    } else if (s->root == "ebk" || s->root == "enx") {
      if (s->x && !PureExpr(I, f, s->x.get(), locals)) return false;
    } else if (s->root == "oth") {
    } else {
      if (s->w && !PureExpr(I, f, s->w.get(), locals)) return false;
      if (!s->w && !locals.count(NameId(s->who))) return false;
      if (!PureExpr(I, f, s->x.get(), locals)) return false;
    }
    if (!PureBody(I, f, s->body, locals)) return false;
    if (!PureBody(I, f, s->chain, locals)) return false;
  }
  return true;
}
bool IsPureFunc(Interp& I, FuncInfo* f) {
  if (f->pureChecked) return f->pure;
  f->pureChecked = true; f->pure = true;   // while checking, a call to itself is fine
  bool p = !f->isLambda && !f->cls && !f->isGen && !f->retRef && f->ret && IsIntType(f->ret) && !f->params.empty();
  std::set<int> locals;
  for (auto& pr : f->params) { if (!pr.type || !IsIntType(pr.type) || pr.ref || pr.look || pr.take || pr.pack) p = false; locals.insert(pr.id); }
  if (p) p = PureBody(I, f, f->body, locals);
  f->pure = p;
  return p;
}

static std::string Plural(size_t n, const char* one, const char* many) { return std::to_string(n) + " " + (n == 1 ? one : many); }

Value Interp::CallFunc(FuncInfo* f, const std::vector<const Expr*>& argExprs, std::vector<Value>* argVals, Value* self,
                       FuncObj* closure, const Type* objType) {
  (void)objType;
  if (f->isAbstract && f->body.empty()) Bad(f->name + " must be redone (dmb) by a child class before it can be used.");
  size_t nargs = argVals ? argVals->size() : argExprs.size();
  size_t required = 0;
  bool pack = !f->params.empty() && f->params.back().pack;
  for (auto& p : f->params) if (!p.def && !p.pack) ++required;
  if (!pack && (nargs < required || nargs > f->params.size())) {
    if (f->params.size() == required)
      Bad(f->name + " takes " + Plural(f->params.size(), "value", "values") + ", but it was given " + std::to_string(nargs) + ".");
    Bad(f->name + " takes " + std::to_string(required) + " to " + std::to_string(f->params.size()) + " values, but it was given " + std::to_string(nargs) + ".");
  }
  // values first, in the caller's frame
  struct Bind { int id; Value v; Value* alias; };
  std::vector<Bind> binds;
  for (size_t k = 0; k < f->params.size(); ++k) {
    const Param& p = f->params[k];
    if (p.pack) {
      // a vec that takes the rest: f&1&2&3 — or one vec given whole
      Value v = DefaultOf(p.type);
      auto* c = static_cast<Coll*>(v.h.get());
      if (nargs == k + 1) {
        Value one = argVals ? (*argVals)[k] : Eval(argExprs[k]);
        one = Plain(one);
        if (one.k == K::Coll) { binds.push_back({p.id, Convert(one, p.type), nullptr}); continue; }
        c->items.push_back(Convert(one, p.type->args[0]));
      } else {
        for (size_t j = k; j < nargs; ++j) c->items.push_back(Convert(argVals ? (*argVals)[j] : Eval(argExprs[j]), p.type->args[0]));
      }
      binds.push_back({p.id, v, nullptr});
      break;
    }
    if (k >= nargs) {
      Value d = Eval(p.def.get());
      binds.push_back({p.id, p.type ? Convert(d, p.type) : d, nullptr});
      continue;
    }
    if ((p.ref || p.look) && !argVals) {
      Value* place = LValue(argExprs[k]);
      if (place) {
        if (place->k == K::Ptr && place->ik == PK_REF) place = place->tgt;
        if (p.type && p.type->cls && place->k == K::Obj) {}  // a child class passed as its parent: same object
        binds.push_back({p.id, Value(), place});
        continue;
      }
      if (p.ref) Bad(f->name + " changes its " + p.name + " (ref@), so it needs a name there, not a value.");
    }
    Value v = argVals ? (*argVals)[k] : Eval(argExprs[k]);
    if ((p.ref || p.look) && argVals && v.k == K::Ptr && v.ik == PK_REF) { binds.push_back({p.id, Value(), v.tgt}); continue; }
    v = Plain(v);
    if (p.take && !argVals && argExprs[k]->k == E::Name) {
      Value* src = LookupOrNull(argExprs[k]->id);
      if (src) {
        Value moved = *src;
        if (src->k == K::Ptr) { const Type* t = src->t; *src = VNil(); src->t = t; }
        else if (src->k == K::Str) src->s.clear();
        else if (src->k == K::Coll) *src = MakeColl(src->t);
        binds.push_back({p.id, p.type ? Convert(moved, p.type) : moved, nullptr});
        continue;
      }
    }
    if (p.type && p.type->cls && v.k == K::Obj && static_cast<Obj*>(v.h.get())->cls != p.type->cls && !p.ref && !p.look) {
      binds.push_back({p.id, Convert(v, p.type), nullptr});   // sliced to the parent, like C++
      continue;
    }
    if (p.type) binds.push_back({p.id, Convert(v, p.type), nullptr});
    else { Value c = DeepCopy(v); if (!c.t) c.t = v.t; binds.push_back({p.id, c, nullptr}); }
  }
  std::vector<int64_t> memoKey;
  bool memo = closure == nullptr && self == nullptr && IsPureFunc(*this, f) && binds.size() == f->params.size();
  if (memo) {
    for (auto& b : binds) { if (b.alias || b.v.k != K::Int) { memo = false; break; } memoKey.push_back(b.v.i); }
    if (memo) { auto it = f->memo.find(memoKey); if (it != f->memo.end()) return it->second; }
  }
  if (frames.size() > 20000) Bad("Too many calls inside calls (" + f->name + " keeps calling itself). Check where it stops.");
  Frame fr;
  fr.base = stack.size();
  fr.fn = f;
  fr.closure = closure;
  fr.self = self;
  fr.group = f->cls ? f->cls->group : frames.back().group;
  if (f->file.size()) {}
  frames.push_back(fr);
  size_t frameIndex = frames.size() - 1;
  for (auto& b : binds) {
    if (b.alias) DeclareAlias(b.id, b.alias);
    else { Value v = std::move(b.v); if (!v.t) v.t = nullptr; Declare(b.id, v); }
  }
  Value result;
  if (f->isGen) {
    std::vector<Value> items;
    frames[frameIndex].gen = &items;
    frames[frameIndex].genCap = 100000;
    size_t sm = stack.size();
    Caught c = Protect([&] { ExecBlock(f->body, true); });
    if (c.k == CK_GENFULL) { frames.resize(frameIndex + 1); PopTo(sm); }
    else if (c.k != CK_NONE) { frames.resize(frameIndex); PopTo(fr.base); Rethrow(c); }
    Value g; g.k = K::Gen; auto go = std::make_shared<GenObj>(); go->items = std::move(items); g.h = go; g.t = f->ret;
    result = g;
  } else {
    Flow fl = ExecBlock(f->body, true);
    Frame& me = frames[frameIndex];
    if (fl == F_RETURN) {
      if (me.retRef) { result.k = K::Ptr; result.ik = PK_REF; result.tgt = me.retRef; }
      else result = me.ret;
    } else if (f->ret && !f->returnsNothing) {
      result = DefaultOf(f->ret);
    } else result = VVoid();
  }
  PopTo(frames[frameIndex].base);
  frames.resize(frameIndex);
  if (memo && f->memo.size() < 2000000) f->memo[memoKey] = result;
  return result;
}

Value Interp::CallValue(const Value& fnv0, std::vector<Value> args) {
  Value fnv = Plain(fnv0);
  if (fnv.k == K::Func) {
    auto* fo = static_cast<FuncObj*>(fnv.h.get());
    if (fo->builtin >= 0) return CallWord(*this, fo->native, args);
    if (!fo->native.empty()) { std::vector<Value*> refs(args.size(), nullptr); return CallNative(fo->native, args, refs); }
    return CallFunc(fo->fn, {}, &args, fo->self, fo->fn->isLambda ? fo : nullptr);
  }
  if (fnv.k == K::Obj) {
    Obj* o = static_cast<Obj*>(fnv.h.get());
    if (FuncInfo* f = o->cls->findOp("call")) {
      Value* place = &fnv;
      return CallFunc(f, {}, &args, place, nullptr);
    }
    Bad(o->cls->name + " can't be called. Give it a call with dop: call dop ...");
  }
  if (fnv.k == K::Nil) ThrowStd("bad_function_call");
  Bad("That is " + KindWords(fnv) + ", so it can't be called.");
}

FuncInfo* PickCtor(ClassInfo* c, size_t n) {
  FuncInfo* best = nullptr;
  for (FuncInfo* f : c->ctors) {
    size_t req = 0; for (auto& p : f->params) if (!p.def) ++req;
    bool pack = !f->params.empty() && f->params.back().pack;
    if ((n >= req && n <= f->params.size()) || (pack && n >= req - 1)) { if (!best || f->params.size() == n) best = f; }
  }
  return best;
}

void Interp::RunCtor(Value* self, ClassInfo* c, std::vector<Value>& args, const std::vector<const Expr*>* argExprs) {
  Obj* o = static_cast<Obj*>(self->h.get());
  // fields start at their own starting values
  if (c->ctors.empty()) {
    for (auto* p : c->parents) { std::vector<Value> none; RunCtor(self, p, none, nullptr); }
    size_t k = 0;
    for (auto& fi : c->own) {
      int idx = c->fieldIndex[fi.id];
      if (k < args.size()) o->f[idx] = Convert(args[k], fi.type);
      ++k;
    }
    if (args.size() > c->own.size()) Bad(c->name + " has " + std::to_string(c->own.size()) + " fields, but it was given " + std::to_string(args.size()) + " values. To take other values, give it a constructor with dmk.");
    return;
  }
  FuncInfo* f = PickCtor(c, args.size());
  if (!f) {
    FuncInfo* any = c->ctors[0];
    Bad(c->name + " takes " + Plural(any->params.size(), "value", "values") + ", but it was given " + std::to_string(args.size()) + ".");
  }
  // parents first: dbs lines say what they are made with
  for (auto* p : c->parents) {
    std::vector<Value> pargs;
    bool given = false;
    for (Stmt* b : f->dbs) {
      if (b->who == p->name || (b->who == "now" && c->parents.size() == 1)) {
        // the dbs line's values can use the constructor's own values
        Frame fr; fr.base = stack.size(); fr.fn = f; fr.self = self; frames.push_back(fr);
        for (size_t k = 0; k < f->params.size() && k < args.size(); ++k) Declare(f->params[k].id, Convert(args[k], f->params[k].type));
        for (size_t k = args.size(); k < f->params.size(); ++k) if (f->params[k].def) Declare(f->params[k].id, Eval(f->params[k].def.get()));
        pargs = EvalArgs(b->x.get());
        PopTo(fr.base); frames.pop_back();
        given = true;
      }
    }
    (void)given;
    RunCtor(self, p, pargs, nullptr);
  }
  std::vector<Value> a = args;
  (void)argExprs;
  CallFunc(f, {}, &a, self, nullptr);
}

Value Interp::Construct(const Type* t, std::vector<Value> args, const std::vector<const Expr*>* argExprs, bool noCtor) {
  ClassInfo* c = t->cls;
  if (!c) Bad("internal: not a class");
  for (auto& m : c->methods) if (m.second->isAbstract && m.second->body.empty() && m.second->cls == c)
    Bad(c->name + " has a function that must be redone (dmb), so you can't make one. Make one of its child classes instead.");
  Value v; v.k = K::Obj; v.t = t;
  auto o = std::make_shared<Obj>();
  o->cls = c;
  o->targs = t->args;
  v.h = o;
  o->f.resize(c->all.size());
  // starting values
  std::string savedG = P->curGroup;
  for (size_t k = 0; k < c->all.size(); ++k) {
    ClassInfo* owner = c->all[k].first;
    FieldInfo& fi = owner->own[c->all[k].second];
    const Type* ft = fi.type;
    if (ft && ft->param && !owner->tparams.empty()) {
      for (size_t j = 0; j < owner->tparams.size() && j < t->args.size(); ++j) if (owner->tparams[j] == ft->head) ft = t->args[j];
    }
    P->curGroup = owner->group;
    if (fi.def) { o->f[k] = Eval(fi.def); if (ft) o->f[k] = Convert(o->f[k], ft); else o->f[k].t = o->f[k].t; }
    else o->f[k] = DefaultOf(ft);
    if (!o->f[k].t) o->f[k].t = ft;
    if (ft && o->f[k].t != ft && !ft->param) o->f[k].t = ft;
  }
  P->curGroup = savedG;
  if (noCtor) return v;
  RunCtor(&v, c, args, argExprs);
  return v;
}

// a kind used like a function: num&"42", vec@txt&, map&"a"&1, ptr@Dog&p, Box@num&5
static Value ApplyKind(Interp& I, const Type* t, std::vector<Value>& args, const Expr* e) {
  const std::string& h = t->head;
  if (h == "srv" || h == "sck" || h == "cln") NotYet("Talking to other computers (" + h + ")");
  if (t->cls) return I.Construct(t, args, nullptr);
  if (t->nat) {
    if (args.empty()) return NativeDefault(t->nat);
    std::vector<Value*> refs(args.size(), nullptr);
    return CallNative(t->text, args, refs);
  }
  if (h == "ptr" || h == "own" || h == "shr") {
    if (args.empty()) { Value v = VNil(); v.t = t; return v; }
    Value a = Plain(args[0]);
    if (a.k == K::Nil) { Value v = VNil(); v.t = t; return v; }
    if (a.k != K::Ptr) Bad(t->text + "&x changes a pointer's kind, and x isn't a pointer.");
    Value* target = DerefP(&a);
    const Type* want = t->args.empty() ? nullptr : t->args[0];
    if (want && want->cls) {
      if (target->k != K::Obj || !static_cast<Obj*>(target->h.get())->cls->isA(want->cls)) { Value v = VNil(); v.t = t; return v; }
    }
    Value r = a; r.t = t; return r;
  }
  if (IsCollectionHead(h) && h != "opt" && h != "alt" && h != "atm" && h != "par" && h != "tup" && h != "fun" && h != "gnr" && h != "fut") {
    Value v = DefaultOf(t);
    auto* c = static_cast<Coll*>(v.h.get());
    if (h == "map" || h == "hsh") {
      if (args.size() % 2) Bad("A map is made from pairs of a key and a value: map&\"a\"&1&\"b\"&2.");
      for (size_t k = 0; k + 1 < args.size(); k += 2) {
        Value key = Convert(args[k], t->args[0]);
        if (!c->m.count(key) && h == "hsh") c->order.push_back(key);
        c->m[key] = Convert(args[k + 1], t->args[1]);
      }
      return v;
    }
    if (h == "set" || h == "bag") {
      for (auto& a : args) { Value key = Convert(a, t->args[0]); if (!c->m.count(key)) { c->m[key] = VVoid(); if (h == "bag") c->order.push_back(key); } }
      return v;
    }
    if (h == "arr") {
      c->items.clear();
      for (auto& a : args) c->items.push_back(Convert(a, t->args[0]));
      while ((long long)c->items.size() < t->n) c->items.push_back(DefaultOf(t->args[0]));
      return v;
    }
    for (auto& a : args) c->items.push_back(Convert(a, t->args.empty() ? nullptr : t->args[0]));
    if (h == "hep" || h == "mhp") I.HeapFix(v);
    return v;
  }
  if (h == "par" || h == "tup") {
    Value v; v.k = K::Tup; v.t = t; auto tp = std::make_shared<TupObj>();
    if (args.size() != t->args.size()) Bad(t->text + " holds " + std::to_string(t->args.size()) + " values, but it was given " + std::to_string(args.size()) + ".");
    for (size_t k = 0; k < args.size(); ++k) tp->items.push_back(Convert(args[k], t->args[k]));
    v.h = tp; return v;
  }
  if (h == "cpx") {
    Value v; v.k = K::Cpx; auto c = std::make_shared<CpxObj>();
    double re = args.size() > 0 ? ToDbl(args[0]) : 0, im = args.size() > 1 ? ToDbl(args[1]) : 0;
    c->c = {re, im}; v.h = c; v.t = TY_CPX; return v;
  }
  if (h == "hug") {
    if (args.size() != 1) Bad("hug takes one value here: hug&x.");
    Value a = Plain(args[0]);
    if (a.k == K::Str) return VHug(HugFromText(a.s));
    if (a.k == K::Int) return VHug(HugFromInt(a.i));
    if (a.k == K::Hug) return a;
    Bad("hug&x takes a whole number or a text of digits.");
  }
  if (h == "jsn") {
    if (args.empty()) return DefaultOf(t);
    return ToJson(args[0]);
  }
  if (args.size() != 1) {
    if (args.empty() && (h == "opt" || h == "alt" || h == "atm" || h == "fun")) return DefaultOf(t);
    Bad(t->text + " takes one value here: " + t->text + "&x.");
  }
  Value a = Plain(args[0]);
  if (IsIntType(t) && a.k == K::Str) {
    if (h == "big" || h == "pbg") {
      Value n = VInt(0); (void)n;
      int64_t v = 0; size_t i = 0; std::string s = a.s;
      while (i < s.size() && isspace((unsigned char)s[i])) ++i;
      bool neg = false; if (i < s.size() && (s[i] == '-' || s[i] == '+')) { neg = s[i] == '-'; ++i; }
      if (i >= s.size() || !isdigit((unsigned char)s[i])) ThrowStd("invalid stoll argument");
      while (i < s.size() && isdigit((unsigned char)s[i])) { v = v * 10 + (s[i] - '0'); ++i; }
      return MkInt(neg ? -v : v, IkOf(t));
    }
    return MkInt(SafeStoi(a.s), IkOf(t));
  }
  if ((h == "dec" || h == "flo") && a.k == K::Str) return MkDbl(SafeStod(a.s), h == "flo");
  if (h == "txt") return MkStr(ToText(a));
  if (h == "yno") { return MkBool(I.Truth(a)); }
  (void)e;
  Value r = Convert(a, t);
  r.t = t;
  return r;
}

static Value CallOnPlace(Interp& I, Value* recv, const std::string& name, std::vector<Value>& args, bool& found);

Value Interp::EvalCall(const Expr* e) {
  const Expr* callee = e->kids[0].get();
  std::vector<const Expr*> argEx;
  for (size_t k = 1; k < e->kids.size(); ++k) argEx.push_back(e->kids[k].get());
  auto evalArgs = [&] { std::vector<Value> a; for (auto* x : argEx) a.push_back(Eval(x)); return a; };
  if (callee->k == E::Kind) { auto a = evalArgs(); return ApplyKind(*this, callee->type, a, e); }
  if (callee->k == E::Name) {
    const std::string& n = callee->s;
    if (Value* v = LookupOrNull(callee->id)) {
      Value fv = Plain(*v);
      if (fv.k == K::Func) {
        auto* fo = static_cast<FuncObj*>(fv.h.get());
        if (fo->fn && fo->builtin < 0 && fo->native.empty()) return CallFunc(fo->fn, argEx, nullptr, fo->self, fo->fn->isLambda ? fo : nullptr);
      }
      return CallValue(*v, evalArgs());
    }
    // a method of the class we are in, called without slf
    Frame& f = frames.back();
    if (f.self) {
      Value* sv = DerefP(f.self);
      if (sv && sv->k == K::Obj) {
        if (FuncInfo* m = static_cast<Obj*>(sv->h.get())->cls->findMethod(n)) return CallFunc(m, argEx, nullptr, m->isStatic ? nullptr : sv, nullptr);
      }
    }
    if (f.fn && f.fn->cls) if (FuncInfo* m = f.fn->cls->findMethod(n)) if (m->isStatic) return CallFunc(m, argEx, nullptr, nullptr, nullptr);
    if (FuncInfo* fn = FindFunction(n)) return CallFunc(fn, argEx, nullptr, nullptr, nullptr);
    if (IsCollectionHead(n) && (!TryParseType(n) || ((n == "tup" || n == "par") && TryParseType(n)->args.empty()))) {
      auto a = evalArgs();
      auto kt = [&](size_t k) { const Type* t = k < a.size() ? TypeFor(a[k]) : nullptr; return t ? t->text : std::string("num"); };
      std::string text;
      if (a.empty()) Bad("An empty one has to say what it will hold: " + n + "@num&.");
      if (n == "map" || n == "hsh") text = n + "@" + kt(0) + "@" + kt(1);
      else if (n == "par" || n == "tup") { text = n; for (size_t k = 0; k < a.size(); ++k) text += "@" + kt(k); }
      else text = n + "@" + kt(0);
      const Type* t = ParseType(text);
      return ApplyKind(*this, t, a, e);
    }
    if (const Type* t = TryParseType(n)) {
      auto a = evalArgs();
      if (t->cls) {
        std::string saved = P->curGroup; P->curGroup = t->cls->group;
        Value r = Construct(t, a, &argEx);
        P->curGroup = saved;
        return r;
      }
      return ApplyKind(*this, t, a, e);
    }
    if (IsValueWord(n)) {
      std::vector<Value> a;
      // words that take a function: the function can be a name of a function
      for (auto* x : argEx) a.push_back(Eval(x));
      return CallWord(*this, n, a);
    }
    if (IsNativeFunction(n)) {
      std::vector<Value> a; std::vector<Value*> refs;
      for (auto* x : argEx) { Value* p = LValue(x); refs.push_back(p); a.push_back(p ? *p : Eval(x)); }
      return CallNative(n, a, refs);
    }
    if (IsQtFunction(n)) { auto a = evalArgs(); return CallQt(n, a); }
    Bad("I don't know " + n + " yet. Make it first.");
  }
  if (callee->k == E::At) {
    const Expr* be = callee->kids[0].get();
    const std::string& m = callee->s;
    if (be->k == E::Name && !LookupOrNull(be->id) && be->s != "slf") {
      if (P->groups.count(be->s)) {
        auto f = P->funcs.find(be->s + "::" + m);
        if (f != P->funcs.end()) {
          std::string saved = P->curGroup; P->curGroup = be->s;
          Value r = CallFunc(f->second, argEx, nullptr, nullptr, nullptr);
          P->curGroup = saved;
          return r;
        }
        auto c = P->classes.find(be->s + "::" + m);
        if (c != P->classes.end()) {
          auto a = evalArgs();
          std::string saved = P->curGroup; P->curGroup = be->s;
          Value r = Construct(TryParseType(be->s + "::" + m) ? ParseType(be->s + "::" + m) : ParseType(m), a, &argEx);
          P->curGroup = saved;
          return r;
        }
        Bad(be->s + " has no " + m + ".");
      }
      auto ci = P->classes.find(be->s);
      if (ci != P->classes.end()) {
        if (FuncInfo* f = ci->second->findMethod(m)) return CallFunc(f, argEx, nullptr, nullptr, nullptr);
        Bad(be->s + " has no shared function " + m + ".");
      }
      if (be->s == "std") NotYet("Reaching into C++'s std directly (std@" + m + ")");
    }
    Value temp;
    Value* recv = LValueOrTemp(be, temp);
    bool found = false;
    Value r = CallMethod(recv, m, argEx, nullptr, found);
    if (!found) {
      Value* b = DerefP(recv);
      if (b && b->k == K::Obj) {
        Obj* o = static_cast<Obj*>(b->h.get());
        // a field that holds a function
        auto it = o->cls->fieldIndex.find(callee->id);
        if (it != o->cls->fieldIndex.end()) return CallValue(o->f[it->second], evalArgs());
        Bad(o->cls->name + " has no " + m + ".");
      }
      Bad(ExprText(be) + " is " + (b ? KindWords(*b) : std::string("nothing")) + ", and it has no " + m + ".");
    }
    return r;
  }
  if (callee->k == E::Call) {
    Value f = EvalCall(callee);
    return CallValue(f, evalArgs());
  }
  Bad("That can't be called.");
}

static FuncInfo* VirtualFind(ClassInfo* dyn, ClassInfo* stat, const std::string& name) {
  (void)stat;
  return dyn->findMethod(name);
}

Value Interp::CallMethod(Value* recv, const std::string& name, const std::vector<const Expr*>& argExprs, std::vector<Value>* argVals, bool& found) {
  found = true;
  Value* b = recv;
  if (b->k == K::Ptr && b->ik == PK_REF) b = b->tgt;
  {
    std::string th = b->t ? b->t->head : "";
    if (th == "opt" || th == "alt" || th == "atm") {
      std::vector<Value> a;
      if (argVals) a = *argVals; else for (auto* x : argExprs) a.push_back(Eval(x));
      return CallOnPlace(*this, b, name, a, found);
    }
  }
  // the pointer's own words
  if (b->k == K::Ptr || b->k == K::Nil) {
    if (name == "use_count") return MkInt(b->k == K::Nil || !b->h ? 0 : (int64_t)b->h.use_count(), IK_BIG);
    if (name == "get") { Value r = *b; r.ik = PK_RAW; r.h.reset(); if (b->k == K::Nil) return VNil(); return r; }
    if (name == "reset") {
      Value old = *b; const Type* t = b->t;
      *b = VNil(); b->t = t;
      Destroy(old);
      return VVoid();
    }
    if (name == "release") { Value r = *b; const Type* t = b->t; *b = VNil(); b->t = t; r.ik = PK_RAW; return r; }
    if (b->k == K::Nil) Bad("That pointer points at nothing (nil), so it has no " + name + ".");
    if (b->h && static_cast<BoxObj*>(b->h.get())->dead) Bad("That pointer's thing was deleted, so it can't be used.");
    b = DerefP(b);
  }
  if (b->k == K::Obj) {
    Obj* o = static_cast<Obj*>(b->h.get());
    if (FuncInfo* f = VirtualFind(o->cls, o->cls, name)) {
      if (argVals) return CallFunc(f, {}, argVals, f->isStatic ? nullptr : b, nullptr);
      return CallFunc(f, argExprs, nullptr, f->isStatic ? nullptr : b, nullptr);
    }
    auto it = o->cls->fieldIndex.find(NameId(name));
    if (it != o->cls->fieldIndex.end() && o->f[it->second].k == K::Func) {
      std::vector<Value> a; if (argVals) a = *argVals; else for (auto* x : argExprs) a.push_back(Eval(x));
      return CallValue(o->f[it->second], a);
    }
    found = false;
    return VVoid();
  }
  std::vector<Value> a;
  if (argVals) a = *argVals; else for (auto* x : argExprs) a.push_back(Eval(x));
  return CallOnPlace(*this, b, name, a, found);
}

// C++ words on library kinds: v@size&, s@top&, o@value_or&0, f@get&, c@close& ...
static Value CallOnPlace(Interp& I, Value* b, const std::string& name, std::vector<Value>& a, bool& found) {
  found = true;
  auto need = [&](size_t n) { if (a.size() != n) Bad(name + " takes " + std::to_string(n) + (n == 1 ? " value." : " values.")); };
  std::string h = b->t ? b->t->head : "";
  switch (b->k) {
    case K::Coll: {
      auto* c = static_cast<Coll*>(b->h.get());
      bool keyed = h == "map" || h == "hsh" || h == "set" || h == "bag";
      if (name == "size") return MkInt(keyed ? (int64_t)c->m.size() : (int64_t)c->items.size(), IK_BIG);
      if (name == "empty") return MkBool(keyed ? c->m.empty() : c->items.empty());
      if (name == "clear") { c->items.clear(); c->m.clear(); c->order.clear(); return VVoid(); }
      if (name == "push_back" || name == "push" || name == "send" || name == "add" || name == "insert") {
        if (name == "insert" && keyed) { Value key = Convert(a[0], b->t->args[0]); if (!c->m.count(key)) { c->m[key] = a.size() > 1 ? a[1] : VVoid(); if (h == "hsh" || h == "bag") c->order.push_back(key); } return VVoid(); }
        need(1);
        if (h == "chn" && c->closed) Bad("That channel is closed, so nothing more can be sent.");
        c->items.push_back(Convert(a[0], b->t && !b->t->args.empty() ? b->t->args[0] : nullptr));
        if (h == "hep" || h == "mhp") I.HeapFix(*b);
        return VVoid();
      }
      if (name == "pop_back" || name == "pop") {
        if (c->items.empty()) Bad("It is empty, so there is nothing to take off.");
        if (h == "que") c->items.erase(c->items.begin());
        else if (h == "hep" || h == "mhp") { c->items.erase(c->items.begin()); I.HeapFix(*b); }
        else c->items.pop_back();
        return VVoid();
      }
      if (name == "top" || name == "front" || name == "back") {
        if (c->items.empty()) Bad("It is empty, so it has no " + name + ".");
        if (name == "top") return h == "stk" ? c->items.back() : c->items.front();
        return name == "front" ? c->items.front() : c->items.back();
      }
      if (name == "count" || name == "contains") {
        need(1);
        if (keyed) return name == "count" ? MkInt(c->m.count(Convert(a[0], b->t->args[0])), IK_BIG) : MkBool(c->m.count(Convert(a[0], b->t->args[0])) > 0);
        int64_t n = 0; for (auto& x : c->items) if (Equal(x, a[0])) ++n;
        return name == "count" ? MkInt(n, IK_BIG) : MkBool(n > 0);
      }
      if (name == "erase" && keyed) {
        need(1); Value key = Convert(a[0], b->t->args[0]);
        size_t n = c->m.erase(key);
        if (n) c->order.erase(std::remove_if(c->order.begin(), c->order.end(), [&](const Value& v) { return Equal(v, key); }), c->order.end());
        return MkInt((int64_t)n, IK_BIG);
      }
      if (name == "at") {
        need(1);
        if (keyed) { auto it = c->m.find(Convert(a[0], b->t->args[0])); if (it == c->m.end()) ThrowStd("map::at"); return it->second; }
        int64_t k = ToInt(a[0]);
        if (k < 0 || (size_t)k >= c->items.size()) ThrowStd("vector::_M_range_check: __n (which is " + std::to_string(k) + ") >= this->size() (which is " + std::to_string(c->items.size()) + ")");
        return c->items[k];
      }
      if (name == "close") { c->closed = true; return VVoid(); }
      if (name == "receive" || name == "recv") {
        if (c->items.empty()) return VNil();
        Value v = c->items.front(); c->items.erase(c->items.begin()); return v;
      }
      break;
    }
    case K::Str: {
      if (name == "size" || name == "length") return MkInt((int64_t)b->s.size(), IK_BIG);
      if (name == "empty") return MkBool(b->s.empty());
      if (name == "clear") { b->s.clear(); return VVoid(); }
      if (name == "push_back") { need(1); b->s += (char)ToInt(a[0]); return VVoid(); }
      if (name == "substr") { size_t p = (size_t)ToInt(a[0]); if (p > b->s.size()) ThrowStd("basic_string::substr: __pos (which is " + std::to_string(p) + ") > this->size() (which is " + std::to_string(b->s.size()) + ")"); return MkStr(a.size() > 1 ? b->s.substr(p, (size_t)ToInt(a[1])) : b->s.substr(p)); }
      if (name == "find") { need(1); size_t p = b->s.find(ToText(a[0])); return MkInt(p == std::string::npos ? -1 : (int64_t)p, IK_BIG); }
      break;
    }
    case K::Tup: {
      auto* t = static_cast<TupObj*>(b->h.get());
      if (name == "first") return t->items[0];
      if (name == "second") return t->items[1];
      break;
    }
    case K::Json: {
      auto* j = static_cast<JsonObj*>(b->h.get());
      if (name == "text" || name == "txt" || name == "string") {
        if (j->jk != JsonObj::Str) ThrowStd("type must be string, but is " + JsonTypeName(*j));
        return MkStr(j->s);
      }
      if (name == "size") return MkInt(j->jk == JsonObj::Arr ? (int64_t)j->a.size() : j->jk == JsonObj::Ob ? (int64_t)j->o.size() : j->jk == JsonObj::Null ? 0 : 1, IK_BIG);
      if (name == "dump") return MkStr(JsonText(*b));
      if (name == "push" || name == "push_back" || name == "add") {
        need(1);
        if (j->jk == JsonObj::Null) j->jk = JsonObj::Arr;
        if (j->jk != JsonObj::Arr) ThrowStd("cannot use push_back() with " + JsonTypeName(*j));
        j->a.push_back(ToJson(a[0])); return VVoid();
      }
      if (name == "num" || name == "number") return Convert(*b, TY_NUM);
      if (name == "dec") return Convert(*b, TY_DEC);
      if (name == "yno") return Convert(*b, TY_YNO);
      if (name == "has" || name == "contains") { need(1); std::string k = ToText(a[0]); for (auto& m : j->o) if (m.first == k) return MkBool(true); return MkBool(false); }
      break;
    }
    case K::Cpx: {
      auto* c = static_cast<CpxObj*>(b->h.get());
      if (name == "real") return MkDbl(c->c.real());
      if (name == "imag") return MkDbl(c->c.imag());
      break;
    }
    case K::Stream: {
      auto* s = static_cast<StreamObj*>(b->h.get());
      if (name == "close") {
        s->open = false; return VVoid();
      }
      if (name == "open") {
        need(1);
        s->path = ToText(a[0]); s->open = true; s->pos = 0; s->fail = false;
        if (s->out) g_disk.files[s->path] = "";
        else { auto it = g_disk.files.find(s->path); if (it == g_disk.files.end()) s->fail = true; else s->buf = it->second; }
        return VVoid();
      }
      if (name == "is_open") return MkBool(s->open && !s->fail);
      if (name == "good") return MkBool(!s->fail);
      if (name == "eof") return MkBool(s->pos >= s->buf.size());
      break;
    }
    case K::Handle: {
      auto* hd = static_cast<HandleObj*>(b->h.get());
      if (name == "join" || name == "detach" || name == "wait" || name == "notify_one" || name == "notify_all" || name == "lock" || name == "unlock") { hd->joined = true; return VVoid(); }
      if (name == "get") return hd->v;
      if (name == "joinable") return MkBool(!hd->joined);
      break;
    }
    case K::Native: {
      std::vector<Value> args = a;
      args.insert(args.begin(), *b);
      std::vector<Value*> refs(args.size(), nullptr); refs[0] = b;
      if (IsNativeFunction(name)) return CallNative(name, args, refs);
      break;
    }
    default: break;
  }
  // opt / alt / atm kept as plain values with their kind
  if (h == "opt") {
    if (name == "value") { if (b->k == K::Nil) ThrowStd("bad optional access"); Value r = *b; r.t = b->t->args[0]; return r; }
    if (name == "value_or") { need(1); if (b->k == K::Nil) return Convert(a[0], b->t->args[0]); Value r = *b; r.t = b->t->args[0]; return r; }
    if (name == "has_value") return MkBool(b->k != K::Nil);
    if (name == "reset") { const Type* t = b->t; *b = VNil(); b->t = t; return VVoid(); }
  }
  auto actual = [](const Value& v) -> std::string {
    switch (v.k) {
      case K::Str: return "txt"; case K::Chr: return "ltr"; case K::Bool: return "yno";
      case K::Dbl: return v.ik ? "flo" : "dec";
      case K::Int: return v.ik == IK_BIG ? "big" : v.ik == IK_SML ? "sml" : v.ik == IK_POS ? "pos" : v.ik == IK_BYT ? "byt" : v.ik == IK_PBG ? "pbg" : "num";
      default: return v.t ? v.t->text : "";
    }
  };
  if (h == "alt") {
    for (auto* at : b->t->args) if (name == at->text) {
      Value probe = Convert(*b, at);
      if (actual(*b) != at->text) ThrowStd("bad variant access");
      return probe;
    }
    if (name == "index") { for (size_t k = 0; k < b->t->args.size(); ++k) if (actual(*b) == b->t->args[k]->text) return MkInt((int64_t)k, IK_BIG); return MkInt(0, IK_BIG); }
  }
  if (h == "atm") {
    if (name == "load") { Value r = *b; r.t = b->t->args[0]; return r; }
    if (name == "store") { need(1); const Type* t = b->t; *b = Convert(a[0], t->args[0]); b->t = t; return VVoid(); }
    if (name == "fetch_add") { need(1); Value old = *b; old.t = b->t->args[0]; const Type* t = b->t; *b = Convert(I.Binary("+", old, a[0]), t->args[0]); b->t = t; return old; }
  }
  if (b->k == K::Gen) {
    auto* g = static_cast<GenObj*>(b->h.get());
    if (name == "next") { if (g->items.empty()) return VNil(); Value v = g->items.front(); g->items.erase(g->items.begin()); return v; }
  }
  found = false;
  return VVoid();
}

// ------------------------------------------------------------------ heaps
bool Interp::LessWith(const Value& fn, const Value& a, const Value& b) { return Truth(CallValue(fn, {a, b})); }
void Interp::HeapFix(Value& heap) {
  auto* c = static_cast<Coll*>(heap.h.get());
  bool minHeap = heap.t && heap.t->head == "mhp";
  std::stable_sort(c->items.begin(), c->items.end(), [&](const Value& x, const Value& y) {
    int r = Compare(x, y);
    return minHeap ? r < 0 : r > 0;
  });
}
void Interp::HeapPush(Value& heap, const Value& v) {
  static_cast<Coll*>(heap.h.get())->items.push_back(v);
  HeapFix(heap);
}

// ------------------------------------------------------------------ roots that change a place
void Interp::AddTo(Value* place, const Value&, const Expr* whatExpr) {
  Value* p = place;
  if (p->k == K::Ptr && p->ik == PK_REF) p = p->tgt;
  std::string h = p->t ? p->t->head : "";
  if (p->k == K::Json) {
    auto* j = static_cast<JsonObj*>(p->h.get());
    Value v = Eval(whatExpr);
    if (j->jk == JsonObj::Null) j->jk = JsonObj::Arr;
    if (j->jk != JsonObj::Arr) ThrowStd("cannot use push_back() with " + JsonTypeName(*j));
    j->a.push_back(ToJson(v));
    return;
  }
  if (p->k == K::Coll) {
    auto* c = static_cast<Coll*>(p->h.get());
    if (h == "map" || h == "hsh") {
      std::vector<Value> kv = EvalArgs(whatExpr);
      if (kv.size() != 2) Bad("To add to a map, give a key and a value: ages add \"Ada\"&36.");
      Value key = Convert(kv[0], p->t->args[0]);
      if (!c->m.count(key) && h == "hsh") c->order.push_back(key);
      c->m[key] = Convert(kv[1], p->t->args[1]);
      return;
    }
    if (h == "arr") Bad("An array's size never changes. Use a vec to add to it.");
    Value v = Eval(whatExpr);
    v = Plain(v);
    const Type* et = p->t && !p->t->args.empty() ? p->t->args[0] : nullptr;
    Value item = (whatExpr->k == E::Name || whatExpr->k == E::At) ? DeepCopy(v) : v;
    item = Convert(item, et);
    if (et && !item.t) item.t = et;
    if (h == "set" || h == "bag") { if (!c->m.count(item)) { c->m[item] = VVoid(); if (h == "bag") c->order.push_back(item); } return; }
    if (h == "chn" && c->closed) Bad("That channel is closed, so nothing more can be sent.");
    c->items.push_back(item);
    if (h == "hep" || h == "mhp") HeapFix(*p);
    return;
  }
  Value v = Eval(whatExpr);
  v = Plain(v);
  if (p->k == K::Str) {
    if (v.k == K::Str) p->s += v.s;
    else if (v.k == K::Chr) p->s += (char)v.i;
    else Bad("It is text, and C++ would quietly add " + ExprText(whatExpr) + " as a letter's code. Turn it into text first: txt&x.");
    return;
  }
  MathRoot("add", p, v);
}

void Interp::MathRoot(const std::string& r, Value* place, const Value& v0) {
  Value* p = place;
  if (p->k == K::Ptr && p->ik == PK_REF) p = p->tgt;
  Value v = Plain(v0);
  const Type* t = p->t;
  if (p->k == K::Obj) {
    std::string op = r == "add" ? "+" : r == "asb" ? "-" : r == "aml" ? "*" : r == "adv" ? "/" : r == "amd" ? "%" : "";
    Obj* o = static_cast<Obj*>(p->h.get());
    if (FuncInfo* f = o->cls->findOp(op + "=")) { std::vector<Value> a{v}; CallFunc(f, {}, &a, p, nullptr); return; }
    if (FuncInfo* f = o->cls->findOp(op)) { std::vector<Value> a{v}; Value res = CallFunc(f, {}, &a, p, nullptr); Assign(p, res); return; }
    Bad(o->cls->name + " has no " + op + ". Give it one with dop.");
  }
  if (t && t->head == "atm") {
    Value cur = *p; cur.t = t->args[0];
    MathRoot(r, &cur, v);
    *p = cur; p->t = t;
    return;
  }
  if (!(IsNumK(*p) || p->k == K::Hug || p->k == K::Cpx)) Bad("It is " + KindWords(*p) + ", and this root works on numbers.");
  if (!(IsNumK(v) || v.k == K::Hug || v.k == K::Cpx)) Bad(Show(v) + " is " + KindWords(v) + ", and this root works on numbers.");
  if (p->k == K::Int && v.k == K::Dbl && (r == "asb" || r == "aml" || r == "adv"))
    Bad("It is a whole number, so " + Show(v) + " would lose what is after its point. Make it a decimal from the start.");
  if ((r == "adv" || r == "amd") && ((v.k == K::Int && v.i == 0) || (v.k == K::Dbl && v.d == 0 && r == "amd" && p->k == K::Int)))
    Bad("I can't divide by zero. Use a number that isn't zero.");
  Value res;
  if (r == "add") res = Binary("+", *p, v);
  else if (r == "asb") res = Binary("-", *p, v);
  else if (r == "aml") res = Binary("*", *p, v);
  else if (r == "adv") res = Binary("/", *p, v);
  else if (r == "amd") {
    if (p->k == K::Dbl || v.k == K::Dbl) res = MkDbl(std::fmod(AsD(*p), AsD(v)));
    else res = Binary("%", *p, v);
  } else if (r == "apw") {
    if (p->k == K::Hug) {
      std::shared_ptr<HugObj> keep; const HugObj& base = AsHug(*p, keep);
      auto acc = HugFromInt(1); int64_t n = ToInt(v);
      for (int64_t k = 0; k < n; ++k) acc = HugMul(*acc, base);
      res = VHug(acc);
    } else res = MkDbl(std::pow(AsD(*p), AsD(v)));
  } else {
    if (p->k == K::Dbl || v.k == K::Dbl) Bad("Bits only work on whole numbers.");
    int64_t x = p->i, y = v.i;
    uint8_t ik = p->ik;
    int64_t out = 0;
    if (r == "and") out = x & y;
    else if (r == "aor") out = x | y;
    else if (r == "axr") out = x ^ y;
    else if (r == "asl") out = (int64_t)((uint64_t)x << (y & 63));
    else if (r == "asr") out = (ik == IK_POS || ik == IK_PBG || ik == IK_BYT) ? (int64_t)((ik == IK_POS ? (uint64_t)(uint32_t)x : (uint64_t)x) >> (y & 63)) : (x >> (y & 63));
    else if (r == "ant") out = ~y;
    res = VInt(out, ik);
  }
  Assign(p, res);
}

static int CmpForSort(const Value& a, const Value& b) { return Compare(a, b); }

void Interp::ListRoot(const std::string& r, Value* place, const Expr* whatExpr) {
  Value* p = place;
  if (p->k == K::Ptr && p->ik == PK_REF) p = p->tgt;
  if (p->k == K::Str) {
    if (r == "lrv") { std::reverse(p->s.begin(), p->s.end()); return; }
    if (r == "lso") { std::sort(p->s.begin(), p->s.end()); return; }
    if (r == "lwp") { p->s.clear(); return; }
    if (r == "lpl") { if (p->s.empty()) Bad("It is empty, so there is nothing to take off."); p->s.pop_back(); return; }
    if (r == "ldx") { int64_t k = ToInt(Eval(whatExpr)); if (k < 0 || (size_t)k >= p->s.size()) OutOfRange("it", k, p->s.size()); p->s.erase(k, 1); return; }
    if (r == "lin") { auto a = EvalArgs(whatExpr); int64_t k = ToInt(a[0]); p->s.insert((size_t)k, ToText(a[1])); return; }
    Bad(r + " changes a collection, and this is a text.");
  }
  if (p->k != K::Coll) Bad(r + " changes a collection, but this is " + KindWords(*p) + ".");
  auto* c = static_cast<Coll*>(p->h.get());
  std::string h = p->t ? p->t->head : "vec";
  const Type* et = p->t && !p->t->args.empty() ? p->t->args[0] : nullptr;
  bool keyed = h == "map" || h == "hsh" || h == "set" || h == "bag";
  if (r == "lwp") { for (auto& x : c->items) Destroy(x); c->items.clear(); c->m.clear(); c->order.clear(); return; }
  if (r == "lrm") {
    Value v = Eval(whatExpr);
    if (keyed) {
      Value key = Convert(v, p->t->args[0]);
      if (c->m.erase(key)) c->order.erase(std::remove_if(c->order.begin(), c->order.end(), [&](const Value& x) { return Equal(x, key); }), c->order.end());
      return;
    }
    c->items.erase(std::remove_if(c->items.begin(), c->items.end(), [&](const Value& x) { return Equal(x, v); }), c->items.end());
    return;
  }
  if (keyed) Bad(r + " works on lists, and this is " + KindWords(*p) + ".");
  if (h == "arr" && (r == "lpl" || r == "lpf" || r == "lin" || r == "ldx" || r == "lrs")) Bad("An array's size never changes. Use a vec.");
  if (r == "lpl") {
    if (c->items.empty()) Bad("It is empty, so there is nothing to take off.");
    if (h == "que") c->items.erase(c->items.begin());
    else if (h == "hep" || h == "mhp") { c->items.erase(c->items.begin()); }
    else { Destroy(c->items.back()); c->items.pop_back(); }
    return;
  }
  if (r == "lpf") {
    if (c->items.empty()) Bad("It is empty, so there is nothing to take off.");
    c->items.erase(c->items.begin());
    return;
  }
  if (r == "ldx") {
    int64_t k = ToInt(Eval(whatExpr));
    if (k < 0 || (size_t)k >= c->items.size()) OutOfRange("it", k, c->items.size());
    c->items.erase(c->items.begin() + k);
    return;
  }
  if (r == "lin") {
    auto a = EvalArgs(whatExpr);
    if (a.size() != 2) Bad("lin takes a place and a value: scores lin 0&99.");
    int64_t k = ToInt(a[0]);
    if (k < 0 || (size_t)k > c->items.size()) OutOfRange("it", k, c->items.size());
    c->items.insert(c->items.begin() + k, Convert(a[1], et));
    return;
  }
  auto sortWith = [&](bool stable) {
    Value fn;
    if (whatExpr && whatExpr->k != E::Now) fn = Eval(whatExpr);
    auto less = [&](const Value& x, const Value& y) {
      if (fn.k == K::Func || fn.k == K::Obj) return LessWith(fn, x, y);
      if (x.k == K::Obj) return Truth(Binary("<", x, y));
      return CmpForSort(x, y) < 0;
    };
    if (stable) std::stable_sort(c->items.begin(), c->items.end(), less);
    else std::sort(c->items.begin(), c->items.end(), less);
  };
  if (r == "lso") { sortWith(false); return; }
  if (r == "lss") { sortWith(true); return; }
  if (r == "lrv") { std::reverse(c->items.begin(), c->items.end()); return; }
  if (r == "lsu") {
    for (size_t k = c->items.size(); k > 1; --k) { size_t j = (size_t)RandomInt(0, (int64_t)k - 1); std::swap(c->items[k - 1], c->items[j]); }
    return;
  }
  if (r == "lfl") { Value v = Eval(whatExpr); for (auto& x : c->items) x = Convert(v, et); return; }
  if (r == "luq") {
    std::sort(c->items.begin(), c->items.end(), [](const Value& x, const Value& y) { return Compare(x, y) < 0; });
    c->items.erase(std::unique(c->items.begin(), c->items.end(), [](const Value& x, const Value& y) { return Equal(x, y); }), c->items.end());
    return;
  }
  if (r == "lrs") {
    int64_t n = ToInt(Eval(whatExpr));
    if (n < 0) Bad("A size can't be below zero.");
    while ((int64_t)c->items.size() > n) { Destroy(c->items.back()); c->items.pop_back(); }
    while ((int64_t)c->items.size() < n) c->items.push_back(DefaultOf(et));
    return;
  }
  if (r == "lrw") {
    int64_t n = ToInt(Eval(whatExpr));
    if (!c->items.empty()) {
      int64_t s = (int64_t)c->items.size();
      n = ((n % s) + s) % s;
      std::rotate(c->items.begin(), c->items.begin() + n, c->items.end());
    }
    return;
  }
  Bad("internal: list root " + r);
}

// ------------------------------------------------------------------ random (the same numbers each run once seeded)
int64_t Interp::RandomInt(int64_t a, int64_t b) {
  if (!seeded) { rng = 0x853c49e6748fea9bULL; seeded = true; }
  rng = rng * 6364136223846793005ULL + 1442695040888963407ULL;
  uint64_t x = rng >> 33;
  if (b < a) std::swap(a, b);
  return a + (int64_t)(x % (uint64_t)(b - a + 1));
}
double Interp::RandomDec(double a, double b) {
  if (!seeded) { rng = 0x853c49e6748fea9bULL; seeded = true; }
  rng = rng * 6364136223846793005ULL + 1442695040888963407ULL;
  double u = (double)(rng >> 11) / 9007199254740992.0;
  return a + (b - a) * u;
}

}  // namespace epp

namespace epp {
// objects compare with their own < and == (dop), or field by field when they have none (C++20 default)
int Interp::CompareObjects(const Value& a, const Value& b) {
  Obj* o = static_cast<Obj*>(a.h.get());
  if (FuncInfo* lt = o->cls->findOp("<")) {
    Value x = a, y = b;
    std::vector<Value> args{y};
    if (Truth(CallFunc(lt, {}, &args, &x, nullptr))) return -1;
    std::vector<Value> args2{x};
    if (Truth(CallFunc(lt, {}, &args2, &y, nullptr))) return 1;
    return 0;
  }
  if (b.k != K::Obj) Bad(o->cls->name + " can't be compared with " + KindWords(b) + ".");
  Obj* p = static_cast<Obj*>(b.h.get());
  for (size_t k = 0; k < o->f.size() && k < p->f.size(); ++k) { int c = Compare(o->f[k], p->f[k]); if (c) return c; }
  return 0;
}
bool Interp::EqualObjects(const Value& a, const Value& b) {
  Obj* o = static_cast<Obj*>(a.h.get());
  if (FuncInfo* eq = o->cls->findOp("==")) { Value x = a; std::vector<Value> args{b}; return Truth(CallFunc(eq, {}, &args, &x, nullptr)); }
  if (a.h == b.h) return true;
  Obj* p = static_cast<Obj*>(b.h.get());
  if (o->cls != p->cls) return false;
  for (size_t k = 0; k < o->f.size(); ++k) if (!Equal(o->f[k], p->f[k])) return false;
  return true;
}
}  // namespace epp
