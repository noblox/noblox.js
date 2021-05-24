// Includes
const http = require('../util/http.js').func
const queue = require('../internal/queue.js')
const getGeneralToken = require('../util/getGeneralToken.js').func
const getHash = require('../util/getHash.js').func
const getSenderId = require('../util/getSenderUserId.js').func

// Args
exports.required = ['recipient', 'subject', 'body']
exports.optional = ['replyMessageId', 'includePreviousMessage', 'jar']

// Docs
/**
 * 🔐 Send a message. NOTE: Roblox blocks web servers and proxies from sending messages.
 * @category User
 * @alias message
 * @param {number} recipient - The id of the user.
 * @param {string} subject - The subject of the message.
 * @param {string} body - The body of the message.
 * @param {number=} replyMessageId - The messageId to reply to.
 * @param {boolean=} [includePreviousMessage=false] - The previous or next page cursor.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.message(1, "A subject", "A body", 1234, true)
**/

// Define
function message (jar, token, senderId, recipient, subject, body, replyMessageId, includePreviousMessage) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//privatemessages.roblox.com/v1/messages/send',
      options: {
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: senderId,
          recipientId: recipient,
          subject,
          body,
          replyMessageId,
          includePreviousMessage
        }),
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.body))
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
  return queue('Message', getHash({ jar: jar }), function () {
    return getGeneralToken({ jar: jar })
      .then(function (xcsrf) {
        return getSenderId({ jar: jar }).then((senderId) => {
          return message(jar, xcsrf, senderId, args.recipient, args.subject, args.body, args.replyMessageId, args.includePreviousMessage)
        })
      })
  }, function () {
    return true
  })
}
