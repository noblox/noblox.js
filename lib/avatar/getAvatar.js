<<<<<<< HEAD
let http = require('../util/http.js').func

exports.required = ['userId']

let getAvatar = (userId) => {
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
    let userId = args.userId
    return getAvatar(userId)
}
=======
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
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226
