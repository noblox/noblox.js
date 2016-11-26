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
    var cookies = jar.getCookies('https://roblox.com');
    for (var i = 0; i < cookies.length; i++) {
      var element = cookies[i];
      if (element.key === '.ROBLOSECURITY') {
        return element.value;
      }
    }
    return '';
  }
};
