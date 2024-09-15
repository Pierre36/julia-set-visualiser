import { describe, it, expect, vi } from "vitest";
import FractalFunction from "@/models/FractalFunction";
import Polynomial from "@/models/Polynomial";
import Complex from "@/models/Complex";
import ComplexCircle from "@/models/ComplexCircle";
import Coefficient from "@/models/Coefficient";
import RandomUtils from "@/utils/RandomUtils";
import FunctionTypes from "@/constants/FunctionTypes";
import CoefficientTypes from "@/constants/CoefficientTypes";

describe("constructor", () => {
  it("properly constructs default functions", () => {
    const numerator = new Polynomial({});
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.DEFAULT;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.numerator).toBe(numerator);
    expect(fractalFunction.denominator).toBe(denominator);
    expect(fractalFunction.functionType).toBe(functionType);
    expect(fractalFunction.newtonCoefficient).toBe(newtonCoefficient);
  });

  it("properly constructs newton functions", () => {
    const coefficient0 = new Complex(3, 6);
    const coefficient2 = new Complex(4, 2);
    const numerator = new Polynomial({ 0: coefficient0, 2: coefficient2 });
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.NEWTON;
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.numerator).toBe(numerator);
    expect(fractalFunction.denominator).toBe(denominator);
    expect(fractalFunction.functionType).toBe(functionType);
    expect(fractalFunction.newtonCoefficient).toBe(newtonCoefficient);
  });
});

describe("fromJSON", () => {
  it("properly constructs from JSON", () => {
    const numerator = new Polynomial({});
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.DEFAULT;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = FractalFunction.fromJSON({
      numerator: numerator.toJSON(),
      denominator: denominator.toJSON(),
      functionType: functionType,
      newtonCoefficient: Coefficient.toJSON(newtonCoefficient),
    });

    expect(fractalFunction).toEqual(
      new FractalFunction(numerator, denominator, functionType, newtonCoefficient)
    );
  });
});

describe("toJSON", () => {
  it("properly exports to JSON", () => {
    const numerator = new Polynomial({});
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.DEFAULT;
    const newtonCoefficient = new Complex(0, 0);

    const json = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    ).toJSON();

    expect(json).toEqual({
      numerator: numerator.toJSON(),
      denominator: denominator.toJSON(),
      functionType: functionType,
      newtonCoefficient: Coefficient.toJSON(newtonCoefficient),
    });
  });
});

describe("getCoefficient", () => {
  it("properly gets coefficients from numerator", () => {
    const coefficient = new Complex(3, 6);
    const numerator = new Polynomial({ 1: coefficient });
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.DEFAULT;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.getCoefficient(1, true)).toEqual(coefficient);
  });

  it("properly gets coefficients from denominator", () => {
    const coefficient = new Complex(3, 6);
    const numerator = new Polynomial({});
    const denominator = new Polynomial({ 1: coefficient });
    const functionType = FunctionTypes.DEFAULT;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.getCoefficient(1, false)).toEqual(coefficient);
  });
});

