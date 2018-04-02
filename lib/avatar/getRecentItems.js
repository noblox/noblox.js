<<<<<<< HEAD
let http = require('../util/http.js').func
=======
const http = require('../util/http.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.optional = ['listType', 'jar']

exports.func = (args) => {
<<<<<<< HEAD
    let jar = args.jar,
        listType = typeof(args.listType) == 'string' ? args.listType : 'All'
    
    return http({
        url: '//avatar.roblox.com/v1/recent-items/' + listType + '/list',
        options: {
            method: 'GET',
            jar: jar,
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode === 401) {
            throw new Error('You are not logged in')
        } else if (res.statusCode === 400) {
            throw new Error('Invalid list type')
        } else {
            return JSON.parse(res.body)
        }
    })
}
=======
  let jar = args.jar
  let listType = typeof (args.listType) === 'string' ? args.listType : 'All'

  return http({
    url: '//avatar.roblox.com/v1/recent-items/' + listType + '/list',
    options: {
      method: 'GET',
      jar: jar,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 401) {
      throw new Error('You are not logged in')
    } else if (res.statusCode === 400) {
      throw new Error('Invalid list type')
    } else {
      return JSON.parse(res.body)
    }
  })
}
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
