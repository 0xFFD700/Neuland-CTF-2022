#!/usr/bin/env node
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const crypto = require('crypto')
const fs = require('fs')
const sbx = require('vm2')

const api = express()

const hashPasswd = p => crypto.createHash('sha256').update(p).digest('hex')
const rand = _ => crypto.randomBytes(32).toString('hex');
const now = () => Math.floor(new Date() / 1000)

const users = new Set()
let lastUid = 0
const checkoutTimes = new Map()

const flag1 = process.env.FLAG1 ?? ""
const flag2 = process.env.FLAG2 ?? ""
const flag3 = process.env.FLAG3 ?? ""

api.use(cookieParser())
api.use(bodyParser.json())

api.use((req, res, next) => {
	req.userUid = -1
	req.userOrder = ""

	let order = req.cookies.order
	let uid = req.cookies.uid
	let passwd = req.cookies.passwd

	if(uid == undefined || passwd == undefined)
		return next()

	let found = false
	for(let user of users.entries())
		if(user[0].uid == uid && user[0].password == passwd)
			found = true

	if(found) {
		req.userUid = uid
		if(order != undefined)
			req.userOrder = order
	}

	next()
})

api.get('/', (req, res) => {
	res.type('text/plain').send("Look somewhere else!\n\n" +
		"  ▄▄▄▄▄▄▄ ▄▄    ▄ ▄▄▄▄▄ ▄▄▄▄▄▄▄  \n" +
		"  █ ▄▄▄ █ ▄  ▄▄█▄  ▀█ ▄ █ ▄▄▄ █  \n" +
		"  █ ███ █ ██▄█ █ █▀▀▀█  █ ███ █  \n" +
		"  █▄▄▄▄▄█ ▄▀▄ █▀▄ ▄▀█▀█ █▄▄▄▄▄█  \n" +
		"  ▄▄▄▄  ▄ ▄▀ ▀ ▄▄▀▀███▀▄  ▄▄▄ ▄  \n" +
		"  ▄▄█▄█▀▄▀▄▀   ▄▀ █ ▄▀█ ███ ▄▄▀  \n" +
		"   █▄█▀▄▄▀ ▄ █▀██▄█▄▀▄▀▀▀▀▀▄▄ ▀  \n" +
		"  █▀▄▀██▄ ▀▄█▀▄ █ █▀ ██▄▀█▄ ███  \n" +
		"  █▀▄██ ▄ ▀ ▄▄▀ ▀▀▀ ▄ █▄▀▀█▄ █   \n" +
		"  ▄▀▀▄▀ ▄▀██▄▄█ ▀█▄ ▀ ▀▀ █ ▀█▀   \n" +
		"   ▄▀█▀▀▄▄▄▄▄▄█ █▄▀█▄███▄▄▄▄█    \n" +
		"  ▄▄▄▄▄▄▄ ▀██▄█▄▄   ▀▄█ ▄ ██▀█▀  \n" +
		"  █ ▄▄▄ █  ▀▄ ▄▀██▄▄▀ █▄▄▄█▀▄█▄  \n" +
		"  █ ███ █ █ ▄█▀▄ ▀▀  ▀▀█ ▄▀▀▄ █  \n" +
		"  █▄▄▄▄▄█ █  ▀  █▄█ ▀██  ▀ █ █   \n" +
		"\n\n" +
		"  ▄▄▄▄▄▄▄  ▄▄ ▄ ▄▄▄▄▄▄▄ \n" +
		"  █ ▄▄▄ █ █▀█▄  █ ▄▄▄ █ \n" +
		"  █ ███ █ ▄█▄█▀ █ ███ █ \n" +
		"  █▄▄▄▄▄█ █▀█ ▄ █▄▄▄▄▄█ \n" +
		"  ▄▄ ▄  ▄▄▀ ▄█▄ ▄▄▄ ▄▄  \n" +
		"  █▄▀█▄█▄█▄▀█▀█▀█▄▀▀▄██ \n" +
		"   ▄▄▀▄▄▄ █▄▀▄▀ ▀▀▄█  ▀ \n" +
		"  ▄▄▄▄▄▄▄ ███████▀▄▄▄▄  \n" +
		"  █ ▄▄▄ █  ▄▀█▀  █   █▄ \n" +
		"  █ ███ █ ▀▄  █▄████▀ █ \n" +
		"  █▄▄▄▄▄█ █▄ ▀▀ ▄█▀▄ ▄   ")
})

