const { block, unblock, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Account Settings Methods', () => {
  it('block() blocks a user on Roblox', async () => {
    await expect(block(4397833)).resolves.not.toThrow()
  })

  it('block() errors when you try to block a blocked user on Roblox', async () => {
    await expect(block(4397833)).rejects.toThrow()
  })

  it('unblock() unblocks a user on Roblox', async () => {
    await expect(unblock(4397833)).resolves.not.toThrow()
  })

  it('block() errors when you try to unblock an unblocked user on Roblox', async () => {
    await expect(unblock(4397833)).rejects.toThrow()
  })
})
