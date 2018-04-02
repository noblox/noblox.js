<<<<<<< HEAD
let http = require('../util/http.js').func,
    getGeneralToken = require('../util/getGeneralToken.js').func
=======
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.required = ['conversationId', 'message']
exports.optional = ['jar']

let sendChat = (jar, token, conversationId, messageText) => {
<<<<<<< HEAD
    return http({
        url: '//chat.roblox.com/v2/send-message',
        options: {
            method: 'POST',
            jar: jar,
            headers: {
                'X-CSRF-TOKEN': token
            },
            json: {
                conversationId: conversationId,
                message: messageText
            },
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode === 200) {
            if (!res.body.resultType === 'Success') {
                throw new Error(res.body.statusMessage)
            }
        } else {
            throw new Error('Send chat message failed')
        }
    })
}

exports.func = (args) => {
    let jar = args.jar
    
    return getGeneralToken({jar: jar}).then((xcsrf) => {
        return sendChat(jar, xcsrf, args.conversationId, args.message)
    })
}
=======
  return http({
    url: '//chat.roblox.com/v2/send-message',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        conversationId: conversationId,
        message: messageText
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.resultType === 'Success') {
        throw new Error(res.body.statusMessage)
      }
    } else {
      throw new Error('Send chat message failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({jar: jar}).then((xcsrf) => {
    return sendChat(jar, xcsrf, args.conversationId, args.message)
  })
}
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
