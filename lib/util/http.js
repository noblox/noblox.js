// Dependencies
const Stream = require('stream')

// Includes
const options = require('../options.js')
const settings = require('../../settings.json')
const cache = require('../cache')
const getHash = require('./getHash.js').func

// Args
exports.required = ['url']
exports.optional = ['options', 'ignoreLoginError']

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

  if (opt.method !== 'GET') {
    if (!opt.headers) opt.headers = {}

    const form = opt.form || opt.formData

    if (opt.body instanceof Stream) {
      opt.duplex = 'half'
    } else if ((opt.body instanceof Object && !(opt.body instanceof FormData)) || opt.json instanceof Object) {
      opt.body = JSON.stringify(opt.body || opt.json)
    } else if (form && !(form instanceof FormData)) {
      delete opt.form
      delete opt.formData

      const requestForm = new FormData()

      for (const [key, value] of Object.entries(form)) {
        requestForm.set(key, value instanceof Object ? JSON.stringify(value) : String(value))
      }

      opt.body = requestForm
    }
  }

  if (opt.qs) {
    url += '?' + Object.entries(opt.qs)
      .map((key, value) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
      .join('&')

    delete opt.qs
  }

  opt.signal = AbortSignal.timeout(settings.timeout)
  opt.redirect = 'manual'

  return fetch(url, opt).then(async (response) => {
    // Manual redirect handling
    const redirectUrl = response.headers.get('location')

    if (redirectUrl && opt.followRedirect(response)) {
      return http(redirectUrl, opt)
    }

    // Parse appropriate body
    const body = !redirectUrl && response?.headers?.get('content-type')?.includes('application/json') ? await response.json() : await response.text()

    // Overwite body with actual body, not a stream. Make the rest of the response still accessible.
    return {
      body,
      bodyUsed: response.bodyUsed,
      headers: response.headers,
      ok: response.ok,
      status: response.status,
      statusCode: response.status,
      statusText: response.statusText,
      type: response.type,
      url: response.url
    }
  }).catch((err) => {
    throw err
  })
}

exports.func = function (args) {
  const opt = args.options || {}
  if (typeof opt.jar === 'string') {
    opt.jar = { session: opt.jar }
  }
  const jar = opt.jar
  let depth = args.depth || 0
  const full = opt.resolveWithFullResponse
  const follow = opt.followRedirect === undefined || opt.followRedirect
  opt.followRedirect = function (res) {
    if (!args.ignoreLoginError && res.headers.get('location') && (res.headers.get('location').startsWith('https://www.roblox.com/newlogin') || res.headers.get('location').startsWith('/Login/Default.aspx'))) {
      return false
    }
    return follow
  }
  return http(args.url, opt).then(function (res) {
    if (opt && opt.headers && opt.headers['X-CSRF-TOKEN']) {
      if (res.statusCode === 403 && (res.statusMessage === 'XSRF Token Validation Failed' || res.statusMessage === 'Token Validation Failed')) {
        depth++
        if (depth >= 3) {
          throw new Error('Tried ' + depth + ' times and could not refresh XCSRF token successfully')
        }
        const token = res.headers.get('x-csrf-token')
        if (token) {
          opt.headers['X-CSRF-TOKEN'] = token
          opt.jar = jar
          args.depth = depth + 1
          return exports.func(args)
        } else {
          throw new Error('Could not refresh X-CSRF-TOKEN')
        }
      } else {
        if (depth > 0) {
          cache.add(options.cache, 'XCSRF', getHash({ jar }), opt.headers['X-CSRF-TOKEN'])
        }
      }
    }
    if (res.statusCode === 302 && !args.ignoreLoginError && res.headers.get('location') && (res.headers.get('location').startsWith('https://www.roblox.com/newlogin') || res.headers.get('location').startsWith('/Login/Default.aspx'))) {
      throw new Error('You are not logged in')
    }
    return full ? res : res.body
  })
}
