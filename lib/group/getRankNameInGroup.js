// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['group', 'userId']

// Define
function getRankNameInGroup (groupId, userId) {
  if (typeof groupId === 'string') {
    if (!isNaN(groupId)) {
      // It's a number in a string
      groupId = parseInt(groupId, 10)
    } else {
      throw new Error('Group id should be a number')
    }
  }
  return http({ url: `//api.roblox.com/users/${userId}/groups` }).then((body) => {
    try {
      const bodyObject = JSON.parse(body)
      const groupObject = bodyObject.filter((group) => groupId === group.Id) || {}

      return groupObject[0] ? groupObject[0].Role : 'Guest';
    } catch(error) {
      return new Error("You've provided wrong userId");
    }
  })
}

exports.func = function (args) {
  const id = args.userId
  return cache.wrap('Rank', id + 'Name', function () {
    return getRankNameInGroup(args.group, id)
  })
}
