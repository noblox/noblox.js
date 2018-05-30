const RobloxUser = require('./RobloxUser')
const http = require('../util/http.js').func

/**
 * A RobloxUser seen by a Client. Includes many logged-in-only methods.
 * @class ClientRobloxUser
 * @extends {RobloxUser}
 */
class ClientRobloxUser extends RobloxUser {
  /**
   * Removes this user as a friend from Client.
   * @returns {Promise}
   */
  async removeFriend () {
    this.ensureAuth('removeFriend')

    const httpOpt = {
      url: '//www.roblox.com/api/friends/removefriend',
      options: {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': this.client.token,
          'Set-Cookie': '.ROBLOSECURITY=' + this.client.session + ';'
        },
        json: {
          targetUserID: this.id
        },
        resolveWithFullResponse: true
      }
    }

    return http(httpOpt).then(function (res) {
      if (res.statusCode === 200) {
        var body = res.body
        if (!body.success) {
          throw new Error(body.message)
        }
      } else {
        throw new Error('Remove friend failed')
      }
    })
  }
}

module.exports = ClientRobloxUser
