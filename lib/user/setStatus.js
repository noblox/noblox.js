let http = require('../util/http.js').func,
    getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['statusText']
exports.optional = ['jar']

let setStatus = (jar, token, statusText) => {
    /*
        not sure what the problem is here;
        outputs an error in the console, but still
        updates authenticated user's status, as
        expected
    */
    
    return http({
        url: '//www.roblox.com/home/updatestatus',
        options: {
            method: 'POST',
            jar: jar,
            headers: {
                'X-CSRF-TOKEN': token
            },
            form: {
                status: statusText
            },
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode === 200) {
            if (!res.body.success) {
                throw new Error(res.body.message)
            }
        } else {
            throw new Error('Set status failed')
        }
    })
}

exports.func = (args) => {
    let jar = args.jar
    
    return getGeneralToken({jar: jar}).then((xcsrf) => {
        return setStatus(jar, xcsrf, args.statusText)
    })
}