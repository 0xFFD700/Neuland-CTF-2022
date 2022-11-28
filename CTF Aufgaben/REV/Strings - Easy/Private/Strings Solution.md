#### Strings - Easy

*The flag is hidden somewhere in this binary.*

<br>

[strings](strings)

<br>

The challenge is straightforward if you already know what `strings` is. It is a program that display printable strings in files.
We can execute `strings` on our binary `strings` and we can find the flag in the output.

```
$ strings strings               
/lib64/ld-linux-x86-64.so.2
__cxa_finalize
__libc_start_main
puts
libc.so.6
GLIBC_2.2.5
GLIBC_2.34
_ITM_deregisterTMCloneTable
__gmon_start__
_ITM_registerTMCloneTable
PTE1
u+UH
nland{f0H
und_y0u}H
Try to get the flag!
;*3$"
...
```

The flag is `nland{f0und_y0u}`.
