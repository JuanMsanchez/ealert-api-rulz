var config      = require("../eaapi.config");
var request  	  = require('request');
var ruleID;

var mockCreate = {
  "type": "frequency",
  "num_events": 2,
  "timeframe":{
    "hours": 24
  },
  "filter":[
    {
      "term": {
        "localidad": "CIUDAD AUTONOMA DE BS AS"
      }
    }
  ],
  "email":[ "mail@weird.com" ]
};

var mockUpdate = {
  "type": "frequency",
  "description" : "test",
  "num_events": 2,
  "timeframe":{
    "hours": 24
  },
  "filter":[
    {
      "term": {
        "localidad": "CIUDAD AUTONOMA DE BS AS"
      }
    }
  ],
  "email":[ "mail@regular.com" ]
};

var auth = {};
if(config.auth)
  auth = {
    "user" : config.auth.user,
    "pass" : config.auth.pass,
    "json" : true
  };

var apiURL = "http://localhost:"+config.port;

describe('Test POST /elastalert/rule endpoint', function()
{
  it('It should response 200 and the rule data', function(done)
  {
    request.post(apiURL + "/elastalert/rule", {auth: auth, form: mockCreate }, function(err, res, body)
    {
      if(res.statusCode == 401)
      {
        console.log("Invalid user and password");
        return done(new Error('Invalid user and password'));
      }
      if(err || res.statusCode != 200)
      {
        console.log("Status response : %s Error: %s, Body: %s", res.statusCode, err, body);
        return done(new Error('Error creating rule'));
      }
      else
      {
        var rule = JSON.parse(body);
        ruleID = rule._id;
        return done();
      }
    });
  });
});

describe('Test PUT /elastalert/rule/:id endpoint', function()
{
  it('It should response 200 and the rule data', function(done)
  {
    request.put(apiURL + "/elastalert/rule/"+ruleID, {auth: auth, form: mockUpdate }, function(err, res, body)
    {
      if(res.statusCode == 401)
      {
        console.log("Invalid user and password");
        return done(new Error('Invalid user and password'));
      }
      if(err || res.statusCode != 200)
      {
        console.log("Status response : %s Error: %s, Body: %s", res.statusCode, err, body);
        return done(new Error('Error updating rule'));
      }
      else
      {
        return done();
      }
    });
  });
});

describe('Test GET /elastalert/rule/:id endpoint', function()
{
  it('It should response 200 and the rule data', function(done)
  {
    request.get(apiURL + "/elastalert/rule/"+ruleID, {auth: auth }, function(err, res, body)
    {
      if(res.statusCode == 401)
      {
        console.log("Invalid user and password");
        return done(new Error('Invalid user and password'));
      }
      if(err || res.statusCode != 200)
      {
        console.log("Status response : %s Error: %s, Body: %s", res.statusCode, err, body);
        return done(new Error('Error fetching rule'));
      }
      else
      {
        return done();
      }
    });
  });
});

describe('Test GET /elastalert/rule endpoint', function()
{
  it('It should response 200 and an array of rules', function(done)
  {
    request.get(apiURL + "/elastalert/rule/", {auth: auth }, function(err, res, body)
    {
      if(res.statusCode == 401)
      {
        console.log("Invalid user and password");
        return done(new Error('Invalid user and password'));
      }
      if(err || res.statusCode != 200)
      {
        console.log("Status response : %s Error: %s, Body: %s", res.statusCode, err, body);
        return done(new Error('Error fetching rule'));
      }
      else
      {
        return done();
      }
    });
  });
});


describe('Test DELETE /elastalert/rule/:id endpoint', function()
{
  it('It should response 200 and the rule data', function(done)
  {
    request.delete(apiURL + "/elastalert/rule/"+ruleID, {auth: auth}, function(err, res, body)
    {
      if(res.statusCode == 401)
      {
        console.log("Invalid user and password");
        return done(new Error('Invalid user and password'));
      }
      if(err || res.statusCode != 200)
      {
        console.log("Status response : %s Error: %s, Body: %s", res.statusCode, err, body);
        return done(new Error('Error removing rule'));
      }
      else
      {
        return done();
      }
    });
  });
});
