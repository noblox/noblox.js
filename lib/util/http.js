// Dependencies
var request = require('request-promise');

// Includes
var options = require('../options.js');
var settings = require('../../settings.json');
var cache = require('../cache');
var getHash = require('./getHash.js').func;

// Args
exports.required = ['url'];
exports.optional = ['options', 'ignoreLoginError'];

// Define
request = request.defaults({
  forever: true,
  agentOptions: {
    maxSockets: Infinity
  },
  simple: false,
  gzip: true,
  timeout: settings.timeout
});

function http (url, opt) {
  if (opt && !opt.jar && Object.keys(opt).indexOf('jar') > -1) {
    opt.jar = options.jar;
  }
  if (settings.session_only && opt && opt.jar) {
    if (!opt.headers) {
      opt.headers = {};
    }
    opt.headers.cookie = '.ROBLOSECURITY=' + opt.jar.session + ';';
    opt.jar = null;
  }
  if (opt && opt.verification) {
    if (!opt.headers) {
      opt.headers = {};
    }
    var verify = '__RequestVerificationToken=' + opt.verification + ';';
    if (opt.headers.cookie) {
      opt.headers.cookie += verify;
    } else {
      opt.headers.cookie = verify;
    }
  }
  if (url.indexOf('http') !== 0) {
    url = 'https:' + url;
  }
  return request(url, opt);
}

exports.func = function (args) {
  var opt = args.options || {};
  var jar = opt.jar;
  var depth = args.depth || 0;
  var full = opt.resolveWithFullResponse || false;
  opt.resolveWithFullResponse = true;
  var follow = opt.followRedirect === undefined || opt.followRedirect;
  opt.followRedirect = function (res) {
    if (!args.ignoreLoginError && res.headers.location && (res.headers.location.startsWith('https://www.roblox.com/newlogin') || res.headers.location.startsWith('/Login/Default.aspx'))) {
      return false;
    }
    return follow;
  };
  return http(args.url, opt).then(function (res) {
    if (opt && opt.headers && opt.headers['X-CSRF-TOKEN']) {
      if (res.statusCode === 403 && res.statusMessage === 'XSRF Token Validation Failed') {
        depth++;
        if (depth >= 3) {
          throw new Error('Tried ' + depth + ' times and could not refresh XCSRF token successfully');
        }
        var token = res.headers['x-csrf-token'];
        if (token) {
          opt.headers['X-CSRF-TOKEN'] = token;
          opt.jar = jar;
          args.depth = depth + 1;
          return exports.func(args);
        } else {
          throw new Error('Could not refresh X-CSRF-TOKEN');
        }
      } else {
        if (depth > 0) {
          cache.add(options.cache, 'XCSRF', getHash({jar: jar}), opt.headers['X-CSRF-TOKEN']);
        }
      }
    }
    if (res.statusCode === 302 && !args.ignoreLoginError && res.headers.location && (res.headers.location.startsWith('https://www.roblox.com/newlogin') || res.headers.location.startsWith('/Login/Default.aspx'))) {
      throw new Error('You are not logged in');
    }
    return full ? res : res.body;
  });
};
