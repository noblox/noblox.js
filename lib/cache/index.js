// Includes
var newCache = require('./new.js');
var add = require('./add.js');
var addIf = require('./addIf.js');
var get = require('./get.js');
var clear = require('./clear.js');
var wrap = require('./wrap.js');

// Define
module.exports = {
  new: newCache,
  add: add,
  clear: clear,
  addIf: addIf,
  get: get,
  wrap: wrap
};
