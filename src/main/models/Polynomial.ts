import CoefficientUtils, { type RandomCoefficientParameters } from "@/models/CoefficientUtils";
import RandomUtils from "@/utils/RandomUtils";
import type Coefficient from "@/models/Coefficient";
import type { JsonSerialisable } from "./JsonSerialisable";

export interface RandomPolynomialParameters {
  coefficientsCount: number;
  coefficients: RandomCoefficientParameters;
}

/** Representation of a complex polynomial */
export default class Polynomial implements JsonSerialisable {
  /** Maximum degree of a polynomial */
  public static get MAX_DEGREE() {
    return 15;
  }

  /** Coefficients of the polynomial */
  private coefficients: (Coefficient | undefined)[];

  /**
   * Polynomial constructor
   *
   * @param coefficients coefficients of the polynomial by power
   */
  public constructor(coefficients: Record<number, Coefficient>) {
    this.coefficients = [];
    for (let power = 0; power <= Polynomial.MAX_DEGREE; power++) {
      this.coefficients[power] = coefficients[power];
    }
  }

  /**
   * Collect the defined coefficients of the polynomial
   *
   * @returns the coefficients of the polynomial
   */
  public getCoefficients(): { power: number; coefficient: Coefficient }[] {
    const result: { power: number; coefficient: Coefficient }[] = [];
    this.coefficients.forEach((coefficient, power) => {
      if (coefficient !== undefined) result.push({ power, coefficient });
    });
    return result;
  }

  /**
   * Return the coefficient at a given power
   *
   * @param power power associated to the wanted coefficient
   * @returns the coefficient or `undefined` it there is no coefficients for the provided power
   */
  public getCoefficient(power: number): Coefficient | undefined {
    if (0 > power || power > Polynomial.MAX_DEGREE) {
      return undefined;
    }
    return this.coefficients[power];
  }

  /**
   * Set the coefficient at a given power
   *
   * @param power power associated to the wanted coefficient
   * @param coefficient new coefficient
   * @throws an error if the power is outside [0, MAX_DEGREE]
   */
  public setCoefficient(power: number, coefficient: Coefficient) {
    if (0 > power || power > Polynomial.MAX_DEGREE) {
      throw Error(`Expected power within [0, ${Polynomial.MAX_DEGREE}], received ${power}`);
    }
    this.coefficients[power] = coefficient;
  }

  /**
   * Remove the coefficient at a given power
   *
   * @param power power associated to the wanted coefficient
   */
  public removeCoefficient(power: number): void {
    if (0 <= power && power <= Polynomial.MAX_DEGREE) this.coefficients[power] = undefined;
  }

  /**
   * Compute the derivative of the polynomial
   *
   * @returns {Polynomial} the derivative of the polynomial
   */
  public getDerivative(): Polynomial {
    const derivative = new Polynomial({});
    this.getCoefficients().forEach(({ power, coefficient }) => {
      if (power > 0) derivative.setCoefficient(power - 1, coefficient.multipliedBy(power));
    });
    return derivative;
  }

  /**
   * Get the list of available powers (powers without coefficients) in ascending order
   *
   * @returns the list of available powers
   */
  public getAvailablePowers(): number[] {
    return this.coefficients
      .map((coefficient, power) => (coefficient === undefined ? power : -1))
      .filter((power) => power != -1);
  }

  /**
   * Get the polynomial coefficients parameters
   *
   * @returns the ellipse equation parameters of the polynomial coefficients
   */
  public getCoefficientsEllipseParameters(): number[] {
    return this.coefficients.flatMap(
      (coefficient) => coefficient?.getEllipseParameters() || [0, 0, 0, 0, 0, 0]
    );
  }

  /**
   * Create a polynomial from its JSON representation
   *
   * @param json the JSON to deserialise
   * @returns the polynomial or `undefined` if the JSON is invalid
   */
  public static fromJSON(json: any): Polynomial | undefined {
    if (json === undefined) return undefined;

    const polynomial = new Polynomial({});
    for (const key of Object.keys(json)) {
      const power = Number.parseInt(key);
      if (!Number.isFinite(power)) return undefined;
      if (0 > power || power > Polynomial.MAX_DEGREE) return undefined;

      const coefficient = CoefficientUtils.fromJSON(json[key]);
      if (coefficient === undefined) return undefined;

      polynomial.setCoefficient(power, coefficient);
    }

    return polynomial;
  }

  public toJSON(): any {
    const json: Record<number, Coefficient> = {};
    this.getCoefficients().forEach(
      ({ power, coefficient }) => (json[power] = coefficient.toJSON())
    );
    return json;
  }

  /**
   * Return a string representation of the polynomial
   *
   * @returns the String representation
   */
  public toString(): string {
    const string = this.getCoefficients().reduce(
      (string, { power, coefficient }) =>
        coefficient.toString() +
        (power > 0 ? "z" : "") +
        (power > 1 ? `^${power}` : "") +
        (string !== "" ? " + " : "") +
        string,
      ""
    );
    return `Polynomial(${string || "0"})`;
  }

  /**
   * Compute the MathML representation of the polynomial
   *
   * @returns the MathML representation of the polynomial
   */
  public toMathML(): string {
    let mathML = "";
    this.getCoefficients()
      .reverse()
      .filter(({ power: _, coefficient }) => !coefficient.isZero())
      .forEach(({ power, coefficient }, index) => {
        mathML += index != 0 ? `<mrow><mo>${coefficient.hasMinus() ? "-" : "+"}</mo></mrow>` : "";
        let coefMathML = coefficient.toMathML(power, power == 0);
        coefMathML += power == 1 ? "<mi>z</mi>" : "";
        coefMathML += power > 1 ? `<msup><mi>z</mi><mn>${power}</mn></msup>` : "";
        mathML += `<mrow>${coefMathML}</mrow>`;
      });
    return mathML || "<mrow><mn>0</mn></mrow>";
  }

  /**
   * Copy the polynomial
   *
   * @returns the copy of the polynomial
   */
  public copy(): Polynomial {
    const polynomial = new Polynomial({});
    this.getCoefficients().forEach(({ power, coefficient }) =>
      polynomial.setCoefficient(power, coefficient)
    );
    return polynomial;
  }

  /**
   * Return a random polynomial with the provided settings
   *
   * @param params parameters of the random polynomial
   * @returns the new random polynomial
   */
  public static getRandomPolynomial(params: RandomPolynomialParameters): Polynomial {
    const maxCount = Math.min(params.coefficientsCount, Polynomial.MAX_DEGREE + 1);
    const powers = RandomUtils.distinctIntegersBetween(0, Polynomial.MAX_DEGREE, maxCount);

    const polynomial = new Polynomial({});
    powers.forEach((p) => {
      const coefficient = CoefficientUtils.getRandomCoefficient(params.coefficients);
      polynomial.setCoefficient(p, coefficient);
    });
    return polynomial;
  }
}
