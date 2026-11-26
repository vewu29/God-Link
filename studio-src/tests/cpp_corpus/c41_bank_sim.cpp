#include <iostream>
#include <iomanip>
#include <map>
#include <stdexcept>
#include <string>
#include <vector>
class Account {
    std::string owner_; long long cents_ = 0; std::vector<std::string> log_;
public:
    explicit Account(std::string o) : owner_(std::move(o)) {}
    void deposit(long long c) { if (c <= 0) throw std::invalid_argument("deposit must be positive"); cents_ += c; log_.push_back("+" + std::to_string(c)); }
    void withdraw(long long c) { if (c > cents_) throw std::runtime_error("insufficient funds for " + owner_); cents_ -= c; log_.push_back("-" + std::to_string(c)); }
    long long balance() const { return cents_; }
    const std::string& owner() const { return owner_; }
    size_t ops() const { return log_.size(); }
};
class Bank {
    std::map<std::string, Account> accounts_;
public:
    Account& open(const std::string& name) { return accounts_.emplace(name, Account(name)).first->second; }
    Account& get(const std::string& name) { auto it = accounts_.find(name); if (it == accounts_.end()) throw std::out_of_range("no account " + name); return it->second; }
    void transfer(const std::string& from, const std::string& to, long long c) { Account& a = get(from); Account& b = get(to); a.withdraw(c); b.deposit(c); }
    void report() const { for (auto& [n, a] : accounts_) std::cout << std::setw(6) << n << " $" << a.balance() / 100 << "." << std::setw(2) << std::setfill('0') << a.balance() % 100 << std::setfill(' ') << " (" << a.ops() << " ops)\n"; }
};
int main() {
    Bank bank;
    bank.open("alice").deposit(10000);
    bank.open("bob").deposit(2550);
    bank.open("carol");
    struct Op { const char* from; const char* to; long long c; };
    std::vector<Op> ops{{"alice", "bob", 1999}, {"bob", "carol", 5000}, {"carol", "alice", 1}, {"bob", "dave", 10}, {"alice", "carol", 4005}};
    for (auto& o : ops) {
        try { bank.transfer(o.from, o.to, o.c); std::cout << "ok " << o.from << "->" << o.to << " " << o.c << "\n"; }
        catch (const std::exception& e) { std::cout << "failed: " << e.what() << "\n"; }
    }
    try { bank.get("carol").deposit(-5); } catch (const std::invalid_argument& e) { std::cout << "failed: " << e.what() << "\n"; }
    bank.report();
    return 0;
}
