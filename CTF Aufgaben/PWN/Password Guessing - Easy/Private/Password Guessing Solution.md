#### Password Guessing - Easy

*Can you guess the secret password? It changes every time you start the program. There is no chance you get it right. Try your luck! <br>
PS: You definitly need the password to get the flag. There is no way around.*

*You can test your solution locally. Connect to the server once it works to retrieve to flag:* <br>
*nc summit.informatik.sexy 8083*

<br>

[password_guessing.c](password_guessing.c)

<br>

We will start off by looking at the provided source code. A random password is generated every time the program is executed. The flag gets printed out if `logged_in == 1`. `logged_in` is set to 1 if we get the right password. We would have a hard time trying to guess the password and set `logged_in` to 1 through this way. Luckily the code uses `gets` to get the user input. `gets` does not check the array boundaries and we can input as many characters as we like. This allows us to overwrite the value of `logged_in`. A basic understanding of the stack is usefull to understand why this works. We can just input a bunch of characters (> 60) and the flag will be returned:

```
$ ./password_guessing                         
Guess the random password:
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Wrong Password

nland{dummy-flag}
```

Executed on the server we get the flag:

```
$ nc summit.informatik.sexy port
Guess the random password:
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Wrong Password

nland{51mpl3_45_7h47}
```

The flag is ``nland{51mpl3_45_7h47}`.
