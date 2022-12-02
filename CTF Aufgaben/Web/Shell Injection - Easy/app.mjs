import express from 'express'
import bodyParser from 'body-parser'
import { exec } from 'child_process'
import path from 'path'

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));

function ping (host) {
  return new Promise((resolve, reject) => {
    exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout)
      }
    })
  })
}

app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.htm'))
})

app.post('/ping', async (req, res) => {
  res.end(await ping(req.body.host))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
