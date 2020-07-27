// Includes
const http = require('../util/http.js').func
const getCurrentUser = require('../util/getCurrentUser').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group']
exports.optional = []

// Define
function leaveGroup (group, jar, xcsrf, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/users/${userId}`,
      options: {
        method: 'DELETE',
        resolveWithFullResponse: true,
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        } else {
          resolve()
        }
      }).catch(error => reject(error))
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(async function (xcsrf) {
      const currentUser = await getCurrentUser({ jar: jar })
      return leaveGroup(args.group, args.jar, xcsrf, currentUser.UserID)
    })
}
