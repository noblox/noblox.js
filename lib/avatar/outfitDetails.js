<<<<<<< HEAD
let http = require('../util/http.js').func
=======
const http = require('../util/http.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.required = ['outfitId']

exports.func = (args) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
