import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import path from 'path'
import libxmljs from 'libxmljs2'

const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.htm'))
})

app.get('/example.xml', (req, res) => {
  res.sendFile(path.resolve('example.xml'))
})

app.post('/upload', upload.single('profile'), async (req, res) => {
  try {
    const xml = req.file.buffer.toString('utf8')
    const data = libxmljs.parseXmlString(xml, { noblanks: true, noent: true, nocdata: true });
    res.end(`First name: ${data.get('//first-name').text()}\nLast name: ${data.get('//last-name').text()}`)
  } catch (e) {
    console.error(e)
    res.end('Malformed data')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
