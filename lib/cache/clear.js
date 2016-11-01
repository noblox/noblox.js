// Define
module.exports = function (cache, type, index) {
  if (cache[type]) {
    cache[type].items[index].time = null;
  } else {
    return 'Invalid type';
  }
};
