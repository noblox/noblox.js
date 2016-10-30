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
  var reqLength = required.length;
  if ((reqLength + optional.length) > 0) {
    return function () {
      var options = {};
      var length = arguments.length;
      var assume = false;
      if (length > 0) {
        var first = arguments[0];
        var collectOptions = true;
        if (length === 1 && (first instanceof Object)) {
          assume = true;
          var requiredArg = required[0];
          if (requiredArg && requiredArg instanceof Object) {
            for (var i = 0; i < requiredArg.length; i++) {
              if (first[requiredArg[i]]) {
                options = first;
                collectOptions = false;
                break;
              }
            }
          } else if (requiredArg && first[requiredArg]) {
            options = first;
            collectOptions = false;
          }
        }
        if (collectOptions) {
          for (i = 0; i <= length; i++) {
            var list = (i >= reqLength ? optional : required);
            var index = list[(i >= reqLength ? (i - reqLength) : i)];
            if (index instanceof Object) {
              options[index[0]] = arguments[i];
            } else {
              options[index] = arguments[i];
            }
          }
        }
      }
      for (i = 0; i < reqLength; i++) {
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
          if (assume) {
            throw new Error('A required argument is missing');
          } else {
            throw new Error('Required argument "' + (arg instanceof Object ? arg.join('/') : arg) + '" is missing');
          }
        }
      }
      return wrapFunction(options);
    };
  } else {
    return wrapFunction;
  }
};
