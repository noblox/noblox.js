const { buy, configureItem, deleteFromInventory, getProductInfo, getResaleData, getResellers, uploadItem, uploadAnimation, setCookie } = require('../lib')
const fs = require('fs')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

expect.extend({
  nullOrAny (received, expected) {
    if (received === null) {
      return {
        pass: true,
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    if (expected === String) {
      return {
        pass: typeof received === 'string' || received instanceof String,
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    if (expected === Number) {
      return {
        pass: typeof received === 'number' || received instanceof Number,
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    if (expected === Function) {
      return {
        pass: typeof received === 'function' || received instanceof Function,
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    if (expected === Object) {
      return {
        pass: received !== null && typeof received === 'object',
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    if (expected === Boolean) {
      return {
        pass: typeof received === 'boolean',
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }

    /* jshint -W122 */
    /* global Symbol */
    if (typeof Symbol !== 'undefined' && this.expectedObject === Symbol) {
      return {
        pass: typeof received === 'symbol',
        message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
      }
    }
    /* jshint +W122 */

    return {
      pass: received instanceof expected,
      message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`
    }
  }
})

describe('Asset Methods', () => {
  it('buy() successfully purchases an item', () => {
    return buy(1778181).then(res => {
      return expect(res).toEqual({
        productId: expect.any(Number),
        price: expect.any(Number)
      })
    })
  })

  it('deleteFromInventory() successfully deletes an item from user\'s inventory', () => {
    return deleteFromInventory(1778181)
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

  it('getProductInfo() successfully returns a product\'s information', () => {
    return getProductInfo(1989194006).then((res) => {
      return expect(res).toMatchObject({
        Name: expect.any(String),
        Description: expect.any(String),
        Creator: expect.any(Object),
        PriceInRobux: expect.nullOrAny(Number)
      })
    })
  })

  it('getResaleData() successfully returns a collectible\'s resale history', () => {
    return getResaleData(20573078).then((res) => { // Shaggy
      return expect(res).toMatchObject({
        assetStock: expect.nullOrAny(Number),
        sales: expect.any(Number),
        numberRemaining: expect.nullOrAny(Number),
        recentAveragePrice: expect.any(Number),
        originalPrice: expect.nullOrAny(Number),
        priceDataPoints: expect.arrayContaining([
          expect.objectContaining({
            value: expect.nullOrAny(Number),
            date: expect.nullOrAny(Date)
          })
        ])
      })
    })
  })

  it('getResellers() successfully returns a collectible\'s resellable copies', () => {
    return getResellers(20573078).then((res) => { // Shaggy
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userAssetId: expect.any(Number),
            price: expect.any(Number),
            serialNumber: expect.nullOrAny(Number),
            seller: expect.objectContaining({
              id: expect.any(Number),
              type: expect.any(String),
              name: expect.any(String)
            })
          })
        ])
      )
    })
  })

  it('uploadItem() uploads an image', () => {
    return uploadItem('noblox', 13, fs.createReadStream('./img/noblox-js.png'))
  })

  it('uploadAnimation() uploads an animation', () => {
    return uploadAnimation(fs.createReadStream('./test/assets/KeyframeSequence.rbxm'), { name: 'noblox', description: 'A noblox test!', copyLocked: true, allowComments: false }).then((res) => {
      return expect(res).toEqual(expect.any(Number))
    })
  })
})
