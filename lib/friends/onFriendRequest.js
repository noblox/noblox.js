// Dependencies
const events = require('events')

// Includes
const onNotification = require('../client/onNotification.js').func

// Args
exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when a user sends you a friend request.
 * @category User
 * @alias onFriendRequest
 * @returns An EventEmitter that emits when a user sends you a friend request.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 *
 * const friendRequestEvent = noblox.onFriendRequest()
 * friendRequestEvent.on("data", function(data) {
 *  console.log("New friend request! ", data)
 * })
 * friendRequestEvent.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
**/

// Define
exports.func = function (args) {
  const jar = args.jar
  const onFriendRequest = new events.EventEmitter()
  const notifications = onNotification({ jar })

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

  onFriendRequest.close = function () {
    notifications.emit('close', true)
  }

  return onFriendRequest
}
