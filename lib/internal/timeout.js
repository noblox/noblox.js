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
  const timeoutPromise = new Promise(function (resolve, reject) {
    setTimeout(function () {
      return reject(new TimeoutError(reason))
    }, timeoutTime)
  })

  return Promise.race([promise, timeoutPromise])
}

module.exports = timeout
