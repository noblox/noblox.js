// Includes
var shortPoll = require('../util/shortPoll.js').func;
var getWall = require('../getWall.js').func;

// Args
exports.required = ['group'];
exports.optional = ['jar'];

// Define
exports.func = function (args) {
  var group = args.group;
  var jar = args.jar;
  return shortPoll({
    getLatest: function (latest) {
      return getWall({group: group, jar: jar, page: 1})
      .then(function (wall) {
        var posts = wall.posts;
        var given = [];
        for (var i = posts.length - 1; i >= 0; i--) {
          var post = posts[i];
          var id = post.id;
          if (id > latest) {
            latest = id;
            given.push(post);
          }
        }
        return {
          latest: latest,
          data: given
        };
      });
    },
    delay: 'onWallPost'
  });
};
