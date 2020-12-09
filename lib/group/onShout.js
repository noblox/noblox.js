// Includes
const shortPoll = require('../util/shortPoll.js').func
const getShout = require('./getShout.js').func

// Args
exports.required = ['group']
exports.optional = ['jar']

// Docs
/**
 * An event for when the shout is changed.
 * @category Group
 * @alias onShout
 * @param {number} group - The id of the group.
 * @returns An EventEmitter that emits when someone shouts.
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * noblox.onShout(1).on("data", function(data) {
 *  console.log("New shout!", data)
 * })
**/

// Define
exports.func = function (args) {
  let empty = false
  return shortPoll({
    getLatest: function (latest) {
      return getShout({ group: args.group, jar: args.jar })
        .then(function (shout) {
          const given = []
          if (shout) {
            const date = new Date(shout.updated.slice(0, shout.updated.lastIndexOf('.')))
            if (date > latest) {
              latest = date
              given.push(shout)
            }
            empty = false
          } else if (!empty) {
            const date = new Date()
            given.push({ message: '', author: { name: '', id: '-1' }, date: date })
            latest = date
            empty = true
          }
          return {
            latest: latest,
            data: given
          }
        })
    },
    delay: 'onShout'
  })
}
