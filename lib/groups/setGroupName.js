// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'name']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Update a group name. This method will trigger a Robux charge to your account, and can only be performed by the group
 * owner.
 * @category Group
 * @alias setGroupName
 * @param {number} group - The id of the group.
 * @param {string=} name - The new name for the group
 * @returns {Promise<GroupNameResult>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.setGroupName(1, "Cool group")
 **/

function changeGroupName (group, name, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/name`,
      options: {
        method: 'PATCH',
        resolveWithFullResponse: true,
        json: {
          name
        },
        jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(res.body)
        } else {
          const body = res.body || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          } else {
            reject(new Error(`${res.statusCode} ${res.body}`))
          }
        }
      })
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return changeGroupName(args.group, args.name, args.jar, xcsrf)
    })
}
