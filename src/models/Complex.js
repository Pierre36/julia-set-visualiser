export { Complex }

/**
 * Representation of a complex number.
 */
class Complex {
  
  /**
   * Complex constructor
   * @param {Number} re Real part of the complex number.
   * @param {Number} im Imaginary part of the complex number.
   */
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }

  /**
   * Compute the modulus of this complex number.
   * @returns {Number} The modulus.
   */
  mod() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }

  /**
   * Compute the argument of this complex number.
   * @returns {Number} The argument.
   */
  arg() {
    return Math.atan2(this.im, this.re);
  }
}