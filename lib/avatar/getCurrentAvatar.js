let http = require('../util/http.js').func

exports.optional = ['option', 'jar']

exports.func = (args) => {
    let jar = args.jar,
        option = args.option
    
    return http({
        url: '//avatar.roblox.com/v1/avatar',
        options: {
            method: 'GET',
            jar: jar,
            followRedirect: false,
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode !== 200) {
            throw new Error('You are not logged in')
        } else {
            let json = JSON.parse(res.body),
                result = (option ? json[option] : json)
            
            return result
        }
    })
}