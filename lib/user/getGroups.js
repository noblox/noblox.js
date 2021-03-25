// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']
exports.optional = []

// Docs
/**
 * Get the groups of a user.
 * @category User
 * @alias getGroups
 * @param {number} userId - The id of the user.
 * @returns {Promise<IGroupPartial[]>}
 * @example const noblox = require("noblox.js")
 * let groups = await noblox.getGroups(123456)
**/

// Define
function getGroups (userId) {
  return new Promise((resolve, reject) => {
    const requests = [
      constructRequest(`//groups.roblox.com/v2/users/${userId}/groups/roles`),
      constructRequest(`//groups.roblox.com/v1/users/${userId}/groups/primary/role`)
    ].map(promise => promise.then(
      val => ({ status: 'fulfilled', value: val }),
      rej => ({ status: 'rejected', reason: rej })
    ))

    const result = []

    Promise.all(requests).then(async (promiseResponses) => {
      let responses = promiseResponses.map(response => response.value)
      const failedResponse = (responses[0].statusCode !== 200 || !responses[0].body) // we only check the first request because the second one errors if a primary is not set

      if (failedResponse) {
        const body = responses[0].body || {}
        if (body.errors && body.errors.length > 0) {
          const errors = body.errors.map((e) => {
            return e.message
          })
          reject(new Error(`${responses[0].statusCode} ${errors.join(', ')}`))
        }
        reject(new Error('The provided user ID is not valid.'))
      }

      responses = responses.map(r => r.body)

      const groupRoleData = responses[0].data
      if (groupRoleData) {
        const primaryGroupId = responses[1] && responses[1].group && responses[1].group.id

        const groupThumbails = await constructRequest(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupRoleData.map(data => data.group.id).join(',')}&size=150x150&format=Png&isCircular=false`)

        groupRoleData.forEach(data => {
          const insertion = {
            Id: data.group.id,
            Name: data.group.name,
            MemberCount: data.group.memberCount,
            IsPrimary: data.group.id === primaryGroupId,
            Rank: data.role.rank,
            Role: data.role.name,
            RoleId: data.role.id,
            EmblemUrl: groupThumbails.body.data.find(thumbnail => thumbnail.targetId === data.group.id).imageUrl
          }
          result.push(insertion)
        })
      }

      resolve(result)
    })
  })
}

function constructRequest (url) {
  return http({
    url: url,
    options: {
      resolveWithFullResponse: true,
      followRedirect: false,
      json: true
    }
  })
}

exports.func = function (args) {
  return getGroups(args.userId)
}
