const http = require('../util/http.js').func

exports.required = ['userId']

const getAvatar = (userId) => {
  return http({
    url: '//avatar.roblox.com/v1/users/' + userId + '/avatar',
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

exports.func = (args) => {
  const userId = args.userId
  return getAvatar(userId)
}
