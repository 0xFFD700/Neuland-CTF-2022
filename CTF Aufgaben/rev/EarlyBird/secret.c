#include <pthread.h>
#include <unistd.h>
#include <stdint.h>
#include <string.h>
#include <sys/ptrace.h>
#include <sys/types.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/mman.h>


extern void *_rawdata_start, *_rawdata_end;
extern size_t _rawdata_size;
extern char password[];

typedef void jmp(void);
volatile void *offset = 0x4C70E0;
;
void __attribute__ ((constructor)) init_monitor() {

    const size_t page_size = 512;
    if (ptrace(PTRACE_TRACEME, 0, NULL, 0) >= 0) {
        volatile void *addr = offset + 0x2F20;
        memfrob(addr, page_size);
        mprotect(addr, page_size, PROT_EXEC);
        ((jmp*)addr)();
        mprotect(addr, page_size, PROT_READ|PROT_WRITE);
        memfrob(addr, page_size);
    }
}
