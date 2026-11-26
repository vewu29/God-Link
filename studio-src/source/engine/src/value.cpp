// value.cpp — values, kinds, copying, printing, comparing, huge numbers.
#include "eh.h"
#include <cmath>
#include <cstdio>
#include <cstring>
#include <algorithm>

namespace epp {

Value VInt(int64_t v, uint8_t ik) { Value r; r.k = K::Int; r.ik = ik; r.i = NormInt(v, ik); return r; }
Value VDbl(double v, uint8_t fk) { Value r; r.k = K::Dbl; r.ik = fk; r.d = fk ? (double)(float)v : v; return r; }
Value VBool(bool b) { Value r; r.k = K::Bool; r.i = b; return r; }
Value VChr(char c) { Value r; r.k = K::Chr; r.i = (unsigned char)c; return r; }
Value VStr(std::string s) { Value r; r.k = K::Str; r.s = std::move(s); return r; }
Value VVoid() { Value r; r.k = K::Void; return r; }
Value VNil() { Value r; r.k = K::Nil; return r; }

int64_t NormInt(int64_t v, uint8_t ik) {
  switch (ik) {
    case IK_NUM: return (int32_t)(uint32_t)(uint64_t)v;
    case IK_SML: return (int16_t)(uint16_t)(uint64_t)v;
    case IK_POS: return (int64_t)(uint32_t)(uint64_t)v;
    case IK_BYT: return (int64_t)(uint8_t)(uint64_t)v;
    default: return v;
  }
}
uint8_t IkOf(const Type* t) {
  if (!t) return IK_NUM;
  const std::string& h = t->head;
  if (h == "big") return IK_BIG;
  if (h == "sml") return IK_SML;
  if (h == "pos") return IK_POS;
  if (h == "byt") return IK_BYT;
  if (h == "pbg") return IK_PBG;
  return IK_NUM;
}
bool IsIntType(const Type* t) {
  if (!t) return false;
  const std::string& h = t->head;
  return h == "num" || h == "big" || h == "sml" || h == "pos" || h == "byt" || h == "pbg";
}

// ---------------------------------------------------------------- huge numbers
static const uint32_t BASE = 1000000000u;
static void Trim(HugObj& h) { while (!h.d.empty() && h.d.back() == 0) h.d.pop_back(); if (h.d.empty()) h.neg = false; }
std::shared_ptr<HugObj> HugFromInt(long long v) {
  auto h = std::make_shared<HugObj>();
  unsigned long long u;
  if (v < 0) { h->neg = true; u = (unsigned long long)(-(v + 1)) + 1; } else u = (unsigned long long)v;
  while (u) { h->d.push_back((uint32_t)(u % BASE)); u /= BASE; }
  return h;
}
std::shared_ptr<HugObj> HugFromText(const std::string& s0) {
  std::string s = s0;
  auto h = std::make_shared<HugObj>();
  size_t st = 0;
  if (!s.empty() && (s[0] == '-' || s[0] == '+')) { h->neg = s[0] == '-'; st = 1; }
  if (st >= s.size()) ThrowStd("invalid hug text: " + s0);
  for (size_t k = st; k < s.size(); ++k) if (s[k] < '0' || s[k] > '9') ThrowStd("invalid hug text: " + s0);
  for (long long e = (long long)s.size(); e > (long long)st; e -= 9) {
    long long b = std::max((long long)st, e - 9);
    h->d.push_back((uint32_t)std::stoul(s.substr(b, e - b)));
  }
  Trim(*h);
  return h;
}
std::string HugText(const HugObj& h) {
  if (h.d.empty()) return "0";
  std::string r = h.neg ? "-" : "";
  r += std::to_string(h.d.back());
  char buf[16];
  for (long long k = (long long)h.d.size() - 2; k >= 0; --k) { snprintf(buf, sizeof buf, "%09u", h.d[k]); r += buf; }
  return r;
}
static int CmpAbs(const HugObj& a, const HugObj& b) {
  if (a.d.size() != b.d.size()) return a.d.size() < b.d.size() ? -1 : 1;
  for (long long k = (long long)a.d.size() - 1; k >= 0; --k) if (a.d[k] != b.d[k]) return a.d[k] < b.d[k] ? -1 : 1;
  return 0;
}
int HugCmp(const HugObj& a, const HugObj& b) {
  if (a.neg != b.neg) return a.neg ? -1 : 1;
  int c = CmpAbs(a, b);
  return a.neg ? -c : c;
}
static void AddAbs(const HugObj& a, const HugObj& b, HugObj& r) {
  r.d.assign(std::max(a.d.size(), b.d.size()) + 1, 0);
  uint64_t carry = 0;
  for (size_t k = 0; k < r.d.size(); ++k) {
    uint64_t s = carry + (k < a.d.size() ? a.d[k] : 0) + (k < b.d.size() ? b.d[k] : 0);
    r.d[k] = (uint32_t)(s % BASE); carry = s / BASE;
  }
}
static void SubAbs(const HugObj& a, const HugObj& b, HugObj& r) {  // |a| >= |b|
  r.d.assign(a.d.size(), 0);
  int64_t borrow = 0;
  for (size_t k = 0; k < a.d.size(); ++k) {
    int64_t s = (int64_t)a.d[k] - borrow - (k < b.d.size() ? b.d[k] : 0);
    if (s < 0) { s += BASE; borrow = 1; } else borrow = 0;
    r.d[k] = (uint32_t)s;
  }
}
std::shared_ptr<HugObj> HugAdd(const HugObj& a, const HugObj& b, bool sub) {
  auto r = std::make_shared<HugObj>();
  bool bneg = sub ? !b.neg : b.neg;
  if (a.neg == bneg) { AddAbs(a, b, *r); r->neg = a.neg; }
  else if (CmpAbs(a, b) >= 0) { SubAbs(a, b, *r); r->neg = a.neg; }
  else { SubAbs(b, a, *r); r->neg = bneg; }
  Trim(*r);
  return r;
}
std::shared_ptr<HugObj> HugMul(const HugObj& a, const HugObj& b) {
  auto r = std::make_shared<HugObj>();
  std::vector<uint64_t> t(a.d.size() + b.d.size() + 1, 0);
  for (size_t x = 0; x < a.d.size(); ++x) {
    uint64_t carry = 0;
    for (size_t y = 0; y < b.d.size() || carry; ++y) {
      uint64_t cur = t[x + y] + carry + (y < b.d.size() ? (uint64_t)a.d[x] * b.d[y] : 0);
      t[x + y] = cur % BASE; carry = cur / BASE;
    }
  }
  for (auto v : t) r->d.push_back((uint32_t)v);
  r->neg = a.neg != b.neg;
  Trim(*r);
  return r;
}
// division by a small number (fits in 32 bits); returns remainder
static uint32_t DivSmall(HugObj& a, uint32_t m) {
  uint64_t rem = 0;
  for (long long k = (long long)a.d.size() - 1; k >= 0; --k) {
    uint64_t cur = a.d[k] + rem * BASE;
    a.d[k] = (uint32_t)(cur / m); rem = cur % m;
  }
  Trim(a);
  return (uint32_t)rem;
}
std::shared_ptr<HugObj> HugDiv(const HugObj& a, const HugObj& b, bool mod) {
  if (b.d.empty()) Bad("I can't divide by zero.");
  if (b.d.size() == 1) {
    auto q = std::make_shared<HugObj>(a);
    uint32_t r = DivSmall(*q, b.d[0]);
    q->neg = a.neg != b.neg; Trim(*q);
    if (mod) { auto rr = HugFromInt(r); rr->neg = a.neg && r; return rr; }
    return q;
  }
  // long division, digit by digit in base 10 (slow but fine for teaching sizes)
  std::string as = HugText(a), bs = HugText(b);
  if (as[0] == '-') as = as.substr(1);
  if (bs[0] == '-') bs = bs.substr(1);
  HugObj babs = b; babs.neg = false;
  auto cur = std::make_shared<HugObj>();
  std::string q;
  for (char c : as) {
    auto ten = HugFromInt(10);
    cur = HugMul(*cur, *ten);
    cur = HugAdd(*cur, *HugFromInt(c - '0'), false);
    int dgt = 0;
    while (CmpAbs(*cur, babs) >= 0) { cur = HugAdd(*cur, babs, true); ++dgt; }
    q += (char)('0' + dgt);
  }
  if (mod) { cur->neg = a.neg && !cur->d.empty(); return cur; }
  size_t nz = q.find_first_not_of('0');
  auto r = HugFromText(nz == std::string::npos ? "0" : q.substr(nz));
  r->neg = (a.neg != b.neg) && !r->d.empty();
  return r;
}
double HugToDouble(const HugObj& h) {
  double r = 0;
  for (long long k = (long long)h.d.size() - 1; k >= 0; --k) r = r * BASE + h.d[k];
  return h.neg ? -r : r;
}
Value VHug(std::shared_ptr<HugObj> h) { Value r; r.k = K::Hug; r.h = std::move(h); r.t = TY_HUG; return r; }
const HugObj& AsHug(const Value& v, std::shared_ptr<HugObj>& keep) {
  if (v.k == K::Hug) return *static_cast<HugObj*>(v.h.get());
  if (v.k == K::Int) { keep = v.ik == IK_PBG ? HugFromText(std::to_string((unsigned long long)v.i)) : HugFromInt(v.i); return *keep; }
  if (v.k == K::Dbl) { keep = HugFromInt((long long)v.d); return *keep; }
  if (v.k == K::Bool || v.k == K::Chr) { keep = HugFromInt(v.i); return *keep; }
  Bad("I can't use " + KindWords(v) + " as a whole number of any size.");
}

// ---------------------------------------------------------------- printing
std::string FormatDouble(double d) {
  // like std::cout's default: 6 significant digits
  if (std::isnan(d)) return std::signbit(d) ? "-nan" : "nan";
  if (std::isinf(d)) return d < 0 ? "-inf" : "inf";
  char buf[64];
  snprintf(buf, sizeof buf, "%g", d);
  return buf;
}
std::string IntText(const Value& v) {
  if (v.ik == IK_PBG) return std::to_string((unsigned long long)v.i);
  return std::to_string(v.i);
}

static void JsonDump(const Value& v, std::string& out);
static void JsonEsc(const std::string& s, std::string& out) {
  out += '"';
  for (unsigned char c : s) {
    switch (c) {
      case '"': out += "\\\""; break;
      case '\\': out += "\\\\"; break;
      case '\n': out += "\\n"; break;
      case '\t': out += "\\t"; break;
      case '\r': out += "\\r"; break;
      case '\b': out += "\\b"; break;
      case '\f': out += "\\f"; break;
      default:
        if (c < 0x20) { char b[8]; snprintf(b, sizeof b, "\\u%04x", c); out += b; }
        else out += (char)c;
    }
  }
  out += '"';
}
static void JsonDump(const Value& v, std::string& out) {
  if (v.k != K::Json) {
    switch (v.k) {
      case K::Int: out += IntText(v); return;
      case K::Dbl: out += FormatDouble(v.d); return;
      case K::Bool: out += v.i ? "true" : "false"; return;
      case K::Str: JsonEsc(v.s, out); return;
      default: out += "null"; return;
    }
  }
  auto* j = static_cast<JsonObj*>(v.h.get());
  switch (j->jk) {
    case JsonObj::Null: out += "null"; break;
    case JsonObj::Bool: out += j->b ? "true" : "false"; break;
    case JsonObj::Num:
      if (j->isInt) { char b[32]; snprintf(b, sizeof b, "%lld", (long long)j->n); out += b; }
      else { char b[40]; snprintf(b, sizeof b, "%.17g", j->n); out += b; }
      break;
    case JsonObj::Str: JsonEsc(j->s, out); break;
    case JsonObj::Arr: {
      out += '[';
      for (size_t k = 0; k < j->a.size(); ++k) { if (k) out += ','; JsonDump(j->a[k], out); }
      out += ']';
      break;
    }
    case JsonObj::Ob: {
      std::vector<const std::pair<std::string, Value>*> items;
      for (auto& m : j->o) items.push_back(&m);
      std::sort(items.begin(), items.end(), [](auto* a, auto* b) { return a->first < b->first; });
      out += '{';
      for (size_t k = 0; k < items.size(); ++k) { if (k) out += ','; JsonEsc(items[k]->first, out); out += ':'; JsonDump(items[k]->second, out); }
      out += '}';
      break;
    }
  }
}
std::string JsonText(const Value& v) { std::string s; JsonDump(v, s); return s; }

std::string Show(const Value& v, int depth) {
  if (depth > 60) return "...";
  switch (v.k) {
    case K::Nil: return "nil";
    case K::Void: return "";
    case K::Int: return IntText(v);
    case K::Dbl: return FormatDouble(v.d);
    case K::Bool: return v.i ? "yes" : "nay";
    case K::Chr: return std::string(1, (char)v.i);
    case K::Str: return v.s;
    case K::Hug: return HugText(*static_cast<HugObj*>(v.h.get()));
    case K::Cpx: {
      auto c = static_cast<CpxObj*>(v.h.get())->c;
      return "(" + FormatDouble(c.real()) + "," + FormatDouble(c.imag()) + ")";
    }
    case K::Enum: {
      if (v.t && v.t->en && v.i >= 0 && v.i < (int64_t)v.t->en->names.size()) return v.t->en->names[v.i];
      return std::to_string(v.i);
    }
    case K::Json: return JsonText(v);
    case K::Exn: return v.s;
    case K::Coll: {
      auto* c = static_cast<Coll*>(v.h.get());
      std::string h = v.t ? v.t->head : "vec";
      if (h == "map" || h == "hsh") {
        std::string r = "{";
        bool first = true;
        if (h == "hsh") {
          for (auto& key : c->order) { auto it = c->m.find(key); if (it == c->m.end()) continue; if (!first) r += ", "; first = false; r += Show(key, depth + 1) + ": " + Show(it->second, depth + 1); }
        } else {
          for (auto& kv : c->m) { if (!first) r += ", "; first = false; r += Show(kv.first, depth + 1) + ": " + Show(kv.second, depth + 1); }
        }
        return r + "}";
      }
      if (h == "set" || h == "bag") {
        std::string r = "{";
        bool first = true;
        if (h == "bag") { for (auto& key : c->order) { if (!first) r += ", "; first = false; r += Show(key, depth + 1); } }
        else for (auto& kv : c->m) { if (!first) r += ", "; first = false; r += Show(kv.first, depth + 1); }
        return r + "}";
      }
      std::string r = "[";
      for (size_t k = 0; k < c->items.size(); ++k) { if (k) r += ", "; r += Show(c->items[k], depth + 1); }
      return r + "]";
    }
    case K::Tup: {
      auto* t = static_cast<TupObj*>(v.h.get());
      std::string r = "(";
      for (size_t k = 0; k < t->items.size(); ++k) { if (k) r += ", "; r += Show(t->items[k], depth + 1); }
      return r + ")";
    }
    case K::Obj: {
      auto* o = static_cast<Obj*>(v.h.get());
      std::string r = o->cls->name + "(";
      bool first = true;
      for (size_t k = 0; k < o->cls->all.size(); ++k) {
        auto& fi = o->cls->all[k].first->own[o->cls->all[k].second];
        if (fi.vis != 0) continue;
        if (!first) r += ", ";
        first = false;
        r += fi.name + ": " + Show(o->f[k], depth + 1);
      }
      return r + ")";
    }
    case K::Ptr: {
      char b[32]; snprintf(b, sizeof b, "0x%llx", (unsigned long long)(uintptr_t)v.tgt); return b;
    }
    case K::Func: return "function";
    case K::Native: return NativeShow(v);
    case K::Stream: return "file";
    case K::Handle: return static_cast<HandleObj*>(v.h.get())->what;
    case K::Gen: return "generator";
  }
  return "?";
}

std::string KindWords(const Value& v) {
  if (v.t && v.t != TY_ANY && v.t->head != "opt" && v.t->head != "alt") return KindName(v.t);
  switch (v.k) {
    case K::Nil: return "nil";
    case K::Void: return "nothing";
    case K::Int: return v.ik == IK_BIG ? "a big whole number" : v.ik == IK_PBG ? "a big positive whole number" : v.ik == IK_BYT ? "a byte" : v.ik == IK_SML ? "a small whole number" : v.ik == IK_POS ? "a positive whole number" : "a whole number";
    case K::Dbl: return v.ik ? "a small decimal" : "a decimal";
    case K::Bool: return "a yes or no";
    case K::Chr: return "a letter";
    case K::Str: return "a text";
    case K::Coll: return "a collection";
    case K::Tup: return "a tuple";
    case K::Obj: return "a " + static_cast<Obj*>(v.h.get())->cls->name;
    case K::Ptr: return "a pointer";
    case K::Func: return "a function";
    case K::Enum: return "an enum value";
    case K::Hug: return "a whole number of any size";
    case K::Cpx: return "a complex number";
    case K::Json: return "a JSON value";
    default: return "something";
  }
}
std::string KindName(const Type* t) {
  static std::map<std::string, std::string> says = {
    {"num","a whole number"},{"big","a big whole number"},{"sml","a small whole number"},{"pos","a positive whole number"},
    {"byt","a byte"},{"pbg","a big positive whole number"},{"hug","a whole number of any size"},{"dec","a decimal"},
    {"flo","a small decimal"},{"cpx","a complex number"},{"txt","a text"},{"ltr","a letter"},{"yno","a yes or no"},
    {"vec","a vector"},{"lst","a linked list"},{"dqu","a deque"},{"arr","an array"},{"stk","a stack"},{"que","a queue"},
    {"hep","a priority queue"},{"mhp","a priority queue"},{"map","a map"},{"hsh","a hash map"},{"set","a set"},{"bag","a hash set"},
    {"par","a pair"},{"tup","a tuple"},{"opt","a maybe-value"},{"alt","one of several kinds"},{"own","an owned pointer"},
    {"shr","a shared pointer"},{"ptr","a pointer"},{"fun","a function"},{"jsn","a JSON value"},{"ifs","a file to read"},{"ofs","a file to write"}};
  if (!t) return "something";
  auto it = says.find(t->head);
  if (it != says.end()) return it->second;
  if (t->cls) return "a " + t->cls->name;
  if (t->en) return "a " + t->en->name;
  return t->text;
}

// ---------------------------------------------------------------- comparing
static int Rank(const Value& v) {
  switch (v.k) {
    case K::Int: case K::Dbl: case K::Bool: case K::Chr: case K::Hug: case K::Enum: return 0;
    case K::Str: return 1;
    default: return 2 + (int)v.k;
  }
}
int Compare(const Value& a, const Value& b) {
  if ((a.k == K::Int || a.k == K::Bool || a.k == K::Chr || a.k == K::Enum) && (b.k == K::Int || b.k == K::Bool || b.k == K::Chr || b.k == K::Enum)) {
    if (a.k == K::Int && b.k == K::Int && (a.ik == IK_PBG || b.ik == IK_PBG)) {
      unsigned long long x = (unsigned long long)a.i, y = (unsigned long long)b.i;
      return x < y ? -1 : x > y ? 1 : 0;
    }
    return a.i < b.i ? -1 : a.i > b.i ? 1 : 0;
  }
  if (a.k == K::Hug || b.k == K::Hug) {
    std::shared_ptr<HugObj> k1, k2;
    return HugCmp(AsHug(a, k1), AsHug(b, k2));
  }
  if (Rank(a) == 0 && Rank(b) == 0) {
    double x = a.k == K::Dbl ? a.d : (double)a.i, y = b.k == K::Dbl ? b.d : (double)b.i;
    return x < y ? -1 : x > y ? 1 : 0;
  }
  if (a.k == K::Str && b.k == K::Str) { int c = a.s.compare(b.s); return c < 0 ? -1 : c > 0 ? 1 : 0; }
  if (a.k != b.k) return Rank(a) < Rank(b) ? -1 : Rank(a) > Rank(b) ? 1 : 0;
  switch (a.k) {
    case K::Nil: case K::Void: return 0;
    case K::Coll: {
      auto* x = static_cast<Coll*>(a.h.get()); auto* y = static_cast<Coll*>(b.h.get());
      if (!x->m.empty() || !y->m.empty()) {
        auto i1 = x->m.begin(), i2 = y->m.begin();
        for (; i1 != x->m.end() && i2 != y->m.end(); ++i1, ++i2) {
          int c = Compare(i1->first, i2->first); if (c) return c;
          c = Compare(i1->second, i2->second); if (c) return c;
        }
        return x->m.size() < y->m.size() ? -1 : x->m.size() > y->m.size() ? 1 : 0;
      }
      size_t n = std::min(x->items.size(), y->items.size());
      for (size_t k = 0; k < n; ++k) { int c = Compare(x->items[k], y->items[k]); if (c) return c; }
      return x->items.size() < y->items.size() ? -1 : x->items.size() > y->items.size() ? 1 : 0;
    }
    case K::Tup: {
      auto* x = static_cast<TupObj*>(a.h.get()); auto* y = static_cast<TupObj*>(b.h.get());
      size_t n = std::min(x->items.size(), y->items.size());
      for (size_t k = 0; k < n; ++k) { int c = Compare(x->items[k], y->items[k]); if (c) return c; }
      return x->items.size() < y->items.size() ? -1 : x->items.size() > y->items.size() ? 1 : 0;
    }
    case K::Obj: return g_interp->CompareObjects(a, b);
    case K::Ptr: return a.tgt < b.tgt ? -1 : a.tgt > b.tgt ? 1 : 0;
    case K::Cpx: {
      auto x = static_cast<CpxObj*>(a.h.get())->c, y = static_cast<CpxObj*>(b.h.get())->c;
      if (x == y) return 0;
      return std::abs(x) < std::abs(y) ? -1 : 1;
    }
    case K::Json: { std::string x = JsonText(a), y = JsonText(b); return x < y ? -1 : x > y ? 1 : 0; }
    case K::Native: {
      auto* x = static_cast<NativeObj*>(a.h.get()); auto* y = static_cast<NativeObj*>(b.h.get());
      return x->bytes < y->bytes ? -1 : x->bytes > y->bytes ? 1 : 0;
    }
    default: return a.h.get() < b.h.get() ? -1 : a.h.get() > b.h.get() ? 1 : 0;
  }
}
bool ValueLess::operator()(const Value& a, const Value& b) const { return Compare(a, b) < 0; }
bool Equal(const Value& a, const Value& b) {
  if (a.k == K::Nil || b.k == K::Nil) {
    auto isNil = [](const Value& v) { return v.k == K::Nil; };
    return isNil(a) == isNil(b);
  }
  if (a.k == K::Obj && b.k == K::Obj) return g_interp->EqualObjects(a, b);
  if (a.k == K::Cpx && b.k == K::Cpx) return static_cast<CpxObj*>(a.h.get())->c == static_cast<CpxObj*>(b.h.get())->c;
  return Compare(a, b) == 0;
}

// ---------------------------------------------------------------- copying (C++ copies values)
Value DeepCopy(const Value& v) {
  switch (v.k) {
    case K::Coll: {
      Value r = v;
      auto c = std::make_shared<Coll>(*static_cast<Coll*>(v.h.get()));
      for (auto& x : c->items) x = DeepCopy(x);
      for (auto& kv : c->m) kv.second = DeepCopy(kv.second);
      r.h = c;
      return r;
    }
    case K::Tup: {
      Value r = v;
      auto t = std::make_shared<TupObj>(*static_cast<TupObj*>(v.h.get()));
      for (auto& x : t->items) x = DeepCopy(x);
      r.h = t;
      return r;
    }
    case K::Obj: {
      Value r = v;
      auto o = std::make_shared<Obj>(*static_cast<Obj*>(v.h.get()));
      o->destroyed = false;
      for (auto& x : o->f) x = DeepCopy(x);
      r.h = o;
      return r;
    }
    case K::Json: {
      Value r = v;
      auto j = std::make_shared<JsonObj>(*static_cast<JsonObj*>(v.h.get()));
      for (auto& x : j->a) x = DeepCopy(x);
      for (auto& m : j->o) m.second = DeepCopy(m.second);
      r.h = j;
      return r;
    }
    case K::Native: {
      Value r = v;
      r.h = std::make_shared<NativeObj>(*static_cast<NativeObj*>(v.h.get()));
      return r;
    }
    case K::Ptr:
      if (v.ik == PK_REF) return DeepCopy(*v.tgt);
      return v;
    default: return v;
  }
}

// ---------------------------------------------------------------- making things of a kind
Value MakeColl(const Type* t) {
  Value r; r.k = K::Coll; r.t = t;
  auto c = std::make_shared<Coll>();
  if (t && t->head == "arr") for (long long k = 0; k < t->n; ++k) c->items.push_back(DefaultOf(t->args[0]));
  r.h = c;
  return r;
}
Value DefaultOf(const Type* t) {
  if (!t || t->param) { Value v = VInt(0); return v; }
  const std::string& h = t->head;
  Value v;
  if (IsIntType(t)) v = VInt(0, IkOf(t));
  else if (h == "dec") v = VDbl(0);
  else if (h == "flo") v = VDbl(0, 1);
  else if (h == "txt") v = VStr("");
  else if (h == "ltr") v = VChr('\0');
  else if (h == "yno") v = VBool(false);
  else if (h == "hug") v = VHug(HugFromInt(0));
  else if (h == "cpx") { v.k = K::Cpx; v.h = std::make_shared<CpxObj>(); }
  else if (h == "jsn") { v.k = K::Json; v.h = std::make_shared<JsonObj>(); }
  else if (h == "vec" || h == "lst" || h == "dqu" || h == "arr" || h == "stk" || h == "que" || h == "hep" || h == "mhp" ||
           h == "map" || h == "hsh" || h == "set" || h == "bag" || h == "chn")
    v = MakeColl(t);
  else if (h == "par" || h == "tup") {
    v.k = K::Tup;
    auto tp = std::make_shared<TupObj>();
    for (auto* a : t->args) tp->items.push_back(DefaultOf(a));
    v.h = tp;
  }
  else if (h == "opt" || h == "own" || h == "shr" || h == "ptr" || h == "fun") v = VNil();
  else if (h == "alt") v = t->args.empty() ? VNil() : DefaultOf(t->args[0]);
  else if (h == "atm") v = DefaultOf(t->args[0]);
  else if (h == "ifs" || h == "ofs") { v.k = K::Stream; auto s = std::make_shared<StreamObj>(); s->out = h == "ofs"; v.h = s; }
  else if (h == "mtx" || h == "cnd" || h == "thd" || h == "fut" || h == "gnr") {
    v.k = K::Handle; auto hd = std::make_shared<HandleObj>(); hd->what = h; v.h = hd;
  }
  else if (h == "srv" || h == "sck" || h == "cln") NotYet("Talking to other computers (" + h + ")");
  else if (t->cls) v = g_interp->Construct(t, {}, nullptr);
  else if (t->en) { v.k = K::Enum; v.i = 0; }
  else if (t->nat) v = NativeDefault(t->nat);
  else if (h == "any") v = VInt(0);
  else if (h == "now") v = VVoid();
  else if (h == "exn") { v.k = K::Exn; }
  else v = VNil();
  v.t = t;
  return v;
}

// Converts a value to the kind of the place it goes into, like C++ would.
Value Convert(const Value& v0, const Type* t) {
  if (!t || t->param || t == TY_ANY || t->head == "any") {
    if (v0.k == K::Ptr && v0.ik == PK_REF) return DeepCopy(*v0.tgt);
    return DeepCopy(v0);
  }
  const Value& v = (v0.k == K::Ptr && v0.ik == PK_REF) ? *v0.tgt : v0;
  const std::string& h = t->head;
  Value r;
  if (IsIntType(t)) {
    uint8_t ik = IkOf(t);
    switch (v.k) {
      case K::Int: r = VInt(v.i, ik); break;
      case K::Dbl:
        if (std::isnan(v.d) || std::isinf(v.d)) r = VInt(ik == IK_NUM ? INT32_MIN : 0, ik);
        else r = VInt((int64_t)v.d, ik);
        break;
      case K::Bool: case K::Chr: case K::Enum: r = VInt(v.i, ik); break;
      case K::Hug: r = VInt((int64_t)HugToDouble(*static_cast<HugObj*>(v.h.get())), ik); break;
      case K::Json: { auto* j = static_cast<JsonObj*>(v.h.get()); if (j->jk != JsonObj::Num && j->jk != JsonObj::Bool) ThrowStd("type must be number, but is " + JsonTypeName(*j)); r = VInt(j->jk == JsonObj::Bool ? j->b : (int64_t)j->n, ik); break; }
      default: Bad("I can't put " + KindWords(v) + " in " + KindName(t) + ".");
    }
  } else if (h == "dec" || h == "flo") {
    uint8_t fk = h == "flo";
    switch (v.k) {
      case K::Int: r = VDbl(v.ik == IK_PBG ? (double)(unsigned long long)v.i : (double)v.i, fk); break;
      case K::Dbl: r = VDbl(v.d, fk); break;
      case K::Bool: case K::Chr: r = VDbl((double)v.i, fk); break;
      case K::Hug: r = VDbl(HugToDouble(*static_cast<HugObj*>(v.h.get())), fk); break;
      case K::Json: { auto* j = static_cast<JsonObj*>(v.h.get()); if (j->jk != JsonObj::Num) ThrowStd("type must be number, but is " + JsonTypeName(*j)); r = VDbl(j->n, fk); break; }
      default: Bad("I can't put " + KindWords(v) + " in " + KindName(t) + ".");
    }
  } else if (h == "txt") {
    if (v.k == K::Str) r = v;
    else if (v.k == K::Chr) r = VStr(std::string(1, (char)v.i));
    else if (v.k == K::Json) { auto* j = static_cast<JsonObj*>(v.h.get()); if (j->jk != JsonObj::Str) ThrowStd("type must be string, but is " + JsonTypeName(*j)); r = VStr(j->s); }
    else Bad("I can't put " + KindWords(v) + " in a text. Turn it into text first: txt&x.");
  } else if (h == "ltr") {
    if (v.k == K::Chr) r = v;
    else if (v.k == K::Int || v.k == K::Bool) r = VChr((char)v.i);
    else if (v.k == K::Dbl) r = VChr((char)(int)v.d);
    else Bad("I can't put " + KindWords(v) + " in a letter.");
  } else if (h == "yno") {
    if (v.k == K::Bool) r = v;
    else if (v.k == K::Int || v.k == K::Chr) r = VBool(v.i != 0);
    else if (v.k == K::Dbl) r = VBool(v.d != 0);
    else if (v.k == K::Ptr) r = VBool(true);
    else if (v.k == K::Nil) r = VBool(false);
    else if (v.k == K::Json) { auto* j = static_cast<JsonObj*>(v.h.get()); r = VBool(j->jk == JsonObj::Bool ? j->b : j->n != 0); }
    else Bad("I can't put " + KindWords(v) + " in a yes or no.");
  } else if (h == "hug") {
    std::shared_ptr<HugObj> keep;
    if (v.k == K::Hug) r = v;
    else { const HugObj& x = AsHug(v, keep); r = VHug(std::make_shared<HugObj>(x)); }
  } else if (h == "cpx") {
    if (v.k == K::Cpx) r = DeepCopy(v);
    else { r.k = K::Cpx; auto c = std::make_shared<CpxObj>(); c->c = {v.k == K::Dbl ? v.d : (double)v.i, 0}; r.h = c; }
  } else if (h == "jsn") {
    r = ToJson(v);
  } else if (h == "opt") {
    if (v.k == K::Nil) r = VNil();
    else r = Convert(v, t->args[0]);
  } else if (h == "alt") {
    // keep the value as the first kind it already is
    r = DeepCopy(v);
    for (auto* a : t->args) {
      bool fits = (v.k == K::Int && IsIntType(a)) || (v.k == K::Dbl && (a->head == "dec" || a->head == "flo")) ||
                  (v.k == K::Str && a->head == "txt") || (v.k == K::Bool && a->head == "yno") || (v.k == K::Chr && a->head == "ltr") ||
                  (v.k == K::Obj && a->cls);
      if (fits) { r = Convert(v, a); break; }
    }
  } else if (h == "own" || h == "shr" || h == "ptr") {
    if (v.k == K::Nil || v.k == K::Ptr) r = v;
    else if (v.k == K::Int && v.i == 0) r = VNil();
    else Bad("I can't put " + KindWords(v) + " in " + KindName(t) + ". A pointer holds where something is: p mpt x.");
  } else if (h == "fun") {
    if (v.k == K::Func || v.k == K::Nil) r = v;
    else if (v.k == K::Obj) r = v;
    else Bad("I can't put " + KindWords(v) + " in a function name.");
  } else if (h == "par" || h == "tup") {
    if (v.k == K::Tup) {
      auto* src = static_cast<TupObj*>(v.h.get());
      auto tp = std::make_shared<TupObj>();
      for (size_t k = 0; k < src->items.size(); ++k) tp->items.push_back(Convert(src->items[k], k < t->args.size() ? t->args[k] : nullptr));
      r.k = K::Tup; r.h = tp;
    } else if (v.k == K::Coll) {
      auto* src = static_cast<Coll*>(v.h.get());
      auto tp = std::make_shared<TupObj>();
      for (size_t k = 0; k < src->items.size(); ++k) tp->items.push_back(Convert(src->items[k], k < t->args.size() ? t->args[k] : nullptr));
      r.k = K::Tup; r.h = tp;
    } else Bad("I can't put " + KindWords(v) + " in " + KindName(t) + ".");
  } else if (IsCollectionHead(h) && h != "atm" && h != "fut" && h != "gnr" && h != "ref" && h != "see" && h != "tkn") {
    if (v.k == K::Coll) {
      auto* src = static_cast<Coll*>(v.h.get());
      std::string sh = v.t ? v.t->head : "vec";
      r = MakeColl(t);
      auto* dst = static_cast<Coll*>(r.h.get());
      bool dstMap = h == "map" || h == "hsh", dstSet = h == "set" || h == "bag";
      const Type* et = t->args.empty() ? nullptr : t->args[0];
      if (h == "arr") dst->items.clear();
      if (dstMap) {
        for (auto& kv : src->m) { Value key = Convert(kv.first, t->args[0]); dst->m[key] = Convert(kv.second, t->args[1]); if (h == "hsh") dst->order.push_back(key); }
        if (sh == "hsh") { dst->order.clear(); for (auto& key : src->order) dst->order.push_back(Convert(key, t->args[0])); }
      } else if (dstSet) {
        auto add = [&](const Value& x) { Value key = Convert(x, et); if (!dst->m.count(key)) { dst->m[key] = Value(); if (h == "bag") dst->order.push_back(key); } };
        if (sh == "set" || sh == "bag") { if (sh == "bag") for (auto& x : src->order) add(x); else for (auto& kv : src->m) add(kv.first); }
        else for (auto& x : src->items) add(x);
      } else {
        for (auto& x : src->items) dst->items.push_back(Convert(x, et));
        if (h == "arr") { while ((long long)dst->items.size() < t->n) dst->items.push_back(DefaultOf(et)); dst->items.resize(t->n); }
        if (h == "hep" || h == "mhp") g_interp->HeapFix(r);
      }
      r.t = t;
      return r;
    }
    if (h == "chn" && v.k == K::Coll) return v;
    // one value given to a list: a list of one
    if (v.k != K::Nil && v.k != K::Void) {
      r = MakeColl(t);
      static_cast<Coll*>(r.h.get())->items.push_back(Convert(v, t->args.empty() ? nullptr : t->args[0]));
      r.t = t;
      return r;
    }
    Bad("I can't put " + KindWords(v) + " in " + KindName(t) + ".");
  } else if (h == "atm") {
    r = Convert(v, t->args[0]);
  } else if (t->cls) {
    if (v.k == K::Obj) {
      auto* o = static_cast<Obj*>(v.h.get());
      if (!o->cls->isA(t->cls) && !t->cls->isA(o->cls)) Bad("I can't put " + KindWords(v) + " in " + KindName(t) + ".");
      r = DeepCopy(v);
      if (o->cls != t->cls && o->cls->isA(t->cls)) {   // C++ slices a child into its parent
        auto* no = static_cast<Obj*>(r.h.get());
        Value sliced = g_interp->Construct(t, {}, nullptr, true);
        auto* so = static_cast<Obj*>(sliced.h.get());
        for (size_t k = 0; k < t->cls->all.size(); ++k) {
          auto& fi = t->cls->all[k].first->own[t->cls->all[k].second];
          auto it = no->cls->fieldIndex.find(fi.id);
          if (it != no->cls->fieldIndex.end()) so->f[k] = no->f[it->second];
        }
        r = sliced;
      }
    } else if (v.k == K::Coll && t->cls) {
      r = g_interp->Construct(t, static_cast<Coll*>(v.h.get())->items, nullptr);
    } else {
      r = g_interp->Construct(t, {v}, nullptr);
    }
  } else if (t->en) {
    if (v.k == K::Enum) r = v;
    else if (v.k == K::Int) { r.k = K::Enum; r.i = v.i; }
    else Bad("I can't put " + KindWords(v) + " in " + KindName(t) + ".");
  } else if (t->nat) {
    r = NativeConvert(v, t->nat);
  } else if (h == "ifs" || h == "ofs" || h == "mtx" || h == "cnd" || h == "thd" || h == "fut" || h == "exn" || h == "gnr") {
    r = v;
  } else {
    r = DeepCopy(v);
  }
  r.t = t;
  return r;
}

// ---------------------------------------------------------------- JSON
std::string JsonTypeName(const JsonObj& j) {
  switch (j.jk) {
    case JsonObj::Null: return "null";
    case JsonObj::Bool: return "boolean";
    case JsonObj::Num: return "number";
    case JsonObj::Str: return "string";
    case JsonObj::Arr: return "array";
    case JsonObj::Ob: return "object";
  }
  return "?";
}
Value MakeJson(std::shared_ptr<JsonObj> j) { Value v; v.k = K::Json; v.h = std::move(j); v.t = TY_JSN; return v; }
Value ToJson(const Value& v) {
  if (v.k == K::Json) return DeepCopy(v);
  auto j = std::make_shared<JsonObj>();
  switch (v.k) {
    case K::Nil: break;
    case K::Bool: j->jk = JsonObj::Bool; j->b = v.i; break;
    case K::Int: j->jk = JsonObj::Num; j->n = (double)v.i; j->isInt = true; break;
    case K::Dbl: j->jk = JsonObj::Num; j->n = v.d; break;
    case K::Chr: j->jk = JsonObj::Num; j->n = (double)v.i; j->isInt = true; break;
    case K::Str: j->jk = JsonObj::Str; j->s = v.s; break;
    case K::Coll: {
      auto* c = static_cast<Coll*>(v.h.get());
      std::string h = v.t ? v.t->head : "vec";
      if (h == "map" || h == "hsh") { j->jk = JsonObj::Ob; for (auto& kv : c->m) j->o.push_back({Show(kv.first, 0), ToJson(kv.second)}); }
      else { j->jk = JsonObj::Arr; for (auto& x : c->items) j->a.push_back(ToJson(x)); }
      break;
    }
    default: Bad("I can't turn " + KindWords(v) + " into JSON.");
  }
  return MakeJson(j);
}
struct JsonReader {
  const std::string& s; size_t i = 0;
  explicit JsonReader(const std::string& t) : s(t) {}
  [[noreturn]] void Fail(const std::string& what) {
    ThrowStd("[json.exception.parse_error.101] parse error at byte " + std::to_string(i + 1) + ": syntax error - " + what);
  }
  void Ws() { while (i < s.size() && (s[i] == ' ' || s[i] == '\n' || s[i] == '\t' || s[i] == '\r')) ++i; }
  Value Read() {
    Ws();
    if (i >= s.size()) Fail("unexpected end of input");
    auto j = std::make_shared<JsonObj>();
    char c = s[i];
    if (c == '{') {
      ++i; j->jk = JsonObj::Ob; Ws();
      if (i < s.size() && s[i] == '}') { ++i; return MakeJson(j); }
      for (;;) {
        Ws(); if (i >= s.size() || s[i] != '"') Fail("expected a key");
        std::string key = Str();
        Ws(); if (i >= s.size() || s[i] != ':') Fail("expected ':'");
        ++i;
        Value v = Read();
        bool found = false;
        for (auto& m : j->o) if (m.first == key) { m.second = v; found = true; }
        if (!found) j->o.push_back({key, v});
        Ws();
        if (i < s.size() && s[i] == ',') { ++i; continue; }
        if (i < s.size() && s[i] == '}') { ++i; break; }
        Fail("expected ',' or '}'");
      }
      return MakeJson(j);
    }
    if (c == '[') {
      ++i; j->jk = JsonObj::Arr; Ws();
      if (i < s.size() && s[i] == ']') { ++i; return MakeJson(j); }
      for (;;) {
        j->a.push_back(Read());
        Ws();
        if (i < s.size() && s[i] == ',') { ++i; continue; }
        if (i < s.size() && s[i] == ']') { ++i; break; }
        Fail("expected ',' or ']'");
      }
      return MakeJson(j);
    }
    if (c == '"') { j->jk = JsonObj::Str; j->s = Str(); return MakeJson(j); }
    if (s.compare(i, 4, "true") == 0) { i += 4; j->jk = JsonObj::Bool; j->b = true; return MakeJson(j); }
    if (s.compare(i, 5, "false") == 0) { i += 5; j->jk = JsonObj::Bool; j->b = false; return MakeJson(j); }
    if (s.compare(i, 4, "null") == 0) { i += 4; return MakeJson(j); }
    if (c == '-' || (c >= '0' && c <= '9')) {
      size_t st = i; bool isInt = true;
      if (s[i] == '-') ++i;
      while (i < s.size() && (isdigit((unsigned char)s[i]) || s[i] == '.' || s[i] == 'e' || s[i] == 'E' || s[i] == '+' || s[i] == '-')) {
        if (s[i] == '.' || s[i] == 'e' || s[i] == 'E') isInt = false;
        ++i;
      }
      j->jk = JsonObj::Num; j->n = std::stod(s.substr(st, i - st)); j->isInt = isInt;
      return MakeJson(j);
    }
    Fail("invalid literal");
  }
  std::string Str() {
    ++i;
    std::string r;
    while (i < s.size() && s[i] != '"') {
      if (s[i] == '\\' && i + 1 < s.size()) {
        char d = s[++i];
        switch (d) {
          case 'n': r += '\n'; break; case 't': r += '\t'; break; case 'r': r += '\r'; break;
          case 'b': r += '\b'; break; case 'f': r += '\f'; break;
          case 'u': {
            unsigned cp = std::stoul(s.substr(i + 1, 4), nullptr, 16); i += 4;
            if (cp < 0x80) r += (char)cp;
            else if (cp < 0x800) { r += (char)(0xC0 | (cp >> 6)); r += (char)(0x80 | (cp & 63)); }
            else { r += (char)(0xE0 | (cp >> 12)); r += (char)(0x80 | ((cp >> 6) & 63)); r += (char)(0x80 | (cp & 63)); }
            break;
          }
          default: r += d;
        }
        ++i; continue;
      }
      r += s[i++];
    }
    if (i >= s.size()) Fail("unterminated string");
    ++i;
    return r;
  }
};
Value ParseJson(const std::string& text) {
  JsonReader r(text);
  Value v = r.Read();
  r.Ws();
  if (r.i != text.size()) r.Fail("unexpected trailing text");
  return v;
}

}  // namespace epp
