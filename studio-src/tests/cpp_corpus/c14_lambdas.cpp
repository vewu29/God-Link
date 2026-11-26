#include <iostream>
#include <functional>
#include <vector>
#include <string>
std::function<int(int)> make_adder(int n) { return [n](int x) { return x + n; }; }
auto make_counter() { int c = 0; return [c]() mutable { return ++c; }; }
int apply_twice(const std::function<int(int)>& f, int x) { return f(f(x)); }
int main() {
    auto add5 = make_adder(5);
    std::cout << add5(10) << " " << apply_twice(add5, 0) << "\n";
    auto c1 = make_counter(), c2 = make_counter();
    std::cout << c1() << c1() << c1() << " " << c2() << "\n";
    int total = 0;
    auto accum = [&total](int x) { total += x; };
    for (int i = 1; i <= 10; ++i) accum(i);
    std::cout << "total " << total << "\n";
    std::vector<std::function<std::string(const std::string&)>> pipeline{
        [](const std::string& s) { return s + "!"; },
        [](const std::string& s) { return "<" + s + ">"; },
        [](const std::string& s) { return s + s; }};
    std::string s = "hi";
    for (auto& f : pipeline) s = f(s);
    std::cout << s << "\n";
    auto generic = [](auto a, auto b) { return a + b; };
    std::cout << generic(1, 2) << " " << generic(1.5, 2.25) << " " << generic(std::string("a"), std::string("b")) << "\n";
    std::function<int(int)> fact = [&fact](int n) { return n <= 1 ? 1 : n * fact(n - 1); };
    std::cout << "10! = " << fact(10) << "\n";
    auto compose = [](auto f, auto g) { return [=](auto x) { return f(g(x)); }; };
    auto inc_then_double = compose([](int x) { return x * 2; }, [](int x) { return x + 1; });
    std::cout << inc_then_double(4) << "\n";
    std::function<void()> empty;
    try { empty(); } catch (const std::bad_function_call&) { std::cout << "bad_function_call\n"; }
    int x = 1;
    auto byval = [=] { return x * 100; };
    x = 2;
    std::cout << byval() << " " << x << "\n";
    return 0;
}
