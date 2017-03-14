// Dependencies
var parser = require('whacko');
var Promise = require('bluebird');

// Includes
var http = require('./util/http.js').func;
var jar = require('./util/jar.js').func;
var getRole = require('./util/getRole.js').func;
var getRoles = require('./util/getRoles.js').func;
var generalRequest = require('./util/generalRequest.js').func;

// Args
exports.required = ['group'];
exports.optional = [['rank', 'roleset', 'name'], 'page'];

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
      players.push({
        id: parseInt(link.attr('href').substring(29), 10),
        name: link.attr('title'),
        online: img.attr('src') === '../images/online.png',
        parent: {
          role: role,
          page: page,
          rankIndex: rankIndex
        },
        index: ((page - 1) * maxPageSize + i)
      });
    }
  }
  $ = null;
  body = null;
  return total;
}

function getPage (group, inputs, groupId, rankIndex, role, pageNumber, tries) {
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
  form.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlUsers_Footer$ctl01$PageTextBox = pageNumber;
  form.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlUsers_Footer$ctl01$HiddenInputButton = '';
  return http(httpOpt)
  .then(function (body) {
    getPlayers(group, rankIndex, role, pageNumber, body);
  })
  .catch(function (err) {
    console.error(err.stack);
    if (!tries || tries < 3) {
      return getPage(group, inputs, groupId, rankIndex, role, pageNumber, tries ? tries + 1 : 0);
    }
  });
}

function getPages (group, inputs, groupId, rankIndex, role, pages, totalPages) {
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
    jobs.push(getPage(group, inputs, groupId, rankIndex, role, page));
  }
  return Promise.all(jobs);
}

function getRolesets (group, groupId, roles, pages, all) {
  var jobs = [];
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
        return getPages(group, inputs, groupId, i, role, page || totalPages, totalPages);
      }));
    })(i);
  }
  return Promise.all(jobs).then(function () {
    group.players = group.players.sort(function (a, b) {
      return a.parent.rankIndex - b.parent.rankIndex || a.index - b.index;
    });
    return group;
  });
}

exports.func = function (args) {
  var page = args.page;
  var groupId = args.group;
  var option;
  var optionName;
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
    return Math.round((group.total ? group.players.length / group.total : 0) * 10000) / 100;
  };
  return promise;
};
