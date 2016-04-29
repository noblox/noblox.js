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

exports.wrapExport = function (wrapFunction, argumentList) {
  if (argumentList.length > 0) {
    return function () {
      var options = {};
      if (arguments.length > 0) {
        if (typeof arguments[0] === 'object') {
          options = arguments[0];
        } else {
          for (var i = 0; i <= arguments.length; i++) {
            options[argumentList[i]] = arguments[i];
          }
        }
      }
      return wrapFunction(options);
    };
  } else {
    return wrapFunction;
  }
};
