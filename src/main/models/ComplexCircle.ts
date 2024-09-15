import RandomUtils from "@/utils/RandomUtils";
import Complex from "@/models/Complex";

/**
 * Representation of a circle in the complex plane.
 */
export default class ComplexCircle {
  /**
   * Complex circle constructor
   *
   * @param centre centre of the circle
   * @param radius radius of the circle
   * @param duration duration of the animation in milliseconds
   */
  public constructor(public centre: Complex, public radius: number, public duration: number) {}

  /**
   * Create a complex circle from a JSON
   *
   * @param complexCircleJSON object containing the JSON for a complex circle
   * @returns the complex circle made from the JSON.
   */
  public static fromJSON(complexCircleJSON: any): ComplexCircle {
    return new ComplexCircle(
      Complex.fromJSON(complexCircleJSON["centre"]) || new Complex(0, 0),
      complexCircleJSON["radius"],
      complexCircleJSON["duration"]
    );
  }

  /**
   * Convert a complex circle to a JSON object
   *
   * @returns the JSON object constructed from the complex circle.
   */
  public toJSON(): any {
    return {
      centre: this.centre.toJSON(),
      radius: this.radius,
      duration: this.duration,
    };
  }

  /**
   * Compute a MathML representation of the complex circle
   *
   * @param power power associated with the coefficient
   * @returns a MathML representation of the complex circle
   */
  public toMathML(power: number | string): string {
    return `<msub><mi>c</mi><mn>${power}</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>`;
  }

  /**
   * Check if the complex circle is always 0 + 0i
   *
   * @returns `true` if the complex circle is always 0 + 0i, `false` otherwise
   */
  public isZero(): boolean {
    return this.centre.isZero() && this.radius == 0;
  }

  /**
   * Check if the complex circle should be associated with a "-" in an equation
   *
   * @returns `false`
   */
  public showMinus(): boolean {
    return false;
  }

  /**
   * Return a copy of the complex circle
   *
   * @returns the copy of the complex circle
   */
  public copy(): ComplexCircle {
    return new ComplexCircle(this.centre.copy(), this.radius, this.duration);
  }

  /**
   * Compute and return the multiplication of the complex circle by a factor
   *
   * @param factor factor to multiply by
   * @returns the complex circle multiplied by the factor
   */
  public multipliedBy(factor: number): ComplexCircle {
    return new ComplexCircle(this.centre.multipliedBy(factor), this.radius * factor, this.duration);
  }

  /**
   * Return a random complex circle with the provided settings
   *
   * @param centreModulusMinMax object containing the min and max value of the centre modulus
   * @param radiusMinMax object containing the min and max value of the radius
   * @param durationMinMax object containing the min and max value of the duration
   * @returns the new complex circle.
   */
  public static getRandomComplexCircle(
    centreModulusMinMax: { min: number; max: number },
    radiusMinMax: { min: number; max: number },
    durationMinMax: { min: number; max: number }
  ): ComplexCircle {
    return new ComplexCircle(
      Complex.getRandomComplex(centreModulusMinMax),
      RandomUtils.floatBetween(radiusMinMax.min, radiusMinMax.max),
      RandomUtils.integerBetween(durationMinMax.min, durationMinMax.max) * 1000
    );
  }

  /**
   * Return a string representation of the circle
   *
   * @returns the String representation
   */
  public toString(): string {
    return `ComplexCircle(${this.centre}, ${this.radius}, ${this.duration})`;
  }

  // TODO Add test
  /**
   * Get the ellipse parameters corresponding to the complex circle (duration, angle, half-width,
   * half-height, offset modulus and offset argument)
   *
   * @returns the ellipse parameters
   */
  public getEllipseParameters(): number[] {
    return [this.duration, 0, this.radius, this.radius, this.centre.mod(), this.centre.arg()];
  }
}
