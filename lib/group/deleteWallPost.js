// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', ['postId', 'post']]
exports.optional = ['jar']

// Docs
/**
 * 🔐 Delete a wall post.
 * @category Group
 * @alias deleteWallPost
 * @param {number} group - The id of the group.
 * @param {number} postId - The id of the post to delete.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.deleteWallPost(1, 2)
**/

// Define
function deleteWallPost (jar, token, group, postId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//groups.roblox.com/v1/groups/${group}/wall/posts/${postId}`,
      options: {
        method: 'DELETE',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve()
        } else {
          const body = JSON.parse(res.body) || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          }
        }
      }).catch(error => reject(error))
  })
}

exports.func = function (args) {
  const group = args.group
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      if (args.post) {
        return deleteWallPost(jar, xcsrf, group, args.post.id)
      } else {
        return deleteWallPost(jar, xcsrf, group, args.postId)
      }
    })
}
