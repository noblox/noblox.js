// Dependencies
var parser = require('whacko');

// Includes
var generalRequest = require('./util/generalRequest.js').func;
var getForumError = require('./util/getForumError.js').func;
var getHash = require('./util/getHash.js').func;
var queue = require('./util/queue.js');

// Args
exports.required = [['forumId', 'postId'], 'body'];
exports.optional = ['subject', 'locked', 'jar'];

// Define
function forumPost (jar, args, res) {
  if (res.statusCode === 302) {
    var redirect = res.headers.location;
    if (redirect.indexOf('/Forum/ShowPost.aspx') === 0) {
      var post = parseInt(redirect.match(/\d+$/)[0], 10);
      if (args.postId && post === parseInt(args.postId, 10)) {
        throw new Error('Post is locked');
      } else {
        return post;
      }
    } else {
      throw getForumError({location: redirect, append: 'Forum post failed'});
    }
  } else if (res.statusCode === 200) {
    var $ = parser.load(res.body);
    var found = $('.validationWarningSmall');
    var errors = [];
    for (var i = 0; i < found.length; i++) {
      var warning = $(found[i]);
      if (warning.css('display') !== 'none') {
        errors.push(warning.text());
      }
    }
    throw new Error('Forum post failed, known issues: ' + JSON.stringify(errors));
  } else {
    throw new Error('Forum post failed, verify that you are allowed to make posts and the message and subject are permitted');
  }
}

exports.func = function (args) {
  var jar = args.jar;
  var events = {
    ctl00$cphRoblox$Createeditpost1$PostForm$PostBody: args.body,
    ctl00$cphRoblox$Createeditpost1$PostForm$PostButton: 'Post'
  };
  if (args.subject) {
    events.ctl00$cphRoblox$Createeditpost1$PostForm$NewPostSubject = args.subject;
  }
  if (args.locked) {
    events.ctl00$cphRoblox$Createeditpost1$PostForm$AllowReplies = 'on';
  }

  return queue('Forum', getHash({jar: jar}), function () {
    return generalRequest({
      jar: jar,
      url: '//forum.roblox.com/Forum/AddPost.aspx' + (args.forumId ? ('?ForumID=' + args.forumId) : ('?PostID=' + args.postId)),
      events: events,
      http: {
        url: '//forum.roblox.com/Forum/AddPost.aspx?ForumID=46' // If you get the verification token from the replying URL that token will not work with a new thread. The other way around, however, it works for both.
      }
    })
    .then(function (result) {
      return forumPost(jar, args, result.res);
    });
  }, function (err) {
    if (err.message.indexOf('Duplicate') > -1 || err.message.indexOf('Post does not exist') > -1) {
      return false; // Do not ignore
    }
    return true; // Ignore
  });
};
