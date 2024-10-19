<template>
  <q-layout view="hHh lpR lFr">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <q-icon name="question_answer" />
          </q-avatar>
          SKRUPULUS
        </q-toolbar-title>
        <NotificationsIconComponent />
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
      <!-- Left drawer content -->
      <KeepAlive><ServerListComponent /></KeepAlive>
    </q-drawer>

    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      bordered
      class="right-drawer"
    >
      <!-- Right drawer content -->
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

    <q-page-container class="center-content">
      <router-view />
      <InfiniteScrollComponent />
    </q-page-container>

    <q-footer elevated>
      <CommandLineComponent
        :rightDrawerOpen="rightDrawerOpen"
        @toggleRightDrawer="toggleRightDrawer"
        @createNewChannel="handleCreateNewChannel"
      />
    </q-footer>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import ServerListComponent from 'components/ServerListComponent.vue';
import CommandLineComponent from 'src/components/CommandLineComponent.vue';
import UserAvatarComponent from 'src/components/UserAvatarComponent.vue';
import InfiniteScrollComponent from 'src/components/InfiniteScrollComponent.vue';
import UserListComponent from 'src/components/UserListComponent.vue';
import NotificationsIconComponent from 'src/components/NotificationsIconComponent.vue';

export default {
  components: {
    ServerListComponent,
    CommandLineComponent,
    UserAvatarComponent,
    InfiniteScrollComponent,
    UserListComponent,
    NotificationsIconComponent,
  },
  props: {
    newChannel: Object,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    const newChannel = ref(null);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value;
    };

    const handleCreateNewChannel = (channelData) => {
      console.log(channelData);
      console.log(newChannel.value);
      newChannel.value = channelData;
      console.log(newChannel.value);
    };

    return {
      leftDrawerOpen,
      rightDrawerOpen,
      toggleLeftDrawer,
      toggleRightDrawer,
      handleCreateNewChannel,
    };
  },
};
</script>

<style scoped>
html,
body {
  overflow: hidden; /* Disable the browser scroll */
}

.left-drawer,
.right-drawer,
.center-content {
  overflow-y: scroll; /* Make each section scroll independently */
  height: 100vh; /* Ensure the sections take up full height */
}
</style>
