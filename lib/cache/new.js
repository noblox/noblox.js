// Define
module.exports = function (types) {
  const cache = {}
  for (let i = 0; i < types.length; i++) {
    const type = types[i]
    const expireValue = type.expire
    const permanent = expireValue === true
    const expire = (permanent || expireValue === false ? 0 : expireValue)
    cache[type.name] = { items: {}, expire, refresh: type.refresh, permanent }
  }
  return cache
}
