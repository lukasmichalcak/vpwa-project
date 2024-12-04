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
                  Excellent!!! Can't wait to s...
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
    };
  },

  computed: {
    ...mapGetters('module-example', ['messages']),
    ...mapGetters('module-example', ['unfinishedMessages']),
    ...mapGetters('module-example', ['newMessage']),
    ...mapGetters('module-example', ['username']),
    ...mapGetters('module-example', ['selectedChannel']),
  },

  methods: {
    ...mapActions('module-example', ['addMessage']),
    ...mapActions('module-example', ['addHistoricMessage']),
    ...mapActions('module-example', ['addUnfinishedMessage']),
    ...mapActions('module-example', ['fetchChannelMessages']),
    





    getMessageBgColor(message) {
      // if (message.text && message.text.some((t) => t.includes('@Kevin '))) {
      //   return 'warning';
      // }
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
            // const numberOfMessagesToLoad = 30;

            // for (let i = 0; i < numberOfMessagesToLoad; i++) {
            //   this.addHistoricMessage({
            //     name: 'Jane',
            //     avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
            //     text: ['Lorem ipsum dolor sit amet...'],
            //     sent: false,
            //     me: false,
            //   });
            // }

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
    },
  },

  created() {
    this.fetchChannelMessages(this.selectedChannel);
    // this.addMessage({
    //   name: 'Jane',
    //   avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    //   text: ['Wanna do something together, what say you? @Kevin '],
    //   sent: false,
    //   me: false,
    // });

    // this.addMessage({
    //   name: 'me',
    //   avatar: this.verifierLogo,
    //   text: ['Did you hear about the new hiking trail that opened up nearby?'],
    //   sent: true,
    // });

    // this.addMessage({
    //   name: 'Jane',
    //   avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    //   text: ['Yeah, I saw a post about it!', 'Have you been there yet?'],
    //   sent: false,
    //   me: false,
    // });

    // this.addMessage({
    //   name: 'me',
    //   avatar: this.verifierLogo,
    //   text: ['Not yet, but I’m thinking of going this weekend. Want to join?'],
    //   sent: true,
    // });

    // this.addMessage({
    //   name: 'Jane',
    //   avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    //   text: ['I’m down! I’ve been needing a good outdoor escape.'],
    //   sent: false,
    //   me: false,
    // });

    // this.addMessage({
    //   name: 'me',
    //   avatar: this.verifierLogo,
    //   text: ['Same here. They say the views from the top are incredible.'],
    //   sent: true,
    // });

    // this.addMessage({
    //   name: 'Jane',
    //   avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    //   text: [
    //     'I’ve heard that too. How long is the trail, though? I’m hoping it’s not too tough.',
    //   ],
    //   sent: false,
    //   me: false,
    // });

    // this.addMessage({
    //   name: 'Jane',
    //   avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    //   text: [
    //     'It’s about 5 miles, so not too bad.',
    //     'A little steep in some parts, but totally manageable.',
    //   ],
    //   sent: false,
    //   me: false,
    // });

    // this.addMessage({
    //   name: 'me',
    //   avatar: this.verifierLogo,
    //   text: [
    //     'That sounds perfect! I could use a challenge but nothing too intense.',
    //   ],
    //   sent: true,
    // });

    // this.addMessage({
    //   name: 'Jane',
    //   avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    //   text: ['Exactly. We can pack a picnic for when we reach the top.'],
    //   sent: false,
    //   me: false,
    // });

    // this.addMessage({
    //   name: 'me',
    //   avatar: this.verifierLogo,
    //   text: [
    //     'Great idea! Let’s do it. I’ll bring some snacks, maybe fruit and sandwiches.',
    //   ],
    //   sent: true,
    // });

    // this.addMessage({
    //   name: 'Jane',
    //   avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    //   text: ['Awesome! I’ll take care of drinks and a blanket.'],
    //   sent: false,
    //   me: false,
    // });

    // this.addMessage({
    //   name: 'me',
    //   avatar: this.verifierLogo,
    //   text: [
    //     'Perfect. Do you think we should start early? It might get crowded later.',
    //   ],
    //   sent: true,
    // });

    // this.addMessage({
    //   name: 'Jane',
    //   avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    //   text: ['Yeah, I was thinking around 8 AM. It’ll be cooler, too.'],
    //   sent: false,
    //   me: false,
    // });

    // this.addMessage({
    //   name: 'me',
    //   avatar: this.verifierLogo,
    //   text: ['That works for me! I’ll just have to make sure I’m up on time.'],
    //   sent: true,
    // });

    // this.addMessage({
    //   name: 'Jane',
    //   avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    //   text: ['Haha, I’ll send you a reminder. Can’t have you missing out!'],
    //   sent: false,
    //   me: false,
    // });

    // this.addMessage({
    //   name: 'me',
    //   avatar: this.verifierLogo,
    //   text: ['I appreciate it! I’d hate to sleep through this.'],
    //   sent: true,
    // });

    // this.addMessage({
    //   name: 'Jane',
    //   avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    //   text: [
    //     'It’s gonna be great! We’ll get some fresh air and awesome views.',
    //   ],
    //   sent: false,
    //   me: false,
    // });

    // this.addMessage({
    //   name: 'me',
    //   avatar: this.verifierLogo,
    //   text: ['Definitely. I’m really looking forward to it.'],
    //   sent: true,
    // });

    // this.addMessage({
    //   name: 'me',
    //   avatar: this.verifierLogo,
    //   text: ['PWA SU BASEEEEEED'],
    //   sent: true,
    // });

    // this.addUnfinishedMessage({
    //   name: 'Jane',
    //   avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    //   typing: true,
    // });

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
