<script>
import { displayScene } from "../graphics";
import vertexShaderSource from "../assets/shaders/vertex_shader.vs?raw";
import fragmentShaderSource from "../assets/shaders/fragment_shader.fs?raw";
import { Configuration } from "../models/Configuration";
import { Polynomial } from "../models/Polynomial";
import { Complex } from "../models/Complex";

export default {
  name: "AnimationFrame",
  props: {
    configuration: { type: Configuration, required: true },
  },
  data() {
    return {
      parameters: {
        paused: false,
        resolutionScale: this.configuration.resolutionScale,
        coordinatesScale: this.configuration.coordinatesScale,
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
    numeratorCoefficients() {
      if (this.configuration.functionType == "DEFAULT") {
        return this.configuration.polynomial;
      } else if (this.configuration.functionType == "NEWTON") {
        return this.configuration.polynomial.getNewtonNumerator();
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
  },
  watch: {
    "configuration.resolutionScale"(newResolutionScale) {
      this.parameters.resolutionScale = newResolutionScale;
    },
    "configuration.coordinatesScale"(newCoordinatesScale) {
      this.parameters.coordinatesScale = newCoordinatesScale;
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
        this.parameters.infinityColorParameterss = this.infinityColorParameterss;
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
    const shaderSources = {
      vertex: vertexShaderSource,
      fragment: fragmentShaderSource,
    };
    try {
      displayScene(this.$refs.animationCanvas, shaderSources, this.parameters);
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
};
</script>

<template>
  <div id="animationFrame">
    <canvas id="animationCanvas" ref="animationCanvas"></canvas>
    <div id="animationMenu" v-if="error == null">
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
    <div id="errorMessage" v-if="error != null">
      <h2>Error</h2>
      <hr />
      <p>{{ error }}</p>
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
