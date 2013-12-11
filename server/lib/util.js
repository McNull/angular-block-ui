var fs = require('fs');

exports.readJson = function (file, callback) {
  if (typeof callback !== 'function') {
    throw new Error('utile.file.readJson needs a callback');
  }

  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      return callback(err);
    }

    try {
      var json = JSON.parse(data);
      return callback(null, json);
    }
    catch (err) {
      return callback(err);
    }
  });
};

exports.readJsonSync = function (file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
};

exports.writeJson = function(file, data, callback) {
  fs.writeFile(file, JSON.stringify(data, null, 2), function(err) {
    if(err) {
      return callback(err);
    } else {
      return callback(null, data);
    }
  });
};

exports.writeJsonSync = function(file, data) {
  return fs.writeFileSync(file, JSON.stringify(data, null, 2));
};