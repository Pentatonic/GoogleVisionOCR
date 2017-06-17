const fs = require('fs');
var input = require('./admin_area_taiwan.geojson.json');
var output = require('./admin_area_taipei_template.geojson.json');

output.features = input.features.filter(function (o) {
    console.log(o.properties.COUNTYNAME);
    console.log(o.properties.COUNTYNAME);
    return o.properties.COUNTYNAME == '臺北市';
});
fs.writeFile('admin_area_taipei.geojson.json', JSON.stringify(output), function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('done');
    }
});