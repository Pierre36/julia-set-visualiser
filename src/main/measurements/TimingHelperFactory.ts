import GpuTimingHelper from "@/measurements/GpuTimingHelper";
import NoTimingHelper from "@/measurements/NoTimingHelper";
import type TimingHelper from "@/measurements/TimingHelper";

/** Factory responsible of creating timing helpers depending on GPU Device features */
export default class TimingHelperFactory {
  /**
   * Create a `TimingHelper` instance based on the features of the provided GPU device
   *
   * @param gpuDevice GPU device
   * @returns the timing helper
   */
  static getTimingHelper(gpuDevice: GPUDevice): TimingHelper {
    if (gpuDevice.features.has("timestamp-query")) {
      return new GpuTimingHelper(gpuDevice);
    } else {
      console.error("Shit");
      return new NoTimingHelper();
    }
  }
}
