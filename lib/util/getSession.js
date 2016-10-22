// Args
exports.required = ['jar'];

// Define
exports.func = function (args) {
  var cookies = args.jar.getCookies('https://www.roblox.com');
  for (var key in cookies) {
    if (cookies.hasOwnProperty(key) && cookies[key].key === '.ROBLOSECURITY') {
      return cookies[key].value;
    }
  }
};
