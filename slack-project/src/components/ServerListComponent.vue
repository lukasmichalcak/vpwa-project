<template>
  <div class="server-list-container">
    <q-list bordered class="rounded-borders">
      <q-item
        v-for="channel in channels"
        :key="channel.id"
        clickable
        @click="selectChannel(channel.id)"
        :class="{ 'selected-channel': selectedChannel === channel.id }"
      >
        <q-item-section avatar>
          <q-icon :name="channel.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ channel.label }}</q-item-label>
          <q-item-label caption>{{ channel.caption }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="more_vert" flat round dense>
            <q-popup-proxy>
              <q-btn
                color="negative"
                :label="channel.buttonLabel"
                @click="removeChannel(channel.id)"
              />
            </q-popup-proxy>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn
      class="create-server-btn"
      color="primary"
      label="Create New Server"
      @click="showCreateServerDialog = true"
    />
    <q-dialog v-model="showCreateServerDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Create New Server</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="newServerName"
            label="Channel Name"
            filled
            :error="nameError"
            :error-message="nameErrorMessage"
          />
          <q-select
            v-model="newServerType"
            :options="channelTypes"
            label="Channel Type"
            filled
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            @click="showCreateServerDialog = false"
          />
          <q-btn
            color="primary"
            label="Create"
            @click="createNewServer"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const channels = ref([])
    const selectedChannel = ref(null)
    const showCreateServerDialog = ref(false)
    const newServerName = ref('')
    const newServerType = ref('Public')
    const channelTypes = ref(['Public', 'Private'])
    const nameError = ref(false)
    const nameErrorMessage = ref('')
    const numberOfEntries = 10


    console.log('Component created!')



    for (let i = 1; i <= numberOfEntries; i++) {
      channels.value.push({
        id: i,
        icon: 'public',
        label: `Channel${i}`,
        caption: i % 2 === 0 ? 'Private' : 'Public',
        buttonLabel: i % 3 === 0 ? 'Zrušiť kanál' : 'Opustiť kanál'
      })
    }

    const selectChannel = (id) => {
      selectedChannel.value = id
    }

    const removeChannel = (id) => {
      channels.value = channels.value.filter(channel => channel.id !== id)
      if (selectedChannel.value === id) {
        selectedChannel.value = null
      }
    }

    const createNewServer = () => {
      if (newServerName.value.trim() === '') {
        nameError.value = true
        nameErrorMessage.value = 'Channel name is required'
        return
      }

      const isNameUsed = channels.value.some(channel => channel.label === newServerName.value)
      if (isNameUsed) {
        nameError.value = true
        nameErrorMessage.value = 'Channel name is already used'
        return
      }

      const newChannel = {
        id: channels.value.length + 1,
        icon: 'public',
        label: newServerName.value,
        caption: newServerType.value,
        buttonLabel:'Zrušiť kanál'
      }

      channels.value.unshift(newChannel)
      newServerName.value = ''
      newServerType.value = 'Public'
      nameError.value = false
      nameErrorMessage.value = ''
      showCreateServerDialog.value = false

    }

    return {
      channels,
      selectedChannel,
      showCreateServerDialog,
      newServerName,
      newServerType,
      channelTypes,
      nameError,
      nameErrorMessage,
      selectChannel,
      removeChannel,
      createNewServer
    }
  }
}
</script>

<style scoped>
.server-list-container {
  position: relative;
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 60px;
}

.create-server-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
.rounded-borders {
  border-radius: 8px;
}

.selected-channel {
  background-color: #e0f7fa;
}
</style>