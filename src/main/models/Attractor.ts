import RandomUtils from "@/utils/RandomUtils";
import Complex from "@/models/Complex";

export interface RandomAttractorParameters {
  minHue: number;
  maxHue: number;
  minSaturationStrength: number;
  maxSaturationStrength: number;
  minSaturationOffset: number;
  maxSaturationOffset: number;
  minValueStrength: number;
  maxValueStrength: number;
  minValueOffset: number;
  maxValueOffset: number;
}

/** Representation of an attractor with a value and colour parameters */
export default class Attractor {
  /**
   * Attractor constructor
   *
   * @param complex attractor value
   * @param hue hue of the attractor
   * @param saturationStrength saturation strength of the attractor
   * @param saturationOffset saturation offset of the attractor
   * @param valueStrength value strength of the attractor
   * @param valueOffset value offset of the attractor
   */
  public constructor(
    public complex: Complex | undefined,
    public hue: number,
    public saturationStrength: number,
    public saturationOffset: number,
    public valueStrength: number,
    public valueOffset: number
  ) {}

  /**
   * Return a string representation of the attractor
   *
   * @returns the String representation
   */
  public toString(): string {
    return `Attractor(${this.complex}, ${this.hue}, ${this.saturationStrength}, ${this.saturationOffset}, ${this.valueStrength}, ${this.valueOffset})`;
  }

  /**
   * Create an attractor from its JSON representation
   *
   * @param json the JSON to deserialise
   * @returns the attractor or `undefined` if the JSON is invalid
   */
  public static fromJSON(json: any): Attractor | undefined {
    if (json === undefined) return undefined;

    if (json.hue === undefined || !Number.isFinite(json.hue)) return undefined;
    if (json.saturationStrength === undefined || !Number.isFinite(json.saturationStrength))
      return undefined;
    if (json.saturationOffset === undefined || !Number.isFinite(json.saturationOffset))
      return undefined;
    if (json.valueStrength === undefined || !Number.isFinite(json.valueStrength)) return undefined;
    if (json.valueOffset === undefined || !Number.isFinite(json.valueOffset)) return undefined;

    return new Attractor(
      Complex.fromJSON(json.complex),
      json.hue,
      json.saturationStrength,
      json.saturationOffset,
      json.valueStrength,
      json.valueOffset
    );
  }

  public toJSON(): any {
    return {
      complex: this.complex ? this.complex.toJSON() : undefined,
      hue: this.hue,
      saturationStrength: this.saturationStrength,
      saturationOffset: this.saturationOffset,
      valueStrength: this.valueStrength,
      valueOffset: this.valueOffset,
    };
  }

  /**
   * Return a copy of the attractor
   *
   * @returns the copy of the attractor
   */
  public copy(): Attractor {
    return new Attractor(
      this.complex ? this.complex.copy() : undefined,
      this.hue,
      this.saturationStrength,
      this.saturationOffset,
      this.valueStrength,
      this.valueOffset
    );
  }

  /**
   * Create a random attractor with the given settings
   *
   * @param params parameters of the random attractor
   * @returns the new random attractor
   */
  public static getRandomAttractor(params: RandomAttractorParameters): Attractor {
    const newHue = RandomUtils.integerBetween(params.minHue, params.maxHue);
    const newSaturationStrength = RandomUtils.floatBetween(
      params.minSaturationStrength,
      params.maxSaturationStrength
    );
    const newSaturationOffset = RandomUtils.floatBetween(
      params.minSaturationOffset,
      params.maxSaturationOffset
    );
    const newValueStrength = RandomUtils.floatBetween(
      params.minValueStrength,
      params.maxValueStrength
    );
    const newValueOffset = RandomUtils.floatBetween(params.minValueOffset, params.maxValueOffset);
    return new Attractor(
      undefined,
      newHue,
      newSaturationStrength,
      newSaturationOffset,
      newValueStrength,
      newValueOffset
    );
  }
}
