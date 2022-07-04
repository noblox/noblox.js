const { getAwardedTimestamps, getBadgeInfo, getGameBadges, getPlayerBadges, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Badges Methods', () => {
  it('getAwardedTimestamps() returns when badges were awarded to a player', () => {
    return getAwardedTimestamps(64679301, [459405541]).then((res) => {
      return expect(res).toMatchObject({
        data: expect.any(Array)
      })
    })
  })

  it('getBadgeInfo() returns information on the provided badge ID', () => {
    return getBadgeInfo(459405541).then((res) => {
      return expect(res).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        enabled: expect.any(Boolean),
        iconImageId: expect.any(Number),
        created: expect.any(Date),
        updated: expect.any(Date),
        statistics: expect.any(Object),
        awardingUniverse: expect.any(Object)
      })
    })
  })

  it('getGameBadges() returns information on the badges in a game', () => {
    return getGameBadges(66654135).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            displayName: expect.any(String),
            displayDescription: expect.any(String),
            enabled: expect.any(Boolean),
            iconImageId: expect.any(Number),
            displayIconImageId: expect.any(Number),
            created: expect.any(Date),
            updated: expect.any(Date),
            statistics: expect.objectContaining({
              pastDayAwardedCount: expect.any(Number),
              awardedCount: expect.any(Number),
              winRatePercentage: expect.any(Number)
            }),
            awardingUniverse: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              rootPlaceId: expect.any(Number)
            })
          })
        ])
      )
    })
  })

  it('getPlayerBadges() returns information on badges a player has earned', () => {
    return getPlayerBadges(55549140, 10).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            displayName: expect.any(String),
            displayDescription: expect.any(String),
            enabled: expect.any(Boolean),
            iconImageId: expect.any(Number),
            displayIconImageId: expect.any(Number),
            awarder: expect.objectContaining({
              id: expect.any(Number),
              type: expect.any(String)
            }),
            statistics: expect.objectContaining({
              pastDayAwardedCount: expect.any(Number),
              awardedCount: expect.any(Number),
              winRatePercentage: expect.any(Number)
            }),
            created: expect.any(Date),
            updated: expect.any(Date)
          })
        ])
      )
    })
  })
})
