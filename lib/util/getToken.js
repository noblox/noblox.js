// This utility is for retrieving a general XCSRF token for APIs that do not return it on failure.
// It simply contacts a different API which does return the correct XCSRF token on failure and uses that one.

// Includes
var http = require('./http.js').func;
var cache = require('../cache');

// Args
exports.required = ['url', 'form'];
exports.optional = ['json', 'jar'];

// Define
function getToken (jar, url, form, json) {
  return function (resolve, reject) {
    var httpOpt = {
      url: url,
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        jar: jar
      }
    };
    if (json) {
      httpOpt.options.json = form;
    } else {
      httpOpt.options.form = form;
    }
    http(httpOpt)
    .then(function (res) {
      var xcsrf = res.headers['x-csrf-token'];
      if (xcsrf) {
        resolve(xcsrf);
      } else {
        reject(new Error('Did not receive X-CSRF-TOKEN, verify that you are logged in and that your request was valid'));
      }
    });
  };
}

exports.func = function (args) {
  return cache.wrap('XCSRF', 'general', getToken(args.jar, args.url, args.form, args.json || false));
};
