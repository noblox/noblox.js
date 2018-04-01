let http = require('../util/http.js').func

exports.optional = ['pageNumber', 'pageSize', 'jar']

exports.func = (args) => {
  let jar = args.jar,
    pageNumber = parseInt(args.pageNumber) ? parseInt(args.pageNumber) : 1,
    pageSize = parseInt(args.pageSize) ? parseInt(args.pageSize) : 30

  return http({
    url: '//chat.roblox.com/v2/get-user-conversations?pageNumber=' + pageNumber + '&pageSize=' + pageSize,
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
