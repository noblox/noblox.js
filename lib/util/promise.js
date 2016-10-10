// Dependencies
var Promise = require('bluebird');

// Includes
var options = require('../options.js');

// Define
module.exports = function (func) {
  return new Promise(func); // .catch(options.errorHandler);
};
