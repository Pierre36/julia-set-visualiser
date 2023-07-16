<script>
import { FractalEngine } from "../models/FractalEngine";
import { Configuration } from "../models/Configuration";

import AnimationOverlay from "./AnimationOverlay.vue";
export default {
  name: "AnimationFrame",
  components: { AnimationOverlay },
  props: {
    configuration: { type: Configuration, required: true },
  },
  data() {
    return {
      fractalEngine: null,
      error: null,
    };
  },
  computed: {
    fps() {
      if (this.fractalEngine == null) {
        return 0;
      }
      return Math.round(this.fractalEngine.fps);
    },
  },
  watch: {
    "configuration.resolutionScale"(newResolutionScale) {
      this.fractalEngine.createViewport(newResolutionScale);
    },
    "configuration.coordinatesScale"(newCoordinatesScale) {
      this.fractalEngine.setCoordinatesScale(newCoordinatesScale);
    },
    "configuration.coordinatesCenter"(newCoordinatesCenter) {
      this.fractalEngine.setCoordinatesCenter(newCoordinatesCenter);
    },
    "configuration.nbIterations"(newNbIterations) {
      this.fractalEngine.setNbIterations(newNbIterations);
    },
    "configuration.epsilon"(newEpsilon) {
      this.fractalEngine.setEpsilon(newEpsilon);
    },
    "configuration.juliaBound"(newJuliaBound) {
      this.fractalEngine.setJuliaBound(newJuliaBound);
    },
    "configuration.fractalFunction": {
      handler(_) {
        if (this.fractalEngine.paused) {
          this.fractalEngine.setFractalFunction(this.configuration.fractalFunction);
        }
      },
      deep: true,
    },
    "configuration.juliaHSV": {
      handler(newJuliaHSV) {
        this.fractalEngine.setJuliaHSV(newJuliaHSV);
      },
      deep: true,
    },
    "configuration.defaultAttractor": {
      handler(newDefaultAttractor) {
        this.fractalEngine.setDefaultAttractor(newDefaultAttractor);
      },
      deep: true,
    },
    "configuration.infinityAttractor": {
      handler(newInfinityAttractor) {
        this.fractalEngine.setInfinityAttractor(newInfinityAttractor);
      },
      deep: true,
    },
    "configuration.attractors": {
      handler(newAttractors) {
        this.fractalEngine.setAttractors(newAttractors);
      },
      deep: true,
    },
  },
  mounted() {
    // Initialize fractal engine
    this.fractalEngine = new FractalEngine(this.$refs.animationCanvas);

    // Try to display the scene
    try {
      this.fractalEngine.displayScene(this.configuration);
    } catch (error) {
      this.error = error;
      console.error(error);
    }

    // Update dimension ratio when canvas changes size
    new ResizeObserver(() => {
      this.fractalEngine.updateDimensionRatio();
    }).observe(this.$refs.animationCanvas);

    // Update resolution on window resize
    window.addEventListener("resize", () => {
      this.fractalEngine.createViewport(this.configuration.resolutionScale);
    });
  },
};
</script>

<template>
  <div id="animationFrame" ref="animationFrame">
    <canvas id="animationCanvas" ref="animationCanvas"></canvas>
    <AnimationOverlay
      v-if="error == null"
      :fps="fps"
      @fullscreen="$refs.animationFrame.requestFullscreen()"
      @pause="fractalEngine.pause()"
      @unpause="fractalEngine.unpause()"
    />
    <div id="errorMessage" v-if="error != null">
      <h2>Error</h2>
      <hr />
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
#animationFrame {
  position: relative;
  flex-grow: 1;
}

#animationCanvas {
  display: block;
  width: 100%;
  height: 100%;
}

#errorMessage {
  position: absolute;
  inset: 0;
  margin: 20% auto auto auto;
  text-align: center;
  width: fit-content;
  max-width: min(20rem, 100%);
  height: fit-content;
  max-height: 100%;
  overflow: auto;
}

#errorMessage hr {
  height: 1px;
  margin-block: 0.5rem;
  border: 0;
  background-color: var(--gray-350);
}
</style>
