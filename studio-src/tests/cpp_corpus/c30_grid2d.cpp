#include <iostream>
#include <vector>
#include <iomanip>
using Matrix = std::vector<std::vector<int>>;
Matrix multiply(const Matrix& a, const Matrix& b) {
    size_t n = a.size(), m = b[0].size(), k = b.size();
    Matrix c(n, std::vector<int>(m, 0));
    for (size_t i = 0; i < n; ++i) for (size_t j = 0; j < m; ++j) for (size_t t = 0; t < k; ++t) c[i][j] += a[i][t] * b[t][j];
    return c;
}
Matrix transpose(const Matrix& a) {
    Matrix t(a[0].size(), std::vector<int>(a.size()));
    for (size_t i = 0; i < a.size(); ++i) for (size_t j = 0; j < a[0].size(); ++j) t[j][i] = a[i][j];
    return t;
}
void print(const Matrix& m) { for (auto& r : m) { for (int x : r) std::cout << std::setw(5) << x; std::cout << "\n"; } }
int main() {
    Matrix a{{1, 2, 3}, {4, 5, 6}};
    Matrix b{{7, 8}, {9, 10}, {11, 12}};
    print(multiply(a, b));
    print(transpose(a));
    int n = 5;
    Matrix spiral(n, std::vector<int>(n));
    int top = 0, bot = n - 1, left = 0, right = n - 1, v = 1;
    while (v <= n * n) {
        for (int j = left; j <= right; ++j) spiral[top][j] = v++;
        ++top;
        for (int i = top; i <= bot; ++i) spiral[i][right] = v++;
        --right;
        for (int j = right; j >= left; --j) spiral[bot][j] = v++;
        --bot;
        for (int i = bot; i >= top; --i) spiral[i][left] = v++;
        ++left;
    }
    print(spiral);
    std::vector<std::vector<long long>> pascal;
    for (int i = 0; i < 8; ++i) {
        pascal.push_back(std::vector<long long>(i + 1, 1));
        for (int j = 1; j < i; ++j) pascal[i][j] = pascal[i - 1][j - 1] + pascal[i - 1][j];
    }
    for (auto& r : pascal) { for (auto x : r) std::cout << x << ' '; std::cout << "\n"; }
    return 0;
}
