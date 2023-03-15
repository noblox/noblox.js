const { getPremium, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Premium Features Methods', () => {
  it('getPremium() returns a player\'s premium state', () => {
    return getPremium(55549140).then((res) => {
      return expect(res).toEqual(expect.any(Boolean))
    })
  })
})
