var fs = require('fs');

var home = process.env.HOME || process.env.USERPROFILE;
var configFile = home + "/.ealertapirc";
var defaultConfig = {
  "port" : 3000,
  "es_host" : "localhost",
  "es_port" : "9200",
  "path" : "./rules/",
  "index": "rulez",
  "type" : "rule"
};

try{
  fs.statSync(configFile);
}
catch(exception){
  fs.writeFileSync(configFile, JSON.stringify(defaultConfig));
}

var config = JSON.parse( fs.readFileSync(configFile) );
module.exports = config;
