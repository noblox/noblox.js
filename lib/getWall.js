// Dependencies
var parser = require('whacko');
var Promise = require('bluebird');

// Includes
var http = require('./util/http.js').func;
var getVerification = require('./util/getVerification.js').func;

// Args
exports.required = ['group'];
exports.optional = ['page', 'jar'];

// Define
var maxPageSize = 10;

function getPosts (wall, body, page) {
  var $ = parser.load(body);
  var totalPages = parseInt($('#ctl00_cphRoblox_GroupWallPane_GroupWallPager_ctl01_Div1').find('.paging_pagenums_container').text(), 10);
  if (wall) {
    var posts = $('.GroupWall_PostContainer');
    for (var i = 0; i < posts.length; i++) {
      var container = posts.eq(i);
      var post = container.parent().parent();
      var user = post.find('.UserLink').find('a');
      wall.posts.push({
        content: container.text(),
        author: {
          id: parseInt(user.attr('href').match(/\d+/)[0], 10),
          name: user.text().trim()
        },
        date: new Date(post.find('.GroupWall_PostDate').find('span').eq(0).text() + ' CST'),
        parent: {
          page: page
        },
        id: parseInt(post.find('.AbuseButton').find('a').attr('href').match(/groupwallpost\?id=(\d+)/)[1], 10) // In fact wall posts do have IDs (as all reportable items have to have) but other than for reporting it isn't really exposed to be used
      });
    }
    wall.totalPages = totalPages;
  }
  $ = null;
  body = null;
  if (!wall) {
    return totalPages;
  }
}

function getPage (jar, wall, inputs, group, pageNumber, tries) {
  var httpOpt = {
    url: '//www.roblox.com/My/Groups.aspx?gid=' + group,
    options: {
      method: 'POST',
      form: inputs,
      jar: jar
    }
  };
  var form = httpOpt.options.form;
  form.ctl00$cphRoblox$GroupWallPane$GroupWallPager$ctl01$PageTextBox = pageNumber;
  form.ctl00$cphRoblox$GroupWallPane$GroupWallPager$ctl01$HiddenInputButton = '';
  return http(httpOpt)
  .then(function (body) {
    getPosts(wall, body, pageNumber);
  })
  .catch(function (err) {
    console.error(err);
    if (tries < 3) {
      return getPage(jar, wall, inputs, group, pageNumber, tries ? tries + 1 : 0);
    }
  });
}

function getPages (jar, wall, inputs, group, pages, totalPages) {
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
    if (page <= totalPages && page > 0) {
      jobs.push(getPage(jar, wall, inputs, group, page));
    }
  }
  return Promise.all(jobs)
  .then(function () {
    wall.posts = wall.posts.sort(function (a, b) {
      return b.id - a.id;
    });
    return wall;
  });
}

exports.func = function (args) {
  var page = args.page;
  var jar = args.jar;
  var group = args.group;
  var isArray = page instanceof Array;
  var wall = {
    posts: []
  };
  if (page && !isArray) {
    page = [page];
  }
  var promise = getVerification({url: '//www.roblox.com/My/Groups.aspx?gid=' + group, jar: jar, getBody: true, ignoreCache: true})
  .then(function (response) {
    var inputs = response.inputs;
    var first = page ? page.indexOf(1) : 0;
    var totalPages = getPosts(first !== -1 ? wall : null, response.body, 1) || wall.totalPages;
    if (page && first !== -1) {
      page.splice(first, 1);
    }
    return getPages(jar, wall, inputs, group, page || totalPages, totalPages);
  });
  promise.getStatus = function () {
    return Math.round((wall.totalPages ? (wall.posts.length / maxPageSize) / wall.totalPages : 0) * 10000) / 100;
  };
  return promise;
};
