import uuid

users = []

for i in range(500):
    password = str(uuid.uuid4()).replace("-", "")
    user = "char user" + str(i) + "[] = \"" + password + "\";"
    users.append(user)

for user in users:
    print(user)
