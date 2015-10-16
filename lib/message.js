// Dependencies
var request = require('request');
var getToken = require('./util/getToken.js');

// Define
function message(jar,recipient,subject,body,token,callbacks) {
  request.post('http://www.roblox.com/messages/send',{jar: jar, headers: {'X-CSRF-TOKEN': token}, json: {
    subject: subject,
    body: body,
    recipientid: recipient
  }},function(err,res,body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error('Request failed: ' + err);
    }
    if (body.success && callbacks.success)
      callbacks.success();
    else {
      var message = body.shortMessage;
      if (callbacks.failure)
        callbacks.failure(message);
      return console.error('Message failed: ' + message);
    }
  });
}

exports = function(jar,recipient,subject,body,token,callbacks) {
  if (token)
    return message(jar,recipient,subject,body,token,callbacks);
  else {
    return getToken(jar,'http://www.roblox.com/messages/send',function(token) {
      return message(jar,recipient,subject,body,token,callbacks);
    });
  }
};
