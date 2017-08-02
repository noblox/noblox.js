// Includes
var shortPoll = require('../util/shortPoll.js').func;
var getForum = require('./getForum.js').func;

// Args
exports.required = ['forumId'];
exports.optional = ['includeReplies', 'jar'];

// Define
exports.func = function (args) {
  var forumId = args.forumId;
  var replies = args.includeReplies;
  var jar = args.jar;
  return shortPoll({
    getLatest: function (latest) {
      return getForum({forumId: forumId, jar: jar})
      .then(function (posts) {
        var given = [];
        var original = latest;
        for (var i = 0; i < posts.length; i++) {
          var post = posts[i];
          var last = post.lastPost;
          var lastId = last.id;
          var useReply = replies && last;
          var id = useReply ? lastId : post.id;
          if (id > original) {
            if (useReply && lastId !== post.id) {
              last.parent = post;
              last.isReply = true;
              delete last.parent.lastPost;
              given.push(last);
            } else {
              post.isReply = false;
              given.push(post);
            }
          }
          if (id > latest) {
            latest = id;
          }
        }
        return {
          latest: latest,
          data: given
        };
      });
    },
    delay: 'onForumPost'
  });
};
