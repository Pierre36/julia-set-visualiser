import computeShaderSource from "@/shaders/compute_shader.wgsl?raw";
import vertexShaderSource from "@/shaders/vertex_shader.wgsl?raw";
import fragmentShaderSource from "@/shaders/fragment_shader.wgsl?raw";
import Polynomial from "@/models/Polynomial";
import Configuration from "@/models/Configuration";
import FractalGeneratorParameters from "@/generators/FractalGeneratorParameters";
import FunctionTypes from "@/constants/FunctionTypes";

/** Number of vertices to render */
const VERTICES_COUNT = 6;

/** Enumeration for the buffers names */
enum BufferNames {
  VERTEX = "VERTEX_BUFFER",
  VIEWPORT_UNIFORMS = "VIEWPORT_UNIFORMS_BUFFER",
  TIME_UNIFORM = "TIME_UNIFORM_BUFFER",
  FUNCTION_UNIFORMS = "FUNCTION_UNIFORMS_BUFFER",
  FUNCTION_STORAGE = "FUNCTION_STORAGE_BUFFER",
  FRACTION_STORAGE = "FRACTION_STORAGE_BUFFER",
  FRACTAL_UNIFORMS = "FRACTAL_UNIFORMS_BUFFER",
  ATTRACTORS_STORAGE = "ATTRACTORS_STORAGE_BUFFER",
}

/** Enumeration for the buffers views */
enum BufferViews {
  UINT32 = "UINT32",
  FLOAT32 = "FLOAT32",
}

/** Interface for the buffer details */
interface BufferDetails {
  buffer: GPUBuffer;
  values: ArrayBuffer | Float32Array | Int32Array;
  views: Map<BufferViews, Uint32Array | Float32Array>;
}

/** Interface for the parameters mapping details */
interface ParamsMappingDetails {
  bufferName: BufferNames;
  offset: number;
  isArray?: boolean;
  view?: BufferViews;
}

/** Mapping between the parameters and their buffers */
const PARAMS_MAPPING: {
  [K in FractalGeneratorParameters]: ParamsMappingDetails;
} = {
  TIME: { bufferName: BufferNames.TIME_UNIFORM, offset: 0 },
  DIMENSION_RATIO: { bufferName: BufferNames.VIEWPORT_UNIFORMS, offset: 0 },
  COORDINATES_SCALE: { bufferName: BufferNames.VIEWPORT_UNIFORMS, offset: 1 },
  COORDINATES_CENTER: { bufferName: BufferNames.VIEWPORT_UNIFORMS, offset: 2, isArray: true },
  IS_NEWTON: { bufferName: BufferNames.FUNCTION_UNIFORMS, offset: 0, view: BufferViews.UINT32 },
  NEWTON_COEFFICIENT: {
    bufferName: BufferNames.FUNCTION_UNIFORMS,
    offset: 4,
    isArray: true,
    view: BufferViews.FLOAT32,
  },
  NUMERATOR: { bufferName: BufferNames.FUNCTION_STORAGE, offset: 0, isArray: true },
  DENOMINATOR: {
    bufferName: BufferNames.FUNCTION_STORAGE,
    offset: (Polynomial.MAX_DEGREE + 1) * 6,
    isArray: true,
  },
  ITERATIONS_COUNT: {
    bufferName: BufferNames.FRACTAL_UNIFORMS,
    offset: 0,
    view: BufferViews.UINT32,
  },
  EPSILON: { bufferName: BufferNames.FRACTAL_UNIFORMS, offset: 1, view: BufferViews.FLOAT32 },
  JULIA_BOUND: { bufferName: BufferNames.FRACTAL_UNIFORMS, offset: 2, view: BufferViews.FLOAT32 },
  ATTRACTORS_COUNT: {
    bufferName: BufferNames.FRACTAL_UNIFORMS,
    offset: 3,
    view: BufferViews.UINT32,
  },
  DEFAULT_COLOUR: {
    bufferName: BufferNames.FRACTAL_UNIFORMS,
    offset: 4,
    view: BufferViews.FLOAT32,
    isArray: true,
  },
  INFINITY_COLOUR: {
    bufferName: BufferNames.FRACTAL_UNIFORMS,
    offset: 12,
    view: BufferViews.FLOAT32,
    isArray: true,
  },
  JULIA_HSV: {
    bufferName: BufferNames.FRACTAL_UNIFORMS,
    offset: 20,
    view: BufferViews.FLOAT32,
    isArray: true,
  },
  ATTRACTORS: { bufferName: BufferNames.ATTRACTORS_STORAGE, offset: 0, isArray: true },
};

