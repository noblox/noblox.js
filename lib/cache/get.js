// Define
module.exports = function (cache, type, index) {
  if (cache[type]) {
    var group = cache[type];
    var cached = group.items[index];
    if (cached && cached.time) {
      var passed = Date.now() / 1000 - cached.time;
      if (passed > group.expire) {
        return false;
      }
      return [cached.item, (group.refresh && ((group.refresh === true && true) || passed > group.refresh))];
    } else {
      return false;
    }
  } else {
    return 'Invalid type';
  }
};
