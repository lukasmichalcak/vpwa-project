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

<script>
import { ref } from 'vue';
//import { useStore } from 'vuex';

export default {
  props: {
    rightDrawerOpen: Boolean,
  },
  setup(props, { emit }) {
    const text = ref('');
    //const store = useStore();

    const handleEnter = () => {
      if (text.value === '/list') {
        emit('toggleRightDrawer');
        text.value = '';
      }
      if (text.value.startsWith('/join')) {
        console.log(text.value);
        const parts = text.value.split(' ');
        const channelName = parts[1];
        const isPrivate = parts[2] === '[private]';
        emit('createNewChannel', { channelName, isPrivate });
        text.value = '';
      }
      //store.dispatch('updateGlobalVariable', text.value);
    };

    //watch(text, () => {
    //  if (text.value === '/list') {
    //    emit('toggleRightDrawer')
    //  }
    //})

    return {
      text,
      handleEnter,
    };
  },
};
</script>
<style lang="scss">
.custom-input-text {
  color: white;
}
</style>
