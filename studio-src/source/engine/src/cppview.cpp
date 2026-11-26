// cppview.cpp — the Web Studio's C++ View: English++ in, one C++20 file out.
//
// English++ is Vewu's language. Every line is who / root / what, and every root has
// one fixed meaning, so each line becomes the C++ the Studio means by it: x is 6 is
// int x = 6;, i flt 5 is a for loop, out prn x is std::cout << x << std::endl;.
// The file builds on its own with any C++20 compiler (standard headers only). The few
// English++ words that need more than one line of C++ (how a list is printed, tsp,
// cso ...) come along as small helpers in namespace epp at the top — only the ones
// the program uses.
//
// The C++ View never guesses: when a line can't be written as C++ here yet, the
// file's first line says so, and CppViewComplete() is false.
#include "cppview.h"
#include "eh.h"
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <functional>
#include <map>
#include <set>
#include <sstream>

namespace epp {
namespace {

// raylib names the C++ View writes as plain C++ in a program that uses raylib (only then — every other program is unchanged)
#include "cppview_rl.inc"
template <size_t N> const RlName* RlFind(const RlName (&tab)[N], const std::string& n) {
  static std::map<std::string, const RlName*> m;
  if (m.empty()) for (const RlName& r : tab) m[r.name] = &r;
  auto it = m.find(n);
  return it == m.end() ? nullptr : it->second;
}

// ====================================================================== helpers that travel with the C++
struct Piece {
  const char* name;
  const char* includes;  // space separated
  const char* deps;      // space separated piece names
  const char* code;
};

// Order matters: a piece only uses pieces above it.
const Piece kPieces[] = {
{"show", "<iostream> <sstream> <string> <vector> <list> <deque> <array> <set> <unordered_set> <map> <unordered_map> <utility> <tuple> <optional> <variant> <complex>", "",
R"CPP(// How English++ shows a value: yes / nay for yes-or-no, a byte as its number,
// a list as [a, b, c], a map as {key: value}, a pair or tuple as (a, b).
namespace epp {
inline void put(std::ostream& out, bool b) { out << (b ? "yes" : "nay"); }
inline void put(std::ostream& out, unsigned char b) { out << int(b); }
inline void put(std::ostream& out, const std::complex<double>& c) { out << '(' << c.real() << ',' << c.imag() << ')'; }
template <class T> void put(std::ostream& out, const T& v);
template <class T, class A> std::ostream& operator<<(std::ostream& out, const std::vector<T, A>& v);
template <class T, class A> std::ostream& operator<<(std::ostream& out, const std::list<T, A>& v);
template <class T, class A> std::ostream& operator<<(std::ostream& out, const std::deque<T, A>& v);
template <class T, std::size_t N> std::ostream& operator<<(std::ostream& out, const std::array<T, N>& v);
template <class T, class C, class A> std::ostream& operator<<(std::ostream& out, const std::set<T, C, A>& v);
template <class T, class H, class E, class A> std::ostream& operator<<(std::ostream& out, const std::unordered_set<T, H, E, A>& v);
template <class K, class V, class C, class A> std::ostream& operator<<(std::ostream& out, const std::map<K, V, C, A>& v);
template <class K, class V, class H, class E, class A> std::ostream& operator<<(std::ostream& out, const std::unordered_map<K, V, H, E, A>& v);
template <class A, class B> std::ostream& operator<<(std::ostream& out, const std::pair<A, B>& v);
template <class... T> std::ostream& operator<<(std::ostream& out, const std::tuple<T...>& v);
template <class T> std::ostream& operator<<(std::ostream& out, const std::optional<T>& v);
template <class... T> std::ostream& operator<<(std::ostream& out, const std::variant<T...>& v);

template <class T> void put(std::ostream& out, const T& v) { out << v; }
template <class C> std::ostream& items(std::ostream& out, const C& c, const char* open, const char* close) {
  out << open;
  bool first = true;
  for (const auto& x : c) { if (!first) out << ", "; first = false; put(out, x); }
  return out << close;
}
template <class C> std::ostream& pairs(std::ostream& out, const C& c) {
  out << '{';
  bool first = true;
  for (const auto& [k, x] : c) { if (!first) out << ", "; first = false; put(out, k); out << ": "; put(out, x); }
  return out << '}';
}
template <class T, class A> std::ostream& operator<<(std::ostream& out, const std::vector<T, A>& v) { return items(out, v, "[", "]"); }
template <class T, class A> std::ostream& operator<<(std::ostream& out, const std::list<T, A>& v) { return items(out, v, "[", "]"); }
template <class T, class A> std::ostream& operator<<(std::ostream& out, const std::deque<T, A>& v) { return items(out, v, "[", "]"); }
template <class T, std::size_t N> std::ostream& operator<<(std::ostream& out, const std::array<T, N>& v) { return items(out, v, "[", "]"); }
template <class T, class C, class A> std::ostream& operator<<(std::ostream& out, const std::set<T, C, A>& v) { return items(out, v, "{", "}"); }
template <class T, class H, class E, class A> std::ostream& operator<<(std::ostream& out, const std::unordered_set<T, H, E, A>& v) { return items(out, v, "{", "}"); }
template <class K, class V, class C, class A> std::ostream& operator<<(std::ostream& out, const std::map<K, V, C, A>& v) { return pairs(out, v); }
template <class K, class V, class H, class E, class A> std::ostream& operator<<(std::ostream& out, const std::unordered_map<K, V, H, E, A>& v) { return pairs(out, v); }
template <class A, class B> std::ostream& operator<<(std::ostream& out, const std::pair<A, B>& v) {
  out << '('; put(out, v.first); out << ", "; put(out, v.second); return out << ')';
}
template <class... T> std::ostream& operator<<(std::ostream& out, const std::tuple<T...>& v) {
  out << '(';
  std::apply([&](const auto&... x) { int n = 0; ((out << (n++ ? ", " : ""), put(out, x)), ...); }, v);
  return out << ')';
}
template <class T> std::ostream& operator<<(std::ostream& out, const std::optional<T>& v) {
  if (v) put(out, *v); else out << "nil";
  return out;
}
template <class... T> std::ostream& operator<<(std::ostream& out, const std::variant<T...>& v) {
  std::visit([&](const auto& x) { put(out, x); }, v);
  return out;
}
// txt&x: a value as text, shown the English++ way
inline std::string text(const std::string& s) { return s; }
inline std::string text(const char* s) { return s; }
template <class T> std::string text(const T& v) { std::ostringstream s; put(s, v); return s.str(); }
}  // namespace epp
)CPP"},

{"check", "<iostream> <cstdlib> <string>", "",
R"CPP(namespace epp {
// seq, sne, slt ...: a check that stops the program when it isn't true
inline void check(bool ok, const char* what) {
  if (!ok) { std::cout.flush(); std::cerr << "A check failed: " << what << std::endl; std::exit(1); }
}
}  // namespace epp
)CPP"},

{"tnm", "<string> <stdexcept>", "",
R"CPP(namespace epp {
// tnm&"42" and tdc&"2.5": text to a number, with the messages the Studio shows
inline int tnm(const std::string& s) {
  try { return std::stoi(s); }
  catch (const std::invalid_argument&) { throw std::invalid_argument("invalid stoi argument"); }
  catch (const std::out_of_range&) { throw std::out_of_range("stoi argument out of range"); }
}
inline double tdc(const std::string& s) {
  try { return std::stod(s); }
  catch (const std::invalid_argument&) { throw std::invalid_argument("invalid stod argument"); }
  catch (const std::out_of_range&) { throw std::out_of_range("stod argument out of range"); }
}
}  // namespace epp
)CPP"},

{"tfx", "<string> <cstdio>", "",
R"CPP(namespace epp {
// tfx&x&2: a decimal with 2 places after the point
inline std::string tfx(double x, int places) {
  char buf[512];
  std::snprintf(buf, sizeof buf, "%.*f", places, x);
  return buf;
}
}  // namespace epp
)CPP"},

{"tpa", "<string>", "",
R"CPP(namespace epp {
// tpa&s&n: s with spaces after it, n letters wide
inline std::string tpa(std::string s, int n) {
  if ((int)s.size() < n) s += std::string(n - s.size(), ' ');
  return s;
}
}  // namespace epp
)CPP"},

{"tcase", "<string> <cctype>", "",
R"CPP(namespace epp {
// tuc / tlc / ttc / tti / trv: a text in capitals, small letters, Title Case, trimmed, backwards
inline std::string tuc(std::string s) { for (char& c : s) c = (char)std::toupper((unsigned char)c); return s; }
inline std::string tlc(std::string s) { for (char& c : s) c = (char)std::tolower((unsigned char)c); return s; }
inline std::string ttc(std::string s) {
  bool start = true;
  for (char& c : s) {
    if (std::isalpha((unsigned char)c)) { c = (char)(start ? std::toupper((unsigned char)c) : std::tolower((unsigned char)c)); start = false; }
    else start = true;
  }
  return s;
}
inline std::string tti(const std::string& s) {
  std::size_t b = s.find_first_not_of(" \t\r\n\f\v");
  if (b == std::string::npos) return "";
  std::size_t e = s.find_last_not_of(" \t\r\n\f\v");
  return s.substr(b, e - b + 1);
}
inline std::string trv(std::string s) { return std::string(s.rbegin(), s.rend()); }
}  // namespace epp
)CPP"},

{"tfind", "<string>", "",
R"CPP(namespace epp {
// ths / tbg / ted / tps / tct: has, begins with, ends with, place of, how many times
inline bool ths(const std::string& s, const std::string& f) { return s.find(f) != std::string::npos; }
inline bool tbg(const std::string& s, const std::string& f) { return s.rfind(f, 0) == 0; }
inline bool ted(const std::string& s, const std::string& f) { return s.size() >= f.size() && s.compare(s.size() - f.size(), f.size(), f) == 0; }
inline int tps(const std::string& s, const std::string& f) { std::size_t p = s.find(f); return p == std::string::npos ? -1 : (int)p; }
inline int tct(const std::string& s, const std::string& f) {
  if (f.empty()) return 0;
  int n = 0;
  for (std::size_t p = 0; (p = s.find(f, p)) != std::string::npos; p += f.size()) ++n;
  return n;
}
}  // namespace epp
)CPP"},

{"trp", "<string>", "",
R"CPP(namespace epp {
// trp&s&a&b: every a in s becomes b
inline std::string trp(const std::string& s, const std::string& a, const std::string& b) {
  if (a.empty()) return s;
  std::string out;
  std::size_t p = 0;
  for (;;) {
    std::size_t e = s.find(a, p);
    if (e == std::string::npos) { out += s.substr(p); return out; }
    out += s.substr(p, e - p) + b;
    p = e + a.size();
  }
}
}  // namespace epp
)CPP"},

{"tre", "<string>", "",
R"CPP(namespace epp {
// tre&s&n: s, n times
inline std::string tre(const std::string& s, int n) { std::string out; for (int k = 0; k < n; ++k) out += s; return out; }
}  // namespace epp
)CPP"},

{"tsplit", "<string> <vector> <cctype>", "",
R"CPP(namespace epp {
// twd / tsp / tln: a text cut into words, at a separator, into lines
inline std::vector<std::string> twd(const std::string& s) {
  std::vector<std::string> out;
  std::string cur;
  for (char c : s) {
    if (std::isspace((unsigned char)c)) { if (!cur.empty()) out.push_back(cur); cur.clear(); }
    else cur += c;
  }
  if (!cur.empty()) out.push_back(cur);
  return out;
}
inline std::vector<std::string> tsp(const std::string& s, const std::string& sep) {
  std::vector<std::string> out;
  if (sep.empty()) { for (char c : s) out.push_back(std::string(1, c)); return out; }
  std::size_t p = 0;
  for (;;) {
    std::size_t e = s.find(sep, p);
    if (e == std::string::npos) { out.push_back(s.substr(p)); return out; }
    out.push_back(s.substr(p, e - p));
    p = e + sep.size();
  }
}
inline std::vector<std::string> tln(const std::string& s) {
  std::vector<std::string> out;
  std::size_t p = 0;
  while (p < s.size()) {
    std::size_t e = s.find('\n', p);
    if (e == std::string::npos) e = s.size();
    out.push_back(s.substr(p, e - p));
    p = e + 1;
  }
  return out;
}
}  // namespace epp
)CPP"},

{"regex", "<string> <vector> <regex>", "",
R"CPP(namespace epp {
// tmt / tma / trx: does it match, every match, replace the matches
inline bool tmt(const std::string& s, const std::string& pattern) { return std::regex_search(s, std::regex(pattern)); }
inline std::vector<std::string> tma(const std::string& s, const std::string& pattern) {
  std::vector<std::string> out;
  std::regex r(pattern);
  for (auto it = std::sregex_iterator(s.begin(), s.end(), r); it != std::sregex_iterator(); ++it) out.push_back(it->str());
  return out;
}
inline std::string trx(const std::string& s, const std::string& pattern, const std::string& with) {
  return std::regex_replace(s, std::regex(pattern), with);
}
}  // namespace epp
)CPP"},

{"random", "<cstdint>", "",
R"CPP(namespace epp {
// rsd and nra: the Studio's random numbers (the same numbers every run once seeded)
inline std::uint64_t rng = 0x853c49e6748fea9bULL;
inline void rsd(long long seed) { rng = (std::uint64_t)seed * 6364136223846793005ULL + 1442695040888963407ULL; }
inline long long nra(long long a, long long b) {
  rng = rng * 6364136223846793005ULL + 1442695040888963407ULL;
  std::uint64_t x = rng >> 33;
  if (b < a) { long long t = a; a = b; b = t; }
  return a + (long long)(x % (std::uint64_t)(b - a + 1));
}
inline double nrz(double a, double b) {
  rng = rng * 6364136223846793005ULL + 1442695040888963407ULL;
  return a + (b - a) * ((double)(rng >> 11) / 9007199254740992.0);
}
}  // namespace epp
)CPP"},

{"nfc", "", "",
R"CPP(namespace epp {
// nfc&n and npe&n: n's factorial, and whether n is prime
inline long long nfc(long long n) { unsigned long long r = 1; for (long long k = 2; k <= n; ++k) r *= (unsigned long long)k; return (long long)r; }
inline bool npe(long long n) {
  if (n < 2) return false;
  for (long long d = 2; d * d <= n; ++d) if (n % d == 0) return false;
  return true;
}
}  // namespace epp
)CPP"},

{"stats", "<vector> <algorithm> <cmath>", "",
R"CPP(namespace epp {
// cav / cme / cde: the average, the middle value, how spread out
template <class C> double cav(const C& c) {
  if (c.empty()) return 0;
  double sum = 0;
  for (const auto& x : c) sum += x;
  return sum / c.size();
}
template <class C> double cme(const C& c) {
  if (c.empty()) return 0;
  std::vector<double> d(c.begin(), c.end());
  std::sort(d.begin(), d.end());
  std::size_t n = d.size();
  return n % 2 ? d[n / 2] : (d[n / 2 - 1] + d[n / 2]) / 2;
}
template <class C> double cde(const C& c) {
  if (c.empty()) return 0;
  double mean = cav(c), ss = 0;
  for (const auto& x : c) ss += (x - mean) * (x - mean);
  return std::sqrt(ss / c.size());
}
}  // namespace epp
)CPP"},

{"listwords", "<vector> <algorithm> <iterator> <string>", "show",
R"CPP(namespace epp {
// list words that need more than a line of C++
template <class C, class T> int cps(const C& c, const T& x) {
  int k = 0;
  for (const auto& y : c) { if (y == x) return k; ++k; }
  return -1;
}
template <class C> std::string ctx(const C& c, const std::string& sep) {
  std::string out;
  bool first = true;
  for (const auto& x : c) { if (!first) out += sep; first = false; out += text(x); }
  return out;
}
template <class C> C cso(C c) { std::sort(c.begin(), c.end()); return c; }
template <class C> C crv(C c) { std::reverse(c.begin(), c.end()); return c; }
template <class C, class F> C cft(const C& c, F keep) {
  C out;
  for (const auto& x : c) if (keep(x)) out.push_back(x);
  return out;
}
template <class C, class F> auto cmp(const C& c, F f) {
  std::vector<decltype(f(*c.begin()))> out;
  for (const auto& x : c) out.push_back(f(x));
  return out;
}
template <class C> auto ccu(const C& c, std::size_t from, std::size_t n = (std::size_t)-1) {
  std::vector<typename C::value_type> all(c.begin(), c.end());
  if (from > all.size()) from = all.size();
  if (n > all.size() - from) n = all.size() - from;
  return std::vector<typename C::value_type>(all.begin() + from, all.begin() + from + n);
}
inline std::vector<int> crg(int from, int to, int step = 1) {
  std::vector<int> out;
  if (step > 0) for (int k = from; k < to; k += step) out.push_back(k);
  else for (int k = from; k > to; k += step) out.push_back(k);
  return out;
}
template <class A, class B> auto czp(const A& a, const B& b) {
  std::vector<std::pair<typename A::value_type, typename B::value_type>> out;
  auto i = a.begin(); auto j = b.begin();
  for (; i != a.end() && j != b.end(); ++i, ++j) out.push_back({*i, *j});
  return out;
}
template <class A> auto cnu(const A& a) {
  std::vector<std::pair<int, typename A::value_type>> out;
  int k = 0;
  for (const auto& x : a) out.push_back({k++, x});
  return out;
}
template <class A> std::vector<typename A::value_type> sorted_once(const A& a) {
  std::vector<typename A::value_type> v(a.begin(), a.end());
  std::sort(v.begin(), v.end());
  v.erase(std::unique(v.begin(), v.end()), v.end());
  return v;
}
template <class A, class B> auto cun(const A& a, const B& b) {
  auto x = sorted_once(a); auto y = sorted_once(b); decltype(x) out;
  std::set_union(x.begin(), x.end(), y.begin(), y.end(), std::back_inserter(out));
  return out;
}
template <class A, class B> auto cbt(const A& a, const B& b) {
  auto x = sorted_once(a); auto y = sorted_once(b); decltype(x) out;
  std::set_intersection(x.begin(), x.end(), y.begin(), y.end(), std::back_inserter(out));
  return out;
}
template <class A, class B> auto cot(const A& a, const B& b) {
  auto x = sorted_once(a); auto y = sorted_once(b); decltype(x) out;
  std::set_difference(x.begin(), x.end(), y.begin(), y.end(), std::back_inserter(out));
  return out;
}
template <class C, class F> auto cgr(const C& c, F key) {
  std::map<decltype(key(*c.begin())), std::vector<typename C::value_type>> out;
  for (const auto& x : c) out[key(x)].push_back(x);
  return out;
}
template <class C> auto cjn(const C& lists) {
  std::vector<typename C::value_type::value_type> out;
  for (const auto& l : lists) out.insert(out.end(), l.begin(), l.end());
  return out;
}
template <class M> auto cky(const M& m) { std::vector<typename M::key_type> out; for (const auto& [k, v] : m) out.push_back(k); return out; }
template <class M> auto cvl(const M& m) { std::vector<typename M::mapped_type> out; for (const auto& [k, v] : m) out.push_back(v); return out; }
}  // namespace epp
)CPP"},

{"files", "<string> <vector> <fstream> <sstream> <filesystem> <stdexcept> <set>", "",
R"CPP(namespace epp {
// hrd / hln / hls / hby / hrb: files on the disk
inline std::string hrd(const std::string& path) {
  std::ifstream f(path, std::ios::binary);
  if (!f) throw std::runtime_error("I can't read the file " + path + ": it isn't there.");
  std::stringstream s;
  s << f.rdbuf();
  return s.str();
}
inline std::vector<std::string> hln(const std::string& path) {
  std::vector<std::string> out;
  std::ifstream f(path);
  for (std::string line; std::getline(f, line);) out.push_back(line);
  return out;
}
inline std::vector<std::string> hls(const std::string& dir) {
  std::set<std::string> names;
  for (const auto& e : std::filesystem::directory_iterator(dir)) names.insert(e.path().filename().string());
  return std::vector<std::string>(names.begin(), names.end());
}
inline void hwr(const std::string& path, const std::string& text, bool add = false) {
  std::ofstream f(path, add ? std::ios::app | std::ios::binary : std::ios::binary);
  if (!f) throw std::runtime_error("I can't write the file " + path + ": its folder isn't there.");
  f << text;
}
template <class C> void hby(const std::string& path, const C& bytes) {
  std::ofstream f(path, std::ios::binary);
  for (auto b : bytes) f.put((char)b);
}
inline std::vector<unsigned char> hrb(const std::string& path) {
  std::ifstream f(path, std::ios::binary);
  return std::vector<unsigned char>(std::istreambuf_iterator<char>(f), std::istreambuf_iterator<char>());
}
}  // namespace epp
)CPP"},

{"clock", "<chrono> <string> <ctime>", "",
R"CPP(namespace epp {
// kms / kel / kns: time since the program started; kfa: today's date in a format
inline const auto started = std::chrono::steady_clock::now();
inline long long kms() { return std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::steady_clock::now() - started).count(); }
inline long long kns() { return std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::steady_clock::now() - started).count(); }
inline double kel() { return std::chrono::duration<double>(std::chrono::steady_clock::now() - started).count(); }
inline std::string kfa(const std::string& format) {
  std::time_t t = std::time(nullptr);
  char buf[256];
  std::strftime(buf, sizeof buf, format.c_str(), std::localtime(&t));
  return buf;
}
}  // namespace epp
)CPP"},

{"later", "<functional>", "",
R"CPP(namespace epp {
// bdr: what runs when the block it is in ends
struct Later {
  std::function<void()> run;
  ~Later() { run(); }
};
}  // namespace epp
)CPP"},

{"channel", "<deque> <mutex> <condition_variable>", "",
R"CPP(namespace epp {
// chn: a channel threads send values through, in order
template <class T> class Channel {
 public:
  void push(const T& v) { { std::lock_guard<std::mutex> g(m_); q_.push_back(v); } cv_.notify_one(); }
  void close() { { std::lock_guard<std::mutex> g(m_); closed_ = true; } cv_.notify_all(); }
  bool receive(T& v) {
    std::unique_lock<std::mutex> g(m_);
    cv_.wait(g, [&] { return !q_.empty() || closed_; });
    if (q_.empty()) return false;
    v = q_.front();
    q_.pop_front();
    return true;
  }
 private:
  std::deque<T> q_;
  bool closed_ = false;
  std::mutex m_;
  std::condition_variable cv_;
};
}  // namespace epp
)CPP"},

{"generator", "<coroutine> <exception> <utility>", "",
R"CPP(namespace epp {
// gnr@num: a function that hands out its values one at a time with eyd (co_yield)
template <class T> class Generator {
 public:
  struct promise_type {
    T value{};
    Generator get_return_object() { return Generator(std::coroutine_handle<promise_type>::from_promise(*this)); }
    std::suspend_always initial_suspend() { return {}; }
    std::suspend_always final_suspend() noexcept { return {}; }
    std::suspend_always yield_value(T v) { value = std::move(v); return {}; }
    void return_void() {}
    void unhandled_exception() { throw; }
  };
  struct iterator {
    std::coroutine_handle<promise_type> h;
    iterator& operator++() { h.resume(); return *this; }
    const T& operator*() const { return h.promise().value; }
    bool operator!=(std::default_sentinel_t) const { return !h.done(); }
  };
  explicit Generator(std::coroutine_handle<promise_type> h) : h_(h) {}
  Generator(Generator&& o) noexcept : h_(std::exchange(o.h_, {})) {}
  ~Generator() { if (h_) h_.destroy(); }
  iterator begin() { h_.resume(); return iterator{h_}; }
  std::default_sentinel_t end() { return {}; }
 private:
  std::coroutine_handle<promise_type> h_;
};
}  // namespace epp
)CPP"},

