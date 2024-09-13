export default class NumberUtils {
  /**
   * Round a float to have the provided number of significant digits
   *
   * @param float float to round
   * @param precision number of significant digit
   * @returns the new number with the specified number of digits
   */
  static toPrecision(float: number, precision: number): number {
    return Number(float.toPrecision(precision));
  }
}
