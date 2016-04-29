// Define
module.exports = function (types) {
  var cache = {};
  for (var i = 0; i < types.length; i++) {
    var type = types[i];
    cache[type.name] = {items: {}, expire: type.expire, refresh: type.refresh};
  }
  return cache;
};
