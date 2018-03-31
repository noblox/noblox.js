// Dependencies
var parser = require('cheerio')

// Includes
var http = require('../util/http.js').func
var date = require('../util/getDate.js')

// Args
exports.required = ['forumId']
exports.optional = ['jar']

// Define
exports.func = function (args) {
  var httpOpt = {
    url: '//forum.roblox.com/Forum/ShowForum.aspx?ForumID=' + args.forumId,
    options: {
      jar: args.jar // It was painstakingly discovered that without being logged in the entire forum page is cached server-side for a long time, missing new posts
    }
  }
  return http(httpOpt)
    .then(function (body) {
      var posts = []
      var $ = parser.load(body)
      var found = $('.forum-table-row')
      var loggedIn = false
      if ($('meta[name="user-data"]').length > 0) {
        loggedIn = true
      }
      for (var i = 0; i < found.length; i++) {
        var post = found.eq(i)
        var info = post.find('.post-list-subject')
        var data = post.find('.normalTextSmaller')
        var author = post.find('.post-list-author')
        var lastPage = post.find('td').eq(2).find('.linkSmall').last().text()
        var status = post.find('img').attr('title')
        var replyField = data.eq(1).text()
        var viewField = data.eq(2).text()
        var dateField = data.eq(3).text()
        var posted
        var pinned = false
        // Dates are a mess on ROBLOX. If you are not logged in they will still be in CT but if you are they are sent in PT from the server (as opposed to actual threads where they are converted on the client...).
        if (dateField !== 'Pinned Post') {
        // And THEN the dates change at some points to full dates instead of times!
          if (dateField.indexOf(':') !== -1) {
          // Get day in correct timezone as it is not included in the time
            var here = new Date()
            var offset
            // Kill me now
            if (date.isDST(here.toUTCString())) {
              offset = loggedIn ? 7 : 5
            } else {
              offset = loggedIn ? 8 : 6
            }
            var utc = here.getTime() + (here.getTimezoneOffset() * 60000)
            var there = new Date(utc + (3600000 * offset))
            posted = there.getFullYear() + '-' + there.getMonth() + '-' + there.getDate() + ' ' + dateField
          } else {
            posted = date
          }
        } else {
          pinned = true
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
            date: pinned ? null : date.func({time: posted, timezone: loggedIn ? 'PT' : 'CT'})
          },
          totalPages: lastPage ? parseInt(lastPage, 10) : 1
        })
      }
      return posts
    })
}
