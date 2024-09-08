import vertexShaderSource from "@/shaders/vertex_shader.wgsl?raw";
import fragmentShaderSource from "@/shaders/fragment_shader.wgsl?raw";
import { Polynomial } from "@/models/Polynomial";
import { Configuration } from "@/models/Configuration";
import { Complex } from "@/models/Complex";
import { FractalFunction } from "@/models/FractalFunction";
import { Attractor } from "@/models/Attractor";

export { WebGpuFractalGenerator };

const NB_VERTICES = 6;

// TODO Add more logging
// TODO Handle the pause better (refresh the canvas)
// TODO Try to find a way to generalise uniforms update

/**
 * Implementation of a fractal engine using WebGPU.
 */
class WebGpuFractalGenerator {
  // NOTE This is only necessary because the fractal function needs to be updated with time
  /** @type {FractalFunction} Fractal function to use for the animation */
  _fractalFunction;

  /** @type {Number} Animation time (in milliseconds) i.e. the time used for the function */
  _animationTime;

  /** @type {Boolean} `true` if the animation is paused, `false` otherwise */
  _paused;

  /** @type {Number} Number of frame per second of the animation */
  fps;

  /** @type {Array<Number>} Last 10 FPS to get the average FPS from */
  _last10FPS;

  /** @type {HTMLCanvasElement} Animation canvas */
  _canvas;

  /** @type {GPUDevice} GPU device from WebGPU API */
  _gpuDevice;

  /** @type {GPUCanvasContext} WebGPU context object */
  _context;

  /** @type {GPUBuffer} Buffer for the vertices used by the vertex shader */
  _vertexBuffer;

  /** @type {Float32Array} Values of the viewport uniforms (dimension ratio, scale and center) */
  _viewportUniformsValues;

  /** @type {GPUBuffer} Buffer for the viewport uniforms (dimension ratio, scale and center) */
  _viewportUniformsBuffer;

  /**
   * @type {Int32Array} Values of the function uniforms (number of coefficients in the numerator,
   * number of coefficients in the denominator)
   */
  _functionUniformsValues;

  /**
   * @type {GPUBuffer} Buffer for the function uniforms (number of coefficients in the numerator,
   * number of coefficients in the denominator)
   */
  _functionUniformsBuffer;

  /** @type {Float32Array} Values of the function storage (numerator and denominator) */
  _functionStorageValues;

  /** @type {GPUBuffer} Buffer for the function storage (numerator and denominator) */
  _functionStorageBuffer;

  /**
   * @type {ArrayBuffer} Values of the fractal uniforms (iterations count, epsilon, Julia set
   * bound, Julia set HSV, default attractor colour, infinity attractor colour)
   */
  _fractalUniformsValues;

  /**
   * @type {GPUBuffer} Buffer for the fractal uniforms (iterations count, epsilon, Julia set bound,
   * Julia set HSV, default attractor colour, infinity attractor colour)
   */
  _fractalUniformsBuffer;

  /**
   * @type {Float32Array} Values of the attractors storage (complex number and colour parameters)
   */
  _attractorsStorageValues;

  /**
   * @type {GPUBuffer} Buffer for the attractors storage (complex number and colour parameters)
   */
  _attractorsStorageBuffer;

  /** @type {GPUBindGroup} WebGPU bind group defining the resources bindings */
  _bindGroup;

  /** @type {GPURenderPipeline} WebGPU pipeline responsible of the fractal animation rendering */
  _fractalPipeline;

  /**
   * Fractal Generator constructor
   *
   * @param {HTMLCanvasElement} canvas canvas of the animation
   */
  constructor(canvas) {
    this.paused = false;
    this._animationTime = 0;
    this.fps = 0;
    this._last10FPS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this._canvas = canvas;
  }

  /**
   * Set the fractal function
   *
   * @param {FractalFunction} newFractalFunction new fractal function to use for the animation
   */
  setFractalFunction(newFractalFunction) {
    this._fractalFunction = newFractalFunction;
    // TODO Uncomment when possible because it is important to do this, especially the number of coefficients
    // this.updateFunctionUniforms();
    // this.updateFunctionStorage();
  }

