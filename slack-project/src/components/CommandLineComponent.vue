<template>
  <q-input
    rounded
    filled
    v-model="text"
    label="Type"
    label-color="white"
    input-class="custom-input-text"
    @keyup.enter="handleEnter"
  />
</template>

<script lang="ts">
import { mapActions } from 'vuex';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      text: '',
    };
  },
  props: {
    rightDrawerOpen: Boolean,
  },
  methods: {
    ...mapActions('module-example', ['join']),

    handleEnter() {
      if (this.text === '/list') {
        this.$emit('toggleRightDrawer');
      }
      if (this.text.startsWith('/join')) {
        const parts = this.text.split(' ');
        let isPrivate = false;
        if (parts[parts.length - 1] === '[private]') {
          isPrivate = true;
          parts.pop();
        }
        const channelName = parts.slice(1).join(' ');
        const commandJoin = { channelName, isPrivate };
        this.join({ command: commandJoin });
      }
      this.text = '';
    },
  },
});
</script>

<style lang="scss">
.custom-input-text {
  color: white;
}
</style>
