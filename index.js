var config = require('./lib/config-loader.js');
var app = require('./lib/ealert-api.js')(config);
console.log("ElastAlert API started at port %", config.port);
