// build.cpp — turns lines into blocks, definitions, kinds and values.
#include "front.h"
#include <algorithm>
namespace epp {
const NativeType* FindNativeType(const std::string& n);
bool IsNativeFunction(const std::string& n);
bool IsQtFunction(const std::string& n);
}

namespace epp {

static const std::set<std::string>& BlockRoots() {
  static std::set<std::string> s = {
    "ieq","ine","ilt","ile","igt","ige","oeq","one","olt","ole","ogt","oge","oth",
    "weq","wne","wlt","wle","wgt","wge","wfv","wln","flt","fle","fgt","fge","fne","fea","fpr",
    "bdo","bsw","bcs","bdf","btr","bch","blk","bbl","bdr","bts",
    "dfn","dcx","dcl","dst","dun","dgr","dlm","dlv","dmk","dds","dvr","dov","dsf","dhd","dfy","dkn","dop"};
  return s;
}
static const std::set<std::string>& FuncRoots() {
  static std::set<std::string> s = {"dfn","dcx","dvr","dmb","dov","dsf","dhd","dfy","dkn","dop","dmk","dds"};
  return s;
}
static bool IsIfRoot(const std::string& r) { return r.size() == 3 && r[0] == 'i' && r != "iff"; }
static bool IsElseRoot(const std::string& r) { return r.size() == 3 && r[0] == 'o' && (r == "oth" || r == "oeq" || r == "one" || r == "olt" || r == "ole" || r == "ogt" || r == "oge"); }
static bool IsUntilRoot(const std::string& r) { return r == "ueq" || r == "une" || r == "ult" || r == "ule" || r == "ugt" || r == "uge"; }

struct Builder {
  Program& P;
  explicit Builder(Program& p) : P(p) {}

  Stmt* NewStmt(const SrcLine& L) {
    auto s = std::make_unique<Stmt>();
    s->line = L.number; s->file = L.file; s->indent = L.indent;
    s->who = L.who; s->root = L.root; s->what = L.what;
    Stmt* r = s.get();
    P.stmts.push_back(std::move(s));
    return r;
  }

  // indentation -> blocks
  std::vector<Stmt*> Tree(const std::vector<SrcLine>& lines) {
    std::vector<Stmt*> top;
    std::vector<std::pair<int, Stmt*>> stack;  // open blocks: indent of their body, owner
    Stmt* prev = nullptr;
    for (auto& L : lines) {
      if (L.blank || L.note) continue;
      g_line = L.number; g_file = L.file;
      Stmt* s = NewStmt(L);
      int want = stack.empty() ? 0 : stack.back().first;
      if (L.indent > want) {
        bool opens = prev && (BlockRoots().count(prev->root) || IsUntilRoot(prev->root) == false) && prev->indent == want &&
                     (BlockRoots().count(prev->root) > 0);
        if (!opens || L.indent != want + 2) {
          if (!prev || !BlockRoots().count(prev->root))
            Bad("This line is indented, but no block is open. Only the lines under an if, a loop, a function or a class are indented.");
          Bad("Indent the lines under a block by two more spaces than the block's line.");
        }
        stack.push_back({L.indent, prev});
      } else {
        while (!stack.empty() && L.indent < stack.back().first) stack.pop_back();
        int now = stack.empty() ? 0 : stack.back().first;
        if (L.indent != now) Bad("This line's indent doesn't line up with a block above it.");
      }
      if (stack.empty()) top.push_back(s);
      else { s->parent = stack.back().second; stack.back().second->body.push_back(s); }
      prev = s;
    }
    return top;
  }

