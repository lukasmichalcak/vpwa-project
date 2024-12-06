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
          <UserAvatarComponent />
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
          ><ChannelListComponent @join-channel="joinChannel"
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
    };
  },
  created() {
    this.me();
    if (!this.isAuthenticated) {
      this.$router.push({ name: 'login' });
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
  mounted() {
    this.setupSocket();
    this.currentChannel = this.selectedChannel;
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  computed: {
    ...mapGetters('module-example', ['isAuthenticated']),
    ...mapGetters('module-example', ['selectedChannel']),
    ...mapGetters('module-example', ['typingUsers']),
  },

  methods: {
    ...mapActions('module-example', ['me']),
    ...mapActions('module-example', ['setNewMessage']),
    ...mapActions('module-example', ['typingMessage']),
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
      this.socket = io('http://localhost:3333');

      this.socket.on('message', (data) => {
        console.log('Received message:', data);
        this.setNewMessage(data);
      });

      this.socket.on('typing', (data) => {
        this.typingMessage(data);
      });
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
