let http = require('../util/http.js').func,
    getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['conversationId', 'endMessageId']
exports.optional = ['jar']

let nextFunction = (jar, token, conversationId, endMessageId) => {
    return http({
        url: '//chat.roblox.com/v2/mark-as-read',
        options: {
            method: 'POST',
            jar: jar,
            headers: {
                'X-CSRF-TOKEN': token
            },
            json: {
                conversationId: conversationId,
                endMessageId: endMessageId
            },
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode === 200) {
            if (!res.body.resultType === 'Success') {
                throw new Error(res.body.statusMessage)
            }
        } else {
            throw new Error('Mark as read failed')
        }
    })
}

exports.func = (args) => {
    let jar = args.jar
    
    return getGeneralToken({jar: jar}).then((xcsrf) => {
        return nextFunction(jar, xcsrf, args.conversationId, args.endMessageId)
    })
}