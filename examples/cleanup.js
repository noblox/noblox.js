// Exile specific members in a group, including by rank and by name. Useful for cleaning up bots.
const rbx = require('noblox.js')
const ProgressBar = require('progress')
const cookie = ''
const group = 0
const rank = null // Make this the rank number if you want to use rank.
const pages = null

rbx.setCookie(cookie)
  .then(function () {
  // This allows you to retrieve only a specific set of pages.
  /* pages = [];
  for (const i = 0; i <= 100; i++) {
    pages.push(i);
  } */
    const getPlayers = new ProgressBar('Getting players [:bar] :current/:total = :percent :etas remaining ', { total: 10000 })
    const promise = rbx.getPlayers(group, rank, pages)
    promise.then(function (res) {
      const plrs = res.players
      // This allows you to select only players that have a specific string in their name.
      /* for (const i = plrs.length - 1; i >= 0; i--) {
      const plr = plrs[i];
      if (!plr.name.includes('Bot')) {
        plrs.splice(i, 1);
      }
    } */
      rbx.getGeneralToken()
        .then(function () {
          rbx.getRolesetInGroupWithJar(group)
            .then(function (roleset) {
              const exile = new ProgressBar('Exiling [:bar] :current/:total = :percent :etas remaining ', { total: 10000 })
              console.time('Time: ')
              const thread = rbx.threaded(function (i) {
                return rbx.exile({ group: group, target: plrs[i].id, senderRolesetId: roleset })
              }, 0, plrs.length)
              const ivl = setInterval(function () {
                exile.update(thread.getStatus() / 100)
              }, 1000)
              thread.then(function () {
                clearInterval(ivl)
                console.timeEnd('Time: ')
              })
            })
        })
    })
    const ivl = setInterval(function () {
      getPlayers.update(promise.getStatus() / 100)
    }, 1000)
    promise.then(function () {
      clearInterval(ivl)
    })
  })