/**
 * Implementation of a fractal engine using WebGPU.
 */
export default class WebGpuFractalGenerator {
  /** Animation time (in milliseconds) i.e. the time used for the function */
  private animationTime: number;

  /** `true` if the animation is paused, `false` otherwise */
  private paused: boolean;

  /** Last 10 FPS to get the average FPS from */
  private last10FPS: number[];

  /** Number of frame per second of the animation */
  public fps: number;

  /**
   * Fractal Generator constructor
   *
   * @param canvas animation canvas
   * @param gpuDevice GPU device from WebGPU API
   * @param context WebGPU context object
   * @param buffers map of buffers and their values
   * @param bindGroup WebGPU bind group defining the resources bindings
   * @param computePipeline pipeline responsible of updating the coefficients values with time
   * @param renderPipeline pipeline responsible of the fractal animation rendering
   */
  private constructor(
    private canvas: HTMLCanvasElement,
    private gpuDevice: GPUDevice,
    private context: GPUCanvasContext,
    private buffers: { [K in BufferNames]: BufferDetails },
    private bindGroup: GPUBindGroup,
    private computePipeline: GPUComputePipeline,
    private renderPipeline: GPURenderPipeline
  ) {
    this.paused = false;
    this.animationTime = 0;
    this.fps = 0;
    this.last10FPS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  /**
   * Initialise the Web GPU fractal generator
   *
   * @param canvas animation canvas
   */
  public static async initialise(
    canvas: HTMLCanvasElement
  ): Promise<WebGpuFractalGenerator | Error> {
    // Get the GPU device
    const gpuDevice = await this.loadWebGPU();
    if (gpuDevice instanceof Error) {
      return gpuDevice;
    }

    // Create the buffers and bind them
    const buffers = this.createBuffers(gpuDevice);
    const bindGroupLayout = this.createBindGroupLayout(gpuDevice);
    const bindGroup = this.createBindGroup(gpuDevice, bindGroupLayout, buffers);

    // Retrieve and configure the canvas context
    const context = this.createContext(canvas, gpuDevice);
    if (context instanceof Error) {
      return context;
    }

    // Create the pipelines and the fractal generator
    const computePipeline = this.createComputePipeline(gpuDevice, bindGroupLayout);
    const renderPipeline = this.createRenderPipeline(gpuDevice, bindGroupLayout);
    return new this(
      canvas,
      gpuDevice,
      context,
      buffers,
      bindGroup,
      computePipeline,
      renderPipeline
    );
  }

  /**
   * Load WebGPU API and request GPU device
   *
   * @returns the GPU device or an error if the browser does not support WebGPU or if an adapter
   * could not be found
   */
  private static async loadWebGPU(): Promise<GPUDevice | Error> {
    if (!navigator.gpu) {
      return new Error("Unable to initialize WebGPU. Your browser may not support it.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("Unable to initialize WebGPU. No appropriate GPUAdapter found.");
    }

    return await adapter.requestDevice();
  }

  /**
   * Initialise the buffers
   *
   * @param gpuDevice GPU device to create the buffer
   * @returns the buffers
   */
  private static createBuffers(gpuDevice: GPUDevice): {
    [K in BufferNames]: BufferDetails;
  } {
    return {
      VERTEX_BUFFER: this.createVertexBuffer(gpuDevice),
      VIEWPORT_UNIFORMS_BUFFER: this.createViewportUniformsBuffer(gpuDevice),
      TIME_UNIFORM_BUFFER: this.createTimeUniformBuffer(gpuDevice),
      FUNCTION_UNIFORMS_BUFFER: this.createFunctionUniformsBuffer(gpuDevice),
      FUNCTION_STORAGE_BUFFER: this.createFunctionStorageBuffer(gpuDevice),
      FRACTION_STORAGE_BUFFER: this.createFractionStorageBuffer(gpuDevice),
      FRACTAL_UNIFORMS_BUFFER: this.createFractalUniformsBuffer(gpuDevice),
      ATTRACTORS_STORAGE_BUFFER: this.createAttractorsStorageBuffers(gpuDevice),
    };
  }

  /**
   * Initialise the vertex buffer with vertices
   *
   * @param gpuDevice GPU device to create the buffer
   * @returns the vertex buffer details
   */
  private static createVertexBuffer(gpuDevice: GPUDevice): BufferDetails {
    return {
      buffer: gpuDevice.createBuffer({
        label: BufferNames.VERTEX,
        size: VERTICES_COUNT * 2 * 4,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      }),
      values: new Float32Array([-1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0]),
      views: new Map(),
    };
  }

  /**
   * Initialise the viewport uniforms buffer (dimension ratio, scale and center)
   *
   * @param gpuDevice GPU device to create the buffer
   * @returns the viewport uniforms buffer details
   */
  private static createViewportUniformsBuffer(gpuDevice: GPUDevice): BufferDetails {
    return {
      buffer: gpuDevice.createBuffer({
        label: BufferNames.VIEWPORT_UNIFORMS,
        size: 4 * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
      values: new Float32Array(4),
      views: new Map(),
    };
  }

  /**
   * Initialise the time uniform buffer
   *
   * @param gpuDevice GPU device to create the buffer
   * @returns the time uniform buffer details
   */
  private static createTimeUniformBuffer(gpuDevice: GPUDevice): BufferDetails {
    return {
      buffer: gpuDevice.createBuffer({
        label: BufferNames.VIEWPORT_UNIFORMS,
        size: 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
      values: new Float32Array(1),
      views: new Map(),
    };
  }

  /**
   * Initialise the function uniforms buffer (is newton, newton coefficient, number of numerator and
   * denominator coefficients)
   *
   * @param gpuDevice GPU device to create the buffer
   * @returns the function uniforms buffer details
   */
  private static createFunctionUniformsBuffer(gpuDevice: GPUDevice): BufferDetails {
    const arrayBuffer = new ArrayBuffer(12 * 4);
    return {
      buffer: gpuDevice.createBuffer({
        label: BufferNames.FUNCTION_UNIFORMS,
        size: arrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
      values: arrayBuffer,
      views: new Map()
        .set(BufferViews.UINT32, new Uint32Array(arrayBuffer))
        .set(BufferViews.FLOAT32, new Float32Array(arrayBuffer)),
    };
  }

  /**
   * Initialise the function storage buffer (numerator and denominator coefficients parameters)
   *
   * @param gpuDevice GPU device to create the buffer
   * @returns the function storage buffer details
   */
  private static createFunctionStorageBuffer(gpuDevice: GPUDevice): BufferDetails {
    return {
      buffer: gpuDevice.createBuffer({
        label: BufferNames.FUNCTION_STORAGE,
        size: (Polynomial.MAX_DEGREE + 1) * 6 * 2 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      }),
      values: new Float32Array((Polynomial.MAX_DEGREE + 1) * 6 * 2),
      views: new Map(),
    };
  }

  /**
   * Initialise the fraction storage buffer (numerator and denominator)
   *
   * @param gpuDevice GPU device to create the buffer
   * @returns the fraction storage buffer details
   */
  private static createFractionStorageBuffer(gpuDevice: GPUDevice): BufferDetails {
    return {
      buffer: gpuDevice.createBuffer({
        label: BufferNames.FRACTION_STORAGE,
        size: (Polynomial.MAX_DEGREE + 1) * 2 * 2 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      }),
      values: new Float32Array((Polynomial.MAX_DEGREE + 1) * 2 * 2),
      views: new Map(),
    };
  }

  /**
   * Initialise the fractal uniforms buffer
   *
   * @param gpuDevice GPU device to create the buffer
   * @returns the fractal uniforms buffer details
   */
  private static createFractalUniformsBuffer(gpuDevice: GPUDevice): BufferDetails {
    const arrayBuffer = new ArrayBuffer(24 * 4);
    return {
      buffer: gpuDevice.createBuffer({
        label: BufferNames.FRACTAL_UNIFORMS,
        size: arrayBuffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
      values: arrayBuffer,
      views: new Map()
        .set(BufferViews.UINT32, new Uint32Array(arrayBuffer))
        .set(BufferViews.FLOAT32, new Float32Array(arrayBuffer)),
    };
  }

  /**
   * Initialise the attractors storage buffer
   *
   * @param gpuDevice GPU device to create the buffer
   * @returns the attractors storage buffer details
   */
  private static createAttractorsStorageBuffers(gpuDevice: GPUDevice): BufferDetails {
    return {
      buffer: gpuDevice.createBuffer({
        label: BufferNames.ATTRACTORS_STORAGE,
        size: (2 + 5) * 16 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      }),
      values: new Float32Array((2 + 5) * 16),
      views: new Map(),
    };
  }

  /**
   * Initialise the GPU canvas context
   *
   * @param canvas HTML canvas
   * @param gpuDevice GPU device
   * @returns the GPU canvas context or an error if it could not be retrieved
   */
  private static createContext(
    canvas: HTMLCanvasElement,
    gpuDevice: GPUDevice
  ): GPUCanvasContext | Error {
    const context = canvas.getContext("webgpu");

    if (!context) {
      return new Error("Unable to get WebGPU context from the canvas");
    }

    context.configure({
      device: gpuDevice,
      format: navigator.gpu.getPreferredCanvasFormat(),
    });

    return context;
  }

  /**
   * Create the bind group layout for the fractal pipeline
   *
   * @param gpuDevice GPU device
   * @returns the GPU bind group layout
   */
  private static createBindGroupLayout(gpuDevice: GPUDevice): GPUBindGroupLayout {
    return gpuDevice.createBindGroupLayout({
      label: "Fractal Bind Group Layout",
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {} },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {} },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {} },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "read-only-storage" },
        },
        {
          binding: 4,
          visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
          buffer: { type: "storage" },
        },
        { binding: 5, visibility: GPUShaderStage.FRAGMENT, buffer: {} },
        {
          binding: 6,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: "read-only-storage" },
        },
      ],
    });
  }

  /**
   * Initialise the bind group
   *
   * @param gpuDevice GPU device
   * @param bindGroupLayout bind group layout to use
   * @param buffers buffers to bind
   * @returns the bind group
   */
  private static createBindGroup(
    gpuDevice: GPUDevice,
    bindGroupLayout: GPUBindGroupLayout,
    buffers: { [K in BufferNames]: BufferDetails }
  ): GPUBindGroup {
    return gpuDevice.createBindGroup({
      label: "Fractal renderer bind group",
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: buffers[BufferNames.VIEWPORT_UNIFORMS].buffer } },
        { binding: 1, resource: { buffer: buffers[BufferNames.TIME_UNIFORM].buffer } },
        { binding: 2, resource: { buffer: buffers[BufferNames.FUNCTION_UNIFORMS].buffer } },
        { binding: 3, resource: { buffer: buffers[BufferNames.FUNCTION_STORAGE].buffer } },
        { binding: 4, resource: { buffer: buffers[BufferNames.FRACTION_STORAGE].buffer } },
        { binding: 5, resource: { buffer: buffers[BufferNames.FRACTAL_UNIFORMS].buffer } },
        { binding: 6, resource: { buffer: buffers[BufferNames.ATTRACTORS_STORAGE].buffer } },
      ],
    });
  }

