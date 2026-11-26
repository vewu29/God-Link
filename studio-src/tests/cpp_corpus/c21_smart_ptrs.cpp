#include <iostream>
#include <memory>
#include <string>
#include <vector>
struct Res {
    std::string id;
    explicit Res(std::string s) : id(std::move(s)) { std::cout << "acquire " << id << "\n"; }
    ~Res() { std::cout << "release " << id << "\n"; }
};
struct Node {
    std::string name;
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> prev;
    explicit Node(std::string n) : name(std::move(n)) {}
    ~Node() { std::cout << "~Node " << name << "\n"; }
};
std::unique_ptr<Res> factory(const std::string& s) { return std::make_unique<Res>(s); }
int main() {
    {
        auto u = factory("U1");
        std::unique_ptr<Res> u2 = std::move(u);
        std::cout << "u empty " << (u == nullptr) << " u2 " << u2->id << "\n";
        u2.reset(new Res("U3"));
        std::cout << "after reset\n";
    }
    std::cout << "--- shared\n";
    std::shared_ptr<Res> s1 = std::make_shared<Res>("S");
    {
        auto s2 = s1;
        std::cout << "use_count " << s1.use_count() << "\n";
        std::weak_ptr<Res> w = s2;
        std::cout << "weak expired " << w.expired() << "\n";
    }
    std::cout << "use_count " << s1.use_count() << "\n";
    std::weak_ptr<Res> w = s1;
    s1.reset();
    std::cout << "weak expired " << w.expired() << " lock null " << (w.lock() == nullptr) << "\n";
    std::cout << "--- list\n";
    {
        auto a = std::make_shared<Node>("a");
        auto b = std::make_shared<Node>("b");
        a->next = b;
        b->prev = a;
        if (auto p = b->prev.lock()) std::cout << "b.prev = " << p->name << " count " << a.use_count() << "\n";
    }
    std::cout << "--- array\n";
    auto arr = std::make_unique<int[]>(5);
    for (int i = 0; i < 5; ++i) arr[i] = i * i;
    std::cout << arr[4] << "\n";
    std::vector<std::unique_ptr<Res>> pool;
    pool.push_back(std::make_unique<Res>("P1"));
    pool.push_back(std::make_unique<Res>("P2"));
    pool.erase(pool.begin());
    std::cout << "end main\n";
    return 0;
}
