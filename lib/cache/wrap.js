// Includes
var addIf = require('./addIf.js');
var options = require('../options.js');
var promise = require('../util/promise.js');

// Define
function wrap (type, index, func) {
  var cache = options.cache;
  var group = cache[type];
  if (group.expire > 0 || group.permanent) {
    return promise(function (resolve, reject) {
      addIf(cache, type, index, {
        done: resolve,
        add: function (done) {
          return func().then(done).catch(reject);
        }
      });
    });
  } else {
    return func();
  }
}

module.exports = function (type, index, func) {
  return wrap(type, index, func);
};
