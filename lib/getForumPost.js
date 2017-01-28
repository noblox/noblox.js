// Dependencies
var parser = require('cheerio');
var entities = require('entities');
var Promise = require('bluebird');

// Includes
var http = require('./util/http.js').func;
var getForumError = require('./util/getForumError.js').func;
var promise = require('./util/promise.js');

// Args
exports.required = ['postId'];
exports.optional = ['page'];

// Define
var debug = false;

function echo (str) {
  if (debug) {
    console.log(str);
  }
}

function doPage (thread, postId, pageNumber, target, resolve, reject) {
  echo('Do page ' + pageNumber + ' of ' + postId + ' for ' + target);
  var httpOpt = {
    url: 'https://forum.roblox.com/Forum/ShowPost.aspx?PostID=' + postId + '&PageIndex=' + pageNumber,
    options: {
      resolveWithFullResponse: true,
      followRedirect: false
    }
  };
  http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 302) {
      reject(getForumError({location: res.headers.location, append: 'Could not get forum post page ' + pageNumber}));
    } else {
      var body = res.body;
      var $ = parser.load(body);
      var posts = $('.forum-post');
      var total = thread && thread.totalPages;
      var exists = total && total > 0;
      if (!thread || !exists) {
        var totalPages = parseInt($('#ctl00_cphRoblox_PostView1_ctl00_Pager').find('.normalTextSmallBold').eq(0).text().match(/\d+$/)[0], 10);
        if (!thread) {
          resolve(totalPages);
          return;
        } else {
          thread.totalPages = totalPages;
        }
      }
      for (var i = 0; i < posts.length; i++) {
        var post = posts.eq(i);
        var info = post.find('.normalTextSmaller').eq(3);
        var id = parseInt(info.find('a').attr('name'), 10);
        if (pageNumber === 1 && i === 0 && id !== postId) {
          target = postId;
          postId = id;
          thread.totalPages = -1;
        } else if (!target || id === target) {
          var content = entities.decodeHTML(post.find('.normalTextSmall').html()).replace(/<br>/g, '\n').replace(/<.*?>/g, ''); // Replace breaks with newlines and then remove remaining html tags (because URLs in particular are left inside)
          var user = post.find('.normalTextSmallBold');
          var userId = parseInt(user.attr('href').match(/\d+/)[0], 10);
          var date = new Date(info.text() + ' CST'); // Source dates are in CST, when viewed in a browser they are converted to local time: this was kind of confusing
          thread.posts.push({
            author: {
              userId: userId,
              name: user.text()
            },
            postId: id,
            date: date,
            content: content,
            parent: {id: postId, page: pageNumber},
            index: (pageNumber - 1) * 25 + i
          });
        }
      }
      if (target && thread.posts.length === 0) {
        if (thread.totalPages < 0 || pageNumber + 1 <= thread.totalPages) {
          return doPage(thread, postId, pageNumber + 1, target, resolve, reject);
        } else {
          reject(new Error('Could not find reply in thread')); // This should never happen, but who knows with ROBLOX
        }
      }
      if (target) {
        thread.resolved = postId;
      }
      resolve();
    }
  });
}

function getPage (thread, postId, pageNumber, target) {
  return promise(function (resolve, reject) {
    doPage(thread, postId, pageNumber, target, resolve, reject);
  });
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
    jobs.push(getPage(thread, postId, page));
  }
  return Promise.all(jobs)
  .then(function () {
    thread.posts = thread.posts.sort(function (a, b) {
      return a.index - b.index;
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
  if (page) {
    if (isArray) {
      page = page.sort();
    } else {
      page = [page];
    }
    var low = page[0];
    if (low < 0) {
      // All this logic is to minimize the number of requests and get page number from a request that already has to be made, if possible
      var high = page[page.length - 1];
      var replace = high > 0;
      return getPage(replace ? thread : null, postId, replace ? high : 1)
      .then(function (total) {
        if (replace) {
          page.pop();
          total = thread.totalPages;
        }
        if (total + low < 0) {
          throw new Error('Page does not exist');
        }
        return getPages(thread, postId, page, total);
      });
    } else {
      return getPages(thread, postId, page);
    }
  } else {
    return getPage(thread, postId, 1)
    .then(function () {
      if (thread.resolved) {
        return thread;
      }
      return getPages(thread, postId, thread.totalPages);
    });
  }
};
