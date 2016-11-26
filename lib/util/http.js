// Dependencies
var request = require('request-promise').defaults({
  pool: {maxSockets: Infinity},
  simple: false
});

// Includes
var options = require('../options.js');
var settings = require('../../settings.json');
var cache = require('../cache');
var getHash = require('./getHash.js').func;

// Args
exports.required = ['url'];
exports.optional = ['options'];

// Define
function http (url, opt) {
  if (opt && !opt.jar && Object.keys(opt).indexOf('jar') > -1) {
    opt.jar = options.jar;
  }
  if (settings.session_only && opt && opt.jar) {
    if (!opt.headers) {
      opt.headers = {};
    }
    opt.headers.cookie = '.ROBLOSECURITY=' + opt.jar.session + ';';
  }
  if (url.indexOf('http') !== 0) {
    url = 'https:' + url;
  }
  return request(url, opt)
  .catch(function (err) {
    console.error('Http error: ' + err.stack);
  });
}

exports.func = function (args) {
  var opt = args.options;
  var depth = args.depth || 0;
  if (opt && opt.headers && opt.headers['X-CSRF-TOKEN']) {
    var full = opt.resolveWithFullResponse || false;
    opt.resolveWithFullResponse = true;
    return http(args.url, opt).then(function (res) {
      if (res.statusCode === 403 && res.statusMessage === 'XSRF Token Validation Failed') {
        depth++;
        if (depth >= 3) {
          throw new Error('Tried ' + depth + ' times and could not refresh XCSRF token successfully');
        }
        var token = res.headers['x-csrf-token'];
        if (token) {
          opt.headers['X-CSRF-TOKEN'] = token;
          args.depth = depth + 1;
          return exports.func(args);
        } else {
          throw new Error('Could not refresh X-CSRF-TOKEN, make sure you are still logged in');
        }
      } else {
        if (depth > 0) {
          cache.add(options.cache, 'XCSRF', getHash({jar: opt.jar}), opt.headers['X-CSRF-TOKEN']);
        }
        return full ? res : res.body;
      }
    });
  } else {
    return http(args.url, opt);
  }
};
