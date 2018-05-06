// Dependencies
var parser = require('cheerio')

// Includes
var http = require('../util/http.js').func

// Args
exports.required = ['group']

// Define
function getLogo (group) {
  var httpOpt = {
    url: '//www.roblox.com/groups/group.aspx?gid=' + group
  }
  return http(httpOpt)
    .then(function (body) {
      var $ = parser.load(body)
      var logo = $('#ctl00_cphRoblox_GroupDescriptionEmblem').find('img').attr('src')
      if (!logo) throw new Error('Not found')
      return logo
    })
}

exports.func = function (args) {
  return getLogo(args.group)
}
