const http = require('../util/http.js').func

exports.optional = ['featureNames', 'jar']

// Docs
/**
 * Get the rollout settings.
 * @category Chat
 * @alias getRolloutSettings
 * @param {Array=} featureNames - The names of the features rollingout.
 * @returns {Promise<GetRolloutSettingsResult>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * const settings = await noblox.getRolloutSettings()
**/

exports.func = (args) => {
  const jar = args.jar
  const featureNames = typeof (args.featureNames) === 'object' ? args.featureNames : []

  return http({
    url: '//chat.roblox.com/v2/get-rollout-settings?featureNames=' + featureNames.join('&featureNames='),
    options: {
      method: 'GET',
      jar: jar,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode !== 200) {
      throw new Error('You are not logged in')
    } else {
      return JSON.parse(res.body)
    }
  })
}
