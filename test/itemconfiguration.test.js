const { getGroupAssets, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Item Configuration Methods', () => {
  it('getGroupAssets() returns an array of group assets', () => {
    return getGroupAssets({ groupId: 4591072, assetType: 'Shirt', limit: 1 }).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            assetId: expect.any(Number),
            name: expect.any(String)
          })
        ])
      )
    })
  })
})
