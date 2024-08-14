// Includes
const settings = require('../../settings.json')

const noblox = require('../index.js')

exports.optional = ['option', 'jar']

// Docs
/**
 * 🔐 Get the current logged in user.
 * @category Utility
 * @alias getCurrentUser
 * @param {string=} option - A specific option to return.
 * @returns {LoggedInUserData}
 * @example const noblox = require("noblox.js")
 * @deprecated getCurrentUser() is deprecated; see getAuthenticatedUser(), getPremium(), getThumbnails(), getUserFunds() instead | August 27, 2024 - https://devforum.roblox.com/t/official-list-of-deprecated-web-endpoints/62889/66
 * // Login using your cookie.
 * const user = await noblox.getCurrentUser()
**/

// Define
exports.func = async function (args) {
  const jar = args.jar
  const option = args.option
  if (settings.show_deprecation_warnings) {
    console.warn('[DEPRECATED]: getCurrentUser() is deprecated by Roblox; use getAuthenticatedUser(), getPremium(), getThumbnails(), or getUserFunds() instead! | See https://www.github.com/noblox/noblox.js/pulls/823')
    console.warn(' > Opt out of these warnings using noblox.setOptions({ show_deprecation_warnings: false })')
  }

  const currentUser = await noblox.getAuthenticatedUser(jar)
  const premiumStatus = await noblox.getPremium(currentUser.id, jar)
  const thumbnailResponse = await noblox.getPlayerThumbnail(currentUser.id, '352x352', 'png', false, 'Body', jar)
  const robuxBalance = await noblox.getUserFunds(currentUser.id, jar)

  const json = {
    UserID: currentUser.id,
    UserName: currentUser.name,
    RobuxBalance: robuxBalance,
    ThumbnailUrl: thumbnailResponse[0].imageUrl,
    IsAnyBuildersClubMember: false,
    IsPremium: premiumStatus,
    DEPRECATION_WARNING: '[DEPRECATED]: noblox.getCurrentUser() is deprecated; use getAuthenticatedUser(), getPremium(), getThumbnails(), or getUserFunds() instead! | See https://www.github.com/noblox/noblox.js/pulls/823'
  }

  if (!option) {
    return json
  }

  // Support queried rgequests `getCurrentUser('UserID') -> only UserID`
  const searchKey = Object.keys(json).filter((key) => {
    return option.toLowerCase() === key.toLowerCase()
  })[0]
  return json[searchKey]
}
