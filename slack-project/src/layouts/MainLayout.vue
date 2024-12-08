<template>
  <div v-if="isAuthenticated">
    <q-layout view="hHh lpr lFr">
      <q-header reveal elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

          <q-toolbar-title>
            <q-avatar>
              <q-icon name="question_answer" />
            </q-avatar>
            SKRUPULUS
          </q-toolbar-title>
          <NotificationsComponent />
          <UserAvatarComponent @userStatusChanged="userStatusChanged" />
        </q-toolbar>
      </q-header>

      <q-drawer
        show-if-above
        v-model="leftDrawerOpen"
        side="left"
        bordered
        persistent
        class="left-drawer"
      >
        <KeepAlive
          ><ChannelListComponent
            :setSelectedChannelEvent="setSelectedChannelEvent"
            @cancel-command="handleCancelCommand"
            @join-command="handleJoinCommand"
            @invite-command="handleInviteCommand"
            @kick-command="handleKickCommand"
            @join-channel="joinChannel"
        /></KeepAlive>
      </q-drawer>

      <q-drawer
        v-model="rightDrawerOpen"
        side="right"
        bordered
        class="right-drawer"
      >
        <q-btn
          color="negative"
          icon="close"
          flat
          round
          dense
          @click="toggleRightDrawer"
        />
        <UserListComponent />
      </q-drawer>

      <q-page-container class="center-content" ref="containerForInfiniteScroll">
        <router-view />
        <q-page>
          <InfiniteScrollComponent @static-messages-loaded="scrollToBottom" />
        </q-page>
      </q-page-container>

      <q-footer elevated>
        <CommandLineComponent
          :rightDrawerOpen="rightDrawerOpen"
          @toggleRightDrawer="toggleRightDrawer"
          @createNewChannel="handleCreateNewChannel"
          @message-sent="scrollToBottom"
          @send-message="sendMessage"
          @typing="typing"
          @join-command="handleJoinCommand"
          @quit-command="handleQuitCommand"
          @cancel-command="handleCancelCommand"
          @invite-command="handleInviteCommand"
          @revoke-command="handleRevokeCommand"
          @kick-command="handleKickCommand"
        />
      </q-footer>
    </q-layout>
  </div>
  <div v-else>Not logged in</div>
</template>

<script>
import ChannelListComponent from 'components/ChannelListComponent.vue';
import CommandLineComponent from 'src/components/CommandLineComponent.vue';
import UserAvatarComponent from 'src/components/UserAvatarComponent.vue';
import InfiniteScrollComponent from 'src/components/InfiniteScrollComponent.vue';
import UserListComponent from 'src/components/UserListComponent.vue';
import NotificationsComponent from 'src/components/NotificationsComponent.vue';

import { mapActions, mapGetters } from 'vuex';
import { io } from 'socket.io-client';
import { AppVisibility } from 'quasar';

