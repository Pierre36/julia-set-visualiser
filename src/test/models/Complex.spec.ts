import { describe, it, expect, vi } from "vitest";
import Complex from "@/models/Complex";
import RandomUtils from "@/utils/RandomUtils";
import NumberUtils from "@/utils/NumberUtils";
import CoefficientTypes from "@/constants/CoefficientTypes";

describe("constructor", () => {
  it("properly constructs", () => {
    const re = 1;
    const im = 2;

    const complex = new Complex(re, im);

    expect(complex.re).toBe(re);
    expect(complex.im).toBe(im);
  });
});

describe("mod", () => {
  const testCases = [
    { input: new Complex(0, 0), output: 0 },
    { input: new Complex(1, 1), output: Math.sqrt(2) },
  ];

  testCases.forEach(({ input, output }) =>
    it(`returns ${output} for '${input}'`, () => expect(input.mod()).toEqual(output))
  );
});

describe("arg", () => {
  const testCases = [
    { input: new Complex(0, 0), output: 0 },
    { input: new Complex(1, 1), output: Math.PI / 4 },
  ];

  testCases.forEach(({ input, output }) =>
    it(`returns ${output} for '${input}'`, () => expect(input.arg()).toEqual(output))
  );
});

describe("isZero", () => {
  const testCases = [
    { complex: new Complex(0, 0), isZero: true },
    { complex: new Complex(0.1, 0), isZero: false },
  ];

  testCases.forEach(({ complex, isZero }) =>
    it(`returns ${isZero} for ${complex}`, () => expect(complex.isZero()).toBe(isZero))
  );
});

describe("hasMinus", () => {
  const testCases = [
    { complex: new Complex(-1, 0), hasMinus: true },
    { complex: new Complex(0, -1), hasMinus: true },
    { complex: new Complex(1, 0), hasMinus: false },
    { complex: new Complex(0, 1), hasMinus: false },
    { complex: new Complex(1, -1), hasMinus: false },
  ];

  testCases.forEach(({ complex, hasMinus }) =>
    it(`returns ${hasMinus} for ${complex}`, () => expect(complex.hasMinus()).toBe(hasMinus))
  );
});

describe("multipliedBy", () => {
  const testCases = [
    { complex: new Complex(3, 6), factor: 0, result: new Complex(0, 0) },
    { complex: new Complex(3, 6), factor: 2, result: new Complex(6, 12) },
    { complex: new Complex(3, 6), factor: -5, result: new Complex(-15, -30) },
  ];

  testCases.forEach(({ complex, factor, result }) =>
    it(`returns ${result} for ${complex} multiplied by ${factor}`, () =>
      expect(complex.multipliedBy(factor)).toEqual(result))
  );
});

describe("getEllipseParameters", () => {
  it("returns a constant", () =>
    expect(new Complex(1, 1).getEllipseParameters()).toEqual([
      0,
      0,
      0,
      0,
      Math.sqrt(2),
      Math.PI / 4,
    ]));
});

describe("fromJSON", () => {
  const testCases = [
    { description: "reads JSON correctly", json: { re: 3, im: 6 }, output: new Complex(3, 6) },
    { description: "ignores other keys", json: { re: 3, im: 6, _: 4 }, output: new Complex(3, 6) },
    { description: "checks types", json: { re: "3", im: "6" }, output: undefined },
    { description: "checks types", json: { re: true, im: false }, output: undefined },
    { description: "expects all keys", json: { re: 3 }, output: undefined },
    { description: "expects all keys", json: { im: 6 }, output: undefined },
    { description: "expects all keys", json: { re: 3, not_im: 6 }, output: undefined },
    { description: "handles undefined correctly", json: undefined, output: undefined },
  ];

  testCases.forEach(({ description, json, output }) =>
    it(`${description}`, () => expect(Complex.fromJSON(json)).toEqual(output))
  );
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const re = 3;
    const im = 6;

    const json = new Complex(re, im).toJSON();

    expect(json).toEqual({ type: CoefficientTypes.CONSTANT, re: re, im: im });
  });
});

describe("fromString", () => {
  const testCases = [
    { input: "a + 3i", output: undefined },
    { input: "", output: undefined },
    { input: "1", output: new Complex(1, 0) },
    { input: "1i", output: new Complex(0, 1) },
    { input: "1 + i", output: new Complex(1, 1) },
    { input: "1 + 2i", output: new Complex(1, 2) },
    { input: "1 - i", output: new Complex(1, -1) },
    { input: "1 - 2i", output: new Complex(1, -2) },
    { input: "1.5", output: new Complex(1.5, 0) },
    { input: "0.2i", output: new Complex(0, 0.2) },
    { input: "0.2 + 2.5676i", output: new Complex(0.2, 2.5676) },
    { input: "i", output: new Complex(0, 1) },
    { input: "-i", output: new Complex(0, -1) },
    { input: "-1", output: new Complex(-1, 0) },
    { input: "-3i", output: new Complex(0, -3) },
    { input: "-0.5i", output: new Complex(0, -0.5) },
    { input: "-2 + 2i", output: new Complex(-2, 2) },
    { input: "2 - 4i", output: new Complex(2, -4) },
  ];

  testCases.forEach(({ input, output }) =>
    it(`returns ${output} for '${input}'`, () => expect(Complex.fromString(input)).toEqual(output))
  );
});

