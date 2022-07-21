// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['placeId']
exports.optional = ['jar']


// Define
function getGameRevenue (placeId, jar, token) {
    return new Promise((resolve, reject) => {
        const httpOpt = {
          url: `//develop.roblox.com/v1/places/${placeId}/stats/Revenue?granularity=Monthly`,
          options: {
            method: 'GET',
            jar: jar,
            headers: {
                'X-CSRF-TOKEN': token
            },
            resolveWithFullResponse: true
          }
        }
        return http(httpOpt)
            .then(function (res) {
                if (res.statusCode === 200) resolve(JSON.parse(res.body))
                else if (res.statusCode === 401) reject(new Error('You are not logged in.'))
                else if (res.statusCode === 403) reject(new Error('You do not have permission to view this game.'))
                else reject(new Error('An unknown error occurred.'))
            })
            .catch(function (err) { console.error(err); reject(err) })
    }   // end of promise  
    ) // end of return
}

exports.func = function (args) {
    const jar = args.jar
    return getGeneralToken({ jar: jar })
      .then(function (xcsrf) {
        return getGameRevenue(args.placeId, jar, xcsrf)
      })
  }