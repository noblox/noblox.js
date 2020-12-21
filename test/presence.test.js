const { getPresences, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Presence Methods', () => {
  it('getPresences() returns presences of the userIds provided', () => {
    return getPresences([55549140]).then((res) => {
      return expect(res).toMatchObject({
        userPresences: expect.arrayContaining([
          expect.objectContaining({
            userPresenceType: expect.any(Number),
            userId: expect.any(Number),
            lastOnline: expect.any(String)
          })
        ])
      })
    })
  })
})