{"hug", "<string> <vector> <cstdint> <cstdio> <iostream> <algorithm> <stdexcept>", "",
R"CPP(namespace epp {
// hug: a whole number of any size (base 1e9 digits, lowest first)
class Hug {
 public:
  Hug(long long v = 0) {
    unsigned long long u = v < 0 ? 0ULL - (unsigned long long)v : (unsigned long long)v;
    neg_ = v < 0;
    while (u) { d_.push_back((std::uint32_t)(u % kBase)); u /= kBase; }
  }
  explicit Hug(const std::string& s) {
    std::size_t st = (!s.empty() && (s[0] == '-' || s[0] == '+')) ? 1 : 0;
    if (st >= s.size()) throw std::invalid_argument("invalid hug text: " + s);
    for (std::size_t k = st; k < s.size(); ++k) if (s[k] < '0' || s[k] > '9') throw std::invalid_argument("invalid hug text: " + s);
    for (long long e = (long long)s.size(); e > (long long)st; e -= 9) {
      long long b = std::max((long long)st, e - 9);
      d_.push_back((std::uint32_t)std::stoul(s.substr(b, e - b)));
    }
    neg_ = s[0] == '-';
    trim();
  }
  friend Hug operator+(const Hug& a, const Hug& b) { return add(a, b, false); }
  friend Hug operator-(const Hug& a, const Hug& b) { return add(a, b, true); }
  friend Hug operator*(const Hug& a, const Hug& b) {
    Hug r;
    std::vector<std::uint64_t> t(a.d_.size() + b.d_.size() + 1, 0);
    for (std::size_t x = 0; x < a.d_.size(); ++x) {
      std::uint64_t carry = 0;
      for (std::size_t y = 0; y < b.d_.size() || carry; ++y) {
        std::uint64_t cur = t[x + y] + carry + (y < b.d_.size() ? (std::uint64_t)a.d_[x] * b.d_[y] : 0);
        t[x + y] = cur % kBase;
        carry = cur / kBase;
      }
    }
    for (auto v : t) r.d_.push_back((std::uint32_t)v);
    r.neg_ = a.neg_ != b.neg_;
    r.trim();
    return r;
  }
  Hug& operator+=(const Hug& o) { return *this = *this + o; }
  Hug& operator-=(const Hug& o) { return *this = *this - o; }
  Hug& operator*=(const Hug& o) { return *this = *this * o; }
  friend bool operator==(const Hug& a, const Hug& b) { return a.neg_ == b.neg_ && a.d_ == b.d_; }
  friend bool operator<(const Hug& a, const Hug& b) {
    if (a.neg_ != b.neg_) return a.neg_;
    int c = cmpAbs(a, b);
    return a.neg_ ? c > 0 : c < 0;
  }
  friend std::ostream& operator<<(std::ostream& out, const Hug& h) { return out << h.str(); }
  std::string str() const {
    if (d_.empty()) return "0";
    std::string r = neg_ ? "-" : "";
    r += std::to_string(d_.back());
    char buf[16];
    for (long long k = (long long)d_.size() - 2; k >= 0; --k) { std::snprintf(buf, sizeof buf, "%09u", d_[k]); r += buf; }
    return r;
  }
 private:
  static constexpr std::uint32_t kBase = 1000000000u;
  bool neg_ = false;
  std::vector<std::uint32_t> d_;
  void trim() { while (!d_.empty() && d_.back() == 0) d_.pop_back(); if (d_.empty()) neg_ = false; }
  static int cmpAbs(const Hug& a, const Hug& b) {
    if (a.d_.size() != b.d_.size()) return a.d_.size() < b.d_.size() ? -1 : 1;
    for (long long k = (long long)a.d_.size() - 1; k >= 0; --k) if (a.d_[k] != b.d_[k]) return a.d_[k] < b.d_[k] ? -1 : 1;
    return 0;
  }
  static Hug add(const Hug& a, const Hug& b, bool sub) {
    bool bneg = sub ? !b.neg_ : b.neg_;
    Hug r;
    const Hug* big = &a; const Hug* small = &b;
    bool same = a.neg_ == bneg;
    if (!same && cmpAbs(a, b) < 0) std::swap(big, small);
    std::int64_t carry = 0;
    for (std::size_t k = 0; k < big->d_.size() || k < small->d_.size() || carry; ++k) {
      std::int64_t x = (k < big->d_.size() ? big->d_[k] : 0), y = (k < small->d_.size() ? small->d_[k] : 0);
      std::int64_t s = same ? x + y + carry : x - y + carry;
      carry = 0;
      if (s >= (std::int64_t)kBase) { s -= kBase; carry = 1; }
      if (s < 0) { s += kBase; carry = -1; }
      r.d_.push_back((std::uint32_t)s);
    }
    r.neg_ = same ? a.neg_ : (big == &a ? a.neg_ : bneg);
    r.trim();
    return r;
  }
};
inline Hug pow(Hug base, long long n) { Hug r = 1; for (long long k = 0; k < n; ++k) r *= base; return r; }
}  // namespace epp
)CPP"},

{"sha", "<string> <cstdint> <cstdio>", "",
R"CPP(namespace epp {
// xha&text: the SHA-256 fingerprint of a text, as 64 hex letters
inline std::string xha(const std::string& msg) {
  static const std::uint32_t K[64] = {
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,
    0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,
    0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,
    0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2};
  std::uint32_t h[8] = {0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19};
  std::string m = msg;
  std::uint64_t bits = (std::uint64_t)msg.size() * 8;
  m += (char)0x80;
  while (m.size() % 64 != 56) m += (char)0;
  for (int k = 7; k >= 0; --k) m += (char)((bits >> (k * 8)) & 0xff);
  auto rotr = [](std::uint32_t x, int n) { return (x >> n) | (x << (32 - n)); };
  for (std::size_t off = 0; off < m.size(); off += 64) {
    std::uint32_t w[64];
    for (int k = 0; k < 16; ++k)
      w[k] = ((std::uint32_t)(std::uint8_t)m[off + k * 4] << 24) | ((std::uint32_t)(std::uint8_t)m[off + k * 4 + 1] << 16) |
             ((std::uint32_t)(std::uint8_t)m[off + k * 4 + 2] << 8) | (std::uint32_t)(std::uint8_t)m[off + k * 4 + 3];
    for (int k = 16; k < 64; ++k) {
      std::uint32_t s0 = rotr(w[k - 15], 7) ^ rotr(w[k - 15], 18) ^ (w[k - 15] >> 3);
      std::uint32_t s1 = rotr(w[k - 2], 17) ^ rotr(w[k - 2], 19) ^ (w[k - 2] >> 10);
      w[k] = w[k - 16] + s0 + w[k - 7] + s1;
    }
    std::uint32_t a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
    for (int k = 0; k < 64; ++k) {
      std::uint32_t t1 = hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[k] + w[k];
      std::uint32_t t2 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c));
      hh = g; g = f; f = e; e = d + t1; d = c; c = b; b = a; a = t1 + t2;
    }
    h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e; h[5] += f; h[6] += g; h[7] += hh;
  }
  char buf[65];
  for (int k = 0; k < 8; ++k) std::snprintf(buf + k * 8, 9, "%08x", h[k]);
  return std::string(buf, 64);
}
}  // namespace epp
)CPP"},

{"base64", "<string> <cstring>", "",
R"CPP(namespace epp {
// xbe / xbd: a text to base 64 and back
inline const char* kBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
inline std::string xbe(const std::string& s) {
  std::string out;
  std::size_t i = 0;
  for (; i + 2 < s.size(); i += 3) {
    unsigned n = ((unsigned char)s[i] << 16) | ((unsigned char)s[i + 1] << 8) | (unsigned char)s[i + 2];
    out += kBase64[(n >> 18) & 63]; out += kBase64[(n >> 12) & 63]; out += kBase64[(n >> 6) & 63]; out += kBase64[n & 63];
  }
  if (i + 1 == s.size()) { unsigned n = (unsigned char)s[i] << 16; out += kBase64[(n >> 18) & 63]; out += kBase64[(n >> 12) & 63]; out += "=="; }
  else if (i + 2 == s.size()) {
    unsigned n = ((unsigned char)s[i] << 16) | ((unsigned char)s[i + 1] << 8);
    out += kBase64[(n >> 18) & 63]; out += kBase64[(n >> 12) & 63]; out += kBase64[(n >> 6) & 63]; out += '=';
  }
  return out;
}
inline std::string xbd(const std::string& s) {
  std::string out;
  unsigned buf = 0;
  int bits = 0;
  for (char c : s) {
    if (c == '=') break;
    const char* p = c ? std::strchr(kBase64, c) : nullptr;
    if (!p) continue;
    buf = (buf << 6) | (unsigned)(p - kBase64);
    bits += 6;
    if (bits >= 8) { bits -= 8; out += (char)((buf >> bits) & 0xff); }
  }
  return out;
}
}  // namespace epp
)CPP"},

{"shuffle", "<utility>", "random",
R"CPP(namespace epp {
// lsu: shuffle with the Studio's random numbers
template <class C> void lsu(C& c) {
  for (long long k = (long long)c.size(); k > 1; --k) std::swap(c[k - 1], c[nra(0, k - 1)]);
}
}  // namespace epp
)CPP"},
};

// ====================================================================== names and literals
const std::set<std::string>& CppReserved() {
  static const std::set<std::string> s = {
    "alignas","alignof","and","and_eq","asm","auto","bitand","bitor","bool","break","case","catch","char","char8_t","char16_t",
    "char32_t","class","compl","concept","const","consteval","constexpr","constinit","const_cast","continue","co_await",
    "co_return","co_yield","decltype","default","delete","do","double","dynamic_cast","else","enum","explicit","export",
    "extern","false","float","for","friend","goto","if","inline","int","long","mutable","namespace","new","noexcept","not",
    "not_eq","nullptr","operator","or","or_eq","private","protected","public","register","reinterpret_cast","requires",
    "return","short","signed","sizeof","static","static_assert","static_cast","struct","switch","template","this",
    "thread_local","throw","true","try","typedef","typeid","typename","union","unsigned","using","virtual","void",
    "volatile","wchar_t","while","xor","xor_eq","final","override","import","module",
    "std","epp","main","NULL","errno","assert","EOF","stdin","stdout","stderr"};
  return s;
}
// names a top-level C++ function or global can't take, because the C library already has them
const std::set<std::string>& CGlobalNames() {
  static const std::set<std::string> s = {
    "abs","div","exit","abort","atoi","atof","atol","rand","srand","malloc","free","calloc","realloc","system","getenv",
    "time","clock","difftime","printf","puts","putchar","getchar","gets","scanf","remove","rename","tmpnam","fopen","fclose",
    "sin","cos","tan","asin","acos","atan","atan2","sinh","cosh","tanh","exp","log","log10","log2","pow","sqrt","cbrt","ceil",
    "floor","round","trunc","fabs","fmod","hypot","fmin","fmax","y0","y1","yn","j0","j1","jn","gamma","lgamma","tgamma",
    "index","rindex","random","signal","raise","sleep","read","write","open","close","link","unlink","select","send","recv",
    "socket","bind","listen","accept","connect","wait","kill","fork","pipe","dup","swab","strlen","strcpy","strcmp","memcpy",
    "memset","isdigit","isalpha","isspace","toupper","tolower","isupper","islower","ispunct","isalnum","isprint","qsort",
    "bsearch","labs","ldiv","nan","erf","erfc","frexp","ldexp","modf","signbit","isnan","isinf","isfinite","sort","count",
    "find","copy","move","swap","min","max","clamp","gcd","lcm","fill","reverse","rotate","unique","accumulate","exchange",
    "data","size","empty","begin","end","distance","next","prev","advance","ref","cref","get","tie","visit","stoi","stod",
    "to_string","getline","quick_exit","atexit","alarm","pause","nice","chdir","rmdir","mkdir","stat","truncate","access"};
  return s;
}
std::string Ident(const std::string& n) {
  if (CppReserved().count(n)) return n + "_";
  if (n.size() >= 2 && n[0] == '_' && (std::isupper((unsigned char)n[1]) || n[1] == '_')) return "u" + n;
  return n;
}
std::string GlobalIdent(const std::string& n) {
  std::string r = Ident(n);
  if (CGlobalNames().count(r)) r += "_";
  return r;
}

std::string Escape(const std::string& s) {
  std::string o;
  for (unsigned char c : s) {
    switch (c) {
      case '\\': o += "\\\\"; break;
      case '"': o += "\\\""; break;
      case '\n': o += "\\n"; break;
      case '\t': o += "\\t"; break;
      case '\r': o += "\\r"; break;
      case '\0': o += "\\0"; break;
      default:
        if (c < 32 || c == 127) { char b[8]; std::snprintf(b, sizeof b, "\\x%02x\"\"", c); o += b; }
        else o += (char)c;
    }
  }
  return o;
}
std::string StrLit(const std::string& s) { return "\"" + Escape(s) + "\""; }
std::string ChrLit(char c) {
  switch (c) {
    case '\'': return "'\\''";
    case '\\': return "'\\\\'";
    case '\n': return "'\\n'";
    case '\t': return "'\\t'";
    case '\r': return "'\\r'";
    case '\0': return "'\\0'";
    default: break;
  }
  if ((unsigned char)c < 32 || (unsigned char)c >= 127) { char b[16]; std::snprintf(b, sizeof b, "char(%d)", (int)(unsigned char)c); return b; }
  return std::string("'") + c + "'";
}
std::string DblLit(double d) {
  if (std::isinf(d)) return d < 0 ? "-HUGE_VAL" : "HUGE_VAL";
  if (std::isnan(d)) return "NAN";
  char buf[64];
  for (int p = 1; p <= 17; ++p) { std::snprintf(buf, sizeof buf, "%.*g", p, d); if (std::strtod(buf, nullptr) == d) break; }
  std::string s = buf;
  if (s.find_first_of(".en") == std::string::npos) s += ".0";
  return s;
}

// ====================================================================== kinds
std::string Head(const Type* t) { return t ? t->head : std::string(); }
const Type* Arg(const Type* t, size_t k) { return t && k < t->args.size() ? t->args[k] : nullptr; }
bool IsInt(const Type* t) {
  std::string h = Head(t);
  return h == "num" || h == "big" || h == "sml" || h == "pos" || h == "byt" || h == "pbg";
}
bool IsDecT(const Type* t) { std::string h = Head(t); return h == "dec" || h == "flo"; }
bool IsNumT(const Type* t) { return IsInt(t) || IsDecT(t); }
bool IsTxt(const Type* t) { return Head(t) == "txt"; }
bool IsListHead(const std::string& h) { return h == "vec" || h == "lst" || h == "dqu" || h == "arr"; }
bool IsMapHead(const std::string& h) { return h == "map" || h == "hsh"; }
bool IsSetHead(const std::string& h) { return h == "set" || h == "bag"; }
bool IsPtrHead(const std::string& h) { return h == "ptr" || h == "own" || h == "shr"; }
int IntRank(const Type* t) {
  std::string h = Head(t);
  if (h == "pos") return 2;
  if (h == "big") return 3;
  if (h == "pbg") return 4;
  return 1;
}
bool SameT(const Type* a, const Type* b) { return a && b && a->text == b->text; }
ClassInfo* ClassOfT(const Type* t) {
  if (!t) return nullptr;
  if (t->cls) return t->cls;
  if (IsPtrHead(t->head) && !t->args.empty()) return t->args[0]->cls;
  return nullptr;
}

// precedence of a C++ expression (bigger binds tighter)
enum Prec { P_ASSIGN = 2, P_COND = 3, P_OR = 4, P_AND = 5, P_BOR = 6, P_XOR = 7, P_BAND = 8, P_EQ = 9, P_REL = 10,
            P_SHIFT = 11, P_ADD = 12, P_MUL = 13, P_UNARY = 15, P_POST = 16, P_ATOM = 100 };

struct X {
  std::string c;            // the C++ text
  const Type* t = nullptr;  // its English++ kind, when known
  int p = P_ATOM;
  bool lit = false;         // a "text" literal (a const char* in C++)
  bool nil = false;
  bool isVoid = false;
  std::string braces;       // a list's {a, b, c}, for making a name with it
  std::string ctor;         // (a, b): what makes a class or a kind, for Dog d(...)
};
X Mk(const std::string& c, const Type* t, int p = P_ATOM) { X x; x.c = c; x.t = t; x.p = p; return x; }
std::string Paren(const X& x, int need) { return x.p < need ? "(" + x.c + ")" : x.c; }

struct Var {
  std::string cpp;
  const Type* t = nullptr;
  bool recursiveLambda = false;
};
struct Scope {
  std::map<std::string, Var> vars;
  bool boundary = false;   // a function starts here: names further out (but the globals) aren't seen
};
struct LoopCtx {
  std::string label;       // the English++ counter / item name (for a ebk now)
  bool isSwitch = false;
  bool breakOut = false, nextOut = false;
  std::string cppLabel;
};
struct FnCtx {
  FuncInfo* fn = nullptr;  // nullptr: main
  bool lambda = false;
};

// ====================================================================== the writer
class Writer {
 public:
  explicit Writer(Program* p) : P(p) {}
  std::string Build();
  std::string missing;      // the first thing that couldn't be written

  // filled by the first pass, used by the second
  std::set<std::string> needEq, needLess, needShow;   // classes compared with == / < , or printed
  bool usesErr = false, mayThrow = false, usesArgs = false;

 private:
  Program* P;
  std::set<std::string> includes;
  std::set<std::string> pieces;
  std::vector<Scope> scopes;
  std::vector<FnCtx> fns;
  ClassInfo* curCls = nullptr;
  std::string curGroup;
  std::vector<std::string>* out = nullptr;
  int depth = 0;
  int tmpCount = 0;
  std::vector<LoopCtx> loops;
  std::vector<std::pair<std::string, std::string>> locks;   // mutex C++ name -> lock name
  const Stmt* curLine = nullptr;
  bool commentDone = false;
  std::map<FuncInfo*, Stmt*> fnStmt;
  std::map<std::string, bool> constMethod;   // method name -> every method with that name can be const

  // ------------------------------------------------------------ small tools
  void Refuse(const std::string& what) {
    if (missing.empty()) missing = what;
    Emit("// C++ View: " + what + " is not in the Web Studio's C++ View yet.");
  }
  X RefuseX(const std::string& what) {
    if (missing.empty()) missing = what;
    X x = Mk("/* " + what + " is not in the C++ View yet */ 0", nullptr);
    return x;
  }
  void Need(const std::string& inc) { includes.insert(inc); }
  bool Rl() const { return P->usesRaylib; }
  // raylib takes text as const char*: a std::string value passes its .c_str()
  std::string RlArgs(const std::vector<X>& a) {
    std::string r;
    for (size_t k = 0; k < a.size(); ++k) {
      std::string c = a[k].c;
      if (Head(a[k].t) == "txt" && !(c.size() > 1 && c[0] == '"' && c.back() == '"')) c = Paren(a[k], P_POST) + ".c_str()";
      r += (k ? ", " : "") + c;
    }
    return r;
  }
  const Type* RlKind(const char* k) { return (k && *k) ? T(k) : nullptr; }
  // a value going into a raylib struct field written with { }: C++ refuses a narrowing there, so say the field's type
  std::string RlFit(const X& x, const char* kind) {
    std::string k = kind ? kind : "";
    std::string c = k == "flo" ? "float" : k == "num" ? "int" : k == "byt" ? "unsigned char" : k == "pos" ? "unsigned int" : k == "yno" ? "bool" : "";
    if (c.empty() || (x.t && x.t->text == k)) return x.c;
    bool lit = !x.c.empty() && x.c.find_first_not_of("0123456789.e+-") == std::string::npos;
    if (lit && (k == "flo" || x.c.find_first_of(".e") == std::string::npos)) return x.c;
    return "static_cast<" + c + ">(" + x.c + ")";
  }
  void Use(const std::string& piece) {
    if (pieces.count(piece)) return;
    for (const Piece& pc : kPieces) {
      if (piece != pc.name) continue;
      pieces.insert(piece);
      std::istringstream d(pc.deps);
      for (std::string w; d >> w;) Use(w);
      std::istringstream in(pc.includes);
      for (std::string w; in >> w;) Need(w);
      return;
    }
  }
  void Emit(const std::string& code) {
    std::string line(depth * 2, ' ');
    line += code;
    if (curLine && !commentDone && !code.empty() && code.rfind("//", 0) != 0) {
      line += "  // " + curLine->who + " " + curLine->root + " " + curLine->what;
      commentDone = true;
    }
    out->push_back(line);
  }
  void Line(const Stmt* s) { curLine = s; commentDone = false; g_line = s->line; }
  void Push(bool boundary = false) { scopes.push_back(Scope{}); scopes.back().boundary = boundary; }
  void Pop() { scopes.pop_back(); }
  Var* Find(const std::string& n) {
    for (size_t k = scopes.size(); k-- > 1;) {
      auto it = scopes[k].vars.find(n);
      if (it != scopes[k].vars.end()) return &it->second;
      if (scopes[k].boundary) break;
    }
    auto it = scopes[0].vars.find(n);
    if (it != scopes[0].vars.end()) return &it->second;
    return nullptr;
  }
  Var* Declare(const std::string& n, const Type* t, const std::string& cpp = "") {
    Var v; v.cpp = cpp.empty() ? Ident(n) : cpp; v.t = t;
    scopes.back().vars[n] = v;
    return &scopes.back().vars[n];
  }
  const Type* T(const std::string& text) {
    std::string saved = P->curGroup;
    P->curGroup = curGroup;
    const Type* t = nullptr;
    int line = g_line;
    CatchProblem([&] { t = TryParseType(text); });
    g_line = line;
    P->curGroup = saved;
    return t;
  }
  const Type* VecOf(const Type* e) { return T("vec@" + (e ? e->text : std::string("num"))); }
  std::string Fresh(const std::string& base) { return base + "_" + std::to_string(++tmpCount); }

  // a field of the class we are in (or of its parents)
  const FieldInfo* FieldOf(ClassInfo* c, const std::string& n) {
    if (!c) return nullptr;
    for (auto& f : c->all) { const FieldInfo& fi = f.first->own[f.second]; if (fi.name == n) return &fi; }
    return nullptr;
  }
  Stmt* StaticOf(ClassInfo* c, const std::string& n) {
    for (; c; c = c->parents.empty() ? nullptr : c->parents[0]) {
      for (auto& sp : P->stmts) if (sp->root == "dsh" && sp->who == n && sp->parent && sp->parent->cls == c) return sp.get();
    }
    return nullptr;
  }
  const Type* StaticType(Stmt* s) {
    if (s->x) {
      switch (s->x->k) {
        case E::Int: return s->x->ik == IK_BIG ? TY_BIG : TY_NUM;
        case E::Dbl: return TY_DEC;
        case E::Str: return TY_TXT;
        case E::Bool: return TY_YNO;
        case E::Chr: return TY_LTR;
        default: return nullptr;
      }
    }
    return T(s->what);
  }
  std::string ClassName(const ClassInfo* c) {
    std::string n = Ident(c->name);
    if (!c->group.empty() && c->group != curGroup) n = Ident(c->group) + "::" + n;
    return n;
  }
  std::string EnumName(const EnumInfo* e) {
    std::string n = Ident(e->name);
    // an enum made inside a class
    for (auto& cp : P->classStore)
      for (auto& sp : P->stmts)
        if (sp->root == "den" && sp->who == e->name && sp->parent && sp->parent->cls == cp.get())
          return (curCls == cp.get() ? "" : ClassName(cp.get()) + "::") + n;
    if (!e->group.empty() && e->group != curGroup) n = Ident(e->group) + "::" + n;
    return n;
  }

