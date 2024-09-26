import { describe, it, expect, vi } from "vitest";
import Polynomial from "@/models/Polynomial";
import ComplexCircle from "@/models/ComplexCircle";
import Complex from "@/models/Complex";
import CoefficientUtils, { type RandomCoefficientParameters } from "@/models/CoefficientUtils";
import ComplexLine from "@/models/ComplexLine";
import RandomUtils from "@/utils/RandomUtils";

describe("MAX_DEGREE", () => it("is 15", () => expect(Polynomial.MAX_DEGREE).toBe(15)));

describe("constructor", () => {
  it("properly constructs", () => {
    const coefficients = {
      0: new ComplexCircle(new Complex(0, 0), 1, 2000),
      2: new Complex(1, 0),
      36: new Complex(3, 6),
    };

    const polynomial = new Polynomial(coefficients);

    expect(polynomial.getCoefficient(0)).toEqual(coefficients[0]);
    expect(polynomial.getCoefficient(2)).toEqual(coefficients[2]);
  });
});

describe("getCoefficients", () => {
  it("returns the coefficients with their power", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    expect(polynomial.getCoefficients()).toEqual([
      { power: 0, coefficient: coefficient0 },
      { power: 1, coefficient: coefficient1 },
      { power: 2, coefficient: coefficient2 },
    ]);
  });
});

describe("getCoefficient", () => {
  const coefficient = new Complex(3, 6);
  const polynomial = new Polynomial({ 0: coefficient });

  const testCases = [
    { description: "returns the coefficient when there is one", power: 0, output: coefficient },
    {
      description: "returns undefined when there is no coefficient at the power",
      power: 1,
      output: undefined,
    },
    {
      description: "returns undefined when the power is too high",
      power: Polynomial.MAX_DEGREE,
      output: undefined,
    },
    { description: "returns undefined when the power is too low", power: -1, output: undefined },
  ];

  testCases.forEach(({ description, power, output }) =>
    it(`${description}`, () => expect(polynomial.getCoefficient(power)).toEqual(output))
  );
});

describe("setCoefficient", () => {
  it("sets coefficients", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    const newCoefficient0 = new Complex(1, 2);
    polynomial.setCoefficient(0, newCoefficient0);

    expect(polynomial).toEqual(
      new Polynomial({ 0: newCoefficient0, 1: coefficient1, 2: coefficient2 })
    );

    const newCoefficient5 = new Complex(3, 4);
    polynomial.setCoefficient(5, newCoefficient5);

    expect(polynomial).toEqual(
      new Polynomial({ 0: newCoefficient0, 1: coefficient1, 2: coefficient2, 5: newCoefficient5 })
    );
  });

  it("throws an error if the power is too high", () => {
    const polynomial = new Polynomial({});
    expect(() =>
      polynomial.setCoefficient(Polynomial.MAX_DEGREE + 1, new Complex(0, 0))
    ).toThrowError();
  });

  it("throws an error if the power is too low", () => {
    const polynomial = new Polynomial({});
    expect(() => polynomial.setCoefficient(-1, new Complex(0, 0))).toThrowError();
  });
});

describe("removeCoefficient", () => {
  it("removes coefficients", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    polynomial.removeCoefficient(0);
    expect(polynomial).toEqual(new Polynomial({ 1: coefficient1, 2: coefficient2 }));

    polynomial.removeCoefficient(0);
    expect(polynomial).toEqual(new Polynomial({ 1: coefficient1, 2: coefficient2 }));

    polynomial.removeCoefficient(-1);
    expect(polynomial).toEqual(new Polynomial({ 1: coefficient1, 2: coefficient2 }));

    polynomial.removeCoefficient(Polynomial.MAX_DEGREE + 1);
    expect(polynomial).toEqual(new Polynomial({ 1: coefficient1, 2: coefficient2 }));
  });
});

describe("getDerivative", () => {
  it("computes the derivative", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    expect(polynomial.getDerivative()).toEqual(
      new Polynomial({ 0: coefficient1, 1: coefficient2.multipliedBy(2) })
    );
  });
});

describe("getAvailablePowers", () => {
  it("gets available powers", () => {
    const polynomial = new Polynomial({
      0: new Complex(3, 6),
      10: new ComplexCircle(new Complex(1, 0), 2, 2000),
      4: new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000),
    });

    expect(polynomial.getAvailablePowers()).toEqual([1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15]);
  });
});

describe("getCoefficientsEllipseParameters", () => {
  it("gets coefficients ellipse parameters array", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    expect(polynomial.getCoefficientsEllipseParameters()).toEqual([
      ...coefficient0.getEllipseParameters(),
      ...coefficient1.getEllipseParameters(),
      ...coefficient2.getEllipseParameters(),
      ...Array(78).fill(0),
    ]);
  });
});

