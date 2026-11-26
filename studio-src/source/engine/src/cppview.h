// cppview.h — the Web Studio's C++ View.
// epp::ToCpp(src) (declared in epp.h) turns an English++ program into one C++20 file
// that builds on its own (standard headers only) and prints what the program prints.
// When a line can't be written as C++ here yet, the file's first line says so and
// CppViewComplete(src) is false: the C++ View never guesses.
#pragma once
#include "epp.h"
#include <string>

namespace epp {
std::string ToCpp(const std::string& src);
bool CppViewComplete(const std::string& src);
// the first thing that couldn't be written (empty when the view is complete)
std::string CppViewMissing(const std::string& src);
}  // namespace epp
