const events = require('events')

const onNotification = require('../user/onNotification.js').func

exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when a party leaves a game.
 * @category Party
 * @alias onPartyLeftGame
 * @returns An EventEmitter that emits when a party leaves a game.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const partyLeftGame = noblox.onPartyLeftGame()
 * partyLeftGame.on("data", function(data) {
 *  console.log("Party left game! ", data)
 * })
 * partyLeftGame.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
**/

exports.func = (args) => {
  const jar = args.jar
  const newEvent = new events.EventEmitter()
  const notifications = onNotification({ jar: jar })

  notifications.on('data', (name, message) => {
    if (name === 'PartyNotifications' && message.Type === 'PartyLeftGame') {
      newEvent.emit('data', {
        PartyId: message.PartyId,
        PartyType: message.PartyType
      })
    }
  })

  notifications.on('error', (err) => {
    newEvent.emit('error', err)
  })

  notifications.on('connect', () => {
    newEvent.emit('connect')
  })

  notifications.on('close', (internal) => {
    if (internal) return
    notifications.emit('close', true)
  })

  return newEvent
}
