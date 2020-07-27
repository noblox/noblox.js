// Includes
const options = require('../options.js')
const getGeneralToken = require('./getGeneralToken.js').func
const getVerification = require('./getVerification.js').func
const getCurrentUser = require('./getCurrentUser.js').func
const http = require('./http.js').func
const cookieFile = './cookie'
const fs = require('fs')
// Args
exports.required = ['cookie']
exports.optional = []

const day = 86400000

// Define
const relog = (cookie) => {
  if (!cookie) throw new Error('no cookie supplied?')
  options.jar.session = cookie
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
          const cookies = res.headers['set-cookie']
          if (cookies) {
            options.jar.session = cookies.toString().match(/\.ROBLOSECURITY=(.*?);/)[1]

            fs.writeFile(cookieFile, JSON.stringify({ cookie: options.jar.session, time: Date.now() }), (err) => {
              if (err) {
                console.error('Failed to write cookie')
              }
              return true
            })
          }
        })
      })
    })
}
module.exports = c

async function c (cookie) {
  // Check for file
  if (fs.existsSync(cookieFile)) {
    const json = JSON.parse(fs.readFileSync(cookieFile))

    // Check its new enough
    if (json.time + day > Date.now()) {
      // Its recent enough. Try it.
      try {
        await relog(json.cookie)
        return getCurrentUser({})
      } catch (e) {
        console.log('Stored relog failed. Trying with given.')
      }
    }
  }
  if (cookie) {
    // Try the user's cookie
    try {
      await relog(cookie)
      return getCurrentUser({})
    } catch (e) {
      console.error(e)
    }
  }
  throw new Error('No cookie supplied and no cookie file available.')
}
