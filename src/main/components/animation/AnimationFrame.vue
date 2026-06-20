<script setup lang="ts">
import AnimationOverlay from "@/components/animation/AnimationOverlay.vue";
import FunctionTypes from "@/constants/FunctionTypes";
import FractalGeneratorParameters from "@/generators/FractalGeneratorParameters";
import WebGpuFractalGenerator from "@/generators/WebGpuFractalGenerator";
import Configuration from "@/models/Configuration";
import { onMounted, onUnmounted, ref, useTemplateRef, watch, type Ref } from "vue";

const configuration = defineModel<Configuration>("configuration", { required: true });

let fractalGenerator: WebGpuFractalGenerator;
const error: Ref<Error | undefined> = ref(undefined);
const metrics = ref({ fps: 0, javascriptTime: 0, computeTime: 0, renderTime: 0 });

const canvas = useTemplateRef<HTMLCanvasElement>("animationCanvas");

watch(
  () => configuration.value.resolutionScale,
  (scale) => fractalGenerator?.updateCanvasResolution(scale),
);
watch(
  () => configuration.value.coordinatesScale,
  (scale) => fractalGenerator?.updateParameter(FractalGeneratorParameters.COORDINATES_SCALE, scale),
);
watch(
  () => configuration.value.coordinatesCentre,
  (centre) =>
    fractalGenerator?.updateParameter(FractalGeneratorParameters.COORDINATES_CENTRE, [
      centre.re,
      centre.im,
    ]),
  { deep: true },
);
watch(
  () => configuration.value.iterationsCount,
  (count) => fractalGenerator?.updateParameter(FractalGeneratorParameters.ITERATIONS_COUNT, count),
);
watch(
  () => configuration.value.epsilon,
  (epsilon) => fractalGenerator?.updateParameter(FractalGeneratorParameters.EPSILON, epsilon),
);
watch(
  () => configuration.value.juliaBound,
  (bound) => fractalGenerator?.updateParameter(FractalGeneratorParameters.JULIA_BOUND, bound),
);
watch(
  () => configuration.value.fractalFunction,
  (fractalFunction) => {
    fractalGenerator?.updateParameter(
      FractalGeneratorParameters.IS_NEWTON,
      fractalFunction.getFunctionType() == FunctionTypes.NEWTON ? 1 : 0,
    );
    fractalGenerator?.updateParameter(
      FractalGeneratorParameters.NUMERATOR_COEFFICIENTS_COUNT,
      fractalFunction.getNumeratorCoefficients().length,
    );
    fractalGenerator?.updateParameter(
      FractalGeneratorParameters.DENOMINATOR_COEFFICIENTS_COUNT,
      fractalFunction.getDenominatorCoefficients().length,
    );
    fractalGenerator?.updateParameter(
      FractalGeneratorParameters.NEWTON_COEFFICIENT,
      fractalFunction.newtonCoefficient.getEllipseParameters(),
    );
    fractalGenerator?.updateParameter(
      FractalGeneratorParameters.NUMERATOR,
      fractalFunction.getNumeratorCoefficientsEllipseParameters(),
    );
    fractalGenerator?.updateParameter(
      FractalGeneratorParameters.DENOMINATOR,
      fractalFunction.getDenominatorCoefficientsEllipseParameters(),
    );
  },
  { deep: true },
);
watch(
  () => configuration.value.juliaHSV,
  (hsv) => fractalGenerator?.updateParameter(FractalGeneratorParameters.JULIA_HSV, hsv),
  { deep: true },
);
watch(
  () => configuration.value.fatouHue,
  (hue) => fractalGenerator?.updateParameter(FractalGeneratorParameters.FATOU_HUE, hue),
);
watch(
  () => configuration.value.fatouSaturationStrength,
  (strength) =>
    fractalGenerator?.updateParameter(
      FractalGeneratorParameters.FATOU_SATURATION_STRENGTH,
      strength,
    ),
);
watch(
  () => configuration.value.fatouSaturationOffset,
  (offset) =>
    fractalGenerator?.updateParameter(FractalGeneratorParameters.FATOU_SATURATION_OFFSET, offset),
);
watch(
  () => configuration.value.fatouValueStrength,
  (strength) =>
    fractalGenerator?.updateParameter(FractalGeneratorParameters.FATOU_VALUE_STRENGTH, strength),
);
watch(
  () => configuration.value.fatouValueOffset,
  (offset) =>
    fractalGenerator?.updateParameter(FractalGeneratorParameters.FATOU_VALUE_OFFSET, offset),
);

onMounted(async () => {
  // Initialise fractal engine
  const fractalGeneratorInit = await WebGpuFractalGenerator.initialise(canvas.value!);
  if (fractalGeneratorInit instanceof Error) {
    error.value = fractalGeneratorInit;
    console.error(error.value);
    return;
  }
  fractalGenerator = fractalGeneratorInit;

  // Start the animation
  fractalGenerator.startAnimation(configuration.value);

  // Update dimension ratio when canvas changes size
  new ResizeObserver(() => fractalGenerator.updateViewportDimensionRatio()).observe(canvas.value!);

  // Update resolution on window resize
  window.addEventListener("resize", () =>
    fractalGenerator.updateCanvasResolution(configuration.value.resolutionScale),
  );

  // Update fps every 0.3 seconds
  setInterval(() => (metrics.value = fractalGenerator.getTimingMeasurements()), 300);
});

onUnmounted(() => fractalGenerator?.destroy());
</script>

<template>
  <div id="animation-frame" ref="animationFrame">
    <canvas ref="animationCanvas"></canvas>
    <AnimationOverlay
      v-if="error == null"
      :metrics="metrics"
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
