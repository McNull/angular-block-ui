#!/usr/bin/env node
var config = require('./lib/config');

var express = require('express');
var app = express();

app.use(express.logger());                                  // Log requests to the console
app.use(express.bodyParser());                              // Extract the data from the body of the request
app.use(function noCache(req, res, next){
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires",0);
  next();
});

require('./lib/routes/quotes').addRoutes(app, config);
require('./lib/routes/static').addRoutes(app, config);

app.listen(config.server.listenPort);

console.log('Listening at port: ' + config.server.listenPort);