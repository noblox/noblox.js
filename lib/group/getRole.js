// Dependencies
var entities = require('entities')
var Promise = require('bluebird')

// Includes
var getRoles = require('./getRoles.js').func

// Args
exports.required = [['group', 'roles'], ['rank', 'name', 'id']]

// Define
function getRole (args) {
  var roles = args.roles
  var rank = args.rank
  var name = args.name
  var id = args.id
  var search = rank || name || id
  var found = {}
  var result = []
  var isObject = search instanceof Object
  for (var i = 0; i < roles.length; i++) {
    var role = roles[i]
    var find
    if (rank) {
      find = role.rank
    } else if (name) {
      find = entities.decodeHTML(role.name)
    } else if (id) {
      find = role.id
    }
    if (found[find]) {
      throw new Error('There are two or more roles with the rank ' + rank + '. You must specify the role name.')
    }
    var index = isObject ? search.indexOf(find) : 0
    if (isObject ? index > -1 : search === find) {
      found[find] = true
      result[index] = role
    }
  }
  return isObject ? result : (result[0] || false)
}

exports.func = function (args) {
  if (args.roles) {
    return Promise.resolve(getRole(args))
  } else {
    return getRoles({ group: args.group })
      .then(function (roles) {
        args.roles = roles
        return getRole(args)
      })
  }
}
