// Define
module.exports = function(cache,type,index) {
  if (cache[type]) {
    var group = cache[type];
    var cached = group.items[index];
    if (cached && cached.time && Date.now()/1000 - cached.time < group.expire)
      return cached.item;
    else
      return false;
  } else
    return 'Invalid type';
};
