const bodyParser = require('body-parser')
const request = require('request')
const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express()
const port = 443;
const hostname = '127.0.0.1'
var mongojs = require('./db');

var db = mongojs.connect;
var app = express();
const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer JFPOwgbjsHelglshqqUg2j899EyEVztig803xMsPs1kXBV3HvKa+mn8owJWr/6XCDhpGAwwm7unPfeECkMbBEr4E+WpFLbzDNDkhZvMqYLjYArfWFglO+M1e+xO62jDrR3Z42fCSmZ+D6knHWM6YqAdB04t89/1O/w1cDnyilFU='
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send('Hello HTTPS! via IRIS Cloud')
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

	if (req.body.events[0].type == 'beacon') {
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

app.post("/receiveData", (req, res) => {
	// var body = req.body;
	// Check whether it is routine sensors value POST or other type of POST
	if ('DevEUI_uplink' in req.body) {
		if ('payload_parsed' in req.body.DevEUI_uplink) {

			// Payload data
			let frames = req.body.DevEUI_uplink.payload_parsed.frames;
			let time = new Date(); // is this working ??

			// Logging sensors value to console
			console.log('Time: ' + time);
			console.log('Frames: ');
			console.log(frames);
			console.log('');


			// Insert sensors value in to MongoDB
			db.SensorData.insert({
				// timestamp: time.getTime(),
				temperature: parseFloat(frames[0].value),
				humidty: parseFloat(frames[1].value),
				p_in: parseInt(frames[2].value),
				p_out: parseInt(frames[2].value),
				timestamp: time.getTime()


			}, (err, docs) => {
				if (err) {
					console.log(err);
					return;
				}
				console.log(docs);
			});
		}
	}
	// db.temperature.insert(body, (err, docs) => {
	//   if(err){
	//     res.send(err);
	//     return;
	//   }
	//   res.send(docs)
	// })
});

app.get("/showData/:type", (req, res) => {
	var type = req.params.type
	db.type.find(function (err, docs) {
		if (err) {
			res.send(err);
			return;
		}
		res.send(docs);
	});
});

app.post("/addData/:type", (req, res) => {
	var type = req.params.type
	var body = req.body;
	var data = {};
	body.teamID = parseInt(body.teamID);
	// data.temperature = body.temperature;
	db.type.insert(body, (err, docs) => {
		if (err) {
			res.send(err);
			return;
		}
		res.send(docs);

	})
});

https.createServer({
	key: fs.readFileSync('/etc/letsencrypt/live/tesatopgun-haaraina.ddns.net/privkey.pem'),
	// cert: fs.readFileSync('/etc/letsencrypt/path/to/cert.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/tesatopgun-haaraina.ddns.net/fullchain.pem')
}, app).listen(443, () => {
	console.log('Listening...')
})
