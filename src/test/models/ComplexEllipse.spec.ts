import { describe, it, expect, vi } from "vitest";
import Complex from "@/models/Complex";
import ComplexEllipse from "@/models/ComplexEllipse";
import RandomUtils from "@/utils/RandomUtils";

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

describe("fromJSON", () => {
  it("properly constructs from JSON", () => {
    const centre = new Complex(3, 6);
    const halfWidth = 36;
    const halfHeight = 42;
    const rotationAngle = 16;
    const duration = 2000;

    const ellipse = ComplexEllipse.fromJSON({
      centre: centre.toJSON(),
      halfWidth: halfWidth,
      halfHeight: halfHeight,
      rotationAngle: rotationAngle,
      duration: duration,
    });

    expect(ellipse).toEqual(
      new ComplexEllipse(centre, halfWidth, halfHeight, rotationAngle, duration)
    );
  });
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const centre = new Complex(3, 6);
    const halfWidth = 36;
    const halfHeight = 42;
    const rotationAngle = 16;
    const duration = 2000;

    const json = new ComplexEllipse(
      centre,
      halfWidth,
      halfHeight,
      rotationAngle,
      duration
    ).toJSON();

    expect(json).toEqual({
      centre: centre.toJSON(),
      halfWidth: halfWidth,
      halfHeight: halfHeight,
      rotationAngle: rotationAngle,
      duration: duration,
    });
  });
});

describe("toMathML", () => {
  it("properly returns the corresponding mathML", () => {
    const ellipse = new ComplexEllipse(new Complex(0, 0), 36, 42, 16, 0);

    expect(ellipse.toMathML(1)).toBe(
      "<msub><mi>e</mi><mn>1</mn></msub><mo form='prefix' stretchy='false'>(</mo><mi>t</mi><mo form='prefix' stretchy='false'>)</mo>"
    );
  });
});

describe("isZero", () => {
  it("properly works with zero", () => {
    const ellipse = new ComplexEllipse(new Complex(0, 0), 0, 0, 16, 0);

    expect(ellipse.isZero()).toBe(true);
  });

  it("properly works with not zero", () => {
    const ellipse = new ComplexEllipse(new Complex(1, 0), 36, 42, 16, 0);

    expect(ellipse.isZero()).toBe(false);
  });
});

describe("showMinus", () => {
  it("returns false", () => {
    const ellipse = new ComplexEllipse(new Complex(0, 0), 0, 0, 0, 0);

    expect(ellipse.showMinus()).toBe(false);
  });
});

describe("copy", () => {
  it("properly copies", () => {
    const ellipse = new ComplexEllipse(new Complex(0, 0), 36, 42, 16, 2000);

    expect(ellipse.copy()).toEqual(ellipse);
    expect(ellipse.copy()).not.toBe(ellipse);
  });
});

describe("multipliedBy", () => {
  it("properly multiplies by 0", () => {
    const ellipse = new ComplexEllipse(new Complex(3, 6), 36, 42, 16, 2000);

    expect(ellipse.multipliedBy(0)).toEqual(new ComplexEllipse(new Complex(0, 0), 0, 0, 16, 2000));
  });

  it("properly multiplies by positive", () => {
    const ellipse = new ComplexEllipse(new Complex(3, 6), 36, 42, 16, 2000);

    expect(ellipse.multipliedBy(2)).toEqual(
      new ComplexEllipse(new Complex(6, 12), 72, 84, 16, 2000)
    );
  });

  it("properly multiplies by negative", () => {
    const ellipse = new ComplexEllipse(new Complex(3, 6), 3, 4, 16, 2000);

    expect(ellipse.multipliedBy(-5)).toEqual(
      new ComplexEllipse(new Complex(-15, -30), -15, -20, 16, 2000)
    );
  });
});

describe("getRandomComplexEllipse", () => {
  it("properly returns a random complex ellipse", () => {
    RandomUtils.floatBetween = vi.fn(() => 1);
    RandomUtils.integerBetween = vi.fn(() => 1);
    Complex.getRandomComplex = vi.fn(() => new Complex(1, 0));

    const centreModulusMinMax = { min: 0, max: 2 };
    const halfWidthMinMax = { min: 1, max: 2 };
    const halfHeightMinMax = { min: 3, max: 4 };
    const rotationAngleMinMax = { min: 5, max: 6 };
    const durationMinMax = { min: 0, max: 2 };
    const randomEllipse = ComplexEllipse.getRandomComplexEllipse(
      centreModulusMinMax,
      halfWidthMinMax,
      halfHeightMinMax,
      rotationAngleMinMax,
      durationMinMax
    );

    expect(RandomUtils.floatBetween).toBeCalledWith(halfWidthMinMax.min, halfWidthMinMax.max);
    expect(RandomUtils.floatBetween).toBeCalledWith(halfHeightMinMax.min, halfHeightMinMax.max);
    expect(RandomUtils.floatBetween).toBeCalledWith(
      rotationAngleMinMax.min,
      rotationAngleMinMax.max
    );
    expect(RandomUtils.integerBetween).toBeCalledWith(durationMinMax.min, durationMinMax.max);
    expect(Complex.getRandomComplex).toBeCalledWith(centreModulusMinMax);

    expect(randomEllipse).toEqual(new ComplexEllipse(new Complex(1, 0), 1, 1, 1, 1000));
  });
});

describe("toString", () => {
  it("properly returns a string representation of the ellipse", () => {
    expect(new ComplexEllipse(new Complex(4, 2), 3, 6, 4, 2).toString()).toBe(
      "ComplexEllipse(4 + 2i, 3, 6, 4, 2)"
    );
  });
});