  // o.. / oth go with the i.. above them; bch with btr; u.. with bdo
  void Chain(std::vector<Stmt*>& list) {
    std::vector<Stmt*> out;
    for (size_t k = 0; k < list.size(); ++k) {
      Stmt* s = list[k];
      g_line = s->line; g_file = s->file;
      if (IsElseRoot(s->root)) {
        Stmt* head = out.empty() ? nullptr : out.back();
        bool ok = head && (IsIfRoot(head->root) ) && (head->chain.empty() || head->chain.back()->root != "oth");
        if (!ok) {
          if (s->root == "oth") Bad("oth means otherwise, so it needs an if right above it, at the same indent.");
          Bad(s->root + " means otherwise-if, so it needs an if right above it, at the same indent.");
        }
        s->chained = true; head->chain.push_back(s);
      } else if (s->root == "bch") {
        Stmt* head = out.empty() ? nullptr : out.back();
        if (!head || head->root != "btr") Bad("bch catches a problem, so it goes right after a btr block, at the same indent.");
        s->chained = true; head->chain.push_back(s);
      } else if (IsUntilRoot(s->root)) {
        Stmt* head = out.empty() ? nullptr : out.back();
        if (!head || head->root != "bdo" || !head->chain.empty()) Bad(s->root + " ends a bdo loop, so it goes right after the bdo block, at the same indent.");
        s->chained = true; head->chain.push_back(s);
      } else {
        if (s->root == "bdo") { /* its u.. line must follow */ }
        out.push_back(s);
      }
      Chain(s->body);
    }
    for (Stmt* s : out) if (s->root == "bdo" && s->chain.empty()) { g_line = s->line; Bad("A bdo loop needs a u.. line right after its block, at the same indent, like n uge 6."); }
    list = out;
  }

  std::string Q(const std::string& n) const { return P.curGroup.empty() ? n : P.curGroup + "::" + n; }

  // ---------- names first, so values can tell a call from a list
  void Register(std::vector<Stmt*>& list, ClassInfo* inClass) {
    std::vector<std::string> pendingT;
    for (Stmt* s : list) {
      g_line = s->line; g_file = s->file;
      const std::string& r = s->root;
      if (r == "dtp") { pendingT.push_back(s->who); continue; }
      if (inClass == nullptr && (r == "dfn" || r == "dcx")) {
        if (IsRoot(s->who)) Bad(s->who + " is a root, so it can't be a function's name: lines would read it as the root. Pick another name.");
        if (!IsPlainName(s->who)) Bad("A name is letters, digits and _, starting with a letter. " + s->who + " isn't one.");
        auto f = std::make_unique<FuncInfo>();
        f->name = s->who; f->id = NameId(s->who); f->line = s->line; f->file = s->file; f->root = r;
        f->tparams = pendingT; pendingT.clear();
        s->fn = f.get();
        if (P.funcs.count(Q(s->who))) Bad(s->who + " is defined twice.");
        P.funcs[Q(s->who)] = f.get();
        P.callables.insert(Q(s->who));
        if (!P.curGroup.empty()) P.groupFuncNames.insert(s->who);
        P.funcStore.push_back(std::move(f));
      } else if (r == "dcl" || r == "dst" || r == "dun") {
        if (!IsPlainName(s->who)) Bad("A name is letters, digits and _, starting with a letter. " + s->who + " isn't one.");
        auto c = std::make_unique<ClassInfo>();
        c->name = s->who; c->group = P.curGroup; c->line = s->line; c->isStruct = r == "dst"; c->isUnion = r == "dun";
        c->tparams = pendingT; pendingT.clear();
        if (s->what != "now") {
          for (auto& part : SplitAmp(s->what)) c->parentNames.push_back(part);
        }
        s->cls = c.get();
        if (P.classes.count(Q(s->who))) Bad(s->who + " is defined twice.");
        P.classes[Q(s->who)] = c.get();
        ClassInfo* cp = c.get();
        P.classStore.push_back(std::move(c));
        for (Stmt* m : s->body) {
          if (FuncRoots().count(m->root)) {
            if (m->root == "dop") { if (m->who == "call") classWithCall.insert(Q(s->who)); }
            else if (m->root != "dmk" && m->root != "dds") P.methodNames.insert(m->who);
          }
        }
        Register(s->body, cp);
      } else if (r == "den") {
        auto e = std::make_unique<EnumInfo>();
        e->name = s->who; e->group = P.curGroup;
        for (auto& part : SplitAmp(s->what)) e->names.push_back(part);
        P.enums[Q(s->who)] = e.get();
        if (inClass) P.enums[s->who] = e.get();
        P.enumStore.push_back(std::move(e));
      } else if (r == "dgr") {
        if (inClass) Bad("A group goes at the top level or inside a group.");
        P.groups.insert(s->who);
        std::string saved = P.curGroup;
        P.curGroup = s->who;
        Register(s->body, nullptr);
        P.curGroup = saved;
      } else if (r != "dtp") {
        if (!pendingT.empty() && r != "dal") { /* dtp goes right above a function or a class */ }
      }
    }
  }
  std::set<std::string> classWithCall;

