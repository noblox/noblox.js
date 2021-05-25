const { changeRank, getAuditLog, getGroup, getGroupFunds, getGroupGames, getGroupTransactions, getJoinRequests, getLogo, getPlayers, getRankInGroup, getRankNameInGroup, getRole, getRolePermissions, getRoles, getShout, getWall, setRank, shout, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

expect.extend({
  nullOrAny (received, expected) {
    if (received === null) {
      return {
        pass: true,
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    if (expected === String) {
      return {
        pass: typeof received === 'string' || received instanceof String,
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    if (expected === Number) {
      return {
        pass: typeof received === 'number' || received instanceof Number,
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    if (expected === Function) {
      return {
        pass: typeof received === 'function' || received instanceof Function,
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    if (expected === Object) {
      return {
        pass: received !== null && typeof received === 'object',
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    if (expected === Boolean) {
      return {
        pass: typeof received === 'boolean',
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    /* jshint -W122 */
    /* global Symbol */
    if (typeof Symbol !== 'undefined' && this.expectedObject === Symbol) {
      return {
        pass: typeof received === 'symbol',
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }
    /* jshint +W122 */

    return {
      pass: received instanceof expected,
      message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
    }
  }
})

describe('Group Methods', () => {
  it('changeRank() changes rank of a user', () => {
    return changeRank(4591072, 857710783, 1).then((res) => {
      setTimeout(async () => {
        await changeRank(4591072, 857710783, -1)
      }, 1000)
      return expect(res).toMatchObject({
        newRole: expect.any(Object),
        oldRole: expect.any(Object)
      })
    })
  })

  // demote is skipped as it is an extension of changeRank

  it('getAuditLog() returns a group\'s audit logs', () => {
    return getAuditLog(4591072)
  })

  it('getGroup() returns information on a group', () => {
    return getGroup(4591072).then((res) => {
      return expect(res).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        owner: {
          userId: expect.any(Number),
          username: expect.any(String)
        },
        shout: expect.nullOrAny(Object),
        memberCount: expect.any(Number),
        publicEntryAllowed: expect.any(Boolean)
      })
    })
  })

  it('getGroupFunds() returns amount of robux in group funds', () => {
    return getGroupFunds(9997719).then((res) => {
      return expect(res).toEqual(expect.any(Number))
    })
  })

  it('getGroupGames() returns an array of group games', () => {
    return getGroupGames({ groupId: 2629410, limit: 1 }).then((res) => { // FIXME: Convert to noblox.js groupId, currently Roblox broke the creation of group games during the experience rebranding
      return expect(res[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        creator: {
          id: expect.any(Number),
          type: expect.any(String)
        },
        rootPlace: {
          id: expect.any(Number),
          type: expect.any(String)
        },
        created: expect.any(Date),
        updated: expect.any(Date),
        placeVisits: expect.any(Number)
      })
    })
  })

  it('getGroupTransactions() returns transactions related to a group', () => {
    return getGroupTransactions(4591072).then((res) => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.nullOrAny(String),
        nextPageCursor: expect.nullOrAny(String),
        data: expect.any(Array)
      })
    })
  })

  it('getJoinRequests() returns a list of players that want to join a group', () => {
    return getJoinRequests(4591072).then((res) => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.nullOrAny(String),
        nextPageCursor: expect.nullOrAny(String),
        data: expect.any(Array)
      })
    })
  })

  it('getLogo() returns a image URL for a group', () => {
    return getLogo(4591072)
  })

  it('getPlayers() returns a list of players in a group', () => {
    return getPlayers(4591072, [30820744]).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userId: expect.any(Number),
            username: expect.any(String)
          })
        ])
      )
    })
  })

  it('getRankInGroup() returns a number reflecting a user\'s rank in a group (0-255)', () => {
    return getRankInGroup(4591072, 55549140).then((res) => {
      return expect(res).toEqual(expect.any(Number))
    })
  })

  it('getRankNameInGroup() returns a number reflecting a user\'s rank name in a group', () => {
    return getRankNameInGroup(4591072, 55549140).then((res) => {
      return expect(res).toEqual(expect.any(String))
    })
  })

  it('getRole() returns a role that matches the provided rank', () => {
    return getRole(4591072, 255).then((res) => {
      return expect(res).toMatchObject({
        name: expect.any(String),
        rank: expect.any(Number),
        memberCount: expect.any(Number),
        ID: expect.any(Number)
      })
    })
  })

  it('getRolePermissions() returns permissions given to a role by a group', () => {
    return getRolePermissions(4591072, 30820744).then((res) => {
      return expect(res).toMatchObject({
        groupId: expect.any(Number),
        role: expect.any(Object),
        permissions: expect.any(Object)
      })
    })
  })

  it('getRoles() returns the roles in a group', () => {
    return getRoles(4591072).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            rank: expect.any(Number),
            memberCount: expect.any(Number),
            ID: expect.any(Number)
          })
        ])
      )
    })
  })

  it('getShout() returns the current shout on a group', () => {
    return getShout(4591072).then((res) => {
      return expect(res).toMatchObject({
        body: expect.any(String),
        poster: {
          userId: expect.any(Number),
          username: expect.any(String)
        },
        created: expect.any(String),
        updated: expect.any(String)
      })
    })
  })

  it('getWall() returns the latest messages on the group wall', () => {
    return getWall(4591072).then((res) => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.nullOrAny(String),
        nextPageCursor: expect.nullOrAny(String),
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            poster: expect.nullOrAny(Object),
            body: expect.any(String),
            created: expect.any(String),
            updated: expect.any(String)
          })
        ])
      })
    })
  })

  // promote is skipped as it is an extension of changeRank

  it('setRank() should set a player\'s rank to the specified rank', () => {
    return setRank(4591072, 857710783, 1).then((res) => {
      return expect(res).toMatchObject({
        name: expect.any(String),
        rank: expect.any(Number),
        memberCount: expect.any(Number),
        ID: expect.any(Number)
      })
    })
  })

  it('shout() should post a message to the group\'s shout', () => {
    return shout(4591072, 'This is a noblox.js test!').then((res) => {
      setTimeout(async () => {
        await shout(4591072, '')
      }, 1000)
      return expect(res).toMatchObject({
        body: expect.any(String),
        poster: {
          userId: expect.any(Number),
          username: expect.any(String)
        },
        created: expect.any(String),
        updated: expect.any(String)
      })
    })
  })
})
