ealert-api-rulz
====
Is small API that enable to manage ealastalert(https://github.com/Yelp/elastalert) rules CRUD via
REST requests. Here some relevant points about the API:

- The API will store all the rules in a elasticsearch database and the filesystem.

- To avoid the unique rule name constraint from ealert we use the elasticsearch id as the rule name, we encorage you to use the description field instead.

- No Validation, the API will not validate the data in the request, but it will filter the body grabbing only the fields allowed by elastalert depending on the rule type(http://elastalert.readthedocs.io/en/latest/ruletypes.html)

- This is a beta version, so use it as you own risk.


Install
---
    npm install -g ealert-api-rulz

Usage
---
ealert-api-rulz enables the next endpoints:
    GET    /elastalert/rule/:id
    GET    /elastalert/rule
    POST   /elastalert/rule
    PUT    /elastalert/rule/:id
    DELETE /elastalert/rule/:id

Defaults & Config
---
You can find the default config on this repo ``.ealertapirc``.

    {
      //the port were the API will run
      "port" : 3000,

      //if the auth key is in the configuration file the API will start with basic http authentication
      "auth" : {
        "user" : "root",
        "pass" : "root"
      },

      //elastic host and port where the API will store the saved data
      "es_host" : "localhost",
      "es_port" : "9200",

      //path to the elastalert rules directory
      "path" : "./rules",

      //index and type name for the rules data
      "index": "rulez",
      "type" : "rule",

      //default data to be merged with the requests
      "defaults" : {
        "es_host" : "elasticsearch_host",
        "es_port" : 9200
      }
    }

Test
===
    npm run test
