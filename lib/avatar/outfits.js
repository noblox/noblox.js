<<<<<<< HEAD
let http = require('../util/http.js').func
=======
const http = require('../util/http.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.required = ['userId']
exports.optional = ['page', 'itemsPerPage']

exports.func = (args) => {
<<<<<<< HEAD
    let userId = args.userId,
        page = parseInt(args.page) ? parseInt(args.page) : '*',
        itemsPerPage = parseInt(args.itemsPerPage) ? parseInt(args.itemsPerPage) : '*'
    
    return http({
        url: '//avatar.roblox.com/v1/users/' + userId + '/outfits?page=' + page + '&itemsPerPage=' + itemsPerPage,
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
=======
  const userId = args.userId
  let page = parseInt(args.page) ? parseInt(args.page) : '*'
  let itemsPerPage = parseInt(args.itemsPerPage) ? parseInt(args.itemsPerPage) : '*'

  return http({
    url: '//avatar.roblox.com/v1/users/' + userId + '/outfits?page=' + page + '&itemsPerPage=' + itemsPerPage,
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
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
