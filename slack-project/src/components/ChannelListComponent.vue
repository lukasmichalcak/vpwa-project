<template>
  <q-list bordered class="rounded-borders">
    <div v-if="channels.length === 0" class="text-h6 text-center">
      No channels found
    </div>
    <q-item
      v-for="channel in channels"
      :key="channel.id"
      clickable
      @click="selectChannel(channel.id)"
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
                  @click="deleteChannel(channel.id, 'delete')"
                />
                <q-btn
                  v-else
                  color="negative"
                  label="Leave"
                  @click="deleteChannel(channel.id, 'leave')"
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
        <q-list bordered>
          <q-item v-for="user in genericUsers" :key="user.username">
            <q-item-section>
              <q-item-label>{{ user.username }}</q-item-label>
              <q-item-label caption>Votes to Kick: 0/3</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                color="negative"
                label="Kick"
                @click="kickUser(user.username)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" @click="showKickPopup = false" />
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
import { Transmit } from '@adonisjs/transmit-client';

export default {
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
    async loadChannels() {
      try {
        await this.fetchChannels();
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    },

    selectChannel(id) {
      this.selectedChannel = id;
    },

    async createNewServer() {
      if (this.newChannelName.trim() === '') {
        this.nameError = true;
        this.nameErrorMessage = 'Channel name is required';
        return;
      }

      try {
        await this.createChannel({
          name: this.newChannelName,
          admin_id: this.userID,
          channel_type: this.newChannelType,
        });

        await this.fetchChannels();

        this.newChannelName = '';
        this.newChannelType = 'public';
        this.nameError = false;
        this.nameErrorMessage = '';
        this.showCreateChannelDialog = false;
      } catch (error) {
        console.error('Error creating new channel:', error);
        this.nameError = true;
        this.nameErrorMessage = 'Failed to create channel';
      }
    },

    async deleteChannel(id, action) {
      console.log('removeChannel', id);
      await this.removeChannel({ id, userID: this.userID, action });
      console.log('removedChannel', id);
      await this.fetchChannels();
    },

    async testTransmit() {
      if (this.subscription) {
        console.log('Already subscribed to global channel');
        await this.subscription.delete();
        return;
      }
      const transmit = new Transmit({
        baseUrl: 'http://localhost:3333',
      });
      const subscription = transmit.subscription('global');
      await subscription.create();
      // this.subscription = subscription;
      subscription.onMessage((data) => {
        console.log('Received message:', data.message);
      });
    },
  },
  created() {
    this.loadChannels();
    this.testTransmit();
  },
};

// import { mapGetters } from 'vuex';

// export default {
//   data() {
//     return {
//       channels: [],
//       hiddenChannels: [],
//       selectedChannel: null,
//       showCreateChannelDialog: false,
//       showInvitePopup: false,
//       showKickPopup: false,
//       newChannelName: '',
//       newChannelType: 'Public',
//       channelTypes: ['Public', 'Private'],
//       nameError: false,
//       nameErrorMessage: '',
//     };
//   },
//   computed: {
//     ...mapGetters('module-example', ['commandJoin']),
//     ...mapGetters('module-example', ['commandQuit']),
//     ...mapGetters('module-example', ['commandCancel']),
//     ...mapGetters('module-example', ['genericUsers']),
//   },
//   watch: {
//     commandJoin(newVal) {
//       if (newVal && newVal.command && newVal.command.channelName) {
//         const channelName = newVal.command.channelName;

//         const hiddenChannelIndex = this.hiddenChannels.findIndex(
//           (channel) =>
//             channel.label === channelName && channel.caption === 'Public'
//         );
//         if (hiddenChannelIndex !== -1) {
//           console.log(
//             'Hidden channel found:',
//             this.hiddenChannels[hiddenChannelIndex]
//           );
//           const hiddenChannel = this.hiddenChannels.splice(
//             hiddenChannelIndex,
//             1
//           )[0];
//           this.channels.unshift(hiddenChannel);
//           return;
//         }

