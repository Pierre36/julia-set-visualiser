import { describe, it, expect, vi } from "vitest";
import CoefficientUtils from "@/models/CoefficientUtils";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import ComplexEllipse from "@/models/ComplexEllipse";
import ComplexLine from "@/models/ComplexLine";
import RandomUtils from "@/utils/RandomUtils";
import CoefficientTypes from "@/constants/CoefficientTypes";

describe("fromJSON", () => {
  it("properly constructs from JSON complex", () => {
    const re = 3;
    const im = 6;

    const coefficient = CoefficientUtils.fromJSON({
      re: re,
      im: im,
      type: CoefficientTypes.CONSTANT,
    });

    expect(coefficient).toEqual(new Complex(re, im));
  });

  it("properly constructs from JSON complex circle", () => {
    const centre = new Complex(3, 6);
    const radius = 42;
    const duration = 2000;

    const coefficient = CoefficientUtils.fromJSON({
      centre: centre,
      radius: radius,
      duration: duration,
      type: CoefficientTypes.CIRCLE,
    });

    expect(coefficient).toEqual(new ComplexCircle(centre, radius, duration));
  });

  it("properly constructs from JSON complex line", () => {
    const start = new Complex(3, 6);
    const end = new Complex(4, 2);
    const duration = 2000;

    const coefficient = CoefficientUtils.fromJSON({
      start: start,
      end: end,
      duration: duration,
      type: CoefficientTypes.LINE,
    });

    expect(coefficient).toEqual(new ComplexLine(start, end, duration));
  });

  it("properly constructs from JSON complex ellipse", () => {
    const centre = new Complex(3, 6);
    const halfWidth = 36;
    const halfHeight = 42;
    const rotationAngle = 16;
    const duration = 2000;

    const coefficient = CoefficientUtils.fromJSON({
      centre: centre,
      halfWidth: halfWidth,
      halfHeight: halfHeight,
      rotationAngle: rotationAngle,
      duration: duration,
      type: CoefficientTypes.ELLIPSE,
    });

    expect(coefficient).toEqual(
      new ComplexEllipse(centre, halfWidth, halfHeight, rotationAngle, duration)
    );
  });

  it("throws an error for incorrect JSON", () => {
    expect(() => CoefficientUtils.fromJSON({ type: "INCORRECT_TYPE" })).toThrowError();
  });
});

