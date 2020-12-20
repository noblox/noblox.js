// Includes
const http = require('../util/http.js').func
const Promise = require('bluebird')

exports.required = ['group']
exports.optional = ['actionType', 'userId', 'sortOrder', 'limit', 'cursor', 'jar']

// Docs
/**
 * Get the audit log for the group.
 * @category Group
 * @alias getAuditLog
 * @param {number} group - The id of the group.
 * @param {("DeletePost" | "RemoveMember" | "AcceptJoinRequest" | "DeclineJoinRequest" | "PostStatus" | "ChangeRank" | "BuyAd" | "SendAllyRequest" | "CreateEnemy" | "AcceptAllyRequest" | "DeclineAllyRequest" | "DeleteAlly" | "DeleteEnemy" | "AddGroupPlace" | "RemoveGroupPlace" | "CreateItems" | "ConfigureItems" | "SpendGroupFunds" | "ChangeOwner" | "Delete" | "AdjustCurrencyAmounts" | "Abandon" | "Claim" | "Rename" | "ChangeDescription" | "InviteToClan" | "KickFromClan" | "CancelClanInvite" | "BuyClan" | "CreateGroupAsset" | "UpdateGroupAsset" | "ConfigureGroupAsset" | "RevertGroupAsset" | "CreateGroupDeveloperProduct" | "ConfigureGroupGame" | "Lock" | "Unlock" | "CreateGamePass" | "CreateBadge" | "ConfigureBadge" | "SavePlace" | "PublishPlace")=} actionType - The action type to filter for.
 * @param {number=} userId - The user's id to filter for.
 * @param {SortOrder=} sortOrder - The order to sort the logs by.
 * @param {Limit=} limit - The maximum logs per a page.
 * @param {string=} cursor - The cursor for the page.
 * @returns {Promise<AuditPage>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const rankLogs = await noblox.getAuditLog(1, "ChangeRank", 2, "Asc")
**/

function getAuditLog (group, actionType, userId, sortOrder, limit, cursor, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/audit-log?actionType=${actionType}&cursor=${cursor}&limit=${limit}&sortOrder=${sortOrder}&userId=${userId}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar: jar
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        } else {
          resolve(responseData)
        }
      })
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  const actionType = args.actionType || ''
  const userId = args.userId || ''
  const sortOrder = args.sortOrder || 'Asc'
  const limit = args.limit || (100).toString()
  const cursor = args.cursor || ''
  return getAuditLog(args.group, actionType, userId, sortOrder, limit, cursor, jar)
}
