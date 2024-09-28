import type TimingHelper from "@/measurements/TimingHelper";

/** Helper responsible of measuring the GPU performances */
export default class GpuTimingHelper implements TimingHelper {
  /** Query to get the measurements */
  private querySet: GPUQuerySet;

  /** Resolve buffer to store the measurements */
  private resolveBuffer: GPUBuffer;

  /** Current result buffer */
  private resultBuffer: GPUBuffer | undefined;

  /** Array storing the result buffers as they are unmapped */
  private resultBuffers: GPUBuffer[];

  /**
   * GPU Timing Helper constructor
   *
   * @param gpuDevice GPU device
   */
  public constructor(private gpuDevice: GPUDevice) {
    this.querySet = gpuDevice.createQuerySet({ type: "timestamp", count: 2 });
    this.resolveBuffer = gpuDevice.createBuffer({
      size: this.querySet.count * 8,
      usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
    });
    this.resultBuffers = [];
  }

  public beginRenderPass(
    encoder: GPUCommandEncoder,
    descriptor: GPUCommandEncoderDescriptor
  ): GPURenderPassEncoder {
    return this.beginTimestampPass(encoder, "beginRenderPass", descriptor);
  }

  public beginComputePass(
    encoder: GPUCommandEncoder,
    descriptor: GPUCommandEncoderDescriptor = {}
  ): GPUComputePassEncoder {
    return this.beginTimestampPass(encoder, "beginComputePass", descriptor);
  }

  /**
   * Call the begin pass function on the encoder with the provided descriptor and inject the timestamp write query
   *
   * @param encoder GPU command encoder
   * @param functionName name of the function to use ("beginRenderPass" or "beginComputePass")
   * @param descriptor GPU command descriptor to use when calling the function
   * @returns the pass encoder
   */
  private beginTimestampPass(
    encoder: GPUCommandEncoder,
    functionName: string,
    descriptor: GPUCommandEncoderDescriptor
  ) {
    const pass = (encoder as any)[functionName]({
      ...descriptor,
      ...{
        timestampWrites: {
          querySet: this.querySet,
          beginningOfPassWriteIndex: 0,
          endOfPassWriteIndex: 1,
        },
      },
    });

    const resolve = () => this.resolveTiming(encoder);
    pass.end = ((origFn) => () => {
      origFn.call(pass);
      resolve();
    })(pass.end);

    return pass;
  }

  /**
   * Get the timing measurements from the encoder
   *
   * @param encoder GPU command encoder
   */
  private resolveTiming(encoder: GPUCommandEncoder) {
    this.resultBuffer =
      this.resultBuffers.pop() ||
      this.gpuDevice.createBuffer({
        size: this.resolveBuffer.size,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });

    encoder.resolveQuerySet(this.querySet, 0, this.querySet.count, this.resolveBuffer, 0);
    encoder.copyBufferToBuffer(this.resolveBuffer, 0, this.resultBuffer, 0, this.resultBuffer.size);
  }

  public async getResult() {
    const resultBuffer = this.resultBuffer;
    if (resultBuffer) {
      await resultBuffer.mapAsync(GPUMapMode.READ);
      const times = new BigInt64Array(resultBuffer.getMappedRange());
      const duration = Number(times[1] - times[0]);
      resultBuffer.unmap();
      this.resultBuffers.push(resultBuffer);
      return duration;
    }
    return 0;
  }
}
