<template>
  <q-list bordered class="rounded-borders">
    <div v-if="channels.length === 0" class="text-h6 text-center">
      No channels found
    </div>
    <q-item
      v-for="channel in channels"
      :key="channel.id"
      clickable
      @click="selectNewChannel(channel.id)"
      :class="{ 'selected-channel': selectedChannel === channel.id }"
    >
      <q-item-section avatar>
        <q-icon :name="channel.channelType === 'public' ? 'public' : 'lock'" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ channel.name }}</q-item-label>
        <q-item-label caption>{{ channel.channelType }}</q-item-label>
        <q-badge
          v-if="channel.isnew"
          color="green"
          class="q-ml-sm badge-width"
          label="New Channel"
        />
        <q-badge
          v-if="channel.newMessage"
          color="primary"
          class="q-ml-sm badge-width"
          label="New Message"
        />
      </q-item-section>
      <q-item-section side>
        <q-btn icon="more_vert" flat round dense>
          <q-popup-proxy anchor="top right" self="top left">
            <q-card>
              <q-card-section>
                <q-btn
                  color="positive"
                  label="Invite"
                  @click="showInvitePopup = true"
                />
                <q-btn
                  color="negative"
                  label="Kick"
                  @click="showKickPopup = true"
                />
                <q-btn
                  v-if="userID === channel.adminId"
                  color="negative"
                  label="Delete"
                  @click="deleteChannel"
                />
                <q-btn
                  v-else
                  color="negative"
                  label="Leave"
                  @click="deleteChannel"
                />
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </q-btn>
      </q-item-section>
    </q-item>
  </q-list>

  <q-btn
    class="create-channel-btn"
    color="primary"
    label="Create New Channel"
    @click="showCreateChannelDialog = true"
  />

  <q-dialog v-model="showInvitePopup">
    <q-card>
      <q-card-section>
        <div class="text-h6">Invite User</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="inviteUsername" label="Enter Username" filled />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="showInvitePopup = false" />
        <q-btn color="primary" label="Invite" @click="inviteUser" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showKickPopup">
    <q-card>
      <q-card-section>
        <div class="text-h6">Kick Users</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="kickUsername" label="Enter Username" filled />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="showKickPopup = false" />
        <q-btn color="primary" label="Kick" @click="kickUser" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showCreateChannelDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Create New Channel</div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="newChannelName"
          label="Channel Name"
          filled
          :error="nameError"
          :error-message="nameErrorMessage"
        />
        <q-select
          v-model="newChannelType"
          :options="channelTypes"
          label="Channel Type"
          filled
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="showCreateChannelDialog = false" />
        <q-btn color="primary" label="Create" @click="createNewServer" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  emits: [
    'cancel-command',
    'join-command',
    'join-channel',
    'invite-command',
    'kick-command',
  ],
  props: ['setSelectedChannelEvent'],
  data() {
    return {
      selectedChannel: null,
      showCreateChannelDialog: false,
      showInvitePopup: false,
      showKickPopup: false,
      newChannelName: '',
      newChannelType: 'public',
      channelTypes: ['public', 'private'],
      nameError: false,
      nameErrorMessage: '',
      transmit: null,
      subscription: null,
      inviteUsername: null,
      kickUsername: null,
    };
  },

  computed: {
    ...mapGetters('module-example', ['channels']),
    ...mapGetters('module-example', ['userID']),
  },
  methods: {
    ...mapActions('module-example', ['fetchChannels']),
    ...mapActions('module-example', ['createChannel']),
    ...mapActions('module-example', ['removeChannel']),
    ...mapActions('module-example', ['fetchUserChannels']),
    ...mapActions('module-example', ['setSelectedChannel']),
    async loadChannels() {
      try {
        await this.fetchChannels();
        if (this.channels.length > 0) {
          this.selectedChannel = this.channels[0].id;
          await this.setSelectedChannel(this.selectedChannel);
        }
        await this.fetchUserChannels();

        this.joinChannels();
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    },

    selectNewChannel(id) {
      this.selectedChannel = id;
      this.setSelectedChannel(this.selectedChannel);
    },

    async createNewServer() {
      if (this.newChannelName.trim() === '') {
        this.nameError = true;
        this.nameErrorMessage = 'Channel name is required';
        return;
      }
      const channelName = this.newChannelName;
      const channelType = this.newChannelType;
      this.$emit('join-command', channelName, channelType);
    },

    async inviteUser() {
      const invitee = this.inviteUsername;
      this.$emit('invite-command', invitee);
    },

    async kickUser() {
      const kickee = this.kickUsername;
      this.$emit('kick-command', kickee);
    },

    async deleteChannel() {
      this.$emit('cancel-command');
    },

    joinChannels() {
      this.channels.forEach((channel) => {
        this.$emit('join-channel', channel.id);
      });
    },
  },

  watch: {
    setSelectedChannelEvent: {
      handler(newVal) {
        if (newVal && newVal.payload && newVal.payload.key) {
          this.selectNewChannel(newVal.payload.key);
        }
      },
    },
  },
  created() {
    this.loadChannels();
  },
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}

.selected-channel {
  background-color: #e0f7fa;
}
.server-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.q-list {
  overflow-y: auto;
  padding-bottom: 60px;
}

.create-channel-btn {
  position: fixed;
  bottom: 0px;
  width: 100%;
}

.badge-width {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60%;
}
</style>
