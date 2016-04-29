// Dependencies
var http = require('./http.js').func;
var getVerificationInputs = require('./getVerificationInputs.js').func;
var cache = require('../cache');

// Args
exports.args = ['url', 'jar'];

// Define
function getVerification (jar, url) {
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
      resolve(inputs);
    });
  };
}

exports.func = function (args) {
  return cache.wrap('Verify', 'shout', getVerification(args.jar, args.url));
};
