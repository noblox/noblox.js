const EventEmitter = require('events')
const request = require('superagent')
const Logger = require('./util/Logger')

const RobloxUser = require('./structures/RobloxUser')

/**
 * The base class for all clients.
 * @extends {EventEmitter}
 */
class Client extends EventEmitter {
  constructor (username, password, options) {
    super()

    this.username = username
    this.password = password

    this.token = ''
    this.session = ''

    this.ready = false
    this.startTime = 0
    this.user = {}
  }

  get uptime () {
    return this.startTime ? Date.now() - this.startTime : 0
  }

  async connect () {
    await request.post('https://api.roblox.com/sign-out/v1').catch(req => {
      this.token = req.response.headers['x-csrf-token']
    })

    const login = await request.post('https://auth.roblox.com/v2/login')
      .set('X-CSRF-TOKEN', this.token)
      .send({ ctype: 'Username', cvalue: this.username, password: this.password })
      .catch(req => { this.emit('error', req.response.body.errors); Logger.error(req.response.body.errors); return Promise.reject(new Error(req.response.body.errors)) })

    if (login.status === 200) {
      this.user = login.body.user
    }

    this.session = login.headers['set-cookie'].toString().match(/\.ROBLOSECURITY=(.*?);/)[1]

    this.emit('ready', login.body.user)
    Promise.resolve(this.user)
  }

  async getUser (userResolvable) {
    const user = new RobloxUser(userResolvable, this)

    return user
  }
}

module.exports = Client
