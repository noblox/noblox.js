// Dependencies
var Promise = require('bluebird');
var parser = require('cheerio');

// Includes
var http = require('./util/http.js').func;
var getRoles = require('./util/getRoles.js').func;
var getRole = require('./util/getRole.js').func;
var promise = require('./util/promise.js');
var getVerificationInputs = require('./util/getVerificationInputs.js').func;
var settings = require('../settings.json').getPlayers;

// Args
exports.required = ['group'];
exports.optional = ['rank', 'limit', 'online'];

// Define
var interval = settings.interval; // Players for every set of requests
var delay = settings.delay; // Time (in milliseconds) to wait after every interval
var debug = false; // Prints out information about what the function is doing, good for status updates or debugging

// Because of the complexity of this function, it's easier to have shared variables initiated every time a call is made.
exports.func = function (args) {
  var players = {};
  var added = 0;
  var scanned = 0;
  var rank;
  var limit;
  var online;
  var group;
  var post;
  var pages;
  var total;
  var httpOpt;

  function addPlayer (name, id) {
    if (!players[name]) {
      added++;
      players[name] = id;
    }
  }

  function echo (str) {
    if (debug) {
      console.log(str);
    }
  }

  function getPlayersOnPage (html) {
    var $ = parser.load(html);
    var currentCount = parseInt($('[name="ctl00$cphRoblox$rbxGroupRoleSetMembersPane$RolesetCountHidden"]').attr('value'), 10);
    if (rank && rank !== -1) {
      if (total) {
        total = Math.min(total, currentCount);
      } else {
        total = currentCount;
      }
    }
    $('div[class=Avatar]').each(function (index, element) {
      if ((limit > -1) && added >= limit) {
        return;
      }
      scanned++;
      element = $(element);
      var link = element.find('a').first();
      var img = element.find('.OnlineStatus').find('img').first();
      if (!online || img.attr('src') === '../images/online.png') {
        var id = parseInt(link.attr('href').substring(29), 10);
        addPlayer(link.attr('title'), id);
      }
      element = null;
    });
    $ = null;
    html = null;
  }

  function runInterval (pass) {
    return promise(function (resolve, reject) {
      var toDo = [];

      var max = (pass + 1) * interval;
      echo('Current: ' + (pass * interval + 1 + (pass === 0 ? 1 : 0)));
      echo('To: ' + max + ' out of ' + pages + ' under pass ' + pass);
      var last = Math.min(pages, max);

      for (var i = pass * interval + 1 + (pass === 0 ? 1 : 0); i <= last; i++) {
        if (limit >= -1) {
          toDo.push(i);
        } else {
          httpOpt.options.form.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlUsers_Footer$ctl01$PageTextBox = i;
          toDo.push(http(httpOpt).then(getPlayersOnPage));
        }
      }

      function completed () {
        toDo = null;
        setTimeout(resolve, delay);
      }

      if (limit >= -1) {
        Promise.each(toDo, function (i) {
          httpOpt.options.form.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlUsers_Footer$ctl01$PageTextBox = i;
          return http(httpOpt).then(getPlayersOnPage);
        }).then(completed);
      } else {
        Promise.all(toDo).then(completed);
      }
    });
  }

  function getPlayersInRole (role) {
    var url = '//www.roblox.com/Groups/group.aspx?gid=' + group;
    return http({url: url})
    .then(function (body) {
      var $ = parser.load(body);
      if (!rank || rank === -1 && !total) {
        total = parseInt($('#MemberCount').text().substring(9), 10);
      }
      post = getVerificationInputs({html: body});
      post.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlRolesetList = role;
      post.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$currentRoleSetID = role;
      post.__EVENTTARGET = 'ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlRolesetList';
      post.__ASYNCPOST = 'true';
      delete post.__RequestVerificationToken;
      httpOpt = {
        url: url,
        options: {
          method: 'POST',
          form: post,
          headers: {
            'User-Agent': 'Mozilla'
          }
        }
      };
      return http(httpOpt)
    .then(function (body) {
      var $ = parser.load(body);
      pages = parseInt($('div[id=ctl00_cphRoblox_rbxGroupRoleSetMembersPane_dlUsers_Footer_ctl01_Div1]').find('div[class=paging_pagenums_container]').text(), 10) || 1;
      if (limit > -1) {
        pages = Math.min(pages, Math.ceil(limit / 12));
        total = (total != null) ? total : limit;
      }
      getPlayersOnPage(body);
      if (pages === 1) {
        return;
      }

      delete post.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlRolesetList;
      post.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlUsers_Footer$ctl01$PageTextBox = 1;
      post.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlUsers_Footer$ctl01$HiddenInputButton = '';

      var toDo = [];

      for (var pass = 0; pass < pages / 1000; pass++) {
        toDo.push(pass);
      }

      return Promise.each(toDo, runInterval);
    }); });
  }

  return {
    promise: promise(function (resolve, reject) {
      group = args.group;
      rank = args.rank;
      online = args.online || false;
      limit = args.limit || -2;
      getRoles({group: group}).then(function (roles) {
        var toDo = [];
        if (rank && rank !== -1) {
          toDo.push(getRole({roles: roles, rank: rank}).ID);
        } else {
          for (var i = 0; i < roles.length; i++) {
            toDo.push(roles[i].ID);
          }
        }

        Promise.each(toDo, getPlayersInRole).then(function () {
          total = added;
          resolve({
            total: added,
            players: players
          });
        });
      });
    }),
    getStatus: function () {
      return Math.round((total ? (scanned / total) : 0) * 10000) / 100;
    }
  };
};
