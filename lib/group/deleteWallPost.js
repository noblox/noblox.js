// Includes
var http = require('../util/http.js').func;
var getWallPost = require('./getWallPost.js').func;

// Args
exports.required = ['group', ['id', 'post']];
exports.optional = ['page', 'jar'];

// Define
function deleteWallPost (jar, group, post) {
  post.view.__EVENTTARGET = 'ctl00$cphRoblox$GroupWallPane$GroupWall$ctrl' + post.parent.index + '$LinkButton0';
  return http({
    url: 'https://www.roblox.com/My/Groups.aspx?gid=' + group,
    options: {
      form: post.view,
      method: 'POST',
      jar: jar,
      resolveWithFullResponse: true
    }
  })
  .then(function (res) {
    if (res.statusCode !== 200) {
      throw new Error('Delete wall post failed, make sure you have permission to manage the wall');
    }
  });
}

exports.func = function (args) {
  var group = args.group;
  var jar = args.jar;
  if (args.post) {
    return deleteWallPost(jar, group, args.post);
  } else {
    return getWallPost({
      jar: jar,
      group: group,
      id: args.id,
      page: args.page,
      view: true
    })
    .then(function (post) {
      return deleteWallPost(jar, group, post);
    });
  }
};