  // ------------------------------------------------------------ kinds as C++
  std::string Cpp(const Type* t) {
    if (!t) return "auto";
    if (t->param) return Ident(t->head);
    if (t->cls) {
      std::string n = ClassName(t->cls);
      if (!t->args.empty()) {
        n += "<";
        for (size_t k = 0; k < t->args.size(); ++k) n += (k ? ", " : "") + Cpp(t->args[k]);
        n += ">";
      }
      return n;
    }
    if (t->en) return EnumName(t->en);
    if (t->nat) return t->text;
    const std::string& h = t->head;
    auto a = [&](size_t k) { return Cpp(Arg(t, k)); };
    if (h == "num") return "int";
    if (h == "big") return "long long";
    if (h == "sml") return "short";
    if (h == "pos") return "unsigned";
    if (h == "byt") return "unsigned char";
    if (h == "pbg") return "unsigned long long";
    if (h == "hug") { Use("hug"); return "epp::Hug"; }
    if (h == "dec") return "double";
    if (h == "flo") return "float";
    if (h == "cpx") { Need("<complex>"); return "std::complex<double>"; }
    if (h == "txt") { Need("<string>"); return "std::string"; }
    if (h == "ltr") return "char";
    if (h == "yno") return "bool";
    if (h == "any") return "auto";
    if (h == "now") return "void";
    if (h == "mtx") { Need("<mutex>"); return "std::mutex"; }
    if (h == "cnd") { Need("<condition_variable>"); return "std::condition_variable"; }
    if (h == "thd") { Need("<thread>"); return "std::thread"; }
    if (h == "ifs") { Need("<fstream>"); return "std::ifstream"; }
    if (h == "ofs") { Need("<fstream>"); return "std::ofstream"; }
    if (h == "exn") { Need("<stdexcept>"); return "std::exception"; }
    if (h == "vec") { Need("<vector>"); return "std::vector<" + a(0) + ">"; }
    if (h == "lst") { Need("<list>"); return "std::list<" + a(0) + ">"; }
    if (h == "dqu") { Need("<deque>"); return "std::deque<" + a(0) + ">"; }
    if (h == "arr") { Need("<array>"); return "std::array<" + a(0) + ", " + std::to_string(t->n) + ">"; }
    if (h == "stk") { Need("<stack>"); return "std::stack<" + a(0) + ">"; }
    if (h == "que") { Need("<queue>"); return "std::queue<" + a(0) + ">"; }
    if (h == "hep") { Need("<queue>"); return "std::priority_queue<" + a(0) + ">"; }
    if (h == "mhp") { Need("<queue>"); Need("<vector>"); Need("<functional>"); return "std::priority_queue<" + a(0) + ", std::vector<" + a(0) + ">, std::greater<" + a(0) + ">>"; }
    if (h == "set") { Need("<set>"); return "std::set<" + a(0) + ">"; }
    if (h == "map") { Need("<map>"); return "std::map<" + a(0) + ", " + a(1) + ">"; }
    if (h == "hsh") { Need("<unordered_map>"); return "std::unordered_map<" + a(0) + ", " + a(1) + ">"; }
    if (h == "bag") { Need("<unordered_set>"); return "std::unordered_set<" + a(0) + ">"; }
    if (h == "par") { Need("<utility>"); return "std::pair<" + a(0) + ", " + a(1) + ">"; }
    if (h == "tup") {
      Need("<tuple>");
      std::string r = "std::tuple<";
      for (size_t k = 0; k < t->args.size(); ++k) r += (k ? ", " : "") + a(k);
      return r + ">";
    }
    if (h == "opt") { Need("<optional>"); return "std::optional<" + a(0) + ">"; }
    if (h == "alt") {
      Need("<variant>");
      std::string r = "std::variant<";
      for (size_t k = 0; k < t->args.size(); ++k) r += (k ? ", " : "") + a(k);
      return r + ">";
    }
    if (h == "own") { Need("<memory>"); return "std::unique_ptr<" + a(0) + ">"; }
    if (h == "shr") { Need("<memory>"); return "std::shared_ptr<" + a(0) + ">"; }
    if (h == "ptr") return a(0) + "*";
    if (h == "atm") { Need("<atomic>"); return "std::atomic<" + a(0) + ">"; }
    if (h == "fut") { Need("<future>"); return "std::future<" + (Arg(t, 0) && Head(Arg(t, 0)) != "any" ? a(0) : std::string("int")) + ">"; }
    if (h == "chn") { Use("channel"); return "epp::Channel<" + a(0) + ">"; }
    if (h == "gnr") { Use("generator"); return "epp::Generator<" + a(0) + ">"; }
    if (h == "fun") {
      Need("<functional>");
      if (t->args.empty() || Head(Arg(t, 0)) == "any") return "auto";
      std::string r = "std::function<" + a(0) + "(";
      for (size_t k = 1; k < t->args.size(); ++k) r += (k > 1 ? ", " : "") + a(k);
      return r + ")>";
    }
    if (h == "jsn") { RefuseX("jsn (JSON values)"); return "int"; }
    RefuseX("the kind " + t->text);
    return "int";
  }
  // what a name of this kind starts at, written after the name: " = 0", "" (its own empty value)
  std::string DefaultInit(const Type* t) {
    if (!t) return " = 0";
    if (t->param) return "{}";
    const std::string& h = t->head;
    if (IsInt(t)) return " = 0";
    if (h == "dec") return " = 0.0";
    if (h == "flo") return " = 0.0f";
    if (h == "yno") return " = false";
    if (h == "ltr") return " = '\\0'";
    if (h == "ptr") return " = nullptr";
    if (h == "atm") return "{}";
    if (t->en) return "{}";
    if (h == "arr" || h == "par" || h == "tup") return "{}";
    return "";
  }
  // the value: int{}, std::vector<int>{}
  std::string DefaultExpr(const Type* t) {
    if (!t) return "0";
    if (IsInt(t)) return Head(t) == "num" ? "0" : Cpp(t) + "(0)";
    if (Head(t) == "dec") return "0.0";
    if (Head(t) == "yno") return "false";
    if (Head(t) == "txt") return "std::string()";
    if (Head(t) == "ptr") return "nullptr";
    return Cpp(t) + "{}";
  }

  // ------------------------------------------------------------ showing values
  // hsh and bag keep the order things were added in the Studio; std::unordered_* don't,
  // so anything that shows that order is refused
  bool HasHash(const Type* t) {
    if (!t) return false;
    if (t->head == "hsh" || t->head == "bag") return true;
    for (auto* a : t->args) if (HasHash(a)) return true;
    return false;
  }
  void OrderSeen(const Type* t) { if (HasHash(t)) RefuseX("the order of a hsh or a bag (the Studio keeps the order things were added; std::unordered_map doesn't)"); }
  void MarkShow(const Type* t) {
    if (!t) return;
    if (t->en) needShow.insert("enum:" + t->en->name);
    if (t->cls) {
      if (!needShow.count(t->cls->name)) {
        needShow.insert(t->cls->name);
        for (auto& f : t->cls->all) MarkShow(f.first->own[f.second].type);
      }
    }
    for (auto* a : t->args) MarkShow(a);
    if (IsListHead(t->head) || IsMapHead(t->head) || IsSetHead(t->head) || t->head == "par" || t->head == "tup" ||
        t->head == "opt" || t->head == "alt")
      Use("show");
  }
  X AsText(const X& x) {
    const Type* t = x.t;
    OrderSeen(t);
    std::string h = Head(t);
    if (h == "txt") return x;
    if (IsInt(t)) { Need("<string>"); return Mk("std::to_string(" + (h == "byt" ? "int(" + x.c + ")" : x.c) + ")", TY_TXT); }
    if (h == "yno") { X r = Mk("(" + Paren(x, P_COND + 1) + " ? \"yes\" : \"nay\")", TY_TXT); r.lit = true; return r; }
    if (h == "ltr") { Need("<string>"); return Mk("std::string(1, " + x.c + ")", TY_TXT); }
    if (h == "exn") return Mk("std::string(" + Paren(x, P_POST) + ".what())", TY_TXT);
    MarkShow(t);
    Use("show");
    return Mk("epp::text(" + x.c + ")", TY_TXT);
  }
  std::string AsStream(const X& x) {
    const Type* t = x.t;
    OrderSeen(t);
    std::string h = Head(t);
    if (x.lit) return x.c;
    if (h == "yno") return "(" + Paren(x, P_COND + 1) + " ? \"yes\" : \"nay\")";
    if (h == "byt") return "int(" + x.c + ")";
    if (h == "exn") return Paren(x, P_POST) + ".what()";
    if (h == "fun") return "\"function\"";
    if (h == "stk" || h == "que" || h == "hep" || h == "mhp") { RefuseX("printing a whole stack, queue or heap"); return "0"; }
    if (!t || t->param || h == "any") { Use("show"); return "epp::text(" + x.c + ")"; }
    MarkShow(t);
    return Paren(x, P_ADD);
  }
  // a std::string (not a "literal") for joining with +
  std::string AsString(const X& x) {
    if (x.lit) return "std::string(" + x.c + ")";
    return Paren(x, P_ADD);
  }

  // ------------------------------------------------------------ values
  X Value(const Expr* e) {
    switch (e->k) {
      case E::Int: {
        std::string s = std::to_string(e->i);
        if (e->ik == IK_PBG) return Mk(std::to_string((unsigned long long)e->i) + "ULL", TY_PBG);
        if (e->ik == IK_BIG) { if (e->i == INT64_MIN) return Mk("(-9223372036854775807LL - 1)", TY_BIG); return Mk(s + "LL", TY_BIG, e->i < 0 ? P_UNARY : P_ATOM); }
        if (e->i == INT32_MIN) return Mk("(-2147483647 - 1)", TY_NUM);
        return Mk(s, TY_NUM, e->i < 0 ? P_UNARY : P_ATOM);
      }
      case E::Dbl: { std::string s = DblLit(e->d); return Mk(s, TY_DEC, s[0] == '-' ? P_UNARY : P_ATOM); }
      case E::Str: { X x = Mk(StrLit(e->s), TY_TXT); x.lit = true; Need("<string>"); return x; }
      case E::Interp: return Interp(e);
      case E::Chr: return Mk(ChrLit((char)e->i), TY_LTR);
      case E::Bool: return Mk(e->i ? "true" : "false", TY_YNO);
      case E::Nil: { X x = Mk("nullptr", nullptr); x.nil = true; return x; }
      case E::Now: { X x = Mk("", nullptr); x.isVoid = true; return x; }
      case E::Name: return Name(e);
      case E::At: return At(e);
      case E::Call: return Call(e);
      case E::Unary: {
        X a = Value(e->kids[0].get());
        if (e->s == "!") return Mk("!" + Paren(a, P_UNARY), TY_YNO, P_UNARY);
        const Type* t = a.t;
        if (Head(t) == "sml" || Head(t) == "byt" || Head(t) == "ltr" || Head(t) == "yno") t = TY_NUM;
        return Mk("-" + Paren(a, P_UNARY), t, P_UNARY);
      }
      case E::Deref: {
        X a = Value(e->kids[0].get());
        return Mk("*" + Paren(a, P_UNARY), Arg(a.t, 0), P_UNARY);
      }
      case E::Binary: return Binary(e->s, Value(e->kids[0].get()), Value(e->kids[1].get()));
      case E::List: return List(e, nullptr);
      case E::Kind: { X x = Mk(DefaultExpr(e->type), e->type); return x; }
      case E::AtCall: break;
    }
    return RefuseX("this value");
  }
  X List(const Expr* e, const Type* want) {
    std::vector<X> items;
    for (auto& k : e->kids) items.push_back(Value(k.get()));
    const Type* et = want && !want->args.empty() ? want->args[0] : (items.empty() ? TY_NUM : items[0].t);
    std::string br = "{";
    for (size_t k = 0; k < items.size(); ++k) br += (k ? ", " : "") + Fit(items[k], et);
    br += "}";
    const Type* vt = want ? want : VecOf(et);
    X x = Mk(Cpp(vt) + br, vt);
    x.braces = br;
    return x;
  }
  X Interp(const Expr* e) {
    std::vector<X> parts;
    for (auto& k : e->kids) {
      if (k->k == E::Str) { if (k->s.empty()) continue; X x = Mk(StrLit(k->s), TY_TXT); x.lit = true; parts.push_back(x); }
      else parts.push_back(AsText(Value(k.get())));
    }
    Need("<string>");
    if (parts.empty()) { X x = Mk("\"\"", TY_TXT); x.lit = true; return x; }
    if (parts.size() == 1) return parts[0];
    std::string c;
    for (size_t k = 0; k < parts.size(); ++k) {
      if (k == 0) c = AsString(parts[0]);
      else c += " + " + Paren(parts[k], P_MUL);
    }
    return Mk(c, TY_TXT, P_ADD);
  }

  // a value made to fit a place of kind t
  std::string Fit(const X& x, const Type* t) {
    std::string h = Head(t);
    if (x.c == "this" && t && h != "ptr") return "*this";
    if (x.nil) {
      if (h == "opt") return "std::nullopt";
      if (h == "own" || h == "shr" || h == "fun") return "nullptr";
      return "nullptr";
    }
    if ((h == "own" || h == "thd" || h == "fut") && !x.ctor.empty()) return x.c;
    if (h == "own" || h == "thd" || h == "fut" || (h == "vec" && Head(Arg(t, 0)) == "own")) {
      if (x.p == P_ATOM && Find(x.c) == nullptr) {}
      if (IsNameExpr(x)) { Need("<utility>"); return "std::move(" + x.c + ")"; }
    }
    if (h == "txt" && x.lit) return x.c;
    if (h == "hug" && IsInt(x.t)) return x.c;
    return x.c;
  }
  bool IsNameExpr(const X& x) {
    for (char c : x.c) if (!(std::isalnum((unsigned char)c) || c == '_' || c == '.' || c == '[' || c == ']' || c == '>' || c == '-')) return false;
    return !x.c.empty() && !x.lit && !std::isdigit((unsigned char)x.c[0]);
  }

  X Binary(const std::string& op, X a, X b) {
    if (op == "&&") return Mk(Paren(a, P_AND) + " && " + Paren(b, P_AND + 1), TY_YNO, P_AND);
    if (op == "||") return Mk(Paren(a, P_OR) + " || " + Paren(b, P_OR + 1), TY_YNO, P_OR);
    bool cmp = op == "==" || op == "!=" || op == "<" || op == "<=" || op == ">" || op == ">=";
    if (cmp) {
      if (a.lit && b.lit) a.c = "std::string(" + a.c + ")";
      if (op == "==" || op == "!=") {
        if (ClassInfo* c = a.t ? a.t->cls : nullptr) if (!c->findOp(op) && !c->findOp("==")) needEq.insert(c->name);
      } else {
        if (ClassInfo* c = a.t ? a.t->cls : nullptr) if (!c->findOp(op) && !c->findOp("<")) needLess.insert(c->name);
      }
      if (b.nil && Head(a.t) == "opt") b.c = "std::nullopt";
      int pr = (op == "==" || op == "!=") ? P_EQ : P_REL;
      return Mk(Paren(a, pr) + " " + op + " " + Paren(b, pr + 1), TY_YNO, pr);
    }
    const Type* ta = a.t;
    const Type* tb = b.t;
    std::string ha = Head(ta), hb = Head(tb);
    int pr = (op == "+" || op == "-") ? P_ADD : P_MUL;
    if (ha == "txt" || hb == "txt") {
      if (a.lit && (b.lit || hb == "ltr" || hb != "txt")) a.c = "std::string(" + a.c + ")", a.lit = false, a.p = P_ATOM;
      return Mk(Paren(a, pr) + " " + op + " " + Paren(b, pr + 1), TY_TXT, pr);
    }
    if (ClassInfo* c = ta ? ta->cls : nullptr) {
      FuncInfo* f = c->findOp(op);
      return Mk(Paren(a, pr) + " " + op + " " + Paren(b, pr + 1), f && f->ret ? f->ret : ta, pr);
    }
    const Type* rt = nullptr;
    if (ha == "hug" || hb == "hug") { rt = TY_HUG; if (ha != "hug") a.c = "epp::Hug(" + a.c + ")", a.p = P_ATOM; }
    else if (ha == "cpx" || hb == "cpx") rt = TY_CPX;
    else if (IsDecT(ta) || IsDecT(tb)) rt = (ha == "flo" || !IsDecT(ta)) && (hb == "flo" || !IsDecT(tb)) ? T("flo") : TY_DEC;
    else if (IsInt(ta) || IsInt(tb) || ha == "ltr" || hb == "ltr" || ha == "yno" || hb == "yno") {
      int ra = IsInt(ta) ? IntRank(ta) : 1, rb = IsInt(tb) ? IntRank(tb) : 1;
      int r = std::max(ra, rb);
      rt = r == 4 ? TY_PBG : r == 3 ? TY_BIG : r == 2 ? T("pos") : TY_NUM;
      if (op == "/" || op == "%") mayDivide = true;
    } else rt = ta ? ta : tb;
    if (rt == TY_CPX && op != "+" && op != "-" && op != "*" && op != "/") return RefuseX("% on complex numbers");
    if (IsDecT(rt) && op == "%") return RefuseX("% on decimals");
    return Mk(Paren(a, pr) + " " + op + " " + Paren(b, pr + 1), rt, pr);
  }
  bool mayDivide = false;

  // ------------------------------------------------------------ names
  std::string FnGroup(FuncInfo* f) {
    for (auto& kv : P->funcs) if (kv.second == f) { size_t c = kv.first.find("::"); return c == std::string::npos ? "" : kv.first.substr(0, c); }
    return "";
  }
  std::string FnName(FuncInfo* f) {
    if (f->cls) return Ident(f->name);
    std::string g = FnGroup(f);
    std::string n = GlobalIdent(f->name);
    if (!g.empty() && g != curGroup) n = Ident(g) + "::" + n;
    return n;
  }
  FuncInfo* FindFn(const std::string& n) {
    if (!curGroup.empty()) { auto it = P->funcs.find(curGroup + "::" + n); if (it != P->funcs.end()) return it->second; }
    auto it = P->funcs.find(n);
    return it == P->funcs.end() ? nullptr : it->second;
  }
  ClassInfo* FindClass(const std::string& n) {
    if (!curGroup.empty()) { auto it = P->classes.find(curGroup + "::" + n); if (it != P->classes.end()) return it->second; }
    auto it = P->classes.find(n);
    return it == P->classes.end() ? nullptr : it->second;
  }
  EnumInfo* EnumWith(const std::string& choice, int& ix) {
    for (auto& ep : P->enumStore)
      for (size_t k = 0; k < ep->names.size(); ++k)
        if (ep->names[k] == choice) { ix = (int)k; return ep.get(); }
    return nullptr;
  }
  const Type* EnumType(EnumInfo* e) {
    for (auto& kv : P->enums) if (kv.second == e) { const Type* t = T(kv.first.find("::") == std::string::npos ? kv.first : kv.first.substr(kv.first.find("::") + 2)); if (t && t->en == e) return t; }
    for (auto& kv : P->enums) if (kv.second == e) { std::string q = kv.first; size_t c = q.find("::"); if (c != std::string::npos) q = q.substr(0, c) + "@" + q.substr(c + 2); if (const Type* t = T(q)) return t; }
    return nullptr;
  }
  const Type* FnType(FuncInfo* f) {
    std::string s = "fun@" + (f->ret ? f->ret->text : std::string("now"));
    for (auto& p : f->params) s += "@" + (p.type ? p.type->text : std::string("any"));
    const Type* t = T(s);
    return t ? t : T("fun@any");
  }
  const Type* RetType(FuncInfo* f) {
    if (f->ret) return f->ret;
    return nullptr;
  }
  X Name(const Expr* e) {
    const std::string& n = e->s;
    if (Var* v = Find(n)) return Mk(v->cpp, v->t);
    if (n == "slf" && curCls) return Mk("this", T("ptr@" + curCls->name));
    if (curCls) {
      if (const FieldInfo* f = FieldOf(curCls, n)) return Mk(Ident(n), f->type);
      if (Stmt* st = StaticOf(curCls, n)) return Mk(Ident(n), StaticType(st));
      if (FuncInfo* m = curCls->findMethod(n)) return Mk(Ident(n), FnType(m));
    }
    if (FuncInfo* f = FindFn(n)) return Mk(FnName(f), FnType(f));
    int ix;
    if (EnumInfo* en = EnumWith(n, ix)) return Mk(EnumName(en) + "::" + Ident(n), EnumType(en));
    if (IsValueWord(n)) { std::vector<X> none; return Word(n, none); }
    if (const Type* t = T(n)) return Mk(DefaultExpr(t), t);
    if (Rl()) if (const RlName* r = RlFind(kRlConsts, n)) return Mk(n, RlKind(r->kind));
    return RefuseX("the name " + n + " here");
  }

  const Type* ElemOf(const Type* t) {
    std::string h = Head(t);
    if (h == "txt") return TY_LTR;
    if (IsMapHead(h)) return T("par@" + (Arg(t, 0) ? Arg(t, 0)->text : "num") + "@" + (Arg(t, 1) ? Arg(t, 1)->text : "num"));
    return Arg(t, 0);
  }
  std::string Dot(const X& b) {
    std::string h = Head(b.t);
    return Paren(b, P_POST) + (IsPtrHead(h) ? "->" : ".");
  }
  ClassInfo* ClassOf(const X& b) { return ClassOfT(b.t); }
  // a method that takes nothing (or only values with defaults): rex@speak runs it
  bool NoArgMethod(FuncInfo* m) {
    for (auto& pr : m->params) if (!pr.def && !pr.pack) return false;
    return true;
  }
  const Type* SubstT(const Type* ft, const Type* objT, ClassInfo* owner) {
    if (ft && ft->param && owner && objT) {
      for (size_t j = 0; j < owner->tparams.size() && j < objT->args.size(); ++j) if (owner->tparams[j] == ft->head) return objT->args[j];
    }
    return ft;
  }

  X At(const Expr* e) {
    const Expr* be = e->kids[0].get();
    const std::string& m = e->s;
    // group@thing, Class@shared, Enum@choice
    if (be->k == E::Name && !Find(be->s) && be->s != "slf" && !m.empty() && !(curCls && FieldOf(curCls, be->s))) {
      if (P->groups.count(be->s)) {
        std::string q = be->s + "::" + m;
        if (Var* g = Find(q)) return Mk(Ident(be->s) + "::" + Ident(m), g->t);
        auto f = P->funcs.find(q);
        if (f != P->funcs.end()) return Mk(Ident(be->s) + "::" + GlobalIdent(m), FnType(f->second));
        return RefuseX(be->s + "@" + m);
      }
      if (ClassInfo* c = FindClass(be->s)) {
        if (Stmt* st = StaticOf(c, m)) return Mk(ClassName(c) + "::" + Ident(m), StaticType(st));
        if (FuncInfo* f = c->findMethod(m)) return Mk("&" + ClassName(c) + "::" + Ident(m), FnType(f));
        return RefuseX(be->s + "@" + m);
      }
      auto ei = P->enums.find(curGroup.empty() ? be->s : curGroup + "::" + be->s);
      if (ei == P->enums.end()) ei = P->enums.find(be->s);
      if (ei != P->enums.end()) return Mk(EnumName(ei->second) + "::" + Ident(m), EnumType(ei->second));
      if (be->s == "std") return RefuseX("std@" + m);
    }
    // group@Enum@choice
    if (be->k == E::At && !m.empty() && be->kids[0]->k == E::Name && P->groups.count(be->kids[0]->s) && !be->s.empty()) {
      auto ei = P->enums.find(be->kids[0]->s + "::" + be->s);
      if (ei != P->enums.end()) return Mk(Ident(be->kids[0]->s) + "::" + Ident(be->s) + "::" + Ident(m), EnumType(ei->second));
    }
    X b = Value(be);
    std::string h = Head(b.t);
    if (Head(b.t) == "ptr" && Arg(b.t, 0) && !ClassOf(b)) { b = Mk("*" + Paren(b, P_UNARY), Arg(b.t, 0), P_UNARY); h = Head(b.t); }
    // a raylib struct's field: cam@position, m@x (wins over a variable that happens to be called x)
    if (Rl() && !m.empty() && b.t && b.t->nat && e->kids.size() == 1)
      if (const RlName* r = RlFind(kRlFields, b.t->text + "@" + m)) return Mk(Paren(b, P_POST) + "." + m, RlKind(r->kind), P_POST);
    // a member: a field, a method that takes nothing, or a C++ word on a library kind
    bool isIndexName = !m.empty() && Find(m) != nullptr && !(ClassOf(b) && (FieldOf(ClassOf(b), m) || ClassOf(b)->findMethod(m)));
    if (!m.empty() && !isIndexName) {
      if (IsPtrHead(h) && (m == "use_count" || m == "get")) return Mk(Paren(b, P_POST) + "." + m + "()", m == "get" ? T("ptr@" + (Arg(b.t, 0) ? Arg(b.t, 0)->text : "num")) : TY_BIG, P_POST);
      if (ClassInfo* c = ClassOf(b)) {
        if (const FieldInfo* f = FieldOf(c, m)) {
          ClassInfo* owner = nullptr;
          for (auto& fa : c->all) if (fa.first->own[fa.second].name == m) owner = fa.first;
          const Type* objT = IsPtrHead(h) ? Arg(b.t, 0) : b.t;
          return Mk(Dot(b) + Ident(m), SubstT(f->type, objT, owner), P_POST);
        }
        if (Stmt* st = StaticOf(c, m)) return Mk(ClassName(c) + "::" + Ident(m), StaticType(st));
        if (FuncInfo* f = c->findMethod(m)) {
          if (NoArgMethod(f)) return Mk(Dot(b) + Ident(m) + "()", RetType(f), P_POST);
          return RefuseX("a method kept as a value (" + m + ")");
        }
        return RefuseX(c->name + "@" + m);
      }
      std::vector<X> none;
      return Method(b, m, none);
    }
    // a position or a key
    X key;
    if (e->kids.size() > 1) key = Value(e->kids[1].get());
    else if (isIndexName) { Var* iv = Find(m); key = Mk(iv->cpp, iv->t); }
    else return RefuseX("this @");
    if (h == "txt") return Mk(Paren(b, P_POST) + "[" + key.c + "]", TY_LTR, P_POST);
    if (IsMapHead(h)) return Mk(Paren(b, P_POST) + "[" + Fit(key, Arg(b.t, 0)) + "]", Arg(b.t, 1), P_POST);
    if (h == "vec" || h == "dqu" || h == "arr") return Mk(Paren(b, P_POST) + "[" + key.c + "]", Arg(b.t, 0), P_POST);
    if (h == "lst") { Need("<iterator>"); return Mk("*std::next(" + Paren(b, P_POST) + ".begin(), " + key.c + ")", Arg(b.t, 0), P_UNARY); }
    if (h == "par" || h == "tup") {
      if (e->kids.size() > 1 && e->kids[1]->k == E::Int) {
        size_t k = (size_t)e->kids[1]->i;
        if (h == "par") return Mk(Paren(b, P_POST) + (k == 0 ? ".first" : ".second"), Arg(b.t, k), P_POST);
        Need("<tuple>");
        return Mk("std::get<" + std::to_string(k) + ">(" + b.c + ")", Arg(b.t, k));
      }
      return RefuseX("a tuple read at a place that isn't a number written in the line");
    }
    if (ClassInfo* c = ClassOf(b)) {
      FuncInfo* at = c->findOp("at");
      if (at) return Mk(Paren(b, P_POST) + "[" + key.c + "]", at->ret, P_POST);
    }
    if (!b.t) return Mk(Paren(b, P_POST) + "[" + key.c + "]", nullptr, P_POST);
    return RefuseX("reading a place in " + b.t->text);
  }

