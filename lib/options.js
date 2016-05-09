// Includes
var request = require('request-promise');
var settings = require('../settings.json');

exports.jar = request.jar();

exports.errorHandler = function (err) {
  console.error(err.stack);
};

var cacheList = [];
for (var item in settings.cache) {
  if (item.indexOf('_') === -1) {
    var lower = item.toLowerCase();
    var cacheObj = {
      name: item,
      refresh: settings.cache[lower + '_' + 'refresh'],
      expire: settings.cache[item]
    };
    cacheList.push(cacheObj);
  }
}
exports.cache = require('./cache/new.js')(cacheList);
