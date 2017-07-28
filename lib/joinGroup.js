// Includes
var generalRequest = require('./util/generalRequest.js').func;

// Args
exports.required = ['group'];
exports.optional = ['jar'];

// Define
exports.func = function (args) {
  var events = {
    __EVENTTARGET: 'JoinGroupDiv',
    __EVENTARGUMENT: 'Click'
  };
  return generalRequest({url: '//www.roblox.com/Groups/Group.aspx?gid=' + args.group, jar: args.jar, events: events, ignoreCache: true})
  .then(function (result) {
    if (result.res.statusCode !== 200) {
      throw new Error('Failed to join group, verify that you have enough group space');
    }
  });
};
