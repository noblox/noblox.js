let events = require('events')

let onNotification = require('../user/onNotification.js').func

exports.optional = ['jar']

exports.func = (args) => {
    let jar = args.jar,
        onFriendEvent = new events.EventEmitter(),
        notifications = onNotification({jar: jar})
    
    notifications.on('data', (name, message) => {
        if (name === 'FriendshipNotifications' && message.Type === 'FriendshipCreated') {
            onFriendEvent.emit('data', message.EventArgs)
        }
    })
    
    notifications.on('error', (err) => {
        onFriendEvent.emit('error', err)
    })
    
    notifications.on('connect', () => {
        onFriendEvent.emit('connect')
    })
    
    notifications.on('close', (internal) => {
        if (internal) return;
        notifications.emit('close', true)
    })
    
    return onFriendEvent
}