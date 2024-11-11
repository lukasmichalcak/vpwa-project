<template>
  <div class="q-pa-md q-gutter-sm">
    <q-avatar>
      <img src="../assets/images/verifier_logo.png" alt="Verifier logo" />
      <q-menu>
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Settings</div>
            <q-radio v-model="status" val="online" label="Online" />
            <q-radio v-model="status" val="dnd" label="DND" />
            <q-radio v-model="status" val="offline" label="Offline" />
          </div>

          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="42px">
              <img
                src="../assets/images/verifier_logo.png"
                alt="Verifier logo"
              />
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">{{ username }}</div>

            <q-btn
              color="negative"
              label="Logout"
              push
              size="sm"
              @click="logoutUser"
            />
          </div>
        </div>
      </q-menu>
    </q-avatar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      status: 'online',
    };
  },
  computed: {
    ...mapGetters('module-example', ['username']),
  },
  methods: {
    ...mapActions('module-example', ['logout']),
    async logoutUser() {
      try {
        await this.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
  },
};
</script>
