import { describe, it, expect, vi } from "vitest";
import Complex from "@/models/Complex";
import Attractor from "@/models/Attractor";
import RandomUtils from "@/utils/RandomUtils";

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

describe("toString", () => {
  it("properly returns a string representation of the attractor", () =>
    expect(new Attractor(new Complex(4, 2), 210, 3.6, 4.2, 3, 6).toString()).toBe(
      "Attractor(4 + 2i, 210, 3.6, 4.2, 3, 6)"
    ));
});

describe("fromJSON", () => {
  const complex = new Complex(3, 6).toJSON();
  const hue = 210;
  const saturationStrength = 3.6;
  const saturationOffset = 4.2;
  const valueStrength = 3;
  const valueOffset = 6;

  const testCases = [
    {
      description: "reads JSON correctly",
      json: { complex, hue, saturationStrength, saturationOffset, valueStrength, valueOffset },
      output: new Attractor(
        new Complex(3, 6),
        hue,
        saturationStrength,
        saturationOffset,
        valueStrength,
        valueOffset
      ),
    },
    {
      description: "rejects JSON missing hue",
      json: { complex, saturationStrength, saturationOffset, valueStrength, valueOffset },
      output: undefined,
    },
    {
      description: "rejects JSON missing saturation strength",
      json: { complex, hue, saturationOffset, valueStrength, valueOffset },
      output: undefined,
    },
    {
      description: "rejects JSON missing saturation offset",
      json: { complex, hue, saturationStrength, valueStrength, valueOffset },
      output: undefined,
    },
    {
      description: "rejects JSON missing value strength",
      json: { complex, hue, saturationStrength, saturationOffset, valueOffset },
      output: undefined,
    },
    {
      description: "rejects JSON missing value offset",
      json: { complex, hue, saturationStrength, saturationOffset, valueStrength },
      output: undefined,
    },
    {
      description: "rejects JSON with invalid hue",
      json: { complex, hue: "x", saturationStrength, saturationOffset, valueStrength, valueOffset },
      output: undefined,
    },
    {
      description: "rejects JSON with invalid saturation strength",
      json: { complex, hue, saturationStrength: "x", saturationOffset, valueStrength, valueOffset },
      output: undefined,
    },
    {
      description: "rejects JSON with invalid saturation offset",
      json: { complex, hue, saturationStrength, saturationOffset: "x", valueStrength, valueOffset },
      output: undefined,
    },
    {
      description: "rejects JSON with invalid value strength",
      json: { complex, hue, saturationStrength, saturationOffset, valueStrength: "x", valueOffset },
      output: undefined,
    },
    {
      description: "rejects JSON with invalid value offset",
      json: { complex, hue, saturationStrength, saturationOffset, valueStrength, valueOffset: "x" },
      output: undefined,
    },
    { description: "rejects undefined JSON", json: undefined, output: undefined },
  ];

  testCases.forEach(({ description, json, output }) =>
    it(`${description}`, () => expect(Attractor.fromJSON(json)).toEqual(output))
  );

  it("properly constructs from JSON", () => {
    const complex = new Complex(3, 6);
    const hue = 210;
    const saturationStrength = 3.6;
    const saturationOffset = 4.2;
    const valueStrength = 3;
    const valueOffset = 6;

    const attractor = Attractor.fromJSON({
      complex: complex.toJSON(),
      hue,
      saturationStrength,
      saturationOffset,
      valueStrength,
      valueOffset,
    });

    expect(attractor).toEqual(
      new Attractor(complex, hue, saturationStrength, saturationOffset, valueStrength, valueOffset)
    );
  });
});

describe("toJSON", () => {
  const hue = 210;
  const saturationStrength = 3.6;
  const saturationOffset = 4.2;
  const valueStrength = 3;
  const valueOffset = 6;

  const testCases = [
    {
      complex: new Complex(3, 6),
      json: {
        complex: new Complex(3, 6).toJSON(),
        hue,
        saturationStrength,
        saturationOffset,
        valueStrength,
        valueOffset,
      },
    },
    {
      complex: undefined,
      json: { undefined, hue, saturationStrength, saturationOffset, valueStrength, valueOffset },
    },
  ];

  testCases.forEach(({ complex, json }) =>
    it(`converts to JSON correctly with complex = ${complex}`, () =>
      expect(
        new Attractor(
          complex,
          hue,
          saturationStrength,
          saturationOffset,
          valueStrength,
          valueOffset
        ).toJSON()
      ).toEqual(json))
  );
});

describe("copy", () => {
  it("properly copies", () => {
    const attractor = new Attractor(new Complex(3, 6), 210, 3.6, 4.2, 3, 6);

    expect(attractor.copy()).toEqual(attractor);
    expect(attractor.copy()).not.toBe(attractor);
  });

  it("properly copies with undefined complex", () => {
    const attractor = new Attractor(undefined, 210, 3.6, 4.2, 3, 6);

    expect(attractor.copy()).toEqual(attractor);
    expect(attractor.copy()).not.toBe(attractor);
  });
});

describe("getRandomAttractor", () => {
  it("properly returns a random attractor", () => {
    RandomUtils.floatBetween = vi.fn((min, _) => min);
    RandomUtils.integerBetween = vi.fn((min, _) => min);

    const params = {
      minHue: 0,
      maxHue: 1,
      minSaturationStrength: 2,
      maxSaturationStrength: 3,
      minSaturationOffset: 4,
      maxSaturationOffset: 5,
      minValueStrength: 6,
      maxValueStrength: 7,
      minValueOffset: 8,
      maxValueOffset: 9,
    };

    const randomAttractor = Attractor.getRandomAttractor(params);

    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(0, 1);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(2, 3);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(4, 5);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(6, 7);
    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(8, 9);

    expect(randomAttractor).toEqual(new Attractor(undefined, 0, 2, 4, 6, 8));
  });
});
