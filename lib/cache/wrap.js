// Includes
var addIf = require('./addIf.js');
var options = require('../options.js');
var promise = require('../util/promise.js');

// Define
function wrap (type, index, func) {
  return function (resolve, reject) {
    addIf(options.cache, type, index, {
      done: resolve,
      add: function (done) {
        return promise(func).then(done);
      }
    });
  };
}

module.exports = function (type, index, func) {
  return promise(wrap(type, index, func));
};
