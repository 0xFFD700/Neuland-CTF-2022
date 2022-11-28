#### Tracer - Easy

*Can you trace down the admin password? Strings won't help you this time. <br>
Flag format: nland{admin-password}*

<br>

[tracer](tracer)

<br>

We are asked to find the admin password. We can't use `strings` this time as the binary contains a lot of strings. We have to find another tool that we can used for reverse engineering. The title and description hints us towards ltrace. We can use it to trace the library calls of a given program.

```
$ ltrace ./tracer            
printf("Enter admin password: ")                                                                             = 22
__isoc99_scanf(0x55cd2f78d01b, 0x7ffc5a4f50f0, 0, 0Enter admin password: test
)                                                                              = 1
strcmp("test", "42ceec6b744d41bc8044fee516003183"...)                                                        = 64
printf("Wrong password")                                                                                     = 14
Wrong password+++ exited (status 0) +++
``` 

Our input is compared with the string "42ceec6b744d41bc8044fee516003183" followed by the call to `printf("Wrong password")`. This seems promising. We will try this again with the found string.

```
$ ltrace ./tracer
printf("Enter admin password: ")                                                                             = 22
__isoc99_scanf(0x55ec8584001b, 0x7fff1f04d610, 0, 0Enter admin password: 42ceec6b744d41bc8044fee516003183
)                                                                              = 1
strcmp("42ceec6b744d41bc8044fee516003183"..., "42ceec6b744d41bc8044fee516003183"...)                         = 0
printf("Right password")                                                                                     = 14
Right password+++ exited (status 0) +++
```

We found the right password.

The flag is `nland{42ceec6b744d41bc8044fee516003183}`.
