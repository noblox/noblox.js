const { buy, getGroupFunds, getGroupPayoutEligibility, getGroupRevenueSummary, getGroupTransactions, getResaleData, getResellers, getUserTransactions, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Economy Methods', () => {
  it('buy() successfully purchases an item', () => {
    return buy(1778181).then(res => {
      return expect(res).toEqual({
        productId: expect.any(Number),
        price: expect.any(Number)
      })
    })
  })

  it('getGroupFunds() returns amount of robux in group funds', () => {
    return getGroupFunds(9997719).then((res) => {
      return expect(res).toEqual(expect.any(Number))
    })
  })

  it('getGroupPayoutEligibility() returns a list of payout statuses for specified users', () => {
    return getGroupPayoutEligibility({ group: 9997719, member: 55549140 }).then((res) => {
      return expect(res).toMatchObject({ [expect.any(String)]: expect.any(String) })
    })
  })

  it('getGroupRevenueSummary() returns a revenue summary for a group', () => {
    return getGroupRevenueSummary(9997719).then((res) => {
      return expect(res).toMatchObject({
        recurringRobuxStipend: expect.any(Number),
        itemSaleRobux: expect.any(Number),
        purchasedRobux: expect.any(Number),
        tradeSystemRobux: expect.any(Number),
        pendingRobux: expect.any(Number),
        groupPayoutRobux: expect.any(Number),
        individualToGroupRobux: expect.any(Number),
        premiumPayouts: expect.any(Number),
        groupPremiumPayouts: expect.any(Number),
        adjustmentRobux: expect.any(Number)
      })
    })
  })

  it('getGroupTransactions() returns transactions related to a group', () => {
    return getGroupTransactions(4591072).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            created: expect.any(Date),
            isPending: expect.any(Boolean),
            currency: expect.objectContaining({
              amount: expect.any(Number),
              type: expect.any(String)
            }),
            details: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              type: expect.any(String)
            }),
            agent: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              type: expect.any(String)
            })
          })
        ])
      )
    })
  })

  it('getResaleData() successfully returns a collectible\'s resale history', () => {
    return getResaleData(20573078).then((res) => { // Shaggy
      return expect(res).toMatchObject({
        assetStock: expect.toBeOneOf([expect.any(Number), null]),
        sales: expect.any(Number),
        numberRemaining: expect.toBeOneOf([expect.any(Number), null]),
        recentAveragePrice: expect.any(Number),
        originalPrice: expect.toBeOneOf([expect.any(Number), null]),
        priceDataPoints: expect.arrayContaining([
          expect.objectContaining({
            value: expect.toBeOneOf([expect.any(Number), null]),
            date: expect.toBeOneOf([expect.any(Date), null])
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
            serialNumber: expect.toBeOneOf([expect.any(Number), null]),
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

  it('getUserTransactions() returns the logged in user\'s transaction history', () => {
    return getUserTransactions('Purchase').then(res => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            created: expect.any(Date),
            isPending: expect.any(Boolean),
            transactionType: expect.any(String),
            agent: expect.objectContaining({
              id: expect.any(Number),
              type: expect.any(String),
              name: expect.any(String)
            }),
            details: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              type: expect.any(String)
            }),
            currency: expect.objectContaining({
              amount: expect.any(Number),
              type: expect.any(String)
            })
          })
        ])
      )
    })
  })
})
