// Includes
var http = require('./http.js').func;
var getVerification = require('./getVerification.js').func;
var promise = require('./promise.js');

// Args
exports.required = ['url', 'events'];
exports.optional = ['customOpt', 'getBody', 'jar'];

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
  return getVerification({url: url, jar: jar, getBody: args.getBody})
  .then(function (response) {
    return promise(general(jar, url, response.inputs, args.events, args.http, response.body));
  });
};
