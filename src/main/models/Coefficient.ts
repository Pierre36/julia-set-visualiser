import type { JsonSerialisable } from "./JsonSerialisable";

export default interface Coefficient extends JsonSerialisable {
  /**
   * Check if the coefficient is always 0
   *
   * @returns `true` if the coefficient is 0, `false` otherwise
   */
  isZero(): boolean;

  /**
   * Check if the coefficient should be displayed with a minus in an equation
   *
   * @returns `true` if the complex number should be associated with a "-" in an equation, `false` otherwise
   */
  hasMinus(): boolean;

  /**
   * Compute the multiplication of the coefficient line by a factor
   *
   * @param factor The factor to multiply by
   * @returns the coefficient multiplied by the factor
   */
  multipliedBy(factor: number): Coefficient;

  /**
   * Get the coefficient described as a list of ellipse parameters
   *
   * @returns the ellipse parameters of the coefficient (duration, angle, half-width, half-height,
   * offset modulus and offset argument)
   */
  getEllipseParameters(): number[];

  /**
   * Compute a MathML representation of the coefficient
   *
   * @param power power associated with the coefficient
   * @param showOne `false` if the result should be an empty string for `1`, `true` otherwise
   * @returns a MathML representation of the coefficient
   */
  toMathML(power?: number | string, showOne?: boolean): string;

  /**
   * Deeply copy the coefficient
   *
   * @returns the copy of the coefficient
   */
  copy(): Coefficient;
}
