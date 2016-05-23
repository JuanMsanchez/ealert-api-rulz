var debug         = require("debug")("elstalert-rulz:index");
var express       = require("express");
var bodyParser    = require("body-parser");
var fs            = require("fs");
var _             = require("lodash");
var YAML          = require('json2yaml');
var rulzValidator = require('./rule-validator');
var basicAuth     = require('basic-auth');

module.exports = function (config)
{
  if(!config)
    throw new Error("Can't find configuration file");

  var app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  var es_connection = {
    host: config.es_conn,
    port: config.es_port
  };

  if(config.es_username && config.es_password)
    es_connection.auth =  config.es_username + ":" + config.es_password;

  var elasticsearch = require('elasticsearch');
  var client = new elasticsearch.Client({
    host: [es_connection]
  });

  var RULZ_PATH     = config.path     || "./rules/";
  var RULZ_INDEX    = config.index    || "rulez";
  var RULZ_TYPE     = config.type     || "rule";
  var RULZ_DEFAULTS = config.defaults || {};
  var RULZ_PORT     = config.port     || 3000;

  var auth = function (req, res, next)
  {
    if(config.auth)
    {
      var user = basicAuth(req);
      if (!user || !user.name || !user.pass)
        return res.send(401);

      if (user.name === config.auth.user && user.pass === config.auth.pass)
        return next();
      else
        return res.send(401);
    }
    else
      return next();
  };

  app.get('/elastalert/rule/:id', auth, function(req, res)
  {
    debug("GET /elastalert/rule/%s", req.params.id);

    client.get({
      index: RULZ_INDEX,
      type:  RULZ_TYPE,
      id: req.params.id
    }, function (err, rule) {
      if(err)
      {
        debug("error %s fetching rule %s", err, req.params.id);
        res.status(500).send("Error fetching rulez");
      }
      else
      {
        debug("Rule %s fetched", req.params.id);
        res.status(200).send(rule);
      }
    });
  });

  app.get('/elastalert/rule', auth, function(req, res)
  {
    debug("GET /elastalert/rule");

    var filters = req.body.filters;
    var query;
    if(filters && (filters.name || filters.type))
    {
      query = {"match" : {}};
      if(filters.name)
        query.match.name = filters.name;
      if(filters.type)
        query.match.type = filters.type;
    }
    else
    {
      query = {"match_all": {}};
    }

    client.search({
      index: RULZ_INDEX,
      type:  RULZ_TYPE,
      body: { "query": query }
    }, function (err, rulez) {
      if(err)
      {
        debug("error fetching rulez, %s", err);
        res.status(500).send("Error fetching rulez");
      }
      else
      {
        res.status(200).send(rulez);
      }
    });
  });

  app.post('/elastalert/rule', auth, function(req, res)
  {
    debug("POST /elastalert/rule");
    var data = {
      index : RULZ_INDEX,
      type  : RULZ_TYPE,
      body  : rulzValidator.filter(req.body, RULZ_DEFAULTS)
    };



    client.create(data, function(err, rule)
    {
      if(err)
      {
        debug("error creating rule, %s", err);
        res.status(500).send("Error creating rule");
      }
      else
      {
        saveRulzFile(rule._id, function(err)
        {
          if(err)
            res.status(500).send("Error writing rule file");
          else
            res.status(200).send(rule);
        });
      }
    });
  });

  app.put('/elastalert/rule/:id', auth, function(req, res)
  {
    debug("PUT /elastalert/rule/%s", req.params.id);

    var ruleId = req.params.id;
    var data = {
      index : RULZ_INDEX,
      type  : RULZ_TYPE,
      id    : ruleId,
      body  : {doc : _.assign(req.body, RULZ_DEFAULTS) }
    };

    client.update(data, function(err, rule)
    {
      if(err)
      {
        debug("error updating rule, %s", err);
        res.status(500).send("Error updating rule");
      }
      else
      {
        saveRulzFile(ruleId, function(err)
        {
          if(err)
            res.status(500).send("Error writing rule file");
          else
            res.status(200).send(rule);
        });
      }
    });
  });

  app.delete('/elastalert/rule/:id', auth, function(req, res)
  {
    debug("DELETE /elastalert/rule/%s", req.params.id);

    var ruleId = req.params.id;
    var data = {
      index : RULZ_INDEX,
      type  : RULZ_TYPE,
      id    : ruleId
    };

    removeRulzFile(ruleId, function(err)
    {
      if(err)
        res.status(500).send("Error removing rule file");
      else
      {
        client.delete(data, function(err, rule)
        {
          if(err)
          {
            debug("error %s removing rule %s", err, ruleId);
            res.status(500).send("Error updating rule");
          }
          else
            res.status(200).send("Rule removed");
        });
      }
    });
  });

  function removeRulzFile(id, next)
  {
    var filePath =  RULZ_PATH + id + ".yaml";
    fs.unlink(filePath, function(err){
      return next(err);
    });
  }

  function saveRulzFile(id, next)
  {
    client.get({
      index: RULZ_INDEX,
      type:  RULZ_TYPE,
      id: id
    }, function (err, rule)
    {
      if(err) return next(err);

      rule._source.name = id;
      var ymlText = YAML.stringify(rule._source);
      var filePath =  RULZ_PATH + id + ".yaml";
      fs.writeFile(filePath, ymlText, function(err){
        return next(err);
      });
    });
  }

  var server = app.listen(RULZ_PORT, function ()
  {
    var host = server.address().address;
    var port = server.address().port;
    debug('App listening at http://%s:%s', host, port);
  });
};
