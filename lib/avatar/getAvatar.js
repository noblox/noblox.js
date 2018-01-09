let http = require('../util/http.js').func

exports.required = ['userId']

let getAvatar = (userId) => {
    return http({
        url: '//avatar.roblox.com/v1/users/' + userId + '/avatar',
        options: {
            method: 'GET',
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode === 200) {
            return JSON.parse(res.body)
        } else {
            throw new Error('User does not exist')
        }
    })
}

exports.func = (args) => {
    let userId = args.userId
    return getAvatar(userId)
}