// Dependencies
var events = require('events')

// Includes
var settings = require('../../settings.json')

// Args
exports.required = ['getLatest', 'delay']
exports.optional = ['timeout']

// Define
exports.func = function (args) {
  var latest = args.getLatest
  var delay = args.delay
  delay = typeof delay === 'string' || delay instanceof String ? settings.event[delay] : delay
  var retries = 0
  var max = settings.event.maxRetries
  var timeout = args.timeout || settings.event.timeout
  var stop = false
  var current
  var evt = new events.EventEmitter()
  var run

  run = function (value) {
    if (stop) {
      return
    }
    var promise = latest(value, evt)
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
      var data = response.data
      if (data.length > 0 && (value !== -1 || current === -2)) {
        current = response.latest
        for (var i = 0; i < data.length; i++) {
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
