import { describe, it, expect, vi } from "vitest";
import FractalFunction from "@/models/FractalFunction";
import Polynomial from "@/models/Polynomial";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import CoefficientUtils, { type RandomCoefficientParameters } from "@/models/CoefficientUtils";
import RandomUtils from "@/utils/RandomUtils";
import FunctionTypes from "@/constants/FunctionTypes";

describe("constructor", () => {
  const numeratorCoefficient = new Complex(3, 6);
  const denominatorCoefficient = new Complex(4, 2);

  const numerator = new Polynomial({ 1: numeratorCoefficient });
  const denominator = new Polynomial({ 1: denominatorCoefficient });

  const newtonCoefficient = new Complex(1, 6);

  const testCases = [
    {
      type: FunctionTypes.DEFAULT,
      expectedNumerator: numerator.getCoefficients(),
      expectedDenominator: [{ power: 0, coefficient: new Complex(1, 0) }],
    },
    {
      type: FunctionTypes.NEWTON,
      expectedNumerator: numerator.getCoefficients(),
      expectedDenominator: numerator.getDerivative().getCoefficients(),
    },
    {
      type: FunctionTypes.FRACTION,
      expectedNumerator: numerator.getCoefficients(),
      expectedDenominator: denominator.getCoefficients(),
    },
  ];

  testCases.forEach(({ type, expectedNumerator, expectedDenominator }) =>
    it(`constructs ${type} fractal functions correctly`, () => {
      const fractalFunction = new FractalFunction(numerator, type, denominator, newtonCoefficient);

      expect(fractalFunction.getNumeratorCoefficients()).toEqual(expectedNumerator);
      expect(fractalFunction.getDenominatorCoefficients()).toEqual(expectedDenominator);
      expect(fractalFunction.getFunctionType()).toEqual(type);
      expect(fractalFunction.newtonCoefficient).toEqual(newtonCoefficient);
    })
  );
});

describe("getNumeratorCoefficients", () => {
  it("gets the numerator coefficients", () => {
    const numerator = new Polynomial({ 0: new Complex(3, 6) });
    const fractalFunction = new FractalFunction(numerator, FunctionTypes.DEFAULT);

    expect(fractalFunction.getNumeratorCoefficients()).toEqual(numerator.getCoefficients());
  });
});

describe("getDenominatorCoefficients", () => {
  it("gets the denominator coefficients", () => {
    const denominator = new Polynomial({ 0: new Complex(3, 6) });
    const fractalFunction = new FractalFunction(
      new Polynomial({}),
      FunctionTypes.FRACTION,
      denominator
    );

    expect(fractalFunction.getDenominatorCoefficients()).toEqual(denominator.getCoefficients());
  });
});

describe("getCoefficient", () => {
  const numerator = new Polynomial({ 1: new Complex(3, 6) });
  const denominator = new Polynomial({ 2: new Complex(4, 2) });
  const functionType = FunctionTypes.FRACTION;

  const fractalFunction = new FractalFunction(numerator, functionType, denominator);

  it("gets coefficients from numerator correctly", () => {
    expect(fractalFunction.getCoefficient(1, true)).toEqual(new Complex(3, 6));
  });

  it("gets coefficients from denominator correctly", () => {
    expect(fractalFunction.getCoefficient(2, false)).toEqual(new Complex(4, 2));
  });
});

