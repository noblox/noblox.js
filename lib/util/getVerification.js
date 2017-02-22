// Dependencies
var url = require('url');

// Includes
var http = require('./http.js').func;
var getHash = require('./getHash.js').func;
var getVerificationInputs = require('./getVerificationInputs.js').func;
var cache = require('../cache');

// Args
exports.required = ['url'];
exports.optional = ['ignoreCache', 'getBody', 'jar'];

// Define
function getVerification (jar, url, getBody) {
  var httpOpt = {
    url: url,
    options: {
      jar: jar
    }
  };
  return http(httpOpt)
  .then(function (body) {
    var inputs = getVerificationInputs({html: body});
    return {
      body: (getBody ? body : null),
      inputs: inputs
    };
  });
}

exports.func = function (args) {
  var jar = args.jar;
  if (args.ignoreCache) {
    return getVerification(jar, args.url, args.getBody);
  } else {
    return cache.wrap('Verify', url.parse(args.url).pathname + getHash({jar: jar}), function () {
      return getVerification(jar, args.url, args.getBody);
    });
  }
};