  static std::vector<std::string> SplitAmp(const std::string& w) {
    std::vector<std::string> parts; std::string cur;
    for (char c : w) { if (c == '&') { parts.push_back(cur); cur.clear(); } else cur += c; }
    parts.push_back(cur);
    return parts;
  }

  // names that hold functions (or things with a call operator) take & values too
  void FindCallableNames(const std::vector<Stmt*>& list) {
    for (Stmt* s : list) {
      const std::string& r = s->root;
      if (r == "dlm" || r == "dlv") P.callables.insert(s->who);
      if ((r == "mak" || r == "dpm" || r == "dfd" || r == "mgl") && s->what.rfind("fun@", 0) == 0) P.callables.insert(s->who);
      if (r == "mak" || r == "is" || r == "mwn" || r == "msh" || r == "mnw") {
        std::string head = s->what.substr(0, s->what.find_first_of("&@"));
        if (classWithCall.count(head)) P.callables.insert(s->who);
        if (P.callables.count(s->what) && IsPlainName(s->who)) P.callables.insert(s->who);
      }
      FindCallableNames(s->body);
      FindCallableNames(s->chain);
    }
  }

  // ---------- kinds and classes
  void Aliases(std::vector<Stmt*>& list) {
    for (Stmt* s : list) {
      g_line = s->line; g_file = s->file;
      if (s->root == "dal") P.aliases[Q(s->who)] = ParseType(s->what);
      if (s->root == "dgr") { std::string sv = P.curGroup; P.curGroup = s->who; Aliases(s->body); P.curGroup = sv; }
    }
  }

  const Type* KindOrNull(const std::string& w) {   // "now" -> nullptr
    if (w == "now") return nullptr;
    return ParseType(w);
  }
  bool IsKindWord(const std::string& w) {
    if (w == "now") return false;
    const Type* t = TryParseType(w);
    return t != nullptr;
  }

  FuncInfo* MakeFunc(Stmt* s, ClassInfo* cls, FuncInfo* existing) {
    FuncInfo* f = existing;
    if (!f) {
      auto up = std::make_unique<FuncInfo>();
      f = up.get();
      P.funcStore.push_back(std::move(up));
      f->name = s->who; f->id = NameId(s->who); f->line = s->line; f->file = s->file; f->root = s->root;
    }
    f->cls = cls;
    s->fn = f;
    std::set<std::string> savedT = P.tparamsInScope;
    for (auto& t : f->tparams) P.tparamsInScope.insert(t);
    if (cls) for (auto& t : cls->tparams) P.tparamsInScope.insert(t);
    // what it gives back
    std::string w = s->what;
    if (s->root == "dmk" || s->root == "dds") {
      if (w != "now") { g_line = s->line; Bad(s->root + " starts with the class's name: " + (cls ? cls->name : s->who) + " " + s->root + " now."); }
      f->ret = nullptr;
    } else if (w == "now") {
      f->ret = nullptr;
    } else {
      g_line = s->line; g_file = s->file;
      if (w.rfind("ref@", 0) == 0) { f->retRef = true; w = w.substr(4); }
      f->ret = ParseType(w);
      if (f->ret->param) f->ret = nullptr, f->returnsNothing = false;
      else f->returnsNothing = false;
      if (f->ret && f->ret->head == "gnr") f->isGen = true;
    }
    if (s->what == "now") f->returnsNothing = true;
    // what it takes: the dpm lines at the top
    size_t k = 0;
    for (; k < s->body.size(); ++k) {
      Stmt* p = s->body[k];
      if (p->root != "dpm") break;
      g_line = p->line; g_file = p->file;
      Param pr;
      pr.name = p->who; pr.id = NameId(p->who);
      std::string pw = p->what;
      if (IsKindWord(pw) || pw.rfind("ref@", 0) == 0 || pw.rfind("see@", 0) == 0 || pw.rfind("tkn@", 0) == 0) {
        if (pw.rfind("ref@", 0) == 0) { pr.ref = true; pw = pw.substr(4); }
        else if (pw.rfind("see@", 0) == 0) { pr.look = true; pw = pw.substr(4); }
        else if (pw.rfind("tkn@", 0) == 0) { pr.take = true; pw = pw.substr(4); }
        pr.type = ParseType(pw);
        if (pr.type->param || pr.type->head == "any") pr.type = nullptr;
      } else {
        pr.def = ParseValue(pw);
        pr.type = nullptr;  // from its default
        if (pr.def->k == E::Int) pr.type = TY_NUM;
        else if (pr.def->k == E::Dbl) pr.type = TY_DEC;
        else if (pr.def->k == E::Str) pr.type = TY_TXT;
        else if (pr.def->k == E::Bool) pr.type = TY_YNO;
        else if (pr.def->k == E::Chr) pr.type = TY_LTR;
      }
      f->params.push_back(std::move(pr));
    }
    for (size_t j = k; j < s->body.size(); ++j) {
      Stmt* b = s->body[j];
      if (b->root == "dpm") { g_line = b->line; Bad("dpm says what a function takes, so it goes right under the function's line, before anything else."); }
      if (b->root == "dbs") { f->dbs.push_back(b); continue; }
      f->body.push_back(b);
    }
    if (f->params.size() == 1 && f->params[0].type && f->params[0].type->head == "vec" && !f->params[0].ref && !f->params[0].look)
      f->params[0].pack = true;
    Values(f->body, cls, f);
    for (Stmt* b : f->dbs) Values({b}, cls, f);
    for (auto& pr : f->params) (void)pr;
    P.tparamsInScope = savedT;
    return f;
  }

