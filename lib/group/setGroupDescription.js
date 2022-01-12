// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group']
exports.optional = ['description', 'jar']

// Docs
/**
 * 🔐 Update a group description
 * @category Group
 * @alias setGroupDescription
 * @param {number} group - The id of the group.
 * @param {string=} [description=""] - The new description for the group
 * @returns {Promise<GroupDescriptionResult>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.setGroupDescription(1, "Group Description!")
 **/

function changeGroupDesc (group, description = '', jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/description`,
      options: {
        method: 'PATCH',
        resolveWithFullResponse: true,
        json: {
          description
        },
        jar: jar,
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
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return changeGroupDesc(args.group, args.description, args.jar, xcsrf)
    })
}
