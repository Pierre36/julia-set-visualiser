import RandomUtils from "@/utils/RandomUtils";
import Complex from "@/models/Complex";

/**
 * Representation of an attractor with a value and color parameters.
 */
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
   * Create an attractor from a JSON
   *
   * @param attractorJSON object containing the JSON for an attractor
   * @returns the attractor made from the JSON
   */
  public static fromJSON(attractorJSON: any): Attractor {
    return new Attractor(
      attractorJSON["complex"] ? Complex.fromJSON(attractorJSON["complex"]) : undefined,
      attractorJSON["hue"],
      attractorJSON["saturationStrength"],
      attractorJSON["saturationOffset"],
      attractorJSON["valueStrength"],
      attractorJSON["valueOffset"]
    );
  }

  /**
   * Convert an attractor to a JSON object
   *
   * @returns the JSON object constructed from the attractor
   */
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
   * Return a random attractor with the given settings
   *
   * @param hueMinMax min and max hue
   * @param saturationStrengthMinMax min and max saturation strength.
   * @param saturationOffsetMinMax min and max saturation offset.
   * @param valueStrengthMinMax min and max value strength.
   * @param valueOffsetMinMax min and max value offset.
   * @returns the new random attractor.
   */
  public static getRandomAttractor(
    hueMinMax: { min: number; max: number },
    saturationStrengthMinMax: { min: number; max: number },
    saturationOffsetMinMax: { min: number; max: number },
    valueStrengthMinMax: { min: number; max: number },
    valueOffsetMinMax: { min: number; max: number }
  ): Attractor {
    const newHue = RandomUtils.integerBetween(hueMinMax.min, hueMinMax.max);
    const newSaturationStrength = RandomUtils.floatBetween(
      saturationStrengthMinMax.min,
      saturationStrengthMinMax.max
    );
    const newSaturationOffset = RandomUtils.floatBetween(
      saturationOffsetMinMax.min,
      saturationOffsetMinMax.max
    );
    const newValueStrength = RandomUtils.floatBetween(
      valueStrengthMinMax.min,
      valueStrengthMinMax.max
    );
    const newValueOffset = RandomUtils.floatBetween(valueOffsetMinMax.min, valueOffsetMinMax.max);
    return new Attractor(
      undefined,
      newHue,
      newSaturationStrength,
      newSaturationOffset,
      newValueStrength,
      newValueOffset
    );
  }

  /**
   * Return a string representation of the attractor
   *
   * @returns the String representation
   */
  public toString(): string {
    return `Attractor(${this.complex}, ${this.hue}, ${this.saturationStrength}, ${this.saturationOffset}, ${this.valueStrength}, ${this.valueOffset})`;
  }
}
