let events = require('events')

let onNotification = require('../user/onNotification.js').func

exports.optional = ['jar']

exports.func = (args) => {
  let jar = args.jar,
    newEvent = new events.EventEmitter(),
    notifications = onNotification({jar: jar})

  notifications.on('data', (name, message) => {
    if (name === 'PresenceNotifications' && message.Type === 'UserOnline') {
      newEvent.emit('data', message.UserId)
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