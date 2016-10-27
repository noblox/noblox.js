// Includes
var settings = require('../../settings.json');

// Args
exports.required = ['jar'];

// Define
exports.func = function (args) {
  var jar = args.jar;
  if (settings.session_only) {
    return jar.session;
  } else {
    var cookies = jar.getCookies('https://www.roblox.com');
    for (var key in cookies) {
      if (cookies.hasOwnProperty(key) && cookies[key].key === '.ROBLOSECURITY') {
        return cookies[key].value;
      }
    }
  }
};
