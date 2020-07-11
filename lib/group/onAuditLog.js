// Includes
var shortPoll = require('../util/shortPoll.js').func
var getAuditLog = require('./getAuditLog.js').func

// Args
exports.required = ['group']
exports.optional = ['jar']

// Define
exports.func = function (args) {
  var empty = false
  return shortPoll({
    getLatest: function (latest) {
      return getAuditLog({ group: args.group, jar: args.jar })
        .then(function (audit) {
          var given = []
          if (audit) {
            for (var key in audit.data) {
              if (audit.data.hasOwnProperty(key)) {
              
                var date = new Date(audit.data[key].created)
                if (date > latest) {
                  latest = date
                  given.push(audit.data[key])
                }
                empty = false
              } else if (!empty) {
                date = new Date()
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
