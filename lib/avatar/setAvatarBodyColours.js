<<<<<<< HEAD
let http = require('../util/http.js').func,
    getGeneralToken = require('../util/getGeneralToken.js').func
=======
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.required = ['headColorId', 'torsoColorId', 'rightArmColorId', 'leftArmColorId', 'rightLegColorId', 'leftLegColorId']
exports.optional = ['jar']

<<<<<<< HEAD
let nextFunction = (jar, token, headColorId, torsoColorId, rightArmColorId, leftArmColorId, rightLegColorId, leftLegColorId) => {
    return http({
        url: '//avatar.roblox.com/v1/avatar/set-body-colors',
        options: {
            method: 'POST',
            jar: jar,
            headers: {
                'X-CSRF-TOKEN': token
            },
            json: {
                headColorId: headColorId,
                torsoColorId: torsoColorId,
                rightArmColorId: rightArmColorId,
                leftArmColorId: leftArmColorId,
                rightLegColorId: rightLegColorId,
                leftLegColorId: leftLegColorId
            },
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode === 200) {
            if (!res.body.success) {
                throw new Error(res.body)
            }
        } else {
            throw new Error('Set body colours failed')
        }
    })
}

exports.func = (args) => {
    let jar = args.jar
    
    return getGeneralToken({jar: jar}).then((xcsrf) => {
        return nextFunction(jar, xcsrf, args.headColorId, args.torsoColorId, args.rightArmColorId, args.leftArmColorId, args.rightLegColorId, args.leftLegColorId)
    })
}
=======
const nextFunction = (jar, token, headColorId, torsoColorId, rightArmColorId, leftArmColorId, rightLegColorId, leftLegColorId) => {
  return http({
    url: '//avatar.roblox.com/v1/avatar/set-body-colors',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        headColorId: headColorId,
        torsoColorId: torsoColorId,
        rightArmColorId: rightArmColorId,
        leftArmColorId: leftArmColorId,
        rightLegColorId: rightLegColorId,
        leftLegColorId: leftLegColorId
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.success) {
        throw new Error(res.body)
      }
    } else {
      throw new Error('Set body colours failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({jar: jar}).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.headColorId, args.torsoColorId, args.rightArmColorId, args.leftArmColorId, args.rightLegColorId, args.leftLegColorId)
  })
}
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
