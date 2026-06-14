import CoefficientTypes from "@/constants/CoefficientTypes";
import type Coefficient from "@/models/Coefficient";
import Complex, { type RandomComplexParameters } from "@/models/Complex";
import RandomUtils from "@/utils/RandomUtils";

export interface RandomCircleParameters {
  centre: RandomComplexParameters;
  minRadius: number;
  maxRadius: number;
  minDuration: number;
  maxDuration: number;
  minDelay: number;
  maxDelay: number;
}

/** Representation of a circle in the complex plane */
export default class ComplexCircle implements Coefficient {
  /**
   * Complex circle constructor
   *
   * @param centre centre of the circle
   * @param radius radius of the circle
   * @param duration duration of the animation in milliseconds
   * @param delay delay negative time offset in milliseconds
   */
  public constructor(
    public centre: Complex,
    public radius: number,
    public duration: number,
    public delay: number,
  ) {}

  public isZero() {
    return this.centre.isZero() && this.radius === 0;
  }

  public hasMinus() {
    return false;
  }

  public multipliedBy(factor: number): ComplexCircle {
    return new ComplexCircle(
      this.centre.multipliedBy(factor),
      this.radius * factor,
      this.duration,
      this.delay,
    );
  }

  public getEllipseParameters() {
    return [
      this.duration,
      this.delay,
      0,
      this.radius,
      this.radius,
      this.centre.mod(),
      this.centre.arg(),
    ];
  }

  /**
   * Create a complex circle from its JSON representation
   *
   * @param json the JSON to deserialise
   * @returns the complex circle or `undefined` if the JSON is invalid
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static fromJSON(json: any): ComplexCircle | undefined {
    if (json === undefined) return undefined;

    if (json.radius === undefined || !Number.isFinite(json.radius)) return undefined;
    if (json.duration === undefined || !Number.isFinite(json.duration)) return undefined;
    if (json.delay === undefined || !Number.isFinite(json.delay)) return undefined;

    if (json.centre === undefined) return undefined;
    const centre = Complex.fromJSON(json.centre);
    if (centre == undefined) return undefined;

    return new ComplexCircle(centre, json.radius, json.duration, json.delay);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public toJSON(): any {
    return {
      type: CoefficientTypes.CIRCLE,
      centre: this.centre.toJSON(),
      radius: this.radius,
      duration: this.duration,
      delay: this.delay,
    };
  }

  public toString(): string {
    return `ComplexCircle(${this.centre}, ${this.radius}, ${this.duration}, ${this.delay})`;
  }

  public toMathML(power: number | string): string {
    return `<msub><mi>c</mi><mn>${power}</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>`;
  }

  public copy(): ComplexCircle {
    return new ComplexCircle(this.centre.copy(), this.radius, this.duration, this.delay);
  }

  /**
   * Return a random complex circle with the provided settings
   *
   * @param params parameters of the random complex circle
   * @returns the new complex circle
   */
  public static getRandomComplexCircle(params: RandomCircleParameters): ComplexCircle {
    return new ComplexCircle(
      Complex.getRandomComplex(params.centre),
      RandomUtils.floatBetween(params.minRadius, params.maxRadius),
      RandomUtils.integerBetween(params.minDuration, params.maxDuration) * 1000,
      RandomUtils.integerBetween(params.minDelay, params.maxDelay) * 1000,
    );
  }
}
