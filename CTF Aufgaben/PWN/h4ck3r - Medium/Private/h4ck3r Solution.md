#### h4ck3r - Medium

*Can you find a way to change `secret_code`? I you do so I will reward you with a flag.*

*You can test your solution locally. Connect to the server once it works to retrieve to flag:* <br>
*nc hostname 8081*

<br>

[h4ck3r.c](h4ck3r.c)

<br>

At first sight the task seems impossible. In order to get the flag the value of `secret_code` must be 0x1337. However, the variable is initialized with 0xC001D00D and is not changed during runtime. This means no matter what value we input as our hacker name, the value of `secret_code` will still be wrong. However, there is a small detail we have to take into consideration. The read function is used to save the user input in an array of size 100. The read function takes up to 0x100 = 256 characters and writes them to `name`. This allows us to go out of bounds and to change values on the stack. What a coincidence. This allows us the change the value of `secret_code` to whatever we want. Therefore we need to find the right offset to overwrite the memory area of `secret_code`. 

We can use python to generator inputs of a certain length and pipe them into the program. We know that the input must be at least 100 characters long.
```
$ python -c "print('A'*100)" | ./h4ck3r
```

At the end of this input we need to append the value of `secret_code`. Due to little endian we have to reverse the order of the bytes.
```
python -c "print('A'*100 + '\x37\x13\x00\x00')" | ./h4ck3r
```

Now we are good to go and we can try inputs of different lengths by increasing the number of A's. We can use GDB or change the program locally to give us more information on where excatly the offset of the memory area is. 108 A's is the sweetspot. We can send the payload to the server and we will get the flag.

```
$ python -c "print('A'*108 + '\x37\x13\x00\x00')" | ncat localhost 8080
Enter your hacker name: Access granted!
nland{y0u_4r3_4_r34l_h4ck3r_n0w}
```

The flag is `nland{y0u_4r3_4_r34l_h4ck3r_n0w}`.
