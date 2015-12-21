// Dependencies
var http = require('./util/http.js');
var cheerio = require('cheerio');
var getVerificationInputs = require('./util/getVerificationInputs.js');

// Define
function getPlayersOnPage(players, html, limit, online) {
  var $ = cheerio.load(html);
  $('div[class=Avatar]').each(function(index, element) {
    if (limit && players.add.length >= limit) {
      return;
    }
    var link = $(element).find('a').first();
    var img = $(element).find('span').find('image').first();
    if (!online || img.attr('src') == '../images/online.png') {
      var id = link.attr('href').match(/\d+/)[0];
      var add = {};
      add[link.attr('title')] = id;
      players.add.push(add);
    }
  });
}

function getPlayersInRole(players, done, url, role, online, limit, callbacks) {
  var completed = 1;
  http(url, {method: 'GET'}, function(err, res, body) {
    if (err && callbacks.failure) {
      if (callbacks.always)
        callbacks.always();
      callbacks.failure(err, 'getPlayers1');
    } else {
      var post = getVerificationInputs(body);
      post.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlRolesetList = role;
      post.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$currentRoleSetID = role;
      post.__ASYNCPOST = 'true';

      http(url, {method: 'POST', form: post, headers: {'User-Agent': 'Mozilla'}}, function(err, res, body) {
        if (err && callbacks.failure) {
          if (callbacks.always)
            callbacks.always();
          callbacks.failure(err, 'getPlayers2');
        } else {
          var $ = cheerio.load(body);
          var pages = parseInt($('div[id=ctl00_cphRoblox_rbxGroupRoleSetMembersPane_dlUsers_Footer_ctl01_Div1]').find('div[class=paging_pagenums_container]').text(), 10) || 1;
          if (limit) {
            pages = Math.min(pages, Math.ceil(limit/12));
          }
          getPlayersOnPage(players, body, limit, online);
          if (pages == 1) {
            done();
            return;
          }

          delete post.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlRolesetList;
          post.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlUsers_Footer$ctl01$PageTextBox = 1;
          post.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlUsers_Footer$ctl01$HiddenInputButton = '';

          for (var i = 2; i <= pages; i++) {
            post.ctl00$cphRoblox$rbxGroupRoleSetMembersPane$dlUsers_Footer$ctl01$PageTextBox = i;

            http(url, {method: 'POST', form: post, headers: {'User-Agent': 'Mozilla'}}, function(err, res, body) {
              completed++;
              if (err && callbacks.failure) {
                if (callbacks.always)
                  callbacks.always();
                callbacks.failure(err, 'getPlayers3');
              } else
                getPlayersOnPage(players, body, limit, online);
              if (completed >= pages) {
                done();
                return;
              }
            });
          }
        }
      });
    }
  });
}

module.exports = function(group, roles, online, limit, callbacks) {
  var players = {add: []};
  var url = 'http://www.roblox.com/Groups/group.aspx?gid=' + group;
  var completed = 0;

  function done() {
    completed++;
    if (completed >= roles.length) {
      if (callbacks.always)
        callbacks.always();
      if (callbacks.success)
        callbacks.success(players.add);
    }
  }

  for (var i = 0; i < roles.length; i++) {
    getPlayersInRole(players, done, url, roles[i].ID, online, limit, callbacks);
  }
};
