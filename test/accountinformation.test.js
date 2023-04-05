const { getUserSocialLinks, getUserFavoriteGames, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Account Information Methods', () => {

  it ('getUserFavoriteGame() return a player\' favorite games', () => {
    return getUserFavoriteGames(172694510).then((res) => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.toBeOneOf([expect.any(String), null]),
        nextPageCursor: expect.toBeOneOf([expect.any(String), null]),
        data: expect.toBeOneOf([expect.any(Object), null]),
      })
    })
  })

  it('getUserFavoriteGame() doesn\'t return a player\'s favorite games and errors when user is invalid', async () => {
    return await expect(getUserFavoriteGames()).rejects.toThrow()
  })


  it('getUserSocialLinks() returns a player\'s promotion channel links', () => {
    return getUserSocialLinks(2416399685).then((res) => {
      return expect(res).toMatchObject({
        facebook: expect.toBeOneOf([expect.any(String), null]),
        twitter: expect.toBeOneOf([expect.any(String), null]),
        youtube: expect.toBeOneOf([expect.any(String), null]),
        twitch: expect.toBeOneOf([expect.any(String), null]),
        guilded: expect.toBeOneOf([expect.any(String), null])
      })
    })
  })

  it('getUserSocialLinks() doesn\'t return a player\'s promotion channel links and errors when user is invalid', async () => {
    return await expect(getUserSocialLinks(-5)).rejects.toThrow()
  })

})
