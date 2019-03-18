var rbx = require('roblox-js')
var ProgressBar = require('progress')
var js = require('JSONStream')
var fs = require('fs')
var group = 0
var username = ''
var password = ''

rbx.login(username, password)
  .then(function () {
    console.time('Time: ')
    var stream = js.stringify('[\n', ',\n', '\n]\n')
    stream.pipe(fs.createWriteStream('./wall.json'))
    var promise = rbx.getWall({
      group: group,
      stream: stream
    })
    var bar = new ProgressBar('Retrieving [:bar] :current/:total = :percent :etas remaining ', { total: 10000 })
    var ivl = setInterval(function () {
      bar.update(promise.getStatus() / 100)
    }, 1000)
    promise.then(function (wall) {
      console.log('Done')
      console.timeEnd('Time: ')
      clearInterval(ivl)
    })
  })
