import { ComplexCircle } from "./ComplexCircle";
import { ComplexLine } from "./ComplexLine";
import { Complex } from "./Complex";

export { Polynomial };

const MAX_DEGREE = 15;

/**
 * Representation of a complex polynomial.
 */
class Polynomial {
  /**
   * Polynomial constructor
   * @param {Object} coefficients The coeffficients of the polynomial.
   */
  constructor(coefficients) {
    this.coefficients = { 0: new Complex(0, 0) };
    this.degree = 0;
    if (coefficients) {
      for (let [power, coefficient] of Object.entries(coefficients)) {
        if (power <= MAX_DEGREE) {
          this.setCoefficient(power, coefficient);
        }
      }
    }
  }

  /**
   * The maximum degree of a polynomial.
   */
  static get MAX_DEGREE() {
    return MAX_DEGREE;
  }

  /**
   * Returns the coefficient at a given power.
   * @param {Number} power The power associated to the wanted coefficient.
   * @returns {Complex | ComplexCircle | ComplexLine} The coefficient.
   * @throws An error if the power is superior to MAX_DEGREE.
   */
  getCoefficient(power) {
    if (power > MAX_DEGREE) {
      throw Error(`The power must be inferior to ${MAX_DEGREE}`);
    }
    return this.coefficients[power];
  }

  /**
   * Sets the coefficient at a given power.
   * @param {Number} power The power associated to the wanted coefficient.
   * @param {Complex | ComplexCircle | ComplexLine} coefficient The new coefficient.
   * @throws An error if the power is superior to MAX_DEGREE.
   */
  setCoefficient(power, coefficient) {
    if (power > MAX_DEGREE) {
      throw Error(`The power must be inferior to ${MAX_DEGREE}`);
    }
    this.coefficients[power] = coefficient;
    this.degree = Math.max(this.degree, power);
  }

  /**
   * Gets the power of the polynomial in descending orders.
   * @returns {Array} An array containing the power of the polynomial in descending orders.
   */
  descendingPowers() {
    return Object.keys(this.coefficients).sort((a, b) => {
      return Number(b) - Number(a);
    });
  }

  /**
   * Computes and returns the MathML representation of the polynomial.
   * @returns {String} The MathML representation of the polynomial.
   */
  toMathML() {
    var mathML = "";
    const descendingPowers = this.descendingPowers();
    var firstNonZeroCoefficient = true;
    for (let i = 0; i < descendingPowers.length; i++) {
      let power = descendingPowers[i];
      let coefficient = this.coefficients[power];

      if (!coefficient.isZero()) {
        if (coefficient.showMinus()) {
          mathML += "<mrow><mo>-</mo></mrow>";
        } else if (!firstNonZeroCoefficient) {
          mathML += "<mrow><mo>+</mo></mrow>";
        }
        firstNonZeroCoefficient = false;
        mathML += "<mrow>";
        if (coefficient instanceof Complex) {
          mathML += coefficient.toMathML(power == 0);
        } else if (
          coefficient instanceof ComplexLine ||
          coefficient instanceof ComplexCircle
        ) {
          mathML += coefficient.toMathML(power);
        }

        if (power == 1) {
          mathML += "<mi>z</mi>";
        } else if (power != 0) {
          mathML += `<msup><mi>z</mi><mn>${power}</mn></msup>`;
        }
        mathML += "</mrow>";
      }
    }
    return mathML;
  }

  /**
   * Convert the polynomial into a flattened array of complex number in Euler's notation.
   * @returns {Float32Array} The flattened array of complex number in Euler's notation.
   */
  toFloat32EulerArray() {
    const flattenedArray = [];
    for (let p = 0; p <= MAX_DEGREE; p++) {
      let complex = this.coefficients[p];
      if (complex) {
        flattenedArray.push(complex.mod(), complex.arg());
      } else {
        flattenedArray.push(0, 0);
      }
    }
    return new Float32Array(flattenedArray);
  }

  /**
   * Get the value of the polynomial at the given time.
   * @param {Number} time The time in milliseconds.
   * @returns {Complex} The value of the polynomial at the given time.
   */
  getAtTime(time) {
    const newPolynomial = new Polynomial();
    for (let [power, coefficient] of Object.entries(this.coefficients)) {
      if (coefficient instanceof Complex) {
        newPolynomial.setCoefficient(power, coefficient.copy());
      } else if (
        coefficient instanceof ComplexCircle ||
        coefficient instanceof ComplexLine
      ) {
        newPolynomial.setCoefficient(power, coefficient.getAtTime(time));
      }
    }
    return newPolynomial;
  }

  /**
   * Computes and returs the derivative of the polynomial.
   * @returns {Polynomial} The derivative of the polynomial.
   */
  getDerivative() {
    const derivative = new Polynomial();
    for (let [power, coefficient] of Object.entries(this.coefficients)) {
      derivative.setCoefficient(
        power - 1,
        new Complex(coefficient.re * power, coefficient.im * power)
      );
    }
    return derivative;
  }

  /**
   * Computes and returns the Newton numerator of the polynomial.
   * @returns {Polynomial} The Newton numerator of the polynomial.
   */
  getNewtonNumerator() {
    const newtonNumerator = new Polynomial();
    for (let [power, coefficient] of Object.entries(this.coefficients)) {
      if (coefficient) {
        newtonNumerator.setCoefficient(
          power,
          new Complex(
            (power - 1) * coefficient.re,
            (power - 1) * coefficient.im
          )
        );
      }
    }
    return newtonNumerator;
  }
}
