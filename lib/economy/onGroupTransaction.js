// Includes
const shortPoll = require('../util/shortPoll.js').func
const getGroupTransactions = require('./getGroupTransactions.js').func

// Args
exports.required = ['groupId', 'transactionType']
exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when a group transaction is made, for example a purchase. This event has a rate of one request per 60
 * sec, which is more than the typical 10 seconds. This is due to the unusually low rate limit on the transactions
 * endpoint.
 *
 * Note: The `created` field returned by this event will always have 0 milliseconds. This is due to a quirk on Roblox's side:
 * These millisecond values fluctuate, meaning the event can misfire. Removing them avoids this problem.
 * @category Group
 * @alias onGroupTransaction
 * @param {number} groupId - The id of the group.
 * @param {("Sale" | "Purchase" | "AffiliateSale" | "DevEx" | "GroupPayout" | "AdImpressionPayout")} transactionType - The transaction type.
 * @returns An EventEmitter that emits when a transaction is made.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const transactionEvent = noblox.onGroupTransaction(1)
 * transactionEvent.on("data", function(data) {
 *  console.log("New Transaction!", data)
 * })
 * transactionEvent.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
 **/

// Define
exports.func = function (args) {
  let empty = true
  return shortPoll({
    getLatest: function (latest) {
      return getGroupTransactions({ group: args.groupId, jar: args.jar, transactionType: args.transactionType })
        .then(function (transactions) {
          const given = []
          // This method works much in the same way as onAuditLog. We remove some of the precision from transaction dates
          // Because Roblox has a habit of being imprecise and varying the milliseconds of a given transaction/log item
          // across different requests - and this causes duplicate fires.
          if (transactions) {
            for (const key in transactions) {
              if (Object.prototype.hasOwnProperty.call(transactions, key)) {
                const date = transactions[key].created
                date.setMilliseconds(0)

                if (date > latest) {
                  latest = date
                  given.push(transactions[key])
                }
                empty = false
              } else if (!empty) {
                const date = new Date()
                date.setMilliseconds(0)

                given.push({ date: date })
                latest = date
                empty = true
              }
            }
            return {
              latest: latest,
              data: given
            }
          }
        })
    },
    delay: 'onGroupTransaction'
  })
}
