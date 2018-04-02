// Includes
var generalRequest = require('../util/generalRequest.js').func;

// Args
exports.required = ['group'];
exports.optional = ['useCache', 'jar'];

// Define
exports.func = function (args) {
  var events = {
    'ctl00$cphRoblox$ctl01': ''
  };
  return generalRequest({url: '//www.roblox.com/My/Groups.aspx?gid=' + args.group, jar: args.jar, events: events, ignoreCache: !args.useCache})
  .then(function (result) {
    if (result.res.statusCode !== 302 || !result.res.headers.location.endsWith('/My/Groups.aspx')) {
      throw new Error('Failed to leave group, verify that you are in the group');
    }
  });
};
