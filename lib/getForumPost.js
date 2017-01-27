// Dependencies
var parser = require('cheerio');
var entities = require('entities');

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

function doPage (postId, pageNumber, target, resolve, reject) {
  echo('Do page ' + pageNumber + ' of ' + postId + ' for ' + target);
  var page = [];
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
      reject(getForumError({location: res.headers.location, append: 'Could not get forum post'}));
    } else {
      var body = res.body;
      var $ = parser.load(body);
      var posts = $('.forum-post');
      var totalPages = parseInt($('#ctl00_cphRoblox_PostView1_ctl00_Pager').find('.normalTextSmallBold').eq(0).text().match(/\d+$/)[0], 10);
      for (var i = 0; i < posts.length; i++) {
        var post = posts.eq(i);
        var info = post.find('.normalTextSmaller').eq(3);
        var id = parseInt(info.find('a').attr('name'), 10);
        if (pageNumber === 1 && i === 0 && id !== postId) {
          target = postId;
          postId = id;
          totalPages = -1;
        } else if (!target || id === target) {
          var content = entities.decodeHTML(post.find('.normalTextSmall').html()).replace(/<br>/g, '\n').replace(/<.*?>/g, ''); // Replace breaks with newlines and then remove remaining html tags (because URLs in particular are left inside)
          var user = post.find('.normalTextSmallBold');
          var userId = parseInt(user.attr('href').match(/\d+/)[0], 10);
          var date = new Date(info.text() + ' CST'); // Source dates are in CST, when viewed in a browser they are converted to local time: this was kind of confusing
          page.push({author: {userId: userId, name: user.text()}, postId: id, date: date, content: content});
        }
      }
      if (target && page.length === 0) {
        if (totalPages < 0 || pageNumber + 1 <= totalPages) {
          return doPage(postId, pageNumber + 1, target, resolve, reject);
        } else {
          reject(new Error('Could not find reply in thread'));
        }
      }
      resolve({page: page, totalPages: totalPages, parent: target ? {id: postId, page: pageNumber} : null});
    }
  });
}

function getPage (postId, pageNumber, target) {
  return promise(function (resolve, reject) {
    doPage(postId, pageNumber, target, resolve, reject);
  });
}

function getPages (postId, pages, totalPages) {
  var thread = {
    pages: {}
  };
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
    (function (pageNumber) {
      jobs.push(
        getPage(postId, pageNumber)
        .then(function (info) {
          thread.pages[pageNumber] = (info.page);
          if (!total) {
            total = info.totalPages;
          }
        })
      );
    })(page);
  }
  return Promise.all(jobs)
  .then(function () {
    thread.totalPages = total;
    return thread;
  });
}

exports.func = function (args) {
  var page = args.page;
  var postId = args.postId;
  var isArray = page instanceof Array;
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
      return getPage(postId, replace ? high : 1)
      .then(function (info) {
        if (replace) {
          page.pop();
        }
        var total = info.totalPages;
        if (total + low < 0) {
          throw new Error('Page does not exist');
        }
        return getPages(postId, page, total)
        .then(function (thread) {
          if (replace) {
            thread.pages[high] = info.page;
          }
          return thread;
        });
      });
    } else {
      return getPages(postId, page);
    }
  } else {
    return getPage(postId, 1)
    .then(function (info) {
      var parent = info.parent;
      if (parent) {
        info.pages = {};
        info.pages[parent.page] = info.page;
        delete info.page;
        return info;
      }
      return getPages(postId, info.totalPages)
      .then(function (thread) {
        thread.pages[1] = info.page;
        return thread;
      });
    });
  }
};
