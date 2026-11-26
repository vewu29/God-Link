// words.cpp — the Chart's value words (cct&v, tuc&s, nsq&x, ...), each with one meaning.
#include "eh.h"
#include <cmath>
#include <algorithm>
#include <numeric>
#include <ctime>
#include <chrono>
#include <cstring>

namespace epp {

static Value P_(const Value& v) { return v.k == K::Ptr && v.ik == PK_REF ? *v.tgt : v; }
static Value MkInt(int64_t v, uint8_t ik = IK_NUM) {
  Value r = VInt(v, ik);
  r.t = ik == IK_BIG ? TY_BIG : ik == IK_PBG ? TY_PBG : TY_NUM;
  return r;
}
static Value MkDbl(double d) { Value r = VDbl(d); r.t = TY_DEC; return r; }
static Value MkStr(std::string s) { Value r = VStr(std::move(s)); r.t = TY_TXT; return r; }
static Value MkBool(bool b) { Value r = VBool(b); r.t = TY_YNO; return r; }

std::string ToText(const Value& v) { return Show(P_(v)); }
double ToDbl(const Value& v0) {
  Value v = P_(v0);
  switch (v.k) {
    case K::Dbl: return v.d;
    case K::Int: return v.ik == IK_PBG ? (double)(uint64_t)v.i : (double)v.i;
    case K::Bool: case K::Chr: case K::Enum: return (double)v.i;
    case K::Hug: return HugToDouble(*static_cast<HugObj*>(v.h.get()));
    case K::Json: { auto* j = static_cast<JsonObj*>(v.h.get()); if (j->jk == JsonObj::Num) return j->n; ThrowStd("type must be number, but is " + JsonTypeName(*j)); }
    default: Bad("This needs a number, but it is " + KindWords(v) + ".");
  }
}
int64_t ToInt(const Value& v0) {
  Value v = P_(v0);
  switch (v.k) {
    case K::Int: case K::Bool: case K::Chr: case K::Enum: return v.i;
    case K::Dbl: return (int64_t)v.d;
    case K::Json: { auto* j = static_cast<JsonObj*>(v.h.get()); if (j->jk == JsonObj::Num) return (int64_t)j->n; ThrowStd("type must be number, but is " + JsonTypeName(*j)); }
    default: Bad("This needs a whole number, but it is " + KindWords(v) + ".");
  }
}

// ------------------------------------------------------------------ SHA-256 and base 64
std::string Sha256(const std::string& msg) {
  static const uint32_t K[64] = {
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,
    0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,
    0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,
    0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2};
  uint32_t h[8] = {0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19};
  std::string m = msg;
  uint64_t bits = (uint64_t)msg.size() * 8;
  m += (char)0x80;
  while (m.size() % 64 != 56) m += (char)0;
  for (int k = 7; k >= 0; --k) m += (char)((bits >> (k * 8)) & 0xff);
  auto rotr = [](uint32_t x, int n) { return (x >> n) | (x << (32 - n)); };
  for (size_t off = 0; off < m.size(); off += 64) {
    uint32_t w[64];
    for (int k = 0; k < 16; ++k)
      w[k] = ((uint32_t)(uint8_t)m[off + k * 4] << 24) | ((uint32_t)(uint8_t)m[off + k * 4 + 1] << 16) | ((uint32_t)(uint8_t)m[off + k * 4 + 2] << 8) | (uint32_t)(uint8_t)m[off + k * 4 + 3];
    for (int k = 16; k < 64; ++k) {
      uint32_t s0 = rotr(w[k - 15], 7) ^ rotr(w[k - 15], 18) ^ (w[k - 15] >> 3);
      uint32_t s1 = rotr(w[k - 2], 17) ^ rotr(w[k - 2], 19) ^ (w[k - 2] >> 10);
      w[k] = w[k - 16] + s0 + w[k - 7] + s1;
    }
    uint32_t a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
    for (int k = 0; k < 64; ++k) {
      uint32_t S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      uint32_t ch = (e & f) ^ (~e & g);
      uint32_t t1 = hh + S1 + ch + K[k] + w[k];
      uint32_t S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      uint32_t mj = (a & b) ^ (a & c) ^ (b & c);
      uint32_t t2 = S0 + mj;
      hh = g; g = f; f = e; e = d + t1; d = c; c = b; b = a; a = t1 + t2;
    }
    h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e; h[5] += f; h[6] += g; h[7] += hh;
  }
  char buf[65];
  for (int k = 0; k < 8; ++k) snprintf(buf + k * 8, 9, "%08x", h[k]);
  return std::string(buf, 64);
}
static const char* B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
std::string Base64Enc(const std::string& s) {
  std::string out;
  size_t i = 0;
  while (i + 2 < s.size()) {
    uint32_t n = ((uint8_t)s[i] << 16) | ((uint8_t)s[i + 1] << 8) | (uint8_t)s[i + 2];
    out += B64[(n >> 18) & 63]; out += B64[(n >> 12) & 63]; out += B64[(n >> 6) & 63]; out += B64[n & 63];
    i += 3;
  }
  if (i + 1 == s.size()) { uint32_t n = (uint8_t)s[i] << 16; out += B64[(n >> 18) & 63]; out += B64[(n >> 12) & 63]; out += "=="; }
  else if (i + 2 == s.size()) { uint32_t n = ((uint8_t)s[i] << 16) | ((uint8_t)s[i + 1] << 8); out += B64[(n >> 18) & 63]; out += B64[(n >> 12) & 63]; out += B64[(n >> 6) & 63]; out += '='; }
  return out;
}
std::string Base64Dec(const std::string& s) {
  std::string out;
  uint32_t buf = 0; int bits = 0;
  for (char c : s) {
    const char* p = strchr(B64, c);
    if (c == '=' || !p || !c) { if (c == '=') break; continue; }
    buf = (buf << 6) | (uint32_t)(p - B64); bits += 6;
    if (bits >= 8) { bits -= 8; out += (char)((buf >> bits) & 0xff); }
  }
  return out;
}

// ------------------------------------------------------------------ tfa: "{} of {}", "{:.2f}", "{:>5}", "{:<5}"
static std::string Fixed(double d, int places) {
  char buf[512];
  snprintf(buf, sizeof buf, "%.*f", places, d);
  return buf;
}
std::string FillFormat(const std::string& fmt, const std::vector<Value>& args, size_t first) {
  std::string out;
  size_t next = first;
  for (size_t i = 0; i < fmt.size(); ++i) {
    char c = fmt[i];
    if (c == '{' && i + 1 < fmt.size() && fmt[i + 1] == '{') { out += '{'; ++i; continue; }
    if (c == '}' && i + 1 < fmt.size() && fmt[i + 1] == '}') { out += '}'; ++i; continue; }
    if (c != '{') { out += c; continue; }
    size_t e = fmt.find('}', i);
    if (e == std::string::npos) ThrowStd("format error: unmatched '{' in format string");
    std::string spec = fmt.substr(i + 1, e - i - 1);
    i = e;
    size_t colon = spec.find(':');
    std::string idx = colon == std::string::npos ? spec : spec.substr(0, colon);
    std::string fs = colon == std::string::npos ? "" : spec.substr(colon + 1);
    size_t which = idx.empty() ? next++ : first + (size_t)std::atoi(idx.c_str());
    if (which >= args.size()) ThrowStd("argument index out of range");
    Value v = P_(args[which]);
    // fill/align/width/.precision/type
    char fill = ' ', align = 0;
    size_t k = 0;
    if (fs.size() >= 2 && (fs[1] == '<' || fs[1] == '>' || fs[1] == '^')) { fill = fs[0]; align = fs[1]; k = 2; }
    else if (!fs.empty() && (fs[0] == '<' || fs[0] == '>' || fs[0] == '^')) { align = fs[0]; k = 1; }
    bool zero = false;
    if (k < fs.size() && fs[k] == '0') { zero = true; ++k; }
    int width = 0; while (k < fs.size() && isdigit((unsigned char)fs[k])) width = width * 10 + (fs[k++] - '0');
    int prec = -1; if (k < fs.size() && fs[k] == '.') { ++k; prec = 0; while (k < fs.size() && isdigit((unsigned char)fs[k])) prec = prec * 10 + (fs[k++] - '0'); }
    char type = k < fs.size() ? fs[k] : 0;
    std::string text;
    if (v.k == K::Dbl) {
      if (type == 'f' || type == 'F') text = Fixed(v.d, prec < 0 ? 6 : prec);
      else if (prec >= 0) { char buf[512]; snprintf(buf, sizeof buf, "%.*g", prec, v.d); text = buf; }
      else {
        // std::format's shortest round-trip form
        char buf[64];
        for (int p = 1; p <= 17; ++p) { snprintf(buf, sizeof buf, "%.*g", p, v.d); if (strtod(buf, nullptr) == v.d) break; }
        text = buf;
        if (text.find('e') != std::string::npos) {
          // 1e+20 style
        }
      }
    } else if (v.k == K::Int && (type == 'x' || type == 'X' || type == 'b' || type == 'o')) {
      uint64_t u = (uint64_t)v.i; if (v.ik == IK_NUM) u = (uint32_t)v.i;
      if (u == 0) text = "0";
      int base = type == 'b' ? 2 : type == 'o' ? 8 : 16;
      while (u) { int d = (int)(u % base); text.insert(text.begin(), (char)(d < 10 ? '0' + d : (type == 'X' ? 'A' : 'a') + d - 10)); u /= base; }
    } else if (v.k == K::Bool) text = v.i ? "true" : "false";
    else if (v.k == K::Str && prec >= 0) text = v.s.substr(0, (size_t)prec);
    else text = Show(v);
    bool numeric = v.k == K::Int || v.k == K::Dbl;
    if ((int)text.size() < width) {
      size_t pad = width - text.size();
      if (zero && numeric && !align) {
        size_t sign = (!text.empty() && (text[0] == '-' || text[0] == '+')) ? 1 : 0;
        text.insert(sign, pad, '0');
      } else {
        char al = align ? align : (numeric ? '>' : '<');
        if (al == '<') text += std::string(pad, fill);
        else if (al == '>') text = std::string(pad, fill) + text;
        else { size_t l = pad / 2; text = std::string(l, fill) + text + std::string(pad - l, fill); }
      }
    }
    out += text;
  }
  return out;
}

// ------------------------------------------------------------------ helpers
static Coll* AsColl(const Value& v, const std::string& word) {
  Value p = P_(v);
  if (p.k != K::Coll) Bad(word + " works on a collection, but this is " + KindWords(p) + ".");
  return static_cast<Coll*>(p.h.get());
}
static std::vector<Value> Items(const Value& v0, const std::string& word) {
  Value v = P_(v0);
  if (v.k == K::Str) { std::vector<Value> r; for (char c : v.s) { Value x = VChr(c); x.t = TY_LTR; r.push_back(x); } return r; }
  if (v.k == K::Gen) return static_cast<GenObj*>(v.h.get())->items;
  if (v.k == K::Json) return static_cast<JsonObj*>(v.h.get())->a;
  Coll* c = AsColl(v, word);
  std::string h = v.t ? v.t->head : "vec";
  if (h == "map" || h == "hsh" || h == "set" || h == "bag") {
    std::vector<Value> r;
    if (h == "set" || h == "bag") { if (h == "bag") return c->order; for (auto& kv : c->m) r.push_back(kv.first); return r; }
    Bad(word + " works on a list. For a map, use cky or cvl first.");
  }
  return c->items;
}
static const Type* ElemType(const Value& v) {
  Value p = P_(v);
  if (p.k == K::Str) return TY_LTR;
  if (p.t && !p.t->args.empty()) return p.t->args[0];
  return nullptr;
}
static Value ListOf(const Type* et, std::vector<Value> items) {
  Value v; v.k = K::Coll;
  auto c = std::make_shared<Coll>();
  c->items = std::move(items);
  v.h = c;
  if (!et && !c->items.empty()) et = c->items[0].t;
  v.t = ParseType("vec@" + (et ? et->text : std::string("num")));
  for (auto& x : c->items) if (!x.t) x.t = et;
  return v;
}
static void NeedArgs(const std::string& w, std::vector<Value>& a, size_t lo, size_t hi, const char* ex) {
  if (a.size() < lo || a.size() > hi) {
    if (lo == 0 && hi == 0) Bad(w + " takes no values.");
    Bad(w + " takes " + std::to_string(lo) + (lo == 1 ? " value" : " values") + ": " + ex + ".");
  }
}
static bool IsText(const Value& v) { return P_(v).k == K::Str; }
static const std::chrono::steady_clock::time_point g_start = std::chrono::steady_clock::now();

static std::tm NowTm() { std::time_t t = std::time(nullptr); std::tm r; localtime_r(&t, &r); return r; }

// ------------------------------------------------------------------ the words
Value CallWord(Interp& I, const std::string& w, std::vector<Value>& a) {
  for (auto& x : a) x = P_(x);
  // ---- c: collections
  if (w == "cct") { NeedArgs(w, a, 1, 1, "cct&scores"); Value v = a[0]; if (v.k == K::Str) return MkInt((int64_t)v.s.size()); Coll* c = AsColl(v, w); std::string h = v.t ? v.t->head : ""; return MkInt((int64_t)((h == "map" || h == "hsh" || h == "set" || h == "bag") ? c->m.size() : c->items.size())); }
  if (w == "csm" || w == "cpd") {
    NeedArgs(w, a, 1, 1, "csm&scores");
    auto it = Items(a[0], w);
    const Type* et = ElemType(a[0]);
    Value acc = Convert(VInt(w == "csm" ? 0 : 1), et ? et : TY_NUM);
    for (auto& x : it) acc = Convert(I.Binary(w == "csm" ? "+" : "*", acc, x), et ? et : TY_NUM);
    acc.t = et ? et : TY_NUM;
    return acc;
  }
  if (w == "cmx" || w == "cmn") {
    NeedArgs(w, a, 1, 1, "cmx&scores");
    auto it = Items(a[0], w);
    if (it.empty()) Bad(w + " needs at least one thing, and the collection is empty.");
    size_t best = 0;
    for (size_t k = 1; k < it.size(); ++k) {
      int c = Compare(it[k], it[best]);
      if (w == "cmx" ? c > 0 : c < 0) best = k;
    }
    return it[best];
  }
  if (w == "cav" || w == "cme" || w == "cde") {
    NeedArgs(w, a, 1, 1, "cav&scores");
    auto it = Items(a[0], w);
    if (it.empty()) return MkDbl(0);
    std::vector<double> d; for (auto& x : it) d.push_back(ToDbl(x));
    double sum = 0; for (double x : d) sum += x;
    double mean = sum / d.size();
    if (w == "cav") return MkDbl(mean);
    if (w == "cme") { std::sort(d.begin(), d.end()); size_t n = d.size(); return MkDbl(n % 2 ? d[n / 2] : (d[n / 2 - 1] + d[n / 2]) / 2); }
    double ss = 0; for (double x : d) ss += (x - mean) * (x - mean);
    return MkDbl(std::sqrt(ss / d.size()));
  }
  if (w == "cps") { NeedArgs(w, a, 2, 2, "cps&scores&7"); auto it = Items(a[0], w); for (size_t k = 0; k < it.size(); ++k) if (Equal(it[k], a[1])) return MkInt((int64_t)k); return MkInt(-1); }
  if (w == "chs") {
    NeedArgs(w, a, 2, 2, "chs&scores&7");
    Value v = a[0];
    if (v.k == K::Str) { if (a[1].k == K::Chr) return MkBool(v.s.find((char)a[1].i) != std::string::npos); return MkBool(v.s.find(ToText(a[1])) != std::string::npos); }
    if (v.k == K::Coll) {
      std::string h = v.t ? v.t->head : "";
      Coll* c = AsColl(v, w);
      if (h == "map" || h == "hsh" || h == "set" || h == "bag") return MkBool(c->m.count(Convert(a[1], v.t->args[0])) > 0);
    }
    for (auto& x : Items(v, w)) if (Equal(x, a[1])) return MkBool(true);
    return MkBool(false);
  }
  if (w == "chm") { NeedArgs(w, a, 2, 2, "chm&scores&7"); int64_t n = 0; for (auto& x : Items(a[0], w)) if (Equal(x, a[1])) ++n; return MkInt(n); }
  if (w == "cfr" || w == "cla") { NeedArgs(w, a, 1, 1, "cfr&scores"); auto it = Items(a[0], w); if (it.empty()) Bad(w + " needs at least one thing, and the collection is empty."); return w == "cfr" ? it.front() : it.back(); }
  if (w == "cky" || w == "cvl") {
    NeedArgs(w, a, 1, 1, "cky&ages");
    Value v = a[0]; Coll* c = AsColl(v, w);
    std::string h = v.t ? v.t->head : "";
    if (h != "map" && h != "hsh") Bad(w + " works on a map.");
    std::vector<Value> out;
    if (h == "hsh") { for (auto& k : c->order) out.push_back(w == "cky" ? k : c->m[k]); }
    else for (auto& kv : c->m) out.push_back(w == "cky" ? kv.first : kv.second);
    return ListOf(v.t->args[w == "cky" ? 0 : 1], out);
  }
  if (w == "cso" || w == "crv") {
    NeedArgs(w, a, 1, 1, "cso&scores");
    if (a[0].k == K::Str) { std::string s = a[0].s; if (w == "cso") std::sort(s.begin(), s.end()); else std::reverse(s.begin(), s.end()); return MkStr(s); }
    auto it = Items(a[0], w);
    if (w == "cso") std::sort(it.begin(), it.end(), [&](const Value& x, const Value& y) { if (x.k == K::Obj) return I.Truth(I.Binary("<", x, y)); return Compare(x, y) < 0; });
    else std::reverse(it.begin(), it.end());
    Value r = ListOf(ElemType(a[0]), it);
    if (a[0].k == K::Coll && a[0].t && a[0].t->head != "set") r.t = a[0].t;
    return r;
  }
  if (w == "cft" || w == "cmp" || w == "cea" || w == "can" || w == "cnn") {
    NeedArgs(w, a, 2, 2, "cft&scores&big");
    auto it = Items(a[0], w);
    std::vector<Value> out;
    const Type* rt = nullptr;
    for (auto& x : it) {
      Value r = I.CallValue(a[1], {x});
      if (w == "cmp") { if (!rt) rt = r.t; out.push_back(r); continue; }
      bool pass = I.Truth(r);
      if (w == "cft" && pass) out.push_back(x);
      if (w == "cea" && !pass) return MkBool(false);
      if (w == "can" && pass) return MkBool(true);
      if (w == "cnn" && pass) return MkBool(false);
    }
    if (w == "cea") return MkBool(true);
    if (w == "can") return MkBool(false);
    if (w == "cnn") return MkBool(true);
    if (w == "cmp") return ListOf(rt, out);
    Value r = ListOf(ElemType(a[0]), out);
    if (a[0].k == K::Coll && a[0].t && (a[0].t->head == "vec" || a[0].t->head == "lst")) r.t = a[0].t;
    return r;
  }
  if (w == "ctx") {
    NeedArgs(w, a, 2, 2, "ctx&names&\", \"");
    std::string sep = ToText(a[1]), out;
    auto it = Items(a[0], w);
    for (size_t k = 0; k < it.size(); ++k) { if (k) out += sep; out += Show(it[k]); }
    return MkStr(out);
  }
  if (w == "cra") { NeedArgs(w, a, 1, 1, "cra&cards"); auto it = Items(a[0], w); if (it.empty()) Bad("cra needs at least one thing, and the collection is empty."); return it[(size_t)I.RandomInt(0, (int64_t)it.size() - 1)]; }
  if (w == "crl") {
    NeedArgs(w, a, 3, 3, "crl&scores&0&plus");
    Value acc = a[1];
    for (auto& x : Items(a[0], w)) { Value r = I.CallValue(a[2], {acc, x}); acc = a[1].t ? Convert(r, a[1].t) : r; }
    return acc;
  }
  if (w == "czp") {
    NeedArgs(w, a, 2, 2, "czp&names&ages");
    auto x = Items(a[0], w), y = Items(a[1], w);
    const Type* tx = ElemType(a[0]); const Type* ty = ElemType(a[1]);
    const Type* pt = ParseType("par@" + (tx ? tx->text : std::string("num")) + "@" + (ty ? ty->text : std::string("num")));
    std::vector<Value> out;
    for (size_t k = 0; k < x.size() && k < y.size(); ++k) {
      Value p; p.k = K::Tup; auto t = std::make_shared<TupObj>(); t->items = {x[k], y[k]}; p.h = t; p.t = pt; out.push_back(p);
    }
    return ListOf(pt, out);
  }
  if (w == "cnu") {
    NeedArgs(w, a, 1, 1, "cnu&names");
    auto x = Items(a[0], w);
    const Type* tx = ElemType(a[0]);
    const Type* pt = ParseType("par@num@" + (tx ? tx->text : std::string("num")));
    std::vector<Value> out;
    for (size_t k = 0; k < x.size(); ++k) {
      Value p; p.k = K::Tup; auto t = std::make_shared<TupObj>(); t->items = {MkInt((int64_t)k), x[k]}; p.h = t; p.t = pt; out.push_back(p);
    }
    return ListOf(pt, out);
  }
  if (w == "cun" || w == "cbt" || w == "cot") {
    NeedArgs(w, a, 2, 2, "cun&a&b");
    auto x = Items(a[0], w), y = Items(a[1], w);
    auto less = [](const Value& p, const Value& q) { return Compare(p, q) < 0; };
    std::sort(x.begin(), x.end(), less); std::sort(y.begin(), y.end(), less);
    x.erase(std::unique(x.begin(), x.end(), [](const Value& p, const Value& q) { return Equal(p, q); }), x.end());
    y.erase(std::unique(y.begin(), y.end(), [](const Value& p, const Value& q) { return Equal(p, q); }), y.end());
    std::vector<Value> out;
    if (w == "cun") std::set_union(x.begin(), x.end(), y.begin(), y.end(), std::back_inserter(out), less);
    else if (w == "cbt") std::set_intersection(x.begin(), x.end(), y.begin(), y.end(), std::back_inserter(out), less);
    else std::set_difference(x.begin(), x.end(), y.begin(), y.end(), std::back_inserter(out), less);
    return ListOf(ElemType(a[0]), out);
  }
  if (w == "ccu") {
    NeedArgs(w, a, 2, 3, "ccu&scores&1&2");
    auto x = Items(a[0], w);
    int64_t s = ToInt(a[1]);
    int64_t n = a.size() > 2 ? ToInt(a[2]) : (int64_t)x.size() - s;
    if (s < 0 || s > (int64_t)x.size()) Bad("ccu starts at " + std::to_string(s) + ", but the collection has " + std::to_string(x.size()) + " things.");
    if (s + n > (int64_t)x.size()) n = (int64_t)x.size() - s;
    std::vector<Value> out(x.begin() + s, x.begin() + s + n);
    Value r = ListOf(ElemType(a[0]), out);
    if (a[0].k == K::Coll && a[0].t) r.t = a[0].t->head == "arr" ? ParseType("vec@" + a[0].t->args[0]->text) : a[0].t;
    return r;
  }
  if (w == "cbf" || w == "cpb") {
    NeedArgs(w, a, 2, 2, "cbf&sorted&7");
    auto x = Items(a[0], w);
    auto it = std::lower_bound(x.begin(), x.end(), a[1], [](const Value& p, const Value& q) { return Compare(p, q) < 0; });
    if (w == "cbf") return MkBool(it != x.end() && Equal(*it, a[1]));
    return MkInt((int64_t)(it - x.begin()));
  }
  if (w == "cgr") {
    NeedArgs(w, a, 2, 2, "cgr&words&first_letter");
    auto x = Items(a[0], w);
    Value m; m.k = K::Coll; auto c = std::make_shared<Coll>(); m.h = c;
    const Type* kt = nullptr;
    const Type* et = ElemType(a[0]);
    const Type* lt = ParseType("vec@" + (et ? et->text : std::string("num")));
    for (auto& v : x) {
      Value key = I.CallValue(a[1], {v});
      if (!kt) kt = key.t ? key.t : TY_NUM;
      auto f = c->m.find(key);
      if (f == c->m.end()) f = c->m.emplace(key, ListOf(et, {})).first;
      static_cast<Coll*>(f->second.h.get())->items.push_back(v);
      f->second.t = lt;
    }
    m.t = ParseType("map@" + (kt ? kt->text : std::string("num")) + "@" + lt->text);
    return m;
  }
  if (w == "cjn") {
    NeedArgs(w, a, 1, 1, "cjn&lists");
    std::vector<Value> out;
    const Type* et = nullptr;
    for (auto& l : Items(a[0], w)) { if (!et) et = ElemType(l); for (auto& v : Items(l, w)) out.push_back(v); }
    return ListOf(et, out);
  }
  if (w == "crg") {
    NeedArgs(w, a, 2, 3, "crg&0&10&2");
    int64_t s = ToInt(a[0]), e = ToInt(a[1]), st = a.size() > 2 ? ToInt(a[2]) : 1;
    if (st == 0) Bad("crg can't count in steps of 0.");
    std::vector<Value> out;
    if (st > 0) for (int64_t k = s; k < e; k += st) out.push_back(MkInt(k));
    else for (int64_t k = s; k > e; k += st) out.push_back(MkInt(k));
    if (out.size() > 10000000) Bad("That is too many numbers.");
    return ListOf(TY_NUM, out);
  }
  // ---- h: the virtual disk
  if (w == "hrd" || w == "hln" || w == "hex" || w == "hsz" || w == "hrb") {
    NeedArgs(w, a, 1, 1, "hrd&\"a.txt\"");
    std::string path = ToText(a[0]);
    auto it = g_disk.files.find(path);
    if (w == "hex") return MkBool(it != g_disk.files.end() || g_disk.dirs.count(path));
    if (it == g_disk.files.end()) {
      if (w == "hsz") ThrowStd("filesystem error: cannot get file size: No such file or directory [" + path + "]");
      if (w == "hrd") ThrowStd("I can't read the file " + path + ": it isn't there.");
      return ListOf(w == "hrb" ? ParseType("byt") : TY_TXT, {});
    }
    if (w == "hrd") return MkStr(it->second);
    if (w == "hsz") return MkInt((int64_t)it->second.size(), IK_BIG);
    if (w == "hrb") { std::vector<Value> out; const Type* bt = ParseType("byt"); for (char c : it->second) { Value b = VInt((uint8_t)c, IK_BYT); b.t = bt; out.push_back(b); } return ListOf(bt, out); }
    std::vector<Value> out;
    size_t p = 0; const std::string& s = it->second;
    while (p < s.size()) { size_t e = s.find('\n', p); if (e == std::string::npos) e = s.size(); out.push_back(MkStr(s.substr(p, e - p))); p = e + 1; }
    return ListOf(TY_TXT, out);
  }
  if (w == "hls") {
    NeedArgs(w, a, 1, 1, "hls&\".\"");
    std::string dir = ToText(a[0]);
    std::string pre = (dir == "." || dir.empty()) ? "" : dir + "/";
    std::vector<Value> out;
    std::set<std::string> names;
    for (auto& f : g_disk.files) if (f.first.rfind(pre, 0) == 0 && f.first.find('/', pre.size()) == std::string::npos) names.insert(f.first.substr(pre.size()));
    for (auto& d : g_disk.dirs) if (d.rfind(pre, 0) == 0 && d.size() > pre.size() && d.find('/', pre.size()) == std::string::npos) names.insert(d.substr(pre.size()));
    for (auto& n : names) out.push_back(MkStr(n));
    return ListOf(TY_TXT, out);
  }
  // ---- i
  if (w == "iff") { NeedArgs(w, a, 3, 3, "iff&a>b&a&b"); return I.Truth(a[0]) ? a[1] : a[2]; }
  // ---- k: clock and calendar
  if (w == "kel" || w == "kms" || w == "kns") {
    auto d = std::chrono::steady_clock::now() - g_start;
    if (w == "kel") return MkDbl(std::chrono::duration<double>(d).count());
    if (w == "kms") return MkInt(std::chrono::duration_cast<std::chrono::milliseconds>(d).count(), IK_BIG);
    return MkInt(std::chrono::duration_cast<std::chrono::nanoseconds>(d).count(), IK_BIG);
  }
  if (w == "kda" || w == "ktm" || w == "kfa" || w == "kwk") {
    std::tm t = NowTm();
    char buf[256];
    std::string f = w == "kda" ? "%Y-%m-%d" : w == "ktm" ? "%H:%M:%S" : w == "kwk" ? "%A" : (a.empty() ? "" : ToText(a[0]));
    if (w == "kfa") NeedArgs(w, a, 1, 1, "kfa&\"%Y-%m-%d\"");
    strftime(buf, sizeof buf, f.c_str(), &t);
    return MkStr(buf);
  }
  if (w == "kyr") return MkInt(NowTm().tm_year + 1900);
  if (w == "kmo") return MkInt(NowTm().tm_mon + 1);
  if (w == "kdy") return MkInt(NowTm().tm_mday);
  if (w == "khr") return MkInt(NowTm().tm_hour);
  if (w == "kmi") return MkInt(NowTm().tm_min);
  if (w == "kse") return MkInt(NowTm().tm_sec);
  // ---- n: numbers
  auto num1 = [&](const char* ex) { NeedArgs(w, a, 1, 1, ex); return ToDbl(a[0]); };
  if (w == "nab") {
    NeedArgs(w, a, 1, 1, "nab&x");
    if (a[0].k == K::Int) { Value r = a[0]; r.i = NormInt(r.i < 0 ? -r.i : r.i, r.ik); return r; }
    return MkDbl(std::fabs(ToDbl(a[0])));
  }
  if (w == "nsq") return MkDbl(std::sqrt(num1("nsq&16")));
  if (w == "ncr") return MkDbl(std::cbrt(num1("ncr&27")));
  if (w == "nro") return MkDbl(std::round(num1("nro&2.5")));
  if (w == "ndn") return MkDbl(std::floor(num1("ndn&2.5")));
  if (w == "nup") return MkDbl(std::ceil(num1("nup&2.5")));
  if (w == "nwh") return MkDbl(std::trunc(num1("nwh&2.5")));
  if (w == "nsn") return MkDbl(std::sin(num1("nsn&x")));
  if (w == "nco") return MkDbl(std::cos(num1("nco&x")));
  if (w == "ntn") return MkDbl(std::tan(num1("ntn&x")));
  if (w == "nas") return MkDbl(std::asin(num1("nas&x")));
  if (w == "nac") return MkDbl(std::acos(num1("nac&x")));
  if (w == "nat") return MkDbl(std::atan(num1("nat&x")));
  if (w == "nlg") return MkDbl(std::log(num1("nlg&x")));
  if (w == "nlx") return MkDbl(std::log10(num1("nlx&100")));
  if (w == "nep") return MkDbl(std::exp(num1("nep&1")));
  if (w == "npw") { NeedArgs(w, a, 2, 2, "npw&2&10"); return MkDbl(std::pow(ToDbl(a[0]), ToDbl(a[1]))); }
  if (w == "nhy") { NeedArgs(w, a, 2, 2, "nhy&3&4"); return MkDbl(std::hypot(ToDbl(a[0]), ToDbl(a[1]))); }
  if (w == "nmx" || w == "nmn") {
    NeedArgs(w, a, 2, 2, "nmx&a&b");
    Value x = a[0], y = a[1];
    if (x.k == K::Dbl || y.k == K::Dbl) { double p = ToDbl(x), q = ToDbl(y); return MkDbl(w == "nmx" ? std::max(p, q) : std::min(p, q)); }
    int c = Compare(x, y);
    return w == "nmx" ? (c < 0 ? y : x) : (c > 0 ? y : x);
  }
  if (w == "nkb") {
    NeedArgs(w, a, 3, 3, "nkb&x&0&10");
    if (a[0].k == K::Dbl || a[1].k == K::Dbl || a[2].k == K::Dbl) return MkDbl(std::clamp(ToDbl(a[0]), ToDbl(a[1]), ToDbl(a[2])));
    if (Compare(a[0], a[1]) < 0) return a[1];
    if (Compare(a[2], a[0]) < 0) return a[2];
    return a[0];
  }
  if (w == "ngd" || w == "nmu") {
    NeedArgs(w, a, 2, 2, "ngd&12&18");
    int64_t x = ToInt(a[0]), y = ToInt(a[1]);
    return MkInt(w == "ngd" ? std::gcd(x, y) : std::lcm(x, y), (a[0].ik == IK_BIG || a[1].ik == IK_BIG) ? IK_BIG : IK_NUM);
  }
  if (w == "nra") { NeedArgs(w, a, 2, 2, "nra&1&6"); return MkInt(I.RandomInt(ToInt(a[0]), ToInt(a[1]))); }
  if (w == "nrz") { NeedArgs(w, a, 2, 2, "nrz&0&1"); return MkDbl(I.RandomDec(ToDbl(a[0]), ToDbl(a[1]))); }
  if (w == "nfc") {
    NeedArgs(w, a, 1, 1, "nfc&5");
    int64_t n = ToInt(a[0]);
    if (n < 0) Bad("nfc needs a whole number that is 0 or more.");
    uint64_t r = 1; for (int64_t k = 2; k <= n; ++k) r *= (uint64_t)k;
    return MkInt((int64_t)r, IK_BIG);
  }
  if (w == "npe") {
    NeedArgs(w, a, 1, 1, "npe&7");
    int64_t n = ToInt(a[0]);
    if (n < 2) return MkBool(false);
    for (int64_t d = 2; d * d <= n; ++d) if (n % d == 0) return MkBool(false);
    return MkBool(true);
  }
  if (w == "npi") return MkDbl(3.141592653589793);
  if (w == "nhi") return MkInt(2147483647);
  if (w == "nlw") return MkInt(-2147483648LL);
  if (w == "nnd" || w == "nor" || w == "nxr" || w == "nsl" || w == "nsr") {
    NeedArgs(w, a, 2, 2, "nnd&a&b");
    Value x = a[0], y = a[1];
    if (x.k == K::Dbl || y.k == K::Dbl) Bad("Bits only work on whole numbers.");
    uint8_t ik = x.k == K::Int ? x.ik : IK_NUM;
    if (ik == IK_SML || ik == IK_BYT) ik = IK_NUM;
    int64_t r = w == "nnd" ? (x.i & y.i) : w == "nor" ? (x.i | y.i) : w == "nxr" ? (x.i ^ y.i) :
                w == "nsl" ? (int64_t)((uint64_t)x.i << (y.i & 63)) : (ik == IK_POS ? (int64_t)((uint64_t)(uint32_t)x.i >> (y.i & 63)) : (x.i >> (y.i & 63)));
    return MkInt(r, ik);
  }
  if (w == "nnt") { NeedArgs(w, a, 1, 1, "nnt&a"); uint8_t ik = a[0].k == K::Int ? a[0].ik : IK_NUM; if (ik == IK_SML || ik == IK_BYT) ik = IK_NUM; return MkInt(~a[0].i, ik); }
  if (w == "nsz") {
    NeedArgs(w, a, 1, 1, "nsz&x");
    const Type* t = a[0].t;
    std::string h = t ? t->head : "";
    int s = 4;
    if (h == "num" || h == "pos" || h == "flo") s = 4; else if (h == "big" || h == "pbg" || h == "dec") s = 8;
    else if (h == "sml") s = 2; else if (h == "byt" || h == "ltr" || h == "yno") s = 1;
    else if (h == "txt") s = 32;
    else if (h == "ptr" || h == "own") s = 8; else if (h == "shr") s = 16;
    else if (h == "vec") s = 24;
    else NotYet("nsz of " + KindWords(a[0]));
    return MkInt(s);
  }
  // ---- t: text
  auto txt1 = [&](const char* ex) { NeedArgs(w, a, 1, 1, ex); if (!IsText(a[0])) Bad(w + " works on a text, but this is " + KindWords(a[0]) + ". Turn it into text first: txt&x."); return a[0].s; };
  if (w == "tsz") return MkInt((int64_t)txt1("tsz&name").size());
  if (w == "tuc") { std::string s = txt1("tuc&name"); for (auto& c : s) c = (char)toupper((unsigned char)c); return MkStr(s); }
  if (w == "tlc") { std::string s = txt1("tlc&name"); for (auto& c : s) c = (char)tolower((unsigned char)c); return MkStr(s); }
  if (w == "tti") { std::string s = txt1("tti&name"); size_t b = s.find_first_not_of(" \t\r\n\f\v"); if (b == std::string::npos) return MkStr(""); size_t e = s.find_last_not_of(" \t\r\n\f\v"); return MkStr(s.substr(b, e - b + 1)); }
  if (w == "trv") { std::string s = txt1("trv&name"); std::reverse(s.begin(), s.end()); return MkStr(s); }
  if (w == "ttc") {
    std::string s = txt1("ttc&s"); bool start = true;
    for (auto& c : s) { if (isalpha((unsigned char)c)) { c = (char)(start ? toupper((unsigned char)c) : tolower((unsigned char)c)); start = false; } else start = true; }
    return MkStr(s);
  }
  if (w == "twd") {
    std::string s = txt1("twd&s"); std::vector<Value> out; std::string cur;
    for (char c : s) { if (isspace((unsigned char)c)) { if (!cur.empty()) out.push_back(MkStr(cur)); cur.clear(); } else cur += c; }
    if (!cur.empty()) out.push_back(MkStr(cur));
    return ListOf(TY_TXT, out);
  }
  if (w == "tln") {
    std::string s = txt1("tln&s"); std::vector<Value> out; size_t p = 0;
    while (p < s.size()) { size_t e = s.find('\n', p); if (e == std::string::npos) e = s.size(); out.push_back(MkStr(s.substr(p, e - p))); p = e + 1; }
    return ListOf(TY_TXT, out);
  }
  if (w == "tnm") {
    NeedArgs(w, a, 1, 1, "tnm&\"42\"");
    return MkInt(SafeStoi(ToText(a[0])));
  }
  if (w == "tdc") { NeedArgs(w, a, 1, 1, "tdc&\"2.5\""); return MkDbl(SafeStod(ToText(a[0]))); }
  if (w == "tps") {
    NeedArgs(w, a, 2, 2, "tps&name&\"a\"");
    std::string s = ToText(a[0]); size_t p = a[1].k == K::Chr ? s.find((char)a[1].i) : s.find(ToText(a[1]));
    return MkInt(p == std::string::npos ? -1 : (int64_t)p);
  }
  if (w == "trp") {
    NeedArgs(w, a, 3, 3, "trp&s&\"a\"&\"b\"");
    std::string s = ToText(a[0]), f = ToText(a[1]), r = ToText(a[2]);
    if (f.empty()) return MkStr(s);
    std::string out; size_t p = 0;
    for (;;) { size_t e = s.find(f, p); if (e == std::string::npos) { out += s.substr(p); break; } out += s.substr(p, e - p) + r; p = e + f.size(); }
    return MkStr(out);
  }
  if (w == "tcu") {
    NeedArgs(w, a, 2, 3, "tcu&s&0&3");
    std::string s = ToText(a[0]); int64_t p = ToInt(a[1]);
    if (p < 0 || (size_t)p > s.size()) ThrowStd("basic_string::substr: __pos (which is " + std::to_string(p) + ") > this->size() (which is " + std::to_string(s.size()) + ")");
    return MkStr(a.size() > 2 ? s.substr((size_t)p, (size_t)std::max<int64_t>(0, ToInt(a[2]))) : s.substr((size_t)p));
  }
  if (w == "tsp") {
    NeedArgs(w, a, 2, 2, "tsp&s&\",\"");
    std::string s = ToText(a[0]), sep = a[1].k == K::Chr ? std::string(1, (char)a[1].i) : ToText(a[1]);
    std::vector<Value> out;
    if (sep.empty()) { for (char c : s) out.push_back(MkStr(std::string(1, c))); return ListOf(TY_TXT, out); }
    size_t p = 0;
    for (;;) { size_t e = s.find(sep, p); if (e == std::string::npos) { out.push_back(MkStr(s.substr(p))); break; } out.push_back(MkStr(s.substr(p, e - p))); p = e + sep.size(); }
    return ListOf(TY_TXT, out);
  }
  if (w == "ths" || w == "tbg" || w == "ted") {
    NeedArgs(w, a, 2, 2, "ths&s&\"a\"");
    std::string s = ToText(a[0]), f = a[1].k == K::Chr ? std::string(1, (char)a[1].i) : ToText(a[1]);
    if (w == "ths") return MkBool(s.find(f) != std::string::npos);
    if (w == "tbg") return MkBool(s.rfind(f, 0) == 0);
    return MkBool(s.size() >= f.size() && s.compare(s.size() - f.size(), f.size(), f) == 0);
  }
  if (w == "tfx") { NeedArgs(w, a, 2, 2, "tfx&x&2"); return MkStr(Fixed(ToDbl(a[0]), (int)ToInt(a[1]))); }
  if (w == "tpa") { NeedArgs(w, a, 2, 2, "tpa&s&10"); std::string s = ToText(a[0]); int64_t n = ToInt(a[1]); if ((int64_t)s.size() < n) s += std::string((size_t)(n - s.size()), ' '); return MkStr(s); }
  if (w == "tmt") { NeedArgs(w, a, 2, 2, "tmt&s&\"a+\""); return MkBool(RegexSearch(ToText(a[0]), ToText(a[1]))); }
  if (w == "tma") { NeedArgs(w, a, 2, 2, "tma&s&\"a+\""); std::vector<Value> out; for (auto& m : RegexAll(ToText(a[0]), ToText(a[1]))) out.push_back(MkStr(m)); return ListOf(TY_TXT, out); }
  if (w == "trx") { NeedArgs(w, a, 3, 3, "trx&s&\"a+\"&\"b\""); return MkStr(RegexReplace(ToText(a[0]), ToText(a[1]), ToText(a[2]))); }
  if (w == "tre") { NeedArgs(w, a, 2, 2, "tre&\"ab\"&3"); std::string s = ToText(a[0]), out; int64_t n = ToInt(a[1]); for (int64_t k = 0; k < n; ++k) out += s; return MkStr(out); }
  if (w == "tct") {
    NeedArgs(w, a, 2, 2, "tct&s&\"a\"");
    std::string s = ToText(a[0]), f = a[1].k == K::Chr ? std::string(1, (char)a[1].i) : ToText(a[1]);
    if (f.empty()) return MkInt(0);
    int64_t n = 0; size_t p = 0;
    while ((p = s.find(f, p)) != std::string::npos) { ++n; p += f.size(); }
    return MkInt(n);
  }
  if (w == "tdg" || w == "tlr" || w == "tws") {
    NeedArgs(w, a, 1, 1, "tdg&c");
    int c = a[0].k == K::Str ? (a[0].s.empty() ? 0 : (unsigned char)a[0].s[0]) : (int)(unsigned char)a[0].i;
    return MkBool(w == "tdg" ? isdigit(c) != 0 : w == "tlr" ? isalpha(c) != 0 : isspace(c) != 0);
  }
  if (w == "tfa") {
    if (a.empty()) Bad("tfa takes a text with {} spots, and a value for each: tfa&\"{} of {}\"&1&2.");
    return MkStr(FillFormat(ToText(a[0]), a, 1));
  }
  if (w == "ttp") {
    NeedArgs(w, a, 1, 1, "ttp&x");
    const Type* t = a[0].t;
    if (t) return MkStr(t->text);
    return MkStr(KindWords(a[0]));
  }
  if (w == "tjs") { NeedArgs(w, a, 1, 1, "tjs&text"); return ParseJson(ToText(a[0])); }
  // ---- x: outside the program
  if (w == "xag") { const Type* tt = TY_TXT; return ListOf(tt, {}); }
  if (w == "xev") NotYet("Reading the computer's environment values (xev)");
  if (w == "xcm" || w == "xcd") NotYet("Running a command on the computer (" + w + ")");
  if (w == "xwb") NotYet("Reading a web page (xwb)");
  if (w == "xpo") {
    NeedArgs(w, a, 2, 2, "xpo&\"http://example.com\"&\"hello\"");
    ThrowStd("The Web Studio can't send to " + ToText(a[0]) + " from inside the browser.");
  }
  if (w == "xha") { NeedArgs(w, a, 1, 1, "xha&\"abc\""); return MkStr(Sha256(ToText(a[0]))); }
  if (w == "xbe") { NeedArgs(w, a, 1, 1, "xbe&\"abc\""); return MkStr(Base64Enc(ToText(a[0]))); }
  if (w == "xbd") { NeedArgs(w, a, 1, 1, "xbd&\"YWJj\""); return MkStr(Base64Dec(ToText(a[0]))); }
  NotYet("The word " + w);
}

}  // namespace epp
