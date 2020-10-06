const path = require('path')
const fs = require('fs')
const include = ['cache']

const rbx = {}

function search (dir) {
  require('fs').readdirSync(dir).forEach(function (file) {
    const stat = fs.statSync(path.join(dir, file))
    if (stat.isFile() || include.indexOf(file) !== -1) {
      rbx[file.replace('.js', '')] = require(dir + '/' + file)
    } else if (stat.isDirectory()) {
      search(path.join(dir, file))
    }
  })
}

search(__dirname)

for (const name in rbx) {
  const exporter = rbx[name]
  if (exporter.hasOwnProperty("func")) {
    module.exports[name] = rbx.wrap.wrapExport(exporter.func, exporter.required || [], exporter.optional || [])
  } else {
    module.exports[name] = rbx[name]
  }
}

exports.options = require('./options.js')
exports.settings = require('../settings.json')
