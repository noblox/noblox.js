// Dependencies
var parser = require('cheerio');
var entities = require('entities');
var Promise = require('bluebird');

// Includes
var http = require('./util/http.js').func;
var getForumError = require('./util/getForumError.js').func;
var getDate = require('./util/getDate.js').func;

// Args
exports.required = ['postId'];
exports.optional = ['page'];

// Define
var debug = false;
var maxPageSize = 25;

function doPage (thread, postId, pageNumber, target, tries) {
  if (debug) {
    console.log('Do page ' + pageNumber + ' of ' + postId + ' for ' + JSON.stringify(target) + ' out of ' + (thread && thread.totalPages));
  }
  var httpOpt = {
    url: '//forum.roblox.com/Forum/ShowPost.aspx?PostID=' + postId + '&PageIndex=' + pageNumber,
    options: {
      resolveWithFullResponse: true,
      followRedirect: false
    }
  };
  return http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 302) {
      throw getForumError({location: res.headers.location, append: 'Could not get forum post page ' + pageNumber});
    } else {
      var body = res.body;
      var $ = parser.load(body);
      var posts = $('.forum-post');
      var total = thread && thread.totalPages;
      var exists = total && total > 0;
      var last;
      if (thread && !thread.subject) {
        thread.subject = $('#ctl00_cphRoblox_PostView1_ctl00_PostTitle').text();
      }
      if (!thread || !exists) {
        var totalPages = parseInt($('#ctl00_cphRoblox_PostView1_ctl00_Pager').find('.normalTextSmallBold').eq(0).text().match(/\d+$/)[0], 10);
        if (!thread) {
          return totalPages;
        } else {
          thread.totalPages = totalPages;
        }
      }
      for (var i = 0; i < posts.length; i++) {
        var post = posts.eq(i);
        var meta = post.find('.normalTextSmaller').eq(3);
        var id = parseInt(meta.find('a').attr('name'), 10);
        last = id;
        if (pageNumber === 1 && i === 0 && id !== postId) {
          target = {
            min: 1,
            max: 0,
            id: postId
          };
          postId = id;
          thread.totalPages = -1;
        } else if (!target || id === target.id) {
          var content = entities.decodeHTML(post.find('.normalTextSmall').html()).replace(/<br>/g, '\n').replace(/<.*?>/g, ''); // Replace breaks with newlines and then remove remaining html tags (because URLs in particular are left inside)
          var info = post.find('table').eq(0);
          var span = info.find('span');
          var join = getDate({time: span.eq(0).text().substring(8), timezone: 'CT'});
          var postCount = parseInt(span.eq(1).text().substring(13), 10);
          var user = post.find('.normalTextSmallBold');
          var userId = parseInt(user.attr('href').match(/\d+/)[0], 10);
          var date = getDate({time: meta.text(), timezone: 'CT'}); // Source dates are in CT, when viewed in a browser they are converted to local time: this was kind of confusing
          var img = post.find('img[alt]');
          var online = img.eq(0).attr('src') === '/Forum/skins/default/images/user_IsOnline.gif';
          var tag = img.length > 1 && img.eq(1).attr('alt');
          thread.posts.push({
            author: {
              id: userId,
              name: user.text(),
              online: online,
              tag: tag,
              joinDate: join,
              postCount: postCount
            },
            postId: id,
            date: date,
            content: content,
            parent: {id: postId, page: pageNumber}
          });
        }
      }
      if (target && thread.posts.length === 0) {
        var min = target.min;
        var max = target.max;
        if (max === -1) {
          max = thread.totalPages;
        }
        if (min === max) {
          throw new Error('Could not find reply in thread'); // This should never happen, but who knows with ROBLOX
        }
        if (thread.totalPages < 0) {
          target.max = -1;
          return doPage(thread, postId, 1, target);
        }
        if (last < target.id) {
          min = pageNumber + 1;
        } else {
          max = pageNumber - 1;
        }
        target.min = min;
        target.max = max;
        if (thread.totalPages) {
          return doPage(thread, postId, Math.floor((min + max) / 2), target);
        }
      }
      if (target) {
        thread.resolved = postId;
      }
    }
  })
  .catch(function (err) {
    console.error(err.stack);
    if (!tries || tries < 3) {
      return getPage(thread, postId, pageNumber, target, tries ? tries + 1 : 0);
    }
  });
}

function getPage (thread, postId, pageNumber, target) {
  return doPage(thread, postId, pageNumber, target);
}

function getPages (thread, postId, pages, totalPages) {
  var jobs = [];
  var total = totalPages;
  var start, end;
  var isArray = pages instanceof Array;
  if (isArray) {
    start = 0;
    end = pages.length;
  } else {
    start = 2;
    end = pages + 1;
  }
  for (var i = start; i < end; i++) {
    var page = isArray ? pages[i] : i;
    if (page < 0) {
      page = total + 1 + page;
    }
    if (!totalPages || (page <= totalPages && page > 0)) {
      jobs.push(getPage(thread, postId, page));
    }
  }
  return Promise.all(jobs)
  .then(function () {
    thread.posts = thread.posts.sort(function (a, b) {
      return a.postId - b.postId;
    });
    return thread;
  });
}

exports.func = function (args) {
  var page = args.page;
  var postId = args.postId;
  var isArray = page instanceof Array;
  var thread = {
    posts: []
  };
  var promise;
  if (page) {
    if (isArray) {
      page = page.sort(function (a, b) {
        return a - b;
      });
    } else {
      page = [page];
    }
    var low = page[0];
    if (low < 0) {
      // All this logic is to minimize the number of requests and get page number from a request that already has to be made, if possible
      var high = page[page.length - 1];
      var replace = high > 0;
      promise = getPage(replace ? thread : null, postId, replace ? high : 1)
      .then(function (total) {
        if (replace) {
          page.pop();
          total = thread.totalPages;
        }
        return getPages(thread, postId, page, total);
      });
    } else {
      promise = getPages(thread, postId, page);
    }
  } else {
    promise = getPage(thread, postId, 1)
    .then(function () {
      if (thread.resolved) {
        return thread;
      }
      var total = thread.totalPages;
      return getPages(thread, postId, total, total);
    });
  }
  promise.getStatus = function () {
    return Math.round((thread.totalPages ? (thread.posts.length / maxPageSize) / thread.totalPages : 0) * 10000) / 100;
  };
  return promise;
};
