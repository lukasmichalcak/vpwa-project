<template>
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
        <q-btn flat label="Cancel" @click="showCreateServerDialog = false" />
        <q-btn color="primary" label="Create" @click="createNewServer" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      channels: [],
      hiddenChannels: [],
      selectedChannel: null,
      showCreateServerDialog: false,
      newServerName: '',
      newServerType: 'Public',
      channelTypes: ['Public', 'Private'],
      nameError: false,
      nameErrorMessage: '',
    };
  },
  computed: {
    ...mapGetters('module-example', ['commandJoin']), // Map Vuex getter
    ...mapGetters('module-example', ['commandQuit']), // Map Vuex getter
    ...mapGetters('module-example', ['commandCancel']), // Map Vuex getter
  },
  watch: {
    commandJoin(newVal) {
      // Access the nested command object
      if (newVal && newVal.command && newVal.command.channelName) {

        const channelName = newVal.command.channelName;


        const hiddenChannelIndex = this.hiddenChannels.findIndex(
          (channel) => channel.label === channelName && channel.caption === 'Public'
        );
        if (hiddenChannelIndex !== -1) {
          console.log('Hidden channel found:', this.hiddenChannels[hiddenChannelIndex]);
          const hiddenChannel = this.hiddenChannels.splice(hiddenChannelIndex, 1)[0];
          this.channels.unshift(hiddenChannel);
          return;
        }

        const isNameUsed = this.channels.some(
          (channel) => channel.label === channelName
        ) || this.hiddenChannels.some(
          (channel) => channel.label === channelName
        );

        if (isNameUsed) {
          this.nameError = true;
          this.nameErrorMessage = 'Channel name is already used';
          return;
        }

        this.channels.unshift({
          id: this.channels.length + 1,
          icon: newVal.command.isPrivate ? 'lock' : 'public',
          label: newVal.command.channelName,
          caption: newVal.command.isPrivate ? 'Private' : 'Public',
          buttonLabel: 'Zrušiť kanál',
        });
        console.log('Updated channels:', this.channels);
      }
    },
    commandQuit(newVal) {
      if (newVal) {
        const channelName = newVal.command;
        const channelIndex = this.channels.findIndex(
          (channel) => channel.label === channelName
        );
        if (channelIndex !== -1) {
          console.log('Channel found:', this.channels[channelIndex]);
          const channel = this.channels.splice(channelIndex, 1)[0];
          this.hiddenChannels.unshift(channel);
          return;
        }
      }
    },
    commandCancel(newVal) {
      if (newVal) {
        const channelName = newVal.command;
        const channelIndex = this.channels.findIndex(
          (channel) => channel.label === channelName
        );
        if (channelIndex !== -1) {
          console.log('Channel found:', this.channels[channelIndex]);
          const channel = this.channels.splice(channelIndex, 1)[0];
          this.hiddenChannels.unshift(channel);
          return;
        }
      }
    },
  },
  created() {
    // Populate initial channels list
    for (let i = 1; i <= 10; i++) {
      this.channels.push({
        id: i,
        icon: i % 2 === 0 ? 'lock' : 'public',
        label: `Channel${i}`,
        caption: i % 2 === 0 ? 'Private' : 'Public',
        buttonLabel: i % 3 === 0 ? 'Zrušiť kanál' : 'Opustiť kanál',
      });
    }
    for (let k = 1; k <= 10; k++) {
      this.hiddenChannels.push({
        id: k+1000,
        icon: k % 2 === 0 ? 'lock' : 'public',
        label: `Hidden Channel${k}`,
        caption: k % 2 === 0 ? 'Private' : 'Public',
        buttonLabel: 'Opustiť kanál',
      });
    }
  },
  methods: {
    selectChannel(id) {
      this.selectedChannel = id;
    },
    removeChannel(id) {
      this.channels = this.channels.filter((channel) => channel.id !== id);
      if (this.selectedChannel === id) {
        this.selectedChannel = null;
      }
    },
    createNewServer() {
      if (this.newServerName.trim() === '') {
        this.nameError = true;
        this.nameErrorMessage = 'Channel name is required';
        return;
      }

      const isNameUsed = this.channels.some(
        (channel) => channel.label === this.newServerName
      );
      if (isNameUsed) {
        this.nameError = true;
        this.nameErrorMessage = 'Channel name is already used';
        return;
      }

      const newChannel = {
        id: this.channels.length + 1,
        icon: 'public',
        label: this.newServerName,
        caption: this.newServerType,
        buttonLabel: 'Zrušiť kanál',
      };

      this.channels.unshift(newChannel);
      this.newServerName = '';
      this.newServerType = 'Public';
      this.nameError = false;
      this.nameErrorMessage = '';
      this.showCreateServerDialog = false;
    },
  },
};
</script>

<style scoped>
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
