const { addUsersToConversation, chatSettings, getChatMessages, getConversations, getRolloutSettings, getUnreadConversationCount, getUnreadMessages, getUserConversations, markChatAsRead, markChatAsSeen, multiGetLatestMessages, removeFromGroupConversation, renameGroupConversation, sendChatMessage, setChatUserTyping, start121Conversation, startGroupConversation, setCookie } = require('../lib')

beforeAll(() => {
  return new Promise(resolve => {
    setCookie(process.env.COOKIE).then(() => {
      resolve()
    })
  })
})

describe('Chat Methods', () => {
  let newConversationId

  it('addUsersToConversation() adds additional user(s) to form a group chat', () => {
    return addUsersToConversation(8212952828, [3187412077]).then((res) => {
      if (res && res.conversationId) newConversationId = res.conversationId

      expect(res).toEqual(
        expect.objectContaining({
          conversationId: expect.any(Number)
        })
      )
    })
  })

  it('chatSettings() returns chat settings', () => {
    return chatSettings().then((res) => {
      expect(res).toMatchObject({
        chatEnabled: expect.any(Boolean),
        isActiveChatUser: expect.any(Boolean)
      })
    })
  })

  it('getChatMessages() returns chat messages', async () => {
    await expect(getChatMessages(8212952828)).resolves.not.toThrow()
  })

  it('getConversations() returns chat conversations that fit the provided IDs', async () => {
    await expect(getConversations([8212952828])).resolves.not.toThrow()
  })

  it('getRolloutSettings() returns rollout settings for chat features', async () => {
    await expect(getRolloutSettings(['LuaChat', 'Party'])).resolves.not.toThrow()
  })

  it('getUnreadConversationCount() returns number of unread conversations', () => {
    return getUnreadConversationCount().then((res) => {
      expect(res).toMatchObject({
        count: expect.any(Number)
      })
    })
  })

  it('getUnreadMessages() returns unread messages in a given conversation', async () => {
    await expect(getUnreadMessages([8212952828])).resolves.not.toThrow()
  })

  it('getUserConversations() returns all conversations the logged in user is in', async () => {
    await expect(getUserConversations()).resolves.not.toThrow()
  })

  it('markChatAsRead() marks a conversation\'s messages as read to the specified message', async () => {
    await expect(markChatAsRead(8212952828, 'e775e103-876f-4332-84ab-1ea14f326d39')).resolves.not.toThrow()
  })

  it('markChatAsSeen() marks the conversations provided as seen', async () => {
    await expect(markChatAsSeen([8212952828])).resolves.not.toThrow()
  })

  it('multiGetLatestMessages() returns the latest messages corresponding to the given list of conversation IDs', async () => {
    await expect(multiGetLatestMessages([8212952828])).resolves.not.toThrow()
  })

  it('removeFromGroupConversation() removes a user from a given conversation', async () => {
    await expect(removeFromGroupConversation(newConversationId, 3187412077)).resolves.not.toThrow()
  })

  it('renameGroupConversation() renames a group conversation', async () => {
    await expect(renameGroupConversation(newConversationId, 'noblox testing')).resolves.not.toThrow()
  })

  it('sendChatMessage() sends a chat message with provided content', async () => {
    await expect(sendChatMessage(newConversationId, 'This is a test.')).resolves.not.toThrow()
  })

  it('setChatUserTyping() toggles typing status', async () => {
    return setChatUserTyping(newConversationId, false).then((res) => {
      expect(res).toMatchObject({ resultType: 'Success' })
    })
  })

  it('start121Conversation() starts a conversation with another user', async () => {
    await expect(start121Conversation(3187412077)).resolves.not.toThrow()
  })

  // TODO: startCloudEditConversation

  it('startGroupConversation() opens a conversation with multiple people in it', () => {
    return startGroupConversation([55549140, 3187412077], 'noblox test 2').then((res) => {
      expect(res).toMatchObject({ resultType: 'Success' })
    })
  })
})
