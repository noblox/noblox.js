// Save all the players in a group to a file with status updates.
const rbx = require('noblox.js')
const ProgressBar = require('progress')
const js = require('JSONStream')
const fs = require('fs')
const group = 0

console.time('Time: ')
const stream = js.stringify('[\n', ',\n', '\n]\n')
stream.pipe(fs.createWriteStream('./players.json'))
const promise = rbx.getPlayers({
  group: group,
  stream: stream
})
const bar = new ProgressBar('Retrieving [:bar] :current/:total = :percent :etas remaining ', { total: 10000 })
const ivl = setInterval(function () {
  bar.update(promise.getStatus() / 100)
}, 1000)
promise.then(function (plrs) {
  console.log('Done')
  console.timeEnd('Time: ')
  clearInterval(ivl)
})
