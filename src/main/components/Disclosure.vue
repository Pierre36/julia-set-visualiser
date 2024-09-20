<script setup lang="ts">
import { computed, ref } from "vue";

export interface Props {
  headingCentred: boolean;
  headingLevel: number;
  headingText: string;
  buttonTitle: string;
  buttonSvgPath: string;
  rotateWhenExpand: boolean;
}

const {
  headingCentred = false,
  headingLevel = 2,
  headingText = "",
  buttonTitle = "Info",
  buttonSvgPath = "M483.175-280q12.825 0 21.325-8.625T513-310v-180q0-12.75-8.675-21.375-8.676-8.625-21.5-8.625-12.825 0-21.325 8.625T453-490v180q0 12.75 8.675 21.375 8.676 8.625 21.5 8.625Zm-3.193-314q14.018 0 23.518-9.2T513-626q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447-626q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z",
  rotateWhenExpand = false,
} = defineProps<Props>();

const expanded = ref(false);

const heading = computed(() => `h${headingLevel}`);

function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <div class="disclosure">
    <div class="header">
      <component :is="heading" class="title" :class="{ centred: headingCentred }">
        {{ headingText }}
      </component>
      <div class="button-container">
        <button
          class="icon-button"
          :class="{ rotate: rotateWhenExpand }"
          @click="toggleExpanded"
          :aria-expanded="expanded"
          role="button"
        >
          <svg viewBox="0 -960 960 960" role="img">
            <title>{{ buttonTitle }}</title>
            <path fill="currentColor" fill-rule="evenodd" :d="buttonSvgPath" />
          </svg>
        </button>
      </div>
    </div>
    <div class="content-container" :data-expanded="expanded">
      <Transition name="expand">
        <div class="disclosure-content" v-if="expanded">
          <slot></slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* HEADER */

.disclosure {
  --animation-duration: 300ms;
  --button-container-width: 2rem;
}

.header {
  display: flex;
  align-items: center;
}

.title {
  flex-grow: 1;
}

.title.centred {
  flex-grow: 1;
  text-align: center;
  margin-left: var(--button-container-width);
}

/* BUTTON */

.button-container {
  text-align: center;
  width: var(--button-container-width);
}

.icon-button {
  padding: 0.1rem;
}

.icon-button svg {
  width: 1.7rem;
  height: 1.7rem;
  transition: rotate var(--animation-duration) ease-in-out;
}

.icon-button[aria-expanded="true"].rotate svg {
  rotate: 180deg;
}

.icon-button[aria-expanded="true"] {
  color: var(--gray-100);
}

/* INFO PANEL */

.content-container {
  display: grid;
  transition: grid-template-rows var(--animation-duration) ease-in-out;
}

.content-container[data-expanded="false"] {
  grid-template-rows: 0fr;
}

.content-container[data-expanded="true"] {
  grid-template-rows: 1fr;
}

/* INFO CONTAINER */

.disclosure-content {
  overflow: hidden;
  padding: 0.5rem;
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity var(--animation-duration) ease-in-out,
    padding-block var(--animation-duration) ease-in-out;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  padding-block: 0rem;
}
</style>
