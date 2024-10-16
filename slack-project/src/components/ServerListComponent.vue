<template>
  <q-list bordered class="rounded-borders">
    <q-expansion-item
      v-for="channel in channels"
      :key="channel.id"
      expand-icon-toggle
      expand-separator
      clickable
      :icon="channel.icon"
      :label="channel.label"
      :caption="channel.caption"
    >
      <q-card>
        <q-card-section>
          <q-btn
            color="negative"
            :label="channel.buttonLabel"
            @click="removeChannel(channel.id)"
          />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const channels = ref([])
    const numberOfEntries = 100

    for (let i = 1; i <= numberOfEntries; i++) {
      channels.value.push({
        id: i,
        icon: 'public',
        label: `Channel${i}`,
        caption: i % 2 === 0 ? 'Private' : 'Public',
        buttonLabel: i % 2 === 0 ? 'Zrušiť kanál' : 'Opustiť kanál'
      })
    }

    const removeChannel = (id) => {
      channels.value = channels.value.filter(channel => channel.id !== id)
    }

    return {
      channels,
      removeChannel
    }
  }
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>