// Includes
const changeRank = require('./changeRank.js').func

// Args
exports.required = ['group', 'userId']
exports.optional = ['jar']

// Docs
/**
 * Demote a user.
 * @category Group
 * @alias demote
 * @param {number} group - The id of the group.
 * @param {number} userId - The userId of the user being demoted.
 * @returns {Promise<ChangeRankResult>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.demote(1, 2)
**/

// Define
exports.func = function (args) {
  args.change = -1
  return changeRank(args)
}
