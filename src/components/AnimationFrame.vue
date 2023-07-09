<script>
import { FractalEngine } from "../models/FractalEngine";
import { Configuration } from "../models/Configuration";
import { Polynomial } from "../models/Polynomial";
import { Complex } from "../models/Complex";

import AnimationOverlay from "./AnimationOverlay.vue";
export default {
  name: "AnimationFrame",
  props: {
    configuration: { type: Configuration, required: true },
  },
  data() {
    return {
      fractalEngine: null,
      parameters: {
        paused: false,
        resolutionScale: this.configuration.resolutionScale,
        coordinatesScale: this.configuration.coordinatesScale,
        coordinatesCenter: null,
        nbIterations: this.configuration.nbIterations,
        epsilon: this.configuration.epsilon,
        juliaBound: this.configuration.juliaBound,
        numeratorCoefficients: null,
        numeratorNbCoefficients: null,
        denominatorCoefficients: null,
        denominatorNbCoefficients: null,
        juliaHSV: this.configuration.juliaHSV,
        defaultHue: null,
        defaultColorParameters: null,
        infinityHue: null,
        infinityColorParameters: null,
        nbAttractors: null,
        attractorsComplex: null,
        attractorsHue: null,
        attractorsColorParameters: null,
      },
      error: null,
    };
  },
  computed: {
    coordinatesCenter() {
      return new Float32Array([
        this.configuration.coordinatesCenter.re,
        this.configuration.coordinatesCenter.im,
      ]);
    },
    numeratorCoefficients() {
      if (this.configuration.functionType == "DEFAULT") {
        return this.configuration.polynomial;
      } else if (this.configuration.functionType == "NEWTON") {
        return this.configuration.polynomial.getNewtonNumerator(
          this.configuration.newtonCoefficient
        );
      }
    },
    numeratorNbCoefficients() {
      return this.numeratorCoefficients.getCoefficientPowers().length;
    },
    denominatorCoefficients() {
      if (this.configuration.functionType == "DEFAULT") {
        return new Polynomial({
          0: new Complex(1, 0),
        });
      } else if (this.configuration.functionType == "NEWTON") {
        return this.configuration.polynomial.getDerivative();
      }
    },
    denominatorNbCoefficients() {
      return this.denominatorCoefficients.getCoefficientPowers().length;
    },
    defaultHue() {
      return this.configuration.defaultAttractor.hue;
    },
    defaultColorParameters() {
      return new Float32Array([
        this.configuration.defaultAttractor.saturationStrength,
        this.configuration.defaultAttractor.saturationOffset,
        this.configuration.defaultAttractor.valueStrength,
        this.configuration.defaultAttractor.valueOffset,
      ]);
    },
    infinityHue() {
      return this.configuration.infinityAttractor.hue;
    },
    infinityColorParameters() {
      return new Float32Array([
        this.configuration.infinityAttractor.saturationStrength,
        this.configuration.infinityAttractor.saturationOffset,
        this.configuration.infinityAttractor.valueStrength,
        this.configuration.infinityAttractor.valueOffset,
      ]);
    },
    nbAttractors() {
      return this.configuration.attractors.length;
    },
    attractorsComplex() {
      const flattenedArray = [];
      this.configuration.attractors.forEach((attractor) => {
        flattenedArray.push(attractor.complex.re, attractor.complex.im);
      });
      for (let i = flattenedArray.length; i < 2 * (Polynomial.MAX_DEGREE + 1); i++) {
        flattenedArray.push(0);
      }
      return new Float32Array(flattenedArray);
    },
    attractorsHue() {
      const flattenedArray = [];
      this.configuration.attractors.forEach((attractor) => {
        flattenedArray.push(attractor.hue);
      });
      for (let i = flattenedArray.length; i <= Polynomial.MAX_DEGREE; i++) {
        flattenedArray.push(0);
      }
      return new Float32Array(flattenedArray);
    },
    attractorsColorParameters() {
      const flattenedArray = [];
      this.configuration.attractors.forEach((attractor) => {
        flattenedArray.push(
          attractor.saturationStrength,
          attractor.saturationOffset,
          attractor.valueStrength,
          attractor.valueOffset
        );
      });
      for (let i = flattenedArray.length; i < 4 * (Polynomial.MAX_DEGREE + 1); i++) {
        flattenedArray.push(0);
      }
      return new Float32Array(flattenedArray);
    },
    fps() {
      if (this.fractalEngine == null) {
        return 0;
      }
      return Math.round(this.fractalEngine.fps);
    },
  },
  watch: {
    "configuration.resolutionScale"(newResolutionScale) {
      this.parameters.resolutionScale = newResolutionScale;
    },
    "configuration.coordinatesScale"(newCoordinatesScale) {
      this.parameters.coordinatesScale = newCoordinatesScale;
    },
    "configuration.coordinatesCenter"(_) {
      this.parameters.coordinatesCenter = this.coordinatesCenter;
    },
    "configuration.nbIterations"(newNbIterations) {
      this.parameters.nbIterations = newNbIterations;
    },
    "configuration.epsilon"(newEpsilon) {
      this.parameters.epsilon = newEpsilon;
    },
    "configuration.juliaBound"(newJuliaBound) {
      this.parameters.juliaBound = newJuliaBound;
    },
    "configuration.polynomial": {
      handler(_) {
        this.parameters.numeratorCoefficients = this.numeratorCoefficients;
        this.parameters.numeratorNbCoefficients = this.numeratorNbCoefficients;
        this.parameters.denominatorCoefficients = this.denominatorCoefficients;
        this.parameters.denominatorNbCoefficients = this.denominatorNbCoefficients;
      },
      deep: true,
    },
    "configuration.functionType"(_) {
      this.parameters.numeratorCoefficients = this.numeratorCoefficients;
      this.parameters.numeratorNbCoefficients = this.numeratorNbCoefficients;
      this.parameters.denominatorCoefficients = this.denominatorCoefficients;
      this.parameters.denominatorNbCoefficients = this.denominatorNbCoefficients;
    },
    "configuration.newtonCoefficient"(_) {
      this.parameters.numeratorCoefficients = this.numeratorCoefficients;
    },
    "configuration.juliaHSV"(newJuliaHSV) {
      this.parameters.juliaHSV = newJuliaHSV;
    },
    "configuration.defaultAttractor": {
      handler(_) {
        this.parameters.defaultHue = this.defaultHue;
        this.parameters.defaultColorParameters = this.defaultColorParameters;
      },
      deep: true,
    },
    "configuration.infinityAttractor": {
      handler(_) {
        this.parameters.infinityHue = this.infinityHue;
        this.parameters.infinityColorParameters = this.infinityColorParameters;
      },
      deep: true,
    },
    "configuration.attractors": {
      handler(_) {
        this.parameters.nbAttractors = this.nbAttractors;
        this.parameters.attractorsComplex = this.attractorsComplex;
        this.parameters.attractorsHue = this.attractorsHue;
        this.parameters.attractorsColorParameters = this.attractorsColorParameters;
      },
      deep: true,
    },
  },
  mounted() {
    // Initialize parameters
    this.parameters.coordinatesCenter = this.coordinatesCenter;
    this.parameters.numeratorCoefficients = this.numeratorCoefficients;
    this.parameters.numeratorNbCoefficients = this.numeratorNbCoefficients;
    this.parameters.denominatorCoefficients = this.denominatorCoefficients;
    this.parameters.denominatorNbCoefficients = this.denominatorNbCoefficients;
    this.parameters.defaultHue = this.defaultHue;
    this.parameters.defaultColorParameters = this.defaultColorParameters;
    this.parameters.infinityHue = this.infinityHue;
    this.parameters.infinityColorParameters = this.infinityColorParameters;
    this.parameters.nbAttractors = this.nbAttractors;
    this.parameters.attractorsComplex = this.attractorsComplex;
    this.parameters.attractorsHue = this.attractorsHue;
    this.parameters.attractorsColorParameters = this.attractorsColorParameters;

    // Initialize fractal engine
    this.fractalEngine = new FractalEngine(this.$refs.animationCanvas, this.parameters);

    // Try to display the scene
    try {
      this.fractalEngine.displayScene(this.parameters.resolutionScale);
    } catch (error) {
      this.error = error;
      console.error(error);
    }
  },
  methods: {
    updatePaused() {
      this.parameters.paused = !this.parameters.paused;
    },
  },
  components: { AnimationOverlay },
};
</script>

<template>
  <div id="animationFrame" ref="animationFrame">
    <canvas id="animationCanvas" ref="animationCanvas"></canvas>
    <AnimationOverlay
      v-if="error == null"
      :fps="fps"
      @fullscreen="$refs.animationFrame.requestFullscreen()"
      @pause="updatePaused"
      @unpause="updatePaused"
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
