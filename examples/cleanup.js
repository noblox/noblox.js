// Exile specific members in a group, including by rank and by name. Useful for cleaning up bots.
var rbx = require('roblox-js')
var ProgressBar = require('progress')
var username = ''
var password = ''
var group = 0
var rank = null // Make this the rank number if you want to use rank.
var pages = null

rbx.login(username, password)
  .then(function () {
  // This allows you to retrieve only a specific set of pages.
  /* pages = [];
  for (var i = 0; i <= 100; i++) {
    pages.push(i);
  } */
    var getPlayers = new ProgressBar('Getting players [:bar] :current/:total = :percent :etas remaining ', {total: 10000})
    var promise = rbx.getPlayers(group, rank, pages)
    promise.then(function (res) {
      var plrs = res.players
      // This allows you to select only players that have a specific string in their name.
      /* for (var i = plrs.length - 1; i >= 0; i--) {
      var plr = plrs[i];
      if (!plr.name.includes('Bot')) {
        plrs.splice(i, 1);
      }
    } */
      rbx.getGeneralToken()
        .then(function () {
          rbx.getRolesetInGroupWithJar(group)
            .then(function (roleset) {
              var exile = new ProgressBar('Exiling [:bar] :current/:total = :percent :etas remaining ', {total: 10000})
              console.time('Time: ')
              var thread = rbx.threaded(function (i) {
                return rbx.exile({group: group, target: plrs[i].id, senderRolesetId: roleset})
              }, 0, plrs.length)
              var ivl = setInterval(function () {
                exile.update(thread.getStatus() / 100)
              }, 1000)
              thread.then(function () {
                clearInterval(ivl)
                console.timeEnd('Time: ')
              })
            })
        })
    })
    var ivl = setInterval(function () {
      getPlayers.update(promise.getStatus() / 100)
    }, 1000)
    promise.then(function () {
      clearInterval(ivl)
    })
  })
