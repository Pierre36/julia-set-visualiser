import type TimingHelper from "@/measurements/TimingHelper";

/** Timing helper that does nothing, always returning 0 */
export default class NoTimingHelper implements TimingHelper {
  public beginRenderPass(encoder: GPUCommandEncoder, descriptor: GPURenderPassDescriptor) {
    return encoder.beginRenderPass(descriptor);
  }

  public beginComputePass(encoder: GPUCommandEncoder, descriptor: GPUComputePassDescriptor = {}) {
    return encoder.beginComputePass(descriptor);
  }

  public async getResult(): Promise<number> {
    return 0;
  }
}
