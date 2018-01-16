let http = require('../util/http.js').func

exports.required = ['conversationIds']
exports.optional = ['pageSize', 'jar']

exports.func = (args) => {
    let jar = args.jar,
        conversationIds = typeof(args.conversationIds) === 'object' ? args.conversationIds : [],
        pageSize = parseInt(args.pageSize) ? parseInt(args.pageSize) : 30
    
    return http({
        url: '//chat.roblox.com/v2/get-unread-messages?pageSize=' + pageSize + '&conversationIds=' + conversationIds.join('&conversationIds='),
        options: {
            method: 'GET',
            jar: jar,
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode !== 200) {
            throw new Error('You are not logged in')
        } else {
            return JSON.parse(res.body)
        }
    })
}