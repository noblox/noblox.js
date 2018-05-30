const EventEmitter = require('events')
const getUser = require('./getUser').func

/**
 * Class representing a Roblox user
 * @extends {EventEmitter}
 */
class RobloxUser extends EventEmitter {
  /**
   * Create a Roblox user object
   * @param {userResolvable} userResolvable - A value of either the user's username or ID
   */
  constructor (userResolvable, client) {
    super()

    this.isReady = false
    this.client = {}
    this.userResolvable = userResolvable

    if (client != null) {
      this.client = client
    }

    if (typeof userResolvable === 'string') {
      this.username = userResolvable
    } else if (typeof userResolvable === 'number') {
      this.id = userResolvable
    } else {
      throw new TypeError('userResolvable expected to be a string or number')
    }

    this.prepare()
  }

  /**
   * Creates an instance of RobloxUser, and returns a promise that resolves with the
   * user once the user has been fully prepared.
   * @static
   * @param {UserResolvable} userResolvable The username or id of the user
   * @returns {RobloxUser} The new user
   * @memberof RobloxUser
   */
  static new (userResolvable, client) {
    return new Promise(resolve => {
      let robloxUser = new RobloxUser(userResolvable, client)
      robloxUser.once('ready', () => {
        resolve(robloxUser)
      })
    })
  }

  async prepare () {
    const userData = await getUser({ user: this.userResolvable })

    this.blurb = userData.blurb
    this.status = userData.status
    this.id = userData.userId
    this.username = userData.username
    this.joinDate = userData.joinDate
    this.groups = userData.groups

    this.isReady = true
    this.emit('ready')
  }

  /**
   * Returns a promise that resolves once this instance is ready to be used.
   * Instantly resolves if the user is already ready.
   * @returns {RobloxUser} The promise resolves with the user itself
   * @memberof RobloxUser
   */
  async ready () {
    return new Promise(resolve => {
      if (this.isReady) resolve(this)
      this.once('ready', () => {
        resolve(this)
      })
    })
  }

  /**
   * Returns the user's username if it is available.
   * If the username isn't available, it returns "User#1234" where 1234 is the user id.
   * @returns {string} String representation of RobloxUser
   * @memberof RobloxUser
   */
  toString () {
    return this.username || `User#${this.id}`
  }

  /**
   * Ensures the user is ready before running any actions.
   * Throws an error if it is not ready.
   * @private
   * @memberof RobloxUser
   */
  ensureReady () {
    if (!this.id || !this.isReady) {
      throw new Error('RobloxUser isn\'t ready, use await RobloxUser.new')
    }
  }

  /**
   * Ensure this user is being interacted with by an authorized user.
   * Throws an error if not.
   * @param {string} method A name to refer to the function calling this method (debug)
   * @private
   * @memberof RobloxUser
   */
  ensureAuth (method) {
    this.ensureReady()

    if (!this.client) {
      throw new Error(`${method} requires you to be logged in; use client.getUser`)
    }
  }

  /**
   * Returns the user's blurb (bio) from their profile.
   * @returns {string} The user's blurb
   * @memberof RobloxUser
   */
  async getBlurb () {
    this.ensureReady()
    this.prepare()

    return this.blurb
  }

  /**
   * Returns the user's status from their profile.
   * @returns {string} The user's status
   * @memberof RobloxUser
   */
  async getStatus () {
    this.ensureReady()
    this.prepare()

    return this.status
  }

  /**
   * Returns a Map containing the groups the user is in
   * @returns {Map} The user's groups
   * @memberof RobloxUser
   */
  async getGroups () {
    this.ensureReady()
    this.prepare()

    return this.groups
  }
}

exports.RobloxUser = RobloxUser
