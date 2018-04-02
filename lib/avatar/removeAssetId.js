<<<<<<< HEAD
let http = require('../util/http.js').func,
    getGeneralToken = require('../util/getGeneralToken.js').func
=======
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.required = ['assetId']
exports.optional = ['jar']

<<<<<<< HEAD
let nextFunction = (jar, token, assetId) => {
    return http({
        url: '//avatar.roblox.com/v1/avatar/assets/' + assetId + '/remove',
        options: {
            method: 'POST',
            jar: jar,
            headers: {
                'X-CSRF-TOKEN': token
            },
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode === 200) {
            if (!res.body.success) {
                throw new Error(res.body)
            }
        } else {
            throw new Error('Remove assetId failed')
        }
    })
}

exports.func = (args) => {
    let jar = args.jar
    
    return getGeneralToken({jar: jar}).then((xcsrf) => {
        return nextFunction(jar, xcsrf, args.assetId)
    })
}
=======
const nextFunction = (jar, token, assetId) => {
  return http({
    url: '//avatar.roblox.com/v1/avatar/assets/' + assetId + '/remove',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.success) {
        throw new Error(res.body)
      }
    } else {
      throw new Error('Remove assetId failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({jar: jar}).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.assetId)
  })
}
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
