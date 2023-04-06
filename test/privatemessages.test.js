const { getMessages, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Private Messages Methods', () => {
  it('getMessages() returns the logged in user\'s messages', () => {
    return getMessages().then((res) => {
      return expect(res).toMatchObject({
        totalCollectionSize: expect.any(Number),
        totalPages: expect.any(Number),
        pageNumber: expect.any(Number),
        collection: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            sender: expect.any(Object),
            recipient: expect.any(Object),
            subject: expect.any(String),
            body: expect.any(String),
            created: expect.any(String),
            updated: expect.any(String),
            isRead: expect.any(Boolean)
          })
        ])
      })
    })
  })
})
