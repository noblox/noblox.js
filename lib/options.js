// Includes
const settings = require('../settings.json')
const jar = require('./util/jar.js').func
const newCache = require('./cache/new.js')

// Define
exports.init = function () {
  exports.jar = jar()

  const cacheList = []
  const cache = settings.cache
  for (const name of Object.keys(cache)) {
    const item = cache[name]
    const cacheObj = {
      name: name,
      refresh: item.refresh,
      expire: item.expire
    }
    cacheList.push(cacheObj)
  }
  exports.cache = newCache(cacheList)

  exports.queue = settings.queue
}

exports.init()
