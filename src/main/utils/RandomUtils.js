import { NumberUtils } from "./NumberUtils";

export { RandomUtils };

class RandomUtils {
  /**
   * Returns an integer between min and max. The number is in [min, max[.
   * @param {Number} min The minimum value.
   * @param {Number} max The maximum value.
   * @returns {Number} An integer in [min, max[.
   */
  static integerBetween(min, max) {
    return Math.floor(this.floatBetween(min, max, 10));
  }

  /**
   * Returns an float between min and max. The number is in [min, max[.
   * @param {Number} min The minimum value.
   * @param {Number} max The maximum value.
   * @param {Number} precision The number of significant digit.
   * @returns {Number} A float in [min, max[.
   */
  static floatBetween(min, max, precision = 2) {
    return NumberUtils.toPrecision(Math.random() * (max - min) + min, precision);
  }

  /**
   * Pick an element at random in the list and returns it.
   * @param {Array} list The list to pick from.
   * @returns {any} The picked element.
   */
  static pickAmong(list) {
    const index = this.integerBetween(0, list.length);
    return list[index];
  }

  /**
   * Returns a list of random integers between the min and max. The numbers are in [min, max[.
   * @param {Number} min The minimum value.
   * @param {Number} max The maximum value.
   * @param {Number} count The number of values.
   * @returns {Array} The list of distinct integers.
   * @throws An error if the count is too low for the given min and max.
   */
  static distinctIntegersBetween(min, max, count) {
    if (max - min + 1 < count) {
      throw new Error("Cannot generate more distinct random integers than available in the range.");
    }

    const distinctIntegers = [];
    const allIntegers = [];

    // Create an array containing all integers in the specified range.
    for (let i = min; i <= max; i++) {
      allIntegers.push(i);
    }

    // Shuffle the array using the Fisher-Yates algorithm.
    for (let i = allIntegers.length - 1; i > 0; i--) {
      const j = this.integerBetween(0, i);
      [allIntegers[i], allIntegers[j]] = [allIntegers[j], allIntegers[i]];
    }

    // Select the first 'count' elements from the shuffled array.
    for (let i = 0; i < count; i++) {
      distinctIntegers.push(allIntegers[i]);
    }

    return distinctIntegers;
  }
}