  /**
   * Update the canvas resolution
   *
   * @param {Number} resolutionScale scale for the resolution of the canvas (1 is the resolution of the canvas)
   */
  updateCanvasResolution(resolutionScale) {
    this._canvas.width = this._canvas.clientWidth * window.devicePixelRatio * resolutionScale;
    this._canvas.height = this._canvas.clientHeight * window.devicePixelRatio * resolutionScale;
  }

  /**
   * Update the viewport dimension ratio
   */
  updateViewportDimensionRatio() {
    this._viewportUniformsValues.set([this._canvas.clientWidth / this._canvas.clientHeight], 0);
    this._gpuDevice.queue.writeBuffer(
      this._viewportUniformsBuffer,
      0,
      this._viewportUniformsValues
    );
  }

  /**
   * Update the viewport scale i.e. the scaling factor used for the grid coordinates
   *
   * @param {Number} scale scale of the coordinates
   */
  updateViewportScale(scale) {
    this._viewportUniformsValues.set([scale], 1);
    this._gpuDevice.queue.writeBuffer(
      this._viewportUniformsBuffer,
      0,
      this._viewportUniformsValues
    );
  }

  /**
   * Update the viewport center i.e. the coordinates of the center of the grid coordinates
   *
   * @param {Complex} center center of the coordinates
   */
  updateViewportCenter(center) {
    this._viewportUniformsValues.set([center.re, center.im], 2);
    this._gpuDevice.queue.writeBuffer(
      this._viewportUniformsBuffer,
      0,
      this._viewportUniformsValues
    );
  }

  /**
   * Update the function uniforms (number of coefficients in the numerator)
   */
  updateFunctionUniforms() {
    this._functionUniformsValues.set(
      [
        this._fractalFunction.getNumeratorNbCoefficients(),
        this._fractalFunction.getDenominatorNbCoefficients(),
      ],
      0
    );
    this._gpuDevice.queue.writeBuffer(
      this._functionUniformsBuffer,
      0,
      this._functionUniformsValues
    );
  }

  /**
   * Update the function storage (numerator and denominator)
   */
  updateFunctionStorage() {
    console.debug("[>>] Updating function storage with numerator and denominator");
    this._fractalFunction.updateWithTime(this._animationTime);
    this._functionStorageValues.set(this._fractalFunction.getNumeratorArray(), 0);
    this._functionStorageValues.set(
      this._fractalFunction.getDenominatorArray(),
      (Polynomial.MAX_DEGREE + 1) * 3
    );
    this._gpuDevice.queue.writeBuffer(this._functionStorageBuffer, 0, this._functionStorageValues);
    console.debug("[OK] Updated function storage with [%s]", this._functionStorageValues);
  }

  /**
   * Update the iterations count
   *
   * @param {Number} iterationsCount number of iterations of the fractal function
   */
  updateIterationsCount(iterationsCount) {
    const uint32View = new Uint32Array(this._fractalUniformsValues);
    uint32View[0] = iterationsCount;
    this._gpuDevice.queue.writeBuffer(this._fractalUniformsBuffer, 0, this._fractalUniformsValues);
  }

  /**
   * Update the epsilon value
   *
   * @param {Number} epsilon value added to the complex number before computing its divergence
   */
  updateEpsilon(epsilon) {
    const float32View = new Float32Array(this._fractalUniformsValues);
    float32View.set([epsilon], 1);
    this._gpuDevice.queue.writeBuffer(this._fractalUniformsBuffer, 0, this._fractalUniformsValues);
  }

  /**
   * Update the Julia Set bound
   *
   * @param {Number} juliaBound highest value of log-divergence in the Fatou Set
   */
  updateJuliaBound(juliaBound) {
    const float32View = new Float32Array(this._fractalUniformsValues);
    float32View.set([juliaBound], 2);
    this._gpuDevice.queue.writeBuffer(this._fractalUniformsBuffer, 0, this._fractalUniformsValues);
  }

  /**
   * Update the Julia Set colour
   *
   * @param {Array<Number>} juliaHSV colour of the Julia Set in Hue Saturation Value notation
   */
  updateJuliaHSV(juliaHSV) {
    const float32View = new Float32Array(this._fractalUniformsValues);
    float32View.set(juliaHSV, 20);
    this._gpuDevice.queue.writeBuffer(this._fractalUniformsBuffer, 0, this._fractalUniformsValues);
  }

