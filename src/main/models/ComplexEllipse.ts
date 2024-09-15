import RandomUtils from "@/utils/RandomUtils";
import Complex from "@/models/Complex";

/**
 * Representation of a ellipse in the complex plane.
 */
export default class ComplexEllipse {
  /**
   * Complex ellipse constructor
   *
   * @param center center of the ellipse
   * @param halfWidth half-width of the ellipse
   * @param halfHeight half-height of the ellipse
   * @param rotationAngle rotation angle of the ellipse (in degrees)
   * @param duration duration of the animation in milliseconds.
   */
  public constructor(
    public center: Complex,
    public halfWidth: number,
    public halfHeight: number,
    public rotationAngle: number,
    public duration: number
  ) {}

  /**
   * Create a complex ellipse from a JSON
   *
   * @param complexEllipseJSON object containing the JSON for a complex ellipse
   * @returns the complex ellipse made from the JSON
   */
  public static fromJSON(complexEllipseJSON: any): ComplexEllipse {
    return new ComplexEllipse(
      Complex.fromJSON(complexEllipseJSON["center"]) || new Complex(0, 0),
      complexEllipseJSON["halfWidth"],
      complexEllipseJSON["halfHeight"],
      complexEllipseJSON["rotationAngle"],
      complexEllipseJSON["duration"]
    );
  }

  /**
   * Convert a complex ellipse to a JSON object
   *
   * @returns the JSON object constructed from the complex ellipse
   */
  public toJSON(): any {
    return {
      center: this.center.toJSON(),
      halfWidth: this.halfWidth,
      halfHeight: this.halfHeight,
      rotationAngle: this.rotationAngle,
      duration: this.duration,
    };
  }

  /**
   * Compute a MathML representation of the complex ellipse
   *
   * @param power power associated with the coefficient
   * @returns a MathML representation of the complex ellipse
   */
  public toMathML(power: number | string): string {
    return `<msub><mi>e</mi><mn>${power}</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>`;
  }

  /**
   * Check if the complex ellipse is always 0 + 0i
   *
   * @returns `true` if the complex ellipse is always 0 + 0i, `false` otherwise
   */
  public isZero(): boolean {
    return this.center.isZero() && this.halfWidth == 0 && this.halfHeight == 0;
  }

  /**
   * Check if the complex ellipse should be associated with a "-" in an equation
   *
   * @returns `false`
   */
  public showMinus(): boolean {
    return false;
  }

  /**
   * Return a copy of the complex ellipse
   *
   * @returns the copy of the complex ellipse
   */
  public copy(): ComplexEllipse {
    return new ComplexEllipse(
      this.center.copy(),
      this.halfWidth,
      this.halfHeight,
      this.rotationAngle,
      this.duration
    );
  }

  /**
   * Compute and return the multiplication of the complex ellipse by a factor
   *
   * @param factor factor to multiply by
   * @returns the complex ellipse multiplied by the factor
   */
  public multipliedBy(factor: number): ComplexEllipse {
    return new ComplexEllipse(
      this.center.multipliedBy(factor),
      this.halfWidth * factor,
      this.halfHeight * factor,
      this.rotationAngle,
      this.duration
    );
  }

  /**
   * Return a random complex ellipse with the provided settings
   *
   * @param centerModulusMinMax object containing the min and max value of the center modulus
   * @param halfWidthMinMax object containing the min and max value of the half-width
   * @param halfHeightMinMax object containing the min and max value of the half-height
   * @param rotationAngleMinMax object containing the min and max value of the rotation angle
   * @param durationMinMax object containing the min and max value of the duration
   * @returns the new complex ellipse
   */
  public static getRandomComplexEllipse(
    centerModulusMinMax: { min: number; max: number },
    halfWidthMinMax: { min: number; max: number },
    halfHeightMinMax: { min: number; max: number },
    rotationAngleMinMax: { min: number; max: number },
    durationMinMax: { min: number; max: number }
  ): ComplexEllipse {
    return new ComplexEllipse(
      Complex.getRandomComplex(centerModulusMinMax),
      RandomUtils.floatBetween(halfWidthMinMax.min, halfWidthMinMax.max),
      RandomUtils.floatBetween(halfHeightMinMax.min, halfHeightMinMax.max),
      RandomUtils.floatBetween(rotationAngleMinMax.min, rotationAngleMinMax.max),
      RandomUtils.integerBetween(durationMinMax.min, durationMinMax.max) * 1000
    );
  }

  /**
   * Returns a string representation of the ellipse
   *
   * @returns the string representation
   */
  public toString(): string {
    return `ComplexEllipse(${this.center}, ${this.halfWidth}, ${this.halfHeight}, ${this.rotationAngle}, ${this.duration})`;
  }

  // TODO Add test
  /**
   * Get the ellipsis parameters corresponding to the complex ellipsis (duration, angle, half-width,
   * half-height, offset modulus and offset argument)
   *
   * @returns the ellipsis parameters
   */
  public getEllipsisParameters(): number[] {
    return [
      this.duration,
      this.rotationAngle,
      this.halfWidth,
      this.halfHeight,
      this.center.mod(),
      this.center.arg(),
    ];
  }
}
