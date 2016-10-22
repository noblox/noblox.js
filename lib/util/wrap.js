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
        if (arguments.length === 1 && (first instanceof Object && (required[0] ? first[required[0]] : true))) { // This checks if the argument is an options object. Sometimes a function only has one argument and it happens to be an object: if this function has required arguments it can check if they exist (if they don't it will error either way) but otherwise there is no way of knowing and it will assume the object is for options
          options = first;
        } else {
          for (var i = 0; i <= arguments.length; i++) {
            var list = (i >= required.length ? optional : required);
            options[list[(i >= required.length ? (i - required.length) : i)]] = arguments[i];
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
