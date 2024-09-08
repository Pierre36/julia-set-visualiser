<script>
import { WebGpuFractalGenerator } from "@/generators/WebGpuFractalGenerator";
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
      fractalGenerator: null,
      error: null,
      fps: 0,
    };
  },
  watch: {
    "configuration.resolutionScale"(newResolutionScale) {
      this.fractalGenerator.updateCanvasResolution(newResolutionScale);
    },
    "configuration.coordinatesScale"(newCoordinatesScale) {
      this.fractalGenerator.updateViewportScale(newCoordinatesScale);
    },
    "configuration.coordinatesCenter"(newCoordinatesCenter) {
      this.fractalGenerator.updateViewportCenter(newCoordinatesCenter);
    },
    "configuration.nbIterations"(newNbIterations) {
      this.fractalGenerator.updateIterationsCount(newNbIterations);
    },
    "configuration.epsilon"(newEpsilon) {
      this.fractalGenerator.updateEpsilon(newEpsilon);
    },
    "configuration.juliaBound"(newJuliaBound) {
      this.fractalGenerator.updateJuliaBound(newJuliaBound);
    },
    "configuration.fractalFunction": {
      handler(_) {
        this.fractalGenerator.setFractalFunction(this.configuration.fractalFunction.copy());
      },
      deep: true,
    },
    "configuration.juliaHSV": {
      handler(newJuliaHSV) {
        this.fractalGenerator.updateJuliaHSV(newJuliaHSV);
      },
      deep: true,
    },
    "configuration.defaultAttractor": {
      handler(newDefaultAttractor) {
        this.fractalGenerator.updateDefaultAttractor(newDefaultAttractor);
      },
      deep: true,
    },
    "configuration.infinityAttractor": {
      handler(newInfinityAttractor) {
        this.fractalGenerator.updateInfinityAttractor(newInfinityAttractor);
      },
      deep: true,
    },
    "configuration.attractors": {
      handler(newAttractors) {
        this.fractalGenerator.updateAttractors(newAttractors);
      },
      deep: true,
    },
  },
  async mounted() {
    // Initialize fractal engine
    this.fractalGenerator = shallowRef(new WebGpuFractalGenerator(this.$refs.animationCanvas));

    // Try to display the scene
    try {
      const configuration = new Configuration();
      configuration.fillWith(this.configuration);
      await this.fractalGenerator.initialise(configuration);
    } catch (error) {
      this.error = error;
      console.error(error);
    }

    // Update dimension ratio when canvas changes size
    new ResizeObserver(() => {
      this.fractalGenerator.updateViewportDimensionRatio();
    }).observe(this.$refs.animationCanvas);

    // Update resolution on window resize
    window.addEventListener("resize", () => {
      this.fractalGenerator.updateCanvasResolution(this.configuration.resolutionScale);
    });

    // Update fps every 0.3 seconds
    setInterval(() => (this.fps = Math.round(this.fractalGenerator.fps)), 300);
  },
  methods: {
    resetFractalEngineTime() {
      console.debug("[>>] Resetting the FractalEngine time...");
      this.fractalGenerator.resetAnimationTime();
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
      @pause="fractalGenerator.pause()"
      @unpause="fractalGenerator.unpause()"
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
