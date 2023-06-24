export { Complex };

const COMPLEX_REGEX =
  /^\s*(?:(-?\d+(?:\.\d+)?)|(-?\d*|\d+\.\d+)i|(-?\d+(?:\.\d+)?)\s*([+-])\s*(\d*|\d+\.\d+)i)\s*$/;

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
   * Creates a complex number from a JSON.
   * @param {Object} complexJSON An object containing the JSON for a complex number.
   * @returns The complex number made from the JSON.
   */
  static fromJSON(complexJSON) {
    if (complexJSON == null) {
      return null;
    } else {
      return new Complex(complexJSON["re"], complexJSON["im"]);
    }
  }

  /**
   * Converts a complex to a JSON object.
   * @returns {Object} The JSON object constructed from the complex.
   */
  toJSON() {
    return {
      re: this.re,
      im: this.im,
    };
  }

  /**
   * Tries to convert a string to a complex number.
   * @param {String} complexString A string representing a complex number.
   * @returns The complex number corresponding to the string.
   * @throws an error if the provided string does not match the complex regex.
   */
  static fromString(complexString) {
    // Prepare the error in case the conversion fails
    const error = Error("The provided string could not be parsed into a complex number.");

    // Try to match the complex string with the regex of a complex number
    const match = complexString.match(COMPLEX_REGEX);

    if (match == null) {
      throw error;
    }

    // If only the real part is provided
    if (match[1] != undefined) {
      return new Complex(Number(match[1]), 0);
    }

    // If only the imaginary part is provided
    if (match[2] != undefined) {
      if (match[2] == "") {
        return new Complex(0, 1);
      } else if (match[2] == "-") {
        return new Complex(0, -1);
      } else {
        return new Complex(0, Number(match[2]));
      }
    }

    // If both the real and imaginary parts are provided
    let complex = new Complex(Number(match[3]), 0);
    if (match[5] == "") {
      complex.im = 1;
    } else {
      complex.im = Number(match[5]);
    }
    if (match[4] == "-") {
      complex.im = -complex.im;
    }
    return complex;
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
        if (displayedIm != 1) {
          mathML += `<mn>${displayedIm}</mn>`;
        }
        mathML += "<mi>i</mi><mo form='prefix' stretchy='false'>)</mo>";
        return mathML;
      } else {
        if (displayedIm == 1) {
          return "<mi>i</mi>";
        } else if (displayedIm == -1) {
          return "<mo>-</mo><mi>i</mi>";
        } else {
          return `<mn>${displayedIm}</mn><mi>i</mi>`;
        }
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
   * Computes and returns a string representing the complex number.
   * @returns {String} A string representing this complex number
   */
  toString() {
    if (this.im != 0) {
      if (this.re != 0) {
        let string = String(this.re);
        if (this.im >= 0) {
          string += " + ";
          if (this.im != 1) {
            string += String(this.im);
          }
        } else {
          string += " - ";
          if (this.im != -1) {
            string += String(-this.im);
          }
        }
        string += "i";
        return string;
      } else {
        if (this.im == 1) {
          return "i";
        } else if (this.im == -1) {
          return "-i";
        } else {
          return `${this.im}i`;
        }
      }
    } else {
      return String(this.re);
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
