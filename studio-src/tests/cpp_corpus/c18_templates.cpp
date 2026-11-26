#include <iostream>
#include <string>
#include <vector>
#include <type_traits>
template <typename T> T maxof(T a, T b) { return a > b ? a : b; }
template <typename T, int N> struct FixedStack {
    T data[N]; int top = 0;
    bool push(const T& v) { if (top == N) return false; data[top++] = v; return true; }
    T pop() { return data[--top]; }
    int size() const { return top; }
};
template <typename T> struct Box { T value; T get() const { return value; } };
template <> struct Box<bool> { bool value; std::string get() const { return value ? "yes" : "no"; } };
template <typename... Args> auto sum(Args... args) { return (args + ... + 0); }
template <typename... Args> void print_all(const Args&... args) { ((std::cout << args << ' '), ...); std::cout << "\n"; }
template <typename... Args> constexpr size_t count_args(Args...) { return sizeof...(Args); }
template <typename T> std::string kind(const T&) {
    if constexpr (std::is_integral_v<T>) return "integral";
    else if constexpr (std::is_floating_point_v<T>) return "floating";
    else return "other";
}
template <typename T> requires std::is_arithmetic_v<T> T twice(T x) { return x * 2; }
template <typename Container> auto total(const Container& c) { typename Container::value_type t{}; for (auto& x : c) t += x; return t; }
int main() {
    std::cout << maxof(3, 7) << " " << maxof(2.5, 1.5) << " " << maxof<std::string>("pear", "apple") << "\n";
    FixedStack<int, 3> st;
    for (int i = 0; i < 5; ++i) std::cout << st.push(i * 10);
    std::cout << " size " << st.size() << " pop " << st.pop() << " " << st.pop() << "\n";
    Box<int> bi{42}; Box<bool> bb{true};
    std::cout << bi.get() << " " << bb.get() << "\n";
    std::cout << sum(1, 2, 3, 4, 5) << " " << sum() << " " << sum(1.5, 2.5) << "\n";
    print_all(1, "two", 3.5, 'c', std::string("five"));
    std::cout << count_args(1, 2, 3) << " " << count_args() << "\n";
    std::cout << kind(1) << " " << kind(1.0) << " " << kind(std::string()) << "\n";
    std::cout << twice(21) << " " << twice(1.25) << "\n";
    std::cout << total(std::vector<int>{1, 2, 3}) << " " << total(std::vector<std::string>{"a", "b", "c"}) << "\n";
    return 0;
}
