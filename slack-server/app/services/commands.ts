import Blacklist from '#models/blacklist'
import Whitelist from '#models/whitelist'
import User from '#models/user'
import Channel from '#models/channel'

export default class CommandsService {
  public async join(channelName: string, channelType: string, username: string) {
    try {
      console.log(channelName, channelType, username)
      const user = await User.findByOrFail('username', username)
      console.log('user: ', user)

      let channel = await Channel.query().where('name', channelName).first()
      console.log('channel: ', channel)

      if (!channel) {
        channel = await Channel.create({
          name: channelName,
          adminId: user.id,
          channelType: channelType,
        })

        console.log('channel: ', channel)
        await channel.related('users').attach([user.id])
        console.log('channel: ', channel)

        return {
          success: true,
          message: `Channel '${channelName}' created and joined as admin.`,
          user: user,
          channel: channel,
        }
      }

      if (channel.channelType === 'private') {
        return { success: false, message: `Cannot join private channel '${channelName}'.` }
      }

      const blacklistEntry = await Blacklist.query()
        .where('userId', user.id)
        .andWhere('channelId', channel.id)
        .first()

      if (blacklistEntry?.banned) {
        return { success: false, message: `You are banned from channel '${channelName}'.` }
      }

      const isMember = await channel.related('users').query().where('users.id', user.id).first()

      if (isMember) {
        return { success: false, message: `You are already a member of channel '${channelName}'.` }
      }

      await channel.related('users').attach([user.id])

      return {
        success: true,
        message: `Successfully joined channel '${channelName}'.`,
        user: user,
        channel: channel,
      }
    } catch (error) {
      console.error('Error joining channel:', error)
      return { success: false, message: 'An error occurred while processing your request.' }
    }
  }

  public async cancel(channelId: number, username: string) {
    try {
      console.log(channelId, username)
      const user = await User.findByOrFail('username', username)
      console.log('user: ', user)

      let channel = await Channel.query().where('id', channelId).first()
      console.log('channel: ', channel)

      if (!channel) {
        return {
          success: false,
          message: `ChannelId '${channelId}' incorrect - either bad type or non-existent id.`,
        }
      } else {
        if (!user) {
          return {
            success: false,
            message: `User '${user}' non-existent.`,
          }
        } else {
          if (user.id === channel.adminId) {
            await Channel.query().where('id', channelId).delete()
            await Whitelist.query().where('channel_id', channelId).delete()
            await Blacklist.query().where('channel_id', channelId).delete()
            return {
              success: true,
              message: `Admin ${user.id} deleted channel ${channelId}.`,
              user: user,
              channel: channel,
            }
          } else {
            const whitelistEntry = await Whitelist.query()
              .where('channel_id', channelId)
              .andWhere('user_id', user.id)
              .first()

            if (whitelistEntry) {
              await whitelistEntry.delete()
              return {
                success: true,
                message: `User ${user.username} left channel '${channelId}'.`,
                user: user,
                channel: channel,
              }
            } else {
              return {
                success: false,
                message: `User ${user.username} is not a member of channel '${channelId}'.`,
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error on /cancel channel:', error)
      return { success: false, message: 'An error occurred while processing your request.' }
    }
  }

  public async quit(channelId: number, username: string) {
    try {
      console.log(channelId, username)
      const user = await User.findByOrFail('username', username)
      console.log('user: ', user)

      let channel = await Channel.query().where('id', channelId).first()
      console.log('channel: ', channel)

      if (!channel) {
        return {
          success: false,
          message: `ChannelId '${channelId}' incorrect - either bad type or non-existent id.`,
        }
      } else {
        if (!user) {
          return {
            success: false,
            message: `User '${user}' non-existent.`,
          }
        } else {
          if (user.id === channel.adminId) {
            await Channel.query().where('id', channelId).delete()
            await Whitelist.query().where('channel_id', channelId).delete()
            await Blacklist.query().where('channel_id', channelId).delete()
            return {
              success: true,
              message: `Admin ${user.id} deleted channel ${channelId}.`,
              user: user,
              channel: channel,
            }
          } else {
            return {
              success: false,
              message: `User '${user}' tried to delete channel ${channelId} but is not admin.`,
            }
          }
        }
      }
    } catch (error) {
      console.error('Error on /quit channel:', error)
      return { success: false, message: 'An error occurred while processing your request.' }
    }
  }

  public async invite(channel_id: number, username: string, invitee: string) {
    try {
      console.log(channel_id, username, invitee)
      const user = await User.findByOrFail('username', username)
      console.log('user: ', user)
      if (!user) {
        return { success: false, message: `User ${username} not found.` }
      }

      const inviteeUser = await User.findByOrFail('username', invitee)
      console.log('inviteeUser: ', inviteeUser)
      if (!inviteeUser) {
        return { success: false, message: `InviteeUser ${invitee} not found.` }
      }

      let channel = await Channel.query().where('id', channel_id).first()
      console.log('channel: ', channel)

      if (!channel) {
        return { success: false, message: `Channel ${channel_id} not found.` }
      }

      const isInviteeInChannel = await channel
        .related('users')
        .query()
        .where('users.id', inviteeUser.id)
        .first()

      if (isInviteeInChannel) {
        return {
          success: false,
          message: `Invitee ${invitee} is already a member of channel ${channel_id}.`,
        }
      }

      if (user.id === channel.adminId) {
        await Blacklist.query()
          .where('userId', inviteeUser.id)
          .andWhere('channelId', channel_id)
          .delete()

        await channel.related('users').attach([inviteeUser.id])

        return {
          success: true,
          message: `Invitee ${invitee} has been added to channel ${channel_id} by admin ${username}.`,
          user: user,
          inviteeUser: inviteeUser,
          channel: channel,
        }
      } else {
        if (channel.channelType === 'private') {
          return {
            success: false,
            message: `Non-admin ${username} cannot invite users to a private channel.`,
          }
        }
        const blacklistEntry = await Blacklist.query()
          .where('userId', inviteeUser.id)
          .andWhere('channelId', channel_id)
          .first()

        if (blacklistEntry && blacklistEntry.banned) {
          return {
            success: false,
            message: `Invitee ${invitee} is banned from channel ${channel_id}.`,
          }
        }
        await channel.related('users').attach([inviteeUser.id])

        return {
          success: true,
          message: `Invitee ${invitee} has been added to channel ${channel_id} by user ${username}.`,
          user: user,
          inviteeUser: inviteeUser,
          channel: channel,
        }
      }
    } catch (error) {
      console.error('Error joining channel:', error)
      return { success: false, message: 'An error occurred while processing your request.' }
    }
  }
}
