//Define

module.exports.getSession = function(jar) {
  var cookies = jar.getCookies('http://www.roblox.com');
  for (var key in cookies) {
    if (cookies.hasOwnProperty(key) && cookies[key].key == '.ROBLOSECURITY')
      return cookies[key].value;
  }
};
