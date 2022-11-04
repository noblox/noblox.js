// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['description']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Sets the authenticated users' status.
 * @category User
 * @alias setStatus
 * @param {string} description - The new description for the authenticated user.
 * @returns {Promise<SetDescriptionResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * await noblox.setStatus("Hello! This is my new status!")
 **/

// Define
function setDescription (jar, token, description) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//accountinformation.roblox.com/v1/description`,
      options: {
        method: 'POST',
        jar: jar,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
          'description': description
        }),
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

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return setDescription(jar, xcsrf, args.description)
    })
}
