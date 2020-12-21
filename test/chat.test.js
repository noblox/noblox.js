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
    return addUsersToConversation(8212952828, [66592931]).then((res) => {
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

  it('getChatMessages() returns chat messages', () => {
    return getChatMessages(8212952828)
  })

  it('getConversations() returns chat conversations that fit the provided IDs', () => {
    return getConversations([8212952828])
  })

  it('getRolloutSettings() returns rollout settings for chat features', () => {
    return getRolloutSettings(['LuaChat', 'Party'])
  })

  it('getUnreadConversationCount() returns number of unread conversations', () => {
    return getUnreadConversationCount().then((res) => {
      expect(res).toMatchObject({
        count: expect.any(Number)
      })
    })
  })

  it('getUnreadMessages() returns unread messages in a given conversation', () => {
    return getUnreadMessages([8212952828])
  })

  it('getUserConversations() returns all conversations the logged in user is in', () => {
    return getUserConversations()
  })

  it('markChatAsRead() marks a conversation\'s messages as read to the specified message', () => {
    return markChatAsRead(8212952828, 'e775e103-876f-4332-84ab-1ea14f326d39')
  })

  it('markChatAsSeen() marks the conversations provided as seen', () => {
    return markChatAsSeen([8212952828])
  })

  it('multiGetLatestMessages() returns the latest messages corresponding to the given list of conversation IDs', () => {
    return multiGetLatestMessages([8212952828])
  })

  it('removeFromGroupConversation() removes a user from a given conversation', () => {
    return removeFromGroupConversation(newConversationId, 66592931)
  })

  it('renameGroupConversation() renames a group conversation', () => {
    return renameGroupConversation(newConversationId, 'noblox testing')
  })

  it('sendChatMessage() sends a chat message with provided content', () => {
    return sendChatMessage(newConversationId, 'This is a test.')
  })

  it('setChatUserTyping() toggles typing status', async () => {
    return setChatUserTyping(newConversationId, false).then((res) => {
      expect(res).toMatchObject({ resultType: 'Success' })
    })
  })

  it('start121Conversation() starts a conversation with another user', () => {
    return start121Conversation(55549140)
  })

  // TODO: startCloudEditConversation

  it('startGroupConversation() opens a conversation with multiple people in it', () => {
    return startGroupConversation([55549140, 66592931], 'noblox test 2').then((res) => {
      expect(res).toMatchObject({ resultType: 'Success' })
    })
  })
})
