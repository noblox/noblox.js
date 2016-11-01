// Includes
var generalRequest = require('./util/generalRequest.js').func;
var promise = require('./util/promise.js');

// Args
exports.required = ['group', 'message'];
exports.optional = ['jar'];

// Define
function post (jar, res) {
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
  return generalRequest({jar: jar, url: '//www.roblox.com/My/Groups.aspx?gid=' + group, events: events})
  .then(function (result) {
    return promise(post(jar, result.res));
  });
};
