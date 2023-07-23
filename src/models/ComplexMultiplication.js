import { Complex } from "./Complex";
import { ComplexCircle } from "./ComplexCircle";
import { ComplexLine } from "./ComplexLine";

export { ComplexMultiplication };

/**
 * Representation of a multiplication of two coefficients.
 */
class ComplexMultiplication {
  /**
   * Complex multiplication constructor
   * @param { Complex | ComplexCircle | ComplexLine } coefficient1 The first coefficient.
   * @param { Complex | ComplexCircle | ComplexLine } coefficient2 The second coefficient.
   */
  constructor(coefficient1, coefficient2) {
    this.coefficient1 = coefficient1;
    this.coefficient2 = coefficient2;
    if (coefficient1 instanceof Complex && coefficient2 instanceof Complex) {
      return coefficient1.multipliedByComplex(coefficient2);
    }
  }

  /**
   * Get the value of the multiplication at the given time.
   * @param {Number} time The time in milliseconds.
   * @returns {Complex} The value of the multiplication at the given time.
   */
  getAtTime(time) {
    return this.coefficient1.getAtTime(time).multipliedByComplex(this.coefficient2.getAtTime(time));
  }
}
