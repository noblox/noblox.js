let http = require('../util/http.js').func

exports.optional = ['jar']

exports.func = (args) => {
  let jar = args.jar

  return http({
    url: '//chat.roblox.com/v2/chat-settings',
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
