// Args
exports.required = ['row']

// Define
const regex = [
  /rank from (.+) to (.+)\.$/,
  /deleted post "(.+)" by user .+\.$/,
  /changed the group status to: (.*)$/
]
// This is no longer used within the library and is maintained only for the purposes of backwards compatibility
// TODO: Remove this in next Semver major version

exports.func = function (args) {
  const row = args.row
  const text = row.text()
  const params = []
  for (let i = 0; i < regex.length; i++) {
    const match = text.match(regex[i])
    if (match) {
      for (let j = 1; j < match.length; j++) {
        params.push(match[j])
      }
    }
  }
  const target = row.find('a').last().attr('href')
  let found = target.match(/\?ID=(\d+)$/)
  if (!found) {
    found = target.match(/^games\/(\d+)\//)
  }
  found = found && parseInt(found[1], 10)
  return {
    target: found,
    params: params
  }
}
