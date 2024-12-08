<template>
  <q-list>
    <q-item v-for="user in users" :key="user.username" clickable v-ripple>
      <q-item-section avatar>
        <q-icon name="account_circle" />
      </q-item-section>
      <q-item-section>
        <div>{{ user.username }}</div>
        <div class="text-caption">Role: {{ user.role }}</div>
        <div class="text-caption">State: {{ user.state }}</div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
  name: 'UserListComponent',
  data() {
    return {};
  },

  computed: {
    ...mapGetters('module-example', ['users', 'selectedChannel']),
  },

  methods: {
    ...mapActions('module-example', ['fetchChannelUsers']),
  },

  watch: {
    selectedChannel(newChannel) {
      this.fetchChannelUsers(newChannel);
    },
  },
});
</script>

<style scoped>
.text-subtitle2 {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
}
.text-caption {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.54);
}
</style>
