// Includes
var http = require('../util/http.js').func
var cache = require('../cache')

// Args
exports.required = ['username']

// Define
function getIdFromUsername (username) {
  var httpOpt = {
    url: '//api.roblox.com/users/get-by-username?username=' + username
  }
  return http(httpOpt)
    .then(function (body) {
      var json = JSON.parse(body)
      var id = json.Id
      var errorMessage = json.errorMessage
      var message = json.message
      if (id) {
        return id
      } else if (errorMessage || message) {
        throw new Error(errorMessage || message)
      }
    })
}

exports.func = function (args) {
  var username = args.username
  // Case does not affect the result and should not affect the cache
  return cache.wrap('IDFromName', username.toLowerCase(), function () {
    return getIdFromUsername(username)
  })
}
