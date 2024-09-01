<script>
export default {
  name: "AnimationOverlay",
  props: {
    fps: { type: Number, default: 0 },
  },
  emits: ["pause", "unpause", "fullscreen"],
  data() {
    return {
      metricsDisplayed: false,
      paused: false,
      isFullscreen: false,
      mouseMoveTimer: null,
      menuDisplayed: false,
    };
  },
  mounted() {
    // Add an event listener for the fullscreen event
    document.addEventListener("fullscreenchange", () => {
      this.isFullscreen = !this.isFullscreen;
    });

    // Add a shortcut to switch fullscreen
    document.addEventListener("keyup", (event) => {
      if (event.target.tagName.toLowerCase() !== "input" && event.key == "f") {
        this.updateFullscreen();
      }
    });
  },
  methods: {
    updatePaused() {
      this.paused = !this.paused;
      if (this.paused) {
        this.$emit("pause");
      } else {
        this.$emit("unpause");
      }
    },
    updateFullscreen() {
      if (this.isFullscreen) {
        document.exitFullscreen();
      } else {
        this.$emit("fullscreen");
      }
    },
    onMouseMove() {
      this.menuDisplayed = true;
      this.timer = setTimeout(() => (this.menuDisplayed = false), 3000);
    },
    onMouseLeave() {
      this.menuDisplayed = false;
      clearTimeout(this.timer);
    },
  },
};
</script>

<template>
  <div class="animation-overlay" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <div class="metrics" v-if="metricsDisplayed">{{ fps }}</div>
    <div class="animation-menu" :class="{ show: menuDisplayed }">
      <button ref="metricsButton" class="icon-button" @click="metricsDisplayed = !metricsDisplayed">
        <svg viewBox="0 -960 960 960">
          <title v-if="metricsDisplayed">Hide metrics</title>
          <title v-else>Show metrics</title>
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M160-160v-440h140v440H160Zm250 0v-640h140v640H410Zm250 0v-280h140v280H660Z"
          />
        </svg>
      </button>
      <button ref="pauseButton" class="icon-button" @click="updatePaused">
        <svg viewBox="0 -960 960 960">
          <title v-if="paused">Play</title>
          <title v-else>Pause</title>
          <path
            v-if="paused"
            fill="currentColor"
            fill-rule="evenodd"
            d="M366-232q-15 10-30.5 1T320-258v-450q0-18 15.5-27t30.5 1l354 226q14 9 14 25t-14 25L366-232Zm14-251Zm0 171 269-171-269-171v342Z"
          />
          <path
            v-else
            fill="currentColor"
            fill-rule="evenodd"
            d="M585-200q-24.75 0-42.375-17.625T525-260v-440q0-24.75 17.625-42.375T585-760h115q24.75 0 42.375 17.625T760-700v440q0 24.75-17.625 42.375T700-200H585Zm-325 0q-24.75 0-42.375-17.625T200-260v-440q0-24.75 17.625-42.375T260-760h115q24.75 0 42.375 17.625T435-700v440q0 24.75-17.625 42.375T375-200H260Zm325-60h115v-440H585v440Zm-325 0h115v-440H260v440Zm0-440v440-440Zm325 0v440-440Z"
          />
        </svg>
      </button>
      <button ref="fullscreenButton" class="icon-button" @click="updateFullscreen">
        <svg viewBox="0 -960 960 960">
          <title v-if="isFullscreen">Leave fullscreen</title>
          <title v-else>Fullscreen</title>
          <path
            v-if="isFullscreen"
            fill="currentColor"
            fill-rule="evenodd"
            d="M362.825-200Q350-200 341.5-208.625T333-230v-103H230q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T230-393h133q12.75 0 21.375 8.625T393-363v133q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625ZM230-567q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T230-627h103v-103q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T393-730v133q0 12.75-8.625 21.375T363-567H230Zm366.825 367Q584-200 575.5-208.625T567-230v-133q0-12.75 8.625-21.375T597-393h133q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T730-333H627v103q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625ZM597-567q-12.75 0-21.375-8.625T567-597v-133q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T627-730v103h103q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T730-567H597Z"
          />
          <path
            v-else
            fill="currentColor"
            fill-rule="evenodd"
            d="M230-200q-12.75 0-21.375-8.625T200-230v-133q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T260-363v103h103q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T363-200H230Zm-.175-367Q217-567 208.5-575.625T200-597v-133q0-12.75 8.625-21.375T230-760h133q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T363-700H260v103q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625ZM597-200q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T597-260h103v-103q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T760-363v133q0 12.75-8.625 21.375T730-200H597Zm132.825-367Q717-567 708.5-575.625T700-597v-103H597q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T597-760h133q12.75 0 21.375 8.625T760-730v133q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.animation-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.metrics {
  padding: 0.5rem;
}

.animation-menu {
  opacity: 0;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  padding-top: 2rem;
  padding-inline: 0.5rem;
  margin-top: auto;
  background: linear-gradient(hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0.3) 100%);
  transition: opacity 250ms ease-in-out;
}

.animation-menu.show,
.animation-menu:hover,
.animation-menu:focus-within {
  opacity: 1;
  pointer-events: auto;
}

.icon-button {
  --button-border-radius: 50%;
  --button-color: var(--gray-100);
  --button-color-hover: var(--gray-100);
  --button-color-active: var(--gray-100);
  --button-background-color-hover: hsla(0, 0%, 10%, 0.9);
  --button-background-color-active: hsla(0, 0%, 10%, 0.9);
  padding: 0.5rem;
}

.icon-button svg {
  width: 2.5rem;
  height: 2.5rem;
}
</style>
