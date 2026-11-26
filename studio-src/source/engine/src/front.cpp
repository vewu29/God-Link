// front.cpp — reads English++ source into lines, blocks, kinds and values.
#include "front.h"
#include "eh.h"
#include <sstream>
#include <algorithm>
#include <cstring>

namespace epp {

int g_line = 0;
std::string g_file;

static std::vector<std::string>& NameTable() { static std::vector<std::string> v; return v; }
static std::unordered_map<std::string, int>& NameMap() { static std::unordered_map<std::string, int> m; return m; }
int NameId(const std::string& s) {
  auto& m = NameMap();
  auto it = m.find(s);
  if (it != m.end()) return it->second;
  int id = (int)NameTable().size();
  NameTable().push_back(s);
  m.emplace(s, id);
  return id;
}
const std::string& NameOf(int id) { return NameTable()[id]; }

Program* g_prog = nullptr;

// ------------------------------------------------------------------ roots
static const char* kRoots[] = {
  "is","add","asb","aml","adv","amd","apw","and","aor","axr","asl","asr","ant",
  "btr","bch","bdo","bsw","bcs","bdf","blk","bbl","bdr","bts",
  "dfn","dcx","dpm","dcl","dst","dun","den","dgr","dlm","dlv","dtp","dal","dfd","dbb","dsc","dfm","dsh","dmk","dbs",
  "dds","dvr","dmb","dov","dsf","dhd","dfy","dkn","dop",
  "ert","ebk","enx","etw","edl","ext","eyd",
  "flt","fle","fgt","fge","fne","fea","fpr","get","gln",
  "hwr","hap","hrm","hmk","hcp","hmv","hby",
  "ieq","ine","ilt","ile","igt","ige",
  "lrm","ldx","lin","lpl","lpf","lso","lrv","lsu","lwp","lfl","luq","lrs","lss","lrw",
  "mak","mkn","mgl","mpt","mrf","mlo","mnw","mwn","msh","mtd","msy","mfi","mfo","mmv","msv","mtl",
  "oeq","one","olt","ole","ogt","oge","oth","prn","put","rjn","rdt","rwt","rcm","rsd",
  "seq","sne","slt","sle","sgt","sge","ueq","une","ult","ule","ugt","uge",
  "weq","wne","wlt","wle","wgt","wge","wfv","wln","xic","xlb","xim","xus","xpp","xgl", nullptr};
static const char* kValueWords[] = {
  "cct","csm","cpd","cmx","cmn","cav","cme","cde","cps","chs","chm","cfr","cla","cky","cvl","cso","crv","cft","cmp",
  "ctx","cra","cea","can","cnn","crl","czp","cnu","cun","cbt","cot","ccu","cbf","cpb","cgr","cjn","crg",
  "hrd","hln","hex","hsz","hls","hrb","iff","kel","kms","kda","ktm","kyr","kmo","kdy","khr","kmi","kse","kwk","kns","kfa",
  "nab","nsq","ncr","nro","ndn","nup","nwh","npw","nmx","nmn","nkb","nsn","nco","ntn","nas","nac","nat","nlg","nlx",
  "nep","nhy","ngd","nmu","nra","nrz","nfc","npe","npi","nhi","nlw","nnd","nor","nxr","nsl","nsr","nnt","nsz",
  "tsz","tuc","tlc","tti","trv","tps","trp","tcu","tsp","twd","tln","ths","tbg","ted","tnm","tdc","tfx","tpa","ttc",
  "tmt","tma","trx","tre","tct","tdg","tlr","tws","tfa","ttp","tjs","xag","xev","xcm","xcd","xwb","xpo","xha","xbe","xbd",
  nullptr};
static const char* kNoArgWords[] = {"kel","kms","kda","ktm","kyr","kmo","kdy","khr","kmi","kse","kwk","kns","npi","nhi","nlw","xag",nullptr};

bool IsRoot(const std::string& w) {
  static std::set<std::string> s = [] { std::set<std::string> r; for (int i = 0; kRoots[i]; ++i) r.insert(kRoots[i]); return r; }();
  return s.count(w) > 0;
}
bool IsValueWord(const std::string& w) {
  static std::set<std::string> s = [] { std::set<std::string> r; for (int i = 0; kValueWords[i]; ++i) r.insert(kValueWords[i]); return r; }();
  return s.count(w) > 0;
}
bool IsNoArgWord(const std::string& w) {
  static std::set<std::string> s = [] { std::set<std::string> r; for (int i = 0; kNoArgWords[i]; ++i) r.insert(kNoArgWords[i]); return r; }();
  return s.count(w) > 0;
}
static bool IsDigit(char c) { return c >= '0' && c <= '9'; }
static bool IsNameStart(char c) { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_'; }
static bool IsNameChar(char c) { return IsNameStart(c) || IsDigit(c); }
bool IsPlainName(const std::string& s) {
  if (s.empty() || !IsNameStart(s[0])) return false;
  for (char c : s) if (!IsNameChar(c)) return false;
  return true;
}

// ------------------------------------------------------------------ words
// Same rules (and the same messages) as the Studio's own reader.
std::vector<std::string> SplitWords(const std::string& text) {
  std::vector<std::string> words;
  size_t i = 0, n = text.size();
  while (i < n) {
    while (i < n && (text[i] == ' ' || text[i] == '\t')) ++i;
    if (i >= n) break;
    std::string w;
    while (i < n && text[i] != ' ' && text[i] != '\t') {
      char c = text[i];
      if (c == '"') {
        size_t j = i + 1;
        while (j < n && text[j] != '"') { if (text[j] == '\\' && j + 1 < n) ++j; ++j; }
        if (j >= n) Bad("I couldn't find the end of the text in quotes.");
        w += text.substr(i, j - i + 1); i = j + 1; continue;
      }
      if (c == '\'') {
        size_t j = i + 1;
        if (j < n && text[j] == '\\') ++j;
        ++j;
        if (j >= n || text[j] != '\'') Bad("A letter is one character in single quotes, like 'a'.");
        w += text.substr(i, j - i + 1); i = j + 1; continue;
      }
      switch (c) {
        case '(': case ')':
          Bad("English++ has no round brackets. Make a step for the part inside: t is a+b, then x is t*c. To call something, use &: add&1&2.");
        case '{': case '}': Bad("English++ has no curly brackets. The lines under a block, indented, are its body.");
        case ',': Bad("English++ has no commas. Use & between values: add&1&2.");
        case ':': Bad("English++ has no colons. The lines under a block, indented, are its body, and @ reaches inside something: geo@area.");
        case ';': Bad("English++ has no semicolons. A line ends where it ends.");
        case '[': case ']': Bad("English++ has no square brackets. Use @ for a position: scores@0.");
        case '.':
          if (!(i > 0 && IsDigit(text[i - 1]) && i + 1 < n && IsDigit(text[i + 1])))
            Bad("English++ has no dots, except inside a number like 2.5. Use @ to reach inside something: rex@speed. A file name goes in quotes.");
          break;
        default: break;
      }
      w += c; ++i;
    }
    words.push_back(w);
  }
  return words;
}

std::string WordCountMessage(const std::vector<std::string>& w) {
  std::string m = "This line has " + std::to_string(w.size()) + (w.size() == 1 ? " word" : " words") +
                  ". Every line has exactly 3: who, the root, and what.";
  if (w.size() < 3) m += " If there is nothing to say in a spot, fill it with now, like now ebk now.";
  else {
    bool math = false;
    for (auto& x : w) if (x == "+" || x == "-" || x == "*" || x == "/" || x == "%" || x == "<" || x == ">") math = true;
    m += math ? " Write math with no spaces: x is a+b." : " Text with spaces goes in quotes, and & joins values into one word: add&1&2.";
  }
  return m;
}

// ------------------------------------------------------------------ kinds
const Type *TY_NUM, *TY_BIG, *TY_DEC, *TY_FLO, *TY_TXT, *TY_LTR, *TY_YNO, *TY_ANY, *TY_NOW, *TY_HUG, *TY_CPX,
    *TY_JSN, *TY_BYT, *TY_PBG, *TY_EXN;
static std::map<std::string, std::unique_ptr<Type>>& TypeTable() { static std::map<std::string, std::unique_ptr<Type>> t; return t; }

static const std::set<std::string>& ScalarHeads() {
  static std::set<std::string> s = {"num","big","sml","pos","byt","pbg","hug","dec","flo","cpx","txt","ltr","yno","any","now",
                                    "jsn","mtx","cnd","thd","ifs","ofs","sck","srv","exn"};
  return s;
}
static int HeadArity(const std::string& h) {   // -1 = takes the rest, -2 = elem + size
  static std::map<std::string, int> a = {
    {"vec",1},{"lst",1},{"dqu",1},{"stk",1},{"que",1},{"hep",1},{"mhp",1},{"set",1},{"bag",1},{"opt",1},{"own",1},
    {"shr",1},{"ptr",1},{"ref",1},{"see",1},{"tkn",1},{"atm",1},{"fut",1},{"gnr",1},{"chn",1},
    {"map",2},{"hsh",2},{"par",2},{"arr",-2},{"tup",-1},{"alt",-1},{"fun",-1},{"std",-3}};
  auto it = a.find(h);
  return it == a.end() ? 0 : it->second;
}
bool IsKindHead(const std::string& h) { return ScalarHeads().count(h) || HeadArity(h) != 0; }
bool IsCollectionHead(const std::string& h) { int a = HeadArity(h); return a != 0 && a != -3; }

static std::string Qualify(const std::string& group, const std::string& name) { return group.empty() ? name : group + "::" + name; }

// Finds a class / enum / alias / native kind named n, from inside group g.
static bool ResolveNamedKind(const std::string& n, Type& t) {
  Program* p = g_prog;
  if (!p) return false;
  std::vector<std::string> tries;
  if (!p->curGroup.empty()) tries.push_back(p->curGroup + "::" + n);
  tries.push_back(n);
  for (auto& q : tries) {
    if (p->tparamsInScope.count(q)) { t.param = true; return true; }
    auto c = p->classes.find(q);
    if (c != p->classes.end()) { t.cls = c->second; return true; }
    auto e = p->enums.find(q);
    if (e != p->enums.end()) { t.en = e->second; return true; }
  }
  if (p->tparamsInScope.count(n)) { t.param = true; return true; }
  if (p->nativeType) { const NativeType* nt = p->nativeType(n); if (nt) { t.nat = nt; return true; } }
  return false;
}

static const Type* Intern(Type&& t) {
  auto& tab = TypeTable();
  std::string key = t.text;
  if (t.param) key = "?param:" + t.text;
  auto it = tab.find(key);
  if (it != tab.end()) {
    // classes may be re-registered by a new program: refresh
    it->second->cls = t.cls; it->second->en = t.en; it->second->nat = t.nat; it->second->args = t.args; it->second->n = t.n;
    it->second->param = t.param;
    return it->second.get();
  }
  auto up = std::make_unique<Type>(std::move(t));
  const Type* r = up.get();
  tab.emplace(key, std::move(up));
  return r;
}

static const Type* ParseTypeParts(const std::vector<std::string>& parts, size_t& pos, bool strict);
static std::string JoinFrom(const std::vector<std::string>& parts, size_t a, size_t b) {
  std::string r;
  for (size_t i = a; i < b; ++i) { if (i > a) r += "@"; r += parts[i]; }
  return r;
}
static const Type* ParseTypeParts(const std::vector<std::string>& parts, size_t& pos, bool strict) {
  if (pos >= parts.size()) { if (strict) Bad("A kind is missing here. Kinds look like num, txt, vec@num, or a class's name."); return nullptr; }
  size_t start = pos;
  std::string h = parts[pos++];
  Program* p = g_prog;
  // aliases expand where they stand
  if (p) {
    std::string q = Qualify(p->curGroup, h);
    auto al = p->aliases.find(q);
    if (al == p->aliases.end()) al = p->aliases.find(h);
    if (al != p->aliases.end()) return al->second;
  }
  Type t;
  t.head = h;
  if (ScalarHeads().count(h)) {
    t.text = h;
  } else if (int ar = HeadArity(h)) {
    if (ar == -3) {
      if (strict) NotYet("C++ standard library kinds (std@...)");
      return nullptr;
    }
    if (ar == -2) {
      const Type* e = ParseTypeParts(parts, pos, strict);
      if (!e) return nullptr;
      t.args.push_back(e);
      if (pos >= parts.size()) { if (strict) Bad("An array says how many it holds: arr@num@5."); return nullptr; }
      const std::string& sz = parts[pos++];
      for (char c : sz) if (!IsDigit(c)) { if (strict) Bad("An array's size is a whole number: arr@num@5."); return nullptr; }
      t.n = std::stoll(sz);
    } else if (ar == -1) {
      while (pos < parts.size()) {
        const Type* a = ParseTypeParts(parts, pos, strict);
        if (!a) return nullptr;
        t.args.push_back(a);
      }
    } else {
      for (int k = 0; k < ar; ++k) {
        const Type* a = ParseTypeParts(parts, pos, strict);
        if (!a) return nullptr;
        t.args.push_back(a);
      }
    }
    t.text = JoinFrom(parts, start, pos);
  } else {
    // group-qualified: zoo@Bear
    if (p && p->groups.count(h) && pos < parts.size()) {
      std::string saved = p->curGroup;
      p->curGroup = h;
      Type inner;
      bool ok = ResolveNamedKind(parts[pos], inner);
      p->curGroup = saved;
      if (ok) {
        ++pos;
        inner.head = h + "::" + parts[pos - 1];
        inner.text = JoinFrom(parts, start, pos);
        if (inner.cls && !inner.cls->tparams.empty()) {
          for (size_t k = 0; k < inner.cls->tparams.size(); ++k) {
            const Type* a = ParseTypeParts(parts, pos, strict); if (!a) return nullptr; inner.args.push_back(a);
          }
          inner.text = JoinFrom(parts, start, pos);
        }
        return Intern(std::move(inner));
      }
    }
    if (!IsPlainName(h) || !ResolveNamedKind(h, t)) {
      if (strict) {
        std::string m = "I don't know the kind " + h + ".";
        Bad(m + " Kinds look like num, txt, vec@num, or a class's name.");
      }
      return nullptr;
    }
    if (t.cls && !t.cls->tparams.empty()) {
      for (size_t k = 0; k < t.cls->tparams.size() && pos < parts.size(); ++k) {
        const Type* a = ParseTypeParts(parts, pos, strict); if (!a) return nullptr; t.args.push_back(a);
      }
    }
    t.text = JoinFrom(parts, start, pos);
  }
  return Intern(std::move(t));
}
static std::vector<std::string> SplitAt(const std::string& s) {
  std::vector<std::string> parts;
  std::string cur;
  for (char c : s) { if (c == '@') { parts.push_back(cur); cur.clear(); } else cur += c; }
  parts.push_back(cur);
  return parts;
}
const Type* ParseType(const std::string& text) {
  auto parts = SplitAt(text);
  size_t pos = 0;
  const Type* t = ParseTypeParts(parts, pos, true);
  if (pos < parts.size()) Bad("I don't know what " + parts[pos] + " is doing at the end of the kind " + text + ".");
  return t;
}
const Type* TryParseType(const std::string& text) {
  if (text.empty() || !IsNameStart(text[0])) return nullptr;
  for (char c : text) if (!(IsNameChar(c) || c == '@')) return nullptr;
  auto parts = SplitAt(text);
  for (auto& x : parts) if (x.empty()) return nullptr;
  size_t pos = 0;
  const Type* t = nullptr;
  int saved = g_line;
  bool ok = CatchProblem([&] { t = ParseTypeParts(parts, pos, false); });
  g_line = saved;
  if (!ok || !t || pos != parts.size()) return nullptr;
  return t;
}
bool LooksLikeType(const std::string& text) { return TryParseType(text) != nullptr; }

void InitTypes() {
  static bool done = false;
  if (done) return;
  done = true;
  TY_NUM = ParseType("num"); TY_BIG = ParseType("big"); TY_DEC = ParseType("dec"); TY_FLO = ParseType("flo");
  TY_TXT = ParseType("txt"); TY_LTR = ParseType("ltr"); TY_YNO = ParseType("yno"); TY_ANY = ParseType("any");
  TY_NOW = ParseType("now"); TY_HUG = ParseType("hug"); TY_CPX = ParseType("cpx"); TY_JSN = ParseType("jsn");
  TY_BYT = ParseType("byt"); TY_PBG = ParseType("pbg"); TY_EXN = ParseType("exn");
}

// ------------------------------------------------------------------ values in a word
struct WordParser {
  const std::string& w;
  size_t i = 0;
  explicit WordParser(const std::string& s) : w(s) {}
  bool AtEnd() const { return i >= w.size(); }
  char Peek(size_t o = 0) const { return i + o < w.size() ? w[i + o] : '\0'; }

  static ExprP Make(E k) { auto e = std::make_unique<Expr>(); e->k = k; return e; }

  ExprP ParseList() {
    std::vector<ExprP> items;
    items.push_back(ParseItem());
    while (!AtEnd() && Peek() == '&' && Peek(1) != '&') {
      ++i;
      if (AtEnd()) Bad("There is an & with nothing after it in " + w + ".");
      items.push_back(ParseItem());
    }
    if (!AtEnd()) {
      if (Peek() == '&' ) Bad("There is an & with nothing after it in " + w + ".");
      Bad("I can't read " + w.substr(i) + " in " + w + ".");
    }
    if (items.size() == 1) return std::move(items[0]);
    auto l = Make(E::List);
    l->kids = std::move(items);
    return l;
  }
  // the rest of the word after a call's & becomes its values
  void ParseArgsInto(Expr* call) {
    if (AtEnd()) { call->trailingCall = true; return; }
    call->kids.push_back(ParseItem());
    while (!AtEnd() && Peek() == '&' && Peek(1) != '&') {
      ++i;
      if (AtEnd()) Bad("There is an & with nothing after it in " + w + ".");
      call->kids.push_back(ParseItem());
    }
  }
  ExprP ParseItem() { return ParseBin(0); }

  // C++ precedence: || && == != < <= > >= + - * / %
  static int Prec(const std::string& op) {
    if (op == "||") return 1;
    if (op == "&&") return 2;
    if (op == "==" || op == "!=") return 3;
    if (op == "<" || op == "<=" || op == ">" || op == ">=") return 4;
    if (op == "+" || op == "-") return 5;
    if (op == "*" || op == "/" || op == "%") return 6;
    return 0;
  }
  std::string PeekOp() const {
    char a = Peek(), b = Peek(1);
    if (a == '|' && b == '|') return "||";
    if (a == '&' && b == '&') return "&&";
    if (a == '=' && b == '=') return "==";
    if (a == '!' && b == '=') return "!=";
    if (a == '<' && b == '=') return "<=";
    if (a == '>' && b == '=') return ">=";
    if (a == '<' && b == '<') return "<<";
    if (a == '>' && b == '>') return ">>";
    if (a == '-' && b == '>') return "->";
    if (a == '<' || a == '>' || a == '+' || a == '-' || a == '*' || a == '/' || a == '%') return std::string(1, a);
    if (a == '=') return "=";
    if (a == '|') return "|";
    if (a == '^') return "^";
    return "";
  }
  ExprP ParseBin(int minPrec) {
    ExprP left = ParseUnary();
    for (;;) {
      if (AtEnd()) break;
      std::string op = PeekOp();
      if (op == "<<") Bad("<< is written with a root in English++: bits asl 2.");
      if (op == ">>") Bad(">> is written with a root in English++: bits asr 2.");
      if (op == "->") Bad("English++ has no ->. Use @ to reach inside something: p@speed.");
      if (op == "=") Bad("To compare, use ==. To give a name a value, use the root is: x is 5.");
      if (op == "|" || op == "^") Bad(op + " is written with a root in English++: bits aor 2, bits axr 2.");
      int p = Prec(op);
      if (p == 0 || p <= minPrec) break;
      i += op.size();
      if (AtEnd()) Bad("A value is missing at the end of " + w + ".");
      ExprP right = ParseBin(p);
      if (p == 4 && left->k == E::Binary && Prec(left->s) == 4)
        Bad("Compare one pair at a time. a<b<c doesn't do what it looks like: write a<b&&b<c.");
      auto b = Make(E::Binary);
      b->s = op;
      b->kids.push_back(std::move(left));
      b->kids.push_back(std::move(right));
      left = std::move(b);
    }
    return left;
  }
  ExprP ParseUnary() {
    if (AtEnd()) Bad("A value is missing at the end of " + w + ".");
    char c = Peek();
    if (c == '!' && Peek(1) != '=') { ++i; auto u = Make(E::Unary); u->s = "!"; u->kids.push_back(ParseUnary()); return u; }
    if (c == '-') {
      ++i;
      if (IsDigit(Peek())) {  // a negative number literal
        ExprP n = ParsePrimaryAndPostfix();
        if (n->k == E::Int) { n->i = -n->i; if (n->i < INT32_MIN) n->ik = IK_BIG; return n; }
        if (n->k == E::Dbl) { n->d = -n->d; return n; }
        auto u = Make(E::Unary); u->s = "-"; u->kids.push_back(std::move(n)); return u;
      }
      auto u = Make(E::Unary); u->s = "-"; u->kids.push_back(ParseUnary()); return u;
    }
    if (c == '*') { ++i; auto u = Make(E::Deref); u->kids.push_back(ParseUnary()); return u; }
    return ParsePrimaryAndPostfix();
  }
  std::string ReadName() {
    size_t s = i;
    while (!AtEnd() && IsNameChar(Peek())) ++i;
    return w.substr(s, i - s);
  }
  ExprP ParsePrimaryAndPostfix() {
    ExprP e = ParsePrimary();
    for (;;) {
      if (AtEnd()) break;
      if (Peek() == '@') {
        ++i;
        auto at = Make(E::At);
        if (IsDigit(Peek())) {
          size_t s = i; while (!AtEnd() && IsDigit(Peek())) ++i;
          auto idx = Make(E::Int); idx->i = std::stoll(w.substr(s, i - s)); at->kids.push_back(std::move(e)); at->kids.push_back(std::move(idx));
          at->s = "";
        } else if (Peek() == '"') {
          auto lit = ParseString();
          at->kids.push_back(std::move(e)); at->kids.push_back(std::move(lit)); at->s = "";
        } else if (IsNameStart(Peek())) {
          std::string n = ReadName();
          at->s = n; at->id = NameId(n);
          at->kids.push_back(std::move(e));
        } else {
          Bad("@ needs a name or a number after it in " + w + ".");
        }
        e = std::move(at);
        continue;
      }
      if (Peek() == '&' && Peek(1) != '&' && IsCallable(e.get())) {
        ++i;
        auto call = Make(E::Call);
        call->kids.push_back(std::move(e));
        ParseArgsInto(call.get());
        return call;
      }
      break;
    }
    return e;
  }
  bool IsCallable(const Expr* e) const {
    Program* p = g_prog;
    if (e->k == E::Kind) return true;
    if (e->k == E::Name) {
      const std::string& n = e->s;
      if (IsValueWord(n)) return true;
      if (IsKindHead(n)) return true;
      if (!p) return false;
      if (p->IsCallableName(n)) return true;
      return false;
    }
    if (e->k == E::At) {
      if (e->s.empty()) return false;
      if (p && p->IsMethodName(e->s)) return true;
      // group@function, Class@static, a kind like ptr@Dog
      const Expr* root = e;
      while (root->k == E::At) root = root->kids[0].get();
      if (root->k == E::Name && p && (p->groups.count(root->s) || p->classes.count(root->s))) return true;
      return false;
    }
    return false;
  }
  ExprP ParseString() {
    // i at opening quote
    size_t s = i;
    ++i;
    std::string raw;
    while (!AtEnd() && Peek() != '"') {
      if (Peek() == '\\' && i + 1 < w.size()) { raw += w[i]; raw += w[i + 1]; i += 2; continue; }
      raw += w[i++];
    }
    if (AtEnd()) Bad("I couldn't find the end of the text in quotes.");
    ++i;
    (void)s;
    return MakeStringExpr(raw);
  }
  static std::string Unescape(const std::string& raw, size_t a, size_t b) {
    std::string out;
    for (size_t k = a; k < b; ++k) {
      char c = raw[k];
      if (c == '\\' && k + 1 < b) {
        char d = raw[++k];
        switch (d) {
          case 'n': out += '\n'; break;
          case 't': out += '\t'; break;
          case 'r': out += '\r'; break;
          case '0': out += '\0'; break;
          case '\\': out += '\\'; break;
          case '"': out += '"'; break;
          case '\'': out += '\''; break;
          default: out += '\\'; out += d; break;
        }
      } else out += c;
    }
    return out;
  }
  static ExprP MakeStringExpr(const std::string& raw) {
    // "@name" fills in a value; "@@" is an @
    bool hasAt = raw.find('@') != std::string::npos;
    if (!hasAt) { auto e = Make(E::Str); e->s = Unescape(raw, 0, raw.size()); return e; }
    auto e = Make(E::Interp);
    std::string lit;
    size_t k = 0;
    auto flush = [&] {
      if (!lit.empty()) { auto s = Make(E::Str); s->s = Unescape(lit, 0, lit.size()); e->kids.push_back(std::move(s)); lit.clear(); }
    };
    while (k < raw.size()) {
      char c = raw[k];
      if (c == '\\' && k + 1 < raw.size()) { lit += c; lit += raw[k + 1]; k += 2; continue; }
      if (c == '@') {
        if (k + 1 < raw.size() && raw[k + 1] == '@') { lit += '@'; k += 2; continue; }
        if (k + 1 < raw.size() && IsNameStart(raw[k + 1])) {
          flush();
          size_t s = k + 1, j = s;
          while (j < raw.size() && IsNameChar(raw[j])) ++j;
          ExprP cur = Make(E::Name);
          cur->s = raw.substr(s, j - s); cur->id = NameId(cur->s);
          while (j + 1 < raw.size() && raw[j] == '@' && (IsNameStart(raw[j + 1]) || IsDigit(raw[j + 1]))) {
            size_t a = j + 1, b = a;
            auto at = Make(E::At);
            if (IsDigit(raw[a])) {
              while (b < raw.size() && IsDigit(raw[b])) ++b;
              auto idx = Make(E::Int); idx->i = std::stoll(raw.substr(a, b - a));
              at->kids.push_back(std::move(cur)); at->kids.push_back(std::move(idx));
            } else {
              while (b < raw.size() && IsNameChar(raw[b])) ++b;
              at->s = raw.substr(a, b - a); at->id = NameId(at->s);
              at->kids.push_back(std::move(cur));
            }
            cur = std::move(at);
            j = b;
          }
          e->kids.push_back(std::move(cur));
          k = j;
          continue;
        }
        lit += '@'; ++k; continue;
      }
      lit += c; ++k;
    }
    flush();
    return e;
  }
  ExprP ParsePrimary() {
    char c = Peek();
    if (c == '"') return ParseString();
    if (c == '\'') {
      ++i;
      char ch;
      if (Peek() == '\\') {
        ++i; char d = Peek(); ++i;
        ch = d == 'n' ? '\n' : d == 't' ? '\t' : d == '0' ? '\0' : d;
      } else { ch = Peek(); ++i; }
      if (Peek() != '\'') Bad("A letter is one character in single quotes, like 'a'.");
      ++i;
      auto e = Make(E::Chr); e->i = (unsigned char)ch; return e;
    }
    if (IsDigit(c)) {
      size_t s = i;
      while (!AtEnd() && IsDigit(Peek())) ++i;
      bool dec = false;
      if (Peek() == '.' && IsDigit(Peek(1))) { dec = true; ++i; while (!AtEnd() && IsDigit(Peek())) ++i; }
      if (Peek() == 'e' && (IsDigit(Peek(1)) || ((Peek(1) == '-' || Peek(1) == '+') && IsDigit(Peek(2))))) {
        dec = true; i += 2; while (!AtEnd() && IsDigit(Peek())) ++i;
      }
      std::string num = w.substr(s, i - s);
      if (!AtEnd() && IsNameStart(Peek())) Bad("A name starts with a letter, so " + num + w.substr(i) + " can't be a name.");
      if (dec) { auto e = Make(E::Dbl); e->d = std::stod(num); return e; }
      auto e = Make(E::Int);
      // whole numbers: num if it fits, big if not, pbg past the biggest big
      unsigned long long u = 0; bool over = false;
      for (char d : num) { unsigned long long nu = u * 10 + (d - '0'); if (nu / 10 != u) over = true; u = nu; }
      if (over || num.size() > 20) Bad("The number " + num + " is too big. A hug holds whole numbers of any size: x is hug&\"" + num + "\".");
      e->i = (int64_t)u;
      if (u > 9223372036854775807ULL) e->ik = IK_PBG;
      else if (u > 2147483647ULL) e->ik = IK_BIG;
      else e->ik = IK_NUM;
      return e;
    }
    if (IsNameStart(c)) {
      size_t s = i;
      std::string n = ReadName();
      if (n == "yes" || n == "nay") { auto e = Make(E::Bool); e->i = n == "yes"; return e; }
      if (n == "nil") return Make(E::Nil);
      if (n == "now") return Make(E::Now);
      // a kind with parts: vec@txt& , ptr@Dog&p , map@txt@num& , Box@num
      bool kindHead = IsCollectionHead(n) || (g_prog && g_prog->classes.count(n) && !g_prog->classes[n]->tparams.empty());
      if (kindHead && Peek() == '@') {
        size_t save = i;
        // read the longest @-chain of names that is a kind
        size_t j = i;
        std::string best; size_t bestEnd = 0;
        std::string acc = n;
        while (j < w.size() && w[j] == '@') {
          size_t a = j + 1, b = a;
          while (b < w.size() && IsNameChar(w[b])) ++b;
          if (b == a) break;
          acc += "@" + w.substr(a, b - a);
          j = b;
          if (TryParseType(acc)) { best = acc; bestEnd = j; }
        }
        if (!best.empty()) {
          i = bestEnd;
          auto e = Make(E::Kind); e->s = best; e->type = ParseType(best);
          return e;
        }
        i = save;
      }
      (void)s;
      auto e = Make(E::Name); e->s = n; e->id = NameId(n);
      return e;
    }
    if (c == '&') Bad("There is an & with nothing before it in " + w + ".");
    if (c == '@') Bad("@ reaches inside something, so it needs a name before it: rex@name.");
    Bad("I can't read " + w.substr(i) + " in " + w + ".");
  }
};

ExprP ParseValue(const std::string& word) {
  if (word.empty()) Bad("A value is missing here.");
  WordParser p(word);
  return p.ParseList();
}

// ------------------------------------------------------------------ program
FuncInfo* ClassInfo::findMethod(const std::string& n) {
  auto it = methods.find(n);
  if (it != methods.end()) return it->second;
  for (auto* p : parents) if (FuncInfo* f = p->findMethod(n)) return f;
  return nullptr;
}
FuncInfo* ClassInfo::findOp(const std::string& n) {
  auto it = ops.find(n);
  if (it != ops.end()) return it->second;
  for (auto* p : parents) if (FuncInfo* f = p->findOp(n)) return f;
  return nullptr;
}
bool ClassInfo::isA(const ClassInfo* other) const {
  if (this == other) return true;
  for (auto* p : parents) if (p->isA(other)) return true;
  return false;
}
bool ClassInfo::hasDtorDeep() {
  if (dtor) return true;
  for (auto* p : parents) if (p->hasDtorDeep()) return true;
  for (auto& f : own) if (f.type && f.type->cls && f.type->cls != this && f.type->cls->hasDtorDeep()) return true;
  return false;
}
bool ClassInfo::hasVirtual() {
  for (auto& m : methods) if (m.second->root == "dvr" || m.second->root == "dmb" || m.second->root == "dov") return true;
  for (auto* p : parents) if (p->hasVirtual()) return true;
  return false;
}
Value* ClassInfo::findStatic(int id) {
  for (auto& s : statics) if (s.first == id) return &s.second;
  for (auto* p : parents) if (Value* v = p->findStatic(id)) return v;
  return nullptr;
}

bool Program::IsCallableName(const std::string& n) const {
  if (callables.count(n)) return true;
  if (!curGroup.empty() && callables.count(curGroup + "::" + n)) return true;
  if (classes.count(n) || funcs.count(n)) return true;
  if (!curGroup.empty() && (classes.count(curGroup + "::" + n) || funcs.count(curGroup + "::" + n))) return true;
  if (nativeCallable && nativeCallable(n)) return true;
  return false;
}
bool Program::IsMethodName(const std::string& n) const {
  static const std::set<std::string> builtin = {"top","front","back","first","second","value","value_or","use_count","real","imag",
      "load","get","size","text","what","port","next","line","close","wait","notify_one","notify_all","join","empty","dump"};
  return methodNames.count(n) || builtin.count(n) || groupFuncNames.count(n);
}

static int IndentOf(const std::string& line, int lineNo) {
  int n = 0;
  for (char c : line) {
    if (c == ' ') ++n;
    else if (c == '\t') { g_line = lineNo; Bad("Indent with two spaces, not a tab."); }
    else break;
  }
  return n;
}

// Splits the source into lines with their three words.
std::vector<SrcLine> ReadLines(const std::string& src, const std::string& file) {
  std::vector<SrcLine> out;
  std::istringstream in(src);
  std::string raw;
  int no = 0;
  while (std::getline(in, raw)) {
    ++no;
    if (!raw.empty() && raw.back() == '\r') raw.pop_back();
    SrcLine L;
    L.number = no; L.file = file; L.text = raw;
    size_t first = raw.find_first_not_of(" \t");
    if (first == std::string::npos) { L.blank = true; out.push_back(L); continue; }
    g_line = no; g_file = file;
    L.indent = IndentOf(raw, no);
    std::string body = raw.substr(first);
    if (body.rfind("note", 0) == 0 && (body.size() == 4 || body[4] == ' ')) { L.note = true; out.push_back(L); continue; }
    if (L.indent % 2 != 0) Bad("Indent with two spaces for each step. This line has " + std::to_string(L.indent) + ".");
    auto words = SplitWords(body);
    if (words.size() != 3) Bad(WordCountMessage(words));
    L.who = words[0]; L.root = words[1]; L.what = words[2];
    out.push_back(L);
  }
  return out;
}

}  // namespace epp
