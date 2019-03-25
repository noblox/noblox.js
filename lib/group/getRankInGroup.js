// Includes
var http = require('../util/http.js').func
var cache = require('../cache')

// Args
exports.required = ['group', 'userId']

// Define
function getRankInGroup (groupId, userId) {
  return http({ url: `//api.roblox.com/users/${userId}/groups` }).then((body) => {
    const bodyObject = JSON.parse(body)
    const groupObject = bodyObject.filter((group) => groupId === group.Id) || {}

    return groupObject[0] ? parseInt(groupObject[0].Rank) : 0
  })
}

exports.func = function (args) {
  var id = args.userId
  return cache.wrap('Rank', id, function () {
    return getRankInGroup(args.group, id)
  })
}
