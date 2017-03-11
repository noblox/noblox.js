// Includes
var http = require('./http.js').func;
var options = require('../options.js');
var settings = require('../../settings.json');
var clearSession = require('./clearSession.js').func;

// Args
exports.required = ['username', 'password'];
exports.optional = ['jar'];

// Define
exports.func = function (args) {
  var jar = args.jar || options.jar;
  var username = args.username;
  var password = args.password;

  clearSession({jar: jar});
  var url = '//api.roblox.com/login/v1';
  var post = {
    'username': username,
    'password': password
  };
  var httpOpt = {
    url: url,
    options: {
      method: 'POST',
      json: post,
      resolveWithFullResponse: true,
      jar: jar
    }
  };
  return http(httpOpt)
  .then(function (res) {
    var body = res.body;
    if (res.statusCode === 200) {
      if (settings.session_only) {
        var cookies = res.headers['set-cookie']; // If the user is already logged in a new cookie will not be returned.
        if (cookies) {
          var session = cookies.toString().match(/\.ROBLOSECURITY=(.*?);/)[1];
          jar.session = session;
        }
      }
      return body;
    } else {
      throw new Error(body.message);
    }
  });
};
