#include <iostream>
#include <stdexcept>
#include <vector>
#include <string>
class MyError : public std::runtime_error {
    int code_;
public:
    MyError(const std::string& msg, int code) : std::runtime_error(msg), code_(code) {}
    int code() const { return code_; }
};
struct Guard { const char* n; ~Guard() { std::cout << "unwind " << n << "\n"; } };
int risky(int x) {
    Guard g{"risky"};
    if (x < 0) throw std::invalid_argument("negative");
    if (x == 0) throw MyError("zero not allowed", 42);
    if (x > 100) throw 7;
    return 100 / x;
}
void rethrower() {
    try { risky(0); }
    catch (const MyError& e) { std::cout << "rethrowing " << e.code() << "\n"; throw; }
}
int main() {
    for (int x : {5, -1, 0, 500}) {
        try {
            std::cout << "result " << risky(x) << "\n";
        } catch (const MyError& e) {
            std::cout << "MyError: " << e.what() << " code " << e.code() << "\n";
        } catch (const std::invalid_argument& e) {
            std::cout << "invalid_argument: " << e.what() << "\n";
        } catch (int n) {
            std::cout << "int thrown: " << n << "\n";
        }
    }
    try { rethrower(); } catch (const std::exception& e) { std::cout << "outer got: " << e.what() << "\n"; }
    std::vector<int> v{1, 2, 3};
    try { std::cout << v.at(10); } catch (const std::out_of_range&) { std::cout << "out_of_range caught\n"; }
    try {
        try { throw std::logic_error("inner"); }
        catch (const std::logic_error& e) { std::cout << "inner caught: " << e.what() << "\n"; throw std::runtime_error("from inner handler"); }
    } catch (const std::runtime_error& e) { std::cout << "outer caught: " << e.what() << "\n"; }
    try { throw std::string("a string"); } catch (...) { std::cout << "catch-all\n"; }
    try { std::string s = "abc"; (void)s.substr(10); } catch (const std::out_of_range&) { std::cout << "substr out_of_range\n"; }
    try { (void)std::stoi("nope"); } catch (const std::invalid_argument&) { std::cout << "stoi invalid_argument\n"; }
    std::exception_ptr ep;
    try { throw MyError("stored", 9); } catch (...) { ep = std::current_exception(); }
    try { std::rethrow_exception(ep); } catch (const MyError& e) { std::cout << "rethrown ptr: " << e.what() << " " << e.code() << "\n"; }
    auto f = []() noexcept { return 1; };
    std::cout << "noexcept lambda " << noexcept(f()) << " " << f() << "\n";
    return 0;
}
