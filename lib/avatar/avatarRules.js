const http = require('../util/http.js').func

exports.optional = ['option', 'jar']

exports.func = (args) => {
  const jar = args.jar
  const option = args.option

  return http({
    url: '//avatar.roblox.com/v1/avatar-rules',
    options: {
      method: 'GET',
      jar: jar,
      followRedirect: false,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      const json = JSON.parse(res.body)
      const result = (option ? json[option] : json)

      return result
    } else {
      throw new Error('Error fetching avatar rules')
    }
  })
}
