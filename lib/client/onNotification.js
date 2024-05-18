// Dependencies
const signalR = require('@microsoft/signalr')
const events = require('events')

// Includes
const getSession = require('../util/getSession.js').func
const settings = require('../../settings.json')

// Args
exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when you get a notification.
 * @category Client
 * @alias onNotification
 * @returns An EventEmitter that emits when you get a notification.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const notification = noblox.onNotification()
 * notification.on("data", function(data) {
 *  console.log("New notification! ", data)
 * })
 * notification.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
**/

// Define
exports.func = function (args) {
  const max = settings.event.maxRetries
  const notifications = new events.EventEmitter()
  function connect (retries) {
    if (typeof args.jar === 'string') {
      args.jar = { session: args.jar }
    }
    const session = getSession({ jar: args.jar })
    let userNotificationConnection = null;

    userNotificationConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://realtime-signalr.roblox.com/userhub', {
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true,
        headers: {
          Cookie: '.ROBLOSECURITY=' + session + ';'
        }
      })
      .build();

      userNotificationConnection.on('notification', function(name, message) {
        notifications.emit('data', name, JSON.parse(message))
      })

      notifications.on('close', userNotificationConnection.stop)

      userNotificationConnection.disconnected = function (err) {
        notifications.emit('error', new Error('Connection failed: ' + err.message))
        if (retries !== -1) {
          if (retries > max) {
            notifications.emit('close', new Error('Max retries reached'))
          } else {
            setTimeout(connect, 5000, retries + 1)
          }
        }
      }

      userNotificationConnection.error = function (err) {
        notifications.emit('error', err)
      }

      userNotificationConnection.connected = function(connection) {
        notifications.emit('connect', connection)
      }

      userNotificationConnection.reconnecting = function () {
        setTimeout(connect, 5000, 0)
      notifications.emit('error', new Error('Lost connection, reconnecting'))
      return true // Abort reconnection
      }

      userNotificationConnection.start()
  }
  connect(-1)
  return notifications
}
