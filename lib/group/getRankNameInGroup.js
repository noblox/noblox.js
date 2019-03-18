// Includes
var http = require('../util/http.js').func
var cache = require('../cache')

// Args
exports.required = ['group', 'userId']

// Define
function getRankNameInGroup (groupId, userId) {
  return http({ url: `//api.roblox.com/users/${userId}/groups`}).then((body) => {
    const bodyObject = JSON.parse(body)
    const groupObject = bodyObject.filter((group) => groupId === group.Id) || {}
    
    return groupObject[0] ? groupObject[0].Role : "Guest"
  })
}

exports.func = function (args) {
  var id = args.userId
  return cache.wrap('Rank', id + 'Name', function () {
    return getRankNameInGroup(args.group, id)
  })
}
