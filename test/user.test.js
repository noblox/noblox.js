const { acceptFriendRequest, block, unblock, canManage, declineFriendRequest, follow, unfollow, getBlurb, getCollectibles, getFollowers, getFollowings, getFriendRequests, getFriends, getGroups, getIdFromUsername, getInventory, getInventoryById, getMessages, getOwnership, getPlayerBadges, getPlayerInfo, getPlayerThumbnail, getStatus, getUserSocialLinks, getUserTransactions, getUsernameFromId, removeFriend, sendFriendRequest, setCookie } = require('../lib')

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

describe('User Methods', () => {
  it('follow() follows a user on Roblox', () => {
    return follow(55549140)
  })

  it('unfollow() unfollows a user on Roblox', () => {
    return unfollow(55549140)
  })

  it('block() blocks a user on Roblox', () => {
    return block(4397833)
  })

  it('unblock() unblocks a user on Roblox', () => {
    return unblock(4397833)
  })

  it('canManage() checks if a user can manage an asset', () => {
    return canManage(2416399685, 6792044666).then((res) => {
      return expect(res).toBe(true)
    })
  })

  it('getBlurb() returns a user\'s blurb', () => {
    return getBlurb(55549140).then((res) => {
      return expect(res).toEqual(expect.any(String))
    })
  })

  it('getCollectibles() returns a user\'s collectibles in their inventory', () => {
    return getCollectibles(55549140).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userAssetId: expect.any(Number),
            assetId: expect.any(Number),
            name: expect.any(String)
          })
        ])
      )
    })
  })

  it('getFollowers() returns a user\'s followers', () => {
    return getFollowers(55549140).then((res) => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.nullOrAny(String),
        nextPageCursor: expect.nullOrAny(String),
        data: expect.arrayContaining([
          expect.objectContaining({
            created: expect.any(String),
            id: expect.any(Number),
            name: expect.any(String)
          })
        ])
      })
    })
  })

  it('getFollowings() returns which users are being followed by the specified user', () => {
    return getFollowings(55549140).then((res) => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.nullOrAny(String),
        nextPageCursor: expect.nullOrAny(String),
        data: expect.arrayContaining([
          expect.objectContaining({
            created: expect.any(String),
            id: expect.any(Number),
            name: expect.any(String)
          })
        ])
      })
    })
  })

  it('getFriendRequests() returns the logged in user\'s incoming friend requests', () => {
    return getFriendRequests().then((res) => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.nullOrAny(String),
        nextPageCursor: expect.nullOrAny(String),
        data: expect.arrayContaining([
          expect.objectContaining({
            created: expect.any(String),
            id: expect.any(Number),
            name: expect.any(String)
          })
        ])
      })
    })
  })

  it('getFriends() returns the friends of the specified user', () => {
    return getFriends(64679301).then((res) => {
      return expect(res).toMatchObject({
        data: expect.arrayContaining([
          expect.objectContaining({
            created: expect.any(String),
            id: expect.any(Number),
            name: expect.any(String),
            isDeleted: expect.any(Boolean),
            isOnline: expect.any(Boolean)
          })
        ])
      })
    })
  })

  it('getGroups() returns the groups a user is in', () => {
    return getGroups(64679301).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            Name: expect.any(String),
            Id: expect.any(Number),
            EmblemUrl: expect.any(String),
            Rank: expect.any(Number),
            Role: expect.any(String),
            IsPrimary: expect.any(Boolean)
          })
        ])
      )
    })
  })

  it('getIdFromUsername() returns a user\'s ID given their username', () => {
    return getIdFromUsername('ROBLOX').then((res) => {
      return expect(res).toEqual(expect.any(Number))
    })
  })

  it('getInventory() returns a user\'s inventory', () => {
    return getInventory(55549140, ['Shirt']).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            assetId: expect.any(Number),
            name: expect.any(String),
            assetType: expect.any(String),
            created: expect.any(Date)
          })
        ])
      )
    })
  })

  it('getInventoryById() returns items in a user\'s inventory fitting the specified assetTypeId', () => {
    return getInventoryById(55549140, 8).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            assetName: expect.any(String),
            userAssetId: expect.any(Number),
            assetId: expect.any(Number),
            owner: expect.objectContaining({
              userId: expect.any(Number),
              username: expect.any(String)
            }),
            created: expect.any(Date),
            updated: expect.any(Date)
          })
        ])
      )
    })
  })

  it('getMessages() returns the logged in user\'s messages', () => {
    return getMessages().then((res) => {
      return expect(res).toMatchObject({
        totalCollectionSize: expect.any(Number),
        totalPages: expect.any(Number),
        pageNumber: expect.any(Number),
        collection: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            sender: expect.any(Object),
            recipient: expect.any(Object),
            subject: expect.any(String),
            body: expect.any(String),
            created: expect.any(String),
            updated: expect.any(String),
            isRead: expect.any(Boolean)
          })
        ])
      })
    })
  })

  it('getOwnership() [ASSET] returns if a player owns the specified asset', () => {
    return getOwnership(55549140, 1900419889).then((res) => {
      return expect(res).toBe(true)
    })
  })

  it('getOwnership() [GAMEPASS] returns if a player owns the specified game pass', () => {
    return getOwnership(55549140, 1537467, 'GamePass').then((res) => {
      return expect(res).toBe(true)
    })
  })

  it('getOwnership() [BADGE] returns if a player owns the specified badge', () => {
    return getOwnership(55549140, 176332932, 'Badge').then((res) => {
      return expect(res).toBe(true)
    })
  })

  it('getOwnership() [BUNDLE] returns if a player owns the specified bundle', () => {
    return getOwnership(55549140, 79, 'Bundle').then((res) => {
      return expect(res).toBe(true)
    })
  })

  it('getPlayerBadges() returns a player\'s badges', () => {
    return getPlayerBadges(55549140).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            iconImageId: expect.any(Number),
            awarder: expect.any(Object),
            statistics: expect.any(Object),
            created: expect.any(Date),
            updated: expect.any(Date)
          })
        ])
      )
    })
  })

  it('getPlayerInfo() returns information on the specified user', () => {
    return getPlayerInfo(55549140).then((res) => {
      return expect(res).toMatchObject({
        username: expect.any(String),
        blurb: expect.any(String),
        joinDate: expect.any(Date),
        age: expect.any(Number),
        friendCount: expect.any(Number),
        followerCount: expect.any(Number),
        followingCount: expect.any(Number),
        oldNames: expect.any(Array),
        isBanned: expect.any(Boolean)
      })
    })
  })

  it('getPlayerThumbnail() returns a player\'s thumbnail', () => {
    return getPlayerThumbnail(55549140, 60).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            targetId: expect.any(Number),
            state: expect.any(String),
            imageUrl: expect.any(String)
          })
        ])
      )
    })
  })

  it('getStatus() returns a player\'s status', () => {
    return getStatus(55549140).then((res) => {
      return expect(res).toEqual(expect.any(String))
    })
  })

  it('getUsernameFromId() returns a player\'s username given an ID', () => {
    return getUsernameFromId(1).then((res) => {
      return expect(res).toEqual(expect.any(String))
    })
  })

  it('getUserSocialLinks() returns a player\'s promotion channel links', () => {
    return getUserSocialLinks(2416399685).then((res) => {
      return expect(res).toMatchObject({
        facebook: expect.nullOrAny(String),
        twitter: expect.nullOrAny(String),
        youtube: expect.nullOrAny(String),
        twitch: expect.nullOrAny(String)
      })
    })
  })

  it('getUserTransactions() returns the logged in user\'s transaction history', () => {
    return getUserTransactions('Purchase').then(res => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.nullOrAny(String),
        nextPageCursor: expect.nullOrAny(String),
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            created: expect.any(String),
            isPending: expect.any(Boolean),
            agent: expect.objectContaining({
              id: expect.any(Number),
              type: expect.any(String),
              name: expect.any(String)
            }),
            details: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              type: expect.any(String)
            }),
            currency: expect.objectContaining({
              amount: expect.any(Number),
              type: expect.any(String)
            })
          })
        ])
      })
    })
  })

  it('sendFriendRequest() sends a friend request to the specified user', () => {
    return removeFriend(857710783).then(() => {
      return sendFriendRequest(857710783)
    })
  })

  it('acceptFriendRequest() accepts a friend request', async () => {
    return setCookie(process.env.COOKIE_2).then(() => {
      return acceptFriendRequest(64679301)
    })
  })

  it('removeFriend() unfriends a user', async () => {
    return removeFriend(64679301)
  })

  it('declineFriendRequest() declines a friend request', async () => {
    await setCookie(process.env.COOKIE).then(() => {
      sendFriendRequest(857710783)
    })

    return setCookie(process.env.COOKIE_2).then(() => {
      return declineFriendRequest(64679301)
    })
  })
})
