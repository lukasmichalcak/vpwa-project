<template>
  <q-input
  rounded
    filled
    v-model="text"
    label="Type"
    label-color="white"
    input-class="custom-input-text"
    @keyup.enter="handleEnter"
    @update:model-value="debouncedTyping"
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
import { mapActions, mapGetters } from 'vuex';
import { debounce } from 'lodash';

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
    ...mapActions('module-example', ['storeMessage']),
    handleEnter() {
      if (this.text.trim() === '') return;
      this.$emit('send-message', {
        channelId: this.selectedChannel,
        text: this.text,
        author: {
          username: this.username,
          id: this.userID,
        },
      });

      this.typing('');

      this.storeMessage({
        channelId: this.selectedChannel,
        text: this.text,
        username: this.username,
      });

      this.text = '';
    },
    typing(value) {
      this.$emit('typing', {
        channelId: this.selectedChannel,
        text: value,
        username: this.username,
      });
    },
    debouncedTyping: debounce(function (value) {
      this.typing(value);
    }, 200),
  },
};
</script>

<style lang="scss">
.custom-input-text {
 color: white; }
</style>
