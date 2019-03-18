// Dependencies
var parser = require('cheerio')

// Includes
var generalRequest = require('../util/generalRequest.js').func

// Args
exports.required = ['group', 'message']
exports.optional = ['verify', 'jar']

// Define
exports.func = function (args) {
  var jar = args.jar
  var group = args.group
  var message = args.message
  var verify = args.verify
  var events = {
    ctl00$cphRoblox$GroupWallPane$NewPost: message,
    ctl00$cphRoblox$GroupWallPane$NewPostButton: 'Post'
  }
  return generalRequest({ jar: jar, url: '//www.roblox.com/My/Groups.aspx?gid=' + group, events: events, ignoreCache: verify, getBody: verify })
    .then(function (result) {
      if (result.res.statusCode !== 200) {
        throw new Error('Wall post failed, verify login, permissions, and message')
      }
      var original = verify && parser.load(result.body)
      var $ = parser.load(result.res.body)
      var link = '#ctl00_cphRoblox_GroupWallPane_GroupWall_ctrl0_AbuseReportButton_ReportAbuseTextHyperLink'
      var oldMessage = verify && original(link)
      var newMessage = $(link)
      if (newMessage.length === 0 || (verify && oldMessage && oldMessage.length > 0 && oldMessage.attr('href') === newMessage.attr('href'))) {
        throw new Error('Wall post did not appear, make sure you are not being rate limited for posting too much')
      }
      return parseInt(newMessage.attr('href').match(/groupwallpost\?id=(\d+)/)[1], 10)
    })
}
