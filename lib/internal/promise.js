// Dependencies
const Promise = require('bluebird')

// Define
module.exports = function (func) {
  return new Promise(func)
}
