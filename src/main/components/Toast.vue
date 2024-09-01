<script>
export default {
  name: "Toast",
  props: {
    text: { type: String, default: "" },
    animationDuration: { type: Number, default: 500 },
    displayDuration: { type: Number, default: 1500 },
  },
  expose: ["show"],
  data() {
    return {
      shown: false,
    };
  },
  methods: {
    show() {
      this.shown = true;
      setTimeout(() => (this.shown = false), this.displayDuration + this.animationDuration);
    },
  },
};
</script>

<template>
  <Transition>
    <div role="alert" :style="`--duration: ${this.animationDuration}ms`" v-if="shown">
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
