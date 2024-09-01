<script>
import { FractalEngine } from "@/engines/FractalEngine";
import { Configuration } from "@/models/Configuration";

import AnimationOverlay from "./AnimationOverlay.vue";
import { shallowRef } from "vue";
export default {
  name: "AnimationFrame",
  components: { AnimationOverlay },
  props: {
    configuration: { type: Configuration, required: true },
  },
  expose: ["resetFractalEngineTime"],
  data() {
    return {
      fractalEngine: null,
      error: null,
      fps: 0,
    };
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
        this.fractalEngine.setFractalFunction(this.configuration.fractalFunction.copy());
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
    this.fractalEngine = shallowRef(new FractalEngine(this.$refs.animationCanvas));

    // Try to display the scene
    try {
      const configuration = new Configuration();
      configuration.fillWith(this.configuration);
      this.fractalEngine.displayScene(configuration);
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

    // Update fps every 0.3 seconds
    setInterval(() => (this.fps = Math.round(this.fractalEngine.fps)), 300);
  },
  methods: {
    resetFractalEngineTime() {
      console.debug("[>>] Resetting the FractalEngine time...");
      this.fractalEngine.resetAnimationTime();
      console.debug("[OK] FractalEngine time reset");
    },
  },
};
</script>

<template>
  <div id="animation-frame" ref="animationFrame">
    <canvas ref="animationCanvas"></canvas>
    <AnimationOverlay
      v-if="error == null"
      :fps="fps"
      @fullscreen="$refs.animationFrame.requestFullscreen()"
      @pause="fractalEngine.pause()"
      @unpause="fractalEngine.unpause()"
    />
    <div id="error-message" v-if="error != null">
      <h2>Error</h2>
      <hr />
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
#animation-frame {
  position: relative;
  flex-grow: 1;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

#error-message {
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

#error-message hr {
  height: 1px;
  margin-block: 0.5rem;
  border: 0;
  background-color: var(--gray-350);
}
</style>
