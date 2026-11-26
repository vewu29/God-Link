#include <iostream>
#include <string>
namespace geo {
    constexpr double scale = 2.0;
    namespace detail { int helper(int x) { return x * 3; } }
    int area(int w, int h) { return detail::helper(w * h); }
}
namespace { int hidden = 11; }
class Widget {
    static int count_;
    int id_;
public:
    Widget() : id_(++count_) {}
    ~Widget() { --count_; }
    static int count() { return count_; }
    int id() const { return id_; }
};
int Widget::count_ = 0;
int next_ticket() { static int ticket = 100; return ticket++; }
struct Config { inline static const std::string name = "corpus"; static constexpr int version = 3; };
int main() {
    std::cout << geo::area(2, 3) << " " << geo::scale << " " << hidden << "\n";
    {
        Widget a, b, c;
        std::cout << "count " << Widget::count() << " ids " << a.id() << b.id() << c.id() << "\n";
    }
    std::cout << "count " << Widget::count() << "\n";
    std::cout << next_ticket() << " " << next_ticket() << " " << next_ticket() << "\n";
    std::cout << Config::name << " v" << Config::version << "\n";
    namespace g = geo;
    using geo::area;
    std::cout << g::area(1, 1) + area(2, 2) << "\n";
    return 0;
}
