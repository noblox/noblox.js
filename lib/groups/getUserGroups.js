// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId']
exports.optional = []

// Docs
/**
 * ✅ Get the groups of a user.
 * @category User
 * @alias getUserGroups
 * @param {number} userId - The id of the user.
 * @returns {Promise<GroupMemberInfo[]>}
 * @example const noblox = require("noblox.js")
 * let groups = await noblox.getGroups(123456)
**/

// Define
exports.func = async function (args) {
  const { userId } = args

  const response = await http({
    url: `https://groups.roblox.com/v2/users/${userId}/groups/roles?includeLocked=true`,
    options: {
      json: true,
      resolveWithFullResponse: true
    }
  })

  if (response.statusCode !== 200) {
    throw new RobloxAPIError(response)
  }

  return response.body.data
}
