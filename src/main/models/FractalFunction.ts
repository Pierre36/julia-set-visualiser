import Polynomial from "@/models/Polynomial";
import Complex from "@/models/Complex";
import CoefficientUtils, { type RandomCoefficientParameters } from "@/models/CoefficientUtils";
import RandomUtils from "@/utils/RandomUtils";
import FunctionTypes from "@/constants/FunctionTypes";
import type Coefficient from "./Coefficient";
import type { JsonSerialisable } from "./JsonSerialisable";

export interface RandomFractalFunctionParameters {
  types: Set<FunctionTypes>;
  minCoefficientsCount: number;
  maxCoefficientsCount: number;
  coefficients: RandomCoefficientParameters;
}

const defaultDenominator = new Polynomial({ 0: new Complex(1, 0) });

/** Representation of a fractal function */
export default class FractalFunction implements JsonSerialisable {
  /**
   * Fractal function constructor
   *
   * @param numerator numerator of the function
   * @param functionType type of the function
   * @param denominator denominator of the function
   * @param newtonCoefficient newton coefficient of the function when it is a function of type Newton
   */
  public constructor(
    private numerator: Polynomial,
    private functionType: FunctionTypes,
    private denominator: Polynomial = new Polynomial({}),
    public newtonCoefficient: Coefficient = new Complex(0, 0)
  ) {
    this.numerator = numerator;

    this.functionType = functionType;

    if (functionType === FunctionTypes.DEFAULT) this.denominator = defaultDenominator.copy();
    if (functionType === FunctionTypes.NEWTON) this.denominator = this.numerator.getDerivative();
    if (functionType === FunctionTypes.FRACTION) this.denominator = denominator;

    this.newtonCoefficient = newtonCoefficient;
  }

  /**
   * Collect the defined coefficients of the fractal function numerator
   *
   * @returns the coefficients of the fractal function numerator
   */
  public getNumeratorCoefficients(): { power: number; coefficient: Coefficient }[] {
    return this.numerator.getCoefficients();
  }

  /**
   * Collect the defined coefficients of the fractal function denominator
   *
   * @returns the coefficients of the fractal function denominator
   */
  public getDenominatorCoefficients(): { power: number; coefficient: Coefficient }[] {
    return this.denominator.getCoefficients();
  }

  /**
   * Get the coefficient at a given power in the numerator or denominator
   *
   * @param power power associated to the wanted coefficient
   * @param inNumerator `true` if the coefficient is from the numerator, `false` otherwise
   * @returns the coefficient or `undefined` it there is no coefficients for the provided power
   */
  public getCoefficient(power: number, inNumerator: boolean): Coefficient | undefined {
    if (inNumerator) return this.numerator.getCoefficient(power);
    return this.denominator.getCoefficient(power);
  }

  /**
   * Set the coefficient at a given power in the numerator or denominator
   *
   * @param power power associated to the wanted coefficient
   * @param coefficient new coefficient
   * @param inNumerator `true` if the coefficient is in the numerator, `false` otherwise
   * @throws an error if the power is outside [0, MAX_DEGREE]
   */
  public setCoefficient(power: number, coefficient: Coefficient, inNumerator: boolean) {
    if (inNumerator) {
      this.numerator.setCoefficient(power, coefficient);
      if (this.functionType === FunctionTypes.NEWTON)
        this.denominator = this.numerator.getDerivative();
    } else {
      if (this.functionType === FunctionTypes.FRACTION)
        this.denominator.setCoefficient(power, coefficient);
    }
  }

  /**
   * Remove the coefficient at a given power in the numerator or denominator
   *
   * @param power power associated to the wanted coefficient.
   * @param inNumerator `true` if the coefficient is in the numerator, `false` otherwise
   */
  public removeCoefficient(power: number, inNumerator: boolean) {
    if (inNumerator) {
      this.numerator.removeCoefficient(power);
      if (this.functionType === FunctionTypes.NEWTON)
        this.denominator = this.numerator.getDerivative();
    } else {
      if (this.functionType === FunctionTypes.FRACTION) this.denominator.removeCoefficient(power);
    }
  }

  /**
   * Get the list of available powers (powers without coefficients) in ascending order in the
   * fractal function numerator
   *
   * @returns the list of available powers in the numerator
   */
  public getNumeratorAvailablePowers(): number[] {
    return this.numerator.getAvailablePowers();
  }

  /**
   * Get the list of available powers (powers without coefficients) in ascending order in the
   * fractal function denominator
   *
   * @returns the list of available powers in the denominator
   */
  public getDenominatorAvailablePowers(): number[] {
    return this.denominator.getAvailablePowers();
  }

