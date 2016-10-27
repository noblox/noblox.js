// Includes
var http = require('./http.js').func;
var getHash = require('./getHash.js').func;
var getVerificationInputs = require('./getVerificationInputs.js').func;
var cache = require('../cache');

// Args
exports.required = ['url'];
exports.optional = ['getBody', 'jar'];

// Define
function getVerification (jar, url, getBody) {
  return function (resolve, reject) {
    var httpOpt = {
      url: url,
      options: {
        jar: jar
      }
    };
    http(httpOpt)
    .then(function (body) {
      var inputs = getVerificationInputs({html: body});
      resolve({
        body: (getBody ? body : null),
        inputs: inputs
      });
    });
  };
}

exports.func = function (args) {
  var jar = args.jar;
  return cache.wrap('Verify', getHash({jar: jar}), getVerification(jar, args.url, args.getBody));
};
