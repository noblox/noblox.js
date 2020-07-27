// Includes
const shortPoll = require('../util/shortPoll.js').func
const getAuditLog = require('./getAuditLog.js').func

// Args
exports.required = ['group']
exports.optional = ['jar']

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
                const date = new Date(audit.data[key].created.slice(0, audit.data[key].created.lastIndexOf('.')))
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
              return {
                latest: latest,
                data: given
              }
            }
          }
        })
    },
    delay: 'onAuditLog'
  })
}
