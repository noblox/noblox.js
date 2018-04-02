<<<<<<< HEAD
let http = require('../util/http.js').func
=======
const http = require('../util/http.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.required = ['conversationIds']
exports.optional = ['pageSize', 'jar']

exports.func = (args) => {
<<<<<<< HEAD
    let jar = args.jar,
        conversationIds = typeof(args.conversationIds) === 'object' ? args.conversationIds : [],
        pageSize = parseInt(args.pageSize) ? parseInt(args.pageSize) : 30
    
    return http({
        url: '//chat.roblox.com/v2/multi-get-latest-messages?pageSize=' + pageSize + '&conversationIds=' + conversationIds.join('&conversationIds='),
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
=======
  const jar = args.jar
  let conversationIds = typeof (args.conversationIds) === 'object' ? args.conversationIds : []
  let pageSize = parseInt(args.pageSize) ? parseInt(args.pageSize) : 30

  return http({
    url: '//chat.roblox.com/v2/multi-get-latest-messages?pageSize=' + pageSize + '&conversationIds=' + conversationIds.join('&conversationIds='),
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
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
