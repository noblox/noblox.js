// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userIds']
exports.optional = []

// Docs
/**
 * 🔓 Get the presence status of users; game data visibility is dependent on the privacy settings of the target user
 *
 * **Note**: This method used to return an object with key 'userPresences', but now returns an array of presences.
 * To preserve backwards compatibility, this array has a key "userPresences", which is a self-reference.
 * Do not use this key for new work. It **will** be removed in the next semver Major change.
 * This key appears in Array.toString, but does not affect iteration.
 * @category Presence
 * @alias getPresences
 * @param {Array<number>} userIds - An array of userIds.
 * @returns {Promise<UserPresence[]>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const presences = await noblox.getPresences([1, 2, 3])
**/

// Define
exports.func = function getPresences ({ userIds, jar }) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//presence.roblox.com/v1/presence/users',
      options: {
        method: 'POST',
        resolveWithFullResponse: true,
        jar: jar,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds
        })
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
          const d = responseData.userPresences;
          // Slightly hacky, but preserves backwards compatibility while allowing
          // us to return an array - which makes more sense.
          // Does not affect iteration but does appear in console.log.
          d.userPresences = d;
          resolve(d)
        }
      })
      .catch(error => reject(error))
  })
}
