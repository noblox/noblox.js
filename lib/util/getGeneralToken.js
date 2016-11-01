// Includes
var getHash = require('./getHash.js').func;
var http = require('./http.js').func;
var cache = require('../cache');

// Args
exports.optional = ['jar'];

// Define
function getGeneralToken (jar) {
  return function (resolve, reject) {
    var httpOpt = {
      // This will never actually sign you out because an X-CSRF-TOKEN isn't provided, only received
      url: 'https://api.roblox.com/sign-out/v1', // REQUIRES https. Thanks for letting me know, ROBLOX...
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        jar: jar
      }
    };
    http(httpOpt)
    .then(function (res) {
      var xcsrf = res.headers['x-csrf-token'];
      if (xcsrf) {
        resolve(xcsrf);
      } else {
        reject(new Error('Did not receive X-CSRF-TOKEN, verify that you are logged in'));
      }
    });
  };
}

exports.func = function (args) {
  var jar = args.jar;
  return cache.wrap('XCSRF', getHash({jar: jar}), getGeneralToken(jar));
};
