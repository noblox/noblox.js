// Args
exports.required = ['row']

// Define
var regex = [
  /rank from (.+) to (.+)\.$/,
  /deleted post "(.+)" by user .+\.$/,
  /changed the group status to: (.*)$/
]

exports.func = function (args) {
  var row = args.row
  var text = row.text()
  var params = []
  for (var i = 0; i < regex.length; i++) {
    var match = text.match(regex[i])
    if (match) {
      for (var j = 1; j < match.length; j++) {
        params.push(match[j])
      }
    }
  }
  var target = row.find('a').last().attr('href')
  var found = target.match(/\?ID=(\d+)$/)
  if (!found) {
    found = target.match(/^games\/(\d+)\//)
  }
  found = found && parseInt(found[1], 10)
  return {
    target: found,
    params: params
  }
}
