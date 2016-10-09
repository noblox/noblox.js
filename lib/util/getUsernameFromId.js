// Includes
var http = require('./http.js').func;
var cache = require('../cache');

// Args
exports.args = ['id'];

// Define
function getUsernameFromId (id) {
  return function (resolve, reject) {
    var httpOpt = {
      url: '//api.roblox.com/users/' + id,
      options: {
        resolveWithFullResponse: true,
        method: 'GET'
      }
    };
    http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        var json = JSON.parse(res.body);
        resolve(json.Username);
      } else {
        reject(new Error('User does not exist'));
      }
    });
  };
}

exports.func = function (args) {
  var id = args.id;
  return cache.wrap('NameFromID', id, getUsernameFromId(id));
};
