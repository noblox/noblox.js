// Includes
const http = require('../util/http.js').func

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
      constructRequest(`//www.roblox.com/users/profile/profileheader-json?userid=${userId}`)
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
        const displayName = userBody.displayName

        resolve({
          username: username,
          joinDate: joinDate,
          blurb: blurb,
          isBanned: isBanned,
          displayName: displayName
        })
      } else if (failedResponse) {
        reject(new Error('User does not exist.'))
      } else {
        const joinDate = new Date(userBody.created)
        const blurb = userBody.description
        const isBanned = userBody.isBanned
        const username = userBody.name
        const displayName = userBody.displayName
        const {
          UserStatus: status,
          FriendsCount: friendCount,
          FollowersCount: followerCount,
          FollowingsCount: followingCount,
          PreviousUserNames: oldNamesString
        } = responses[1].body
        const oldNames = oldNamesString.split('\r\n') || []
        const currentTime = new Date()
        const age = Math.round(Math.abs((joinDate.getTime() - currentTime.getTime()) / (24 * 60 * 60 * 1000)))

        resolve({
          username,
          displayName,
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
