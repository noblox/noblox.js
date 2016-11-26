// Includes
var levelOneCopy = require('../util/levelOneCopy.js');

// Define
module.exports = function (cache, type, index, element) {
  if (cache[type]) {
    if (element instanceof Object) {
      element = levelOneCopy(element);
    }
    cache[type].items[index] = {item: element, time: Date.now() / 1000};
  } else {
    return 'Invalid type';
  }
};
