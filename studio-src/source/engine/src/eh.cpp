// eh.cpp — the only file that throws or catches C++ exceptions.
// (In the browser build the rest of the engine is compiled without exception
// support so it runs fast; problems still travel up to the nearest catcher here.)
#include "eh.h"
#include <regex>
#include <cmath>

namespace epp {

[[noreturn]] void Bad(const std::string& m) { throw Problem{m, g_line, g_file}; }
[[noreturn]] void NotYet(const std::string& what) { throw Problem{what + " is not in the Web Studio yet.", g_line, g_file}; }
[[noreturn]] void ThrowStd(const std::string& what) { throw Thrown::Std(what); }
[[noreturn]] void ThrowThrown(const Thrown& t) { throw t; }
[[noreturn]] void ThrowExit(int code) { throw ExitNow{code}; }
[[noreturn]] void ThrowStop() { throw StopNow{}; }
[[noreturn]] void ThrowGenFull() { throw GenFull{}; }

Caught Protect(const std::function<void()>& fn) {
  Caught c;
  try {
    fn();
  } catch (Thrown& t) {
    c.k = CK_THROWN; c.t = t;
  } catch (Problem& p) {
    c.k = CK_PROBLEM; c.p = p;
  } catch (ExitNow& e) {
    c.k = CK_EXIT; c.code = e.code;
  } catch (StopNow&) {
    c.k = CK_STOP;
  } catch (GenFull&) {
    c.k = CK_GENFULL;
  } catch (std::bad_alloc&) {
    c.k = CK_PROBLEM; c.p = Problem{"The program ran out of memory.", g_line, g_file};
  } catch (std::exception& e) {
    c.k = CK_PROBLEM; c.p = Problem{std::string("Something went wrong inside the Web Studio: ") + e.what(), g_line, g_file};
  }
  return c;
}
[[noreturn]] void Rethrow(const Caught& c) {
  switch (c.k) {
    case CK_THROWN: throw c.t;
    case CK_PROBLEM: throw c.p;
    case CK_EXIT: throw ExitNow{c.code};
    case CK_STOP: throw StopNow{};
    case CK_GENFULL: throw GenFull{};
    default: throw Problem{"internal: nothing to rethrow", g_line, g_file};
  }
}
bool CatchProblem(const std::function<void()>& fn) {
  try { fn(); return true; } catch (Problem&) { return false; }
}

// C++ library calls that throw, with the same messages MSVC gives
int SafeStoi(const std::string& s) {
  try {
    size_t pos = 0;
    long long v = std::stoll(s, &pos);
    (void)pos;
    if (v < INT32_MIN || v > INT32_MAX) throw Thrown::Std("stoi argument out of range");
    return (int)v;
  } catch (std::invalid_argument&) {
    throw Thrown::Std("invalid stoi argument");
  } catch (std::out_of_range&) {
    throw Thrown::Std("stoi argument out of range");
  }
}
double SafeStod(const std::string& s) {
  try { return std::stod(s); }
  catch (std::invalid_argument&) { throw Thrown::Std("invalid stod argument"); }
  catch (std::out_of_range&) { throw Thrown::Std("stod argument out of range"); }
}
static std::regex MakeRegex(const std::string& p) {
  try { return std::regex(p); }
  catch (std::regex_error& e) { throw Thrown::Std(std::string("regex_error: ") + e.what()); }
}
bool RegexSearch(const std::string& text, const std::string& pattern) {
  std::regex r = MakeRegex(pattern);
  return std::regex_search(text, r);
}
std::vector<std::string> RegexAll(const std::string& text, const std::string& pattern) {
  std::regex r = MakeRegex(pattern);
  std::vector<std::string> out;
  for (auto it = std::sregex_iterator(text.begin(), text.end(), r); it != std::sregex_iterator(); ++it) out.push_back(it->str());
  return out;
}
std::string RegexReplace(const std::string& text, const std::string& pattern, const std::string& with) {
  std::regex r = MakeRegex(pattern);
  return std::regex_replace(text, r, with);
}

}  // namespace epp
