// Dependencies
var request = require('request-promise').defaults({
  simple: false // Simpler is more complicated!
});

// Includes
var options = require('../options.js');

// Args
exports.args = ['url', 'options'];

// Define
function http (url, opt) {
  if (opt && !opt.jar && Object.keys(opt).indexOf('jar') > -1) {
    opt.jar = options.jar;
  }
  return request(url, opt);
}

exports.func = function (args) {
  return http(args.url, args.options).catch(options.errorHandler);
};
