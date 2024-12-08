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
      <q-btn flat round color="white" icon="send" @click="handleEnter" />
    </template>
  </q-input>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { debounce } from 'lodash';

export default {
  emits: [
    'join-command',
    'quit-command',
    'cancel-command',
    'invite-command',
    'revoke-command',
    'kick-command',
    'typing',
    'send-message',
  ],
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
      // -------------------------------------- handle commands TODO API might change for some
      if (this.text.trim() === '/list') {
        this.$emit('toggleRightDrawer');
      } else if (this.text.startsWith('/join')) {
        const parts = this.text.split(' ');
        let isPrivate = false;
        if (parts[parts.length - 1] === '[private]') {
          isPrivate = true;
          parts.pop();
        }
        const channelName = parts.slice(1).join(' ');
        const channelType = isPrivate ? 'private' : 'public';
        this.$emit('join-command', channelName, channelType);
      } else if (this.text.trim() === '/quit') {
        this.$emit('quit-command');
      } else if (this.text.trim() === '/cancel') {
        this.$emit('cancel-command');
      } else if (this.text.startsWith('/invite')) {
        const parts = this.text.split(' ');
        const invitee = parts[1];
        this.$emit('invite-command', invitee);
      } else if (this.text.startsWith('/revoke')) {
        const parts = this.text.split(' ');
        const channelName = parts[1];
        this.$emit('revoke-command', channelName);
      } else if (this.text.startsWith('/kick')) {
        const parts = this.text.split(' ');
        const kickee = parts[1];
        this.$emit('kick-command', kickee);
      }
      // -------------------------------------- handle commands
      else {
        this.$emit('send-message', {
          channelId: this.selectedChannel,
          text: this.text,
          author: {
            username: this.username,
            id: this.userID,
          },
        });

        this.storeMessage({
          channelId: this.selectedChannel,
          text: this.text,
          username: this.username,
        });
      }

      this.typing('');

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
  color: white;
}
</style>
