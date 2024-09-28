/** Object storing and computing a rolling average */
export default class RollingAverage {
  /** Sum of the samples */
  private total: number;

  /** List of samples */
  private samples: number[];

  /** Current index in the samples list */
  private cursor: number;

  /**
   * Rolling Average constructor
   *
   * @param samplesCount maximum number of samples before rolling
   */
  constructor(private samplesCount = 30) {
    this.total = 0;
    this.samples = [];
    this.cursor = 0;
  }

  /**
   * Add a sample for the average computation
   *
   * @param sample new sample
   */
  addSample(sample: number): void {
    this.total += sample;
    this.total -= this.samples[this.cursor] || 0;
    this.samples[this.cursor] = sample;
    this.cursor = (this.cursor + 1) % this.samplesCount;
  }

  /**
   * Get the average value
   *
   * @returns the average
   */
  get(): number {
    return this.total / this.samples.length;
  }
}
