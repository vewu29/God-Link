#include <iostream>
#include <memory>
#include <vector>
#include <string>
class Shape {
public:
    virtual ~Shape() { std::cout << "~Shape\n"; }
    virtual double area() const = 0;
    virtual std::string name() const { return "shape"; }
    void describe() const { std::cout << name() << " area " << area() << "\n"; }
};
class Rect : public Shape {
protected:
    double w, h;
public:
    Rect(double w, double h) : w(w), h(h) {}
    ~Rect() override { std::cout << "~Rect\n"; }
    double area() const override { return w * h; }
    std::string name() const override { return "rect"; }
};
class Square final : public Rect {
public:
    explicit Square(double s) : Rect(s, s) {}
    ~Square() override { std::cout << "~Square\n"; }
    std::string name() const override { return "square"; }
};
class Circle : public Shape {
    double r;
public:
    explicit Circle(double r) : r(r) {}
    double area() const override { return 3 * r * r; }
};
struct Animal { virtual std::string sound() const { return "..."; } virtual ~Animal() = default; };
struct Dog : Animal { std::string sound() const override { return "woof"; } };
struct Cat : Animal { std::string sound() const override { return "meow"; } };
int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Rect>(2, 3));
    shapes.push_back(std::make_unique<Square>(4));
    shapes.push_back(std::make_unique<Circle>(1));
    for (auto& s : shapes) s->describe();
    double total = 0;
    for (auto& s : shapes) total += s->area();
    std::cout << "total " << total << "\n";
    Dog d; Cat c; Animal a;
    const Animal* zoo[] = {&d, &c, &a};
    for (auto* z : zoo) std::cout << z->sound() << " ";
    std::cout << "\n";
    Shape* sp = shapes[1].get();
    std::cout << "is rect? " << (dynamic_cast<Rect*>(sp) != nullptr) << " is circle? " << (dynamic_cast<Circle*>(sp) != nullptr) << "\n";
    // vector::clear() destruction order is unspecified (libc++ and libstdc++ differ): destroy back to front explicitly
    while (!shapes.empty()) shapes.pop_back();
    std::cout << "done\n";
    return 0;
}
