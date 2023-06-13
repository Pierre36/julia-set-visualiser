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
   * @param {Number} saturationPower The saturation power of the attractor.
   * @param {Number} valueStrength The value strength of the attractor.
   * @param {Number} valuePower The value power of the attractor.
   */
  constructor(
    complex,
    hue,
    saturationStrength,
    saturationPower,
    valueStrength,
    valuePower
  ) {
    this.complex = complex;
    this.hue = hue;
    this.saturationStrength = saturationStrength;
    this.saturationPower = saturationPower;
    this.valueStrength = valueStrength;
    this.valuePower = valuePower;
  }
}
