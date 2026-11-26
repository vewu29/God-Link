#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
std::string multiply(const std::string& a, int b) {
    std::string r; int carry = 0;
    for (int i = (int)a.size() - 1; i >= 0; --i) { int d = (a[i] - '0') * b + carry; r += char('0' + d % 10); carry = d / 10; }
    while (carry) { r += char('0' + carry % 10); carry /= 10; }
    std::reverse(r.begin(), r.end());
    return r;
}
std::string add(const std::string& a, const std::string& b) {
    std::string r; int carry = 0; int i = (int)a.size() - 1, j = (int)b.size() - 1;
    while (i >= 0 || j >= 0 || carry) { int d = carry + (i >= 0 ? a[i--] - '0' : 0) + (j >= 0 ? b[j--] - '0' : 0); r += char('0' + d % 10); carry = d / 10; }
    std::reverse(r.begin(), r.end());
    return r;
}
int main() {
    std::string f = "1";
    for (int i = 2; i <= 50; ++i) f = multiply(f, i);
    std::cout << "50! = " << f << "\n" << "digits " << f.size() << "\n";
    std::string a = "0", b = "1";
    for (int i = 0; i < 200; ++i) { std::string c = add(a, b); a = b; b = c; }
    std::cout << "fib(200) = " << a << "\n";
    std::string p = "1";
    for (int i = 0; i < 100; ++i) p = multiply(p, 2);
    int ds = 0; for (char c : p) ds += c - '0';
    std::cout << "2^100 = " << p << " digit sum " << ds << "\n";
    return 0;
}
