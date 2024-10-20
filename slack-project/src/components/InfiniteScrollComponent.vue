<template>
  <div class="q-pa-md row justify-center">
    <div style="width: 100%; max-width: 400px">
      <q-infinite-scroll @load="onLoad" reverse>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <div
          v-for="(item, index) in items"
          :key="index"
          class="caption q-py-sm"
        >
          <q-chat-message
            name="Jane"
            avatar="https://cdn.quasar.dev/img/avatar5.jpg"
            :text="[
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro...',
            ]"
            text-color="white"
            bg-color="primary"
          />
        </div>
        <q-chat-message
          name="me"
          avatar="../assets/images/verifier_logo.png"
          :text="[
            'Did you hear about the new hiking trail that opened up nearby?',
          ]"
          sent
          bg-color="amber-7"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="['Yeah, I saw a post about it!', 'Have you been there yet?']"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="me"
          avatar="../assets/images/verifier_logo.png"
          :text="[
            'Not yet, but I’m thinking of going this weekend. Want to join?',
          ]"
          sent
          bg-color="amber-7"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="['I’m down! I’ve been needing a good outdoor escape.']"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="Jane"
          avatar="../assets/images/verifier_logo.png"
          :text="[
            ' Same here. They say the views from the top are incredible.',
          ]"
          sent
          bg-color="amber-7"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="[
            'I’ve heard that too. How long is the trail, though? I’m hoping it’s not too tough.',
          ]"
          size="8"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="[
            'It’s about 5 miles, so not too bad.',
            'A little steep in some parts, but totally manageable.',
          ]"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="me"
          avatar="../assets/images/verifier_logo.png"
          :text="[
            'That sounds perfect! I could use a challenge but nothing too intense.',
          ]"
          sent
          bg-color="amber-7"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="['Exactly. We can pack a picnic for when we reach the top.']"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="me"
          avatar="../assets/images/verifier_logo.png"
          :text="[
            'Great idea! Let’s do it. I’ll bring some snacks, maybe fruit and sandwiches.',
          ]"
          sent
          bg-color="amber-7"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="['Awesome! I’ll take care of drinks and a blanket.']"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="me"
          avatar="../assets/images/verifier_logo.png"
          :text="[
            'Perfect. Do you think we should start early? It might get crowded later.',
          ]"
          sent
          bg-color="amber-7"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="['Yeah, I was thinking around 8 AM. It’ll be cooler, too.']"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="me"
          avatar="../assets/images/verifier_logo.png"
          :text="[
            'That works for me! I’ll just have to make sure I’m up on time.',
          ]"
          sent
          bg-color="amber-7"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="[
            'Haha, I’ll send you a reminder. Can’t have you missing out!',
          ]"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="me"
          avatar="../assets/images/verifier_logo.png"
          :text="['I appreciate it! I’d hate to sleep through this.']"
          sent
          bg-color="amber-7"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar5.jpg"
          :text="[
            ' It’s gonna be great! We’ll get some fresh air and awesome views.',
          ]"
          text-color="white"
          bg-color="primary"
        />
        <q-chat-message
          name="me"
          avatar="../assets/images/verifier_logo.png"
          :text="['Definitely. I’m really looking forward to it.']"
          sent
          bg-color="amber-7"
        />
        <div>
          <q-chat-message
            name="Jane"
            avatar="https://cdn.quasar.dev/img/avatar5.jpg"
            text-color="white"
            bg-color="primary"
            @click="showMessage = true"
          >
            <q-spinner-dots size="2rem" />
          </q-chat-message>

          <q-popup-proxy
            v-model:showing="showMessage"
            transition-show="scale"
            transition-hide="scale"
          >
            <div class="q-pa-md bg-primary text-white" style="width: auto">
              <div class="text-subtitle2">Excellent!!! Can't wait to s...</div>
            </div>
          </q-popup-proxy>
        </div>
      </q-infinite-scroll>
    </div>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue';

