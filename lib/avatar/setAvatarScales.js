<<<<<<< HEAD
let http = require('../util/http.js').func,
    getGeneralToken = require('../util/getGeneralToken.js').func
=======
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.required = ['height', 'width', 'head']
exports.optional = ['depth', 'proportion', 'bodyType', 'jar']

<<<<<<< HEAD
let nextFunction = (jar, token, height, width, head, depth, proportion, bodyType) => {
    return http({
        url: '//avatar.roblox.com/v1/avatar/set-scales',
        options: {
            method: 'POST',
            jar: jar,
            headers: {
                'X-CSRF-TOKEN': token
            },
            json: {
                height: height,
                width: width,
                head: head,
                depth: depth,
                proportion: proportion,
                bodyType: bodyType
            },
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode === 200) {
            if (!res.body.success) {
                throw new Error(res.body)
            }
        } else {
            throw new Error('Set avatar scale failed')
        }
    })
}

exports.func = (args) => {
    let jar = args.jar
    
    return getGeneralToken({jar: jar}).then((xcsrf) => {
        return nextFunction(jar, xcsrf, args.height, args.width, args.head, args.depth, args.proportion, args.bodyType)
    })
}
=======
const nextFunction = (jar, token, height, width, head, depth, proportion, bodyType) => {
  return http({
    url: '//avatar.roblox.com/v1/avatar/set-scales',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        height: height,
        width: width,
        head: head,
        depth: depth,
        proportion: proportion,
        bodyType: bodyType
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.success) {
        throw new Error(res.body)
      }
    } else {
      throw new Error('Set avatar scale failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({jar: jar}).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.height, args.width, args.head, args.depth, args.proportion, args.bodyType)
  })
}
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
