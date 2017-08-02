// Includes
var shortPoll = require('../util/shortPoll.js').func;
var getForumPost = require('./getForumPost.js').func;

// Args
exports.required = ['postId'];

// Define
exports.func = function (args) {
  var postId = args.postId;
  return shortPoll({
    getLatest: function (latest) {
      return getForumPost({postId: postId, page: [-1, -2]}) // Gets the last two pages in case multiple posts shift the page and are missed
      .then(function (thread) {
        var given = [];
        for (var i = 0; i < thread.posts.length; i++) {
          var post = thread.posts[i];
          var id = post.postId;
          if (id > latest) {
            latest = id;
            post.parent.subject = thread.subject;
            given.push(post);
          }
        }
        return {
          latest: latest,
          data: given
        };
      });
    },
    delay: 'onForumReply'
  });
};
