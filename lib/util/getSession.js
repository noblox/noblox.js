// Includes
const settings = require('../../settings.json')
const options = require('../options.js')

// Args
exports.optional = ['jar']

// Define
exports.func = function (args) {
  const jar = args.jar || options.jar
  if (settings.session_only) {
    return jar.session
  } else {
    const cookies = jar.getCookies('https://roblox.com')
    for (let i = 0; i < cookies.length; i++) {
      const element = cookies[i]
      if (element.key === '.ROBLOSECURITY') {
        return element.value
      }
    }
    return ''
  }
}