  /**
   * Get the fractal function numerator coefficients parameters
   *
   * @returns the ellipse equation parameters of the numerator coefficients
   */
  public getNumeratorCoefficientsEllipseParameters(): number[] {
    return this.numerator.getCoefficientsEllipseParameters();
  }

  /**
   * Get the fractal function denominator coefficients parameters
   *
   * @returns the ellipse equation parameters of the denominator coefficients
   */
  public getDenominatorCoefficientsEllipseParameters(): number[] {
    return this.denominator.getCoefficientsEllipseParameters();
  }

  /**
   * Get the function type
   *
   * @returns the function type
   */
  public getFunctionType() {
    return this.functionType;
  }

  /**
   * Set the function type
   *
   * @param newFunctionType new function type
   */
  public setFunctionType(newFunctionType: FunctionTypes) {
    this.functionType = newFunctionType;
    if (newFunctionType == FunctionTypes.NEWTON) {
      this.newtonCoefficient = new Complex(1, 0);
      this.denominator = this.numerator.getDerivative();
    } else {
      this.newtonCoefficient = new Complex(0, 0);
      this.denominator = defaultDenominator.copy();
    }
  }

  /**
   * Create a fractal function from its JSON representation
   *
   * @param json the JSON to deserialise
   * @returns the fractal function or `undefined` if the JSON is invalid
   */
  public static fromJSON(json: any): FractalFunction | undefined {
    if (json === undefined) return undefined;

    if (json.functionType === undefined || !(json.functionType in FunctionTypes)) return undefined;

    const newtonCoefficient = CoefficientUtils.fromJSON(json.newtonCoefficient);
    if (newtonCoefficient === undefined) return undefined;

    const numerator = Polynomial.fromJSON(json.numerator);
    if (numerator === undefined) return undefined;

    const denominator = Polynomial.fromJSON(json.denominator);
    if (denominator === undefined) return undefined;

    return new FractalFunction(numerator, json.functionType, denominator, newtonCoefficient);
  }

  public toJSON() {
    return {
      numerator: this.numerator.toJSON(),
      denominator: this.denominator.toJSON(),
      functionType: this.functionType,
      newtonCoefficient: this.newtonCoefficient.toJSON(),
    };
  }

  /**
   * Get a string representation of the fractal function
   *
   * @returns {String} the String representation
   */
  public toString(): string {
    return `FractalFunction(${this.numerator}, ${this.denominator}, ${this.functionType}, ${this.newtonCoefficient})`;
  }

  // TODO Try to simplify this
  /**
   * Compute a MathML representation of the fractal function
   *
   * @returns a MathML representation of the fractal function
   */
  public toMathML(): string {
    // Initialise equation
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
        if (this.newtonCoefficient.hasMinus()) {
          mathML += "<mo>+</mo>";
        } else {
          mathML += "<mo>-</mo>";
        }
        if (this.newtonCoefficient instanceof Complex) {
          mathML += this.newtonCoefficient.toMathML(undefined, false);
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
   * Copy the function
   *
   * @returns a copy of the function
   */
  public copy(): FractalFunction {
    return new FractalFunction(
      this.numerator.copy(),
      this.functionType,
      this.denominator.copy(),
      this.newtonCoefficient.copy()
    );
  }

  /**
   * Return a random fractal function with the provided settings
   *
   * @param params parameters of the random fractal function
   * @returns the new random fractal function
   */
  public static getRandomFractalFunction(params: RandomFractalFunctionParameters): FractalFunction {
    const newFunctionType = RandomUtils.pickAmong(Array.from(params.types));
    const newNewtonCoefficient = CoefficientUtils.getRandomCoefficient(params.coefficients);
    const coefficientsCount = RandomUtils.integerBetween(
      params.minCoefficientsCount,
      params.maxCoefficientsCount
    );

    const numeratorCoefficientsCount =
      newFunctionType === FunctionTypes.FRACTION
        ? RandomUtils.integerBetween(1, coefficientsCount)
        : coefficientsCount;

    const newNumerator = Polynomial.getRandomPolynomial({
      coefficientsCount: numeratorCoefficientsCount,
      coefficients: params.coefficients,
    });

    let newDenominator;
    if (newFunctionType === FunctionTypes.FRACTION) {
      newDenominator = Polynomial.getRandomPolynomial({
        coefficientsCount: Math.max(1, coefficientsCount - numeratorCoefficientsCount),
        coefficients: params.coefficients,
      });
    }

    return new FractalFunction(newNumerator, newFunctionType, newDenominator, newNewtonCoefficient);
  }
}
