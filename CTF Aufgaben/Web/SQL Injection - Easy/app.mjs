import express from 'express'
import bodyParser from 'body-parser'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'path'

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));

const db = await open({
  filename: ':memory:',
  driver: sqlite3.Database
})
await db.exec('CREATE TABLE users (username TEXT, password TEXT)')
await db.exec("INSERT INTO users (username, password) VALUES ('admin', '79852c68-769d-4839-80ad-1262fb3c8018')")

app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.htm'))
})

app.post('/login', async (req, res) => {
  const rows = await db.all(`SELECT * FROM users WHERE username = '${req.body.username}' AND password = '${req.body.password}'`)
  if (rows.length > 0) {
    res.sendFile(path.resolve('flag.txt'))
  } else {
    res.status(403).send('Wrong username and/or password')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
