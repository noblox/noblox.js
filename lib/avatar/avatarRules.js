const http = require('../util/http.js').func

exports.optional = ['option', 'jar']

// Docs
/**
 * ✅ Get the avatar rules.
 * @category Avatar
 * @alias avatarRules
 * @param {string=} option - A specific rule to filter for.
 * @returns {Promise<AvatarRules>}
 * @example const noblox = require("noblox.js")
 * const avatarRules = await noblox.avatarRules()
**/

exports.func = (args) => {
  const jar = args.jar
  const option = args.option

  return http({
    url: '//avatar.roblox.com/v1/avatar-rules',
    options: {
      method: 'GET',
      jar,
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
