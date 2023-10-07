import { ComplexCircle } from "./ComplexCircle";
import { ComplexLine } from "./ComplexLine";
import { Complex } from "./Complex";
import { RandomUtils } from "../Utils/RandomUtils";

export { Coefficient };

/**
 * Representation of a coefficient.
 */
class Coefficient {
  /**
   * Creates a coefficient from a JSON.
   * @param {Object} complexJSON An object containing the JSON for a coefficient.
   * @returns {ComplexCircle | ComplexLine | Complex} The coefficient made from the JSON.
   * @throws Error if the coefficient type is incorrect
   */
  static fromJSON(coefficientJSON) {
    if (coefficientJSON == null) {
      return null;
    }
    if (coefficientJSON["type"] == "COMPLEX_CIRCLE") {
      return ComplexCircle.fromJSON(coefficientJSON);
    } else if (coefficientJSON["type"] == "COMPLEX_LINE") {
      return ComplexLine.fromJSON(coefficientJSON);
    } else if (coefficientJSON["type"] == "COMPLEX") {
      return Complex.fromJSON(coefficientJSON);
    } else {
      throw Error(
        `The type of the coefficient is incorrect! The type must be "COMPLEX_CIRCLE", "COMPLEX_LINE" or "COMPLEX", got ${coefficientJSON["type"]}`
      );
    }
  }

  /**
   * Converts a coefficient to a JSON object.
   * @param {ComplexCircle | ComplexLine | Complex} coefficient The coefficient to convert to JSON.
   * @returns {Object} The JSON object constructed from the coefficient.
   */
  static toJSON(coefficient) {
    const coefficientJSON = coefficient.toJSON();
    if (coefficient instanceof ComplexCircle) {
      coefficientJSON["type"] = "COMPLEX_CIRCLE";
    } else if (coefficient instanceof ComplexLine) {
      coefficientJSON["type"] = "COMPLEX_LINE";
    } else if (coefficient instanceof Complex) {
      coefficientJSON["type"] = "COMPLEX";
    }
    return coefficientJSON;
  }

  /**
   * Returns a random coefficient with the provided settings.
   * @param {Set} coefficientTypes A set the available coefficient types.
   * @param {Object} complexModulusMinMax An object containing the min and max value of the modulus for constant coefficients.
   * @param {Object} centerModulusMinMax An object containing the min and max value of the center modulus for circle coefficients.
   * @param {Object} radiusMinMax An object containing the min and max value of the radius for circle coefficients.
   * @param {Object} circleDurationMinMax An object containing the min and max value of the duration for circle coefficients.
   * @param {Object} startEndModulusMinMax An object containing the min and max value of the start and end modulus for line coefficients.
   * @param {Object} lineDurationMinMax An object containing the min and max value of the duration for line coefficients.
   * @returns {Complex | ComplexCircle | ComplexLine} The new random coefficient.
   * @throws Error if the coefficient type is incorrect
   */
  static getRandomCoefficient(
    coefficientTypes,
    complexModulusMinMax,
    centerModulusMinMax,
    radiusMinMax,
    circleDurationMinMax,
    startEndModulusMinMax,
    lineDurationMinMax
  ) {
    const coefficientType = RandomUtils.pickAmong(Array.from(coefficientTypes));
    if (coefficientType == "CIRCLE") {
      return ComplexCircle.getRandomComplexCircle(
        centerModulusMinMax,
        radiusMinMax,
        circleDurationMinMax
      );
    } else if (coefficientType == "LINE") {
      return ComplexLine.getRandomComplexLine(startEndModulusMinMax, lineDurationMinMax);
    } else if (coefficientType == "CONSTANT") {
      return Complex.getRandomComplex(complexModulusMinMax);
    } else {
      throw Error(
        `The type of the coefficient is incorrect! The type must be "CIRCLE", "LINE" or "CONSTANT", got ${coefficientType}`
      );
    }
  }
}
