// Includes
var http = require('../util/http.js').func
var options = require('../options.js')
var settings = require('../../settings.json')
var clearSession = require('../util/clearSession.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func
var getJar = require('../util/jar.js').func

// Args
exports.required = ['username', 'password']
exports.optional = ['jar']

// Define
function login (jar, token, username, password) {
  clearSession({ jar: jar })
  var url = '//auth.roblox.com/v2/login'
  var post = {
    ctype: 'Username',
    cvalue: username,
    password: password
  }
  var httpOpt = {
    url: url,
    options: {
      method: 'POST',
      json: post,
      resolveWithFullResponse: true,
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      }
    }
  }
  return http(httpOpt)
    .then(function (res) {
      var body = res.body
      if (res.statusCode === 200) {
        if (body.twoStepVerificationData) {
          throw new Error('Two step verification is not supported')
        }
        if (settings.session_only) {
          var cookies = res.headers['set-cookie'] // If the user is already logged in a new cookie will not be returned.
          if (cookies) {
            var session = cookies.toString().match(/\.ROBLOSECURITY=(.*?);/)[1]
            jar.session = session
          }
        }
        return body.user
      } else {
        if (body.errors && body.errors.length > 0) {
          var errors = body.errors.map((e) => {
            return e.message
          })
          throw new Error('Login failed: ' + errors.join(', '))
        }
      }
    })
}

exports.func = function (args) {
  var jar = args.jar || options.jar
  var username = args.username
  var password = args.password
  return getGeneralToken({ jar: getJar() }) // Get token is as if you are not logged in
    .then(function (xcsrf) {
      return login(jar, xcsrf, username, password)
    })
}
