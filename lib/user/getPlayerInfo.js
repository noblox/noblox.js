// Includes
const http = require('../util/http.js').func
const parser = require('cheerio')

// Args
exports.required = ['userId']

// Docs
/**
 * Get a user's information.
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
      http({
        url: '//www.roblox.com/users/' + userId + '/profile',
        options: {
          resolveWithFullResponse: true,
          followRedirect: false
        }
      }),
      http({
        url: '//users.roblox.com/v1/users/' + userId,
        options: {
          resolveWithFullResponse: true,
          followRedirect: false,
          json: true
        }
      })
    ]

    Promise.all(requests).then(function (responses) {
      const profileResponse = responses[0]
      const usersResponse = responses[1]

      if (profileResponse.statusCode === 200 && usersResponse.statusCode === 200) {
        const body = parser.load(profileResponse.body)
        const userBody = usersResponse.body

        const status = body('div[data-statustext]').attr('data-statustext')
        const pastnames = body('.tooltip-pastnames').attr('title')
        const friendcount = body('div[data-statustext]').attr('data-friendscount')
        const followercount = body('div[data-statustext]').attr('data-followerscount')
        const followingcount = body('div[data-statustext]').attr('data-followingscount')
        const joinDate = new Date(userBody.created)
        const blurb = userBody.description
        const isBanned = userBody.isBanned
        const username = userBody.name

        const currentTime = new Date()
        const playerAge = Math.round(Math.abs((joinDate.getTime() - currentTime.getTime()) / (24 * 60 * 60 * 1000)))

        resolve({
          username: username,
          status: status,
          blurb: blurb,
          joinDate: joinDate,
          age: playerAge,
          friendCount: parseInt(friendcount, 10),
          followerCount: parseInt(followercount, 10),
          followingCount: parseInt(followingcount, 10),
          oldNames: pastnames ? pastnames.split(', ') : [],
          isBanned: isBanned
        })
      } else {
        reject(new Error('User does not exist'))
      }
    })
  })
}

exports.func = (args) => {
  return getPlayerInfo(args.userId)
}
