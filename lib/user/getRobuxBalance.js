const http = require("../util/http.js").func

exports.required = ["userId"]
exports.optional = ["jar"]

// Docs
/**
 * 🔐 Gets the user's Robux balance.
 * @category User
 * @alias getRobuxBalance
 * @param {number} userId - The id of the user.
 * @returns {Promise<robuxBalance>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const robuxBalance = await noblox.getRobuxBalance(<userId>)
 **/

function getRobuxBalance (jar, userId) {
    return new Promise((resolve, reject) => {
    const httpOpt = {
        url: `//economy.roblox.com/v1/users/${userId}/currency`,
        options: {
            method: "GET",
            jar: jar,
            resolveWithFullResponse: true
        }
    }
    return http(httpOpt)
        .then(function (res) {
            if (res.statusCode === 200) {
                const body = JSON.parse(res.body)
                resolve(body.robux)
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

exports.func = function (args) {
    const jar = args.jar
    return getRobuxBalance(jar, args.userId)
}