  void Classes() {
    for (auto& cp : P.classStore) {
      ClassInfo* c = cp.get();
      std::string saved = P.curGroup; P.curGroup = c->group;
      for (auto& pn : c->parentNames) {
        g_line = c->line;
        std::string q = c->group.empty() ? pn : c->group + "::" + pn;
        auto it = P.classes.find(q);
        if (it == P.classes.end()) it = P.classes.find(pn);
        if (it == P.classes.end()) {
          if (P.usesRaylib || true) Bad(pn + " isn't a class, so " + c->name + " can't come from it.");
        }
        if (it->second == c) Bad(c->name + " can't be its own parent. A class comes from a different class, or from none: " + c->name + " dcl now.");
        c->parents.push_back(it->second);
      }
      P.curGroup = saved;
    }
  }
  void Layout(ClassInfo* c) {
    if (c->laidOut) return;
    c->laidOut = true;
    for (auto* p : c->parents) {
      Layout(p);
      for (auto& f : p->all) c->all.push_back(f);
    }
    for (size_t k = 0; k < c->own.size(); ++k) c->all.push_back({c, (int)k});
    for (size_t k = 0; k < c->all.size(); ++k) {
      auto& fi = c->all[k].first->own[c->all[k].second];
      c->fieldIndex[fi.id] = (int)k;   // later ones (children) win
    }
  }

  void ClassBody(Stmt* s) {
    ClassInfo* c = s->cls;
    std::set<std::string> savedT = P.tparamsInScope;
    for (auto& t : c->tparams) P.tparamsInScope.insert(t);
    std::string savedG = P.curGroup; P.curGroup = c->group;
    for (Stmt* m : s->body) {
      g_line = m->line; g_file = m->file;
      const std::string& r = m->root;
      if (r == "dfd" || r == "dfm" || r == "dsc" || r == "dbb" || r == "dsh") {
        FieldInfo fi;
        fi.name = m->who; fi.id = NameId(m->who);
        fi.vis = r == "dsc" ? 1 : r == "dfm" ? 2 : 0;
        if (r == "dbb") {
          fi.bits = std::atoi(m->what.c_str());
          fi.type = ParseType("pos");
        } else if (IsKindWord(m->what)) {
          fi.type = ParseType(m->what);
        } else {
          m->x = ParseValue(m->what);
          fi.def = m->x.get();
          fi.type = LiteralType(m->x.get());
        }
        if (r == "dsh") {
          c->statics.push_back({fi.id, Value()});
          staticInits.push_back({c, m, fi.type});
          continue;
        }
        c->own.push_back(std::move(fi));
      } else if (r == "dmk") {
        if (m->who != c->name) Bad("dmk starts with the class's name: " + c->name + " dmk now.");
        c->ctors.push_back(MakeFunc(m, c, nullptr));
      } else if (r == "dds") {
        if (m->who != c->name) Bad("dds starts with the class's name: " + c->name + " dds now.");
        c->dtor = MakeFunc(m, c, nullptr);
      } else if (r == "dop") {
        FuncInfo* f = MakeFunc(m, c, nullptr);
        f->op = m->who;
        c->ops[m->who] = f;
      } else if (r == "dmb") {
        FuncInfo* f = MakeFunc(m, c, nullptr);
        f->isAbstract = true;
        c->methods[m->who] = f;
      } else if (FuncRoots().count(r)) {
        if (IsRoot(m->who)) Bad(m->who + " is a root, so it can't be a function's name: lines would read it as the root. Pick another name.");
        FuncInfo* f = MakeFunc(m, c, nullptr);
        f->isStatic = r == "dsf";
        c->methods[m->who] = f;
      } else if (r == "dcl" || r == "dst" || r == "den" || r == "dtp" || r == "dal" || r == "dun") {
        if (r == "dcl" || r == "dst" || r == "dun") ClassBody(m);
      } else {
        Bad("A class holds fields and functions. Put this line inside a function: " + r + " can't be here.");
      }
    }
    P.tparamsInScope = savedT;
    P.curGroup = savedG;
  }
  struct StaticInit { ClassInfo* c; Stmt* s; const Type* t; };
  std::vector<StaticInit> staticInits;

