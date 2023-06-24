<script>
export default {
  name: "Toast",
  props: {
    text: { type: String, default: "" },
    animationDuration: { type: Number, default: 500 },
    displayDuration: { type: Number, default: 1500 },
  },
  expose: ["show"],
  computed: {
    cssDuration() {
      return this.animationDuration + "ms";
    },
    cssDelay() {
      return this.displayDuration + "ms";
    },
  },
  methods: {
    show() {
      this.$refs.toast.setAttribute("aria-hidden", false);
      setTimeout(
        () => this.$refs.toast.setAttribute("aria-hidden", true),
        this.displayDuration + this.animationDuration
      );
    },
  },
};
</script>

<template>
  <div ref="toast" class="toast" aria-hidden="true">{{ text }}</div>
</template>

<style scoped>
.toast {
  visibility: hidden;
  position: fixed;
  z-index: 10;
  bottom: 7%;
  left: 0;
  right: 0;
  max-width: 20rem;
  width: fit-content;
  background-color: var(--gray-400);
  text-align: center;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-inline: auto;
}

.toast[aria-hidden="false"] {
  visibility: visible;
  animation: fadein v-bind(cssDuration), fadeout v-bind(cssDuration) v-bind(cssDelay);
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 7%;
    opacity: 1;
  }
}

@keyframes fadeout {
  from {
    bottom: 7%;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}
</style>
