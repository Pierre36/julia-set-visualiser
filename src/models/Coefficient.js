import { ComplexCircle } from "./ComplexCircle";
import { ComplexEllipse } from "./ComplexEllipse";
import { ComplexLine } from "./ComplexLine";
import { Complex } from "./Complex";
import { RandomUtils } from "../Utils/RandomUtils";
import { CoefficientTypes } from "../enumerations/CoefficientTypes";

export { Coefficient };

/**
 * Representation of a coefficient.
 */
class Coefficient {
  /**
   * Creates a coefficient from a JSON.
   * @param {Object} complexJSON An object containing the JSON for a coefficient.
   * @returns {ComplexCircle | ComplexLine | ComplexEllipse | Complex} The coefficient made from the JSON.
   * @throws Error if the coefficient type is incorrect
   */
  static fromJSON(coefficientJSON) {
    if (coefficientJSON == null) {
      return null;
    }
    if (coefficientJSON["type"] == CoefficientTypes.CIRCLE) {
      return ComplexCircle.fromJSON(coefficientJSON);
    } else if (coefficientJSON["type"] == CoefficientTypes.LINE) {
      return ComplexLine.fromJSON(coefficientJSON);
    } else if (coefficientJSON["type"] == CoefficientTypes.ELLIPSE) {
      return ComplexEllipse.fromJSON(coefficientJSON);
    } else if (coefficientJSON["type"] == CoefficientTypes.CONSTANT) {
      return Complex.fromJSON(coefficientJSON);
    } else {
      throw Error(
        `The type of the coefficient is incorrect! The type must be "${CoefficientTypes.CIRCLE}", "${CoefficientTypes.LINE}", "${CoefficientTypes.ELLIPSE}" or "${CoefficientTypes.CONSTANT}", got ${coefficientJSON["type"]}`
      );
    }
  }

  /**
   * Converts a coefficient to a JSON object.
   * @param {ComplexCircle | ComplexLine | ComplexEllipse | Complex} coefficient The coefficient to convert to JSON.
   * @returns {Object} The JSON object constructed from the coefficient.
   */
  static toJSON(coefficient) {
    const coefficientJSON = coefficient.toJSON();
    if (coefficient instanceof ComplexCircle) {
      coefficientJSON["type"] = CoefficientTypes.CIRCLE;
    } else if (coefficient instanceof ComplexLine) {
      coefficientJSON["type"] = CoefficientTypes.LINE;
    } else if (coefficient instanceof ComplexEllipse) {
      coefficientJSON["type"] = CoefficientTypes.ELLIPSE;
    } else if (coefficient instanceof Complex) {
      coefficientJSON["type"] = CoefficientTypes.CONSTANT;
    }
    return coefficientJSON;
  }

  /**
   * Returns a random coefficient with the provided settings.
   * @param {Set} coefficientTypes A set the available coefficient types.
   * @param {Object} complexModulusMinMax An object containing the min and max value of the modulus for constant coefficients.
   * @param {Object} circleCenterModulusMinMax An object containing the min and max value of the center modulus for circle coefficients.
   * @param {Object} radiusMinMax An object containing the min and max value of the radius for circle coefficients.
   * @param {Object} circleDurationMinMax An object containing the min and max value of the duration for circle coefficients.
   * @param {Object} startEndModulusMinMax An object containing the min and max value of the start and end modulus for line coefficients.
   * @param {Object} lineDurationMinMax An object containing the min and max value of the duration for line coefficients.
   * @param {Object} ellipseCenterModulusMinMax An object containing the min and max value of the center modulus for ellipse coefficients.
   * @param {Object} halfWidthMinMax An object containing the min and max value of the half-width for ellipse coefficients.
   * @param {Object} halfHeightMinMax An object containing the min and max value of the half-height for ellipse coefficients.
   * @param {Object} rotationAngleMinMax An object containing the min and max value of the rotation angle for ellipse coefficients.
   * @param {Object} ellipseDurationMinMax An object containing the min and max value of the duration for ellipse coefficients.
   * @returns {Complex | ComplexCircle | ComplexLine | ComplexEllipse } The new random coefficient.
   * @throws Error if the coefficient type is incorrect
   */
  static getRandomCoefficient(
    coefficientTypes,
    complexModulusMinMax,
    circleCenterModulusMinMax,
    radiusMinMax,
    circleDurationMinMax,
    startEndModulusMinMax,
    lineDurationMinMax,
    ellipseCenterModulusMinMax,
    halfWidthMinMax,
    halfHeightMinMax,
    rotationAngleMinMax,
    ellipseDurationMinMax
  ) {
    const coefficientType = RandomUtils.pickAmong(Array.from(coefficientTypes));
    if (coefficientType == CoefficientTypes.CIRCLE) {
      return ComplexCircle.getRandomComplexCircle(
        circleCenterModulusMinMax,
        radiusMinMax,
        circleDurationMinMax
      );
    } else if (coefficientType == CoefficientTypes.LINE) {
      return ComplexLine.getRandomComplexLine(startEndModulusMinMax, lineDurationMinMax);
    } else if (coefficientType == CoefficientTypes.ELLIPSE) {
      return ComplexEllipse.getRandomComplexEllipse(
        ellipseCenterModulusMinMax,
        halfWidthMinMax,
        halfHeightMinMax,
        rotationAngleMinMax,
        ellipseDurationMinMax
      );
    } else if (coefficientType == CoefficientTypes.CONSTANT) {
      return Complex.getRandomComplex(complexModulusMinMax);
    } else {
      throw Error(
        `The type of the coefficient is incorrect! The type must be "${CoefficientTypes.CIRCLE}", "${CoefficientTypes.LINE}", "${CoefficientTypes.ELLIPSE}" or "${CoefficientTypes.CONSTANT}", got ${coefficientType}`
      );
    }
  }
}
