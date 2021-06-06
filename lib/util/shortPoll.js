// Dependencies
const events = require('events')

// Includes
const settings = require('../options').settings

// Args
exports.required = ['getLatest', 'delay']
exports.optional = ['timeout']

// Docs
/**
 * @typedef {function} getLatest
 * @param {number} latest - A value representing the latest version.
 * @param {EventEmitter} event - The event emitter to emit to.
*/

/**
 * This is the base for events that do not rely on true streams. The `getLatest` function receives some value that represents the latest version of something (eg. a date or unique ID) and determines if there is new information, every time it is fired it waits `delay` ms before being fired again. Every time it must return an object with the field `latest`, representing the latest value (which will not change if new information was not received), and an array `data` which has the new values (if there are multiple they each have their own index, if there is only one then it is by itself in the array). If `latest` is equal to -2, the returned data will be processed even if it is the initial run (which usually only establishes the latest value). If the return object has a true `repeat` value, the function latest will be run again immediately after. If `delay` is a string it will take the number from that string key in the `event` object of the settings.json file.
 * When the function is first called it will initialize `getLatest` with the value -1 and then emit the `connect` event. Whenever data is received, it will emit the `data` event for each value. If the `close` event is emitted the function will no longer run. If an error occurs the `error` event will be emitted, the function will log a retry and after the number of max retries as specified by settings, it will emit the `close` event.
 * The `getLatest` function will be marked as failed if it does not resolve within `timeout` ms (which can be disabled if timeout is negative). If getLatest fails for any reason (including timeout) it will be retried `maxRetries` times before stopping.
 * @category Utility
 * @alias shortPoll
 * @param {function} getLatest - The function to use to get the latest.
 * @returns {Promise<GetLatestResponse>}
**/

// Define
exports.func = function (args) {
  const latest = args.getLatest
  let delay = args.delay
  delay = (typeof delay === 'string' || delay instanceof String ? settings.event[delay] : delay) || settings.event.defaultDelay
  let retries = 0
  const max = settings.event.maxRetries
  const timeout = args.timeout || settings.event.timeout
  let stop = false
  let current
  const evt = new events.EventEmitter()
  const run = function (value) {
    if (stop) {
      return
    }
    let promise = latest(value, evt)
    if (timeout > 0) {
      promise = promise.timeout(timeout)
    }
    return promise.then(function (response) {
      if (stop) {
        return
      }
      if (value === -1) {
        current = response.latest
      }
      retries = 0
      const data = response.data
      if (data.length > 0 && (value !== -1 || current === -2)) {
        current = response.latest
        for (let i = 0; i < data.length; i++) {
          evt.emit('data', data[i])
        }
      }
      if (response.repeat) {
        run(current)
      } else {
        setTimeout(run, delay, current)
      }
      return response
    })
      .catch(function (err) {
        if (stop) {
          return
        }
        evt.emit('error', err)
        retries++
        if (retries > max) {
          evt.emit('close', new Error('Max retries reached'))
        } else {
          setTimeout(run, delay, current)
        }
      })
  }

  run(-1)
    .then(function (response) {
      if (stop) {
        return
      }
      evt.emit('connect', response.latest)
    })
    .catch(function (err) {
      evt.emit('close', new Error('Initialization failed: ' + err.message))
    })
  evt.on('close', function (err) {
    stop = true
    if (err) {
      evt.emit('error', err)
    }
  })
  return evt
}
