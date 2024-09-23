import { describe, it, expect, vi } from "vitest";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import RandomUtils from "@/utils/RandomUtils";
import CoefficientTypes from "@/constants/CoefficientTypes";

describe("constructor", () => {
  it("properly constructs", () => {
    const centre = new Complex(3, 6);
    const radius = 42;
    const duration = 2000;

    const circle = new ComplexCircle(centre, radius, duration);

    expect(circle.centre).toBe(centre);
    expect(circle.radius).toBe(radius);
    expect(circle.duration).toBe(duration);
  });
});

describe("isZero", () => {
  const testCases = [
    { circle: new ComplexCircle(new Complex(0, 0), 0, 0), isZero: true },
    { circle: new ComplexCircle(new Complex(1, 0), 0, 0), isZero: false },
  ];

  testCases.forEach(({ circle, isZero }) =>
    it(`returns ${isZero} for ${circle}`, () => expect(circle.isZero()).toBe(isZero))
  );
});

describe("hasMinus", () => {
  it("returns false", () =>
    expect(new ComplexCircle(new Complex(3, 6), 42, 1000).hasMinus()).toBe(false));
});

describe("multipliedBy", () => {
  const testCases = [
    {
      circle: new ComplexCircle(new Complex(3, 6), 3, 2000),
      factor: 0,
      result: new ComplexCircle(new Complex(0, 0), 0, 2000),
    },
    {
      circle: new ComplexCircle(new Complex(3, 6), 3, 2000),
      factor: 2,
      result: new ComplexCircle(new Complex(6, 12), 6, 2000),
    },
    {
      circle: new ComplexCircle(new Complex(3, 6), 3, 2000),
      factor: -5,
      result: new ComplexCircle(new Complex(-15, -30), -15, 2000),
    },
  ];

  testCases.forEach(({ circle, factor, result }) =>
    it(`returns ${result} for ${circle} multiplied by ${factor}`, () =>
      expect(circle.multipliedBy(factor)).toEqual(result))
  );
});

describe("getEllipseParameters", () => {
  it("returns a circle equation", () =>
    expect(new ComplexCircle(new Complex(1, 1), 3, 6).getEllipseParameters()).toEqual([
      6,
      0,
      3,
      3,
      Math.sqrt(2),
      Math.PI / 4,
    ]));
});

describe("fromJSON", () => {
  const centre = new Complex(1, 2).toJSON();
  const radius = 3;
  const duration = 4;

  const testCases = [
    {
      description: "reads JSON correctly",
      json: { centre, radius, duration },
      output: new ComplexCircle(new Complex(1, 2), 3, 4),
    },
    { description: "reject JSON missing centre", json: { radius, duration }, output: undefined },
    { description: "reject JSON missing radius", json: { centre, duration }, output: undefined },
    { description: "reject JSON missing duration", json: { centre, duration }, output: undefined },
    {
      description: "reject JSON with invalid centre",
      json: { centre: "invalid", radius, duration },
      output: undefined,
    },
    {
      description: "reject JSON with invalid radius",
      json: { centre, radius: "invalid", duration },
      output: undefined,
    },
    {
      description: "reject JSON with invalid duration",
      json: { centre, radius, duration: "invalid" },
      output: undefined,
    },
    { description: "handles undefined correctly", json: undefined, output: undefined },
  ];

  testCases.forEach(({ description, json, output }) =>
    it(`${description}`, () => expect(ComplexCircle.fromJSON(json)).toEqual(output))
  );
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const centre = new Complex(3, 6);
    const radius = 42;
    const duration = 2000;

    const json = new ComplexCircle(centre, radius, duration).toJSON();

    expect(json).toEqual({
      type: CoefficientTypes.CIRCLE,
      centre: centre.toJSON(),
      radius: radius,
      duration: duration,
    });
  });
});

describe("toString", () => {
  it("properly returns a string representation of the circle", () =>
    expect(new ComplexCircle(new Complex(4, 2), 3, 6).toString()).toBe(
      "ComplexCircle(4 + 2i, 3, 6)"
    ));
});

describe("toMathML", () => {
  it("properly returns the corresponding mathML", () =>
    expect(new ComplexCircle(new Complex(3, 6), 42, 1000).toMathML(1)).toBe(
      "<msub><mi>c</mi><mn>1</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>"
    ));
});

describe("copy", () => {
  it("properly copies", () => {
    const circle = new ComplexCircle(new Complex(3, 6), 42, 1000);

    expect(circle.copy()).toEqual(circle);
    expect(circle.copy()).not.toBe(circle);
  });
});

describe("getRandomComplexCircle", () => {
  it("properly returns a random complex circle", () => {
    RandomUtils.floatBetween = vi.fn(() => 1);
    RandomUtils.integerBetween = vi.fn(() => 1);
    Complex.getRandomComplex = vi.fn(() => new Complex(1, 0));

    const centerParameters = { minModulus: 0, maxModulus: 1 };
    const params = { centerParameters, minRadius: 2, maxRadius: 3, minDuration: 4, maxDuration: 5 };

    const randomCircle = ComplexCircle.getRandomComplexCircle(params);

    expect(RandomUtils.floatBetween).toBeCalledWith(2, 3);
    expect(RandomUtils.integerBetween).toBeCalledWith(4, 5);
    expect(Complex.getRandomComplex).toBeCalledWith(centerParameters);

    expect(randomCircle).toEqual(new ComplexCircle(new Complex(1, 0), 1, 1000));
  });
});
