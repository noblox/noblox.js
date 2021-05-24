// Includes
const http = require('../util/http.js').func
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['userId']

// Docs
/**
 * ✅ Get a user's information.
 * @category User
 * @alias getPlayerInfo
 * @param {number} userId - The id of the user.
 * @returns {Promise<PlayerInfo>}
 * @example const noblox = require("noblox.js")
 * let information = await noblox.getPlayerInfo({userId: 123456})
**/

// Define
function getPlayerInfo (userId) {
  return new Promise((resolve, reject) => {
    const requests = [
      constructRequest(`//users.roblox.com/v1/users/${userId}`),
      constructRequest(`//users.roblox.com/v1/users/${userId}/status`),
      constructRequest(`//friends.roblox.com/v1/users/${userId}/friends/count`),
      constructRequest(`//friends.roblox.com/v1/users/${userId}/followings/count`),
      constructRequest(`//friends.roblox.com/v1/users/${userId}/followers/count`),
      getPageResults({ url: `//users.roblox.com/v1/users/${userId}/username-history`, query: {}, limit: 1000 })
    ].map(promise => promise.then(
      val => ({ status: 'fulfilled', value: val }),
      rej => ({ status: 'rejected', reason: rej })
    ))

    Promise.all(requests).then((promiseResponses) => {
      const responses = promiseResponses.map(response => response.value)
      const usersResponse = responses[0]
      const userBody = usersResponse ? usersResponse.body : {}
      const failedResponse = promiseResponses.find(presponse => presponse.status === 'rejected') || responses.find(response => !response || (!(response instanceof Array) && (response.statusCode !== 200 || !response.body)))

      if (userBody.isBanned) {
        const joinDate = new Date(userBody.created)
        const blurb = userBody.description
        const isBanned = userBody.isBanned
        const username = userBody.name

        resolve({
          username: username,
          joinDate: joinDate,
          blurb: blurb,
          isBanned: isBanned
        })
      } else if (failedResponse) {
        reject(new Error('User does not exist.'))
      } else {
        const responseBodies = responses.map(res => res.body)
        const status = responseBodies[1].status
        const oldNames = responses[5].map(nameObject => nameObject.name) || []
        const friendCount = responseBodies[2].count
        const followerCount = responseBodies[4].count
        const followingCount = responseBodies[3].count
        const joinDate = new Date(userBody.created)
        const blurb = userBody.description
        const isBanned = userBody.isBanned
        const username = userBody.name

        const currentTime = new Date()
        const age = Math.round(Math.abs((joinDate.getTime() - currentTime.getTime()) / (24 * 60 * 60 * 1000)))

        resolve({
          username,
          status,
          blurb,
          joinDate,
          age,
          friendCount,
          followerCount,
          followingCount,
          oldNames,
          isBanned
        })
      }
    })
  })
}

function constructRequest (url) {
  return http({
    url: url,
    options: {
      resolveWithFullResponse: true,
      followRedirect: false,
      json: true
    }
  })
}

exports.func = (args) => {
  return getPlayerInfo(args.userId)
}
