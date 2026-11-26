#include <iostream>
#include <numeric>
#include <vector>
int main() {
    std::vector<int> v(10);
    std::iota(v.begin(), v.end(), 1);
    for (int x : v) std::cout << x << ' ';
    std::cout << "\n";
    std::cout << "gcd(84,36)=" << std::gcd(84, 36) << " lcm(4,6)=" << std::lcm(4, 6) << " gcd(17,5)=" << std::gcd(17, 5) << "\n";
    std::vector<int> ps(v.size());
    std::partial_sum(v.begin(), v.end(), ps.begin());
    for (int x : ps) std::cout << x << ' ';
    std::cout << "\n";
    std::vector<int> a{1, 2, 3}, b{4, 5, 6};
    std::cout << "dot " << std::inner_product(a.begin(), a.end(), b.begin(), 0) << "\n";
    std::vector<int> diff(v.size());
    std::adjacent_difference(ps.begin(), ps.end(), diff.begin());
    for (int x : diff) std::cout << x << ' ';
    std::cout << "\n";
    std::cout << "reduce " << std::reduce(v.begin(), v.end()) << " midpoint " << std::midpoint(10, 20) << "\n";
    return 0;
}
