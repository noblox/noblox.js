// Includes
var http = require('./http.js').func
var getHash = require('./getHash.js').func
var getVerificationInputs = require('./getVerificationInputs.js').func
var cache = require('../cache')
var URL = require('url').URL

// Args
exports.required = ['url']
exports.optional = ['ignoreCache', 'getBody', 'jar']

// Define
function getVerification (jar, url, getBody) {
  var httpOpt = {
    url: url,
    options: {
      resolveWithFullResponse: true,
      jar: jar
    }
  }
  return http(httpOpt)
    .then(function (res) {
      var inputs = getVerificationInputs({ html: res.body })
      var match
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
  var jar = args.jar
  if (args.ignoreCache) {
    return getVerification(jar, args.url, args.getBody)
  } else {
    return cache.wrap('Verify', new URL(args.url).pathname + getHash({ jar: jar }), function () {
      return getVerification(jar, args.url, args.getBody)
    })
  }
}
