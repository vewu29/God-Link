#include <iostream>
#include <cstdlib>
int check(int value) { return value % 2 == 0 ? 0 : 3; }
int main() {
    std::cout << "checking 7..." << std::endl;
    int rc = check(7);
    std::cout << "returning " << rc << std::endl;
    return rc;
}
