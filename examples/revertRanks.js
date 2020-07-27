// Revert player ranks to their original rank in a certain range.
const rbx = require('noblox.js')
const ProgressBar = require('progress')
const cookie = ''
const group = 0

const actionTypeId = 6
const targetUser = ''
const startPage = 1
const endPage = 10
const afterDate = new Date('2000-01-01 00:00 CDT')

rbx.setCookie(cookie)
  .then(function () {
    const pages = []
    for (const i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    const audit = new ProgressBar('Getting audit log [:bar] :current/:total = :percent :etas remaining ', { total: 10000 })
    const promise = rbx.getAuditLog({
      group: group,
      action: actionTypeId,
      username: targetUser,
      page: pages
    })
    promise.then(function (audit) {
      const logs = audit.logs
      const original = {}
      for (const i = 0; i < logs.length; i++) {
        const log = logs[i]
        if (log.date > afterDate) {
          original[log.action.target] = log.action.params[0]
        }
      }
      const reset = []
      for (const target in original) {
        reset.push({
          target: target,
          role: original[target]
        })
      }
      // Cache the XCSRF token to prepare for a bunch of requests at once
      rbx.getGeneralToken()
        .then(function () {
          const revert = new ProgressBar('Reverting user ranks [:bar] :current/:total = :percent :etas remaining ', { total: 10000 })
          console.time('Time: ')
          const thread = rbx.threaded(function (i) {
            return rbx.setRank({
              group: group,
              target: reset[i].target,
              name: reset[i].role
            })
          }, 0, reset.length)
          const ivl = setInterval(function () {
            revert.update(thread.getStatus() / 100)
          }, 1000)
          thread.then(function () {
            clearInterval(ivl)
            console.timeEnd('Time: ')
          })
        })
    })
    const ivl = setInterval(function () {
      audit.update(promise.getStatus() / 100)
    }, 1000)
    promise.then(function () {
      clearInterval(ivl)
    })
  })