  static const Type* LiteralType(const Expr* e) {
    switch (e->k) {
      case E::Int: return e->ik == IK_BIG ? TY_BIG : e->ik == IK_PBG ? TY_PBG : TY_NUM;
      case E::Dbl: return TY_DEC;
      case E::Str: case E::Interp: return TY_TXT;
      case E::Chr: return TY_LTR;
      case E::Bool: return TY_YNO;
      case E::Unary: return LiteralType(e->kids[0].get());
      default: return nullptr;
    }
  }

  // ---------- definitions at the top (and in groups) are hoisted
  void Top(std::vector<Stmt*>& list, bool inGroup) {
    std::vector<std::string> pendingT;
    for (Stmt* s : list) {
      g_line = s->line; g_file = s->file;
      const std::string& r = s->root;
      if (r == "dfn" || r == "dcx") {
        MakeFunc(s, nullptr, s->fn);
      } else if (r == "dcl" || r == "dst" || r == "dun") {
        ClassBody(s);
      } else if (r == "den" || r == "dtp" || r == "dal") {
        // done
      } else if (r == "dgr") {
        std::string saved = P.curGroup; P.curGroup = s->who;
        Top(s->body, true);
        P.curGroup = saved;
      } else if (r == "mgl" || r == "mtl") {
        Values({s}, nullptr, nullptr);
        P.globals.push_back(s);
      } else if (r == "dmk" || r == "dds" || r == "dvr" || r == "dov" || r == "dmb" || r == "dsf" || r == "dhd" || r == "dfy" || r == "dkn" || r == "dop" || r == "dfd" || r == "dsc" || r == "dfm" || r == "dsh" || r == "dbb") {
        Bad(r + " makes part of a class, so it goes directly inside a class.");
      } else if (r == "dpm") {
        Bad("dpm says what a function takes, so it goes right under the function's line, before anything else.");
      } else {
        if (inGroup) Bad("A group holds definitions. Put this line inside a function: " + r + " can't be here.");
        Values({s}, nullptr, nullptr);
        P.mainBody.push_back(s);
      }
    }
  }

  // ---------- each line's values
  void Values(const std::vector<Stmt*>& list, ClassInfo* cls, FuncInfo* fn) {
    for (Stmt* s : list) {
      g_line = s->line; g_file = s->file;
      OneLine(s, cls, fn);
      if (s->root == "dlm" || s->root == "dlv") {
        auto up = std::make_unique<FuncInfo>();
        FuncInfo* f = up.get();
        P.funcStore.push_back(std::move(up));
        f->name = s->who; f->id = NameId(s->who); f->line = s->line; f->file = s->file; f->root = s->root;
        f->isLambda = true; f->copies = s->root == "dlv";
        MakeFunc(s, cls, f);
        continue;
      }
      if (FuncRoots().count(s->root) || s->root == "dcl" || s->root == "dst" || s->root == "dun") {
        if (s->root == "dfn") Bad("A function can't be made inside another function. Make it at the top level, or use dlm for a function kept in a name.");
        if (s->root == "dcl" || s->root == "dst" || s->root == "dun") Bad("A class goes at the top level, inside a group, or inside a class. It can't be inside a function.");
        Bad(s->root + " makes part of a class, so it goes directly inside a class.");
      }
      if (s->root == "den") Bad("An enum goes at the top level, inside a group, or inside a class.");
      Values(s->body, cls, fn);
      Values(s->chain, cls, fn);
    }
  }

