// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * Gets a user's premium status.
 * @category User
 * @alias acceptFriendRequest
 * @param {number} userId - The id of the user.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const hasPremium = await noblox.getPremiumStatus(123456)
 **/

// Define
function getPremiumStatus(jar, userId) {
    return new Promise((resolve, reject) => {
        const httpOpt = {
            url: `https://premiumfeatures.roblox.com/v1/users/${userId}/validate-membership`,
            options: {
                method: 'GET',
                jar: jar,
                resolveWithFullResponse: true
            }
        }
        return http(httpOpt)
            .then(function(res) {
                if (res.statusCode === 200) {
                    resolve(res.body == 'true')
                } else {
                    const body = JSON.parse(res.body) || {}
                    if (body.errors && body.errors.length > 0) {
                        const errors = body.errors.map((e) => {
                            return e.message
                        })
                        reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
                    }
                }
            })
    })
}

exports.func = function(args) {
    const jar = args.jar
    return getPremiumStatus(jar, args.userId)
}