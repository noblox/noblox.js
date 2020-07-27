// Dependencies
const events = require('events')

// Includes
const settings = require('../../settings.json')

// Args
exports.required = ['getLatest', 'delay']
exports.optional = ['timeout']

// Define
exports.func = function (args) {
  const latest = args.getLatest
  let delay = args.delay
  delay = typeof delay === 'string' || delay instanceof String ? settings.event[delay] : delay
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
