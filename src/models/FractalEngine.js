import vertexShaderSource from "../assets/shaders/vertex_shader.vs?raw";
import fragmentShaderSource from "../assets/shaders/fragment_shader.fs?raw";
import { Polynomial } from "./Polynomial";
import { FractalFunction } from "./FractalFunction";

export { FractalEngine };

const last10FPS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

/**
 * Implementation of a fractal engine.
 */
class FractalEngine {
  /**
   * Fractal Engine constructor
   * @param {Object} canvas The canvas of the animation.
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.fractalFunction = null;
    this.fps = 0;
    this.paused = false;
    this.animationTime = 0;
  }

  /**
   * Pauses the animation.
   */
  pause() {
    this.paused = true;
  }

  /**
   * Unpauses the animation.
   */
  unpause() {
    this.paused = false;
  }

  /**
   * Resets the animation time to 0.
   */
  resetAnimationTime() {
    this.animationTime = 0;
  }

  /**
   * Loads WebGL2 from the canvas.
   * @throws An exception if it is unable to load WebGL2.
   */
  loadWebGL() {
    this.gl = this.canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (this.gl === null) {
      throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
  }

  /**
   * Loads a shader from its source.
   * @param {Number} type The type of shader.
   * @param {String} source The shader program.
   * @returns {WebGLShader} The shader.
   * @throws An exception if it is unable to compile the shader.
   */
  loadShader(type, source) {
    // Load the source in a shader
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);

    // Compile the shader program
    this.gl.compileShader(shader);

    // Check for compilation errors
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = new Error(
        `An error occurred compiling the shaders: ${this.gl.getShaderInfoLog(shader)}`
      );
      this.gl.deleteShader(shader);
      throw error;
    }

