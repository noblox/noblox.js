// Includes
const http = require('./http.js').func
const { func:getPlayerThumbnail } = require("../thumbnails/getPlayerThumbnail.js")

// Args
exports.optional = ['option', 'jar']

// Docs
/**
 * 🔐 Get the current logged in user.
 * @category Utility
 * @alias getCurrentUser
 * @param {string=} option - A specific option to return.
 * @returns {LoggedInUserData}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie.
 * const user = await noblox.getCurrentUser()
**/

// Define
exports.func = async function ({ jar, option }) {
  try {
    const { body:userInfo } = await constructRequest(`//users.roblox.com/v1/users/authenticated`, jar)
    const userId = userInfo.id

    const [ thumbnailReq, robuxReq, premiumReq ] = await Promise.allSettled([
      getPlayerThumbnail({ userIds: [ userId ], cropType: "Body" }),
      constructRequest("//economy.roblox.com/v1/user/currency", jar),
      constructRequest(`//premiumfeatures.roblox.com/v1/users/${userId}/validate-membership`, jar)
    ])

    const thumbnail = thumbnailReq.status == "fulfilled" && thumbnailReq.value?.[0].imageUrl
    const robux = robuxReq.status == "fulfilled" && robuxReq.value.body?.robux
    const premium = premiumReq.status == "fulfilled" && premiumReq.value.body

    const json = {
      UserID: userId,
      UserName: userInfo.name,
      RobuxBalance: robux,
      ThumbnailUrl: thumbnail,
      IsAnyBuildersClubMember: false,
      IsPremium: premium
    }

    if (!option) return json

    const searchKey = Object.keys(json).filter((key) => {
      return option.toLowerCase() === key.toLowerCase()
    })[0]
    return json[searchKey]

  } catch (e) { throw Error("Could not get current user!", e) }

  /*const jar = args.jar
  const option = args.option
  const httpOpt = {
    url: '//www.roblox.com/mobileapi/userinfo',
    options: {
      resolveWithFullResponse: true,
      method: 'GET',
      followRedirect: true,
      jar
    }
  }
  const res = await http(httpOpt)
  if (res.statusCode !== 200) {
    throw new Error('You are not logged in.')
  }
  const json = JSON.parse(res.body)
  if (!option) {
    return json
  }
  const searchKey = Object.keys(json).filter((key) => {
    return option.toLowerCase() === key.toLowerCase()
  })[0]
  return json[searchKey]*/
}


function constructRequest (url, jar) {
  return http({
    url: encodeURI(url),
    options: {
      resolveWithFullResponse: true,
      followRedirect: false,
      json: true,
      jar
    }
  })
}