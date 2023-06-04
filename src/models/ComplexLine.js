import { Complex } from "./Complex";

export { ComplexLine };

/**
 * Representation of a line in the complex plane.
 */
class ComplexLine {
  /**
   * Complex circle constructor
   * @param {Complex} start The start of the line.
   * @param {Complex} end The end of the line.
   * @param {Number} duration The duration of the animation in milliseconds.
   */
  constructor(start, end, duration) {
    this.start = start;
    this.end = end;
    this.duration = duration;
  }

  /**
   * Get the value of the point on the line at the given time.
   * @param {Number} time The time in milliseconds.
   * @returns {Complex} The value of the point on the line at the given time.
   */
  getAtTime(time) {
    const animTime = (time % this.duration) / this.duration;
    if (animTime < 0.5) {
      return new Complex(
        this.start.re + 2 * animTime * (this.end.re - this.start.re),
        this.start.im + 2 * animTime * (this.end.im - this.start.im)
      );
    } else {
      return new Complex(
        this.end.re - (2 * animTime - 1) * (this.end.re - this.start.re),
        this.end.im + (2 * animTime - 1) * (this.end.im - this.start.im)
      );
    }
  }

  /**
   * Computes a MathML representation of the complex circle.
   * @param {Number} power The power associated with the coefficient.
   * @returns {String} A MathML representation of the complex circle.
   */
  toMathML(power) {
    return `<msub><mi>l</mi><mn>${power}</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>`;
  }

  /**
   * Checks if the complex line is always 0 + 0i.
   * @returns {Boolean} True if the complex line is always 0 + 0i.
   */
  isZero() {
    return this.start.isZero() && this.end.isZero();
  }

  /**
   * Checks if the complex line should be associated with a "-" in an equation.
   * @returns {Boolean} True if the complex line should be associated with a "-" in an equation (always false).
   */
  showMinus() {
    return false;
  }
}