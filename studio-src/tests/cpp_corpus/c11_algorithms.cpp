#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <string>
void show(const char* label, const std::vector<int>& v) {
    std::cout << label << ":";
    for (int x : v) std::cout << ' ' << x;
    std::cout << "\n";
}
int main() {
    std::vector<int> v{5, 2, 8, 1, 9, 3, 7, 4, 6, 0};
    std::sort(v.begin(), v.end());
    show("sorted", v);
    std::sort(v.begin(), v.end(), std::greater<int>());
    show("desc", v);
    auto it = std::find_if(v.begin(), v.end(), [](int x) { return x % 4 == 0 && x > 0; });
    std::cout << "first mult of 4: " << *it << " at " << (it - v.begin()) << "\n";
    std::cout << "sum " << std::accumulate(v.begin(), v.end(), 0) << " product(1..5) "
              << std::accumulate(v.begin() + 4, v.begin() + 9, 1, std::multiplies<int>()) << "\n";
    std::vector<int> sq(v.size());
    std::transform(v.begin(), v.end(), sq.begin(), [](int x) { return x * x; });
    show("squares", sq);
    std::vector<int> d{1, 1, 2, 2, 2, 3, 1, 1};
    d.erase(std::unique(d.begin(), d.end()), d.end());
    show("unique", d);
    std::vector<int> s{1, 3, 3, 5, 7, 9};
    auto lb = std::lower_bound(s.begin(), s.end(), 3), ub = std::upper_bound(s.begin(), s.end(), 3);
    std::cout << "lower " << (lb - s.begin()) << " upper " << (ub - s.begin()) << " has7 " << std::binary_search(s.begin(), s.end(), 7) << "\n";
    std::vector<int> p{1, 2, 3, 4, 5, 6, 7, 8};
    std::stable_partition(p.begin(), p.end(), [](int x) { return x % 2 == 0; });
    show("evens first", p);
    std::cout << "count>4 " << std::count_if(p.begin(), p.end(), [](int x) { return x > 4; })
              << " max " << *std::max_element(p.begin(), p.end()) << " min " << *std::min_element(p.begin(), p.end()) << "\n";
    std::cout << "all>0 " << std::all_of(p.begin(), p.end(), [](int x) { return x > 0; })
              << " any>7 " << std::any_of(p.begin(), p.end(), [](int x) { return x > 7; })
              << " none<0 " << std::none_of(p.begin(), p.end(), [](int x) { return x < 0; }) << "\n";
    std::vector<int> r{1, 2, 3, 4, 5};
    std::rotate(r.begin(), r.begin() + 2, r.end());
    show("rotated", r);
    std::reverse(r.begin(), r.end());
    show("reversed", r);
    std::string perm = "abc";
    do std::cout << perm << ' '; while (std::next_permutation(perm.begin(), perm.end()));
    std::cout << "\n";
    return 0;
}
