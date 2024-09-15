import RandomUtils from "@/utils/RandomUtils";
import Complex from "@/models/Complex";

/**
 * Representation of a line in the complex plane.
 */
export default class ComplexLine {
  /**
   * Complex line constructor
   *
   * @param start start of the line
   * @param end end of the line
   * @param duration duration of the animation in milliseconds
   */
  public constructor(public start: Complex, public end: Complex, public duration: number) {}

  /**
   * Create a complex line from a JSON
   *
   * @param complexLineJSON object containing the JSON for a complex line.
   * @returns the complex line made from the JSON.
   */
  public static fromJSON(complexLineJSON: any): ComplexLine {
    return new ComplexLine(
      Complex.fromJSON(complexLineJSON["start"]) || new Complex(0, 0),
      Complex.fromJSON(complexLineJSON["end"]) || new Complex(0, 0),
      complexLineJSON["duration"]
    );
  }

  /**
   * Convert a complex line to a JSON object
   *
   * @returns the JSON object constructed from the complex line
   */
  public toJSON(): any {
    return {
      start: this.start.toJSON(),
      end: this.end.toJSON(),
      duration: this.duration,
    };
  }

  /**
   * Compute a MathML representation of the complex line
   *
   * @param power power associated with the coefficient
   * @returns a MathML representation of the complex line
   */
  public toMathML(power: number | string): string {
    return `<msub><mi>l</mi><mn>${power}</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>`;
  }

  /**
   * Check if the complex line is always 0 + 0i
   *
   * @returns `true` if the complex line is always 0 + 0i, `false` otherwise
   */
  public isZero(): boolean {
    return this.start.isZero() && this.end.isZero();
  }

  /**
   * Check if the complex line should be associated with a "-" in an equation
   *
   * @returns `false`
   */
  public showMinus(): boolean {
    return false;
  }

  /**
   * Return a copy of the complex line
   *
   * @returns a copy of the complex line
   */
  public copy(): ComplexLine {
    return new ComplexLine(this.start.copy(), this.end.copy(), this.duration);
  }

  /**
   * Compute and return the multiplication of the complex line by a factor
   *
   * @param factor The factor to multiply by
   * @returns the complex line multiplied by the factor
   */
  public multipliedBy(factor: number): ComplexLine {
    return new ComplexLine(
      this.start.multipliedBy(factor),
      this.end.multipliedBy(factor),
      this.duration
    );
  }

  /**
   * Return a random complex line with the provided settings
   *
   * @param startEndModulusMinMax object containing the min and max value of the radius
   * @param durationMinMax object containing the min and max value of the duration
   * @returns the new complex line.
   */
  public static getRandomComplexLine(
    startEndModulusMinMax: { min: number; max: number },
    durationMinMax: { min: number; max: number }
  ): ComplexLine {
    return new ComplexLine(
      Complex.getRandomComplex(startEndModulusMinMax),
      Complex.getRandomComplex(startEndModulusMinMax),
      RandomUtils.integerBetween(durationMinMax.min, durationMinMax.max) * 1000
    );
  }

  /**
   * Return a String representation of the complex line
   *
   * @returns the String representation
   */
  public toString(): string {
    return `ComplexLine(${this.start}, ${this.end}, ${this.duration})`;
  }

  // TODO Add test
  /**
   * Get the ellipse parameters corresponding to the complex line (duration, angle, half-width,
   * half-height, offset modulus and offset argument)
   *
   * @returns the ellipse parameters
   */
  public getEllipseParameters(): number[] {
    const centre = this.getCentre();
    const centredLineEnd = new Complex(this.end.re - centre.re, this.end.im - centre.im);
    return [
      this.duration,
      centredLineEnd.arg(),
      centredLineEnd.mod(),
      0,
      centre.mod(),
      centre.arg(),
    ];
  }

  /**
   * Get the centre of the line
   *
   * @returns the centre of the line
   */
  private getCentre(): Complex {
    return new Complex((this.start.re + this.end.re) / 2, (this.start.im + this.end.im) / 2);
  }
}
