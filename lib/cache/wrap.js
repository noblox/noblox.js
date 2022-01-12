// Includes
const addIf = require('./addIf.js')
const options = require('../options.js')

// Define
function wrap (type, index, func) {
  const cache = options.cache
  const group = cache[type]
  if (group.expire > 0 || group.permanent) {
    return new Promise(function (resolve, reject) {
      addIf(cache, type, index, {
        done: resolve,
        add: function (done) {
          return func().then(done).catch(reject)
        }
      })
    })
  } else {
    return func()
  }
}

module.exports = function (type, index, func) {
  return wrap(type, index, func)
}
