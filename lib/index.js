var path = require('path');
var dirs = [path.join(__dirname, '/util'), path.join(__dirname, '/event'), __dirname];
var exclude = ['util', 'event'];

var rbx = {};

dirs.forEach(function (dir) {
  require('fs').readdirSync(dir).forEach(function (file) {
    if (exclude.indexOf(file) === -1) {
      rbx[file.replace('.js', '')] = require(dir + '/' + file);
    }
  });
});

for (var name in rbx) {
  var exporter = rbx[name];
  if (exporter.func) {
    module.exports[name] = rbx.wrap.wrapExport(exporter.func, exporter.required || [], exporter.optional || []);
  } else {
    module.exports[name] = rbx[name];
  }
}

exports.options = require('./options.js');
exports.settings = require('../settings.json');
