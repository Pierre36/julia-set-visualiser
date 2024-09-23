import { describe, it, expect, vi } from "vitest";
import Complex from "@/models/Complex";
import ComplexEllipse from "@/models/ComplexEllipse";
import RandomUtils from "@/utils/RandomUtils";
import CoefficientTypes from "@/constants/CoefficientTypes";

describe("constructor", () => {
  it("properly constructs", () => {
    const centre = new Complex(3, 6);
    const halfWidth = 36;
    const halfHeight = 42;
    const rotationAngle = 16;
    const duration = 2000;

    const ellipse = new ComplexEllipse(centre, halfWidth, halfHeight, rotationAngle, duration);

    expect(ellipse.centre).toBe(centre);
    expect(ellipse.halfWidth).toBe(halfWidth);
    expect(ellipse.halfHeight).toBe(halfHeight);
    expect(ellipse.rotationAngle).toBe(rotationAngle);
    expect(ellipse.duration).toBe(duration);
  });
});

describe("isZero", () => {
  const testCases = [
    { ellipse: new ComplexEllipse(new Complex(0, 0), 0, 0, 16, 0), isZero: true },
    { ellipse: new ComplexEllipse(new Complex(1, 0), 36, 42, 16, 0), isZero: false },
  ];

  testCases.forEach(({ ellipse, isZero }) =>
    it(`returns ${isZero} for ${ellipse}`, () => expect(ellipse.isZero()).toBe(isZero))
  );
});

describe("hasMinus", () => {
  it("returns false", () =>
    expect(new ComplexEllipse(new Complex(3, 6), 36, 42, 16, 2000).hasMinus()).toBe(false));
});

describe("multipliedBy", () => {
  const testCases = [
    {
      ellipse: new ComplexEllipse(new Complex(3, 6), 36, 42, 16, 2000),
      factor: 0,
      result: new ComplexEllipse(new Complex(0, 0), 0, 0, 16, 2000),
    },
    {
      ellipse: new ComplexEllipse(new Complex(3, 6), 36, 42, 16, 2000),
      factor: 2,
      result: new ComplexEllipse(new Complex(6, 12), 72, 84, 16, 2000),
    },
    {
      ellipse: new ComplexEllipse(new Complex(3, 6), 3, 4, 16, 2000),
      factor: -5,
      result: new ComplexEllipse(new Complex(-15, -30), -15, -20, 16, 2000),
    },
  ];

  testCases.forEach(({ ellipse, factor, result }) =>
    it(`returns ${result} for ${ellipse} multiplied by ${factor}`, () =>
      expect(ellipse.multipliedBy(factor)).toEqual(result))
  );
});

describe("getEllipseParameters", () => {
  it("returns an ellipse equation", () =>
    expect(new ComplexEllipse(new Complex(1, 1), 3, 6, 4, 2).getEllipseParameters()).toEqual([
      2,
      4,
      3,
      6,
      Math.sqrt(2),
      Math.PI / 4,
    ]));
});

