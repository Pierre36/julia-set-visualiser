import { describe, it, expect, vi } from "vitest";
import Complex from "@/models/Complex";
import ComplexLine from "@/models/ComplexLine";
import RandomUtils from "@/utils/RandomUtils";

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

describe("fromJSON", () => {
  it("properly constructs from JSON", () => {
    const start = new Complex(3, 6);
    const end = new Complex(4, 2);
    const duration = 2000;

    const line = ComplexLine.fromJSON({
      start: start.toJSON(),
      end: end.toJSON(),
      duration: duration,
    });

    expect(line).toEqual(new ComplexLine(start, end, duration));
  });
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const start = new Complex(3, 6);
    const end = new Complex(4, 2);
    const duration = 2000;

    const json = new ComplexLine(start, end, duration).toJSON();

    expect(json).toEqual({
      start: start.toJSON(),
      end: end,
      duration: duration,
    });
  });
});

describe("toMathML", () => {
  it("properly returns the corresponding mathML", () => {
    const start = new Complex(0, 0);
    const end = new Complex(0, 0);
    const duration = 0;

    const line = new ComplexLine(start, end, duration);

    expect(line.toMathML(1)).toBe(
      "<msub><mi>l</mi><mn>1</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>"
    );
  });
});

describe("isZero", () => {
  it("properly works with zero", () => {
    const start = new Complex(0, 0);
    const end = new Complex(0, 0);
    const duration = 2000;

    const line = new ComplexLine(start, end, duration);

    expect(line.isZero()).toBe(true);
  });

  it("properly works with not zero", () => {
    const start = new Complex(3, 6);
    const end = new Complex(4, 2);
    const duration = 2000;

    const line = new ComplexLine(start, end, duration);

    expect(line.isZero()).toBe(false);
  });
});

describe("showMinus", () => {
  it("returns false", () => {
    const start = new Complex(0, 0);
    const end = new Complex(0, 0);
    const duration = 0;

    const line = new ComplexLine(start, end, duration);

    expect(line.showMinus()).toBe(false);
  });
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

describe("multipliedBy", () => {
  it("properly multiplies by 0", () => {
    const line = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    expect(line.multipliedBy(0)).toEqual(
      new ComplexLine(new Complex(0, 0), new Complex(0, 0), 2000)
    );
  });

  it("properly multiplies by positive", () => {
    const line = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    expect(line.multipliedBy(2)).toEqual(
      new ComplexLine(new Complex(6, 12), new Complex(8, 4), 2000)
    );
  });

  it("properly multiplies by negative", () => {
    const line = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    expect(line.multipliedBy(-5)).toEqual(
      new ComplexLine(new Complex(-15, -30), new Complex(-20, -10), 2000)
    );
  });
});

describe("getRandomComplexLine", () => {
  it("properly returns a random complex line", () => {
    RandomUtils.integerBetween = vi.fn(() => 1);
    Complex.getRandomComplex = vi.fn(() => new Complex(1, 0));

    const startEndModulusMinMax = { min: 0, max: 2 };
    const durationMinMax = { min: 0, max: 2 };
    const randomLine = ComplexLine.getRandomComplexLine(startEndModulusMinMax, durationMinMax);

    expect(RandomUtils.integerBetween).toBeCalledWith(durationMinMax.min, durationMinMax.max);
    expect(Complex.getRandomComplex).toBeCalledWith(startEndModulusMinMax);
    expect(Complex.getRandomComplex).toBeCalledTimes(2);

    expect(randomLine).toEqual(new ComplexLine(new Complex(1, 0), new Complex(1, 0), 1000));
  });
});

describe("toString", () => {
  it("properly returns a string representation of the complex line", () => {
    expect(new ComplexLine(new Complex(3, 6), new Complex(4, 2), 1).toString()).toBe(
      "ComplexLine(3 + 6i, 4 + 2i, 1)"
    );
  });
});

describe("getEllipseParameters", () => {
  const duration = 1000;

  it("properly returns the ellipse parameters of a line", () => {
    const line = new ComplexLine(new Complex(0, 0), new Complex(0, 0), duration);

    expect(line.getEllipseParameters()).toEqual([duration, 0, 0, 0, 0, 0]);
  });

  it("properly returns the ellipse parameters of a line", () => {
    const line = new ComplexLine(new Complex(-1, 0), new Complex(1, 0), duration);

    expect(line.getEllipseParameters()).toEqual([duration, 0, 1, 0, 0, 0]);
  });

  it("properly returns the ellipse parameters of a line", () => {
    const line = new ComplexLine(new Complex(0, -1), new Complex(0, 1), duration);

    expect(line.getEllipseParameters()).toEqual([duration, Math.PI / 2, 1, 0, 0, 0]);
  });
});
