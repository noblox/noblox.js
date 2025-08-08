const { banFromGroup, changeRank, demote, getAuditLog, getGroup, getGroupBans, getGroups, getGroupSocialLinks, getJoinRequests, getPlayers, getRankInGroup, getRankNameInGroup, getRole, getRolePermissions, getRoles, getShout, getWall, promote, searchGroups, setRank, shout, setCookie, unbanFromGroup } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Groups Methods', () => {
  it('changeRank() changes rank of a user', () => {
    return changeRank(4591072, 857710783, 1).then((res) => {
      setTimeout(async () => {
        await changeRank(4591072, 857710783, -1)
      }, 1000)
      return expect(res).toMatchObject({
        newRole: expect.any(Object),
        oldRole: expect.any(Object)
      })
    })
  })

  it('promote() promotes a user', () => {
    return promote(4591072, 857710783).then((res) => {
      return expect(res).toMatchObject({
        newRole: expect.objectContaining({
          name: expect.any(String),
          rank: expect.any(Number),
          id: expect.any(Number)
        }),
        oldRole: expect.objectContaining({
          name: expect.any(String),
          rank: expect.any(Number),
          id: expect.any(Number)
        })
      })
    })
  })

  it('demote() demotes a user', () => {
    return demote(4591072, 857710783).then((res) => {
      return expect(res).toMatchObject({
        newRole: expect.objectContaining({
          name: expect.any(String),
          rank: expect.any(Number),
          id: expect.any(Number)
        }),
        oldRole: expect.objectContaining({
          name: expect.any(String),
          rank: expect.any(Number),
          id: expect.any(Number)
        })
      })
    })
  })

  it('getAuditLog() returns a group\'s audit logs', () => {
    return getAuditLog({ group: 4591072, limit: 10 }).then(res => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.toBeOneOf([expect.any(String), null]),
        nextPageCursor: expect.toBeOneOf([expect.any(String), null]),
        data: expect.arrayContaining([
          expect.objectContaining({
            actor: expect.objectContaining({
              user: expect.objectContaining({
                hasVerifiedBadge: expect.any(Boolean),
                userId: expect.any(Number),
                username: expect.any(String),
                displayName: expect.any(String)
              }),
              role: expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                rank: expect.any(Number)
              })
            }),
            actionType: expect.any(String),
            description: expect.any(Object),
            created: expect.any(Date)
          })
        ])
      })
    })
  })

  it('getGroup() returns information on a group', () => {
    return getGroup(4591072).then((res) => {
      return expect(res).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        owner: {
          userId: expect.any(Number),
          username: expect.any(String),
          hasVerifiedBadge: expect.any(Boolean),
          displayName: expect.any(String)
        },
        shout: expect.objectContaining({
          body: expect.any(String),
          poster: expect.objectContaining({
            hasVerifiedBadge: expect.any(Boolean),
            userId: expect.any(Number),
            username: expect.any(String),
            displayName: expect.any(String)
          }),
          created: expect.any(Date),
          updated: expect.any(Date)
        }),
        memberCount: expect.any(Number),
        isBuildersClubOnly: expect.any(Boolean),
        publicEntryAllowed: expect.any(Boolean),
        hasVerifiedBadge: expect.any(Boolean)
      })
    })
  })

  it('getGroups() should return groups the specified user is in', async () => {
    return getGroups(55549140).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            Id: expect.any(Number),
            Name: expect.any(String),
            EmblemUrl: expect.any(String),
            MemberCount: expect.any(Number),
            Rank: expect.any(Number),
            Role: expect.any(String),
            RoleId: expect.any(Number),
            IsPrimary: expect.any(Boolean)
          })
        ])
      )
    })
  })

  it('getGroupSocialLinks() should return social link information of a game, given universeId', () => {
    return getGroupSocialLinks(9997719).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            type: expect.any(String),
            url: expect.any(String)
          })
        ])
      )
    })
  })

  // TODO: getJoinRequest, would require being able to request to join a group

  it('getJoinRequests() returns a list of players that want to join a group', () => {
    return getJoinRequests(4591072).then((res) => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.toBeOneOf([expect.any(String), null]),
        nextPageCursor: expect.toBeOneOf([expect.any(String), null]),
        data: expect.any(Array)
      })
    })
  })

  it('getPlayers() returns a list of players in a group', () => {
    return getPlayers(4591072, [30820744]).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            userId: expect.any(Number),
            username: expect.any(String)
          })
        ])
      )
    })
  })

  it('getRankInGroup() returns a number reflecting a user\'s rank in a group (0-255)', () => {
    return getRankInGroup(4591072, 55549140).then((res) => {
      return expect(res).toEqual(expect.any(Number))
    })
  })

  it('getRankNameInGroup() returns a number reflecting a user\'s rank name in a group', () => {
    return getRankNameInGroup(4591072, 55549140).then((res) => {
      return expect(res).toEqual(expect.any(String))
    })
  })

  it('getRole() returns a role that matches the provided rank', () => {
    return getRole(4591072, 255).then((res) => {
      return expect(res).toMatchObject({
        name: expect.any(String),
        rank: expect.any(Number),
        memberCount: expect.any(Number),
        ID: expect.any(Number)
      })
    })
  })

  it('getRolePermissions() returns permissions given to a role by a group', () => {
    return getRolePermissions(4591072, 30820744).then((res) => {
      return expect(res).toMatchObject({
        groupId: expect.any(Number),
        role: expect.any(Object),
        permissions: expect.any(Object)
      })
    })
  })

  it('getRoles() returns the roles in a group', () => {
    return getRoles(4591072).then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            rank: expect.any(Number),
            memberCount: expect.any(Number),
            ID: expect.any(Number)
          })
        ])
      )
    })
  })

  it('getShout() returns the current shout on a group', () => {
    return getShout(4591072).then((res) => {
      return expect(res).toMatchObject({
        body: expect.any(String),
        poster: {
          userId: expect.any(Number),
          username: expect.any(String)
        },
        created: expect.any(String),
        updated: expect.any(String)
      })
    })
  })

  it('getWall() returns the latest messages on the group wall', () => {
    return getWall(4591072).then((res) => {
      return expect(res).toMatchObject({
        previousPageCursor: expect.toBeOneOf([expect.any(String), null]),
        nextPageCursor: expect.toBeOneOf([expect.any(String), null]),
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            poster: expect.toBeOneOf([expect.any(Object), null]),
            body: expect.any(String),
            created: expect.any(Date),
            updated: expect.any(Date)
          })
        ])
      })
    })
  })

  // PASS: groupPayout, costs Robux to test

  // PASS: handleJoinRequest, would require being able to request to join a group

  // PASS: leaveGroup, would require being able to request to join a group

  it('searchGroups() returns groups that match the query', () => {
    return searchGroups('noblox.js').then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          memberCount: expect.any(Number),
          publicEntryAllowed: expect.any(Boolean),
          created: expect.any(Date),
          updated: expect.any(Date)
        })]))
    })
  })

  // PASS: setGroupDescription -- skip this, do not own group

  // PASS: setGroupName -- skip this, costs Robux

  it('setRank() should set a player\'s rank to the specified rank', () => {
    return changeRank(4591072, 857710783, 2).then(() => {
      return setRank(4591072, 857710783, 1).then((res) => {
        return expect(res).toMatchObject({
          name: expect.any(String),
          rank: expect.any(Number),
          memberCount: expect.any(Number),
          ID: expect.any(Number)
        })
      })
    })
  })

  it('shout() should post a message to the group\'s shout', () => {
    return shout(4591072, 'This is a noblox.js test!').then((res) => {
      setTimeout(async () => {
        await shout(4591072, '')
      }, 1000)
      return expect(res).toMatchObject({
        body: expect.any(String),
        poster: {
          userId: expect.any(Number),
          username: expect.any(String)
        },
        created: expect.any(String),
        updated: expect.any(String)
      })
    })
  })

  it('banFromGroup() should ban a user from the specified group', () => {
    return banFromGroup(4591072, 1).then((res) => {
      return expect(res).toMatchObject({
        user: {
          hasVerifiedBadge: expect.any(Boolean),
          userId: expect.any(Number),
          username: expect.any(String),
          displayName: expect.any(String)
        },
        actingUser: {
          user: {
            hasVerifiedBadge: expect.any(Boolean),
            userId: expect.any(Number),
            username: expect.any(String),
            displayName: expect.any(String)
          },
          role: {
            id: expect.any(Number),
            name: expect.any(String),
            rank: expect.any(Number)
          }
        },
        created: expect.any(Date)
      })
    })
  })

  it('getGroupBans() should retrieve a page of group bans', () => {
    return getGroupBans(4591072, 10, 'Asc').then((res) => {
      return expect(res).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: {
              hasVerifiedBadge: expect.any(Boolean),
              userId: expect.any(Number),
              username: expect.any(String),
              displayName: expect.any(String)
            },
            actingUser: {
              user: {
                hasVerifiedBadge: expect.any(Boolean),
                userId: expect.any(Number),
                username: expect.any(String),
                displayName: expect.any(String)
              },
              role: {
                id: expect.any(Number),
                name: expect.any(String),
                rank: expect.any(Number)
              }
            },
            created: expect.any(Date)
          })
        ])
      )
    })
  })

  it('unbanFromGroup() should unban a user from a group', async () => {
    await expect(unbanFromGroup(4591072, 1)).resolves.not.toThrow()
  })
})

it('setRank() should set a player\'s rank to the specified rank', () => {
  return changeRank(4591072, 857710783, 2).then(() => {
    return setRank(4591072, 857710783, 1).then((res) => {
      return expect(res).toMatchObject({
        name: expect.any(String),
        rank: expect.any(Number),
        memberCount: expect.any(Number),
        ID: expect.any(Number)
      })
    })
  })
})


// PASS: setRoleInfo -- skip this, do not own group

// it('setRoleInfo() should update a role\'s information', () => {
//   return getRole(4591072, 1).then((originalRoleInfo) => {
//     return setRoleInfo(4591072, 1, { name: 'Programmer', description: 'Programs on roblox n stuff', rank: 2 }).then((res) => {
//       return setRoleInfo(4591072, "Programmer", originalRoleInfo).then(() => {
//         return expect(res).toMatchObject({
//           name: expect.any(String),
//           rank: expect.any(Number),
//           description: expect.any(String)
//         })
//       })
//     })
//   })
// })
