#include <iostream>
#include <array>
#include <deque>
#include <list>
int main() {
    std::array<int, 5> a{5, 3, 1, 4, 2};
    int sum = 0;
    for (int x : a) sum += x;
    std::cout << "array size " << a.size() << " sum " << sum << " a[2]=" << a[2] << "\n";
    std::deque<int> d;
    for (int i = 1; i <= 3; ++i) { d.push_back(i); d.push_front(-i); }
    for (int x : d) std::cout << x << ' ';
    std::cout << "\n";
    d.pop_front(); d.pop_back();
    std::cout << d.front() << " " << d.back() << " " << d[1] << "\n";
    std::list<int> l{4, 1, 3, 1, 2};
    l.sort();
    l.unique();
    l.push_front(0);
    l.reverse();
    for (int x : l) std::cout << x << ' ';
    std::cout << "\n";
    l.remove(3);
    std::list<int> other{10, 20};
    l.splice(l.begin(), other);
    for (int x : l) std::cout << x << ' ';
    std::cout << "| other " << other.size() << "\n";
    return 0;
}
