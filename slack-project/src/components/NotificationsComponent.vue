<template>
  <q-avatar>
    <q-btn round icon="notifications" />
    <q-badge
      color="accent"
      text-color="white"
      floating
      rounded
      :label="notificationsCount"
      v-if="notifications.length > 0"
    />
    <q-menu>
      <div class="row no-wrap q-pa-md">
        <q-list>
          <q-radio
            v-model="notificationReceptionStatus"
            val="all"
            label="All"
          />
          <q-radio
            v-model="notificationReceptionStatus"
            val="tag-only"
            label="Tag-only"
          />
          <q-item
            v-for="notification in notifications"
            :key="notification.id"
            clickable
            v-ripple
            :class="{
              'bg-warning': notification.id % 3 == 0,
              'bg-white': notification.id % 3 !== 0,
            }"
          >
            <q-item-section avatar>
              <q-icon name="notifications" />
            </q-item-section>
            <q-item-section>
              <div>In: {{ notification.channelName }}</div>
              <div>by {{ notification.senderUsername }}</div>
              <div class="text-caption">{{ notification.messageText }}</div>
            </q-item-section>
            <q-item-section side>
              <q-btn
                color="negative"
                icon="delete"
                flat
                round
                dense
                @click="removeNotification(notification.id)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-menu>
  </q-avatar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

interface Notification {
  id: number;
  channelName: string;
  senderUsername: string;
  messageText: string;
}

export default defineComponent({
  data() {
    return {
      notifications: <Notification[]>[],
      notificationReceptionStatus: 'all',
    };
  },

  computed: {
    ...mapGetters('module-example', ['channels']),
    ...mapGetters('module-example', ['newMessage']),
    ...mapGetters('module-example', ['username']),

    notificationsCount(): string {
      return this.notifications.length > 99
        ? '99+'
        : String(this.notifications.length);
    },
  },

  watch: {
    newMessage(data) {
      if (data.author.username !== this.username) {
        this.notifications.push({
          id: this.notifications.length + 1,
          channelName: this.getChannelName(data.channelId),
          senderUsername: data.author.username,
          messageText: data.text.length > 10 ? data.text.substring(0, 10) + '...': data.text,
        });
      }
    },
  },

  methods: {
    removeNotification(id: number) {
      this.notifications = this.notifications.filter(
        (notification) => notification.id !== id
      );
    },
    
    getChannelName(channelId: number): string {
      const channel = this.channels.find((c: { id: number; name: string }) => c.id === channelId);
      return channel ? channel.name : `Channel ${channelId}`;
    },
  },
});
</script>
