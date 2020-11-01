// Includes
const http = require('./http.js').func
const getVerification = require('./getVerification.js').func

// Args
exports.required = ['url', 'events']
exports.optional = ['http', 'ignoreCache', 'getBody', 'jar']

// Docs
/**
 * Get the verification inputs and send a request.
 * @category Utility
 * @alias generalRequest
 * @param {string} url - The url to post to.
 * @param {Object} events - Form data to send with the request.
 * @param {boolean=} [ignoreCache=false] - Whether to ignore the cache or not.
 * @param {boolean=} [getBody=false] - Whether to return the original body before the POST request.
 * @param {CookieJar=} jar - The CookieJar containing the .ROBLOSECURITY cookie.
 * @returns {Promise<Object>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie.
 * noblox.generalRequest("//www.roblox.com/Groups/Group.aspx?gid=1", { __EVENTTARGET: 'JoinGroupDiv', __EVENTARGUMENT: 'Click' })
**/

// Define
function general (jar, url, inputs, events, customOpt, body) {
  for (const input in events) {
    inputs[input] = events[input]
  }
  const httpOpt = {
    url: url,
    options: {
      resolveWithFullResponse: true,
      method: 'POST',
      form: inputs,
      jar: jar
    }
  }
  if (customOpt) {
    if (customOpt.url) {
      delete customOpt.url
    }
    Object.assign(httpOpt.options, customOpt)
  }
  return http(httpOpt).then(function (res) {
    return {
      res: res,
      body: body
    }
  })
}

exports.func = function (args) {
  const jar = args.jar
  const url = args.url
  const custom = args.http
  return getVerification({ url: custom ? (custom.url || url) : url, jar: jar, ignoreCache: args.ignoreCache, getBody: args.getBody })
    .then(function (response) {
      return general(jar, url, response.inputs, args.events, args.http, response.body)
    })
}
