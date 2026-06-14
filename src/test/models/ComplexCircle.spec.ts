import CoefficientTypes from "@/constants/CoefficientTypes";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import RandomUtils from "@/utils/RandomUtils";
import { describe, expect, it, vi } from "vitest";

describe("constructor", () => {
  it("properly constructs", () => {
    const centre = new Complex(3, 6);
    const radius = 42;
    const duration = 2000;
    const delay = 1000;

    const circle = new ComplexCircle(centre, radius, duration, delay);

    expect(circle.centre).toBe(centre);
    expect(circle.radius).toBe(radius);
    expect(circle.duration).toBe(duration);
  });
});

describe("isZero", () => {
  const testCases = [
    { circle: new ComplexCircle(new Complex(0, 0), 0, 0, 0), isZero: true },
    { circle: new ComplexCircle(new Complex(1, 0), 0, 0, 0), isZero: false },
  ];

  testCases.forEach(({ circle, isZero }) =>
    it(`returns ${isZero} for ${circle}`, () => expect(circle.isZero()).toBe(isZero)),
  );
});

describe("hasMinus", () => {
  it("returns false", () =>
    expect(new ComplexCircle(new Complex(3, 6), 42, 1000, 2000).hasMinus()).toBe(false));
});

describe("multipliedBy", () => {
  const testCases = [
    {
      circle: new ComplexCircle(new Complex(3, 6), 3, 2000, 1000),
      factor: 0,
      result: new ComplexCircle(new Complex(0, 0), 0, 2000, 1000),
    },
    {
      circle: new ComplexCircle(new Complex(3, 6), 3, 2000, 1000),
      factor: 2,
      result: new ComplexCircle(new Complex(6, 12), 6, 2000, 1000),
    },
    {
      circle: new ComplexCircle(new Complex(3, 6), 3, 2000, 1000),
      factor: -5,
      result: new ComplexCircle(new Complex(-15, -30), -15, 2000, 1000),
    },
  ];

  testCases.forEach(({ circle, factor, result }) =>
    it(`returns ${result} for ${circle} multiplied by ${factor}`, () =>
      expect(circle.multipliedBy(factor)).toEqual(result)),
  );
});

describe("getEllipseParameters", () => {
  it("returns a circle equation", () =>
    expect(new ComplexCircle(new Complex(1, 1), 3, 6, 1).getEllipseParameters()).toEqual([
      6,
      1,
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
  const delay = 5;

  const testCases = [
    {
      description: "reads JSON correctly",
      json: { centre, radius, duration, delay },
      output: new ComplexCircle(new Complex(1, 2), 3, 4, 5),
    },
    {
      description: "reject JSON missing centre",
      json: { radius, duration, delay },
      output: undefined,
    },
    {
      description: "reject JSON missing radius",
      json: { centre, duration, delay },
      output: undefined,
    },
    {
      description: "reject JSON missing duration",
      json: { centre, radius, delay },
      output: undefined,
    },
    {
      description: "reject JSON missing duration",
      json: { centre, radius, duration },
      output: undefined,
    },
    {
      description: "reject JSON with invalid centre",
      json: { centre: "invalid", radius, duration, delay },
      output: undefined,
    },
    {
      description: "reject JSON with invalid radius",
      json: { centre, radius: "invalid", duration, delay },
      output: undefined,
    },
    {
      description: "reject JSON with invalid duration",
      json: { centre, radius, duration: "invalid", delay },
      output: undefined,
    },
    {
      description: "reject JSON with invalid delay",
      json: { centre, radius, duration, delay: "invalid" },
      output: undefined,
    },
    { description: "handles undefined correctly", json: undefined, output: undefined },
  ];

  testCases.forEach(({ description, json, output }) =>
    it(`${description}`, () => expect(ComplexCircle.fromJSON(json)).toEqual(output)),
  );
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const centre = new Complex(3, 6);
    const radius = 42;
    const duration = 2000;
    const delay = 1000;

    const json = new ComplexCircle(centre, radius, duration, delay).toJSON();

    expect(json).toEqual({
      type: CoefficientTypes.CIRCLE,
      centre: centre.toJSON(),
      radius,
      duration,
      delay,
    });
  });
});

describe("toString", () => {
  it("properly returns a string representation of the circle", () =>
    expect(new ComplexCircle(new Complex(4, 2), 3, 6, 1).toString()).toBe(
      "ComplexCircle(4 + 2i, 3, 6, 1)",
    ));
});

describe("toMathML", () => {
  it("properly returns the corresponding mathML", () =>
    expect(new ComplexCircle(new Complex(3, 6), 42, 1000, 2000).toMathML(1)).toBe(
      "<msub><mi>c</mi><mn>1</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>",
    ));
});

describe("copy", () => {
  it("properly copies", () => {
    const circle = new ComplexCircle(new Complex(3, 6), 42, 1000, 2000);

    expect(circle.copy()).toEqual(circle);
    expect(circle.copy()).not.toBe(circle);
  });
});

describe("getRandomComplexCircle", () => {
  it("properly returns a random complex circle", () => {
    RandomUtils.floatBetween = vi.fn(() => 1);
    RandomUtils.integerBetween = vi.fn(() => 1);
    Complex.getRandomComplex = vi.fn(() => new Complex(1, 0));

    const centre = { minMod: 0, maxMod: 1 };
    const params = {
      centre,
      minRadius: 2,
      maxRadius: 3,
      minDuration: 4,
      maxDuration: 5,
      minDelay: 6,
      maxDelay: 7,
    };

    const randomCircle = ComplexCircle.getRandomComplexCircle(params);

    expect(RandomUtils.floatBetween).toHaveBeenCalledWith(2, 3);
    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(4, 5);
    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(6, 7);
    expect(Complex.getRandomComplex).toHaveBeenCalledWith(centre);

    expect(randomCircle).toEqual(new ComplexCircle(new Complex(1, 0), 1, 1000, 1000));
  });
});
