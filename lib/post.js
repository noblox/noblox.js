// Includes
var generalRequest = require('./util/generalRequest.js').func;

// Args
exports.required = ['group', 'message'];
exports.optional = ['jar'];

// Define
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
    if (result.res.statusCode !== 200) {
      throw new Error('Wall post failed, verify login, permissions, and message');
    }
  });
};
