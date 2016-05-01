// Dependencies
var http = require('./util/http.js').func;
var promise = require('./util/promise.js');
var getGeneralToken = require('./util/getGeneralToken.js').func;

// Args
exports.args = ['recipient', 'subject', 'body', 'jar'];

// Define
function message (jar, token, recipient, subject, body) {
  return function (resolve, reject) {
    var httpOpt = {
      url: 'https://www.roblox.com/messages/send',
      options: {
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          subject: subject,
          body: body,
          recipientid: recipient
        }
      }
    };
    http(httpOpt)
    .then(function (body) {
      if (body.success) {
        resolve();
      } else {
        reject(new Error(body.message));
      }
    });
  };
}

exports.func = function (args) {
  var jar = args.jar;
  return getGeneralToken({jar: jar})
  .then(function (xcsrf) {
    return promise(message(jar, xcsrf, args.recipient, args.subject, args.body));
  });
};