  // ------------------------------------------------------------ C++ words on library kinds: v@size, s@top, o@value_or&0
  X Method(const X& b, const std::string& m, std::vector<X>& a) {
    std::string h = Head(b.t);
    std::string pb = Paren(b, P_POST);
    std::string d = IsPtrHead(h) ? pb + "->" : pb + ".";
    auto args = [&](size_t from = 0) { std::string r; for (size_t k = from; k < a.size(); ++k) r += (k > from ? ", " : "") + a[k].c; return r; };
    auto call = [&](const std::string& name, const Type* t) { return Mk(pb + "." + name + "(" + args() + ")", t, P_POST); };
    auto arg0 = [&](const Type* t) { return a.empty() ? std::string("0") : Fit(a[0], t); };
    const Type* e0 = Arg(b.t, 0);
    bool keyed = IsMapHead(h) || IsSetHead(h);
    bool coll = IsListHead(h) || keyed || h == "stk" || h == "que" || h == "hep" || h == "mhp" || h == "chn";
    if (IsPtrHead(h)) {
      if (m == "use_count") return Mk(pb + ".use_count()", TY_BIG, P_POST);
      if (m == "get") return Mk(pb + ".get()", T("ptr@" + (e0 ? e0->text : "num")), P_POST);
      if (m == "reset") return Mk(pb + ".reset()", nullptr, P_POST);
      if (m == "release") return Mk(pb + ".release()", T("ptr@" + (e0 ? e0->text : "num")), P_POST);
    }
    if (coll) {
      Need("<iterator>");
      if (m == "size") return Mk("std::ssize(" + b.c + ")", TY_BIG);
      if (m == "empty") return call("empty", TY_YNO);
      if (m == "clear") return call("clear", nullptr);
      if (m == "push_back" || m == "push" || m == "send" || m == "add" || m == "insert") {
        if (IsMapHead(h)) return Mk(pb + ".insert({" + args() + "})", nullptr, P_POST);
        if (IsSetHead(h)) return Mk(pb + ".insert(" + arg0(e0) + ")", nullptr, P_POST);
        std::string w = (h == "stk" || h == "que" || h == "hep" || h == "mhp" || h == "chn") ? "push" : "push_back";
        return Mk(pb + "." + w + "(" + arg0(e0) + ")", nullptr, P_POST);
      }
      if (m == "pop_back" || m == "pop") return Mk(pb + "." + ((h == "stk" || h == "que" || h == "hep" || h == "mhp") ? "pop" : "pop_back") + "()", nullptr, P_POST);
      if (m == "top") return Mk(pb + "." + (h == "que" ? "front" : "top") + "()", e0, P_POST);
      if (m == "front" || m == "back") return Mk(pb + "." + (h == "stk" || h == "hep" || h == "mhp" ? "top" : m) + "()", e0, P_POST);
      if (m == "count" || m == "contains") {
        if (keyed) return Mk(pb + "." + m + "(" + arg0(e0) + ")", m == "count" ? TY_BIG : TY_YNO, P_POST);
        Need("<algorithm>");
        if (m == "count") return Mk("std::count(" + pb + ".begin(), " + pb + ".end(), " + arg0(e0) + ")", TY_BIG);
        return Mk("(std::find(" + pb + ".begin(), " + pb + ".end(), " + arg0(e0) + ") != " + pb + ".end())", TY_YNO);
      }
      if (m == "erase" && keyed) return Mk(pb + ".erase(" + arg0(e0) + ")", TY_BIG, P_POST);
      if (m == "at") { mayThrow = true; return Mk(pb + ".at(" + arg0(IsMapHead(h) ? e0 : TY_NUM) + ")", IsMapHead(h) ? Arg(b.t, 1) : e0, P_POST); }
      if (m == "close" && h == "chn") return call("close", nullptr);
    }
    if (h == "txt") {
      if (m == "size" || m == "length") return Mk("std::ssize(" + b.c + ")", TY_BIG);
      if (m == "empty") return call("empty", TY_YNO);
      if (m == "clear") return call("clear", nullptr);
      if (m == "push_back") return call("push_back", nullptr);
      if (m == "substr") { mayThrow = true; return call("substr", TY_TXT); }
      if (m == "find") return Mk("(long long)" + pb + ".find(" + args() + ")", TY_BIG, P_UNARY);
    }
    if (h == "par" && (m == "first" || m == "second")) return Mk(pb + "." + m, Arg(b.t, m == "first" ? 0 : 1), P_POST);
    if (h == "tup" && (m == "first" || m == "second")) { Need("<tuple>"); return Mk(std::string("std::get<") + (m == "first" ? "0" : "1") + ">(" + b.c + ")", Arg(b.t, m == "first" ? 0 : 1)); }
    if (h == "cpx" && (m == "real" || m == "imag")) return call(m, TY_DEC);
    if (h == "ifs" || h == "ofs") {
      if (m == "close" || m == "open") return call(m, nullptr);
      if (m == "is_open" || m == "good" || m == "eof") return call(m, TY_YNO);
    }
    if (h == "thd" && (m == "join" || m == "detach" || m == "joinable")) return call(m, m == "joinable" ? TY_YNO : nullptr);
    if (h == "fut" && (m == "get" || m == "wait")) return call(m, m == "get" ? Arg(b.t, 0) : nullptr);
    if (h == "mtx" && (m == "lock" || m == "unlock")) return call(m, nullptr);
    if (h == "cnd" && (m == "notify_one" || m == "notify_all")) return call(m, nullptr);
    if (h == "opt") {
      if (m == "value") { mayThrow = true; return call("value", e0); }
      if (m == "value_or") return Mk(pb + ".value_or(" + arg0(e0) + ")", e0, P_POST);
      if (m == "has_value") return call("has_value", TY_YNO);
      if (m == "reset") return call("reset", nullptr);
    }
    if (h == "alt") {
      for (auto* at : b.t->args) if (at && at->text == m) { mayThrow = true; Need("<variant>"); return Mk("std::get<" + Cpp(at) + ">(" + b.c + ")", at); }
      if (m == "index") return Mk("(long long)" + pb + ".index()", TY_BIG, P_UNARY);
    }
    if (h == "atm") {
      if (m == "load") return call("load", e0);
      if (m == "store") return call("store", nullptr);
      if (m == "fetch_add") return call("fetch_add", e0);
    }
    if (!b.t || b.t->param) return Mk(d + m + "(" + args() + ")", nullptr, P_POST);
    return RefuseX(b.t->text + "@" + m);
  }

  // ------------------------------------------------------------ calls
  std::vector<X> Vals(const std::vector<const Expr*>& ex) { std::vector<X> r; for (auto* e : ex) r.push_back(Value(e)); return r; }
  static std::string JoinC(const std::vector<std::string>& v) { std::string r; for (size_t k = 0; k < v.size(); ++k) r += (k ? ", " : "") + v[k]; return r; }
  std::string MoveIfName(const X& x) { if (IsNameExpr(x)) { Need("<utility>"); return "std::move(" + x.c + ")"; } return x.c; }
  std::string CallArgs(FuncInfo* f, const std::vector<const Expr*>& ex) {
    std::vector<std::string> out;
    for (size_t k = 0; k < f->params.size() && k < ex.size(); ++k) {
      const Param& p = f->params[k];
      if (p.pack) {
        if (ex.size() == k + 1) {
          X one = Value(ex[k]);
          std::string h = Head(one.t);
          if (IsListHead(h)) { out.push_back(one.c); break; }
        }
        std::vector<std::string> items;
        for (size_t j = k; j < ex.size(); ++j) items.push_back(Fit(Value(ex[j]), Arg(p.type, 0)));
        out.push_back("{" + JoinC(items) + "}");
        break;
      }
      X a = Value(ex[k]);
      if (a.lit && (!p.type || p.type->param)) { out.push_back("std::string(" + a.c + ")"); continue; }
      if (p.take || (Head(p.type) == "own" && !p.ref && !p.look)) out.push_back(MoveIfName(a));
      else out.push_back(Fit(a, p.type));
    }
    if (ex.size() > f->params.size() && (f->params.empty() || !f->params.back().pack))
      for (size_t k = f->params.size(); k < ex.size(); ++k) out.push_back(Value(ex[k]).c);
    return JoinC(out);
  }
  // a template function's kind: T comes from the value given for the first T parameter
  const Type* CallRet(FuncInfo* f, const std::vector<const Expr*>& ex) {
    if (f->ret) return f->ret;
    if (f->returnsNothing) { return nullptr; }
    auto st = fnStmt.find(f);
    if (st == fnStmt.end()) return nullptr;
    std::string rt = st->second->what;
    for (size_t k = 0; k < f->params.size() && k < ex.size(); ++k) {
      auto ps = std::find_if(st->second->body.begin(), st->second->body.end(), [&](Stmt* b) { return b->root == "dpm" && b->who == f->params[k].name; });
      if (ps != st->second->body.end() && (*ps)->what == rt) return Value(ex[k]).t;
    }
    return nullptr;
  }
  bool Aggregate(ClassInfo* c) {
    if (!c->parents.empty() || !c->ctors.empty() || c->hasVirtual()) return false;
    for (auto& f : c->own) if (f.vis != 0 || f.bits) return false;
    return true;
  }
  std::set<std::string> genCtor;   // classes made with values but with no dmk: the C++ View gives them one
  X Construct(const Type* t, const std::vector<const Expr*>& ex) {
    ClassInfo* c = t->cls;
    std::string name = Cpp(t);
    std::vector<std::string> a;
    if (c->ctors.empty()) {
      size_t k = 0;
      for (auto* e : ex) {
        const Type* ft = nullptr;
        if (k < c->own.size()) ft = c->own[k].type;
        a.push_back(Fit(Value(e), ft));
        ++k;
      }
      if (!a.empty() && Aggregate(c)) { X x = Mk(name + "{" + JoinC(a) + "}", t); x.ctor = "{" + JoinC(a) + "}"; return x; }
      if (!a.empty()) genCtor.insert(c->name);
    } else {
      FuncInfo* best = nullptr;
      for (FuncInfo* f : c->ctors) {
        size_t req = 0; for (auto& p : f->params) if (!p.def) ++req;
        if (ex.size() >= req && ex.size() <= f->params.size()) { if (!best || f->params.size() == ex.size()) best = f; }
      }
      if (best) { std::string s = CallArgs(best, ex); if (!s.empty()) a.push_back(s); }
      else for (auto* e : ex) a.push_back(Value(e).c);
    }
    X x = Mk(name + "(" + JoinC(a) + ")", t, P_POST);
    x.ctor = a.empty() ? "" : "(" + JoinC(a) + ")";
    return x;
  }
  std::string CastTo(const Type* t, const X& a) {
    std::string n = Cpp(t);
    if (n.find(' ') != std::string::npos || n.find("::") != std::string::npos) return "static_cast<" + n + ">(" + a.c + ")";
    return n + "(" + a.c + ")";
  }
  X ApplyKind(const Type* t, const std::vector<const Expr*>& ex) {
    const std::string& h = t->head;
    if (t->cls) return Construct(t, ex);
    if (t->nat) {
      std::vector<X> a = Vals(ex); std::vector<std::string> s;
      std::vector<std::string> fk;
      if (Rl()) if (const RlName* r = RlFind(kRlStructs, t->text)) { std::istringstream in(r->kind); for (std::string w; in >> w;) fk.push_back(w); }
      for (size_t k = 0; k < a.size(); ++k) s.push_back(k < fk.size() ? RlFit(a[k], fk[k].c_str()) : a[k].c);
      return Mk(t->text + "{" + JoinC(s) + "}", t);
    }
    if (IsPtrHead(h)) {
      if (ex.empty()) { X x = Mk("nullptr", t); x.nil = true; return x; }
      X a = Value(ex[0]);
      if (a.nil) { X x = Mk(DefaultExpr(t), t); return x; }
      const Type* want = Arg(t, 0);
      std::string raw = Head(a.t) == "ptr" ? a.c : Paren(a, P_POST) + ".get()";
      if (h == "ptr" && want && want->cls) return Mk("dynamic_cast<" + Cpp(want) + "*>(" + raw + ")", t);
      if (h == "shr" && want && want->cls && Head(a.t) == "shr") return Mk("std::dynamic_pointer_cast<" + Cpp(want) + ">(" + a.c + ")", t);
      return RefuseX(t->text + "&x");
    }
    std::vector<X> a = Vals(ex);
    if (IsListHead(h) || IsSetHead(h)) {
      std::vector<std::string> s; for (auto& x : a) s.push_back(Fit(x, Arg(t, 0)));
      X x = Mk(Cpp(t) + "{" + JoinC(s) + "}", t); x.braces = "{" + JoinC(s) + "}"; return x;
    }
    if (IsMapHead(h)) {
      std::vector<std::string> s;
      for (size_t k = 0; k + 1 < a.size(); k += 2) s.push_back("{" + Fit(a[k], Arg(t, 0)) + ", " + Fit(a[k + 1], Arg(t, 1)) + "}");
      X x = Mk(Cpp(t) + "{" + JoinC(s) + "}", t); x.braces = "{" + JoinC(s) + "}"; return x;
    }
    if (h == "stk" || h == "que" || h == "hep" || h == "mhp" || h == "chn" || h == "atm" || h == "fun" || h == "opt" || h == "alt" || h == "gnr") {
      if (a.empty()) return Mk(DefaultExpr(t), t);
      if (h == "opt" || h == "alt") { X x = Mk(Cpp(t) + "(" + a[0].c + ")", t); x.ctor = "(" + a[0].c + ")"; return x; }
      return RefuseX(t->text + " made with values");
    }
    if (h == "par" || h == "tup") {
      std::vector<std::string> s; for (size_t k = 0; k < a.size(); ++k) s.push_back(Fit(a[k], Arg(t, k)));
      X x = Mk(Cpp(t) + "(" + JoinC(s) + ")", t); x.ctor = "(" + JoinC(s) + ")"; return x;
    }
    if (h == "cpx") {
      std::vector<std::string> s; for (auto& x : a) s.push_back(x.c);
      X x = Mk(Cpp(t) + "(" + JoinC(s) + ")", t); x.ctor = "(" + JoinC(s) + ")"; return x;
    }
    if (h == "hug") {
      Use("hug");
      if (a.size() != 1) return RefuseX("hug&x with more than one value");
      if (IsTxt(a[0].t)) { mayThrow = true; return Mk("epp::Hug(" + AsString(a[0]) + ")", t, P_POST); }
      X x = Mk("epp::Hug(" + a[0].c + ")", t, P_POST); x.ctor = "(" + a[0].c + ")"; return x;
    }
    if (h == "jsn") return RefuseX("jsn (JSON values)");
    if (a.size() != 1) return RefuseX(t->text + "& with " + std::to_string(a.size()) + " values");
    const X& v = a[0];
    if (IsInt(t) && IsTxt(v.t)) {
      if (h != "num") return RefuseX(t->text + "&text");
      Use("tnm"); mayThrow = true;
      return Mk("epp::tnm(" + v.c + ")", t, P_POST);
    }
    if (IsDecT(t) && IsTxt(v.t)) { Use("tnm"); mayThrow = true; return Mk(h == "flo" ? "float(epp::tdc(" + v.c + "))" : "epp::tdc(" + v.c + ")", t, P_POST); }
    if (h == "txt") return AsText(v);
    if (h == "yno") return Mk("bool(" + v.c + ")", t);
    if (IsNumT(t) || h == "ltr" || t->en) {
      if (SameT(t, v.t)) return v;
      return Mk(CastTo(t, v), t, P_POST);
    }
    return RefuseX(t->text + "&x");
  }

  X Call(const Expr* e) {
    const Expr* callee = e->kids[0].get();
    std::vector<const Expr*> ex;
    for (size_t k = 1; k < e->kids.size(); ++k) ex.push_back(e->kids[k].get());
    if (callee->k == E::Kind) return ApplyKind(callee->type, ex);
    if (callee->k == E::Name) {
      const std::string& n = callee->s;
      if (Var* v = Find(n)) {
        std::vector<X> a = Vals(ex);
        std::vector<std::string> s; for (auto& x : a) s.push_back(x.c);
        const Type* rt = nullptr;
        if (Head(v->t) == "fun") rt = Arg(v->t, 0);
        if (ClassInfo* c = v->t ? v->t->cls : nullptr) if (FuncInfo* op = c->findOp("call")) rt = op->ret;
        if (Head(rt) == "now") rt = nullptr;
        return Mk(v->cpp + "(" + JoinC(s) + ")", rt, P_POST);
      }
      if (curCls) if (FuncInfo* m = curCls->findMethod(n)) return Mk(Ident(n) + "(" + CallArgs(m, ex) + ")", CallRet(m, ex), P_POST);
      if (FuncInfo* f = FindFn(n)) return Mk(FnName(f) + "(" + CallArgs(f, ex) + ")", CallRet(f, ex), P_POST);
      if (IsCollectionHead(n) && (!T(n) || ((n == "tup" || n == "par") && T(n)->args.empty()))) {
        if (ex.empty()) return RefuseX("an empty " + n + " that doesn't say what it holds");
        std::vector<X> a = Vals(ex);
        auto kt = [&](size_t k) { const Type* t = k < a.size() ? a[k].t : nullptr; return t ? t->text : std::string("num"); };
        std::string text;
        if (n == "map" || n == "hsh") text = n + "@" + kt(0) + "@" + kt(1);
        else if (n == "par" || n == "tup") { text = n; for (size_t k = 0; k < a.size(); ++k) text += "@" + kt(k); }
        else text = n + "@" + kt(0);
        const Type* t = T(text);
        if (!t) return RefuseX(n + "&...");
        return ApplyKind(t, ex);
      }
      if (const Type* t = T(n)) {
        std::string sg = curGroup;
        if (t->cls) curGroup = t->cls->group;
        X r = ApplyKind(t, ex);
        curGroup = sg;
        return r;
      }
      if (IsValueWord(n)) { std::vector<X> a = Vals(ex); return Word(n, a, ex); }
      if (Rl()) if (const RlName* r = RlFind(kRlFns, n)) {
        if (*r->header) Need(std::string("\"") + r->header + "\"");
        std::vector<X> a = Vals(ex);
        return Mk(n + "(" + RlArgs(a) + ")", RlKind(r->kind), P_POST);
      }
      return RefuseX("calling " + n);
    }
    if (callee->k == E::At) {
      const Expr* be = callee->kids[0].get();
      const std::string& m = callee->s;
      if (be->k == E::Name && !Find(be->s) && be->s != "slf" && !(curCls && FieldOf(curCls, be->s))) {
        if (P->groups.count(be->s)) {
          auto f = P->funcs.find(be->s + "::" + m);
          if (f != P->funcs.end()) {
            std::string sg = curGroup; curGroup = be->s;
            std::string args = CallArgs(f->second, ex);
            const Type* rt = CallRet(f->second, ex);
            curGroup = sg;
            return Mk(Ident(be->s) + "::" + GlobalIdent(m) + "(" + args + ")", rt, P_POST);
          }
          auto c = P->classes.find(be->s + "::" + m);
          if (c != P->classes.end()) {
            std::string sg = curGroup; curGroup = be->s;
            const Type* t = T(m);
            curGroup = sg;
            if (t && t->cls) return Construct(t, ex);
          }
          return RefuseX(be->s + "@" + m);
        }
        if (ClassInfo* c = FindClass(be->s)) {
          if (FuncInfo* f = c->findMethod(m)) return Mk(ClassName(c) + "::" + Ident(m) + "(" + CallArgs(f, ex) + ")", CallRet(f, ex), P_POST);
          return RefuseX(be->s + "@" + m);
        }
        if (be->s == "std") return RefuseX("std@" + m);
      }
      X b = Value(be);
      if (Head(b.t) == "ptr" && Arg(b.t, 0) && !ClassOf(b)) b = Mk("*" + Paren(b, P_UNARY), Arg(b.t, 0), P_UNARY);
      if (ClassInfo* c = ClassOf(b)) {
        if (FuncInfo* f = c->findMethod(m)) return Mk(Dot(b) + Ident(m) + "(" + CallArgs(f, ex) + ")", CallRet(f, ex), P_POST);
        if (const FieldInfo* fi = FieldOf(c, m)) {
          std::vector<X> a = Vals(ex); std::vector<std::string> s; for (auto& x : a) s.push_back(x.c);
          return Mk(Dot(b) + Ident(m) + "(" + JoinC(s) + ")", Arg(fi->type, 0), P_POST);
        }
        return RefuseX(c->name + "@" + m);
      }
      std::vector<X> a = Vals(ex);
      return Method(b, m, a);
    }
    if (callee->k == E::Call) {
      X f = Call(callee);
      std::vector<X> a = Vals(ex); std::vector<std::string> s; for (auto& x : a) s.push_back(x.c);
      return Mk(Paren(f, P_POST) + "(" + JoinC(s) + ")", Head(f.t) == "fun" ? Arg(f.t, 0) : nullptr, P_POST);
    }
    return RefuseX("this call");
  }

