<template>
  <q-layout view="hHh lpR lFr">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          v-if="$q.screen.lt.md"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-avatar>
            <q-icon name="question_answer" />
          </q-avatar>
          SKRUPULUS
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- Left drawer content -->
      <ServerListComponent />
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <!-- Right drawer content -->
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            User1
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
            User2
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated>
      <CommandLineComponent
        :rightDrawerOpen="rightDrawerOpen"
        @toggleRightDrawer="toggleRightDrawer"
      />
    </q-footer>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import ServerListComponent from 'components/ServerListComponent.vue'
import CommandLineComponent from 'src/components/CommandLineComponent.vue';

export default {
  components: {
    ServerListComponent,
    CommandLineComponent
  },
  setup () {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    const text = ref('')

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }




    return {
      leftDrawerOpen,
      rightDrawerOpen,
      text,
      toggleLeftDrawer,
      toggleRightDrawer
    }
  }
}
</script>

