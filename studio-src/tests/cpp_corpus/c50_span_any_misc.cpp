#include <iostream>
#include <span>
#include <any>
#include <string>
#include <vector>
#include <array>
#include <initializer_list>
int sum(std::span<const int> s) { int t = 0; for (int x : s) t += x; return t; }
double avg(std::initializer_list<double> xs) { double t = 0; for (double x : xs) t += x; return xs.size() ? t / xs.size() : 0; }
int main() {
    int raw[] = {1, 2, 3, 4};
    std::vector<int> v{10, 20, 30};
    std::array<int, 2> a{100, 200};
    std::cout << sum(raw) << " " << sum(v) << " " << sum(a) << " " << sum(std::span(v).subspan(1)) << "\n";
    std::span<int> sp(raw);
    sp[0] = 99;
    std::cout << raw[0] << " " << sp.size() << " " << sp.first(2).back() << "\n";
    std::any x = 42;
    std::cout << std::any_cast<int>(x) << " ";
    x = std::string("text");
    std::cout << std::any_cast<std::string>(x) << " " << x.has_value() << "\n";
    try { (void)std::any_cast<int>(x); } catch (const std::bad_any_cast&) { std::cout << "bad_any_cast\n"; }
    std::cout << avg({1, 2, 3, 4}) << "\n";
    int counter = 0;
    for (int i = 0; i < 10; ++i) { if (i % 2) continue; if (i > 6) break; counter += i; }
    int w = 0; do { ++w; } while (w < 5);
    std::cout << counter << " " << w << "\n";
    goto skip;
    std::cout << "never\n";
skip:
    std::cout << (5 > 3 ? "ternary yes" : "no") << "\n";
    return 0;
}