  // ------------------------------------------------------------ value words
  std::string TxtArg(const X& x) {
    if (Head(x.t) == "ltr") { Need("<string>"); return "std::string(1, " + x.c + ")"; }
    if (x.t && !IsTxt(x.t)) return AsText(x).c;
    return x.c;
  }
  std::string Dbl(const X& x) { return Head(x.t) == "flo" || (IsInt(x.t) && Head(x.t) != "num") ? "double(" + x.c + ")" : x.c; }
  const Type* WiderInt(const X& a, const X& b) {
    if (IsDecT(a.t) || IsDecT(b.t)) return TY_DEC;
    int r = std::max(IntRank(a.t), IntRank(b.t));
    return r == 4 ? TY_PBG : r == 3 ? TY_BIG : r == 2 ? T("pos") : TY_NUM;
  }
  std::string FnArg(const X& f) { return f.c; }
  X Word(const std::string& w, std::vector<X>& a, const std::vector<const Expr*>& ex = {}) {
    auto need = [&](size_t lo, size_t hi) { return a.size() >= lo && a.size() <= hi; };
    auto beg = [&](const X& c) { return Paren(c, P_POST) + ".begin(), " + Paren(c, P_POST) + ".end()"; };
    const Type* e0 = a.empty() ? nullptr : ElemOf(a[0].t);
    static const std::set<std::string> ordered = {"cky", "cvl", "ctx", "cfr", "cla", "cft", "cmp", "ccu", "cjn", "cps", "cso", "crv", "cra", "czp", "cnu", "crl", "cgr"};
    if (!a.empty() && ordered.count(w)) OrderSeen(a[0].t);
    std::string h0 = a.empty() ? "" : Head(a[0].t);
    Need("<string>");
    // ---- c: collections
    if (w == "cct" && need(1, 1)) {
      if (h0 == "chn") return RefuseX("cct on a " + h0);
      return Mk("int(" + Paren(a[0], P_POST) + ".size())", TY_NUM, P_POST);
    }
    if ((w == "csm" || w == "cpd") && need(1, 1)) {
      Need("<numeric>"); Need("<functional>");
      std::string init = e0 ? (IsInt(e0) && Head(e0) != "num" ? Cpp(e0) + "(" + (w == "csm" ? "0" : "1") + ")" : Head(e0) == "dec" ? (w == "csm" ? "0.0" : "1.0") : Head(e0) == "flo" ? (w == "csm" ? "0.0f" : "1.0f") : w == "csm" ? "0" : "1") : "0";
      if (e0 && !IsNumT(e0)) return RefuseX(w + " on " + e0->text);
      if (w == "csm") return Mk("std::accumulate(" + beg(a[0]) + ", " + init + ")", e0);
      return Mk("std::accumulate(" + beg(a[0]) + ", " + init + ", std::multiplies<>())", e0);
    }
    if ((w == "cmx" || w == "cmn") && need(1, 1)) {
      Need("<algorithm>");
      return Mk(std::string("*std::") + (w == "cmx" ? "max" : "min") + "_element(" + beg(a[0]) + ")", e0, P_UNARY);
    }
    if ((w == "cav" || w == "cme" || w == "cde") && need(1, 1)) { Use("stats"); return Mk("epp::" + w + "(" + a[0].c + ")", TY_DEC, P_POST); }
    if (w == "cps" && need(2, 2)) { Use("listwords"); return Mk("epp::cps(" + a[0].c + ", " + Fit(a[1], e0) + ")", TY_NUM, P_POST); }
    if (w == "chs" && need(2, 2)) {
      if (h0 == "txt") { Use("tfind"); return Mk("epp::ths(" + a[0].c + ", " + TxtArg(a[1]) + ")", TY_YNO, P_POST); }
      if (IsMapHead(h0) || IsSetHead(h0)) return Mk(Paren(a[0], P_POST) + ".contains(" + Fit(a[1], Arg(a[0].t, 0)) + ")", TY_YNO, P_POST);
      Need("<algorithm>");
      return Mk("(std::find(" + beg(a[0]) + ", " + Fit(a[1], e0) + ") != " + Paren(a[0], P_POST) + ".end())", TY_YNO);
    }
    if (w == "chm" && need(2, 2)) { Need("<algorithm>"); return Mk("int(std::count(" + beg(a[0]) + ", " + Fit(a[1], e0) + "))", TY_NUM, P_POST); }
    if ((w == "cfr" || w == "cla") && need(1, 1)) {
      if (IsSetHead(h0) || h0 == "map") return Mk(std::string("*") + Paren(a[0], P_POST) + (w == "cfr" ? ".begin()" : ".rbegin()"), e0, P_UNARY);
      return Mk(Paren(a[0], P_POST) + (w == "cfr" ? ".front()" : ".back()"), e0, P_POST);
    }
    if ((w == "cky" || w == "cvl") && need(1, 1)) { Use("listwords"); return Mk("epp::" + w + "(" + a[0].c + ")", VecOf(Arg(a[0].t, w == "cky" ? 0 : 1)), P_POST); }
    if ((w == "cso" || w == "crv") && need(1, 1)) {
      if (h0 != "txt" && h0 != "vec" && h0 != "dqu" && h0 != "arr") return RefuseX(w + " on a " + h0);
      if (w == "cso" && e0 && e0->cls && !e0->cls->findOp("<")) needLess.insert(e0->cls->name);
      Use("listwords"); return Mk("epp::" + w + "(" + a[0].c + ")", a[0].t, P_POST);
    }
    if ((w == "cft" || w == "cmp") && need(2, 2)) {
      if (w == "cft" && h0 != "vec" && h0 != "lst" && h0 != "dqu") return RefuseX("cft on a " + h0);
      Use("listwords");
      const Type* rt = a[0].t;
      if (w == "cmp") { const Type* r = Head(a[1].t) == "fun" ? Arg(a[1].t, 0) : nullptr; rt = r && Head(r) != "any" ? VecOf(r) : nullptr; }
      return Mk("epp::" + w + "(" + a[0].c + ", " + FnArg(a[1]) + ")", rt, P_POST);
    }
    if ((w == "cea" || w == "can" || w == "cnn") && need(2, 2)) {
      Need("<algorithm>");
      std::string f = w == "cea" ? "all_of" : w == "can" ? "any_of" : "none_of";
      return Mk("std::" + f + "(" + beg(a[0]) + ", " + FnArg(a[1]) + ")", TY_YNO);
    }
    if (w == "ctx" && need(2, 2)) { if (e0) MarkShow(e0); Use("listwords"); return Mk("epp::ctx(" + a[0].c + ", " + TxtArg(a[1]) + ")", TY_TXT, P_POST); }
    if (w == "cra" && need(1, 1)) {
      if (h0 != "vec" && h0 != "arr" && h0 != "dqu") return RefuseX("cra on a " + h0);
      Use("random");
      return Mk(Paren(a[0], P_POST) + "[epp::nra(0, std::ssize(" + a[0].c + ") - 1)]", e0, P_POST);
    }
    if (w == "crl" && need(3, 3)) { Need("<numeric>"); return Mk("std::accumulate(" + beg(a[0]) + ", " + a[1].c + ", " + FnArg(a[2]) + ")", a[1].t); }
    if (w == "czp" && need(2, 2)) { Use("listwords"); return Mk("epp::czp(" + a[0].c + ", " + a[1].c + ")", T("vec@par@" + (e0 ? e0->text : "num") + "@" + (ElemOf(a[1].t) ? ElemOf(a[1].t)->text : "num")), P_POST); }
    if (w == "cnu" && need(1, 1)) { Use("listwords"); return Mk("epp::cnu(" + a[0].c + ")", T("vec@par@num@" + (e0 ? e0->text : "num")), P_POST); }
    if ((w == "cun" || w == "cbt" || w == "cot") && need(2, 2)) { Use("listwords"); return Mk("epp::" + w + "(" + a[0].c + ", " + a[1].c + ")", VecOf(e0), P_POST); }
    if (w == "ccu" && need(2, 3)) {
      Use("listwords");
      const Type* rt = h0 == "vec" ? a[0].t : VecOf(e0);
      if (h0 == "txt") return RefuseX("ccu on text");
      return Mk("epp::ccu(" + a[0].c + ", " + a[1].c + (a.size() > 2 ? ", " + a[2].c : "") + ")", rt, P_POST);
    }
    if (w == "cbf" && need(2, 2)) { Need("<algorithm>"); return Mk("std::binary_search(" + beg(a[0]) + ", " + Fit(a[1], e0) + ")", TY_YNO); }
    if (w == "cpb" && need(2, 2)) { Need("<algorithm>"); return Mk("int(std::lower_bound(" + beg(a[0]) + ", " + Fit(a[1], e0) + ") - " + Paren(a[0], P_POST) + ".begin())", TY_NUM, P_POST); }
    if (w == "cgr" && need(2, 2)) {
      Use("listwords"); Need("<map>");
      const Type* kt = Head(a[1].t) == "fun" ? Arg(a[1].t, 0) : nullptr;
      return Mk("epp::cgr(" + a[0].c + ", " + FnArg(a[1]) + ")", kt ? T("map@" + kt->text + "@vec@" + (e0 ? e0->text : "num")) : nullptr, P_POST);
    }
    if (w == "cjn" && need(1, 1)) { Use("listwords"); return Mk("epp::cjn(" + a[0].c + ")", VecOf(ElemOf(e0)), P_POST); }
    if (w == "crg" && need(2, 3)) { Use("listwords"); return Mk("epp::crg(" + a[0].c + ", " + a[1].c + (a.size() > 2 ? ", " + a[2].c : "") + ")", VecOf(TY_NUM), P_POST); }
    // ---- h: files
    if ((w == "hrd" || w == "hln" || w == "hrb") && need(1, 1)) {
      Use("files"); if (w == "hrd") mayThrow = true;
      return Mk("epp::" + w + "(" + TxtArg(a[0]) + ")", w == "hrd" ? TY_TXT : w == "hln" ? VecOf(TY_TXT) : VecOf(TY_BYT), P_POST);
    }
    if (w == "hex" && need(1, 1)) { Need("<filesystem>"); return Mk("std::filesystem::exists(" + TxtArg(a[0]) + ")", TY_YNO); }
    if (w == "hsz" && need(1, 1)) { Need("<filesystem>"); mayThrow = true; return Mk("(long long)std::filesystem::file_size(" + TxtArg(a[0]) + ")", TY_BIG, P_UNARY); }
    if (w == "hls" && need(1, 1)) { Use("files"); return Mk("epp::hls(" + TxtArg(a[0]) + ")", VecOf(TY_TXT), P_POST); }
    if (w == "iff" && need(3, 3)) {
      const Type* rt = a[1].t;
      std::string x = a[1].c, y = a[2].c;
      if (a[1].lit && a[2].lit) x = "std::string(" + x + ")";
      if (IsNumT(a[1].t) && IsNumT(a[2].t) && !SameT(a[1].t, a[2].t)) rt = WiderInt(a[1], a[2]);
      return Mk("(" + Paren(a[0], P_COND + 1) + " ? " + x + " : " + y + ")", rt);
    }
    // ---- k: the clock
    if ((w == "kel" || w == "kms" || w == "kns") && a.empty()) { Use("clock"); return Mk("epp::" + w + "()", w == "kel" ? TY_DEC : TY_BIG, P_POST); }
    if (w == "kda" || w == "ktm" || w == "kwk" || (w == "kfa" && need(1, 1))) {
      Use("clock");
      std::string f = w == "kda" ? "\"%Y-%m-%d\"" : w == "ktm" ? "\"%H:%M:%S\"" : w == "kwk" ? "\"%A\"" : TxtArg(a[0]);
      return Mk("epp::kfa(" + f + ")", TY_TXT, P_POST);
    }
    if (w == "kyr" || w == "kmo" || w == "kdy" || w == "khr" || w == "kmi" || w == "kse") {
      Use("clock");
      std::string f = w == "kyr" ? "%Y" : w == "kmo" ? "%m" : w == "kdy" ? "%d" : w == "khr" ? "%H" : w == "kmi" ? "%M" : "%S";
      return Mk("std::stoi(epp::kfa(\"" + f + "\"))", TY_NUM, P_POST);
    }
    // ---- n: numbers
    if (w == "nab" && need(1, 1)) {
      Need("<cmath>"); Need("<cstdlib>");
      if (IsInt(a[0].t) && (Head(a[0].t) == "pos" || Head(a[0].t) == "pbg" || Head(a[0].t) == "byt")) return a[0];
      if (IsInt(a[0].t)) return Mk("std::abs(" + a[0].c + ")", Head(a[0].t) == "sml" ? TY_NUM : a[0].t, P_POST);
      return Mk("std::fabs(" + a[0].c + ")", TY_DEC, P_POST);
    }
    static const std::map<std::string, std::string> kMath = {
      {"nsq", "sqrt"}, {"ncr", "cbrt"}, {"nro", "round"}, {"ndn", "floor"}, {"nup", "ceil"}, {"nwh", "trunc"},
      {"nsn", "sin"}, {"nco", "cos"}, {"ntn", "tan"}, {"nas", "asin"}, {"nac", "acos"}, {"nat", "atan"},
      {"nlg", "log"}, {"nlx", "log10"}, {"nep", "exp"}};
    auto mi = kMath.find(w);
    if (mi != kMath.end() && need(1, 1)) { Need("<cmath>"); return Mk("std::" + mi->second + "(" + Dbl(a[0]) + ")", TY_DEC, P_POST); }
    if ((w == "npw" || w == "nhy") && need(2, 2)) { Need("<cmath>"); return Mk(std::string("std::") + (w == "npw" ? "pow" : "hypot") + "(" + Dbl(a[0]) + ", " + Dbl(a[1]) + ")", TY_DEC, P_POST); }
    if ((w == "nmx" || w == "nmn") && need(2, 2)) {
      Need("<algorithm>");
      std::string f = w == "nmx" ? "std::max" : "std::min";
      if (IsDecT(a[0].t) || IsDecT(a[1].t)) return Mk(f + "<double>(" + a[0].c + ", " + a[1].c + ")", TY_DEC, P_POST);
      if (SameT(a[0].t, a[1].t) && !a[0].lit) return Mk(f + "(" + a[0].c + ", " + a[1].c + ")", a[0].t, P_POST);
      if (IsNumT(a[0].t) && IsNumT(a[1].t)) { const Type* t = WiderInt(a[0], a[1]); return Mk(f + "<" + Cpp(t) + ">(" + a[0].c + ", " + a[1].c + ")", t, P_POST); }
      if (a[0].lit || a[1].lit) return Mk(f + "<std::string>(" + a[0].c + ", " + a[1].c + ")", TY_TXT, P_POST);
      return Mk(f + "(" + a[0].c + ", " + a[1].c + ")", a[0].t, P_POST);
    }
    if (w == "nkb" && need(3, 3)) {
      Need("<algorithm>");
      if (IsDecT(a[0].t) || IsDecT(a[1].t) || IsDecT(a[2].t)) return Mk("std::clamp<double>(" + a[0].c + ", " + a[1].c + ", " + a[2].c + ")", TY_DEC, P_POST);
      if (SameT(a[0].t, a[1].t) && SameT(a[0].t, a[2].t)) return Mk("std::clamp(" + a[0].c + ", " + a[1].c + ", " + a[2].c + ")", a[0].t, P_POST);
      const Type* t = WiderInt(a[0], a[1]);
      return Mk("std::clamp<" + Cpp(t) + ">(" + a[0].c + ", " + a[1].c + ", " + a[2].c + ")", t, P_POST);
    }
    if ((w == "ngd" || w == "nmu") && need(2, 2)) {
      Need("<numeric>");
      bool big = Head(a[0].t) == "big" || Head(a[1].t) == "big";
      std::string f = w == "ngd" ? "std::gcd" : "std::lcm";
      if (big) return Mk(f + "<long long, long long>(" + a[0].c + ", " + a[1].c + ")", TY_BIG, P_POST);
      return Mk("int(" + f + "<long long, long long>(" + a[0].c + ", " + a[1].c + "))", TY_NUM, P_POST);
    }
    if (w == "nra" && need(2, 2)) { Use("random"); return Mk("int(epp::nra(" + a[0].c + ", " + a[1].c + "))", TY_NUM, P_POST); }
    if (w == "nrz" && need(2, 2)) { Use("random"); return Mk("epp::nrz(" + a[0].c + ", " + a[1].c + ")", TY_DEC, P_POST); }
    if (w == "nfc" && need(1, 1)) { Use("nfc"); return Mk("epp::nfc(" + a[0].c + ")", TY_BIG, P_POST); }
    if (w == "npe" && need(1, 1)) { Use("nfc"); return Mk("epp::npe(" + a[0].c + ")", TY_YNO, P_POST); }
    if (w == "npi" && a.empty()) return Mk("3.141592653589793", TY_DEC);
    if (w == "nhi" && a.empty()) return Mk("2147483647", TY_NUM);
    if (w == "nlw" && a.empty()) return Mk("(-2147483647 - 1)", TY_NUM);
    if ((w == "nnd" || w == "nor" || w == "nxr" || w == "nsl" || w == "nsr") && need(2, 2)) {
      std::string op = w == "nnd" ? "&" : w == "nor" ? "|" : w == "nxr" ? "^" : w == "nsl" ? "<<" : ">>";
      int pr = w == "nnd" ? P_BAND : w == "nor" ? P_BOR : w == "nxr" ? P_XOR : P_SHIFT;
      const Type* t = (w == "nsl" || w == "nsr") ? (IntRank(a[0].t) > 1 ? a[0].t : TY_NUM) : WiderInt(a[0], a[1]);
      return Mk("(" + Paren(a[0], pr) + " " + op + " " + Paren(a[1], pr + 1) + ")", t);
    }
    if (w == "nnt" && need(1, 1)) return Mk("~" + Paren(a[0], P_UNARY), IntRank(a[0].t) > 1 ? a[0].t : TY_NUM, P_UNARY);
    if (w == "nsz" && ex.size() == 1) {
      const Type* t = ex[0]->k == E::Kind ? ex[0]->type : ex[0]->k == E::Name && !Find(ex[0]->s) ? T(ex[0]->s) : nullptr;
      if (!t) t = Value(ex[0]).t;
      static const std::map<std::string, int> sz = {{"num", 4}, {"pos", 4}, {"flo", 4}, {"big", 8}, {"pbg", 8}, {"dec", 8}, {"sml", 2},
                                                    {"byt", 1}, {"ltr", 1}, {"yno", 1}, {"txt", 32}, {"ptr", 8}, {"own", 8}, {"shr", 16}, {"vec", 24}};
      if (t) { auto it = sz.find(t->head); if (it != sz.end()) return Mk("int(sizeof(" + Cpp(t) + "))", TY_NUM, P_POST); }
      return RefuseX("nsz of this kind");
    }
    // ---- t: text
    if (w == "tsz" && need(1, 1)) return Mk("int(" + Paren(a[0], P_POST) + (a[0].lit ? "" : "") + ".size())", TY_NUM, P_POST);
    if ((w == "tuc" || w == "tlc" || w == "ttc" || w == "tti" || w == "trv") && need(1, 1)) { Use("tcase"); return Mk("epp::" + w + "(" + TxtArg(a[0]) + ")", TY_TXT, P_POST); }
    if ((w == "twd" || w == "tln") && need(1, 1)) { Use("tsplit"); return Mk("epp::" + w + "(" + TxtArg(a[0]) + ")", VecOf(TY_TXT), P_POST); }
    if (w == "tsp" && need(2, 2)) { Use("tsplit"); return Mk("epp::tsp(" + TxtArg(a[0]) + ", " + TxtArg(a[1]) + ")", VecOf(TY_TXT), P_POST); }
    if ((w == "tnm" || w == "tdc") && need(1, 1)) { Use("tnm"); mayThrow = true; return Mk("epp::" + w + "(" + TxtArg(a[0]) + ")", w == "tnm" ? TY_NUM : TY_DEC, P_POST); }
    if ((w == "ths" || w == "tbg" || w == "ted" || w == "tps" || w == "tct") && need(2, 2)) {
      Use("tfind");
      return Mk("epp::" + w + "(" + TxtArg(a[0]) + ", " + TxtArg(a[1]) + ")", (w == "tps" || w == "tct") ? TY_NUM : TY_YNO, P_POST);
    }
    if (w == "trp" && need(3, 3)) { Use("trp"); return Mk("epp::trp(" + TxtArg(a[0]) + ", " + TxtArg(a[1]) + ", " + TxtArg(a[2]) + ")", TY_TXT, P_POST); }
    if (w == "tcu" && need(2, 3)) {
      mayThrow = true;
      std::string s = a[0].lit ? "std::string(" + a[0].c + ")" : Paren(a[0], P_POST);
      return Mk(s + ".substr(" + a[1].c + (a.size() > 2 ? ", " + a[2].c : "") + ")", TY_TXT, P_POST);
    }
    if (w == "tfx" && need(2, 2)) { Use("tfx"); return Mk("epp::tfx(" + a[0].c + ", " + a[1].c + ")", TY_TXT, P_POST); }
    if (w == "tpa" && need(2, 2)) { Use("tpa"); return Mk("epp::tpa(" + TxtArg(a[0]) + ", " + a[1].c + ")", TY_TXT, P_POST); }
    if (w == "tre" && need(2, 2)) { Use("tre"); return Mk("epp::tre(" + TxtArg(a[0]) + ", " + a[1].c + ")", TY_TXT, P_POST); }
    if ((w == "tmt" || w == "tma") && need(2, 2)) { Use("regex"); return Mk("epp::" + w + "(" + TxtArg(a[0]) + ", " + TxtArg(a[1]) + ")", w == "tmt" ? TY_YNO : VecOf(TY_TXT), P_POST); }
    if (w == "trx" && need(3, 3)) { Use("regex"); return Mk("epp::trx(" + TxtArg(a[0]) + ", " + TxtArg(a[1]) + ", " + TxtArg(a[2]) + ")", TY_TXT, P_POST); }
    if ((w == "tdg" || w == "tlr" || w == "tws") && need(1, 1)) {
      Need("<cctype>");
      std::string f = w == "tdg" ? "isdigit" : w == "tlr" ? "isalpha" : "isspace";
      std::string c = Head(a[0].t) == "ltr" ? a[0].c : Paren(a[0], P_POST) + "[0]";
      return Mk("bool(std::" + f + "((unsigned char)" + c + "))", TY_YNO, P_POST);
    }
    if (w == "tfa" && !a.empty()) {
      if (!a[0].lit) return RefuseX("tfa with a format that isn't written in the line");
      Need("<format>");
      std::string r = "std::format(" + a[0].c;
      for (size_t k = 1; k < a.size(); ++k) {
        std::string h = Head(a[k].t);
        if (h == "byt") r += ", int(" + a[k].c + ")";
        else if (h == "hug" || h == "cpx" || IsListHead(h) || IsMapHead(h) || IsSetHead(h) || (a[k].t && a[k].t->cls) || (a[k].t && a[k].t->en)) r += ", " + AsText(a[k]).c;
        else r += ", " + a[k].c;
      }
      return Mk(r + ")", TY_TXT, P_POST);
    }
    if (w == "ttp" && need(1, 1)) {
      if (!a[0].t) return RefuseX("ttp of a value whose kind the C++ View can't tell");
      X x = Mk(StrLit(a[0].t->text), TY_TXT); x.lit = true; return x;
    }
    // ---- x: outside the program
    if (w == "xag" && a.empty()) { Need("<vector>"); return Mk("std::vector<std::string>{}", VecOf(TY_TXT)); }
    if (w == "xpo" && !a.empty()) {
      Need("<stdexcept>"); mayThrow = true;
      return Mk("[&]() -> std::string { throw std::runtime_error(\"The Web Studio can't send to \" + " + AsString(AsText(a[0])) + " + \" from inside the browser.\"); }()", TY_TXT, P_POST);
    }
    if ((w == "xha" || w == "xbe" || w == "xbd") && need(1, 1)) { Use(w == "xha" ? "sha" : "base64"); return Mk("epp::" + w + "(" + TxtArg(a[0]) + ")", TY_TXT, P_POST); }
    if (w == "tjs") return RefuseX("tjs (JSON values)");
    if (w == "xev" || w == "xcm" || w == "xcd" || w == "xwb") return RefuseX(w + " (it reaches outside the browser)");
    return RefuseX("the value word " + w + " used this way");
  }

  // ------------------------------------------------------------ statements
  bool Exists(const std::string& n) {
    if (Find(n)) return true;
    if (curCls && (FieldOf(curCls, n) || StaticOf(curCls, n))) return true;
    return false;
  }
  X WhoValue(const Stmt* s) {
    if (s->w) return Value(s->w.get());
    if (Var* v = Find(s->who)) return Mk(v->cpp, v->t);
    Expr e; e.k = E::Name; e.s = s->who;
    return Name(&e);
  }
  std::string CmpOp(const std::string& root) {
    std::string r = root.substr(1);
    if (r == "eq") return "==";
    if (r == "ne") return "!=";
    if (r == "lt") return "<";
    if (r == "le") return "<=";
    if (r == "gt") return ">";
    if (r == "ge") return ">=";
    return "";
  }
  std::string Cond(const Stmt* s) {
    X a = WhoValue(s);
    X b = s->x ? Value(s->x.get()) : Mk("", nullptr);
    if (b.nil && Head(a.t) == "opt") b.c = "std::nullopt";
    if (Head(a.t) == "ltr" && b.lit && s->x && s->x->k == E::Str && s->x->s.size() == 1) b = Mk(ChrLit(s->x->s[0]), TY_LTR);
    return Binary(CmpOp(s->root), a, b).c;
  }
  // a new name with a value: int x = 6; std::vector<int> v = {1, 2};
  std::string DeclWith(const std::string& cpp, const X& v, const Type* want = nullptr, const std::string& prefix = "") {
    const Type* t = want ? want : v.t;
    if (Head(t) == "sml" || Head(t) == "byt") t = want ? want : TY_NUM;
    if (!want && v.lit) { Need("<string>"); return prefix + "std::string " + cpp + " = " + v.c + ";"; }
    if (!t) return prefix + "auto " + cpp + " = " + v.c + ";";
    std::string ty = Cpp(t);
    if (ty == "auto") return prefix + "auto " + cpp + " = " + v.c + ";";
    if (!v.braces.empty() && SameT(t, v.t)) return prefix + ty + " " + cpp + " = " + v.braces + ";";
    if (!v.ctor.empty() && SameT(t, v.t)) return prefix + ty + " " + cpp + v.ctor + ";";
    if (Head(t) == "fun" && !v.nil) return prefix + "auto " + cpp + " = " + v.c + ";";
    if (Head(t) == "own" || Head(t) == "thd" || Head(t) == "fut") return prefix + ty + " " + cpp + " = " + Fit(v, t) + ";";
    return prefix + ty + " " + cpp + " = " + Fit(v, t) + ";";
  }
  void Body(const std::vector<Stmt*>& body) {
    Push();
    for (Stmt* s : body) One(s);
    Pop();
  }
  void Open(const std::string& head) { Emit(head + " {"); ++depth; }
  void Close(const std::string& tail = "}") { --depth; curLine = nullptr; Emit(tail); }
  void BlockAfter(const std::string& head, const std::vector<Stmt*>& body) { Open(head); Body(body); Close(); }

