<<<<<<< HEAD
let http = require('../util/http.js').func
=======
const http = require('../util/http.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.optional = ['featureNames', 'jar']

exports.func = (args) => {
<<<<<<< HEAD
    let jar = args.jar,
        featureNames = typeof(args.featureNames) === 'object' ? args.featureNames : []
    
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
=======
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
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
