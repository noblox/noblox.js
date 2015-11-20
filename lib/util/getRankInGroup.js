// Dependencies
var request = require('request');
var cheerio = require('cheerio');

// Define
module.exports = function(player, group, callbacks) {
  request.get('http://www.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRank&playerid=' + player + '&groupid=' + group, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err && callbacks.failure)
      callbacks.failure(err, 'getRankInGroup');
    callbacks.success(parseInt(cheerio.load(body)('value').text(), 10));
  });
};
