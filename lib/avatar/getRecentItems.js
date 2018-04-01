let http = require('../util/http.js').func

exports.optional = ['listType', 'jar']

exports.func = (args) => {
  let jar = args.jar,
    listType = typeof (args.listType) === 'string' ? args.listType : 'All'

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
