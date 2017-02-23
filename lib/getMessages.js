// Dependencies
var Promise = require('bluebird');

// Includes
var http = require('./util/http.js').func;

// Args
exports.optional = ['page', 'limit', 'tab', 'jar'];

// Define
var maxPageSize = 20;

function getPage (jar, inbox, page, pageSize, tab, tries) {
  var httpOpt = {
    url: '//www.roblox.com/messages/api/get-messages?pageNumber=' + page + '&pageSize=' + pageSize + '&messageTab=' + tab,
    options: {
      jar: jar
    }
  };
  return http(httpOpt)
  .then(function (body) {
    var json = JSON.parse(body);
    var messages = json.Collection;
    var total = json.TotalCollectionSize;
    var pages = Math.ceil(total / maxPageSize);
    if (!inbox) {
      return pages;
    }
    if (!inbox.totalPages) {
      inbox.totalPages = pages;
    }
    if (!inbox.total) {
      inbox.total = total;
    }
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      inbox.messages.push({
        sender: {
          userId: message.Sender.UserId,
          name: message.Sender.UserName
        },
        subject: message.Subject,
        body: message.Body,
        created: new Date(message.Created.split(' | ').join(' ') + ' CST'),
        updated: new Date(message.Updated.split(' | ').join(' ') + ' CST'),
        read: message.IsRead,
        parent: {
          page: (page * pageSize) / maxPageSize + 1
        },
        id: message.Id
      });
    }
  })
  .catch(function (err) {
    console.error(err.stack);
    if (!tries || tries < 3) {
      return getPage(jar, inbox, page, pageSize, tab, tries ? tries + 1 : 0);
    }
  });
}

function getPages (jar, inbox, pages, limit, tab, totalPages) {
  var jobs = [];
  var total = totalPages;
  var isArray = pages instanceof Array;
  var end = isArray ? pages.length : pages;
  var done = inbox.messages.length;
  if (limit) {
    end = Math.min(end, Math.ceil(limit / maxPageSize));
  }
  for (var i = isArray ? 0 : 1; i < end; i++) {
    if (limit <= inbox.messages.length) {
      break;
    }
    var finished = ((isArray ? (i + 1) : i)) * maxPageSize + done;
    var page = isArray ? pages[i] - 1 : i;
    if (page < 0) {
      page = total + 1 + page;
    }
    var pageSize = maxPageSize;
    if (finished > limit) {
      pageSize = maxPageSize - (finished - limit);
      page = (page * maxPageSize) / pageSize;
    }
    jobs.push(getPage(jar, inbox, page, pageSize, tab));
  }
  return Promise.all(jobs)
  .then(function () {
    inbox.messages = inbox.messages.sort(function (a, b) {
      return b.id - a.id;
    });
    return inbox;
  });
}

exports.func = function (args) {
  var inbox = {
    messages: []
  };
  var page = args.page;
  var limit = args.limit;
  var tab = args.tab || 0;
  var jar = args.jar;
  var isArray = page instanceof Array;
  var promise;
  if (page) {
    if (isArray) {
      page = page.sort(function (a, b) {
        return a - b;
      });
    } else {
      page = [page];
    }
    (page);
    var low = page[0];
    if (low < 0) {
      var high = page[page.length - 1];
      var replace = high > 0;
      var pageSize = maxPageSize;
      if (maxPageSize > limit) {
        pageSize = limit;
        high = maxPageSize * (high - 1) / pageSize;
      }
      promise = getPage(jar, replace ? inbox : null, replace ? high : 0, replace ? pageSize : 1, tab)
      .then(function (total) {
        if (replace) {
          page.pop();
          total = inbox.totalPages;
        }
        if (total + low < 0) {
          throw new Error('Page does not exist');
        }
        return getPages(jar, inbox, page, limit, tab, total);
      });
    } else {
      promise = getPages(jar, inbox, page, limit, tab);
    }
  } else {
    promise = getPage(jar, inbox, 0, Math.min(maxPageSize, limit || Infinity), tab)
    .then(function () {
      return getPages(jar, inbox, inbox.totalPages, limit, tab);
    });
  }
  promise.getStatus = function () {
    return Math.round((inbox.total ? (inbox.messages.length / Math.min((page ? page.length : 0) * maxPageSize, limit || Infinity, inbox.total)) : 0) * 10000) / 100;
  };
  return promise;
};
