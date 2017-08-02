// Includes
var http = require('../util/http.js').func;
var getDate = require('../util/getDate.js').func;
var threaded = require('../util/threaded.js').func;

// Args
exports.required = ['userId', 'type'];
exports.optional = ['page', 'limit', 'jar'];

// Define
var maxPageSize = 200;

function getFriends (list, body, page, pageSize) {
  var json = JSON.parse(body);
  var friends = json.Friends;
  var total = json.TotalFriends;
  var pages = Math.ceil(total / maxPageSize);
  if (!list) {
    return pages;
  }
  if (!list.totalPages) {
    list.totalPages = pages;
  }
  if (!list.total) {
    list.total = total;
  }
  for (var i = 0; i < friends.length; i++) {
    var friend = friends[i];
    var online = friend.IsOnline;
    var lastSeen = online ? new Date() : getDate({time: friend.OnlineStatus.LocationOrLastSeen, timezone: 'CT'});
    var lastLocation = friend.LastLocation !== 'Offline' && friend.LastLocation;
    var index = lastLocation && lastLocation.indexOf(' ');
    if (index && index !== -1) {
      lastLocation = lastLocation.substring(index + 1);
    } else {
      lastLocation = null;
    }
    var row = {
      user: {
        id: friend.UserId,
        name: friend.Username
      },
      avatar: {
        url: friend.AvatarUri,
        final: friend.AvatarFinal
      },
      status: {
        online: online,
        lastSeen: lastSeen
      },
      parent: {
        page: (page * pageSize) / maxPageSize + 1,
        index: i,
        fullIndex: page * maxPageSize + i
      },
      inGame: friend.InGame,
      inStudio: friend.InStudio,
      following: friend.IsFollowed,
      deleted: friend.IsDeleted
    };
    if (lastLocation) {
      row.place = {
        name: lastLocation,
        id: friend.PlaceId
      };
    }
    list.friends.push(row);
  }
}

function retrievePage (jar, list, userId, i, pageSize, type) {
  var httpOpt = {
    url: 'https://www.roblox.com/users/friends/list-json?currentPage=' + (i * maxPageSize) + '&friendsType=' + type + '&imgHeight=100&imgWidth=100&pageSize=' + pageSize + '&userId=' + userId,
    options: {
      jar: jar
    }
  };
  return http(httpOpt)
  .then(function (body) {
    getFriends(list, body, i, pageSize);
  });
}

exports.func = function (args) {
  var list = {
    friends: []
  };
  var page = args.page;
  var limit = args.limit;
  var userId = args.userId;
  var type = args.type;
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
    var done = list.friends.length;
    if (limit) {
      end = Math.min(end, Math.ceil(limit / maxPageSize));
    }
    var start = isArray ? 0 : 1;

    function complete () {
      getStatus = function () {
        return 100;
      };
      list.friends = list.friends.sort(function (a, b) {
        return a.parent.fullIndex - b.parent.fullIndex;
      });
      return list;
    }

    if (limit <= list.friends.length) {
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
      return retrievePage(jar, list, userId, i, pageSize, type);
    }

    var operation = threaded({getPage: getPage, start: start, end: end});
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
      promise = retrievePage(jar, replace ? list : null, userId, replace ? high : 0, replace ? pageSize : 1, type)
      .then(function (total) {
        if (replace) {
          page.pop();
          total = list.totalPages;
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
    promise = retrievePage(jar, list, userId, 0, Math.min(maxPageSize, limit || Infinity), type)
    .then(function () {
      return getPages(page, list.totalPages);
    });
  }
  promise.getStatus = function () {
    return getStatus();
  };
  return promise;
};
