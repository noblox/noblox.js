const { it } = require('node:test')
const { getBlurb, getIdFromUsername, getPlayerInfo, getUsernameFromId, getUsernameHistory, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Users Methods', () => {
  it('getBlurb() returns a user\'s blurb', () => {
    return getBlurb(55549140).then((res) => {
      return expect(res).toEqual(expect.any(String))
    })
  })

  it('getIdFromUsername() returns a user\'s ID given their username', () => {
    return getIdFromUsername('ROBLOX').then((res) => {
      return expect(res).toEqual(expect.any(Number))
    })
  })

  it('getIdFromUsername() returns several IDs given several usernames', () => {
    return getIdFromUsername(['qxest', 'builderman']).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([expect.toBeOneOf([expect.any(Number), null])])
      )
    })
  })

  it('getIdFromUsername() returns null when given username that doesn\'t exist', () => {
    return getIdFromUsername('x').then((res) => {
      return expect(res).toBeNull()
    })
  })

  it('getIdFromUsername() returns null when given usernames that don\'t exist', () => {
    return getIdFromUsername(['p', 'a']).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([null])
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
        isBanned: expect.any(Boolean),
        displayName: expect.any(String)
      })
    })
  })

  it('getUsernameFromId() returns a player\'s username given an ID', () => {
    return getUsernameFromId(1).then((res) => {
      return expect(res).toEqual(expect.any(String))
    })
  })

  it('getUsernameHistory() returns a player\'s username history', () => {
    return getUsernameHistory(55549140).then((res) => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.toBeOneOf([expect.any(String), null]),
        nextPageCursor: expect.toBeOneOf([expect.any(String), null]),
        data: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String)
          })
        ])
      })
    })
  })
})
