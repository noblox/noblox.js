const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['userIds', 'title']
exports.optional = ['jar']

const nextFunction = (jar, token, userIds, chatTitle) => {
  return http({
    url: '//chat.roblox.com/v2/start-group-conversation',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        participantUserIds: userIds,
        title: chatTitle
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.resultType === 'Success') {
        throw new Error(res.body.statusMessage)
      }
    } else {
      throw new Error('Start group chat failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.userIds, args.title)
  })
}
