// Includes
const http = require('./http.js').func
const getHash = require('./getHash.js').func
const getVerificationInputs = require('./getVerificationInputs.js').func
const cache = require('../cache')
const URL = require('url').URL

// Args
exports.required = ['url']
exports.optional = ['ignoreCache', 'getBody', 'jar']

// Docs
/**
 * 🔐 Get the RequestVerificationToken from a url.
 * @category Utility
 * @alias getVerification
 * @param {string} url - The url to get the token from.
 * @param {boolean=} [ignoreCache=false] - Determines whether the cache be ignored or not.
 * @param {boolean=} [getBody=false] - If the body and inputs should be returned in an object
 * @param {CookieJar=} jar - The CookieJar containing the .ROBLOSECURITY cookie.
 * @returns {Promise<GetVerificationResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie.
 * const verificationTokenInfo = await noblox.getVerification()
**/

// Define
function getVerification (jar, url, getBody) {
  const httpOpt = {
    url: url,
    options: {
      resolveWithFullResponse: true,
      jar: jar
    }
  }
  return http(httpOpt)
    .then(function (res) {
      const inputs = getVerificationInputs({ html: res.body })
      let match
      if (res.headers && res.headers['set-cookie']) {
        match = res.headers['set-cookie'].toString().match(/__RequestVerificationToken=(.*?);/)
      }
      return {
        body: (getBody ? res.body : null),
        inputs: inputs,
        header: match && match[1]
      }
    })
}

exports.func = function (args) {
  const jar = args.jar
  if (args.ignoreCache) {
    return getVerification(jar, args.url, args.getBody)
  } else {
    return cache.wrap('Verify', new URL(args.url).pathname + getHash({ jar: jar }), function () {
      return getVerification(jar, args.url, args.getBody)
    })
  }
}
