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
  import { ref } from 'vue'
  
  export default {
    props: {
      rightDrawerOpen: Boolean
    },
    setup(props, { emit }) {
      const text = ref('')
  
      const handleEnter = () => {
        if (text.value === '/list'){
            emit('toggleRightDrawer')
            text.value = ''
        }
        
      }
  
      //watch(text, () => {
      //  if (text.value === '/list') {
      //    emit('toggleRightDrawer')
      //  }
      //})
  
      return {
        text,
        handleEnter
      }
    }
  }
  </script>
<style lang="scss">
.custom-input-text {
  color: white;
}
</style>