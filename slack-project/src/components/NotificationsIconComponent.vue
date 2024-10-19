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
          <q-item
            v-for="notification in notifications"
            :key="notification.id"
            clickable
            v-ripple
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
                icon="close"
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
    };
  },

  created() {
    const numberOfNotifications = 10;

    for (let i = 1; i < numberOfNotifications; i++) {
      this.notifications.push({
        id: i,
        channelName: `Channel${numberOfNotifications - i}`,
        senderUsername: `User${numberOfNotifications - i}`,
        messageText: `This is the beggining of message${
          numberOfNotifications - i
        }...`,
      });
    }
  },

  computed: {
    notificationsCount(): string {
      return this.notifications.length > 99
        ? '99+'
        : String(this.notifications.length);
    },
  },

  methods: {
    removeNotification(id: number) {
      this.notifications = this.notifications.filter(
        (notification) => notification.id !== id
      );
    },
  },
});
</script>