  /**
   * Update the default attractor colour parameters
   *
   * @param {Attractor} defaultAttractor default attractor (if no other attractor is closer)
   */
  updateDefaultAttractor(defaultAttractor) {
    const float32View = new Float32Array(this._fractalUniformsValues);
    float32View.set(
      [
        defaultAttractor.hue,
        defaultAttractor.saturationStrength,
        defaultAttractor.saturationOffset,
        defaultAttractor.valueStrength,
        defaultAttractor.valueOffset,
      ],
      4
    );
    this._gpuDevice.queue.writeBuffer(this._fractalUniformsBuffer, 0, this._fractalUniformsValues);
  }

  /**
   * Update the infinity attractor colour parameters
   *
   * @param {Attractor} infinityAttractor infinity attractor (for points converging towards infinity)
   */
  updateInfinityAttractor(infinityAttractor) {
    const float32View = new Float32Array(this._fractalUniformsValues);
    float32View.set(
      [
        infinityAttractor.hue,
        infinityAttractor.saturationStrength,
        infinityAttractor.saturationOffset,
        infinityAttractor.valueStrength,
        infinityAttractor.valueOffset,
      ],
      12
    );
    this._gpuDevice.queue.writeBuffer(this._fractalUniformsBuffer, 0, this._fractalUniformsValues);
  }

  /**
   * Update the attractors
   *
   * @param {Array<Attractor>} attractors the attractors
   */
  updateAttractors(attractors) {
    const uint32View = new Uint32Array(this._fractalUniformsValues);
    uint32View[3] = attractors.length;
    this._gpuDevice.queue.writeBuffer(this._fractalUniformsBuffer, 0, this._fractalUniformsValues);

    this._attractorsStorageValues.set(
      attractors.flatMap((attractor) => [
        attractor.complex.mod(),
        attractor.complex.arg(),
        attractor.hue,
        attractor.saturationStrength,
        attractor.saturationOffset,
        attractor.valueStrength,
        attractor.valueOffset,
      ]),
      0
    );
    this._gpuDevice.queue.writeBuffer(
      this._attractorsStorageBuffer,
      0,
      this._attractorsStorageValues
    );
  }

