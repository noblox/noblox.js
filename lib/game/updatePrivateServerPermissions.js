// Includes
const http = require('../util/http').func
const getGeneralToken = require('../util/getGeneralToken').func

// Args
exports.required = ['privateServerId', 'permissionOptions']
exports.optional = ['jar']

// Implementation Comment
/**
 * The permissionOptions, "clanAllowed" and "enemyClanId", are documented in the Roblox API,
 * but currently serve no function, thus they have been omitted from noblox.js's documentation.
 */

// Docs
/**
 * 🔐 Update access settings to a private server (formerly VIP servers)
 * @category Game
 * @alias updatePrivateServerPermissions
 * @param {number} privateServerId - the id of the private server instance
 * @param {boolean} permissionOptions.friendsAllowed - allow all friends to join the private server
 * @param {number | Array<number>} permissionOptions.usersToAdd - the userId or array of userId to add to the private server; subject to a target's privacy settings
 * @param {number | Array<number>} permissionOptions.usersToRemove - the userId or array of userId to remove from the private server
 * @returns {Promise<PrivateServerPermissionsResponse>}
**/

// Define
const updatePrivateServerPermissions = async (privateServerId, permissionOptions, jar, token) => {
  return http({
    url: `//games.roblox.com/v1/vip-servers/${privateServerId}/permissions`,
    options: {
      method: 'PATCH',
      jar,
      headers: {
        'X-CSRF-Token': token
      },
      json: permissionOptions,
      resolveWithFullResponse: true
    }
  }).then(({ body, statusCode }) => {
    const { errors } = body
    if (statusCode === 200) {
      return body
    } else if (errors) {
      throw new Error(`[${statusCode}] ${errors[0].message} | privateServerId: ${privateServerId}, permissionOptions: ${JSON.stringify(permissionOptions)}`)
    } else {
      throw new Error(`An unknown error occurred with getResaleData() | [${statusCode}] privateServerId: ${privateServerId}, permissionOptions: ${JSON.stringify(permissionOptions)}`)
    }
  })
}

exports.func = function ({ privateServerId, permissionOptions, jar }) {
  if (typeof permissionOptions.usersToAdd === 'number') {
    permissionOptions.usersToAdd = [permissionOptions.usersToAdd]
  }

  if (typeof permissionOptions.usersToRemove === 'number') {
    permissionOptions.usersToRemove = [permissionOptions.usersToRemove]
  }

  if (!(typeof permissionOptions === 'object')) {
    throw new TypeError('permissionOptions was not an object: https://noblox.js.org/global.html#updatePrivateServerPermissions')
  }

  return getGeneralToken({ jar: jar }).then((token) => {
    return updatePrivateServerPermissions(privateServerId, permissionOptions, jar, token)
  })
}
