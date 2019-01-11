var mongojs = require('mongojs');

var databaseUrl = 'mongodb://localhost/tesa';
var collections = ["SensorData", "BeaconData"];
var option = {"auth": {"user": "tesa", "password": "haaraina"}}

var connect = mongojs(databaseUrl, collections, option);

module.exports = {
    connect: connect
};
