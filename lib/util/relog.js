// Includes
var options = require('../options.js')
var getGeneralToken = require('./getGeneralToken.js').func
var getVerification = require('./getVerification.js').func
var getCurrentUser = require('./getCurrentUser.js').func
var http = require('./http.js').func
var cookieFile = './cookie'
var fs = require('fs')
// Args
exports.required = ['cookie']
exports.optional = []

var day = 86400000

// Define
const relog = (args) => {
  if (!args.cookie) throw new Error('no cookie supplied?')
  options.jar.session = args.cookie

  return getVerification({ url: 'https://www.roblox.com/my/account#!/security' })
    .then((ver) => {
      if (!ver.header) console.log('Bad cookie.')
      return getGeneralToken({}).then((token) => {
        return http({
          url: 'https://www.roblox.com/authentication/signoutfromallsessionsandreauthenticate',
          options: {
            method: 'POST',
            resolveWithFullResponse: true,
            verification: ver.header,
            jar: null,
            headers: {
              'X-CSRF-TOKEN': token
            },
            form: {
              __RequestVerificationToken: ver.inputs.__RequestVerificationToken
            }
          }
        }).then((res) => {
          var cookies = res.headers['set-cookie']
          if (cookies) {
            options.jar.session = cookies.toString().match(/\.ROBLOSECURITY=(.*?);/)[1]

            if (typeof args.saveCookie === 'function') {
              args.saveCookie(options.jar.session)
            } else {
              fs.writeFile(cookieFile, JSON.stringify({ cookie: options.jar.session, time: Date.now() }), (err) => {
                if (err) {
                  console.error('Failed to write cookie')
                }
                return true
              })
            }
          }
        })
      })
    })
}
module.exports = c

async function c (args = {}) {
  if (typeof args === 'string') { args = { cookie: args } }
  // Check for custom loader
  if (typeof args.loadCookie === 'function') {
    try {
      let { cookie, time } = (await Promise.resolve(args.loadCookie(args))) || {}
      if (cookie && (time == null || time + day > Date.now())) {
        args.cookie = cookie
        await relog(args)
        return getCurrentUser({})
      }
    } catch (e) {
      console.log(`Stored relog failed. Trying with given.`)
    }
  }
  // Check for file
  if (fs.existsSync(cookieFile)) {
    var json = JSON.parse(fs.readFileSync(cookieFile))

    // Check its new enough
    if (json.time + day > Date.now()) {
      // Its recent enough. Try it.
      let givenCookie = args.cookie
      try {
        args.cookie = json.cookie
        await relog(args)
        return getCurrentUser({})
      } catch (e) {
        console.log(`Stored relog failed. Trying with given.`)
        args.cookie = givenCookie
      }
    }
  }
  if (args.cookie) {
    // Try the user's cookie
    try {
      await relog(args)
      return getCurrentUser({})
    } catch (e) {
      console.error(e)
    }
  }
  throw new Error('No cookie supplied and no cookie file available.')
}
