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
// Define
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
            var index = list[(i >= required.length ? (i - required.length) : i)];
            if (index instanceof Object) {
              options[index[0]] = arguments[i];
            } else {
              options[index] = arguments[i];
            }
          }
        }
      }
      for (i = 0; i < required.length; i++) {
        var arg = required[i];
        var found = false;
        if (arg instanceof Object) {
          for (var k = 0; k <= arg.length; k++) {
            if (options[arg[k]] != null) {
              found = true;
              break;
            }
          }
        } else if (options[arg] != null) {
          found = true;
        }
        if (!found) {
          throw new Error('Required argument "' + (arg instanceof Object ? arg.join('/') : arg) + '" is missing');
        }
      }
      return wrapFunction(options);
    };
  } else {
    return wrapFunction;
  }
};