  static bool WhoIsName(const std::string& r) {
    static std::set<std::string> s = {"mak","mkn","mgl","mtl","mpt","mrf","mlo","mnw","mwn","msh","mtd","msy","mfi","mfo","mmv","msv",
      "flt","fle","fgt","fge","fne","dpm","dlm","dlv","eyd","ert","bch","dbs","gln","get","wln","dtp","dal"};
    return s.count(r) > 0;
  }

  void OneLine(Stmt* s, ClassInfo* cls, FuncInfo* fn) {
    const std::string& r = s->root;
    (void)cls; (void)fn;
    if (r == "dtp" || r == "dgr" || r == "den" || r == "dal") return;
    if (!IsRoot(r)) {
      // a function, method or library call: who root what
      bool known = P.IsCallableName(r) || P.IsMethodName(r) || P.funcs.count(r) ||
                   r == "open" || r == "send" || r == "push_back" || r == "close" || r == "wait" || r == "notify_one" || r == "notify_all";
      if (!known) {
        std::string m = "The middle word is what the line does, and " + r + " isn't a root or a function's name.";
        if (s->who == "inp") m = "inp is the keyboard, and it goes last: name get inp reads a word, and line gln inp a line. It has no " + r + ".";
        Bad(m);
      }
      if (s->who != "now") s->w = ParseValue(s->who);
      if (s->what != "now") s->x = ParseValue(s->what);
      s->rootId = -1;
      return;
    }
    // who
    if (r == "is" && s->who.find('&') != std::string::npos && s->who.find("&&") == std::string::npos) {
      for (auto& n : SplitAmp(s->who)) {
        if (!IsPlainName(n)) Bad("Each name before is has to be a plain name, and " + n + " isn't one. To change a place inside something, give it its own line.");
        s->names.push_back(n); s->nameIds.push_back(NameId(n));
      }
    } else if (r == "fea" && s->who.find('&') != std::string::npos) {
      for (auto& n : SplitAmp(s->who)) { s->names.push_back(n); s->nameIds.push_back(NameId(n)); }
    } else if (WhoIsName(r) || r == "fea" || r == "fpr") {
      s->whoId = NameId(s->who);
      if (r == "bch" || r == "dbs" || r == "ert" || r == "eyd") {}
      else if (s->who != "now" && !IsPlainName(s->who) && r != "gln" && r != "get" && r != "wln")
        Bad("A name is letters, digits and _, starting with a letter. " + s->who + " isn't one.");
      if ((r == "gln" || r == "get") && s->who != "now") s->w = ParseValue(s->who);
    } else if (r == "ebk" || r == "enx") {
      s->whoId = s->who == "now" ? -1 : NameId(s->who);
    } else if (s->who == "now" || s->who == "out" || s->who == "err" || s->who == "inp") {
      s->whoId = NameId(s->who);
    } else {
      s->w = ParseValue(s->who);
      if (s->w->k == E::Name) s->whoId = s->w->id;
    }
    // what
    if (r == "mak" || r == "dfd" || r == "mgl" || r == "mtl") {
      if (IsKindWord(s->what)) s->kind = ParseType(s->what);
      else if (s->what != "now") s->x = ParseValue(s->what);
      return;
    }
    if (r == "dpm" || r == "dlm" || r == "dlv" || FuncRoots().count(r) || r == "dcl" || r == "dst" || r == "dun" ||
        r == "dfm" || r == "dsc" || r == "dsh" || r == "dbb") return;
    if (r == "bch") {
      if (s->what != "now") s->kind = ParseType(s->what);
      return;
    }
    if (r == "bcs") {
      s->x = ParseValue(s->what);
      return;
    }
    if (r == "xic" || r == "xlb" || r == "xim" || r == "xus" || r == "xpp" || r == "xgl") return;
    if (s->what != "now") s->x = ParseValue(s->what);
  }