  /**
   * Create the fractal computation pipeline i.e. the pipeline responsible of computing the
   * coefficients values depending on time
   *
   * @param gpuDevice GPU device
   * @param bindGroupLayout the bind group layout to use
   * @returns the fractal compute pipeline
   */
  private static createComputePipeline(
    gpuDevice: GPUDevice,
    bindGroupLayout: GPUBindGroupLayout
  ): GPUComputePipeline {
    return gpuDevice.createComputePipeline({
      label: "Fractal compute pipeline",
      layout: gpuDevice.createPipelineLayout({
        label: "Fractal compute pipeline layout",
        bindGroupLayouts: [bindGroupLayout],
      }),
      compute: {
        module: gpuDevice.createShaderModule({
          label: "Compute shader",
          code: computeShaderSource,
        }),
        entryPoint: "computeMain",
      },
    });
  }

  /**
   * Create the fractal render pipeline i.e. the pipeline responsible of rendering the animation
   *
   * @param gpuDevice GPU device
   * @param bindGroupLayout the bind group layout to use
   * @returns the fractal render pipeline
   */
  private static createRenderPipeline(
    gpuDevice: GPUDevice,
    bindGroupLayout: GPUBindGroupLayout
  ): GPURenderPipeline {
    return gpuDevice.createRenderPipeline({
      label: "Fractal render pipeline",
      layout: gpuDevice.createPipelineLayout({
        label: "Fractal render pipeline layout",
        bindGroupLayouts: [bindGroupLayout],
      }),
      vertex: {
        module: gpuDevice.createShaderModule({ label: "Vertex shader", code: vertexShaderSource }),
        entryPoint: "vertexMain",
        buffers: [
          { arrayStride: 8, attributes: [{ format: "float32x2", offset: 0, shaderLocation: 0 }] },
        ],
      },
      fragment: {
        module: gpuDevice.createShaderModule({
          label: "Fragment shader",
          code: fragmentShaderSource,
        }),
        entryPoint: "fragmentMain",
        targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
      },
    });
  }