export default {
  components: {
    ChannelListComponent,
    CommandLineComponent,
    UserAvatarComponent,
    InfiniteScrollComponent,
    UserListComponent,
    NotificationsComponent,
  },
  data() {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      newChannel: null,
      socket: null,
      currentChannel: null,
      setSelectedChannelEvent: { type: '', payload: null },
    };
  },
  created() {
    this.me().then(() => {
      this.setupSocket();
    });
    if (!this.isAuthenticated) {
      this.$router.push({ name: 'login' });
    }
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  },
  watch: {
    isAuthenticated(newValue) {
      if (!newValue) {
        this.$router.push('/login');
      }
    },

    // selectedChannel(newSelectedChannel) {
    //   console.log('Selected channel changed:', newSelectedChannel);
    //   this.changeChannel(newSelectedChannel);
    // },
  },
  // mounted() {
  //   this.setupSocket();
  //   this.currentChannel = this.selectedChannel;
  // },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  computed: {
    ...mapGetters('module-example', ['isAuthenticated']),
    ...mapGetters('module-example', ['selectedChannel']),
    ...mapGetters('module-example', ['typingUsers']),
    ...mapGetters('module-example', ['username']),
    ...mapGetters('module-example', ['state']),
    ...mapGetters('module-example', ['notificationSetting']),
    ...mapGetters('module-example', ['channels']),
    ...mapGetters('module-example', ['userID']),
  },

  methods: {
    ...mapActions('module-example', ['me']),
    ...mapActions('module-example', ['setNewMessage']),
    ...mapActions('module-example', ['typingMessage']),
    ...mapActions('module-example', ['fetchChannelUsers']),
    ...mapActions('module-example', ['fetchChannels']),
    ...mapActions('module-example', ['updateState']),
    ...mapActions('module-example', ['userStatusChange']),
    ...mapActions('module-example', ['fetchChannelMessages']),
    ...mapActions('module-example', ['updateChannelListForInvitee']),
    ...mapActions('module-example', ['handleEmptyChannelList']),
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    toggleRightDrawer() {
      this.rightDrawerOpen = !this.rightDrawerOpen;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const scrollContainer = document.querySelector('.center-content');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      });
    },
    handleCreateNewChannel(channelData) {
      console.log(channelData);
      console.log(this.newChannel);
      this.newChannel = channelData;
      console.log(this.newChannel);
    },

    setupSocket() {
      console.log('Setting up socket', this.username);
      this.socket = io('http://localhost:3333', {
        query: {
          username: this.username,
        },
      });
      this.updateState('online');

      this.socket.on('message', (data) => {
        console.log('Received message:', data);
        console.log('Current state:', this.state);
        this.setNewMessage(data);
        if (
          data.author.username !== this.username &&
          Notification.permission === 'granted' &&
          !AppVisibility.appVisible &&
          this.state === 'online' &&
          this.notificationSetting === 'all'
        ) {
          new Notification(`New message from ${data.author.username}`, {
            body:
              data.text.length > 30
                ? data.text.substring(0, 30) + '...'
                : data.text,
            icon: this.verifierLogo,
          });
        } else if (
          data.author.username !== this.username &&
          Notification.permission === 'granted' &&
          !AppVisibility.appVisible &&
          this.state === 'online' &&
          this.notificationSetting === 'Tag-only' &&
          data.text.includes(`@${this.username}`)
        ) {
          new Notification(`New message from ${data.author.username}`, {
            body:
              data.text.length > 30
                ? data.text.substring(0, 30) + '...'
                : data.text,
            icon: this.verifierLogo,
          });
        }
      });

      this.socket.on('typing', (data) => {
        this.typingMessage(data);
      });

      this.socket.on('userStatus', (data) => {
        console.log('User status:', data);
        this.userStatusChange(data);
      });

      this.socket.on('user-joined-channel', async (data) => {
        const { channel, user } = data;
        if (channel.id == this.selectedChannel) {
          // needs to add this new member
          await this.fetchChannelUsers(channel.id);
        } else {
          if (this.userID == user.id) {
            await this.fetchChannels();
            this.triggerSetSelectedChannelEvent(channel.id);
          }
        }
      });

      this.socket.on('channel-deleted', async () => {
        await this.fetchChannels();
        if (this.channels && this.channels.length > 0) {
          this.triggerSetSelectedChannelEvent(this.channels[0].id);
        } else {
          await this.handleEmptyChannelList();
        }
      });

      this.socket.on('user-left-channel', async (data) => {
        const { channel, user } = data;
        if (channel.id == this.selectedChannel) {
          if (this.userID == user.id) {
            await this.fetchChannels();
            if (this.channels && this.channels.length > 0) {
              this.triggerSetSelectedChannelEvent(this.channels[0].id);
            } else {
              await this.handleEmptyChannelList();
            }
          } else {
            await this.fetchChannelUsers(channel.id);
          }
        } else {
          if (this.userID == user.id) {
            await this.fetchChannels();
            if (this.channels && this.channels.length > 0) {
              this.triggerSetSelectedChannelEvent(this.channels[0].id);
            } else {
              await this.handleEmptyChannelList();
            }
          }
        }
      });

      this.socket.on('user-invited-to-channel', async (data) => {
        const { channel, invitee } = data;

        if (this.userID == invitee.id) {
          await this.updateChannelListForInvitee(channel.id);
          this.triggerSetSelectedChannelEvent(channel.id);
        } else if (this.selectedChannel == channel.id) {
          await this.fetchChannelUsers(channel.id);
        }
      });

      this.socket.on('user-kicked-from-channel', async (data) => {
        const { channel, kickee } = data;

        if (this.userID == kickee.id) {
          await this.fetchChannels();
          if (this.channels && this.channels.length > 0) {
            this.triggerSetSelectedChannelEvent(this.channels[0].id);
          } else {
            await this.handleEmptyChannelList();
          }
        } else if (this.selectedChannel == channel.id) {
          await this.fetchChannelUsers(channel.id);
        }
      });
    },

    triggerSetSelectedChannelEvent(channelId) {
      this.setSelectedChannelEvent = {
        type: 'setSelectedChannelUpdate',
        payload: { key: channelId },
      };
    },

    sendMessage(data) {
      this.socket.emit('message', data);
    },
    typing(data) {
      this.socket.emit('typing', data);
    },
    joinChannel(channel) {
      this.socket.emit('join', channel);
    },
    leaveChannel(channel) {
      this.socket.emit('leave', channel);
    },
    handleJoinCommand(channelName, channelType) {
      const username = this.username;
      this.socket.emit('join-command', { channelName, channelType, username });
    },
    handleQuitCommand() {
      const username = this.username;
      const channelId = this.selectedChannel;
      this.socket.emit('quit-command', { channelId, username });
    },
    handleCancelCommand() {
      const username = this.username;
      const channelId = this.selectedChannel;
      this.socket.emit('cancel-command', { channelId, username });
    },
    handleInviteCommand(invitee) {
      const username = this.username;
      const channelId = this.selectedChannel;
      this.socket.emit('invite-command', {
        channelId,
        username,
        invitee,
      });
    },
    handleRevokeCommand(revokee) {
      const username = this.username;
      const channelId = this.selectedChannel;
      this.socket.emit('revoke-command', {
        channelId,
        username,
        revokee,
      });
    },
    handleKickCommand(kickee) {
      const username = this.username;
      const channelId = this.selectedChannel;
      this.socket.emit('kick-command', { channelId, username, kickee });
    },
    async userStatusChanged(status) {
      console.log('User status changed:', status);

      if (status === 'offline') {
        if (this.socket) {
          this.socket.disconnect();
          this.socket = null;
        }
      } else if (status === 'online') {
        if (!this.socket) {
          this.setupSocket();
        } else if (!this.socket.connected) {
          this.socket.disconnect();
          this.socket = null;
          this.setupSocket();
        }

        await Promise.all([
          this.fetchChannels(),
          this.fetchChannelUsers(this.selectedChannel),
          this.fetchChannelMessages(this.selectedChannel),
        ]);

        this.channels.forEach((channel) => {
          this.joinChannel(channel.id);
        });
      }

      if (this.socket && this.socket.connected) {
        this.socket.emit('userStatus', status);
      }
    },
  },
};
</script>

<style scoped>
.left-drawer,
.right-drawer,
.center-content {
  overflow-y: scroll;
  height: 100vh;
}
</style>
