// Dependencies
var http = require('./http.js');
var cache = require('../cache');

// Args
exports.args = ['userId', 'group'];

// Define
function getRankInGroup (userId, group) {
  return function (resolve, reject) {
    http({url: 'https://www.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRank&playerid=' + userId + '&groupId=' + group})
    .then(function (body) {
      // Efficient
      resolve(parseInt(body.substring(22), 10));
    });
  };
}

exports.func = function (args) {
  var id = args.userId;
  return cache.wrap('Rank', id, getRankInGroup(id, args.group));
};
