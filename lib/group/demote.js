// Includes
const changeRank = require('./changeRank.js').func

// Args
exports.required = ['group', 'target']
exports.optional = ['jar']

// Define
exports.func = function (args) {
  args.change = -1
  return changeRank(args)
}
