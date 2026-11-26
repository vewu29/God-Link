#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
struct Person { std::string name; int age; };
int main() {
    std::vector<Person> people{{"Ann", 30}, {"Bob", 25}, {"Cid", 30}, {"Dee", 25}, {"Eve", 35}, {"Fay", 30}};
    std::stable_sort(people.begin(), people.end(), [](const Person& a, const Person& b) { return a.age < b.age; });
    for (auto& p : people) std::cout << p.name << "(" << p.age << ") ";
    std::cout << "\n";
    std::sort(people.begin(), people.end(), [](const Person& a, const Person& b) {
        if (a.age != b.age) return a.age > b.age;
        return a.name < b.name;
    });
    for (auto& p : people) std::cout << p.name << "(" << p.age << ") ";
    std::cout << "\n";
    std::vector<int> v{9, 8, 7, 6, 5, 4, 3, 2, 1};
    std::partial_sort(v.begin(), v.begin() + 3, v.end());
    std::cout << v[0] << v[1] << v[2] << "\n";
    std::nth_element(v.begin(), v.begin() + 4, v.end());
    std::cout << "median " << v[4] << "\n";
    auto mid = std::partition(v.begin(), v.end(), [](int x) { return x < 5; });
    std::sort(v.begin(), mid);
    std::sort(mid, v.end());
    for (int x : v) std::cout << x;
    std::cout << " split at " << (mid - v.begin()) << "\n";
    return 0;
}
