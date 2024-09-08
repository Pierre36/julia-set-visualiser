import vertexShaderSource from "@/shaders/vertex_shader.wgsl?raw";
import fragmentShaderSource from "@/shaders/fragment_shader.wgsl?raw";
import { Polynomial } from "@/models/Polynomial";
import { Configuration } from "@/models/Configuration";
import { Complex } from "@/models/Complex";
import { FractalFunction } from "@/models/FractalFunction";
import { Attractor } from "@/models/Attractor";
import { FractalGeneratorParameters } from "@/generators/FractalGeneratorParameters";

export { WebGpuFractalGenerator };

// TODO Handle the pause better (refresh the canvas)

/** @type {Number} Number of vertices to render */
const VERTICES_COUNT = 6;

/** @type {Readonly<Object>} Enumeration for the buffers names */
const BUFFERS_NAMES = Object.freeze({
  VERTEX: "VERTEX_BUFFER",
  VIEWPORT_UNIFORMS: "VIEWPORT_UNIFORMS_BUFFER",
  FUNCTION_UNIFORMS: "FUNCTION_UNIFORMS_BUFFER",
  FUNCTION_STORAGE: "FUNCTION_STORAGE_BUFFER",
  FRACTAL_UNIFORMS: "FRACTAL_UNIFORMS_BUFFER",
  ATTRACTORS_STORAGE: "ATTRACTORS_STORAGE_BUFFER",
});

/** @type {Readonly<Object>} Enumeration for the buffers views */
const BUFFERS_VIEWS = Object.freeze({
  UINT32: "UINT32",
  FLOAT32: "FLOAT32",
});

/**
 * @type {Map<String, {buffer: String, offset: Number, isArray: Boolean, view: String}>} Mapping between the parameters and their
 * buffers
 */
