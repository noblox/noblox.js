// Define
module.exports = function (types) {
  var cache = {}
  for (var i = 0; i < types.length; i++) {
    var type = types[i]
    var expireValue = type.expire
    var permanent = expireValue === true
    var expire = (permanent || expireValue === false ? 0 : expireValue)
    cache[type.name] = {items: {}, expire: expire, refresh: type.refresh, permanent: permanent}
  }
  return cache
}
