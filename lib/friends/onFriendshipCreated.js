// Dependencies
const events = require('events')

// Includes
const onNotification = require('../client/onNotification.js').func

// Args
exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when a user accepts a friend request.
 * @category User
 * @alias onFriendshipCreated
 * @returns An EventEmitter that emits when a user accepts a friend request.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 *
 * const friendshipCreatedEvent = noblox.onFriendshipCreated()
 * friendshipCreatedEvent.on("data", function(data) {
 *  console.log("New friendship created! ", data)
 * })
 * friendshipCreatedEvent.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
**/

// Define
exports.func = function (args) {
  const jar = args.jar
  const onFriendshipCreated = new events.EventEmitter()
  const notifications = onNotification({ jar })
  notifications.on('data', function (name, message) {
    if (name === 'FriendshipNotifications' && message.Type === 'FriendshipCreated') {
      onFriendshipCreated.emit('data', message.EventArgs)
    }
  })
  notifications.on('error', function (err) {
    onFriendshipCreated.emit('error', err)
  })
  notifications.on('connect', function () {
    onFriendshipCreated.emit('connect')
  })
  notifications.on('close', function (internal) {
    if (internal) {
      return
    }
    onFriendshipCreated.emit('close', true)
  })
  onFriendshipCreated.on('close', function (internal) {
    if (internal) {
      return
    }
    notifications.emit('close', true)
  })
  return onFriendshipCreated
}
