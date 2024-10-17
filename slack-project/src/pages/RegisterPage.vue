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
          Register
        </div>

        <q-separator color="dark" size="8px" spaced />

        <q-input
          class="q-mb-sm"
          standout="bg-primary text-white"
          v-model="firstName"
          label="First name"
        />

        <q-input
          class="q-mb-sm"
          standout="bg-primary text-white"
          v-model="lastName"
          label="Last name"
        />

        <q-input
          class="q-mb-sm"
          standout="bg-primary text-white"
          v-model="username"
          label="Username"
        />

        <q-input
          class="q-mb-sm"
          standout="bg-primary text-white"
          v-model="email"
          label="Email"
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

        <q-banner v-if="registrationError" color="negative">{{
          registrationError
        }}</q-banner>

        <div class="row items-center justify-end q-mt-md no-wrap">
          <q-btn
            label="Register"
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
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      visiblePassword: false,
    };
  },

  computed: {
    ...mapGetters('module-example', ['registrationError']),
  },

  methods: {
    ...mapActions('module-example', ['register']),

    togglePasswordVisibility() {
      this.visiblePassword = !this.visiblePassword;
    },
    async onSubmit() {
      this.register({
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        email: this.email,
        password: this.password,
      })
        .then(() => {
          this.$router.push('/main');
        })
        .catch((error) => {
          console.error('Registration failed:', error);
        });
    },
  },
};
</script>
