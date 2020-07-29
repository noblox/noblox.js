// Includes
const setRank = require('./setRank.js').func
const getRoles = require('./getRoles.js').func
const getRankNameInGroup = require('./getRankNameInGroup.js').func

// Args
exports.required = ['group', 'target', 'change']
exports.optional = ['jar']

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
              }
              return setRank({ group: group, target: target, roleset: found.ID, jar: jar })
                .then(function () {
                  return { newRole: found, oldRole: role }
                })
            }
          }
        })
    })
}
