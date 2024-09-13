import Polynomial from "@/models/Polynomial";
import ComplexCircle from "@/models/ComplexCircle";
import ComplexLine from "@/models/ComplexLine";
import Complex from "@/models/Complex";
import Coefficient from "@/models/Coefficient";
import ComplexMultiplication from "@/models/ComplexMultiplication";
import RandomUtils from "@/utils/RandomUtils";
import FunctionTypes from "@/constants/FunctionTypes";
import type ComplexEllipse from "./ComplexEllipse";
import type CoefficientTypes from "@/constants/CoefficientTypes";

/**
 * Representation of a function.
 */
export default class FractalFunction {
  /** Numerator of the Newton fraction if the function is of type Newton */
  public newtonNumerator: Polynomial;

  /**
   * Fractal function constructor
   *
   * @param numerator numerator of the function
   * @param denominator denominator of the function
   * @param functionType type of the function
   * @param newtonCoefficient newton
   * coefficient of the function when it is a function of type Newton
   */
  public constructor(
    public numerator: Polynomial,
    public denominator: Polynomial,
    public functionType: FunctionTypes,
    public newtonCoefficient: ComplexCircle | ComplexLine | Complex | ComplexEllipse
  ) {
    if (this.functionType == FunctionTypes.NEWTON) {
      this.newtonNumerator = this.numerator.getNewtonNumerator(this.newtonCoefficient);
    } else {
      this.newtonNumerator = new Polynomial({});
    }
  }

  /**
   * Create a function from a JSON
   *
   * @param functionJSON object containing the JSON for a function
   * @returns the function made from the JSON
   */
  public static fromJSON({
    numerator,
    denominator,
    functionType,
    newtonCoefficient,
  }: {
    numerator: any;
    denominator: any;
    functionType: any;
    newtonCoefficient: any;
  }): FractalFunction {
    return new FractalFunction(
      Polynomial.fromJSON(numerator),
      Polynomial.fromJSON(denominator),
      functionType,
      Coefficient.fromJSON(newtonCoefficient)
    );
  }

  /**
   * Convert a function to a JSON object
   *
   * @returns the JSON object constructed from the function
   */
  public toJSON() {
    return {
      numerator: this.numerator.toJSON(),
      denominator: this.denominator.toJSON(),
      functionType: this.functionType,
      newtonCoefficient: Coefficient.toJSON(this.newtonCoefficient),
    };
  }

  /**
   * Get the coefficient at a given power in the numerator or the denominator
   *
   * @param power power associated to the wanted coefficient
   * @param inNumerator `true` if the coefficient is from the numerator, `false` otherwise
   * @returns the coefficient
   * @throws an error if the power is superior to MAX_DEGREE or if the coefficient does not exist
   * for the provided power
   */
  public getCoefficient(
    power: number,
    inNumerator: boolean
  ): Complex | ComplexCircle | ComplexLine | ComplexEllipse {
    if (inNumerator) {
      return this.numerator.getCoefficient(power);
    } else {
      return this.denominator.getCoefficient(power);
    }
  }

