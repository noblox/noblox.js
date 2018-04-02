<<<<<<< HEAD
let http = require('../util/http.js').func
=======
const http = require('../util/http.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.optional = ['option', 'jar']

exports.func = (args) => {
<<<<<<< HEAD
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
=======
  let jar = args.jar
  let option = args.option

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
      let json = JSON.parse(res.body)
      let result = (option ? json[option] : json)

      return result
    }
  })
}
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
