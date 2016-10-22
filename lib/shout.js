// Includes
var generalRequest = require('./util/generalRequest.js').func;
var promise = require('./util/promise.js');

// Args
exports.required = ['group'];
exports.optional = ['message', 'jar'];

// Define
function shout (jar, oldBody, res, message) {
  return function (resolve, reject) {
    if (res.statusCode === 200) {
      resolve();
    } else {
      reject(new Error('Shout failed, verify login, permissions, and message'));
    }
  };
}

exports.func = function (args) {
  var jar = args.jar;
  var group = args.group;
  var message = args.message;
  var events = {
    ctl00$cphRoblox$GroupStatusPane$StatusTextBox: message,
    ctl00$cphRoblox$GroupStatusPane$StatusSubmitButton: 'Group Shout'
  };
  return generalRequest({jar: jar, url: '//www.roblox.com/My/Groups.aspx?gid=' + group, events: events, getBody: true})
  .then(function (result) {
    return promise(shout(jar, result.body, result.res, message));
  });
};
