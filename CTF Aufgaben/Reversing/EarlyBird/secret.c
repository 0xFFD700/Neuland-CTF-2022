#include <pthread.h>
#include <unistd.h>
#include <stdint.h>
#include <sys/ptrace.h>
#include <sys/types.h>
#include <sys/types.h>
#include <sys/wait.h>
       

extern char password[];
static const uint32_t confusion[] = { 0x03090a06, 0x361d1b2b, 0x6f0d1314 };

void* monitor(void* arg) {
    // Anti-GDB
    int ppid = getppid();
    if (ptrace(PTRACE_ATTACH, ppid, NULL, NULL) == 0) {
        waitpid(ppid, NULL, 0);
        ptrace(PTRACE_CONT, NULL, NULL);
        ptrace(PTRACE_DETACH, getppid(), NULL, NULL);

    }

    return NULL;
}

void __attribute__ ((constructor)) init_monitor() {
    // pthread_t th;
    // pthread_create(&th, NULL, &monitor, NULL);
    *(volatile uint32_t*)(password + 4) ^= __builtin_bswap32(confusion[1]);
    *(volatile uint32_t*)(password + 8) ^= __builtin_bswap32(confusion[2]);
    *(volatile uint32_t*)(password + 0) ^= __builtin_bswap32(confusion[0]);
}