//         const isNameUsed =
//           this.channels.some((channel) => channel.label === channelName) ||
//           this.hiddenChannels.some((channel) => channel.label === channelName);

//         if (isNameUsed) {
//           this.nameError = true;
//           this.nameErrorMessage = 'Channel name is already used';
//           return;
//         }

//         this.channels.unshift({
//           id: this.channels.length + 1,
//           icon: newVal.command.isPrivate ? 'lock' : 'public',
//           label: newVal.command.channelName,
//           caption: newVal.command.isPrivate ? 'Private' : 'Public',
//           buttonLabel: 'Delete Channel',
//           isnew: true,
//         });
//         console.log('Updated channels:', this.channels);
//       }
//     },
//     commandQuit(newVal) {
//       if (newVal) {
//         const channelName = newVal.command;
//         const channelIndex = this.channels.findIndex(
//           (channel) => channel.label === channelName
//         );
//         if (channelIndex !== -1) {
//           console.log('Channel found:', this.channels[channelIndex]);
//           const channel = this.channels.splice(channelIndex, 1)[0];
//           this.hiddenChannels.unshift(channel);
//           return;
//         }
//       }
//     },
//     commandCancel(newVal) {
//       if (newVal) {
//         const channelName = newVal.command;
//         const channelIndex = this.channels.findIndex(
//           (channel) => channel.label === channelName
//         );
//         if (channelIndex !== -1) {
//           console.log('Channel found:', this.channels[channelIndex]);
//           const channel = this.channels.splice(channelIndex, 1)[0];
//           this.hiddenChannels.unshift(channel);
//           return;
//         }
//       }
//     },
//   },
//   created() {
//     for (let i = 1; i <= 100; i++) {
//       this.channels.push({
//         id: i,
//         icon: i % 2 === 0 ? 'lock' : 'public',
//         label: `Channel${i}`,
//         caption: i % 2 === 0 ? 'Private' : 'Public',
//         buttonLabel: i % 3 === 0 ? 'Delete Channel' : 'Leave Channel',
//         isnew: false,
//         newMessage: i % 5 === 0 ? true : false,
//       });
//     }
//     for (let k = 1; k <= 10; k++) {
//       this.hiddenChannels.push({
//         id: k + 1000,
//         icon: k % 2 === 0 ? 'lock' : 'public',
//         label: `Hidden Channel${k}`,
//         caption: k % 2 === 0 ? 'Private' : 'Public',
//         buttonLabel: 'Leave Channel',
//         isnew: true,
//         newMessage: k % 3 === 0 ? true : false,
//       });
//     }
//   },
//   methods: {
//     selectChannel(id) {
//       this.selectedChannel = id;
//     },
//     removeChannel(id) {
//       this.channels = this.channels.filter((channel) => channel.id !== id);
//       if (this.selectedChannel === id) {
//         this.selectedChannel = null;
//       }
//     },
//     createNewServer() {
//       if (this.newChannelName.trim() === '') {
//         this.nameError = true;
//         this.nameErrorMessage = 'Channel name is required';
//         return;
//       }

//       const isNameUsed = this.channels.some(
//         (channel) => channel.label === this.newChannelName
//       );
//       if (isNameUsed) {
//         this.nameError = true;
//         this.nameErrorMessage = 'Channel name is already used';
//         return;
//       }

//       const newChannel = {
//         id: this.channels.length + 1,
//         icon: this.newChannelType === 'Public' ? 'public' : 'lock',
//         label: this.newChannelName,
//         caption: this.newChannelType,
//         buttonLabel: 'Zrušiť kanál',
//         isnew: true,
//       };

//       this.channels.unshift(newChannel);
//       this.newChannelName = '';
//       this.newChannelType = 'Public';
//       this.nameError = false;
//       this.nameErrorMessage = '';
//       this.showCreateChannelDialog = false;
//     },
//   },
// };
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
