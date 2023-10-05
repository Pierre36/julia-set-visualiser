import { RandomUtils } from "../Utils/RandomUtils";
import { Complex } from "./Complex";

export { ComplexCircle };

/**
 * Representation of a circle in the complex plane.
 */
class ComplexCircle {
  /**
   * Complex circle constructor
   * @param {Complex} center The center of the circle.
   * @param {Number} radius The radius of the circle.
   * @param {Number} duration The duration of the animation in milliseconds.
   */
  constructor(center, radius, duration) {
    this.center = center;
    this.radius = radius;
    this.duration = duration;
  }

  /**
   * Creates a complex circle from a JSON.
   * @param {Object} complexCircleJSON An object containing the JSON for a complex circle.
   * @returns The complex circle made from the JSON.
   */
  static fromJSON(complexCircleJSON) {
    return new ComplexCircle(
      Complex.fromJSON(complexCircleJSON["center"]),
      complexCircleJSON["radius"],
      complexCircleJSON["duration"]
    );
  }

  /**
   * Converts a complex circle to a JSON object.
   * @returns {Object} The JSON object constructed from the complex circle.
   */
  toJSON() {
    return {
      center: this.center.toJSON(),
      radius: this.radius,
      duration: this.duration,
    };
  }

  /**
   * Get the value of the point on the circle at the given time.
   * @param {Number} time The time in milliseconds.
   * @returns {Complex} The value of the point on the circle at the given time.
   */
  getAtTime(time) {
    const animTime = ((time % this.duration) / this.duration) * 2 * Math.PI;
    return new Complex(
      this.center.re + this.radius * Math.cos(animTime),
      this.center.im + this.radius * Math.sin(animTime)
    );
  }

  /**
   * Computes a MathML representation of the complex circle.
   * @param {Number} power The power associated with the coefficient.
   * @returns {String} A MathML representation of the complex circle.
   */
  toMathML(power) {
    return `<msub><mi>c</mi><mn>${power}</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>`;
  }

  /**
   * Checks if the complex circle is always 0 + 0i.
   * @returns {Boolean} True if the complex circle is always 0 + 0i.
   */
  isZero() {
    return this.center.isZero() && this.radius == 0;
  }

  /**
   * Checks if the complex circle should be associated with a "-" in an equation.
   * @returns {Boolean} True if the complex circle should be associated with a "-" in an equation (always false).
   */
  showMinus() {
    return false;
  }

  /**
   * Returns a copy of the complex circle.
   * @returns {ComplexCircle} The copy of the complex circle.
   */
  copy() {
    return new ComplexCircle(this.center.copy(), this.radius, this.duration);
  }

  /**
   * Computes and returns the multiplication of the complex circle by a factor.
   * @param {Number} factor The factor to multiply by.
   * @returns {Complex} The complex circle multiplied by the factor.
   */
  multipliedBy(factor) {
    return new ComplexCircle(this.center.multipliedBy(factor), this.radius * factor, this.duration);
  }

  /**
   * Computes and returns the addition of the complex circle and a number.
   * @param {Number} term The number to add.
   * @returns {Complex} The result of the addition.
   */
  plus(term) {
    return new ComplexCircle(this.center.plus(term), this.radius, this.duration);
  }

  /**
   * Returns a random complex circle with the provided settings.
   * @param {Object} centerModulusMinMax An object containing the min and max value of the center modulus.
   * @param {Object} radiusMinMax An object containing the min and max value of the radius.
   * @param {Object} durationMinMax An object containing the min and max value of the duration.
   * @returns {ComplexCircle} The new complex circle.
   */
  static getRandomComplexCircle(centerModulusMinMax, radiusMinMax, durationMinMax) {
    return new ComplexCircle(
      Complex.getRandomComplex(centerModulusMinMax),
      RandomUtils.floatBetween(radiusMinMax.min, radiusMinMax.max),
      RandomUtils.integerBetween(durationMinMax.min, durationMinMax.max) * 1000
    );
  }
}
