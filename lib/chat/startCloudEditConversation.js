const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['placeId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Start a Cloud Edit/Team Create conversation.
 * @category Chat
 * @alias startCloudEditConversation
 * @param {number} placeId - The id of the place.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.startCloudEditConversation(1117747196)
**/

const nextFunction = (jar, token, placeId) => {
  return http({
    url: '//chat.roblox.com/v2/start-cloud-edit-conversation',
    options: {
      method: 'POST',
      jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        placeId
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.resultType === 'Success') {
        throw new RobloxAPIError(res)
      }
    } else {
      throw new RobloxAPIError(res)
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.placeId)
  })
}
