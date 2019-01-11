var express = require('express');
var groupByTime = require("group-by-time");
var csv = require("fast-csv");
var router = express.Router();
var db = require('../db').connect;
var fs = require('fs');

var load;
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post("/receiveData", (req, res) => {
    // var type = req.params.type;
    var body = req.body;
    let time = new Date(); // is this working ??

    if ('DevEUI_uplink' in req.body) {
        if ('payload_parsed' in req.body.DevEUI_uplink) {

            // Payload data
            let frames = req.body.DevEUI_uplink.payload_parsed.frames;


            // Logging sensors value to console
            console.log('Time: ' + time);
            console.log('Frames: ');
            console.log(frames);
            console.log('');


            // Insert sensors value in to MongoDB
            db.SensorData.insert({
                // timestamp: time.getTime(),
                temperature: parseFloat(frames[0].value),
                humidity: parseFloat(frames[1].value),
                p_in: parseInt(frames[2].value),
                p_out: parseInt(frames[3].value),
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
    // switch (type) {
    //     case sensor:
    //         // code block
    //         // Check whether it is routine sensors value POST or other type of POST

    //         break;

    //     default:
    //         var p_in = 0;
    //         var p_out = 0;
    //         if(body.beacon.status == "enter"){
    //             p_in = 1;
    //         }else{
    //             p_out = 1;
    //         }
    //         db.BeaconData.insert({
    //             // timestamp: time.getTime(),
    //             p_in: parseInt(p_in),
    //             p_out: parseInt(p_out),
    //             timestamp: time.getTime()


    //         }, (err, docs) => {
    //             if (err) {
    //                 console.log(err);
    //                 return;
    //             }
    //             console.log(docs);
    //         });
    //     // code block
    // }

    // db.temperature.insert(body, (err, docs) => {
    //   if(err){
    //     res.send(err);
    //     return;
    //   }
    //   res.send(docs)
    // })
});

router.get("/showData2/:type", (req, res) => {
    var type = req.params.type;
    db.collection(type).find({
        timestamp:
        {
            $gte: new Date(new Date().setHours(00, 00, 00)).getTime(),
            $lt: new Date(new Date().setHours(23, 59, 59)).getTime()
        }
    }, function (err, docs) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(docs);
    });
});

byday = {};
function sum_(array) {
    var sum = array.reduce((a, b) => a + b, 0)
    return sum
}

router.get('/showData/filter/:type', (req, res) => {
    var type = req.params.type;
    var hours = parseInt(req.query.hours);

    getAllRecords(type, res, (total, collect_hour) => {
        res.send({"collect": total.slice(8760 + collect_hour.length - hours)})
    })

    //rrrrrrrrr

    // db.collection(type).find({}
    //     , (err, docs) => {
    //         if (err) {
    //             res.send(err);
    //             return;
    //         }
    //         var groupedByDay = groupByTime(docs, 'timestamp', 'day');
    //         // console.log(groupedByDay);
    //         var now_hour = new Date().getHours();
    //         var collect = {}
    //         var collect_hour = []

    //         for (i = 0; i < 25; i++) {
    //             collect[i] = []
    //         }
    //         // var bigCollect = JSON.parse(fs.readFileSync('./s.json', 'utf8'));
    //         var byDayKey = Object.keys(groupedByDay);

    //         // console.log(collect)
    //         for (keys of byDayKey) {

    //             groupedByDay[keys].forEach(day => {
    //                 // console.log(new Date(day.timestamp).getHours())
    //                 var hours = new Date(day.timestamp).getHours()

    //                 collect[hours].push(day.p_in);
    //             });

    //             var collect_key = Object.keys(collect);
    //             for (key of collect_key) {
    //                 // console.log(key);
    //                 collect[key] = sum_(collect[key])
    //             }
    //             // console.log(keys+"ASdsada");
    //             // bigCollect[new Date(parseInt(keys)).toLocaleDateString("en-US")] = collect
    //             collect_update_key = Object.keys(collect);
    //             for (i of collect_update_key) {
    //                 if (i <= now_hour) {
    //                     collect_hour.push(String(collect[i]))
    //                 }
    //             }

    //         }
    //         // var total = Array.prototype.push.apply(load, collect_hour);
    //         var total = [...load, ...collect_hour]
    //         res.send({ "collect_hour": total.slice(8760 + collect_hour.length - hours) });
    //         // main(collect, res)
    //     });

    //rrrrrrrrr

})


router.get("/showData/group/:type", (req, res) => {
    var type = req.params.type;

    getAllRecords(type, res, (total) => {
        res.send({"collect": total})
    });

    //rrrrrr

    // db.collection(type).find({}
    //     , (err, docs) => {
    //         if (err) {
    //             res.send(err);
    //             return;
    //         }
    //         var groupedByDay = groupByTime(docs, 'timestamp', 'day');
    //         // console.log(groupedByDay);
    //         var now_hour = new Date().getHours();
    //         var collect = {}
    //         var collect_hour = []

    //         for (i = 0; i < 25; i++) {
    //             collect[i] = []
    //         }
    //         // var bigCollect = JSON.parse(fs.readFileSync('./s.json', 'utf8'));
    //         var byDayKey = Object.keys(groupedByDay);

    //         // console.log(collect)
    //         for (keys of byDayKey) {

    //             groupedByDay[keys].forEach(day => {
    //                 // console.log(new Date(day.timestamp).getHours())
    //                 var hours = new Date(day.timestamp).getHours()

    //                 collect[hours].push(day.p_in);
    //             });

    //             var collect_key = Object.keys(collect);
    //             for (key of collect_key) {
    //                 // console.log(key);
    //                 collect[key] = sum_(collect[key])
    //             }
    //             // console.log(keys+"ASdsada");
    //             // bigCollect[new Date(parseInt(keys)).toLocaleDateString("en-US")] = collect
    //             collect_update_key = Object.keys(collect);
    //             for (i of collect_update_key) {
    //                 if (i <= now_hour) {
    //                     collect_hour.push(String(collect[i]))
    //                 }
    //             }

    //         }
    //         // var total = Array.prototype.push.apply(load, collect_hour);
    //         res.send({ "collect_hour": [...load, ...collect_hour] });
    //         // main(collect, res)
    //     });

    //rrrrrr

});

router.get("/showData/:type", (req, res) => {
    var type = req.params.type;
    db.collection(type).find(function (err, docs) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(docs);
    });
});

router.delete("/SensorData", (req, res) => {
    var type = req.params.type;
    db.SensorData.drop(function (err, docs) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(docs);
    });
})

router.delete("/BeaconData", (req, res) => {
    var type = req.params.type;
    db.BeaconData.drop(function (err, docs) {
        if (err) {
            res.send(err);
            return;
        }
        res.send(docs);
    });
})

router.post("/addData/:type", (req, res) => {
    var type = req.params.type
    var body = req.body;
    body.timestamp = Date.now();
    var data = {};
    // body.teamID = parseInt(body.teamID);
    // data.temperature = body.temperature;
    db.collection(type).insert(body, (err, docs) => {
        if (err) {
            res.send(err);
            return;
        }
        res.send(docs);

    })
});

const addBeaconData = (body, callback) => {
    body_json = JSON.parse(body);
    var p_in = 0;
    var p_out = 0;
    // getCurrentUsers((err, docs) => {
    //     var time = new Date().getTime();
    //     console.log(body_json.beacon.type);
    //     if (body_json.beacon.type == "enter") {
    //         p_in = 1;
    //     } else {
    //         p_out = 1;
    //     }
    //     db.BeaconData.insert({
    //         // timestamp: time.getTime(),
    //         p_in: parseInt(p_in),
    //         p_out: parseInt(p_out),
    //         timestamp: time
    
    
    //     }, (err2, docs2) => {
    //         if (err2) {
    //             console.log(err2);
    //             return;
    //         }
    //         console.log(docs);
    //         // if((docs.p_in - docs.p_out) > 2){
    //         // callback(true);
    //         // }
    //     });

    // })

    var time = new Date().getTime();
    console.log(body_json.beacon.type);
    if (body_json.beacon.type == "enter") {
        p_in = 1;
    } else {
        p_out = 1;
    }
    db.BeaconData.insert({
        // timestamp: time.getTime(),
        p_in: parseInt(p_in),
        p_out: parseInt(p_out),
        timestamp: time


    }, (err, docs) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(docs);

        getCurrentUsers((p_in, p_out) => {
            console.log("Current");
            console.log(p_in, p_out);
            if(p_in - p_out > 2){
                callback(true);
            }else{
                callback(false);
            }
        })
        // if((docs.p_in - docs.p_out) > 2){
        // callback(true);
        // }
    });

    // getCurrentUsers((err, docs) => {
    //     var time = new Date().getTime();
    //     console.log(body_json.beacon.type);
    //     if (body_json.beacon.type == "enter") {
    //         p_in = docs.p_in + 1;
    //     } else {
    //         p_out = docs.p_out + 1;
    //     }
    //     db.BeaconData.insert({
    //         // timestamp: time.getTime(),
    //         p_in: parseInt(p_in),
    //         p_out: parseInt(p_out),
    //         timestamp: time
    
    
    //     }, (err2, docs2) => {
    //         if (err2) {
    //             console.log(err2);
    //             return;
    //         }
    //         console.log(docs2);
    //         if((p_in - p_out) > 2){
    //             callback(true);
    //         }
    //     });

    // })
}

