<<<<<<< HEAD
let http = require('../util/http.js').func,
    getGeneralToken = require('../util/getGeneralToken.js').func
=======
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.required = ['placeId']
exports.optional = ['jar']

<<<<<<< HEAD
let nextFunction = (jar, token, placeId) => {
    return http({
        url: '//chat.roblox.com/v2/start-cloud-edit-conversation',
        options: {
            method: 'POST',
            jar: jar,
            headers: {
                'X-CSRF-TOKEN': token
            },
            json: {
                placeId: placeId
            },
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode === 200) {
            if (!res.body.resultType === 'Success') {
                throw new Error(res.body.statusMessage)
            }
        } else {
            throw new Error('Start cloud edit chat failed')
        }
    })
}

exports.func = (args) => {
    let jar = args.jar
    
    return getGeneralToken({jar: jar}).then((xcsrf) => {
        return nextFunction(jar, xcsrf, args.placeId)
    })
}
=======
const nextFunction = (jar, token, placeId) => {
  return http({
    url: '//chat.roblox.com/v2/start-cloud-edit-conversation',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        placeId: placeId
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.resultType === 'Success') {
        throw new Error(res.body.statusMessage)
      }
    } else {
      throw new Error('Start cloud edit chat failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({jar: jar}).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.placeId)
  })
}
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
