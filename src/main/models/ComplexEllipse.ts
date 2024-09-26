import RandomUtils from "@/utils/RandomUtils";
import Complex, { type RandomComplexParameters } from "@/models/Complex";
import type Coefficient from "@/models/Coefficient";
import CoefficientTypes from "@/constants/CoefficientTypes";

export interface RandomEllipseParameters {
  centre: RandomComplexParameters;
  minHalfWidth: number;
  maxHalfWidth: number;
  minHalfHeight: number;
  maxHalfHeight: number;
  minRotationAngle: number;
  maxRotationAngle: number;
  minDuration: number;
  maxDuration: number;
}

/**
 * Representation of a ellipse in the complex plane.
 */
export default class ComplexEllipse implements Coefficient {
  /**
   * Complex ellipse constructor
   *
   * @param centre centre of the ellipse
   * @param halfWidth half-width of the ellipse
   * @param halfHeight half-height of the ellipse
   * @param rotationAngle rotation angle of the ellipse (in degrees)
   * @param duration duration of the animation in milliseconds.
   */
  public constructor(
    public centre: Complex,
    public halfWidth: number,
    public halfHeight: number,
    public rotationAngle: number,
    public duration: number
  ) {}

  public isZero() {
    return this.centre.isZero() && this.halfWidth == 0 && this.halfHeight == 0;
  }

  public hasMinus() {
    return false;
  }

  public multipliedBy(factor: number): ComplexEllipse {
    return new ComplexEllipse(
      this.centre.multipliedBy(factor),
      this.halfWidth * factor,
      this.halfHeight * factor,
      this.rotationAngle,
      this.duration
    );
  }

  public getEllipseParameters() {
    return [
      this.duration,
      this.rotationAngle,
      this.halfWidth,
      this.halfHeight,
      this.centre.mod(),
      this.centre.arg(),
    ];
  }

  /**
   * Create a complex ellipse from its JSON representation
   *
   * @param json the JSON to deserialise
   * @returns the complex ellipse or `undefined` if the JSON is invalid
   */
  public static fromJSON(json: any): ComplexEllipse | undefined {
    if (json === undefined) return undefined;

    if (json.halfWidth === undefined || !Number.isFinite(json.halfWidth)) return undefined;
    if (json.halfHeight === undefined || !Number.isFinite(json.halfHeight)) return undefined;
    if (json.rotationAngle === undefined || !Number.isFinite(json.rotationAngle)) return undefined;
    if (json.duration === undefined || !Number.isFinite(json.duration)) return undefined;

    if (json.centre === undefined) return undefined;
    const centre = Complex.fromJSON(json.centre);
    if (centre == undefined) {
      return undefined;
    }

    return new ComplexEllipse(
      centre,
      json.halfWidth,
      json.halfHeight,
      json.rotationAngle,
      json.duration
    );
  }

  public toJSON(): any {
    return {
      type: CoefficientTypes.ELLIPSE,
      centre: this.centre.toJSON(),
      halfWidth: this.halfWidth,
      halfHeight: this.halfHeight,
      rotationAngle: this.rotationAngle,
      duration: this.duration,
    };
  }

  public toString(): string {
    return `ComplexEllipse(${this.centre}, ${this.halfWidth}, ${this.halfHeight}, ${this.rotationAngle}, ${this.duration})`;
  }

  public toMathML(power: number | string): string {
    return `<msub><mi>e</mi><mn>${power}</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>`;
  }

  public copy(): ComplexEllipse {
    return new ComplexEllipse(
      this.centre.copy(),
      this.halfWidth,
      this.halfHeight,
      this.rotationAngle,
      this.duration
    );
  }

  /**
   * Return a random complex ellipse with the provided settings
   *
   * @param params parameters of the random complex ellipse
   * @returns the new complex ellipse
   */
  public static getRandomComplexEllipse(params: RandomEllipseParameters): ComplexEllipse {
    return new ComplexEllipse(
      Complex.getRandomComplex(params.centre),
      RandomUtils.floatBetween(params.minHalfWidth, params.maxHalfWidth),
      RandomUtils.floatBetween(params.minHalfHeight, params.maxHalfHeight),
      RandomUtils.floatBetween(params.minRotationAngle, params.maxRotationAngle),
      RandomUtils.integerBetween(params.minDuration, params.maxDuration) * 1000
    );
  }
}
