// Includes
var settings = require('../../settings.json')
var options = require('../options.js')

// Args
exports.optional = ['jar']

// Define
exports.func = function (args) {
  var jar = args.jar || options.jar
  if (settings.session_only) {
    return jar.session
  } else {
    var cookies = jar.getCookies('https://roblox.com')
    for (var i = 0; i < cookies.length; i++) {
      var element = cookies[i]
      if (element.key === '.ROBLOSECURITY') {
        return element.value
      }
    }
    return ''
  }
}
