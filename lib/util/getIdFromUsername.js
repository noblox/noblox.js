// Dependencies
var http = require('./http.js').func;
var cache = require('../cache');

// Args
exports.args = ['username', 'jar'];

// Define
function getIdFromUsername (jar, username) {
  return function (resolve, reject) {
    var httpOpt = {
      url: 'https://api.roblox.com/users/get-by-username?username=' + username,
      options: {
        method: 'GET',
        jar: jar
      }
    };
    http(httpOpt)
    .then(function (body) {
      var json = JSON.parse(body);
      var id = json.Id;
      var errorMessage = json.errorMessage;
      if (id) {
        resolve(id);
      } else if (errorMessage) {
        reject(new Error(errorMessage));
      }
    });
  };
}

exports.func = function (args) {
  var username = args.username;
  return cache.wrap('IDFromName', username, getIdFromUsername(args.jar, username));
};
