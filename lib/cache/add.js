// Define
module.exports = function (cache, type, index, element) {
  if (cache[type]) {
    if (element instanceof Object) {
      element = Object.assign({}, element); // Shallow copy
    }
    cache[type].items[index] = {item: element, time: Date.now() / 1000};
  } else {
    return 'Invalid type';
  }
};
