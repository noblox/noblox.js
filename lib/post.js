// Dependencies
var request = require('request');
var getVerificationInputs = require('./util/getVerificationInputs.js');
var cheerio = require('cheerio');

// Define
module.exports = function(jar, post, group, message, callbacks) {
  post.ctl00$cphRoblox$GroupWallPane$NewPost = message;
  post.ctl00$cphRoblox$GroupWallPane$NewPostButton = 'Post';
  request.post('http://www.roblox.com/My/Groups.aspx?gid=' + group, {jar: jar, form: post}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err && callbacks.failure)
      callbacks.failure(err, 'post1');
    if (res.statusCode == 200) {
      var $ = cheerio.load(body);
      if ($('.RepeaterText').children('div').eq(0).text().trim() == message) {
        if (callbacks.success)
          callbacks.success();
      } else if (callbacks.failure)
        callbacks.failure('Invalid posting permissions', 'post2');
    } else if (callbacks.failure)
      callbacks.failure('Post failed', 'post3');
  });
};
