// Includes
const add = require('./add.js')
const get = require('./get.js')

// Define
module.exports = function (cache, type, index, callbacks) {
  const got = get(cache, type, index)
  const item = got[0]
  const refresh = got[1]
  if (item != null) {
    callbacks.done(item)
    if (refresh) {
      const group = cache[type]
      group.refresh = false
      callbacks.add(function (element) {
        group.refresh = true
        add(cache, type, index, element)
      })
    }
  } else {
    callbacks.add(function (element) {
      add(cache, type, index, element)
      callbacks.done(element)
    })
  }
}
