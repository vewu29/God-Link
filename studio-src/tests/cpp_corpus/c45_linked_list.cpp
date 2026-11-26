#include <iostream>
template <typename T> class List {
    struct Node { T val; Node* next; };
    Node* head = nullptr; int n = 0;
public:
    ~List() { int freed = 0; while (head) { Node* t = head; head = head->next; delete t; ++freed; } std::cout << "freed " << freed << " nodes\n"; }
    void push_front(T v) { head = new Node{v, head}; ++n; }
    void push_back(T v) { Node** p = &head; while (*p) p = &(*p)->next; *p = new Node{v, nullptr}; ++n; }
    bool remove(T v) { for (Node** p = &head; *p; p = &(*p)->next) if ((*p)->val == v) { Node* d = *p; *p = d->next; delete d; --n; return true; } return false; }
    void reverse() { Node* prev = nullptr; while (head) { Node* nx = head->next; head->next = prev; prev = head; head = nx; } head = prev; }
    int size() const { return n; }
    void print() const { std::cout << "["; for (Node* p = head; p; p = p->next) std::cout << p->val << (p->next ? " -> " : ""); std::cout << "]\n"; }
};
int main() {
    List<int> l;
    for (int i = 1; i <= 5; ++i) l.push_back(i);
    l.push_front(0);
    l.print();
    std::cout << l.remove(3) << l.remove(42) << " size " << l.size() << "\n";
    l.reverse();
    l.print();
    List<const char*> words;
    words.push_back("alpha"); words.push_back("beta");
    words.print();
    return 0;
}
