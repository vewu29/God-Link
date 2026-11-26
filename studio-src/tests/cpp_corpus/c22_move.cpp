#include <iostream>
#include <string>
#include <utility>
#include <vector>
class Buffer {
    int* data_; int size_;
public:
    explicit Buffer(int n) : data_(new int[n]), size_(n) { for (int i = 0; i < n; ++i) data_[i] = i; std::cout << "alloc " << n << "\n"; }
    Buffer(const Buffer& o) : data_(new int[o.size_]), size_(o.size_) { for (int i = 0; i < size_; ++i) data_[i] = o.data_[i]; std::cout << "copy " << size_ << "\n"; }
    Buffer(Buffer&& o) noexcept : data_(o.data_), size_(o.size_) { o.data_ = nullptr; o.size_ = 0; std::cout << "move " << size_ << "\n"; }
    Buffer& operator=(Buffer o) noexcept { std::swap(data_, o.data_); std::swap(size_, o.size_); std::cout << "assign " << size_ << "\n"; return *this; }
    ~Buffer() { if (data_) std::cout << "free " << size_ << "\n"; delete[] data_; }
    int size() const { return size_; }
    int sum() const { int s = 0; for (int i = 0; i < size_; ++i) s += data_[i]; return s; }
};
Buffer make(int n) { Buffer b(n); return b; }
void take(Buffer b) { std::cout << "took " << b.size() << " sum " << b.sum() << "\n"; }
int main() {
    Buffer a(4);
    Buffer b = a;
    Buffer c = std::move(a);
    std::cout << "a " << a.size() << " b " << b.size() << " c " << c.size() << "\n";
    take(std::move(b));
    Buffer d = make(3);
    d = c;
    std::cout << "d " << d.size() << "\n";
    std::string s = "movable string that is long enough to heap allocate";
    std::string t = std::move(s);
    std::cout << "t len " << t.size() << "\n";
    std::vector<std::string> v;
    std::string x = "x";
    v.push_back(x);
    v.push_back(std::move(x));
    std::cout << v.size() << " " << v[1] << "\n";
    std::cout << "end\n";
    return 0;
}
