// Dependencies
var url = require('url');

// Includes
var http = require('./http.js').func;
var getHash = require('./getHash.js').func;
var getVerificationInputs = require('./getVerificationInputs.js').func;
var cache = require('../cache');
var promise = require('./promise.js');

// Args
exports.required = ['url'];
exports.optional = ['ignoreCache', 'getBody', 'jar'];

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
  var func = getVerification(jar, args.url, args.getBody);
  if (args.ignoreCache) {
    return promise(func);
  } else {
    return cache.wrap('Verify', url.parse(args.url).pathname + getHash({jar: jar}), func);
  }
};
