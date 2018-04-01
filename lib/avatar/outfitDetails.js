let http = require('../util/http.js').func

exports.required = ['outfitId']

exports.func = (args) => {
  let outfitId = args.outfitId

  return http({
    url: '//avatar.roblox.com/v1/outfits/' + outfitId + '/details',
    options: {
      method: 'GET',
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      return JSON.parse(res.body)
    } else {
      throw new Error('Outfit does not exist')
    }
  })
}
