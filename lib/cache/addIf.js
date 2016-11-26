// Includes
var add = require('./add.js');
var get = require('./get.js');

// Define
module.exports = function (cache, type, index, callbacks) {
  var got = get(cache, type, index);
  var item = got[0];
  var refresh = got[1];
  if (item) {
    callbacks.done(item);
    if (refresh) {
      var group = cache[type];
      group.refresh = false;
      callbacks.add(function (element) {
        group.refresh = true;
        add(cache, type, index, element);
      });
    }
  } else {
    callbacks.add(function (element) {
      add(cache, type, index, element);
      callbacks.done(element);
    });
  }
};
