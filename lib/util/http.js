// Dependencies
var request = require('request-promise').defaults({
  pool: {maxSockets: Infinity},
  //resolveWithFullResponse: true,
  simple: false // Simpler is more complicated!
});

// Includes
var options = require('../options.js');

// Args
exports.args = ['url', 'options'];

// Define
function http (url, opt) {
  if (opt && !opt.jar && Object.keys(opt).indexOf('jar') > -1) {
    opt.jar = options.jar;
  }
  if (options.sessionOnly && opt.jar) {
    if (!opt.headers) {
      opt.headers = {};
    }
    opt.headers.cookie = '.ROBLOSECURITY=' + opt.jar.session + ';';
  }
  if (url.indexOf('http') !== 0) {
    url = 'https:' + url;
  }
  return request(url, opt);
}

exports.func = function (args) {
  var promise = http(args.url, args.options);
  var handler = options.errorHandler;
  if (handler) {
    return promise.catch(options.errorHandler);
  } else {
    return promise;
  }
};
