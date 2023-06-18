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
  constructor(
    complex,
    hue,
    saturationStrength,
    saturationOffset,
    valueStrength,
    valueOffset
  ) {
    this.complex = complex;
    this.hue = hue;
    this.saturationStrength = saturationStrength;
    this.saturationOffset = saturationOffset;
    this.valueStrength = valueStrength;
    this.valueOffset = valueOffset;
  }
}
