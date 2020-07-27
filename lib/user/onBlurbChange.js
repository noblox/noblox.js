// Includes
const shortPoll = require('../util/shortPoll.js').func
const getBlurb = require('./getBlurb.js').func

// Args
exports.required = ['userId']

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
