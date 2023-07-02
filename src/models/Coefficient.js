import { ComplexCircle } from "./ComplexCircle";
import { ComplexLine } from "./ComplexLine";
import { Complex } from "./Complex";

export { Coefficient };

/**
 * Representation of a coefficient.
 */
class Coefficient {
  /**
   * Creates a coefficient from a JSON.
   * @param {Object} complexJSON An object containing the JSON for a coefficient.
   * @returns {ComplexCircle | ComplexLine | Complex} The coefficient made from the JSON.
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
}
