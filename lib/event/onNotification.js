// Dependencies
var SignalR = require('signalr-client').client;
var events = require('events');

// Includes
var getSession = require('../util/getSession.js').func;
var settings = require('../../settings.json');

// Args
exports.optional = ['jar'];

// Define
exports.func = function (args) {
  var max = settings.event.maxRetries;
  var notifications = new events.EventEmitter();
  var session = getSession({jar: args.jar});
  var client = new SignalR('wss://realtime.roblox.com/notifications', ['usernotificationhub'], 3, true); // wss for https
  client.headers['Cookie'] = '.ROBLOSECURITY=' + session + ';';
  client.on('usernotificationhub', 'notification', function (name, message) {
    notifications.emit('data', name, JSON.parse(message));
  });
  notifications.on('close', client.end);
  client.serviceHandlers.onerror = function (err) {
    notifications.emit('error', err);
  };
  client.serviceHandlers.connected = function (connection) {
    notifications.emit('connect', connection);
  };
  client.serviceHandlers.reconnecting = function (retryData) {
    console.log('Reconnecting');
    var count = retryData.count;
    if (count >= max) {
      notifications.emit('error', new Error('Could not connect after ' + count + ' tries'));
      return true;
    }
    return false;
  };
  client.start();
  return notifications;
};
