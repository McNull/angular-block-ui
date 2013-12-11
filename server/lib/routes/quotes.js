
var util = require('../util');
var _ = require('lodash');

module.exports.addRoutes = function(app, config) {

  var dataFilepath = process.cwd() + '/' + config.server.dataFolder + '/quotes.json';
  var quotes = util.readJsonSync(dataFilepath);

  app.get('/api/quote', function(req, res) {
    res.json(quotes);
  });

  app.get('/api/quote/random', function(req, res) {
    var id = Math.floor(Math.random() * quotes.length);
    var q = quotes[id];
    res.json(q);
  });

  app.get('/api/quote/:id', function(req, res) {

    var entity = _.find(quotes, { id: parseInt(req.params.id) });

    if(entity) {
      res.json(entity);
    } else {
      res.send(404);
    }
  });

  app.post('/api/quote', function(req, res) {
    if(!req.body.hasOwnProperty('author') ||
      !req.body.hasOwnProperty('text')) {
      res.send(400);
    }

    var newQuote = {
      id: quotes.length + 1,
      author : req.body.author,
      text : req.body.text
    };

    quotes.push(newQuote);

    util.writeJsonSync(dataFilepath, quotes);

    res.statusCode = 200;
    res.json(newQuote);
  });

  app.post('/api/quote/:id', function(req, res) {

    var id = parseInt(req.params.id);
    var entity = _.find(quotes, { id: id });

    if(entity) {

      _.extend(entity, req.body);

      util.writeJsonSync(dataFilepath, quotes);
      res.send(200);

    } else {
      res.send(404);
    }
  });

  app.delete('/api/quote/:id', function(req, res) {
    var id = parseInt(req.params.id);
    var idx = _.findIndex(quotes, { id: id });

    if(idx > -1) {
      quotes.splice(idx, 1);
      util.writeJsonSync(dataFilepath, quotes);
      res.send(200);
    } else {
      res.send(404);
    }
  });
};