const { buy, deleteFromInventory, getProductInfo, uploadAnimation, uploadItem, uploadModel, setCookie, getOwnership, getCurrentUser } = require('../lib')
const fs = require('fs')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
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

  it('uploadAnimation() uploads an animation', () => {
    return uploadAnimation(fs.createReadStream('./test/assets/KeyframeSequence.rbxm'), { name: 'noblox', description: 'A noblox test!', copyLocked: true, allowComments: false }).then((res) => {
      return expect(res).toEqual(expect.any(Number))
    })
  })

  it('uploadAnimation() errors when no options are provided', async () => {
    await expect(uploadAnimation(fs.createReadStream('./test/assets/KeyframeSequence.rbxm'))).rejects.toThrow()
  })

  it('uploadItem() uploads an image', async () => {
    await expect(uploadItem('noblox', 13, fs.createReadStream('./img/noblox-js.png'))).resolves.not.toThrow()
  })

  it('uploadModel() uploads a model', async () => {
    await expect(uploadModel(fs.createReadStream('./test/assets/Great-White-Shark-Fin.rbxm'), {
      name: 'Shark Fin',
      description: 'Uploaded via noblox',
      copyLocked: true
    })).resolves.not.toThrow()
  })

  it('uploadModel() errors when no options are provided', async () => {
    await expect(uploadModel(fs.createReadStream('./test/assets/Great-White-Shark-Fin.rbxm'))).rejects.toThrow()
  })
})
