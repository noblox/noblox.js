<<<<<<< HEAD
let events = require('events')

let onNotification = require('../user/onNotification.js').func
=======
const events = require('events')

const onNotification = require('../user/onNotification.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.optional = ['jar']

exports.func = (args) => {
<<<<<<< HEAD
    let jar = args.jar,
        newEvent = new events.EventEmitter(),
        notifications = onNotification({jar: jar})
    
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
        if (internal) return;
        notifications.emit('close', true)
    })
    
    return newEvent
}
=======
  const jar = args.jar
  const newEvent = new events.EventEmitter()
  const notifications = onNotification({jar: jar})

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
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
