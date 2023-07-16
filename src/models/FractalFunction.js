import { Polynomial } from "./Polynomial";
import { ComplexCircle } from "./ComplexCircle";
import { ComplexLine } from "./ComplexLine";
import { Complex } from "./Complex";
import { Coefficient } from "./Coefficient";
import { ComplexMultiplication } from "./ComplexMultiplication";

export { FractalFunction };

/**
 * Representation of a function.
 */
class FractalFunction {
  /**
   * Fractal function constructor
   * @param {Polynomial} numerator The numerator of the function.
   * @param {Polynomial} denominator The denominator of the function.
   * @param {String} functionType The type of the function.
   * @param {ComplexCircle | ComplexLine | Complex} newtonCoefficient The newton coefficient of the
   * function when it is a function of type Newton.
   */
  constructor(numerator, denominator, functionType, newtonCoefficient) {
    this.numerator = numerator;
    this.denominator = denominator;
    this.functionType = functionType;
    this.newtonCoefficient = newtonCoefficient;
    this.newtonNumerator = new Polynomial();
    if (this.functionType == "NEWTON") {
      this.newtonNumerator = this.numerator.getNewtonNumerator(this.newtonCoefficient);
    }
  }

  /**
   * Creates a function from a JSON.
   * @param {Object} functionJSON An object containing the JSON for a function.
   * @returns {FractalFunction} The function made from the JSON.
   */
  static fromJSON({ numerator, denominator, functionType, newtonCoefficient }) {
    return new FractalFunction(
      Polynomial.fromJSON(numerator),
      Polynomial.fromJSON(denominator),
      functionType,
      Coefficient.fromJSON(newtonCoefficient)
    );
  }

  /**
   * Converts a function to a JSON object.
   * @returns {Object} The JSON object constructed from the function.
   */
  toJSON() {
    return {
      numerator: this.numerator.toJSON(),
      denominator: this.denominator.toJSON(),
      functionType: this.functionType,
      newtonCoefficient: Coefficient.toJSON(this.newtonCoefficient),
    };
  }

  /**
   * Returns the coefficient at a given power in the numerator or the denominator.
   * @param {Number} power The power associated to the wanted coefficient.
   * @param {Boolean} inNumerator Whether the coefficient should be from the numerator or not.
   * @returns {Complex | ComplexCircle | ComplexLine} The coefficient.
   * @throws An error if the power is superior to MAX_DEGREE.
   */
  getCoefficient(power, inNumerator) {
    if (inNumerator) {
      return this.numerator.getCoefficient(power);
    } else {
      return this.denominator.getCoefficient(power);
    }
  }

  /**
   * Sets the coefficient at a given power in the numerator or the denominator.
   * @param {Number} power The power associated to the wanted coefficient.
   * @param {Boolean} inNumerator Whether the coefficient should be from the numerator or not.
   * @param {Complex | ComplexCircle | ComplexLine} coefficient The new coefficient.
   * @throws An error if the power is superior to MAX_DEGREE.
   * @throws An error if the provided coefficient is undefined.
   * @throws An error if the coefficient should be inserted in the numerator when the function type is NEWTON or DEFAULT.
   */
  setCoefficient(power, inNumerator, coefficient) {
    if (!inNumerator) {
      throw Error(
        "Coefficient should not be inserted in the denominator of NEWTON and DEAULT functions."
      );
    }
    this.numerator.setCoefficient(power, coefficient);
    if (this.functionType == "NEWTON") {
      this.newtonNumerator.setCoefficient(
        power,
        new ComplexMultiplication(
          coefficient,
          this.newtonCoefficient.multipliedBy(-1).plus(Number(power))
        )
      );
      if (power >= 1) {
        this.denominator.setCoefficient(power - 1, coefficient.multipliedBy(power));
      }
    }
  }

  /**
   * Removes the coefficient at a given power in the numerator or the denominator.
   * @param {Number} power The power associated to the wanted coefficient.
   * @param {Boolean} inNumerator Whether the coefficient should be from the numerator or not.
   * @throws An error if the power is superior to MAX_DEGREE.
   * @throws An error if the coefficient should be removed from the numerator when the function type is NEWTON or DEFAULT.
   */
  removeCoefficient(power, inNumerator) {
    if (!inNumerator) {
      throw Error(
        "Coefficient should not be removed from the denominator of NEWTON and DEAULT functions."
      );
    }
    this.numerator.removeCoefficient(power);
    if (this.functionType == "NEWTON") {
      if (power >= 1) {
        this.denominator.removeCoefficient(power - 1);
      }
      this.newtonNumerator.removeCoefficient(power);
    }
  }

  /**
   * Evaluates the function at the given time.
   * @param {Number} time The time at which the function is evaluated.
   */
  updateWithTime(time) {
    this.numerator.updateWithTime(time);
    this.denominator.updateWithTime(time);
    if (this.functionType == "NEWTON") {
      this.newtonNumerator.updateWithTime(time);
    }
  }

  /**
   * Returns the number of coefficients in the numerator.
   * @returns {Number} The number of coefficients in the numerator.
   */
  getNumeratorNbCoefficients() {
    return this.numerator.getNbCoefficients();
  }

  /**
   * Returns the number of coefficients in the denominator.
   * @returns {Number} The number of coefficients in the denominator.
   */
  getDenominatorNbCoefficients() {
    return this.denominator.getNbCoefficients();
  }

  /**
   * Returns the array representation of the numerator.
   * @returns {Array} The array representation of the numerator.
   */
  getNumeratorArray() {
    if (this.functionType == "NEWTON") {
      return this.newtonNumerator.getArrayRepresentation();
    } else {
      return this.numerator.getArrayRepresentation();
    }
  }

  /**
   * Returns the array representation of the denominator.
   * @returns {Array} The array representation of the denominator.
   */
  getDenominatorArray() {
    return this.denominator.getArrayRepresentation();
  }

  /**
   * Sets the function type.
   * @param {String} newFunctionType The new function type.
   * @throws An error if the new function type is incorrect.
   */
  setFunctionType(newFunctionType) {
    // TODO
    this.functionType = newFunctionType;
    if (newFunctionType == "NEWTON") {
      this.newtonCoefficient = new Complex(1, 0);
      this.denominator = this.numerator.getDerivative();
      this.newtonNumerator = this.numerator.getNewtonNumerator(this.newtonCoefficient);
    } else if (newFunctionType == "DEFAULT") {
      this.denominator = new Polynomial({ 0: new Complex(1, 0) });
      this.newtonCoefficient = new Complex(0, 0);
      this.newtonNumerator = new Polynomial();
    } else {
      throw Error(`The function type must be "DEFAULT" or "NEWTON", got ${newFunctionType}`);
    }
  }

  /**
   * Sets the Newton coefficient.
   * @param {Complex | ComplexCircle | ComplexLine} newNewtonCoefficient The new Newton coefficient.
   */
  setNewtonCoefficient(newNewtonCoefficient) {
    this.newtonCoefficient = newNewtonCoefficient;
    if (this.functionType == "NEWTON") {
      this.newtonNumerator = this.numerator.getNewtonNumerator(newNewtonCoefficient);
    }
  }

  /**
   * Returns a copy of the function.
   * @returns {FractalFunction} The copy of the function.
   */
  copy() {
    return new FractalFunction(
      this.numerator.copy(),
      this.denominator.copy(),
      this.functionType,
      this.newtonCoefficient.copy()
    );
  }
}