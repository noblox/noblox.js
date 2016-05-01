// Dependencies
var http = require('./util/http.js').func;
var getVerification = require('./util/getVerification.js').func;
var promise = require('./util/promise.js');
var cheerio = require('cheerio');

// Args
exports.args = ['group', 'message', 'jar'];

// Define
function post (jar, oldBody, post, group, message) {
  return function (resolve, reject) {
    post.ctl00$cphRoblox$GroupWallPane$NewPost = message;
    post.ctl00$cphRoblox$GroupWallPane$NewPostButton = 'Post';
    var httpOpt = {
      url: 'https://www.roblox.com/My/Groups.aspx?gid=' + group,
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        form: post,
        jar: jar
      }
    };
    http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        var $ = cheerio.load(res.body);
        var old = cheerio.load(oldBody);
        var oldTime = old('.RepeaterText').children('div').find('.GroupWall_PostDate').text().trim();
        var newObj = $('.RepeaterText').children('div');
        var newTime = newObj.find('.GroupWall_PostDate').text().trim();
        // Check that the message is updated and the post time is not the same
        if (oldTime !== newTime && newObj.eq(0).text().trim() === message) {
          resolve();
        } else {
          reject(new Error('Invalid permissions, make sure the user is in the group and is allowed to post on the group wall'));
        }
      } else {
        reject(new Error('Wall post failed'));
      }
    });
  };
}

exports.func = function (args) {
  var jar = args.jar;
  var group = args.group;
  return getVerification({url: 'https://www.roblox.com/My/Groups.aspx?gid=' + group, jar: jar, getBody: true})
  .then(function (response) {
    return promise(post(jar, response.body, response.inputs, group, args.message));
  });
};
