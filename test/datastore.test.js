const { deleteDatastoreEntry, getDatastoreEntry, getDatastoreEntryVersions, setDatastoreEntry, getDatastoreKeys, getDatastores, incrementDatastoreEntry, setAPIKey } = require('../lib')

beforeAll(() => {
  setAPIKey(process.env.API_KEY)
})

describe('Data Store Methods', () => {
  it('setDatastoreEntry() sets a datastore entry to the specified value', async () => {
    return setDatastoreEntry({ universeId: 79354837, datastoreName: 'noblox_testing', entryKey: 'test1', body: 230, robloxEntryUserIDs: [55549140] }).then((res) => {
      expect(res).toMatchObject({
        version: expect.any(String),
        deleted: expect.any(Boolean),
        contentLength: expect.any(Number),
        createdTime: expect.any(Date),
        objectCreatedTime: expect.any(Date)
      })
    })
  })

  it('getDatastores() returns all datastores in a universe', async () => {
    return getDatastores(79354837).then((res) => {
      return expect(res).toMatchObject({
        datastores: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            createdTime: expect.any(Date)
          })
        ]),
        nextPageCursor: expect.toBeOneOf([expect.any(String), null])
      })
    })
  })

  it('getDatastoreEntry() returns a datastore entry', async () => {
    return getDatastoreEntry({ universeId: 79354837, datastoreName: 'noblox_testing', entryKey: 'test1' }).then((res) => {
      return expect(res).toMatchObject({
        data: expect.anything(),
        metadata: expect.objectContaining({
          robloxEntryCreatedTime: expect.any(Date),
          lastModified: expect.any(Date),
          robloxEntryVersion: expect.any(String),
          robloxEntryAttributes: expect.toBeOneOf([expect.any(String), undefined]),
          robloxEntryUserIDs: expect.toBeOneOf([expect.any(String), undefined]),
          contentMD5: expect.any(String),
          contentLength: expect.any(Number)
        })
      })
    })
  })

  it('getDatastoreKeys() returns all the keys in a datastore', async () => {
    return getDatastoreKeys({ universeId: 79354837, datastoreName: 'noblox_testing' }).then((res) => {
      return expect(res).toMatchObject({
        keys: expect.arrayContaining([
          expect.objectContaining({
            scope: expect.any(String),
            key: expect.any(String)
          })
        ]),
        nextPageCursor: expect.any(String)
      })
    })
  })

  it('incrementDatastoreEntry() increments an entry by one', async () => {
    await setDatastoreEntry({ universeId: 79354837, datastoreName: 'noblox_testing', entryKey: 'test1', body: 230, robloxEntryUserIDs: [55549140] })
    return incrementDatastoreEntry({ universeId: 79354837, datastoreName: 'noblox_testing', entryKey: 'test1', incrementBy: 1 }).then((res) => {
      return expect(res).toMatchObject({
        data: 231,
        metadata: expect.objectContaining({
          robloxEntryCreatedTime: expect.any(Date),
          lastModified: expect.any(Date),
          robloxEntryVersion: expect.any(String),
          robloxEntryAttributes: expect.toBeOneOf([expect.any(String), undefined]),
          robloxEntryUserIDs: expect.toBeOneOf([expect.any(String), undefined]),
          contentMD5: expect.any(String),
          contentLength: expect.any(Number)
        })
      })
    })
  })

  it('getDatastoreEntryVersions() returns versions of an entry in a datastore', async () => {
    return getDatastoreEntryVersions({ universeId: 79354837, datastoreName: 'noblox_testing', entryKey: 'test1' }).then((res) => {
      return expect(res).toMatchObject({
        versions: expect.arrayContaining([
          expect.objectContaining({
            version: expect.any(String),
            deleted: expect.any(Boolean),
            contentLength: expect.any(Number),
            createdTime: expect.any(Date),
            objectCreatedTime: expect.any(Date)
          })
        ]),
        nextPageCursor: expect.any(String)
      })
    })
  })

  it('deleteDatastoreEntry() deletes an entry from the datastore', async () => {
    await setDatastoreEntry({ universeId: 79354837, datastoreName: 'noblox_testing', entryKey: 'test2', body: 'delete me!' })

    return await expect(deleteDatastoreEntry({ universeId: 79354837, datastoreName: 'noblox_testing', entryKey: 'test2' })).resolves.not.toThrow()
  })
})
