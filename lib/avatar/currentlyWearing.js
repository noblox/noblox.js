let http = require('../util/http.js').func

exports.required = ['userId']

exports.func = (args) => {
  let userId = args.userId

  return http({
    url: '//avatar.roblox.com/v1/users/' + userId + '/currently-wearing',
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
