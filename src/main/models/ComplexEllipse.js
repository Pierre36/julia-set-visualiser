import { RandomUtils } from "@/utils/RandomUtils";
import { Complex } from "./Complex";

export { ComplexEllipse };

/**
 * Representation of a ellipse in the complex plane.
 */
class ComplexEllipse {
  /**
   * Complex ellipse constructor
   * @param {Complex} center The center of the ellipse.
   * @param {Number} halfWidth The half-width of the ellipse.
   * @param {Number} halfHeight The half-height of the ellipse.
   * @param {Number} rotationAngle The rotation angle of the ellipse (in degrees).
   * @param {Number} duration The duration of the animation in milliseconds.
   */
  constructor(center, halfWidth, halfHeight, rotationAngle, duration) {
    this.center = center;
    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
    this.rotationAngle = rotationAngle;
    this.duration = duration;
  }

  /**
   * Creates a complex ellipse from a JSON.
   * @param {Object} complexEllipseJSON An object containing the JSON for a complex ellipse.
   * @returns The complex ellipse made from the JSON.
   */
  static fromJSON(complexEllipseJSON) {
    return new ComplexEllipse(
      Complex.fromJSON(complexEllipseJSON["center"]),
      complexEllipseJSON["halfWidth"],
      complexEllipseJSON["halfHeight"],
      complexEllipseJSON["rotationAngle"],
      complexEllipseJSON["duration"]
    );
  }

  /**
   * Converts a complex ellipse to a JSON object.
   * @returns {Object} The JSON object constructed from the complex ellipse.
   */
  toJSON() {
    return {
      center: this.center.toJSON(),
      halfWidth: this.halfWidth,
      halfHeight: this.halfHeight,
      rotationAngle: this.rotationAngle,
      duration: this.duration,
    };
  }

  /**
   * Get the value of the point on the ellipse at the given time.
   * @param {Number} time The time in milliseconds.
   * @returns {Complex} The value of the point on the ellipse at the given time.
   */
  getAtTime(time) {
    const animTime = ((time % this.duration) / this.duration) * 2 * Math.PI;
    const rotationAngleRadians = (this.rotationAngle * Math.PI) / 180;
    const rotationComplex = new Complex(
      Math.cos(rotationAngleRadians),
      Math.sin(rotationAngleRadians)
    );
    return new Complex(
      this.center.re + this.halfWidth * Math.cos(animTime),
      this.center.im + this.halfHeight * Math.sin(animTime)
    ).multipliedByComplex(rotationComplex);
  }

  /**
   * Computes a MathML representation of the complex ellipse.
   * @param {Number} power The power associated with the coefficient.
   * @returns {String} A MathML representation of the complex ellipse.
   */
  toMathML(power) {
    return `<msub><mi>e</mi><mn>${power}</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>`;
  }

  /**
   * Checks if the complex ellipse is always 0 + 0i.
   * @returns {Boolean} True if the complex ellipse is always 0 + 0i.
   */
  isZero() {
    return this.center.isZero() && this.halfWidth == 0 && this.halfHeight == 0;
  }

  /**
   * Checks if the complex ellipse should be associated with a "-" in an equation.
   * @returns {Boolean} True if the complex ellipse should be associated with a "-" in an equation (always false).
   */
  showMinus() {
    return false;
  }

  /**
   * Returns a copy of the complex ellipse.
   * @returns {ComplexEllipse} The copy of the complex ellipse.
   */
  copy() {
    return new ComplexEllipse(
      this.center.copy(),
      this.halfWidth,
      this.halfHeight,
      this.rotationAngle,
      this.duration
    );
  }

  /**
   * Computes and returns the multiplication of the complex ellipse by a factor.
   * @param {Number} factor The factor to multiply by.
   * @returns {Complex} The complex ellipse multiplied by the factor.
   */
  multipliedBy(factor) {
    return new ComplexEllipse(
      this.center.multipliedBy(factor),
      this.halfWidth * factor,
      this.halfHeight * factor,
      this.rotationAngle,
      this.duration
    );
  }

  /**
   * Computes and returns the addition of the complex ellipse and a number.
   * @param {Number} term The number to add.
   * @returns {Complex} The result of the addition.
   */
  plus(term) {
    return new ComplexEllipse(
      this.center.plus(term),
      this.halfWidth,
      this.halfHeight,
      this.rotationAngle,
      this.duration
    );
  }

  /**
   * Returns a random complex ellipse with the provided settings.
   * @param {Object} centerModulusMinMax An object containing the min and max value of the center modulus.
   * @param {Object} halfWidthMinMax An object containing the min and max value of the half-width.
   * @param {Object} halfHeightMinMax An object containing the min and max value of the half-height.
   * @param {Object} rotationAngleMinMax An object containing the min and max value of the rotation angle.
   * @param {Object} durationMinMax An object containing the min and max value of the duration.
   * @returns {ComplexEllipse} The new complex ellipse.
   */
  static getRandomComplexEllipse(
    centerModulusMinMax,
    halfWidthMinMax,
    halfHeightMinMax,
    rotationAngleMinMax,
    durationMinMax
  ) {
    return new ComplexEllipse(
      Complex.getRandomComplex(centerModulusMinMax),
      RandomUtils.floatBetween(halfWidthMinMax.min, halfWidthMinMax.max),
      RandomUtils.floatBetween(halfHeightMinMax.min, halfHeightMinMax.max),
      RandomUtils.floatBetween(rotationAngleMinMax.min, rotationAngleMinMax.max),
      RandomUtils.integerBetween(durationMinMax.min, durationMinMax.max) * 1000
    );
  }

  /**
   * Returns a String representation of the ellipse.
   * @returns {String} The String representation.
   */
  toString() {
    return `ComplexEllipse(${this.center}, ${this.halfWidth}, ${this.halfHeight}, ${this.rotationAngle}, ${this.duration})`;
  }
}
