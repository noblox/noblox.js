// Includes
var http = require('./http.js').func;
var cache = require('../cache');

// Args
exports.required = ['group', 'userId'];

// Define
function getRankInGroup (group, userId) {
  return function (resolve, reject) {
    http({url: '//www.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRank&playerid=' + userId + '&groupId=' + group})
    .then(function (body) {
      // Efficient
      resolve(parseInt(body.substring(22), 10));
    });
  };
}

exports.func = function (args) {
  var id = args.userId;
  return cache.wrap('Rank', id, getRankInGroup(args.group, id));
};