export default {
  data() {
    return {
      showMessage: false,
    };
  },

  setup() {
    const items = ref([{}, {}, {}, {}, {}, {}, {}]);

    const onLoad = (index, done) => {
      const scrollContainer = document.querySelector('.center-content');
      const previousScrollHeight = scrollContainer.scrollHeight;
      const previousScrollTop = scrollContainer.scrollTop;

      // Only trigger the loading when you're close enough to the top
      if (previousScrollTop <= 100) {
        // Threshold of 100px from the top
        setTimeout(() => {
          // Add new items
          const numberOfMessagesToLoad = 30; // Set how many you want to load each time

          for (let i = 0; i < numberOfMessagesToLoad; i++) {
            items.value.unshift({
              id: items.value.length + 1, // Simulate message id
              content: 'Lorem ipsum...', // Simulate message content
            });
          }

          // After the items are added, calculate the new scroll height difference
          nextTick(() => {
            const newScrollHeight = scrollContainer.scrollHeight;
            const heightDifference = newScrollHeight - previousScrollHeight;

            // Maintain the scroll position based on the difference
            scrollContainer.scrollTop = previousScrollTop + heightDifference;

            done(); // Mark the infinite scroll load as completed
          });
        }, 1500); // Simulate a loading delay
      } else {
        done(); // Complete loading without adding more items if the condition is not met
      }
    };

    return {
      items,
      onLoad,
    };
  },
};
</script>

<!-- <script>
import { ref, nextTick } from 'vue';

export default {
  setup() {
    const items = ref([{}, {}, {}, {}, {}, {}, {}]);

    const onLoad = (index, done) => {
      const scrollContainer = document.querySelector('.center-content');
      const previousScrollHeight = scrollContainer.scrollHeight;
      const previousScrollTop = scrollContainer.scrollTop;

      // Only trigger the loading when you're close enough to the top
      if (previousScrollTop <= 100) {
        // Threshold of 100px from the top
        setTimeout(() => {
          // Add new items
          const numberOfMessagesToLoad = 30; // Set how many you want to load each time

          for (let i = 0; i < numberOfMessagesToLoad; i++) {
            items.value.unshift({
              id: items.value.length + 1, // Simulate message id
              content: 'Lorem ipsum...', // Simulate message content
            });
          }

          // After the items are added, calculate the new scroll height difference
          nextTick(() => {
            const newScrollHeight = scrollContainer.scrollHeight;
            const heightDifference = newScrollHeight - previousScrollHeight;

            // Maintain the scroll position based on the difference
            scrollContainer.scrollTop = previousScrollTop + heightDifference;

            done(); // Mark the infinite scroll load as completed
          });
        }, 1500); // Simulate a loading delay
      } else {
        done(); // Complete loading without adding more items if the condition is not met
      }
    };

    return {
      items,
      onLoad,
    };
  },
};
</script>

<template>
  <div
    class="messages-container q-pa-md"
    style="flex-grow: 1; overflow-y: auto; height: calc(100% - 80px)"
    ref="message_container"
  >
    <q-infinite-scroll
      @load="onLoad"
      reverse
      style="width: 100%"
      :scroll-target="message_container"
    >
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" name="dots" size="40px" />
        </div>
      </template>
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="caption q-py-sm"
      >
        <q-chat-message
          :key="message.id"
          :name="message.name"
          :avatar="message.avatar"
          :text="message.text"
          :stamp="message.stamp"
          :sent="message.me"
          :bg-color="
            message.text.some((t) => t.includes('@Michael '))
              ? 'warning'
              : message.me
              ? 'secondary'
              : 'primary'
          "
          :text-color="message.me ? 'primary' : 'white'"
          :class="{ 'border-primary': !message.me, 'border-white': message.me }"
        >
        </q-chat-message>
      </div>
      <div>
        <q-chat-message
          bg-color="primary"
          name="Joe"
          text-color="white"
          avatar="https://cdn.quasar.dev/img/boy-avatar.png"
          @click="showMessage = true"
        >
          <q-spinner-dots size="2rem" />
        </q-chat-message>

        <q-popup-proxy
          v-model:showing="showMessage"
          transition-show="scale"
          transition-hide="scale"
        >
          <div class="q-pa-md bg-primary text-white" style="width: auto">
            <div class="text-subtitle2">
              Hello Michael I have a question for you, can y...
            </div>
          </div>
        </q-popup-proxy>
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMessage: false,
    };
  },
};
</script> -->
