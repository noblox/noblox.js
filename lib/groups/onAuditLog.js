// Includes
const shortPoll = require('../util/shortPoll.js').func
const getAuditLog = require('./getAuditLog.js').func

// Args
exports.required = ['group']
exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when an audit log event is added.
 * @category Group
 * @alias onAuditLog
 * @param {number} group - The id of the group.
 * @returns An EventEmitter that emits when an action is added to the audit log.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const auditEvent = noblox.onAuditLog(1)
 * auditEvent.on("data", function(data) {
 *  console.log("New action!", data)
 * })
 * auditEvent.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
**/

// Define
exports.func = function (args) {
  let empty = false
  return shortPoll({
    getLatest: function (latest) {
      return getAuditLog({ group: args.group, jar: args.jar })
        .then(function (audit) {
          const given = []
          if (audit) {
            for (const key in audit.data) {
              if (Object.prototype.hasOwnProperty.call(audit.data, key)) {
                // We need to set milliseconds to 0 because Roblox does this fascinating thing
                // Where they vary the ms value on each request, for an existing action.
                const date = audit.data[key].created
                date.setMilliseconds(0)

                if (date > latest) {
                  latest = date
                  given.push(audit.data[key])
                }
                empty = false
              } else if (!empty) {
                const date = new Date()
                given.push({ audit: '', author: { name: '', id: '-1' }, date: date })
                latest = date
                empty = true
              }
            }
            return {
              latest: latest,
              data: given
            }
          }
        })
    },
    delay: 'onAuditLog'
  })
}
