// Includes
var settings = require('../../settings.json');

// Args
exports.required = ['jar'];

// Define
exports.func = function (args) {
  var jar = args.jar;
  if (settings.session_only) {
    jar.session = '';
  } else {
    var cookies = jar._jar.store.idx['roblox.com'];
    if (cookies) {
      var cookie = cookies['/'];
      if (cookie && cookie['.ROBLOSECURITY']) {
        delete cookies['/']['.ROBLOSECURITY'];
      }
    }
  }
};