describe("setCoefficient", () => {
  const numeratorCoefficient = new Complex(3, 6);
  const denominatorCoefficient = new Complex(4, 2);
  const newCoefficient = new Complex(1, 6);

  const testCases = [
    {
      type: FunctionTypes.DEFAULT,
      power: 1,
      inNumerator: true,
      expectedFunction: new FractalFunction(
        new Polynomial({ 1: newCoefficient }),
        FunctionTypes.DEFAULT
      ),
    },
    {
      type: FunctionTypes.DEFAULT,
      power: 1,
      inNumerator: false,
      expectedFunction: new FractalFunction(
        new Polynomial({ 1: numeratorCoefficient }),
        FunctionTypes.DEFAULT
      ),
    },
    {
      type: FunctionTypes.NEWTON,
      power: 1,
      inNumerator: true,
      expectedFunction: new FractalFunction(
        new Polynomial({ 1: newCoefficient }),
        FunctionTypes.NEWTON
      ),
    },
    {
      type: FunctionTypes.NEWTON,
      power: 0,
      inNumerator: true,
      expectedFunction: new FractalFunction(
        new Polynomial({ 0: newCoefficient, 1: numeratorCoefficient }),
        FunctionTypes.NEWTON
      ),
    },
    {
      type: FunctionTypes.FRACTION,
      power: 1,
      inNumerator: false,
      expectedFunction: new FractalFunction(
        new Polynomial({ 1: numeratorCoefficient }),
        FunctionTypes.FRACTION,
        new Polynomial({ 1: newCoefficient })
      ),
    },
  ];

  testCases.forEach(({ type, power, inNumerator, expectedFunction }) =>
    it(`sets ${
      inNumerator ? "numerator" : "denominator"
    } coefficients in ${type} function at power ${power} correctly`, () => {
      const fractalFunction = new FractalFunction(
        new Polynomial({ 1: numeratorCoefficient }),
        type,
        new Polynomial({ 1: denominatorCoefficient })
      );

      fractalFunction.setCoefficient(power, newCoefficient, inNumerator);

      expect(fractalFunction).toEqual(expectedFunction);
    })
  );
});

describe("removeCoefficient", () => {
  const numeratorCoefficient = new Complex(3, 6);
  const denominatorCoefficient = new Complex(4, 2);

  const testCases = [
    {
      type: FunctionTypes.DEFAULT,
      power: 1,
      inNumerator: true,
      expectedFunction: new FractalFunction(new Polynomial({}), FunctionTypes.DEFAULT),
    },
    {
      type: FunctionTypes.DEFAULT,
      power: 1,
      inNumerator: false,
      expectedFunction: new FractalFunction(
        new Polynomial({ 1: numeratorCoefficient }),
        FunctionTypes.DEFAULT
      ),
    },
    {
      type: FunctionTypes.NEWTON,
      power: 1,
      inNumerator: true,
      expectedFunction: new FractalFunction(new Polynomial({}), FunctionTypes.NEWTON),
    },
    {
      type: FunctionTypes.NEWTON,
      power: 0,
      inNumerator: true,
      expectedFunction: new FractalFunction(
        new Polynomial({ 1: numeratorCoefficient }),
        FunctionTypes.NEWTON
      ),
    },
    {
      type: FunctionTypes.FRACTION,
      power: 1,
      inNumerator: false,
      expectedFunction: new FractalFunction(
        new Polynomial({ 1: numeratorCoefficient }),
        FunctionTypes.FRACTION,
        new Polynomial({})
      ),
    },
  ];

  testCases.forEach(({ type, power, inNumerator, expectedFunction }) =>
    it(`removes ${
      inNumerator ? "numerator" : "denominator"
    } coefficients in ${type} function at power ${power} correctly`, () => {
      const fractalFunction = new FractalFunction(
        new Polynomial({ 1: numeratorCoefficient }),
        type,
        new Polynomial({ 1: denominatorCoefficient })
      );

      fractalFunction.removeCoefficient(power, inNumerator);

      expect(fractalFunction).toEqual(expectedFunction);
    })
  );
});

describe("getNumeratorAvailablePowers", () => {
  it("gets the numerator available powers", () => {
    const numerator = new Polynomial({ 0: new Complex(3, 6) });
    const fractalFunction = new FractalFunction(numerator, FunctionTypes.DEFAULT);

    expect(fractalFunction.getNumeratorAvailablePowers()).toEqual(numerator.getAvailablePowers());
  });
});

describe("getDenominatorAvailablePowers", () => {
  it("gets the denominator available powers", () => {
    const denominator = new Polynomial({ 0: new Complex(3, 6) });
    const fractalFunction = new FractalFunction(
      new Polynomial({}),
      FunctionTypes.FRACTION,
      denominator
    );

    expect(fractalFunction.getDenominatorAvailablePowers()).toEqual(
      denominator.getAvailablePowers()
    );
  });
});