  /**
   * Load WebGPU API and request GPU device
   *
   * @throws an error if the browser does not support WebGPU or if an adapter could not be found
   */
  async _loadWebGPU() {
    if (!navigator.gpu) {
      throw new Error("Unable to initialize WebGPU. Your browser may not support it.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("Unable to initialize WebGPU. No appropriate GPUAdapter found.");
    }

    this._gpuDevice = await adapter.requestDevice();
  }

  /**
   * Initialise the GPU canvas context
   *
   * @param {String} canvasFormat canvas texture format, the value can be `rgba8unorm` or
   * `bgra8unorm`
   */
  _initContext(canvasFormat) {
    this._context = this._canvas.getContext("webgpu");
    this._context.configure({
      device: this._gpuDevice,
      format: canvasFormat,
    });
  }

  /**
   * Initialise the vertex buffer with vertices and write it the GPU device queue
   */
  _initVertexBuffer() {
    const vertices = new Float32Array([
      -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
    ]);
    this._vertexBuffer = this._gpuDevice.createBuffer({
      label: "Vertices",
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this._gpuDevice.queue.writeBuffer(this._vertexBuffer, 0, vertices);
  }

  /**
   * Create the bind group layout for the fractal pipeline
   *
   * @returns {GPUBindGroupLayout} the GPU bind group layout
   */
  _createBindGroupLayout() {
    return this._gpuDevice.createBindGroupLayout({
      label: "Fractal Bind Group Layout",
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {} },
        { binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: {} },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: "read-only-storage" },
        },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, buffer: {} },
        {
          binding: 4,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: "read-only-storage" },
        },
      ],
    });
  }

  /**
   * Initialise the viewport uniforms buffer (dimension ratio, scale and center)
   *
   * @param {Number} scale scale of the coordinates
   * @param {Complex} center center of the coordinates
   */
  _initViewportUniformsBuffer(scale, center) {
    this._viewportUniformsValues = new Float32Array(4);
    this._viewportUniformsBuffer = this._gpuDevice.createBuffer({
      label: "Viewport Uniforms",
      size: this._viewportUniformsValues.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.updateViewportDimensionRatio();
    this.updateViewportScale(scale);
    this.updateViewportCenter(center);
  }

  /**
   * Initialise the function uniforms buffer (number of numerator and denominator coefficients)
   */
  _initFunctionUniformsBuffer() {
    this._functionUniformsValues = new Int32Array(2);
    this._functionUniformsBuffer = this._gpuDevice.createBuffer({
      label: "Function Uniforms",
      size: this._functionUniformsValues.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.updateFunctionUniforms();
  }

  /**
   * Initialise the function storage (numerator and denominator)
   */
  _initFunctionStorage() {
    this._functionStorageValues = new Float32Array((Polynomial.MAX_DEGREE + 1) * 3 * 2);
    this._functionStorageBuffer = this._gpuDevice.createBuffer({
      label: "Function Storage",
      size: this._functionStorageValues.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    this.updateFunctionStorage();
  }

  /**
   * Initialise th fractal buffers (uniform and storage buffers)
   *
   * @param {Number} iterationsCount number of iterations
   * @param {Number} epsilon value added to the complex number before computing its divergence
   * @param {Number} juliaBound highest value of log-divergence in the Fatou Set
   * @param {Array<Number>} juliaHSV colour of the Julia Set in Hue Saturation Value notation
   * @param {Attractor} defaultAttractor default attractor (if no other attractor is closer)
   * @param {Attractor} infinityAttractor infinity attractor (for points converging towards infinity)
   * @param {Array<Attractor>} attractors the other attractors
   */
  _initFractalBuffers(
    iterationsCount,
    epsilon,
    juliaBound,
    juliaHSV,
    defaultAttractor,
    infinityAttractor,
    attractors
  ) {
    this._fractalUniformsValues = new ArrayBuffer(24 * 4);
    this._fractalUniformsBuffer = this._gpuDevice.createBuffer({
      label: "Fractal Uniforms",
      size: this._fractalUniformsValues.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this._attractorsStorageValues = new Float32Array((2 + 5) * 16);
    this._attractorsStorageBuffer = this._gpuDevice.createBuffer({
      label: "Attractors Storage",
      size: this._attractorsStorageValues.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    this.updateIterationsCount(iterationsCount);
    this.updateEpsilon(epsilon);
    this.updateJuliaBound(juliaBound);
    this.updateJuliaHSV(juliaHSV);
    this.updateDefaultAttractor(defaultAttractor);
    this.updateInfinityAttractor(infinityAttractor);
    this.updateAttractors(attractors);
  }

  /**
   * Initialise the bind group
   *
   * @param {BindGroupLayout} bindGroupLayout bind group layout to use
   * @param {Configuration} configuration fractal animation configuration
   */
  _initBindGroup(bindGroupLayout, configuration) {
    this._initViewportUniformsBuffer(
      configuration.coordinatesScale,
      configuration.coordinatesCenter
    );

    this._initFunctionUniformsBuffer();
    this._initFunctionStorage();

    this._initFractalBuffers(
      configuration.nbIterations,
      configuration.epsilon,
      configuration.juliaBound,
      configuration.juliaHSV,
      configuration.defaultAttractor,
      configuration.infinityAttractor,
      configuration.attractors
    );

    this._bindGroup = this._gpuDevice.createBindGroup({
      label: "Fractal renderer bind group",
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: this._viewportUniformsBuffer } },
        { binding: 1, resource: { buffer: this._functionUniformsBuffer } },
        { binding: 2, resource: { buffer: this._functionStorageBuffer } },
        { binding: 3, resource: { buffer: this._fractalUniformsBuffer } },
        { binding: 4, resource: { buffer: this._attractorsStorageBuffer } },
      ],
    });
  }

  /**
   * Creates the vertex shader module
   *
   * @returns {GPUShaderModule} the vertex shader module
   */
  _createVertexShaderModule() {
    return this._gpuDevice.createShaderModule({
      label: "Vertex shader",
      code: vertexShaderSource,
    });
  }

  /**
   * Creates the fragment shader module
   *
   * @returns {GPUShaderModule} the fragment shader module
   */
  _createFragmentShaderModule() {
    return this._gpuDevice.createShaderModule({
      label: "Fragment shader",
      code: fragmentShaderSource,
    });
  }

  /**
   * Initialise the fractal pipeline
   *
   * @param {String} canvasFormat canvas texture format, the value can be `rgba8unorm` or
   * `bgra8unorm`
   * @param {GPUBindGroupLayout} bindGroupLayout the bind group layout to use
   */
  _initFractalPipeline(canvasFormat, bindGroupLayout) {
    const pipelineLayout = this._gpuDevice.createPipelineLayout({
      label: "Fractal Pipeline Layout",
      bindGroupLayouts: [bindGroupLayout],
    });

    this._fractalPipeline = this._gpuDevice.createRenderPipeline({
      label: "Fractal pipeline",
      layout: pipelineLayout,
      vertex: {
        module: this._createVertexShaderModule(),
        entryPoint: "vertexMain",
        buffers: [
          {
            arrayStride: 8,
            attributes: [{ format: "float32x2", offset: 0, shaderLocation: 0 }],
          },
        ],
      },
      fragment: {
        module: this._createFragmentShaderModule(),
        entryPoint: "fragmentMain",
        targets: [{ format: canvasFormat }],
      },
    });
  }

  /**
   * Update the fps.
   * @param {Number} frameDuration duration of the frame in milliseconds.
   * @param {Number} nbFrames number of frames since the beginning of the animation.
   */
  _updateFPS(frameDuration, nbFrames) {
    let frameFPS = 1000 / (10 * frameDuration);
    if (frameFPS == Infinity) {
      frameFPS = 0;
    }
    this.fps = this.fps - this._last10FPS[nbFrames % 10] + frameFPS;
    this._last10FPS[nbFrames % 10] = frameFPS;
  }

  /**
   * Render the current frame
   *
   * @param {Number} time animation time in milliseconds
   * @param {Number} timeIncrement increment of the animation time
   * @param {Number} nbFrames number of frames since the beginning of the animation
   */
  _render(time, timeIncrement, nbFrames) {
    if (!this._paused) {
      this._animationTime += timeIncrement;

      const encoder = this._gpuDevice.createCommandEncoder();

      this.updateFunctionStorage();

      const renderPass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: this._context.getCurrentTexture().createView(),
            loadOp: "clear",
            clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
            storeOp: "store",
          },
        ],
      });
      renderPass.setPipeline(this._fractalPipeline);
      renderPass.setBindGroup(0, this._bindGroup);
      renderPass.setVertexBuffer(0, this._vertexBuffer);
      renderPass.draw(NB_VERTICES);
      renderPass.end();

      this._gpuDevice.queue.submit([encoder.finish()]);
    }

    requestAnimationFrame((newTime) => {
      const frameDuration = newTime - time;
      this._updateFPS(frameDuration, nbFrames);
      this._render(newTime, this.paused ? 0 : frameDuration, nbFrames + 1);
    });
  }

  /**
   * Initialise the Web GPU fractal generator and start the animation
   *
   * @param {Configuration} configuration
   */
  async initialise(configuration) {
    await this._loadWebGPU();

    this.setFractalFunction(configuration.fractalFunction);

    this.updateCanvasResolution(configuration.resolutionScale);

    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    this._initContext(canvasFormat);

    this._initVertexBuffer();

    const bindGroupLayout = this._createBindGroupLayout();

    this._initBindGroup(bindGroupLayout, configuration);

    this._initFractalPipeline(canvasFormat, bindGroupLayout);

    requestAnimationFrame((time) => this._render(time, 0, 0, 0));
  }

  /**
   * Pause the animation
   */
  pause() {
    this._paused = true;
  }

  /**
   * Unpause the animation
   */
  unpause() {
    this._paused = false;
  }

  /**
   * Reset the animation time to 0
   */
  resetAnimationTime() {
    this._animationTime = 0;
  }
}
