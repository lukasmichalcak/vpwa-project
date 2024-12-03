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
        <KeepAlive><ChannelListComponent 
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
  },

  methods: {
    ...mapActions('module-example', ['me']),
    ...mapActions('module-example', ['setNewMessage']),
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
      // Initialize the socket connection
      this.socket = io('http://localhost:3333');



      // Listen for messages from the server
      this.socket.on('message', (data) => {
        // Handle incoming messages
        this.$emit('new-message', data);
        console.log('Received message:', data);
        this.setNewMessage(data);
      });
    },
    // changeChannel(newChannel) {
    //   // Leave the previous channel
    //   if (this.currentChannel) {
    //     this.socket.emit('leave', this.currentChannel);
    //   }
    //   // Join the new channel
    //   this.socket.emit('join', newChannel);
    //   this.currentChannel = newChannel;
    // },
    sendMessage(data) {
      this.socket.emit('message',data);
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
