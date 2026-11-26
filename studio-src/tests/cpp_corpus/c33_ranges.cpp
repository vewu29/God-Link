#include <iostream>
#include <vector>
#include <algorithm>
#include <ranges>
#include <string>
int main() {
    std::vector<int> v{7, 2, 9, 4, 1, 8, 3, 6, 5};
    std::ranges::sort(v);
    for (int x : v) std::cout << x << ' ';
    std::cout << "\n";
    auto evens_squared = v | std::views::filter([](int x) { return x % 2 == 0; }) | std::views::transform([](int x) { return x * x; });
    for (int x : evens_squared) std::cout << x << ' ';
    std::cout << "\n";
    for (int x : std::views::iota(1, 6)) std::cout << x;
    std::cout << "\n";
    for (int x : v | std::views::reverse | std::views::take(3)) std::cout << x;
    std::cout << "\n";
    for (int x : v | std::views::drop(6)) std::cout << x;
    std::cout << "\n";
    auto it = std::ranges::find(v, 6);
    std::cout << "found 6 at " << (it - v.begin()) << " count>4 " << std::ranges::count_if(v, [](int x) { return x > 4; }) << "\n";
    std::vector<std::string> words{"pear", "fig", "banana", "kiwi"};
    std::ranges::sort(words, {}, &std::string::size);
    for (auto& w : words) std::cout << w << ' ';
    std::cout << "\n" << std::ranges::max(v) << " " << std::ranges::min(words) << "\n";
    auto [mn, mx] = std::ranges::minmax(v);
    std::cout << mn << "-" << mx << "\n";
    return 0;
}
