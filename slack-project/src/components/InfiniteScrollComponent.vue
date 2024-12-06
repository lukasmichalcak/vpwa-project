<template>
  <div class="q-pa-md">
    <div ref="scrollContainer">
      <q-infinite-scroll @load="onLoad" reverse>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="message.author.username === username ? 'row justify-end' : 'row justify-start'"
          class="caption q-py-sm"
        >
          <div
            :class="message.author.username === username ? 'self-end' : 'self-start'"
            style="max-width: 75%"
          >
            <q-chat-message
              :name="message.author.username"
              :avatar=verifierLogo
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
              :name="message.name"
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
      </q-infinite-scroll>
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
    





    getMessageBgColor(message) {
      if (message.text[0] && message.text[0].includes(`@${this.username}`) || message.text && message.text.includes(`@${this.username}`)) {
        return 'warning';
      }
      if (message.author.username === this.username) {
        return 'info';
      }
      return 'primary';
    },

    onLoad(index, done) {
      if (!this.isInitialLoad) {
        const scrollContainer = document.querySelector('.center-content');
        const previousScrollHeight = scrollContainer.scrollHeight;
        const previousScrollTop = scrollContainer.scrollTop;

        if (previousScrollTop <= 100) {
          setTimeout(() => {
            this.$nextTick(() => {
              const newScrollHeight = scrollContainer.scrollHeight;
              const heightDifference = newScrollHeight - previousScrollHeight;
              scrollContainer.scrollTop = previousScrollTop + heightDifference;
              done();
            });
          }, 1500);
        } else {
          done();
        }
      } else {
        done();
      }
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
      }
    },
    selectedChannel(newChannel) {
      this.fetchChannelMessages(newChannel);
      this.unfinishedMessages = [];
    },

    typingMessage(newTypingMessage) {
      if (newTypingMessage && newTypingMessage.channelId === this.selectedChannel) {
        if (newTypingMessage.text === '') {
          this.unfinishedMessages = this.unfinishedMessages.filter(
            message => message.author.username !== newTypingMessage.username
          );
        } else {
          const existingIndex = this.unfinishedMessages.findIndex(
            message => message.author.username === newTypingMessage.username
          );
          
          const typingMessage = {
            author: {
            username: newTypingMessage.username,
            },
            avatar: this.verifierLogo,
            text: [newTypingMessage.text],
            sent: newTypingMessage.username === this.username
          };

          if (existingIndex === -1) {
            this.unfinishedMessages.push(typingMessage);
          } else {
            this.unfinishedMessages[existingIndex].text = [newTypingMessage.text];
          }
        }
      }
    },
  },

  created() {
    this.fetchChannelMessages(this.selectedChannel);
    
    this.$nextTick(() => {
      this.$emit('static-messages-loaded');
      this.isInitialLoad = false;
    });
  },
};
</script>

<style scoped>
.scroll-container {
  width: 100%;
  max-width: 100%;
}
</style>
