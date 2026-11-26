#include <iostream>
#include <compare>
struct Vec2 {
    int x = 0, y = 0;
    Vec2 operator+(const Vec2& o) const { return {x + o.x, y + o.y}; }
    Vec2 operator-(const Vec2& o) const { return {x - o.x, y - o.y}; }
    Vec2 operator*(int k) const { return {x * k, y * k}; }
    Vec2& operator+=(const Vec2& o) { x += o.x; y += o.y; return *this; }
    Vec2 operator-() const { return {-x, -y}; }
    bool operator==(const Vec2&) const = default;
    auto operator<=>(const Vec2&) const = default;
    int& operator[](int i) { return i == 0 ? x : y; }
};
std::ostream& operator<<(std::ostream& os, const Vec2& v) { return os << "(" << v.x << ", " << v.y << ")"; }
struct Fraction {
    long n, d;
    Fraction(long n, long d = 1) : n(n), d(d) { normalize(); }
    void normalize() { long a = n < 0 ? -n : n, b = d; while (b) { long t = a % b; a = b; b = t; } if (a) { n /= a; d /= a; } }
    Fraction operator+(const Fraction& o) const { return {n * o.d + o.n * d, d * o.d}; }
    Fraction operator*(const Fraction& o) const { return {n * o.n, d * o.d}; }
    explicit operator double() const { return double(n) / d; }
};
std::ostream& operator<<(std::ostream& os, const Fraction& f) { return os << f.n << "/" << f.d; }
struct Counter { int v = 0; Counter& operator++() { ++v; return *this; } Counter operator++(int) { Counter t = *this; ++v; return t; } int operator()(int k) const { return v * k; } };
int main() {
    Vec2 a{1, 2}, b{3, 4};
    std::cout << a + b << " " << b - a << " " << a * 3 << " " << -a << "\n";
    a += b;
    std::cout << a << " " << (a == Vec2{4, 6}) << " " << (a != b) << " " << (b < a) << "\n";
    a[1] = 100;
    std::cout << a << "\n";
    Fraction f(1, 2), g(1, 3);
    std::cout << f + g << " " << f * g << " " << Fraction(6, 8) << " " << static_cast<double>(Fraction(3, 4)) << "\n";
    Counter c;
    ++c; c++; ++c;
    Counter old = c++;
    std::cout << old.v << " " << c.v << " " << c(10) << "\n";
    return 0;
}