    return shader;
  }

  /**
   * Initializes the shader program with the shader sources.
   * @returns {WebGLProgram} The shader program.
   * @throws An exception if it is unable to create the program.
   */
  initShaderProgram() {
    // Load the shaders
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create the shader program
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    // Check for compilation or linking errors
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw new Error(
        `Unable to initialize the shader program: ${this.gl.getProgramInfoLog(this.program)}`
      );
    }
  }

  /**
   * Initializes the viewport for the animation.
   * @param {Number} resolutionScale the scale of the resolution.
   */
  createViewport(resolutionScale) {
    this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio * resolutionScale;
    this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio * resolutionScale;
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    if (this.paused) {
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  /**
   * Sets the position attributes in the shader program.
   */
  setPositionAttributes() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]),
      this.gl.STATIC_DRAW
    );
    const vertexPositionAttribute = this.gl.getAttribLocation(this.program, "vertexPosition");
    this.gl.vertexAttribPointer(vertexPositionAttribute, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(vertexPositionAttribute);
  }

  /**
   * Loads the uniform locations in the shader program.
   */
  loadUniformLocations() {
    this.uniformLocations = {
      dimensionRatio: this.gl.getUniformLocation(this.program, "dimensionRatio"),
      coordinatesScale: this.gl.getUniformLocation(this.program, "coordinatesScale"),
      coordinatesCenter: this.gl.getUniformLocation(this.program, "coordinatesCenter"),
      nbIterations: this.gl.getUniformLocation(this.program, "nbIterations"),
      epsilon: this.gl.getUniformLocation(this.program, "epsilon"),
      juliaBound: this.gl.getUniformLocation(this.program, "juliaBound"),
      numeratorNbCoefficients: this.gl.getUniformLocation(this.program, "numeratorNbCoefficients"),
      numeratorCoefficients: this.gl.getUniformLocation(this.program, "numeratorCoefficients"),
      denominatorNbCoefficients: this.gl.getUniformLocation(
        this.program,
        "denominatorNbCoefficients"
      ),
      denominatorCoefficients: this.gl.getUniformLocation(this.program, "denominatorCoefficients"),
      juliaHSV: this.gl.getUniformLocation(this.program, "juliaHSV"),
      defaultHue: this.gl.getUniformLocation(this.program, "defaultHue"),
      defaultColorParameters: this.gl.getUniformLocation(this.program, "defaultColorParameters"),
      infinityHue: this.gl.getUniformLocation(this.program, "infinityHue"),
      infinityColorParameters: this.gl.getUniformLocation(this.program, "infinityColorParameters"),
      nbAttractors: this.gl.getUniformLocation(this.program, "nbAttractors"),
      attractors: this.gl.getUniformLocation(this.program, "attractors"),
      attractorsHue: this.gl.getUniformLocation(this.program, "attractorsHue"),
      attractorsColorParameters: this.gl.getUniformLocation(
        this.program,
        "attractorsColorParameters"
      ),
    };
  }

  /**
   * Updates the dimension ratio.
   */
  updateDimensionRatio() {
    this.gl.uniform1f(
      this.uniformLocations.dimensionRatio,
      this.canvas.clientWidth / this.canvas.clientHeight
    );
  }

  /**
   * Sets the coordinates scale.
   * @param {Number} newCoordinatesScale The new scale of the coordinates.
   */
  setCoordinatesScale(newCoordinatesScale) {
    this.gl.uniform1f(this.uniformLocations.coordinatesScale, newCoordinatesScale);
    if (this.paused) {
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  /**
   * Sets the coordinates center.
   * @param {Number} newCoordinatesCenter The new center of the coordinates.
   */
  setCoordinatesCenter(newCoordinatesCenter) {
    this.gl.uniform2fv(
      this.uniformLocations.coordinatesCenter,
      new Float32Array([newCoordinatesCenter.re, newCoordinatesCenter.im])
    );
    if (this.paused) {
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  /**
   * Sets the number of iterations.
   * @param {Number} newNbIterations The new number of iterations.
   */
  setNbIterations(newNbIterations) {
    this.gl.uniform1i(this.uniformLocations.nbIterations, newNbIterations);
    if (this.paused) {
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  /**
   * Sets the epsilon value.
   * @param {Number} newEpsilon The new epsilon value.
   */
  setEpsilon(newEpsilon) {
    this.gl.uniform1f(this.uniformLocations.epsilon, newEpsilon);
    if (this.paused) {
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  /**
   * Sets the Julia bound.
   * @param {Number} newJuliaBound The new Julia bound.
   */
  setJuliaBound(newJuliaBound) {
    this.gl.uniform1f(this.uniformLocations.juliaBound, newJuliaBound);
    if (this.paused) {
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  /**
   * Sets the Julia HSV.
   * @param {Number} newJuliaHSV The new Julia HSV.
   */
  setJuliaHSV(newJuliaHSV) {
    this.gl.uniform3fv(this.uniformLocations.juliaHSV, newJuliaHSV);
    if (this.paused) {
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  /**
   * Sets the default attractor parameters.
   * @param {Attractor} newDefaultAttractor The new default attractor.
   */
  setDefaultAttractor(newDefaultAttractor) {
    this.gl.uniform1f(this.uniformLocations.defaultHue, newDefaultAttractor.hue);
    this.gl.uniform4fv(
      this.uniformLocations.defaultColorParameters,
      new Float32Array([
        newDefaultAttractor.saturationStrength,
        newDefaultAttractor.saturationOffset,
        newDefaultAttractor.valueStrength,
        newDefaultAttractor.valueOffset,
      ])
    );
    if (this.paused) {
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  /**
   * Sets the infinity attractor parameters.
   * @param {Attractor} newInfinityAttractor The new infinity attractor.
   */
  setInfinityAttractor(newInfinityAttractor) {
    this.gl.uniform1f(this.uniformLocations.infinityHue, newInfinityAttractor.hue);
    this.gl.uniform4fv(
      this.uniformLocations.infinityColorParameters,
      new Float32Array([
        newInfinityAttractor.saturationStrength,
        newInfinityAttractor.saturationOffset,
        newInfinityAttractor.valueStrength,
        newInfinityAttractor.valueOffset,
      ])
    );
    if (this.paused) {
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  /**
   * Sets the fractal function.
   * @param {FractalFunction} newFractalFunction The new fractal function.
   */
  setFractalFunction(newFractalFunction) {
    this.fractalFunction = newFractalFunction;
    if (this.paused) {
      this.updateFractalFunction();
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  /**
   * Updates the fractal function.
   */
  updateFractalFunction() {
    this.fractalFunction.updateWithTime(this.animationTime);
    this.gl.uniform1i(
      this.uniformLocations.numeratorNbCoefficients,
      this.fractalFunction.getNumeratorNbCoefficients()
    );
    this.gl.uniform3fv(
      this.uniformLocations.numeratorCoefficients,
      this.fractalFunction.getNumeratorArray()
    );
    this.gl.uniform1i(
      this.uniformLocations.denominatorNbCoefficients,
      this.fractalFunction.getDenominatorNbCoefficients()
    );
    this.gl.uniform3fv(
      this.uniformLocations.denominatorCoefficients,
      this.fractalFunction.getDenominatorArray()
    );
  }

  /**
   * Sets the attractors.
   * @param {Array<Attractor>} newAttractors The new attractors.
   */
  setAttractors(newAttractors) {
    this.gl.uniform1i(this.uniformLocations.nbAttractors, newAttractors.length);
    const complex = [];
    const hue = [];
    const colorParameters = [];
    newAttractors.forEach((attractor) => {
      complex.push(attractor.complex.re, attractor.complex.im);
      hue.push(attractor.hue);
      colorParameters.push(
        attractor.saturationStrength,
        attractor.saturationOffset,
        attractor.valueStrength,
        attractor.valueOffset
      );
    });
    for (let i = newAttractors.length; i <= Polynomial.MAX_DEGREE; i++) {
      complex.push(0, 0);
      hue.push(0);
      colorParameters.push(0, 0, 0, 0);
    }
    this.gl.uniform2fv(this.uniformLocations.attractors, new Float32Array(complex));
    this.gl.uniform1fv(this.uniformLocations.attractorsHue, new Float32Array(hue));
    this.gl.uniform4fv(
      this.uniformLocations.attractorsColorParameters,
      new Float32Array(colorParameters)
    );
  }

  /**
   * Initializes the values of the uniforms.
   * @param {Configuration} configuration The configuration of the animation.
   */
  initUniformValues(configuration) {
    this.updateDimensionRatio();
    this.setCoordinatesScale(configuration.coordinatesScale);
    this.setCoordinatesCenter(configuration.coordinatesCenter);
    this.setNbIterations(configuration.nbIterations);
    this.setEpsilon(configuration.epsilon);
    this.setJuliaBound(configuration.juliaBound);
    this.setJuliaHSV(configuration.juliaHSV);
    this.setDefaultAttractor(configuration.defaultAttractor);
    this.setInfinityAttractor(configuration.infinityAttractor);
  }

  /**
   * Updates the fps.
   * @param {Number} frameDuration The duration of the frame in milliseconds.
   * @param {Number} nbFrames The number of frames since the beginning of the animation.
   */
  updateFPS(frameDuration, nbFrames) {
    let frameFPS = 1000 / (10 * frameDuration);
    if (frameFPS == Infinity) {
      frameFPS = 0;
    }
    this.fps = this.fps - last10FPS[nbFrames % 10] + frameFPS;
    last10FPS[nbFrames % 10] = frameFPS;
  }

  /**
   * Renders the current frame.
   * @param {Number} time The animation time in milliseconds.
   * @param {Number} timeIncrement The increment of the animation time.
   * @param {Number} nbFrames The number of frames since the beginning of the animation.
   */
  render(time, timeIncrement, nbFrames) {
    // Update animation time
    this.animationTime += timeIncrement;

    if (!this.paused) {
      // Update the fractal function
      this.updateFractalFunction();

      // Draw the scene
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
    // Render next frame
    requestAnimationFrame((newTime) => {
      const frameDuration = newTime - time;
      this.updateFPS(frameDuration, nbFrames);
      this.render(newTime, this.paused ? 0 : frameDuration, nbFrames + 1);
    });
  }

  /**
   * Displays a scene in the canvas using WebGL2, the shader sources and parameters.
   * @param {Configuration} configuration The configuration of the animation.
   */
  displayScene(configuration) {
    this.loadWebGL();
    this.initShaderProgram();
    this.createViewport(configuration.resolutionScale);
    this.setPositionAttributes();
    this.gl.useProgram(this.program);
    this.loadUniformLocations();
    this.setFractalFunction(configuration.fractalFunction);
    this.initUniformValues(configuration);
    requestAnimationFrame((time) => this.render(time, 0, 0, 0));
  }
}
