// Dependencies
var request = require('request');
var cheerio = require('cheerio');

// Define
module.exports = function(player, group, callbacks) {
  request.get('http://www.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=GetGroupRank&playerid=' + player + '&groupid=' + group, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error('GetRankInGroup request failed:' + err);
    }
    callbacks.success(parseInt(cheerio.load(body)('value'), 10));
  });
};
