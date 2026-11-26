#pragma once
#include "interp.h"

namespace epp {
struct GenFull {};
enum CatchKind { CK_NONE = 0, CK_THROWN, CK_PROBLEM, CK_EXIT, CK_STOP, CK_GENFULL };
struct Caught { CatchKind k = CK_NONE; Thrown t; Problem p; int code = 0; };
[[noreturn]] void ThrowStd(const std::string& what);
[[noreturn]] void ThrowThrown(const Thrown& t);
[[noreturn]] void ThrowExit(int code);
[[noreturn]] void ThrowStop();
[[noreturn]] void ThrowGenFull();
Caught Protect(const std::function<void()>& fn);
[[noreturn]] void Rethrow(const Caught& c);
bool CatchProblem(const std::function<void()>& fn);
int SafeStoi(const std::string& s);
double SafeStod(const std::string& s);
bool RegexSearch(const std::string& text, const std::string& pattern);
std::vector<std::string> RegexAll(const std::string& text, const std::string& pattern);
std::string RegexReplace(const std::string& text, const std::string& pattern, const std::string& with);
}  // namespace epp
