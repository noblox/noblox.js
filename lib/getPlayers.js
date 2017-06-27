// Dependencies
var parser = require('whacko');
var Promise = require('bluebird');

// Includes
var http = require('./util/http.js').func;
var jar = require('./util/jar.js').func;
var getRole = require('./util/getRole.js').func;
var getRoles = require('./util/getRoles.js').func;
var generalRequest = require('./util/generalRequest.js').func;
var threaded = require('./util/threaded.js');

// Args
exports.required = ['group'];
exports.optional = [['rank', 'roleset', 'name'], 'page', 'stream'];

// Define
var maxPageSize = 12;

function getPlayers (group, rankIndex, role, page, body) {
  var $ = parser.load(body);
  var total = parseInt($('[name="ctl00$cphRoblox$rbxGroupRoleSetMembersPane$RolesetCountHidden"]').attr('value'), 10);
  if (group) {
    var found = $('.GroupMember');
    var players = group.players;
    for (var i = 0; i < found.length; i++) {
      var player = found.eq(i);
      var link = player.find('a').first();
      var img = player.find('.OnlineStatus').find('img').first();
      var element = {
        id: parseInt(link.attr('href').substring(29), 10),
        name: link.attr('title'),
        online: img.attr('src') === '../images/online.png',
        parent: {
          role: role,
          page: page,
          rankIndex: rankIndex
        },
        index: ((page - 1) * maxPageSize + i)
      };
      if (group.stream) {
        group.stream.write(element);
      } else {
        players.push(element);
      }
    }
  }
  $ = null;
  body = null;
  return total;
}

exports.func = function (args) {
  var page = args.page;
  var groupId = args.group;
  var option;
  var optionName;
  var getStatus = function () {
    return 0;
  };
  if (args.rank) {
    option = args.rank;
    optionName = 'rank';
  } else if (args.roleset) {
    option = args.roleset;
    optionName = 'id';
  } else if (args.name) {
    option = args.name;
    optionName = 'name';
  }
  var isArray = page instanceof Array;
  var group = {
    players: [],
    stream: args.stream || false,
    total: 0
  };
  if (page && !isArray) {
    page = [page];
  } else if (page) {
    page = page.sort(function (a, b) {
      return a - b;
    });
  }
  if (option && !(option instanceof Array)) {
    option = [option];
  }

  function getPages (inputs, rankIndex, role, pages, totalPages) {
    function getPage (i) {
      var page = isArray ? pages[i] : i;
      var httpOpt = {
        url: '//www.roblox.com/Groups/Group.aspx?gid=' + groupId,
        options: {
          method: 'POST',
          form: inputs,
          headers: {
            'User-Agent': 'Mozilla'
          },
          jar: jar()
        }
      };
      var form = httpOpt.options.form;
      form.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlUsers_Footer$ctl01$PageTextBox = page;
      form.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlUsers_Footer$ctl01$HiddenInputButton = '';
      return http(httpOpt)
      .then(function (body) {
        getPlayers(group, rankIndex, role, page, body);
      });
    }
    var start, end;
    var isArray = pages instanceof Array;
    if (isArray) {
      start = 0;
      end = pages.length;
    } else {
      start = 2;
      end = pages + 1;
    }

    return threaded(getPage, start, end);
  }

  function getRolesets (group, groupId, roles, pages, all) {
    var jobs = [];
    var statuses = [];
    for (var i = 0; i < roles.length; i++) {
      (function (i) {
        var role = roles[i];
        var id = role.ID;
        var opt = {
          url: '//www.roblox.com/Groups/Group.aspx?gid=' + groupId,
          getBody: true,
          ignoreCache: true,
          events: {
            ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlRolesetList: id,
            ctl00$cphRoblox$rbxGroupRoleSetMembersPane$currentRoleSetID: id,
            __EVENTTARGET: 'ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlRolesetList',
            __ASYNCPOST: 'true'
          },
          jar: jar(), // Must be an empty jar or stuff just doesn't work correctly
          http: {
            headers: {
              'User-Agent': 'Mozilla'
            }
          }
        };
        jobs.push(generalRequest(opt)
        .then(function (response) {
          var body = response.res.body;
          var inputs = {
            __EVENTTARGET: '',
            __VIEWSTATE: body.match(/__VIEWSTATE\|(.*?)\|/)[1],
            __EVENTVALIDATION: body.match(/__EVENTVALIDATION\|(.*?)\|/)[1],
            __ASYNCPOST: 'true',
            ctl00$cphRoblox$rbxGroupRoleSetMembersPane$currentRoleSetID: id
          };
          var first = pages ? pages.indexOf(1) : 0;
          var totalPlayers = getPlayers(first !== -1 ? group : null, i, role, 1, body, all);
          var totalPages = Math.ceil(totalPlayers / maxPageSize);
          if (all && !group.total) {
            group.total = parseInt(parser.load(response.body)('#MemberCount').text().substring(9), 10);
          } else if (!all) {
            group.total += totalPlayers;
          }
          var page = pages;
          if (pages && first !== -1) {
            page = pages.slice();
            page.splice(first, 1);
          }
          var promise = getPages(inputs, i, role, page || totalPages, totalPages);
          statuses.push({
            completed: promise.getCompleted,
            expected: promise.getExpected
          });
          return promise;
        }));
      })(i);
    }
    getStatus = function () {
      var completed = 0;
      var expected = 0;
      for (var i = 0; i < statuses.length; i++) {
        completed += statuses[i].completed();
        expected += statuses[i].expected();
      }
      return Math.round((completed / expected) * 10000) / 100 || 0;
    };
    return Promise.all(jobs).then(function () {
      if (group.stream) {
        group.stream.end();
      } else {
        group.players = group.players.sort(function (a, b) {
          return a.parent.rankIndex - b.parent.rankIndex || a.index - b.index;
        });
        return group;
      }
    });
  }

  var promise;
  if (optionName === 'id') {
    promise = getRolesets({ID: option});
  } else {
    var rolesets;
    if (option) {
      rolesets = [];
      var opt = {
        group: groupId
      };
      opt[optionName] = option;
      promise = getRole(opt)
      .then(function (roles) {
        return getRolesets(group, groupId, roles, page, false);
      });
    } else {
      promise = getRoles({group: groupId})
      .then(function (roles) {
        return getRolesets(group, groupId, option ? rolesets : roles, page, true);
      });
    }
  }
  promise.getStatus = function () {
    return getStatus();
  };
  return promise;
};
