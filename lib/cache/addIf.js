// Includes
var add = require('./add.js');
var get = require('./get.js');

// Define
module.exports = function(cache,type,index,callbacks,refresh) {
  var got = get(cache,type,index);
  if (got) {
    callbacks.done(got);
    if (refresh)
      callbacks.add(function(element) {
        add(cache,type,index,element);
      });
  } else
    callbacks.add(function(element) {
      add(cache,type,index,element);
      callbacks.done(element);
    });
};
