// Dependencies
var parser = require('cheerio');

// Includes
var generalRequest = require('./util/generalRequest.js').func;
var promise = require('./util/promise.js');

// Args
exports.required = [['forumId', 'postId'], 'body'];
exports.optional = ['subject', 'locked', 'jar'];

// Define
function forumPost (jar, args, res) {
  return function (resolve, reject) {
    if (res.statusCode === 302) {
      var redirect = res.headers.location;
      if (redirect.indexOf('/Forum/ShowPost.aspx') === 0) {
        var post = parseInt(redirect.match(/\d+$/)[0], 10);
        if (args.postId && post === parseInt(args.postId, 10)) {
          reject(new Error('Post is locked'));
        } else {
          resolve(post);
        }
      } else if (redirect.indexOf('/Forum/Msgs/default.aspx') === 0) {
        var id = parseInt(redirect.match(/MessageId=(\d+)/)[1], 10);
        var errorMsg;
        switch (id) {
          case 4:
            errorMsg = 'Duplicate posts are not allowed';
            break;
          case 8:
            errorMsg = 'Post blocked for prohibited content';
            break;
          case 17:
            errorMsg = 'Floodcheck blocked post';
            break;
          case 18:
            errorMsg = 'Post is too large';
            break;
          default:
            errorMsg = 'Forum post failed, error message path: ' + redirect;
        }
        reject(new Error(errorMsg));
      } else {
        reject(new Error('Forum post failed, unknown path redirect: ' + redirect));
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
      reject(new Error('Forum post failed, known issues: ' + JSON.stringify(errors)));
    } else {
      reject(new Error('Forum post failed, verify that you are allowed to make posts and the message and subject are permitted'));
    }
  };
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
  return generalRequest({
    jar: jar,
    url: '//forum.roblox.com/Forum/AddPost.aspx' + (args.forumId ? ('?ForumID=' + args.forumId) : ('?PostID=' + args.postId)),
    events: events,
    http: {
      url: '//forum.roblox.com/Forum/AddPost.aspx?ForumID=46' // If you get the verification token from the replying URl that token will not work with a new thread. The other way around, however, it works for both.
    }
  })
  .then(function (result) {
    return promise(forumPost(jar, args, result.res));
  });
};
