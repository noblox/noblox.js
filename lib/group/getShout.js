// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group']
exports.optional = []

// Define
function getShout (group, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        let responseData = JSON.parse(res.body)
        if (res.statusCode === 400) {
          reject(new Error('The group is invalid or does not exist.'))
        }
        if (responseData.shout === null) {
          reject(new Error('You do not have permissions to view the shout for the group.'))
        } else {
          resolve(responseData.shout)
        }
      })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  let jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return getShout(args.group, args.jar, xcsrf)
    })
}
