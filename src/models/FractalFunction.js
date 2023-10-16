import { Polynomial } from "./Polynomial";
import { ComplexCircle } from "./ComplexCircle";
import { ComplexLine } from "./ComplexLine";
import { Complex } from "./Complex";
import { Coefficient } from "./Coefficient";
import { ComplexMultiplication } from "./ComplexMultiplication";
import { RandomUtils } from "../Utils/RandomUtils";
import { FunctionTypes } from "../enumerations/FunctionTypes";

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
    if (this.functionType == FunctionTypes.NEWTON) {
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
    if (inNumerator) {
      this.numerator.setCoefficient(power, coefficient);
      if (this.functionType == FunctionTypes.NEWTON) {
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
    } else {
      if (this.functionType == FunctionTypes.FRACTION) {
        this.denominator.setCoefficient(power, coefficient);
      } else {
        throw Error(
          "Coefficient should not be inserted in the denominator of NEWTON and DEFAULT functions."
        );
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
    if (inNumerator) {
      this.numerator.removeCoefficient(power);
      if (this.functionType == FunctionTypes.NEWTON) {
        if (power >= 1) {
          this.denominator.removeCoefficient(power - 1);
        }
        this.newtonNumerator.removeCoefficient(power);
      }
    } else {
      if (this.functionType == FunctionTypes.FRACTION) {
        this.denominator.removeCoefficient(power);
      } else {
        throw Error(
          "Coefficient should not be removed from the denominator of NEWTON and DEFAULT functions."
        );
      }
    }
  }

  /**
   * Evaluates the function at the given time.
   * @param {Number} time The time at which the function is evaluated.
   */
  updateWithTime(time) {
    this.numerator.updateWithTime(time);
    this.denominator.updateWithTime(time);
    if (this.functionType == FunctionTypes.NEWTON) {
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
    if (this.functionType == FunctionTypes.NEWTON) {
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
    this.functionType = newFunctionType;
    if (newFunctionType == FunctionTypes.NEWTON) {
      this.newtonCoefficient = new Complex(1, 0);
      this.denominator = this.numerator.getDerivative();
      this.newtonNumerator = this.numerator.getNewtonNumerator(this.newtonCoefficient);
    } else if (
      newFunctionType == FunctionTypes.DEFAULT ||
      newFunctionType == FunctionTypes.FRACTION
    ) {
      this.denominator = new Polynomial({ 0: new Complex(1, 0) });
      this.newtonCoefficient = new Complex(0, 0);
      this.newtonNumerator = new Polynomial();
    } else {
      throw Error(
        `The function type must be "${FunctionTypes.DEFAULT}",  "${FunctionTypes.NEWTON}" or "${FunctionTypes.FRACTION}", got ${newFunctionType}`
      );
    }
  }

  /**
   * Sets the Newton coefficient.
   * @param {Complex | ComplexCircle | ComplexLine} newNewtonCoefficient The new Newton coefficient.
   */
  setNewtonCoefficient(newNewtonCoefficient) {
    this.newtonCoefficient = newNewtonCoefficient;
    if (this.functionType == FunctionTypes.NEWTON) {
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

  /**
   * Computes a MathML representation of the fractal function.
   *
   * @returns {String} A MathML representation of the fractal function.
   */
  toMathML() {
    // Initialize equation
    let mathML = "<math display='block'>";

    // Prepare useful bit of equations
    let ofz = "<mo form='prefix' stretchy='false'>(</mo>";
    ofz += "<mi>z</mi>";
    ofz += "<mo form='postfix' stretchy='false'>)</mo>";
    const p = "<mi>P</mi>";
    const dp = "<msup>" + p + "<mo lspace='0em' rspace='0em' class='tml-prime'>′</mo></msup>";
    const q = "<mi>Q</mi>";

    // Add quantifier
    mathML += "<mrow><mn>∀</mn><mo>z</mo><mo>∈</mo><mi>ℂ</mi><mo separator='true'>,</mo>";
    mathML += "<mspace width='1em'/></mrow>";

    // Add function
    mathML += "<mrow><mi>f</mi>" + ofz + "<mo>=</mo></mrow>";
    if (this.functionType != FunctionTypes.DEFAULT) {
      if (this.functionType == FunctionTypes.NEWTON) {
        mathML += "<mi>z</mi>";
        if (this.newtonCoefficient.showMinus()) {
          mathML += "<mo>+</mo>";
        } else {
          mathML += "<mo>-</mo>";
        }
        if (this.newtonCoefficient instanceof Complex) {
          mathML += this.newtonCoefficient.toMathML(false);
        } else {
          mathML += this.newtonCoefficient.toMathML("N");
        }
      }
      mathML += "<mfrac>";
      mathML += "<mrow>" + p + ofz + "</mrow>";
      if (this.functionType == FunctionTypes.NEWTON) {
        mathML += "<mrow>" + dp + ofz + "</mrow>";
      } else {
        mathML += "<mrow>" + q + ofz + "</mrow>";
      }
      mathML += "</mfrac>";
      mathML += "</math>";
      mathML += "<math display='block'>";
      mathML += "<mrow><mtext>with</mtext><mspace width='0.5em'/>" + p + ofz + "<mo>=</mo></mrow>";
      mathML += this.numerator.toMathML();
      if (this.functionType == FunctionTypes.FRACTION) {
        mathML += "</math><math display='block'>";
        mathML += "<mrow><mtext>and</mtext><mspace width='0.5em'/>" + q + ofz + "<mo>=</mo></mrow>";
        mathML += this.denominator.toMathML();
      }
    } else {
      mathML += this.numerator.toMathML();
    }

    // End and return equation
    mathML += "</math>";
    return mathML;
  }

  /**
   * Returns a random fractal function with the provided settings.
   * @param {Set} functionTypes A set of the function types.
   * @param {Set} coefficientTypes A set the available coefficient types.
   * @param {Object} nbCoefficientsMinMax An object containing the min and max value of the number of coefficients.
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
   * @returns {FractalFunction} The new random fractal function.
   */
  static getRandomFractalFunction(
    functionTypes,
    coefficientTypes,
    nbCoefficientsMinMax,
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
    const newFunctionType = RandomUtils.pickAmong(Array.from(functionTypes));
    const newNewtonCoefficient = Coefficient.getRandomCoefficient(
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
    );
    const nbCoefficients = RandomUtils.integerBetween(
      nbCoefficientsMinMax.min,
      nbCoefficientsMinMax.max
    );
    let nbNumeratorCoefficients;
    if (newFunctionType == FunctionTypes.FRACTION) {
      nbNumeratorCoefficients = RandomUtils.integerBetween(1, nbCoefficients);
    } else {
      nbNumeratorCoefficients = nbCoefficients;
    }
    const newNumerator = Polynomial.getRandomPolynomial(
      nbCoefficients,
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
    );
    let newDenominator;
    if (newFunctionType == FunctionTypes.DEFAULT) {
      newDenominator = new Polynomial({ 0: new Complex(1, 0) });
    } else if (newFunctionType == FunctionTypes.NEWTON) {
      newDenominator = newNumerator.getDerivative();
    } else {
      newDenominator = Polynomial.getRandomPolynomial(
        Math.max(1, nbCoefficients - nbNumeratorCoefficients),
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
      );
    }

    return new FractalFunction(newNumerator, newDenominator, newFunctionType, newNewtonCoefficient);
  }

  /**
   * Returns a String representation of the fractal function.
   * @returns {String} The String representation.
   */
  toString() {
    return `FractalFunction(${this.numerator}, ${this.denominator}, ${this.functionType}, ${this.newtonCoefficient})`;
  }
}
