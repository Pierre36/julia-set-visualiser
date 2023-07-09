import vertexShaderSource from "../assets/shaders/vertex_shader.vs?raw";
import fragmentShaderSource from "../assets/shaders/fragment_shader.fs?raw";

export { FractalEngine };

const last10FPS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

/**
 * Implementation of a fractal engine.
 */
class FractalEngine {
  /**
   * Fractal Engine constructor
   * @param {Object} canvas The canvas of the animation.
   * @param {Object} parameters The parameters of the animation.
   */
  constructor(canvas, parameters) {
    this.canvas = canvas;
    this.parameters = parameters;
    this.fps = 0;
  }

  /**
   * Load WebGL2 from the canvas.
   * @throws An exception if it is unable to load WebGL2.
   */
  loadWebGL() {
    this.gl = this.canvas.getContext("webgl2", {
      alpha: false,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (this.gl === null) {
      throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
  }

  /**
   * Load a shader from its source.
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
   * Initialize the viewport for the animation.
   * @param {Number} resolutionScale the scale of the resolution.
   */
  createViewport(resolutionScale) {
    this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio * resolutionScale;
    this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio * resolutionScale;
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  /**
   * Set the position attributes in the shader program.
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
   * Load the uniform locations in the shader program.
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
   * Sets the values of the uniforms.
   * @param {Number} time The animation time in milliseconds.
   */
  setUniformValues(time) {
    this.gl.uniform1f(this.uniformLocations.coordinatesScale, this.parameters.coordinatesScale);
    this.gl.uniform2fv(this.uniformLocations.coordinatesCenter, this.parameters.coordinatesCenter);
    this.gl.uniform1i(this.uniformLocations.nbIterations, this.parameters.nbIterations);
    this.gl.uniform1f(this.uniformLocations.epsilon, this.parameters.epsilon);
    this.gl.uniform1f(this.uniformLocations.juliaBound, this.parameters.juliaBound);
    this.gl.uniform1f(
      this.uniformLocations.dimensionRatio,
      this.canvas.clientWidth / this.canvas.clientHeight
    );
    this.gl.uniform1i(
      this.uniformLocations.numeratorNbCoefficients,
      this.parameters.numeratorNbCoefficients
    );
    this.gl.uniform3fv(
      this.uniformLocations.numeratorCoefficients,
      this.parameters.numeratorCoefficients.toFloat32ArrayAtTime(time)
    );
    this.gl.uniform1i(
      this.uniformLocations.denominatorNbCoefficients,
      this.parameters.denominatorNbCoefficients
    );
    this.gl.uniform3fv(
      this.uniformLocations.denominatorCoefficients,
      this.parameters.denominatorCoefficients.toFloat32ArrayAtTime(time)
    );
    this.gl.uniform3fv(this.uniformLocations.juliaHSV, this.parameters.juliaHSV);
    this.gl.uniform1f(this.uniformLocations.defaultHue, this.parameters.defaultHue);
    this.gl.uniform4fv(
      this.uniformLocations.defaultColorParameters,
      this.parameters.defaultColorParameters
    );
    this.gl.uniform1f(this.uniformLocations.infinityHue, this.parameters.infinityHue);
    this.gl.uniform4fv(
      this.uniformLocations.infinityColorParameters,
      this.parameters.infinityColorParameters
    );
    this.gl.uniform1i(this.uniformLocations.nbAttractors, this.parameters.nbAttractors);
    this.gl.uniform2fv(this.uniformLocations.attractors, this.parameters.attractorsComplex);
    this.gl.uniform1fv(this.uniformLocations.attractorsHue, this.parameters.attractorsHue);
    this.gl.uniform4fv(
      this.uniformLocations.attractorsColorParameters,
      this.parameters.attractorsColorParameters
    );
  }

  /**
   * Render the current frame.
   * @param {Number} time The animation time in milliseconds.
   * @param {Number} delay The delay time in milliseconds.
   * @param {Number} nbFrames The number of frames since the beginning of the animation.
   */
  render(time, delay, nbFrames) {
    // Set uniforms
    this.setUniformValues(time - delay);

    // Draw the scene
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    // Render next frame
    requestAnimationFrame((newTime) => {
      this.fps -= last10FPS[nbFrames % 10] / 10;
      last10FPS[nbFrames % 10] = 1000 / (newTime - time);
      this.fps += last10FPS[nbFrames % 10] / 10;
      if (this.parameters.paused) {
        this.render(newTime, delay + newTime - time, nbFrames + 1);
      } else {
        this.render(newTime, delay, nbFrames + 1);
      }
    });
  }

  /**
   * Display a scene in the canvas using WebGL2, the shader sources and parameters.
   */
  displayScene(resolutionScale) {
    this.loadWebGL();
    this.initShaderProgram();
    this.createViewport(resolutionScale);
    this.setPositionAttributes();
    this.gl.useProgram(this.program);
    this.loadUniformLocations();
    this.setUniformValues(0);
    requestAnimationFrame((time) => this.render(time, 0, 0, 0));
  }
}
