const { buy, deleteFromInventory, getGamePassProductInfo, getProductInfo, uploadItem, setCookie, getOwnership, getCurrentUser } = require('../lib')
const fs = require('fs')

let userId

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then((user) => {
      userId = user.UserID
      resolve()
    })
  })
})

describe('Asset Methods', () => {
  it('deleteFromInventory() successfully deletes an item from user\'s inventory', async () => {
    await getOwnership(await getCurrentUser('UserId'), 1778181).then((res) => {
      if (!res) return buy(1778181)
    })
    return await expect(deleteFromInventory(1778181)).resolves.not.toThrow()
  })

  it('deleteFromInventory() errors when it tries to delete an item from user\'s inventory that isn\'t there', async () => {
    return await expect(deleteFromInventory(1778181)).rejects.toThrow()
  })

  it('getGamePassProductInfo() successfully returns a gamepass\'s information', () => {
    return getGamePassProductInfo(2919875).then((res) => {
      return expect(res).toMatchObject({
        Name: expect.any(String),
        Description: expect.any(String),
        Creator: expect.any(Object),
        PriceInRobux: expect.toBeOneOf([expect.any(Number), null])
      })
    })
  })

  it('getGamePassProductInfo() errors when returning a product\'s information that does not exist', async () => {
    return await expect(getGamePassProductInfo(0)).rejects.toThrow()
  })

  it('getProductInfo() successfully returns a product\'s information', () => {
    return getProductInfo(1989194006).then((res) => {
      return expect(res).toMatchObject({
        AssetId: expect.any(Number),
        ProductId: expect.any(Number),
        Name: expect.any(String),
        Description: expect.any(String),
        Creator: expect.any(Object),
        PriceInRobux: expect.toBeOneOf([expect.any(Number), null])
      })
    })
  })

  it('getProductInfo() errors when returning a product\'s information that does not exist', async () => {
    return await expect(getProductInfo(3)).rejects.toThrow()
  })

  it('uploadItem() uploads an animation', () => {
    return uploadItem('Test', 'Animation', fs.readFileSync('./test/assets/KeyframeSequence.rbxm'), { userId }).then((res) => {
      return expect(res).toHaveProperty('assetId')
    })
  })

  it('uploadItem() errors when no creator is provided', async () => {
    await expect(uploadItem('Test', 'Animation', fs.readFileSync('./test/assets/KeyframeSequence.rbxm'), {})).rejects.toBeDefined()
  })

  it('uploadItem() uploads an image', async () => {
    return uploadItem('Test', 'Image', fs.readFileSync('./img/noblox-js.png'), { userId }).then((res) => {
      return expect(res).toHaveProperty('assetId')
    })
  })

  it('uploadItem() uploads a model', async () => {
    return uploadItem('Test', 'Model', fs.readFileSync('./test/assets/Great-White-Shark-Fin.rbxm'), { userId }).then((res) => {
      return expect(res).toHaveProperty('assetId')
    })
  })
})
