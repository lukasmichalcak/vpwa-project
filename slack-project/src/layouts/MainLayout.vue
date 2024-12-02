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
        <KeepAlive><ChannelListComponent /></KeepAlive>
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
  },
  computed: {
    ...mapGetters('module-example', ['isAuthenticated']),
  },

  methods: {
    ...mapActions('module-example', ['me']),
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
