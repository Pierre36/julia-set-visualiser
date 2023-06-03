<script>
import { displayScene } from "../graphics";
import vertexShaderSource from "../assets/shaders/vertex_shader.vs?raw";
import fragmentShaderSource from "../assets/shaders/fragment_shader.fs?raw";

export default {
  name: "AnimationFrame",
  props: {
    parameters: { type: Object, required: true },
  },
  mounted() {
    const shaderSources = {
      vertex: vertexShaderSource,
      fragment: fragmentShaderSource,
    };
    try {
      displayScene(this.$refs.animationCanvas, shaderSources, this.parameters);
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    updatePaused() {
      this.parameters.paused = !this.parameters.paused;
    },
  },
};
</script>

<template>
  <div id="animationFrame">
    <canvas id="animationCanvas" ref="animationCanvas"></canvas>
    <div id="animationMenu">
      <button id="pauseButton" class="icon-button" @click="updatePaused">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <title v-if="parameters.paused">Play</title>
          <title v-else>Pause</title>
          <path
            v-if="parameters.paused"
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
    </div>
  </div>
</template>

<style>
#animationFrame {
  position: relative;
  flex-grow: 1;
}

#animationCanvas {
  display: block;
  width: 100%;
  height: 100%;
}

#animationMenu {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding-bottom: 0.5rem;
  padding-top: 2rem;
  background: linear-gradient(hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0.3) 100%);
  visibility: hidden;
}

#animationFrame:hover #animationMenu {
  visibility: visible;
}

#pauseButton {
  --button-border-radius: 50%;
  --button-color: var(--gray-100);
  --button-color-hover: var(--gray-100);
  --button-color-active: var(--gray-100);
  --button-background-color-hover: hsla(0, 0%, 10%, 0.9);
  --button-background-color-active: hsla(0, 0%, 10%, 0.9);
  margin-inline: auto;
  padding: 0.5rem;
}

#pauseButton svg {
  width: 2.5rem;
  height: 2.5rem;
}
</style>
