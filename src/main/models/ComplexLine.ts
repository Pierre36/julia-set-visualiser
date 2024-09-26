import RandomUtils from "@/utils/RandomUtils";
import Complex, { type RandomComplexParameters } from "@/models/Complex";
import type Coefficient from "@/models/Coefficient";
import CoefficientTypes from "@/constants/CoefficientTypes";

export interface RandomLineParameters {
  startEndParameters: RandomComplexParameters;
  minDuration: number;
  maxDuration: number;
}

/**
 * Representation of a line in the complex plane.
 */
export default class ComplexLine implements Coefficient {
  /**
   * Complex line constructor
   *
   * @param start start of the line
   * @param end end of the line
   * @param duration duration of the animation in milliseconds
   */
  public constructor(public start: Complex, public end: Complex, public duration: number) {}

  public isZero() {
    return this.start.isZero() && this.end.isZero();
  }

  public hasMinus() {
    return false;
  }

  public multipliedBy(factor: number): ComplexLine {
    return new ComplexLine(
      this.start.multipliedBy(factor),
      this.end.multipliedBy(factor),
      this.duration
    );
  }

  public getEllipseParameters() {
    const centre = new Complex(
      (this.start.re + this.end.re) / 2,
      (this.start.im + this.end.im) / 2
    );
    const centredLineEnd = new Complex(this.end.re - centre.re, this.end.im - centre.im);
    return [
      this.duration,
      centredLineEnd.arg(),
      centredLineEnd.mod(),
      0,
      centre.mod(),
      centre.arg(),
    ];
  }

  /**
   * Create a complex line from its JSON representation
   *
   * @param json the JSON to deserialise
   * @returns the complex line or `undefined` if the JSON is invalid
   */
  public static fromJSON(json: any): ComplexLine | undefined {
    if (json === undefined) return undefined;

    if (json.duration === undefined || !Number.isFinite(json.duration)) return undefined;

    if (json.start === undefined) return undefined;
    const start = Complex.fromJSON(json.start);
    if (start == undefined) return undefined;

    if (json.end === undefined) return undefined;
    const end = Complex.fromJSON(json.end);
    if (end == undefined) return undefined;

    return new ComplexLine(start, end, json.duration);
  }

  public toJSON(): any {
    return {
      type: CoefficientTypes.LINE,
      start: this.start.toJSON(),
      end: this.end.toJSON(),
      duration: this.duration,
    };
  }

  public toString(): string {
    return `ComplexLine(${this.start}, ${this.end}, ${this.duration})`;
  }

  public toMathML(power: number | string): string {
    return `<msub><mi>l</mi><mn>${power}</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>`;
  }

  public copy(): ComplexLine {
    return new ComplexLine(this.start.copy(), this.end.copy(), this.duration);
  }

  /**
   * Return a random complex line with the provided settings
   *
   * @param params parameters of the random complex circle
   * @returns the new complex line
   */
  public static getRandomComplexLine(params: RandomLineParameters): ComplexLine {
    return new ComplexLine(
      Complex.getRandomComplex(params.startEndParameters),
      Complex.getRandomComplex(params.startEndParameters),
      RandomUtils.integerBetween(params.minDuration, params.maxDuration) * 1000
    );
  }
}