  // xim: bring in another file's definitions
  void Imports(std::vector<SrcLine>& lines) {
    std::vector<SrcLine> extra;
    for (auto& L : lines) {
      if (L.blank || L.note) continue;
      if (L.root == "xim" && L.indent == 0) {
        g_line = L.number; g_file = L.file;
        std::string name = L.what;
        if (name.size() < 2 || name.front() != '"') Bad("xim brings in a file, so its name goes in quotes: now xim \"tools.epp\".");
        name = name.substr(1, name.size() - 2);
        if (P.imported.count(name)) continue;
        P.imported.insert(name);
        auto it = g_disk.files.find(name);
        if (it == g_disk.files.end()) Bad("I can't find the file " + name + ". Add it in Files, with that name, so xim can bring it in.");
        auto more = ReadLines(it->second, name);
        Imports(more);
        for (auto& m : more) extra.push_back(m);
      }
      if (L.root == "xpp" || L.root == "xgl") { g_line = L.number; g_file = L.file; NotYet("A line of C++ (" + L.root + ")"); }
      if (L.root == "xic") {
        static const std::set<std::string> lib = {"\"raylib.h\"","\"raymath.h\"","\"rlgl.h\""};
        if (L.what.size() > 1 && L.what.front() == '"' && !lib.count(L.what) && L.what.find("Qt") == std::string::npos) {
          g_line = L.number; g_file = L.file;
          NotYet("Bringing in your own C++ file (" + L.what + ")");
        }
      }
      if (L.root == "xlb" || L.root == "xic") {
        std::string w = L.what;
        if (w == "raylib" || w == "\"raylib.h\"" || w == "\"raymath.h\"" || w == "\"rlgl.h\"") P.usesRaylib = true;
        if (w == "qt" || w == "\"qt\"" || w.find("Qt") != std::string::npos || w == "\"QApplication\"") P.usesQt = true;
        if (w == "sdl" || w.find("SDL") != std::string::npos) P.usesSdl = true;
      }
    }
    // imported files: only their definitions come in
    for (auto& m : extra) {
      lines.push_back(m);
    }
    importedLines = extra.size();
  }
  size_t importedLines = 0;
};

std::unique_ptr<Program> BuildProgram(const std::string& src) {
  InitTypes();
  auto prog = std::make_unique<Program>();
  prog->nativeType = [](const std::string& n) { return FindNativeType(n); };
  prog->nativeCallable = [](const std::string& n) { return IsNativeFunction(n) || IsQtFunction(n); };
  Program* saved = g_prog;
  g_prog = prog.get();
  struct Restore { Program* s; ~Restore() { (void)s; } } restore{saved};
  Builder b(*prog);
  auto lines = ReadLines(src, "");
  b.Imports(lines);
  // split the imported files' lines into their own trees (they start at indent 0 too)
  std::vector<SrcLine> mainLines, importLines;
  for (auto& L : lines) (L.file.empty() ? mainLines : importLines).push_back(L);
  auto top = b.Tree(mainLines);
  auto itop = b.Tree(importLines);
  b.Chain(top);
  b.Chain(itop);
  // imported files bring their definitions only
  std::vector<Stmt*> defs;
  for (Stmt* s : itop) {
    static const std::set<std::string> d = {"dfn","dcx","dcl","dst","dun","den","dgr","dal","dtp","mgl","mtl"};
    if (d.count(s->root)) defs.push_back(s);
  }
  std::vector<Stmt*> all = defs;
  for (Stmt* s : top) all.push_back(s);
  b.Register(all, nullptr);
  b.FindCallableNames(all);
  b.FindCallableNames(all);
  b.Aliases(all);
  b.Classes();
  for (auto& c : prog->classStore) { (void)c; }
  // class bodies need every class known first
  b.Top(all, false);
  for (auto& c : prog->classStore) b.Layout(c.get());
  for (auto& si : b.staticInits) {
    g_line = si.s->line;
    if (!si.s->x) {
      // dsh with a kind: starts at that kind's empty value (set by the interpreter)
    }
  }
  prog->curGroup.clear();
  return prog;
}

}  // namespace epp
