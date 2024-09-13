<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "IconTextButton",
  props: {
    svgPath: { type: String, required: true },
    text: { type: String, required: true },
  },
});
</script>

<template>
  <button class="button" :title="text">
    <svg viewBox="0 -960 960 960" role="img">
      <title>{{ text }}</title>
      <path fill="currentColor" fill-rule="evenodd" :d="svgPath" />
    </svg>
    <span class="text">{{ text }}</span>
  </button>
</template>

<style scoped>
button {
  display: flex;
  padding: 0.5rem 0.5rem;
  text-align: center;
}

svg {
  height: 2rem;
  width: 2rem;
}

.text {
  margin-left: 0.25rem;
  margin-block: auto;
  flex-grow: 1;
}
</style>
