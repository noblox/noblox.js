// Includes
var http = require('../util/http.js').func

// Args
exports.required = ['group']

// Define
function getLogo (group) {
  var httpOpt = {
    url: '//api.roblox.com/groups/' + group
  }
  return http(httpOpt)
    .then(function (group) {
      group = JSON.parse(group)
      if (!group) throw new Error('Not found')
      var logo = group.EmblemUrl
      return logo
    })
}

exports.func = function (args) {
  return getLogo(args.group)
}
