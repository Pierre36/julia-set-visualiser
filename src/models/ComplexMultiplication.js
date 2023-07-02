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
  }

  /**
   * Get the value of the multiplication at the given time.
   * @param {Number} time The time in milliseconds.
   * @returns {Complex} The value of the multiplication at the given time.
   */
  getAtTime(time) {
    let complex1 = this.coefficient1;
    if (!(complex1 instanceof Complex)) {
      complex1 = complex1.getAtTime(time);
    }
    let complex2 = this.coefficient2;
    if (!(complex2 instanceof Complex)) {
      complex2 = complex2.getAtTime(time);
    }
    return complex1.multipliedByComplex(complex2);
  }
}
