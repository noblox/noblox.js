// Includes
const setRank = require('./setRank.js').func
const getRoles = require('./getRoles.js').func
const getRankNameInGroup = require('./getRankNameInGroup.js').func

// Args
exports.required = ['group', 'target', 'change']
exports.optional = ['jar']

// Docs
/**
 * Change a user's rank.
 * @category Group
 * @alias changeRank
 * @param {number} groupId - The id of the group.
 * @param {number} target - The userId of the target.
 * @param {number} change - The change in rank (1 = one rank higher, -1 = one rank lower)
 * @returns {Promise<ChangeRankResult>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.changeRank(1, 2, -1)
**/

// Define
exports.func = function (args) {
  const group = args.group
  const target = args.target
  const amount = args.change
  const jar = args.jar
  return getRankNameInGroup({ group: group, userId: target })
    .then(function (rank) {
      if (rank === 'Guest') {
        throw new Error('Target user is not in group')
      }
      return getRoles({ group: group })
        .then(function (roles) {
          for (let i = 0; i < roles.length; i++) {
            const role = roles[i]
            const thisRank = role.name

            if (thisRank === rank) {
              const change = i + amount
              const found = roles[change]

              if (!found) {
                throw new Error('Rank change is out of range')
              } else if (found.name === 'Guest' || found.rank === 0) {
                throw new Error('Group members cannot be demoted to guest.')
              }

              return setRank({ group: group, target: target, rank: found.id, jar: jar })
                .then(function () {
                  return { newRole: found, oldRole: role }
                })
            }
          }
        })
    })
}
