import { ComplexCircle } from "./ComplexCircle";
import { ComplexLine } from "./ComplexLine";
import { Complex } from "./Complex";
import { Coefficient } from "./Coefficient";
import { ComplexMultiplication } from "./ComplexMultiplication";

export { Polynomial };

const MAX_DEGREE = 15;

/**
 * Representation of a complex polynomial.
 */
class Polynomial {
  /**
   * Polynomial constructor
   * @param {Object} coefficients The coefficients of the polynomial.
   */
  constructor(coefficients) {
    this.degree = 0;
    this.coefficients = {};
    for (let power = 0; power <= MAX_DEGREE; power++) {
      if (coefficients != undefined && coefficients[power] != undefined) {
        this.setCoefficient(power, coefficients[power]);
      } else {
        this.coefficients[power] = null;
      }
    }
  }

  /**
   * Creates a polynomial from a JSON.
   * @param {Object} coefficientsJSON An object containing the JSON for a polynomial.
   * @returns {Polynomial} The polynomial made from the coefficients.
   * @throws An error if one of the coefficients type is incorrect.
   */
  static fromJSON(coefficientsJSON) {
    const coefficients = {};
    Object.keys(coefficientsJSON).forEach((power) => {
      coefficients[power] = Coefficient.fromJSON(coefficientsJSON[power]);
    });
    return new Polynomial(coefficients);
  }

  /**
   * Converts a polynomial to a JSON object.
   * @returns {Object} The JSON object constructed from the polynomial.
   */
  toJSON() {
    const coefficientsJSON = {};
    Object.keys(this.coefficients).forEach((power) => {
      const coefficient = this.coefficients[power];
      if (coefficient != null) {
        coefficientsJSON[power] = Coefficient.toJSON(coefficient);
      }
    });
    return coefficientsJSON;
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
   * @throws An error if the provided coefficient is undefined.
   */
  setCoefficient(power, coefficient) {
    if (power > MAX_DEGREE) {
      throw Error(`The power must be inferior to ${MAX_DEGREE}`);
    }
    if (coefficient == undefined) {
      throw Error("The provided coefficient is undefined");
    }
    this.coefficients[power] = coefficient;
    this.degree = Math.max(this.degree, power);
  }

  /**
   * Removes the coefficient at a given power by replacing by null.
   * @param {Number} power The power associated to the wanted coefficient.
   * @throws An error if the power is superior to MAX_DEGREE.
   */
  removeCoefficient(power) {
    if (power > MAX_DEGREE) {
      throw Error(`The power must be inferior to ${MAX_DEGREE}`);
    }
    this.coefficients[power] = null;
    if (power == this.degree) {
      this.recalculateDegree();
    }
  }

  /**
   * Recalculates the degree of the polynomial.
   */
  recalculateDegree() {
    for (let power = MAX_DEGREE; power >= 1; power--) {
      if (this.coefficients[power] != null) {
        this.degree = power;
        break;
      }
    }
    this.degree = 0;
  }

  /**
   * Gets the power of the polynomial in descending orders.
   * @returns {Array} An array containing the power of the polynomial in descending orders.
   */
  descendingPowers() {
    return Object.keys(this.coefficients)
      .filter((power) => this.coefficients[power] != null)
      .sort((a, b) => {
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
        } else if (coefficient instanceof ComplexLine || coefficient instanceof ComplexCircle) {
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
    if (mathML == "") {
      mathML = "<mrow><mn>0</mn></mrow>";
    }
    return mathML;
  }

  /**
   * Convert the polynomial into a flattened array of complex number at the given time.
   * @param {Number} time The time in milliseconds.
   * @returns {Float32Array} The flattened array of complex numbers at the given time.
   */
  toFloat32ArrayAtTime(time) {
    const flattenedArray = [];
    this.getCoefficientPowers().forEach((power) => {
      let complex = this.getCoefficient(power);
      if (
        complex instanceof ComplexCircle ||
        complex instanceof ComplexLine ||
        complex instanceof ComplexMultiplication
      ) {
        complex = complex.getAtTime(time);
      }
      flattenedArray.push(complex.re, complex.im, power);
    });
    for (let i = flattenedArray.length; i < 3 * (MAX_DEGREE + 1); i++) {
      flattenedArray.push(0);
    }
    return new Float32Array(flattenedArray);
  }

  /**
   * Computes and returns the derivative of the polynomial.
   * @returns {Polynomial} The derivative of the polynomial.
   */
  getDerivative() {
    const derivative = new Polynomial();
    this.getCoefficientPowers().forEach((power) => {
      let coefficient = this.getCoefficient(power);
      derivative.setCoefficient(power - 1, coefficient.multipliedBy(power));
    });
    return derivative;
  }

  /**
   * Computes and returns the Newton numerator of the polynomial.
   * @returns {Polynomial} The Newton numerator of the polynomial.
   */
  getNewtonNumerator(newtonCoefficient) {
    const newtonNumerator = new Polynomial();
    const minusNewtonCoefficient = newtonCoefficient.multipliedBy(-1);
    const newtonCoefficientIsComplex = newtonCoefficient instanceof Complex;
    this.getCoefficientPowers().forEach((power) => {
      let coefficient = this.getCoefficient(power);
      if (coefficient instanceof Complex && newtonCoefficientIsComplex) {
        newtonNumerator.setCoefficient(
          power,
          coefficient.multipliedByComplex(minusNewtonCoefficient.plus(Number(power)))
        );
      } else {
        newtonNumerator.setCoefficient(
          power,
          new ComplexMultiplication(coefficient, minusNewtonCoefficient.plus(Number(power)))
        );
      }
    });
    return newtonNumerator;
  }

  /**
   * Computes and returns the list of available powers (powers with null coefficients) in ascending order.
   * @returns {Array} The list of available powers.
   */
  getAvailablePowers() {
    return Object.keys(this.coefficients)
      .filter((power) => this.getCoefficient(power) == null)
      .sort((a, b) => {
        return Number(a) - Number(b);
      });
  }

  /**
   * Computes and returns the list of powers with not null coefficients.
   * @returns {Object} The list of powers with not null coefficients.
   */
  getCoefficientPowers() {
    return Object.keys(this.coefficients).filter((power) => this.getCoefficient(power) != null);
  }

  /**
   * Returns a copy of the polynomial.
   * @returns {Polynomial} The copy of the polynomial.
   */
  copy() {
    const newPolynomial = new Polynomial();
    for (let p = 0; p <= MAX_DEGREE; p++) {
      let coefficient = this.coefficients[p];
      if (coefficient != null) {
        newPolynomial.setCoefficient(p, coefficient.copy());
      }
    }
    return newPolynomial;
  }
}
