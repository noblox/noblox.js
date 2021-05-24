// Includes
const shortPoll = require('../util/shortPoll.js').func
const getBlurb = require('./getBlurb.js').func

// Args
exports.required = ['userId']

// Docs
/**
 * ✅ An event for when a user's blurb changes.
 * @category User
 * @alias onBlurbChange
 * @param {number} userId - The id of the user.
 * @returns An EventEmitter that emits when a user's blurb changes.
 * @example const noblox = require("noblox.js")
 * noblox.onBlurbChange().on("data", function(data) {
 *  console.log("User's blurb changed!", data)
 * })
**/

// Define
exports.func = function (args) {
  return shortPoll({
    getLatest: function (latest) {
      return getBlurb({ userId: args.userId })
        .then(function (blurb) {
          const given = []
          if (blurb !== latest) {
            latest = blurb
            given.push(blurb)
          }

          return {
            latest: latest,
            data: given
          }
        })
    },
    delay: 'onBlurbChange'
  })
}
