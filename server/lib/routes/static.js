
var express = require('express');

module.exports.addRoutes = function(app, config) {
  // First looks for a static file: index.html, css, images, etc.
  app.use(express.compress());
  app.use(express.static(process.cwd() + '/' + config.server.distFolder));
  app.use(function(req, res, next) {
    res.send(404); // If we get here then the request for a static file is invalid
  });
};