  bool HasLoopExit(const std::vector<Stmt*>& body) {
    for (Stmt* s : body) {
      if (s->root == "ebk" || s->root == "enx") return true;
      if (s->root.size() == 3 && (s->root[0] == 'f' || s->root[0] == 'w' || s->root == "bdo" || s->root == "wln")) continue;
      if (HasLoopExit(s->body)) return true;
      for (Stmt* c : s->chain) if (HasLoopExit(c->body)) return true;
    }
    return false;
  }
  // a loop's body, with the labels a jump out of an inner loop needs
  void LoopBody(const std::string& head, const std::vector<Stmt*>& body, const std::string& label,
                const std::function<void()>& declare = nullptr, const std::string& tail = "}") {
    LoopCtx lc; lc.label = label; lc.cppLabel = Fresh(label.empty() ? "loop" : Ident(label));
    loops.push_back(lc);
    Open(head);
    Push();
    if (declare) declare();
    std::vector<std::string> saved;
    std::vector<std::string>* outer = out;
    out = &saved;
    for (Stmt* s : body) One(s);
    out = outer;
    LoopCtx done = loops.back();
    loops.pop_back();
    if (done.nextOut) { Emit("{"); for (auto& l : saved) out->push_back("  " + l); Emit("}"); Emit(done.cppLabel + "_next:;"); }
    else for (auto& l : saved) out->push_back(l);
    Pop();
    Close(tail);
    if (done.breakOut) Emit(done.cppLabel + "_done:;");
  }
  void Jump(const Stmt* s) {
    bool brk = s->root == "ebk";
    std::string cond = s->x ? Value(s->x.get()).c : "";
    std::string jump;
    // which loop: the one with this label, or the innermost
    int target = -1;
    for (int k = (int)loops.size() - 1; k >= 0; --k) {
      if (loops[k].isSwitch) continue;
      if (s->whoId < 0 || s->who == "now" || loops[k].label == s->who) { target = k; break; }
    }
    if (target < 0) {
      for (int k = (int)loops.size() - 1; k >= 0; --k) if (!loops[k].isSwitch) { target = k; break; }
    }
    if (target < 0) { Refuse(s->root + " outside a loop"); return; }
    bool direct = true;
    for (int k = target + 1; k < (int)loops.size(); ++k) direct = false;
    if (direct) jump = brk ? "break;" : "continue;";
    else {
      if (brk) { loops[target].breakOut = true; jump = "goto " + loops[target].cppLabel + "_done;"; }
      else { loops[target].nextOut = true; jump = "goto " + loops[target].cppLabel + "_next;"; }
    }
    Emit(cond.empty() ? jump : "if (" + cond + ") " + jump);
  }

  std::string Stream(const std::string& who) { return who == "out" ? "std::cout" : who == "err" ? "std::cerr" : ""; }
  void Print(const Stmt* s, bool line) {
    std::string to = Stream(s->who);
    Need("<iostream>");
    if (to.empty()) {
      X st = WhoValue(s);
      if (Head(st.t) != "ofs") { Refuse(s->who + " " + s->root + " (printing to something that isn't the screen or a file)"); return; }
      to = st.c;
    }
    if (s->who == "err") usesErr = true;
    std::vector<std::string> parts;
    if (s->x) {
      if (s->x->k == E::List) {
        bool first = true;
        for (auto& k : s->x->kids) { if (!first) parts.push_back("' '"); first = false; parts.push_back(AsStream(Value(k.get()))); }
      } else {
        X v = Value(s->x.get());
        if (v.isVoid) { Refuse("printing nothing"); return; }
        parts.push_back(AsStream(v));
      }
    }
    if (line) {
      if (!parts.empty() && parts.back().size() >= 2 && parts.back()[0] == '"' && parts.back().back() == '"' && parts.back().find("\"\"") == std::string::npos)
        parts.back() = parts.back().substr(0, parts.back().size() - 1) + "\\n\"";
      else parts.push_back("'\\n'");
    }
    std::string c = to;
    for (auto& p : parts) c += " << " + p;
    Emit(c + ";");
  }
  void Get(const Stmt* s) {
    bool lineMode = s->root == "gln";
    std::string src = s->what;
    bool question = src.size() >= 2 && src.front() == '"';
    std::string from = "std::cin";
    Need("<iostream>"); Need("<string>");
    if (question) { X q = Value(s->x.get()); Emit("std::cout << " + AsStream(q) + ";"); }
    else if (src != "inp") {
      X st = Value(s->x.get());
      if (Head(st.t) != "ifs") { Refuse(s->root + " from something that isn't inp or a file"); return; }
      from = st.c;
    }
    X target;
    if (s->w && s->w->k != E::Name) target = Value(s->w.get());
    else if (Exists(s->who)) { Expr e; e.k = E::Name; e.s = s->who; target = Name(&e); }
    else { Var* v = Declare(s->who, TY_TXT); Emit("std::string " + v->cpp + ";"); target = Mk(v->cpp, TY_TXT); }
    if (lineMode) {
      if (!IsTxt(target.t)) { Refuse("gln into a name that isn't txt"); return; }
      Emit("std::getline(" + from + ", " + target.c + ");");
    } else {
      if (!(IsTxt(target.t) || IsNumT(target.t))) { Refuse("get into " + (target.t ? target.t->text : std::string("this"))); return; }
      Emit(from + " >> " + target.c + ";");
    }
  }

  std::string MakeValue(const std::string& root, const Expr* x, const Type*& t) {
    // mnw / mwn / msh: what the pointer holds
    const Type* kind = nullptr;
    std::vector<const Expr*> args;
    if (x->k == E::Name && T(x->s)) kind = T(x->s);
    else if (x->k == E::Kind) kind = x->type;
    else if (x->k == E::Call && (x->kids[0]->k == E::Kind || (x->kids[0]->k == E::Name && T(x->kids[0]->s) && !Find(x->kids[0]->s)))) {
      kind = x->kids[0]->k == E::Kind ? x->kids[0]->type : T(x->kids[0]->s);
      for (size_t k = 1; k < x->kids.size(); ++k) args.push_back(x->kids[k].get());
    }
    std::string inner;
    if (kind) {
      if (kind->cls) { X c = Construct(kind, args); inner = c.ctor.empty() ? "" : c.ctor.substr(1, c.ctor.size() - 2); if (!c.ctor.empty() && c.ctor[0] == '{') inner = "{BRACE}" + inner; }
      else { std::vector<X> a = Vals(args); std::vector<std::string> sv; for (auto& v : a) sv.push_back(v.c); inner = JoinC(sv); }
    } else {
      X v = Value(x);
      kind = v.t;
      if (!kind) { RefuseX(root + " of a value whose kind the C++ View can't tell"); kind = TY_NUM; }
      if (Head(kind) == "sml" || Head(kind) == "byt") kind = TY_NUM;
      inner = v.lit ? v.c : v.c;
    }
    t = kind;
    std::string ty = Cpp(kind);
    bool brace = inner.rfind("{BRACE}", 0) == 0;
    if (brace) inner = inner.substr(7);
    std::string open = brace ? "{" : "(", close = brace ? "}" : ")";
    if (root == "mnw") return "new " + ty + open + inner + close;
    Need("<memory>");
    if (brace) return std::string(root == "mwn" ? "std::unique_ptr<" : "std::shared_ptr<") + ty + ">(new " + ty + "{" + inner + "})";
    return std::string(root == "mwn" ? "std::make_unique<" : "std::make_shared<") + ty + ">(" + inner + ")";
  }

  // mtd / msy: a thread or an async task
  std::string TaskArgs(const Expr* x, const Type*& ret) {
    std::vector<std::string> parts;
    ret = nullptr;
    if (x->k == E::Call && x->kids[0]->k == E::Name) {
      const std::string& n = x->kids[0]->s;
      FuncInfo* f = Find(n) ? nullptr : FindFn(n);
      if (Var* v = Find(n)) { parts.push_back(v->cpp); ret = Head(v->t) == "fun" ? Arg(v->t, 0) : nullptr; }
      else if (f) { parts.push_back(FnName(f)); ret = f->ret; }
      else { RefuseX("a thread running " + n); return ""; }
      for (size_t k = 1; k < x->kids.size(); ++k) {
        X a = Value(x->kids[k].get());
        bool byRef = f && k - 1 < f->params.size() && (f->params[k - 1].ref || f->params[k - 1].look);
        if (byRef) { Need("<functional>"); parts.push_back(std::string(f->params[k - 1].look ? "std::cref(" : "std::ref(") + a.c + ")"); }
        else parts.push_back(a.c);
      }
      return JoinC(parts);
    }
    X f = Value(x);
    ret = Head(f.t) == "fun" ? Arg(f.t, 0) : nullptr;
    if (f.t && f.t->text == "fun@any") ret = nullptr;
    return f.c;
  }

  void Assign(const Stmt* s) {
    if (!s->names.empty()) {
      std::vector<X> vals;
      bool list = s->x->k == E::List;
      if (list) for (auto& k : s->x->kids) vals.push_back(Value(k.get()));
      bool allNew = true, allOld = true;
      for (auto& n : s->names) { if (Exists(n)) allNew = false; else allOld = false; }
      if (list && allNew && vals.size() == s->names.size()) {
        for (size_t k = 0; k < vals.size(); ++k) { Var* v = Declare(s->names[k], vals[k].lit ? TY_TXT : vals[k].t); Emit(DeclWith(v->cpp, vals[k])); }
        return;
      }
      if (list && allOld) {
        Need("<tuple>");
        std::vector<std::string> ns, vs;
        for (size_t k = 0; k < s->names.size(); ++k) { Expr e; e.k = E::Name; e.s = s->names[k]; X nx = Name(&e); ns.push_back(nx.c); vs.push_back(k < vals.size() ? Fit(vals[k], nx.t) : "0"); }
        Emit("std::tie(" + JoinC(ns) + ") = std::tuple(" + JoinC(vs) + ");");
        return;
      }
      if (!list && allNew) {
        X v = Value(s->x.get());
        std::string h = Head(v.t);
        if (h != "tup" && h != "par") { Refuse("taking a list apart into names"); return; }
        std::vector<std::string> ns;
        for (size_t k = 0; k < s->names.size(); ++k) { Var* nv = Declare(s->names[k], Arg(v.t, k)); ns.push_back(nv->cpp); }
        Emit("auto [" + JoinC(ns) + "] = " + v.c + ";");
        return;
      }
      if (!list && allOld) {
        X v = Value(s->x.get());
        std::vector<std::string> ns;
        for (auto& n : s->names) { Expr e; e.k = E::Name; e.s = n; ns.push_back(Name(&e).c); }
        Need("<tuple>");
        Emit("std::tie(" + JoinC(ns) + ") = " + v.c + ";");
        return;
      }
      Refuse("giving new and old names values on one line");
      return;
    }
    const Expr* w = s->w.get();
    if (w->k == E::Name && !Exists(w->s)) {
      X v = s->x->k == E::List ? List(s->x.get(), nullptr) : Value(s->x.get());
      if (v.isVoid) { Refuse("a name made from nothing"); return; }
      if (v.nil) { Refuse("a name made from nil"); return; }
      const Type* t = v.lit ? TY_TXT : v.t;
      if (Head(t) == "sml" || Head(t) == "byt") t = TY_NUM;
      Var* nv = Declare(w->s, t);
      if (Head(t) == "fun") {
        if (std::find(P->callables.begin(), P->callables.end(), w->s) == P->callables.end()) {}
      }
      Emit(DeclWith(nv->cpp, v, t && Head(t) != "fun" ? t : nullptr));
      if (Head(t) == "fun" && v.t) nv->t = v.t;
      return;
    }
    X place = Value(w);
    X v = s->x->k == E::List && place.t ? List(s->x.get(), place.t) : Value(s->x.get());
    if (v.isVoid) { Refuse("giving a name nothing"); return; }
    std::string rhs = Fit(v, place.t);
    if (!v.braces.empty() && SameT(v.t, place.t)) rhs = v.braces;
    if (Head(place.t) == "own" && IsNameExpr(v)) rhs = MoveIfName(v);
    if (place.t && place.t->cls && v.t && v.t->cls && v.t->cls != place.t->cls) {}
    Emit(Paren(place, P_ASSIGN + 1) + " = " + rhs + ";");
  }

  void MakeName(const Stmt* s) {
    std::string prefix;
    if (s->root == "mkn") prefix = "const ";
    if (s->root == "msv") prefix = "static ";
    if (s->root == "mtl") prefix = "thread_local ";
    if (s->kind) {
      Var* v = Declare(s->who, s->kind);
      std::string ty = Cpp(s->kind);
      if (s->kind->cls && s->kind->cls->tparams.size() && s->kind->args.empty()) { Refuse("a class made without saying its kinds"); return; }
      Emit(prefix + ty + " " + v->cpp + DefaultInit(s->kind) + ";");
      return;
    }
    if (!s->x) { Refuse(s->root + " without a kind"); return; }
    X x = s->x->k == E::List ? List(s->x.get(), nullptr) : Value(s->x.get());
    if (x.nil || x.isVoid) { Refuse(s->root + " from nil"); return; }
    const Type* t = x.lit ? TY_TXT : x.t;
    if (Head(t) == "sml" || Head(t) == "byt") t = TY_NUM;
    Var* v = Declare(s->who, t);
    Emit(DeclWith(v->cpp, x, t && Head(t) != "fun" ? t : nullptr, prefix));
  }

  void Loop(const Stmt* s) {
    const std::string& r = s->root;
    if (r == "flt" || r == "fle" || r == "fne" || r == "fgt" || r == "fge") {
      bool down = r == "fgt" || r == "fge";
      X lim = Value(s->x.get());
      std::string op = r == "flt" ? "<" : r == "fle" ? "<=" : r == "fne" ? "!=" : r == "fgt" ? ">" : ">=";
      if (Exists(s->who)) {
        Expr e; e.k = E::Name; e.s = s->who; X c = Name(&e);
        LoopBody("for (; " + c.c + " " + op + " " + Paren(lim, P_REL + 1) + "; " + (down ? "--" : "++") + c.c + ")", s->body, s->who);
        return;
      }
      if (down) { Refuse(r + " with a counter that doesn't start anywhere"); return; }
      Push();
      Var* v = Declare(s->who, TY_NUM);
      std::string limc = Paren(lim, P_REL + 1);
      LoopBody("for (int " + v->cpp + " = 0; " + v->cpp + " " + op + " " + limc + "; ++" + v->cpp + ")", s->body, s->who);
      Pop();
      return;
    }
    if (r == "fea" || r == "fpr") {
      X c = Value(s->x.get());
      OrderSeen(c.t);
      std::string h = Head(c.t);
      if (h == "stk" || h == "que" || h == "hep" || h == "mhp") { Refuse("walking through a stack or a queue"); return; }
      std::string label = s->names.empty() ? s->who : s->names[0];
      std::string tag = r == "fpr" ? "  // fpr: the Studio runs these one after another" : "";
      if (h == "chn") {
        const Type* et = Arg(c.t, 0);
        Push();
        Var* v = Declare(s->who, et);
        LoopBody("for (" + Cpp(et) + " " + v->cpp + "; " + Paren(c, P_POST) + ".receive(" + v->cpp + ");)", s->body, label);
        Pop();
        return;
      }
      if (!s->names.empty()) {
        const Type* et = ElemOf(c.t);
        Push();
        std::vector<std::string> ns;
        for (size_t k = 0; k < s->names.size(); ++k) { Var* v = Declare(s->names[k], Arg(et, k)); ns.push_back(v->cpp); }
        LoopBody("for (auto& [" + JoinC(ns) + "] : " + c.c + ")", s->body, label);
        Pop();
        return;
      }
      const Type* et = ElemOf(c.t);
      Push();
      Var* v = Declare(s->who, et);
      std::string head;
      if (h == "txt" && c.lit) head = "for (char " + v->cpp + " : std::string(" + c.c + "))";
      else if (h == "txt") head = "for (char& " + v->cpp + " : " + c.c + ")";
      else if (h == "gnr") head = "for (" + Cpp(et) + " " + v->cpp + " : " + c.c + ")";
      else if (IsSetHead(h) || IsMapHead(h)) head = "for (const auto& " + v->cpp + " : " + c.c + ")";
      else if (Head(et) == "yno" && h == "vec") head = "for (auto&& " + v->cpp + " : " + c.c + ")";
      else head = "for (auto& " + v->cpp + " : " + c.c + ")";
      if (!tag.empty()) Emit("// fpr: the Studio runs these one after another, so this is a plain loop");
      LoopBody(head, s->body, label);
      Pop();
      return;
    }
    if (r == "wfv") { LoopBody("while (true)", s->body, ""); return; }
    if (r[0] == 'w' && r != "wln") { LoopBody("while (" + Cond(s) + ")", s->body, ""); return; }
    if (r == "wln") {
      std::string from = "std::cin";
      if (s->what != "inp") { X st = Value(s->x.get()); from = st.c; }
      Push();
      Var* v = Declare(s->who, TY_TXT);
      Need("<string>");
      LoopBody("for (std::string " + v->cpp + "; std::getline(" + from + ", " + v->cpp + ");)", s->body, s->who);
      Pop();
      return;
    }
    if (r == "bdo") {
      if (s->chain.empty()) { Refuse("bdo without a u.. line"); return; }
      const Stmt* u = s->chain[0];
      Line(u);
      std::string until = Cond(u);
      Line(s);
      LoopBody("do", s->body, "", nullptr, "} while (!(" + until + "));");
      return;
    }
  }

  void Switch(const Stmt* s) {
    X subj = WhoValue(s);
    bool canSwitch = (IsInt(subj.t) || Head(subj.t) == "ltr" || (subj.t && subj.t->en));
    for (Stmt* cs : s->body) if (HasLoopExit(cs->body)) canSwitch = canSwitch && false;
    auto caseValue = [&](const Expr* it) -> X {
      if (it->k == E::Name && subj.t && subj.t->en) {
        auto& nm = subj.t->en->names;
        if (std::find(nm.begin(), nm.end(), it->s) != nm.end()) return Mk(EnumName(subj.t->en) + "::" + Ident(it->s), subj.t);
      }
      return Value(it);
    };
    if (canSwitch) {
      loops.push_back(LoopCtx{}); loops.back().isSwitch = true;
      Open("switch (" + subj.c + ")");
      for (Stmt* cs : s->body) {
        Line(cs);
        if (cs->root == "bdf") { Open("default:"); Body(cs->body); Emit("break;"); Close(); continue; }
        if (cs->root != "bcs") { Refuse("a line in bsw that isn't bcs or bdf"); continue; }
        std::vector<const Expr*> items;
        if (cs->x->k == E::List) for (auto& k : cs->x->kids) items.push_back(k.get()); else items.push_back(cs->x.get());
        std::string labels;
        for (size_t k = 0; k < items.size(); ++k) labels += (k ? " case " : "case ") + caseValue(items[k]).c + ":";
        Open(labels);
        Body(cs->body);
        Emit("break;");
        Close();
      }
      Close();
      loops.pop_back();
      return;
    }
    // text and other values: an if chain
    std::string v = subj.c;
    if (!IsNameExpr(subj)) { std::string tmp = Fresh("subject"); Emit("const auto " + tmp + " = " + subj.c + ";"); v = tmp; }
    X sv = Mk(v, subj.t);
    bool first = true;
    const Stmt* def = nullptr;
    for (Stmt* cs : s->body) {
      if (cs->root == "bdf") { def = cs; continue; }
      Line(cs);
      std::vector<const Expr*> items;
      if (cs->x->k == E::List) for (auto& k : cs->x->kids) items.push_back(k.get()); else items.push_back(cs->x.get());
      std::string cond;
      for (size_t k = 0; k < items.size(); ++k) cond += (k ? " || " : "") + Binary("==", sv, caseValue(items[k])).c;
      if (first) Open("if (" + cond + ")"); else { --depth; Emit("} else if (" + cond + ") {"); ++depth; }
      first = false;
      Body(cs->body);
    }
    if (def) {
      Line(def);
      if (first) { Open(""); } else { --depth; Emit("} else {"); ++depth; }
      first = false;
      Body(def->body);
    }
    if (!first) Close();
  }

  void Try(const Stmt* s) {
    Open("try");
    Body(s->body);
    for (Stmt* h : s->chain) {
      Line(h);
      std::string head;
      Push();
      if (h->who == "now" && !h->kind) head = "catch (...)";
      else if (!h->kind || h->kind->head == "exn") {
        Need("<stdexcept>");
        std::string n = h->who == "now" ? "" : " " + Declare(h->who, TY_EXN)->cpp;
        head = "catch (const std::exception&" + n + ")";
      } else if (h->kind->cls) {
        std::string n = h->who == "now" ? "" : " " + Declare(h->who, h->kind)->cpp;
        head = "catch (const " + Cpp(h->kind) + "&" + n + ")";
      } else { Refuse("catching a " + h->kind->text); Pop(); continue; }
      --depth; Emit("} " + head + " {"); ++depth;
      for (Stmt* b : h->body) One(b);
      Pop();
    }
    Close();
  }

  void Lambda(const Stmt* s) {
    FuncInfo* f = s->fn;
    if (!f) { Refuse("this lambda"); return; }
    bool selfCall = MentionsName(f->body, s->who);
    std::string params = ParamList(f, true);
    std::string ret = f->ret && f->ret != TY_ANY ? Cpp(f->ret) : (f->returnsNothing ? "void" : "auto");
    std::string cap = s->root == "dlv" ? "[=]" : "[&]";
    bool exists = Exists(s->who);
    Var* v;
    if (exists) { Expr e; e.k = E::Name; e.s = s->who; v = nullptr; X old = Name(&e); Refuse("giving a lambda's name a new lambda"); (void)old; return; }
    const Type* ft = FnType(f);
    v = Declare(s->who, ft);
    std::string head;
    bool typed = selfCall || ret == "auto";
    std::string tail = s->root == "dlv" ? " mutable" : "";
    std::string arrow = ret != "auto" ? " -> " + ret : "";
    if (selfCall) {
      if (ret == "auto" || params.find("auto") != std::string::npos) { Refuse("a lambda that calls itself without saying its kinds"); return; }
      Need("<functional>");
      std::string sig = ret + "(";
      for (size_t k = 0; k < f->params.size(); ++k) sig += (k ? ", " : "") + ParamType(f->params[k]);
      sig += ")";
      head = "std::function<" + sig + "> " + v->cpp + " = " + cap + "(" + params + ")" + tail + arrow;
    } else head = "auto " + v->cpp + " = " + cap + "(" + params + ")" + tail + arrow;
    (void)typed;
    Open(head);
    FuncBody(f, true);
    Close("};");
  }
  bool MentionsRoot(const std::vector<Stmt*>& body, const std::string& r) {
    for (Stmt* s : body) { if (s->root == r || MentionsRoot(s->body, r)) return true; for (Stmt* c : s->chain) if (MentionsRoot(c->body, r)) return true; }
    return false;
  }
  bool MentionsName(const std::vector<Stmt*>& body, const std::string& n) {
    for (Stmt* s : body) {
      if (s->root == n || s->what.find(n + "&") != std::string::npos || s->what == n || s->who == n) return true;
      if (MentionsName(s->body, n)) return true;
      for (Stmt* c : s->chain) if (MentionsName(c->body, n)) return true;
    }
    return false;
  }

