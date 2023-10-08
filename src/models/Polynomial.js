import { ComplexCircle } from "./ComplexCircle";
import { ComplexLine } from "./ComplexLine";
import { Complex } from "./Complex";
import { Coefficient } from "./Coefficient";
import { ComplexMultiplication } from "./ComplexMultiplication";
import { RandomUtils } from "../Utils/RandomUtils";

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
    this.arrayRepresentation = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    this._nbCoefficients = 0;
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
      const coefficient = this.getCoefficient(power);
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
    if (this.coefficients[power] == null || this.coefficients[power] == undefined) {
      this.arrayRepresentation[3 * this._nbCoefficients + 2] = Number(power);
      this._nbCoefficients += 1;
    }
    this.coefficients[power] = coefficient;
    this.degree = Math.max(this.degree, power);
  }

  /**
   * Removes the coefficient at a given power by replacing it by null.
   * @param {Number} power The power associated to the wanted coefficient.
   * @throws An error if the power is superior to MAX_DEGREE.
   */
  removeCoefficient(power) {
    console.debug("[>>] Trying to remove coefficient at power %d from %s...", power, this);
    if (power > MAX_DEGREE) {
      console.debug(
        "[KO] Tried to remove a coefficient at power %d but max power is %d",
        power,
        MAX_DEGREE
      );
      throw Error(`The power must be inferior to ${MAX_DEGREE}`);
    }

    if (this.coefficients[power] == null) {
      console.debug("[KO] Tried to remove an inexistent coefficient");
      throw Error(`Tried to remove an inexistent coefficient at power ${power}`);
    }

    // Remove the coefficient
    this.coefficients[power] = null;

    // Update the degree
    if (power == this.degree) {
      this.recalculateDegree();
    }

    // Update the array representation
    let rank;
    for (let n = 0; n < this._nbCoefficients; n++) {
      if (this.arrayRepresentation[3 * n + 2] == power) {
        rank = n;
        break;
      }
    }
    for (let n = rank; n < this._nbCoefficients; n++) {
      if (n == MAX_DEGREE) {
        this.arrayRepresentation[3 * n] = 0;
        this.arrayRepresentation[3 * n + 1] = 0;
        this.arrayRepresentation[3 * n + 2] = 0;
      } else {
        this.arrayRepresentation[3 * n] = this.arrayRepresentation[3 * (n + 1)];
        this.arrayRepresentation[3 * n + 1] = this.arrayRepresentation[3 * (n + 1) + 1];
        this.arrayRepresentation[3 * n + 2] = this.arrayRepresentation[3 * (n + 1) + 2];
      }
    }
    this._nbCoefficients -= 1;
    console.debug("[OK] Successfully removed coefficient. The polynomial is now %s.", this);
  }

  /**
   * Recalculates the degree of the polynomial.
   */
  recalculateDegree() {
    for (let power = MAX_DEGREE; power >= 1; power--) {
      if (this.coefficients[power] != null) {
        this.degree = power;
        return;
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
        } else {
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
   * Evaluates the polynomial at the given time.
   * @param {Number} time The time at which the polynomial is evaluated.
   */
  updateWithTime(time) {
    let power;
    let coefficient;
    for (let n = 0; n < this._nbCoefficients; n++) {
      power = this.arrayRepresentation[3 * n + 2];
      coefficient = this.getCoefficient(power).getAtTime(time);
      this.arrayRepresentation[3 * n] = coefficient.mod();
      this.arrayRepresentation[3 * n + 1] = coefficient.arg();
    }
  }

  /**
   * Computes and returns the derivative of the polynomial.
   * @returns {Polynomial} The derivative of the polynomial.
   */
  getDerivative() {
    const derivative = new Polynomial();
    this.getCoefficientPowers().forEach((power) => {
      if (power > 0) {
        let coefficient = this.getCoefficient(power);
        derivative.setCoefficient(power - 1, coefficient.multipliedBy(power));
      }
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
    this.getCoefficientPowers().forEach((power) => {
      newtonNumerator.setCoefficient(
        power,
        new ComplexMultiplication(
          this.getCoefficient(power),
          minusNewtonCoefficient.plus(Number(power))
        )
      );
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

  /**
   * Returns the array representation of the polynomial.
   * @returns {Array} The array representation of the polynomial.
   */
  getArrayRepresentation() {
    return this.arrayRepresentation;
  }

  /**
   * Returns the number of coefficients of the polynomial.
   * @returns {Number} The number of coefficients of the polynomial.
   */
  getNbCoefficients() {
    return this._nbCoefficients;
  }

  /**
   * Returns a random polynomial with the provided settings.
   * @param {Number} nbCoefficients The number of coefficients of the new polynomial.
   * @param {Set} coefficientTypes A set the available coefficient types.
   * @param {Object} complexModulusMinMax An object containing the min and max value of the modulus for constant coefficients.
   * @param {Object} centerModulusMinMax An object containing the min and max value of the center modulus for circle coefficients.
   * @param {Object} radiusMinMax An object containing the min and max value of the radius for circle coefficients.
   * @param {Object} circleDurationMinMax An object containing the min and max value of the duration for circle coefficients.
   * @param {Object} startEndModulusMinMax An object containing the min and max value of the start and end modulus for line coefficients.
   * @param {Object} lineDurationMinMax An object containing the min and max value of the duration for line coefficients.
   * @returns {Polynomial} The new random polynomial.
   */
  static getRandomPolynomial(
    nbCoefficients,
    coefficientTypes,
    complexModulusMinMax,
    centerModulusMinMax,
    radiusMinMax,
    circleDurationMinMax,
    startEndModulusMinMax,
    lineDurationMinMax
  ) {
    const powers = RandomUtils.distinctIntegersBetween(0, MAX_DEGREE, nbCoefficients);
    const newCoefficients = {};
    for (let power of powers) {
      newCoefficients[power] = Coefficient.getRandomCoefficient(
        coefficientTypes,
        complexModulusMinMax,
        centerModulusMinMax,
        radiusMinMax,
        circleDurationMinMax,
        startEndModulusMinMax,
        lineDurationMinMax
      );
    }
    return new Polynomial(newCoefficients);
  }
}
