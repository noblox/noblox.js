// Dependencies
var request = require('request');
var getToken = require('./util/getToken.js');

// Define
module.exports = function(jar, recipient, subject, body, token, callbacks) {
  request.post('http://www.roblox.com/messages/send', {jar: jar, headers: {'X-CSRF-TOKEN': token}, json: {
    subject: subject,
    body: body,
    recipientid: recipient
  }}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err && callbacks.failure)
      callbacks.failure(err, 'message1');
    if (body.success && callbacks.success)
      callbacks.success();
    else if (!body.success && callbacks.failure) {
      callbacks.failure(message, 'message2');
    }
  });
};
