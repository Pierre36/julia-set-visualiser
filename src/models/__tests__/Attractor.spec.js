import { describe, it, expect } from "vitest";

import { Complex } from "../Complex";
import { Attractor } from "../Attractor";

describe("constructor", () => {
  it("properly constructs", () => {
    const complex = new Complex(3, 6);
    const hue = 210;
    const saturationStrength = 3.6;
    const saturationOffset = 4.2;
    const valueStrength = 3;
    const valueOffset = 6;

    const attractor = new Attractor(
      complex,
      hue,
      saturationStrength,
      saturationOffset,
      valueStrength,
      valueOffset
    );

    expect(attractor.complex).toBe(complex);
    expect(attractor.hue).toBe(hue);
    expect(attractor.saturationStrength).toBe(saturationStrength);
    expect(attractor.saturationOffset).toBe(saturationOffset);
    expect(attractor.valueStrength).toBe(valueStrength);
    expect(attractor.valueOffset).toBe(valueOffset);
  });
});

describe("fromJSON", () => {
  it("properly constructs from JSON", () => {
    const complex = new Complex(3, 6);
    const hue = 210;
    const saturationStrength = 3.6;
    const saturationOffset = 4.2;
    const valueStrength = 3;
    const valueOffset = 6;

    const attractor = Attractor.fromJSON({
      complex: complex.toJSON(),
      hue: hue,
      saturationStrength: saturationStrength,
      saturationOffset: saturationOffset,
      valueStrength: valueStrength,
      valueOffset: valueOffset,
    });

    expect(attractor).toEqual(
      new Attractor(complex, hue, saturationStrength, saturationOffset, valueStrength, valueOffset)
    );
  });
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const complex = new Complex(3, 6);
    const hue = 210;
    const saturationStrength = 3.6;
    const saturationOffset = 4.2;
    const valueStrength = 3;
    const valueOffset = 6;

    const json = new Attractor(
      complex,
      hue,
      saturationStrength,
      saturationOffset,
      valueStrength,
      valueOffset
    ).toJSON();

    expect(json).toEqual({
      complex: complex.toJSON(),
      hue: hue,
      saturationStrength: saturationStrength,
      saturationOffset: saturationOffset,
      valueStrength: valueStrength,
      valueOffset: valueOffset,
    });
  });

  it("properly exports to JSON with null complex", () => {
    const complex = null;
    const hue = 210;
    const saturationStrength = 3.6;
    const saturationOffset = 4.2;
    const valueStrength = 3;
    const valueOffset = 6;

    const json = new Attractor(
      complex,
      hue,
      saturationStrength,
      saturationOffset,
      valueStrength,
      valueOffset
    ).toJSON();

    expect(json).toEqual({
      complex: null,
      hue: hue,
      saturationStrength: saturationStrength,
      saturationOffset: saturationOffset,
      valueStrength: valueStrength,
      valueOffset: valueOffset,
    });
  });
});

describe("copy", () => {
  it("properly copies", () => {
    const complex = new Complex(3, 6);
    const hue = 210;
    const saturationStrength = 3.6;
    const saturationOffset = 4.2;
    const valueStrength = 3;
    const valueOffset = 6;

    const attractor = new Attractor(
      complex,
      hue,
      saturationStrength,
      saturationOffset,
      valueStrength,
      valueOffset
    );

    expect(attractor.copy()).toEqual(attractor);
    expect(attractor.copy()).not.toBe(attractor);
  });

  it("properly copies with null complex", () => {
    const complex = null;
    const hue = 210;
    const saturationStrength = 3.6;
    const saturationOffset = 4.2;
    const valueStrength = 3;
    const valueOffset = 6;

    const attractor = new Attractor(
      complex,
      hue,
      saturationStrength,
      saturationOffset,
      valueStrength,
      valueOffset
    );

    expect(attractor.copy()).toEqual(attractor);
    expect(attractor.copy()).not.toBe(attractor);
  });
});
