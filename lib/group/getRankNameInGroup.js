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
  return http({ url: `//groups.roblox.com/v2/users/${userId}/groups/roles`, options: { json: true } }).then((body) => {
    const error = body.errors && body.errors[0]

    if (error) {
      if (error.message === 'NotFound') {
        throw new Error('An invalid UserID or GroupID was provided.')
      } else {
        throw new Error(error.message)
      }
    }

    const groupObject = body.data.find((info) => groupId === info.group.id) 

    return groupObject ? groupObject.role.name : 'Guest'
  })
}

exports.func = function (args) {
  const id = args.userId
  return cache.wrap('Rank', id + 'Name', function () {
    return getRankNameInGroup(args.group, id)
  })
}
