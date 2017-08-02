// Dependencies
var parser = require('cheerio');

// Includes
var http = require('../util/http.js').func;
var threaded = require('../util/threaded.js').func;
var getDate = require('../util/getDate.js').func;
var getAction = require('../util/getAction.js').func;

// Args
exports.required = ['group'];
exports.optional = ['page', 'action', 'username', 'stream', 'jar'];

// Define
var maxPageSize = 20;

function getAuditLog (audit, body, page) {
  var $ = parser.load(body);
  var max = $('#MaxPages');
  var pages = max.length > 0 ? parseInt(max.text(), 10) : 0;
  if (!audit) {
    return pages;
  }
  if (!audit.totalPages) {
    audit.totalPages = pages;
  }
  var rows = $('.AuditLogContainer').find('.datarow');
  for (var i = 0; i < rows.length; i++) {
    var row = rows.eq(i);
    var desc = row.find('.Description');
    var action = getAction({row: desc});
    var log = {
      user: {
        name: row.find('.username').text(),
        id: parseInt(row.find('.roblox-avatar-image').attr('data-user-id'), 10),
        role: row.find('.Rank').find('span').text()
      },
      text: desc.text(),
      action: action,
      date: getDate({time: row.find('.Date').text(), timezone: 'CT'}),
      parent: {
        page: page,
        index: (page - 1) * maxPageSize + i
      }
    };
    if (audit.stream) {
      audit.stream.write(log);
    } else {
      audit.logs.push(log);
    }
  }
}

function retrievePage (jar, audit, group, page, action, username) {
  var httpOpt = {
    url: '//www.roblox.com/Groups/Audit.aspx?groupid=' + group + '&pageNum=' + page + '&actionTypeId=' + (action || '') + '&username=' + (username || ''),
    options: {
      jar: jar,
      followRedirect: false,
      resolveWithFullResponse: true
    }
  };
  return http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 200) {
      return getAuditLog(audit, res.body, page);
    } else if (res.statusCode === 302) {
      if (res.headers.location.includes('/Groups/Group.aspx?gid=')) {
        throw new Error('You do not have permission to view the audit log');
      }
    } else {
      throw new Error('Unknown status code: ' + res.statusCode);
    }
  });
}

exports.func = function (args) {
  var audit = {
    logs: [],
    stream: args.stream || false
  };
  var group = args.group;
  var page = args.page;
  var action = args.action;
  var username = args.username;
  var jar = args.jar;
  var isArray = page instanceof Array;
  var promise;
  var getStatus = function () {
    return 0;
  };

  function getPages (pages, totalPages) {
    var total = totalPages;
    var isArray = pages instanceof Array;
    var end = isArray ? pages.length : total;
    var start = isArray ? 0 : 1;

    function getPage (i) {
      var page = isArray ? pages[i] : i;
      if (page < 0) {
        page = total + 1 + page;
      }
      return retrievePage(jar, audit, group, page, action, username);
    }

    var operation = threaded({getPage: getPage, start: start, end: end});
    getStatus = operation.getStatus;
    return operation.then(function () {
      getStatus = function () {
        return 100;
      };
      if (audit.stream) {
        audit.stream.end();
      } else {
        audit.logs = audit.logs.sort(function (a, b) {
          return a.parent.index - b.parent.index;
        });
      }
      return audit;
    });
  }

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
      var high = page[page.length - 1];
      var replace = high > 1;
      promise = retrievePage(jar, replace ? audit : null, group, replace ? high : 1, action, username)
      .then(function (total) {
        if (replace) {
          page.pop();
          total = audit.totalPages;
        }
        if (total + low < 0) {
          throw new Error('Page does not exist');
        }
        return getPages(page, total);
      });
    } else {
      promise = getPages(page);
    }
  } else {
    promise = retrievePage(jar, audit, group, 1, action, username)
    .then(function () {
      return getPages(page, audit.totalPages);
    });
  }
  promise.getStatus = function () {
    return getStatus();
  };
  return promise;
};
