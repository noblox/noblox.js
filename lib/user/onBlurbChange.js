// Includes
var shortPoll = require('../util/shortPoll.js').func
var getBlurb = require('./getBlurb.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Define
exports.func = function (args) {
  return shortPoll({
    getLatest: function (latest) {
      return getBlurb({ userId: args.userId })
        .then(function (blurb) {
          var given = []
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
