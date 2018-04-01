let http = require('../util/http.js').func,
  getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['height', 'width', 'head']
exports.optional = ['depth', 'proportion', 'bodyType', 'jar']

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
