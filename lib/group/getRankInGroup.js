// Includes
var http = require('../util/http.js').func;
var cache = require('../cache');

// Args
exports.required = ['group', 'userId'];

// Define
function getRankInGroup (group, userId) {
  return http({url: '//www.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRank&playerid=' + userId + '&groupId=' + group})
  .then(function (body) {
    // Efficient
    return parseInt(body.substring(22), 10);
  });
}

exports.func = function (args) {
  var id = args.userId;
  return cache.wrap('Rank', id, function () {
    return getRankInGroup(args.group, id);
  });
};
