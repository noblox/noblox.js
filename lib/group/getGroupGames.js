// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['groupId']
exports.optional = ['accessFilter', 'sortOrder', 'limit', 'cursor']

// Docs
/**
 * Get a group's games.
 * @category Group
 * @alias getGroupGames
 * @param {number} groupId - The id of the group.
 * @param {("All" | "Public" | "Private")} accessFilter - Filtering games via access level.
 * @param {("Asc" | "Desc")} sortOrder - The order results are sorted in.
 * @param {Limit=} limit - The maximum results per a page.
 * @param {string=} cursor - The cursor for the next page.
 * @returns {Promise<GroupGames[]>} - GroupGames name will be changed probably
 * @example const noblox = require("noblox.js")
 * const groupGames = await noblox.getGroupGames(1, 'All', 'Asc', '100')
**/

// Define
function getGroupGames (groupId, accessFilter, sortOrder, limit, cursor) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//games.roblox.com/v2/groups/${groupId}/games?accessFilter=${accessFilter}&sortOrder=${sortOrder}&limit=${limit}&cursor=${cursor}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true
      }
    }
    console.warn(httpOpt);
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
          } else {
            reject(new Error(`${res.statusCode} ${res.body}`))
          }
        }
      })
  })
}

exports.func = function (args) {
  const accessFilter = args.accessFilter || 'All'
  const sortOrder = args.sortOrder || 'Asc'
  const limit = args.limit || 100
  const cursor = args.cursor || ''
  return getGroupGames(args.groupId, accessFilter, sortOrder, limit, cursor)
}