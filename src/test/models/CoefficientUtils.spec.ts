import { describe, it, expect, vi } from "vitest";
import CoefficientUtils from "@/models/CoefficientUtils";
import Complex, { type RandomComplexParameters } from "@/models/Complex";
import ComplexCircle, { type RandomCircleParameters } from "@/models/ComplexCircle";
import ComplexEllipse, { type RandomEllipseParameters } from "@/models/ComplexEllipse";
import ComplexLine, { type RandomLineParameters } from "@/models/ComplexLine";
import RandomUtils from "@/utils/RandomUtils";
import CoefficientTypes from "@/constants/CoefficientTypes";

describe("fromJSON", () => {
  const constant = new Complex(3, 6);
  const circle = new ComplexCircle(new Complex(3, 6), 4, 2);
  const line = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 16);
  const ellipse = new ComplexEllipse(new Complex(3, 6), 4, 2, 1, 6);

  const testCases = [
    { description: "reads constant JSON correctly", json: constant.toJSON(), output: constant },
    { description: "reads circle JSON correctly", json: circle.toJSON(), output: circle },
    { description: "reads line JSON correctly", json: line.toJSON(), output: line },
    { description: "reads ellipse JSON correctly", json: ellipse.toJSON(), output: ellipse },
    { description: "expects valid coefficient type", json: { type: "invalid" }, output: undefined },
    { description: "handles undefined correctly", json: undefined, output: undefined },
  ];

  testCases.forEach(({ description, json, output }) =>
    it(`${description}`, () => expect(CoefficientUtils.fromJSON(json)).toEqual(output))
  );
});

describe("getRandomCoefficient", () => {
  const types = new Set([
    CoefficientTypes.CONSTANT,
    CoefficientTypes.CIRCLE,
    CoefficientTypes.LINE,
    CoefficientTypes.ELLIPSE,
  ]);
  const constant = {} as RandomComplexParameters;
  const circle = {} as RandomCircleParameters;
  const line = {} as RandomLineParameters;
  const ellipse = {} as RandomEllipseParameters;
  const params = { types, constant, circle, line, ellipse };

  const randomConstant = new Complex(3, 6);
  const randomCircle = new ComplexCircle(new Complex(3, 6), 4, 2);
  const randomLine = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 16);
  const randomEllipse = new ComplexEllipse(new Complex(3, 6), 4, 2, 1, 6);

  Complex.getRandomComplex = vi.fn(() => randomConstant);
  ComplexCircle.getRandomComplexCircle = vi.fn(() => randomCircle);
  ComplexLine.getRandomComplexLine = vi.fn(() => randomLine);
  ComplexEllipse.getRandomComplexEllipse = vi.fn(() => randomEllipse);

  const testCases = [
    { type: CoefficientTypes.CONSTANT, output: randomConstant },
    { type: CoefficientTypes.CIRCLE, output: randomCircle },
    { type: CoefficientTypes.LINE, output: randomLine },
    { type: CoefficientTypes.ELLIPSE, output: randomEllipse },
  ];

  testCases.forEach(({ type, output }) =>
    it(`randomises ${type} coefficients`, () => {
      RandomUtils.pickAmong<CoefficientTypes> = vi.fn(() => type);

      const actual = CoefficientUtils.getRandomCoefficient(params);

      expect(actual).toEqual(output);

      expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(types));
    })
  );
});
