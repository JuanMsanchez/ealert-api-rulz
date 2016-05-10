var fs = require('fs');

var globalConfig = "/etc/.ealertapirc";
var localConfig = __dirname + "/../.ealertapirc";
var defaultConfig = fs.readFileSync(localConfig);

try{
  fs.statSync(globalConfig);
}
catch(exception){
  fs.writeFileSync(globalConfig, defaultConfig);
}

var config = JSON.parse( fs.readFileSync(configFile) );
module.exports = config;
