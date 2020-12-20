// Includes
const generalRequest = require('../util/generalRequest.js').func

// Args
exports.required = ['group']
exports.optional = ['useCache', 'jar']

// Docs
/**
 * Join a group.
 * @deprecated
 * @category Group
 * @alias joinGroup
 * @param {number} group - The id of the group.
 * @param {boolean=} useCache - If the function should use the cache in its requests.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.joinGroup(1)
**/

// Define
exports.func = function (args) {
  const events = {
    __EVENTTARGET: 'JoinGroupDiv',
    __EVENTARGUMENT: 'Click'
  }
  return generalRequest({ url: '//www.roblox.com/Groups/Group.aspx?gid=' + args.group, jar: args.jar, events: events, ignoreCache: !args.useCache })
    .then(function (result) {
      if (result.res.statusCode !== 200) {
        throw new Error('Failed to join group, verify that you have enough group space')
      }
    })
}
