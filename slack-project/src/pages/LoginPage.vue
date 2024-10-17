<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <q-icon name="question_answer" />
          </q-avatar>
          SKRUPULUS
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-form class="flex flex-center" style="min-height: 90vh">
      <div
        class="q-gutter-md"
        style="max-width: 300px; width: 100%"
        @submit.prevent="onSubmit"
      >
        <div class="text-center" style="font-size: 40px; font-weight: bold">
          Login
        </div>

        <q-separator color="dark" size="8px" spaced />

        <q-input
          class="q-mb-sm"
          standout="bg-primary text-white"
          v-model="username"
          label="Username"
        />

        <q-input
          class="q-mb-sm"
          :type="visiblePassword ? 'text' : 'password'"
          standout="bg-primary text-white"
          v-model="password"
          label="Password"
        >
          <template v-slot:append>
            <q-icon
              :name="visiblePassword ? 'visibility' : 'visibility_off'"
              @click="togglePasswordVisibility"
              class="cursor-pointer"
            />
          </template>
        </q-input>

        <q-banner v-if="loginError" color="negative">{{ loginError }}</q-banner>

        <div class="row items-center justify-between q-mt-md no-wrap">
          <span>
            If you are not one of us yet, here you can
            <a href="/#/register" class="text-primary">register</a>.
          </span>
          <q-btn
            label="Login"
            class="bg-primary text-white"
            @click="onSubmit"
          />
        </div>
      </div>
    </q-form>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      username: '',
      password: '',
      visiblePassword: false,
    };
  },

  computed: {
    ...mapGetters('module-example', ['loginError', 'genericUsers']),
  },

  mounted() {
    if (!this.genericUsers || this.genericUsers.length === 0) {
      this.generateUsers();
    }
  },

  methods: {
    ...mapActions('module-example', ['login', 'generateUsers']),

    togglePasswordVisibility() {
      this.visiblePassword = !this.visiblePassword;
    },

    async onSubmit() {
      try {
        await this.login({ username: this.username, password: this.password });
        this.$router.push('/main');
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
  },
};
</script>
