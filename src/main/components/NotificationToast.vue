<script setup lang="ts">
import { ref } from "vue";

export interface Props {
  text?: string;
  animationDuration?: number;
  displayDuration?: number;
}

const { text = "", animationDuration = 500, displayDuration = 1500 } = defineProps<Props>();

const shown = ref(false);

function show() {
  shown.value = true;
  setTimeout(() => (shown.value = false), displayDuration + animationDuration);
}

defineExpose({ show });
</script>

<template>
  <Transition>
    <div role="alert" :style="`--duration: ${animationDuration}ms`" v-if="shown">
      {{ text }}
    </div>
  </Transition>
</template>

<style scoped>
[role="alert"] {
  position: fixed;
  z-index: 10;
  bottom: 7%;
  left: 0;
  right: 0;
  max-width: 20rem;
  width: fit-content;
  opacity: 1;
  background-color: var(--gray-400);
  text-align: center;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-inline: auto;
}

.v-enter-active,
.v-leave-active {
  transition: bottom var(--duration) ease-in-out, opacity var(--duration) ease-in-out;
}

.v-enter-from,
.v-leave-to {
  bottom: 0;
  opacity: 0;
}
</style>
