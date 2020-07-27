// Includes
const levelOneCopy = require('../internal/levelOneCopy.js')

// Define
module.exports = function (cache, type, index) {
  if (cache[type]) {
    const group = cache[type]
    const cached = group.items[index]
    if (cached && cached.time) {
      let passed
      if (!group.permanent) {
        passed = Date.now() / 1000 - cached.time
        if (passed > group.expire) {
          return false
        }
      }
      let item = cached.item
      if (item instanceof Object) {
        item = levelOneCopy(item)
      }
      return [item, (group.refresh && ((group.refresh === true && true) || passed > group.refresh))]
    } else {
      return false
    }
  } else {
    return 'Invalid type'
  }
}
