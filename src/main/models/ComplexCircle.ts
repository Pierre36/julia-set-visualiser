import RandomUtils from "@/utils/RandomUtils";
import Complex, { type RandomComplexParameters } from "@/models/Complex";
import type Coefficient from "@/models/Coefficient";
import CoefficientTypes from "@/constants/CoefficientTypes";

export interface RandomCircleParameters {
  centerParameters: RandomComplexParameters;
  minRadius: number;
  maxRadius: number;
  minDuration: number;
  maxDuration: number;
}

/** Representation of a circle in the complex plane */
export default class ComplexCircle implements Coefficient {
  /**
   * Complex circle constructor
   *
   * @param centre centre of the circle
   * @param radius radius of the circle
   * @param duration duration of the animation in milliseconds
   */
  public constructor(public centre: Complex, public radius: number, public duration: number) {}

  public isZero() {
    return this.centre.isZero() && this.radius === 0;
  }

  public hasMinus() {
    return false;
  }

  public multipliedBy(factor: number): ComplexCircle {
    return new ComplexCircle(this.centre.multipliedBy(factor), this.radius * factor, this.duration);
  }

  public getEllipseParameters() {
    return [this.duration, 0, this.radius, this.radius, this.centre.mod(), this.centre.arg()];
  }

  /**
   * Create a complex circle from its JSON representation
   *
   * @param json the JSON to deserialise
   * @returns the complex circle or `undefined` if the JSON is invalid
   */
  public static fromJSON(json: any): ComplexCircle | undefined {
    if (json === undefined) return undefined;

    if (json.radius === undefined || !Number.isFinite(json.radius)) return undefined;
    if (json.duration === undefined || !Number.isFinite(json.duration)) return undefined;

    if (json.centre === undefined) return undefined;
    const centre = Complex.fromJSON(json.centre);
    if (centre == undefined) return undefined;

    return new ComplexCircle(centre, json.radius, json.duration);
  }

  public toJSON(): any {
    return {
      type: CoefficientTypes.CIRCLE,
      centre: this.centre.toJSON(),
      radius: this.radius,
      duration: this.duration,
    };
  }

  public toString(): string {
    return `ComplexCircle(${this.centre}, ${this.radius}, ${this.duration})`;
  }

  public toMathML(power: number | string): string {
    return `<msub><mi>c</mi><mn>${power}</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>`;
  }

  public copy(): ComplexCircle {
    return new ComplexCircle(this.centre.copy(), this.radius, this.duration);
  }

  /**
   * Return a random complex circle with the provided settings
   *
   * @param params parameters of the random complex circle
   * @returns the new complex circle
   */
  public static getRandomComplexCircle(params: RandomCircleParameters): ComplexCircle {
    return new ComplexCircle(
      Complex.getRandomComplex(params.centerParameters),
      RandomUtils.floatBetween(params.minRadius, params.maxRadius),
      RandomUtils.integerBetween(params.minDuration, params.maxDuration) * 1000
    );
  }
}
