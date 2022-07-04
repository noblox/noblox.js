const { getLogo, getPlayerThumbnail, getThumbnails, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Thumbnails Methods', () => {
  it('getLogo() returns a image URL for a group', () => {
    return getLogo(4591072).then(() => {
      return expect.any(String)
    })
  })

  it('getPlayerThumbnail() returns a player\'s thumbnail', () => {
    return getPlayerThumbnail(55549140, 60).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            targetId: expect.any(Number),
            state: expect.any(String),
            imageUrl: expect.any(String)
          })
        ])
      )
    })
  })

  it('getThumbnails() returns player/asset thumbnails', () => {
    return getThumbnails([
      {
        type: 'AvatarHeadShot',
        token: '4C32C300ABC60ABD344ABCFB3841E778',
        size: '150x150'
      }
    ]).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            errorCode: expect.any(Number),
            errorMessage: expect.any(String),
            targetId: expect.any(Number),
            state: expect.any(String),
            imageUrl: expect.any(String)
          })
        ])
      )
    })
  })
})
