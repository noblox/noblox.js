// Dependencies
var parser = require('cheerio');

// Includes
var http = require('./util/http.js').func;

// Args
exports.required = ['forumId'];
exports.optional = ['jar'];

// Define
exports.func = function (args) {
  var httpOpt = {
    url: '//forum.roblox.com/Forum/ShowForum.aspx?ForumID=' + args.forumId,
    options: {
      jar: args.jar // It was painstakingly discovered that without being logged in the entire forum page is cached server-side for a long time, missing new posts
    }
  };
  return http(httpOpt)
  .then(function (body) {
    var posts = [];
    var $ = parser.load(body);
    var found = $('.forum-table-row');
    for (var i = 0; i < found.length; i++) {
      var post = found.eq(i);
      var info = post.find('.post-list-subject');
      var data = post.find('.normalTextSmaller');
      var author = post.find('.post-list-author');
      var lastPage = post.find('td').eq(2).find('.linkSmall').last().text();
      var status = post.find('img').attr('title');
      var replyField = data.eq(1).text();
      var viewField = data.eq(2).text();
      var dateField = data.eq(3).text();
      var posted;
      var pinned = false;
      // Dates are a mess on ROBLOX. If you are not logged in they will still be in CST but if you are they are sent in local time from the server (as opposed to actual threads where they are converted on the client...). For the purposes of this function you should be logged in anyways
      if (dateField !== 'Pinned Post') {
        // And THEN the dates change at some points to full dates instead of times!
        if (dateField.indexOf(':') !== -1) {
          posted = new Date();
          var time = dateField.match(/(\d+):(\d+) (.*)/);
          var hours = parseInt(time[1], 10);
          var minutes = parseInt(time[2], 10);
          var day = time[3] === 'AM';
          posted.setHours(day ? hours : hours + 12);
          posted.setMinutes(minutes);
          posted.setSeconds(0);
          posted.setMilliseconds(0);
        } else {
          posted = new Date(dateField);
        }
      } else {
        pinned = true;
      }
      posts.push({
        id: parseInt(info.attr('href').match(/\d+$/)[0], 10),
        subject: info.text().trim(),
        author: {
          id: parseInt(author.attr('href').match(/\d+/)[0], 10),
          name: author.text().trim()
        },
        status: status,
        replies: replyField === '-' ? 0 : parseInt(replyField.replace(',', ''), 10),
        views: viewField === '-' ? 0 : parseInt(viewField.replace(',', ''), 10),
        pinned: pinned,
        locked: status.indexOf('Post allows no replies') === 0,
        lastPost: {
          author: data.eq(4).text(),
          id: parseInt(post.find('.last-post').attr('href').match(/\d+$/)[0], 10),
          date: pinned ? null : posted
        },
        totalPages: lastPage ? parseInt(lastPage, 10) : 1
      });
    }
    return posts;
  });
};