describe("fromJSON", () => {
  const centre = new Complex(1, 2).toJSON();
  const halfWidth = 3;
  const halfHeight = 4;
  const rotationAngle = 5;
  const duration = 6;

  const testCases = [
    {
      description: "reads JSON correctly",
      json: { centre, halfWidth, halfHeight, rotationAngle, duration },
      output: new ComplexEllipse(new Complex(1, 2), 3, 4, 5, 6),
    },
    {
      description: "reject JSON missing centre",
      json: { halfWidth, halfHeight, rotationAngle, duration },
      output: undefined,
    },
    {
      description: "reject JSON missing half width",
      json: { centre, halfHeight, rotationAngle, duration },
      output: undefined,
    },
    {
      description: "reject JSON missing half height",
      json: { centre, halfWidth, rotationAngle, duration },
      output: undefined,
    },
    {
      description: "reject JSON missing rotation angle",
      json: { centre, halfWidth, halfHeight, duration },
      output: undefined,
    },
    {
      description: "reject JSON missing duration",
      json: { centre, halfWidth, halfHeight, rotationAngle },
      output: undefined,
    },
    {
      description: "reject JSON with invalid centre",
      json: { centre: "invalid", halfWidth, halfHeight, rotationAngle, duration },
      output: undefined,
    },
    {
      description: "reject JSON with invalid half width",
      json: { centre, halfWidth: "invalid", halfHeight, rotationAngle, duration },
      output: undefined,
    },
    {
      description: "reject JSON with invalid half height",
      json: { centre, halfWidth, halfHeight: "invalid", rotationAngle, duration },
      output: undefined,
    },
    {
      description: "reject JSON with invalid rotation angle",
      json: { centre, halfWidth, halfHeight, rotationAngle: "invalid", duration },
      output: undefined,
    },
    {
      description: "reject JSON with invalid duration",
      json: { centre, halfWidth, halfHeight, rotationAngle, duration: "invalid" },
      output: undefined,
    },

    { description: "handles undefined correctly", json: undefined, output: undefined },
  ];

  testCases.forEach(({ description, json, output }) =>
    it(`${description}`, () => expect(ComplexEllipse.fromJSON(json)).toEqual(output))
  );
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const centre = new Complex(3, 6);
    const halfWidth = 36;
    const halfHeight = 42;
    const rotationAngle = 16;
    const duration = 2000;

    const ellipse = new ComplexEllipse(centre, halfWidth, halfHeight, rotationAngle, duration);

    expect(ellipse.toJSON()).toEqual({
      type: CoefficientTypes.ELLIPSE,
      centre: centre.toJSON(),
      halfWidth: halfWidth,
      halfHeight: halfHeight,
      rotationAngle: rotationAngle,
      duration: duration,
    });
  });
});

describe("toString", () => {
  it("properly returns a string representation of the ellipse", () =>
    expect(new ComplexEllipse(new Complex(4, 2), 3, 6, 4, 2).toString()).toBe(
      "ComplexEllipse(4 + 2i, 3, 6, 4, 2)"
    ));
});

describe("toMathML", () => {
  it("properly returns the corresponding mathML", () =>
    expect(new ComplexEllipse(new Complex(0, 0), 36, 42, 16, 0).toMathML(1)).toBe(
      "<msub><mi>e</mi><mn>1</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>"
    ));
});

describe("copy", () => {
  it("properly copies", () => {
    const ellipse = new ComplexEllipse(new Complex(3, 6), 36, 42, 16, 2000);

    expect(ellipse.copy()).toEqual(ellipse);
    expect(ellipse.copy()).not.toBe(ellipse);
  });
});

describe("getRandomComplexEllipse", () => {
  it("properly returns a random complex ellipse", () => {
    RandomUtils.floatBetween = vi.fn(() => 1);
    RandomUtils.integerBetween = vi.fn(() => 1);
    Complex.getRandomComplex = vi.fn(() => new Complex(1, 0));

    const centerParameters = { minModulus: 1, maxModulus: 2 };
    const params = {
      centerParameters,
      minHalfWidth: 3,
      maxHalfWidth: 4,
      minHalfHeight: 5,
      maxHalfHeight: 6,
      minRotationAngle: 7,
      maxRotationAngle: 8,
      minDuration: 9,
      maxDuration: 10,
    };
    const randomEllipse = ComplexEllipse.getRandomComplexEllipse(params);

    expect(RandomUtils.floatBetween).toBeCalledWith(3, 4);
    expect(RandomUtils.floatBetween).toBeCalledWith(5, 6);
    expect(RandomUtils.floatBetween).toBeCalledWith(7, 8);
    expect(RandomUtils.integerBetween).toBeCalledWith(9, 10);
    expect(Complex.getRandomComplex).toBeCalledWith(centerParameters);

    expect(randomEllipse).toEqual(new ComplexEllipse(new Complex(1, 0), 1, 1, 1, 1000));
  });
});
