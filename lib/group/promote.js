// Includes
const changeRank = require('./changeRank.js').func

// Args
exports.required = ['group', 'target']
exports.optional = ['jar']

// Docs
/**
 * Promote a user.
 * @category Group
 * @alias promote
 * @param {number} group - The id of the group.
 * @param {number} target - The id of the user.
 * @returns {Promise<ChangeRankResult>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.promote(1, 2)
**/

// Define
exports.func = function (args) {
  args.change = 1
  return changeRank(args)
}
