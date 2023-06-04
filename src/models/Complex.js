export { Complex };

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

  /**
   * Returns a copy of the complex number.
   * @returns {Complex} The copy of the complex number.
   */
  copy() {
    return new Complex(this.re, this.im);
  }

  /**
   * Computes a MathML representation of the complex number.
   *
   * @param {Boolean} showOne If false, when the complex number is 1, the result is an empty String.
   * @returns {String} A MathML representation of the complex number.
   */
  toMathML(showOne = true) {
    var displayedRe = this.re;
    var displayedIm = this.im;
    if (this.showMinus()) {
      displayedRe = -displayedRe;
      displayedIm = -displayedIm;
    }
    if (this.im != 0) {
      if (this.re != 0) {
        let mathML = `<mo form='prefix' stretchy='false'>(</mo><mn>${displayedRe}</mn>`;
        if (this.im < 0) {
          mathML += "<mo>-</mo>";
          displayedIm = -displayedIm;
        } else {
          mathML += "<mo>+</mo>";
        }
        mathML += `<mn>${displayedIm}</mn><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>`;
        return mathML;
      } else {
        return `<mn>${displayedIm}</mn><mi>i</mi>`;
      }
    } else {
      if (!showOne && (this.re == 1 || this.re == -1)) {
        return "";
      } else {
        return `<mn>${displayedRe}</mn>`;
      }
    }
  }

  /**
   * Checks if the complex number is 0 + 0i.
   * @returns {Boolean} True if the complex number is 0 + 0i.
   */
  isZero() {
    return this.re == 0 && this.im == 0;
  }

  /**
   * Checks if the complex number should be associated with a "-" in an equation.
   * @returns {Boolean} True if the complex number should be associated with a "-" in an equation.
   */
  showMinus() {
    return (this.re == 0 || this.im == 0) && this.re <= 0 && this.im <= 0;
  }
}
