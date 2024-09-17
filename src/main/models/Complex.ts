import RandomUtils from "@/utils/RandomUtils";
import NumberUtils from "@/utils/NumberUtils";

const COMPLEX_REGEX =
  /^(?:(-?\d+(?:\.\d+)?)|(-?\d*|-?\d+\.\d+)i|(-?\d+(?:\.\d+)?)([+-])(\d*|\d+\.\d+)i)$/;

/**
 * Representation of a complex number
 */
export default class Complex {
  /**
   * Complex constructor
   *
   * @param re real part of the complex number
   * @param im imaginary part of the complex number
   */
  public constructor(public re: number, public im: number) {}

  /**
   * Create a complex number from a JSON
   *
   * @param complexJSON an object containing the JSON for a complex number
   * @returns the complex number made from the JSON
   */
  public static fromJSON(complexJSON: any): Complex {
    return new Complex(complexJSON.re, complexJSON.im);
  }

  /**
   * Convert a complex to a JSON object
   *
   * @returns the JSON object constructed from the complex
   */
  public toJSON(): any {
    return {
      re: this.re,
      im: this.im,
    };
  }

  /**
   * Convert a string representation of a complex number to a complex number
   *
   * @param complexString a string representing a complex number
   * @returns the complex number corresponding to the string or undefined if the provided string
   * does not match the complex REGEX
   */
  public static fromString(complexString: string): Complex | undefined {
    // Try to match the complex string with the regex of a complex number
    const match = complexString.trim().replaceAll(" ", "").match(COMPLEX_REGEX);
    if (match == null) {
      return undefined;
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
    const complex = new Complex(Number(match[3]), 0);
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
   * Compute the modulus of this complex number
   *
   * @returns the modulus.
   */
  public mod(): number {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }

  /**
   * Compute the argument of this complex number
   *
   * @returns the argument
   */
  public arg(): number {
    return Math.atan2(this.im, this.re);
  }

  /**
   * Return a copy of the complex number
   *
   * @returns the copy of the complex number.
   */
  public copy(): Complex {
    return new Complex(this.re, this.im);
  }

  /**
   * Compute a MathML representation of the complex number
   *
   * @param showOne `false` if the result should be an empty string for `1`, `true` otherwise
   * @returns a MathML representation of the complex number
   */
  public toMathML(showOne = true): string {
    let displayedRe = this.re;
    let displayedIm = this.im;
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
   * Compute and return a string representing the complex number
   *
   * @returns a string representing this complex number
   */
  public toString(): string {
    if (this.im != 0) {
      if (this.re != 0) {
        let string = this.re.toString();
        if (this.im >= 0) {
          string += " + ";
          if (this.im != 1) {
            string += this.im.toString();
          }
        } else {
          string += " - ";
          if (this.im != -1) {
            string += (-this.im).toString();
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
      return this.re.toString();
    }
  }

  /**
   * Check if the complex number is 0 + 0i
   *
   * @returns `true` if the complex number is 0 + 0i, `false` otherwise
   */
  public isZero(): boolean {
    return this.re == 0 && this.im == 0;
  }

  /**
   * Check if the complex number should be associated with a "-" in an equation.
   *
   * @returns `true` if the complex number should be associated with a "-" in an equation, `false`
   * otherwise
   */
  public showMinus(): boolean {
    return (this.re == 0 || this.im == 0) && this.re <= 0 && this.im <= 0;
  }

  /**
   * Compute and return the multiplication of the complex number by a factor
   *
   * @param factor The factor to multiply by
   * @returns the complex number multiplied by the factor
   */
  public multipliedBy(factor: number): Complex {
    return new Complex(factor * this.re, factor * this.im);
  }

  /**
   * Return a random complex number with a modulus in the given range
   *
   * @param modulusMinMax an object containing the min and max value of the modulus.
   * @returns the new complex number
   */
  public static getRandomComplex(modulusMinMax: { min: number; max: number }): Complex {
    const modulus = RandomUtils.floatBetween(modulusMinMax.min, modulusMinMax.max);
    const angle = RandomUtils.floatBetween(0, 2 * Math.PI);
    return new Complex(
      NumberUtils.toPrecision(modulus * Math.cos(angle), 2),
      NumberUtils.toPrecision(modulus * Math.sin(angle), 2)
    );
  }

  // TODO Add test
  /**
   * Get the ellipse parameters corresponding to the complex number (duration, angle, half-width,
   * half-height, offset modulus and offset argument)
   *
   * @returns the ellipse parameters
   */
  public getEllipseParameters(): number[] {
    return [0, 0, 0, 0, this.mod(), this.arg()];
  }
}
