// Includes
var http = require('./http.js').func;
var getVerification = require('./getVerification.js').func;
var promise = require('./promise.js');

// Args
exports.required = ['url', 'events'];
exports.optional = ['http', 'ignoreCache', 'getBody', 'jar'];

// Define
function general (jar, url, inputs, events, customOpt, body) {
  return function (resolve, reject) {
    for (var input in events) {
      inputs[input] = events[input];
    }
    var httpOpt = {
      url: url,
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        form: inputs,
        jar: jar
      }
    };
    if (customOpt) {
      if (customOpt.url) {
        delete customOpt.url;
      }
      Object.assign(httpOpt.options, customOpt);
    }
    http(httpOpt).then(function (res) {
      resolve({
        res: res,
        body: body
      });
    });
  };
}

exports.func = function (args) {
  var jar = args.jar;
  var url = args.url;
  var custom = args.http;
  return getVerification({url: custom ? (custom.url || url) : url, jar: jar, ignoreCache: args.ignoreCache, getBody: args.getBody})
  .then(function (response) {
    return promise(general(jar, url, response.inputs, args.events, args.http, response.body));
  });
};
