import RandomUtils from "@/utils/RandomUtils";
import NumberUtils from "@/utils/NumberUtils";
import type Coefficient from "@/models/Coefficient";
import CoefficientTypes from "@/constants/CoefficientTypes";

const COMPLEX_REGEX =
  /^(?:(-?\d+(?:\.\d+)?)|(-?\d*|-?\d+\.\d+)i|(-?\d+(?:\.\d+)?)([+-])(\d*|\d+\.\d+)i)$/;

export interface RandomComplexParameters {
  minMod: number;
  maxMod: number;
}

/** Representation of a complex number */
export default class Complex implements Coefficient {
  /**
   * Complex constructor
   *
   * @param re real part of the complex number
   * @param im imaginary part of the complex number
   */
  public constructor(public re: number, public im: number) {}

  /**
   * Compute the modulus of this complex number
   *
   * @returns the modulus
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

  public isZero() {
    return this.re === 0 && this.im === 0;
  }

  public hasMinus() {
    return (this.re === 0 || this.im === 0) && this.re <= 0 && this.im <= 0;
  }

  public multipliedBy(factor: number): Complex {
    return new Complex(factor * this.re, factor * this.im);
  }

  public getEllipseParameters(): number[] {
    return [0, 0, 0, 0, this.mod(), this.arg()];
  }

  /**
   * Create a complex from its JSON representation
   *
   * @param json the JSON to deserialise
   * @returns the complex or `undefined` if the JSON is invalid
   */
  public static fromJSON(json: any): Complex | undefined {
    if (json === undefined) return undefined;
    if (json.re === undefined || !Number.isFinite(json.re)) return undefined;
    if (json.im === undefined || !Number.isFinite(json.im)) return undefined;
    return new Complex(json.re, json.im);
  }

  public toJSON(): any {
    return { type: CoefficientTypes.CONSTANT, re: this.re, im: this.im };
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
    if (match === null) return undefined;

    // If only the real part is provided
    if (match[1] != undefined) return new Complex(Number(match[1]), 0);

    // If only the imaginary part is provided
    if (match[2] != undefined) {
      if (match[2] == "") return new Complex(0, 1);
      if (match[2] == "-") return new Complex(0, -1);
      return new Complex(0, Number(match[2]));
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

  // TODO Try to simplify this
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

  // TODO Try to simplify this
  public toMathML(_ = undefined, showOne = true): string {
    let displayedRe = this.re;
    let displayedIm = this.im;
    if (this.hasMinus()) {
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

  public copy(): Complex {
    return new Complex(this.re, this.im);
  }

  /**
   * Return a random complex number with a modulus in the given range
   *
   * @param params min and max value of the modulus
   * @returns the new complex number
   */
  public static getRandomComplex(params: RandomComplexParameters): Complex {
    const modulus = RandomUtils.floatBetween(params.minMod, params.maxMod);
    const angle = RandomUtils.floatBetween(0, 2 * Math.PI);
    return new Complex(
      NumberUtils.toPrecision(modulus * Math.cos(angle), 2),
      NumberUtils.toPrecision(modulus * Math.sin(angle), 2)
    );
  }
}
