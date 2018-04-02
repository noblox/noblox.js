// Includes
var setRank = require('./setRank.js').func
var getRoles = require('./getRoles.js').func
var getRankNameInGroup = require('./getRankNameInGroup.js').func

// Args
exports.required = ['group', 'target', 'change']
exports.optional = ['jar']

// Define
exports.func = function (args) {
  var group = args.group
  var target = args.target
  var amount = args.change
  var jar = args.jar
  return getRankNameInGroup({group: group, userId: target})
    .then(function (rank) {
      if (rank === 'Guest') {
        throw new Error('Target user is not in group')
      }
      return getRoles({group: group})
        .then(function (roles) {
          for (var i = 0; i < roles.length; i++) {
            var role = roles[i]
            var thisRank = role.Name
            if (thisRank === rank) {
              var change = i + amount
              var found = roles[change]
              if (!found) {
                throw new Error('Rank change is out of range')
              }
              return setRank({group: group, target: target, roleset: found.ID, jar: jar})
                .then(function () {
                  return {newRole: found, oldRole: role}
                })
            }
          }
        })
    })
}