describe("getNumeratorCoefficientsEllipseParameters", () => {
  it("gets the numerator coefficients ellipse parameters", () => {
    const numerator = new Polynomial({ 0: new Complex(3, 6) });
    const fractalFunction = new FractalFunction(numerator, FunctionTypes.DEFAULT);

    expect(fractalFunction.getNumeratorCoefficientsEllipseParameters()).toEqual(
      numerator.getCoefficientsEllipseParameters()
    );
  });
});

describe("getDenominatorCoefficientsEllipseParameters", () => {
  it("gets the denominator coefficients ellipse parameters", () => {
    const denominator = new Polynomial({ 0: new Complex(3, 6) });
    const fractalFunction = new FractalFunction(
      new Polynomial({}),
      FunctionTypes.FRACTION,
      denominator
    );

    expect(fractalFunction.getDenominatorCoefficientsEllipseParameters()).toEqual(
      denominator.getCoefficientsEllipseParameters()
    );
  });
});

describe("getFunctionType", () => {
  it("returns the function type", () =>
    expect(new FractalFunction(new Polynomial({}), FunctionTypes.NEWTON).getFunctionType()).toEqual(
      FunctionTypes.NEWTON
    ));
});

describe("setFunctionType", () => {
  const numerator = new Polynomial({ 2: new Complex(3, 6) });
  const denominator = new Polynomial({ 1: new Complex(6, 12) });

  const testCases = [
    {
      oldType: FunctionTypes.DEFAULT,
      newType: FunctionTypes.NEWTON,
      expectedFunction: new FractalFunction(
        numerator,
        FunctionTypes.NEWTON,
        new Polynomial({ 1: new Complex(6, 12) }),
        new Complex(1, 0)
      ),
    },
    {
      oldType: FunctionTypes.NEWTON,
      newType: FunctionTypes.DEFAULT,
      expectedFunction: new FractalFunction(numerator, FunctionTypes.DEFAULT),
    },
  ];

  testCases.forEach(({ oldType, newType, expectedFunction }) =>
    it(`changes function type from ${oldType} to ${newType} correctly`, () => {
      const fractalFunction = new FractalFunction(numerator, oldType, denominator);

      fractalFunction.setFunctionType(newType);

      expect(fractalFunction).toEqual(expectedFunction);
    })
  );
});

describe("fromJSON", () => {
  const numerator = new Polynomial({ 3: new Complex(3, 6) }).toJSON();
  const denominator = new Polynomial({ 6: new Complex(4, 2) }).toJSON();
  const functionType = FunctionTypes.FRACTION;
  const newtonCoefficient = new Complex(1, 6).toJSON();

  const testCases = [
    {
      description: "reads JSON correctly",
      json: { numerator, denominator, functionType, newtonCoefficient },
      output: new FractalFunction(
        new Polynomial({ 3: new Complex(3, 6) }),
        functionType,
        new Polynomial({ 6: new Complex(4, 2) }),
        new Complex(1, 6)
      ),
    },
    {
      description: "rejects JSON missing numerator",
      json: { denominator, functionType, newtonCoefficient },
      output: undefined,
    },
    {
      description: "rejects JSON missing denominator",
      json: { numerator, functionType, newtonCoefficient },
      output: undefined,
    },
    {
      description: "rejects JSON missing function type",
      json: { numerator, denominator, newtonCoefficient },
      output: undefined,
    },
    {
      description: "rejects JSON missing newton coefficient",
      json: { numerator, denominator, newtonCoefficient },
      output: undefined,
    },
    {
      description: "rejects JSON with invalid numerator",
      json: { numerator: { invalid: "" }, denominator, functionType, newtonCoefficient },
      output: undefined,
    },
    {
      description: "rejects JSON with invalid denominator",
      json: { numerator, denominator: { invalid: "" }, functionType, newtonCoefficient },
      output: undefined,
    },
    {
      description: "rejects JSON with invalid function type",
      json: { numerator, denominator, functionType: "", newtonCoefficient },
      output: undefined,
    },
    {
      description: "rejects JSON with invalid newton coefficient",
      json: { numerator, denominator, functionType, newtonCoefficient: "" },
      output: undefined,
    },
    { description: "does not accept undefined", json: undefined, output: undefined },
  ];

  testCases.forEach(({ description, json, output }) =>
    it(`${description}`, () => expect(FractalFunction.fromJSON(json)).toEqual(output))
  );
});

