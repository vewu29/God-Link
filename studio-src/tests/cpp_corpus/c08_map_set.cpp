#include <iostream>
#include <map>
#include <set>
#include <string>
int main() {
    std::map<std::string, int> ages{{"carol", 41}, {"alice", 30}};
    ages["bob"] = 25;
    ages.insert({"dave", 19});
    ages["alice"] += 1;
    for (const auto& [name, age] : ages) std::cout << name << "=" << age << "\n";
    std::cout << "count bob " << ages.count("bob") << " count zed " << ages.count("zed") << "\n";
    auto it = ages.find("carol");
    if (it != ages.end()) std::cout << "found " << it->first << "\n";
    ages.erase("bob");
    std::cout << "size " << ages.size() << " first " << ages.begin()->first << "\n";
    std::set<int> s{5, 1, 9, 1, 5, 3};
    for (int x : s) std::cout << x << ' ';
    std::cout << "\n" << *s.lower_bound(4) << " " << *s.upper_bound(5) << " " << s.contains(9) << "\n";
    std::multimap<int, std::string> mm{{2, "b"}, {1, "a"}, {2, "c"}, {3, "d"}};
    auto [lo, hi] = mm.equal_range(2);
    for (auto i = lo; i != hi; ++i) std::cout << i->second;
    std::cout << " " << mm.count(2) << "\n";
    std::multiset<int> ms{3, 1, 3, 3};
    std::cout << ms.count(3) << " " << ms.size() << "\n";
    std::map<int, int, std::greater<int>> desc{{1, 1}, {3, 9}, {2, 4}};
    for (auto& p : desc) std::cout << p.first << ":" << p.second << ' ';
    std::cout << "\n";
    return 0;
}
