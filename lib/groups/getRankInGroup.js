// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['group', 'userId']

// Docs
/**
 * ✅ Get the user's rank in the group.
 * @category Group
 * @alias getRankInGroup
 * @param {number} group - The id of the group.
 * @param {number} userId - The id of the user.
 * @returns {Promise<number>}
 * @example const noblox = require("noblox.js")
 * const rankId = await noblox.getRankInGroup(1, 1)
**/

// Define
function getRankInGroup (groupId, userId) {
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

    return groupObject ? parseInt(groupObject.role.rank) : 0
  })
}

exports.func = function (args) {
  const id = args.userId
  return cache.wrap('Rank', id, function () {
    return getRankInGroup(args.group, id)
  })
}
