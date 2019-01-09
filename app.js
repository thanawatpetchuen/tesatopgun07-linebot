const bodyParser = require('body-parser')
const request = require('request')
const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express()
const port = 443;
const hostname = '127.0.0.1'
const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer JFPOwgbjsHelglshqqUg2j899EyEVztig803xMsPs1kXBV3HvKa+mn8owJWr/6XCDhpGAwwm7unPfeECkMbBEr4E+WpFLbzDNDkhZvMqYLjYArfWFglO+M1e+xO62jDrR3Z42fCSmZ+D6knHWM6YqAdB04t89/1O/w1cDnyilFU='
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send('Hello HTTPS!')
  })
  

app.get("/test", (req, res) => {
	res.send("Test");
})

// Push
app.get('/webhook', (req, res) => {
	// push block
	let message = "Hello Tesa";
	push(message);
	res.send(message);
	// console.log(message)
})

// Reply
app.post('/webhook', (req, res) => {
	let reply_token = req.body.events[0].replyToken
	let msg = ''

	if (req.body.events[0].type == 'beacon' ) {
		msg = JSON.stringify(req.body.events[0])
		// if (msg = JSON.stringify(req.body.events[0]))
	}
	else {
		msg = req.body.events[0].message.text
	}
	// msg = req.body.events[0].message.text
	console.log(req.body)
	reply(reply_token, msg)
	// push(msg)
	res.send(msg)
})

function push(msg) {
	let body = JSON.stringify({
		to: 'Uf180e91f325d946153ad988c5cc7972c',
		messages: [
			{
				type: 'text',
				text: msg
			}
		]

  })
  // curl
  curl('push', body)
}

function reply(reply_token, msg) {
	let body = JSON.stringify({
		replyToken: reply_token ,
		messages: [
			{
				type: 'text',
				text: msg
			}
		]
		
    // reply body
  })
  // curl
  curl('reply', body)
}

function curl(method, body) {
	request.post({
		url: 'https://api.line.me/v2/bot/message/' + method,
		headers: HEADERS,
		body: body
	}, (err, res, body) => {
		console.log('status = ' + res.statusCode)
	})
}

https.createServer({
	key: fs.readFileSync('/etc/letsencrypt/live/tesatopgun07.ddns.net/privkey.pem'),
	// cert: fs.readFileSync('/etc/letsencrypt/path/to/cert.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/tesatopgun07.ddns.net/fullchain.pem')
  }, app).listen(443, () => {
	console.log('Listening...')
  })