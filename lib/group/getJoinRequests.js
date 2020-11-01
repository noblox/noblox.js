// Includes
const http = require('../util/http.js').func
const Promise = require('bluebird')

// Args
exports.required = ['group']
exports.optional = ['sortOrder', 'limit', 'cursor', 'jar']

// Docs
/**
 * Get the join requests for a group.
 * @category Group
 * @alias getJoinRequests
 * @param {number} group - The id of the group.
 * @param {string=} sortOrder - The order to sort the requests by.
 * @param {number=} limit - The maximum results per a page.
 * @param {string=} cursor - The cursor for the next page.
 * @returns {Promise<GroupJoinRequestsPage>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * const requests = await noblox.getJoinRequests(1, "Asc")
**/

// Define
function getJoinRequests (jar, group, sortOrder, limit, cursor) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//groups.roblox.com/v1/groups/${group}/join-requests?limit=${limit}&sortOrder=${sortOrder}&cursor=${cursor}`,
      options: {
        method: 'GET',
        jar: jar,
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.body))
        } else {
          const body = JSON.parse(res.body) || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          }
        }
      })
  })
}

exports.func = function (args) {
  const jar = args.jar
  const sortOrder = args.sortOrder || 'Asc'
  const limit = args.limit || (10).toString()
  const cursor = args.cursor || ''
  return getJoinRequests(jar, args.group, sortOrder, limit, cursor)
}
