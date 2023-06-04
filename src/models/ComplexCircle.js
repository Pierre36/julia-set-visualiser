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
}
