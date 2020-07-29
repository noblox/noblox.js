/*
const args = ['jar', 'username', 'password']

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
  const reqLength = required.length
  if ((reqLength + optional.length) > 0) {
    return function () {
      let options = {}
      const length = arguments.length
      let assume = false
      if (length > 0) {
        const first = arguments[0]
        let collectOptions = true
        if (length === 1 && (first instanceof Object)) {
          assume = true
          const firstArg = required[0] || optional
          if (firstArg && firstArg instanceof Object) {
            for (let i = 0; i < firstArg.length; i++) {
              if (first[firstArg[i]]) {
                options = first
                collectOptions = false
                break
              }
            }
          } else if (firstArg && first[firstArg]) {
            options = first
            collectOptions = false
          }
        }
        if (collectOptions) {
          for (let i = 0; i <= length; i++) {
            const list = (i >= reqLength ? optional : required)
            const index = list[(i >= reqLength ? (i - reqLength) : i)]
            if (index instanceof Object) {
              options[index[0]] = arguments[i]
            } else {
              options[index] = arguments[i]
            }
          }
        }
      }
      for (let i = 0; i < reqLength; i++) {
        const arg = required[i]
        let found = false
        if (arg instanceof Object) {
          for (let k = 0; k <= arg.length; k++) {
            if (options[arg[k]] != null) {
              found = true
              break
            }
          }
        } else if (options[arg] != null) {
          found = true
        }
        if (!found) {
          if (assume) {
            throw new Error('A required argument is missing')
          } else {
            throw new Error('Required argument "' + (arg instanceof Object ? arg.join('/') : arg) + '" is missing')
          }
        }
      }
      return wrapFunction(options)
    }
  } else {
    return wrapFunction
  }
}
