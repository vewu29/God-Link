#include <iostream>
#include <iterator>
#include <numeric>
#include <algorithm>
#include <vector>
class Range {
    int lo_, hi_, step_;
public:
    class iterator {
        int v_, step_;
    public:
        using iterator_category = std::forward_iterator_tag; using value_type = int; using difference_type = std::ptrdiff_t; using pointer = const int*; using reference = int;
        iterator(int v, int s) : v_(v), step_(s) {}
        int operator*() const { return v_; }
        iterator& operator++() { v_ += step_; return *this; }
        iterator operator++(int) { auto t = *this; v_ += step_; return t; }
        bool operator==(const iterator& o) const { return v_ >= o.v_; }
        bool operator!=(const iterator& o) const { return !(*this == o); }
    };
    Range(int lo, int hi, int step = 1) : lo_(lo), hi_(hi), step_(step) {}
    iterator begin() const { return {lo_, step_}; }
    iterator end() const { return {hi_, step_}; }
};
int main() {
    for (int x : Range(0, 10, 3)) std::cout << x << ' ';
    std::cout << "\n";
    Range r(1, 11);
    std::cout << std::accumulate(r.begin(), r.end(), 0) << "\n";
    std::vector<int> v(r.begin(), r.end());
    std::cout << v.size() << " " << v.back() << "\n";
    std::vector<int> out;
    std::copy_if(v.begin(), v.end(), std::back_inserter(out), [](int x) { return x % 3 == 0; });
    std::copy(out.begin(), out.end(), std::ostream_iterator<int>(std::cout, ","));
    std::cout << "\n" << std::distance(v.begin(), v.end()) << " " << *std::next(v.begin(), 4) << " " << *std::prev(v.end()) << "\n";
    return 0;
}
