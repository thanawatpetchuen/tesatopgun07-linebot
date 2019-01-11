var express = require('express');
var router = express.Router();
const request = require('request')
var addBeaconData = require('./db').beacon;
var queryAndSend = require('./db').queryAndSend;

const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer JFPOwgbjsHelglshqqUg2j899EyEVztig803xMsPs1kXBV3HvKa+mn8owJWr/6XCDhpGAwwm7unPfeECkMbBEr4E+WpFLbzDNDkhZvMqYLjYArfWFglO+M1e+xO62jDrR3Z42fCSmZ+D6knHWM6YqAdB04t89/1O/w1cDnyilFU='
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Push
router.get('/webhook', (req, res) => {
	// push block
	let message = "Hello Tesa";
	push(message);
	res.send(message);
	// console.log(message)
})

// Reply
router.post('/webhook', (req, res) => {
	let reply_token = req.body.events[0].replyToken
	let msg = ''

	if (req.body.events[0].type == 'beacon') {
		msg = JSON.stringify(req.body.events[0])
		// addBeaconData(msg, (exceed) => {
		// 	// if (msg = JSON.stringify(req.body.events[0]))
		// 	// if(exceed){
		// 	// 	console.log(req.body)
		// 	// 	reply(reply_token, "คนเกิน")
		// 	// 	// push(msg)
		// 	// 	// res.send(msg)
		// 	// }else{
		// 	console.log(req.body)
		// 	reply(reply_token, msg)
		// 	// push(msg)
		// 	res.send(msg)
		// 	// }
		// });

		addBeaconData(msg, (exceed) => {
			console.log(exceed);
			if(exceed){
				console.log(req.body)
				// reply(reply_token, "จํานวนคนเกิน กรุณาเชิญคนออกจากบริเวณ")
				push("จํานวนคนเกิน กรุณาเชิญคนออกจากบริเวณ")
				// res.send(msg)
			}else{
				console.log(req.body)
				reply(reply_token, "เข้าสู่บริเวณ")
				// push(msg)
				res.send(msg)
			}
		});
		

	}
	else {
		msg = req.body.events[0].message.text
		console.log(msg)
		queryAndSend(msg, (err, docs) => {
			// res.send(docs);
			console.log("ASDASDGASD")
			console.log(docs)
			if(err){
				reply(reply_token, (docs))
			}else{
				reply(reply_token, JSON.stringify(docs))
			}
			// push(msg)
			res.send(msg)
		})
	}
	// msg = req.body.events[0].message.text
	
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
		replyToken: reply_token,
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

module.exports = router;
