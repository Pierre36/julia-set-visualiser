import { describe, it, expect, vi } from "vitest";
import Complex from "@/models/Complex";
import ComplexLine from "@/models/ComplexLine";
import RandomUtils from "@/utils/RandomUtils";
import CoefficientTypes from "@/constants/CoefficientTypes";

describe("constructor", () => {
  it("properly constructs", () => {
    const start = new Complex(3, 6);
    const end = new Complex(4, 2);
    const duration = 2000;

    const line = new ComplexLine(start, end, duration);

    expect(line.start).toBe(start);
    expect(line.end).toBe(end);
    expect(line.duration).toBe(duration);
  });
});

describe("isZero", () => {
  const testCases = [
    { line: new ComplexLine(new Complex(0, 0), new Complex(0, 0), 2000), isZero: true },
    { line: new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000), isZero: false },
  ];

  testCases.forEach(({ line, isZero }) =>
    it(`returns ${isZero} for ${line}`, () => expect(line.isZero()).toBe(isZero))
  );
});

describe("hasMinus", () => {
  it("returns false", () =>
    expect(new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000).hasMinus()).toBe(false));
});

describe("multipliedBy", () => {
  const testCases = [
    {
      line: new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000),
      factor: 0,
      result: new ComplexLine(new Complex(0, 0), new Complex(0, 0), 2000),
    },
    {
      line: new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000),
      factor: 2,
      result: new ComplexLine(new Complex(6, 12), new Complex(8, 4), 2000),
    },
    {
      line: new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000),
      factor: -5,
      result: new ComplexLine(new Complex(-15, -30), new Complex(-20, -10), 2000),
    },
  ];

  testCases.forEach(({ line, factor, result }) =>
    it(`returns ${result} for ${line} multiplied by ${factor}`, () =>
      expect(line.multipliedBy(factor)).toEqual(result))
  );
});

describe("getEllipseParameters", () => {
  const duration = 1000;
  const testCases = [
    {
      line: new ComplexLine(new Complex(0, 0), new Complex(0, 0), duration),
      result: [duration, 0, 0, 0, 0, 0],
    },
    {
      line: new ComplexLine(new Complex(-1, 0), new Complex(1, 0), duration),
      result: [duration, 0, 1, 0, 0, 0],
    },
    {
      line: new ComplexLine(new Complex(0, -1), new Complex(0, 1), duration),
      result: [duration, Math.PI / 2, 1, 0, 0, 0],
    },
  ];

  testCases.forEach(({ line, result }) =>
    it(`returns ${result} for ${line}`, () => expect(line.getEllipseParameters()).toEqual(result))
  );
});

describe("fromJSON", () => {
  const start = new Complex(1, 2).toJSON();
  const end = new Complex(3, 4).toJSON();
  const duration = 5;

  const testCases = [
    {
      description: "reads JSON correctly",
      json: { start, end, duration },
      output: new ComplexLine(new Complex(1, 2), new Complex(3, 4), 5),
    },
    { description: "reject JSON missing start", json: { end, duration }, output: undefined },
    { description: "reject JSON missing end", json: { start, duration }, output: undefined },
    { description: "reject JSON missing duration", json: { start, end }, output: undefined },
    {
      description: "reject JSON with invalid start",
      json: { start: "invalid", end, duration },
      output: undefined,
    },
    {
      description: "reject JSON with invalid end",
      json: { start, end: "invalid", duration },
      output: undefined,
    },
    {
      description: "reject JSON with invalid duration",
      json: { start, end, duration: "invalid" },
      output: undefined,
    },
    { description: "handles undefined correctly", json: undefined, output: undefined },
  ];

  testCases.forEach(({ description, json, output }) =>
    it(`${description}`, () => expect(ComplexLine.fromJSON(json)).toEqual(output))
  );
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const start = new Complex(3, 6);
    const end = new Complex(4, 2);
    const duration = 2000;

    const json = new ComplexLine(start, end, duration).toJSON();

    expect(json).toEqual({
      type: CoefficientTypes.LINE,
      start: start.toJSON(),
      end: end.toJSON(),
      duration: duration,
    });
  });
});

describe("toString", () => {
  it("properly returns a string representation of the complex line", () => {
    expect(new ComplexLine(new Complex(3, 6), new Complex(4, 2), 1).toString()).toBe(
      "ComplexLine(3 + 6i, 4 + 2i, 1)"
    );
  });
});

describe("toMathML", () => {
  it("properly returns the corresponding mathML", () =>
    expect(new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000).toMathML(1)).toBe(
      "<msub><mi>l</mi><mn>1</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>"
    ));
});

describe("copy", () => {
  it("properly copies", () => {
    const start = new Complex(3, 6);
    const end = new Complex(4, 2);
    const duration = 2000;

    const line = new ComplexLine(start, end, duration);

    expect(line.copy()).toEqual(line);
    expect(line.copy()).not.toBe(line);
  });
});

describe("getRandomComplexLine", () => {
  it("properly returns a random complex line", () => {
    RandomUtils.integerBetween = vi.fn(() => 1);
    Complex.getRandomComplex = vi.fn(() => new Complex(1, 0));

    const startEnd = { minMod: 0, maxMod: 1 };
    const params = { startEnd, minDuration: 4, maxDuration: 5 };
    const randomLine = ComplexLine.getRandomComplexLine(params);

    expect(RandomUtils.integerBetween).toBeCalledWith(4, 5);
    expect(Complex.getRandomComplex).toBeCalledWith(startEnd);
    expect(Complex.getRandomComplex).toBeCalledTimes(2);

    expect(randomLine).toEqual(new ComplexLine(new Complex(1, 0), new Complex(1, 0), 1000));
  });
});
