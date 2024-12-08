<template>
  <div class="q-pa-md">
    <div ref="scrollContainer" class="scroll-container" @scroll="handleScroll">
      <div
          v-for="(message, index) in messages.slice(0,limit).reverse()"
          :key="index"
          :class="
            message.author.username === username
              ? 'row justify-end'
              : 'row justify-start'
          "
          class="caption q-py-sm"
        >
          <div
            :class="
              message.author.username === username ? 'self-end' : 'self-start'
            "
            style="max-width: 75%"
          >
            <q-chat-message
              :name="message.author.username"
              :avatar="verifierLogo"
              :text="[message.text]"
              :sent="message.author.username === username"
              :bg-color="getMessageBgColor(message)"
              text-color="white"
            />
          </div>
        </div>
        <div
          v-for="(message, index) in unfinishedMessages"
          :key="index"
          :class="message.sent ? 'row justify-end' : 'row justify-start'"
          class="caption q-py-sm"
        >
          <div
            :class="message.sent ? 'self-end' : 'self-start'"
            style="max-width: 75%"
          >
            <q-chat-message
              :name="message.author.username"
              :avatar="message.avatar"
              text-color="white"
              :bg-color="getMessageBgColor(message)"
              @click="showMessage = true"
            >
              <q-spinner-dots size="2rem" />
            </q-chat-message>

            <q-popup-proxy
              v-model:showing="showMessage"
              transition-show="scale"
              transition-hide="scale"
              anchor="top right"
              self="top left"
            >
              <div class="q-pa-md bg-primary text-white" style="width: auto">
                <div class="text-subtitle2">
                  {{ message.text[0] }}
                </div>
              </div>
            </q-popup-proxy>
          </div>
        </div>
        <div ref="scrollBottom"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import verifierLogo from '@/assets/images/verifier_logo.png';

export default {
  data() {
    return {
      showMessage: false,
      verifierLogo,
      items: [{}, {}, {}, {}, {}, {}, {}],
      isInitialLoad: true,
      currentPage: 1,
      isLoading: false,
      hasMoreMessages: true,
      unfinishedMessages: [],
      limit: 20,
    };
  },

  computed: {
    ...mapGetters('module-example', ['messages']),
    ...mapGetters('module-example', ['newMessage']),
    ...mapGetters('module-example', ['username']),
    ...mapGetters('module-example', ['selectedChannel']),
    ...mapGetters('module-example', ['typingMessage']),
  },

  methods: {
    ...mapActions('module-example', ['addMessage']),
    ...mapActions('module-example', ['addHistoricMessage']),
    ...mapActions('module-example', ['addUnfinishedMessage']),
    ...mapActions('module-example', ['fetchChannelMessages']),
    

    handleScroll(event) {
      const container = event.target;
      if (container.scrollTop === 0) {
        const previousHeight = container.scrollHeight;
        this.limit += 20;
        
        this.$nextTick(() => {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - previousHeight;
        });
      }
    },


    getMessageBgColor(message) {
      if (
        (message.text[0] && message.text[0].includes(`@${this.username}`)) ||
        (message.text && message.text.includes(`@${this.username}`))
      ) {
        return 'warning';
      }
      if (message.author.username === this.username) {
        return 'info';
      }
      return 'primary';
    },

  },

  watch: {
    newMessage(newMessage) {
      if (newMessage && newMessage.channelId === this.selectedChannel) {
        this.addMessage({
          author: {
            username: newMessage.author.username,
          },
          avatar: this.verifierLogo,
          text: [newMessage.text],
          sent: newMessage.author.username === this.username,
        });
        this.limit += 1
        this.$refs.scrollBottom?.scrollIntoView()
      }
    },
    selectedChannel(newChannel) {
      this.limit = 20;
      this.$refs.scrollBottom?.scrollIntoView()
      this.fetchChannelMessages(newChannel);
      this.unfinishedMessages = [];
    },

    typingMessage(newTypingMessage) {
      if (
        newTypingMessage &&
        newTypingMessage.channelId === this.selectedChannel
      ) {
        if (newTypingMessage.text === '') {
          this.unfinishedMessages = this.unfinishedMessages.filter(
            (message) => message.author.username !== newTypingMessage.username
          );
        } else {
          const existingIndex = this.unfinishedMessages.findIndex(
            (message) => message.author.username === newTypingMessage.username
          );

          const typingMessage = {
            author: {
              username: newTypingMessage.username,
            },
            avatar: this.verifierLogo,
            text: [newTypingMessage.text],
            sent: newTypingMessage.username === this.username,
          };
          this.$refs.scrollBottom?.scrollIntoView()
          if (existingIndex === -1) {
            this.unfinishedMessages.push(typingMessage);
          } else {
            this.unfinishedMessages[existingIndex].text = [
              newTypingMessage.text,
            ];
          }
        }
      }
    },
  },

  
};
</script>

<style scoped>
.scroll-container {
  width: auto;
  max-width: 100%;
  height: calc(100vh - 150px);
  overflow-y: auto;
}
</style>
