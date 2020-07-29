// Includes
const settings = require('../../settings.json')

// Args
exports.required = ['jar']

// Define
exports.func = function (args) {
  const jar = args.jar
  if (settings.session_only) {
    jar.session = ''
  } else {
    const cookies = jar._jar.store.idx['roblox.com']
    if (cookies) {
      const cookie = cookies['/']
      if (cookie && cookie['.ROBLOSECURITY']) {
        delete cookies['/']['.ROBLOSECURITY']
      }
    }
  }
}
