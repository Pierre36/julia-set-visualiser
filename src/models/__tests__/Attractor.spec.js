import { describe, it, expect, vi } from "vitest";

import { Complex } from "../Complex";
import { Attractor } from "../Attractor";
import { RandomUtils } from "../../Utils/RandomUtils";

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

describe("getRandomAttractor", () => {
  it("properly returns a random attractor", () => {
    RandomUtils.floatBetween = vi.fn((min, _) => min);
    RandomUtils.integerBetween = vi.fn((min, _) => min);

    const hueMinMax = { min: 11, max: 12 };
    const saturationStrengthMinMax = { min: 12, max: 13 };
    const saturationOffsetMinMax = { min: 13, max: 14 };
    const valueStrengthMinMax = { min: 14, max: 15 };
    const valueOffsetMinMax = { min: 15, max: 16 };

    const randomAttractor = Attractor.getRandomAttractor(
      hueMinMax,
      saturationStrengthMinMax,
      saturationOffsetMinMax,
      valueStrengthMinMax,
      valueOffsetMinMax
    );

    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(hueMinMax.min, hueMinMax.max);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(
      saturationStrengthMinMax.min,
      saturationStrengthMinMax.max
    );
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(
      saturationOffsetMinMax.min,
      saturationOffsetMinMax.max
    );
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(
      valueStrengthMinMax.min,
      valueStrengthMinMax.max
    );
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(
      valueOffsetMinMax.min,
      valueOffsetMinMax.max
    );

    expect(randomAttractor).toEqual(
      new Attractor(
        null,
        hueMinMax.min,
        saturationStrengthMinMax.min,
        saturationOffsetMinMax.min,
        valueStrengthMinMax.min,
        valueOffsetMinMax.min
      )
    );
  });
});
