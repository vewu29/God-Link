#include <iostream>
#include <string>
#include <vector>
struct Noisy {
    std::string name;
    explicit Noisy(std::string n) : name(std::move(n)) { std::cout << "ctor " << name << "\n"; }
    Noisy(const Noisy& o) : name(o.name + "'") { std::cout << "copy " << name << "\n"; }
    ~Noisy() { std::cout << "dtor " << name << "\n"; }
};
struct Holder {
    Noisy a{"member-a"};
    Noisy b{"member-b"};
    Holder() { std::cout << "Holder body\n"; }
    ~Holder() { std::cout << "~Holder body\n"; }
};
Noisy global_obj("global");
int main() {
    std::cout << "main start\n";
    Noisy x("x");
    {
        Noisy y("y");
        std::cout << "inner scope end\n";
    }
    { Holder h; }
    Noisy z = x;
    static Noisy s("static-local");
    std::vector<Noisy> v;
    v.reserve(2);
    v.emplace_back("vec0");
    v.emplace_back("vec1");
    // element destruction order inside ~vector is unspecified (libc++ and libstdc++ differ), so empty it explicitly
    while (!v.empty()) v.pop_back();
    std::cout << "main end\n";
    return 0;
}