api.post('/register', (req, res) => {
	let reqUser = req.body.username
	let reqPwd = req.body.password

	if(!reqUser || !reqPwd)
		return res.json({ error: true, msg: "Missing parameters." })

	for(let user of users.entries())
		if(user[0].username == reqUser)
			return res.json({ error: true, msg: "Username already exists." })

	let pwd = hashPasswd(reqPwd.toString().slice(0, 64))
	let uid = lastUid++

	users.add({
		username: reqUser.toString().slice(0, 64),
		password: pwd,
		uid: uid
	})

	res.cookie('uid', uid)
	res.cookie('passwd', pwd)
	res.json({ error: false, msg: "Registered." })
})

api.post('/login', (req, res) => {
	let reqUser = req.body.username
	let reqPwd = req.body.password

	if(!reqUser || !reqPwd)
		return res.json({ error: true, msg: "Missing parameters." })

	let serverUser = null
	for(let user of users.entries())
		if(user[0].username == reqUser)
			serverUser = user[0]

	if(!serverUser)
		return res.json({ error: true, msg: "User not found." })

	let pwd = hashPasswd(reqPwd.toString())
	if(serverUser.password != pwd)
		return res.json({ error: true, msg: "Wrong password." })

	res.cookie('uid', serverUser.uid)
	res.cookie('passwd', pwd)
	res.json({ error: false, msg: "Logged in.", flag: flag1 })
})

api.post('/buy/:article', (req, res) => {
	if(req.userUid == -1)
		return res.json({ error: true, msg: "Login first." })

	let article = req.params.article
	let err = null
	let comment = ''

	if(!req.body.quantity || !req.body.price)
		err = "Missing parameters."

	if(article == "t-shirt") {
			comment = "You will receive a T-shirt after the CTF."
	} else if(article == "sticker") {
			comment = "You can grab some stickers from the desk at the front."
	} else if(article == "flag") {
			comment = flag2
	} else err = "Product not in stock."

	if(err)
		return res.json({ error: true, msg: err})

	let total = req.body.quantity * req.body.price
	res.cookie('order',`${req.userOrder},${total}`)
	res.json({ error: false, msg: "Order submitted for " + total.toString() + " €.", comment: comment })
})

api.get('/checkout', (req, res) => {
	if(req.userUid == -1)
		return res.json({ error: true, msg: "Login first." })

	if(!req.userOrder)
		return res.json({ error: true, msg: "Buy something first." })

	if(parseInt(req.userUid) != 0 || req.userOrder.includes("("))
		return res.json({ error: true, msg: "You are not allowed to do this. Checkout function is still in testing." })

	if(checkoutTimes.has(req.ip) && checkoutTimes.get(req.ip) + 1 > now())
		return res.json({ error: true, msg: 'Requests too fast.'})

	checkoutTimes.set(req.ip, now())

	let sandbox = {
		sum: (args) => args.reduce((a, b) => a + b),
		getFlag: _ => {
			return flag3
		},
		readFile: (path) => {
			path = new String(path).toString()
			if(fs.statSync(path).size == 0)
				return null
			let r = fs.readFileSync(path)
			if(!path.includes('flag'))
				return r
			return null
		}
	}

	let test_env = new sbx.VM({ sandbox: sandbox, eval: false, timeout: 25, allowAsync: false })

	let result = "An error occurred during checkout."
	try {
		result = new String(test_env.run(`sum([${req.userOrder}])`))
	} catch(e) {}

	return res.type('text/plain').send(result)
})

api.listen(8000, () => console.log("Listening..."))
users.add({ username: "admin", password: hashPasswd(rand()), uid: lastUid++ })