describe("toJSON", () => {
  it("properly exports complex to JSON", () => {
    const re = 3;
    const im = 6;

    const complex = new Complex(re, im);
    const json = CoefficientUtils.toJSON(complex);

    expect(json).toEqual({
      re: re,
      im: im,
      type: CoefficientTypes.CONSTANT,
    });
  });

  it("properly exports complex circle to JSON", () => {
    const centre = new Complex(3, 6);
    const radius = 42;
    const duration = 2000;

    const circle = new ComplexCircle(centre, radius, duration);
    const json = CoefficientUtils.toJSON(circle);

    expect(json).toEqual({
      centre: centre,
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
    const json = CoefficientUtils.toJSON(line);

    expect(json).toEqual({
      start: start,
      end: end,
      duration: duration,
      type: CoefficientTypes.LINE,
    });
  });

  it("properly exports complex ellipse to JSON", () => {
    const centre = new Complex(3, 6);
    const halfWidth = 36;
    const halfHeight = 42;
    const rotationAngle = 16;
    const duration = 2000;

    const ellipse = new ComplexEllipse(centre, halfWidth, halfHeight, rotationAngle, duration);
    const json = CoefficientUtils.toJSON(ellipse);

    expect(json).toEqual({
      centre: centre,
      halfWidth: halfWidth,
      halfHeight: halfHeight,
      rotationAngle: rotationAngle,
      duration: duration,
      type: CoefficientTypes.ELLIPSE,
    });
  });
});

describe("getRandomCoefficient", () => {
  it("properly returns a random coefficient when the type is a circle", () => {
    RandomUtils.pickAmong = vi.fn(() => CoefficientTypes.CIRCLE as any);
    const randomCircle = new ComplexCircle(new Complex(3, 6), 3, 6);
    ComplexCircle.getRandomComplexCircle = vi.fn(() => randomCircle);

    const coefficientTypes = new Set([CoefficientTypes.CIRCLE, CoefficientTypes.CONSTANT]);
    const complexModulusMinMax = { min: 1, max: 2 };
    const circleCentreModulusMinMax = { min: 2, max: 3 };
    const radiusMinMax = { min: 3, max: 4 };
    const circleDurationMinMax = { min: 4, max: 5 };
    const startEndModulusMinMax = { min: 5, max: 6 };
    const lineDurationMinMax = { min: 6, max: 7 };
    const ellipseCentreModulusMinMax = { min: 8, max: 9 };
    const halfWidthMinMax = { min: 10, max: 11 };
    const halfHeightMinMax = { min: 12, max: 13 };
    const rotationAngleMinMax = { min: 14, max: 15 };
    const ellipseDurationMinMax = { min: 16, max: 17 };

    const randomCoefficient = CoefficientUtils.getRandomCoefficient(
      coefficientTypes,
      complexModulusMinMax,
      circleCentreModulusMinMax,
      radiusMinMax,
      circleDurationMinMax,
      startEndModulusMinMax,
      lineDurationMinMax,
      ellipseCentreModulusMinMax,
      halfWidthMinMax,
      halfHeightMinMax,
      rotationAngleMinMax,
      ellipseDurationMinMax
    );

    expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(coefficientTypes));
    expect(ComplexCircle.getRandomComplexCircle).toHaveBeenCalledWith(
      circleCentreModulusMinMax,
      radiusMinMax,
      circleDurationMinMax
    );

    expect(randomCoefficient).toEqual(randomCircle);
  });

  it("properly returns a random coefficient when the type is an ellipse", () => {
    RandomUtils.pickAmong = vi.fn(() => CoefficientTypes.ELLIPSE as any);
    const randomEllipse = new ComplexEllipse(new Complex(3, 6), 36, 42, 16, 2000);
    ComplexEllipse.getRandomComplexEllipse = vi.fn(() => randomEllipse);

    const coefficientTypes = new Set([CoefficientTypes.CIRCLE, CoefficientTypes.CONSTANT]);
    const complexModulusMinMax = { min: 1, max: 2 };
    const circleCentreModulusMinMax = { min: 2, max: 3 };
    const radiusMinMax = { min: 3, max: 4 };
    const circleDurationMinMax = { min: 4, max: 5 };
    const startEndModulusMinMax = { min: 5, max: 6 };
    const lineDurationMinMax = { min: 6, max: 7 };
    const ellipseCentreModulusMinMax = { min: 8, max: 9 };
    const halfWidthMinMax = { min: 10, max: 11 };
    const halfHeightMinMax = { min: 12, max: 13 };
    const rotationAngleMinMax = { min: 14, max: 15 };
    const ellipseDurationMinMax = { min: 16, max: 17 };

    const randomCoefficient = CoefficientUtils.getRandomCoefficient(
      coefficientTypes,
      complexModulusMinMax,
      circleCentreModulusMinMax,
      radiusMinMax,
      circleDurationMinMax,
      startEndModulusMinMax,
      lineDurationMinMax,
      ellipseCentreModulusMinMax,
      halfWidthMinMax,
      halfHeightMinMax,
      rotationAngleMinMax,
      ellipseDurationMinMax
    );

    expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(coefficientTypes));
    expect(ComplexEllipse.getRandomComplexEllipse).toHaveBeenCalledWith(
      ellipseCentreModulusMinMax,
      halfWidthMinMax,
      halfHeightMinMax,
      rotationAngleMinMax,
      ellipseDurationMinMax
    );

    expect(randomCoefficient).toEqual(randomEllipse);
  });

  it("properly returns a random coefficient when the type is a line", () => {
    RandomUtils.pickAmong = vi.fn(() => CoefficientTypes.LINE as any);
    const randomLine = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 16);
    ComplexLine.getRandomComplexLine = vi.fn(() => randomLine);

    const coefficientTypes = new Set([CoefficientTypes.CIRCLE, CoefficientTypes.CONSTANT]);
    const complexModulusMinMax = { min: 1, max: 2 };
    const circleCentreModulusMinMax = { min: 2, max: 3 };
    const radiusMinMax = { min: 3, max: 4 };
    const circleDurationMinMax = { min: 4, max: 5 };
    const startEndModulusMinMax = { min: 5, max: 6 };
    const lineDurationMinMax = { min: 6, max: 7 };
    const ellipseCentreModulusMinMax = { min: 8, max: 9 };
    const halfWidthMinMax = { min: 10, max: 11 };
    const halfHeightMinMax = { min: 12, max: 13 };
    const rotationAngleMinMax = { min: 14, max: 15 };
    const ellipseDurationMinMax = { min: 16, max: 17 };

    const randomCoefficient = CoefficientUtils.getRandomCoefficient(
      coefficientTypes,
      complexModulusMinMax,
      circleCentreModulusMinMax,
      radiusMinMax,
      circleDurationMinMax,
      startEndModulusMinMax,
      lineDurationMinMax,
      ellipseCentreModulusMinMax,
      halfWidthMinMax,
      halfHeightMinMax,
      rotationAngleMinMax,
      ellipseDurationMinMax
    );

    expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(coefficientTypes));
    expect(ComplexLine.getRandomComplexLine).toHaveBeenCalledWith(
      startEndModulusMinMax,
      lineDurationMinMax
    );

    expect(randomCoefficient).toEqual(randomLine);
  });

  it("properly returns a random coefficient when the type is a constant", () => {
    RandomUtils.pickAmong = vi.fn(() => CoefficientTypes.CONSTANT as any);
    const randomComplex = new Complex(3, 6);
    Complex.getRandomComplex = vi.fn(() => randomComplex);

    const coefficientTypes = new Set([CoefficientTypes.CIRCLE, CoefficientTypes.CONSTANT]);
    const complexModulusMinMax = { min: 1, max: 2 };
    const circleCentreModulusMinMax = { min: 2, max: 3 };
    const radiusMinMax = { min: 3, max: 4 };
    const circleDurationMinMax = { min: 4, max: 5 };
    const startEndModulusMinMax = { min: 5, max: 6 };
    const lineDurationMinMax = { min: 6, max: 7 };
    const ellipseCentreModulusMinMax = { min: 8, max: 9 };
    const halfWidthMinMax = { min: 10, max: 11 };
    const halfHeightMinMax = { min: 12, max: 13 };
    const rotationAngleMinMax = { min: 14, max: 15 };
    const ellipseDurationMinMax = { min: 16, max: 17 };

    const randomCoefficient = CoefficientUtils.getRandomCoefficient(
      coefficientTypes,
      complexModulusMinMax,
      circleCentreModulusMinMax,
      radiusMinMax,
      circleDurationMinMax,
      startEndModulusMinMax,
      lineDurationMinMax,
      ellipseCentreModulusMinMax,
      halfWidthMinMax,
      halfHeightMinMax,
      rotationAngleMinMax,
      ellipseDurationMinMax
    );

    expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(coefficientTypes));
    expect(Complex.getRandomComplex).toHaveBeenCalledWith(complexModulusMinMax);

    expect(randomCoefficient).toEqual(randomComplex);
  });
});
