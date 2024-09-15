<script lang="ts">
import { defineComponent } from "vue";
import WebGpuFractalGenerator from "@/generators/WebGpuFractalGenerator";
import FractalGeneratorParameters from "@/generators/FractalGeneratorParameters";
import Configuration from "@/models/Configuration";
import AnimationOverlay from "@/components/AnimationOverlay.vue";
import Complex from "@/models/Complex";
import FractalFunction from "@/models/FractalFunction";
import Attractor from "@/models/Attractor";
import FunctionTypes from "@/constants/FunctionTypes";

export default defineComponent({
  name: "AnimationFrame",
  components: { AnimationOverlay },
  props: {
    configuration: { type: Configuration, required: true },
  },
  data() {
    return {
      fractalGenerator: null as WebGpuFractalGenerator | null,
      error: null as any,
      fps: 0 as number,
    };
  },
  watch: {
    "configuration.resolutionScale"(newResolutionScale: number) {
      this.fractalGenerator?.updateCanvasResolution(newResolutionScale);
    },
    "configuration.coordinatesScale"(newCoordinatesScale: number) {
      this.fractalGenerator?.updateParameter(
        FractalGeneratorParameters.COORDINATES_SCALE,
        newCoordinatesScale
      );
    },
    "configuration.coordinatesCenter"(newCoordinatesCenter: Complex) {
      this.fractalGenerator?.updateParameter(FractalGeneratorParameters.COORDINATES_CENTER, [
        newCoordinatesCenter.re,
        newCoordinatesCenter.im,
      ]);
    },
    "configuration.nbIterations"(newIterationsCount: number) {
      this.fractalGenerator?.updateParameter(
        FractalGeneratorParameters.ITERATIONS_COUNT,
        newIterationsCount
      );
    },
    "configuration.epsilon"(newEpsilon: number) {
      this.fractalGenerator?.updateParameter(FractalGeneratorParameters.EPSILON, newEpsilon);
    },
    "configuration.juliaBound"(newJuliaBound: number) {
      this.fractalGenerator?.updateParameter(FractalGeneratorParameters.JULIA_BOUND, newJuliaBound);
    },
    "configuration.fractalFunction": {
      handler(newFractalFunction: FractalFunction) {
        this.fractalGenerator?.updateParameter(
          FractalGeneratorParameters.IS_NEWTON,
          newFractalFunction.functionType == FunctionTypes.NEWTON ? 1 : 0
        );
        this.fractalGenerator?.updateParameter(
          FractalGeneratorParameters.NEWTON_COEFFICIENT,
          newFractalFunction.newtonCoefficient.getEllipseParameters()
        );
        this.fractalGenerator?.updateParameter(
          FractalGeneratorParameters.NUMERATOR,
          newFractalFunction.numerator.getCoefficientsParameters()
        );
        this.fractalGenerator?.updateParameter(
          FractalGeneratorParameters.DENOMINATOR,
          newFractalFunction.denominator.getCoefficientsParameters()
        );
      },
      deep: true,
    },
    "configuration.juliaHSV": {
      handler(newJuliaHSV: number[]) {
        this.fractalGenerator?.updateParameter(FractalGeneratorParameters.JULIA_HSV, newJuliaHSV);
      },
      deep: true,
    },
    "configuration.defaultAttractor": {
      handler(newDefaultAttractor: Attractor) {
        this.fractalGenerator?.updateParameter(FractalGeneratorParameters.DEFAULT_COLOUR, [
          newDefaultAttractor.hue,
          newDefaultAttractor.saturationStrength,
          newDefaultAttractor.saturationOffset,
          newDefaultAttractor.valueStrength,
          newDefaultAttractor.valueOffset,
        ]);
      },
      deep: true,
    },
    "configuration.infinityAttractor": {
      handler(newInfinityAttractor: Attractor) {
        this.fractalGenerator?.updateParameter(FractalGeneratorParameters.INFINITY_COLOUR, [
          newInfinityAttractor.hue,
          newInfinityAttractor.saturationStrength,
          newInfinityAttractor.saturationOffset,
          newInfinityAttractor.valueStrength,
          newInfinityAttractor.valueOffset,
        ]);
      },
      deep: true,
    },
    "configuration.attractors": {
      handler(newAttractors: Attractor[]) {
        this.fractalGenerator?.updateParameter(
          FractalGeneratorParameters.ATTRACTORS_COUNT,
          newAttractors.length
        );
        this.fractalGenerator?.updateParameter(
          FractalGeneratorParameters.ATTRACTORS,
          newAttractors.flatMap((attractor) => [
            attractor.complex?.mod() || 0,
            attractor.complex?.arg() || 0,
            attractor.hue,
            attractor.saturationStrength,
            attractor.saturationOffset,
            attractor.valueStrength,
            attractor.valueOffset,
          ])
        );
      },
      deep: true,
    },
  },
  async mounted() {
    // Initialize fractal engine
    const configuration = Configuration.emptyConfiguration("", "");
    configuration.fillWith(this.configuration);
    const fractalGeneratorInit = await WebGpuFractalGenerator.initialise(
      this.$refs.animationCanvas as HTMLCanvasElement
    );
    if (fractalGeneratorInit instanceof Error) {
      this.error = fractalGeneratorInit;
      console.error(this.error);
      return;
    }
    this.fractalGenerator = fractalGeneratorInit;

    // Start the animation
    this.fractalGenerator.startAnimation(configuration);

    // Update dimension ratio when canvas changes size
    new ResizeObserver(() => {
      this.fractalGenerator?.updateViewportDimensionRatio();
    }).observe(this.$refs.animationCanvas as HTMLCanvasElement);

    // Update resolution on window resize
    window.addEventListener("resize", () => {
      this.fractalGenerator?.updateCanvasResolution(this.configuration.resolutionScale);
    });

    // Update fps every 0.3 seconds
    setInterval(() => (this.fps = Math.round(this.fractalGenerator?.fps || 0)), 300);
  },
  methods: {
    // TODO Rename
    // TODO Expose after switch to composition API
    resetFractalEngineTime() {
      console.debug("[>>] Resetting the FractalEngine time...");
      this.fractalGenerator?.resetAnimationTime();
      console.debug("[OK] FractalEngine time reset");
    },
  },
});
</script>

<template>
  <div id="animation-frame" ref="animationFrame">
    <canvas ref="animationCanvas"></canvas>
    <AnimationOverlay
      v-if="error == null"
      :fps="fps"
      @fullscreen="$refs.animationFrame.requestFullscreen()"
      @pause="fractalGenerator?.pause()"
      @unpause="fractalGenerator?.unpause()"
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
