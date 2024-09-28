/** Common interface for Web GPU timing helpers */
export default interface TimingHelper {
  /**
   * Begin a render pass with a time measurements
   *
   * @param encoder GPU command encoder
   * @param descriptor render pass descriptor
   * @returns the render pass encoder
   */
  beginRenderPass(
    encoder: GPUCommandEncoder,
    descriptor: GPURenderPassDescriptor
  ): GPURenderPassEncoder;

  /**
   * Begin a compute pass with a time measurements
   *
   * @param encoder GPU command encoder
   * @param descriptor render pass descriptor
   * @returns the compute pass encoder
   */
  beginComputePass(
    encoder: GPUCommandEncoder,
    descriptor?: GPUComputePassDescriptor
  ): GPUComputePassEncoder;

  /**
   * Get the measurements (pass duration in nanoseconds)
   */
  getResult(): Promise<number>;
}
