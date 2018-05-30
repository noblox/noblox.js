const EventEmitter = require('events')
const getUserData = require('../functions/getUserData')

class RobloxUser extends EventEmitter {
    constructor(userResolvable, client) {
        super();

        if (!client) {
            this._missingClientError = new Error("Missing client in constructor"); // Preserve constructor callstack
        }
        this._client = client

        if (typeof userResolvable === 'string') {
            this.username = userResolvable
          } else if (typeof userResolvable === 'number') {
            this.id = userResolvable
          } else {
            throw new TypeError('userResolvable expected to be a string or number')
          }

        this.userResolvable = userResolvable
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
    
    async prepare () {
        const userData = await getUserData({ user: this.userResolvable })
    
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
     * Returns the user's username if it is available.
     * If the username isn't available, it returns "User#1234" where 1234 is the user id.
     * @returns {string} String representation of RobloxUser
     * @memberof RobloxUser
     */
    toString () {
      return this.username || `User#${this.id}`
    }

    async getGroups() {
      await this.prepare()

      return this.groups
    }
}

module.exports = RobloxUser