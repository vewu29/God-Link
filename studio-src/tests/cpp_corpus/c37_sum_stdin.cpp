#include <iostream>
int main() {
    int n;
    std::cin >> n;
    long long sum = 0;
    int mx = 0;
    for (int i = 0; i < n; ++i) { int x; std::cin >> x; sum += x; if (i == 0 || x > mx) mx = x; }
    std::cout << "n=" << n << " sum=" << sum << " max=" << mx << "\n";
    return 0;
}
