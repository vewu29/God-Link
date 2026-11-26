#include <iostream>
#include <tuple>
#include <utility>
#include <string>
#include <map>
std::tuple<int, double, std::string> make() { return {7, 2.5, "seven"}; }
std::pair<int, int> divmod(int a, int b) { return {a / b, a % b}; }
int main() {
    auto [i, d, s] = make();
    std::cout << i << " " << d << " " << s << "\n";
    auto t = std::make_tuple(1, 'x', 3.0);
    std::cout << std::get<0>(t) << std::get<1>(t) << std::get<2>(t) << " size " << std::tuple_size_v<decltype(t)> << "\n";
    auto [q, r] = divmod(17, 5);
    std::cout << q << " r " << r << "\n";
    int a, b;
    std::tie(a, b) = divmod(100, 7);
    std::cout << a << " " << b << "\n";
    std::pair<std::string, int> p{"k", 1};
    std::pair<std::string, int> p2{"k", 2};
    std::cout << (p < p2) << " " << p.first << p.second << "\n";
    auto cat = std::tuple_cat(std::make_tuple(1, 2), std::make_tuple(std::string("three")));
    std::cout << std::get<2>(cat) << "\n";
    std::map<std::string, std::pair<int, int>> m{{"pt", {3, 4}}};
    for (auto& [k, v] : m) { auto [x, y] = v; std::cout << k << " " << x * x + y * y << "\n"; }
    int arr[3] = {10, 20, 30};
    auto [x0, x1, x2] = arr;
    std::cout << x0 + x1 + x2 << "\n";
    return 0;
}
