// Includes
var http = require('../util/http.js').func;
var cache = require('../cache');

// Args
exports.required = ['group', 'userId'];

// Define
function getRankNameInGroup (group, userId) {
  return http({url: '//www.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRole&playerid=' + userId + '&groupId=' + group})
  .then(function (body) {
    return body;
  });
}

exports.func = function (args) {
  var id = args.userId;
  return cache.wrap('Rank', id + 'Name', function () {
    return getRankNameInGroup(args.group, id);
  });
};
