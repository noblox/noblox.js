const { addDeveloperProduct, checkDeveloperProductName, getDeveloperProducts, getGameBadges, getGameInstances, getPlaceInfo, updateDeveloperProduct, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Game Methods', () => {
  let newProductId

  it('addDeveloperProduct() adds a developer product to a universe', () => {
    return addDeveloperProduct(79354837, `${parseInt(Date.now().toString().slice(-6))} Coins`, 5, 'A hefty sum of cash for you and a successful test for me.').then((res) => {
      newProductId = res.productId

      return expect(res).toMatchObject({
        universeId: 79354837,
        name: expect.any(String), // account for Roblox filters
        priceInRobux: 5,
        description: expect.any(String), // account for Roblox filters
        productId: expect.any(Number)
      })
    })
  })

  it('checkDeveloperProductName() should return if a developer product name is in use within a universe', () => {
    return checkDeveloperProductName(79354837, '100 Koins').then((res) => {
      return expect(res).toMatchObject({
        Success: expect.any(Boolean),
        Message: expect.any(String)
      })
    })
  })

  it('getGameBadges() should return badges in a universe', () => {
    return getGameBadges(66654135).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String)
          })
        ])
      )
    })
  })

  it('getDeveloperProducts() should return developer products, given placeId', () => {
    return getDeveloperProducts(166178819).then((res) => {
      return expect(res).toMatchObject({
        DeveloperProducts: expect.any(Array),
        FinalPage: expect.any(Boolean),
        PageSize: expect.any(Number)
      })
    })
  })

  it('getGameInstances() should return instances of a game, given placeId', () => {
    return getGameInstances(142823291).then((res) => {
      return expect(res).toMatchObject({
        PlaceId: 142823291,
        Collection: expect.any(Array),
        TotalCollectionSize: expect.any(Number)
      })
    })
  })

  it('getPlaceInfo() should return information about a game', () => {
    return getPlaceInfo(142823291).then((res) => {
      return expect(res).toMatchObject({
        AssetId: expect.any(Number),
        Name: expect.any(String),
        Description: expect.any(String),
        FavoritedCount: expect.any(Number),
        Builder: expect.any(String),
        BuilderId: expect.any(Number),
        Created: expect.any(Date),
        Updated: expect.any(Date)
      })
    })
  })

  it('updateDeveloperProduct() should update a developer product with new information', () => {
    return getDeveloperProducts(166178819).then((productsData) => {
      const developerProduct = productsData.DeveloperProducts.filter((product) => product.ProductId === newProductId)[0]
      return updateDeveloperProduct(79354837, developerProduct.DeveloperProductId, `Test${Date.now().toString().slice(-6)}`, 104, 'Currently unit testing.').then((res) => {
        return expect(res).toMatchObject({
          universeId: 79354837,
          name: expect.any(String), // account for Roblox filters
          priceInRobux: 104,
          description: expect.any(String), // account for Roblox filters
          developerProductId: developerProduct.DeveloperProductId
        })
      })
    })
  })
})
