// const tf = require('@tensorflow/tfjs');
// require('@tensorflow/tfjs-node');

var csv = require("fast-csv");
var xs = [];
var ys = [];
var slice_num = 8;


function readCSV() {
    dataArr = []
    return new Promise(function (resolve, reject) {
        csv
            .fromPath('sanam.csv', {delimiter: ';'})
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
    for(var i = 0; i < dataSet.length; i++) {
        var row = dataSet[i];
        row = row.slice(1)
        for(var j = 0; j < row.length; j++) {
            arr.push(row[j])
        }
    }
    return arr
}


async function readData(){
    var csv$ = readCSV();
    var data = csv$.then(Arr => {
        return Arr
    })
    return data
}  


async function main() {
    
    var rawData = await readData();
    // rawData = rawData.slice(1)
    rawData = await to1dArray(rawData)
    // console.log(rawData)
    
}

// prepareData()
main();