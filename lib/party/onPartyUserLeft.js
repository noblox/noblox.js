const events = require('events')

const onNotification = require('../client/onNotification.js').func

exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when someone leaves a party.
 * @category Party
 * @alias onPartyUserLeft
 * @returns An EventEmitter that emits when someone leaves a party.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const partyLeft = noblox.onPartyUserLeft()
 * partyLeft.on("data", function(data) {
 *  console.log("Someone left party! ", data)
 * })
 * partyLeft.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
**/

exports.func = (args) => {
  const jar = args.jar
  const newEvent = new events.EventEmitter()
  const notifications = onNotification({ jar })

  notifications.on('data', (name, message) => {
    if (name === 'PartyNotifications' && message.Type === 'PartyUserLeft') {
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
