// Dependencies
var http = require('./util/http.js');
var getToken = require('./util/getToken.js');

// Define
module.exports = function(jar, recipient, subject, body, token, callbacks) {
  http('http://www.roblox.com/messages/send', {method: 'POST', jar: jar, headers: {'X-CSRF-TOKEN': token}, json: {
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
      callbacks.failure(body.message, 'message2');
    }
  });
};
