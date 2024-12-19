// Dependencies
const util = require('util')
let request = util.promisify(require('postman-request'))

// Includes
const options = require('../options.js')
const settings = require('../../settings.json')
const cache = require('../cache')
const getHash = require('./getHash.js').func

// Args
exports.required = ['url']
exports.optional = ['options', 'ignoreLoginError']

// Define
request = request.defaults({
  forever: true,
  agentOptions: {
    maxSockets: Infinity
  },
  simple: false,
  gzip: true,
  timeout: settings.timeout
})

// Docs
/**
 * ✅ Send an http request to url with options.
 * @category Utility
 * @alias http
 * @param {string} url - The url to request to.
 * @param {object} options - The options to send with the request.
 * @param {boolean} ignoreLoginError - If any login errors should be ignored.
 * @returns {Promise<string>}
 * @example const noblox = require("noblox.js")
 * const body = await noblox.http("https://roblox.com/login", { method: "GET" })
**/

function http (url, opt) {
  if (opt && !opt.jar && Object.keys(opt).indexOf('jar') > -1) {
    opt.jar = options.jar
  }
  if (settings.session_only && opt && opt.jar) {
    if (!opt.headers) {
      opt.headers = {}
    }
    opt.headers.cookie = '.ROBLOSECURITY=' + opt.jar.session + ';'
    opt.headers['x-api-key'] = opt.jar.apiKey
    opt.jar = null
  }
  if (opt && opt.verification) {
    if (!opt.headers) {
      opt.headers = {}
    }
    const verify = '__RequestVerificationToken=' + opt.verification + ';'
    if (opt.headers.cookie) {
      opt.headers.cookie += verify
    } else {
      opt.headers.cookie = verify
    }
  }
  if (url.indexOf('http') !== 0) {
    url = 'https:' + url
  }
  if (process?.env.CI && process.env.FORWARDER_URL) {
    const urlObj = new URL(url)
    const { hostname } = urlObj

    opt.headers["Destination-Host"] = hostname
    opt.headers["x-serverless-authorization"] = process.env.ID_TOKEN
    urlObj.hostname = process.env.FORWARDER_URL
    url = urlObj.href
  }
  return request(url, opt)
}

exports.func = function (args) {
  const opt = args.options || {}
  if (typeof opt.jar === 'string') {
    opt.jar = { session: opt.jar }
  }
  const jar = opt.jar
  let depth = args.depth || 0
  const full = opt.resolveWithFullResponse || false
  opt.resolveWithFullResponse = true
  const follow = opt.followRedirect === undefined || opt.followRedirect
  opt.followRedirect = function (res) {
    if (!args.ignoreLoginError && res.headers.location && (res.headers.location.startsWith('https://www.roblox.com/newlogin') || res.headers.location.startsWith('/Login/Default.aspx'))) {
      return false
    }
    return follow
  }
  return http(args.url, opt).then(function (res) {
    if (opt && opt.headers && opt.headers['X-CSRF-TOKEN']) {
      if (res.statusCode === 403) {
        let message

        try {
          message = typeof res.body === 'string' ? JSON.parse(res.body).message : res.body.message
        } catch (_) {
          // Roblox didn't send back a properly formed json object
        }

        if (message === 'XSRF Token Validation Failed' || message === 'Token Validation Failed') {
          depth++

          if (depth >= 3) {
            throw new Error('Tried ' + depth + ' times and could not refresh XCSRF token successfully')
          }

          const token = res.headers['x-csrf-token']

          if (token) {
            opt.headers['X-CSRF-TOKEN'] = token
            opt.jar = jar
            args.depth = depth + 1
            return exports.func(args)
          } else {
            throw new Error('Could not refresh X-CSRF-TOKEN')
          }
        }
      } else {
        if (depth > 0) {
          cache.add(options.cache, 'XCSRF', getHash({ jar }), opt.headers['X-CSRF-TOKEN'])
        }
      }
    }
    if (res.statusCode === 302 && !args.ignoreLoginError && res.headers.location && (res.headers.location.startsWith('https://www.roblox.com/newlogin') || res.headers.location.startsWith('/Login/Default.aspx'))) {
      throw new Error('You are not logged in')
    }
    return full ? res : res.body
  })
}
