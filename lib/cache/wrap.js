// Includes
var addIf = require('./addIf.js');
var options = require('../options.js');
var promise = require('../util/promise.js');

// Define
function wrap (type, index, func) {
  var cache = options.cache;
  if (cache[type].expire > 0) {
    return promise(function (resolve, reject) {
      addIf(cache, type, index, {
        done: resolve,
        add: function (done) {
          return promise(func).then(done);
        }
      });
    });
  } else {
    return promise(func);
  }
}

module.exports = function (type, index, func) {
  return wrap(type, index, func);
};
