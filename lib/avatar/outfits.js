const http = require('../util/http.js').func

exports.required = ['userId']
exports.optional = ['page', 'itemsPerPage']

exports.func = (args) => {
  const userId = args.userId
  const page = parseInt(args.page) ? parseInt(args.page) : '*'
  const itemsPerPage = parseInt(args.itemsPerPage) ? parseInt(args.itemsPerPage) : '*'

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
