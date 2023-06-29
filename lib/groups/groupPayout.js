// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'member', 'amount']
exports.optional = ['recurring', 'usePercentage', 'jar']

// Docs
/**
 * 🔐 Pay group funds out to a user.
 * @category Group
 * @alias groupPayout
 * @param {number} group - The id of the group.
 * @param {number | Array<number>} member - The member or array of members to payout.
 * @param {number} amount - The amount of Robux for each recipient to receive.
 * @param {boolean=} [recurring=false] - If the payment is recurring.
 * @param {boolean=} [usePercentage=false] - If the amount is a percentage.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.groupPayout(1117747196, 55549140, 30)
**/

// Define
function groupPayout (jar, token, group, data, recurring, usePercentage) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//groups.roblox.com/v1/groups/${group}/payouts${recurring ? '/recurring' : ''}`,
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          PayoutType: (usePercentage ? 'Percentage' : 'FixedAmount'),
          Recipients: data
        })
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.status === 200) {
          resolve()
        } else {
          const body = res.data || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.status} ${errors.join(', ')}`))
          }
        }
      }).catch(error => reject(error))
  })
}

// Although I would normally leave it to the endpoint to error when incorrect percentages are given, it's not very reliable so I'll do it instead
function isPercentage (num) {
  return num >= 0 && num <= 100 && num % 1 === 0
}

exports.func = function (args) {
  const jar = args.jar
  let member = args.member
  let amount = args.amount
  const recurring = args.recurring || false
  const usePercentage = recurring ? true : args.usePercentage
  const data = []

  if (!(member instanceof Array)) {
    member = [member]
    amount = [amount]
  } else if (!(amount instanceof Array) || member.length !== amount.length) {
    throw new Error('If member is an array amount must be a parallel array')
  }
  let total = 0
  for (let i = 0; i < member.length; i++) {
    const value = amount[i]
    if (usePercentage) {
      if (!isPercentage(value)) {
        throw new Error('Percent values must be whole numbers between 0 and 100 inclusive')
      }
      total += value
      if (total > 100) {
        throw new Error('Sum of percent values must be less than 100')
      }
    }
    data.push({
      recipientId: member[i],
      recipientType: 'User',
      amount: value
    })
  }

  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return groupPayout(jar, xcsrf, args.group, data, recurring, usePercentage)
    })
}
