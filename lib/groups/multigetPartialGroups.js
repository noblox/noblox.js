// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError')

// Args
exports.required = ['groupIds']
exports.optional = []

// Docs
/**
 * ✅ Gets partial info of multiple groups.
 * @category Group
 * @alias multigetPartialGroups
 * @param {number[]} groupIds - Array of group IDs.
 * @returns {Promise<GroupMultigetPartial[]>}
 * @example const noblox = require("noblox.js")
 * const groupsInfo = await noblox.multigetPartialGroups([1,2,3])
**/

exports.func = async function (args) {
  const { groupIds } = args

  if (!Array.isArray(groupIds)) throw TypeError('Group IDs must be an array')

  const response = await http({
    url: `https://groups.roblox.com/v2/groups?groupIds=${groupIds.join(',')}`,
    options: {
      json: true,
      resolveWithFullResponse: true
    }
  })

  if (response.statusCode !== 200) {
    throw new RobloxAPIError(response)
  }

  const { data } = response.body

  for (let i = 0, len = data.length; i < len; i++) {
    data[i].created = new Date(data[i].created)
  }

  return data
}