  /**
   * Set the coefficient at a given power in the numerator or the denominator
   *
   * @param power power associated to the wanted coefficient
   * @param inNumerator `true` if the coefficient is in the numerator, `false` otherwise
   * @param coefficient new coefficient
   * @throws an error if the power is superior to MAX_DEGREE
   * @throws an error if the provided coefficient is undefined
   */
  public setCoefficient(
    power: number,
    inNumerator: boolean,
    coefficient: Complex | ComplexCircle | ComplexLine | ComplexEllipse
  ) {
    if (inNumerator) {
      this.numerator.setCoefficient(power, coefficient);
      if (this.functionType == FunctionTypes.NEWTON) {
        this.newtonNumerator.setCoefficient(
          power,
          ComplexMultiplication.of(
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
   * Remove the coefficient at a given power in the numerator or the denominator
   *
   * @param power power associated to the wanted coefficient.
   * @param inNumerator`true` if the coefficient is in the numerator, `false` otherwise
   * @throws an error if the power is superior to MAX_DEGREE
   * @throws an error if the coefficient should be removed from the numerator when the function type is NEWTON or DEFAULT
   */
  public removeCoefficient(power: number, inNumerator: boolean) {
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
   * Evaluate the function at the given time
   *
   * @param time time at which the function is evaluated
   */
  public updateWithTime(time: number) {
    this.numerator.updateWithTime(time);
    this.denominator.updateWithTime(time);
    if (this.functionType == FunctionTypes.NEWTON) {
      this.newtonNumerator.updateWithTime(time);
    }
  }

  /**
   * Get the number of coefficients in the numerator
   *
   * @returns the number of coefficients in the numerator
   */
  public getNumeratorCoefficientsCount(): number {
    return this.numerator.getCoefficientsCount();
  }

  /**
   * Get the number of coefficients in the denominator
   *
   * @returns the number of coefficients in the denominator
   */
  public getDenominatorCoefficientsCount(): number {
    return this.denominator.getCoefficientsCount();
  }

  /**
   * Get the array representation of the numerator
   *
   * @returns the array representation of the numerator
   */
  public getNumeratorArray(): number[] {
    if (this.functionType == FunctionTypes.NEWTON) {
      return this.newtonNumerator.getArrayRepresentation();
    } else {
      return this.numerator.getArrayRepresentation();
    }
  }

  /**
   * Get the array representation of the denominator
   *
   * @returns the array representation of the denominator
   */
  public getDenominatorArray(): number[] {
    return this.denominator.getArrayRepresentation();
  }

  /**
   * Set the function type
   *
   * @param newFunctionType new function type
   * @throws an error if the new function type is incorrect
   */
  public setFunctionType(newFunctionType: FunctionTypes) {
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
      this.newtonNumerator = new Polynomial({});
    } else {
      throw Error(
        `The function type must be "${FunctionTypes.DEFAULT}",  "${FunctionTypes.NEWTON}" or "${FunctionTypes.FRACTION}", got ${newFunctionType}`
      );
    }
  }

  /**
   * Set the Newton coefficient
   *
   * @param newNewtonCoefficient new Newton coefficient
   */
  public setNewtonCoefficient(
    newNewtonCoefficient: Complex | ComplexCircle | ComplexLine | ComplexEllipse
  ) {
    this.newtonCoefficient = newNewtonCoefficient;
    if (this.functionType == FunctionTypes.NEWTON) {
      this.newtonNumerator = this.numerator.getNewtonNumerator(newNewtonCoefficient);
    }
  }

  /**
   * Return a copy of the function
   *
   * @returns a copy of the function
   */
  public copy(): FractalFunction {
    return new FractalFunction(
      this.numerator.copy(),
      this.denominator.copy(),
      this.functionType,
      this.newtonCoefficient.copy()
    );
  }

  /**
   * Compute a MathML representation of the fractal function
   *
   * @returns a MathML representation of the fractal function
   */
  public toMathML(): string {
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
   * Return a random fractal function with the provided settings
   *
   * @param functionTypes set of the function types
   * @param coefficientTypes set the available coefficient types
   * @param nbCoefficientsMinMax min and max number of coefficients
   * @param complexModulusMinMax min and max modulus for constant coefficients
   * @param circleCenterModulusMinMax min and max center modulus for circle coefficients
   * @param radiusMinMax min and max radius for circle coefficients
   * @param circleDurationMinMax min and max duration for circle coefficients
   * @param startEndModulusMinMax min and max start and end modulus for line coefficients
   * @param lineDurationMinMax min and max duration for line coefficients
   * @param ellipseCenterModulusMinMax min and max center modulus for ellipse coefficients
   * @param halfWidthMinMax min and max half-width for ellipse coefficients
   * @param halfHeightMinMax min and max half-height for ellipse coefficients
   * @param rotationAngleMinMax min and max rotation angle for ellipse coefficients
   * @param ellipseDurationMinMax min and max duration for ellipse coefficients
   * @returns the new random fractal function
   */
  public static getRandomFractalFunction(
    functionTypes: Set<FunctionTypes>,
    coefficientTypes: Set<CoefficientTypes>,
    nbCoefficientsMinMax: { min: number; max: number },
    complexModulusMinMax: { min: number; max: number },
    circleCenterModulusMinMax: { min: number; max: number },
    radiusMinMax: { min: number; max: number },
    circleDurationMinMax: { min: number; max: number },
    startEndModulusMinMax: { min: number; max: number },
    lineDurationMinMax: { min: number; max: number },
    ellipseCenterModulusMinMax: { min: number; max: number },
    halfWidthMinMax: { min: number; max: number },
    halfHeightMinMax: { min: number; max: number },
    rotationAngleMinMax: { min: number; max: number },
    ellipseDurationMinMax: { min: number; max: number }
  ): FractalFunction {
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
  public toString(): string {
    return `FractalFunction(${this.numerator}, ${this.denominator}, ${this.functionType}, ${this.newtonCoefficient})`;
  }
}
