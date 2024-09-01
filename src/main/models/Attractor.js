import { RandomUtils } from "@/utils/RandomUtils";
import { Complex } from "./Complex";

export { Attractor };

/**
 * Representation of an attractor with a value and color parameters.
 */
class Attractor {
  /**
   * Attractor constructor
   * @param {Complex} complex The attractor value, a complex number.
   * @param {Number} hue The hue of the attractor.
   * @param {Number} saturationStrength The saturation strength of the attractor.
   * @param {Number} saturationOffset The saturation offset of the attractor.
   * @param {Number} valueStrength The value strength of the attractor.
   * @param {Number} valueOffset The value offset of the attractor.
   */
  constructor(complex, hue, saturationStrength, saturationOffset, valueStrength, valueOffset) {
    this.complex = complex;
    this.hue = hue;
    this.saturationStrength = saturationStrength;
    this.saturationOffset = saturationOffset;
    this.valueStrength = valueStrength;
    this.valueOffset = valueOffset;
  }

  /**
   * Creates an attractor from a JSON.
   * @param {Object} attractorJSON An object containing the JSON for an attractor.
   * @returns The attractor made from the JSON.
   */
  static fromJSON(attractorJSON) {
    return new Attractor(
      Complex.fromJSON(attractorJSON["complex"]),
      attractorJSON["hue"],
      attractorJSON["saturationStrength"],
      attractorJSON["saturationOffset"],
      attractorJSON["valueStrength"],
      attractorJSON["valueOffset"]
    );
  }

  /**
   * Converts an attractor to a JSON object.
   * @returns {Object} The JSON object constructed from the attractor.
   */
  toJSON() {
    return {
      complex: this.complex == null ? null : this.complex.toJSON(),
      hue: this.hue,
      saturationStrength: this.saturationStrength,
      saturationOffset: this.saturationOffset,
      valueStrength: this.valueStrength,
      valueOffset: this.valueOffset,
    };
  }

  /**
   * Returns a copy of the attractor.
   * @returns {Attractor} The copy of the attractor.
   */
  copy() {
    return new Attractor(
      this.complex != null ? this.complex.copy() : null,
      this.hue,
      this.saturationStrength,
      this.saturationOffset,
      this.valueStrength,
      this.valueOffset
    );
  }

  /**
   * Returns a random attractor with the given settings.
   * @param {Object} hueMinMax An object containing the min and max value of the hue.
   * @param {Object} saturationStrengthMinMax An object containing the min and max value of the saturation strength.
   * @param {Object} saturationOffsetMinMax An object containing the min and max value of the saturation offset.
   * @param {Object} valueStrengthMinMax An object containing the min and max value of the value strength.
   * @param {Object} valueOffsetMinMax An object containing the min and max value of the value offset.
   * @returns {Attractor} The new random attractor.
   */
  static getRandomAttractor(
    hueMinMax,
    saturationStrengthMinMax,
    saturationOffsetMinMax,
    valueStrengthMinMax,
    valueOffsetMinMax
  ) {
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
      null,
      newHue,
      newSaturationStrength,
      newSaturationOffset,
      newValueStrength,
      newValueOffset
    );
  }

  /**
   * Returns a String representation of the attractor.
   * @returns {String} The String representation.
   */
  toString() {
    return `Attractor(${this.complex}, ${this.hue}, ${this.saturationStrength}, ${this.saturationOffset}, ${this.valueStrength}, ${this.valueOffset})`;
  }
}
