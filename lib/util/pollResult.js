// Includes
const http = require('./http.js').func

// Args
exports.required = ['url']
exports.optional = ['jar']

// Docs
/**
 * 🔐 ☁️ Handle operations requiring polling.
 * @category Utility
 * @alias pollResult
 * @param {string} url - The url of the operation.
 * @returns {Promise<Object>}
 * @example const noblox = require("noblox.js")
 * const response = await noblox.pollResult("https://apis.roblox.com/api/v1/operations/operationId")
**/

// Define
function pollResult (jar, url, retries = 0) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url,
      options: {
        method: 'GET',
        jar,
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt).then((res) => {
      const body = res.body

      if (res.status !== 200) {
        throw new Error(`Poll failed with status code ${res.status}`)
      }

      if (body.done) {
        if (body.response) resolve(body.response)
        else reject(body.error?.message)
      } else {
        setTimeout(() => resolve(pollResult(jar, url, retries + 1)), 2 ** retries * 1000)
      }
    })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  return pollResult(args.jar, args.url)
}