const getCurrentUsers = (callback) => {
    var time = Date.now();
    var morning = new Date().setHours(0,0,0,0);
    db.BeaconData.find({timestamp: {
        $gte : morning,
        $lte : time
    }}, (err, docs) => {
        var sum_p_in = 0;
        var sum_p_out = 0;
        docs.forEach(user => {
            sum_p_in += user.p_in;
            sum_p_out += user.p_out;
        });
        callback(sum_p_in, sum_p_out);
    })
}

const queryAndSend = (msg, callback) => {
    
    if(msg == "Admin_mon"){
        console.log("ASd")
        var now = new Date().getHours - 1;
        var time = new Date(new Date().setHours(now));
        console.log(time);
        // callback(time.getTime())
        db.SensorData.find({
                        timestamp: {$gte: time.getTime()}
                    }, (err, docs) => {
                        // if(err){
                        console.log(docs);
                        var sum_p_in = 0;
                        var sum_p_out = 0;
                        var sum_temperature = 0;
                        var sum_humidity = 0;
                        docs.forEach(element => {
                            sum_p_in += element.p_in;
                            sum_p_out += element.p_out;
                            sum_temperature += element.temperature != null ? element.temperature : 0;
                            sum_humidity += element.sum_humidity != null ? element.humidity : 0;
                            console.log(element.p_in);
                        });

                        var output = {
                            "temperature": sum_temperature/docs.length,
                            "humidity": sum_humidity/docs.length,
                            "p_in": sum_p_in,
                            "p_out": sum_p_out
                        }
                        // }

                        callback(err, output)
                    })
    }else{
        try{
            db.SensorData.find({}).sort({_id:-1}, (err, docs) => {
                // if(err){
                console.log(docs);
                var sum_p_in = 0;
                var sum_p_out = 0;
                // var sum_temperature = 0;
                // var sum_humidity = 0;
                docs.forEach(element => {
                    sum_p_in += element.p_in;
                    sum_p_out += element.p_out;
                    // sum_temperature += element.temperature;
                    // sum_humidity += element.humidty;
                    // console.log(element.p_in);
                });
    
                // var output = {
                //     "temperature": docs.length,
                //     "humidity": sum_humidity/docs.length,
                //     "p_in": sum_p_in,
                //     "p_out": sum_p_out
                // }
                // // }
                // var sum_p_in = 0
                switch(msg){
                    case "Temperature": 
                        err = true;
                        callback(err, docs[0].temperature+ " °C");
                        break;
                    case "Humidity":
                        err = true;
                        callback(err, docs[0].humidity+ " %");
                        break;
                    case "People In":
                        err = true;
                        callback(err, sum_p_in+" คน") 
                        break;
                    case "People Out":
                        err = true;
                        callback(err, sum_p_out+" คน") 
                        break;
                    case "People In People Out":
                        err = true;
                        callback(err, `เข้า ${sum_p_in} คน\nออก ${sum_p_out} คน`) 
                        break;
                    default:
                        err = true;
                        callback(err, "Hello");
                }
    
                
            });
            
        }catch(error){
            err = true;
            callback(err, "Error!");
        }
    }
    // switch(msg){
    //     case "Admin_mon":
    //         db.SensorData.find({
    //             $gte: new Date().setHours(new Date().getHours()).getTime()
    //         }, (err, docs) => {
    //             // if(err){

    //             // }
    //             callback(err, docs)
    //         })
    //         break;
        
    //     default:
    //         break;
        
    // }
}