describe("toJSON", () => {
  it("converts to JSON correctly", () => {
    const numerator = new Polynomial({ 3: new Complex(3, 6) });
    const denominator = new Polynomial({ 6: new Complex(4, 2) });
    const functionType = FunctionTypes.FRACTION;
    const newtonCoefficient = new Complex(1, 6);

    const json = new FractalFunction(
      numerator,
      functionType,
      denominator,
      newtonCoefficient
    ).toJSON();

    expect(json).toEqual({
      numerator: numerator.toJSON(),
      denominator: denominator.toJSON(),
      functionType: functionType,
      newtonCoefficient: newtonCoefficient.toJSON(),
    });
  });
});

describe("toString", () => {
  it("returns a string representation of the fractal function", () => {
    expect(
      new FractalFunction(
        new Polynomial({}),
        FunctionTypes.FRACTION,
        new Polynomial({}),
        new Complex(1, 0)
      ).toString()
    ).toBe("FractalFunction(Polynomial(0), Polynomial(0), FRACTION, 1)");
  });
});

describe("toMathML", () => {
  const numerator = new Polynomial({ 2: new Complex(3, 6) });
  const denominator = new Polynomial({ 1: new Complex(6, 12) });

  const positiveConstant = new Complex(3, 0);
  const negativeConstant = new Complex(-6, 0);
  const nonConstant = new ComplexCircle(new Complex(0, 0), 0, 0);

  const prefix =
    "<math display='block'><mrow><mn>∀</mn><mo>z</mo><mo>∈</mo><mi>ℂ</mi><mo separator='true'>,</mo><mspace width='1em'/></mrow><mrow><mi>f</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
  const pEqual =
    "<mfrac><mrow><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow><mrow><msup><mi>P</mi><mo lspace='0em' rspace='0em' class='tml-prime'>′</mo></msup><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow></mfrac>";
  const withText =
    "<math display='block'><mrow><mtext>with</mtext><mspace width='0.5em'/><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
  const pOverQ =
    "<mfrac><mrow><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow><mrow><mi>Q</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow></mfrac>";
  const qEqual =
    "<math display='block'><mrow><mtext>and</mtext><mspace width='0.5em'/><mi>Q</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";

  const defaultMathML = `${prefix}${numerator.toMathML()}</math>`;
  const positiveNewtonMathML = `${prefix}<mi>z</mi><mo>-</mo>${positiveConstant.toMathML()}${pEqual}</math>${withText}${numerator.toMathML()}</math>`;
  const negativeNewtonMathML = `${prefix}<mi>z</mi><mo>+</mo>${negativeConstant.toMathML()}${pEqual}</math>${withText}${numerator.toMathML()}</math>`;
  const nonConstantNewtonMathML = `${prefix}<mi>z</mi><mo>-</mo>${nonConstant.toMathML(
    "N"
  )}${pEqual}</math>${withText}${numerator.toMathML()}</math>`;
  const fractionMathML = `${prefix}${pOverQ}</math>${withText}${numerator.toMathML()}</math>${qEqual}${denominator.toMathML()}</math>`;

  const testCases = [
    {
      functionDescription: "default function",
      fractalFunction: new FractalFunction(numerator, FunctionTypes.DEFAULT),
      mathML: defaultMathML,
    },
    {
      functionDescription: "Newton function with constant positive Newton coefficient",
      fractalFunction: new FractalFunction(
        numerator,
        FunctionTypes.NEWTON,
        undefined,
        positiveConstant
      ),
      mathML: positiveNewtonMathML,
    },
    {
      functionDescription: "Newton function with constant negative Newton coefficient",
      fractalFunction: new FractalFunction(
        numerator,
        FunctionTypes.NEWTON,
        undefined,
        negativeConstant
      ),
      mathML: negativeNewtonMathML,
    },
    {
      functionDescription: "Newton function with non constant Newton coefficient",
      fractalFunction: new FractalFunction(numerator, FunctionTypes.NEWTON, undefined, nonConstant),
      mathML: nonConstantNewtonMathML,
    },
    {
      functionDescription: "fraction function",
      fractalFunction: new FractalFunction(numerator, FunctionTypes.FRACTION, denominator),
      mathML: fractionMathML,
    },
  ];

  testCases.forEach(({ functionDescription, fractalFunction, mathML }) =>
    it(`returns the correct mathML string for ${functionDescription}`, () =>
      expect(fractalFunction.toMathML()).toBe(mathML))
  );
});