describe("fromJSON", () => {
  const coefficient0 = new Complex(1, 2).toJSON();
  const coefficient1 = new Complex(3, 4).toJSON();

  const negativePowerJson: any = {};
  negativePowerJson[-1] = coefficient0;

  const tooHighPowerJson: any = {};
  tooHighPowerJson[Polynomial.MAX_DEGREE + 1] = coefficient0;

  const testCases = [
    {
      description: "reads JSON correctly",
      json: { 0: coefficient0, 1: coefficient1 },
      output: new Polynomial({ 0: new Complex(1, 2), 1: new Complex(3, 4) }),
    },
    {
      description: "rejects JSON with invalid keys",
      json: { test: coefficient0 },
      output: undefined,
    },
    { description: "rejects JSON with invalid powers", json: tooHighPowerJson, output: undefined },
    { description: "rejects JSON with invalid powers", json: negativePowerJson, output: undefined },
    { description: "rejects JSON with invalid coefficients", json: { 0: "" }, output: undefined },
    {
      description: "rejects JSON with invalid coefficients",
      json: { 0: undefined },
      output: undefined,
    },
    { description: "does not accept undefined", json: undefined, output: undefined },
  ];

  testCases.forEach(({ description, json, output }) =>
    it(`${description}`, () => expect(Polynomial.fromJSON(json)).toEqual(output))
  );
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const coef0 = new Complex(3, 6);
    const coef1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coef2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const json = new Polynomial({ 0: coef0, 3: coef1, 6: coef2 }).toJSON();
    expect(json).toEqual({ 0: coef0.toJSON(), 3: coef1.toJSON(), 6: coef2.toJSON() });
  });
});

describe("toString", () => {
  it("properly returns a string representation of the polynomial", () => {
    expect(
      new Polynomial({
        0: new Complex(0, 0),
        1: new Complex(1, 0),
        2: new Complex(2, 0),
      }).toString()
    ).toBe("Polynomial(2z^2 + 1z + 0)");
  });

  it("properly returns a string representation of the polynomial when it is empty", () => {
    expect(new Polynomial({}).toString()).toBe("Polynomial(0)");
  });
});

describe("toMathML", () => {
  it("properly returns the corresponding mathML", () => {
    const coefficient0 = new Complex(-3, 0);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);
    const coefficient3 = new Complex(0, 0);

    const polynomial = new Polynomial({
      0: coefficient0,
      2: coefficient2,
      1: coefficient1,
      3: coefficient3,
    });

    expect(polynomial.toMathML()).toBe(
      `<mrow>${coefficient2.toMathML(
        2
      )}<msup><mi>z</mi><mn>2</mn></msup></mrow><mrow><mo>+</mo></mrow><mrow>${coefficient1.toMathML(
        1
      )}<mi>z</mi></mrow><mrow><mo>-</mo></mrow><mrow>${coefficient0.toMathML()}</mrow>`
    );
  });

  it("properly returns the corresponding mathML for empty polynomial", () => {
    const polynomial = new Polynomial({});

    expect(polynomial.toMathML()).toBe("<mrow><mn>0</mn></mrow>");
  });
});

describe("copy", () => {
  it("properly copies", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient1 = new ComplexCircle(new Complex(1, 0), 2, 2000);
    const coefficient2 = new ComplexLine(new Complex(3, 6), new Complex(4, 2), 2000);

    const polynomial = new Polynomial({ 0: coefficient0, 1: coefficient1, 2: coefficient2 });

    expect(polynomial.copy()).toEqual(polynomial);
    expect(polynomial.copy()).not.toBe(polynomial);
  });
});

describe("getRandomPolynomial", () => {
  it("properly returns a random polynomial", () => {
    const randomCoefficient = new Complex(2, 4);
    CoefficientUtils.getRandomCoefficient = vi.fn(() => randomCoefficient);
    RandomUtils.distinctIntegersBetween = vi.fn(() => [0, 1]);

    const coefficients = {} as RandomCoefficientParameters;
    const params = { coefficientsCount: 2, coefficients };

    const randomPolynomial = Polynomial.getRandomPolynomial(params);

    expect(RandomUtils.distinctIntegersBetween).toHaveBeenCalledWith(0, Polynomial.MAX_DEGREE, 2);
    expect(CoefficientUtils.getRandomCoefficient).toHaveBeenCalledWith(coefficients);
    expect(CoefficientUtils.getRandomCoefficient).toHaveBeenCalledTimes(2);

    expect(randomPolynomial).toEqual(
      new Polynomial({ 0: randomCoefficient, 1: randomCoefficient })
    );
  });
});
