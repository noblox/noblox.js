// Define
module.exports = function (types) {
  var cache = {};
  for (var i = 0; i < types.length; i++) {
    var type = types[i];
    var expireValue = type.expire;
    var expire = (expireValue === false ? 0 : expireValue);
    cache[type.name] = {items: {}, expire: expire, refresh: type.refresh, permanent: expire === false};
  }
  return cache;
};
