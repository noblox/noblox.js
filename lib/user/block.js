// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Block a user.
 * @category User
 * @alias block
 * @param {number} userId - The id of the user that is being blocked.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.block(123456)
**/

// Define
function block (jar, token, userId) {
	return new Promise((resolve, reject) => {
		const httpOpt = {
		url: `//accountsettings.roblox.com/v1/users/${userId}/block`,
		options: {
			method: 'POST',
			jar: jar,
			headers: {
				'X-CSRF-TOKEN': token
			},
			resolveWithFullResponse: true
		}
	}
    return http(httpOpt)
		.then(function (res) {
			if (res.statusCode === 200) {
				resolve()
			} else {
				const body = JSON.parse(res.body)
				if (body.errors) {
					reject(new Error(body.errors[0].message || 'Block failed'))
				}
        	}
      	})
	})
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return block(jar, xcsrf, args.userId)
    })
}
