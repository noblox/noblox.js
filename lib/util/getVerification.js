// Includes
const http = require('./http.js').func
const getHash = require('./getHash.js').func
const getVerificationInputs = require('./getVerificationInputs.js').func
const cache = require('../cache')
const URL = require('url').URL

// Args
exports.required = ['url']
exports.optional = ['ignoreCache', 'getBody', 'jar']

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
