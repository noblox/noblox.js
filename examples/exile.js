// Exile all the members in a group. You can also set rank to something if you want to exile a specific rank.

var rbx = require('roblox-js');
var username = '';
var password = '';
var group = 147864;
var rank = null;

rbx.login(username, password)
.then(function () {
  console.log('Getting players');
  rbx.getPlayers(group, rank)
  .then(function (res) {
    var plrs = res.players;
    rbx.getGeneralToken()
    .then(function () {
      console.log('Queueing exile requests');
      for (var i = 0; i < plrs.length; i++) {
        rbx.exile({group: group, target: plrs[i].id});
      }
      console.log('Exiling');
    });
  });
});
