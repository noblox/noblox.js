// Dependencies
var SignalR = require('signalr-client').client
var events = require('events')

// Includes
var getSession = require('../util/getSession.js').func
var settings = require('../../settings.json')

// Args
exports.optional = ['jar']

// Define
exports.func = function (args) {
  var max = settings.event.maxRetries
  var notifications = new events.EventEmitter()
  function connect (retries) {
    var session = getSession({ jar: args.jar })
    var client = new SignalR('wss://realtime.roblox.com/notifications', ['usernotificationhub'], 3, true) // wss for https
    client.headers.Cookie = '.ROBLOSECURITY=' + session + ';'
    client.on('usernotificationhub', 'notification', function (name, message) {
      notifications.emit('data', name, JSON.parse(message))
    })
    notifications.on('close', client.end)
    client.serviceHandlers.connectFailed = function (err) {
      notifications.emit('error', new Error('Connection failed: ' + err.message))
      if (retries !== -1) {
        if (retries > max) {
          notifications.emit('close', new Error('Max retries reached'))
        } else {
          setTimeout(connect, 5000, retries + 1)
        }
      }
    }
    client.serviceHandlers.onerror = function (err) {
      notifications.emit('error', err)
    }
    client.serviceHandlers.connected = function (connection) {
      notifications.emit('connect', connection)
    }
    client.serviceHandlers.reconnecting = function () {
      setTimeout(connect, 5000, 0)
      notifications.emit('error', new Error('Lost connection, reconnecting'))
      return true // Abort reconnection
    }
    client.start()
  }
  connect(-1)
  return notifications
}
