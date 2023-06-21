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
}