describe("copy", () => {
  it("creates a copy", () => {
    const fractalFunction = new FractalFunction(
      new Polynomial({ 2: new Complex(3, 6) }),
      FunctionTypes.NEWTON,
      new Polynomial({ 1: new Complex(6, 12) }),
      new Complex(1, 0)
    );

    expect(fractalFunction.copy()).toEqual(fractalFunction);
    expect(fractalFunction.copy()).not.toBe(fractalFunction);
  });
});

describe("getRandomFractalFunction", () => {
  const randomCoefficient = new Complex(2, 4);
  const randomPolynomial = new Polynomial({ 3: new Complex(6, 0) });

  const functionTypes = new Set([
    FunctionTypes.DEFAULT,
    FunctionTypes.FRACTION,
    FunctionTypes.NEWTON,
  ]);
  const minCoefficientsCount = 3;
  const maxCoefficientsCount = 6;
  const coefficientsParameters = {} as RandomCoefficientParameters;

  const testCases = [
    {
      type: FunctionTypes.DEFAULT,
      expectedFunction: new FractalFunction(
        randomPolynomial,
        FunctionTypes.DEFAULT,
        new Polynomial({ 0: new Complex(1, 0) }),
        randomCoefficient
      ),
    },
    {
      type: FunctionTypes.FRACTION,
      expectedFunction: new FractalFunction(
        randomPolynomial,
        FunctionTypes.FRACTION,
        randomPolynomial,
        randomCoefficient
      ),
    },
  ];

  testCases.forEach(({ type, expectedFunction }) =>
    it(``, () => {
      RandomUtils.pickAmong<FunctionTypes> = vi.fn(() => type);
      CoefficientUtils.getRandomCoefficient = vi.fn(() => randomCoefficient);
      RandomUtils.integerBetween = vi.fn((min, _) => min);
      Polynomial.getRandomPolynomial = vi.fn(() => randomPolynomial);

      const randomFractalFunction = FractalFunction.getRandomFractalFunction({
        functionTypes,
        minCoefficientsCount,
        maxCoefficientsCount,
        coefficientsParameters,
      });

      expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(functionTypes));
      expect(CoefficientUtils.getRandomCoefficient).toHaveBeenCalledWith(coefficientsParameters);
      expect(RandomUtils.integerBetween).toHaveBeenCalledWith(
        minCoefficientsCount,
        maxCoefficientsCount
      );

      if (type === FunctionTypes.FRACTION) {
        expect(RandomUtils.integerBetween).toHaveBeenCalledWith(1, minCoefficientsCount);

        expect(Polynomial.getRandomPolynomial).toHaveBeenCalledWith({
          coefficientsCount: 1,
          coefficientsParameters,
        });
        expect(Polynomial.getRandomPolynomial).toHaveBeenCalledWith({
          coefficientsCount: 2,
          coefficientsParameters,
        });
      } else {
        expect(Polynomial.getRandomPolynomial).toHaveBeenCalledWith({
          coefficientsCount: minCoefficientsCount,
          coefficientsParameters,
        });
      }

      expect(randomFractalFunction).toEqual(expectedFunction);
    })
  );
});
