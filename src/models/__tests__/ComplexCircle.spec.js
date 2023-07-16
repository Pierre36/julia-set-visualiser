import { describe, it, expect } from "vitest";

import { Complex } from "../Complex";
import { ComplexCircle } from "../ComplexCircle";

describe("constructor", () => {
  it("properly constructs", () => {
    const center = new Complex(3, 6);
    const radius = 42;
    const duration = 2000;

    const circle = new ComplexCircle(center, radius, duration);

    expect(circle.center).toBe(center);
    expect(circle.radius).toBe(radius);
    expect(circle.duration).toBe(duration);
  });
});

describe("fromJSON", () => {
  it("properly constructs from JSON", () => {
    const center = new Complex(3, 6);
    const radius = 42;
    const duration = 2000;

    const circle = ComplexCircle.fromJSON({
      center: center.toJSON(),
      radius: radius,
      duration: duration,
    });

    expect(circle).toEqual(new ComplexCircle(center, radius, duration));
  });
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const center = new Complex(3, 6);
    const radius = 42;
    const duration = 2000;

    const json = new ComplexCircle(center, radius, duration).toJSON();

    expect(json).toEqual({
      center: center.toJSON(),
      radius: radius,
      duration: duration,
    });
  });
});

describe("getAtTime", () => {
  it("properly works for center 0", () => {
    const center = new Complex(0, 0);
    const radius = 2;
    const duration = 2000;

    const circle = new ComplexCircle(center, radius, duration);
    const point = circle.getAtTime(1000);

    expect(point.re).toBeCloseTo(-2, 10);
    expect(point.im).toBeCloseTo(0, 10);
  });

  it("properly works for any center", () => {
    const center = new Complex(3, 6);
    const radius = 2;
    const duration = 2000;

    const circle = new ComplexCircle(center, radius, duration);
    const point = circle.getAtTime(1000);

    expect(point.re).toBeCloseTo(1, 10);
    expect(point.im).toBeCloseTo(6, 10);
  });
});

describe("toMathML", () => {
  it("properly returns the corresponding mathML", () => {
    const center = new Complex(0, 0);
    const radius = 0;
    const duration = 0;

    const circle = new ComplexCircle(center, radius, duration);

    expect(circle.toMathML(1)).toBe(
      "<msub><mi>c</mi><mn>1</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>"
    );
  });
});

describe("isZero", () => {
  it("properly works with zero", () => {
    const center = new Complex(0, 0);
    const radius = 0;
    const duration = 0;

    const circle = new ComplexCircle(center, radius, duration);

    expect(circle.isZero()).toBe(true);
  });

  it("properly works with not zero", () => {
    const center = new Complex(1, 0);
    const radius = 0;
    const duration = 0;

    const circle = new ComplexCircle(center, radius, duration);

    expect(circle.isZero()).toBe(false);
  });
});

describe("showMinus", () => {
  it("returns false", () => {
    const center = new Complex(0, 0);
    const radius = 0;
    const duration = 0;

    const circle = new ComplexCircle(center, radius, duration);

    expect(circle.showMinus()).toBe(false);
  });
});

describe("copy", () => {
  it("properly copies", () => {
    const center = new Complex(0, 0);
    const radius = 0;
    const duration = 0;

    const circle = new ComplexCircle(center, radius, duration);

    expect(circle.copy()).toEqual(circle);
    expect(circle.copy()).not.toBe(circle);
  });
});

describe("multipliedBy", () => {
  it("properly multiplies by 0", () => {
    const circle = new ComplexCircle(new Complex(3, 6), 3, 2000);

    expect(circle.multipliedBy(0)).toEqual(new ComplexCircle(new Complex(0, 0), 0, 2000));
  });

  it("properly multiplies by positive", () => {
    const circle = new ComplexCircle(new Complex(3, 6), 3, 2000);

    expect(circle.multipliedBy(2)).toEqual(new ComplexCircle(new Complex(6, 12), 6, 2000));
  });

  it("properly multiplies by negative", () => {
    const circle = new ComplexCircle(new Complex(3, 6), 3, 2000);

    expect(circle.multipliedBy(-5)).toEqual(new ComplexCircle(new Complex(-15, -30), -15, 2000));
  });
});

describe("plus", () => {
  it("properly adds 0", () => {
    const circle = new ComplexCircle(new Complex(3, 6), 3, 2000);

    expect(circle.plus(0)).toEqual(new ComplexCircle(new Complex(3, 6), 3, 2000));
  });

  it("properly adds positive", () => {
    const circle = new ComplexCircle(new Complex(3, 6), 3, 2000);

    expect(circle.plus(36)).toEqual(new ComplexCircle(new Complex(39, 6), 3, 2000));
  });

  it("properly adds negative", () => {
    const circle = new ComplexCircle(new Complex(3, 6), 3, 2000);

    expect(circle.plus(-42)).toEqual(new ComplexCircle(new Complex(-39, 6), 3, 2000));
  });
});
