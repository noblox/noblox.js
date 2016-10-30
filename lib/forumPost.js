// Dependencies
var parser = require('whacko');

// Includes
var generalRequest = require('./util/generalRequest.js').func;
var promise = require('./util/promise.js');

// Args
exports.required = [['forumId', 'postId'], 'body'];
exports.optional = ['subject', 'locked', 'jar'];

// Define
function forumPost (jar, res) {
  return function (resolve, reject) {
    if (res.statusCode === 302) {
      var redirect = res.headers.location;
      if (redirect.indexOf('/Forum/ShowPost.aspx') === 0) {
        resolve(parseInt(redirect.match(/\d+$/)[0], 10));
      } else if (redirect.indexOf('/Forum/Msgs/default.aspx') === 0) {
        // var id = parseInt(redirect.match(/MessageId=(\d+)/)[1], 10);
        reject(new Error('Forum post failed, error message path: ' + redirect));
      } else {
        reject(new Error('Forum post failed, unknown path redirect: ' + redirect));
      }
    } else if (res.statusCode === 200){
      var $ = parser.load(res.body);
      var found = $('.validationWarningSmall');
      var errors = [];
      for (var i = 0; i < found.length; i++) {
        var warning = $(found[i])
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
      url: '//forum.roblox.com/Forum/AddPost.aspx?ForumID=46'
    }
    // ignoreCache: true
  })
  .then(function (result) {
    return promise(forumPost(jar, result.res));
  });
};
