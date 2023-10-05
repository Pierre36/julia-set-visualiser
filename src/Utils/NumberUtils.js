export { NumberUtils };

class NumberUtils {
  /**
   * Rounds a float to have the provided number of significant digits.
   * @param {Number} float The float to round.
   * @param {Number} precision The number of significant digit.
   * @returns {Number} The new number with the specified number of digits.
   */
  static toPrecision(float, precision) {
    return Number(float.toPrecision(precision));
  }
}
