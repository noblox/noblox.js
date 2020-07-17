const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const getCurrentUser = require('../util/getCurrentUser.js').func

exports.required = []
exports.optional = ['transactionType', 'limit', 'cursor', 'jar']

function getTransactions (userId, transactionType, limit, cursor, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `https://economy.roblox.com/v1/users/${userId}/transactions?limit=${limit}&transactionType=${transactionType}&cursor=${cursor}`,
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
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        } else {
          resolve(responseData)
        }
      })
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  const transactionType = args.transactionType || 'Sale'
  const limit = args.limit || 100
  const cursor = args.cursor || ''
  return getGeneralToken({ jar: jar })
    .then(async function (xcsrf) {
      const currentUser = await getCurrentUser({ jar: jar })
      return getTransactions(currentUser.UserID, transactionType, limit, cursor, xcsrf)
    })
}
