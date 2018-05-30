const http = require('../util/http.js').func
const ClientRobloxUser = require('./ClientRobloxUser')

/**
 * A logged in RobloxUser. You do actions on the website as this user.
 *
 * @class Client
 * @extends {ClientRobloxUser}
 */
class Client extends ClientRobloxUser {
  /**
   * Creates an instance of RobloxUser.
   * Not ready to use. Wait for `ready` to be emitted, use getReadyPromise or await Client.new
   * @param {string} username The username of the client user
   * @param {string} password The password of the client user
   */
  constructor (username, password) {
    super(username)

    this.password = password
    this.session = ''
    this.token = ''

    this.listeners = {
      friendRequest: false,
      message: false,
      notification: false
    }
  }

  async prepare () {
    try {
      const httpOpt = {
        url: '//auth.roblox.com/v2/login',
        options: {
          method: 'POST',
          resolveWithFullResponse: true,
          json: {
            'ctype': 'Username',
            'cvalue': this.username,
            'password': this.password
          }
        }
      }

      await http(httpOpt).then(function (res) {
        if (res.statusCode === 200) {
          var cookies = res.headers['set-cookie']
          var session = cookies.toString().match(/\.ROBLOSECURITY=(.*?);/)[1]
          this.session = session
        } else {
          throw new Error(JSON.parse(res.body))
        }
      })

      this.isReady = true
      this.emit('ready')
    } catch (e) {
      throw new Error('Failed to login')
    }
  }

  /**
   * Gets a ClientRobloxUser as this Client
   * @param {UserResolvable} userResolvable The user to fetch
   * @returns {ClientRobloxUser} A ClientRobloxUser instance representing the user.
   * @memberof Client
   */
  async getUser (userResolvable) {
    return ClientRobloxUser.new(userResolvable, this)
  }
}

module.exports = Client
