const { avatarRules, currentlyWearing, getAvatar, getCurrentAvatar, getRecentItems, outfitDetails, outfits, redrawAvatar, removeAssetId, setAvatarBodyColors, setAvatarScales, setPlayerAvatarType, setWearingAssets, wearAssetId, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Avatar Methods', () => {
  it('avatarRules() returns avatar rules from Roblox', () => {
    return avatarRules().then((rules) => {
      expect(rules).toMatchObject({
        playerAvatarTypes: expect.any(Array),
        scales: expect.any(Object),
        wearableAssetTypes: expect.any(Array),
        bodyColorsPalette: expect.any(Array),
        basicBodyColorsPalette: expect.any(Array),
        minimumDeltaEBodyColorDifference: expect.any(Number),
        proportionsAndBodyTypeEnabledForUser: expect.any(Boolean),
        defaultClothingAssetLists: expect.any(Object),
        bundlesEnabledForUser: expect.any(Boolean),
        emotesEnabledForUser: expect.any(Boolean)
      })
    })
  })

  it('currentlyWearing() returns an array containing which assets are being worn by a user', () => {
    return currentlyWearing(1).then((res) => {
      expect(res).toMatchObject({
        assetIds: expect.any(Array)
      })
    })
  })

  it('getAvatar() returns avatar information on a user', () => {
    return getAvatar(1).then((res) => {
      expect(res).toMatchObject({
        scales: expect.any(Object),
        playerAvatarType: expect.any(String),
        bodyColors: expect.any(Object),
        assets: expect.any(Array),
        defaultShirtApplied: expect.any(Boolean),
        defaultPantsApplied: expect.any(Boolean),
        emotes: expect.any(Array)
      })
    })
  })

  it('getCurrentAvatar() returns avatar information for logged in user', () => {
    return getCurrentAvatar().then((res) => {
      expect(res).toMatchObject({
        scales: expect.any(Object),
        playerAvatarType: expect.any(String),
        bodyColors: expect.any(Object),
        assets: expect.any(Array),
        defaultShirtApplied: expect.any(Boolean),
        defaultPantsApplied: expect.any(Boolean),
        emotes: expect.any(Array)
      })
    })
  })

  it('getRecentItems() returns recently worn items for logged in user', () => {
    return getRecentItems('Accessories').then((res) => {
      expect(res).toMatchObject({
        data: expect.any(Array),
        total: expect.any(Number)
      })
    })
  })

  it('outfitDetails() returns information on a created outfit (costume)', () => {
    return outfitDetails(19461896).then((res) => {
      expect(res).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        assets: expect.any(Array),
        bodyColors: expect.any(Object),
        scale: expect.any(Object),
        playerAvatarType: expect.any(String),
        isEditable: expect.any(Boolean)
      })
    })
  })

  it('outfits() returns a user\'s oufits', () => {
    return outfits(1).then((res) => {
      expect(res).toMatchObject({
        filteredCount: expect.any(Number),
        data: expect.any(Array),
        total: expect.any(Number)
      })
    })
  })

  it('redrawAvatar() redraws logged in user\'s avatar or gets flood checked', () => {
    return redrawAvatar().catch((err) => {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(() => { throw new Error(err) }).toThrow('Redraw avatar floodchecked')
    })
  })

  it('removeAssetId() takes off a worn asset on logged in user\'s avatar', async () => {
    await expect(removeAssetId(1989194006)).resolves.not.toThrow()
  })

  it('setAvatarBodyColors() sets body colors to selected colors', () => {
    return setAvatarBodyColors(194, 37, 194, 194, 102, 102).then(() => {
      return getCurrentAvatar().then((res) => {
        expect(res.dataColors).toEqual({
          headColorId: 194,
          torsoColorId: 37,
          rightArmColorId: 194,
          leftArmColorId: 194,
          rightLegColorId: 102,
          leftLegColorId: 102
        })
      })
    })
  })

  it('setAvatarScales() sets avatar scales', () => {
    return setAvatarScales(1, 1, 1, 1, 0, 0).then(() => {
      return getCurrentAvatar().then((res) => {
        expect(res.scales).toEqual({
          height: 1,
          width: 1,
          head: 1,
          depth: 1,
          proportion: 0,
          bodyType: 0
        })
      })
    })
  })

  it('setPlayerAvatarType() sets avatar body type', () => {
    return setPlayerAvatarType('R6').then(() => {
      return getCurrentAvatar().then((res) => {
        expect(res.playerAvatarType).toBe('R6')
      })
    })
  })

  it('setWearingAssets() sets the player worn asset ID list to whatever is provided', async () => {
    await expect(setWearingAssets([63690008,
      86498048,
      86500008,
      86500036,
      86500054,
      86500064,
      86500078,
      144075659,
      144076358,
      144076760
    ])).resolves.not.toThrow()
  })

  it('wearAssetId() wears the asset ID provided on the currently logged in user\'s avatar', async () => {
    await expect(wearAssetId(1989194006)).resolves.not.toThrow()
  })
})
