import ComplexCircle from "@/models/ComplexCircle";
import ComplexLine from "@/models/ComplexLine";
import Complex from "@/models/Complex";
import ComplexEllipse from "@/models/ComplexEllipse";
import Coefficient from "@/models/Coefficient";
import ComplexMultiplication from "@/models/ComplexMultiplication";
import RandomUtils from "@/utils/RandomUtils";
import type CoefficientTypes from "@/constants/CoefficientTypes";

/** Max degree for polynomials */
const MAX_DEGREE = 15;

/**
 * Representation of a complex polynomial.
 */
export default class Polynomial {
  /**
   * Maximum degree of a polynomial.
   */
  public static get MAX_DEGREE() {
    return MAX_DEGREE;
  }

  /** Degree of the polynomial */
  public degree: number;

  /** Array representation of the polynomial */
  private arrayRepresentation: number[];

  /** Coefficients of the polynomial */
  private coefficients: Record<
    number,
    ComplexCircle | ComplexLine | ComplexEllipse | Complex | undefined
  >;

  /** Number of coefficients in the polynomial */
  private coefficientsCount: number;

  /**
   * Polynomial constructor
   *
   * @param coefficients coefficients of the polynomial
   */
  public constructor(
    coefficients: Record<number, ComplexCircle | ComplexLine | ComplexEllipse | Complex | undefined>
  ) {
    this.degree = 0;
    this.arrayRepresentation = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    this.coefficientsCount = 0;
    this.coefficients = {};
    for (let power = 0; power <= MAX_DEGREE; power++) {
      const coefficient = coefficients[power];
      if (coefficient != undefined) {
        this.setCoefficient(power, coefficient);
      } else {
        this.coefficients[power] = undefined;
      }
    }
  }

  /**
   * Create a polynomial from a JSON
   *
   * @param coefficientsJSON object containing the JSON for a polynomial
   * @returns the polynomial made from the coefficients
   * @throws an error if one of the coefficients type is incorrect
   */
  public static fromJSON(coefficientsJSON: any): Polynomial {
    const coefficients: Record<
      number,
      ComplexCircle | ComplexLine | ComplexEllipse | Complex | undefined
    > = {};
    Object.keys(coefficientsJSON).forEach(
      (power) => (coefficients[Number(power)] = Coefficient.fromJSON(coefficientsJSON[power]))
    );
    return new Polynomial(coefficients);
  }

  /**
   * Convert a polynomial to a JSON object
   *
   * @returns the JSON object constructed from the polynomial.
   */
  public toJSON(): any {
    const coefficientsJSON: any = {};
    this.descendingPowers().forEach((power) => {
      coefficientsJSON[power] = Coefficient.toJSON(this.getCoefficient(power));
    });
    return coefficientsJSON;
  }

  /**
   * Return the coefficient at a given power
   *
   * @param power power associated to the wanted coefficient
   * @returns the coefficient
   * @throws an error if the power is superior to MAX_DEGREE
   * @throws an error if the coefficient is not defined for the power
   */
  public getCoefficient(power: number): Complex | ComplexCircle | ComplexLine | ComplexEllipse {
    if (0 > power || power > MAX_DEGREE) {
      throw Error(`The power must be between 0 and ${MAX_DEGREE} included`);
    }
    const coefficient = this.coefficients[power];
    if (coefficient) {
      return coefficient;
    }
    throw Error("No coefficient is defined for this power");
  }

  /**
   * Set the coefficient at a given power
   *
   * @param power power associated to the wanted coefficient
   * @param coefficient new coefficient
   * @throws an error if the power is superior to MAX_DEGREE
   */
  public setCoefficient(
    power: number,
    coefficient: Complex | ComplexCircle | ComplexLine | ComplexEllipse
  ) {
    if (0 > power || power > MAX_DEGREE) {
      throw Error(`The power must be between 0 and ${MAX_DEGREE} included`);
    }

    if (!this.coefficients[power]) {
      this.arrayRepresentation[3 * this.coefficientsCount + 2] = Number(power);
      this.coefficientsCount += 1;
    }

    this.coefficients[power] = coefficient;
    this.degree = Math.max(this.degree, power);
  }

