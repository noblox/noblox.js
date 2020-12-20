const events = require('events')

const onNotification = require('../user/onNotification.js').func

exports.optional = ['jar']

// Docs
/**
 * An event for when you're invited to a party.
 * @category Party
 * @alias onPartInvite
 * @returns An EventEmitter that emits when you're invited to a party.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.onPartyInvite().on("data", function(data) {
 *  console.log("Invited to party!", data)
 * })
**/

exports.func = (args) => {
  const jar = args.jar
  const newEvent = new events.EventEmitter()
  const notifications = onNotification({ jar: jar })

  notifications.on('data', (name, message) => {
    if (name === 'PartyNotifications' && message.Type === 'InvitedToParty') {
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
