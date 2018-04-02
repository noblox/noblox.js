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
        onChatEvent = new events.EventEmitter(),
        notifications = onNotification({jar: jar})
    
    notifications.on('data', (name, message) => {
        if (name === 'ChatNotifications' && message.Type === 'NewConversation') {
            onChatEvent.emit('data', message.ConversationId)
        }
    })
    
    notifications.on('error', (err) => {
        onChatEvent.emit('error', err)
    })
    
    notifications.on('connect', () => {
        onChatEvent.emit('connect')
    })
    
    notifications.on('close', (internal) => {
        if (internal) return;
        notifications.emit('close', true)
    })
    
    return onChatEvent
}
=======
  const jar = args.jar
  let onChatEvent = new events.EventEmitter()
  const notifications = onNotification({jar: jar})

  notifications.on('data', (name, message) => {
    if (name === 'ChatNotifications' && message.Type === 'NewConversation') {
      onChatEvent.emit('data', message.ConversationId)
    }
  })

  notifications.on('error', (err) => {
    onChatEvent.emit('error', err)
  })

  notifications.on('connect', () => {
    onChatEvent.emit('connect')
  })

  notifications.on('close', (internal) => {
    if (internal) return
    notifications.emit('close', true)
  })

  return onChatEvent
}
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
