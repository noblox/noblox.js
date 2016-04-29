// Dependencies
var Promise = require('bluebird');

// Includes
var options = require('../options.js');

module.exports = function (func) {
  return new Promise(func).catch(options.errorHandler);
};
