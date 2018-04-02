// Includes
var settings = require('../settings.json')
var jar = require('./util/jar.js').func
var newCache = require('./cache/new.js')

// Define
exports.init = function () {
  exports.jar = jar()

  var cacheList = []
  var cache = settings.cache
  for (var name in cache) {
    var item = cache[name]
    var cacheObj = {
      name: name,
      refresh: item['refresh'],
      expire: item['expire']
    }
    cacheList.push(cacheObj)
  }
  exports.cache = newCache(cacheList)

  var queue = settings.queue

  exports.queue = queue
}

exports.init()