  void One(Stmt* s) {
    Line(s);
    const std::string& r = s->root;
    if (r == "is") { Assign(s); return; }
    if (r == "mak" || r == "mkn" || r == "msv") {
      if (r == "msv" && fns.empty()) { Refuse("msv outside a function"); return; }
      MakeName(s); return;
    }
    if (r == "mgl" || r == "mtl") return;
    if (r == "mpt") {
      X target = Value(s->x.get());
      if (Exists(s->who)) { Expr e; e.k = E::Name; e.s = s->who; Emit(Name(&e).c + " = &" + Paren(target, P_UNARY) + ";"); return; }
      const Type* pt = T("ptr@" + (target.t ? target.t->text : std::string("any")));
      Var* v = Declare(s->who, pt);
      Emit(Cpp(target.t) + "* " + v->cpp + " = &" + Paren(target, P_UNARY) + ";");
      return;
    }
    if (r == "mrf" || r == "mlo") {
      X target = Value(s->x.get());
      Var* v = Declare(s->who, target.t);
      Emit(std::string(r == "mlo" ? "const " : "") + (target.t ? Cpp(target.t) : "auto") + "& " + v->cpp + " = " + target.c + ";");
      return;
    }
    if (r == "mnw" || r == "mwn" || r == "msh") {
      const Type* inner = nullptr;
      std::string make = MakeValue(r, s->x.get(), inner);
      std::string head = r == "mnw" ? "ptr@" : r == "mwn" ? "own@" : "shr@";
      const Type* pt = T(head + (inner ? inner->text : std::string("num")));
      if (Exists(s->who)) { Expr e; e.k = E::Name; e.s = s->who; Emit(Name(&e).c + " = " + make + ";"); return; }
      Var* v = Declare(s->who, pt);
      Emit(Cpp(pt) + " " + v->cpp + " = " + make + ";");
      return;
    }
    if (r == "mtd" || r == "msy") {
      const Type* ret = nullptr;
      std::string args = TaskArgs(s->x.get(), ret);
      if (r == "mtd") {
        Need("<thread>");
        Var* v = Declare(s->who, T("thd"));
        Emit("std::thread " + v->cpp + "(" + args + ");");
      } else {
        Need("<future>");
        const Type* ft = T("fut@" + (ret ? ret->text : std::string("num")));
        if (!ret) { Refuse("an async task whose result kind the C++ View can't tell"); return; }
        Var* v = Declare(s->who, ft);
        Emit(Cpp(ft) + " " + v->cpp + " = std::async(std::launch::async, " + args + ");");
      }
      return;
    }
    if (r == "mfi" || r == "mfo") {
      Need("<fstream>");
      X path = Value(s->x.get());
      Var* v = Declare(s->who, T(r == "mfi" ? "ifs" : "ofs"));
      Emit(std::string(r == "mfi" ? "std::ifstream " : "std::ofstream ") + v->cpp + "(" + TxtArg(path) + ");");
      return;
    }
    if (r == "mmv") {
      X src = Value(s->x.get());
      Need("<utility>");
      Var* v = Declare(s->who, src.t);
      Emit((src.t ? Cpp(src.t) : "auto") + " " + v->cpp + " = std::move(" + src.c + ");");
      if (Head(src.t) == "txt" || IsListHead(Head(src.t)) || IsMapHead(Head(src.t)) || IsSetHead(Head(src.t)))
        Emit(src.c + ".clear();  // the Studio leaves a moved-from name empty");
      return;
    }
    if (r == "prn" || r == "put") { Print(s, r == "prn"); return; }
    if (r == "get" || r == "gln") { Get(s); return; }
    if (r == "rjn" || r == "rdt") {
      X t = WhoValue(s);
      if (Head(t.t) == "thd") { Emit(Paren(t, P_POST) + (r == "rjn" ? ".join();" : ".detach();")); return; }
      Refuse(r + " on something that isn't a thread");
      return;
    }
    if (r == "rwt") { Need("<thread>"); Need("<chrono>"); Emit("std::this_thread::sleep_for(std::chrono::milliseconds(" + Value(s->x.get()).c + "));"); return; }
    if (r == "rsd") { Use("random"); Emit("epp::rsd(" + Value(s->x.get()).c + ");"); return; }
    if (r == "seq" || r == "sne" || r == "slt" || r == "sle" || r == "sgt" || r == "sge") {
      Use("check");
      std::string what = s->who + " " + r + " " + s->what + " wants " + s->who + " " + CmpOp("x" + r.substr(1)) + " " + s->what;
      Emit("epp::check(" + Cond(s) + ", " + StrLit(what) + ");");
      return;
    }
    if (r.size() == 3 && r[0] == 'i' && !CmpOp(r).empty()) {
      Open("if (" + Cond(s) + ")");
      Body(s->body);
      for (Stmt* o : s->chain) {
        Line(o);
        --depth;
        if (o->root == "oth") Emit("} else {"); else Emit("} else if (" + Cond(o) + ") {");
        ++depth;
        Body(o->body);
      }
      Close();
      return;
    }
    if (r.size() == 3 && r[0] == 'o' && (r == "oth" || !CmpOp(r).empty()) && s->chained) return;
    if ((r[0] == 'f' && r.size() == 3 && (r == "flt" || r == "fle" || r == "fne" || r == "fgt" || r == "fge" || r == "fea" || r == "fpr")) ||
        (r[0] == 'w' && (!CmpOp(r).empty() || r == "wfv" || r == "wln")) || r == "bdo") { Loop(s); return; }
    if (r.size() == 3 && r[0] == 'u' && s->chained) return;
    if (r == "bsw") { Switch(s); return; }
    if (r == "btr") { Try(s); return; }
    if (r == "bch" && s->chained) return;
    if (r == "blk" || r == "bbl") {
      if (r == "blk" && s->who != "now") {
        X m = WhoValue(s);
        Need("<mutex>");
        Open("");
        out->back() = std::string(depth * 2 - 2, ' ') + "{  // " + s->who + " " + r + " " + s->what;
        std::string held = Fresh("held");
        bool waits = MentionsRoot(s->body, "wait");
        Emit(std::string(waits ? "std::unique_lock<std::mutex> " : "std::lock_guard<std::mutex> ") + held + "(" + m.c + ");");
        locks.push_back({m.c, held});
        Body(s->body);
        locks.pop_back();
        Close();
        return;
      }
      Open(""); out->back() = std::string(depth * 2 - 2, ' ') + "{  // " + s->who + " " + r + " " + s->what;
      Body(s->body); Close(); return;
    }
    if (r == "bdr") {
      Use("later");
      Open("epp::Later " + Fresh("later") + "{[&]");
      Body(s->body);
      Close("}};");
      return;
    }
    if (r == "dlm" || r == "dlv") { Lambda(s); return; }
    if (r == "ert") {
      if (fns.empty()) {
        if (s->who != "main") { Refuse("ert in main that isn't main ert"); return; }
        Emit(s->x ? "return " + Value(s->x.get()).c + ";" : "return 0;");
        return;
      }
      FuncInfo* f = fns.back().fn;
      if (f && f->isGen) { Emit("co_return;"); return; }
      if (!s->x) { Emit("return;"); return; }
      const Type* rt = f && f->ret != TY_ANY ? f->ret : nullptr;
      X v = s->x->k == E::List ? Mk("{" + [&] { std::vector<std::string> p; size_t k = 0; for (auto& kid : s->x->kids) { X a = Value(kid.get()); p.push_back(Fit(a, Arg(rt, k++))); } return JoinC(p); }() + "}", rt) : Value(s->x.get());
      if (v.lit && !rt) v.c = "std::string(" + v.c + ")";
      if (Head(rt) == "own" && IsNameExpr(v)) { Emit("return " + v.c + ";"); return; }
      Emit("return " + Fit(v, rt) + ";");
      return;
    }
    if (r == "ebk" || r == "enx") { Jump(s); return; }
    if (r == "etw") {
      mayThrow = true;
      if (!s->x) { Emit("throw;"); return; }
      X v = Value(s->x.get());
      Need("<stdexcept>");
      if (Head(v.t) == "txt") { Emit("throw std::runtime_error(" + v.c + ");"); return; }
      if (Head(v.t) == "exn") { Emit("throw std::runtime_error(" + Paren(v, P_POST) + ".what());"); return; }
      if (v.t && v.t->cls) { Emit("throw " + v.c + ";"); return; }
      Refuse("throwing a " + (v.t ? v.t->text : std::string("value")));
      return;
    }
    if (r == "edl") { X p = Value(s->x.get()); Emit("delete " + p.c + ";"); Emit(p.c + " = nullptr;"); return; }
    if (r == "ext") { Need("<cstdlib>"); Emit("std::exit(" + (s->x ? Value(s->x.get()).c : std::string("0")) + ");"); return; }
    if (r == "eyd") { Emit("co_yield " + Value(s->x.get()).c + ";"); return; }
    if (r == "hwr" || r == "hap" || r == "hby") {
      Use("files");
      X path = WhoValue(s);
      X v = Value(s->x.get());
      if (r == "hby") Emit("epp::hby(" + TxtArg(path) + ", " + v.c + ");");
      else Emit("epp::hwr(" + TxtArg(path) + ", " + TxtArg(v) + (r == "hap" ? ", true" : "") + ");");
      return;
    }
    if (r == "hrm" || r == "hmk") {
      Need("<filesystem>");
      Emit(std::string("std::filesystem::") + (r == "hrm" ? "remove_all(" : "create_directories(") + TxtArg(WhoValue(s)) + ");");
      return;
    }
    if (r == "hcp" || r == "hmv") {
      Need("<filesystem>"); mayThrow = true;
      std::string a = TxtArg(WhoValue(s)), b = TxtArg(Value(s->x.get()));
      if (r == "hcp") Emit("std::filesystem::copy(" + a + ", " + b + ", std::filesystem::copy_options::overwrite_existing);");
      else Emit("std::filesystem::rename(" + a + ", " + b + ");");
      return;
    }
    if (r.size() == 3 && r[0] == 'a' && (r == "add" || r == "asb" || r == "aml" || r == "adv" || r == "amd" || r == "apw" || r == "and" || r == "aor" || r == "axr" || r == "asl" || r == "asr" || r == "ant")) { Math(s); return; }
    if (r.size() == 3 && r[0] == 'l') { ListOp(s); return; }
    if (r == "xic") {
      std::string w = s->what;
      if (w.size() >= 2 && w.front() == '"') w = w.substr(1, w.size() - 2);
      if (!w.empty() && w[0] == '<') { Need(w); return; }
      if (w == "raylib.h" || w == "raymath.h" || w == "rlgl.h") { Need("\"" + w + "\""); return; }
      if (w.rfind("Q", 0) == 0) { Need("<" + w + ">"); return; }
      Refuse("xic of your own C++ file (" + w + ")");
      return;
    }
    if (r == "xlb") {
      if (s->what == "raylib") { Need("\"raylib.h\""); library = true; return; }
      library = true;
      Refuse("the " + s->what + " library");
      return;
    }
    if (r == "xus" || r == "xim" || r == "bts" || r == "dtp" || r == "dal" || r == "dpm" || r == "dbs") return;
    if (r == "xpp" || r == "xgl") { Refuse("a line of C++ (" + r + ")"); return; }
    if (r == "rcm") { Refuse("running a command on the computer (rcm)"); return; }
    if (r.size() == 3 && r[0] == 'd' && IsRoot(r)) return;   // functions, classes, enums: written outside main
    if (s->rootId == -1 || !IsRoot(r)) { CallStmt(s); return; }
    Refuse("the root " + r);
  }
  bool library = false;

  void Math(const Stmt* s) {
    const std::string& r = s->root;
    X p = WhoValue(s);
    std::string h = Head(p.t);
    std::string pc = Paren(p, P_ASSIGN + 1);
    if (r == "add") {
      if (IsMapHead(h)) {
        std::vector<const Expr*> kv;
        if (s->x->k == E::List) for (auto& k : s->x->kids) kv.push_back(k.get());
        if (kv.size() != 2) { Refuse("add on a map without a key and a value"); return; }
        Emit(Paren(p, P_POST) + "[" + Fit(Value(kv[0]), Arg(p.t, 0)) + "] = " + Fit(Value(kv[1]), Arg(p.t, 1)) + ";");
        return;
      }
      if (IsSetHead(h)) { Emit(Paren(p, P_POST) + ".insert(" + Fit(Value(s->x.get()), Arg(p.t, 0)) + ");"); return; }
      if (h == "vec" || h == "lst" || h == "dqu") {
        X v = s->x->k == E::List && Arg(p.t, 0) && IsListHead(Head(Arg(p.t, 0))) ? List(s->x.get(), Arg(p.t, 0)) : Value(s->x.get());
        std::string arg = Fit(v, Arg(p.t, 0));
        if (Head(Arg(p.t, 0)) == "own" && IsNameExpr(v)) arg = MoveIfName(v);
        if (!v.braces.empty()) arg = v.braces;
        if (Arg(p.t, 0) && Arg(p.t, 0)->cls && !v.ctor.empty() && SameT(v.t, Arg(p.t, 0)))
          Emit(Paren(p, P_POST) + ".emplace_back" + (v.ctor[0] == '(' ? v.ctor : "(" + v.c + ")") + ";");
        else Emit(Paren(p, P_POST) + ".push_back(" + arg + ");");
        return;
      }
      if (h == "stk" || h == "que" || h == "hep" || h == "mhp" || h == "chn") { Emit(Paren(p, P_POST) + ".push(" + Fit(Value(s->x.get()), Arg(p.t, 0)) + ");"); return; }
      if (h == "arr") { Refuse("add on an arr"); return; }
      X v = Value(s->x.get());
      if (h == "txt" && !(IsTxt(v.t) || Head(v.t) == "ltr")) { Refuse("adding a number to text"); return; }
      Emit(pc + " += " + v.c + ";");
      return;
    }
    X v = Value(s->x.get());
    if (r == "ant") { Emit(pc + " = ~" + Paren(v, P_UNARY) + ";"); return; }
    if (r == "apw") {
      if (h == "hug") { Use("hug"); Emit(pc + " = pow(" + p.c + ", " + v.c + ");"); return; }
      Need("<cmath>");
      if (IsInt(p.t)) Emit(pc + " = " + Cpp(p.t) + "(std::pow(" + p.c + ", " + v.c + "));");
      else Emit(pc + " = std::pow(" + p.c + ", " + v.c + ");");
      return;
    }
    if (r == "amd" && (IsDecT(p.t) || IsDecT(v.t))) { Need("<cmath>"); Emit(pc + " = std::fmod(" + p.c + ", " + v.c + ");"); return; }
    if ((r == "adv" || r == "amd") && IsInt(p.t)) mayDivide = true;
    std::string op = r == "asb" ? "-=" : r == "aml" ? "*=" : r == "adv" ? "/=" : r == "amd" ? "%=" : r == "and" ? "&=" : r == "aor" ? "|=" : r == "axr" ? "^=" : r == "asl" ? "<<=" : ">>=";
    if (ClassInfo* c = p.t ? p.t->cls : nullptr) {
      std::string bop = op.substr(0, op.size() - 1);
      if (!c->findOp(op) && c->findOp(bop)) { Emit(pc + " = " + Paren(p, P_ADD) + " " + bop + " " + Paren(v, P_MUL) + ";"); return; }
    }
    Emit(pc + " " + op + " " + v.c + ";");
  }

  void ListOp(const Stmt* s) {
    const std::string& r = s->root;
    X p = WhoValue(s);
    std::string h = Head(p.t);
    std::string pb = Paren(p, P_POST);
    auto range = [&] { return pb + ".begin(), " + pb + ".end()"; };
    Need("<algorithm>");
    if (r == "lwp") { if (h == "stk" || h == "que" || h == "hep" || h == "mhp") Emit(p.c + " = {};"); else Emit(pb + ".clear();"); return; }
    if (r == "lrm") {
      X v = Value(s->x.get());
      if (IsMapHead(h) || IsSetHead(h)) { Emit(pb + ".erase(" + Fit(v, Arg(p.t, 0)) + ");"); return; }
      if (h == "vec" || h == "dqu" || h == "lst") { Emit("std::erase(" + p.c + ", " + Fit(v, Arg(p.t, 0)) + ");"); return; }
      Refuse("lrm on a " + h); return;
    }
    if (r == "lpl") {
      if (h == "que" || h == "stk" || h == "hep" || h == "mhp") { Emit(pb + ".pop();"); return; }
      Emit(pb + ".pop_back();"); return;
    }
    if (r == "lpf") {
      if (h == "dqu" || h == "lst") { Emit(pb + ".pop_front();"); return; }
      if (h == "que") { Emit(pb + ".pop();"); return; }
      Emit(pb + ".erase(" + pb + ".begin());"); return;
    }
    if (r == "ldx") {
      X k = Value(s->x.get());
      if (h == "txt") { Emit(pb + ".erase(" + k.c + ", 1);"); return; }
      if (h == "lst") { Need("<iterator>"); Emit(pb + ".erase(std::next(" + pb + ".begin(), " + k.c + "));"); return; }
      Emit(pb + ".erase(" + pb + ".begin() + " + Paren(k, P_ADD + 1) + ");"); return;
    }
    if (r == "lin") {
      if (s->x->k != E::List || s->x->kids.size() != 2) { Refuse("lin without a place and a value"); return; }
      X k = Value(s->x->kids[0].get()), v = Value(s->x->kids[1].get());
      if (h == "txt") { Emit(pb + ".insert(" + k.c + ", " + TxtArg(v) + ");"); return; }
      Emit(pb + ".insert(" + pb + ".begin() + " + Paren(k, P_ADD + 1) + ", " + Fit(v, Arg(p.t, 0)) + ");"); return;
    }
    if (r == "lso" || r == "lss") {
      std::string f = r == "lso" ? "std::sort(" : "std::stable_sort(";
      const Type* et = ElemOf(p.t);
      if (et && et->cls && !et->cls->findOp("<")) needLess.insert(et->cls->name);
      if (h == "lst") { if (s->x && s->x->k != E::Now) Emit(pb + ".sort(" + Value(s->x.get()).c + ");"); else Emit(pb + ".sort();"); return; }
      if (s->x && s->x->k != E::Now) Emit(f + range() + ", " + Value(s->x.get()).c + ");");
      else Emit(f + range() + ");");
      return;
    }
    if (r == "lrv") { if (h == "lst") Emit(pb + ".reverse();"); else Emit("std::reverse(" + range() + ");"); return; }
    if (r == "lsu") { Use("shuffle"); Emit("epp::lsu(" + p.c + ");"); return; }
    if (r == "lfl") { Emit("std::fill(" + range() + ", " + Fit(Value(s->x.get()), Arg(p.t, 0)) + ");"); return; }
    if (r == "luq") { Emit("std::sort(" + range() + ");"); Emit(pb + ".erase(std::unique(" + range() + "), " + pb + ".end());"); return; }
    if (r == "lrs") { Emit(pb + ".resize(" + Value(s->x.get()).c + ");"); return; }
    if (r == "lrw") {
      X n = Value(s->x.get());
      Open("if (!" + pb + ".empty())");
      Emit("long long size = std::ssize(" + p.c + "), by = ((" + n.c + ") % size + size) % size;");
      Emit("std::rotate(" + pb + ".begin(), " + pb + ".begin() + by, " + pb + ".end());");
      Close();
      return;
    }
    Refuse("the list root " + r);
  }

  void CallStmt(const Stmt* s) {
    const std::string& name = s->root;
    std::vector<const Expr*> argEx;
    if (s->x) { if (s->x->k == E::List) for (auto& k : s->x->kids) argEx.push_back(k.get()); else argEx.push_back(s->x.get()); }
    if (s->who == "now") {
      if (curCls) if (FuncInfo* m = curCls->findMethod(name)) { Emit(Ident(name) + "(" + CallArgs(m, argEx) + ");"); return; }
      if (Var* v = Find(name)) {
        std::vector<X> a = Vals(argEx); std::vector<std::string> sv; for (auto& x : a) sv.push_back(x.c);
        Emit(v->cpp + "(" + JoinC(sv) + ");");
        return;
      }
      if (FuncInfo* f = FindFn(name)) { Emit(FnName(f) + "(" + CallArgs(f, argEx) + ");"); return; }
      if (library && Rl()) {
        if (const RlName* r = RlFind(kRlFns, name)) if (*r->header) Need(std::string("\"") + r->header + "\"");
        std::vector<X> a = Vals(argEx);
        Emit(name + "(" + RlArgs(a) + ");");
        return;
      }
      if (library) {
        std::vector<X> a = Vals(argEx); std::vector<std::string> sv; for (auto& x : a) sv.push_back(x.c);
        Emit(name + "(" + JoinC(sv) + ");");
        return;
      }
      Refuse("calling " + name);
      return;
    }
    // a method of something: rex speak now, v push_back 4, m lock now
    X b = WhoValue(s);
    if (Head(b.t) == "ptr" && Arg(b.t, 0) && !ClassOf(b)) b = Mk("*" + Paren(b, P_UNARY), Arg(b.t, 0), P_UNARY);
    if (ClassInfo* c = ClassOf(b)) {
      if (FuncInfo* f = c->findMethod(name)) { Emit(Dot(b) + Ident(name) + "(" + CallArgs(f, argEx) + ");"); return; }
      if (const FieldInfo* fi = FieldOf(c, name)) {
        std::vector<X> a = Vals(argEx); std::vector<std::string> sv; for (auto& x : a) sv.push_back(x.c);
        Emit(Dot(b) + Ident(fi->name) + "(" + JoinC(sv) + ");"); return;
      }
      Refuse(c->name + " has no " + name);
      return;
    }
    if (Head(b.t) == "cnd" && name == "wait") {
      if (argEx.size() != 2) { Refuse("wait without a lock and a check"); return; }
      X m = Value(argEx[0]), f = Value(argEx[1]);
      Need("<mutex>");
      for (auto it = locks.rbegin(); it != locks.rend(); ++it)
        if (it->first == m.c) { Emit(Paren(b, P_POST) + ".wait(" + it->second + ", " + f.c + ");"); return; }
      std::string lk = Fresh("lock");
      Emit("std::unique_lock<std::mutex> " + lk + "(" + m.c + ");");
      Emit(Paren(b, P_POST) + ".wait(" + lk + ", " + f.c + ");");
      Emit(lk + ".unlock();");
      return;
    }
    std::vector<X> a = Vals(argEx);
    X call = Method(b, name, a);
    if (call.c.find("not in the C++ View yet") != std::string::npos) { Refuse(s->who + " " + name); return; }
    Emit(call.c + ";");
  }

  // ------------------------------------------------------------ functions
  std::string TParamOf(FuncInfo* f, const std::string& name) {
    auto st = fnStmt.find(f);
    if (!f || st == fnStmt.end()) return "";
    for (Stmt* b : st->second->body)
      if (b->root == "dpm" && b->who == name) {
        std::string w = b->what;
        for (const char* pre : {"ref@", "see@", "tkn@"}) if (w.rfind(pre, 0) == 0) w = w.substr(4);
        for (auto& tp : f->tparams) if (tp == w) return Ident(tp);
      }
    return "";
  }
  std::string ParamType(const Param& p, bool inCtorOf = false, ClassInfo* self = nullptr, FuncInfo* f = nullptr) {
    std::string t = p.type ? Cpp(p.type) : "auto";
    if (!p.type && f) { std::string tp = TParamOf(f, p.name); if (!tp.empty()) t = tp; }
    if (p.ref) return t + "&";
    if (p.look) return "const " + t + "&";
    if (p.take && inCtorOf && p.type && p.type->cls == self) return t + "&&";
    return t;
  }
  std::string DefaultArg(const Param& p) {
    if (!p.def) return "";
    X d = Value(p.def.get());
    return " = " + (d.lit && Head(p.type) == "txt" ? d.c : Fit(d, p.type));
  }
  std::string ParamList(FuncInfo* f, bool lambda, ClassInfo* ctorOf = nullptr) {
    std::vector<std::string> ps;
    for (auto& p : f->params) ps.push_back(ParamType(p, ctorOf != nullptr, ctorOf, f) + " " + Ident(p.name) + (lambda ? "" : DefaultArg(p)));
    return JoinC(ps);
  }
  std::string RetCpp(FuncInfo* f) {
    if (f->isGen) return Cpp(f->ret);
    if (!f->ret) return f->returnsNothing ? "void" : "auto";
    if (f->ret == TY_ANY) {
      auto st = fnStmt.find(f);
      if (st != fnStmt.end()) for (auto& tp : f->tparams) if (tp == st->second->what) return Ident(tp);
      return "auto";
    }
    std::string r = Cpp(f->ret);
    if (f->retRef) r += "&";
    return r;
  }
  std::string TemplateHead(FuncInfo* f) {
    if (f->tparams.empty()) return "";
    std::string r = "template <";
    for (size_t k = 0; k < f->tparams.size(); ++k) r += (k ? ", " : "") + std::string("class ") + Ident(f->tparams[k]);
    return r + ">";
  }
  bool EndsWithReturn(const std::vector<Stmt*>& body) {
    for (auto it = body.rbegin(); it != body.rend(); ++it) {
      Stmt* s = *it;
      if (s->root == "dpm") continue;
      if (s->root == "ert" || s->root == "etw" || s->root == "ext") return true;
      if (s->root == "wfv") return true;
      if (s->root.size() == 3 && s->root[0] == 'i' && !s->chain.empty() && s->chain.back()->root == "oth") {
        if (!EndsWithReturn(s->body)) return false;
        for (Stmt* o : s->chain) if (!EndsWithReturn(o->body)) return false;
        return true;
      }
      return false;
    }
    return false;
  }
  void FuncBody(FuncInfo* f, bool lambda) {
    Push(!lambda);
    for (auto& p : f->params) Declare(p.name, p.type, Ident(p.name));
    fns.push_back(FnCtx{f, lambda});
    std::vector<LoopCtx> savedLoops;
    savedLoops.swap(loops);
    for (Stmt* s : f->body) { if (s->root == "dpm") continue; One(s); }
    loops.swap(savedLoops);
    if (f->ret && f->ret != TY_ANY && !f->isGen && !f->retRef && !EndsWithReturn(f->body)) {
      curLine = nullptr;
      Emit("return " + DefaultExpr(f->ret) + ";");
    }
    fns.pop_back();
    Pop();
  }
  void Function(FuncInfo* f, const std::string& name, bool proto) {
    if (fnStmt.count(f)) Line(fnStmt[f]); else curLine = nullptr;
    std::string th = TemplateHead(f);
    std::string head = RetCpp(f) + " " + name + "(" + ParamList(f, false) + ")";
    if (f->root == "dcx") head = "constexpr " + head;
    if (proto) { if (!th.empty()) Emit(th); Emit(head + ";"); return; }
    if (!th.empty()) Emit(th);
    // a default value goes on the first line the compiler sees: the prototype
    if (hasProto.count(f)) head = RetCpp(f) + " " + name + "(" + ParamListNoDefaults(f) + ")";
    if (f->root == "dcx") head = "constexpr " + head;
    Open(head);
    FuncBody(f, false);
    Close();
  }
  std::string ParamListNoDefaults(FuncInfo* f) {
    std::vector<std::string> ps;
    for (auto& p : f->params) ps.push_back(ParamType(p, false, nullptr, f) + " " + Ident(p.name));
    return JoinC(ps);
  }
  std::set<FuncInfo*> hasProto;