function readCSV() {
    dataArr = []
    return new Promise(function (resolve, reject) {
        csv
            .fromPath('sanam.csv', { delimiter: ';' })
            .on("data", function (str) {
                dataArr.push(str);
            })
            .on("end", function () {
                for (i of dataArr) {
                }
                resolve(dataArr);
            });

    });
}

async function to1dArray(dataSet) {
    arr = []
    for (var i = 0; i < dataSet.length; i++) {
        var row = dataSet[i];
        row = row.slice(1)
        for (var j = 0; j < row.length; j++) {
            arr.push(row[j])
        }
    }
    return arr
}


async function readData() {
    var csv$ = readCSV();
    var data = csv$.then(Arr => {
        return Arr
    })
    return data
}


async function main() {

    var rawData = await readData();
    // rawData = rawData.slice(1)
    load = await to1dArray(rawData)
    console.log(`Length: ${load.length}`)
    // res.send({"collect": rawData.push(...collect)})
}

function getAllRecords(type, res, callback) {
    var total = [];
    // var now = new Date();
    // var now_temp = new Date();
    // if(hours){
    //     now.setHours(now.getHours() - hours);
    // }
    db.collection(type).find({}
        , (err, docs) => {
            if (err) {
                res.send(err);
                return;
            }
            var groupedByDay = groupByTime(docs, 'timestamp', 'day');
            // console.log(groupedByDay);
            var now_hour = new Date().getHours();
            var collect = {}
            var collect_hour = []

            for (i = 0; i < 25; i++) {
                collect[i] = []
            }
            // var bigCollect = JSON.parse(fs.readFileSync('./s.json', 'utf8'));
            var byDayKey = Object.keys(groupedByDay);

            // console.log(collect)
            for (keys of byDayKey) {

                groupedByDay[keys].forEach(day => {
                    // console.log(new Date(day.timestamp).getHours())
                    var hours = new Date(day.timestamp).getHours()

                    collect[hours].push(day.p_in);
                });

                var collect_key = Object.keys(collect);
                for (key of collect_key) {
                    // console.log(key);
                    collect[key] = sum_(collect[key])
                }
                // console.log(keys+"ASdsada");
                // bigCollect[new Date(parseInt(keys)).toLocaleDateString("en-US")] = collect
                collect_update_key = Object.keys(collect);
                for (i of collect_update_key) {
                    if (i <= now_hour) {
                        collect_hour.push(String(collect[i]))
                    }
                }

            }
            // var total = Array.prototype.push.apply(load, collect_hour);
            total = [...load, ...collect_hour]
            // console.log(total)
            // res.send({ "collect_hour": total.slice(8760 + collect_hour.length - hours) });
            callback(total, collect_hour);
            // main(collect, res)
            // console.log("HERE")
        })
    // return total;
    // console.log(total);
}

// prepareData()
main();

module.exports = { router: router, beacon: addBeaconData, queryAndSend: queryAndSend };
