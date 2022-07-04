const { addDeveloperProduct, checkDeveloperProductName, configureGamePass, getDeveloperProducts, getGameInstances, getGamePasses, getGameSocialLinks, getGroupGames, getUniverseInfo, updateDeveloperProduct, setCookie } = require('../lib')

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

  it('configureGamePass() should configure a game pass', () => {
    const randomString = Date.now().toString().substr(-2)
    return configureGamePass(13925030, `name${randomString}`, 'random description', parseInt(randomString)).then((res) => {
      return expect(res).toMatchObject({
        gamePassId: 13925030,
        name: `name${randomString}`,
        description: 'random description',
        price: parseInt(randomString),
        isForSale: true,
        iconChanged: false
      })
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
    return getGameInstances(142823291, 'Public', 'Asc', 100).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            maxPlayers: expect.any(Number),
            playing: expect.any(Number),
            playerTokens: expect.arrayContaining([
              expect.any(String)
            ]),
            fps: expect.any(Number),
            ping: expect.any(Number)
          })
        ])
      )
    })
  })

  it('getGamePasses() should return an array of game passes, given universeId', () => {
    return getGamePasses(2615802125).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            displayName: expect.any(String),
            productId: expect.any(Number),
            price: expect.any(Number)
          })
        ])
      )
    })
  })

  it('getGameSocialLinks() should return social link information of a game, given universeId', () => {
    return getGameSocialLinks(2615802125).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            type: expect.any(String),
            url: expect.any(String)
          })
        ])
      )
    })
  })

  it('getGroupGames() returns an array of group games', () => {
    return getGroupGames({ groupId: 9997719, limit: 1 }).then((res) => {
      return expect(res[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.toBeOneOf([expect.any(String), null]),
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

  it('getUniverseInfo() should return information about universes', () => {
    return getUniverseInfo(2152417643).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            rootPlaceId: expect.any(Number),
            name: expect.any(String),
            description: expect.any(String),
            creator: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              type: expect.any(String),
              isRNVAccount: expect.any(Boolean)
            }),
            allowedGearGenres: expect.any(Array),
            allowedGearCategories: expect.any(Array),
            isGenreEnforced: expect.any(Boolean),
            copyingAllowed: expect.any(Boolean),
            playing: expect.any(Number),
            visits: expect.any(Number),
            maxPlayers: expect.any(Number),
            created: expect.any(Date),
            updated: expect.any(Date),
            studioAccessToApisAllowed: expect.any(Boolean),
            createVipServersAllowed: expect.any(Boolean),
            universeAvatarType: expect.any(String),
            genre: expect.any(String),
            isAllGenre: expect.any(Boolean),
            isFavoritedByUser: expect.any(Boolean),
            favoritedCount: expect.any(Number)
          })
        ])
      )
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
