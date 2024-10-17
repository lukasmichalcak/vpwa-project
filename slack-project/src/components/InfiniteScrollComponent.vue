<template>
  <div class="q-pa-md">
    <q-infinite-scroll @load="onLoad" reverse>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <div v-for="(item, index) in items" :key="index" class="caption q-py-sm">
        <q-badge class="shadow-1">
          {{ items.length - index }}
        </q-badge>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
        repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
        perferendis totam, ea at omnis vel numquam exercitationem aut, natus
        minima, porro labore.
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script>
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