describe("setCoefficient", () => {
  it("properly sets coefficients in numerator", () => {
    const numerator = new Polynomial({});
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.DEFAULT;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    const coefficient = new Complex(3, 6);
    fractalFunction.setCoefficient(2, true, coefficient);

    expect(fractalFunction).toEqual(
      new FractalFunction(
        new Polynomial({ 2: coefficient }),
        denominator,
        functionType,
        newtonCoefficient
      )
    );
  });

  it("properly throws errors when setting coefficients in the denominator for DEFAULT and NEWTON", () => {
    const fractalFunction = new FractalFunction(
      new Polynomial({}),
      new Polynomial({}),
      FunctionTypes.DEFAULT,
      new Complex(0, 0)
    );

    expect(() => fractalFunction.setCoefficient(2, false, new Complex(3, 6))).toThrowError();
  });

  it("properly sets coefficients in numerator in Newton function", () => {
    const numerator = new Polynomial({});
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.NEWTON;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    const coefficient = new Complex(3, 6);
    fractalFunction.setCoefficient(2, true, coefficient);

    expect(fractalFunction).toEqual(
      new FractalFunction(
        new Polynomial({ 2: coefficient }),
        new Polynomial({ 1: coefficient.multipliedBy(2) }),
        functionType,
        newtonCoefficient
      )
    );
  });

  it("properly sets coefficients in numerator in Newton function wth power 0", () => {
    const numerator = new Polynomial({});
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.NEWTON;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    const coefficient = new Complex(3, 6);
    fractalFunction.setCoefficient(0, true, coefficient);

    expect(fractalFunction).toEqual(
      new FractalFunction(
        new Polynomial({ 0: coefficient }),
        new Polynomial({}),
        functionType,
        newtonCoefficient
      )
    );
  });

  it("properly sets coefficients in denominator in fraction function", () => {
    const numerator = new Polynomial({});
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.FRACTION;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    const coefficient = new Complex(3, 6);
    fractalFunction.setCoefficient(2, false, coefficient);

    expect(fractalFunction).toEqual(
      new FractalFunction(
        numerator,
        new Polynomial({ 2: coefficient }),
        functionType,
        newtonCoefficient
      )
    );
  });
});

describe("removeCoefficient", () => {
  it("properly removes coefficients in numerator", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.DEFAULT;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    fractalFunction.removeCoefficient(2, true);

    expect(fractalFunction).toEqual(
      new FractalFunction(new Polynomial({}), denominator, functionType, newtonCoefficient)
    );
  });

  it("properly throws errors when removing coefficients from the denominator for DEFAULT and NEWTON", () => {
    const fractalFunction = new FractalFunction(
      new Polynomial({}),
      new Polynomial({}),
      FunctionTypes.DEFAULT,
      new Complex(0, 0)
    );

    expect(() => fractalFunction.removeCoefficient(2, false)).toThrowError();
  });

  it("properly removes coefficients from numerator in Newton function", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = FunctionTypes.NEWTON;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    fractalFunction.removeCoefficient(2, true);

    expect(fractalFunction).toEqual(
      new FractalFunction(new Polynomial({}), new Polynomial({}), functionType, newtonCoefficient)
    );
  });

  it("properly removes coefficients from numerator in Newton function with power 0", () => {
    const numerator = new Polynomial({ 0: new Complex(3, 6) });
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.NEWTON;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    fractalFunction.removeCoefficient(0, true);

    expect(fractalFunction).toEqual(
      new FractalFunction(new Polynomial({}), new Polynomial({}), functionType, newtonCoefficient)
    );
  });

  it("properly removes coefficients in denominator of fraction function", () => {
    const numerator = new Polynomial({});
    const denominator = new Polynomial({ 2: new Complex(3, 6) });
    const functionType = FunctionTypes.FRACTION;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    fractalFunction.removeCoefficient(2, false);

    expect(fractalFunction).toEqual(
      new FractalFunction(numerator, new Polynomial({}), functionType, newtonCoefficient)
    );
  });
});

describe("setFunctionType", () => {
  it("properly sets the function type from DEFAULT to NEWTON", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.DEFAULT;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    fractalFunction.setFunctionType(FunctionTypes.NEWTON);

    expect(fractalFunction).toEqual(
      new FractalFunction(
        numerator,
        new Polynomial({ 1: new Complex(6, 12) }),
        FunctionTypes.NEWTON,
        new Complex(1, 0)
      )
    );
  });

  it("properly sets the function type from NEWTON to DEFAULT", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = FunctionTypes.NEWTON;
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    fractalFunction.setFunctionType(FunctionTypes.DEFAULT);

    expect(fractalFunction).toEqual(
      new FractalFunction(
        numerator,
        new Polynomial({ 0: new Complex(1, 0) }),
        FunctionTypes.DEFAULT,
        new Complex(0, 0)
      )
    );
  });
});

