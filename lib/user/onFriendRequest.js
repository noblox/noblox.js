// Dependencies
var events = require('events')

// Includes
var onNotification = require('./onNotification.js').func

// Args
exports.optional = ['jar']

// Define
exports.func = function (args) {
  var jar = args.jar
  var onFriendRequest = new events.EventEmitter()
  var notifications = onNotification({jar: jar})
  notifications.on('data', function (name, message) {
    if (name === 'FriendshipNotifications' && message.Type === 'FriendshipRequested') {
      onFriendRequest.emit('data', message.EventArgs.UserId1)
    }
  })
  notifications.on('error', function (err) {
    onFriendRequest.emit('error', err)
  })
  notifications.on('connect', function () {
    onFriendRequest.emit('connect')
  })
  notifications.on('close', function (internal) {
    if (internal) {
      return
    }
    onFriendRequest.emit('close', true)
  })
  onFriendRequest.on('close', function (internal) {
    if (internal) {
      return
    }
    notifications.emit('close', true)
  })
  return onFriendRequest
}
