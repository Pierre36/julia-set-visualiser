import { describe, it, expect, vi } from "vitest";

import { Coefficient } from "../Coefficient";
import { Complex } from "../Complex";
import { ComplexCircle } from "../ComplexCircle";
import { ComplexLine } from "../ComplexLine";
import { Polynomial } from "../Polynomial";
import { RandomUtils } from "../../Utils/RandomUtils";
import { CoefficientTypes } from "../../enumerations/CoefficientTypes";

describe("fromJSON", () => {
  it("properly constructs from JSON complex", () => {
    const re = 3;
    const im = 6;

    const coefficient = Coefficient.fromJSON({
      re: re,
      im: im,
      type: CoefficientTypes.CONSTANT,
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
      type: CoefficientTypes.CIRCLE,
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
      type: CoefficientTypes.LINE,
    });

    expect(coefficient).toEqual(new ComplexLine(start, end, duration));
  });

  it("throws an error for incorrect JSON", () => {
    expect(() => Coefficient.fromJSON({ type: "INCORRECT_TYPE" })).toThrowError();
  });

  it("returns null for null coefficient", () => {
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
      type: CoefficientTypes.CONSTANT,
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
      type: CoefficientTypes.CIRCLE,
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
      type: CoefficientTypes.LINE,
    });
  });

  it("properly exports anything else to JSON", () => {
    const polynomial = new Polynomial();
    const json = Coefficient.toJSON(polynomial);

    expect(json).toEqual(polynomial.toJSON());
  });
});

describe("getRandomCoefficient", () => {
  it("properly returns a random coefficient when the type is a circle", () => {
    RandomUtils.pickAmong = vi.fn(() => CoefficientTypes.CIRCLE);
    const randomCircle = new ComplexCircle(new Complex(3, 6), 3, 6);
    ComplexCircle.getRandomComplexCircle = vi.fn(() => randomCircle);

    const coefficientTypes = new Set(["coefficientType1", "coefficientType2"]);
    const complexModulusMinMax = { min: 1, max: 2 };
    const centerModulusMinMax = { min: 2, max: 3 };
    const radiusMinMax = { min: 3, max: 4 };
    const circleDurationMinMax = { min: 4, max: 5 };
    const startEndModulusMinMax = { min: 5, max: 6 };
    const lineDurationMinMax = { min: 6, max: 7 };

    const randomCoefficient = Coefficient.getRandomCoefficient(
      coefficientTypes,
      complexModulusMinMax,
      centerModulusMinMax,
      radiusMinMax,
      circleDurationMinMax,
      startEndModulusMinMax,
      lineDurationMinMax
    );

    expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(coefficientTypes));
    expect(ComplexCircle.getRandomComplexCircle).toHaveBeenCalledWith(
      centerModulusMinMax,
      radiusMinMax,
      circleDurationMinMax
    );

    expect(randomCoefficient).toEqual(randomCircle);
  });

  it("properly returns a random coefficient when the type is a line", () => {
    RandomUtils.pickAmong = vi.fn(() => CoefficientTypes.LINE);
    const randomLine = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 16);
    ComplexLine.getRandomComplexLine = vi.fn(() => randomLine);

    const coefficientTypes = new Set(["coefficientType1", "coefficientType2"]);
    const complexModulusMinMax = { min: 1, max: 2 };
    const centerModulusMinMax = { min: 2, max: 3 };
    const radiusMinMax = { min: 3, max: 4 };
    const circleDurationMinMax = { min: 4, max: 5 };
    const startEndModulusMinMax = { min: 5, max: 6 };
    const lineDurationMinMax = { min: 6, max: 7 };

    const randomCoefficient = Coefficient.getRandomCoefficient(
      coefficientTypes,
      complexModulusMinMax,
      centerModulusMinMax,
      radiusMinMax,
      circleDurationMinMax,
      startEndModulusMinMax,
      lineDurationMinMax
    );

    expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(coefficientTypes));
    expect(ComplexLine.getRandomComplexLine).toHaveBeenCalledWith(
      startEndModulusMinMax,
      lineDurationMinMax
    );

    expect(randomCoefficient).toEqual(randomLine);
  });

  it("properly returns a random coefficient when the type is a constant", () => {
    RandomUtils.pickAmong = vi.fn(() => CoefficientTypes.CONSTANT);
    const randomComplex = new Complex(3, 6);
    Complex.getRandomComplex = vi.fn(() => randomComplex);

    const coefficientTypes = new Set(["coefficientType1", "coefficientType2"]);
    const complexModulusMinMax = { min: 1, max: 2 };
    const centerModulusMinMax = { min: 2, max: 3 };
    const radiusMinMax = { min: 3, max: 4 };
    const circleDurationMinMax = { min: 4, max: 5 };
    const startEndModulusMinMax = { min: 5, max: 6 };
    const lineDurationMinMax = { min: 6, max: 7 };

    const randomCoefficient = Coefficient.getRandomCoefficient(
      coefficientTypes,
      complexModulusMinMax,
      centerModulusMinMax,
      radiusMinMax,
      circleDurationMinMax,
      startEndModulusMinMax,
      lineDurationMinMax
    );

    expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(coefficientTypes));
    expect(Complex.getRandomComplex).toHaveBeenCalledWith(complexModulusMinMax);

    expect(randomCoefficient).toEqual(randomComplex);
  });

  it("properly throws an error when the type is incorrect", () => {
    RandomUtils.pickAmong = vi.fn(() => "INCORRECT_TYPE");

    const coefficientTypes = new Set(["coefficientType1", "coefficientType2"]);
    const complexModulusMinMax = { min: 1, max: 2 };
    const centerModulusMinMax = { min: 2, max: 3 };
    const radiusMinMax = { min: 3, max: 4 };
    const circleDurationMinMax = { min: 4, max: 5 };
    const startEndModulusMinMax = { min: 5, max: 6 };
    const lineDurationMinMax = { min: 6, max: 7 };

    expect(() =>
      Coefficient.getRandomCoefficient(
        coefficientTypes,
        complexModulusMinMax,
        centerModulusMinMax,
        radiusMinMax,
        circleDurationMinMax,
        startEndModulusMinMax,
        lineDurationMinMax
      )
    ).toThrow();
  });
});