describe("toString", () => {
  const testCases = [
    { re: 1, im: 0, str: "1" },
    { re: -1, im: 0, str: "-1" },
    { re: 3.6, im: 0, str: "3.6" },
    { re: -3.6, im: 0, str: "-3.6" },
    { re: 0, im: 1, str: "i" },
    { re: 0, im: -1, str: "-i" },
    { re: 0, im: 3.6, str: "3.6i" },
    { re: 0, im: -3.6, str: "-3.6i" },
    { re: 1, im: 1, str: "1 + i" },
    { re: 2, im: 2, str: "2 + 2i" },
    { re: 3.6, im: 4.2, str: "3.6 + 4.2i" },
    { re: -1, im: -1, str: "-1 - i" },
    { re: -2, im: -2, str: "-2 - 2i" },
    { re: -3.6, im: -4.2, str: "-3.6 - 4.2i" },
  ];

  testCases.forEach(({ re, im, str }) =>
    it(`returns ${str} for (${re}, ${im})`, () =>
      expect(new Complex(re, im).toString()).toEqual(str))
  );
});

describe("toMathML", () => {
  const testCases = [
    { complex: new Complex(1, 0), mathML: "<mn>1</mn>", showOne: true },
    { complex: new Complex(-1, 0), mathML: "<mn>1</mn>", showOne: true },
    { complex: new Complex(1, 0), mathML: "", showOne: false },
    { complex: new Complex(-1, 0), mathML: "", showOne: false },
    { complex: new Complex(3.6, 0), mathML: "<mn>3.6</mn>", showOne: true },
    { complex: new Complex(-3.6, 0), mathML: "<mn>3.6</mn>", showOne: true },
    { complex: new Complex(0, 1), mathML: "<mi>i</mi>", showOne: true },
    { complex: new Complex(0, -1), mathML: "<mi>i</mi>", showOne: true },
    { complex: new Complex(0, 3.6), mathML: "<mn>3.6</mn><mi>i</mi>", showOne: true },
    { complex: new Complex(0, -3.6), mathML: "<mn>3.6</mn><mi>i</mi>", showOne: true },
    {
      complex: new Complex(1, 1),
      mathML:
        "<mo form='prefix' stretchy='false'>(</mo><mn>1</mn><mo>+</mo><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>",
      showOne: true,
    },
    {
      complex: new Complex(2, 2),
      mathML:
        "<mo form='prefix' stretchy='false'>(</mo><mn>2</mn><mo>+</mo><mn>2</mn><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>",
      showOne: true,
    },
    {
      complex: new Complex(3.6, 4.2),
      mathML:
        "<mo form='prefix' stretchy='false'>(</mo><mn>3.6</mn><mo>+</mo><mn>4.2</mn><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>",
      showOne: true,
    },
    {
      complex: new Complex(-1, -1),
      mathML:
        "<mo form='prefix' stretchy='false'>(</mo><mn>-1</mn><mo>-</mo><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>",
      showOne: true,
    },
    {
      complex: new Complex(-2, -2),
      mathML:
        "<mo form='prefix' stretchy='false'>(</mo><mn>-2</mn><mo>-</mo><mn>2</mn><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>",
      showOne: true,
    },
    {
      complex: new Complex(-3.6, -4.2),
      mathML:
        "<mo form='prefix' stretchy='false'>(</mo><mn>-3.6</mn><mo>-</mo><mn>4.2</mn><mi>i</mi><mo form='prefix' stretchy='false'>)</mo>",
      showOne: true,
    },
  ];

  testCases.forEach(({ complex, mathML, showOne = true }) =>
    it(`creates a correct MathML representation for ${complex} when 'showOne' is ${showOne}`, () =>
      expect(complex.toMathML(undefined, showOne)).toEqual(mathML))
  );
});

describe("copy", () => {
  it("properly copies", () => {
    const complex = new Complex(3, 6);

    expect(complex.copy()).toEqual(complex);
    expect(complex.copy()).not.toBe(complex);
  });
});

describe("getRandomComplex", () => {
  it("properly returns a random complex number", () => {
    RandomUtils.floatBetween = vi.fn(() => 1);

    const params = { minModulus: 0, maxModulus: 2 };
    const randomComplex = Complex.getRandomComplex(params);

    expect(RandomUtils.floatBetween).toBeCalledWith(params.minModulus, params.maxModulus);
    expect(RandomUtils.floatBetween).toBeCalledWith(0, 2 * Math.PI);

    expect(randomComplex).toEqual(
      new Complex(NumberUtils.toPrecision(Math.cos(1), 2), NumberUtils.toPrecision(Math.sin(1), 2))
    );
  });
});
