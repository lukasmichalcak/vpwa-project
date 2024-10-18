<template>
  <q-list>
    <q-item v-for="user in users" :key="user.nickname" clickable v-ripple>
      <q-item-section avatar>
        <q-icon name="account_circle" />
      </q-item-section>
      <q-item-section>
        <div>{{ user.nickname }}</div>
        <div class="text-caption">Role: {{ user.role }}</div>

      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

interface User {
  name: string;
  lastName: string;
  nickname: string;
  email: string;
  role: 'owner' | 'member';
  votes: number;
}

export default defineComponent({
  name: 'UserListComponent',
  setup() {
    const users = ref<User[]>([]);
    const numberOfUsers = 10;

    for (let i = 1; i <= numberOfUsers; i++) {
      users.value.push({
        name: `Name${i}`,
        lastName: `LastName${i}`,
        nickname: `User${i}`,
        email: `user${i}@example.com`,
        role: i === 1 ? 'owner' : 'member',
        votes: Math.floor(Math.random() * 3),
      });
    }

    return { users };
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