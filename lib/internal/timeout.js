class TimeoutError extends Error {
}

/**
 * A basic replacement for the Bluebird 'timeout' method. Returns a Promise which will resolve or reject with the result of the given
 * promise once it resolves, or reject if the promise should fail to resolve within the supplied timeout. An optional reason
 * can also be supplied.
 * @param promise - The Promise to apply a timeout to.
 * @param timeoutTime - The timeout to apply to the Promise.
 * @param reason - Optional String reason for the timeout.
 * @returns {Promise<unknown>}
 */
function timeout (promise, timeoutTime, reason = 'operation timed out') {
  return new Promise(function (resolve, reject) {
    let hasGivenResult = false

    const timer = setTimeout(function () {
      hasGivenResult = true
      return reject(new TimeoutError(reason))
    }, timeoutTime)

    // It is possible to abstract out the duplicate code here, but the result is an abomination which is harder to read -
    // meaning it's best to leave this as-is.
    promise.then(function (v) {
      clearTimeout(timer)

      if (!hasGivenResult) {
        hasGivenResult = true
        return resolve(v)
      }
    })

    promise.catch(function (error) {
      clearTimeout(timer)

      if (!hasGivenResult) {
        hasGivenResult = true
        return reject(error)
      }
    })
  })
}

module.exports = timeout
