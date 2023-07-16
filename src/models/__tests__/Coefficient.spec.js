import { describe, it, expect } from "vitest";

import { Coefficient } from "../Coefficient";
import { Complex } from "../Complex";
import { ComplexCircle } from "../ComplexCircle";
import { ComplexLine } from "../ComplexLine";
import { Polynomial } from "../Polynomial";

describe("fromJSON", () => {
  it("properly constructs from JSON complex", () => {
    const re = 3;
    const im = 6;

    const coefficient = Coefficient.fromJSON({
      re: re,
      im: im,
      type: "COMPLEX",
    });

    expect(coefficient).toEqual(new Complex(re, im));
  });

  it("properly constructs from JSON complex circle", () => {
    const center = new Complex(3, 6);
    const radius = 42;
    const duration = 2000;

    const coefficient = Coefficient.fromJSON({
      center: center,
      radius: radius,
      duration: duration,
      type: "COMPLEX_CIRCLE",
    });

    expect(coefficient).toEqual(new ComplexCircle(center, radius, duration));
  });

  it("properly constructs from JSON complex line", () => {
    const start = new Complex(3, 6);
    const end = new Complex(4, 2);
    const duration = 2000;

    const coefficient = Coefficient.fromJSON({
      start: start,
      end: end,
      duration: duration,
      type: "COMPLEX_LINE",
    });

    expect(coefficient).toEqual(new ComplexLine(start, end, duration));
  });

  it("throws an error for incorrect JSON", () => {
    expect(() => Coefficient.fromJSON({ type: "COMPLEX_THING" })).toThrowError();
  });

  it("retruns null for null coefficient", () => {
    const coefficient = Coefficient.fromJSON(null);

    expect(coefficient).toBeNull();
  });
});

describe("toJSON", () => {
  it("properly exports complex to JSON", () => {
    const re = 3;
    const im = 6;

    const complex = new Complex(re, im);
    const json = Coefficient.toJSON(complex);

    expect(json).toEqual({
      re: re,
      im: im,
      type: "COMPLEX",
    });
  });

  it("properly exports complex circle to JSON", () => {
    const center = new Complex(3, 6);
    const radius = 42;
    const duration = 2000;

    const circle = new ComplexCircle(center, radius, duration);
    const json = Coefficient.toJSON(circle);

    expect(json).toEqual({
      center: center,
      radius: radius,
      duration: duration,
      type: "COMPLEX_CIRCLE",
    });
  });

  it("properly exports complex line to JSON", () => {
    const start = new Complex(3, 6);
    const end = new Complex(4, 2);
    const duration = 2000;

    const line = new ComplexLine(start, end, duration);
    const json = Coefficient.toJSON(line);

    expect(json).toEqual({
      start: start,
      end: end,
      duration: duration,
      type: "COMPLEX_LINE",
    });
  });

  it("properly exports anything else to JSON", () => {
    const polynomial = new Polynomial();
    const json = Coefficient.toJSON(polynomial);

    expect(json).toEqual(polynomial.toJSON());
  });
});