describe("setNewtonCoefficient", () => {
  it("properly sets the newton coefficient on default function", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.DEFAULT;
    const newtonCoefficient = new Complex(0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    const newNewtonCoefficient = new Complex(2, 0);
    fractalFunction.setNewtonCoefficient(newNewtonCoefficient);

    expect(fractalFunction).toEqual(
      new FractalFunction(numerator, denominator, FunctionTypes.DEFAULT, newNewtonCoefficient)
    );
  });

  it("properly sets the newton coefficient on Newton function", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = FunctionTypes.NEWTON;
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    const newNewtonCoefficient = new Complex(2, 0);
    fractalFunction.setNewtonCoefficient(newNewtonCoefficient);

    expect(fractalFunction).toEqual(
      new FractalFunction(numerator, denominator, FunctionTypes.NEWTON, newNewtonCoefficient)
    );
  });
});

describe("copy", () => {
  it("properly copies", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = FunctionTypes.NEWTON;
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    expect(fractalFunction.copy()).toEqual(fractalFunction);
    expect(fractalFunction.copy()).not.toBe(fractalFunction);
  });
});

describe("toMathML", () => {
  it("properly returns the mathML string for default function", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({});
    const functionType = FunctionTypes.DEFAULT;
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    let expectedMathML =
      "<math display='block'><mrow><mn>∀</mn><mo>z</mo><mo>∈</mo><mi>ℂ</mi><mo separator='true'>,</mo><mspace width='1em'/></mrow><mrow><mi>f</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
    expectedMathML += numerator.toMathML();
    expectedMathML += "</math>";
    expect(fractalFunction.toMathML()).toBe(expectedMathML);
  });

  it("properly returns the mathML string for Newton function with constant positive Newton coefficient", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = FunctionTypes.NEWTON;
    const newtonCoefficient = new Complex(3, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    let expectedMathML =
      "<math display='block'><mrow><mn>∀</mn><mo>z</mo><mo>∈</mo><mi>ℂ</mi><mo separator='true'>,</mo><mspace width='1em'/></mrow><mrow><mi>f</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
    expectedMathML += "<mi>z</mi><mo>-</mo>";
    expectedMathML += newtonCoefficient.toMathML();
    expectedMathML +=
      "<mfrac><mrow><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow><mrow><msup><mi>P</mi><mo lspace='0em' rspace='0em' class='tml-prime'>′</mo></msup><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow></mfrac>";
    expectedMathML += "</math>";
    expectedMathML +=
      "<math display='block'><mrow><mtext>with</mtext><mspace width='0.5em'/><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
    expectedMathML += numerator.toMathML();
    expectedMathML += "</math>";
    expect(fractalFunction.toMathML()).toBe(expectedMathML);
  });

  it("properly returns the mathML string for Newton function with constant negative Newton coefficient", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = FunctionTypes.NEWTON;
    const newtonCoefficient = new Complex(-6, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    let expectedMathML =
      "<math display='block'><mrow><mn>∀</mn><mo>z</mo><mo>∈</mo><mi>ℂ</mi><mo separator='true'>,</mo><mspace width='1em'/></mrow><mrow><mi>f</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
    expectedMathML += "<mi>z</mi><mo>+</mo>";
    expectedMathML += newtonCoefficient.toMathML();
    expectedMathML +=
      "<mfrac><mrow><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow><mrow><msup><mi>P</mi><mo lspace='0em' rspace='0em' class='tml-prime'>′</mo></msup><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow></mfrac>";
    expectedMathML += "</math>";
    expectedMathML +=
      "<math display='block'><mrow><mtext>with</mtext><mspace width='0.5em'/><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
    expectedMathML += numerator.toMathML();
    expectedMathML += "</math>";
    expect(fractalFunction.toMathML()).toBe(expectedMathML);
  });

  it("properly returns the mathML string for Newton function with non constant Newton coefficient", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = FunctionTypes.NEWTON;
    const newtonCoefficient = new ComplexCircle(new Complex(0, 0), 0, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    let expectedMathML =
      "<math display='block'><mrow><mn>∀</mn><mo>z</mo><mo>∈</mo><mi>ℂ</mi><mo separator='true'>,</mo><mspace width='1em'/></mrow><mrow><mi>f</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
    expectedMathML += "<mi>z</mi><mo>-</mo>";
    expectedMathML += newtonCoefficient.toMathML("N");
    expectedMathML +=
      "<mfrac><mrow><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow><mrow><msup><mi>P</mi><mo lspace='0em' rspace='0em' class='tml-prime'>′</mo></msup><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow></mfrac>";
    expectedMathML += "</math>";
    expectedMathML +=
      "<math display='block'><mrow><mtext>with</mtext><mspace width='0.5em'/><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
    expectedMathML += numerator.toMathML();
    expectedMathML += "</math>";
    expect(fractalFunction.toMathML()).toBe(expectedMathML);
  });

  it("properly returns the mathML string for fraction function", () => {
    const numerator = new Polynomial({ 2: new Complex(3, 6) });
    const denominator = new Polynomial({ 1: new Complex(6, 12) });
    const functionType = FunctionTypes.FRACTION;
    const newtonCoefficient = new Complex(1, 0);

    const fractalFunction = new FractalFunction(
      numerator,
      denominator,
      functionType,
      newtonCoefficient
    );

    let expectedMathML =
      "<math display='block'><mrow><mn>∀</mn><mo>z</mo><mo>∈</mo><mi>ℂ</mi><mo separator='true'>,</mo><mspace width='1em'/></mrow><mrow><mi>f</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
    expectedMathML +=
      "<mfrac><mrow><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow><mrow><mi>Q</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo></mrow></mfrac>";
    expectedMathML += "</math>";
    expectedMathML +=
      "<math display='block'><mrow><mtext>with</mtext><mspace width='0.5em'/><mi>P</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
    expectedMathML += numerator.toMathML();
    expectedMathML += "</math>";
    expectedMathML +=
      "<math display='block'><mrow><mtext>and</mtext><mspace width='0.5em'/><mi>Q</mi><mo form='prefix' stretchy='false'>(</mo><mi>z</mi><mo form='postfix' stretchy='false'>)</mo><mo>=</mo></mrow>";
    expectedMathML += denominator.toMathML();
    expectedMathML += "</math>";
    expect(fractalFunction.toMathML()).toBe(expectedMathML);
  });
});

