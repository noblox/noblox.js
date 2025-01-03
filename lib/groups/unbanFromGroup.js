// Includes
const http = require('../util/http.js')
const getGeneralToken = require('../util/getGeneralToken.js')
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['groupId', 'userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Unbans a user from the specified group.
 * @alias unbanFromGroup
 * @param {number} groupId - The ID of the group
 * @param {number} userId - The ID of the target user
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Log in
 * await noblox.unbanFromGroup(1, 2)
**/

// Define
exports.func = async function (args) {
  const { groupId, jar, userId } = args
  const token = await getGeneralToken({ jar })

  const response = await http({
    url: `//groups.roblox.com/v1/groups/${groupId}/bans/${userId}`,
    options: {
      method: 'DELETE',
      jar,
      headers: {
        'x-csrf-token': token
      }
    }
  })

  if (response.statusCode !== 200) {
    throw new RobloxAPIError(response)
  }
}
