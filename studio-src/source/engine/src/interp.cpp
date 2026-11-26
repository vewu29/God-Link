// interp.cpp — runs English++ lines. No C++ exceptions are thrown or caught here
// (see eh.cpp); problems travel up to the nearest catcher.
#include "eh.h"
#include "debug.h"
#include <cmath>
#include <algorithm>
#include <chrono>
#include <thread>

namespace epp {

Interp* g_interp = nullptr;
Host g_host;
Disk g_disk;

// ------------------------------------------------------------------ root codes
enum R {
  R_CALL = 1, R_IS, R_ADD, R_ASB, R_AML, R_ADV, R_AMD, R_APW, R_AND, R_AOR, R_AXR, R_ASL, R_ASR, R_ANT,
  R_BTR, R_BCH, R_BDO, R_BSW, R_BCS, R_BDF, R_BLK, R_BBL, R_BDR, R_BTS,
  R_DLM, R_DLV, R_DEF, R_DBS, R_ERT, R_EBK, R_ENX, R_ETW, R_EDL, R_EXT, R_EYD,
  R_FLT, R_FLE, R_FGT, R_FGE, R_FNE, R_FEA, R_FPR, R_GET, R_GLN,
  R_HWR, R_HAP, R_HRM, R_HMK, R_HCP, R_HMV, R_HBY,
  R_IEQ, R_INE, R_ILT, R_ILE, R_IGT, R_IGE,
  R_LRM, R_LDX, R_LIN, R_LPL, R_LPF, R_LSO, R_LRV, R_LSU, R_LWP, R_LFL, R_LUQ, R_LRS, R_LSS, R_LRW,
  R_MAK, R_MKN, R_MGL, R_MPT, R_MRF, R_MLO, R_MNW, R_MWN, R_MSH, R_MTD, R_MSY, R_MFI, R_MFO, R_MMV, R_MSV, R_MTL,
  R_PRN, R_PUT, R_RJN, R_RDT, R_RWT, R_RCM, R_RSD,
  R_SEQ, R_SNE, R_SLT, R_SLE, R_SGT, R_SGE,
  R_WEQ, R_WNE, R_WLT, R_WLE, R_WGT, R_WGE, R_WFV, R_WLN,
  R_XIC, R_XLB, R_XIM, R_XUS, R_XPP, R_XGL, R_NOP
};
static int RootCode(const std::string& r) {
  static std::unordered_map<std::string, int> m = {
    {"is",R_IS},{"add",R_ADD},{"asb",R_ASB},{"aml",R_AML},{"adv",R_ADV},{"amd",R_AMD},{"apw",R_APW},{"and",R_AND},{"aor",R_AOR},
    {"axr",R_AXR},{"asl",R_ASL},{"asr",R_ASR},{"ant",R_ANT},{"btr",R_BTR},{"bch",R_BCH},{"bdo",R_BDO},{"bsw",R_BSW},{"bcs",R_BCS},
    {"bdf",R_BDF},{"blk",R_BLK},{"bbl",R_BBL},{"bdr",R_BDR},{"bts",R_BTS},{"dlm",R_DLM},{"dlv",R_DLV},{"dbs",R_DBS},
    {"ert",R_ERT},{"ebk",R_EBK},{"enx",R_ENX},{"etw",R_ETW},{"edl",R_EDL},{"ext",R_EXT},{"eyd",R_EYD},
    {"flt",R_FLT},{"fle",R_FLE},{"fgt",R_FGT},{"fge",R_FGE},{"fne",R_FNE},{"fea",R_FEA},{"fpr",R_FPR},{"get",R_GET},{"gln",R_GLN},
    {"hwr",R_HWR},{"hap",R_HAP},{"hrm",R_HRM},{"hmk",R_HMK},{"hcp",R_HCP},{"hmv",R_HMV},{"hby",R_HBY},
    {"ieq",R_IEQ},{"ine",R_INE},{"ilt",R_ILT},{"ile",R_ILE},{"igt",R_IGT},{"ige",R_IGE},
    {"lrm",R_LRM},{"ldx",R_LDX},{"lin",R_LIN},{"lpl",R_LPL},{"lpf",R_LPF},{"lso",R_LSO},{"lrv",R_LRV},{"lsu",R_LSU},{"lwp",R_LWP},
    {"lfl",R_LFL},{"luq",R_LUQ},{"lrs",R_LRS},{"lss",R_LSS},{"lrw",R_LRW},
    {"mak",R_MAK},{"mkn",R_MKN},{"mgl",R_MGL},{"mpt",R_MPT},{"mrf",R_MRF},{"mlo",R_MLO},{"mnw",R_MNW},{"mwn",R_MWN},{"msh",R_MSH},
    {"mtd",R_MTD},{"msy",R_MSY},{"mfi",R_MFI},{"mfo",R_MFO},{"mmv",R_MMV},{"msv",R_MSV},{"mtl",R_MTL},
    {"prn",R_PRN},{"put",R_PUT},{"rjn",R_RJN},{"rdt",R_RDT},{"rwt",R_RWT},{"rcm",R_RCM},{"rsd",R_RSD},
    {"seq",R_SEQ},{"sne",R_SNE},{"slt",R_SLT},{"sle",R_SLE},{"sgt",R_SGT},{"sge",R_SGE},
    {"weq",R_WEQ},{"wne",R_WNE},{"wlt",R_WLT},{"wle",R_WLE},{"wgt",R_WGT},{"wge",R_WGE},{"wfv",R_WFV},{"wln",R_WLN},
    {"xic",R_XIC},{"xlb",R_XLB},{"xim",R_XIM},{"xus",R_XUS},{"xpp",R_XPP},{"xgl",R_XGL},
    {"ueq",R_NOP},{"une",R_NOP},{"ult",R_NOP},{"ule",R_NOP},{"ugt",R_NOP},{"uge",R_NOP},
    {"oeq",R_NOP},{"one",R_NOP},{"olt",R_NOP},{"ole",R_NOP},{"ogt",R_NOP},{"oge",R_NOP},{"oth",R_NOP},
    {"dtp",R_NOP},{"den",R_NOP},{"dal",R_NOP},{"dgr",R_NOP},{"dpm",R_NOP},{"mgl",R_MGL}};
  auto it = m.find(r);
  if (it != m.end()) return it->second;
  if (IsRoot(r)) return R_DEF;
  return R_CALL;
}
// which comparison a root makes: 0 == ,1 != ,2 < ,3 <= ,4 > ,5 >=
static int CmpOf(const std::string& r) {
  std::string t = r.substr(1);
  if (t == "eq") return 0; if (t == "ne") return 1; if (t == "lt") return 2;
  if (t == "le") return 3; if (t == "gt") return 4; if (t == "ge") return 5;
  return -1;
}
static const char* CmpWord(int c) { static const char* w[] = {"==","!=","<","<=",">",">="}; return w[c]; }

// ------------------------------------------------------------------ helpers
static Value Deref(const Value& v) {
  if (v.k == K::Ptr) return *v.tgt;
  return v;
}
static Value* DerefP(Value* p) {
  while (p && p->k == K::Ptr) p = p->tgt;
  return p;
}
static Obj* ObjOf(Value* p) { p = DerefP(p); return p && p->k == K::Obj ? static_cast<Obj*>(p->h.get()) : nullptr; }
static Coll* CollOf(Value* p) { return p && p->k == K::Coll ? static_cast<Coll*>(p->h.get()) : nullptr; }
static std::string HeadOf(const Value& v) { return v.t ? v.t->head : (v.k == K::Coll ? "vec" : ""); }
static bool IsListHead(const std::string& h) {
  return h == "vec" || h == "lst" || h == "dqu" || h == "arr" || h == "stk" || h == "que" || h == "hep" || h == "mhp" || h == "chn" || h.empty();
}
static bool IsMapHead(const std::string& h) { return h == "map" || h == "hsh"; }
static bool IsSetHead(const std::string& h) { return h == "set" || h == "bag"; }

static std::map<ClassInfo*, const Type*> g_classType;
static const Type* TypeOfClass(ClassInfo* c) {
  auto it = g_classType.find(c);
  if (it != g_classType.end()) return it->second;
  std::string saved = g_prog->curGroup;
  g_prog->curGroup = c->group;
  const Type* t = ParseType(c->name);
  g_prog->curGroup = saved;
  g_classType[c] = t;
  return t;
}
// the kind a new name gets from its first value
const Type* TypeFor(const Value& v) {
  if (v.t && v.t != TY_ANY && v.t->head != "atm" && !v.t->param) {
    if (v.t->head == "opt" || v.t->head == "alt") {} else return v.t;
  }
  switch (v.k) {
    case K::Int:
      switch (v.ik) { case IK_BIG: return TY_BIG; case IK_PBG: return TY_PBG; case IK_BYT: return TY_BYT;
        case IK_SML: return ParseType("sml"); case IK_POS: return ParseType("pos"); default: return TY_NUM; }
    case K::Dbl: return v.ik ? TY_FLO : TY_DEC;
    case K::Str: return TY_TXT;
    case K::Chr: return TY_LTR;
    case K::Bool: return TY_YNO;
    case K::Hug: return TY_HUG;
    case K::Cpx: return TY_CPX;
    case K::Json: return TY_JSN;
    case K::Obj: return TypeOfClass(static_cast<Obj*>(v.h.get())->cls);
    case K::Exn: return TY_EXN;
    default: return v.t;
  }
}
static bool IsTempExpr(const Expr* e) { return !(e->k == E::Name || e->k == E::At || e->k == E::Deref); }

Interp::Interp() { g_interp = this; }

void Interp::Out(const std::string& s) {
  outBuf += s;
  if (outBuf.size() > 4096) Flush();
}
void Interp::Err(const std::string& s) { Flush(); if (g_host.err) g_host.err(s); }
void Interp::Flush() { if (!outBuf.empty()) { if (g_host.out) g_host.out(outBuf); outBuf.clear(); } }

void Interp::Tick() {
  if ((++steps & 1023) == 0) {
    if (g_host.stopRequested && g_host.stopRequested()) { Flush(); ThrowStop(); }
    if (g_host.yield) { g_host.yield(); }
  }
}

// ------------------------------------------------------------------ names
Value* Interp::LookupOrNull(int id) {
  Frame& f = frames.back();
  for (size_t k = stack.size(); k > f.base; --k) {
    Slot& s = stack[k - 1];
    if (s.id == id) return s.p;
  }
  if (f.closure) {
    if (f.closure->copies) for (auto& c : *f.closure->copies) if (c.first == id) return &c.second;
    for (size_t k = f.closure->refs.size(); k > 0; --k) if (f.closure->refs[k - 1].first == id) return f.closure->refs[k - 1].second;
  }
  if (f.self) {
    Value* sv = DerefP(f.self);
    if (sv && sv->k == K::Obj) {
      Obj* o = static_cast<Obj*>(sv->h.get());
      auto it = o->cls->fieldIndex.find(id);
      if (it != o->cls->fieldIndex.end()) return &o->f[it->second];
      if (Value* st = o->cls->findStatic(id)) return st;
    }
  }
  if (f.fn && f.fn->cls && f.fn->isStatic) {
    if (Value* st = f.fn->cls->findStatic(id)) return st;
  }
  auto g = globalIndex.find(id);
  if (g != globalIndex.end()) return g->second->p;
  return nullptr;
}
Value* Interp::Lookup(int id) {
  Value* p = LookupOrNull(id);
  if (!p) Bad("I don't know " + NameOf(id) + " yet. Make it first, like " + NameOf(id) + " is 0.");
  return p;
}
Value* Interp::Declare(int id, const Value& v) {
  stack.push_back(Slot{id, v, nullptr});
  Slot& s = stack.back();
  s.p = &s.v;
  return s.p;
}
Value* Interp::DeclareAlias(int id, Value* target) {
  stack.push_back(Slot{id, Value(), target});
  return target;
}
void Interp::PopTo(size_t mark) {
  while (stack.size() > mark) {
    Slot& s = stack.back();
    if (s.p == &s.v) Destroy(s.v);
    stack.pop_back();
  }
}

static void DtorChain(Interp& I, Value* self, ClassInfo* c) {
  if (c->dtor) I.CallFunc(c->dtor, {}, nullptr, self, nullptr);
  Obj* o = static_cast<Obj*>(self->h.get());
  for (size_t k = c->own.size(); k > 0; --k) {
    auto it = c->fieldIndex.find(c->own[k - 1].id);
    if (it != c->fieldIndex.end()) I.Destroy(o->f[it->second]);
  }
  for (size_t k = c->parents.size(); k > 0; --k) DtorChain(I, self, c->parents[k - 1]);
}
void Interp::Destroy(Value& v) {
  switch (v.k) {
    case K::Obj: {
      Obj* o = static_cast<Obj*>(v.h.get());
      if (o->destroyed || !o->cls->hasDtorDeep()) return;
      if (v.h.use_count() > 1) return;   // another place still holds this same thing
      o->destroyed = true;
      Value keep = v;
      DtorChain(*this, &keep, o->cls);
      return;
    }
    case K::Ptr: {
      if ((v.ik == PK_OWN || v.ik == PK_SHR) && v.h && v.h.use_count() == 1) {
        auto* b = static_cast<BoxObj*>(v.h.get());
        if (!b->dead) { b->dead = true; Destroy(b->v); }
      }
      return;
    }
    case K::Coll: {
      if (v.h.use_count() > 1) return;
      const Type* et = v.t && !v.t->args.empty() ? v.t->args.back() : nullptr;
      if (et && !et->cls && et->head != "own" && et->head != "shr" && !IsCollectionHead(et->head)) return;
      auto* c = static_cast<Coll*>(v.h.get());
      for (size_t k = c->items.size(); k > 0; --k) Destroy(c->items[k - 1]);
      return;
    }
    default: return;
  }
}

// ------------------------------------------------------------------ running
static std::vector<std::vector<std::vector<Stmt*>>*> g_deferStack;

Flow Interp::ExecBlock(const std::vector<Stmt*>& body, bool scope) {
  size_t mark = stack.size();
  std::vector<std::vector<Stmt*>> defers;
  g_deferStack.push_back(&defers);
  Flow fl = F_NORMAL;
  for (Stmt* s : body) {
    fl = Exec(s);
    if (fl != F_NORMAL) break;
  }
  g_deferStack.pop_back();
  for (size_t k = defers.size(); k > 0; --k) {
    Flow d = ExecBlock(defers[k - 1]);
    (void)d;
  }
  if (scope) PopTo(mark);
  return fl;
}

bool Interp::Truth(const Value& v0) {
  const Value& v = v0.k == K::Ptr && v0.ik == PK_REF ? *v0.tgt : v0;
  switch (v.k) {
    case K::Bool: case K::Int: case K::Chr: return v.i != 0;
    case K::Dbl: return v.d != 0;
    case K::Ptr: return true;
    case K::Nil: return false;
    case K::Json: { auto* j = static_cast<JsonObj*>(v.h.get()); return j->jk == JsonObj::Bool ? j->b : j->jk != JsonObj::Null; }
    default: Bad("This needs a yes or no, but it is " + KindWords(v) + ".");
  }
}

static bool CompareRoot(Interp& I, int c, const Value& a, const Value& b) {
  switch (c) {
    case 0: return Equal(a, b);
    case 1: return !Equal(a, b);
    default: break;
  }
  if (a.k == K::Obj || b.k == K::Obj) {
    std::string op = CmpWord(c);
    Value r = I.Binary(op, a, b);
    return I.Truth(r);
  }
  if (a.k == K::Nil || b.k == K::Nil) Bad("nil can only be compared with == or !=.");
  int x = Compare(a, b);
  switch (c) { case 2: return x < 0; case 3: return x <= 0; case 4: return x > 0; default: return x >= 0; }
}

static Value EvalWho(Interp& I, Stmt* s) {
  if (!s->w) {
    if (s->who == "now") return VVoid();
    return *I.Lookup(NameId(s->who));
  }
  return I.Eval(s->w.get());
}
static bool CondOf(Interp& I, Stmt* s) {
  int c = CmpOf(s->root);
  Value a = EvalWho(I, s);
  Value b = s->x ? I.Eval(s->x.get()) : VVoid();
  return CompareRoot(I, c, a, b);
}

void Interp::Assign(Value* place, const Value& v) {
  if (place->k == K::Native && place->ik == 1) {   // a field of a library struct
    auto* view = static_cast<NativeObj*>(place->h.get());
    (void)view;
    NativeStore(*place, place->s, v);
    return;
  }
  const Type* t = place->t;
  if (t && t->head == "own" && place->k == K::Ptr && v.k == K::Ptr && place->h != v.h) {
    Value old = *place;
    *place = Convert(v, t);
    Destroy(old);
    return;
  }
  if (t && t->head == "jsn" && place->k == K::Json) { *place = ToJson(v); place->t = t; return; }
  if (t && (t->head == "opt" || t->head == "alt" || t->head == "any")) { *place = Convert(v, t); return; }
  if (!t) { *place = (v.k == K::Ptr && v.ik == PK_REF) ? DeepCopy(*v.tgt) : DeepCopy(v); if (!place->t) place->t = TypeFor(*place); return; }
  if (t->param) { *place = DeepCopy(v); return; }
  *place = Convert(v, t);
}

static Value OwnValue(const Expr* e, Value v) {
  if (v.k == K::Ptr && v.ik == PK_REF) return DeepCopy(*v.tgt);
  if (IsTempExpr(e)) return v;
  return DeepCopy(v);
}

// prints one value or several (out prn a&b prints them with spaces)
void Interp::Print(Stmt* s, bool line) {
  std::string text;
  if (s->x) {
    if (s->x->k == E::List) {
      bool first = true;
      for (auto& k : s->x->kids) { if (!first) text += ' '; first = false; text += Show(Eval(k.get())); }
    } else {
      Value v = Eval(s->x.get());
      if (v.k == K::Void) Bad("That gives back nothing, so there is nothing to print.");
      text = Show(v);
    }
  }
  if (line) text += '\n';
  if (s->who == "out") { Out(text); return; }
  if (s->who == "err") { Err(text); return; }
  Value* p = s->w ? LValue(s->w.get()) : nullptr;
  if (!p) p = Lookup(NameId(s->who));
  p = DerefP(p);
  if (p->k != K::Stream) Bad(s->who + " isn't the screen or a file, so it can't " + s->root + ". Print to the screen with out prn x.");
  auto* st = static_cast<StreamObj*>(p->h.get());
  if (!st->out || !st->open) Bad(s->who + " isn't open for writing.");
  g_disk.files[st->path] += text;
}

// ------------------------------------------------------------------ statements
// v4: the rare per-line work (the 1-in-1024 Tick, the debugger) lives out of line, so Exec keeps v3's one test per line
__attribute__((noinline)) static void ExecSlowPath(Interp& I, Stmt* s) {
  if ((I.steps & 1023) == 0) I.Tick();
  if (g_dbg.on) DebugAt(I, s);
}
Flow Interp::Exec(Stmt* s) {
  g_line = s->line; g_file = s->file;
  if (__builtin_expect(((++steps & 1023) == 0) | g_dbg.on, 0)) ExecSlowPath(*this, s);
  if (s->rootId == 0) s->rootId = RootCode(s->root);
  switch (s->rootId) {
    case -1:
    case R_CALL: return ExecCallStmt(s);
    case R_NOP: case R_DEF: case R_BTS: case R_XLB: case R_XUS: case R_XIM: case R_DBS: return F_NORMAL;

    case R_IS: {
      if (!s->names.empty()) {
        Value v = Eval(s->x.get());
        std::vector<Value> parts;
        Value d = Deref(v);
        if (d.k == K::Tup) parts = static_cast<TupObj*>(d.h.get())->items;
        else if (d.k == K::Coll) parts = static_cast<Coll*>(d.h.get())->items;
        else if (s->x->k == E::List) { for (auto& k : s->x->kids) parts.push_back(Eval(k.get())); }
        else Bad("There are " + std::to_string(s->names.size()) + " names, but one value to give them. Each name needs one value.");
        if (parts.size() != s->names.size())
          Bad("There are " + std::to_string(s->names.size()) + " names, and " + std::to_string(parts.size()) + (parts.size() == 1 ? " value" : " values") + " to give them. Each name needs one value.");
        for (size_t k = 0; k < parts.size(); ++k) {
          Value* p = LookupOrNull(s->nameIds[k]);
          if (p) Assign(p, parts[k]);
          else { Value nv = DeepCopy(parts[k]); nv.t = TypeFor(nv); Declare(s->nameIds[k], nv); }
        }
        return F_NORMAL;
      }
      Expr* w = s->w.get();
      if (w->k == E::Name) {
        Value* p = LookupOrNull(w->id);
        Value v = Eval(s->x.get());
        if (v.k == K::Void) Bad("That gives back nothing, so there is nothing to put in " + s->who + ".");
        if (p) { Assign(p, OwnValue(s->x.get(), v)); return F_NORMAL; }
        if (IsValueWord(s->who)) Bad(s->who + " is a Chart word, so it can't be a name. Pick another name.");
        Value nv = OwnValue(s->x.get(), v);
        if (nv.k == K::Nil && !nv.t) Bad("nil doesn't say what kind " + s->who + " is. Say so first: " + s->who + " mak ptr@num.");
        if (nv.k == K::Ptr && nv.ik == PK_REF) nv = DeepCopy(*nv.tgt);
        nv.t = TypeFor(nv);
        Declare(w->id, nv);
        return F_NORMAL;
      }
      Value v = Eval(s->x.get());
      // a field of a library struct: cam@fovy is 60.0
      if (w->k == E::At && !w->s.empty()) {
        std::string path = w->s;
        const Expr* x = w->kids[0].get();
        for (;;) {
          Value* base = (x->k == E::Name || x->k == E::At || x->k == E::Deref) ? LValue(x) : nullptr;
          if (base) { Value* b = DerefP(base); if (b && b->k == K::Native) { NativeStore(*b, path, v); return F_NORMAL; } break; }
          if (x->k != E::At || x->s.empty()) break;
          path = x->s + "." + path;
          x = x->kids[0].get();
        }
      }
      Value* p = LValue(w, true);
      if (!p) Bad("I can't change " + s->who + ". Only a name, a place inside something (like v@0 or rex@age), or *p can be changed.");
      Assign(p, OwnValue(s->x.get(), v));
      return F_NORMAL;
    }

    case R_MAK: case R_MKN: {
      Value v;
      if (s->kind) v = DefaultOf(s->kind);
      else if (s->x) {
        Value r = Eval(s->x.get());
        v = OwnValue(s->x.get(), r);
        if (!v.t || v.t == TY_ANY) v.t = TypeFor(v);
      } else Bad("mak needs a kind: " + s->who + " mak num.");
      if (s->kind && s->kind->head == "chn") v.t = s->kind;
      Declare(s->whoId, v);
      return F_NORMAL;
    }
    case R_MGL: case R_MTL: return F_NORMAL;   // made before main starts

    case R_MPT: {
      Value* target = LValue(s->x.get());
      if (!target) Bad("mpt points at a name: p mpt x. " + s->what + " isn't a name you made.");
      Value pv; pv.k = K::Ptr; pv.ik = PK_RAW; pv.tgt = DerefP(target) && target->k == K::Ptr ? target : target;
      pv.tgt = target;
      Value* existing = LookupOrNull(s->whoId);
      if (existing) {
        const Type* t = existing->t;
        *existing = pv; existing->t = t;
      } else {
        pv.t = ParseType("ptr@" + (target->t ? target->t->text : std::string("any")));
        Declare(s->whoId, pv);
      }
      return F_NORMAL;
    }
    case R_MRF: case R_MLO: {
      Value* target = LValue(s->x.get());
      if (!target) Bad(s->root + " gives another name to a place: r " + s->root + " x. " + s->what + " isn't a place.");
      DeclareAlias(s->whoId, target);
      return F_NORMAL;
    }
    case R_MNW: case R_MWN: case R_MSH: {
      Value obj;
      if (s->x && s->x->k == E::Name && TryParseType(s->x->s)) obj = DefaultOf(ParseType(s->x->s));
      else if (s->x && s->x->k == E::Kind) obj = DefaultOf(s->x->type);
      else if (s->x) { obj = OwnValue(s->x.get(), Eval(s->x.get())); if (!obj.t) obj.t = TypeFor(obj); }
      else Bad(s->root + " needs a kind: p " + s->root + " Dog.");
      auto box = std::make_shared<BoxObj>();
      box->v = obj;
      Value pv; pv.k = K::Ptr; pv.ik = s->rootId == R_MNW ? PK_RAW : s->rootId == R_MWN ? PK_OWN : PK_SHR;
      pv.tgt = &box->v; pv.h = box;
      std::string head = s->rootId == R_MNW ? "ptr@" : s->rootId == R_MWN ? "own@" : "shr@";
      const Type* tt = TypeFor(obj);
      pv.t = ParseType(head + (tt ? tt->text : "num"));
      Value* existing = LookupOrNull(s->whoId);
      if (existing) Assign(existing, pv);
      else Declare(s->whoId, pv);
      return F_NORMAL;
    }
    case R_MTD: case R_MSY: {
      // threads run straight away, one at a time: same output as the Studio for the Book's programs
      std::vector<std::pair<Value*, Value>> saved;
      for (Stmt* g : P->globals) if (g->root == "mtl") {
        Value* p = globalIndex[g->whoId]->p;
        saved.push_back({p, *p});
        *p = g->x ? Convert(Eval(g->x.get()), p->t) : DefaultOf(g->kind);
      }
      Value result;
      if (s->x->k == E::Call) result = Eval(s->x.get());
      else { Value f = Eval(s->x.get()); result = CallValue(f, {}); }
      for (auto& sv : saved) *sv.first = sv.second;
      Value h; h.k = K::Handle;
      auto hd = std::make_shared<HandleObj>();
      hd->what = s->rootId == R_MTD ? "thd" : "fut";
      hd->v = result;
      h.h = hd; h.t = ParseType(hd->what == "thd" ? "thd" : "fut@any");
      Value* existing = LookupOrNull(s->whoId);
      if (existing) *existing = h; else Declare(s->whoId, h);
      return F_NORMAL;
    }
    case R_MFI: case R_MFO: {
      Value pathv = Eval(s->x.get());
      std::string path = Show(pathv);
      Value v; v.k = K::Stream;
      auto st = std::make_shared<StreamObj>();
      st->path = path; st->out = s->rootId == R_MFO; st->open = true;
      if (st->out) g_disk.files[path] = "";
      else {
        auto it = g_disk.files.find(path);
        if (it == g_disk.files.end()) st->fail = true; else st->buf = it->second;
      }
      v.h = st; v.t = ParseType(st->out ? "ofs" : "ifs");
      Declare(s->whoId, v);
      return F_NORMAL;
    }
    case R_MMV: {
      Value* src = LValue(s->x.get());
      if (!src) Bad("mmv moves a name's thing into another name: b mmv a.");
      Value v;
      if (src->k == K::Ptr) { v = *src; const Type* t = src->t; *src = VNil(); src->t = t; }
      else if (src->k == K::Coll) { v = *src; Value e = MakeColl(src->t); *src = e; }
      else if (src->k == K::Str) { v = *src; src->s.clear(); }
      else if (src->k == K::Obj) {
        Obj* o = static_cast<Obj*>(src->h.get());
        FuncInfo* mover = nullptr;
        for (FuncInfo* c : o->cls->ctors)
          if (c->params.size() == 1 && c->params[0].take) mover = c;
        if (mover) {
          std::vector<Value> args{*src};
          Value nv = Construct(TypeOfClass(o->cls), {}, nullptr, true);
          std::vector<const Expr*> ex{s->x.get()};
          RunCtor(&nv, o->cls, args, &ex);
          v = nv;
        } else v = DeepCopy(*src);
      } else v = DeepCopy(*src);
      if (!v.t) v.t = TypeFor(v);
      Declare(s->whoId, v);
      return F_NORMAL;
    }
    case R_MSV: {
      Frame& f = frames.back();
      FuncInfo* fn = f.fn;
      if (!fn) Bad("msv keeps a value between calls, so it goes inside a function.");
      for (auto& st : fn->statics) if (st.first == s->whoId) { DeclareAlias(s->whoId, &st.second); return F_NORMAL; }
      Value v = OwnValue(s->x.get(), Eval(s->x.get()));
      v.t = TypeFor(v);
      fn->statics.push_back({s->whoId, v});
      // a vector of pairs can move when it grows: keep each static in its own box instead
      auto& st = fn->statics.back();
      DeclareAlias(s->whoId, &st.second);
      return F_NORMAL;
    }

    case R_PRN: Print(s, true); return F_NORMAL;
    case R_PUT: Print(s, false); return F_NORMAL;

    case R_GET: case R_GLN: {
      bool lineMode = s->rootId == R_GLN;
      std::string src = s->what;
      std::string got;
      bool ok = true;
      bool question = src.size() >= 2 && src.front() == '"';
      if (src == "inp" || question) {
        std::string q;
        if (question) { Value qv = s->x ? Eval(s->x.get()) : VStr(""); q = qv.k == K::Str ? qv.s : Show(qv); Out(q); }
        Flush();
        std::string line;
        if (!g_host.readLine || !g_host.readLine(q, line)) ok = false;
        if (ok) {
          if (lineMode) got = line;
          else {
            size_t a = line.find_first_not_of(" \t");
            if (a == std::string::npos) got = ""; else { size_t b = line.find_first_of(" \t", a); got = line.substr(a, b == std::string::npos ? std::string::npos : b - a); }
          }
        }
      } else {
        Value* sp = DerefP(s->x ? LValue(s->x.get()) : nullptr);
        if (!sp || sp->k != K::Stream) Bad(s->what + " isn't a file to read or inp.");
        auto* st = static_cast<StreamObj*>(sp->h.get());
        if (lineMode) {
          if (st->pos >= st->buf.size()) { ok = false; st->fail = true; }
          else { size_t e = st->buf.find('\n', st->pos); if (e == std::string::npos) e = st->buf.size(); got = st->buf.substr(st->pos, e - st->pos); st->pos = e + 1; }
        } else {
          while (st->pos < st->buf.size() && isspace((unsigned char)st->buf[st->pos])) ++st->pos;
          if (st->pos >= st->buf.size()) { ok = false; st->fail = true; }
          else { size_t b = st->pos; while (st->pos < st->buf.size() && !isspace((unsigned char)st->buf[st->pos])) ++st->pos; got = st->buf.substr(b, st->pos - b); }
        }
      }
      Value* target = s->w ? LValue(s->w.get()) : nullptr;
      if (!target && s->whoId >= 0) target = LookupOrNull(s->whoId);
      if (!target) target = Declare(s->whoId >= 0 ? s->whoId : NameId(s->who), [] { Value v = VStr(""); v.t = TY_TXT; return v; }());
      if (!ok) return F_NORMAL;
      if (!lineMode && target->t && IsIntType(target->t)) {
        char* end = nullptr; long long n = strtoll(got.c_str(), &end, 10);
        Assign(target, VInt(n, IK_BIG));
      } else if (!lineMode && target->t && (target->t->head == "dec" || target->t->head == "flo")) {
        Assign(target, VDbl(strtod(got.c_str(), nullptr)));
      } else Assign(target, VStr(got));
      return F_NORMAL;
    }
    case R_WLN: {
      Value* sp = nullptr;
      bool keyboard = s->what == "inp";
      if (!keyboard) { sp = DerefP(s->x ? LValue(s->x.get()) : nullptr); if (!sp || sp->k != K::Stream) Bad(s->what + " isn't a file to read or inp."); }
      for (;;) {
        std::string line;
        if (keyboard) { Flush(); if (!g_host.readLine || !g_host.readLine("", line)) break; }
        else {
          auto* st = static_cast<StreamObj*>(sp->h.get());
          if (st->pos >= st->buf.size()) break;
          size_t e = st->buf.find('\n', st->pos); if (e == std::string::npos) e = st->buf.size();
          line = st->buf.substr(st->pos, e - st->pos); st->pos = e + 1;
        }
        size_t mark = stack.size();
        Value lv = VStr(line); lv.t = TY_TXT;
        Declare(s->whoId, lv);
        Flow f = ExecBlock(s->body);
        PopTo(mark);
        if (f == F_RETURN) return f;
        if (f == F_BREAK) { if (frames.back().breakLabel < 0 || frames.back().breakLabel == s->whoId) { frames.back().breakLabel = -1; break; } return f; }
        if (f == F_CONTINUE) { if (frames.back().breakLabel >= 0 && frames.back().breakLabel != s->whoId) return f; frames.back().breakLabel = -1; }
      }
      return F_NORMAL;
    }
    case R_RJN: case R_RDT: return F_NORMAL;
    case R_RWT: {
      Value v = Eval(s->x.get());
      int ms = (int)ToInt(v);
      Flush();
      if (g_host.sleep) g_host.sleep(ms);
      return F_NORMAL;
    }
    case R_RCM: NotYet("Running a command on the computer (rcm)");
    case R_RSD: { Value v = Eval(s->x.get()); rng = (uint64_t)ToInt(v) * 6364136223846793005ULL + 1442695040888963407ULL; seeded = true; return F_NORMAL; }

    case R_SEQ: case R_SNE: case R_SLT: case R_SLE: case R_SGT: case R_SGE: {
      int c = CmpOf(s->root);
      Value a = EvalWho(*this, s);
      Value b = Eval(s->x.get());
      if (!CompareRoot(*this, c, a, b)) {
        Bad("A check failed: " + s->who + " " + s->root + " " + s->what + " wants " + s->who + " " + CmpWord(c) + " " + s->what +
            ", but " + s->who + " is " + Show(a) + ".");
      }
      return F_NORMAL;
    }

    case R_IEQ: case R_INE: case R_ILT: case R_ILE: case R_IGT: case R_IGE: {
      if (CondOf(*this, s)) return ExecBlock(s->body);
      for (Stmt* o : s->chain) {
        g_line = o->line;
        if (o->root == "oth") return ExecBlock(o->body);
        if (CondOf(*this, o)) return ExecBlock(o->body);
      }
      return F_NORMAL;
    }

    case R_WEQ: case R_WNE: case R_WLT: case R_WLE: case R_WGT: case R_WGE: case R_WFV: {
      bool forever = s->rootId == R_WFV;
      for (;;) {
        g_line = s->line;
        if (!forever && !CondOf(*this, s)) break;
        Tick();
        Flow f = ExecBlock(s->body);
        if (f == F_RETURN) return f;
        if (f == F_BREAK) { if (frames.back().breakLabel < 0) break; return f; }
        if (f == F_CONTINUE) { if (frames.back().breakLabel >= 0) return f; }
      }
      return F_NORMAL;
    }
    case R_BDO: {
      Stmt* u = s->chain[0];
      int c = CmpOf(u->root);
      for (;;) {
        Tick();
        Flow f = ExecBlock(s->body);
        if (f == F_RETURN) return f;
        if (f == F_BREAK) { if (frames.back().breakLabel < 0) break; return f; }
        if (f == F_CONTINUE && frames.back().breakLabel >= 0) return f;
        g_line = u->line;
        Value a = EvalWho(*this, u);
        Value b = Eval(u->x.get());
        if (CompareRoot(*this, c, a, b)) break;   // until
      }
      return F_NORMAL;
    }

    case R_FLT: case R_FLE: case R_FNE: case R_FGT: case R_FGE: {
      bool down = s->rootId == R_FGT || s->rootId == R_FGE;
      size_t mark = stack.size();
      Value* ctr = LookupOrNull(s->whoId);
      if (!ctr) {
        if (down) Bad("Say where " + s->who + " starts first, because it counts down: " + s->who + " is 10.");
        Value z = VInt(0); z.t = TY_NUM;
        ctr = Declare(s->whoId, z);
      }
      if (!(ctr->k == K::Int || ctr->k == K::Dbl)) Bad(s->who + " is " + KindWords(*ctr) + ", so it can't count. A for counts with a number: i " + s->root + " " + s->what + ". To walk through a collection, use fea.");
      int c = s->rootId == R_FLT ? 2 : s->rootId == R_FLE ? 3 : s->rootId == R_FNE ? 1 : s->rootId == R_FGT ? 4 : 5;
      for (;;) {
        g_line = s->line;
        Value lim = Eval(s->x.get());
        if (!(lim.k == K::Int || lim.k == K::Dbl || lim.k == K::Chr))
          Bad("A for counts up to a number, but " + s->what + " is " + KindWords(lim) + ". To walk through a collection, use fea.");
        if (!CompareRoot(*this, c, *ctr, lim)) break;
        Tick();
        Flow f = ExecBlock(s->body);
        if (f == F_RETURN) { PopTo(mark); return f; }
        if (f == F_BREAK) {
          int lb = frames.back().breakLabel;
          if (lb < 0 || lb == s->whoId) { frames.back().breakLabel = -1; break; }
          PopTo(mark); return f;
        }
        if (f == F_CONTINUE) {
          int lb = frames.back().breakLabel;
          if (lb >= 0 && lb != s->whoId) { PopTo(mark); return f; }
          frames.back().breakLabel = -1;
        }
        if (ctr->k == K::Int) ctr->i = NormInt(ctr->i + (down ? -1 : 1), ctr->ik);
        else ctr->d += down ? -1 : 1;
      }
      PopTo(mark);
      return F_NORMAL;
    }
    case R_FEA: case R_FPR: {
      int label = s->names.empty() ? s->whoId : s->nameIds[0];
      Value tmp;
      Value* coll = s->x ? LValue(s->x.get()) : nullptr;
      if (!coll) { tmp = Eval(s->x.get()); coll = &tmp; }
      coll = DerefP(coll);
      auto runBody = [&](const std::vector<std::pair<int, Value*>>& binds, bool& stop) -> Flow {
        size_t mark = stack.size();
        for (auto& b : binds) DeclareAlias(b.first, b.second);
        Tick();
        Flow f = ExecBlock(s->body);
        PopTo(mark);
        stop = false;
        if (f == F_BREAK) { int lb = frames.back().breakLabel; if (lb < 0 || lb == label) { frames.back().breakLabel = -1; stop = true; return F_NORMAL; } stop = true; return f; }
        if (f == F_CONTINUE) { int lb = frames.back().breakLabel; if (lb >= 0 && lb != label) { stop = true; return f; } frames.back().breakLabel = -1; return F_NORMAL; }
        if (f == F_RETURN) { stop = true; return f; }
        return F_NORMAL;
      };
      bool stop = false;
      if (coll->k == K::Str) {
        for (size_t k = 0; k < coll->s.size(); ++k) {
          Value ch = VChr(coll->s[k]); ch.t = TY_LTR;
          Value* cp = &ch;
          Flow f = runBody({{s->whoId, cp}}, stop);
          if (ch.k == K::Chr) coll->s[k] = (char)ch.i;
          if (stop) return f;
        }
        return F_NORMAL;
      }
      if (coll->k == K::Gen) {
        auto* g = static_cast<GenObj*>(coll->h.get());
        for (size_t k = 0; k < g->items.size(); ++k) {
          Value item = g->items[k];
          Flow f = runBody({{s->whoId, &item}}, stop);
          if (stop) return f;
        }
        return F_NORMAL;
      }
      if (coll->k == K::Json) {
        auto* j = static_cast<JsonObj*>(coll->h.get());
        for (size_t k = 0; k < j->a.size(); ++k) { Flow f = runBody({{s->whoId, &j->a[k]}}, stop); if (stop) return f; }
        return F_NORMAL;
      }
      if (coll->k == K::Tup) {
        auto* t = static_cast<TupObj*>(coll->h.get());
        for (size_t k = 0; k < t->items.size(); ++k) { Flow f = runBody({{s->whoId, &t->items[k]}}, stop); if (stop) return f; }
        return F_NORMAL;
      }
      if (coll->k != K::Coll) Bad("fea walks through a collection or a text, but " + s->what + " is " + KindWords(*coll) + ".");
      auto* c = static_cast<Coll*>(coll->h.get());
      std::string h = HeadOf(*coll);
      if (h == "stk" || h == "que" || h == "hep" || h == "mhp") Bad("A stack or a queue can only be read from one end, so it can't be walked through. Use a vec.");
      Value keep = *coll;  // the walk keeps the collection alive
      if (IsMapHead(h)) {
        std::vector<Value> keys;
        if (h == "hsh") keys = c->order; else for (auto& kv : c->m) keys.push_back(kv.first);
        for (auto& key : keys) {
          auto it = c->m.find(key);
          if (it == c->m.end()) continue;
          Value kcopy = key;
          Flow f;
          if (s->names.size() >= 2) f = runBody({{s->nameIds[0], &kcopy}, {s->nameIds[1], &it->second}}, stop);
          else {
            Value pr; pr.k = K::Tup; auto tp = std::make_shared<TupObj>(); tp->items = {kcopy, it->second}; pr.h = tp;
            f = runBody({{s->whoId, &pr}}, stop);
          }
          if (stop) return f;
        }
        return F_NORMAL;
      }
      if (IsSetHead(h)) {
        std::vector<Value> keys;
        if (h == "bag") keys = c->order; else for (auto& kv : c->m) keys.push_back(kv.first);
        for (auto& key : keys) { Value kc = key; Flow f = runBody({{s->whoId, &kc}}, stop); if (stop) return f; }
        return F_NORMAL;
      }
      if (h == "chn") {
        while (!c->items.empty()) {
          Value item = c->items.front();
          c->items.erase(c->items.begin());
          Flow f = runBody({{s->whoId, &item}}, stop);
          if (stop) return f;
        }
        return F_NORMAL;
      }
      for (size_t k = 0; k < c->items.size(); ++k) {
        Value* item = &c->items[k];
        Flow f;
        if (s->names.size() >= 2) {
          Value* iv = DerefP(item);
          std::vector<std::pair<int, Value*>> binds;
          std::vector<Value>* parts = nullptr;
          if (iv->k == K::Tup) parts = &static_cast<TupObj*>(iv->h.get())->items;
          else if (iv->k == K::Coll) parts = &static_cast<Coll*>(iv->h.get())->items;
          if (!parts || parts->size() < s->names.size()) Bad("Each thing in " + s->what + " doesn't have " + std::to_string(s->names.size()) + " parts to give " + s->who + ".");
          for (size_t n = 0; n < s->names.size(); ++n) binds.push_back({s->nameIds[n], &(*parts)[n]});
          f = runBody(binds, stop);
        } else f = runBody({{s->whoId, item}}, stop);
        if (stop) return f;
        if (k >= c->items.size()) break;
      }
      return F_NORMAL;
    }

    case R_BSW: {
      Value subj = EvalWho(*this, s);
      Stmt* def = nullptr;
      for (Stmt* cs : s->body) {
        g_line = cs->line;
        if (cs->root == "bdf") { def = cs; continue; }
        if (cs->root != "bcs") Bad("A bsw block holds bcs and bdf lines only.");
        std::vector<const Expr*> items;
        if (cs->x->k == E::List) for (auto& k : cs->x->kids) items.push_back(k.get());
        else items.push_back(cs->x.get());
        for (const Expr* it : items) {
          Value cv;
          if (it->k == E::Name && subj.k == K::Enum && subj.t && subj.t->en) {
            auto& nm = subj.t->en->names;
            auto f = std::find(nm.begin(), nm.end(), it->s);
            if (f != nm.end()) { cv.k = K::Enum; cv.i = f - nm.begin(); cv.t = subj.t; }
            else cv = Eval(it);
          } else cv = Eval(it);
          if (Equal(subj, cv)) return ExecBlock(cs->body);
        }
      }
      if (def) return ExecBlock(def->body);
      return F_NORMAL;
    }
    case R_BCS: case R_BDF: Bad(s->root + " goes inside a bsw block.");

    case R_BTR: {
      size_t sm = stack.size(), fm = frames.size(), dm = g_deferStack.size();
      Flow fl = F_NORMAL;
      Caught c = Protect([&] { fl = ExecBlock(s->body); });
      if (c.k == CK_NONE) return fl;
      if (c.k != CK_THROWN) Rethrow(c);
      frames.resize(fm);
      g_deferStack.resize(dm);
      PopTo(sm);
      for (Stmt* h : s->chain) {
        g_line = h->line;
        bool match = false;
        if (h->who == "now" && !h->kind) match = true;              // catches anything
        else if (!h->kind) match = c.t.isStd;                      // e bch now: a problem with a message
        else if (h->kind->cls) {
          Value tv = c.t.v;
          match = tv.k == K::Obj && static_cast<Obj*>(tv.h.get())->cls->isA(h->kind->cls);
        } else if (h->kind->head == "exn") match = c.t.isStd;
        if (!match) continue;
        size_t mark = stack.size();
        if (h->who != "now") Declare(NameId(h->who), c.t.v);
        Thrown* saved = new Thrown(c.t);
        caughtStack.push_back(saved);
        Flow hf = ExecBlock(h->body);
        caughtStack.pop_back();
        delete saved;
        PopTo(mark);
        return hf;
      }
      Rethrow(c);
    }
    case R_BCH: return F_NORMAL;
    case R_BLK: case R_BBL: return ExecBlock(s->body);
    case R_BDR: {
      if (g_deferStack.empty()) Bad("bdr goes inside a block.");
      g_deferStack.back()->push_back(s->body);
      return F_NORMAL;
    }

    case R_DLM: case R_DLV: {
      Value fv = MakeFuncValue(s->fn, frames.back().self);
      fv.t = ParseType("fun@any");
      Value* existing = nullptr;
      for (size_t k = stack.size(); k > frames.back().base; --k) if (stack[k - 1].id == s->whoId) { existing = stack[k - 1].p; break; }
      if (existing) *existing = fv; else Declare(s->whoId, fv);
      // a lambda can call itself by its own name
      if (s->rootId == R_DLM) {
        auto* fo = static_cast<FuncObj*>(fv.h.get());
        Value* me = LookupOrNull(s->whoId);
        bool has = false;
        for (auto& r : fo->refs) if (r.first == s->whoId) has = true;
        if (!has) fo->refs.push_back({s->whoId, me});
        static_cast<FuncObj*>(me->h.get())->refs = fo->refs;
      }
      return F_NORMAL;
    }

    case R_ERT: {
      Frame& f = frames.back();
      if (!f.fn) {   // main ert 0
        if (s->who != "main") Bad("ert leaves a function. Up here, you are in main: main ert 0.");
        f.ret = s->x ? Eval(s->x.get()) : VInt(0);
        return F_RETURN;
      }
      if (s->who != f.fn->name) Bad("ert starts with the name of the function it leaves. This one is " + f.fn->name + ": " + f.fn->name + " ert ...");
      if (!s->x) { f.ret = VVoid(); return F_RETURN; }
      if (f.fn->isGen) Bad(f.fn->name + " hands out its values with eyd. To stop, use " + f.fn->name + " ert now.");
      if (f.fn->retRef) {
        Value* p = LValue(s->x.get());
        if (!p && s->x->k == E::Name && s->x->s == "slf") p = f.self;
        if (!p) Bad(f.fn->name + " gives back a place (ref@), so ert needs a name or a place inside something.");
        f.retRef = p;
        return F_RETURN;
      }
      Value v = Eval(s->x.get());
      if (v.k == K::Void) Bad(s->what + " gives back nothing, so " + f.fn->name + " has nothing to give back.");
      v = OwnValue(s->x.get(), v);
      if (f.fn->ret && f.fn->ret->head == "tup" && v.k == K::Coll && s->x->k == E::List) v = Convert(v, f.fn->ret);
      f.ret = f.fn->ret ? Convert(v, f.fn->ret) : v;
      return F_RETURN;
    }
    case R_EBK: case R_ENX: {
      if (s->x) { Value c = Eval(s->x.get()); if (!Truth(c)) return F_NORMAL; }
      frames.back().breakLabel = s->whoId;
      return s->rootId == R_EBK ? F_BREAK : F_CONTINUE;
    }
    case R_ETW: {
      Flush();
      if (!s->x) {
        if (caughtStack.empty()) Bad("now etw now throws the problem again, so it goes inside a bch block.");
        ThrowThrown(*caughtStack.back());
      }
      Value v = Eval(s->x.get());
      Value d = Deref(v);
      if (d.k == K::Str) ThrowStd(d.s);
      if (d.k == K::Exn) ThrowStd(d.s);
      Thrown t; t.v = DeepCopy(d); t.isStd = false;
      ThrowThrown(t);
    }
    case R_EDL: {
      Value* p = LValue(s->x.get());
      if (!p || p->k != K::Ptr) {
        if (p && p->k == K::Nil) return F_NORMAL;
        Bad("edl deletes what a pointer made with mnw points at: now edl p.");
      }
      if (p->h) {
        auto* b = static_cast<BoxObj*>(p->h.get());
        if (!b->dead) { b->dead = true; Destroy(b->v); }
      }
      const Type* t = p->t;
      *p = VNil(); p->t = t;
      return F_NORMAL;
    }
    case R_EXT: {
      int code = s->x ? (int)ToInt(Eval(s->x.get())) : 0;
      Flush();
      ThrowExit(code);
    }
    case R_EYD: {
      Frame& f = frames.back();
      if (!f.gen) Bad("eyd hands out values one at a time, so it goes in a function that gives back gnr@num.");
      Value v = Eval(s->x.get());
      const Type* et = f.fn->ret && !f.fn->ret->args.empty() ? f.fn->ret->args[0] : nullptr;
      f.gen->push_back(Convert(v, et));
      if (f.gen->size() >= f.genCap) ThrowGenFull();
      return F_NORMAL;
    }

    case R_HWR: case R_HAP: case R_HBY: {
      std::string path = Show(EvalWho(*this, s));
      Value v = Eval(s->x.get());
      std::string text;
      if (s->rootId == R_HBY) {
        Value d = Deref(v);
        if (d.k != K::Coll) Bad("hby writes a list of bytes: \"a.bin\" hby bytes.");
        for (auto& b : static_cast<Coll*>(d.h.get())->items) text += (char)(uint8_t)ToInt(b);
      } else text = Show(v);
      size_t sl = path.rfind('/');
      if (sl != std::string::npos && !g_disk.dirs.count(path.substr(0, sl))) ThrowStd("I can't write the file " + path + ": its folder isn't there.");
      if (s->rootId == R_HAP) g_disk.files[path] += text; else g_disk.files[path] = text;
      return F_NORMAL;
    }
    case R_HRM: {
      std::string path = Show(EvalWho(*this, s));
      g_disk.files.erase(path);
      std::string pre = path + "/";
      for (auto it = g_disk.files.begin(); it != g_disk.files.end();) { if (it->first.rfind(pre, 0) == 0) it = g_disk.files.erase(it); else ++it; }
      for (auto it = g_disk.dirs.begin(); it != g_disk.dirs.end();) { if (*it == path || it->rfind(pre, 0) == 0) it = g_disk.dirs.erase(it); else ++it; }
      return F_NORMAL;
    }
    case R_HMK: {
      std::string path = Show(EvalWho(*this, s));
      std::string cur;
      for (size_t k = 0; k <= path.size(); ++k) { if (k == path.size() || path[k] == '/') { if (!cur.empty()) g_disk.dirs.insert(cur); } if (k < path.size()) cur += path[k]; }
      return F_NORMAL;
    }
    case R_HCP: case R_HMV: {
      std::string a = Show(EvalWho(*this, s)), b = Show(Eval(s->x.get()));
      auto it = g_disk.files.find(a);
      if (it == g_disk.files.end()) ThrowStd("filesystem error: cannot " + std::string(s->rootId == R_HCP ? "copy" : "rename") + ": No such file or directory [" + a + "] [" + b + "]");
      std::string data = it->second;
      if (s->rootId == R_HMV) g_disk.files.erase(it);
      g_disk.files[b] = data;
      return F_NORMAL;
    }

    case R_ADD: case R_ASB: case R_AML: case R_ADV: case R_AMD: case R_APW: case R_AND: case R_AOR: case R_AXR: case R_ASL: case R_ASR: case R_ANT: {
      Value* place = s->w ? LValue(s->w.get(), true) : LookupOrNull(NameId(s->who));
      if (!place) {
        if (s->w && s->w->k == E::Name) Lookup(s->w->id);
        Bad("I can't change " + s->who + ". Only a name, or a place inside something, can change.");
      }
      if (s->rootId == R_ADD) { AddTo(place, Value(), s->x.get()); return F_NORMAL; }
      Value v = Eval(s->x.get());
      MathRoot(s->root, place, v);
      return F_NORMAL;
    }
    case R_LRM: case R_LDX: case R_LIN: case R_LPL: case R_LPF: case R_LSO: case R_LRV: case R_LSU: case R_LWP: case R_LFL: case R_LUQ: case R_LRS: case R_LSS: case R_LRW: {
      Value* place = s->w ? LValue(s->w.get()) : nullptr;
      if (!place) { if (s->w && s->w->k == E::Name) Lookup(s->w->id); Bad(s->root + " changes a collection, and " + s->who + " isn't one you made."); }
      ListRoot(s->root, place, s->x.get());
      return F_NORMAL;
    }

    case R_XIC: {
      std::string w = s->what;
      if (w.size() >= 2 && w.front() == '"') w = w.substr(1, w.size() - 2);
      static const std::set<std::string> ok = {"raylib.h","raymath.h","rlgl.h","<vector>","<string>","<iostream>","<map>","<cmath>",
        "<algorithm>","<set>","<memory>","<thread>","<chrono>","<fstream>"};
      if (ok.count(w) || w.rfind("Q", 0) == 0) return F_NORMAL;
      if (!w.empty() && w[0] == '<') return F_NORMAL;
      NotYet("Bringing in your own C++ file (" + w + ")");
    }
    case R_XPP: case R_XGL: NotYet("A line of C++ (" + s->root + ")");
  }
  Bad("internal: root " + s->root + " has no runner.");
}

// who root what, where root is a function, a method, or a library call
Flow Interp::ExecCallStmt(Stmt* s) {
  const std::string& name = s->root;
  std::vector<const Expr*> argEx;
  if (s->x) {
    if (s->x->k == E::List) for (auto& k : s->x->kids) argEx.push_back(k.get());
    else argEx.push_back(s->x.get());
  }
  if (s->who == "now") {
    Frame& f = frames.back();
    if (f.self) {
      Obj* o = ObjOf(f.self);
      if (o) {
        if (FuncInfo* m = o->cls->findMethod(name)) { CallFunc(m, argEx, nullptr, f.self, nullptr); return F_NORMAL; }
      }
    }
    if (Value* v = LookupOrNull(NameId(name))) {
      std::vector<Value> args; for (auto* e : argEx) args.push_back(Eval(e));
      CallValue(*v, args);
      return F_NORMAL;
    }
    if (FuncInfo* fn = FindFunction(name)) { CallFunc(fn, argEx, nullptr, nullptr, nullptr); return F_NORMAL; }
    if (IsNativeFunction(name)) {
      std::vector<Value> args; std::vector<Value*> refs;
      for (auto* e : argEx) { Value* p = LValue(e); refs.push_back(p); args.push_back(p ? *p : Eval(e)); }
      CallNative(name, args, refs);
      return F_NORMAL;
    }
    if (IsQtFunction(name)) {
      std::vector<Value> args; for (auto* e : argEx) args.push_back(Eval(e));
      CallQt(name, args);
      return F_NORMAL;
    }
    Bad("The middle word is what the line does, and " + name + " isn't a root or a function's name.");
  }
  Value temp;
  Value* recv = s->w ? LValue(s->w.get()) : nullptr;
  if (!recv) { if (s->w && s->w->k == E::Name) Lookup(s->w->id); temp = s->w ? Eval(s->w.get()) : VVoid(); recv = &temp; }
  bool found = false;
  CallMethod(recv, name, argEx, nullptr, found);
  if (!found) Bad(s->who + " has no " + name + ".");
  return F_NORMAL;
}

// ------------------------------------------------------------------ running a program
int Interp::Run(Program* p) {
  P = p;
  g_prog = p;
  NativeReset();
  frames.clear(); stack.clear(); globals.clear(); globalIndex.clear();
  g_classType.clear();
  frames.push_back(Frame{});
  frames.back().base = 0;
  auto start = std::chrono::steady_clock::now();
  (void)start;
  // shared fields (dsh)
  for (auto& c : p->classStore) {
    for (Stmt* s : P->stmts.empty() ? std::vector<Stmt*>{} : std::vector<Stmt*>{}) (void)s;
  }
  int code = 0;
  Caught c = Protect([&] {
    for (auto& cp : p->classStore) {
      ClassInfo* cls = cp.get();
      for (auto& st : cls->statics) {
        // find the dsh line for its starting value
        (void)st;
      }
    }
    for (auto& sp : p->stmts) {
      Stmt* s = sp.get();
      if (s->root != "dsh") continue;
      ClassInfo* owner = nullptr;
      for (auto& cp : p->classStore) for (Stmt* m : std::vector<Stmt*>{}) (void)m, (void)cp;
      // the dsh line's parent is the class line
      Stmt* par = s->parent;
      if (par && par->cls) owner = par->cls;
      if (!owner) continue;
      g_line = s->line;
      for (auto& st : owner->statics) if (st.first == NameId(s->who)) {
        if (s->x) { st.second = Eval(s->x.get()); st.second.t = TypeFor(st.second); }
        else { const Type* t = ParseType(s->what); st.second = DefaultOf(t); }
      }
    }
    for (Stmt* g : p->globals) {
      g_line = g->line;
      Value v = g->kind ? DefaultOf(g->kind) : OwnValue(g->x.get(), Eval(g->x.get()));
      if (!v.t) v.t = TypeFor(v);
      globals.push_back(Slot{g->whoId, v, nullptr});
      globals.back().p = &globals.back().v;
      globalIndex[g->whoId] = &globals.back();
    }
    Flow f = ExecBlock(p->mainBody, true);
    if (f == F_RETURN) code = (int)ToInt(frames[0].ret);
  });
  Flush();
  if (c.k == CK_NONE) return code;
  if (c.k == CK_EXIT) return c.code;
  frames.resize(1);
  if (c.k == CK_STOP) { stack.clear(); Rethrow(c); }
  if (c.k == CK_THROWN) {
    stack.clear();
    std::string what = c.t.isStd ? c.t.v.s : ("a " + KindWords(c.t.v));
    Problem pr{"The program stopped with a problem nobody caught: " + what, g_line, g_file};
    Caught cc; cc.k = CK_PROBLEM; cc.p = pr;
    Rethrow(cc);
  }
  stack.clear();
  Rethrow(c);
}

}  // namespace epp
