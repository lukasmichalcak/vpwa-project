<template>
  <q-input
  rounded
    filled
    v-model="text"
    label="Type"
    label-color="white"
    input-class="custom-input-text"
    @keyup.enter="handleEnter"
  >
    <template v-slot:append>
      <q-btn flat
        round
        color="white"
        icon="send"
        @click="handleEnter" />
    </template>
  </q-input>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      text: '',
      socket: null,
      currentChannel: null,
    };
  },

  computed: {
    ...mapGetters('module-example', ['selectedChannel']),
    ...mapGetters('module-example', ['username']),
  },


  methods: {
    handleEnter() {
      if (this.text.trim() === '') return;
      this.$emit('send-message', {
        channelId: this.selectedChannel,
        message: this.text,
        name: this.username,
      });

      this.text = '';
    },
  },
};
</script>

<style lang="scss">
.custom-input-text {
 color: white; }
</style>
