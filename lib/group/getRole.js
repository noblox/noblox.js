// Dependencies
const entities = require('entities')
const Promise = require('bluebird')

// Includes
const getRoles = require('./getRoles.js').func

// Args
exports.required = [['group', 'roles'], ['rank', 'name', 'id']]

// Define
function getRole (args) {
  const roles = args.roles
  const rank = args.rank
  const name = args.name
  const id = args.id
  const search = rank || name || id
  const found = {}
  const result = []
  const isObject = search instanceof Object
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i]
    let find
    if (rank) {
      find = role.rank
    } else if (name) {
      find = entities.decodeHTML(role.name)
    } else if (id) {
      find = role.ID
    }
    if (found[find]) {
      throw new Error('There are two or more roles with the rank ' + rank + '. You must specify the role name.')
    }
    const index = isObject ? search.indexOf(find) : 0
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
