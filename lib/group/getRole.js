// Dependencies
const entities = require('entities')
const Promise = require('bluebird')

// Includes
const getRoles = require('./getRoles.js').func

// Args
exports.required = ['group', 'roleQuery']
exports.optional = []

// Docs
/**
 * ✅ Get a role in a group.
 * @category Group
 * @alias getRole
 * @param {number | Array<number>} group - The ID of the group or an array of roles to query.
 * @param {number | string} roleQuery - The rank of a role, the name of the role, or roleset ID.
 * @returns {Promise<Role>}
 * @example const noblox = require("noblox.js")
 * const customerRole = await noblox.getRole(1, "Customer")
**/

// Define
function getRole (roles, roleQuery) {
  return new Promise((resolve, reject) => {
    const result = []

    for (let i = 0; i < roles.length; i++) {
      const role = roles[i]
      let find
      if (typeof roleQuery === 'number' && roleQuery <= 255) {
        find = role.rank
      } else if (typeof roleQuery === 'string') {
        find = entities.decodeHTML(role.name)
      } else if (typeof roleQuery === 'number' || roleQuery > 255) {
        find = role.id
      }

      if (roleQuery === find) {
        result.push(role)
      }
    }

    if (result.length === 1) {
      resolve(result[0])
    } else if (result.length > 1) {
      reject(new Error(`There are two or more roles with the rank ${roleQuery}. You must specify the role name.`))
    } else {
      reject(new Error('Role not found with provided query.'))
    }
  })
}

exports.func = function (args) {
  if (typeof args.group === 'number' || typeof args.group === 'string') {
    return getRoles({ group: parseInt(args.group, 10) }).then(function (roles) {
      return getRole(roles, args.roleQuery)
    })
  } else if (typeof args.group === 'object') {
    return getRole(args.group, args.roleQuery)
  } else {
    throw new Error('Please provide a valid group or an array of roles to query.')
  }
}
