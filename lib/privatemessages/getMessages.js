// Includes
const http = require('../util/http.js').func
// Args
exports.required = []
exports.optional = ['pageNumber', 'pageSize', 'messageTab', 'jar']

// Docs
/**
 * 🔐 Get the messages of the authenticated user.
 * @category User
 * @alias getMessages
 * @param {number=} [pageNumber=0] - The number of the current page.
 * @param {number=} [pageSize=25] - The size of the current page.
 * @param {("Inbox" | "Sent" | "Archive")=} [messageTab=Inbox] - The tab of the messages being fetched (Inbox, Sent, Archive)
 * @returns {Promise<PrivateMessagesPage>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * let messages = await noblox.getMessages(1, 10, "Inbox"))
**/

// Define
function getMessages (jar, token, pageNumber, pageSize, messageTab) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//privatemessages.roblox.com/v1/messages?pageNumber=${pageNumber}&pageSize=${pageSize}&messageTab=${messageTab}`,
      options: {
        method: 'GET',
        jar,
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(res.body)
        } else {
          const body = res.body || {}
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
  const pageNumber = (args.pageNumber && args.pageNumber.toString()) || '0'
  const pageSize = (args.pageSize && args.pageSize.toString()) || '25'
  const messageTab = args.messageTab || 'Inbox'
  if (!['Inbox', 'Sent', 'Archive'].includes(messageTab)) {
    return new Promise((resolve, reject) => {
      reject(new Error('messageTab must be Inbox, Sent, or Archive'))
    })
  }
  return getMessages(jar, pageNumber, pageSize, messageTab)
}
