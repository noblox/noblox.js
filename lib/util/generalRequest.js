// Includes
var http = require('./util/http.js').func;
var getVerification = require('./util/getVerification.js').func;
var promise = require('./util/promise.js');

// Args
exports.args = ['jar', 'url', 'events', 'getBody'];

function general (jar, url, inputs, events, body) {
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
    return {
      res: http(httpOpt),
      body: body
    };
  };
}

exports.func = function (args) {
  var jar = args.jar;
  var url = args.url;
  return getVerification({url: url, jar: jar, getBody: args.getBody})
  .then(function (response) {
    return promise(general(jar, url, response.inputs, response.body));
  });
};
