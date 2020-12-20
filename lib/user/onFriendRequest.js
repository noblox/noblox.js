// Dependencies
const events = require('events')

// Includes
const onNotification = require('./onNotification.js').func

// Args
exports.optional = ['jar']

// Docs
/**
 * An event for when a user sends you a friend request.
 * @category User
 * @alias onFriendRequest
 * @returns An EventEmitter that emits when a user sends you a friend request.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.onFriendRequest().on("data", function(data) {
 *  console.log("New friend request!", data)
 * })
**/

// Define
exports.func = function (args) {
  const jar = args.jar
  const onFriendRequest = new events.EventEmitter()
  const notifications = onNotification({ jar: jar })
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