  // ------------------------------------------------------------ classes
  std::map<std::string, bool> modMemo;
  bool Modifies(ClassInfo* c, const std::vector<Stmt*>& body, int depthLimit = 0) {
    for (Stmt* s : body) {
      const std::string& r = s->root;
      std::string who = s->who;
      size_t at = who.find('@');
      std::string base = at == std::string::npos ? who : who.substr(0, at);
      bool field = base == "slf" || FieldOf(c, base) || StaticOf(c, base);
      bool changes = r == "is" || (r.size() == 3 && (r[0] == 'a' || r[0] == 'l') && IsRoot(r)) || r == "get" || r == "gln" || r == "mmv";
      if (field && changes && !(r == "is" && Find(base))) return true;
      if (s->rootId == -1 || !IsRoot(r)) {
        if (who == "now") { if (FuncInfo* m = c->findMethod(r)) { if (depthLimit < 8 && MethodModifies(c, m, depthLimit + 1)) return true; } }
        else if (field) {
          const FieldInfo* fi = FieldOf(c, base);
          if (fi && fi->type && fi->type->cls) { if (FuncInfo* m = fi->type->cls->findMethod(r)) if (depthLimit < 8 && MethodModifies(fi->type->cls, m, depthLimit + 1)) return true; }
          else return true;
        }
      }
      if (r == "mrf" || r == "mpt") return true;
      if (Modifies(c, s->body, depthLimit)) return true;
      for (Stmt* ch : s->chain) if (Modifies(c, ch->body, depthLimit)) return true;
    }
    return false;
  }
  bool MethodModifies(ClassInfo* c, FuncInfo* m, int depthLimit = 0) {
    std::string key = c->name + "::" + m->name;
    auto it = modMemo.find(key);
    if (it != modMemo.end()) return it->second;
    modMemo[key] = true;   // while we look, assume it does
    bool r = m->retRef || Modifies(c, m->body, depthLimit);
    modMemo[key] = r;
    return r;
  }
  std::string Access(int vis) { return vis == 1 ? "private:" : vis == 2 ? "protected:" : "public:"; }
  void Method(ClassInfo* c, FuncInfo* f) {
    if (fnStmt.count(f)) Line(fnStmt[f]); else curLine = nullptr;
    std::string th = TemplateHead(f);
    if (!th.empty()) Emit(th);
    std::string name = Ident(f->name);
    std::string head;
    // one answer for every class with this method, so an override matches what it overrides
    bool isConst = f->root == "dkn";
    if (!isConst && !f->isStatic) {
      isConst = true;
      for (auto& cp : P->classStore) {
        auto it = cp->methods.find(f->name);
        if (it != cp->methods.end() && it->second->cls == cp.get() && it->second->root != "dmb" && MethodModifies(cp.get(), it->second)) isConst = false;
      }
    }
    if (f->root == "dsf") head = "static " + RetCpp(f) + " " + name + "(" + ParamList(f, false) + ")";
    else head = std::string(f->root == "dvr" || f->root == "dmb" ? "virtual " : "") + RetCpp(f) + " " + name + "(" + ParamList(f, false) + ")";
    if (f->root != "dsf" && isConst) head += " const";
    if (f->root == "dov") head += " override";
    if (f->root == "dmb") { Emit(head + " = 0;"); return; }
    Open(head);
    FuncBody(f, false);
    Close();
  }
  void Operator(ClassInfo* c, FuncInfo* f) {
    if (fnStmt.count(f)) Line(fnStmt[f]); else curLine = nullptr;
    std::string op = f->op;
    std::string sym = op == "call" ? "()" : op == "at" ? "[]" : op;
    bool isConst = !MethodModifies(c, f) && op.find('=') == std::string::npos;
    if (op == "==" || op == "<" || op == "!=" || op == ">" || op == "<=" || op == ">=") isConst = true;
    std::string ret = RetCpp(f);
    if ((op == "+=" || op == "-=" || op == "*=" || op == "/=") && f->retRef) ret = Cpp(f->ret) + "&";
    std::string head = ret + " operator" + sym + "(" + ParamList(f, false) + ")" + (isConst ? " const" : "");
    Open(head);
    FuncBody(f, false);
    Close();
    if (op == "<") {
      std::string self = ClassName(c);
      std::string pt = f->params.empty() ? self : ParamType(f->params[0]);
      if (!c->findOp(">")) Emit("bool operator>(" + pt + " other) const { return other < *this; }");
      if (!c->findOp("<=")) Emit("bool operator<=(" + pt + " other) const { return !(other < *this); }");
      if (!c->findOp(">=")) Emit("bool operator>=(" + pt + " other) const { return !(*this < other); }");
    }
  }
  void Ctor(ClassInfo* c, FuncInfo* f) {
    if (fnStmt.count(f)) Line(fnStmt[f]); else curLine = nullptr;
    std::string head = Ident(c->name) + "(" + ParamList(f, false, c) + ")";
    if (f->params.size() == 1 && !f->params[0].def && !(f->params[0].type && f->params[0].type->cls == c)) head = "explicit " + head;
    head = head.rfind("explicit ", 0) == 0 ? head.substr(9) : head;
    // the parents, built first (dbs)
    std::vector<std::string> init;
    Push(true);
    for (auto& p : f->params) Declare(p.name, p.type, Ident(p.name));
    fns.push_back(FnCtx{f, false});
    for (Stmt* b : f->dbs) {
      Line(b);
      std::string parent = b->who == "now" ? (c->parents.empty() ? "" : ClassName(c->parents[0])) : (FindClass(b->who) ? ClassName(FindClass(b->who)) : Ident(b->who));
      std::vector<std::string> a;
      if (b->x) { if (b->x->k == E::List) for (auto& k : b->x->kids) a.push_back(Value(k.get()).c); else a.push_back(Value(b->x.get()).c); }
      init.push_back(parent + "(" + JoinC(a) + ")");
    }
    fns.pop_back();
    Pop();
    if (fnStmt.count(f)) Line(fnStmt[f]);
    if (!init.empty()) head += " : " + JoinC(init);
    Open(head);
    FuncBody(f, false);
    Close();
  }
  void Field(ClassInfo* c, const FieldInfo& fi) {
    std::string ty = Cpp(fi.type);
    if (fi.bits) { Emit((fi.type ? ty : std::string("unsigned")) + " " + Ident(fi.name) + " : " + std::to_string(fi.bits) + ";"); return; }
    std::string init;
    if (fi.def) {
      X d = Value(fi.def);
      init = d.braces.empty() ? " = " + Fit(d, fi.type) : " = " + d.braces;
      if (!d.ctor.empty() && SameT(d.t, fi.type)) init = "{" + d.ctor.substr(1, d.ctor.size() - 2) + "}";
    } else if (!c->isUnion) init = DefaultInit(fi.type);
    if (c->isUnion && fi.def == nullptr) init = "";
    Emit(ty + " " + Ident(fi.name) + init + ";");
  }
  void Class(ClassInfo* c) {
    ClassInfo* savedCls = curCls;
    curCls = c;
    std::string sg = curGroup;
    curGroup = c->group;
    Stmt* cs = nullptr;
    for (auto& sp : P->stmts) if (sp->cls == c && (sp->root == "dcl" || sp->root == "dst" || sp->root == "dun")) cs = sp.get();
    if (cs) Line(cs); else curLine = nullptr;
    if (!c->tparams.empty()) {
      std::string r = "template <";
      for (size_t k = 0; k < c->tparams.size(); ++k) r += (k ? ", " : "") + std::string("class ") + Ident(c->tparams[k]);
      Emit(r + ">");
    }
    std::string head = std::string(c->isUnion ? "union " : c->isStruct ? "struct " : "class ") + Ident(c->name);
    if (!c->parents.empty()) {
      head += " : ";
      for (size_t k = 0; k < c->parents.size(); ++k) head += (k ? ", public " : "public ") + ClassName(c->parents[k]);
    }
    Open(head);
    int vis = c->isStruct || c->isUnion ? 0 : -1;
    auto setVis = [&](int v) { if (v != vis) { --depth; curLine = nullptr; Emit(" " + Access(v)); ++depth; vis = v; } };
    Push(true);
    // shared fields (dsh)
    for (auto& sp : P->stmts) {
      Stmt* s = sp.get();
      if (s->root != "dsh" || !s->parent || s->parent->cls != c) continue;
      setVis(0);
      Line(s);
      if (s->x) { X v = Value(s->x.get()); Emit("static inline " + (v.lit ? std::string("std::string") : Cpp(v.t)) + " " + Ident(s->who) + " = " + v.c + ";"); }
      else { const Type* t = T(s->what); Emit("static inline " + Cpp(t) + " " + Ident(s->who) + DefaultInit(t) + ";"); }
    }
    // enums made inside the class
    for (auto& sp : P->stmts) {
      Stmt* s = sp.get();
      if (s->root != "den" || !s->parent || s->parent->cls != c) continue;
      setVis(0);
      Line(s);
      for (auto& kv : P->enums) if (kv.second->name == s->who) { EnumDecl(kv.second); break; }
    }
    for (auto& fi : c->own) { setVis(fi.vis); curLine = nullptr; Field(c, fi); }
    setVis(0);
    if (genCtor.count(c->name)) {
      curLine = nullptr;
      std::vector<std::string> ps, in;
      for (auto& fi : c->own) { ps.push_back(Cpp(fi.type) + " " + Ident(fi.name) + "_"); in.push_back(Ident(fi.name) + "(" + Ident(fi.name) + "_)"); }
      Emit(Ident(c->name) + "() = default;");
      Emit(Ident(c->name) + "(" + JoinC(ps) + ") : " + JoinC(in) + " {}");
    }
    for (FuncInfo* f : c->ctors) Ctor(c, f);
    if (c->dtor) {
      if (fnStmt.count(c->dtor)) Line(fnStmt[c->dtor]); else curLine = nullptr;
      Open(std::string(c->hasVirtual() ? "virtual " : "") + "~" + Ident(c->name) + "()");
      FuncBody(c->dtor, false);
      Close();
    } else if (c->hasVirtual() && c->parents.empty()) { curLine = nullptr; Emit("virtual ~" + Ident(c->name) + "() = default;"); }
    for (auto& kv : c->methods) {
      FuncInfo* f = kv.second;
      if (f->cls != c) continue;
      int v = f->root == "dhd" ? 1 : f->root == "dfy" ? 2 : 0;
      setVis(v);
      Method(c, f);
    }
    setVis(0);
    for (auto& kv : c->ops) if (kv.second->cls == c || !kv.second->cls) Operator(c, kv.second);
    if (needEq.count(c->name) && !c->findOp("==") && !needLess.count(c->name)) { curLine = nullptr; Emit("bool operator==(const " + Ident(c->name) + "&) const = default;"); }
    if (needLess.count(c->name) && !c->findOp("<")) { curLine = nullptr; Emit("auto operator<=>(const " + Ident(c->name) + "&) const = default;"); }
    Pop();
    Close("};");
    curCls = savedCls;
    curGroup = sg;
  }
  void ShowClass(ClassInfo* c) {
    curLine = nullptr;
    std::string th, ty = Ident(c->name);
    if (!c->tparams.empty()) {
      th = "template <";
      ty += "<";
      for (size_t k = 0; k < c->tparams.size(); ++k) { th += (k ? ", " : "") + std::string("class ") + Ident(c->tparams[k]); ty += (k ? ", " : "") + Ident(c->tparams[k]); }
      th += "> "; ty += ">";
    }
    Use("show");
    Open(th + "std::ostream& operator<<(std::ostream& out, const " + ty + "& x)");
    std::string text = "\"" + c->name + "(";
    bool first = true;
    std::vector<std::string> lines;
    for (auto& fa : c->all) {
      const FieldInfo& fi = fa.first->own[fa.second];
      if (fi.vis != 0) continue;
      lines.push_back("out << \"" + std::string(first ? "" : ", ") + (first ? c->name + "(" : "") + fi.name + ": \";");
      lines.push_back(Head(fi.type) == "txt" ? "out << x." + Ident(fi.name) + ";" : "epp::put(out, x." + Ident(fi.name) + ");");
      first = false;
    }
    if (first) Emit("return out << \"" + c->name + "()\";");
    else { for (auto& l : lines) Emit(l); Emit("return out << ')';"); }
    Close();
    (void)text;
  }
  void EnumDecl(EnumInfo* e) {
    std::vector<std::string> ns;
    for (auto& n : e->names) ns.push_back(Ident(n));
    Emit("enum class " + Ident(e->name) + " { " + JoinC(ns) + " };");
  }
  void ShowEnum(EnumInfo* e, const std::string& qual) {
    curLine = nullptr;
    std::vector<std::string> ns;
    for (auto& n : e->names) ns.push_back("\"" + n + "\"");
    Emit("inline std::ostream& operator<<(std::ostream& out, " + qual + " x) {");
    Emit("  const char* names[] = {" + JoinC(ns) + "};");
    Emit("  return out << names[int(x)];");
    Emit("}");
  }

  // ------------------------------------------------------------ the whole file
  std::vector<ClassInfo*> ClassOrder() {
    std::vector<ClassInfo*> order;
    std::set<ClassInfo*> done, busy;
    std::function<void(ClassInfo*)> visit = [&](ClassInfo* c) {
      if (done.count(c) || busy.count(c)) return;
      busy.insert(c);
      for (ClassInfo* p : c->parents) visit(p);
      for (auto& f : c->own) {
        std::function<void(const Type*)> need = [&](const Type* t) {
          if (!t) return;
          if (t->cls && t->cls != c) visit(t->cls);
          if (t->head == "ptr" || t->head == "own" || t->head == "shr") return;
          for (auto* a : t->args) need(a);
        };
        need(f.type);
      }
      busy.erase(c);
      done.insert(c);
      order.push_back(c);
    };
    for (auto& cp : P->classStore) visit(cp.get());
    return order;
  }
  bool ClassInsideClass(ClassInfo* c) {
    for (auto& sp : P->stmts) if (sp->cls == c && sp->parent && sp->parent->cls && sp->parent->cls != c) return true;
    return false;
  }
  bool EnumInsideClass(EnumInfo* e) {
    for (auto& sp : P->stmts) if (sp->root == "den" && sp->who == e->name && sp->parent && sp->parent->cls) return true;
    return false;
  }

  std::string Generate() {
    tmpCount = 0;
    scopes.clear(); scopes.push_back(Scope{});
    fns.clear(); loops.clear();
    curCls = nullptr; curGroup.clear();
    missing.clear();
    library = P->usesRaylib || P->usesQt || P->usesSdl;
    std::vector<std::string> enums, classes, protos, globals, funcs, mainLines;
    // a section of the file, wrapped in its group's namespace
    std::map<std::string, std::vector<std::string>> byGroup;
    auto inGroup = [&](std::vector<std::string>& to, const std::string& g, const std::function<void()>& fill) {
      std::vector<std::string> part;
      out = &part;
      std::string sg = curGroup; curGroup = g;
      fill();
      curGroup = sg;
      if (part.empty()) return;
      if (g.empty()) { to.insert(to.end(), part.begin(), part.end()); return; }
      to.push_back("namespace " + Ident(g) + " {");
      if (pieces.count("show")) to.push_back("using epp::operator<<;");
      to.insert(to.end(), part.begin(), part.end());
      to.push_back("}  // namespace " + Ident(g));
    };
    std::set<std::string> groups{""};
    for (auto& g : P->groups) groups.insert(g);
    // enums
    for (const std::string& g : groups) inGroup(enums, g, [&] {
      for (auto& ep : P->enumStore) {
        EnumInfo* e = ep.get();
        if (e->group != g || EnumInsideClass(e)) continue;
        curLine = nullptr;
        EnumDecl(e);
        if (needShow.count("enum:" + e->name)) ShowEnum(e, Ident(e->name));
      }
    });
    // classes
    std::vector<ClassInfo*> order = ClassOrder();
    for (const std::string& g : groups) inGroup(classes, g, [&] {
      bool any = false;
      for (ClassInfo* c : order) if (c->group == g && c->tparams.empty() && !ClassInsideClass(c)) { if (!any) curLine = nullptr; Emit((c->isStruct ? "struct " : c->isUnion ? "union " : "class ") + Ident(c->name) + ";"); any = true; }
      for (ClassInfo* c : order) {
        if (c->group != g || ClassInsideClass(c)) continue;
        out->push_back("");
        Class(c);
        for (auto& sp : P->stmts) if (sp->root == "den" && sp->parent && sp->parent->cls == c)
          for (auto& ep : P->enumStore) if (ep->name == sp->who && needShow.count("enum:" + ep->name)) ShowEnum(ep.get(), Ident(c->name) + "::" + Ident(ep->name));
        if (needShow.count(c->name) && !c->isUnion) { curCls = nullptr; ShowClass(c); }
      }
    });
    // functions: prototypes, then the bodies
    std::vector<FuncInfo*> topFns;
    for (auto& kv : P->funcs) if (!kv.second->cls && !kv.second->isLambda) topFns.push_back(kv.second);
    std::sort(topFns.begin(), topFns.end(), [](FuncInfo* a, FuncInfo* b) { return a->file != b->file ? a->file > b->file : a->line < b->line; });
    hasProto.clear();
    for (const std::string& g : groups) inGroup(protos, g, [&] {
      for (FuncInfo* f : topFns) {
        if (FnGroup(f) != g) continue;
        if (RetCpp(f) == "auto") continue;
        hasProto.insert(f);
        Function(f, GlobalIdent(f->name), true);
      }
    });
    // globals (mgl / mtl)
    out = &globals;
    for (Stmt* s : P->globals) {
      Line(s);
      std::string prefix = s->root == "mtl" ? "thread_local " : "";
      if (s->kind) { Var* v = Declare(s->who, s->kind, GlobalIdent(s->who)); Emit(prefix + Cpp(s->kind) + " " + v->cpp + DefaultInit(s->kind) + ";"); continue; }
      X x = Value(s->x.get());
      const Type* t = x.lit ? TY_TXT : x.t;
      Var* v = Declare(s->who, t, GlobalIdent(s->who));
      Emit(DeclWith(v->cpp, x, t, prefix));
    }
    for (const std::string& g : groups) inGroup(funcs, g, [&] {
      for (FuncInfo* f : topFns) {
        if (FnGroup(f) != g) continue;
        out->push_back("");
        Function(f, GlobalIdent(f->name), false);
      }
    });
    // main
    out = &mainLines;
    curLine = nullptr;
    Open("int main()");
    Push(true);
    for (Stmt* s : P->mainBody) One(s);
    Pop();
    Close();

    // put it together
    std::vector<std::string> file;
    if (!missing.empty()) file.push_back("// C++ View: " + missing + " is not in the Web Studio's C++ View yet.");
    file.push_back("// The C++ View of this English++ program: standard C++20, one file.");
    file.push_back("// Build it with: g++ -std=c++20 program.cpp  (or clang++ -std=c++20)");
    if (library) file.push_back("// It uses a library, so the library's headers and files are needed too.");
    std::vector<std::string> lib, std;
    for (auto& i : includes) (i[0] == '"' ? lib : std).push_back("#include " + i);
    file.insert(file.end(), std.begin(), std.end());
    file.insert(file.end(), lib.begin(), lib.end());
    // the helper pieces, in the order they are listed (each one's needs come first)
    bool anyPiece = false;
    for (const Piece& pc : kPieces) {
      if (!pieces.count(pc.name)) continue;
      if (!anyPiece) { file.push_back(""); file.push_back("// ---- the Studio's helpers (only the ones this program uses)"); anyPiece = true; }
      std::istringstream in(pc.code);
      for (std::string l; std::getline(in, l);) file.push_back(l);
    }
    if (pieces.count("show")) file.push_back("using epp::operator<<;");
    if (anyPiece) file.push_back("// ---- the program");
    auto add = [&](const std::vector<std::string>& part) { if (part.empty()) return; file.push_back(""); file.insert(file.end(), part.begin(), part.end()); };
    add(enums); add(classes); add(protos); add(globals); add(funcs);
    file.push_back("");
    file.insert(file.end(), mainLines.begin(), mainLines.end());
    std::string r;
    for (auto& l : file) {
      // no spaces at the end of a line
      size_t e = l.find_last_not_of(' ');
      r += (e == std::string::npos ? std::string() : l.substr(0, e + 1)) + "\n";
    }
    return r;
  }

 public:
  std::string Run() {
    for (auto& sp : P->stmts) if (sp->fn && !fnStmt.count(sp->fn)) fnStmt[sp->fn] = sp.get();
    std::vector<std::string> first;
    Generate();          // the first pass learns what the classes need (==, <, printing, a maker)
    std::string r = Generate();
    return r;
  }
};

}  // namespace

// ====================================================================== the outside
static std::string g_lastSrc, g_lastCpp, g_lastMissing;
static bool g_haveLast = false;

std::string ToCpp(const std::string& src) {
  if (g_haveLast && src == g_lastSrc) return g_lastCpp;
  Program* savedProg = g_prog;
  int savedLine = g_line;
  std::string savedFile = g_file;
  static std::unique_ptr<Program> keep;   // the types made while writing point into it
  std::unique_ptr<Program> prog;
  std::string result, missing;
  Caught c = Protect([&] { prog = BuildProgram(src); });
  if (c.k != CK_NONE || !prog) {
    std::string why = c.k == CK_PROBLEM ? c.p.msg : std::string("it couldn't be read");
    int line = c.k == CK_PROBLEM ? c.p.line : 0;
    missing = "a program with a problem";
    result = "// C++ View: a program with a problem is not in the Web Studio's C++ View yet.\n// Fix this first" +
             (line > 0 ? " (line " + std::to_string(line) + ")" : std::string()) + ": " + why + "\n";
  } else {
    g_prog = prog.get();
    Writer w(prog.get());
    Caught c2 = Protect([&] { result = w.Run(); });
    missing = w.missing;
    if (c2.k != CK_NONE) {
      missing = c2.k == CK_PROBLEM ? c2.p.msg : std::string("something in this program");
      result = "// C++ View: " + missing + " is not in the Web Studio's C++ View yet.\n";
    }
    keep = std::move(prog);
  }
  g_prog = savedProg;
  g_line = savedLine;
  g_file = savedFile;
  g_lastSrc = src; g_lastCpp = result; g_lastMissing = missing; g_haveLast = true;
  return result;
}

bool CppViewComplete(const std::string& src) {
  ToCpp(src);
  return g_lastMissing.empty();
}

std::string CppViewMissing(const std::string& src) {
  ToCpp(src);
  return g_lastMissing;
}

}  // namespace epp
