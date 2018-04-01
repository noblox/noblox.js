const http = require('../util/http.js').func

exports.optional = ['featureNames', 'jar']

exports.func = (args) => {
  const jar = args.jar
  let featureNames = typeof (args.featureNames) === 'object' ? args.featureNames : []

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
