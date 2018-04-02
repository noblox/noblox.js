// Dependencies
var parser = require('cheerio')

// Includes
var http = require('../util/http.js').func
var getDate = require('../util/getDate.js').func

// Args
exports.required = ['group']
exports.optoinal = ['jar']

// Define
exports.func = function (args) {
  var httpOpt = {
    url: '//www.roblox.com/groups/' + args.group + '/joinrequests-html',
    options: {
      jar: args.jar,
      followRedirect: false,
      resolveWithFullResponse: true
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200 && res.body !== '') {
        var requests = []
        var $ = parser.load(res.body)
        var found = $('#JoinRequestsList').find('tr')
        var len = found.length
        if (len === 1) {
          return false
        }
        for (var i = 1; i < len - 1; i++) {
          var data = found.eq(i).find('td')
          requests.push({
            username: data.eq(1).text(),
            date: getDate({time: data.eq(2).text(), timezone: 'CT'}),
            requestId: parseInt(data.eq(3).find('span').attr('data-rbx-join-request'), 10)
          })
        }
        return requests
      } else {
        throw new Error('Group admin page load failed, make sure the user is in the group and is allowed to handle join requests')
      }
    })
}
