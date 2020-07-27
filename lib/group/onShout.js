// Includes
const shortPoll = require('../util/shortPoll.js').func
const getShout = require('./getShout.js').func

// Args
exports.required = ['group']
exports.optional = ['jar']

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
