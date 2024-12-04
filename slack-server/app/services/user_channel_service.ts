// import Whitelist from '#models/whitelist'

// export default class UserChannelService {
//   public async fetchUserChannels(userId: number): Promise<Record<number, ChannelData>> {
//     // Fetch whitelist entries for the user and preload channels with related data
//     const whitelistEntries = await Whitelist.query()
//       .where('userId', userId)
//       .preload('channel', (channelQuery) => {
//         channelQuery
//           .preload('users') // Preload related users
//           .preload('messages', (messageQuery) => {
//             messageQuery.preload('author') // Preload message authors
//           })
//       })

//     // Transform the whitelist entries into a dictionary of channels
//     return whitelistEntries.reduce(
//       (acc, entry) => {
//         const channel = entry.channel
//         acc[channel.id] = {
//           name: channel.name,
//           adminId: channel.adminId,
//           channelType: channel.channelType,
//           users: channel.users.map((user) => ({
//             id: user.id,
//             username: user.username,
//           })),
//           messages: channel.messages.map((message) => ({
//             id: message.id,
//             text: message.text,
//             author: {
//               id: message.author.id,
//               name: message.author.username,
//             },
//             createdAt: message.createdAt.toISO(),
//           })),
//         }
//         return acc
//       },
//       {} as Record<number, ChannelData>
//     )
//   }
// }

// // Define the TypeScript type for channel data
// type ChannelData = {
//   name: string
//   adminId: number
//   channelType: string
//   users: { id: number; username: string }[]
//   messages: {
//     id: number
//     text: string
//     author: { id: number; name: string }
//     createdAt: string | null
//   }[]
// }

import Whitelist from '#models/whitelist'
import Message from '#models/message'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class UserChannelService {
  // Existing method modified to fetch only 20 messages per channel
  public async fetchUserChannels(userId: number): Promise<Record<number, ChannelData>> {
    // Fetch whitelist entries and preload channels and users
    const whitelistEntries = await Whitelist.query()
      .where('userId', userId)
      .preload('channel', (channelQuery) => {
        channelQuery.preload('users')
      })

    const channelIds = whitelistEntries.map((entry) => entry.channel.id)

    // Fetch the latest 20 messages per channel using a window function
    const rawMessages = await db.rawQuery(
      `
      SELECT * FROM (
        SELECT m.*, ROW_NUMBER() OVER (PARTITION BY m.channel_id ORDER BY m.created_at DESC) as rn
        FROM messages m
        WHERE m.channel_id IN (${channelIds.join(',')})
      ) sub
      WHERE rn <= 20
      ORDER BY sub.channel_id, sub.created_at DESC
      `
    )

    // Preload authors for the messages
    const messageIds = rawMessages.rows.map((row: { id: number }) => row.id)
    const messagesWithAuthors = await Message.query().whereIn('id', messageIds).preload('author')

    // Organize messages by channelId
    const messagesPerChannel: { [key: number]: MessageData[] } = {}
    messagesWithAuthors.forEach((message) => {
      if (!messagesPerChannel[message.channelId]) {
        messagesPerChannel[message.channelId] = []
      }
      messagesPerChannel[message.channelId].push({
        id: message.id,
        text: message.text,
        author: {
          id: message.author.id,
          name: message.author.username,
        },
        createdAt: message.createdAt.toISO(),
      })
    })

    // Construct the channels data
    const channelsData: Record<number, ChannelData> = {}

    for (const entry of whitelistEntries) {
      const channel = entry.channel
      const messages = messagesPerChannel[channel.id] || []

      channelsData[channel.id] = {
        name: channel.name,
        adminId: channel.adminId,
        channelType: channel.channelType,
        users: channel.users.map((user) => ({
          id: user.id,
          username: user.username,
        })),
        messages: messages,
      }
    }

    return channelsData
  }

  // New method to fetch paginated messages for a specific channel
  public async fetchChannelMessages(
    channelId: number,
    beforeMessageId?: number
  ): Promise<MessageData[]> {
    let beforeDate: DateTime | undefined

    if (beforeMessageId) {
      const message = await Message.find(beforeMessageId)
      if (message) {
        beforeDate = message.createdAt

        // Ensure beforeDate is valid
        if (!beforeDate.isValid) {
          throw new Error('Invalid date in message.createdAt')
        }
      } else {
        throw new Error('Message not found')
      }
    }

    const messagesQuery = Message.query()
      .where('channelId', channelId)
      .orderBy('createdAt', 'desc')
      .orderBy('id', 'desc')
      .limit(20)
      .preload('author')

    if (beforeDate) {
      const isoDate = beforeDate.toISO()

      // Handle the case where toISO() returns null
      if (!isoDate) {
        throw new Error('Invalid ISO date from beforeDate.toISO()')
      }

      messagesQuery.where((builder) => {
        builder.where('createdAt', '<', isoDate).orWhere((subBuilder) => {
          subBuilder.where('createdAt', '=', isoDate)
          subBuilder.where('id', '<', beforeMessageId!)
        })
      })
    }

    const messages = await messagesQuery

    return messages.map((message) => ({
      id: message.id,
      text: message.text,
      author: {
        id: message.author.id,
        name: message.author.username,
      },
      createdAt: message.createdAt.toISO(),
    }))
  }
}

// TypeScript types
type ChannelData = {
  name: string
  adminId: number
  channelType: string
  users: { id: number; username: string }[]
  messages: MessageData[]
}

type MessageData = {
  id: number
  text: string
  author: { id: number; name: string }
  createdAt: string | null
}
