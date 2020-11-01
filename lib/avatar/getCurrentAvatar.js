/* @module Avatar */
const http = require('../util/http.js').func

exports.optional = ['option', 'jar']

// Docs
/**
 * Gets your current avatar.
 * @category Avatar
 * @alias getCurrentAvatar
 * @param {number=} option - The name of a parameter on the avatar.
 * @returns {Promise<AvatarInfo>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * const avatar = await noblox.getCurrentAvatar()
*/

exports.func = (args) => {
  const jar = args.jar
  const option = args.option

  return http({
    url: '//avatar.roblox.com/v1/avatar',
    options: {
      method: 'GET',
      jar: jar,
      followRedirect: false,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode !== 200) {
      throw new Error('You are not logged in')
    } else {
      const json = JSON.parse(res.body)
      return (option ? json[option] : json)
    }
  })
}
