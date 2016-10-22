/*
var args = ['jar', 'username', 'password']

raw function login (jar, username, password)

exported function login ()
  check number of arguments if necessary
    options object: login(arguments[0])
    individual arguments:
      for each argument add to an options array corresponding with argument order
      login(options)
*/
// Includes
var options = require('../options.js');

// Define
var defaults = {
  'jar': options.jar
};

function appendDefaults (opt, argumentList) {
  for (var index in defaults) {
    if (!opt[index] && argumentList.indexOf(index) > -1) {
      opt[index] = defaults[index];
    }
  }
  return opt;
}

exports.wrapExport = function (wrapFunction, required, optional) {
  if ((required.length + optional.length) > 0) {
    return function () {
      var options = {};
      if (arguments.length > 0) {
        var first = arguments[0];
        if (arguments.length === 1 && ((optional.length + required.length) !== 1) || (first instanceof Object && (required[0] ? first[required[0]] : first[optional[0]]))) {
          options = first;
        } else {
          for (var i = 0; i <= arguments.length; i++) {
            var list = (i >= required.length ? optional : required);
            options[list[i]] = arguments[i];
          }
        }
      }
      for (i = 0; i < required.length; i++) {
        var arg = required[i];
        if (!options[arg]) {
          throw new Error('Required argument "' + arg + '" is missing');
        }
      }
      return wrapFunction(options);
    };
  } else {
    return wrapFunction;
  }
};
