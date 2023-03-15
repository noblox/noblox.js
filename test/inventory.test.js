const { getCollectibles, getInventory, getInventoryById, getOwnership, getUAIDs, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Inventory Methods', () => {
  it('getCollectibles() should return a user\'s collectibles.', async () => {
    return getCollectibles(55549140).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userAssetId: expect.any(Number),
            serialNumber: expect.toBeOneOf([expect.any(Number), null]),
            assetId: expect.any(Number),
            name: expect.any(String),
            recentAveragePrice: expect.any(Number),
            originalPrice: expect.toBeOneOf([expect.any(Number), null]),
            assetStock: expect.toBeOneOf([expect.any(Number), null]),
            buildersClubMembershipType: expect.any(Number)
          })
        ])
      )
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

  it('getUAIDs() returns a user specific asset IDs given an ID', () => {
    return getUAIDs(80231025, [1974901902, 4255053867, 2705893733, 1532395]).then((res) => {
      return expect(res).toMatchObject({
        uaids: expect.any(Array),
        failedIds: expect.any(Array)
      })
    })
  })
})
