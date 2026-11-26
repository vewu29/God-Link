#include <iostream>
#include <vector>
int main() {
    std::vector<int> v;
    for (int i = 0; i < 10; ++i) v.push_back(i * i);
    std::cout << "size " << v.size() << " front " << v.front() << " back " << v.back() << "\n";
    v.insert(v.begin() + 2, 99);
    v.erase(v.begin());
    v.pop_back();
    for (int x : v) std::cout << x << ' ';
    std::cout << "\n";
    v.resize(3);
    v.resize(5, -1);
    for (size_t i = 0; i < v.size(); ++i) std::cout << v[i] << (i + 1 < v.size() ? "," : "\n");
    std::vector<std::vector<int>> nested{{1}, {2, 3}, {4, 5, 6}};
    for (auto& row : nested) std::cout << row.size();
    std::cout << "\n";
    std::vector<int> w(v.rbegin(), v.rend());
    for (int x : w) std::cout << x << ' ';
    std::cout << "\n" << (v == std::vector<int>{1, 99, 4, -1, -1}) << "\n";
    v.clear();
    std::cout << v.empty() << "\n";
    return 0;
}
