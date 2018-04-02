// Includes
var http = require('../util/http.js').func;
var cache = require('../cache');

// Args
exports.required = ['id'];

// Define
function getUsernameFromId (id) {
  var httpOpt = {
    url: '//api.roblox.com/users/' + id,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  };
  return http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 200) {
      var json = JSON.parse(res.body);
      return json.Username;
    } else {
      throw new Error('User does not exist');
    }
  });
}

exports.func = function (args) {
  var id = args.id;
  return cache.wrap('NameFromID', id, function () {
    return getUsernameFromId(id);
  });
};
