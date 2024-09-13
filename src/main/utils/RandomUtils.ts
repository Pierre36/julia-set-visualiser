import NumberUtils from "@/utils/NumberUtils";

export default class RandomUtils {
  /**
   * Return an integer between min and max. The number is in [min, max[
   *
   * @param min minimum value
   * @param max maximum value
   * @returns an integer in [min, max[
   */
  public static integerBetween(min: number, max: number): number {
    return Math.floor(this.floatBetween(min, max, 10));
  }

  /**
   * Return a float between min and max. The number is in [min, max[
   *
   * @param min  minimum value
   * @param max  maximum value
   * @param precision  number of significant digit
   * @returns a float in [min, max[
   */
  public static floatBetween(min: number, max: number, precision: number = 2): number {
    return NumberUtils.toPrecision(Math.random() * (max - min) + min, precision);
  }

  /**
   * Pick an element at random in the list and return it
   *
   * @param list list to pick from
   * @returns the picked element
   */
  public static pickAmong<T>(list: T[]): T {
    const index = this.integerBetween(0, list.length);
    return list[index];
  }

  /**
   * Return a list of random integers between the min and max. The numbers are in [min, max[
   *
   * @param min minimum value
   * @param max maximum value
   * @param count number of values
   * @returns the list of distinct integers
   * @throws an error if the count is too low for the given min and max
   */
  public static distinctIntegersBetween(min: number, max: number, count: number): number[] {
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
