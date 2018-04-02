// Includes
var generalRequest = require('../util/generalRequest.js').func

// Args
exports.required = ['group']
exports.optional = ['message', 'jar']

// Define
exports.func = function (args) {
  var jar = args.jar
  var group = args.group
  var message = args.message || ''
  var events = {
    ctl00$cphRoblox$GroupStatusPane$StatusTextBox: message,
    ctl00$cphRoblox$GroupStatusPane$StatusSubmitButton: 'Group Shout'
  }
  return generalRequest({jar: jar, url: '//www.roblox.com/My/Groups.aspx?gid=' + group, events: events})
    .then(function (result) {
      if (result.res.statusCode !== 200) {
        throw new Error('Shout failed, verify login, permissions, and message')
      }
    })
}