  /**
   * Start the animation
   *
   * @param configuration configuration of the fractal animation
   */
  public startAnimation(configuration: Configuration): void {
    this.updateCanvasResolution(configuration.resolutionScale);
    this.initBufferValues(configuration);
    requestAnimationFrame((time) => this.render(time, 0, 0));
  }

  /**
   * Initialise the buffer values with the configuration
   *
   * @param configuration configuration of the fractal animation
   */
  private initBufferValues(configuration: Configuration) {
    this.writeBuffer(BufferNames.VERTEX);

    this.updateViewportDimensionRatio();
    this.updateParameter(
      FractalGeneratorParameters.COORDINATES_SCALE,
      configuration.coordinatesScale
    );
    this.updateParameter(
      FractalGeneratorParameters.COORDINATES_CENTER,
      configuration.coordinatesCenter
    );

    this.updateParameter(FractalGeneratorParameters.TIME, this.animationTime);

    this.updateParameter(
      FractalGeneratorParameters.IS_NEWTON,
      configuration.fractalFunction.functionType == FunctionTypes.NEWTON ? 1 : 0
    );
    this.updateParameter(
      FractalGeneratorParameters.NEWTON_COEFFICIENT,
      configuration.fractalFunction.newtonCoefficient.getEllipsisParameters()
    );

    this.updateParameter(
      FractalGeneratorParameters.NUMERATOR,
      configuration.fractalFunction.numerator.getCoefficientsParameters()
    );
    this.updateParameter(
      FractalGeneratorParameters.DENOMINATOR,
      configuration.fractalFunction.denominator.getCoefficientsParameters()
    );

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
        attractor.complex?.mod() || 0,
        attractor.complex?.arg() || 0,
        attractor.hue,
        attractor.saturationStrength,
        attractor.saturationOffset,
        attractor.valueStrength,
        attractor.valueOffset,
      ])
    );
  }

  /**
   * Update the canvas resolution
   *
   * @param resolutionScale scale for the resolution of the canvas (1 is the resolution of the canvas)
   */
  public updateCanvasResolution(resolutionScale: number) {
    this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio * resolutionScale;
    this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio * resolutionScale;
  }

  /**
   * Update the viewport dimension ratio
   */
  public updateViewportDimensionRatio() {
    this.updateParameter(
      FractalGeneratorParameters.DIMENSION_RATIO,
      this.canvas.clientWidth / this.canvas.clientHeight
    );
  }

  /**
   * Update a parameter of the fractal generation
   *
   * @param parameter key corresponding to the parameter (see {@link FractalGeneratorParameters})
   * @param value value of the parameter
   * @param debug `true` if the updated value should be logged, `false` otherwise. `true` by default.
   * @throws an error if the buffer of the parameter is not initialised or has not the view
   */
  public updateParameter(parameter: FractalGeneratorParameters, value: any, debug = true) {
    const paramsDetails = PARAMS_MAPPING[parameter];

    const bufferDetails = this.buffers[paramsDetails.bufferName];
    if (!bufferDetails) {
      throw new Error(`No buffer ${paramsDetails.bufferName}`);
    }

    let values: Float32Array | Uint32Array | Int32Array | undefined;
    if (paramsDetails.view) {
      values = bufferDetails.views.get(paramsDetails.view);
      if (!values) {
        throw new Error(`No view ${paramsDetails.view} for buffer ${paramsDetails.bufferName}`);
      }
    } else {
      values = bufferDetails.values as Float32Array | Int32Array;
    }

    if (paramsDetails.isArray) {
      values.set(value, paramsDetails.offset);
    } else {
      values[paramsDetails.offset] = value;
    }

    this.writeBuffer(paramsDetails.bufferName);

    if (this.paused) {
      this.drawFractal();
    }

    if (debug) {
      console.debug("[OK] Updated %s with value [%s]", parameter, value);
    }
  }

  /**
   * Add a write buffer task to the GPU device queue
   *
   * @param bufferName name of the buffer (see `BUFFERS_NAMES`)
   */
  private writeBuffer(bufferName: BufferNames) {
    this.gpuDevice.queue.writeBuffer(
      this.buffers[bufferName].buffer,
      0,
      this.buffers[bufferName].values
    );
  }

  /**
   * Render the current frame
   *
   * @param time animation time in milliseconds
   * @param timeIncrement increment of the animation time
   * @param nbFrames number of frames since the beginning of the animation
   */
  private render(time: number, timeIncrement: number, nbFrames: number) {
    if (!this.paused) {
      this.animationTime += timeIncrement;
      this.updateParameter(FractalGeneratorParameters.TIME, this.animationTime, false);
      this.drawFractal();
    }

    requestAnimationFrame((newTime) => {
      const frameDuration = newTime - time;
      this.updateFPS(frameDuration, nbFrames);
      this.render(newTime, this.paused ? 0 : frameDuration, nbFrames + 1);
    });
  }

  /**
   * Draw the fractal on the canvas
   */
  private drawFractal() {
    const encoder = this.gpuDevice.createCommandEncoder();

    const computePass = encoder.beginComputePass();
    computePass.setPipeline(this.computePipeline);
    computePass.setBindGroup(0, this.bindGroup);
    computePass.dispatchWorkgroups(1, 1);
    computePass.end();

    const renderPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          loadOp: "clear",
          clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
          storeOp: "store",
        },
      ],
    });
    renderPass.setPipeline(this.renderPipeline);
    renderPass.setBindGroup(0, this.bindGroup);
    renderPass.setVertexBuffer(0, this.buffers[BufferNames.VERTEX].buffer);
    renderPass.draw(VERTICES_COUNT);
    renderPass.end();

    this.gpuDevice.queue.submit([encoder.finish()]);
  }

  /**
   * Update the fps
   *
   * @param frameDuration duration of the frame in milliseconds
   * @param nbFrames number of frames since the beginning of the animation
   */
  private updateFPS(frameDuration: number, nbFrames: number) {
    let frameFPS = 1000 / (10 * frameDuration);
    if (frameFPS == Infinity) {
      frameFPS = 0;
    }
    this.fps = this.fps - this.last10FPS[nbFrames % 10] + frameFPS;
    this.last10FPS[nbFrames % 10] = frameFPS;
  }

  /**
   * Pause the animation
   */
  public pause() {
    this.paused = true;
  }

  /**
   * Unpause the animation
   */
  public unpause() {
    this.paused = false;
  }

  /**
   * Reset the animation time to 0
   */
  public resetAnimationTime() {
    this.animationTime = 0;
  }
}
