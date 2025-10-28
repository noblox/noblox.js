// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId']
exports.optional = []

// Docs
/**
 * ✅Gets the specified user's primary group.
 * @category User
 * @alias getPrimaryGroup
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Group>}
 * @example const noblox = require("noblox.js")
 * const primaryGroup = await noblox.getPrimaryGroup(1)
**/

// Define
exports.func = async function (args) {
  const { userId } = args

  const response = await http({
    url: `https://groups.roblox.com/v1/users/${userId}/groups/primary/role`,
    options: {
      json: true,
      resolveWithFullResponse: true
    }
  })

  if (response.statusCode !== 200) {
    throw new RobloxAPIError(response)
  }

  return response
}
