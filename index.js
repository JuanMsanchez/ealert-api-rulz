var fs = require('fs');
var config = JSON.parse( fs.readFileSync("./.ealertapirc") );
var app = require('./lib/ealert-api.js')(config);
