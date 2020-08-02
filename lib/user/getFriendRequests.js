// Includes
const http = require('../util/http.js').func
const Promise = require('bluebird')

// Args
exports.required = []
exports.optional = ['sortOrder', 'limit', 'cursor', 'jar']

// Define
function getFriendsRequests (args) {
  return new Promise((resolve, reject) => {
    const jar = args.jar
    const httpOpt = {
      url: '//friends.roblox.com/v1/my/friends/requests',
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

exports.func = getFriendsRequests
