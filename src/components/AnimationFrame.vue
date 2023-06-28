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
      isFullscreen: false,
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
    document.addEventListener("fullscreenchange", () => {
      this.isFullscreen = !this.isFullscreen;
    });
  },
  methods: {
    updatePaused() {
      this.parameters.paused = !this.parameters.paused;
    },
    updateFullscreen() {
      if (this.isFullscreen) {
        document.exitFullscreen();
      } else {
        this.$refs.animationFrame.requestFullscreen();
      }
    },
  },
};
</script>

<template>
  <div id="animationFrame" ref="animationFrame">
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
      <button id="fullscreenButton" class="icon-button" @click="updateFullscreen">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
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
  --button-size: 2.5rem;
  --button-padding: 0.5rem;
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: calc(50% - (var(--button-size) + var(--button-padding)) / 2) max-content auto max-content;
  align-items: center;
  padding-bottom: 0.5rem;
  padding-top: 2rem;
  background: linear-gradient(hsla(0, 0%, 0%, 0) 0%, hsla(0, 0%, 0%, 0.3) 100%);
  visibility: hidden;
}

#animationFrame:hover #animationMenu {
  visibility: visible;
}

#pauseButton,
#fullscreenButton {
  --button-border-radius: 50%;
  --button-color: var(--gray-100);
  --button-color-hover: var(--gray-100);
  --button-color-active: var(--gray-100);
  --button-background-color-hover: hsla(0, 0%, 10%, 0.9);
  --button-background-color-active: hsla(0, 0%, 10%, 0.9);
  padding: var(--button-padding);
}

#pauseButton svg,
#fullscreenButton svg {
  width: var(--button-size);
  height: var(--button-size);
}

#pauseButton {
  grid-column: 2;
}

#fullscreenButton {
  grid-column: 4;
  margin-right: 0.5rem;
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
