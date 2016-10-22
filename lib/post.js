// Includes
var generalRequest = require('./util/generalRequest.js').func;
var promise = require('./util/promise.js');

// Args
exports.args = ['group', 'message', 'jar'];

// Define
function post (jar, oldBody, res, message) {
  return function (resolve, reject) {
    if (res.statusCode === 200) {
      resolve();
    } else {
      reject(new Error('Wall post failed, verify login, permissions, and message'));
    }
  };
}

exports.func = function (args) {
  var jar = args.jar;
  var group = args.group;
  var message = args.message;
  var events = {
    ctl00$cphRoblox$GroupWallPane$NewPost: message,
    ctl00$cphRoblox$GroupWallPane$NewPostButton: 'Post'
  };
  return generalRequest({jar: jar, url: '//www.roblox.com/My/Groups.aspx?gid=' + group, events: events, getBody: true})
  .then(function (result) {
    return promise(post(jar, result.body, result.res, message));
  });
};
