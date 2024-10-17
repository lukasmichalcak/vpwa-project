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

import { mapActions } from 'vuex';


export default {
  props: {
    rightDrawerOpen: Boolean
  },
  methods: {
    ...mapActions('module-example', ['join']),
    
    handleEnter() {
      if (text.value === '/list'){
          emit('toggleRightDrawer')
          text.value = ''
      }
      if (text.value.startsWith('/join')){
        console.log(text.value)
        const parts = text.value.split(' ')
        const channelName = parts[1]
        const isPrivate = parts[2] === '[private]'
        this.join({ channelName, isPrivate })
        text.value = ''
      }
    }

    
  },
}
</script>
<style lang="scss">
.custom-input-text {
color: white;
}
</style>