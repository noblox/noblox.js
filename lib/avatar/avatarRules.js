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
        url: '//avatar.roblox.com/v1/avatar-rules',
        options: {
            method: 'GET',
            jar: jar,
            followRedirect: false,
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode === 200) {
            let json = JSON.parse(res.body),
                result = (option ? json[option] : json)
            
            return result
        } else {
            throw new Error('Error fetching avatar rules')
        }
    })
}
=======
  const jar = args.jar
  const option = args.option

  return http({
    url: '//avatar.roblox.com/v1/avatar-rules',
    options: {
      method: 'GET',
      jar: jar,
      followRedirect: false,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      const json = JSON.parse(res.body)
      const result = (option ? json[option] : json)

      return result
    } else {
      throw new Error('Error fetching avatar rules')
    }
  })
}
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