const BUFFER_MAPPING = new Map()
  .set(FractalGeneratorParameters.DIMENSION_RATIO, {
    buffer: BUFFERS_NAMES.VIEWPORT_UNIFORMS,
    offset: 0,
  })
  .set(FractalGeneratorParameters.COORDINATES_SCALE, {
    buffer: BUFFERS_NAMES.VIEWPORT_UNIFORMS,
    offset: 1,
  })
  .set(FractalGeneratorParameters.COORDINATES_CENTER, {
    buffer: BUFFERS_NAMES.VIEWPORT_UNIFORMS,
    offset: 2,
  })
  .set(FractalGeneratorParameters.NUMERATOR_COEFFICIENTS_COUNT, {
    buffer: BUFFERS_NAMES.FUNCTION_UNIFORMS,
    offset: 0,
  })
  .set(FractalGeneratorParameters.DENOMINATOR_COEFFICIENTS_COUNT, {
    buffer: BUFFERS_NAMES.FUNCTION_UNIFORMS,
    offset: 1,
  })
  .set(FractalGeneratorParameters.NUMERATOR, {
    buffer: BUFFERS_NAMES.FUNCTION_STORAGE,
    offset: 0,
    isArray: true,
  })
  .set(FractalGeneratorParameters.DENOMINATOR, {
    buffer: BUFFERS_NAMES.FUNCTION_STORAGE,
    offset: (Polynomial.MAX_DEGREE + 1) * 3,
    isArray: true,
  })
  .set(FractalGeneratorParameters.ITERATIONS_COUNT, {
    buffer: BUFFERS_NAMES.FRACTAL_UNIFORMS,
    offset: 0,
    view: BUFFERS_VIEWS.UINT32,
  })
  .set(FractalGeneratorParameters.EPSILON, {
    buffer: BUFFERS_NAMES.FRACTAL_UNIFORMS,
    offset: 1,
    view: BUFFERS_VIEWS.FLOAT32,
  })
  .set(FractalGeneratorParameters.JULIA_BOUND, {
    buffer: BUFFERS_NAMES.FRACTAL_UNIFORMS,
    offset: 2,
    view: BUFFERS_VIEWS.FLOAT32,
  })
  .set(FractalGeneratorParameters.ATTRACTORS_COUNT, {
    buffer: BUFFERS_NAMES.FRACTAL_UNIFORMS,
    offset: 3,
    view: BUFFERS_VIEWS.UINT32,
  })
  .set(FractalGeneratorParameters.DEFAULT_COLOUR, {
    buffer: BUFFERS_NAMES.FRACTAL_UNIFORMS,
    offset: 4,
    view: BUFFERS_VIEWS.FLOAT32,
    isArray: true,
  })
  .set(FractalGeneratorParameters.INFINITY_COLOUR, {
    buffer: BUFFERS_NAMES.FRACTAL_UNIFORMS,
    offset: 12,
    view: BUFFERS_VIEWS.FLOAT32,
    isArray: true,
  })
  .set(FractalGeneratorParameters.JULIA_HSV, {
    buffer: BUFFERS_NAMES.FRACTAL_UNIFORMS,
    offset: 20,
    view: BUFFERS_VIEWS.FLOAT32,
    isArray: true,
  })
  .set(FractalGeneratorParameters.ATTRACTORS, {
    buffer: BUFFERS_NAMES.ATTRACTORS_STORAGE,
    offset: 0,
    isArray: true,
  });

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

  /** @type {Map<String, {buffer: GPUBuffer, values: any, views: Map<String, any>}>} Map of buffers and their values */
  _buffers;

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
    this._buffers = new Map();
  }

  /**
   * Add a write buffer task to the GPU device queue
   *
   * @param {String} bufferName name of the buffer (see `BUFFERS_NAMES`)
   */
  _writeBuffer(bufferName) {
    this._gpuDevice.queue.writeBuffer(
      this._buffers.get(bufferName).buffer,
      0,
      this._buffers.get(bufferName).values
    );
  }

  /**
   * Update a parameter of the fractal generation
   *
   * @param {String} parameter key corresponding to the parameter (see {@link FractalGeneratorParameters})
   * @param {any} value value of the parameter
   */
  updateParameter(parameter, value) {
    const { buffer, offset, isArray, view } = BUFFER_MAPPING.get(parameter);

    let values;
    if (view) {
      values = this._buffers.get(buffer).views.get(view);
    } else {
      values = this._buffers.get(buffer).values;
    }

    if (isArray) {
      values.set(value, offset);
    } else {
      values[offset] = value;
    }

    this._writeBuffer(buffer);

    console.debug("[OK] Updated %s with value %s", parameter, value);
  }

  /**
   * Set the fractal function
   *
   * @param {FractalFunction} newFractalFunction new fractal function to use for the animation
   */
  setFractalFunction(newFractalFunction) {
    this._fractalFunction = newFractalFunction;

    this.updateParameter(
      FractalGeneratorParameters.NUMERATOR_COEFFICIENTS_COUNT,
      this._fractalFunction.getNumeratorNbCoefficients()
    );
    this.updateParameter(
      FractalGeneratorParameters.DENOMINATOR_COEFFICIENTS_COUNT,
      this._fractalFunction.getDenominatorNbCoefficients()
    );

    this._fractalFunction.updateWithTime(this._animationTime);
    this.updateParameter(
      FractalGeneratorParameters.NUMERATOR,
      this._fractalFunction.getNumeratorArray(),
      true
    );
    this.updateParameter(
      FractalGeneratorParameters.DENOMINATOR,
      this._fractalFunction.getDenominatorArray(),
      true
    );
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
    this.updateParameter(
      FractalGeneratorParameters.DIMENSION_RATIO,
      this._canvas.clientWidth / this._canvas.clientHeight
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
   * Initialise the buffers
   */
  _initBuffers() {
    this._initVertexBuffer();
    this._initViewportUniformsBuffer();
    this._initFunctionUniformsBuffer();
    this._initFunctionStorageBuffer();
    this._initFractalBuffers();
  }

  /**
   * Initialise the vertex buffer with vertices and write it the GPU device queue
   */
  _initVertexBuffer() {
    this._buffers.set(BUFFERS_NAMES.VERTEX, {
      buffer: this._gpuDevice.createBuffer({
        label: BUFFERS_NAMES.VERTEX,
        size: VERTICES_COUNT * 2 * 4,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      }),
      values: new Float32Array([-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0]),
    });
    this._writeBuffer(BUFFERS_NAMES.VERTEX);
  }

  /**
   * Initialise the viewport uniforms buffer (dimension ratio, scale and center)
   */
  _initViewportUniformsBuffer() {
    this._buffers.set(BUFFERS_NAMES.VIEWPORT_UNIFORMS, {
      buffer: this._gpuDevice.createBuffer({
        label: BUFFERS_NAMES.VIEWPORT_UNIFORMS,
        size: 4 * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
      values: new Float32Array(4),
    });
  }

  /**
   * Initialise the function uniforms buffer (number of numerator and denominator coefficients)
   */
  _initFunctionUniformsBuffer() {
    this._buffers.set(BUFFERS_NAMES.FUNCTION_UNIFORMS, {
      buffer: this._gpuDevice.createBuffer({
        label: BUFFERS_NAMES.FUNCTION_UNIFORMS,
        size: 2 * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
      values: new Int32Array(2),
    });
  }

  /**
   * Initialise the function storage buffer (numerator and denominator)
   */
  _initFunctionStorageBuffer() {
    this._buffers.set(BUFFERS_NAMES.FUNCTION_STORAGE, {
      buffer: this._gpuDevice.createBuffer({
        label: BUFFERS_NAMES.FUNCTION_STORAGE,
        size: (Polynomial.MAX_DEGREE + 1) * 3 * 2 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      }),
      values: new Float32Array((Polynomial.MAX_DEGREE + 1) * 3 * 2),
    });
  }

  /**
   * Initialise the fractal buffers (uniform and storage buffers)
   */
  _initFractalBuffers() {
    const arrayBuffer = new ArrayBuffer(24 * 4);
    this._buffers.set(BUFFERS_NAMES.FRACTAL_UNIFORMS, {
      buffer: this._gpuDevice.createBuffer({
        label: BUFFERS_NAMES.FRACTAL_UNIFORMS,
        size: arrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
      values: arrayBuffer,
      views: new Map()
        .set(BUFFERS_VIEWS.UINT32, new Uint32Array(arrayBuffer))
        .set(BUFFERS_VIEWS.FLOAT32, new Float32Array(arrayBuffer)),
    });

    this._buffers.set(BUFFERS_NAMES.ATTRACTORS_STORAGE, {
      buffer: this._gpuDevice.createBuffer({
        label: BUFFERS_NAMES.ATTRACTORS_STORAGE,
        size: (2 + 5) * 16 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      }),
      values: new Float32Array((2 + 5) * 16),
    });
  }

  /**
   * Initialise the bind group
   *
   * @param {BindGroupLayout} bindGroupLayout bind group layout to use
   * @param {Configuration} configuration fractal animation configuration
   */
  _initBindGroup(bindGroupLayout) {
    this._bindGroup = this._gpuDevice.createBindGroup({
      label: "Fractal renderer bind group",
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: { buffer: this._buffers.get(BUFFERS_NAMES.VIEWPORT_UNIFORMS).buffer },
        },
        {
          binding: 1,
          resource: { buffer: this._buffers.get(BUFFERS_NAMES.FUNCTION_UNIFORMS).buffer },
        },
        {
          binding: 2,
          resource: { buffer: this._buffers.get(BUFFERS_NAMES.FUNCTION_STORAGE).buffer },
        },
        {
          binding: 3,
          resource: { buffer: this._buffers.get(BUFFERS_NAMES.FRACTAL_UNIFORMS).buffer },
        },
        {
          binding: 4,
          resource: { buffer: this._buffers.get(BUFFERS_NAMES.ATTRACTORS_STORAGE).buffer },
        },
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

      this._fractalFunction.updateWithTime(this._animationTime);
      this.updateParameter(
        FractalGeneratorParameters.NUMERATOR,
        this._fractalFunction.getNumeratorArray(),
        true
      );
      this.updateParameter(
        FractalGeneratorParameters.DENOMINATOR,
        this._fractalFunction.getDenominatorArray(),
        true
      );

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
      renderPass.setVertexBuffer(0, this._buffers.get(BUFFERS_NAMES.VERTEX).buffer);
      renderPass.draw(VERTICES_COUNT);
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
   * Initialise the buffer values with the configuration
   *
   * @param {Configuration} configuration
   */
  _initBufferValues(configuration) {
    this.updateViewportDimensionRatio();
    this.updateParameter(
      FractalGeneratorParameters.COORDINATES_SCALE,
      configuration.coordinatesScale
    );
    this.updateParameter(
      FractalGeneratorParameters.COORDINATES_CENTER,
      configuration.coordinatesCenter
    );

    this.setFractalFunction(configuration.fractalFunction);
    this.updateParameter(FractalGeneratorParameters.ITERATIONS_COUNT, configuration.nbIterations);
    this.updateParameter(FractalGeneratorParameters.EPSILON, configuration.epsilon);
    this.updateParameter(FractalGeneratorParameters.JULIA_BOUND, configuration.juliaBound);
    this.updateParameter(FractalGeneratorParameters.JULIA_HSV, configuration.juliaHSV);
    this.updateParameter(FractalGeneratorParameters.DEFAULT_COLOUR, [
      configuration.defaultAttractor.hue,
      configuration.defaultAttractor.saturationStrength,
      configuration.defaultAttractor.saturationOffset,
      configuration.defaultAttractor.valueStrength,
      configuration.defaultAttractor.valueOffset,
    ]);
    this.updateParameter(FractalGeneratorParameters.INFINITY_COLOUR, [
      configuration.infinityAttractor.hue,
      configuration.infinityAttractor.saturationStrength,
      configuration.infinityAttractor.saturationOffset,
      configuration.infinityAttractor.valueStrength,
      configuration.infinityAttractor.valueOffset,
    ]);

    this.updateParameter(
      FractalGeneratorParameters.ATTRACTORS_COUNT,
      configuration.attractors.length
    );
    this.updateParameter(
      FractalGeneratorParameters.ATTRACTORS,
      configuration.attractors.flatMap((attractor) => [
        attractor.complex.mod(),
        attractor.complex.arg(),
        attractor.hue,
        attractor.saturationStrength,
        attractor.saturationOffset,
        attractor.valueStrength,
        attractor.valueOffset,
      ])
    );
  }

  /**
   * Initialise the Web GPU fractal generator and start the animation
   *
   * @param {Configuration} configuration
   */
  async initialise(configuration) {
    await this._loadWebGPU();

    this._initBuffers();
    this._initBufferValues(configuration);

    this.updateCanvasResolution(configuration.resolutionScale);
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    this._initContext(canvasFormat);

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
