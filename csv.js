var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('./public/sanam.json', 'utf8'));
// console.log(obj);
var collect = {};
obj.forEach(element => {
    // console.log(element.timestamp);
    var timestamps = element.timestamp;
    delete element["timestamp"]
    // console.log(element);
    collect[timestamps] = element
});

console.log(collect);
collect = JSON.stringify(collect);
fs.writeFileSync('./s.json', collect);

