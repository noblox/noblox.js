// Dependencies
var entities = require('entities');

// Includes
var http = require('./util/http.js').func;
var getDate = require('./util/getDate.js').func;
var threaded = require('./util/threaded.js');

// Args
exports.optional = ['page', 'limit', 'tab', 'jar'];

// Define
var maxPageSize = 20;

function getMessages (inbox, body, page, pageSize) {
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
    var content = entities.decodeHTML(message.Body.replace(/<br \/>/g, '\n'));
    inbox.messages.push({
      sender: {
        userId: message.Sender.UserId,
        name: message.Sender.UserName
      },
      subject: message.Subject,
      body: content,
      created: getDate({time: message.Created.split(' | ').join(' '), timezone: 'CT'}),
      updated: getDate({time: message.Updated.split(' | ').join(' '), timezone: 'CT'}),
      read: message.IsRead,
      parent: {
        page: (page * pageSize) / maxPageSize + 1
      },
      id: message.Id
    });
  }
}

function retrievePage (jar, inbox, i, pageSize, tab) {
  var httpOpt = {
    url: '//www.roblox.com/messages/api/get-messages?pageNumber=' + i + '&pageSize=' + pageSize + '&messageTab=' + tab,
    options: {
      jar: jar
    }
  };
  return http(httpOpt)
  .then(function (body) {
    getMessages(inbox, body, i, pageSize);
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
  var getStatus = function () {
    return 0;
  };

  function getPages (pages, totalPages) {
    var total = totalPages;
    var isArray = pages instanceof Array;
    var end = isArray ? pages.length : total;
    var done = inbox.messages.length;
    if (limit) {
      end = Math.min(end, Math.ceil(limit / maxPageSize));
    }
    var start = isArray ? 0 : 1;

    function complete () {
      getStatus = function () {
        return 100;
      };
      inbox.messages = inbox.messages.sort(function (a, b) {
        return b.id - a.id;
      });
      return inbox;
    }

    if (limit <= inbox.messages.length) {
      return complete();
    }

    function getPage (i) {
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
      return retrievePage(jar, inbox, i, pageSize, tab);
    }

    var operation = threaded(getPage, start, end);
    getStatus = operation.getStatus;
    return operation.then(complete);
  }

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
      promise = retrievePage(jar, replace ? inbox : null, replace ? high : 0, replace ? pageSize : 1, tab)
      .then(function (total) {
        if (replace) {
          page.pop();
          total = inbox.totalPages;
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
    promise = retrievePage(jar, inbox, 0, Math.min(maxPageSize, limit || Infinity), tab)
    .then(function () {
      return getPages(page, inbox.totalPages);
    });
  }
  promise.getStatus = function () {
    return getStatus();
  };
  return promise;
};
