// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['placeId']
exports.optional = ['startIndex', 'jar']

function getGameInstances (jar, placeId, startIndex) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//www.roblox.com/games/getgameinstancesjson?placeId=${placeId}&startindex=${startIndex}`,
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
          const body = res.body || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          } else {
            reject(new Error(`${res.statusCode} ${(res.statusCode === 403 ? "You don't have permission to view this page." : 'An error has occured')}`))
          }
        }
      })
  })
}

// Define
exports.func = function (args) {
  const startIndex = Number(args.startIndex) || 0
  return getGameInstances(args.jar, args.placeId, startIndex)
}