describe("getRandomFractalFunction", () => {
  it("properly returns a random fractal function for default function type", () => {
    RandomUtils.pickAmong = vi.fn(() => FunctionTypes.DEFAULT as any);
    const randomCoefficient = new Complex(2, 4);
    Coefficient.getRandomCoefficient = vi.fn(() => randomCoefficient);
    RandomUtils.integerBetween = vi.fn((min, _) => min);
    const randomPolynomial = new Polynomial({ 3: new Complex(6, 0) });
    Polynomial.getRandomPolynomial = vi.fn(() => randomPolynomial);

    const functionTypes = new Set([FunctionTypes.DEFAULT, FunctionTypes.FRACTION]);
    const coefficientTypes = new Set([CoefficientTypes.CIRCLE, CoefficientTypes.CIRCLE]);
    const nbCoefficientsMinMax = { min: 0, max: 1 };
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

    const randomFractalFunction = FractalFunction.getRandomFractalFunction(
      functionTypes,
      coefficientTypes,
      nbCoefficientsMinMax,
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

    expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(functionTypes));
    expect(Coefficient.getRandomCoefficient).toHaveBeenCalledWith(
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
    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(
      nbCoefficientsMinMax.min,
      nbCoefficientsMinMax.max
    );
    expect(Polynomial.getRandomPolynomial).toHaveBeenCalledWith(
      nbCoefficientsMinMax.min,
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

    expect(randomFractalFunction).toEqual(
      new FractalFunction(
        randomPolynomial,
        new Polynomial({ 0: new Complex(1, 0) }),
        FunctionTypes.DEFAULT,
        randomCoefficient
      )
    );
  });

  it("properly returns a random fractal function for newton function type", () => {
    RandomUtils.pickAmong = vi.fn(() => FunctionTypes.NEWTON as any);
    const randomCoefficient = new Complex(2, 4);
    Coefficient.getRandomCoefficient = vi.fn(() => randomCoefficient);
    RandomUtils.integerBetween = vi.fn((min, _) => min);
    const randomPolynomial = new Polynomial({ 3: new Complex(6, 0) });
    Polynomial.getRandomPolynomial = vi.fn(() => randomPolynomial);

    const functionTypes = new Set([FunctionTypes.DEFAULT, FunctionTypes.FRACTION]);
    const coefficientTypes = new Set([CoefficientTypes.CIRCLE, CoefficientTypes.CIRCLE]);
    const nbCoefficientsMinMax = { min: 0, max: 1 };
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

    const randomFractalFunction = FractalFunction.getRandomFractalFunction(
      functionTypes,
      coefficientTypes,
      nbCoefficientsMinMax,
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

    expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(functionTypes));
    expect(Coefficient.getRandomCoefficient).toHaveBeenCalledWith(
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
    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(
      nbCoefficientsMinMax.min,
      nbCoefficientsMinMax.max
    );
    expect(Polynomial.getRandomPolynomial).toHaveBeenCalledWith(
      nbCoefficientsMinMax.min,
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

    expect(randomFractalFunction).toEqual(
      new FractalFunction(
        randomPolynomial,
        randomPolynomial.getDerivative(),
        FunctionTypes.NEWTON,
        randomCoefficient
      )
    );
  });

  it("properly returns a random fractal function for default function type", () => {
    RandomUtils.pickAmong = vi.fn(() => FunctionTypes.FRACTION as any);
    const randomCoefficient = new Complex(2, 4);
    Coefficient.getRandomCoefficient = vi.fn(() => randomCoefficient);
    RandomUtils.integerBetween = vi.fn((min, _) => min);
    const randomPolynomial = new Polynomial({ 3: new Complex(6, 0) });
    Polynomial.getRandomPolynomial = vi.fn(() => randomPolynomial);

    const functionTypes = new Set([FunctionTypes.DEFAULT, FunctionTypes.FRACTION]);
    const coefficientTypes = new Set([CoefficientTypes.CIRCLE, CoefficientTypes.CIRCLE]);
    const nbCoefficientsMinMax = { min: 0, max: 1 };
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

    const randomFractalFunction = FractalFunction.getRandomFractalFunction(
      functionTypes,
      coefficientTypes,
      nbCoefficientsMinMax,
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

    expect(RandomUtils.pickAmong).toHaveBeenCalledWith(Array.from(functionTypes));
    expect(Coefficient.getRandomCoefficient).toHaveBeenCalledWith(
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
    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(
      nbCoefficientsMinMax.min,
      nbCoefficientsMinMax.max
    );
    expect(RandomUtils.integerBetween).toHaveBeenCalledWith(1, nbCoefficientsMinMax.min);
    expect(Polynomial.getRandomPolynomial).toHaveBeenCalledWith(
      nbCoefficientsMinMax.min,
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
    expect(Polynomial.getRandomPolynomial).toHaveBeenCalledTimes(2);

    expect(randomFractalFunction).toEqual(
      new FractalFunction(
        randomPolynomial,
        randomPolynomial,
        FunctionTypes.FRACTION,
        randomCoefficient
      )
    );
  });
});

describe("toString", () => {
  it("properly returns a string representation of the fractal function", () => {
    expect(
      new FractalFunction(
        new Polynomial({}),
        new Polynomial({}),
        FunctionTypes.DEFAULT,
        new Complex(1, 0)
      ).toString()
    ).toBe("FractalFunction(Polynomial(0), Polynomial(0), DEFAULT, 1)");
  });
});
