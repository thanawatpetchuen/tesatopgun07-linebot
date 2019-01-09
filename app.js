const bodyParser = require('body-parser')
const request = require('request')
const express = require('express')

const app = express()
const port = process.env.PORT || 4000
const hostname = '127.0.0.1'
const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer JFPOwgbjsHelglshqqUg2j899EyEVztig803xMsPs1kXBV3HvKa+mn8owJWr/6XCDhpGAwwm7unPfeECkMbBEr4E+WpFLbzDNDkhZvMqYLjYArfWFglO+M1e+xO62jDrR3Z42fCSmZ+D6knHWM6YqAdB04t89/1O/w1cDnyilFU='
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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
	console.log(req.body)
	reply(reply_token, msg)
	// push(msg)
	res.send(msg)
})

function push(msg) {
	let body = JSON.stringify({
		to: 'U519c4def90991387e56573e0c870baf5',
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

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
})