  /**
   * Remove the coefficient at a given power by replacing it by `null`
   *
   * @param power power associated to the wanted coefficient
   * @throws an error if the power is superior to MAX_DEGREE
   */
  public removeCoefficient(power: number): void {
    console.debug("[>>] Trying to remove coefficient at power %d from %s...", power, this);
    if (0 > power || power > MAX_DEGREE) {
      console.debug(
        "[KO] Tried to remove a coefficient at power %d but max power must be in [%d, %d]",
        power,
        0,
        MAX_DEGREE
      );
      throw Error(`The power must be between 0 and ${MAX_DEGREE} included`);
    }

    // Remove the coefficient
    this.coefficients[power] = undefined;

    // Update the degree
    if (power == this.degree) {
      this.recalculateDegree();
    }

    // Update the array representation
    let rank = 0;
    for (let n = 0; n < this.coefficientsCount; n++) {
      if (this.arrayRepresentation[3 * n + 2] == power) {
        rank = n;
        break;
      }
    }
    for (let n = rank; n < this.coefficientsCount; n++) {
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
    this.coefficientsCount -= 1;
    console.debug("[OK] Successfully removed coefficient. The polynomial is now %s.", this);
  }

  /**
   * Recalculate the degree of the polynomial
   */
  private recalculateDegree() {
    for (let power = MAX_DEGREE; power >= 1; power--) {
      if (this.coefficients[power] != null) {
        this.degree = power;
        return;
      }
    }
    this.degree = 0;
  }

  /**
   * Get the power of the polynomial in descending order
   *
   * @returns the power of the polynomial in descending order
   */
  private descendingPowers(): number[] {
    return Object.keys(this.coefficients)
      .map(Number)
      .filter((power) => this.coefficients[power])
      .sort((a, b) => {
        return Number(b) - Number(a);
      });
  }

  /**
   * Compute and return the MathML representation of the polynomial
   *
   * @returns the MathML representation of the polynomial
   */
  public toMathML(): string {
    let mathML = "";
    const descendingPowers = this.descendingPowers();
    let firstNonZeroCoefficient = true;
    for (let i = 0; i < descendingPowers.length; i++) {
      const power = descendingPowers[i];
      const coefficient = this.coefficients[power];

      if (coefficient && !coefficient.isZero()) {
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
   * Evaluate the polynomial at the given time
   *
   * @param time time at which the polynomial is evaluated
   */
  public updateWithTime(time: number): void {
    for (let n = 0; n < this.coefficientsCount; n++) {
      const power = this.arrayRepresentation[3 * n + 2];
      const coefficient = this.getCoefficient(power).getAtTime(time);
      this.arrayRepresentation[3 * n] = coefficient.mod();
      this.arrayRepresentation[3 * n + 1] = coefficient.arg();
    }
  }

  /**
   * Compute and return the derivative of the polynomial
   *
   * @returns {Polynomial} The derivative of the polynomial
   */
  public getDerivative(): Polynomial {
    const derivative = new Polynomial({});
    this.getCoefficientPowers().forEach((power) => {
      if (power > 0) {
        derivative.setCoefficient(power - 1, this.getCoefficient(power).multipliedBy(power));
      }
    });
    return derivative;
  }

  /**
   * Compute and return the Newton numerator for this polynomial
   *
   * @param newtonCoefficient the Newton coefficient
   * @returns the newton numerator for the polynomial
   */
  public getNewtonNumerator(
    newtonCoefficient: Complex | ComplexCircle | ComplexEllipse | ComplexLine
  ): Polynomial {
    const newtonNumerator = new Polynomial({});
    const minusNewtonCoefficient = newtonCoefficient.multipliedBy(-1);
    this.getCoefficientPowers().forEach((power) => {
      newtonNumerator.setCoefficient(
        power,
        ComplexMultiplication.of(
          this.getCoefficient(power),
          minusNewtonCoefficient.plus(Number(power))
        )
      );
    });
    return newtonNumerator;
  }

  /**
   * Compute and return the list of available powers (powers with null coefficients) in ascending order
   *
   * @returns the list of available powers
   */
  public getAvailablePowers(): number[] {
    return Object.keys(this.coefficients)
      .map(Number)
      .filter((power) => this.coefficients[power] === undefined)
      .sort((a, b) => {
        return Number(a) - Number(b);
      });
  }

  /**
   * Compute and return the list of powers with not `null` coefficients
   *
   * @returns the list of powers with not null coefficients
   */
  public getCoefficientPowers(): number[] {
    return Object.keys(this.coefficients)
      .map(Number)
      .filter((power) => this.coefficients[power]);
  }

  /**
   * Get a copy of the polynomial
   *
   * @returns the copy of the polynomial
   */
  public copy(): Polynomial {
    const newPolynomial = new Polynomial({});
    for (let p = 0; p <= MAX_DEGREE; p++) {
      const coefficient = this.coefficients[p];
      if (coefficient != null) {
        newPolynomial.setCoefficient(p, coefficient.copy());
      }
    }
    return newPolynomial;
  }

  /**
   * Get the array representation of the polynomial
   *
   * @returns the array representation of the polynomial
   */
  public getArrayRepresentation(): number[] {
    return this.arrayRepresentation;
  }

  /**
   * Get the number of coefficients of the polynomial
   *
   * @returns the number of coefficients of the polynomial
   */
  public getCoefficientsCount(): number {
    return this.coefficientsCount;
  }

  /**
   * Return a random polynomial with the provided settings
   *
   * @param nbCoefficients number of coefficients of the new polynomial
   * @param coefficientTypes set the available coefficient types
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
   * @returns the new random polynomial
   */
  public static getRandomPolynomial(
    nbCoefficients: number,
    coefficientTypes: Set<CoefficientTypes>,
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
  ): Polynomial {
    const powers = RandomUtils.distinctIntegersBetween(
      0,
      MAX_DEGREE,
      Math.min(nbCoefficients, MAX_DEGREE + 1)
    );
    const newCoefficients: Record<number, Complex | ComplexCircle | ComplexEllipse | ComplexLine> =
      {};
    for (const power of powers) {
      newCoefficients[power] = Coefficient.getRandomCoefficient(
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
    return new Polynomial(newCoefficients);
  }

  /**
   * Return a string representation of the polynomial
   *
   * @returns the String representation
   */
  public toString(): string {
    let string = "";
    const descendingPowers = this.descendingPowers();
    for (let i = 0; i < descendingPowers.length; i++) {
      const power = descendingPowers[i];
      if (i != 0) {
        string += " + ";
      }
      const coefficient = this.coefficients[power];
      if (coefficient) {
        string += coefficient.toString();
        if (power == 1) {
          string += "z";
        } else if (power != 0) {
          string += `z^${power}`;
        }
      }
    }
    if (string == "") {
      string = "0";
    }
    return `Polynomial(${string})`;
  }
}
