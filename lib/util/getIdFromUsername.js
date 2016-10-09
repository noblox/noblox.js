// Includes
var http = require('./http.js').func;
var cache = require('../cache');

// Args
exports.args = ['username'];

// Define
function getIdFromUsername (username) {
  return function (resolve, reject) {
    var httpOpt = {
      url: '//api.roblox.com/users/get-by-username?username=' + username
    };
    http(httpOpt)
    .then(function (body) {
      var json = JSON.parse(body);
      var id = json.Id;
      var errorMessage = json.errorMessage;
      var message = json.message;
      if (id) {
        resolve(id);
      } else if (errorMessage || message) {
        reject(new Error(errorMessage || message));
      }
    });
  };
}

exports.func = function (args) {
  var username = args.username;
  // Case does not affect the result and should not affect the cache
  return cache.wrap('IDFromName', username.toLowerCase(), getIdFromUsername(username));
};
