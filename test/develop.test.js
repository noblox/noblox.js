const { updateUniverseAccess } = require('noblox.js')
const { canManage, configureItem, getProductInfo, updateUniverse, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Develop Methods', () => {
  it('canManage() checks if a user can manage an asset', () => {
    return canManage(2416399685, 6792044666).then((res) => {
      return expect(res).toBe(true)
    })
  })

  it('configureItem() successfully configures an item user owns', () => {
    return configureItem(1989194006, 'Main t-shirt', 'Uploaded by me').then(() => {
      return getProductInfo(1989194006).then((res) => {
        return expect(res).toMatchObject({
          Name: 'Main t-shirt',
          Description: 'Uploaded by me'
        })
      })
    })
  })

  it('updateUniverse() should update a universe with the provided settings', () => {
    return updateUniverse(79354837, { description: 'Testing 1234' }).then((res) => {
      return expect(res).toEqual(
        expect.objectContaining({
          genre: expect.any(String),
          id: expect.any(Number),
          isArchived: expect.any(Boolean),
          isForSale: expect.any(Boolean),
          isFriendsOnly: expect.any(Boolean),
          name: expect.any(String),
          playableDevices: expect.any(Array),
          price: expect.any(Number),
          universeAnimationType: expect.any(String),
          universeAvatarType: expect.any(String),
          universeCollisionType: expect.any(String),
          universeJointPositioningType: expect.any(String)
        })
      )
    })
  })

  it('updateUniverseAccess() should update a universe\'s public access setting.', async () => {
    await expect(updateUniverseAccess(79354837, true)).resolves.not.toThrow()
  })
})
