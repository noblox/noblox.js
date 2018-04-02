var path = require('path')
var fs = require('fs')
var include = ['cache']

var rbx = {}

function search (dir) {
  require('fs').readdirSync(dir).forEach(function (file) {
    var stat = fs.statSync(path.join(dir, file))
    if (stat.isFile() || include.indexOf(file) !== -1) {
      rbx[file.replace('.js', '')] = require(dir + '/' + file)
    } else if (stat.isDirectory()) {
      search(path.join(dir, file))
    }
  })
}

search(__dirname)

for (var name in rbx) {
  var exporter = rbx[name]
  if (exporter.func) {
    module.exports[name] = rbx.wrap.wrapExport(exporter.func, exporter.required || [], exporter.optional || [])
  } else {
    module.exports[name] = rbx[name]
  }
}

exports.options = require('./options.js')
exports.settings = require('../settings.json')
