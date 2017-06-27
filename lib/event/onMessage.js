// Dependencies
var events = require('events');

// Includes
var onNotification = require('./onNotification.js').func;
var getMessages = require('../getMessages.js').func;

// Args
exports.optional = ['jar'];

// Define
exports.func = function (args) {
  var jar = args.jar;
  var onMessage = new events.EventEmitter();
  var waitingForRequest = false;
  var latest;
  getMessages({jar: jar, page: 1, limit: 1})
  .then(function (initial) {
    latest = initial.messages[0] ? initial.messages[0].id : 0;
    var notifications = onNotification({jar: jar});
    notifications.on('data', function (name, message) {
      if (name === 'NotificationStream' && message.Type === 'NewNotification') {
        if (waitingForRequest) {
          waitingForRequest = false;
        } else {
          getMessages({
            jar: jar,
            page: 1
          })
          .then(function (inbox) {
            var messages = inbox.messages;
            for (var i = messages.length - 1; i >= 0; i--) {
              var message = messages[i];
              var id = message.id;
              if (id > latest) {
                latest = id;
                onMessage.emit('data', message);
              }
            }
          });
        }
      } else if (name === 'FriendshipNotifications' && message.Type === 'FriendshipRequested') {
        waitingForRequest = true;
      }
    });
    notifications.on('error', function (err) {
      onMessage.emit('error', err);
    });
    notifications.on('connect', function () {
      onMessage.emit('connect');
    });
    onMessage.on('close', function () {
      notifications.emit('close');
    });
  });

  return onMessage;
};
